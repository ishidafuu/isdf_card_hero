import {
  formatMasterLabAutoPlaySummary,
  validateMasterLabAutoPlay,
  type MasterLabAutoPlayOptions,
  type MasterLabParticipantId,
} from "../src/game/masterLabAutoPlay";
import { CPU_AI_PROFILES, type CpuAiProfile } from "../src/game/cpuAi";
import { DECK_PRESET_IDS, type DeckPresetId } from "../src/game/deckPresets";

interface CliOptions extends MasterLabAutoPlayOptions {}

const options = parseArgs(process.argv.slice(2));
const result = validateMasterLabAutoPlay(options);
console.log(formatMasterLabAutoPlaySummary(result));

if (!result.ok) {
  process.exitCode = 1;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--seed-start") {
      parsed.seedStart = readNumber(arg, next);
      i += 1;
    } else if (arg === "--seed-end") {
      parsed.seedEnd = readNumber(arg, next);
      i += 1;
    } else if (arg === "--count") {
      parsed.count = readNumber(arg, next);
      i += 1;
    } else if (arg === "--deck-preset") {
      parsed.deckPreset = readDeckPreset(next);
      i += 1;
    } else if (arg === "--player") {
      parsed.participants = { ...parsed.participants, player: readParticipant(arg, next) };
      i += 1;
    } else if (arg === "--cpu") {
      parsed.participants = { ...parsed.participants, cpu: readParticipant(arg, next) };
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readNumber(arg, next);
      i += 1;
    } else if (arg === "--stagnation-limit") {
      parsed.stagnationLimit = readNumber(arg, next);
      i += 1;
    } else if (arg === "--long-game-steps") {
      parsed.longGameSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--long-game-turns") {
      parsed.longGameTurns = readNumber(arg, next);
      i += 1;
    } else if (arg === "--history-limit") {
      parsed.historyLimit = readNumber(arg, next);
      i += 1;
    } else if (arg === "--ai-profile") {
      parsed.aiProfile = readAiProfile(arg, next);
      i += 1;
    } else if (arg === "--player-ai") {
      parsed.aiProfiles = { ...parsed.aiProfiles, player: readAiProfile(arg, next) };
      i += 1;
    } else if (arg === "--cpu-ai") {
      parsed.aiProfiles = { ...parsed.aiProfiles, cpu: readAiProfile(arg, next) };
      i += 1;
    } else if (arg === "--lab-action-margin") {
      parsed.labActionMargin = readNumber(arg, next);
      i += 1;
    } else if (arg === "--include-history") {
      parsed.includeGameHistory = true;
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

function readParticipant(name: string, value: string | undefined): MasterLabParticipantId {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  if (["white", "black", "decoy", "sacrifice", "timing"].includes(value)) {
    return value as MasterLabParticipantId;
  }
  throw new Error(`${name} must be one of: white, black, decoy, sacrifice, timing`);
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

function readDeckPreset(value: string | undefined): "random" | DeckPresetId {
  if (!value) {
    throw new Error("--deck-preset requires a value");
  }
  if (value === "random" || (DECK_PRESET_IDS as string[]).includes(value)) {
    return value as "random" | DeckPresetId;
  }
  throw new Error(`--deck-preset must be one of: random, ${DECK_PRESET_IDS.join(", ")}`);
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
  npm run lab:masters:auto-play -- [options]

Options:
  --seed-start <n>          First seed. Default: 900
  --seed-end <n>            Last seed, inclusive. Overrides --count.
  --count <n>               Number of games. Default: 20
  --deck-preset <id>        Deck preset. Default: random. Values: random, ${DECK_PRESET_IDS.join(", ")}
  --player <id>             Player participant. Default: decoy. Values: white, black, decoy, sacrifice, timing
  --cpu <id>                CPU participant. Default: black. Values: white, black, decoy, sacrifice, timing
  --max-steps <n>           Failure threshold per game. Default: 650
  --max-turns <n>           Failure threshold per game. Default: 140
  --long-game-steps <n>     Warning threshold per game. Default: 320
  --long-game-turns <n>     Warning threshold per game. Default: 90
  --stagnation-limit <n>    Failure threshold for repeated state signatures. Default: 8
  --history-limit <n>       Decision history saved per issue. Default: 40
  --ai-profile <id>         AI profile for both sides. Default: stable. Values: ${CPU_AI_PROFILES.join(", ")}
  --player-ai <id>          Player-side AI profile. Default: --ai-profile. Values: ${CPU_AI_PROFILES.join(", ")}
  --cpu-ai <id>             CPU-side AI profile. Default: --ai-profile. Values: ${CPU_AI_PROFILES.join(", ")}
  --lab-action-margin <n>   Required score margin before a lab action overrides CPU. Default: 0
  --include-history         Include game histories in the returned result object.
  --fail-on-warnings        Exit non-zero when warnings are detected.
`);
}
