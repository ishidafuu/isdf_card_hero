import { getCardName, getMonsterDef } from "../src/game/cards";
import { getMonsterAiTrait } from "../src/game/aiUnitTraits";
import {
  CURRENT_WHITE_AI_BLACK_1375_PRESSURE_OPPONENT,
  CURRENT_WHITE_AI_BLACK_PRESSURE_STRONG_OPPONENT,
  CURRENT_WHITE_AI_DECOY_BACK_STABLE_OPPONENT,
  CURRENT_WHITE_AI_MIRROR_OPPONENT,
  createCurrentWhiteAiVariant as currentVariant,
} from "../src/game/currentWhiteAiFixtures";
import {
  runWhiteAiTuningLoop,
  type WhiteAiTuningLoopOptions,
  type WhiteAiTuningOpponent,
  type WhiteAiTuningVariant,
} from "../src/game/whiteAiTuningLoop";
import type { MasterLabDecisionEvent, MasterLabGameStateSummary } from "../src/game/masterLabAutoPlay";
import type { CommandDef, PlayerId, SlotKey } from "../src/game/types";
import { escapeMarkdownTableCell, formatPercent, readInteger, readString, round, writeReport } from "./lib/cli";

type Outcome = "win" | "loss" | "draw";

interface CliOptions extends WhiteAiTuningLoopOptions {
  markdownPath?: string;
  jsonPath?: string;
  maxSamples: number;
}

interface BacklineSummonAuditReport {
  generatedAt: string;
  gamesPerMatchup: number;
  seedStart: number;
  variants: string[];
  opponents: string[];
  games: number;
  metrics: BacklineSummonMetrics;
  byVariant: VariantBacklineSummonAudit[];
  samples: BacklineSummonSample[];
  notes: string[];
  nextLoopProposal: string[];
}

interface VariantBacklineSummonAudit {
  variantId: string;
  label: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  metrics: BacklineSummonMetrics;
  byOpponent: OpponentBacklineSummonAudit[];
}

interface OpponentBacklineSummonAudit {
  opponentId: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  metrics: BacklineSummonMetrics;
}

interface BacklineSummonMetrics {
  summons: number;
  backlineSummons: number;
  blockedBacklineSummons: number;
  frontRoleBlockedBacklineSummons: number;
  blockedWithBacklinePattern: number;
  blockedWithoutBacklinePattern: number;
  blockedWithImmediateWakeWork: number;
  blockedNextTurnAttack: number;
  blockedNextTurnBacklineAttack: number;
  blockedNextTurnMoveForward: number;
  blockedNextTurnNoWork: number;
  blockedLowStoneAfterSummon: number;
  blockedVeryLowStoneAfterSummon: number;
  blockedLosses: number;
  blockedWins: number;
  badBlockedBacklineSummons: number;
  badWithEvaluationTrace: number;
  badWithCloseNonSummonAlternative: number;
  badTopAlternativeAttack: number;
  badTopAlternativeFocus: number;
  badTopAlternativeEndTurn: number;
  badTopAlternativeMove: number;
  badTopAlternativeFrontSummon: number;
  badTopAlternativeOtherSummon: number;
  badTopSummonAlternative: number;
  badTopSummonSameCard: number;
  badTopSummonBlocked: number;
  badTopSummonBacklinePattern: number;
  badTopSummonNoBacklinePattern: number;
  badWithOtherBacklineWorkInHand: number;
  badConsumesLastBackSlot: number;
  badLeavesNoEmptyBackSlot: number;
  badOtherBacklineWorkCardsInHandTotal: number;
  badNoReachFrontBackSlotsAfterTotal: number;
}

interface BacklineSummonAudit {
  event: MasterLabDecisionEvent;
  variantId: string;
  opponentId: string;
  candidateSeat: PlayerId;
  outcome: Outcome;
  slotKey: SlotKey;
  cardId: string;
  cardName: string;
  role: string;
  frontBlocker?: SummarySlot;
  hasBacklinePattern: boolean;
  immediateWakeWork: boolean;
  followup: BacklineSummonFollowup;
  alternatives: BacklineAlternativeAudit;
  handPressure: BacklineHandPressureAudit;
}

interface BacklineSummonFollowup {
  nextTurnAttack: boolean;
  nextTurnBacklineAttack: boolean;
  nextTurnMoveForward: boolean;
  nextTurnNoWork: boolean;
  nextTurnDecisions: string[];
}

type CpuEvaluationTrace = NonNullable<MasterLabDecisionEvent["cpuDecisionEvaluations"]>[number];

interface BacklineAlternativeAudit {
  hasTrace: boolean;
  topNonSelected?: CpuEvaluationTrace;
  bestNonSummon?: CpuEvaluationTrace;
  closestAttack?: CpuEvaluationTrace;
  closestFocus?: CpuEvaluationTrace;
  closestEndTurn?: CpuEvaluationTrace;
  closestMove?: CpuEvaluationTrace;
  closestFrontSummon?: CpuEvaluationTrace;
  closestOtherSummon?: CpuEvaluationTrace;
  topSummon?: CpuEvaluationTrace;
  closeNonSummon: boolean;
}

type HandCardSummary = NonNullable<MasterLabDecisionEvent["currentPlayerHand"]>[number];

interface BacklineHandPressureAudit {
  hasHandTrace: boolean;
  otherBacklineWorkCards: HandCardSummary[];
  otherNoReachFrontMonsters: HandCardSummary[];
  emptyBackSlotsBefore: number;
  emptyBackSlotsAfter: number;
  noReachFrontBackSlotsAfter: number;
  consumesLastBackSlot: boolean;
  leavesNoEmptyBackSlot: boolean;
}

interface BacklineSummonSample {
  kind: string;
  variantId: string;
  opponentId: string;
  outcome: Outcome;
  candidateSeat: PlayerId;
  seed: number;
  turnNumber: number;
  step: number;
  slotKey: string;
  card: string;
  role: string;
  frontBlocker: string;
  afterStones: number;
  score: number;
  reason: string;
  flags: string;
  alternatives: string;
  handPressure: string;
  nextTurn: string;
  board: string;
}

type SummarySlot = MasterLabGameStateSummary["slots"][number];

