import { readFileSync } from "node:fs";
import { getCardName } from "../src/game/cards";
import { CURRENT_WHITE_AI_DECK_PRESET_ID } from "../src/game/currentWhiteAiFixtures";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial } from "../src/game/deckPresets";
import {
  applyCpuDecision,
  chooseCpuDecision,
  inspectCpuDecisionEvaluations,
  type CpuDecision,
  type CpuDecisionEvaluation,
} from "../src/game/cpuAi";
import {
  createInitialGame,
  runAutoStep,
  targetToKey,
} from "../src/game/rules";
import type { GameState, PlayerId } from "../src/game/types";
import { escapeMarkdownTableCell, readInteger, readString, round, writeReport } from "./lib/cli";

type BranchKind = "selected" | "same_card_different_slot" | "attack_first" | "focus_only" | "end_turn";

interface CliOptions {
  inputPath: string;
  markdownPath?: string;
  jsonPath?: string;
  maxSamples: number;
  maxReplaySteps: number;
  closeDelta: number;
}

interface SourceSample {
  flags: string[];
  seed: number;
  seat: PlayerId;
  turnNumber: number;
  step: number;
  selectedDecision: string;
  bestAlternative: string;
  bestAlternativeDelta?: number;
  punished: boolean;
  ownBoardSwing: number;
}

interface SourceReport {
  samples: SourceSample[];
}

interface BranchReplayReport {
  generatedAt: string;
  inputPath: string;
  sampleCount: number;
  replayedCount: number;
  metrics: {
    selectedMismatch: number;
    samplesWithBetterAlternative: number;
    samplesWithMuchBetterAlternative: number;
  };
  samples: BranchReplaySample[];
  conclusion: string[];
  nextLoopProposal: string[];
}

interface BranchReplaySample {
  seed: number;
  step: number;
  turnNumber: number;
  seat: PlayerId;
  sourceSelected: string;
  replaySelected: string;
  selectedMatched: boolean;
  sourceBestAlternative: string;
  sourceBestAlternativeDelta?: number;
  sourcePunished: boolean;
  sourceOwnBoardSwing: number;
  preState: string;
  branches: BranchOutcome[];
  bestBranchKind: BranchKind;
  selectedRank: number;
  bestVsSelectedScoreDelta: number;
  reading: string;
}

interface BranchOutcome {
  kind: BranchKind;
  decision: string;
  totalScore: number;
  deltaFromSelectedEval: number;
  applied: boolean;
  error?: string;
  stepsToNextOwn: number;
  winner?: PlayerId;
  score: number;
  boardBalance: number;
  ownBoard: number;
  opponentBoard: number;
  hpBalance: number;
  ownHp: number;
  opponentHp: number;
  stoneBalance: number;
  ownStones: number;
  opponentStones: number;
  handBalance: number;
  ownHand: number;
  opponentHand: number;
  ownMonsterCount: number;
  opponentMonsterCount: number;
  state: string;
}

const options = parseArgs(process.argv.slice(2));
const report = runAudit(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
}

