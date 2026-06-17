import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  formatWhiteAiTuningLoopMarkdown,
  runWhiteAiTuningLoop,
  type WhiteAiTuningLoopOptions,
} from "../src/game/whiteAiTuningLoop";

interface CliOptions extends WhiteAiTuningLoopOptions {
  markdownPath?: string;
  jsonPath?: string;
}

const options = parseArgs(process.argv.slice(2));
const report = runWhiteAiTuningLoop(options);
const markdown = formatWhiteAiTuningLoopMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(compactReportForJson(report)));
}

console.log(`White AI tuning loop: ${report.variants.length} variants / ${report.runs.length} runs`);
for (const standing of report.standings.slice(0, 8)) {
  console.log(`${standing.variant.id}: score ${standing.score} overall ${formatPercent(standing.winPointRate)} vsBlack ${formatPercent(standing.matchups.black.winPointRate)}`);
}
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${content}\n`);
}

function compactReportForJson(report: ReturnType<typeof runWhiteAiTuningLoop>): ReturnType<typeof runWhiteAiTuningLoop> {
  const compact = structuredClone(report) as ReturnType<typeof runWhiteAiTuningLoop>;
  for (const run of compact.runs) {
    for (const game of run.result.games) {
      delete game.history;
      delete game.logTail;
      delete game.stateSummary;
    }
    for (const issue of run.result.issues) {
      const compactIssue = issue as Partial<typeof issue>;
      delete compactIssue.history;
      delete compactIssue.logTail;
      delete compactIssue.stateSummary;
    }
  }
  return compact;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    gamesPerMatchup: 2,
    seedStart: 9000,
    maxSteps: 700,
    maxTurns: 160,
    variantIds: [],
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--games-per-matchup") {
      parsed.gamesPerMatchup = readNumber(arg, next);
      i += 1;
    } else if (arg === "--seed-start") {
      parsed.seedStart = readNumber(arg, next);
      i += 1;
    } else if (arg === "--loop-count") {
      parsed.loopCount = readNumber(arg, next);
      i += 1;
    } else if (arg === "--variant") {
      parsed.variantIds = [...(parsed.variantIds ?? []), readString(arg, next)];
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readNumber(arg, next);
      i += 1;
    } else if (arg === "--fail-on-warnings") {
      parsed.failOnWarnings = true;
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      i += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (parsed.variantIds?.length === 0) {
    delete parsed.variantIds;
  }
  return parsed;
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

function formatPercent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

function printHelp(): void {
  console.log(`
Usage:
  npm run lab:masters:white-ai -- [options]

Options:
  --games-per-matchup <n>   Games for each directed matchup. Default: 2
  --seed-start <n>          First seed. Default: 9000
  --loop-count <n>          Limit variants from the default schedule.
  --variant <id>            Run only the specified variant. Can be repeated.
  --max-steps <n>           Failure threshold per game. Default: 700
  --max-turns <n>           Failure threshold per game. Default: 160
  --fail-on-warnings        Treat warnings as non-ok inside each run.
  --markdown <path>         Write a Markdown report.
  --json <path>             Write a JSON report.
`);
}
