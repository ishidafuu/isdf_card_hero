import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { escapeMarkdownTableCell, readInteger, readString, round, writeReport } from "./lib/cli";

interface CliOptions {
  tracePaths: string[];
  maxSamples: number;
  markdownPath?: string;
  jsonPath?: string;
}

interface DecisionTraceEntry {
  step: number;
  turnNumber: number;
  side: PlayerId;
  decision: string;
  reason: string;
  state: string;
  board: string;
  afterState: string;
  afterBoard: string;
}

interface DecisionTraceReport {
  options?: {
    seed?: number;
    direction?: string;
    deckPreset?: string;
  };
  plannerSide: PlayerId;
  winner?: PlayerId;
  winnerProfile?: string;
  finalState: string;
  decisions: DecisionTraceEntry[];
}

type PlayerId = "player" | "cpu";

interface ParsedStateLine {
  turnNumber?: number;
  currentPlayer?: PlayerId;
  hp: Record<PlayerId, number>;
  stones: Record<PlayerId, number>;
}

interface ParsedMonster {
  slotKey: string;
  owner: PlayerId;
  row: "front" | "back";
  name: string;
  level: number;
  hp: number;
  status: "prep" | "active";
  actionCount: number;
  actionLimit: number;
  focused: boolean;
  shielded: boolean;
}

interface BoardStats {
  count: number;
  frontCount: number;
  level2Plus: number;
  level3Plus: number;
  totalLevel: number;
  totalHp: number;
  frontLevel2Plus: number;
  frontLevel3Plus: number;
}

interface TurnRiskSample {
  trace: string;
  seed?: number;
  direction?: string;
  plannerSide: PlayerId;
  turnNumber: number;
  handoffStep: number;
  score: number;
  kinds: string[];
  finalStones: number;
  ownHpLoss: number;
  ownLost: number;
  opponentLevel2PlusGain: number;
  opponentLevel3Gain: number;
  opponentFrontLevel2PlusGain: number;
  opponentFrontLevel3Gain: number;
  decisions: string[];
  handoffState: string;
  nextOwnState: string;
  handoffBoard: string;
  nextOwnBoard: string;
}

interface TraceRiskSummary {
  trace: string;
  seed?: number;
  direction?: string;
  plannerSide: PlayerId;
  winner?: PlayerId;
  winnerProfile?: string;
  turns: number;
  riskyTurns: number;
  opponentLevel2PlusGainTurns: number;
  opponentLevel3GainTurns: number;
  opponentFrontLevel2PlusGainTurns: number;
  ownLostTurns: number;
  ownHpLossTurns: number;
  lowStoneRiskTurns: number;
  samples: TurnRiskSample[];
}

interface TraceRiskReport {
  generatedAt: string;
  options: CliOptions;
  summaries: TraceRiskSummary[];
  samples: TurnRiskSample[];
  conclusion: string[];
}

const options = parseArgs(process.argv.slice(2));
const report = await runReport(options);

if (options.markdownPath) {
  await writeReport(options.markdownPath, formatMarkdown(report));
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
}

console.log(`White planner trace risk audit: ${report.summaries.length} traces, ${report.samples.length} samples`);
for (const line of report.conclusion) {
  console.log(`- ${line}`);
}
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

async function runReport(options: CliOptions): Promise<TraceRiskReport> {
  const summaries: TraceRiskSummary[] = [];
  for (const path of options.tracePaths) {
    const trace = JSON.parse(await readFile(path, "utf8")) as DecisionTraceReport;
    summaries.push(analyzeTrace(path, trace, options.maxSamples));
  }
  const samples = summaries
    .flatMap((summary) => summary.samples)
    .sort((a, b) => b.score - a.score || a.trace.localeCompare(b.trace) || a.handoffStep - b.handoffStep)
    .slice(0, options.maxSamples);

  return {
    generatedAt: new Date().toISOString(),
    options,
    summaries,
    samples,
    conclusion: buildConclusion(summaries, samples),
  };
}

