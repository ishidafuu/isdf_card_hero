import { getCardDef, getCardName, getCardPool, getMonsterDef } from "./cards";
import {
  attackWithCommand,
  canFocusMonster,
  canSummonTo,
  endTurn,
  focusMonster,
  getCommandHandChoices,
  getCommandSecondaryTargets,
  getCommandTargets,
  getMagicHandChoices,
  getMagicSearchCategories,
  getMagicSecondaryTargets,
  getMagicTargets,
  getCurrentMasterActionIds,
  getMasterActionCost,
  getMasterActionTargets,
  getMonsterCommands,
  getMovableTargets,
  moveMonster,
  opponentOf,
  playMagic,
  summonMonster,
  useMasterAction,
} from "./rules";
import {
  cpuMonsterValue as monsterValue,
  cpuPlacementValue as placementValue,
  evaluateHandCardKeepValue as handCardKeepValue,
  evaluateHandMonsterPlacementValue as handMonsterPlacementValue,
  memberRatingValueBonus,
} from "./unitEvaluation";
import { getMagicAiTrait } from "./aiTraits";
import { getMonsterAiTrait, inferMonsterAiTrait } from "./aiUnitTraits";
import {
  AI_EVALUATION_WEIGHTS,
  DEFAULT_AI_EVALUATION_WEIGHTS,
  type AiEvaluationWeights,
} from "./aiWeights";
import type {
  CommandAction,
  GameState,
  MagicAction,
  MasterActionId,
  MonsterState,
  PlayerId,
  SlotKey,
  SlotState,
  Target,
} from "./types";

const FIELD_ORDER_BY_PLAYER: Record<PlayerId, SlotKey[]> = {
  cpu: ["cpu_back_left", "cpu_back_right", "cpu_front_left", "cpu_front_right"],
  player: ["player_back_left", "player_back_right", "player_front_left", "player_front_right"],
};

const SUMMON_SLOT_ORDER_BY_PLAYER: Record<PlayerId, SlotKey[]> = {
  cpu: ["cpu_front_left", "cpu_front_right", "cpu_back_left", "cpu_back_right"],
  player: ["player_front_left", "player_front_right", "player_back_left", "player_back_right"],
};

const ALL_FIELD_ORDER: SlotKey[] = [...FIELD_ORDER_BY_PLAYER.cpu, ...FIELD_ORDER_BY_PLAYER.player];

type EvaluatedDecision = { decision: CpuDecision; totalScore: number; index: number; after: GameState };
type IncomingThreat = { threatened: boolean; lethal: boolean; maxDamage: number };
type ThreatModel = {
  masterDamage: Record<PlayerId, number>;
  monsterThreats: Partial<Record<SlotKey, IncomingThreat>>;
};
type CpuAiProfileConfig = {
  detailedWidth: number;
  sameTurnSearchDepth: number;
  sameTurnSearchWidth: number;
  sameTurnSearchDiscount: number;
  beamScoreThreshold: number;
  weights: AiEvaluationWeights;
  tuning?: CpuAiTuning;
};

const NO_THREAT: IncomingThreat = { threatened: false, lethal: false, maxDamage: 0 };

export const CPU_AI_PROFILES = ["stable", "strong", "pressure", "defensive", "white"] as const;
export type CpuAiProfile = (typeof CPU_AI_PROFILES)[number];
export type CpuAiProfiles = Record<PlayerId, CpuAiProfile>;
export type CpuAiDecisionBiasId =
  | MasterActionId
  | "attack"
  | "attack_master"
  | "attack_monster"
  | "master_action"
  | "magic"
  | "summon"
  | "move"
  | "focus"
  | "end_turn";

export interface CpuAiTuning {
  weights?: Partial<AiEvaluationWeights>;
  actionBias?: Partial<Record<CpuAiDecisionBiasId, number>>;
  situationalBias?: {
    setupLowStonePenalty?: number;
    shieldConversionBonus?: number;
    antiBerserkFrontBonus?: number;
    whiteMonsterPressureBonus?: number;
  };
}

export interface CpuAiOptions {
  profile?: CpuAiProfile;
  profiles?: Partial<CpuAiProfiles>;
  tuning?: CpuAiTuning;
  tunings?: Partial<Record<PlayerId, CpuAiTuning>>;
}

const CPU_AI_PROFILE_CONFIG: Record<CpuAiProfile, CpuAiProfileConfig> = {
  stable: {
    detailedWidth: 2,
    sameTurnSearchDepth: 1,
    sameTurnSearchWidth: 2,
    sameTurnSearchDiscount: 0.55,
    beamScoreThreshold: 0,
    weights: AI_EVALUATION_WEIGHTS.stable,
  },
  strong: {
    detailedWidth: 4,
    sameTurnSearchDepth: 3,
    sameTurnSearchWidth: 4,
    sameTurnSearchDiscount: 0.5,
    beamScoreThreshold: 8,
    weights: AI_EVALUATION_WEIGHTS.strong,
  },
  pressure: {
    detailedWidth: 4,
    sameTurnSearchDepth: 3,
    sameTurnSearchWidth: 4,
    sameTurnSearchDiscount: 0.48,
    beamScoreThreshold: 6,
    weights: AI_EVALUATION_WEIGHTS.pressure,
  },
  defensive: {
    detailedWidth: 3,
    sameTurnSearchDepth: 2,
    sameTurnSearchWidth: 3,
    sameTurnSearchDiscount: 0.52,
    beamScoreThreshold: 10,
    weights: AI_EVALUATION_WEIGHTS.defensive,
  },
  white: {
    detailedWidth: 4,
    sameTurnSearchDepth: 3,
    sameTurnSearchWidth: 4,
    sameTurnSearchDiscount: 0.54,
    beamScoreThreshold: 8,
    weights: AI_EVALUATION_WEIGHTS.white,
  },
};

export type CpuDecision =
  | {
      type: "attack";
      action: CommandAction;
      reason: string;
      score: number;
    }
  | {
      type: "master_action";
      actionId: MasterActionId;
      target: Target;
      reason: string;
      score: number;
    }
  | {
      type: "summon";
      handInstanceId: string;
      slotKey: SlotKey;
      reason: string;
      score: number;
    }
  | {
      type: "magic";
      action: MagicAction;
      reason: string;
      score: number;
    }
  | {
      type: "move";
      fromSlotKey: SlotKey;
      toSlotKey: SlotKey;
      reason: string;
      score: number;
    }
  | {
      type: "focus";
      slotKey: SlotKey;
      reason: string;
      score: number;
    }
  | {
      type: "end_turn";
      reason: string;
      score: number;
    };

export interface CpuDecisionEvaluation {
  decision: CpuDecision;
  totalScore: number;
  index: number;
}

export function runCpuDecisionStep(state: GameState, options: CpuAiOptions = {}): GameState {
  const decision = chooseCpuDecision(state, options);
  return applyCpuDecision(state, decision);
}

export function chooseCpuDecision(state: GameState, options: CpuAiOptions = {}): CpuDecision {
  const perspective = state.currentPlayer;
  const config = resolveCpuAiConfig(state, options);
  let best: EvaluatedDecision | undefined;
  const evaluated = evaluateCpuDecisions(state, perspective, config);

  evaluated.forEach((candidate) => {
    if (
      !best ||
      candidate.totalScore > best.totalScore ||
      (candidate.totalScore === best.totalScore &&
        compareTieBreak(candidate.decision, best.decision, candidate.index, best.index) < 0)
    ) {
      best = candidate;
    }
  });

  return best ? attachDecisionTrace(best, evaluated) : createEndTurnDecision();
}

export function inspectCpuDecisionEvaluations(
  state: GameState,
  options: CpuAiOptions = {},
): CpuDecisionEvaluation[] {
  const perspective = state.currentPlayer;
  const config = resolveCpuAiConfig(state, options);
  return evaluateCpuDecisions(state, perspective, config).map(({ decision, totalScore, index }) => ({
    decision,
    totalScore,
    index,
  }));
}

function resolveCpuAiProfile(state: GameState, options: CpuAiOptions): CpuAiProfile {
  return options.profiles?.[state.currentPlayer] ?? options.profile ?? "stable";
}

function resolveCpuAiConfig(state: GameState, options: CpuAiOptions): CpuAiProfileConfig {
  const base = CPU_AI_PROFILE_CONFIG[resolveCpuAiProfile(state, options)];
  const tuning = options.tunings?.[state.currentPlayer] ?? options.tuning;
  if (!tuning) {
    return base;
  }
  return {
    ...base,
    weights: tuning.weights ? { ...base.weights, ...tuning.weights } : base.weights,
    tuning,
  };
}

function evaluateCpuDecisions(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
): EvaluatedDecision[] {
  const beforeScore = evaluateState(state, perspective, config.weights);
  const beforeFutureScore = evaluateFutureTacticalValue(state, perspective, false, config.weights);
  const beforeFollowUpScore = bestAttackOpportunityScore(state);
  const decisions = listCpuDecisions(state, config.weights);

  const evaluated = decisions.flatMap((decision, index) => {
    const transition = evaluateDecisionTransition(state, decision, perspective, beforeScore, beforeFutureScore, false, config);
    if (!transition) {
      return [];
    }
    return [{ decision, totalScore: transition.totalScore, index, after: transition.after }];
  });

  if (config.sameTurnSearchDepth <= 0) {
    return evaluated;
  }

  const hasDirectMasterPressure = evaluated.some((candidate) =>
    masterDamageFromTransition(state, candidate.after, perspective) > 0,
  );
  const lookaheadIndexes = new Set(
    evaluated
      .filter((candidate) => candidate.decision.type !== "end_turn")
      .sort(
        (a, b) =>
          b.totalScore - a.totalScore || compareTieBreak(a.decision, b.decision, a.index, b.index),
      )
      .slice(0, config.detailedWidth)
      .map((candidate) => candidate.index),
  );
  const beforeDetailedFutureScore = evaluateFutureTacticalValue(state, perspective, true, config.weights);

  return evaluated.map((candidate) => {
    const directMasterDetourPenalty = directMasterDamageDetourPenalty(
      state,
      candidate,
      perspective,
      hasDirectMasterPressure,
    );
    if (!lookaheadIndexes.has(candidate.index)) {
      return { ...candidate, totalScore: candidate.totalScore - directMasterDetourPenalty };
    }
    const detailedScore =
      candidate.decision.score +
      decisionTuningBonus(candidate.decision, config) +
      decisionSituationalBonus(state, candidate.after, candidate.decision, perspective, config) +
      evaluateState(candidate.after, perspective, config.weights) -
      beforeScore +
      evaluateFutureTacticalValue(candidate.after, perspective, true, config.weights) -
      beforeDetailedFutureScore;
    const continuation =
      config.sameTurnSearchDepth > 1
        ? evaluateSameTurnBeamContinuation(candidate.after, perspective, config.sameTurnSearchDepth - 1, config)
        : evaluateSameTurnContinuation(candidate.after, perspective, beforeFollowUpScore);
    const lookaheadBonus = config.sameTurnSearchDiscount * continuation;
    const adjustedLookaheadBonus = shouldDampenLookaheadForMasterRace(
      state,
      candidate,
      perspective,
      hasDirectMasterPressure,
    )
      ? lookaheadBonus * 0.25
      : lookaheadBonus;
    return { ...candidate, totalScore: detailedScore + adjustedLookaheadBonus - directMasterDetourPenalty };
  });
}

function shouldDampenLookaheadForMasterRace(
  before: GameState,
  candidate: EvaluatedDecision,
  perspective: PlayerId,
  hasDirectMasterPressure: boolean,
): boolean {
  if (!hasDirectMasterPressure || masterDamageFromTransition(before, candidate.after, perspective) > 0) {
    return false;
  }
  if (!isMasterRaceRelevant(before, perspective)) {
    return false;
  }
  if (candidate.decision.type === "master_action" && candidate.decision.actionId === "shield") {
    return false;
  }
  if (candidate.decision.type === "attack" && candidate.decision.action.target.kind === "monster") {
    return !!candidate.after.slots[candidate.decision.action.target.slotKey].monster;
  }
  return candidate.decision.type === "move" || candidate.decision.type === "focus" || candidate.decision.type === "summon";
}

