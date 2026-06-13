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
};

const NO_THREAT: IncomingThreat = { threatened: false, lethal: false, maxDamage: 0 };
const MASTER_DAMAGE_SCORE = 90;

export const CPU_AI_PROFILES = ["stable", "strong"] as const;
export type CpuAiProfile = (typeof CPU_AI_PROFILES)[number];
export type CpuAiProfiles = Record<PlayerId, CpuAiProfile>;

export interface CpuAiOptions {
  profile?: CpuAiProfile;
  profiles?: Partial<CpuAiProfiles>;
}

const CPU_AI_PROFILE_CONFIG: Record<CpuAiProfile, CpuAiProfileConfig> = {
  stable: {
    detailedWidth: 2,
    sameTurnSearchDepth: 1,
    sameTurnSearchWidth: 2,
    sameTurnSearchDiscount: 0.55,
    beamScoreThreshold: 0,
  },
  strong: {
    detailedWidth: 4,
    sameTurnSearchDepth: 3,
    sameTurnSearchWidth: 4,
    sameTurnSearchDiscount: 0.5,
    beamScoreThreshold: 8,
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

export function runCpuDecisionStep(state: GameState, options: CpuAiOptions = {}): GameState {
  const decision = chooseCpuDecision(state, options);
  return applyCpuDecision(state, decision);
}

export function chooseCpuDecision(state: GameState, options: CpuAiOptions = {}): CpuDecision {
  const perspective = state.currentPlayer;
  const config = CPU_AI_PROFILE_CONFIG[resolveCpuAiProfile(state, options)];
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

function resolveCpuAiProfile(state: GameState, options: CpuAiOptions): CpuAiProfile {
  return options.profiles?.[state.currentPlayer] ?? options.profile ?? "stable";
}

function evaluateCpuDecisions(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
): EvaluatedDecision[] {
  const beforeScore = evaluateState(state, perspective);
  const beforeFutureScore = evaluateFutureTacticalValue(state, perspective, false);
  const beforeFollowUpScore = bestAttackOpportunityScore(state);
  const decisions = listCpuDecisions(state);

  const evaluated = decisions.flatMap((decision, index) => {
    const transition = evaluateDecisionTransition(state, decision, perspective, beforeScore, beforeFutureScore, false);
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
  const beforeDetailedFutureScore = evaluateFutureTacticalValue(state, perspective, true);

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
      evaluateState(candidate.after, perspective) -
      beforeScore +
      evaluateFutureTacticalValue(candidate.after, perspective, true) -
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
      evaluateState(after, perspective) -
      beforeScore +
      evaluateFutureTacticalValue(after, perspective, detailedFuture) -
      beforeFutureScore,
  };
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

  const candidates = evaluateImmediateCpuDecisions(state, perspective)
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

function evaluateImmediateCpuDecisions(state: GameState, perspective: PlayerId): EvaluatedDecision[] {
  const beforeScore = evaluateState(state, perspective);
  const beforeFutureScore = evaluateFutureTacticalValue(state, perspective, false);
  return listCpuDecisions(state).flatMap((decision, index) => {
    const transition = evaluateDecisionTransition(state, decision, perspective, beforeScore, beforeFutureScore, false);
    return transition ? [{ decision, totalScore: transition.totalScore, index, after: transition.after }] : [];
  });
}

export function listCpuDecisions(state: GameState): CpuDecision[] {
  if (state.winner || state.pendingLevelUp) {
    return [createEndTurnDecision()];
  }

  return [
    ...listAttackDecisions(state),
    ...listMasterActionDecisions(state),
    ...listMagicDecisions(state),
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

export function evaluateState(state: GameState, perspective: PlayerId = "cpu"): number {
  const opponent = opponentOf(perspective);
  if (state.winner === perspective) {
    return 1_000_000;
  }
  if (state.winner === opponent) {
    return -1_000_000;
  }

  let score = 0;
  score += (state.players[perspective].masterHp - state.players[opponent].masterHp) * 80;
  score += (state.players[perspective].stones - state.players[opponent].stones) * 6;
  score += (state.players[perspective].hand.length - state.players[opponent].hand.length) * 3;
  score += (state.players[perspective].deck.length - state.players[opponent].deck.length) * 1;

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

function evaluateFutureTacticalValue(state: GameState, perspective: PlayerId, detailed = true): number {
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
    const ownLethalPressure = ownMasterDamage >= enemy.masterHp ? 900 : ownMasterDamage * 42;
    const opponentLethalThreat =
      opponentMasterDamage >= own.masterHp ? 1_100 : opponentMasterDamage >= 3 ? 190 + opponentMasterDamage * 36 : opponentMasterDamage * 38;
    detailedScore =
      ownLethalPressure -
      opponentLethalThreat +
      opponentThreatenedMonsterValue * 0.16 -
      ownThreatenedMonsterValue * 0.24;
  }

  return (
    ownBestAttack * 0.08 -
    opponentBestAttack * 0.16 +
    ownLevelUpPotential * 0.12 -
    opponentLevelUpPotential * 0.18 +
    detailedScore +
    ownHandPressure +
    enemyHandPressure +
    ownDeckDanger +
    enemyDeckDanger
  );
}

function listAttackDecisions(state: GameState): CpuDecision[] {
  const decisions: CpuDecision[] = [];
  const playerId = state.currentPlayer;

  for (const slotKey of FIELD_ORDER_BY_PLAYER[playerId]) {
    const monster = state.slots[slotKey].monster;
    if (!monster?.status || monster.status !== "active" || monster.actionCount >= monster.actionLimit) {
      continue;
    }

    for (const command of getMonsterCommands(monster)) {
      for (const target of getCommandTargets(state, slotKey, command.id)) {
        if (isOwnedMonsterTarget(state, target, playerId) && !canUseOwnedMonsterTargetForCommand(state, slotKey, command.id)) {
          continue;
        }

        for (const action of expandCommandActions(state, {
          attackerSlotKey: slotKey,
          commandId: command.id,
          target,
        })) {
          const decision = createAttackDecision(state, action);
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

function createAttackDecision(state: GameState, action: CommandAction): CpuDecision | undefined {
  const after = attackWithCommand(state, action);
  const score = scoreAttackDecision(state, after, action);
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

function scoreAttackDecision(state: GameState, after: GameState, action: CommandAction): number {
  const playerId = state.currentPlayer;
  const opponent = opponentOf(playerId);
  if (after.winner === playerId) {
    return 1_000_000;
  }

  const recoilPenalty = attackerWasDefeated(state, after, action.attackerSlotKey) ? -120 : 0;
  const stateDelta = evaluateState(after, playerId) - evaluateState(state, playerId);
  if (action.secondaryHandInstanceId) {
    return scoreCommandHandChoiceDecision(state, action, stateDelta, recoilPenalty);
  }
  if (action.target.kind === "master") {
    const damage = state.players[opponent].masterHp - after.players[opponent].masterHp;
    if (damage <= 0) {
      return stateDelta > 8 ? 30 + stateDelta + recoilPenalty : -100;
    }
    return masterDamageScore(state, playerId, damage) + recoilPenalty;
  }

  const targetBefore = state.slots[action.target.slotKey].monster;
  const targetAfter = after.slots[action.target.slotKey].monster;
  if (!targetBefore) {
    return -100;
  }

  if (!targetAfter) {
    const levelGain = attackerLevelGain(state, after, action.attackerSlotKey);
    return 300 + monsterValue(state, action.target.slotKey) + 80 * levelGain + recoilPenalty;
  }

  const damage = targetBefore.hp - targetAfter.hp;
  if (damage <= 0) {
    return stateDelta > 8 ? 30 + stateDelta + recoilPenalty : -100;
  }
  const directMasterDamage = bestDirectMasterDamageForPlayer(state, playerId);
  if (directMasterDamage > 0) {
    const racePenalty =
      34 +
      directMasterDamage * 22 +
      (state.players[playerId].masterHp <= state.players[opponent].masterHp ? 18 : 0);
    return 25 * damage + recoilPenalty - racePenalty;
  }
  return 25 * damage + recoilPenalty;
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

function masterDamageScore(state: GameState, playerId: PlayerId, damage: number): number {
  const opponent = opponentOf(playerId);
  const ownHp = state.players[playerId].masterHp;
  const opponentHp = state.players[opponent].masterHp;
  const raceGapBonus = Math.min(60, Math.max(0, opponentHp - ownHp) * 16);
  const closeoutBonus = opponentHp <= 4 ? (5 - opponentHp) * 12 : 0;
  return (MASTER_DAMAGE_SCORE + raceGapBonus + closeoutBonus) * damage;
}

function attackReason(state: GameState, after: GameState, action: CommandAction): string {
  if (after.winner === state.currentPlayer) {
    return "相手マスターを倒せるため攻撃";
  }
  if (action.target.kind === "master") {
    return "相手マスターへ実ダメージを与えられるため攻撃";
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

function listMasterActionDecisions(state: GameState): CpuDecision[] {
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
      return listEarthAngerDecisions(state);
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
  if (damage <= 0 || score < 0) {
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
  const important = monster.level >= 2 || getMonsterDef(monster.cardId).role === "back" || monster.hp <= 2;
  const levelUpPotential = nextTurnLevelUpPotential(state, target.slotKey);
  if (!threat.threatened && isDeckOutRace(state)) {
    return undefined;
  }
  if (!threat.threatened && !important) {
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

function listEarthAngerDecisions(state: GameState): CpuDecision[] {
  return getMasterActionTargets(state, "earth_anger")
    .map((target) => createEarthAngerDecision(state, target))
    .filter((decision): decision is CpuDecision => !!decision);
}

function createEarthAngerDecision(state: GameState, target: Target): CpuDecision | undefined {
  if (target.kind !== "master" || target.playerId !== state.currentPlayer) {
    return undefined;
  }
  const beforeScore = evaluateState(state, state.currentPlayer);
  const after = useMasterAction(state, "earth_anger", target);
  const score = evaluateState(after, state.currentPlayer) - beforeScore - 28;
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

function listMagicDecisions(state: GameState): CpuDecision[] {
  const decisions: CpuDecision[] = [];
  const playerId = state.currentPlayer;
  const beforeScore = evaluateState(state, playerId);

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
        const score = scoreMagicDecision(state, after, action, beforeScore);
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
  const secondaryTargets = getMagicSecondaryTargets(state, baseAction);
  if (secondaryTargets.length > 0) {
    return secondaryTargets.map((secondaryTarget) => ({ ...baseAction, secondaryTarget }));
  }

  const handChoices = getMagicHandChoices(state, baseAction.handInstanceId);
  if (handChoices.length > 0) {
    const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === baseAction.handInstanceId);
    if (card?.cardId === "card_116") {
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
  const slot = state.slots[slotKey];
  const frontFilled = slot.row === "back" && !!state.slots[frontSlotFor(slot)].monster;
  const boardEmpty = SUMMON_SLOT_ORDER_BY_PLAYER[slot.owner].every((key) => !state.slots[key].monster);

  let score = 0;
  if (def.role === "front") {
    score += slot.row === "front" ? 45 : 15;
    if (boardEmpty && slot.row === "front") {
      score += 15;
    }
  } else if (slot.row === "back") {
    score += 40;
    score += frontFilled ? 20 : -20;
  } else {
    score += cardId === "morgan" ? 5 : -10;
  }

  return score + memberRatingValueBonus(cardId, state.players[state.currentPlayer].masterId);
}

function summonReason(playerId: PlayerId, cardId: string, slotKey: SlotKey): string {
  const def = getMonsterDef(cardId);
  const slotLabel = stateSlotLabel(slotKey);
  if (def.role === "front" && slotKey.includes("_front_")) {
    return `前衛カードを${slotLabel}へ召喚`;
  }
  if (def.role === "back" && slotKey.includes("_back_")) {
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

function moveReason(state: GameState, after: GameState, fromSlotKey: SlotKey, toSlotKey: SlotKey): string {
  if (bestAttackOpportunityScore(after) > bestAttackOpportunityScore(state) + 40) {
    return "移動後に強い攻撃筋を作れるため移動";
  }
  const mover = state.slots[fromSlotKey].monster;
  const role = mover ? getMonsterDef(mover.cardId).role : undefined;
  if (role === "front" && toSlotKey.includes("_front_")) {
    return "前衛カードを前列へ出して攻撃しやすくするため移動";
  }
  if (role === "back" && toSlotKey.includes("_back_")) {
    return "後衛カードを後列へ戻して射程を活かすため移動";
  }
  return "配置評価を改善できるため移動";
}

function listFocusDecisions(state: GameState): CpuDecision[] {
  return FIELD_ORDER_BY_PLAYER[state.currentPlayer]
    .filter((slotKey) => canFocusMonster(state, slotKey))
    .map((slotKey) => {
      const score = scoreFocus(state, slotKey);
      const monster = state.slots[slotKey].monster;
      const reason =
        monster && bestDirectMasterDamageForPlayer(state, monster.owner) > 0
          ? "上の技の打点を伸ばしてマスター攻撃につなげるためためる"
          : "有効攻撃がないためためる";
      return {
        type: "focus",
        slotKey,
        reason,
        score,
      };
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
  if (getMonsterDef(monster.cardId).role === "back") {
    score += 8;
  }
  const directMasterDamage = bestDirectMasterDamageForPlayer(state, monster.owner);
  if (directMasterDamage > 0) {
    score -= 42 + directMasterDamage * 30;
    const opponent = opponentOf(monster.owner);
    if (state.players[monster.owner].masterHp <= state.players[opponent].masterHp) {
      score -= 18;
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
  if (def.id === "thunder" || def.id === "card_026" || def.id === "card_092" || def.id === "card_118") {
    return scoreDamageMagicDecision(state, after, action, def.cost);
  }
  if (def.id === "healing" || def.id === "card_127") {
    return scoreHealingMagicDecision(state, after, action, def.cost);
  }
  if (def.id === "power_up" || def.id === "card_094" || def.id === "card_150") {
    return scorePowerMagicDecision(state, after, action, def.cost);
  }
  if (def.id === "card_065") {
    return scoreShiftChangeMagicDecision(state, after, action, beforeScore, def.cost);
  }
  if (def.category === "シールド魔法" || def.category === "特殊防御魔法") {
    return scoreShieldMagicDecision(state, after, action, def.cost);
  }
  if (def.id === "card_123") {
    return scoreSearchMagicDecision(state, action, def.cost);
  }
  if (def.id === "card_116") {
    return scoreRefreshMagicDecision(state, after, action, beforeScore, def.cost);
  }

  return evaluateState(after, state.currentPlayer) - beforeScore - def.cost * 8;
}

function scoreShiftChangeMagicDecision(
  state: GameState,
  after: GameState,
  action: MagicAction,
  beforeScore: number,
  cost: number,
): number {
  if (action.target.kind !== "monster" || !action.secondaryHandInstanceId) {
    return evaluateState(after, state.currentPlayer) - beforeScore - cost * 8;
  }
  const selectedCard = state.players[state.currentPlayer].hand.find((card) => card.instanceId === action.secondaryHandInstanceId);
  if (!selectedCard) {
    return -100;
  }
  const stateDelta = evaluateState(after, state.currentPlayer) - beforeScore;
  return 18 + stateDelta + handMonsterPlacementValue(state, selectedCard.cardId, action.target.slotKey) * 0.35 - cost * 4;
}

function scoreSearchMagicDecision(state: GameState, action: MagicAction, cost: number): number {
  const category = action.searchCategory ?? "front";
  const searchedCard = state.players[state.currentPlayer].deck.find((card) => {
    const def = getCardDef(card.cardId);
    if (category === "special") {
      return getCardPool(def) === "special";
    }
    if (category === "magic") {
      return def.type === "magic";
    }
    return def.type === "monster" && getCardPool(def) === "normal" && def.role === category;
  });
  if (!searchedCard) {
    return -100;
  }
  return 18 + handCardKeepValue(state, searchedCard) * 0.35 - cost * 4;
}

function scoreRefreshMagicDecision(
  state: GameState,
  after: GameState,
  action: MagicAction,
  beforeScore: number,
  cost: number,
): number {
  const selected = new Set(action.selectedHandInstanceIds ?? []);
  const discardedPenalty = state.players[state.currentPlayer].hand
    .filter((card) => selected.has(card.instanceId))
    .reduce((total, card) => total + handCardKeepValue(state, card), 0);
  const drawnCards = after.players[state.currentPlayer].hand
    .filter((card) => !state.players[state.currentPlayer].hand.some((beforeCard) => beforeCard.instanceId === card.instanceId));
  const drawnValue = drawnCards.reduce((total, card) => total + handCardKeepValue(after, card), 0);
  return evaluateState(after, state.currentPlayer) - beforeScore + drawnValue * 0.55 - discardedPenalty * 0.3 - cost * 2;
}

function scoreDamageMagicDecision(state: GameState, after: GameState, action: MagicAction, cost: number): number {
  if (action.target.kind === "master") {
    const beforeHp = state.players[action.target.playerId].masterHp;
    const afterHp = after.players[action.target.playerId].masterHp;
    const damage = beforeHp - afterHp;
    if (damage <= 0) {
      return -100;
    }
    return after.winner === state.currentPlayer ? 1_000_000 : 8;
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
    return 260 + monsterValue(state, action.target.slotKey) - cost * 8;
  }
  const damage = before.hp - current.hp;
  if (damage <= 0) {
    return -100;
  }
  return 30 * damage - cost * 8;
}

function scoreHealingMagicDecision(state: GameState, after: GameState, action: MagicAction, cost: number): number {
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
  const important = before.level >= 2 || getMonsterDef(before.cardId).role === "back";
  if (!threat.threatened && !important) {
    return 12;
  }
  return (
    26 * healed +
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
  const protectedTargets = [action.target, action.secondaryTarget]
    .filter((target): target is Extract<Target, { kind: "monster" }> => target?.kind === "monster")
    .filter((target) => {
      const before = state.slots[target.slotKey].monster;
      const current = after.slots[target.slotKey].monster;
      return !!before && !!current && before.owner === state.currentPlayer && before.shielded !== current.shielded;
    });

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
      const power = estimateDamageMagicPower(card.cardId);
      if (power <= 0 || remainingStones < def.cost) {
        return undefined;
      }
      const targets = getMagicTargets(readyState, card.instanceId);
      const masterTargets = targets
        .filter((target): target is Extract<Target, { kind: "master" }> => target.kind === "master" && target.playerId !== attackerId)
        .map((target) => ({ playerId: target.playerId, damage: Math.max(0, power - 2), cost: def.cost }));

      for (const target of targets) {
        if (target.kind !== "monster" || readyState.slots[target.slotKey].owner === attackerId) {
          continue;
        }
        const targetMonster = readyState.slots[target.slotKey].monster;
        if (targetMonster) {
          updateMonsterThreat(monsterThreats, target.slotKey, estimatePowerDamageToMonster(targetMonster, power), targetMonster.hp);
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

function estimateDamageMagicPower(cardId: string): number {
  return cardId === "thunder" ? 3 : cardId === "card_092" ? 2 : cardId === "card_026" || cardId === "card_118" ? 1 : 0;
}

function estimatePowerDamageToMonster(target: MonsterState, power: number): number {
  if (target.immune) {
    return 0;
  }
  let damage = power;
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
