import {
  applyCpuDecision,
  chooseCpuDecision,
  evaluateState,
  inspectCpuDecisionEvaluations,
  type CpuAiOptions,
  type CpuAiProfile,
  type CpuDecision,
} from "../src/game/cpuAi";
import { AI_EVALUATION_WEIGHTS } from "../src/game/aiWeights";
import { getCardName } from "../src/game/cards";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, type DeckPresetId } from "../src/game/deckPresets";
import { createInitialGame, opponentOf, runAutoStep, targetToKey } from "../src/game/rules";
import type { GameState, PlayerId, SlotKey } from "../src/game/types";
import { escapeMarkdownTableCell, readInteger, readString, round, writeReport } from "./lib/cli";

type Direction = "challenger-as-cpu" | "challenger-as-player";

interface CliOptions {
  seed: number;
  direction: Direction;
  deckPreset: DeckPresetId;
  step: number;
  branches: string[];
  maxReplaySteps: number;
  maxCheckpoints: number;
  markdownPath?: string;
  jsonPath?: string;
}

interface TimelineReport {
  generatedAt: string;
  options: CliOptions;
  plannerSide: PlayerId;
  startState: string;
  startBoard: string;
  selectedDecision: string;
  timelines: BranchTimeline[];
  conclusion: string[];
}

interface BranchTimeline {
  branch: string;
  matchedDecision: string;
  rootScore: number;
  applied: boolean;
  error?: string;
  winner?: PlayerId;
  winnerProfile?: CpuAiProfile;
  finalScore: number;
  replaySteps: number;
  finalState: string;
  finalBoard: string;
  checkpoints: TimelineCheckpoint[];
}

interface TimelineCheckpoint {
  replayStep: number;
  label: string;
  state: string;
  board: string;
  nextDecision?: string;
  score: number;
  recentLog: string;
}

const SLOT_ORDER: SlotKey[] = [
  "player_front_left",
  "player_front_right",
  "player_back_left",
  "player_back_right",
  "cpu_front_left",
  "cpu_front_right",
  "cpu_back_left",
  "cpu_back_right",
];

const options = parseArgs(process.argv.slice(2));
const report = runReport(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, `${JSON.stringify(report, null, 2)}\n`);
}

console.log(`White planner branch timeline: ${report.timelines.length} branches`);
for (const timeline of report.timelines) {
  console.log(
    `- ${timeline.branch}: ${timeline.matchedDecision}, winner ${timeline.winnerProfile ?? timeline.winner ?? "-"}, ` +
      `score ${timeline.finalScore}, checkpoints ${timeline.checkpoints.length}`,
  );
}
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runReport(options: CliOptions): TimelineReport {
  const state = replayToStep(options);
  const plannerSide = plannerSideForDirection(options.direction);
  const aiOptions = aiOptionsFor(options.direction);
  const selected = chooseCpuDecision(state, aiOptions);
  const selectedLabel = decisionLabel(state, selected);
  const evaluations = inspectCpuDecisionEvaluations(state, aiOptions)
    .sort((a, b) => b.totalScore - a.totalScore || a.index - b.index);
  const selectedEvaluation = evaluations.find((evaluation) => decisionKey(evaluation.decision) === decisionKey(selected));
  const selectedBranch = {
    decision: selected,
    totalScore: selectedEvaluation?.totalScore ?? selected.score,
  };
  const branches = options.branches.map((branch) =>
    branch === "selected"
      ? timelineBranch(state, plannerSide, "selected", selectedBranch.decision, selectedBranch.totalScore, options)
      : timelineNamedBranch(state, plannerSide, branch, evaluations, options),
  );
  return {
    generatedAt: new Date().toISOString(),
    options,
    plannerSide,
    startState: stateLine(state, plannerSide),
    startBoard: boardLine(state),
    selectedDecision: selectedLabel,
    timelines: branches,
    conclusion: buildConclusion(branches),
  };
}

