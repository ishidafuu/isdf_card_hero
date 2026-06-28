import { getCardName } from "../src/game/cards";
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
import type { PlayerId } from "../src/game/types";
import { escapeMarkdownTableCell, formatPercent, readInteger, readString, round, writeReport } from "./lib/cli";

type Outcome = "win" | "loss" | "draw";
type SlotRow = "front" | "back";

interface CliOptions extends WhiteAiTuningLoopOptions {
  markdownPath?: string;
  jsonPath?: string;
  maxSamples: number;
}

interface ShieldFollowupLossAuditReport {
  generatedAt: string;
  gamesPerMatchup: number;
  seedStart: number;
  variants: string[];
  opponents: string[];
  games: number;
  lossGames: number;
  lossGamesWithShield: number;
  metrics: ShieldFollowupMetrics;
  byVariant: VariantShieldFollowupAudit[];
  samples: ShieldFollowupSample[];
  notes: string[];
  nextLoopProposal: string[];
}

interface VariantShieldFollowupAudit {
  variantId: string;
  label: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  lossGamesWithShield: number;
  metrics: ShieldFollowupMetrics;
  byOpponent: OpponentShieldFollowupAudit[];
}

interface OpponentShieldFollowupAudit {
  opponentId: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  lossGamesWithShield: number;
  metrics: ShieldFollowupMetrics;
}

interface ShieldFollowupMetrics {
  shieldUses: number;
  targetSameTurnAttack: number;
  targetSameTurnFrontProcess: number;
  targetNextTurnAttack: number;
  targetNextTurnFrontProcess: number;
  targetNextTurnFrontDamageOrKill: number;
  targetNextTurnLevelUp: number;
  teamSameTurnAttack: number;
  teamSameTurnWake: number;
  teamSameTurnFrontProcess: number;
  teamSameTurnFrontDamageOrKill: number;
  teamNextTurnAttack: number;
  teamNextTurnWake: number;
  teamNextTurnFrontProcess: number;
  teamNextTurnFrontDamageOrKill: number;
  targetConnected: number;
  teamConnected: number;
  frontProcessConnected: number;
  noContactNoConnection: number;
  contactNoConnection: number;
  opponentContactsBeforeNextOwnTurn: number;
  opponentDamageBeforeNextOwnTurn: number;
  preservedToNextOwnTurn: number;
  removedBeforeNextOwnTurn: number;
  lowStoneAfterShield: number;
  veryLowStoneAfterShield: number;
  multiShieldTurn: number;
  secondOrLaterShield: number;
  sameTurnRetreatAfterShield: number;
  backRoleFrontRetreatAfterShield: number;
  shieldBeforeSameTurnWork: number;
}

interface ShieldFollowupSample {
  kind: string;
  variantId: string;
  opponentId: string;
  candidateSeat: PlayerId;
  seed: number;
  turnNumber: number;
  step: number;
  slotKey: string;
  card: string;
  role: string;
  afterStones: number;
  score: number;
  reason: string;
  flags: string;
  sameTurn: string;
  nextTurn: string;
  opponentResponse: string;
  board: string;
}

interface ShieldEventAudit {
  event: MasterLabDecisionEvent;
  variantId: string;
  opponentId: string;
  candidateSeat: PlayerId;
  slotKey: string;
  cardId: string;
  cardName: string;
  role: string;
  followup: ShieldFollowup;
}

interface ShieldFollowup {
  targetSameTurnAttack: boolean;
  targetSameTurnFrontProcess: boolean;
  targetNextTurnAttack: boolean;
  targetNextTurnFrontProcess: boolean;
  targetNextTurnFrontDamageOrKill: boolean;
  targetNextTurnLevelUp: boolean;
  teamSameTurnAttack: boolean;
  teamSameTurnWake: boolean;
  teamSameTurnFrontProcess: boolean;
  teamSameTurnFrontDamageOrKill: boolean;
  teamNextTurnAttack: boolean;
  teamNextTurnWake: boolean;
  teamNextTurnFrontProcess: boolean;
  teamNextTurnFrontDamageOrKill: boolean;
  targetConnected: boolean;
  teamConnected: boolean;
  frontProcessConnected: boolean;
  opponentContactsBeforeNextOwnTurn: number;
  opponentDamageBeforeNextOwnTurn: number;
  preservedToNextOwnTurn: boolean;
  removedBeforeNextOwnTurn: boolean;
  lowStoneAfterShield: boolean;
  veryLowStoneAfterShield: boolean;
  multiShieldTurn: boolean;
  secondOrLaterShield: boolean;
  sameTurnRetreatAfterShield: boolean;
  backRoleFrontRetreatAfterShield: boolean;
  shieldBeforeSameTurnWork: boolean;
  sameTurnDecisions: string[];
  nextTurnDecisions: string[];
  opponentResponses: string[];
}

type SummarySlot = MasterLabGameStateSummary["slots"][number];

