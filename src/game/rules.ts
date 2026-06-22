import {
  buildDeck,
  createDeckFromCardIds,
  getCardDef,
  getCardName,
  getCardPool,
  getMonsterDef,
  isSummonableMonsterCard,
  summarizeDeckCardIds,
} from "./cards";
import { applyCpuDecision, chooseCpuDecision, type CpuAiOptions } from "./cpuAi";
import {
  DRAW_FIVE_HAND_SIZE,
  FIELD_ORDER,
  HAND_LIMIT,
  LANE_ORDER,
  MASTER_ATTACK_POWER,
  MASTER_HP,
  PLAYER_ORDER,
  PLAYER_SLOT_ORDER,
  ROW_ORDER,
} from "./ruleEngine/constants";
import {
  rangedDistanceBetweenSlots,
} from "./ruleEngine/field";
import { drillBreakPartnerSlotKey } from "./ruleEngine/drillBreak";
import { appendLog, appendRandomResultLog } from "./ruleEngine/log";
import {
  createDamageContext,
  levelUpCapacityForMonster,
  masterDamageByPower,
  previewMonsterDamage,
  type DamageContext,
} from "./ruleEngine/damage";
import { removeDefeatedMonster, type DefeatedMonster } from "./ruleEngine/defeat";
import { resolveLevelUpChoice } from "./ruleEngine/levelUp";
import { randomChance, randomInt, shuffle } from "./ruleEngine/random";
import { cloneState } from "./ruleEngine/state";
import {
  getCommandHandChoices as getCommandHandChoicesFromTargeting,
  getCommandSecondaryTargets as getCommandSecondaryTargetsFromTargeting,
  getCommandTargets as getCommandTargetsFromTargeting,
  getCommandTargetsUnchecked as getCommandTargetsUncheckedFromTargeting,
  getMagicHandChoices as getMagicHandChoicesFromTargeting,
  getMagicSearchCategories as getMagicSearchCategoriesFromTargeting,
  getMagicSecondaryTargets as getMagicSecondaryTargetsFromTargeting,
  getMagicTargets as getMagicTargetsFromTargeting,
  getMasterActionCost as getMasterActionCostFromTargeting,
  getMasterActionIdsForPlayer as getMasterActionIdsForPlayerFromTargeting,
  getMasterActionTargets as getMasterActionTargetsFromTargeting,
  isSameTarget as isSameTargetFromTargeting,
  targetToKey as targetToKeyFromTargeting,
} from "./ruleEngine/targeting";
import type {
  CardInstance,
  CommandAction,
  CommandDef,
  GameState,
  MagicAction,
  MasterActionId,
  MasterId,
  MonsterCardDef,
  MonsterState,
  PlayerState,
  PlayerId,
  Row,
  Lane,
  SlotKey,
  SlotState,
  SuperLevelUpOption,
  Target,
} from "./types";

export { FIELD_ORDER, PLAYER_SLOT_ORDER } from "./ruleEngine/constants";

export interface CreateInitialGameOptions {
  firstPlayer?: PlayerId;
  masterIds?: Partial<Record<PlayerId, MasterId>>;
  playerDeckCardIds?: string[];
  cpuDeckCardIds?: string[];
  allowSpecialDecks?: Partial<Record<PlayerId, boolean>>;
}

export function createInitialGame(seed = Date.now(), options: CreateInitialGameOptions = {}): GameState {
  const playerMasterId = options.masterIds?.player ?? "white";
  const cpuMasterId = options.masterIds?.cpu ?? "white";
  if (options.playerDeckCardIds) {
    ensureInitialDeckValid("プレイヤー", options.playerDeckCardIds, { allowSpecial: !!options.allowSpecialDecks?.player });
  }
  if (options.cpuDeckCardIds) {
    ensureInitialDeckValid("CPU", options.cpuDeckCardIds, { allowSpecial: !!options.allowSpecialDecks?.cpu });
  }

  const playerDeck = shuffle(
    options.playerDeckCardIds
      ? createDeckFromCardIds("player", options.playerDeckCardIds)
      : buildDeck("player", seed + 101, { masterId: playerMasterId }),
    seed + 1,
  );
  const cpuDeck = shuffle(
    options.cpuDeckCardIds
      ? createDeckFromCardIds("cpu", options.cpuDeckCardIds)
      : buildDeck("cpu", seed + 202, { masterId: cpuMasterId }),
    seed + 2,
  );
  const firstPlayer = options.firstPlayer ?? "player";
  const state: GameState = {
    players: {
      player: createPlayer("player", playerDeck, playerMasterId),
      cpu: createPlayer("cpu", cpuDeck, cpuMasterId),
    },
    slots: createSlots(),
    currentPlayer: firstPlayer,
    firstPlayer,
    turnNumber: 0,
    randomSeed: seed >>> 0,
    log: ["バトル開始"],
  };

  drawOpeningHand(state.players.player);
  drawOpeningHand(state.players.cpu);
  return startTurn(state, firstPlayer);
}

function ensureInitialDeckValid(label: string, cardIds: string[], options: { allowSpecial: boolean }): void {
  const summary = summarizeDeckCardIds(cardIds, [], options);
  if (!summary.valid) {
    throw new Error(`${label}の固定デッキが不正です: ${summary.errors.join(" / ")}`);
  }
}

export function startTurn(state: GameState, playerId: PlayerId): GameState {
  const next = cloneState(state);
  if (next.winner) {
    return next;
  }

  next.currentPlayer = playerId;
  if (playerId === next.firstPlayer) {
    next.turnNumber += 1;
  }

  const player = next.players[playerId];
  appendLog(next, `${playerLabel(playerId)}のターン開始`);
  clearExpiredMasterActionExchange(next, playerId);

  readyPreparedMonsters(next, playerId);
  autoAdvanceBackRow(next, playerId);
  resetMonsterActions(next, playerId);
  applyTurnStartTraits(next, playerId);

  player.stones += 3;
  appendLog(next, `${playerLabel(playerId)}はストーンを3個得た`);
  clearExpiredStartTurnEffects(next, playerId);

  const shouldDraw = !(playerId === next.firstPlayer && player.turnsStarted === 0);
  player.turnsStarted += 1;
  if (shouldDraw) {
    forceDraw(next, playerId, "ターン開始");
  } else {
    appendLog(next, "先攻1ターン目のため、カードは引かない");
  }

  return next;
}

export function endTurn(state: GameState): GameState {
  const next = cloneState(state);
  ensureActionAllowed(next);

  const playerId = next.currentPlayer;
  discardToHandLimit(next, playerId);
  resolveEndTurnFieldEffects(next, playerId);
  focusIdleMonsters(next, playerId);
  clearExpiredEndTurnEffects(next, playerId);
  clearEndOfTurnMarkers(next);

  if (next.winner) {
    return next;
  }
  return startTurn(next, opponentOf(playerId));
}

export function runCpuStep(state: GameState, aiOptions: CpuAiOptions = {}): GameState {
  const next = cloneState(state);
  if (next.currentPlayer !== "cpu" || next.winner || next.pendingLevelUp) {
    return next;
  }
  return applyCpuDecision(next, chooseCpuDecision(next, aiOptions));
}

export function runAutoStep(state: GameState, aiOptions: CpuAiOptions = {}): GameState {
  if (state.winner) {
    return cloneState(state);
  }
  if (state.pendingLevelUp) {
    return resolveLevelUp(
      state,
      state.pendingLevelUp.maxLevels,
      chooseSuperLevelUpOption(state, state.pendingLevelUp)?.handInstanceId,
    );
  }

  const next = cloneState(state);
  return applyCpuDecision(next, chooseCpuDecision(next, aiOptions));
}

export function summonMonster(
  state: GameState,
  handInstanceId: string,
  slotKey: SlotKey,
): GameState {
  const next = cloneState(state);
  ensureActionAllowed(next);

  const player = next.players[next.currentPlayer];
  const handIndex = player.hand.findIndex((card) => card.instanceId === handInstanceId);
  if (handIndex < 0) {
    throw new Error("選択したカードが手札にありません");
  }

  const card = player.hand[handIndex];
  const def = getCardDef(card.cardId);
  if (def.type !== "monster") {
    throw new Error("モンスターカードだけ召喚できます");
  }
  if (!isSummonableMonsterCard(card.cardId)) {
    throw new Error("スーパーカードはレベルアップ時だけ登場できます");
  }

  const slot = next.slots[slotKey];
  if (slot.owner !== next.currentPlayer) {
    throw new Error("相手陣地には召喚できません");
  }
  if (slot.monster) {
    throw new Error("空き枠にだけ召喚できます");
  }
  if (player.stones < 1) {
    throw new Error("召喚に必要なストーンが足りません");
  }

  player.hand.splice(handIndex, 1);
  player.stones -= 1;
  slot.monster = createMonster(card, def, next.currentPlayer);
  const summonedName = next.currentPlayer === "cpu" ? "カード" : def.name;
  appendLog(next, `${playerLabel(next.currentPlayer)}は${summonedName}を準備中で召喚した`);
  return next;
}

export function moveMonster(
  state: GameState,
  fromSlotKey: SlotKey,
  toSlotKey: SlotKey,
): GameState {
  const next = cloneState(state);
  ensureActionAllowed(next);

  const from = next.slots[fromSlotKey];
  const to = next.slots[toSlotKey];
  const mover = from.monster;
  if (!mover || mover.owner !== next.currentPlayer || mover.status !== "active") {
    throw new Error("移動できる登場済みモンスターを選んでください");
  }
  if (mover.actionCount >= mover.actionLimit) {
    throw new Error("このモンスターはこのターンもう行動できません");
  }
  if (isMonsterActionBlocked(next, fromSlotKey)) {
    throw new Error("このモンスターは行動できません");
  }
  const actionCost = getMonsterActionExtraCost(mover);
  if (next.players[mover.owner].stones < actionCost) {
    throw new Error("ストーン呪の追加コストが足りません");
  }
  if (to.owner !== next.currentPlayer || fromSlotKey === toSlotKey) {
    throw new Error("自陣の別枠にだけ移動できます");
  }
  if (to.monster && to.monster.status !== "active") {
    throw new Error("準備中モンスターとは入れ替えられません");
  }
  if (to.monster && !canSwapByActionAvailability(mover, to.monster)) {
    throw new Error("行動状態が異なる味方とは入れ替えられません");
  }

  const other = to.monster;
  next.players[mover.owner].stones -= actionCost;
  if (other) {
    mover.actionCount = mover.actionLimit;
    other.actionCount = other.actionLimit;
    other.focused = false;
  } else {
    mover.actionCount += 1;
  }
  mover.focused = false;
  clearDarkHoleIfMoved(mover, toSlotKey);
  recordMoveHistory(next, mover, fromSlotKey, toSlotKey, other);

  if (other) {
    to.monster = mover;
    from.monster = other;
    appendLog(next, `${monsterName(mover)}と${monsterName(other)}の位置を入れ替えた`);
  } else {
    to.monster = mover;
    delete from.monster;
    appendLog(next, `${monsterName(mover)}を移動した`);
  }

  applyDamageCurseAfterAction(next, toSlotKey);
  return next;
}

function hasRemainingMonsterAction(monster: MonsterState): boolean {
  return monster.status === "active" && monster.actionCount < monster.actionLimit;
}

function canSwapByActionAvailability(mover: MonsterState, other: MonsterState): boolean {
  return hasRemainingMonsterAction(mover) === hasRemainingMonsterAction(other);
}

export function focusMonster(state: GameState, slotKey: SlotKey): GameState {
  if (!canFocusMonster(state, slotKey)) {
    throw new Error("このモンスターはためることができません");
  }

  const next = cloneState(state);
  ensureActionAllowed(next);

  const monster = next.slots[slotKey].monster;
  if (!monster) {
    throw new Error("ためるモンスターが見つかりません");
  }

  monster.focused = true;
  const actionCost = getMonsterActionExtraCost(monster);
  if (next.players[monster.owner].stones < actionCost) {
    throw new Error("ストーン呪の追加コストが足りません");
  }
  next.players[monster.owner].stones -= actionCost;
  monster.actionCount += 1;
  appendLog(next, `${monsterName(monster)}はためた`);
  applyDamageCurseAfterAction(next, slotKey);
  return next;
}

