import { describe, expect, it } from "vitest";
import {
  formatCardAdjustmentSimulationMarkdown,
  simulateCardAdjustmentImpact,
  simulateCardAdjustmentImpacts,
} from "../../src/game/cardAdjustmentSimulation";

describe("card adjustment simulation", () => {
  it("estimates risk and review notes from card trait tags", () => {
    const impact = simulateCardAdjustmentImpact({ cardId: "thunder", powerDelta: 1 });

    expect(impact.name).toBe("サンダー");
    expect(impact.tags).toContain("effect:damage");
    expect(impact.riskLevel).toBe("medium");
    expect(impact.reviewNotes.join(" ")).toContain("ダメージ系");
  });

  it("formats adjustment impact reports", () => {
    const report = simulateCardAdjustmentImpacts([
      { cardId: "card_001", hpDelta: 1 },
      { cardId: "healing", costDelta: -1 },
    ]);

    expect(report.impacts).toHaveLength(2);
    expect(report.reviewFocus.length).toBeGreaterThan(0);

    const markdown = formatCardAdjustmentSimulationMarkdown(report);
    expect(markdown).toContain("# カード調整シミュレーション");
    expect(markdown).toContain("Impacts");
  });
});
