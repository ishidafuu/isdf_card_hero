import { mkdir, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { dirname } from "node:path";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, getDeckPreset, type DeckPresetId } from "../src/game/deckPresets";
import type { CpuAiSearchOptions } from "../src/game/cpuAi";
import { createInitialGame, runAutoStep } from "../src/game/rules";
import type { GameState, PlayerId } from "../src/game/types";

interface CliOptions {
  deckA: DeckPresetId;
  deckB: DeckPresetId;
  gamesPerDirection: number;
  seedStart: number;
  maxSteps: number;
  maxTurns: number;
  configs: SearchBenchmarkConfig[];
  markdownPath?: string;
}

interface SearchBenchmarkConfig {
  id: string;
  search: CpuAiSearchOptions;
}

interface SearchBenchmarkGame {
  configId: string;
  seed: number;
  playerDeckPreset: DeckPresetId;
  cpuDeckPreset: DeckPresetId;
  winner?: PlayerId;
  winnerDeckPreset?: DeckPresetId;
  steps: number;
  turns: number;
  playerHp: number;
  cpuHp: number;
  elapsedMs: number;
  averageTurnElapsedMs: number;
  maxTurnElapsedMs: number;
  issue?: string;
}

interface DeckBenchmarkRecord {
  deckPreset: DeckPresetId;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  hpMarginTotal: number;
  elapsedMsTotal: number;
  averageTurnElapsedMsTotal: number;
  maxTurnElapsedMs: number;
  stepsTotal: number;
  turnsTotal: number;
}

const DEFAULT_CONFIGS = [
  { id: "white_d3_w4", search: { sameTurnSearchDepth: 3, sameTurnSearchWidth: 4, detailedWidth: 4 } },
  { id: "white_d4_w4", search: { sameTurnSearchDepth: 4, sameTurnSearchWidth: 4, detailedWidth: 4 } },
] as const satisfies readonly SearchBenchmarkConfig[];

const options = parseArgs(process.argv.slice(2));
const games = runBenchmark(options);
const report = formatReport(games, options.configs);
if (options.markdownPath) {
  await writeReport(options.markdownPath, report);
}
console.log(report);

function runBenchmark(options: CliOptions): SearchBenchmarkGame[] {
  const games: SearchBenchmarkGame[] = [];
  for (const config of options.configs) {
    let directionIndex = 0;
    for (const [playerDeckPreset, cpuDeckPreset] of [[options.deckA, options.deckB], [options.deckB, options.deckA]] as const) {
      for (let index = 0; index < options.gamesPerDirection; index += 1) {
        const seed = options.seedStart + directionIndex * options.gamesPerDirection + index;
        games.push(runGame(seed, playerDeckPreset, cpuDeckPreset, config, options));
      }
      directionIndex += 1;
    }
  }
  return games;
}

function runGame(
  seed: number,
  playerDeckPreset: DeckPresetId,
  cpuDeckPreset: DeckPresetId,
  config: SearchBenchmarkConfig,
  options: CliOptions,
): SearchBenchmarkGame {
  let game = createInitialGame(seed, {
    masterIds: { player: "white", cpu: "white" },
    playerDeckCardIds: buildDeckPresetCardIds(playerDeckPreset),
    cpuDeckCardIds: buildDeckPresetCardIds(cpuDeckPreset),
    allowSpecialDecks: {
      player: deckPresetAllowsSpecial(playerDeckPreset),
      cpu: deckPresetAllowsSpecial(cpuDeckPreset),
    },
  });
  let elapsedMs = 0;
  let issue: string | undefined;
  let steps = 0;
  const turnElapsed = new Map<string, number>();
  const aiOptions = {
    profiles: { player: "white", cpu: "white" } as const,
    searches: { player: config.search, cpu: config.search },
  };

  for (; steps < options.maxSteps && !game.winner; steps += 1) {
    if (game.turnNumber > options.maxTurns) {
      issue = `turn ${game.turnNumber} exceeded limit ${options.maxTurns}`;
      break;
    }
    const turnKey = currentTurnKey(game);
    const startedAt = performance.now();
    game = runAutoStep(game, aiOptions);
    const stepElapsedMs = performance.now() - startedAt;
    elapsedMs += stepElapsedMs;
    addTurnElapsed(turnElapsed, turnKey, stepElapsedMs);
    if (game.pendingLevelUp) {
      const levelUpStartedAt = performance.now();
      game = runAutoStep(game, aiOptions);
      const levelUpElapsedMs = performance.now() - levelUpStartedAt;
      elapsedMs += levelUpElapsedMs;
      addTurnElapsed(turnElapsed, turnKey, levelUpElapsedMs);
    }
  }

  if (!game.winner && !issue) {
    issue = `winner was not decided within ${options.maxSteps} auto steps`;
  }

  return summarizeGame(config.id, seed, playerDeckPreset, cpuDeckPreset, game, steps, elapsedMs, turnElapsed, issue);
}

