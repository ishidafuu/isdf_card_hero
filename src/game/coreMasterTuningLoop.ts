import { getCardName } from "./cards";
import {
  buildDeckPresetCardIds,
  getDeckPreset,
  type DeckPresetId,
} from "./deckPresets";
import {
  validateMasterLabAutoPlay,
  type MasterLabAutoPlayOptions,
  type MasterLabAutoPlayResult,
  type MasterLabParticipantId,
} from "./masterLabAutoPlay";
import type { MasterLabEvaluationTuning } from "./masterLab";
import type { CpuAiProfile } from "./cpuAi";
import type { PlayerId } from "./types";

export type CoreMasterTuningMasterId = "white" | "black" | "decoy";

export interface CoreMasterTuningOptions extends Pick<
  MasterLabAutoPlayOptions,
  "maxSteps" | "maxTurns" | "stagnationLimit" | "longGameSteps" | "longGameTurns" | "failOnWarnings"
> {
  variants?: readonly CoreMasterTuningVariant[];
  gamesPerPairing?: number;
  seedStart?: number;
}

export interface CoreMasterTuningVariant {
  id: string;
  masterId: CoreMasterTuningMasterId;
  label: string;
  participant: MasterLabParticipantId;
  deckPreset: DeckPresetId;
  aiProfile: CpuAiProfile;
  hypothesis: string;
  labActionMargin?: number;
  labEvaluationTuning?: MasterLabEvaluationTuning;
}

export interface CoreMasterTuningRun {
  id: string;
  playerVariantId: string;
  cpuVariantId: string;
  seedStart: number;
  games: number;
  result: MasterLabAutoPlayResult;
}

export interface CoreMasterTuningMatchupStats {
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winPointRate: number;
}

export interface CoreMasterTuningStanding {
  variant: CoreMasterTuningVariant;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winPointRate: number;
  score: number;
  averageSteps: number;
  averageTurns: number;
  failures: number;
  warnings: number;
  bannedCardCount: number;
  labDecisionCount: number;
  labActionUsage: Record<string, number>;
  matchups: Record<CoreMasterTuningMasterId, CoreMasterTuningMatchupStats>;
  notes: string[];
}

export interface CoreMasterTuningMasterSummary {
  masterId: CoreMasterTuningMasterId;
  variants: number;
  bestVariantId: string;
  bestScore: number;
  winPointRate: number;
  games: number;
}

export interface CoreMasterTuningReport {
  generatedAt: string;
  gamesPerPairing: number;
  variants: readonly CoreMasterTuningVariant[];
  runs: CoreMasterTuningRun[];
  standings: CoreMasterTuningStanding[];
  masterSummaries: CoreMasterTuningMasterSummary[];
  conclusion: {
    summary: string;
    nextSteps: string[];
  };
}

const BANNED_CARD_IDS = ["card_113"] as const;

