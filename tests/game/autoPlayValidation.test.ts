import { describe, expect, it } from "vitest";
import { validateAutoPlay } from "../../src/game/autoPlayValidation";

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
});
