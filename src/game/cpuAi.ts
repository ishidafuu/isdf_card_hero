import { getCardDef, getCardName, getMonsterDef } from "./cards";
import {
  attackWithCommand,
  canFocusMonster,
  canSummonTo,
  endTurn,
  focusMonster,
  getCommandTargets,
  getMagicTargets,
  getMasterActionTargets,
  getMonsterCommands,
  moveMonster,
  opponentOf,
  playMagic,
  summonMonster,
  useMasterAction,
} from "./rules";
import type {
  CommandAction,
  GameState,
  MagicAction,
  MasterActionId,
  MonsterState,
  PlayerId,
  SlotKey,
  SlotState,
  Target,
} from "./types";

const FIELD_ORDER_BY_PLAYER: Record<PlayerId, SlotKey[]> = {
  cpu: ["cpu_back_left", "cpu_back_right", "cpu_front_left", "cpu_front_right"],
  player: ["player_back_left", "player_back_right", "player_front_left", "player_front_right"],
};

const SUMMON_SLOT_ORDER_BY_PLAYER: Record<PlayerId, SlotKey[]> = {
  cpu: ["cpu_front_left", "cpu_front_right", "cpu_back_left", "cpu_back_right"],
  player: ["player_front_left", "player_front_right", "player_back_left", "player_back_right"],
};

const ALL_FIELD_ORDER: SlotKey[] = [...FIELD_ORDER_BY_PLAYER.cpu, ...FIELD_ORDER_BY_PLAYER.player];

export type CpuDecision =
  | {
      type: "attack";
      action: CommandAction;
      reason: string;
      score: number;
    }
  | {
      type: "master_action";
      actionId: MasterActionId;
      target: Target;
      reason: string;
      score: number;
    }
  | {
      type: "summon";
      handInstanceId: string;
      slotKey: SlotKey;
      reason: string;
      score: number;
    }
  | {
      type: "magic";
      action: MagicAction;
      reason: string;
      score: number;
    }
  | {
      type: "move";
      fromSlotKey: SlotKey;
      toSlotKey: SlotKey;
      reason: string;
      score: number;
    }
  | {
      type: "focus";
      slotKey: SlotKey;
      reason: string;
      score: number;
    }
  | {
      type: "end_turn";
      reason: string;
      score: number;
    };

export function runCpuDecisionStep(state: GameState): GameState {
  const decision = chooseCpuDecision(state);
  return applyCpuDecision(state, decision);
}

export function chooseCpuDecision(state: GameState): CpuDecision {
  const decisions = listCpuDecisions(state);
  const perspective = state.currentPlayer;
  const beforeScore = evaluateState(state, perspective);
  let best: { decision: CpuDecision; totalScore: number; index: number } | undefined;

  decisions.forEach((decision, index) => {
    let after: GameState;
    try {
      after = applyCpuDecision(state, decision);
    } catch {
      return;
    }

    const totalScore = decision.score + evaluateState(after, perspective) - beforeScore;
    if (
      !best ||
      totalScore > best.totalScore ||
      (totalScore === best.totalScore && compareTieBreak(decision, best.decision, index, best.index) < 0)
    ) {
      best = { decision, totalScore, index };
    }
  });

  return best?.decision ?? createEndTurnDecision();
}

export function listCpuDecisions(state: GameState): CpuDecision[] {
  if (state.winner || state.pendingLevelUp) {
    return [createEndTurnDecision()];
  }

  return [
    ...listAttackDecisions(state),
    ...listMasterAttackDecisions(state),
    ...listMagicDecisions(state),
    ...listSummonDecisions(state),
    ...listFocusDecisions(state),
    createEndTurnDecision(),
  ];
}

export function applyCpuDecision(state: GameState, decision: CpuDecision): GameState {
  if (decision.type === "attack") {
    return attackWithCommand(state, decision.action);
  }
  if (decision.type === "master_action") {
    return useMasterAction(state, decision.actionId, decision.target);
  }
  if (decision.type === "summon") {
    return summonMonster(state, decision.handInstanceId, decision.slotKey);
  }
  if (decision.type === "focus") {
    return focusMonster(state, decision.slotKey);
  }
  if (decision.type === "magic") {
    return playMagic(state, decision.action);
  }
  if (decision.type === "move") {
    return moveMonster(state, decision.fromSlotKey, decision.toSlotKey);
  }
  return endTurn(state);
}

