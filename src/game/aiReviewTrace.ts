import type {
  AiDecisionSnapshot,
  AiDecisionStateSnapshot,
  GameState,
  HumanActionSnapshot,
} from "./types";

const AI_DECISION_HISTORY_LIMIT = 240;
const HUMAN_ACTION_HISTORY_LIMIT = 240;

export function appendAiDecisionReviewEntry(
  target: GameState,
  before: GameState,
  decision: AiDecisionSnapshot,
  decisionKey: string,
): void {
  if (!before.eventLog) {
    return;
  }
  const previous = before.aiDecisionHistory ?? [];
  const sequence = (previous.at(-1)?.sequence ?? 0) + 1;
  target.aiDecisionHistory = [
    ...previous,
    {
      sequence,
      logIndex: (before.eventLog?.length ?? before.log.length) + 1,
      playerId: before.currentPlayer,
      turnNumber: before.turnNumber,
      decisionKey,
      decision: structuredClone(decision),
      stateBefore: createAiDecisionStateSnapshot(before),
    },
  ].slice(-AI_DECISION_HISTORY_LIMIT);
}

export function createAiDecisionStateSnapshot(state: GameState): AiDecisionStateSnapshot {
  const {
    log: _log,
    logOffset: _logOffset,
    eventLog: _eventLog,
    aiDecisionHistory: _aiDecisionHistory,
    humanActionHistory: _humanActionHistory,
    ...snapshot
  } = state;
  return structuredClone(snapshot);
}

export function appendHumanActionReviewEntry(
  target: GameState,
  before: GameState,
  action: HumanActionSnapshot,
): void {
  if (!before.eventLog || before.currentPlayer !== "player") {
    return;
  }
  const previous = before.humanActionHistory ?? [];
  const sequence = (previous.at(-1)?.sequence ?? 0) + 1;
  target.humanActionHistory = [
    ...previous,
    {
      sequence,
      logIndex: (before.eventLog?.length ?? before.log.length) + 1,
      playerId: before.currentPlayer,
      turnNumber: before.turnNumber,
      actionKey: humanActionReviewKey(action),
      action: structuredClone(action),
      stateBefore: createAiDecisionStateSnapshot(before),
    },
  ].slice(-HUMAN_ACTION_HISTORY_LIMIT);
}

export function humanActionReviewKey(action: HumanActionSnapshot): string {
  if (action.type === "attack") {
    return `attack:${action.action.attackerSlotKey}:${action.action.commandId}:${reviewTargetKey(action.action.target)}`;
  }
  if (action.type === "master_action") {
    return `master:${action.actionId}:${reviewTargetKey(action.target)}`;
  }
  if (action.type === "summon") {
    return `summon:${action.handInstanceId}:${action.slotKey}`;
  }
  if (action.type === "magic") {
    return `magic:${action.action.handInstanceId}:${reviewTargetKey(action.action.target)}`;
  }
  if (action.type === "move") {
    return `move:${action.fromSlotKey}:${action.toSlotKey}`;
  }
  if (action.type === "focus") {
    return `focus:${action.slotKey}`;
  }
  if (action.type === "resolve_level_up") {
    return `level_up:${action.levels}:${action.superHandInstanceId ?? ""}`;
  }
  if (action.type === "master_hp_draw") {
    return "master_hp_draw";
  }
  if (action.type === "discard_hand") {
    return `discard_hand:${action.handInstanceId}`;
  }
  return `end_turn:${action.discardHandInstanceIds?.join(",") ?? ""}`;
}

function reviewTargetKey(target: { kind: "monster"; slotKey: string } | { kind: "master"; playerId: string }): string {
  return target.kind === "monster" ? `monster:${target.slotKey}` : `master:${target.playerId}`;
}

export function restoreAiDecisionStateSnapshot(snapshot: AiDecisionStateSnapshot): GameState {
  return {
    ...structuredClone(snapshot),
    log: ["AIレビュー局面を復元"],
    logOffset: 0,
    eventLog: ["AIレビュー局面を復元"],
  };
}
