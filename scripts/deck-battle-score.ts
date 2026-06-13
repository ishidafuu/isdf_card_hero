import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { CPU_AI_PROFILES, type CpuAiProfile } from "../src/game/cpuAi";
import { DECK_BENCHMARK_SUITE_IDS, type DeckBenchmarkSuiteId } from "../src/game/deckBenchmarkSuites";
import {
  formatDeckBattleScoringMarkdown,
  formatDeckBattleScoringReport,
  runDeckBattleScoring,
  type DeckBattleScoringOptions,
} from "../src/game/deckBattleScoring";

interface CliOptions extends DeckBattleScoringOptions {
  outDir: string;
  jsonPath?: string;
  markdownPath?: string;
  failOnWarnings: boolean;
}

const options = parseArgs(process.argv.slice(2));
const report = runDeckBattleScoring(options);
console.log(formatDeckBattleScoringReport(report));

const jsonPath = options.jsonPath ?? join(options.outDir, "report.json");
const markdownPath = options.markdownPath ?? join(options.outDir, "report.md");
await writeReport(jsonPath, JSON.stringify(report, null, 2));
await writeReport(markdownPath, formatDeckBattleScoringMarkdown(report));
console.log(`JSON: ${jsonPath}`);
console.log(`Markdown: ${markdownPath}`);

if (report.summary.failures > 0 || (options.failOnWarnings && report.summary.warnings > 0)) {
  process.exitCode = 1;
}

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${content}\n`);
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    suiteId: "smoke",
    seedStart: 500,
    count: 1,
    maxSteps: 700,
    maxTurns: 160,
    longGameSteps: 300,
    longGameTurns: 80,
    stagnationLimit: 8,
    aiProfile: "strong",
    outDir: join("artifacts", "deck-battle-score", "latest"),
    failOnWarnings: false,
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
    } else if (arg === "--max-decks") {
      parsed.maxDecks = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readNumber(arg, next);
      i += 1;
    } else if (arg === "--long-game-steps") {
      parsed.longGameSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--long-game-turns") {
      parsed.longGameTurns = readNumber(arg, next);
      i += 1;
    } else if (arg === "--stagnation-limit") {
      parsed.stagnationLimit = readNumber(arg, next);
      i += 1;
    } else if (arg === "--ai-profile") {
      parsed.aiProfile = readAiProfile(arg, next);
      i += 1;
    } else if (arg === "--out-dir") {
      if (!next) {
        throw new Error("--out-dir requires a value");
      }
      parsed.outDir = next;
      i += 1;
    } else if (arg === "--json") {
      if (!next) {
        throw new Error("--json requires a value");
      }
      parsed.jsonPath = next;
      i += 1;
    } else if (arg === "--markdown") {
      if (!next) {
        throw new Error("--markdown requires a value");
      }
      parsed.markdownPath = next;
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
  npm run score:deck-battles -- [options]

Options:
  --suite <id>             Deck suite. Default: smoke. Values: ${DECK_BENCHMARK_SUITE_IDS.join(", ")}
  --seed-start <n>         First seed. Default: 500
  --count <n>              Number of seeds per pair. Default: 1
  --max-decks <n>          Limit deck count from the selected suite.
  --max-steps <n>          Failure threshold per game. Default: 700
  --max-turns <n>          Failure threshold per game. Default: 160
  --long-game-steps <n>    Warning threshold for long finished games. Default: 300
  --long-game-turns <n>    Warning threshold for long finished games. Default: 80
  --stagnation-limit <n>   Repeated progress signature failure threshold. Default: 8
  --ai-profile <id>        Auto battle AI profile. Default: strong. Values: ${CPU_AI_PROFILES.join(", ")}
  --out-dir <path>         Output directory. Default: artifacts/deck-battle-score/latest
  --json <path>            Write JSON report to an explicit path.
  --markdown <path>        Write Markdown report to an explicit path.
  --fail-on-warnings       Exit non-zero when warnings are detected.
`);
}
