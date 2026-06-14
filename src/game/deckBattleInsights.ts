import type {
  DeckBattleGameResult,
  DeckBattleMatchupKey,
  DeckBattleMatchupStats,
  DeckBattleScoreEntry,
  DeckBattleScoringReport,
} from "./deckBattleScoring";
import type { DeckSubmissionPresetId } from "./deckPresets";

export type DeckBattleInsightCategoryId =
  | "top_overall"
  | "fast_winners"
  | "slow_winners"
  | "stable_underperformers"
  | "seat_skew"
  | "practical_mismatch";

export type DeckBattleProblemKind = "issue" | "long_game" | "upset" | "top_deck_loss";
export type DeckBattleProblemFocusId =
  | "issue_safety"
  | "long_game_closeout"
  | "white_closeout"
  | "white_vs_black"
  | "black_pressure"
  | "upset_review"
  | "top_deck_regression"
  | "seat_bias";

export interface DeckBattleInsightsOptions {
  limit?: number;
  longGameStepMargin?: number;
  upsetBattleScoreGap?: number;
  topDeckRankLimit?: number;
}

export interface DeckBattleDeckInsight {
  deckPreset: DeckSubmissionPresetId;
  sourceDeckId: number;
  name: string;
  group: DeckBattleScoreEntry["group"];
  masterId: DeckBattleScoreEntry["masterId"];
  rank: number;
  battleScore: number;
  winRate: number;
  winPointRate: number;
  stabilityScore: number;
  speedScore: number;
  practicalScore: number;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  averageSteps: number;
  averageTurns: number;
  seatDelta: number;
  matchups: Record<DeckBattleMatchupKey, DeckBattleMatchupStats>;
  reason: string;
}

export interface DeckBattleInsightCategory {
  id: DeckBattleInsightCategoryId;
  title: string;
  description: string;
  decks: DeckBattleDeckInsight[];
}

export interface DeckBattleProblemGame {
  kind: DeckBattleProblemKind;
  severity: "failure" | "warning" | "review";
  seed: number;
  playerDeckPreset: DeckSubmissionPresetId;
  cpuDeckPreset: DeckSubmissionPresetId;
  winnerDeckPreset?: DeckSubmissionPresetId;
  loserDeckPreset?: DeckSubmissionPresetId;
  steps: number;
  turns: number;
  winnerRank?: number;
  loserRank?: number;
  battleScoreGap?: number;
  primaryFocus?: DeckBattleProblemFocusId;
  focusIds?: readonly DeckBattleProblemFocusId[];
  focusLabels?: readonly string[];
  reason: string;
}

export interface DeckBattleProblemFocusExample {
  kind: DeckBattleProblemKind;
  seed: number;
  playerDeckPreset: DeckSubmissionPresetId;
  cpuDeckPreset: DeckSubmissionPresetId;
  reason: string;
}

export interface DeckBattleProblemFocusSummary {
  id: DeckBattleProblemFocusId;
  title: string;
  description: string;
  count: number;
  reviewWeight: number;
  examples: DeckBattleProblemFocusExample[];
}

export interface DeckBattleInsightsReport {
  source: {
    suiteId: DeckBattleScoringReport["options"]["suiteId"];
    seedStart: number;
    count: number;
    decks: number;
    games: number;
    failures: number;
    warnings: number;
    averageSteps: number;
    averageTurns: number;
  };
  categories: DeckBattleInsightCategory[];
  problemGames: DeckBattleProblemGame[];
  problemFocuses: DeckBattleProblemFocusSummary[];
  recommendedFocus: string[];
}

const DEFAULT_OPTIONS: Required<DeckBattleInsightsOptions> = {
  limit: 8,
  longGameStepMargin: 45,
  upsetBattleScoreGap: 18,
  topDeckRankLimit: 8,
};

