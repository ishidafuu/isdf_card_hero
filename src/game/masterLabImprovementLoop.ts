import { getDeckPreset, type DeckPresetId } from "./deckPresets";
import { runMasterLabFinalGate, type MasterLabFinalGateOptions, type MasterLabFinalGateResult } from "./masterLabFinalGate";
import type { MasterLabCandidateId } from "./masterLab";
import type { PlayerId } from "./types";

export type MasterLabImprovementJudgement = "advance" | "hold" | "reject";
export type MasterLabImprovementDecision = "needs_full_gate" | "continue_deck_loop" | "pivot_to_action_design";

export interface MasterLabImprovementLoopOptions extends Omit<MasterLabFinalGateOptions, "deckPreset"> {
  loopCount?: number;
  deckPresets?: readonly DeckPresetId[];
}

export interface MasterLabImprovementMetrics {
  score: number;
  games: number;
  failures: number;
  warnings: number;
  nonMirrorGames: number;
  decoyWins: number;
  decoyLosses: number;
  decoyUndecided: number;
  decoyWinRate: number;
  blackGames: number;
  blackWins: number;
  blackLosses: number;
  blackWinRate: number;
  whiteGames: number;
  whiteWins: number;
  whiteLosses: number;
  whiteWinRate: number;
  averageSteps: number;
  averageTurns: number;
  averageOpponentHpOnLoss?: number;
  averageDecoyHpOnWin?: number;
  mirrorMaxTurns: number;
  mirrorWarnings: number;
  labDecisionCount: number;
  labActionUsage: Record<string, number>;
  scapegoatRate: number;
  provokeRate: number;
  masterAttackRate: number;
}

export interface MasterLabImprovementLoopEntry {
  index: number;
  deckPreset: DeckPresetId;
  deckName: string;
  deckMeta: string;
  hypothesis: string;
  result: MasterLabFinalGateResult;
  metrics: MasterLabImprovementMetrics;
  judgement: MasterLabImprovementJudgement;
  nextAction: string;
}

export interface MasterLabImprovementConclusion {
  decision: MasterLabImprovementDecision;
  summary: string;
  reasons: string[];
  nextSteps: string[];
}

export interface MasterLabImprovementLoopReport {
  generatedAt: string;
  candidateId: MasterLabCandidateId;
  gamesPerMatchup: number;
  loopCount: number;
  entries: MasterLabImprovementLoopEntry[];
  rankedEntries: MasterLabImprovementLoopEntry[];
  baseline: MasterLabImprovementLoopEntry;
  best: MasterLabImprovementLoopEntry;
  conclusion: MasterLabImprovementConclusion;
}

const DEFAULT_CANDIDATE_ID = "decoy" satisfies MasterLabCandidateId;
const DEFAULT_GAMES_PER_MATCHUP = 5;

export const DEFAULT_MASTER_LAB_IMPROVEMENT_DECK_PRESETS = [
  "pressure-normal",
  "balanced-normal",
  "black-pressure",
  "submission-pro-no-rare8-black-1408",
  "submission-pro-no-rare8-black-1403",
  "submission-pro-with-rare8-black-1390",
  "submission-pro-no-rare8-black-1388",
  "submission-pro-with-rare8-black-1387",
  "submission-pro-with-rare8-white-1384",
  "submission-pro-with-rare8-black-1382",
  "submission-pro-no-rare8-white-1377",
  "submission-pro-no-rare8-black-1375",
  "submission-pro-with-rare8-black-1374",
  "submission-pro-with-rare8-black-1354",
  "submission-pro-no-rare8-black-1353",
  "submission-pro-no-rare8-white-1347",
  "submission-pro-with-rare8-white-1346",
  "submission-pro-no-rare8-white-1340",
  "submission-pro-with-rare8-white-1339",
  "submission-pro-with-rare8-black-1328",
] as const satisfies readonly DeckPresetId[];

