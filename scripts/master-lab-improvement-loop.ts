import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { CPU_AI_PROFILES, type CpuAiProfile } from "../src/game/cpuAi";
import { DECK_PRESET_IDS, type DeckPresetId } from "../src/game/deckPresets";
import {
  formatMasterLabImprovementLoopMarkdown,
  runMasterLabImprovementLoop,
  type MasterLabImprovementLoopOptions,
} from "../src/game/masterLabImprovementLoop";
import type { MasterLabCandidateId } from "../src/game/masterLab";

interface CliOptions extends MasterLabImprovementLoopOptions {
  markdownPath?: string;
  jsonPath?: string;
}

const options = parseArgs(process.argv.slice(2));
const report = runMasterLabImprovementLoop(options);
const markdown = formatMasterLabImprovementLoopMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
}

console.log(`Master Lab improvement loop: ${report.loopCount} loops`);
console.log(`Best: #${report.best.index} ${report.best.deckPreset} score ${report.best.metrics.score}`);
console.log(
  `Rates: overall ${formatPercent(report.best.metrics.decoyWinRate)}, ` +
  `vs Black ${formatPercent(report.best.metrics.blackWinRate)}, ` +
  `vs White ${formatPercent(report.best.metrics.whiteWinRate)}`,
);
console.log(`Decision: ${report.conclusion.decision}`);
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
    plan: "mixed",
    gamesPerMatchup: 5,
    maxSteps: 700,
    maxTurns: 160,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--candidate") {
      parsed.candidateId = readCandidate(arg, next);
      i += 1;
    } else if (arg === "--plan") {
      parsed.plan = readPlan(arg, next);
      i += 1;
    } else if (arg === "--loops") {
      parsed.loopCount = readNumber(arg, next);
      i += 1;
    } else if (arg === "--games-per-matchup") {
      parsed.gamesPerMatchup = readNumber(arg, next);
      i += 1;
    } else if (arg === "--deck-preset") {
      parsed.deckPresets = [...(parsed.deckPresets ?? []), readDeckPreset(arg, next)];
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readNumber(arg, next);
      i += 1;
    } else if (arg === "--ai-profile") {
      parsed.aiProfile = readAiProfile(arg, next);
      i += 1;
    } else if (arg === "--lab-action-margin") {
      parsed.labActionMargin = readNumber(arg, next);
      i += 1;
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      i += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
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

function readCandidate(name: string, value: string | undefined): MasterLabCandidateId {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  if (value === "decoy" || value === "sacrifice" || value === "timing") {
    return value;
  }
  throw new Error(`${name} must be one of: decoy, sacrifice, timing`);
}

function readPlan(name: string, value: string | undefined): CliOptions["plan"] {
  if (
    value === "deck" ||
    value === "mixed" ||
    value === "scapegoat" ||
    value === "magic_inclusion" ||
    value === "unit_inclusion" ||
    value === "unit_action"
  ) {
    return value;
  }
  throw new Error(`${name} must be one of: deck, mixed, scapegoat, magic_inclusion, unit_inclusion, unit_action`);
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

function readAiProfile(name: string, value: string | undefined): CpuAiProfile {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  if ((CPU_AI_PROFILES as readonly string[]).includes(value)) {
    return value as CpuAiProfile;
  }
  throw new Error(`${name} must be one of: ${CPU_AI_PROFILES.join(", ")}`);
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
  npm run lab:masters:improve -- [options]

Options:
  --candidate <id>           Candidate. Default: decoy. Values: decoy, sacrifice, timing
  --plan <id>                Experiment plan. Default: mixed. Values: deck, mixed, scapegoat, magic_inclusion, unit_inclusion, unit_action
  --loops <n>                Number of hypotheses to evaluate. Default: selected plan length
  --games-per-matchup <n>    Games per final-gate matchup. Default: 5
  --deck-preset <id>         Add an explicit deck preset. Can be repeated.
  --max-steps <n>            Failure threshold per game. Default: 700
  --max-turns <n>            Failure threshold per game. Default: 160
  --ai-profile <id>          AI profile for both sides. Default: stable. Values: ${CPU_AI_PROFILES.join(", ")}
  --lab-action-margin <n>    Required score margin before a lab action overrides CPU. Default: 0
  --fail-on-warnings         Treat warnings as non-ok inside the loop.
  --markdown <path>          Write a Markdown report.
  --json <path>              Write a JSON report.
`);
}
