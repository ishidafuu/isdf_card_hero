import { performance } from "node:perf_hooks";
import { analyzeDeckSubmissions } from "../src/game/deckTemplateAnalysis";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, getDeckPreset, type DeckPresetId } from "../src/game/deckPresets";
import { createInitialGame, runAutoStep } from "../src/game/rules";
import type { GameState, PlayerId } from "../src/game/types";
import { average, escapeMarkdownTableCell, formatPercent, readNonNegativeInteger, readString, round, signed, writeReport } from "./lib/cli";

interface CliOptions {
  candidates: DeckPresetId[];
  top: number;
  gamesPerDirection: number;
  seedStart: number;
  maxSteps: number;
  maxTurns: number;
  markdownPath?: string;
  jsonPath?: string;
  progress: boolean;
}

interface TierGameResult {
  seed: number;
  playerDeckPreset: DeckPresetId;
  cpuDeckPreset: DeckPresetId;
  winner?: PlayerId;
  winnerDeckPreset?: DeckPresetId;
  playerHp: number;
  cpuHp: number;
  steps: number;
  turns: number;
  elapsedMs: number;
  averageTurnElapsedMs: number;
  maxTurnElapsedMs: number;
  issue?: string;
}

interface TierStanding {
  deckPreset: DeckPresetId;
  deckName: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winPointRate: number;
  playerSideWinPointRate: number;
  cpuSideWinPointRate: number;
  averageHpDiff: number;
  averageTurns: number;
  averageSteps: number;
  averageGameMs: number;
  averageTurnMs: number;
  maxTurnMs: number;
  issues: number;
  score: number;
  tier: string;
}

interface PairSummary {
  deckA: DeckPresetId;
  deckB: DeckPresetId;
  games: number;
  deckAWins: number;
  deckBWins: number;
  draws: number;
  deckAWinPointRate: number;
}

interface TierReport {
  generatedAt: string;
  candidates: DeckPresetId[];
  gamesPerDirection: number;
  seedStart: number;
  totalGames: number;
  games: TierGameResult[];
  standings: TierStanding[];
  pairs: PairSummary[];
  notes: string[];
}

interface MutableStanding {
  deckPreset: DeckPresetId;
  deckName: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  playerSideGames: number;
  playerSideWinPoints: number;
  cpuSideGames: number;
  cpuSideWinPoints: number;
  hpDiffTotal: number;
  turnTotal: number;
  stepTotal: number;
  elapsedMsTotal: number;
  averageTurnMsTotal: number;
  maxTurnMs: number;
  issues: number;
}

const options = parseArgs(process.argv.slice(2));
const report = runTier(options);
const markdown = formatMarkdown(report);
const json = JSON.stringify(report, null, 2);

console.log(formatConsole(report));
if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, json);
  console.log(`JSON: ${options.jsonPath}`);
}

function runTier(options: CliOptions): TierReport {
  const candidates = options.candidates.length > 0 ? uniqueDeckPresetIds(options.candidates) : defaultCandidates(options.top);
  const games: TierGameResult[] = [];
  const pairCount = (candidates.length * (candidates.length - 1)) / 2;
  const totalPlannedGames = pairCount * 2 * options.gamesPerDirection;
  let runIndex = 0;

  for (let leftIndex = 0; leftIndex < candidates.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < candidates.length; rightIndex += 1) {
      const left = candidates[leftIndex];
      const right = candidates[rightIndex];
      for (const [playerDeckPreset, cpuDeckPreset] of [[left, right], [right, left]] as const) {
        for (let gameIndex = 0; gameIndex < options.gamesPerDirection; gameIndex += 1) {
          const seed = options.seedStart + runIndex * options.gamesPerDirection + gameIndex;
          const game = runGame(seed, playerDeckPreset, cpuDeckPreset, options);
          games.push(game);
          if (options.progress) {
            console.log(progressLine(games.length, totalPlannedGames, game));
          }
        }
        runIndex += 1;
      }
    }
  }

  const notes = [
    "AI profile is white for both seats. This uses the current white profile defaults, including same-turn search and terminal plan evaluation.",
    "Candidates are Pro no-rare8 white decks. The default candidate list excludes special-allowed submissions and always includes 1377 when it is in the static top set.",
    "Tier labels are a practical screen based on win-point rate and HP margin, not a final metagame proof.",
  ];

  return {
    generatedAt: new Date().toISOString(),
    candidates,
    gamesPerDirection: options.gamesPerDirection,
    seedStart: options.seedStart,
    totalGames: games.length,
    games,
    standings: summarizeStandings(candidates, games),
    pairs: summarizePairs(candidates, games),
    notes,
  };
}

