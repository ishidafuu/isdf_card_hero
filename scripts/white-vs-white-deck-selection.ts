import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { getDeckPreset, type DeckPresetId } from "../src/game/deckPresets";
import { analyzeDeckSubmissions } from "../src/game/deckTemplateAnalysis";
import { validateMasterLabAutoPlay, type MasterLabAutoPlayResult } from "../src/game/masterLabAutoPlay";
import type { PlayerId } from "../src/game/types";

interface CliOptions {
  candidates: DeckPresetId[];
  topSubmissions: number;
  gamesPerPairing: number;
  seedStart: number;
  maxSteps: number;
  maxTurns: number;
  markdownPath?: string;
  jsonPath?: string;
}

interface WhiteDeckSelectionRun {
  id: string;
  playerDeckPreset: DeckPresetId;
  cpuDeckPreset: DeckPresetId;
  seedStart: number;
  games: number;
  result: MasterLabAutoPlayResult;
}

interface MutableWhiteDeckStanding {
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
  totalSteps: number;
  totalTurns: number;
  failures: number;
  warnings: number;
}

interface WhiteDeckStanding extends MutableWhiteDeckStanding {
  winPointRate: number;
  playerSideWinPointRate: number;
  cpuSideWinPointRate: number;
  averageSteps: number;
  averageTurns: number;
  score: number;
}

interface WhiteDeckSelectionReport {
  generatedAt: string;
  candidates: DeckPresetId[];
  gamesPerPairing: number;
  seedStart: number;
  totalGames: number;
  runs: WhiteDeckSelectionRun[];
  standings: WhiteDeckStanding[];
}

const DEFAULT_EXPLICIT_CANDIDATES = [
  "pressure-normal",
  "balanced-normal",
  "master-lab-white-1377-death-sheep3",
  "submission-pro-no-rare8-white-1377",
  "submission-pro-with-rare8-white-975",
] as const satisfies readonly DeckPresetId[];

const options = parseArgs(process.argv.slice(2));
const report = runWhiteDeckSelection(options);
const markdown = formatMarkdown(report);
const json = JSON.stringify(compactReport(report), null, 2);

console.log(formatConsole(report));
if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, json);
  console.log(`JSON: ${options.jsonPath}`);
}

function runWhiteDeckSelection(options: CliOptions): WhiteDeckSelectionReport {
  const candidates = options.candidates.length > 0
    ? uniqueDeckPresetIds(options.candidates)
    : defaultCandidates(options.topSubmissions);
  const runs: WhiteDeckSelectionRun[] = [];
  let runIndex = 0;

  for (let leftIndex = 0; leftIndex < candidates.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < candidates.length; rightIndex += 1) {
      const left = candidates[leftIndex];
      const right = candidates[rightIndex];
      for (const [playerDeckPreset, cpuDeckPreset] of [[left, right], [right, left]] as const) {
        const runSeedStart = options.seedStart + runIndex * options.gamesPerPairing;
        runs.push({
          id: `${playerDeckPreset}_vs_${cpuDeckPreset}`,
          playerDeckPreset,
          cpuDeckPreset,
          seedStart: runSeedStart,
          games: options.gamesPerPairing,
          result: validateMasterLabAutoPlay({
            seedStart: runSeedStart,
            count: options.gamesPerPairing,
            maxSteps: options.maxSteps,
            maxTurns: options.maxTurns,
            participants: { player: "white", cpu: "white" },
            aiProfile: "white",
            aiProfiles: { player: "white", cpu: "white" },
            deckPresets: { player: playerDeckPreset, cpu: cpuDeckPreset },
            includeGameHistory: false,
          }),
        });
        runIndex += 1;
      }
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    candidates,
    gamesPerPairing: options.gamesPerPairing,
    seedStart: options.seedStart,
    totalGames: runs.reduce((total, run) => total + run.result.summary.games, 0),
    runs,
    standings: summarizeStandings(candidates, runs),
  };
}

function defaultCandidates(topSubmissions: number): DeckPresetId[] {
  const topWhiteSubmissions = analyzeDeckSubmissions()
    .filter((audit) => audit.masterId === "white")
    .slice(0, topSubmissions)
    .map((audit) => audit.id as DeckPresetId);
  return uniqueDeckPresetIds([...topWhiteSubmissions, ...DEFAULT_EXPLICIT_CANDIDATES]);
}

