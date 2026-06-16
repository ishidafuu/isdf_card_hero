import { getCardName } from "./cards";
import { getDeckPreset, type DeckPresetId } from "./deckPresets";
import { runMasterLabFinalGate, type MasterLabFinalGateOptions, type MasterLabFinalGateResult } from "./masterLabFinalGate";
import type { MasterLabCandidateId, MasterLabEvaluationTuning } from "./masterLab";
import type { PlayerId } from "./types";

export type MasterLabImprovementJudgement = "advance" | "hold" | "reject";
export type MasterLabImprovementDecision = "needs_full_gate" | "continue_deck_loop" | "pivot_to_action_design";
export type MasterLabImprovementPlanId = "deck" | "mixed" | "scapegoat" | "magic_inclusion";
export type MasterLabImprovementExperimentKind = "deck" | "ai_eval" | "hybrid" | "warning_probe";

export interface MasterLabImprovementLoopOptions extends Omit<MasterLabFinalGateOptions, "deckPreset"> {
  plan?: MasterLabImprovementPlanId;
  loopCount?: number;
  deckPresets?: readonly DeckPresetId[];
  experiments?: readonly MasterLabImprovementExperiment[];
}

export interface MasterLabImprovementExperiment {
  id: string;
  kind: MasterLabImprovementExperimentKind;
  label: string;
  deckPreset: DeckPresetId;
  hypothesis: string;
  labActionMargin?: number;
  labEvaluationTuning?: MasterLabEvaluationTuning;
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
  labActionTargetUsage: Record<string, number>;
  magicCardUsage: Record<string, number>;
  scapegoatRate: number;
  allyScapegoatRate: number;
  enemyScapegoatRate: number;
  provokeRate: number;
  masterAttackRate: number;
}

