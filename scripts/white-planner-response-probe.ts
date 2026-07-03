import { performance } from "node:perf_hooks";
import {
  applyCpuDecision,
  chooseCpuDecision,
  evaluateState,
  inspectCpuDecisionEvaluations,
  type CpuAiOptions,
  type CpuAiProfile,
  type CpuAiSearchOptions,
  type CpuDecision,
  type CpuDecisionEvaluation,
} from "../src/game/cpuAi";
import { AI_EVALUATION_WEIGHTS } from "../src/game/aiWeights";
import { getCardName } from "../src/game/cards";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, type DeckPresetId } from "../src/game/deckPresets";
import { createInitialGame, opponentOf, runAutoStep, targetToKey } from "../src/game/rules";
import type { GameState, PlayerId, SlotKey } from "../src/game/types";
import { escapeMarkdownTableCell, readInteger, readString, round, writeReport } from "./lib/cli";

type Direction = "challenger-as-cpu" | "challenger-as-player";

interface ProbeSampleInput {
  seed: number;
  direction: Direction;
  step: number;
}

interface Candidate {
  id: string;
  note: string;
  search: CpuAiSearchOptions;
}

interface CliOptions {
  deckPreset: DeckPresetId;
  samples: ProbeSampleInput[];
  candidates: Candidate[];
  maxReplaySteps: number;
  branchTop: number;
  streamProgress: boolean;
  markdownPath?: string;
  jsonPath?: string;
}

interface ProbeReport {
  generatedAt: string;
  deckPreset: DeckPresetId;
  maxReplaySteps: number;
  candidates: Candidate[];
  samples: ProbeSample[];
  summary: ProbeSummary[];
  conclusion: string[];
}

interface ProbeSample {
  seed: number;
  direction: Direction;
  step: number;
  plannerSide: PlayerId;
  currentPlayer: PlayerId;
  turnNumber: number;
  plannerTurn: boolean;
  state: string;
  board: string;
  candidates: CandidateProbe[];
}

interface CandidateProbe {
  candidateId: string;
  decision: string;
  reason: string;
  elapsedMs: number;
  rootRank: number;
  rootScore: number;
  branch: BranchOutcome;
  alternatives: AlternativeProbe[];
  topEvaluations: string[];
}

interface BranchOutcome {
  winner?: PlayerId;
  steps: number;
  score: number;
  state: string;
  board: string;
}

interface AlternativeProbe {
  decision: string;
  rootScore: number;
  branch: BranchOutcome;
}

interface ProbeSummary {
  candidateId: string;
  samples: number;
  changedDecision: number;
  wins: number;
  losses: number;
  averageScore: number;
  averageElapsedMs: number;
  maxElapsedMs: number;
}

const DEFAULT_CANDIDATES = [
  {
    id: "current",
    note: "現行 white_planner",
    search: {},
  },
  {
    id: "response2_width2",
    note: "相手応答を深さ2・幅2で読む",
    search: {
      sameTurnOpponentTerminalPlanDepth: 2,
      sameTurnOpponentTerminalPlanWidth: 2,
    },
  },
  {
    id: "response2_width3",
    note: "相手応答を深さ2・幅3で読む",
    search: {
      sameTurnOpponentTerminalPlanDepth: 2,
      sameTurnOpponentTerminalPlanWidth: 3,
    },
  },
  {
    id: "response2_width2_weight075",
    note: "相手応答2x2をやや強く反映する",
    search: {
      sameTurnOpponentTerminalPlanDepth: 2,
      sameTurnOpponentTerminalPlanWidth: 2,
      sameTurnOpponentTerminalPlanWeight: 0.75,
    },
  },
  {
    id: "terminal6_response2_width2",
    note: "自ターン終端深さ6 + 相手応答2x2",
    search: {
      sameTurnTerminalPlanDepth: 6,
      sameTurnOpponentTerminalPlanDepth: 2,
      sameTurnOpponentTerminalPlanWidth: 2,
    },
  },
] as const satisfies readonly Candidate[];

