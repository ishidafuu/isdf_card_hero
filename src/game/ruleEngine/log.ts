import type { GameState } from "../types";

export function appendLog(state: GameState, message: string): void {
  state.log.push(message);
  if (state.log.length > 120) {
    state.log = state.log.slice(-120);
  }
}

export function appendRandomResultLog(state: GameState, label: string, result: string): void {
  appendLog(state, `ランダム結果: ${label} -> ${result}`);
}
