import { getCardName, getMonsterDef } from "../src/game/cards";
import { createCurrentWhiteAiVariant, CURRENT_WHITE_AI_MIRROR_OPPONENT } from "../src/game/currentWhiteAiFixtures";
import type {
  MasterLabCpuDecisionEvaluation,
  MasterLabDecisionEvent,
  MasterLabGameStateSummary,
} from "../src/game/masterLabAutoPlay";
import { runWhiteAiTuningLoop, type WhiteAiTuningLoopOptions, type WhiteAiTuningVariant } from "../src/game/whiteAiTuningLoop";
import type { CommandDef, PlayerId, SlotKey } from "../src/game/types";
import { escapeMarkdownTableCell, formatPercent, readInteger, readString, round, writeReport } from "./lib/cli";

type SummarySlot = MasterLabGameStateSummary["slots"][number];

type BadActionKind =
  | "summon_no_work_no_attack_punished"
  | "blocked_backline_summon"
  | "last_back_slot_summon"
  | "low_stone_summon"
  | "low_stone_focus_no_work_punished"
  | "low_stone_focus"
  | "non_kill_monster_attack"
  | "non_lethal_face_attack";

type AlternativeKind =
  | "attack_first"
  | "wake_first"
  | "focus_only"
  | "summon_skip"
  | "summon_different_slot"
  | "summon_other";

interface CliOptions extends WhiteAiTuningLoopOptions {
  markdownPath?: string;
  jsonPath?: string;
  maxSamples: number;
  variantId: string;
  traceMode: "none" | "blocked-backline" | "focus-summon" | "bad-action";
}

interface DecisionAlternativeAuditReport {
  generatedAt: string;
  variantId: string;
  variantLabel: string;
  traceMode: CliOptions["traceMode"];
  gamesPerMatchup: number;
  seedStart: number;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  metrics: DecisionAlternativeMetrics;
  badActionBuckets: Record<BadActionKind, BadActionBucket>;
  alternativeBuckets: Record<AlternativeKind, AlternativeBucket>;
  samples: DecisionAlternativeSample[];
  conclusion: string[];
  nextLoopProposal: string[];
}

interface DecisionAlternativeMetrics {
  turns: number;
  decisionEvents: number;
  tracedDecisionEvents: number;
  flaggedEvents: number;
  lowStoneFlaggedEvents: number;
  punishedFlaggedEvents: number;
  closeBestAlternative: number;
  betterOrEqualBestAlternative: number;
  averageBestAlternativeDelta: number;
  bestAlternativeDelta: number;
  missingEvaluationTrace: number;
}

interface BadActionBucket {
  count: number;
  lowStone: number;
  punished: number;
  closeBestAlternative: number;
  betterOrEqualBestAlternative: number;
  averageBestAlternativeDelta: number;
  bestAlternativeKinds: Partial<Record<AlternativeKind, number>>;
}

interface AlternativeBucket {
  available: number;
  close: number;
  betterOrEqual: number;
  averageDelta: number;
  bestDelta: number;
}

interface DecisionAlternativeSample {
  primaryKind: BadActionKind;
  flags: BadActionKind[];
  seed: number;
  seat: PlayerId;
  turnNumber: number;
  step: number;
  finalStones: number;
  punished: boolean;
  ownBoardSwing: number;
  hpSwing: number;
  selectedDecision: string;
  selectedScore: number;
  bestAlternative: string;
  bestAlternativeKind?: AlternativeKind;
  bestAlternativeDelta?: number;
  alternatives: string;
  handoff: string;
  selectedDetails: string;
  opponentResponse: string;
  nextOwnDecisions: string;
}

interface TurnRecord {
  seed: number;
  seat: PlayerId;
  turnNumber: number;
  events: MasterLabDecisionEvent[];
  opponentEvents: MasterLabDecisionEvent[];
  nextOwnEvents: MasterLabDecisionEvent[];
  handoff: MasterLabGameStateSummary;
  nextOwnTurn?: MasterLabGameStateSummary;
}

interface TurnAnalysis {
  finalStones: number;
  lowStone: boolean;
  punished: boolean;
  ownBoardSwing: number;
  hpSwing: number;
  ownLost: number;
  opponentLevelGain: number;
}

interface SelectedDecisionAnalysis {
  flags: BadActionKind[];
  details: string;
}

interface AlternativeSummary {
  kind: AlternativeKind;
  decision: string;
  totalScore: number;
  deltaFromSelected: number;
  reason: string;
}

const BAD_ACTION_KINDS: readonly BadActionKind[] = [
  "summon_no_work_no_attack_punished",
  "blocked_backline_summon",
  "last_back_slot_summon",
  "low_stone_summon",
  "low_stone_focus_no_work_punished",
  "low_stone_focus",
  "non_kill_monster_attack",
  "non_lethal_face_attack",
];

const ALTERNATIVE_KINDS: readonly AlternativeKind[] = [
  "attack_first",
  "wake_first",
  "focus_only",
  "summon_skip",
  "summon_different_slot",
  "summon_other",
];

const CLOSE_ALTERNATIVE_DELTA = -24;

const options = parseArgs(process.argv.slice(2));
const report = runAudit(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
}

