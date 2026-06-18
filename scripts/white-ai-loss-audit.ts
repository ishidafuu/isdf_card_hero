import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { getMonsterDef } from "../src/game/cards";
import {
  DEFAULT_WHITE_AI_TUNING_OPPONENTS,
  DEFAULT_WHITE_AI_TUNING_VARIANTS,
  runWhiteAiTuningLoop,
  type WhiteAiTuningLoopOptions,
  type WhiteAiTuningOpponent,
  type WhiteAiTurnIntentMetrics,
} from "../src/game/whiteAiTuningLoop";
import type { MasterLabDecisionEvent, MasterLabGameStateSummary } from "../src/game/masterLabAutoPlay";
import type { PlayerId } from "../src/game/types";

type Outcome = "win" | "loss" | "draw";

interface CliOptions extends WhiteAiTuningLoopOptions {
  markdownPath?: string;
  jsonPath?: string;
  opponentIds?: string[];
}

interface OutcomeAudit {
  games: number;
  totalTurns: number;
  opponentHpOnLossTotal: number;
  opponentHpOnLossSamples: number;
  seeds: number[];
  intent: WhiteAiTurnIntentMetrics;
  lowStoneByDecision: Record<string, number>;
}

interface VariantAudit {
  variantId: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  averageTurns: number;
  averageOpponentHpOnLoss?: number;
  outcomes: Record<Outcome, OutcomeAudit>;
  notes: string[];
}

interface WhiteAiLossAuditReport {
  generatedAt: string;
  gamesPerMatchup: number;
  variants: string[];
  opponents: string[];
  audits: VariantAudit[];
}

const options = parseArgs(process.argv.slice(2));
const loopReport = runWhiteAiTuningLoop({ ...options, includeGameHistory: true });
const report = buildAuditReport(loopReport);
const markdown = formatAuditMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report));
}

