import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { analyzeDeckBattleReport, type DeckBattleProblemGame } from "../src/game/deckBattleInsights";
import type { DeckBattleScoringReport } from "../src/game/deckBattleScoring";
import {
  buildDeckPresetCardIds,
  deckPresetAllowsSpecial,
  getDeckPreset,
  type DeckSubmissionPresetId,
} from "../src/game/deckPresets";
import { createInitialGame, runAutoStep } from "../src/game/rules";
import type { CpuAiProfile } from "../src/game/cpuAi";
import type { GameState, PlayerId } from "../src/game/types";

interface CliOptions {
  reportPath: string;
  outDir: string;
  jsonPath?: string;
  markdownPath?: string;
  playerDeckPreset?: DeckSubmissionPresetId;
  cpuDeckPreset?: DeckSubmissionPresetId;
  seed?: number;
  limit: number;
  logLimit: number;
}

interface DeckBattleTrace {
  problem: DeckBattleProblemGame;
  winner?: PlayerId;
  winnerDeckPreset?: DeckSubmissionPresetId;
  steps: number;
  turns: number;
  playerHp: number;
  cpuHp: number;
  playerDeckRemaining: number;
  cpuDeckRemaining: number;
  logTail: string[];
}

const options = parseArgs(process.argv.slice(2));
const report = JSON.parse(await readFile(options.reportPath, "utf8")) as DeckBattleScoringReport;
const problems = getTraceProblems(report, options);
const traces = problems.map((problem) =>
  runTrace(problem, report.options.aiProfile, report.options.maxSteps, report.options.maxTurns, options.logLimit),
);

const jsonPath = options.jsonPath ?? join(options.outDir, "traces.json");
const markdownPath = options.markdownPath ?? join(options.outDir, "traces.md");
await writeReport(jsonPath, JSON.stringify(traces, null, 2));
await writeReport(markdownPath, formatTracesMarkdown(traces));

console.log(`Deck battle traces: ${traces.length}`);
console.log(`JSON: ${jsonPath}`);
console.log(`Markdown: ${markdownPath}`);

