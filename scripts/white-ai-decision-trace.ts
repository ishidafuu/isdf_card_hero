import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { getCardName } from "../src/game/cards";
import {
  DEFAULT_WHITE_AI_TUNING_OPPONENTS,
  DEFAULT_WHITE_AI_TUNING_VARIANTS,
  runWhiteAiTuningLoop,
  type WhiteAiTuningLoopOptions,
} from "../src/game/whiteAiTuningLoop";
import type { MasterLabDecisionEvent, MasterLabGameStateSummary } from "../src/game/masterLabAutoPlay";
import type { PlayerId } from "../src/game/types";

interface CliOptions extends WhiteAiTuningLoopOptions {
  opponentIds?: string[];
  maxLosses: number;
  maxActionsPerGame: number;
  markdownPath?: string;
  jsonPath?: string;
}

interface TraceReport {
  generatedAt: string;
  gamesPerMatchup: number;
  seedStart: number;
  variants: string[];
  opponents: string[];
  summary: TraceSummary;
  traces: GameTrace[];
}

interface TraceSummary {
  tracedLosses: number;
  actionCount: number;
  lowStoneByDecision: Record<string, number>;
  shieldUses: number;
  shieldNextWork: number;
  shieldNoNextWork: number;
  shieldRemovedBeforeNextTurn: number;
  shieldMovedSameTurn: number;
  shieldHitBeforeNextTurn: number;
  wakeUses: number;
  wakeSameTurnWork: number;
  focusUses: number;
  focusNextWork: number;
  directMasterHits: number;
}

interface GameTrace {
  variantId: string;
  opponentId: string;
  candidateSeat: PlayerId;
  seed: number;
  turns: number;
  steps: number;
  winner?: PlayerId;
  finalState: string;
  finalBoard: string;
  actions: ActionTrace[];
}

interface ActionTrace {
  turnNumber: number;
  step: number;
  decision: string;
  reason: string;
  score: number;
  stones: string;
  hp: string;
  lowStoneAfter: boolean;
  target?: string;
  followUp?: string;
  opponentResponse: string[];
  log: string[];
}

const options = parseArgs(process.argv.slice(2));
const loopReport = runWhiteAiTuningLoop({ ...options, includeGameHistory: true });
const report = buildTraceReport(options, loopReport);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
}