function directMasterDamageDetourPenalty(
  before: GameState,
  candidate: EvaluatedDecision,
  perspective: PlayerId,
  hasDirectMasterPressure: boolean,
): number {
  if (
    !hasDirectMasterPressure ||
    masterDamageFromTransition(before, candidate.after, perspective) > 0 ||
    !isMasterRaceRelevant(before, perspective)
  ) {
    return 0;
  }
  if (candidate.decision.type !== "attack" || candidate.decision.action.target.kind !== "monster") {
    return 0;
  }
  if (!candidate.after.slots[candidate.decision.action.target.slotKey].monster) {
    return 0;
  }

  const directDamage = bestDirectMasterDamageForPlayer(before, perspective);
  if (directDamage <= 0) {
    return 0;
  }
  const opponent = opponentOf(perspective);
  const blackMasterPressure = before.players[perspective].masterId === "black";
  return (
    (blackMasterPressure ? 180 : 80) +
    directDamage * (blackMasterPressure ? 90 : 45) +
    (before.players[opponent].masterHp <= 5 ? 60 : 0)
  );
}

function isMasterRaceRelevant(state: GameState, perspective: PlayerId): boolean {
  const opponent = opponentOf(perspective);
  return (
    state.players[perspective].masterId === "black" ||
    state.players[perspective].masterHp < state.players[opponent].masterHp ||
    state.players[opponent].masterHp <= 8 ||
    state.players[perspective].deck.length <= 3 ||
    state.players[opponent].deck.length <= 3
  );
}

function isCloseoutState(state: GameState, perspective: PlayerId): boolean {
  const opponent = opponentOf(perspective);
  return (
    state.players[perspective].masterHp <= 4 ||
    state.players[opponent].masterHp <= 4 ||
    state.players[perspective].deck.length <= 2 ||
    state.players[opponent].deck.length <= 2
  );
}

function shouldPruneCloseoutNonProgressActions(state: GameState, perspective: PlayerId): boolean {
  return state.players[perspective].masterId === "white" && isCloseoutState(state, perspective);
}

function masterDamageFromTransition(before: GameState, after: GameState, perspective: PlayerId): number {
  const opponent = opponentOf(perspective);
  return Math.max(0, before.players[opponent].masterHp - after.players[opponent].masterHp);
}

function evaluateDecisionTransition(
  state: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  beforeScore: number,
  beforeFutureScore: number,
  detailedFuture: boolean,
  config: CpuAiProfileConfig,
): { after: GameState; totalScore: number } | undefined {
  let after: GameState;
  try {
    after = applyCpuDecision(state, decision);
  } catch {
    return undefined;
  }

  return {
    after,
    totalScore:
      decision.score +
      decisionTuningBonus(decision, config) +
      decisionSituationalBonus(state, after, decision, perspective, config) +
      evaluateState(after, perspective, config.weights) -
      beforeScore +
      evaluateFutureTacticalValue(after, perspective, detailedFuture, config.weights) -
      beforeFutureScore,
  };
}

function decisionTuningBonus(decision: CpuDecision, config: CpuAiProfileConfig): number {
  const bias = config.tuning?.actionBias;
  if (!bias) {
    return 0;
  }

  let bonus = 0;
  for (const id of decisionBiasIds(decision)) {
    bonus += bias[id] ?? 0;
  }
  return bonus;
}

function decisionSituationalBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
): number {
  const bias = config.tuning?.situationalBias;
  if (!bias) {
    return 0;
  }

  let bonus = 0;
  if (
    bias.setupLowStonePenalty &&
    after.players[perspective].stones <= 1 &&
    isSetupDecision(before, after, decision, perspective)
  ) {
    bonus -= bias.setupLowStonePenalty;
  }
  if (bias.shieldConversionBonus && isConvertibleShieldDecision(after, decision, perspective)) {
    bonus += bias.shieldConversionBonus;
  }
  if (bias.antiBerserkFrontBonus && isAntiBerserkFrontDecision(before, after, decision, perspective)) {
    bonus += bias.antiBerserkFrontBonus;
  }
  if (bias.whiteMonsterPressureBonus) {
    bonus += whiteMonsterPressureDecisionBonus(before, after, decision, perspective, bias.whiteMonsterPressureBonus);
  }
  return bonus;
}

function isSetupDecision(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
): boolean {
  const opponent = opponentOf(perspective);
  if (after.winner || after.players[opponent].masterHp < before.players[opponent].masterHp) {
    return false;
  }
  if (enemyMonsterWasRemoved(before, after, perspective) || ownMonsterLeveledUp(before, after, perspective)) {
    return false;
  }
  if (decision.type === "attack" && decision.action.target.kind === "monster") {
    const beforeTarget = before.slots[decision.action.target.slotKey].monster;
    const afterTarget = after.slots[decision.action.target.slotKey].monster;
    return !!(
      beforeTarget &&
      afterTarget &&
      beforeTarget.instanceId === afterTarget.instanceId &&
      beforeTarget.owner === opponent &&
      afterTarget.owner === opponent &&
      afterTarget.hp < beforeTarget.hp
    );
  }
  return (
    decision.type === "summon" ||
    decision.type === "move" ||
    decision.type === "focus" ||
    (decision.type === "master_action" && (decision.actionId === "shield" || decision.actionId === "wake_up"))
  );
}

function enemyMonsterWasRemoved(before: GameState, after: GameState, perspective: PlayerId): boolean {
  const opponent = opponentOf(perspective);
  return ALL_FIELD_ORDER.some((slotKey) => {
    const beforeMonster = before.slots[slotKey].monster;
    const afterMonster = after.slots[slotKey].monster;
    return !!(
      beforeMonster?.owner === opponent &&
      (!afterMonster || afterMonster.owner !== opponent || afterMonster.instanceId !== beforeMonster.instanceId)
    );
  });
}

function ownMonsterLeveledUp(before: GameState, after: GameState, perspective: PlayerId): boolean {
  return ALL_FIELD_ORDER.some((slotKey) => {
    const beforeMonster = before.slots[slotKey].monster;
    const afterMonster = after.slots[slotKey].monster;
    return !!(
      beforeMonster?.owner === perspective &&
      afterMonster?.owner === perspective &&
      beforeMonster.instanceId === afterMonster.instanceId &&
      afterMonster.level > beforeMonster.level
    );
  });
}

function isConvertibleShieldDecision(after: GameState, decision: CpuDecision, perspective: PlayerId): boolean {
  if (decision.type !== "master_action" || decision.actionId !== "shield" || decision.target.kind !== "monster") {
    return false;
  }
  const target = after.slots[decision.target.slotKey].monster;
  if (!target || target.owner !== perspective) {
    return false;
  }
  return (
    nextTurnLevelUpPotential(after, decision.target.slotKey) > 0 ||
    directMasterDamageFromSlot(after, decision.target.slotKey, perspective) > 0 ||
    bestAttackOpportunityScore(after, decision.target.slotKey) >= 220
  );
}

function isAntiBerserkFrontDecision(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
): boolean {
  const target = targetedEnemyFrontSlot(before, decision, perspective);
  if (!target) {
    return false;
  }
  const opponent = opponentOf(perspective);
  const opponentIsBlack = before.players[opponent].masterId === "black";
  const opponentCanBerserk = opponentIsBlack && before.players[opponent].stones >= getMasterActionCost("berserk_power");
  if (!opponentIsBlack && !opponentCanBerserk) {
    return false;
  }
  const beforeMonster = before.slots[target].monster;
  const afterMonster = after.slots[target].monster;
  return !!(
    beforeMonster?.owner === opponent &&
    (!afterMonster || afterMonster.owner !== opponent || afterMonster.instanceId !== beforeMonster.instanceId || afterMonster.hp < beforeMonster.hp)
  );
}

function targetedEnemyFrontSlot(before: GameState, decision: CpuDecision, perspective: PlayerId): SlotKey | undefined {
  const target = decision.type === "attack"
    ? decision.action.target
    : decision.type === "master_action" && decision.actionId === "master_attack"
      ? decision.target
      : undefined;
  if (target?.kind !== "monster") {
    return undefined;
  }
  const slot = before.slots[target.slotKey];
  if (slot.row !== "front" || slot.monster?.owner !== opponentOf(perspective)) {
    return undefined;
  }
  return target.slotKey;
}

function whiteMonsterPressureDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "attack" ||
    decision.action.target.kind !== "monster"
  ) {
    return 0;
  }
  const opponent = opponentOf(perspective);
  const targetBefore = before.slots[decision.action.target.slotKey].monster;
  const targetAfter = after.slots[decision.action.target.slotKey].monster;
  if (!targetBefore || targetBefore.owner !== opponent) {
    return 0;
  }
  if (!targetAfter || targetAfter.owner !== opponent || targetAfter.instanceId !== targetBefore.instanceId) {
    return value;
  }
  return targetAfter.hp < targetBefore.hp ? value : 0;
}

function decisionBiasIds(decision: CpuDecision): CpuAiDecisionBiasId[] {
  if (decision.type === "attack") {
    return decision.action.target.kind === "master"
      ? ["attack", "attack_master"]
      : ["attack", "attack_monster"];
  }
  if (decision.type === "master_action") {
    return ["master_action", decision.actionId];
  }
  return [decision.type];
}

function evaluateSameTurnContinuation(state: GameState, perspective: PlayerId, beforeFollowUpScore: number): number {
  if (state.winner || state.pendingLevelUp || state.currentPlayer !== perspective) {
    return 0;
  }
  return Math.max(0, bestAttackOpportunityScore(state) - beforeFollowUpScore);
}

function evaluateSameTurnBeamContinuation(
  state: GameState,
  perspective: PlayerId,
  depth: number,
  config: CpuAiProfileConfig,
): number {
  if (depth <= 0 || state.winner || state.pendingLevelUp || state.currentPlayer !== perspective) {
    return 0;
  }

  const candidates = evaluateImmediateCpuDecisions(state, perspective, config)
    .filter((candidate) => candidate.decision.type !== "end_turn" && candidate.totalScore > config.beamScoreThreshold)
    .sort(
      (a, b) =>
        b.totalScore - a.totalScore || compareTieBreak(a.decision, b.decision, a.index, b.index),
    )
    .slice(0, config.sameTurnSearchWidth);

  let best = 0;
  for (const candidate of candidates) {
    const continuation =
      candidate.totalScore +
      config.sameTurnSearchDiscount *
        evaluateSameTurnBeamContinuation(candidate.after, perspective, depth - 1, config);
    best = Math.max(best, continuation);
  }
  return best;
}

function evaluateImmediateCpuDecisions(state: GameState, perspective: PlayerId, config: CpuAiProfileConfig): EvaluatedDecision[] {
  const beforeScore = evaluateState(state, perspective, config.weights);
  const beforeFutureScore = evaluateFutureTacticalValue(state, perspective, false, config.weights);
  return listCpuDecisions(state, config.weights).flatMap((decision, index) => {
    const transition = evaluateDecisionTransition(state, decision, perspective, beforeScore, beforeFutureScore, false, config);
    return transition ? [{ decision, totalScore: transition.totalScore, index, after: transition.after }] : [];
  });
}

export function listCpuDecisions(state: GameState, weights: AiEvaluationWeights = DEFAULT_AI_EVALUATION_WEIGHTS): CpuDecision[] {
  if (state.winner || state.pendingLevelUp) {
    return [createEndTurnDecision()];
  }

  return [
    ...listAttackDecisions(state, weights),
    ...listMasterActionDecisions(state, weights),
    ...listMagicDecisions(state, weights),
    ...listSummonDecisions(state),
    ...listMoveDecisions(state),
    ...listFocusDecisions(state),
    createEndTurnDecision(),
  ];
}

export function applyCpuDecision(state: GameState, decision: CpuDecision): GameState {
  const stateWithReason = appendDecisionReasonLog(state, decision);
  if (decision.type === "attack") {
    return attackWithCommand(stateWithReason, decision.action);
  }
  if (decision.type === "master_action") {
    return useMasterAction(stateWithReason, decision.actionId, decision.target);
  }
  if (decision.type === "summon") {
    return summonMonster(stateWithReason, decision.handInstanceId, decision.slotKey);
  }
  if (decision.type === "focus") {
    return focusMonster(stateWithReason, decision.slotKey);
  }
  if (decision.type === "magic") {
    return playMagic(stateWithReason, decision.action);
  }
  if (decision.type === "move") {
    return moveMonster(stateWithReason, decision.fromSlotKey, decision.toSlotKey);
  }
  return endTurn(stateWithReason);
}

