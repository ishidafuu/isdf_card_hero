import { describe, expect, it } from "vitest";
import {
  formatCardAdjustmentSafetyMarkdown,
  runCardAdjustmentSafetyGate,
} from "../../src/game/cardAdjustmentSafety";

describe("card adjustment safety gate", () => {
  it("runs trait coverage and a small deck battle gate", () => {
    const report = runCardAdjustmentSafetyGate({
      suiteId: "smoke",
      maxDecks: 2,
      seedStart: 630,
      count: 1,
      compareWeights: false,
      maxFailures: 0,
      maxWarnings: 0,
      maxSeatDelta: 1,
      minTopWinPointRate: 0,
    });

    expect(report.ok).toBe(true);
    expect(report.checks.find((check) => check.id === "magic_trait_coverage")).toMatchObject({ status: "pass" });
    expect(report.checks.find((check) => check.id === "max_seat_delta")).toMatchObject({ status: "pass" });
    expect(report.deckBattleReport.summary.games).toBe(2);

    const markdown = formatCardAdjustmentSafetyMarkdown(report);
    expect(markdown).toContain("# カード調整セーフティゲート");
    expect(markdown).toContain("magic_trait_coverage");
  });
});
