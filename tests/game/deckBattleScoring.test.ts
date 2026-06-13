import { describe, expect, it } from "vitest";
import { getDeckBenchmarkSuite } from "../../src/game/deckBenchmarkSuites";
import {
  buildDeckBattlePairings,
  scoreDeckBattleResults,
  type DeckBattleGameResult,
} from "../../src/game/deckBattleScoring";

describe("deck battle scoring", () => {
  it("builds deterministic round-robin pairings with both seat orders", () => {
    const deckIds = getDeckBenchmarkSuite("smoke").deckPresetIds.slice(0, 3);
    const pairings = buildDeckBattlePairings(deckIds, 500, 2);

    expect(pairings).toHaveLength(12);
    expect(pairings).toContainEqual({
      seed: 500,
      playerDeckPreset: deckIds[0],
      cpuDeckPreset: deckIds[1],
    });
    expect(pairings).toContainEqual({
      seed: 500,
      playerDeckPreset: deckIds[1],
      cpuDeckPreset: deckIds[0],
    });
    expect(pairings.at(-1)).toEqual({
      seed: 501,
      playerDeckPreset: deckIds[2],
      cpuDeckPreset: deckIds[1],
    });
  });

  it("keeps win, stability, speed, and issue metrics separate", () => {
    const deckIds = getDeckBenchmarkSuite("smoke").deckPresetIds.slice(0, 2);
    const [winnerDeck, loserDeck] = deckIds;
    const games: DeckBattleGameResult[] = [
      {
        seed: 500,
        playerDeckPreset: winnerDeck,
        cpuDeckPreset: loserDeck,
        winner: "player",
        winnerDeckPreset: winnerDeck,
        steps: 80,
        turns: 8,
        failures: 0,
        warnings: 0,
        issues: [],
      },
      {
        seed: 500,
        playerDeckPreset: loserDeck,
        cpuDeckPreset: winnerDeck,
        winner: "cpu",
        winnerDeckPreset: winnerDeck,
        steps: 100,
        turns: 10,
        failures: 0,
        warnings: 0,
        issues: [],
      },
      {
        seed: 501,
        playerDeckPreset: winnerDeck,
        cpuDeckPreset: loserDeck,
        steps: 320,
        turns: 82,
        failures: 0,
        warnings: 1,
        issues: [
          {
            severity: "warning",
            kind: "long_game",
            message: "long game",
            step: 320,
            turnNumber: 82,
          },
        ],
      },
    ];

    const scores = scoreDeckBattleResults(deckIds, games);
    const winnerScore = scores.find((score) => score.deckPreset === winnerDeck);
    const loserScore = scores.find((score) => score.deckPreset === loserDeck);

    expect(scores[0].deckPreset).toBe(winnerDeck);
    expect(winnerScore).toMatchObject({
      games: 3,
      wins: 2,
      losses: 0,
      draws: 1,
      winRate: 0.667,
      winPointRate: 0.833,
      warningRate: 0.333,
      failures: 0,
      warnings: 1,
      playerSideGames: 2,
      cpuSideGames: 1,
    });
    expect(winnerScore?.stabilityScore).toBeLessThan(100);
    expect(winnerScore?.speedScore).toBeTypeOf("number");
    expect(winnerScore?.battleScore).toBeGreaterThan(loserScore?.battleScore ?? 100);
  });
});
