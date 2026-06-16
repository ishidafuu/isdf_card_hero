import { describe, expect, it } from "vitest";
import {
  formatMasterLabAutoPlaySummary,
  validateMasterLabAutoPlay,
} from "../../src/game/masterLabAutoPlay";

const MASTER_LAB_AUTO_PLAY_TEST_TIMEOUT_MS = 30_000;

describe("master lab auto play", () => {
  it("runs a decoy master lab participant against black without touching core MasterId", () => {
    const result = validateMasterLabAutoPlay({
      seedStart: 930,
      count: 1,
      participants: { player: "decoy", cpu: "black" },
      maxSteps: 700,
      maxTurns: 160,
      includeGameHistory: true,
    });

    expect(result.ok).toBe(true);
    expect(result.options.participants).toEqual({ player: "decoy", cpu: "black" });
    expect(result.games).toHaveLength(1);
    expect(result.games[0].stateSummary?.players.player.baseMasterId).toBe("white");
    expect(result.summary.failures).toBe(0);
    expect(result.games[0].labActionTargetUsage).toBeDefined();
    expect(result.summary.labActionTargetUsage).toBeDefined();

    const summary = formatMasterLabAutoPlaySummary(result);
    expect(summary).toContain("Master Lab auto play: PASS");
    expect(summary).toContain("Participants: player decoy, cpu black");
    expect(summary).toContain("Master Lab target usage:");
  }, MASTER_LAB_AUTO_PLAY_TEST_TIMEOUT_MS);

  it("keeps normal master matchups available in the lab runner", () => {
    const result = validateMasterLabAutoPlay({
      seedStart: 931,
      count: 1,
      participants: { player: "white", cpu: "black" },
      maxSteps: 700,
      maxTurns: 160,
    });

    expect(result.ok).toBe(true);
    expect(result.summary.labDecisionCount).toBe(0);
    expect(result.summary.magicCardUsage).toBeDefined();
  }, MASTER_LAB_AUTO_PLAY_TEST_TIMEOUT_MS);

  it("can record virtual magic opportunities for lab participants", () => {
    const result = validateMasterLabAutoPlay({
      seedStart: 930,
      count: 1,
      deckPreset: "black-pressure",
      participants: { player: "decoy", cpu: "black" },
      labActionMargin: 12,
      labEvaluationTuning: { targetOwnerBias: { enemy: 16 } },
      magicOpportunity: {
        cardIds: ["card_120"],
        minScoreDelta: -1000,
        maxRecordsPerGame: 5,
      },
      maxSteps: 700,
      maxTurns: 160,
    });

    expect(result.ok).toBe(true);
    expect(result.summary.magicOpportunityCount).toBeGreaterThanOrEqual(0);
    expect(result.summary.magicOpportunityUsage).toBeDefined();
    expect(result.games[0].magicOpportunityRecords.length).toBeLessThanOrEqual(5);

    const summary = formatMasterLabAutoPlaySummary(result);
    expect(summary).toContain("Magic opportunities:");
    expect(summary).toContain("Magic card usage:");
  }, MASTER_LAB_AUTO_PLAY_TEST_TIMEOUT_MS);
});
