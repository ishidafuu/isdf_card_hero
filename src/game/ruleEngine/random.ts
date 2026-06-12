import type { CardInstance, GameState } from "../types";

export function randomChance(state: GameState, probability: number): boolean {
  return nextRandom(state) < probability;
}

export function randomInt(state: GameState, min: number, max: number): number {
  return min + Math.floor(nextRandom(state) * (max - min + 1));
}

export function shuffle(deck: CardInstance[], seed: number): CardInstance[] {
  const result = [...deck];
  const random = seededRandom(seed);
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function nextRandom(state: GameState): number {
  state.randomSeed = (state.randomSeed + 0x6d2b79f5) >>> 0;
  let next = state.randomSeed;
  next = Math.imul(next ^ (next >>> 15), next | 1);
  next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
  return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
}

function seededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