function timelineNamedBranch(
  state: GameState,
  plannerSide: PlayerId,
  branch: string,
  evaluations: ReturnType<typeof inspectCpuDecisionEvaluations>,
  options: CliOptions,
): BranchTimeline {
  const matched = evaluations.find((evaluation) => decisionLabel(state, evaluation.decision).includes(branch));
  if (!matched) {
    return {
      branch,
      matchedDecision: "-",
      rootScore: Number.NEGATIVE_INFINITY,
      applied: false,
      error: `No branch matched: ${branch}`,
      finalScore: Number.NEGATIVE_INFINITY,
      replaySteps: 0,
      finalState: stateLine(state, plannerSide),
      finalBoard: boardLine(state),
      checkpoints: [],
    };
  }
  return timelineBranch(state, plannerSide, branch, matched.decision, matched.totalScore, options);
}

function timelineBranch(
  before: GameState,
  plannerSide: PlayerId,
  branch: string,
  decision: CpuDecision,
  rootScore: number,
  options: CliOptions,
): BranchTimeline {
  const aiOptions = aiOptionsFor(options.direction);
  let state: GameState;
  try {
    state = applyCpuDecision(before, decision);
  } catch (error) {
    return {
      branch,
      matchedDecision: decisionLabel(before, decision),
      rootScore: round(rootScore, 1),
      applied: false,
      error: error instanceof Error ? error.message : String(error),
      finalScore: Number.NEGATIVE_INFINITY,
      replaySteps: 0,
      finalState: stateLine(before, plannerSide),
      finalBoard: boardLine(before),
      checkpoints: [],
    };
  }

  const checkpoints: TimelineCheckpoint[] = [
    checkpoint(1, "after forced decision", state, plannerSide, aiOptions),
  ];
  let replaySteps = 1;
  while (!state.winner && replaySteps < options.maxReplaySteps && state.turnNumber < 120) {
    if (state.currentPlayer === plannerSide && checkpoints.length < options.maxCheckpoints) {
      checkpoints.push(checkpoint(replaySteps, "planner decision", state, plannerSide, aiOptions));
    }
    state = runAutoStep(state, aiOptions);
    replaySteps += 1;
  }
  if (checkpoints.length < options.maxCheckpoints) {
    checkpoints.push(checkpoint(replaySteps, state.winner ? "final" : "limit", state, plannerSide, aiOptions));
  }
  const winnerProfile = state.winner ? aiOptions.profiles?.[state.winner] : undefined;
  return {
    branch,
    matchedDecision: decisionLabel(before, decision),
    rootScore: round(rootScore, 1),
    applied: true,
    ...(state.winner ? { winner: state.winner, winnerProfile } : {}),
    finalScore: round(branchScore(state, plannerSide), 1),
    replaySteps,
    finalState: stateLine(state, plannerSide),
    finalBoard: boardLine(state),
    checkpoints,
  };
}

function checkpoint(
  replayStep: number,
  label: string,
  state: GameState,
  plannerSide: PlayerId,
  aiOptions: CpuAiOptions,
): TimelineCheckpoint {
  return {
    replayStep,
    label,
    state: stateLine(state, plannerSide),
    board: boardLine(state),
    ...(state.currentPlayer === plannerSide && !state.winner
      ? { nextDecision: decisionLabel(state, chooseCpuDecision(state, aiOptions)) }
      : {}),
    score: round(branchScore(state, plannerSide), 1),
    recentLog: state.log.slice(-3).join(" / "),
  };
}