export const DEFAULT_CORE_MASTER_TUNING_VARIANTS = [
  {
    id: "white_pressure_strong",
    masterId: "white",
    label: "白: 通常プレッシャー / strong",
    participant: "white",
    deckPreset: "pressure-normal",
    aiProfile: "strong",
    hypothesis: "白基準。ウェイクアップとシールドの両方を使える攻撃寄り標準形を見る。",
  },
  {
    id: "white_balanced_defensive",
    masterId: "white",
    label: "白: 通常バランス / defensive",
    participant: "white",
    deckPreset: "balanced-normal",
    aiProfile: "defensive",
    hypothesis: "白らしい守備寄り評価で、勝ち切りが遅すぎないかを見る。",
  },
  {
    id: "white_494_strong",
    masterId: "white",
    label: "白: 投稿494 / strong",
    participant: "white",
    deckPreset: "submission-pro-no-rare8-white-494",
    aiProfile: "strong",
    hypothesis: "投稿白デッキの安定候補。白基準の上限として使えるかを見る。",
  },
  {
    id: "black_pressure_pressure",
    masterId: "black",
    label: "黒: ブラック検証 / pressure",
    participant: "black",
    deckPreset: "black-pressure",
    aiProfile: "pressure",
    hypothesis: "黒の基準。バーサク本体圧を最も素直に評価する。",
  },
  {
    id: "black_pressure_strong",
    masterId: "black",
    label: "黒: ブラック検証 / strong",
    participant: "black",
    deckPreset: "black-pressure",
    aiProfile: "strong",
    hypothesis: "黒を強気すぎない探索幅で使わせ、pressureとの差を切り分ける。",
  },
  {
    id: "black_1408_pressure",
    masterId: "black",
    label: "黒: 投稿1408 / pressure",
    participant: "black",
    deckPreset: "submission-pro-no-rare8-black-1408",
    aiProfile: "pressure",
    hypothesis: "投稿黒デッキの候補。ロストーンが入る場合は本命から外す。",
  },
  {
    id: "decoy_back_stable",
    masterId: "decoy",
    label: "デコイ: 後衛安定 / enemy+16",
    participant: "decoy",
    deckPreset: "master-lab-decoy-unit-back-stable",
    aiProfile: "strong",
    labActionMargin: 12,
    labEvaluationTuning: { targetOwnerBias: { enemy: 16 } },
    hypothesis: "デコイ現行本命。守る価値の高い後衛を厚くし、敵対象スケープゴートも少し見る。",
  },
  {
    id: "decoy_back_pressure",
    masterId: "decoy",
    label: "デコイ: 後衛圧力 / provoke+16",
    participant: "decoy",
    deckPreset: "master-lab-decoy-unit-back-pressure",
    aiProfile: "strong",
    labActionMargin: 12,
    labEvaluationTuning: { actionBias: { provoke: 16 }, targetOwnerBias: { enemy: 16 } },
    hypothesis: "黒相手の惜敗を、後衛圧力と挑発厚めで詰められるかを見る。",
  },
  {
    id: "decoy_black_pressure_trim",
    masterId: "decoy",
    label: "デコイ: black-pressure / 挑発厚め",
    participant: "decoy",
    deckPreset: "black-pressure",
    aiProfile: "strong",
    labActionMargin: 12,
    labEvaluationTuning: { actionBias: { provoke: 16, scapegoat: -8 }, targetOwnerBias: { enemy: 16 } },
    hypothesis: "既存黒寄りデッキを使い、スケープゴート偏重を抑えた時の基準を見る。",
  },
] as const satisfies readonly CoreMasterTuningVariant[];

export function runCoreMasterTuningLoop(options: CoreMasterTuningOptions = {}): CoreMasterTuningReport {
  const variants = options.variants ?? DEFAULT_CORE_MASTER_TUNING_VARIANTS;
  const gamesPerPairing = integerOption(options.gamesPerPairing, 3);
  const seedStart = integerOption(options.seedStart, 6000);
  const runs: CoreMasterTuningRun[] = [];
  let runIndex = 0;

  for (let leftIndex = 0; leftIndex < variants.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < variants.length; rightIndex += 1) {
      const left = variants[leftIndex];
      const right = variants[rightIndex];
      if (!left || !right || left.masterId === right.masterId) {
        continue;
      }
      for (const [playerVariant, cpuVariant] of [[left, right], [right, left]] as const) {
        const runSeedStart = seedStart + runIndex * gamesPerPairing;
        runs.push({
          id: `${playerVariant.id}_vs_${cpuVariant.id}`,
          playerVariantId: playerVariant.id,
          cpuVariantId: cpuVariant.id,
          seedStart: runSeedStart,
          games: gamesPerPairing,
          result: validateMasterLabAutoPlay({
            seedStart: runSeedStart,
            count: gamesPerPairing,
            maxSteps: options.maxSteps ?? 700,
            maxTurns: options.maxTurns ?? 160,
            stagnationLimit: options.stagnationLimit,
            longGameSteps: options.longGameSteps,
            longGameTurns: options.longGameTurns,
            failOnWarnings: options.failOnWarnings,
            participants: {
              player: playerVariant.participant,
              cpu: cpuVariant.participant,
            },
            deckPresets: {
              player: playerVariant.deckPreset,
              cpu: cpuVariant.deckPreset,
            },
            aiProfiles: {
              player: playerVariant.aiProfile,
              cpu: cpuVariant.aiProfile,
            },
            ...labOptionsForPairing(playerVariant, cpuVariant),
          }),
        });
        runIndex += 1;
      }
    }
  }

  const standings = summarizeStandings(variants, runs);
  const masterSummaries = summarizeMasters(standings);

  return {
    generatedAt: new Date().toISOString(),
    gamesPerPairing,
    variants,
    runs,
    standings,
    masterSummaries,
    conclusion: buildConclusion(standings, masterSummaries),
  };
}

