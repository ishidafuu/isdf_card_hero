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
import { createInitialGame, opponentOf, runAutoStep } from "../src/game/rules";
import type { GameState, PlayerId, SlotKey } from "../src/game/types";
import { escapeMarkdownTableCell, readInteger, readString, round, writeReport } from "./lib/cli";

type Direction = "challenger-as-cpu" | "challenger-as-player";
type SummonDecision = Extract<CpuDecision, { type: "summon" }>;

interface CliOptions {
  deckPreset: DeckPresetId;
  seedStart: number;
  count: number;
  directions: Direction[];
  turnFrom: number;
  turnTo: number;
  maxScanSteps: number;
  maxCasesPerDirection: number;
  branchTop: number;
  maxReplaySteps: number;
  improvementThreshold: number;
  streamProgress: boolean;
  markdownPath?: string;
  jsonPath?: string;
}

interface AuditCase {
  seed: number;
  direction: Direction;
  step: number;
  turnNumber: number;
  plannerSide: PlayerId;
  state: string;
  board: string;
  selectedDecision: string;
  bestDecision: string;
  selectedScore: number;
  bestScore: number;
  scoreDelta: number;
  winnerFlip: boolean;
  promising: boolean;
  branches: BranchOutcome[];
}

interface BranchOutcome {
  rank: number;
  decision: string;
  rootScore: number;
  selected: boolean;
  winner?: PlayerId;
  winnerProfile?: CpuAiProfile;
  replaySteps: number;
  finalTurn: number;
  branchScore: number;
  finalState: string;
  finalBoard: string;
  error?: string;
}

interface SampleReport {
  seed: number;
  direction: Direction;
  plannerSide: PlayerId;
  scannedSteps: number;
  capturedCases: number;
  cases: AuditCase[];
}

interface AuditReport {
  generatedAt: string;
  deckPreset: DeckPresetId;
  seedStart: number;
  count: number;
  directions: Direction[];
  turnFrom: number;
  turnTo: number;
  branchTop: number;
  maxReplaySteps: number;
  improvementThreshold: number;
  samples: SampleReport[];
  promising: AuditCase[];
  conclusion: string[];
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
const report = runAudit(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, `${JSON.stringify(report, null, 2)}\n`);
}

