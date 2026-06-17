import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  formatCoreMasterTuningLoopMarkdown,
  runCoreMasterTuningLoop,
  type CoreMasterTuningOptions,
} from "../src/game/coreMasterTuningLoop";

interface CliOptions extends CoreMasterTuningOptions {
  markdownPath?: string;
  jsonPath?: string;
}

const options = parseArgs(process.argv.slice(2));
const report = runCoreMasterTuningLoop(options);
const markdown = formatCoreMasterTuningLoopMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
}

console.log(`Core master tuning loop: ${report.variants.length} variants / ${report.runs.length} runs`);
for (const summary of report.masterSummaries) {
  console.log(`${summary.masterId}: ${summary.bestVariantId} score ${summary.bestScore} win ${formatPercent(summary.winPointRate)}`);
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

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    gamesPerPairing: 3,
    seedStart: 6000,
    maxSteps: 700,
    maxTurns: 160,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--games-per-pairing") {
      parsed.gamesPerPairing = readNumber(arg, next);
      i += 1;
    } else if (arg === "--seed-start") {
      parsed.seedStart = readNumber(arg, next);
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
  npm run lab:masters:core-tune -- [options]

Options:
  --games-per-pairing <n>   Games for each directed pairing. Default: 3
  --seed-start <n>          First seed. Default: 6000
  --max-steps <n>           Failure threshold per game. Default: 700
  --max-turns <n>           Failure threshold per game. Default: 160
  --fail-on-warnings        Treat warnings as non-ok inside each run.
  --markdown <path>         Write a Markdown report.
  --json <path>             Write a JSON report.
`);
}
