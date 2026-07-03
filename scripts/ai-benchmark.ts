import { mkdirSync, writeFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  benchmarkAiProfiles,
  formatAiBenchmarkSummary,
  type AiBenchmarkGameOutcome,
  type AiBenchmarkDirection,
  type AiBenchmarkOptions,
  type AiBenchmarkResult,
} from "../src/game/aiBenchmark";
import type { AutoPlayIssue } from "../src/game/autoPlayValidation";
import { CPU_AI_PROFILES, type CpuAiProfile } from "../src/game/cpuAi";
import { DECK_PRESET_IDS, type DeckPresetId } from "../src/game/deckPresets";
import { MASTER_IDS } from "../src/game/masters";
import type { MasterId } from "../src/game/types";

const BENCHMARK_DIRECTIONS: AiBenchmarkDirection[] = ["challenger-as-cpu", "challenger-as-player"];

interface CliOptions extends AiBenchmarkOptions {
  outDir: string;
  writeArtifacts: boolean;
  writeGameArtifacts: boolean;
  streamProgress: boolean;
}

const options = parseArgs(process.argv.slice(2));
if (options.writeArtifacts || options.writeGameArtifacts) {
  options.includeGameHistory = true;
}
const result = benchmarkAiProfiles({
  ...options,
  onGameOutcome: createGameOutcomeHandler(options),
});
console.log(formatAiBenchmarkSummary(result));

if (options.writeArtifacts) {
  await writeArtifacts(options.outDir, result);
  console.log(`Artifacts: ${options.outDir}`);
} else if (options.writeGameArtifacts) {
  console.log(`Artifacts: ${options.outDir}`);
}

if (!result.ok) {
  process.exitCode = 1;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    outDir: defaultOutDir(),
    writeArtifacts: false,
    writeGameArtifacts: false,
    streamProgress: false,
  };

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
    } else if (arg === "--player-master") {
      parsed.masterIds = { ...parsed.masterIds, player: readMasterId(arg, next) };
      i += 1;
    } else if (arg === "--cpu-master") {
      parsed.masterIds = { ...parsed.masterIds, cpu: readMasterId(arg, next) };
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
    } else if (arg === "--baseline-ai") {
      parsed.baselineProfile = readAiProfile(arg, next);
      i += 1;
    } else if (arg === "--challenger-ai") {
      parsed.challengerProfile = readAiProfile(arg, next);
      i += 1;
    } else if (arg === "--direction") {
      parsed.directions = readDirections(next);
      i += 1;
    } else if (arg === "--out-dir") {
      if (!next) {
        throw new Error("--out-dir requires a value");
      }
      parsed.outDir = next;
      i += 1;
    } else if (arg === "--write-artifacts") {
      parsed.writeArtifacts = true;
    } else if (arg === "--write-game-artifacts") {
      parsed.writeGameArtifacts = true;
    } else if (arg === "--stream-progress") {
      parsed.streamProgress = true;
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

function createGameOutcomeHandler(
  options: CliOptions,
): ((outcome: AiBenchmarkGameOutcome, issues: AutoPlayIssue[]) => void) | undefined {
  if (!options.streamProgress && !options.writeGameArtifacts) {
    return undefined;
  }
  let completedGames = 0;
  if (options.writeGameArtifacts) {
    mkdirSync(options.outDir, { recursive: true });
  }
  return (outcome, issues) => {
    completedGames += 1;
    if (options.streamProgress) {
      console.log(formatGameProgress(completedGames, outcome, issues));
    }
    if (options.writeGameArtifacts) {
      const filename = `${String(completedGames).padStart(3, "0")}_seed-${outcome.seed}_${outcome.direction}.json`;
      writeFileSync(
        join(options.outDir, filename),
        JSON.stringify(gameOutcomeDetail(outcome, issues), null, 2),
      );
    }
  };
}

function formatGameProgress(
  index: number,
  outcome: AiBenchmarkGameOutcome,
  issues: readonly AutoPlayIssue[],
): string {
  const result = outcome.winnerProfile ? `${outcome.winnerProfile}/${outcome.winner}` : "undecided";
  const issueText = issues.length > 0
    ? `, issues ${issues.filter((issue) => issue.severity === "failure").length}F/${issues.filter((issue) => issue.severity === "warning").length}W`
    : "";
  return `[game ${index}] seed ${outcome.seed} ${outcome.direction}: ${result}, ${outcome.steps} steps / ${outcome.turns} turns${issueText}`;
}

async function writeArtifacts(outDir: string, result: AiBenchmarkResult): Promise<void> {
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, "benchmark-summary.json"), JSON.stringify(benchmarkSummary(result), null, 2));
  await Promise.all(
    result.summary.challengerLosses.map((outcome, index) => {
      const filename = `${String(index + 1).padStart(3, "0")}_seed-${outcome.seed}_${outcome.direction}_challenger-loss.json`;
      return writeFile(join(outDir, filename), JSON.stringify(outcomeDetail(outcome), null, 2));
    }),
  );
}

