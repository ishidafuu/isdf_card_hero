import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { getCardName, getMonsterDef } from "../src/game/cards";
import { getMonsterAiTrait } from "../src/game/aiUnitTraits";
import { getCommandTargets } from "../src/game/ruleEngine/targeting";
import { DEFAULT_PLAYER_DECK_PRESET_ID } from "../src/game/defaultDeckPresets";
import {
  DEFAULT_WHITE_AI_TUNING_OPPONENTS,
  DEFAULT_WHITE_AI_TUNING_VARIANTS,
  runWhiteAiTuningLoop,
  type WhiteAiTuningLoopOptions,
  type WhiteAiTuningOpponent,
  type WhiteAiTuningVariant,
} from "../src/game/whiteAiTuningLoop";
import type { DeckPresetId } from "../src/game/deckPresets";
import type { CpuAiTuning } from "../src/game/cpuAi";
import type { MasterLabDecisionEvent, MasterLabGameStateSummary } from "../src/game/masterLabAutoPlay";
import type { GameState, MonsterState, PlayerId, SlotKey, SlotState } from "../src/game/types";

type Outcome = "win" | "loss" | "draw";

interface CliOptions extends WhiteAiTuningLoopOptions {
  markdownPath?: string;
  jsonPath?: string;
  opponentIds?: string[];
}

interface ShieldUsageAuditReport {
  generatedAt: string;
  gamesPerMatchup: number;
  variants: string[];
  opponents: string[];
  runs: number;
  games: number;
  metrics: ShieldAuditMetrics;
  byVariant: VariantShieldAudit[];
  samples: ShieldAuditSample[];
  notes: string[];
  nextLoopProposal: string[];
}

interface VariantShieldAudit {
  variantId: string;
  label: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  metrics: ShieldAuditMetrics;
}

interface ShieldAuditMetrics {
  shieldUses: number;
  predictedNoPressure: number;
  predictedNoMonsterPressure: number;
  predictedMasterAttackAvailable: number;
  predictedMasterAttackOnly: number;
  predictedMasterAttackChangesLethal: number;
  predictedNoShieldDamageTotal: number;
  predictedWithShieldDamageTotal: number;
  actualContactsBeforeNextOwnTurn: number;
  actualDamageBeforeNextOwnTurn: number;
  preservedToNextOwnTurn: number;
  removedBeforeNextOwnTurn: number;
  forcedExtraActionProxy: number;
  singleContactRemoved: number;
  noContactNoConversion: number;
  convertedNextOwnTurn: number;
  nextOwnTurnAttack: number;
  nextOwnTurnLevelUp: number;
  sameTurnRetreatAfterShield: number;
  frontBackRoleShieldThenRetreat: number;
  lowStoneAfterShield: number;
  secondShieldSameTurn: number;
  lowStoneSecondShield: number;
  lethalReasonStillRemoved: number;
}

interface ShieldAuditSample {
  kind: string;
  variantId: string;
  opponentId: string;
  candidateSeat: PlayerId;
  outcome: Outcome;
  seed: number;
  step: number;
  turnNumber: number;
  slotKey: string;
  card: string;
  reason: string;
  score: number;
  predictedNoShieldDamage: number;
  predictedWithShieldDamage: number;
  actualContacts: number;
  actualDamage: number;
  removedBeforeNextOwnTurn: boolean;
  convertedNextOwnTurn: boolean;
  board: string;
}

interface ShieldEventAudit {
  event: MasterLabDecisionEvent;
  variantId: string;
  opponentId: string;
  candidateSeat: PlayerId;
  outcome: Outcome;
  slotKey: string;
  cardId: string;
  cardName: string;
  role: "front" | "back";
  estimate: DamageEstimate;
  outcomeAudit: ShieldOutcomeAudit;
}

interface DamageEstimate {
  monsterMaxNoShield: number;
  monsterMaxWithShield: number;
  masterAttackNoShield: number;
  masterAttackWithShield: number;
  noShieldDamage: number;
  withShieldDamage: number;
  sourceCount: number;
}

interface ShieldOutcomeAudit {
  actualContacts: number;
  actualDamage: number;
  preservedToNextOwnTurn: boolean;
  removedBeforeNextOwnTurn: boolean;
  forcedExtraActionProxy: boolean;
  singleContactRemoved: boolean;
  noContactNoConversion: boolean;
  convertedNextOwnTurn: boolean;
  nextOwnTurnAttack: boolean;
  nextOwnTurnLevelUp: boolean;
  sameTurnRetreatAfterShield: boolean;
  frontBackRoleShieldThenRetreat: boolean;
  lowStoneAfterShield: boolean;
  secondShieldSameTurn: boolean;
  lowStoneSecondShield: boolean;
  lethalReasonStillRemoved: boolean;
}

type SummarySlot = MasterLabGameStateSummary["slots"][number];

const DEFAULT_VARIANT_IDS = [
  "current_white_baseline",
  "current_shield_no_pressure8",
  "current_shield_breakthrough12",
  "current_shield_quality_combo",
  "current_second_shield_guard",
] as const;

const DEFAULT_OPPONENT_IDS = [
  "black_pressure_strong",
  "black_1375_pressure",
  "white_current_mirror",
] as const;

const CURRENT_WHITE_DECK = DEFAULT_PLAYER_DECK_PRESET_ID;

