import {
  benchmarkAiProfiles,
  formatAiBenchmarkSummary,
  type AiBenchmarkDirection,
  type AiBenchmarkOptions,
} from "../src/game/aiBenchmark";
import { CPU_AI_PROFILES, type CpuAiProfile } from "../src/game/cpuAi";
import { DECK_PRESET_IDS, type DeckPresetId } from "../src/game/deckPresets";
import { MASTER_IDS } from "../src/game/masters";
import type { MasterId } from "../src/game/types";

const BENCHMARK_DIRECTIONS: AiBenchmarkDirection[] = ["challenger-as-cpu", "challenger-as-player"];

const options = parseArgs(process.argv.slice(2));
const result = benchmarkAiProfiles(options);
console.log(formatAiBenchmarkSummary(result));

if (!result.ok) {
  process.exitCode = 1;
}

function parseArgs(args: string[]): AiBenchmarkOptions {
  const parsed: AiBenchmarkOptions = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--seed-start") {
      parsed.seedStart = readNumber(arg, next);
      i += 1;
    } else if (arg === "--seed-end") {
      parsed.seedEnd = readNumber(arg, next);
      i += 1;
    } else if (arg === "--count") {
      parsed.count = readNumber(arg, next);
      i += 1;
    } else if (arg === "--deck-preset") {
      parsed.deckPreset = readDeckPreset(next);
      i += 1;
    } else if (arg === "--player-master") {
      parsed.masterIds = { ...parsed.masterIds, player: readMasterId(arg, next) };
      i += 1;
    } else if (arg === "--cpu-master") {
      parsed.masterIds = { ...parsed.masterIds, cpu: readMasterId(arg, next) };
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readNumber(arg, next);
      i += 1;
    } else if (arg === "--stagnation-limit") {
      parsed.stagnationLimit = readNumber(arg, next);
      i += 1;
    } else if (arg === "--long-game-steps") {
      parsed.longGameSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--long-game-turns") {
      parsed.longGameTurns = readNumber(arg, next);
      i += 1;
    } else if (arg === "--history-limit") {
      parsed.historyLimit = readNumber(arg, next);
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
    } else if (arg === "--fail-on-warnings") {
      parsed.failOnWarnings = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return parsed;
}

function readAiProfile(name: string, value: string | undefined): CpuAiProfile {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  if ((CPU_AI_PROFILES as readonly string[]).includes(value)) {
    return value as CpuAiProfile;
  }
  throw new Error(`${name} must be one of: ${CPU_AI_PROFILES.join(", ")}`);
}

function readDirections(value: string | undefined): AiBenchmarkDirection[] {
  if (!value) {
    throw new Error("--direction requires a value");
  }
  if (value === "both") {
    return [...BENCHMARK_DIRECTIONS];
  }
  if ((BENCHMARK_DIRECTIONS as string[]).includes(value)) {
    return [value as AiBenchmarkDirection];
  }
  throw new Error(`--direction must be one of: both, ${BENCHMARK_DIRECTIONS.join(", ")}`);
}

function readMasterId(name: string, value: string | undefined): MasterId {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  if ((MASTER_IDS as string[]).includes(value)) {
    return value as MasterId;
  }
  throw new Error(`${name} must be one of: ${MASTER_IDS.join(", ")}`);
}

function readDeckPreset(value: string | undefined): "random" | DeckPresetId {
  if (!value) {
    throw new Error("--deck-preset requires a value");
  }
  if (value === "random" || (DECK_PRESET_IDS as string[]).includes(value)) {
    return value as "random" | DeckPresetId;
  }
  throw new Error(`--deck-preset must be one of: random, ${DECK_PRESET_IDS.join(", ")}`);
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
  npm run benchmark:ai -- [options]

Options:
  --seed-start <n>        First seed. Default: 400
  --seed-end <n>          Last seed, inclusive. Overrides --count.
  --count <n>             Number of seeds. Default: 20
  --deck-preset <id>      Deck preset. Default: random. Values: random, ${DECK_PRESET_IDS.join(", ")}
  --player-master <id>    Player master. Default: white. Values: ${MASTER_IDS.join(", ")}
  --cpu-master <id>       CPU master. Default: white. Values: ${MASTER_IDS.join(", ")}
  --max-steps <n>         Failure threshold per game. Default: 500
  --max-turns <n>         Failure threshold per game. Default: 120
  --long-game-steps <n>   Warning threshold per game. Default: 300
  --long-game-turns <n>   Warning threshold per game. Default: 80
  --stagnation-limit <n>  Failure threshold for repeated state signatures. Default: 8
  --history-limit <n>     Decision history saved per issue. Default: 30
  --baseline-ai <id>      Baseline AI profile. Default: stable. Values: ${CPU_AI_PROFILES.join(", ")}
  --challenger-ai <id>    Challenger AI profile. Default: strong. Values: ${CPU_AI_PROFILES.join(", ")}
  --direction <id>        Direction. Default: both. Values: both, ${BENCHMARK_DIRECTIONS.join(", ")}
  --fail-on-warnings      Exit non-zero when warnings are detected.
`);
}