console.log(`White mirror decision alternative audit: ${report.variantId}, ${report.games} games`);
console.log(
  `flagged ${report.metrics.flaggedEvents}/${report.metrics.decisionEvents}, ` +
    `closeAlt ${report.metrics.closeBestAlternative}, ` +
    `avgBestDelta ${report.metrics.averageBestAlternativeDelta}`,
);
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runAudit(options: CliOptions): DecisionAlternativeAuditReport {
  const variant = auditVariantFor(options.variantId);
  const loopReport = runWhiteAiTuningLoop({
    ...options,
    variants: [variant],
    opponents: [CURRENT_WHITE_AI_MIRROR_OPPONENT],
    includeGameHistory: true,
    includeCpuDecisionEvaluations: cpuDecisionTraceModeFor(options.traceMode),
  });

  const metrics = emptyMetrics();
  const samples: DecisionAlternativeSample[] = [];
  const badActionAccumulators = new Map<BadActionKind, { bucket: BadActionBucket; deltas: number[] }>();
  const alternativeAccumulators = new Map<AlternativeKind, { bucket: AlternativeBucket; deltas: number[] }>();
  const bestAlternativeDeltas: number[] = [];
  let games = 0;
  let wins = 0;
  let losses = 0;
  let draws = 0;

  for (const run of loopReport.runs) {
    for (const game of run.result.games) {
      games += 1;
      if (game.winner === run.candidateSeat) {
        wins += 1;
      } else if (game.winner) {
        losses += 1;
      } else {
        draws += 1;
      }

      for (const turn of buildTurnRecords(game.history ?? [], run.candidateSeat)) {
        metrics.turns += 1;
        const turnAnalysis = analyzeTurn(turn);
        for (const event of turn.events) {
          metrics.decisionEvents += 1;
          if (event.cpuDecisionEvaluations?.length) {
            metrics.tracedDecisionEvents += 1;
          } else {
            metrics.missingEvaluationTrace += 1;
          }

          const selected = analyzeSelectedDecision(turn, turnAnalysis, event);
          if (selected.flags.length === 0) {
            continue;
          }

          metrics.flaggedEvents += 1;
          if (turnAnalysis.lowStone) {
            metrics.lowStoneFlaggedEvents += 1;
          }
          if (turnAnalysis.punished) {
            metrics.punishedFlaggedEvents += 1;
          }

          const alternatives = summarizeAlternatives(event);
          for (const alternative of Object.values(alternatives)) {
            if (!alternative) {
              continue;
            }
            const accumulator = alternativeAccumulator(alternativeAccumulators, alternative.kind);
            accumulator.bucket.available += 1;
            accumulator.deltas.push(alternative.deltaFromSelected);
            accumulator.bucket.bestDelta = Math.max(accumulator.bucket.bestDelta, alternative.deltaFromSelected);
            if (alternative.deltaFromSelected >= CLOSE_ALTERNATIVE_DELTA) {
              accumulator.bucket.close += 1;
            }
            if (alternative.deltaFromSelected >= 0) {
              accumulator.bucket.betterOrEqual += 1;
            }
          }

          const bestAlternative = bestAvailableAlternative(alternatives);
          if (bestAlternative) {
            bestAlternativeDeltas.push(bestAlternative.deltaFromSelected);
            if (bestAlternative.deltaFromSelected >= CLOSE_ALTERNATIVE_DELTA) {
              metrics.closeBestAlternative += 1;
            }
            if (bestAlternative.deltaFromSelected >= 0) {
              metrics.betterOrEqualBestAlternative += 1;
            }
          }

          for (const flag of selected.flags) {
            const accumulator = badActionAccumulator(badActionAccumulators, flag);
            accumulator.bucket.count += 1;
            if (turnAnalysis.lowStone) {
              accumulator.bucket.lowStone += 1;
            }
            if (turnAnalysis.punished) {
              accumulator.bucket.punished += 1;
            }
            if (bestAlternative) {
              accumulator.deltas.push(bestAlternative.deltaFromSelected);
              if (bestAlternative.deltaFromSelected >= CLOSE_ALTERNATIVE_DELTA) {
                accumulator.bucket.closeBestAlternative += 1;
              }
              if (bestAlternative.deltaFromSelected >= 0) {
                accumulator.bucket.betterOrEqualBestAlternative += 1;
              }
              accumulator.bucket.bestAlternativeKinds[bestAlternative.kind] =
                (accumulator.bucket.bestAlternativeKinds[bestAlternative.kind] ?? 0) + 1;
            }
          }

          if (samples.length < options.maxSamples) {
            samples.push(sampleForEvent(turn, turnAnalysis, event, selected, alternatives, bestAlternative));
          }
        }
      }
    }
  }

  metrics.averageBestAlternativeDelta = round(average(bestAlternativeDeltas), 1);
  metrics.bestAlternativeDelta = round(Math.max(...bestAlternativeDeltas, Number.NEGATIVE_INFINITY), 1);

  const badActionBuckets = finalizeBadActionBuckets(badActionAccumulators);
  const alternativeBuckets = finalizeAlternativeBuckets(alternativeAccumulators);

  return {
    generatedAt: loopReport.generatedAt,
    variantId: variant.id,
    variantLabel: variant.label,
    traceMode: options.traceMode,
    gamesPerMatchup: loopReport.gamesPerMatchup,
    seedStart: options.seedStart ?? 0,
    games,
    wins,
    losses,
    draws,
    metrics,
    badActionBuckets,
    alternativeBuckets,
    samples,
    conclusion: buildConclusion(metrics, badActionBuckets, alternativeBuckets),
    nextLoopProposal: buildNextLoopProposal(badActionBuckets, alternativeBuckets),
  };
}

function cpuDecisionTraceModeFor(
  mode: CliOptions["traceMode"],
): WhiteAiTuningLoopOptions["includeCpuDecisionEvaluations"] {
  switch (mode) {
    case "none":
      return false;
    case "blocked-backline":
      return "selected_blocked_backline_summon";
    case "focus-summon":
      return "selected_focus_summon";
    case "bad-action":
      return "selected_white_mirror_bad_action";
  }
}

function auditVariantFor(id: string): WhiteAiTuningVariant {
  switch (id) {
    case "current_white_baseline":
      return createCurrentWhiteAiVariant(
        "current_white_baseline",
        "現行: 暫定白最強 / white",
        undefined,
        "白ミラーでbad actionの代替候補評価を監査する。",
      );
    default:
      throw new Error(`Unknown audit variant: ${id}`);
  }
}

