import { getCardName, getMonsterDef } from "../src/game/cards";
import { createCurrentWhiteAiVariant, CURRENT_WHITE_AI_MIRROR_OPPONENT } from "../src/game/currentWhiteAiFixtures";
import type { MasterLabDecisionEvent, MasterLabGameStateSummary, MasterLabHandCardSummary } from "../src/game/masterLabAutoPlay";
import { runWhiteAiTuningLoop, type WhiteAiTuningLoopOptions, type WhiteAiTuningVariant } from "../src/game/whiteAiTuningLoop";
import type { CommandDef, PlayerId, SlotKey } from "../src/game/types";
import { escapeMarkdownTableCell, formatPercent, readInteger, readString, round, writeReport } from "./lib/cli";

type SummarySlot = MasterLabGameStateSummary["slots"][number];

interface CliOptions extends WhiteAiTuningLoopOptions {
  markdownPath?: string;
  jsonPath?: string;
  maxSamples: number;
  variantId: string;
}

interface FocusSummonAuditReport {
  generatedAt: string;
  variantId: string;
  variantLabel: string;
  gamesPerMatchup: number;
  seedStart: number;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  metrics: FocusSummonMetrics;
  focusTargetBuckets: Record<string, FocusTargetBucket>;
  summonCardBuckets: Record<string, SummonCardBucket>;
  samples: FocusSummonSample[];
  conclusion: string[];
  nextLoopProposal: string[];
}

interface FocusSummonMetrics {
  turns: number;
  lowStoneHandoffs: number;
  punishedHandoffs: number;
  lowStonePunished: number;
  lowStoneFocusTurns: number;
  lowStoneFocusPunished: number;
  lowStoneSummonTurns: number;
  lowStoneSummonPunished: number;
  lowStoneFocusAndSummonTurns: number;
  focusUses: number;
  lowStoneFocusUses: number;
  focusTargetAttacked: number;
  focusTargetKilledBeforeNextOwn: number;
  focusTargetSurvivedNextOwn: number;
  focusWorkedNextTurn: number;
  focusMovedNextTurn: number;
  focusNoNextWork: number;
  focusNoNextWorkPunished: number;
  focusWithOpponentLevelGain: number;
  focusOnPrepared: number;
  focusOnActive: number;
  summonUses: number;
  lowStoneSummonUses: number;
  frontSummons: number;
  backSummons: number;
  backSummonsWithoutBacklinePattern: number;
  backSummonsBlockedByOwnFront: number;
  backSummonsBlockedNoPattern: number;
  summonSameTurnWake: number;
  summonSameTurnAttack: number;
  summonSameTurnWork: number;
  summonTargetAttacked: number;
  summonPlacedOnly: number;
  summonPlacedOnlyPunished: number;
  summonWorkedNextTurn: number;
  summonMovedNextTurn: number;
  summonNoNextWork: number;
  summonNoNextWorkPunished: number;
  summonNoWorkNoAttackPunished: number;
  summonKilledBeforeNextOwn: number;
  summonSurvivedNextOwn: number;
  summonFillsLastBackSlot: number;
  summonLeavesNoBackSlot: number;
  summonFillsLastBackSlotWithBacklineWorkInHand: number;
  summonLeavesNoBackSlotWithBacklineWorkInHand: number;
  summonWithOpponentLevelGain: number;
  averageLowStoneOwnBoardSwing: number;
  averageLowStoneHpSwing: number;
  averageFocusNoWorkOwnBoardSwing: number;
  averagePlacedOnlySummonOwnBoardSwing: number;
}

interface MutableBucket {
  count: number;
  lowStone: number;
  punished: number;
  lowStonePunished: number;
  workedNextTurn: number;
  noNextWork: number;
}

interface FocusTargetBucket {
  uses: number;
  lowStone: number;
  punished: number;
  lowStonePunished: number;
  workedNextTurn: number;
  noNextWork: number;
}

interface SummonCardBucket {
  summons: number;
  lowStone: number;
  punished: number;
  lowStonePunished: number;
  workedNextTurn: number;
  noNextWork: number;
}

type SampleKind =
  | "focus_no_work_punished"
  | "focus_killed_punished"
  | "focus_worked_next_turn"
  | "summon_placed_only_punished"
  | "summon_back_blocked_no_pattern"
  | "summon_last_back_slot"
  | "summon_worked_next_turn"
  | "summon_same_turn_work"
  | "low_stone_focus"
  | "low_stone_summon";

interface FocusSummonSample {
  kind: SampleKind;
  seed: number;
  seat: PlayerId;
  turnNumber: number;
  finalStones: number;
  punished: boolean;
  ownBoardSwing: number;
  boardSwing: number;
  hpSwing: number;
  ownLost: number;
  opponentLevelGain: number;
  subject: string;
  details: string;
  decisions: string;
  opponentResponse: string;
  nextOwnDecisions: string;
  handoff: string;
  nextOwnTurn: string;
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
  boardSwing: number;
  hpSwing: number;
  ownLost: number;
  opponentLevelGain: number;
}

interface FocusAnalysis {
  slotKey: SlotKey;
  cardId: string;
  cardName: string;
  status?: string;
  attackedByOpponent: boolean;
  killedBeforeNextOwn: boolean;
  survivedNextOwn: boolean;
  workedNextTurn: boolean;
  movedNextTurn: boolean;
}

