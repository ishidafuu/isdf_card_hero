import { describe, expect, it } from "vitest";
import {
  appendAiDecisionReviewEntry,
  createAiDecisionStateSnapshot,
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
});
