import type { AiEvaluationWeights } from "./aiWeights";
import type { CommandAction, MagicAction, MasterActionId, PlayerId, SlotKey, Target } from "./types";

export const CPU_AI_PROFILES = [
  "stable",
  "strong",
  "pressure",
  "defensive",
  "white",
  "white_planner",
  "white_rollout",
  "omniscient",
] as const;

export type CpuAiProfile = (typeof CPU_AI_PROFILES)[number];
export type CpuAiProfiles = Record<PlayerId, CpuAiProfile>;

export interface CpuAiSearchOptions {
  detailedWidth?: number;
  sameTurnSearchDepth?: number;
  sameTurnSearchWidth?: number;
  sameTurnTerminalPlanDepth?: number;
  sameTurnTerminalPlanWidth?: number;
  sameTurnTerminalPlanWeight?: number;
  sameTurnTerminalPlanComparisonWeight?: number;
  sameTurnOpponentTerminalPlanDepth?: number;
  sameTurnOpponentTerminalPlanWidth?: number;
  sameTurnOpponentTerminalPlanWeight?: number;
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
  terminalPlanRolloutOncePerTurn?: number;
  beamScoreThreshold?: number;
}

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
    whiteEnemyFrontAttackBonus?: number;
    whiteBlackFrontThreatBonus?: number;
    whiteActiveFrontWorkBonus?: number;
    whitePygmyFrontSetupBonus?: number;
    whiteStrictShieldPenalty?: number;
    whiteLowStoneShieldPenalty?: number;
    whiteLowStoneWakePenalty?: number;
    whiteLowStoneSummonPenalty?: number;
    whiteLowStoneFocusPenalty?: number;
    whiteShieldThreatConversionBonus?: number;
    whiteShieldBreakthroughPenalty?: number;
    whiteShieldNoPressurePenalty?: number;
    whiteWakeImmediateWorkBonus?: number;
    whiteWakeLevelUpSetupBonus?: number;
    whiteCloseoutAfterShieldBonus?: number;
    whiteSecondShieldLowStonePenalty?: number;
    whiteSecondShieldCommitmentPenalty?: number;
    whiteLowStoneFocusConversionBonus?: number;
    whiteWakeSafeWorkBonus?: number;
    whiteLowStoneFocusMissedAttackPenalty?: number;
    whiteLowStoneNonLethalFacePenalty?: number;
    whiteMirrorThreatenedNonLethalFacePenalty?: number;
    whiteThreatSourceAttackBonus?: number;
    whiteSetupAfterThreatReductionBonus?: number;
    whiteRedirectMarkedAttackPenalty?: number;
    whiteThreatLeftLowStoneSetupPenalty?: number;
    whiteSafeRetreatOverShieldBonus?: number;
    whiteBoardControlMasterAttackPenalty?: number;
    whiteReadyBacklineRetreatPenalty?: number;
    whiteDisadvantagedSummonOvercommitPenalty?: number;
    whiteBlockedBacklineNoWorkSummonPenalty?: number;
    whiteBlockedBacklineExposedSummonPenalty?: number;
    whiteBackSlotFutureValuePenalty?: number;
    whiteBackSlotReservationPlanBonus?: number;
    whiteLowStoneBackSlotAlternativeBonus?: number;
    whiteBackSlotFutureStateBonus?: number;
    whiteLastBackSlotNoReachSummonGuardPenalty?: number;
    whiteLastBackSlotHoldPlanBonus?: number;
    whiteDeathSheepSpecialLockPenalty?: number;
    whiteBlackUnsafeMasterAttackPenalty?: number;
    whiteFrontChipResponsePenalty?: number;
    whiteFrontThreatFocusCounterBonus?: number;
  };
}

export interface CpuAiOptions {
  profile?: CpuAiProfile;
  profiles?: Partial<CpuAiProfiles>;
  search?: CpuAiSearchOptions;
  searches?: Partial<Record<PlayerId, CpuAiSearchOptions>>;
  tuning?: CpuAiTuning;
  tunings?: Partial<Record<PlayerId, CpuAiTuning>>;
}

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