function appendDecisionReasonLog(state: GameState, decision: CpuDecision): GameState {
  const next = structuredClone(state) as GameState;
  const actor = next.currentPlayer === "cpu" ? "CPU" : "プレイヤーAI";
  next.log.push(`${actor}判断: ${decision.reason}`);
  if (next.log.length > 120) {
    next.log = next.log.slice(-120);
  }
  return next;
}

export function evaluateState(
  state: GameState,
  perspective: PlayerId = "cpu",
  weights: AiEvaluationWeights = DEFAULT_AI_EVALUATION_WEIGHTS,
): number {
  const opponent = opponentOf(perspective);
  if (state.winner === perspective) {
    return 1_000_000;
  }
  if (state.winner === opponent) {
    return -1_000_000;
  }

  let score = 0;
  score += (state.players[perspective].masterHp - state.players[opponent].masterHp) * weights.masterHp;
  score += (state.players[perspective].stones - state.players[opponent].stones) * weights.stone;
  score += (state.players[perspective].hand.length - state.players[opponent].hand.length) * weights.hand;
  score += (state.players[perspective].deck.length - state.players[opponent].deck.length) * weights.deck;

  for (const slotKey of ALL_FIELD_ORDER) {
    const value = monsterValue(state, slotKey);
    if (state.slots[slotKey].monster?.owner === perspective) {
      score += value;
    } else {
      score -= value;
    }
  }

  return score;
}

function evaluateFutureTacticalValue(
  state: GameState,
  perspective: PlayerId,
  detailed = true,
  weights: AiEvaluationWeights = DEFAULT_AI_EVALUATION_WEIGHTS,
): number {
  if (state.winner) {
    return 0;
  }

  const opponent = opponentOf(perspective);
  const ownBestAttack = bestAttackOpportunityScoreForPlayer(state, perspective, detailed);
  const opponentBestAttack = bestAttackOpportunityScoreForPlayer(state, opponent, detailed);
  const ownLevelUpPotential = nextTurnLevelUpPotentialForPlayer(state, perspective);
  const opponentLevelUpPotential = nextTurnLevelUpPotentialForPlayer(state, opponent);
  const own = state.players[perspective];
  const enemy = state.players[opponent];
  const ownHandPressure = Math.max(0, own.hand.length - 4) * -5;
  const enemyHandPressure = Math.max(0, enemy.hand.length - 4) * 3;
  const ownDeckDanger = own.deck.length <= 2 ? (3 - own.deck.length) * -18 : Math.min(own.deck.length, 12) * 0.5;
  const enemyDeckDanger = enemy.deck.length <= 2 ? (3 - enemy.deck.length) * 12 : Math.min(enemy.deck.length, 12) * -0.35;
  let detailedScore = 0;
  if (detailed) {
    const ownThreatModel = buildThreatModel(state, perspective);
    const opponentThreatModel = buildThreatModel(state, opponent);
    const ownMasterDamage = ownThreatModel.masterDamage[opponent];
    const opponentMasterDamage = opponentThreatModel.masterDamage[perspective];
    const ownThreatenedMonsterValue = threatenedMonsterValueForPlayer(state, perspective, opponentThreatModel);
    const opponentThreatenedMonsterValue = threatenedMonsterValueForPlayer(state, opponent, ownThreatModel);
    const ownLethalPressure = ownMasterDamage >= enemy.masterHp ? 900 : ownMasterDamage * (weights.masterDamageBase * 0.47);
    const opponentLethalThreat =
      opponentMasterDamage >= own.masterHp ? 1_100 : opponentMasterDamage >= 3 ? 190 + opponentMasterDamage * 36 : opponentMasterDamage * 38;
    detailedScore =
      ownLethalPressure -
      opponentLethalThreat +
      opponentThreatenedMonsterValue * weights.futureOpponentThreatenedMonster -
      ownThreatenedMonsterValue * weights.futureOwnThreatenedMonster;
  }

  return (
    ownBestAttack * 0.08 -
    opponentBestAttack * 0.16 +
    ownLevelUpPotential * weights.futureOwnLevelUp -
    opponentLevelUpPotential * weights.futureOpponentLevelUp +
    detailedScore +
    ownHandPressure +
    enemyHandPressure +
    ownDeckDanger +
    enemyDeckDanger
  );
}

function listAttackDecisions(state: GameState, weights: AiEvaluationWeights): CpuDecision[] {
  const decisions: CpuDecision[] = [];
  const playerId = state.currentPlayer;

  for (const slotKey of FIELD_ORDER_BY_PLAYER[playerId]) {
    const monster = state.slots[slotKey].monster;
    if (!monster?.status || monster.status !== "active" || monster.actionCount >= monster.actionLimit) {
      continue;
    }

    for (const command of getMonsterCommands(monster)) {
      for (const target of getCommandTargets(state, slotKey, command.id)) {
        if (
          isOwnedMonsterTarget(state, target, playerId) &&
          !canUseOwnedMonsterTargetForCommand(state, slotKey, command.id) &&
          !isPotentialBerserkFeedDenialSetupAttack(state, slotKey, command, target)
        ) {
          continue;
        }

        for (const action of expandCommandActions(state, {
          attackerSlotKey: slotKey,
          commandId: command.id,
          target,
        })) {
          const decision = createAttackDecision(state, action, weights);
          if (decision) {
            decisions.push(decision);
          }
        }
      }
    }
  }

  return decisions;
}

function canUseOwnedMonsterTargetForCommand(state: GameState, attackerSlotKey: SlotKey, commandId: string): boolean {
  const monster = state.slots[attackerSlotKey].monster;
  const command = monster ? getMonsterCommands(monster).find((item) => item.id === commandId) : undefined;
  if (
    command?.name === "癒しの羽" ||
    command?.name === "夢幻の光" ||
    command?.name === "レベルムーブ" ||
    command?.name === "再生" ||
    command?.name === "マナ変化" ||
    command?.name === "コールドブレス"
  ) {
    return true;
  }
  return getCommandHandChoices(state, attackerSlotKey, commandId).length > 0;
}

function createAttackDecision(state: GameState, action: CommandAction, weights: AiEvaluationWeights): CpuDecision | undefined {
  const after = attackWithCommand(state, action);
  const score = scoreAttackDecision(state, after, action, weights);
  if (score <= -90) {
    return undefined;
  }

  return {
    type: "attack",
    action,
    reason: attackReason(state, after, action),
    score,
  };
}

function expandCommandActions(state: GameState, baseAction: CommandAction): CommandAction[] {
  const secondaryTargets = getCommandSecondaryTargets(state, baseAction);
  if (secondaryTargets.length > 0) {
    return secondaryTargets.map((secondaryTarget) => ({ ...baseAction, secondaryTarget }));
  }

  const handChoices = getCommandHandChoices(state, baseAction.attackerSlotKey, baseAction.commandId);
  if (handChoices.length > 0) {
    return handChoices.map((card) => ({ ...baseAction, secondaryHandInstanceId: card.instanceId }));
  }

  return [baseAction];
}

function scoreAttackDecision(state: GameState, after: GameState, action: CommandAction, weights: AiEvaluationWeights): number {
  const playerId = state.currentPlayer;
  const opponent = opponentOf(playerId);
  if (after.winner === playerId) {
    return 1_000_000;
  }

  const attackerDefeated = attackerWasDefeated(state, after, action.attackerSlotKey);
  const recoilPenalty = attackerDefeated ? -120 + selfRemovalFeedDenialBonus(state, after, action.attackerSlotKey) : 0;
  const stateDelta = evaluateState(after, playerId, weights) - evaluateState(state, playerId, weights);
  if (action.secondaryHandInstanceId) {
    return scoreCommandHandChoiceDecision(state, action, stateDelta, recoilPenalty);
  }
  if (action.target.kind === "master") {
    const damage = state.players[opponent].masterHp - after.players[opponent].masterHp;
    if (damage <= 0) {
      return stateDelta > 8 ? 30 + stateDelta + recoilPenalty : -100;
    }
    return masterDamageScore(state, playerId, damage, weights) + recoilPenalty;
  }

  const targetBefore = state.slots[action.target.slotKey].monster;
  const targetAfter = after.slots[action.target.slotKey].monster;
  if (!targetBefore) {
    return -100;
  }

  if (targetBefore.owner === playerId) {
    const ownedMonsterAttackScore = scoreOwnedMonsterAttackDecision(state, after, action, targetBefore, targetAfter, weights);
    if (ownedMonsterAttackScore > -90) {
      return ownedMonsterAttackScore;
    }
    if (!targetAfter || targetBefore.hp > targetAfter.hp) {
      return -100;
    }
  }

  if (!targetAfter) {
    const levelGain = attackerLevelGain(state, after, action.attackerSlotKey);
    return (
      weights.monsterKillBase +
      monsterValue(state, action.target.slotKey) +
      80 * levelGain +
      levelUpHpTimingBonus(state, after, action.attackerSlotKey) +
      recoilPenalty
    );
  }

  const damage = targetBefore.hp - targetAfter.hp;
  if (damage <= 0) {
    return scoreZeroDamageMonsterAttack(state, after, action.target.slotKey, targetBefore, targetAfter, stateDelta, recoilPenalty);
  }
  if (shouldPruneDeckOutUnresolvedLethalThreat(state, after, action.target.slotKey)) {
    return -100;
  }
  if (shouldPruneCloseoutNonProgressActions(state, playerId) && damage < targetAfter.hp && stateDelta < 45) {
    return -100;
  }
  const directMasterDamage = bestDirectMasterDamageForPlayer(state, playerId);
  if (directMasterDamage > 0) {
    const racePenalty =
      34 +
      directMasterDamage * 22 +
      (state.players[playerId].masterHp <= state.players[opponent].masterHp ? 18 : 0);
    return weights.monsterDamagePerPoint * damage + recoilPenalty - racePenalty;
  }
  return weights.monsterDamagePerPoint * damage + recoilPenalty;
}

function scoreZeroDamageMonsterAttack(
  state: GameState,
  after: GameState,
  targetSlotKey: SlotKey,
  targetBefore: MonsterState,
  targetAfter: MonsterState,
  stateDelta: number,
  recoilPenalty: number,
): number {
  const playerId = state.currentPlayer;
  const opponent = opponentOf(playerId);
  const strippedFocus = targetBefore.focused && !targetAfter.focused;
  const closeout = shouldPruneCloseoutNonProgressActions(state, playerId) || isDeckOutRace(state) || isMasterRaceRelevant(state, playerId);

  if (strippedFocus) {
    const targetThreatBefore = directMasterDamageFromSlot(state, targetSlotKey, opponent);
    const targetThreatAfter = directMasterDamageFromSlot(after, targetSlotKey, opponent);
    if (targetThreatAfter < targetThreatBefore) {
      const preventsMasterLethal = targetThreatBefore >= state.players[playerId].masterHp;
      if (!isDeckOutRace(state) || preventsMasterLethal) {
        return 24 + (targetThreatBefore - targetThreatAfter) * 38 + Math.max(0, stateDelta) * 0.25 + recoilPenalty;
      }
    }

    const followUpImprovement = bestAttackOpportunityScore(after) - bestAttackOpportunityScore(state);
    if (!closeout && followUpImprovement >= 70) {
      return 12 + followUpImprovement * 0.35 + Math.max(0, stateDelta) * 0.2 + recoilPenalty;
    }
  }

  if (closeout) {
    return -100;
  }
  return stateDelta > 8 ? 30 + stateDelta + recoilPenalty : -100;
}

function scoreOwnedMonsterAttackDecision(
  state: GameState,
  after: GameState,
  action: CommandAction,
  targetBefore: MonsterState,
  targetAfter: MonsterState | undefined,
  weights: AiEvaluationWeights,
): number {
  if (action.target.kind !== "monster" || targetBefore.owner !== state.currentPlayer) {
    return -100;
  }
  if (!targetAfter || targetAfter.instanceId !== targetBefore.instanceId) {
    return -100;
  }

  const damage = targetBefore.hp - targetAfter.hp;
  if (damage <= 0 || targetAfter.hp !== 1) {
    return -100;
  }

  let berserkState: GameState;
  try {
    berserkState = useMasterAction(after, "berserk_power", action.target);
  } catch {
    return -100;
  }

  const followUp = bestBerserkSelfDestructAttackScore(berserkState, action.target.slotKey, weights);
  const deniedFeed = opponentLevelFeedValue(state, action.target.slotKey);
  if (followUp <= 0 || deniedFeed <= 0) {
    return -100;
  }

  return 96 + Math.min(155, deniedFeed * 0.65) + followUp * 0.45 - damage * 8;
}

