import {
  buildDeck,
  getCardDef,
  getCardName,
  getMonsterDef,
} from "./cards";
import { applyCpuDecision, chooseCpuDecision } from "./cpuAi";
import type {
  CardInstance,
  CommandAction,
  CommandDef,
  GameState,
  MagicAction,
  MasterActionId,
  MonsterCardDef,
  MonsterState,
  PlayerState,
  PlayerId,
  Row,
  Lane,
  SlotKey,
  SlotState,
  Target,
} from "./types";

const MASTER_HP = 10;
const HAND_LIMIT = 5;
const MASTER_ATTACK_COST = 3;
const MASTER_ATTACK_POWER = 2;
const WAKE_UP_COST = 2;
const SHIELD_COST = 2;
const PLAYER_ORDER: PlayerId[] = ["player", "cpu"];
const ROW_ORDER: Row[] = ["front", "back"];
const LANE_ORDER: Lane[] = ["left", "right"];

export const PLAYER_SLOT_ORDER: Record<PlayerId, SlotKey[]> = {
  player: ["player_front_left", "player_front_right", "player_back_left", "player_back_right"],
  cpu: ["cpu_front_left", "cpu_front_right", "cpu_back_left", "cpu_back_right"],
};

export const FIELD_ORDER: SlotKey[] = [
  "cpu_back_left",
  "cpu_back_right",
  "cpu_front_left",
  "cpu_front_right",
  "player_front_left",
  "player_front_right",
  "player_back_left",
  "player_back_right",
];

interface DefeatedMonster {
  owner: PlayerId;
  cardId: string;
  level: number;
  investedStones: number;
}

interface DamageContext {
  source: string;
  kind: "command" | "magic" | "master" | "effect" | "recoil";
  attackerSlotKey?: SlotKey;
  ignoreCounter?: boolean;
  ignoreDeathChain?: boolean;
}

export function createInitialGame(seed = Date.now()): GameState {
  const playerDeck = shuffle(buildDeck("player", seed + 101), seed + 1);
  const cpuDeck = shuffle(buildDeck("cpu", seed + 202), seed + 2);
  const state: GameState = {
    players: {
      player: createPlayer("player", playerDeck),
      cpu: createPlayer("cpu", cpuDeck),
    },
    slots: createSlots(),
    currentPlayer: "player",
    turnNumber: 0,
    randomSeed: seed >>> 0,
    log: ["バトル開始"],
  };

  drawOpeningHand(state.players.player);
  drawOpeningHand(state.players.cpu);
  return startTurn(state, "player");
}

