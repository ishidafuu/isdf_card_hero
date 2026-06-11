import {
  buildDeck,
  createDeckFromCardIds,
  getAllCardDefs,
  getCardDef,
  getCardName,
  getDeckCategory,
  RANDOM_DECK_MAX_COPIES,
  validateRandomDeck,
} from "./cards";
import { createInitialGame } from "./rules";
import type { GameState, MonsterCardDef } from "./types";

export interface RunState {
  id: string;
  seed: number;
  battleNumber: number;
  playerDeckCardIds: string[];
  rewardHistory: RunRewardHistoryEntry[];
}

export interface RunRewardHistoryEntry {
  battleNumber: number;
  kind: "card" | "meat";
  label: string;
  gainedCardId: string;
  replacedCardId: string;
  sourceCardId?: string;
}

export interface CardRewardCandidate {
  id: string;
  kind: "card";
  cardId: string;
  replacedCardId: string;
  label: string;
  description: string;
}

export interface MeatRewardCandidate {
  id: string;
  kind: "meat";
  sourceCardId: string;
  fromCardId: string;
  toCardId: string;
  label: string;
  description: string;
}

export type RunRewardCandidate = CardRewardCandidate | MeatRewardCandidate;

const REWARD_CANDIDATE_COUNT = 3;

export function createInitialRun(seed = Date.now()): RunState {
  const normalizedSeed = seed >>> 0;
  return {
    id: `run_${normalizedSeed.toString(36)}`,
    seed: normalizedSeed,
    battleNumber: 1,
    playerDeckCardIds: buildDeck("run_player", normalizedSeed + 17).map((card) => card.cardId),
    rewardHistory: [],
  };
}

export function createBattleFromRun(run: RunState): GameState {
  return createInitialGame(run.seed + run.battleNumber * 1009, {
    playerDeckCardIds: run.playerDeckCardIds,
  });
}

export function generateBattleRewards(game: GameState, run: RunState): RunRewardCandidate[] {
  const seed = rewardSeed(game, run);
  const defeatedSources = uniqueCardIds(
    game.defeatedMonsters
      .filter((record) => record.owner === "cpu" && record.defeatedBy === "player")
      .map((record) => record.cardId)
      .filter((cardId) => getCardDef(cardId).type === "monster"),
  );
  const sourceCards = defeatedSources.length > 0 ? defeatedSources : fallbackMonsterSources(seed);
  const rewards: RunRewardCandidate[] = [];

  for (const sourceCardId of sourceCards) {
    addRewardCandidate(rewards, createMeatReward(run, sourceCardId, seed + rewards.length * 31));
    addRewardCandidate(rewards, createCardReward(run, sourceCardId, seed + rewards.length * 37));
    if (rewards.length >= REWARD_CANDIDATE_COUNT) {
      return rewards.slice(0, REWARD_CANDIDATE_COUNT);
    }
  }

  for (const card of shuffled(getAllCardDefs(), seed + 97)) {
    addRewardCandidate(rewards, createCardReward(run, card.id, seed + rewards.length * 41));
    if (rewards.length >= REWARD_CANDIDATE_COUNT) {
      break;
    }
  }

  return rewards.slice(0, REWARD_CANDIDATE_COUNT);
}

export function applyRunReward(run: RunState, reward: RunRewardCandidate): RunState {
  const nextDeck = [...run.playerDeckCardIds];
  const replacementIndex = nextDeck.findIndex((cardId) =>
    cardId === (reward.kind === "card" ? reward.replacedCardId : reward.fromCardId),
  );
  if (replacementIndex < 0) {
    throw new Error("報酬で入れ替えるカードがデッキにありません");
  }

  const gainedCardId = reward.kind === "card" ? reward.cardId : reward.toCardId;
  const replacedCardId = nextDeck[replacementIndex];
  nextDeck[replacementIndex] = gainedCardId;
  assertValidRunDeck(nextDeck);

  const historyEntry: RunRewardHistoryEntry = {
    battleNumber: run.battleNumber,
    kind: reward.kind,
    label: reward.label,
    gainedCardId,
    replacedCardId,
    sourceCardId: reward.kind === "meat" ? reward.sourceCardId : undefined,
  };

  return {
    ...run,
    battleNumber: run.battleNumber + 1,
    playerDeckCardIds: nextDeck,
    rewardHistory: [...run.rewardHistory, historyEntry],
  };
}

export function isValidRunDeck(cardIds: string[]): boolean {
  try {
    return validateRandomDeck(createDeckFromCardIds("run_validation", cardIds));
  } catch {
    return false;
  }
}

