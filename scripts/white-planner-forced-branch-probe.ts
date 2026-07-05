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
import type { GameState, PlayerId, SlotKey, Target } from "../src/game/types";
import { escapeMarkdownTableCell, readInteger, readString, round, writeReport } from "./lib/cli";

type Direction = "challenger-as-cpu" | "challenger-as-player";

interface CliOptions {
  seed: number;
  direction: Direction;
  deckPreset: DeckPresetId;
  steps: number[];
  branchTop: number;
  maxReplaySteps: number;
  streamProgress: boolean;
  markdownPath?: string;
  jsonPath?: string;
}

interface ForcedBranchReport {
  generatedAt: string;
  seed: number;
  direction: Direction;
  deckPreset: DeckPresetId;
  branchTop: number;
  maxReplaySteps: number;
  samples: ForcedBranchSample[];
  conclusion: string[];
}

interface ForcedBranchSample {
  step: number;
  turnNumber: number;
  plannerSide: PlayerId;
  currentPlayer: PlayerId;
  state: string;
  board: string;
  branches: ForcedBranchOutcome[];
  bestDecision: string;
  selectedDecision: string;
  selectedRank: number;
  bestVsSelectedScoreDelta: number;
}

interface ForcedBranchOutcome {
  rank: number;
  decision: string;
  rootScore: number;
  selected: boolean;
  applied: boolean;
  error?: string;
  winner?: PlayerId;
  winnerProfile?: CpuAiProfile;
  replaySteps: number;
  finalTurn: number;
  branchScore: number;
  finalState: string;
  finalBoard: string;
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
const report = runProbe(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, `${JSON.stringify(report, null, 2)}\n`);
}

console.log(`White planner forced branch probe: ${report.samples.length} samples`);
for (const sample of report.samples) {
  console.log(
    `step ${sample.step}: selected rank ${sample.selectedRank}, ` +
      `best ${sample.bestDecision}, delta ${sample.bestVsSelectedScoreDelta}`,
  );
}
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runProbe(options: CliOptions): ForcedBranchReport {
  const samples = options.steps.map((step) => probeStep(options, step));
  return {
    generatedAt: new Date().toISOString(),
    seed: options.seed,
    direction: options.direction,
    deckPreset: options.deckPreset,
    branchTop: options.branchTop,
    maxReplaySteps: options.maxReplaySteps,
    samples,
    conclusion: buildConclusion(samples),
  };
}

function probeStep(options: CliOptions, step: number): ForcedBranchSample {
  const state = replayToStep(options, step);
  const plannerSide = plannerSideForDirection(options.direction);
  const aiOptions = aiOptionsFor(options.direction);
  const selectedDecision = chooseCpuDecision(state, aiOptions);
  const selectedKey = decisionKey(selectedDecision);
  const rawEvaluations = inspectCpuDecisionEvaluations(state, aiOptions)
    .sort((a, b) => b.totalScore - a.totalScore || a.index - b.index)
    .slice(0, options.branchTop);
  const selectedEvaluation = inspectCpuDecisionEvaluations(state, aiOptions)
    .find((evaluation) => decisionKey(evaluation.decision) === selectedKey);
  const evaluations = rawEvaluations.some((evaluation) => decisionKey(evaluation.decision) === selectedKey)
    ? rawEvaluations
    : [
        {
          decision: selectedDecision,
          totalScore: selectedEvaluation?.totalScore ?? selectedDecision.score,
          index: -1,
        },
        ...rawEvaluations,
      ];
  const branches: ForcedBranchOutcome[] = [];
  evaluations.forEach((evaluation, index) => {
    const branch = replayBranch(
      state,
      plannerSide,
      evaluation.decision,
      round(evaluation.totalScore, 1),
      index + 1,
      selectedKey,
      options,
    );
    branches.push(branch);
    if (options.streamProgress) {
      console.log(
        `[step ${step}] branch ${index + 1}/${evaluations.length} ${branch.selected ? "selected " : ""}` +
          `${branch.decision} -> ${branch.winnerProfile ?? branch.winner ?? "-"} ` +
          `score ${branch.branchScore} steps ${branch.replaySteps}`,
      );
    }
  });
  const ranked = [...branches].sort((a, b) => b.branchScore - a.branchScore || a.rank - b.rank);
  const selected = branches.find((branch) => branch.selected) ?? branches[0];
  const best = ranked[0] ?? selected;
  const selectedRank = selected ? ranked.findIndex((branch) => branch.decision === selected.decision) + 1 : 0;
  return {
    step,
    turnNumber: state.turnNumber,
    plannerSide,
    currentPlayer: state.currentPlayer,
    state: stateLine(state, plannerSide),
    board: boardLine(state),
    branches,
    bestDecision: best?.decision ?? "-",
    selectedDecision: selected?.decision ?? "-",
    selectedRank,
    bestVsSelectedScoreDelta: selected && best ? round(best.branchScore - selected.branchScore, 1) : 0,
  };
}

