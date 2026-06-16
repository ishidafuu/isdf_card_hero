import { buildDeckCardIds, summarizeDeckCardIds } from "./cards";
import {
  DECK_SUBMISSION_PRESET_GROUPS,
  DECK_SUBMISSION_PRESETS,
  type DeckSubmissionGroupId,
} from "./deckSubmissionPresets";
import type { MasterId } from "./types";

export type BuiltInDeckPresetId = "balanced-normal" | "pressure-normal" | "black-pressure" | "special-showcase";
export type MasterLabDeckPresetId =
  | "master-lab-decoy-magic-stable"
  | "master-lab-decoy-magic-removal"
  | "master-lab-decoy-magic-burst"
  | "master-lab-decoy-magic-tech"
  | "master-lab-decoy-magic-finisher"
  | "master-lab-decoy-unit-front-wall"
  | "master-lab-decoy-unit-front-reach"
  | "master-lab-decoy-unit-front-growth"
  | "master-lab-decoy-unit-back-stable"
  | "master-lab-decoy-unit-back-pressure";
export type DeckSubmissionPresetId = `submission-${string}`;
export type DeckPresetId = BuiltInDeckPresetId | MasterLabDeckPresetId | DeckSubmissionPresetId;
export type DeckPresetGroupId = "built-in" | "master-lab" | DeckSubmissionGroupId;

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

const DECOY_MAGIC_STABLE_DECK_CARD_IDS = replaceDeckCards(BLACK_PRESSURE_DECK_CARD_IDS, [
  ["card_120", "card_114"],
  ["card_130", "card_030"],
  ["card_029", "card_089"],
]);

const DECOY_MAGIC_REMOVAL_DECK_CARD_IDS = replaceDeckCards(BLACK_PRESSURE_DECK_CARD_IDS, [
  ["card_120", "card_092"],
  ["card_130", "card_026"],
  ["card_029", "card_056"],
  ["card_093", "card_126"],
]);

const DECOY_MAGIC_BURST_DECK_CARD_IDS = replaceDeckCards(BLACK_PRESSURE_DECK_CARD_IDS, [
  ["card_120", "power_up"],
  ["card_130", "power_up"],
  ["card_029", "card_094"],
  ["card_093", "card_094"],
]);

const DECOY_MAGIC_TECH_DECK_CARD_IDS = replaceDeckCards(BLACK_PRESSURE_DECK_CARD_IDS, [
  ["card_120", "card_061"],
  ["card_130", "healing"],
  ["card_029", "card_113"],
  ["card_093", "card_122"],
]);

const DECOY_MAGIC_FINISHER_DECK_CARD_IDS = replaceDeckCards(BLACK_PRESSURE_DECK_CARD_IDS, [
  ["card_029", "thunder"],
]);

const DECOY_UNIT_FRONT_WALL_DECK_CARD_IDS = replaceDeckCards(BLACK_PRESSURE_DECK_CARD_IDS, [
  ["card_099", "card_109"],
  ["card_067", "card_133"],
  ["card_134", "bomuzo"],
]);

const DECOY_UNIT_FRONT_REACH_DECK_CARD_IDS = replaceDeckCards(BLACK_PRESSURE_DECK_CARD_IDS, [
  ["card_099", "card_045"],
  ["card_067", "bomuzo"],
  ["card_071", "card_009"],
]);

const DECOY_UNIT_FRONT_GROWTH_DECK_CARD_IDS = replaceDeckCards(BLACK_PRESSURE_DECK_CARD_IDS, [
  ["card_099", "card_047"],
  ["card_067", "card_144"],
  ["card_071", "card_109"],
]);

const DECOY_UNIT_BACK_STABLE_DECK_CARD_IDS = replaceDeckCards(BLACK_PRESSURE_DECK_CARD_IDS, [
  ["card_145", "card_083"],
  ["card_112", "card_053"],
  ["card_050", "card_049"],
]);

const DECOY_UNIT_BACK_PRESSURE_DECK_CARD_IDS = replaceDeckCards(BLACK_PRESSURE_DECK_CARD_IDS, [
  ["card_112", "card_049"],
  ["card_053", "beyond"],
  ["card_145", "card_050"],
]);

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

