export type AiEvaluationProfile = "stable" | "strong" | "pressure" | "defensive" | "white";

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
  futureOwnLevelUp: number;
  futureOpponentLevelUp: number;
  futureOwnThreatenedMonster: number;
  futureOpponentThreatenedMonster: number;
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
  futureOwnLevelUp: 0.12,
  futureOpponentLevelUp: 0.18,
  futureOwnThreatenedMonster: 0.24,
  futureOpponentThreatenedMonster: 0.16,
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
  pressure: {
    ...BASE_WEIGHTS,
    masterHp: 76,
    stone: 5,
    masterDamageBase: 108,
    monsterKillBase: 250,
    monsterDamagePerPoint: 22,
    masterDamageMagicCost: 14,
    monsterKillMagicCost: 10,
  },
  defensive: {
    ...BASE_WEIGHTS,
    masterHp: 92,
    stone: 7,
    masterDamageBase: 82,
    monsterKillBase: 330,
    monsterDamagePerPoint: 28,
    genericMagicCost: 6,
    healPerPoint: 34,
  },
  white: {
    ...BASE_WEIGHTS,
    masterHp: 86,
    stone: 5,
    masterDamageBase: 94,
    monsterKillBase: 295,
    monsterDamagePerPoint: 25,
    genericMagicCost: 8,
    healPerPoint: 30,
    futureOwnLevelUp: 0.18,
    futureOpponentLevelUp: 0.22,
    futureOwnThreatenedMonster: 0.28,
    futureOpponentThreatenedMonster: 0.17,
  },
} satisfies Record<AiEvaluationProfile, AiEvaluationWeights>;

export const DEFAULT_AI_EVALUATION_WEIGHTS = AI_EVALUATION_WEIGHTS.stable;