const PROBLEM_FOCUS_DEFS = {
  issue_safety: {
    title: "安全性",
    description: "failure/warningを含む。進行不能、長期戦警告、例外をまず潰す。",
  },
  long_game_closeout: {
    title: "長期戦/勝ち切り",
    description: "平均より長い試合。終盤の直接打点、focus、非撃破行動を確認する。",
  },
  white_closeout: {
    title: "白の勝ち切り",
    description: "白デッキが安定するが勝ち切れない。守りすぎと終盤打点を確認する。",
  },
  white_vs_black: {
    title: "白vs黒対策",
    description: "白が黒の圧に負ける構図。防御対象、前衛処理、石テンポを確認する。",
  },
  black_pressure: {
    title: "黒の攻め筋",
    description: "黒が白に押し返される構図。バーサク後の直撃、非撃破削り、石消費を確認する。",
  },
  upset_review: {
    title: "番狂わせ",
    description: "実戦スコア差のある敗戦。上位デッキ側の分岐判断を追う。",
  },
  top_deck_regression: {
    title: "上位デッキ敗戦",
    description: "主力検証デッキの敗戦。AI変更時の回帰チェック候補にする。",
  },
  seat_bias: {
    title: "席差/非対称",
    description: "player/cpu席の成績差が大きい。初手、先後、評価の非対称性を見る。",
  },
} as const satisfies Record<DeckBattleProblemFocusId, { title: string; description: string }>;

export function analyzeDeckBattleReport(
  report: DeckBattleScoringReport,
  options: DeckBattleInsightsOptions = {},
): DeckBattleInsightsReport {
  const resolved = { ...DEFAULT_OPTIONS, ...options };
  const rankByDeck = buildRankByDeck(report.decks);
  const scoreByDeck = new Map(report.decks.map((deck) => [deck.deckPreset, deck]));

  const categories: DeckBattleInsightCategory[] = [
    {
      id: "top_overall",
      title: "主力検証",
      description: "Battle score上位。AI変更後の最小勝率ゲートに使う。",
      decks: report.decks
        .slice(0, resolved.limit)
        .map((deck) => toDeckInsight(deck, rankByDeck, "総合実戦スコアが高い")),
    },
    {
      id: "fast_winners",
      title: "高速決着",
      description: "勝率が一定以上でSpeedが高い。黒速攻、リーサル、直撃判断の確認に使う。",
      decks: report.decks
        .filter((deck) => deck.winRate >= 0.5)
        .sort((a, b) => b.speedScore - a.speedScore || b.winRate - a.winRate)
        .slice(0, resolved.limit)
        .map((deck) => toDeckInsight(deck, rankByDeck, "勝率を保ちながら決着が速い")),
    },
    {
      id: "slow_winners",
      title: "遅い勝者",
      description: "勝てているが決着が遅い。白マスター長期戦や勝ち切り判断の確認に使う。",
      decks: report.decks
        .filter((deck) => deck.winRate >= 0.55)
        .sort((a, b) => a.speedScore - b.speedScore || b.averageSteps - a.averageSteps)
        .slice(0, resolved.limit)
        .map((deck) => toDeckInsight(deck, rankByDeck, "勝率は高いがSpeedが低い")),
    },
    {
      id: "stable_underperformers",
      title: "安定するが勝てない",
      description: "Stabilityは高いがWin rateが低い。攻め不足、守りすぎ、勝ち筋不足の確認に使う。",
      decks: report.decks
        .filter((deck) => deck.stabilityScore >= 90 && deck.winRate <= 0.4)
        .sort((a, b) => b.stabilityScore - a.stabilityScore || a.winRate - b.winRate)
        .slice(0, resolved.limit)
        .map((deck) => toDeckInsight(deck, rankByDeck, "安定度は高いが勝率が低い")),
    },
    {
      id: "seat_skew",
      title: "先後/席差",
      description: "player席とcpu席で勝点率差が大きい。初手、先攻後攻、評価の非対称性を確認する。",
      decks: report.decks
        .filter((deck) => seatDelta(deck) >= 0.2)
        .sort((a, b) => seatDelta(b) - seatDelta(a) || b.battleScore - a.battleScore)
        .slice(0, resolved.limit)
        .map((deck) => toDeckInsight(deck, rankByDeck, "player/cpu席の勝点率差が大きい")),
    },
    {
      id: "practical_mismatch",
      title: "静的評価とのズレ",
      description: "カード構成上は高評価だが実戦スコアが伸びない。AIが扱えていない構成を探す。",
      decks: report.decks
        .filter((deck) => deck.practicalScore >= 100 && deck.winRate <= 0.45)
        .sort((a, b) => b.practicalScore - a.practicalScore || a.winRate - b.winRate)
        .slice(0, resolved.limit)
        .map((deck) => toDeckInsight(deck, rankByDeck, "静的評価に比べて実戦勝率が低い")),
    },
  ];

  const problemGames = buildProblemGames(report.games, scoreByDeck, rankByDeck, report.summary.averageSteps, resolved);
  const problemFocuses = buildProblemFocuses(problemGames, resolved.limit);
  return {
    source: {
      suiteId: report.options.suiteId,
      seedStart: report.options.seedStart,
      count: report.options.count,
      decks: report.summary.decks,
      games: report.summary.games,
      failures: report.summary.failures,
      warnings: report.summary.warnings,
      averageSteps: report.summary.averageSteps,
      averageTurns: report.summary.averageTurns,
    },
    categories,
    problemGames,
    problemFocuses,
    recommendedFocus: buildRecommendedFocus(categories, problemGames, problemFocuses),
  };
}