export function attackWithCommand(state: GameState, action: CommandAction): GameState {
  const validTargets = getCommandTargets(state, action.attackerSlotKey, action.commandId);
  if (!validTargets.some((target) => isSameTarget(target, action.target))) {
    throw new Error("その対象には攻撃できません");
  }

  const next = cloneState(state);
  ensureActionAllowed(next);

  const slot = next.slots[action.attackerSlotKey];
  const attacker = slot.monster;
  if (!attacker) {
    throw new Error("攻撃モンスターが見つかりません");
  }

  const command = getCommand(attacker, action.commandId);
  const actor = next.players[next.currentPlayer];
  const cost = getCommandStoneCost(attacker, command) + getMonsterActionExtraCost(attacker);
  if (actor.stones < cost) {
    throw new Error("特技に必要なストーンが足りません");
  }

  actor.stones -= cost;
  attacker.actionCount += 1;
  const hadBerserkPower = !!attacker.berserkPower;
  const hadDamageCurse = !!attacker.damageCurse;
  const basePower = getCommandBasePower(next, slot, command, action.target);
  const power = consumeAttackPowerBonuses(attacker, command, basePower);
  if (command.name === "ドリルブレイク") {
    consumeDrillBreakPartnerAction(next, slot);
  }
  appendLog(next, `${playerLabel(next.currentPlayer)}の${monsterName(attacker)}: ${command.name} ${power}P`);
  if (cost > (command.stoneCost ?? 0)) {
    appendLog(next, `${monsterName(attacker)}はストーン呪で追加コストを払った`);
  }

  if (applyUtilityCommandEffect(next, action.attackerSlotKey, command, action.target, power, action)) {
    finishCommandSideEffects(next, action.attackerSlotKey, command, hadBerserkPower, hadDamageCurse);
    return next;
  }

  if (shouldCommandMiss(next, attacker, command)) {
    appendLog(next, `${monsterName(attacker)}の${command.name}は空振りした`);
    finishCommandSideEffects(next, action.attackerSlotKey, command, hadBerserkPower, hadDamageCurse);
    return next;
  }

  if (command.name === "ブレイクホーン" && action.target.kind === "monster") {
    const targetMonster = next.slots[action.target.slotKey].monster;
    if (targetMonster?.status === "prepared") {
      targetMonster.status = "active";
      targetMonster.actionCount = 0;
      appendLog(next, `${monsterName(targetMonster)}が登場した`);
    }
  }

  const resolvedAttackerSlotKey = command.name === "なぎ払い"
    ? advanceSweepingAttacker(next, action.attackerSlotKey)
    : action.attackerSlotKey;

  if (action.target.kind === "master") {
    const beforeHp = next.players[action.target.playerId].masterHp;
    damageMasterByPower(next, action.target.playerId, power, {
      source: command.name,
      kind: "command",
      attackerSlotKey: resolvedAttackerSlotKey,
    });
    if (command.name === "ライフドレイン" && next.slots[resolvedAttackerSlotKey].monster) {
      healMonster(next, resolvedAttackerSlotKey, Math.max(0, beforeHp - next.players[action.target.playerId].masterHp));
    }
    finishCommandSideEffects(next, resolvedAttackerSlotKey, command, hadBerserkPower, hadDamageCurse);
    const recoilDamage = getCommandRecoilDamage(command, power);
    if (!next.winner && recoilDamage) {
      applyRecoil(next, resolvedAttackerSlotKey, recoilDamage);
    }
    return next;
  }

  const targetHpBefore = next.slots[action.target.slotKey].monster?.hp ?? 0;
  const defeated = damageMonster(next, action.target.slotKey, power, {
    source: command.name,
    kind: "command",
    attackerSlotKey: resolvedAttackerSlotKey,
  });
  if (command.name === "ライフドレイン" && next.slots[resolvedAttackerSlotKey].monster) {
    const targetHpAfter = next.slots[action.target.slotKey].monster?.hp ?? 0;
    healMonster(next, resolvedAttackerSlotKey, Math.max(0, targetHpBefore - targetHpAfter));
  }
  applyPostDamageCommandEffect(next, resolvedAttackerSlotKey, command, action.target, power, !!defeated);
  if (!defeated) {
    finishCommandSideEffects(next, resolvedAttackerSlotKey, command, hadBerserkPower, hadDamageCurse);
    const recoilDamage = getCommandRecoilDamage(command, power);
    if (recoilDamage) {
      applyRecoil(next, resolvedAttackerSlotKey, recoilDamage);
    }
    return next;
  }

  if (defeated.owner === attacker.owner) {
    decreaseMasterHp(next, attacker.owner, 1, "味方撃破ペナルティ");
    finishCommandSideEffects(next, resolvedAttackerSlotKey, command, hadBerserkPower, hadDamageCurse);
    const recoilDamage = getCommandRecoilDamage(command, power);
    if (!next.winner && recoilDamage) {
      applyRecoil(next, resolvedAttackerSlotKey, recoilDamage);
    }
    return next;
  }

  const levelUpSlotKey = getLevelUpRecipientSlotKey(next, resolvedAttackerSlotKey, defeated.level);
  const maxLevels = getLevelUpCapacity(next, levelUpSlotKey, defeated.level);
  if (maxLevels > 0 && next.currentPlayer === "player") {
    finishCommandSideEffects(next, resolvedAttackerSlotKey, command, hadBerserkPower, hadDamageCurse);
    const recoilDamage = getCommandRecoilDamage(command, power);
    if (!next.winner && recoilDamage) {
      applyRecoil(next, resolvedAttackerSlotKey, recoilDamage);
    }
    const updatedMaxLevels = next.winner ? 0 : getLevelUpCapacity(next, levelUpSlotKey, defeated.level);
    const levelUpMonster = next.slots[levelUpSlotKey].monster;
    if (!levelUpMonster || updatedMaxLevels <= 0) {
      return next;
    }
    const superOptions = getSuperLevelUpOptions(next, levelUpSlotKey, updatedMaxLevels);
    next.pendingLevelUp = {
      playerId: "player",
      attackerSlotKey: levelUpSlotKey,
      maxLevels: updatedMaxLevels,
      superOptions: superOptions.length > 0 ? superOptions : undefined,
    };
    appendLog(next, `${monsterName(levelUpMonster)}は${updatedMaxLevels}レベルまで上げられる`);
    return next;
  }

  finishCommandSideEffects(next, resolvedAttackerSlotKey, command, hadBerserkPower, hadDamageCurse);
  const recoilDamage = getCommandRecoilDamage(command, power);
  if (recoilDamage) {
    applyRecoil(next, resolvedAttackerSlotKey, recoilDamage);
  }

  const updatedMaxLevels = next.winner ? 0 : getLevelUpCapacity(next, levelUpSlotKey, defeated.level);
  if (updatedMaxLevels > 0) {
    const superOption = chooseSuperLevelUpOption(next, { superOptions: getSuperLevelUpOptions(next, levelUpSlotKey, updatedMaxLevels) });
    if (superOption) {
      performSuperLevelUp(next, levelUpSlotKey, superOption.handInstanceId);
    } else {
      performLevelUp(next, levelUpSlotKey, updatedMaxLevels);
    }
  }
  return next;
}

export function resolveLevelUp(state: GameState, levels: number, superHandInstanceId?: string): GameState {
  const next = cloneState(state);
  const pending = next.pendingLevelUp;
  if (!pending) {
    throw new Error("レベルアップ待ちではありません");
  }
  const choice = resolveLevelUpChoice(pending, levels, superHandInstanceId);

  if (choice.kind === "super") {
    performSuperLevelUp(next, pending.attackerSlotKey, choice.handInstanceId);
  } else if (choice.kind === "level") {
    const raisedLevels = performLevelUp(next, pending.attackerSlotKey, choice.levels);
    const remainingLevels = pending.maxLevels - raisedLevels;
    if (raisedLevels > 0 && choice.levels < pending.maxLevels && remainingLevels > 0 && next.slots[pending.attackerSlotKey].monster) {
      const superOptions = getSuperLevelUpOptions(next, pending.attackerSlotKey, remainingLevels);
      next.pendingLevelUp = {
        ...pending,
        maxLevels: remainingLevels,
        superOptions: superOptions.length > 0 ? superOptions : undefined,
      };
      return next;
    }
  } else {
    appendLog(next, "レベルアップしなかった");
  }

  delete next.pendingLevelUp;

  return next;
}

export function playMagic(state: GameState, action: MagicAction): GameState {
  const validTargets = getMagicTargets(state, action.handInstanceId);
  if (!validTargets.some((target) => isSameTarget(target, action.target))) {
    throw new Error("その対象にはマジックを使えません");
  }

  const next = cloneState(state);
  ensureActionAllowed(next);

  const player = next.players[next.currentPlayer];
  const handIndex = player.hand.findIndex((card) => card.instanceId === action.handInstanceId);
  if (handIndex < 0) {
    throw new Error("選択したカードが手札にありません");
  }
  const card = player.hand[handIndex];
  const def = getCardDef(card.cardId);
  if (def.type !== "magic") {
    throw new Error("マジックカードではありません");
  }
  if (player.stones < def.cost) {
    throw new Error("マジックに必要なストーンが足りません");
  }

  player.hand.splice(handIndex, 1);
  player.discard.push(card);
  player.stones -= def.cost;
  appendLog(next, `${playerLabel(next.currentPlayer)}は${def.name}を使った`);

  applyMagicEffect(next, def.id, action);

  return next;
}

export function discardHandCard(state: GameState, handInstanceId: string): GameState {
  const next = cloneState(state);
  ensureActionAllowed(next);

  const player = next.players[next.currentPlayer];
  if (player.hand.length <= HAND_LIMIT) {
    throw new Error("手札上限を超えている時だけ捨てられます");
  }
  const handIndex = player.hand.findIndex((card) => card.instanceId === handInstanceId);
  if (handIndex < 0) {
    throw new Error("捨てるカードが手札にありません");
  }

  const [discarded] = player.hand.splice(handIndex, 1);
  player.discard.push(discarded);
  appendLog(next, `${playerLabel(next.currentPlayer)}は${getCardName(discarded.cardId)}を手札から捨てた`);
  return next;
}

export function useMasterHpDraw(state: GameState): GameState {
  const next = cloneState(state);
  ensureActionAllowed(next);

  const player = next.players[next.currentPlayer];
  if (player.masterFrozen) {
    throw new Error("マスターは行動できません");
  }
  if (player.deck.length === 0) {
    throw new Error("山札が0枚のため、マスターHPドローは使えません");
  }

  decreaseMasterHp(next, next.currentPlayer, 1, "マスターHPドロー");
  if (next.winner) {
    return next;
  }

  drawOne(next.players[next.currentPlayer]);
  appendLog(next, `${playerLabel(next.currentPlayer)}はマスターHPを1使って1枚引いた`);
  return next;
}

export function useMasterAction(
  state: GameState,
  actionId: MasterActionId,
  target: Target,
): GameState {
  const validTargets = getMasterActionTargets(state, actionId);
  if (!validTargets.some((validTarget) => isSameTarget(validTarget, target))) {
    throw new Error("その対象にはマスター特技を使えません");
  }

  const next = cloneState(state);
  ensureActionAllowed(next);

  const player = next.players[next.currentPlayer];
  const cost = getMasterActionCost(actionId);
  if (!getMasterActionIdsForPlayer(next, next.currentPlayer).includes(actionId)) {
    throw new Error("このマスターはその特技を使えません");
  }
  if (player.stones < cost) {
    throw new Error("マスター特技に必要なストーンが足りません");
  }
  player.stones -= cost;
  recordMasterActionHistory(next, actionId, target);

  if (actionId === "master_attack") {
    if (target.kind !== "monster") {
      throw new Error("マスターアタックはモンスターだけを対象にできます");
    }
    appendLog(next, `${playerLabel(next.currentPlayer)}のマスターアタック`);
    const power = MASTER_ATTACK_POWER + (player.masterPowerBonus ?? 0);
    player.masterPowerBonus = 0;
    damageMonster(next, target.slotKey, power, {
      source: "マスターアタック",
      kind: "master",
    });
    return next;
  }

  if (actionId === "earth_anger") {
    if (target.kind !== "master" || target.playerId !== next.currentPlayer) {
      throw new Error("大地の怒りの対象が不正です");
    }
    appendLog(next, `${playerLabel(next.currentPlayer)}の大地の怒り`);
    damageAllMonsters(next, 3, "大地の怒り");
    return next;
  }

  if (target.kind !== "monster") {
    throw new Error("マスター特技の対象が不正です");
  }
  const monster = next.slots[target.slotKey].monster;
  if (!monster) {
    throw new Error("対象モンスターがいません");
  }

  if (actionId === "wake_up") {
    monster.status = "active";
    monster.actionCount = 0;
    monster.actionLimit = getMonsterDef(monster.cardId).actionLimit ?? 1;
    appendLog(next, `${playerLabel(next.currentPlayer)}は${monsterName(monster)}をウェイクアップした`);
    return next;
  }

  if (actionId === "berserk_power") {
    monster.berserkPower = true;
    appendLog(next, `${playerLabel(next.currentPlayer)}は${monsterName(monster)}をバーサクパワー状態にした`);
    return next;
  }

  monster.shielded = true;
  appendLog(next, `${playerLabel(next.currentPlayer)}は${monsterName(monster)}にシールドを張った`);
  return next;
}

export function getCommandTargets(
  state: GameState,
  attackerSlotKey: SlotKey,
  commandId: string,
): Target[] {
  return getCommandTargetsFromTargeting(state, attackerSlotKey, commandId);
}

function getCommandTargetsUnchecked(
  state: GameState,
  attackerSlotKey: SlotKey,
  command: CommandDef,
): Target[] {
  return getCommandTargetsUncheckedFromTargeting(state, attackerSlotKey, command);
}

export function getMasterActionTargets(state: GameState, actionId: MasterActionId): Target[] {
  return getMasterActionTargetsFromTargeting(state, actionId);
}

export function getMagicTargets(state: GameState, handInstanceId: string): Target[] {
  return getMagicTargetsFromTargeting(state, handInstanceId);
}

export function getMagicSecondaryTargets(state: GameState, action: Pick<MagicAction, "handInstanceId" | "target">): Target[] {
  return getMagicSecondaryTargetsFromTargeting(state, action);
}

export function getCommandSecondaryTargets(
  state: GameState,
  action: Pick<CommandAction, "attackerSlotKey" | "commandId" | "target">,
): Target[] {
  return getCommandSecondaryTargetsFromTargeting(state, action);
}

export function getMagicHandChoices(state: GameState, handInstanceId: string): CardInstance[] {
  return getMagicHandChoicesFromTargeting(state, handInstanceId);
}

export function getCommandHandChoices(state: GameState, attackerSlotKey: SlotKey, commandId: string): CardInstance[] {
  return getCommandHandChoicesFromTargeting(state, attackerSlotKey, commandId);
}

export function getMagicSearchCategories(state: GameState, handInstanceId: string): Array<NonNullable<MagicAction["searchCategory"]>> {
  return getMagicSearchCategoriesFromTargeting(state, handInstanceId);
}

