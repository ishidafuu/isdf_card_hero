import type { CardDef, CardInstance, MonsterCardDef } from "./types";

export const CARD_DEFS: Record<string, CardDef> = {
  takokke: {
    id: "takokke",
    name: "タコッケー",
    type: "monster",
    role: "front",
    maxLevel: 2,
    levels: [
      {
        level: 1,
        maxHp: 5,
        commands: [{ id: "attack", name: "アタック", power: 2, range: "adjacent" }],
      },
      {
        level: 2,
        maxHp: 6,
        commands: [{ id: "attack", name: "アタック", power: 3, range: "adjacent" }],
      },
    ],
  },
  bomuzo: {
    id: "bomuzo",
    name: "ボムゾウ",
    type: "monster",
    role: "front",
    maxLevel: 2,
    levels: [
      {
        level: 1,
        maxHp: 6,
        commands: [
          { id: "self_bomb", name: "自爆", power: 2, range: "adjacent", recoilDamage: 1 },
          { id: "storm_bomb", name: "ストームボム", power: 1, range: "one_skip" },
        ],
      },
      {
        level: 2,
        maxHp: 5,
        commands: [
          { id: "self_bomb", name: "自爆", power: 3, range: "adjacent", recoilDamage: 1 },
          { id: "storm_bomb", name: "ストームボム", power: 2, range: "one_skip" },
        ],
      },
    ],
  },
  polyspinner: {
    id: "polyspinner",
    name: "ポリスピナー",
    type: "monster",
    role: "front",
    maxLevel: 2,
    actionLimit: 2,
    levels: [
      {
        level: 1,
        maxHp: 3,
        commands: [{ id: "attack", name: "アタック", power: 2, range: "adjacent" }],
      },
      {
        level: 2,
        maxHp: 3,
        commands: [{ id: "attack", name: "アタック", power: 3, range: "adjacent" }],
      },
    ],
  },
  sigma: {
    id: "sigma",
    name: "鉄拳シグマ",
    type: "monster",
    role: "front",
    maxLevel: 3,
    levels: [
      {
        level: 1,
        maxHp: 6,
        commands: [{ id: "attack", name: "アタック", power: 1, range: "adjacent" }],
      },
      {
        level: 2,
        maxHp: 6,
        commands: [{ id: "attack", name: "アタック", power: 3, range: "adjacent" }],
      },
      {
        level: 3,
        maxHp: 6,
        commands: [{ id: "tiger_fist", name: "虎皇拳", power: 5, range: "adjacent" }],
      },
    ],
  },
  beyond: {
    id: "beyond",
    name: "ビヨンド",
    type: "monster",
    role: "back",
    maxLevel: 2,
    levels: [
      {
        level: 1,
        maxHp: 2,
        commands: [
          { id: "attack", name: "アタック", power: 0, range: "adjacent" },
          { id: "aero_shoot", name: "エアロシュート", power: 2, range: "one_skip" },
        ],
      },
      {
        level: 2,
        maxHp: 2,
        commands: [
          { id: "attack", name: "アタック", power: 0, range: "adjacent" },
          { id: "aero_shoot", name: "エアロシュート", power: 3, range: "one_skip" },
        ],
      },
    ],
  },
  yanbaru: {
    id: "yanbaru",
    name: "ヤンバル",
    type: "monster",
    role: "back",
    maxLevel: 2,
    levels: [
      {
        level: 1,
        maxHp: 3,
        commands: [
          { id: "attack", name: "アタック", power: 0, range: "adjacent" },
          { id: "wild_claw", name: "ワイルドクロウ", power: 2, range: "one_skip" },
        ],
      },
      {
        level: 2,
        maxHp: 3,
        commands: [
          { id: "attack", name: "アタック", power: 0, range: "adjacent" },
          { id: "wild_claw", name: "ワイルドクロウ", power: 3, range: "one_skip" },
        ],
      },
    ],
  },
  morgan: {
    id: "morgan",
    name: "モーガン",
    type: "monster",
    role: "back",
    maxLevel: 2,
    levels: [
      {
        level: 1,
        maxHp: 4,
        commands: [
          { id: "attack", name: "アタック", power: 2, range: "adjacent" },
          { id: "arc_drive", name: "アークドライブ", power: 2, range: "any_target" },
        ],
      },
      {
        level: 2,
        maxHp: 4,
        commands: [
          { id: "attack", name: "アタック", power: 3, range: "adjacent" },
          { id: "arc_drive", name: "アークドライブ", power: 3, range: "any_target" },
        ],
      },
    ],
  },
  healing: {
    id: "healing",
    name: "ヒーリング",
    type: "magic",
    cost: 3,
    description: "味方の登場済みモンスター1体のHPを2回復する。",
    targetKinds: ["ally_monster"],
  },
  thunder: {
    id: "thunder",
    name: "サンダー",
    type: "magic",
    cost: 4,
    description: "敵の登場済みモンスター1体または相手マスターに3P。",
    targetKinds: ["enemy_monster", "enemy_master"],
  },
  power_up: {
    id: "power_up",
    name: "パワーアップ",
    type: "magic",
    cost: 3,
    description: "味方の登場済みモンスター1体の次の攻撃パワーを1上げる。",
    targetKinds: ["ally_monster"],
  },
};

export const FIXED_DECK_LIST: Array<{ cardId: string; count: number }> = [
  { cardId: "takokke", count: 3 },
  { cardId: "bomuzo", count: 3 },
  { cardId: "polyspinner", count: 3 },
  { cardId: "sigma", count: 3 },
  { cardId: "beyond", count: 3 },
  { cardId: "yanbaru", count: 3 },
  { cardId: "morgan", count: 3 },
  { cardId: "healing", count: 3 },
  { cardId: "thunder", count: 3 },
  { cardId: "power_up", count: 3 },
];

export function buildDeck(owner: string): CardInstance[] {
  const deck: CardInstance[] = [];
  for (const entry of FIXED_DECK_LIST) {
    for (let i = 0; i < entry.count; i += 1) {
      deck.push({
        cardId: entry.cardId,
        instanceId: `${owner}_${entry.cardId}_${i + 1}`,
      });
    }
  }
  return deck;
}

export function getCardDef(cardId: string): CardDef {
  const def = CARD_DEFS[cardId];
  if (!def) {
    throw new Error(`Unknown card: ${cardId}`);
  }
  return def;
}

export function getMonsterDef(cardId: string): MonsterCardDef {
  const def = getCardDef(cardId);
  if (def.type !== "monster") {
    throw new Error(`${def.name} is not a monster card`);
  }
  return def;
}

export function getCardName(cardId: string): string {
  return getCardDef(cardId).name;
}

export function validateFixedDeck(): boolean {
  const total = FIXED_DECK_LIST.reduce((sum, entry) => sum + entry.count, 0);
  return total === 30 && FIXED_DECK_LIST.every((entry) => entry.count <= 3 && !!CARD_DEFS[entry.cardId]);
}