const ALL_VARIANTS = [
  currentVariant("current_white_baseline", "現行: デスシープ3 / white", undefined, "暫定白最強デッキで現行white profileの後列召喚を監査する。"),
  currentVariant("current_blocked_backline_no_work40", "候補: 詰まり後列仕事なし 40", {
    situationalBias: { whiteBlockedBacklineNoWorkSummonPenalty: 40 },
  }, "同レーン前列が埋まり、後列から射程仕事がない召喚だけを軽く抑える。"),
  currentVariant("current_blocked_backline_no_work80", "候補: 詰まり後列仕事なし 80", {
    situationalBias: { whiteBlockedBacklineNoWorkSummonPenalty: 80 },
  }, "詰まり後列の仕事なし召喚を中程度に抑える。ボムゾウ等の射程持ちは対象外。"),
  currentVariant("current_blocked_backline_no_work120", "候補: 詰まり後列仕事なし 120", {
    situationalBias: { whiteBlockedBacklineNoWorkSummonPenalty: 120 },
  }, "前列が詰まった後列に仕事なしユニットを置く挙動を強く抑える。"),
  currentVariant("current_back_slot_future_value40", "候補: 後列枠将来価値 40", {
    situationalBias: { whiteBackSlotFutureValuePenalty: 40 },
  }, "最後の後列空き枠や後列射程なし前衛の増加を、候補削除ではなく盤面の将来価値として軽く下げる。"),
  currentVariant("current_back_slot_future_value80", "候補: 後列枠将来価値 80", {
    situationalBias: { whiteBackSlotFutureValuePenalty: 80 },
  }, "後列枠を潰す召喚の将来損を中程度に見る。"),
] as const satisfies readonly WhiteAiTuningVariant[];

const ALL_OPPONENTS = [
  CURRENT_WHITE_AI_BLACK_PRESSURE_STRONG_OPPONENT,
  CURRENT_WHITE_AI_BLACK_1375_PRESSURE_OPPONENT,
  CURRENT_WHITE_AI_DECOY_BACK_STABLE_OPPONENT,
  CURRENT_WHITE_AI_MIRROR_OPPONENT,
] as const satisfies readonly WhiteAiTuningOpponent[];

const DEFAULT_VARIANT_IDS = [
  "current_white_baseline",
  "current_blocked_backline_no_work40",
  "current_blocked_backline_no_work80",
  "current_blocked_backline_no_work120",
] as const;
const DEFAULT_OPPONENT_IDS = ["black_1375_pressure", "white_current_mirror"] as const;

const options = parseArgs(process.argv.slice(2));
const loopReport = runWhiteAiTuningLoop({ ...options, includeGameHistory: true });
const report = buildReport(loopReport, options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
}

console.log(`White backline summon audit loop: ${report.variants.length} variants / ${report.games} games`);
for (const audit of report.byVariant) {
  console.log(
    `${audit.variantId}: ${audit.wins}-${audit.losses}-${audit.draws} ` +
      `blocked ${audit.metrics.blockedBacklineSummons} ` +
      `noPattern ${formatPercent(rate(audit.metrics.blockedWithoutBacklinePattern, audit.metrics.blockedBacklineSummons))} ` +
      `noWork ${formatPercent(rate(audit.metrics.blockedNextTurnNoWork, audit.metrics.blockedBacklineSummons))} ` +
      `bad ${audit.metrics.badBlockedBacklineSummons} ` +
      `closeAlt ${audit.metrics.badWithCloseNonSummonAlternative}`,
  );
}
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function buildReport(
  loopReport: ReturnType<typeof runWhiteAiTuningLoop>,
  parsedOptions: CliOptions,
): BacklineSummonAuditReport {
  const records = new Map<string, VariantBacklineSummonAudit>();
  const samples: BacklineSummonSample[] = [];
  const total = emptyMetrics();
  let games = 0;

  for (const variant of loopReport.variants) {
    records.set(variant.id, {
      variantId: variant.id,
      label: variant.label,
      games: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      metrics: emptyMetrics(),
      byOpponent: loopReport.opponents.map((opponent) => ({
        opponentId: opponent.id,
        games: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        metrics: emptyMetrics(),
      })),
    });
  }

  for (const run of loopReport.runs) {
    const record = records.get(run.variantId);
    if (!record) {
      continue;
    }
    const opponentRecord = record.byOpponent.find((candidate) => candidate.opponentId === run.opponentId);
    for (const game of run.result.games) {
      games += 1;
      record.games += 1;
      if (opponentRecord) {
        opponentRecord.games += 1;
      }
      const outcome = outcomeFor(game.winner, run.candidateSeat);
      addOutcome(record, outcome);
      if (opponentRecord) {
        addOutcome(opponentRecord, outcome);
      }

      for (const audit of auditGameBacklineSummons(game.history ?? [], {
        variantId: run.variantId,
        opponentId: run.opponentId,
        candidateSeat: run.candidateSeat,
        outcome,
      })) {
        addAudit(total, audit);
        addAudit(record.metrics, audit);
        if (opponentRecord) {
          addAudit(opponentRecord.metrics, audit);
        }
        addSamples(samples, audit, parsedOptions.maxSamples);
      }
    }
  }

  return {
    generatedAt: loopReport.generatedAt,
    gamesPerMatchup: loopReport.gamesPerMatchup,
    seedStart: parsedOptions.seedStart ?? 0,
    variants: loopReport.variants.map((variant) => variant.id),
    opponents: loopReport.opponents.map((opponent) => opponent.id),
    games,
    metrics: total,
    byVariant: [...records.values()].map((record) => ({
      ...record,
      byOpponent: record.byOpponent.filter((opponent) => opponent.games > 0),
    })),
    samples,
    notes: buildNotes(total),
    nextLoopProposal: buildNextLoopProposal(total),
  };
}

function auditGameBacklineSummons(
  history: readonly MasterLabDecisionEvent[],
  context: Pick<BacklineSummonAudit, "variantId" | "opponentId" | "candidateSeat" | "outcome">,
): BacklineSummonAudit[] {
  const audits: BacklineSummonAudit[] = [];
  for (let index = 0; index < history.length; index += 1) {
    const event = history[index];
    if (!event || event.player !== context.candidateSeat || event.source !== "cpu") {
      continue;
    }
    const slotKey = summonSlotKeyForDecision(event.decision);
    if (!slotKey) {
      continue;
    }
    const slot = slotByKey(event.after, slotKey);
    if (!slot?.card || slot.owner !== context.candidateSeat) {
      continue;
    }
    const frontBlocker = slotRow(slot.slotKey) === "back" ? slotByKey(event.after, frontSlotKeyFor(slotKey)) : undefined;
    audits.push({
      event,
      variantId: context.variantId,
      opponentId: context.opponentId,
      candidateSeat: context.candidateSeat,
      outcome: context.outcome,
      slotKey,
      cardId: slot.card,
      cardName: safeCardName(slot.card),
      role: safeMonsterRole(slot.card),
      frontBlocker: frontBlocker?.owner === context.candidateSeat && frontBlocker.card ? frontBlocker : undefined,
      hasBacklinePattern: monsterHasBacklineAttackPattern(slot.card),
      immediateWakeWork: event.reason.includes("即仕事") || event.reason.includes("ウェイク"),
      followup: auditFollowup(history, index, context.candidateSeat, slotKey, slot.card),
      alternatives: auditAlternatives(event),
      handPressure: auditHandPressure(event, context.candidateSeat),
    });
  }
  return audits;
}