function replayBranch(
  before: GameState,
  plannerSide: PlayerId,
  decision: CpuDecision,
  rootScore: number,
  rank: number,
  selectedKey: string,
  options: CliOptions,
): ForcedBranchOutcome {
  let state: GameState;
  try {
    state = applyCpuDecision(before, decision);
  } catch (error) {
    return {
      rank,
      decision: decisionLabel(before, decision),
      rootScore,
      selected: decisionKey(decision) === selectedKey,
      applied: false,
      error: error instanceof Error ? error.message : String(error),
      replaySteps: 0,
      finalTurn: before.turnNumber,
      branchScore: Number.NEGATIVE_INFINITY,
      finalState: stateLine(before, plannerSide),
      finalBoard: boardLine(before),
    };
  }

  let replaySteps = 1;
  const aiOptions = aiOptionsFor(options.direction);
  while (!state.winner && replaySteps < options.maxReplaySteps && state.turnNumber < 120) {
    state = runAutoStep(state, aiOptions);
    replaySteps += 1;
  }
  const winnerProfile = state.winner ? aiOptions.profiles?.[state.winner] : undefined;
  return {
    rank,
    decision: decisionLabel(before, decision),
    rootScore,
    selected: decisionKey(decision) === selectedKey,
    applied: true,
    ...(state.winner ? { winner: state.winner, winnerProfile } : {}),
    replaySteps,
    finalTurn: state.turnNumber,
    branchScore: round(branchScore(state, plannerSide), 1),
    finalState: stateLine(state, plannerSide),
    finalBoard: boardLine(state),
  };
}

function replayToStep(options: CliOptions, targetStep: number): GameState {
  let state = createWhiteMirrorGame(options.seed, options.deckPreset);
  const aiOptions = aiOptionsFor(options.direction);
  for (let step = 0; step < targetStep && !state.winner; step += 1) {
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
    const secondary = decision.action.secondaryTarget ? `:${targetToKey(decision.action.secondaryTarget)}` : "";
    return `attack:${attacker}:${decision.action.commandId}->${target}${secondary}`;
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
    const secondary = decision.action.secondaryTarget ? `:${targetToKey(decision.action.secondaryTarget)}` : "";
    return `magic:${card ? getCardName(card.cardId) : decision.action.handInstanceId}->${targetToKey(decision.action.target)}${secondary}`;
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
    return `attack:${decision.action.attackerSlotKey}:${decision.action.commandId}:${targetToKey(decision.action.target)}:${optionalTargetKey(decision.action.secondaryTarget)}:${decision.action.secondaryHandInstanceId ?? ""}`;
  }
  if (decision.type === "master_action") {
    return `master:${decision.actionId}:${targetToKey(decision.target)}`;
  }
  if (decision.type === "summon") {
    return `summon:${decision.handInstanceId}:${decision.slotKey}`;
  }
  if (decision.type === "magic") {
    return `magic:${decision.action.handInstanceId}:${targetToKey(decision.action.target)}:${optionalTargetKey(decision.action.secondaryTarget)}:${decision.action.secondaryHandInstanceId ?? ""}:${decision.action.selectedHandInstanceIds?.join(",") ?? ""}:${decision.action.deckTopOrderInstanceIds?.join(",") ?? ""}:${decision.action.searchCategory ?? ""}:${decision.action.rotationDirection ?? ""}`;
  }
  if (decision.type === "move") {
    return `move:${decision.fromSlotKey}:${decision.toSlotKey}`;
  }
  if (decision.type === "focus") {
    return `focus:${decision.slotKey}`;
  }
  return "end_turn";
}

