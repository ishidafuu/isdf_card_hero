import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  formatMasterLabSelectionLoopMarkdown,
  runMasterLabSelectionLoop,
} from "../src/game/masterLabSelectionLoop";

interface CliOptions {
  markdownPath?: string;
  jsonPath?: string;
}

const options = parseArgs(process.argv.slice(2));
const report = runMasterLabSelectionLoop();
const markdown = formatMasterLabSelectionLoopMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
}

console.log("Master Lab selection loop");
console.log(`Best: ${report.best.candidate.label} score ${report.best.weightedScore}/${report.best.maxScore}`);
console.log(`Decision: ${report.best.judgement}`);
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
  const parsed: CliOptions = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--markdown") {
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

function readString(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function printHelp(): void {
  console.log(`
Usage:
  npm run lab:masters:select -- [options]

Options:
  --markdown <path>          Write a Markdown report.
  --json <path>              Write a JSON report.
`);
}