function auditHandPressure(event: MasterLabDecisionEvent, candidateSeat: PlayerId): BacklineHandPressureAudit {
  const hand = event.currentPlayerHand ?? [];
  const selectedHandInstanceId = summonHandInstanceIdForDecision(event.decision);
  const otherHand = selectedHandInstanceId
    ? hand.filter((card) => card.instanceId !== selectedHandInstanceId)
    : hand;
  const otherMonsters = otherHand.filter((card) => card.type === "monster");
  const otherBacklineWorkCards = otherMonsters.filter((card) => monsterHasBacklineAttackPattern(card.cardId));
  const otherNoReachFrontMonsters = otherMonsters.filter((card) =>
    card.role === "front" && !monsterHasBacklineAttackPattern(card.cardId),
  );
  const emptyBackSlotsBefore = emptyBackSlotCount(event.before, candidateSeat);
  const emptyBackSlotsAfter = emptyBackSlotCount(event.after, candidateSeat);
  const noReachFrontBackSlotsAfter = noReachFrontBackSlotCount(event.after, candidateSeat);
  return {
    hasHandTrace: hand.length > 0,
    otherBacklineWorkCards,
    otherNoReachFrontMonsters,
    emptyBackSlotsBefore,
    emptyBackSlotsAfter,
    noReachFrontBackSlotsAfter,
    consumesLastBackSlot: emptyBackSlotsBefore > 0 && emptyBackSlotsAfter === 0,
    leavesNoEmptyBackSlot: emptyBackSlotsAfter === 0,
  };
}

function auditAlternatives(event: MasterLabDecisionEvent): BacklineAlternativeAudit {
  const evaluations = event.cpuDecisionEvaluations ?? [];
  const nonSelected = evaluations
    .filter((evaluation) => !evaluation.selected)
    .sort((a, b) => b.totalScore - a.totalScore || a.index - b.index);
  const bestNonSummon = nonSelected.find((evaluation) => evaluation.type !== "summon");
  return {
    hasTrace: evaluations.length > 0,
    topNonSelected: nonSelected[0],
    bestNonSummon,
    closestAttack: nonSelected.find((evaluation) => evaluation.type === "attack"),
    closestFocus: nonSelected.find((evaluation) => evaluation.type === "focus"),
    closestEndTurn: nonSelected.find((evaluation) => evaluation.type === "end_turn"),
    closestMove: nonSelected.find((evaluation) => evaluation.type === "move"),
    closestFrontSummon: nonSelected.find((evaluation) =>
      evaluation.type === "summon" && summonTargetRow(evaluation.decision) === "front",
    ),
    closestOtherSummon: nonSelected.find((evaluation) =>
      evaluation.type === "summon" && summonTargetRow(evaluation.decision) !== "front",
    ),
    topSummon: nonSelected.find((evaluation) => evaluation.type === "summon"),
    closeNonSummon: bestNonSummon ? bestNonSummon.deltaFromSelected <= 35 : false,
  };
}

function auditFollowup(
  history: readonly MasterLabDecisionEvent[],
  summonEventIndex: number,
  candidateSeat: PlayerId,
  slotKey: SlotKey,
  cardId: string,
): BacklineSummonFollowup {
  const nextOwnTurn = nextOwnTurnWindowAfter(history, summonEventIndex, candidateSeat);
  const decisions: string[] = [];
  let trackedSlotKey: string = slotKey;
  let nextTurnAttack = false;
  let nextTurnBacklineAttack = false;
  let nextTurnMoveForward = false;
  if (!nextOwnTurn) {
    return {
      nextTurnAttack: false,
      nextTurnBacklineAttack: false,
      nextTurnMoveForward: false,
      nextTurnNoWork: true,
      nextTurnDecisions: [],
    };
  }

  for (let index = nextOwnTurn.startIndex; index < nextOwnTurn.endIndex; index += 1) {
    const current = history[index];
    if (!current || current.player !== candidateSeat) {
      continue;
    }
    decisions.push(current.decision);
    const moved = moveForDecision(current.decision);
    if (moved?.from === trackedSlotKey) {
      if (slotRow(moved.from) === "back" && slotRow(moved.to) === "front") {
        nextTurnMoveForward = true;
      }
      trackedSlotKey = moved.to;
    }
    const attack = attackForDecision(current.decision);
    if (attack?.actor === trackedSlotKey && slotBelongsToCard(current.before, trackedSlotKey, cardId, candidateSeat)) {
      nextTurnAttack = true;
      if (slotRow(trackedSlotKey) === "back") {
        nextTurnBacklineAttack = true;
      }
    }
  }
  return {
    nextTurnAttack,
    nextTurnBacklineAttack,
    nextTurnMoveForward,
    nextTurnNoWork: !nextTurnAttack && !nextTurnMoveForward,
    nextTurnDecisions: decisions,
  };
}

function addAudit(metrics: BacklineSummonMetrics, audit: BacklineSummonAudit): void {
  const blocked = !!audit.frontBlocker && slotRow(audit.slotKey) === "back";
  metrics.summons += 1;
  if (slotRow(audit.slotKey) === "back") {
    metrics.backlineSummons += 1;
  }
  if (!blocked) {
    return;
  }
  metrics.blockedBacklineSummons += 1;
  if (audit.role === "front") {
    metrics.frontRoleBlockedBacklineSummons += 1;
  }
  if (audit.hasBacklinePattern) {
    metrics.blockedWithBacklinePattern += 1;
  } else {
    metrics.blockedWithoutBacklinePattern += 1;
  }
  if (audit.immediateWakeWork) {
    metrics.blockedWithImmediateWakeWork += 1;
  }
  if (audit.followup.nextTurnAttack) {
    metrics.blockedNextTurnAttack += 1;
  }
  if (audit.followup.nextTurnBacklineAttack) {
    metrics.blockedNextTurnBacklineAttack += 1;
  }
  if (audit.followup.nextTurnMoveForward) {
    metrics.blockedNextTurnMoveForward += 1;
  }
  if (audit.followup.nextTurnNoWork) {
    metrics.blockedNextTurnNoWork += 1;
  }
  if (audit.event.after.players[audit.candidateSeat].stones <= 2) {
    metrics.blockedLowStoneAfterSummon += 1;
  }
  if (audit.event.after.players[audit.candidateSeat].stones <= 1) {
    metrics.blockedVeryLowStoneAfterSummon += 1;
  }
  if (audit.outcome === "loss") {
    metrics.blockedLosses += 1;
  } else if (audit.outcome === "win") {
    metrics.blockedWins += 1;
  }
  if (isBadBlockedBacklineSummon(audit)) {
    metrics.badBlockedBacklineSummons += 1;
    if (audit.alternatives.hasTrace) {
      metrics.badWithEvaluationTrace += 1;
    }
    if (audit.alternatives.closeNonSummon) {
      metrics.badWithCloseNonSummonAlternative += 1;
    }
    addBadTopAlternative(metrics, audit.alternatives.topNonSelected);
    addBadTopSummonAlternative(metrics, audit, audit.alternatives.topSummon);
    if (audit.handPressure.otherBacklineWorkCards.length > 0) {
      metrics.badWithOtherBacklineWorkInHand += 1;
    }
    if (audit.handPressure.consumesLastBackSlot) {
      metrics.badConsumesLastBackSlot += 1;
    }
    if (audit.handPressure.leavesNoEmptyBackSlot) {
      metrics.badLeavesNoEmptyBackSlot += 1;
    }
    metrics.badOtherBacklineWorkCardsInHandTotal += audit.handPressure.otherBacklineWorkCards.length;
    metrics.badNoReachFrontBackSlotsAfterTotal += audit.handPressure.noReachFrontBackSlotsAfter;
  }
}

