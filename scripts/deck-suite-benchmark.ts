import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  benchmarkAiProfiles,
  formatAiBenchmarkSummary,
  type AiBenchmarkDirection,
  type AiBenchmarkResult,
} from "../src/game/aiBenchmark";
import { CPU_AI_PROFILES, type CpuAiProfile } from "../src/game/cpuAi";
import { DECK_BENCHMARK_SUITE_IDS, getDeckBenchmarkSuite, type DeckBenchmarkSuiteId } from "../src/game/deckBenchmarkSuites";
import { getDeckPreset } from "../src/game/deckPresets";
import { MASTER_IDS } from "../src/game/masters";
import type { MasterId, PlayerId } from "../src/game/types";

interface CliOptions {
  suiteId: DeckBenchmarkSuiteId;
  seedStart: number;
  count: number;
  maxSteps: number;
  maxTurns: number;
  baselineProfile: CpuAiProfile;
  challengerProfile: CpuAiProfile;
  directions: AiBenchmarkDirection[];
  failOnWarnings: boolean;
  masterIds: Partial<Record<PlayerId, MasterId>>;
  jsonPath?: string;
}

interface DeckSuiteBenchmarkEntry {
  deckPreset: string;
  sourceDeckId?: number;
  name: string;
  masterIds: Record<PlayerId, MasterId>;
  result: AiBenchmarkResult;
}

interface DeckSuiteBenchmarkReport {
  options: CliOptions;
  suite: ReturnType<typeof getDeckBenchmarkSuite>;
  entries: DeckSuiteBenchmarkEntry[];
  summary: {
    decks: number;
    games: number;
    profileWins: Record<CpuAiProfile, number>;
    failures: number;
    warnings: number;
    maxSteps: number;
    maxTurns: number;
    challengerLosses: number;
  };
}

const options = parseArgs(process.argv.slice(2));
const report = runDeckSuiteBenchmark(options);
console.log(formatDeckSuiteBenchmarkReport(report));

if (options.jsonPath) {
  await mkdir(dirname(options.jsonPath), { recursive: true });
  await writeFile(options.jsonPath, JSON.stringify(report, null, 2));
  console.log(`JSON: ${options.jsonPath}`);
}

if (report.summary.failures > 0 || (options.failOnWarnings && report.summary.warnings > 0)) {
  process.exitCode = 1;
}

function runDeckSuiteBenchmark(options: CliOptions): DeckSuiteBenchmarkReport {
  const suite = getDeckBenchmarkSuite(options.suiteId);
  const entries = suite.deckPresetIds.map((deckPreset): DeckSuiteBenchmarkEntry => {
    const preset = getDeckPreset(deckPreset);
    const masterIds = resolveMasterIds(preset.masterId, options.masterIds);
    const result = benchmarkAiProfiles({
      seedStart: options.seedStart,
      count: options.count,
      deckPreset,
      masterIds,
      maxSteps: options.maxSteps,
      maxTurns: options.maxTurns,
      baselineProfile: options.baselineProfile,
      challengerProfile: options.challengerProfile,
      directions: options.directions,
      failOnWarnings: options.failOnWarnings,
    });
    return {
      deckPreset,
      sourceDeckId: preset.sourceDeckId,
      name: preset.name,
      masterIds,
      result,
    };
  });

  const profileWins = Object.fromEntries(CPU_AI_PROFILES.map((profile) => [profile, 0])) as Record<CpuAiProfile, number>;
  for (const entry of entries) {
    for (const profile of CPU_AI_PROFILES) {
      profileWins[profile] += entry.result.summary.profileWins[profile];
    }
  }

  return {
    options,
    suite,
    entries,
    summary: {
      decks: entries.length,
      games: entries.reduce((total, entry) => total + entry.result.summary.games, 0),
      profileWins,
      failures: entries.reduce((total, entry) => total + entry.result.summary.failures, 0),
      warnings: entries.reduce((total, entry) => total + entry.result.summary.warnings, 0),
      maxSteps: Math.max(0, ...entries.map((entry) => entry.result.summary.maxSteps)),
      maxTurns: Math.max(0, ...entries.map((entry) => entry.result.summary.maxTurns)),
      challengerLosses: entries.reduce((total, entry) => total + entry.result.summary.challengerLosses.length, 0),
    },
  };
}

function formatDeckSuiteBenchmarkReport(report: DeckSuiteBenchmarkReport): string {
  const lines = [
    `Deck suite benchmark: ${report.summary.failures === 0 ? "PASS" : "FAIL"}`,
    `Suite: ${report.suite.id} (${report.summary.decks} decks)`,
    `Seeds: ${report.options.seedStart}-${report.options.seedStart + report.options.count - 1} (${report.options.count})`,
    `Profiles: baseline ${report.options.baselineProfile}, challenger ${report.options.challengerProfile}`,
    `Directions: ${report.options.directions.join(", ")}`,
    `Games: ${report.summary.games}`,
    `Wins: ${CPU_AI_PROFILES.map((profile) => `${profile} ${report.summary.profileWins[profile]}`).join(", ")}`,
    `Issues: ${report.summary.failures} failures, ${report.summary.warnings} warnings`,
    `Max: ${report.summary.maxSteps} steps / ${report.summary.maxTurns} turns`,
    `Challenger losses: ${report.summary.challengerLosses}`,
    ``,
    `Decks:`,
  ];
  for (const entry of report.entries) {
    lines.push(
      `- ${entry.deckPreset}: ${entry.result.ok ? "PASS" : "FAIL"} ` +
      `wins ${CPU_AI_PROFILES.map((profile) => `${profile} ${entry.result.summary.profileWins[profile]}`).join(", ")}; ` +
      `issues ${entry.result.summary.failures}/${entry.result.summary.warnings}; ` +
      `${entry.result.summary.maxSteps} steps / ${entry.result.summary.maxTurns} turns`,
    );
  }
  if (report.entries.length > 0) {
    lines.push(``, `First deck detail:`, formatAiBenchmarkSummary(report.entries[0].result));
  }
  return lines.join("\n");
}

