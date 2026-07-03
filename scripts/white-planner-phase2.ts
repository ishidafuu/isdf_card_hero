import { performance } from "node:perf_hooks";
import {
  applyCpuDecision,
  chooseCpuDecision,
  type CpuAiProfile,
  type CpuDecision,
} from "../src/game/cpuAi";
import { getCardName } from "../src/game/cards";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, type DeckPresetId } from "../src/game/deckPresets";
import { createInitialGame, runAutoStep, targetToKey } from "../src/game/rules";
import type { GameState, PlayerId, SlotKey } from "../src/game/types";
import { escapeMarkdownTableCell, readInteger, readString, round, writeReport } from "./lib/cli";

type Direction = "challenger-as-cpu" | "challenger-as-player";

interface CliOptions {
  seedStart: number;
  count: number;
  maxSteps: number;
  maxTurns: number;
  deckPreset: DeckPresetId;
  directions: Direction[];
  maxDiffSamples: number;
  markdownPath?: string;
  jsonPath?: string;
}

interface TimedDecision {
  profile: CpuAiProfile;
  decision: CpuDecision;
  signature: string;
  elapsedMs: number;
}

interface ProfileTiming {
  profile: CpuAiProfile;
  decisions: number;
  elapsedMs: number;
  maxDecisionMs: number;
}

interface PlannerGameResult {
  direction: Direction;
  seed: number;
  profiles: Record<PlayerId, CpuAiProfile>;
  winner?: PlayerId;
  winnerProfile?: CpuAiProfile;
  steps: number;
  turns: number;
  issue?: string;
  playerHp: number;
  cpuHp: number;
  timings: ProfileTiming[];
  diffCount: number;
  plannerSelectedDiffCount: number;
  diffSamples: DecisionDiffSample[];
}

interface DecisionDiffSample {
  direction: Direction;
  seed: number;
  step: number;
  turn: number;
  currentPlayer: PlayerId;
  activeProfile: CpuAiProfile;
  board: string;
  whiteDecision: string;
  whitePlannerDecision: string;
  selectedProfile: CpuAiProfile;
  selectedDecision: string;
  whiteReason: string;
  whitePlannerReason: string;
  whiteMs: number;
  whitePlannerMs: number;
}

interface Phase2Report {
  generatedAt: string;
  options: CliOptions;
  games: PlannerGameResult[];
  summary: {
    games: number;
    wins: Partial<Record<CpuAiProfile, number>>;
    draws: number;
    issues: number;
    diffCount: number;
    plannerSelectedDiffCount: number;
    timings: ProfileTiming[];
  };
  reading: string[];
  nextSteps: string[];
}

const DEFAULT_OPTIONS: CliOptions = {
  seedStart: 994100,
  count: 2,
  maxSteps: 140,
  maxTurns: 50,
  deckPreset: "master-lab-white-1377-death-sheep3",
  directions: ["challenger-as-cpu"],
  maxDiffSamples: 24,
};

const options = parseArgs(process.argv.slice(2));
const report = runReport(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
}

console.log(`White planner phase2: ${report.summary.games} games, issues ${report.summary.issues}`);
console.log(`diff ${report.summary.diffCount}, planner-selected diff ${report.summary.plannerSelectedDiffCount}`);
for (const timing of report.summary.timings) {
  console.log(`${timing.profile}: decisions ${timing.decisions}, avg ${formatMs(timing.elapsedMs / Math.max(1, timing.decisions))}, max ${formatMs(timing.maxDecisionMs)}`);
}
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runReport(options: CliOptions): Phase2Report {
  const games: PlannerGameResult[] = [];
  for (const direction of options.directions) {
    for (let index = 0; index < options.count; index += 1) {
      const seed = options.seedStart + index;
      games.push(runGame(seed, direction, options));
    }
  }

  const summary = summarizeReport(games);
  return {
    generatedAt: new Date().toISOString(),
    options,
    games,
    summary,
    reading: buildReading(summary),
    nextSteps: buildNextSteps(summary),
  };
}