function isPotentialBerserkFeedDenialSetupAttack(
  state: GameState,
  attackerSlotKey: SlotKey,
  command: ReturnType<typeof getMonsterCommands>[number],
  target: Target,
): boolean {
  if (target.kind !== "monster" || state.players[state.currentPlayer].masterId !== "black") {
    return false;
  }
  if (
    !getCurrentMasterActionIds(state).includes("berserk_power") ||
    state.players[state.currentPlayer].stones < getMasterActionCost("berserk_power")
  ) {
    return false;
  }

  const attackerSlot = state.slots[attackerSlotKey];
  const attacker = attackerSlot.monster;
  const targetSlot = state.slots[target.slotKey];
  const targetMonster = targetSlot.monster;
  if (
    !attacker ||
    !targetMonster ||
    targetMonster.owner !== state.currentPlayer ||
    targetMonster.status !== "active" ||
    targetMonster.berserkPower ||
    targetMonster.actionCount >= targetMonster.actionLimit ||
    attackerSlot.row !== "back" ||
    targetSlot.row !== "front" ||
    targetMonster.hp <= 1
  ) {
    return false;
  }

  const damage = estimateMonsterDamage(targetMonster, attacker, command);
  return damage > 0 && targetMonster.hp - damage === 1 && opponentLevelFeedValue(state, target.slotKey) > 0;
}

function selfRemovalFeedDenialBonus(state: GameState, after: GameState, attackerSlotKey: SlotKey): number {
  const before = state.slots[attackerSlotKey].monster;
  const current = after.slots[attackerSlotKey].monster;
  if (!before || current?.instanceId === before.instanceId) {
    return 0;
  }

  const deniedFeed = opponentLevelFeedValue(state, attackerSlotKey);
  return deniedFeed > 0 ? Math.min(250, 140 + deniedFeed * 0.8) : 0;
}

function levelUpHpTimingBonus(state: GameState, after: GameState, attackerSlotKey: SlotKey): number {
  const before = state.slots[attackerSlotKey].monster;
  const current = after.slots[attackerSlotKey].monster;
  if (!before || !current || current.instanceId !== before.instanceId || current.level <= before.level) {
    return 0;
  }
  if (state.players[before.owner].masterId !== "white") {
    return 0;
  }

  const missingHp = Math.max(0, monsterMaxHp(before) - before.hp);
  if (missingHp > 0) {
    return Math.min(130, 30 + missingHp * 28 + Math.max(0, current.hp - before.hp) * 4);
  }

  return -26 * (current.level - before.level);
}

function opponentLevelFeedValue(state: GameState, slotKey: SlotKey): number {
  const target = state.slots[slotKey].monster;
  if (!target || target.status !== "active") {
    return 0;
  }

  const opponent = opponentOf(target.owner);
  if (state.players[opponent].stones <= 0) {
    return 0;
  }

  const readyState = readyPlayerForTacticalEvaluation(state, opponent);
  let best = 0;
  for (const attackerSlotKey of FIELD_ORDER_BY_PLAYER[opponent]) {
    const attacker = readyState.slots[attackerSlotKey].monster;
    if (!attacker?.status || attacker.status !== "active" || attacker.actionCount >= attacker.actionLimit || attacker.levelFixed) {
      continue;
    }
    const levelRoom = getMonsterDef(attacker.cardId).maxLevel - attacker.level;
    const levelGain = Math.min(target.level, state.players[opponent].stones, levelRoom);
    if (levelGain <= 0) {
      continue;
    }
    for (const command of getMonsterCommands(attacker)) {
      for (const candidate of getCommandTargets(readyState, attackerSlotKey, command.id)) {
        if (candidate.kind !== "monster" || candidate.slotKey !== slotKey) {
          continue;
        }
        const targetInReadyState = readyState.slots[slotKey].monster;
        if (targetInReadyState && estimateMonsterDamage(targetInReadyState, attacker, command) >= targetInReadyState.hp) {
          best = Math.max(best, 72 * levelGain + monsterValue(state, slotKey) * 0.22);
        }
      }
    }
  }
  return best;
}

function bestBerserkSelfDestructAttackScore(
  state: GameState,
  attackerSlotKey: SlotKey,
  weights: AiEvaluationWeights = DEFAULT_AI_EVALUATION_WEIGHTS,
): number {
  const attacker = state.slots[attackerSlotKey].monster;
  if (!attacker || attacker.owner !== state.currentPlayer || attacker.status !== "active" || attacker.hp > 1 || !attacker.berserkPower) {
    return 0;
  }

  let best = 0;
  for (const command of getMonsterCommands(attacker)) {
    for (const target of getCommandTargets(state, attackerSlotKey, command.id)) {
      if (isOwnedMonsterTarget(state, target, attacker.owner)) {
        continue;
      }
      let after: GameState;
      try {
        after = attackWithCommand(state, { attackerSlotKey, commandId: command.id, target });
      } catch {
        continue;
      }
      if (!attackerWasDefeated(state, after, attackerSlotKey)) {
        continue;
      }

      const deniedFeed = Math.min(95, opponentLevelFeedValue(state, attackerSlotKey) * 0.32);
      if (target.kind === "master") {
        const damage = Math.max(0, state.players[target.playerId].masterHp - after.players[target.playerId].masterHp);
        best = Math.max(best, (damage > 0 ? masterDamageScore(state, attacker.owner, damage, weights) : 8) + deniedFeed);
        continue;
      }

      const beforeTarget = state.slots[target.slotKey].monster;
      const currentTarget = after.slots[target.slotKey].monster;
      if (!beforeTarget) {
        continue;
      }
      if (!currentTarget || currentTarget.instanceId !== beforeTarget.instanceId) {
        best = Math.max(best, weights.monsterKillBase + monsterValue(state, target.slotKey) * 0.65 + deniedFeed);
        continue;
      }
      const damage = Math.max(0, beforeTarget.hp - currentTarget.hp);
      if (damage > 0) {
        best = Math.max(best, damage * (weights.monsterDamagePerPoint + 4) + deniedFeed);
      }
    }
  }
  return best;
}

function monsterMaxHp(monster: MonsterState): number {
  return Math.max(
    ...getMonsterDef(monster.cardId).levels
      .filter((level) => level.level === monster.level)
      .map((level) => level.maxHp),
  );
}

function shouldPruneDeckOutUnresolvedLethalThreat(state: GameState, after: GameState, targetSlotKey: SlotKey): boolean {
  if (!isDeckOutRace(state)) {
    return false;
  }
  const playerId = state.currentPlayer;
  const opponent = opponentOf(playerId);
  const targetAfter = after.slots[targetSlotKey].monster;
  if (!targetAfter) {
    return false;
  }
  const targetThreatBefore = directMasterDamageFromSlot(state, targetSlotKey, opponent);
  if (targetThreatBefore < state.players[playerId].masterHp) {
    return false;
  }
  return directMasterDamageFromSlot(after, targetSlotKey, opponent) >= state.players[playerId].masterHp;
}

function scoreCommandHandChoiceDecision(
  state: GameState,
  action: CommandAction,
  stateDelta: number,
  recoilPenalty: number,
): number {
  const selectedCard = state.players[state.currentPlayer].hand.find((card) => card.instanceId === action.secondaryHandInstanceId);
  if (!selectedCard) {
    return -100;
  }
  return 24 + stateDelta + handMonsterPlacementValue(state, selectedCard.cardId, action.attackerSlotKey) * 0.35 + recoilPenalty;
}

function masterDamageScore(
  state: GameState,
  playerId: PlayerId,
  damage: number,
  weights: AiEvaluationWeights = DEFAULT_AI_EVALUATION_WEIGHTS,
): number {
  const opponent = opponentOf(playerId);
  const ownHp = state.players[playerId].masterHp;
  const opponentHp = state.players[opponent].masterHp;
  const raceGapBonus = Math.min(60, Math.max(0, opponentHp - ownHp) * 16);
  const closeoutBonus = opponentHp <= 4 ? (5 - opponentHp) * 12 : 0;
  return (weights.masterDamageBase + raceGapBonus + closeoutBonus) * damage;
}

function attackReason(state: GameState, after: GameState, action: CommandAction): string {
  if (after.winner === state.currentPlayer) {
    return "相手マスターを倒せるため攻撃";
  }
  if (action.target.kind === "master") {
    return "相手マスターへ実ダメージを与えられるため攻撃";
  }
  if (state.slots[action.target.slotKey].monster?.owner === state.currentPlayer) {
    return "バーサク反動で相手のレベルアップ餌を避ける準備のため味方を攻撃";
  }
  if (!after.slots[action.target.slotKey].monster) {
    return "敵モンスターを撃破できるため攻撃";
  }
  if (action.secondaryHandInstanceId) {
    return "手札選択を含む特殊効果で局面を改善できるため使用";
  }
  if (action.secondaryTarget) {
    return "追加対象を選ぶ特殊効果で局面を改善できるため使用";
  }
  const target = state.slots[action.target.slotKey].monster;
  return target ? `${getCardName(target.cardId)}を削れるため攻撃` : "有効ダメージを与えられるため攻撃";
}

function listMasterActionDecisions(state: GameState, weights: AiEvaluationWeights): CpuDecision[] {
  return getCurrentMasterActionIds(state).flatMap((actionId) => {
    if (actionId === "master_attack") {
      return listMasterAttackDecisions(state);
    }
    if (actionId === "wake_up") {
      return listWakeUpDecisions(state);
    }
    if (actionId === "shield") {
      return listShieldDecisions(state);
    }
    if (actionId === "berserk_power") {
      return listBerserkPowerDecisions(state);
    }
    if (actionId === "earth_anger") {
      return listEarthAngerDecisions(state, weights);
    }
    return [];
  });
}

function listMasterAttackDecisions(state: GameState): CpuDecision[] {
  const playerId = state.currentPlayer;
  return getMasterActionTargets(state, "master_attack")
    .filter((target) => target.kind === "monster" && !isOwnedMonsterTarget(state, target, playerId))
    .map((target) => createMasterAttackDecision(state, target))
    .filter((decision): decision is CpuDecision => !!decision);
}

function createMasterAttackDecision(state: GameState, target: Target): CpuDecision | undefined {
  const after = useMasterAction(state, "master_attack", target);
  const targetBefore = target.kind === "monster" ? state.slots[target.slotKey].monster : undefined;
  const targetAfter = target.kind === "monster" ? after.slots[target.slotKey].monster : undefined;
  if (!targetBefore || target.kind !== "monster") {
    return undefined;
  }

  if (!targetAfter) {
    return {
      type: "master_action",
      actionId: "master_attack",
      target,
      reason: "マスターアタックで敵モンスターを撃破できるため使用",
      score: 220 + monsterValue(state, target.slotKey),
    };
  }

  const damage = targetBefore.hp - targetAfter.hp;
  const score = 10 * damage - 18;
  if (damage <= 0 || score < 0 || shouldPruneCloseoutNonProgressActions(state, state.currentPlayer)) {
    return undefined;
  }

  return {
    type: "master_action",
    actionId: "master_attack",
    target,
    reason: "ストーンに余裕があり敵を削れるためマスターアタック",
    score,
  };
}

function listWakeUpDecisions(state: GameState): CpuDecision[] {
  return getMasterActionTargets(state, "wake_up")
    .filter((target) => target.kind === "monster")
    .map((target) => createWakeUpDecision(state, target))
    .filter((decision): decision is CpuDecision => !!decision);
}