function optionalTargetKey(target: Target | undefined): string {
  return target ? targetToKey(target) : "";
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

function buildConclusion(samples: readonly ForcedBranchSample[]): string[] {
  const improving = samples.filter((sample) => sample.bestVsSelectedScoreDelta > 0);
  if (improving.length === 0) {
    return ["強制分岐の範囲では、選択手を最終勝敗まで明確に上回る代替は見つからない。"];
  }
  return [
    `${improving.length}/${samples.length} samples で選択手より最終scoreが高い代替がある。`,
    "root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。",
  ];
}

function formatMarkdown(report: ForcedBranchReport): string {
  const lines = [
    "# White Planner Forced Branch Probe",
    "",
    `生成: ${report.generatedAt}`,
    `seed: ${report.seed}`,
    `direction: ${report.direction}`,
    `deck: \`${report.deckPreset}\``,
    `branchTop: ${report.branchTop}`,
    `maxReplaySteps: ${report.maxReplaySteps}`,
    "",
    "## Conclusion",
    "",
  ];
  report.conclusion.forEach((line) => lines.push(`- ${line}`));
  lines.push("", "## Samples", "");
  for (const sample of report.samples) {
    lines.push(
      `### step ${sample.step}`,
      "",
      `- turn: ${sample.turnNumber}`,
      `- plannerSide: ${sample.plannerSide}`,
      `- currentPlayer: ${sample.currentPlayer}`,
      `- state: ${sample.state}`,
      `- board: ${sample.board}`,
      `- selected: ${sample.selectedDecision}`,
      `- best: ${sample.bestDecision}`,
      `- selectedRank: ${sample.selectedRank}`,
      `- bestVsSelectedScoreDelta: ${sample.bestVsSelectedScoreDelta}`,
      "",
      "| rank | selected | decision | root | winner | final score | replay steps | final state |",
      "| ---: | --- | --- | ---: | --- | ---: | ---: | --- |",
    );
    for (const branch of sample.branches) {
      lines.push(
        `| ${branch.rank} | ${branch.selected ? "Y" : ""} | ${escapeMarkdownTableCell(branch.decision)} | ${branch.rootScore} | ` +
          `${branch.winnerProfile ?? branch.winner ?? "-"} | ${branch.branchScore} | ${branch.replaySteps} | ` +
          `${escapeMarkdownTableCell(branch.error ?? branch.finalState)} |`,
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
    steps: [229, 230, 231, 240, 242, 246],
    branchTop: 8,
    maxReplaySteps: 430,
    streamProgress: false,
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
      parsed.steps = [...parsed.steps, readInteger(arg, next)];
      index += 1;
    } else if (arg === "--only-step") {
      parsed.steps = [readInteger(arg, next)];
      index += 1;
    } else if (arg === "--branch-top") {
      parsed.branchTop = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-replay-steps") {
      parsed.maxReplaySteps = readInteger(arg, next);
      index += 1;
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      index += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
      index += 1;
    } else if (arg === "--stream-progress") {
      parsed.streamProgress = true;
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
  npm run audit:white-planner-forced-branch -- [options]

Options:
  --seed <n>                 Seed. Default: 994304
  --direction <direction>    challenger-as-cpu or challenger-as-player. Default: challenger-as-cpu
  --deck-preset <id>         Deck preset. Default: master-lab-white-1377-death-sheep3
  --only-step <n>            Replace default steps with one step.
  --step <n>                 Add a step.
  --branch-top <n>           Top root candidates to force. Default: 8
  --max-replay-steps <n>     Max auto steps after forced decision. Default: 430
  --stream-progress          Print each forced branch result as it finishes.
  --markdown <path>          Write Markdown report.
  --json <path>              Write JSON report.
`);
  process.exit(0);
}