function runGame(seed: number, direction: Direction, options: CliOptions): PlannerGameResult {
  let game = createWhiteMirrorGame(seed, options.deckPreset);
  const profiles = profilesForDirection(direction);
  const timings = new Map<CpuAiProfile, ProfileTiming>();
  const diffSamples: DecisionDiffSample[] = [];
  let diffCount = 0;
  let plannerSelectedDiffCount = 0;
  let issue: string | undefined;
  let steps = 0;

  for (; steps < options.maxSteps && !game.winner; steps += 1) {
    if (game.turnNumber > options.maxTurns) {
      issue = `turn ${game.turnNumber} exceeded limit ${options.maxTurns}`;
      break;
    }
    if (game.pendingLevelUp) {
      game = runAutoStep(game, { profiles });
      continue;
    }

    const currentPlayer = game.currentPlayer;
    const activeProfile = profiles[currentPlayer];
    const white = chooseTimedDecision(game, "white");
    const planner = chooseTimedDecision(game, "white_planner");
    addTiming(timings, white);
    addTiming(timings, planner);

    const selected = activeProfile === "white_planner" ? planner : white;
    if (white.signature !== planner.signature) {
      diffCount += 1;
      if (activeProfile === "white_planner") {
        plannerSelectedDiffCount += 1;
      }
      if (diffSamples.length < options.maxDiffSamples) {
        diffSamples.push(createDiffSample(direction, seed, steps, game, activeProfile, white, planner, selected));
      }
    }

    game = applyCpuDecision(game, selected.decision);
  }

  if (!game.winner && !issue) {
    issue = `winner was not decided within ${options.maxSteps} auto steps`;
  }

  return {
    direction,
    seed,
    profiles,
    winner: game.winner,
    winnerProfile: game.winner ? profiles[game.winner] : undefined,
    steps,
    turns: game.turnNumber,
    issue,
    playerHp: game.players.player.masterHp,
    cpuHp: game.players.cpu.masterHp,
    timings: [...timings.values()],
    diffCount,
    plannerSelectedDiffCount,
    diffSamples,
  };
}

function createWhiteMirrorGame(seed: number, deckPreset: DeckPresetId): GameState {
  const deck = buildDeckPresetCardIds(deckPreset);
  const allowSpecial = deckPresetAllowsSpecial(deckPreset);
  return createInitialGame(seed, {
    masterIds: { player: "white", cpu: "white" },
    playerDeckCardIds: deck,
    cpuDeckCardIds: deck,
    allowSpecialDecks: { player: allowSpecial, cpu: allowSpecial },
  });
}

function profilesForDirection(direction: Direction): Record<PlayerId, CpuAiProfile> {
  if (direction === "challenger-as-cpu") {
    return { player: "white", cpu: "white_planner" };
  }
  return { player: "white_planner", cpu: "white" };
}

function chooseTimedDecision(state: GameState, profile: CpuAiProfile): TimedDecision {
  const startedAt = performance.now();
  const decision = chooseCpuDecision(state, { profile });
  return {
    profile,
    decision,
    signature: decisionSignature(decision),
    elapsedMs: performance.now() - startedAt,
  };
}

function addTiming(timings: Map<CpuAiProfile, ProfileTiming>, timed: TimedDecision): void {
  const current = timings.get(timed.profile) ?? {
    profile: timed.profile,
    decisions: 0,
    elapsedMs: 0,
    maxDecisionMs: 0,
  };
  current.decisions += 1;
  current.elapsedMs += timed.elapsedMs;
  current.maxDecisionMs = Math.max(current.maxDecisionMs, timed.elapsedMs);
  timings.set(timed.profile, current);
}

function createDiffSample(
  direction: Direction,
  seed: number,
  step: number,
  game: GameState,
  activeProfile: CpuAiProfile,
  white: TimedDecision,
  planner: TimedDecision,
  selected: TimedDecision,
): DecisionDiffSample {
  return {
    direction,
    seed,
    step,
    turn: game.turnNumber,
    currentPlayer: game.currentPlayer,
    activeProfile,
    board: boardLine(game),
    whiteDecision: white.signature,
    whitePlannerDecision: planner.signature,
    selectedProfile: selected.profile,
    selectedDecision: selected.signature,
    whiteReason: white.decision.reason,
    whitePlannerReason: planner.decision.reason,
    whiteMs: round(white.elapsedMs, 1),
    whitePlannerMs: round(planner.elapsedMs, 1),
  };
}

function summarizeReport(games: readonly PlannerGameResult[]): Phase2Report["summary"] {
  const wins: Partial<Record<CpuAiProfile, number>> = {};
  const timings = new Map<CpuAiProfile, ProfileTiming>();
  let draws = 0;
  for (const game of games) {
    if (game.winnerProfile) {
      wins[game.winnerProfile] = (wins[game.winnerProfile] ?? 0) + 1;
    } else {
      draws += 1;
    }
    for (const timing of game.timings) {
      const current = timings.get(timing.profile) ?? {
        profile: timing.profile,
        decisions: 0,
        elapsedMs: 0,
        maxDecisionMs: 0,
      };
      current.decisions += timing.decisions;
      current.elapsedMs += timing.elapsedMs;
      current.maxDecisionMs = Math.max(current.maxDecisionMs, timing.maxDecisionMs);
      timings.set(timing.profile, current);
    }
  }
  return {
    games: games.length,
    wins,
    draws,
    issues: games.filter((game) => game.issue).length,
    diffCount: games.reduce((total, game) => total + game.diffCount, 0),
    plannerSelectedDiffCount: games.reduce((total, game) => total + game.plannerSelectedDiffCount, 0),
    timings: [...timings.values()].sort((a, b) => a.profile.localeCompare(b.profile)),
  };
}

