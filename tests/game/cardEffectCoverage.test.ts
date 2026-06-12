import { describe, expect, it } from "vitest";
import {
  CARD_EFFECT_COVERAGE_AREAS,
  COMMAND_EFFECT_TRAITS,
  DEFERRED_PRODUCT_DECISIONS,
  IMPORTED_MAGIC_CATEGORIES,
  SIMPLIFIED_OR_PENDING_CARD_EFFECTS,
  type CommandEffectTrait,
} from "../../src/game/cardEffectCoverage";
import {
  getCardNoteDisplays,
  IMPLEMENTED_PERSONALITY_CARD_IDS,
  isNonGameplayNote,
} from "../../src/game/cardAnnotations";
import { getCardDefsByPool, getMonsterDef } from "../../src/game/cards";
import type { CommandDef } from "../../src/game/types";

describe("card effect coverage registry", () => {
  it("tracks every imported magic category", () => {
    const actualCategories = [
      ...new Set(
        getCardDefsByPool("all")
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

    for (const card of getCardDefsByPool("all")) {
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

  it("keeps implemented monster personality effects visible in card notes", () => {
    for (const cardId of IMPLEMENTED_PERSONALITY_CARD_IDS) {
      const notes = getMonsterDef(cardId).notes ?? [];
      expect(notes.some((note) => note.trim().startsWith("性格")), cardId).toBe(true);
    }
  });

  it("keeps every visible personality note backed by an implemented personality effect", () => {
    const visiblePersonalityCards = getCardDefsByPool("all")
      .filter((card) => getCardNoteDisplays(card).some((note) => note.kind === "personality"))
      .map((card) => card.id)
      .sort();

    expect(visiblePersonalityCards).toEqual([...IMPLEMENTED_PERSONALITY_CARD_IDS].sort());
  });

  it("keeps non-gameplay source annotations out of visible card notes", () => {
    for (const card of getCardDefsByPool("all")) {
      for (const note of card.notes ?? []) {
        expect(isNonGameplayNote(note), `${card.id}: ${note}`).toBe(false);
      }
    }
  });

  it("keeps Phase 4 card effect gaps closed and product deferrals explicit", () => {
    expect(SIMPLIFIED_OR_PENDING_CARD_EFFECTS).toEqual([]);
    expect(DEFERRED_PRODUCT_DECISIONS.map((decision) => decision.id)).toEqual([
      "cpu_magic_heuristic",
      "temporary_original_icons",
    ]);

    for (const decision of DEFERRED_PRODUCT_DECISIONS) {
      expect(decision.scope.trim(), decision.id).not.toBe("");
      expect(decision.decision.trim(), decision.id).not.toBe("");
      expect(decision.reason.trim(), decision.id).not.toBe("");
      expect(decision.revisitWhen.trim(), decision.id).not.toBe("");
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
