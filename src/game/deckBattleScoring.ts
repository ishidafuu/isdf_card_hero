import { getDeckBenchmarkSuite, type DeckBenchmarkSuiteId } from "./deckBenchmarkSuites";
import { analyzeDeckSubmissions, type DeckTemplateAudit } from "./deckTemplateAnalysis";
import {
  buildDeckPresetCardIds,
  deckPresetAllowsSpecial,
  getDeckPreset,
  type DeckSubmissionPresetId,
} from "./deckPresets";
import { createInitialGame, runAutoStep } from "./rules";
import type { CpuAiProfile } from "./cpuAi";
import type { GameState, MasterId, PlayerId } from "./types";

export type DeckBattleMatchupKey = "black_vs_black" | "white_vs_white" | "white_vs_black";
export type DeckBattleFirstPlayerMode = "player" | "cpu" | "alternate" | "both";

export interface DeckBattleMatchupStats {
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  winPointRate: number;
  averageSteps: number;
  averageTurns: number;
}

export interface DeckBattleScoringOptions {
  suiteId?: DeckBenchmarkSuiteId;
  seedStart?: number;
  count?: number;
  maxDecks?: number;
  maxSteps?: number;
  maxTurns?: number;
  longGameSteps?: number;
  longGameTurns?: number;
  stagnationLimit?: number;
  aiProfile?: CpuAiProfile;
  firstPlayerMode?: DeckBattleFirstPlayerMode;
}

export interface ResolvedDeckBattleScoringOptions {
  suiteId: DeckBenchmarkSuiteId;
  seedStart: number;
  count: number;
  maxDecks?: number;
  maxSteps: number;
  maxTurns: number;
  longGameSteps: number;
  longGameTurns: number;
  stagnationLimit: number;
  aiProfile: CpuAiProfile;
  firstPlayerMode: DeckBattleFirstPlayerMode;
}

export interface DeckBattlePairing {
  seed: number;
  playerDeckPreset: DeckSubmissionPresetId;
  cpuDeckPreset: DeckSubmissionPresetId;
  firstPlayer?: PlayerId;
}

export interface DeckBattleGameResult extends DeckBattlePairing {
  winner?: PlayerId;
  winnerDeckPreset?: DeckSubmissionPresetId;
  steps: number;
  turns: number;
  failures: number;
  warnings: number;
  issues: DeckBattleIssue[];
}

export interface DeckBattleIssue {
  severity: "failure" | "warning";
  kind: "exception" | "stagnation" | "step_limit" | "turn_limit" | "long_game";
  message: string;
  step: number;
  turnNumber: number;
}

export interface DeckBattleScoreEntry {
  deckPreset: DeckSubmissionPresetId;
  sourceDeckId: number;
  name: string;
  group: DeckTemplateAudit["group"];
  masterId: DeckTemplateAudit["masterId"];
  practicalScore: number;
  battleScore: number;
  winRate: number;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winPointRate: number;
  drawRate: number;
  playerSideWins: number;
  playerSideGames: number;
  playerSideWinPointRate: number;
  cpuSideWins: number;
  cpuSideGames: number;
  cpuSideWinPointRate: number;
  sideBalanceScore: number;
  firstPlayerWins: number;
  firstPlayerGames: number;
  firstPlayerWinPointRate: number;
  secondPlayerWins: number;
  secondPlayerGames: number;
  secondPlayerWinPointRate: number;
  firstPlayerBalanceScore: number;
  stabilityScore: number;
  speedScore: number;
  warningRate: number;
  failureRate: number;
  failures: number;
  warnings: number;
  averageSteps: number;
  averageTurns: number;
  opponents: number;
  matchups: Record<DeckBattleMatchupKey, DeckBattleMatchupStats>;
}

export interface DeckBattleScoringReport {
  options: ResolvedDeckBattleScoringOptions;
  summary: {
    decks: number;
    games: number;
    failures: number;
    warnings: number;
    maxSteps: number;
    maxTurns: number;
    averageSteps: number;
    averageTurns: number;
  };
  decks: DeckBattleScoreEntry[];
  games: DeckBattleGameResult[];
}

