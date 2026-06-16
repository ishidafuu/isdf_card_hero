import { getCardDef, getCardName } from "./cards";
import { getDeckPreset, type DeckPresetId } from "./deckPresets";
import { buildMasterLabFinalGateMatchups, type MasterLabFinalGateMatchup } from "./masterLabFinalGate";
import { validateMasterLabAutoPlay, type MasterLabAutoPlayOptions, type MasterLabAutoPlayResult, type MasterLabMagicOpportunityRecord } from "./masterLabAutoPlay";
import type { MasterLabCandidateId, MasterLabEvaluationTuning } from "./masterLab";

export interface MasterLabMagicOpportunityOptions extends Omit<MasterLabAutoPlayOptions, "participants" | "seedStart" | "count" | "seedEnd" | "deckPreset" | "magicOpportunity"> {
  candidateId?: MasterLabCandidateId;
  deckPreset?: DeckPresetId;
  gamesPerMatchup?: number;
  cardIds?: readonly string[];
  minScoreDelta?: number;
  maxRecordsPerGame?: number;
}

export interface MasterLabMagicOpportunityRun {
  matchup: MasterLabFinalGateMatchup;
  result: MasterLabAutoPlayResult;
}

export interface MasterLabMagicOpportunityCardStats {
  cardId: string;
  cardName: string;
  role: string;
  count: number;
  lethalCount: number;
  nonLethalCount: number;
  averageDelta: number;
  averageNonLethalDelta: number;
  bestDelta: number;
  recommendation: "main_candidate" | "finisher_candidate" | "tech_candidate" | "watch" | "low_signal";
}

export interface MasterLabMagicOpportunityReport {
  generatedAt: string;
  candidateId: MasterLabCandidateId;
  deckPreset: DeckPresetId;
  deckName: string;
  gamesPerMatchup: number;
  cardIds: readonly string[];
  minScoreDelta: number;
  runs: MasterLabMagicOpportunityRun[];
  totalGames: number;
  failures: number;
  warnings: number;
  totalOpportunities: number;
  cardStats: MasterLabMagicOpportunityCardStats[];
  topRecords: MasterLabMagicOpportunityRecord[];
}

export const DEFAULT_MASTER_LAB_MAGIC_OPPORTUNITY_CARDS = [
  "card_120",
  "card_130",
  "card_093",
  "card_029",
  "card_113",
  "card_030",
  "card_088",
  "card_117",
  "card_064",
  "thunder",
] as const;

const DEFAULT_CANDIDATE_ID = "decoy" satisfies MasterLabCandidateId;
const DEFAULT_DECK_PRESET = "black-pressure" satisfies DeckPresetId;
const DEFAULT_GAMES_PER_MATCHUP = 5;
const DEFAULT_MIN_SCORE_DELTA = 25;
const DEFAULT_MAX_RECORDS_PER_GAME = 30;
const DEFAULT_LAB_ACTION_MARGIN = 12;
const DEFAULT_LAB_EVALUATION_TUNING = {
  targetOwnerBias: { enemy: 16 },
} satisfies MasterLabEvaluationTuning;