function summarizeGame(
  configId: string,
  seed: number,
  playerDeckPreset: DeckPresetId,
  cpuDeckPreset: DeckPresetId,
  game: GameState,
  steps: number,
  elapsedMs: number,
  turnElapsed: Map<string, number>,
  issue?: string,
): SearchBenchmarkGame {
  const turnElapsedValues = [...turnElapsed.values()];
  return {
    configId,
    seed,
    playerDeckPreset,
    cpuDeckPreset,
    winner: game.winner,
    winnerDeckPreset: game.winner === "player" ? playerDeckPreset : game.winner === "cpu" ? cpuDeckPreset : undefined,
    steps,
    turns: game.turnNumber,
    playerHp: game.players.player.masterHp,
    cpuHp: game.players.cpu.masterHp,
    elapsedMs,
    averageTurnElapsedMs: average(turnElapsedValues),
    maxTurnElapsedMs: Math.max(0, ...turnElapsedValues),
    issue,
  };
}

function formatReport(games: readonly SearchBenchmarkGame[], configs: readonly SearchBenchmarkConfig[]): string {
  const lines = ["White vs White search benchmark", ""];
  for (const config of configs) {
    const scoped = games.filter((game) => game.configId === config.id);
    lines.push(
      `${config.id}: depth ${config.search.sameTurnSearchDepth}, width ${config.search.sameTurnSearchWidth}, detailed ${config.search.detailedWidth}` +
      `, terminal ${formatTerminalPlan(config.search)}, opponent ${formatOpponentTerminalPlan(config.search)}`,
    );
    lines.push(`Games: ${scoped.length}, issues: ${scoped.filter((game) => game.issue).length}`);
    for (const record of summarizeDecks(scoped)) {
      lines.push(
        `- ${record.deckPreset}: ${record.wins}-${record.losses}-${record.draws} ` +
        `WPR ${formatPercent((record.wins + record.draws * 0.5) / record.games)} ` +
        `avgHPDiff ${round(record.hpMarginTotal / record.games, 2)} ` +
        `avgGameMs ${round(record.elapsedMsTotal / record.games, 1)} ` +
        `avgTurnMs ${round(record.averageTurnElapsedMsTotal / record.games, 1)} ` +
        `maxTurnMs ${round(record.maxTurnElapsedMs, 1)} ` +
        `avgStepMs ${round(record.elapsedMsTotal / Math.max(1, record.stepsTotal), 2)} ` +
        `avgTurns ${round(record.turnsTotal / record.games, 1)}`,
      );
    }
    for (const run of summarizeRuns(scoped)) {
      lines.push(
        `  ${run.playerDeckPreset} vs ${run.cpuDeckPreset}: ` +
        `P ${run.playerWins} / C ${run.cpuWins} / D ${run.draws}, ` +
        `avgGameMs ${round(run.elapsedMs / run.games, 1)}, ` +
        `avgTurnMs ${round(run.averageTurnElapsedMs / run.games, 1)}, ` +
        `maxTurnMs ${round(run.maxTurnElapsedMs, 1)}, ` +
        `avgStepMs ${round(run.elapsedMs / Math.max(1, run.steps), 2)}`,
      );
    }
    lines.push("");
  }
  return lines.join("\n");
}

