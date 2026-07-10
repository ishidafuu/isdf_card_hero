import { shuffle } from "../ruleEngine/random";
import type { CardInstance, GameState, PlayerId } from "../types";

export function determinizeOpponentPrivateZones(
  state: GameState,
  perspective: PlayerId,
  sampleIndex = 0,
): GameState {
  const opponent = perspective === "player" ? "cpu" : "player";
  const next = structuredClone(state);
  const hidden = [...state.players[opponent].hand, ...state.players[opponent].deck]
    .sort(compareCardInstances);
  const handSize = state.players[opponent].hand.length;
  const seed = publicKnowledgeSeed(state, perspective, sampleIndex);
  const sampled = shuffle(hidden, seed);
  next.players[opponent].hand = sampled.slice(0, handSize);
  next.players[opponent].deck = sampled.slice(handSize);
  return next;
}

function compareCardInstances(left: CardInstance, right: CardInstance): number {
  return left.cardId.localeCompare(right.cardId) || left.instanceId.localeCompare(right.instanceId);
}

function publicKnowledgeSeed(state: GameState, perspective: PlayerId, sampleIndex: number): number {
  const publicState = JSON.stringify({
    perspective,
    sampleIndex,
    currentPlayer: state.currentPlayer,
    firstPlayer: state.firstPlayer,
    turnNumber: state.turnNumber,
    randomSeed: state.randomSeed,
    players: Object.fromEntries(
      (["player", "cpu"] as const).map((playerId) => {
        const player = state.players[playerId];
        return [playerId, {
          masterId: player.masterId,
          masterHp: player.masterHp,
          stones: player.stones,
          handSize: player.hand.length,
          deckSize: player.deck.length,
          discard: player.discard.map((card) => card.cardId),
          turnsStarted: player.turnsStarted,
        }];
      }),
    ),
    slots: Object.entries(state.slots)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([slotKey, slot]) => [slotKey, slot.monster ?? null]),
  });
  return hashString(publicState);
}

function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
