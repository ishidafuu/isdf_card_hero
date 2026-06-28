import { describe, expect, it } from "vitest";
import {
  DEFAULT_WHITE_AI_TUNING_OPPONENTS,
  DEFAULT_WHITE_AI_TUNING_VARIANTS,
  formatWhiteAiTuningLoopMarkdown,
  runWhiteAiTuningLoop,
} from "../../src/game/whiteAiTuningLoop";

const WHITE_AI_TUNING_LOOP_TEST_TIMEOUT_MS = 60_000;

describe("white ai tuning loop", () => {
  it("runs a minimal directed white tuning matchup report", () => {
    const report = runWhiteAiTuningLoop({
      variants: DEFAULT_WHITE_AI_TUNING_VARIANTS.slice(0, 1),
      opponents: DEFAULT_WHITE_AI_TUNING_OPPONENTS.slice(0, 1),
      gamesPerMatchup: 1,
      seedStart: 9900,
      maxSteps: 700,
      maxTurns: 160,
    });

    expect(report.variants).toHaveLength(1);
    expect(report.runs).toHaveLength(2);
    expect(report.standings).toHaveLength(1);
    expect(report.standings[0].games).toBe(2);
    expect(report.standings[0].matchups.black.games).toBe(2);
    expect(report.standings[0].turnIntentMetrics.totalActions).toBeGreaterThan(0);

    const markdown = formatWhiteAiTuningLoopMarkdown(report);
    expect(markdown).toContain("# White AI Tuning Loop");
    expect(markdown).toContain("vs Black");
    expect(markdown).toContain("Intent");
  }, WHITE_AI_TUNING_LOOP_TEST_TIMEOUT_MS);
});