export function runMasterLabImprovementLoop(
  options: MasterLabImprovementLoopOptions = {},
): MasterLabImprovementLoopReport {
  const {
    deckPresets: explicitDeckPresets,
    loopCount: explicitLoopCount,
    ...finalGateOptions
  } = options;
  const candidateId = finalGateOptions.candidateId ?? DEFAULT_CANDIDATE_ID;
  const gamesPerMatchup = finalGateOptions.gamesPerMatchup ?? DEFAULT_GAMES_PER_MATCHUP;
  const deckPresets = selectDeckPresets(explicitDeckPresets, explicitLoopCount);

  const rawEntries = deckPresets.map((deckPreset, index): Omit<MasterLabImprovementLoopEntry, "judgement" | "nextAction"> => {
    const result = runMasterLabFinalGate({
      ...finalGateOptions,
      candidateId,
      gamesPerMatchup,
      deckPreset,
      includeGameHistory: true,
      historyLimit: finalGateOptions.historyLimit ?? 8,
    });
    const preset = getDeckPreset(deckPreset);
    return {
      index: index + 1,
      deckPreset,
      deckName: preset.name,
      deckMeta: formatDeckMeta(preset.masterId, preset.mode, preset.allowSpecial),
      hypothesis: buildHypothesis(deckPreset),
      result,
      metrics: summarizeImprovementMetrics(result, candidateId),
    };
  });

  const rankedRawEntries = [...rawEntries].sort(compareImprovementEntries);
  const bestRawEntry = rankedRawEntries[0];
  if (!bestRawEntry) {
    throw new Error("No master lab improvement loop entries were selected");
  }

  const entries = rawEntries.map((entry) => assignEntryJudgement(entry, bestRawEntry.metrics.score));
  const rankedEntries = [...entries].sort(compareImprovementEntries);
  const baseline = entries.find((entry) => entry.deckPreset === "pressure-normal") ?? entries[0];
  const best = rankedEntries[0];
  if (!baseline || !best) {
    throw new Error("No master lab improvement loop entries were evaluated");
  }

  return {
    generatedAt: new Date().toISOString(),
    candidateId,
    gamesPerMatchup,
    loopCount: entries.length,
    entries,
    rankedEntries,
    baseline,
    best,
    conclusion: buildConclusion(baseline, best, rankedEntries),
  };
}

export function formatMasterLabImprovementLoopMarkdown(report: MasterLabImprovementLoopReport): string {
  return [
    `# Master Lab Improvement Loop: ${report.candidateId}`,
    "",
    `生成: ${report.generatedAt}`,
    `ループ数: ${report.loopCount}`,
    `試行: ${report.gamesPerMatchup} games/matchup（5 matchups）`,
    "",
    "## Conclusion",
    "",
    `判定: ${report.conclusion.decision}`,
    "",
    report.conclusion.summary,
    "",
    "### Reasons",
    "",
    ...report.conclusion.reasons.map((reason) => `- ${reason}`),
    "",
    "### Next Steps",
    "",
    ...report.conclusion.nextSteps.map((step) => `- ${step}`),
    "",
    "## Top Candidates",
    "",
    "| Rank | Loop | Deck | Score | Overall | vs Black | vs White | Loss Opp HP | Usage | Issues | Judgement |",
    "| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |",
    ...report.rankedEntries.slice(0, 5).map((entry, rank) => formatEntryRow(entry, rank + 1)),
    "",
    "## Loop Results",
    "",
    "| Loop | Deck | Hypothesis | Score | Overall | vs Black | vs White | Avg Turns | Loss Opp HP | Action Usage | Issues | Judgement |",
    "| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |",
    ...report.entries.map(formatLoopRow),
    "",
    "## Reading",
    "",
    "- `Overall` はミラーを除いたデコイ側の勝率。白/黒それぞれを相手にした両座席の合算を見る。",
    "- `Loss Opp HP` はデコイ敗北時の相手マスター残HP平均。低いほど惜敗、高いほど押し切られている。",
    "- この20ループはスクリーニングであり、上位候補は100戦マトリクスで再確認する。",
  ].join("\n");
}