function createWakeUpDecision(state: GameState, target: Target): CpuDecision | undefined {
  if (target.kind !== "monster") {
    return undefined;
  }
  const monster = state.slots[target.slotKey].monster;
  if (!monster || monster.status !== "prepared") {
    return undefined;
  }
  const after = useMasterAction(state, "wake_up", target);
  if (monster.owner !== state.currentPlayer) {
    const attackScore = bestAttackOpportunityScore(after, undefined, target.slotKey);
    if (attackScore < 260) {
      return undefined;
    }
    return {
      type: "master_action",
      actionId: "wake_up",
      target,
      reason: "相手の準備中モンスターを起こして撃破できるためウェイクアップ",
      score: 42 + attackScore * 0.7 - 16,
    };
  }

  const bestFollowUpAttack = bestAttackOpportunityScore(after, target.slotKey);
  const canActNow = bestFollowUpAttack > 0;
  if (!canActNow && isDeckOutRace(state)) {
    return undefined;
  }
  if (!canActNow && shouldPruneCloseoutNonProgressActions(state, state.currentPlayer)) {
    return undefined;
  }
  const score = 28 + monsterValue(state, target.slotKey) * 0.35 + bestFollowUpAttack * 0.45 + (canActNow ? 35 : 0) - 16;
  if (score < 32) {
    return undefined;
  }
  return {
    type: "master_action",
    actionId: "wake_up",
    target,
    reason: canActNow
      ? "準備中の味方を起こすと追加行動できるためウェイクアップ"
      : "高価値の準備中味方を早く登場させるためウェイクアップ",
    score,
  };
}

function listShieldDecisions(state: GameState): CpuDecision[] {
  return getMasterActionTargets(state, "shield")
    .filter((target) => target.kind === "monster" && state.slots[target.slotKey].owner === state.currentPlayer)
    .map((target) => createShieldDecision(state, target))
    .filter((decision): decision is CpuDecision => !!decision);
}

function createShieldDecision(state: GameState, target: Target): CpuDecision | undefined {
  if (target.kind !== "monster") {
    return undefined;
  }
  const monster = state.slots[target.slotKey].monster;
  if (!monster || monster.shielded || monster.status !== "active") {
    return undefined;
  }
  const threat = incomingThreat(state, target.slotKey);
  const shielded = useMasterAction(state, "shield", target);
  const threatAfterShield = incomingThreat(shielded, target.slotKey);
  const preventsLethal = threat.lethal && !threatAfterShield.lethal;
  const reducesDamage = threatAfterShield.maxDamage < threat.maxDamage;
  const important = monster.level >= 2 || getMonsterAiTrait(monster.cardId).role === "back" || monster.hp <= 2;
  const levelUpPotential = nextTurnLevelUpPotential(state, target.slotKey);
  const closeout = shouldPruneCloseoutNonProgressActions(state, state.currentPlayer);
  if (!threat.threatened && isDeckOutRace(state)) {
    return undefined;
  }
  if (!threat.threatened && !important) {
    return undefined;
  }
  if (closeout && !preventsLethal && !threat.lethal && levelUpPotential <= 0) {
    return undefined;
  }
  if (isWhiteMirrorCloseout(state) && !preventsLethal && !threat.lethal && levelUpPotential <= 0) {
    return undefined;
  }
  if (!shouldProtectInDeckOutRace(state, target.slotKey, threat, preventsLethal, levelUpPotential)) {
    return undefined;
  }
  if (shouldHoldShieldForMasterRace(state, threat, preventsLethal, levelUpPotential)) {
    return undefined;
  }
  const score =
    14 +
    monsterValue(state, target.slotKey) * 0.18 +
    levelUpPotential * 0.24 +
    (preventsLethal ? 96 : threat.lethal ? 48 : reducesDamage ? 30 : threat.threatened ? 20 : 0) -
    14;
  if (score < 28) {
    return undefined;
  }
  return {
    type: "master_action",
    actionId: "shield",
    target,
    reason: preventsLethal
      ? "致死圏の味方を守れるためシールド"
      : threat.lethal
        ? "倒されそうな高価値味方を守るためシールド"
        : levelUpPotential > 0
          ? "次ターンのレベルアップ筋を残すためシールド"
          : "高価値の味方を守るためシールド",
    score,
  };
}

function shouldHoldShieldForMasterRace(
  state: GameState,
  threat: IncomingThreat,
  preventsLethal: boolean,
  levelUpPotential: number,
): boolean {
  if (state.players[state.currentPlayer].masterId !== "white") {
    return false;
  }
  if (preventsLethal || threat.lethal || levelUpPotential > 0) {
    return false;
  }

  const directDamage = bestDirectMasterDamageForPlayer(state, state.currentPlayer);
  if (directDamage <= 0) {
    return false;
  }
  const opponent = opponentOf(state.currentPlayer);
  return state.players[opponent].masterHp <= 6 || state.players[state.currentPlayer].masterHp <= state.players[opponent].masterHp;
}

function listBerserkPowerDecisions(state: GameState): CpuDecision[] {
  return getMasterActionTargets(state, "berserk_power")
    .filter((target) => target.kind === "monster" && state.slots[target.slotKey].owner === state.currentPlayer)
    .map((target) => createBerserkPowerDecision(state, target))
    .filter((decision): decision is CpuDecision => !!decision);
}

function createBerserkPowerDecision(state: GameState, target: Target): CpuDecision | undefined {
  if (target.kind !== "monster") {
    return undefined;
  }
  const monster = state.slots[target.slotKey].monster;
  if (!monster || monster.status !== "active" || monster.berserkPower || monster.actionCount >= monster.actionLimit) {
    return undefined;
  }

  const after = useMasterAction(state, "berserk_power", target);
  const feedDenialSelfDestructScore = bestBerserkSelfDestructAttackScore(after, target.slotKey);
  const deniedFeed = opponentLevelFeedValue(state, target.slotKey);
  if (monster.hp <= 1 && feedDenialSelfDestructScore > 0 && deniedFeed > 0) {
    return {
      type: "master_action",
      actionId: "berserk_power",
      target,
      reason: "バーサク反動で相手のレベルアップ餌を避けられるため使用",
      score: 36 + Math.min(120, deniedFeed * 0.4) + feedDenialSelfDestructScore * 0.32 - 18,
    };
  }

  const beforeBest = bestAttackOpportunityScore(state, target.slotKey);
  const afterBest = bestAttackOpportunityScore(after, target.slotKey);
  const improvement = afterBest - beforeBest;
  if (afterBest < 55 || improvement <= 18) {
    return undefined;
  }

  return {
    type: "master_action",
    actionId: "berserk_power",
    target,
    reason: "バーサクパワーで次の攻撃価値を上げられるため使用",
    score: 20 + afterBest * 0.32 + improvement * 0.75 - 18,
  };
}

function listEarthAngerDecisions(state: GameState, weights: AiEvaluationWeights): CpuDecision[] {
  return getMasterActionTargets(state, "earth_anger")
    .map((target) => createEarthAngerDecision(state, target, weights))
    .filter((decision): decision is CpuDecision => !!decision);
}

function createEarthAngerDecision(state: GameState, target: Target, weights: AiEvaluationWeights): CpuDecision | undefined {
  if (target.kind !== "master" || target.playerId !== state.currentPlayer) {
    return undefined;
  }
  const beforeScore = evaluateState(state, state.currentPlayer, weights);
  const after = useMasterAction(state, "earth_anger", target);
  const score = evaluateState(after, state.currentPlayer, weights) - beforeScore - 28;
  if (score < 45) {
    return undefined;
  }

  return {
    type: "master_action",
    actionId: "earth_anger",
    target,
    reason: "大地の怒りで盤面全体の交換が有利になるため使用",
    score,
  };
}

function listMagicDecisions(state: GameState, weights: AiEvaluationWeights): CpuDecision[] {
  const decisions: CpuDecision[] = [];
  const playerId = state.currentPlayer;
  const beforeScore = evaluateState(state, playerId, weights);

  for (const card of state.players[playerId].hand) {
    const def = getCardDef(card.cardId);
    if (def.type !== "magic") {
      continue;
    }

    for (const target of getMagicTargets(state, card.instanceId)) {
      for (const action of expandMagicActions(state, { handInstanceId: card.instanceId, target })) {
        let after: GameState;
        try {
          after = playMagic(state, action);
        } catch {
          continue;
        }
        const score = scoreMagicDecision(state, after, action, beforeScore, weights);
        if (score <= 10) {
          continue;
        }
        decisions.push({
          type: "magic",
          action,
          reason: magicReason(state, after, action),
          score,
        });
      }
    }
  }

  return decisions;
}

function expandMagicActions(state: GameState, baseAction: MagicAction): MagicAction[] {
  const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === baseAction.handInstanceId);
  if (card?.cardId === "card_115") {
    return buildSortDeckActions(state, baseAction);
  }

  const secondaryTargets = getMagicSecondaryTargets(state, baseAction);
  if (secondaryTargets.length > 0) {
    return secondaryTargets.map((secondaryTarget) => ({ ...baseAction, secondaryTarget }));
  }

  const handChoices = getMagicHandChoices(state, baseAction.handInstanceId);
  if (handChoices.length > 0) {
    if (card && getMagicAiTrait(card.cardId)?.valueModel === "refresh_delta") {
      return buildRefreshActions(state, baseAction, handChoices);
    }
    return handChoices.map((handCard) => ({ ...baseAction, secondaryHandInstanceId: handCard.instanceId }));
  }

  const searchCategories = getMagicSearchCategories(state, baseAction.handInstanceId);
  if (searchCategories.length > 0) {
    return searchCategories.map((searchCategory) => ({ ...baseAction, searchCategory }));
  }

  return [baseAction];
}

function buildSortDeckActions(state: GameState, baseAction: MagicAction): MagicAction[] {
  const topCards = state.players[state.currentPlayer].deck.slice(0, 5);
  if (topCards.length <= 1) {
    return [baseAction];
  }
  const sortedTopCards = [...topCards].sort((a, b) => handCardKeepValue(state, b) - handCardKeepValue(state, a));
  return [{ ...baseAction, deckTopOrderInstanceIds: sortedTopCards.map((card) => card.instanceId) }];
}

function buildRefreshActions(state: GameState, baseAction: MagicAction, handChoices: ReturnType<typeof getMagicHandChoices>): MagicAction[] {
  const player = state.players[state.currentPlayer];
  const discardCount = Math.max(1, Math.min(player.deck.length, Math.max(1, 5 - player.hand.length + 1)));
  const leastUsefulCards = [...handChoices]
    .sort((a, b) => handCardKeepValue(state, a) - handCardKeepValue(state, b))
    .slice(0, discardCount)
    .map((card) => card.instanceId);

  return [
    { ...baseAction, selectedHandInstanceIds: leastUsefulCards },
    { ...baseAction, selectedHandInstanceIds: handChoices.map((card) => card.instanceId) },
  ];
}

function listSummonDecisions(state: GameState): CpuDecision[] {
  const decisions: CpuDecision[] = [];
  const playerId = state.currentPlayer;
  for (const card of state.players[playerId].hand) {
    const def = getCardDef(card.cardId);
    if (def.type !== "monster") {
      continue;
    }

    for (const slotKey of SUMMON_SLOT_ORDER_BY_PLAYER[playerId]) {
      if (!canSummonTo(state, card.instanceId, slotKey)) {
        continue;
      }
      const score = scoreSummon(state, card.cardId, slotKey);
      if (shouldPruneCloseoutNonProgressActions(state, playerId) && score <= 20) {
        continue;
      }
      decisions.push({
        type: "summon",
        handInstanceId: card.instanceId,
        slotKey,
        reason: summonReason(state.currentPlayer, card.cardId, slotKey),
        score,
      });
    }
  }
  return decisions;
}

function scoreSummon(state: GameState, cardId: string, slotKey: SlotKey): number {
  const def = getMonsterDef(cardId);
  const trait = inferMonsterAiTrait(def);
  const slot = state.slots[slotKey];
  const frontFilled = slot.row === "back" && !!state.slots[frontSlotFor(slot)].monster;
  const boardEmpty = SUMMON_SLOT_ORDER_BY_PLAYER[slot.owner].every((key) => !state.slots[key].monster);

  let score = 0;
  if (trait.role === "front") {
    score += slot.row === "front" ? 45 : 15;
    if (boardEmpty && slot.row === "front") {
      score += 15;
    }
  } else if (slot.row === "back") {
    score += 40;
    score += frontFilled ? 20 : -20;
  } else {
    score += trait.frontViable ? 5 : -10;
  }

  if (shouldPruneCloseoutNonProgressActions(state, state.currentPlayer) && !boardEmpty) {
    score -= 60;
  }

  return score + memberRatingValueBonus(cardId, state.players[state.currentPlayer].masterId);
}

