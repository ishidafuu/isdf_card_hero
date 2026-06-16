import { describe, expect, it } from "vitest";
import {
  formatMasterLabImprovementLoopMarkdown,
  runMasterLabImprovementLoop,
} from "../../src/game/masterLabImprovementLoop";

const MASTER_LAB_IMPROVEMENT_LOOP_TEST_TIMEOUT_MS = 90_000;

describe("master lab improvement loop", () => {
  it("runs a small deck hypothesis loop and formats the report", () => {
    const report = runMasterLabImprovementLoop({
      candidateId: "decoy",
      loopCount: 2,
      gamesPerMatchup: 1,
      maxSteps: 700,
      maxTurns: 160,
    });

    expect(report.entries).toHaveLength(2);
    expect(report.rankedEntries).toHaveLength(2);
    expect(report.entries[0].result.summary.games).toBe(5);
    expect(report.entries[0].experimentKind).toBe("deck");
    expect(report.entries[0].experimentLabel).toContain("通常プレッシャー");
    expect(report.best.metrics.games).toBe(5);
    expect(report.conclusion.nextSteps.length).toBeGreaterThan(0);

    const markdown = formatMasterLabImprovementLoopMarkdown(report);
    expect(markdown).toContain("# Master Lab Improvement Loop: decoy");
    expect(markdown).toContain("## Summary");
    expect(markdown).toContain("## Next Loop Proposal");
    expect(markdown).toContain("## Loop Schedule");
    expect(markdown).toContain("## Loop Results");
    expect(markdown).toContain("## Loop Notes");
    expect(markdown).toContain("### Loop 1:");
    expect(markdown).toContain("次アクション");
    expect(markdown).toContain("pressure-normal");
  }, MASTER_LAB_IMPROVEMENT_LOOP_TEST_TIMEOUT_MS);

  it("runs the scapegoat target plan and reports enemy target rates", () => {
    const report = runMasterLabImprovementLoop({
      candidateId: "decoy",
      plan: "scapegoat",
      loopCount: 6,
      gamesPerMatchup: 1,
      maxSteps: 700,
      maxTurns: 160,
    });

    expect(report.entries).toHaveLength(6);
    expect(report.entries[5].experimentId).toBe("target_black_enemy_plus8");
    expect(report.entries[5].labEvaluationTuning?.targetOwnerBias?.enemy).toBe(8);
    expect(report.best.metrics.labActionTargetUsage).toBeDefined();

    const markdown = formatMasterLabImprovementLoopMarkdown(report);
    expect(markdown).toContain("target enemy +8");
    expect(markdown).toContain("(E ");
    expect(markdown).toContain("敵スケープゴート率");
  }, MASTER_LAB_IMPROVEMENT_LOOP_TEST_TIMEOUT_MS);
});