interface MutableDeckBattleRecord {
  audit: DeckTemplateAudit;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  playerSideWins: number;
  playerSideGames: number;
  playerSideDraws: number;
  cpuSideWins: number;
  cpuSideGames: number;
  cpuSideDraws: number;
  firstPlayerWins: number;
  firstPlayerGames: number;
  firstPlayerDraws: number;
  secondPlayerWins: number;
  secondPlayerGames: number;
  secondPlayerDraws: number;
  failures: number;
  warnings: number;
  totalSteps: number;
  totalTurns: number;
  opponents: Set<DeckSubmissionPresetId>;
  matchups: Record<DeckBattleMatchupKey, MutableDeckBattleMatchupRecord>;
}

interface MutableDeckBattleMatchupRecord {
  games: number;
  wins: number;
  losses: number;
  draws: number;
  totalSteps: number;
  totalTurns: number;
}

const DEFAULT_OPTIONS: ResolvedDeckBattleScoringOptions = {
  suiteId: "smoke",
  seedStart: 500,
  count: 1,
  maxSteps: 700,
  maxTurns: 160,
  longGameSteps: 300,
  longGameTurns: 80,
  stagnationLimit: 8,
  aiProfile: "strong",
  firstPlayerMode: "player",
};

export function runDeckBattleScoring(options: DeckBattleScoringOptions = {}): DeckBattleScoringReport {
  const resolved = resolveDeckBattleScoringOptions(options);
  const auditsById = new Map(analyzeDeckSubmissions().map((audit) => [audit.id, audit]));
  const suite = getDeckBenchmarkSuite(resolved.suiteId);
  const deckPresetIds = suite.deckPresetIds.slice(0, resolved.maxDecks ?? suite.deckPresetIds.length);
  const pairings = buildDeckBattlePairings(deckPresetIds, resolved.seedStart, resolved.count, resolved.firstPlayerMode);
  const games = pairings.map((pairing) => runDeckBattleGame(pairing, resolved));
  const decks = scoreDeckBattleResults(deckPresetIds, games, auditsById);

  return {
    options: resolved,
    summary: {
      decks: deckPresetIds.length,
      games: games.length,
      failures: games.reduce((total, game) => total + game.failures, 0),
      warnings: games.reduce((total, game) => total + game.warnings, 0),
      maxSteps: Math.max(0, ...games.map((game) => game.steps)),
      maxTurns: Math.max(0, ...games.map((game) => game.turns)),
      averageSteps: round(average(games.map((game) => game.steps)), 1),
      averageTurns: round(average(games.map((game) => game.turns)), 1),
    },
    decks,
    games,
  };
}

export function buildDeckBattlePairings(
  deckPresetIds: readonly DeckSubmissionPresetId[],
  seedStart: number,
  count: number,
  firstPlayerMode: DeckBattleFirstPlayerMode = "player",
): DeckBattlePairing[] {
  const pairings: DeckBattlePairing[] = [];
  for (let leftIndex = 0; leftIndex < deckPresetIds.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < deckPresetIds.length; rightIndex += 1) {
      for (let seedOffset = 0; seedOffset < count; seedOffset += 1) {
        const seed = seedStart + seedOffset;
        const left = deckPresetIds[leftIndex];
        const right = deckPresetIds[rightIndex];
        for (const firstPlayer of firstPlayersForPairing(firstPlayerMode, seedOffset)) {
          pairings.push(createDeckBattlePairing(seed, left, right, firstPlayerMode, firstPlayer));
          pairings.push(createDeckBattlePairing(seed, right, left, firstPlayerMode, firstPlayer));
        }
      }
    }
  }
  return pairings;
}

function firstPlayersForPairing(mode: DeckBattleFirstPlayerMode, seedOffset: number): PlayerId[] {
  if (mode === "both") {
    return ["player", "cpu"];
  }
  if (mode === "alternate") {
    return [seedOffset % 2 === 0 ? "player" : "cpu"];
  }
  return [mode];
}

function createDeckBattlePairing(
  seed: number,
  playerDeckPreset: DeckSubmissionPresetId,
  cpuDeckPreset: DeckSubmissionPresetId,
  mode: DeckBattleFirstPlayerMode,
  firstPlayer: PlayerId,
): DeckBattlePairing {
  const base = { seed, playerDeckPreset, cpuDeckPreset };
  return mode === "player" ? base : { ...base, firstPlayer };
}