export function startTurn(state: GameState, playerId: PlayerId): GameState {
  const next = cloneState(state);
  if (next.winner) {
    return next;
  }

  next.currentPlayer = playerId;
  if (playerId === "player") {
    next.turnNumber += 1;
  }

  const player = next.players[playerId];
  appendLog(next, `${playerLabel(playerId)}のターン開始`);

  readyPreparedMonsters(next, playerId);
  autoAdvanceBackRow(next, playerId);
  resetMonsterActions(next, playerId);
  applyTurnStartTraits(next, playerId);

  player.stones += 3;
  appendLog(next, `${playerLabel(playerId)}はストーンを3個得た`);
  clearExpiredStartTurnEffects(next, playerId);

  const shouldDraw = !(playerId === "player" && player.turnsStarted === 0);
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

export function runCpuStep(state: GameState): GameState {
  const next = cloneState(state);
  if (next.currentPlayer !== "cpu" || next.winner || next.pendingLevelUp) {
    return next;
  }
  return applyCpuDecision(next, chooseCpuDecision(next));
}

export function runAutoStep(state: GameState): GameState {
  if (state.winner) {
    return cloneState(state);
  }
  if (state.pendingLevelUp) {
    return resolveLevelUp(state, state.pendingLevelUp.maxLevels);
  }

  const next = cloneState(state);
  return applyCpuDecision(next, chooseCpuDecision(next));
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

  next.players[mover.owner].stones -= actionCost;
  mover.actionCount += 1;
  mover.focused = false;
  clearDarkHoleIfMoved(mover, toSlotKey);

  if (to.monster) {
    const other = to.monster;
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

  if (action.target.kind === "master") {
    damageMasterByPower(next, action.target.playerId, power, {
      source: command.name,
      kind: "command",
      attackerSlotKey: action.attackerSlotKey,
    });
    finishCommandSideEffects(next, action.attackerSlotKey, command, hadBerserkPower, hadDamageCurse);
    if (!next.winner && command.recoilDamage) {
      applyRecoil(next, action.attackerSlotKey, command.recoilDamage);
    }
    return next;
  }

  const defeated = damageMonster(next, action.target.slotKey, power, {
    source: command.name,
    kind: "command",
    attackerSlotKey: action.attackerSlotKey,
  });
  applyPostDamageCommandEffect(next, action.attackerSlotKey, command, action.target, power, !!defeated);
  if (!defeated) {
    finishCommandSideEffects(next, action.attackerSlotKey, command, hadBerserkPower, hadDamageCurse);
    const recoilDamage = getCommandRecoilDamage(command, power);
    if (recoilDamage) {
      applyRecoil(next, action.attackerSlotKey, recoilDamage);
    }
    return next;
  }

  if (defeated.owner === attacker.owner) {
    decreaseMasterHp(next, attacker.owner, 1, "味方撃破ペナルティ");
    finishCommandSideEffects(next, action.attackerSlotKey, command, hadBerserkPower, hadDamageCurse);
    const recoilDamage = getCommandRecoilDamage(command, power);
    if (!next.winner && recoilDamage) {
      applyRecoil(next, action.attackerSlotKey, recoilDamage);
    }
    return next;
  }

  const levelUpSlotKey = getLevelUpRecipientSlotKey(next, action.attackerSlotKey, defeated.level);
  const maxLevels = getLevelUpCapacity(next, levelUpSlotKey, defeated.level);
  if (maxLevels > 0 && next.currentPlayer === "player") {
    finishCommandSideEffects(next, action.attackerSlotKey, command, hadBerserkPower, hadDamageCurse);
    if (!next.slots[levelUpSlotKey].monster) {
      return next;
    }
    next.pendingLevelUp = {
      playerId: "player",
      attackerSlotKey: levelUpSlotKey,
      maxLevels,
      recoilDamage: getCommandRecoilDamage(command, power),
    };
    appendLog(next, `${monsterName(attacker)}は${maxLevels}レベルまで上げられる`);
    return next;
  }

  if (maxLevels > 0) {
    performLevelUp(next, levelUpSlotKey, maxLevels);
  }
  finishCommandSideEffects(next, action.attackerSlotKey, command, hadBerserkPower, hadDamageCurse);
  const recoilDamage = getCommandRecoilDamage(command, power);
  if (recoilDamage) {
    applyRecoil(next, action.attackerSlotKey, recoilDamage);
  }
  return next;
}

export function resolveLevelUp(state: GameState, levels: number): GameState {
  const next = cloneState(state);
  const pending = next.pendingLevelUp;
  if (!pending) {
    throw new Error("レベルアップ待ちではありません");
  }
  if (levels < 0 || levels > pending.maxLevels) {
    throw new Error("選択できないレベルアップ数です");
  }

  if (levels > 0) {
    performLevelUp(next, pending.attackerSlotKey, levels);
  } else {
    appendLog(next, "レベルアップしなかった");
  }

  const recoilDamage = pending.recoilDamage;
  const attackerSlotKey = pending.attackerSlotKey;
  delete next.pendingLevelUp;

  if (recoilDamage > 0 && !next.winner) {
    applyRecoil(next, attackerSlotKey, recoilDamage);
  }

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

export function useMasterHpDraw(state: GameState): GameState {
  const next = cloneState(state);
  ensureActionAllowed(next);

  const player = next.players[next.currentPlayer];
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
  if (player.stones < cost) {
    throw new Error("マスター特技に必要なストーンが足りません");
  }
  player.stones -= cost;

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

  monster.shielded = true;
  appendLog(next, `${playerLabel(next.currentPlayer)}は${monsterName(monster)}にシールドを張った`);
  return next;
}

export function getCommandTargets(
  state: GameState,
  attackerSlotKey: SlotKey,
  commandId: string,
): Target[] {
  if (state.winner || state.pendingLevelUp) {
    return [];
  }
  const slot = state.slots[attackerSlotKey];
  const monster = slot.monster;
  if (!monster || monster.owner !== state.currentPlayer || monster.status !== "active") {
    return [];
  }
  if (monster.actionCount >= monster.actionLimit) {
    return [];
  }

  const command = getCommand(monster, commandId);
  if (monster.cannotActUntilDamaged) {
    return [];
  }
  if (isSpecialCommandSealed(state, attackerSlotKey, command)) {
    return [];
  }
  const actor = state.players[state.currentPlayer];
  if (getCommandStoneCost(monster, command) + getMonsterActionExtraCost(monster) > actor.stones) {
    return [];
  }

  return applyProvokeRestriction(state, attackerSlotKey, command, getCommandTargetsUnchecked(state, attackerSlotKey, command));
}

function getCommandTargetsUnchecked(
  state: GameState,
  attackerSlotKey: SlotKey,
  command: CommandDef,
): Target[] {
  const slot = state.slots[attackerSlotKey];
  const monster = slot.monster;
  if (!monster) {
    return [];
  }

  const opponent = opponentOf(monster.owner);
  const activeMonsterTargets = monsterTargets(state, {
    excludeSlotKey: attackerSlotKey,
    activeOnly: true,
  });
  const allMonsterTargets = monsterTargets(state, {
    excludeSlotKey: attackerSlotKey,
    activeOnly: false,
  });

  if (isSelfTargetCommand(command)) {
    return [{ kind: "monster", slotKey: attackerSlotKey }];
  }
  if (command.name === "それちょうだい") {
    return [{ kind: "master", playerId: opponent }];
  }
  if (command.name === "レベルダウン") {
    return activeMonsterTargets.filter((target) => {
      const targetMonster = target.kind === "monster" ? state.slots[target.slotKey].monster : undefined;
      return !!targetMonster && targetMonster.level > 1 && !targetMonster.levelFixed;
    });
  }
  if (command.name === "ヘブンズドア") {
    return activeMonsterTargets;
  }
  if (command.name === "ホワイトブレス") {
    return activeMonsterTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].owner === opponent);
  }
  if (command.name === "マッドホール") {
    return activeMonsterTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].owner === monster.owner);
  }
  if (command.name === "ヒーリング") {
    return activeMonsterTargets.filter((target) => target.kind === "monster");
  }
  if (command.name === "癒しの光") {
    return [
      ...activeMonsterTargets.filter((target) => target.kind === "monster"),
      { kind: "master", playerId: monster.owner },
    ];
  }
  if (command.name === "ウォッシュ" || command.name === "レベル固定") {
    return activeMonsterTargets;
  }
  if (command.name === "福音の花") {
    return activeMonsterTargets.filter((target) => {
      const targetMonster = target.kind === "monster" ? state.slots[target.slotKey].monster : undefined;
      if (!targetMonster || targetMonster.levelFixed) {
        return false;
      }
      return targetMonster.level < getMonsterDef(targetMonster.cardId).maxLevel;
    });
  }
  if (command.name === "ウェイクホーン") {
    return allMonsterTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].monster?.status === "prepared");
  }
  if (command.name === "ブレイクホーン") {
    return allMonsterTargets;
  }
  if (command.name === "ワープ") {
    return activeMonsterTargets.filter((target) => target.kind === "monster" && findSwapPartnerSlot(state, target.slotKey));
  }
  if (command.name === "挑発") {
    return activeMonsterTargets.filter((target) => target.kind === "monster" && target.slotKey !== attackerSlotKey);
  }
  if (command.rangeText === "前衛攻撃") {
    if (hasActiveAllyCard(state, monster.owner, "card_084")) {
      return activeMonsterTargets;
    }
    return activeMonsterTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].row === "front");
  }
  if (command.rangeText === "後衛攻撃") {
    if (hasActiveAllyCard(state, monster.owner, "card_083")) {
      return activeMonsterTargets;
    }
    return activeMonsterTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].row === "back");
  }
  if (command.rangeText === "ラオンソード" || command.rangeText === "レオンソード") {
    return rangeTargets(state, slot, command, activeMonsterTargets, opponent, "adjacent");
  }

  if (command.range === "any_monster") {
    return activeMonsterTargets;
  }
  if (command.range === "any_target") {
    return [...activeMonsterTargets, { kind: "master", playerId: opponent }];
  }
  if (command.range === "master") {
    return [{ kind: "master", playerId: opponent }];
  }
  if (monster.canAttackAnywhere && command.id === "attack") {
    return [...activeMonsterTargets, { kind: "master", playerId: opponent }];
  }

  return rangeTargets(state, slot, command, activeMonsterTargets, opponent, command.range);
}