interface SummonAnalysis {
  slotKey: SlotKey;
  cardId: string;
  cardName: string;
  role?: "front" | "back";
  row: "front" | "back";
  hasBacklinePattern: boolean;
  frontBlockedByOwnMonster: boolean;
  backBlockedNoPattern: boolean;
  sameTurnWake: boolean;
  sameTurnAttack: boolean;
  sameTurnWork: boolean;
  attackedByOpponent: boolean;
  placedOnly: boolean;
  workedNextTurn: boolean;
  movedNextTurn: boolean;
  noNextWork: boolean;
  killedBeforeNextOwn: boolean;
  survivedNextOwn: boolean;
  fillsLastBackSlot: boolean;
  leavesNoBackSlot: boolean;
  otherBacklineWorkInHand: number;
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

console.log(`White mirror focus/summon audit: ${report.variantId}, ${report.games} games, ${report.metrics.turns} turns`);
console.log(
  `lowStone ${report.metrics.lowStoneHandoffs}, ` +
    `focus ${report.metrics.lowStoneFocusTurns}/${report.metrics.lowStoneFocusPunished}, ` +
    `summon ${report.metrics.lowStoneSummonTurns}/${report.metrics.lowStoneSummonPunished}`,
);
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runAudit(options: CliOptions): FocusSummonAuditReport {
  const variant = auditVariantFor(options.variantId);
  const loopReport = runWhiteAiTuningLoop({
    ...options,
    variants: [variant],
    opponents: [CURRENT_WHITE_AI_MIRROR_OPPONENT],
    includeGameHistory: true,
  });

  const metrics = emptyMetrics();
  const samples: FocusSummonSample[] = [];
  const lowStoneOwnBoardSwings: number[] = [];
  const lowStoneHpSwings: number[] = [];
  const focusNoWorkSwings: number[] = [];
  const placedOnlySummonSwings: number[] = [];
  const focusBuckets = new Map<string, MutableBucket>();
  const summonBuckets = new Map<string, MutableBucket>();
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
        const turnAnalysis = analyzeTurn(turn);
        const focusAnalyses = analyzeFocuses(turn);
        const summonAnalyses = analyzeSummons(turn);
        accumulateTurnMetrics(metrics, turnAnalysis, focusAnalyses, summonAnalyses);
        accumulateFocusBuckets(focusBuckets, turnAnalysis, focusAnalyses);
        accumulateSummonBuckets(summonBuckets, turnAnalysis, summonAnalyses);
        if (turnAnalysis.lowStone) {
          lowStoneOwnBoardSwings.push(turnAnalysis.ownBoardSwing);
          lowStoneHpSwings.push(turnAnalysis.hpSwing);
        }
        for (const focus of focusAnalyses) {
          if (turnAnalysis.lowStone && !focus.workedNextTurn) {
            focusNoWorkSwings.push(turnAnalysis.ownBoardSwing);
          }
        }
        for (const summon of summonAnalyses) {
          if (turnAnalysis.lowStone && summon.placedOnly) {
            placedOnlySummonSwings.push(turnAnalysis.ownBoardSwing);
          }
        }
        addSamples(samples, options.maxSamples, turn, turnAnalysis, focusAnalyses, summonAnalyses);
      }
    }
  }

  metrics.averageLowStoneOwnBoardSwing = round(average(lowStoneOwnBoardSwings), 1);
  metrics.averageLowStoneHpSwing = round(average(lowStoneHpSwings), 1);
  metrics.averageFocusNoWorkOwnBoardSwing = round(average(focusNoWorkSwings), 1);
  metrics.averagePlacedOnlySummonOwnBoardSwing = round(average(placedOnlySummonSwings), 1);

  return {
    generatedAt: loopReport.generatedAt,
    variantId: variant.id,
    variantLabel: variant.label,
    gamesPerMatchup: loopReport.gamesPerMatchup,
    seedStart: options.seedStart ?? 0,
    games,
    wins,
    losses,
    draws,
    metrics,
    focusTargetBuckets: finalizeFocusBuckets(focusBuckets),
    summonCardBuckets: finalizeSummonBuckets(summonBuckets),
    samples,
    conclusion: buildConclusion(metrics),
    nextLoopProposal: buildNextLoopProposal(metrics),
  };
}

function auditVariantFor(id: string): WhiteAiTuningVariant {
  switch (id) {
    case "current_white_baseline":
      return createCurrentWhiteAiVariant(
        "current_white_baseline",
        "現行: 暫定白最強 / white",
        undefined,
        "白ミラーで低石focusと低石召喚の返しを監査する。",
      );
    case "current_mirror_focus_quality_mid":
      return createCurrentWhiteAiVariant(
        "current_mirror_focus_quality_mid",
        "候補: 白ミラーfocus品質 中",
        {
          situationalBias: {
            whiteLowStoneFocusConversionBonus: 14,
            whiteLowStoneFocusMissedAttackPenalty: 10,
          },
        },
        "focus/summon監査で多かった、次自ターン仕事化しない低石focusの副作用を中程度に見る。",
      );
    case "current_mirror_blocked_backline_no_work80":
      return createCurrentWhiteAiVariant(
        "current_mirror_blocked_backline_no_work80",
        "候補: 白ミラー詰まり後列仕事なし 80",
        {
          situationalBias: {
            whiteBlockedBacklineNoWorkSummonPenalty: 80,
          },
        },
        "前列味方で塞がれ、後列から仕事できない召喚だけを白ミラーでも中程度に抑える。",
      );
    case "current_mirror_blocked_backline_no_work120":
      return createCurrentWhiteAiVariant(
        "current_mirror_blocked_backline_no_work120",
        "候補: 白ミラー詰まり後列仕事なし 120",
        {
          situationalBias: {
            whiteBlockedBacklineNoWorkSummonPenalty: 120,
          },
        },
        "詰まり後列仕事なし召喚を強めに抑え、盤面制圧を落とさず違和感が減るかを見る。",
      );
    case "current_mirror_focus_backline_quality":
      return createCurrentWhiteAiVariant(
        "current_mirror_focus_backline_quality",
        "候補: 白ミラーfocus+後列品質",
        {
          situationalBias: {
            whiteLowStoneFocusConversionBonus: 14,
            whiteLowStoneFocusMissedAttackPenalty: 10,
            whiteBlockedBacklineNoWorkSummonPenalty: 80,
          },
        },
        "仕事化しない低石focusと、塞がる後列仕事なし召喚の両方を狭く抑える複合候補。",
      );
    default:
      throw new Error(`Unknown audit variant: ${id}`);
  }
}