function isBadBlockedBacklineSummon(audit: BacklineSummonAudit): boolean {
  return !!audit.frontBlocker &&
    slotRow(audit.slotKey) === "back" &&
    !audit.hasBacklinePattern &&
    audit.followup.nextTurnNoWork;
}

function addBadTopAlternative(metrics: BacklineSummonMetrics, alternative: CpuEvaluationTrace | undefined): void {
  if (!alternative) {
    return;
  }
  if (alternative.type === "attack") {
    metrics.badTopAlternativeAttack += 1;
  } else if (alternative.type === "focus") {
    metrics.badTopAlternativeFocus += 1;
  } else if (alternative.type === "end_turn") {
    metrics.badTopAlternativeEndTurn += 1;
  } else if (alternative.type === "move") {
    metrics.badTopAlternativeMove += 1;
  } else if (alternative.type === "summon" && summonTargetRow(alternative.decision) === "front") {
    metrics.badTopAlternativeFrontSummon += 1;
  } else if (alternative.type === "summon") {
    metrics.badTopAlternativeOtherSummon += 1;
  }
}

function addBadTopSummonAlternative(
  metrics: BacklineSummonMetrics,
  audit: BacklineSummonAudit,
  alternative: CpuEvaluationTrace | undefined,
): void {
  if (alternative?.type !== "summon" || !alternative.summon) {
    return;
  }
  metrics.badTopSummonAlternative += 1;
  if (alternative.summon.cardId === audit.cardId) {
    metrics.badTopSummonSameCard += 1;
  }
  if (alternative.summon.frontBlocked) {
    metrics.badTopSummonBlocked += 1;
  }
  if (monsterHasBacklineAttackPattern(alternative.summon.cardId)) {
    metrics.badTopSummonBacklinePattern += 1;
  } else {
    metrics.badTopSummonNoBacklinePattern += 1;
  }
}

function addSamples(samples: BacklineSummonSample[], audit: BacklineSummonAudit, maxSamples: number): void {
  for (const kind of sampleKinds(audit)) {
    if (samples.length >= maxSamples || samples.filter((sample) => sample.kind === kind).length >= 5) {
      continue;
    }
    samples.push(formatSample(kind, audit));
  }
}

function sampleKinds(audit: BacklineSummonAudit): string[] {
  const blocked = !!audit.frontBlocker && slotRow(audit.slotKey) === "back";
  if (!blocked) {
    return [];
  }
  const kinds: string[] = [];
  if (!audit.hasBacklinePattern && audit.followup.nextTurnNoWork) {
    kinds.push("blocked_no_pattern_no_work");
    if (audit.alternatives.closeNonSummon) {
      kinds.push("bad_blocked_close_non_summon_alt");
    }
    if (!audit.alternatives.hasTrace) {
      kinds.push("bad_blocked_no_eval_trace");
    }
  }
  if (!audit.hasBacklinePattern && audit.followup.nextTurnMoveForward) {
    kinds.push("blocked_no_pattern_move_forward");
  }
  if (audit.hasBacklinePattern && audit.followup.nextTurnBacklineAttack) {
    kinds.push("blocked_backline_pattern_worked");
  }
  if (audit.role === "front" && audit.hasBacklinePattern) {
    kinds.push("front_role_allowed_by_range");
  }
  if (audit.event.after.players[audit.candidateSeat].stones <= 1 && audit.followup.nextTurnNoWork) {
    kinds.push("low_stone_blocked_no_work");
  }
  return kinds;
}

function formatSample(kind: string, audit: BacklineSummonAudit): BacklineSummonSample {
  return {
    kind,
    variantId: audit.variantId,
    opponentId: audit.opponentId,
    outcome: audit.outcome,
    candidateSeat: audit.candidateSeat,
    seed: audit.event.seed,
    turnNumber: audit.event.turnNumber,
    step: audit.event.step,
    slotKey: audit.slotKey,
    card: audit.cardName,
    role: audit.role,
    frontBlocker: formatSlot(audit.frontBlocker),
    afterStones: audit.event.after.players[audit.candidateSeat].stones,
    score: round(audit.event.score, 1),
    reason: audit.event.reason,
    flags: formatFlags(audit),
    alternatives: formatAlternatives(audit.alternatives),
    handPressure: formatHandPressure(audit.handPressure),
    nextTurn: shortList(audit.followup.nextTurnDecisions),
    board: formatBoard(audit.event.before),
  };
}

function formatFlags(audit: BacklineSummonAudit): string {
  return [
    audit.hasBacklinePattern ? "backline-pattern" : "no-backline-pattern",
    audit.followup.nextTurnAttack ? "next-attack" : undefined,
    audit.followup.nextTurnBacklineAttack ? "next-backline-attack" : undefined,
    audit.followup.nextTurnMoveForward ? "next-move-front" : undefined,
    audit.followup.nextTurnNoWork ? "next-no-work" : undefined,
    audit.event.after.players[audit.candidateSeat].stones <= 1 ? "very-low-stone" : undefined,
    audit.outcome,
  ].filter((value): value is string => !!value).join(", ");
}

function formatAlternatives(alternatives: BacklineAlternativeAudit): string {
  if (!alternatives.hasTrace) {
    return "no-trace";
  }
  return [
    `top=${formatEvaluation(alternatives.topNonSelected)}`,
    `nonSummon=${formatEvaluation(alternatives.bestNonSummon)}`,
    `attack=${formatEvaluation(alternatives.closestAttack)}`,
    `focus=${formatEvaluation(alternatives.closestFocus)}`,
    `end=${formatEvaluation(alternatives.closestEndTurn)}`,
    `move=${formatEvaluation(alternatives.closestMove)}`,
    `frontSummon=${formatEvaluation(alternatives.closestFrontSummon)}`,
    `topSummon=${formatEvaluation(alternatives.topSummon)}`,
  ].join(" / ");
}

function formatHandPressure(pressure: BacklineHandPressureAudit): string {
  if (!pressure.hasHandTrace) {
    return "no-hand-trace";
  }
  return [
    `backWork=${formatHandCards(pressure.otherBacklineWorkCards)}`,
    `noReachFront=${formatHandCards(pressure.otherNoReachFrontMonsters)}`,
    `emptyBack ${pressure.emptyBackSlotsBefore}->${pressure.emptyBackSlotsAfter}`,
    `noReachBackAfter=${pressure.noReachFrontBackSlotsAfter}`,
    pressure.consumesLastBackSlot ? "consumes-last-back-slot" : undefined,
    pressure.leavesNoEmptyBackSlot ? "no-empty-back-slot" : undefined,
  ].filter((value): value is string => !!value).join(" / ");
}

