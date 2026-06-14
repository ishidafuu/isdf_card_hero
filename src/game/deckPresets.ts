import { buildDeckCardIds, summarizeDeckCardIds } from "./cards";
import {
  DECK_SUBMISSION_PRESET_GROUPS,
  DECK_SUBMISSION_PRESETS,
  type DeckSubmissionGroupId,
} from "./deckSubmissionPresets";
import type { MasterId } from "./types";

export type BuiltInDeckPresetId = "balanced-normal" | "pressure-normal" | "black-pressure" | "special-showcase";
export type DeckSubmissionPresetId = `submission-${string}`;
export type DeckPresetId = BuiltInDeckPresetId | DeckSubmissionPresetId;
export type DeckPresetGroupId = "built-in" | DeckSubmissionGroupId;

export interface DeckPresetDef {
  id: DeckPresetId;
  name: string;
  description: string;
  cardIds: readonly string[];
  allowSpecial: boolean;
  sourceUrl?: string;
  sourceDeckId?: number;
  mode?: string;
  masterId?: MasterId;
  deckCode?: string;
  group?: DeckPresetGroupId;
}

export interface DeckPresetGroupDef {
  id: DeckPresetGroupId;
  name: string;
}

export type DeckPresetMasterFilter = "all" | MasterId;
export type DeckPresetRare8Filter = "all" | "with" | "without";

export interface DeckPresetFilters {
  master: DeckPresetMasterFilter;
  rare8: DeckPresetRare8Filter;
  cardIds: readonly string[];
}

export const DEFAULT_DECK_PRESET_FILTERS: DeckPresetFilters = {
  master: "all",
  rare8: "all",
  cardIds: [],
};

const BALANCED_NORMAL_DECK_CARD_IDS = buildDeckCardIds(20260613, { masterId: "white" });
const PRESSURE_NORMAL_DECK_CARD_IDS = buildDeckCardIds(20260614, { masterId: "white" });
const BLACK_PRESSURE_DECK_CARD_IDS = buildDeckCardIds(20260615, { masterId: "black" });

const SPECIAL_SHOWCASE_DECK_CARD_IDS = [
  "bomuzo",
  "bomuzo",
  "bomuzo",
  "polyspinner",
  "polyspinner",
  "polyspinner",
  "card_003",
  "card_003",
  "card_003",
  "card_033",
  "card_033",
  "card_033",
  "yanbaru",
  "yanbaru",
  "yanbaru",
  "card_020",
  "card_020",
  "card_020",
  "healing",
  "healing",
  "thunder",
  "thunder",
  "card_123",
  "card_123",
  "card_006",
  "card_012",
  "card_138",
  "card_141",
  "card_142",
  "card_143",
] as const;

const BUILT_IN_DECK_PRESETS: DeckPresetDef[] = [
  {
    id: "balanced-normal",
    name: "通常バランス",
    description: "通常カードのみ。手動プレイとCPU検証の基準に使う安定構成。",
    cardIds: BALANCED_NORMAL_DECK_CARD_IDS,
    allowSpecial: false,
    group: "built-in",
  },
  {
    id: "pressure-normal",
    name: "通常プレッシャー",
    description: "通常カードのみ。攻撃寄りのseed固定構成。",
    cardIds: PRESSURE_NORMAL_DECK_CARD_IDS,
    allowSpecial: false,
    group: "built-in",
  },
  {
    id: "black-pressure",
    name: "ブラック検証",
    description: "通常カードのみ。ブラックマスターや強気AIの検証向け構成。",
    cardIds: BLACK_PRESSURE_DECK_CARD_IDS,
    allowSpecial: false,
    group: "built-in",
  },
  {
    id: "special-showcase",
    name: "スペシャル検証",
    description: "スーパー24枚導入後の代表効果を確認する固定構成。",
    cardIds: SPECIAL_SHOWCASE_DECK_CARD_IDS,
    allowSpecial: true,
    group: "built-in",
  },
];

export const DECK_PRESET_GROUPS: DeckPresetGroupDef[] = [
  { id: "built-in", name: "標準プリセット" },
  ...DECK_SUBMISSION_PRESET_GROUPS.map((group) => ({ id: group.id, name: group.name })),
];

export const DECK_PRESETS: DeckPresetDef[] = [
  ...BUILT_IN_DECK_PRESETS,
  ...DECK_SUBMISSION_PRESETS,
];

export const DECK_PRESET_IDS = DECK_PRESETS.map((preset) => preset.id);

export function deckPresetMatchesFilters(preset: DeckPresetDef, filters: DeckPresetFilters): boolean {
  if (filters.master !== "all" && preset.masterId !== filters.master) {
    return false;
  }
  if (filters.rare8 === "with" && preset.mode !== "Pro 8あり") {
    return false;
  }
  if (filters.rare8 === "without" && preset.mode !== "Pro 8なし") {
    return false;
  }
  if (filters.cardIds.length > 0 && !filters.cardIds.some((cardId) => preset.cardIds.includes(cardId))) {
    return false;
  }
  return true;
}

export function filterDeckPresets(filters: DeckPresetFilters): DeckPresetDef[] {
  return DECK_PRESETS.filter((preset) => deckPresetMatchesFilters(preset, filters));
}

export function buildDeckPresetCardIds(presetId: DeckPresetId): string[] {
  return [...getDeckPreset(presetId).cardIds];
}

export function deckPresetAllowsSpecial(presetId: DeckPresetId): boolean {
  return !!getDeckPreset(presetId)?.allowSpecial;
}

export function getDeckPreset(presetId: DeckPresetId): DeckPresetDef {
  const preset = DECK_PRESETS.find((candidate) => candidate.id === presetId);
  if (!preset) {
    throw new Error(`Unknown deck preset: ${presetId}`);
  }
  return preset;
}

export function validateDeckPresets(): void {
  for (const presetId of DECK_PRESET_IDS) {
    const summary = summarizeDeckCardIds(buildDeckPresetCardIds(presetId), [], {
      allowSpecial: deckPresetAllowsSpecial(presetId),
    });
    if (!summary.valid) {
      throw new Error(`${presetId} deck preset is invalid: ${summary.errors.join(" / ")}`);
    }
  }
}