function summarizeDecks(games: readonly SearchBenchmarkGame[]): DeckBenchmarkRecord[] {
  const records = new Map<DeckPresetId, DeckBenchmarkRecord>();
  for (const game of games) {
    applyDeckRecord(records, game.playerDeckPreset, "player", game);
    applyDeckRecord(records, game.cpuDeckPreset, "cpu", game);
  }
  return [...records.values()].sort((a, b) => b.wins - a.wins || a.deckPreset.localeCompare(b.deckPreset));
}

function applyDeckRecord(
  records: Map<DeckPresetId, DeckBenchmarkRecord>,
  deckPreset: DeckPresetId,
  side: PlayerId,
  game: SearchBenchmarkGame,
): void {
  const record = records.get(deckPreset) ?? {
    deckPreset,
    games: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    hpMarginTotal: 0,
    elapsedMsTotal: 0,
    averageTurnElapsedMsTotal: 0,
    maxTurnElapsedMs: 0,
    stepsTotal: 0,
    turnsTotal: 0,
  };
  record.games += 1;
  record.elapsedMsTotal += game.elapsedMs;
  record.averageTurnElapsedMsTotal += game.averageTurnElapsedMs;
  record.maxTurnElapsedMs = Math.max(record.maxTurnElapsedMs, game.maxTurnElapsedMs);
  record.stepsTotal += game.steps;
  record.turnsTotal += game.turns;
  record.hpMarginTotal += side === "player" ? game.playerHp - game.cpuHp : game.cpuHp - game.playerHp;
  if (!game.winnerDeckPreset) {
    record.draws += 1;
  } else if (game.winnerDeckPreset === deckPreset) {
    record.wins += 1;
  } else {
    record.losses += 1;
  }
  records.set(deckPreset, record);
}

function summarizeRuns(games: readonly SearchBenchmarkGame[]): Array<{
  playerDeckPreset: DeckPresetId;
  cpuDeckPreset: DeckPresetId;
  games: number;
  playerWins: number;
  cpuWins: number;
  draws: number;
  elapsedMs: number;
  averageTurnElapsedMs: number;
  maxTurnElapsedMs: number;
  steps: number;
}> {
  const records = new Map<string, {
    playerDeckPreset: DeckPresetId;
    cpuDeckPreset: DeckPresetId;
    games: number;
    playerWins: number;
    cpuWins: number;
    draws: number;
    elapsedMs: number;
    averageTurnElapsedMs: number;
    maxTurnElapsedMs: number;
    steps: number;
  }>();
  for (const game of games) {
    const key = `${game.playerDeckPreset}::${game.cpuDeckPreset}`;
    const record = records.get(key) ?? {
      playerDeckPreset: game.playerDeckPreset,
      cpuDeckPreset: game.cpuDeckPreset,
      games: 0,
      playerWins: 0,
      cpuWins: 0,
      draws: 0,
      elapsedMs: 0,
      averageTurnElapsedMs: 0,
      maxTurnElapsedMs: 0,
      steps: 0,
    };
    record.games += 1;
    record.elapsedMs += game.elapsedMs;
    record.averageTurnElapsedMs += game.averageTurnElapsedMs;
    record.maxTurnElapsedMs = Math.max(record.maxTurnElapsedMs, game.maxTurnElapsedMs);
    record.steps += game.steps;
    if (game.winner === "player") {
      record.playerWins += 1;
    } else if (game.winner === "cpu") {
      record.cpuWins += 1;
    } else {
      record.draws += 1;
    }
    records.set(key, record);
  }
  return [...records.values()];
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    deckA: "submission-pro-no-rare8-white-1377",
    deckB: "submission-pro-no-rare8-white-1377",
    gamesPerDirection: 5,
    seedStart: 47000,
    maxSteps: 700,
    maxTurns: 160,
    configs: [...DEFAULT_CONFIGS],
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--deck-a") {
      parsed.deckA = readDeckPresetId(arg, next);
      i += 1;
    } else if (arg === "--deck-b") {
      parsed.deckB = readDeckPresetId(arg, next);
      i += 1;
    } else if (arg === "--games-per-direction") {
      parsed.gamesPerDirection = readNumber(arg, next);
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
    } else if (arg === "--config") {
      parsed.configs = [...parsed.configs, readConfig(arg, next)];
      i += 1;
    } else if (arg === "--only-config") {
      parsed.configs = [readConfig(arg, next)];
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
  return parsed;
}