function replayToStep(options: CliOptions): GameState {
  let state = createWhiteMirrorGame(options.seed, options.deckPreset);
  const aiOptions = aiOptionsFor(options.direction);
  for (let step = 0; step < options.step && !state.winner; step += 1) {
    state = runAutoStep(state, aiOptions);
  }
  return state;
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

function aiOptionsFor(direction: Direction): CpuAiOptions {
  return { profiles: profilesForDirection(direction) };
}

function profilesForDirection(direction: Direction): Record<PlayerId, CpuAiProfile> {
  return direction === "challenger-as-cpu"
    ? { player: "white", cpu: "white_planner" }
    : { player: "white_planner", cpu: "white" };
}

function plannerSideForDirection(direction: Direction): PlayerId {
  return direction === "challenger-as-cpu" ? "cpu" : "player";
}

function branchScore(state: GameState, plannerSide: PlayerId): number {
  const opponent = opponentOf(plannerSide);
  if (state.winner === plannerSide) {
    return 1_000_000;
  }
  if (state.winner === opponent) {
    return -1_000_000;
  }
  return evaluateState(state, plannerSide, AI_EVALUATION_WEIGHTS.white);
}

function decisionLabel(state: GameState, decision: CpuDecision): string {
  if (decision.type === "attack") {
    const attacker = monsterNameAt(state, decision.action.attackerSlotKey) ?? decision.action.attackerSlotKey;
    const target = decision.action.target.kind === "monster"
      ? monsterNameAt(state, decision.action.target.slotKey) ?? decision.action.target.slotKey
      : `${decision.action.target.playerId} master`;
    return `attack:${attacker}:${decision.action.commandId}->${target}`;
  }
  if (decision.type === "master_action") {
    return `master:${decision.actionId}->${targetToKey(decision.target)}`;
  }
  if (decision.type === "summon") {
    const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === decision.handInstanceId);
    return `summon:${card ? getCardName(card.cardId) : decision.handInstanceId}->${decision.slotKey}`;
  }
  if (decision.type === "magic") {
    const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === decision.action.handInstanceId);
    return `magic:${card ? getCardName(card.cardId) : decision.action.handInstanceId}->${targetToKey(decision.action.target)}`;
  }
  if (decision.type === "move") {
    return `move:${decision.fromSlotKey}->${decision.toSlotKey}`;
  }
  if (decision.type === "focus") {
    return `focus:${monsterNameAt(state, decision.slotKey) ?? decision.slotKey}`;
  }
  return "end_turn";
}

