import { getCardDef, getCardDefsByPool, getCardName } from "./cards";
import { getMagicAiTrait } from "./aiTraits";
import { getDeckPreset, type DeckPresetId } from "./deckPresets";
import { buildMasterLabFinalGateMatchups, type MasterLabFinalGateMatchup } from "./masterLabFinalGate";
import { validateMasterLabAutoPlay, type MasterLabAutoPlayOptions, type MasterLabAutoPlayResult, type MasterLabMagicOpportunityRecord } from "./masterLabAutoPlay";
import type { MasterLabCandidateId, MasterLabEvaluationTuning } from "./masterLab";

export type MasterLabMagicOpportunityCandidateSet = "default" | "implemented" | "non_finisher";
export type MasterLabMagicOpportunityResolvedCandidateSet = MasterLabMagicOpportunityCandidateSet | "custom";

export interface MasterLabMagicOpportunityOptions extends Omit<MasterLabAutoPlayOptions, "participants" | "seedStart" | "count" | "seedEnd" | "deckPreset" | "magicOpportunity"> {
  candidateId?: MasterLabCandidateId;
  deckPreset?: DeckPresetId;
  candidateSet?: MasterLabMagicOpportunityCandidateSet;
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

export interface MasterLabMagicOpportunityRoleStats {
  role: string;
  cardCount: number;
  count: number;
  lethalCount: number;
  nonLethalCount: number;
  averageNonLethalDelta: number;
  topCards: readonly MasterLabMagicOpportunityCardStats[];
}

export interface MasterLabMagicOpportunityReport {
  generatedAt: string;
  candidateId: MasterLabCandidateId;
  deckPreset: DeckPresetId;
  deckName: string;
  candidateSet: MasterLabMagicOpportunityResolvedCandidateSet;
  gamesPerMatchup: number;
  cardIds: readonly string[];
  minScoreDelta: number;
  runs: MasterLabMagicOpportunityRun[];
  totalGames: number;
  failures: number;
  warnings: number;
  totalOpportunities: number;
  cardStats: MasterLabMagicOpportunityCardStats[];
  roleStats: MasterLabMagicOpportunityRoleStats[];
  topRecords: MasterLabMagicOpportunityRecord[];
  topNonLethalRecords: MasterLabMagicOpportunityRecord[];
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

export function getMasterLabMagicOpportunityCardIds(
  candidateSet: MasterLabMagicOpportunityCandidateSet = "default",
): string[] {
  if (candidateSet === "default") {
    return [...DEFAULT_MASTER_LAB_MAGIC_OPPORTUNITY_CARDS];
  }

  const implemented = getCardDefsByPool("normal")
    .filter((def) => def.type === "magic" && def.implemented)
    .sort((a, b) => (a.sourceNo ?? Number.MAX_SAFE_INTEGER) - (b.sourceNo ?? Number.MAX_SAFE_INTEGER) || a.name.localeCompare(b.name))
    .map((def) => def.id);

  if (candidateSet === "non_finisher") {
    return implemented.filter((cardId) => !isDirectMasterFinisherCard(cardId));
  }
  return implemented;
}

export function runMasterLabMagicOpportunityReport(
  options: MasterLabMagicOpportunityOptions = {},
): MasterLabMagicOpportunityReport {
  const candidateId = options.candidateId ?? DEFAULT_CANDIDATE_ID;
  const deckPreset = options.deckPreset ?? DEFAULT_DECK_PRESET;
  const gamesPerMatchup = options.gamesPerMatchup ?? DEFAULT_GAMES_PER_MATCHUP;
  const requestedCandidateSet = options.candidateSet ?? "default";
  const candidateSet: MasterLabMagicOpportunityResolvedCandidateSet = options.cardIds ? "custom" : requestedCandidateSet;
  const cardIds = options.cardIds ?? getMasterLabMagicOpportunityCardIds(requestedCandidateSet);
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
  const allRecords = runs
    .flatMap((run) => run.result.games.flatMap((game) => game.magicOpportunityRecords));
  const topRecords = allRecords
    .sort((a, b) => b.scoreDelta - a.scoreDelta || b.opportunityScore - a.opportunityScore)
    .slice(0, 20);
  const topNonLethalRecords = allRecords
    .filter((record) => !record.lethal)
    .sort((a, b) => b.scoreDelta - a.scoreDelta || b.opportunityScore - a.opportunityScore)
    .slice(0, 20);
  const deck = getDeckPreset(deckPreset);
  const cardStats = buildCardStats(cardIds, usage, lethalUsage, deltaTotal, nonLethalDeltaTotal, bestDelta, totalGames);

  return {
    generatedAt: new Date().toISOString(),
    candidateId,
    deckPreset,
    deckName: deck.name,
    candidateSet,
    gamesPerMatchup,
    cardIds,
    minScoreDelta,
    runs,
    totalGames,
    failures,
    warnings,
    totalOpportunities,
    cardStats,
    roleStats: buildRoleStats(cardStats),
    topRecords,
    topNonLethalRecords,
  };
}

export function formatMasterLabMagicOpportunityMarkdown(report: MasterLabMagicOpportunityReport): string {
  return [
    `# Master Lab Magic Opportunity: ${report.candidateId}`,
    "",
    `生成: ${report.generatedAt}`,
    `デッキ: \`${report.deckPreset}\`（${report.deckName}）`,
    `候補セット: \`${report.candidateSet}\`（${report.cardIds.length} cards）`,
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
    "## Role Summary",
    "",
    "| Role | Cards | Count | Lethal | Non-Lethal Avg | Top Cards | Reading |",
    "| --- | ---: | ---: | ---: | ---: | --- | --- |",
    ...report.roleStats.map(formatRoleStatsRow),
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
    "## Top Non-Lethal Opportunity Records",
    "",
    "| Rank | Seed | Turn | Player | Card | Delta | Target | Selected | Reason |",
    "| ---: | ---: | ---: | --- | --- | ---: | --- | --- | --- |",
    ...report.topNonLethalRecords.map((record, index) => formatNonLethalRecordRow(record, index + 1)),
    "",
    "## Next Loop Proposal",
    "",
    ...formatNextLoopProposal(report),
    "",
    "## Reading",
    "",
    "- count が高いカードは、複数seedで実選択より良い可能性が出たカード。",
    "- lethal は、そのマジックで相手マスターを倒せる勝ち切り機会。汎用性とは分けて読む。",
    "- role summary は、サンダーのようなピーキーな勝ち切り札でランキングが埋まるのを避け、役割ごとの候補を拾うために見る。",
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
        recommendation: recommendCard(cardId, count, lethalCount, nonLethalCount, averageNonLethalDelta, best, totalGames),
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
  cardId: string,
  count: number,
  lethalCount: number,
  nonLethalCount: number,
  averageNonLethalDelta: number,
  bestDelta: number,
  totalGames: number,
): MasterLabMagicOpportunityCardStats["recommendation"] {
  if (isDirectMasterFinisherCard(cardId) && (lethalCount > 0 || count >= 2)) {
    return "finisher_candidate";
  }
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
  if (isDirectMasterFinisherCard(cardId)) {
    return "finisher";
  }
  const trait = getMagicAiTrait(cardId);
  if (!trait) {
    return "utility";
  }
  if (trait.effectKind === "damage") {
    return "removal";
  }
  if (trait.effectKind === "buff" && (trait.intents.includes("lethal") || trait.intents.includes("kill"))) {
    return "burst";
  }
  if (trait.effectKind === "heal" || trait.effectKind === "transform") {
    return "recovery";
  }
  if (trait.effectKind === "draw" || trait.effectKind === "search" || trait.effectKind === "refresh" || trait.intents.includes("resource") || trait.intents.includes("consistency")) {
    return "resource";
  }
  if (trait.effectKind === "move" || trait.effectKind === "wake" || trait.intents.includes("position") || trait.intents.includes("tempo")) {
    return "tempo";
  }
  if (trait.effectKind === "shield" || trait.intents.includes("protect")) {
    return "shield";
  }
  if (trait.effectKind === "level" || trait.effectKind === "buff" || trait.intents.includes("setup")) {
    return "setup";
  }
  if (trait.effectKind === "debuff" || trait.effectKind === "control" || trait.effectKind === "clear" || trait.intents.includes("disrupt")) {
    return "interference";
  }
  return "utility";
}

function isDirectMasterFinisherCard(cardId: string): boolean {
  const def = getCardDef(cardId);
  return def.type === "magic" && def.targetKinds.includes("enemy_master");
}

function buildRoleStats(cardStats: readonly MasterLabMagicOpportunityCardStats[]): MasterLabMagicOpportunityRoleStats[] {
  const byRole = new Map<string, MasterLabMagicOpportunityCardStats[]>();
  for (const stats of cardStats) {
    byRole.set(stats.role, [...(byRole.get(stats.role) ?? []), stats]);
  }

  return Array.from(byRole.entries())
    .map(([role, cards]) => {
      const count = cards.reduce((total, card) => total + card.count, 0);
      const lethalCount = cards.reduce((total, card) => total + card.lethalCount, 0);
      const nonLethalCount = cards.reduce((total, card) => total + card.nonLethalCount, 0);
      const nonLethalDelta = cards.reduce((total, card) => total + card.averageNonLethalDelta * card.nonLethalCount, 0);
      return {
        role,
        cardCount: cards.length,
        count,
        lethalCount,
        nonLethalCount,
        averageNonLethalDelta: nonLethalCount > 0 ? round1(nonLethalDelta / nonLethalCount) : 0,
        topCards: cards
          .filter((card) => card.count > 0)
          .sort((a, b) => b.count - a.count || b.averageNonLethalDelta - a.averageNonLethalDelta || b.bestDelta - a.bestDelta)
          .slice(0, 3),
      };
    })
    .sort((a, b) => b.count - a.count || b.averageNonLethalDelta - a.averageNonLethalDelta || a.role.localeCompare(b.role));
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

function formatRoleStatsRow(stats: MasterLabMagicOpportunityRoleStats): string {
  return [
    stats.role,
    stats.cardCount,
    stats.count,
    stats.lethalCount,
    stats.averageNonLethalDelta,
    stats.topCards.map((card) => `${card.cardName} ${card.count}`).join("<br>") || "-",
    escapeMarkdownTableCell(roleReading(stats)),
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function roleReading(stats: MasterLabMagicOpportunityRoleStats): string {
  if (stats.count === 0) {
    return "今回の盤面では出番なし。";
  }
  if (stats.role === "finisher") {
    return "勝ち切り力を見る枠。汎用性とは分けて扱う。";
  }
  if (stats.role === "burst") {
    return "火力増幅枠。サンダー同様にピーキーなので安定枠とは分ける。";
  }
  if (stats.nonLethalCount >= stats.cardCount && stats.averageNonLethalDelta >= 50) {
    return "役割単位で再現性あり。デッキ採用テストへ進める。";
  }
  if (stats.topCards.length > 0) {
    return "役割内の上位だけを1枚差しで試す。";
  }
  return "候補はあるが優先度は低い。";
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
    return `${stats.lethalCount}件の勝ち切り機会。評価値が跳ねやすいので詰め札として別枠で見る。`;
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

function formatNonLethalRecordRow(record: MasterLabMagicOpportunityRecord, rank: number): string {
  return [
    rank,
    record.seed,
    record.turnNumber,
    record.player,
    `\`${getCardName(record.cardId)}\``,
    record.scoreDelta,
    escapeMarkdownTableCell(record.targetKey),
    escapeMarkdownTableCell(record.selectedDecision),
    escapeMarkdownTableCell(record.opportunityReason),
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatNextLoopProposal(report: MasterLabMagicOpportunityReport): string[] {
  const main = report.cardStats.filter((stats) => stats.recommendation === "main_candidate").slice(0, 3);
  const finisher = report.cardStats.filter((stats) => stats.recommendation === "finisher_candidate").slice(0, 2);
  const tech = selectRoleDiverseCandidates(report.cardStats.filter((stats) => stats.recommendation === "tech_candidate"), 4);
  const rolePicks = selectRoleDiverseCandidates(report.cardStats.filter((stats) => stats.count > 0 && stats.role !== "finisher"), 6);
  const candidates = [...main, ...finisher, ...tech].slice(0, 5);
  if (candidates.length === 0) {
    return [
      "- 提案: 今回の候補マジックには強いシグナルがない。候補範囲を広げるより、まずモンスター比率とAI評価の中母数確認を優先する。",
      "- 次回: `target_black_enemy16_margin12` の games-per-matchup 20-30 再現性確認。",
    ];
  }

  return [
    "- 提案: opportunity 上位だけでなく role 別上位も拾い、サンダー型の勝ち切り札と汎用札を別々に小母数検証する。",
    `- 次回候補: ${candidates.map((card) => `\`${card.cardName}\` ${card.count}件 lethal ${card.lethalCount} non-lethal avg +${card.averageNonLethalDelta}`).join(" / ")}`,
    `- role別控え: ${rolePicks.map((card) => `${card.role}=\`${card.cardName}\` ${card.count}件`).join(" / ") || "なし"}`,
    "- 目安: 3-5デッキ案、games-per-matchup 10-20。warning と敵スケープゴート率を同時に見る。",
    "- 分岐: finisher_candidate は勝率が上がってもピーキー枠として扱い、main_candidate/role別候補の安定性と混ぜて判断しない。",
  ];
}

function selectRoleDiverseCandidates(
  stats: readonly MasterLabMagicOpportunityCardStats[],
  limit: number,
): MasterLabMagicOpportunityCardStats[] {
  const selected: MasterLabMagicOpportunityCardStats[] = [];
  const seenRoles = new Set<string>();
  const ranked = [...stats].sort((a, b) =>
    b.count - a.count ||
    b.averageNonLethalDelta - a.averageNonLethalDelta ||
    b.bestDelta - a.bestDelta ||
    a.cardName.localeCompare(b.cardName),
  );

  for (const card of ranked) {
    if (seenRoles.has(card.role)) {
      continue;
    }
    selected.push(card);
    seenRoles.add(card.role);
    if (selected.length >= limit) {
      return selected;
    }
  }

  for (const card of ranked) {
    if (!selected.some((item) => item.cardId === card.cardId)) {
      selected.push(card);
    }
    if (selected.length >= limit) {
      break;
    }
  }
  return selected;
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
