import { describe, expect, it } from "vitest";
import {
  assertSupportedExperimentContext,
  isExperimentContextV1,
  resolveExperimentalMasterForSeat,
  type ExperimentContextV1,
} from "../../src/game/experimentalContext";

const context: ExperimentContextV1 = {
  format: "isdf-card-hero-experiment-context",
  version: 1,
  rulesProfileId: "experimental-decoy-timing-v1",
  masterOverlayBySeat: { player: "decoy", cpu: "timing" },
};

describe("experimental session context", () => {
  it("recognizes only the versioned decoy/timing overlay and resolves by seat", () => {
    expect(isExperimentContextV1(context)).toBe(true);
    expect(resolveExperimentalMasterForSeat(context, "player")).toBe("decoy");
    expect(resolveExperimentalMasterForSeat(context, "cpu")).toBe("timing");
    expect(resolveExperimentalMasterForSeat(undefined, "player")).toBeUndefined();
  });

  it("rejects unknown versions, candidates, rules profiles, and extra parameter bags", () => {
    expect(isExperimentContextV1({ ...context, version: 2 })).toBe(false);
    expect(isExperimentContextV1({ ...context, masterOverlayBySeat: { player: "sacrifice" } })).toBe(false);
    expect(isExperimentContextV1({ ...context, rulesProfileId: "unknown" })).toBe(false);
    expect(isExperimentContextV1({ ...context, parameters: { newRule: true } })).toBe(false);
  });

  it("treats only omitted context as standard and rejects null or malformed persisted values", () => {
    expect(() => assertSupportedExperimentContext(undefined)).not.toThrow();
    expect(() => assertSupportedExperimentContext(null)).toThrow("Unsupported or invalid");
    expect(() => assertSupportedExperimentContext({ ...context, version: 99 })).toThrow("Unsupported or invalid");
  });
});