function analyzeTrace(path: string, trace: DecisionTraceReport, maxSamples: number): TraceRiskSummary {
  const samples: TurnRiskSample[] = [];
  const decisions = trace.decisions ?? [];
  const plannerSide = trace.plannerSide;

  for (let index = 0; index < decisions.length; index += 1) {
    const handoff = decisions[index];
    if (handoff.decision !== "end_turn") {
      continue;
    }

    const nextOwnDecision = decisions.slice(index + 1).find((decision) => decision.side === plannerSide);
    if (!nextOwnDecision) {
      continue;
    }

    const turnStartIndex = findTurnStartIndex(decisions, index, handoff.turnNumber, plannerSide);
    const turnDecisions = decisions.slice(turnStartIndex, index + 1);
    const sample = buildTurnRiskSample(path, trace, handoff, nextOwnDecision, turnDecisions);
    if (sample.score > 0) {
      samples.push(sample);
    }
  }

  const sortedSamples = samples
    .sort((a, b) => b.score - a.score || a.handoffStep - b.handoffStep)
    .slice(0, maxSamples);

  return {
    trace: path,
    seed: trace.options?.seed,
    direction: trace.options?.direction,
    plannerSide,
    winner: trace.winner,
    winnerProfile: trace.winnerProfile,
    turns: decisions.filter((decision) => decision.decision === "end_turn").length,
    riskyTurns: samples.length,
    opponentLevel2PlusGainTurns: samples.filter((sample) => sample.opponentLevel2PlusGain > 0).length,
    opponentLevel3GainTurns: samples.filter((sample) => sample.opponentLevel3Gain > 0).length,
    opponentFrontLevel2PlusGainTurns: samples.filter((sample) => sample.opponentFrontLevel2PlusGain > 0).length,
    ownLostTurns: samples.filter((sample) => sample.ownLost > 0).length,
    ownHpLossTurns: samples.filter((sample) => sample.ownHpLoss > 0).length,
    lowStoneRiskTurns: samples.filter((sample) => sample.finalStones <= 1).length,
    samples: sortedSamples,
  };
}

function findTurnStartIndex(
  decisions: readonly DecisionTraceEntry[],
  handoffIndex: number,
  turnNumber: number,
  plannerSide: PlayerId,
): number {
  for (let index = handoffIndex; index >= 0; index -= 1) {
    const decision = decisions[index];
    if (decision.turnNumber !== turnNumber || decision.side !== plannerSide) {
      return index + 1;
    }
  }
  return 0;
}

function buildTurnRiskSample(
  path: string,
  trace: DecisionTraceReport,
  handoff: DecisionTraceEntry,
  nextOwnDecision: DecisionTraceEntry,
  turnDecisions: readonly DecisionTraceEntry[],
): TurnRiskSample {
  const plannerSide = trace.plannerSide;
  const opponent = opponentOf(plannerSide);
  const handoffState = parseStateLine(handoff.afterState);
  const nextOwnState = parseStateLine(nextOwnDecision.state);
  const handoffBoard = parseBoard(handoff.afterBoard);
  const nextOwnBoard = parseBoard(nextOwnDecision.board);
  const handoffOwn = boardStats(handoffBoard, plannerSide);
  const nextOwnOwn = boardStats(nextOwnBoard, plannerSide);
  const handoffOpponent = boardStats(handoffBoard, opponent);
  const nextOwnOpponent = boardStats(nextOwnBoard, opponent);

  const ownHpLoss = Math.max(0, (handoffState.hp[plannerSide] ?? 0) - (nextOwnState.hp[plannerSide] ?? 0));
  const ownLost = Math.max(0, handoffOwn.count - nextOwnOwn.count);
  const opponentLevel2PlusGain = Math.max(0, nextOwnOpponent.level2Plus - handoffOpponent.level2Plus);
  const opponentLevel3Gain = Math.max(0, nextOwnOpponent.level3Plus - handoffOpponent.level3Plus);
  const opponentFrontLevel2PlusGain = Math.max(0, nextOwnOpponent.frontLevel2Plus - handoffOpponent.frontLevel2Plus);
  const opponentFrontLevel3Gain = Math.max(0, nextOwnOpponent.frontLevel3Plus - handoffOpponent.frontLevel3Plus);
  const finalStones = handoffState.stones[plannerSide] ?? 0;
  const kinds = sampleKinds({
    finalStones,
    ownHpLoss,
    ownLost,
    opponentLevel2PlusGain,
    opponentLevel3Gain,
    opponentFrontLevel2PlusGain,
    opponentFrontLevel3Gain,
  });
  const score =
    opponentLevel3Gain * 500 +
    opponentFrontLevel3Gain * 360 +
    opponentFrontLevel2PlusGain * 240 +
    opponentLevel2PlusGain * 180 +
    ownLost * 100 +
    ownHpLoss * 80 +
    (finalStones <= 1 && (ownLost > 0 || ownHpLoss > 0 || opponentLevel2PlusGain > 0) ? 80 : 0);

  return {
    trace: path,
    seed: trace.options?.seed,
    direction: trace.options?.direction,
    plannerSide,
    turnNumber: handoff.turnNumber,
    handoffStep: handoff.step,
    score,
    kinds,
    finalStones,
    ownHpLoss,
    ownLost,
    opponentLevel2PlusGain,
    opponentLevel3Gain,
    opponentFrontLevel2PlusGain,
    opponentFrontLevel3Gain,
    decisions: turnDecisions.map((decision) => `${decision.step}:${decision.decision}`),
    handoffState: handoff.afterState,
    nextOwnState: nextOwnDecision.state,
    handoffBoard: handoff.afterBoard,
    nextOwnBoard: nextOwnDecision.board,
  };
}

