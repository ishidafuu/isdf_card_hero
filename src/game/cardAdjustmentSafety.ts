import { getCardDefsByPool } from "./cards";
import { getImplementedMagicCardsWithoutAiTraits } from "./aiTraits";
import { inferMonsterAiTrait } from "./aiUnitTraits";
import {
  compareAiWeightProfiles,
  type AiWeightComparisonReport,
} from "./aiWeightComparison";
import {
  formatDeckBattleScoringReport,
  runDeckBattleScoring,
  type DeckBattleScoringOptions,
  type DeckBattleScoringReport,
} from "./deckBattleScoring";

export interface CardAdjustmentSafetyOptions extends DeckBattleScoringOptions {
  compareWeights?: boolean;
  maxFailures?: number;
  maxWarnings?: number;
  maxSeatDelta?: number;
  maxFirstPlayerDelta?: number;
  minTopWinPointRate?: number;
}

export interface CardAdjustmentSafetyCheck {
  id: string;
  status: "pass" | "fail" | "warning";
  message: string;
}

export interface CardAdjustmentSafetyReport {
  ok: boolean;
  checks: CardAdjustmentSafetyCheck[];
  deckBattleReport: DeckBattleScoringReport;
  weightComparison?: AiWeightComparisonReport;
}

export function runCardAdjustmentSafetyGate(options: CardAdjustmentSafetyOptions = {}): CardAdjustmentSafetyReport {
  const missingMagicTraits = getImplementedMagicCardsWithoutAiTraits().map((card) => card.id);
  const invalidUnitTraits = getCardDefsByPool("all")
    .filter((def) => def.type === "monster")
    .filter((def) => {
      const trait = inferMonsterAiTrait(def);
      return trait.role !== def.role || trait.intents.length === 0;
    })
    .map((def) => def.id);

  const deckBattleReport = runDeckBattleScoring({
    suiteId: "smoke",
    maxDecks: 4,
    seedStart: 620,
    count: 1,
    ...options,
  });
  const weightComparison = options.compareWeights === false
    ? undefined
    : compareAiWeightProfiles({
      suiteId: options.suiteId ?? "smoke",
      maxDecks: options.maxDecks ?? 4,
      seedStart: options.seedStart ?? 620,
      count: options.count ?? 1,
      firstPlayerMode: options.firstPlayerMode,
      profiles: ["stable", "strong"],
    });

  const checks: CardAdjustmentSafetyCheck[] = [
    {
      id: "magic_trait_coverage",
      status: missingMagicTraits.length === 0 ? "pass" : "fail",
      message: missingMagicTraits.length === 0
        ? "implemented magic cards are classified"
        : `missing magic ai traits: ${missingMagicTraits.join(", ")}`,
    },
    {
      id: "unit_trait_generation",
      status: invalidUnitTraits.length === 0 ? "pass" : "fail",
      message: invalidUnitTraits.length === 0
        ? "monster ai traits are generated"
        : `invalid monster ai traits: ${invalidUnitTraits.join(", ")}`,
    },
    {
      id: "deck_battle_failures",
      status: deckBattleReport.summary.failures === 0 ? "pass" : "fail",
      message: `${deckBattleReport.summary.failures} failures / ${deckBattleReport.summary.warnings} warnings in ${deckBattleReport.summary.games} games`,
    },
    {
      id: "deck_battle_warnings",
      status: deckBattleReport.summary.warnings === 0 ? "pass" : "warning",
      message: `${deckBattleReport.summary.warnings} warning games`,
    },
  ];

  if (weightComparison) {
    const totalComparisonFailures = weightComparison.summaries.reduce((total, summary) => total + summary.failures, 0);
    checks.push({
      id: "weight_comparison_failures",
      status: totalComparisonFailures === 0 ? "pass" : "fail",
      message: `${totalComparisonFailures} failures across compared AI profiles`,
    });
  }
  checks.push(...buildThresholdChecks(deckBattleReport, options));

  return {
    ok: checks.every((check) => check.status !== "fail"),
    checks,
    deckBattleReport,
    weightComparison,
  };
}

export function formatCardAdjustmentSafetyMarkdown(report: CardAdjustmentSafetyReport): string {
  return [
    `# カード調整セーフティゲート`,
    ``,
    `Result: ${report.ok ? "PASS" : "FAIL"}`,
    ``,
    `## Checks`,
    ``,
    `| Check | Status | Message |`,
    `| --- | --- | --- |`,
    ...report.checks.map((check) => `| ${check.id} | ${check.status} | ${check.message} |`),
    ``,
    `## Deck Battle`,
    ``,
    "```text",
    formatDeckBattleScoringReport(report.deckBattleReport, 8),
    "```",
    ``,
    ...(report.weightComparison
      ? [
        `## AI Weight Comparison`,
        ``,
        `| Profile | Games | Failures | Warnings | Avg steps |`,
        `| --- | ---: | ---: | ---: | ---: |`,
        ...report.weightComparison.summaries.map((summary) =>
          `| ${summary.profile} | ${summary.games} | ${summary.failures} | ${summary.warnings} | ${summary.averageSteps} |`,
        ),
        ``,
      ]
      : []),
  ].join("\n");
}

function buildThresholdChecks(
  report: DeckBattleScoringReport,
  options: CardAdjustmentSafetyOptions,
): CardAdjustmentSafetyCheck[] {
  const checks: CardAdjustmentSafetyCheck[] = [];
  if (options.maxFailures !== undefined) {
    checks.push({
      id: "max_failures",
      status: report.summary.failures <= options.maxFailures ? "pass" : "fail",
      message: `${report.summary.failures} failures <= ${options.maxFailures}`,
    });
  }
  if (options.maxWarnings !== undefined) {
    checks.push({
      id: "max_warnings",
      status: report.summary.warnings <= options.maxWarnings ? "pass" : "fail",
      message: `${report.summary.warnings} warnings <= ${options.maxWarnings}`,
    });
  }
  if (options.maxSeatDelta !== undefined) {
    const maxSeatDelta = Math.max(
      0,
      ...report.decks.map((deck) => Math.abs(deck.playerSideWinPointRate - deck.cpuSideWinPointRate)),
    );
    checks.push({
      id: "max_seat_delta",
      status: maxSeatDelta <= options.maxSeatDelta ? "pass" : "fail",
      message: `${formatPercent(maxSeatDelta)} max seat delta <= ${formatPercent(options.maxSeatDelta)}`,
    });
  }
  if (options.maxFirstPlayerDelta !== undefined) {
    const maxFirstPlayerDelta = Math.max(
      0,
      ...report.decks.map((deck) => Math.abs(deck.firstPlayerWinPointRate - deck.secondPlayerWinPointRate)),
    );
    checks.push({
      id: "max_first_player_delta",
      status: maxFirstPlayerDelta <= options.maxFirstPlayerDelta ? "pass" : "fail",
      message: `${formatPercent(maxFirstPlayerDelta)} max first-player delta <= ${formatPercent(options.maxFirstPlayerDelta)}`,
    });
  }
  if (options.minTopWinPointRate !== undefined) {
    const topWinPointRate = report.decks[0]?.winPointRate ?? 0;
    checks.push({
      id: "min_top_win_point_rate",
      status: topWinPointRate >= options.minTopWinPointRate ? "pass" : "fail",
      message: `${formatPercent(topWinPointRate)} top win point >= ${formatPercent(options.minTopWinPointRate)}`,
    });
  }
  return checks;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}