const DEFAULT_SAMPLES: ProbeSampleInput[] = [
  { seed: 994302, direction: "challenger-as-player", step: 238 },
  { seed: 994302, direction: "challenger-as-player", step: 244 },
  { seed: 994304, direction: "challenger-as-cpu", step: 240 },
  { seed: 994304, direction: "challenger-as-cpu", step: 246 },
  { seed: 994304, direction: "challenger-as-cpu", step: 252 },
];

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

console.log(`White planner response probe: ${report.samples.length} samples`);
for (const summary of report.summary) {
  console.log(
    `${summary.candidateId}: changed ${summary.changedDecision}/${summary.samples}, ` +
      `W-L ${summary.wins}-${summary.losses}, avg score ${summary.averageScore}, ` +
      `avg ${summary.averageElapsedMs}ms max ${summary.maxElapsedMs}ms`,
  );
}
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runProbe(options: CliOptions): ProbeReport {
  const sampleStates = replaySampleStates(options.samples, options.deckPreset);
  const samples = options.samples.map((sample, index) => {
    const probed = probeSample(sample, options, sampleStates.get(sampleInputKey(sample)));
    if (options.streamProgress) {
      console.log(formatSampleProgress(index + 1, probed));
    }
    return probed;
  });
  const summary = summarize(samples, options.candidates);
  return {
    generatedAt: new Date().toISOString(),
    deckPreset: options.deckPreset,
    maxReplaySteps: options.maxReplaySteps,
    candidates: options.candidates,
    samples,
    summary,
    conclusion: buildConclusion(summary),
  };
}

function probeSample(input: ProbeSampleInput, options: CliOptions, replayedState: GameState | undefined): ProbeSample {
  const plannerSide = plannerSideForDirection(input.direction);
  const state = replayedState ?? replayToStep(input, options.deckPreset);
  const candidates = options.candidates.map((candidate) =>
    probeCandidate(state, plannerSide, candidate, input, options.maxReplaySteps, options.branchTop)
  );
  return {
    ...input,
    plannerSide,
    currentPlayer: state.currentPlayer,
    turnNumber: state.turnNumber,
    plannerTurn: state.currentPlayer === plannerSide,
    state: stateLine(state, plannerSide),
    board: boardLine(state),
    candidates,
  };
}

function formatSampleProgress(index: number, sample: ProbeSample): string {
  const scores = sample.candidates.map((candidate) => `${candidate.candidateId}:${candidate.branch.score}`).join(", ");
  return `[sample ${index}] seed ${sample.seed} ${sample.direction} step ${sample.step} ${sample.state} -> ${scores}`;
}

function probeCandidate(
  state: GameState,
  plannerSide: PlayerId,
  candidate: Candidate,
  input: ProbeSampleInput,
  maxReplaySteps: number,
  branchTop: number,
): CandidateProbe {
  const aiOptions = aiOptionsFor(input.direction, candidate.search);
  const startedAt = performance.now();
  const decision = chooseCpuDecision(state, aiOptions);
  const elapsedMs = performance.now() - startedAt;
  const evaluations = inspectCpuDecisionEvaluations(state, aiOptions)
    .sort((a, b) => b.totalScore - a.totalScore || a.index - b.index);
  const key = decisionKey(decision);
  const rootRank = Math.max(1, evaluations.findIndex((evaluation) => decisionKey(evaluation.decision) === key) + 1);
  const rootScore = evaluations.find((evaluation) => decisionKey(evaluation.decision) === key)?.totalScore ?? decision.score;
  const alternatives = evaluations
    .filter((evaluation) => decisionKey(evaluation.decision) !== key)
    .slice(0, branchTop)
    .map((evaluation) => ({
      decision: decisionLabel(state, evaluation.decision),
      rootScore: round(evaluation.totalScore, 1),
      branch: replayBranch(state, plannerSide, evaluation.decision, aiOptions, maxReplaySteps),
    }));
  return {
    candidateId: candidate.id,
    decision: decisionLabel(state, decision),
    reason: decision.reason,
    elapsedMs: round(elapsedMs, 1),
    rootRank,
    rootScore: round(rootScore, 1),
    branch: replayBranch(state, plannerSide, decision, aiOptions, maxReplaySteps),
    alternatives,
    topEvaluations: evaluations.slice(0, 5).map((evaluation) => evaluationLine(state, evaluation)),
  };
}

