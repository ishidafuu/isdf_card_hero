import { describe, expect, it } from "vitest";
import {
  analyzeTraceDecisionIssues,
  classifyDecisionLogEntry,
  formatTraceDecisionIssuesMarkdown,
} from "../../src/game/deckBattleTraceAnalysis";

describe("deck battle trace analysis", () => {
  it("classifies decision logs into review issue buckets", () => {
    expect(classifyDecisionLogEntry("CPU判断: 有効な行動がないためターン終了")).toContain("resource_stall");
    expect(
      classifyDecisionLogEntry("CPU判断: 配置評価を改善できるため移動 / 見送り: 攻撃は8点差で見送り"),
    ).toEqual(expect.arrayContaining(["low_impact_movement", "missed_attack_pressure"]));
    expect(classifyDecisionLogEntry("CPU判断: 有効攻撃がないためためる")).toContain("late_focus");
  });

  it("summarizes trace decision issues for markdown reports", () => {
    const report = analyzeTraceDecisionIssues([
      {
        logTail: [
          "CPU判断: 配置評価を改善できるため移動 / 見送り: 攻撃は8点差で見送り",
          "CPU判断: 有効な行動がないためターン終了",
        ],
      },
    ]);

    expect(report.totalEntries).toBe(2);
    expect(report.issues.map((issue) => issue.id)).toContain("resource_stall");

    const markdown = formatTraceDecisionIssuesMarkdown(report);
    expect(markdown).toContain("## Decision Issue Summary");
    expect(markdown).toContain("リソース停滞候補");
  });
});