export function runMasterLabMagicOpportunityReport(
  options: MasterLabMagicOpportunityOptions = {},
): MasterLabMagicOpportunityReport {
  const candidateId = options.candidateId ?? DEFAULT_CANDIDATE_ID;
  const deckPreset = options.deckPreset ?? DEFAULT_DECK_PRESET;
  const gamesPerMatchup = options.gamesPerMatchup ?? DEFAULT_GAMES_PER_MATCHUP;
  const cardIds = options.cardIds ?? DEFAULT_MASTER_LAB_MAGIC_OPPORTUNITY_CARDS;
  const minScoreDelta = options.minScoreDelta ?? DEFAULT_MIN_SCORE_DELTA;
  const maxRecordsPerGame = options.maxRecordsPerGame ?? DEFAULT_MAX_RECORDS_PER_GAME;

  const runs = buildMasterLabFinalGateMatchups(candidateId).map((matchup): MasterLabMagicOpportunityRun => {
    const result = validateMasterLabAutoPlay({
      ...options,
      deckPreset,
      participants: matchup.participants,
      seedStart: matchup.seedStart,
      count: gamesPerMatchup,
      labActionMargin: options.labActionMargin ?? DEFAULT_LAB_ACTION_MARGIN,
      labEvaluationTuning: options.labEvaluationTuning ?? DEFAULT_LAB_EVALUATION_TUNING,
      magicOpportunity: {
        cardIds,
        minScoreDelta,
        maxRecordsPerGame,
        candidateOnly: true,
      },
    });
    return { matchup: { ...matchup, recommendedGames: gamesPerMatchup }, result };
  });

  const totalGames = runs.reduce((total, run) => total + run.result.summary.games, 0);
  const failures = runs.reduce((total, run) => total + run.result.summary.failures, 0);
  const warnings = runs.reduce((total, run) => total + run.result.summary.warnings, 0);
  const totalOpportunities = runs.reduce((total, run) => total + run.result.summary.magicOpportunityCount, 0);
  const usage = mergeUsage(runs.map((run) => run.result.summary.magicOpportunityUsage));
  const lethalUsage = mergeUsage(runs.map((run) => run.result.summary.magicOpportunityLethalUsage));
  const deltaTotal = mergeUsage(runs.map((run) => run.result.summary.magicOpportunityDeltaTotal));
  const nonLethalDeltaTotal = mergeUsage(runs.map((run) => run.result.summary.magicOpportunityNonLethalDeltaTotal));
  const bestDelta = mergeMaxUsage(runs.map((run) => run.result.summary.magicOpportunityBestDelta));
  const topRecords = runs
    .flatMap((run) => run.result.games.flatMap((game) => game.magicOpportunityRecords))
    .sort((a, b) => b.scoreDelta - a.scoreDelta || b.opportunityScore - a.opportunityScore)
    .slice(0, 20);
  const deck = getDeckPreset(deckPreset);

  return {
    generatedAt: new Date().toISOString(),
    candidateId,
    deckPreset,
    deckName: deck.name,
    gamesPerMatchup,
    cardIds,
    minScoreDelta,
    runs,
    totalGames,
    failures,
    warnings,
    totalOpportunities,
    cardStats: buildCardStats(cardIds, usage, lethalUsage, deltaTotal, nonLethalDeltaTotal, bestDelta, totalGames),
    topRecords,
  };
}

export function formatMasterLabMagicOpportunityMarkdown(report: MasterLabMagicOpportunityReport): string {
  return [
    `# Master Lab Magic Opportunity: ${report.candidateId}`,
    "",
    `生成: ${report.generatedAt}`,
    `デッキ: \`${report.deckPreset}\`（${report.deckName}）`,
    `試行: ${report.gamesPerMatchup} games/matchup（5 matchups）`,
    `閾値: 実選択より +${report.minScoreDelta} 点以上`,
    "",
    "## Summary",
    "",
    `- ${report.totalGames}戦。failure ${report.failures}、warning ${report.warnings}。`,
    `- opportunity 総数は ${report.totalOpportunities} 件。これは「候補マジックを仮想手札に1枚足したら、実選択より評価が閾値以上伸びた」場面数。`,
    `- 主候補: ${formatRecommendedCards(report.cardStats, "main_candidate")}`,
    `- 勝ち切り候補: ${formatRecommendedCards(report.cardStats, "finisher_candidate")}`,
    `- 1枚差し候補: ${formatRecommendedCards(report.cardStats, "tech_candidate")}`,
    "",
    "## Card Ranking",
    "",
    "| Rank | Card | Role | Count | Lethal | Avg Delta | Non-Lethal Avg | Best Delta | Recommendation | Reading |",
    "| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |",
    ...report.cardStats.map((stats, index) => formatCardStatsRow(stats, index + 1, report.totalGames)),
    "",
    "## Matchups",
    "",
    "| Matchup | Result | Opportunities | Top Cards | Issues |",
    "| --- | --- | ---: | --- | --- |",
    ...report.runs.map(formatRunRow),
    "",
    "## Top Opportunity Records",
    "",
    "| Rank | Seed | Turn | Player | Card | Lethal | Delta | Target | Selected | Reason |",
    "| ---: | ---: | ---: | --- | --- | --- | ---: | --- | --- | --- |",
    ...report.topRecords.map((record, index) => formatRecordRow(record, index + 1)),
    "",
    "## Next Loop Proposal",
    "",
    ...formatNextLoopProposal(report),
    "",
    "## Reading",
    "",
    "- count が高いカードは、複数seedで実選択より良い可能性が出たカード。",
    "- lethal は、そのマジックで相手マスターを倒せる勝ち切り機会。汎用性とは分けて読む。",
    "- best delta だけが高いカードは、汎用枠ではなく1枚差しの奇襲/回答札として見る。",
    "- このレポートは勝率検証ではなく、次にデッキへ入れて試す候補を絞るための前段。",
  ].join("\n");
}