function selectDeckPresets(
  explicitDeckPresets: readonly DeckPresetId[] | undefined,
  explicitLoopCount: number | undefined,
): readonly DeckPresetId[] {
  const source = explicitDeckPresets && explicitDeckPresets.length > 0
    ? explicitDeckPresets
    : DEFAULT_MASTER_LAB_IMPROVEMENT_DECK_PRESETS;
  const loopCount = Number.isInteger(explicitLoopCount) && explicitLoopCount !== undefined
    ? explicitLoopCount
    : source.length;
  if (loopCount <= 0) {
    throw new Error("loopCount must be greater than 0");
  }
  if (loopCount > source.length) {
    throw new Error(`loopCount ${loopCount} exceeds selected deck preset count ${source.length}`);
  }
  return source.slice(0, loopCount);
}

function summarizeImprovementMetrics(
  result: MasterLabFinalGateResult,
  candidateId: MasterLabCandidateId,
): MasterLabImprovementMetrics {
  let nonMirrorGames = 0;
  let decoyWins = 0;
  let decoyLosses = 0;
  let decoyUndecided = 0;
  let blackGames = 0;
  let blackWins = 0;
  let blackLosses = 0;
  let whiteGames = 0;
  let whiteWins = 0;
  let whiteLosses = 0;
  let steps = 0;
  let turns = 0;
  let mirrorMaxTurns = 0;
  let mirrorWarnings = 0;
  let opponentHpOnLossTotal = 0;
  let opponentHpOnLossCount = 0;
  let decoyHpOnWinTotal = 0;
  let decoyHpOnWinCount = 0;

  for (const run of result.runs) {
    const playerIsCandidate = run.matchup.participants.player === candidateId;
    const cpuIsCandidate = run.matchup.participants.cpu === candidateId;
    const isMirror = playerIsCandidate && cpuIsCandidate;
    const decoySeat: PlayerId | undefined = playerIsCandidate ? "player" : cpuIsCandidate ? "cpu" : undefined;
    const opponentSeat: PlayerId | undefined = decoySeat === "player" ? "cpu" : decoySeat === "cpu" ? "player" : undefined;
    const opponent = opponentSeat ? run.matchup.participants[opponentSeat] : undefined;

    if (isMirror) {
      mirrorWarnings += run.result.summary.warnings;
    }

    for (const game of run.result.games) {
      steps += game.steps;
      turns += game.turns;

      if (isMirror) {
        mirrorMaxTurns = Math.max(mirrorMaxTurns, game.turns);
        continue;
      }
      if (!decoySeat || !opponentSeat) {
        continue;
      }

      nonMirrorGames += 1;
      if (opponent === "black") {
        blackGames += 1;
      }
      if (opponent === "white") {
        whiteGames += 1;
      }

      if (!game.winner) {
        decoyUndecided += 1;
        continue;
      }

      if (game.winner === decoySeat) {
        decoyWins += 1;
        if (opponent === "black") {
          blackWins += 1;
        }
        if (opponent === "white") {
          whiteWins += 1;
        }
        const decoyHp = game.stateSummary?.players[decoySeat].hp;
        if (decoyHp !== undefined) {
          decoyHpOnWinTotal += decoyHp;
          decoyHpOnWinCount += 1;
        }
      } else {
        decoyLosses += 1;
        if (opponent === "black") {
          blackLosses += 1;
        }
        if (opponent === "white") {
          whiteLosses += 1;
        }
        const opponentHp = game.stateSummary?.players[opponentSeat].hp;
        if (opponentHp !== undefined) {
          opponentHpOnLossTotal += opponentHp;
          opponentHpOnLossCount += 1;
        }
      }
    }
  }

  const usage = result.summary.labActionUsage;
  const labDecisionCount = result.summary.labDecisionCount;
  const metrics = {
    games: result.summary.games,
    failures: result.summary.failures,
    warnings: result.summary.warnings,
    nonMirrorGames,
    decoyWins,
    decoyLosses,
    decoyUndecided,
    decoyWinRate: rate(decoyWins, nonMirrorGames),
    blackGames,
    blackWins,
    blackLosses,
    blackWinRate: rate(blackWins, blackGames),
    whiteGames,
    whiteWins,
    whiteLosses,
    whiteWinRate: rate(whiteWins, whiteGames),
    averageSteps: round1(steps / Math.max(result.summary.games, 1)),
    averageTurns: round1(turns / Math.max(result.summary.games, 1)),
    averageOpponentHpOnLoss: opponentHpOnLossCount > 0 ? round1(opponentHpOnLossTotal / opponentHpOnLossCount) : undefined,
    averageDecoyHpOnWin: decoyHpOnWinCount > 0 ? round1(decoyHpOnWinTotal / decoyHpOnWinCount) : undefined,
    mirrorMaxTurns,
    mirrorWarnings,
    labDecisionCount,
    labActionUsage: usage,
    scapegoatRate: rate(usage.scapegoat ?? 0, labDecisionCount),
    provokeRate: rate(usage.provoke ?? 0, labDecisionCount),
    masterAttackRate: rate(usage.master_attack ?? 0, labDecisionCount),
  } satisfies Omit<MasterLabImprovementMetrics, "score">;

  return {
    ...metrics,
    score: scoreMetrics(metrics),
  };
}

