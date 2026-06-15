import { describe, expect, it } from "vitest";
import {
  analyzeDeckBattleReport,
  formatDeckBattleInsightsMarkdown,
} from "../../src/game/deckBattleInsights";
import type { DeckBattleScoringReport } from "../../src/game/deckBattleScoring";

describe("deck battle insights", () => {
  it("classifies deck roles and extracts review games from battle reports", () => {
    const report = createReport();
    const insights = analyzeDeckBattleReport(report, { limit: 2, longGameStepMargin: 20, upsetBattleScoreGap: 15 });

    expect(insights.source).toMatchObject({ suiteId: "core", decks: 3, games: 3 });
    expect(insights.categories.find((category) => category.id === "top_overall")?.decks.map((deck) => deck.deckPreset)).toEqual([
      "submission-pro-no-rare8-black-493",
      "submission-pro-with-rare8-white-1339",
    ]);
    expect(insights.categories.find((category) => category.id === "slow_winners")?.decks[0]).toMatchObject({
      deckPreset: "submission-pro-with-rare8-white-1339",
      reason: "勝率は高いがSpeedが低い",
    });
    expect(insights.categories.find((category) => category.id === "stable_underperformers")?.decks[0]).toMatchObject({
      deckPreset: "submission-pro-no-rare8-white-494",
      reason: "安定度は高いが勝率が低い",
    });
    expect(insights.categories.find((category) => category.id === "first_player_skew")?.decks.length).toBeGreaterThan(0);
    expect(insights.problemGames.map((game) => game.kind)).toContain("upset");
    expect(insights.problemGames.map((game) => game.kind)).toContain("long_game");
    const problemFocusIds = insights.problemGames.flatMap((game) => game.focusIds ?? []);
    expect(problemFocusIds).toContain("upset_review");
    expect(problemFocusIds).toContain("long_game_closeout");
    expect(insights.problemGames.every((game) => (game.focusLabels?.length ?? 0) > 0)).toBe(true);
    expect(insights.problemFocuses.length).toBeGreaterThan(0);
    expect(insights.recommendedFocus.length).toBeGreaterThan(0);
  });

  it("formats insight reports for artifacts", () => {
    const markdown = formatDeckBattleInsightsMarkdown(analyzeDeckBattleReport(createReport(), { limit: 1 }));

    expect(markdown).toContain("# AI Lab: デッキ実戦分析");
    expect(markdown).toContain("## Recommended Focus");
    expect(markdown).toContain("## Problem Focus");
    expect(markdown).toContain("## Problem Games");
  });
});

