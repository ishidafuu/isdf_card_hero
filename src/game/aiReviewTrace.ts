import type {
  AiDecisionSnapshot,
  AiDecisionStateSnapshot,
  GameState,
} from "./types";

const AI_DECISION_HISTORY_LIMIT = 240;

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
    ...snapshot
  } = state;
  return structuredClone(snapshot);
}

export function restoreAiDecisionStateSnapshot(snapshot: AiDecisionStateSnapshot): GameState {
  return {
    ...structuredClone(snapshot),
    log: ["AIレビュー局面を復元"],
    logOffset: 0,
    eventLog: ["AIレビュー局面を復元"],
  };
}