console.log(`White AI loss audit: ${report.variants.length} variants / ${report.audits.reduce((total, audit) => total + audit.games, 0)} games`);
for (const audit of report.audits) {
  console.log(`${audit.variantId}: ${audit.wins}-${audit.losses}-${audit.draws} loss LowS ${formatIntentLowStone(audit.outcomes.loss.intent)}`);
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

function buildAuditReport(loopReport: ReturnType<typeof runWhiteAiTuningLoop>): WhiteAiLossAuditReport {
  const records = new Map(loopReport.variants.map((variant) => [variant.id, createVariantAudit(variant.id)]));

  for (const run of loopReport.runs) {
    const audit = records.get(run.variantId);
    if (!audit) {
      continue;
    }
    const opponentSeat = run.candidateSeat === "player" ? "cpu" : "player";
    for (const game of run.result.games) {
      const outcome = game.winner === undefined
        ? "draw"
        : game.winner === run.candidateSeat
          ? "win"
          : "loss";
      const outcomeAudit = audit.outcomes[outcome];
      const intent = summarizeAuditIntentMetrics(game.history ?? [], run.candidateSeat);
      audit.games += 1;
      audit.totalTurns += game.turns;
      outcomeAudit.games += 1;
      outcomeAudit.totalTurns += game.turns;
      addIntentMetrics(outcomeAudit.intent, intent.metrics);
      addLowStoneByDecision(outcomeAudit.lowStoneByDecision, intent.lowStoneByDecision);
      if (outcome === "win") {
        audit.wins += 1;
      } else if (outcome === "loss") {
        audit.losses += 1;
        outcomeAudit.seeds.push(game.seed);
        const opponentHp = game.stateSummary?.players[opponentSeat].hp;
        if (opponentHp !== undefined) {
          outcomeAudit.opponentHpOnLossTotal += opponentHp;
          outcomeAudit.opponentHpOnLossSamples += 1;
        }
      } else {
        audit.draws += 1;
        outcomeAudit.seeds.push(game.seed);
      }
    }
  }

  return {
    generatedAt: loopReport.generatedAt,
    gamesPerMatchup: loopReport.gamesPerMatchup,
    variants: loopReport.variants.map((variant) => variant.id),
    opponents: loopReport.opponents.map((opponent) => opponent.id),
    audits: [...records.values()].map(finalizeVariantAudit),
  };
}

function createVariantAudit(variantId: string): VariantAudit & { totalTurns: number } {
  return {
    variantId,
    games: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    totalTurns: 0,
    averageTurns: 0,
    outcomes: {
      win: createOutcomeAudit(),
      loss: createOutcomeAudit(),
      draw: createOutcomeAudit(),
    },
    notes: [],
  };
}

function createOutcomeAudit(): OutcomeAudit {
  return {
    games: 0,
    totalTurns: 0,
    opponentHpOnLossTotal: 0,
    opponentHpOnLossSamples: 0,
    seeds: [],
    intent: emptyIntentMetrics(),
    lowStoneByDecision: {},
  };
}

function finalizeVariantAudit(audit: VariantAudit & { totalTurns: number }): VariantAudit {
  const averageOpponentHpOnLoss = audit.outcomes.loss.opponentHpOnLossSamples > 0
    ? round1(audit.outcomes.loss.opponentHpOnLossTotal / audit.outcomes.loss.opponentHpOnLossSamples)
    : undefined;
  const finalized: VariantAudit = {
    variantId: audit.variantId,
    games: audit.games,
    wins: audit.wins,
    losses: audit.losses,
    draws: audit.draws,
    averageTurns: round1(audit.totalTurns / Math.max(1, audit.games)),
    averageOpponentHpOnLoss,
    outcomes: audit.outcomes,
    notes: [],
  };
  finalized.notes = buildNotes(finalized);
  return finalized;
}

function buildNotes(audit: VariantAudit): string[] {
  const notes: string[] = [];
  const lossLowStone = rate(audit.outcomes.loss.intent.lowStoneAfterSetup, audit.outcomes.loss.intent.setupActions);
  const winLowStone = rate(audit.outcomes.win.intent.lowStoneAfterSetup, audit.outcomes.win.intent.setupActions);
  const lossShieldConv = rate(audit.outcomes.loss.intent.shieldConvertedNextTurn, audit.outcomes.loss.intent.shieldUses);
  if (audit.losses > 0 && audit.averageOpponentHpOnLoss !== undefined && audit.averageOpponentHpOnLoss <= 3) {
    notes.push("惜敗多め");
  }
  if (audit.losses > 0 && lossLowStone >= winLowStone + 0.12 && audit.outcomes.loss.intent.setupActions >= 6) {
    notes.push("負け側で低石布石が多い");
  }
  if (audit.outcomes.loss.intent.shieldUses >= 4 && lossShieldConv <= 0.25) {
    notes.push("負け側の盾成果化が低い");
  }
  return notes.length > 0 ? notes : ["-"];
}

function summarizeAuditIntentMetrics(
  history: readonly MasterLabDecisionEvent[],
  candidateSeat: PlayerId,
): { metrics: WhiteAiTurnIntentMetrics; lowStoneByDecision: Record<string, number> } {
  const metrics = emptyIntentMetrics();
  const lowStoneByDecision: Record<string, number> = {};

  for (let index = 0; index < history.length; index += 1) {
    const event = history[index];
    if (!event || event.player !== candidateSeat || event.source !== "cpu") {
      continue;
    }

    const intent = analyzeAuditIntentEvent(event, candidateSeat);
    metrics.totalActions += 1;
    if (intent.execution) {
      metrics.executionActions += 1;
    } else if (intent.setup) {
      metrics.setupActions += 1;
      if (event.after.players[candidateSeat].stones <= 1) {
        metrics.lowStoneAfterSetup += 1;
        const kind = decisionKind(event.decision);
        lowStoneByDecision[kind] = (lowStoneByDecision[kind] ?? 0) + 1;
      }
    }

    const shieldTargetSlotKey = shieldTargetSlotKeyForEvent(event);
    if (shieldTargetSlotKey) {
      metrics.shieldUses += 1;
      if (shieldConvertedOnNextOwnTurn(history, index, candidateSeat, shieldTargetSlotKey)) {
        metrics.shieldConvertedNextTurn += 1;
      } else {
        metrics.shieldNoConversion += 1;
      }
    }

    if (intent.woundedLevelUpHeal) {
      metrics.woundedLevelUpHeal += 1;
    }
    if (intent.attackerCard === "card_051") {
      metrics.pygmyActions += 1;
      if (intent.enemyDamaged && !intent.enemyKilled) {
        metrics.pygmySetupHits += 1;
      }
    }
    if (isPolyspinnerFirstAction(event, intent.actorSlotKey)) {
      metrics.polyspinnerFirstActions += 1;
      if (intent.execution || laterSameTurnPolyspinnerExecution(history, index, candidateSeat)) {
        metrics.polyspinnerPurposefulFirstAction += 1;
      } else {
        metrics.polyspinnerWasteAction += 1;
      }
    }
  }

  return { metrics, lowStoneByDecision };
}

interface AuditIntentEventAnalysis {
  execution: boolean;
  setup: boolean;
  enemyDamaged: boolean;
  enemyKilled: boolean;
  woundedLevelUpHeal: boolean;
  actorSlotKey?: string;
  attackerCard?: string;
}

function analyzeAuditIntentEvent(
  event: MasterLabDecisionEvent,
  candidateSeat: PlayerId,
): AuditIntentEventAnalysis {
  const opponentSeat = opponentSeatOf(candidateSeat);
  const actorSlotKey = actorSlotKeyForEvent(event);
  const actorSlot = actorSlotKey ? slotByKey(event.before, actorSlotKey) : undefined;
  const targetSlotKey = targetSlotKeyForEvent(event);
  const targetBefore = targetSlotKey ? slotByKey(event.before, targetSlotKey) : undefined;
  const targetAfter = targetSlotKey ? slotByKey(event.after, targetSlotKey) : undefined;
  const enemyDamaged = !!(
    targetBefore?.owner === opponentSeat &&
    targetAfter?.owner === opponentSeat &&
    targetBefore.card === targetAfter.card &&
    targetBefore.hp !== undefined &&
    targetAfter.hp !== undefined &&
    targetAfter.hp < targetBefore.hp
  );
  const enemyKilled = !!(
    targetBefore?.owner === opponentSeat &&
    targetBefore.card &&
    (!targetAfter?.card || targetAfter.owner !== opponentSeat || targetAfter.card !== targetBefore.card)
  );
  const ownLevelUp = event.before.slots.some((beforeSlot) => {
    const afterSlot = slotByKey(event.after, beforeSlot.slotKey);
    return (
      beforeSlot.owner === candidateSeat &&
      afterSlot?.owner === candidateSeat &&
      beforeSlot.card === afterSlot.card &&
      beforeSlot.level !== undefined &&
      afterSlot.level !== undefined &&
      afterSlot.level > beforeSlot.level
    );
  });
  const woundedLevelUpHeal = event.before.slots.some((beforeSlot) => {
    const afterSlot = slotByKey(event.after, beforeSlot.slotKey);
    if (
      beforeSlot.owner !== candidateSeat ||
      afterSlot?.owner !== candidateSeat ||
      !beforeSlot.card ||
      beforeSlot.card !== afterSlot.card ||
      beforeSlot.level === undefined ||
      afterSlot.level === undefined ||
      beforeSlot.hp === undefined ||
      afterSlot.hp === undefined ||
      afterSlot.level <= beforeSlot.level ||
      afterSlot.hp <= beforeSlot.hp
    ) {
      return false;
    }
    return beforeSlot.hp < monsterMaxHpAtLevel(beforeSlot.card, beforeSlot.level);
  });
  const masterHpDamage = event.after.players[opponentSeat].hp < event.before.players[opponentSeat].hp;
  const execution = !!event.after.winner || masterHpDamage || enemyKilled || ownLevelUp;
  const setup = !execution && (
    event.decision.startsWith("summon:") ||
    event.decision.startsWith("move:") ||
    event.decision.startsWith("focus:") ||
    event.decision.startsWith("master:shield") ||
    event.decision.startsWith("master:wake_up") ||
    enemyDamaged
  );

  return {
    execution,
    setup,
    enemyDamaged,
    enemyKilled,
    woundedLevelUpHeal,
    actorSlotKey,
    attackerCard: actorSlot?.card,
  };
}

function shieldConvertedOnNextOwnTurn(
  history: readonly MasterLabDecisionEvent[],
  shieldEventIndex: number,
  candidateSeat: PlayerId,
  shieldTargetSlotKey: string,
): boolean {
  const shieldEvent = history[shieldEventIndex];
  if (!shieldEvent) {
    return false;
  }
  const shieldedSlot = slotByKey(shieldEvent.after, shieldTargetSlotKey);
  if (shieldedSlot?.owner !== candidateSeat || !shieldedSlot.card) {
    return false;
  }
  const nextTurnNumber = history
    .slice(shieldEventIndex + 1)
    .find((event) => event.player === candidateSeat && event.turnNumber > shieldEvent.turnNumber)
    ?.turnNumber;
  if (nextTurnNumber === undefined) {
    return false;
  }

  return history.some((event, index) => {
    if (index <= shieldEventIndex || event.player !== candidateSeat || event.turnNumber !== nextTurnNumber || event.source !== "cpu") {
      return false;
    }
    const actorSlotKey = actorSlotKeyForEvent(event);
    if (actorSlotKey !== shieldTargetSlotKey) {
      return false;
    }
    const actorSlot = slotByKey(event.before, actorSlotKey);
    if (actorSlot?.owner !== candidateSeat || actorSlot.card !== shieldedSlot.card) {
      return false;
    }
    const analysis = analyzeAuditIntentEvent(event, candidateSeat);
    return analysis.execution || event.decision.startsWith("attack:");
  });
}

function laterSameTurnPolyspinnerExecution(
  history: readonly MasterLabDecisionEvent[],
  firstActionIndex: number,
  candidateSeat: PlayerId,
): boolean {
  const first = history[firstActionIndex];
  if (!first) {
    return false;
  }
  for (let index = firstActionIndex + 1; index < history.length; index += 1) {
    const event = history[index];
    if (!event || event.turnNumber !== first.turnNumber) {
      break;
    }
    if (event.player !== candidateSeat || event.source !== "cpu") {
      continue;
    }
    const actorSlotKey = actorSlotKeyForEvent(event);
    const actorSlot = actorSlotKey ? slotByKey(event.before, actorSlotKey) : undefined;
    if (actorSlot?.card !== "polyspinner") {
      continue;
    }
    if (analyzeAuditIntentEvent(event, candidateSeat).execution) {
      return true;
    }
  }
  return false;
}

function isPolyspinnerFirstAction(event: MasterLabDecisionEvent, actorSlotKey: string | undefined): boolean {
  if (!actorSlotKey) {
    return false;
  }
  const beforeSlot = slotByKey(event.before, actorSlotKey);
  if (beforeSlot?.card !== "polyspinner" || beforeSlot.actionCount !== 0) {
    return false;
  }
  return event.decision.startsWith("attack:") || event.decision.startsWith("move:") || event.decision.startsWith("focus:");
}

function actorSlotKeyForEvent(event: MasterLabDecisionEvent): string | undefined {
  if (event.decision.startsWith("attack:")) {
    return event.decision.split(":")[1];
  }
  if (event.decision.startsWith("move:")) {
    return event.decision.slice("move:".length).split("->")[0];
  }
  if (event.decision.startsWith("focus:")) {
    return event.decision.slice("focus:".length);
  }
  return undefined;
}

function targetSlotKeyForEvent(event: MasterLabDecisionEvent): string | undefined {
  const target = event.decision.split("->")[1];
  return target?.startsWith("monster:") ? target.slice("monster:".length) : undefined;
}

function shieldTargetSlotKeyForEvent(event: MasterLabDecisionEvent): string | undefined {
  if (!event.decision.startsWith("master:shield->monster:")) {
    return undefined;
  }
  return event.decision.slice("master:shield->monster:".length);
}

function slotByKey(summary: MasterLabGameStateSummary, slotKey: string): MasterLabGameStateSummary["slots"][number] | undefined {
  return summary.slots.find((slot) => slot.slotKey === slotKey);
}

function decisionKind(decision: string): string {
  if (decision.startsWith("master:shield")) {
    return "shield";
  }
  if (decision.startsWith("master:wake_up")) {
    return "wake_up";
  }
  if (decision.startsWith("summon:")) {
    return "summon";
  }
  if (decision.startsWith("attack:")) {
    return "attack";
  }
  if (decision.startsWith("move:")) {
    return "move";
  }
  if (decision.startsWith("focus:")) {
    return "focus";
  }
  if (decision.startsWith("magic:")) {
    return "magic";
  }
  return "other";
}

function monsterMaxHpAtLevel(cardId: string, level: number): number {
  const def = getMonsterDef(cardId);
  return def.levels.find((levelDef) => levelDef.level === level)?.maxHp ?? def.levels[0]?.maxHp ?? 0;
}

function opponentSeatOf(playerId: PlayerId): PlayerId {
  return playerId === "player" ? "cpu" : "player";
}

function addIntentMetrics(target: WhiteAiTurnIntentMetrics, source: WhiteAiTurnIntentMetrics): void {
  for (const key of Object.keys(target) as Array<keyof WhiteAiTurnIntentMetrics>) {
    target[key] += source[key];
  }
}

function addLowStoneByDecision(target: Record<string, number>, source: Record<string, number>): void {
  for (const [key, value] of Object.entries(source)) {
    target[key] = (target[key] ?? 0) + value;
  }
}

function emptyIntentMetrics(): WhiteAiTurnIntentMetrics {
  return {
    totalActions: 0,
    executionActions: 0,
    setupActions: 0,
    lowStoneAfterSetup: 0,
    shieldUses: 0,
    shieldConvertedNextTurn: 0,
    shieldNoConversion: 0,
    woundedLevelUpHeal: 0,
    pygmyActions: 0,
    pygmySetupHits: 0,
    polyspinnerFirstActions: 0,
    polyspinnerPurposefulFirstAction: 0,
    polyspinnerWasteAction: 0,
  };
}

function formatAuditMarkdown(report: WhiteAiLossAuditReport): string {
  return [
    "# White AI Loss Audit",
    "",
    `生成: ${report.generatedAt}`,
    `候補: ${report.variants.join(", ")}`,
    `相手: ${report.opponents.join(", ")}`,
    `試行: ${report.gamesPerMatchup} games/matchup/direction`,
    "",
    "## Summary",
    "",
    "| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Loss LowS By Action | Notes |",
    "| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |",
    ...report.audits.map(formatAuditRow),
    "",
    "## Reading",
    "",
    "- `Win Intent` / `Loss Intent` は候補白側CPU行動だけを集計している。",
    "- `LowS` は布石後に残ストーンが1以下になった割合。",
    "- `ShieldConv` はシールド対象が次の自ターンに攻撃または成果行動へつながった割合。",
    "- `Loss LowS By Action` は負け試合で低石化した布石の行動種別。ここが偏るほど、次候補の狙いを絞りやすい。",
  ].join("\n");
}

function formatAuditRow(audit: VariantAudit): string {
  return [
    audit.variantId,
    `${audit.wins}-${audit.losses}-${audit.draws}`,
    audit.averageTurns,
    audit.averageOpponentHpOnLoss ?? "-",
    audit.outcomes.loss.seeds.slice(0, 12).join(", ") || "-",
    formatIntent(audit.outcomes.win.intent),
    formatIntent(audit.outcomes.loss.intent),
    formatLowStoneByDecision(audit.outcomes.loss.lowStoneByDecision),
    audit.notes.join("<br>"),
  ].map(escapeCell).join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatIntent(metrics: WhiteAiTurnIntentMetrics): string {
  if (metrics.totalActions <= 0) {
    return "-";
  }
  return [
    `Ex ${formatPercent(rate(metrics.executionActions, metrics.totalActions))}`,
    `Setup ${formatPercent(rate(metrics.setupActions, metrics.totalActions))}`,
    `LowS ${formatIntentLowStone(metrics)}`,
    `ShieldConv ${formatPercent(rate(metrics.shieldConvertedNextTurn, metrics.shieldUses))}`,
  ].join("<br>");
}

function formatIntentLowStone(metrics: WhiteAiTurnIntentMetrics): string {
  return formatPercent(rate(metrics.lowStoneAfterSetup, metrics.setupActions));
}

function formatLowStoneByDecision(source: Record<string, number>): string {
  const entries = Object.entries(source).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return entries.length > 0 ? entries.map(([key, value]) => `${key}:${value}`).join(", ") : "-";
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    gamesPerMatchup: 4,
    seedStart: 9000,
    maxSteps: 700,
    maxTurns: 160,
    variantIds: [],
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
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      i += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readNumber(arg, next);
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
  }
  if (parsed.variantIds) {
    for (const id of parsed.variantIds) {
      if (!DEFAULT_WHITE_AI_TUNING_VARIANTS.some((variant) => variant.id === id)) {
        throw new Error(`Unknown variant: ${id}`);
      }
    }
  }
  if (parsed.opponentIds?.length) {
    parsed.opponents = parsed.opponentIds.map(findOpponent);
  }
  return parsed;
}

function findOpponent(id: string): WhiteAiTuningOpponent {
  const opponent = DEFAULT_WHITE_AI_TUNING_OPPONENTS.find((candidate) => candidate.id === id);
  if (!opponent) {
    throw new Error(`Unknown opponent: ${id}`);
  }
  return opponent;
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
  npm run lab:masters:white-ai-loss-audit -- [options]

Options:
  --games-per-matchup <n>   Games for each directed matchup. Default: 4
  --seed-start <n>          First seed. Default: 9000
  --variant <id>            Run only the specified variant. Can be repeated.
  --opponent <id>           Run only the specified opponent. Can be repeated.
  --max-steps <n>           Failure threshold per game. Default: 700
  --max-turns <n>           Failure threshold per game. Default: 160
  --markdown <path>         Write a Markdown audit.
  --json <path>             Write a JSON audit.
`);
}

function rate(points: number, games: number): number {
  return games > 0 ? points / games : 0;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function formatPercent(value: number): string {
  return `${round1(value * 100)}%`;
}

function escapeCell(value: string | number): string {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}
