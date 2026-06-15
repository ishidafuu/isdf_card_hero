import { describe, expect, it } from "vitest";
import {
  buildMasterLabMatchups,
  formatMasterLabMarkdown,
  MASTER_LAB_CANDIDATES,
  resolvedMasterLabActionCost,
  validateMasterLabCandidates,
} from "../../src/game/masterLab";

describe("master lab", () => {
  it("keeps experimental master definitions statically valid", () => {
    expect(validateMasterLabCandidates()).toEqual([]);
  });

  it("defines the decoy master around provoke and scapegoat", () => {
    const decoy = MASTER_LAB_CANDIDATES.find((candidate) => candidate.id === "decoy");
    expect(decoy).toBeDefined();
    expect(decoy?.actions.map((action) => action.id)).toEqual(["master_attack", "provoke", "scapegoat"]);

    const provoke = decoy?.actions.find((action) => action.id === "provoke");
    const scapegoat = decoy?.actions.find((action) => action.id === "scapegoat");
    expect(provoke).toMatchObject({ kind: "magic_ref", cardId: "card_097" });
    expect(scapegoat).toMatchObject({ kind: "magic_ref", cardId: "card_128" });
    expect(provoke ? resolvedMasterLabActionCost(provoke) : undefined).toBe(3);
    expect(scapegoat ? resolvedMasterLabActionCost(scapegoat) : undefined).toBe(2);
  });

  it("builds a matchup matrix for every candidate against white and black", () => {
    const matchups = buildMasterLabMatchups();
    for (const candidate of MASTER_LAB_CANDIDATES) {
      const candidateMatchups = matchups.filter((matchup) => matchup.candidateId === candidate.id);
      expect(candidateMatchups).toHaveLength(5);
      expect(candidateMatchups.some((matchup) => matchup.opponentId === "white" && matchup.challengerSeat === "player")).toBe(true);
      expect(candidateMatchups.some((matchup) => matchup.opponentId === "white" && matchup.challengerSeat === "cpu")).toBe(true);
      expect(candidateMatchups.some((matchup) => matchup.opponentId === "black" && matchup.challengerSeat === "player")).toBe(true);
      expect(candidateMatchups.some((matchup) => matchup.opponentId === "black" && matchup.challengerSeat === "cpu")).toBe(true);
      expect(candidateMatchups.some((matchup) => matchup.opponentId === candidate.id)).toBe(true);
    }
  });

  it("formats the current roadmap and candidates as markdown", () => {
    const markdown = formatMasterLabMarkdown();
    expect(markdown).toContain("# Master Lab 現状");
    expect(markdown).toContain("デコイマスター");
    expect(markdown).toContain("挑発");
    expect(markdown).toContain("スケープゴート");
    expect(markdown).toContain("- PASS");
  });
});