export function formatCoreMasterTuningLoopMarkdown(report: CoreMasterTuningReport): string {
  return [
    "# Core Master Tuning Loop",
    "",
    `生成: ${report.generatedAt}`,
    `候補: ${report.variants.length}`,
    `試行: ${report.gamesPerPairing} games/pairing`,
    `総試合: ${report.runs.reduce((total, run) => total + run.result.summary.games, 0)}`,
    "",
    "## Conclusion",
    "",
    report.conclusion.summary,
    "",
    "### Next Steps",
    "",
    ...report.conclusion.nextSteps.map((step) => `- ${step}`),
    "",
    "## Master Summary",
    "",
    "| Master | Variants | Best | Score | Win% | Games |",
    "| --- | ---: | --- | ---: | ---: | ---: |",
    ...report.masterSummaries.map((summary) =>
      `| ${summary.masterId} | ${summary.variants} | ${summary.bestVariantId} | ${summary.bestScore} | ${formatPercent(summary.winPointRate)} | ${summary.games} |`,
    ),
    "",
    "## Standings",
    "",
    "| Rank | Master | Variant | Deck | AI | Score | W-L-D | Win% | vs White | vs Black | vs Decoy | Avg Turns | Issues | Lab Usage | Notes |",
    "| ---: | --- | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |",
    ...report.standings.map((standing, index) => formatStandingRow(standing, index + 1)),
    "",
    "## Runs",
    "",
    "| Run | Player | CPU | Result | Issues |",
    "| --- | --- | --- | --- | --- |",
    ...report.runs.map((run) => formatRunRow(run, report.variants)),
    "",
    "## Reading",
    "",
    "- `Win%` は引き分けを0.5勝として扱う勝ち点率。",
    "- `vs White/Black/Decoy` は相手マスター別の勝ち点率。同一マスター同士は初回ループでは省略。",
    "- `Lab Usage` はデコイ特技のみ。白黒は通常AIのマスター特技をそのまま使う。",
    "- ロストーン入りデッキは `Notes` に出る。現方針では本命候補から外す。",
  ].join("\n");
}

function labOptionsForPairing(
  playerVariant: CoreMasterTuningVariant,
  cpuVariant: CoreMasterTuningVariant,
): Pick<MasterLabAutoPlayOptions, "labActionMargin" | "labEvaluationTuning"> {
  const labVariant = playerVariant.masterId === "decoy"
    ? playerVariant
    : cpuVariant.masterId === "decoy"
      ? cpuVariant
      : undefined;
  return {
    ...(labVariant?.labActionMargin !== undefined ? { labActionMargin: labVariant.labActionMargin } : {}),
    ...(labVariant?.labEvaluationTuning ? { labEvaluationTuning: labVariant.labEvaluationTuning } : {}),
  };
}