function applyMagicEffect(state: GameState, cardId: string, action: MagicAction): void {
  const { target } = action;
  const guardedMonster = target.kind === "monster" ? state.slots[target.slotKey].monster : undefined;
  if (guardedMonster?.damageGuarded) {
    appendLog(state, `${monsterName(guardedMonster)}は仮死状態で効果を受けつけなかった`);
    return;
  }
  if (cardId === "healing" && target.kind === "monster") {
    healMonster(state, target.slotKey, 2);
    return;
  }

  if (cardId === "thunder") {
    damageTargetByMagic(state, target, 3, "サンダー");
    return;
  }

  if (cardId === "power_up" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    if (monster.powerUp) {
      throw new Error("同じ対象にパワーアップは重ねられません");
    }
    monster.powerUp = true;
    appendLog(state, `${monsterName(monster)}の次の攻撃パワーを1上げた`);
    return;
  }

  if (cardId === "card_025" || cardId === "card_030" || cardId === "card_089") {
    applyShieldMagic(state, target, 1);
    if (cardId === "card_030" && target.kind === "monster") {
      const second = action.secondaryTarget?.kind === "monster"
        ? action.secondaryTarget.slotKey
        : findFirstOtherActiveSlot(state, target.slotKey);
      if (second) {
        applyShieldMagic(state, { kind: "monster", slotKey: second }, 1);
      }
    }
    if (cardId === "card_089" && target.kind === "monster") {
      const monster = requireTargetMonster(state, target.slotKey);
      monster.dragonShield = true;
      appendLog(state, `${monsterName(monster)}に竜の盾を張った`);
    }
    return;
  }

  if (cardId === "card_055" || cardId === "card_088") {
    applyShieldMagic(state, target, 2, cardId === "card_055");
    return;
  }

  if (cardId === "card_091" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.dodgeChance = true;
    appendLog(state, `${monsterName(monster)}は女神の加護を受けた`);
    return;
  }

  if (cardId === "card_062") {
    if (target.kind === "monster") {
      const monster = requireTargetMonster(state, target.slotKey);
      if (monster.actionCount > 0) {
        throw new Error("水晶の壁は未行動のモンスターにだけ使えます");
      }
      monster.immune = true;
      appendLog(state, `${monsterName(monster)}は攻撃を受けつけなくなった`);
    }
    return;
  }

  if (cardId === "card_026") {
    damageTargetByMagic(state, target, 1, "スパーク");
    return;
  }

  if (cardId === "card_027" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.powerModifier = (monster.powerModifier ?? 0) - 1;
    appendLog(state, `${monsterName(monster)}のパワーを1下げた`);
    return;
  }

  if (cardId === "card_028" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    const targetName = monsterName(monster);
    const canLevelUp = monster.level < getMonsterDef(monster.cardId).maxLevel && !monster.levelFixed && state.players[monster.owner].stones > 0;
    const canLevelDown = monster.level > 1 && !monster.levelFixed;
    if (canLevelUp && (!canLevelDown || randomChance(state, 0.5))) {
      appendRandomResultLog(state, "レベルチェンジ", `${targetName}のレベルアップ`);
      performLevelUp(state, target.slotKey, 1);
    } else if (canLevelDown) {
      appendRandomResultLog(state, "レベルチェンジ", `${targetName}のレベルダウン`);
      levelDownMonster(state, target.slotKey);
    } else {
      appendRandomResultLog(state, "レベルチェンジ", `${targetName}は変化なし`);
      appendLog(state, `${monsterName(monster)}のレベルは変わらなかった`);
    }
    return;
  }

  if (cardId === "card_029" && target.kind === "monster") {
    levelDownMonster(state, target.slotKey);
    return;
  }

  if (cardId === "card_031" && target.kind === "monster") {
    const partnerSlotKey = action.secondaryTarget?.kind === "monster"
      ? action.secondaryTarget.slotKey
      : findSwapPartnerSlot(state, target.slotKey);
    if (!partnerSlotKey) {
      throw new Error("入れ替え相手がいません");
    }
    validateSwapPartner(state, target.slotKey, partnerSlotKey);
    swapMonsters(state, target.slotKey, partnerSlotKey);
    return;
  }

  if (cardId === "card_056" || cardId === "card_126") {
    damageAllMonsters(state, cardId === "card_126" ? 3 : 1, getCardName(cardId));
    return;
  }

  if (cardId === "card_057" && target.kind === "monster") {
    removeMonsterFromField(state, target.slotKey, "エスケープ");
    return;
  }

  if (cardId === "card_058" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.commandSealed = true;
    appendLog(state, `${monsterName(monster)}の特技を封じた`);
    return;
  }

  if (cardId === "card_059" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.powerOverride = 2;
    appendLog(state, `${monsterName(monster)}の次の攻撃パワーを2にした`);
    return;
  }

  if (cardId === "card_060" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.levelFixed = true;
    appendLog(state, `${monsterName(monster)}のレベルを固定した`);
    return;
  }

  if (cardId === "card_061" && target.kind === "monster") {
    const primaryOwner = state.slots[target.slotKey].owner;
    const requiredOtherOwner = opponentOf(primaryOwner);
    const otherSlotKey = action.secondaryTarget?.kind === "monster"
      ? action.secondaryTarget.slotKey
      : firstActiveSlotOf(state, requiredOtherOwner);
    if (!otherSlotKey) {
      throw new Error("誘惑の相手側対象がいません");
    }
    if (state.slots[otherSlotKey].owner !== requiredOtherOwner) {
      throw new Error("誘惑の相手側対象が不正です");
    }
    const ownSlotKey = primaryOwner === state.currentPlayer ? target.slotKey : otherSlotKey;
    const opponentSlotKey = ownSlotKey === target.slotKey ? otherSlotKey : target.slotKey;
    if (state.slots[ownSlotKey].owner !== state.currentPlayer || state.slots[opponentSlotKey].owner !== opponentOf(state.currentPlayer)) {
      throw new Error("誘惑の対象陣営が不正です");
    }
    const opponentMonsterName = monsterName(requireTargetMonster(state, opponentSlotKey));

    removeMonsterFromField(state, ownSlotKey, "誘惑");
    const tempted = randomChance(state, 0.5);
    appendRandomResultLog(state, "誘惑", tempted ? `${opponentMonsterName}が消える` : `${opponentMonsterName}が耐える`);
    if (tempted) {
      removeMonsterFromField(state, opponentSlotKey, "誘惑");
    } else {
      appendLog(state, `${opponentMonsterName}は誘惑に耐えた`);
    }
    return;
  }

  if (cardId === "card_063" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.canAttackAnywhere = true;
    appendLog(state, `${monsterName(monster)}は通常攻撃がどこにでも届く`);
    return;
  }

  if (cardId === "card_064") {
    for (const slotKey of FIELD_ORDER) {
      if (state.slots[slotKey].monster) {
        clearMonsterEffects(state, slotKey, true);
      }
    }
    return;
  }

  if (cardId === "card_065" && target.kind === "monster") {
    shiftChangeWithHandMonster(state, target.slotKey, action.secondaryHandInstanceId);
    return;
  }

  if (cardId === "card_086" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.cannotMove = true;
    appendLog(state, `${monsterName(monster)}は移動できなくなった`);
    return;
  }

  if (cardId === "card_087" && target.kind === "master") {
    for (const slotKey of PLAYER_SLOT_ORDER[target.playerId]) {
      if (state.slots[slotKey].monster) {
        clearMonsterEffects(state, slotKey, false);
      }
    }
    return;
  }

  if (cardId === "card_090" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.reviveOnDefeat = true;
    appendLog(state, `${monsterName(monster)}は倒れた時に山札へ戻る`);
    return;
  }

  if (cardId === "card_092") {
    damageTargetByMagic(state, target, 2, "マッドファイア");
    if (target.kind === "monster") {
      for (const slotKey of adjacentSlotKeys(state.slots[target.slotKey])) {
        const adjacentMonster = state.slots[slotKey].monster;
        if (adjacentMonster?.status !== "active") {
          continue;
        }
        const hit = randomChance(state, 0.5);
        appendRandomResultLog(state, "マッドファイア余波", `${monsterName(adjacentMonster)}に${hit ? "命中" : "外れ"}`);
        if (hit) {
          damageMonster(state, slotKey, 1, "マッドファイア余波");
        }
      }
    }
    return;
  }

  if (cardId === "card_093") {
    rotateFieldMonsters(state, action.rotationDirection ?? "clockwise");
    return;
  }

  if (cardId === "card_094" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.berserkPower = true;
    appendLog(state, `${monsterName(monster)}をバーサクパワー状態にした`);
    return;
  }

  if (cardId === "card_095" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.darkHoleSlotKey = target.slotKey;
    appendLog(state, `${monsterName(monster)}にダークホールを置いた`);
    return;
  }

  if (cardId === "card_097" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    const baitSlotKey = action.secondaryTarget?.kind === "monster"
      ? action.secondaryTarget.slotKey
      : firstActiveSlotOf(state, state.currentPlayer);
    if (!baitSlotKey) {
      throw new Error("挑発する味方がいません");
    }
    monster.provokeTargetSlotKey = baitSlotKey;
    appendLog(state, `${monsterName(monster)}は${monsterName(requireTargetMonster(state, baitSlotKey))}に挑発された`);
    return;
  }

  if (cardId === "card_098" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    const linkedSlotKey = action.secondaryTarget?.kind === "monster"
      ? action.secondaryTarget.slotKey
      : firstActiveSlotOf(state, state.currentPlayer);
    if (!linkedSlotKey) {
      throw new Error("デスチェーンをつなぐ味方がいません");
    }
    validateDeathChainPair(state, target.slotKey, linkedSlotKey);
    monster.deathChainSlotKey = linkedSlotKey;
    requireTargetMonster(state, linkedSlotKey).deathChainSlotKey = target.slotKey;
    appendLog(state, `${monsterName(monster)}と${monsterName(requireTargetMonster(state, linkedSlotKey))}をデスチェーンでつないだ`);
    return;
  }

  if (cardId === "card_113" && target.kind === "master") {
    const player = state.players[target.playerId];
    const lost = Math.ceil(player.stones / 2);
    player.stones -= lost;
    appendLog(state, `${playerLabel(target.playerId)}のストーンを${lost}個減らした`);
    return;
  }

  if (cardId === "card_114") {
    reshuffleHand(state, state.currentPlayer);
    return;
  }

  if (cardId === "card_115") {
    sortTopDeckCards(state, state.currentPlayer, action.deckTopOrderInstanceIds);
    return;
  }

  if (cardId === "card_116") {
    refreshSelectedHand(state, state.currentPlayer, action.selectedHandInstanceIds);
    return;
  }

  if (cardId === "card_117" && target.kind === "monster") {
    wakeMonster(state, target.slotKey);
    return;
  }

  if (cardId === "card_118" && target.kind === "monster") {
    damageMonster(state, target.slotKey, 1, "かまいたち");
    return;
  }

  if (cardId === "card_119" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.stoneCostMultiplier = 2;
    appendLog(state, `${monsterName(monster)}の特技コストが2倍になった`);
    return;
  }

  if (cardId === "card_120") {
    drawUntilHandLimit(state, state.currentPlayer);
    return;
  }

  if (cardId === "card_121") {
    const gained = randomInt(state, 1, 3);
    state.players[state.currentPlayer].stones += gained;
    appendRandomResultLog(state, "プラストーン", `ストーン${gained}個`);
    appendLog(state, `${playerLabel(state.currentPlayer)}はストーンを${gained}個得た`);
    return;
  }

  if (cardId === "card_122" && target.kind === "monster") {
    returnPreparedMonsterToDeck(state, target.slotKey);
    return;
  }

  if (cardId === "card_123") {
    searchCardToHand(state, state.currentPlayer, action.searchCategory ?? "front");
    return;
  }

  if (cardId === "card_124") {
    setMasterActionExchange(state, state.currentPlayer);
    appendLog(state, "マスター特技を入れ替えた");
    return;
  }

  if (cardId === "card_125" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.shadowCursed = true;
    appendLog(state, `${monsterName(monster)}にかげ呪いをかけた`);
    return;
  }

  if (cardId === "card_127") {
    if (target.kind === "master") {
      healMaster(state, target.playerId, 1);
    } else {
      healMonster(state, target.slotKey, 1);
    }
    return;
  }

  if (cardId === "card_128" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.scapegoat = true;
    appendLog(state, `${monsterName(monster)}をスケープゴートにした`);
    return;
  }

  if (cardId === "card_129" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.focused = true;
    appendLog(state, `${monsterName(monster)}は気合いだめした`);
    return;
  }

  if (cardId === "card_130" && target.kind === "monster") {
    resetMonsterToEntry(state, target.slotKey);
    return;
  }

  if (cardId === "card_148" && target.kind === "monster") {
    mirrorMonster(state, target.slotKey, action.secondaryTarget);
    return;
  }

  if (cardId === "card_149" && target.kind === "monster") {
    performLevelUp(state, target.slotKey, 1);
    return;
  }

  if (cardId === "card_150" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.powerModifier = (monster.powerModifier ?? 0) + 2;
    appendLog(state, `${monsterName(monster)}が覚醒した`);
  }
}

function requireTargetMonster(state: GameState, slotKey: SlotKey): MonsterState {
  const monster = state.slots[slotKey].monster;
  if (!monster) {
    throw new Error("対象モンスターがいません");
  }
  return monster;
}

function applyShieldMagic(state: GameState, target: Target, strength: 1 | 2, oneShot = false): void {
  if (target.kind !== "monster") {
    throw new Error("シールド対象が不正です");
  }
  const monster = requireTargetMonster(state, target.slotKey);
  if (strength === 1) {
    monster.shielded = true;
  } else {
    monster.halfShielded = true;
  }
  if (oneShot) {
    monster.oneShotShield = true;
  }
  appendLog(state, `${monsterName(monster)}にシールドを張った`);
}

function damageTargetByMagic(state: GameState, target: Target, power: number, source: string): void {
  if (target.kind === "master") {
    damageMasterByPower(state, target.playerId, power, { source, kind: "magic" });
    return;
  }
  damageMonster(state, target.slotKey, power, { source, kind: "magic" });
}

function findFirstOtherActiveSlot(state: GameState, slotKey: SlotKey): SlotKey | undefined {
  return FIELD_ORDER.find((candidate) => candidate !== slotKey && state.slots[candidate].monster?.status === "active");
}

function findSwapPartnerSlot(state: GameState, slotKey: SlotKey): SlotKey | undefined {
  const slot = state.slots[slotKey];
  return PLAYER_SLOT_ORDER[slot.owner].find((candidate) => candidate !== slotKey && state.slots[candidate].monster?.status === "active");
}