function scoreMetrics(metrics: Omit<MasterLabImprovementMetrics, "score">): number {
  const lossQuality = metrics.averageOpponentHpOnLoss === undefined
    ? 4
    : (1 - clamp((metrics.averageOpponentHpOnLoss - 1) / 9, 0, 1)) * 8;
  const winQuality = metrics.averageDecoyHpOnWin === undefined
    ? 0
    : clamp((metrics.averageDecoyHpOnWin - 1) / 9, 0, 1) * 4;
  const scapegoatOverusePenalty = Math.max(0, metrics.scapegoatRate - 0.82) * 16;
  const longGamePenalty = Math.max(0, metrics.averageTurns - 34) * 0.25 + Math.max(0, metrics.mirrorMaxTurns - 34) * 0.2;
  const safetyPenalty = metrics.failures * 100 + metrics.warnings * 5 + metrics.mirrorWarnings * 2;

  return round1(
    metrics.decoyWinRate * 38 +
    metrics.blackWinRate * 34 +
    metrics.whiteWinRate * 16 +
    lossQuality +
    winQuality -
    scapegoatOverusePenalty -
    longGamePenalty -
    safetyPenalty,
  );
}

function assignEntryJudgement(
  entry: Omit<MasterLabImprovementLoopEntry, "judgement" | "nextAction">,
  bestScore: number,
): MasterLabImprovementLoopEntry {
  const metrics = entry.metrics;
  if (metrics.failures > 0) {
    return {
      ...entry,
      judgement: "reject",
      nextAction: "失敗seedの原因確認を優先し、候補からは外す。",
    };
  }
  if (metrics.score >= bestScore - 5 && metrics.decoyWinRate >= 0.5) {
    return {
      ...entry,
      judgement: "advance",
      nextAction: "100戦マトリクスへ進め、黒相手と白相手の再現性を確認する。",
    };
  }
  if (metrics.blackWinRate >= 0.45 || metrics.decoyWinRate >= 0.5) {
    return {
      ...entry,
      judgement: "hold",
      nextAction: "上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。",
    };
  }
  return {
    ...entry,
    judgement: "reject",
    nextAction: "デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。",
  };
}

