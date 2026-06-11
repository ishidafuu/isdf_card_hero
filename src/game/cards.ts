import { CARD_DEFS } from "./cardData";
import type { CardDef, CardInstance, MonsterCardDef } from "./types";

export { CARD_DEFS };

const CARD_DEFS_BY_ID: Record<string, CardDef> = CARD_DEFS;
const RANDOM_DECK_SIZE = 30;
const RANDOM_DECK_MAX_COPIES = 3;
const RANDOM_DECK_MIN_FRONT = 12;
const RANDOM_DECK_MIN_BACK = 6;
const RANDOM_DECK_MIN_MAGIC = 6;
type DeckCategory = "front" | "back" | "magic";

export function buildDeck(owner: string, seed = hashString(owner)): CardInstance[] {
  const selected: string[] = [];
  const counts = new Map<string, number>();
  const random = createSeededRandom(seed);

  addRandomCards(selected, counts, cardIdsByCategory("front"), RANDOM_DECK_MIN_FRONT, random);
  addRandomCards(selected, counts, cardIdsByCategory("back"), RANDOM_DECK_MIN_BACK, random);
  addRandomCards(selected, counts, cardIdsByCategory("magic"), RANDOM_DECK_MIN_MAGIC, random);
  addRandomCards(selected, counts, Object.keys(CARD_DEFS_BY_ID), RANDOM_DECK_SIZE - selected.length, random);

  return createCardInstances(owner, selected);
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

export function validateRandomDeck(deck: CardInstance[] = buildDeck("validation", 0)): boolean {
  const counts = new Map<string, number>();
  const categories = { front: 0, back: 0, magic: 0 };

  for (const card of deck) {
    const def = CARD_DEFS_BY_ID[card.cardId];
    if (!def) {
      return false;
    }
    counts.set(card.cardId, (counts.get(card.cardId) ?? 0) + 1);
    categories[deckCategory(def)] += 1;
  }

  return (
    deck.length === RANDOM_DECK_SIZE &&
    [...counts.values()].every((count) => count <= RANDOM_DECK_MAX_COPIES) &&
    categories.front >= RANDOM_DECK_MIN_FRONT &&
    categories.back >= RANDOM_DECK_MIN_BACK &&
    categories.magic >= RANDOM_DECK_MIN_MAGIC
  );
}

function addRandomCards(
  selected: string[],
  counts: Map<string, number>,
  pool: string[],
  amount: number,
  random: () => number,
): void {
  for (let i = 0; i < amount; i += 1) {
    const eligible = pool.filter((cardId) => (counts.get(cardId) ?? 0) < RANDOM_DECK_MAX_COPIES);
    if (eligible.length === 0) {
      throw new Error("ランダムデッキの候補カードが不足しています");
    }
    const cardId = eligible[Math.floor(random() * eligible.length)];
    selected.push(cardId);
    counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
  }
}

function cardIdsByCategory(category: DeckCategory): string[] {
  return Object.values(CARD_DEFS_BY_ID)
    .filter((def) => deckCategory(def) === category)
    .map((def) => def.id);
}

function deckCategory(def: CardDef): DeckCategory {
  return def.type === "magic" ? "magic" : def.role;
}

function createCardInstances(owner: string, cardIds: string[]): CardInstance[] {
  const instanceCounts = new Map<string, number>();
  return cardIds.map((cardId) => {
    const copy = (instanceCounts.get(cardId) ?? 0) + 1;
    instanceCounts.set(cardId, copy);
    return {
      cardId,
      instanceId: `${owner}_${cardId}_${copy}`,
    };
  });
}

function createSeededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