export function evaluateState(state: GameState, perspective: PlayerId = "cpu"): number {
  const opponent = opponentOf(perspective);
  if (state.winner === perspective) {
    return 1_000_000;
  }
  if (state.winner === opponent) {
    return -1_000_000;
  }

  let score = 0;
  score += (state.players[perspective].masterHp - state.players[opponent].masterHp) * 80;
  score += (state.players[perspective].stones - state.players[opponent].stones) * 6;
  score += (state.players[perspective].hand.length - state.players[opponent].hand.length) * 3;
  score += (state.players[perspective].deck.length - state.players[opponent].deck.length) * 1;

  for (const slotKey of ALL_FIELD_ORDER) {
    const value = monsterValue(state, slotKey);
    if (state.slots[slotKey].monster?.owner === perspective) {
      score += value;
    } else {
      score -= value;
    }
  }

  return score;
}

function listAttackDecisions(state: GameState): CpuDecision[] {
  const decisions: CpuDecision[] = [];
  const playerId = state.currentPlayer;

  for (const slotKey of FIELD_ORDER_BY_PLAYER[playerId]) {
    const monster = state.slots[slotKey].monster;
    if (!monster?.status || monster.status !== "active" || monster.actionCount >= monster.actionLimit) {
      continue;
    }

    for (const command of getMonsterCommands(monster)) {
      for (const target of getCommandTargets(state, slotKey, command.id)) {
        if (isOwnedMonsterTarget(state, target, playerId)) {
          continue;
        }

        const decision = createAttackDecision(state, {
          attackerSlotKey: slotKey,
          commandId: command.id,
          target,
        });
        if (decision) {
          decisions.push(decision);
        }
      }
    }
  }

  return decisions;
}

function createAttackDecision(state: GameState, action: CommandAction): CpuDecision | undefined {
  const after = attackWithCommand(state, action);
  const score = scoreAttackDecision(state, after, action);
  if (score <= -90) {
    return undefined;
  }

  return {
    type: "attack",
    action,
    reason: attackReason(state, after, action),
    score,
  };
}

function scoreAttackDecision(state: GameState, after: GameState, action: CommandAction): number {
  const playerId = state.currentPlayer;
  const opponent = opponentOf(playerId);
  if (after.winner === playerId) {
    return 1_000_000;
  }

  const recoilPenalty = attackerWasDefeated(state, after, action.attackerSlotKey) ? -120 : 0;
  if (action.target.kind === "master") {
    const damage = state.players[opponent].masterHp - after.players[opponent].masterHp;
    if (damage <= 0) {
      return -100;
    }
    return 70 * damage + recoilPenalty;
  }

  const targetBefore = state.slots[action.target.slotKey].monster;
  const targetAfter = after.slots[action.target.slotKey].monster;
  if (!targetBefore) {
    return -100;
  }

  if (!targetAfter) {
    const levelGain = attackerLevelGain(state, after, action.attackerSlotKey);
    return 300 + monsterValue(state, action.target.slotKey) + 80 * levelGain + recoilPenalty;
  }

  const damage = targetBefore.hp - targetAfter.hp;
  if (damage <= 0) {
    return -100;
  }
  return 25 * damage + recoilPenalty;
}

function attackReason(state: GameState, after: GameState, action: CommandAction): string {
  if (after.winner === state.currentPlayer) {
    return "相手マスターを倒せるため攻撃";
  }
  if (action.target.kind === "master") {
    return "相手マスターへ実ダメージを与えられるため攻撃";
  }
  if (!after.slots[action.target.slotKey].monster) {
    return "敵モンスターを撃破できるため攻撃";
  }
  const target = state.slots[action.target.slotKey].monster;
  return target ? `${getCardName(target.cardId)}を削れるため攻撃` : "有効ダメージを与えられるため攻撃";
}

function listMasterAttackDecisions(state: GameState): CpuDecision[] {
  const playerId = state.currentPlayer;
  return getMasterActionTargets(state, "master_attack")
    .filter((target) => target.kind === "monster" && !isOwnedMonsterTarget(state, target, playerId))
    .map((target) => createMasterAttackDecision(state, target))
    .filter((decision): decision is CpuDecision => !!decision);
}