function buildConclusion(
  baseline: MasterLabImprovementLoopEntry,
  best: MasterLabImprovementLoopEntry,
  rankedEntries: readonly MasterLabImprovementLoopEntry[],
): MasterLabImprovementConclusion {
  const blackGain = best.metrics.blackWinRate - baseline.metrics.blackWinRate;
  const overallGain = best.metrics.decoyWinRate - baseline.metrics.decoyWinRate;
  const stableTopCount = rankedEntries.filter((entry) =>
    entry.metrics.failures === 0 &&
    entry.metrics.warnings <= 1 &&
    entry.metrics.blackWinRate >= 0.5,
  ).length;

  if (best.metrics.failures === 0 && (blackGain >= 0.15 || overallGain >= 0.1)) {
    return {
      decision: "needs_full_gate",
      summary: `${best.deckName} が基準より伸びた。小母数の上振れを排除するため、まず上位候補を100戦マトリクスで再検証する。`,
      reasons: [
        `${best.deckPreset}: overall ${formatPercent(best.metrics.decoyWinRate)} / vs Black ${formatPercent(best.metrics.blackWinRate)} / score ${best.metrics.score}`,
        `baseline ${baseline.deckPreset}: overall ${formatPercent(baseline.metrics.decoyWinRate)} / vs Black ${formatPercent(baseline.metrics.blackWinRate)}`,
        `black gain ${formatSignedPercent(blackGain)}, overall gain ${formatSignedPercent(overallGain)}`,
      ],
      nextSteps: [
        `${best.deckPreset} を games-per-matchup 100 で再実行する。`,
        "上位3件の負けログを見て、スケープゴート過多か挑発不足かを分類する。",
        "100戦でも黒相手が50%を超えるなら、デッキ調整ループを継続する。",
      ],
    };
  }

  if (best.metrics.blackWinRate < 0.45 && stableTopCount <= 1) {
    return {
      decision: "pivot_to_action_design",
      summary: "デッキ差し替えだけでは黒速攻への耐性が伸び切っていない。次はデコイ特技の評価式やコスト、発動タイミングを触る段階。",
      reasons: [
        `best vs Black ${formatPercent(best.metrics.blackWinRate)} が45%未満`,
        `stable top count ${stableTopCount} 件で、デッキ側に再現性のある改善が少ない`,
        `baselineとの差分は black ${formatSignedPercent(blackGain)}, overall ${formatSignedPercent(overallGain)}`,
      ],
      nextSteps: [
        "挑発を「行動前の高打点」へ寄せる評価を追加し、バーサク突撃の受け先を早く作る。",
        "スケープゴートは連打率を抑え、守る価値の高い駒だけに寄せる。",
        "次ループはデッキ固定で、特技評価パラメータだけを10-20候補比較する。",
      ],
    };
  }

  return {
    decision: "continue_deck_loop",
    summary: "明確な採用候補はまだ本検証待ちだが、デッキ側の差は出ている。候補を絞り、同系統の微調整を続ける価値がある。",
    reasons: [
      `${best.deckPreset}: overall ${formatPercent(best.metrics.decoyWinRate)} / vs Black ${formatPercent(best.metrics.blackWinRate)}`,
      `baselineとの差分は black ${formatSignedPercent(blackGain)}, overall ${formatSignedPercent(overallGain)}`,
      `vs Black 50%以上の安定候補が ${stableTopCount} 件ある`,
    ],
    nextSteps: [
      "上位3候補だけ games-per-matchup 20-30 で中間検証する。",
      "共通カードを抽出して、デコイ向けの小さな固定デッキ候補を作る。",
      "伸びが鈍れば、特技評価パラメータ比較へ切り替える。",
    ],
  };
}

function compareImprovementEntries(
  a: Pick<MasterLabImprovementLoopEntry, "metrics" | "index">,
  b: Pick<MasterLabImprovementLoopEntry, "metrics" | "index">,
): number {
  return b.metrics.score - a.metrics.score ||
    b.metrics.blackWinRate - a.metrics.blackWinRate ||
    b.metrics.decoyWinRate - a.metrics.decoyWinRate ||
    a.index - b.index;
}

