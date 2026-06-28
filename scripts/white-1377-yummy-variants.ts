import { performance } from "node:perf_hooks";
import { getCardName, summarizeDeckCardIds } from "../src/game/cards";
import { getDeckPreset, type DeckPresetId } from "../src/game/deckPresets";
import { createInitialGame, runAutoStep } from "../src/game/rules";
import type { GameState, PlayerId } from "../src/game/types";
import { average, escapeMarkdownTableCell, formatPercent, readNonNegativeInteger, readString, round, signed, writeReport } from "./lib/cli";

type VariantId = "1377-original" | "1377-death-sheep3" | "1377-ash-roro3" | "1377-yummy-death-sheep-ash-roro";

interface CliOptions {
  gamesPerDirection: number;
  seedStart: number;
  maxSteps: number;
  maxTurns: number;
  markdownPath?: string;
  jsonPath?: string;
  progress: boolean;
}

interface VariantCandidate {
  id: VariantId;
  name: string;
  cardIds: string[];
  note: string;
}

interface GameResult {
  seed: number;
  playerVariant: VariantId;
  cpuVariant: VariantId;
  winner?: PlayerId;
  winnerVariant?: VariantId;
  playerHp: number;
  cpuHp: number;
  steps: number;
  turns: number;
  elapsedMs: number;
  averageTurnElapsedMs: number;
  maxTurnElapsedMs: number;
  issue?: string;
}

interface Standing {
  variant: VariantId;
  name: string;
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
}

interface PairSummary {
  variantA: VariantId;
  variantB: VariantId;
  games: number;
  variantAWins: number;
  variantBWins: number;
  draws: number;
  variantAWinPointRate: number;
  averageHpDiffForA: number;
}

interface Report {
  generatedAt: string;
  baseDeckPreset: DeckPresetId;
  variants: VariantCandidate[];
  gamesPerDirection: number;
  seedStart: number;
  totalGames: number;
  games: GameResult[];
  standings: Standing[];
  pairs: PairSummary[];
  notes: string[];
}