function resolveMasterIds(sourceMasterId: MasterId | undefined, overrides: Partial<Record<PlayerId, MasterId>>): Record<PlayerId, MasterId> {
  const fallback = sourceMasterId ?? "white";
  return {
    player: overrides.player ?? fallback,
    cpu: overrides.cpu ?? fallback,
  };
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    suiteId: "smoke",
    seedStart: 430,
    count: 2,
    maxSteps: 700,
    maxTurns: 160,
    baselineProfile: "stable",
    challengerProfile: "strong",
    directions: ["challenger-as-cpu", "challenger-as-player"],
    failOnWarnings: false,
    masterIds: {},
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--suite") {
      parsed.suiteId = readSuiteId(next);
      i += 1;
    } else if (arg === "--seed-start") {
      parsed.seedStart = readNumber(arg, next);
      i += 1;
    } else if (arg === "--count") {
      parsed.count = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readNumber(arg, next);
      i += 1;
    } else if (arg === "--baseline-ai") {
      parsed.baselineProfile = readAiProfile(arg, next);
      i += 1;
    } else if (arg === "--challenger-ai") {
      parsed.challengerProfile = readAiProfile(arg, next);
      i += 1;
    } else if (arg === "--direction") {
      parsed.directions = readDirections(next);
      i += 1;
    } else if (arg === "--player-master") {
      parsed.masterIds = { ...parsed.masterIds, player: readMasterId(arg, next) };
      i += 1;
    } else if (arg === "--cpu-master") {
      parsed.masterIds = { ...parsed.masterIds, cpu: readMasterId(arg, next) };
      i += 1;
    } else if (arg === "--json") {
      if (!next) {
        throw new Error("--json requires a value");
      }
      parsed.jsonPath = next;
      i += 1;
    } else if (arg === "--fail-on-warnings") {
      parsed.failOnWarnings = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (parsed.baselineProfile === parsed.challengerProfile) {
    throw new Error("baseline and challenger profiles must differ");
  }
  return parsed;
}

function readSuiteId(value: string | undefined): DeckBenchmarkSuiteId {
  if ((DECK_BENCHMARK_SUITE_IDS as readonly string[]).includes(value ?? "")) {
    return value as DeckBenchmarkSuiteId;
  }
  throw new Error(`--suite must be one of: ${DECK_BENCHMARK_SUITE_IDS.join(", ")}`);
}

function readAiProfile(name: string, value: string | undefined): CpuAiProfile {
  if ((CPU_AI_PROFILES as readonly string[]).includes(value ?? "")) {
    return value as CpuAiProfile;
  }
  throw new Error(`${name} must be one of: ${CPU_AI_PROFILES.join(", ")}`);
}

function readDirections(value: string | undefined): AiBenchmarkDirection[] {
  if (value === "both") {
    return ["challenger-as-cpu", "challenger-as-player"];
  }
  if (value === "challenger-as-cpu" || value === "challenger-as-player") {
    return [value];
  }
  throw new Error("--direction must be one of: both, challenger-as-cpu, challenger-as-player");
}

function readMasterId(name: string, value: string | undefined): MasterId {
  if ((MASTER_IDS as readonly string[]).includes(value ?? "")) {
    return value as MasterId;
  }
  throw new Error(`${name} must be one of: ${MASTER_IDS.join(", ")}`);
}

function readNumber(name: string, value: string | undefined): number {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  const number = Number(value);
  if (!Number.isInteger(number)) {
    throw new Error(`${name} must be an integer`);
  }
  return number;
}

function printHelp(): void {
  console.log(`
Usage:
  npm run benchmark:deck-suite -- [options]

Options:
  --suite <id>           Deck suite. Default: smoke. Values: ${DECK_BENCHMARK_SUITE_IDS.join(", ")}
  --seed-start <n>       First seed. Default: 430
  --count <n>            Number of seeds per deck. Default: 2
  --max-steps <n>        Failure threshold per game. Default: 700
  --max-turns <n>        Failure threshold per game. Default: 160
  --baseline-ai <id>     Baseline AI profile. Default: stable. Values: ${CPU_AI_PROFILES.join(", ")}
  --challenger-ai <id>   Challenger AI profile. Default: strong. Values: ${CPU_AI_PROFILES.join(", ")}
  --direction <id>       Direction. Default: both. Values: both, challenger-as-cpu, challenger-as-player
  --player-master <id>   Override player master. Defaults to each deck source master.
  --cpu-master <id>      Override CPU master. Defaults to each deck source master.
  --json <path>          Write JSON report.
  --fail-on-warnings     Exit non-zero when warnings are detected.
`);
}