function getTraceProblems(report: DeckBattleScoringReport, options: CliOptions): DeckBattleProblemGame[] {
  if (options.playerDeckPreset || options.cpuDeckPreset || options.seed !== undefined) {
    if (!options.playerDeckPreset || !options.cpuDeckPreset || options.seed === undefined) {
      throw new Error("--player-deck, --cpu-deck, and --seed must be provided together");
    }
    const sourceGame = report.games.find(
      (game) =>
        game.seed === options.seed &&
        game.playerDeckPreset === options.playerDeckPreset &&
        game.cpuDeckPreset === options.cpuDeckPreset,
    );
    return [{
      kind: sourceGame && sourceGame.steps >= report.summary.averageSteps ? "long_game" : "issue",
      severity: "review",
      seed: options.seed,
      playerDeckPreset: options.playerDeckPreset,
      cpuDeckPreset: options.cpuDeckPreset,
      winnerDeckPreset: sourceGame?.winnerDeckPreset,
      loserDeckPreset: sourceGame?.winnerDeckPreset
        ? sourceGame.winnerDeckPreset === options.playerDeckPreset
          ? options.cpuDeckPreset
          : options.playerDeckPreset
        : undefined,
      steps: sourceGame?.steps ?? 0,
      turns: sourceGame?.turns ?? 0,
      reason: sourceGame
        ? `explicit trace from report: ${sourceGame.steps} steps / ${sourceGame.turns} turns`
        : "explicit trace not found in report; replaying pairing",
    }];
  }

  const insights = analyzeDeckBattleReport(report, { limit: Math.max(options.limit, 8) });
  return insights.problemGames.slice(0, options.limit);
}

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${content}\n`);
}

function runTrace(
  problem: DeckBattleProblemGame,
  aiProfile: CpuAiProfile,
  maxSteps: number,
  maxTurns: number,
  logLimit: number,
): DeckBattleTrace {
  let game = createTraceInitialGame(problem);
  let step = 0;

  for (; step < maxSteps && !game.winner; step += 1) {
    if (game.turnNumber > maxTurns) {
      break;
    }
    game = runAutoStep(game, { profile: aiProfile });
    if (game.pendingLevelUp) {
      game = runAutoStep(game, { profile: aiProfile });
    }
  }

  const winnerDeckPreset =
    game.winner === "player"
      ? problem.playerDeckPreset
      : game.winner === "cpu"
        ? problem.cpuDeckPreset
        : undefined;
  return {
    problem,
    winner: game.winner,
    winnerDeckPreset,
    steps: step,
    turns: game.turnNumber,
    playerHp: game.players.player.masterHp,
    cpuHp: game.players.cpu.masterHp,
    playerDeckRemaining: game.players.player.deck.length,
    cpuDeckRemaining: game.players.cpu.deck.length,
    logTail: game.log.slice(-logLimit),
  };
}

function createTraceInitialGame(problem: DeckBattleProblemGame): GameState {
  const playerPreset = getDeckPreset(problem.playerDeckPreset);
  const cpuPreset = getDeckPreset(problem.cpuDeckPreset);
  return createInitialGame(problem.seed, {
    masterIds: {
      player: playerPreset.masterId ?? "white",
      cpu: cpuPreset.masterId ?? "white",
    },
    playerDeckCardIds: buildDeckPresetCardIds(problem.playerDeckPreset),
    cpuDeckCardIds: buildDeckPresetCardIds(problem.cpuDeckPreset),
    allowSpecialDecks: {
      player: deckPresetAllowsSpecial(problem.playerDeckPreset),
      cpu: deckPresetAllowsSpecial(problem.cpuDeckPreset),
    },
  });
}

function formatTracesMarkdown(traces: readonly DeckBattleTrace[]): string {
  return [
    `# Deck Battle Problem Traces`,
    ``,
    ...traces.flatMap((trace, index) => [
      `## ${index + 1}. ${trace.problem.kind} seed ${trace.problem.seed}`,
      ``,
      `- Player: ${trace.problem.playerDeckPreset}`,
      `- CPU: ${trace.problem.cpuDeckPreset}`,
      `- Winner: ${trace.winnerDeckPreset ?? "-"}`,
      `- Result: ${trace.steps} steps / ${trace.turns} turns / HP ${trace.playerHp}-${trace.cpuHp}`,
      `- Reason: ${trace.problem.reason}`,
      ``,
      `### Log Tail`,
      ``,
      ...trace.logTail.map((entry) => `- ${entry}`),
      ``,
    ]),
  ].join("\n");
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    reportPath: join("artifacts", "deck-battle-score", "latest", "report.json"),
    outDir: join("artifacts", "deck-battle-score", "latest"),
    limit: 8,
    logLimit: 40,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--report") {
      parsed.reportPath = readString(arg, next);
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
    } else if (arg === "--limit") {
      parsed.limit = readNumber(arg, next);
      i += 1;
    } else if (arg === "--log-limit") {
      parsed.logLimit = readNumber(arg, next);
      i += 1;
    } else if (arg === "--player-deck") {
      parsed.playerDeckPreset = readString(arg, next) as DeckSubmissionPresetId;
      i += 1;
    } else if (arg === "--cpu-deck") {
      parsed.cpuDeckPreset = readString(arg, next) as DeckSubmissionPresetId;
      i += 1;
    } else if (arg === "--seed") {
      parsed.seed = readNumber(arg, next);
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
  npm run trace:deck-battles -- [options]

Options:
  --report <path>       Input report.json. Default: artifacts/deck-battle-score/latest/report.json
  --out-dir <path>      Output directory. Default: artifacts/deck-battle-score/latest
  --json <path>         Write JSON traces to an explicit path.
  --markdown <path>     Write Markdown traces to an explicit path.
  --limit <n>           Problem games to replay. Default: 8
  --log-limit <n>       Final log entries per game. Default: 40
  --player-deck <id>    Replay one explicit player deck pairing.
  --cpu-deck <id>       Replay one explicit CPU deck pairing.
  --seed <n>            Replay seed for an explicit pairing.
`);
}
