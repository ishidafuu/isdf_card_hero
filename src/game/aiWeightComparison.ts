import { CPU_AI_PROFILES, type CpuAiProfile } from "./cpuAi";
import {
  formatDeckBattleScoringReport,
  runDeckBattleScoring,
  type DeckBattleScoringOptions,
  type DeckBattleScoringReport,
} from "./deckBattleScoring";

export interface AiWeightComparisonOptions extends Omit<DeckBattleScoringOptions, "aiProfile"> {
  profiles?: readonly CpuAiProfile[];
}

export interface AiWeightProfileSummary {
  profile: CpuAiProfile;
  games: number;
  failures: number;
  warnings: number;
  averageSteps: number;
  averageTurns: number;
  topDeckPreset?: string;
  topBattleScore?: number;
  topWinPointRate?: number;
}

export interface AiWeightProfileDelta {
  profile: CpuAiProfile;
  baselineProfile: CpuAiProfile;
  warningDelta: number;
  failureDelta: number;
  averageStepDelta: number;
  topBattleScoreDelta: number;
}

export interface AiWeightComparisonReport {
  baselineProfile: CpuAiProfile;
  summaries: AiWeightProfileSummary[];
  deltas: AiWeightProfileDelta[];
  reports: Record<CpuAiProfile, DeckBattleScoringReport>;
}

export function compareAiWeightProfiles(options: AiWeightComparisonOptions = {}): AiWeightComparisonReport {
  const profiles = [...new Set(options.profiles ?? CPU_AI_PROFILES)] as CpuAiProfile[];
  if (profiles.length === 0) {
    throw new Error("At least one AI profile is required");
  }

  const reports = Object.fromEntries(
    profiles.map((profile) => [profile, runDeckBattleScoring({ ...options, aiProfile: profile })]),
  ) as Record<CpuAiProfile, DeckBattleScoringReport>;
  const summaries = profiles.map((profile) => toProfileSummary(profile, reports[profile]));
  const baselineProfile = profiles[0];
  const baseline = summaries[0];
  const deltas = summaries.slice(1).map((summary) => ({
    profile: summary.profile,
    baselineProfile,
    warningDelta: summary.warnings - baseline.warnings,
    failureDelta: summary.failures - baseline.failures,
    averageStepDelta: round(summary.averageSteps - baseline.averageSteps, 1),
    topBattleScoreDelta: round((summary.topBattleScore ?? 0) - (baseline.topBattleScore ?? 0), 1),
  }));

  return {
    baselineProfile,
    summaries,
    deltas,
    reports,
  };
}

export function formatAiWeightComparisonMarkdown(report: AiWeightComparisonReport): string {
  return [
    `# AI重みプロファイル比較`,
    ``,
    `Baseline: ${report.baselineProfile}`,
    ``,
    `## Summary`,
    ``,
    `| Profile | Games | Failures | Warnings | Avg steps | Avg turns | Top deck | Top battle | Top win point |`,
    `| --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |`,
    ...report.summaries.map((summary) =>
      `| ${summary.profile} | ${summary.games} | ${summary.failures} | ${summary.warnings} | ` +
      `${summary.averageSteps} | ${summary.averageTurns} | ${summary.topDeckPreset ?? "-"} | ` +
      `${summary.topBattleScore ?? "-"} | ${formatPercent(summary.topWinPointRate ?? 0)} |`,
    ),
    ``,
    `## Delta`,
    ``,
    `| Profile | Warning delta | Failure delta | Avg step delta | Top battle delta |`,
    `| --- | ---: | ---: | ---: | ---: |`,
    ...report.deltas.map((delta) =>
      `| ${delta.profile} | ${delta.warningDelta} | ${delta.failureDelta} | ${delta.averageStepDelta} | ${delta.topBattleScoreDelta} |`,
    ),
    ``,
    `## Raw Reports`,
    ``,
    ...Object.values(report.reports).flatMap((rawReport) => [
      `### ${rawReport.options.aiProfile}`,
      ``,
      "```text",
      formatDeckBattleScoringReport(rawReport, 8),
      "```",
      ``,
    ]),
  ].join("\n");
}

function toProfileSummary(profile: CpuAiProfile, report: DeckBattleScoringReport): AiWeightProfileSummary {
  const topDeck = report.decks[0];
  return {
    profile,
    games: report.summary.games,
    failures: report.summary.failures,
    warnings: report.summary.warnings,
    averageSteps: report.summary.averageSteps,
    averageTurns: report.summary.averageTurns,
    topDeckPreset: topDeck?.deckPreset,
    topBattleScore: topDeck?.battleScore,
    topWinPointRate: topDeck?.winPointRate,
  };
}

function formatPercent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

function round(value: number, digits = 0): number {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}