console.log(`White planner summon slot audit: ${report.samples.length} samples`);
console.log(`Cases: ${report.samples.reduce((total, sample) => total + sample.capturedCases, 0)}, promising ${report.promising.length}`);
report.promising.slice(0, 8).forEach((item) => {
  console.log(
    `- ${item.seed} ${item.direction} step ${item.step} T${item.turnNumber}: ` +
      `${item.selectedDecision} -> ${item.bestDecision}, delta ${item.scoreDelta}`,
  );
});
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runAudit(options: CliOptions): AuditReport {
  const samples = [];
  for (let offset = 0; offset < options.count; offset += 1) {
    const seed = options.seedStart + offset;
    for (const direction of options.directions) {
      samples.push(scanSample(seed, direction, options));
    }
  }
  const promising = samples
    .flatMap((sample) => sample.cases)
    .filter((item) => item.promising)
    .sort((a, b) => Number(b.winnerFlip) - Number(a.winnerFlip) || b.scoreDelta - a.scoreDelta);
  return {
    generatedAt: new Date().toISOString(),
    deckPreset: options.deckPreset,
    seedStart: options.seedStart,
    count: options.count,
    directions: options.directions,
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

function scanSample(seed: number, direction: Direction, options: CliOptions): SampleReport {
  let state = createWhiteMirrorGame(seed, options.deckPreset);
  const aiOptions = aiOptionsFor(direction);
  const plannerSide = plannerSideForDirection(direction);
  const cases: AuditCase[] = [];
  let scannedSteps = 0;

  for (let step = 0; step <= options.maxScanSteps && !state.winner; step += 1) {
    scannedSteps = step;
    if (
      state.currentPlayer === plannerSide &&
      !state.pendingLevelUp &&
      state.turnNumber >= options.turnFrom &&
      state.turnNumber <= options.turnTo
    ) {
      const selected = chooseCpuDecision(state, aiOptions);
      if (selected.type === "summon") {
        const alternatives = summonSlotAlternatives(state, selected, aiOptions, options.branchTop);
        if (alternatives.length >= 2) {
          cases.push(scanCase(seed, direction, step, state, selected, alternatives, options));
          if (options.streamProgress) {
            const item = cases[cases.length - 1];
            console.log(
              `[${seed} ${direction}] case ${cases.length} step ${step} T${state.turnNumber}: ` +
                `${item.selectedDecision} -> ${item.bestDecision}, delta ${item.scoreDelta}`,
            );
          }
          if (cases.length >= options.maxCasesPerDirection) {
            break;
          }
        }
      }
    }
    state = runAutoStep(state, aiOptions);
  }

  return {
    seed,
    direction,
    plannerSide,
    scannedSteps,
    capturedCases: cases.length,
    cases,
  };
}

function summonSlotAlternatives(
  state: GameState,
  selected: SummonDecision,
  aiOptions: CpuAiOptions,
  branchTop: number,
): { decision: SummonDecision; totalScore: number; index: number }[] {
  const selectedKey = decisionKey(selected);
  const alternatives = inspectCpuDecisionEvaluations(state, aiOptions)
    .filter((evaluation): evaluation is { decision: SummonDecision; totalScore: number; index: number } =>
      evaluation.decision.type === "summon" &&
      evaluation.decision.handInstanceId === selected.handInstanceId,
    )
    .sort((a, b) => b.totalScore - a.totalScore || a.index - b.index);
  if (!alternatives.some((evaluation) => decisionKey(evaluation.decision) === selectedKey)) {
    alternatives.unshift({ decision: selected, totalScore: selected.score, index: -1 });
  }
  return alternatives.slice(0, Math.max(2, branchTop));
}

function scanCase(
  seed: number,
  direction: Direction,
  step: number,
  state: GameState,
  selectedDecision: SummonDecision,
  alternatives: { decision: SummonDecision; totalScore: number; index: number }[],
  options: CliOptions,
): AuditCase {
  const plannerSide = plannerSideForDirection(direction);
  const selectedKey = decisionKey(selectedDecision);
  const branches = alternatives.map((alternative, index) =>
    replayBranch(
      state,
      plannerSide,
      alternative.decision,
      round(alternative.totalScore, 1),
      index + 1,
      selectedKey,
      options,
    ),
  );
  const selected = branches.find((branch) => branch.selected) ?? branches[0];
  const best = [...branches].sort((a, b) => b.branchScore - a.branchScore || a.rank - b.rank)[0] ?? selected;
  const winnerFlip = selected.winner !== plannerSide && best.winner === plannerSide;
  const scoreDelta = round(best.branchScore - selected.branchScore, 1);
  const promising = winnerFlip || scoreDelta >= options.improvementThreshold;
  return {
    seed,
    direction,
    step,
    turnNumber: state.turnNumber,
    plannerSide,
    state: stateLine(state, plannerSide),
    board: boardLine(state),
    selectedDecision: selected.decision,
    bestDecision: best.decision,
    selectedScore: selected.branchScore,
    bestScore: best.branchScore,
    scoreDelta,
    winnerFlip,
    promising,
    branches,
  };
}

function replayBranch(
  before: GameState,
  plannerSide: PlayerId,
  decision: SummonDecision,
  rootScore: number,
  rank: number,
  selectedKey: string,
  options: CliOptions,
): BranchOutcome {
  let state: GameState;
  try {
    state = applyCpuDecision(before, decision);
  } catch (error) {
    return {
      rank,
      decision: decisionLabel(before, decision),
      rootScore,
      selected: decisionKey(decision) === selectedKey,
      replaySteps: 0,
      finalTurn: before.turnNumber,
      branchScore: Number.NEGATIVE_INFINITY,
      finalState: stateLine(before, plannerSide),
      finalBoard: boardLine(before),
      error: error instanceof Error ? error.message : String(error),
    };
  }

  const aiOptions = aiOptionsFor(directionForPlannerSide(plannerSide));
  let replaySteps = 1;
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
    ...(state.winner ? { winner: state.winner } : {}),
    ...(winnerProfile ? { winnerProfile } : {}),
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
  return {
    profiles: direction === "challenger-as-cpu"
      ? { player: "white", cpu: "white_planner" }
      : { player: "white_planner", cpu: "white" },
  };
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

function decisionLabel(state: GameState, decision: SummonDecision): string {
  const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === decision.handInstanceId);
  return `summon:${card ? getCardName(card.cardId) : decision.handInstanceId}->${decision.slotKey}`;
}

function decisionKey(decision: SummonDecision): string {
  return `summon:${decision.handInstanceId}->${decision.slotKey}`;
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

function buildConclusion(samples: readonly SampleReport[], promising: readonly AuditCase[]): string[] {
  const cases = samples.reduce((total, sample) => total + sample.capturedCases, 0);
  if (cases === 0) {
    return [
      "同じ手札カードを複数スロットへ召喚できる selected summon 局面は見つからない。",
      "seed/turn 範囲を広げるか、召喚を選ばなかった局面の slot choice まで対象を広げる。",
    ];
  }
  if (promising.length === 0) {
    return [
      `${cases}件の selected summon slot choice を再生比較したが、閾値以上の悪化は見つからない。`,
      "次は summon slot より、召喚を選ばない/選ぶの二択、または相手応答込みの候補比較へ移る。",
    ];
  }
  const flips = promising.filter((item) => item.winnerFlip).length;
  return [
    `${cases}件の selected summon slot choice から promising ${promising.length}件、winner flip ${flips}件。`,
    "slot choice の評価概念へ落とせる局面だけを実装候補にする。",
  ];
}

function formatMarkdown(report: AuditReport): string {
  const lines = [
    "# White Planner Summon Slot Audit",
    "",
    `生成: ${report.generatedAt}`,
    `deck: \`${report.deckPreset}\``,
    `seeds: ${report.seedStart}-${report.seedStart + report.count - 1}`,
    `directions: ${report.directions.join(", ")}`,
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
    lines.push("| seed | direction | step | turn | selected | best | delta | selected score | best score |");
    lines.push("| ---: | --- | ---: | ---: | --- | --- | ---: | ---: | ---: |");
    for (const item of report.promising.slice(0, 20)) {
      lines.push(
        `| ${item.seed} | ${item.direction} | ${item.step} | ${item.turnNumber} | ` +
          `${escapeMarkdownTableCell(item.selectedDecision)} | ${escapeMarkdownTableCell(item.bestDecision)} | ` +
          `${item.scoreDelta} | ${item.selectedScore} | ${item.bestScore} |`,
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
      `- scannedSteps: ${sample.scannedSteps}`,
      `- capturedCases: ${sample.capturedCases}`,
      "",
    );
    for (const item of sample.cases) {
      lines.push(
        `#### step ${item.step} / turn ${item.turnNumber}`,
        "",
        `- state: ${item.state}`,
        `- board: ${item.board}`,
        `- selected: ${item.selectedDecision}`,
        `- best: ${item.bestDecision}`,
        `- scoreDelta: ${item.scoreDelta}`,
        "",
        "| rank | selected | decision | root | winner | final score | replay steps | final state |",
        "| ---: | --- | --- | ---: | --- | ---: | ---: | --- |",
      );
      for (const branch of item.branches) {
        lines.push(
          `| ${branch.rank} | ${branch.selected ? "Y" : ""} | ${escapeMarkdownTableCell(branch.decision)} | ` +
            `${branch.rootScore} | ${branch.winnerProfile ?? branch.winner ?? "-"} | ${branch.branchScore} | ` +
            `${branch.replaySteps} | ${escapeMarkdownTableCell(branch.error ?? branch.finalState)} |`,
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
    seedStart: 994300,
    count: 4,
    directions: ["challenger-as-cpu", "challenger-as-player"],
    turnFrom: 6,
    turnTo: 12,
    maxScanSteps: 220,
    maxCasesPerDirection: 4,
    branchTop: 4,
    maxReplaySteps: 150,
    improvementThreshold: 180,
    streamProgress: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--deck-preset") {
      parsed.deckPreset = readString(arg, next) as DeckPresetId;
      index += 1;
    } else if (arg === "--seed-start") {
      parsed.seedStart = readInteger(arg, next);
      index += 1;
    } else if (arg === "--count") {
      parsed.count = readInteger(arg, next);
      index += 1;
    } else if (arg === "--direction") {
      parsed.directions = readDirections(readString(arg, next));
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
    } else if (arg === "--max-cases-per-direction") {
      parsed.maxCasesPerDirection = readInteger(arg, next);
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

function readDirections(value: string): Direction[] {
  if (value === "both") {
    return ["challenger-as-cpu", "challenger-as-player"];
  }
  if (value === "challenger-as-cpu" || value === "challenger-as-player") {
    return [value];
  }
  throw new Error("--direction must be one of: both, challenger-as-cpu, challenger-as-player");
}

function printHelpAndExit(): never {
  console.log(`Usage:
  npm run audit:white-planner-summon-slot -- [options]

Options:
  --seed-start <n>                First seed. Default: 994300
  --count <n>                     Number of seeds. Default: 4
  --direction <value>             both, challenger-as-cpu, challenger-as-player. Default: both
  --turn-from <n>                 First turn to inspect. Default: 6
  --turn-to <n>                   Last turn to inspect. Default: 12
  --max-scan-steps <n>            Max auto steps per game. Default: 220
  --max-cases-per-direction <n>   Max selected summon cases per seed/direction. Default: 4
  --branch-top <n>                Same-hand summon candidates to replay. Default: 4
  --max-replay-steps <n>          Max replay steps per branch. Default: 150
  --improvement-threshold <n>     Promising score delta threshold. Default: 180
  --deck-preset <id>              Deck preset. Default: master-lab-white-1377-death-sheep3
  --stream-progress               Print progress for each captured case.
  --markdown <path>               Write Markdown report.
  --json <path>                   Write JSON report.
`);
  process.exit(0);
}