export function scoreDeckBattleResults(
  deckPresetIds: readonly DeckSubmissionPresetId[],
  games: readonly DeckBattleGameResult[],
  auditsById = new Map(analyzeDeckSubmissions().map((audit) => [audit.id, audit])),
): DeckBattleScoreEntry[] {
  const records = new Map<DeckSubmissionPresetId, MutableDeckBattleRecord>();
  for (const deckPresetId of deckPresetIds) {
    const audit = auditsById.get(deckPresetId);
    if (!audit) {
      throw new Error(`Unknown deck audit: ${deckPresetId}`);
    }
    records.set(deckPresetId, {
      audit,
      games: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      playerSideWins: 0,
      playerSideGames: 0,
      playerSideDraws: 0,
      cpuSideWins: 0,
      cpuSideGames: 0,
      cpuSideDraws: 0,
      firstPlayerWins: 0,
      firstPlayerGames: 0,
      firstPlayerDraws: 0,
      secondPlayerWins: 0,
      secondPlayerGames: 0,
      secondPlayerDraws: 0,
      failures: 0,
      warnings: 0,
      totalSteps: 0,
      totalTurns: 0,
      opponents: new Set(),
      matchups: createMutableMatchupRecords(),
    });
  }

  for (const game of games) {
    const player = records.get(game.playerDeckPreset);
    const cpu = records.get(game.cpuDeckPreset);
    if (!player || !cpu) {
      continue;
    }
    const matchupKey = deckBattleMatchupKey(player.audit.masterId, cpu.audit.masterId);
    applySharedGameStats(player, game, game.cpuDeckPreset, "player");
    applySharedGameStats(cpu, game, game.playerDeckPreset, "cpu");
    applyMatchupGameStats(player, game.playerDeckPreset, game, matchupKey);
    applyMatchupGameStats(cpu, game.cpuDeckPreset, game, matchupKey);

    if (!game.winnerDeckPreset) {
      player.draws += 1;
      cpu.draws += 1;
      player.playerSideDraws += 1;
      cpu.cpuSideDraws += 1;
      applyFirstPlayerDraw(player, game, "player");
      applyFirstPlayerDraw(cpu, game, "cpu");
    } else if (game.winnerDeckPreset === game.playerDeckPreset) {
      player.wins += 1;
      player.playerSideWins += 1;
      applyFirstPlayerWin(player, game, "player");
      cpu.losses += 1;
    } else {
      cpu.wins += 1;
      cpu.cpuSideWins += 1;
      applyFirstPlayerWin(cpu, game, "cpu");
      player.losses += 1;
    }
  }

  const suiteAverageSteps = average(games.map((game) => game.steps));
  return [...records.entries()]
    .map(([deckPreset, record]) => toScoreEntry(deckPreset, record, suiteAverageSteps))
    .sort((a, b) => b.battleScore - a.battleScore || b.winPointRate - a.winPointRate || b.practicalScore - a.practicalScore);
}

export function formatDeckBattleScoringReport(report: DeckBattleScoringReport, limit = 20): string {
  const lines = [
    `Deck battle scoring: ${report.summary.failures === 0 ? "PASS" : "FAIL"}`,
    `Suite: ${report.options.suiteId} (${report.summary.decks} decks)`,
    `Seeds: ${report.options.seedStart}-${report.options.seedStart + report.options.count - 1} (${report.options.count})`,
    `AI profile: ${report.options.aiProfile}`,
    `First player: ${report.options.firstPlayerMode}`,
    `Games: ${report.summary.games}`,
    `Issues: ${report.summary.failures} failures, ${report.summary.warnings} warnings`,
    `Average: ${report.summary.averageSteps} steps / ${report.summary.averageTurns} turns`,
    `Max: ${report.summary.maxSteps} steps / ${report.summary.maxTurns} turns`,
    "",
    `Top ${Math.min(limit, report.decks.length)}:`,
  ];

  for (const [index, deck] of report.decks.slice(0, limit).entries()) {
    lines.push(
      `${index + 1}. ${deck.deckPreset} battle ${deck.battleScore} ` +
        `win-point ${formatPercent(deck.winPointRate)} win ${formatPercent(deck.winRate)} ` +
        `stable ${deck.stabilityScore} speed ${deck.speedScore} (${deck.wins}-${deck.losses}-${deck.draws}) ` +
        `avg ${deck.averageSteps} steps / ${deck.averageTurns} turns ` +
        `base ${deck.practicalScore}`,
    );
  }

  return lines.join("\n");
}