function summarizeStandings(
  candidates: readonly DeckPresetId[],
  runs: readonly WhiteDeckSelectionRun[],
): WhiteDeckStanding[] {
  const records = new Map<DeckPresetId, MutableWhiteDeckStanding>(
    candidates.map((deckPreset) => [deckPreset, createStanding(deckPreset)]),
  );

  for (const run of runs) {
    for (const game of run.result.games) {
      applyGame(records.get(run.playerDeckPreset), run.playerDeckPreset, run.cpuDeckPreset, "player", game);
      applyGame(records.get(run.cpuDeckPreset), run.cpuDeckPreset, run.playerDeckPreset, "cpu", game);
    }
  }

  return [...records.values()]
    .map(finalizeStanding)
    .sort((a, b) =>
      b.score - a.score ||
      b.winPointRate - a.winPointRate ||
      a.failures - b.failures ||
      a.warnings - b.warnings ||
      a.averageTurns - b.averageTurns ||
      a.deckPreset.localeCompare(b.deckPreset),
    );
}

function createStanding(deckPreset: DeckPresetId): MutableWhiteDeckStanding {
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
    totalSteps: 0,
    totalTurns: 0,
    failures: 0,
    warnings: 0,
  };
}

function applyGame(
  standing: MutableWhiteDeckStanding | undefined,
  ownDeckPreset: DeckPresetId,
  opponentDeckPreset: DeckPresetId,
  side: PlayerId,
  game: MasterLabAutoPlayResult["games"][number],
): void {
  if (!standing) {
    throw new Error(`Unknown standing for ${ownDeckPreset}`);
  }
  standing.games += 1;
  standing.totalSteps += game.steps;
  standing.totalTurns += game.turns;
  standing.failures += game.issueCount;
  standing.warnings += game.warningCount;
  if (side === "player") {
    standing.playerSideGames += 1;
  } else {
    standing.cpuSideGames += 1;
  }

  const winnerDeckPreset = game.winner === "player"
    ? side === "player" ? ownDeckPreset : opponentDeckPreset
    : game.winner === "cpu"
      ? side === "cpu" ? ownDeckPreset : opponentDeckPreset
      : undefined;

  if (!winnerDeckPreset) {
    standing.draws += 1;
    addSideWinPoints(standing, side, 0.5);
  } else if (winnerDeckPreset === ownDeckPreset) {
    standing.wins += 1;
    addSideWinPoints(standing, side, 1);
  } else {
    standing.losses += 1;
    addSideWinPoints(standing, side, 0);
  }
}

function addSideWinPoints(standing: MutableWhiteDeckStanding, side: PlayerId, points: number): void {
  if (side === "player") {
    standing.playerSideWinPoints += points;
  } else {
    standing.cpuSideWinPoints += points;
  }
}

function finalizeStanding(standing: MutableWhiteDeckStanding): WhiteDeckStanding {
  const winPoints = standing.wins + standing.draws * 0.5;
  const winPointRate = standing.games > 0 ? winPoints / standing.games : 0;
  const playerSideWinPointRate = standing.playerSideGames > 0 ? standing.playerSideWinPoints / standing.playerSideGames : 0;
  const cpuSideWinPointRate = standing.cpuSideGames > 0 ? standing.cpuSideWinPoints / standing.cpuSideGames : 0;
  const averageSteps = standing.games > 0 ? standing.totalSteps / standing.games : 0;
  const averageTurns = standing.games > 0 ? standing.totalTurns / standing.games : 0;
  return {
    ...standing,
    winPointRate: round(winPointRate, 3),
    playerSideWinPointRate: round(playerSideWinPointRate, 3),
    cpuSideWinPointRate: round(cpuSideWinPointRate, 3),
    averageSteps: round(averageSteps, 1),
    averageTurns: round(averageTurns, 1),
    score: round(winPointRate * 100 - standing.failures * 20 - standing.warnings * 3 + Math.max(0, 18 - averageTurns) * 0.2, 1),
  };
}

