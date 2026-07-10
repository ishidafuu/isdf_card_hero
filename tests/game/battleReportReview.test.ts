import { describe, expect, it } from "vitest";
import { matchReviewCommentsToDecisions } from "../../scripts/lib/battleReportReview";
import type { AiDecisionHistoryEntry } from "../../src/game/types";

describe("battle report review", () => {
  it("matches a comment to the latest preceding AI decision", () => {
    const decisions = [decisionEntry(1, 10), decisionEntry(2, 20)];
    const matches = matchReviewCommentsToDecisions({
      reportId: "fixture",
      aiDecisionHistory: decisions,
      comments: [
        { logIndex: 24, entry: "action", stamp: "bad", comment: "BAD: late action" },
        { logIndex: 12, entry: "good", stamp: "good", comment: "GOOD: ignored by default" },
      ],
    });

    expect(matches).toHaveLength(1);
    expect(matches[0].decision.sequence).toBe(2);
  });
});

function decisionEntry(sequence: number, logIndex: number): AiDecisionHistoryEntry {
  return {
    sequence,
    logIndex,
    playerId: "cpu",
    turnNumber: sequence,
    decisionKey: "end_turn",
    decision: { type: "end_turn", reason: "fixture", score: 0 },
    stateBefore: {
      players: {} as AiDecisionHistoryEntry["stateBefore"]["players"],
      slots: {} as AiDecisionHistoryEntry["stateBefore"]["slots"],
      currentPlayer: "cpu",
      firstPlayer: "player",
      turnNumber: sequence,
      randomSeed: 1,
    },
  };
}
