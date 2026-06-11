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

export function createInitialGame(seed = Date.now()): GameState {
  const playerDeck = shuffle(buildDeck("player"), seed + 1);
  const cpuDeck = shuffle(buildDeck("cpu"), seed + 2);
  const state: GameState = {
    players: {
      player: createPlayer("player", playerDeck),
      cpu: createPlayer("cpu", cpuDeck),
    },
    slots: createSlots(),
    currentPlayer: "player",
    turnNumber: 0,
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

  player.stones += 3;
  appendLog(next, `${playerLabel(playerId)}はストーンを3個得た`);
  clearExpiredShields(next, playerId);

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
  focusIdleMonsters(next, playerId);
  clearPowerUps(next, playerId);

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
  if (to.owner !== next.currentPlayer || fromSlotKey === toSlotKey) {
    throw new Error("自陣の別枠にだけ移動できます");
  }
  if (to.monster && to.monster.status !== "active") {
    throw new Error("準備中モンスターとは入れ替えられません");
  }

  mover.actionCount += 1;
  mover.focused = false;

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
  monster.actionCount += 1;
  appendLog(next, `${monsterName(monster)}はためた`);
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
  const cost = command.stoneCost ?? 0;
  if (actor.stones < cost) {
    throw new Error("特技に必要なストーンが足りません");
  }

  actor.stones -= cost;
  attacker.actionCount += 1;
  const power = consumeAttackPowerBonuses(attacker, command);
  appendLog(next, `${playerLabel(next.currentPlayer)}の${monsterName(attacker)}: ${command.name} ${power}P`);

  if (action.target.kind === "master") {
    damageMasterByPower(next, action.target.playerId, power, command.name);
    if (!next.winner && command.recoilDamage) {
      applyRecoil(next, action.attackerSlotKey, command.recoilDamage);
    }
    return next;
  }

  const defeated = damageMonster(next, action.target.slotKey, power, command.name);
  if (!defeated) {
    if (command.recoilDamage) {
      applyRecoil(next, action.attackerSlotKey, command.recoilDamage);
    }
    return next;
  }

  if (defeated.owner === attacker.owner) {
    decreaseMasterHp(next, attacker.owner, 1, "味方撃破ペナルティ");
    if (!next.winner && command.recoilDamage) {
      applyRecoil(next, action.attackerSlotKey, command.recoilDamage);
    }
    return next;
  }

  const maxLevels = getLevelUpCapacity(next, action.attackerSlotKey, defeated.level);
  if (maxLevels > 0 && next.currentPlayer === "player") {
    next.pendingLevelUp = {
      playerId: "player",
      attackerSlotKey: action.attackerSlotKey,
      maxLevels,
      recoilDamage: command.recoilDamage ?? 0,
    };
    appendLog(next, `${monsterName(attacker)}は${maxLevels}レベルまで上げられる`);
    return next;
  }

  if (maxLevels > 0) {
    performLevelUp(next, action.attackerSlotKey, maxLevels);
  }
  if (command.recoilDamage) {
    applyRecoil(next, action.attackerSlotKey, command.recoilDamage);
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

  if (def.id === "healing" && action.target.kind === "monster") {
    const monster = next.slots[action.target.slotKey].monster;
    if (!monster) {
      throw new Error("回復対象がいません");
    }
    const maxHp = getMonsterMaxHp(monster);
    monster.hp = Math.min(maxHp, monster.hp + 2);
    appendLog(next, `${monsterName(monster)}を2回復した`);
  }

  if (def.id === "thunder") {
    if (action.target.kind === "master") {
      damageMasterByPower(next, action.target.playerId, 3, "サンダー");
    } else {
      damageMonster(next, action.target.slotKey, 3, "サンダー");
    }
  }

  if (def.id === "power_up" && action.target.kind === "monster") {
    const monster = next.slots[action.target.slotKey].monster;
    if (!monster) {
      throw new Error("強化対象がいません");
    }
    if (monster.powerUp) {
      throw new Error("同じ対象にパワーアップは重ねられません");
    }
    monster.powerUp = true;
    appendLog(next, `${monsterName(monster)}の次の攻撃パワーを1上げた`);
  }

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
    damageMonster(next, target.slotKey, MASTER_ATTACK_POWER, "マスターアタック");
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
  const actor = state.players[state.currentPlayer];
  if ((command.stoneCost ?? 0) > actor.stones) {
    return [];
  }

  const opponent = opponentOf(monster.owner);
  const activeMonsterTargets = FIELD_ORDER
    .filter((slotKey) => slotKey !== attackerSlotKey)
    .filter((slotKey) => state.slots[slotKey].monster?.status === "active")
    .map<Target>((slotKey) => ({ kind: "monster", slotKey }));

  if (command.range === "any_monster") {
    return activeMonsterTargets;
  }
  if (command.range === "any_target") {
    return [...activeMonsterTargets, { kind: "master", playerId: opponent }];
  }
  if (command.range === "master") {
    return [{ kind: "master", playerId: opponent }];
  }

  return activeMonsterTargets.filter((target) => {
    if (target.kind !== "monster") {
      return false;
    }
    const targetSlot = state.slots[target.slotKey];
    if (command.range === "adjacent") {
      return distanceBetweenSlots(slot, targetSlot) === 1;
    }
    return isOneSkipTarget(slot, targetSlot);
  });
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

  const targets: Target[] = [];
  for (const kind of def.targetKinds) {
    if (kind === "ally_monster") {
      for (const slotKey of PLAYER_SLOT_ORDER[state.currentPlayer]) {
        const monster = state.slots[slotKey].monster;
        if (monster?.status === "active") {
          if (def.id !== "power_up" || !monster.powerUp) {
            targets.push({ kind: "monster", slotKey });
          }
        }
      }
    }
    if (kind === "enemy_monster") {
      for (const slotKey of PLAYER_SLOT_ORDER[opponentOf(state.currentPlayer)]) {
        const monster = state.slots[slotKey].monster;
        if (monster?.status === "active") {
          targets.push({ kind: "monster", slotKey });
        }
      }
    }
    if (kind === "enemy_master") {
      targets.push({ kind: "master", playerId: opponentOf(state.currentPlayer) });
    }
  }
  return targets;
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
  return {
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

function clearExpiredShields(state: GameState, playerId: PlayerId): void {
  for (const slotKey of PLAYER_SLOT_ORDER[playerId]) {
    const monster = state.slots[slotKey].monster;
    if (monster?.shielded) {
      monster.shielded = false;
      appendLog(state, `${monsterName(monster)}のシールドが切れた`);
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

function clearPowerUps(state: GameState, playerId: PlayerId): void {
  for (const slotKey of PLAYER_SLOT_ORDER[playerId]) {
    const monster = state.slots[slotKey].monster;
    if (monster) {
      monster.powerUp = false;
    }
  }
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

function damageMasterByPower(state: GameState, targetPlayerId: PlayerId, power: number, source: string): void {
  const damage = Math.max(0, power - 2);
  if (damage === 0) {
    appendLog(state, `${source}はマスターシールドで防がれた`);
    return;
  }
  decreaseMasterHp(state, targetPlayerId, damage, source);
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
  source: string,
): DefeatedMonster | undefined {
  const slot = state.slots[targetSlotKey];
  const monster = slot.monster;
  if (!monster) {
    throw new Error("対象モンスターがいません");
  }

  let damage = power;
  if (monster.shielded) {
    damage = Math.max(0, damage - 1);
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
  appendLog(state, `${source}で${monsterName(monster)}に${damage}ダメージ`);
  if (monster.hp > 0) {
    return undefined;
  }

  return defeatMonster(state, targetSlotKey);
}

function defeatMonster(state: GameState, slotKey: SlotKey): DefeatedMonster {
  const slot = state.slots[slotKey];
  const monster = slot.monster;
  if (!monster) {
    throw new Error("倒す対象がいません");
  }
  const owner = state.players[monster.owner];
  owner.stones += monster.investedStones;
  owner.discard.push({ cardId: monster.cardId, instanceId: monster.instanceId });
  appendLog(state, `${monsterName(monster)}は倒れ、${playerLabel(monster.owner)}にストーン${monster.investedStones}個が戻った`);
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
  const def = getMonsterDef(attacker.cardId);
  const room = def.maxLevel - attacker.level;
  return Math.max(0, Math.min(defeatedLevel, state.players[attacker.owner].stones, room));
}

function performLevelUp(state: GameState, attackerSlotKey: SlotKey, levels: number): void {
  const monster = state.slots[attackerSlotKey].monster;
  if (!monster || levels <= 0) {
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
  const monster = state.slots[slotKey].monster;
  if (!monster) {
    return;
  }
  monster.hp -= damage;
  appendLog(state, `${monsterName(monster)}は反動で${damage}ダメージ`);
  if (monster.hp <= 0) {
    defeatMonster(state, slotKey);
  }
}

function consumeAttackPowerBonuses(monster: MonsterState, command: CommandDef): number {
  let power = command.power;
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
  return power;
}

function isUpperCommand(monster: MonsterState, command: CommandDef): boolean {
  return getMonsterCommands(monster)[0]?.id === command.id;
}

function getCommand(monster: MonsterState, commandId: string): CommandDef {
  const command = getMonsterCommands(monster).find((item) => item.id === commandId);
  if (!command) {
    throw new Error("指定したコマンドがありません");
  }
  return command;
}

function getMonsterLevelDef(monster: MonsterState) {
  const def = getMonsterDef(monster.cardId);
  const level = def.levels.find((item) => item.level === monster.level);
  if (!level) {
    throw new Error("モンスターレベル定義がありません");
  }
  return level;
}

function getMonsterMaxHp(monster: MonsterState): number {
  return getMonsterLevelDef(monster).maxHp;
}

function distanceBetweenSlots(a: SlotState, b: SlotState): number {
  const ca = slotCoord(a);
  const cb = slotCoord(b);
  return Math.abs(ca.x - cb.x) + Math.abs(ca.y - cb.y);
}

function rangedDistanceBetweenSlots(a: SlotState, b: SlotState): number {
  const ca = slotCoord(a);
  const cb = slotCoord(b);
  return Math.max(Math.abs(ca.x - cb.x), Math.abs(ca.y - cb.y));
}

function slotCoord(slot: SlotState): { x: number; y: number } {
  const x = slot.lane === "left" ? 0 : 2;
  if (slot.owner === "cpu") {
    return { x, y: slot.row === "back" ? 0 : 1 };
  }
  return { x, y: slot.row === "front" ? 2 : 3 };
}

function isOneSkipTarget(attackerSlot: SlotState, targetSlot: SlotState): boolean {
  return rangedDistanceBetweenSlots(attackerSlot, targetSlot) === 2;
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