interface MutableStanding {
  variant: VariantId;
  name: string;
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

const BASE_DECK_PRESET = "submission-pro-no-rare8-white-1377" as DeckPresetId;
const YUMMY = "card_105";
const DEATH_SHEEP = "card_133";
const ASH_RORO = "card_045";

const options = parseArgs(process.argv.slice(2));
const variants = buildVariants();
const report = runReport(variants, options);
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

function buildVariants(): VariantCandidate[] {
  const base = [...getDeckPreset(BASE_DECK_PRESET).cardIds];
  return [
    {
      id: "1377-original",
      name: "1377原型",
      cardIds: base,
      note: "ヤミー3枚をそのまま残す現行基準。",
    },
    {
      id: "1377-death-sheep3",
      name: "1377 ヤミー3 -> デスシープ3",
      cardIds: replaceYummies(base, [DEATH_SHEEP, DEATH_SHEEP, DEATH_SHEEP]),
      note: "石妨害を捨て、前衛の拘束・受け性能を厚くする。",
    },
    {
      id: "1377-ash-roro3",
      name: "1377 ヤミー3 -> アーシュ＆ロロ3",
      cardIds: replaceYummies(base, [ASH_RORO, ASH_RORO, ASH_RORO]),
      note: "石妨害を捨て、前衛からの打点・射程変化を厚くする。",
    },
    {
      id: "1377-yummy-death-sheep-ash-roro",
      name: "1377 ヤミー/デスシープ/アーシュ＆ロロ各1",
      cardIds: replaceYummies(base, [YUMMY, DEATH_SHEEP, ASH_RORO]),
      note: "石妨害・拘束・打点変化を1枚ずつ散らす。",
    },
  ];
}

function replaceYummies(base: readonly string[], replacements: readonly string[]): string[] {
  const cardIds = [...base];
  const indexes = cardIds.flatMap((cardId, index) => (cardId === YUMMY ? [index] : []));
  if (indexes.length !== replacements.length) {
    throw new Error(`Expected ${replacements.length} Yummy slots, got ${indexes.length}`);
  }
  indexes.forEach((index, replacementIndex) => {
    cardIds[index] = replacements[replacementIndex];
  });
  return cardIds;
}

function runReport(variants: readonly VariantCandidate[], options: CliOptions): Report {
  validateVariants(variants);
  const games: GameResult[] = [];
  const pairCount = (variants.length * (variants.length - 1)) / 2;
  const totalPlannedGames = pairCount * 2 * options.gamesPerDirection;
  let runIndex = 0;

  for (let leftIndex = 0; leftIndex < variants.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < variants.length; rightIndex += 1) {
      const left = variants[leftIndex];
      const right = variants[rightIndex];
      for (const [playerVariant, cpuVariant] of [[left, right], [right, left]] as const) {
        for (let gameIndex = 0; gameIndex < options.gamesPerDirection; gameIndex += 1) {
          const seed = options.seedStart + runIndex * options.gamesPerDirection + gameIndex;
          const game = runGame(seed, playerVariant, cpuVariant, options);
          games.push(game);
          if (options.progress) {
            console.log(progressLine(games.length, totalPlannedGames, game));
          }
        }
        runIndex += 1;
      }
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    baseDeckPreset: BASE_DECK_PRESET,
    variants: [...variants],
    gamesPerDirection: options.gamesPerDirection,
    seedStart: options.seedStart,
    totalGames: games.length,
    games,
    standings: summarizeStandings(variants, games),
    pairs: summarizePairs(variants, games),
    notes: [
      "AI は両席とも current white profile。デッキ以外のAI設定は変えていない。",
      "1377のヤミー3枠だけを差し替え、他29/30枚または27/30枚の構成は固定した。",
      "小母数の派生比較なので、上位候補は別seed・中母数で再確認する前提。",
    ],
  };
}

function validateVariants(variants: readonly VariantCandidate[]): void {
  for (const variant of variants) {
    const summary = summarizeDeckCardIds(variant.cardIds, [], { allowSpecial: false });
    if (!summary.valid) {
      throw new Error(`${variant.id} is invalid: ${summary.errors.join(" / ")}`);
    }
  }
}

function runGame(
  seed: number,
  playerVariant: VariantCandidate,
  cpuVariant: VariantCandidate,
  options: CliOptions,
): GameResult {
  let game = createInitialGame(seed, {
    masterIds: { player: "white", cpu: "white" },
    playerDeckCardIds: playerVariant.cardIds,
    cpuDeckCardIds: cpuVariant.cardIds,
    allowSpecialDecks: { player: false, cpu: false },
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

  return summarizeGame(seed, playerVariant.id, cpuVariant.id, game, steps, elapsedMs, turnElapsed, issue);
}

function summarizeGame(
  seed: number,
  playerVariant: VariantId,
  cpuVariant: VariantId,
  game: GameState,
  steps: number,
  elapsedMs: number,
  turnElapsed: Map<string, number>,
  issue?: string,
): GameResult {
  const turnElapsedValues = [...turnElapsed.values()];
  return {
    seed,
    playerVariant,
    cpuVariant,
    winner: game.winner,
    winnerVariant: game.winner === "player" ? playerVariant : game.winner === "cpu" ? cpuVariant : undefined,
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

function summarizeStandings(variants: readonly VariantCandidate[], games: readonly GameResult[]): Standing[] {
  const records = new Map<VariantId, MutableStanding>(
    variants.map((variant) => [variant.id, createStanding(variant)]),
  );

  for (const game of games) {
    applyStanding(records.get(game.playerVariant), game.playerVariant, "player", game);
    applyStanding(records.get(game.cpuVariant), game.cpuVariant, "cpu", game);
  }

  return [...records.values()]
    .map(finalizeStanding)
    .sort((a, b) => b.score - a.score || b.winPointRate - a.winPointRate || b.averageHpDiff - a.averageHpDiff);
}

function createStanding(variant: VariantCandidate): MutableStanding {
  return {
    variant: variant.id,
    name: variant.name,
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
  variant: VariantId,
  side: PlayerId,
  game: GameResult,
): void {
  if (!standing) {
    throw new Error(`Unknown standing: ${variant}`);
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

  if (!game.winnerVariant) {
    standing.draws += 1;
    addSideWinPoints(standing, side, 0.5);
  } else if (game.winnerVariant === variant) {
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

function finalizeStanding(standing: MutableStanding): Standing {
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
    variant: standing.variant,
    name: standing.name,
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
  };
}

function summarizePairs(variants: readonly VariantCandidate[], games: readonly GameResult[]): PairSummary[] {
  const pairs: PairSummary[] = [];
  for (let leftIndex = 0; leftIndex < variants.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < variants.length; rightIndex += 1) {
      const variantA = variants[leftIndex].id;
      const variantB = variants[rightIndex].id;
      const scoped = games.filter(
        (game) =>
          (game.playerVariant === variantA && game.cpuVariant === variantB) ||
          (game.playerVariant === variantB && game.cpuVariant === variantA),
      );
      const variantAWins = scoped.filter((game) => game.winnerVariant === variantA).length;
      const variantBWins = scoped.filter((game) => game.winnerVariant === variantB).length;
      const draws = scoped.filter((game) => !game.winnerVariant).length;
      const hpDiffForA = scoped.reduce((sum, game) => {
        if (game.playerVariant === variantA) {
          return sum + game.playerHp - game.cpuHp;
        }
        return sum + game.cpuHp - game.playerHp;
      }, 0);
      pairs.push({
        variantA,
        variantB,
        games: scoped.length,
        variantAWins,
        variantBWins,
        draws,
        variantAWinPointRate: scoped.length > 0 ? round((variantAWins + draws * 0.5) / scoped.length, 3) : 0,
        averageHpDiffForA: scoped.length > 0 ? round(hpDiffForA / scoped.length, 2) : 0,
      });
    }
  }
  return pairs;
}

function formatConsole(report: Report): string {
  return [
    `White 1377 Yummy variants: ${report.variants.length} variants / ${report.totalGames} games`,
    `Games per direction: ${report.gamesPerDirection}`,
    ...report.standings.map(
      (standing, index) =>
        `${index + 1}. ${standing.variant} score ${standing.score} ` +
        `WPR ${formatPercent(standing.winPointRate)} (${standing.wins}-${standing.losses}-${standing.draws}) ` +
        `HP ${signed(standing.averageHpDiff)} ` +
        `P/C ${formatPercent(standing.playerSideWinPointRate)}/${formatPercent(standing.cpuSideWinPointRate)} ` +
        `avgTurn ${standing.averageTurns}`,
    ),
  ].join("\n");
}

function formatMarkdown(report: Report): string {
  return [
    "# White 1377 Yummy Variant Check",
    "",
    `生成: ${report.generatedAt}`,
    `基準デッキ: ${report.baseDeckPreset}`,
    `試行: ${report.gamesPerDirection} games/matchup/direction`,
    `総試合: ${report.totalGames}`,
    `AI: white profile current default`,
    "",
    "## Variants",
    "",
    "| Variant | 構成差分 | 前衛/後衛/魔法 | Note |",
    "| --- | --- | ---: | --- |",
    ...report.variants.map((variant) => {
      const summary = summarizeDeckCardIds(variant.cardIds, [], { allowSpecial: false });
      return `| ${variant.id}<br>${escapeCell(variant.name)} | ${escapeCell(formatYummySlots(variant.cardIds))} | ` +
        `${summary.categories.front}/${summary.categories.back}/${summary.categories.magic} | ${escapeCell(variant.note)} |`;
    }),
    "",
    "## Standings",
    "",
    "| Rank | Variant | Score | W-L-D | WPR | Avg HP diff | Seat WPR P/C | Avg turns | Avg turn ms | Issues |",
    "| ---: | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...report.standings.map(
      (standing, index) =>
        `| ${index + 1} | ${standing.variant}<br>${escapeCell(standing.name)} | ${standing.score} | ` +
        `${standing.wins}-${standing.losses}-${standing.draws} | ${formatPercent(standing.winPointRate)} | ` +
        `${signed(standing.averageHpDiff)} | ${formatPercent(standing.playerSideWinPointRate)}/${formatPercent(standing.cpuSideWinPointRate)} | ` +
        `${standing.averageTurns} | ${standing.averageTurnMs} | ${standing.issues} |`,
    ),
    "",
    "## Matchup Matrix",
    "",
    "| Variant A | Variant B | Result for A | A WPR | Avg HP diff for A |",
    "| --- | --- | ---: | ---: | ---: |",
    ...report.pairs.map(
      (pair) =>
        `| ${pair.variantA} | ${pair.variantB} | ${pair.variantAWins}-${pair.variantBWins}-${pair.draws} | ` +
        `${formatPercent(pair.variantAWinPointRate)} | ${signed(pair.averageHpDiffForA)} |`,
    ),
    "",
    "## Reading",
    "",
    ...formatReading(report).map((line) => `- ${line}`),
    "",
    "## Notes",
    "",
    ...report.notes.map((note) => `- ${note}`),
    "",
  ].join("\n");
}

function formatYummySlots(cardIds: readonly string[]): string {
  const counts = new Map<string, number>();
  for (const cardId of [YUMMY, DEATH_SHEEP, ASH_RORO]) {
    counts.set(cardId, cardIds.filter((candidate) => candidate === cardId).length);
  }
  return [YUMMY, DEATH_SHEEP, ASH_RORO]
    .map((cardId) => `${getCardName(cardId)}x${counts.get(cardId) ?? 0}`)
    .join(" / ");
}

function formatReading(report: Report): string[] {
  const original = report.standings.find((standing) => standing.variant === "1377-original");
  const best = report.standings[0];
  const directVsOriginal = report.pairs.filter(
    (pair) => pair.variantA === "1377-original" || pair.variantB === "1377-original",
  );
  const lines = [
    `暫定1位は ${best.variant}（WPR ${formatPercent(best.winPointRate)}, 平均HP差 ${signed(best.averageHpDiff)}）。`,
  ];
  if (original) {
    lines.push(`1377原型は ${report.standings.findIndex((standing) => standing.variant === "1377-original") + 1}位（WPR ${formatPercent(original.winPointRate)}, 平均HP差 ${signed(original.averageHpDiff)}）。`);
  }
  for (const pair of directVsOriginal) {
    const originalIsA = pair.variantA === "1377-original";
    const opponent = originalIsA ? pair.variantB : pair.variantA;
    const originalWpr = originalIsA ? pair.variantAWinPointRate : 1 - pair.variantAWinPointRate;
    const originalHp = originalIsA ? pair.averageHpDiffForA : -pair.averageHpDiffForA;
    lines.push(`原型 vs ${opponent}: 原型側 WPR ${formatPercent(originalWpr)}, 平均HP差 ${signed(round(originalHp, 2))}。`);
  }
  return lines;
}

function progressLine(done: number, total: number, game: GameResult): string {
  const result = game.winnerVariant ?? "draw";
  const issue = game.issue ? ` issue=${game.issue}` : "";
  return `[${done}/${total}] ${game.playerVariant} vs ${game.cpuVariant} seed ${game.seed}: ${result} ` +
    `HP ${game.playerHp}-${game.cpuHp} turns ${game.turns} elapsed ${round(game.elapsedMs / 1000, 1)}s${issue}`;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    gamesPerDirection: 2,
    seedStart: 81200,
    maxSteps: 700,
    maxTurns: 160,
    progress: true,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--games-per-direction") {
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

function addTurnElapsed(turnElapsed: Map<string, number>, turnKey: string, elapsedMs: number): void {
  turnElapsed.set(turnKey, (turnElapsed.get(turnKey) ?? 0) + elapsedMs);
}

function escapeCell(value: string): string {
  return escapeMarkdownTableCell(value);
}

function printHelp(): void {
  console.log(`
Usage:
  vite-node scripts/white-1377-yummy-variants.ts [options]

Options:
  --games-per-direction <n>    Games per directed matchup. Default: 2
  --seed-start <n>             First seed. Default: 81200
  --max-steps <n>              Failure threshold per game. Default: 700
  --max-turns <n>              Failure threshold per game. Default: 160
  --markdown <path>            Write Markdown report.
  --json <path>                Write JSON report.
  --no-progress                Suppress per-game progress.
`);
}