function summonReason(playerId: PlayerId, cardId: string, slotKey: SlotKey): string {
  const trait = getMonsterAiTrait(cardId);
  const slotLabel = stateSlotLabel(slotKey);
  if (trait.role === "front" && slotKey.includes("_front_")) {
    return `前衛カードを${slotLabel}へ召喚`;
  }
  if (trait.role === "back" && slotKey.includes("_back_")) {
    return `後衛カードを${slotLabel}へ召喚`;
  }
  if (playerId === "cpu") {
    return `カードを${slotLabel}へ召喚`;
  }
  return `${getCardName(cardId)}を空き枠へ召喚`;
}

function listMoveDecisions(state: GameState): CpuDecision[] {
  const decisions: CpuDecision[] = [];
  const playerId = state.currentPlayer;
  for (const fromSlotKey of FIELD_ORDER_BY_PLAYER[playerId]) {
    const monster = state.slots[fromSlotKey].monster;
    if (!monster?.status || monster.status !== "active" || monster.actionCount >= monster.actionLimit) {
      continue;
    }
    for (const toSlotKey of getMovableTargets(state, fromSlotKey)) {
      const decision = createMoveDecision(state, fromSlotKey, toSlotKey);
      if (decision) {
        decisions.push(decision);
      }
    }
  }
  return decisions;
}

function createMoveDecision(state: GameState, fromSlotKey: SlotKey, toSlotKey: SlotKey): CpuDecision | undefined {
  const after = moveMonster(state, fromSlotKey, toSlotKey);
  const score = scoreMoveDecision(state, after, fromSlotKey, toSlotKey);
  if (score <= 14) {
    return undefined;
  }
  return {
    type: "move",
    fromSlotKey,
    toSlotKey,
    reason: moveReason(state, after, fromSlotKey, toSlotKey),
    score,
  };
}

function scoreMoveDecision(state: GameState, after: GameState, fromSlotKey: SlotKey, toSlotKey: SlotKey): number {
  const beforeMover = state.slots[fromSlotKey].monster;
  if (!beforeMover) {
    return 0;
  }
  const moverAfterSlot = findMonsterSlot(after, beforeMover.instanceId);
  if (!moverAfterSlot) {
    return 0;
  }
  const beforePlacement = placementValue(state, state.slots[fromSlotKey], beforeMover);
  const afterMover = after.slots[moverAfterSlot].monster;
  const afterPlacement = afterMover ? placementValue(after, after.slots[moverAfterSlot], afterMover) : beforePlacement;
  let score =
    10 +
    (afterPlacement - beforePlacement) * 2 -
    repeatedMovePenalty(state, fromSlotKey, toSlotKey, beforeMover.instanceId) -
    turnMoveCountPenalty(state);

  const swappedMonster = state.slots[toSlotKey].monster;
  if (swappedMonster) {
    const swappedAfterSlot = findMonsterSlot(after, swappedMonster.instanceId);
    if (swappedAfterSlot) {
      const beforeSwappedPlacement = placementValue(state, state.slots[toSlotKey], swappedMonster);
      const afterSwapped = after.slots[swappedAfterSlot].monster;
      const afterSwappedPlacement = afterSwapped
        ? placementValue(after, after.slots[swappedAfterSlot], afterSwapped)
        : beforeSwappedPlacement;
      score += afterSwappedPlacement - beforeSwappedPlacement;
    }
  }

  const beforeBestAttack = bestAttackOpportunityScore(state);
  const afterBestAttack = bestAttackOpportunityScore(after);
  const afterMoverAttack = bestAttackOpportunityScore(after, moverAfterSlot);
  if (shouldPruneCloseoutMove(state, after, beforeBestAttack, afterBestAttack, afterMoverAttack)) {
    return -100;
  }
  if (afterMoverAttack > 0) {
    score += 12 + Math.min(34, afterMoverAttack * 0.1);
  }
  if (afterBestAttack > beforeBestAttack) {
    score += (afterBestAttack - beforeBestAttack) * 0.45;
  } else if (currentTurnMoveCount(state) > 0) {
    score -= 28;
  }
  return score;
}

function repeatedMovePenalty(state: GameState, fromSlotKey: SlotKey, toSlotKey: SlotKey, moverInstanceId: string): number {
  const history = (state.turnMoveHistory ?? []).filter((entry) => entry.playerId === state.currentPlayer);
  let penalty = 0;

  if (
    history.some(
      (entry) =>
        (entry.fromSlotKey === fromSlotKey && entry.toSlotKey === toSlotKey) ||
        (entry.fromSlotKey === toSlotKey && entry.toSlotKey === fromSlotKey),
    )
  ) {
    penalty += 140;
  }

  if (history.some((entry) => entry.moverInstanceId === moverInstanceId || entry.swappedInstanceId === moverInstanceId)) {
    penalty += 40;
  }

  return penalty;
}

function turnMoveCountPenalty(state: GameState): number {
  const moveCount = currentTurnMoveCount(state);
  if (moveCount >= 2) {
    return 260 + (moveCount - 2) * 80;
  }
  if (moveCount === 1) {
    return 35;
  }
  return 0;
}

function currentTurnMoveCount(state: GameState): number {
  return (state.turnMoveHistory ?? []).filter((entry) => entry.playerId === state.currentPlayer).length;
}

function shouldPruneCloseoutMove(
  state: GameState,
  after: GameState,
  beforeBestAttack: number,
  afterBestAttack: number,
  afterMoverAttack: number,
): boolean {
  if (!isDeckOutRace(state) && !shouldPruneCloseoutNonProgressActions(state, state.currentPlayer)) {
    return false;
  }
  const directBefore = bestDirectMasterDamageForPlayer(state, state.currentPlayer);
  const directAfter = bestDirectMasterDamageForPlayer(after, state.currentPlayer);
  return afterBestAttack < beforeBestAttack + 45 && afterMoverAttack < 260 && directAfter <= directBefore;
}

function moveReason(state: GameState, after: GameState, fromSlotKey: SlotKey, toSlotKey: SlotKey): string {
  if (bestAttackOpportunityScore(after) > bestAttackOpportunityScore(state) + 40) {
    return "移動後に強い攻撃筋を作れるため移動";
  }
  const mover = state.slots[fromSlotKey].monster;
  const role = mover ? getMonsterAiTrait(mover.cardId).role : undefined;
  if (role === "front" && toSlotKey.includes("_front_")) {
    return "前衛カードを前列へ出して攻撃しやすくするため移動";
  }
  if (role === "back" && toSlotKey.includes("_back_")) {
    return "後衛カードを後列へ戻して射程を活かすため移動";
  }
  return "配置評価を改善できるため移動";
}

function listFocusDecisions(state: GameState): CpuDecision[] {
  if (shouldPruneCloseoutNonProgressActions(state, state.currentPlayer)) {
    return [];
  }
  return FIELD_ORDER_BY_PLAYER[state.currentPlayer]
    .filter((slotKey) => canFocusMonster(state, slotKey))
    .flatMap((slotKey) => {
      const score = scoreFocus(state, slotKey);
      const monster = state.slots[slotKey].monster;
      const reason =
        monster && bestDirectMasterDamageForPlayer(state, monster.owner) > 0
          ? "上の技の打点を伸ばしてマスター攻撃につなげるためためる"
          : "有効攻撃がないためためる";
      return [{
        type: "focus",
        slotKey,
        reason,
        score,
      }];
    });
}

function scoreFocus(state: GameState, slotKey: SlotKey): number {
  const monster = state.slots[slotKey].monster;
  if (!monster) {
    return 0;
  }

  let score = 18;
  const upperCommand = getMonsterCommands(monster)[0];
  const canBoostUpperCommandToThreePower = Boolean(upperCommand && upperCommand.power + 1 >= 3);
  if (canBoostUpperCommandToThreePower) {
    score += 20;
  }
  if (monster.hp <= 2 && state.slots[slotKey].row === "front") {
    score -= 10;
  }
  const feedValue = opponentLevelFeedValue(state, slotKey);
  if (feedValue > 0) {
    score -= 45 + Math.min(90, feedValue * 0.35);
  }
  if (getMonsterAiTrait(monster.cardId).role === "back") {
    score += 8;
  }
  const directMasterDamage = bestDirectMasterDamageForPlayer(state, monster.owner);
  if (directMasterDamage > 0) {
    score -= 42 + directMasterDamage * 30;
    const opponent = opponentOf(monster.owner);
    if (state.players[monster.owner].masterHp <= state.players[opponent].masterHp) {
      score -= 18;
    }
  } else if (shouldPruneCloseoutNonProgressActions(state, monster.owner)) {
    const opponent = opponentOf(monster.owner);
    score -= 28;
    if (state.players[monster.owner].masterHp <= 2 || state.players[opponent].masterHp <= 2) {
      score -= 16;
    }
  }
  return score;
}

function createEndTurnDecision(): CpuDecision {
  return {
    type: "end_turn",
    reason: "有効な行動がないためターン終了",
    score: 0,
  };
}

function attachDecisionTrace(
  selected: { decision: CpuDecision; totalScore: number; index: number },
  evaluated: Array<{ decision: CpuDecision; totalScore: number; index: number }>,
): CpuDecision {
  const rejected = evaluated
    .filter((candidate) => candidate.index !== selected.index && candidate.decision.type !== "end_turn")
    .sort((a, b) => b.totalScore - a.totalScore || a.index - b.index)
    .slice(0, 2);
  if (rejected.length === 0) {
    return selected.decision;
  }

  const rejectedText = rejected
    .map((candidate) => `${decisionShortLabel(candidate.decision)}は${Math.max(1, Math.round(selected.totalScore - candidate.totalScore))}点差で見送り`)
    .join("、");
  return {
    ...selected.decision,
    reason: `${selected.decision.reason} / 見送り: ${rejectedText}`,
  } as CpuDecision;
}

function decisionShortLabel(decision: CpuDecision): string {
  if (decision.type === "attack") {
    return "攻撃";
  }
  if (decision.type === "master_action") {
    return "マスター特技";
  }
  if (decision.type === "summon") {
    return "召喚";
  }
  if (decision.type === "magic") {
    return "マジック";
  }
  if (decision.type === "move") {
    return "移動";
  }
  if (decision.type === "focus") {
    return "ためる";
  }
  return "ターン終了";
}

function compareTieBreak(a: CpuDecision, b: CpuDecision, aIndex: number, bIndex: number): number {
  const priorityDiff = decisionPriority(b) - decisionPriority(a);
  if (priorityDiff !== 0) {
    return priorityDiff;
  }
  return aIndex - bIndex;
}

function decisionPriority(decision: CpuDecision): number {
  if (decision.reason.includes("相手マスターを倒せる")) {
    return 80;
  }
  if (decision.reason.includes("撃破")) {
    return 70;
  }
  if (decision.type === "master_action") {
    return 60;
  }
  if (decision.type === "summon") {
    return 50;
  }
  if (decision.type === "magic") {
    return 45;
  }
  if (decision.type === "attack") {
    return 40;
  }
  if (decision.type === "focus") {
    return 30;
  }
  if (decision.type === "move") {
    return 25;
  }
  if (decision.type === "end_turn") {
    return 10;
  }
  return 20;
}

function frontSlotFor(slot: SlotState): SlotKey {
  return `${slot.owner}_front_${slot.lane}`;
}

function isOwnedMonsterTarget(state: GameState, target: Target, playerId: PlayerId): boolean {
  return target.kind === "monster" && state.slots[target.slotKey].monster?.owner === playerId;
}

function attackerWasDefeated(state: GameState, after: GameState, attackerSlotKey: SlotKey): boolean {
  const before = state.slots[attackerSlotKey].monster;
  const current = after.slots[attackerSlotKey].monster;
  return !!before && (!current || current.instanceId !== before.instanceId);
}

function attackerLevelGain(state: GameState, after: GameState, attackerSlotKey: SlotKey): number {
  const before = state.slots[attackerSlotKey].monster;
  const current = after.slots[attackerSlotKey].monster;
  if (!before || !current || current.instanceId !== before.instanceId) {
    return 0;
  }
  return Math.max(0, current.level - before.level);
}