export function formatDeckBattleInsightsMarkdown(report: DeckBattleInsightsReport): string {
  return [
    `# AI Lab: デッキ実戦分析`,
    ``,
    `## Summary`,
    ``,
    `| 項目 | 値 |`,
    `| --- | ---: |`,
    `| Suite | ${report.source.suiteId} |`,
    `| Decks | ${report.source.decks} |`,
    `| Games | ${report.source.games} |`,
    `| Issues | ${report.source.failures}/${report.source.warnings} |`,
    `| Average | ${report.source.averageSteps} steps / ${report.source.averageTurns} turns |`,
    ``,
    `## Recommended Focus`,
    ``,
    ...report.recommendedFocus.map((item) => `- ${item}`),
    ``,
    `## Problem Focus`,
    ``,
    `| Focus | Count | Weight | Description | Examples |`,
    `| --- | ---: | ---: | --- | --- |`,
    ...report.problemFocuses.map((focus) =>
      `| ${focus.title} | ${focus.count} | ${focus.reviewWeight} | ${focus.description} | ` +
      `${focus.examples.map((example) => `${example.kind} seed ${example.seed}`).join("<br>")} |`,
    ),
    ``,
    ...report.categories.flatMap((category) => [
      `## ${category.title}`,
      ``,
      category.description,
      ``,
      `| Rank | Deck | Battle | Win | Stable | Speed | BvB | WvW | WvB | Seat delta | Avg | Reason |`,
      `| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |`,
      ...category.decks.map((deck) =>
        `| ${deck.rank} | ${deck.deckPreset} | ${deck.battleScore} | ${formatPercent(deck.winRate)} | ` +
        `${deck.stabilityScore} | ${deck.speedScore} | ${formatMatchupWinRate(deck.matchups.black_vs_black)} | ` +
        `${formatMatchupWinRate(deck.matchups.white_vs_white)} | ${formatMatchupWinRate(deck.matchups.white_vs_black)} | ` +
        `${formatPercent(deck.seatDelta)} | ` +
        `${deck.averageSteps} steps / ${deck.averageTurns} turns | ${deck.reason} |`,
      ),
      ``,
    ]),
    `## Problem Games`,
    ``,
    `| Kind | Focus | Seed | Player | CPU | Winner | Steps | Turns | Gap | Reason |`,
    `| --- | --- | ---: | --- | --- | --- | ---: | ---: | ---: | --- |`,
    ...report.problemGames.map((game) =>
      `| ${game.kind} | ${(game.focusLabels ?? []).join("<br>") || "-"} | ${game.seed} | ${game.playerDeckPreset} | ${game.cpuDeckPreset} | ` +
      `${game.winnerDeckPreset ?? "-"} | ${game.steps} | ${game.turns} | ` +
      `${game.battleScoreGap?.toFixed(1) ?? "-"} | ${game.reason} |`,
    ),
    ``,
  ].join("\n");
}