function createMasterAttackDecision(state: GameState, target: Target): CpuDecision | undefined {
  const after = useMasterAction(state, "master_attack", target);
  const targetBefore = target.kind === "monster" ? state.slots[target.slotKey].monster : undefined;
  const targetAfter = target.kind === "monster" ? after.slots[target.slotKey].monster : undefined;
  if (!targetBefore || target.kind !== "monster") {
    return undefined;
  }

  if (!targetAfter) {
    return {
      type: "master_action",
      actionId: "master_attack",
      target,
      reason: "マスターアタックで敵モンスターを撃破できるため使用",
      score: 220 + monsterValue(state, target.slotKey),
    };
  }

  const damage = targetBefore.hp - targetAfter.hp;
  const score = 10 * damage - 18;
  if (damage <= 0 || score < 0) {
    return undefined;
  }

  return {
    type: "master_action",
    actionId: "master_attack",
    target,
    reason: "ストーンに余裕があり敵を削れるためマスターアタック",
    score,
  };
}

function listMagicDecisions(state: GameState): CpuDecision[] {
  const decisions: CpuDecision[] = [];
  const playerId = state.currentPlayer;
  const beforeScore = evaluateState(state, playerId);

  for (const card of state.players[playerId].hand) {
    const def = getCardDef(card.cardId);
    if (def.type !== "magic") {
      continue;
    }

    for (const target of getMagicTargets(state, card.instanceId)) {
      let after: GameState;
      try {
        after = playMagic(state, { handInstanceId: card.instanceId, target });
      } catch {
        continue;
      }
      const score = evaluateState(after, playerId) - beforeScore - def.cost * 8;
      if (score <= 8) {
        continue;
      }
      decisions.push({
        type: "magic",
        action: { handInstanceId: card.instanceId, target },
        reason: `${def.name}で局面を改善できるため使用`,
        score,
      });
    }
  }

  return decisions;
}

function listSummonDecisions(state: GameState): CpuDecision[] {
  const decisions: CpuDecision[] = [];
  const playerId = state.currentPlayer;
  for (const card of state.players[playerId].hand) {
    const def = getCardDef(card.cardId);
    if (def.type !== "monster") {
      continue;
    }

    for (const slotKey of SUMMON_SLOT_ORDER_BY_PLAYER[playerId]) {
      if (!canSummonTo(state, card.instanceId, slotKey)) {
        continue;
      }
      const score = scoreSummon(state, card.cardId, slotKey);
      decisions.push({
        type: "summon",
        handInstanceId: card.instanceId,
        slotKey,
        reason: summonReason(card.cardId, slotKey),
        score,
      });
    }
  }
  return decisions;
}

function scoreSummon(state: GameState, cardId: string, slotKey: SlotKey): number {
  const def = getMonsterDef(cardId);
  const slot = state.slots[slotKey];
  const frontFilled = slot.row === "back" && !!state.slots[frontSlotFor(slot)].monster;
  const boardEmpty = SUMMON_SLOT_ORDER_BY_PLAYER[slot.owner].every((key) => !state.slots[key].monster);

  let score = 0;
  if (def.role === "front") {
    score += slot.row === "front" ? 45 : 15;
    if (boardEmpty && slot.row === "front") {
      score += 15;
    }
  } else if (slot.row === "back") {
    score += 40;
    score += frontFilled ? 20 : -20;
  } else {
    score += cardId === "morgan" ? 5 : -10;
  }

  return score;
}

function summonReason(cardId: string, slotKey: SlotKey): string {
  const def = getMonsterDef(cardId);
  const slotLabel = stateSlotLabel(slotKey);
  if (def.role === "front" && slotKey.includes("_front_")) {
    return `前衛カードを${slotLabel}へ召喚`;
  }
  if (def.role === "back" && slotKey.includes("_back_")) {
    return `後衛カードを${slotLabel}へ召喚`;
  }
  return `${getCardName(cardId)}を空き枠へ召喚`;
}

