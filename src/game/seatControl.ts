import type { GameState, PlayerId } from "./types";

export type SeatController = "human" | "cpu";
export type SeatControllerBySeat = Readonly<Record<PlayerId, SeatController>>;

/** The pending prompt owner is the actor, even if currentPlayer differs. */
export function getEffectiveActor(state: Pick<GameState, "currentPlayer" | "pendingLevelUp">): PlayerId {
  return state.pendingLevelUp?.playerId ?? state.currentPlayer;
}

/** Pure auto-step gate; view/workspace mode is deliberately decided by the caller. */
export function shouldRunAutoStep(
  state: Pick<GameState, "winner" | "currentPlayer" | "pendingLevelUp">,
  controllerBySeat: SeatControllerBySeat,
): boolean {
  return !state.winner && controllerBySeat[getEffectiveActor(state)] === "cpu";
}