function benchmarkSummary(result: AiBenchmarkResult): object {
  return {
    ok: result.ok,
    options: result.options,
    summary: {
      ...result.summary,
      challengerLosses: result.summary.challengerLosses.map((outcome) => ({
        direction: outcome.direction,
        seed: outcome.seed,
        winner: outcome.winner,
        winnerProfile: outcome.winnerProfile,
        steps: outcome.steps,
        turns: outcome.turns,
        issueCount: outcome.issueCount,
        warningCount: outcome.warningCount,
      })),
    },
    runs: result.runs.map((run) => ({
      direction: run.direction,
      label: run.label,
      profiles: run.profiles,
      profileWins: run.profileWins,
      undecided: run.undecided,
      averageSteps: run.averageSteps,
      averageTurns: run.averageTurns,
    })),
  };
}

function outcomeDetail(outcome: AiBenchmarkGameOutcome): object {
  return {
    direction: outcome.direction,
    seed: outcome.seed,
    winner: outcome.winner,
    winnerProfile: outcome.winnerProfile,
    steps: outcome.steps,
    turns: outcome.turns,
    issueCount: outcome.issueCount,
    warningCount: outcome.warningCount,
    finalState: outcome.stateSummary,
    logTail: outcome.logTail,
    history: outcome.history,
  };
}

function gameOutcomeDetail(outcome: AiBenchmarkGameOutcome, issues: readonly AutoPlayIssue[]): object {
  return {
    ...outcomeDetail(outcome),
    issues: issues.map((issue) => ({
      kind: issue.kind,
      severity: issue.severity,
      seed: issue.seed,
      step: issue.step,
      turnNumber: issue.turnNumber,
      message: issue.message,
      logTail: issue.logTail,
      stateSummary: issue.stateSummary,
      history: issue.history,
    })),
  };
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

function readDirections(value: string | undefined): AiBenchmarkDirection[] {
  if (!value) {
    throw new Error("--direction requires a value");
  }
  if (value === "both") {
    return [...BENCHMARK_DIRECTIONS];
  }
  if ((BENCHMARK_DIRECTIONS as string[]).includes(value)) {
    return [value as AiBenchmarkDirection];
  }
  throw new Error(`--direction must be one of: both, ${BENCHMARK_DIRECTIONS.join(", ")}`);
}

function readMasterId(name: string, value: string | undefined): MasterId {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  if ((MASTER_IDS as string[]).includes(value)) {
    return value as MasterId;
  }
  throw new Error(`${name} must be one of: ${MASTER_IDS.join(", ")}`);
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

function defaultOutDir(): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return join("artifacts", "ai-benchmark", stamp);
}

function printHelp(): void {
  console.log(`
Usage:
  npm run benchmark:ai -- [options]

Options:
  --seed-start <n>        First seed. Default: 400
  --seed-end <n>          Last seed, inclusive. Overrides --count.
  --count <n>             Number of seeds. Default: 20
  --deck-preset <id>      Deck preset. Default: random. Values: random, ${DECK_PRESET_IDS.join(", ")}
  --player-master <id>    Player master. Default: white. Values: ${MASTER_IDS.join(", ")}
  --cpu-master <id>       CPU master. Default: white. Values: ${MASTER_IDS.join(", ")}
  --max-steps <n>         Failure threshold per game. Default: 500
  --max-turns <n>         Failure threshold per game. Default: 120
  --long-game-steps <n>   Warning threshold per game. Default: 300
  --long-game-turns <n>   Warning threshold per game. Default: 80
  --stagnation-limit <n>  Failure threshold for repeated state signatures. Default: 8
  --history-limit <n>     Decision history saved per issue. Default: 30
  --baseline-ai <id>      Baseline AI profile. Default: stable. Values: ${CPU_AI_PROFILES.join(", ")}
  --challenger-ai <id>    Challenger AI profile. Default: strong. Values: ${CPU_AI_PROFILES.join(", ")}
  --direction <id>        Direction. Default: both. Values: both, ${BENCHMARK_DIRECTIONS.join(", ")}
  --out-dir <path>        Artifact output directory.
  --write-artifacts       Write benchmark summary and challenger-loss histories.
  --write-game-artifacts  Write each completed game immediately.
  --stream-progress       Print one line after each completed game.
  --fail-on-warnings      Exit non-zero when warnings are detected.
`);
}