function validateSwapPartner(state: GameState, aSlotKey: SlotKey, bSlotKey: SlotKey): void {
  const a = state.slots[aSlotKey];
  const b = state.slots[bSlotKey];
  if (a.owner !== b.owner || aSlotKey === bSlotKey || !a.monster || !b.monster) {
    throw new Error("同じ陣営のモンスター同士だけ入れ替えられます");
  }
}

function swapMonsters(state: GameState, aSlotKey: SlotKey, bSlotKey: SlotKey): void {
  const a = state.slots[aSlotKey];
  const b = state.slots[bSlotKey];
  const aMonster = a.monster;
  const bMonster = b.monster;
  if (!aMonster || !bMonster) {
    throw new Error("入れ替え対象がいません");
  }
  a.monster = bMonster;
  b.monster = aMonster;
  appendLog(state, `${monsterName(aMonster)}と${monsterName(bMonster)}の位置を入れ替えた`);
}

function damageAllMonsters(state: GameState, power: number, source: string): void {
  const targets = FIELD_ORDER.filter((slotKey) => state.slots[slotKey].monster?.status === "active");
  for (const slotKey of targets) {
    if (state.slots[slotKey].monster) {
      damageMonster(state, slotKey, power, source);
    }
  }
}

function firstActiveSlotOf(state: GameState, playerId: PlayerId): SlotKey | undefined {
  return PLAYER_SLOT_ORDER[playerId].find((slotKey) => state.slots[slotKey].monster?.status === "active");
}

function firstLevelUpCandidateSlot(state: GameState, excludeSlotKey?: SlotKey): SlotKey | undefined {
  return FIELD_ORDER.find((slotKey) => {
    if (slotKey === excludeSlotKey) {
      return false;
    }
    const monster = state.slots[slotKey].monster;
    return !!monster && monster.status === "active" && !monster.levelFixed && monster.level < getMonsterDef(monster.cardId).maxLevel;
  });
}

function healPlayerMonsters(state: GameState, playerId: PlayerId, amount: number): void {
  for (const slotKey of PLAYER_SLOT_ORDER[playerId]) {
    if (state.slots[slotKey].monster?.status === "active") {
      healMonster(state, slotKey, amount);
    }
  }
}

function damagePlayerMonsters(state: GameState, playerId: PlayerId, power: number, source: string, attackerSlotKey?: SlotKey): void {
  const targets = PLAYER_SLOT_ORDER[playerId].filter((slotKey) => state.slots[slotKey].monster?.status === "active");
  for (const slotKey of targets) {
    if (state.slots[slotKey].monster) {
      damageMonster(state, slotKey, power, { source, kind: "effect", attackerSlotKey });
    }
  }
}

function shiftChangeWithHandMonster(state: GameState, slotKey: SlotKey, handInstanceId?: string): void {
  const slot = state.slots[slotKey];
  const current = slot.monster;
  if (!current) {
    throw new Error("入れ替え対象がいません");
  }
  const player = state.players[current.owner];
  const handIndex = handInstanceId
    ? player.hand.findIndex((card) => card.instanceId === handInstanceId && isSummonableMonsterCard(card.cardId))
    : player.hand.findIndex((card) => isSummonableMonsterCard(card.cardId));
  if (handIndex < 0) {
    throw new Error("手札にモンスターがありません");
  }
  const [handMonster] = player.hand.splice(handIndex, 1);
  player.hand.push({ cardId: current.cardId, instanceId: current.instanceId });
  const def = getMonsterDef(handMonster.cardId);
  const firstLevel = def.levels[0];
  slot.monster = {
    instanceId: handMonster.instanceId,
    cardId: handMonster.cardId,
    owner: current.owner,
    hp: firstLevel.maxHp,
    level: firstLevel.level,
    status: current.status,
    investedStones: current.investedStones,
    actionCount: current.actionCount,
    actionLimit: def.actionLimit ?? 1,
    focused: false,
    powerUp: false,
    shielded: false,
    stoneCurse: handMonster.cardId === "card_144" ? true : undefined,
    hollow: handMonster.cardId === "card_144" ? true : undefined,
  };
  appendLog(state, `${monsterName(current)}と手札の${def.name}を入れ替えた`);
}

function transformMonsterKeepingHp(state: GameState, slotKey: SlotKey, nextCardId: string): void {
  const monster = requireTargetMonster(state, slotKey);
  const previousName = monsterName(monster);
  const nextDef = getMonsterDef(nextCardId);
  const nextLevel = Math.min(monster.level, nextDef.maxLevel);
  monster.cardId = nextCardId;
  monster.level = nextLevel;
  monster.actionLimit = nextDef.actionLimit ?? 1;
  monster.usedCommandIds = undefined;
  monster.revivedOnce = false;
  appendLog(state, `${previousName}は${nextDef.name}になった（HPはそのまま）`);
}

function adjacentSlotKeys(slot: SlotState): SlotKey[] {
  const origin = surroundingCoord(slot);
  return FIELD_ORDER.filter((slotKey) => {
    if (slotKey === slot.key) {
      return false;
    }
    const candidate = surroundingCoord(stateSlotPlaceholder(slotKey));
    return Math.abs(origin.x - candidate.x) <= 1 && Math.abs(origin.y - candidate.y) <= 1;
  });
}

function stateSlotPlaceholder(slotKey: SlotKey): SlotState {
  const [owner, row, lane] = slotKey.split("_") as [PlayerId, Row, Lane];
  return { key: slotKey, owner, row, lane };
}

function surroundingCoord(slot: SlotState): { x: number; y: number } {
  const x = slot.lane === "left" ? 0 : 1;
  if (slot.owner === "cpu") {
    return { x, y: slot.row === "back" ? 0 : 1 };
  }
  return { x, y: slot.row === "front" ? 2 : 3 };
}

function rotateFieldMonsters(state: GameState, direction: NonNullable<MagicAction["rotationDirection"]> = "clockwise"): void {
  for (const playerId of PLAYER_ORDER) {
    rotatePlayerMonsters(state, playerId, false, direction);
  }
  appendLog(state, `フィールドのモンスターを${rotationDirectionLabel(direction)}にローテーションした`);
}

function rotatePlayerMonsters(
  state: GameState,
  playerId: PlayerId,
  withLog = true,
  direction: NonNullable<MagicAction["rotationDirection"]> = "clockwise",
): void {
  const order = PLAYER_SLOT_ORDER[playerId];
  const monsters = order.map((slotKey) => state.slots[slotKey].monster);
  for (let i = 0; i < order.length; i += 1) {
    const fromIndex = direction === "clockwise"
      ? (i - 1 + order.length) % order.length
      : (i + 1) % order.length;
    const nextMonster = monsters[fromIndex];
    if (nextMonster) {
      state.slots[order[i]].monster = nextMonster;
    } else {
      delete state.slots[order[i]].monster;
    }
  }
  if (withLog) {
    appendLog(state, `${playerLabel(playerId)}フィールドのモンスターを${rotationDirectionLabel(direction)}にローテーションした`);
  }
}

function rotationDirectionLabel(direction: NonNullable<MagicAction["rotationDirection"]>): string {
  return direction === "clockwise" ? "右回り" : "左回り";
}

function reshuffleHand(state: GameState, playerId: PlayerId): void {
  const player = state.players[playerId];
  const redrawCount = player.hand.length;
  player.deck = shuffle([...player.deck, ...player.hand], state.turnNumber + redrawCount);
  player.hand = [];
  for (let i = 0; i < redrawCount; i += 1) {
    if (player.deck.length === 0) {
      break;
    }
    drawOne(player);
  }
  appendLog(state, `${playerLabel(playerId)}は手札を引き直した`);
}

function refreshHand(state: GameState, playerId: PlayerId): void {
  const player = state.players[playerId];
  const redrawCount = player.hand.length;
  player.discard.push(...player.hand);
  player.hand = [];
  for (let i = 0; i < redrawCount; i += 1) {
    if (player.deck.length === 0) {
      forceDraw(state, playerId, "リフレッシュ");
      break;
    }
    drawOne(player);
  }
  appendLog(state, `${playerLabel(playerId)}は手札をリフレッシュした`);
}

function refreshSelectedHand(state: GameState, playerId: PlayerId, selectedHandInstanceIds?: string[]): void {
  if (!selectedHandInstanceIds || selectedHandInstanceIds.length === 0) {
    refreshHand(state, playerId);
    return;
  }

  const player = state.players[playerId];
  const selected = new Set(selectedHandInstanceIds);
  const discarded: CardInstance[] = [];
  player.hand = player.hand.filter((card) => {
    if (!selected.has(card.instanceId)) {
      return true;
    }
    discarded.push(card);
    return false;
  });
  player.discard.push(...discarded);
  for (let i = 0; i < discarded.length; i += 1) {
    if (player.deck.length === 0) {
      forceDraw(state, playerId, "リフレッシュ");
      break;
    }
    drawOne(player);
  }
  appendLog(state, `${playerLabel(playerId)}は${discarded.length}枚をリフレッシュした`);
}

function drawUntilHandLimit(state: GameState, playerId: PlayerId): void {
  const player = state.players[playerId];
  while (player.hand.length < DRAW_FIVE_HAND_SIZE) {
    if (player.deck.length === 0) {
      forceDraw(state, playerId, "ドロー5");
      return;
    }
    drawOne(player);
  }
  appendLog(state, `${playerLabel(playerId)}は手札を5枚にした`);
}

function searchCardToHand(
  state: GameState,
  playerId: PlayerId,
  category: NonNullable<MagicAction["searchCategory"]>,
): void {
  const player = state.players[playerId];
  const matchingDeckIndexes = player.deck
    .map((card, deckIndex) => ({ card, deckIndex }))
    .filter(({ card }) => isCardInSearchCategory(card, category));
  if (matchingDeckIndexes.length === 0) {
    appendLog(state, `${categoryLabel(category)}のカードは山札になかった`);
    return;
  }
  const selected = matchingDeckIndexes[randomInt(state, 0, matchingDeckIndexes.length - 1)];
  const [card] = player.deck.splice(selected.deckIndex, 1);
  player.hand.push(card);
  appendRandomResultLog(state, "カードサーチ", `${categoryLabel(category)}から${getCardName(card.cardId)}`);
  appendLog(state, `${playerLabel(playerId)}は${categoryLabel(category)}から${getCardName(card.cardId)}を手札に入れた`);
}

function sortTopDeckCards(state: GameState, playerId: PlayerId, deckTopOrderInstanceIds?: string[]): void {
  const player = state.players[playerId];
  const topCount = Math.min(5, player.deck.length);
  const topCards = player.deck.slice(0, topCount);
  if (topCount === 0) {
    appendLog(state, "山札に並べ替えるカードがなかった");
    return;
  }
  if (!deckTopOrderInstanceIds || deckTopOrderInstanceIds.length === 0) {
    appendLog(state, `${playerLabel(playerId)}は山札上${topCount}枚を確認した`);
    return;
  }

  const topByInstanceId = new Map(topCards.map((card) => [card.instanceId, card]));
  const ordered = deckTopOrderInstanceIds.map((instanceId) => topByInstanceId.get(instanceId));
  const uniqueRequested = new Set(deckTopOrderInstanceIds);
  if (
    deckTopOrderInstanceIds.length !== topCount ||
    uniqueRequested.size !== topCount ||
    ordered.some((card) => !card)
  ) {
    throw new Error("山札上5枚の並べ替え指定が不正です");
  }

  player.deck.splice(0, topCount, ...(ordered as CardInstance[]));
  appendLog(state, `${playerLabel(playerId)}は山札上${topCount}枚を並べ替えた`);
}

function isCardInSearchCategory(card: CardInstance, category: NonNullable<MagicAction["searchCategory"]>): boolean {
  const def = getCardDef(card.cardId);
  if (category === "special") {
    return getCardPool(def) === "special";
  }
  if (category === "magic") {
    return def.type === "magic";
  }
  return def.type === "monster" && getCardPool(def) === "normal" && def.role === category;
}

function returnPreparedMonsterToDeck(state: GameState, slotKey: SlotKey): void {
  const slot = state.slots[slotKey];
  const monster = slot.monster;
  if (!monster || monster.status !== "prepared") {
    throw new Error("準備中モンスターがいません");
  }
  const owner = state.players[monster.owner];
  owner.stones += monster.investedStones;
  owner.deck.push({ cardId: monster.cardId, instanceId: monster.instanceId });
  delete slot.monster;
  appendLog(state, `${monsterName(monster)}を山札の最後に戻した`);
}

function resetMonsterToEntry(state: GameState, slotKey: SlotKey): void {
  const monster = requireTargetMonster(state, slotKey);
  const def = getMonsterDef(monster.cardId);
  const firstLevel = def.levels[0];
  const owner = state.players[monster.owner];
  const returnedStones = Math.max(0, monster.investedStones - 1);
  owner.stones += returnedStones;
  monster.level = firstLevel.level;
  monster.hp = firstLevel.maxHp;
  monster.investedStones = 1;
  monster.actionCount = 0;
  monster.actionLimit = def.actionLimit ?? 1;
  monster.revivedOnce = false;
  monster.usedCommandIds = undefined;
  clearMonsterEffects(state, slotKey, true);
  appendLog(state, `${monsterName(monster)}を登場時の状態に戻した`);
}

function mirrorMonster(state: GameState, slotKey: SlotKey, sourceTarget?: Target): void {
  const target = requireTargetMonster(state, slotKey);
  const sourceSlotKey = sourceTarget?.kind === "monster"
    ? sourceTarget.slotKey
    : PLAYER_SLOT_ORDER[opponentOf(target.owner)].find((candidate) => state.slots[candidate].monster?.status === "active");
  const source = sourceSlotKey ? state.slots[sourceSlotKey].monster : undefined;
  if (!source || source.owner === target.owner) {
    appendLog(state, "コピーできる相手モンスターがいない");
    return;
  }
  const currentHp = target.hp;
  target.cardId = source.cardId;
  target.level = Math.min(source.level, getMonsterDef(source.cardId).maxLevel);
  target.actionLimit = getMonsterDef(source.cardId).actionLimit ?? 1;
  target.hp = currentHp;
  target.revivedOnce = false;
  target.usedCommandIds = undefined;
  target.hollow = source.cardId === "card_144" ? true : undefined;
  appendLog(state, `${monsterName(target)}は${monsterName(source)}の姿を写した`);
}

