import { describe, expect, it } from "vitest";
import {
  advanceTutorialStep,
  isTutorialVersionComplete,
  saveTutorialCompletion,
  TUTORIAL_STORAGE_KEY,
  TUTORIAL_VERSION,
  tutorialStepForGame,
} from "../src/ui/tutorial";

describe("first-run tutorial", () => {
  it("only considers the current completion version complete", () => {
    expect(isTutorialVersionComplete(String(TUTORIAL_VERSION))).toBe(true);
    expect(isTutorialVersionComplete(null)).toBe(false);
    expect(isTutorialVersionComplete("0")).toBe(false);
  });

  it("advances after a summon, an end turn, the CPU turn, and an active-card action", () => {
    expect(advanceTutorialStep(0, "summon")).toBe(1);
    expect(advanceTutorialStep(1, "attack")).toBe(1);
    expect(advanceTutorialStep(1, "end_turn")).toBe(2);
    expect(advanceTutorialStep(2, "end_turn")).toBe(2);
    expect(advanceTutorialStep(3, "focus")).toBe(4);
  });

  it("selects a useful step when reopened during an existing game", () => {
    expect(tutorialStepForGame("cpu", false, true)).toBe(2);
    expect(tutorialStepForGame("player", false, true)).toBe(1);
    expect(tutorialStepForGame("player", true, false)).toBe(3);
    expect(tutorialStepForGame("player", false, false)).toBe(0);
  });

  it("saves a versioned completion marker", () => {
    const writes: Array<[string, string]> = [];
    saveTutorialCompletion({ setItem: (key, value) => writes.push([key, value]) });
    expect(writes).toEqual([[TUTORIAL_STORAGE_KEY, String(TUTORIAL_VERSION)]]);
  });
});
