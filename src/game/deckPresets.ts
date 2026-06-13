import { buildDeckCardIds, summarizeDeckCardIds } from "./cards";

export type DeckPresetId = "balanced-normal" | "pressure-normal" | "black-pressure" | "special-showcase";

export interface DeckPresetDef {
  id: DeckPresetId;
  name: string;
  description: string;
  cardIds: readonly string[];
  allowSpecial: boolean;
}

export const DECK_PRESET_IDS: DeckPresetId[] = [
  "balanced-normal",
  "pressure-normal",
  "black-pressure",
  "special-showcase",
];

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

export const DECK_PRESETS: DeckPresetDef[] = [
  {
    id: "balanced-normal",
    name: "通常バランス",
    description: "通常カードのみ。手動プレイとCPU検証の基準に使う安定構成。",
    cardIds: BALANCED_NORMAL_DECK_CARD_IDS,
    allowSpecial: false,
  },
  {
    id: "pressure-normal",
    name: "通常プレッシャー",
    description: "通常カードのみ。攻撃寄りのseed固定構成。",
    cardIds: PRESSURE_NORMAL_DECK_CARD_IDS,
    allowSpecial: false,
  },
  {
    id: "black-pressure",
    name: "ブラック検証",
    description: "通常カードのみ。ブラックマスターや強気AIの検証向け構成。",
    cardIds: BLACK_PRESSURE_DECK_CARD_IDS,
    allowSpecial: false,
  },
  {
    id: "special-showcase",
    name: "スペシャル検証",
    description: "スーパー24枚導入後の代表効果を確認する固定構成。",
    cardIds: SPECIAL_SHOWCASE_DECK_CARD_IDS,
    allowSpecial: true,
  },
];

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
