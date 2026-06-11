import { describe, expect, it } from "vitest";
import {
  CARD_EFFECT_COVERAGE_AREAS,
  COMMAND_EFFECT_TRAITS,
  IMPORTED_MAGIC_CATEGORIES,
  SIMPLIFIED_OR_PENDING_CARD_EFFECTS,
  type CommandEffectTrait,
} from "../../src/game/cardEffectCoverage";
import { getAllCardDefs } from "../../src/game/cards";
import type { CommandDef } from "../../src/game/types";

describe("card effect coverage registry", () => {
  it("tracks every imported magic category", () => {
    const actualCategories = [
      ...new Set(
        getAllCardDefs()
          .filter((card) => card.type === "magic")
          .map((card) => card.category ?? "未分類"),
      ),
    ].sort();

    expect([...IMPORTED_MAGIC_CATEGORIES].sort()).toEqual(actualCategories);

    const coveredCategories = new Set(CARD_EFFECT_COVERAGE_AREAS.flatMap((area) => area.magicCategories ?? []));
    const missingCategories = actualCategories.filter((category) => !coveredCategories.has(category));

    expect(missingCategories).toEqual([]);
  });

  it("tracks every special command trait used by imported monster commands", () => {
    const actualTraits = new Set<CommandEffectTrait>();

    for (const card of getAllCardDefs()) {
      if (card.type !== "monster") {
        continue;
      }
      for (const level of card.levels) {
        for (const command of level.commands) {
          for (const trait of commandTraits(command)) {
            actualTraits.add(trait);
          }
        }
      }
    }

    expect([...COMMAND_EFFECT_TRAITS].sort()).toEqual([...actualTraits].sort());

    const coveredTraits = new Set(CARD_EFFECT_COVERAGE_AREAS.flatMap((area) => area.commandTraits ?? []));
    const missingTraits = [...actualTraits].filter((trait) => !coveredTraits.has(trait));

    expect(missingTraits).toEqual([]);
  });

  it("keeps coverage areas linked to concrete verification paths", () => {
    expect(CARD_EFFECT_COVERAGE_AREAS.length).toBeGreaterThanOrEqual(8);

    for (const area of CARD_EFFECT_COVERAGE_AREAS) {
      expect(area.status, area.id).toBe("covered");
      expect(area.scope.trim(), area.id).not.toBe("");
      expect(area.coveredBy.length, area.id).toBeGreaterThan(0);
      expect(
        area.coveredBy.every((path) => path.includes(".test.ts") || path.startsWith("npm run ")),
        area.id,
      ).toBe(true);
    }
  });

  it("keeps simplified and pending effects explicit enough to act on", () => {
    expect(SIMPLIFIED_OR_PENDING_CARD_EFFECTS.map((effect) => effect.id)).toEqual([
      "super_cards_pending",
      "per_card_assertion_gap",
      "multi_target_defaulting",
      "hand_choice_defaulting",
      "random_resolution_seeded",
      "cpu_magic_heuristic",
      "temporary_original_icons",
    ]);

    for (const effect of SIMPLIFIED_OR_PENDING_CARD_EFFECTS) {
      expect(["pending", "simplified"]).toContain(effect.status);
      expect(effect.scope.trim(), effect.id).not.toBe("");
      expect(effect.currentBehavior.trim(), effect.id).not.toBe("");
      expect(effect.reason.trim(), effect.id).not.toBe("");
      expect(effect.followUp.trim(), effect.id).not.toBe("");
    }
  });
});

function commandTraits(command: CommandDef): CommandEffectTrait[] {
  const traits: CommandEffectTrait[] = [];

  if (command.effectText) {
    traits.push("effectText");
  }
  if (command.stoneCost) {
    traits.push("stoneCost");
  }
  if (command.recoilDamage) {
    traits.push("recoilDamage");
  }
  if (isCommandRangeTrait(command.range)) {
    traits.push(command.range);
  }

  return traits;
}

function isCommandRangeTrait(range: CommandDef["range"]): range is Extract<CommandEffectTrait, CommandDef["range"]> {
  return (
    range === "straight" ||
    range === "piercing" ||
    range === "decreasing_straight" ||
    range === "line" ||
    range === "special"
  );
}