function decisionKey(decision: CpuDecision): string {
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

function stateLine(state: GameState, perspective: PlayerId): string {
  const opponent = opponentOf(perspective);
  return [
    `turn ${state.turnNumber}`,
    `current ${state.currentPlayer}`,
    `HP ${perspective}/${opponent} ${state.players[perspective].masterHp}/${state.players[opponent].masterHp}`,
    `stones ${perspective}/${opponent} ${state.players[perspective].stones}/${state.players[opponent].stones}`,
    `deck ${perspective}/${opponent} ${state.players[perspective].deck.length}/${state.players[opponent].deck.length}`,
    `hand ${perspective}/${opponent} ${state.players[perspective].hand.length}/${state.players[opponent].hand.length}`,
  ].join(" / ");
}

function boardLine(state: GameState): string {
  return SLOT_ORDER.map((slotKey) => slotLine(state, slotKey)).filter(Boolean).join(" | ") || "empty";
}

function slotLine(state: GameState, slotKey: SlotKey): string {
  const monster = state.slots[slotKey].monster;
  if (!monster) {
    return "";
  }
  const side = monster.owner === "player" ? "P" : "C";
  const row = state.slots[slotKey].row === "front" ? "F" : "B";
  const status = monster.status === "prepared" ? "prep" : `act${monster.actionCount}/${monster.actionLimit}`;
  const flags = [monster.focused ? "focus" : "", monster.shielded ? "shield" : ""].filter(Boolean);
  return `${slotKey}:${side}${row}:${getCardName(monster.cardId)} Lv${monster.level} HP${monster.hp} ${status}${flags.length > 0 ? ` ${flags.join(",")}` : ""}`;
}

function monsterNameAt(state: GameState, slotKey: SlotKey): string | undefined {
  const monster = state.slots[slotKey].monster;
  return monster ? getCardName(monster.cardId) : undefined;
}

function buildConclusion(timelines: readonly BranchTimeline[]): string[] {
  const winnerLines = timelines.map((timeline) =>
    `${timeline.branch}: ${timeline.matchedDecision} -> ${timeline.winnerProfile ?? timeline.winner ?? "no winner"} / score ${timeline.finalScore}`,
  );
  return [
    "同一局面から候補を強制し、planner側の次手番ごとの状態差を追跡した。",
    ...winnerLines,
  ];
}

function formatMarkdown(report: TimelineReport): string {
  const lines = [
    "# White Planner Branch Timeline",
    "",
    `生成: ${report.generatedAt}`,
    `seed: ${report.options.seed}`,
    `direction: ${report.options.direction}`,
    `step: ${report.options.step}`,
    `deck: \`${report.options.deckPreset}\``,
    `plannerSide: ${report.plannerSide}`,
    "",
    "## Start",
    "",
    `- state: ${report.startState}`,
    `- board: ${report.startBoard}`,
    `- selected: ${report.selectedDecision}`,
    "",
    "## Conclusion",
    "",
  ];
  report.conclusion.forEach((line) => lines.push(`- ${line}`));
  lines.push("", "## Timelines", "");
  for (const timeline of report.timelines) {
    lines.push(
      `### ${timeline.branch}`,
      "",
      `- matched: ${timeline.matchedDecision}`,
      `- rootScore: ${timeline.rootScore}`,
      `- winner: ${timeline.winnerProfile ?? timeline.winner ?? "-"}`,
      `- finalScore: ${timeline.finalScore}`,
      `- replaySteps: ${timeline.replaySteps}`,
      `- finalState: ${timeline.finalState}`,
      "",
      "| replay | label | score | next decision | state | board | recent log |",
      "| ---: | --- | ---: | --- | --- | --- | --- |",
    );
    for (const checkpoint of timeline.checkpoints) {
      lines.push(
        `| ${checkpoint.replayStep} | ${checkpoint.label} | ${checkpoint.score} | ` +
          `${escapeMarkdownTableCell(checkpoint.nextDecision ?? "-")} | ${escapeMarkdownTableCell(checkpoint.state)} | ` +
          `${escapeMarkdownTableCell(checkpoint.board)} | ${escapeMarkdownTableCell(checkpoint.recentLog)} |`,
      );
    }
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    seed: 994304,
    direction: "challenger-as-cpu",
    deckPreset: "master-lab-white-1377-death-sheep3",
    step: 101,
    branches: ["selected", "summon:デスシープ->cpu_back_left"],
    maxReplaySteps: 220,
    maxCheckpoints: 18,
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--seed") {
      parsed.seed = readInteger(arg, next);
      index += 1;
    } else if (arg === "--direction") {
      const value = readString(arg, next);
      if (value !== "challenger-as-cpu" && value !== "challenger-as-player") {
        throw new Error("--direction must be challenger-as-cpu or challenger-as-player");
      }
      parsed.direction = value;
      index += 1;
    } else if (arg === "--deck-preset") {
      parsed.deckPreset = readString(arg, next) as DeckPresetId;
      index += 1;
    } else if (arg === "--step") {
      parsed.step = readInteger(arg, next);
      index += 1;
    } else if (arg === "--branch") {
      parsed.branches = [...parsed.branches, readString(arg, next)];
      index += 1;
    } else if (arg === "--only-branch") {
      parsed.branches = [readString(arg, next)];
      index += 1;
    } else if (arg === "--max-replay-steps") {
      parsed.maxReplaySteps = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-checkpoints") {
      parsed.maxCheckpoints = readInteger(arg, next);
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

function printHelpAndExit(): never {
  console.log(`Usage:
  npm run audit:white-planner-branch-timeline -- [options]

Options:
  --seed <n>                 Seed. Default: 994304
  --direction <direction>    challenger-as-cpu or challenger-as-player. Default: challenger-as-cpu
  --deck-preset <id>         Deck preset. Default: master-lab-white-1377-death-sheep3
  --step <n>                 Replay target step. Default: 101
  --branch <text>            Add a branch label substring. Use "selected" for the selected decision.
  --only-branch <text>       Replace default branches with one branch.
  --max-replay-steps <n>     Max auto steps after forced decision. Default: 220
  --max-checkpoints <n>      Max timeline checkpoints per branch. Default: 18
  --markdown <path>          Write Markdown report.
  --json <path>              Write JSON report.
`);
  process.exit(0);
}