function analyzeSelectedDecision(
  turn: TurnRecord,
  turnAnalysis: TurnAnalysis,
  event: MasterLabDecisionEvent,
): SelectedDecisionAnalysis {
  const flags: BadActionKind[] = [];
  const details: string[] = [];

  if (event.decision.startsWith("focus:")) {
    const slotKey = focusSlotKeyForDecision(event.decision);
    const slot = slotKey ? slotSummary(event.after, slotKey) : undefined;
    const worked = slotKey && slot?.card && slot.owner === turn.seat
      ? didTrackedCardWorkNextTurn(turn.nextOwnEvents, turn.seat, slotKey, slot.card)
      : { worked: false, moved: false };
    if (turnAnalysis.lowStone) {
      flags.push("low_stone_focus");
    }
    if (turnAnalysis.lowStone && turnAnalysis.punished && !worked.worked && !worked.moved) {
      flags.push("low_stone_focus_no_work_punished");
    }
    details.push(`focusSlot=${slotKey ?? "-"}`, `workedNext=${worked.worked}`, `movedNext=${worked.moved}`);
  }

  if (event.decision.startsWith("summon:")) {
    const summon = analyzeSummonEvent(turn, event);
    if (turnAnalysis.lowStone) {
      flags.push("low_stone_summon");
    }
    if (summon.backBlockedNoPattern) {
      flags.push("blocked_backline_summon");
    }
    if (summon.fillsLastBackSlot) {
      flags.push("last_back_slot_summon");
    }
    if (turnAnalysis.lowStone && turnAnalysis.punished && summon.noNextWork && !summon.attackedByOpponent) {
      flags.push("summon_no_work_no_attack_punished");
    }
    details.push(
      `summon=${summon.cardName}`,
      `slot=${summon.slotKey ?? "-"}`,
      `row=${summon.row ?? "-"}`,
      `role=${summon.role ?? "-"}`,
      `blockedNoPattern=${summon.backBlockedNoPattern}`,
      `sameTurnWork=${summon.sameTurnWork}`,
      `workedNext=${summon.workedNextTurn}`,
      `movedNext=${summon.movedNextTurn}`,
      `attacked=${summon.attackedByOpponent}`,
      `lastBack=${summon.fillsLastBackSlot}`,
    );
  }

  if (event.decision.startsWith("attack:")) {
    const monsterTarget = attackTargetSlotKey(event.decision);
    const faceTarget = attackTargetMaster(event.decision);
    if (monsterTarget) {
      const beforeTarget = slotSummary(event.before, monsterTarget);
      const afterTarget = slotSummary(event.after, monsterTarget);
      const nonKill = !!beforeTarget?.card && beforeTarget.owner !== turn.seat && afterTarget?.card === beforeTarget.card && afterTarget.owner === beforeTarget.owner;
      if (nonKill) {
        flags.push("non_kill_monster_attack");
      }
      details.push(
        `attackTarget=${monsterTarget}`,
        `before=${beforeTarget?.card ? `${safeCardName(beforeTarget.card)} HP${beforeTarget.hp}` : "-"}`,
        `after=${afterTarget?.card ? `${safeCardName(afterTarget.card)} HP${afterTarget.hp}` : "-"}`,
        `nonKill=${nonKill}`,
      );
    }
    if (faceTarget && faceTarget !== turn.seat && !event.after.winner) {
      flags.push("non_lethal_face_attack");
      details.push(`faceTarget=${faceTarget}`, `enemyFronts=${enemyFrontMonsterCount(event.before, turn.seat)}`);
    }
  }

  return {
    flags: sortBadActionFlags([...new Set(flags)]),
    details: details.join(", "),
  };
}

function summarizeAlternatives(event: MasterLabDecisionEvent): Partial<Record<AlternativeKind, AlternativeSummary>> {
  const selectedScore = selectedScoreForEvent(event);
  const selectedSummon = event.decision.startsWith("summon:")
    ? {
        instanceId: summonHandInstanceIdForDecision(event.decision),
        slotKey: summonSlotKeyForDecision(event.decision),
      }
    : undefined;
  const summaries: Partial<Record<AlternativeKind, AlternativeSummary>> = {};

  if (!event.cpuDecisionEvaluations?.length) {
    return summarizeReasonAlternatives(event.reason, selectedScore);
  }

  for (const evaluation of event.cpuDecisionEvaluations ?? []) {
    if (evaluation.selected) {
      continue;
    }
    const kind = alternativeKindForEvaluation(evaluation, selectedSummon);
    if (!kind) {
      continue;
    }
    const summary: AlternativeSummary = {
      kind,
      decision: evaluation.decision,
      totalScore: evaluation.totalScore,
      deltaFromSelected: round(evaluation.totalScore - selectedScore, 1),
      reason: evaluation.reason,
    };
    const current = summaries[kind];
    if (!current || summary.deltaFromSelected > current.deltaFromSelected) {
      summaries[kind] = summary;
    }
  }

  return summaries;
}

function summarizeReasonAlternatives(
  reason: string,
  selectedScore: number,
): Partial<Record<AlternativeKind, AlternativeSummary>> {
  const summaries: Partial<Record<AlternativeKind, AlternativeSummary>> = {};
  const rejected = reason.split("見送り: ")[1];
  if (!rejected) {
    return summaries;
  }
  for (const part of rejected.split("、")) {
    const match = /^(攻撃|マスター特技|召喚|ためる)は(\d+)点差で見送り/.exec(part.trim());
    if (!match) {
      continue;
    }
    const kind = alternativeKindForReasonLabel(match[1]);
    if (!kind) {
      continue;
    }
    const delta = -readReasonDelta(match[2]);
    const summary: AlternativeSummary = {
      kind,
      decision: `${match[1]}(reason-trace)`,
      totalScore: round(selectedScore + delta, 1),
      deltaFromSelected: delta,
      reason: part.trim(),
    };
    const current = summaries[kind];
    if (!current || summary.deltaFromSelected > current.deltaFromSelected) {
      summaries[kind] = summary;
    }
  }
  return summaries;
}

