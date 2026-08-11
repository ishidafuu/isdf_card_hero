import { describe, expect, it } from "vitest";
import {
  canResolveLevelUpManually,
  isManualBattleActionAllowed,
  shouldAutoResolveBattle,
  type BattleAutomationState,
} from "../../src/uiBattleGuards";
import type { HumanActionSnapshot } from "../../src/game/types";

const manualPlayerState: BattleAutomationState = {
  autoPlayEnabled: false,
  cpuVsCpu: false,
  currentPlayer: "player",
  hasPendingLevelUp: false,
  hasWinner: false,
  handLimitDiscarding: false,
  spectatorPaused: false,
  workerError: false,
};

describe("UI battle guards", () => {
  it("blocks every ordinary human action during auto play and CPU-vs-CPU", () => {
    const actionTypes: HumanActionSnapshot["type"][] = [
      "attack",
      "master_action",
      "summon",
      "magic",
      "move",
      "focus",
      "master_hp_draw",
      "discard_hand",
      "resolve_level_up",
      "end_turn",
    ];
    for (const state of [
      { ...manualPlayerState, autoPlayEnabled: true },
      { ...manualPlayerState, cpuVsCpu: true },
      { ...manualPlayerState, currentPlayer: "cpu" as const },
    ]) {
      for (const actionType of actionTypes) {
        expect(isManualBattleActionAllowed(actionType, state)).toBe(false);
      }
    }
  });

  it("only permits the matching interrupt action during manual choices", () => {
    const pendingLevelUp = { ...manualPlayerState, hasPendingLevelUp: true };
    expect(canResolveLevelUpManually(pendingLevelUp)).toBe(true);
    expect(isManualBattleActionAllowed("resolve_level_up", pendingLevelUp)).toBe(true);
    expect(isManualBattleActionAllowed("attack", pendingLevelUp)).toBe(false);

    const handLimit = { ...manualPlayerState, handLimitDiscarding: true };
    expect(isManualBattleActionAllowed("end_turn", handLimit)).toBe(true);
    expect(isManualBattleActionAllowed("attack", handLimit)).toBe(false);
  });

  it("keeps manual CPU level-up pending states on the auto-resolution path", () => {
    const cpuPending = {
      ...manualPlayerState,
      currentPlayer: "cpu" as const,
      hasPendingLevelUp: true,
    };
    expect(shouldAutoResolveBattle(cpuPending)).toBe(true);
    expect(canResolveLevelUpManually(cpuPending)).toBe(false);
  });

  it("stops scheduling while paused, finished, or after a worker error", () => {
    expect(shouldAutoResolveBattle({ ...manualPlayerState, cpuVsCpu: true, spectatorPaused: true })).toBe(false);
    expect(shouldAutoResolveBattle({ ...manualPlayerState, autoPlayEnabled: true, hasWinner: true })).toBe(false);
    expect(shouldAutoResolveBattle({ ...manualPlayerState, autoPlayEnabled: true, workerError: true })).toBe(false);
  });
});