function monsterTargets(
  state: GameState,
  options: { excludeSlotKey?: SlotKey; activeOnly: boolean },
): Target[] {
  return FIELD_ORDER
    .filter((slotKey) => slotKey !== options.excludeSlotKey)
    .filter((slotKey) => {
      const monster = state.slots[slotKey].monster;
      return !!monster && (!options.activeOnly || monster.status === "active");
    })
    .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
}

function rangeTargets(
  state: GameState,
  attackerSlot: SlotState,
  command: CommandDef,
  activeMonsterTargets: Target[],
  opponent: PlayerId,
  range: CommandDef["range"],
): Target[] {
  const targets = activeMonsterTargets.filter((target) => {
    if (target.kind !== "monster") {
      return false;
    }
    const targetSlot = state.slots[target.slotKey];
    return isTargetInCommandRange(attackerSlot, targetSlot, command, range);
  });

  if (isOpponentMasterInCommandRange(attackerSlot, opponent, command, range)) {
    targets.push({ kind: "master", playerId: opponent });
  }

  return targets;
}

function isSelfTargetCommand(command: CommandDef): boolean {
  return (
    command.name === "パワーチャージ" ||
    command.name === "ドローフォース" ||
    command.name === "レベルアップ" ||
    command.name === "ソウルスイッチ"
  );
}

function hasActiveAllyCard(state: GameState, playerId: PlayerId, cardId: string): boolean {
  return PLAYER_SLOT_ORDER[playerId].some((slotKey) => {
    const monster = state.slots[slotKey].monster;
    return monster?.cardId === cardId && monster.status === "active";
  });
}

function isTargetInCommandRange(
  attackerSlot: SlotState,
  targetSlot: SlotState,
  command: CommandDef,
  range: CommandDef["range"],
): boolean {
  if (range === "adjacent") {
    return distanceBetweenSlots(attackerSlot, targetSlot) === 1;
  }
  if (range === "one_skip") {
    return isOneSkipTarget(attackerSlot, targetSlot);
  }
  if (range === "two_skip") {
    return isTwoSkipTarget(attackerSlot, targetSlot, command.rangeText);
  }
  if (range === "straight") {
    return isStraightTarget(attackerSlot, targetSlot);
  }
  if (range === "piercing") {
    return isStraightTarget(attackerSlot, targetSlot);
  }
  if (range === "decreasing_straight") {
    return isStraightTarget(attackerSlot, targetSlot);
  }
  if (range === "line") {
    return isLineTarget(attackerSlot, targetSlot);
  }
  if (range === "special" && command.rangeText === "桂馬飛び") {
    return isKnightTarget(slotCoord(attackerSlot), slotCoord(targetSlot));
  }
  return false;
}

export function getMasterActionTargets(state: GameState, actionId: MasterActionId): Target[] {
  if (state.winner || state.pendingLevelUp) {
    return [];
  }
  const player = state.players[state.currentPlayer];
  if (player.stones < getMasterActionCost(actionId)) {
    return [];
  }

  if (actionId === "master_attack") {
    return PLAYER_SLOT_ORDER[opponentOf(state.currentPlayer)]
      .filter((slotKey) => {
        const slot = state.slots[slotKey];
        return slot.row === "front" && slot.monster?.status === "active";
      })
      .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
  }

  if (actionId === "wake_up") {
    return FIELD_ORDER
      .filter((slotKey) => state.slots[slotKey].monster?.status === "prepared")
      .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
  }

  return PLAYER_SLOT_ORDER[state.currentPlayer]
    .filter((slotKey) => {
      const monster = state.slots[slotKey].monster;
      return monster?.status === "active" && !monster.shielded;
    })
    .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
}