export function getMovableTargets(state: GameState, fromSlotKey: SlotKey): SlotKey[] {
  if (state.winner || state.pendingLevelUp) {
    return [];
  }
  const from = state.slots[fromSlotKey];
  const mover = from.monster;
  if (!mover || mover.owner !== state.currentPlayer || mover.status !== "active") {
    return [];
  }
  if (mover.actionCount >= mover.actionLimit) {
    return [];
  }
  if (isMonsterActionBlocked(state, fromSlotKey) || state.players[mover.owner].stones < getMonsterActionExtraCost(mover)) {
    return [];
  }
  if (mover.cannotMove) {
    return [];
  }

  return PLAYER_SLOT_ORDER[state.currentPlayer].filter((slotKey) => {
    if (slotKey === fromSlotKey) {
      return false;
    }
    const target = state.slots[slotKey].monster;
    return !target || (target.status === "active" && canSwapByActionAvailability(mover, target));
  });
}

export function canFocusMonster(state: GameState, slotKey: SlotKey): boolean {
  if (state.winner || state.pendingLevelUp) {
    return false;
  }
  const monster = state.slots[slotKey].monster;
  return (
    !!monster &&
    monster.owner === state.currentPlayer &&
    monster.status === "active" &&
    monster.actionCount < monster.actionLimit &&
    !isMonsterActionBlocked(state, slotKey) &&
    state.players[monster.owner].stones >= getMonsterActionExtraCost(monster) &&
    !monster.focused
  );
}

export function getMonsterCommands(monster: MonsterState): CommandDef[] {
  return getMonsterLevelDef(monster).commands;
}

export function getMonsterDisplayName(monster: Pick<MonsterState, "cardId" | "usedCommandIds">): string {
  if (monster.cardId === "card_045" && monster.usedCommandIds?.includes("飛竜ロロ")) {
    return "アーシュ";
  }
  return getCardName(monster.cardId);
}

export function getMasterActionCost(actionId: MasterActionId): number {
  return getMasterActionCostFromTargeting(actionId);
}

export function getMasterActionIdsForPlayer(state: GameState, playerId: PlayerId): MasterActionId[] {
  return getMasterActionIdsForPlayerFromTargeting(state, playerId);
}

export function getCurrentMasterActionIds(state: GameState): MasterActionId[] {
  return getMasterActionIdsForPlayer(state, state.currentPlayer);
}

export function getHandCard(state: GameState, instanceId: string): CardInstance | undefined {
  return state.players[state.currentPlayer].hand.find((card) => card.instanceId === instanceId);
}

export function canSummonTo(state: GameState, handInstanceId: string, slotKey: SlotKey): boolean {
  const player = state.players[state.currentPlayer];
  const card = player.hand.find((handCard) => handCard.instanceId === handInstanceId);
  if (!card || state.winner || state.pendingLevelUp) {
    return false;
  }
  const def = getCardDef(card.cardId);
  const slot = state.slots[slotKey];
  return isSummonableMonsterCard(card.cardId) && def.type === "monster" && slot.owner === state.currentPlayer && !slot.monster && player.stones >= 1;
}

export function targetToKey(target: Target): string {
  return targetToKeyFromTargeting(target);
}

export function opponentOf(playerId: PlayerId): PlayerId {
  return playerId === "player" ? "cpu" : "player";
}

export function playerLabel(playerId: PlayerId): string {
  return playerId === "player" ? "プレイヤー" : "CPU";
}

function createPlayer(id: PlayerId, deck: CardInstance[], masterId: MasterId): PlayerState {
  return {
    id,
    masterId,
    masterHp: MASTER_HP,
    stones: 0,
    masterPowerBonus: 0,
    deck,
    hand: [],
    discard: [],
    turnsStarted: 0,
  };
}

function createSlots(): Record<SlotKey, SlotState> {
  const slots = {} as Record<SlotKey, SlotState>;
  for (const owner of PLAYER_ORDER) {
    for (const row of ROW_ORDER) {
      for (const lane of LANE_ORDER) {
        const key = makeSlotKey(owner, row, lane);
        slots[key] = { key, owner, row, lane };
      }
    }
  }
  return slots;
}

function makeSlotKey(owner: PlayerId, row: Row, lane: Lane): SlotKey {
  return `${owner}_${row}_${lane}`;
}

function createMonster(card: CardInstance, def: MonsterCardDef, owner: PlayerId): MonsterState {
  const firstLevel = def.levels[0];
  const monster: MonsterState = {
    instanceId: card.instanceId,
    cardId: card.cardId,
    owner,
    hp: firstLevel.maxHp,
    level: firstLevel.level,
    status: "prepared",
    investedStones: 1,
    actionCount: 0,
    actionLimit: def.actionLimit ?? 1,
    focused: false,
    powerUp: false,
    shielded: false,
  };
  if (card.cardId === "card_144") {
    monster.stoneCurse = true;
    monster.hollow = true;
  }
  return monster;
}

function drawOpeningHand(player: PlayerState): void {
  for (let i = 0; i < 5; i += 1) {
    drawOne(player);
  }
}

function drawOne(player: PlayerState): CardInstance {
  const card = player.deck.shift();
  if (!card) {
    throw new Error("山札がありません");
  }
  player.hand.push(card);
  return card;
}

function forceDraw(state: GameState, playerId: PlayerId, reason: string): void {
  const player = state.players[playerId];
  if (player.deck.length === 0) {
    appendLog(state, `${playerLabel(playerId)}は${reason}で引けず、山札切れペナルティ`);
    decreaseMasterHp(state, playerId, 1, "山札切れ");
    return;
  }
  const card = drawOne(player);
  appendLog(state, `${playerLabel(playerId)}は${getCardName(card.cardId)}を引いた`);
}

function readyPreparedMonsters(state: GameState, playerId: PlayerId): void {
  for (const slotKey of PLAYER_SLOT_ORDER[playerId]) {
    const monster = state.slots[slotKey].monster;
    if (monster?.status === "prepared") {
      monster.status = "active";
      monster.actionCount = 0;
      monster.focused = false;
      appendLog(state, `${monsterName(monster)}が登場した`);
    }
  }
}

function autoAdvanceBackRow(state: GameState, playerId: PlayerId): void {
  for (const lane of LANE_ORDER) {
    const backKey = makeSlotKey(playerId, "back", lane);
    const frontKey = makeSlotKey(playerId, "front", lane);
    const back = state.slots[backKey];
    const front = state.slots[frontKey];
    if (back.monster?.status === "active" && !front.monster) {
      const monster = back.monster;
      monster.focused = false;
      front.monster = monster;
      delete back.monster;
      appendLog(state, `${monsterName(monster)}が前衛へ自動移動した`);
    }
  }
}

function resetMonsterActions(state: GameState, playerId: PlayerId): void {
  for (const slotKey of PLAYER_SLOT_ORDER[playerId]) {
    const monster = state.slots[slotKey].monster;
    if (monster?.status === "active") {
      monster.actionCount = 0;
      monster.actionLimit = getMonsterDef(monster.cardId).actionLimit ?? 1;
    }
  }
}

function applyTurnStartTraits(state: GameState, playerId: PlayerId): void {
  for (const slotKey of PLAYER_SLOT_ORDER[playerId]) {
    const monster = state.slots[slotKey].monster;
    if (!monster?.status || monster.status !== "active") {
      continue;
    }
    if (monster.cardId === "card_132") {
      const modifier = randomChance(state, 0.5) ? 1 : -1;
      monster.powerModifier = (monster.powerModifier ?? 0) + modifier;
      appendRandomResultLog(state, "きまぐれ", `${monsterName(monster)}のパワー${modifier > 0 ? "+1" : "-1"}`);
    }
  }
}

function clearExpiredStartTurnEffects(state: GameState, playerId: PlayerId): void {
  for (const slotKey of PLAYER_SLOT_ORDER[playerId]) {
    const monster = state.slots[slotKey].monster;
    if (
      monster?.shielded ||
      monster?.immune ||
      monster?.halfShielded ||
      monster?.oneShotShield ||
      monster?.dragonShield ||
      monster?.dodgeChance ||
      monster?.scapegoat
    ) {
      monster.shielded = false;
      monster.immune = false;
      monster.halfShielded = false;
      monster.oneShotShield = false;
      monster.dragonShield = false;
      monster.dodgeChance = false;
      monster.scapegoat = false;
      appendLog(state, `${monsterName(monster)}の防御効果が切れた`);
    }
  }
}

function focusIdleMonsters(state: GameState, playerId: PlayerId): void {
  for (const slotKey of PLAYER_SLOT_ORDER[playerId]) {
    const monster = state.slots[slotKey].monster;
    if (monster?.status === "active" && monster.actionCount === 0) {
      monster.focused = true;
      appendLog(state, `${monsterName(monster)}は気合いだめした`);
    }
  }
}

function resolveEndTurnFieldEffects(state: GameState, playerId: PlayerId): void {
  for (const slotKey of [...PLAYER_SLOT_ORDER[playerId]]) {
    const monster = state.slots[slotKey].monster;
    if (!monster) {
      continue;
    }
    if (monster.darkHoleSlotKey === slotKey) {
      appendLog(state, `${monsterName(monster)}はダークホールに飲み込まれた`);
      removeMonsterFromField(state, slotKey, "ダークホール");
    } else if (monster.darkHoleSlotKey) {
      monster.darkHoleSlotKey = undefined;
      appendLog(state, `${monsterName(monster)}はダークホールから逃れた`);
    }
  }
}

function clearExpiredEndTurnEffects(state: GameState, playerId: PlayerId): void {
  for (const slotKey of PLAYER_SLOT_ORDER[playerId]) {
    const monster = state.slots[slotKey].monster;
    if (monster) {
      monster.powerUp = false;
      monster.powerModifier = 0;
      monster.powerOverride = undefined;
      monster.cannotMove = false;
      monster.canAttackAnywhere = false;
      monster.stoneCostMultiplier = undefined;
      monster.commandSealed = false;
      monster.cannotActUntilDamaged = false;
      monster.berserkPower = false;
      monster.provokeTargetSlotKey = undefined;
      clearDeathChain(state, slotKey);
      monster.levelFixed = false;
    }
  }
}

function clearEndOfTurnMarkers(state: GameState): void {
  for (const slotKey of FIELD_ORDER) {
    const monster = state.slots[slotKey].monster;
    if (monster) {
      monster.damageGuarded = false;
      monster.masterAttackBlockedUntilTurnEnd = undefined;
    }
  }
  state.turnMoveHistory = [];
  state.turnMasterActionHistory = [];
}

function setMasterActionExchange(state: GameState, expiresOnStartOf: PlayerId): void {
  state.players.player.masterActionsExchanged = true;
  state.players.cpu.masterActionsExchanged = true;
  state.masterActionsExchangeExpiresOnStartOf = expiresOnStartOf;
}

function clearExpiredMasterActionExchange(state: GameState, playerId: PlayerId): void {
  if (state.masterActionsExchangeExpiresOnStartOf !== playerId) {
    return;
  }
  state.players.player.masterActionsExchanged = false;
  state.players.cpu.masterActionsExchanged = false;
  state.masterActionsExchangeExpiresOnStartOf = undefined;
  appendLog(state, "マスター特技の入れ替えが戻った");
}

function recordMoveHistory(
  state: GameState,
  mover: MonsterState,
  fromSlotKey: SlotKey,
  toSlotKey: SlotKey,
  swappedMonster?: MonsterState,
): void {
  state.turnMoveHistory = [
    ...(state.turnMoveHistory ?? []),
    {
      playerId: state.currentPlayer,
      fromSlotKey,
      toSlotKey,
      moverInstanceId: mover.instanceId,
      swappedInstanceId: swappedMonster?.instanceId,
    },
  ];
}

function recordMasterActionHistory(state: GameState, actionId: MasterActionId, target: Target): void {
  state.turnMasterActionHistory = [
    ...(state.turnMasterActionHistory ?? []),
    {
      playerId: state.currentPlayer,
      actionId,
      target,
      turnNumber: state.turnNumber,
    },
  ];
}

function discardToHandLimit(state: GameState, playerId: PlayerId): void {
  const player = state.players[playerId];
  while (player.hand.length > HAND_LIMIT) {
    const discarded = player.hand.shift();
    if (!discarded) {
      return;
    }
    player.discard.push(discarded);
    appendLog(state, `${playerLabel(playerId)}は手札上限で${getCardName(discarded.cardId)}を捨てた`);
  }
}

function damageMasterByPower(
  state: GameState,
  targetPlayerId: PlayerId,
  power: number,
  sourceOrContext: string | DamageContext,
): void {
  const context = damageContext(sourceOrContext);
  const scapegoatSlotKey = findScapegoatSlot(state, targetPlayerId);
  if (scapegoatSlotKey) {
    appendLog(state, `${monsterName(requireTargetMonster(state, scapegoatSlotKey))}がマスターの身代わりになった`);
    damageMonster(state, scapegoatSlotKey, power, {
      ...context,
      source: `${context.source}（身代わり）`,
      ignoreDeathChain: true,
    });
    return;
  }

  const damage = masterDamageByPower(power);
  if (damage === 0) {
    appendLog(state, `${context.source}はマスターシールドで防がれた`);
    return;
  }
  decreaseMasterHp(state, targetPlayerId, damage, context.source);
}

function decreaseMasterHp(state: GameState, playerId: PlayerId, amount: number, source: string): void {
  const player = state.players[playerId];
  const actual = Math.min(player.masterHp, amount);
  player.masterHp -= actual;
  if (actual > 0 && player.masterFrozen) {
    player.masterFrozen = false;
    appendLog(state, `${playerLabel(playerId)}のマスターは動けるようになった`);
  }
  player.stones += actual;
  appendLog(state, `${playerLabel(playerId)}のマスターHPが${actual}減った（${source}）。ストーン+${actual}`);
  if (player.masterHp <= 0) {
    state.winner = opponentOf(playerId);
    appendLog(state, `${playerLabel(opponentOf(playerId))}の勝利`);
  }
}