function formatHandCards(cards: readonly HandCardSummary[]): string {
  return cards.length > 0 ? cards.map((card) => card.cardName).join(",") : "-";
}

function formatEvaluation(evaluation: CpuEvaluationTrace | undefined): string {
  if (!evaluation) {
    return "-";
  }
  const summon = evaluation.summon
    ? ` [${evaluation.summon.cardName}->${evaluation.summon.slotKey}${evaluation.summon.frontBlocker ? ` behind ${evaluation.summon.frontBlocker.cardName} HP${evaluation.summon.frontBlocker.hp}` : ""}]`
    : "";
  return `${evaluation.type}:${evaluation.deltaFromSelected >= 0 ? "+" : ""}${round(evaluation.deltaFromSelected, 1)} ${evaluation.decision}${summon}`;
}

function buildNotes(metrics: BacklineSummonMetrics): string[] {
  const notes = [
    "この監査は前衛/後衛ラベルだけではなく、後列から攻撃できるパターンを別扱いにする。",
    "ボムゾウのような射程持ちは `Backline Pattern` 側に入り、今回の抑制候補からは外す。",
  ];
  if (rate(metrics.blockedWithoutBacklinePattern, metrics.blockedBacklineSummons) >= 0.25) {
    notes.push("前が詰まった後列に、後列攻撃パターンを持たないカードを置く例が一定数ある。ここだけを抑える候補は検証価値がある。");
  }
  if (rate(metrics.blockedNextTurnNoWork, metrics.blockedBacklineSummons) >= 0.25) {
    notes.push("詰まり後列召喚が次自ターンの攻撃/前進に変換されない例が多い。召喚の盤面評価だけでなく次ターン仕事予定が必要。");
  }
  if (rate(metrics.blockedWithBacklinePattern, metrics.blockedBacklineSummons) >= 0.4) {
    notes.push("詰まり後列召喚の多くは射程持ちカードでもあるため、一律ペナルティは避けるべき。");
  }
  if (metrics.badBlockedBacklineSummons > 0 && metrics.badWithEvaluationTrace < metrics.badBlockedBacklineSummons) {
    notes.push("一部の bad summon には候補評価traceがない。古い結果ファイルではなく、このスクリプトで再生成した履歴を使う必要がある。");
  }
  if (rate(metrics.badWithCloseNonSummonAlternative, metrics.badBlockedBacklineSummons) >= 0.4) {
    notes.push("bad summon の多くで近い非召喚代替がある。次は召喚ペナルティより、攻撃/ためる/終了との比較条件を詰める価値が高い。");
  }
  if (rate(metrics.badTopSummonSameCard, metrics.badTopSummonAlternative) >= 0.5) {
    notes.push("bad summon の代替召喚が同じカードに寄っている。カード選択より、同カードを左右後列に置く予約召喚そのものを疑うべき。");
  }
  if (rate(metrics.badTopSummonNoBacklinePattern, metrics.badTopSummonAlternative) >= 0.5) {
    notes.push("bad summon の代替召喚も後列射程なしに寄っている。後列で仕事できるカードを優先する召喚候補品質の改善が必要。");
  }
  if (rate(metrics.badConsumesLastBackSlot, metrics.badBlockedBacklineSummons) >= 0.4) {
    notes.push("bad summon が最後の後列空き枠を消費している。後から後衛カードを引いた時の置き場を潰す問題として扱うべき。");
  }
  if (rate(metrics.badWithOtherBacklineWorkInHand, metrics.badBlockedBacklineSummons) >= 0.25) {
    notes.push("bad summon 時点で手札に後列仕事カードが残っている例がある。召喚カード選択の優先順位を疑うべき。");
  }
  return notes;
}

function buildNextLoopProposal(metrics: BacklineSummonMetrics): string[] {
  if (metrics.blockedBacklineSummons === 0) {
    return ["対象seedでは詰まり後列召喚がほぼ出ていないため、games-per-matchupを増やすか、実戦で見たseedに寄せて再監査する。"];
  }
  const steps: string[] = [];
  if (metrics.badBlockedBacklineSummons > 0) {
    if (rate(metrics.badConsumesLastBackSlot, metrics.badBlockedBacklineSummons) >= 0.4) {
      steps.push("次候補は、後列射程なし前衛カードの召喚で最後の後列空き枠を潰す場合に、手札圧迫や前列空き見込みがない限り保留する。");
    } else if (rate(metrics.badWithOtherBacklineWorkInHand, metrics.badBlockedBacklineSummons) >= 0.25) {
      steps.push("次候補は、手札に後列仕事カードがある場合、後列射程なし前衛カードより後列仕事カードの召喚を優先する。");
    } else if (rate(metrics.badTopSummonNoBacklinePattern, metrics.badTopSummonAlternative) >= 0.5) {
      steps.push("次は bad summon 局面で、後列射程なし前衛カード同士の召喚を避け、手札内に後列仕事カードがあるならそちらを優先する候補を作る。");
    } else if (rate(metrics.badWithCloseNonSummonAlternative, metrics.badBlockedBacklineSummons) >= 0.35) {
      steps.push("bad summon で近い非召喚代替が多い場合、召喚そのものを罰するのではなく、低石・仕事予定なし局面で `attack/focus/end_turn` が勝てる条件を実装候補化する。");
    } else {
      steps.push("bad summon の代替が召喚同士に寄る場合、後列仕事なし召喚を抑えるより、召喚先・カード選択の品質を比較する候補へ移る。");
    }
  }
  if (rate(metrics.blockedWithoutBacklinePattern, metrics.blockedBacklineSummons) >= 0.2) {
    steps.push("候補 `whiteBlockedBacklineNoWorkSummonPenalty` は一括スクリーニングだけで判断せず、同一seed比較で勝率と `blocked_no_pattern_no_work` 減少が両立する値だけ中母数確認する。");
  }
  if (rate(metrics.blockedWithBacklinePattern, metrics.blockedBacklineSummons) >= 0.3) {
    steps.push("ボムゾウ等の射程持ちを許容できているか、サンプルで `front_role_allowed_by_range` を確認する。");
  }
  if (rate(metrics.blockedNextTurnMoveForward, metrics.blockedBacklineSummons) >= 0.2) {
    steps.push("次自ターンに前進している例は完全な悪手ではないため、移動で取り返せる局面と行動損が重い局面を分ける。");
  }
  if (steps.length === 0) {
    steps.push("後列召喚単体の問題は小さい可能性があるため、次は召喚後のウェイク/移動/攻撃順とセットで見る。");
  }
  return steps;
}

