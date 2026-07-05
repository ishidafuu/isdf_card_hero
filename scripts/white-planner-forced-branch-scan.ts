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

interface ScanInput {
  seed: number;
  direction: Direction;
}

interface CliOptions {
  deckPreset: DeckPresetId;
  samples: ScanInput[];
  turnFrom: number;
  turnTo: number;
  maxScanSteps: number;
  maxStatesPerSample: number;
  decisionStride: number;
  branchTop: number;
  maxReplaySteps: number;
  improvementThreshold: number;
  streamProgress: boolean;
  markdownPath?: string;
  jsonPath?: string;
}

interface CapturedState {
  step: number;
  state: GameState;
}

interface ScanReport {
  generatedAt: string;
  deckPreset: DeckPresetId;
  turnFrom: number;
  turnTo: number;
  branchTop: number;
  maxReplaySteps: number;
  improvementThreshold: number;
  samples: SampleScanReport[];
  promising: BranchScanResult[];
  conclusion: string[];
}

interface SampleScanReport {
  seed: number;
  direction: Direction;
  plannerSide: PlayerId;
  capturedStates: number;
  results: BranchScanResult[];
}

interface BranchScanResult {
  seed: number;
  direction: Direction;
  step: number;
  turnNumber: number;
  plannerSide: PlayerId;
  state: string;
  board: string;
  selectedDecision: string;
  bestDecision: string;
  selectedWinner?: PlayerId;
  selectedWinnerProfile?: CpuAiProfile;
  bestWinner?: PlayerId;
  bestWinnerProfile?: CpuAiProfile;
  selectedScore: number;
  bestScore: number;
  scoreDelta: number;
  winnerFlip: boolean;
  promising: boolean;
  branches: ForcedBranchOutcome[];
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
const report = runScan(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, `${JSON.stringify(report, null, 2)}\n`);
}

console.log(`White planner forced branch scan: ${report.samples.length} samples`);
console.log(`Promising: ${report.promising.length}`);
report.promising.slice(0, 8).forEach((result) => {
  console.log(
    `- ${result.seed} ${result.direction} step ${result.step} T${result.turnNumber}: ` +
      `${result.selectedDecision} -> ${result.bestDecision}, delta ${result.scoreDelta}`,
  );
});
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runScan(options: CliOptions): ScanReport {
  const samples = options.samples.map((input) => scanSample(input, options));
  const promising = samples
    .flatMap((sample) => sample.results)
    .filter((result) => result.promising)
    .sort((a, b) => Number(b.winnerFlip) - Number(a.winnerFlip) || b.scoreDelta - a.scoreDelta);
  return {
    generatedAt: new Date().toISOString(),
    deckPreset: options.deckPreset,
    turnFrom: options.turnFrom,
    turnTo: options.turnTo,
    branchTop: options.branchTop,
    maxReplaySteps: options.maxReplaySteps,
    improvementThreshold: options.improvementThreshold,
    samples,
    promising,
    conclusion: buildConclusion(samples, promising),
  };
}

function scanSample(input: ScanInput, options: CliOptions): SampleScanReport {
  const plannerSide = plannerSideForDirection(input.direction);
  const captured = capturePlannerStates(input, options);
  const results = captured.map((capturedState, index) => {
    const result = scanState(input, plannerSide, capturedState, options);
    if (options.streamProgress) {
      console.log(
        `[${input.seed} ${input.direction}] ${index + 1}/${captured.length} ` +
          `step ${result.step} T${result.turnNumber} delta ${result.scoreDelta} ` +
          `${result.winnerFlip ? "WINNER_FLIP" : ""}`,
      );
    }
    return result;
  });
  return {
    ...input,
    plannerSide,
    capturedStates: captured.length,
    results,
  };
}

function capturePlannerStates(input: ScanInput, options: CliOptions): CapturedState[] {
  let state = createWhiteMirrorGame(input.seed, options.deckPreset);
  const aiOptions = aiOptionsFor(input.direction);
  const plannerSide = plannerSideForDirection(input.direction);
  const captured: CapturedState[] = [];
  let plannerDecisionCount = 0;

  for (let step = 0; step <= options.maxScanSteps && !state.winner; step += 1) {
    if (
      state.currentPlayer === plannerSide &&
      !state.pendingLevelUp &&
      state.turnNumber >= options.turnFrom &&
      state.turnNumber <= options.turnTo
    ) {
      const selected = chooseCpuDecision(state, aiOptions);
      if (selected.type !== "end_turn") {
        plannerDecisionCount += 1;
        if (plannerDecisionCount % options.decisionStride === 0) {
          captured.push({ step, state: structuredClone(state) as GameState });
          if (captured.length >= options.maxStatesPerSample) {
            break;
          }
        }
      }
    }

    state = runAutoStep(state, aiOptions);
  }

  return captured;
}

