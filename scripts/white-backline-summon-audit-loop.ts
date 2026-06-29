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
  blockedDeathSheepSummons: number;
  blockedDeathSheepSpecialLockSummons: number;
  deathSheepSpecialLockWins: number;
  deathSheepSpecialLockLosses: number;
  deathSheepSpecialLockCommandTotal: number;
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
  badWithNonSummonAlternative: number;
  badWithCloseNonSummonAlternative: number;
  badWithMediumNonSummonAlternative: number;
  badWithDistantNonSummonAlternative: number;
  badWithoutNonSummonAlternative: number;
  badBestNonSummonGapTotal: number;
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
  badWithBacklineWorkInDeck: number;
  badWithBacklineWorkInDeckTop5: number;
  badConsumesLastBackSlotWithBacklineWorkInDeck: number;
  badLeavesNoEmptyBackSlotWithBacklineWorkInDeck: number;
  badDeckBacklineWorkCardsTotal: number;
  badDeckTop5BacklineWorkCardsTotal: number;
  badDeckNoReachFrontCardsTotal: number;
}

interface DeathSheepSpecialLockAudit {
  applies: boolean;
  frontCardName?: string;
  frontLevel?: number;
  commandNames: string[];
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
  deathSheepSpecialLock: DeathSheepSpecialLockAudit;
  immediateWakeWork: boolean;
  followup: BacklineSummonFollowup;
  alternatives: BacklineAlternativeAudit;
  handPressure: BacklineHandPressureAudit;
  deckPressure: BacklineDeckPressureAudit;
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
type DeckCardSummary = NonNullable<MasterLabDecisionEvent["currentPlayerDeck"]>[number];

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

interface BacklineDeckPressureAudit {
  hasDeckTrace: boolean;
  remainingDeckCount: number;
  remainingBacklineWorkCards: DeckCardSummary[];
  remainingBacklineWorkTop5Cards: DeckCardSummary[];
  remainingNoReachFrontMonsters: DeckCardSummary[];
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
  deckPressure: string;
  specialLock: string;
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
  currentVariant("current_back_slot_reservation_plan80", "候補: 後列枠保存計画 80", {
    situationalBias: { whiteBackSlotReservationPlanBonus: 80 },
  }, "最後の後列枠を残し、山札上位の後列仕事カードを受けられる非召喚/前列行動を評価する。"),
  currentVariant("current_back_slot_reservation_plan140", "候補: 後列枠保存計画 140", {
    situationalBias: { whiteBackSlotReservationPlanBonus: 140 },
  }, "後列枠保存を中程度に重く見て、bad summon から非召喚行動へ逃がせるか確認する。"),
  currentVariant("current_back_slot_reservation_plan220", "候補: 後列枠保存計画 220", {
    situationalBias: { whiteBackSlotReservationPlanBonus: 220 },
  }, "非召喚代替との差が大きい bad summon まで救えるかを確認する強めの実験候補。"),
  currentVariant("current_low_stone_back_slot_alt80", "候補: 低石後列枠代替 80", {
    situationalBias: { whiteLowStoneBackSlotAlternativeBonus: 80 },
  }, "低石で最後の後列枠を後列射程なし前衛が潰しそうな時だけ、攻撃/ためる/終了/移動を押す。"),
  currentVariant("current_low_stone_back_slot_alt140", "候補: 低石後列枠代替 140", {
    situationalBias: { whiteLowStoneBackSlotAlternativeBonus: 140 },
  }, "同条件で、より強く非召喚のターン計画を押す。広域の枠保存ではなく低石過剰展開に限定する。"),
  currentVariant("current_last_back_slot_no_reach_guard35", "候補: 最後後列射程なしガード 35", {
    situationalBias: { whiteLastBackSlotNoReachSummonGuardPenalty: 35 },
  }, "最後の後列枠を、後列から仕事できない召喚で潰し、手札/山札上位の後列仕事カードが見える時だけ軽く抑える。"),
  currentVariant("current_last_back_slot_no_reach_guard55", "候補: 最後後列射程なしガード 55", {
    situationalBias: { whiteLastBackSlotNoReachSummonGuardPenalty: 55 },
  }, "同条件を中程度に抑える。future_state より狭く、召喚側だけを対象にする。"),
  currentVariant("current_last_back_slot_no_reach_guard75", "候補: 最後後列射程なしガード 75", {
    situationalBias: { whiteLastBackSlotNoReachSummonGuardPenalty: 75 },
  }, "bad summon をしっかり動かせるかを見る強めの候補。"),
  currentVariant("current_last_back_slot_no_reach_guard95", "候補: 最後後列射程なしガード 95", {
    situationalBias: { whiteLastBackSlotNoReachSummonGuardPenalty: 95 },
  }, "強すぎる時の勝敗副作用を確認する上限候補。"),
  currentVariant("current_death_sheep_special_lock90", "候補: デスシープ特技封じ 90", {
    situationalBias: { whiteDeathSheepSpecialLockPenalty: 90 },
  }, "デスシープを特技持ち前衛の後ろへ置いて下段特技を封じる召喚だけを抑える。"),
  currentVariant("current_death_sheep_special_lock130", "候補: デスシープ特技封じ 130", {
    situationalBias: { whiteDeathSheepSpecialLockPenalty: 130 },
  }, "デスシープ特技封じを強めに抑え、配置違和感が減るかと勝敗副作用を見る。"),
  currentVariant("current_black_guard35_sheep90", "候補: 黒用最後後列35+羊90", {
    situationalBias: {
      whiteLastBackSlotNoReachSummonGuardPenalty: 35,
      whiteDeathSheepSpecialLockPenalty: 90,
    },
  }, "黒相手で有効だった最後後列ガード35に、全体候補のデスシープ特技封じを組み合わせる。"),
  currentVariant("current_search_terminal_w3", "検索: terminal width 3", undefined, "評価係数を変えず、同ターン終盤面比較の幅だけを広げて後列枠問題が自然に減るか見る。", "white", {
    sameTurnSearchDepth: 3,
    sameTurnSearchWidth: 4,
    detailedWidth: 5,
    sameTurnTerminalPlanDepth: 6,
    sameTurnTerminalPlanWidth: 3,
    sameTurnTerminalPlanWeight: 2,
    sameTurnOpponentTerminalPlanDepth: 2,
    sameTurnOpponentTerminalPlanWidth: 1,
    sameTurnOpponentTerminalPlanWeight: 0.35,
  }),
  currentVariant("current_search_terminal_w4", "検索: terminal width 4", undefined, "終盤面候補をさらに広げ、配置余地を残す非召喚/前列行動が候補から落ちないか確認する。", "white", {
    sameTurnSearchDepth: 3,
    sameTurnSearchWidth: 5,
    detailedWidth: 6,
    sameTurnTerminalPlanDepth: 6,
    sameTurnTerminalPlanWidth: 4,
    sameTurnTerminalPlanWeight: 2,
    sameTurnOpponentTerminalPlanDepth: 2,
    sameTurnOpponentTerminalPlanWidth: 1,
    sameTurnOpponentTerminalPlanWeight: 0.35,
  }),
  currentVariant("current_back_slot_future_state40", "候補: 後列枠終盤面価値 40", {
    situationalBias: { whiteBackSlotFutureStateBonus: 40 },
  }, "1手ではなく最終盤面評価として、山札上位の後列仕事カードを受ける空き後列枠を評価する。"),
  currentVariant("current_back_slot_future_state55", "候補: 後列枠終盤面価値 55", {
    situationalBias: { whiteBackSlotFutureStateBonus: 55 },
  }, "40では弱く80では勝敗副作用が出たため、低めの中間値でbad減少と勝敗維持の境界を探る。"),
  currentVariant("current_back_slot_future_state60", "候補: 後列枠終盤面価値 60", {
    situationalBias: { whiteBackSlotFutureStateBonus: 60 },
  }, "55と65の間で、bad減少を残しつつ対黒副作用が出にくい境界を探る。"),
  currentVariant("current_back_slot_future_state65", "候補: 後列枠終盤面価値 65", {
    situationalBias: { whiteBackSlotFutureStateBonus: 65 },
  }, "後列枠価値を中間程度にし、badを下げつつ黒/白への副作用を抑えられるか確認する。"),
  currentVariant("current_back_slot_future_state80", "候補: 後列枠終盤面価値 80", {
    situationalBias: { whiteBackSlotFutureStateBonus: 80 },
  }, "終盤面で後列枠を残す価値を中程度に見て、予約召喚の副作用が自然に下がるか確認する。"),
  currentVariant("current_back_slot_future_state120", "候補: 後列枠終盤面価値 120", {
    situationalBias: { whiteBackSlotFutureStateBonus: 120 },
  }, "終盤面の後列枠価値を強め、bad summon 減少と勝敗副作用の境界を見る。"),
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
      `sheepLock ${audit.metrics.blockedDeathSheepSpecialLockSummons} ` +
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
      deathSheepSpecialLock: auditDeathSheepSpecialLock(slot.card, frontBlocker, context.candidateSeat),
      immediateWakeWork: event.reason.includes("即仕事") || event.reason.includes("ウェイク"),
      followup: auditFollowup(history, index, context.candidateSeat, slotKey, slot.card),
      alternatives: auditAlternatives(event),
      handPressure: auditHandPressure(event, context.candidateSeat),
      deckPressure: auditDeckPressure(event),
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

function auditDeckPressure(event: MasterLabDecisionEvent): BacklineDeckPressureAudit {
  const deck = event.currentPlayerDeck ?? [];
  const monsters = deck.filter((card) => card.type === "monster");
  const remainingBacklineWorkCards = monsters.filter((card) => monsterHasBacklineAttackPattern(card.cardId));
  const remainingBacklineWorkTop5Cards = remainingBacklineWorkCards.filter((card) => card.index < 5);
  const remainingNoReachFrontMonsters = monsters.filter((card) =>
    card.role === "front" && !monsterHasBacklineAttackPattern(card.cardId),
  );
  return {
    hasDeckTrace: !!event.currentPlayerDeck,
    remainingDeckCount: deck.length,
    remainingBacklineWorkCards,
    remainingBacklineWorkTop5Cards,
    remainingNoReachFrontMonsters,
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
  if (audit.cardId === "card_133") {
    metrics.blockedDeathSheepSummons += 1;
  }
  if (audit.deathSheepSpecialLock.applies) {
    metrics.blockedDeathSheepSpecialLockSummons += 1;
    metrics.deathSheepSpecialLockCommandTotal += audit.deathSheepSpecialLock.commandNames.length;
    if (audit.outcome === "loss") {
      metrics.deathSheepSpecialLockLosses += 1;
    } else if (audit.outcome === "win") {
      metrics.deathSheepSpecialLockWins += 1;
    }
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
    if (audit.alternatives.bestNonSummon) {
      metrics.badWithNonSummonAlternative += 1;
      metrics.badBestNonSummonGapTotal += audit.alternatives.bestNonSummon.deltaFromSelected;
      if (audit.alternatives.bestNonSummon.deltaFromSelected <= 100) {
        metrics.badWithMediumNonSummonAlternative += 1;
      }
      if (audit.alternatives.bestNonSummon.deltaFromSelected <= 200) {
        metrics.badWithDistantNonSummonAlternative += 1;
      }
    } else {
      metrics.badWithoutNonSummonAlternative += 1;
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
    if (audit.deckPressure.remainingBacklineWorkCards.length > 0) {
      metrics.badWithBacklineWorkInDeck += 1;
    }
    if (audit.deckPressure.remainingBacklineWorkTop5Cards.length > 0) {
      metrics.badWithBacklineWorkInDeckTop5 += 1;
    }
    if (audit.handPressure.consumesLastBackSlot && audit.deckPressure.remainingBacklineWorkCards.length > 0) {
      metrics.badConsumesLastBackSlotWithBacklineWorkInDeck += 1;
    }
    if (audit.handPressure.leavesNoEmptyBackSlot && audit.deckPressure.remainingBacklineWorkCards.length > 0) {
      metrics.badLeavesNoEmptyBackSlotWithBacklineWorkInDeck += 1;
    }
    metrics.badDeckBacklineWorkCardsTotal += audit.deckPressure.remainingBacklineWorkCards.length;
    metrics.badDeckTop5BacklineWorkCardsTotal += audit.deckPressure.remainingBacklineWorkTop5Cards.length;
    metrics.badDeckNoReachFrontCardsTotal += audit.deckPressure.remainingNoReachFrontMonsters.length;
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
  if (audit.deathSheepSpecialLock.applies) {
    kinds.push("death_sheep_special_lock");
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
    deckPressure: formatDeckPressure(audit.deckPressure),
    specialLock: formatDeathSheepSpecialLock(audit.deathSheepSpecialLock),
    nextTurn: shortList(audit.followup.nextTurnDecisions),
    board: formatBoard(audit.event.before),
  };
}

function formatFlags(audit: BacklineSummonAudit): string {
  return [
    audit.hasBacklinePattern ? "backline-pattern" : "no-backline-pattern",
    audit.deathSheepSpecialLock.applies ? "death-sheep-special-lock" : undefined,
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

function formatDeckPressure(pressure: BacklineDeckPressureAudit): string {
  if (!pressure.hasDeckTrace) {
    return "no-deck-trace";
  }
  return [
    `deck=${pressure.remainingDeckCount}`,
    `backWork=${formatDeckCards(pressure.remainingBacklineWorkCards)}`,
    `top5BackWork=${formatDeckCards(pressure.remainingBacklineWorkTop5Cards)}`,
    `noReachFront=${formatDeckCards(pressure.remainingNoReachFrontMonsters)}`,
  ].join(" / ");
}

function formatDeckCards(cards: readonly DeckCardSummary[], limit = 8): string {
  if (cards.length === 0) {
    return "-";
  }
  const shown = cards.slice(0, limit).map((card) => `${card.index + 1}:${card.cardName}`).join(",");
  return cards.length > limit ? `${shown},...(+${cards.length - limit})` : shown;
}

function formatDeathSheepSpecialLock(lock: DeathSheepSpecialLockAudit): string {
  if (!lock.applies) {
    return "-";
  }
  return `${lock.frontCardName ?? "unknown"} Lv${lock.frontLevel ?? "?"}: ${lock.commandNames.join(",")}`;
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
  if (rate(metrics.blockedDeathSheepSpecialLockSummons, metrics.blockedDeathSheepSummons) >= 0.2) {
    notes.push("デスシープ後列召喚の中に、味方前列の下段特技を封じる例が混ざっている。後列枠問題とは別に、前列特技の機会損失として監査・候補化すべき。");
  }
  if (metrics.badBlockedBacklineSummons > 0 && metrics.badWithEvaluationTrace < metrics.badBlockedBacklineSummons) {
    notes.push("一部の bad summon には候補評価traceがない。古い結果ファイルではなく、このスクリプトで再生成した履歴を使う必要がある。");
  }
  if (rate(metrics.badWithCloseNonSummonAlternative, metrics.badBlockedBacklineSummons) >= 0.4) {
    notes.push("bad summon の多くで近い非召喚代替がある。次は召喚ペナルティより、攻撃/ためる/終了との比較条件を詰める価値が高い。");
  }
  if (
    rate(metrics.badWithMediumNonSummonAlternative, metrics.badBlockedBacklineSummons) >= 0.4 &&
    rate(metrics.badWithCloseNonSummonAlternative, metrics.badBlockedBacklineSummons) < 0.4
  ) {
    notes.push("35点以内の近い非召喚代替は少なくても、100点以内なら存在する例が多い。召喚を禁止するより、非召喚側の局面評価を押し上げる余地がある。");
  }
  if (rate(metrics.badWithoutNonSummonAlternative, metrics.badBlockedBacklineSummons) >= 0.4) {
    notes.push("bad summon の多くで非召喚代替が候補上位に残っていない。召喚候補だけでなく、end_turn/focus/attack の候補品質も確認する必要がある。");
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
  if (rate(metrics.badConsumesLastBackSlotWithBacklineWorkInDeck, metrics.badBlockedBacklineSummons) >= 0.25) {
    notes.push("bad summon が最後の後列空き枠を潰し、かつ残り山札に後列仕事カードがある。手札だけでなく次以降のドロー枠を守る評価が必要。");
  }
  if (rate(metrics.badWithBacklineWorkInDeckTop5, metrics.badBlockedBacklineSummons) >= 0.25) {
    notes.push("bad summon 時点で山札上位5枚に後列仕事カードが残る例がある。近い将来の配置詰まりとして優先度を上げて見るべき。");
  }
  return notes;
}

function buildNextLoopProposal(metrics: BacklineSummonMetrics): string[] {
  if (metrics.blockedBacklineSummons === 0) {
    return ["対象seedでは詰まり後列召喚がほぼ出ていないため、games-per-matchupを増やすか、実戦で見たseedに寄せて再監査する。"];
  }
  const steps: string[] = [];
  if (metrics.blockedDeathSheepSpecialLockSummons > 0) {
    steps.push("デスシープを後列に置く候補は、同レーン前列の下段特技を封じる場合に `special lock loss` として別比較する。特にドノマンティスLv2など高打点/除去寄り特技持ちは、召喚評価から差し引く候補を作る。");
  }
  if (metrics.badBlockedBacklineSummons > 0) {
    if (rate(metrics.badConsumesLastBackSlotWithBacklineWorkInDeck, metrics.badBlockedBacklineSummons) >= 0.25) {
      steps.push("次候補は、最後の後列空き枠を潰す召喚で、残り山札に後列仕事カードがある場合を `summon now` と `hold slot` のターン計画比較に回す。");
    } else if (rate(metrics.badConsumesLastBackSlot, metrics.badBlockedBacklineSummons) >= 0.4) {
      steps.push("次候補は、後列射程なし前衛カードの召喚で最後の後列空き枠を潰す場合に、手札/山札圧迫や前列空き見込みがない限り保留する。");
    } else if (rate(metrics.badWithOtherBacklineWorkInHand, metrics.badBlockedBacklineSummons) >= 0.25) {
      steps.push("次候補は、手札に後列仕事カードがある場合、後列射程なし前衛カードより後列仕事カードの召喚を優先する。");
    } else if (rate(metrics.badWithMediumNonSummonAlternative, metrics.badBlockedBacklineSummons) >= 0.35) {
      steps.push("次候補は、bad summon で100点以内の非召喚代替がある局面に絞り、後列枠保存・次ターン配置余地を非召喚側の評価へ足す。");
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
    "| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Death Sheep Lock | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |",
    ...report.byVariant.map(formatVariantRow),
    "",
    "## Opponent Breakdown",
    "",
    "| Variant | Opponent | W-L-D | Blocked | Death Sheep Lock | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
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
    "- `Death Sheep Lock`: デスシープを後列に置いたことで、同レーン味方前列の下段特技を封じたケース。",
    "- `No Work`: 次自ターンにその召喚ユニットが攻撃も前進もしなかったケース。",
    "- `Bad`: Blocked + No Pattern + No Work を満たす、今回もっとも疑う後列召喚。",
    "- `Close Non-Summon`: Bad の局面で、選択召喚から35点以内に攻撃/ためる/移動/終了などの非召喚代替があったケース。",
    "- `Medium Non-Summon`: Bad の局面で、選択召喚から100点以内に非召喚代替があったケース。",
    "- `DeckReach`: Bad の局面で、残り山札に後列から仕事できるカードが残っていたケース。",
    "- `DeckTop5Reach`: Bad の局面で、山札上位5枚に後列から仕事できるカードが残っていたケース。",
  ].join("\n");
}

function formatMetricsSummary(metrics: BacklineSummonMetrics): string {
  return [
    `- 召喚: ${metrics.summons}`,
    `- 後列召喚: ${metrics.backlineSummons} (${formatPercent(rate(metrics.backlineSummons, metrics.summons))})`,
    `- 前列あり後列召喚: ${metrics.blockedBacklineSummons} (${formatPercent(rate(metrics.blockedBacklineSummons, metrics.backlineSummons))})`,
    `- うち前衛ロール: ${metrics.frontRoleBlockedBacklineSummons} (${formatPercent(rate(metrics.frontRoleBlockedBacklineSummons, metrics.blockedBacklineSummons))})`,
    `- デスシープ後列召喚: ${metrics.blockedDeathSheepSummons} (${formatPercent(rate(metrics.blockedDeathSheepSummons, metrics.blockedBacklineSummons))})`,
    `- デスシープ特技封じ損: ${metrics.blockedDeathSheepSpecialLockSummons} (${formatPercent(rate(metrics.blockedDeathSheepSpecialLockSummons, metrics.blockedDeathSheepSummons))}) / W-L ${metrics.deathSheepSpecialLockWins}-${metrics.deathSheepSpecialLockLosses}`,
    `- デスシープ特技封じ平均コマンド数: ${round(rate(metrics.deathSheepSpecialLockCommandTotal, metrics.blockedDeathSheepSpecialLockSummons), 2)}`,
    `- Backline patternあり: ${metrics.blockedWithBacklinePattern} (${formatPercent(rate(metrics.blockedWithBacklinePattern, metrics.blockedBacklineSummons))})`,
    `- Backline patternなし: ${metrics.blockedWithoutBacklinePattern} (${formatPercent(rate(metrics.blockedWithoutBacklinePattern, metrics.blockedBacklineSummons))})`,
    `- 次自ターン攻撃: ${metrics.blockedNextTurnAttack} (${formatPercent(rate(metrics.blockedNextTurnAttack, metrics.blockedBacklineSummons))})`,
    `- 次自ターン後列攻撃: ${metrics.blockedNextTurnBacklineAttack} (${formatPercent(rate(metrics.blockedNextTurnBacklineAttack, metrics.blockedBacklineSummons))})`,
    `- 次自ターン前進: ${metrics.blockedNextTurnMoveForward} (${formatPercent(rate(metrics.blockedNextTurnMoveForward, metrics.blockedBacklineSummons))})`,
    `- 次自ターン仕事なし: ${metrics.blockedNextTurnNoWork} (${formatPercent(rate(metrics.blockedNextTurnNoWork, metrics.blockedBacklineSummons))})`,
    `- Bad blocked summon: ${metrics.badBlockedBacklineSummons} (${formatPercent(rate(metrics.badBlockedBacklineSummons, metrics.blockedBacklineSummons))})`,
    `- Bad with evaluation trace: ${metrics.badWithEvaluationTrace} (${formatPercent(rate(metrics.badWithEvaluationTrace, metrics.badBlockedBacklineSummons))})`,
    `- Bad with non-summon alt: ${metrics.badWithNonSummonAlternative} (${formatPercent(rate(metrics.badWithNonSummonAlternative, metrics.badBlockedBacklineSummons))})`,
    `- Bad close non-summon alt: ${metrics.badWithCloseNonSummonAlternative} (${formatPercent(rate(metrics.badWithCloseNonSummonAlternative, metrics.badBlockedBacklineSummons))})`,
    `- Bad medium non-summon alt <=100: ${metrics.badWithMediumNonSummonAlternative} (${formatPercent(rate(metrics.badWithMediumNonSummonAlternative, metrics.badBlockedBacklineSummons))})`,
    `- Bad distant non-summon alt <=200: ${metrics.badWithDistantNonSummonAlternative} (${formatPercent(rate(metrics.badWithDistantNonSummonAlternative, metrics.badBlockedBacklineSummons))})`,
    `- Bad avg best non-summon gap: ${round(rate(metrics.badBestNonSummonGapTotal, metrics.badWithNonSummonAlternative), 1)}`,
    `- Bad top summon alt: ${metrics.badTopSummonAlternative} (${formatPercent(rate(metrics.badTopSummonAlternative, metrics.badBlockedBacklineSummons))})`,
    `- Bad top summon same card: ${metrics.badTopSummonSameCard} (${formatPercent(rate(metrics.badTopSummonSameCard, metrics.badTopSummonAlternative))})`,
    `- Bad top summon backline pattern: ${metrics.badTopSummonBacklinePattern} (${formatPercent(rate(metrics.badTopSummonBacklinePattern, metrics.badTopSummonAlternative))})`,
    `- Bad with other backline work in hand: ${metrics.badWithOtherBacklineWorkInHand} (${formatPercent(rate(metrics.badWithOtherBacklineWorkInHand, metrics.badBlockedBacklineSummons))})`,
    `- Bad consumes last back slot: ${metrics.badConsumesLastBackSlot} (${formatPercent(rate(metrics.badConsumesLastBackSlot, metrics.badBlockedBacklineSummons))})`,
    `- Bad leaves no empty back slot: ${metrics.badLeavesNoEmptyBackSlot} (${formatPercent(rate(metrics.badLeavesNoEmptyBackSlot, metrics.badBlockedBacklineSummons))})`,
    `- Avg no-reach front cards in back after bad: ${round(rate(metrics.badNoReachFrontBackSlotsAfterTotal, metrics.badBlockedBacklineSummons), 2)}`,
    `- Bad with deck backline work: ${metrics.badWithBacklineWorkInDeck} (${formatPercent(rate(metrics.badWithBacklineWorkInDeck, metrics.badBlockedBacklineSummons))})`,
    `- Bad with deck top5 backline work: ${metrics.badWithBacklineWorkInDeckTop5} (${formatPercent(rate(metrics.badWithBacklineWorkInDeckTop5, metrics.badBlockedBacklineSummons))})`,
    `- Bad consumes last back slot with deck backline work: ${metrics.badConsumesLastBackSlotWithBacklineWorkInDeck} (${formatPercent(rate(metrics.badConsumesLastBackSlotWithBacklineWorkInDeck, metrics.badBlockedBacklineSummons))})`,
    `- Avg deck backline work cards after bad: ${round(rate(metrics.badDeckBacklineWorkCardsTotal, metrics.badBlockedBacklineSummons), 2)}`,
    `- Avg deck top5 backline work cards after bad: ${round(rate(metrics.badDeckTop5BacklineWorkCardsTotal, metrics.badBlockedBacklineSummons), 2)}`,
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
    formatCountRate(m.blockedDeathSheepSpecialLockSummons, m.blockedDeathSheepSummons),
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
    formatCountRate(m.blockedDeathSheepSpecialLockSummons, m.blockedDeathSheepSummons),
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
    `- deck pressure: ${sample.deckPressure}`,
    `- special lock: ${sample.specialLock}`,
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
    blockedDeathSheepSummons: 0,
    blockedDeathSheepSpecialLockSummons: 0,
    deathSheepSpecialLockWins: 0,
    deathSheepSpecialLockLosses: 0,
    deathSheepSpecialLockCommandTotal: 0,
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
    badWithNonSummonAlternative: 0,
    badWithCloseNonSummonAlternative: 0,
    badWithMediumNonSummonAlternative: 0,
    badWithDistantNonSummonAlternative: 0,
    badWithoutNonSummonAlternative: 0,
    badBestNonSummonGapTotal: 0,
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
    badWithBacklineWorkInDeck: 0,
    badWithBacklineWorkInDeckTop5: 0,
    badConsumesLastBackSlotWithBacklineWorkInDeck: 0,
    badLeavesNoEmptyBackSlotWithBacklineWorkInDeck: 0,
    badDeckBacklineWorkCardsTotal: 0,
    badDeckTop5BacklineWorkCardsTotal: 0,
    badDeckNoReachFrontCardsTotal: 0,
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

function auditDeathSheepSpecialLock(
  cardId: string,
  frontBlocker: SummarySlot | undefined,
  candidateSeat: PlayerId,
): DeathSheepSpecialLockAudit {
  if (cardId !== "card_133" || frontBlocker?.owner !== candidateSeat || !frontBlocker.card) {
    return { applies: false, commandNames: [] };
  }
  const commandNames = lowerImplementedCommandNamesAtLevel(frontBlocker.card, frontBlocker.level ?? 1);
  return {
    applies: commandNames.length > 0,
    frontCardName: safeCardName(frontBlocker.card),
    frontLevel: frontBlocker.level,
    commandNames,
  };
}

function lowerImplementedCommandNamesAtLevel(cardId: string, level: number): string[] {
  const def = getMonsterDef(cardId);
  const levelDef = def.levels.find((candidate) => candidate.level === level) ??
    def.levels[Math.max(0, level - 1)] ??
    def.levels[0];
  if (!levelDef) {
    return [];
  }
  return levelDef.commands
    .slice(1)
    .filter((command) => command.implemented !== false)
    .map((command) => command.name);
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
    metrics.badWithMediumNonSummonAlternative > 0 ? `NonSum100${metrics.badWithMediumNonSummonAlternative}` : undefined,
    metrics.badWithOtherBacklineWorkInHand > 0 ? `HandReach${metrics.badWithOtherBacklineWorkInHand}` : undefined,
    metrics.badWithBacklineWorkInDeck > 0 ? `DeckReach${metrics.badWithBacklineWorkInDeck}` : undefined,
    metrics.badWithBacklineWorkInDeckTop5 > 0 ? `DeckTop5Reach${metrics.badWithBacklineWorkInDeckTop5}` : undefined,
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
    } else if (arg === "--no-eval-trace") {
      parsed.includeCpuDecisionEvaluations = false;
    } else if (arg === "--blocked-summon-eval-trace") {
      parsed.includeCpuDecisionEvaluations = "selected_blocked_backline_summon";
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
  --no-eval-trace               Keep game history but skip expensive CPU evaluation trace.
  --blocked-summon-eval-trace   Trace CPU alternatives only when the selected action is a blocked backline summon.
  --markdown <path>             Write markdown report.
  --json <path>                 Write JSON report.
`);
}