function formatMarkdown(report: BacklineSummonAuditReport): string {
  return [
    "# White Backline Summon Audit Loop",
    "",
    `生成: ${report.generatedAt}`,
    `seedStart: ${report.seedStart}`,
    `候補: ${report.variants.join(", ")}`,
    `相手: ${report.opponents.join(", ")}`,
    `試行: ${report.gamesPerMatchup} games/matchup/direction`,
    `総試合: ${report.games}`,
    "",
    "## Purpose",
    "",
    "前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。",
    "",
    "## Summary",
    "",
    formatMetricsSummary(report.metrics),
    "",
    "## Variant Metrics",
    "",
    "| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |",
    ...report.byVariant.map(formatVariantRow),
    "",
    "## Opponent Breakdown",
    "",
    "| Variant | Opponent | W-L-D | Blocked | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...report.byVariant.flatMap((variant) => variant.byOpponent.map((opponent) => formatOpponentRow(variant.variantId, opponent))),
    "",
    "## Samples",
    "",
    ...formatSamples(report.samples),
    "",
    "## Notes",
    "",
    ...report.notes.map((note) => `- ${note}`),
    "",
    "## Next Loop Proposal",
    "",
    ...report.nextLoopProposal.map((step) => `- ${step}`),
    "",
    "## Reading",
    "",
    "- `Blocked`: 同レーン前列に自軍ユニットがいる後列召喚。",
    "- `Backline Pattern`: 後列から攻撃しうる射程/攻撃パターンをカードが持つ。ボムゾウ系はここに入る。",
    "- `No Pattern`: 後列から攻撃しにくいカード。ここが多い場合だけ抑制候補にする。",
    "- `No Work`: 次自ターンにその召喚ユニットが攻撃も前進もしなかったケース。",
    "- `Bad`: Blocked + No Pattern + No Work を満たす、今回もっとも疑う後列召喚。",
    "- `Close Non-Summon`: Bad の局面で、選択召喚から35点以内に攻撃/ためる/移動/終了などの非召喚代替があったケース。",
  ].join("\n");
}

function formatMetricsSummary(metrics: BacklineSummonMetrics): string {
  return [
    `- 召喚: ${metrics.summons}`,
    `- 後列召喚: ${metrics.backlineSummons} (${formatPercent(rate(metrics.backlineSummons, metrics.summons))})`,
    `- 前列あり後列召喚: ${metrics.blockedBacklineSummons} (${formatPercent(rate(metrics.blockedBacklineSummons, metrics.backlineSummons))})`,
    `- うち前衛ロール: ${metrics.frontRoleBlockedBacklineSummons} (${formatPercent(rate(metrics.frontRoleBlockedBacklineSummons, metrics.blockedBacklineSummons))})`,
    `- Backline patternあり: ${metrics.blockedWithBacklinePattern} (${formatPercent(rate(metrics.blockedWithBacklinePattern, metrics.blockedBacklineSummons))})`,
    `- Backline patternなし: ${metrics.blockedWithoutBacklinePattern} (${formatPercent(rate(metrics.blockedWithoutBacklinePattern, metrics.blockedBacklineSummons))})`,
    `- 次自ターン攻撃: ${metrics.blockedNextTurnAttack} (${formatPercent(rate(metrics.blockedNextTurnAttack, metrics.blockedBacklineSummons))})`,
    `- 次自ターン後列攻撃: ${metrics.blockedNextTurnBacklineAttack} (${formatPercent(rate(metrics.blockedNextTurnBacklineAttack, metrics.blockedBacklineSummons))})`,
    `- 次自ターン前進: ${metrics.blockedNextTurnMoveForward} (${formatPercent(rate(metrics.blockedNextTurnMoveForward, metrics.blockedBacklineSummons))})`,
    `- 次自ターン仕事なし: ${metrics.blockedNextTurnNoWork} (${formatPercent(rate(metrics.blockedNextTurnNoWork, metrics.blockedBacklineSummons))})`,
    `- Bad blocked summon: ${metrics.badBlockedBacklineSummons} (${formatPercent(rate(metrics.badBlockedBacklineSummons, metrics.blockedBacklineSummons))})`,
    `- Bad with evaluation trace: ${metrics.badWithEvaluationTrace} (${formatPercent(rate(metrics.badWithEvaluationTrace, metrics.badBlockedBacklineSummons))})`,
    `- Bad close non-summon alt: ${metrics.badWithCloseNonSummonAlternative} (${formatPercent(rate(metrics.badWithCloseNonSummonAlternative, metrics.badBlockedBacklineSummons))})`,
    `- Bad top summon alt: ${metrics.badTopSummonAlternative} (${formatPercent(rate(metrics.badTopSummonAlternative, metrics.badBlockedBacklineSummons))})`,
    `- Bad top summon same card: ${metrics.badTopSummonSameCard} (${formatPercent(rate(metrics.badTopSummonSameCard, metrics.badTopSummonAlternative))})`,
    `- Bad top summon backline pattern: ${metrics.badTopSummonBacklinePattern} (${formatPercent(rate(metrics.badTopSummonBacklinePattern, metrics.badTopSummonAlternative))})`,
    `- Bad with other backline work in hand: ${metrics.badWithOtherBacklineWorkInHand} (${formatPercent(rate(metrics.badWithOtherBacklineWorkInHand, metrics.badBlockedBacklineSummons))})`,
    `- Bad consumes last back slot: ${metrics.badConsumesLastBackSlot} (${formatPercent(rate(metrics.badConsumesLastBackSlot, metrics.badBlockedBacklineSummons))})`,
    `- Bad leaves no empty back slot: ${metrics.badLeavesNoEmptyBackSlot} (${formatPercent(rate(metrics.badLeavesNoEmptyBackSlot, metrics.badBlockedBacklineSummons))})`,
    `- Avg no-reach front cards in back after bad: ${round(rate(metrics.badNoReachFrontBackSlotsAfterTotal, metrics.badBlockedBacklineSummons), 2)}`,
  ].join("\n");
}