function damageMonster(
  state: GameState,
  targetSlotKey: SlotKey,
  power: number,
  sourceOrContext: string | DamageContext,
): DefeatedMonster | undefined {
  const context = damageContext(sourceOrContext);
  const slot = state.slots[targetSlotKey];
  const monster = slot.monster;
  if (!monster) {
    throw new Error("対象モンスターがいません");
  }

  if (monster.damageGuarded && context.kind !== "recoil") {
    appendLog(state, `${monsterName(monster)}は仮死状態で攻撃を受けつけなかった`);
    return undefined;
  }

  if (monster.immune) {
    appendLog(state, `${monsterName(monster)}は攻撃を受けつけなかった`);
    return undefined;
  }

  if (monster.dodgeChance && isDodgeableAttackContext(context)) {
    const dodged = randomChance(state, 0.5);
    appendRandomResultLog(state, "女神の加護", `${monsterName(monster)}が${dodged ? "回避" : "被弾"}`);
    if (dodged) {
      appendLog(state, `${monsterName(monster)}は女神の加護で攻撃をかわした`);
      return undefined;
    }
  }

  const ignoresDamageReduction = context.kind === "recoil";
  const damagePreview = ignoresDamageReduction
    ? { damage: power, focusedReduction: 0 }
    : previewMonsterDamage(monster, power);
  const damage = damagePreview.damage;
  if (!ignoresDamageReduction && monster.oneShotShield) {
    monster.oneShotShield = false;
    monster.halfShielded = false;
  }
  if (!ignoresDamageReduction && monster.focused) {
    monster.focused = false;
    if (damagePreview.focusedReduction > 0) {
      appendLog(state, `${monsterName(monster)}は気合いで1ダメージ軽減した`);
    }
  }

  monster.hp -= damage;
  if (damage > 0) {
    monster.cannotActUntilDamaged = false;
  }
  appendLog(state, `${context.source}で${monsterName(monster)}に${damage}ダメージ`);

  if (damage > 0 && !context.ignoreDeathChain) {
    applyDeathChainDamage(state, targetSlotKey, power, context);
  }

  if (monster.hp > 0) {
    applyAfterDamageTraits(state, targetSlotKey, damage, context);
    return undefined;
  }

  return defeatMonster(state, targetSlotKey, context);
}

function isDodgeableAttackContext(context: DamageContext): boolean {
  return context.kind === "command" || context.kind === "master";
}

function defeatMonster(
  state: GameState,
  slotKey: SlotKey,
  sourceOrContext: string | DamageContext = { source: "効果", kind: "effect" },
): DefeatedMonster | undefined {
  const context = damageContext(sourceOrContext);
  const slot = state.slots[slotKey];
  const monster = slot.monster;
  if (!monster) {
    throw new Error("倒す対象がいません");
  }

  if (shouldReincarnateInPlace(monster)) {
    reincarnateMonsterInPlace(state, slotKey);
    return undefined;
  }

  clearDeathChain(state, slotKey);
  const resolution = removeDefeatedMonster(state, slotKey);
  appendLog(state, `${monsterName(resolution.monster)}は倒れ、${playerLabel(resolution.monster.owner)}にストーン${resolution.returnedStones}個が戻った`);
  if (monster.shadowCursed) {
    decreaseMasterHp(state, monster.owner, 1, "かげ呪い");
  }
  applyDefeatCurses(state, monster, context.attackerSlotKey);
  return resolution.defeated;
}

function removeMonsterFromField(state: GameState, slotKey: SlotKey, source: string): void {
  const slot = state.slots[slotKey];
  const monster = slot.monster;
  if (!monster) {
    throw new Error("消す対象がいません");
  }

  clearDeathChain(state, slotKey);
  const owner = state.players[monster.owner];
  const returnedStones = monster.investedStones;
  owner.stones += returnedStones;
  owner.discard.push({ cardId: monster.cardId, instanceId: monster.instanceId });
  delete slot.monster;
  appendLog(state, `${monsterName(monster)}はフィールドを去り、${playerLabel(monster.owner)}にストーン${returnedStones}個が戻った（${source}）`);
  if (monster.shadowCursed) {
    decreaseMasterHp(state, monster.owner, 1, "かげ呪い");
  }
}

function getLevelUpCapacity(state: GameState, attackerSlotKey: SlotKey, defeatedLevel: number): number {
  const attacker = state.slots[attackerSlotKey].monster;
  return levelUpCapacityForMonster(state, attacker, defeatedLevel, attacker ? getPotentialMaxLevel(state, attacker) : 0);
}

function getPotentialMaxLevel(state: GameState, monster: MonsterState): number {
  const def = getMonsterDef(monster.cardId);
  const superEntryLevels = state.players[monster.owner].hand
    .map((card) => getCardDef(card.cardId))
    .filter((card): card is MonsterCardDef => card.type === "monster" && getCardPool(card) === "special" && !!card.evolvesFrom?.includes(monster.cardId))
    .map(superEntryLevel);
  return Math.max(def.maxLevel, ...superEntryLevels);
}

function performLevelUp(state: GameState, attackerSlotKey: SlotKey, levels: number): number {
  const monster = state.slots[attackerSlotKey].monster;
  if (!monster || levels <= 0) {
    return 0;
  }
  if (monster.levelFixed) {
    appendLog(state, `${monsterName(monster)}はレベル固定中のためレベルアップできない`);
    return 0;
  }
  const player = state.players[monster.owner];
  const def = getMonsterDef(monster.cardId);
  const actual = Math.min(levels, def.maxLevel - monster.level, player.stones);
  if (actual <= 0) {
    return 0;
  }
  monster.level += actual;
  monster.investedStones += actual;
  player.stones -= actual;
  monster.hp = getMonsterMaxHp(monster);
  appendLog(state, `${monsterName(monster)}はLv${monster.level}になり、HPが全回復した`);
  return actual;
}

function getSuperLevelUpOptions(state: GameState, slotKey: SlotKey, maxLevels: number): SuperLevelUpOption[] {
  const monster = state.slots[slotKey].monster;
  if (!monster || monster.levelFixed) {
    return [];
  }
  const player = state.players[monster.owner];
  return player.hand
    .filter((card) => {
      const def = getCardDef(card.cardId);
      if (def.type !== "monster" || getCardPool(def) !== "special" || !def.evolvesFrom?.includes(monster.cardId)) {
        return false;
      }
      const requiredLevels = superEntryLevel(def) - monster.level;
      return requiredLevels > 0 && requiredLevels <= maxLevels && requiredLevels <= player.stones;
    })
    .map((card) => ({ handInstanceId: card.instanceId, cardId: card.cardId }));
}

function chooseSuperLevelUpOption(
  state: GameState,
  pending: Pick<NonNullable<GameState["pendingLevelUp"]>, "superOptions">,
): SuperLevelUpOption | undefined {
  return [...(pending.superOptions ?? [])]
    .sort((a, b) => superLevelUpScore(b.cardId) - superLevelUpScore(a.cardId) || getCardName(a.cardId).localeCompare(getCardName(b.cardId), "ja"))[0];
}

function performSuperLevelUp(state: GameState, slotKey: SlotKey, handInstanceId: string): void {
  const slot = state.slots[slotKey];
  const monster = slot.monster;
  if (!monster) {
    throw new Error("スーパー化するモンスターがいません");
  }
  const player = state.players[monster.owner];
  const handIndex = player.hand.findIndex((card) => card.instanceId === handInstanceId);
  if (handIndex < 0) {
    throw new Error("選択したスーパーカードが手札にありません");
  }
  const superCard = player.hand[handIndex];
  const superDef = getMonsterDef(superCard.cardId);
  if (getCardPool(superDef) !== "special" || !superDef.evolvesFrom?.includes(monster.cardId)) {
    throw new Error("対応していないスーパーカードです");
  }
  const entryLevel = superEntryLevel(superDef);
  const requiredLevels = entryLevel - monster.level;
  if (requiredLevels <= 0 || player.stones < requiredLevels) {
    throw new Error("スーパー化に必要なレベルアップ条件を満たしていません");
  }

  const previousName = monsterName(monster);
  player.hand.splice(handIndex, 1);
  player.discard.push({ cardId: monster.cardId, instanceId: monster.instanceId });
  player.stones -= requiredLevels;
  monster.cardId = superCard.cardId;
  monster.instanceId = superCard.instanceId;
  monster.level = entryLevel;
  monster.hp = superDef.levels.find((level) => level.level === entryLevel)?.maxHp ?? superDef.levels[0].maxHp;
  monster.investedStones += requiredLevels;
  monster.actionLimit = superDef.actionLimit ?? 1;
  monster.revivedOnce = false;
  monster.usedCommandIds = undefined;
  appendLog(state, `${previousName}は${superDef.name}にスーパー化した`);
}

function superEntryLevel(def: MonsterCardDef): number {
  return Math.min(...def.levels.map((level) => level.level));
}

function superLevelUpScore(cardId: string): number {
  const def = getMonsterDef(cardId);
  return Math.max(
    ...def.levels.map((level) =>
      level.maxHp * 8 +
      level.commands.reduce((total, command) => total + command.power * 12 + (command.stoneCost ? -command.stoneCost * 4 : 0), 0),
    ),
  ) + (def.rarity ?? 0);
}

function applyRecoil(state: GameState, slotKey: SlotKey, damage: number): void {
  if (state.slots[slotKey].monster) {
    damageMonster(state, slotKey, damage, {
      source: "反動",
      kind: "recoil",
      ignoreCounter: true,
      ignoreDeathChain: true,
    });
  }
}

function getCommandBasePower(
  state: GameState,
  attackerSlot: SlotState,
  command: CommandDef,
  target: Target,
): number {
  if (command.name === "真名之書" && target.kind === "monster") {
    return state.slots[target.slotKey].monster?.level ?? 0;
  }
  if (command.name === "爆雷撃") {
    const power = randomInt(state, 2, 5);
    appendRandomResultLog(state, "爆雷撃", `${power}P`);
    return power;
  }
  if (command.name === "最後の叫び") {
    const attacker = attackerSlot.monster;
    return attacker ? Math.max(0, getMonsterMaxHp(attacker) - attacker.hp) : 0;
  }
  if (command.range === "decreasing_straight" && target.kind === "monster") {
    const distance = rangedDistanceBetweenSlots(attackerSlot, state.slots[target.slotKey]);
    return Math.max(1, command.power - Math.max(0, distance - 1));
  }
  if (command.name === "ドリルブレイク") {
    return drillBreakPower(state, attackerSlot);
  }
  return command.power;
}