function buildReading(summary: Phase2Report["summary"]): string[] {
  const plannerTiming = summary.timings.find((timing) => timing.profile === "white_planner");
  const lines: string[] = [];
  if (plannerTiming) {
    const averageMs = plannerTiming.elapsedMs / Math.max(1, plannerTiming.decisions);
    lines.push(`white_planner average decision ${formatMs(averageMs)}, max ${formatMs(plannerTiming.maxDecisionMs)}.`);
  }
  if (summary.diffCount === 0) {
    lines.push("white_planner did not diverge from white in this sample; increase seeds or root width before judging strength.");
  } else {
    lines.push(`white_planner diverged from white ${summary.diffCount} times; inspect samples before changing search depth.`);
  }
  if (summary.issues > 0) {
    lines.push("Some games hit the step/turn cap. Treat W-L-D as incomplete and use this run mainly for timing and decision-diff inspection.");
  }
  return lines;
}

function buildNextSteps(summary: Phase2Report["summary"]): string[] {
  const plannerTiming = summary.timings.find((timing) => timing.profile === "white_planner");
  const averageMs = plannerTiming ? plannerTiming.elapsedMs / Math.max(1, plannerTiming.decisions) : 0;
  const steps = [
    "Review decision diff samples and classify good/bad planner divergences.",
    "If planner average decision time stays practical, run both directions with count 3-5.",
  ];
  if (averageMs < 1_000 && summary.diffCount > 0) {
    steps.push("Try opponentTerminalPlanDepth 2 as a v2 candidate.");
  } else {
    steps.push("Keep opponentTerminalPlanDepth 1 until decision time and divergence quality are stable.");
  }
  return steps;
}

function formatMarkdown(report: Phase2Report): string {
  const lines = [
    "# White Planner Phase 2",
    "",
    `生成: ${report.generatedAt}`,
    `deck: \`${report.options.deckPreset}\``,
    `seeds: ${report.options.seedStart}-${report.options.seedStart + report.options.count - 1}`,
    `directions: ${report.options.directions.join(", ")}`,
    "",
    "## Summary",
    "",
    `- games: ${report.summary.games}`,
    `- wins: ${Object.entries(report.summary.wins).map(([profile, count]) => `${profile} ${count}`).join(", ") || "-"}`,
    `- draws/undecided: ${report.summary.draws}`,
    `- issues: ${report.summary.issues}`,
    `- decision diffs: ${report.summary.diffCount}`,
    `- planner-selected diffs: ${report.summary.plannerSelectedDiffCount}`,
    "",
    "## Timing",
    "",
    "| profile | decisions | avg ms | max ms | total ms |",
    "| --- | ---: | ---: | ---: | ---: |",
  ];
  for (const timing of report.summary.timings) {
    lines.push(`| ${timing.profile} | ${timing.decisions} | ${formatMs(timing.elapsedMs / Math.max(1, timing.decisions))} | ${formatMs(timing.maxDecisionMs)} | ${formatMs(timing.elapsedMs)} |`);
  }

  lines.push("", "## Games", "", "| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |");
  lines.push("| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |");
  for (const game of report.games) {
    lines.push(
      `| ${game.direction} | ${game.seed} | P ${game.profiles.player} / C ${game.profiles.cpu} | ` +
      `${game.winnerProfile ?? "draw"} | ${game.steps} | ${game.turns} | P${game.playerHp}/C${game.cpuHp} | ` +
      `${escapeMarkdownTableCell(game.issue ?? "-")} | ${game.diffCount} | ${game.plannerSelectedDiffCount} |`,
    );
  }

  lines.push("", "## Decision Diff Samples", "");
  const samples = report.games.flatMap((game) => game.diffSamples);
  if (samples.length === 0) {
    lines.push("- No diff samples.");
  } else {
    for (const sample of samples) {
      lines.push(`### seed ${sample.seed} step ${sample.step} ${sample.direction}`);
      lines.push("");
      lines.push(`- turn/current: ${sample.turn} / ${sample.currentPlayer} (${sample.activeProfile})`);
      lines.push(`- selected: ${sample.selectedProfile} / \`${sample.selectedDecision}\``);
      lines.push(`- white: \`${sample.whiteDecision}\` (${formatMs(sample.whiteMs)})`);
      lines.push(`- white_planner: \`${sample.whitePlannerDecision}\` (${formatMs(sample.whitePlannerMs)})`);
      lines.push(`- white reason: ${escapeMarkdownTableCell(sample.whiteReason)}`);
      lines.push(`- planner reason: ${escapeMarkdownTableCell(sample.whitePlannerReason)}`);
      lines.push(`- board: ${escapeMarkdownTableCell(sample.board)}`);
      lines.push("");
    }
  }

  lines.push("## Reading", "");
  report.reading.forEach((line) => lines.push(`- ${line}`));
  lines.push("", "## Next Steps", "");
  report.nextSteps.forEach((line) => lines.push(`- ${line}`));
  return lines.join("\n");
}