function scanState(
  input: ScanInput,
  plannerSide: PlayerId,
  captured: CapturedState,
  options: CliOptions,
): BranchScanResult {
  const aiOptions = aiOptionsFor(input.direction);
  const selectedDecision = chooseCpuDecision(captured.state, aiOptions);
  const selectedKey = decisionKey(selectedDecision);
  const rawEvaluations = inspectCpuDecisionEvaluations(captured.state, aiOptions)
    .filter((evaluation) => evaluation.decision.type !== "end_turn")
    .sort((a, b) => b.totalScore - a.totalScore || a.index - b.index)
    .slice(0, options.branchTop);
  const selectedEvaluation = inspectCpuDecisionEvaluations(captured.state, aiOptions)
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

  const branches = evaluations.map((evaluation, index) =>
    replayBranch(
      captured.state,
      plannerSide,
      evaluation.decision,
      round(evaluation.totalScore, 1),
      index + 1,
      selectedKey,
      options,
    ),
  );
  const selected = branches.find((branch) => branch.selected) ?? branches[0];
  const best = [...branches].sort((a, b) => b.branchScore - a.branchScore || a.rank - b.rank)[0] ?? selected;
  const winnerFlip = selected?.winner !== plannerSide && best?.winner === plannerSide;
  const scoreDelta = selected && best ? round(best.branchScore - selected.branchScore, 1) : 0;
  const promising = winnerFlip || scoreDelta >= options.improvementThreshold;

  return {
    ...input,
    step: captured.step,
    turnNumber: captured.state.turnNumber,
    plannerSide,
    state: stateLine(captured.state, plannerSide),
    board: boardLine(captured.state),
    selectedDecision: selected?.decision ?? decisionLabel(captured.state, selectedDecision),
    bestDecision: best?.decision ?? "-",
    ...(selected?.winner ? { selectedWinner: selected.winner } : {}),
    ...(selected?.winnerProfile ? { selectedWinnerProfile: selected.winnerProfile } : {}),
    ...(best?.winner ? { bestWinner: best.winner } : {}),
    ...(best?.winnerProfile ? { bestWinnerProfile: best.winnerProfile } : {}),
    selectedScore: selected?.branchScore ?? 0,
    bestScore: best?.branchScore ?? 0,
    scoreDelta,
    winnerFlip,
    promising,
    branches,
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
  const aiOptions = aiOptionsFor(directionForPlannerSide(plannerSide));
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

function directionForPlannerSide(plannerSide: PlayerId): Direction {
  return plannerSide === "cpu" ? "challenger-as-cpu" : "challenger-as-player";
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

function buildConclusion(samples: readonly SampleScanReport[], promising: readonly BranchScanResult[]): string[] {
  const totalStates = samples.reduce((total, sample) => total + sample.capturedStates, 0);
  if (promising.length === 0) {
    return [
      `${totalStates} states scanned. 勝敗反転または閾値以上の改善候補は見つからない。`,
      "次は turn 範囲か seed を広げる、または相手手番込みの二手番プラン探索へ移る。",
    ];
  }
  const flips = promising.filter((result) => result.winnerFlip).length;
  return [
    `${totalStates} states scanned. promising ${promising.length}件、winner flip ${flips}件。`,
    "winner flip または大きい score delta の局面だけを、評価概念へ還元して小規模実装候補にする。",
  ];
}

function formatMarkdown(report: ScanReport): string {
  const lines = [
    "# White Planner Forced Branch Scan",
    "",
    `生成: ${report.generatedAt}`,
    `deck: \`${report.deckPreset}\``,
    `turnRange: ${report.turnFrom}-${report.turnTo}`,
    `branchTop: ${report.branchTop}`,
    `maxReplaySteps: ${report.maxReplaySteps}`,
    `improvementThreshold: ${report.improvementThreshold}`,
    "",
    "## Conclusion",
    "",
  ];
  report.conclusion.forEach((line) => lines.push(`- ${line}`));
  lines.push("", "## Promising", "");
  if (report.promising.length === 0) {
    lines.push("- なし", "");
  } else {
    lines.push("| seed | direction | step | turn | selected | best | delta | selected winner | best winner |");
    lines.push("| ---: | --- | ---: | ---: | --- | --- | ---: | --- | --- |");
    for (const result of report.promising.slice(0, 20)) {
      lines.push(
        `| ${result.seed} | ${result.direction} | ${result.step} | ${result.turnNumber} | ` +
          `${escapeMarkdownTableCell(result.selectedDecision)} | ${escapeMarkdownTableCell(result.bestDecision)} | ` +
          `${result.scoreDelta} | ${result.selectedWinnerProfile ?? result.selectedWinner ?? "-"} | ` +
          `${result.bestWinnerProfile ?? result.bestWinner ?? "-"} |`,
      );
    }
    lines.push("");
  }

  lines.push("## Samples", "");
  for (const sample of report.samples) {
    lines.push(
      `### ${sample.seed} ${sample.direction}`,
      "",
      `- plannerSide: ${sample.plannerSide}`,
      `- capturedStates: ${sample.capturedStates}`,
      "",
    );
    for (const result of sample.results) {
      lines.push(
        `#### step ${result.step} / turn ${result.turnNumber}`,
        "",
        `- state: ${result.state}`,
        `- board: ${result.board}`,
        `- selected: ${result.selectedDecision}`,
        `- best: ${result.bestDecision}`,
        `- scoreDelta: ${result.scoreDelta}`,
        "",
        "| rank | selected | decision | root | winner | final score | replay steps | final state |",
        "| ---: | --- | --- | ---: | --- | ---: | ---: | --- |",
      );
      for (const branch of result.branches) {
        lines.push(
          `| ${branch.rank} | ${branch.selected ? "Y" : ""} | ${escapeMarkdownTableCell(branch.decision)} | ${branch.rootScore} | ` +
            `${branch.winnerProfile ?? branch.winner ?? "-"} | ${branch.branchScore} | ${branch.replaySteps} | ` +
            `${escapeMarkdownTableCell(branch.error ?? branch.finalState)} |`,
        );
      }
      lines.push("");
    }
  }
  return `${lines.join("\n")}\n`;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    deckPreset: "master-lab-white-1377-death-sheep3",
    samples: [
      { seed: 994304, direction: "challenger-as-cpu" },
      { seed: 994306, direction: "challenger-as-player" },
    ],
    turnFrom: 6,
    turnTo: 14,
    maxScanSteps: 180,
    maxStatesPerSample: 4,
    decisionStride: 2,
    branchTop: 2,
    maxReplaySteps: 160,
    improvementThreshold: 220,
    streamProgress: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--sample") {
      parsed.samples = [...parsed.samples, readSample(next)];
      index += 1;
    } else if (arg === "--only-sample") {
      parsed.samples = [readSample(next)];
      index += 1;
    } else if (arg === "--deck-preset") {
      parsed.deckPreset = readString(arg, next) as DeckPresetId;
      index += 1;
    } else if (arg === "--turn-from") {
      parsed.turnFrom = readInteger(arg, next);
      index += 1;
    } else if (arg === "--turn-to") {
      parsed.turnTo = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-scan-steps") {
      parsed.maxScanSteps = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-states-per-sample") {
      parsed.maxStatesPerSample = readInteger(arg, next);
      index += 1;
    } else if (arg === "--decision-stride") {
      parsed.decisionStride = readInteger(arg, next);
      index += 1;
    } else if (arg === "--branch-top") {
      parsed.branchTop = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-replay-steps") {
      parsed.maxReplaySteps = readInteger(arg, next);
      index += 1;
    } else if (arg === "--improvement-threshold") {
      parsed.improvementThreshold = readInteger(arg, next);
      index += 1;
    } else if (arg === "--stream-progress") {
      parsed.streamProgress = true;
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

function readSample(value: string | undefined): ScanInput {
  const raw = readString("--sample", value);
  const [seedText, direction] = raw.split(":");
  const seed = Number(seedText);
  if (!Number.isInteger(seed)) {
    throw new Error("--sample seed must be an integer");
  }
  if (direction !== "challenger-as-cpu" && direction !== "challenger-as-player") {
    throw new Error("--sample must be seed:challenger-as-cpu or seed:challenger-as-player");
  }
  return { seed, direction };
}

function printHelpAndExit(): never {
  console.log(`Usage:
  npm run audit:white-planner-forced-branch-scan -- [options]

Options:
  --sample <seed:direction>       Add a sample.
  --only-sample <seed:direction>  Replace default samples with one sample.
  --deck-preset <id>              Deck preset. Default: master-lab-white-1377-death-sheep3
  --turn-from <n>                 First turn number to scan. Default: 6
  --turn-to <n>                   Last turn number to scan. Default: 14
  --max-scan-steps <n>            Max replay steps while collecting states. Default: 180
  --max-states-per-sample <n>     Max captured planner states per sample. Default: 4
  --decision-stride <n>           Capture every Nth planner decision. Default: 2
  --branch-top <n>                Top root candidates to force. Default: 2
  --max-replay-steps <n>          Max auto steps after forced decision. Default: 160
  --improvement-threshold <n>     Score delta threshold for promising. Default: 220
  --stream-progress               Print per-state progress.
  --markdown <path>               Write Markdown report.
  --json <path>                   Write JSON report.
`);
  process.exit(0);
}