function sampleKinds(metrics: {
  finalStones: number;
  ownHpLoss: number;
  ownLost: number;
  opponentLevel2PlusGain: number;
  opponentLevel3Gain: number;
  opponentFrontLevel2PlusGain: number;
  opponentFrontLevel3Gain: number;
}): string[] {
  const kinds: string[] = [];
  if (metrics.opponentLevel3Gain > 0) {
    kinds.push("opponent_level3_gain");
  }
  if (metrics.opponentFrontLevel3Gain > 0) {
    kinds.push("opponent_front_level3_gain");
  }
  if (metrics.opponentLevel2PlusGain > 0) {
    kinds.push("opponent_level2plus_gain");
  }
  if (metrics.opponentFrontLevel2PlusGain > 0) {
    kinds.push("opponent_front_level2plus_gain");
  }
  if (metrics.ownLost > 0) {
    kinds.push("own_lost");
  }
  if (metrics.ownHpLoss > 0) {
    kinds.push("own_hp_loss");
  }
  if (metrics.finalStones <= 1 && kinds.length > 0) {
    kinds.push("low_stone_handoff");
  }
  return kinds;
}

function parseStateLine(line: string): ParsedStateLine {
  const parsed: ParsedStateLine = {
    hp: { player: 0, cpu: 0 },
    stones: { player: 0, cpu: 0 },
  };
  const turn = /turn (\d+)/.exec(line);
  if (turn) {
    parsed.turnNumber = Number(turn[1]);
  }
  const current = /current (player|cpu)/.exec(line);
  if (current) {
    parsed.currentPlayer = current[1] as PlayerId;
  }
  parsePlayerPair(line, "HP", parsed.hp);
  parsePlayerPair(line, "stones", parsed.stones);
  return parsed;
}

function parsePlayerPair(line: string, label: "HP" | "stones", target: Record<PlayerId, number>): void {
  const match = new RegExp(`${label} (player|cpu)/(player|cpu) (\\d+)/(\\d+)`).exec(line);
  if (!match) {
    return;
  }
  target[match[1] as PlayerId] = Number(match[3]);
  target[match[2] as PlayerId] = Number(match[4]);
}

function parseBoard(line: string): ParsedMonster[] {
  if (!line || line === "empty") {
    return [];
  }
  return line.split(" | ").flatMap((part) => {
    const match = /^([^:]+):[PC]([FB]):(.+) Lv(\d+) HP(\d+) (prep|act(\d+)\/(\d+))(?: (.*))?$/.exec(part);
    if (!match) {
      return [];
    }
    const slotKey = match[1];
    const owner = slotKey.startsWith("player_") ? "player" : "cpu";
    const flags = match[9] ?? "";
    return [{
      slotKey,
      owner,
      row: match[2] === "F" ? "front" : "back",
      name: match[3],
      level: Number(match[4]),
      hp: Number(match[5]),
      status: match[6] === "prep" ? "prep" : "active",
      actionCount: match[7] ? Number(match[7]) : 0,
      actionLimit: match[8] ? Number(match[8]) : 0,
      focused: flags.includes("focus"),
      shielded: flags.includes("shield"),
    } satisfies ParsedMonster];
  });
}

function boardStats(monsters: readonly ParsedMonster[], playerId: PlayerId): BoardStats {
  const own = monsters.filter((monster) => monster.owner === playerId);
  const front = own.filter((monster) => monster.row === "front");
  return {
    count: own.length,
    frontCount: front.length,
    level2Plus: own.filter((monster) => monster.level >= 2).length,
    level3Plus: own.filter((monster) => monster.level >= 3).length,
    totalLevel: own.reduce((sum, monster) => sum + monster.level, 0),
    totalHp: own.reduce((sum, monster) => sum + monster.hp, 0),
    frontLevel2Plus: front.filter((monster) => monster.level >= 2).length,
    frontLevel3Plus: front.filter((monster) => monster.level >= 3).length,
  };
}

