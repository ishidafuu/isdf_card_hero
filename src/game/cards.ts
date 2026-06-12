import { CARD_DEFS } from "./cardData";
import type { CardDef, CardInstance, MonsterCardDef } from "./types";

export { CARD_DEFS };

const CARD_DEFS_BY_ID: Record<string, CardDef> = CARD_DEFS;
export const DECK_SIZE = 30;
export const DECK_MAX_COPIES = 3;
export const DECK_MIN_FRONT = 12;
export const DECK_MIN_BACK = 6;
export const DECK_MIN_MAGIC = 6;
export type DeckCategory = "front" | "back" | "magic";

export interface DeckValidationSummary {
  total: number;
  categories: Record<DeckCategory, number>;
  duplicateViolations: Array<{ cardId: string; count: number }>;
  unknownTokens: string[];
  errors: string[];
  valid: boolean;
}

export interface ParsedDeckText {
  cardIds: string[];
  unknownTokens: string[];
}

export function buildDeck(owner: string, seed = hashString(owner)): CardInstance[] {
  return createCardInstances(owner, buildDeckCardIds(seed));
}

export function buildDeckCardIds(seed = hashString("deck")): string[] {
  const selected: string[] = [];
  const counts = new Map<string, number>();
  const random = createSeededRandom(seed);

  addRandomCards(selected, counts, cardIdsByCategory("front"), DECK_MIN_FRONT, random);
  addRandomCards(selected, counts, cardIdsByCategory("back"), DECK_MIN_BACK, random);
  addRandomCards(selected, counts, cardIdsByCategory("magic"), DECK_MIN_MAGIC, random);
  addRandomCards(selected, counts, Object.keys(CARD_DEFS_BY_ID), DECK_SIZE - selected.length, random);

  return selected;
}

export function createDeckFromCardIds(owner: string, cardIds: string[]): CardInstance[] {
  return createCardInstances(owner, cardIds);
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
  return summarizeDeckCardIds(deck.map((card) => card.cardId)).valid;
}

export function parseDeckText(text: string): ParsedDeckText {
  const cardIds: string[] = [];
  const unknownTokens: string[] = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const token = rawLine.replace(/#.*/, "").trim();
    if (!token) {
      continue;
    }
    const def = findCardDefByToken(token);
    if (!def) {
      unknownTokens.push(token);
      continue;
    }
    cardIds.push(def.id);
  }
  return { cardIds, unknownTokens };
}

export function deckTextFromCardIds(cardIds: string[]): string {
  return cardIds.map((cardId) => getCardName(cardId)).join("\n");
}

export function summarizeDeckCardIds(cardIds: string[], unknownTokens: string[] = []): DeckValidationSummary {
  const counts = new Map<string, number>();
  const categories = { front: 0, back: 0, magic: 0 };
  const errors: string[] = [];
  const duplicateViolations: Array<{ cardId: string; count: number }> = [];

  for (const cardId of cardIds) {
    const def = CARD_DEFS_BY_ID[cardId];
    if (!def) {
      errors.push(`不明なカードID: ${cardId}`);
      continue;
    }
    counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
    categories[deckCategory(def)] += 1;
  }

  for (const [cardId, count] of counts.entries()) {
    if (count > DECK_MAX_COPIES) {
      duplicateViolations.push({ cardId, count });
    }
  }

  if (unknownTokens.length > 0) {
    errors.push(`不明な入力: ${unknownTokens.join(", ")}`);
  }
  if (cardIds.length !== DECK_SIZE) {
    errors.push(`デッキは${DECK_SIZE}枚にしてください（現在${cardIds.length}枚）`);
  }
  if (duplicateViolations.length > 0) {
    errors.push(`同名カードは${DECK_MAX_COPIES}枚までです`);
  }
  if (categories.front < DECK_MIN_FRONT) {
    errors.push(`前衛は${DECK_MIN_FRONT}枚以上必要です（現在${categories.front}枚）`);
  }
  if (categories.back < DECK_MIN_BACK) {
    errors.push(`後衛は${DECK_MIN_BACK}枚以上必要です（現在${categories.back}枚）`);
  }
  if (categories.magic < DECK_MIN_MAGIC) {
    errors.push(`魔法は${DECK_MIN_MAGIC}枚以上必要です（現在${categories.magic}枚）`);
  }

  return {
    total: cardIds.length,
    categories,
    duplicateViolations,
    unknownTokens,
    errors,
    valid: errors.length === 0,
  };
}

export function deckCategoryLabel(category: DeckCategory): string {
  if (category === "front") {
    return "前衛";
  }
  if (category === "back") {
    return "後衛";
  }
  return "魔法";
}

function addRandomCards(
  selected: string[],
  counts: Map<string, number>,
  pool: string[],
  amount: number,
  random: () => number,
): void {
  for (let i = 0; i < amount; i += 1) {
    const eligible = pool.filter((cardId) => (counts.get(cardId) ?? 0) < DECK_MAX_COPIES);
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

function findCardDefByToken(token: string): CardDef | undefined {
  const normalized = normalizeDeckToken(token);
  return CARD_DEFS_BY_ID[token] ?? Object.values(CARD_DEFS_BY_ID).find((def) => normalizeDeckToken(def.name) === normalized);
}

function normalizeDeckToken(token: string): string {
  return token.trim().toLocaleLowerCase();
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