export function getMagicTargets(state: GameState, handInstanceId: string): Target[] {
  if (state.winner || state.pendingLevelUp) {
    return [];
  }
  const player = state.players[state.currentPlayer];
  const card = player.hand.find((handCard) => handCard.instanceId === handInstanceId);
  if (!card) {
    return [];
  }
  const def = getCardDef(card.cardId);
  if (def.type !== "magic" || player.stones < def.cost) {
    return [];
  }

  return getMagicTargetsByCardId(state, def.id);
}

export function getMagicSecondaryTargets(state: GameState, action: Pick<MagicAction, "handInstanceId" | "target">): Target[] {
  const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === action.handInstanceId);
  if (!card || action.target.kind !== "monster") {
    return [];
  }
  const primarySlotKey = action.target.slotKey;

  if (card.cardId === "card_030") {
    return monsterTargets(state, { excludeSlotKey: primarySlotKey, activeOnly: true });
  }
  if (card.cardId === "card_031") {
    return PLAYER_SLOT_ORDER[state.slots[primarySlotKey].owner]
      .filter((slotKey) => slotKey !== primarySlotKey && state.slots[slotKey].monster?.status === "active")
      .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
  }
  if (card.cardId === "card_061" || card.cardId === "card_097" || card.cardId === "card_098") {
    return PLAYER_SLOT_ORDER[state.currentPlayer]
      .filter((slotKey) => state.slots[slotKey].monster?.status === "active")
      .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
  }
  if (card.cardId === "card_148") {
    return PLAYER_SLOT_ORDER[opponentOf(state.currentPlayer)]
      .filter((slotKey) => state.slots[slotKey].monster?.status === "active")
      .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
  }
  return [];
}

export function getCommandSecondaryTargets(
  state: GameState,
  action: Pick<CommandAction, "attackerSlotKey" | "commandId" | "target">,
): Target[] {
  const monster = state.slots[action.attackerSlotKey].monster;
  if (!monster || action.target.kind !== "monster") {
    return [];
  }
  const primarySlotKey = action.target.slotKey;
  const command = getCommand(monster, action.commandId);
  if (command.name !== "ワープ") {
    return [];
  }
  return PLAYER_SLOT_ORDER[state.slots[primarySlotKey].owner]
    .filter((slotKey) => slotKey !== primarySlotKey && state.slots[slotKey].monster?.status === "active")
    .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
}

export function getMagicHandChoices(state: GameState, handInstanceId: string): CardInstance[] {
  const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === handInstanceId);
  if (!card) {
    return [];
  }
  if (card.cardId === "card_065") {
    return state.players[state.currentPlayer].hand.filter((handCard) => getCardDef(handCard.cardId).type === "monster");
  }
  if (card.cardId === "card_116") {
    return state.players[state.currentPlayer].hand.filter((handCard) => handCard.instanceId !== handInstanceId);
  }
  return [];
}

export function getCommandHandChoices(state: GameState, attackerSlotKey: SlotKey, commandId: string): CardInstance[] {
  const monster = state.slots[attackerSlotKey].monster;
  if (!monster) {
    return [];
  }
  const command = getCommand(monster, commandId);
  if (command.name !== "ソウルスイッチ") {
    return [];
  }
  return state.players[monster.owner].hand.filter((card) => getCardDef(card.cardId).type === "monster");
}

export function getMagicSearchCategories(state: GameState, handInstanceId: string): Array<NonNullable<MagicAction["searchCategory"]>> {
  const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === handInstanceId);
  return card?.cardId === "card_123" ? ["front", "back", "magic"] : [];
}