function runGame(
  seed: number,
  playerDeckPreset: DeckPresetId,
  cpuDeckPreset: DeckPresetId,
  options: CliOptions,
): TierGameResult {
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
  const aiOptions = { profiles: { player: "white", cpu: "white" } as const };

  for (; steps < options.maxSteps && !game.winner; steps += 1) {
    if (game.turnNumber > options.maxTurns) {
      issue = `turn ${game.turnNumber} exceeded limit ${options.maxTurns}`;
      break;
    }
    const turnKey = `${game.currentPlayer}:${game.turnNumber}`;
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

  return summarizeGame(seed, playerDeckPreset, cpuDeckPreset, game, steps, elapsedMs, turnElapsed, issue);
}

function summarizeGame(
  seed: number,
  playerDeckPreset: DeckPresetId,
  cpuDeckPreset: DeckPresetId,
  game: GameState,
  steps: number,
  elapsedMs: number,
  turnElapsed: Map<string, number>,
  issue?: string,
): TierGameResult {
  const turnElapsedValues = [...turnElapsed.values()];
  return {
    seed,
    playerDeckPreset,
    cpuDeckPreset,
    winner: game.winner,
    winnerDeckPreset: game.winner === "player" ? playerDeckPreset : game.winner === "cpu" ? cpuDeckPreset : undefined,
    playerHp: game.players.player.masterHp,
    cpuHp: game.players.cpu.masterHp,
    steps,
    turns: game.turnNumber,
    elapsedMs,
    averageTurnElapsedMs: average(turnElapsedValues),
    maxTurnElapsedMs: Math.max(0, ...turnElapsedValues),
    issue,
  };
}

function summarizeStandings(candidates: readonly DeckPresetId[], games: readonly TierGameResult[]): TierStanding[] {
  const records = new Map<DeckPresetId, MutableStanding>(
    candidates.map((deckPreset) => [deckPreset, createStanding(deckPreset)]),
  );

  for (const game of games) {
    applyStanding(records.get(game.playerDeckPreset), game.playerDeckPreset, "player", game);
    applyStanding(records.get(game.cpuDeckPreset), game.cpuDeckPreset, "cpu", game);
  }

  return [...records.values()]
    .map(finalizeStanding)
    .sort((a, b) => b.score - a.score || b.winPointRate - a.winPointRate || b.averageHpDiff - a.averageHpDiff);
}

function createStanding(deckPreset: DeckPresetId): MutableStanding {
  return {
    deckPreset,
    deckName: getDeckPreset(deckPreset).name,
    games: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    playerSideGames: 0,
    playerSideWinPoints: 0,
    cpuSideGames: 0,
    cpuSideWinPoints: 0,
    hpDiffTotal: 0,
    turnTotal: 0,
    stepTotal: 0,
    elapsedMsTotal: 0,
    averageTurnMsTotal: 0,
    maxTurnMs: 0,
    issues: 0,
  };
}

function applyStanding(
  standing: MutableStanding | undefined,
  deckPreset: DeckPresetId,
  side: PlayerId,
  game: TierGameResult,
): void {
  if (!standing) {
    throw new Error(`Unknown deck standing: ${deckPreset}`);
  }
  standing.games += 1;
  standing.turnTotal += game.turns;
  standing.stepTotal += game.steps;
  standing.elapsedMsTotal += game.elapsedMs;
  standing.averageTurnMsTotal += game.averageTurnElapsedMs;
  standing.maxTurnMs = Math.max(standing.maxTurnMs, game.maxTurnElapsedMs);
  standing.issues += game.issue ? 1 : 0;

  if (side === "player") {
    standing.playerSideGames += 1;
    standing.hpDiffTotal += game.playerHp - game.cpuHp;
  } else {
    standing.cpuSideGames += 1;
    standing.hpDiffTotal += game.cpuHp - game.playerHp;
  }

  if (!game.winnerDeckPreset) {
    standing.draws += 1;
    addSideWinPoints(standing, side, 0.5);
  } else if (game.winnerDeckPreset === deckPreset) {
    standing.wins += 1;
    addSideWinPoints(standing, side, 1);
  } else {
    standing.losses += 1;
    addSideWinPoints(standing, side, 0);
  }
}

function addSideWinPoints(standing: MutableStanding, side: PlayerId, points: number): void {
  if (side === "player") {
    standing.playerSideWinPoints += points;
  } else {
    standing.cpuSideWinPoints += points;
  }
}

function finalizeStanding(standing: MutableStanding): TierStanding {
  const winPointRate = standing.games > 0 ? (standing.wins + standing.draws * 0.5) / standing.games : 0;
  const playerSideWinPointRate = standing.playerSideGames > 0 ? standing.playerSideWinPoints / standing.playerSideGames : 0;
  const cpuSideWinPointRate = standing.cpuSideGames > 0 ? standing.cpuSideWinPoints / standing.cpuSideGames : 0;
  const averageHpDiff = standing.games > 0 ? standing.hpDiffTotal / standing.games : 0;
  const averageTurns = standing.games > 0 ? standing.turnTotal / standing.games : 0;
  const averageSteps = standing.games > 0 ? standing.stepTotal / standing.games : 0;
  const averageGameMs = standing.games > 0 ? standing.elapsedMsTotal / standing.games : 0;
  const averageTurnMs = standing.games > 0 ? standing.averageTurnMsTotal / standing.games : 0;
  const score = winPointRate * 100 + averageHpDiff * 3 - standing.issues * 12;
  return {
    deckPreset: standing.deckPreset,
    deckName: standing.deckName,
    games: standing.games,
    wins: standing.wins,
    losses: standing.losses,
    draws: standing.draws,
    winPointRate: round(winPointRate, 3),
    playerSideWinPointRate: round(playerSideWinPointRate, 3),
    cpuSideWinPointRate: round(cpuSideWinPointRate, 3),
    averageHpDiff: round(averageHpDiff, 2),
    averageTurns: round(averageTurns, 1),
    averageSteps: round(averageSteps, 1),
    averageGameMs: round(averageGameMs, 1),
    averageTurnMs: round(averageTurnMs, 1),
    maxTurnMs: round(standing.maxTurnMs, 1),
    issues: standing.issues,
    score: round(score, 1),
    tier: tierFor(winPointRate, averageHpDiff),
  };
}

function summarizePairs(candidates: readonly DeckPresetId[], games: readonly TierGameResult[]): PairSummary[] {
  const pairs: PairSummary[] = [];
  for (let leftIndex = 0; leftIndex < candidates.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < candidates.length; rightIndex += 1) {
      const deckA = candidates[leftIndex];
      const deckB = candidates[rightIndex];
      const scoped = games.filter(
        (game) =>
          (game.playerDeckPreset === deckA && game.cpuDeckPreset === deckB) ||
          (game.playerDeckPreset === deckB && game.cpuDeckPreset === deckA),
      );
      const deckAWins = scoped.filter((game) => game.winnerDeckPreset === deckA).length;
      const deckBWins = scoped.filter((game) => game.winnerDeckPreset === deckB).length;
      const draws = scoped.filter((game) => !game.winnerDeckPreset).length;
      pairs.push({
        deckA,
        deckB,
        games: scoped.length,
        deckAWins,
        deckBWins,
        draws,
        deckAWinPointRate: scoped.length > 0 ? round((deckAWins + draws * 0.5) / scoped.length, 3) : 0,
      });
    }
  }
  return pairs.sort((a, b) => a.deckA.localeCompare(b.deckA) || a.deckB.localeCompare(b.deckB));
}