function analyzeTurn(turn: TurnRecord): TurnAnalysis {
  const finalStones = turn.handoff.players[turn.seat].stones;
  const lowStone = finalStones <= 1;
  const nextOwnTurn = turn.nextOwnTurn ?? turn.handoff;
  const ownBoardSwing = boardValue(nextOwnTurn, turn.seat) - boardValue(turn.handoff, turn.seat);
  const boardSwing = boardBalance(nextOwnTurn, turn.seat) - boardBalance(turn.handoff, turn.seat);
  const hpSwing = hpBalance(nextOwnTurn, turn.seat) - hpBalance(turn.handoff, turn.seat);
  const ownLost = Math.max(0, ownMonsterCount(turn.handoff, turn.seat) - ownMonsterCount(nextOwnTurn, turn.seat));
  const opponentLevelGain = Math.max(
    0,
    level2PlusCount(nextOwnTurn, opponentOf(turn.seat)) - level2PlusCount(turn.handoff, opponentOf(turn.seat)),
  );
  const punished = ownBoardSwing <= -120 || ownLost > 0 || opponentLevelGain > 0 || hpSwing <= -2;

  return {
    finalStones,
    lowStone,
    punished,
    ownBoardSwing,
    boardSwing,
    hpSwing,
    ownLost,
    opponentLevelGain,
  };
}

function analyzeFocuses(turn: TurnRecord): FocusAnalysis[] {
  const analyses: FocusAnalysis[] = [];
  for (const event of turn.events) {
    if (!event.decision.startsWith("focus:")) {
      continue;
    }
    const slotKey = focusSlotKeyForDecision(event.decision);
    const slot = slotKey ? slotSummary(event.after, slotKey) : undefined;
    if (!slotKey || !slot?.card || slot.owner !== turn.seat) {
      continue;
    }
    const survivedNextOwn = slotBelongsToCard(turn.nextOwnTurn, slotKey, slot.card, turn.seat);
    const worked = survivedNextOwn ? didTrackedCardWorkNextTurn(turn.nextOwnEvents, turn.seat, slotKey, slot.card) : { worked: false, moved: false };
    const analysis: FocusAnalysis = {
      slotKey,
      cardId: slot.card,
      cardName: safeCardName(slot.card),
      attackedByOpponent: wasTargetedByOpponent(turn, slotKey, slot.card),
      killedBeforeNextOwn: !survivedNextOwn,
      survivedNextOwn,
      workedNextTurn: worked.worked,
      movedNextTurn: worked.moved,
    };
    if (slot.status) {
      analysis.status = slot.status;
    }
    analyses.push(analysis);
  }
  return analyses;
}

function analyzeSummons(turn: TurnRecord): SummonAnalysis[] {
  const analyses: SummonAnalysis[] = [];
  for (const event of turn.events) {
    if (!event.decision.startsWith("summon:")) {
      continue;
    }
    const slotKey = summonSlotKeyForDecision(event.decision);
    const slot = slotKey ? slotSummary(event.after, slotKey) : undefined;
    if (!slotKey || !slot?.card || slot.owner !== turn.seat) {
      continue;
    }
    const card = summonCardForEvent(event, slot.card);
    const row = slotRow(slotKey);
    const hasBacklinePattern = monsterHasBacklineAttackPattern(card.cardId);
    const frontBlocker = row === "back" ? slotSummary(event.after, frontSlotKeyFor(slotKey)) : undefined;
    const sameTurnWake = turn.events.some((candidate) =>
      candidate.step > event.step &&
      candidate.decision === `master:wake_up->monster:${slotKey}`
    );
    const sameTurnAttack = turn.events.some((candidate) =>
      candidate.step > event.step &&
      candidate.decision.startsWith(`attack:${slotKey}:`)
    );
    const survivedNextOwn = slotBelongsToCard(turn.nextOwnTurn, slotKey, card.cardId, turn.seat);
    const worked = survivedNextOwn ? didTrackedCardWorkNextTurn(turn.nextOwnEvents, turn.seat, slotKey, card.cardId) : { worked: false, moved: false };
    const fillsLastBackSlot = emptyBackSlotCount(event.before, turn.seat) > 0 && emptyBackSlotCount(event.after, turn.seat) === 0;
    const leavesNoBackSlot = emptyBackSlotCount(event.after, turn.seat) === 0;
    const otherBacklineWorkInHand = otherBacklineWorkCardsInHand(event, card.instanceId);
    const analysis: SummonAnalysis = {
      slotKey,
      cardId: card.cardId,
      cardName: card.cardName,
      row,
      hasBacklinePattern,
      frontBlockedByOwnMonster: !!frontBlocker?.card && frontBlocker.owner === turn.seat,
      backBlockedNoPattern: row === "back" && !!frontBlocker?.card && frontBlocker.owner === turn.seat && !hasBacklinePattern,
      sameTurnWake,
      sameTurnAttack,
      sameTurnWork: sameTurnAttack,
      attackedByOpponent: wasTargetedByOpponent(turn, slotKey, card.cardId),
      placedOnly: !sameTurnAttack,
      workedNextTurn: worked.worked,
      movedNextTurn: worked.moved,
      noNextWork: !worked.worked && !worked.moved,
      killedBeforeNextOwn: !survivedNextOwn,
      survivedNextOwn,
      fillsLastBackSlot,
      leavesNoBackSlot,
      otherBacklineWorkInHand,
    };
    if (card.role) {
      analysis.role = card.role;
    }
    analyses.push(analysis);
  }
  return analyses;
}

