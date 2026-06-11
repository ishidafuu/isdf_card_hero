import { CARD_DEFS, FIXED_DECK_LIST } from "./cardData";
import type { CardDef, CardInstance, MonsterCardDef } from "./types";

export { CARD_DEFS, FIXED_DECK_LIST };

const CARD_DEFS_BY_ID: Record<string, CardDef> = CARD_DEFS;

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

export function getAllCardDefs(): CardDef[] {
  return Object.values(CARD_DEFS_BY_ID);
}

export function getCardDef(cardId: string): CardDef {
  const def = CARD_DEFS_BY_ID[cardId];
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

export function getCardIconPath(cardId: string): string | undefined {
  return getCardDef(cardId).icon;
}

export function validateFixedDeck(): boolean {
  const total = FIXED_DECK_LIST.reduce((sum, entry) => sum + entry.count, 0);
  return total === 30 && FIXED_DECK_LIST.every((entry) => entry.count <= 3 && !!CARD_DEFS_BY_ID[entry.cardId]);
}