console.log(`White mirror branch replay audit: ${report.replayedCount}/${report.sampleCount} samples`);
console.log(
  `mismatch ${report.metrics.selectedMismatch}, ` +
    `betterAlt ${report.metrics.samplesWithBetterAlternative}, ` +
    `muchBetterAlt ${report.metrics.samplesWithMuchBetterAlternative}`,
);
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runAudit(options: CliOptions): BranchReplayReport {
  const input = JSON.parse(readFileSync(options.inputPath, "utf8")) as SourceReport;
  const sourceSamples = input.samples
    .filter((sample) =>
      sample.flags.includes("blocked_backline_summon") &&
      (sample.bestAlternativeDelta ?? Number.NEGATIVE_INFINITY) >= options.closeDelta
    )
    .slice(0, options.maxSamples);
  const samples: BranchReplaySample[] = [];
  let selectedMismatch = 0;
  let samplesWithBetterAlternative = 0;
  let samplesWithMuchBetterAlternative = 0;

  for (const source of sourceSamples) {
    const replay = replaySample(source, options.maxReplaySteps);
    samples.push(replay);
    if (!replay.selectedMatched) {
      selectedMismatch += 1;
    }
    if (replay.bestVsSelectedScoreDelta > 0) {
      samplesWithBetterAlternative += 1;
    }
    if (replay.bestVsSelectedScoreDelta >= 80) {
      samplesWithMuchBetterAlternative += 1;
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    inputPath: options.inputPath,
    sampleCount: sourceSamples.length,
    replayedCount: samples.length,
    metrics: {
      selectedMismatch,
      samplesWithBetterAlternative,
      samplesWithMuchBetterAlternative,
    },
    samples,
    conclusion: buildConclusion(samples),
    nextLoopProposal: buildNextLoopProposal(samples),
  };
}

function replaySample(source: SourceSample, maxReplaySteps: number): BranchReplaySample {
  const state = replayToStep(source.seed, source.step);
  const selected = chooseCpuDecision(state, aiOptions());
  const selectedText = decisionToText(selected);
  const evaluations = inspectCpuDecisionEvaluations(state, aiOptions());
  const selectedEvaluation = findEvaluation(evaluations, selectedText);
  const selectedEvalScore = selectedEvaluation?.totalScore ?? selected.score;
  const branches = buildBranchDecisions(evaluations, selected, selectedText, selectedEvalScore)
    .map((branch) => evaluateBranch(state, source.seat, source.turnNumber, branch, maxReplaySteps));
  const selectedOutcome = branches.find((branch) => branch.kind === "selected") ?? branches[0];
  const ranked = [...branches].sort((a, b) => b.score - a.score || branchKindPriority(a.kind) - branchKindPriority(b.kind));
  const best = ranked[0] ?? selectedOutcome;
  const selectedRank = ranked.findIndex((branch) => branch.kind === "selected") + 1;
  const bestVsSelectedScoreDelta = selectedOutcome ? round(best.score - selectedOutcome.score, 1) : 0;

  return {
    seed: source.seed,
    step: source.step,
    turnNumber: source.turnNumber,
    seat: source.seat,
    sourceSelected: source.selectedDecision,
    replaySelected: selectedText,
    selectedMatched: source.selectedDecision === selectedText,
    sourceBestAlternative: source.bestAlternative,
    ...(source.bestAlternativeDelta !== undefined ? { sourceBestAlternativeDelta: source.bestAlternativeDelta } : {}),
    sourcePunished: source.punished,
    sourceOwnBoardSwing: source.ownBoardSwing,
    preState: stateLine(state, source.seat),
    branches,
    bestBranchKind: best.kind,
    selectedRank,
    bestVsSelectedScoreDelta,
    reading: readingForBranchReplay(best, selectedOutcome, source),
  };
}

function replayToStep(seed: number, targetStep: number): GameState {
  let state = createWhiteMirrorInitialGame(seed);
  for (let step = 0; step < targetStep; step += 1) {
    state = runAutoStep(state, aiOptions());
    if (state.winner) {
      break;
    }
  }
  return state;
}

function buildBranchDecisions(
  evaluations: readonly CpuDecisionEvaluation[],
  selected: CpuDecision,
  selectedText: string,
  selectedEvalScore: number,
): Array<{ kind: BranchKind; decision: CpuDecision; totalScore: number; deltaFromSelectedEval: number }> {
  const selectedSummon = selected.type === "summon" ? selected : undefined;
  const branches: Array<{ kind: BranchKind; decision: CpuDecision; totalScore: number; deltaFromSelectedEval: number }> = [
    {
      kind: "selected",
      decision: selected,
      totalScore: selectedEvalScore,
      deltaFromSelectedEval: 0,
    },
  ];
  const add = (kind: BranchKind, evaluation: CpuDecisionEvaluation | undefined) => {
    if (!evaluation) {
      return;
    }
    const text = decisionToText(evaluation.decision);
    if (text === selectedText || branches.some((branch) => decisionToText(branch.decision) === text)) {
      return;
    }
    branches.push({
      kind,
      decision: evaluation.decision,
      totalScore: round(evaluation.totalScore, 1),
      deltaFromSelectedEval: round(evaluation.totalScore - selectedEvalScore, 1),
    });
  };

  add(
    "same_card_different_slot",
    selectedSummon
      ? bestEvaluation(evaluations, (evaluation) =>
          evaluation.decision.type === "summon" &&
          evaluation.decision.handInstanceId === selectedSummon.handInstanceId &&
          evaluation.decision.slotKey !== selectedSummon.slotKey
        )
      : undefined,
  );
  add("attack_first", bestEvaluation(evaluations, (evaluation) =>
    evaluation.decision.type === "attack" && evaluation.decision.action.target.kind === "monster"
  ));
  add("focus_only", bestEvaluation(evaluations, (evaluation) => evaluation.decision.type === "focus"));
  add("end_turn", bestEvaluation(evaluations, (evaluation) => evaluation.decision.type === "end_turn"));
  return branches;
}

function evaluateBranch(
  before: GameState,
  seat: PlayerId,
  sourceTurnNumber: number,
  branch: { kind: BranchKind; decision: CpuDecision; totalScore: number; deltaFromSelectedEval: number },
  maxReplaySteps: number,
): BranchOutcome {
  let state: GameState;
  try {
    state = applyCpuDecision(before, branch.decision);
  } catch (error) {
    return failedBranch(branch, error);
  }

  let stepsToNextOwn = 0;
  while (
    !state.winner &&
    stepsToNextOwn < maxReplaySteps &&
    !(state.currentPlayer === seat && state.turnNumber > sourceTurnNumber)
  ) {
    state = runAutoStep(state, aiOptions());
    stepsToNextOwn += 1;
  }

  return {
    kind: branch.kind,
    decision: decisionToText(branch.decision),
    totalScore: branch.totalScore,
    deltaFromSelectedEval: branch.deltaFromSelectedEval,
    applied: true,
    stepsToNextOwn,
    ...(state.winner ? { winner: state.winner } : {}),
    ...scoreState(state, seat),
    state: stateLine(state, seat),
  };
}

function failedBranch(
  branch: { kind: BranchKind; decision: CpuDecision; totalScore: number; deltaFromSelectedEval: number },
  error: unknown,
): BranchOutcome {
  return {
    kind: branch.kind,
    decision: decisionToText(branch.decision),
    totalScore: branch.totalScore,
    deltaFromSelectedEval: branch.deltaFromSelectedEval,
    applied: false,
    error: error instanceof Error ? error.message : String(error),
    stepsToNextOwn: 0,
    score: Number.NEGATIVE_INFINITY,
    boardBalance: 0,
    ownBoard: 0,
    opponentBoard: 0,
    hpBalance: 0,
    ownHp: 0,
    opponentHp: 0,
    stoneBalance: 0,
    ownStones: 0,
    opponentStones: 0,
    handBalance: 0,
    ownHand: 0,
    opponentHand: 0,
    ownMonsterCount: 0,
    opponentMonsterCount: 0,
    state: "-",
  };
}

function createWhiteMirrorInitialGame(seed: number): GameState {
  const deck = buildDeckPresetCardIds(CURRENT_WHITE_AI_DECK_PRESET_ID);
  const allowSpecial = deckPresetAllowsSpecial(CURRENT_WHITE_AI_DECK_PRESET_ID);
  return createInitialGame(seed, {
    masterIds: { player: "white", cpu: "white" },
    playerDeckCardIds: deck,
    cpuDeckCardIds: deck,
    allowSpecialDecks: { player: allowSpecial, cpu: allowSpecial },
  });
}

function aiOptions() {
  return {
    profiles: {
      player: "white",
      cpu: "white",
    },
  } as const;
}

function findEvaluation(evaluations: readonly CpuDecisionEvaluation[], decisionText: string): CpuDecisionEvaluation | undefined {
  return evaluations.find((evaluation) => decisionToText(evaluation.decision) === decisionText);
}

function bestEvaluation(
  evaluations: readonly CpuDecisionEvaluation[],
  predicate: (evaluation: CpuDecisionEvaluation) => boolean,
): CpuDecisionEvaluation | undefined {
  return evaluations
    .filter(predicate)
    .sort((a, b) => b.totalScore - a.totalScore || a.index - b.index)[0];
}

function scoreState(state: GameState, seat: PlayerId): Omit<BranchOutcome, "kind" | "decision" | "totalScore" | "deltaFromSelectedEval" | "applied" | "error" | "stepsToNextOwn" | "winner" | "state"> {
  const opponent = opponentOf(seat);
  const ownBoard = boardValue(state, seat);
  const opponentBoard = boardValue(state, opponent);
  const boardBalance = ownBoard - opponentBoard;
  const ownHp = state.players[seat].masterHp;
  const opponentHp = state.players[opponent].masterHp;
  const hpBalance = ownHp - opponentHp;
  const ownStones = state.players[seat].stones;
  const opponentStones = state.players[opponent].stones;
  const stoneBalance = ownStones - opponentStones;
  const ownHand = state.players[seat].hand.length;
  const opponentHand = state.players[opponent].hand.length;
  const handBalance = ownHand - opponentHand;
  const ownMonsterCount = monsterCount(state, seat);
  const opponentMonsterCount = monsterCount(state, opponent);
  const score = state.winner === seat
    ? 1_000_000
    : state.winner === opponent
      ? -1_000_000
      : boardBalance + hpBalance * 140 + stoneBalance * 10 + handBalance * 18;
  return {
    score: round(score, 1),
    boardBalance,
    ownBoard,
    opponentBoard,
    hpBalance,
    ownHp,
    opponentHp,
    stoneBalance,
    ownStones,
    opponentStones,
    handBalance,
    ownHand,
    opponentHand,
    ownMonsterCount,
    opponentMonsterCount,
  };
}

function boardValue(state: GameState, seat: PlayerId): number {
  return Object.values(state.slots).reduce((total, slot) => {
    const monster = slot.monster;
    if (!monster || monster.owner !== seat) {
      return total;
    }
    return total + monster.level * 80 + monster.hp * 18 + (monster.shielded ? 25 : 0);
  }, 0);
}

function monsterCount(state: GameState, seat: PlayerId): number {
  return Object.values(state.slots).filter((slot) => slot.monster?.owner === seat).length;
}

function stateLine(state: GameState, seat: PlayerId): string {
  const opponent = opponentOf(seat);
  return `${seat} HP${state.players[seat].masterHp} S${state.players[seat].stones} B${boardValue(state, seat)} H${state.players[seat].hand.length} / ` +
    `${opponent} HP${state.players[opponent].masterHp} S${state.players[opponent].stones} B${boardValue(state, opponent)} H${state.players[opponent].hand.length} / ` +
    boardLine(state);
}

function boardLine(state: GameState): string {
  const occupied = Object.values(state.slots).filter((slot) => slot.monster);
  if (occupied.length === 0) {
    return "-";
  }
  return occupied.map((slot) => {
    const monster = slot.monster;
    if (!monster) {
      return "";
    }
    const status = monster.status ? ` ${monster.status}` : "";
    const shield = monster.shielded ? " shield" : "";
    return `${slot.key}:${monster.owner}:${safeCardName(monster.cardId)} L${monster.level} HP${monster.hp}${status}${shield}`;
  }).join(" | ");
}

function safeCardName(cardId: string): string {
  try {
    return getCardName(cardId);
  } catch {
    return cardId;
  }
}

function decisionToText(decision: CpuDecision): string {
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

function opponentOf(player: PlayerId): PlayerId {
  return player === "player" ? "cpu" : "player";
}

function branchKindPriority(kind: BranchKind): number {
  return ["selected", "same_card_different_slot", "attack_first", "focus_only", "end_turn"].indexOf(kind);
}

function readingForBranchReplay(best: BranchOutcome, selected: BranchOutcome | undefined, source: SourceSample): string {
  if (!selected) {
    return "selected branch missing";
  }
  const delta = best.score - selected.score;
  if (best.kind === "selected") {
    return "selected remains best after replay";
  }
  if (delta >= 80) {
    return `${best.kind} is materially better after replay; blocked summon is a candidate for a narrow rule`;
  }
  if (delta > 0) {
    return `${best.kind} is slightly better after replay; inspect before rule adoption`;
  }
  if (source.punished && source.ownBoardSwing <= -180) {
    return "source was punished, but branch replay did not find a better first move among tracked alternatives";
  }
  return "no replay evidence against selected";
}

function buildConclusion(samples: readonly BranchReplaySample[]): string[] {
  const lines: string[] = [];
  const selectedBest = samples.filter((sample) => sample.bestBranchKind === "selected").length;
  const better = samples.filter((sample) => sample.bestBranchKind !== "selected" && sample.bestVsSelectedScoreDelta > 0).length;
  const materiallyBetter = samples.filter((sample) => sample.bestBranchKind !== "selected" && sample.bestVsSelectedScoreDelta >= 80).length;
  const mismatches = samples.filter((sample) => !sample.selectedMatched).length;
  lines.push(`replayed samples: ${samples.length}, selected best: ${selectedBest}, better alternative: ${better}, materially better: ${materiallyBetter}, selected mismatch: ${mismatches}`);
  const kindCounts = new Map<BranchKind, number>();
  for (const sample of samples) {
    kindCounts.set(sample.bestBranchKind, (kindCounts.get(sample.bestBranchKind) ?? 0) + 1);
  }
  lines.push(`best branch kinds: ${[...kindCounts.entries()].map(([kind, count]) => `${kind}:${count}`).join(", ") || "-"}`);
  if (materiallyBetter > 0) {
    lines.push("blocked-backline summon has at least one replay-backed bad pattern. Candidate rule should target only those patterns.");
  } else {
    lines.push("tracked alternatives did not clearly beat selected in this small replay set. More samples or a narrower branch set is needed before changing AI.");
  }
  return lines;
}

function buildNextLoopProposal(samples: readonly BranchReplaySample[]): string[] {
  const proposals: string[] = [];
  const materiallyBetter = samples.filter((sample) => sample.bestBranchKind !== "selected" && sample.bestVsSelectedScoreDelta >= 80);
  if (materiallyBetter.length > 0) {
    proposals.push("Extract shared conditions from materially better alternatives, then implement a candidate variant rather than a broad penalty.");
    proposals.push("Run a small white-mirror candidate loop with only that narrow blocked-backline rule.");
  } else {
    proposals.push("Collect more blocked-backline close samples from additional seeds before implementing a rule.");
    proposals.push("If more samples still do not show replay loss, move to non-kill monster attack push/pull audit.");
  }
  return proposals;
}

function formatMarkdown(report: BranchReplayReport): string {
  const lines: string[] = [];
  lines.push("# White Mirror Branch Replay Audit");
  lines.push("");
  lines.push(`生成: ${report.generatedAt}`);
  lines.push(`input: ${report.inputPath}`);
  lines.push(`samples: ${report.replayedCount}/${report.sampleCount}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- selected mismatch: ${report.metrics.selectedMismatch}`);
  lines.push(`- samples with better alternative: ${report.metrics.samplesWithBetterAlternative}`);
  lines.push(`- samples with materially better alternative: ${report.metrics.samplesWithMuchBetterAlternative}`);
  lines.push("");
  lines.push("## Conclusion");
  lines.push("");
  report.conclusion.forEach((line) => lines.push(`- ${line}`));
  lines.push("");
  lines.push("## Next Loop Proposal");
  lines.push("");
  report.nextLoopProposal.forEach((line) => lines.push(`- ${line}`));
  lines.push("");
  lines.push("## Samples");
  lines.push("");
  lines.push("| seed | step | turn | match | source selected | replay selected | source best | best branch | rank | score delta | reading |");
  lines.push("|---:|---:|---:|---|---|---|---|---|---:|---:|---|");
  for (const sample of report.samples) {
    lines.push(
      `| ${sample.seed} | ${sample.step} | ${sample.turnNumber} | ${sample.selectedMatched ? "yes" : "no"} | ` +
        `${escapeMarkdownTableCell(sample.sourceSelected)} | ${escapeMarkdownTableCell(sample.replaySelected)} | ` +
        `${escapeMarkdownTableCell(sample.sourceBestAlternative)} | ${sample.bestBranchKind} | ${sample.selectedRank} | ` +
        `${sample.bestVsSelectedScoreDelta} | ${escapeMarkdownTableCell(sample.reading)} |`,
    );
  }
  lines.push("");
  lines.push("## Branch Details");
  for (const sample of report.samples) {
    lines.push("");
    lines.push(`### seed ${sample.seed} step ${sample.step}`);
    lines.push("");
    lines.push(`pre: ${sample.preState}`);
    lines.push("");
    lines.push("| branch | eval delta | applied | steps | winner | score | board | hp | stones | hand | monsters | decision | state |");
    lines.push("|---|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---|---|");
    for (const branch of sample.branches) {
      lines.push(
        `| ${branch.kind} | ${branch.deltaFromSelectedEval} | ${branch.applied ? "yes" : "no"} | ${branch.stepsToNextOwn} | ` +
          `${branch.winner ?? "-"} | ${branch.score} | ${branch.boardBalance} | ${branch.hpBalance} | ${branch.stoneBalance} | ` +
          `${branch.handBalance} | ${branch.ownMonsterCount}-${branch.opponentMonsterCount} | ` +
          `${escapeMarkdownTableCell(branch.decision)} | ${escapeMarkdownTableCell(branch.error ?? branch.state)} |`,
      );
    }
  }
  return lines.join("\n");
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    inputPath: "docs/master_lab/results/2026-07-03_white_mirror_decision_alternative_audit_blocked_trace_gpm1.json",
    maxSamples: 16,
    maxReplaySteps: 80,
    closeDelta: -24,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    switch (arg) {
      case "--input":
        options.inputPath = readString(arg, args[++index]);
        break;
      case "--max-samples":
        options.maxSamples = readInteger(arg, args[++index]);
        break;
      case "--max-replay-steps":
        options.maxReplaySteps = readInteger(arg, args[++index]);
        break;
      case "--close-delta":
        options.closeDelta = readInteger(arg, args[++index]);
        break;
      case "--markdown":
        options.markdownPath = readString(arg, args[++index]);
        break;
      case "--json":
        options.jsonPath = readString(arg, args[++index]);
        break;
      case "--help":
        printHelpAndExit();
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }
  return options;
}

function printHelpAndExit(): never {
  console.log(`Usage:
  npm run audit:white-mirror-branch-replay -- [options]

Options:
  --input <path>             Decision alternative audit JSON.
  --max-samples <n>          Max blocked-backline close samples. Default: 16
  --max-replay-steps <n>     Max auto steps after forced first decision. Default: 80
  --close-delta <n>          Include samples with bestAlternativeDelta >= n. Default: -24
  --markdown <path>          Write Markdown report.
  --json <path>              Write JSON report.
`);
  process.exit(0);
}