function summarizeStandings(
  variants: readonly CoreMasterTuningVariant[],
  runs: readonly CoreMasterTuningRun[],
): CoreMasterTuningStanding[] {
  const records = new Map(variants.map((variant) => [variant.id, createStandingRecord(variant)]));
  for (const run of runs) {
    const player = records.get(run.playerVariantId);
    const cpu = records.get(run.cpuVariantId);
    if (!player || !cpu) {
      continue;
    }
    for (const game of run.result.games) {
      applyGameResult(player, cpu.variant.masterId, "player", game);
      applyGameResult(cpu, player.variant.masterId, "cpu", game);
      if (player.variant.masterId === "decoy") {
        addUsage(player.labActionUsage, game.labActionUsage);
        player.labDecisionCount += game.labDecisionCount;
      }
      if (cpu.variant.masterId === "decoy") {
        addUsage(cpu.labActionUsage, game.labActionUsage);
        cpu.labDecisionCount += game.labDecisionCount;
      }
    }
  }

  return [...records.values()]
    .map(finalizeStanding)
    .sort((a, b) =>
      masterOrder(a.variant.masterId) - masterOrder(b.variant.masterId) ||
      b.score - a.score ||
      b.winPointRate - a.winPointRate ||
      a.variant.id.localeCompare(b.variant.id),
    );
}

function createStandingRecord(variant: CoreMasterTuningVariant): CoreMasterTuningStanding {
  return {
    variant,
    games: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winPointRate: 0,
    score: 0,
    averageSteps: 0,
    averageTurns: 0,
    failures: 0,
    warnings: 0,
    bannedCardCount: bannedCardCount(variant.deckPreset),
    labDecisionCount: 0,
    labActionUsage: {},
    matchups: {
      white: emptyMatchupStats(),
      black: emptyMatchupStats(),
      decoy: emptyMatchupStats(),
    },
    notes: [],
  };
}

function applyGameResult(
  standing: CoreMasterTuningStanding,
  opponentMasterId: CoreMasterTuningMasterId,
  seat: PlayerId,
  game: MasterLabAutoPlayResult["games"][number],
): void {
  standing.games += 1;
  standing.averageSteps += game.steps;
  standing.averageTurns += game.turns;
  standing.failures += game.issueCount;
  standing.warnings += game.warningCount;

  const matchup = standing.matchups[opponentMasterId];
  matchup.games += 1;

  if (!game.winner) {
    standing.draws += 1;
    matchup.draws += 1;
    return;
  }
  if (game.winner === seat) {
    standing.wins += 1;
    matchup.wins += 1;
  } else {
    standing.losses += 1;
    matchup.losses += 1;
  }
}

function finalizeStanding(standing: CoreMasterTuningStanding): CoreMasterTuningStanding {
  const games = Math.max(standing.games, 1);
  const finalizedMatchups = {
    white: finalizeMatchupStats(standing.matchups.white),
    black: finalizeMatchupStats(standing.matchups.black),
    decoy: finalizeMatchupStats(standing.matchups.decoy),
  };
  const winPointRate = rate(standing.wins + standing.draws * 0.5, standing.games);
  const playedMatchups = Object.values(finalizedMatchups).filter((matchup) => matchup.games > 0);
  const matchupFloor = playedMatchups.length > 0 ? Math.min(...playedMatchups.map((matchup) => matchup.winPointRate)) : 0;
  const speedScore = clamp((42 - standing.averageTurns / games) / 20, 0, 1);
  const averageSteps = round1(standing.averageSteps / games);
  const averageTurns = round1(standing.averageTurns / games);
  const whiteRiskPenalty = standing.variant.masterId !== "white" && finalizedMatchups.white.games > 0
    ? Math.max(0, finalizedMatchups.white.winPointRate - 0.65) * 18
    : 0;
  const bannedPenalty = standing.bannedCardCount * 12;
  const safetyPenalty = standing.failures * 25 + standing.warnings * 6;
  const score = round1(
    winPointRate * 48 +
    matchupFloor * 24 +
    speedScore * 8 -
    whiteRiskPenalty -
    bannedPenalty -
    safetyPenalty,
  );

  return {
    ...standing,
    winPointRate: round3(winPointRate),
    score,
    averageSteps,
    averageTurns,
    matchups: finalizedMatchups,
    notes: buildStandingNotes(standing, finalizedMatchups, averageTurns),
  };
}

