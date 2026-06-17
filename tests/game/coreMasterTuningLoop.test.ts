import { describe, expect, it } from "vitest";
import {
  DEFAULT_CORE_MASTER_TUNING_VARIANTS,
  type CoreMasterTuningVariant,
  formatCoreMasterTuningLoopMarkdown,
  runCoreMasterTuningLoop,
} from "../../src/game/coreMasterTuningLoop";

const CORE_MASTER_TUNING_LOOP_TEST_TIMEOUT_MS = 90_000;

describe("core master tuning loop", () => {
  it("runs a small white black decoy matrix and formats standings", () => {
    const report = runCoreMasterTuningLoop({
      variants: [
        findVariant("white_pressure_white"),
        findVariant("black_pressure_pressure"),
        findVariant("decoy_back_stable"),
      ],
      gamesPerPairing: 1,
      seedStart: 6500,
      maxSteps: 700,
      maxTurns: 160,
    });

    expect(report.variants).toHaveLength(3);
    expect(report.runs).toHaveLength(6);
    expect(report.standings).toHaveLength(3);
    expect(report.masterSummaries.map((summary) => summary.masterId)).toEqual(["white", "black", "decoy"]);
    expect(report.standings.find((standing) => standing.variant.masterId === "decoy")?.labActionUsage).toBeDefined();

    const markdown = formatCoreMasterTuningLoopMarkdown(report);
    expect(markdown).toContain("# Core Master Tuning Loop");
    expect(markdown).toContain("## Master Summary");
    expect(markdown).toContain("## Standings");
    expect(markdown).toContain("white_pressure_white");
    expect(markdown).toContain("decoy_back_stable");
  }, CORE_MASTER_TUNING_LOOP_TEST_TIMEOUT_MS);
});

function findVariant(id: string): CoreMasterTuningVariant {
  const variant = DEFAULT_CORE_MASTER_TUNING_VARIANTS.find((candidate) => candidate.id === id);
  if (!variant) {
    throw new Error(`Missing core master tuning variant: ${id}`);
  }
  return variant;
}