export interface MasterLabImprovementLoopEntry {
  index: number;
  experimentId: string;
  experimentKind: MasterLabImprovementExperimentKind;
  experimentLabel: string;
  deckPreset: DeckPresetId;
  deckName: string;
  deckMeta: string;
  hypothesis: string;
  labActionMargin?: number;
  labEvaluationTuning?: MasterLabEvaluationTuning;
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
const DEFAULT_MASTER_LAB_MAGIC_INCLUSION_TUNING = {
  targetOwnerBias: { enemy: 16 },
} satisfies MasterLabEvaluationTuning;
const DEFAULT_MASTER_LAB_MAGIC_INCLUSION_MARGIN = 12;

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

export const DEFAULT_MASTER_LAB_MIXED_IMPROVEMENT_EXPERIMENTS = [
  deckExperiment("deck_pressure_baseline", "デッキ基準: 通常プレッシャー", "pressure-normal", "前回基準。白相手の安定と黒相手の最低ラインを再確認する。"),
  deckExperiment("deck_black_pressure", "デッキ本命: ブラック検証", "black-pressure", "前回最上位。黒耐性60%が再現するか見る。"),
  deckExperiment("deck_balanced_control", "デッキ比較: 通常バランス", "balanced-normal", "攻撃寄りでない標準構成を比較し、守り過多の弱さを再確認する。"),
  deckExperiment("deck_beatdown_lock", "デッキ控え: ビートダウン&ロック", "submission-pro-no-rare8-black-1403", "前回hold。除去/妨害寄りで白相手に強い形が残るか見る。"),
  deckExperiment("deck_agito_growth", "デッキ控え: アギト育成", "submission-pro-no-rare8-white-1340", "白系育成で黒相手50%が再現するか確認する。"),
  {
    ...deckExperiment("deck_1354_warning_probe", "警告診断: 黒速攻&殲滅", "submission-pro-with-rare8-black-1354", "勝率は高いがwarningが多かったため、長期戦リスクを再確認する。"),
    kind: "warning_probe",
  },
  deckExperiment("deck_direct_damage_probe", "デッキ診断: HP直撃", "submission-pro-with-rare8-black-1328", "直撃密度だけでは勝てない仮説を再確認する。"),
  deckExperiment("deck_defense_probe", "デッキ診断: 極端なぼうえい", "submission-pro-no-rare8-white-1347", "防御密度を上げた場合にデコイがホワイト化しないか見る。"),
  aiExperiment("ai_black_provoke_plus8", "AI評価: 挑発+8 / black-pressure", "black-pressure", { actionBias: { provoke: 8 } }, "黒相手に挑発を少し厚くし、バーサク打点の当たり先を曲げられるか見る。"),
  aiExperiment("ai_black_provoke_plus16", "AI評価: 挑発+16 / black-pressure", "black-pressure", { actionBias: { provoke: 16 } }, "挑発評価を明確に上げ、スケープゴート偏重を緩められるか見る。"),
  aiExperiment("ai_black_provoke_plus24", "AI評価: 挑発+24 / black-pressure", "black-pressure", { actionBias: { provoke: 24 } }, "挑発を強めすぎた時に白相手や長期戦が崩れないか見る。"),
  aiExperiment("ai_black_scapegoat_minus8", "AI評価: スケープゴート-8 / black-pressure", "black-pressure", { actionBias: { scapegoat: -8 } }, "スケープゴート連打を少し抑えても黒耐性が残るか見る。"),
  aiExperiment("ai_black_scapegoat_minus16", "AI評価: スケープゴート-16 / black-pressure", "black-pressure", { actionBias: { scapegoat: -16 } }, "スケープゴート依存を強く抑えた時の勝率低下を測る。"),
  aiExperiment("ai_pressure_provoke_plus16", "AI評価: 挑発+16 / pressure-normal", "pressure-normal", { actionBias: { provoke: 16 } }, "白安定寄りの基準デッキで挑発厚めが黒耐性を足せるか見る。"),
  aiExperiment("ai_pressure_scapegoat_minus8", "AI評価: スケープゴート-8 / pressure-normal", "pressure-normal", { actionBias: { scapegoat: -8 } }, "基準デッキでスケープゴート依存を抑えても勝率が残るか見る。"),
  aiExperiment("ai_pressure_master_attack_minus8", "AI評価: マスター攻撃-8 / pressure-normal", "pressure-normal", { actionBias: { master_attack: -8 } }, "通常攻撃へ逃げる場面を減らし、防御特技を選ばせる価値を見る。"),
  aiExperiment("ai_black_strict_margin12", "AI評価: 特技採用margin+12 / black-pressure", "black-pressure", undefined, "CPU通常手より明確に強い時だけ特技を使わせ、連打リスクを下げる。", 12),
  aiExperiment("ai_pressure_eager_margin_minus8", "AI評価: 特技採用margin-8 / pressure-normal", "pressure-normal", undefined, "特技を早めに切る挙動が黒速攻へ間に合うか見る。", -8),
  hybridExperiment("hybrid_black_provoke16_scapegoat_minus8", "混合: black-pressure / 挑発+16 / スケープゴート-8", "black-pressure", { actionBias: { provoke: 16, scapegoat: -8 } }, "前回本命デッキに、挑発強化とスケープゴート抑制を同時に入れる。"),
  hybridExperiment("hybrid_pressure_provoke16_scapegoat_minus8", "混合: pressure-normal / 挑発+16 / スケープゴート-8", "pressure-normal", { actionBias: { provoke: 16, scapegoat: -8 } }, "白安定を維持しながら黒速攻への受けを厚くする。"),
  hybridExperiment("hybrid_1403_provoke16_scapegoat_minus8", "混合: 1403 / 挑発+16 / スケープゴート-8", "submission-pro-no-rare8-black-1403", { actionBias: { provoke: 16, scapegoat: -8 } }, "妨害寄りデッキで挑発の攻撃順誘導が噛み合うか見る。"),
  hybridExperiment("hybrid_1354_warning_trim", "混合: 1354 / 挑発+16 / スケープゴート-16", "submission-pro-with-rare8-black-1354", { actionBias: { provoke: 16, scapegoat: -16 } }, "warningの多い高勝率候補で、スケープゴート過多を落として安定化するか見る。"),
] as const satisfies readonly MasterLabImprovementExperiment[];

export const DEFAULT_MASTER_LAB_SCAPEGOAT_IMPROVEMENT_EXPERIMENTS = [
  deckExperiment("deck_black_pressure", "基準: black-pressure", "black-pressure", "前回上位。敵スケープゴート解禁後も黒耐性が残るか見る。"),
  aiExperiment("ai_black_strict_margin12", "再確認: 特技採用margin+12", "black-pressure", undefined, "前回最上位の慎重運用を、敵スケープゴート解禁後の基準にする。", 12),
  deckExperiment("deck_beatdown_lock", "再確認: ビートダウン&ロック", "submission-pro-no-rare8-black-1403", "妨害寄りデッキで、敵対象スケープゴートが攻撃順の誘導として働くか見る。"),
  deckExperiment("deck_agito_growth", "再確認: アギト育成", "submission-pro-no-rare8-white-1340", "育成寄り構成で、敵の主力を囮化する価値が出るか見る。"),
  {
    ...deckExperiment("deck_1354_warning_probe", "警告診断: 黒速攻&殲滅", "submission-pro-with-rare8-black-1354", "高勝率だがwarningが出やすい候補で、敵スケープゴートが長期戦リスクを増やすか見る。"),
    kind: "warning_probe",
  },
  aiExperiment("target_black_enemy_plus8", "対象評価: enemy+8 / black-pressure", "black-pressure", { targetOwnerBias: { enemy: 8 } }, "敵モンスターへのスケープゴートを軽く後押しし、実際に選ばれる入口を作る。"),
  aiExperiment("target_black_enemy_plus16", "対象評価: enemy+16 / black-pressure", "black-pressure", { targetOwnerBias: { enemy: 16 } }, "敵対象を明確に評価し、勝率と使用率の両方を見る。"),
  aiExperiment("target_black_enemy_plus24", "対象評価: enemy+24 / black-pressure", "black-pressure", { targetOwnerBias: { enemy: 24 } }, "敵対象を強く押した時に、リーサルを逃す副作用が出るか見る。"),
  aiExperiment("target_black_ally_minus8", "対象評価: ally-8 / black-pressure", "black-pressure", { targetOwnerBias: { ally: -8 } }, "味方保護の過多を少し抑え、敵対象へ自然に寄るか見る。"),
  aiExperiment("target_black_ally_minus16", "対象評価: ally-16 / black-pressure", "black-pressure", { targetOwnerBias: { ally: -16 } }, "味方保護を強めに抑えた場合、防御力が落ちすぎないか測る。"),
  aiExperiment("target_black_enemy16_allyminus8", "対象評価: enemy+16 / ally-8", "black-pressure", { targetOwnerBias: { enemy: 16, ally: -8 } }, "敵対象を伸ばしつつ味方連打を抑え、行動の質を変えられるか見る。"),
  aiExperiment("target_black_enemy24_allyminus16", "対象評価: enemy+24 / ally-16", "black-pressure", { targetOwnerBias: { enemy: 24, ally: -16 } }, "敵対象へ強く寄せた極端条件で、勝率低下の境界を探る。"),
  aiExperiment("target_black_enemy16_margin12", "対象評価: enemy+16 / margin+12", "black-pressure", { targetOwnerBias: { enemy: 16 } }, "慎重採用と敵対象評価を併用し、無駄撃ちを抑えながら質を変える。", 12),
  aiExperiment("target_black_enemy24_margin12", "対象評価: enemy+24 / margin+12", "black-pressure", { targetOwnerBias: { enemy: 24 } }, "敵対象を強く評価しても、CPU通常手を上回る時だけ採用すれば安定するか見る。", 12),
  aiExperiment("target_pressure_enemy16", "対象評価: enemy+16 / pressure-normal", "pressure-normal", { targetOwnerBias: { enemy: 16 } }, "通常プレッシャー構成でも敵対象の価値が再現するか見る。"),
  aiExperiment("target_pressure_enemy24", "対象評価: enemy+24 / pressure-normal", "pressure-normal", { targetOwnerBias: { enemy: 24 } }, "基準デッキで敵対象を強めた時、白相手の勝率を壊さないか見る。"),
  aiExperiment("target_pressure_enemy16_allyminus8", "対象評価: pressure / enemy+16 / ally-8", "pressure-normal", { targetOwnerBias: { enemy: 16, ally: -8 } }, "通常構成で味方保護を減らし、敵対象の実用域を探る。"),
  aiExperiment("target_1403_enemy16", "対象評価: 1403 / enemy+16", "submission-pro-no-rare8-black-1403", { targetOwnerBias: { enemy: 16 } }, "妨害デッキで敵主力の囮化が除去テンポと噛み合うか見る。"),
  aiExperiment("target_1403_enemy24_allyminus8", "対象評価: 1403 / enemy+24 / ally-8", "submission-pro-no-rare8-black-1403", { targetOwnerBias: { enemy: 24, ally: -8 } }, "妨害寄りで敵対象を強め、攻撃順誘導の上限を探る。"),
  aiExperiment("target_1340_enemy16", "対象評価: 1340 / enemy+16", "submission-pro-no-rare8-white-1340", { targetOwnerBias: { enemy: 16 } }, "育成デッキで敵対象がレベル差のやり取りに関与できるか見る。"),
  aiExperiment("target_1354_enemy16_allyminus16", "対象評価: 1354 / enemy+16 / ally-16", "submission-pro-with-rare8-black-1354", { targetOwnerBias: { enemy: 16, ally: -16 } }, "高勝率候補の味方スケープゴート過多を強く落とし、warningが減るか見る。"),
  aiExperiment("target_1354_enemy24_margin12", "対象評価: 1354 / enemy+24 / margin+12", "submission-pro-with-rare8-black-1354", { targetOwnerBias: { enemy: 24 } }, "長期戦候補で慎重採用を足し、敵対象の副作用を抑える。", 12),
  hybridExperiment("hybrid_black_provoke16_enemy16", "混合: 挑発+16 / enemy+16", "black-pressure", { actionBias: { provoke: 16 }, targetOwnerBias: { enemy: 16 } }, "挑発と敵スケープゴートを両方使い、回避型らしい攻撃誘導へ寄せる。"),
  hybridExperiment("hybrid_black_provoke16_enemy24_allyminus8", "混合: 挑発+16 / enemy+24 / ally-8", "black-pressure", { actionBias: { provoke: 16 }, targetOwnerBias: { enemy: 24, ally: -8 } }, "敵対象を強くしつつ挑発も増やし、味方保護一辺倒から脱却できるか見る。"),
] as const satisfies readonly MasterLabImprovementExperiment[];

export const DEFAULT_MASTER_LAB_MAGIC_INCLUSION_EXPERIMENTS = [
  magicInclusionExperiment("magic_baseline_black_pressure", "基準: black-pressure", "black-pressure", "前回基準。マジック差し替え前の勝率、警告、通常マジック使用回数を再確認する。"),
  magicInclusionExperiment("magic_stable_control", "投入: 安定マジック", "master-lab-decoy-magic-stable", "リ・シャッフルと盾を増やし、デコイの受けを継戦力へ変換できるか見る。"),
  magicInclusionExperiment("magic_removal", "投入: 除去マジック", "master-lab-decoy-magic-removal", "仮想機会の多かった除去札で、敵盤面を直接減らして黒速攻を止められるか見る。"),
  magicInclusionExperiment("magic_burst", "投入: バースト", "master-lab-decoy-magic-burst", "受けた後の反撃速度を上げ、デコイが守るだけで終わらない形になるか見る。"),
  magicInclusionExperiment("magic_tech", "投入: テック", "master-lab-decoy-magic-tech", "誘惑、ヒーリング、ロストーン、リターンで状況対応力が勝率に出るか見る。"),
  magicInclusionExperiment("magic_finisher_thunder", "投入: サンダー1枚", "master-lab-decoy-magic-finisher", "サンダーを1枚だけ入れ、勝ち切り札としての伸びとピーキーな副作用を分けて見る。"),
] as const satisfies readonly MasterLabImprovementExperiment[];

export function runMasterLabImprovementLoop(
  options: MasterLabImprovementLoopOptions = {},
): MasterLabImprovementLoopReport {
  const {
    deckPresets: explicitDeckPresets,
    experiments: explicitExperiments,
    loopCount: explicitLoopCount,
    plan = "mixed",
    ...finalGateOptions
  } = options;
  const candidateId = finalGateOptions.candidateId ?? DEFAULT_CANDIDATE_ID;
  const gamesPerMatchup = finalGateOptions.gamesPerMatchup ?? DEFAULT_GAMES_PER_MATCHUP;
  const experiments = selectExperiments({
    explicitDeckPresets,
    explicitExperiments,
    explicitLoopCount,
    plan,
  });

  const rawEntries = experiments.map((experiment, index): Omit<MasterLabImprovementLoopEntry, "judgement" | "nextAction"> => {
    const result = runMasterLabFinalGate({
      ...finalGateOptions,
      candidateId,
      gamesPerMatchup,
      deckPreset: experiment.deckPreset,
      labActionMargin: experiment.labActionMargin ?? finalGateOptions.labActionMargin,
      labEvaluationTuning: experiment.labEvaluationTuning ?? finalGateOptions.labEvaluationTuning,
      includeGameHistory: true,
      historyLimit: finalGateOptions.historyLimit ?? 8,
    });
    const preset = getDeckPreset(experiment.deckPreset);
    return {
      index: index + 1,
      experimentId: experiment.id,
      experimentKind: experiment.kind,
      experimentLabel: experiment.label,
      deckPreset: experiment.deckPreset,
      deckName: preset.name,
      deckMeta: formatDeckMeta(preset.masterId, preset.mode, preset.allowSpecial),
      hypothesis: experiment.hypothesis,
      labActionMargin: experiment.labActionMargin,
      labEvaluationTuning: experiment.labEvaluationTuning,
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
  const baseline = entries.find((entry) => entry.experimentId === "deck_pressure_baseline")
    ?? entries.find((entry) => entry.experimentId === "deck_black_pressure")
    ?? entries.find((entry) => entry.deckPreset === "pressure-normal")
    ?? entries[0];
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
    "## Summary",
    "",
    ...formatSummaryBullets(report),
    "",
    "## Next Loop Proposal",
    "",
    ...formatNextLoopProposal(report),
    "",
    "## Loop Schedule",
    "",
    "| Loop | Kind | Experiment | Deck | AI Eval | Hypothesis |",
    "| ---: | --- | --- | --- | --- | --- |",
    ...report.entries.map(formatScheduleRow),
    "",
    "## Top Candidates",
    "",
    "| Rank | Loop | Deck | Score | Overall | vs Black | vs White | Loss Opp HP | Usage | Magic | Issues | Judgement |",
    "| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |",
    ...report.rankedEntries.slice(0, 5).map((entry, rank) => formatEntryRow(entry, rank + 1)),
    "",
    "## Loop Results",
    "",
    "| Loop | Deck | Hypothesis | Score | Overall | vs Black | vs White | Avg Turns | Loss Opp HP | Action Usage | Magic | Issues | Judgement |",
    "| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |",
    ...report.entries.map(formatLoopRow),
    "",
    "## Loop Notes",
    "",
    ...report.entries.flatMap(formatLoopNote),
    "## Reading",
    "",
    "- `Overall` はミラーを除いたデコイ側の勝率。白/黒それぞれを相手にした両座席の合算を見る。",
    "- `Loss Opp HP` はデコイ敗北時の相手マスター残HP平均。低いほど惜敗、高いほど押し切られている。",
    "- `Usage` の `S ... (E ...)` は、S がMaster Lab特技内のスケープゴート率、E がスケープゴート内の敵対象率。",
    "- `Magic` は通常マジックカードとして実際に使われた上位カード。Master Lab特技は含めない。",
    "- このループはスクリーニングであり、上位候補は中母数または100戦マトリクスで再確認する。",
  ].join("\n");
}

function formatSummaryBullets(report: MasterLabImprovementLoopReport): string[] {
  const totalWarnings = report.entries.reduce((total, entry) => total + entry.metrics.warnings, 0);
  const totalFailures = report.entries.reduce((total, entry) => total + entry.metrics.failures, 0);
  const totalGames = report.entries.reduce((total, entry) => total + entry.metrics.games, 0);
  const stableBlackCandidates = report.entries.filter((entry) =>
    entry.metrics.failures === 0 &&
    entry.metrics.warnings <= 1 &&
    entry.metrics.blackWinRate >= 0.5,
  );
  const highRateWarning = report.entries
    .filter((entry) => entry.metrics.decoyWinRate >= report.best.metrics.decoyWinRate && entry.metrics.warnings > report.best.metrics.warnings)
    .sort((a, b) => b.metrics.warnings - a.metrics.warnings || b.metrics.decoyWinRate - a.metrics.decoyWinRate)[0];

  const bullets = [
    `${report.loopCount}ループ / ${totalGames}戦スクリーニング。failure は${totalFailures}、warning は${totalWarnings}。`,
    `ミラーを除くデコイ側の最高スコアは \`${report.best.experimentId}\`（${report.best.experimentLabel}）の score ${report.best.metrics.score}。overall ${formatPercent(report.best.metrics.decoyWinRate)}、vs Black ${formatPercent(report.best.metrics.blackWinRate)}。`,
    `最上位の敵スケープゴート率は ${formatPercent(report.best.metrics.enemyScapegoatRate)}（スケープゴート内比率）。味方保護だけで勝っているのか、敵対象で戦い方が変わったのかを次回判断材料にする。`,
    `基準にした \`${report.baseline.experimentId}\` は overall ${formatPercent(report.baseline.metrics.decoyWinRate)}、vs Black ${formatPercent(report.baseline.metrics.blackWinRate)}。差分は black ${formatSignedPercent(report.best.metrics.blackWinRate - report.baseline.metrics.blackWinRate)}、overall ${formatSignedPercent(report.best.metrics.decoyWinRate - report.baseline.metrics.decoyWinRate)}。`,
    `vs Black 50%以上かつ warning 1件以下の候補は ${stableBlackCandidates.length} 件。横展開より、上位候補の中母数再検証に進む段階。`,
  ];

  if (highRateWarning) {
    bullets.push(
      `\`${highRateWarning.deckPreset}\` は overall ${formatPercent(highRateWarning.metrics.decoyWinRate)} だが warning ${highRateWarning.metrics.warnings} 件。勝率だけなら目立つが、長期戦リスクを先に潰す必要がある。`,
    );
  }
  bullets.push("中間検証でもスケープゴート率80%超かつ敵対象率5%未満が続くなら、単なる味方保護マスターに戻っているため、評価式より特技設計側の見直しを優先する。");

  return bullets.map((bullet) => `- ${bullet}`);
}

function formatNextLoopProposal(report: MasterLabImprovementLoopReport): string[] {
  const stableTop = report.rankedEntries.filter((entry) =>
    entry.metrics.failures === 0 &&
    entry.metrics.warnings <= 1 &&
    entry.metrics.decoyWinRate >= 0.5,
  );
  const best = report.best;
  const shouldConfirmTop = best.metrics.blackWinRate >= 0.5 && best.metrics.warnings <= 1;
  const shouldPivotToAiEval = report.rankedEntries.slice(0, 5).every((entry) =>
    entry.experimentKind === "deck" || (entry.metrics.scapegoatRate >= 0.8 && entry.metrics.enemyScapegoatRate < 0.05),
  );
  const shouldProbeEnemyScapegoat = best.metrics.enemyScapegoatRate < 0.05;
  const proposal = shouldProbeEnemyScapegoat
    ? "敵対象スケープゴートの使用が薄い。次は敵に付けた時だけ価値が出る状況評価、または新特技案へ寄せる。"
    : shouldConfirmTop
      ? "上位候補の再現性確認を優先する。次は候補数を減らし、games-per-matchup を 20-30 に上げる。"
      : shouldPivotToAiEval
      ? "デッキ差だけでは伸びが鈍い。次はデッキを固定し、挑発/スケープゴート評価補正だけを20候補ほど比較する。"
      : "混合ループをもう一度回す。上位のデッキと評価補正を掛け合わせ、外れた軸は減らす。";

  const selected = stableTop.slice(0, 4).map((entry) =>
    `\`${entry.experimentId}\` (${entry.deckPreset}, score ${entry.metrics.score})`,
  );

  return [
    `- 提案: ${proposal}`,
    `- 次回候補: ${selected.length > 0 ? selected.join(" / ") : `\`${best.experimentId}\``}`,
    "- 目安: スクリーニング継続なら20-24ループ、本採用前の再現性確認なら3-5候補に絞って各100-150戦。",
    "- 分岐: 上位でも敵スケープゴート率が5%未満なら、敵対象バイアスをさらに強めるより、敵に付けた時だけ価値が出る新特技案へ切り替える。",
  ];
}

function deckExperiment(
  id: string,
  label: string,
  deckPreset: DeckPresetId,
  hypothesis: string,
): MasterLabImprovementExperiment {
  return {
    id,
    kind: "deck",
    label,
    deckPreset,
    hypothesis,
  };
}

function magicInclusionExperiment(
  id: string,
  label: string,
  deckPreset: DeckPresetId,
  hypothesis: string,
): MasterLabImprovementExperiment {
  return {
    ...deckExperiment(id, label, deckPreset, hypothesis),
    labActionMargin: DEFAULT_MASTER_LAB_MAGIC_INCLUSION_MARGIN,
    labEvaluationTuning: DEFAULT_MASTER_LAB_MAGIC_INCLUSION_TUNING,
  };
}

function aiExperiment(
  id: string,
  label: string,
  deckPreset: DeckPresetId,
  labEvaluationTuning: MasterLabEvaluationTuning | undefined,
  hypothesis: string,
  labActionMargin?: number,
): MasterLabImprovementExperiment {
  return {
    id,
    kind: "ai_eval",
    label,
    deckPreset,
    hypothesis,
    ...(labActionMargin !== undefined ? { labActionMargin } : {}),
    ...(labEvaluationTuning ? { labEvaluationTuning } : {}),
  };
}

function hybridExperiment(
  id: string,
  label: string,
  deckPreset: DeckPresetId,
  labEvaluationTuning: MasterLabEvaluationTuning,
  hypothesis: string,
): MasterLabImprovementExperiment {
  return {
    id,
    kind: "hybrid",
    label,
    deckPreset,
    hypothesis,
    labEvaluationTuning,
  };
}

function selectExperiments(options: {
  explicitDeckPresets: readonly DeckPresetId[] | undefined;
  explicitExperiments: readonly MasterLabImprovementExperiment[] | undefined;
  explicitLoopCount: number | undefined;
  plan: MasterLabImprovementPlanId;
}): readonly MasterLabImprovementExperiment[] {
  const source = selectExperimentSource(options);
  const loopCount = Number.isInteger(options.explicitLoopCount) && options.explicitLoopCount !== undefined
    ? options.explicitLoopCount
    : source.length;
  if (loopCount <= 0) {
    throw new Error("loopCount must be greater than 0");
  }
  if (loopCount > source.length) {
    throw new Error(`loopCount ${loopCount} exceeds selected experiment count ${source.length}`);
  }
  return source.slice(0, loopCount);
}

function selectExperimentSource(options: {
  explicitDeckPresets: readonly DeckPresetId[] | undefined;
  explicitExperiments: readonly MasterLabImprovementExperiment[] | undefined;
  plan: MasterLabImprovementPlanId;
}): readonly MasterLabImprovementExperiment[] {
  if (options.explicitExperiments && options.explicitExperiments.length > 0) {
    return options.explicitExperiments;
  }
  if (options.explicitDeckPresets && options.explicitDeckPresets.length > 0) {
    return options.explicitDeckPresets.map((deckPreset) =>
      deckExperiment(`deck_${deckPreset}`, `デッキ指定: ${deckPreset}`, deckPreset, buildHypothesis(deckPreset)),
    );
  }
  if (options.plan === "deck") {
    return DEFAULT_MASTER_LAB_IMPROVEMENT_DECK_PRESETS.map((deckPreset) =>
      deckExperiment(`deck_${deckPreset}`, `デッキ探索: ${deckPreset}`, deckPreset, buildHypothesis(deckPreset)),
    );
  }
  if (options.plan === "scapegoat") {
    return DEFAULT_MASTER_LAB_SCAPEGOAT_IMPROVEMENT_EXPERIMENTS;
  }
  if (options.plan === "magic_inclusion") {
    return DEFAULT_MASTER_LAB_MAGIC_INCLUSION_EXPERIMENTS;
  }
  return DEFAULT_MASTER_LAB_MIXED_IMPROVEMENT_EXPERIMENTS;
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
  const targetUsage = result.summary.labActionTargetUsage;
  const labDecisionCount = result.summary.labDecisionCount;
  const scapegoatUsage = usage.scapegoat ?? 0;
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
    labActionTargetUsage: targetUsage,
    magicCardUsage: result.summary.magicCardUsage,
    scapegoatRate: rate(scapegoatUsage, labDecisionCount),
    allyScapegoatRate: rate(targetUsage["scapegoat:ally"] ?? 0, scapegoatUsage),
    enemyScapegoatRate: rate(targetUsage["scapegoat:enemy"] ?? 0, scapegoatUsage),
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
  const enemyScapegoatBonus = clamp(metrics.enemyScapegoatRate / 0.18, 0, 1) * 2;
  const longGamePenalty = Math.max(0, metrics.averageTurns - 34) * 0.25 + Math.max(0, metrics.mirrorMaxTurns - 34) * 0.2;
  const safetyPenalty = metrics.failures * 100 + metrics.warnings * 5 + metrics.mirrorWarnings * 2;

  return round1(
    metrics.decoyWinRate * 38 +
    metrics.blackWinRate * 34 +
    metrics.whiteWinRate * 16 +
    lossQuality +
    winQuality +
    enemyScapegoatBonus -
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
      summary: `${best.experimentLabel} が基準より伸びた。小母数の上振れを排除するため、まず上位候補を100戦マトリクスで再検証する。`,
      reasons: [
        `${best.experimentId}: ${best.deckPreset} / overall ${formatPercent(best.metrics.decoyWinRate)} / vs Black ${formatPercent(best.metrics.blackWinRate)} / score ${best.metrics.score}`,
        `baseline ${baseline.experimentId}: ${baseline.deckPreset} / overall ${formatPercent(baseline.metrics.decoyWinRate)} / vs Black ${formatPercent(baseline.metrics.blackWinRate)}`,
        `black gain ${formatSignedPercent(blackGain)}, overall gain ${formatSignedPercent(overallGain)}`,
      ],
      nextSteps: [
        `${best.experimentId} を games-per-matchup 100 で再実行する。`,
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
      `${best.experimentId}: ${best.deckPreset} / overall ${formatPercent(best.metrics.decoyWinRate)} / vs Black ${formatPercent(best.metrics.blackWinRate)}`,
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
    escapeMarkdownTableCell(`${entry.experimentId}<br>${entry.experimentLabel}<br>${entry.deckPreset}`),
    metrics.score,
    formatWinLossRate(metrics.decoyWins, metrics.decoyLosses, metrics.decoyWinRate),
    formatWinLossRate(metrics.blackWins, metrics.blackLosses, metrics.blackWinRate),
    formatWinLossRate(metrics.whiteWins, metrics.whiteLosses, metrics.whiteWinRate),
    formatMaybeNumber(metrics.averageOpponentHpOnLoss),
    formatActionRates(metrics),
    formatMagicUsage(metrics.magicCardUsage),
    formatIssues(metrics),
    entry.judgement,
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatLoopRow(entry: MasterLabImprovementLoopEntry): string {
  const metrics = entry.metrics;
  return [
    entry.index,
    escapeMarkdownTableCell(`${entry.experimentId}<br>${entry.experimentLabel}<br>${entry.deckPreset}<br>${entry.deckMeta}`),
    escapeMarkdownTableCell(entry.hypothesis),
    metrics.score,
    formatWinLossRate(metrics.decoyWins, metrics.decoyLosses, metrics.decoyWinRate),
    formatWinLossRate(metrics.blackWins, metrics.blackLosses, metrics.blackWinRate),
    formatWinLossRate(metrics.whiteWins, metrics.whiteLosses, metrics.whiteWinRate),
    metrics.averageTurns,
    formatMaybeNumber(metrics.averageOpponentHpOnLoss),
    formatActionRates(metrics),
    formatMagicUsage(metrics.magicCardUsage),
    formatIssues(metrics),
    entry.judgement,
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatScheduleRow(entry: MasterLabImprovementLoopEntry): string {
  return [
    entry.index,
    entry.experimentKind,
    escapeMarkdownTableCell(`${entry.experimentId}<br>${entry.experimentLabel}`),
    escapeMarkdownTableCell(`${entry.deckPreset}<br>${entry.deckName}`),
    formatExperimentTuning(entry),
    escapeMarkdownTableCell(entry.hypothesis),
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatLoopNote(entry: MasterLabImprovementLoopEntry): string[] {
  const metrics = entry.metrics;
  return [
    `### Loop ${entry.index}: ${entry.experimentLabel}`,
    "",
    `- 対象: \`${entry.deckPreset}\`（${entry.deckMeta}）。${entry.hypothesis}`,
    `- AI評価: ${formatExperimentTuning(entry)}`,
    `- 結果: score ${metrics.score}、overall ${formatWinLossInline(metrics.decoyWins, metrics.decoyLosses, metrics.decoyWinRate)}、vs Black ${formatWinLossInline(metrics.blackWins, metrics.blackLosses, metrics.blackWinRate)}、vs White ${formatWinLossInline(metrics.whiteWins, metrics.whiteLosses, metrics.whiteWinRate)}、${formatIssues(metrics)}。`,
    `- 読み解き: ${describeMatchupShape(entry)}`,
    `- 特技傾向: ${describeActionShape(metrics)}`,
    `- マジック使用: ${formatMagicUsageText(metrics.magicCardUsage)}`,
    `- 次アクション: ${entry.nextAction}`,
    "",
  ];
}

function describeMatchupShape(entry: MasterLabImprovementLoopEntry): string {
  const metrics = entry.metrics;
  const notes: string[] = [];

  if (metrics.failures > 0) {
    notes.push("failure が出ているため、勝率以前に安全性確認が必要。");
  } else if (metrics.warnings >= 3) {
    notes.push("勝ち星があっても warning が多く、長期戦または停滞のリスクが評価を下げている。");
  } else if (metrics.warnings > 0) {
    notes.push("大きく壊れてはいないが、警告seedは中母数検証前にログ確認したい。");
  } else {
    notes.push("自動対戦上の安全性はこの小母数では問題なし。");
  }

  if (metrics.blackWinRate >= 0.55 && metrics.whiteWinRate >= 0.5) {
    notes.push("黒速攻に押し負けず、白相手にも最低限の勝ち筋を残している。");
  } else if (metrics.blackWinRate >= 0.5 && metrics.whiteWinRate < 0.5) {
    notes.push("黒相手の受けは見えるが、白相手の盤面制圧にはやや押されている。");
  } else if (metrics.blackWinRate < 0.35 && metrics.whiteWinRate >= 0.5) {
    notes.push("白相手には戦える一方、主目的の黒速攻対策としては弱い。");
  } else if (metrics.blackWinRate < 0.35 && metrics.whiteWinRate < 0.35) {
    notes.push("白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。");
  } else if (metrics.decoyWinRate >= 0.5) {
    notes.push("全体では五分以上だが、黒相手の再現性はまだ足りない。");
  } else {
    notes.push("勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。");
  }

  if (metrics.averageOpponentHpOnLoss !== undefined) {
    if (metrics.averageOpponentHpOnLoss <= 4) {
      notes.push(`負け試合の相手残HP平均は ${metrics.averageOpponentHpOnLoss.toFixed(1)} で、惜敗寄り。`);
    } else if (metrics.averageOpponentHpOnLoss >= 6) {
      notes.push(`負け試合の相手残HP平均は ${metrics.averageOpponentHpOnLoss.toFixed(1)} で、押し切られ方が重い。`);
    } else {
      notes.push(`負け試合の相手残HP平均は ${metrics.averageOpponentHpOnLoss.toFixed(1)} で、中程度の負け方。`);
    }
  }

  return notes.join(" ");
}

function describeActionShape(metrics: MasterLabImprovementMetrics): string {
  const notes: string[] = [];

  if (metrics.scapegoatRate >= 0.85) {
    notes.push(`スケープゴート率 ${formatPercent(metrics.scapegoatRate)} はかなり高く、守り先の選別が甘い可能性がある。`);
  } else if (metrics.scapegoatRate >= 0.8) {
    notes.push(`スケープゴート率 ${formatPercent(metrics.scapegoatRate)} は高めで、受けの主軸になっている。`);
  } else {
    notes.push(`スケープゴート率 ${formatPercent(metrics.scapegoatRate)} は比較的抑えられている。`);
  }

  if (metrics.enemyScapegoatRate >= 0.18) {
    notes.push(`敵スケープゴート率 ${formatPercent(metrics.enemyScapegoatRate)} は十分に出ており、味方保護とは違う攻撃誘導が発生している。`);
  } else if (metrics.enemyScapegoatRate >= 0.05) {
    notes.push(`敵スケープゴート率 ${formatPercent(metrics.enemyScapegoatRate)} は少量だが観測できる。`);
  } else {
    notes.push(`敵スケープゴート率 ${formatPercent(metrics.enemyScapegoatRate)} はほぼ出ておらず、実質は味方保護に寄っている。`);
  }

  if (metrics.provokeRate >= 0.16) {
    notes.push(`挑発率 ${formatPercent(metrics.provokeRate)} は高めで、攻撃順の誘導も使えている。`);
  } else if (metrics.provokeRate <= 0.1) {
    notes.push(`挑発率 ${formatPercent(metrics.provokeRate)} は低く、黒の高打点を曲げる役割が薄い。`);
  } else {
    notes.push(`挑発率 ${formatPercent(metrics.provokeRate)} は中程度。`);
  }

  if (metrics.masterAttackRate >= 0.15) {
    notes.push(`マスター攻撃率 ${formatPercent(metrics.masterAttackRate)} が高く、特技より通常攻撃へ逃げる場面が多い。`);
  } else if (metrics.masterAttackRate <= 0.03) {
    notes.push(`マスター攻撃率 ${formatPercent(metrics.masterAttackRate)} は低く、防御特技にかなり寄っている。`);
  }

  return notes.join(" ");
}

function formatDeckMeta(masterId: string | undefined, mode: string | undefined, allowSpecial: boolean): string {
  return [
    masterId ? `master ${masterId}` : "master -",
    mode ?? "built-in",
    allowSpecial ? "special allowed" : "normal only",
  ].join(" / ");
}

function formatActionRates(metrics: Pick<MasterLabImprovementMetrics, "scapegoatRate" | "enemyScapegoatRate" | "provokeRate" | "masterAttackRate">): string {
  return [
    `S ${formatPercent(metrics.scapegoatRate)} (E ${formatPercent(metrics.enemyScapegoatRate)})`,
    `P ${formatPercent(metrics.provokeRate)}`,
    `A ${formatPercent(metrics.masterAttackRate)}`,
  ].join("<br>");
}

function formatMagicUsage(usage: Record<string, number>): string {
  const top = topMagicUsage(usage, 4).map(({ cardId, count }) => `${getCardName(cardId)} ${count}`);
  return top.length > 0 ? top.join("<br>") : "-";
}

function formatMagicUsageText(usage: Record<string, number>): string {
  const top = topMagicUsage(usage, 6).map(({ cardId, count }) => `${getCardName(cardId)} ${count}回`);
  return top.length > 0 ? top.join(" / ") : "通常マジック使用なし";
}

function topMagicUsage(usage: Record<string, number>, limit: number): Array<{ cardId: string; count: number }> {
  return Object.entries(usage ?? {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([cardId, count]) => ({ cardId, count }));
}

function formatExperimentTuning(
  entry: Pick<MasterLabImprovementLoopEntry, "labActionMargin" | "labEvaluationTuning">,
): string {
  const parts: string[] = [];
  if (entry.labActionMargin !== undefined) {
    parts.push(`margin ${formatSigned(entry.labActionMargin)}`);
  }
  const bias = entry.labEvaluationTuning?.actionBias;
  if (bias) {
    parts.push(
      ...Object.entries(bias)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([actionId, value]) => `${actionId} ${formatSigned(value ?? 0)}`),
    );
  }
  const multiplier = entry.labEvaluationTuning?.actionMultiplier;
  if (multiplier) {
    parts.push(
      ...Object.entries(multiplier)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([actionId, value]) => `${actionId} x${value}`),
    );
  }
  const targetBias = entry.labEvaluationTuning?.targetOwnerBias;
  if (targetBias) {
    parts.push(
      ...Object.entries(targetBias)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([relation, value]) => `target ${relation} ${formatSigned(value ?? 0)}`),
    );
  }
  return parts.length > 0 ? parts.join("<br>") : "baseline";
}

function formatIssues(metrics: Pick<MasterLabImprovementMetrics, "failures" | "warnings">): string {
  return `${metrics.failures}F/${metrics.warnings}W`;
}

function formatWinLossRate(wins: number, losses: number, rateValue: number): string {
  return `${wins}-${losses}<br>${formatPercent(rateValue)}`;
}

function formatWinLossInline(wins: number, losses: number, rateValue: number): string {
  return `${wins}-${losses} / ${formatPercent(rateValue)}`;
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

function formatSigned(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function escapeMarkdownTableCell(value: string): string {
  return value.replaceAll("|", "\\|");
}
