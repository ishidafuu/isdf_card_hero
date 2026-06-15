import { describe, expect, it } from "vitest";
import {
  formatAiImprovementLoopMarkdown,
  runAiImprovementLoop,
} from "../../src/game/aiImprovementLoop";

describe("ai improvement loop", () => {
  it("builds priority actions from safety and insight reports", () => {
    const report = runAiImprovementLoop({
      suiteId: "smoke",
      maxDecks: 2,
      seedStart: 710,
      count: 1,
      compareWeights: false,
      maxWarnings: 1,
    });

    expect(report.safety.ok).toBe(true);
    expect(report.insights.source.games).toBe(2);
    expect(report.actions.length).toBeGreaterThan(0);

    const markdown = formatAiImprovementLoopMarkdown(report);
    expect(markdown).toContain("# AI改善ループ");
    expect(markdown).toContain("Priority Actions");
  });
});