function buildProblemGames(
  games: readonly DeckBattleGameResult[],
  scoreByDeck: Map<DeckSubmissionPresetId, DeckBattleScoreEntry>,
  rankByDeck: Map<DeckSubmissionPresetId, number>,
  averageSteps: number,
  options: Required<DeckBattleInsightsOptions>,
): DeckBattleProblemGame[] {
  const problemGames: DeckBattleProblemGame[] = [];
  const longGameThreshold = averageSteps + options.longGameStepMargin;

  for (const game of games) {
    const winnerDeck = game.winnerDeckPreset;
    const loserDeck = winnerDeck ? losingDeck(game, winnerDeck) : undefined;
    const winnerScore = winnerDeck ? scoreByDeck.get(winnerDeck) : undefined;
    const loserScore = loserDeck ? scoreByDeck.get(loserDeck) : undefined;
    const battleScoreGap =
      winnerScore && loserScore ? round(loserScore.battleScore - winnerScore.battleScore, 1) : undefined;

    if (game.failures > 0 || game.warnings > 0) {
      problemGames.push(createProblemGame({
        kind: "issue",
        severity: game.failures > 0 ? "failure" : "warning",
        game,
        winnerDeck,
        loserDeck,
        winnerScore,
        loserScore,
        rankByDeck,
        battleScoreGap,
        reason: `issue ${game.failures}/${game.warnings}`,
      }));
    }
    if (game.steps >= longGameThreshold) {
      problemGames.push(createProblemGame({
        kind: "long_game",
        severity: "review",
        game,
        winnerDeck,
        loserDeck,
        winnerScore,
        loserScore,
        rankByDeck,
        battleScoreGap,
        reason: `${game.steps} steps is above suite average + ${options.longGameStepMargin}`,
      }));
    }
    if (battleScoreGap !== undefined && battleScoreGap >= options.upsetBattleScoreGap) {
      problemGames.push(createProblemGame({
        kind: "upset",
        severity: "review",
        game,
        winnerDeck,
        loserDeck,
        winnerScore,
        loserScore,
        rankByDeck,
        battleScoreGap,
        reason: `lower-score deck beat higher-score deck by ${battleScoreGap}`,
      }));
    }
    if (
      loserDeck &&
      (rankByDeck.get(loserDeck) ?? Number.POSITIVE_INFINITY) <= options.topDeckRankLimit &&
      (rankByDeck.get(winnerDeck ?? loserDeck) ?? 0) > options.topDeckRankLimit
    ) {
      problemGames.push(createProblemGame({
        kind: "top_deck_loss",
        severity: "review",
        game,
        winnerDeck,
        loserDeck,
        winnerScore,
        loserScore,
        rankByDeck,
        battleScoreGap,
        reason: `top ${options.topDeckRankLimit} deck lost to lower ranked deck`,
      }));
    }
  }

  return selectRepresentativeProblemGames(uniqueProblemGames(problemGames), options.limit * 3);
}

function buildRecommendedFocus(
  categories: readonly DeckBattleInsightCategory[],
  problemGames: readonly DeckBattleProblemGame[],
  problemFocuses: readonly DeckBattleProblemFocusSummary[],
): string[] {
  const slowWinner = categories.find((category) => category.id === "slow_winners")?.decks[0];
  const seatSkew = categories.find((category) => category.id === "seat_skew")?.decks[0];
  const stableLow = categories.find((category) => category.id === "stable_underperformers")?.decks[0];
  const upset = problemGames.find((game) => game.kind === "upset" || game.kind === "top_deck_loss");
  const topFocus = problemFocuses[0];
  return [
    topFocus ? `${topFocus.title}: ${topFocus.count}件。${topFocus.description}` : undefined,
    slowWinner ? `${slowWinner.deckPreset}: 勝てるが遅い。終盤の勝ち切りと白/黒の過剰安全行動を見る。` : undefined,
    seatSkew ? `${seatSkew.deckPreset}: 席差${formatPercent(seatSkew.seatDelta)}。先後・player/cpu非対称を確認する。` : undefined,
    stableLow ? `${stableLow.deckPreset}: 安定するが勝てない。攻め筋不足や守りすぎを確認する。` : undefined,
    upset ? `${upset.playerDeckPreset} vs ${upset.cpuDeckPreset}: 番狂わせ。負けた上位デッキ側の判断を追う。` : undefined,
  ].filter((item): item is string => !!item);
}

function toDeckInsight(
  deck: DeckBattleScoreEntry,
  rankByDeck: Map<DeckSubmissionPresetId, number>,
  reason: string,
): DeckBattleDeckInsight {
  return {
    deckPreset: deck.deckPreset,
    sourceDeckId: deck.sourceDeckId,
    name: deck.name,
    group: deck.group,
    masterId: deck.masterId,
    rank: rankByDeck.get(deck.deckPreset) ?? 0,
    battleScore: deck.battleScore,
    winRate: deck.winRate,
    winPointRate: deck.winPointRate,
    stabilityScore: deck.stabilityScore,
    speedScore: deck.speedScore,
    practicalScore: deck.practicalScore,
    games: deck.games,
    wins: deck.wins,
    losses: deck.losses,
    draws: deck.draws,
    averageSteps: deck.averageSteps,
    averageTurns: deck.averageTurns,
    seatDelta: round(seatDelta(deck), 3),
    matchups: normalizeMatchups(deck.matchups),
    reason,
  };
}

