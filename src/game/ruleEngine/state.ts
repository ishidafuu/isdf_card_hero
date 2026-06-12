import type { GameState } from "../types";

export function cloneState(state: GameState): GameState {
  return structuredClone(state) as GameState;
}