function scoreMagicDecision(
  state: GameState,
  after: GameState,
  action: MagicAction,
  beforeScore: number,
  weights: AiEvaluationWeights,
): number {
  const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === action.handInstanceId);
  if (!card) {
    return -100;
  }
  const def = getCardDef(card.cardId);
  if (def.type !== "magic") {
    return -100;
  }

  if (after.winner === state.currentPlayer) {
    return 1_000_000;
  }

  const trait = getMagicAiTrait(def.id);
  if (trait?.valueModel === "target_damage") {
    return scoreDamageMagicDecision(state, after, action, def.cost, weights);
  }
  if (trait?.valueModel === "heal_delta") {
    return scoreHealingMagicDecision(state, after, action, def.cost, weights);
  }
  if (trait?.valueModel === "attack_buff_delta") {
    return scorePowerMagicDecision(state, after, action, def.cost);
  }
  if (trait?.effectKind === "transform" && action.secondaryHandInstanceId) {
    return scoreShiftChangeMagicDecision(state, after, action, beforeScore, def.cost, weights);
  }
  if (trait?.valueModel === "shield_delta") {
    return scoreShieldMagicDecision(state, after, action, def.cost);
  }
  if (trait?.valueModel === "search_choice") {
    return scoreSearchMagicDecision(state, action, def.cost);
  }
  if (trait?.valueModel === "refresh_delta") {
    return scoreRefreshMagicDecision(state, after, action, beforeScore, def.cost, weights);
  }

  return evaluateState(after, state.currentPlayer, weights) - beforeScore - def.cost * weights.genericMagicCost;
}

function scoreShiftChangeMagicDecision(
  state: GameState,
  after: GameState,
  action: MagicAction,
  beforeScore: number,
  cost: number,
  weights: AiEvaluationWeights,
): number {
  if (action.target.kind !== "monster" || !action.secondaryHandInstanceId) {
    return evaluateState(after, state.currentPlayer, weights) - beforeScore - cost * weights.genericMagicCost;
  }
  const selectedCard = state.players[state.currentPlayer].hand.find((card) => card.instanceId === action.secondaryHandInstanceId);
  if (!selectedCard) {
    return -100;
  }
  const stateDelta = evaluateState(after, state.currentPlayer, weights) - beforeScore;
  return 18 + stateDelta + handMonsterPlacementValue(state, selectedCard.cardId, action.target.slotKey) * 0.35 - cost * 4;
}

function scoreSearchMagicDecision(state: GameState, action: MagicAction, cost: number): number {
  const category = action.searchCategory ?? "front";
  const searchedCards = state.players[state.currentPlayer].deck.filter((card) => isSearchCategoryMatch(card, category));
  if (searchedCards.length === 0) {
    return -100;
  }
  const averageValue = searchedCards.reduce((total, card) => total + handCardKeepValue(state, card), 0) / searchedCards.length;
  return 18 + averageValue * 0.35 - cost * 4;
}

function isSearchCategoryMatch(card: { cardId: string }, category: NonNullable<MagicAction["searchCategory"]>): boolean {
  const def = getCardDef(card.cardId);
  if (category === "special") {
    return getCardPool(def) === "special";
  }
  if (category === "magic") {
    return def.type === "magic";
  }
  return def.type === "monster" && getCardPool(def) === "normal" && def.role === category;
}

function scoreRefreshMagicDecision(
  state: GameState,
  after: GameState,
  action: MagicAction,
  beforeScore: number,
  cost: number,
  weights: AiEvaluationWeights,
): number {
  const selected = new Set(action.selectedHandInstanceIds ?? []);
  const discardedPenalty = state.players[state.currentPlayer].hand
    .filter((card) => selected.has(card.instanceId))
    .reduce((total, card) => total + handCardKeepValue(state, card), 0);
  const drawnCards = after.players[state.currentPlayer].hand
    .filter((card) => !state.players[state.currentPlayer].hand.some((beforeCard) => beforeCard.instanceId === card.instanceId));
  const drawnValue = drawnCards.reduce((total, card) => total + handCardKeepValue(after, card), 0);
  return evaluateState(after, state.currentPlayer, weights) - beforeScore + drawnValue * 0.55 - discardedPenalty * 0.3 - cost * 2;
}

function scoreDamageMagicDecision(
  state: GameState,
  after: GameState,
  action: MagicAction,
  cost: number,
  weights: AiEvaluationWeights,
): number {
  if (action.target.kind === "master") {
    const beforeHp = state.players[action.target.playerId].masterHp;
    const afterHp = after.players[action.target.playerId].masterHp;
    const damage = beforeHp - afterHp;
    if (damage <= 0) {
      return -100;
    }
    return after.winner === state.currentPlayer
      ? 1_000_000
      : masterDamageScore(state, state.currentPlayer, damage, weights) - cost * weights.masterDamageMagicCost;
  }

  const before = state.slots[action.target.slotKey].monster;
  const current = after.slots[action.target.slotKey].monster;
  if (!before) {
    return -100;
  }
  if (before.owner === state.currentPlayer) {
    return -100;
  }
  if (!current || current.instanceId !== before.instanceId) {
    return weights.monsterKillBase - 40 + monsterValue(state, action.target.slotKey) - cost * weights.monsterKillMagicCost;
  }
  const damage = before.hp - current.hp;
  if (damage <= 0) {
    return -100;
  }
  return (weights.monsterDamagePerPoint + 5) * damage - cost * weights.monsterDamageMagicCost;
}

function scoreHealingMagicDecision(
  state: GameState,
  after: GameState,
  action: MagicAction,
  cost: number,
  weights: AiEvaluationWeights,
): number {
  if (action.target.kind !== "monster") {
    return -100;
  }
  const before = state.slots[action.target.slotKey].monster;
  const current = after.slots[action.target.slotKey].monster;
  if (!before || !current || current.owner !== state.currentPlayer) {
    return -100;
  }
  const healed = current.hp - before.hp;
  if (healed < 2) {
    return -100;
  }
  const threat = incomingThreat(state, action.target.slotKey);
  const important = before.level >= 2 || getMonsterAiTrait(before.cardId).role === "back";
  if (!threat.threatened && !important) {
    return 12;
  }
  return (
    weights.healPerPoint * healed +
    monsterValue(state, action.target.slotKey) * 0.22 +
    nextTurnLevelUpPotential(state, action.target.slotKey) * 0.16 +
    (threat.lethal ? 95 : threat.threatened ? 36 : 0) -
    cost * 6
  );
}

function scorePowerMagicDecision(state: GameState, after: GameState, action: MagicAction, cost: number): number {
  if (action.target.kind !== "monster") {
    return -100;
  }
  const before = state.slots[action.target.slotKey].monster;
  const current = after.slots[action.target.slotKey].monster;
  if (!before || !current || current.owner !== state.currentPlayer) {
    return -100;
  }
  const beforeBest = bestAttackOpportunityScore(state, action.target.slotKey);
  const afterBest = bestAttackOpportunityScore(after, action.target.slotKey);
  const improvement = afterBest - beforeBest;
  if (afterBest < 40 || improvement <= 20) {
    return -100;
  }
  return 22 + afterBest * 0.35 + improvement * 0.8 - cost * 6;
}

function scoreShieldMagicDecision(state: GameState, after: GameState, action: MagicAction, cost: number): number {
  let protectedTargets = [action.target, action.secondaryTarget]
    .filter((target): target is Extract<Target, { kind: "monster" }> => target?.kind === "monster")
    .filter((target) => {
      const before = state.slots[target.slotKey].monster;
      const current = after.slots[target.slotKey].monster;
      return !!before && !!current && before.owner === state.currentPlayer && before.shielded !== current.shielded;
    });

  if (isDeckOutRace(state)) {
    protectedTargets = protectedTargets.filter((target) => {
      const threat = incomingThreat(state, target.slotKey);
      const threatAfterShield = incomingThreat(after, target.slotKey);
      const preventsLethal = threat.lethal && !threatAfterShield.lethal;
      return shouldProtectInDeckOutRace(state, target.slotKey, threat, preventsLethal, nextTurnLevelUpPotential(state, target.slotKey));
    });
  }
  if (isWhiteMirrorCloseout(state)) {
    protectedTargets = protectedTargets.filter((target) => {
      const threat = incomingThreat(state, target.slotKey);
      const threatAfterShield = incomingThreat(after, target.slotKey);
      const preventsLethal = threat.lethal && !threatAfterShield.lethal;
      return preventsLethal || threat.lethal || nextTurnLevelUpPotential(state, target.slotKey) > 0;
    });
  }

  if (protectedTargets.length === 0) {
    return -100;
  }

  const protectionValue = protectedTargets.reduce((total, target) => {
    const threat = incomingThreat(state, target.slotKey);
    return total + monsterValue(state, target.slotKey) * 0.18 + (threat.lethal ? 80 : threat.threatened ? 32 : 10);
  }, 0);

  return 16 + protectionValue - cost * 5;
}

function magicReason(state: GameState, after: GameState, action: MagicAction): string {
  const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === action.handInstanceId);
  const name = card ? getCardName(card.cardId) : "マジック";
  if (after.winner === state.currentPlayer) {
    return `${name}で相手マスターを倒せるため使用`;
  }
  if (action.searchCategory) {
    return `${name}で${searchCategoryReasonLabel(action.searchCategory)}を探せるため使用`;
  }
  if (action.deckTopOrderInstanceIds) {
    return `${name}で次のドロー順を整えられるため使用`;
  }
  if (action.secondaryHandInstanceId) {
    return `${name}で手札の高価値カードを使えるため使用`;
  }
  if (action.secondaryTarget) {
    return `${name}で追加対象も有効にできるため使用`;
  }
  if (action.target.kind === "monster") {
    const before = state.slots[action.target.slotKey].monster;
    const current = after.slots[action.target.slotKey].monster;
    if (before && !current) {
      return `${name}で敵モンスターを撃破できるため使用`;
    }
    if (before && current && current.hp > before.hp) {
      return `${name}で高価値の味方を回復できるため使用`;
    }
    if (before && current && current.powerUp && !before.powerUp) {
      return `${name}から攻撃につなげられるため使用`;
    }
  }
  return `${name}で局面を改善できるため使用`;
}

function searchCategoryReasonLabel(category: NonNullable<MagicAction["searchCategory"]>): string {
  if (category === "front") {
    return "前衛カード";
  }
  if (category === "back") {
    return "後衛カード";
  }
  if (category === "special") {
    return "スーパーカード";
  }
  return "マジックカード";
}

function bestAttackOpportunityScore(
  state: GameState,
  onlyAttackerSlotKey?: SlotKey,
  onlyTargetSlotKey?: SlotKey,
): number {
  let best = 0;
  const playerId = state.currentPlayer;
  const attackerSlots = onlyAttackerSlotKey ? [onlyAttackerSlotKey] : FIELD_ORDER_BY_PLAYER[playerId];

  for (const slotKey of attackerSlots) {
    const monster = state.slots[slotKey].monster;
    if (!monster?.status || monster.status !== "active" || monster.actionCount >= monster.actionLimit) {
      continue;
    }
    for (const command of getMonsterCommands(monster)) {
      for (const target of getCommandTargets(state, slotKey, command.id)) {
        if (isOwnedMonsterTarget(state, target, playerId)) {
          continue;
        }
        if (onlyTargetSlotKey && (target.kind !== "monster" || target.slotKey !== onlyTargetSlotKey)) {
          continue;
        }
        best = Math.max(best, estimateAttackScore(state, slotKey, command, target));
      }
    }
  }

  return best;
}

function bestAttackOpportunityScoreForPlayer(state: GameState, playerId: PlayerId, readyForNextTurn = false): number {
  const next = readyForNextTurn ? readyPlayerForTacticalEvaluation(state, playerId) : ({ ...state, currentPlayer: playerId } as GameState);
  return bestAttackOpportunityScore(next);
}

function bestDirectMasterDamageForPlayer(state: GameState, playerId: PlayerId): number {
  const scopedState = playerId === state.currentPlayer ? state : ({ ...state, currentPlayer: playerId } as GameState);
  const opponent = opponentOf(playerId);
  let bestDamage = 0;

  for (const slotKey of FIELD_ORDER_BY_PLAYER[playerId]) {
    const monster = scopedState.slots[slotKey].monster;
    if (!monster?.status || monster.status !== "active" || monster.actionCount >= monster.actionLimit) {
      continue;
    }
    for (const command of getMonsterCommands(monster)) {
      for (const target of getCommandTargets(scopedState, slotKey, command.id)) {
        if (target.kind === "master" && target.playerId === opponent) {
          bestDamage = Math.max(bestDamage, Math.max(0, estimateCommandPower(monster, command) - 2));
        }
      }
    }
  }

  return bestDamage;
}