console.log(`White AI decision trace: ${report.traces.length} losses`);
for (const trace of report.traces.slice(0, 8)) {
  console.log(
    `${trace.variantId} ${trace.opponentId} ${trace.candidateSeat} seed ${trace.seed}: ` +
      `${trace.finalState} actions ${trace.actions.length}`,
  );
}
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${content}\n`);
}

function buildTraceReport(options: CliOptions, loopReport: ReturnType<typeof runWhiteAiTuningLoop>): TraceReport {
  const traces: GameTrace[] = [];
  for (const run of loopReport.runs) {
    const opponentSeat = run.candidateSeat === "player" ? "cpu" : "player";
    for (const game of run.result.games) {
      if (game.winner === run.candidateSeat || traces.length >= options.maxLosses) {
        continue;
      }
      traces.push({
        variantId: run.variantId,
        opponentId: run.opponentId,
        candidateSeat: run.candidateSeat,
        seed: game.seed,
        turns: game.turns,
        steps: game.steps,
        winner: game.winner,
        finalState: formatState(game.stateSummary, run.candidateSeat, opponentSeat),
        finalBoard: formatBoard(game.stateSummary),
        actions: traceActions(game.history ?? [], run.candidateSeat, options.maxActionsPerGame),
      });
    }
  }

  return {
    generatedAt: loopReport.generatedAt,
    gamesPerMatchup: loopReport.gamesPerMatchup,
    seedStart: options.seedStart ?? 0,
    variants: loopReport.variants.map((variant) => variant.id),
    opponents: loopReport.opponents.map((opponent) => opponent.id),
    summary: summarizeTraces(traces),
    traces,
  };
}

function summarizeTraces(traces: readonly GameTrace[]): TraceSummary {
  const lowStoneByDecision: Record<string, number> = {};
  const summary: TraceSummary = {
    tracedLosses: traces.length,
    actionCount: 0,
    lowStoneByDecision,
    shieldUses: 0,
    shieldNextWork: 0,
    shieldNoNextWork: 0,
    shieldRemovedBeforeNextTurn: 0,
    shieldMovedSameTurn: 0,
    shieldHitBeforeNextTurn: 0,
    wakeUses: 0,
    wakeSameTurnWork: 0,
    focusUses: 0,
    focusNextWork: 0,
    directMasterHits: 0,
  };

  for (const trace of traces) {
    for (const action of trace.actions) {
      summary.actionCount += 1;
      if (action.lowStoneAfter) {
        const kind = decisionKind(action.decision);
        lowStoneByDecision[kind] = (lowStoneByDecision[kind] ?? 0) + 1;
      }
      if (action.decision.startsWith("master:shield->")) {
        summary.shieldUses += 1;
        if (action.followUp?.includes("next-turn work:")) {
          summary.shieldNextWork += 1;
        }
        if (action.followUp?.includes("next-turn workなし")) {
          summary.shieldNoNextWork += 1;
        }
        if (action.followUp?.includes("removed=yes")) {
          summary.shieldRemovedBeforeNextTurn += 1;
        }
        if (action.followUp?.includes("same-turn move:")) {
          summary.shieldMovedSameTurn += 1;
        }
        if (action.followUp?.match(/hitBeforeNext=[1-9]/)) {
          summary.shieldHitBeforeNextTurn += 1;
        }
      }
      if (action.decision.startsWith("master:wake_up->")) {
        summary.wakeUses += 1;
        if (action.followUp?.includes("same-turn work:")) {
          summary.wakeSameTurnWork += 1;
        }
      }
      if (action.decision.startsWith("focus:")) {
        summary.focusUses += 1;
        if (action.followUp?.includes("focus next-turn work:")) {
          summary.focusNextWork += 1;
        }
      }
      if (action.decision.includes("->master:")) {
        summary.directMasterHits += 1;
      }
    }
  }
  return summary;
}

function decisionKind(decision: string): string {
  return decision.split(":")[0] || decision;
}

function traceActions(
  history: readonly MasterLabDecisionEvent[],
  candidateSeat: PlayerId,
  maxActions: number,
): ActionTrace[] {
  const actions: ActionTrace[] = [];
  for (let index = 0; index < history.length && actions.length < maxActions; index += 1) {
    const event = history[index];
    if (!event || event.player !== candidateSeat || event.source !== "cpu" || !isTraceDecision(event)) {
      continue;
    }
    const opponent = candidateSeat === "player" ? "cpu" : "player";
    actions.push({
      turnNumber: event.turnNumber,
      step: event.step,
      decision: event.decision,
      reason: event.reason,
      score: Math.round(event.score * 10) / 10,
      stones: `${event.before.players[candidateSeat].stones}->${event.after.players[candidateSeat].stones}`,
      hp: `${event.before.players[candidateSeat].hp}/${event.before.players[opponent].hp}->` +
        `${event.after.players[candidateSeat].hp}/${event.after.players[opponent].hp}`,
      lowStoneAfter: event.after.players[candidateSeat].stones <= 1,
      target: formatDecisionTarget(event),
      followUp: formatFollowUp(history, index, candidateSeat),
      opponentResponse: nextOpponentResponse(history, index, candidateSeat),
      log: event.newLog,
    });
  }
  return actions;
}

function isTraceDecision(event: MasterLabDecisionEvent): boolean {
  if (
    event.decision.startsWith("master:wake_up->") ||
    event.decision.startsWith("master:shield->") ||
    event.decision.startsWith("focus:") ||
    event.decision.startsWith("move:") ||
    event.decision.includes("->master:") ||
    event.after.players[event.player].stones <= 1
  ) {
    return true;
  }
  return event.decision.startsWith("summon:") && event.after.players[event.player].stones <= 2;
}

function formatDecisionTarget(event: MasterLabDecisionEvent): string | undefined {
  const slotKey = targetSlotKeyForDecision(event.decision) ?? actorSlotKeyForDecision(event.decision);
  if (!slotKey) {
    return undefined;
  }
  const before = slotByKey(event.before, slotKey);
  const after = slotByKey(event.after, slotKey);
  return `${slotKey}: ${formatSlot(before)} -> ${formatSlot(after)}`;
}

function formatFollowUp(
  history: readonly MasterLabDecisionEvent[],
  index: number,
  candidateSeat: PlayerId,
): string | undefined {
  const event = history[index];
  const wakeTarget = wakeTargetSlotKeyForDecision(event.decision);
  const shieldTarget = shieldTargetSlotKeyForDecision(event.decision);
  const focusTarget = focusSlotKeyForDecision(event.decision);
  const tracked = wakeTarget ?? shieldTarget ?? focusTarget;
  if (!tracked) {
    return undefined;
  }

  const sameTurn = history.slice(index + 1).filter(
    (candidate) => candidate.player === candidateSeat && candidate.turnNumber === event.turnNumber,
  );
  const sameTurnAttack = sameTurn.find((candidate) => actorSlotKeyForDecision(candidate.decision) === tracked && candidate.decision.startsWith("attack:"));
  if (wakeTarget) {
    return sameTurnAttack
      ? `same-turn work: ${sameTurnAttack.decision}`
      : `same-turn workなし / later: ${sameTurn.slice(0, 3).map((candidate) => candidate.decision).join(", ") || "-"}`;
  }

  const nextOwnTurn = nextOwnTurnEvents(history, index, candidateSeat);
  const nextWork = nextOwnTurn.find(
    (candidate) => actorSlotKeyForDecision(candidate.decision) === tracked && candidate.decision.startsWith("attack:"),
  );
  const removed = monsterRemovedBeforeNextOwnTurn(history, index, candidateSeat, tracked);
  if (shieldTarget) {
    const sameTurnMove = sameTurn.find((candidate) => candidate.decision.startsWith(`move:${tracked}->`));
    const hitBeforeNext = opponentHitsBeforeNextOwnTurn(history, index, candidateSeat, tracked);
    const hitText = `hitBeforeNext=${hitBeforeNext}`;
    return nextWork
      ? `${sameTurnMove ? `same-turn move: ${sameTurnMove.decision} / ` : ""}next-turn work: ${nextWork.decision} / ${hitText}`
      : `${sameTurnMove ? `same-turn move: ${sameTurnMove.decision} / ` : ""}next-turn workなし / removed=${removed ? "yes" : "no"} / ${hitText}`;
  }
  return nextWork
    ? `focus next-turn work: ${nextWork.decision}`
    : `focus next-turn workなし / removed=${removed ? "yes" : "no"}`;
}

function opponentHitsBeforeNextOwnTurn(
  history: readonly MasterLabDecisionEvent[],
  index: number,
  candidateSeat: PlayerId,
  slotKey: string,
): number {
  let hits = 0;
  const opponent = candidateSeat === "player" ? "cpu" : "player";
  const currentTurn = history[index].turnNumber;
  for (const event of history.slice(index + 1)) {
    if (event.player === candidateSeat && event.turnNumber > currentTurn) {
      break;
    }
    if (
      event.player === opponent &&
      event.decision.startsWith("attack:") &&
      targetSlotKeyForDecision(event.decision) === slotKey
    ) {
      hits += 1;
    }
  }
  return hits;
}

function nextOpponentResponse(
  history: readonly MasterLabDecisionEvent[],
  index: number,
  candidateSeat: PlayerId,
): string[] {
  const opponent = candidateSeat === "player" ? "cpu" : "player";
  const response: string[] = [];
  for (const event of history.slice(index + 1)) {
    if (event.player === candidateSeat) {
      if (response.length > 0) {
        break;
      }
      continue;
    }
    if (event.player === opponent) {
      response.push(`${event.decision} (${event.before.players[opponent].stones}->${event.after.players[opponent].stones})`);
      if (response.length >= 3) {
        break;
      }
    }
  }
  return response;
}

function nextOwnTurnEvents(
  history: readonly MasterLabDecisionEvent[],
  index: number,
  candidateSeat: PlayerId,
): MasterLabDecisionEvent[] {
  const currentTurn = history[index].turnNumber;
  const nextTurn = history.find(
    (event, candidateIndex) => candidateIndex > index && event.player === candidateSeat && event.turnNumber > currentTurn,
  )?.turnNumber;
  if (nextTurn === undefined) {
    return [];
  }
  return history.filter((event) => event.player === candidateSeat && event.turnNumber === nextTurn);
}

function monsterRemovedBeforeNextOwnTurn(
  history: readonly MasterLabDecisionEvent[],
  index: number,
  candidateSeat: PlayerId,
  slotKey: string,
): boolean {
  const event = history[index];
  const tracked = slotByKey(event.after, slotKey);
  if (!tracked?.card || !tracked.owner) {
    return true;
  }
  for (const candidate of history.slice(index + 1)) {
    if (candidate.player === candidateSeat && candidate.turnNumber > event.turnNumber) {
      return false;
    }
    const slot = slotByKey(candidate.after, slotKey);
    if (!slot?.card || slot.card !== tracked.card || slot.owner !== tracked.owner) {
      return true;
    }
  }
  return false;
}

function formatState(
  summary: MasterLabGameStateSummary | undefined,
  candidateSeat: PlayerId,
  opponentSeat: PlayerId,
): string {
  if (!summary) {
    return "-";
  }
  const candidate = summary.players[candidateSeat];
  const opponent = summary.players[opponentSeat];
  return `${candidateSeat} HP${candidate.hp} S${candidate.stones} H${candidate.hand} D${candidate.deck} / ` +
    `${opponentSeat} HP${opponent.hp} S${opponent.stones} H${opponent.hand} D${opponent.deck}`;
}

function formatBoard(summary: MasterLabGameStateSummary | undefined): string {
  if (!summary) {
    return "-";
  }
  return summary.slots
    .filter((slot) => slot.card)
    .map((slot) => `${slot.slotKey}:${formatSlot(slot)}`)
    .join(" | ") || "-";
}

function formatSlot(slot: MasterLabGameStateSummary["slots"][number] | undefined): string {
  if (!slot?.card) {
    return "-";
  }
  const status = slot.status ? ` ${slot.status}` : "";
  const shield = slot.shielded ? " shield" : "";
  return `${slot.owner}:${getCardName(slot.card)} L${slot.level} HP${slot.hp}${status}${shield}`;
}

function slotByKey(summary: MasterLabGameStateSummary, slotKey: string): MasterLabGameStateSummary["slots"][number] | undefined {
  return summary.slots.find((slot) => slot.slotKey === slotKey);
}

function actorSlotKeyForDecision(decision: string): string | undefined {
  if (decision.startsWith("attack:")) {
    return decision.split(":")[1];
  }
  if (decision.startsWith("move:")) {
    return decision.slice("move:".length).split("->")[0];
  }
  if (decision.startsWith("focus:")) {
    return focusSlotKeyForDecision(decision);
  }
  return undefined;
}

function targetSlotKeyForDecision(decision: string): string | undefined {
  const target = decision.split("->")[1];
  return target?.startsWith("monster:") ? target.slice("monster:".length) : undefined;
}

function wakeTargetSlotKeyForDecision(decision: string): string | undefined {
  return decision.startsWith("master:wake_up->monster:")
    ? decision.slice("master:wake_up->monster:".length)
    : undefined;
}

function shieldTargetSlotKeyForDecision(decision: string): string | undefined {
  return decision.startsWith("master:shield->monster:")
    ? decision.slice("master:shield->monster:".length)
    : undefined;
}

function focusSlotKeyForDecision(decision: string): string | undefined {
  return decision.startsWith("focus:") ? decision.slice("focus:".length) : undefined;
}

function formatMarkdown(report: TraceReport): string {
  const lines: string[] = [];
  lines.push("# White AI Decision Trace");
  lines.push("");
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push(`- Games per matchup: ${report.gamesPerMatchup}`);
  lines.push(`- Variants: ${report.variants.join(", ")}`);
  lines.push(`- Opponents: ${report.opponents.join(", ")}`);
  lines.push(`- Loss traces: ${report.traces.length}`);
  lines.push("");
  lines.push("## Aggregate");
  lines.push("");
  lines.push(`- Actions: ${report.summary.actionCount}`);
  lines.push(`- Low-stone decisions: ${formatRecord(report.summary.lowStoneByDecision)}`);
  lines.push(
    `- Shield: uses ${report.summary.shieldUses}, next-work ${report.summary.shieldNextWork}, ` +
      `no-next-work ${report.summary.shieldNoNextWork}, removed ${report.summary.shieldRemovedBeforeNextTurn}, ` +
      `same-turn-move ${report.summary.shieldMovedSameTurn}, hit-before-next ${report.summary.shieldHitBeforeNextTurn}`,
  );
  lines.push(`- Wake: uses ${report.summary.wakeUses}, same-turn-work ${report.summary.wakeSameTurnWork}`);
  lines.push(`- Focus: uses ${report.summary.focusUses}, next-work ${report.summary.focusNextWork}`);
  lines.push(`- Direct master hits: ${report.summary.directMasterHits}`);
  lines.push("");

  for (const trace of report.traces) {
    lines.push(`## ${trace.variantId} vs ${trace.opponentId} / ${trace.candidateSeat} / seed ${trace.seed}`);
    lines.push("");
    lines.push(`- Result: winner=${trace.winner ?? "draw"} / turns=${trace.turns} / steps=${trace.steps}`);
    lines.push(`- Final: ${trace.finalState}`);
    lines.push(`- Board: ${trace.finalBoard}`);
    lines.push("");
    lines.push("| Turn | Step | Decision | S | HP | Target | Follow-up | Opponent response | Reason |");
    lines.push("|---:|---:|---|---|---|---|---|---|---|");
    for (const action of trace.actions) {
      lines.push(
        `| ${action.turnNumber} | ${action.step} | ${escapeTable(action.decision)} | ${action.stones}${action.lowStoneAfter ? " low" : ""} | ` +
          `${action.hp} | ${escapeTable(action.target ?? "-")} | ${escapeTable(action.followUp ?? "-")} | ` +
          `${escapeTable(action.opponentResponse.join(" / ") || "-")} | ${escapeTable(action.reason)} |`,
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

function formatRecord(record: Record<string, number>): string {
  const entries = Object.entries(record).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return entries.length ? entries.map(([key, value]) => `${key}:${value}`).join(", ") : "-";
}

function escapeTable(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    gamesPerMatchup: 2,
    seedStart: 9000,
    maxSteps: 700,
    maxTurns: 160,
    variantIds: [],
    maxLosses: 8,
    maxActionsPerGame: 18,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--games-per-matchup") {
      parsed.gamesPerMatchup = readNumber(arg, next);
      i += 1;
    } else if (arg === "--seed-start") {
      parsed.seedStart = readNumber(arg, next);
      i += 1;
    } else if (arg === "--variant") {
      parsed.variantIds = [...(parsed.variantIds ?? []), readString(arg, next)];
      i += 1;
    } else if (arg === "--opponent") {
      parsed.opponentIds = [...(parsed.opponentIds ?? []), readString(arg, next)];
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-losses") {
      parsed.maxLosses = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-actions-per-game") {
      parsed.maxActionsPerGame = readNumber(arg, next);
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

  if (parsed.variantIds?.length === 0) {
    delete parsed.variantIds;
  } else {
    const knownVariants = new Set(DEFAULT_WHITE_AI_TUNING_VARIANTS.map((variant) => variant.id));
    for (const id of parsed.variantIds ?? []) {
      if (!knownVariants.has(id)) {
        throw new Error(`Unknown variant: ${id}`);
      }
    }
  }
  if (parsed.opponentIds?.length) {
    parsed.opponents = parsed.opponentIds.map((id) => {
      const opponent = DEFAULT_WHITE_AI_TUNING_OPPONENTS.find((candidate) => candidate.id === id);
      if (!opponent) {
        throw new Error(`Unknown opponent: ${id}`);
      }
      return opponent;
    });
  }
  return parsed;
}

function readNumber(name: string, value: string | undefined): number {
  const number = Number(readString(name, value));
  if (!Number.isInteger(number)) {
    throw new Error(`${name} must be an integer`);
  }
  return number;
}

function readString(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function printHelp(): void {
  console.log(`
Usage:
  npm run lab:masters:white-ai-decision-trace -- [options]

Options:
  --variant <id>                Variant id. Repeatable.
  --opponent <id>               Opponent id. Repeatable.
  --games-per-matchup <n>       Games per matchup/direction. Default: 2
  --seed-start <n>              First seed. Default: 9000
  --max-losses <n>              Maximum loss traces to include. Default: 8
  --max-actions-per-game <n>    Maximum traced actions per loss. Default: 18
  --max-steps <n>               Step cap. Default: 700
  --max-turns <n>               Turn cap. Default: 160
  --markdown <path>             Write markdown report.
  --json <path>                 Write JSON report.
`);
}