function defaultCandidates(top: number): DeckPresetId[] {
  return analyzeDeckSubmissions()
    .filter((audit) => audit.group === "pro-no-rare8-white" && audit.masterId === "white" && !audit.allowSpecial)
    .slice(0, top)
    .map((audit) => audit.id as DeckPresetId);
}

function tierFor(winPointRate: number, averageHpDiff: number): string {
  if (winPointRate >= 0.65 && averageHpDiff >= 0) {
    return "S";
  }
  if (winPointRate >= 0.55) {
    return "A";
  }
  if (winPointRate >= 0.45) {
    return "B";
  }
  if (winPointRate >= 0.35) {
    return "C";
  }
  return "D";
}

function formatConsole(report: TierReport): string {
  return [
    `White no-rare8 tier: ${report.candidates.length} candidates / ${report.totalGames} games`,
    `Games per direction: ${report.gamesPerDirection}`,
    ...report.standings.map(
      (standing, index) =>
        `${index + 1}. [${standing.tier}] ${standing.deckPreset} score ${standing.score} ` +
        `WPR ${formatPercent(standing.winPointRate)} (${standing.wins}-${standing.losses}-${standing.draws}) ` +
        `HP ${standing.averageHpDiff >= 0 ? "+" : ""}${standing.averageHpDiff} ` +
        `P/C ${formatPercent(standing.playerSideWinPointRate)}/${formatPercent(standing.cpuSideWinPointRate)} ` +
        `avgTurn ${standing.averageTurns}`,
    ),
  ].join("\n");
}

