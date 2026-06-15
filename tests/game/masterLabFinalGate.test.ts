import { describe, expect, it } from "vitest";
import {
  buildMasterLabFinalGateMatchups,
  formatMasterLabFinalGateMarkdown,
  runMasterLabFinalGate,
} from "../../src/game/masterLabFinalGate";

const MASTER_LAB_FINAL_GATE_TEST_TIMEOUT_MS = 60_000;

describe("master lab final gate", () => {
  it("builds the final matchup matrix for a candidate", () => {
    const matchups = buildMasterLabFinalGateMatchups("decoy");

    expect(matchups.map((matchup) => matchup.id)).toEqual([
      "decoy_vs_white",
      "white_vs_decoy",
      "decoy_vs_black",
      "black_vs_decoy",
      "decoy_mirror",
    ]);
    expect(matchups[0].recommendedGames).toBe(100);
    expect(matchups[4].recommendedGames).toBe(50);
  });

  it("runs a smoke final gate with an override count", () => {
    const result = runMasterLabFinalGate({
      candidateId: "decoy",
      gamesPerMatchup: 1,
      maxSteps: 700,
      maxTurns: 160,
    });

    expect(result.ok).toBe(true);
    expect(result.runs).toHaveLength(5);
    expect(result.summary.games).toBe(5);
    expect(result.summary.failures).toBe(0);

    const markdown = formatMasterLabFinalGateMarkdown(result);
    expect(markdown).toContain("# Master Lab Final Gate: decoy");
    expect(markdown).toContain("decoy_vs_black");
  }, MASTER_LAB_FINAL_GATE_TEST_TIMEOUT_MS);
});
