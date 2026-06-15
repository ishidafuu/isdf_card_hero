import { describe, expect, it } from "vitest";
import {
  compareAiWeightProfiles,
  formatAiWeightComparisonMarkdown,
} from "../../src/game/aiWeightComparison";

describe("ai weight comparison", () => {
  it("compares stable and strong profiles on the same deck battle conditions", () => {
    const report = compareAiWeightProfiles({
      suiteId: "smoke",
      maxDecks: 2,
      seedStart: 610,
      count: 1,
      profiles: ["stable", "strong"],
    });

    expect(report.baselineProfile).toBe("stable");
    expect(report.summaries.map((summary) => summary.profile)).toEqual(["stable", "strong"]);
    expect(report.summaries.every((summary) => summary.games === 2)).toBe(true);
    expect(report.deltas).toHaveLength(1);

    const markdown = formatAiWeightComparisonMarkdown(report);
    expect(markdown).toContain("# AI重みプロファイル比較");
    expect(markdown).toContain("stable");
    expect(markdown).toContain("strong");
  });
});
