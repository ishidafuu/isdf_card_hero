import type { HumanActionSnapshot, PlayerId } from "./game/types";

export interface BattleAutomationState {
  autoPlayEnabled: boolean;
  cpuVsCpu: boolean;
  currentPlayer: PlayerId;
  hasPendingLevelUp: boolean;
  hasWinner: boolean;
  handLimitDiscarding: boolean;
  spectatorPaused: boolean;
  workerError: boolean;
}

export function shouldAutoResolveBattle(state: BattleAutomationState): boolean {
  return (
    !state.hasWinner &&
    !state.spectatorPaused &&
    !state.workerError &&
    (state.cpuVsCpu || state.autoPlayEnabled || state.currentPlayer === "cpu")
  );
}

export function isManualBattleActionAllowed(
  actionType: HumanActionSnapshot["type"],
  state: BattleAutomationState,
): boolean {
  if (
    state.hasWinner ||
    state.cpuVsCpu ||
    state.autoPlayEnabled ||
    state.currentPlayer !== "player"
  ) {
    return false;
  }
  if (state.hasPendingLevelUp) {
    return actionType === "resolve_level_up";
  }
  if (state.handLimitDiscarding) {
    return actionType === "end_turn";
  }
  return actionType !== "resolve_level_up";
}

export function canResolveLevelUpManually(state: BattleAutomationState): boolean {
  return state.hasPendingLevelUp && isManualBattleActionAllowed("resolve_level_up", state);
}