export function formatDeckBattleScoringMarkdown(report: DeckBattleScoringReport): string {
  return [
    `# 投稿デッキ実戦スコア`,
    ``,
    `## Summary`,
    ``,
    `| 項目 | 値 |`,
    `| --- | ---: |`,
    `| Suite | ${report.options.suiteId} |`,
    `| Decks | ${report.summary.decks} |`,
    `| Games | ${report.summary.games} |`,
    `| Failures | ${report.summary.failures} |`,
    `| Warnings | ${report.summary.warnings} |`,
    `| Average steps | ${report.summary.averageSteps} |`,
    `| Average turns | ${report.summary.averageTurns} |`,
    `| Max steps | ${report.summary.maxSteps} |`,
    `| Max turns | ${report.summary.maxTurns} |`,
    ``,
    `## Score Metrics`,
    ``,
    `- Battle score: 並べ替え用の総合点。勝点率を主軸に、速度・警告・失敗を軽く補正する。`,
    `- Win point: 勝ち=1、引き分け=0.5で見た実戦成績。`,
    `- Win rate: 純粋な勝率。引き分けは勝ちに含めない。`,
    `- Stability: 警告/失敗の少なさと、player/cpu席で成績が崩れないかを見る安定度。`,
    `- Seat WPR: player席/cpu席の勝点率。UI操作側とCPU側の非対称性を見る。`,
    `- First WPR: 先攻/後攻の勝点率。先後差が大きいデッキを分けて見る。`,
    `- Speed: 同一suite内の平均stepsと比べた決着速度。50がsuite平均。`,
    `- Matchups: 黒vs黒、白vs白、白vs黒に分けた勝率。相性差の確認に使う。`,
    ``,
    `## Deck Scores`,
    ``,
    `| Rank | Deck | Battle | Win point | Win rate | Stability | Speed | BvB | WvW | WvB | W-L-D | Seat WPR P/C | First WPR F/S | Avg steps | Avg turns | Base | Issues |`,
    `| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |`,
    ...report.decks.map((deck, index) =>
      `| ${index + 1} | ${deck.deckPreset} | ${deck.battleScore} | ${formatPercent(deck.winPointRate)} | ` +
      `${formatPercent(deck.winRate)} | ${deck.stabilityScore} | ${deck.speedScore} | ` +
      `${formatMatchupWinRate(deck.matchups.black_vs_black)} | ${formatMatchupWinRate(deck.matchups.white_vs_white)} | ` +
      `${formatMatchupWinRate(deck.matchups.white_vs_black)} | ` +
      `${deck.wins}-${deck.losses}-${deck.draws} | ${formatPercent(deck.playerSideWinPointRate)}/${formatPercent(deck.cpuSideWinPointRate)} | ` +
      `${formatPercent(deck.firstPlayerWinPointRate)}/${formatPercent(deck.secondPlayerWinPointRate)} | ` +
      `${deck.averageSteps} | ${deck.averageTurns} | ${deck.practicalScore} | ${deck.failures}/${deck.warnings} |`,
    ),
    ``,
  ].join("\n");
}

function resolveDeckBattleScoringOptions(options: DeckBattleScoringOptions): ResolvedDeckBattleScoringOptions {
  return {
    suiteId: options.suiteId ?? DEFAULT_OPTIONS.suiteId,
    seedStart: integerOption(options.seedStart, DEFAULT_OPTIONS.seedStart),
    count: integerOption(options.count, DEFAULT_OPTIONS.count),
    maxDecks: options.maxDecks,
    maxSteps: integerOption(options.maxSteps, DEFAULT_OPTIONS.maxSteps),
    maxTurns: integerOption(options.maxTurns, DEFAULT_OPTIONS.maxTurns),
    longGameSteps: integerOption(options.longGameSteps, DEFAULT_OPTIONS.longGameSteps),
    longGameTurns: integerOption(options.longGameTurns, DEFAULT_OPTIONS.longGameTurns),
    stagnationLimit: integerOption(options.stagnationLimit, DEFAULT_OPTIONS.stagnationLimit),
    aiProfile: options.aiProfile ?? DEFAULT_OPTIONS.aiProfile,
    firstPlayerMode: options.firstPlayerMode ?? DEFAULT_OPTIONS.firstPlayerMode,
  };
}