function accumulateTurnMetrics(
  metrics: FocusSummonMetrics,
  turn: TurnAnalysis,
  focuses: readonly FocusAnalysis[],
  summons: readonly SummonAnalysis[],
): void {
  metrics.turns += 1;
  if (turn.punished) {
    metrics.punishedHandoffs += 1;
  }
  if (turn.lowStone) {
    metrics.lowStoneHandoffs += 1;
    if (turn.punished) {
      metrics.lowStonePunished += 1;
    }
  }

  if (turn.lowStone && focuses.length > 0) {
    metrics.lowStoneFocusTurns += 1;
    if (turn.punished) {
      metrics.lowStoneFocusPunished += 1;
    }
  }
  if (turn.lowStone && summons.length > 0) {
    metrics.lowStoneSummonTurns += 1;
    if (turn.punished) {
      metrics.lowStoneSummonPunished += 1;
    }
  }
  if (turn.lowStone && focuses.length > 0 && summons.length > 0) {
    metrics.lowStoneFocusAndSummonTurns += 1;
  }

  for (const focus of focuses) {
    metrics.focusUses += 1;
    if (turn.lowStone) {
      metrics.lowStoneFocusUses += 1;
    }
    if (focus.attackedByOpponent) {
      metrics.focusTargetAttacked += 1;
    }
    if (focus.killedBeforeNextOwn) {
      metrics.focusTargetKilledBeforeNextOwn += 1;
    }
    if (focus.survivedNextOwn) {
      metrics.focusTargetSurvivedNextOwn += 1;
    }
    if (focus.workedNextTurn) {
      metrics.focusWorkedNextTurn += 1;
    } else {
      metrics.focusNoNextWork += 1;
      if (turn.lowStone && turn.punished) {
        metrics.focusNoNextWorkPunished += 1;
      }
    }
    if (focus.movedNextTurn) {
      metrics.focusMovedNextTurn += 1;
    }
    if (turn.lowStone && turn.opponentLevelGain > 0) {
      metrics.focusWithOpponentLevelGain += 1;
    }
    if (focus.status === "prepared") {
      metrics.focusOnPrepared += 1;
    } else if (focus.status === "active") {
      metrics.focusOnActive += 1;
    }
  }

  for (const summon of summons) {
    metrics.summonUses += 1;
    if (turn.lowStone) {
      metrics.lowStoneSummonUses += 1;
    }
    if (summon.row === "front") {
      metrics.frontSummons += 1;
    } else {
      metrics.backSummons += 1;
      if (!summon.hasBacklinePattern) {
        metrics.backSummonsWithoutBacklinePattern += 1;
      }
      if (summon.frontBlockedByOwnMonster) {
        metrics.backSummonsBlockedByOwnFront += 1;
      }
      if (summon.backBlockedNoPattern) {
        metrics.backSummonsBlockedNoPattern += 1;
      }
    }
    if (summon.sameTurnWake) {
      metrics.summonSameTurnWake += 1;
    }
    if (summon.sameTurnAttack) {
      metrics.summonSameTurnAttack += 1;
    }
    if (summon.sameTurnWork) {
      metrics.summonSameTurnWork += 1;
    }
    if (summon.attackedByOpponent) {
      metrics.summonTargetAttacked += 1;
    }
    if (summon.placedOnly) {
      metrics.summonPlacedOnly += 1;
      if (turn.lowStone && turn.punished) {
        metrics.summonPlacedOnlyPunished += 1;
      }
    }
    if (summon.workedNextTurn) {
      metrics.summonWorkedNextTurn += 1;
    }
    if (summon.movedNextTurn) {
      metrics.summonMovedNextTurn += 1;
    }
    if (summon.noNextWork) {
      metrics.summonNoNextWork += 1;
      if (turn.lowStone && turn.punished) {
        metrics.summonNoNextWorkPunished += 1;
        if (!summon.attackedByOpponent) {
          metrics.summonNoWorkNoAttackPunished += 1;
        }
      }
    }
    if (summon.killedBeforeNextOwn) {
      metrics.summonKilledBeforeNextOwn += 1;
    }
    if (summon.survivedNextOwn) {
      metrics.summonSurvivedNextOwn += 1;
    }
    if (summon.fillsLastBackSlot) {
      metrics.summonFillsLastBackSlot += 1;
      if (summon.otherBacklineWorkInHand > 0) {
        metrics.summonFillsLastBackSlotWithBacklineWorkInHand += 1;
      }
    }
    if (summon.leavesNoBackSlot) {
      metrics.summonLeavesNoBackSlot += 1;
      if (summon.otherBacklineWorkInHand > 0) {
        metrics.summonLeavesNoBackSlotWithBacklineWorkInHand += 1;
      }
    }
    if (turn.lowStone && turn.opponentLevelGain > 0) {
      metrics.summonWithOpponentLevelGain += 1;
    }
  }
}

function accumulateFocusBuckets(
  buckets: Map<string, MutableBucket>,
  turn: TurnAnalysis,
  focuses: readonly FocusAnalysis[],
): void {
  for (const focus of focuses) {
    const bucket = mutableBucket(buckets, focus.cardName);
    bucket.count += 1;
    if (turn.lowStone) {
      bucket.lowStone += 1;
      if (turn.punished) {
        bucket.lowStonePunished += 1;
      }
    }
    if (turn.punished) {
      bucket.punished += 1;
    }
    if (focus.workedNextTurn) {
      bucket.workedNextTurn += 1;
    } else {
      bucket.noNextWork += 1;
    }
  }
}

function accumulateSummonBuckets(
  buckets: Map<string, MutableBucket>,
  turn: TurnAnalysis,
  summons: readonly SummonAnalysis[],
): void {
  for (const summon of summons) {
    const bucket = mutableBucket(buckets, summon.cardName);
    bucket.count += 1;
    if (turn.lowStone) {
      bucket.lowStone += 1;
      if (turn.punished) {
        bucket.lowStonePunished += 1;
      }
    }
    if (turn.punished) {
      bucket.punished += 1;
    }
    if (summon.workedNextTurn || summon.sameTurnWork) {
      bucket.workedNextTurn += 1;
    } else {
      bucket.noNextWork += 1;
    }
  }
}