function buildCardStats(
  cardIds: readonly string[],
  usage: Record<string, number>,
  lethalUsage: Record<string, number>,
  deltaTotal: Record<string, number>,
  nonLethalDeltaTotal: Record<string, number>,
  bestDelta: Record<string, number>,
  totalGames: number,
): MasterLabMagicOpportunityCardStats[] {
  return cardIds
    .map((cardId) => {
      const count = usage[cardId] ?? 0;
      const lethalCount = lethalUsage[cardId] ?? 0;
      const nonLethalCount = Math.max(0, count - lethalCount);
      const averageDelta = count > 0 ? round1((deltaTotal[cardId] ?? 0) / count) : 0;
      const averageNonLethalDelta = nonLethalCount > 0 ? round1((nonLethalDeltaTotal[cardId] ?? 0) / nonLethalCount) : 0;
      const best = round1(bestDelta[cardId] ?? 0);
      return {
        cardId,
        cardName: getCardName(cardId),
        role: magicOpportunityRole(cardId),
        count,
        lethalCount,
        nonLethalCount,
        averageDelta,
        averageNonLethalDelta,
        bestDelta: best,
        recommendation: recommendCard(count, lethalCount, nonLethalCount, averageNonLethalDelta, best, totalGames),
      };
    })
    .sort((a, b) =>
      recommendationRank(a.recommendation) - recommendationRank(b.recommendation) ||
      b.count - a.count ||
      b.averageDelta - a.averageDelta ||
      b.bestDelta - a.bestDelta ||
      a.cardName.localeCompare(b.cardName),
    );
}

function recommendCard(
  count: number,
  lethalCount: number,
  nonLethalCount: number,
  averageNonLethalDelta: number,
  bestDelta: number,
  totalGames: number,
): MasterLabMagicOpportunityCardStats["recommendation"] {
  if (nonLethalCount >= Math.max(3, Math.ceil(totalGames * 0.12)) && averageNonLethalDelta >= 35) {
    return "main_candidate";
  }
  if (lethalCount >= 2) {
    return "finisher_candidate";
  }
  if (count >= 2 && (averageNonLethalDelta >= 30 || bestDelta >= 80)) {
    return "tech_candidate";
  }
  if (count > 0) {
    return "watch";
  }
  return "low_signal";
}

function recommendationRank(recommendation: MasterLabMagicOpportunityCardStats["recommendation"]): number {
  if (recommendation === "main_candidate") {
    return 0;
  }
  if (recommendation === "finisher_candidate") {
    return 1;
  }
  if (recommendation === "tech_candidate") {
    return 2;
  }
  if (recommendation === "watch") {
    return 3;
  }
  return 4;
}

function magicOpportunityRole(cardId: string): string {
  if (cardId === "card_120") {
    return "draw";
  }
  if (cardId === "card_130" || cardId === "healing") {
    return "recovery";
  }
  if (cardId === "card_093" || cardId === "card_117") {
    return "tempo";
  }
  if (cardId === "card_029" || cardId === "card_113" || cardId === "card_064") {
    return "interference";
  }
  if (cardId === "card_030" || cardId === "card_088") {
    return "shield";
  }
  const def = getCardDef(cardId);
  if (def.type === "magic" && def.targetKinds.includes("enemy_master")) {
    return "damage";
  }
  return "utility";
}

function formatRecommendedCards(
  stats: readonly MasterLabMagicOpportunityCardStats[],
  recommendation: MasterLabMagicOpportunityCardStats["recommendation"],
): string {
  const selected = stats
    .filter((item) => item.recommendation === recommendation)
    .slice(0, 4)
    .map((item) => `\`${item.cardName}\` (${item.count}件, lethal ${item.lethalCount}, non-lethal avg +${item.averageNonLethalDelta})`);
  return selected.length > 0 ? selected.join(" / ") : "なし";
}

