import type { GameState, SlotKey } from "../types";
import { FIELD_ORDER } from "./constants";

export type MonsterSlotMove = readonly [from: SlotKey, to: SlotKey];

/**
 * Slot keys in monster effects represent monster identities, not board cells.
 * Apply the whole mapping in one pass so swaps and rotations cannot remap a
 * reference twice.
 */
export function remapMonsterSlotReferences(
  state: GameState,
  moves: readonly MonsterSlotMove[],
): void {
  if (moves.length === 0) {
    return;
  }
  const mapping = new Map<SlotKey, SlotKey>(moves);
  for (const slotKey of FIELD_ORDER) {
    const monster = state.slots[slotKey].monster;
    if (!monster) {
      continue;
    }
    if (monster.provokeTargetSlotKey) {
      monster.provokeTargetSlotKey = mapping.get(monster.provokeTargetSlotKey)
        ?? monster.provokeTargetSlotKey;
    }
    if (monster.deathChainSlotKey) {
      monster.deathChainSlotKey = mapping.get(monster.deathChainSlotKey)
        ?? monster.deathChainSlotKey;
    }
  }
}

/** Clear references before a monster leaves a slot or is replaced there. */
export function clearInboundMonsterSlotReferences(state: GameState, removedSlotKey: SlotKey): void {
  for (const slotKey of FIELD_ORDER) {
    const monster = state.slots[slotKey].monster;
    if (!monster) {
      continue;
    }
    if (monster.provokeTargetSlotKey === removedSlotKey) {
      monster.provokeTargetSlotKey = undefined;
    }
    if (monster.deathChainSlotKey === removedSlotKey) {
      monster.deathChainSlotKey = undefined;
    }
  }
}
