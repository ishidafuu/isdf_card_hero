import type { GameState, MonsterState, SlotKey } from "../types";

export interface DamageContext {
  source: string;
  kind: "command" | "magic" | "master" | "effect" | "recoil";
  attackerSlotKey?: SlotKey;
  ignoreCounter?: boolean;
  ignoreDeathChain?: boolean;
}

export function createDamageContext(sourceOrContext: string | DamageContext): DamageContext {
  if (typeof sourceOrContext === "string") {
    return { source: sourceOrContext, kind: "effect" };
  }
  return sourceOrContext;
}

export function masterShieldDamage(power: number): number {
  return Math.max(0, power - 2);
}

export function levelUpCapacityForMonster(
  state: GameState,
  monster: MonsterState | undefined,
  defeatedLevel: number,
  potentialMaxLevel: number,
): number {
  if (!monster || monster.levelFixed) {
    return 0;
  }
  const room = potentialMaxLevel - monster.level;
  return Math.max(0, Math.min(defeatedLevel, state.players[monster.owner].stones, room));
}