function getMagicTargetsByCardId(state: GameState, cardId: string): Target[] {
  const playerId = state.currentPlayer;
  const opponent = opponentOf(playerId);
  const activeTargets = monsterTargets(state, { activeOnly: true });
  const allMonsterTargets = monsterTargets(state, { activeOnly: false });
  const allyActive = activeTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].owner === playerId);
  const enemyActive = activeTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].owner === opponent);
  const preparedTargets = allMonsterTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].monster?.status === "prepared");
  const ownMaster: Target[] = [{ kind: "master", playerId }];
  const enemyMaster: Target[] = [{ kind: "master", playerId: opponent }];
  const allMasters: Target[] = [{ kind: "master", playerId: "player" }, { kind: "master", playerId: "cpu" }];

  if (cardId === "healing") {
    return allyActive;
  }
  if (cardId === "thunder") {
    return [...enemyActive, ...enemyMaster];
  }
  if (cardId === "power_up") {
    return allyActive.filter((target) => target.kind === "monster" && !state.slots[target.slotKey].monster?.powerUp);
  }
  if (cardId === "card_025" || cardId === "card_055" || cardId === "card_062" || cardId === "card_088" || cardId === "card_089" || cardId === "card_091") {
    return activeTargets;
  }
  if (cardId === "card_030") {
    return activeTargets.filter((target) => target.kind === "monster" && findFirstOtherActiveSlot(state, target.slotKey));
  }
  if (cardId === "card_026" || cardId === "card_092") {
    return [...activeTargets, ...enemyMaster];
  }
  if (cardId === "card_027" || cardId === "card_028" || cardId === "card_058" || cardId === "card_059" || cardId === "card_060" || cardId === "card_086" || cardId === "card_090" || cardId === "card_094" || cardId === "card_095" || cardId === "card_119" || cardId === "card_125" || cardId === "card_129" || cardId === "card_130") {
    return activeTargets;
  }
  if (cardId === "card_029") {
    return activeTargets.filter((target) => {
      const monster = target.kind === "monster" ? state.slots[target.slotKey].monster : undefined;
      return !!monster && monster.level > 1 && !monster.levelFixed;
    });
  }
  if (cardId === "card_031") {
    return activeTargets.filter((target) => target.kind === "monster" && findSwapPartnerSlot(state, target.slotKey));
  }
  if (cardId === "card_056" || cardId === "card_064" || cardId === "card_093" || cardId === "card_114" || cardId === "card_115" || cardId === "card_116" || cardId === "card_120" || cardId === "card_121" || cardId === "card_123" || cardId === "card_124" || cardId === "card_126") {
    return ownMaster;
  }
  if (cardId === "card_057" || cardId === "card_063" || cardId === "card_065" || cardId === "card_128") {
    if (cardId === "card_065" && !state.players[playerId].hand.some((card) => getCardDef(card.cardId).type === "monster")) {
      return [];
    }
    return allyActive;
  }
  if (cardId === "card_061") {
    return allyActive.length > 0 ? enemyActive : [];
  }
  if (cardId === "card_097" || cardId === "card_098") {
    return allyActive.length > 0 ? enemyActive : [];
  }
  if (cardId === "card_148") {
    return enemyActive.length > 0 ? allyActive : [];
  }
  if (cardId === "card_087") {
    return allMasters;
  }
  if (cardId === "card_113") {
    return enemyMaster;
  }
  if (cardId === "card_117" || cardId === "card_122") {
    return preparedTargets;
  }
  if (cardId === "card_118") {
    return activeTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].row === "front");
  }
  if (cardId === "card_127") {
    return [...activeTargets, ...allMasters];
  }
  if (cardId === "card_149") {
    return allyActive.filter((target) => {
      const monster = target.kind === "monster" ? state.slots[target.slotKey].monster : undefined;
      return !!monster && !monster.levelFixed && monster.level < getMonsterDef(monster.cardId).maxLevel;
    });
  }
  if (cardId === "card_150") {
    return allyActive.filter((target) => target.kind === "monster" && state.slots[target.slotKey].monster?.cardId === "card_001");
  }

  return activeTargets;
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
    const canLevelUp = monster.level < getMonsterDef(monster.cardId).maxLevel && !monster.levelFixed && state.players[monster.owner].stones > 0;
    const canLevelDown = monster.level > 1 && !monster.levelFixed;
    if (canLevelUp && (!canLevelDown || randomChance(state, 0.5))) {
      performLevelUp(state, target.slotKey, 1);
    } else if (canLevelDown) {
      levelDownMonster(state, target.slotKey);
    } else {
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
    defeatMonster(state, target.slotKey);
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
    const allySlotKey = action.secondaryTarget?.kind === "monster"
      ? action.secondaryTarget.slotKey
      : firstActiveSlotOf(state, state.currentPlayer);
    if (allySlotKey) {
      if (state.slots[allySlotKey].owner !== state.currentPlayer) {
        throw new Error("誘惑の味方対象が不正です");
      }
      defeatMonster(state, allySlotKey);
    }
    if (randomChance(state, 0.5)) {
      defeatMonster(state, target.slotKey);
    } else {
      appendLog(state, `${monsterName(requireTargetMonster(state, target.slotKey))}は誘惑に耐えた`);
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
        if (state.slots[slotKey].monster?.status === "active" && randomChance(state, 0.5)) {
          damageMonster(state, slotKey, 1, "マッドファイア余波");
        }
      }
    }
    return;
  }

  if (cardId === "card_093") {
    rotateFieldMonsters(state);
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
    state.players[state.currentPlayer].deck.sort((a, b) => a.cardId.localeCompare(b.cardId));
    appendLog(state, "山札を並べ替えた");
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
    state.players.player.masterActionsExchanged = !state.players.player.masterActionsExchanged;
    state.players.cpu.masterActionsExchanged = !state.players.cpu.masterActionsExchanged;
    appendLog(state, "マスター特技を入れ替えた（同一マスター同士のため見た目は変わらない）");
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
    if (!monster.levelFixed && monster.level < getMonsterDef(monster.cardId).maxLevel && state.players[monster.owner].stones > 0) {
      performLevelUp(state, target.slotKey, 1);
    }
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

function shiftChangeWithHandMonster(state: GameState, slotKey: SlotKey, handInstanceId?: string): void {
  const slot = state.slots[slotKey];
  const current = slot.monster;
  if (!current) {
    throw new Error("入れ替え対象がいません");
  }
  const player = state.players[current.owner];
  const handIndex = handInstanceId
    ? player.hand.findIndex((card) => card.instanceId === handInstanceId && getCardDef(card.cardId).type === "monster")
    : player.hand.findIndex((card) => getCardDef(card.cardId).type === "monster");
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

function adjacentSlotKeys(slot: SlotState): SlotKey[] {
  return FIELD_ORDER.filter((slotKey) => distanceBetweenSlots(slot, stateSlotPlaceholder(slot, slotKey)) === 1);
}

function stateSlotPlaceholder(origin: SlotState, slotKey: SlotKey): SlotState {
  const [owner, row, lane] = slotKey.split("_") as [PlayerId, Row, Lane];
  return { key: slotKey, owner, row, lane };
}

function rotateFieldMonsters(state: GameState): void {
  for (const playerId of PLAYER_ORDER) {
    const order = PLAYER_SLOT_ORDER[playerId];
    const monsters = order.map((slotKey) => state.slots[slotKey].monster);
    for (let i = 0; i < order.length; i += 1) {
      const fromIndex = (i - 1 + order.length) % order.length;
      const nextMonster = monsters[fromIndex];
      if (nextMonster) {
        state.slots[order[i]].monster = nextMonster;
      } else {
        delete state.slots[order[i]].monster;
      }
    }
  }
  appendLog(state, "フィールドのモンスターをローテーションした");
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
  while (player.hand.length < HAND_LIMIT) {
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
  const deckIndex = player.deck.findIndex((card) => {
    const def = getCardDef(card.cardId);
    if (category === "magic") {
      return def.type === "magic";
    }
    return def.type === "monster" && def.role === category;
  });
  if (deckIndex < 0) {
    appendLog(state, `${categoryLabel(category)}のカードは山札になかった`);
    return;
  }
  const [card] = player.deck.splice(deckIndex, 1);
  player.hand.push(card);
  appendLog(state, `${playerLabel(playerId)}は${categoryLabel(category)}から${getCardName(card.cardId)}を手札に入れた`);
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
  target.hp = currentHp;
  target.revivedOnce = source.revivedOnce;
  target.usedCommandIds = source.usedCommandIds ? [...source.usedCommandIds] : undefined;
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
    return !target || target.status === "active";
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

export function getMasterActionCost(actionId: MasterActionId): number {
  if (actionId === "master_attack") {
    return MASTER_ATTACK_COST;
  }
  if (actionId === "wake_up") {
    return WAKE_UP_COST;
  }
  return SHIELD_COST;
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
  return def.type === "monster" && slot.owner === state.currentPlayer && !slot.monster && player.stones >= 1;
}

export function targetToKey(target: Target): string {
  return target.kind === "master" ? `master:${target.playerId}` : `monster:${target.slotKey}`;
}

export function opponentOf(playerId: PlayerId): PlayerId {
  return playerId === "player" ? "cpu" : "player";
}

export function playerLabel(playerId: PlayerId): string {
  return playerId === "player" ? "プレイヤー" : "CPU";
}

function createPlayer(id: PlayerId, deck: CardInstance[]): PlayerState {
  return {
    id,
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
      appendLog(state, `${monsterName(monster)}のきまぐれでパワー${modifier > 0 ? "+1" : "-1"}`);
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
      defeatMonster(state, slotKey, { source: "ダークホール", kind: "effect" });
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
    }
  }
  state.players.player.masterActionsExchanged = false;
  state.players.cpu.masterActionsExchanged = false;
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

  const damage = Math.max(0, power - 2);
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

  if (monster.dodgeChance && context.kind !== "recoil" && randomChance(state, 0.5)) {
    appendLog(state, `${monsterName(monster)}は女神の加護で攻撃をかわした`);
    return undefined;
  }

  let damage = power;
  if (monster.shielded) {
    damage = Math.max(0, damage - 1);
  }
  if (monster.halfShielded) {
    damage = Math.max(0, Math.floor(damage / 2));
  }
  if (monster.oneShotShield) {
    monster.oneShotShield = false;
    monster.halfShielded = false;
  }
  if (monster.focused) {
    const beforeFocusReduction = damage;
    damage = Math.max(0, damage - 1);
    monster.focused = false;
    if (beforeFocusReduction !== damage) {
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

  const owner = state.players[monster.owner];
  owner.stones += monster.investedStones;
  const defeatedCard = { cardId: monster.cardId, instanceId: monster.instanceId };
  if (monster.reviveOnDefeat) {
    owner.deck.unshift(defeatedCard);
  } else {
    owner.discard.push(defeatedCard);
  }
  appendLog(state, `${monsterName(monster)}は倒れ、${playerLabel(monster.owner)}にストーン${monster.investedStones}個が戻った`);
  if (monster.shadowCursed) {
    decreaseMasterHp(state, monster.owner, 1, "かげ呪い");
  }
  applyDefeatCurses(state, monster, context.attackerSlotKey);
  clearDeathChain(state, slotKey);
  const defeated: DefeatedMonster = {
    owner: monster.owner,
    cardId: monster.cardId,
    level: monster.level,
    investedStones: monster.investedStones,
  };
  delete slot.monster;
  return defeated;
}

function getLevelUpCapacity(state: GameState, attackerSlotKey: SlotKey, defeatedLevel: number): number {
  const attacker = state.slots[attackerSlotKey].monster;
  if (!attacker) {
    return 0;
  }
  if (attacker.levelFixed) {
    return 0;
  }
  const def = getMonsterDef(attacker.cardId);
  const room = def.maxLevel - attacker.level;
  return Math.max(0, Math.min(defeatedLevel, state.players[attacker.owner].stones, room));
}

function performLevelUp(state: GameState, attackerSlotKey: SlotKey, levels: number): void {
  const monster = state.slots[attackerSlotKey].monster;
  if (!monster || levels <= 0) {
    return;
  }
  if (monster.levelFixed) {
    appendLog(state, `${monsterName(monster)}はレベル固定中のためレベルアップできない`);
    return;
  }
  const player = state.players[monster.owner];
  const def = getMonsterDef(monster.cardId);
  const actual = Math.min(levels, def.maxLevel - monster.level, player.stones);
  if (actual <= 0) {
    return;
  }
  monster.level += actual;
  monster.investedStones += actual;
  player.stones -= actual;
  monster.hp = getMonsterMaxHp(monster);
  appendLog(state, `${monsterName(monster)}はLv${monster.level}になり、HPが全回復した`);
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
    return randomInt(state, 2, 5);
  }
  if (command.range === "decreasing_straight" && target.kind === "monster") {
    const distance = rangedDistanceBetweenSlots(attackerSlot, state.slots[target.slotKey]);
    return Math.max(1, command.power - Math.max(0, distance - 1));
  }
  if ((command.rangeText === "ラオンソード" || command.rangeText === "レオンソード") && command.name === "アタック") {
    return command.power + partnerSwordPower(state, attackerSlot.monster);
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

  if (command.name === "ヘブンズドア" && target.kind === "monster") {
    defeatMonster(state, target.slotKey);
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
    defeatMonster(state, target.slotKey);
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
    defeatMonster(state, attackerSlotKey);
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
      defeatMonster(state, attackerSlotKey);
    } else if (!attacker.levelFixed && state.players[attacker.owner].stones > 0) {
      performLevelUp(state, attackerSlotKey, 1);
    } else {
      appendLog(state, `${monsterName(attacker)}はレベルアップできなかった`);
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
    defeatMonster(state, attackerSlotKey);
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
}

function getCommandRecoilDamage(command: CommandDef, power: number): number {
  if (command.name === "爆雷撃") {
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
    attacker.usedCommandIds = [...new Set([...(attacker.usedCommandIds ?? []), command.id])];
    appendLog(state, `${monsterName(attacker)}の飛竜ロロは使い切った`);
  }

  if (attacker.cardId === "card_048" && !isUpperCommand(attacker, command)) {
    retreatBackward(state, attackerSlotKey);
  }

  if (
    (attacker.cardId === "card_073" && !isUpperCommand(attacker, command)) ||
    (attacker.cardId === "card_072" && !isUpperCommand(attacker, command) && attacker.hp >= getMonsterMaxHp(attacker)) ||
    (attacker.cardId === "card_112" && attacker.level >= 3 && !isUpperCommand(attacker, command))
  ) {
    defeatMonster(state, attackerSlotKey, { source: "特技後離脱", kind: "effect" });
    return;
  }

  if (hadBerserkPower) {
    applyRecoil(state, attackerSlotKey, 1);
  }
  if (hadDamageCurse) {
    applyDamageCurseAfterAction(state, attackerSlotKey);
  }
}

function shouldCommandMiss(state: GameState, attacker: MonsterState, command: CommandDef): boolean {
  return attacker.cardId === "card_039" && !isUpperCommand(attacker, command) && randomChance(state, 0.5);
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

  if (monster.cardId === "card_109") {
    const frontSlotKey = slotInFrontOf(state.slots[targetSlotKey]);
    if (frontSlotKey && state.slots[frontSlotKey].monster?.status === "active") {
      damageMonster(state, frontSlotKey, getMonsterCommands(monster)[0]?.power ?? 1, {
        source: "やつあたり",
        kind: "effect",
        attackerSlotKey: targetSlotKey,
        ignoreCounter: true,
      });
    }
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

function isSpecialCommandSealed(state: GameState, slotKey: SlotKey, command: CommandDef): boolean {
  const monster = state.slots[slotKey].monster;
  if (!monster || isUpperCommand(monster, command)) {
    return false;
  }
  if (monster.commandSealed) {
    return true;
  }
  return FIELD_ORDER.some((candidateSlotKey) => {
    const candidate = state.slots[candidateSlotKey];
    return (
      candidate.monster?.cardId === "card_133" &&
      candidate.monster.status === "active" &&
      slotInFrontOf(candidate) === slotKey
    );
  });
}

function applyProvokeRestriction(
  state: GameState,
  attackerSlotKey: SlotKey,
  command: CommandDef,
  targets: Target[],
): Target[] {
  const monster = state.slots[attackerSlotKey].monster;
  const provokeTargetSlotKey = monster?.provokeTargetSlotKey;
  if (!monster || !provokeTargetSlotKey || isSelfTargetCommand(command)) {
    return targets;
  }
  if (!state.slots[provokeTargetSlotKey].monster) {
    monster.provokeTargetSlotKey = undefined;
    return targets;
  }
  return targets.some((target) => target.kind === "monster" && target.slotKey === provokeTargetSlotKey)
    ? [{ kind: "monster", slotKey: provokeTargetSlotKey }]
    : targets;
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

function partnerSwordPower(state: GameState, attacker: MonsterState | undefined): number {
  if (!attacker) {
    return 0;
  }
  const partnerCardId = attacker.cardId === "card_107" ? "card_108" : attacker.cardId === "card_108" ? "card_107" : undefined;
  if (!partnerCardId) {
    return 0;
  }
  for (const slotKey of PLAYER_SLOT_ORDER[attacker.owner]) {
    const partner = state.slots[slotKey].monster;
    if (partner?.cardId === partnerCardId && partner.status === "active") {
      return getMonsterCommands(partner)[0]?.power ?? 0;
    }
  }
  return 0;
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
  monster.stoneCurse = false;
  monster.damageCurse = false;
  monster.damageGuarded = false;
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
    ? player.hand.findIndex((card) => card.instanceId === handInstanceId && getCardDef(card.cardId).type === "monster")
    : player.hand.findIndex((card) => getCardDef(card.cardId).type === "monster");
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

interface BoardCoord {
  x: number;
  y: number;
}

function distanceBetweenSlots(a: SlotState, b: SlotState): number {
  const ca = slotCoord(a);
  const cb = slotCoord(b);
  return manhattanDistance(ca, cb);
}

function rangedDistanceBetweenSlots(a: SlotState, b: SlotState): number {
  const ca = slotCoord(a);
  const cb = slotCoord(b);
  return rangedDistance(ca, cb);
}

function slotCoord(slot: SlotState): BoardCoord {
  const x = slot.lane === "left" ? 0 : 2;
  if (slot.owner === "cpu") {
    return { x, y: slot.row === "back" ? 0 : 1 };
  }
  return { x, y: slot.row === "front" ? 2 : 3 };
}

function masterCoord(playerId: PlayerId): BoardCoord {
  return { x: 1, y: playerId === "cpu" ? 1 : 2 };
}

function manhattanDistance(a: BoardCoord, b: BoardCoord): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function rangedDistance(a: BoardCoord, b: BoardCoord): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

function isOneSkipTarget(attackerSlot: SlotState, targetSlot: SlotState): boolean {
  return rangedDistanceBetweenSlots(attackerSlot, targetSlot) === 2;
}

function isTwoSkipTarget(attackerSlot: SlotState, targetSlot: SlotState, rangeText?: string): boolean {
  const attacker = slotCoord(attackerSlot);
  const target = slotCoord(targetSlot);
  const distance = rangedDistance(attacker, target);
  if (rangeText?.includes("１つ")) {
    return distance === 2 || distance === 3;
  }
  if (rangeText?.includes("桂馬")) {
    return distance === 3 || isKnightTarget(attacker, target);
  }
  return distance === 3;
}

function isStraightTarget(attackerSlot: SlotState, targetSlot: SlotState): boolean {
  const attacker = slotCoord(attackerSlot);
  const target = slotCoord(targetSlot);
  if (attacker.x !== target.x) {
    return false;
  }
  return isForward(attackerSlot.owner, attacker.y, target.y);
}

function isLineTarget(attackerSlot: SlotState, targetSlot: SlotState): boolean {
  const attacker = slotCoord(attackerSlot);
  const target = slotCoord(targetSlot);
  return attacker.x === target.x || attacker.y === target.y;
}

function isKnightTarget(attacker: BoardCoord, target: BoardCoord): boolean {
  const dx = Math.abs(attacker.x - target.x);
  const dy = Math.abs(attacker.y - target.y);
  return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
}

function isForward(owner: PlayerId, fromY: number, toY: number): boolean {
  return owner === "player" ? toY < fromY : toY > fromY;
}

function isOpponentMasterInCommandRange(
  attackerSlot: SlotState,
  opponent: PlayerId,
  command: CommandDef,
  range: CommandDef["range"],
): boolean {
  const distance = rangedDistance(slotCoord(attackerSlot), masterCoord(opponent));
  if (range === "adjacent") {
    return distance === 1;
  }
  if (range === "one_skip") {
    return distance === 2;
  }
  if (range === "two_skip") {
    if (command.rangeText?.includes("１つ")) {
      return distance === 2 || distance === 3;
    }
    return distance === 3;
  }
  if (range === "line") {
    const attacker = slotCoord(attackerSlot);
    const master = masterCoord(opponent);
    return attacker.x === master.x || attacker.y === master.y;
  }
  if (range === "special" && command.rangeText === "桂馬飛び") {
    return isKnightTarget(slotCoord(attackerSlot), masterCoord(opponent));
  }
  return false;
}

function ensureActionAllowed(state: GameState): void {
  if (state.winner) {
    throw new Error("勝敗が決まっています");
  }
  if (state.pendingLevelUp) {
    throw new Error("先にレベルアップを解決してください");
  }
}

function appendLog(state: GameState, message: string): void {
  state.log.push(message);
  if (state.log.length > 120) {
    state.log = state.log.slice(-120);
  }
}

function monsterName(monster: MonsterState): string {
  return `${getCardName(monster.cardId)} Lv${monster.level}`;
}

function isSameTarget(a: Target, b: Target): boolean {
  if (a.kind !== b.kind) {
    return false;
  }
  if (a.kind === "master" && b.kind === "master") {
    return a.playerId === b.playerId;
  }
  if (a.kind === "monster" && b.kind === "monster") {
    return a.slotKey === b.slotKey;
  }
  return false;
}

function cloneState(state: GameState): GameState {
  return structuredClone(state) as GameState;
}

function damageContext(sourceOrContext: string | DamageContext): DamageContext {
  if (typeof sourceOrContext === "string") {
    return { source: sourceOrContext, kind: "effect" };
  }
  return sourceOrContext;
}

function randomChance(state: GameState, probability: number): boolean {
  return nextRandom(state) < probability;
}

function randomInt(state: GameState, min: number, max: number): number {
  return min + Math.floor(nextRandom(state) * (max - min + 1));
}

function nextRandom(state: GameState): number {
  state.randomSeed = (state.randomSeed + 0x6d2b79f5) >>> 0;
  let next = state.randomSeed;
  next = Math.imul(next ^ (next >>> 15), next | 1);
  next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
  return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
}

function categoryLabel(category: NonNullable<MagicAction["searchCategory"]>): string {
  if (category === "front") {
    return "前衛";
  }
  if (category === "back") {
    return "後衛";
  }
  return "魔法";
}

function shuffle(deck: CardInstance[], seed: number): CardInstance[] {
  const result = [...deck];
  const random = seededRandom(seed);
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function seededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