function toProblemGameBase(
  game: DeckBattleGameResult,
  winnerDeckPreset: DeckSubmissionPresetId | undefined,
  loserDeckPreset: DeckSubmissionPresetId | undefined,
  rankByDeck: Map<DeckSubmissionPresetId, number>,
) {
  return {
    seed: game.seed,
    playerDeckPreset: game.playerDeckPreset,
    cpuDeckPreset: game.cpuDeckPreset,
    winnerDeckPreset,
    loserDeckPreset,
    steps: game.steps,
    turns: game.turns,
    winnerRank: winnerDeckPreset ? rankByDeck.get(winnerDeckPreset) : undefined,
    loserRank: loserDeckPreset ? rankByDeck.get(loserDeckPreset) : undefined,
  };
}

function createProblemGame({
  kind,
  severity,
  game,
  winnerDeck,
  loserDeck,
  winnerScore,
  loserScore,
  rankByDeck,
  battleScoreGap,
  reason,
}: {
  kind: DeckBattleProblemKind;
  severity: DeckBattleProblemGame["severity"];
  game: DeckBattleGameResult;
  winnerDeck: DeckSubmissionPresetId | undefined;
  loserDeck: DeckSubmissionPresetId | undefined;
  winnerScore: DeckBattleScoreEntry | undefined;
  loserScore: DeckBattleScoreEntry | undefined;
  rankByDeck: Map<DeckSubmissionPresetId, number>;
  battleScoreGap: number | undefined;
  reason: string;
}): DeckBattleProblemGame {
  const focusIds = classifyProblemFocusIds(kind, game, winnerScore, loserScore);
  return {
    kind,
    severity,
    ...toProblemGameBase(game, winnerDeck, loserDeck, rankByDeck),
    battleScoreGap,
    primaryFocus: focusIds[0],
    focusIds,
    focusLabels: focusIds.map(deckBattleProblemFocusLabel),
    reason,
  };
}

function classifyProblemFocusIds(
  kind: DeckBattleProblemKind,
  game: DeckBattleGameResult,
  winnerScore: DeckBattleScoreEntry | undefined,
  loserScore: DeckBattleScoreEntry | undefined,
): DeckBattleProblemFocusId[] {
  const focusIds = new Set<DeckBattleProblemFocusId>();
  if (kind === "issue") {
    focusIds.add("issue_safety");
  }
  if (kind === "long_game" || game.issues.some((issue) => issue.kind === "long_game")) {
    focusIds.add("long_game_closeout");
  }
  if (kind === "upset") {
    focusIds.add("upset_review");
  }
  if (kind === "top_deck_loss") {
    focusIds.add("top_deck_regression");
  }
  if (loserScore?.masterId === "white" && winnerScore?.masterId === "black") {
    focusIds.add("white_vs_black");
  }
  if (loserScore?.masterId === "white" && loserScore.winRate <= 0.45) {
    focusIds.add("white_closeout");
  }
  if (loserScore?.masterId === "black" && winnerScore?.masterId === "white") {
    focusIds.add("black_pressure");
  }
  if (loserScore && seatDelta(loserScore) >= 0.2) {
    focusIds.add("seat_bias");
  }
  if (focusIds.size === 0) {
    focusIds.add(game.steps >= 140 ? "long_game_closeout" : "upset_review");
  }
  return [...focusIds];
}

function buildProblemFocuses(
  problemGames: readonly DeckBattleProblemGame[],
  limit: number,
): DeckBattleProblemFocusSummary[] {
  const focusMap = new Map<DeckBattleProblemFocusId, DeckBattleProblemFocusSummary>();
  for (const problem of problemGames) {
    for (const focusId of problem.focusIds ?? []) {
      const focus = focusMap.get(focusId) ?? {
        id: focusId,
        title: deckBattleProblemFocusLabel(focusId),
        description: PROBLEM_FOCUS_DEFS[focusId].description,
        count: 0,
        reviewWeight: 0,
        examples: [],
      };
      focus.count += 1;
      focus.reviewWeight = round(focus.reviewWeight + problemSeverityScore(problem), 1);
      if (focus.examples.length < 3) {
        focus.examples.push({
          kind: problem.kind,
          seed: problem.seed,
          playerDeckPreset: problem.playerDeckPreset,
          cpuDeckPreset: problem.cpuDeckPreset,
          reason: problem.reason,
        });
      }
      focusMap.set(focusId, focus);
    }
  }
  return [...focusMap.values()]
    .sort((a, b) => b.reviewWeight - a.reviewWeight || b.count - a.count)
    .slice(0, limit);
}

