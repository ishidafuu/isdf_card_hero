import { describe, expect, it } from "vitest";
import {
  formatMasterLabMagicOpportunityMarkdown,
  runMasterLabMagicOpportunityReport,
} from "../../src/game/masterLabMagicOpportunity";

const MASTER_LAB_MAGIC_OPPORTUNITY_TEST_TIMEOUT_MS = 90_000;

describe("master lab magic opportunity", () => {
  it("runs a small virtual magic opportunity report", () => {
    const report = runMasterLabMagicOpportunityReport({
      candidateId: "decoy",
      deckPreset: "black-pressure",
      gamesPerMatchup: 1,
      cardIds: ["card_120", "card_029"],
      minScoreDelta: -1000,
      maxRecordsPerGame: 3,
      maxSteps: 700,
      maxTurns: 160,
    });

    expect(report.runs).toHaveLength(5);
    expect(report.totalGames).toBe(5);
    expect(report.cardStats.map((stats) => stats.cardId).sort()).toEqual(["card_029", "card_120"]);
    expect(report.topRecords.length).toBeLessThanOrEqual(15);

    const markdown = formatMasterLabMagicOpportunityMarkdown(report);
    expect(markdown).toContain("# Master Lab Magic Opportunity: decoy");
    expect(markdown).toContain("## Card Ranking");
    expect(markdown).toContain("ドロー５");
    expect(markdown).toContain("悪魔のダンス");
    expect(markdown).toContain("## Next Loop Proposal");
  }, MASTER_LAB_MAGIC_OPPORTUNITY_TEST_TIMEOUT_MS);
});
