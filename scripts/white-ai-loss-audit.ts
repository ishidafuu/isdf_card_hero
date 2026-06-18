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
  targetQuality: TargetQualityAudit;
}

interface TargetQualityAudit {
  shield: ShieldTargetAudit;
  wake: WakeTargetAudit;
}

interface ShieldTargetAudit {
  uses: number;
  nextOwnTurnAttack: number;
  nextOwnTurnLevelUp: number;
  removedBeforeNextOwnTurn: number;
  threatOrConversionReason: number;
  secondShieldSameTurn: number;
  lowStoneSecondShield: number;
}

interface WakeTargetAudit {
  uses: number;
  sameTurnAttack: number;
  sameTurnExecution: number;
  nextOwnTurnAttack: number;
  nextOwnTurnLevelUp: number;
  lowStoneAfterWake: number;
  lowStoneNoSameTurnWork: number;
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
      addTargetQualityAudit(outcomeAudit.targetQuality, intent.targetQuality);
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
    targetQuality: emptyTargetQualityAudit(),
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
  if (
    audit.outcomes.loss.targetQuality.shield.uses >= 4 &&
    rate(audit.outcomes.loss.targetQuality.shield.nextOwnTurnAttack, audit.outcomes.loss.targetQuality.shield.uses) < 0.25
  ) {
    notes.push("負け側の盾対象が次ターン攻撃しない");
  }
  if (
    audit.outcomes.loss.targetQuality.wake.uses >= 4 &&
    rate(audit.outcomes.loss.targetQuality.wake.sameTurnAttack, audit.outcomes.loss.targetQuality.wake.uses) < 0.3
  ) {
    notes.push("負け側のウェイク即仕事が低い");
  }
  return notes.length > 0 ? notes : ["-"];
}

function summarizeAuditIntentMetrics(
  history: readonly MasterLabDecisionEvent[],
  candidateSeat: PlayerId,
): { metrics: WhiteAiTurnIntentMetrics; lowStoneByDecision: Record<string, number>; targetQuality: TargetQualityAudit } {
  const metrics = emptyIntentMetrics();
  const lowStoneByDecision: Record<string, number> = {};
  const targetQuality = emptyTargetQualityAudit();

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
      addShieldTargetAudit(targetQuality.shield, history, index, candidateSeat, shieldTargetSlotKey);
    }

    const wakeTargetSlotKey = wakeTargetSlotKeyForEvent(event);
    if (wakeTargetSlotKey) {
      addWakeTargetAudit(targetQuality.wake, history, index, candidateSeat, wakeTargetSlotKey);
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

  return { metrics, lowStoneByDecision, targetQuality };
}

function addShieldTargetAudit(
  target: ShieldTargetAudit,
  history: readonly MasterLabDecisionEvent[],
  shieldEventIndex: number,
  candidateSeat: PlayerId,
  shieldTargetSlotKey: string,
): void {
  const event = history[shieldEventIndex];
  if (!event) {
    return;
  }

  target.uses += 1;
  if (shieldReasonSuggestsThreatOrConversion(event.reason)) {
    target.threatOrConversionReason += 1;
  }
  if (previousSameTurnShieldCount(history, shieldEventIndex, candidateSeat) > 0) {
    target.secondShieldSameTurn += 1;
    if (event.after.players[candidateSeat].stones <= 1) {
      target.lowStoneSecondShield += 1;
    }
  }

  const nextTurnNumber = nextOwnTurnNumberAfter(history, shieldEventIndex, candidateSeat);
  if (nextTurnNumber === undefined) {
    return;
  }
  if (slotAttacksOnTurn(history, shieldEventIndex, candidateSeat, shieldTargetSlotKey, nextTurnNumber)) {
    target.nextOwnTurnAttack += 1;
  }
  if (slotLevelsUpOnTurn(history, shieldEventIndex, candidateSeat, shieldTargetSlotKey, nextTurnNumber)) {
    target.nextOwnTurnLevelUp += 1;
  }
  if (slotRemovedBeforeTurn(history, shieldEventIndex, candidateSeat, shieldTargetSlotKey, nextTurnNumber)) {
    target.removedBeforeNextOwnTurn += 1;
  }
}