function alternativeKindForReasonLabel(label: string): AlternativeKind | undefined {
  if (label === "攻撃") {
    return "attack_first";
  }
  if (label === "マスター特技") {
    return "wake_first";
  }
  if (label === "ためる") {
    return "focus_only";
  }
  if (label === "召喚") {
    return "summon_other";
  }
  return undefined;
}

function readReasonDelta(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function alternativeKindForEvaluation(
  evaluation: MasterLabCpuDecisionEvaluation,
  selectedSummon: { instanceId?: string; slotKey?: SlotKey } | undefined,
): AlternativeKind | undefined {
  if (evaluation.type === "attack" && evaluation.decision.includes("->monster:")) {
    return "attack_first";
  }
  if (evaluation.type === "master_action" && evaluation.decision.startsWith("master:wake_up->")) {
    return "wake_first";
  }
  if (evaluation.type === "focus") {
    return "focus_only";
  }
  if (evaluation.type === "end_turn") {
    return "summon_skip";
  }
  if (evaluation.type === "summon") {
    if (
      selectedSummon?.instanceId &&
      evaluation.summon?.handInstanceId === selectedSummon.instanceId &&
      evaluation.summon.slotKey !== selectedSummon.slotKey
    ) {
      return "summon_different_slot";
    }
    return "summon_other";
  }
  return undefined;
}

function bestAvailableAlternative(alternatives: Partial<Record<AlternativeKind, AlternativeSummary>>): AlternativeSummary | undefined {
  return Object.values(alternatives)
    .filter((alternative): alternative is AlternativeSummary => !!alternative)
    .sort((a, b) => b.deltaFromSelected - a.deltaFromSelected || alternativeKindPriority(a.kind) - alternativeKindPriority(b.kind))[0];
}

function sampleForEvent(
  turn: TurnRecord,
  turnAnalysis: TurnAnalysis,
  event: MasterLabDecisionEvent,
  selected: SelectedDecisionAnalysis,
  alternatives: Partial<Record<AlternativeKind, AlternativeSummary>>,
  bestAlternative: AlternativeSummary | undefined,
): DecisionAlternativeSample {
  return {
    primaryKind: selected.flags[0],
    flags: selected.flags,
    seed: turn.seed,
    seat: turn.seat,
    turnNumber: turn.turnNumber,
    step: event.step,
    finalStones: turnAnalysis.finalStones,
    punished: turnAnalysis.punished,
    ownBoardSwing: round(turnAnalysis.ownBoardSwing, 1),
    hpSwing: turnAnalysis.hpSwing,
    selectedDecision: event.decision,
    selectedScore: round(selectedScoreForEvent(event), 1),
    bestAlternative: bestAlternative ? `${bestAlternative.kind}:${bestAlternative.decision}` : "-",
    ...(bestAlternative
      ? {
          bestAlternativeKind: bestAlternative.kind,
          bestAlternativeDelta: bestAlternative.deltaFromSelected,
        }
      : {}),
    alternatives: formatAlternatives(alternatives),
    handoff: stateLine(turn.handoff, turn.seat),
    selectedDetails: selected.details,
    opponentResponse: turn.opponentEvents.slice(0, 8).map((candidate) => `${candidate.decision} [${round(candidate.score, 1)}]`).join(" -> ") || "-",
    nextOwnDecisions: turn.nextOwnEvents.slice(0, 8).map((candidate) => `${candidate.decision} [${round(candidate.score, 1)}]`).join(" -> ") || "-",
  };
}

function buildTurnRecords(history: readonly MasterLabDecisionEvent[], seat: PlayerId): TurnRecord[] {
  const records: TurnRecord[] = [];
  const candidateEvents = history.filter((event) => event.player === seat && event.source === "cpu");
  const byTurn = new Map<number, MasterLabDecisionEvent[]>();
  for (const event of candidateEvents) {
    const events = byTurn.get(event.turnNumber) ?? [];
    events.push(event);
    byTurn.set(event.turnNumber, events);
  }

  const turns = [...byTurn.keys()].sort((a, b) => a - b);
  for (const turnNumber of turns) {
    const events = byTurn.get(turnNumber) ?? [];
    events.sort((a, b) => a.step - b.step);
    const last = events[events.length - 1];
    if (!last) {
      continue;
    }
    const nextTurnNumber = turns.find((candidate) => candidate > turnNumber);
    records.push({
      seed: last.seed,
      seat,
      turnNumber,
      events,
      opponentEvents: opponentEventsUntilNextOwnTurn(history, seat, last.step, turnNumber),
      nextOwnEvents: nextTurnNumber !== undefined ? byTurn.get(nextTurnNumber) ?? [] : [],
      handoff: last.after,
      nextOwnTurn: nextOwnTurnStart(history, seat, last.step, turnNumber),
    });
  }
  return records;
}

function opponentEventsUntilNextOwnTurn(
  history: readonly MasterLabDecisionEvent[],
  seat: PlayerId,
  afterStep: number,
  turnNumber: number,
): MasterLabDecisionEvent[] {
  const opponent = opponentOf(seat);
  const events: MasterLabDecisionEvent[] = [];
  for (const event of history) {
    if (event.step <= afterStep) {
      continue;
    }
    if (event.player === seat && event.turnNumber > turnNumber) {
      break;
    }
    if (event.player === opponent && event.source === "cpu") {
      events.push(event);
    }
  }
  return events;
}

function nextOwnTurnStart(
  history: readonly MasterLabDecisionEvent[],
  seat: PlayerId,
  afterStep: number,
  turnNumber: number,
): MasterLabGameStateSummary | undefined {
  const next = history.find((event) => event.player === seat && event.step > afterStep && event.turnNumber > turnNumber);
  return next?.before;
}

function analyzeTurn(turn: TurnRecord): TurnAnalysis {
  const finalStones = turn.handoff.players[turn.seat].stones;
  const lowStone = finalStones <= 1;
  const nextOwnTurn = turn.nextOwnTurn ?? turn.handoff;
  const ownBoardSwing = boardValue(nextOwnTurn, turn.seat) - boardValue(turn.handoff, turn.seat);
  const hpSwing = hpBalance(nextOwnTurn, turn.seat) - hpBalance(turn.handoff, turn.seat);
  const ownLost = Math.max(0, ownMonsterCount(turn.handoff, turn.seat) - ownMonsterCount(nextOwnTurn, turn.seat));
  const opponentLevelGain = Math.max(
    0,
    level2PlusCount(nextOwnTurn, opponentOf(turn.seat)) - level2PlusCount(turn.handoff, opponentOf(turn.seat)),
  );
  const punished = ownBoardSwing <= -120 || ownLost > 0 || opponentLevelGain > 0 || hpSwing <= -2;
  return { finalStones, lowStone, punished, ownBoardSwing, hpSwing, ownLost, opponentLevelGain };
}

function analyzeSummonEvent(turn: TurnRecord, event: MasterLabDecisionEvent): {
  slotKey?: SlotKey;
  cardName: string;
  row?: "front" | "back";
  role?: "front" | "back";
  backBlockedNoPattern: boolean;
  sameTurnWork: boolean;
  workedNextTurn: boolean;
  movedNextTurn: boolean;
  attackedByOpponent: boolean;
  noNextWork: boolean;
  fillsLastBackSlot: boolean;
} {
  const slotKey = summonSlotKeyForDecision(event.decision);
  const slot = slotKey ? slotSummary(event.after, slotKey) : undefined;
  const handInstanceId = summonHandInstanceIdForDecision(event.decision);
  const handCard = event.currentPlayerHand?.find((card) => card.instanceId === handInstanceId);
  const cardId = handCard?.cardId ?? slot?.card ?? "";
  const row = slotKey ? slotRow(slotKey) : undefined;
  const role = cardId ? safeMonsterRole(cardId) : undefined;
  const frontBlocker = row === "back" && slotKey ? slotSummary(event.after, frontSlotKeyFor(slotKey)) : undefined;
  const hasBacklinePattern = cardId ? monsterHasBacklineAttackPattern(cardId) : false;
  const sameTurnWork = !!slotKey && turn.events.some((candidate) =>
    candidate.step > event.step && candidate.decision.startsWith(`attack:${slotKey}:`)
  );
  const survivedNextOwn = !!slotKey && !!cardId && slotBelongsToCard(turn.nextOwnTurn, slotKey, cardId, turn.seat);
  const worked = survivedNextOwn ? didTrackedCardWorkNextTurn(turn.nextOwnEvents, turn.seat, slotKey, cardId) : { worked: false, moved: false };
  return {
    slotKey,
    cardName: cardId ? safeCardName(cardId) : "-",
    row,
    role,
    backBlockedNoPattern: row === "back" && !!frontBlocker?.card && frontBlocker.owner === turn.seat && !hasBacklinePattern,
    sameTurnWork,
    workedNextTurn: worked.worked,
    movedNextTurn: worked.moved,
    attackedByOpponent: !!slotKey && !!cardId && wasTargetedByOpponent(turn, slotKey, cardId),
    noNextWork: !worked.worked && !worked.moved,
    fillsLastBackSlot: emptyBackSlotCount(event.before, turn.seat) > 0 && emptyBackSlotCount(event.after, turn.seat) === 0,
  };
}

function didTrackedCardWorkNextTurn(
  nextOwnEvents: readonly MasterLabDecisionEvent[],
  owner: PlayerId,
  initialSlotKey: SlotKey,
  cardId: string,
): { worked: boolean; moved: boolean } {
  let trackedSlotKey: string = initialSlotKey;
  let worked = false;
  let moved = false;
  for (const event of nextOwnEvents) {
    if (!slotBelongsToCard(event.before, trackedSlotKey, cardId, owner)) {
      continue;
    }
    if (
      event.decision.startsWith(`attack:${trackedSlotKey}:`) ||
      event.decision === `focus:${trackedSlotKey}` ||
      levelGained(event, trackedSlotKey)
    ) {
      worked = true;
    }
    const move = moveForDecision(event.decision);
    if (move?.from === trackedSlotKey) {
      moved = true;
      trackedSlotKey = move.to;
    }
  }
  return { worked, moved };
}

function levelGained(event: MasterLabDecisionEvent, slotKey: string): boolean {
  const before = slotSummary(event.before, slotKey);
  const after = slotSummary(event.after, slotKey);
  return !!before?.card && !!after?.card && before.owner === after.owner && (after.level ?? 1) > (before.level ?? 1);
}

function wasTargetedByOpponent(turn: TurnRecord, slotKey: SlotKey, cardId: string): boolean {
  return turn.opponentEvents.some((event) =>
    event.decision.includes(`->monster:${slotKey}`) &&
    slotBelongsToCard(event.before, slotKey, cardId, turn.seat)
  );
}

function selectedScoreForEvent(event: MasterLabDecisionEvent): number {
  const selected = event.cpuDecisionEvaluations?.find((evaluation) => evaluation.selected);
  return selected?.totalScore ?? event.score;
}

function badActionAccumulator(
  accumulators: Map<BadActionKind, { bucket: BadActionBucket; deltas: number[] }>,
  kind: BadActionKind,
): { bucket: BadActionBucket; deltas: number[] } {
  const current = accumulators.get(kind);
  if (current) {
    return current;
  }
  const accumulator = {
    bucket: {
      count: 0,
      lowStone: 0,
      punished: 0,
      closeBestAlternative: 0,
      betterOrEqualBestAlternative: 0,
      averageBestAlternativeDelta: 0,
      bestAlternativeKinds: {},
    },
    deltas: [],
  };
  accumulators.set(kind, accumulator);
  return accumulator;
}

function alternativeAccumulator(
  accumulators: Map<AlternativeKind, { bucket: AlternativeBucket; deltas: number[] }>,
  kind: AlternativeKind,
): { bucket: AlternativeBucket; deltas: number[] } {
  const current = accumulators.get(kind);
  if (current) {
    return current;
  }
  const accumulator = {
    bucket: {
      available: 0,
      close: 0,
      betterOrEqual: 0,
      averageDelta: 0,
      bestDelta: Number.NEGATIVE_INFINITY,
    },
    deltas: [],
  };
  accumulators.set(kind, accumulator);
  return accumulator;
}

function finalizeBadActionBuckets(
  accumulators: Map<BadActionKind, { bucket: BadActionBucket; deltas: number[] }>,
): Record<BadActionKind, BadActionBucket> {
  return Object.fromEntries(BAD_ACTION_KINDS.map((kind) => {
    const accumulator = accumulators.get(kind);
    const bucket = accumulator?.bucket ?? {
      count: 0,
      lowStone: 0,
      punished: 0,
      closeBestAlternative: 0,
      betterOrEqualBestAlternative: 0,
      averageBestAlternativeDelta: 0,
      bestAlternativeKinds: {},
    };
    return [kind, {
      ...bucket,
      averageBestAlternativeDelta: round(average(accumulator?.deltas ?? []), 1),
    }];
  })) as Record<BadActionKind, BadActionBucket>;
}

function finalizeAlternativeBuckets(
  accumulators: Map<AlternativeKind, { bucket: AlternativeBucket; deltas: number[] }>,
): Record<AlternativeKind, AlternativeBucket> {
  return Object.fromEntries(ALTERNATIVE_KINDS.map((kind) => {
    const accumulator = accumulators.get(kind);
    const bucket = accumulator?.bucket ?? {
      available: 0,
      close: 0,
      betterOrEqual: 0,
      averageDelta: 0,
      bestDelta: Number.NEGATIVE_INFINITY,
    };
    return [kind, {
      ...bucket,
      averageDelta: round(average(accumulator?.deltas ?? []), 1),
      bestDelta: bucket.available > 0 ? round(bucket.bestDelta, 1) : 0,
    }];
  })) as Record<AlternativeKind, AlternativeBucket>;
}

function buildConclusion(
  metrics: DecisionAlternativeMetrics,
  badActions: Record<BadActionKind, BadActionBucket>,
  alternatives: Record<AlternativeKind, AlternativeBucket>,
): string[] {
  const lines: string[] = [];
  lines.push(
    `flagged events は ${metrics.flaggedEvents}/${metrics.decisionEvents} (` +
      `${formatPercent(ratio(metrics.flaggedEvents, metrics.decisionEvents))})。` +
      `そのうち低石 ${metrics.lowStoneFlaggedEvents}、返し罰あり ${metrics.punishedFlaggedEvents}。`,
  );
  lines.push(
    `最良代替が ${Math.abs(CLOSE_ALTERNATIVE_DELTA)} 点以内だったものは ${metrics.closeBestAlternative}、` +
      `同点以上は ${metrics.betterOrEqualBestAlternative}。平均最良代替deltaは ${metrics.averageBestAlternativeDelta}。`,
  );

  const topBadActions = Object.entries(badActions)
    .filter(([, bucket]) => bucket.count > 0)
    .sort((a, b) => b[1].count - a[1].count || b[1].closeBestAlternative - a[1].closeBestAlternative)
    .slice(0, 4);
  if (topBadActions.length > 0) {
    lines.push(
      `多いbad actionは ${topBadActions.map(([kind, bucket]) =>
        `${kind}=${bucket.count}(close=${bucket.closeBestAlternative})`
      ).join(", ")}。`,
    );
  }

  const topAlternatives = Object.entries(alternatives)
    .filter(([, bucket]) => bucket.available > 0)
    .sort((a, b) => b[1].close - a[1].close || b[1].available - a[1].available)
    .slice(0, 4);
  if (topAlternatives.length > 0) {
    lines.push(
      `近い代替候補は ${topAlternatives.map(([kind, bucket]) =>
        `${kind}=available${bucket.available}/close${bucket.close}/avg${bucket.averageDelta}`
      ).join(", ")}。`,
    );
  }

  lines.push("この監査は評価ログ上位候補だけを見るため、ここで見えない代替は「候補外または低順位」と解釈する。実際の再プレイ比較は次段階。");
  return lines;
}

function buildNextLoopProposal(
  badActions: Record<BadActionKind, BadActionBucket>,
  alternatives: Record<AlternativeKind, AlternativeBucket>,
): string[] {
  const proposals: string[] = [];
  const summonNoWork = badActions.summon_no_work_no_attack_punished;
  const blockedBackline = badActions.blocked_backline_summon;
  const lowStoneFocusNoWork = badActions.low_stone_focus_no_work_punished;
  const nonKillAttack = badActions.non_kill_monster_attack;

  if (summonNoWork.count > 0) {
    proposals.push(
      `召喚 no-work/no-attack は ${summonNoWork.count} 件。最良代替 close が ${summonNoWork.closeBestAlternative} 件あるため、まずこの局面だけ再プレイ比較する。`,
    );
  }
  if (blockedBackline.count > 0) {
    proposals.push(
      `塞がる後列召喚は ${blockedBackline.count} 件。best alt の内訳 ${formatKindCounts(blockedBackline.bestAlternativeKinds)} を見て、召喚slot変更か召喚skipかを分ける。`,
    );
  }
  if (lowStoneFocusNoWork.count > 0) {
    proposals.push(
      `低石focus no-work punished は ${lowStoneFocusNoWork.count} 件。attack_first close=${alternatives.attack_first.close} と合わせ、敵前衛処理を放棄したfocusだけを抽出する。`,
    );
  }
  if (nonKillAttack.count > 0) {
    proposals.push(
      `倒しきれない攻撃は ${nonKillAttack.count} 件。attack_first同士ではなく focus_only / wake_first / skip が近いものだけ、押し引きルール候補にする。`,
    );
  }
  if (proposals.length === 0) {
    proposals.push("今回の母数では、対象bad actionに明確な集中なし。別seedか別カテゴリへ移る。");
  }
  return proposals;
}

function formatMarkdown(report: DecisionAlternativeAuditReport): string {
  const lines: string[] = [];
  const m = report.metrics;
  lines.push("# White Mirror Decision Alternative Audit");
  lines.push("");
  lines.push(`生成: ${report.generatedAt}`);
  lines.push(`variant: ${report.variantId} / ${report.variantLabel}`);
  lines.push(`traceMode: ${report.traceMode}`);
  lines.push(`gamesPerMatchup: ${report.gamesPerMatchup}, seedStart: ${report.seedStart}`);
  lines.push(`games: ${report.games}, W-L-D: ${report.wins}-${report.losses}-${report.draws}`);
  lines.push("trace note: uses CPU evaluation trace when available; otherwise parses the top rejected labels embedded in decision reasons.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- turns: ${m.turns}`);
  lines.push(`- decision events / traced: ${m.decisionEvents}/${m.tracedDecisionEvents}`);
  lines.push(`- flagged events: ${m.flaggedEvents}`);
  lines.push(`- low-stone flagged / punished flagged: ${m.lowStoneFlaggedEvents}/${m.punishedFlaggedEvents}`);
  lines.push(`- close best alternative: ${m.closeBestAlternative}`);
  lines.push(`- better-or-equal best alternative: ${m.betterOrEqualBestAlternative}`);
  lines.push(`- average best alternative delta: ${m.averageBestAlternativeDelta}`);
  lines.push(`- best alternative delta: ${m.bestAlternativeDelta}`);
  lines.push(`- missing evaluation trace: ${m.missingEvaluationTrace}`);
  lines.push("");
  lines.push("## Bad Action Buckets");
  lines.push("");
  lines.push("| kind | count | low stone | punished | close best alt | >= selected | avg best delta | best alt kinds |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|---|");
  for (const kind of BAD_ACTION_KINDS) {
    const bucket = report.badActionBuckets[kind];
    lines.push(
      `| ${kind} | ${bucket.count} | ${bucket.lowStone} | ${bucket.punished} | ` +
        `${bucket.closeBestAlternative} | ${bucket.betterOrEqualBestAlternative} | ${bucket.averageBestAlternativeDelta} | ` +
        `${escapeMarkdownTableCell(formatKindCounts(bucket.bestAlternativeKinds))} |`,
    );
  }
  lines.push("");
  lines.push("## Alternative Buckets");
  lines.push("");
  lines.push("| kind | available | close | >= selected | avg delta | best delta |");
  lines.push("|---|---:|---:|---:|---:|---:|");
  for (const kind of ALTERNATIVE_KINDS) {
    const bucket = report.alternativeBuckets[kind];
    lines.push(
      `| ${kind} | ${bucket.available} | ${bucket.close} | ${bucket.betterOrEqual} | ${bucket.averageDelta} | ${bucket.bestDelta} |`,
    );
  }
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
  lines.push(
    "| kind | flags | seed | seat | turn | step | S | punished | ownBoard | hp | selected | score | best alt | delta | alternatives | details | response | next own | handoff |",
  );
  lines.push("|---|---|---:|---|---:|---:|---:|---|---:|---:|---|---:|---|---:|---|---|---|---|---|");
  for (const sample of report.samples) {
    lines.push(
      `| ${sample.primaryKind} | ${escapeMarkdownTableCell(sample.flags.join(","))} | ${sample.seed} | ${sample.seat} | ` +
        `${sample.turnNumber} | ${sample.step} | ${sample.finalStones} | ${sample.punished ? "yes" : "no"} | ` +
        `${sample.ownBoardSwing} | ${sample.hpSwing} | ${escapeMarkdownTableCell(sample.selectedDecision)} | ${sample.selectedScore} | ` +
        `${escapeMarkdownTableCell(sample.bestAlternative)} | ${sample.bestAlternativeDelta ?? ""} | ` +
        `${escapeMarkdownTableCell(sample.alternatives)} | ${escapeMarkdownTableCell(sample.selectedDetails)} | ` +
        `${escapeMarkdownTableCell(sample.opponentResponse)} | ${escapeMarkdownTableCell(sample.nextOwnDecisions)} | ` +
        `${escapeMarkdownTableCell(sample.handoff)} |`,
    );
  }
  return lines.join("\n");
}

function formatAlternatives(alternatives: Partial<Record<AlternativeKind, AlternativeSummary>>): string {
  return ALTERNATIVE_KINDS.map((kind) => alternatives[kind])
    .filter((alternative): alternative is AlternativeSummary => !!alternative)
    .map((alternative) => `${alternative.kind}:${alternative.deltaFromSelected}:${alternative.decision}`)
    .join(" / ") || "-";
}

function formatKindCounts(counts: Partial<Record<AlternativeKind, number>>): string {
  const parts = ALTERNATIVE_KINDS
    .map((kind) => ({ kind, count: counts[kind] ?? 0 }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count || a.kind.localeCompare(b.kind))
    .map((entry) => `${entry.kind}:${entry.count}`);
  return parts.join(", ") || "-";
}

function sortBadActionFlags(flags: BadActionKind[]): BadActionKind[] {
  return flags.sort((a, b) => BAD_ACTION_KINDS.indexOf(a) - BAD_ACTION_KINDS.indexOf(b));
}

function alternativeKindPriority(kind: AlternativeKind): number {
  return ALTERNATIVE_KINDS.indexOf(kind);
}

function boardValue(summary: MasterLabGameStateSummary, seat: PlayerId): number {
  return summary.slots.reduce((total, slot) => {
    if (!slot.card || slot.owner !== seat) {
      return total;
    }
    return total + (slot.level ?? 1) * 80 + (slot.hp ?? 0) * 18 + (slot.shielded ? 25 : 0);
  }, 0);
}

function hpBalance(summary: MasterLabGameStateSummary, seat: PlayerId): number {
  return summary.players[seat].hp - summary.players[opponentOf(seat)].hp;
}

function ownMonsterCount(summary: MasterLabGameStateSummary, seat: PlayerId): number {
  return summary.slots.filter((slot) => slot.card && slot.owner === seat).length;
}

function level2PlusCount(summary: MasterLabGameStateSummary, seat: PlayerId): number {
  return summary.slots.filter((slot) => slot.card && slot.owner === seat && (slot.level ?? 1) >= 2).length;
}

function enemyFrontMonsterCount(summary: MasterLabGameStateSummary, seat: PlayerId): number {
  const opponent = opponentOf(seat);
  return summary.slots.filter((slot) => slot.owner === opponent && slot.slotKey.startsWith(`${opponent}_front_`)).length;
}

function slotSummary(summary: MasterLabGameStateSummary | undefined, slotKey: string): SummarySlot | undefined {
  return summary?.slots.find((slot) => slot.slotKey === slotKey);
}

function slotBelongsToCard(
  summary: MasterLabGameStateSummary | undefined,
  slotKey: string,
  cardId: string,
  owner: PlayerId,
): boolean {
  const slot = slotSummary(summary, slotKey);
  return slot?.owner === owner && slot.card === cardId;
}

function emptyBackSlotCount(summary: MasterLabGameStateSummary, playerId: PlayerId): number {
  return summary.slots.filter((slot) =>
    slot.owner !== "cpu" &&
    slot.owner !== "player" &&
    slot.slotKey.startsWith(`${playerId}_back_`),
  ).length;
}

function focusSlotKeyForDecision(decision: string): SlotKey | undefined {
  if (!decision.startsWith("focus:")) {
    return undefined;
  }
  const slotKey = decision.slice("focus:".length);
  return isSlotKey(slotKey) ? slotKey : undefined;
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

function attackTargetSlotKey(decision: string): SlotKey | undefined {
  const match = /->monster:([a-z_]+)/.exec(decision);
  return isSlotKey(match?.[1]) ? match[1] : undefined;
}

function attackTargetMaster(decision: string): PlayerId | undefined {
  const match = /->master:(player|cpu)/.exec(decision);
  return match?.[1] as PlayerId | undefined;
}

function moveForDecision(decision: string): { from: string; to: string } | undefined {
  if (!decision.startsWith("move:")) {
    return undefined;
  }
  const [from, to] = decision.slice("move:".length).split("->");
  return from && to ? { from, to } : undefined;
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

function safeMonsterRole(cardId: string): "front" | "back" | undefined {
  try {
    return getMonsterDef(cardId).role;
  } catch {
    return undefined;
  }
}

function safeCardName(cardId: string): string {
  try {
    return getCardName(cardId);
  } catch {
    return cardId;
  }
}

function stateLine(summary: MasterLabGameStateSummary, seat: PlayerId): string {
  const opponent = opponentOf(seat);
  return `${seat} HP${summary.players[seat].hp} S${summary.players[seat].stones} B${boardValue(summary, seat)} / ` +
    `${opponent} HP${summary.players[opponent].hp} S${summary.players[opponent].stones} B${boardValue(summary, opponent)} / ` +
    boardLine(summary);
}

function boardLine(summary: MasterLabGameStateSummary): string {
  const occupied = summary.slots.filter((slot) => slot.card);
  if (occupied.length === 0) {
    return "-";
  }
  return occupied.map((slot) => {
    const status = slot.status ? ` ${slot.status}` : "";
    const shield = slot.shielded ? " shield" : "";
    return `${slot.slotKey}:${slot.owner}:${safeCardName(slot.card ?? "")} L${slot.level} HP${slot.hp}${status}${shield}`;
  }).join(" | ");
}

function emptyMetrics(): DecisionAlternativeMetrics {
  return {
    turns: 0,
    decisionEvents: 0,
    tracedDecisionEvents: 0,
    flaggedEvents: 0,
    lowStoneFlaggedEvents: 0,
    punishedFlaggedEvents: 0,
    closeBestAlternative: 0,
    betterOrEqualBestAlternative: 0,
    averageBestAlternativeDelta: 0,
    bestAlternativeDelta: 0,
    missingEvaluationTrace: 0,
  };
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    gamesPerMatchup: 3,
    seedStart: 992000,
    maxSteps: 220,
    maxTurns: 70,
    maxSamples: 80,
    variantId: "current_white_baseline",
    traceMode: "none",
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    switch (arg) {
      case "--games-per-matchup":
        options.gamesPerMatchup = readInteger(arg, args[++index]);
        break;
      case "--seed-start":
        options.seedStart = readInteger(arg, args[++index]);
        break;
      case "--max-steps":
        options.maxSteps = readInteger(arg, args[++index]);
        break;
      case "--max-turns":
        options.maxTurns = readInteger(arg, args[++index]);
        break;
      case "--max-samples":
        options.maxSamples = readInteger(arg, args[++index]);
        break;
      case "--variant":
        options.variantId = readString(arg, args[++index]);
        break;
      case "--trace-mode": {
        const value = readString(arg, args[++index]);
        if (value !== "none" && value !== "blocked-backline" && value !== "focus-summon" && value !== "bad-action") {
          throw new Error(`Invalid --trace-mode: ${value}`);
        }
        options.traceMode = value;
        break;
      }
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
  npm run audit:white-mirror-decision-alternatives -- [options]

Options:
  --games-per-matchup <n>  Games per seat. Default: 3
  --seed-start <n>         First seed. Default: 992000
  --max-steps <n>          Max steps per game. Default: 220
  --max-turns <n>          Max turns per game. Default: 70
  --max-samples <n>        Sample rows. Default: 80
  --variant <id>           Variant to audit. Default: current_white_baseline
  --trace-mode <mode>      none | blocked-backline | focus-summon | bad-action. Default: none
  --markdown <path>        Write Markdown report.
  --json <path>            Write JSON report.
`);
  process.exit(0);
}

function opponentOf(player: PlayerId): PlayerId {
  return player === "player" ? "cpu" : "player";
}

function average(values: readonly number[]): number {
  return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function ratio(value: number, total: number): number {
  return total > 0 ? value / total : 0;
}
