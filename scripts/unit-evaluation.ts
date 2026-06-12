import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { getCardName } from "../src/game/cards";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, DECK_PRESET_IDS, type DeckPresetId } from "../src/game/deckPresets";
import { MASTER_IDS } from "../src/game/masters";
import { createInitialGame, runAutoStep } from "../src/game/rules";
import { evaluateAllCards, evaluateBoardUnit } from "../src/game/unitEvaluation";
import type { GameState, MasterId, PlayerId, SlotKey } from "../src/game/types";

interface CliOptions {
  seedStart: number;
  seedEnd: number;
  count: number;
  maxSteps: number;
  top: number;
  deckPreset: "random" | DeckPresetId;
  masterIds: Record<PlayerId, MasterId>;
  jsonPath?: string;
}

interface CardBoardStats {
  cardId: string;
  appearances: number;
  activeAppearances: number;
  preparedAppearances: number;
  ownerAppearances: Record<PlayerId, number>;
  scoreTotal: number;
  maxScore: number;
  lethalThreatAppearances: number;
}

interface GameSummary {
  seed: number;
  steps: number;
  turns: number;
  winner?: PlayerId;
}

interface UnitEvaluationReport {
  options: CliOptions;
  games: GameSummary[];
  winners: Record<PlayerId, number>;
  boardStats: Array<CardBoardStats & {
    name: string;
    averageScore: number;
  }>;
  staticTop: ReturnType<typeof evaluateAllCards>;
}

const options = parseArgs(process.argv.slice(2));
const report = runEvaluationStatistics(options);
console.log(formatReport(report, options.top));

if (options.jsonPath) {
  await writeJson(options.jsonPath, report);
  console.log(`JSON: ${options.jsonPath}`);
}

function runEvaluationStatistics(options: CliOptions): UnitEvaluationReport {
  const stats = new Map<string, CardBoardStats>();
  const games: GameSummary[] = [];
  const winners: Record<PlayerId, number> = { player: 0, cpu: 0 };

  for (let seed = options.seedStart; seed <= options.seedEnd; seed += 1) {
    let game = createGame(seed, options);
    let steps = 0;
    collectBoardStats(game, stats);
    while (!game.winner && steps < options.maxSteps) {
      game = runAutoStep(game);
      steps += 1;
      collectBoardStats(game, stats);
    }
    if (game.winner) {
      winners[game.winner] += 1;
    }
    games.push({
      seed,
      steps,
      turns: game.turnNumber,
      winner: game.winner,
    });
  }

  const boardStats = [...stats.values()]
    .map((stat) => ({
      ...stat,
      name: getCardName(stat.cardId),
      averageScore: stat.appearances > 0 ? Math.round((stat.scoreTotal / stat.appearances) * 10) / 10 : 0,
    }))
    .sort((a, b) => b.averageScore - a.averageScore || b.appearances - a.appearances || a.name.localeCompare(b.name, "ja"));

  return {
    options,
    games,
    winners,
    boardStats,
    staticTop: evaluateAllCards(),
  };
}

function createGame(seed: number, options: CliOptions): GameState {
  if (options.deckPreset === "random") {
    return createInitialGame(seed, {
      firstPlayer: seed % 2 === 0 ? "player" : "cpu",
      masterIds: options.masterIds,
    });
  }

  const deck = buildDeckPresetCardIds(options.deckPreset);
  const allowSpecial = deckPresetAllowsSpecial(options.deckPreset);
  return createInitialGame(seed, {
    firstPlayer: seed % 2 === 0 ? "player" : "cpu",
    masterIds: options.masterIds,
    playerDeckCardIds: deck,
    cpuDeckCardIds: deck,
    allowSpecialDecks: { player: allowSpecial, cpu: allowSpecial },
  });
}