function replayBranch(
  before: GameState,
  plannerSide: PlayerId,
  decision: CpuDecision,
  aiOptions: CpuAiOptions,
  maxReplaySteps: number,
): BranchOutcome {
  let state: GameState;
  try {
    state = applyCpuDecision(before, decision);
  } catch {
    return {
      winner: opponentOf(plannerSide),
      steps: 0,
      score: Number.NEGATIVE_INFINITY,
      state: "decision failed",
      board: boardLine(before),
    };
  }

  const sourceTurn = before.turnNumber;
  let steps = 0;
  while (
    !state.winner &&
    steps < maxReplaySteps &&
    !(state.currentPlayer === plannerSide && state.turnNumber > sourceTurn)
  ) {
    state = runAutoStep(state, aiOptions);
    steps += 1;
  }

  return {
    ...(state.winner ? { winner: state.winner } : {}),
    steps,
    score: round(branchScore(state, plannerSide), 1),
    state: stateLine(state, plannerSide),
    board: boardLine(state),
  };
}

function replayToStep(input: ProbeSampleInput, deckPreset: DeckPresetId): GameState {
  let state = createWhiteMirrorGame(input.seed, deckPreset);
  const aiOptions = aiOptionsFor(input.direction, {});
  for (let step = 0; step < input.step && !state.winner; step += 1) {
    state = runAutoStep(state, aiOptions);
  }
  return state;
}