function summarizeMasters(standings: readonly CoreMasterTuningStanding[]): CoreMasterTuningMasterSummary[] {
  return (["white", "black", "decoy"] as const).map((masterId) => {
    const rows = standings.filter((standing) => standing.variant.masterId === masterId);
    const best = [...rows].sort((a, b) => b.score - a.score || b.winPointRate - a.winPointRate)[0];
    const games = rows.reduce((total, standing) => total + standing.games, 0);
    const winPoints = rows.reduce((total, standing) => total + standing.wins + standing.draws * 0.5, 0);
    return {
      masterId,
      variants: rows.length,
      bestVariantId: best?.variant.id ?? "-",
      bestScore: best?.score ?? 0,
      winPointRate: round3(rate(winPoints, games)),
      games,
    };
  });
}

function buildConclusion(
  standings: readonly CoreMasterTuningStanding[],
  masterSummaries: readonly CoreMasterTuningMasterSummary[],
): CoreMasterTuningReport["conclusion"] {
  const bestByMaster = new Map(masterSummaries.map((summary) => [
    summary.masterId,
    standings.find((standing) => standing.variant.id === summary.bestVariantId),
  ]));
  const white = bestByMaster.get("white");
  const black = bestByMaster.get("black");
  const decoy = bestByMaster.get("decoy");
  const issues = standings.reduce((total, standing) => total + standing.failures + standing.warnings, 0);
  const whiteOverpowered = [black, decoy].filter((standing) =>
    standing && standing.matchups.white.games > 0 && standing.matchups.white.winPointRate > 0.65,
  ) as CoreMasterTuningStanding[];
  const weakIntoBlack = decoy && decoy.matchups.black.games > 0 && decoy.matchups.black.winPointRate < 0.45;

  const nextSteps: string[] = [];
  if (issues > 0) {
    nextSteps.push("warning/failureが出たseedを先に確認し、長期戦か進行問題かを切り分ける。");
  }
  if (whiteOverpowered.length > 0) {
    nextSteps.push(`白に勝ちすぎている候補（${whiteOverpowered.map((standing) => standing.variant.id).join(", ")}）は本命から外し、白基準に近い構成へ戻す。`);
  }
  if (weakIntoBlack) {
    nextSteps.push("デコイのvs Blackが45%未満なら、デッキより挑発タイミングと守る対象の評価を優先して調整する。");
  }
  nextSteps.push("次ループは各マスター上位1-2案に絞り、games-per-pairingを10へ増やして再現性を見る。");
  nextSteps.push("デッキ調整はロストーンなしを前提に、白は基準化、黒は速攻精度、デコイは黒相手の負け方分類を優先する。");

  return {
    summary: [
      `白本命: ${white?.variant.id ?? "-"} / 黒本命: ${black?.variant.id ?? "-"} / デコイ本命: ${decoy?.variant.id ?? "-"}.`,
      issues > 0 ? `issuesは合計${issues}件。安全性確認を先に挟む。` : "初回マトリクスでは進行上の重大issueは出ていない。",
      whiteOverpowered.length > 0
        ? "白に勝ちすぎる候補があるため、採用判断では総合勝率より白基準への近さを優先する。"
        : "白基準を大きく壊す候補は初回上位には出ていない。",
    ].join(" "),
    nextSteps,
  };
}