const MASTER_LAB_DECK_PRESETS: DeckPresetDef[] = [
  {
    id: "master-lab-decoy-magic-stable",
    name: "デコイ実験: 安定マジック",
    description: "black-pressure派生。リ・シャッフル、二重の盾、竜の盾で継戦と防御を厚くする。",
    cardIds: DECOY_MAGIC_STABLE_DECK_CARD_IDS,
    allowSpecial: false,
    masterId: "black",
    mode: "Master Lab",
    group: "master-lab",
  },
  {
    id: "master-lab-decoy-magic-removal",
    name: "デコイ実験: 除去マジック",
    description: "black-pressure派生。マッドファイア、スパーク、ブラックレイン、大地の怒りで盤面干渉を厚くする。",
    cardIds: DECOY_MAGIC_REMOVAL_DECK_CARD_IDS,
    allowSpecial: false,
    masterId: "black",
    mode: "Master Lab",
    group: "master-lab",
  },
  {
    id: "master-lab-decoy-magic-burst",
    name: "デコイ実験: バースト",
    description: "black-pressure派生。パワーアップとバーサクパワーを増やし、受けた後の反撃速度を見る。",
    cardIds: DECOY_MAGIC_BURST_DECK_CARD_IDS,
    allowSpecial: false,
    masterId: "black",
    mode: "Master Lab",
    group: "master-lab",
  },
  {
    id: "master-lab-decoy-magic-tech",
    name: "デコイ実験: テック",
    description: "black-pressure派生。誘惑、ヒーリング、ロストーン、リターンで状況対応力を見る。",
    cardIds: DECOY_MAGIC_TECH_DECK_CARD_IDS,
    allowSpecial: false,
    masterId: "black",
    mode: "Master Lab",
    group: "master-lab",
  },
  {
    id: "master-lab-decoy-magic-finisher",
    name: "デコイ実験: サンダー1枚",
    description: "black-pressure派生。悪魔のダンス1枚だけをサンダーに替え、勝ち切り札の副作用を見る。",
    cardIds: DECOY_MAGIC_FINISHER_DECK_CARD_IDS,
    allowSpecial: false,
    masterId: "black",
    mode: "Master Lab",
    group: "master-lab",
  },
  {
    id: "master-lab-decoy-unit-front-wall",
    name: "デコイ実験: 前衛耐久",
    description: "black-pressure派生。ゴーント、ゾンビ、ファントムをナッツロックル、デスシープ、ボムゾウへ替え、囮で守る前衛の粘りを見る。",
    cardIds: DECOY_UNIT_FRONT_WALL_DECK_CARD_IDS,
    allowSpecial: false,
    masterId: "black",
    mode: "Master Lab",
    group: "master-lab",
  },
  {
    id: "master-lab-decoy-unit-front-reach",
    name: "デコイ実験: 前衛射程",
    description: "black-pressure派生。アーシュ＆ロロ、ボムゾウ、神斬丸を増やし、後衛依存を増やさずに離れた敵へ触れる力を見る。",
    cardIds: DECOY_UNIT_FRONT_REACH_DECK_CARD_IDS,
    allowSpecial: false,
    masterId: "black",
    mode: "Master Lab",
    group: "master-lab",
  },
  {
    id: "master-lab-decoy-unit-front-growth",
    name: "デコイ実験: 前衛育成",
    description: "black-pressure派生。真勇者ダイン、ホロウダイン、ナッツロックルを増やし、守った駒を盤面制圧へつなげられるか見る。",
    cardIds: DECOY_UNIT_FRONT_GROWTH_DECK_CARD_IDS,
    allowSpecial: false,
    masterId: "black",
    mode: "Master Lab",
    group: "master-lab",
  },
  {
    id: "master-lab-decoy-unit-back-stable",
    name: "デコイ実験: 後衛安定",
    description: "black-pressure派生。フーヨウ、ラティーヌ、バルキャノンを増やし、守る価値の高い後衛を厚くする。",
    cardIds: DECOY_UNIT_BACK_STABLE_DECK_CARD_IDS,
    allowSpecial: false,
    masterId: "black",
    mode: "Master Lab",
    group: "master-lab",
  },
  {
    id: "master-lab-decoy-unit-back-pressure",
    name: "デコイ実験: 後衛圧力",
    description: "black-pressure派生。バルキャノン、ビヨンド、ゼックを増やし、後衛から敵主力を先に削る形を見る。",
    cardIds: DECOY_UNIT_BACK_PRESSURE_DECK_CARD_IDS,
    allowSpecial: false,
    masterId: "black",
    mode: "Master Lab",
    group: "master-lab",
  },
];

export const DECK_PRESET_GROUPS: DeckPresetGroupDef[] = [
  { id: "built-in", name: "標準プリセット" },
  { id: "master-lab", name: "Master Lab実験" },
  ...DECK_SUBMISSION_PRESET_GROUPS.map((group) => ({ id: group.id, name: group.name })),
];

export const DECK_PRESETS: DeckPresetDef[] = [
  ...BUILT_IN_DECK_PRESETS,
  ...MASTER_LAB_DECK_PRESETS,
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

function replaceDeckCards(
  baseCardIds: readonly string[],
  replacements: ReadonlyArray<readonly [fromCardId: string, toCardId: string]>,
): string[] {
  const cardIds = [...baseCardIds];
  for (const [fromCardId, toCardId] of replacements) {
    const index = cardIds.indexOf(fromCardId);
    if (index < 0) {
      throw new Error(`Cannot replace missing deck card: ${fromCardId}`);
    }
    cardIds[index] = toCardId;
  }
  return cardIds;
}