function listFocusDecisions(state: GameState): CpuDecision[] {
  return FIELD_ORDER_BY_PLAYER[state.currentPlayer]
    .filter((slotKey) => canFocusMonster(state, slotKey))
    .map((slotKey) => {
      const score = scoreFocus(state, slotKey);
      return {
        type: "focus",
        slotKey,
        reason: "有効攻撃がないためためる",
        score,
      };
    });
}

function scoreFocus(state: GameState, slotKey: SlotKey): number {
  const monster = state.slots[slotKey].monster;
  if (!monster) {
    return 0;
  }

  let score = 18;
  const upperCommand = getMonsterCommands(monster)[0];
  const canBoostUpperCommandToThreePower = Boolean(upperCommand && upperCommand.power + 1 >= 3);
  if (canBoostUpperCommandToThreePower) {
    score += 20;
  }
  if (monster.hp <= 2 && state.slots[slotKey].row === "front") {
    score -= 10;
  }
  if (getMonsterDef(monster.cardId).role === "back") {
    score += 8;
  }
  return score;
}

function createEndTurnDecision(): CpuDecision {
  return {
    type: "end_turn",
    reason: "有効な行動がないためターン終了",
    score: 0,
  };
}

function compareTieBreak(a: CpuDecision, b: CpuDecision, aIndex: number, bIndex: number): number {
  const priorityDiff = decisionPriority(b) - decisionPriority(a);
  if (priorityDiff !== 0) {
    return priorityDiff;
  }
  return aIndex - bIndex;
}

function decisionPriority(decision: CpuDecision): number {
  if (decision.reason.includes("相手マスターを倒せる")) {
    return 80;
  }
  if (decision.reason.includes("撃破")) {
    return 70;
  }
  if (decision.type === "master_action") {
    return 60;
  }
  if (decision.type === "summon") {
    return 50;
  }
  if (decision.type === "magic") {
    return 45;
  }
  if (decision.type === "attack") {
    return 40;
  }
  if (decision.type === "focus") {
    return 30;
  }
  if (decision.type === "end_turn") {
    return 10;
  }
  return 20;
}

function monsterValue(state: GameState, slotKey: SlotKey): number {
  const slot = state.slots[slotKey];
  const monster = slot.monster;
  if (!monster) {
    return 0;
  }

  const statusFactor = monster.status === "prepared" ? 0.6 : 1;
  const value =
    30 +
    monster.level * 35 +
    monster.hp * 6 +
    monster.investedStones * 8 +
    (monster.actionCount < monster.actionLimit ? 12 : 0) +
    (monster.focused ? 18 : 0) +
    (monster.powerUp ? 16 : 0) +
    (monster.shielded ? 12 : 0) +
    placementValue(state, slot, monster);
  return value * statusFactor;
}

function placementValue(state: GameState, slot: SlotState, monster: MonsterState): number {
  const def = getMonsterDef(monster.cardId);
  if (def.role === "front") {
    return slot.row === "front" ? 12 : -8;
  }

  if (slot.row === "front") {
    return -12;
  }

  return 16 + (state.slots[frontSlotFor(slot)].monster ? 10 : -12);
}

function frontSlotFor(slot: SlotState): SlotKey {
  return `${slot.owner}_front_${slot.lane}`;
}

function isOwnedMonsterTarget(state: GameState, target: Target, playerId: PlayerId): boolean {
  return target.kind === "monster" && state.slots[target.slotKey].monster?.owner === playerId;
}

function attackerWasDefeated(state: GameState, after: GameState, attackerSlotKey: SlotKey): boolean {
  const before = state.slots[attackerSlotKey].monster;
  const current = after.slots[attackerSlotKey].monster;
  return !!before && (!current || current.instanceId !== before.instanceId);
}

function attackerLevelGain(state: GameState, after: GameState, attackerSlotKey: SlotKey): number {
  const before = state.slots[attackerSlotKey].monster;
  const current = after.slots[attackerSlotKey].monster;
  if (!before || !current || current.instanceId !== before.instanceId) {
    return 0;
  }
  return Math.max(0, current.level - before.level);
}

function stateSlotLabel(slotKey: SlotKey): string {
  const [, row, lane] = slotKey.split("_");
  return `${row === "front" ? "前列" : "後列"}${lane === "left" ? "左" : "右"}`;
}