function decisionSignature(decision: CpuDecision): string {
  if (decision.type === "attack") {
    return `attack:${decision.action.attackerSlotKey}:${decision.action.commandId}->${targetToKey(decision.action.target)}`;
  }
  if (decision.type === "master_action") {
    return `master:${decision.actionId}->${targetToKey(decision.target)}`;
  }
  if (decision.type === "summon") {
    return `summon:${decision.handInstanceId}->${decision.slotKey}`;
  }
  if (decision.type === "magic") {
    return `magic:${decision.action.handInstanceId}->${targetToKey(decision.action.target)}`;
  }
  if (decision.type === "move") {
    return `move:${decision.fromSlotKey}->${decision.toSlotKey}`;
  }
  if (decision.type === "focus") {
    return `focus:${decision.slotKey}`;
  }
  return "end_turn";
}

function boardLine(state: GameState): string {
  return (Object.values(state.slots) as Array<GameState["slots"][SlotKey]>)
    .filter((slot) => slot.monster)
    .map((slot) => {
      const monster = slot.monster;
      if (!monster) {
        return "";
      }
      const active = monster.status === "active" ? "act" : "prep";
      const shield = monster.shielded ? " shield" : "";
      const focus = monster.focused ? " focus" : "";
      return `${slot.key}:${monster.owner}:${safeCardName(monster.cardId)} L${monster.level} HP${monster.hp} ${active}${shield}${focus}`;
    })
    .join(" / ") || "-";
}

function safeCardName(cardId: string): string {
  try {
    return getCardName(cardId);
  } catch {
    return cardId;
  }
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = { ...DEFAULT_OPTIONS, directions: [...DEFAULT_OPTIONS.directions] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--seed-start") {
      parsed.seedStart = readInteger(arg, next);
      index += 1;
    } else if (arg === "--count") {
      parsed.count = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readInteger(arg, next);
      index += 1;
    } else if (arg === "--deck-preset") {
      parsed.deckPreset = readString(arg, next) as DeckPresetId;
      index += 1;
    } else if (arg === "--direction") {
      parsed.directions = readDirections(readString(arg, next));
      index += 1;
    } else if (arg === "--max-diff-samples") {
      parsed.maxDiffSamples = readInteger(arg, next);
      index += 1;
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      index += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelpAndExit();
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return parsed;
}

function readDirections(value: string): Direction[] {
  if (value === "both") {
    return ["challenger-as-cpu", "challenger-as-player"];
  }
  if (value === "challenger-as-cpu" || value === "challenger-as-player") {
    return [value];
  }
  throw new Error("--direction must be one of: both, challenger-as-cpu, challenger-as-player");
}

function formatMs(value: number): string {
  return `${round(value, 1)}ms`;
}

function printHelpAndExit(): never {
  console.log(`Usage:
  npm run lab:masters:white-planner-phase2 -- [options]

Options:
  --seed-start <n>          First seed. Default: ${DEFAULT_OPTIONS.seedStart}
  --count <n>               Seeds per direction. Default: ${DEFAULT_OPTIONS.count}
  --direction <value>       both, challenger-as-cpu, challenger-as-player. Default: challenger-as-cpu
  --deck-preset <id>        Deck preset. Default: ${DEFAULT_OPTIONS.deckPreset}
  --max-steps <n>           Max auto steps. Default: ${DEFAULT_OPTIONS.maxSteps}
  --max-turns <n>           Max turns. Default: ${DEFAULT_OPTIONS.maxTurns}
  --max-diff-samples <n>    Max diff samples. Default: ${DEFAULT_OPTIONS.maxDiffSamples}
  --markdown <path>         Write Markdown report.
  --json <path>             Write JSON report.
`);
  process.exit(0);
}