function formatMarkdown(report: TierReport): string {
  return [
    "# White No-Rare8 Deck Tier",
    "",
    `生成: ${report.generatedAt}`,
    `候補: ${report.candidates.length}`,
    `試行: ${report.gamesPerDirection} games/matchup/direction`,
    `総試合: ${report.totalGames}`,
    `AI: white profile current default`,
    "",
    "## Tier",
    "",
    "| Rank | Tier | Deck | Score | W-L-D | WPR | Avg HP diff | Seat WPR P/C | Avg turns | Avg turn ms | Issues |",
    "| ---: | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...report.standings.map(
      (standing, index) =>
        `| ${index + 1} | ${standing.tier} | ${standing.deckPreset}<br>${escapeCell(standing.deckName)} | ` +
        `${standing.score} | ${standing.wins}-${standing.losses}-${standing.draws} | ${formatPercent(standing.winPointRate)} | ` +
        `${signed(standing.averageHpDiff)} | ${formatPercent(standing.playerSideWinPointRate)}/${formatPercent(standing.cpuSideWinPointRate)} | ` +
        `${standing.averageTurns} | ${standing.averageTurnMs} | ${standing.issues} |`,
    ),
    "",
    "## Matchup Matrix",
    "",
    "| Deck A | Deck B | Result for A | A WPR |",
    "| --- | --- | ---: | ---: |",
    ...report.pairs.map(
      (pair) =>
        `| ${pair.deckA} | ${pair.deckB} | ${pair.deckAWins}-${pair.deckBWins}-${pair.draws} | ${formatPercent(pair.deckAWinPointRate)} |`,
    ),
    "",
    "## Notes",
    "",
    ...report.notes.map((note) => `- ${note}`),
    "",
  ].join("\n");
}

function progressLine(done: number, total: number, game: TierGameResult): string {
  const result = game.winnerDeckPreset ?? "draw";
  const issue = game.issue ? ` issue=${game.issue}` : "";
  return `[${done}/${total}] ${game.playerDeckPreset} vs ${game.cpuDeckPreset} seed ${game.seed}: ${result} ` +
    `HP ${game.playerHp}-${game.cpuHp} turns ${game.turns} elapsed ${round(game.elapsedMs / 1000, 1)}s${issue}`;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    candidates: [],
    top: 8,
    gamesPerDirection: 1,
    seedStart: 79000,
    maxSteps: 700,
    maxTurns: 160,
    progress: true,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--candidate") {
      parsed.candidates = [...parsed.candidates, readDeckPresetId(arg, next)];
      i += 1;
    } else if (arg === "--top") {
      parsed.top = readNonNegativeInteger(arg, next);
      i += 1;
    } else if (arg === "--games-per-direction") {
      parsed.gamesPerDirection = readNonNegativeInteger(arg, next);
      i += 1;
    } else if (arg === "--seed-start") {
      parsed.seedStart = readNonNegativeInteger(arg, next);
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNonNegativeInteger(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readNonNegativeInteger(arg, next);
      i += 1;
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      i += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
      i += 1;
    } else if (arg === "--no-progress") {
      parsed.progress = false;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return parsed;
}

function readDeckPresetId(name: string, value: string | undefined): DeckPresetId {
  const deckPresetId = readString(name, value) as DeckPresetId;
  getDeckPreset(deckPresetId);
  return deckPresetId;
}

function uniqueDeckPresetIds(values: readonly DeckPresetId[]): DeckPresetId[] {
  return [...new Set(values)];
}

function addTurnElapsed(turnElapsed: Map<string, number>, turnKey: string, elapsedMs: number): void {
  turnElapsed.set(turnKey, (turnElapsed.get(turnKey) ?? 0) + elapsedMs);
}

function escapeCell(value: string): string {
  return escapeMarkdownTableCell(value);
}

function printHelp(): void {
  console.log(`
Usage:
  npm run tier:white-no-rare8 -- [options]

Options:
  --candidate <id>             Explicit deck preset. Can be repeated.
  --top <n>                    Static top no-rare8 white deck count. Default: 8
  --games-per-direction <n>    Games per directed matchup. Default: 1
  --seed-start <n>             First seed. Default: 79000
  --max-steps <n>              Failure threshold per game. Default: 700
  --max-turns <n>              Failure threshold per game. Default: 160
  --markdown <path>            Write Markdown report.
  --json <path>                Write JSON report.
  --no-progress                Suppress per-game progress.
`);
}
