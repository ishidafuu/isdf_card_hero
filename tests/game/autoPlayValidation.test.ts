import { describe, expect, it } from "vitest";
import { validateAutoPlay } from "../../src/game/autoPlayValidation";
import { buildDeckPresetCardIds, validateDeckPresets } from "../../src/game/deckPresets";
import { summarizeDeckCardIds } from "../../src/game/cards";

describe("auto play validation", () => {
  it("validates an arbitrary seed range without relying on vitest assertions inside the runner", () => {
    const result = validateAutoPlay({
      seedStart: 410,
      count: 5,
      maxSteps: 500,
      maxTurns: 120,
    });

    expect(result.ok).toBe(true);
    expect(result.seeds).toEqual([410, 411, 412, 413, 414]);
    expect(result.games).toHaveLength(5);
    expect(result.summary.failures).toBe(0);
  }, 20_000);

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

  it("runs auto play with the special showcase preset", () => {
    const result = validateAutoPlay({
      seedStart: 620,
      count: 5,
      deckPreset: "special-showcase",
      maxSteps: 600,
      maxTurns: 140,
    });

    expect(result.options.deckPreset).toBe("special-showcase");
    expect(result.ok).toBe(true);
    expect(result.summary.failures).toBe(0);
  }, 20_000);

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
      seedStart: 404,
      count: 1,
      maxSteps: 140,
      maxTurns: 120,
      historyLimit: 140,
    });

    expect(result.ok).toBe(false);
    expect(result.issues[0]).toMatchObject({
      kind: "step_limit",
      severity: "failure",
      seed: 404,
    });
    expect(result.issues[0].history.length).toBeGreaterThan(120);
    expect(result.issues[0].history.every((event) => event.newLog.length > 0)).toBe(true);
  }, 20_000);
});
