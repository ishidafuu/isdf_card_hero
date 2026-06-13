import type { DeckPresetId, DeckSubmissionPresetId } from "./deckPresets";

export type DeckBattleScoreSnapshotSuiteId = "smoke";

export interface DeckBattleScoreSnapshotSummary {
  suiteId: DeckBattleScoreSnapshotSuiteId;
  seedStart: number;
  count: number;
  aiProfile: "strong";
  decks: number;
  games: number;
  failures: number;
  warnings: number;
  averageSteps: number;
  averageTurns: number;
}

export interface DeckBattleScoreSnapshot {
  rank: number;
  deckPreset: DeckSubmissionPresetId;
  sourceDeckId: number;
  battleScore: number;
  practicalScore: number;
  winRate: number;
  winPointRate: number;
  stabilityScore: number;
  speedScore: number;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  playerSideWinPointRate: number;
  cpuSideWinPointRate: number;
  failures: number;
  warnings: number;
  averageSteps: number;
  averageTurns: number;
}

export const DECK_BATTLE_SCORE_SNAPSHOT_SUMMARY: DeckBattleScoreSnapshotSummary = {
  suiteId: "smoke",
  seedStart: 500,
  count: 1,
  aiProfile: "strong",
  decks: 8,
  games: 56,
  failures: 0,
  warnings: 0,
  averageSteps: 101.2,
  averageTurns: 9.8,
};

export const DECK_BATTLE_SCORE_SNAPSHOTS: DeckBattleScoreSnapshot[] = [
  {
    rank: 1,
    deckPreset: "submission-pro-no-rare8-black-493",
    sourceDeckId: 493,
    battleScore: 78.7,
    practicalScore: 101.8,
    winRate: 0.786,
    winPointRate: 0.786,
    stabilityScore: 95.7,
    speedScore: 51.5,
    games: 14,
    wins: 11,
    losses: 3,
    draws: 0,
    playerSideWinPointRate: 0.857,
    cpuSideWinPointRate: 0.714,
    failures: 0,
    warnings: 0,
    averageSteps: 98.2,
    averageTurns: 9.4,
  },
  {
    rank: 2,
    deckPreset: "submission-pro-with-rare8-white-1339",
    sourceDeckId: 1339,
    battleScore: 70.9,
    practicalScore: 103.2,
    winRate: 0.714,
    winPointRate: 0.714,
    stabilityScore: 91.4,
    speedScore: 44.3,
    games: 14,
    wins: 10,
    losses: 4,
    draws: 0,
    playerSideWinPointRate: 0.571,
    cpuSideWinPointRate: 0.857,
    failures: 0,
    warnings: 0,
    averageSteps: 112.7,
    averageTurns: 10.6,
  },
  {
    rank: 3,
    deckPreset: "submission-pro-no-rare8-black-252",
    sourceDeckId: 252,
    battleScore: 63.8,
    practicalScore: 100.4,
    winRate: 0.643,
    winPointRate: 0.643,
    stabilityScore: 87.1,
    speedScore: 45.6,
    games: 14,
    wins: 9,
    losses: 5,
    draws: 0,
    playerSideWinPointRate: 0.857,
    cpuSideWinPointRate: 0.429,
    failures: 0,
    warnings: 0,
    averageSteps: 110.1,
    averageTurns: 10.4,
  },
  {
    rank: 4,
    deckPreset: "submission-pro-with-rare8-black-1354",
    sourceDeckId: 1354,
    battleScore: 57.5,
    practicalScore: 105,
    winRate: 0.571,
    winPointRate: 0.571,
    stabilityScore: 91.4,
    speedScore: 54,
    games: 14,
    wins: 8,
    losses: 6,
    draws: 0,
    playerSideWinPointRate: 0.429,
    cpuSideWinPointRate: 0.714,
    failures: 0,
    warnings: 0,
    averageSteps: 93.1,
    averageTurns: 8.7,
  },
  {
    rank: 5,
    deckPreset: "submission-pro-with-rare8-white-1346",
    sourceDeckId: 1346,
    battleScore: 49.9,
    practicalScore: 101,
    winRate: 0.5,
    winPointRate: 0.5,
    stabilityScore: 95.7,
    speedScore: 48.7,
    games: 14,
    wins: 7,
    losses: 7,
    draws: 0,
    playerSideWinPointRate: 0.571,
    cpuSideWinPointRate: 0.429,
    failures: 0,
    warnings: 0,
    averageSteps: 103.9,
    averageTurns: 10.6,
  },
  {
    rank: 6,
    deckPreset: "submission-pro-with-rare8-black-999",
    sourceDeckId: 999,
    battleScore: 43.9,
    practicalScore: 104.5,
    winRate: 0.429,
    winPointRate: 0.429,
    stabilityScore: 91.4,
    speedScore: 60.2,
    games: 14,
    wins: 6,
    losses: 8,
    draws: 0,
    playerSideWinPointRate: 0.571,
    cpuSideWinPointRate: 0.286,
    failures: 0,
    warnings: 0,
    averageSteps: 80.6,
    averageTurns: 8.2,
  },
  {
    rank: 7,
    deckPreset: "submission-pro-no-rare8-white-494",
    sourceDeckId: 494,
    battleScore: 28.4,
    practicalScore: 99.1,
    winRate: 0.286,
    winPointRate: 0.286,
    stabilityScore: 100,
    speedScore: 48.1,
    games: 14,
    wins: 4,
    losses: 10,
    draws: 0,
    playerSideWinPointRate: 0.286,
    cpuSideWinPointRate: 0.286,
    failures: 0,
    warnings: 0,
    averageSteps: 105.1,
    averageTurns: 10.4,
  },
  {
    rank: 8,
    deckPreset: "submission-pro-no-rare8-white-1377",
    sourceDeckId: 1377,
    battleScore: 6.9,
    practicalScore: 99.9,
    winRate: 0.071,
    winPointRate: 0.071,
    stabilityScore: 95.7,
    speedScore: 47.7,
    games: 14,
    wins: 1,
    losses: 13,
    draws: 0,
    playerSideWinPointRate: 0.143,
    cpuSideWinPointRate: 0,
    failures: 0,
    warnings: 0,
    averageSteps: 105.9,
    averageTurns: 9.6,
  },
];

const DECK_BATTLE_SCORE_SNAPSHOT_BY_ID = new Map(
  DECK_BATTLE_SCORE_SNAPSHOTS.map((score) => [score.deckPreset, score]),
);

export function getDeckBattleScoreSnapshot(deckPreset: DeckPresetId): DeckBattleScoreSnapshot | undefined {
  return DECK_BATTLE_SCORE_SNAPSHOT_BY_ID.get(deckPreset as DeckSubmissionPresetId);
}