function applyUtilityCommandEffect(
  state: GameState,
  attackerSlotKey: SlotKey,
  command: CommandDef,
  target: Target,
  power: number,
  action: CommandAction,
): boolean {
  const attacker = state.slots[attackerSlotKey].monster;
  if (!attacker) {
    return false;
  }

  if (command.name === "レベルダウン" && target.kind === "monster") {
    levelDownMonster(state, target.slotKey);
    return true;
  }

  if (command.name === "レベルムーブ" && target.kind === "monster") {
    const recipientSlotKey = action.secondaryTarget?.kind === "monster"
      ? action.secondaryTarget.slotKey
      : firstLevelUpCandidateSlot(state, target.slotKey);
    if (!recipientSlotKey) {
      throw new Error("レベルムーブのレベルアップ対象がいません");
    }
    levelDownMonster(state, target.slotKey);
    performLevelUp(state, recipientSlotKey, 1);
    return true;
  }

  if (command.name === "ヘブンズドア" && target.kind === "monster") {
    removeMonsterFromField(state, target.slotKey, "ヘブンズドア");
    return true;
  }

  if (command.name === "ホワイトブレス" && target.kind === "monster") {
    const monster = state.slots[target.slotKey].monster;
    if (monster) {
      monster.cannotActUntilDamaged = true;
      appendLog(state, `${monsterName(monster)}は行動できなくなった`);
    }
    return true;
  }

  if (command.name === "マッドホール" && target.kind === "monster") {
    removeMonsterFromField(state, target.slotKey, "マッドホール");
    healMonster(state, attackerSlotKey, 1);
    attacker.powerModifier = (attacker.powerModifier ?? 0) + 1;
    appendLog(state, `${monsterName(attacker)}のパワーが1上がった`);
    return true;
  }

  if (command.name === "それちょうだい" && target.kind === "master") {
    const amount = Math.min(2, state.players[target.playerId].stones);
    state.players[target.playerId].stones -= amount;
    state.players[attacker.owner].stones += amount;
    appendLog(state, `${monsterName(attacker)}はストーン${amount}個を吸収した`);
    return true;
  }

  if (command.name === "パワーチャージ") {
    state.players[attacker.owner].masterPowerBonus = (state.players[attacker.owner].masterPowerBonus ?? 0) + 1;
    appendLog(state, `${playerLabel(attacker.owner)}の次のマスターアタックが1P上がった`);
    removeMonsterFromField(state, attackerSlotKey, "パワーチャージ");
    return true;
  }

  if (command.name === "ドローフォース") {
    const player = state.players[attacker.owner];
    if (player.hand.length <= 4) {
      forceDraw(state, attacker.owner, "ドローフォース");
    } else {
      appendLog(state, "手札が5枚以上のためドローできない");
    }
    return true;
  }

  if (command.name === "レベルアップ") {
    if (attacker.level >= getMonsterDef(attacker.cardId).maxLevel) {
      removeMonsterFromField(state, attackerSlotKey, "レベルアップ");
    } else if (!attacker.levelFixed && state.players[attacker.owner].stones > 0) {
      performLevelUp(state, attackerSlotKey, 1);
    } else {
      appendLog(state, `${monsterName(attacker)}はレベルアップできなかった`);
    }
    return true;
  }

  if (command.name === "夢幻の光" && target.kind === "monster") {
    const targetMonster = requireTargetMonster(state, target.slotKey);
    const maxLevel = getMonsterDef(targetMonster.cardId).maxLevel;
    if (targetMonster.level >= maxLevel) {
      removeMonsterFromField(state, target.slotKey, "夢幻の光");
    } else if (!targetMonster.levelFixed && state.players[targetMonster.owner].stones > 0) {
      performLevelUp(state, target.slotKey, 1);
    } else {
      appendLog(state, `${monsterName(targetMonster)}はレベルアップできなかった`);
    }
    return true;
  }

  if (command.name === "ソウルスイッチ") {
    switchWithHandMonster(state, attackerSlotKey, action.secondaryHandInstanceId);
    return true;
  }

  if (command.name === "ヒーリング" && target.kind === "monster") {
    healMonster(state, target.slotKey, power);
    return true;
  }

  if (command.name === "癒しの光") {
    if (target.kind === "master") {
      healMaster(state, target.playerId, power);
    } else {
      healMonster(state, target.slotKey, power);
    }
    return true;
  }

  if (command.name === "癒しの羽") {
    if (target.kind === "master") {
      healMaster(state, target.playerId, power);
    } else {
      healMonster(state, target.slotKey, power);
    }
    return true;
  }

  if (command.name === "コールドブレス") {
    if (target.kind === "master") {
      state.players[target.playerId].masterFrozen = true;
      appendLog(state, `${playerLabel(target.playerId)}のマスターは動けなくなった`);
    } else {
      const monster = requireTargetMonster(state, target.slotKey);
      monster.cannotActUntilDamaged = true;
      appendLog(state, `${monsterName(monster)}は行動できなくなった`);
    }
    return true;
  }

  if (command.name === "神秘のキノコ" && target.kind === "master") {
    if (target.playerId === attacker.owner) {
      healPlayerMonsters(state, attacker.owner, power);
    } else {
      damagePlayerMonsters(state, target.playerId, power, "神秘のキノコ", attackerSlotKey);
    }
    return true;
  }

  if (command.name === "マナ変化" && target.kind === "monster") {
    transformMonsterKeepingHp(state, target.slotKey, "card_002");
    return true;
  }

  if (command.name === "再生" && target.kind === "monster") {
    resetMonsterToEntry(state, target.slotKey);
    return true;
  }

  if (command.name === "ジャックポット") {
    state.players[attacker.owner].stones += 4;
    appendLog(state, `${playerLabel(attacker.owner)}はジャックポットでストーンを4個得た`);
    return true;
  }

  if (command.name === "ウォッシュ" && target.kind === "monster") {
    clearMonsterEffects(state, target.slotKey, true);
    return true;
  }

  if (command.name === "レベル固定" && target.kind === "monster") {
    const monster = state.slots[target.slotKey].monster;
    if (monster) {
      monster.levelFixed = true;
      appendLog(state, `${monsterName(monster)}のレベルを固定した`);
    }
    return true;
  }

  if (command.name === "福音の花" && target.kind === "monster") {
    if (!state.slots[target.slotKey].monster?.levelFixed) {
      performLevelUp(state, target.slotKey, 1);
    }
    removeMonsterFromField(state, attackerSlotKey, "福音の花");
    return true;
  }

  if (command.name === "ウェイクホーン" && target.kind === "monster") {
    wakeMonster(state, target.slotKey);
    return true;
  }

  if (command.name === "ワープ" && target.kind === "monster") {
    const partnerSlotKey = action.secondaryTarget?.kind === "monster"
      ? action.secondaryTarget.slotKey
      : findSwapPartnerSlot(state, target.slotKey);
    if (!partnerSlotKey) {
      throw new Error("入れ替え相手がいません");
    }
    validateSwapPartner(state, target.slotKey, partnerSlotKey);
    swapMonsters(state, target.slotKey, partnerSlotKey);
    return true;
  }

  if (command.name === "挑発" && target.kind === "monster") {
    const monster = requireTargetMonster(state, target.slotKey);
    monster.provokeTargetSlotKey = attackerSlotKey;
    appendLog(state, `${monsterName(monster)}は${monsterName(attacker)}に挑発された`);
    return true;
  }

  return false;
}

function applyPostDamageCommandEffect(
  state: GameState,
  attackerSlotKey: SlotKey,
  command: CommandDef,
  target: Target,
  power: number,
  defeated: boolean,
): void {
  if (defeated || target.kind !== "monster") {
    return;
  }
  const attacker = state.slots[attackerSlotKey].monster;
  const targetMonster = state.slots[target.slotKey].monster;
  if (!attacker || !targetMonster) {
    return;
  }

  if (command.name === "吸血") {
    healMonster(state, attackerSlotKey, Math.min(1, power));
  }
  if (command.name === "パワーホーン") {
    targetMonster.powerModifier = (targetMonster.powerModifier ?? 0) + 1;
    appendLog(state, `${monsterName(targetMonster)}のパワーが1上がった`);
  }
  if (attacker.cardId === "card_052") {
    clearMonsterEffects(state, target.slotKey, true);
  }
  if (command.name === "爆裂キノコ") {
    for (const slotKey of adjacentSlotKeys(state.slots[target.slotKey])) {
      if (slotKey !== attackerSlotKey && state.slots[slotKey].monster?.status === "active") {
        damageMonster(state, slotKey, Math.max(1, power - 1), {
          source: "爆裂キノコ拡散",
          kind: "effect",
          attackerSlotKey,
        });
      }
    }
  }
  if (command.range === "piercing") {
    damagePiercedTarget(state, target.slotKey, power, command.name, attackerSlotKey);
  }
  if (attacker.cardId === "card_101") {
    targetMonster.damageCurse = true;
    appendLog(state, `${monsterName(targetMonster)}はダメージ呪を受けた`);
  }
}

function getCommandRecoilDamage(command: CommandDef, power: number): number {
  if (command.name === "爆雷撃" || command.recoilDamage === "power") {
    return power;
  }
  return command.recoilDamage ?? 0;
}

function finishCommandSideEffects(
  state: GameState,
  attackerSlotKey: SlotKey,
  command: CommandDef,
  hadBerserkPower: boolean,
  hadDamageCurse: boolean,
): void {
  const attacker = state.slots[attackerSlotKey].monster;
  if (!attacker) {
    return;
  }

  if (command.name === "飛竜ロロ") {
    const previousName = monsterName(attacker);
    attacker.usedCommandIds = [...new Set([...(attacker.usedCommandIds ?? []), command.id])];
    appendLog(state, `${previousName}の飛竜ロロは飛び去り、${monsterName(attacker)}になった`);
  }

  if (attacker.cardId === "card_048" && !isUpperCommand(attacker, command)) {
    retreatBackward(state, attackerSlotKey);
  }

  if (
    (attacker.cardId === "card_073" && !isUpperCommand(attacker, command)) ||
    (attacker.cardId === "card_072" && !isUpperCommand(attacker, command) && attacker.hp >= getMonsterMaxHp(attacker)) ||
    (attacker.cardId === "card_112" && attacker.level >= 3 && !isUpperCommand(attacker, command)) ||
    command.name === "最後の叫び"
  ) {
    removeMonsterFromField(state, attackerSlotKey, "特技後離脱");
    return;
  }

  if (command.name === "エアロターン") {
    rotatePlayerMonsters(state, opponentOf(attacker.owner));
  }

  if (hadBerserkPower) {
    applyRecoil(state, attackerSlotKey, 1);
  }
  if (hadDamageCurse) {
    applyDamageCurseAfterAction(state, attackerSlotKey);
  }
}

function shouldCommandMiss(state: GameState, attacker: MonsterState, command: CommandDef): boolean {
  if (attacker.cardId !== "card_039" || isUpperCommand(attacker, command)) {
    return false;
  }
  const missed = randomChance(state, 0.5);
  appendRandomResultLog(state, command.name, `${monsterName(attacker)}が${missed ? "空振り" : "命中"}`);
  return missed;
}

function applyAfterDamageTraits(
  state: GameState,
  targetSlotKey: SlotKey,
  damage: number,
  context: DamageContext,
): void {
  const monster = state.slots[targetSlotKey].monster;
  if (!monster || damage <= 0) {
    return;
  }

  if (monster.cardId === "card_077") {
    monster.damageGuarded = true;
    appendLog(state, `${monsterName(monster)}は仮死状態になった`);
  }

  if (monster.cardId === "card_080") {
    retreatBackward(state, targetSlotKey);
  }

  if (monster.cardId === "card_081") {
    const frontSlotKey = slotInFrontOf(state.slots[targetSlotKey]);
    if (frontSlotKey && state.slots[frontSlotKey].monster?.status === "active") {
      healMonster(state, frontSlotKey, 1);
      appendLog(state, `${monsterName(monster)}の献身が発動した`);
    }
  }

  if (monster.cardId === "card_142") {
    state.players[monster.owner].stones += 2;
    appendLog(state, `${monsterName(monster)}の自己犠牲でストーンを2個得た`);
  }

  if (!context.ignoreCounter && monster.cardId === "card_109") {
    applyNutsRockleAutoCounter(state, targetSlotKey, monster);
  }

  if (context.ignoreCounter || !context.attackerSlotKey || !state.slots[context.attackerSlotKey].monster) {
    return;
  }

  if (monster.dragonShield) {
    damageMonster(state, context.attackerSlotKey, 1, {
      source: "竜の盾反撃",
      kind: "effect",
      attackerSlotKey: targetSlotKey,
      ignoreCounter: true,
      ignoreDeathChain: true,
    });
  }

  if (monster.cardId === "card_102" && monster.level >= 2) {
    damageMonster(state, context.attackerSlotKey, getMonsterCommands(monster)[0]?.power ?? 2, {
      source: "反撃LV2",
      kind: "effect",
      attackerSlotKey: targetSlotKey,
      ignoreCounter: true,
      ignoreDeathChain: true,
    });
  }

  if (monster.cardId === "card_103" && monster.level >= 3) {
    damageMonster(state, context.attackerSlotKey, getMonsterCommands(monster)[0]?.power ?? 3, {
      source: "反撃LV3",
      kind: "effect",
      attackerSlotKey: targetSlotKey,
      ignoreCounter: true,
      ignoreDeathChain: true,
    });
  }
}

function applyNutsRockleAutoCounter(state: GameState, targetSlotKey: SlotKey, monster: MonsterState): void {
  const frontSlotKey = slotInFrontOf(state.slots[targetSlotKey]);
  const frontMonster = frontSlotKey ? state.slots[frontSlotKey].monster : undefined;
  if (!frontSlotKey || frontMonster?.status !== "active") {
    return;
  }
  appendLog(state, `${monsterName(monster)}のやつあたりが発動した`);
  damageMonster(state, frontSlotKey, getMonsterCommands(monster)[0]?.power ?? 1, {
    source: "やつあたり",
    kind: "effect",
    attackerSlotKey: targetSlotKey,
    ignoreCounter: true,
  });
}

function applyDeathChainDamage(
  state: GameState,
  targetSlotKey: SlotKey,
  power: number,
  context: DamageContext,
): void {
  const monster = state.slots[targetSlotKey].monster;
  const linkedSlotKey = monster?.deathChainSlotKey;
  if (!linkedSlotKey || !state.slots[linkedSlotKey].monster) {
    return;
  }
  damageMonster(state, linkedSlotKey, power, {
    ...context,
    source: "デスチェーン",
    kind: "effect",
    ignoreDeathChain: true,
  });
}

function shouldReincarnateInPlace(monster: MonsterState): boolean {
  return (monster.cardId === "card_035" || monster.cardId === "card_067") && !monster.revivedOnce;
}

function reincarnateMonsterInPlace(state: GameState, slotKey: SlotKey): void {
  const monster = requireTargetMonster(state, slotKey);
  monster.revivedOnce = true;
  monster.hp = getMonsterMaxHp(monster);
  monster.focused = false;
  monster.powerUp = false;
  monster.powerModifier = 0;
  monster.powerOverride = undefined;
  monster.shielded = false;
  monster.halfShielded = false;
  monster.oneShotShield = false;
  monster.actionCount = monster.actionLimit;
  appendLog(state, `${monsterName(monster)}は復活した`);
}

function applyDefeatCurses(state: GameState, defeatedMonster: MonsterState, attackerSlotKey?: SlotKey): void {
  if (!attackerSlotKey) {
    return;
  }
  const attacker = state.slots[attackerSlotKey].monster;
  if (!attacker) {
    return;
  }
  if (defeatedMonster.cardId === "card_099") {
    attacker.stoneCurse = true;
    appendLog(state, `${monsterName(attacker)}はストーン呪を受けた`);
  }
  if (defeatedMonster.cardId === "card_100") {
    attacker.damageCurse = true;
    appendLog(state, `${monsterName(attacker)}はダメージ呪を受けた`);
  }
}

function getLevelUpRecipientSlotKey(state: GameState, attackerSlotKey: SlotKey, defeatedLevel: number): SlotKey {
  const attacker = state.slots[attackerSlotKey].monster;
  if (attacker?.cardId !== "card_046") {
    return attackerSlotKey;
  }
  return PLAYER_SLOT_ORDER[attacker.owner].find((slotKey) => {
    if (slotKey === attackerSlotKey) {
      return false;
    }
    return getLevelUpCapacity(state, slotKey, defeatedLevel) > 0;
  }) ?? attackerSlotKey;
}

function getMonsterActionExtraCost(monster: MonsterState): number {
  return monster.stoneCurse ? 2 : 0;
}

function isMonsterActionBlocked(state: GameState, slotKey: SlotKey): boolean {
  const monster = state.slots[slotKey].monster;
  if (!monster) {
    return true;
  }
  if (monster.cannotActUntilDamaged) {
    return true;
  }
  if (!monster.provokeTargetSlotKey) {
    return false;
  }
  return getMonsterCommands(monster).some((command) =>
    getCommandTargetsUnchecked(state, slotKey, command)
      .some((target) => target.kind === "monster" && target.slotKey === monster.provokeTargetSlotKey),
  );
}