function addWakeTargetAudit(
  target: WakeTargetAudit,
  history: readonly MasterLabDecisionEvent[],
  wakeEventIndex: number,
  candidateSeat: PlayerId,
  wakeTargetSlotKey: string,
): void {
  const event = history[wakeEventIndex];
  if (!event) {
    return;
  }

  target.uses += 1;
  const sameTurnAttack = slotAttacksOnTurn(history, wakeEventIndex, candidateSeat, wakeTargetSlotKey, event.turnNumber);
  const sameTurnExecution = slotExecutesOnTurn(history, wakeEventIndex, candidateSeat, wakeTargetSlotKey, event.turnNumber);
  if (sameTurnAttack) {
    target.sameTurnAttack += 1;
  }
  if (sameTurnExecution) {
    target.sameTurnExecution += 1;
  }
  if (event.after.players[candidateSeat].stones <= 1) {
    target.lowStoneAfterWake += 1;
    if (!sameTurnAttack && !sameTurnExecution) {
      target.lowStoneNoSameTurnWork += 1;
    }
  }

  const nextTurnNumber = nextOwnTurnNumberAfter(history, wakeEventIndex, candidateSeat);
  if (nextTurnNumber === undefined) {
    return;
  }
  if (slotAttacksOnTurn(history, wakeEventIndex, candidateSeat, wakeTargetSlotKey, nextTurnNumber)) {
    target.nextOwnTurnAttack += 1;
  }
  if (slotLevelsUpOnTurn(history, wakeEventIndex, candidateSeat, wakeTargetSlotKey, nextTurnNumber)) {
    target.nextOwnTurnLevelUp += 1;
  }
}

function nextOwnTurnNumberAfter(
  history: readonly MasterLabDecisionEvent[],
  eventIndex: number,
  candidateSeat: PlayerId,
): number | undefined {
  const event = history[eventIndex];
  if (!event) {
    return undefined;
  }
  return history
    .slice(eventIndex + 1)
    .find((candidate) => candidate.player === candidateSeat && candidate.turnNumber > event.turnNumber)
    ?.turnNumber;
}

function slotAttacksOnTurn(
  history: readonly MasterLabDecisionEvent[],
  eventIndex: number,
  candidateSeat: PlayerId,
  slotKey: string,
  turnNumber: number,
): boolean {
  return history.some((event, index) =>
    index > eventIndex &&
    event.player === candidateSeat &&
    event.turnNumber === turnNumber &&
    event.source === "cpu" &&
    event.decision.startsWith("attack:") &&
    actorSlotKeyForEvent(event) === slotKey,
  );
}

function slotExecutesOnTurn(
  history: readonly MasterLabDecisionEvent[],
  eventIndex: number,
  candidateSeat: PlayerId,
  slotKey: string,
  turnNumber: number,
): boolean {
  return history.some((event, index) =>
    index > eventIndex &&
    event.player === candidateSeat &&
    event.turnNumber === turnNumber &&
    event.source === "cpu" &&
    actorSlotKeyForEvent(event) === slotKey &&
    analyzeAuditIntentEvent(event, candidateSeat).execution,
  );
}

function slotLevelsUpOnTurn(
  history: readonly MasterLabDecisionEvent[],
  eventIndex: number,
  candidateSeat: PlayerId,
  slotKey: string,
  turnNumber: number,
): boolean {
  return history.some((event, index) => {
    if (index <= eventIndex || event.turnNumber !== turnNumber) {
      return false;
    }
    const before = slotByKey(event.before, slotKey);
    const after = slotByKey(event.after, slotKey);
    return !!(
      before?.owner === candidateSeat &&
      after?.owner === candidateSeat &&
      before.card === after.card &&
      before.level !== undefined &&
      after.level !== undefined &&
      after.level > before.level
    );
  });
}

function slotRemovedBeforeTurn(
  history: readonly MasterLabDecisionEvent[],
  eventIndex: number,
  candidateSeat: PlayerId,
  slotKey: string,
  turnNumber: number,
): boolean {
  const event = history[eventIndex];
  const protectedSlot = event ? slotByKey(event.after, slotKey) : undefined;
  if (!event || protectedSlot?.owner !== candidateSeat || !protectedSlot.card) {
    return false;
  }
  return history.some((candidate, index) => {
    if (index <= eventIndex || candidate.turnNumber >= turnNumber) {
      return false;
    }
    const current = slotByKey(candidate.after, slotKey);
    return !current?.card || current.owner !== candidateSeat || current.card !== protectedSlot.card;
  });
}