const ALL_VARIANTS = [
  currentVariant("current_white_baseline", "現行: デスシープ3 / white", undefined, "暫定白最強デッキで現行white profileの盾後接続を監査する。"),
  currentVariant("current_wake_safe_work4", "候補: 安全ウェイク仕事 4", {
    situationalBias: { whiteWakeSafeWorkBonus: 4 },
  }, "味方ウェイクアップを、即仕事または次ターン仕事へ変換できる場面だけ軽く押す。"),
  currentVariant("current_shield_wake_quality", "候補: 盾/起動品質", {
    situationalBias: { whiteShieldThreatConversionBonus: 8, whiteWakeSafeWorkBonus: 4 },
  }, "守る価値のある盾と仕事へ変換できる起動だけを少し押す。"),
  currentVariant("current_threat_then_setup", "候補: 脅威処理後布石", {
    situationalBias: { whiteThreatSourceAttackBonus: 6, whiteSetupAfterThreatReductionBonus: 6 },
  }, "このターンの脅威処理を済ませてから、次ターンの布石へ入る順序を押す。"),
  currentVariant("current_shield_no_pressure4_wake4", "参考: ノープレッシャー盾抑制 4 / 安全ウェイク 4", {
    situationalBias: { whiteShieldNoPressurePenalty: 4, whiteWakeSafeWorkBonus: 4 },
  }, "前回候補との比較用。今回の主目的は盾を減らすことではなく、盾後接続の観察。"),
] as const satisfies readonly WhiteAiTuningVariant[];

const ALL_OPPONENTS = [
  CURRENT_WHITE_AI_BLACK_PRESSURE_STRONG_OPPONENT,
  CURRENT_WHITE_AI_BLACK_1375_PRESSURE_OPPONENT,
  CURRENT_WHITE_AI_DECOY_BACK_STABLE_OPPONENT,
  CURRENT_WHITE_AI_MIRROR_OPPONENT,
] as const satisfies readonly WhiteAiTuningOpponent[];

const DEFAULT_VARIANT_IDS = ["current_white_baseline"] as const;
const DEFAULT_OPPONENT_IDS = ["black_1375_pressure", "white_current_mirror"] as const;

const options = parseArgs(process.argv.slice(2));
const loopReport = runWhiteAiTuningLoop({ ...options, includeGameHistory: true });
const report = buildShieldFollowupReport(loopReport, options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
}

