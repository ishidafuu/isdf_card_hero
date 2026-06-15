import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { CPU_AI_PROFILES, type CpuAiProfile } from "../src/game/cpuAi";
import { DECK_BENCHMARK_SUITE_IDS, type DeckBenchmarkSuiteId } from "../src/game/deckBenchmarkSuites";
import {
  compareAiWeightProfiles,
  formatAiWeightComparisonMarkdown,
  type AiWeightComparisonOptions,
} from "../src/game/aiWeightComparison";
import type { DeckBattleFirstPlayerMode } from "../src/game/deckBattleScoring";

interface CliOptions extends AiWeightComparisonOptions {
  outDir: string;
  jsonPath?: string;
  markdownPath?: string;
}

const options = parseArgs(process.argv.slice(2));
const report = compareAiWeightProfiles(options);
const markdown = formatAiWeightComparisonMarkdown(report);

const jsonPath = options.jsonPath ?? join(options.outDir, "ai-weight-comparison.json");
const markdownPath = options.markdownPath ?? join(options.outDir, "ai-weight-comparison.md");
await writeReport(jsonPath, JSON.stringify(report, null, 2));
await writeReport(markdownPath, markdown);

console.log(`AI weight comparison: ${report.summaries.map((summary) => summary.profile).join(" vs ")}`);
for (const summary of report.summaries) {
  console.log(`${summary.profile}: ${summary.games} games, ${summary.failures}/${summary.warnings}, avg ${summary.averageSteps} steps`);
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
    seedStart: 500,
    count: 1,
    maxSteps: 700,
    maxTurns: 160,
    longGameSteps: 300,
    longGameTurns: 80,
    stagnationLimit: 8,
    firstPlayerMode: "player",
    profiles: CPU_AI_PROFILES,
    outDir: join("artifacts", "ai-weight-comparison", "latest"),
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
    } else if (arg === "--profiles") {
      parsed.profiles = readProfiles(arg, next);
      i += 1;
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

function readProfiles(name: string, value: string | undefined): CpuAiProfile[] {
  return readString(name, value).split(",").map((profile) => {
    if ((CPU_AI_PROFILES as readonly string[]).includes(profile)) {
      return profile as CpuAiProfile;
    }
    throw new Error(`${name} must contain only: ${CPU_AI_PROFILES.join(", ")}`);
  });
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

function readString(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function printHelp(): void {
  console.log(`
Usage:
  npm run compare:ai-weights -- [options]

Options:
  --suite <id>              Deck suite. Default: smoke. Values: ${DECK_BENCHMARK_SUITE_IDS.join(", ")}
  --seed-start <n>          First seed. Default: 500
  --count <n>               Number of seeds per pair. Default: 1
  --max-decks <n>           Limit deck count from the selected suite.
  --first-player-mode <m>   First player mode. Default: player. Values: player, cpu, alternate, both
  --profiles <ids>          Comma-separated profiles. Default: ${CPU_AI_PROFILES.join(",")}
  --out-dir <path>          Output directory. Default: artifacts/ai-weight-comparison/latest
  --json <path>             Write JSON report to an explicit path.
  --markdown <path>         Write Markdown report to an explicit path.
`);
}