function buildStandingNotes(
  standing: CoreMasterTuningStanding,
  matchups: Record<CoreMasterTuningMasterId, CoreMasterTuningMatchupStats>,
  averageTurns: number,
): string[] {
  const notes: string[] = [];
  if (standing.bannedCardCount > 0) {
    notes.push(`${getCardName(BANNED_CARD_IDS[0])}入り`);
  }
  if (standing.failures > 0) {
    notes.push(`failure ${standing.failures}`);
  }
  if (standing.warnings > 0) {
    notes.push(`warning ${standing.warnings}`);
  }
  if (standing.variant.masterId !== "white" && matchups.white.games > 0 && matchups.white.winPointRate > 0.65) {
    notes.push("白に勝ちすぎ");
  }
  if (standing.variant.masterId === "decoy" && matchups.black.games > 0 && matchups.black.winPointRate < 0.45) {
    notes.push("黒対策不足");
  }
  if (standing.variant.masterId === "white" && averageTurns > 38) {
    notes.push("白の勝ち切り遅め");
  }
  return notes.length > 0 ? notes : ["-"];
}

function formatStandingRow(standing: CoreMasterTuningStanding, rank: number): string {
  return [
    rank,
    standing.variant.masterId,
    escapeCell(`${standing.variant.id}<br>${standing.variant.label}`),
    escapeCell(`${standing.variant.deckPreset}<br>${getDeckPreset(standing.variant.deckPreset).name}`),
    standing.variant.aiProfile,
    standing.score,
    `${standing.wins}-${standing.losses}-${standing.draws}`,
    formatPercent(standing.winPointRate),
    formatMatchup(standing.matchups.white),
    formatMatchup(standing.matchups.black),
    formatMatchup(standing.matchups.decoy),
    standing.averageTurns,
    `${standing.failures}F/${standing.warnings}W`,
    formatUsage(standing.labActionUsage),
    escapeCell(standing.notes.join("<br>")),
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatRunRow(
  run: CoreMasterTuningRun,
  variants: readonly CoreMasterTuningVariant[],
): string {
  const player = variants.find((variant) => variant.id === run.playerVariantId);
  const cpu = variants.find((variant) => variant.id === run.cpuVariantId);
  return [
    run.id,
    escapeCell(`${run.playerVariantId}<br>${player?.deckPreset ?? "-"}`),
    escapeCell(`${run.cpuVariantId}<br>${cpu?.deckPreset ?? "-"}`),
    `P ${run.result.summary.winners.player} / C ${run.result.summary.winners.cpu} / D ${run.result.summary.undecided}`,
    `${run.result.summary.failures}F/${run.result.summary.warnings}W`,
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function emptyMatchupStats(): CoreMasterTuningMatchupStats {
  return { games: 0, wins: 0, losses: 0, draws: 0, winPointRate: 0 };
}

function finalizeMatchupStats(stats: CoreMasterTuningMatchupStats): CoreMasterTuningMatchupStats {
  return {
    ...stats,
    winPointRate: round3(rate(stats.wins + stats.draws * 0.5, stats.games)),
  };
}

function addUsage(target: Record<string, number>, source: Record<string, number>): void {
  for (const [key, value] of Object.entries(source)) {
    target[key] = (target[key] ?? 0) + value;
  }
}

function bannedCardCount(deckPreset: DeckPresetId): number {
  const cardIds = buildDeckPresetCardIds(deckPreset);
  return cardIds.filter((cardId) => (BANNED_CARD_IDS as readonly string[]).includes(cardId)).length;
}

function formatMatchup(stats: CoreMasterTuningMatchupStats): string {
  return stats.games > 0 ? `${formatPercent(stats.winPointRate)}<br>${stats.wins}-${stats.losses}-${stats.draws}` : "-";
}

function formatUsage(usage: Record<string, number>): string {
  const entries = Object.entries(usage).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return entries.length > 0 ? entries.slice(0, 3).map(([key, value]) => `${key} ${value}`).join("<br>") : "-";
}

function masterOrder(masterId: CoreMasterTuningMasterId): number {
  if (masterId === "white") {
    return 0;
  }
  if (masterId === "black") {
    return 1;
  }
  return 2;
}

function integerOption(value: number | undefined, fallback: number): number {
  return Number.isInteger(value) && value !== undefined ? value : fallback;
}

function rate(value: number, total: number): number {
  return total > 0 ? value / total : 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

function escapeCell(value: string): string {
  return value.replaceAll("|", "\\|");
}
