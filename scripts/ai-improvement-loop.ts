import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  formatAiImprovementLoopMarkdown,
  runAiImprovementLoop,
  type AiImprovementLoopOptions,
} from "../src/game/aiImprovementLoop";
import { DECK_BENCHMARK_SUITE_IDS, type DeckBenchmarkSuiteId } from "../src/game/deckBenchmarkSuites";
import type { DeckBattleFirstPlayerMode } from "../src/game/deckBattleScoring";

interface CliOptions extends AiImprovementLoopOptions {
  outDir: string;
  jsonPath?: string;
  markdownPath?: string;
}

const options = parseArgs(process.argv.slice(2));
const report = runAiImprovementLoop(options);
const markdown = formatAiImprovementLoopMarkdown(report);

const jsonPath = options.jsonPath ?? join(options.outDir, "ai-improvement-loop.json");
const markdownPath = options.markdownPath ?? join(options.outDir, "ai-improvement-loop.md");
await writeReport(jsonPath, JSON.stringify(report, null, 2));
await writeReport(markdownPath, markdown);

console.log(`AI improvement loop: ${report.actions.length} actions`);
for (const action of report.actions) {
  console.log(`${action.priority.toUpperCase()} ${action.title}: ${action.reason}`);
}
console.log(`JSON: ${jsonPath}`);
console.log(`Markdown: ${markdownPath}`);

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${content}\n`);
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    suiteId: "smoke",
    seedStart: 700,
    count: 1,
    maxDecks: 4,
    maxSteps: 700,
    maxTurns: 160,
    longGameSteps: 300,
    longGameTurns: 80,
    stagnationLimit: 8,
    aiProfile: "strong",
    firstPlayerMode: "player",
    compareWeights: true,
    outDir: join("artifacts", "ai-improvement-loop", "latest"),
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
    } else if (arg === "--first-player-mode") {
      parsed.firstPlayerMode = readFirstPlayerMode(arg, next);
      i += 1;
    } else if (arg === "--max-failures") {
      parsed.maxFailures = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-warnings") {
      parsed.maxWarnings = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-seat-delta") {
      parsed.maxSeatDelta = readRate(arg, next);
      i += 1;
    } else if (arg === "--max-first-delta") {
      parsed.maxFirstPlayerDelta = readRate(arg, next);
      i += 1;
    } else if (arg === "--min-top-win-point") {
      parsed.minTopWinPointRate = readRate(arg, next);
      i += 1;
    } else if (arg === "--no-compare-weights") {
      parsed.compareWeights = false;
    } else if (arg === "--out-dir") {
      parsed.outDir = readString(arg, next);
      i += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
      i += 1;
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      i += 1;
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

function readFirstPlayerMode(name: string, value: string | undefined): DeckBattleFirstPlayerMode {
  const values = ["player", "cpu", "alternate", "both"] as const satisfies readonly DeckBattleFirstPlayerMode[];
  if ((values as readonly string[]).includes(value ?? "")) {
    return value as DeckBattleFirstPlayerMode;
  }
  throw new Error(`${name} must be one of: ${values.join(", ")}`);
}

function readNumber(name: string, value: string | undefined): number {
  const number = Number(readString(name, value));
  if (!Number.isInteger(number)) {
    throw new Error(`${name} must be an integer`);
  }
  return number;
}

function readRate(name: string, value: string | undefined): number {
  const number = Number(readString(name, value));
  if (!Number.isFinite(number) || number < 0 || number > 1) {
    throw new Error(`${name} must be a number from 0 to 1`);
  }
  return number;
}

function readString(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function printHelp(): void {
  console.log(`
Usage:
  npm run improve:ai-loop -- [options]

Options:
  --suite <id>              Deck suite. Default: smoke. Values: ${DECK_BENCHMARK_SUITE_IDS.join(", ")}
  --seed-start <n>          First seed. Default: 700
  --count <n>               Number of seeds per pair. Default: 1
  --max-decks <n>           Limit deck count from the selected suite. Default: 4
  --first-player-mode <m>   First player mode. Default: player. Values: player, cpu, alternate, both
  --max-failures <n>        Add a safety threshold for failures.
  --max-warnings <n>        Add a safety threshold for warnings.
  --max-seat-delta <n>      Add a 0-1 safety threshold for player/cpu bias.
  --max-first-delta <n>     Add a 0-1 safety threshold for first/second bias.
  --min-top-win-point <n>   Add a 0-1 safety threshold for top deck win-point rate.
  --no-compare-weights      Skip AI weight profile comparison.
  --out-dir <path>          Output directory. Default: artifacts/ai-improvement-loop/latest
  --json <path>             Write JSON report to an explicit path.
  --markdown <path>         Write Markdown report to an explicit path.
`);
}
