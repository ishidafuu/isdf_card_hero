import { getCardDefsByPool } from "./cards";
import type { MagicCardDef } from "./types";

export type MagicAiEffectKind =
  | "damage"
  | "heal"
  | "shield"
  | "buff"
  | "debuff"
  | "search"
  | "draw"
  | "refresh"
  | "move"
  | "level"
  | "control"
  | "resource"
  | "transform"
  | "clear"
  | "wake"
  | "special";

export type MagicAiValueModel =
  | "target_damage"
  | "heal_delta"
  | "shield_delta"
  | "attack_buff_delta"
  | "search_choice"
  | "refresh_delta"
  | "state_delta";

export type MagicAiIntent =
  | "lethal"
  | "kill"
  | "protect"
  | "setup"
  | "tempo"
  | "resource"
  | "disrupt"
  | "position"
  | "consistency";

export interface MagicAiTrait {
  effectKind: MagicAiEffectKind;
  valueModel: MagicAiValueModel;
  intents: readonly MagicAiIntent[];
}

export const MAGIC_AI_TRAITS = {
  healing: { effectKind: "heal", valueModel: "heal_delta", intents: ["protect"] },
  thunder: { effectKind: "damage", valueModel: "target_damage", intents: ["lethal", "kill"] },
  power_up: { effectKind: "buff", valueModel: "attack_buff_delta", intents: ["lethal", "kill", "setup"] },

  card_025: { effectKind: "shield", valueModel: "shield_delta", intents: ["protect"] },
  card_026: { effectKind: "damage", valueModel: "target_damage", intents: ["lethal", "kill"] },
  card_027: { effectKind: "debuff", valueModel: "state_delta", intents: ["protect", "disrupt"] },
  card_028: { effectKind: "level", valueModel: "state_delta", intents: ["setup", "disrupt"] },
  card_029: { effectKind: "level", valueModel: "state_delta", intents: ["disrupt"] },
  card_030: { effectKind: "shield", valueModel: "shield_delta", intents: ["protect"] },
  card_031: { effectKind: "move", valueModel: "state_delta", intents: ["position", "tempo"] },

  card_055: { effectKind: "shield", valueModel: "shield_delta", intents: ["protect"] },
  card_056: { effectKind: "damage", valueModel: "state_delta", intents: ["kill", "disrupt"] },
  card_057: { effectKind: "control", valueModel: "state_delta", intents: ["kill", "disrupt"] },
  card_058: { effectKind: "debuff", valueModel: "state_delta", intents: ["disrupt"] },
  card_059: { effectKind: "debuff", valueModel: "state_delta", intents: ["protect", "disrupt"] },
  card_060: { effectKind: "control", valueModel: "state_delta", intents: ["disrupt"] },
  card_061: { effectKind: "control", valueModel: "state_delta", intents: ["kill", "disrupt"] },
  card_062: { effectKind: "shield", valueModel: "shield_delta", intents: ["protect"] },
  card_063: { effectKind: "buff", valueModel: "state_delta", intents: ["setup", "tempo"] },
  card_064: { effectKind: "clear", valueModel: "state_delta", intents: ["disrupt", "protect"] },
  card_065: { effectKind: "transform", valueModel: "state_delta", intents: ["setup", "tempo"] },

  card_086: { effectKind: "debuff", valueModel: "state_delta", intents: ["disrupt", "position"] },
  card_087: { effectKind: "clear", valueModel: "state_delta", intents: ["disrupt", "protect"] },
  card_088: { effectKind: "shield", valueModel: "shield_delta", intents: ["protect"] },
  card_089: { effectKind: "shield", valueModel: "shield_delta", intents: ["protect"] },
  card_090: { effectKind: "shield", valueModel: "state_delta", intents: ["protect"] },
  card_091: { effectKind: "shield", valueModel: "shield_delta", intents: ["protect"] },
  card_092: { effectKind: "damage", valueModel: "target_damage", intents: ["lethal", "kill"] },
  card_093: { effectKind: "move", valueModel: "state_delta", intents: ["position", "tempo"] },
  card_094: { effectKind: "buff", valueModel: "attack_buff_delta", intents: ["lethal", "kill", "setup"] },
  card_095: { effectKind: "control", valueModel: "state_delta", intents: ["disrupt"] },
  card_097: { effectKind: "control", valueModel: "state_delta", intents: ["protect", "disrupt"] },
  card_098: { effectKind: "control", valueModel: "state_delta", intents: ["disrupt"] },

  card_113: { effectKind: "resource", valueModel: "state_delta", intents: ["resource", "disrupt"] },
  card_114: { effectKind: "refresh", valueModel: "refresh_delta", intents: ["consistency"] },
  card_115: { effectKind: "search", valueModel: "state_delta", intents: ["consistency"] },
  card_116: { effectKind: "refresh", valueModel: "refresh_delta", intents: ["consistency"] },
  card_117: { effectKind: "wake", valueModel: "state_delta", intents: ["tempo", "setup"] },
  card_118: { effectKind: "damage", valueModel: "target_damage", intents: ["kill"] },
  card_119: { effectKind: "debuff", valueModel: "state_delta", intents: ["disrupt"] },
  card_120: { effectKind: "draw", valueModel: "state_delta", intents: ["resource", "consistency"] },
  card_121: { effectKind: "resource", valueModel: "state_delta", intents: ["resource"] },
  card_122: { effectKind: "control", valueModel: "state_delta", intents: ["disrupt", "tempo"] },
  card_123: { effectKind: "search", valueModel: "search_choice", intents: ["consistency", "resource"] },
  card_124: { effectKind: "special", valueModel: "state_delta", intents: ["disrupt"] },
  card_125: { effectKind: "debuff", valueModel: "state_delta", intents: ["disrupt"] },
  card_126: { effectKind: "damage", valueModel: "state_delta", intents: ["kill", "disrupt"] },
  card_127: { effectKind: "heal", valueModel: "heal_delta", intents: ["protect"] },
  card_128: { effectKind: "shield", valueModel: "state_delta", intents: ["protect"] },
  card_129: { effectKind: "buff", valueModel: "state_delta", intents: ["setup"] },
  card_130: { effectKind: "transform", valueModel: "state_delta", intents: ["tempo", "disrupt"] },

  card_148: { effectKind: "transform", valueModel: "state_delta", intents: ["tempo", "disrupt"] },
  card_149: { effectKind: "level", valueModel: "state_delta", intents: ["setup"] },
  card_150: { effectKind: "buff", valueModel: "attack_buff_delta", intents: ["lethal", "kill", "setup"] },
} satisfies Record<string, MagicAiTrait>;

export function getMagicAiTrait(cardId: string): MagicAiTrait | undefined {
  return (MAGIC_AI_TRAITS as Readonly<Record<string, MagicAiTrait>>)[cardId];
}

export function getImplementedMagicCardsWithoutAiTraits(): MagicCardDef[] {
  return getCardDefsByPool("all").filter((def): def is MagicCardDef => def.type === "magic" && !!def.implemented && !getMagicAiTrait(def.id));
}