function readConfig(name: string, value: string | undefined): SearchBenchmarkConfig {
  const raw = readString(name, value);
  const [
    id,
    depth,
    width,
    detailedWidth = width,
    terminalDepth,
    terminalWidth,
    terminalWeight,
    opponentDepth,
    opponentWidth,
    opponentWeight,
  ] = raw.split(":");
  if (!id || depth === undefined || width === undefined) {
    throw new Error(`${name} must be formatted as id:depth:width[:detailedWidth[:terminalDepth:terminalWidth:terminalWeight]]`);
  }
  const search: CpuAiSearchOptions = {
    sameTurnSearchDepth: Number(depth),
    sameTurnSearchWidth: Number(width),
    detailedWidth: Number(detailedWidth),
  };
  if (terminalDepth !== undefined || terminalWidth !== undefined || terminalWeight !== undefined) {
    search.sameTurnTerminalPlanDepth = Number(terminalDepth);
    search.sameTurnTerminalPlanWidth = Number(terminalWidth);
    search.sameTurnTerminalPlanWeight = Number(terminalWeight);
  }
  if (opponentDepth !== undefined || opponentWidth !== undefined || opponentWeight !== undefined) {
    search.sameTurnOpponentTerminalPlanDepth = Number(opponentDepth);
    search.sameTurnOpponentTerminalPlanWidth = Number(opponentWidth);
    search.sameTurnOpponentTerminalPlanWeight = Number(opponentWeight);
  }
  return {
    id,
    search,
  };
}

function readDeckPresetId(name: string, value: string | undefined): DeckPresetId {
  const deckPreset = readString(name, value) as DeckPresetId;
  getDeckPreset(deckPreset);
  return deckPreset;
}

function readNumber(name: string, value: string | undefined): number {
  const number = Number(readString(name, value));
  if (!Number.isInteger(number) || number < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
  return number;
}

function readString(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${content.trimEnd()}\n`, "utf8");
}

function formatPercent(value: number): string {
  return `${round(value * 100, 1)}%`;
}

function formatTerminalPlan(search: CpuAiSearchOptions): string {
  if (search.sameTurnTerminalPlanWeight === undefined) {
    return "profile-default";
  }
  return `${search.sameTurnTerminalPlanDepth ?? 0}/${search.sameTurnTerminalPlanWidth ?? 0}/${search.sameTurnTerminalPlanWeight}`;
}

function formatOpponentTerminalPlan(search: CpuAiSearchOptions): string {
  if (search.sameTurnOpponentTerminalPlanWeight === undefined) {
    return "profile-default";
  }
  return `${search.sameTurnOpponentTerminalPlanDepth ?? 0}/${search.sameTurnOpponentTerminalPlanWidth ?? 0}/${search.sameTurnOpponentTerminalPlanWeight}`;
}

function currentTurnKey(game: GameState): string {
  return `${game.turnNumber}:${game.currentPlayer}`;
}

function addTurnElapsed(turnElapsed: Map<string, number>, turnKey: string, elapsedMs: number): void {
  turnElapsed.set(turnKey, (turnElapsed.get(turnKey) ?? 0) + elapsedMs);
}

function average(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function round(value: number, precision: number): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function printHelp(): void {
  console.log(`
Usage:
  npm run benchmark:white-search -- [options]

Options:
  --deck-a <id>                 First white deck. Default: submission-pro-no-rare8-white-1377
  --deck-b <id>                 Second white deck. Default: submission-pro-no-rare8-white-1377
  --games-per-direction <n>     Games per directed matchup. Default: 5
  --seed-start <n>              First seed. Default: 47000
  --only-config <id:d:w[:dw[:td:tw:twgt[:od:ow:owgt]]]>
                                Run one search config.
  --config <id:d:w[:dw[:td:tw:twgt[:od:ow:owgt]]]>
                                Add a search config after defaults.
  --markdown <path>             Markdown output path.
`);
}