function mutableBucket(buckets: Map<string, MutableBucket>, key: string): MutableBucket {
  const current = buckets.get(key);
  if (current) {
    return current;
  }
  const bucket = { count: 0, lowStone: 0, punished: 0, lowStonePunished: 0, workedNextTurn: 0, noNextWork: 0 };
  buckets.set(key, bucket);
  return bucket;
}

function finalizeFocusBuckets(buckets: Map<string, MutableBucket>): Record<string, FocusTargetBucket> {
  return Object.fromEntries(
    [...buckets.entries()]
      .sort((a, b) => b[1].lowStonePunished - a[1].lowStonePunished || b[1].lowStone - a[1].lowStone || a[0].localeCompare(b[0]))
      .map(([name, bucket]) => [
        name,
        {
          uses: bucket.count,
          lowStone: bucket.lowStone,
          punished: bucket.punished,
          lowStonePunished: bucket.lowStonePunished,
          workedNextTurn: bucket.workedNextTurn,
          noNextWork: bucket.noNextWork,
        },
      ]),
  );
}

function finalizeSummonBuckets(buckets: Map<string, MutableBucket>): Record<string, SummonCardBucket> {
  return Object.fromEntries(
    [...buckets.entries()]
      .sort((a, b) => b[1].lowStonePunished - a[1].lowStonePunished || b[1].lowStone - a[1].lowStone || a[0].localeCompare(b[0]))
      .map(([name, bucket]) => [
        name,
        {
          summons: bucket.count,
          lowStone: bucket.lowStone,
          punished: bucket.punished,
          lowStonePunished: bucket.lowStonePunished,
          workedNextTurn: bucket.workedNextTurn,
          noNextWork: bucket.noNextWork,
        },
      ]),
  );
}

function addSamples(
  samples: FocusSummonSample[],
  maxSamples: number,
  turn: TurnRecord,
  turnAnalysis: TurnAnalysis,
  focuses: readonly FocusAnalysis[],
  summons: readonly SummonAnalysis[],
): void {
  if (!turnAnalysis.lowStone || samples.length >= maxSamples) {
    return;
  }

  for (const focus of focuses) {
    if (samples.length >= maxSamples) {
      return;
    }
    const kind = sampleKindForFocus(turnAnalysis, focus);
    samples.push(focusSample(turn, turnAnalysis, focus, kind));
  }

  for (const summon of summons) {
    if (samples.length >= maxSamples) {
      return;
    }
    const kind = sampleKindForSummon(turnAnalysis, summon);
    samples.push(summonSample(turn, turnAnalysis, summon, kind));
  }
}

function sampleKindForFocus(turn: TurnAnalysis, focus: FocusAnalysis): SampleKind {
  if (turn.punished && !focus.workedNextTurn) {
    return "focus_no_work_punished";
  }
  if (turn.punished && focus.killedBeforeNextOwn) {
    return "focus_killed_punished";
  }
  if (focus.workedNextTurn) {
    return "focus_worked_next_turn";
  }
  return "low_stone_focus";
}

function sampleKindForSummon(turn: TurnAnalysis, summon: SummonAnalysis): SampleKind {
  if (turn.punished && summon.placedOnly) {
    return "summon_placed_only_punished";
  }
  if (summon.backBlockedNoPattern) {
    return "summon_back_blocked_no_pattern";
  }
  if (summon.fillsLastBackSlot) {
    return "summon_last_back_slot";
  }
  if (summon.sameTurnWork) {
    return "summon_same_turn_work";
  }
  if (summon.workedNextTurn) {
    return "summon_worked_next_turn";
  }
  return "low_stone_summon";
}

function focusSample(
  turn: TurnRecord,
  turnAnalysis: TurnAnalysis,
  focus: FocusAnalysis,
  kind: SampleKind,
): FocusSummonSample {
  return sampleBase(turn, turnAnalysis, kind, focus.cardName, [
    `slot=${focus.slotKey}`,
    `status=${focus.status ?? "-"}`,
    `attacked=${focus.attackedByOpponent}`,
    `killed=${focus.killedBeforeNextOwn}`,
    `workedNext=${focus.workedNextTurn}`,
    `movedNext=${focus.movedNextTurn}`,
  ].join(", "));
}

function summonSample(
  turn: TurnRecord,
  turnAnalysis: TurnAnalysis,
  summon: SummonAnalysis,
  kind: SampleKind,
): FocusSummonSample {
  return sampleBase(turn, turnAnalysis, kind, summon.cardName, [
    `slot=${summon.slotKey}`,
    `row=${summon.row}`,
    `role=${summon.role ?? "-"}`,
    `backPattern=${summon.hasBacklinePattern}`,
    `frontBlocked=${summon.frontBlockedByOwnMonster}`,
    `sameTurnWork=${summon.sameTurnWork}`,
    `attacked=${summon.attackedByOpponent}`,
    `workedNext=${summon.workedNextTurn}`,
    `movedNext=${summon.movedNextTurn}`,
    `killed=${summon.killedBeforeNextOwn}`,
    `lastBack=${summon.fillsLastBackSlot}`,
    `otherBackHand=${summon.otherBacklineWorkInHand}`,
  ].join(", "));
}