function runDeckBattleGame(pairing: DeckBattlePairing, options: ResolvedDeckBattleScoringOptions): DeckBattleGameResult {
  const issues: DeckBattleIssue[] = [];
  let game = createDeckBattleInitialGame(pairing);
  let repeatedSignatureCount = 0;
  let previousSignature = progressSignature(game);
  let step = 0;

  try {
    for (; step < options.maxSteps && !game.winner; step += 1) {
      if (game.turnNumber > options.maxTurns) {
        issues.push({
          severity: "failure",
          kind: "turn_limit",
          message: `turn ${game.turnNumber} exceeded limit ${options.maxTurns}`,
          step,
          turnNumber: game.turnNumber,
        });
        break;
      }

      game = runAutoStep(game, { profile: options.aiProfile });
      if (game.pendingLevelUp) {
        game = runAutoStep(game, { profile: options.aiProfile });
      }

      const nextSignature = progressSignature(game);
      repeatedSignatureCount = nextSignature === previousSignature ? repeatedSignatureCount + 1 : 0;
      previousSignature = nextSignature;
      if (repeatedSignatureCount >= options.stagnationLimit) {
        issues.push({
          severity: "failure",
          kind: "stagnation",
          message: `same progress signature repeated ${repeatedSignatureCount} times`,
          step,
          turnNumber: game.turnNumber,
        });
        break;
      }
    }
  } catch (error) {
    issues.push({
      severity: "failure",
      kind: "exception",
      message: error instanceof Error ? error.message : String(error),
      step,
      turnNumber: game.turnNumber,
    });
  }

  if (!game.winner && !issues.some((issue) => issue.severity === "failure")) {
    issues.push({
      severity: "failure",
      kind: "step_limit",
      message: `winner was not decided within ${options.maxSteps} auto steps`,
      step,
      turnNumber: game.turnNumber,
    });
  }
  if (game.winner && (step >= options.longGameSteps || game.turnNumber >= options.longGameTurns)) {
    issues.push({
      severity: "warning",
      kind: "long_game",
      message: `long game finished after ${step} steps / ${game.turnNumber} turns`,
      step,
      turnNumber: game.turnNumber,
    });
  }

  const winnerDeckPreset =
    game.winner === "player" ? pairing.playerDeckPreset : game.winner === "cpu" ? pairing.cpuDeckPreset : undefined;
  return {
    ...pairing,
    firstPlayer: pairing.firstPlayer ?? "player",
    winner: game.winner,
    winnerDeckPreset,
    steps: step,
    turns: game.turnNumber,
    failures: issues.filter((issue) => issue.severity === "failure").length,
    warnings: issues.filter((issue) => issue.severity === "warning").length,
    issues,
  };
}

function createDeckBattleInitialGame(pairing: DeckBattlePairing): GameState {
  const playerPreset = getDeckPreset(pairing.playerDeckPreset);
  const cpuPreset = getDeckPreset(pairing.cpuDeckPreset);
  return createInitialGame(pairing.seed, {
    masterIds: {
      player: playerPreset.masterId ?? "white",
      cpu: cpuPreset.masterId ?? "white",
    },
    playerDeckCardIds: buildDeckPresetCardIds(pairing.playerDeckPreset),
    cpuDeckCardIds: buildDeckPresetCardIds(pairing.cpuDeckPreset),
    firstPlayer: pairing.firstPlayer ?? "player",
    allowSpecialDecks: {
      player: deckPresetAllowsSpecial(pairing.playerDeckPreset),
      cpu: deckPresetAllowsSpecial(pairing.cpuDeckPreset),
    },
  });
}

function applySharedGameStats(
  record: MutableDeckBattleRecord,
  game: DeckBattleGameResult,
  opponent: DeckSubmissionPresetId,
  side: PlayerId,
): void {
  record.games += 1;
  if (side === "player") {
    record.playerSideGames += 1;
  } else {
    record.cpuSideGames += 1;
  }
  if ((game.firstPlayer ?? "player") === side) {
    record.firstPlayerGames += 1;
  } else {
    record.secondPlayerGames += 1;
  }
  record.failures += game.failures;
  record.warnings += game.warnings;
  record.totalSteps += game.steps;
  record.totalTurns += game.turns;
  record.opponents.add(opponent);
}