function buildConclusion(summaries: readonly TraceRiskSummary[], samples: readonly TurnRiskSample[]): string[] {
  const totalRisky = summaries.reduce((sum, summary) => sum + summary.riskyTurns, 0);
  const opponentLv3 = summaries.reduce((sum, summary) => sum + summary.opponentLevel3GainTurns, 0);
  const opponentFrontLv2 = summaries.reduce((sum, summary) => sum + summary.opponentFrontLevel2PlusGainTurns, 0);
  const ownLost = summaries.reduce((sum, summary) => sum + summary.ownLostTurns, 0);
  const lowStone = summaries.reduce((sum, summary) => sum + summary.lowStoneRiskTurns, 0);
  const topKinds = countKinds(samples);
  return [
    `${summaries.length} traces, risky handoffs ${totalRisky}. opponent Lv3 gains ${opponentLv3}, opponent front Lv2+ gains ${opponentFrontLv2}.`,
    `own lost turns ${ownLost}, low-stone risky handoffs ${lowStone}.`,
    `top sample kinds: ${Object.entries(topKinds).map(([kind, count]) => `${kind}:${count}`).join(", ") || "-"}.`,
  ];
}

function countKinds(samples: readonly TurnRiskSample[]): Record<string, number> {
  return samples.reduce<Record<string, number>>((counts, sample) => {
    sample.kinds.forEach((kind) => {
      counts[kind] = (counts[kind] ?? 0) + 1;
    });
    return counts;
  }, {});
}

function formatMarkdown(report: TraceRiskReport): string {
  const lines = [
    "# White Planner Trace Risk Audit",
    "",
    `生成: ${report.generatedAt}`,
    `traces: ${report.options.tracePaths.length}`,
    "",
    "## Conclusion",
    "",
  ];
  report.conclusion.forEach((line) => lines.push(`- ${line}`));

  lines.push("", "## Traces", "");
  lines.push("| trace | seed | direction | winner | turns | risky | oppLv2+ | oppLv3 | oppFrontLv2+ | ownLost | ownHp | lowStone |");
  lines.push("| --- | ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const summary of report.summaries) {
    lines.push(
      `| ${escapeMarkdownTableCell(basename(summary.trace))} | ${summary.seed ?? "-"} | ${summary.direction ?? "-"} | ` +
        `${summary.winnerProfile ?? summary.winner ?? "-"} | ${summary.turns} | ${summary.riskyTurns} | ` +
        `${summary.opponentLevel2PlusGainTurns} | ${summary.opponentLevel3GainTurns} | ` +
        `${summary.opponentFrontLevel2PlusGainTurns} | ${summary.ownLostTurns} | ${summary.ownHpLossTurns} | ` +
        `${summary.lowStoneRiskTurns} |`,
    );
  }

  lines.push("", "## Top Samples", "");
  if (report.samples.length === 0) {
    lines.push("No risky handoff samples.");
    return `${lines.join("\n")}\n`;
  }
  lines.push("| score | trace | seed | dir | turn | step | kind | stones | hpLoss | ownLost | oppLv2+ | oppLv3 | oppFrontLv2+ | decisions | handoff | next own |");
  lines.push("| ---: | --- | ---: | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |");
  for (const sample of report.samples) {
    lines.push(
      `| ${round(sample.score, 1)} | ${escapeMarkdownTableCell(basename(sample.trace))} | ${sample.seed ?? "-"} | ` +
        `${sample.direction ?? "-"} | ${sample.turnNumber} | ${sample.handoffStep} | ${sample.kinds.join(",")} | ` +
        `${sample.finalStones} | ${sample.ownHpLoss} | ${sample.ownLost} | ${sample.opponentLevel2PlusGain} | ` +
        `${sample.opponentLevel3Gain} | ${sample.opponentFrontLevel2PlusGain} | ` +
        `${escapeMarkdownTableCell(sample.decisions.join(" -> "))} | ` +
        `${escapeMarkdownTableCell(sample.handoffState)}<br>${escapeMarkdownTableCell(sample.handoffBoard)} | ` +
        `${escapeMarkdownTableCell(sample.nextOwnState)}<br>${escapeMarkdownTableCell(sample.nextOwnBoard)} |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

function opponentOf(playerId: PlayerId): PlayerId {
  return playerId === "player" ? "cpu" : "player";
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    tracePaths: [],
    maxSamples: 24,
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--trace") {
      parsed.tracePaths.push(readString(arg, next));
      index += 1;
    } else if (arg === "--max-samples") {
      parsed.maxSamples = readInteger(arg, next);
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
  if (parsed.tracePaths.length === 0) {
    throw new Error("at least one --trace is required");
  }
  return parsed;
}

function printHelpAndExit(): never {
  console.log(`Usage:
  npm run audit:white-planner-trace-risk -- [options]

Options:
  --trace <path>       Decision trace JSON path. Repeatable.
  --max-samples <n>   Max global/sample rows. Default: 24
  --markdown <path>   Write Markdown report.
  --json <path>       Write JSON report.
`);
  process.exit(0);
}
