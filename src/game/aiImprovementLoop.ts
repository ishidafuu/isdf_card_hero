import {
  compareAiWeightProfiles,
  formatAiWeightComparisonMarkdown,
  type AiWeightComparisonReport,
} from "./aiWeightComparison";
import {
  formatCardAdjustmentSafetyMarkdown,
  runCardAdjustmentSafetyGate,
  type CardAdjustmentSafetyOptions,
  type CardAdjustmentSafetyReport,
} from "./cardAdjustmentSafety";
import {
  analyzeDeckBattleReport,
  formatDeckBattleInsightsMarkdown,
  type DeckBattleInsightsReport,
} from "./deckBattleInsights";
import type { DeckBattleScoringOptions } from "./deckBattleScoring";
import { CPU_AI_PROFILES } from "./cpuAi";

export type AiImprovementPriority = "high" | "medium" | "low";

export interface AiImprovementLoopOptions extends DeckBattleScoringOptions, CardAdjustmentSafetyOptions {
  compareWeights?: boolean;
}

export interface AiImprovementAction {
  priority: AiImprovementPriority;
  title: string;
  reason: string;
  command?: string;
}

export interface AiImprovementLoopReport {
  safety: CardAdjustmentSafetyReport;
  insights: DeckBattleInsightsReport;
  weightComparison?: AiWeightComparisonReport;
  actions: AiImprovementAction[];
}

export function runAiImprovementLoop(options: AiImprovementLoopOptions = {}): AiImprovementLoopReport {
  const safety = runCardAdjustmentSafetyGate({
    suiteId: "smoke",
    maxDecks: 4,
    seedStart: 700,
    count: 1,
    ...options,
    compareWeights: false,
  });
  const insights = analyzeDeckBattleReport(safety.deckBattleReport);
  const weightComparison = options.compareWeights === false
    ? undefined
    : compareAiWeightProfiles({
      suiteId: options.suiteId ?? "smoke",
      maxDecks: options.maxDecks ?? 4,
      seedStart: options.seedStart ?? 700,
      count: options.count ?? 1,
      maxSteps: options.maxSteps,
      maxTurns: options.maxTurns,
      longGameSteps: options.longGameSteps,
      longGameTurns: options.longGameTurns,
      stagnationLimit: options.stagnationLimit,
      firstPlayerMode: options.firstPlayerMode,
      profiles: CPU_AI_PROFILES,
    });

  return {
    safety,
    insights,
    weightComparison,
    actions: buildImprovementActions(safety, insights, weightComparison),
  };
}

export function formatAiImprovementLoopMarkdown(report: AiImprovementLoopReport): string {
  return [
    `# AI改善ループ`,
    ``,
    `## Priority Actions`,
    ``,
    `| Priority | Title | Reason | Command |`,
    `| --- | --- | --- | --- |`,
    ...report.actions.map((action) =>
      `| ${action.priority} | ${action.title} | ${escapeMarkdownTableCell(action.reason)} | ` +
      `${action.command ? `\`${action.command}\`` : "-"} |`,
    ),
    ``,
    `## Safety Gate`,
    ``,
    formatCardAdjustmentSafetyMarkdown(report.safety),
    ``,
    `## Insights`,
    ``,
    formatDeckBattleInsightsMarkdown(report.insights),
    ``,
    ...(report.weightComparison
      ? [
        `## Weight Comparison`,
        ``,
        formatAiWeightComparisonMarkdown(report.weightComparison),
        ``,
      ]
      : []),
  ].join("\n");
}

function buildImprovementActions(
  safety: CardAdjustmentSafetyReport,
  insights: DeckBattleInsightsReport,
  weightComparison: AiWeightComparisonReport | undefined,
): AiImprovementAction[] {
  const actions: AiImprovementAction[] = [];
  const failedChecks = safety.checks.filter((check) => check.status === "fail");
  if (failedChecks.length > 0) {
    actions.push({
      priority: "high",
      title: "セーフティゲート失敗を先に修正",
      reason: failedChecks.map((check) => `${check.id}: ${check.message}`).join("; "),
      command: "npm run safety:card-adjustment",
    });
  }

  const topFocus = insights.problemFocuses[0];
  if (topFocus) {
    actions.push({
      priority: topFocus.reviewWeight >= 300 ? "high" : "medium",
      title: `${topFocus.title}のtrace確認`,
      reason: `${topFocus.count}件 / weight ${topFocus.reviewWeight}`,
      command: "npm run trace:deck-battles",
    });
  }

  const topBias = insights.biasDiagnostics[0];
  if (topBias) {
    actions.push({
      priority: topBias.primaryCause === "mixed" ? "high" : "medium",
      title: "席差/先後差の追加計測",
      reason: `${topBias.deckPreset}: seat ${formatPercent(topBias.seatDelta)}, first ${formatPercent(topBias.firstPlayerDelta)}`,
      command: "npm run score:deck-battles -- --first-player-mode both",
    });
  }

  const whiteCloseout = insights.whiteCloseoutDiagnostics[0];
  if (whiteCloseout) {
    actions.push({
      priority: whiteCloseout.issue === "low_win_rate" ? "high" : "medium",
      title: "白デッキ勝ち切り確認",
      reason: `${whiteCloseout.deckPreset}: ${whiteCloseout.issue}, speed ${whiteCloseout.speedScore}`,
      command: "npm run trace:deck-battles",
    });
  }

  const matchupAdjustment = insights.matchupAdjustments[0];
  if (matchupAdjustment) {
    actions.push({
      priority: "medium",
      title: "相性別重み比較",
      reason: `${matchupAdjustment.deckPreset}: ${matchupAdjustment.focus}を${matchupAdjustment.suggestedProfile}寄りで比較`,
      command: "npm run compare:ai-weights",
    });
  }

  const lowConfidence = insights.confidenceDiagnostics.find((diagnostic) => diagnostic.tier === "low");
  if (lowConfidence) {
    actions.push({
      priority: "medium",
      title: "スコア母数追加",
      reason: `${lowConfidence.deckPreset}: confidence ${lowConfidence.confidenceScore}, games ${lowConfidence.games}`,
      command: "npm run score:deck-battles -- --count 2",
    });
  }

  const riskyComparison = weightComparison?.deltas.find((delta) => delta.failureDelta > 0 || delta.warningDelta > 0);
  if (riskyComparison) {
    actions.push({
      priority: "high",
      title: "重み候補の安全性確認",
      reason: `${riskyComparison.profile}: warning delta ${riskyComparison.warningDelta}, failure delta ${riskyComparison.failureDelta}`,
      command: "npm run compare:ai-weights",
    });
  }

  if (actions.length === 0) {
    actions.push({
      priority: "low",
      title: "追加母数でスコアを固める",
      reason: "安全性と主要診断に大きな問題はないため、core suiteのseedを増やす",
      command: "npm run score:deck-battles -- --suite core --count 2",
    });
  }

  return actions.sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority));
}

function priorityWeight(priority: AiImprovementPriority): number {
  if (priority === "high") {
    return 3;
  }
  if (priority === "medium") {
    return 2;
  }
  return 1;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

function escapeMarkdownTableCell(value: string): string {
  return value.replaceAll("|", "\\|");
}
