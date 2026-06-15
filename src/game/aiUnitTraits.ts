import { getMonsterDef } from "./cards";
import type { CommandDef, MonsterCardDef, MonsterRole } from "./types";

export type CommandAiIntent = "damage" | "master_pressure" | "monster_trade" | "position" | "utility" | "resource_risk";
export type UnitAiIntent = "frontline" | "backline" | "front_viable" | "protect" | "pressure";

export interface CommandAiTrait {
  range: CommandDef["range"];
  canTargetMaster: boolean;
  canTargetMonster: boolean;
  flexibleRange: boolean;
  hasCost: boolean;
  hasRecoil: boolean;
  isUtility: boolean;
  intents: readonly CommandAiIntent[];
}

export interface UnitAiTrait {
  role: MonsterRole;
  frontViable: boolean;
  backlinePreferred: boolean;
  intents: readonly UnitAiIntent[];
}

export function getCommandAiTrait(command: CommandDef): CommandAiTrait {
  const canTargetMaster = command.range === "master" || command.range === "any_target" || command.range === "special";
  const canTargetMonster = command.range !== "master";
  const flexibleRange = command.range === "any_target" || command.range === "any_monster" || command.range === "special";
  const isUtility = command.power <= 0 || !!command.effectText;
  const intents = [
    command.power > 0 ? "damage" : undefined,
    canTargetMaster ? "master_pressure" : undefined,
    canTargetMonster && command.power > 0 ? "monster_trade" : undefined,
    flexibleRange ? "position" : undefined,
    isUtility ? "utility" : undefined,
    command.stoneCost || command.recoilDamage ? "resource_risk" : undefined,
  ].filter((intent): intent is CommandAiIntent => !!intent);

  return {
    range: command.range,
    canTargetMaster,
    canTargetMonster,
    flexibleRange,
    hasCost: !!command.stoneCost,
    hasRecoil: !!command.recoilDamage,
    isUtility,
    intents,
  };
}

export function getMonsterAiTrait(cardId: string): UnitAiTrait {
  return inferMonsterAiTrait(getMonsterDef(cardId));
}

export function inferMonsterAiTrait(def: MonsterCardDef): UnitAiTrait {
  const implementedCommands = def.levels.flatMap((level) => level.commands.filter((command) => command.implemented));
  const commandTraits = implementedCommands.map(getCommandAiTrait);
  const frontViable = def.role === "front" || commandTraits.some((trait) => trait.canTargetMaster && trait.flexibleRange);
  const backlinePreferred = def.role === "back" && !frontViable;
  const intents = [
    def.role === "front" ? "frontline" : "backline",
    frontViable ? "front_viable" : undefined,
    backlinePreferred ? "protect" : undefined,
    commandTraits.some((trait) => trait.canTargetMaster) ? "pressure" : undefined,
  ].filter((intent): intent is UnitAiIntent => !!intent);

  return {
    role: def.role,
    frontViable,
    backlinePreferred,
    intents,
  };
}