function buildHypothesis(deckPreset: DeckPresetId): string {
  if (deckPreset === "pressure-normal") {
    return "攻撃寄り標準構成で、デコイの受け特技がテンポ損を返せるか見る。";
  }
  if (deckPreset === "balanced-normal") {
    return "基準構成として、白/黒どちらにも極端に寄らない平均値を見る。";
  }
  if (deckPreset === "black-pressure") {
    return "黒検証寄り構成で、バーサク速度に近い盤面をデコイ側も作れるか見る。";
  }

  const preset = getDeckPreset(deckPreset);
  if (preset.name.includes("速攻") || preset.name.includes("HPだけ削る")) {
    return "速攻/直撃寄りのカード密度で、守りながら殴り返すデコイの成立を見る。";
  }
  if (preset.name.includes("殲滅") || preset.name.includes("ロック") || preset.name.includes("手札切れ")) {
    return "除去/妨害寄りの構成で、挑発と囮が相手の攻撃順をずらせるか見る。";
  }
  if (preset.name.includes("ぼうえい") || preset.masterId === "white") {
    return "白系の防御/育成構成で、ホワイトとの差別化を保ちながら長期戦を作れるか見る。";
  }
  return "投稿デッキをデコイ側に当て、既存構築の相性差を探索する。";
}

function formatEntryRow(entry: MasterLabImprovementLoopEntry, rank: number): string {
  const metrics = entry.metrics;
  return [
    rank,
    entry.index,
    escapeMarkdownTableCell(`${entry.deckPreset}<br>${entry.deckName}`),
    metrics.score,
    formatWinLossRate(metrics.decoyWins, metrics.decoyLosses, metrics.decoyWinRate),
    formatWinLossRate(metrics.blackWins, metrics.blackLosses, metrics.blackWinRate),
    formatWinLossRate(metrics.whiteWins, metrics.whiteLosses, metrics.whiteWinRate),
    formatMaybeNumber(metrics.averageOpponentHpOnLoss),
    formatActionRates(metrics),
    formatIssues(metrics),
    entry.judgement,
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatLoopRow(entry: MasterLabImprovementLoopEntry): string {
  const metrics = entry.metrics;
  return [
    entry.index,
    escapeMarkdownTableCell(`${entry.deckPreset}<br>${entry.deckName}<br>${entry.deckMeta}`),
    escapeMarkdownTableCell(entry.hypothesis),
    metrics.score,
    formatWinLossRate(metrics.decoyWins, metrics.decoyLosses, metrics.decoyWinRate),
    formatWinLossRate(metrics.blackWins, metrics.blackLosses, metrics.blackWinRate),
    formatWinLossRate(metrics.whiteWins, metrics.whiteLosses, metrics.whiteWinRate),
    metrics.averageTurns,
    formatMaybeNumber(metrics.averageOpponentHpOnLoss),
    formatActionRates(metrics),
    formatIssues(metrics),
    entry.judgement,
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatDeckMeta(masterId: string | undefined, mode: string | undefined, allowSpecial: boolean): string {
  return [
    masterId ? `master ${masterId}` : "master -",
    mode ?? "built-in",
    allowSpecial ? "special allowed" : "normal only",
  ].join(" / ");
}

function formatActionRates(metrics: Pick<MasterLabImprovementMetrics, "scapegoatRate" | "provokeRate" | "masterAttackRate">): string {
  return [
    `S ${formatPercent(metrics.scapegoatRate)}`,
    `P ${formatPercent(metrics.provokeRate)}`,
    `A ${formatPercent(metrics.masterAttackRate)}`,
  ].join("<br>");
}

function formatIssues(metrics: Pick<MasterLabImprovementMetrics, "failures" | "warnings">): string {
  return `${metrics.failures}F/${metrics.warnings}W`;
}

function formatWinLossRate(wins: number, losses: number, rateValue: number): string {
  return `${wins}-${losses}<br>${formatPercent(rateValue)}`;
}

function formatMaybeNumber(value: number | undefined): string {
  return value === undefined ? "-" : value.toFixed(1);
}

function rate(numerator: number, denominator: number): number {
  return denominator > 0 ? numerator / denominator : 0;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function formatPercent(value: number): string {
  return `${round1(value * 100)}%`;
}

function formatSignedPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${formatPercent(value)}`;
}

function escapeMarkdownTableCell(value: string): string {
  return value.replaceAll("|", "\\|");
}