function applyDamageCurseAfterAction(state: GameState, slotKey: SlotKey): void {
  const monster = state.slots[slotKey].monster;
  if (!monster?.damageCurse) {
    return;
  }
  monster.hp = Math.min(monster.hp, 1);
  monster.damageCurse = false;
  appendLog(state, `${monsterName(monster)}はダメージ呪でHPが1になった`);
}

function retreatBackward(state: GameState, slotKey: SlotKey): void {
  const slot = state.slots[slotKey];
  const monster = slot.monster;
  const backSlotKey = slot.row === "front" ? makeSlotKey(slot.owner, "back", slot.lane) : undefined;
  if (!monster || !backSlotKey || state.slots[backSlotKey].monster) {
    return;
  }
  state.slots[backSlotKey].monster = monster;
  delete state.slots[slotKey].monster;
  clearDarkHoleIfMoved(monster, backSlotKey);
  appendLog(state, `${monsterName(monster)}は後退した`);
}

function slotInFrontOf(slot: SlotState): SlotKey | undefined {
  if (slot.row === "back") {
    return makeSlotKey(slot.owner, "front", slot.lane);
  }
  return makeSlotKey(opponentOf(slot.owner), "front", slot.lane);
}

function clearDarkHoleIfMoved(monster: MonsterState, nextSlotKey: SlotKey): void {
  if (monster.darkHoleSlotKey && monster.darkHoleSlotKey !== nextSlotKey) {
    monster.darkHoleSlotKey = undefined;
  }
}

function validateDeathChainPair(state: GameState, aSlotKey: SlotKey, bSlotKey: SlotKey): void {
  const a = state.slots[aSlotKey];
  const b = state.slots[bSlotKey];
  if (!a.monster || !b.monster || a.owner === b.owner) {
    throw new Error("デスチェーンは敵味方1体ずつにかけます");
  }
}

function clearDeathChain(state: GameState, slotKey: SlotKey): void {
  const monster = state.slots[slotKey].monster;
  const linkedSlotKey = monster?.deathChainSlotKey;
  if (linkedSlotKey && state.slots[linkedSlotKey].monster?.deathChainSlotKey === slotKey) {
    state.slots[linkedSlotKey].monster.deathChainSlotKey = undefined;
  }
  if (monster) {
    monster.deathChainSlotKey = undefined;
  }
}

function findScapegoatSlot(state: GameState, playerId: PlayerId): SlotKey | undefined {
  return PLAYER_SLOT_ORDER[playerId].find((slotKey) => {
    const monster = state.slots[slotKey].monster;
    return monster?.status === "active" && monster.scapegoat;
  });
}

function consumeAttackPowerBonuses(monster: MonsterState, command: CommandDef, basePower: number): number {
  let power = monster.powerOverride ?? basePower;
  if (monster.focused) {
    if (isUpperCommand(monster, command)) {
      power += 1;
    }
    monster.focused = false;
  }
  if (monster.powerUp) {
    power += 1;
    monster.powerUp = false;
  }
  if (monster.berserkPower) {
    power += 1;
    monster.berserkPower = false;
  }
  power += monster.powerModifier ?? 0;
  monster.powerModifier = 0;
  monster.powerOverride = undefined;
  return power;
}

function drillBreakPower(state: GameState, attackerSlot: SlotState): number {
  const attacker = attackerSlot.monster;
  const partnerSlotKey = drillBreakPartnerSlotKey(state, attackerSlot);
  if (!attacker || !partnerSlotKey) {
    return 0;
  }
  const partner = state.slots[partnerSlotKey].monster;
  if (!partner) {
    return 0;
  }
  return (getMonsterCommands(attacker)[0]?.power ?? 0) + (getMonsterCommands(partner)[0]?.power ?? 0);
}

function consumeDrillBreakPartnerAction(state: GameState, attackerSlot: SlotState): void {
  const partnerSlotKey = drillBreakPartnerSlotKey(state, attackerSlot);
  const partner = partnerSlotKey ? state.slots[partnerSlotKey].monster : undefined;
  if (!partner) {
    return;
  }
  partner.actionCount = partner.actionLimit;
  partner.focused = false;
}

function sweepingAttackSlot(state: GameState, attackerSlotKey: SlotKey): SlotState {
  const attackerSlot = state.slots[attackerSlotKey];
  const destinationSlotKey = sweepingDestinationSlotKey(attackerSlot);
  return destinationSlotKey ? state.slots[destinationSlotKey] : attackerSlot;
}

function advanceSweepingAttacker(state: GameState, attackerSlotKey: SlotKey): SlotKey {
  const from = state.slots[attackerSlotKey];
  const attacker = from.monster;
  const destinationSlotKey = sweepingDestinationSlotKey(from);
  if (!attacker || !destinationSlotKey) {
    return attackerSlotKey;
  }

  const to = state.slots[destinationSlotKey];
  clearDarkHoleIfMoved(attacker, destinationSlotKey);
  if (to.monster) {
    const other = to.monster;
    clearDarkHoleIfMoved(other, attackerSlotKey);
    to.monster = attacker;
    from.monster = other;
    appendLog(state, `${monsterName(attacker)}は前方へ瞬間移動し、${monsterName(other)}と入れ替わった`);
  } else {
    to.monster = attacker;
    delete from.monster;
    appendLog(state, `${monsterName(attacker)}は前方へ瞬間移動した`);
  }
  return destinationSlotKey;
}

function sweepingDestinationSlotKey(attackerSlot: SlotState): SlotKey | undefined {
  if (attackerSlot.row !== "back") {
    return undefined;
  }
  return makeSlotKey(attackerSlot.owner, "front", attackerSlot.lane);
}

function levelDownMonster(state: GameState, slotKey: SlotKey): void {
  const monster = state.slots[slotKey].monster;
  if (!monster) {
    throw new Error("レベルダウン対象がいません");
  }
  if (monster.level <= 1 || monster.levelFixed) {
    appendLog(state, `${monsterName(monster)}はレベルダウンしなかった`);
    return;
  }
  const def = getMonsterDef(monster.cardId);
  const nextLevel = monster.level - 1;
  if (!def.levels.some((level) => level.level === nextLevel) && getCardPool(def) === "special") {
    appendLog(state, `${monsterName(monster)}はレベルダウンでスーパー化を保てなかった`);
    defeatMonster(state, slotKey, { source: "レベルダウン", kind: "effect" });
    return;
  }
  monster.level -= 1;
  const returnedStone = Math.min(monster.investedStones - 1, 1);
  monster.investedStones -= returnedStone;
  state.players[monster.owner].stones += returnedStone;
  monster.hp = Math.min(monster.hp, getMonsterMaxHp(monster));
  appendLog(state, `${monsterName(monster)}はLv${monster.level}になった`);
}

function healMonster(state: GameState, slotKey: SlotKey, amount: number): void {
  const monster = state.slots[slotKey].monster;
  if (!monster) {
    throw new Error("回復対象がいません");
  }
  const before = monster.hp;
  monster.hp = Math.min(getMonsterMaxHp(monster), monster.hp + amount);
  appendLog(state, `${monsterName(monster)}を${monster.hp - before}回復した`);
  if (monster.cardId === "card_044" && monster.hp > before) {
    monster.powerModifier = (monster.powerModifier ?? 0) + 1;
    appendLog(state, `${monsterName(monster)}はヒールアップでパワーが1上がった`);
  }
}

function healMaster(state: GameState, playerId: PlayerId, amount: number): void {
  const player = state.players[playerId];
  const before = player.masterHp;
  player.masterHp = Math.min(MASTER_HP, player.masterHp + amount);
  appendLog(state, `${playerLabel(playerId)}のマスターHPを${player.masterHp - before}回復した`);
}

function clearMonsterEffects(state: GameState, slotKey: SlotKey, includePowerAndShield: boolean): void {
  const monster = state.slots[slotKey].monster;
  if (!monster) {
    throw new Error("効果解除対象がいません");
  }
  monster.focused = false;
  monster.cannotMove = false;
  monster.levelFixed = false;
  monster.immune = false;
  monster.reviveOnDefeat = false;
  monster.shadowCursed = false;
  monster.scapegoat = false;
  monster.canAttackAnywhere = false;
  monster.stoneCostMultiplier = undefined;
  monster.commandSealed = false;
  monster.cannotActUntilDamaged = false;
  monster.dodgeChance = false;
  monster.provokeTargetSlotKey = undefined;
  clearDeathChain(state, slotKey);
  monster.darkHoleSlotKey = undefined;
  if (!monster.hollow) {
    monster.stoneCurse = false;
  }
  monster.damageCurse = false;
  if (includePowerAndShield) {
    monster.powerUp = false;
    monster.powerModifier = 0;
    monster.powerOverride = undefined;
    monster.shielded = false;
    monster.halfShielded = false;
    monster.oneShotShield = false;
    monster.berserkPower = false;
    monster.dragonShield = false;
  }
  appendLog(state, `${monsterName(monster)}の効果を消した`);
}

function switchWithHandMonster(state: GameState, slotKey: SlotKey, handInstanceId?: string): void {
  const slot = state.slots[slotKey];
  const current = slot.monster;
  if (!current) {
    throw new Error("入れ替え元がいません");
  }
  const player = state.players[current.owner];
  const handIndex = handInstanceId
    ? player.hand.findIndex((card) => card.instanceId === handInstanceId && isSummonableMonsterCard(card.cardId))
    : player.hand.findIndex((card) => isSummonableMonsterCard(card.cardId));
  if (handIndex < 0) {
    appendLog(state, "手札に入れ替えられるモンスターがいない");
    return;
  }
  const [nextCard] = player.hand.splice(handIndex, 1);
  player.discard.push({ cardId: current.cardId, instanceId: current.instanceId });
  const def = getMonsterDef(nextCard.cardId);
  const level = Math.min(current.level, def.maxLevel);
  const levelDef = def.levels.find((item) => item.level === level) ?? def.levels[0];
  slot.monster = {
    instanceId: nextCard.instanceId,
    cardId: nextCard.cardId,
    owner: current.owner,
    hp: levelDef.maxHp,
    level: levelDef.level,
    status: "active",
    investedStones: Math.max(1, levelDef.level),
    actionCount: 1,
    actionLimit: def.actionLimit ?? 1,
    focused: false,
    powerUp: false,
    shielded: false,
    stoneCurse: nextCard.cardId === "card_144" ? true : undefined,
    hollow: nextCard.cardId === "card_144" ? true : undefined,
  };
  appendLog(state, `${monsterName(current)}は${def.name}と入れ替わった`);
}

function wakeMonster(state: GameState, slotKey: SlotKey): void {
  const monster = state.slots[slotKey].monster;
  if (!monster) {
    throw new Error("ウェイクアップ対象がいません");
  }
  monster.status = "active";
  monster.actionCount = 0;
  monster.actionLimit = getMonsterDef(monster.cardId).actionLimit ?? 1;
  appendLog(state, `${monsterName(monster)}が登場した`);
}

function damagePiercedTarget(state: GameState, targetSlotKey: SlotKey, power: number, source: string, attackerSlotKey?: SlotKey): void {
  const targetSlot = state.slots[targetSlotKey];
  const behindSlotKey = makeSlotKey(targetSlot.owner, targetSlot.row === "front" ? "back" : "front", targetSlot.lane);
  const behind = state.slots[behindSlotKey]?.monster;
  if (!behind || behind.status !== "active") {
    return;
  }
  damageMonster(state, behindSlotKey, power, {
    source: `${source}貫通`,
    kind: "effect",
    attackerSlotKey,
  });
}

function isUpperCommand(monster: MonsterState, command: CommandDef): boolean {
  return getMonsterCommands(monster)[0]?.id === command.id;
}

function getCommand(monster: MonsterState, commandId: string): CommandDef {
  const command = getMonsterCommands(monster).find((item) => item.id === commandId);
  if (command) {
    return command;
  }
  const fallback = getMonsterDef(monster.cardId).levels
    .filter((level) => level.level === monster.level)
    .flatMap((level) => level.commands)
    .find((item) => item.id === commandId);
  if (!fallback) {
    throw new Error("指定したコマンドがありません");
  }
  return fallback;
}

function getCommandStoneCost(monster: MonsterState, command: CommandDef): number {
  return (command.stoneCost ?? 0) * (monster.stoneCostMultiplier ?? 1);
}

function getMonsterLevelDef(monster: MonsterState) {
  const def = getMonsterDef(monster.cardId);
  const candidates = def.levels.filter((item) => item.level === monster.level);
  const level = selectMonsterLevelForm(monster, candidates);
  if (!level) {
    throw new Error("モンスターレベル定義がありません");
  }
  return level;
}

function selectMonsterLevelForm(
  monster: MonsterState,
  candidates: ReturnType<typeof getMonsterDef>["levels"],
) {
  if (candidates.length <= 1) {
    return candidates[0];
  }
  if (monster.cardId === "card_035" || monster.cardId === "card_067") {
    return monster.revivedOnce ? candidates[candidates.length - 1] : candidates[0];
  }
  if (monster.cardId === "card_045") {
    return monster.usedCommandIds?.includes("飛竜ロロ") ? candidates[candidates.length - 1] : candidates[0];
  }
  return candidates[0];
}

function getMonsterMaxHp(monster: MonsterState): number {
  return getMonsterLevelDef(monster).maxHp;
}

function ensureActionAllowed(state: GameState): void {
  if (state.winner) {
    throw new Error("勝敗が決まっています");
  }
  if (state.pendingLevelUp) {
    throw new Error("先にレベルアップを解決してください");
  }
}

function monsterName(monster: MonsterState): string {
  return `${getMonsterDisplayName(monster)} Lv${monster.level}`;
}

function isSameTarget(a: Target, b: Target): boolean {
  return isSameTargetFromTargeting(a, b);
}

function damageContext(sourceOrContext: string | DamageContext): DamageContext {
  return createDamageContext(sourceOrContext);
}

function categoryLabel(category: NonNullable<MagicAction["searchCategory"]>): string {
  if (category === "front") {
    return "前衛";
  }
  if (category === "back") {
    return "後衛";
  }
  if (category === "special") {
    return "スーパー";
  }
  return "魔法";
}
