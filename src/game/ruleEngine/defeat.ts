import type { GameState, MonsterState, PlayerId, SlotKey } from "../types";

export interface DefeatedMonster {
  owner: PlayerId;
  cardId: string;
  level: number;
  investedStones: number;
}

export interface MonsterDefeatResolution {
  defeated: DefeatedMonster;
  monster: MonsterState;
  returnedStones: number;
  returnedToDeck: boolean;
}

export function removeDefeatedMonster(state: GameState, slotKey: SlotKey): MonsterDefeatResolution {
  const slot = state.slots[slotKey];
  const monster = slot.monster;
  if (!monster) {
    throw new Error("倒す対象がいません");
  }

  const owner = state.players[monster.owner];
  const returnedStones = monster.investedStones;
  owner.stones += returnedStones;

  const defeatedCard = { cardId: monster.cardId, instanceId: monster.instanceId };
  if (monster.reviveOnDefeat) {
    owner.deck.unshift(defeatedCard);
  } else {
    owner.discard.push(defeatedCard);
  }

  const defeated: DefeatedMonster = {
    owner: monster.owner,
    cardId: monster.cardId,
    level: monster.level,
    investedStones: monster.investedStones,
  };
  delete slot.monster;

  return {
    defeated,
    monster,
    returnedStones,
    returnedToDeck: !!monster.reviveOnDefeat,
  };
}
