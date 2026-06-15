import { CPU_AI_PROFILES, type CpuAiProfile } from "./cpuAi";
import {
  formatDeckBattleScoringReport,
  runDeckBattleScoring,
  type DeckBattleScoringOptions,
  type DeckBattleScoringReport,
} from "./deckBattleScoring";
import type { DeckSubmissionPresetId } from "./deckPresets";

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

export interface AiWeightDeckDelta {
  deckPreset: DeckSubmissionPresetId;
  profile: CpuAiProfile;
  baselineProfile: CpuAiProfile;
  battleScoreDelta: number;
  winPointRateDelta: number;
  speedScoreDelta: number;
  stabilityScoreDelta: number;
}

export interface AiWeightComparisonReport {
  baselineProfile: CpuAiProfile;
  summaries: AiWeightProfileSummary[];
  deltas: AiWeightProfileDelta[];
  deckDeltas: AiWeightDeckDelta[];
  reports: Partial<Record<CpuAiProfile, DeckBattleScoringReport>>;
}

export function compareAiWeightProfiles(options: AiWeightComparisonOptions = {}): AiWeightComparisonReport {
  const profiles = [...new Set(options.profiles ?? CPU_AI_PROFILES)] as CpuAiProfile[];
  if (profiles.length === 0) {
    throw new Error("At least one AI profile is required");
  }

  const reports = Object.fromEntries(
    profiles.map((profile) => [profile, runDeckBattleScoring({ ...options, aiProfile: profile })]),
  ) as Partial<Record<CpuAiProfile, DeckBattleScoringReport>>;
  const summaries = profiles.map((profile) => toProfileSummary(profile, requireReport(reports, profile)));
  const baselineProfile = profiles[0];
  const baseline = summaries[0];
  const baselineReport = requireReport(reports, baselineProfile);
  const deltas = summaries.slice(1).map((summary) => ({
    profile: summary.profile,
    baselineProfile,
    warningDelta: summary.warnings - baseline.warnings,
    failureDelta: summary.failures - baseline.failures,
    averageStepDelta: round(summary.averageSteps - baseline.averageSteps, 1),
    topBattleScoreDelta: round((summary.topBattleScore ?? 0) - (baseline.topBattleScore ?? 0), 1),
  }));
  const deckDeltas = buildDeckDeltas(baselineProfile, baselineReport, profiles.slice(1), reports);

  return {
    baselineProfile,
    summaries,
    deltas,
    deckDeltas,
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
    `## Deck Delta Grid`,
    ``,
    `| Deck | Profile | Battle delta | Win point delta | Speed delta | Stable delta |`,
    `| --- | --- | ---: | ---: | ---: | ---: |`,
    ...report.deckDeltas.map((delta) =>
      `| ${delta.deckPreset} | ${delta.profile} | ${delta.battleScoreDelta} | ` +
      `${formatSignedPercent(delta.winPointRateDelta)} | ${delta.speedScoreDelta} | ${delta.stabilityScoreDelta} |`,
    ),
    ``,
    `## Raw Reports`,
    ``,
    ...report.summaries.flatMap((summary) => {
      const rawReport = report.reports[summary.profile];
      return rawReport
        ? [
          `### ${rawReport.options.aiProfile}`,
          ``,
          "```text",
          formatDeckBattleScoringReport(rawReport, 8),
          "```",
          ``,
        ]
        : [];
    }),
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

function buildDeckDeltas(
  baselineProfile: CpuAiProfile,
  baselineReport: DeckBattleScoringReport,
  comparedProfiles: readonly CpuAiProfile[],
  reports: Partial<Record<CpuAiProfile, DeckBattleScoringReport>>,
): AiWeightDeckDelta[] {
  const baselineByDeck = new Map(baselineReport.decks.map((deck) => [deck.deckPreset, deck]));
  return comparedProfiles.flatMap((profile) =>
    (reports[profile]?.decks ?? []).flatMap((deck) => {
      const baseline = baselineByDeck.get(deck.deckPreset);
      if (!baseline) {
        return [];
      }
      return [{
        deckPreset: deck.deckPreset,
        profile,
        baselineProfile,
        battleScoreDelta: round(deck.battleScore - baseline.battleScore, 1),
        winPointRateDelta: round(deck.winPointRate - baseline.winPointRate, 3),
        speedScoreDelta: round(deck.speedScore - baseline.speedScore, 1),
        stabilityScoreDelta: round(deck.stabilityScore - baseline.stabilityScore, 1),
      }];
    }),
  ).sort((a, b) => Math.abs(b.battleScoreDelta) - Math.abs(a.battleScoreDelta));
}

function requireReport(
  reports: Partial<Record<CpuAiProfile, DeckBattleScoringReport>>,
  profile: CpuAiProfile,
): DeckBattleScoringReport {
  const report = reports[profile];
  if (!report) {
    throw new Error(`Missing AI weight report for profile: ${profile}`);
  }
  return report;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

function formatSignedPercent(value: number): string {
  const formatted = formatPercent(Math.abs(value));
  return value > 0 ? `+${formatted}` : value < 0 ? `-${formatted}` : formatted;
}

function round(value: number, digits = 0): number {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}