function directMasterDamageFromSlot(state: GameState, slotKey: SlotKey, attackerId: PlayerId): number {
  const readyState = readyPlayerForTacticalEvaluation(state, attackerId);
  const monster = readyState.slots[slotKey].monster;
  if (!monster || monster.owner !== attackerId || monster.actionCount >= monster.actionLimit) {
    return 0;
  }

  const opponent = opponentOf(attackerId);
  let bestDamage = 0;
  for (const command of getMonsterCommands(monster)) {
    for (const target of getCommandTargets(readyState, slotKey, command.id)) {
      if (target.kind === "master" && target.playerId === opponent) {
        bestDamage = Math.max(bestDamage, Math.max(0, estimateCommandPower(monster, command) - 2));
      }
    }
  }
  return bestDamage;
}

function readyPlayerForTacticalEvaluation(state: GameState, playerId: PlayerId): GameState {
  const next = structuredClone(state) as GameState;
  next.currentPlayer = playerId;
  for (const slotKey of FIELD_ORDER_BY_PLAYER[playerId]) {
    const monster = next.slots[slotKey].monster;
    if (!monster) {
      continue;
    }
    if (monster.status === "prepared") {
      monster.status = "active";
      monster.actionCount = 0;
    } else if (monster.status === "active") {
      monster.actionCount = 0;
    }
  }
  return next;
}

function buildThreatModel(state: GameState, attackerId: PlayerId): ThreatModel {
  const readyState = readyPlayerForTacticalEvaluation(state, attackerId);
  const masterDamage: Record<PlayerId, number> = { player: 0, cpu: 0 };
  const monsterThreats: Partial<Record<SlotKey, IncomingThreat>> = {};

  for (const slotKey of FIELD_ORDER_BY_PLAYER[attackerId]) {
    const monster = readyState.slots[slotKey].monster;
    if (!monster?.status || monster.status !== "active" || monster.actionCount >= monster.actionLimit) {
      continue;
    }

    const bestMasterDamage: Record<PlayerId, number> = { player: 0, cpu: 0 };
    for (const command of getMonsterCommands(monster)) {
      for (const target of getCommandTargets(readyState, slotKey, command.id)) {
        if (target.kind === "master" && target.playerId !== attackerId) {
          bestMasterDamage[target.playerId] = Math.max(bestMasterDamage[target.playerId], Math.max(0, estimateCommandPower(monster, command) - 2));
          continue;
        }
        if (target.kind !== "monster" || readyState.slots[target.slotKey].owner === attackerId) {
          continue;
        }
        const targetMonster = readyState.slots[target.slotKey].monster;
        if (!targetMonster) {
          continue;
        }
        updateMonsterThreat(monsterThreats, target.slotKey, estimateMonsterDamage(targetMonster, monster, command), targetMonster.hp);
      }
    }
    const actionCount = Math.max(1, monster.actionLimit - monster.actionCount);
    masterDamage.player += bestMasterDamage.player * actionCount;
    masterDamage.cpu += bestMasterDamage.cpu * actionCount;
  }

  let remainingStones = readyState.players[attackerId].stones;
  const magicMasterDamages = readyState.players[attackerId].hand
    .map((card) => {
      const def = getCardDef(card.cardId);
      if (def.type !== "magic") {
        return undefined;
      }
      const trait = getMagicAiTrait(card.cardId);
      if (trait?.effectKind !== "damage" || remainingStones < def.cost) {
        return undefined;
      }
      const targets = getMagicTargets(readyState, card.instanceId);
      const masterTargets = targets
        .filter((target): target is Extract<Target, { kind: "master" }> => target.kind === "master" && target.playerId !== attackerId)
        .map((target) => ({
          playerId: target.playerId,
          damage: estimateMagicMasterDamageBySimulation(readyState, card.instanceId, target),
          cost: def.cost,
        }));

      for (const target of targets) {
        if (target.kind !== "monster" || readyState.slots[target.slotKey].owner === attackerId) {
          continue;
        }
        const targetMonster = readyState.slots[target.slotKey].monster;
        if (targetMonster) {
          updateMonsterThreat(
            monsterThreats,
            target.slotKey,
            estimateMagicMonsterDamageBySimulation(readyState, card.instanceId, target),
            targetMonster.hp,
          );
        }
      }

      return masterTargets;
    })
    .flat()
    .filter((item): item is { playerId: PlayerId; damage: number; cost: number } => !!item && item.damage > 0)
    .sort((a, b) => b.damage - a.damage || a.cost - b.cost);

  for (const magic of magicMasterDamages) {
    if (remainingStones < magic.cost) {
      continue;
    }
    masterDamage[magic.playerId] += magic.damage;
    remainingStones -= magic.cost;
  }

  return { masterDamage, monsterThreats };
}

function updateMonsterThreat(
  threats: Partial<Record<SlotKey, IncomingThreat>>,
  slotKey: SlotKey,
  damage: number,
  targetHp: number,
): void {
  if (damage <= 0) {
    return;
  }
  const current = threats[slotKey] ?? NO_THREAT;
  threats[slotKey] = {
    threatened: true,
    lethal: current.lethal || damage >= targetHp,
    maxDamage: Math.max(current.maxDamage, damage),
  };
}

function estimateMagicMasterDamageBySimulation(
  state: GameState,
  handInstanceId: string,
  target: Extract<Target, { kind: "master" }>,
): number {
  const beforeHp = state.players[target.playerId].masterHp;
  try {
    const after = playMagic(state, { handInstanceId, target });
    return Math.max(0, beforeHp - after.players[target.playerId].masterHp);
  } catch {
    return 0;
  }
}

function estimateMagicMonsterDamageBySimulation(
  state: GameState,
  handInstanceId: string,
  target: Extract<Target, { kind: "monster" }>,
): number {
  const before = state.slots[target.slotKey].monster;
  if (!before) {
    return 0;
  }
  try {
    const after = playMagic(state, { handInstanceId, target });
    const current = after.slots[target.slotKey].monster;
    return Math.max(0, before.hp - (current?.hp ?? 0));
  } catch {
    return 0;
  }
}

function threatenedMonsterValueForPlayer(state: GameState, playerId: PlayerId, threatModel = buildThreatModel(state, opponentOf(playerId))): number {
  return FIELD_ORDER_BY_PLAYER[playerId].reduce((total, slotKey) => {
    const monster = state.slots[slotKey].monster;
    if (!monster) {
      return total;
    }
    const threat = threatModel.monsterThreats[slotKey] ?? NO_THREAT;
    if (!threat.threatened) {
      return total;
    }
    const value = monsterValue(state, slotKey);
    return total + (threat.lethal ? value * 0.85 + 70 : Math.min(monster.hp, threat.maxDamage) * 18 + value * 0.18);
  }, 0);
}

function nextTurnLevelUpPotentialForPlayer(state: GameState, playerId: PlayerId): number {
  return FIELD_ORDER_BY_PLAYER[playerId].reduce((total, slotKey) => total + nextTurnLevelUpPotential(state, slotKey), 0);
}

function isDeckOutRace(state: GameState): boolean {
  return state.players.player.deck.length === 0 || state.players.cpu.deck.length === 0;
}

function isWhiteMirrorCloseout(state: GameState): boolean {
  return (
    state.players.player.masterId === "white" &&
    state.players.cpu.masterId === "white" &&
    (state.turnNumber >= 20 || isDeckOutRace(state) || shouldPruneCloseoutNonProgressActions(state, state.currentPlayer))
  );
}

function shouldProtectInDeckOutRace(
  state: GameState,
  slotKey: SlotKey,
  threat: IncomingThreat,
  preventsLethal: boolean,
  levelUpPotential: number,
): boolean {
  if (!isDeckOutRace(state)) {
    return true;
  }
  if (!preventsLethal && !threat.lethal) {
    return false;
  }
  if (directMasterDamageFromSlot(state, slotKey, state.currentPlayer) > 0) {
    return true;
  }
  if (levelUpPotential > 0) {
    return true;
  }
  return bestAttackOpportunityScore(state, slotKey) >= 260;
}

function nextTurnLevelUpPotential(state: GameState, slotKey: SlotKey): number {
  const monster = state.slots[slotKey].monster;
  if (!monster || monster.status !== "active" || monster.levelFixed) {
    return 0;
  }
  const levelRoom = getMonsterDef(monster.cardId).maxLevel - monster.level;
  const availableLevels = Math.min(levelRoom, state.players[monster.owner].stones);
  if (availableLevels <= 0) {
    return 0;
  }

  const readyState = {
    ...state,
    currentPlayer: monster.owner,
    slots: {
      ...state.slots,
      [slotKey]: {
        ...state.slots[slotKey],
        monster: {
          ...monster,
          actionCount: 0,
        },
      },
    },
  } as GameState;
  const readyMonster = readyState.slots[slotKey].monster;
  if (!readyMonster) {
    return 0;
  }

  let best = 0;
  for (const command of getMonsterCommands(readyMonster)) {
    for (const target of getCommandTargets(readyState, slotKey, command.id)) {
      if (target.kind !== "monster" || readyState.slots[target.slotKey].owner === monster.owner) {
        continue;
      }
      const targetMonster = readyState.slots[target.slotKey].monster;
      if (!targetMonster) {
        continue;
      }
      const damage = estimateMonsterDamage(targetMonster, readyMonster, command);
      if (damage < targetMonster.hp) {
        continue;
      }
      const levelGain = Math.min(targetMonster.level, availableLevels);
      best = Math.max(best, 70 * levelGain + monsterValue(readyState, target.slotKey) * 0.2);
    }
  }
  return best;
}

function incomingThreat(state: GameState, targetSlotKey: SlotKey): IncomingThreat {
  const target = state.slots[targetSlotKey].monster;
  if (!target) {
    return NO_THREAT;
  }
  const opponent = opponentOf(target.owner);
  return buildThreatModel(state, opponent).monsterThreats[targetSlotKey] ?? NO_THREAT;
}

function estimateAttackScore(state: GameState, attackerSlotKey: SlotKey, command: ReturnType<typeof getMonsterCommands>[number], target: Target): number {
  const attacker = state.slots[attackerSlotKey].monster;
  if (!attacker) {
    return -100;
  }
  if (target.kind === "master") {
    const damage = Math.max(0, estimateCommandPower(attacker, command) - 2);
    return damage > 0 ? masterDamageScore(state, attacker.owner, damage) : -100;
  }

  const targetMonster = state.slots[target.slotKey].monster;
  if (!targetMonster) {
    return -100;
  }
  const damage = estimateMonsterDamage(targetMonster, attacker, command);
  if (damage >= targetMonster.hp) {
    return 300 + monsterValue(state, target.slotKey);
  }
  return damage > 0 ? 25 * damage : -100;
}

function estimateMonsterDamage(target: MonsterState, attacker: MonsterState, command: ReturnType<typeof getMonsterCommands>[number]): number {
  if (target.immune) {
    return 0;
  }
  let damage = estimateCommandPower(attacker, command);
  if (target.shielded) {
    damage = Math.max(0, damage - 1);
  }
  if (target.focused) {
    damage = Math.max(0, damage - 1);
  }
  if (target.halfShielded) {
    damage = Math.max(0, Math.floor(damage / 2));
  }
  return damage;
}

function estimateCommandPower(monster: MonsterState, command: ReturnType<typeof getMonsterCommands>[number]): number {
  let power = command.power;
  const upperCommand = getMonsterCommands(monster)[0];
  if (monster.focused && upperCommand?.id === command.id) {
    power += 1;
  }
  if (monster.powerUp) {
    power += 1;
  }
  if (monster.powerOverride !== undefined) {
    power = monster.powerOverride;
  }
  power += monster.powerModifier ?? 0;
  if (monster.berserkPower) {
    power += 1;
  }
  return Math.max(0, power);
}

function findMonsterSlot(state: GameState, instanceId: string): SlotKey | undefined {
  return ALL_FIELD_ORDER.find((slotKey) => state.slots[slotKey].monster?.instanceId === instanceId);
}

function stateSlotLabel(slotKey: SlotKey): string {
  const [, row, lane] = slotKey.split("_");
  return `${row === "front" ? "前列" : "後列"}${lane === "left" ? "左" : "右"}`;
}
