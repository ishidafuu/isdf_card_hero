import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { DECK_PRESET_IDS, type DeckPresetId } from "../src/game/deckPresets";
import {
  DEFAULT_MASTER_LAB_MAGIC_OPPORTUNITY_CARDS,
  formatMasterLabMagicOpportunityMarkdown,
  runMasterLabMagicOpportunityReport,
  type MasterLabMagicOpportunityOptions,
} from "../src/game/masterLabMagicOpportunity";
import type { MasterLabCandidateId } from "../src/game/masterLab";

interface CliOptions extends MasterLabMagicOpportunityOptions {
  markdownPath?: string;
  jsonPath?: string;
}

const options = parseArgs(process.argv.slice(2));
const report = runMasterLabMagicOpportunityReport(options);
const markdown = formatMasterLabMagicOpportunityMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
}

const top = report.cardStats[0];
console.log(`Master Lab magic opportunity: ${report.totalGames} games`);
console.log(`Opportunities: ${report.totalOpportunities}`);
if (top) {
  console.log(`Top: ${top.cardName} count ${top.count}, avg +${top.averageDelta}, best +${top.bestDelta}`);
}
console.log(`Issues: ${report.failures} failures, ${report.warnings} warnings`);
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
    candidateId: "decoy",
    deckPreset: "black-pressure",
    gamesPerMatchup: 5,
    maxSteps: 700,
    maxTurns: 160,
    minScoreDelta: 25,
    maxRecordsPerGame: 30,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--candidate") {
      parsed.candidateId = readCandidate(arg, next);
      i += 1;
    } else if (arg === "--deck-preset") {
      parsed.deckPreset = readDeckPreset(arg, next);
      i += 1;
    } else if (arg === "--games-per-matchup") {
      parsed.gamesPerMatchup = readNumber(arg, next);
      i += 1;
    } else if (arg === "--card") {
      parsed.cardIds = [...(parsed.cardIds ?? []), readString(arg, next)];
      i += 1;
    } else if (arg === "--default-cards") {
      parsed.cardIds = DEFAULT_MASTER_LAB_MAGIC_OPPORTUNITY_CARDS;
    } else if (arg === "--min-score-delta") {
      parsed.minScoreDelta = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-records-per-game") {
      parsed.maxRecordsPerGame = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readNumber(arg, next);
      i += 1;
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

function readCandidate(name: string, value: string | undefined): MasterLabCandidateId {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  if (value === "decoy" || value === "sacrifice" || value === "timing") {
    return value;
  }
  throw new Error(`${name} must be one of: decoy, sacrifice, timing`);
}

function readDeckPreset(name: string, value: string | undefined): DeckPresetId {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  if ((DECK_PRESET_IDS as readonly string[]).includes(value)) {
    return value as DeckPresetId;
  }
  throw new Error(`${name} must be one of the registered deck preset ids`);
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
  npm run lab:masters:magic-opportunity -- [options]

Options:
  --candidate <id>              Candidate. Default: decoy. Values: decoy, sacrifice, timing
  --deck-preset <id>            Deck preset. Default: black-pressure
  --games-per-matchup <n>       Games per final-gate matchup. Default: 5
  --card <id>                   Add a magic card candidate. Can be repeated.
  --default-cards               Use the default opportunity candidate set.
  --min-score-delta <n>         Minimum score gain over selected action. Default: 25
  --max-records-per-game <n>    Stored sample records per game. Default: 30
  --max-steps <n>               Failure threshold per game. Default: 700
  --max-turns <n>               Failure threshold per game. Default: 160
  --markdown <path>             Write a Markdown report.
  --json <path>                 Write a JSON report.
`);
}