function formatConsole(report: WhiteDeckSelectionReport): string {
  return [
    `White vs White deck selection: ${report.candidates.length} candidates / ${report.totalGames} games`,
    `Games per directed pairing: ${report.gamesPerPairing}`,
    "Top:",
    ...report.standings.slice(0, 8).map((standing, index) =>
      `${index + 1}. ${standing.deckPreset} score ${standing.score} ` +
      `WPR ${formatPercent(standing.winPointRate)} (${standing.wins}-${standing.losses}-${standing.draws}) ` +
      `P/C ${formatPercent(standing.playerSideWinPointRate)}/${formatPercent(standing.cpuSideWinPointRate)} ` +
      `avg ${standing.averageTurns} turns issues ${standing.failures}F/${standing.warnings}W`,
    ),
  ].join("\n");
}

function formatMarkdown(report: WhiteDeckSelectionReport): string {
  return [
    "# White vs White Deck Selection",
    "",
    `生成: ${report.generatedAt}`,
    `候補: ${report.candidates.length}`,
    `試行: ${report.gamesPerPairing} games/pairing/direction`,
    `総試合: ${report.totalGames}`,
    "",
    "## 結果",
    "",
    "| Rank | Deck | Score | W-L-D | WPR | Seat WPR P/C | Avg turns | Avg steps | Issues |",
    "| ---: | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |",
    ...report.standings.map((standing, index) =>
      `| ${index + 1} | ${standing.deckPreset}<br>${escapeCell(standing.deckName)} | ${standing.score} | ` +
      `${standing.wins}-${standing.losses}-${standing.draws} | ${formatPercent(standing.winPointRate)} | ` +
      `${formatPercent(standing.playerSideWinPointRate)}/${formatPercent(standing.cpuSideWinPointRate)} | ` +
      `${standing.averageTurns} | ${standing.averageSteps} | ${standing.failures}F/${standing.warnings}W |`,
    ),
    "",
    "## Runs",
    "",
    "| Run | Result | Issues |",
    "| --- | --- | ---: |",
    ...report.runs.map((run) =>
      `| ${run.playerDeckPreset} vs ${run.cpuDeckPreset} | ` +
      `P ${run.result.summary.winners.player} / C ${run.result.summary.winners.cpu} / D ${run.result.summary.undecided} | ` +
      `${run.result.summary.failures}F/${run.result.summary.warnings}W |`,
    ),
    "",
  ].join("\n");
}

function compactReport(report: WhiteDeckSelectionReport): Omit<WhiteDeckSelectionReport, "runs"> & {
  runs: Array<Omit<WhiteDeckSelectionRun, "result"> & {
    result: Pick<MasterLabAutoPlayResult, "ok" | "seeds" | "options" | "summary">;
  }>;
} {
  return {
    ...report,
    runs: report.runs.map((run) => ({
      ...run,
      result: {
        ok: run.result.ok,
        seeds: run.result.seeds,
        options: run.result.options,
        summary: run.result.summary,
      },
    })),
  };
}

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${content}\n`);
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    candidates: [],
    topSubmissions: 8,
    gamesPerPairing: 2,
    seedStart: 41000,
    maxSteps: 700,
    maxTurns: 160,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--candidate") {
      parsed.candidates = [...parsed.candidates, readDeckPresetId(arg, next)];
      i += 1;
    } else if (arg === "--top-submissions") {
      parsed.topSubmissions = readNumber(arg, next);
      i += 1;
    } else if (arg === "--games-per-pairing") {
      parsed.gamesPerPairing = readNumber(arg, next);
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

function readDeckPresetId(name: string, value: string | undefined): DeckPresetId {
  const deckPresetId = readString(name, value) as DeckPresetId;
  getDeckPreset(deckPresetId);
  return deckPresetId;
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

function uniqueDeckPresetIds(values: readonly DeckPresetId[]): DeckPresetId[] {
  return [...new Set(values)];
}

function formatPercent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

function round(value: number, precision: number): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function escapeCell(value: string): string {
  return value.replaceAll("|", "\\|");
}

function printHelp(): void {
  console.log(`
Usage:
  npm run select:white-deck -- [options]

Options:
  --candidate <id>          Explicit deck preset. Can be repeated. Defaults to top white submissions plus key defaults.
  --top-submissions <n>     Top white submission count from static audit. Default: 8
  --games-per-pairing <n>   Games for each directed pairing. Default: 2
  --seed-start <n>          First seed. Default: 41000
  --max-steps <n>           Failure threshold per game. Default: 700
  --max-turns <n>           Failure threshold per game. Default: 160
  --markdown <path>         Write Markdown report.
  --json <path>             Write JSON report.
`);
}
