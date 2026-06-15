export type AiEvaluationProfile = "stable" | "strong";

export interface AiEvaluationWeights {
  masterHp: number;
  stone: number;
  hand: number;
  deck: number;
  masterDamageBase: number;
  monsterKillBase: number;
  monsterDamagePerPoint: number;
  genericMagicCost: number;
  masterDamageMagicCost: number;
  monsterDamageMagicCost: number;
  monsterKillMagicCost: number;
  healPerPoint: number;
}

const BASE_WEIGHTS: AiEvaluationWeights = {
  masterHp: 80,
  stone: 6,
  hand: 3,
  deck: 1,
  masterDamageBase: 90,
  monsterKillBase: 300,
  monsterDamagePerPoint: 25,
  genericMagicCost: 8,
  masterDamageMagicCost: 18,
  monsterDamageMagicCost: 8,
  monsterKillMagicCost: 8,
  healPerPoint: 26,
};

export const AI_EVALUATION_WEIGHTS = {
  stable: BASE_WEIGHTS,
  strong: {
    ...BASE_WEIGHTS,
    masterHp: 85,
    stone: 5,
    masterDamageBase: 96,
    monsterKillBase: 280,
    monsterDamagePerPoint: 24,
  },
} satisfies Record<AiEvaluationProfile, AiEvaluationWeights>;

export const DEFAULT_AI_EVALUATION_WEIGHTS = AI_EVALUATION_WEIGHTS.stable;