function formatVariantRow(audit: VariantBacklineSummonAudit): string {
  const m = audit.metrics;
  return [
    escapeMarkdownTableCell(audit.variantId),
    `${audit.wins}-${audit.losses}-${audit.draws}`,
    m.summons,
    formatCountRate(m.backlineSummons, m.summons),
    formatCountRate(m.blockedBacklineSummons, m.backlineSummons),
    formatCountRate(m.frontRoleBlockedBacklineSummons, m.blockedBacklineSummons),
    formatCountRate(m.blockedWithBacklinePattern, m.blockedBacklineSummons),
    formatCountRate(m.blockedWithoutBacklinePattern, m.blockedBacklineSummons),
    formatCountRate(m.blockedNextTurnAttack, m.blockedBacklineSummons),
    formatCountRate(m.blockedNextTurnBacklineAttack, m.blockedBacklineSummons),
    formatCountRate(m.blockedNextTurnMoveForward, m.blockedBacklineSummons),
    formatCountRate(m.blockedNextTurnNoWork, m.blockedBacklineSummons),
    formatCountRate(m.badBlockedBacklineSummons, m.blockedBacklineSummons),
    formatCountRate(m.badWithCloseNonSummonAlternative, m.badBlockedBacklineSummons),
    formatTopAlternativeBreakdown(m),
    formatCountRate(m.blockedLowStoneAfterSummon, m.blockedBacklineSummons),
    `${m.blockedWins}/${m.blockedLosses}`,
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatOpponentRow(variantId: string, audit: OpponentBacklineSummonAudit): string {
  const m = audit.metrics;
  return [
    escapeMarkdownTableCell(variantId),
    escapeMarkdownTableCell(audit.opponentId),
    `${audit.wins}-${audit.losses}-${audit.draws}`,
    m.blockedBacklineSummons,
    formatCountRate(m.blockedWithBacklinePattern, m.blockedBacklineSummons),
    formatCountRate(m.blockedWithoutBacklinePattern, m.blockedBacklineSummons),
    formatCountRate(m.blockedNextTurnNoWork, m.blockedBacklineSummons),
    formatCountRate(m.badBlockedBacklineSummons, m.blockedBacklineSummons),
    formatCountRate(m.badWithCloseNonSummonAlternative, m.badBlockedBacklineSummons),
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatSamples(samples: readonly BacklineSummonSample[]): string[] {
  if (samples.length === 0) {
    return ["該当サンプルなし。"];
  }
  return samples.flatMap((sample) => [
    `### ${sample.kind}: ${sample.card} seed ${sample.seed} turn ${sample.turnNumber}`,
    "",
    `- variant/opponent: \`${sample.variantId}\` vs \`${sample.opponentId}\` (${sample.candidateSeat}, ${sample.outcome})`,
    `- decision: ${sample.slotKey} / role ${sample.role} / front ${sample.frontBlocker} / stones after ${sample.afterStones} / score ${sample.score}`,
    `- flags: ${sample.flags}`,
    `- alternatives: ${sample.alternatives}`,
    `- hand pressure: ${sample.handPressure}`,
    `- next turn: ${sample.nextTurn}`,
    `- reason: ${sample.reason}`,
    `- board: ${sample.board}`,
    "",
  ]);
}

function emptyMetrics(): BacklineSummonMetrics {
  return {
    summons: 0,
    backlineSummons: 0,
    blockedBacklineSummons: 0,
    frontRoleBlockedBacklineSummons: 0,
    blockedWithBacklinePattern: 0,
    blockedWithoutBacklinePattern: 0,
    blockedWithImmediateWakeWork: 0,
    blockedNextTurnAttack: 0,
    blockedNextTurnBacklineAttack: 0,
    blockedNextTurnMoveForward: 0,
    blockedNextTurnNoWork: 0,
    blockedLowStoneAfterSummon: 0,
    blockedVeryLowStoneAfterSummon: 0,
    blockedLosses: 0,
    blockedWins: 0,
    badBlockedBacklineSummons: 0,
    badWithEvaluationTrace: 0,
    badWithCloseNonSummonAlternative: 0,
    badTopAlternativeAttack: 0,
    badTopAlternativeFocus: 0,
    badTopAlternativeEndTurn: 0,
    badTopAlternativeMove: 0,
    badTopAlternativeFrontSummon: 0,
    badTopAlternativeOtherSummon: 0,
    badTopSummonAlternative: 0,
    badTopSummonSameCard: 0,
    badTopSummonBlocked: 0,
    badTopSummonBacklinePattern: 0,
    badTopSummonNoBacklinePattern: 0,
    badWithOtherBacklineWorkInHand: 0,
    badConsumesLastBackSlot: 0,
    badLeavesNoEmptyBackSlot: 0,
    badOtherBacklineWorkCardsInHandTotal: 0,
    badNoReachFrontBackSlotsAfterTotal: 0,
  };
}

function outcomeFor(winner: PlayerId | undefined, candidateSeat: PlayerId): Outcome {
  if (winner === undefined) {
    return "draw";
  }
  return winner === candidateSeat ? "win" : "loss";
}

function addOutcome(record: { wins: number; losses: number; draws: number }, outcome: Outcome): void {
  if (outcome === "win") {
    record.wins += 1;
  } else if (outcome === "loss") {
    record.losses += 1;
  } else {
    record.draws += 1;
  }
}

function nextOwnTurnWindowAfter(
  history: readonly MasterLabDecisionEvent[],
  eventIndex: number,
  candidateSeat: PlayerId,
): { startIndex: number; endIndex: number } | undefined {
  const event = history[eventIndex];
  if (!event) {
    return undefined;
  }
  const startIndex = history.findIndex((candidate, index) =>
    index > eventIndex &&
    candidate.player === candidateSeat &&
    candidate.turnNumber > event.turnNumber,
  );
  if (startIndex < 0) {
    return undefined;
  }
  const turnNumber = history[startIndex].turnNumber;
  const endIndex = history.findIndex((candidate, index) =>
    index > startIndex &&
    (candidate.player !== candidateSeat || candidate.turnNumber !== turnNumber),
  );
  return { startIndex, endIndex: endIndex < 0 ? history.length : endIndex };
}

function summonSlotKeyForDecision(decision: string): SlotKey | undefined {
  if (!decision.startsWith("summon:")) {
    return undefined;
  }
  const slotKey = decision.split("->")[1];
  return isSlotKey(slotKey) ? slotKey : undefined;
}

function summonHandInstanceIdForDecision(decision: string): string | undefined {
  if (!decision.startsWith("summon:")) {
    return undefined;
  }
  return decision.slice("summon:".length).split("->")[0] || undefined;
}

function summonTargetRow(decision: string): "front" | "back" | undefined {
  const slotKey = summonSlotKeyForDecision(decision);
  return slotKey ? slotRow(slotKey) : undefined;
}

function attackForDecision(decision: string): { actor: string } | undefined {
  if (!decision.startsWith("attack:")) {
    return undefined;
  }
  const actor = decision.split(":")[1];
  return actor ? { actor } : undefined;
}

function moveForDecision(decision: string): { from: string; to: string } | undefined {
  if (!decision.startsWith("move:")) {
    return undefined;
  }
  const [from, to] = decision.slice("move:".length).split("->");
  return from && to ? { from, to } : undefined;
}

function slotBelongsToCard(
  summary: MasterLabGameStateSummary,
  slotKey: string,
  cardId: string,
  owner: PlayerId,
): boolean {
  const slot = slotByKey(summary, slotKey);
  return slot?.owner === owner && slot.card === cardId;
}

function slotByKey(summary: MasterLabGameStateSummary, slotKey: string): SummarySlot | undefined {
  return summary.slots.find((slot) => slot.slotKey === slotKey);
}

function emptyBackSlotCount(summary: MasterLabGameStateSummary, playerId: PlayerId): number {
  return summary.slots.filter((slot) =>
    slot.owner !== "cpu" &&
    slot.owner !== "player" &&
    slot.slotKey.startsWith(`${playerId}_back_`),
  ).length;
}

function noReachFrontBackSlotCount(summary: MasterLabGameStateSummary, playerId: PlayerId): number {
  return summary.slots.filter((slot) =>
    slot.owner === playerId &&
    slot.card &&
    slotRow(slot.slotKey) === "back" &&
    safeMonsterRole(slot.card) === "front" &&
    !monsterHasBacklineAttackPattern(slot.card),
  ).length;
}

function frontSlotKeyFor(slotKey: SlotKey): SlotKey {
  const [owner, , lane] = slotKey.split("_") as [PlayerId, "back", "left" | "right"];
  return `${owner}_front_${lane}`;
}

function slotRow(slotKey: string): "front" | "back" {
  return slotKey.includes("_front_") ? "front" : "back";
}

function isSlotKey(value: string | undefined): value is SlotKey {
  return value === "player_front_left" ||
    value === "player_front_right" ||
    value === "player_back_left" ||
    value === "player_back_right" ||
    value === "cpu_front_left" ||
    value === "cpu_front_right" ||
    value === "cpu_back_left" ||
    value === "cpu_back_right";
}

function monsterHasBacklineAttackPattern(cardId: string): boolean {
  const def = getMonsterDef(cardId);
  return def.levels.some((level) => level.commands.some(commandHasBacklineAttackPattern));
}

function commandHasBacklineAttackPattern(command: CommandDef): boolean {
  if (!command.implemented || command.power <= 0) {
    return false;
  }
  if (command.rangeText === "前衛攻撃" || command.rangeText === "後衛攻撃" || command.rangeText === "桂馬飛び") {
    return true;
  }
  return [
    "one_skip",
    "two_skip",
    "straight",
    "piercing",
    "decreasing_straight",
    "line",
    "any_monster",
    "any_target",
    "master",
  ].includes(command.range);
}

function safeCardName(cardId: string): string {
  try {
    return getCardName(cardId);
  } catch {
    return cardId;
  }
}

function safeMonsterRole(cardId: string): string {
  try {
    return getMonsterAiTrait(cardId).role;
  } catch {
    return "unknown";
  }
}

function formatSlot(slot: SummarySlot | undefined): string {
  if (!slot?.card) {
    return "-";
  }
  return `${safeCardName(slot.card)} Lv${slot.level ?? "?"} HP${slot.hp ?? "?"}${slot.status === "prepared" ? " prep" : ""}`;
}

function formatBoard(summary: MasterLabGameStateSummary): string {
  return summary.slots
    .filter((slot) => slot.card)
    .map((slot) => {
      const owner = slot.owner === "player" ? "P" : "C";
      const row = slotRow(slot.slotKey) === "front" ? "F" : "B";
      return `${owner}${row}:${formatSlot(slot)}`;
    })
    .join(" / ") || "-";
}

function formatTopAlternativeBreakdown(metrics: BacklineSummonMetrics): string {
  return [
    metrics.badTopAlternativeAttack > 0 ? `Atk${metrics.badTopAlternativeAttack}` : undefined,
    metrics.badTopAlternativeFocus > 0 ? `Focus${metrics.badTopAlternativeFocus}` : undefined,
    metrics.badTopAlternativeEndTurn > 0 ? `End${metrics.badTopAlternativeEndTurn}` : undefined,
    metrics.badTopAlternativeMove > 0 ? `Move${metrics.badTopAlternativeMove}` : undefined,
    metrics.badTopAlternativeFrontSummon > 0 ? `FrontSum${metrics.badTopAlternativeFrontSummon}` : undefined,
    metrics.badTopAlternativeOtherSummon > 0 ? `OtherSum${metrics.badTopAlternativeOtherSummon}` : undefined,
    metrics.badTopSummonSameCard > 0 ? `SameCard${metrics.badTopSummonSameCard}` : undefined,
    metrics.badTopSummonBacklinePattern > 0 ? `ReachSum${metrics.badTopSummonBacklinePattern}` : undefined,
    metrics.badTopSummonNoBacklinePattern > 0 ? `NoReachSum${metrics.badTopSummonNoBacklinePattern}` : undefined,
    metrics.badWithOtherBacklineWorkInHand > 0 ? `HandReach${metrics.badWithOtherBacklineWorkInHand}` : undefined,
    metrics.badConsumesLastBackSlot > 0 ? `LastBack${metrics.badConsumesLastBackSlot}` : undefined,
    metrics.badLeavesNoEmptyBackSlot > 0 ? `NoEmptyBack${metrics.badLeavesNoEmptyBackSlot}` : undefined,
  ].filter((value): value is string => !!value).join(", ") || "-";
}

function shortList(values: readonly string[], limit = 4): string {
  if (values.length === 0) {
    return "-";
  }
  const shown = values.slice(0, limit).join(" / ");
  return values.length > limit ? `${shown} / ...` : shown;
}

function formatCountRate(count: number, total: number): string {
  return `${count} (${formatPercent(rate(count, total))})`;
}

function rate(count: number, total: number): number {
  return total > 0 ? count / total : 0;
}

function parseArgs(args: string[]): CliOptions {
  const variantIds: string[] = [];
  const opponentIds: string[] = [];
  const parsed: CliOptions = {
    gamesPerMatchup: 1,
    seedStart: 136400,
    maxSteps: 700,
    maxTurns: 160,
    maxSamples: 36,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--games-per-matchup") {
      parsed.gamesPerMatchup = readInteger(arg, next);
      i += 1;
    } else if (arg === "--seed-start") {
      parsed.seedStart = readInteger(arg, next);
      i += 1;
    } else if (arg === "--variant") {
      variantIds.push(readString(arg, next));
      i += 1;
    } else if (arg === "--opponent") {
      opponentIds.push(readString(arg, next));
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readInteger(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readInteger(arg, next);
      i += 1;
    } else if (arg === "--max-samples") {
      parsed.maxSamples = readInteger(arg, next);
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

  parsed.variants = resolveByIds(ALL_VARIANTS, variantIds.length > 0 ? variantIds : [...DEFAULT_VARIANT_IDS], "variant");
  parsed.opponents = resolveByIds(ALL_OPPONENTS, opponentIds.length > 0 ? opponentIds : [...DEFAULT_OPPONENT_IDS], "opponent");
  return parsed;
}

function resolveByIds<T extends { id: string }>(items: readonly T[], ids: readonly string[], label: string): T[] {
  return ids.map((id) => {
    const item = items.find((candidate) => candidate.id === id);
    if (!item) {
      throw new Error(`Unknown ${label}: ${id}`);
    }
    return item;
  });
}

function printHelp(): void {
  console.log(`
Usage:
  npm run lab:masters:white-backline-summon-audit -- [options]

Options:
  --variant <id>                Variant id. Repeatable.
  --opponent <id>               Opponent id. Repeatable.
  --games-per-matchup <n>       Games per matchup/direction. Default: 1
  --seed-start <n>              First seed. Default: 136400
  --max-steps <n>               Step cap. Default: 700
  --max-turns <n>               Turn cap. Default: 160
  --max-samples <n>             Maximum samples in report. Default: 36
  --markdown <path>             Write markdown report.
  --json <path>                 Write JSON report.
`);
}