function createCardReward(run: RunState, cardId: string, seed: number): CardRewardCandidate | undefined {
  if (countCard(run.playerDeckCardIds, cardId) >= RANDOM_DECK_MAX_COPIES) {
    return undefined;
  }
  const replacedCardId = chooseReplacementCard(run.playerDeckCardIds, cardId, seed);
  if (!replacedCardId) {
    return undefined;
  }
  return {
    id: `card_${run.battleNumber}_${cardId}_${replacedCardId}`,
    kind: "card",
    cardId,
    replacedCardId,
    label: `${getCardName(cardId)}を獲得`,
    description: `${getCardName(replacedCardId)}と入れ替えて、次戦のデッキに入れる`,
  };
}

function createMeatReward(run: RunState, sourceCardId: string, seed: number): MeatRewardCandidate | undefined {
  const sourceDef = getCardDef(sourceCardId);
  if (sourceDef.type !== "monster") {
    return undefined;
  }

  const toCardId = chooseMeatMutationTarget(run.playerDeckCardIds, sourceDef, seed);
  if (!toCardId) {
    return undefined;
  }
  const fromCardId = chooseMutationBase(run.playerDeckCardIds, sourceDef.role, toCardId, seed + 11);
  if (!fromCardId) {
    return undefined;
  }

  return {
    id: `meat_${run.battleNumber}_${sourceCardId}_${fromCardId}_${toCardId}`,
    kind: "meat",
    sourceCardId,
    fromCardId,
    toCardId,
    label: `${getCardName(sourceCardId)}の肉`,
    description: `${getCardName(fromCardId)}を${getCardName(toCardId)}へ変異させ、次戦のデッキに入れる`,
  };
}

function chooseReplacementCard(deck: string[], cardId: string, seed: number): string | undefined {
  const category = getDeckCategory(getCardDef(cardId));
  const sameCategory = deck.filter((candidate) => candidate !== cardId && getDeckCategory(getCardDef(candidate)) === category);
  const candidates = sameCategory.length > 0 ? sameCategory : deck.filter((candidate) => candidate !== cardId);
  return chooseMostCommon(candidates, seed);
}

function chooseMeatMutationTarget(deck: string[], sourceDef: MonsterCardDef, seed: number): string | undefined {
  if (countCard(deck, sourceDef.id) < RANDOM_DECK_MAX_COPIES) {
    return sourceDef.id;
  }

  const candidates = getAllCardDefs()
    .filter((card): card is MonsterCardDef => card.type === "monster" && card.role === sourceDef.role)
    .filter((card) => countCard(deck, card.id) < RANDOM_DECK_MAX_COPIES)
    .filter((card) => card.id !== sourceDef.id);
  return pickOne(candidates, seed)?.id;
}

function chooseMutationBase(deck: string[], role: MonsterCardDef["role"], targetCardId: string, seed: number): string | undefined {
  const candidates = deck.filter((cardId) => {
    const def = getCardDef(cardId);
    return def.type === "monster" && def.role === role && cardId !== targetCardId;
  });
  return chooseMostCommon(candidates, seed);
}

function assertValidRunDeck(cardIds: string[]): void {
  if (!isValidRunDeck(cardIds)) {
    throw new Error("報酬適用後のデッキが30枚固定または投入枚数ルールを満たしていません");
  }
}

function addRewardCandidate(rewards: RunRewardCandidate[], candidate: RunRewardCandidate | undefined): void {
  if (!candidate) {
    return;
  }
  if (rewards.some((reward) => reward.id === candidate.id)) {
    return;
  }
  rewards.push(candidate);
}

function fallbackMonsterSources(seed: number): string[] {
  return shuffled(
    getAllCardDefs().filter((card): card is MonsterCardDef => card.type === "monster"),
    seed + 53,
  )
    .slice(0, REWARD_CANDIDATE_COUNT)
    .map((card) => card.id);
}

function uniqueCardIds(cardIds: string[]): string[] {
  return [...new Set(cardIds)];
}

function chooseMostCommon(cardIds: string[], seed: number): string | undefined {
  const counts = new Map<string, number>();
  for (const cardId of cardIds) {
    counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
  }
  const sorted = shuffled([...new Set(cardIds)], seed).sort((a, b) => {
    const countDiff = (counts.get(b) ?? 0) - (counts.get(a) ?? 0);
    return countDiff || getCardName(a).localeCompare(getCardName(b), "ja");
  });
  return sorted[0];
}

function countCard(deck: string[], cardId: string): number {
  return deck.filter((candidate) => candidate === cardId).length;
}

function rewardSeed(game: GameState, run: RunState): number {
  return (run.seed + run.battleNumber * 4099 + game.turnNumber * 131 + game.defeatedMonsters.length * 17) >>> 0;
}

function shuffled<T>(items: T[], seed: number): T[] {
  const result = [...items];
  const random = createSeededRandom(seed);
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickOne<T>(items: T[], seed: number): T | undefined {
  if (items.length === 0) {
    return undefined;
  }
  return items[Math.floor(createSeededRandom(seed)() * items.length)];
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
