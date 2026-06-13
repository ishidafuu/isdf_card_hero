import { describe, expect, it } from "vitest";
import { getDeckBenchmarkSuite, getDeckBenchmarkSuites } from "../../src/game/deckBenchmarkSuites";
import { DECK_SUBMISSION_PRESETS } from "../../src/game/deckSubmissionPresets";
import { analyzeDeckSubmissions, summarizeDeckTemplateGroups } from "../../src/game/deckTemplateAnalysis";

describe("deck template analysis", () => {
  it("audits every imported submission deck with practical metadata", () => {
    const audits = analyzeDeckSubmissions();

    expect(audits).toHaveLength(DECK_SUBMISSION_PRESETS.length);
    expect(audits[0].practicalScore).toBeGreaterThan(0);
    expect(audits.every((audit) => audit.total === 30)).toBe(true);
    expect(audits.every((audit) => audit.keyCards.length > 0)).toBe(true);
    expect(audits.every((audit) => audit.archetypes.length > 0)).toBe(true);
  });

  it("summarizes the four requested submission groups", () => {
    const groups = summarizeDeckTemplateGroups(analyzeDeckSubmissions());

    expect(groups.map((group) => group.group).sort()).toEqual([
      "pro-no-rare8-black",
      "pro-no-rare8-white",
      "pro-with-rare8-black",
      "pro-with-rare8-white",
    ]);
    expect(groups.reduce((total, group) => total + group.total, 0)).toBe(524);
    expect(groups.every((group) => group.topDecks.length > 0)).toBe(true);
  });

  it("builds deterministic AI benchmark suites from audited decks", () => {
    const suites = getDeckBenchmarkSuites();
    const core = getDeckBenchmarkSuite("core");
    const smoke = getDeckBenchmarkSuite("smoke");
    const stress = getDeckBenchmarkSuite("stress");
    const holdout = getDeckBenchmarkSuite("holdout");

    expect(suites.map((suite) => suite.id)).toEqual(["smoke", "core", "stress", "holdout"]);
    expect(smoke.deckPresetIds).toHaveLength(8);
    expect(core.deckPresetIds).toHaveLength(40);
    expect(stress.deckPresetIds).toHaveLength(12);
    expect(holdout.deckPresetIds).toHaveLength(20);
    expect(new Set(core.deckPresetIds).size).toBe(core.deckPresetIds.length);
    expect(core.deckPresetIds.some((id) => holdout.deckPresetIds.includes(id))).toBe(false);
  });
});