const CURRENT_SHIELD_AUDIT_VARIANTS = [
  currentVariant("current_white_baseline", "現行: デスシープ3 / white", undefined, "暫定白最強デッキで現行white profileのシールド品質を監査する。"),
  currentVariant("current_shield_no_pressure8", "候補: ノープレッシャー盾抑制8", {
    situationalBias: { whiteShieldNoPressurePenalty: 8 },
  }, "相手の次ターン打点が見えないシールドを抑える。成果化シールドは除外される。"),
  currentVariant("current_shield_breakthrough12", "候補: 突破盾抑制12", {
    situationalBias: { whiteShieldBreakthroughPenalty: 12 },
  }, "盾を張っても致死圏のままなら、守り切れない盾として抑える。"),
  currentVariant("current_shield_quality_combo", "候補: 盾品質コンボ", {
    situationalBias: {
      whiteShieldThreatConversionBonus: 8,
      whiteShieldNoPressurePenalty: 8,
      whiteShieldBreakthroughPenalty: 12,
    },
  }, "脅威軽減/成果化する盾だけ押し、ノープレッシャー盾と突破される盾を同時に抑える。"),
  currentVariant("current_second_shield_guard", "候補: 2枚目盾低石抑制", {
    situationalBias: { whiteSecondShieldLowStonePenalty: 8, whiteSecondShieldCommitmentPenalty: 8 },
  }, "同ターン2枚目の盾、特に低石化する盾を抑える。"),
] as const satisfies readonly WhiteAiTuningVariant[];

const CURRENT_SHIELD_AUDIT_OPPONENTS = [
  {
    id: "black_1375_pressure",
    category: "black",
    label: "黒: 1375 / pressure",
    participant: "black",
    deckPreset: "submission-pro-no-rare8-black-1375",
    aiProfile: "pressure",
  },
  {
    id: "white_current_mirror",
    category: "white",
    label: "白: 暫定白最強ミラー / white",
    participant: "white",
    deckPreset: CURRENT_WHITE_DECK,
    aiProfile: "white",
  },
] as const satisfies readonly WhiteAiTuningOpponent[];

function currentVariant(
  id: string,
  label: string,
  tuning: CpuAiTuning | undefined,
  hypothesis: string,
): WhiteAiTuningVariant {
  return {
    id,
    kind: tuning ? "hybrid" : "baseline",
    label,
    deckPreset: CURRENT_WHITE_DECK as DeckPresetId,
    aiProfile: "white",
    ...(tuning ? { tuning } : {}),
    hypothesis,
  };
}

const SLOT_KEYS: SlotKey[] = [
  "cpu_back_left",
  "cpu_back_right",
  "cpu_front_left",
  "cpu_front_right",
  "player_front_left",
  "player_front_right",
  "player_back_left",
  "player_back_right",
];

const options = parseArgs(process.argv.slice(2));
const loopReport = runWhiteAiTuningLoop({ ...options, includeGameHistory: true });
const report = buildShieldUsageAuditReport(loopReport);
const markdown = formatShieldUsageAuditMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
}