export function deckBattleProblemFocusLabel(focusId: DeckBattleProblemFocusId): string {
  return PROBLEM_FOCUS_DEFS[focusId].title;
}

function buildRankByDeck(decks: readonly DeckBattleScoreEntry[]): Map<DeckSubmissionPresetId, number> {
  return new Map(decks.map((deck, index) => [deck.deckPreset, index + 1]));
}

function losingDeck(
  game: DeckBattleGameResult,
  winnerDeckPreset: DeckSubmissionPresetId,
): DeckSubmissionPresetId | undefined {
  if (game.playerDeckPreset === winnerDeckPreset) {
    return game.cpuDeckPreset;
  }
  if (game.cpuDeckPreset === winnerDeckPreset) {
    return game.playerDeckPreset;
  }
  return undefined;
}

function uniqueProblemGames(games: readonly DeckBattleProblemGame[]): DeckBattleProblemGame[] {
  const seen = new Set<string>();
  return games.filter((game) => {
    const key = [
      game.kind,
      game.seed,
      game.playerDeckPreset,
      game.cpuDeckPreset,
      game.steps,
      game.turns,
    ].join("|");
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function selectRepresentativeProblemGames(games: readonly DeckBattleProblemGame[], limit: number): DeckBattleProblemGame[] {
  const sorted = [...games].sort((a, b) => problemSeverityScore(b) - problemSeverityScore(a) || b.steps - a.steps);
  const selected: DeckBattleProblemGame[] = [];
  const selectedKeys = new Set<string>();
  const add = (game: DeckBattleProblemGame) => {
    const key = problemGameSelectionKey(game);
    if (selectedKeys.has(key) || selected.length >= limit) {
      return;
    }
    selectedKeys.add(key);
    selected.push(game);
  };

  for (const kind of ["issue", "top_deck_loss", "upset", "long_game"] as const) {
    for (const game of sorted.filter((candidate) => candidate.kind === kind).slice(0, 3)) {
      add(game);
    }
  }
  for (const focusId of Object.keys(PROBLEM_FOCUS_DEFS) as DeckBattleProblemFocusId[]) {
    const game = sorted.find((candidate) => candidate.focusIds?.includes(focusId));
    if (game) {
      add(game);
    }
  }
  for (const game of sorted) {
    add(game);
  }

  return selected.sort((a, b) => problemSeverityScore(b) - problemSeverityScore(a) || b.steps - a.steps);
}

function problemGameSelectionKey(game: DeckBattleProblemGame): string {
  return [
    game.kind,
    game.seed,
    game.playerDeckPreset,
    game.cpuDeckPreset,
    game.steps,
    game.turns,
  ].join("|");
}

function problemSeverityScore(game: DeckBattleProblemGame): number {
  const kindScore =
    game.kind === "issue" ? 400 : game.kind === "top_deck_loss" ? 300 : game.kind === "upset" ? 200 : 100;
  return kindScore + (game.battleScoreGap ?? 0);
}

function seatDelta(deck: DeckBattleScoreEntry): number {
  return Math.abs(deck.playerSideWinPointRate - deck.cpuSideWinPointRate);
}

function round(value: number, digits = 0): number {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

function formatMatchupWinRate(matchup: DeckBattleMatchupStats): string {
  return matchup.games > 0 ? `${formatPercent(matchup.winRate)} (${matchup.games})` : "-";
}

function normalizeMatchups(
  matchups: DeckBattleScoreEntry["matchups"] | undefined,
): Record<DeckBattleMatchupKey, DeckBattleMatchupStats> {
  return {
    black_vs_black: matchups?.black_vs_black ?? emptyMatchupStats(),
    white_vs_white: matchups?.white_vs_white ?? emptyMatchupStats(),
    white_vs_black: matchups?.white_vs_black ?? emptyMatchupStats(),
  };
}

function emptyMatchupStats(): DeckBattleMatchupStats {
  return {
    games: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winRate: 0,
    winPointRate: 0,
    averageSteps: 0,
    averageTurns: 0,
  };
}
