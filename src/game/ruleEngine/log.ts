import type { GameState } from "../types";

const DISPLAY_LOG_LIMIT = 120;
const EVENT_LOG_LIMIT = 1000;

export function appendLog(state: GameState, message: string): void {
  const retainedHistoryLength = state.eventLog?.length ?? state.log.length;
  const currentLogOffset = state.logOffset ?? Math.max(0, retainedHistoryLength - state.log.length);
  if (state.eventLog) {
    state.eventLog.push(message);
    if (state.eventLog.length > EVENT_LOG_LIMIT) {
      state.eventLog = state.eventLog.slice(-EVENT_LOG_LIMIT);
    }
  }
  state.log.push(message);
  if (state.log.length > DISPLAY_LOG_LIMIT) {
    const overflow = state.log.length - DISPLAY_LOG_LIMIT;
    state.log = state.log.slice(-DISPLAY_LOG_LIMIT);
    state.logOffset = currentLogOffset + overflow;
  } else if (state.logOffset === undefined) {
    state.logOffset = currentLogOffset;
  }
}

export function appendRandomResultLog(state: GameState, label: string, result: string): void {
  appendLog(state, `ランダム結果: ${label} -> ${result}`);
}
