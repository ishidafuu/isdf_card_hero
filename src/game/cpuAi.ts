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
  resolveLevelUp,
  runAutoStep,
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
  CpuAiDecisionBiasId,
  CpuAiOptions,
  CpuAiProfile,
  CpuAiSearchOptions,
  CpuAiTuning,
  CpuDecision,
  CpuDecisionEvaluation,
} from "./cpuAiTypes";
import { appendLog } from "./ruleEngine/log";
import type {
  CommandAction,
  CommandDef,
  CardInstance,
  GameState,
  MagicAction,
  MasterActionId,
  MonsterState,
  PlayerId,
  PlayerState,
  SlotKey,
  SlotState,
  Target,
} from "./types";
import { drillBreakPartnerSlotKey, isPrimaryDrillBreakAttacker } from "./ruleEngine/drillBreak";
import { chooseTurnPlannerV2Decision } from "./cpuAiV2/turnPlanner";
import { determinizeOpponentPrivateZones } from "./cpuAiV2/opponentKnowledge";
import { appendAiDecisionReviewEntry } from "./aiReviewTrace";

export { CPU_AI_PROFILES } from "./cpuAiTypes";
export type {
  CpuAiDecisionBiasId,
  CpuAiOptions,
  CpuAiProfile,
  CpuAiProfiles,
  CpuAiSearchOptions,
  CpuAiTuning,
  CpuDecision,
  CpuDecisionEvaluation,
} from "./cpuAiTypes";

const FIELD_ORDER_BY_PLAYER: Record<PlayerId, SlotKey[]> = {
  cpu: ["cpu_back_left", "cpu_back_right", "cpu_front_left", "cpu_front_right"],
  player: ["player_back_left", "player_back_right", "player_front_left", "player_front_right"],
};

const SUMMON_SLOT_ORDER_BY_PLAYER: Record<PlayerId, SlotKey[]> = {
  cpu: ["cpu_front_left", "cpu_front_right", "cpu_back_left", "cpu_back_right"],
  player: ["player_front_left", "player_front_right", "player_back_left", "player_back_right"],
};

const ALL_FIELD_ORDER: SlotKey[] = [...FIELD_ORDER_BY_PLAYER.cpu, ...FIELD_ORDER_BY_PLAYER.player];
const WHITE_MIRROR_EARLY_HOLD_TURN_TO = 4;
const WHITE_MIRROR_EARLY_HOLD_MIN_END_TURN_SCORE = -360;
const WHITE_MIRROR_EARLY_HOLD_MAX_ROOT_GAP = 520;

type EvaluatedDecision = { decision: CpuDecision; totalScore: number; index: number; after: GameState };
type TerminalPlanOutcome = { delta: number; handoffState: GameState };
type TerminalPlanSelection = {
  candidate: EvaluatedDecision;
  outcome: TerminalPlanOutcome;
  plannerScore: number;
  terminalPlannerScore?: number;
  runnerUpScore?: number;
  rolloutScore?: number;
  rolloutScoreGapToFallback?: number;
  rolloutSteps?: number;
  rolloutWinner?: PlayerId;
  rolloutWinnerProfile?: CpuAiProfile;
};
type TerminalPlanEvaluationContext = {
  baselineScore: number;
  ownOutcomeCache: Map<string, TerminalPlanOutcome>;
  opponentDeltaCache: Map<string, number>;
  handoffOutcomeCache: Map<string, TerminalPlanOutcome>;
  immediateDecisionCache: Map<string, EvaluatedDecision[]>;
};
type TerminalPlanRootOutcome = { candidate: EvaluatedDecision; outcome: TerminalPlanOutcome };
export type CpuTerminalPlanCandidateInspection = {
  decision: CpuDecision;
  index: number;
  rootScore: number;
  ownDelta: number;
  opponentDelta: number;
  responseScore: number;
  plannerScore: number;
  rolloutScore?: number;
  rolloutScoreGapToFallback?: number;
  rolloutSteps?: number;
  rolloutWinner?: PlayerId;
  rolloutWinnerProfile?: CpuAiProfile;
  afterRootState: GameState;
  ownHandoffState: GameState;
  opponentHandoffState: GameState;
};
export type CpuTerminalPlanInspection = {
  enabled: boolean;
  perspective: PlayerId;
  profile: CpuAiProfile;
  fallbackDecision?: CpuDecision;
  fallbackScore?: number;
  selectedDecision?: CpuDecision;
  selectedPlannerScore?: number;
  runnerUpPlannerScore?: number;
  selectedRolloutScore?: number;
  selectedRolloutScoreGapToFallback?: number;
  adopted: boolean;
  rejectedReason?: string;
  candidates: CpuTerminalPlanCandidateInspection[];
};
type TerminalPlanRolloutResult = {
  score: number;
  steps: number;
  winner?: PlayerId;
  winnerProfile?: CpuAiProfile;
};
type MasterDamagePlan = {
  damage: number;
  firstDecision?: CpuDecision;
  lethal: boolean;
  steps: number;
};
type IncomingThreat = {
  threatened: boolean;
  lethal: boolean;
  maxDamage: number;
  masterActionDamage: number;
  maxDamageWithMasterAction: number;
  lethalWithMasterAction: boolean;
};
type ThreatModel = {
  masterDamage: Record<PlayerId, number>;
  monsterThreats: Partial<Record<SlotKey, IncomingThreat>>;
};
type OmniscientAiConfig = {
  hiddenInfoWeight: number;
  opponentResponseDepth: number;
  opponentResponseWidth: number;
  opponentResponseDiscount: number;
};
type CpuAiProfileConfig = {
  detailedWidth: number;
  sameTurnSearchDepth: number;
  sameTurnSearchWidth: number;
  sameTurnSearchDiscount: number;
  sameTurnTerminalPlanDepth: number;
  sameTurnTerminalPlanWidth: number;
  sameTurnTerminalPlanWeight: number;
  sameTurnTerminalPlanComparisonWeight?: number;
  sameTurnOpponentTerminalPlanDepth: number;
  sameTurnOpponentTerminalPlanWidth: number;
  sameTurnOpponentTerminalPlanWeight: number;
  beamScoreThreshold: number;
  weights: AiEvaluationWeights;
  tuning?: CpuAiTuning;
  omniscient?: OmniscientAiConfig;
  selectTerminalPlan?: boolean;
  terminalPlanFocusHandoffValue?: number;
  terminalPlanShieldHandoffValue?: number;
  terminalPlanRootDecisionWeight?: number;
  terminalPlanRootGapFreeMargin?: number;
  terminalPlanRootGapPenaltyWeight?: number;
  terminalPlanSetupOverFocusRootNeutralTurnFrom?: number;
  terminalPlanSetupOverFocusAdoptionMaxRootScoreGap?: number;
  terminalPlanSetupOverFocusAdoptionMinMargin?: number;
  terminalPlanAdoptionMinMargin?: number;
  terminalPlanAdoptionMaxRootScoreGap?: number;
  terminalPlanRejectNonLethalFaceDamage?: number;
  terminalPlanRejectEndTurnOverAction?: number;
  terminalPlanRejectSetupOverTacticalAction?: number;
  terminalPlanRequireCompatibleFallbackAction?: number;
  terminalPlanRolloutSteps?: number;
  terminalPlanRolloutCandidateLimit?: number;
  terminalPlanRolloutWeight?: number;
  terminalPlanRolloutAdoptionMinScoreGap?: number;
  terminalPlanRolloutTriggerMinRootScoreGap?: number;
  terminalPlanRolloutTriggerMaxPlannerMargin?: number;
  terminalPlanRolloutTurnFrom?: number;
  terminalPlanRolloutTurnTo?: number;
  terminalPlanRolloutMaxOpponentStones?: number;
  terminalPlanRolloutRequireFallbackMove?: number;
  terminalPlanRolloutRequirePlannerSummon?: number;
  terminalPlanRolloutRequirePlannerSummonBacklineReach?: number;
  terminalPlanRolloutAllowCloseoutHoldEndTurn?: number;
  terminalPlanRolloutCloseoutHoldEndTurnSteps?: number;
  terminalPlanRolloutAllowLatePressureOverSummon?: number;
  terminalPlanRolloutLatePressureOverSummonSteps?: number;
  terminalPlanRolloutAllowLateDeckHoldEndTurn?: number;
  terminalPlanRolloutLateDeckHoldEndTurnSteps?: number;
  terminalPlanAllowShieldHoldEndTurn?: number;
  terminalPlanRolloutAllowFrontFocusStripAttack?: number;
  terminalPlanRolloutFrontFocusStripAttackMinRootScoreGap?: number;
  terminalPlanRolloutFrontFocusStripAttackMaxRootScoreGap?: number;
  terminalPlanRolloutFrontFocusStripAttackSteps?: number;
  terminalPlanRolloutAllowShieldTargetTie?: number;
  terminalPlanRolloutShieldTargetTieMaxRootScoreGap?: number;
  terminalPlanRolloutShieldTargetTieSteps?: number;
  terminalPlanRolloutUseHandoff?: number;
  terminalPlanRolloutUseLightweightProfile?: number;
  terminalPlanRolloutOncePerTurn?: number;
};

const NO_THREAT: IncomingThreat = {
  threatened: false,
  lethal: false,
  maxDamage: 0,
  masterActionDamage: 0,
  maxDamageWithMasterAction: 0,
  lethalWithMasterAction: false,
};

const OPPONENT_TERMINAL_RESPONSE_ROOT_MARGIN = 80;
const OPPONENT_TERMINAL_RESPONSE_MIN_ROOT_CANDIDATES = 2;
const WHITE_MIRROR_OPPONENT_RESPONSE_ROOT_MARGIN = 160;
const WHITE_MIRROR_OPPONENT_RESPONSE_MIN_ROOT_CANDIDATES = 4;
const WHITE_MIRROR_TERMINAL_RESPONSE_TIE_MARGIN = 16;
const WHITE_MIRROR_NON_CONVERTING_BACKLINE_CHIP_PENALTY = 132;
const WHITE_MIRROR_NON_CONVERTING_FRONT_THREAT_CHIP_MAX_PENALTY = 340;
const WHITE_MIRROR_EXPOSED_POWER_MAGIC_PENALTY = 200;
const WHITE_MIRROR_RESPONSE_COLLAPSE_THRESHOLD = 120;
const WHITE_MIRROR_RESPONSE_COLLAPSE_PENALTY_WEIGHT = 0.25;
const WHITE_MIRROR_LOW_STONE_RESPONSE_COLLAPSE_THRESHOLD = 80;
const WHITE_MIRROR_LOW_STONE_RESPONSE_COLLAPSE_PENALTY_WEIGHT = 0.25;
const WHITE_MIRROR_ZERO_STONE_RESPONSE_COLLAPSE_THRESHOLD = 80;
const WHITE_MIRROR_ZERO_STONE_RESPONSE_COLLAPSE_PENALTY_WEIGHT = 0.2;
const WHITE_MIRROR_EXPOSED_BACK_LEVEL_UP_PENALTY = 150;
const WHITE_MIRROR_EXPOSED_FRONT_LEVEL_UP_PENALTY = 70;
const WHITE_MIRROR_EXPOSED_BACK_LEVEL_HANDOFF_PENALTY = 120;
const WHITE_MIRROR_FRONT_LEVEL_UP_SETUP_ATTACK_BONUS = 80;
const WHITE_MIRROR_BACKLINE_LEVELED_FRONT_CHIP_MAX_BONUS = 320;
const LONE_FRONT_OPENING_SUMMON_EXPOSURE_PENALTY = 55;
const MASTER_DAMAGE_PLAN_MAX_DEPTH = 8;
const OPPONENT_MASTER_DAMAGE_RESPONSE_MAX_DEPTH = 5;
const MASTER_DAMAGE_PLAN_MAX_BRANCHES = 10;
const MASTER_DAMAGE_PLAN_CLOSEOUT_HP = 6;
const MASTER_DAMAGE_PLAN_GLOBAL_CACHE_LIMIT = 5_000;
const masterDamagePlanGlobalCache = new Map<string, MasterDamagePlan>();

const WHITE_AI_BASE_TUNING = {
  situationalBias: {
    whiteSecondShieldLowStonePenalty: 120,
    whiteSecondShieldCommitmentPenalty: 180,
    whiteActiveFrontWorkBonus: 72,
    whiteBlackFrontThreatBonus: 8,
    whiteBoardControlMasterAttackPenalty: 320,
    whiteReadyBacklineRetreatPenalty: 180,
    whiteDisadvantagedSummonOvercommitPenalty: 260,
    whiteFrontChipResponsePenalty: 86,
    whiteFrontThreatFocusCounterBonus: 72,
    whiteShieldFrontAceBonus: 120,
    whiteBacklineMoveBeforeSummonPenalty: 120,
    whiteThreatSourceAttackBonus: 8,
    whiteDeathSheepSpecialLockPenalty: 90,
  },
} satisfies CpuAiTuning;

const CPU_AI_PROFILE_CONFIG: Record<CpuAiProfile, CpuAiProfileConfig> = {
  stable: {
    detailedWidth: 2,
    sameTurnSearchDepth: 1,
    sameTurnSearchWidth: 2,
    sameTurnSearchDiscount: 0.55,
    sameTurnTerminalPlanDepth: 0,
    sameTurnTerminalPlanWidth: 0,
    sameTurnTerminalPlanWeight: 0,
    sameTurnOpponentTerminalPlanDepth: 0,
    sameTurnOpponentTerminalPlanWidth: 0,
    sameTurnOpponentTerminalPlanWeight: 0,
    beamScoreThreshold: 0,
    weights: AI_EVALUATION_WEIGHTS.stable,
  },
  strong: {
    detailedWidth: 4,
    sameTurnSearchDepth: 3,
    sameTurnSearchWidth: 4,
    sameTurnSearchDiscount: 0.5,
    sameTurnTerminalPlanDepth: 0,
    sameTurnTerminalPlanWidth: 0,
    sameTurnTerminalPlanWeight: 0,
    sameTurnOpponentTerminalPlanDepth: 0,
    sameTurnOpponentTerminalPlanWidth: 0,
    sameTurnOpponentTerminalPlanWeight: 0,
    beamScoreThreshold: 8,
    weights: AI_EVALUATION_WEIGHTS.strong,
  },
  pressure: {
    detailedWidth: 4,
    sameTurnSearchDepth: 3,
    sameTurnSearchWidth: 4,
    sameTurnSearchDiscount: 0.48,
    sameTurnTerminalPlanDepth: 0,
    sameTurnTerminalPlanWidth: 0,
    sameTurnTerminalPlanWeight: 0,
    sameTurnOpponentTerminalPlanDepth: 0,
    sameTurnOpponentTerminalPlanWidth: 0,
    sameTurnOpponentTerminalPlanWeight: 0,
    beamScoreThreshold: 6,
    weights: AI_EVALUATION_WEIGHTS.pressure,
  },
  defensive: {
    detailedWidth: 3,
    sameTurnSearchDepth: 2,
    sameTurnSearchWidth: 3,
    sameTurnSearchDiscount: 0.52,
    sameTurnTerminalPlanDepth: 0,
    sameTurnTerminalPlanWidth: 0,
    sameTurnTerminalPlanWeight: 0,
    sameTurnOpponentTerminalPlanDepth: 0,
    sameTurnOpponentTerminalPlanWidth: 0,
    sameTurnOpponentTerminalPlanWeight: 0,
    beamScoreThreshold: 10,
    weights: AI_EVALUATION_WEIGHTS.defensive,
  },
  white: {
    detailedWidth: 4,
    sameTurnSearchDepth: 3,
    sameTurnSearchWidth: 4,
    sameTurnSearchDiscount: 0.54,
    sameTurnTerminalPlanDepth: 6,
    sameTurnTerminalPlanWidth: 2,
    sameTurnTerminalPlanWeight: 2,
    sameTurnOpponentTerminalPlanDepth: 2,
    sameTurnOpponentTerminalPlanWidth: 2,
    sameTurnOpponentTerminalPlanWeight: 0.5,
    beamScoreThreshold: 8,
    weights: AI_EVALUATION_WEIGHTS.white,
    tuning: WHITE_AI_BASE_TUNING,
  },
  white_planner: {
    detailedWidth: 4,
    sameTurnSearchDepth: 3,
    sameTurnSearchWidth: 4,
    sameTurnSearchDiscount: 0.54,
    sameTurnTerminalPlanDepth: 5,
    sameTurnTerminalPlanWidth: 2,
    sameTurnTerminalPlanWeight: 1,
    sameTurnTerminalPlanComparisonWeight: 0,
    sameTurnOpponentTerminalPlanDepth: 1,
    sameTurnOpponentTerminalPlanWidth: 1,
    sameTurnOpponentTerminalPlanWeight: 0.5,
    beamScoreThreshold: 8,
    weights: AI_EVALUATION_WEIGHTS.white,
    tuning: WHITE_AI_BASE_TUNING,
    selectTerminalPlan: true,
    terminalPlanFocusHandoffValue: 42,
    terminalPlanShieldHandoffValue: 14,
    terminalPlanRootDecisionWeight: 0.22,
    terminalPlanRootGapFreeMargin: 80,
    terminalPlanRootGapPenaltyWeight: 0.5,
    terminalPlanSetupOverFocusRootNeutralTurnFrom: 9,
    terminalPlanSetupOverFocusAdoptionMaxRootScoreGap: 260,
    terminalPlanSetupOverFocusAdoptionMinMargin: 0,
    terminalPlanAdoptionMinMargin: 16,
    terminalPlanAdoptionMaxRootScoreGap: 70,
    terminalPlanRejectNonLethalFaceDamage: 1,
    terminalPlanRejectEndTurnOverAction: 1,
    terminalPlanRejectSetupOverTacticalAction: 1,
    terminalPlanRequireCompatibleFallbackAction: 1,
    terminalPlanRolloutSteps: 60,
    terminalPlanRolloutCandidateLimit: 3,
    terminalPlanRolloutWeight: 0.15,
    terminalPlanRolloutAdoptionMinScoreGap: 200,
    terminalPlanRolloutTriggerMinRootScoreGap: 120,
    terminalPlanRolloutTriggerMaxPlannerMargin: 40,
    terminalPlanRolloutTurnFrom: 6,
    terminalPlanRolloutTurnTo: 10,
    terminalPlanRolloutMaxOpponentStones: 1,
    terminalPlanRolloutRequireFallbackMove: 1,
    terminalPlanRolloutRequirePlannerSummon: 1,
    terminalPlanRolloutRequirePlannerSummonBacklineReach: 1,
    terminalPlanRolloutAllowCloseoutHoldEndTurn: 1,
    terminalPlanRolloutCloseoutHoldEndTurnSteps: 12,
    terminalPlanRolloutAllowLatePressureOverSummon: 1,
    terminalPlanRolloutLatePressureOverSummonSteps: 40,
    terminalPlanRolloutAllowLateDeckHoldEndTurn: 1,
    terminalPlanRolloutLateDeckHoldEndTurnSteps: 0,
    terminalPlanAllowShieldHoldEndTurn: 1,
    terminalPlanRolloutAllowFrontFocusStripAttack: 1,
    terminalPlanRolloutFrontFocusStripAttackMinRootScoreGap: 180,
    terminalPlanRolloutFrontFocusStripAttackMaxRootScoreGap: 460,
    terminalPlanRolloutFrontFocusStripAttackSteps: 0,
    terminalPlanRolloutAllowShieldTargetTie: 1,
    terminalPlanRolloutShieldTargetTieMaxRootScoreGap: 12,
    terminalPlanRolloutShieldTargetTieSteps: 16,
    terminalPlanRolloutOncePerTurn: 1,
  },
  white_v2: {
    detailedWidth: 4,
    sameTurnSearchDepth: 0,
    sameTurnSearchWidth: 0,
    sameTurnSearchDiscount: 0,
    sameTurnTerminalPlanDepth: 0,
    sameTurnTerminalPlanWidth: 0,
    sameTurnTerminalPlanWeight: 0,
    sameTurnOpponentTerminalPlanDepth: 0,
    sameTurnOpponentTerminalPlanWidth: 0,
    sameTurnOpponentTerminalPlanWeight: 0,
    beamScoreThreshold: 0,
    weights: AI_EVALUATION_WEIGHTS.white,
    tuning: WHITE_AI_BASE_TUNING,
  },
  white_rollout: {
    detailedWidth: 4,
    sameTurnSearchDepth: 3,
    sameTurnSearchWidth: 4,
    sameTurnSearchDiscount: 0.54,
    sameTurnTerminalPlanDepth: 5,
    sameTurnTerminalPlanWidth: 2,
    sameTurnTerminalPlanWeight: 1,
    sameTurnTerminalPlanComparisonWeight: 0,
    sameTurnOpponentTerminalPlanDepth: 1,
    sameTurnOpponentTerminalPlanWidth: 1,
    sameTurnOpponentTerminalPlanWeight: 0.5,
    beamScoreThreshold: 8,
    weights: AI_EVALUATION_WEIGHTS.white,
    tuning: WHITE_AI_BASE_TUNING,
    selectTerminalPlan: true,
    terminalPlanFocusHandoffValue: 42,
    terminalPlanShieldHandoffValue: 14,
    terminalPlanRootDecisionWeight: 0.22,
    terminalPlanRootGapFreeMargin: 80,
    terminalPlanRootGapPenaltyWeight: 0.5,
    terminalPlanAdoptionMinMargin: 16,
    terminalPlanAdoptionMaxRootScoreGap: 70,
    terminalPlanRejectNonLethalFaceDamage: 1,
    terminalPlanRejectEndTurnOverAction: 1,
    terminalPlanRejectSetupOverTacticalAction: 1,
    terminalPlanRequireCompatibleFallbackAction: 1,
    terminalPlanRolloutSteps: 60,
    terminalPlanRolloutCandidateLimit: 3,
    terminalPlanRolloutWeight: 0.15,
    terminalPlanRolloutAdoptionMinScoreGap: 200,
    terminalPlanRolloutTriggerMinRootScoreGap: 120,
    terminalPlanRolloutTriggerMaxPlannerMargin: 40,
    terminalPlanRolloutTurnFrom: 6,
    terminalPlanRolloutTurnTo: 10,
    terminalPlanRolloutMaxOpponentStones: 1,
    terminalPlanRolloutRequireFallbackMove: 1,
    terminalPlanRolloutRequirePlannerSummon: 1,
    terminalPlanRolloutRequirePlannerSummonBacklineReach: 1,
    terminalPlanRolloutAllowCloseoutHoldEndTurn: 1,
    terminalPlanRolloutCloseoutHoldEndTurnSteps: 12,
    terminalPlanRolloutAllowLatePressureOverSummon: 1,
    terminalPlanRolloutLatePressureOverSummonSteps: 40,
    terminalPlanRolloutAllowLateDeckHoldEndTurn: 1,
    terminalPlanRolloutLateDeckHoldEndTurnSteps: 0,
    terminalPlanAllowShieldHoldEndTurn: 1,
    terminalPlanRolloutAllowFrontFocusStripAttack: 1,
    terminalPlanRolloutFrontFocusStripAttackMinRootScoreGap: 180,
    terminalPlanRolloutFrontFocusStripAttackMaxRootScoreGap: 460,
    terminalPlanRolloutFrontFocusStripAttackSteps: 0,
    terminalPlanRolloutAllowShieldTargetTie: 1,
    terminalPlanRolloutShieldTargetTieMaxRootScoreGap: 12,
    terminalPlanRolloutShieldTargetTieSteps: 16,
    terminalPlanRolloutOncePerTurn: 1,
  },
  omniscient: {
    detailedWidth: 6,
    sameTurnSearchDepth: 3,
    sameTurnSearchWidth: 5,
    sameTurnSearchDiscount: 0.52,
    sameTurnTerminalPlanDepth: 0,
    sameTurnTerminalPlanWidth: 0,
    sameTurnTerminalPlanWeight: 0,
    sameTurnOpponentTerminalPlanDepth: 0,
    sameTurnOpponentTerminalPlanWidth: 0,
    sameTurnOpponentTerminalPlanWeight: 0,
    beamScoreThreshold: 4,
    weights: AI_EVALUATION_WEIGHTS.omniscient,
    omniscient: {
      hiddenInfoWeight: 1,
      opponentResponseDepth: 2,
      opponentResponseWidth: 5,
      opponentResponseDiscount: 0.58,
    },
  },
};

const WHITE_VS_BLACK_MATCHUP_TUNING = {
  situationalBias: {
    whiteMonsterPressureBonus: 4,
    whiteLastBackSlotNoReachSummonGuardPenalty: 55,
  },
} satisfies CpuAiTuning;

const WHITE_VS_WHITE_MATCHUP_TUNING = {
  situationalBias: {
    whiteThreatSourceAttackBonus: 6,
    whiteSetupAfterThreatReductionBonus: 6,
    whiteThreatLeftLowStoneSetupPenalty: 6,
  },
} satisfies CpuAiTuning;

export function runCpuDecisionStep(state: GameState, options: CpuAiOptions = {}): GameState {
  const decision = chooseCpuDecision(state, options);
  return applyCpuDecision(state, decision);
}

export function chooseCpuDecision(state: GameState, options: CpuAiOptions = {}): CpuDecision {
  const perspective = state.currentPlayer;
  const profile = resolveCpuAiProfile(state, options);
  const config = resolveCpuAiConfigForProfile(state, options, profile);
  const masterDamagePlan = findMasterDamagePlan(state, perspective, config.weights);
  if (shouldForceMasterDamagePlan(state, perspective, masterDamagePlan, config)) {
    return withMasterDamagePlanReason(masterDamagePlan.firstDecision, masterDamagePlan);
  }
  if (profile === "white_v2") {
    const decision = chooseTurnPlannerV2Decision(state, {
      evaluateDecisions: (planningState, planningPerspective) => {
        const planningConfig = resolveCpuAiConfigForProfile(planningState, options, "white");
        return evaluateImmediateCpuDecisions(planningState, planningPerspective, planningConfig);
      },
      evaluatePosition: (planningState, planningPerspective) => {
        const planningConfig = resolveCpuAiConfigForProfile(planningState, options, "white");
        return evaluateState(planningState, planningPerspective, planningConfig.weights) +
          evaluateConfiguredFutureTacticalValue(planningState, planningPerspective, true, planningConfig);
      },
      stateKey: terminalPlanStateKey,
      decisionKey: cpuDecisionKey,
      prepareOpponentResponseStates: (responseState, responsePerspective) => [0, 1].map((sampleIndex) =>
        determinizeOpponentPrivateZones(responseState, responsePerspective, sampleIndex)),
      opponentKnowledgeLabel: "known-deck-determinization-x2",
    });
    if (decision) {
      return decision;
    }
  }
  let best: EvaluatedDecision | undefined;
  const fallbackConfig = profile === "white_planner" || profile === "white_rollout"
    ? resolveCpuAiConfigForProfile(state, options, "white")
    : config;
  const evaluated = evaluateCpuDecisions(state, perspective, fallbackConfig);

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

  const shieldHoldEndTurnDecision = selectWhiteMirrorShieldHoldEndTurnDecision(
    state,
    perspective,
    config,
    best,
    evaluated,
  );
  if (shieldHoldEndTurnDecision) {
    return finalizeDecisionTrace(shieldHoldEndTurnDecision, evaluated);
  }

  const midgameOverprotectShieldHoldEndTurnDecision =
    selectWhiteMirrorMidgameOverprotectShieldHoldEndTurnDecision(
      state,
      perspective,
      best,
      evaluated,
    );
  if (midgameOverprotectShieldHoldEndTurnDecision) {
    return finalizeDecisionTrace(midgameOverprotectShieldHoldEndTurnDecision, evaluated);
  }

  if (profile === "white_planner" || profile === "white_rollout") {
    const earlyShieldTargetQualityDecision = selectWhiteMirrorEarlyShieldTargetQualityDecision(
      state,
      perspective,
      best,
      evaluated,
    );
    if (earlyShieldTargetQualityDecision) {
      return finalizeDecisionTrace(earlyShieldTargetQualityDecision, evaluated);
    }
  }

  const backlineMoveBeforeSummonDecision = selectWhiteMirrorBacklineMoveBeforeBackSummonDecision(
    state,
    perspective,
    best,
    evaluated,
  );
  if (backlineMoveBeforeSummonDecision) {
    return finalizeDecisionTrace(backlineMoveBeforeSummonDecision, evaluated);
  }

  const frontReachRetreatBeforeBackSummonDecision =
    selectWhiteMirrorFrontReachRetreatBeforeBackSummonDecision(
      state,
      perspective,
      best,
      evaluated,
    );
  if (frontReachRetreatBeforeBackSummonDecision) {
    return finalizeDecisionTrace(frontReachRetreatBeforeBackSummonDecision, evaluated);
  }

  const frontGuardBeforeLowChipDecision = selectWhiteMirrorFrontGuardBeforeLowChipDecision(
    state,
    perspective,
    best,
    evaluated,
  );
  if (frontGuardBeforeLowChipDecision) {
    return finalizeDecisionTrace(frontGuardBeforeLowChipDecision, evaluated);
  }

  const backThreatAttackBeforeRetreatDecision =
    selectWhiteMirrorBackThreatAttackBeforeRetreatDecision(
      state,
      perspective,
      best,
      evaluated,
    );
  if (backThreatAttackBeforeRetreatDecision) {
    return finalizeDecisionTrace(backThreatAttackBeforeRetreatDecision, evaluated);
  }

  const earlyHoldEndTurnDecision = selectWhiteMirrorEarlyHoldEndTurnDecision(
    state,
    perspective,
    best,
    evaluated,
  );
  if (earlyHoldEndTurnDecision) {
    return finalizeDecisionTrace(earlyHoldEndTurnDecision, evaluated);
  }

  const frontClogHoldEndTurnDecision = selectWhiteMirrorFrontClogHoldEndTurnDecision(
    state,
    perspective,
    best,
    evaluated,
  );
  if (frontClogHoldEndTurnDecision) {
    return finalizeDecisionTrace(frontClogHoldEndTurnDecision, evaluated);
  }

  const lateNoStoneFaceHoldEndTurnDecision = selectWhiteMirrorLateNoStoneFaceHoldEndTurnDecision(
    state,
    perspective,
    best,
    evaluated,
  );
  if (lateNoStoneFaceHoldEndTurnDecision) {
    return finalizeDecisionTrace(lateNoStoneFaceHoldEndTurnDecision, evaluated);
  }

  const skipTerminalPlanRoot = shouldSkipTerminalPlanRootForShieldOnlyRoot(
    state,
    perspective,
    config,
    best,
  );
  if (!skipTerminalPlanRoot && shouldSelectTerminalPlanRoot(state, perspective, config)) {
    const selection = selectTerminalPlanRootDecision(state, perspective, config, options, best);
    if (selection) {
      const lateNoStoneFaceHold = selectWhiteMirrorLateNoStoneFaceHoldEndTurnDecision(
        state,
        perspective,
        selection.candidate,
        evaluated,
        500,
      );
      if (lateNoStoneFaceHold) {
        return finalizeDecisionTrace(lateNoStoneFaceHold, evaluated);
      }
      if (shouldAdoptTerminalPlanRootSelection(state, perspective, selection, best, config)) {
        return finalizeDecisionTrace(withTerminalPlanReason(selection.candidate.decision, selection), evaluated);
      }
    }
  }

  const shieldTargetTieDecision = selectShieldTargetTieRootDecision(state, perspective, config, options, best, evaluated);
  if (shieldTargetTieDecision) {
    return finalizeDecisionTrace(shieldTargetTieDecision, evaluated);
  }

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

export function inspectCpuTerminalPlan(
  state: GameState,
  options: CpuAiOptions = {},
): CpuTerminalPlanInspection {
  const perspective = state.currentPlayer;
  const profile = resolveCpuAiProfile(state, options);
  const config = resolveCpuAiConfigForProfile(state, options, profile);
  const fallbackConfig = profile === "white_planner" || profile === "white_rollout"
    ? resolveCpuAiConfigForProfile(state, options, "white")
    : config;
  const fallback = bestEvaluatedDecision(evaluateCpuDecisions(state, perspective, fallbackConfig));
  const base = {
    perspective,
    profile,
    ...(fallback ? { fallbackDecision: fallback.decision, fallbackScore: fallback.totalScore } : {}),
  };

  if (!shouldSelectTerminalPlanRoot(state, perspective, config)) {
    return {
      ...base,
      enabled: false,
      adopted: false,
      rejectedReason: "terminal plan root selection is disabled for this state",
      candidates: [],
    };
  }

  const baselineScore = evaluateState(state, perspective, config.weights);
  const context = createTerminalPlanEvaluationContext(baselineScore);
  const rootCandidates = withWhiteMirrorHoldFallbackCandidates(
    state,
    perspective,
    config,
    terminalPlanRootCandidates(state, perspective, config, context),
    fallback,
  );
  const bestRootTotalScore = Math.max(
    0,
    ...rootCandidates
      .filter((candidate) => candidate.decision.type !== "end_turn")
      .map((candidate) => candidate.totalScore),
  );
  const rows = evaluateTerminalPlanRootSelections(
    rootCandidates,
    bestRootTotalScore,
    state,
    perspective,
    config,
    context,
    options,
    fallback,
  ).map((selection) => {
    const outcome = selection.outcome;
    const opponentOutcome = shouldUseOpponentTerminalPlanEvaluation(outcome.handoffState, perspective, config)
      ? evaluateOpponentTerminalPlanOutcomeForInspection(
          outcome.handoffState,
          perspective,
          config.sameTurnOpponentTerminalPlanDepth,
          config,
          context,
        )
      : outcome;
    const responseScore = evaluateTerminalPlanOutcomeWithOpponentResponse(outcome, perspective, config, context);
    return {
      candidate: selection.candidate,
      outcome,
      opponentOutcome,
      responseScore,
      plannerScore: selection.plannerScore,
      rolloutScore: selection.rolloutScore,
      rolloutScoreGapToFallback: selection.rolloutScoreGapToFallback,
      rolloutSteps: selection.rolloutSteps,
      rolloutWinner: selection.rolloutWinner,
      rolloutWinnerProfile: selection.rolloutWinnerProfile,
    };
  });
  const ranked = [...rows].sort((a, b) =>
    b.plannerScore - a.plannerScore ||
    b.candidate.totalScore - a.candidate.totalScore ||
    compareTieBreak(a.candidate.decision, b.candidate.decision, a.candidate.index, b.candidate.index),
  );
  const selected = ranked[0];
  const runnerUp = selected
    ? ranked.find((row) => row.candidate.index !== selected.candidate.index)
    : undefined;
  const selection = selected
    ? {
        candidate: selected.candidate,
        outcome: selected.outcome,
        plannerScore: selected.plannerScore,
        ...(runnerUp ? { runnerUpScore: runnerUp.plannerScore } : {}),
        ...(selected.rolloutScore !== undefined ? { rolloutScore: selected.rolloutScore } : {}),
        ...(selected.rolloutScoreGapToFallback !== undefined
          ? { rolloutScoreGapToFallback: selected.rolloutScoreGapToFallback }
          : {}),
        ...(selected.rolloutSteps !== undefined ? { rolloutSteps: selected.rolloutSteps } : {}),
        ...(selected.rolloutWinner ? { rolloutWinner: selected.rolloutWinner } : {}),
        ...(selected.rolloutWinnerProfile ? { rolloutWinnerProfile: selected.rolloutWinnerProfile } : {}),
      }
    : undefined;
  const adopted = !!selection && shouldAdoptTerminalPlanRootSelection(state, perspective, selection, fallback, config);

  return {
    ...base,
    enabled: true,
    ...(selected ? { selectedDecision: selected.candidate.decision, selectedPlannerScore: selected.plannerScore } : {}),
    ...(runnerUp ? { runnerUpPlannerScore: runnerUp.plannerScore } : {}),
    ...(selected?.rolloutScore !== undefined ? { selectedRolloutScore: selected.rolloutScore } : {}),
    ...(selected?.rolloutScoreGapToFallback !== undefined
      ? { selectedRolloutScoreGapToFallback: selected.rolloutScoreGapToFallback }
      : {}),
    adopted,
    ...(!adopted && selected ? { rejectedReason: "terminal plan candidate did not pass adoption gate" } : {}),
    candidates: rows.map((row) => ({
      decision: row.candidate.decision,
      index: row.candidate.index,
      rootScore: row.candidate.totalScore,
      ownDelta: row.outcome.delta,
      opponentDelta: row.opponentOutcome.delta,
      responseScore: row.responseScore,
      plannerScore: row.plannerScore,
      ...(row.rolloutScore !== undefined ? { rolloutScore: row.rolloutScore } : {}),
      ...(row.rolloutScoreGapToFallback !== undefined ? { rolloutScoreGapToFallback: row.rolloutScoreGapToFallback } : {}),
      ...(row.rolloutSteps !== undefined ? { rolloutSteps: row.rolloutSteps } : {}),
      ...(row.rolloutWinner ? { rolloutWinner: row.rolloutWinner } : {}),
      ...(row.rolloutWinnerProfile ? { rolloutWinnerProfile: row.rolloutWinnerProfile } : {}),
      afterRootState: row.candidate.after,
      ownHandoffState: row.outcome.handoffState,
      opponentHandoffState: row.opponentOutcome.handoffState,
    })),
  };
}

function bestEvaluatedDecision(candidates: readonly EvaluatedDecision[]): EvaluatedDecision | undefined {
  let best: EvaluatedDecision | undefined;
  for (const candidate of candidates) {
    if (
      !best ||
      candidate.totalScore > best.totalScore ||
      (candidate.totalScore === best.totalScore &&
        compareTieBreak(candidate.decision, best.decision, candidate.index, best.index) < 0)
    ) {
      best = candidate;
    }
  }
  return best;
}

function findMasterDamagePlan(
  state: GameState,
  perspective: PlayerId,
  weights: AiEvaluationWeights,
  maxDepth = MASTER_DAMAGE_PLAN_MAX_DEPTH,
): MasterDamagePlan {
  const opponent = opponentOf(perspective);
  const startingOpponentHp = state.players[opponent].masterHp;
  if (state.winner || state.pendingLevelUp || state.currentPlayer !== perspective || startingOpponentHp <= 0) {
    return createEmptyMasterDamagePlan();
  }

  const rootCacheKey = `${perspective}:${maxDepth}:${masterDamagePlanStateKey(state, perspective)}`;
  const rootCached = masterDamagePlanGlobalCache.get(rootCacheKey);
  if (rootCached) {
    return rootCached;
  }

  const cache = new Map<string, MasterDamagePlan>();
  const search = (current: GameState, depth: number): MasterDamagePlan => {
    const damage = Math.max(0, startingOpponentHp - current.players[opponent].masterHp);
    const baseline: MasterDamagePlan = {
      damage,
      lethal: current.winner === perspective || damage >= startingOpponentHp,
      steps: 0,
    };
    if (
      depth <= 0 ||
      baseline.lethal ||
      current.winner ||
      current.pendingLevelUp ||
      current.currentPlayer !== perspective
    ) {
      return baseline;
    }

    const cacheKey = `${depth}:${masterDamagePlanStateKey(current, perspective)}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    let best = baseline;
    const decisions = listMasterDamagePlanDecisions(current, weights).slice(0, MASTER_DAMAGE_PLAN_MAX_BRANCHES);
    for (const decision of decisions) {
      let after: GameState;
      try {
        after = applyCpuDecisionForPlanning(current, decision);
      } catch {
        continue;
      }
      const followUp = search(after, depth - 1);
      const candidate: MasterDamagePlan = {
        damage: followUp.damage,
        firstDecision: decision,
        lethal: followUp.lethal,
        steps: followUp.steps + 1,
      };
      if (isBetterMasterDamagePlan(candidate, best)) {
        best = candidate;
      }
    }

    cache.set(cacheKey, best);
    return best;
  };

  const result = search(state, maxDepth);
  rememberMasterDamagePlan(rootCacheKey, result);
  return result;
}

function rememberMasterDamagePlan(key: string, plan: MasterDamagePlan): void {
  if (masterDamagePlanGlobalCache.size >= MASTER_DAMAGE_PLAN_GLOBAL_CACHE_LIMIT) {
    masterDamagePlanGlobalCache.clear();
  }
  masterDamagePlanGlobalCache.set(key, plan);
}

function createEmptyMasterDamagePlan(): MasterDamagePlan {
  return { damage: 0, lethal: false, steps: 0 };
}

function isBetterMasterDamagePlan(candidate: MasterDamagePlan, current: MasterDamagePlan): boolean {
  if (candidate.lethal !== current.lethal) {
    return candidate.lethal;
  }
  if (candidate.damage !== current.damage) {
    return candidate.damage > current.damage;
  }
  if (candidate.steps !== current.steps) {
    return candidate.steps < current.steps || current.steps === 0;
  }
  return (
    candidate.firstDecision !== undefined &&
    current.firstDecision !== undefined &&
    masterDamagePlanDecisionPriority(candidate.firstDecision) > masterDamagePlanDecisionPriority(current.firstDecision)
  );
}

function shouldForceMasterDamagePlan(
  state: GameState,
  perspective: PlayerId,
  plan: MasterDamagePlan,
  config: CpuAiProfileConfig,
): plan is MasterDamagePlan & { firstDecision: CpuDecision } {
  if (!plan.firstDecision || plan.damage <= 0) {
    return false;
  }
  if (plan.lethal) {
    return true;
  }
  if (state.players[perspective].masterId !== "white") {
    return false;
  }

  const opponent = opponentOf(perspective);
  const opponentHp = state.players[opponent].masterHp;
  const remainingHp = opponentHp - plan.damage;
  if (opponentHp > MASTER_DAMAGE_PLAN_CLOSEOUT_HP || remainingHp > 2 || plan.damage < 2) {
    return shouldForceWhiteMirrorDeckRaceDamage(state, perspective, plan, config);
  }

  const opponentMasterDamage = buildThreatModel(state, opponent).masterDamage[perspective];
  return opponentMasterDamage < state.players[perspective].masterHp;
}

function shouldForceWhiteMirrorDeckRaceDamage(
  state: GameState,
  perspective: PlayerId,
  plan: MasterDamagePlan,
  config: CpuAiProfileConfig,
): boolean {
  if (!config.selectTerminalPlan || !isWhiteMirrorState(state, perspective) || plan.damage <= 0) {
    return false;
  }
  const opponent = opponentOf(perspective);
  const own = state.players[perspective];
  const enemy = state.players[opponent];
  if (own.deck.length > 4 || enemy.deck.length > 4 || own.masterHp > 4 || own.masterHp >= enemy.masterHp) {
    return false;
  }
  const opponentMasterDamage = buildThreatModel(state, opponent).masterDamage[perspective];
  return opponentMasterDamage < own.masterHp;
}

function withMasterDamagePlanReason(
  decision: CpuDecision | undefined,
  plan: MasterDamagePlan,
): CpuDecision {
  if (!decision) {
    return createEndTurnDecision();
  }
  const prefix = plan.lethal
    ? "ターン開始時の最大打点で相手マスターを倒せるため"
    : `ターン開始時の最大打点${plan.damage}点で詰めろを作れるため`;
  return {
    ...decision,
    reason: `${prefix}${masterDamagePlanDecisionReasonSuffix(decision)}`,
    trace: {
      ...decision.trace,
      totalScore: decision.trace?.totalScore ?? decision.score,
      baseScore: decision.score,
    },
  } as CpuDecision;
}

function masterDamagePlanDecisionReasonSuffix(decision: CpuDecision): string {
  if (decision.type === "attack") {
    return "攻撃";
  }
  if (decision.type === "master_action" && decision.actionId === "wake_up") {
    return "ウェイクアップ";
  }
  if (decision.type === "master_action" && decision.actionId === "master_attack") {
    return "マスターアタック";
  }
  if (decision.type === "master_action") {
    return "マスター特技";
  }
  if (decision.type === "magic") {
    return "マジックを使用";
  }
  if (decision.type === "summon") {
    return "召喚";
  }
  return "行動";
}

function resolveCpuAiProfile(state: GameState, options: CpuAiOptions): CpuAiProfile {
  return options.profiles?.[state.currentPlayer] ?? options.profile ?? "stable";
}

function resolveCpuAiConfig(state: GameState, options: CpuAiOptions): CpuAiProfileConfig {
  const profile = resolveCpuAiProfile(state, options);
  return resolveCpuAiConfigForProfile(state, options, profile);
}

function resolveCpuAiConfigForProfile(
  state: GameState,
  options: CpuAiOptions,
  profile: CpuAiProfile,
): CpuAiProfileConfig {
  const base = CPU_AI_PROFILE_CONFIG[profile];
  const baseWithSearch = applyCpuAiSearchOptions(base, options.searches?.[state.currentPlayer] ?? options.search);
  const matchupTuning = resolveCpuAiMatchupTuning(state, profile);
  const tuning = mergeCpuAiTuning(
    mergeCpuAiTuning(baseWithSearch.tuning, matchupTuning),
    options.tunings?.[state.currentPlayer] ?? options.tuning,
  );
  if (!tuning) {
    return baseWithSearch;
  }
  return {
    ...baseWithSearch,
    weights: tuning.weights ? { ...baseWithSearch.weights, ...tuning.weights } : baseWithSearch.weights,
    tuning,
  };
}

function applyCpuAiSearchOptions(
  base: CpuAiProfileConfig,
  search: CpuAiSearchOptions | undefined,
): CpuAiProfileConfig {
  if (!search) {
    return base;
  }
  return {
    ...base,
    detailedWidth: normalizedSearchInteger(search.detailedWidth, base.detailedWidth),
    sameTurnSearchDepth: normalizedSearchInteger(search.sameTurnSearchDepth, base.sameTurnSearchDepth),
    sameTurnSearchWidth: normalizedSearchInteger(search.sameTurnSearchWidth, base.sameTurnSearchWidth),
    sameTurnTerminalPlanDepth: normalizedSearchInteger(search.sameTurnTerminalPlanDepth, base.sameTurnTerminalPlanDepth),
    sameTurnTerminalPlanWidth: normalizedSearchInteger(search.sameTurnTerminalPlanWidth, base.sameTurnTerminalPlanWidth),
    sameTurnTerminalPlanWeight: normalizedSearchNumber(search.sameTurnTerminalPlanWeight, base.sameTurnTerminalPlanWeight),
    sameTurnTerminalPlanComparisonWeight: normalizedOptionalSearchNumber(
      search.sameTurnTerminalPlanComparisonWeight,
      base.sameTurnTerminalPlanComparisonWeight,
    ),
    sameTurnOpponentTerminalPlanDepth: normalizedSearchInteger(
      search.sameTurnOpponentTerminalPlanDepth,
      base.sameTurnOpponentTerminalPlanDepth,
    ),
    sameTurnOpponentTerminalPlanWidth: normalizedSearchInteger(
      search.sameTurnOpponentTerminalPlanWidth,
      base.sameTurnOpponentTerminalPlanWidth,
    ),
    sameTurnOpponentTerminalPlanWeight: normalizedSearchNumber(
      search.sameTurnOpponentTerminalPlanWeight,
      base.sameTurnOpponentTerminalPlanWeight,
    ),
    terminalPlanFocusHandoffValue: normalizedOptionalSearchNumber(
      search.terminalPlanFocusHandoffValue,
      base.terminalPlanFocusHandoffValue,
    ),
    terminalPlanShieldHandoffValue: normalizedOptionalSearchNumber(
      search.terminalPlanShieldHandoffValue,
      base.terminalPlanShieldHandoffValue,
    ),
    terminalPlanRootDecisionWeight: normalizedOptionalSearchNumber(
      search.terminalPlanRootDecisionWeight,
      base.terminalPlanRootDecisionWeight,
    ),
    terminalPlanRootGapFreeMargin: normalizedOptionalSearchNumber(
      search.terminalPlanRootGapFreeMargin,
      base.terminalPlanRootGapFreeMargin,
    ),
    terminalPlanRootGapPenaltyWeight: normalizedOptionalSearchNumber(
      search.terminalPlanRootGapPenaltyWeight,
      base.terminalPlanRootGapPenaltyWeight,
    ),
    terminalPlanSetupOverFocusRootNeutralTurnFrom: normalizedOptionalSearchNumber(
      search.terminalPlanSetupOverFocusRootNeutralTurnFrom,
      base.terminalPlanSetupOverFocusRootNeutralTurnFrom,
    ),
    terminalPlanSetupOverFocusAdoptionMaxRootScoreGap: normalizedOptionalSearchNumber(
      search.terminalPlanSetupOverFocusAdoptionMaxRootScoreGap,
      base.terminalPlanSetupOverFocusAdoptionMaxRootScoreGap,
    ),
    terminalPlanSetupOverFocusAdoptionMinMargin: normalizedOptionalSearchNumber(
      search.terminalPlanSetupOverFocusAdoptionMinMargin,
      base.terminalPlanSetupOverFocusAdoptionMinMargin,
    ),
    terminalPlanAdoptionMinMargin: normalizedOptionalSearchNumber(
      search.terminalPlanAdoptionMinMargin,
      base.terminalPlanAdoptionMinMargin,
    ),
    terminalPlanAdoptionMaxRootScoreGap: normalizedOptionalSearchNumber(
      search.terminalPlanAdoptionMaxRootScoreGap,
      base.terminalPlanAdoptionMaxRootScoreGap,
    ),
    terminalPlanRejectNonLethalFaceDamage: normalizedOptionalSearchNumber(
      search.terminalPlanRejectNonLethalFaceDamage,
      base.terminalPlanRejectNonLethalFaceDamage,
    ),
    terminalPlanRejectEndTurnOverAction: normalizedOptionalSearchNumber(
      search.terminalPlanRejectEndTurnOverAction,
      base.terminalPlanRejectEndTurnOverAction,
    ),
    terminalPlanRejectSetupOverTacticalAction: normalizedOptionalSearchNumber(
      search.terminalPlanRejectSetupOverTacticalAction,
      base.terminalPlanRejectSetupOverTacticalAction,
    ),
    terminalPlanRequireCompatibleFallbackAction: normalizedOptionalSearchNumber(
      search.terminalPlanRequireCompatibleFallbackAction,
      base.terminalPlanRequireCompatibleFallbackAction,
    ),
    terminalPlanRolloutSteps: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutSteps,
      base.terminalPlanRolloutSteps,
    ),
    terminalPlanRolloutCandidateLimit: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutCandidateLimit,
      base.terminalPlanRolloutCandidateLimit,
    ),
    terminalPlanRolloutWeight: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutWeight,
      base.terminalPlanRolloutWeight,
    ),
    terminalPlanRolloutAdoptionMinScoreGap: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutAdoptionMinScoreGap,
      base.terminalPlanRolloutAdoptionMinScoreGap,
    ),
    terminalPlanRolloutTriggerMinRootScoreGap: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutTriggerMinRootScoreGap,
      base.terminalPlanRolloutTriggerMinRootScoreGap,
    ),
    terminalPlanRolloutTriggerMaxPlannerMargin: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutTriggerMaxPlannerMargin,
      base.terminalPlanRolloutTriggerMaxPlannerMargin,
    ),
    terminalPlanRolloutTurnFrom: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutTurnFrom,
      base.terminalPlanRolloutTurnFrom,
    ),
    terminalPlanRolloutTurnTo: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutTurnTo,
      base.terminalPlanRolloutTurnTo,
    ),
    terminalPlanRolloutMaxOpponentStones: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutMaxOpponentStones,
      base.terminalPlanRolloutMaxOpponentStones,
    ),
    terminalPlanRolloutRequireFallbackMove: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutRequireFallbackMove,
      base.terminalPlanRolloutRequireFallbackMove,
    ),
    terminalPlanRolloutRequirePlannerSummon: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutRequirePlannerSummon,
      base.terminalPlanRolloutRequirePlannerSummon,
    ),
    terminalPlanRolloutRequirePlannerSummonBacklineReach: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutRequirePlannerSummonBacklineReach,
      base.terminalPlanRolloutRequirePlannerSummonBacklineReach,
    ),
    terminalPlanRolloutAllowCloseoutHoldEndTurn: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutAllowCloseoutHoldEndTurn,
      base.terminalPlanRolloutAllowCloseoutHoldEndTurn,
    ),
    terminalPlanRolloutCloseoutHoldEndTurnSteps: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutCloseoutHoldEndTurnSteps,
      base.terminalPlanRolloutCloseoutHoldEndTurnSteps,
    ),
    terminalPlanRolloutAllowLatePressureOverSummon: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutAllowLatePressureOverSummon,
      base.terminalPlanRolloutAllowLatePressureOverSummon,
    ),
    terminalPlanRolloutLatePressureOverSummonSteps: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutLatePressureOverSummonSteps,
      base.terminalPlanRolloutLatePressureOverSummonSteps,
    ),
    terminalPlanRolloutAllowLateDeckHoldEndTurn: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutAllowLateDeckHoldEndTurn,
      base.terminalPlanRolloutAllowLateDeckHoldEndTurn,
    ),
    terminalPlanRolloutLateDeckHoldEndTurnSteps: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutLateDeckHoldEndTurnSteps,
      base.terminalPlanRolloutLateDeckHoldEndTurnSteps,
    ),
    terminalPlanAllowShieldHoldEndTurn: normalizedOptionalSearchNumber(
      search.terminalPlanAllowShieldHoldEndTurn,
      base.terminalPlanAllowShieldHoldEndTurn,
    ),
    terminalPlanRolloutAllowFrontFocusStripAttack: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutAllowFrontFocusStripAttack,
      base.terminalPlanRolloutAllowFrontFocusStripAttack,
    ),
    terminalPlanRolloutFrontFocusStripAttackMinRootScoreGap: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutFrontFocusStripAttackMinRootScoreGap,
      base.terminalPlanRolloutFrontFocusStripAttackMinRootScoreGap,
    ),
    terminalPlanRolloutFrontFocusStripAttackMaxRootScoreGap: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutFrontFocusStripAttackMaxRootScoreGap,
      base.terminalPlanRolloutFrontFocusStripAttackMaxRootScoreGap,
    ),
    terminalPlanRolloutFrontFocusStripAttackSteps: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutFrontFocusStripAttackSteps,
      base.terminalPlanRolloutFrontFocusStripAttackSteps,
    ),
    terminalPlanRolloutAllowShieldTargetTie: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutAllowShieldTargetTie,
      base.terminalPlanRolloutAllowShieldTargetTie,
    ),
    terminalPlanRolloutShieldTargetTieMaxRootScoreGap: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutShieldTargetTieMaxRootScoreGap,
      base.terminalPlanRolloutShieldTargetTieMaxRootScoreGap,
    ),
    terminalPlanRolloutShieldTargetTieSteps: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutShieldTargetTieSteps,
      base.terminalPlanRolloutShieldTargetTieSteps,
    ),
    terminalPlanRolloutUseHandoff: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutUseHandoff,
      base.terminalPlanRolloutUseHandoff,
    ),
    terminalPlanRolloutUseLightweightProfile: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutUseLightweightProfile,
      base.terminalPlanRolloutUseLightweightProfile,
    ),
    terminalPlanRolloutOncePerTurn: normalizedOptionalSearchNumber(
      search.terminalPlanRolloutOncePerTurn,
      base.terminalPlanRolloutOncePerTurn,
    ),
    beamScoreThreshold: normalizedSearchInteger(search.beamScoreThreshold, base.beamScoreThreshold),
  };
}

function normalizedSearchInteger(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(0, Math.trunc(value));
}

function normalizedSearchNumber(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(0, value);
}

function normalizedOptionalSearchNumber(value: number | undefined, fallback: number | undefined): number | undefined {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(0, value);
}

function resolveCpuAiMatchupTuning(state: GameState, profile: CpuAiProfile): CpuAiTuning | undefined {
  const perspective = state.currentPlayer;
  const opponent = opponentOf(perspective);
  if (
    (profile === "white" || profile === "white_planner" || profile === "white_v2" || profile === "white_rollout" || profile === "omniscient") &&
    state.players[perspective].masterId === "white" &&
    state.players[opponent].masterId === "black"
  ) {
    return WHITE_VS_BLACK_MATCHUP_TUNING;
  }
  if (
    (profile === "white" || profile === "white_planner" || profile === "white_v2" || profile === "white_rollout" || profile === "omniscient") &&
    state.players[perspective].masterId === "white" &&
    state.players[opponent].masterId === "white"
  ) {
    return WHITE_VS_WHITE_MATCHUP_TUNING;
  }
  return undefined;
}

function mergeCpuAiTuning(base: CpuAiTuning | undefined, override: CpuAiTuning | undefined): CpuAiTuning | undefined {
  if (!base) {
    return override;
  }
  if (!override) {
    return base;
  }
  return {
    weights: base.weights || override.weights ? { ...base.weights, ...override.weights } : undefined,
    actionBias: base.actionBias || override.actionBias ? { ...base.actionBias, ...override.actionBias } : undefined,
    situationalBias: base.situationalBias || override.situationalBias
      ? { ...base.situationalBias, ...override.situationalBias }
      : undefined,
  };
}

function evaluateCpuDecisions(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
): EvaluatedDecision[] {
  const beforeScore = evaluateState(state, perspective, config.weights);
  const beforeFutureScore = evaluateConfiguredFutureTacticalValue(state, perspective, false, config);
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
  const terminalPlanEnabled = shouldUseTerminalPlanEvaluation(state, perspective, config);
  const lookaheadCandidates = evaluated
    .filter((candidate) => candidate.decision.type !== "end_turn")
    .sort(
      (a, b) =>
        b.totalScore - a.totalScore || compareTieBreak(a.decision, b.decision, a.index, b.index),
    )
    .slice(0, config.detailedWidth);
  if (terminalPlanEnabled) {
    const endTurnCandidate = evaluated.find((candidate) => candidate.decision.type === "end_turn");
    if (endTurnCandidate && !lookaheadCandidates.some((candidate) => candidate.index === endTurnCandidate.index)) {
      lookaheadCandidates.push(endTurnCandidate);
    }
  }
  const lookaheadIndexes = new Set(
    lookaheadCandidates.map((candidate) => candidate.index),
  );
  const beforeDetailedFutureScore = evaluateConfiguredFutureTacticalValue(state, perspective, true, config);
  const terminalPlanComparisonEnabled = terminalPlanEnabled && terminalPlanComparisonWeight(config) > 0;
  const terminalPlanDeltas = terminalPlanComparisonEnabled
    ? evaluateTerminalPlanDeltas(perspective, config, beforeScore, lookaheadCandidates)
    : new Map<number, number>();
  const bestTerminalPlanDelta = Math.max(0, ...terminalPlanDeltas.values());

  return evaluated.map((candidate) => {
    const directMasterDetourPenalty = directMasterDamageDetourPenalty(
      state,
      candidate,
      perspective,
      hasDirectMasterPressure,
    );
    const opponentResponsePenalty = evaluateOpponentResponsePenalty(candidate.after, perspective, config);
    if (!lookaheadIndexes.has(candidate.index)) {
      return { ...candidate, totalScore: candidate.totalScore - directMasterDetourPenalty - opponentResponsePenalty };
    }
    const detailedScore =
      candidate.decision.score +
      decisionTuningBonus(candidate.decision, config) +
      decisionSituationalBonus(state, candidate.after, candidate.decision, perspective, config) +
      decisionProfileBonus(state, candidate.after, candidate.decision, perspective, config) +
      evaluateState(candidate.after, perspective, config.weights) -
      beforeScore +
      evaluateConfiguredFutureTacticalValue(candidate.after, perspective, true, config) -
      beforeDetailedFutureScore -
      opponentMasterDamagePlanCommitmentPenalty(state, candidate.after, candidate.decision, perspective, config.weights) +
      opponentMasterDamagePlanReductionBonus(state, candidate.after, perspective, config.weights);
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
    const terminalPlanPenalty = terminalPlanComparisonPenalty(
      candidate,
      terminalPlanDeltas,
      bestTerminalPlanDelta,
      config,
    );
    return {
      ...candidate,
      totalScore:
        detailedScore +
        adjustedLookaheadBonus -
        terminalPlanPenalty -
        directMasterDetourPenalty -
        opponentResponsePenalty,
    };
  });
}

function shouldUseTerminalPlanEvaluation(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
): boolean {
  return (
    state.players[perspective].masterId === "white" &&
    config.sameTurnTerminalPlanWeight > 0 &&
    config.sameTurnTerminalPlanDepth > 0 &&
    config.sameTurnTerminalPlanWidth > 0
  );
}

function shouldSelectTerminalPlanRoot(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
): boolean {
  return (
    !!config.selectTerminalPlan &&
    shouldUseTerminalPlanEvaluation(state, perspective, config) &&
    !state.winner &&
    !state.pendingLevelUp &&
    state.currentPlayer === perspective
  );
}

function selectTerminalPlanRootDecision(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  options: CpuAiOptions,
  fallback: EvaluatedDecision | undefined,
): TerminalPlanSelection | undefined {
  const baselineScore = evaluateState(state, perspective, config.weights);
  const context = createTerminalPlanEvaluationContext(baselineScore);
  const candidates = withWhiteMirrorHoldFallbackCandidates(
    state,
    perspective,
    config,
    terminalPlanRootCandidates(state, perspective, config, context),
    fallback,
  );
  if (candidates.length === 0) {
    return undefined;
  }
  const bestRootTotalScore = Math.max(
    0,
    ...candidates
      .filter((candidate) => candidate.decision.type !== "end_turn")
      .map((candidate) => candidate.totalScore),
  );

  const ranked = evaluateTerminalPlanRootSelections(
    candidates,
    bestRootTotalScore,
    state,
    perspective,
    config,
    context,
    options,
    fallback,
  ).sort(compareTerminalPlanSelections);
  const best = ranked[0];
  if (!best) {
    return undefined;
  }
  const runnerUp = ranked.find((candidate) => candidate.candidate.index !== best.candidate.index);
  return runnerUp ? { ...best, runnerUpScore: runnerUp.plannerScore } : best;
}

function evaluateTerminalPlanRootSelections(
  candidates: readonly EvaluatedDecision[],
  bestRootTotalScore: number,
  rootState: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  context: TerminalPlanEvaluationContext,
  options: CpuAiOptions,
  fallback: EvaluatedDecision | undefined,
): TerminalPlanSelection[] {
  const selections = candidates.map((candidate): TerminalPlanSelection => {
    const outcome = candidate.decision.type === "end_turn"
      ? {
          delta: terminalPlanStateDelta(candidate.after, perspective, config, context),
          handoffState: candidate.after,
        }
      : evaluateSameTurnTerminalPlanOutcome(
          candidate.after,
          perspective,
          config.sameTurnTerminalPlanDepth - 1,
          config,
          context,
        );
    const plannerScore = terminalPlanRootPlannerScore(
      candidate,
      outcome,
      bestRootTotalScore,
      rootState,
      perspective,
      config,
      context,
      fallback,
    );
    return {
      candidate,
      outcome,
      plannerScore,
      terminalPlannerScore: plannerScore,
    };
  });
  return applyTerminalPlanRolloutScores(selections, rootState, perspective, config, options, fallback);
}

function compareTerminalPlanSelections(a: TerminalPlanSelection, b: TerminalPlanSelection): number {
  return (
    b.plannerScore - a.plannerScore ||
    b.candidate.totalScore - a.candidate.totalScore ||
    compareTieBreak(a.candidate.decision, b.candidate.decision, a.candidate.index, b.candidate.index)
  );
}

function applyTerminalPlanRolloutScores(
  selections: readonly TerminalPlanSelection[],
  rootState: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  options: CpuAiOptions,
  fallback: EvaluatedDecision | undefined,
): TerminalPlanSelection[] {
  const rolloutSteps = Math.trunc(config.terminalPlanRolloutSteps ?? 0);
  const rolloutWeight = config.terminalPlanRolloutWeight ?? 0;
  if (rolloutSteps <= 0 || rolloutWeight <= 0 || selections.length === 0) {
    return [...selections];
  }

  const fallbackKey = fallback ? cpuDecisionKey(fallback.decision) : undefined;
  const terminalRanked = [...selections].sort(compareTerminalPlanSelections);
  const fallbackSelection = fallbackKey
    ? terminalRanked.find((selection) => cpuDecisionKey(selection.candidate.decision) === fallbackKey)
    : undefined;
  const rolloutTrigger = terminalPlanRolloutTriggerSelection(
    rootState,
    perspective,
    terminalRanked,
    fallbackSelection,
    fallback,
    config,
  );
  if (!rolloutTrigger) {
    return [...selections];
  }

  const isFrontFocusStripRolloutTrigger = isWhiteMirrorEnemyFrontFocusStripAttackSelection(rootState, rolloutTrigger.candidate);
  const isLateDeckRepositionRolloutTrigger = isWhiteMirrorLateDeckRepositionMoveSelection(
    rootState,
    perspective,
    rolloutTrigger.candidate,
  );
  const isLateDeckHoldEndTurnRolloutTrigger = isWhiteMirrorLateDeckHoldEndTurnSelection(
    rootState,
    perspective,
    rolloutTrigger.candidate,
  );
  const isCloseoutHoldEndTurnRolloutTrigger = isWhiteMirrorCloseoutHoldEndTurnSelection(
    rootState,
    perspective,
    rolloutTrigger.candidate,
  );
  const isLatePressureOverSummonRolloutTrigger = isWhiteMirrorLatePressureOverSummonSelection(
    rootState,
    perspective,
    rolloutTrigger.candidate,
  );
  const isFrontPressureRolloutTrigger =
    isFrontFocusStripRolloutTrigger || isWhiteMirrorFrontPressureEscapeSelection(rootState, rolloutTrigger.candidate);
  const isShieldTargetTieRolloutTrigger = isWhiteMirrorShieldTargetTieRolloutTrigger(
    rootState,
    perspective,
    terminalRanked,
    rolloutTrigger,
    config,
  );
  const effectiveRolloutSteps = isFrontPressureRolloutTrigger
    ? Math.trunc(config.terminalPlanRolloutFrontFocusStripAttackSteps ?? rolloutSteps)
    : isShieldTargetTieRolloutTrigger
      ? Math.trunc(config.terminalPlanRolloutShieldTargetTieSteps ?? rolloutSteps)
      : isCloseoutHoldEndTurnRolloutTrigger
        ? Math.trunc(config.terminalPlanRolloutCloseoutHoldEndTurnSteps ?? rolloutSteps)
        : isLateDeckRepositionRolloutTrigger
          ? Math.max(64, rolloutSteps)
          : isLateDeckHoldEndTurnRolloutTrigger
            ? Math.trunc(config.terminalPlanRolloutLateDeckHoldEndTurnSteps ?? rolloutSteps)
            : isLatePressureOverSummonRolloutTrigger
              ? Math.max(Math.trunc(config.terminalPlanRolloutLatePressureOverSummonSteps ?? rolloutSteps), rolloutSteps)
              : rolloutSteps;
  if (effectiveRolloutSteps <= 0) {
    return [...selections];
  }

  const candidateLimit = Math.trunc(config.terminalPlanRolloutCandidateLimit ?? terminalRanked.length);
  const rolloutKeys = new Set<string>();
  rolloutKeys.add(cpuDecisionKey(rolloutTrigger.candidate.decision));
  const rolloutCandidatePool = terminalRanked.slice(0, Math.max(1, candidateLimit));
  if (isFrontPressureRolloutTrigger) {
    // The front-pressure escape candidates are handled by the lightweight planner bonus.
    // Rolling them all out made a few dense white mirrors exceed practical turn time.
    const holdEndTurn = terminalRanked.find((selection) =>
      isWhiteMirrorFrontPressureHoldEndTurnSelection(rootState, perspective, selection.candidate),
    );
    if (holdEndTurn) {
      rolloutKeys.add(cpuDecisionKey(holdEndTurn.candidate.decision));
    }
  } else if (!isCloseoutHoldEndTurnRolloutTrigger && !isLateDeckHoldEndTurnRolloutTrigger) {
    rolloutCandidatePool.forEach((selection) => {
      rolloutKeys.add(cpuDecisionKey(selection.candidate.decision));
    });
  }
  if (fallbackKey && terminalRanked.some((selection) => cpuDecisionKey(selection.candidate.decision) === fallbackKey)) {
    rolloutKeys.add(fallbackKey);
  }

  const rolloutCache = new Map<string, TerminalPlanRolloutResult>();
  const rolloutProfileOverride = config.terminalPlanRolloutUseLightweightProfile
    ? "strong"
    : isFrontPressureRolloutTrigger
      ? "white"
      : isShieldTargetTieRolloutTrigger
        ? "strong"
        : undefined;
  const rolloutOptions = withoutTerminalPlanRolloutOptions(
    options,
    rolloutProfileOverride,
    Boolean(config.terminalPlanRolloutUseLightweightProfile),
  );
  const rolloutFor = (selection: TerminalPlanSelection): TerminalPlanRolloutResult | undefined => {
    const key = cpuDecisionKey(selection.candidate.decision);
    if (!rolloutKeys.has(key)) {
      return undefined;
    }
    const cached = rolloutCache.get(key);
    if (cached) {
      return cached;
    }
    const useHandoffRollout =
      isShieldTargetTieRolloutTrigger ||
      isLateDeckHoldEndTurnRolloutTrigger ||
      Boolean(config.terminalPlanRolloutUseHandoff);
    const result = useHandoffRollout
      ? evaluateTerminalPlanHandoffRollout(
          selection.candidate.after,
          rootState.turnNumber,
          perspective,
          effectiveRolloutSteps,
          rolloutOptions,
          config,
        )
      : evaluateTerminalPlanRollout(
          selection.candidate.after,
          perspective,
          effectiveRolloutSteps,
          rolloutOptions,
          config,
        );
    rolloutCache.set(key, result);
    return result;
  };

  const fallbackRolloutScore = fallbackSelection ? rolloutFor(fallbackSelection)?.score : undefined;

  return selections
    .filter((selection) => isFrontPressureRolloutTrigger || rolloutKeys.has(cpuDecisionKey(selection.candidate.decision)))
    .map((selection) => {
      const rollout = rolloutFor(selection);
      if (!rollout) {
        return selection;
      }
      const normalizedRolloutScore = clampNumber(rollout.score, -1_000, 1_000);
      const rolloutBonus = normalizedRolloutScore * rolloutWeight;
      const rolloutScoreGapToFallback = fallbackRolloutScore === undefined ? undefined : rollout.score - fallbackRolloutScore;
      const rolloutConfirmationBonus =
        config.terminalPlanRolloutAdoptionMinScoreGap !== undefined &&
        rolloutScoreGapToFallback !== undefined &&
        rolloutScoreGapToFallback >= config.terminalPlanRolloutAdoptionMinScoreGap
          ? Math.min(500, rolloutScoreGapToFallback)
          : 0;
      return {
        ...selection,
        plannerScore: selection.plannerScore + rolloutBonus + rolloutConfirmationBonus,
        rolloutScore: rollout.score,
        ...(rolloutScoreGapToFallback !== undefined ? { rolloutScoreGapToFallback } : {}),
        rolloutSteps: rollout.steps,
        ...(rollout.winner ? { rolloutWinner: rollout.winner } : {}),
        ...(rollout.winnerProfile ? { rolloutWinnerProfile: rollout.winnerProfile } : {}),
      };
    });
}

function terminalPlanRolloutTriggerSelection(
  state: GameState,
  perspective: PlayerId,
  terminalRanked: readonly TerminalPlanSelection[],
  fallbackSelection: TerminalPlanSelection | undefined,
  fallback: EvaluatedDecision | undefined,
  config: CpuAiProfileConfig,
): TerminalPlanSelection | undefined {
  if (config.terminalPlanRolloutOncePerTurn && hasAdoptedTerminalPlanRolloutThisTurn(state, perspective)) {
    return undefined;
  }
  const best = terminalRanked[0];
  if (!best || !fallback) {
    return undefined;
  }
  const closeoutHoldEndTurn = terminalPlanCloseoutHoldEndTurnRolloutTriggerSelection(
    state,
    perspective,
    terminalRanked,
    fallback,
    config,
  );
  if (closeoutHoldEndTurn) {
    return closeoutHoldEndTurn;
  }
  const lateDeckHoldEndTurn = terminalPlanLateDeckHoldEndTurnRolloutTriggerSelection(
    state,
    perspective,
    terminalRanked,
    fallback,
    config,
  );
  if (lateDeckHoldEndTurn) {
    return lateDeckHoldEndTurn;
  }
  if (!fallbackSelection) {
    return undefined;
  }
  const lateDeckReposition = terminalPlanLateDeckRepositionRolloutTriggerSelection(
    state,
    perspective,
    terminalRanked,
    fallback,
  );
  if (lateDeckReposition) {
    return lateDeckReposition;
  }
  const latePressureOverSummon = terminalPlanLatePressureOverSummonRolloutTriggerSelection(
    state,
    perspective,
    terminalRanked,
    fallback,
    config,
  );
  if (latePressureOverSummon) {
    return latePressureOverSummon;
  }
  if (config.terminalPlanRolloutTurnFrom !== undefined && state.turnNumber < config.terminalPlanRolloutTurnFrom) {
    return undefined;
  }
  if (config.terminalPlanRolloutTurnTo !== undefined && state.turnNumber > config.terminalPlanRolloutTurnTo) {
    return undefined;
  }
  const frontFocusStripChallenger = terminalPlanFrontFocusStripAttackRolloutTriggerSelection(
    state,
    terminalRanked,
    fallback,
    config,
  );
  if (frontFocusStripChallenger) {
    return frontFocusStripChallenger;
  }
  const shieldTargetTie = terminalPlanShieldTargetTieRolloutTriggerSelection(
    state,
    perspective,
    terminalRanked,
    config,
  );
  if (shieldTargetTie) {
    return shieldTargetTie;
  }
  if (
    config.terminalPlanRolloutMaxOpponentStones !== undefined &&
    state.players[opponentOf(perspective)].stones > config.terminalPlanRolloutMaxOpponentStones
  ) {
    return undefined;
  }
  const fallbackKey = cpuDecisionKey(fallback.decision);
  const bestKey = cpuDecisionKey(best.candidate.decision);
  const rolloutChallenger = bestKey === fallbackKey
    ? terminalRanked.find((selection) => cpuDecisionKey(selection.candidate.decision) !== fallbackKey)
    : best;
  if (!rolloutChallenger) {
    return undefined;
  }
  if (config.terminalPlanRolloutRequireFallbackMove && fallback.decision.type !== "move") {
    return undefined;
  }
  if (config.terminalPlanRolloutRequirePlannerSummon && rolloutChallenger.candidate.decision.type !== "summon") {
    return undefined;
  }
  if (
    config.terminalPlanRolloutRequirePlannerSummonBacklineReach &&
    !isBacklineReachSummonDecision(state, rolloutChallenger.candidate.decision)
  ) {
    return undefined;
  }
  const rootScoreGap = fallback.totalScore - rolloutChallenger.candidate.totalScore;
  const minRootScoreGap = config.terminalPlanRolloutTriggerMinRootScoreGap ?? 120;
  if (rootScoreGap < minRootScoreGap) {
    return undefined;
  }
  const plannerMargin = bestKey === fallbackKey
    ? fallbackSelection.plannerScore - rolloutChallenger.plannerScore
    : best.plannerScore - fallbackSelection.plannerScore;
  const maxPlannerMargin = config.terminalPlanRolloutTriggerMaxPlannerMargin ?? 40;
  return plannerMargin <= maxPlannerMargin ? rolloutChallenger : undefined;
}

function terminalPlanCloseoutHoldEndTurnRolloutTriggerSelection(
  state: GameState,
  perspective: PlayerId,
  terminalRanked: readonly TerminalPlanSelection[],
  fallback: EvaluatedDecision,
  config: CpuAiProfileConfig,
): TerminalPlanSelection | undefined {
  if (
    !config.terminalPlanRolloutAllowCloseoutHoldEndTurn ||
    !isWhiteMirrorCloseoutHoldEndTurnFallback(state, perspective, fallback)
  ) {
    return undefined;
  }

  return terminalRanked.find((selection) =>
    isWhiteMirrorCloseoutHoldEndTurnSelection(state, perspective, selection.candidate),
  );
}

function terminalPlanLateDeckHoldEndTurnRolloutTriggerSelection(
  state: GameState,
  perspective: PlayerId,
  terminalRanked: readonly TerminalPlanSelection[],
  fallback: EvaluatedDecision,
  config: CpuAiProfileConfig,
): TerminalPlanSelection | undefined {
  if (
    !config.terminalPlanRolloutAllowLateDeckHoldEndTurn ||
    !isWhiteMirrorLateDeckHoldEndTurnFallback(state, perspective, fallback)
  ) {
    return undefined;
  }

  return terminalRanked.find((selection) =>
    isWhiteMirrorLateDeckHoldEndTurnSelection(state, perspective, selection.candidate),
  );
}

function terminalPlanLateDeckRepositionRolloutTriggerSelection(
  state: GameState,
  perspective: PlayerId,
  terminalRanked: readonly TerminalPlanSelection[],
  fallback: EvaluatedDecision,
): TerminalPlanSelection | undefined {
  if (
    !isWhiteMirrorState(state, perspective) ||
    state.turnNumber < 18 ||
    state.players[perspective].deck.length > 6 ||
    state.players[opponentOf(perspective)].deck.length > 6 ||
    !isRotationMagicDecision(state, perspective, fallback.decision)
  ) {
    return undefined;
  }

  return terminalRanked.find((selection) =>
    isWhiteMirrorLateDeckRepositionMoveSelection(state, perspective, selection.candidate),
  );
}

function terminalPlanLatePressureOverSummonRolloutTriggerSelection(
  state: GameState,
  perspective: PlayerId,
  terminalRanked: readonly TerminalPlanSelection[],
  fallback: EvaluatedDecision,
  config: CpuAiProfileConfig,
): TerminalPlanSelection | undefined {
  const opponent = opponentOf(perspective);
  if (
    !config.terminalPlanRolloutAllowLatePressureOverSummon ||
    !isWhiteMirrorState(state, perspective) ||
    state.turnNumber !== 15 ||
    state.players[opponent].masterHp !== 5 ||
    state.players[opponent].stones > 0 ||
    state.players[perspective].masterHp < 9 ||
    state.players[perspective].masterHp - state.players[opponent].masterHp < 3 ||
    state.players[perspective].stones < 8 ||
    state.players[perspective].stones > 12 ||
    state.players[perspective].hand.length < 6 ||
    ownReadyFrontMonsterCount(state, perspective) < 2 ||
    frontMonsterCountForPlayer(state, opponent) !== 1 ||
    focusedMonsterCountForPlayer(state, perspective) < 2 ||
    emptyBackSlotCountForPlayer(state, perspective) !== 1 ||
    !isWhiteMirrorLatePressureBacklineSummon(state, perspective, fallback)
  ) {
    return undefined;
  }

  const fallbackKey = cpuDecisionKey(fallback.decision);
  const fallbackSelection = terminalRanked.find((selection) =>
    cpuDecisionKey(selection.candidate.decision) === fallbackKey,
  );
  if (!fallbackSelection || emptyBackSlotCountForPlayer(fallbackSelection.candidate.after, perspective) !== 0) {
    return undefined;
  }

  const holdSelection = terminalRanked.find((selection) =>
    cpuDecisionKey(selection.candidate.decision) !== fallbackKey &&
    isWhiteMirrorLatePressureOverSummonSelection(state, perspective, selection.candidate),
  );
  if (!holdSelection) {
    return undefined;
  }

  const plannerGap = fallbackSelection.plannerScore - holdSelection.plannerScore;
  const rootGap = fallbackSelection.candidate.totalScore - holdSelection.candidate.totalScore;
  return plannerGap <= 190 && rootGap <= 180 ? holdSelection : undefined;
}

function selectWhiteMirrorFrontClogHoldEndTurnDecision(
  state: GameState,
  perspective: PlayerId,
  _fallback: EvaluatedDecision | undefined,
  evaluated: readonly EvaluatedDecision[],
): CpuDecision | undefined {
  const frontClogState = isWhiteMirrorFrontClogHoldState(state, perspective);
  if (!frontClogState) {
    return undefined;
  }
  const frontSummon = evaluated
    .filter((candidate) => isWhiteMirrorFrontClogFrontSummonCandidate(state, perspective, candidate))
    .sort(
      (a, b) =>
        b.totalScore - a.totalScore || compareTieBreak(a.decision, b.decision, a.index, b.index),
    )[0];
  if (!frontSummon) {
    return undefined;
  }
  const hold = evaluated.find((candidate) => candidate.decision.type === "end_turn");
  if (!hold || hold.totalScore < -1_100) {
    return undefined;
  }
  const rootGap = frontSummon.totalScore - hold.totalScore;
  if (rootGap > 1_700) {
    return undefined;
  }
  return {
    ...hold.decision,
    reason: `${hold.decision.reason} / 白ミラー前列蓋: 低HP前衛を残して後列エースの前進を遅らせる`,
  };
}

function selectWhiteMirrorLateNoStoneFaceHoldEndTurnDecision(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision | undefined,
  evaluated: readonly EvaluatedDecision[],
  maxRootGap = 240,
): CpuDecision | undefined {
  if (!fallback || !isWhiteMirrorLateNoStoneFaceHoldFallback(state, perspective, fallback)) {
    return undefined;
  }

  const hold = evaluated.find((candidate) => candidate.decision.type === "end_turn");
  if (!hold) {
    return undefined;
  }

  const rootGap = fallback.totalScore - hold.totalScore;
  if (rootGap > maxRootGap) {
    return undefined;
  }

  return {
    ...hold.decision,
    reason:
      `${hold.decision.reason} / 白ミラー終盤: ` +
      "石0で相手に石を渡す非リーサル顔打点を見送り、盤面と山札raceを優先",
  };
}

function isWhiteMirrorLateNoStoneFaceHoldFallback(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision,
): boolean {
  if (
    !isWhiteMirrorState(state, perspective) ||
    state.turnNumber < 18 ||
    state.players[perspective].stones > 0 ||
    state.players[perspective].deck.length > 8 ||
    state.players[opponentOf(perspective)].deck.length > 8 ||
    fallback.after.winner ||
    fallback.after.pendingLevelUp ||
    fallback.decision.type !== "attack" ||
    fallback.decision.action.target.kind !== "master"
  ) {
    return false;
  }

  const opponent = opponentOf(perspective);
  const damage = masterDamageFromTransition(state, fallback.after, perspective);
  if (
    damage <= 0 ||
    fallback.after.players[opponent].masterHp <= 3 ||
    state.players[perspective].masterHp < state.players[opponent].masterHp + 1 ||
    fallback.after.players[opponent].stones <= state.players[opponent].stones
  ) {
    return false;
  }

  return whiteMirrorEnemyFrontFormationThreat(state, perspective) >= 90;
}

function isWhiteMirrorFrontClogFrontSummonCandidate(
  state: GameState,
  perspective: PlayerId,
  candidate: EvaluatedDecision,
): boolean {
  const decision = candidate.decision;
  if (decision.type !== "summon") {
    return false;
  }

  const slot = state.slots[decision.slotKey];
  return slot.owner === perspective && slot.row === "front" && !slot.monster;
}

function isWhiteMirrorFrontClogHoldState(state: GameState, perspective: PlayerId): boolean {
  const opponent = opponentOf(perspective);
  const own = state.players[perspective];
  const enemy = state.players[opponent];
  return (
    isWhiteMirrorState(state, perspective) &&
    state.turnNumber >= 12 &&
    state.turnNumber <= 17 &&
    own.masterHp + 1 >= enemy.masterHp &&
    enemy.masterHp <= 7 &&
    own.stones >= 4 &&
    own.stones <= 8 &&
    frontMonsterCountForPlayer(state, opponent) === 1 &&
    opponentBackMonsterCountForPlayer(state, opponent) >= 2 &&
    hasLowHpEnemyFrontClog(state, perspective)
  );
}

function hasLowHpEnemyFrontClog(state: GameState, perspective: PlayerId): boolean {
  const opponent = opponentOf(perspective);
  return FIELD_ORDER_BY_PLAYER[opponent].some((slotKey) => {
    const slot = state.slots[slotKey];
    const monster = slot.monster;
    return slot.row === "front" && monster?.owner === opponent && monster.hp <= 2;
  });
}

function isWhiteMirrorLatePressureBacklineSummon(
  state: GameState,
  perspective: PlayerId,
  candidate: EvaluatedDecision,
): boolean {
  const decision = candidate.decision;
  if (
    decision.type !== "summon" ||
    summonWakeCreatesImmediateWork(state, decision.handInstanceId, decision.slotKey)
  ) {
    return false;
  }
  const slot = state.slots[decision.slotKey];
  return slot.owner === perspective && slot.row === "back" && !slot.monster;
}

function isWhiteMirrorLatePressureOverSummonSelection(
  state: GameState,
  perspective: PlayerId,
  candidate: EvaluatedDecision,
): boolean {
  const decision = candidate.decision;
  if (!isWhiteMirrorState(state, perspective)) {
    return false;
  }
  if (decision.type === "end_turn") {
    return true;
  }
  if (decision.type === "focus") {
    return state.slots[decision.slotKey].monster?.owner === perspective;
  }
  if (decision.type !== "attack" || decision.action.target.kind !== "monster") {
    return false;
  }
  const targetSlot = state.slots[decision.action.target.slotKey];
  return targetSlot.row === "front" && targetSlot.monster?.owner === opponentOf(perspective);
}

function terminalPlanFrontFocusStripAttackRolloutTriggerSelection(
  state: GameState,
  terminalRanked: readonly TerminalPlanSelection[],
  fallback: EvaluatedDecision,
  config: CpuAiProfileConfig,
): TerminalPlanSelection | undefined {
  if (!config.terminalPlanRolloutAllowFrontFocusStripAttack || fallback.decision.type !== "focus") {
    return undefined;
  }
  const fallbackKey = cpuDecisionKey(fallback.decision);
  const challenger = terminalRanked.find(
    (selection) =>
      cpuDecisionKey(selection.candidate.decision) !== fallbackKey &&
      isWhiteMirrorEnemyFrontFocusStripAttackSelection(state, selection.candidate),
  );
  if (!challenger) {
    return undefined;
  }
  const rootScoreGap = fallback.totalScore - challenger.candidate.totalScore;
  const minRootScoreGap =
    config.terminalPlanRolloutFrontFocusStripAttackMinRootScoreGap ??
    config.terminalPlanRolloutTriggerMinRootScoreGap ??
    120;
  const maxRootScoreGap = config.terminalPlanRolloutFrontFocusStripAttackMaxRootScoreGap ?? 320;
  return rootScoreGap >= minRootScoreGap && rootScoreGap <= maxRootScoreGap ? challenger : undefined;
}

function terminalPlanShieldTargetTieRolloutTriggerSelection(
  state: GameState,
  perspective: PlayerId,
  terminalRanked: readonly TerminalPlanSelection[],
  config: CpuAiProfileConfig,
): TerminalPlanSelection | undefined {
  if (!isWhiteMirrorState(state, perspective) || !config.terminalPlanRolloutAllowShieldTargetTie) {
    return undefined;
  }
  const best = terminalRanked[0];
  if (!best || !isShieldDecision(best.candidate.decision)) {
    return undefined;
  }
  return isWhiteMirrorShieldTargetTieRolloutTrigger(state, perspective, terminalRanked, best, config)
    ? best
    : undefined;
}

function isWhiteMirrorShieldTargetTieRolloutTrigger(
  state: GameState,
  perspective: PlayerId,
  terminalRanked: readonly TerminalPlanSelection[],
  trigger: TerminalPlanSelection,
  config: CpuAiProfileConfig,
): boolean {
  if (!isWhiteMirrorState(state, perspective) || !config.terminalPlanRolloutAllowShieldTargetTie) {
    return false;
  }
  const triggerDecision = trigger.candidate.decision;
  if (!isShieldDecision(triggerDecision) || triggerDecision.target.kind !== "monster") {
    return false;
  }
  if (trigger.candidate.after.players[perspective].stones > 1) {
    return false;
  }
  const triggerTargetSlotKey = triggerDecision.target.slotKey;
  const maxRootGap = config.terminalPlanRolloutShieldTargetTieMaxRootScoreGap ?? 12;
  return terminalRanked.some((selection) => {
    const decision = selection.candidate.decision;
    return (
      selection.candidate.index !== trigger.candidate.index &&
      isShieldDecision(decision) &&
      decision.target.kind === "monster" &&
      decision.target.slotKey !== triggerTargetSlotKey &&
      trigger.candidate.totalScore - selection.candidate.totalScore <= maxRootGap
    );
  });
}

function isShieldDecision(decision: CpuDecision): decision is Extract<CpuDecision, { type: "master_action" }> {
  return decision.type === "master_action" && decision.actionId === "shield";
}

function shouldSkipTerminalPlanRootForShieldOnlyRoot(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  fallback: EvaluatedDecision | undefined,
): boolean {
  if (
    !fallback ||
    !isWhiteMirrorState(state, perspective) ||
    !isShieldDecision(fallback.decision) ||
    fallback.decision.target.kind !== "monster"
  ) {
    return false;
  }
  const fallbackTargetSlot = state.slots[fallback.decision.target.slotKey];
  if (fallbackTargetSlot.owner !== perspective || !fallbackTargetSlot.monster) {
    return false;
  }

  const baselineScore = evaluateState(state, perspective, config.weights);
  const context = createTerminalPlanEvaluationContext(baselineScore);
  const rootCandidates = withWhiteMirrorHoldFallbackCandidates(
    state,
    perspective,
    config,
    terminalPlanRootCandidates(state, perspective, config, context),
    fallback,
  ).filter((candidate) => candidate.decision.type !== "end_turn");

  return rootCandidates.length > 0 && rootCandidates.every((candidate) => {
    const decision = candidate.decision;
    if (!isShieldDecision(decision) || decision.target.kind !== "monster") {
      return false;
    }
    const targetSlot = state.slots[decision.target.slotKey];
    return targetSlot.owner === perspective && !!targetSlot.monster;
  });
}

function selectWhiteMirrorShieldHoldEndTurnDecision(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  fallback: EvaluatedDecision | undefined,
  evaluated: readonly EvaluatedDecision[],
): CpuDecision | undefined {
  if (
    !config.terminalPlanAllowShieldHoldEndTurn ||
    !fallback ||
    !isWhiteMirrorShieldHoldEndTurnFallback(state, perspective, fallback)
  ) {
    return undefined;
  }
  if (fallback.after.players[perspective].stones > 1) {
    return undefined;
  }
  const opponent = opponentOf(perspective);
  if (state.players[perspective].masterHp >= state.players[opponent].masterHp) {
    return undefined;
  }

  const endTurn = evaluated.find((candidate) => candidate.decision.type === "end_turn");
  if (!endTurn) {
    return undefined;
  }
  const rootGap = fallback.totalScore - endTurn.totalScore;
  if (rootGap > 300) {
    return undefined;
  }
  return {
    ...endTurn.decision,
    reason:
      `${endTurn.decision.reason} / 白ミラー終盤: ` +
      "盾で石が1以下になり山札raceの詰めを落とすため見送り",
  };
}

function selectWhiteMirrorMidgameOverprotectShieldHoldEndTurnDecision(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision | undefined,
  evaluated: readonly EvaluatedDecision[],
): CpuDecision | undefined {
  if (!fallback || !isWhiteMirrorMidgameOverprotectShieldFallback(state, perspective, fallback)) {
    return undefined;
  }

  const endTurn = evaluated.find((candidate) => candidate.decision.type === "end_turn");
  if (!endTurn) {
    return undefined;
  }

  const rootGap = fallback.totalScore - endTurn.totalScore;
  if (rootGap > 320) {
    return undefined;
  }

  return {
    ...endTurn.decision,
    reason:
      `${endTurn.decision.reason} / 白ミラー中盤: ` +
      "最大レベル前衛への過保護な盾で石と次ターンの柔軟性を落とすため見送り",
  };
}

function isWhiteMirrorMidgameOverprotectShieldFallback(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision,
): boolean {
  if (
    !isWhiteMirrorState(state, perspective) ||
    state.turnNumber < 10 ||
    state.turnNumber > 13 ||
    !isShieldDecision(fallback.decision) ||
    fallback.decision.target.kind !== "monster" ||
    fallback.after.winner ||
    fallback.after.pendingLevelUp
  ) {
    return false;
  }

  const opponent = opponentOf(perspective);
  const own = state.players[perspective];
  const enemy = state.players[opponent];
  if (
    own.masterHp < enemy.masterHp ||
    enemy.masterHp > 7 ||
    enemy.stones > 3 ||
    own.stones < 5 ||
    fallback.after.players[perspective].stones < 5
  ) {
    return false;
  }

  const targetSlotKey = fallback.decision.target.slotKey;
  const targetSlot = state.slots[targetSlotKey];
  const target = targetSlot.monster;
  if (
    targetSlot.owner !== perspective ||
    targetSlot.row !== "front" ||
    !target ||
    target.owner !== perspective ||
    target.shielded ||
    target.level < getMonsterDef(target.cardId).maxLevel ||
    getMonsterAiTrait(target.cardId).role !== "front"
  ) {
    return false;
  }

  const threat = incomingThreat(state, targetSlotKey);
  if (isLethalIncomingThreat(threat) || maxIncomingThreatDamage(threat) >= target.hp) {
    return false;
  }

  const masterThreat = buildThreatModel(state, opponent).masterDamage[perspective];
  return masterThreat < own.masterHp;
}

function selectWhiteMirrorEarlyShieldTargetQualityDecision(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision | undefined,
  evaluated: readonly EvaluatedDecision[],
): CpuDecision | undefined {
  if (!fallback || !isWhiteMirrorEarlyShieldTargetQualityFallback(state, perspective, fallback)) {
    return undefined;
  }

  const betterTarget = evaluated
    .filter((candidate) => isWhiteMirrorEarlyShieldTargetQualityCandidate(state, perspective, fallback, candidate))
    .sort(
      (a, b) =>
        whiteMirrorEarlyShieldTargetQualityScore(state, perspective, b) -
          whiteMirrorEarlyShieldTargetQualityScore(state, perspective, a) ||
        b.totalScore - a.totalScore ||
        compareTieBreak(a.decision, b.decision, a.index, b.index),
    )[0];
  if (!betterTarget) {
    return undefined;
  }

  return {
    ...betterTarget.decision,
    reason:
      `${betterTarget.decision.reason} / 白ミラー序盤: ` +
      "耐久十分な前衛より、次ターン以降の制圧源になる複数行動前衛を盾対象にする",
  };
}

function isWhiteMirrorEarlyShieldTargetQualityFallback(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision,
): boolean {
  if (
    !isWhiteMirrorState(state, perspective) ||
    state.turnNumber < 2 ||
    state.turnNumber > 4 ||
    !isShieldDecision(fallback.decision) ||
    fallback.decision.target.kind !== "monster" ||
    fallback.after.winner ||
    fallback.after.pendingLevelUp ||
    state.players[perspective].stones > 2 ||
    state.players[opponentOf(perspective)].stones > 1 ||
    fallback.after.players[perspective].stones > 0 ||
    currentTurnSpentMonsterActionCount(state, perspective) < 2 ||
    !hasPreparedMultiActionBackline(state, perspective)
  ) {
    return false;
  }

  const targetSlot = state.slots[fallback.decision.target.slotKey];
  const target = targetSlot.monster;
  return !!(
    targetSlot.owner === perspective &&
    targetSlot.row === "front" &&
    target &&
    target.owner === perspective &&
    !target.shielded &&
    target.hp >= 5 &&
    target.focused &&
    target.actionCount >= target.actionLimit
  );
}

function hasPreparedMultiActionBackline(state: GameState, perspective: PlayerId): boolean {
  return Object.values(state.slots).some((slot) => {
    const monster = slot.monster;
    return !!(
      slot.owner === perspective &&
      slot.row === "back" &&
      monster &&
      monster.owner === perspective &&
      monster.status === "prepared" &&
      monster.actionLimit > 1
    );
  });
}

function isWhiteMirrorEarlyShieldTargetQualityCandidate(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision,
  candidate: EvaluatedDecision,
): boolean {
  const decision = candidate.decision;
  const fallbackDecision = fallback.decision;
  if (
    !isShieldDecision(decision) ||
    !isShieldDecision(fallbackDecision) ||
    decision.target.kind !== "monster" ||
    fallbackDecision.target.kind !== "monster" ||
    decision.target.slotKey === fallbackDecision.target.slotKey ||
    fallback.totalScore - candidate.totalScore > 24
  ) {
    return false;
  }

  const targetSlot = state.slots[decision.target.slotKey];
  const target = targetSlot.monster;
  return !!(
    targetSlot.owner === perspective &&
    targetSlot.row === "front" &&
    target &&
    target.owner === perspective &&
    !target.shielded &&
    target.hp <= 3 &&
    target.actionLimit > 1 &&
    target.actionCount >= target.actionLimit
  );
}

function whiteMirrorEarlyShieldTargetQualityScore(
  state: GameState,
  perspective: PlayerId,
  candidate: EvaluatedDecision,
): number {
  const decision = candidate.decision;
  if (!isShieldDecision(decision) || decision.target.kind !== "monster") {
    return Number.NEGATIVE_INFINITY;
  }
  const target = state.slots[decision.target.slotKey].monster;
  if (!target || target.owner !== perspective) {
    return Number.NEGATIVE_INFINITY;
  }
  return (
    candidate.totalScore +
    target.actionLimit * 42 +
    Math.max(0, 4 - target.hp) * 35 +
    target.level * 18
  );
}

function selectWhiteMirrorBacklineMoveBeforeBackSummonDecision(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision | undefined,
  evaluated: readonly EvaluatedDecision[],
): CpuDecision | undefined {
  if (!fallback || !isWhiteMirrorBacklineMoveBeforeBackSummonFallback(state, perspective, fallback)) {
    return undefined;
  }

  const move = evaluated
    .filter((candidate) => isWhiteMirrorBacklineMoveBeforeBackSummonCandidate(state, perspective, candidate))
    .sort(
      (a, b) =>
        b.totalScore - a.totalScore || compareTieBreak(a.decision, b.decision, a.index, b.index),
    )[0];
  if (!move) {
    return undefined;
  }

  const rootGap = fallback.totalScore - move.totalScore;
  if (rootGap > 140) {
    return undefined;
  }

  return {
    ...move.decision,
    reason:
      `${move.decision.reason} / 白ミラー中盤: ` +
      "最後の後列枠を埋める前に行動可能な後衛を前へ出して盤面を広げる",
  };
}

function isWhiteMirrorBacklineMoveBeforeBackSummonFallback(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision,
): boolean {
  if (
    !isWhiteMirrorState(state, perspective) ||
    state.turnNumber < 9 ||
    state.turnNumber > 12 ||
    fallback.decision.type !== "summon" ||
    fallback.after.winner ||
    fallback.after.pendingLevelUp ||
    summonWakeCreatesImmediateWork(state, fallback.decision.handInstanceId, fallback.decision.slotKey) ||
    emptyBackSlotCountForPlayer(state, perspective) !== 1 ||
    emptyBackSlotCountForPlayer(fallback.after, perspective) !== 0
  ) {
    return false;
  }

  const opponent = opponentOf(perspective);
  if (
    state.players[perspective].masterHp < state.players[opponent].masterHp ||
    state.players[opponent].stones > 3
  ) {
    return false;
  }

  const summonSlot = state.slots[fallback.decision.slotKey];
  return summonSlot.owner === perspective && summonSlot.row === "back" && !summonSlot.monster;
}

function isWhiteMirrorBacklineMoveBeforeBackSummonCandidate(
  state: GameState,
  perspective: PlayerId,
  candidate: EvaluatedDecision,
): boolean {
  const decision = candidate.decision;
  if (decision.type !== "move" || emptyBackSlotCountForPlayer(candidate.after, perspective) <= 0) {
    return false;
  }

  const fromSlot = state.slots[decision.fromSlotKey];
  const toSlot = state.slots[decision.toSlotKey];
  const mover = fromSlot.monster;
  const displaced = toSlot.monster;
  if (
    fromSlot.owner !== perspective ||
    toSlot.owner !== perspective ||
    fromSlot.row !== "back" ||
    toSlot.row !== "front" ||
    !mover ||
    mover.owner !== perspective ||
    mover.status !== "active" ||
    mover.actionCount >= mover.actionLimit ||
    !displaced ||
    displaced.owner !== perspective ||
    isMaxLevelFrontAce(displaced)
  ) {
    return false;
  }

  const movedSlotKey = findMonsterSlot(candidate.after, mover.instanceId);
  if (!movedSlotKey || candidate.after.slots[movedSlotKey].row !== "front") {
    return false;
  }

  return mover.actionLimit > 1 || bestAttackOpportunityScore(candidate.after, movedSlotKey) > 0;
}

function selectWhiteMirrorFrontReachRetreatBeforeBackSummonDecision(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision | undefined,
  evaluated: readonly EvaluatedDecision[],
): CpuDecision | undefined {
  if (!fallback || !isWhiteMirrorFrontReachRetreatBeforeBackSummonFallback(state, perspective, fallback)) {
    return undefined;
  }

  const move = evaluated
    .filter((candidate) =>
      isWhiteMirrorFrontReachRetreatBeforeBackSummonCandidate(state, perspective, candidate),
    )
    .sort(
      (a, b) =>
        b.totalScore - a.totalScore || compareTieBreak(a.decision, b.decision, a.index, b.index),
    )[0];
  if (!move) {
    return undefined;
  }

  const rootGap = fallback.totalScore - move.totalScore;
  if (rootGap > 120) {
    return undefined;
  }

  return {
    ...move.decision,
    reason:
      `${move.decision.reason} / 白ミラー中盤: ` +
      "後列枠を召喚で埋める前に射程持ち前衛を下げ、Lv3主軸の横の仕事を残す",
  };
}

function isWhiteMirrorFrontReachRetreatBeforeBackSummonFallback(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision,
): boolean {
  if (
    !isWhiteMirrorState(state, perspective) ||
    state.turnNumber < 10 ||
    state.turnNumber > 14 ||
    fallback.decision.type !== "summon" ||
    fallback.after.winner ||
    fallback.after.pendingLevelUp ||
    emptyBackSlotCountForPlayer(state, perspective) !== 1 ||
    emptyBackSlotCountForPlayer(fallback.after, perspective) !== 0 ||
    summonWakeCreatesImmediateWork(state, fallback.decision.handInstanceId, fallback.decision.slotKey) ||
    !hasReadyMaxLevelFrontAce(state, perspective)
  ) {
    return false;
  }

  const opponent = opponentOf(perspective);
  if (
    state.players[perspective].stones < 5 ||
    state.players[perspective].masterHp < state.players[opponent].masterHp ||
    state.players[opponent].masterHp > 8
  ) {
    return false;
  }

  const summonSlot = state.slots[fallback.decision.slotKey];
  return summonSlot.owner === perspective && summonSlot.row === "back" && !summonSlot.monster;
}

function isWhiteMirrorFrontReachRetreatBeforeBackSummonCandidate(
  state: GameState,
  perspective: PlayerId,
  candidate: EvaluatedDecision,
): boolean {
  const decision = candidate.decision;
  if (decision.type !== "move") {
    return false;
  }

  const fromSlot = state.slots[decision.fromSlotKey];
  const toSlot = state.slots[decision.toSlotKey];
  const mover = fromSlot.monster;
  if (
    fromSlot.owner !== perspective ||
    toSlot.owner !== perspective ||
    fromSlot.row !== "front" ||
    toSlot.row !== "back" ||
    toSlot.monster ||
    !mover ||
    mover.owner !== perspective ||
    mover.status !== "active" ||
    mover.actionCount >= mover.actionLimit ||
    isMaxLevelFrontAce(mover) ||
    !hasReadyMaxLevelFrontAce(state, perspective, mover.instanceId)
  ) {
    return false;
  }

  const reachesFromBack =
    getMonsterAiTrait(mover.cardId).role === "back" ||
    mover.actionLimit > 1 ||
    monsterHasBacklineAttackPattern(mover.cardId);
  if (!reachesFromBack) {
    return false;
  }

  const movedSlotKey = findMonsterSlot(candidate.after, mover.instanceId);
  if (!movedSlotKey || candidate.after.slots[movedSlotKey].row !== "back") {
    return false;
  }

  return bestAttackOpportunityScore(candidate.after, movedSlotKey) > 0 ||
    enemyReadyBacklineThreatCount(state, perspective) >= 2 ||
    enemyLeveledFrontThreatCount(state, perspective) >= 1;
}

function isMaxLevelFrontAce(monster: MonsterState): boolean {
  const def = getMonsterDef(monster.cardId);
  return getMonsterAiTrait(monster.cardId).role === "front" && def.maxLevel >= 3 && monster.level >= def.maxLevel;
}

function hasReadyMaxLevelFrontAce(
  state: GameState,
  perspective: PlayerId,
  excludeInstanceId?: string,
): boolean {
  return FIELD_ORDER_BY_PLAYER[perspective].some((slotKey) => {
    const slot = state.slots[slotKey];
    const monster = slot.monster;
    return (
      slot.row === "front" &&
      !!monster &&
      monster.owner === perspective &&
      monster.instanceId !== excludeInstanceId &&
      monster.status === "active" &&
      monster.hp >= 4 &&
      isMaxLevelFrontAce(monster)
    );
  });
}

function enemyReadyBacklineThreatCount(state: GameState, perspective: PlayerId): number {
  const opponent = opponentOf(perspective);
  return FIELD_ORDER_BY_PLAYER[opponent].filter((slotKey) => {
    const slot = state.slots[slotKey];
    const monster = slot.monster;
    if (
      slot.row !== "back" ||
      !monster ||
      monster.owner !== opponent ||
      monster.status !== "active"
    ) {
      return false;
    }
    return getMonsterAiTrait(monster.cardId).role === "back" ||
      monster.actionLimit > 1 ||
      monsterHasBacklineAttackPattern(monster.cardId);
  }).length;
}

function enemyLeveledFrontThreatCount(state: GameState, perspective: PlayerId): number {
  const opponent = opponentOf(perspective);
  return FIELD_ORDER_BY_PLAYER[opponent].filter((slotKey) => {
    const slot = state.slots[slotKey];
    const monster = slot.monster;
    return (
      slot.row === "front" &&
      !!monster &&
      monster.owner === opponent &&
      monster.status === "active" &&
      monster.level >= 2 &&
      monster.hp >= 3
    );
  }).length;
}

function selectWhiteMirrorFrontGuardBeforeLowChipDecision(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision | undefined,
  evaluated: readonly EvaluatedDecision[],
): CpuDecision | undefined {
  if (!fallback || !isWhiteMirrorFrontGuardBeforeLowChipFallback(state, perspective, fallback)) {
    return undefined;
  }

  const frontSummon = evaluated
    .filter((candidate) => isWhiteMirrorFrontGuardBeforeLowChipCandidate(state, perspective, candidate))
    .sort(
      (a, b) =>
        b.totalScore - a.totalScore || compareTieBreak(a.decision, b.decision, a.index, b.index),
    )[0];
  if (!frontSummon) {
    return undefined;
  }

  const rootGap = fallback.totalScore - frontSummon.totalScore;
  if (rootGap > 145) {
    return undefined;
  }

  return {
    ...frontSummon.decision,
    reason:
      `${frontSummon.decision.reason} / 白ミラー中盤: ` +
      "低変換の削りより前列ガードを先に作り、相手の高レベル展開を遅らせる",
  };
}

function isWhiteMirrorFrontGuardBeforeLowChipFallback(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision,
): boolean {
  const decision = fallback.decision;
  if (
    !isWhiteMirrorState(state, perspective) ||
    state.turnNumber < 10 ||
    state.turnNumber > 12 ||
    decision.type !== "attack" ||
    decision.action.target.kind !== "monster" ||
    fallback.after.winner ||
    fallback.after.pendingLevelUp ||
    state.players[perspective].stones < 5 ||
    state.players[opponentOf(perspective)].stones > 1 ||
    state.players[perspective].masterHp < state.players[opponentOf(perspective)].masterHp + 1 ||
    enemyReadyBacklineThreatCount(state, perspective) <= 0 ||
    enemyLeveledFrontThreatCount(state, perspective) <= 0
  ) {
    return false;
  }

  const attackerSlot = state.slots[decision.action.attackerSlotKey];
  const attacker = attackerSlot.monster;
  const targetSlotKey = decision.action.target.slotKey;
  const targetBefore = state.slots[targetSlotKey].monster;
  const targetAfter = fallback.after.slots[targetSlotKey].monster;
  if (
    !attacker ||
    attacker.owner !== perspective ||
    attackerSlot.owner !== perspective ||
    !targetBefore ||
    targetBefore.owner !== opponentOf(perspective) ||
    !targetAfter ||
    targetAfter.owner !== targetBefore.owner ||
    targetAfter.instanceId !== targetBefore.instanceId ||
    targetAfter.hp >= targetBefore.hp ||
    removesEnemyMonster(state, fallback.after, targetSlotKey, perspective) ||
    targetAfter.hp <= 3
  ) {
    return false;
  }

  return attackerSlot.row === "back" || attacker.actionLimit > 1 || getMonsterAiTrait(attacker.cardId).role === "back";
}

function isWhiteMirrorFrontGuardBeforeLowChipCandidate(
  state: GameState,
  perspective: PlayerId,
  candidate: EvaluatedDecision,
): boolean {
  const decision = candidate.decision;
  if (decision.type !== "summon" || summonWakeCreatesImmediateWork(state, decision.handInstanceId, decision.slotKey)) {
    return false;
  }

  const beforeSlot = state.slots[decision.slotKey];
  const afterSlot = candidate.after.slots[decision.slotKey];
  const summoned = afterSlot.monster;
  if (
    beforeSlot.owner !== perspective ||
    beforeSlot.row !== "front" ||
    beforeSlot.monster ||
    !summoned ||
    summoned.owner !== perspective
  ) {
    return false;
  }

  const trait = getMonsterAiTrait(summoned.cardId);
  return trait.role === "front" || summoned.hp >= 5;
}

function selectWhiteMirrorBackThreatAttackBeforeRetreatDecision(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision | undefined,
  evaluated: readonly EvaluatedDecision[],
): CpuDecision | undefined {
  if (!fallback || !isWhiteMirrorBackThreatRetreatFallback(state, perspective, fallback)) {
    return undefined;
  }

  const attack = evaluated
    .filter((candidate) =>
      isWhiteMirrorBackThreatAttackCandidate(state, fallback.after, perspective, fallback, candidate),
    )
    .sort(
      (a, b) =>
        whiteMirrorBackThreatAttackBeforeRetreatScore(state, b) -
          whiteMirrorBackThreatAttackBeforeRetreatScore(state, a) ||
        b.totalScore - a.totalScore ||
        compareTieBreak(a.decision, b.decision, a.index, b.index),
    )[0];
  if (!attack) {
    return undefined;
  }

  const rootGap = fallback.totalScore - attack.totalScore;
  if (rootGap > 260 || whiteMirrorBackThreatAttackBeforeRetreatScore(state, attack) < 180) {
    return undefined;
  }

  return {
    ...attack.decision,
    reason:
      `${attack.decision.reason} / 白ミラー中盤: ` +
      "後列へ下げて行動を使う前に高レベル後衛を削る",
  };
}

function isWhiteMirrorBackThreatRetreatFallback(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision,
): boolean {
  const decision = fallback.decision;
  if (
    !isWhiteMirrorState(state, perspective) ||
    state.turnNumber < 7 ||
    state.turnNumber > 10 ||
    decision.type !== "move" ||
    fallback.after.winner ||
    fallback.after.pendingLevelUp ||
    state.players[perspective].masterHp > state.players[opponentOf(perspective)].masterHp ||
    state.players[perspective].stones < 3
  ) {
    return false;
  }

  const fromSlot = state.slots[decision.fromSlotKey];
  const toSlot = state.slots[decision.toSlotKey];
  const mover = fromSlot.monster;
  return (
    fromSlot.owner === perspective &&
    toSlot.owner === perspective &&
    fromSlot.row === "front" &&
    toSlot.row === "back" &&
    !toSlot.monster &&
    !!mover &&
    mover.owner === perspective &&
    mover.status === "active" &&
    mover.actionCount < mover.actionLimit &&
    (getMonsterAiTrait(mover.cardId).role === "back" || mover.actionLimit > 1)
  );
}

function isWhiteMirrorBackThreatAttackCandidate(
  state: GameState,
  afterRetreat: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision,
  candidate: EvaluatedDecision,
): boolean {
  const fallbackDecision = fallback.decision;
  const decision = candidate.decision;
  if (
    fallbackDecision.type !== "move" ||
    decision.type !== "attack" ||
    decision.action.attackerSlotKey !== fallbackDecision.fromSlotKey ||
    decision.action.target.kind !== "monster"
  ) {
    return false;
  }

  const targetSlotKey = decision.action.target.slotKey;
  const targetSlot = state.slots[targetSlotKey];
  const targetBefore = targetSlot.monster;
  const targetAfter = candidate.after.slots[targetSlotKey].monster;
  if (
    targetSlot.owner !== opponentOf(perspective) ||
    targetSlot.row !== "back" ||
    !targetBefore ||
    targetBefore.owner !== opponentOf(perspective) ||
    getMonsterAiTrait(targetBefore.cardId).role !== "back" ||
    targetBefore.level < 2 ||
    !targetAfter ||
    targetAfter.owner !== targetBefore.owner ||
    targetAfter.instanceId !== targetBefore.instanceId ||
    targetAfter.hp >= targetBefore.hp
  ) {
    return false;
  }

  const movedSlotKey = findMonsterSlot(afterRetreat, state.slots[fallbackDecision.fromSlotKey].monster?.instanceId ?? "");
  if (!movedSlotKey) {
    return false;
  }
  const moverBefore = state.slots[fallbackDecision.fromSlotKey].monster;
  const moverAfter = afterRetreat.slots[movedSlotKey].monster;
  return !!moverBefore && !!moverAfter && moverAfter.actionCount > moverBefore.actionCount;
}

function whiteMirrorBackThreatAttackBeforeRetreatScore(
  state: GameState,
  candidate: EvaluatedDecision,
): number {
  const decision = candidate.decision;
  if (decision.type !== "attack" || decision.action.target.kind !== "monster") {
    return 0;
  }

  const targetSlotKey = decision.action.target.slotKey;
  const targetBefore = state.slots[targetSlotKey].monster;
  const targetAfter = candidate.after.slots[targetSlotKey].monster;
  if (!targetBefore || !targetAfter || targetAfter.hp >= targetBefore.hp) {
    return 0;
  }

  const damage = targetBefore.hp - targetAfter.hp;
  const lowHpProgress = targetAfter.hp <= 2 ? 70 : 0;
  return (
    targetBefore.level * 82 +
    damage * 42 +
    Math.min(130, monsterValue(state, targetSlotKey) * 0.32) +
    lowHpProgress
  );
}

function selectWhiteMirrorEarlyHoldEndTurnDecision(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision | undefined,
  evaluated: readonly EvaluatedDecision[],
): CpuDecision | undefined {
  if (
    !fallback ||
    !isWhiteMirrorState(state, perspective) ||
    state.turnNumber > WHITE_MIRROR_EARLY_HOLD_TURN_TO ||
    state.players[perspective].stones < 3 ||
    state.players[opponentOf(perspective)].stones > 1 ||
    currentTurnSpentMonsterActionCount(state, perspective) <= 0 ||
    frontMonsterCountForPlayer(state, perspective) < 2 ||
    frontMonsterCountForPlayer(state, opponentOf(perspective)) < 2 ||
    fallback.decision.type === "end_turn" ||
    !isWhiteMirrorEarlyHoldSetupDecision(state, fallback, perspective)
  ) {
    return undefined;
  }

  const endTurn = evaluated.find((candidate) => candidate.decision.type === "end_turn");
  if (
    !endTurn ||
    endTurn.totalScore < WHITE_MIRROR_EARLY_HOLD_MIN_END_TURN_SCORE ||
    fallback.totalScore - endTurn.totalScore > WHITE_MIRROR_EARLY_HOLD_MAX_ROOT_GAP
  ) {
    return undefined;
  }

  const strongerActions = evaluated.filter(
    (candidate) =>
      candidate.decision.type !== "end_turn" &&
      candidate.totalScore > endTurn.totalScore &&
      fallback.totalScore - candidate.totalScore <= WHITE_MIRROR_EARLY_HOLD_MAX_ROOT_GAP,
  );
  const hasOnlyLowConversionSetup = strongerActions.every((candidate) =>
    isWhiteMirrorEarlyHoldSetupDecision(state, candidate, perspective),
  );
  if (strongerActions.length === 0 || !hasOnlyLowConversionSetup) {
    return undefined;
  }

  return {
    ...endTurn.decision,
    reason:
      `${endTurn.decision.reason} / 白ミラー序盤: ` +
      "前衛の仕事後に残りが低変換セットアップのみで、相手石が少ないため石と陣形を温存",
  };
}

function isWhiteMirrorEarlyHoldSetupDecision(
  state: GameState,
  candidate: EvaluatedDecision,
  perspective: PlayerId,
): boolean {
  if (
    candidate.after.winner ||
    candidate.after.pendingLevelUp ||
    masterDamageFromTransition(state, candidate.after, perspective) > 0
  ) {
    return false;
  }

  const decision = candidate.decision;
  if (decision.type === "focus") {
    const slot = state.slots[decision.slotKey];
    const monster = slot.monster;
    return !!(
      monster &&
      monster.owner === perspective &&
      slot.row === "back" &&
      getMonsterAiTrait(monster.cardId).role !== "back"
    );
  }

  if (decision.type !== "magic" || !isRotationMagicDecision(state, perspective, decision)) {
    return false;
  }
  const spentStones = state.players[perspective].stones - candidate.after.players[perspective].stones;
  return (
    decision.action.target.kind === "master" &&
    decision.action.target.playerId === perspective &&
    spentStones >= 3 &&
    candidate.after.players[perspective].stones <= 0
  );
}

function selectShieldTargetTieRootDecision(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  options: CpuAiOptions,
  fallback: EvaluatedDecision | undefined,
  evaluated: readonly EvaluatedDecision[],
): CpuDecision | undefined {
  if (
    !fallback ||
    !isWhiteMirrorState(state, perspective) ||
    !config.terminalPlanRolloutAllowShieldTargetTie ||
    !isShieldDecision(fallback.decision)
  ) {
    return undefined;
  }
  if (fallback.after.players[perspective].stones > 1) {
    return undefined;
  }

  const closeShieldCandidates = closeShieldTargetTieCandidates(evaluated, fallback, config);
  if (closeShieldCandidates.length < 2) {
    return undefined;
  }

  const maxSteps = Math.trunc(config.terminalPlanRolloutShieldTargetTieSteps ?? 16);
  const rolloutWeight = config.terminalPlanRolloutWeight ?? 0;
  if (maxSteps <= 0 || rolloutWeight <= 0) {
    return undefined;
  }

  const rolloutOptions = withoutTerminalPlanRolloutOptions(options, "strong", true);
  const scored = closeShieldCandidates
    .map((candidate) => {
      const rollout = evaluateTerminalPlanHandoffRollout(
        candidate.after,
        state.turnNumber,
        perspective,
        maxSteps,
        rolloutOptions,
        config,
      );
      return {
        candidate,
        rollout,
        score: candidate.totalScore + clampNumber(rollout.score, -1_000, 1_000) * rolloutWeight,
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.candidate.totalScore - a.candidate.totalScore ||
        compareTieBreak(a.candidate.decision, b.candidate.decision, a.candidate.index, b.candidate.index),
    );
  const best = scored[0];
  if (!best || best.candidate.index === fallback.index) {
    return undefined;
  }
  const fallbackScore = scored.find((entry) => entry.candidate.index === fallback.index)?.score;
  const margin = fallbackScore === undefined ? 0 : best.score - fallbackScore;
  if (margin < 4) {
    return undefined;
  }
  return {
    ...best.candidate.decision,
    reason:
      `${best.candidate.decision.reason} / 盾対象応答評価: ` +
      `次自ターン${Math.round(best.rollout.score)}点、fallback比${Math.round(margin)}点差`,
  };
}

function closeShieldTargetTieCandidates(
  evaluated: readonly EvaluatedDecision[],
  fallback: EvaluatedDecision,
  config: CpuAiProfileConfig,
): EvaluatedDecision[] {
  if (!isShieldDecision(fallback.decision) || fallback.decision.target.kind !== "monster") {
    return [];
  }
  const maxRootGap = config.terminalPlanRolloutShieldTargetTieMaxRootScoreGap ?? 12;
  const candidates = evaluated.filter((candidate) => {
    const decision = candidate.decision;
    return (
      isShieldDecision(decision) &&
      decision.target.kind === "monster" &&
      fallback.totalScore - candidate.totalScore <= maxRootGap
    );
  });
  const targetSlots = new Set(
    candidates
      .map((candidate) => candidate.decision)
      .filter((decision): decision is Extract<CpuDecision, { type: "master_action" }> => isShieldDecision(decision))
      .map((decision) => decision.target)
      .filter((target): target is Extract<Target, { kind: "monster" }> => target.kind === "monster")
      .map((target) => target.slotKey),
  );
  return targetSlots.size >= 2 ? candidates : [];
}

function isBacklineReachSummonDecision(state: GameState, decision: CpuDecision): boolean {
  if (decision.type !== "summon") {
    return false;
  }
  const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === decision.handInstanceId);
  return !!card && monsterHasBacklineAttackPattern(card.cardId);
}

function isWhiteMirrorEnemyFrontFocusStripAttackSelection(state: GameState, candidate: EvaluatedDecision): boolean {
  const decision = candidate.decision;
  if (
    decision.type !== "attack" ||
    decision.action.target.kind !== "monster" ||
    !isWhiteMirrorState(state, state.currentPlayer) ||
    state.slots[decision.action.target.slotKey].row !== "front"
  ) {
    return false;
  }
  const targetBefore = state.slots[decision.action.target.slotKey].monster;
  const targetAfter = candidate.after.slots[decision.action.target.slotKey].monster;
  return (
    !!targetBefore &&
    !!targetAfter &&
    targetBefore.owner === opponentOf(state.currentPlayer) &&
    targetAfter.owner === targetBefore.owner &&
    targetAfter.instanceId === targetBefore.instanceId &&
    targetAfter.hp < targetBefore.hp &&
    targetBefore.focused &&
    !targetAfter.focused
  );
}

function evaluateTerminalPlanRollout(
  state: GameState,
  perspective: PlayerId,
  maxSteps: number,
  options: CpuAiOptions,
  config: CpuAiProfileConfig,
): TerminalPlanRolloutResult {
  let current = state;
  let steps = 1;
  while (!current.winner && steps < maxSteps && current.turnNumber < 120) {
    current = runAutoStep(current, options);
    steps += 1;
  }
  const opponent = opponentOf(perspective);
  const score = current.winner === perspective
    ? 1_000_000
    : current.winner === opponent
      ? -1_000_000
      : evaluateState(current, perspective, config.weights);
  return {
    score,
    steps,
    ...(current.winner ? { winner: current.winner } : {}),
    ...(current.winner ? { winnerProfile: resolveRolloutWinnerProfile(current.winner, options) } : {}),
  };
}

function evaluateTerminalPlanHandoffRollout(
  state: GameState,
  rootTurnNumber: number,
  perspective: PlayerId,
  maxSteps: number,
  options: CpuAiOptions,
  config: CpuAiProfileConfig,
): TerminalPlanRolloutResult {
  let current = state;
  let steps = 1;
  while (
    !current.winner &&
    steps < maxSteps &&
    current.turnNumber < 120 &&
    !(current.currentPlayer === perspective && current.turnNumber > rootTurnNumber)
  ) {
    current = runAutoStep(current, options);
    steps += 1;
  }
  const opponent = opponentOf(perspective);
  const score = current.winner === perspective
    ? 1_000_000
    : current.winner === opponent
      ? -1_000_000
      : evaluateState(current, perspective, config.weights);
  return {
    score,
    steps,
    ...(current.winner ? { winner: current.winner } : {}),
    ...(current.winner ? { winnerProfile: resolveRolloutWinnerProfile(current.winner, options) } : {}),
  };
}

function withoutTerminalPlanRolloutOptions(
  options: CpuAiOptions,
  plannerProfileOverride?: CpuAiProfile,
  overrideWhiteProfiles = false,
): CpuAiOptions {
  const stripSearch = (search: CpuAiSearchOptions | undefined): CpuAiSearchOptions => {
    return {
      ...(search ?? {}),
      terminalPlanRolloutSteps: 0,
      terminalPlanRolloutWeight: 0,
      terminalPlanRolloutAdoptionMinScoreGap: undefined,
    };
  };
  const profileFor = (playerId: PlayerId): CpuAiProfile | undefined => {
    const profile = options.profiles?.[playerId] ?? options.profile;
    if (
      plannerProfileOverride &&
      (profile === "white_planner" || profile === "white_rollout" || (overrideWhiteProfiles && profile === "white"))
    ) {
      return plannerProfileOverride;
    }
    return profile;
  };
  const baseSearch = stripSearch(options.search);
  return {
    ...options,
    ...(plannerProfileOverride
      ? {
          profiles: {
            player: profileFor("player") ?? "stable",
            cpu: profileFor("cpu") ?? "stable",
          },
          profile: options.profile && (options.profile === "white_planner" || options.profile === "white_rollout")
            ? plannerProfileOverride
            : options.profile,
        }
      : {}),
    search: baseSearch,
    searches: {
      player: stripSearch(options.searches?.player ?? options.search),
      cpu: stripSearch(options.searches?.cpu ?? options.search),
    },
  };
}

function resolveRolloutWinnerProfile(winner: PlayerId, options: CpuAiOptions): CpuAiProfile | undefined {
  return options.profiles?.[winner] ?? options.profile;
}

function terminalPlanRootCandidates(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  context: TerminalPlanEvaluationContext,
): EvaluatedDecision[] {
  const evaluated = evaluateImmediateCpuDecisionsCached(state, perspective, config, context);
  const width = Math.max(config.detailedWidth, config.sameTurnTerminalPlanWidth);
  const candidates = evaluated
    .filter((candidate) => candidate.decision.type !== "end_turn" && candidate.totalScore > config.beamScoreThreshold)
    .sort(
      (a, b) =>
        b.totalScore - a.totalScore || compareTieBreak(a.decision, b.decision, a.index, b.index),
    )
    .slice(0, width);
  const coveredCandidates = addTerminalPlanCoverageCandidates(state, candidates, evaluated, config);
  const endTurn = evaluated.find((candidate) => candidate.decision.type === "end_turn");
  if (endTurn && !coveredCandidates.some((candidate) => candidate.index === endTurn.index)) {
    coveredCandidates.push(endTurn);
  }
  return coveredCandidates;
}

function withWhiteMirrorHoldFallbackCandidates(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  candidates: readonly EvaluatedDecision[],
  fallback: EvaluatedDecision | undefined,
): EvaluatedDecision[] {
  if (
    !fallback ||
    !shouldAddWhiteMirrorHoldFallbackCandidate(state, perspective, config, candidates, fallback) ||
    candidates.some((candidate) => cpuDecisionKey(candidate.decision) === cpuDecisionKey(fallback.decision))
  ) {
    return [...candidates];
  }
  return [...candidates, fallback];
}

function shouldAddWhiteMirrorHoldFallbackCandidate(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  candidates: readonly EvaluatedDecision[],
  fallback: EvaluatedDecision,
): boolean {
  const hasCloseoutHold = Boolean(config.terminalPlanRolloutAllowCloseoutHoldEndTurn) &&
    isWhiteMirrorCloseoutHoldEndTurnFallback(state, perspective, fallback) &&
    candidates.some((candidate) => isWhiteMirrorCloseoutHoldEndTurnSelection(state, perspective, candidate));
  const hasLateDeckHold = Boolean(config.terminalPlanRolloutAllowLateDeckHoldEndTurn) &&
    isWhiteMirrorLateDeckHoldEndTurnFallback(state, perspective, fallback) &&
    candidates.some((candidate) => isWhiteMirrorLateDeckHoldEndTurnSelection(state, perspective, candidate));
  return hasCloseoutHold || hasLateDeckHold;
}

function withTerminalPlanReason(decision: CpuDecision, selection: TerminalPlanSelection): CpuDecision {
  const scoreText = Math.round(selection.plannerScore);
  const runnerUpText = selection.runnerUpScore === undefined
    ? ""
    : `、次点と${Math.max(0, Math.round(selection.plannerScore - selection.runnerUpScore))}点差`;
  const rolloutText = selection.rolloutScore === undefined
    ? ""
    : `、rollout ${Math.round(selection.rolloutScore)}点`;
  return {
    ...decision,
    reason: `${decision.reason} / ターンプラン探索: 返し込み最終盤面${scoreText}点${runnerUpText}${rolloutText}`,
    trace: {
      ...decision.trace,
      totalScore: selection.candidate.totalScore,
      baseScore: decision.score,
      alternatives: selection.runnerUpScore === undefined ? decision.trace?.alternatives : [
        ...(decision.trace?.alternatives ?? []),
        {
          label: "ターンプラン次点",
          totalScore: selection.runnerUpScore,
          scoreGap: Math.max(0, selection.plannerScore - selection.runnerUpScore),
        },
      ],
    },
  } as CpuDecision;
}

function shouldAdoptTerminalPlanRootSelection(
  state: GameState,
  perspective: PlayerId,
  selection: TerminalPlanSelection,
  fallback: EvaluatedDecision | undefined,
  config: CpuAiProfileConfig,
): boolean {
  if (!fallback) {
    return true;
  }
  if (cpuDecisionKey(selection.candidate.decision) === cpuDecisionKey(fallback.decision)) {
    return true;
  }

  const rootScoreGap = fallback.totalScore - selection.candidate.totalScore;
  if (isRolloutConfirmedTerminalPlanSelection(selection, config)) {
    return true;
  }
  if (shouldAdoptSetupOverFocusRootSelection(state, perspective, selection, fallback, rootScoreGap, config)) {
    return true;
  }
  if (shouldAdoptBacklineReserveSummonOverFocusSelection(state, perspective, selection, fallback, rootScoreGap)) {
    return true;
  }
  if (shouldAdoptFrontPressureEscapeOverFocusSelection(state, perspective, selection, fallback, rootScoreGap)) {
    return true;
  }
  const maxRootScoreGap = config.terminalPlanAdoptionMaxRootScoreGap ?? Number.POSITIVE_INFINITY;
  if (rootScoreGap > maxRootScoreGap) {
    return false;
  }
  if (selection.candidate.decision.type === "end_turn" && fallback.decision.type !== "end_turn" && rootScoreGap > 10) {
    return false;
  }
  if (
    config.terminalPlanRejectEndTurnOverAction &&
    selection.candidate.decision.type === "end_turn" &&
    fallback.decision.type !== "end_turn"
  ) {
    return false;
  }
  if (
    config.terminalPlanRejectSetupOverTacticalAction &&
    isPlannerSetupDecision(selection.candidate.decision) &&
    isTacticalProgressDecision(fallback.decision)
  ) {
    return false;
  }
  if (
    config.terminalPlanRequireCompatibleFallbackAction &&
    !isCompatiblePlannerOverride(selection.candidate.decision, fallback.decision)
  ) {
    return false;
  }
  if (
    config.terminalPlanRejectNonLethalFaceDamage &&
    isWhiteMirrorState(state, perspective) &&
    isNonLethalFaceDamageRoot(state, selection.candidate, perspective) &&
    !isNonLethalFaceDamageRoot(state, fallback, perspective)
  ) {
    return false;
  }

  const plannerMargin = selection.runnerUpScore === undefined
    ? Number.POSITIVE_INFINITY
    : selection.plannerScore - selection.runnerUpScore;
  return plannerMargin >= (config.terminalPlanAdoptionMinMargin ?? 0) || rootScoreGap <= 0;
}

function shouldAdoptSetupOverFocusRootSelection(
  state: GameState,
  perspective: PlayerId,
  selection: TerminalPlanSelection,
  fallback: EvaluatedDecision,
  rootScoreGap: number,
  config: CpuAiProfileConfig,
): boolean {
  if (!shouldNeutralizeSetupOverFocusRootScore(state, selection.candidate, fallback, perspective, config)) {
    return false;
  }
  const maxRootScoreGap = config.terminalPlanSetupOverFocusAdoptionMaxRootScoreGap;
  if (maxRootScoreGap === undefined || rootScoreGap > maxRootScoreGap) {
    return false;
  }
  const plannerMargin = selection.runnerUpScore === undefined
    ? Number.POSITIVE_INFINITY
    : selection.plannerScore - selection.runnerUpScore;
  return plannerMargin >= (config.terminalPlanSetupOverFocusAdoptionMinMargin ?? 0);
}

function shouldAdoptBacklineReserveSummonOverFocusSelection(
  state: GameState,
  perspective: PlayerId,
  selection: TerminalPlanSelection,
  fallback: EvaluatedDecision,
  rootScoreGap: number,
): boolean {
  if (
    fallback.decision.type !== "focus" ||
    rootScoreGap > 260 ||
    backlineReserveSummonOverFocusPlannerBonus(state, selection.candidate, fallback, perspective, selection.outcome) < 35
  ) {
    return false;
  }
  const plannerMargin = selection.runnerUpScore === undefined
    ? Number.POSITIVE_INFINITY
    : selection.plannerScore - selection.runnerUpScore;
  return plannerMargin >= 8;
}

function shouldAdoptFrontPressureEscapeOverFocusSelection(
  state: GameState,
  perspective: PlayerId,
  selection: TerminalPlanSelection,
  fallback: EvaluatedDecision,
  rootScoreGap: number,
): boolean {
  if (
    fallback.decision.type !== "focus" ||
    rootScoreGap > 280 ||
    whiteMirrorFrontPressureEscapePlannerBonus(state, selection.candidate, fallback, perspective) < 120
  ) {
    return false;
  }
  const plannerMargin = selection.runnerUpScore === undefined
    ? Number.POSITIVE_INFINITY
    : selection.plannerScore - selection.runnerUpScore;
  return plannerMargin >= 8;
}

function isRolloutConfirmedTerminalPlanSelection(
  selection: TerminalPlanSelection,
  config: CpuAiProfileConfig,
): boolean {
  const minScoreGap = config.terminalPlanRolloutAdoptionMinScoreGap;
  return (
    minScoreGap !== undefined &&
    selection.rolloutScoreGapToFallback !== undefined &&
    selection.rolloutScoreGapToFallback >= minScoreGap
  );
}

function hasAdoptedTerminalPlanRolloutThisTurn(state: GameState, perspective: PlayerId): boolean {
  return !!state.turnAiRolloutDecisionHistory?.some(
    (entry) => entry.playerId === perspective && entry.turnNumber === state.turnNumber,
  );
}

function isPlannerSetupDecision(decision: CpuDecision): boolean {
  return decision.type === "summon" || decision.type === "focus" || decision.type === "move";
}

function isTacticalProgressDecision(decision: CpuDecision): boolean {
  return decision.type === "attack" || decision.type === "magic" || decision.type === "master_action";
}

function isCompatiblePlannerOverride(plannerDecision: CpuDecision, fallbackDecision: CpuDecision): boolean {
  if (plannerDecision.type === fallbackDecision.type) {
    if (plannerDecision.type !== "master_action" || fallbackDecision.type !== "master_action") {
      return plannerDecision.type === "attack" || plannerDecision.type === "magic";
    }
    return plannerDecision.actionId === fallbackDecision.actionId && plannerDecision.actionId !== "shield";
  }
  return false;
}

function isNonLethalFaceDamageRoot(
  state: GameState,
  candidate: EvaluatedDecision | undefined,
  perspective: PlayerId,
): boolean {
  if (!candidate) {
    return false;
  }
  const opponent = opponentOf(perspective);
  const damage = state.players[opponent].masterHp - candidate.after.players[opponent].masterHp;
  if (damage <= 0 || candidate.after.winner === perspective) {
    return false;
  }
  return state.players[opponent].masterHp > 4;
}

function terminalPlanRootPlannerScore(
  candidate: EvaluatedDecision,
  outcome: TerminalPlanOutcome,
  bestRootTotalScore: number,
  rootState: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  context: TerminalPlanEvaluationContext,
  fallback: EvaluatedDecision | undefined,
): number {
  const terminalScore = evaluateTerminalPlanOutcomeWithOpponentResponse(outcome, perspective, config, context);
  const neutralizeRootScore = shouldNeutralizeSetupOverFocusRootScore(rootState, candidate, fallback, perspective, config);
  const rootWeight = neutralizeRootScore ? 0 : config.terminalPlanRootDecisionWeight ?? 0;
  const gapPenaltyWeight = neutralizeRootScore ? 0 : config.terminalPlanRootGapPenaltyWeight ?? 0;
  const gapFreeMargin = config.terminalPlanRootGapFreeMargin ?? 0;
  const rootScoreBonus = rootWeight > 0 ? clampNumber(candidate.totalScore, -180, 180) * rootWeight : 0;
  const rootGapPenalty = gapPenaltyWeight > 0
    ? Math.max(0, bestRootTotalScore - candidate.totalScore - gapFreeMargin) * gapPenaltyWeight
    : 0;
  const frontPressureEscapeBonus = whiteMirrorFrontPressureEscapePlannerBonus(
    rootState,
    candidate,
    fallback,
    perspective,
  );
  const backlineReserveSummonBonus = backlineReserveSummonOverFocusPlannerBonus(
    rootState,
    candidate,
    fallback,
    perspective,
    outcome,
  );
  return terminalScore + rootScoreBonus + frontPressureEscapeBonus + backlineReserveSummonBonus - rootGapPenalty;
}

function shouldNeutralizeSetupOverFocusRootScore(
  rootState: GameState,
  candidate: EvaluatedDecision,
  fallback: EvaluatedDecision | undefined,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
): boolean {
  const turnFrom = config.terminalPlanSetupOverFocusRootNeutralTurnFrom;
  if (turnFrom === undefined || rootState.turnNumber < turnFrom || !isWhiteMirrorState(rootState, perspective)) {
    return false;
  }
  if (fallback?.decision.type !== "focus") {
    return false;
  }
  if (ownBackRowOccupancy(rootState, perspective) > 0) {
    return false;
  }
  return candidate.index === fallback.index || candidate.decision.type === "summon";
}

function backlineReserveSummonOverFocusPlannerBonus(
  state: GameState,
  candidate: EvaluatedDecision,
  fallback: EvaluatedDecision | undefined,
  perspective: PlayerId,
  outcome?: TerminalPlanOutcome,
): number {
  const decision = candidate.decision;
  if (
    !isWhiteMirrorState(state, perspective) ||
    state.turnNumber < 5 ||
    state.turnNumber > 8 ||
    state.players[opponentOf(perspective)].stones > 1 ||
    state.players[perspective].stones < 3 ||
    fallback?.decision.type !== "focus" ||
    decision.type !== "summon"
  ) {
    return 0;
  }
  const fallbackSlot = state.slots[fallback.decision.slotKey];
  if (fallbackSlot.owner !== perspective || fallbackSlot.row !== "front") {
    return 0;
  }
  const summonSlot = state.slots[decision.slotKey];
  if (summonSlot.owner !== perspective || summonSlot.row !== "back" || summonSlot.monster) {
    return 0;
  }
  const handCard = state.players[perspective].hand.find((card) => card.instanceId === decision.handInstanceId);
  if (!handCard) {
    return 0;
  }
  const cardDef = getCardDef(handCard.cardId);
  if (cardDef.type !== "monster") {
    return 0;
  }
  const monsterDef = getMonsterDef(handCard.cardId);
  const levelOneHp = monsterDef.levels[0]?.maxHp ?? 0;
  if (levelOneHp < 5 || monsterDef.maxLevel < 2) {
    return 0;
  }
  const ownFrontCount = FIELD_ORDER_BY_PLAYER[perspective].filter((slotKey) => {
    const slot = state.slots[slotKey];
    return slot.row === "front" && slot.monster?.owner === perspective;
  }).length;
  const handoffScore = evaluateState(candidate.after, perspective, AI_EVALUATION_WEIGHTS.white) -
    evaluateState(state, perspective, AI_EVALUATION_WEIGHTS.white);
  const establishedBoardBonus = state.turnNumber >= 6 && ownFrontCount >= 2
    ? 42 + Math.max(0, levelOneHp - 5) * 8 + Math.max(0, handoffScore) * 0.05
    : 0;
  const preservedReserveBonus = preservedBacklineReserveSummonPlannerBonus(
    state,
    candidate,
    outcome,
    perspective,
    decision.slotKey,
    levelOneHp,
    fallbackSlot.monster ? getMonsterDef(fallbackSlot.monster.cardId).maxLevel : 0,
  );
  return Math.max(establishedBoardBonus, preservedReserveBonus);
}

function preservedBacklineReserveSummonPlannerBonus(
  state: GameState,
  candidate: EvaluatedDecision,
  outcome: TerminalPlanOutcome | undefined,
  perspective: PlayerId,
  summonSlotKey: SlotKey,
  levelOneHp: number,
  fallbackMaxLevel: number,
): number {
  if (!outcome || state.players[perspective].stones < 5) {
    return 0;
  }
  const opponent = opponentOf(perspective);
  const ownFrontCount = FIELD_ORDER_BY_PLAYER[perspective].filter((slotKey) => {
    const slot = state.slots[slotKey];
    return slot.row === "front" && slot.monster?.owner === perspective;
  }).length;
  const opponentFrontCount = FIELD_ORDER_BY_PLAYER[opponent].filter((slotKey) => {
    const slot = state.slots[slotKey];
    return slot.row === "front" && slot.monster?.owner === opponent;
  }).length;
  if (ownFrontCount !== 1 || opponentFrontCount < 2 || fallbackMaxLevel > 2) {
    return 0;
  }
  const summoned = candidate.after.slots[summonSlotKey].monster;
  const handoffMonster = outcome.handoffState.slots[summonSlotKey].monster;
  if (
    !summoned ||
    !handoffMonster ||
    summoned.owner !== perspective ||
    handoffMonster.owner !== perspective ||
    handoffMonster.instanceId !== summoned.instanceId
  ) {
    return 0;
  }
  const handoffSlot = outcome.handoffState.slots[summonSlotKey];
  if (handoffSlot.row !== "back" || outcome.handoffState.players[perspective].stones < 4) {
    return 0;
  }
  const preservedStones = outcome.handoffState.players[perspective].stones;
  return 92 + Math.max(0, levelOneHp - 5) * 8 + Math.max(0, preservedStones - 4) * 10;
}

function ownBackRowOccupancy(state: GameState, perspective: PlayerId): number {
  return FIELD_ORDER_BY_PLAYER[perspective].filter((slotKey) => {
    const slot = state.slots[slotKey];
    return slot.row === "back" && slot.monster?.owner === perspective;
  }).length;
}

function evaluateTerminalPlanDeltas(
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  baselineScore: number,
  candidates: readonly EvaluatedDecision[],
): Map<number, number> {
  const deltas = new Map<number, number>();
  const context = createTerminalPlanEvaluationContext(baselineScore);
  const outcomes: TerminalPlanRootOutcome[] = candidates.map((candidate) => ({
    candidate,
    outcome: evaluateSameTurnTerminalPlanOutcome(
      candidate.after,
      perspective,
      config.sameTurnTerminalPlanDepth - 1,
      config,
      context,
    ),
  }));
  const bestOwnTerminalDelta = Math.max(0, ...outcomes.map(({ outcome }) => outcome.delta));
  const opponentResponseIndexes = selectOpponentResponseRootCandidates(
    outcomes,
    bestOwnTerminalDelta,
    perspective,
    config,
  );

  for (const { candidate, outcome } of outcomes) {
    const delta = opponentResponseIndexes.has(candidate.index)
      ? evaluateTerminalPlanOutcomeWithOpponentResponse(
          outcome,
          perspective,
          config,
          context,
        )
      : outcome.delta;
    deltas.set(
      candidate.index,
      delta,
    );
  }
  return deltas;
}

function createTerminalPlanEvaluationContext(baselineScore: number): TerminalPlanEvaluationContext {
  return {
    baselineScore,
    ownOutcomeCache: new Map(),
    opponentDeltaCache: new Map(),
    handoffOutcomeCache: new Map(),
    immediateDecisionCache: new Map(),
  };
}

function selectOpponentResponseRootCandidates(
  outcomes: readonly TerminalPlanRootOutcome[],
  bestOwnTerminalDelta: number,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
): Set<number> {
  const selected = new Set<number>();
  if (
    config.sameTurnOpponentTerminalPlanWeight <= 0 ||
    config.sameTurnOpponentTerminalPlanDepth <= 0 ||
    config.sameTurnOpponentTerminalPlanWidth <= 0
  ) {
    return selected;
  }

  const isWhiteMirror = outcomes.some(({ outcome }) => isWhiteMirrorState(outcome.handoffState, perspective));
  const minRootCandidates = isWhiteMirror
    ? Math.max(OPPONENT_TERMINAL_RESPONSE_MIN_ROOT_CANDIDATES, WHITE_MIRROR_OPPONENT_RESPONSE_MIN_ROOT_CANDIDATES)
    : OPPONENT_TERMINAL_RESPONSE_MIN_ROOT_CANDIDATES;
  const rootMargin = isWhiteMirror
    ? Math.max(OPPONENT_TERMINAL_RESPONSE_ROOT_MARGIN, WHITE_MIRROR_OPPONENT_RESPONSE_ROOT_MARGIN)
    : OPPONENT_TERMINAL_RESPONSE_ROOT_MARGIN;
  const ranked = [...outcomes].sort(
    (a, b) =>
      b.outcome.delta - a.outcome.delta ||
      compareTieBreak(a.candidate.decision, b.candidate.decision, a.candidate.index, b.candidate.index),
  );
  ranked.slice(0, minRootCandidates).forEach(({ candidate }) => {
    selected.add(candidate.index);
  });
  ranked.forEach(({ candidate, outcome }) => {
    if (bestOwnTerminalDelta - outcome.delta <= rootMargin) {
      selected.add(candidate.index);
    }
  });
  return selected;
}

function terminalPlanComparisonPenalty(
  candidate: EvaluatedDecision,
  terminalPlanDeltas: ReadonlyMap<number, number>,
  bestTerminalPlanDelta: number,
  config: CpuAiProfileConfig,
): number {
  const comparisonWeight = terminalPlanComparisonWeight(config);
  if (comparisonWeight <= 0) {
    return 0;
  }
  const delta = terminalPlanDeltas.get(candidate.index);
  if (delta === undefined) {
    return 0;
  }
  return Math.max(0, bestTerminalPlanDelta - delta) * comparisonWeight;
}

function terminalPlanComparisonWeight(config: CpuAiProfileConfig): number {
  return config.sameTurnTerminalPlanComparisonWeight ?? config.sameTurnTerminalPlanWeight;
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
      decisionProfileBonus(state, after, decision, perspective, config) +
      evaluateState(after, perspective, config.weights) -
      beforeScore +
      evaluateConfiguredFutureTacticalValue(after, perspective, detailedFuture, config) -
      beforeFutureScore -
      opponentMasterDamagePlanCommitmentPenalty(state, after, decision, perspective, config.weights) +
      opponentMasterDamagePlanReductionBonus(state, after, perspective, config.weights),
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
  if (bias.whiteEnemyFrontAttackBonus) {
    bonus += whiteEnemyFrontAttackDecisionBonus(before, decision, perspective, bias.whiteEnemyFrontAttackBonus);
  }
  if (bias.whiteBlackFrontThreatBonus) {
    bonus += whiteBlackFrontThreatDecisionBonus(before, after, decision, perspective, bias.whiteBlackFrontThreatBonus);
  }
  if (bias.whiteActiveFrontWorkBonus) {
    bonus += whiteActiveFrontWorkDecisionBonus(before, after, decision, perspective, bias.whiteActiveFrontWorkBonus);
  }
  if (bias.whitePygmyFrontSetupBonus) {
    bonus += whitePygmyFrontSetupDecisionBonus(before, after, decision, perspective, bias.whitePygmyFrontSetupBonus);
  }
  if (bias.whiteStrictShieldPenalty) {
    bonus -= whiteStrictShieldDecisionPenalty(before, after, decision, perspective, bias.whiteStrictShieldPenalty);
  }
  if (bias.whiteLowStoneShieldPenalty) {
    bonus -= whiteLowStoneSetupDecisionPenalty(before, after, decision, perspective, bias.whiteLowStoneShieldPenalty, "shield");
  }
  if (bias.whiteLowStoneWakePenalty) {
    bonus -= whiteLowStoneSetupDecisionPenalty(before, after, decision, perspective, bias.whiteLowStoneWakePenalty, "wake_up");
  }
  if (bias.whiteLowStoneSummonPenalty) {
    bonus -= whiteLowStoneSetupDecisionPenalty(before, after, decision, perspective, bias.whiteLowStoneSummonPenalty, "summon");
  }
  if (bias.whiteLowStoneFocusPenalty) {
    bonus -= whiteLowStoneSetupDecisionPenalty(before, after, decision, perspective, bias.whiteLowStoneFocusPenalty, "focus");
  }
  if (bias.whiteShieldThreatConversionBonus) {
    bonus += whiteShieldThreatConversionDecisionBonus(before, after, decision, perspective, bias.whiteShieldThreatConversionBonus);
  }
  if (bias.whiteShieldBreakthroughPenalty) {
    bonus -= whiteShieldBreakthroughDecisionPenalty(before, after, decision, perspective, bias.whiteShieldBreakthroughPenalty);
  }
  if (bias.whiteShieldNoPressurePenalty) {
    bonus -= whiteShieldNoPressureDecisionPenalty(before, after, decision, perspective, bias.whiteShieldNoPressurePenalty);
  }
  if (bias.whiteShieldFrontAceBonus) {
    bonus += whiteShieldFrontAceDecisionBonus(before, after, decision, perspective, bias.whiteShieldFrontAceBonus);
  }
  if (bias.whiteWakeImmediateWorkBonus) {
    bonus += whiteWakeImmediateWorkDecisionBonus(before, after, decision, perspective, bias.whiteWakeImmediateWorkBonus);
  }
  if (bias.whiteWakeLevelUpSetupBonus) {
    bonus += whiteWakeLevelUpSetupDecisionBonus(before, after, decision, perspective, bias.whiteWakeLevelUpSetupBonus);
  }
  if (bias.whiteCloseoutAfterShieldBonus) {
    bonus += whiteCloseoutAfterShieldDecisionBonus(before, after, decision, perspective, bias.whiteCloseoutAfterShieldBonus);
  }
  if (bias.whiteSecondShieldLowStonePenalty) {
    bonus -= whiteSecondShieldLowStoneDecisionPenalty(before, after, decision, perspective, bias.whiteSecondShieldLowStonePenalty);
  }
  if (bias.whiteSecondShieldCommitmentPenalty) {
    bonus -= whiteSecondShieldCommitmentDecisionPenalty(before, after, decision, perspective, bias.whiteSecondShieldCommitmentPenalty);
  }
  if (bias.whiteLowStoneFocusConversionBonus) {
    bonus += whiteLowStoneFocusConversionDecisionBonus(before, after, decision, perspective, bias.whiteLowStoneFocusConversionBonus);
  }
  if (bias.whiteWakeSafeWorkBonus) {
    bonus += whiteWakeSafeWorkDecisionBonus(before, after, decision, perspective, bias.whiteWakeSafeWorkBonus);
  }
  if (bias.whiteLowStoneFocusMissedAttackPenalty) {
    bonus -= whiteLowStoneFocusMissedAttackDecisionPenalty(
      before,
      after,
      decision,
      perspective,
      bias.whiteLowStoneFocusMissedAttackPenalty,
    );
  }
  if (bias.whiteLowStoneNonLethalFacePenalty) {
    bonus -= whiteLowStoneNonLethalFaceDecisionPenalty(
      before,
      after,
      decision,
      perspective,
      bias.whiteLowStoneNonLethalFacePenalty,
    );
  }
  if (bias.whiteMirrorThreatenedNonLethalFacePenalty) {
    bonus -= whiteMirrorThreatenedNonLethalFaceDecisionPenalty(
      before,
      after,
      decision,
      perspective,
      bias.whiteMirrorThreatenedNonLethalFacePenalty,
    );
  }
  if (bias.whiteThreatSourceAttackBonus) {
    bonus += whiteThreatSourceAttackDecisionBonus(before, after, decision, perspective, bias.whiteThreatSourceAttackBonus);
  }
  if (bias.whiteSetupAfterThreatReductionBonus) {
    bonus += whiteSetupAfterThreatReductionDecisionBonus(
      before,
      after,
      decision,
      perspective,
      bias.whiteSetupAfterThreatReductionBonus,
    );
  }
  if (bias.whiteRedirectMarkedAttackPenalty) {
    bonus -= whiteRedirectMarkedAttackDecisionPenalty(before, after, decision, perspective, bias.whiteRedirectMarkedAttackPenalty);
  }
  if (bias.whiteThreatLeftLowStoneSetupPenalty) {
    bonus -= whiteThreatLeftLowStoneSetupDecisionPenalty(
      before,
      after,
      decision,
      perspective,
      bias.whiteThreatLeftLowStoneSetupPenalty,
    );
  }
  if (bias.whiteSafeRetreatOverShieldBonus) {
    bonus += whiteSafeRetreatOverShieldDecisionBonus(before, after, decision, perspective, bias.whiteSafeRetreatOverShieldBonus);
  }
  if (bias.whiteBoardControlMasterAttackPenalty) {
    bonus -= whiteBoardControlMasterAttackDecisionPenalty(
      before,
      after,
      decision,
      perspective,
      bias.whiteBoardControlMasterAttackPenalty,
    );
  }
  if (bias.whiteReadyBacklineRetreatPenalty) {
    bonus -= whiteReadyBacklineRetreatDecisionPenalty(before, decision, perspective, bias.whiteReadyBacklineRetreatPenalty);
  }
  if (bias.whiteDisadvantagedSummonOvercommitPenalty) {
    bonus -= whiteDisadvantagedSummonOvercommitDecisionPenalty(
      before,
      after,
      decision,
      perspective,
      bias.whiteDisadvantagedSummonOvercommitPenalty,
    );
  }
  if (bias.whiteBlockedBacklineNoWorkSummonPenalty) {
    bonus -= whiteBlockedBacklineNoWorkSummonDecisionPenalty(
      before,
      after,
      decision,
      perspective,
      bias.whiteBlockedBacklineNoWorkSummonPenalty,
    );
  }
  if (bias.whiteBlockedBacklineExposedSummonPenalty) {
    bonus -= whiteBlockedBacklineExposedSummonDecisionPenalty(
      before,
      after,
      decision,
      perspective,
      bias.whiteBlockedBacklineExposedSummonPenalty,
    );
  }
  if (bias.whiteBackSlotFutureValuePenalty) {
    bonus -= whiteBackSlotFutureValueDecisionPenalty(
      before,
      after,
      decision,
      perspective,
      bias.whiteBackSlotFutureValuePenalty,
    );
  }
  if (bias.whiteBackSlotReservationPlanBonus) {
    bonus += whiteBackSlotReservationPlanDecisionBonus(
      before,
      after,
      decision,
      perspective,
      bias.whiteBackSlotReservationPlanBonus,
    );
  }
  if (bias.whiteLowStoneBackSlotAlternativeBonus) {
    bonus += whiteLowStoneBackSlotAlternativeDecisionBonus(
      before,
      after,
      decision,
      perspective,
      bias.whiteLowStoneBackSlotAlternativeBonus,
    );
  }
  if (bias.whiteLastBackSlotNoReachSummonGuardPenalty) {
    bonus -= whiteLastBackSlotNoReachSummonGuardDecisionPenalty(
      before,
      after,
      decision,
      perspective,
      bias.whiteLastBackSlotNoReachSummonGuardPenalty,
    );
  }
  if (bias.whiteBacklineMoveBeforeSummonPenalty) {
    bonus -= whiteBacklineMoveBeforeSummonDecisionPenalty(
      before,
      after,
      decision,
      perspective,
      bias.whiteBacklineMoveBeforeSummonPenalty,
    );
  }
  if (bias.whiteLastBackSlotHoldPlanBonus) {
    bonus += whiteLastBackSlotHoldPlanDecisionBonus(
      before,
      after,
      decision,
      perspective,
      bias.whiteLastBackSlotHoldPlanBonus,
    );
  }
  if (bias.whiteDeathSheepSpecialLockPenalty) {
    bonus -= whiteDeathSheepSpecialLockDecisionPenalty(
      before,
      after,
      decision,
      perspective,
      bias.whiteDeathSheepSpecialLockPenalty,
    );
  }
  if (bias.whiteBlackUnsafeMasterAttackPenalty) {
    bonus -= whiteBlackUnsafeMasterAttackDecisionPenalty(
      before,
      after,
      decision,
      perspective,
      bias.whiteBlackUnsafeMasterAttackPenalty,
    );
  }
  if (bias.whiteFrontChipResponsePenalty) {
    bonus -= whiteFrontChipResponseDecisionPenalty(
      before,
      after,
      decision,
      perspective,
      bias.whiteFrontChipResponsePenalty,
    );
  }
  if (bias.whiteFrontThreatFocusCounterBonus) {
    bonus += whiteFrontThreatFocusCounterDecisionBonus(
      before,
      after,
      decision,
      perspective,
      bias.whiteFrontThreatFocusCounterBonus,
    );
  }
  return bonus;
}

function decisionProfileBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
): number {
  if (!config.omniscient) {
    return 0;
  }

  return omniscientBerserkTempoBonus(before, after, decision, perspective);
}

function omniscientBerserkTempoBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
): number {
  if (
    decision.type !== "master_action" ||
    decision.actionId !== "berserk_power" ||
    decision.target.kind !== "monster" ||
    before.players[perspective].masterId !== "black"
  ) {
    return 0;
  }

  const slotKey = decision.target.slotKey;
  const monster = before.slots[slotKey].monster;
  if (!monster || monster.owner !== perspective || monster.status !== "active") {
    return 0;
  }

  const beforeBest = bestAttackOpportunityScore(before, slotKey);
  const afterBest = bestAttackOpportunityScore(after, slotKey);
  const improvement = Math.max(0, afterBest - beforeBest);
  const masterDamageGain = Math.max(
    0,
    directMasterDamageFromSlotWithPowerBonus(before, slotKey, perspective, 1) -
      directMasterDamageFromSlot(before, slotKey, perspective),
  );
  if (masterDamageGain <= 0) {
    return 0;
  }

  const multiActionBonus = monster.actionLimit > 1 && afterBest >= 95 ? 14 : 0;
  return Math.min(64, masterDamageGain * 22 + improvement * 0.28 + multiActionBonus);
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

function whiteEnemyFrontAttackDecisionBonus(
  before: GameState,
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
  const targetSlot = before.slots[decision.action.target.slotKey];
  return targetSlot.row === "front" && targetSlot.monster?.owner === opponentOf(perspective) ? value : 0;
}

function whiteBlackFrontThreatDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  const targetSlotKey = whiteDamagingEnemyFrontAttackTarget(before, after, decision, perspective);
  if (!targetSlotKey || before.players[opponentOf(perspective)].masterId !== "black") {
    return 0;
  }
  return blackFrontMasterDamagePotential(before, targetSlotKey, opponentOf(perspective)) > 0 ? value : 0;
}

function whiteActiveFrontWorkDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  return whiteDamagingEnemyFrontAttackTarget(before, after, decision, perspective) ? value : 0;
}

function whitePygmyFrontSetupDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  const targetSlotKey = whiteEnemyFrontAttackTarget(before, decision, perspective);
  if (!targetSlotKey || decision.type !== "attack") {
    return 0;
  }
  const attacker = before.slots[decision.action.attackerSlotKey].monster;
  if (attacker?.cardId !== "card_051") {
    return 0;
  }
  const targetBefore = before.slots[targetSlotKey].monster;
  const targetAfter = after.slots[targetSlotKey].monster;
  if (!targetBefore || !targetAfter || targetAfter.owner !== opponentOf(perspective) || targetAfter.instanceId !== targetBefore.instanceId) {
    return 0;
  }
  if (targetAfter.hp >= targetBefore.hp) {
    return 0;
  }
  return bestAttackOpportunityScore(after, undefined, targetSlotKey) >= 300 || targetAfter.hp <= 2 ? value : 0;
}

function whiteThreatSourceAttackDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  const targetSlotKey = whiteDamagingEnemyFrontAttackTarget(before, after, decision, perspective);
  if (!targetSlotKey) {
    return 0;
  }
  return enemyFrontThreatSourcePotential(before, targetSlotKey, perspective) > 0 ? value : 0;
}

function whiteSetupAfterThreatReductionDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    after.players[perspective].stones > 1 ||
    !isSetupDecision(before, after, decision, perspective)
  ) {
    return 0;
  }
  if (currentTurnSpentMonsterActionCount(before, perspective) <= 0 || hasEnemyFrontThreatSource(before, perspective)) {
    return 0;
  }
  return value;
}

function whiteRedirectMarkedAttackDecisionPenalty(
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
  const targetSlotKey = decision.action.target.slotKey;
  const targetBefore = before.slots[targetSlotKey].monster;
  if (!targetBefore || targetBefore.owner !== opponentOf(perspective) || (!targetBefore.scapegoat && !targetBefore.provokeTargetSlotKey)) {
    return 0;
  }
  const targetAfter = after.slots[targetSlotKey].monster;
  if (!targetAfter || targetAfter.owner !== targetBefore.owner || targetAfter.instanceId !== targetBefore.instanceId) {
    return 0;
  }
  const damage = targetBefore.hp - targetAfter.hp;
  return damage <= 0 || targetAfter.hp > 2 ? value : 0;
}

function whiteThreatLeftLowStoneSetupDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    after.players[perspective].stones > 1 ||
    !isSetupDecision(before, after, decision, perspective) ||
    !hasEnemyFrontThreatSource(after, perspective)
  ) {
    return 0;
  }
  return isHighQualityThreatFacingSetup(before, after, decision, perspective) ? 0 : value;
}

function whiteSafeRetreatOverShieldDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "move" ||
    before.slots[decision.fromSlotKey].owner !== perspective ||
    before.slots[decision.fromSlotKey].row !== "front" ||
    before.slots[decision.toSlotKey].row !== "back"
  ) {
    return 0;
  }
  return isSafeBackRoleRetreat(before, after, decision.fromSlotKey, perspective) ? value : 0;
}

function whiteBoardControlMasterAttackDecisionPenalty(
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
    decision.action.target.kind !== "master" ||
    after.winner === perspective
  ) {
    return 0;
  }

  const opponent = opponentOf(perspective);
  const damage = before.players[opponent].masterHp - after.players[opponent].masterHp;
  if (damage <= 0) {
    return 0;
  }

  const boardControlScore = bestSameAttackerEnemyFrontControlScore(before, decision.action.attackerSlotKey, perspective);
  if (boardControlScore <= 0) {
    return 0;
  }

  if (before.players[opponent].masterHp <= 4) {
    if (
      !isWhiteMirrorState(before, perspective) ||
      boardControlScore < 300 ||
      !hasEnemyFrontThreatSource(after, perspective) ||
      before.players[perspective].masterHp > before.players[opponent].masterHp + 3
    ) {
      return 0;
    }
    return value + Math.min(260, boardControlScore * 0.65) + 80;
  }

  return value + Math.min(180, boardControlScore * 0.45);
}

function bestSameAttackerEnemyFrontControlScore(
  state: GameState,
  attackerSlotKey: SlotKey,
  perspective: PlayerId,
): number {
  const attacker = state.slots[attackerSlotKey].monster;
  if (!attacker?.status || attacker.owner !== perspective || attacker.status !== "active" || attacker.actionCount >= attacker.actionLimit) {
    return 0;
  }

  const opponent = opponentOf(perspective);
  let best = 0;
  for (const command of getMonsterCommands(attacker)) {
    for (const target of getCommandTargets(state, attackerSlotKey, command.id)) {
      if (target.kind !== "monster") {
        continue;
      }
      const targetSlot = state.slots[target.slotKey];
      const targetMonster = targetSlot.monster;
      if (!targetMonster || targetMonster.owner !== opponent || targetSlot.row !== "front") {
        continue;
      }
      const damage = estimateMonsterDamage(state, targetMonster, attackerSlotKey, command);
      if (damage <= 0) {
        continue;
      }
      if (damage >= targetMonster.hp) {
        best = Math.max(best, 320 + monsterValue(state, target.slotKey) * 0.5);
        continue;
      }
      const targetMasterPressure = directMasterDamageFromSlot(state, target.slotKey, opponent);
      best = Math.max(
        best,
        80 + damage * 32 + Math.min(100, monsterValue(state, target.slotKey) * 0.35) + (targetMasterPressure > 0 ? 80 + targetMasterPressure * 30 : 0),
      );
    }
  }
  return best;
}

function whiteReadyBacklineRetreatDecisionPenalty(
  before: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "move" ||
    before.slots[decision.fromSlotKey].owner !== perspective ||
    before.slots[decision.fromSlotKey].row !== "front" ||
    before.slots[decision.toSlotKey].row !== "back"
  ) {
    return 0;
  }

  const mover = before.slots[decision.fromSlotKey].monster;
  const swapped = before.slots[decision.toSlotKey].monster;
  if (
    !mover ||
    !swapped ||
    swapped.owner !== perspective ||
    swapped.status !== "active" ||
    swapped.actionCount >= swapped.actionLimit
  ) {
    return 0;
  }

  const moverThreat = incomingThreat(before, decision.fromSlotKey);
  if (mover.hp > 2 && !isLethalIncomingThreat(moverThreat)) {
    return 0;
  }

  const moverWorkLoss = bestAttackOpportunityScore(before, decision.fromSlotKey) > 0 ? 60 : 0;
  const backlineWorkLoss = bestAttackOpportunityScore(before, decision.toSlotKey) > 0 ? 80 : 0;
  return value + moverWorkLoss + backlineWorkLoss;
}

function whiteDisadvantagedSummonOvercommitDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "summon" ||
    after.winner === perspective ||
    summonWakeCreatesImmediateWork(before, decision.handInstanceId, decision.slotKey)
  ) {
    return 0;
  }

  const opponent = opponentOf(perspective);
  const beforeOpponentThreat = buildThreatModel(before, opponent);
  const beforeMasterDamage = beforeOpponentThreat.masterDamage[perspective];
  if (!isDisadvantagedUnderMasterAssault(before, perspective, beforeMasterDamage)) {
    return 0;
  }

  const afterOpponentThreat = buildThreatModel(after, opponent);
  const afterMasterDamage = afterOpponentThreat.masterDamage[perspective];
  const masterDamageReduction = beforeMasterDamage - afterMasterDamage;
  if (masterDamageReduction >= 2 || afterMasterDamage <= 0) {
    return 0;
  }

  const summoned = after.slots[decision.slotKey].monster;
  const summonedThreat = afterOpponentThreat.monsterThreats[decision.slotKey] ?? NO_THREAT;
  const exposurePenalty = summoned && isLethalIncomingThreat(summonedThreat)
    ? 120
    : summoned && summonedThreat.threatened
      ? 45
      : 0;
  const lowResourcePenalty = after.players[perspective].stones <= 1 ? 70 : 0;
  const lowHandPenalty = before.players[perspective].hand.length <= 2 ? 55 : 0;
  const remainingAssaultPenalty = Math.min(180, afterMasterDamage * 45);
  return value + remainingAssaultPenalty + exposurePenalty + lowResourcePenalty + lowHandPenalty;
}

function whiteBlockedBacklineNoWorkSummonDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "summon" ||
    summonWakeCreatesImmediateWork(before, decision.handInstanceId, decision.slotKey)
  ) {
    return 0;
  }

  const slot = after.slots[decision.slotKey];
  const summoned = slot.monster;
  if (!summoned || summoned.owner !== perspective || slot.row !== "back") {
    return 0;
  }

  const frontSlotKey = frontSlotFor(slot);
  const frontMonster = after.slots[frontSlotKey].monster;
  if (!frontMonster || frontMonster.owner !== perspective) {
    return 0;
  }

  if (monsterHasBacklineAttackPattern(summoned.cardId)) {
    return 0;
  }

  const readyState = readyPlayerForTacticalEvaluation(after, perspective);
  if (bestAttackOpportunityScore(readyState, decision.slotKey) > 0) {
    return 0;
  }

  const durableFrontBlockerPenalty = frontMonster.hp >= 3 ? 40 : 0;
  const lowResourcePenalty = after.players[perspective].stones <= 1 ? 30 : 0;
  return value + durableFrontBlockerPenalty + lowResourcePenalty;
}

function whiteBlockedBacklineExposedSummonDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "summon" ||
    after.winner === perspective ||
    summonWakeCreatesImmediateWork(before, decision.handInstanceId, decision.slotKey)
  ) {
    return 0;
  }

  const slot = after.slots[decision.slotKey];
  const summoned = slot.monster;
  if (!summoned || summoned.owner !== perspective || slot.row !== "back" || monsterHasBacklineAttackPattern(summoned.cardId)) {
    return 0;
  }

  const frontMonster = after.slots[frontSlotFor(slot)].monster;
  if (!frontMonster || frontMonster.owner !== perspective) {
    return 0;
  }

  const readyState = readyPlayerForTacticalEvaluation(after, perspective);
  if (bestAttackOpportunityScore(readyState, decision.slotKey) > 0) {
    return 0;
  }

  const fillsLastBackSlot = emptyBackSlotCountForPlayer(before, perspective) > 0 &&
    emptyBackSlotCountForPlayer(after, perspective) === 0;
  const lowStone = after.players[perspective].stones <= 2;
  if (!fillsLastBackSlot && !lowStone) {
    return 0;
  }

  const existingAttackScore = bestAttackOpportunityScore(before);
  if (existingAttackScore < 80) {
    return 0;
  }

  const opponent = opponentOf(perspective);
  const summonedThreat = buildThreatModel(after, opponent).monsterThreats[decision.slotKey] ?? NO_THREAT;
  if (!summonedThreat.threatened) {
    return 0;
  }

  const lethalPenalty = isLethalIncomingThreat(summonedThreat) ? value * 0.65 : 0;
  const lastBackSlotPenalty = fillsLastBackSlot ? Math.min(35, value * 0.35) : 0;
  const lowStonePenalty = lowStone ? Math.min(25, value * 0.25) : 0;
  const attackOpportunityPenalty = Math.min(55, existingAttackScore * 0.12);
  return value + lethalPenalty + lastBackSlotPenalty + lowStonePenalty + attackOpportunityPenalty;
}

function whiteBackSlotFutureValueDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "summon" ||
    before.players[perspective].hand.length >= 6
  ) {
    return 0;
  }

  const summoned = after.slots[decision.slotKey].monster;
  if (!summoned || summoned.owner !== perspective || monsterHasBacklineAttackPattern(summoned.cardId)) {
    return 0;
  }

  const beforeEmptyBackSlots = emptyBackSlotCountForPlayer(before, perspective);
  const afterEmptyBackSlots = emptyBackSlotCountForPlayer(after, perspective);
  const noReachFrontBackIncrease = Math.max(
    0,
    noReachFrontBackSlotCountForPlayer(after, perspective) -
      noReachFrontBackSlotCountForPlayer(before, perspective),
  );
  if (beforeEmptyBackSlots <= afterEmptyBackSlots && noReachFrontBackIncrease <= 0) {
    return 0;
  }

  const lastBackSlotPenalty = beforeEmptyBackSlots > 0 && afterEmptyBackSlots === 0 ? value : 0;
  const noReachBackPenalty = noReachFrontBackIncrease * value;
  return lastBackSlotPenalty + noReachBackPenalty;
}

function whiteBackSlotReservationPlanDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    before.players[perspective].hand.length >= 5 ||
    after.winner ||
    emptyBackSlotCountForPlayer(before, perspective) !== 1 ||
    emptyBackSlotCountForPlayer(after, perspective) === 0 ||
    deckBacklineWorkCount(before, perspective, 5) === 0
  ) {
    return 0;
  }

  if (decision.type === "summon" && afterBackSlotWasFilled(before, after, perspective)) {
    return 0;
  }

  const immediateProgress = enemyMonsterWasRemoved(before, after, perspective) ||
    ownMonsterLeveledUp(before, after, perspective) ||
    masterDamageFromTransition(before, after, perspective) > 0;
  const focusOrEnd = decision.type === "focus" || decision.type === "end_turn";
  const top5ReachCount = deckBacklineWorkCount(before, perspective, 5);
  return value + (immediateProgress ? value * 0.4 : 0) + (focusOrEnd ? value * 0.15 : 0) + top5ReachCount * 8;
}

function whiteLowStoneBackSlotAlternativeDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    before.players[perspective].stones > 2 ||
    emptyBackSlotCountForPlayer(before, perspective) !== 1 ||
    emptyBackSlotCountForPlayer(after, perspective) === 0 ||
    deckBacklineWorkCount(before, perspective, 5) === 0 ||
    !hasRiskyNoReachLastBackSummon(before, perspective) ||
    hasBacklineWorkLastBackSummon(before, perspective)
  ) {
    return 0;
  }

  if (decision.type === "summon" && afterBackSlotWasFilled(before, after, perspective)) {
    return 0;
  }

  const attacksMonster = decision.type === "attack" && decision.action.target.kind === "monster";
  const focus = decision.type === "focus";
  const end = decision.type === "end_turn";
  const move = decision.type === "move" && emptyBackSlotCountForPlayer(after, perspective) > 0;
  if (!attacksMonster && !focus && !end && !move) {
    return 0;
  }

  const enemyRemoved = enemyMonsterWasRemoved(before, after, perspective);
  const focusBonus = focus && ownReadyFrontMonsterCount(before, perspective) > 0 ? value * 0.2 : 0;
  const lowStoneBonus = before.players[perspective].stones <= 1 ? value * 0.25 : 0;
  return value + (enemyRemoved ? value * 0.5 : 0) + focusBonus + lowStoneBonus;
}

function whiteLastBackSlotNoReachSummonGuardDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "summon" ||
    after.winner === perspective ||
    summonWakeCreatesImmediateWork(before, decision.handInstanceId, decision.slotKey) ||
    emptyBackSlotCountForPlayer(before, perspective) !== 1 ||
    emptyBackSlotCountForPlayer(after, perspective) !== 0
  ) {
    return 0;
  }

  const slot = after.slots[decision.slotKey];
  const summoned = slot.monster;
  if (!summoned || summoned.owner !== perspective || slot.row !== "back") {
    return 0;
  }
  if (monsterHasBacklineAttackPattern(summoned.cardId)) {
    return 0;
  }

  const frontSlotKey = frontSlotFor(slot);
  const beforeFront = before.slots[frontSlotKey].monster;
  const afterFront = after.slots[frontSlotKey].monster;
  if (
    beforeFront?.owner !== perspective ||
    afterFront?.owner !== perspective ||
    beforeFront.instanceId !== afterFront.instanceId
  ) {
    return 0;
  }

  const handBacklineWork = handBacklineWorkLastBackSummonCount(before, perspective, decision.handInstanceId);
  const deckTop5BacklineWork = deckBacklineWorkCount(before, perspective, 5);
  if (handBacklineWork <= 0 && deckTop5BacklineWork <= 0) {
    return 0;
  }

  if (
    enemyMonsterWasRemoved(before, after, perspective) ||
    ownMonsterLeveledUp(before, after, perspective) ||
    masterDamageFromTransition(before, after, perspective) > 0
  ) {
    return 0;
  }

  const readyState = readyPlayerForTacticalEvaluation(after, perspective);
  if (bestAttackOpportunityScore(readyState, decision.slotKey) > 0) {
    return 0;
  }

  const handPressurePenalty = handBacklineWork * Math.min(40, value * 0.5);
  const deckPressurePenalty = deckTop5BacklineWork * Math.min(30, value * 0.35);
  const durableFrontPenalty = afterFront.hp >= 3 ? Math.min(25, value * 0.25) : 0;
  const lowStonePenalty = after.players[perspective].stones <= 1 ? Math.min(30, value * 0.3) : 0;
  return value + handPressurePenalty + deckPressurePenalty + durableFrontPenalty + lowStonePenalty;
}

function whiteBacklineMoveBeforeSummonDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    before.players[opponentOf(perspective)].masterId !== "white" ||
    decision.type !== "summon" ||
    after.winner === perspective ||
    summonWakeCreatesImmediateWork(before, decision.handInstanceId, decision.slotKey) ||
    emptyBackSlotCountForPlayer(before, perspective) !== 1 ||
    emptyBackSlotCountForPlayer(after, perspective) !== 0
  ) {
    return 0;
  }

  const summonSlot = after.slots[decision.slotKey];
  const summoned = summonSlot.monster;
  if (
    !summoned ||
    summoned.owner !== perspective ||
    summonSlot.row !== "back"
  ) {
    return 0;
  }

  const currentSlotScore = backSummonSupportScore(before, decision.slotKey, perspective);
  const createdSlotScore = bestBackSlotCreatedByActiveBacklineMoveScore(
    before,
    decision.handInstanceId,
    decision.slotKey,
    perspective,
  );
  if (createdSlotScore < currentSlotScore + 32) {
    return 0;
  }

  const lowStonePenalty = after.players[perspective].stones <= 2 ? Math.min(30, value * 0.25) : 0;
  const laneQualityPenalty = Math.min(70, (createdSlotScore - currentSlotScore) * 0.45);
  return value + laneQualityPenalty + lowStonePenalty;
}

function bestBackSlotCreatedByActiveBacklineMoveScore(
  state: GameState,
  handInstanceId: string,
  currentSummonSlotKey: SlotKey,
  perspective: PlayerId,
): number {
  let bestScore = 0;
  for (const fromSlotKey of FIELD_ORDER_BY_PLAYER[perspective]) {
    const fromSlot = state.slots[fromSlotKey];
    const mover = fromSlot.monster;
    if (
      fromSlot.row !== "back" ||
      !mover ||
      mover.owner !== perspective ||
      mover.status !== "active" ||
      mover.actionCount >= mover.actionLimit
    ) {
      continue;
    }

    for (const toSlotKey of getMovableTargets(state, fromSlotKey)) {
      const toSlot = state.slots[toSlotKey];
      if (toSlot.row !== "front" || toSlot.monster) {
        continue;
      }

      let moved: GameState;
      try {
        moved = moveMonster(state, fromSlotKey, toSlotKey);
      } catch {
        continue;
      }
      const moverCanWorkAfterMove = getMonsterAiTrait(mover.cardId).role === "front" ||
        mover.actionLimit > 1 ||
        bestAttackOpportunityScore(moved, toSlotKey) > bestAttackOpportunityScore(state, fromSlotKey) + 20;
      if (!moverCanWorkAfterMove) {
        continue;
      }
      if (!canSummonTo(moved, handInstanceId, fromSlotKey) || fromSlotKey === currentSummonSlotKey) {
        continue;
      }

      const score = backSummonSupportScore(moved, fromSlotKey, perspective);
      bestScore = Math.max(bestScore, score);
    }
  }
  return bestScore;
}

function backSummonSupportScore(state: GameState, slotKey: SlotKey, perspective: PlayerId): number {
  const slot = state.slots[slotKey];
  if (slot.owner !== perspective || slot.row !== "back") {
    return 0;
  }

  const frontMonster = state.slots[frontSlotFor(slot)].monster;
  if (!frontMonster || frontMonster.owner !== perspective) {
    return 0;
  }

  const roleBonus = getMonsterAiTrait(frontMonster.cardId).role === "front" ? 34 : 0;
  const activeBonus = frontMonster.status === "active" ? 10 : 0;
  const levelBonus = frontMonster.level * 14;
  const hpBonus = Math.min(18, frontMonster.hp * 3);
  return 28 + roleBonus + activeBonus + levelBonus + hpBonus;
}

function whiteLastBackSlotHoldPlanDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  const deckTop5BacklineWork = deckBacklineWorkCount(before, perspective, 5);
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    after.winner ||
    emptyBackSlotCountForPlayer(before, perspective) !== 1 ||
    emptyBackSlotCountForPlayer(after, perspective) === 0 ||
    deckTop5BacklineWork === 0 ||
    !hasRiskyNoReachLastBackSummon(before, perspective) ||
    hasBacklineWorkLastBackSummon(before, perspective)
  ) {
    return 0;
  }

  if (decision.type === "summon" && afterBackSlotWasFilled(before, after, perspective)) {
    return 0;
  }

  const attack = decision.type === "attack";
  const focus = decision.type === "focus";
  const end = decision.type === "end_turn";
  const move = decision.type === "move" && emptyBackSlotCountForPlayer(after, perspective) > 0;
  if (!attack && !focus && !end && !move) {
    return 0;
  }

  const enemyRemoved = enemyMonsterWasRemoved(before, after, perspective);
  const top5Bonus = deckTop5BacklineWork * Math.min(8, value * 0.3);
  const focusBonus = focus && ownReadyFrontMonsterCount(before, perspective) > 0 ? value * 0.3 : 0;
  const attackBonus = attack ? value * 0.15 : 0;
  return value + top5Bonus + focusBonus + attackBonus + (enemyRemoved ? value * 0.5 : 0);
}

function handBacklineWorkLastBackSummonCount(
  state: GameState,
  playerId: PlayerId,
  excludingHandInstanceId: string,
): number {
  const emptyBackSlot = lastEmptyBackSlot(state, playerId);
  if (!emptyBackSlot) {
    return 0;
  }
  return state.players[playerId].hand.filter((card) => {
    if (card.instanceId === excludingHandInstanceId) {
      return false;
    }
    try {
      const def = getCardDef(card.cardId);
      return def.type === "monster" &&
        monsterHasBacklineAttackPattern(card.cardId) &&
        canSummonTo(state, card.instanceId, emptyBackSlot);
    } catch {
      return false;
    }
  }).length;
}

function whiteDeathSheepSpecialLockDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "summon" ||
    after.winner === perspective
  ) {
    return 0;
  }

  const slot = after.slots[decision.slotKey];
  const summoned = slot.monster;
  if (!summoned || summoned.owner !== perspective || summoned.cardId !== "card_133" || slot.row !== "back") {
    return 0;
  }

  const beforeFront = before.slots[frontSlotFor(slot)].monster;
  const afterFront = after.slots[frontSlotFor(slot)].monster;
  if (
    beforeFront?.owner !== perspective ||
    afterFront?.owner !== perspective ||
    beforeFront.instanceId !== afterFront.instanceId
  ) {
    return 0;
  }

  const sealedCommands = getMonsterCommands(afterFront).slice(1).filter((command) => command.implemented !== false);
  if (sealedCommands.length === 0) {
    return 0;
  }

  const levelPenalty = afterFront.level >= 2 ? Math.min(60, value * 0.5) : 0;
  return value + sealedCommands.length * 30 + levelPenalty;
}

function hasRiskyNoReachLastBackSummon(state: GameState, playerId: PlayerId): boolean {
  const emptyBackSlot = lastEmptyBackSlot(state, playerId);
  if (!emptyBackSlot) {
    return false;
  }
  const frontSlotKey = frontSlotFor(state.slots[emptyBackSlot]);
  if (!state.slots[frontSlotKey].monster) {
    return false;
  }
  return state.players[playerId].hand.some((card) => {
    try {
      const def = getCardDef(card.cardId);
      return def.type === "monster" &&
        inferMonsterAiTrait(def).role === "front" &&
        !monsterHasBacklineAttackPattern(card.cardId) &&
        canSummonTo(state, card.instanceId, emptyBackSlot);
    } catch {
      return false;
    }
  });
}

function hasBacklineWorkLastBackSummon(state: GameState, playerId: PlayerId): boolean {
  const emptyBackSlot = lastEmptyBackSlot(state, playerId);
  if (!emptyBackSlot) {
    return false;
  }
  return state.players[playerId].hand.some((card) => {
    try {
      const def = getCardDef(card.cardId);
      return def.type === "monster" &&
        monsterHasBacklineAttackPattern(card.cardId) &&
        canSummonTo(state, card.instanceId, emptyBackSlot);
    } catch {
      return false;
    }
  });
}

function lastEmptyBackSlot(state: GameState, playerId: PlayerId): SlotKey | undefined {
  const emptyBackSlots = FIELD_ORDER_BY_PLAYER[playerId].filter((slotKey) =>
    state.slots[slotKey].row === "back" && !state.slots[slotKey].monster,
  );
  return emptyBackSlots.length === 1 ? emptyBackSlots[0] : undefined;
}

function ownReadyFrontMonsterCount(state: GameState, playerId: PlayerId): number {
  return FIELD_ORDER_BY_PLAYER[playerId].filter((slotKey) => {
    const slot = state.slots[slotKey];
    const monster = slot.monster;
    return slot.row === "front" && monster?.owner === playerId && monster.status === "active";
  }).length;
}

function frontMonsterCountForPlayer(state: GameState, playerId: PlayerId): number {
  return FIELD_ORDER_BY_PLAYER[playerId].filter((slotKey) => {
    const slot = state.slots[slotKey];
    return slot.row === "front" && slot.monster?.owner === playerId;
  }).length;
}

function opponentBackMonsterCountForPlayer(state: GameState, playerId: PlayerId): number {
  return FIELD_ORDER_BY_PLAYER[playerId].filter((slotKey) => {
    const slot = state.slots[slotKey];
    return slot.row === "back" && slot.monster?.owner === playerId;
  }).length;
}

function focusedMonsterCountForPlayer(state: GameState, playerId: PlayerId): number {
  return FIELD_ORDER_BY_PLAYER[playerId].filter((slotKey) => {
    const monster = state.slots[slotKey].monster;
    return monster?.owner === playerId && monster.focused;
  }).length;
}

function afterBackSlotWasFilled(before: GameState, after: GameState, playerId: PlayerId): boolean {
  return FIELD_ORDER_BY_PLAYER[playerId].some((slotKey) =>
    before.slots[slotKey].row === "back" &&
    !before.slots[slotKey].monster &&
    !!after.slots[slotKey].monster,
  );
}

function deckBacklineWorkCount(state: GameState, playerId: PlayerId, topCount: number): number {
  return state.players[playerId].deck
    .slice(0, Math.max(0, topCount))
    .filter((card) => {
      try {
        const def = getCardDef(card.cardId);
        return def.type === "monster" && monsterHasBacklineAttackPattern(card.cardId);
      } catch {
        return false;
      }
    }).length;
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

function emptyBackSlotCountForPlayer(state: GameState, playerId: PlayerId): number {
  return FIELD_ORDER_BY_PLAYER[playerId].filter((slotKey) =>
    state.slots[slotKey].row === "back" && !state.slots[slotKey].monster,
  ).length;
}

function noReachFrontBackSlotCountForPlayer(state: GameState, playerId: PlayerId): number {
  return FIELD_ORDER_BY_PLAYER[playerId].filter((slotKey) => {
    const slot = state.slots[slotKey];
    const monster = slot.monster;
    return slot.row === "back" &&
      monster?.owner === playerId &&
      getMonsterAiTrait(monster.cardId).role === "front" &&
      !monsterHasBacklineAttackPattern(monster.cardId);
  }).length;
}

function isDisadvantagedUnderMasterAssault(
  state: GameState,
  perspective: PlayerId,
  opponentMasterDamage: number,
): boolean {
  if (opponentMasterDamage <= 0) {
    return false;
  }
  const opponent = opponentOf(perspective);
  const own = state.players[perspective];
  const enemy = state.players[opponent];
  if (enemy.masterHp <= 4 && bestDirectMasterDamageForPlayer(state, perspective) > 0) {
    return false;
  }
  return own.masterHp <= 5 || own.masterHp + 2 <= enemy.masterHp || opponentMasterDamage >= Math.max(2, own.masterHp - 1);
}

function whiteBlackUnsafeMasterAttackDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    before.players[opponentOf(perspective)].masterId !== "black" ||
    !isDirectMasterAttackDecision(decision) ||
    after.winner === perspective
  ) {
    return 0;
  }

  const opponent = opponentOf(perspective);
  const damage = before.players[opponent].masterHp - after.players[opponent].masterHp;
  if (damage <= 0 || after.players[opponent].masterHp <= 4 || after.players[perspective].stones > 1) {
    return 0;
  }

  const threatDamage = maxEnemyFrontMasterDamagePotential(after, perspective);
  if (threatDamage <= 0) {
    return 0;
  }

  const ownCloseoutDamage = bestDirectMasterDamageForPlayer(after, perspective);
  if (ownCloseoutDamage >= after.players[opponent].masterHp && after.players[perspective].masterHp > threatDamage) {
    return 0;
  }

  const hpRacePenalty = after.players[perspective].masterHp <= after.players[opponent].masterHp ? 70 : 0;
  const urgentThreatPenalty = threatDamage >= after.players[perspective].masterHp - 1 ? 95 : 0;
  return value + Math.min(180, threatDamage * 45) + hpRacePenalty + urgentThreatPenalty;
}

function isDirectMasterAttackDecision(decision: CpuDecision): boolean {
  return (
    (decision.type === "attack" && decision.action.target.kind === "master") ||
    (decision.type === "master_action" && decision.actionId === "master_attack" && decision.target.kind === "master")
  );
}

function maxEnemyFrontMasterDamagePotential(state: GameState, perspective: PlayerId): number {
  const opponent = opponentOf(perspective);
  return Math.max(
    0,
    ...FIELD_ORDER_BY_PLAYER[opponent]
      .filter((slotKey) => state.slots[slotKey].row === "front")
      .map((slotKey) => blackFrontMasterDamagePotential(state, slotKey, opponent)),
  );
}

function findSafeBackRoleRetreat(state: GameState, fromSlotKey: SlotKey, perspective: PlayerId): GameState | undefined {
  const mover = state.slots[fromSlotKey].monster;
  if (
    !mover ||
    mover.owner !== perspective ||
    mover.status !== "active" ||
    mover.actionCount >= mover.actionLimit ||
    state.slots[fromSlotKey].row !== "front" ||
    getMonsterAiTrait(mover.cardId).role !== "back"
  ) {
    return undefined;
  }
  const beforeThreat = incomingThreat(state, fromSlotKey);
  if (!beforeThreat.threatened && !isLethalIncomingThreat(beforeThreat)) {
    return undefined;
  }

  for (const toSlotKey of getMovableTargets(state, fromSlotKey)) {
    if (state.slots[toSlotKey].row !== "back") {
      continue;
    }
    let after: GameState;
    try {
      after = moveMonster(state, fromSlotKey, toSlotKey);
    } catch {
      continue;
    }
    if (isSafeBackRoleRetreat(state, after, fromSlotKey, perspective)) {
      return after;
    }
  }
  return undefined;
}

function isSafeBackRoleRetreat(
  before: GameState,
  after: GameState,
  fromSlotKey: SlotKey,
  perspective: PlayerId,
): boolean {
  const beforeMover = before.slots[fromSlotKey].monster;
  if (!beforeMover || beforeMover.owner !== perspective || getMonsterAiTrait(beforeMover.cardId).role !== "back") {
    return false;
  }
  const beforeThreat = incomingThreat(before, fromSlotKey);
  if (!beforeThreat.threatened && !isLethalIncomingThreat(beforeThreat)) {
    return false;
  }
  const afterSlotKey = findMonsterSlot(after, beforeMover.instanceId);
  if (!afterSlotKey || after.slots[afterSlotKey].row !== "back") {
    return false;
  }
  const afterThreat = incomingThreat(after, afterSlotKey);
  return !isLethalIncomingThreat(afterThreat) && maxIncomingThreatDamage(afterThreat) < maxIncomingThreatDamage(beforeThreat);
}

function shouldDeferShieldUntilAfterCurrentTurnWork(
  state: GameState,
  shieldTargetSlotKey: SlotKey,
  reserveCost: number,
  weights: AiEvaluationWeights,
): boolean {
  const monster = state.slots[shieldTargetSlotKey].monster;
  if (!monster || monster.owner !== state.currentPlayer) {
    return false;
  }
  if (hasImmediateCounterWorkRequiringPreShield(state, shieldTargetSlotKey, weights)) {
    return false;
  }
  return listPreShieldCurrentTurnWorkDecisions(state, weights).some((decision) =>
    canTakeDecisionBeforeShield(state, decision, shieldTargetSlotKey, reserveCost),
  );
}

function listPreShieldCurrentTurnWorkDecisions(state: GameState, weights: AiEvaluationWeights): CpuDecision[] {
  return [
    ...listAttackDecisions(state, weights),
    ...listMasterAttackDecisions(state),
    ...listWakeUpDecisions(state),
    ...listSummonDecisions(state),
    ...listMoveDecisions(state),
    ...listFocusDecisions(state),
  ];
}

function canTakeDecisionBeforeShield(
  state: GameState,
  decision: CpuDecision,
  shieldTargetSlotKey: SlotKey,
  reserveCost: number,
): boolean {
  if (decision.type === "attack" && decision.action.attackerSlotKey === shieldTargetSlotKey) {
    if (attackCanReceiveImmediateCounterDamage(state, decision.action)) {
      return false;
    }
  }

  let after: GameState;
  try {
    after = applyCpuDecision(state, decision);
  } catch {
    return false;
  }
  if (after.winner === state.currentPlayer) {
    return true;
  }
  return after.currentPlayer === state.currentPlayer && after.players[state.currentPlayer].stones >= reserveCost;
}

function hasImmediateCounterWorkRequiringPreShield(
  state: GameState,
  shieldTargetSlotKey: SlotKey,
  weights: AiEvaluationWeights,
): boolean {
  const attacker = state.slots[shieldTargetSlotKey].monster;
  if (!attacker || attacker.status !== "active" || attacker.actionCount >= attacker.actionLimit) {
    return false;
  }
  return listAttackDecisions(state, weights).some(
    (decision) =>
      decision.type === "attack" &&
      decision.action.attackerSlotKey === shieldTargetSlotKey &&
      attackCanReceiveImmediateCounterDamage(state, decision.action),
  );
}

function attackCanReceiveImmediateCounterDamage(state: GameState, action: CommandAction): boolean {
  if (action.target.kind !== "monster") {
    return false;
  }
  const attacker = state.slots[action.attackerSlotKey].monster;
  const target = state.slots[action.target.slotKey].monster;
  if (!attacker || !target || target.owner === attacker.owner) {
    return false;
  }
  return target.dragonShield || isMonsterCounterTraitActive(target);
}

function isMonsterCounterTraitActive(monster: MonsterState): boolean {
  if (monster.cardId === "card_102") {
    return monster.level >= 2;
  }
  if (monster.cardId === "card_103") {
    return monster.level >= 3;
  }
  return false;
}

function isHighQualityThreatFacingSetup(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
): boolean {
  if (decision.type === "master_action" && decision.actionId === "shield") {
    return isUrgentShieldDecision(before, after, decision, perspective) || isConvertibleShieldDecision(after, decision, perspective);
  }
  if (decision.type === "master_action" && decision.actionId === "wake_up") {
    return whiteWakeSafeWorkDecisionBonus(before, after, decision, perspective, 1) > 0;
  }
  if (decision.type === "focus") {
    const threat = incomingThreat(after, decision.slotKey);
    return !isLethalIncomingThreat(threat) && nextTurnWorkPotential(after, decision.slotKey, perspective) > 0;
  }
  return false;
}

function whiteStrictShieldDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "master_action" ||
    decision.actionId !== "shield" ||
    decision.target.kind !== "monster"
  ) {
    return 0;
  }
  if (isConvertibleShieldDecision(after, decision, perspective) || isUrgentShieldDecision(before, after, decision, perspective)) {
    return 0;
  }
  return value;
}

function isUrgentShieldDecision(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
): boolean {
  if (decision.type !== "master_action" || decision.actionId !== "shield" || decision.target.kind !== "monster") {
    return false;
  }
  const target = before.slots[decision.target.slotKey].monster;
  const targetAfter = after.slots[decision.target.slotKey].monster;
  if (!target || target.owner !== perspective || !targetAfter || targetAfter.owner !== perspective) {
    return false;
  }

  const threat = incomingThreat(before, decision.target.slotKey);
  const threatAfterShield = incomingThreat(after, decision.target.slotKey);
  return isLethalIncomingThreat(threat) || (threat.threatened && maxIncomingThreatDamage(threatAfterShield) < maxIncomingThreatDamage(threat));
}

function whiteLowStoneSetupDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
  kind: "shield" | "wake_up" | "summon" | "focus",
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    after.players[perspective].stones > 1 ||
    !isSetupDecision(before, after, decision, perspective)
  ) {
    return 0;
  }
  if (kind === "summon") {
    return decision.type === "summon" ? value : 0;
  }
  if (kind === "focus") {
    return decision.type === "focus" ? value : 0;
  }
  return decision.type === "master_action" && decision.actionId === kind ? value : 0;
}

function whiteShieldThreatConversionDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "master_action" ||
    decision.actionId !== "shield" ||
    decision.target.kind !== "monster"
  ) {
    return 0;
  }
  const urgent = isUrgentShieldDecision(before, after, decision, perspective);
  const convertible = isConvertibleShieldDecision(after, decision, perspective);
  return urgent || convertible ? value : 0;
}

function whiteShieldBreakthroughDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "master_action" ||
    decision.actionId !== "shield" ||
    decision.target.kind !== "monster"
  ) {
    return 0;
  }
  const target = before.slots[decision.target.slotKey].monster;
  const targetAfter = after.slots[decision.target.slotKey].monster;
  if (!target || target.owner !== perspective || !targetAfter || targetAfter.owner !== perspective) {
    return 0;
  }
  const threat = incomingThreat(before, decision.target.slotKey);
  const threatAfterShield = incomingThreat(after, decision.target.slotKey);
  if (!isLethalIncomingThreat(threat) || !isLethalIncomingThreat(threatAfterShield)) {
    return 0;
  }
  return value;
}

function whiteShieldNoPressureDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "master_action" ||
    decision.actionId !== "shield" ||
    decision.target.kind !== "monster"
  ) {
    return 0;
  }
  const target = before.slots[decision.target.slotKey].monster;
  const targetAfter = after.slots[decision.target.slotKey].monster;
  if (!target || target.owner !== perspective || !targetAfter || targetAfter.owner !== perspective) {
    return 0;
  }
  if (isConvertibleShieldDecision(after, decision, perspective)) {
    return 0;
  }
  return maxIncomingThreatDamage(incomingThreat(before, decision.target.slotKey)) <= 0 ? value : 0;
}

function whiteShieldFrontAceDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    !isWhiteMirrorState(before, perspective) ||
    decision.type !== "master_action" ||
    decision.actionId !== "shield" ||
    decision.target.kind !== "monster" ||
    currentTurnMasterActionCount(before, perspective, "shield") > 0
  ) {
    return 0;
  }

  const slotKey = decision.target.slotKey;
  const slot = before.slots[slotKey];
  const target = before.slots[slotKey].monster;
  const targetAfter = after.slots[slotKey].monster;
  if (
    slot.row !== "front" ||
    !target ||
    target.owner !== perspective ||
    !targetAfter ||
    targetAfter.owner !== perspective ||
    targetAfter.shielded !== true ||
    getMonsterAiTrait(target.cardId).role !== "front" ||
    target.level < 3
  ) {
    return 0;
  }

  const threat = incomingThreat(before, slotKey);
  const canConvert =
    nextTurnWorkPotential(after, slotKey, perspective) > 0 ||
    directMasterDamageFromSlot(after, slotKey, perspective) > 0;
  if (!threat.threatened && maxIncomingThreatDamage(threat) <= 0 && !canConvert) {
    return 0;
  }
  return value;
}

function whiteWakeImmediateWorkDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "master_action" ||
    decision.actionId !== "wake_up" ||
    decision.target.kind !== "monster"
  ) {
    return 0;
  }
  const target = after.slots[decision.target.slotKey].monster;
  if (!target || target.owner !== perspective || target.status !== "active") {
    return 0;
  }
  return bestWakeFollowUpFinishScore(after, decision.target.slotKey) > 0 ? value : 0;
}

function whiteWakeLevelUpSetupDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    !isWhiteMirrorState(before, perspective) ||
    decision.type !== "master_action" ||
    decision.actionId !== "wake_up" ||
    decision.target.kind !== "monster"
  ) {
    return 0;
  }
  return wakeCreatesFrontLevelUpSetup(after, decision.target.slotKey, perspective) ? value : 0;
}

function wakeCreatesFrontLevelUpSetup(state: GameState, setupSlotKey: SlotKey, perspective: PlayerId): boolean {
  const setupMonster = state.slots[setupSlotKey].monster;
  if (!setupMonster || setupMonster.owner !== perspective || setupMonster.status !== "active") {
    return false;
  }

  for (const setupCommand of getMonsterCommands(setupMonster)) {
    for (const target of getCommandTargets(state, setupSlotKey, setupCommand.id)) {
      if (target.kind !== "monster" || state.slots[target.slotKey].owner === perspective) {
        continue;
      }
      const targetMonster = state.slots[target.slotKey].monster;
      if (!targetMonster) {
        continue;
      }
      const setupDamage = estimateMonsterDamage(state, targetMonster, setupSlotKey, setupCommand);
      if (setupDamage <= 0 || setupDamage >= targetMonster.hp) {
        continue;
      }
      if (frontFinisherCanLevelAfterSetup(state, target.slotKey, targetMonster.hp - setupDamage, perspective, setupSlotKey)) {
        return true;
      }
    }
  }
  return false;
}

function frontFinisherCanLevelAfterSetup(
  state: GameState,
  targetSlotKey: SlotKey,
  remainingHp: number,
  perspective: PlayerId,
  setupSlotKey: SlotKey,
): boolean {
  if (remainingHp <= 0) {
    return false;
  }
  const targetMonster = state.slots[targetSlotKey].monster;
  if (!targetMonster) {
    return false;
  }

  return FIELD_ORDER_BY_PLAYER[perspective].some((finisherSlotKey) => {
    if (finisherSlotKey === setupSlotKey || state.slots[finisherSlotKey].row !== "front") {
      return false;
    }
    const finisher = state.slots[finisherSlotKey].monster;
    if (
      !finisher ||
      finisher.owner !== perspective ||
      finisher.status !== "active" ||
      finisher.actionCount >= finisher.actionLimit ||
      finisher.levelFixed ||
      getMonsterDef(finisher.cardId).maxLevel <= finisher.level ||
      state.players[perspective].stones <= 0
    ) {
      return false;
    }
    return getMonsterCommands(finisher).some((command) => {
      const canTarget = getCommandTargets(state, finisherSlotKey, command.id).some(
        (target) => target.kind === "monster" && target.slotKey === targetSlotKey,
      );
      return canTarget && estimateMonsterDamage(state, targetMonster, finisherSlotKey, command) >= remainingHp;
    });
  });
}

function whiteMirrorFrontLevelUpSetupAttackBonus(
  state: GameState,
  action: CommandAction,
  targetAfter: MonsterState,
): number {
  const perspective = state.currentPlayer;
  if (
    !isWhiteMirrorState(state, perspective) ||
    action.target.kind !== "monster" ||
    targetAfter.owner === perspective ||
    state.slots[action.attackerSlotKey].row === "front"
  ) {
    return 0;
  }
  return frontFinisherCanLevelAfterSetup(
    state,
    action.target.slotKey,
    targetAfter.hp,
    perspective,
    action.attackerSlotKey,
  )
    ? WHITE_MIRROR_FRONT_LEVEL_UP_SETUP_ATTACK_BONUS
    : 0;
}

function whiteMirrorBacklineLeveledFrontThreatChipBonus(
  state: GameState,
  after: GameState,
  action: CommandAction,
  targetBefore: MonsterState,
  targetAfter: MonsterState | undefined,
): number {
  const perspective = state.currentPlayer;
  if (
    !isWhiteMirrorState(state, perspective) ||
    action.target.kind !== "monster" ||
    state.slots[action.attackerSlotKey].row !== "back" ||
    state.slots[action.target.slotKey].row !== "front" ||
    targetBefore.owner !== opponentOf(perspective) ||
    targetBefore.level < 2 ||
    !targetAfter ||
    targetAfter.owner !== targetBefore.owner ||
    targetAfter.instanceId !== targetBefore.instanceId ||
    targetAfter.hp >= targetBefore.hp
  ) {
    return 0;
  }

  const pressureBefore = whiteMirrorLeveledFrontThreatSlotPressure(state, action.target.slotKey, perspective);
  if (pressureBefore <= 0) {
    return 0;
  }

  const pressureAfter = whiteMirrorLeveledFrontThreatSlotPressure(after, action.target.slotKey, perspective);
  const damage = targetBefore.hp - targetAfter.hp;
  const pressureDrop = Math.max(0, pressureBefore - pressureAfter);
  const finishThisTurn = canFinishEnemyMonsterThisTurn(after, action.target.slotKey, perspective);
  const targetMaxLevel = getMonsterDef(targetBefore.cardId).maxLevel;
  const maxLevelThreatBonus = targetBefore.level >= targetMaxLevel && targetMaxLevel > 1 ? 54 : 0;
  const lowHpProgressBonus = targetAfter.hp <= 3 ? 36 : 0;
  const finishSetupBonus = finishThisTurn ? 90 : 0;
  const bonus =
    70 +
    damage * 30 +
    Math.min(130, pressureBefore * 0.24) +
    pressureDrop * 0.6 +
    maxLevelThreatBonus +
    lowHpProgressBonus +
    finishSetupBonus;
  return Math.min(WHITE_MIRROR_BACKLINE_LEVELED_FRONT_CHIP_MAX_BONUS, bonus);
}

function whiteMirrorLeveledFrontThreatSlotPressure(
  state: GameState,
  slotKey: SlotKey,
  perspective: PlayerId,
): number {
  if (!isWhiteMirrorState(state, perspective)) {
    return 0;
  }

  const opponent = opponentOf(perspective);
  const slot = state.slots[slotKey];
  const monster = slot.monster;
  if (!monster || monster.owner !== opponent || monster.level < 2) {
    return 0;
  }

  const responseState = responseTurnTacticalEvaluationState(state, opponent);
  const readyMonster = responseState.slots[slotKey].monster;
  if (!readyMonster || readyMonster.owner !== opponent || readyMonster.status !== "active") {
    return 0;
  }

  const directDamage = directMasterDamageFromSlot(responseState, slotKey, opponent);
  const formationThreat = slot.row === "front" ? whiteMirrorFrontSlotThreat(responseState, slotKey, perspective) : 0;
  if (directDamage <= 0 && formationThreat < 120) {
    return 0;
  }

  const maxLevel = getMonsterDef(monster.cardId).maxLevel;
  const actionMultiplier = Math.max(1, readyMonster.actionLimit - readyMonster.actionCount);
  const hpPressure = Math.max(0, monster.hp - 1) * 10;
  const levelPressure = monster.level * 42 + (monster.level >= maxLevel && maxLevel > 1 ? 42 : 0);
  const rowPressure = slot.row === "front" ? 32 : 0;
  const focusPressure = monster.focused ? 32 : 0;
  return (
    70 +
    directDamage * actionMultiplier * 90 +
    formationThreat * 0.55 +
    levelPressure +
    hpPressure +
    rowPressure +
    focusPressure
  );
}

function whiteCloseoutAfterShieldDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (value <= 0 || before.players[perspective].masterId !== "white" || ownShieldedMonsterCount(before, perspective) <= 0) {
    return 0;
  }
  const opponent = opponentOf(perspective);
  const damage = before.players[opponent].masterHp - after.players[opponent].masterHp;
  if (damage <= 0 || after.players[opponent].masterHp > 3) {
    return 0;
  }
  return decision.type === "attack" || decision.type === "master_action" || decision.type === "magic" ? value : 0;
}

function whiteSecondShieldLowStoneDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "master_action" ||
    decision.actionId !== "shield" ||
    after.players[perspective].stones > 1
  ) {
    return 0;
  }
  return currentTurnMasterActionCount(before, perspective, "shield") > 0 ? value : 0;
}

function whiteSecondShieldCommitmentDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "master_action" ||
    decision.actionId !== "shield" ||
    decision.target.kind !== "monster" ||
    currentTurnMasterActionCount(before, perspective, "shield") <= 0
  ) {
    return 0;
  }
  const targetSlotKey = decision.target.slotKey;
  const target = before.slots[targetSlotKey].monster;
  const targetAfter = after.slots[targetSlotKey].monster;
  if (!target || target.owner !== perspective || !targetAfter || targetAfter.owner !== perspective) {
    return 0;
  }
  return isSecondShieldException(before, after, targetSlotKey, perspective) ? 0 : value;
}

function isSecondShieldException(before: GameState, after: GameState, slotKey: SlotKey, perspective: PlayerId): boolean {
  const threat = incomingThreat(before, slotKey);
  if (!threat.threatened || maxIncomingThreatDamage(threat) <= 0) {
    return false;
  }
  return isHighValueSecondShieldTarget(after, slotKey, perspective);
}

function isHighValueSecondShieldTarget(state: GameState, slotKey: SlotKey, perspective: PlayerId): boolean {
  const monster = state.slots[slotKey].monster;
  if (!monster || monster.owner !== perspective) {
    return false;
  }
  if (monster.level >= 2 || nextTurnLevelUpPotential(state, slotKey) > 0) {
    return true;
  }
  const opponent = opponentOf(perspective);
  const directDamage = directMasterDamageFromSlot(state, slotKey, perspective);
  if (directDamage >= state.players[opponent].masterHp) {
    return true;
  }
  return false;
}

function whiteLowStoneFocusConversionDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "focus" ||
    after.players[perspective].stones > 1 ||
    !isSetupDecision(before, after, decision, perspective)
  ) {
    return 0;
  }
  return nextTurnWorkPotential(after, decision.slotKey, perspective) > 0 ? value : 0;
}

function whiteWakeSafeWorkDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "master_action" ||
    decision.actionId !== "wake_up" ||
    decision.target.kind !== "monster"
  ) {
    return 0;
  }
  const targetSlotKey = decision.target.slotKey;
  const target = after.slots[targetSlotKey].monster;
  if (!target || target.owner !== perspective || target.status !== "active") {
    return 0;
  }
  const threat = incomingThreat(after, targetSlotKey);
  if (isLethalIncomingThreat(threat)) {
    return 0;
  }
  return bestWakeFollowUpFinishScore(after, targetSlotKey) > 0 ? value : 0;
}

function whiteLowStoneFocusMissedAttackDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    decision.type !== "focus" ||
    after.players[perspective].stones > 1 ||
    !isSetupDecision(before, after, decision, perspective)
  ) {
    return 0;
  }
  return bestAttackOpportunityScoreForPlayer(before, perspective) > 0 ? value : 0;
}

function whiteLowStoneNonLethalFaceDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    !isWhiteMirrorState(before, perspective) ||
    after.players[perspective].stones > 1 ||
    after.winner === perspective ||
    masterDamageFromTransition(before, after, perspective) <= 0 ||
    after.players[opponentOf(perspective)].masterHp <= 3
  ) {
    return 0;
  }
  const faceAttack =
    (decision.type === "attack" && decision.action.target.kind === "master") ||
    (decision.type === "master_action" && decision.actionId === "master_attack" && decision.target.kind === "master");
  if (!faceAttack) {
    return 0;
  }

  const responsePressure =
    threatenedMonsterValueForPlayer(after, perspective) +
    nextTurnLevelUpPotentialForPlayer(after, opponentOf(perspective)) +
    Math.max(0, buildThreatModel(after, opponentOf(perspective)).masterDamage[perspective]) * 80;
  if (responsePressure <= 0 && !hasEnemyFrontThreatSource(after, perspective)) {
    return 0;
  }

  return value + Math.min(160, responsePressure * 0.18);
}

function whiteMirrorThreatenedNonLethalFaceDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    !isWhiteMirrorState(before, perspective) ||
    after.winner === perspective ||
    masterDamageFromTransition(before, after, perspective) <= 0 ||
    after.players[opponentOf(perspective)].masterHp <= 3 ||
    !isFaceDamageDecision(decision)
  ) {
    return 0;
  }

  const opponent = opponentOf(perspective);
  const threatModel = buildThreatModel(after, opponent);
  const responseMasterDamage = threatModel.masterDamage[perspective];
  const responseLeavesCriticalHp = after.players[perspective].masterHp - responseMasterDamage <= 1;
  const responsePressure =
    responseMasterDamage * 80 +
    nextTurnLevelUpPotentialForPlayer(after, opponent) +
    (hasEnemyFrontThreatSource(after, perspective) ? 90 : 0) +
    threatenedMonsterValueForPlayer(after, perspective, threatModel) * 0.25;
  if (!responseLeavesCriticalHp && responsePressure < 180) {
    return 0;
  }

  const criticalPenalty = responseLeavesCriticalHp ? value * 0.9 : 0;
  return value + criticalPenalty + Math.min(220, responsePressure * 0.28);
}

function isFaceDamageDecision(decision: CpuDecision): boolean {
  return (
    (decision.type === "attack" && decision.action.target.kind === "master") ||
    (decision.type === "master_action" && decision.actionId === "master_attack" && decision.target.kind === "master") ||
    (decision.type === "magic" && decision.action.target.kind === "master")
  );
}

function nextTurnWorkPotential(state: GameState, slotKey: SlotKey, perspective: PlayerId): number {
  const monster = state.slots[slotKey].monster;
  if (!monster || monster.owner !== perspective || monster.status !== "active") {
    return 0;
  }
  const readyState = readyPlayerForTacticalEvaluation(state, perspective);
  const nextAttack = bestAttackOpportunityScore(readyState, slotKey);
  const directDamage = directMasterDamageFromSlot(state, slotKey, perspective);
  const levelUp = nextTurnLevelUpPotential(state, slotKey);
  return Math.max(nextAttack >= 260 ? nextAttack : 0, directDamage * 100, levelUp);
}

function ownShieldedMonsterCount(state: GameState, perspective: PlayerId): number {
  return FIELD_ORDER_BY_PLAYER[perspective].filter((slotKey) => state.slots[slotKey].monster?.shielded).length;
}

function currentTurnMasterActionCount(state: GameState, perspective: PlayerId, actionId: MasterActionId): number {
  return (state.turnMasterActionHistory ?? []).filter((entry) => entry.playerId === perspective && entry.actionId === actionId).length;
}

function whiteEnemyFrontAttackTarget(
  before: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
): SlotKey | undefined {
  if (
    before.players[perspective].masterId !== "white" ||
    decision.type !== "attack" ||
    decision.action.target.kind !== "monster"
  ) {
    return undefined;
  }
  const targetSlotKey = decision.action.target.slotKey;
  const targetSlot = before.slots[targetSlotKey];
  return targetSlot.row === "front" && targetSlot.monster?.owner === opponentOf(perspective) ? targetSlotKey : undefined;
}

function whiteDamagingEnemyFrontAttackTarget(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
): SlotKey | undefined {
  const targetSlotKey = whiteEnemyFrontAttackTarget(before, decision, perspective);
  if (!targetSlotKey || !enemyTargetWasDamagedOrRemoved(before, after, targetSlotKey, perspective)) {
    return undefined;
  }
  return targetSlotKey;
}

function enemyTargetWasDamagedOrRemoved(
  before: GameState,
  after: GameState,
  targetSlotKey: SlotKey,
  perspective: PlayerId,
): boolean {
  const targetBefore = before.slots[targetSlotKey].monster;
  const targetAfter = after.slots[targetSlotKey].monster;
  if (!targetBefore || targetBefore.owner !== opponentOf(perspective)) {
    return false;
  }
  if (!targetAfter || targetAfter.owner !== targetBefore.owner || targetAfter.instanceId !== targetBefore.instanceId) {
    return true;
  }
  return targetAfter.hp < targetBefore.hp;
}

function blackFrontMasterDamagePotential(state: GameState, slotKey: SlotKey, attackerId: PlayerId): number {
  const directDamage = directMasterDamageFromSlot(state, slotKey, attackerId);
  const canBerserk =
    state.players[attackerId].masterId === "black" &&
    state.players[attackerId].stones >= getMasterActionCost("berserk_power");
  return Math.max(directDamage, canBerserk ? directMasterDamageFromSlotWithPowerBonus(state, slotKey, attackerId, 1) : 0);
}

function enemyFrontThreatSourcePotential(state: GameState, slotKey: SlotKey, perspective: PlayerId): number {
  const opponent = opponentOf(perspective);
  const readyState = readyPlayerForTacticalEvaluation(state, opponent);
  const slot = readyState.slots[slotKey];
  const monster = slot.monster;
  if (!monster || monster.owner !== opponent || monster.status !== "active" || slot.row !== "front") {
    return 0;
  }
  return Math.max(
    bestAttackOpportunityScore(readyState, slotKey),
    blackFrontMasterDamagePotential(state, slotKey, opponent) * 100,
  );
}

function hasEnemyFrontThreatSource(state: GameState, perspective: PlayerId): boolean {
  return FIELD_ORDER_BY_PLAYER[opponentOf(perspective)].some((slotKey) => enemyFrontThreatSourcePotential(state, slotKey, perspective) > 0);
}

function currentTurnSpentMonsterActionCount(state: GameState, perspective: PlayerId): number {
  return FIELD_ORDER_BY_PLAYER[perspective].filter((slotKey) => {
    const monster = state.slots[slotKey].monster;
    return !!monster && monster.owner === perspective && monster.actionCount > 0;
  }).length;
}

function directMasterDamageFromSlotWithPowerBonus(
  state: GameState,
  slotKey: SlotKey,
  attackerId: PlayerId,
  powerBonus: number,
): number {
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
        bestDamage = Math.max(bestDamage, Math.max(0, estimateCommandPower(readyState, slotKey, command) + powerBonus - 2));
      }
    }
  }
  return bestDamage;
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

function evaluateSameTurnTerminalPlanOutcome(
  state: GameState,
  perspective: PlayerId,
  depth: number,
  config: CpuAiProfileConfig,
  context: TerminalPlanEvaluationContext,
): TerminalPlanOutcome {
  const cacheKey = terminalPlanCacheKey("own", state, perspective, depth);
  const cached = context.ownOutcomeCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  let outcome: TerminalPlanOutcome;
  if (state.winner || state.pendingLevelUp || state.currentPlayer !== perspective) {
    outcome = { delta: terminalPlanStateDelta(state, perspective, config, context), handoffState: state };
  } else if (depth <= 0) {
    outcome = evaluateTerminalHandoffOutcome(state, perspective, config, context);
  } else {
    const candidates = terminalPlanCandidates(state, perspective, config, context);
    let best = evaluateTerminalHandoffOutcome(state, perspective, config, context);
    for (const candidate of candidates) {
      const candidateOutcome = evaluateSameTurnTerminalPlanOutcome(candidate.after, perspective, depth - 1, config, context);
      if (isBetterSameTurnTerminalPlanOutcome(candidateOutcome, best, perspective, config, context)) {
        best = candidateOutcome;
      }
    }
    outcome = best;
  }
  context.ownOutcomeCache.set(cacheKey, outcome);
  return outcome;
}

function isBetterSameTurnTerminalPlanOutcome(
  candidate: TerminalPlanOutcome,
  currentBest: TerminalPlanOutcome,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  context: TerminalPlanEvaluationContext,
): boolean {
  if (candidate.delta > currentBest.delta) {
    return true;
  }
  if (!isWhiteMirrorState(candidate.handoffState, perspective)) {
    return false;
  }
  if (currentBest.delta - candidate.delta > WHITE_MIRROR_TERMINAL_RESPONSE_TIE_MARGIN) {
    return false;
  }
  return (
    evaluateTerminalPlanOutcomeWithOpponentResponse(candidate, perspective, config, context) >
    evaluateTerminalPlanOutcomeWithOpponentResponse(currentBest, perspective, config, context)
  );
}

function evaluateTerminalHandoffOutcome(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  context: TerminalPlanEvaluationContext,
): TerminalPlanOutcome {
  const cacheKey = terminalPlanCacheKey("handoff", state, perspective, 0);
  const cached = context.handoffOutcomeCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const handoffState = terminalHandoffState(state, perspective, config, context);
  const outcome = { delta: terminalPlanStateDelta(handoffState, perspective, config, context), handoffState };
  context.handoffOutcomeCache.set(cacheKey, outcome);
  return outcome;
}

function terminalPlanStateDelta(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  context: TerminalPlanEvaluationContext,
): number {
  return (
    evaluateState(state, perspective, config.weights) -
    context.baselineScore +
    terminalPlanHandoffStateBonus(state, perspective, config)
  );
}

function terminalPlanHandoffStateBonus(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
): number {
  const focusValue = config.terminalPlanFocusHandoffValue ?? 0;
  const shieldValue = config.terminalPlanShieldHandoffValue ?? 0;
  if ((focusValue <= 0 && shieldValue <= 0) || state.winner) {
    return 0;
  }

  let bonus = 0;
  for (const slotKey of FIELD_ORDER_BY_PLAYER[perspective]) {
    const slot = state.slots[slotKey];
    const monster = slot.monster;
    if (!monster || monster.owner !== perspective) {
      continue;
    }
    if (focusValue > 0 && monster.focused) {
      const upperCommand = getMonsterCommands(monster)[0];
      const reachesThreePower = Boolean(upperCommand && upperCommand.power + 1 >= 3);
      const backlineWork = getMonsterAiTrait(monster.cardId).role === "back" && slot.row === "back";
      const fragileFront = slot.row === "front" && monster.hp <= 2;
      bonus +=
        focusValue +
        (reachesThreePower ? 18 : 0) +
        (backlineWork ? 8 : 0) -
        (fragileFront ? 14 : 0);
    }
    if (shieldValue > 0 && monster.shielded) {
      const threat = incomingThreat(state, slotKey);
      if (threat.threatened || monster.level >= 2 || nextTurnLevelUpPotential(state, slotKey) > 0) {
        bonus += shieldValue + (threat.lethal || threat.lethalWithMasterAction ? 10 : 0);
      }
    }
  }
  return bonus;
}

function evaluateTerminalPlanOutcomeWithOpponentResponse(
  outcome: TerminalPlanOutcome,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  context: TerminalPlanEvaluationContext,
): number {
  if (!shouldUseOpponentTerminalPlanEvaluation(outcome.handoffState, perspective, config)) {
    return outcome.delta;
  }
  const opponentResponseDelta = evaluateOpponentTerminalPlanDelta(
    outcome.handoffState,
    perspective,
    config.sameTurnOpponentTerminalPlanDepth,
    config,
    context,
  );
  const blendedDelta = outcome.delta + (opponentResponseDelta - outcome.delta) * config.sameTurnOpponentTerminalPlanWeight;
  return blendedDelta - whiteMirrorResponseCollapsePenalty(outcome, opponentResponseDelta, perspective);
}

function whiteMirrorResponseCollapsePenalty(
  outcome: TerminalPlanOutcome,
  opponentResponseDelta: number,
  perspective: PlayerId,
): number {
  const state = outcome.handoffState;
  if (!isWhiteMirrorState(state, perspective)) {
    return 0;
  }
  const collapse = outcome.delta - opponentResponseDelta;
  if (collapse <= 0) {
    return 0;
  }

  let penalty =
    Math.max(0, collapse - WHITE_MIRROR_RESPONSE_COLLAPSE_THRESHOLD) *
    WHITE_MIRROR_RESPONSE_COLLAPSE_PENALTY_WEIGHT;
  if (state.players[perspective].stones <= 1) {
    penalty +=
      Math.max(0, collapse - WHITE_MIRROR_LOW_STONE_RESPONSE_COLLAPSE_THRESHOLD) *
      WHITE_MIRROR_LOW_STONE_RESPONSE_COLLAPSE_PENALTY_WEIGHT;
  }
  if (state.players[perspective].stones <= 0) {
    penalty +=
      Math.max(0, collapse - WHITE_MIRROR_ZERO_STONE_RESPONSE_COLLAPSE_THRESHOLD) *
      WHITE_MIRROR_ZERO_STONE_RESPONSE_COLLAPSE_PENALTY_WEIGHT;
  }
  return penalty + whiteMirrorExposedBackLevelHandoffPenalty(state, perspective);
}

function isWhiteMirrorState(state: GameState, perspective: PlayerId): boolean {
  const opponent = opponentOf(perspective);
  return state.players[perspective].masterId === "white" && state.players[opponent].masterId === "white";
}

function whiteMirrorExposedBackLevelHandoffPenalty(state: GameState, perspective: PlayerId): number {
  return FIELD_ORDER_BY_PLAYER[perspective].reduce((total, slotKey) => {
    const monster = state.slots[slotKey].monster;
    if (!monster || monster.level < 2 || state.slots[slotKey].row !== "back") {
      return total;
    }
    const incomingDamage = availableOpponentMonsterDamageToSlot(state, slotKey);
    if (incomingDamage < monster.hp) {
      return total;
    }
    return total + WHITE_MIRROR_EXPOSED_BACK_LEVEL_HANDOFF_PENALTY + Math.max(0, incomingDamage - monster.hp) * 18;
  }, 0);
}

function terminalHandoffState(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  context?: TerminalPlanEvaluationContext,
): GameState {
  if (state.winner || state.pendingLevelUp || state.currentPlayer !== perspective) {
    return state;
  }
  const endTurn = evaluateImmediateCpuDecisionsCached(state, perspective, config, context).find(
    (candidate) => candidate.decision.type === "end_turn",
  );
  return endTurn?.after ?? state;
}

function shouldUseOpponentTerminalPlanEvaluation(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
): boolean {
  const opponent = opponentOf(perspective);
  return (
    state.players[perspective].masterId === "white" &&
    state.currentPlayer === opponent &&
    !state.winner &&
    !state.pendingLevelUp &&
    config.sameTurnOpponentTerminalPlanWeight > 0 &&
    config.sameTurnOpponentTerminalPlanDepth > 0 &&
    config.sameTurnOpponentTerminalPlanWidth > 0
  );
}

function evaluateOpponentTerminalPlanDelta(
  state: GameState,
  perspective: PlayerId,
  depth: number,
  config: CpuAiProfileConfig,
  context: TerminalPlanEvaluationContext,
): number {
  const cacheKey = terminalPlanCacheKey("opponent", state, perspective, depth);
  const cached = context.opponentDeltaCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }
  const opponent = opponentOf(perspective);
  let delta: number;
  if (state.winner || state.pendingLevelUp || state.currentPlayer !== opponent) {
    delta = terminalPlanStateDelta(state, perspective, config, context);
  } else if (depth <= 0) {
    delta = evaluateOpponentHandoffDelta(state, perspective, config, context);
  } else {
    let worst = evaluateOpponentHandoffDelta(state, perspective, config, context);
    for (const candidate of opponentTerminalPlanCandidates(state, perspective, config, context)) {
      worst = Math.min(
        worst,
        evaluateOpponentTerminalPlanDelta(candidate.after, perspective, depth - 1, config, context),
      );
    }
    delta = worst;
  }
  context.opponentDeltaCache.set(cacheKey, delta);
  return delta;
}

function evaluateOpponentTerminalPlanOutcomeForInspection(
  state: GameState,
  perspective: PlayerId,
  depth: number,
  config: CpuAiProfileConfig,
  context: TerminalPlanEvaluationContext,
): TerminalPlanOutcome {
  const opponent = opponentOf(perspective);
  if (state.winner || state.pendingLevelUp || state.currentPlayer !== opponent) {
    return { delta: terminalPlanStateDelta(state, perspective, config, context), handoffState: state };
  }

  let worst: TerminalPlanOutcome = {
    delta: evaluateOpponentHandoffDelta(state, perspective, config, context),
    handoffState: terminalHandoffState(state, opponent, config, context),
  };
  if (depth <= 0) {
    return worst;
  }

  for (const candidate of opponentTerminalPlanCandidates(state, perspective, config, context)) {
    const outcome = evaluateOpponentTerminalPlanOutcomeForInspection(
      candidate.after,
      perspective,
      depth - 1,
      config,
      context,
    );
    if (outcome.delta < worst.delta) {
      worst = outcome;
    }
  }
  return worst;
}

function evaluateOpponentHandoffDelta(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  context: TerminalPlanEvaluationContext,
): number {
  const handoffState = terminalHandoffState(state, opponentOf(perspective), config, context);
  return terminalPlanStateDelta(handoffState, perspective, config, context);
}

function opponentTerminalPlanCandidates(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  context: TerminalPlanEvaluationContext,
): EvaluatedDecision[] {
  const opponent = opponentOf(perspective);
  const beforeScore = evaluateState(state, perspective, config.weights);
  const evaluated = evaluateImmediateCpuDecisionsCached(state, opponent, config, context);
  const candidates = evaluated
    .filter((candidate) => candidate.decision.type !== "end_turn")
    .map((candidate) => ({
      candidate,
      immediateLoss: beforeScore - evaluateState(candidate.after, perspective, config.weights),
    }))
    .sort(
      (a, b) =>
        b.immediateLoss - a.immediateLoss ||
        compareTieBreak(a.candidate.decision, b.candidate.decision, a.candidate.index, b.candidate.index),
    )
    .slice(0, config.sameTurnOpponentTerminalPlanWidth)
    .map(({ candidate }) => candidate);
  const endTurn = evaluated.find((candidate) => candidate.decision.type === "end_turn");
  if (endTurn && !candidates.some((candidate) => candidate.index === endTurn.index)) {
    candidates.push(endTurn);
  }
  return candidates;
}

function terminalPlanCandidates(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  context?: TerminalPlanEvaluationContext,
): EvaluatedDecision[] {
  const evaluated = evaluateImmediateCpuDecisionsCached(state, perspective, config, context);
  const candidates = evaluated
    .filter((candidate) => candidate.decision.type !== "end_turn" && candidate.totalScore > config.beamScoreThreshold)
    .sort(
      (a, b) =>
        b.totalScore - a.totalScore || compareTieBreak(a.decision, b.decision, a.index, b.index),
    )
    .slice(0, config.sameTurnTerminalPlanWidth);
  const coveredCandidates = addTerminalPlanCoverageCandidates(state, candidates, evaluated, config);
  const endTurn = evaluated.find((candidate) => candidate.decision.type === "end_turn");
  if (endTurn && !coveredCandidates.some((candidate) => candidate.index === endTurn.index)) {
    coveredCandidates.push(endTurn);
  }
  return coveredCandidates;
}

function addTerminalPlanCoverageCandidates(
  state: GameState,
  candidates: EvaluatedDecision[],
  evaluated: readonly EvaluatedDecision[],
  config: CpuAiProfileConfig,
): EvaluatedDecision[] {
  if (!config.selectTerminalPlan) {
    return candidates;
  }

  const covered = [...candidates];
  const seen = new Set(covered.map((candidate) => candidate.index));
  const appendBest = (predicate: (candidate: EvaluatedDecision) => boolean, minScore: number) => {
    const best = evaluated
      .filter((candidate) => !seen.has(candidate.index) && candidate.totalScore >= minScore && predicate(candidate))
      .sort(
        (a, b) =>
          b.totalScore - a.totalScore || compareTieBreak(a.decision, b.decision, a.index, b.index),
      )[0];
    if (best) {
      covered.push(best);
      seen.add(best.index);
    }
  };
  const appendFrontPressureEscapeCandidates = () => {
    const seenAfter = new Set(covered.map((candidate) => terminalPlanStateKey(candidate.after)));
    let added = 0;
    const ranked = evaluated
      .map((candidate) => ({ candidate, pressureScore: whiteMirrorFrontPressureEscapeScore(state, candidate) }))
      .filter(({ candidate, pressureScore }) => !seen.has(candidate.index) && candidate.totalScore >= -100 && pressureScore > 0)
      .sort(
        (a, b) =>
          b.candidate.totalScore + b.pressureScore * 0.2 - (a.candidate.totalScore + a.pressureScore * 0.2) ||
          compareTieBreak(a.candidate.decision, b.candidate.decision, a.candidate.index, b.candidate.index),
      );
    for (const { candidate } of ranked) {
      const afterKey = terminalPlanStateKey(candidate.after);
      if (seenAfter.has(afterKey)) {
        continue;
      }
      covered.push(candidate);
      seen.add(candidate.index);
      seenAfter.add(afterKey);
      added += 1;
      if (added >= 3) {
        break;
      }
    }
  };

  appendBest((candidate) => candidate.decision.type === "focus", -20);
  appendBest(
    (candidate) => candidate.decision.type === "master_action" && candidate.decision.actionId === "shield",
    10,
  );
  if (config.terminalPlanRolloutAllowFrontFocusStripAttack) {
    appendBest((candidate) => isWhiteMirrorEnemyFrontFocusStripAttackSelection(state, candidate), -80);
    appendFrontPressureEscapeCandidates();
  }
  return covered;
}

function isWhiteMirrorFrontPressureEscapeSelection(state: GameState, candidate: EvaluatedDecision): boolean {
  return whiteMirrorFrontPressureEscapeScore(state, candidate) > 0;
}

function isWhiteMirrorLateDeckRepositionMoveSelection(
  state: GameState,
  perspective: PlayerId,
  candidate: EvaluatedDecision,
): boolean {
  const decision = candidate.decision;
  if (
    decision.type !== "move" ||
    !isWhiteMirrorState(state, perspective) ||
    state.turnNumber < 18 ||
    state.players[perspective].deck.length > 6 ||
    state.players[opponentOf(perspective)].deck.length > 6
  ) {
    return false;
  }

  const fromSlot = state.slots[decision.fromSlotKey];
  const toSlot = state.slots[decision.toSlotKey];
  if (fromSlot.owner !== perspective || toSlot.owner !== perspective || fromSlot.row === toSlot.row) {
    return false;
  }

  const frontSlotKey = fromSlot.row === "front" ? decision.fromSlotKey : decision.toSlotKey;
  const backSlotKey = fromSlot.row === "back" ? decision.fromSlotKey : decision.toSlotKey;
  const frontBefore = state.slots[frontSlotKey].monster;
  const backBefore = state.slots[backSlotKey].monster;
  const frontAfter = candidate.after.slots[frontSlotKey].monster;
  const backAfter = candidate.after.slots[backSlotKey].monster;
  if (
    !frontBefore ||
    !backBefore ||
    !frontAfter ||
    !backAfter ||
    frontBefore.owner !== perspective ||
    backBefore.owner !== perspective ||
    frontAfter.instanceId !== backBefore.instanceId ||
    backAfter.instanceId !== frontBefore.instanceId
  ) {
    return false;
  }

  const backTrait = getMonsterAiTrait(backBefore.cardId);
  const frontTrait = getMonsterAiTrait(frontBefore.cardId);
  const durableFront = backBefore.hp >= frontBefore.hp + 2 || backTrait.role === "front";
  const preservesBacklineWork = frontTrait.role === "back" || frontBefore.actionLimit > 1;
  return durableFront && preservesBacklineWork;
}

function isWhiteMirrorCloseoutHoldEndTurnSelection(
  state: GameState,
  perspective: PlayerId,
  candidate: EvaluatedDecision,
): boolean {
  return candidate.decision.type === "end_turn" && isWhiteMirrorCloseoutHoldState(state, perspective);
}

function isWhiteMirrorCloseoutHoldEndTurnFallback(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision,
): boolean {
  if (!isWhiteMirrorCloseoutHoldState(state, perspective)) {
    return false;
  }
  if (fallback.after.winner || fallback.after.pendingLevelUp || fallback.decision.type !== "attack") {
    return false;
  }
  if (fallback.decision.action.target.kind !== "monster") {
    return false;
  }
  const targetSlotKey = fallback.decision.action.target.slotKey;
  const beforeMonster = state.slots[targetSlotKey].monster;
  const afterMonster = fallback.after.slots[targetSlotKey].monster;
  if (
    !beforeMonster ||
    !afterMonster ||
    beforeMonster.owner !== opponentOf(perspective) ||
    afterMonster.owner !== beforeMonster.owner ||
    afterMonster.instanceId !== beforeMonster.instanceId ||
    !beforeMonster.focused ||
    afterMonster.focused ||
    afterMonster.hp !== beforeMonster.hp
  ) {
    return false;
  }
  if (masterDamageFromTransition(state, fallback.after, perspective) > 0) {
    return false;
  }
  if (removesEnemyMonster(state, fallback.after, targetSlotKey, perspective)) {
    return false;
  }

  const opponent = opponentOf(perspective);
  const ownHp = state.players[perspective].masterHp;
  const beforeThreat = buildThreatModel(state, opponent).masterDamage[perspective];
  return beforeThreat < ownHp;
}

function isWhiteMirrorCloseoutHoldState(state: GameState, perspective: PlayerId): boolean {
  if (!isWhiteMirrorState(state, perspective) || state.turnNumber < 12) {
    return false;
  }
  const opponent = opponentOf(perspective);
  const own = state.players[perspective];
  const enemy = state.players[opponent];
  if (enemy.masterHp > 2 || own.masterHp <= enemy.masterHp) {
    return false;
  }
  return buildThreatModel(state, perspective).masterDamage[opponent] >= enemy.masterHp;
}

function removesEnemyMonster(
  before: GameState,
  after: GameState,
  targetSlotKey: SlotKey,
  perspective: PlayerId,
): boolean {
  const beforeMonster = before.slots[targetSlotKey].monster;
  const afterMonster = after.slots[targetSlotKey].monster;
  const opponent = opponentOf(perspective);
  return !!(
    beforeMonster?.owner === opponent &&
    (!afterMonster || afterMonster.owner !== opponent || afterMonster.instanceId !== beforeMonster.instanceId)
  );
}

function isWhiteMirrorLateDeckHoldEndTurnSelection(
  state: GameState,
  perspective: PlayerId,
  candidate: EvaluatedDecision,
): boolean {
  return candidate.decision.type === "end_turn" && isWhiteMirrorLateDeckHoldState(state, perspective);
}

function isWhiteMirrorShieldHoldEndTurnFallback(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision,
): boolean {
  if (!isWhiteMirrorShieldHoldEndTurnState(state, perspective) || !isShieldDecision(fallback.decision)) {
    return false;
  }
  if (fallback.after.winner || fallback.after.pendingLevelUp || fallback.decision.target.kind !== "monster") {
    return false;
  }
  const targetSlot = state.slots[fallback.decision.target.slotKey];
  if (targetSlot.owner !== perspective || !targetSlot.monster) {
    return false;
  }
  const opponentThreat = buildThreatModel(state, opponentOf(perspective)).masterDamage[perspective];
  return opponentThreat < state.players[perspective].masterHp;
}

function isWhiteMirrorShieldHoldEndTurnState(state: GameState, perspective: PlayerId): boolean {
  if (!isWhiteMirrorState(state, perspective) || state.turnNumber < 18) {
    return false;
  }
  const opponent = opponentOf(perspective);
  const own = state.players[perspective];
  const enemy = state.players[opponent];
  return (
    own.deck.length <= 8 &&
    enemy.deck.length <= 8 &&
    Math.abs(own.deck.length - enemy.deck.length) <= 1 &&
    own.masterHp + 1 >= enemy.masterHp &&
    own.stones >= getMasterActionCost("shield")
  );
}

function isWhiteMirrorLateDeckHoldEndTurnFallback(
  state: GameState,
  perspective: PlayerId,
  fallback: EvaluatedDecision,
): boolean {
  if (!isWhiteMirrorLateDeckHoldState(state, perspective)) {
    return false;
  }
  const decision = fallback.decision;
  if (fallback.after.winner || fallback.after.pendingLevelUp) {
    return false;
  }
  if (masterDamageFromTransition(state, fallback.after, perspective) > 0) {
    return false;
  }
  if (isLateDeckNonLethalEnemyFrontPressureDecision(state, fallback, perspective)) {
    return true;
  }
  if (decision.type !== "master_action" || decision.actionId !== "master_attack" || decision.target.kind !== "monster") {
    return false;
  }
  const opponent = opponentOf(perspective);
  const targetSlot = state.slots[decision.target.slotKey];
  const beforeMonster = targetSlot.monster;
  const afterMonster = fallback.after.slots[decision.target.slotKey].monster;
  if (
    targetSlot.row !== "front" ||
    beforeMonster?.owner !== opponent ||
    !afterMonster ||
    afterMonster.owner !== opponent ||
    afterMonster.instanceId !== beforeMonster.instanceId ||
    afterMonster.hp >= beforeMonster.hp
  ) {
    return false;
  }
  const stoneSpent = state.players[perspective].stones - fallback.after.players[perspective].stones;
  if (stoneSpent < 2) {
    return false;
  }
  const beforeThreat = buildThreatModel(state, opponent).masterDamage[perspective];
  const afterThreat = buildThreatModel(fallback.after, opponent).masterDamage[perspective];
  return afterThreat >= beforeThreat;
}

function isLateDeckNonLethalEnemyFrontPressureDecision(
  state: GameState,
  candidate: EvaluatedDecision,
  perspective: PlayerId,
): boolean {
  const decision = candidate.decision;
  if (decision.type !== "attack" || decision.action.target.kind !== "monster") {
    return false;
  }
  const opponent = opponentOf(perspective);
  const targetSlotKey = decision.action.target.slotKey;
  const targetSlot = state.slots[targetSlotKey];
  const beforeMonster = targetSlot.monster;
  const afterMonster = candidate.after.slots[targetSlotKey].monster;
  if (
    targetSlot.row !== "front" ||
    beforeMonster?.owner !== opponent ||
    !afterMonster ||
    afterMonster.owner !== opponent ||
    afterMonster.instanceId !== beforeMonster.instanceId
  ) {
    return false;
  }
  return (
    afterMonster.hp < beforeMonster.hp ||
    (beforeMonster.focused && !afterMonster.focused) ||
    (beforeMonster.shielded && !afterMonster.shielded)
  );
}

function isWhiteMirrorLateDeckHoldState(state: GameState, perspective: PlayerId): boolean {
  if (!isWhiteMirrorState(state, perspective) || state.turnNumber < 18) {
    return false;
  }
  const opponent = opponentOf(perspective);
  const own = state.players[perspective];
  const enemy = state.players[opponent];
  const deathClockMargin = deckoutDeathClockHalfTurns(state, opponent) -
    deckoutDeathClockHalfTurns(state, perspective);
  const hpDeficit = Math.max(0, enemy.masterHp - own.masterHp);
  if (
    own.deck.length > 6 ||
    enemy.deck.length > 6 ||
    enemy.deck.length > own.deck.length + 1 ||
    own.stones < 4 ||
    deathClockMargin > 3 ||
    (hpDeficit > 2 && deathClockMargin > 0)
  ) {
    return false;
  }
  const opponentMasterDamage = buildThreatModel(state, opponent).masterDamage[perspective];
  return opponentMasterDamage < own.masterHp;
}

function isRotationMagicDecision(state: GameState, perspective: PlayerId, decision: CpuDecision): boolean {
  if (decision.type !== "magic") {
    return false;
  }
  const card = state.players[perspective].hand.find(
    (handCard) => handCard.instanceId === decision.action.handInstanceId,
  );
  return !!card && getCardName(card.cardId) === "ローテーション";
}

function isWhiteMirrorFrontPressureHoldEndTurnSelection(
  state: GameState,
  perspective: PlayerId,
  candidate: EvaluatedDecision,
): boolean {
  if (
    candidate.decision.type !== "end_turn" ||
    candidate.totalScore < -120 ||
    !isWhiteMirrorState(state, perspective) ||
    !hasEnemyFrontThreatSource(state, perspective)
  ) {
    return false;
  }

  return FIELD_ORDER_BY_PLAYER[perspective].some((slotKey) => {
    const before = state.slots[slotKey];
    const after = candidate.after.slots[slotKey];
    const beforeMonster = before.monster;
    const afterMonster = after.monster;
    return (
      before.row === "front" &&
      beforeMonster?.owner === perspective &&
      beforeMonster.status === "active" &&
      !beforeMonster.focused &&
      beforeMonster.actionCount < beforeMonster.actionLimit &&
      afterMonster?.owner === perspective &&
      afterMonster.instanceId === beforeMonster.instanceId &&
      afterMonster.focused
    );
  });
}

function whiteMirrorFrontPressureEscapeScore(state: GameState, candidate: EvaluatedDecision): number {
  const perspective = state.currentPlayer;
  if (
    !isWhiteMirrorState(state, perspective) ||
    state.players[opponentOf(perspective)].stones > 1 ||
    whiteMirrorEnemyFrontFormationThreat(state, perspective) < 120
  ) {
    return 0;
  }
  if (candidate.decision.type === "magic") {
    return whiteMirrorFrontPressureWarpScore(state, candidate, perspective);
  }
  return 0;
}

function whiteMirrorFrontPressureWarpScore(
  state: GameState,
  candidate: EvaluatedDecision,
  perspective: PlayerId,
): number {
  const decision = candidate.decision;
  if (decision.type !== "magic") {
    return 0;
  }
  const card = state.players[perspective].hand.find((handCard) => handCard.instanceId === decision.action.handInstanceId);
  if (!card || getCardName(card.cardId) !== "ワープ") {
    return 0;
  }
  const primaryTarget = decision.action.target;
  const secondaryTarget = decision.action.secondaryTarget;
  if (primaryTarget.kind !== "monster" || secondaryTarget?.kind !== "monster") {
    return 0;
  }
  const opponent = opponentOf(perspective);
  const primarySlot = state.slots[primaryTarget.slotKey];
  const secondarySlot = state.slots[secondaryTarget.slotKey];
  if (
    primarySlot.owner !== opponent ||
    secondarySlot.owner !== opponent ||
    primarySlot.row === secondarySlot.row
  ) {
    return 0;
  }
  const beforeThreat = whiteMirrorEnemyFrontFormationThreat(state, perspective);
  const threatDrop = Math.max(0, beforeThreat - whiteMirrorEnemyFrontFormationThreat(candidate.after, perspective));
  const frontSlotKey = primarySlot.row === "front" ? primaryTarget.slotKey : secondaryTarget.slotKey;
  const incomingSlotKey = primarySlot.row === "front" ? secondaryTarget.slotKey : primaryTarget.slotKey;
  const frontMonster = state.slots[frontSlotKey].monster;
  const incomingMonster = state.slots[incomingSlotKey].monster;
  const levelDrop = Math.max(0, (frontMonster?.level ?? 0) - (incomingMonster?.level ?? 0));
  if (threatDrop < 40 && levelDrop <= 0) {
    return 0;
  }
  const incomingActionPenalty = incomingMonster && monsterActionsRemaining(incomingMonster) > 0 ? 40 : 0;
  const incomingLevelPenalty = incomingMonster ? Math.max(0, incomingMonster.level - 1) * 60 : 0;
  const incomingDamagePenalty = directMasterDamageFromSlot(candidate.after, frontSlotKey, opponent) * 35;
  const frontMaxLevel = frontMonster ? getMonsterDef(frontMonster.cardId).maxLevel : 1;
  const levelDropBonus =
    levelDrop * 110 +
    (frontMonster && frontMonster.level >= frontMaxLevel && frontMaxLevel > 1 ? 55 : 0);
  return Math.max(0,
    70 +
    threatDrop * 0.8 +
    whiteMirrorFrontSlotThreat(state, frontSlotKey, perspective) * 0.15 +
    levelDropBonus +
    Math.max(0, candidate.totalScore) * 0.05 -
    incomingActionPenalty -
    incomingLevelPenalty -
    incomingDamagePenalty
  );
}

function whiteMirrorEnemyFrontFormationThreat(state: GameState, perspective: PlayerId): number {
  const opponent = opponentOf(perspective);
  return FIELD_ORDER_BY_PLAYER[opponent].reduce((total, slotKey) => {
    return total + whiteMirrorFrontSlotThreat(state, slotKey, perspective);
  }, 0);
}

function whiteMirrorFrontSlotThreat(state: GameState, slotKey: SlotKey, perspective: PlayerId): number {
  const slot = state.slots[slotKey];
  const monster = slot.monster;
  if (!monster || slot.row !== "front" || monster.status !== "active" || monster.owner !== opponentOf(perspective)) {
    return 0;
  }
  const maxLevel = getMonsterDef(monster.cardId).maxLevel;
  const actionScale = monsterActionsRemaining(monster) > 0 ? 1 : 0.35;
  const levelPressure = (monster.level * 55 + (monster.level >= maxLevel && maxLevel > 1 ? 45 : 0)) * actionScale;
  const focusPressure = monster.focused ? 34 : 0;
  const masterDamagePressure = directMasterDamageFromSlot(state, slotKey, monster.owner) * 42 * actionScale;
  return levelPressure + focusPressure + masterDamagePressure + monsterValue(state, slotKey) * 0.12;
}

function whiteMirrorFrontPressureEscapePlannerBonus(
  state: GameState,
  candidate: EvaluatedDecision,
  fallback: EvaluatedDecision | undefined,
  perspective: PlayerId,
): number {
  if (fallback?.decision.type !== "focus") {
    return 0;
  }
  const pressureScore = whiteMirrorFrontPressureEscapeScore(state, candidate);
  if (pressureScore <= 0) {
    return 0;
  }
  if (frontPressureWarpIncomingLevel(state, candidate) >= 2) {
    return Math.min(80, pressureScore * 0.5);
  }
  return Math.min(260, pressureScore * 1.2);
}

function frontPressureWarpIncomingLevel(state: GameState, candidate: EvaluatedDecision): number {
  const decision = candidate.decision;
  if (decision.type !== "magic") {
    return 0;
  }
  const primaryTarget = decision.action.target;
  const secondaryTarget = decision.action.secondaryTarget;
  if (primaryTarget.kind !== "monster" || secondaryTarget?.kind !== "monster") {
    return 0;
  }
  const primarySlot = state.slots[primaryTarget.slotKey];
  const secondarySlot = state.slots[secondaryTarget.slotKey];
  if (primarySlot.row === secondarySlot.row) {
    return 0;
  }
  const incomingSlotKey = primarySlot.row === "front" ? secondaryTarget.slotKey : primaryTarget.slotKey;
  return state.slots[incomingSlotKey].monster?.level ?? 0;
}

function monsterActionsRemaining(monster: Pick<MonsterState, "actionCount" | "actionLimit">): number {
  return Math.max(0, monster.actionLimit - monster.actionCount);
}

function evaluateImmediateCpuDecisionsCached(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  context?: TerminalPlanEvaluationContext,
): EvaluatedDecision[] {
  if (!context) {
    return evaluateImmediateCpuDecisions(state, perspective, config);
  }
  const cacheKey = terminalPlanCacheKey("immediate", state, perspective, 0);
  const cached = context.immediateDecisionCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const evaluated = evaluateImmediateCpuDecisions(state, perspective, config);
  context.immediateDecisionCache.set(cacheKey, evaluated);
  return evaluated;
}

function terminalPlanCacheKey(kind: string, state: GameState, perspective: PlayerId, depth: number): string {
  return `${kind}:${perspective}:${depth}:${terminalPlanStateKey(state)}`;
}

function terminalPlanStateKey(state: GameState): string {
  return JSON.stringify({
    currentPlayer: state.currentPlayer,
    firstPlayer: state.firstPlayer,
    turnNumber: state.turnNumber,
    randomSeed: state.randomSeed,
    deckoutOccurred: state.deckoutOccurred ?? false,
    winner: state.winner ?? "",
    pendingLevelUp: state.pendingLevelUp ?? null,
    turnMoveHistory: state.turnMoveHistory ?? [],
    turnMasterActionHistory: state.turnMasterActionHistory ?? [],
    masterActionsExchangeExpiresOnStartOf: state.masterActionsExchangeExpiresOnStartOf ?? "",
    players: {
      player: terminalPlanPlayerStateKey(state.players.player),
      cpu: terminalPlanPlayerStateKey(state.players.cpu),
    },
    slots: ALL_FIELD_ORDER.map((slotKey) => [slotKey, state.slots[slotKey].monster ?? null]),
  });
}

function terminalPlanPlayerStateKey(player: PlayerState): object {
  return {
    id: player.id,
    masterId: player.masterId,
    masterHp: player.masterHp,
    stones: player.stones,
    masterPowerBonus: player.masterPowerBonus ?? 0,
    masterFrozen: player.masterFrozen ?? false,
    hand: player.hand,
    deck: player.deck,
    discard: player.discard,
    turnsStarted: player.turnsStarted,
    masterActionsExchanged: player.masterActionsExchanged ?? false,
  };
}

function evaluateImmediateCpuDecisions(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
): EvaluatedDecision[] {
  const beforeScore = evaluateState(state, perspective, config.weights);
  const beforeFutureScore = evaluateConfiguredFutureTacticalValue(state, perspective, false, config);
  return listCpuDecisions(state, config.weights).flatMap((decision, index) => {
    const transition = evaluateDecisionTransition(state, decision, perspective, beforeScore, beforeFutureScore, false, config);
    return transition ? [{ decision, totalScore: transition.totalScore, index, after: transition.after }] : [];
  });
}

export function listCpuDecisions(
  state: GameState,
  weights: AiEvaluationWeights = DEFAULT_AI_EVALUATION_WEIGHTS,
): CpuDecision[] {
  if (state.winner || state.pendingLevelUp) {
    return [createEndTurnDecision()];
  }

  const attackDecisions = listAttackDecisions(state, weights);
  const mustUseSafeBacklineFollowThrough = attackDecisions.some(
    (decision) =>
      decision.type === "attack" &&
      hasWhiteMirrorSafeBacklineFollowThroughFrontChip(state, decision.action.attackerSlotKey),
  );
  return [
    ...attackDecisions,
    ...listMasterActionDecisions(state, weights),
    ...listMagicDecisions(state, weights),
    ...listSummonDecisions(state),
    ...listMoveDecisions(state),
    ...listFocusDecisions(state),
    ...(mustUseSafeBacklineFollowThrough ? [] : [createEndTurnDecision()]),
  ];
}

function listMasterDamagePlanDecisions(state: GameState, weights: AiEvaluationWeights): CpuDecision[] {
  const decisions = [
    ...listMasterDamageAttackDecisions(state, weights),
    ...listMasterDamageMasterActionDecisions(state, weights),
    ...listMasterDamageMagicDecisions(state, weights),
    ...listMasterDamageSummonDecisions(state),
  ];
  const seen = new Set<string>();
  return decisions
    .filter((decision) => {
      const key = cpuDecisionKey(decision);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .sort((a, b) => masterDamagePlanDecisionPriority(b) - masterDamagePlanDecisionPriority(a));
}

function listMasterDamageAttackDecisions(state: GameState, weights: AiEvaluationWeights): CpuDecision[] {
  const decisions: CpuDecision[] = [];
  const playerId = state.currentPlayer;
  const opponent = opponentOf(state.currentPlayer);

  for (const slotKey of FIELD_ORDER_BY_PLAYER[playerId]) {
    const monster = state.slots[slotKey].monster;
    if (!monster?.status || monster.status !== "active" || monster.actionCount >= monster.actionLimit) {
      continue;
    }

    for (const command of getMonsterCommands(monster)) {
      for (const target of getCommandTargets(state, slotKey, command.id)) {
        if (target.kind !== "master" || target.playerId !== opponent) {
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

function listMasterDamageMasterActionDecisions(state: GameState, weights: AiEvaluationWeights): CpuDecision[] {
  const decisions: CpuDecision[] = [];
  const playerId = state.currentPlayer;
  const opponent = opponentOf(playerId);
  const actionIds = getCurrentMasterActionIds(state);

  if (actionIds.includes("master_attack")) {
    const target: Target = { kind: "master", playerId: opponent };
    if (getMasterActionTargets(state, "master_attack").some((candidate) => isSameTargetForAi(candidate, target))) {
      const decision = createMasterAttackDecision(state, target);
      if (decision) {
        decisions.push(decision);
      }
    }
  }

  if (actionIds.includes("wake_up")) {
    decisions.push(...listMasterDamageWakeUpDecisions(state));
  }

  if (actionIds.includes("berserk_power")) {
    decisions.push(...listMasterDamageBerserkDecisions(state, weights));
  }

  return decisions;
}

function listMasterDamageWakeUpDecisions(state: GameState): CpuDecision[] {
  const playerId = state.currentPlayer;
  const beforeDirectDamage = bestDirectMasterDamageForPlayer(state, playerId);
  return getMasterActionTargets(state, "wake_up")
    .filter((target): target is Extract<Target, { kind: "monster" }> => {
      if (target.kind !== "monster") {
        return false;
      }
      const monster = state.slots[target.slotKey].monster;
      return !!monster && monster.owner === playerId && monster.status === "prepared";
    })
    .flatMap((target): CpuDecision[] => {
      let after: GameState;
      try {
        after = useMasterAction(state, "wake_up", target);
      } catch {
        return [];
      }
      const afterDirectDamage = bestDirectMasterDamageForPlayer(after, playerId);
      if (afterDirectDamage <= beforeDirectDamage && bestMasterLethalOpportunityScore(after, target.slotKey) <= 0) {
        return [];
      }
      return [{
        type: "master_action",
        actionId: "wake_up",
        target,
        reason: "最大打点ラインで準備中の味方を起こすためウェイクアップ",
        score: 420 + afterDirectDamage * 120,
      }];
    });
}

function listMasterDamageBerserkDecisions(state: GameState, weights: AiEvaluationWeights): CpuDecision[] {
  const playerId = state.currentPlayer;
  const beforeDirectDamage = bestDirectMasterDamageForPlayer(state, playerId);
  return getMasterActionTargets(state, "berserk_power")
    .filter((target): target is Extract<Target, { kind: "monster" }> => {
      if (target.kind !== "monster") {
        return false;
      }
      const monster = state.slots[target.slotKey].monster;
      return !!monster && monster.owner === playerId && monster.status === "active" && !monster.berserkPower;
    })
    .flatMap((target): CpuDecision[] => {
      let after: GameState;
      try {
        after = useMasterAction(state, "berserk_power", target);
      } catch {
        return [];
      }
      const afterDirectDamage = bestDirectMasterDamageForPlayer(after, playerId);
      if (afterDirectDamage <= beforeDirectDamage) {
        return [];
      }
      return [{
        type: "master_action",
        actionId: "berserk_power",
        target,
        reason: "最大打点ラインで相手マスターへの打点を伸ばすためバーサクパワー",
        score: 160 + masterDamageScore(state, playerId, afterDirectDamage - beforeDirectDamage, weights),
      }];
    });
}

function listMasterDamageMagicDecisions(state: GameState, weights: AiEvaluationWeights): CpuDecision[] {
  const decisions: CpuDecision[] = [];
  const playerId = state.currentPlayer;
  const beforeScore = evaluateState(state, playerId, weights);
  const beforeDirectDamage = bestDirectMasterDamageForPlayer(state, playerId);

  for (const card of state.players[playerId].hand) {
    const def = getCardDef(card.cardId);
    if (def.type !== "magic") {
      continue;
    }
    const trait = getMagicAiTrait(card.cardId);
    if (!trait || (trait.effectKind !== "damage" && trait.effectKind !== "wake" && trait.effectKind !== "buff")) {
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
        if (!isMasterDamagePlanMagicCandidate(state, after, action, card.cardId, beforeDirectDamage)) {
          continue;
        }
        decisions.push({
          type: "magic",
          action,
          reason: magicReason(state, after, action),
          score: Math.max(120, scoreMagicDecision(state, after, action, beforeScore, weights)),
        });
      }
    }
  }

  return decisions;
}

function isMasterDamagePlanMagicCandidate(
  before: GameState,
  after: GameState,
  action: MagicAction,
  cardId: string,
  beforeDirectDamage: number,
): boolean {
  const playerId = before.currentPlayer;
  const opponent = opponentOf(playerId);
  if (after.winner === playerId || after.players[opponent].masterHp < before.players[opponent].masterHp) {
    return true;
  }
  if (action.target.kind !== "monster") {
    return false;
  }
  const beforeTarget = before.slots[action.target.slotKey].monster;
  const afterTarget = after.slots[action.target.slotKey].monster;
  if (!beforeTarget || beforeTarget.owner !== playerId || !afterTarget || afterTarget.owner !== playerId) {
    return false;
  }
  const trait = getMagicAiTrait(cardId);
  if (trait?.effectKind !== "wake" && trait?.effectKind !== "buff") {
    return false;
  }
  return bestDirectMasterDamageForPlayer(after, playerId) > beforeDirectDamage;
}

function listMasterDamageSummonDecisions(state: GameState): CpuDecision[] {
  const decisions: CpuDecision[] = [];
  const playerId = state.currentPlayer;
  for (const card of state.players[playerId].hand) {
    const def = getCardDef(card.cardId);
    if (def.type !== "monster") {
      continue;
    }
    for (const slotKey of SUMMON_SLOT_ORDER_BY_PLAYER[playerId]) {
      if (!canSummonTo(state, card.instanceId, slotKey) || !summonWakeCreatesMasterPressure(state, card.instanceId, slotKey)) {
        continue;
      }
      decisions.push({
        type: "summon",
        handInstanceId: card.instanceId,
        slotKey,
        reason: "最大打点ラインでウェイクアップにつなげるため召喚",
        score: Math.max(80, scoreSummon(state, card, slotKey)),
      });
    }
  }
  return decisions;
}

function summonWakeCreatesMasterPressure(state: GameState, handInstanceId: string, slotKey: SlotKey): boolean {
  const wakeCost = getMasterActionCost("wake_up");
  if (!getCurrentMasterActionIds(state).includes("wake_up") || state.players[state.currentPlayer].stones < 1 + wakeCost) {
    return false;
  }

  try {
    const summoned = summonMonster(state, handInstanceId, slotKey);
    const target: Target = { kind: "monster", slotKey };
    if (!getMasterActionTargets(summoned, "wake_up").some((candidate) => isSameTargetForAi(candidate, target))) {
      return false;
    }
    const woken = useMasterAction(summoned, "wake_up", target);
    return bestDirectMasterDamageForPlayer(woken, state.currentPlayer) > bestDirectMasterDamageForPlayer(state, state.currentPlayer);
  } catch {
    return false;
  }
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

function applyCpuDecisionForPlanning(state: GameState, decision: CpuDecision): GameState {
  if (decision.type === "attack") {
    return attackWithCommand(state, decision.action);
  }
  if (decision.type === "master_action") {
    return useMasterAction(state, decision.actionId, decision.target);
  }
  if (decision.type === "summon") {
    return summonMonster(state, decision.handInstanceId, decision.slotKey);
  }
  if (decision.type === "focus") {
    return focusMonster(state, decision.slotKey);
  }
  if (decision.type === "magic") {
    return playMagic(state, decision.action);
  }
  if (decision.type === "move") {
    return moveMonster(state, decision.fromSlotKey, decision.toSlotKey);
  }
  return endTurn(state);
}

function appendDecisionReasonLog(state: GameState, decision: CpuDecision): GameState {
  const next = structuredClone(state) as GameState;
  const actor = next.currentPlayer === "cpu" ? "CPU" : "プレイヤーAI";
  appendLog(next, `${actor}判断: ${decision.reason}${formatDecisionTraceLog(decision)}`);
  appendAiDecisionReviewEntry(next, state, decision, cpuDecisionKey(decision));
  if (decision.reason.includes("ターンプラン探索") && decision.reason.includes("rollout")) {
    next.turnAiRolloutDecisionHistory = [
      ...(next.turnAiRolloutDecisionHistory ?? []),
      { playerId: next.currentPlayer, turnNumber: next.turnNumber },
    ];
  }
  return next;
}

function formatDecisionTraceLog(decision: CpuDecision): string {
  const trace = decision.trace;
  const selectedScore = Math.round(trace?.totalScore ?? decision.score);
  const baseScore = Math.round(trace?.baseScore ?? decision.score);
  const scoreText = trace?.totalScore === undefined || selectedScore === baseScore
    ? `選択${selectedScore}点`
    : `選択${selectedScore}点/単手${baseScore}点`;
  const alternatives = trace?.alternatives?.length
    ? ` / 見送り候補: ${trace.alternatives
        .slice(0, 2)
        .map((candidate) =>
          `${candidate.label}${Math.round(candidate.totalScore)}点(${decisionScoreGapLabel(candidate.scoreGap)})`)
        .join("、")}`
    : "";
  return ` / 評価: ${scoreText}${alternatives}`;
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
  score += whiteMirrorDeckoutClockScore(state, perspective);

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

function whiteMirrorDeckoutClockScore(state: GameState, perspective: PlayerId): number {
  if (!isWhiteMirrorState(state, perspective) || state.winner || state.pendingLevelUp || state.turnNumber < 16) {
    return 0;
  }

  const opponent = opponentOf(perspective);
  const own = state.players[perspective];
  const enemy = state.players[opponent];
  const minDeck = Math.min(own.deck.length, enemy.deck.length);
  const maxDeck = Math.max(own.deck.length, enemy.deck.length);
  if (minDeck > 4 || maxDeck > 6) {
    return 0;
  }

  const ownDeathClock = deckoutDeathClockHalfTurns(state, perspective);
  const enemyDeathClock = deckoutDeathClockHalfTurns(state, opponent);
  const margin = enemyDeathClock - ownDeathClock;
  const urgency = Math.max(1, 5 - minDeck);
  if (margin > 0) {
    const hpDeficit = Math.max(0, enemy.masterHp - own.masterHp);
    return -Math.min(900, margin * (55 + urgency * 12) + hpDeficit * 18);
  }

  const hpLead = Math.max(0, own.masterHp - enemy.masterHp);
  return Math.min(650, -margin * (34 + urgency * 8) + hpLead * 8);
}

function deckoutDeathClockHalfTurns(state: GameState, playerId: PlayerId): number {
  const player = state.players[playerId];
  const nextStartHalfTurns = state.currentPlayer === playerId ? 2 : 1;
  return nextStartHalfTurns + (player.deck.length + Math.max(1, player.masterHp) - 1) * 2;
}

function evaluateConfiguredFutureTacticalValue(
  state: GameState,
  perspective: PlayerId,
  detailed: boolean,
  config: CpuAiProfileConfig,
): number {
  const base = evaluateFutureTacticalValue(state, perspective, detailed, config.weights) +
    whiteBackSlotFutureStateValue(state, perspective, config);
  if (!config.omniscient) {
    return base;
  }
  return base + evaluateOmniscientHiddenInfoValue(state, perspective, detailed, config) * config.omniscient.hiddenInfoWeight;
}

function whiteBackSlotFutureStateValue(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
): number {
  const value = config.tuning?.situationalBias?.whiteBackSlotFutureStateBonus ?? 0;
  if (value <= 0 || state.players[perspective].masterId !== "white" || state.winner) {
    return 0;
  }

  const top5BacklineWork = deckBacklineWorkCount(state, perspective, 5);
  if (top5BacklineWork <= 0) {
    return 0;
  }

  const emptyBackSlots = emptyBackSlotCountForPlayer(state, perspective);
  const noReachFrontBackSlots = noReachFrontBackSlotCountForPlayer(state, perspective);
  return (emptyBackSlots - noReachFrontBackSlots) * top5BacklineWork * value;
}

function evaluateOmniscientHiddenInfoValue(
  state: GameState,
  perspective: PlayerId,
  detailed: boolean,
  config: CpuAiProfileConfig,
): number {
  if (state.winner) {
    return 0;
  }

  const opponent = opponentOf(perspective);
  const ownNextDraw = nextDrawCardValue(state, perspective) * (detailed ? 0.12 : 0.06);
  const ownNextDrawThreat = nextDrawThreatValue(state, perspective, opponent, config.weights) * (detailed ? 0.18 : 0.08);
  const opponentNextDrawThreat = nextDrawThreatValue(state, opponent, perspective, config.weights) * (detailed ? 0.34 : 0.18);

  return ownNextDraw + ownNextDrawThreat - opponentNextDrawThreat;
}

function nextDrawCardValue(state: GameState, playerId: PlayerId): number {
  const topCard = state.players[playerId].deck[0];
  return topCard ? handCardKeepValue(state, topCard) : 0;
}

function nextDrawThreatValue(
  state: GameState,
  attackerId: PlayerId,
  defenderId: PlayerId,
  weights: AiEvaluationWeights,
): number {
  const topCard = state.players[attackerId].deck[0];
  if (!topCard) {
    return 0;
  }

  const beforeThreatModel = buildThreatModel(state, attackerId);
  const beforeMasterDamage = beforeThreatModel.masterDamage[defenderId];
  const beforeMonsterThreat = threatenedMonsterValueForPlayer(state, defenderId, beforeThreatModel);
  const withDraw = previewStateWithKnownNextDraw(state, attackerId);
  const afterThreatModel = buildThreatModel(withDraw, attackerId);
  const masterDamageGain = Math.max(0, afterThreatModel.masterDamage[defenderId] - beforeMasterDamage);
  const monsterThreatGain = Math.max(
    0,
    threatenedMonsterValueForPlayer(withDraw, defenderId, afterThreatModel) - beforeMonsterThreat,
  );

  return masterDamageGain * weights.masterDamageBase * 0.58 + monsterThreatGain * 0.3 + handCardKeepValue(withDraw, topCard) * 0.16;
}

function previewStateWithKnownNextDraw(state: GameState, playerId: PlayerId): GameState {
  const next = structuredClone(state) as GameState;
  const player = next.players[playerId];
  const [topCard, ...restDeck] = player.deck;
  if (!topCard) {
    return next;
  }

  player.deck = restDeck;
  player.hand = [...player.hand, topCard];
  next.currentPlayer = playerId;
  return next;
}

function evaluateOpponentResponsePenalty(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
): number {
  const opponentMasterDamagePlanPenalty = evaluateOpponentMasterDamagePlanPenalty(state, perspective, config.weights);
  const omniscient = config.omniscient;
  const opponent = opponentOf(perspective);
  if (
    !omniscient ||
    omniscient.opponentResponseDepth <= 0 ||
    state.winner ||
    state.pendingLevelUp ||
    state.currentPlayer !== opponent
  ) {
    return opponentMasterDamagePlanPenalty;
  }

  return (
    opponentMasterDamagePlanPenalty +
    omniscient.opponentResponseDiscount * evaluateOpponentResponseBeam(state, perspective, config, omniscient.opponentResponseDepth)
  );
}

function evaluateOpponentMasterDamagePlanPenalty(
  state: GameState,
  perspective: PlayerId,
  weights: AiEvaluationWeights,
): number {
  const opponent = opponentOf(perspective);
  if (
    state.winner === perspective ||
    state.pendingLevelUp ||
    state.currentPlayer !== opponent
  ) {
    return 0;
  }
  if (state.players[perspective].masterHp > MASTER_DAMAGE_PLAN_CLOSEOUT_HP) {
    return 0;
  }

  const plan = findMasterDamagePlan(state, opponent, weights, OPPONENT_MASTER_DAMAGE_RESPONSE_MAX_DEPTH);
  if (!plan.firstDecision || plan.damage <= 0) {
    return 0;
  }
  if (plan.lethal) {
    return 850_000 + Math.max(0, MASTER_DAMAGE_PLAN_MAX_DEPTH - plan.steps) * 250;
  }

  const remainingHp = state.players[perspective].masterHp - plan.damage;
  if (state.players[perspective].masterHp <= 4 && remainingHp <= 1) {
    return 220 + plan.damage * 40;
  }
  return 0;
}

function opponentMasterDamagePlanCommitmentPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  weights: AiEvaluationWeights,
): number {
  if (!isDeferredSetupDecision(decision) || after.winner || after.pendingLevelUp || after.currentPlayer !== perspective) {
    return 0;
  }
  if (
    after.players[perspective].masterHp > MASTER_DAMAGE_PLAN_CLOSEOUT_HP ||
    masterDamageFromTransition(before, after, perspective) > 0
  ) {
    return 0;
  }

  const handoff = handoffToOpponentForMasterDamagePlan(after, perspective);
  if (!handoff) {
    return 0;
  }
  const penalty = evaluateOpponentMasterDamagePlanPenalty(handoff, perspective, weights);
  return penalty >= 100_000 ? penalty : 0;
}

function opponentMasterDamagePlanReductionBonus(
  before: GameState,
  after: GameState,
  perspective: PlayerId,
  weights: AiEvaluationWeights,
): number {
  if (
    before.players[perspective].masterHp > MASTER_DAMAGE_PLAN_CLOSEOUT_HP ||
    after.winner ||
    after.pendingLevelUp ||
    after.currentPlayer !== perspective
  ) {
    return 0;
  }

  const beforeHandoff = handoffToOpponentForMasterDamagePlan(before, perspective);
  const afterHandoff = handoffToOpponentForMasterDamagePlan(after, perspective);
  if (!beforeHandoff || !afterHandoff) {
    return 0;
  }

  const opponent = opponentOf(perspective);
  const beforePlan = findMasterDamagePlan(beforeHandoff, opponent, weights, OPPONENT_MASTER_DAMAGE_RESPONSE_MAX_DEPTH);
  if (!beforePlan.lethal && beforePlan.damage < before.players[perspective].masterHp - 1) {
    return 0;
  }

  const afterPlan = findMasterDamagePlan(afterHandoff, opponent, weights, OPPONENT_MASTER_DAMAGE_RESPONSE_MAX_DEPTH);
  if (beforePlan.lethal && !afterPlan.lethal) {
    return 520 + Math.max(0, beforePlan.damage - afterPlan.damage) * 70;
  }

  const damageReduction = beforePlan.damage - afterPlan.damage;
  if (damageReduction <= 0) {
    return 0;
  }
  return 120 + damageReduction * 55;
}

function isDeferredSetupDecision(decision: CpuDecision): boolean {
  return decision.type === "summon" || decision.type === "move" || decision.type === "focus";
}

function handoffToOpponentForMasterDamagePlan(state: GameState, perspective: PlayerId): GameState | undefined {
  const opponent = opponentOf(perspective);
  if (state.currentPlayer === opponent) {
    return state;
  }
  if (state.currentPlayer !== perspective || state.winner || state.pendingLevelUp) {
    return undefined;
  }
  try {
    const handoff = endTurn(state);
    return handoff.currentPlayer === opponent ? handoff : undefined;
  } catch {
    return undefined;
  }
}

function evaluateOpponentResponseBeam(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
  depth: number,
): number {
  const omniscient = config.omniscient;
  const opponent = opponentOf(perspective);
  if (
    !omniscient ||
    depth <= 0 ||
    state.winner ||
    state.pendingLevelUp ||
    state.currentPlayer !== opponent
  ) {
    return 0;
  }

  const beforeScore = evaluatePerspectiveLookaheadScore(state, perspective, config);
  const responses = listCpuDecisions(state, config.weights)
    .flatMap((decision, index) => {
      let after: GameState;
      try {
        after = applyCpuDecision(state, decision);
      } catch {
        return [];
      }

      const immediateLoss = beforeScore - evaluatePerspectiveLookaheadScore(after, perspective, config);
      const continuation =
        after.currentPlayer === opponent && !after.pendingLevelUp && !after.winner
          ? omniscient.opponentResponseDiscount * evaluateOpponentResponseBeam(after, perspective, config, depth - 1)
          : 0;
      return [{ loss: immediateLoss + continuation, index }];
    })
    .sort((a, b) => b.loss - a.loss || a.index - b.index)
    .slice(0, omniscient.opponentResponseWidth);

  return Math.max(0, ...responses.map((response) => response.loss));
}

function evaluatePerspectiveLookaheadScore(
  state: GameState,
  perspective: PlayerId,
  config: CpuAiProfileConfig,
): number {
  return evaluateState(state, perspective, config.weights) + evaluateConfiguredFutureTacticalValue(state, perspective, true, config);
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
    const afterLevelUp = resolvePendingLevelUpForAttackScore(after, action.attackerSlotKey);
    const levelGain = attackerLevelGain(state, afterLevelUp, action.attackerSlotKey);
    return (
      weights.monsterKillBase +
      monsterValue(state, action.target.slotKey) +
      80 * levelGain +
      levelUpHpTimingBonus(state, afterLevelUp, action.attackerSlotKey) +
      recoilPenalty -
      whiteMirrorExposedLevelUpPenalty(state, afterLevelUp, action.attackerSlotKey, levelGain)
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
  if (directMasterDamage > 0 && state.players[playerId].masterId !== "white") {
    const racePenalty =
      34 +
      directMasterDamage * 22 +
      (state.players[playerId].masterHp <= state.players[opponent].masterHp ? 18 : 0);
    return (
      weights.monsterDamagePerPoint * damage +
      recoilPenalty +
      whiteMirrorFrontLevelUpSetupAttackBonus(state, action, targetAfter) -
      racePenalty
    );
  }
  return (
    weights.monsterDamagePerPoint * damage +
    recoilPenalty +
    whiteMirrorBacklineLeveledFrontThreatChipBonus(state, after, action, targetBefore, targetAfter) +
    whiteMirrorFrontLevelUpSetupAttackBonus(state, action, targetAfter) -
    whiteMirrorNonConvertingBacklineChipPenalty(state, after, action, targetAfter)
  );
}

function whiteMirrorNonConvertingBacklineChipPenalty(
  state: GameState,
  after: GameState,
  action: CommandAction,
  targetAfter: MonsterState,
): number {
  if (
    action.target.kind !== "monster" ||
    !isWhiteMirrorState(state, state.currentPlayer) ||
    state.slots[action.target.slotKey].row !== "back" ||
    targetAfter.owner === state.currentPlayer ||
    targetAfter.hp <= 1
  ) {
    return 0;
  }

  const attacker = state.slots[action.attackerSlotKey].monster;
  const attackerAfter = after.slots[action.attackerSlotKey].monster;
  if (
    !attacker ||
    !attackerAfter ||
    attacker.owner !== state.currentPlayer ||
    (getMonsterAiTrait(attacker.cardId).role !== "back" && attacker.actionLimit <= 1) ||
    attackerAfter.actionCount < attackerAfter.actionLimit
  ) {
    return 0;
  }

  return canFinishEnemyMonsterThisTurn(after, action.target.slotKey, state.currentPlayer)
    ? 0
    : WHITE_MIRROR_NON_CONVERTING_BACKLINE_CHIP_PENALTY;
}

function whiteFrontChipResponseDecisionPenalty(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  const targetSlotKey = whiteFrontChipResponseTargetSlot(before, after, decision, perspective);
  if (!targetSlotKey) {
    return 0;
  }
  const targetAfter = after.slots[targetSlotKey].monster;
  if (!targetAfter) {
    return 0;
  }
  if (
    decision.type === "attack" &&
    (isWhiteMirrorSafeBacklineFocusStripFrontChip(before, after, decision.action, targetSlotKey, targetAfter) ||
      isWhiteMirrorSafeBacklineFollowThroughFrontChip(before, after, decision.action, targetSlotKey, targetAfter))
  ) {
    return 0;
  }
  return whiteMirrorNonConvertingFrontThreatChipPenalty(before, after, targetSlotKey, targetAfter, value);
}

function isWhiteMirrorSafeBacklineFollowThroughFrontChip(
  state: GameState,
  after: GameState,
  action: CommandAction,
  targetSlotKey: SlotKey,
  targetAfter: MonsterState,
): boolean {
  const perspective = state.currentPlayer;
  const targetBefore = state.slots[targetSlotKey].monster;
  const attackerBefore = state.slots[action.attackerSlotKey].monster;
  const attackerAfter = after.slots[action.attackerSlotKey].monster;
  if (
    !isWhiteMirrorState(state, perspective) ||
    state.slots[action.attackerSlotKey].row !== "back" ||
    state.slots[targetSlotKey].row !== "front" ||
    !targetBefore ||
    !attackerBefore ||
    !attackerAfter ||
    targetBefore.owner !== opponentOf(perspective) ||
    targetAfter.owner !== targetBefore.owner ||
    targetAfter.instanceId !== targetBefore.instanceId ||
    targetAfter.hp >= targetBefore.hp ||
    attackerBefore.owner !== perspective ||
    attackerAfter.owner !== perspective ||
    attackerAfter.instanceId !== attackerBefore.instanceId ||
    attackerBefore.actionLimit <= 1 ||
    attackerBefore.actionCount <= 0
  ) {
    return false;
  }

  // A backliner that already spent one action is not newly exposed by using its
  // remaining action. Preserve focus only when the chip itself creates concrete harm.
  return whiteMirrorUnsafeMasterResponseScore(after, targetSlotKey, perspective) <= 0 &&
    opponentLevelFeedValue(after, action.attackerSlotKey) <= 0;
}

function isWhiteMirrorSafeBacklineFocusStripFrontChip(
  state: GameState,
  after: GameState,
  action: CommandAction,
  targetSlotKey: SlotKey,
  targetAfter: MonsterState,
): boolean {
  const perspective = state.currentPlayer;
  const targetBefore = state.slots[targetSlotKey].monster;
  const attackerBefore = state.slots[action.attackerSlotKey].monster;
  const attackerAfter = after.slots[action.attackerSlotKey].monster;
  if (
    !isWhiteMirrorState(state, perspective) ||
    state.slots[action.attackerSlotKey].row !== "back" ||
    state.slots[targetSlotKey].row !== "front" ||
    !targetBefore ||
    !attackerBefore ||
    !attackerAfter ||
    targetBefore.owner !== opponentOf(perspective) ||
    targetAfter.owner !== targetBefore.owner ||
    targetAfter.instanceId !== targetBefore.instanceId ||
    attackerBefore.owner !== perspective ||
    attackerAfter.owner !== perspective ||
    attackerAfter.instanceId !== attackerBefore.instanceId ||
    targetAfter.hp >= targetBefore.hp ||
    !targetBefore.focused ||
    targetAfter.focused
  ) {
    return false;
  }

  if (whiteMirrorUnsafeMasterResponseScore(after, targetSlotKey, perspective) > 0) {
    return false;
  }

  // Backline chip is acceptable when it only strips focus and does not leave a kill response.
  return enemyFrontChipResponseBoardThreatScore(after, targetSlotKey, perspective) < 620;
}

function whiteFrontThreatFocusCounterDecisionBonus(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
  value: number,
): number {
  if (
    value <= 0 ||
    before.players[perspective].masterId !== "white" ||
    !isWhiteMirrorState(before, perspective) ||
    decision.type !== "focus" ||
    bestDirectMasterDamageForPlayer(before, perspective) > 0
  ) {
    return 0;
  }

  const focused = after.slots[decision.slotKey].monster;
  if (!focused || focused.owner !== perspective || !focused.focused) {
    return 0;
  }

  const riskyFrontChip = riskyNonConvertingFrontChipScore(before, decision.slotKey, perspective);
  if (riskyFrontChip <= 0) {
    return 0;
  }

  const nextWork = nextTurnWorkPotential(after, decision.slotKey, perspective);
  if (nextWork <= 0) {
    return 0;
  }

  const threat = incomingThreat(after, decision.slotKey);
  if (isLethalIncomingThreat(threat) && nextWork < 300) {
    return 0;
  }

  const workBonus = Math.min(72, nextWork * 0.18);
  const riskBonus = Math.min(96, riskyFrontChip * 0.45);
  const frontRoleBonus = getMonsterAiTrait(focused.cardId).role === "front" ? 18 : 0;
  return Math.min(190, value + workBonus + riskBonus + frontRoleBonus);
}

function riskyNonConvertingFrontChipScore(
  state: GameState,
  attackerSlotKey: SlotKey,
  perspective: PlayerId,
): number {
  const attacker = state.slots[attackerSlotKey].monster;
  if (
    !attacker ||
    attacker.owner !== perspective ||
    attacker.status !== "active" ||
    attacker.actionCount >= attacker.actionLimit
  ) {
    return 0;
  }

  let best = 0;
  for (const command of getMonsterCommands(attacker)) {
    for (const target of getCommandTargets(state, attackerSlotKey, command.id)) {
      if (target.kind !== "monster" || state.slots[target.slotKey].row !== "front") {
        continue;
      }
      const targetBefore = state.slots[target.slotKey].monster;
      if (!targetBefore || targetBefore.owner !== opponentOf(perspective)) {
        continue;
      }
      for (const action of expandCommandActions(state, { attackerSlotKey, commandId: command.id, target })) {
        let after: GameState;
        try {
          after = attackWithCommand(state, action);
        } catch {
          continue;
        }
        const targetAfter = after.slots[target.slotKey].monster;
        if (
          !targetAfter ||
          targetAfter.owner !== targetBefore.owner ||
          targetAfter.instanceId !== targetBefore.instanceId ||
          targetAfter.hp >= targetBefore.hp
        ) {
          continue;
        }
        best = Math.max(best, whiteMirrorNonConvertingFrontThreatChipRiskScore(state, after, target.slotKey, targetAfter));
      }
    }
  }
  return best;
}

function whiteFrontChipResponseTargetSlot(
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  perspective: PlayerId,
): SlotKey | undefined {
  const target = decision.type === "attack"
    ? decision.action.target
    : decision.type === "master_action" && decision.actionId === "master_attack"
      ? decision.target
      : undefined;
  if (target?.kind !== "monster") {
    return undefined;
  }
  const targetBefore = before.slots[target.slotKey].monster;
  const targetAfter = after.slots[target.slotKey].monster;
  if (
    !targetBefore ||
    !targetAfter ||
    targetBefore.instanceId !== targetAfter.instanceId ||
    targetBefore.owner !== opponentOf(perspective) ||
    targetAfter.owner !== targetBefore.owner ||
    targetAfter.hp >= targetBefore.hp
  ) {
    return undefined;
  }
  return target.slotKey;
}

function whiteMirrorNonConvertingFrontThreatChipPenalty(
  state: GameState,
  after: GameState,
  targetSlotKey: SlotKey,
  targetAfter: MonsterState,
  value: number,
): number {
  const perspective = state.currentPlayer;
  const targetBefore = state.slots[targetSlotKey].monster;
  if (
    value <= 0 ||
    !isWhiteMirrorState(state, perspective) ||
    state.slots[targetSlotKey].row !== "front" ||
    !targetBefore ||
    targetBefore.owner !== opponentOf(perspective) ||
    targetAfter.owner !== targetBefore.owner ||
    targetAfter.instanceId !== targetBefore.instanceId ||
    targetAfter.hp >= targetBefore.hp ||
    targetAfter.hp <= 1
  ) {
    return 0;
  }

  if (canFinishEnemyMonsterThisTurn(after, targetSlotKey, perspective)) {
    return 0;
  }
  const riskScore = whiteMirrorNonConvertingFrontThreatChipRiskScore(state, after, targetSlotKey, targetAfter);
  if (riskScore <= 0) {
    return 0;
  }

  return Math.min(WHITE_MIRROR_NON_CONVERTING_FRONT_THREAT_CHIP_MAX_PENALTY, value + riskScore);
}

function whiteMirrorNonConvertingFrontThreatChipRiskScore(
  state: GameState,
  after: GameState,
  targetSlotKey: SlotKey,
  targetAfter: MonsterState,
): number {
  const perspective = state.currentPlayer;
  const targetBefore = state.slots[targetSlotKey].monster;
  if (
    !isWhiteMirrorState(state, perspective) ||
    state.slots[targetSlotKey].row !== "front" ||
    !targetBefore ||
    targetBefore.owner !== opponentOf(perspective) ||
    targetAfter.owner !== targetBefore.owner ||
    targetAfter.instanceId !== targetBefore.instanceId ||
    targetAfter.hp >= targetBefore.hp ||
    targetAfter.hp <= 1
  ) {
    return 0;
  }

  if (canFinishEnemyMonsterThisTurn(after, targetSlotKey, perspective)) {
    return 0;
  }

  const boardThreat = enemyFrontChipResponseBoardThreatScore(after, targetSlotKey, perspective);
  const unsafeMasterThreat = whiteMirrorUnsafeMasterResponseScore(after, targetSlotKey, perspective);
  if (boardThreat <= 0 && unsafeMasterThreat <= 0) {
    return 0;
  }

  const boardRisk = boardThreat > 0;
  const remainingHpPenalty = boardRisk ? Math.max(0, targetAfter.hp - 1) * 16 : 0;
  const levelPenalty = boardRisk && targetAfter.level > 1 ? (targetAfter.level - 1) * 30 : 0;
  const lowStonePenalty = boardRisk
    ? after.players[perspective].stones <= 1
      ? 35
      : after.players[perspective].stones <= 3
        ? 15
        : 0
    : 0;
  return boardThreat * 0.24 + unsafeMasterThreat + remainingHpPenalty + levelPenalty + lowStonePenalty;
}

function enemyFrontChipResponseBoardThreatScore(
  state: GameState,
  targetSlotKey: SlotKey,
  perspective: PlayerId,
): number {
  const opponent = opponentOf(perspective);
  const target = state.slots[targetSlotKey].monster;
  if (!target || target.owner !== opponent) {
    return 0;
  }
  const readyState = responseTurnTacticalEvaluationState(state, opponent);
  const readyTarget = readyState.slots[targetSlotKey].monster;
  if (!readyTarget || readyTarget.owner !== opponent || readyTarget.actionCount >= readyTarget.actionLimit) {
    return 0;
  }

  let best = 0;
  for (const command of getMonsterCommands(readyTarget)) {
    for (const responseTarget of getCommandTargets(readyState, targetSlotKey, command.id)) {
      if (responseTarget.kind !== "monster") {
        continue;
      }
      const victim = readyState.slots[responseTarget.slotKey].monster;
      if (!victim || victim.owner !== perspective) {
        continue;
      }
      const damage = estimateMonsterDamage(readyState, victim, targetSlotKey, command);
      if (damage <= 0) {
        continue;
      }
      const killScore = damage >= victim.hp
        ? 620 + monsterValue(readyState, responseTarget.slotKey) + enemyResponseLevelUpRiskScore(readyTarget)
        : 0;
      best = Math.max(best, killScore || damage * 25);
    }
  }
  return best;
}

function enemyResponseLevelUpRiskScore(attacker: MonsterState): number {
  return attacker.level < getMonsterDef(attacker.cardId).maxLevel ? 70 : 0;
}

function whiteMirrorUnsafeMasterResponseScore(
  state: GameState,
  targetSlotKey: SlotKey,
  perspective: PlayerId,
): number {
  const opponent = opponentOf(perspective);
  const responseState = responseTurnTacticalEvaluationState(state, opponent);
  const damage = directMasterDamageFromSlot(responseState, targetSlotKey, opponent);
  if (damage <= 0) {
    return 0;
  }

  const ownHp = state.players[perspective].masterHp;
  if (damage >= ownHp) {
    return 360 + damage * 80;
  }
  if (ownHp <= 3) {
    return 60 + damage * 30;
  }
  if (ownHp <= 4 && damage >= 2) {
    return 100 + damage * 36;
  }
  if (ownHp <= 6 && damage >= 3) {
    return 80 + damage * 30;
  }
  return 0;
}

function responseTurnTacticalEvaluationState(state: GameState, responsePlayer: PlayerId): GameState {
  if (state.currentPlayer === responsePlayer) {
    return readyPlayerForTacticalEvaluation(state, responsePlayer);
  }

  const next = structuredClone(state) as GameState;
  next.currentPlayer = responsePlayer;
  next.players[responsePlayer].stones += 3;

  for (const slotKey of FIELD_ORDER_BY_PLAYER[responsePlayer]) {
    const monster = next.slots[slotKey].monster;
    if (monster?.status === "prepared") {
      monster.status = "active";
      monster.focused = false;
    }
  }

  const exposedPlayer = opponentOf(responsePlayer);
  for (const slotKey of FIELD_ORDER_BY_PLAYER[exposedPlayer]) {
    const monster = next.slots[slotKey].monster;
    if (monster?.status === "prepared") {
      monster.status = "active";
      monster.focused = false;
    }
  }

  for (const lane of ["left", "right"] as const) {
    const backSlotKey = `${responsePlayer}_back_${lane}` as SlotKey;
    const frontSlotKey = `${responsePlayer}_front_${lane}` as SlotKey;
    const backMonster = next.slots[backSlotKey].monster;
    if (backMonster?.status === "active" && !next.slots[frontSlotKey].monster) {
      next.slots[frontSlotKey].monster = backMonster;
      delete next.slots[backSlotKey].monster;
    }
  }

  for (const slotKey of FIELD_ORDER_BY_PLAYER[responsePlayer]) {
    const monster = next.slots[slotKey].monster;
    if (monster?.status === "active") {
      monster.actionCount = 0;
      monster.actionLimit = getMonsterDef(monster.cardId).actionLimit ?? 1;
    }
  }

  return next;
}

function canFinishEnemyMonsterThisTurn(state: GameState, targetSlotKey: SlotKey, perspective: PlayerId): boolean {
  const target = state.slots[targetSlotKey].monster;
  if (!target || target.owner === perspective) {
    return false;
  }

  if (FIELD_ORDER_BY_PLAYER[perspective].some((attackerSlotKey) => {
    const attacker = state.slots[attackerSlotKey].monster;
    if (!attacker || attacker.owner !== perspective || attacker.status !== "active" || attacker.actionCount >= attacker.actionLimit) {
      return false;
    }
    return getMonsterCommands(attacker).some((command) => {
      const canTarget = getCommandTargets(state, attackerSlotKey, command.id).some(
        (targetCandidate) => targetCandidate.kind === "monster" && targetCandidate.slotKey === targetSlotKey,
      );
      return canTarget && estimateMonsterDamage(state, target, attackerSlotKey, command) >= target.hp;
    });
  })) {
    return true;
  }

  if (!getCurrentMasterActionIds(state).includes("master_attack")) {
    return false;
  }
  if (!getMasterActionTargets(state, "master_attack").some((candidate) => candidate.kind === "monster" && candidate.slotKey === targetSlotKey)) {
    return false;
  }
  try {
    const after = useMasterAction(state, "master_attack", { kind: "monster", slotKey: targetSlotKey });
    const targetAfter = after.slots[targetSlotKey].monster;
    return !targetAfter || targetAfter.instanceId !== target.instanceId || targetAfter.owner !== target.owner;
  } catch {
    return false;
  }
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

  const damage = estimateMonsterDamage(state, targetMonster, attackerSlotKey, command);
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

  return 0;
}

function whiteMirrorExposedLevelUpPenalty(
  state: GameState,
  after: GameState,
  attackerSlotKey: SlotKey,
  levelGain: number,
): number {
  if (levelGain <= 0 || !isWhiteMirrorState(after, state.currentPlayer)) {
    return 0;
  }
  const monster = after.slots[attackerSlotKey].monster;
  if (!monster || monster.owner !== state.currentPlayer) {
    return 0;
  }
  const incomingMonsterDamage = availableOpponentMonsterDamageToSlot(after, attackerSlotKey);
  if (incomingMonsterDamage < monster.hp) {
    return 0;
  }
  const rowPenalty =
    after.slots[attackerSlotKey].row === "back"
      ? WHITE_MIRROR_EXPOSED_BACK_LEVEL_UP_PENALTY
      : WHITE_MIRROR_EXPOSED_FRONT_LEVEL_UP_PENALTY;
  return rowPenalty + Math.max(0, incomingMonsterDamage - monster.hp) * 18;
}

function availableOpponentMonsterDamageToSlot(state: GameState, targetSlotKey: SlotKey): number {
  const targetMonster = state.slots[targetSlotKey].monster;
  if (!targetMonster) {
    return 0;
  }
  const attackerId = opponentOf(targetMonster.owner);
  const readyState = readyPlayerForTacticalEvaluation(state, attackerId);
  const readyTarget = readyState.slots[targetSlotKey].monster;
  if (!readyTarget) {
    return 0;
  }

  return FIELD_ORDER_BY_PLAYER[attackerId].reduce((total, attackerSlotKey) => {
    const attacker = readyState.slots[attackerSlotKey].monster;
    if (!attacker?.status || attacker.status !== "active" || attacker.actionCount >= attacker.actionLimit) {
      return total;
    }
    const bestDamage = getMonsterCommands(attacker).reduce((best, command) => {
      const canTarget = getCommandTargets(readyState, attackerSlotKey, command.id).some(
        (target) => target.kind === "monster" && target.slotKey === targetSlotKey,
      );
      return canTarget ? Math.max(best, estimateMonsterDamage(readyState, readyTarget, attackerSlotKey, command)) : best;
    }, 0);
    const remainingActions = Math.max(1, attacker.actionLimit - attacker.actionCount);
    return total + bestDamage * remainingActions;
  }, 0);
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
        if (targetInReadyState && estimateMonsterDamage(readyState, targetInReadyState, attackerSlotKey, command) >= targetInReadyState.hp) {
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
      return listShieldDecisions(state, weights);
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
  if (target.kind === "master") {
    const beforeHp = state.players[target.playerId].masterHp;
    const afterHp = after.players[target.playerId].masterHp;
    const damage = beforeHp - afterHp;
    if (damage <= 0 && after.winner !== state.currentPlayer) {
      return undefined;
    }
    return {
      type: "master_action",
      actionId: "master_attack",
      target,
      reason: after.winner ? "マスターアタックで相手マスターを倒せるため使用" : "相手マスターへ実ダメージを与えられるためマスターアタック",
      score: after.winner ? 1_000_000 : masterDamageScore(state, state.currentPlayer, damage) - getMasterActionCost("master_attack") * 8,
    };
  }

  const targetBefore = target.kind === "monster" ? state.slots[target.slotKey].monster : undefined;
  const targetAfter = target.kind === "monster" ? after.slots[target.slotKey].monster : undefined;
  if (!targetBefore || target.kind !== "monster") {
    return undefined;
  }
  if (shouldSkipWhiteLowValueMultiMasterAttack(state, target.slotKey, targetBefore)) {
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

function shouldSkipWhiteLowValueMultiMasterAttack(
  state: GameState,
  targetSlotKey: SlotKey,
  target: MonsterState,
): boolean {
  const perspective = state.currentPlayer;
  if (
    !isWhiteMirrorState(state, perspective) ||
    isCloseoutState(state, perspective) ||
    target.level > 1 ||
    target.investedStones > 1 ||
    currentTurnMasterActionCount(state, perspective, "master_attack") > 0
  ) {
    return false;
  }

  let current = state;
  for (let count = 1; count <= 3; count += 1) {
    if (current.players[perspective].stones < getMasterActionCost("master_attack")) {
      return false;
    }
    try {
      current = useMasterAction(current, "master_attack", { kind: "monster", slotKey: targetSlotKey });
    } catch {
      return false;
    }
    const remaining = current.slots[targetSlotKey].monster;
    if (!remaining || remaining.instanceId !== target.instanceId || remaining.owner !== target.owner) {
      return count >= 3;
    }
  }
  return true;
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
    const attackScore = bestMonsterKillOpportunityScore(after, undefined, target.slotKey);
    if (attackScore <= 0) {
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

  const followUpFinish = bestWakeFollowUpFinishScore(after, target.slotKey);
  if (followUpFinish <= 0) {
    return undefined;
  }
  const score = 46 + monsterValue(state, target.slotKey) * 0.2 + followUpFinish * 0.62 - 16;
  if (score < 32) {
    return undefined;
  }
  return {
    type: "master_action",
    actionId: "wake_up",
    target,
    reason: "準備中の味方を起こして敵を撃破できるためウェイクアップ",
    score,
  };
}

function listShieldDecisions(state: GameState, weights: AiEvaluationWeights): CpuDecision[] {
  return getMasterActionTargets(state, "shield")
    .filter((target) => target.kind === "monster" && state.slots[target.slotKey].owner === state.currentPlayer)
    .map((target) => createShieldDecision(state, target, weights))
    .filter((decision): decision is CpuDecision => !!decision);
}

function createShieldDecision(state: GameState, target: Target, weights: AiEvaluationWeights): CpuDecision | undefined {
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
  const lethalThreat = isLethalIncomingThreat(threat);
  const lethalAfterShield = isLethalIncomingThreat(threatAfterShield);
  const preventsLethal = lethalThreat && !lethalAfterShield;
  const reducesDamage = maxIncomingThreatDamage(threatAfterShield) < maxIncomingThreatDamage(threat);
  const important = monster.level >= 2 || getMonsterAiTrait(monster.cardId).role === "back" || monster.hp <= 2;
  const levelUpPotential = nextTurnLevelUpPotential(state, target.slotKey);
  const closeout = shouldPruneCloseoutNonProgressActions(state, state.currentPlayer);
  if (!threat.threatened && isDeckOutRace(state)) {
    return undefined;
  }
  if (!threat.threatened && !important) {
    return undefined;
  }
  if (closeout && !preventsLethal && !lethalThreat && levelUpPotential <= 0) {
    return undefined;
  }
  if (isWhiteMirrorCloseout(state) && !preventsLethal && !lethalThreat && levelUpPotential <= 0) {
    return undefined;
  }
  if (shouldSkipWhiteMirrorIdleShield(state, target.slotKey, threat, reducesDamage, preventsLethal, levelUpPotential)) {
    return undefined;
  }
  if (!shouldProtectInDeckOutRace(state, target.slotKey, threat, preventsLethal, levelUpPotential)) {
    return undefined;
  }
  if (shouldHoldShieldForMasterRace(state, threat, preventsLethal, levelUpPotential)) {
    return undefined;
  }
  if (shouldDeferShieldUntilAfterCurrentTurnWork(state, target.slotKey, getMasterActionCost("shield"), weights)) {
    return undefined;
  }
  const score =
    14 +
    monsterValue(state, target.slotKey) * 0.18 +
    levelUpPotential * 0.24 +
    (preventsLethal ? 96 : lethalThreat ? 48 : reducesDamage ? 30 : threat.threatened ? 20 : 0) -
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
      : lethalThreat
        ? "倒されそうな高価値味方を守るためシールド"
        : levelUpPotential > 0
          ? "次ターンのレベルアップ筋を残すためシールド"
          : "高価値の味方を守るためシールド",
    score,
  };
}

function shouldSkipWhiteMirrorIdleShield(
  state: GameState,
  targetSlotKey: SlotKey,
  threat: IncomingThreat,
  reducesDamage: boolean,
  preventsLethal: boolean,
  levelUpPotential: number,
): boolean {
  if (!isWhiteMirrorState(state, state.currentPlayer)) {
    return false;
  }
  if ((!threat.threatened || maxIncomingThreatDamage(threat) <= 0) && levelUpPotential <= 0) {
    return true;
  }
  if (preventsLethal || isLethalIncomingThreat(threat) || reducesDamage || levelUpPotential > 0) {
    return false;
  }
  return nextTurnWorkPotential(state, targetSlotKey, state.currentPlayer) <= 0;
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
  if (preventsLethal || isLethalIncomingThreat(threat) || levelUpPotential > 0) {
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
      if (shouldSkipLoneFrontSummonWithoutWakeFinish(state, card.instanceId, slotKey)) {
        continue;
      }
      if (shouldSkipWhiteMirrorRoleSaturatedBacklinerSummon(state, card)) {
        continue;
      }
      if (shouldSkipWhiteMirrorWakeExposedFrontSummon(state, card, slotKey)) {
        continue;
      }
      const score = scoreSummon(state, card, slotKey);
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

function shouldSkipWhiteMirrorWakeExposedFrontSummon(
  state: GameState,
  card: CardInstance,
  slotKey: SlotKey,
): boolean {
  const playerId = state.currentPlayer;
  if (
    !isWhiteMirrorState(state, playerId) ||
    state.slots[slotKey].row !== "front" ||
    isCloseoutState(state, playerId) ||
    FIELD_ORDER_BY_PLAYER[playerId].some(
      (key) => state.slots[key].row === "back" && state.slots[key].monster?.owner === playerId,
    )
  ) {
    return false;
  }
  const hasSafeBackPlacement = SUMMON_SLOT_ORDER_BY_PLAYER[playerId].some(
    (candidateSlotKey) =>
      state.slots[candidateSlotKey].row === "back" &&
      canSummonTo(state, card.instanceId, candidateSlotKey),
  );
  if (!hasSafeBackPlacement) {
    return false;
  }

  try {
    const summoned = summonMonster(state, card.instanceId, slotKey);
    const response = endTurn(summoned);
    const opponent = response.currentPlayer;
    const target: Target = { kind: "monster", slotKey };
    if (
      !getCurrentMasterActionIds(response).includes("wake_up") ||
      !getMasterActionTargets(response, "wake_up").some((candidate) => isSameTargetForAi(candidate, target))
    ) {
      return false;
    }
    const woken = useMasterAction(response, "wake_up", target);
    return canDefeatEnemyMonsterWithCurrentAttacks(woken, slotKey, opponent);
  } catch {
    return false;
  }
}

function shouldSkipWhiteMirrorRoleSaturatedBacklinerSummon(
  state: GameState,
  card: CardInstance,
): boolean {
  const playerId = state.currentPlayer;
  if (
    state.players[playerId].masterId !== "white" ||
    state.players[opponentOf(playerId)].masterId !== "white" ||
    state.players[playerId].hand.length >= 6 ||
    isCloseoutState(state, playerId)
  ) {
    return false;
  }

  const trait = getMonsterAiTrait(card.cardId);
  if (trait.role !== "back" && !monsterHasBacklineAttackPattern(card.cardId)) {
    return false;
  }

  const sameCardOnField = FIELD_ORDER_BY_PLAYER[playerId].filter(
    (key) => state.slots[key].monster?.cardId === card.cardId,
  ).length;
  if (sameCardOnField < 2) {
    return false;
  }

  return state.players[playerId].deck.some((deckCard) => {
    try {
      const def = getCardDef(deckCard.cardId);
      return def.type === "monster" && inferMonsterAiTrait(def).role === "front";
    } catch {
      return false;
    }
  });
}

function scoreSummon(state: GameState, card: CardInstance, slotKey: SlotKey): number {
  const def = getMonsterDef(card.cardId);
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

  if (boardEmpty && slot.row === "front" && !summonWakeCreatesImmediateWork(state, card.instanceId, slotKey)) {
    score -= LONE_FRONT_OPENING_SUMMON_EXPOSURE_PENALTY;
  }

  return score + memberRatingValueBonus(card.cardId, state.players[state.currentPlayer].masterId);
}

function shouldSkipLoneFrontSummonWithoutWakeFinish(state: GameState, handInstanceId: string, slotKey: SlotKey): boolean {
  const slot = state.slots[slotKey];
  if (slot.row !== "front") {
    return false;
  }
  if (!getCurrentMasterActionIds(state).includes("wake_up")) {
    return false;
  }
  if (state.players[state.currentPlayer].stones < 1 + getMasterActionCost("wake_up")) {
    return false;
  }
  const ownBoardEmpty = SUMMON_SLOT_ORDER_BY_PLAYER[slot.owner].every((key) => !state.slots[key].monster);
  return ownBoardEmpty && !summonWakeCreatesImmediateWork(state, handInstanceId, slotKey);
}

function summonWakeCreatesImmediateWork(state: GameState, handInstanceId: string, slotKey: SlotKey): boolean {
  const wakeCost = getMasterActionCost("wake_up");
  if (!getCurrentMasterActionIds(state).includes("wake_up") || state.players[state.currentPlayer].stones < 1 + wakeCost) {
    return false;
  }

  try {
    const summoned = summonMonster(state, handInstanceId, slotKey);
    const target: Target = { kind: "monster", slotKey };
    if (!getMasterActionTargets(summoned, "wake_up").some((candidate) => isSameTargetForAi(candidate, target))) {
      return false;
    }
    const woken = useMasterAction(summoned, "wake_up", target);
    return bestWakeFollowUpFinishScore(woken, slotKey) > 0;
  } catch {
    return false;
  }
}

function isSameTargetForAi(a: Target, b: Target): boolean {
  if (a.kind !== b.kind) {
    return false;
  }
  if (a.kind === "monster" && b.kind === "monster") {
    return a.slotKey === b.slotKey;
  }
  if (a.kind === "master" && b.kind === "master") {
    return a.playerId === b.playerId;
  }
  return false;
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
  const isSurvivalRetreat = isWhiteMirrorFragileFrontSurvivalRetreat(state, after, fromSlotKey, toSlotKey);
  const score = isSurvivalRetreat
    ? Math.max(160, scoreMoveDecision(state, after, fromSlotKey, toSlotKey))
    : scoreMoveDecision(state, after, fromSlotKey, toSlotKey);
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
  score -= whiteMirrorCloseoutBackToFrontMovePenalty(state, after, fromSlotKey, toSlotKey);
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

function whiteMirrorCloseoutBackToFrontMovePenalty(
  state: GameState,
  after: GameState,
  fromSlotKey: SlotKey,
  toSlotKey: SlotKey,
): number {
  if (!isWhiteMirrorCloseout(state) || state.players[state.currentPlayer].masterHp > 4) {
    return 0;
  }
  let penalty = 0;
  for (const beforeSlotKey of [fromSlotKey, toSlotKey]) {
    const monster = state.slots[beforeSlotKey].monster;
    if (!monster || monster.owner !== state.currentPlayer || state.slots[beforeSlotKey].row !== "back") {
      continue;
    }
    const afterSlotKey = findMonsterSlot(after, monster.instanceId);
    if (!afterSlotKey || after.slots[afterSlotKey].row !== "front") {
      continue;
    }
    if (bestAttackOpportunityScore(after, afterSlotKey) >= 260 || hasSafeNextTurnDirectMasterDamage(after, afterSlotKey, state.currentPlayer)) {
      continue;
    }
    penalty += 160 + (monster.level >= 2 ? 60 : 0) + (monster.hp <= 2 ? 30 : 0);
  }
  return penalty;
}

function hasSafeNextTurnDirectMasterDamage(state: GameState, slotKey: SlotKey, attackerId: PlayerId): boolean {
  const damage = directMasterDamageFromSlot(state, slotKey, attackerId);
  if (damage <= 0) {
    return false;
  }
  const monster = state.slots[slotKey].monster;
  if (!monster || monster.owner !== attackerId) {
    return false;
  }
  return availableOpponentMonsterDamageToSlot(state, slotKey) < monster.hp;
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
  if (isWhiteMirrorFragileFrontSurvivalRetreat(state, after, fromSlotKey, toSlotKey)) {
    return "致死圏の前衛を後列へ退避して相手のレベルアップを防ぐため移動";
  }
  if (moveCreatesStrongerAttackLane(state, after, fromSlotKey, toSlotKey)) {
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

function isWhiteMirrorFragileFrontSurvivalRetreat(
  state: GameState,
  after: GameState,
  fromSlotKey: SlotKey,
  toSlotKey: SlotKey,
): boolean {
  const perspective = state.currentPlayer;
  const mover = state.slots[fromSlotKey].monster;
  const moved = after.slots[toSlotKey].monster;
  if (
    !isWhiteMirrorState(state, perspective) ||
    state.slots[fromSlotKey].row !== "front" ||
    state.slots[toSlotKey].row !== "back" ||
    state.slots[toSlotKey].monster ||
    !mover ||
    !moved ||
    mover.owner !== perspective ||
    moved.instanceId !== mover.instanceId ||
    mover.hp > 2 ||
    mover.cardId === "bomuzo"
  ) {
    return false;
  }

  const beforeFeed = opponentLevelFeedValue(state, fromSlotKey);
  const afterFeed = opponentLevelFeedValue(after, toSlotKey);
  return beforeFeed > 0 && afterFeed < beforeFeed;
}

function moveCreatesStrongerAttackLane(
  state: GameState,
  after: GameState,
  fromSlotKey: SlotKey,
  toSlotKey: SlotKey,
): boolean {
  if (bestAttackOpportunityScore(after) > bestAttackOpportunityScore(state) + 40) {
    return true;
  }
  if (swapImprovesRoleAttackSetup(state, fromSlotKey, toSlotKey)) {
    return true;
  }

  return [
    { monster: state.slots[fromSlotKey].monster, beforeSlotKey: fromSlotKey },
    { monster: state.slots[toSlotKey].monster, beforeSlotKey: toSlotKey },
  ].some(({ monster, beforeSlotKey }) => {
    if (!monster) {
      return false;
    }
    const afterSlotKey = findMonsterSlot(after, monster.instanceId);
    if (!afterSlotKey) {
      return false;
    }
    return bestAttackOpportunityScore(after, afterSlotKey) > bestAttackOpportunityScore(state, beforeSlotKey);
  });
}

function swapImprovesRoleAttackSetup(state: GameState, fromSlotKey: SlotKey, toSlotKey: SlotKey): boolean {
  const mover = state.slots[fromSlotKey].monster;
  const swapped = state.slots[toSlotKey].monster;
  if (!mover || !swapped) {
    return false;
  }

  const beforeMatches =
    roleSlotMatchScore(mover.cardId, state.slots[fromSlotKey]) +
    roleSlotMatchScore(swapped.cardId, state.slots[toSlotKey]);
  const afterMatches =
    roleSlotMatchScore(mover.cardId, state.slots[toSlotKey]) +
    roleSlotMatchScore(swapped.cardId, state.slots[fromSlotKey]);
  return afterMatches > beforeMatches && afterMatches >= 2;
}

function roleSlotMatchScore(cardId: string, slot: SlotState): number {
  const role = getMonsterAiTrait(cardId).role;
  if (role === "front" && slot.row === "front") {
    return 1;
  }
  if (role === "back" && slot.row === "back") {
    return 1;
  }
  return 0;
}

function listFocusDecisions(state: GameState): CpuDecision[] {
  if (shouldPruneCloseoutNonProgressActions(state, state.currentPlayer)) {
    return [];
  }
  return FIELD_ORDER_BY_PLAYER[state.currentPlayer]
    .filter((slotKey) => canFocusMonster(state, slotKey) && !hasWhiteMirrorSafeBacklineFollowThroughFrontChip(state, slotKey))
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

function hasWhiteMirrorSafeBacklineFollowThroughFrontChip(state: GameState, attackerSlotKey: SlotKey): boolean {
  const attacker = state.slots[attackerSlotKey].monster;
  if (
    !attacker ||
    !isWhiteMirrorState(state, state.currentPlayer) ||
    state.slots[attackerSlotKey].row !== "back" ||
    attacker.owner !== state.currentPlayer ||
    attacker.status !== "active" ||
    attacker.actionLimit <= 1 ||
    attacker.actionCount <= 0 ||
    attacker.actionCount >= attacker.actionLimit
  ) {
    return false;
  }

  for (const command of getMonsterCommands(attacker)) {
    for (const target of getCommandTargets(state, attackerSlotKey, command.id)) {
      if (target.kind !== "monster" || state.slots[target.slotKey].row !== "front") {
        continue;
      }
      for (const action of expandCommandActions(state, { attackerSlotKey, commandId: command.id, target })) {
        try {
          const after = attackWithCommand(state, action);
          const targetAfter = after.slots[target.slotKey].monster;
          if (
            targetAfter &&
            isWhiteMirrorSafeBacklineFollowThroughFrontChip(state, after, action, target.slotKey, targetAfter)
          ) {
            return true;
          }
        } catch {
          // Ignore command variants that are not legal in this exact state.
        }
      }
    }
  }
  return false;
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
    return {
      ...selected.decision,
      trace: {
        ...selected.decision.trace,
        totalScore: selected.totalScore,
        baseScore: selected.decision.score,
      },
    } as CpuDecision;
  }

  const rejectedText = rejected
    .map((candidate) => `${decisionShortLabel(candidate.decision)}は${decisionScoreGapLabel(selected.totalScore - candidate.totalScore)}で見送り`)
    .join("、");
  return {
    ...selected.decision,
    reason: `${selected.decision.reason} / 見送り: ${rejectedText}`,
    trace: {
      ...selected.decision.trace,
      totalScore: selected.totalScore,
      baseScore: selected.decision.score,
      alternatives: rejected.map((candidate) => ({
        label: decisionShortLabel(candidate.decision),
        totalScore: candidate.totalScore,
        scoreGap: selected.totalScore - candidate.totalScore,
      })),
    },
  } as CpuDecision;
}

function finalizeDecisionTrace(
  decision: CpuDecision,
  evaluated: readonly EvaluatedDecision[],
): CpuDecision {
  if (decision.trace?.totalScore !== undefined) {
    return decision;
  }
  const selected = evaluated.find((candidate) => cpuDecisionKey(candidate.decision) === cpuDecisionKey(decision));
  if (!selected) {
    return {
      ...decision,
      trace: {
        ...decision.trace,
        totalScore: decision.score,
        baseScore: decision.score,
      },
    } as CpuDecision;
  }
  return attachDecisionTrace(
    {
      decision,
      totalScore: selected.totalScore,
      index: selected.index,
    },
    [...evaluated],
  );
}

function decisionScoreGapLabel(scoreGap: number): string {
  const rounded = Math.round(scoreGap);
  return rounded < 0 ? `${Math.abs(rounded)}点上` : `${rounded}点差`;
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

function cpuDecisionKey(decision: CpuDecision): string {
  if (decision.type === "attack") {
    return `attack:${decision.action.attackerSlotKey}:${decision.action.commandId}:${targetKey(decision.action.target)}:${targetKey(decision.action.secondaryTarget)}:${decision.action.secondaryHandInstanceId ?? ""}`;
  }
  if (decision.type === "master_action") {
    return `master:${decision.actionId}:${targetKey(decision.target)}`;
  }
  if (decision.type === "summon") {
    return `summon:${decision.handInstanceId}:${decision.slotKey}`;
  }
  if (decision.type === "magic") {
    return `magic:${decision.action.handInstanceId}:${targetKey(decision.action.target)}:${targetKey(decision.action.secondaryTarget)}:${decision.action.secondaryHandInstanceId ?? ""}:${decision.action.selectedHandInstanceIds?.join(",") ?? ""}:${decision.action.deckTopOrderInstanceIds?.join(",") ?? ""}:${decision.action.searchCategory ?? ""}:${decision.action.rotationDirection ?? ""}`;
  }
  if (decision.type === "move") {
    return `move:${decision.fromSlotKey}:${decision.toSlotKey}`;
  }
  if (decision.type === "focus") {
    return `focus:${decision.slotKey}`;
  }
  return "end_turn";
}

function targetKey(target: Target | undefined): string {
  if (!target) {
    return "";
  }
  return target.kind === "monster" ? `monster:${target.slotKey}` : `master:${target.playerId}`;
}

function masterDamagePlanDecisionPriority(decision: CpuDecision): number {
  if (decision.type === "attack" && decision.action.target.kind === "master") {
    return 90;
  }
  if (decision.type === "magic" && decision.reason.includes("相手マスター")) {
    return 86;
  }
  if (decision.type === "master_action" && decision.actionId === "master_attack") {
    return 84;
  }
  if (decision.type === "magic") {
    return 78;
  }
  if (decision.type === "master_action" && decision.actionId === "wake_up") {
    return 74;
  }
  if (decision.type === "master_action") {
    return 70;
  }
  if (decision.type === "summon") {
    return 60;
  }
  return decisionPriority(decision);
}

function masterDamagePlanStateKey(state: GameState, perspective: PlayerId): string {
  const player = state.players[perspective];
  const opponent = state.players[opponentOf(perspective)];
  return JSON.stringify({
    currentPlayer: state.currentPlayer,
    player: {
      hp: player.masterHp,
      stones: player.stones,
      masterPowerBonus: player.masterPowerBonus ?? 0,
      masterFrozen: player.masterFrozen ?? false,
      masterActionsExchanged: player.masterActionsExchanged ?? false,
      hand: player.hand.map((card) => `${card.instanceId}:${card.cardId}`),
    },
    opponent: {
      hp: opponent.masterHp,
      masterActionsExchanged: opponent.masterActionsExchanged ?? false,
    },
    slots: ALL_FIELD_ORDER.map((slotKey) => {
      const monster = state.slots[slotKey].monster;
      return [
        slotKey,
        monster
          ? {
              id: monster.instanceId,
              cardId: monster.cardId,
              hp: monster.hp,
              level: monster.level,
              status: monster.status,
              actionCount: monster.actionCount,
              actionLimit: monster.actionLimit,
              focused: monster.focused,
              powerUp: monster.powerUp,
              berserkPower: monster.berserkPower,
              usedCommandIds: monster.usedCommandIds ?? [],
            }
          : null,
      ];
    }),
  });
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

function resolvePendingLevelUpForAttackScore(state: GameState, attackerSlotKey: SlotKey): GameState {
  if (!state.pendingLevelUp || state.pendingLevelUp.attackerSlotKey !== attackerSlotKey) {
    return state;
  }
  return resolveLevelUp(state, state.pendingLevelUp.maxLevels);
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
    return scoreShieldMagicDecision(state, after, action, def.cost, weights);
  }
  if (trait?.valueModel === "search_choice") {
    return scoreSearchMagicDecision(state, action, def.cost);
  }
  if (trait?.valueModel === "refresh_delta") {
    return scoreRefreshMagicDecision(state, after, action, beforeScore, def.cost, weights);
  }

  const stateDeltaScore = evaluateState(after, state.currentPlayer, weights) - beforeScore - def.cost * weights.genericMagicCost;
  const clearFinishScore = clearMagicFinishConversionScore(state, after, def.id);
  return Math.max(stateDeltaScore, clearFinishScore);
}

function clearMagicFinishConversionScore(state: GameState, after: GameState, cardId: string): number {
  const targetSlotKey = clearMagicFinishConversionTarget(state, after, cardId);
  if (!targetSlotKey) {
    return 0;
  }
  const target = state.slots[targetSlotKey].monster;
  return target ? 220 + target.level * 60 + monsterValue(state, targetSlotKey) * 0.35 : 220;
}

function clearMagicFinishConversionTarget(
  state: GameState,
  after: GameState,
  cardId: string,
): SlotKey | undefined {
  if (cardId !== "card_064") {
    return undefined;
  }
  const perspective = state.currentPlayer;
  for (const slotKey of FIELD_ORDER_BY_PLAYER[opponentOf(perspective)]) {
    const beforeTarget = state.slots[slotKey].monster;
    const afterTarget = after.slots[slotKey].monster;
    if (
      !beforeTarget ||
      !afterTarget ||
      beforeTarget.instanceId !== afterTarget.instanceId ||
      beforeTarget.owner !== opponentOf(perspective) ||
      beforeTarget.shielded === afterTarget.shielded ||
      !beforeTarget.shielded ||
      afterTarget.shielded
    ) {
      continue;
    }
    if (
      !canDefeatEnemyMonsterWithCurrentAttacks(state, slotKey, perspective) &&
      canDefeatEnemyMonsterWithCurrentAttacks(after, slotKey, perspective)
    ) {
      return slotKey;
    }
  }
  return undefined;
}

function canDefeatEnemyMonsterWithCurrentAttacks(
  state: GameState,
  targetSlotKey: SlotKey,
  perspective: PlayerId,
): boolean {
  if (state.currentPlayer !== perspective || state.pendingLevelUp) {
    return false;
  }

  let current = state;
  for (let step = 0; step < 8; step += 1) {
    const target = current.slots[targetSlotKey].monster;
    if (!target || target.owner === perspective) {
      return true;
    }

    let bestTransition: { state: GameState; damage: number } | undefined;
    for (const attackerSlotKey of FIELD_ORDER_BY_PLAYER[perspective]) {
      const attacker = current.slots[attackerSlotKey].monster;
      if (
        !attacker ||
        attacker.owner !== perspective ||
        attacker.status !== "active" ||
        attacker.actionCount >= attacker.actionLimit
      ) {
        continue;
      }
      for (const command of getMonsterCommands(attacker)) {
        if (!getCommandTargets(current, attackerSlotKey, command.id).some(
          (candidate) => candidate.kind === "monster" && candidate.slotKey === targetSlotKey,
        )) {
          continue;
        }
        for (const attack of expandCommandActions(current, {
          attackerSlotKey,
          commandId: command.id,
          target: { kind: "monster", slotKey: targetSlotKey },
        })) {
          try {
            const attacked = attackWithCommand(current, attack);
            const targetAfter = attacked.slots[targetSlotKey].monster;
            if (!targetAfter || targetAfter.instanceId !== target.instanceId || targetAfter.owner !== target.owner) {
              return true;
            }
            const damage = target.hp - targetAfter.hp;
            if (damage > 0 && (!bestTransition || damage > bestTransition.damage)) {
              bestTransition = { state: attacked, damage };
            }
          } catch {
            // Ignore command variants that become illegal for this simulated order.
          }
        }
      }
    }
    if (!bestTransition) {
      return false;
    }
    current = bestTransition.state;
  }
  return false;
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
    (isLethalIncomingThreat(threat) ? 95 : threat.threatened ? 36 : 0) -
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
  return 22 + afterBest * 0.35 + improvement * 0.8 - cost * 6 - whiteMirrorExposedPowerMagicPenalty(after, action);
}

function whiteMirrorExposedPowerMagicPenalty(state: GameState, action: MagicAction): number {
  if (
    action.target.kind !== "monster" ||
    !isWhiteMirrorState(state, state.currentPlayer) ||
    state.players[state.currentPlayer].stones > 1 ||
    bestMasterLethalOpportunityScore(state, action.target.slotKey) > 0 ||
    nextTurnLevelUpPotential(state, action.target.slotKey) > 0
  ) {
    return 0;
  }
  const target = state.slots[action.target.slotKey].monster;
  if (!target || target.owner !== state.currentPlayer || target.level < 2) {
    return 0;
  }
  return WHITE_MIRROR_EXPOSED_POWER_MAGIC_PENALTY;
}

function scoreShieldMagicDecision(
  state: GameState,
  after: GameState,
  action: MagicAction,
  cost: number,
  weights: AiEvaluationWeights,
): number {
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
      const preventsLethal = isLethalIncomingThreat(threat) && !isLethalIncomingThreat(threatAfterShield);
      return shouldProtectInDeckOutRace(state, target.slotKey, threat, preventsLethal, nextTurnLevelUpPotential(state, target.slotKey));
    });
  }
  if (isWhiteMirrorCloseout(state)) {
    protectedTargets = protectedTargets.filter((target) => {
      const threat = incomingThreat(state, target.slotKey);
      const threatAfterShield = incomingThreat(after, target.slotKey);
      const preventsLethal = isLethalIncomingThreat(threat) && !isLethalIncomingThreat(threatAfterShield);
      return preventsLethal || isLethalIncomingThreat(threat) || nextTurnLevelUpPotential(state, target.slotKey) > 0;
    });
  }
  protectedTargets = protectedTargets.filter(
    (target) => !shouldDeferShieldUntilAfterCurrentTurnWork(state, target.slotKey, cost, weights),
  );

  if (protectedTargets.length === 0) {
    return -100;
  }

  const protectionValue = protectedTargets.reduce((total, target) => {
    const threat = incomingThreat(state, target.slotKey);
    return total + monsterValue(state, target.slotKey) * 0.18 + (isLethalIncomingThreat(threat) ? 80 : threat.threatened ? 32 : 10);
  }, 0);

  return 16 + protectionValue - cost * 5;
}

function magicReason(state: GameState, after: GameState, action: MagicAction): string {
  const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === action.handInstanceId);
  const name = card ? getCardName(card.cardId) : "マジック";
  if (after.winner === state.currentPlayer) {
    return `${name}で相手マスターを倒せるため使用`;
  }
  if (card && clearMagicFinishConversionTarget(state, after, card.cardId)) {
    return `${name}でシールドを外し同ターンの撃破圏を作れるため使用`;
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

function bestWakeFollowUpFinishScore(state: GameState, attackerSlotKey: SlotKey): number {
  return Math.max(
    bestMonsterKillOpportunityScore(state, attackerSlotKey),
    bestMasterLethalOpportunityScore(state, attackerSlotKey),
  );
}

function bestMonsterKillOpportunityScore(
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
        if (target.kind !== "monster" || isOwnedMonsterTarget(state, target, playerId)) {
          continue;
        }
        if (onlyTargetSlotKey && target.slotKey !== onlyTargetSlotKey) {
          continue;
        }
        const targetMonster = state.slots[target.slotKey].monster;
        if (!targetMonster) {
          continue;
        }
        const damage = estimateMonsterDamage(state, targetMonster, slotKey, command);
        if (damage >= targetMonster.hp) {
          best = Math.max(best, 300 + monsterValue(state, target.slotKey));
        }
      }
    }
  }

  return best;
}

function bestMasterLethalOpportunityScore(state: GameState, attackerSlotKey: SlotKey): number {
  const playerId = state.currentPlayer;
  const monster = state.slots[attackerSlotKey].monster;
  if (!monster?.status || monster.status !== "active" || monster.actionCount >= monster.actionLimit) {
    return 0;
  }

  const opponent = opponentOf(playerId);
  let best = 0;
  for (const command of getMonsterCommands(monster)) {
    for (const target of getCommandTargets(state, attackerSlotKey, command.id)) {
      if (target.kind !== "master" || target.playerId !== opponent) {
        continue;
      }
      const damage = Math.max(0, estimateCommandPower(state, attackerSlotKey, command) - 2);
      if (damage >= state.players[opponent].masterHp) {
        best = Math.max(best, 420 + masterDamageScore(state, playerId, damage));
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
          bestDamage = Math.max(bestDamage, Math.max(0, estimateCommandPower(scopedState, slotKey, command) - 2));
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
        bestDamage = Math.max(bestDamage, Math.max(0, estimateCommandPower(readyState, slotKey, command) - 2));
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
          if (command.name !== "ドリルブレイク" || isPrimaryDrillBreakAttacker(readyState.slots[slotKey])) {
            bestMasterDamage[target.playerId] = Math.max(
              bestMasterDamage[target.playerId],
              Math.max(0, estimateCommandPower(readyState, slotKey, command) - 2),
            );
          }
          continue;
        }
        if (target.kind !== "monster" || readyState.slots[target.slotKey].owner === attackerId) {
          continue;
        }
        const targetMonster = readyState.slots[target.slotKey].monster;
        if (!targetMonster) {
          continue;
        }
        updateMonsterThreat(monsterThreats, target.slotKey, estimateMonsterDamage(readyState, targetMonster, slotKey, command), targetMonster.hp);
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

  addMasterActionMonsterThreats(readyState, attackerId, monsterThreats);

  return { masterDamage, monsterThreats };
}

function addMasterActionMonsterThreats(
  state: GameState,
  attackerId: PlayerId,
  threats: Partial<Record<SlotKey, IncomingThreat>>,
): void {
  if (!getCurrentMasterActionIds(state).includes("master_attack")) {
    return;
  }
  for (const target of getMasterActionTargets(state, "master_attack")) {
    if (target.kind !== "monster" || state.slots[target.slotKey].owner === attackerId) {
      continue;
    }
    const targetMonster = state.slots[target.slotKey].monster;
    if (!targetMonster) {
      continue;
    }
    updateMonsterMasterActionThreat(
      threats,
      target.slotKey,
      estimateMasterActionMonsterDamageBySimulation(state, target),
      targetMonster.hp,
    );
  }
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
  const maxDamage = Math.max(current.maxDamage, damage);
  const maxDamageWithMasterAction = maxDamage + current.masterActionDamage;
  threats[slotKey] = {
    threatened: true,
    lethal: current.lethal || damage >= targetHp,
    maxDamage,
    masterActionDamage: current.masterActionDamage,
    maxDamageWithMasterAction,
    lethalWithMasterAction: current.lethalWithMasterAction || maxDamageWithMasterAction >= targetHp,
  };
}

function updateMonsterMasterActionThreat(
  threats: Partial<Record<SlotKey, IncomingThreat>>,
  slotKey: SlotKey,
  damage: number,
  targetHp: number,
): void {
  if (damage <= 0) {
    return;
  }
  const current = threats[slotKey] ?? NO_THREAT;
  const masterActionDamage = Math.max(current.masterActionDamage, damage);
  const maxDamageWithMasterAction = current.maxDamage + masterActionDamage;
  threats[slotKey] = {
    threatened: true,
    lethal: current.lethal,
    maxDamage: current.maxDamage,
    masterActionDamage,
    maxDamageWithMasterAction,
    lethalWithMasterAction: current.lethalWithMasterAction || maxDamageWithMasterAction >= targetHp || damage >= targetHp,
  };
}

function estimateMasterActionMonsterDamageBySimulation(
  state: GameState,
  target: Extract<Target, { kind: "monster" }>,
): number {
  const before = state.slots[target.slotKey].monster;
  if (!before) {
    return 0;
  }
  try {
    const after = useMasterAction(state, "master_attack", target);
    const current = after.slots[target.slotKey].monster;
    return Math.max(0, before.hp - (current?.hp ?? 0));
  } catch {
    return 0;
  }
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
    return total + (isLethalIncomingThreat(threat) ? value * 0.85 + 70 : Math.min(monster.hp, maxIncomingThreatDamage(threat)) * 18 + value * 0.18);
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
  if (!preventsLethal && !isLethalIncomingThreat(threat)) {
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
      const damage = estimateMonsterDamage(readyState, targetMonster, slotKey, command);
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

function isLethalIncomingThreat(threat: IncomingThreat): boolean {
  return threat.lethal || threat.lethalWithMasterAction;
}

function maxIncomingThreatDamage(threat: IncomingThreat): number {
  return Math.max(threat.maxDamage, threat.maxDamageWithMasterAction);
}

function estimateAttackScore(state: GameState, attackerSlotKey: SlotKey, command: ReturnType<typeof getMonsterCommands>[number], target: Target): number {
  const attacker = state.slots[attackerSlotKey].monster;
  if (!attacker) {
    return -100;
  }
  if (target.kind === "master") {
    const damage = Math.max(0, estimateCommandPower(state, attackerSlotKey, command) - 2);
    return damage > 0 ? masterDamageScore(state, attacker.owner, damage) : -100;
  }

  const targetMonster = state.slots[target.slotKey].monster;
  if (!targetMonster) {
    return -100;
  }
  const damage = estimateMonsterDamage(state, targetMonster, attackerSlotKey, command);
  if (damage >= targetMonster.hp) {
    return 300 + monsterValue(state, target.slotKey);
  }
  return damage > 0 ? 25 * damage : -100;
}

function estimateMonsterDamage(
  state: GameState,
  target: MonsterState,
  attackerSlotKey: SlotKey,
  command: ReturnType<typeof getMonsterCommands>[number],
): number {
  if (target.immune) {
    return 0;
  }
  let damage = estimateCommandPower(state, attackerSlotKey, command);
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

function estimateCommandPower(
  state: GameState,
  attackerSlotKey: SlotKey,
  command: ReturnType<typeof getMonsterCommands>[number],
): number {
  const monster = state.slots[attackerSlotKey].monster;
  if (!monster) {
    return 0;
  }
  const basePower = command.name === "ドリルブレイク"
    ? estimateDrillBreakPower(state, attackerSlotKey)
    : command.power;
  let power = monster.powerOverride ?? basePower;
  const upperCommand = getMonsterCommands(monster)[0];
  if (monster.focused && upperCommand?.id === command.id) {
    power += 1;
  }
  if (monster.powerUp) {
    power += 1;
  }
  power += monster.powerModifier ?? 0;
  if (monster.berserkPower) {
    power += 1;
  }
  return Math.max(0, power);
}

function estimateDrillBreakPower(state: GameState, attackerSlotKey: SlotKey): number {
  const attackerSlot = state.slots[attackerSlotKey];
  const attacker = attackerSlot.monster;
  const partnerSlotKey = drillBreakPartnerSlotKey(state, attackerSlot);
  const partner = partnerSlotKey ? state.slots[partnerSlotKey].monster : undefined;
  if (!attacker || !partner) {
    return 0;
  }
  return (getMonsterCommands(attacker)[0]?.power ?? 0) + (getMonsterCommands(partner)[0]?.power ?? 0);
}

function findMonsterSlot(state: GameState, instanceId: string): SlotKey | undefined {
  return ALL_FIELD_ORDER.find((slotKey) => state.slots[slotKey].monster?.instanceId === instanceId);
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function stateSlotLabel(slotKey: SlotKey): string {
  const [, row, lane] = slotKey.split("_");
  return `${row === "front" ? "前列" : "後列"}${lane === "left" ? "左" : "右"}`;
}