function applyFirstPlayerWin(record: MutableDeckBattleRecord, game: DeckBattleGameResult, side: PlayerId): void {
  if ((game.firstPlayer ?? "player") === side) {
    record.firstPlayerWins += 1;
  } else {
    record.secondPlayerWins += 1;
  }
}

function applyFirstPlayerDraw(record: MutableDeckBattleRecord, game: DeckBattleGameResult, side: PlayerId): void {
  if ((game.firstPlayer ?? "player") === side) {
    record.firstPlayerDraws += 1;
  } else {
    record.secondPlayerDraws += 1;
  }
}

function applyMatchupGameStats(
  record: MutableDeckBattleRecord,
  deckPreset: DeckSubmissionPresetId,
  game: DeckBattleGameResult,
  matchupKey: DeckBattleMatchupKey,
): void {
  const matchup = record.matchups[matchupKey];
  matchup.games += 1;
  matchup.totalSteps += game.steps;
  matchup.totalTurns += game.turns;
  if (!game.winnerDeckPreset) {
    matchup.draws += 1;
  } else if (game.winnerDeckPreset === deckPreset) {
    matchup.wins += 1;
  } else {
    matchup.losses += 1;
  }
}

function toScoreEntry(
  deckPreset: DeckSubmissionPresetId,
  record: MutableDeckBattleRecord,
  suiteAverageSteps: number,
): DeckBattleScoreEntry {
  const winRate = record.games > 0 ? record.wins / record.games : 0;
  const winPointRate = record.games > 0 ? (record.wins + record.draws * 0.5) / record.games : 0;
  const drawRate = record.games > 0 ? record.draws / record.games : 0;
  const averageSteps = record.games > 0 ? record.totalSteps / record.games : 0;
  const averageTurns = record.games > 0 ? record.totalTurns / record.games : 0;
  const warningRate = record.games > 0 ? record.warnings / record.games : 0;
  const failureRate = record.games > 0 ? record.failures / record.games : 0;
  const playerSideWinPointRate =
    record.playerSideGames > 0 ? (record.playerSideWins + record.playerSideDraws * 0.5) / record.playerSideGames : 0;
  const cpuSideWinPointRate =
    record.cpuSideGames > 0 ? (record.cpuSideWins + record.cpuSideDraws * 0.5) / record.cpuSideGames : 0;
  const firstPlayerWinPointRate =
    record.firstPlayerGames > 0 ? (record.firstPlayerWins + record.firstPlayerDraws * 0.5) / record.firstPlayerGames : 0;
  const secondPlayerWinPointRate =
    record.secondPlayerGames > 0 ? (record.secondPlayerWins + record.secondPlayerDraws * 0.5) / record.secondPlayerGames : 0;
  const sideBalanceScore = clamp(100 - Math.abs(playerSideWinPointRate - cpuSideWinPointRate) * 100, 0, 100);
  const firstPlayerBalanceScore = clamp(100 - Math.abs(firstPlayerWinPointRate - secondPlayerWinPointRate) * 100, 0, 100);
  const issueScore = clamp(100 - warningRate * 25 - failureRate * 85, 0, 100);
  const stabilityScore = issueScore * 0.65 + sideBalanceScore * 0.2 + firstPlayerBalanceScore * 0.15;
  const speedScore =
    suiteAverageSteps > 0 ? clamp(50 + ((suiteAverageSteps - averageSteps) / suiteAverageSteps) * 50, 0, 100) : 0;
  const tempoBonus = clamp((suiteAverageSteps - averageSteps) / 20, -5, 5);
  const battleScore = clamp(round(winPointRate * 100 + tempoBonus - warningRate * 10 - failureRate * 30, 1), 0, 100);
  return {
    deckPreset,
    sourceDeckId: record.audit.sourceDeckId,
    name: record.audit.name,
    group: record.audit.group,
    masterId: record.audit.masterId,
    practicalScore: record.audit.practicalScore,
    battleScore,
    winRate: round(winRate, 3),
    games: record.games,
    wins: record.wins,
    losses: record.losses,
    draws: record.draws,
    winPointRate: round(winPointRate, 3),
    drawRate: round(drawRate, 3),
    playerSideWins: record.playerSideWins,
    playerSideGames: record.playerSideGames,
    playerSideWinPointRate: round(playerSideWinPointRate, 3),
    cpuSideWins: record.cpuSideWins,
    cpuSideGames: record.cpuSideGames,
    cpuSideWinPointRate: round(cpuSideWinPointRate, 3),
    sideBalanceScore: round(sideBalanceScore, 1),
    firstPlayerWins: record.firstPlayerWins,
    firstPlayerGames: record.firstPlayerGames,
    firstPlayerWinPointRate: round(firstPlayerWinPointRate, 3),
    secondPlayerWins: record.secondPlayerWins,
    secondPlayerGames: record.secondPlayerGames,
    secondPlayerWinPointRate: round(secondPlayerWinPointRate, 3),
    firstPlayerBalanceScore: round(firstPlayerBalanceScore, 1),
    stabilityScore: round(stabilityScore, 1),
    speedScore: round(speedScore, 1),
    warningRate: round(warningRate, 3),
    failureRate: round(failureRate, 3),
    failures: record.failures,
    warnings: record.warnings,
    averageSteps: round(averageSteps, 1),
    averageTurns: round(averageTurns, 1),
    opponents: record.opponents.size,
    matchups: toMatchupStats(record.matchups),
  };
}