console.log(`Shield usage audit loop: ${report.variants.length} variants / ${report.games} games`);
for (const variant of report.byVariant) {
  console.log(
    `${variant.variantId}: ${variant.wins}-${variant.losses}-${variant.draws} ` +
      `S ${variant.metrics.shieldUses} noP ${formatPercent(rate(variant.metrics.predictedNoPressure, variant.metrics.shieldUses))} ` +
      `1hitDead ${formatPercent(rate(variant.metrics.singleContactRemoved, variant.metrics.shieldUses))} ` +
      `conv ${formatPercent(rate(variant.metrics.convertedNextOwnTurn, variant.metrics.shieldUses))}`,
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

function buildShieldUsageAuditReport(loopReport: ReturnType<typeof runWhiteAiTuningLoop>): ShieldUsageAuditReport {
  const records = new Map<string, VariantShieldAudit>();
  const samples: ShieldAuditSample[] = [];
  const total = emptyMetrics();
  let gameCount = 0;

  for (const variant of loopReport.variants) {
    records.set(variant.id, {
      variantId: variant.id,
      label: variant.label,
      games: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      metrics: emptyMetrics(),
    });
  }

  for (const run of loopReport.runs) {
    const record = records.get(run.variantId);
    if (!record) {
      continue;
    }
    for (const game of run.result.games) {
      gameCount += 1;
      record.games += 1;
      const outcome = game.winner === undefined ? "draw" : game.winner === run.candidateSeat ? "win" : "loss";
      if (outcome === "win") {
        record.wins += 1;
      } else if (outcome === "loss") {
        record.losses += 1;
      } else {
        record.draws += 1;
      }

      for (const audit of auditGameShields(game.history ?? [], {
        variantId: run.variantId,
        opponentId: run.opponentId,
        candidateSeat: run.candidateSeat,
        outcome,
      })) {
        addShieldEventAudit(total, audit);
        addShieldEventAudit(record.metrics, audit);
        addSamples(samples, audit);
      }
    }
  }

  const byVariant = [...records.values()].sort((a, b) =>
    b.metrics.shieldUses - a.metrics.shieldUses || a.variantId.localeCompare(b.variantId),
  );

  return {
    generatedAt: loopReport.generatedAt,
    gamesPerMatchup: loopReport.gamesPerMatchup,
    variants: loopReport.variants.map((variant) => variant.id),
    opponents: loopReport.opponents.map((opponent) => opponent.id),
    runs: loopReport.runs.length,
    games: gameCount,
    metrics: total,
    byVariant,
    samples,
    notes: [
      "この監査はAI挙動を変更しない。既存履歴からシールド判断だけを分類する。",
      "予測ダメージは相手の次ターンにモンスターが起きて動ける前提の簡易上限。特殊状態、全マジック、石の完全な手順競合はまだ精密化していない。",
      "master_attack は前衛の登場済みモンスターへ2Pとして見積もり、シールド後は1Pとして扱う。",
      "forced extra action proxy は、実ログ上で2回以上触られた、または1回触られても次自ターンまで残ったシールドを数える。",
    ],
    nextLoopProposal: buildNextLoopProposal(total, byVariant),
  };

  function auditGameShields(
    history: readonly MasterLabDecisionEvent[],
    context: Pick<ShieldEventAudit, "variantId" | "opponentId" | "candidateSeat" | "outcome">,
  ): ShieldEventAudit[] {
    return history.flatMap((event, index) => {
      if (event.player !== context.candidateSeat || event.source !== "cpu") {
        return [];
      }
      const slotKey = shieldTargetSlotKeyForEvent(event);
      if (!slotKey) {
        return [];
      }
      const slot = slotByKey(event.before, slotKey);
      if (!slot?.card || slot.owner !== context.candidateSeat) {
        return [];
      }
      const cardName = safeCardName(slot.card);
      const role = getMonsterAiTrait(slot.card).role;
      const estimate = estimateIncomingDamage(event.before, context.candidateSeat, slotKey);
      const outcomeAudit = auditShieldOutcome(history, index, context.candidateSeat, slotKey, slot.card, role);
      return [{
        event,
        variantId: context.variantId,
        opponentId: context.opponentId,
        candidateSeat: context.candidateSeat,
        outcome: context.outcome,
        slotKey,
        cardId: slot.card,
        cardName,
        role,
        estimate,
        outcomeAudit,
      }];
    });
  }

  function addSamples(samplesToAdd: ShieldAuditSample[], audit: ShieldEventAudit): void {
    const kinds = sampleKinds(audit);
    for (const kind of kinds) {
      if (samplesToAdd.filter((sample) => sample.kind === kind).length >= 6 || samplesToAdd.length >= 36) {
        continue;
      }
      samplesToAdd.push({
        kind,
        variantId: audit.variantId,
        opponentId: audit.opponentId,
        candidateSeat: audit.candidateSeat,
        outcome: audit.outcome,
        seed: audit.event.seed,
        step: audit.event.step,
        turnNumber: audit.event.turnNumber,
        slotKey: audit.slotKey,
        card: audit.cardName,
        reason: audit.event.reason,
        score: round1(audit.event.score),
        predictedNoShieldDamage: audit.estimate.noShieldDamage,
        predictedWithShieldDamage: audit.estimate.withShieldDamage,
        actualContacts: audit.outcomeAudit.actualContacts,
        actualDamage: audit.outcomeAudit.actualDamage,
        removedBeforeNextOwnTurn: audit.outcomeAudit.removedBeforeNextOwnTurn,
        convertedNextOwnTurn: audit.outcomeAudit.convertedNextOwnTurn,
        board: formatBoard(audit.event.before),
      });
    }
  }

  function sampleKinds(audit: ShieldEventAudit): string[] {
    const kinds: string[] = [];
    if (audit.outcomeAudit.lowStoneSecondShield) {
      kinds.push("low_stone_second_shield");
    } else if (audit.outcomeAudit.secondShieldSameTurn) {
      kinds.push("second_shield_same_turn");
    }
    if (audit.estimate.noShieldDamage <= 0) {
      kinds.push("predicted_no_pressure");
    }
    if (audit.outcomeAudit.frontBackRoleShieldThenRetreat) {
      kinds.push("front_back_role_shield_then_retreat");
    }
    if (audit.outcomeAudit.singleContactRemoved) {
      kinds.push("single_contact_removed");
    }
    if (audit.outcomeAudit.noContactNoConversion) {
      kinds.push("no_contact_no_conversion");
    }
    if (audit.outcomeAudit.lethalReasonStillRemoved) {
      kinds.push("lethal_reason_still_removed");
    }
    if (audit.estimate.monsterMaxNoShield <= 0 && audit.estimate.masterAttackNoShield > 0) {
      kinds.push("master_attack_only_pressure");
    }
    return kinds;
  }

  function safeCardName(cardId: string): string {
    try {
      return getCardName(cardId);
    } catch {
      return cardId;
    }
  }
}

function addShieldEventAudit(metrics: ShieldAuditMetrics, audit: ShieldEventAudit): void {
  const estimate = audit.estimate;
  const outcome = audit.outcomeAudit;
  metrics.shieldUses += 1;
  if (estimate.noShieldDamage <= 0) {
    metrics.predictedNoPressure += 1;
  }
  if (estimate.monsterMaxNoShield <= 0) {
    metrics.predictedNoMonsterPressure += 1;
  }
  if (estimate.masterAttackNoShield > 0) {
    metrics.predictedMasterAttackAvailable += 1;
  }
  if (estimate.monsterMaxNoShield <= 0 && estimate.masterAttackNoShield > 0) {
    metrics.predictedMasterAttackOnly += 1;
  }
  const hp = slotByKey(audit.event.before, audit.slotKey)?.hp ?? 0;
  if (
    estimate.monsterMaxNoShield < hp &&
    estimate.monsterMaxNoShield + estimate.masterAttackNoShield >= hp
  ) {
    metrics.predictedMasterAttackChangesLethal += 1;
  }
  metrics.predictedNoShieldDamageTotal += estimate.noShieldDamage;
  metrics.predictedWithShieldDamageTotal += estimate.withShieldDamage;
  metrics.actualContactsBeforeNextOwnTurn += outcome.actualContacts;
  metrics.actualDamageBeforeNextOwnTurn += outcome.actualDamage;
  if (outcome.preservedToNextOwnTurn) {
    metrics.preservedToNextOwnTurn += 1;
  }
  if (outcome.removedBeforeNextOwnTurn) {
    metrics.removedBeforeNextOwnTurn += 1;
  }
  if (outcome.forcedExtraActionProxy) {
    metrics.forcedExtraActionProxy += 1;
  }
  if (outcome.singleContactRemoved) {
    metrics.singleContactRemoved += 1;
  }
  if (outcome.noContactNoConversion) {
    metrics.noContactNoConversion += 1;
  }
  if (outcome.convertedNextOwnTurn) {
    metrics.convertedNextOwnTurn += 1;
  }
  if (outcome.nextOwnTurnAttack) {
    metrics.nextOwnTurnAttack += 1;
  }
  if (outcome.nextOwnTurnLevelUp) {
    metrics.nextOwnTurnLevelUp += 1;
  }
  if (outcome.sameTurnRetreatAfterShield) {
    metrics.sameTurnRetreatAfterShield += 1;
  }
  if (outcome.frontBackRoleShieldThenRetreat) {
    metrics.frontBackRoleShieldThenRetreat += 1;
  }
  if (outcome.lowStoneAfterShield) {
    metrics.lowStoneAfterShield += 1;
  }
  if (outcome.secondShieldSameTurn) {
    metrics.secondShieldSameTurn += 1;
  }
  if (outcome.lowStoneSecondShield) {
    metrics.lowStoneSecondShield += 1;
  }
  if (outcome.lethalReasonStillRemoved) {
    metrics.lethalReasonStillRemoved += 1;
  }
}

function estimateIncomingDamage(summary: MasterLabGameStateSummary, candidateSeat: PlayerId, targetSlotKey: string): DamageEstimate {
  const opponent = opponentOf(candidateSeat);
  const target = slotByKey(summary, targetSlotKey);
  if (!target?.card || target.owner !== candidateSeat || target.status !== "active") {
    return emptyDamageEstimate();
  }

  const noShieldState = summaryToReadyGameState(summary, opponent, targetSlotKey, false);
  const shieldState = summaryToReadyGameState(summary, opponent, targetSlotKey, true);
  const monsterMaxNoShield = estimateMonsterMaxDamage(noShieldState, opponent, targetSlotKey);
  const monsterMaxWithShield = estimateMonsterMaxDamage(shieldState, opponent, targetSlotKey);
  const masterAttackNoShield = canMasterAttackTarget(summary, opponent, targetSlotKey) ? 2 : 0;
  const masterAttackWithShield = canMasterAttackTarget(summary, opponent, targetSlotKey) ? 1 : 0;
  const sourceCount = countReadyOpponentSources(summary, opponent) + (masterAttackNoShield > 0 ? 1 : 0);
  return {
    monsterMaxNoShield,
    monsterMaxWithShield,
    masterAttackNoShield,
    masterAttackWithShield,
    noShieldDamage: monsterMaxNoShield + masterAttackNoShield,
    withShieldDamage: monsterMaxWithShield + masterAttackWithShield,
    sourceCount,
  };
}

function estimateMonsterMaxDamage(state: GameState, attackerId: PlayerId, targetSlotKey: string): number {
  let maxDamage = 0;
  for (const slotKey of SLOT_KEYS) {
    const slot = state.slots[slotKey];
    const monster = slot.monster;
    if (!monster || monster.owner !== attackerId || monster.status !== "active") {
      continue;
    }
    const def = getMonsterDef(monster.cardId);
    const commands = def.levels.find((level) => level.level === monster.level)?.commands ?? def.levels[0]?.commands ?? [];
    for (const command of commands) {
      if (!command.implemented || command.power <= 0) {
        continue;
      }
      let targets: ReturnType<typeof getCommandTargets>;
      try {
        targets = getCommandTargets(state, slotKey, command.id);
      } catch {
        continue;
      }
      if (!targets.some((target) => target.kind === "monster" && target.slotKey === targetSlotKey)) {
        continue;
      }
      const target = state.slots[targetSlotKey as SlotKey]?.monster;
      const shieldReduction = target?.shielded ? 1 : 0;
      maxDamage = Math.max(maxDamage, Math.max(0, command.power - shieldReduction));
    }
  }
  return maxDamage;
}

function auditShieldOutcome(
  history: readonly MasterLabDecisionEvent[],
  shieldEventIndex: number,
  candidateSeat: PlayerId,
  shieldTargetSlotKey: string,
  cardId: string,
  role: "front" | "back",
): ShieldOutcomeAudit {
  const event = history[shieldEventIndex];
  const nextTurnNumber = nextOwnTurnNumberAfter(history, shieldEventIndex, candidateSeat);
  let trackedSlotKey = shieldTargetSlotKey;
  let actualContacts = 0;
  let actualDamage = 0;
  let removedBeforeNextOwnTurn = false;
  let sameTurnRetreatAfterShield = false;
  let frontBackRoleShieldThenRetreat = false;
  let nextOwnTurnAttack = false;
  let nextOwnTurnLevelUp = false;

  for (let index = shieldEventIndex + 1; index < history.length; index += 1) {
    const current = history[index];
    if (!current) {
      continue;
    }
    if (nextTurnNumber !== undefined && current.turnNumber > nextTurnNumber) {
      break;
    }

    const moved = moveForEvent(current);
    if (moved) {
      if (current.player === candidateSeat && current.turnNumber === event.turnNumber) {
        if (moved.from === trackedSlotKey) {
          if (slotRow(moved.from) === "front" && slotRow(moved.to) === "back") {
            sameTurnRetreatAfterShield = true;
            frontBackRoleShieldThenRetreat = role === "back";
          }
          trackedSlotKey = moved.to;
        } else if (moved.to === trackedSlotKey) {
          const fromAfter = slotByKey(current.after, moved.from);
          if (fromAfter?.owner === candidateSeat && fromAfter.card === cardId) {
            trackedSlotKey = moved.from;
          }
        }
      }
    }

    if (nextTurnNumber !== undefined && current.player === candidateSeat && current.turnNumber === nextTurnNumber) {
      if (slotAttacksInEvent(current, trackedSlotKey, cardId, candidateSeat)) {
        nextOwnTurnAttack = true;
      }
      if (slotLevelsUpInEvent(current, trackedSlotKey, cardId, candidateSeat)) {
        nextOwnTurnLevelUp = true;
      }
      continue;
    }

    if (current.player === candidateSeat) {
      continue;
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
      actualContacts += 1;
      actualDamage += Math.max(0, beforeHp - afterHp);
    }
    if (!afterStillSame) {
      removedBeforeNextOwnTurn = true;
      break;
    }
  }

  const preservedToNextOwnTurn = nextTurnNumber !== undefined && !removedBeforeNextOwnTurn && history.some((current) => {
    if (current.player !== candidateSeat || current.turnNumber !== nextTurnNumber) {
      return false;
    }
    const slot = slotByKey(current.before, trackedSlotKey);
    return slot?.owner === candidateSeat && slot.card === cardId;
  });
  const convertedNextOwnTurn = nextOwnTurnAttack || nextOwnTurnLevelUp;
  return {
    actualContacts,
    actualDamage,
    preservedToNextOwnTurn,
    removedBeforeNextOwnTurn,
    forcedExtraActionProxy: actualContacts >= 2 || (actualContacts >= 1 && preservedToNextOwnTurn),
    singleContactRemoved: actualContacts === 1 && removedBeforeNextOwnTurn,
    noContactNoConversion: actualContacts === 0 && !convertedNextOwnTurn,
    convertedNextOwnTurn,
    nextOwnTurnAttack,
    nextOwnTurnLevelUp,
    sameTurnRetreatAfterShield,
    frontBackRoleShieldThenRetreat,
    lowStoneAfterShield: event.after.players[candidateSeat].stones <= 1,
    secondShieldSameTurn: previousSameTurnShieldCount(history, shieldEventIndex, candidateSeat) > 0,
    lowStoneSecondShield: previousSameTurnShieldCount(history, shieldEventIndex, candidateSeat) > 0 && event.after.players[candidateSeat].stones <= 1,
    lethalReasonStillRemoved: shieldReasonSuggestsLethal(event.reason) && removedBeforeNextOwnTurn,
  };
}

function summaryToReadyGameState(
  summary: MasterLabGameStateSummary,
  currentPlayer: PlayerId,
  forcedShieldTargetSlotKey: string,
  forcedShielded: boolean,
): GameState {
  const slots = Object.fromEntries(SLOT_KEYS.map((slotKey) => {
    const [owner, row, lane] = slotKey.split("_") as [PlayerId, "front" | "back", "left" | "right"];
    const summarySlot = slotByKey(summary, slotKey);
    const monster = summarySlot?.card ? summarySlotToMonster(summarySlot, currentPlayer, forcedShieldTargetSlotKey, forcedShielded) : undefined;
    return [slotKey, {
      key: slotKey,
      owner,
      row,
      lane,
      monster,
    } satisfies SlotState];
  })) as Record<SlotKey, SlotState>;

  return {
    currentPlayer,
    firstPlayer: "player",
    turnNumber: summary.turnNumber,
    randomSeed: 0,
    log: [],
    winner: summary.winner,
    pendingLevelUp: undefined,
    players: {
      player: {
        id: "player",
        masterId: summary.players.player.baseMasterId,
        masterHp: summary.players.player.hp,
        stones: summary.players.player.stones,
        deck: [],
        hand: [],
        discard: [],
        turnsStarted: 0,
      },
      cpu: {
        id: "cpu",
        masterId: summary.players.cpu.baseMasterId,
        masterHp: summary.players.cpu.hp,
        stones: summary.players.cpu.stones,
        deck: [],
        hand: [],
        discard: [],
        turnsStarted: 0,
      },
    },
    slots,
  };
}

function summarySlotToMonster(
  slot: SummarySlot,
  readyPlayer: PlayerId,
  forcedShieldTargetSlotKey: string,
  forcedShielded: boolean,
): MonsterState | undefined {
  if (!slot.card || !slot.owner || !slot.hp) {
    return undefined;
  }
  const def = getMonsterDef(slot.card);
  const ready = slot.owner === readyPlayer;
  const status = ready ? "active" : slot.status === "prepared" ? "prepared" : "active";
  return {
    instanceId: `${slot.slotKey}:${slot.card}`,
    cardId: slot.card,
    owner: slot.owner,
    hp: slot.hp,
    level: slot.level ?? 1,
    status,
    investedStones: slot.level ?? 1,
    actionCount: ready ? 0 : slot.actionCount ?? 0,
    actionLimit: slot.actionLimit ?? def.actionLimit ?? 1,
    focused: false,
    powerUp: false,
    shielded: slot.slotKey === forcedShieldTargetSlotKey ? forcedShielded : !!slot.shielded,
    scapegoat: slot.scapegoat,
    provokeTargetSlotKey: slot.provokeTargetSlotKey,
  };
}

function canMasterAttackTarget(summary: MasterLabGameStateSummary, attackerId: PlayerId, targetSlotKey: string): boolean {
  const target = slotByKey(summary, targetSlotKey);
  if (!target?.card || target.owner === attackerId || target.status !== "active" || slotRow(targetSlotKey) !== "front") {
    return false;
  }
  return summary.players[attackerId].stones >= 3;
}

function countReadyOpponentSources(summary: MasterLabGameStateSummary, opponent: PlayerId): number {
  return summary.slots.filter((slot) =>
    slot.owner === opponent &&
    !!slot.card &&
    (slot.status === "active" || slot.status === "prepared"),
  ).length;
}

function slotAttacksInEvent(event: MasterLabDecisionEvent, trackedSlotKey: string, cardId: string, owner: PlayerId): boolean {
  if (!event.decision.startsWith("attack:")) {
    return false;
  }
  const actor = actorSlotKeyForEvent(event);
  if (actor !== trackedSlotKey) {
    return false;
  }
  const slot = slotByKey(event.before, trackedSlotKey);
  return slot?.owner === owner && slot.card === cardId;
}

function slotLevelsUpInEvent(event: MasterLabDecisionEvent, trackedSlotKey: string, cardId: string, owner: PlayerId): boolean {
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

function previousSameTurnShieldCount(
  history: readonly MasterLabDecisionEvent[],
  eventIndex: number,
  candidateSeat: PlayerId,
): number {
  const event = history[eventIndex];
  if (!event) {
    return 0;
  }
  return history.slice(0, eventIndex).filter((candidate) =>
    candidate.player === candidateSeat &&
    candidate.turnNumber === event.turnNumber &&
    candidate.source === "cpu" &&
    candidate.decision.startsWith("master:shield"),
  ).length;
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

function moveForEvent(event: MasterLabDecisionEvent): { from: string; to: string } | undefined {
  if (!event.decision.startsWith("move:")) {
    return undefined;
  }
  const [from, to] = event.decision.slice("move:".length).split("->");
  return from && to ? { from, to } : undefined;
}

function actorSlotKeyForEvent(event: MasterLabDecisionEvent): string | undefined {
  return event.decision.startsWith("attack:") ? event.decision.split(":")[1] : undefined;
}

function shieldTargetSlotKeyForEvent(event: MasterLabDecisionEvent): string | undefined {
  if (!event.decision.startsWith("master:shield->monster:")) {
    return undefined;
  }
  return event.decision.slice("master:shield->monster:".length);
}

function shieldReasonSuggestsLethal(reason: string): boolean {
  return reason.includes("致死") || reason.includes("倒され");
}

function slotByKey(summary: MasterLabGameStateSummary, slotKey: string): SummarySlot | undefined {
  return summary.slots.find((slot) => slot.slotKey === slotKey);
}

function slotRow(slotKey: string): "front" | "back" {
  return slotKey.includes("_front_") ? "front" : "back";
}

function opponentOf(playerId: PlayerId): PlayerId {
  return playerId === "player" ? "cpu" : "player";
}

function emptyDamageEstimate(): DamageEstimate {
  return {
    monsterMaxNoShield: 0,
    monsterMaxWithShield: 0,
    masterAttackNoShield: 0,
    masterAttackWithShield: 0,
    noShieldDamage: 0,
    withShieldDamage: 0,
    sourceCount: 0,
  };
}

function emptyMetrics(): ShieldAuditMetrics {
  return {
    shieldUses: 0,
    predictedNoPressure: 0,
    predictedNoMonsterPressure: 0,
    predictedMasterAttackAvailable: 0,
    predictedMasterAttackOnly: 0,
    predictedMasterAttackChangesLethal: 0,
    predictedNoShieldDamageTotal: 0,
    predictedWithShieldDamageTotal: 0,
    actualContactsBeforeNextOwnTurn: 0,
    actualDamageBeforeNextOwnTurn: 0,
    preservedToNextOwnTurn: 0,
    removedBeforeNextOwnTurn: 0,
    forcedExtraActionProxy: 0,
    singleContactRemoved: 0,
    noContactNoConversion: 0,
    convertedNextOwnTurn: 0,
    nextOwnTurnAttack: 0,
    nextOwnTurnLevelUp: 0,
    sameTurnRetreatAfterShield: 0,
    frontBackRoleShieldThenRetreat: 0,
    lowStoneAfterShield: 0,
    secondShieldSameTurn: 0,
    lowStoneSecondShield: 0,
    lethalReasonStillRemoved: 0,
  };
}

function formatShieldUsageAuditMarkdown(report: ShieldUsageAuditReport): string {
  return [
    "# Shield Usage Audit Loop 1",
    "",
    `生成: ${report.generatedAt}`,
    `候補: ${report.variants.join(", ")}`,
    `相手: ${report.opponents.join(", ")}`,
    `試行: ${report.gamesPerMatchup} games/matchup/direction`,
    `総試合: ${report.games}`,
    "",
    "## Purpose",
    "",
    "シールドAIを直接いじらず、まずシールドの使い方だけを再検証する。特に「守る価値があるから貼る」ではなく、「貼ることで相手に追加手数/追加コストを払わせたか」「次ターンの仕事へ変換されたか」を見る。",
    "",
    "## Summary",
    "",
    formatMetricsSummary(report.metrics),
    "",
    "## Variant Metrics",
    "",
    "| Variant | W-L-D | Shield | Pred No Pressure | MA Available | MA Only | MA Changes Lethal | Avg Pred No/With | Preserved | Extra Action Proxy | 1 Contact Removed | No Contact No Conv | Converted | Retreat | Front Back Retreat | Low Stone | 2nd Shield Low | Lethal Reason Removed |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...report.byVariant.map(formatVariantRow),
    "",
    "## Samples",
    "",
    ...formatSamples(report.samples),
    "",
    "## Notes",
    "",
    ...report.notes.map((note) => `- ${note}`),
    "",
    "## Reading",
    "",
    "- `Pred No Pressure` は、簡易予測でモンスター打点もマスターアタック打点も入らないのにシールドした回数。",
    "- `MA Available` は、相手が次ターンに対象へマスターアタックできる前衛シールド。",
    "- `MA Changes Lethal` は、モンスター打点だけなら非致死だがマスターアタック込みで致死になる見込み。",
    "- `Extra Action Proxy` は、実ログ上でシールド対象が2回以上触られた、または1回触られても次自ターンまで残ったケース。",
    "- `Front Back Retreat` は、前衛の後衛ロールにシールドしてから同ターン後列へ下げたケース。フーヨウ系の雑シールド検出を狙う。",
    "",
    "## Next Loop Proposal",
    "",
    ...report.nextLoopProposal.map((step) => `- ${step}`),
  ].join("\n");
}

function formatMetricsSummary(metrics: ShieldAuditMetrics): string {
  return [
    `- シールド使用: ${metrics.shieldUses}`,
    `- 予測上ノープレッシャー: ${metrics.predictedNoPressure} (${formatPercent(rate(metrics.predictedNoPressure, metrics.shieldUses))})`,
    `- マスターアタック込み対象: ${metrics.predictedMasterAttackAvailable} (${formatPercent(rate(metrics.predictedMasterAttackAvailable, metrics.shieldUses))})`,
    `- 1接触で除去: ${metrics.singleContactRemoved} (${formatPercent(rate(metrics.singleContactRemoved, metrics.shieldUses))})`,
    `- 接触なし/成果化なし: ${metrics.noContactNoConversion} (${formatPercent(rate(metrics.noContactNoConversion, metrics.shieldUses))})`,
    `- 次ターン成果化: ${metrics.convertedNextOwnTurn} (${formatPercent(rate(metrics.convertedNextOwnTurn, metrics.shieldUses))})`,
    `- 前衛後衛ロールを盾して同ターン後退: ${metrics.frontBackRoleShieldThenRetreat} (${formatPercent(rate(metrics.frontBackRoleShieldThenRetreat, metrics.shieldUses))})`,
  ].join("\n");
}

function formatVariantRow(variant: VariantShieldAudit): string {
  const m = variant.metrics;
  return [
    escapeCell(variant.variantId),
    `${variant.wins}-${variant.losses}-${variant.draws}`,
    m.shieldUses,
    formatCountRate(m.predictedNoPressure, m.shieldUses),
    formatCountRate(m.predictedMasterAttackAvailable, m.shieldUses),
    formatCountRate(m.predictedMasterAttackOnly, m.shieldUses),
    formatCountRate(m.predictedMasterAttackChangesLethal, m.shieldUses),
    `${round1(m.predictedNoShieldDamageTotal / Math.max(1, m.shieldUses))}/${round1(m.predictedWithShieldDamageTotal / Math.max(1, m.shieldUses))}`,
    formatCountRate(m.preservedToNextOwnTurn, m.shieldUses),
    formatCountRate(m.forcedExtraActionProxy, m.shieldUses),
    formatCountRate(m.singleContactRemoved, m.shieldUses),
    formatCountRate(m.noContactNoConversion, m.shieldUses),
    formatCountRate(m.convertedNextOwnTurn, m.shieldUses),
    formatCountRate(m.sameTurnRetreatAfterShield, m.shieldUses),
    formatCountRate(m.frontBackRoleShieldThenRetreat, m.shieldUses),
    formatCountRate(m.lowStoneAfterShield, m.shieldUses),
    `${m.lowStoneSecondShield}/${m.secondShieldSameTurn}`,
    formatCountRate(m.lethalReasonStillRemoved, m.shieldUses),
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatSamples(samples: ShieldAuditSample[]): string[] {
  if (samples.length === 0) {
    return ["該当サンプルなし。"];
  }
  return samples.flatMap((sample) => [
    `### ${sample.kind}: ${sample.card} seed ${sample.seed} turn ${sample.turnNumber}`,
    "",
    `- variant/opponent: \`${sample.variantId}\` vs \`${sample.opponentId}\` (${sample.candidateSeat}, ${sample.outcome})`,
    `- decision: ${sample.slotKey} / score ${sample.score} / ${sample.reason}`,
    `- predicted damage: no shield ${sample.predictedNoShieldDamage}, with shield ${sample.predictedWithShieldDamage}`,
    `- actual: contacts ${sample.actualContacts}, damage ${sample.actualDamage}, removed ${sample.removedBeforeNextOwnTurn}, converted ${sample.convertedNextOwnTurn}`,
    `- board: ${sample.board}`,
    "",
  ]);
}

function buildNextLoopProposal(metrics: ShieldAuditMetrics, variants: VariantShieldAudit[]): string[] {
  const steps: string[] = [];
  if (rate(metrics.predictedNoPressure, metrics.shieldUses) >= 0.08) {
    steps.push("簡易予測でノープレッシャーのシールドが一定数あるため、次は `shieldNoPressurePenalty` 候補を小母数で試す。ただし成果化している例は除外する。");
  }
  if (metrics.predictedMasterAttackChangesLethal > 0 || rate(metrics.predictedMasterAttackAvailable, metrics.shieldUses) >= 0.25) {
    steps.push("マスターアタック込みの突破見込みが多いので、`IncomingThreat` に monster-only / master-attack-included の二段値を持たせる設計を次候補にする。");
  }
  if (rate(metrics.singleContactRemoved, metrics.shieldUses) >= 0.12) {
    steps.push("1接触で除去されるシールドが多い場合、`致死圏だから守る` ではなく `シールド後に少なくとも追加1手を要求する` 条件へ寄せる。");
  }
  if (metrics.frontBackRoleShieldThenRetreat > 0) {
    steps.push("前衛後衛ロールを盾して同ターン後退する例が出ているため、カード名固定ではなく `back-role front slot + safe retreat available` の監査を深掘りする。");
  }
  const best = [...variants].sort((a, b) =>
    rate(b.metrics.forcedExtraActionProxy + b.metrics.convertedNextOwnTurn, b.metrics.shieldUses) -
    rate(a.metrics.forcedExtraActionProxy + a.metrics.convertedNextOwnTurn, a.metrics.shieldUses),
  )[0];
  if (best) {
    steps.push(`次の比較軸は \`${best.variantId}\` を基準にし、ノープレッシャー率と1接触除去率を落とせるかを見る。`);
  }
  if (steps.length === 0) {
    steps.push("シールド単体の粗い失敗型は少ないため、次はシールド後の同ターン行動順、特に移動/召喚/ウェイクアップとの競合を監査する。");
  }
  return steps;
}

function formatBoard(summary: MasterLabGameStateSummary): string {
  return summary.slots
    .filter((slot) => slot.card)
    .map((slot) => {
      const owner = slot.owner === "player" ? "P" : "C";
      const row = slotRow(slot.slotKey) === "front" ? "F" : "B";
      return `${owner}${row}:${safeCardLabel(slot.card)} Lv${slot.level ?? "?"} HP${slot.hp ?? "?"}${slot.shielded ? " shield" : ""}${slot.status === "prepared" ? " prep" : ""}`;
    })
    .join(" / ");
}

function safeCardLabel(cardId: string | undefined): string {
  if (!cardId) {
    return "?";
  }
  try {
    return getCardName(cardId);
  } catch {
    return cardId;
  }
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    gamesPerMatchup: 4,
    seedStart: 23000,
    maxSteps: 700,
    maxTurns: 160,
    variants: resolveVariants([...DEFAULT_VARIANT_IDS]),
    opponents: resolveOpponents([...DEFAULT_OPPONENT_IDS]),
  };

  const variantIds: string[] = [];
  const opponentIds: string[] = [];

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
      variantIds.push(readString(arg, next));
      i += 1;
    } else if (arg === "--opponent") {
      opponentIds.push(readString(arg, next));
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readNumber(arg, next);
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

  if (variantIds.length > 0) {
    parsed.variants = resolveVariants(variantIds);
  }
  if (opponentIds.length > 0) {
    parsed.opponents = resolveOpponents(opponentIds);
  }
  return parsed;
}

function resolveVariants(ids: readonly string[]): WhiteAiTuningVariant[] {
  return ids.map((id) => {
    const variant = [...CURRENT_SHIELD_AUDIT_VARIANTS, ...DEFAULT_WHITE_AI_TUNING_VARIANTS].find((candidate) => candidate.id === id);
    if (!variant) {
      throw new Error(`Unknown variant: ${id}`);
    }
    return variant;
  });
}

function resolveOpponents(ids: readonly string[]): WhiteAiTuningOpponent[] {
  return ids.map((id) => {
    const opponent = [...CURRENT_SHIELD_AUDIT_OPPONENTS, ...DEFAULT_WHITE_AI_TUNING_OPPONENTS].find((candidate) => candidate.id === id);
    if (!opponent) {
      throw new Error(`Unknown opponent: ${id}`);
    }
    return opponent;
  });
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

function formatCountRate(count: number, total: number): string {
  return `${count}<br>${formatPercent(rate(count, total))}`;
}

function formatPercent(value: number): string {
  return `${round1(value * 100)}%`;
}

function rate(count: number, total: number): number {
  return total > 0 ? count / total : 0;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, "\\|");
}

function printHelp(): void {
  console.log(`
Usage:
  npm run lab:masters:shield-audit -- [options]

Options:
  --games-per-matchup <n>   Games for each directed matchup. Default: 4
  --seed-start <n>          First seed. Default: 23000
  --variant <id>            Run only the specified variant. Can be repeated.
  --opponent <id>           Run only the specified opponent. Can be repeated.
  --max-steps <n>           Failure threshold per game. Default: 700
  --max-turns <n>           Failure threshold per game. Default: 160
  --markdown <path>         Write a Markdown report.
  --json <path>             Write a JSON report.
`);
}