function replaySampleStates(samples: readonly ProbeSampleInput[], deckPreset: DeckPresetId): Map<string, GameState> {
  const result = new Map<string, GameState>();
  const groups = new Map<string, ProbeSampleInput[]>();
  for (const sample of samples) {
    const groupKey = `${sample.seed}:${sample.direction}`;
    groups.set(groupKey, [...(groups.get(groupKey) ?? []), sample]);
  }

  for (const groupedSamples of groups.values()) {
    const sorted = [...groupedSamples].sort((a, b) => a.step - b.step);
    const first = sorted[0];
    if (!first) {
      continue;
    }
    let state = createWhiteMirrorGame(first.seed, deckPreset);
    const aiOptions = aiOptionsFor(first.direction, {});
    let currentStep = 0;
    for (const sample of sorted) {
      while (currentStep < sample.step && !state.winner) {
        state = runAutoStep(state, aiOptions);
        currentStep += 1;
      }
      result.set(sampleInputKey(sample), state);
    }
  }
  return result;
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

function aiOptionsFor(direction: Direction, search: CpuAiSearchOptions): CpuAiOptions {
  const plannerSide = plannerSideForDirection(direction);
  return {
    profiles: profilesForDirection(direction),
    searches: { [plannerSide]: search },
  };
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

function summarize(samples: readonly ProbeSample[], candidates: readonly Candidate[]): ProbeSummary[] {
  return candidates.map((candidate) => {
    const probes = samples.map((sample) => sample.candidates.find((probe) => probe.candidateId === candidate.id)).filter(isDefined);
    const currentBySample = new Map(samples.map((sample) => [sampleKey(sample), sample.candidates.find((probe) => probe.candidateId === "current")]));
    const changedDecision = samples.filter((sample) => {
      const current = currentBySample.get(sampleKey(sample));
      const probe = sample.candidates.find((item) => item.candidateId === candidate.id);
      return !!current && !!probe && current.decision !== probe.decision;
    }).length;
    const wins = probes.filter((probe) => probe.branch.winner === samples.find((sample) => sample.candidates.includes(probe))?.plannerSide).length;
    const losses = probes.filter((probe) => {
      const sample = samples.find((item) => item.candidates.includes(probe));
      return !!sample && probe.branch.winner === opponentOf(sample.plannerSide);
    }).length;
    return {
      candidateId: candidate.id,
      samples: probes.length,
      changedDecision,
      wins,
      losses,
      averageScore: round(average(probes.map((probe) => probe.branch.score)), 1),
      averageElapsedMs: round(average(probes.map((probe) => probe.elapsedMs)), 1),
      maxElapsedMs: round(Math.max(0, ...probes.map((probe) => probe.elapsedMs)), 1),
    };
  });
}

function sampleKey(sample: ProbeSample): string {
  return `${sample.seed}:${sample.direction}:${sample.step}`;
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function buildConclusion(summary: readonly ProbeSummary[]): string[] {
  const current = summary.find((item) => item.candidateId === "current");
  const ranked = [...summary].sort(
    (a, b) =>
      b.wins - a.wins ||
      a.losses - b.losses ||
      b.averageScore - a.averageScore ||
      a.averageElapsedMs - b.averageElapsedMs,
  );
  const rawBest = ranked[0];
  const best =
    current && rawBest && rawBest.wins === current.wins && rawBest.losses === current.losses &&
    rawBest.averageScore === current.averageScore && rawBest.changedDecision === 0
      ? current
      : rawBest;
  if (!current || !best) {
    return ["監査対象が不足している。"];
  }
  const lines = [
    `終盤局面の軽量分岐では best=${best.candidateId}、W-L ${best.wins}-${best.losses}、平均score ${best.averageScore}。`,
  ];
  if (best.candidateId === "current") {
    lines.push("今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。");
  } else if (best.averageElapsedMs > current.averageElapsedMs * 2.5) {
    lines.push("best候補は現行より良いが思考時間の増加が大きい。デフォルト採用前に中母数と時間上限を確認する。");
  } else {
    lines.push("best候補は現行より有望。次は同候補だけを小母数の通しベンチに戻して副作用を見る。");
  }
  return lines;
}

function formatMarkdown(report: ProbeReport): string {
  const lines = [
    "# White Planner Response Probe",
    "",
    `生成: ${report.generatedAt}`,
    `deck: \`${report.deckPreset}\``,
    `maxReplaySteps: ${report.maxReplaySteps}`,
    "",
    "## Summary",
    "",
    "| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |",
  ];

  for (const summary of report.summary) {
    const note = report.candidates.find((candidate) => candidate.id === summary.candidateId)?.note ?? "-";
    lines.push(
      `| ${summary.candidateId} | ${summary.samples} | ${summary.changedDecision} | ${summary.wins}-${summary.losses} | ` +
        `${summary.averageScore} | ${summary.averageElapsedMs} | ${summary.maxElapsedMs} | ${escapeMarkdownTableCell(note)} |`,
    );
  }

  lines.push("", "## Conclusion", "");
  report.conclusion.forEach((line) => lines.push(`- ${line}`));

  lines.push("", "## Samples", "");
  for (const sample of report.samples) {
    lines.push(
      `### seed ${sample.seed} ${sample.direction} step ${sample.step}`,
      "",
      `- turn: ${sample.turnNumber}`,
      `- plannerSide: ${sample.plannerSide}`,
      `- currentPlayer: ${sample.currentPlayer}`,
      `- plannerTurn: ${sample.plannerTurn ? "Y" : "N"}`,
      `- state: ${sample.state}`,
      `- board: ${sample.board}`,
      "",
      "| candidate | decision | root | ms | branch winner | branch score | branch state | reason |",
      "| --- | --- | ---: | ---: | --- | ---: | --- | --- |",
    );
    for (const probe of sample.candidates) {
      lines.push(
        `| ${probe.candidateId} | ${escapeMarkdownTableCell(probe.decision)} | ${probe.rootRank}/${probe.rootScore} | ` +
          `${probe.elapsedMs} | ${probe.branch.winner ?? "-"} | ${probe.branch.score} | ${escapeMarkdownTableCell(probe.branch.state)} | ` +
          `${escapeMarkdownTableCell(probe.reason)} |`,
      );
    }
    lines.push("", "Top evaluations:");
    for (const probe of sample.candidates) {
      lines.push(`- ${probe.candidateId}: ${probe.topEvaluations.map(escapeMarkdownTableCell).join(" / ")}`);
      if (probe.alternatives.length > 0) {
        for (const alternative of probe.alternatives) {
          lines.push(
            `  - alt ${escapeMarkdownTableCell(alternative.decision)} root ${alternative.rootScore}: ` +
              `branch ${alternative.branch.winner ?? "-"} score ${alternative.branch.score} ` +
              `${escapeMarkdownTableCell(alternative.branch.state)}`,
          );
        }
      }
    }
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

function evaluationLine(state: GameState, evaluation: CpuDecisionEvaluation): string {
  return `${round(evaluation.totalScore, 1)} ${decisionLabel(state, evaluation.decision)}`;
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

function average(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    deckPreset: "master-lab-white-1377-death-sheep3",
    samples: [...DEFAULT_SAMPLES],
    candidates: [...DEFAULT_CANDIDATES],
    maxReplaySteps: 80,
    branchTop: 0,
    streamProgress: false,
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--deck-preset") {
      parsed.deckPreset = readString(arg, next) as DeckPresetId;
      index += 1;
    } else if (arg === "--sample") {
      parsed.samples = [...parsed.samples, readSample(readString(arg, next))];
      index += 1;
    } else if (arg === "--only-sample") {
      parsed.samples = [readSample(readString(arg, next))];
      index += 1;
    } else if (arg === "--candidate") {
      parsed.candidates = readCandidates(readString(arg, next));
      index += 1;
    } else if (arg === "--max-replay-steps") {
      parsed.maxReplaySteps = readInteger(arg, next);
      index += 1;
    } else if (arg === "--branch-top") {
      parsed.branchTop = readInteger(arg, next);
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

function readSample(value: string): ProbeSampleInput {
  const [seedRaw, direction, stepRaw] = value.split(":");
  const seed = Number(seedRaw);
  const step = Number(stepRaw);
  if (!Number.isInteger(seed) || !Number.isInteger(step) || !isDirection(direction)) {
    throw new Error("--sample must be formatted as seed:direction:step");
  }
  return { seed, direction, step };
}

function sampleInputKey(sample: ProbeSampleInput): string {
  return `${sample.seed}:${sample.direction}:${sample.step}`;
}

function isDirection(value: string | undefined): value is Direction {
  return value === "challenger-as-cpu" || value === "challenger-as-player";
}

function readCandidates(value: string): Candidate[] {
  if (value === "all") {
    return [...DEFAULT_CANDIDATES];
  }
  const ids = value.split(",").map((id) => id.trim()).filter(Boolean);
  const candidates = ids.map((id) => {
    const candidate = DEFAULT_CANDIDATES.find((item) => item.id === id);
    if (!candidate) {
      throw new Error(`Unknown candidate: ${id}`);
    }
    return candidate;
  });
  if (candidates.length === 0) {
    throw new Error("--candidate requires at least one candidate id");
  }
  return candidates;
}

function printHelpAndExit(): never {
  console.log(`Usage:
  npm run audit:white-planner-response-probe -- [options]

Options:
  --deck-preset <id>          Deck preset. Default: master-lab-white-1377-death-sheep3
  --only-sample <s:d:step>    Replace default samples with one sample.
  --sample <s:d:step>         Add sample. Direction: challenger-as-cpu or challenger-as-player.
  --candidate <ids>           Comma-separated candidate ids or all. Default: all
  --max-replay-steps <n>      Steps to replay after branch. Default: 80
  --branch-top <n>            Also replay top unselected root candidates. Default: 0
  --stream-progress           Print one line after each sample.
  --markdown <path>           Write Markdown report.
  --json <path>               Write JSON report.

Candidates:
${DEFAULT_CANDIDATES.map((candidate) => `  - ${candidate.id}: ${candidate.note}`).join("\n")}
`);
  process.exit(0);
}