function createMutableMatchupRecords(): Record<DeckBattleMatchupKey, MutableDeckBattleMatchupRecord> {
  return {
    black_vs_black: createMutableMatchupRecord(),
    white_vs_white: createMutableMatchupRecord(),
    white_vs_black: createMutableMatchupRecord(),
  };
}

function createMutableMatchupRecord(): MutableDeckBattleMatchupRecord {
  return {
    games: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    totalSteps: 0,
    totalTurns: 0,
  };
}

function toMatchupStats(
  matchups: Record<DeckBattleMatchupKey, MutableDeckBattleMatchupRecord>,
): Record<DeckBattleMatchupKey, DeckBattleMatchupStats> {
  return {
    black_vs_black: toMatchupStat(matchups.black_vs_black),
    white_vs_white: toMatchupStat(matchups.white_vs_white),
    white_vs_black: toMatchupStat(matchups.white_vs_black),
  };
}

function toMatchupStat(record: MutableDeckBattleMatchupRecord): DeckBattleMatchupStats {
  return {
    games: record.games,
    wins: record.wins,
    losses: record.losses,
    draws: record.draws,
    winRate: record.games > 0 ? round(record.wins / record.games, 3) : 0,
    winPointRate: record.games > 0 ? round((record.wins + record.draws * 0.5) / record.games, 3) : 0,
    averageSteps: record.games > 0 ? round(record.totalSteps / record.games, 1) : 0,
    averageTurns: record.games > 0 ? round(record.totalTurns / record.games, 1) : 0,
  };
}

function deckBattleMatchupKey(left: MasterId, right: MasterId): DeckBattleMatchupKey {
  if (left === "black" && right === "black") {
    return "black_vs_black";
  }
  if (left === "white" && right === "white") {
    return "white_vs_white";
  }
  return "white_vs_black";
}

function progressSignature(game: GameState): string {
  return JSON.stringify({
    currentPlayer: game.currentPlayer,
    turnNumber: game.turnNumber,
    winner: game.winner,
    pendingLevelUp: game.pendingLevelUp,
    player: playerProgress(game, "player"),
    cpu: playerProgress(game, "cpu"),
    slots: Object.entries(game.slots).map(([slotKey, slot]) => [
      slotKey,
      slot.monster
        ? {
            id: slot.monster.instanceId,
            hp: slot.monster.hp,
            level: slot.monster.level,
            status: slot.monster.status,
            actionCount: slot.monster.actionCount,
            focused: slot.monster.focused,
            shielded: slot.monster.shielded,
          }
        : null,
    ]),
  });
}

function playerProgress(game: GameState, playerId: PlayerId) {
  const player = game.players[playerId];
  return {
    hp: player.masterHp,
    stones: player.stones,
    hand: player.hand.length,
    deck: player.deck.length,
    discard: player.discard.length,
  };
}

function integerOption(value: number | undefined, fallback: number): number {
  return Number.isInteger(value) && value !== undefined ? value : fallback;
}

function average(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function round(value: number, digits = 0): number {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function formatPercent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

function formatMatchupWinRate(matchup: DeckBattleMatchupStats): string {
  return matchup.games > 0 ? `${formatPercent(matchup.winRate)} (${matchup.games})` : "-";
}
