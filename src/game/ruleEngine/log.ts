import type { GameState } from "../types";

const DISPLAY_LOG_LIMIT = 120;
const EVENT_LOG_LIMIT = 1000;

export function appendLog(state: GameState, message: string): void {
  if (state.eventLog) {
    state.eventLog.push(message);
    if (state.eventLog.length > EVENT_LOG_LIMIT) {
      state.eventLog = state.eventLog.slice(-EVENT_LOG_LIMIT);
    }
  }
  state.log.push(message);
  if (state.log.length > DISPLAY_LOG_LIMIT) {
    state.log = state.log.slice(-DISPLAY_LOG_LIMIT);
  }
}

export function appendRandomResultLog(state: GameState, label: string, result: string): void {
  appendLog(state, `ランダム結果: ${label} -> ${result}`);
}