function formatCardStatsRow(
  stats: MasterLabMagicOpportunityCardStats,
  rank: number,
  totalGames: number,
): string {
  return [
    rank,
    `\`${stats.cardName}\`<br>${stats.cardId}`,
    stats.role,
    stats.count,
    stats.lethalCount,
    stats.averageDelta,
    stats.averageNonLethalDelta,
    stats.bestDelta,
    stats.recommendation,
    escapeMarkdownTableCell(cardReading(stats, totalGames)),
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function cardReading(stats: MasterLabMagicOpportunityCardStats, totalGames: number): string {
  if (stats.recommendation === "main_candidate") {
    return `${totalGames}戦中${stats.nonLethalCount}件で非リーサル改善。まず1-2枚入れて勝率検証する。`;
  }
  if (stats.recommendation === "finisher_candidate") {
    return `${stats.lethalCount}件の勝ち切り機会。汎用枠ではなく詰め札として1枚から見る。`;
  }
  if (stats.recommendation === "tech_candidate") {
    return "頻度は限定的だが、最大値がある。1枚差し候補。";
  }
  if (stats.recommendation === "watch") {
    return "シグナルはあるが、専用枠にするにはまだ弱い。次回候補の控え。";
  }
  return "今回の条件では仮想手札に足しても刺さりにくい。";
}

function formatRunRow(run: MasterLabMagicOpportunityRun): string {
  const opportunities = run.result.summary.magicOpportunityCount;
  const topCards = Object.entries(run.result.summary.magicOpportunityUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cardId, count]) => `${getCardName(cardId)} ${count}`)
    .join("<br>");
  return [
    run.matchup.id,
    `P ${run.result.summary.winners.player} / C ${run.result.summary.winners.cpu} / U ${run.result.summary.undecided}`,
    opportunities,
    topCards || "-",
    `${run.result.summary.failures}F/${run.result.summary.warnings}W`,
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatRecordRow(record: MasterLabMagicOpportunityRecord, rank: number): string {
  return [
    rank,
    record.seed,
    record.turnNumber,
    record.player,
    `\`${getCardName(record.cardId)}\``,
    record.lethal ? "yes" : "no",
    record.scoreDelta,
    escapeMarkdownTableCell(record.targetKey),
    escapeMarkdownTableCell(record.selectedDecision),
    escapeMarkdownTableCell(record.opportunityReason),
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatNextLoopProposal(report: MasterLabMagicOpportunityReport): string[] {
  const main = report.cardStats.filter((stats) => stats.recommendation === "main_candidate").slice(0, 3);
  const finisher = report.cardStats.filter((stats) => stats.recommendation === "finisher_candidate").slice(0, 2);
  const tech = report.cardStats.filter((stats) => stats.recommendation === "tech_candidate").slice(0, 3);
  const candidates = [...main, ...finisher, ...tech].slice(0, 4);
  if (candidates.length === 0) {
    return [
      "- 提案: 今回の候補マジックには強いシグナルがない。候補範囲を広げるより、まずモンスター比率とAI評価の中母数確認を優先する。",
      "- 次回: `target_black_enemy16_margin12` の games-per-matchup 20-30 再現性確認。",
    ];
  }

  return [
    "- 提案: opportunity 上位カードだけをデッキへ実装して、小母数勝率で副作用を見る。",
    `- 次回候補: ${candidates.map((card) => `\`${card.cardName}\` ${card.count}件 lethal ${card.lethalCount} non-lethal avg +${card.averageNonLethalDelta}`).join(" / ")}`,
    "- 目安: 3-5デッキ案、games-per-matchup 10-20。warning と敵スケープゴート率を同時に見る。",
    "- 分岐: main_candidate が勝率を落とす場合、カード自体ではなくAIがその場面を過大評価している可能性を疑う。",
  ];
}

function mergeUsage(usages: Array<Record<string, number>>): Record<string, number> {
  const merged: Record<string, number> = {};
  for (const usage of usages) {
    for (const [key, value] of Object.entries(usage)) {
      merged[key] = (merged[key] ?? 0) + value;
    }
  }
  return merged;
}

function mergeMaxUsage(usages: Array<Record<string, number>>): Record<string, number> {
  const merged: Record<string, number> = {};
  for (const usage of usages) {
    for (const [key, value] of Object.entries(usage)) {
      merged[key] = Math.max(merged[key] ?? 0, value);
    }
  }
  return merged;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function escapeMarkdownTableCell(value: string): string {
  return value.replaceAll("|", "\\|");
}