function createReport(): DeckBattleScoringReport {
  return {
    options: {
      suiteId: "core",
      seedStart: 500,
      count: 1,
      maxSteps: 700,
      maxTurns: 160,
      longGameSteps: 300,
      longGameTurns: 80,
      stagnationLimit: 8,
      aiProfile: "strong",
      firstPlayerMode: "both",
    },
    summary: {
      decks: 3,
      games: 3,
      failures: 0,
      warnings: 0,
      maxSteps: 180,
      maxTurns: 16,
      averageSteps: 100,
      averageTurns: 9,
    },
    decks: [
      {
        deckPreset: "submission-pro-no-rare8-black-493",
        sourceDeckId: 493,
        name: "黒上位",
        group: "pro-no-rare8-black",
        masterId: "black",
        practicalScore: 101,
        battleScore: 82,
        winRate: 0.75,
        games: 4,
        wins: 3,
        losses: 1,
        draws: 0,
        winPointRate: 0.75,
        drawRate: 0,
        playerSideWins: 2,
        playerSideGames: 2,
        playerSideWinPointRate: 1,
        cpuSideWins: 1,
        cpuSideGames: 2,
        cpuSideWinPointRate: 0.5,
        sideBalanceScore: 50,
        firstPlayerWins: 2,
        firstPlayerGames: 2,
        firstPlayerWinPointRate: 1,
        secondPlayerWins: 1,
        secondPlayerGames: 2,
        secondPlayerWinPointRate: 0.5,
        firstPlayerBalanceScore: 50,
        stabilityScore: 85,
        speedScore: 58,
        warningRate: 0,
        failureRate: 0,
        failures: 0,
        warnings: 0,
        averageSteps: 84,
        averageTurns: 8,
        opponents: 2,
        matchups: createMatchups({ black_vs_black: { games: 2, wins: 1, losses: 1 }, white_vs_black: { games: 2, wins: 2 } }),
      },
      {
        deckPreset: "submission-pro-with-rare8-white-1339",
        sourceDeckId: 1339,
        name: "白長期",
        group: "pro-with-rare8-white",
        masterId: "white",
        practicalScore: 103,
        battleScore: 70,
        winRate: 0.65,
        games: 4,
        wins: 2,
        losses: 1,
        draws: 1,
        winPointRate: 0.625,
        drawRate: 0.25,
        playerSideWins: 1,
        playerSideGames: 2,
        playerSideWinPointRate: 0.5,
        cpuSideWins: 1,
        cpuSideGames: 2,
        cpuSideWinPointRate: 0.75,
        sideBalanceScore: 75,
        firstPlayerWins: 1,
        firstPlayerGames: 2,
        firstPlayerWinPointRate: 0.5,
        secondPlayerWins: 1,
        secondPlayerGames: 2,
        secondPlayerWinPointRate: 0.75,
        firstPlayerBalanceScore: 75,
        stabilityScore: 95,
        speedScore: 34,
        warningRate: 0,
        failureRate: 0,
        failures: 0,
        warnings: 0,
        averageSteps: 150,
        averageTurns: 13,
        opponents: 2,
        matchups: createMatchups({ white_vs_white: { games: 2, wins: 1, losses: 1 }, white_vs_black: { games: 2, wins: 1, draws: 1 } }),
      },
      {
        deckPreset: "submission-pro-no-rare8-white-494",
        sourceDeckId: 494,
        name: "白低勝率",
        group: "pro-no-rare8-white",
        masterId: "white",
        practicalScore: 100,
        battleScore: 30,
        winRate: 0.25,
        games: 4,
        wins: 1,
        losses: 3,
        draws: 0,
        winPointRate: 0.25,
        drawRate: 0,
        playerSideWins: 1,
        playerSideGames: 2,
        playerSideWinPointRate: 0.5,
        cpuSideWins: 0,
        cpuSideGames: 2,
        cpuSideWinPointRate: 0,
        sideBalanceScore: 50,
        firstPlayerWins: 0,
        firstPlayerGames: 2,
        firstPlayerWinPointRate: 0,
        secondPlayerWins: 1,
        secondPlayerGames: 2,
        secondPlayerWinPointRate: 0.5,
        firstPlayerBalanceScore: 50,
        stabilityScore: 98,
        speedScore: 47,
        warningRate: 0,
        failureRate: 0,
        failures: 0,
        warnings: 0,
        averageSteps: 106,
        averageTurns: 9,
        opponents: 2,
        matchups: createMatchups({ white_vs_white: { games: 2, wins: 1, losses: 1 }, white_vs_black: { games: 2, losses: 2 } }),
      },
    ],
    games: [
      {
        seed: 500,
        playerDeckPreset: "submission-pro-no-rare8-white-494",
        cpuDeckPreset: "submission-pro-no-rare8-black-493",
        firstPlayer: "player",
        winner: "player",
        winnerDeckPreset: "submission-pro-no-rare8-white-494",
        steps: 92,
        turns: 9,
        failures: 0,
        warnings: 0,
        issues: [],
      },
      {
        seed: 501,
        playerDeckPreset: "submission-pro-with-rare8-white-1339",
        cpuDeckPreset: "submission-pro-no-rare8-black-493",
        firstPlayer: "cpu",
        winner: "player",
        winnerDeckPreset: "submission-pro-with-rare8-white-1339",
        steps: 180,
        turns: 16,
        failures: 0,
        warnings: 0,
        issues: [],
      },
      {
        seed: 502,
        playerDeckPreset: "submission-pro-no-rare8-black-493",
        cpuDeckPreset: "submission-pro-no-rare8-white-494",
        firstPlayer: "player",
        winner: "player",
        winnerDeckPreset: "submission-pro-no-rare8-black-493",
        steps: 75,
        turns: 7,
        failures: 0,
        warnings: 0,
        issues: [],
      },
    ],
  };
}

function createMatchups(
  overrides: Partial<Record<"black_vs_black" | "white_vs_white" | "white_vs_black", Partial<{
    games: number;
    wins: number;
    losses: number;
    draws: number;
  }>>>,
) {
  return {
    black_vs_black: createMatchup(overrides.black_vs_black),
    white_vs_white: createMatchup(overrides.white_vs_white),
    white_vs_black: createMatchup(overrides.white_vs_black),
  };
}

function createMatchup(overrides: Partial<{ games: number; wins: number; losses: number; draws: number }> = {}) {
  const games = overrides.games ?? 0;
  const wins = overrides.wins ?? 0;
  const losses = overrides.losses ?? 0;
  const draws = overrides.draws ?? 0;
  return {
    games,
    wins,
    losses,
    draws,
    winRate: games > 0 ? Number((wins / games).toFixed(3)) : 0,
    winPointRate: games > 0 ? Number(((wins + draws * 0.5) / games).toFixed(3)) : 0,
    averageSteps: games > 0 ? 100 : 0,
    averageTurns: games > 0 ? 10 : 0,
  };
}