function previousSameTurnShieldCount(
  history: readonly MasterLabDecisionEvent[],
  eventIndex: number,
  candidateSeat: PlayerId,
): number {
  const event = history[eventIndex];
  if (!event) {
    return 0;
  }
  return history
    .slice(0, eventIndex)
    .filter((candidate) =>
      candidate.player === candidateSeat &&
      candidate.turnNumber === event.turnNumber &&
      candidate.source === "cpu" &&
      candidate.decision.startsWith("master:shield"),
    ).length;
}

function shieldReasonSuggestsThreatOrConversion(reason: string): boolean {
  return (
    reason.includes("致死") ||
    reason.includes("倒され") ||
    reason.includes("レベルアップ") ||
    reason.includes("守れる")
  );
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

function wakeTargetSlotKeyForEvent(event: MasterLabDecisionEvent): string | undefined {
  if (!event.decision.startsWith("master:wake_up->monster:")) {
    return undefined;
  }
  return event.decision.slice("master:wake_up->monster:".length);
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

function addTargetQualityAudit(target: TargetQualityAudit, source: TargetQualityAudit): void {
  for (const key of Object.keys(target.shield) as Array<keyof ShieldTargetAudit>) {
    target.shield[key] += source.shield[key];
  }
  for (const key of Object.keys(target.wake) as Array<keyof WakeTargetAudit>) {
    target.wake[key] += source.wake[key];
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

function emptyTargetQualityAudit(): TargetQualityAudit {
  return {
    shield: {
      uses: 0,
      nextOwnTurnAttack: 0,
      nextOwnTurnLevelUp: 0,
      removedBeforeNextOwnTurn: 0,
      threatOrConversionReason: 0,
      secondShieldSameTurn: 0,
      lowStoneSecondShield: 0,
    },
    wake: {
      uses: 0,
      sameTurnAttack: 0,
      sameTurnExecution: 0,
      nextOwnTurnAttack: 0,
      nextOwnTurnLevelUp: 0,
      lowStoneAfterWake: 0,
      lowStoneNoSameTurnWork: 0,
    },
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
    "| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Win Target Quality | Loss Target Quality | Loss LowS By Action | Notes |",
    "| --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- |",
    ...report.audits.map(formatAuditRow),
    "",
    "## Reading",
    "",
    "- `Win Intent` / `Loss Intent` は候補白側CPU行動だけを集計している。",
    "- `LowS` は布石後に残ストーンが1以下になった割合。",
    "- `ShieldConv` はシールド対象が次の自ターンに攻撃または成果行動へつながった割合。",
    "- `Target Quality` の `SAtk` は盾対象が次自ターンに攻撃した率、`S2Low` は同ターン2枚目以降のシールドで残石1以下になった回数。",
    "- `Target Quality` の `WNow` はウェイクアップ対象が同ターンに攻撃した率、`WLowNo` は低石で起こして同ターン仕事しなかった回数。",
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
    formatTargetQuality(audit.outcomes.win.targetQuality),
    formatTargetQuality(audit.outcomes.loss.targetQuality),
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

function formatTargetQuality(target: TargetQualityAudit): string {
  return [
    target.shield.uses > 0
      ? [
          `S ${target.shield.uses}`,
          `SAtk ${formatPercent(rate(target.shield.nextOwnTurnAttack, target.shield.uses))}`,
          `SLv ${target.shield.nextOwnTurnLevelUp}`,
          `SDead ${formatPercent(rate(target.shield.removedBeforeNextOwnTurn, target.shield.uses))}`,
          `S2Low ${target.shield.lowStoneSecondShield}/${target.shield.secondShieldSameTurn}`,
        ].join(" ")
      : "S -",
    target.wake.uses > 0
      ? [
          `W ${target.wake.uses}`,
          `WNow ${formatPercent(rate(target.wake.sameTurnAttack, target.wake.uses))}`,
          `WExec ${formatPercent(rate(target.wake.sameTurnExecution, target.wake.uses))}`,
          `WNext ${formatPercent(rate(target.wake.nextOwnTurnAttack, target.wake.uses))}`,
          `WLowNo ${target.wake.lowStoneNoSameTurnWork}/${target.wake.lowStoneAfterWake}`,
        ].join(" ")
      : "W -",
  ].join("<br>");
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
