import { describe, expect, it } from "vitest";
import {
  appendAiDecisionReviewEntry,
  appendControlledHumanActionReviewEntry,
  appendHumanActionReviewEntry,
  createAiDecisionStateSnapshot,
  humanActionReviewKey,
  restoreAiDecisionStateSnapshot,
} from "../../src/game/aiReviewTrace";
import { createInitialGame } from "../../src/game/rules";
import type { AiDecisionSnapshot } from "../../src/game/types";

describe("ai review trace", () => {
  it("records a restorable pre-decision state only when event logging is enabled", () => {
    const before = createInitialGame(12345, { firstPlayer: "cpu", trackEventLog: true });
    const target = structuredClone(before);
    const decision: AiDecisionSnapshot = {
      type: "end_turn",
      reason: "fixture",
      score: 0,
      trace: {
        turnPlan: {
          planId: "v2-fixture",
          phase: "root",
          step: 1,
          length: 1,
          ownHandoffScore: 12,
          responseScore: 4,
          generatedPlanCount: 3,
          comparedRootCount: 2,
          opponentPlanCount: 4,
          actions: ["end_turn"],
          opponentActions: ["attack"],
        },
      },
    };

    appendAiDecisionReviewEntry(target, before, decision, "end_turn");

    expect(target.aiDecisionHistory).toHaveLength(1);
    const entry = target.aiDecisionHistory?.[0];
    expect(entry?.logIndex).toBe((before.eventLog?.length ?? 0) + 1);
    expect(entry?.decision.trace?.turnPlan?.opponentActions).toEqual(["attack"]);
    expect(entry?.stateBefore).not.toHaveProperty("log");
    expect(entry?.stateBefore).not.toHaveProperty("eventLog");
    expect(entry?.stateBefore).not.toHaveProperty("aiDecisionHistory");

    const restored = restoreAiDecisionStateSnapshot(entry!.stateBefore);
    expect(createAiDecisionStateSnapshot(restored)).toEqual(entry?.stateBefore);
    expect(restored.log).toEqual(["AIレビュー局面を復元"]);
  });

  it("does not add review snapshots to benchmark states without event logging", () => {
    const before = createInitialGame(12346, { firstPlayer: "cpu" });
    const target = structuredClone(before);
    appendAiDecisionReviewEntry(target, before, {
      type: "end_turn",
      reason: "fixture",
      score: 0,
    }, "end_turn");

    expect(target.aiDecisionHistory).toBeUndefined();
  });

  it("records structured human actions with their pre-action state", () => {
    const before = createInitialGame(12348, { firstPlayer: "player", trackEventLog: true });
    const target = structuredClone(before);
    const action = { type: "summon" as const, handInstanceId: "player_card", slotKey: "player_back_left" as const };

    appendHumanActionReviewEntry(target, before, action);

    expect(target.humanActionHistory).toHaveLength(1);
    expect(target.humanActionHistory?.[0]).toMatchObject({
      playerId: "player",
      turnNumber: before.turnNumber,
      actionKey: "summon:player_card:player_back_left",
      action,
    });
    expect(target.humanActionHistory?.[0]?.stateBefore).not.toHaveProperty("humanActionHistory");
    expect(humanActionReviewKey({ type: "end_turn", discardHandInstanceIds: ["a", "b"] }))
      .toBe("end_turn:a,b");
  });

  it("continues the sequence after retained history has been truncated", () => {
    const before = createInitialGame(12347, { firstPlayer: "cpu", trackEventLog: true });
    before.aiDecisionHistory = [{
      sequence: 240,
      logIndex: 1,
      playerId: "cpu",
      turnNumber: 1,
      decisionKey: "end_turn",
      decision: { type: "end_turn", reason: "fixture", score: 0 },
      stateBefore: createAiDecisionStateSnapshot(before),
    }];
    const target = structuredClone(before);

    appendAiDecisionReviewEntry(target, before, {
      type: "end_turn",
      reason: "next",
      score: 0,
    }, "end_turn");

    expect(target.aiDecisionHistory?.at(-1)?.sequence).toBe(241);
  });

  it("keeps absolute log indices after the retained event log reaches its cap", () => {
    const before = createInitialGame(12349, { firstPlayer: "cpu", trackEventLog: true });
    before.log = Array.from({ length: 120 }, (_, index) => `display ${index}`);
    before.logOffset = 1_080;
    before.eventLog = Array.from({ length: 1_000 }, (_, index) => `retained ${index}`);
    const target = structuredClone(before);

    appendAiDecisionReviewEntry(target, before, {
      type: "end_turn",
      reason: "long battle",
      score: 0,
    }, "end_turn");

    expect(target.aiDecisionHistory?.at(-1)?.logIndex).toBe(1_201);
  });

  it("keeps v1 player-only tracing while v2 follows pending owner and fixed seat controller", () => {
    const before = createInitialGame(12350, { firstPlayer: "cpu", trackEventLog: true });
    before.pendingLevelUp = {
      playerId: "player",
      attackerSlotKey: "player_front_left",
      maxLevels: 1,
    };
    const action = { type: "resolve_level_up" as const, levels: 0 };
    const legacy = structuredClone(before);
    appendHumanActionReviewEntry(legacy, before, action);
    expect(legacy.humanActionHistory).toBeUndefined();

    const v2 = structuredClone(before);
    appendControlledHumanActionReviewEntry(v2, before, action, { player: "human", cpu: "cpu" });
    expect(v2.humanActionHistory?.at(-1)).toMatchObject({
      playerId: "player",
      actionKey: "level_up:0:",
    });

    const cpuOwned = structuredClone(before);
    appendControlledHumanActionReviewEntry(cpuOwned, before, action, { player: "cpu", cpu: "human" });
    expect(cpuOwned.humanActionHistory).toBeUndefined();
  });
});
