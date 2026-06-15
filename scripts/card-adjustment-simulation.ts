import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  formatCardAdjustmentSimulationMarkdown,
  simulateCardAdjustmentImpacts,
  type CardAdjustmentDraft,
} from "../src/game/cardAdjustmentSimulation";

interface CliOptions {
  changes: CardAdjustmentDraft[];
  outDir: string;
  jsonPath?: string;
  markdownPath?: string;
}

const options = parseArgs(process.argv.slice(2));
const report = simulateCardAdjustmentImpacts(options.changes);
const markdown = formatCardAdjustmentSimulationMarkdown(report);

const jsonPath = options.jsonPath ?? join(options.outDir, "card-adjustment-simulation.json");
const markdownPath = options.markdownPath ?? join(options.outDir, "card-adjustment-simulation.md");
await writeReport(jsonPath, JSON.stringify(report, null, 2));
await writeReport(markdownPath, markdown);

console.log(`Card adjustment simulation: ${report.impacts.length} changes`);
for (const impact of report.impacts) {
  console.log(`${impact.riskLevel.toUpperCase()} ${impact.name}: ${impact.estimatedDelta >= 0 ? "+" : ""}${impact.estimatedDelta}`);
}
console.log(`JSON: ${jsonPath}`);
console.log(`Markdown: ${markdownPath}`);

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${content}\n`);
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    changes: [],
    outDir: join("artifacts", "card-adjustment-simulation", "latest"),
  };
  let current: CardAdjustmentDraft | undefined;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--card") {
      current = { cardId: readString(arg, next) };
      parsed.changes.push(current);
      i += 1;
    } else if (arg === "--hp-delta") {
      requireCurrentChange(current, arg).hpDelta = readNumber(arg, next);
      i += 1;
    } else if (arg === "--power-delta") {
      requireCurrentChange(current, arg).powerDelta = readNumber(arg, next);
      i += 1;
    } else if (arg === "--cost-delta") {
      requireCurrentChange(current, arg).costDelta = readNumber(arg, next);
      i += 1;
    } else if (arg === "--note") {
      requireCurrentChange(current, arg).note = readString(arg, next);
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

  if (parsed.changes.length === 0) {
    throw new Error("At least one --card is required");
  }
  return parsed;
}

function requireCurrentChange(current: CardAdjustmentDraft | undefined, name: string): CardAdjustmentDraft {
  if (!current) {
    throw new Error(`${name} must follow --card`);
  }
  return current;
}

function readNumber(name: string, value: string | undefined): number {
  const number = Number(readString(name, value));
  if (!Number.isFinite(number)) {
    throw new Error(`${name} must be a number`);
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
  npm run simulate:card-adjustment -- --card <id> [delta options]

Options:
  --card <id>          Start a card adjustment draft. Can be repeated.
  --hp-delta <n>       Estimated HP change for the current card.
  --power-delta <n>    Estimated attack/effect power change for the current card.
  --cost-delta <n>     Estimated stone cost change for the current card.
  --note <text>        Add a note to the current card.
  --out-dir <path>     Output directory. Default: artifacts/card-adjustment-simulation/latest
  --json <path>        Write JSON report to an explicit path.
  --markdown <path>    Write Markdown report to an explicit path.
`);
}