console.log(`White shield follow-up loss audit: ${report.variants.length} variants / ${report.games} games / ${report.lossGames} losses`);
for (const audit of report.byVariant) {
  console.log(
    `${audit.variantId}: ${audit.wins}-${audit.losses}-${audit.draws} ` +
      `S(loss) ${audit.metrics.shieldUses} team ${formatPercent(rate(audit.metrics.teamConnected, audit.metrics.shieldUses))} ` +
      `target ${formatPercent(rate(audit.metrics.targetConnected, audit.metrics.shieldUses))} ` +
      `front ${formatPercent(rate(audit.metrics.frontProcessConnected, audit.metrics.shieldUses))} ` +
      `no-contact/no-conn ${formatPercent(rate(audit.metrics.noContactNoConnection, audit.metrics.shieldUses))}`,
  );
}
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function buildShieldFollowupReport(
  loopReport: ReturnType<typeof runWhiteAiTuningLoop>,
  parsedOptions: CliOptions,
): ShieldFollowupLossAuditReport {
  const records = new Map<string, VariantShieldFollowupAudit>();
  const samples: ShieldFollowupSample[] = [];
  const total = emptyMetrics();
  let games = 0;
  let lossGames = 0;
  let lossGamesWithShield = 0;

  for (const variant of loopReport.variants) {
    records.set(variant.id, {
      variantId: variant.id,
      label: variant.label,
      games: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      lossGamesWithShield: 0,
      metrics: emptyMetrics(),
      byOpponent: loopReport.opponents.map((opponent) => ({
        opponentId: opponent.id,
        games: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        lossGamesWithShield: 0,
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
      if (outcome !== "loss") {
        continue;
      }

      lossGames += 1;
      const audits = auditLossGameShields(game.history ?? [], {
        variantId: run.variantId,
        opponentId: run.opponentId,
        candidateSeat: run.candidateSeat,
      });
      if (audits.length > 0) {
        lossGamesWithShield += 1;
        record.lossGamesWithShield += 1;
        if (opponentRecord) {
          opponentRecord.lossGamesWithShield += 1;
        }
      }
      for (const audit of audits) {
        addShieldAudit(total, audit);
        addShieldAudit(record.metrics, audit);
        if (opponentRecord) {
          addShieldAudit(opponentRecord.metrics, audit);
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
    lossGames,
    lossGamesWithShield,
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

function auditLossGameShields(
  history: readonly MasterLabDecisionEvent[],
  context: Pick<ShieldEventAudit, "variantId" | "opponentId" | "candidateSeat">,
): ShieldEventAudit[] {
  const audits: ShieldEventAudit[] = [];
  for (let index = 0; index < history.length; index += 1) {
    const event = history[index];
    if (!event || event.player !== context.candidateSeat || event.source !== "cpu") {
      continue;
    }
    const slotKey = shieldTargetSlotKeyForDecision(event.decision);
    if (!slotKey) {
      continue;
    }
    const slot = slotByKey(event.before, slotKey);
    if (!slot?.card || slot.owner !== context.candidateSeat) {
      continue;
    }
    audits.push({
      event,
      variantId: context.variantId,
      opponentId: context.opponentId,
      candidateSeat: context.candidateSeat,
      slotKey,
      cardId: slot.card,
      cardName: safeCardName(slot.card),
      role: safeMonsterRole(slot.card),
      followup: auditShieldFollowup(history, index, context.candidateSeat, slotKey, slot.card),
    });
  }
  return audits;
}

function auditShieldFollowup(
  history: readonly MasterLabDecisionEvent[],
  shieldEventIndex: number,
  candidateSeat: PlayerId,
  shieldTargetSlotKey: string,
  cardId: string,
): ShieldFollowup {
  const event = history[shieldEventIndex];
  const opponent = opponentOf(candidateSeat);
  const nextOwnTurn = nextOwnTurnWindowAfter(history, shieldEventIndex, candidateSeat);
  let trackedSlotKey = shieldTargetSlotKey;
  let targetSameTurnAttack = false;
  let targetSameTurnFrontProcess = false;
  let targetNextTurnAttack = false;
  let targetNextTurnFrontProcess = false;
  let targetNextTurnFrontDamageOrKill = false;
  let targetNextTurnLevelUp = false;
  let teamSameTurnAttack = false;
  let teamSameTurnWake = false;
  let teamSameTurnFrontProcess = false;
  let teamSameTurnFrontDamageOrKill = false;
  let teamNextTurnAttack = false;
  let teamNextTurnWake = false;
  let teamNextTurnFrontProcess = false;
  let teamNextTurnFrontDamageOrKill = false;
  let opponentContactsBeforeNextOwnTurn = 0;
  let opponentDamageBeforeNextOwnTurn = 0;
  let removedBeforeNextOwnTurn = false;
  let sameTurnRetreatAfterShield = false;
  let backRoleFrontRetreatAfterShield = false;
  const sameTurnDecisions: string[] = [];
  const nextTurnDecisions: string[] = [];
  const opponentResponses: string[] = [];

  for (let index = shieldEventIndex + 1; index < history.length; index += 1) {
    const current = history[index];
    if (!current) {
      continue;
    }
    if (nextOwnTurn && index >= nextOwnTurn.endIndex) {
      break;
    }

    if (current.player === candidateSeat && current.turnNumber === event.turnNumber) {
      sameTurnDecisions.push(current.decision);
      const moved = moveForDecision(current.decision);
      if (moved?.from === trackedSlotKey) {
        if (slotRow(moved.from) === "front" && slotRow(moved.to) === "back") {
          sameTurnRetreatAfterShield = true;
          backRoleFrontRetreatAfterShield = safeMonsterRole(cardId) === "back";
        }
        trackedSlotKey = moved.to;
      }
      if (current.decision.startsWith("master:wake_up->")) {
        teamSameTurnWake = true;
      }
      const attack = attackForEvent(current);
      if (attack) {
        teamSameTurnAttack = true;
        const frontResult = frontProcessResult(current, opponent);
        if (frontResult.processed) {
          teamSameTurnFrontProcess = true;
        }
        if (frontResult.damageOrKill) {
          teamSameTurnFrontDamageOrKill = true;
        }
        if (attack.actor === trackedSlotKey) {
          targetSameTurnAttack = true;
          if (frontResult.processed) {
            targetSameTurnFrontProcess = true;
          }
        }
      }
      continue;
    }

    if (nextOwnTurn && index >= nextOwnTurn.startIndex && index < nextOwnTurn.endIndex) {
      nextTurnDecisions.push(current.decision);
      const moved = moveForDecision(current.decision);
      if (moved?.from === trackedSlotKey) {
        trackedSlotKey = moved.to;
      }
      if (current.decision.startsWith("master:wake_up->")) {
        teamNextTurnWake = true;
      }
      const attack = attackForEvent(current);
      if (attack) {
        teamNextTurnAttack = true;
        const frontResult = frontProcessResult(current, opponent);
        if (frontResult.processed) {
          teamNextTurnFrontProcess = true;
        }
        if (frontResult.damageOrKill) {
          teamNextTurnFrontDamageOrKill = true;
        }
        if (attack.actor === trackedSlotKey && slotBelongsToCard(current.before, trackedSlotKey, cardId, candidateSeat)) {
          targetNextTurnAttack = true;
          if (frontResult.processed) {
            targetNextTurnFrontProcess = true;
          }
          if (frontResult.damageOrKill) {
            targetNextTurnFrontDamageOrKill = true;
          }
        }
      }
      if (slotLevelsUpInEvent(current, trackedSlotKey, cardId, candidateSeat)) {
        targetNextTurnLevelUp = true;
      }
      continue;
    }

    if (nextOwnTurn && index >= nextOwnTurn.startIndex) {
      continue;
    }
    if (current.player !== opponent) {
      continue;
    }
    if (opponentResponses.length < 4) {
      opponentResponses.push(current.decision);
    }
    const before = slotByKey(current.before, trackedSlotKey);
    if (before?.owner !== candidateSeat || before.card !== cardId) {
      continue;
    }
    const after = slotByKey(current.after, trackedSlotKey);
    const afterStillSame = after?.owner === candidateSeat && after.card === cardId;
    const beforeHp = before.hp ?? 0;
    const afterHp = afterStillSame ? after.hp ?? 0 : 0;
    if (afterHp < beforeHp || !afterStillSame) {
      opponentContactsBeforeNextOwnTurn += 1;
      opponentDamageBeforeNextOwnTurn += Math.max(0, beforeHp - afterHp);
    }
    if (!afterStillSame) {
      removedBeforeNextOwnTurn = true;
      break;
    }
  }

  const preservedToNextOwnTurn = !!nextOwnTurn && !removedBeforeNextOwnTurn &&
    slotBelongsToCard(history[nextOwnTurn.startIndex].before, trackedSlotKey, cardId, candidateSeat);
  const targetConnected = targetSameTurnAttack || targetSameTurnFrontProcess || targetNextTurnAttack ||
    targetNextTurnFrontProcess || targetNextTurnLevelUp;
  const teamConnected = teamSameTurnAttack || teamSameTurnWake || teamSameTurnFrontProcess ||
    teamNextTurnAttack || teamNextTurnWake || teamNextTurnFrontProcess;
  const frontProcessConnected = targetSameTurnFrontProcess || targetNextTurnFrontProcess ||
    teamSameTurnFrontProcess || teamNextTurnFrontProcess;
  const sameTurnShieldCount = sameTurnCpuDecisionCount(history, shieldEventIndex, candidateSeat, "master:shield->");
  const sameTurnShieldOrder = sameTurnCpuDecisionOrder(history, shieldEventIndex, candidateSeat, "master:shield->");
  const shieldBeforeSameTurnWork = sameTurnDecisions.some((decision) =>
    decision.startsWith("attack:") || decision.startsWith("master:wake_up->"),
  );

  return {
    targetSameTurnAttack,
    targetSameTurnFrontProcess,
    targetNextTurnAttack,
    targetNextTurnFrontProcess,
    targetNextTurnFrontDamageOrKill,
    targetNextTurnLevelUp,
    teamSameTurnAttack,
    teamSameTurnWake,
    teamSameTurnFrontProcess,
    teamSameTurnFrontDamageOrKill,
    teamNextTurnAttack,
    teamNextTurnWake,
    teamNextTurnFrontProcess,
    teamNextTurnFrontDamageOrKill,
    targetConnected,
    teamConnected,
    frontProcessConnected,
    opponentContactsBeforeNextOwnTurn,
    opponentDamageBeforeNextOwnTurn,
    preservedToNextOwnTurn,
    removedBeforeNextOwnTurn,
    lowStoneAfterShield: event.after.players[candidateSeat].stones <= 2,
    veryLowStoneAfterShield: event.after.players[candidateSeat].stones <= 1,
    multiShieldTurn: sameTurnShieldCount >= 2,
    secondOrLaterShield: sameTurnShieldOrder >= 2,
    sameTurnRetreatAfterShield,
    backRoleFrontRetreatAfterShield,
    shieldBeforeSameTurnWork,
    sameTurnDecisions,
    nextTurnDecisions,
    opponentResponses,
  };
}

function addShieldAudit(metrics: ShieldFollowupMetrics, audit: ShieldEventAudit): void {
  const f = audit.followup;
  metrics.shieldUses += 1;
  if (f.targetSameTurnAttack) metrics.targetSameTurnAttack += 1;
  if (f.targetSameTurnFrontProcess) metrics.targetSameTurnFrontProcess += 1;
  if (f.targetNextTurnAttack) metrics.targetNextTurnAttack += 1;
  if (f.targetNextTurnFrontProcess) metrics.targetNextTurnFrontProcess += 1;
  if (f.targetNextTurnFrontDamageOrKill) metrics.targetNextTurnFrontDamageOrKill += 1;
  if (f.targetNextTurnLevelUp) metrics.targetNextTurnLevelUp += 1;
  if (f.teamSameTurnAttack) metrics.teamSameTurnAttack += 1;
  if (f.teamSameTurnWake) metrics.teamSameTurnWake += 1;
  if (f.teamSameTurnFrontProcess) metrics.teamSameTurnFrontProcess += 1;
  if (f.teamSameTurnFrontDamageOrKill) metrics.teamSameTurnFrontDamageOrKill += 1;
  if (f.teamNextTurnAttack) metrics.teamNextTurnAttack += 1;
  if (f.teamNextTurnWake) metrics.teamNextTurnWake += 1;
  if (f.teamNextTurnFrontProcess) metrics.teamNextTurnFrontProcess += 1;
  if (f.teamNextTurnFrontDamageOrKill) metrics.teamNextTurnFrontDamageOrKill += 1;
  if (f.targetConnected) metrics.targetConnected += 1;
  if (f.teamConnected) metrics.teamConnected += 1;
  if (f.frontProcessConnected) metrics.frontProcessConnected += 1;
  if (f.opponentContactsBeforeNextOwnTurn === 0 && !f.teamConnected) metrics.noContactNoConnection += 1;
  if (f.opponentContactsBeforeNextOwnTurn > 0 && !f.teamConnected) metrics.contactNoConnection += 1;
  metrics.opponentContactsBeforeNextOwnTurn += f.opponentContactsBeforeNextOwnTurn;
  metrics.opponentDamageBeforeNextOwnTurn += f.opponentDamageBeforeNextOwnTurn;
  if (f.preservedToNextOwnTurn) metrics.preservedToNextOwnTurn += 1;
  if (f.removedBeforeNextOwnTurn) metrics.removedBeforeNextOwnTurn += 1;
  if (f.lowStoneAfterShield) metrics.lowStoneAfterShield += 1;
  if (f.veryLowStoneAfterShield) metrics.veryLowStoneAfterShield += 1;
  if (f.multiShieldTurn) metrics.multiShieldTurn += 1;
  if (f.secondOrLaterShield) metrics.secondOrLaterShield += 1;
  if (f.sameTurnRetreatAfterShield) metrics.sameTurnRetreatAfterShield += 1;
  if (f.backRoleFrontRetreatAfterShield) metrics.backRoleFrontRetreatAfterShield += 1;
  if (f.shieldBeforeSameTurnWork) metrics.shieldBeforeSameTurnWork += 1;
}

function addSamples(samples: ShieldFollowupSample[], audit: ShieldEventAudit, maxSamples: number): void {
  for (const kind of sampleKinds(audit)) {
    if (samples.length >= maxSamples || samples.filter((sample) => sample.kind === kind).length >= 5) {
      continue;
    }
    samples.push(formatSample(kind, audit));
  }
}

function sampleKinds(audit: ShieldEventAudit): string[] {
  const f = audit.followup;
  const kinds: string[] = [];
  if (!f.teamConnected && f.opponentContactsBeforeNextOwnTurn === 0) {
    kinds.push("no_contact_no_connection");
  }
  if (!f.teamConnected && f.opponentContactsBeforeNextOwnTurn > 0) {
    kinds.push("contact_no_connection");
  }
  if (f.removedBeforeNextOwnTurn && !f.teamConnected) {
    kinds.push("removed_without_connection");
  }
  if (f.lowStoneAfterShield && !f.teamConnected) {
    kinds.push("low_stone_no_connection");
  }
  if (f.multiShieldTurn && !f.teamConnected) {
    kinds.push("multi_shield_no_connection");
  }
  if (f.backRoleFrontRetreatAfterShield) {
    kinds.push("back_role_front_retreat_after_shield");
  } else if (f.sameTurnRetreatAfterShield) {
    kinds.push("shield_then_retreat");
  }
  if (f.shieldBeforeSameTurnWork) {
    kinds.push("shield_before_same_turn_work");
  }
  if (f.frontProcessConnected && f.teamConnected) {
    kinds.push("front_process_connected");
  }
  return kinds;
}

function formatSample(kind: string, audit: ShieldEventAudit): ShieldFollowupSample {
  const f = audit.followup;
  return {
    kind,
    variantId: audit.variantId,
    opponentId: audit.opponentId,
    candidateSeat: audit.candidateSeat,
    seed: audit.event.seed,
    turnNumber: audit.event.turnNumber,
    step: audit.event.step,
    slotKey: audit.slotKey,
    card: audit.cardName,
    role: audit.role,
    afterStones: audit.event.after.players[audit.candidateSeat].stones,
    score: round(audit.event.score, 1),
    reason: audit.event.reason,
    flags: formatFlags(f),
    sameTurn: shortList(f.sameTurnDecisions),
    nextTurn: shortList(f.nextTurnDecisions),
    opponentResponse: shortList(f.opponentResponses),
    board: formatBoard(audit.event.before),
  };
}

function formatFlags(followup: ShieldFollowup): string {
  return [
    followup.teamConnected ? "team-connected" : "team-not-connected",
    followup.targetConnected ? "target-connected" : "target-not-connected",
    followup.frontProcessConnected ? "front-process" : undefined,
    followup.opponentContactsBeforeNextOwnTurn > 0 ? `contact:${followup.opponentContactsBeforeNextOwnTurn}` : "no-contact",
    followup.removedBeforeNextOwnTurn ? "removed" : undefined,
    followup.lowStoneAfterShield ? "low-stone" : undefined,
    followup.multiShieldTurn ? "multi-shield-turn" : undefined,
    followup.shieldBeforeSameTurnWork ? "shield-before-work" : undefined,
    followup.sameTurnRetreatAfterShield ? "retreat-after-shield" : undefined,
  ].filter((value): value is string => !!value).join(", ");
}

function buildNotes(metrics: ShieldFollowupMetrics): string[] {
  const notes = [
    "この監査はAI本体を変更しない。負け試合に出たシールドだけを、同ターン/次自ターンの仕事へつながったかで分類する。",
    "`team-connected` は盾対象以外の攻撃/ウェイクも含む。`target-connected` は盾対象自身が攻撃/レベルアップへ変換されたケース。",
    "`front-process` は敵前衛への攻撃が選ばれたケースで、`front damage/kill` はその攻撃でHP減少または除去が発生したケース。",
  ];
  if (rate(metrics.noContactNoConnection, metrics.shieldUses) >= 0.12) {
    notes.push("接触も後続仕事もない盾が目立つため、単純な盾抑制ではなく、盾前後の行動順と仕事予定の有無を次に見る価値がある。");
  }
  if (rate(metrics.contactNoConnection, metrics.shieldUses) >= 0.15) {
    notes.push("相手に触られたが後続仕事へ残らない盾が一定数ある。守り切れない対象を守るより、相手に追加手数を強いるか、次ターンの処理役を残せたかで分ける必要がある。");
  }
  if (rate(metrics.shieldBeforeSameTurnWork, metrics.shieldUses) >= 0.18) {
    notes.push("盾の後に同ターン攻撃/ウェイクへ進んだ例が多い。相手反撃がない限り盾を最後に回す行動順候補を比較する価値がある。");
  }
  if (rate(metrics.multiShieldTurn, metrics.shieldUses) >= 0.18) {
    notes.push("負け試合で同ターン複数盾が多い。盾の枚数削減ではなく、2枚目盾が後続仕事を消していないかを局面条件で見る必要がある。");
  }
  if (rate(metrics.frontProcessConnected, metrics.shieldUses) < 0.3 && metrics.shieldUses >= 8) {
    notes.push("盾後に敵前衛処理へつながる割合が低い。白対白では盤面制圧優先なので、盾後の前衛処理予定を評価へ入れる候補がある。");
  }
  return notes;
}

function buildNextLoopProposal(metrics: ShieldFollowupMetrics): string[] {
  const steps: string[] = [];
  if (metrics.shieldUses === 0) {
    return ["対象seedでは負け試合中のシールドが出なかったため、games-per-matchup または対象相手を増やして再監査する。"];
  }
  if (rate(metrics.noContactNoConnection + metrics.contactNoConnection, metrics.shieldUses) >= 0.18) {
    steps.push("次は `shieldConnectionPlanAudit` として、シールド選択時に「この後または次自ターンに誰が何をする予定か」を候補評価ログへ出す。");
  }
  if (rate(metrics.shieldBeforeSameTurnWork, metrics.shieldUses) >= 0.12) {
    steps.push("シールド後に同ターン仕事へ進む例を seed 抽出し、`attack/wake/front-process -> shield` と `shield -> attack/wake/front-process` の順序比較を小母数で行う。");
  }
  if (rate(metrics.frontProcessConnected, metrics.shieldUses) < 0.35) {
    steps.push("白ミラー用に、盾後の敵前衛処理予定がある場合だけ盾の価値を上げる評価を検討する。係数ではなく `shield enables board-control follow-up` として局面化する。");
  }
  if (rate(metrics.multiShieldTurn, metrics.shieldUses) >= 0.15) {
    steps.push("同ターン2枚盾は、2枚目の後に仕事が残る場合だけ許す条件を設計する。単純ペナルティではなく `second shield keeps a converter alive` を見る。");
  }
  if (steps.length === 0) {
    steps.push("盾後接続の粗い欠陥は少ないため、次はシールド対象ではなく、シールド前に可能だった攻撃/ウェイク/前衛処理の代替手を比較する。");
  }
  return steps;
}

function formatMarkdown(report: ShieldFollowupLossAuditReport): string {
  return [
    "# White Shield Follow-up Loss Audit",
    "",
    `生成: ${report.generatedAt}`,
    `seedStart: ${report.seedStart}`,
    `候補: ${report.variants.join(", ")}`,
    `相手: ${report.opponents.join(", ")}`,
    `試行: ${report.gamesPerMatchup} games/matchup/direction`,
    `総試合: ${report.games}`,
    `負け試合: ${report.lossGames}`,
    `盾あり負け試合: ${report.lossGamesWithShield}`,
    "",
    "## Purpose",
    "",
    "盾をさらに減らすのではなく、負けseedのシールドが「攻撃」「ウェイクアップ」「敵前衛処理」へ接続できているかを見る。勝率採用判断ではなく、次の改善仮説を作るための監査。",
    "",
    "## Summary",
    "",
    formatMetricsSummary(report.metrics),
    "",
    "## Variant Metrics",
    "",
    "| Variant | W-L-D | Loss Shield | Team Conn | Target Conn | Front Proc | Front Dmg/Kill | Same Attack | Same Wake | Next Attack | Next Wake | NoContact NoConn | Contact NoConn | Removed | LowStone | MultiShield | Shield Before Work | Retreat |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...report.byVariant.map(formatVariantRow),
    "",
    "## Opponent Breakdown",
    "",
    "| Variant | Opponent | W-L-D | Loss Shield | Team Conn | Target Conn | Front Proc | NoContact NoConn | MultiShield |",
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
    "- `Team Conn`: 盾後、同ターンまたは次自ターンに自軍の攻撃/ウェイク/敵前衛処理が発生した割合。",
    "- `Target Conn`: 盾対象自身が同ターン/次自ターンに攻撃、敵前衛処理、レベルアップへ変換された割合。",
    "- `Front Proc`: 盾後の同ターン/次自ターンに敵前衛を攻撃した割合。",
    "- `NoContact NoConn`: 次自ターンまで相手に触られず、かつ後続仕事にもつながらなかった盾。",
    "- `Shield Before Work`: 同ターンに盾より後で攻撃またはウェイクアップをしているケース。相手反撃がないなら行動順の疑いがある。",
  ].join("\n");
}

function formatMetricsSummary(metrics: ShieldFollowupMetrics): string {
  return [
    `- 負け試合中のシールド: ${metrics.shieldUses}`,
    `- Team connected: ${metrics.teamConnected} (${formatPercent(rate(metrics.teamConnected, metrics.shieldUses))})`,
    `- Target connected: ${metrics.targetConnected} (${formatPercent(rate(metrics.targetConnected, metrics.shieldUses))})`,
    `- Front process connected: ${metrics.frontProcessConnected} (${formatPercent(rate(metrics.frontProcessConnected, metrics.shieldUses))})`,
    `- Front damage/kill: ${metrics.teamSameTurnFrontDamageOrKill + metrics.teamNextTurnFrontDamageOrKill} (${formatPercent(rate(metrics.teamSameTurnFrontDamageOrKill + metrics.teamNextTurnFrontDamageOrKill, metrics.shieldUses))})`,
    `- No contact / no connection: ${metrics.noContactNoConnection} (${formatPercent(rate(metrics.noContactNoConnection, metrics.shieldUses))})`,
    `- Contact / no connection: ${metrics.contactNoConnection} (${formatPercent(rate(metrics.contactNoConnection, metrics.shieldUses))})`,
    `- Low stone after shield: ${metrics.lowStoneAfterShield} (${formatPercent(rate(metrics.lowStoneAfterShield, metrics.shieldUses))})`,
    `- Multi-shield turn: ${metrics.multiShieldTurn} (${formatPercent(rate(metrics.multiShieldTurn, metrics.shieldUses))})`,
    `- Shield before same-turn work: ${metrics.shieldBeforeSameTurnWork} (${formatPercent(rate(metrics.shieldBeforeSameTurnWork, metrics.shieldUses))})`,
  ].join("\n");
}

function formatVariantRow(audit: VariantShieldFollowupAudit): string {
  const m = audit.metrics;
  return [
    escapeMarkdownTableCell(audit.variantId),
    `${audit.wins}-${audit.losses}-${audit.draws}`,
    m.shieldUses,
    formatCountRate(m.teamConnected, m.shieldUses),
    formatCountRate(m.targetConnected, m.shieldUses),
    formatCountRate(m.frontProcessConnected, m.shieldUses),
    formatCountRate(m.teamSameTurnFrontDamageOrKill + m.teamNextTurnFrontDamageOrKill, m.shieldUses),
    formatCountRate(m.teamSameTurnAttack, m.shieldUses),
    formatCountRate(m.teamSameTurnWake, m.shieldUses),
    formatCountRate(m.teamNextTurnAttack, m.shieldUses),
    formatCountRate(m.teamNextTurnWake, m.shieldUses),
    formatCountRate(m.noContactNoConnection, m.shieldUses),
    formatCountRate(m.contactNoConnection, m.shieldUses),
    formatCountRate(m.removedBeforeNextOwnTurn, m.shieldUses),
    formatCountRate(m.lowStoneAfterShield, m.shieldUses),
    formatCountRate(m.multiShieldTurn, m.shieldUses),
    formatCountRate(m.shieldBeforeSameTurnWork, m.shieldUses),
    formatCountRate(m.sameTurnRetreatAfterShield, m.shieldUses),
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatOpponentRow(variantId: string, audit: OpponentShieldFollowupAudit): string {
  const m = audit.metrics;
  return [
    escapeMarkdownTableCell(variantId),
    escapeMarkdownTableCell(audit.opponentId),
    `${audit.wins}-${audit.losses}-${audit.draws}`,
    m.shieldUses,
    formatCountRate(m.teamConnected, m.shieldUses),
    formatCountRate(m.targetConnected, m.shieldUses),
    formatCountRate(m.frontProcessConnected, m.shieldUses),
    formatCountRate(m.noContactNoConnection, m.shieldUses),
    formatCountRate(m.multiShieldTurn, m.shieldUses),
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatSamples(samples: readonly ShieldFollowupSample[]): string[] {
  if (samples.length === 0) {
    return ["該当サンプルなし。"];
  }
  return samples.flatMap((sample) => [
    `### ${sample.kind}: ${sample.card} seed ${sample.seed} turn ${sample.turnNumber}`,
    "",
    `- variant/opponent: \`${sample.variantId}\` vs \`${sample.opponentId}\` (${sample.candidateSeat})`,
    `- decision: ${sample.slotKey} / role ${sample.role} / stones after ${sample.afterStones} / score ${sample.score}`,
    `- flags: ${sample.flags}`,
    `- same turn: ${sample.sameTurn}`,
    `- next turn: ${sample.nextTurn}`,
    `- opponent response: ${sample.opponentResponse}`,
    `- reason: ${sample.reason}`,
    `- board: ${sample.board}`,
    "",
  ]);
}

function emptyMetrics(): ShieldFollowupMetrics {
  return {
    shieldUses: 0,
    targetSameTurnAttack: 0,
    targetSameTurnFrontProcess: 0,
    targetNextTurnAttack: 0,
    targetNextTurnFrontProcess: 0,
    targetNextTurnFrontDamageOrKill: 0,
    targetNextTurnLevelUp: 0,
    teamSameTurnAttack: 0,
    teamSameTurnWake: 0,
    teamSameTurnFrontProcess: 0,
    teamSameTurnFrontDamageOrKill: 0,
    teamNextTurnAttack: 0,
    teamNextTurnWake: 0,
    teamNextTurnFrontProcess: 0,
    teamNextTurnFrontDamageOrKill: 0,
    targetConnected: 0,
    teamConnected: 0,
    frontProcessConnected: 0,
    noContactNoConnection: 0,
    contactNoConnection: 0,
    opponentContactsBeforeNextOwnTurn: 0,
    opponentDamageBeforeNextOwnTurn: 0,
    preservedToNextOwnTurn: 0,
    removedBeforeNextOwnTurn: 0,
    lowStoneAfterShield: 0,
    veryLowStoneAfterShield: 0,
    multiShieldTurn: 0,
    secondOrLaterShield: 0,
    sameTurnRetreatAfterShield: 0,
    backRoleFrontRetreatAfterShield: 0,
    shieldBeforeSameTurnWork: 0,
  };
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

function outcomeFor(winner: PlayerId | undefined, candidateSeat: PlayerId): Outcome {
  if (winner === undefined) {
    return "draw";
  }
  return winner === candidateSeat ? "win" : "loss";
}

function frontProcessResult(event: MasterLabDecisionEvent, opponent: PlayerId): { processed: boolean; damageOrKill: boolean } {
  const target = targetSlotKeyForDecision(event.decision);
  if (!target || slotRow(target) !== "front") {
    return { processed: false, damageOrKill: false };
  }
  const before = slotByKey(event.before, target);
  if (before?.owner !== opponent || !before.card) {
    return { processed: false, damageOrKill: false };
  }
  const after = slotByKey(event.after, target);
  const afterStillSame = after?.owner === opponent && after.card === before.card;
  const beforeHp = before.hp ?? 0;
  const afterHp = afterStillSame ? after.hp ?? 0 : 0;
  return {
    processed: true,
    damageOrKill: !afterStillSame || afterHp < beforeHp,
  };
}

function nextOwnTurnWindowAfter(
  history: readonly MasterLabDecisionEvent[],
  eventIndex: number,
  candidateSeat: PlayerId,
): { startIndex: number; endIndex: number; turnNumber: number } | undefined {
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
  return {
    startIndex,
    endIndex: endIndex < 0 ? history.length : endIndex,
    turnNumber,
  };
}

function sameTurnCpuDecisionCount(
  history: readonly MasterLabDecisionEvent[],
  eventIndex: number,
  candidateSeat: PlayerId,
  prefix: string,
): number {
  const event = history[eventIndex];
  if (!event) {
    return 0;
  }
  return history.filter((candidate) =>
    candidate.player === candidateSeat &&
    candidate.source === "cpu" &&
    candidate.turnNumber === event.turnNumber &&
    candidate.decision.startsWith(prefix),
  ).length;
}

function sameTurnCpuDecisionOrder(
  history: readonly MasterLabDecisionEvent[],
  eventIndex: number,
  candidateSeat: PlayerId,
  prefix: string,
): number {
  const event = history[eventIndex];
  if (!event) {
    return 0;
  }
  return history.slice(0, eventIndex + 1).filter((candidate) =>
    candidate.player === candidateSeat &&
    candidate.source === "cpu" &&
    candidate.turnNumber === event.turnNumber &&
    candidate.decision.startsWith(prefix),
  ).length;
}

function slotLevelsUpInEvent(
  event: MasterLabDecisionEvent,
  trackedSlotKey: string,
  cardId: string,
  owner: PlayerId,
): boolean {
  const before = slotByKey(event.before, trackedSlotKey);
  const after = slotByKey(event.after, trackedSlotKey);
  return !!(
    before?.owner === owner &&
    after?.owner === owner &&
    before.card === cardId &&
    after.card === cardId &&
    before.level !== undefined &&
    after.level !== undefined &&
    after.level > before.level
  );
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

function attackForEvent(event: MasterLabDecisionEvent): { actor: string; target?: string } | undefined {
  if (!event.decision.startsWith("attack:")) {
    return undefined;
  }
  const actor = event.decision.split(":")[1];
  if (!actor) {
    return undefined;
  }
  return { actor, target: targetSlotKeyForDecision(event.decision) };
}

function moveForDecision(decision: string): { from: string; to: string } | undefined {
  if (!decision.startsWith("move:")) {
    return undefined;
  }
  const [from, to] = decision.slice("move:".length).split("->");
  return from && to ? { from, to } : undefined;
}

function shieldTargetSlotKeyForDecision(decision: string): string | undefined {
  return decision.startsWith("master:shield->monster:")
    ? decision.slice("master:shield->monster:".length)
    : undefined;
}

function targetSlotKeyForDecision(decision: string): string | undefined {
  const target = decision.split("->")[1];
  return target?.startsWith("monster:") ? target.slice("monster:".length) : undefined;
}

function slotByKey(summary: MasterLabGameStateSummary, slotKey: string): SummarySlot | undefined {
  return summary.slots.find((slot) => slot.slotKey === slotKey);
}

function slotRow(slotKey: string): SlotRow {
  return slotKey.includes("_front_") ? "front" : "back";
}

function opponentOf(playerId: PlayerId): PlayerId {
  return playerId === "player" ? "cpu" : "player";
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

function formatBoard(summary: MasterLabGameStateSummary): string {
  return summary.slots
    .filter((slot) => slot.card)
    .map((slot) => {
      const owner = slot.owner === "player" ? "P" : "C";
      const row = slotRow(slot.slotKey) === "front" ? "F" : "B";
      return `${owner}${row}:${safeCardName(slot.card ?? "?")} Lv${slot.level ?? "?"} HP${slot.hp ?? "?"}` +
        `${slot.status === "prepared" ? " prep" : ""}${slot.shielded ? " shield" : ""}`;
    })
    .join(" / ") || "-";
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
    gamesPerMatchup: 3,
    seedStart: 135200,
    maxSteps: 700,
    maxTurns: 160,
    maxSamples: 30,
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
  npm run lab:masters:white-shield-followup-loss -- [options]

Options:
  --variant <id>                Variant id. Repeatable. Default: current_white_baseline
  --opponent <id>               Opponent id. Repeatable. Default: black_1375_pressure, white_current_mirror
  --games-per-matchup <n>       Games per matchup/direction. Default: 3
  --seed-start <n>              First seed. Default: 135200
  --max-steps <n>               Step cap. Default: 700
  --max-turns <n>               Turn cap. Default: 160
  --max-samples <n>             Maximum samples in report. Default: 30
  --markdown <path>             Write markdown report.
  --json <path>                 Write JSON report.
`);
}
