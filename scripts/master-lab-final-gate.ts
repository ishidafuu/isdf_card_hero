import {
  formatMasterLabFinalGateMarkdown,
  runMasterLabFinalGate,
  type MasterLabFinalGateOptions,
} from "../src/game/masterLabFinalGate";
import { CPU_AI_PROFILES, type CpuAiProfile } from "../src/game/cpuAi";
import type { MasterLabCandidateId } from "../src/game/masterLab";

interface CliOptions extends MasterLabFinalGateOptions {}

const options = parseArgs(process.argv.slice(2));
const result = runMasterLabFinalGate(options);
console.log(formatMasterLabFinalGateMarkdown(result));

if (!result.ok) {
  process.exitCode = 1;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--candidate") {
      parsed.candidateId = readCandidate(arg, next);
      i += 1;
    } else if (arg === "--games-per-matchup") {
      parsed.gamesPerMatchup = readNumber(arg, next);
      i += 1;
    } else if (arg === "--deck-preset") {
      if (!next) {
        throw new Error("--deck-preset requires a value");
      }
      parsed.deckPreset = next as CliOptions["deckPreset"];
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
  npm run lab:masters:final-gate -- [options]

Options:
  --candidate <id>           Candidate. Default: decoy. Values: decoy, sacrifice, timing
  --games-per-matchup <n>    Override recommended game count for every matchup.
  --deck-preset <id>         Deck preset. Default: random.
  --max-steps <n>            Failure threshold per game. Default: 650
  --max-turns <n>            Failure threshold per game. Default: 140
  --ai-profile <id>          AI profile for both sides. Default: stable. Values: ${CPU_AI_PROFILES.join(", ")}
  --lab-action-margin <n>    Required score margin before a lab action overrides CPU. Default: 0
  --fail-on-warnings         Exit non-zero when warnings are detected.
`);
}
