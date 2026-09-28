export const TUTORIAL_VERSION = 1;
export const TUTORIAL_STORAGE_KEY = "card-hero:tutorial-completed-version";

export type TutorialStep = 0 | 1 | 2 | 3;
export type TutorialActionType =
  | "attack"
  | "master_action"
  | "summon"
  | "magic"
  | "move"
  | "focus"
  | "master_hp_draw"
  | "discard_hand"
  | "resolve_level_up"
  | "end_turn";

const FOLLOWUP_ACTIONS = new Set<TutorialActionType>([
  "attack",
  "master_action",
  "magic",
  "move",
  "focus",
  "master_hp_draw",
  "discard_hand",
  "resolve_level_up",
]);

export function isTutorialVersionComplete(storedVersion: string | null): boolean {
  return storedVersion === String(TUTORIAL_VERSION);
}

export function advanceTutorialStep(step: number, actionType: TutorialActionType): number {
  if (step === 0 && actionType === "summon") {
    return 1;
  }
  if (step === 1 && actionType === "end_turn") {
    return 2;
  }
  if (step === 3 && FOLLOWUP_ACTIONS.has(actionType)) {
    return 4;
  }
  return step;
}

export function tutorialStepForGame(
  currentPlayer: "player" | "cpu",
  hasActivePlayerMonster: boolean,
  hasPreparedPlayerMonster: boolean,
): TutorialStep {
  if (currentPlayer === "cpu") {
    return 2;
  }
  if (hasActivePlayerMonster) {
    return 3;
  }
  if (hasPreparedPlayerMonster) {
    return 1;
  }
  return 0;
}

export function saveTutorialCompletion(storage: Pick<Storage, "setItem">): void {
  storage.setItem(TUTORIAL_STORAGE_KEY, String(TUTORIAL_VERSION));
}