function collectBoardStats(game: GameState, stats: Map<string, CardBoardStats>): void {
  for (const slotKey of Object.keys(game.slots) as SlotKey[]) {
    const monster = game.slots[slotKey].monster;
    const evaluation = evaluateBoardUnit(game, slotKey);
    if (!monster || !evaluation) {
      continue;
    }
    const stat = stats.get(monster.cardId) ?? createCardBoardStats(monster.cardId);
    stat.appearances += 1;
    stat.scoreTotal += evaluation.total;
    stat.maxScore = Math.max(stat.maxScore, evaluation.total);
    stat.ownerAppearances[monster.owner] += 1;
    if (monster.status === "active") {
      stat.activeAppearances += 1;
    } else {
      stat.preparedAppearances += 1;
    }
    if (evaluation.lethalThreat) {
      stat.lethalThreatAppearances += 1;
    }
    stats.set(monster.cardId, stat);
  }
}

function createCardBoardStats(cardId: string): CardBoardStats {
  return {
    cardId,
    appearances: 0,
    activeAppearances: 0,
    preparedAppearances: 0,
    ownerAppearances: { player: 0, cpu: 0 },
    scoreTotal: 0,
    maxScore: Number.NEGATIVE_INFINITY,
    lethalThreatAppearances: 0,
  };
}

function formatReport(report: UnitEvaluationReport, top: number): string {
  const staticRows = report.staticTop.slice(0, top).map((evaluation, index) =>
    `${index + 1}. ${evaluation.name} ${evaluation.grade} ${evaluation.total} ` +
    `(攻${evaluation.offense} 耐${evaluation.defense} 効果${evaluation.synergy})`,
  );
  const boardRows = report.boardStats.slice(0, top).map((stat, index) =>
    `${index + 1}. ${stat.name} avg ${stat.averageScore} max ${stat.maxScore} ` +
    `appear ${stat.appearances} active ${stat.activeAppearances} lethalRisk ${stat.lethalThreatAppearances}`,
  );

  return [
    `Unit evaluation statistics`,
    `Seeds: ${report.options.seedStart}-${report.options.seedEnd} (${report.games.length} games)`,
    `Deck preset: ${report.options.deckPreset}`,
    `Masters: player ${report.options.masterIds.player}, cpu ${report.options.masterIds.cpu}`,
    `Winners: player ${report.winners.player}, cpu ${report.winners.cpu}`,
    `Max steps observed: ${Math.max(0, ...report.games.map((game) => game.steps))}`,
    ``,
    `Static card evaluation top ${top}:`,
    ...staticRows,
    ``,
    `Board appearance average top ${top}:`,
    ...boardRows,
  ].join("\n");
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    seedStart: 400,
    seedEnd: 419,
    count: 20,
    maxSteps: 500,
    top: 12,
    deckPreset: "random",
    masterIds: { player: "white", cpu: "white" },
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--seed-start") {
      parsed.seedStart = readNumber(arg, next);
      parsed.seedEnd = parsed.seedStart + parsed.count - 1;
      i += 1;
    } else if (arg === "--seed-end") {
      parsed.seedEnd = readNumber(arg, next);
      parsed.count = parsed.seedEnd - parsed.seedStart + 1;
      i += 1;
    } else if (arg === "--count") {
      parsed.count = readNumber(arg, next);
      parsed.seedEnd = parsed.seedStart + parsed.count - 1;
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--top") {
      parsed.top = readNumber(arg, next);
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
    } else if (arg === "--json") {
      if (!next) {
        throw new Error("--json requires a path");
      }
      parsed.jsonPath = next;
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (parsed.seedEnd < parsed.seedStart) {
    throw new Error("--seed-end must be greater than or equal to --seed-start");
  }
  parsed.count = parsed.seedEnd - parsed.seedStart + 1;
  return parsed;
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

async function writeJson(path: string, report: UnitEvaluationReport): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(report, null, 2));
}

function printHelp(): void {
  console.log(`
Usage:
  npm run evaluate:units -- [options]

Options:
  --seed-start <n>        First seed. Default: 400
  --seed-end <n>          Last seed, inclusive. Overrides --count.
  --count <n>             Number of games. Default: 20
  --max-steps <n>         Step limit per game. Default: 500
  --top <n>               Rows to print per ranking. Default: 12
  --deck-preset <id>      Deck preset. Default: random. Values: random, ${DECK_PRESET_IDS.join(", ")}
  --player-master <id>    Player master. Default: white. Values: ${MASTER_IDS.join(", ")}
  --cpu-master <id>       CPU master. Default: white. Values: ${MASTER_IDS.join(", ")}
  --json <path>           Write full report JSON.
`);
}
