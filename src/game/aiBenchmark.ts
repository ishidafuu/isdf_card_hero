import {
  validateAutoPlay,
  type AutoPlayValidationOptions,
  type AutoPlayValidationResult,
} from "./autoPlayValidation";
import { CPU_AI_PROFILES, type CpuAiProfile, type CpuAiProfiles } from "./cpuAi";
import type { MasterId, PlayerId } from "./types";

export type AiBenchmarkDirection = "challenger-as-cpu" | "challenger-as-player";

export interface AiBenchmarkOptions extends Omit<AutoPlayValidationOptions, "aiProfile" | "aiProfiles"> {
  baselineProfile?: CpuAiProfile;
  challengerProfile?: CpuAiProfile;
  directions?: AiBenchmarkDirection[];
}

export interface AiBenchmarkGameOutcome {
  direction: AiBenchmarkDirection;
  seed: number;
  winner?: PlayerId;
  winnerProfile?: CpuAiProfile;
  steps: number;
  turns: number;
  issueCount: number;
  warningCount: number;
}

export interface AiBenchmarkRun {
  direction: AiBenchmarkDirection;
  label: string;
  profiles: CpuAiProfiles;
  result: AutoPlayValidationResult;
  profileWins: Record<CpuAiProfile, number>;
  undecided: number;
  averageSteps: number;
  averageTurns: number;
  outcomes: AiBenchmarkGameOutcome[];
}

export interface AiBenchmarkResult {
  ok: boolean;
  options: {
    seedStart: number;
    seedEnd: number;
    count: number;
    deckPreset: AutoPlayValidationResult["options"]["deckPreset"];
    masterIds: Record<PlayerId, MasterId>;
    maxSteps: number;
    maxTurns: number;
    failOnWarnings: boolean;
    baselineProfile: CpuAiProfile;
    challengerProfile: CpuAiProfile;
    directions: AiBenchmarkDirection[];
  };
  runs: AiBenchmarkRun[];
  summary: {
    games: number;
    profileWins: Record<CpuAiProfile, number>;
    undecided: number;
    failures: number;
    warnings: number;
    maxSteps: number;
    maxTurns: number;
    averageSteps: number;
    averageTurns: number;
    challengerLosses: AiBenchmarkGameOutcome[];
    issueSeeds: number[];
  };
}

const DEFAULT_BENCHMARK_COUNT = 20;
const DEFAULT_DIRECTIONS: AiBenchmarkDirection[] = ["challenger-as-cpu", "challenger-as-player"];

export function benchmarkAiProfiles(options: AiBenchmarkOptions = {}): AiBenchmarkResult {
  const {
    baselineProfile = "stable",
    challengerProfile = "strong",
    directions = DEFAULT_DIRECTIONS,
    ...validationInput
  } = options;

  if (baselineProfile === challengerProfile) {
    throw new Error("baselineProfile and challengerProfile must differ");
  }
  if (directions.length === 0) {
    throw new Error("directions must contain at least one benchmark direction");
  }

  const validationOptions: AutoPlayValidationOptions = {
    ...validationInput,
    count: validationInput.count ?? DEFAULT_BENCHMARK_COUNT,
  };
  const runs = directions.map((direction) =>
    runBenchmarkDirection(direction, baselineProfile, challengerProfile, validationOptions),
  );
  const firstOptions = runs[0].result.options;
  const outcomes = runs.flatMap((run) => run.outcomes);
  const profileWins = emptyProfileCounts();
  for (const run of runs) {
    for (const profile of CPU_AI_PROFILES) {
      profileWins[profile] += run.profileWins[profile];
    }
  }

  const failures = runs.reduce((total, run) => total + run.result.summary.failures, 0);
  const warnings = runs.reduce((total, run) => total + run.result.summary.warnings, 0);
  const games = outcomes.length;
  const issueSeeds = uniqueSorted(runs.flatMap((run) => run.result.issues.map((issue) => issue.seed)));

  return {
    ok: runs.every((run) => run.result.ok),
    options: {
      seedStart: firstOptions.seedStart,
      seedEnd: firstOptions.seedEnd,
      count: firstOptions.count,
      deckPreset: firstOptions.deckPreset,
      masterIds: firstOptions.masterIds,
      maxSteps: firstOptions.maxSteps,
      maxTurns: firstOptions.maxTurns,
      failOnWarnings: firstOptions.failOnWarnings,
      baselineProfile,
      challengerProfile,
      directions: [...directions],
    },
    runs,
    summary: {
      games,
      profileWins,
      undecided: outcomes.filter((outcome) => !outcome.winner).length,
      failures,
      warnings,
      maxSteps: Math.max(0, ...outcomes.map((outcome) => outcome.steps)),
      maxTurns: Math.max(0, ...outcomes.map((outcome) => outcome.turns)),
      averageSteps: average(outcomes.map((outcome) => outcome.steps)),
      averageTurns: average(outcomes.map((outcome) => outcome.turns)),
      challengerLosses: outcomes.filter((outcome) => outcome.winnerProfile === baselineProfile),
      issueSeeds,
    },
  };
}

