import type { CpuAiProfile, CpuAiTuning } from "./cpuAiTypes";
import { DEFAULT_PLAYER_DECK_PRESET_ID } from "./defaultDeckPresets";
import type { DeckPresetId } from "./deckPresets";
import type { WhiteAiTuningOpponent, WhiteAiTuningVariant } from "./whiteAiTuningLoop";

export const CURRENT_WHITE_AI_DECK_PRESET_ID = DEFAULT_PLAYER_DECK_PRESET_ID as DeckPresetId;

export const CURRENT_WHITE_AI_BLACK_PRESSURE_STRONG_OPPONENT = {
  id: "black_pressure_strong",
  category: "black",
  label: "黒: black-pressure / strong",
  participant: "black",
  deckPreset: "black-pressure",
  aiProfile: "strong",
} as const satisfies WhiteAiTuningOpponent;

export const CURRENT_WHITE_AI_BLACK_1375_PRESSURE_OPPONENT = {
  id: "black_1375_pressure",
  category: "black",
  label: "黒: 1375 / pressure",
  participant: "black",
  deckPreset: "submission-pro-no-rare8-black-1375",
  aiProfile: "pressure",
} as const satisfies WhiteAiTuningOpponent;

export const CURRENT_WHITE_AI_DECOY_BACK_STABLE_OPPONENT = {
  id: "decoy_back_stable",
  category: "decoy",
  label: "デコイ: 後衛安定 / enemy+16",
  participant: "decoy",
  deckPreset: "master-lab-decoy-unit-back-stable",
  aiProfile: "strong",
  labActionMargin: 12,
  labEvaluationTuning: { targetOwnerBias: { enemy: 16 } },
} as const satisfies WhiteAiTuningOpponent;

export const CURRENT_WHITE_AI_MIRROR_OPPONENT = {
  id: "white_current_mirror",
  category: "white",
  label: "白: 暫定白最強ミラー / white",
  participant: "white",
  deckPreset: CURRENT_WHITE_AI_DECK_PRESET_ID,
  aiProfile: "white",
} as const satisfies WhiteAiTuningOpponent;

export const CURRENT_WHITE_AI_DEFAULT_OPPONENTS = [
  CURRENT_WHITE_AI_BLACK_PRESSURE_STRONG_OPPONENT,
  CURRENT_WHITE_AI_BLACK_1375_PRESSURE_OPPONENT,
  CURRENT_WHITE_AI_DECOY_BACK_STABLE_OPPONENT,
  CURRENT_WHITE_AI_MIRROR_OPPONENT,
] as const satisfies readonly WhiteAiTuningOpponent[];

export function createCurrentWhiteAiVariant(
  id: string,
  label: string,
  tuning: CpuAiTuning | undefined,
  hypothesis: string,
  aiProfile: CpuAiProfile = "white",
): WhiteAiTuningVariant {
  return {
    id,
    kind: tuning ? "hybrid" : "baseline",
    label,
    deckPreset: CURRENT_WHITE_AI_DECK_PRESET_ID,
    aiProfile,
    ...(tuning ? { tuning } : {}),
    hypothesis,
  };
}
