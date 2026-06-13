import { describe, expect, it } from "vitest";
import { getCardPool, summarizeDeckCardIds } from "../../src/game/cards";
import { filterDeckPresets } from "../../src/game/deckPresets";
import {
  DECK_SUBMISSION_PRESET_GROUPS,
  DECK_SUBMISSION_PRESETS,
  type DeckSubmissionGroupId,
} from "../../src/game/deckSubmissionPresets";

const EXPECTED_COUNTS: Record<DeckSubmissionGroupId, number> = {
  "pro-no-rare8-black": 180,
  "pro-with-rare8-black": 145,
  "pro-no-rare8-white": 160,
  "pro-with-rare8-white": 39,
};

describe("deck submission presets", () => {
  it("imports only the requested Pro black and white submission groups", () => {
    expect(DECK_SUBMISSION_PRESETS).toHaveLength(524);
    expect(DECK_SUBMISSION_PRESET_GROUPS.map((group) => group.id)).toEqual(Object.keys(EXPECTED_COUNTS));

    for (const group of DECK_SUBMISSION_PRESET_GROUPS) {
      const presets = DECK_SUBMISSION_PRESETS.filter((preset) => preset.group === group.id);
      expect(presets, group.id).toHaveLength(EXPECTED_COUNTS[group.id]);
      expect(presets.every((preset) => preset.mode === group.mode), group.id).toBe(true);
      expect(presets.every((preset) => preset.masterId === group.masterId), group.id).toBe(true);
    }
  });

  it("keeps every imported submission deck loadable as a fixed deck", () => {
    for (const preset of DECK_SUBMISSION_PRESETS) {
      const summary = summarizeDeckCardIds(preset.cardIds, [], {
        allowSpecial: preset.allowSpecial,
      });
      const hasSpecialCard = preset.cardIds.some((cardId) => getCardPool(cardId) === "special");

      expect(summary.valid, preset.id).toBe(true);
      expect(summary.total, preset.id).toBe(30);
      expect(summary.duplicateViolations, preset.id).toEqual([]);
      expect(preset.allowSpecial, preset.id).toBe(hasSpecialCard);
      expect(preset.sourceUrl, preset.id).toBe(`https://www.cardhero-bu.com/deck/topic.php?id=${preset.sourceDeckId}`);
    }
  });

  it("includes representative recent source decks", () => {
    expect(DECK_SUBMISSION_PRESETS.find((preset) => preset.sourceDeckId === 1408)).toMatchObject({
      id: "submission-pro-no-rare8-black-1408",
      mode: "Pro 8なし",
      masterId: "black",
      allowSpecial: true,
    });
    expect(DECK_SUBMISSION_PRESETS.find((preset) => preset.sourceDeckId === 1405)).toMatchObject({
      id: "submission-pro-with-rare8-white-1405",
      mode: "Pro 8あり",
      masterId: "white",
      allowSpecial: false,
    });
  });

  it("filters preset choices by master and Pro 8 mode", () => {
    const blackNoRare8 = filterDeckPresets({ master: "black", rare8: "without" });
    const whiteWithRare8 = filterDeckPresets({ master: "white", rare8: "with" });

    expect(blackNoRare8).toHaveLength(EXPECTED_COUNTS["pro-no-rare8-black"]);
    expect(blackNoRare8.every((preset) => preset.masterId === "black" && preset.mode === "Pro 8なし")).toBe(true);
    expect(whiteWithRare8).toHaveLength(EXPECTED_COUNTS["pro-with-rare8-white"]);
    expect(whiteWithRare8.every((preset) => preset.masterId === "white" && preset.mode === "Pro 8あり")).toBe(true);
    expect(filterDeckPresets({ master: "all", rare8: "all" }).length).toBeGreaterThan(DECK_SUBMISSION_PRESETS.length);
  });
});