export function formatAiBenchmarkSummary(result: AiBenchmarkResult): string {
  const lines = [
    `AI benchmark: ${result.ok ? "PASS" : "FAIL"}`,
    `Seeds: ${result.options.seedStart}-${result.options.seedEnd} (${result.options.count} seeds x ${result.runs.length} directions = ${result.summary.games} games)`,
    `Profiles: baseline ${result.options.baselineProfile}, challenger ${result.options.challengerProfile}`,
    `Deck preset: ${result.options.deckPreset}`,
    `Masters: player ${result.options.masterIds.player}, cpu ${result.options.masterIds.cpu}`,
    `Combined wins: ${formatProfileCounts(result.summary.profileWins)}, undecided ${result.summary.undecided}`,
    `Average: ${formatDecimal(result.summary.averageSteps)} steps / ${formatDecimal(result.summary.averageTurns)} turns`,
    `Max: ${result.summary.maxSteps} steps / ${result.summary.maxTurns} turns`,
    `Issues: ${result.summary.failures} failures, ${result.summary.warnings} warnings`,
    "Runs:",
  ];

  for (const run of result.runs) {
    lines.push(
      `- ${run.label}: player ${run.profiles.player}, cpu ${run.profiles.cpu} -> wins ${formatProfileCounts(run.profileWins)}, undecided ${run.undecided}; max ${run.result.summary.maxSteps} steps / ${run.result.summary.maxTurns} turns; issues ${run.result.summary.failures} failures, ${run.result.summary.warnings} warnings`,
    );
  }

  const losses = result.summary.challengerLosses.slice(0, 12);
  if (losses.length > 0) {
    lines.push(`${result.options.challengerProfile} loss samples:`);
    for (const loss of losses) {
      lines.push(
        `- seed ${loss.seed} ${loss.direction}: winner ${loss.winnerProfile}/${loss.winner}, ${loss.steps} steps / ${loss.turns} turns`,
      );
    }
  }

  if (result.summary.issueSeeds.length > 0) {
    lines.push(`Issue seeds: ${result.summary.issueSeeds.slice(0, 20).join(", ")}`);
  }

  return lines.join("\n");
}

function runBenchmarkDirection(
  direction: AiBenchmarkDirection,
  baselineProfile: CpuAiProfile,
  challengerProfile: CpuAiProfile,
  options: AutoPlayValidationOptions,
): AiBenchmarkRun {
  const profiles = profilesForDirection(direction, baselineProfile, challengerProfile);
  const result = validateAutoPlay({ ...options, aiProfiles: profiles });
  const profileWins = emptyProfileCounts();
  let undecided = 0;
  const outcomes = result.games.map((game): AiBenchmarkGameOutcome => {
    const winnerProfile = game.winner ? profiles[game.winner] : undefined;
    if (winnerProfile) {
      profileWins[winnerProfile] += 1;
    } else {
      undecided += 1;
    }
    return {
      direction,
      seed: game.seed,
      winner: game.winner,
      winnerProfile,
      steps: game.steps,
      turns: game.turns,
      issueCount: game.issueCount,
      warningCount: game.warningCount,
    };
  });

  return {
    direction,
    label: directionLabel(direction),
    profiles,
    result,
    profileWins,
    undecided,
    averageSteps: average(outcomes.map((outcome) => outcome.steps)),
    averageTurns: average(outcomes.map((outcome) => outcome.turns)),
    outcomes,
  };
}

function profilesForDirection(
  direction: AiBenchmarkDirection,
  baselineProfile: CpuAiProfile,
  challengerProfile: CpuAiProfile,
): CpuAiProfiles {
  if (direction === "challenger-as-cpu") {
    return { player: baselineProfile, cpu: challengerProfile };
  }
  return { player: challengerProfile, cpu: baselineProfile };
}

function directionLabel(direction: AiBenchmarkDirection): string {
  return direction === "challenger-as-cpu" ? "challenger as cpu" : "challenger as player";
}

function emptyProfileCounts(): Record<CpuAiProfile, number> {
  return Object.fromEntries(CPU_AI_PROFILES.map((profile) => [profile, 0])) as Record<CpuAiProfile, number>;
}

function formatProfileCounts(counts: Record<CpuAiProfile, number>): string {
  return CPU_AI_PROFILES.map((profile) => `${profile} ${counts[profile]}`).join(", ");
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function formatDecimal(value: number): string {
  return value.toFixed(1);
}

function uniqueSorted(values: number[]): number[] {
  return [...new Set(values)].sort((a, b) => a - b);
}
