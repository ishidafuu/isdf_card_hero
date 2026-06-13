import { describe, expect, it } from "vitest";
import { validateAutoPlay } from "../../src/game/autoPlayValidation";
import { buildDeckPresetCardIds, DECK_PRESET_IDS, deckPresetAllowsSpecial, validateDeckPresets } from "../../src/game/deckPresets";
import { summarizeDeckCardIds } from "../../src/game/cards";

const AUTO_PLAY_TEST_TIMEOUT_MS = 30_000;

describe("auto play validation", () => {
  it("validates an arbitrary seed range without relying on vitest assertions inside the runner", () => {
    const result = validateAutoPlay({
      seedStart: 410,
      count: 2,
      maxSteps: 500,
      maxTurns: 120,
    });

    expect(result.ok).toBe(true);
    expect(result.seeds).toEqual([410, 411]);
    expect(result.games).toHaveLength(2);
    expect(result.summary.failures).toBe(0);
  }, AUTO_PLAY_TEST_TIMEOUT_MS);

  it("validates the special showcase preset as a fixed special-on deck", () => {
    validateDeckPresets();
    const cardIds = buildDeckPresetCardIds("special-showcase");
    const summary = summarizeDeckCardIds(cardIds, [], { allowSpecial: true });

    expect(summary.valid).toBe(true);
    expect(summary.categories).toMatchObject({
      front: 12,
      back: 6,
      magic: 6,
      special: 6,
    });
  });

  it("validates every deck preset for fixed-deck UI loading", () => {
    validateDeckPresets();

    for (const presetId of DECK_PRESET_IDS) {
      const cardIds = buildDeckPresetCardIds(presetId);
      const summary = summarizeDeckCardIds(cardIds, [], {
        allowSpecial: deckPresetAllowsSpecial(presetId),
      });

      expect(summary.valid, presetId).toBe(true);
      expect(summary.total, presetId).toBe(30);
      expect(summary.duplicateViolations, presetId).toEqual([]);
    }
  });

  it("runs auto play with the special showcase preset", () => {
    const result = validateAutoPlay({
      seedStart: 620,
      count: 2,
      deckPreset: "special-showcase",
      maxSteps: 600,
      maxTurns: 140,
    });

    expect(result.options.deckPreset).toBe("special-showcase");
    expect(result.ok).toBe(true);
    expect(result.summary.failures).toBe(0);
  }, AUTO_PLAY_TEST_TIMEOUT_MS);

  it("runs auto play with black masters", () => {
    const result = validateAutoPlay({
      seedStart: 640,
      count: 2,
      masterIds: { player: "black", cpu: "black" },
      maxSteps: 650,
      maxTurns: 140,
    });

    expect(result.options.masterIds).toEqual({ player: "black", cpu: "black" });
    expect(result.ok).toBe(true);
    expect(result.summary.failures).toBe(0);
  }, AUTO_PLAY_TEST_TIMEOUT_MS);

  it("resolves the strong AI profile for both sides", () => {
    const result = validateAutoPlay({
      seedStart: 430,
      count: 1,
      aiProfile: "strong",
      maxSteps: 1,
      maxTurns: 140,
    });

    expect(result.options.aiProfile).toBe("strong");
    expect(result.options.aiProfiles).toEqual({ player: "strong", cpu: "strong" });
    expect(result.games).toHaveLength(1);
  }, AUTO_PLAY_TEST_TIMEOUT_MS);

  it("resolves asymmetric AI profiles", () => {
    const result = validateAutoPlay({
      seedStart: 430,
      count: 1,
      aiProfiles: { player: "stable", cpu: "strong" },
      maxSteps: 1,
      maxTurns: 140,
    });

    expect(result.options.aiProfile).toBe("stable");
    expect(result.options.aiProfiles).toEqual({ player: "stable", cpu: "strong" });
    expect(result.games).toHaveLength(1);
  }, AUTO_PLAY_TEST_TIMEOUT_MS);

  it("captures reproducible state, log tail, and decision history for failures", () => {
    const result = validateAutoPlay({
      seedStart: 410,
      count: 1,
      maxSteps: 1,
      maxTurns: 120,
    });

    expect(result.ok).toBe(false);
    expect(result.issues[0]).toMatchObject({
      kind: "step_limit",
      severity: "failure",
      seed: 410,
    });
    expect(result.issues[0].logTail.length).toBeGreaterThan(0);
    expect(result.issues[0].stateSummary.slots).toHaveLength(8);
    expect(result.issues[0].history.length).toBeGreaterThan(0);
  });

  it("keeps per-decision new log entries after the game log reaches its cap", () => {
    const result = validateAutoPlay({
      seedStart: 400,
      count: 1,
      maxSteps: 140,
      maxTurns: 120,
      historyLimit: 140,
    });

    expect(result.ok).toBe(false);
    expect(result.issues[0]).toMatchObject({
      kind: "step_limit",
      severity: "failure",
      seed: 400,
    });
    expect(result.issues[0].history.length).toBeGreaterThan(120);
    expect(result.issues[0].history.every((event) => event.newLog.length > 0)).toBe(true);
  }, AUTO_PLAY_TEST_TIMEOUT_MS);
});
