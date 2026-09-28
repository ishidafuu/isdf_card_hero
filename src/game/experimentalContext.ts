import type { PlayerId } from "./types";

/** Explicit, immutable opt-in rules context for experimental master sessions. */
export interface ExperimentContextV1 {
  format: "isdf-card-hero-experiment-context";
  version: 1;
  rulesProfileId: "experimental-decoy-timing-v1";
  masterOverlayBySeat?: Partial<Record<PlayerId, "decoy" | "timing">>;
}

export type ExperimentalMasterId = "decoy" | "timing";

/**
 * Validate persisted experiment data without attempting to upgrade or infer
 * unknown versions. Standard sessions should omit this context entirely.
 */
export function isExperimentContextV1(value: unknown): value is ExperimentContextV1 {
  if (!isRecord(value) || !hasOnlyKeys(value, ["format", "version", "rulesProfileId", "masterOverlayBySeat"])) {
    return false;
  }
  if (
    value.format !== "isdf-card-hero-experiment-context" ||
    value.version !== 1 ||
    value.rulesProfileId !== "experimental-decoy-timing-v1"
  ) {
    return false;
  }
  if (value.masterOverlayBySeat === undefined) {
    return true;
  }
  if (!isRecord(value.masterOverlayBySeat) || !hasOnlyKeys(value.masterOverlayBySeat, ["player", "cpu"])) {
    return false;
  }
  return Object.values(value.masterOverlayBySeat).every((candidate) => candidate === "decoy" || candidate === "timing");
}

export function resolveExperimentalMasterForSeat(
  context: ExperimentContextV1 | undefined,
  seat: PlayerId,
): ExperimentalMasterId | undefined {
  if (!context) {
    return undefined;
  }
  return context.masterOverlayBySeat?.[seat];
}

export function assertSupportedExperimentContext(value: unknown): asserts value is ExperimentContextV1 | undefined {
  if (value === undefined) {
    return;
  }
  if (!isExperimentContextV1(value)) {
    throw new Error("Unsupported or invalid experimental session context");
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, allowed: readonly string[]): boolean {
  return Object.keys(value).every((key) => allowed.includes(key));
}
