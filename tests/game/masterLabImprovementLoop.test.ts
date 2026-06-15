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
    expect(report.best.metrics.games).toBe(5);
    expect(report.conclusion.nextSteps.length).toBeGreaterThan(0);

    const markdown = formatMasterLabImprovementLoopMarkdown(report);
    expect(markdown).toContain("# Master Lab Improvement Loop: decoy");
    expect(markdown).toContain("## Loop Results");
    expect(markdown).toContain("pressure-normal");
  }, MASTER_LAB_IMPROVEMENT_LOOP_TEST_TIMEOUT_MS);
});