function sampleBase(
  turn: TurnRecord,
  turnAnalysis: TurnAnalysis,
  kind: SampleKind,
  subject: string,
  details: string,
): FocusSummonSample {
  return {
    kind,
    seed: turn.seed,
    seat: turn.seat,
    turnNumber: turn.turnNumber,
    finalStones: turnAnalysis.finalStones,
    punished: turnAnalysis.punished,
    ownBoardSwing: round(turnAnalysis.ownBoardSwing, 1),
    boardSwing: round(turnAnalysis.boardSwing, 1),
    hpSwing: turnAnalysis.hpSwing,
    ownLost: turnAnalysis.ownLost,
    opponentLevelGain: turnAnalysis.opponentLevelGain,
    subject,
    details,
    decisions: turn.events.map((event) => `${event.decision} [${round(event.score, 1)}]`).join(" -> "),
    opponentResponse: turn.opponentEvents.slice(0, 10).map((event) => `${event.decision} [${round(event.score, 1)}]`).join(" -> ") || "-",
    nextOwnDecisions: turn.nextOwnEvents.slice(0, 10).map((event) => `${event.decision} [${round(event.score, 1)}]`).join(" -> ") || "-",
    handoff: stateLine(turn.handoff, turn.seat),
    nextOwnTurn: turn.nextOwnTurn ? stateLine(turn.nextOwnTurn, turn.seat) : "-",
  };
}

function buildConclusion(metrics: FocusSummonMetrics): string[] {
  const lines: string[] = [];
  lines.push(
    `低石ハンドオフは ${metrics.lowStoneHandoffs}/${metrics.turns} (${formatPercent(ratio(metrics.lowStoneHandoffs, metrics.turns))})、` +
      `罰ありは ${metrics.lowStonePunished} (${formatPercent(ratio(metrics.lowStonePunished, metrics.lowStoneHandoffs))})。`,
  );
  lines.push(
    `低石focusターンは ${metrics.lowStoneFocusTurns}、罰あり ${metrics.lowStoneFocusPunished}。` +
      `focus対象が次自ターン仕事化した回数は ${metrics.focusWorkedNextTurn}、仕事化なしは ${metrics.focusNoNextWork}、` +
      `低石かつ罰ありの仕事化なしは ${metrics.focusNoNextWorkPunished}。`,
  );
  lines.push(
    `低石召喚ターンは ${metrics.lowStoneSummonTurns}、罰あり ${metrics.lowStoneSummonPunished}。` +
      `置いただけ召喚は ${metrics.summonPlacedOnly}、低石かつ罰ありの置いただけ召喚は ${metrics.summonPlacedOnlyPunished}。` +
      `次ターン仕事化も相手攻撃吸収もない低石召喚罰ありは ${metrics.summonNoWorkNoAttackPunished}。`,
  );
  lines.push(
    `後列召喚 ${metrics.backSummons} のうち、後列攻撃パターンなし ${metrics.backSummonsWithoutBacklinePattern}、` +
      `前列味方で塞がれた後列召喚 ${metrics.backSummonsBlockedByOwnFront}、そのうち後列攻撃パターンなし ${metrics.backSummonsBlockedNoPattern}。`,
  );
  lines.push(
    `最後の後列枠を埋めた召喚は ${metrics.summonFillsLastBackSlot}、その時点で手札に後列仕事カードが残っていたものは ${metrics.summonFillsLastBackSlotWithBacklineWorkInHand}。`,
  );

  if (metrics.focusNoNextWorkPunished > 0) {
    lines.push("focusは一律に悪いのではなく、次自ターンの攻撃・レベルアップ・再focusへ変換されない低石focusだけが候補。");
  }
  if (metrics.summonNoWorkNoAttackPunished > 0) {
    lines.push("召喚は、即仕事・次ターン仕事化・相手攻撃吸収のどれかがあるものを残し、どれもない低石召喚だけを候補化するのがよい。");
  }
  if (metrics.backSummonsBlockedNoPattern > 0) {
    lines.push("後列召喚はロールだけでなく、前列味方に塞がれても働ける攻撃パターンかを見ないと誤判定しやすい。");
  }
  return lines;
}

function buildNextLoopProposal(metrics: FocusSummonMetrics): string[] {
  const proposals: Array<{ label: string; score: number }> = [
    {
      label: "低石かつ次自ターン仕事化しないfocusを、気合ための価値ではなく返し被害込みで抑える候補",
      score: metrics.focusNoNextWorkPunished,
    },
    {
      label: "即仕事・次ターン仕事・相手攻撃吸収のどれもない低石召喚を抑える候補",
      score: metrics.summonNoWorkNoAttackPunished,
    },
    {
      label: "前列味方で塞がれる後列召喚のうち、後列攻撃パターンなしを抑える候補",
      score: metrics.backSummonsBlockedNoPattern,
    },
    {
      label: "後列仕事カードが手札にあるとき最後の後列枠を埋める召喚を抑える候補",
      score: metrics.summonFillsLastBackSlotWithBacklineWorkInHand,
    },
  ];
  return proposals
    .filter((proposal) => proposal.score > 0)
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
    .map((proposal) => `${proposal.label}: ${proposal.score}`);
}

function formatMarkdown(report: FocusSummonAuditReport): string {
  const lines: string[] = [];
  const m = report.metrics;
  lines.push("# White Mirror Focus/Summon Audit");
  lines.push("");
  lines.push(`生成: ${report.generatedAt}`);
  lines.push(`variant: ${report.variantId} / ${report.variantLabel}`);
  lines.push(`gamesPerMatchup: ${report.gamesPerMatchup}, seedStart: ${report.seedStart}`);
  lines.push(`games: ${report.games}, W-L-D: ${report.wins}-${report.losses}-${report.draws}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- turns: ${m.turns}`);
  lines.push(`- low stone handoffs: ${m.lowStoneHandoffs} (${formatPercent(ratio(m.lowStoneHandoffs, m.turns))})`);
  lines.push(`- low stone punished: ${m.lowStonePunished} (${formatPercent(ratio(m.lowStonePunished, m.lowStoneHandoffs))})`);
  lines.push(`- average low-stone own board swing: ${m.averageLowStoneOwnBoardSwing}`);
  lines.push(`- average low-stone hp swing: ${m.averageLowStoneHpSwing}`);
  lines.push("");
  lines.push("## Focus Breakdown");
  lines.push("");
  lines.push(`- low-stone focus turns: ${m.lowStoneFocusTurns}`);
  lines.push(`- low-stone focus punished: ${m.lowStoneFocusPunished} (${formatPercent(ratio(m.lowStoneFocusPunished, m.lowStoneFocusTurns))})`);
  lines.push(`- focus uses / low-stone focus uses: ${m.focusUses}/${m.lowStoneFocusUses}`);
  lines.push(`- target attacked / killed / survived: ${m.focusTargetAttacked}/${m.focusTargetKilledBeforeNextOwn}/${m.focusTargetSurvivedNextOwn}`);
  lines.push(`- worked / moved / no next work: ${m.focusWorkedNextTurn}/${m.focusMovedNextTurn}/${m.focusNoNextWork}`);
  lines.push(`- no next work and low-stone punished: ${m.focusNoNextWorkPunished}`);
  lines.push(`- focus with opponent level gain: ${m.focusWithOpponentLevelGain}`);
  lines.push(`- focus on prepared / active: ${m.focusOnPrepared}/${m.focusOnActive}`);
  lines.push(`- average no-work focus own board swing: ${m.averageFocusNoWorkOwnBoardSwing}`);
  lines.push("");
  lines.push("### Focus Target Buckets");
  lines.push("");
  lines.push("| target | uses | low stone | punished | low stone punished | worked next | no next work |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|");
  for (const [name, bucket] of Object.entries(report.focusTargetBuckets)) {
    lines.push(
      `| ${escapeMarkdownTableCell(name)} | ${bucket.uses} | ${bucket.lowStone} | ${bucket.punished} | ` +
        `${bucket.lowStonePunished} | ${bucket.workedNextTurn} | ${bucket.noNextWork} |`,
    );
  }
  lines.push("");
  lines.push("## Summon Breakdown");
  lines.push("");
  lines.push(`- low-stone summon turns: ${m.lowStoneSummonTurns}`);
  lines.push(`- low-stone summon punished: ${m.lowStoneSummonPunished} (${formatPercent(ratio(m.lowStoneSummonPunished, m.lowStoneSummonTurns))})`);
  lines.push(`- summon uses / low-stone summon uses: ${m.summonUses}/${m.lowStoneSummonUses}`);
  lines.push(`- front / back summons: ${m.frontSummons}/${m.backSummons}`);
  lines.push(`- back summons without backline pattern: ${m.backSummonsWithoutBacklinePattern}`);
  lines.push(`- back summons blocked by own front / no-pattern blocked: ${m.backSummonsBlockedByOwnFront}/${m.backSummonsBlockedNoPattern}`);
  lines.push(`- same-turn wake / attack / work: ${m.summonSameTurnWake}/${m.summonSameTurnAttack}/${m.summonSameTurnWork}`);
  lines.push(`- summon target attacked by opponent: ${m.summonTargetAttacked}`);
  lines.push(`- placed-only / placed-only punished: ${m.summonPlacedOnly}/${m.summonPlacedOnlyPunished}`);
  lines.push(`- worked / moved / no next work: ${m.summonWorkedNextTurn}/${m.summonMovedNextTurn}/${m.summonNoNextWork}`);
  lines.push(`- no next work and low-stone punished: ${m.summonNoNextWorkPunished}`);
  lines.push(`- no next work, not attacked, and low-stone punished: ${m.summonNoWorkNoAttackPunished}`);
  lines.push(`- killed / survived before next own turn: ${m.summonKilledBeforeNextOwn}/${m.summonSurvivedNextOwn}`);
  lines.push(`- fills last back slot / leaves no back slot: ${m.summonFillsLastBackSlot}/${m.summonLeavesNoBackSlot}`);
  lines.push(`- fills/leaves no back slot with backline-work card in hand: ${m.summonFillsLastBackSlotWithBacklineWorkInHand}/${m.summonLeavesNoBackSlotWithBacklineWorkInHand}`);
  lines.push(`- summon with opponent level gain: ${m.summonWithOpponentLevelGain}`);
  lines.push(`- average placed-only summon own board swing: ${m.averagePlacedOnlySummonOwnBoardSwing}`);
  lines.push("");
  lines.push("### Summon Card Buckets");
  lines.push("");
  lines.push("| card | summons | low stone | punished | low stone punished | worked next | no next work |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|");
  for (const [name, bucket] of Object.entries(report.summonCardBuckets)) {
    lines.push(
      `| ${escapeMarkdownTableCell(name)} | ${bucket.summons} | ${bucket.lowStone} | ${bucket.punished} | ` +
        `${bucket.lowStonePunished} | ${bucket.workedNextTurn} | ${bucket.noNextWork} |`,
    );
  }
  lines.push("");
  lines.push("## Conclusion");
  lines.push("");
  report.conclusion.forEach((line) => lines.push(`- ${line}`));
  lines.push("");
  lines.push("## Next Loop Proposal");
  lines.push("");
  if (report.nextLoopProposal.length === 0) {
    lines.push("- 今回の母数ではfocus/召喚に明確な集中箇所なし。別軸の監査へ移る。");
  } else {
    report.nextLoopProposal.forEach((line) => lines.push(`- ${line}`));
  }
  lines.push("");
  lines.push("## Samples");
  lines.push("");
  lines.push(
    "| kind | seed | seat | turn | S | punished | ownBoard | board | hp | lost | oppLv+ | subject | details | decisions | opponent response | next own decisions | handoff | next own turn |",
  );
  lines.push("|---|---:|---|---:|---:|---|---:|---:|---:|---:|---:|---|---|---|---|---|---|---|");
  for (const sample of report.samples) {
    lines.push(
      `| ${sample.kind} | ${sample.seed} | ${sample.seat} | ${sample.turnNumber} | ${sample.finalStones} | ` +
        `${sample.punished ? "yes" : "no"} | ${sample.ownBoardSwing} | ${sample.boardSwing} | ${sample.hpSwing} | ` +
        `${sample.ownLost} | ${sample.opponentLevelGain} | ${escapeMarkdownTableCell(sample.subject)} | ` +
        `${escapeMarkdownTableCell(sample.details)} | ${escapeMarkdownTableCell(sample.decisions)} | ` +
        `${escapeMarkdownTableCell(sample.opponentResponse)} | ${escapeMarkdownTableCell(sample.nextOwnDecisions)} | ` +
        `${escapeMarkdownTableCell(sample.handoff)} | ${escapeMarkdownTableCell(sample.nextOwnTurn)} |`,
    );
  }
  return lines.join("\n");
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

function summonCardForEvent(event: MasterLabDecisionEvent, fallbackCardId: string): MasterLabHandCardSummary {
  const instanceId = summonHandInstanceIdForDecision(event.decision) ?? "";
  const card = event.currentPlayerHand?.find((candidate) => candidate.instanceId === instanceId);
  if (card) {
    return card;
  }
  return {
    instanceId,
    cardId: fallbackCardId,
    cardName: safeCardName(fallbackCardId),
    type: "monster",
    role: safeMonsterRole(fallbackCardId),
  };
}

function otherBacklineWorkCardsInHand(event: MasterLabDecisionEvent, selectedInstanceId: string): number {
  return (event.currentPlayerHand ?? []).filter((card) =>
    card.instanceId !== selectedInstanceId &&
    card.type === "monster" &&
    monsterHasBacklineAttackPattern(card.cardId)
  ).length;
}

function boardBalance(summary: MasterLabGameStateSummary, seat: PlayerId): number {
  return boardValue(summary, seat) - boardValue(summary, opponentOf(seat));
}

function hpBalance(summary: MasterLabGameStateSummary, seat: PlayerId): number {
  return summary.players[seat].hp - summary.players[opponentOf(seat)].hp;
}

function boardValue(summary: MasterLabGameStateSummary, seat: PlayerId): number {
  return summary.slots.reduce((total, slot) => {
    if (!slot.card || slot.owner !== seat) {
      return total;
    }
    return total + (slot.level ?? 1) * 80 + (slot.hp ?? 0) * 18 + (slot.shielded ? 25 : 0);
  }, 0);
}

function ownMonsterCount(summary: MasterLabGameStateSummary, seat: PlayerId): number {
  return summary.slots.filter((slot) => slot.card && slot.owner === seat).length;
}

function level2PlusCount(summary: MasterLabGameStateSummary, seat: PlayerId): number {
  return summary.slots.filter((slot) => slot.card && slot.owner === seat && (slot.level ?? 1) >= 2).length;
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

function emptyMetrics(): FocusSummonMetrics {
  return {
    turns: 0,
    lowStoneHandoffs: 0,
    punishedHandoffs: 0,
    lowStonePunished: 0,
    lowStoneFocusTurns: 0,
    lowStoneFocusPunished: 0,
    lowStoneSummonTurns: 0,
    lowStoneSummonPunished: 0,
    lowStoneFocusAndSummonTurns: 0,
    focusUses: 0,
    lowStoneFocusUses: 0,
    focusTargetAttacked: 0,
    focusTargetKilledBeforeNextOwn: 0,
    focusTargetSurvivedNextOwn: 0,
    focusWorkedNextTurn: 0,
    focusMovedNextTurn: 0,
    focusNoNextWork: 0,
    focusNoNextWorkPunished: 0,
    focusWithOpponentLevelGain: 0,
    focusOnPrepared: 0,
    focusOnActive: 0,
    summonUses: 0,
    lowStoneSummonUses: 0,
    frontSummons: 0,
    backSummons: 0,
    backSummonsWithoutBacklinePattern: 0,
    backSummonsBlockedByOwnFront: 0,
    backSummonsBlockedNoPattern: 0,
    summonSameTurnWake: 0,
    summonSameTurnAttack: 0,
    summonSameTurnWork: 0,
    summonTargetAttacked: 0,
    summonPlacedOnly: 0,
    summonPlacedOnlyPunished: 0,
    summonWorkedNextTurn: 0,
    summonMovedNextTurn: 0,
    summonNoNextWork: 0,
    summonNoNextWorkPunished: 0,
    summonNoWorkNoAttackPunished: 0,
    summonKilledBeforeNextOwn: 0,
    summonSurvivedNextOwn: 0,
    summonFillsLastBackSlot: 0,
    summonLeavesNoBackSlot: 0,
    summonFillsLastBackSlotWithBacklineWorkInHand: 0,
    summonLeavesNoBackSlotWithBacklineWorkInHand: 0,
    summonWithOpponentLevelGain: 0,
    averageLowStoneOwnBoardSwing: 0,
    averageLowStoneHpSwing: 0,
    averageFocusNoWorkOwnBoardSwing: 0,
    averagePlacedOnlySummonOwnBoardSwing: 0,
  };
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    gamesPerMatchup: 2,
    seedStart: 970100,
    maxSteps: 220,
    maxTurns: 70,
    maxSamples: 48,
    variantId: "current_white_baseline",
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
  npm run audit:white-mirror-focus-summon -- [options]

Options:
  --games-per-matchup <n>  Games per seat. Default: 2
  --seed-start <n>         First seed. Default: 970100
  --max-steps <n>          Max steps per game. Default: 220
  --max-turns <n>          Max turns per game. Default: 70
  --max-samples <n>        Sample rows. Default: 48
  --variant <id>           Variant to audit. Default: current_white_baseline
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
