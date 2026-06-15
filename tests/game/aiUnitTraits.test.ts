import { describe, expect, it } from "vitest";
import { getCardDefsByPool, getMonsterDef } from "../../src/game/cards";
import { getCommandAiTrait, getMonsterAiTrait, inferMonsterAiTrait } from "../../src/game/aiUnitTraits";

describe("ai unit traits", () => {
  it("infers a unit trait for every monster card", () => {
    const invalid = getCardDefsByPool("all")
      .filter((def) => def.type === "monster")
      .filter((def) => {
        const trait = inferMonsterAiTrait(def);
        return trait.role !== def.role || trait.intents.length === 0;
      })
      .map((def) => def.id);

    expect(invalid).toEqual([]);
  });

  it("treats flexible master pressure commands as front-viable backline units", () => {
    const trait = getMonsterAiTrait("morgan");

    expect(trait.role).toBe("back");
    expect(trait.frontViable).toBe(true);
    expect(trait.intents).toContain("pressure");
  });

  it("classifies command reach without relying on card IDs", () => {
    const morgan = getMonsterDef("morgan");
    const command = morgan.levels[0].commands.find((item) => item.id === "arc_drive");

    expect(command).toBeTruthy();
    expect(command && getCommandAiTrait(command)).toMatchObject({
      canTargetMaster: true,
      canTargetMonster: true,
      flexibleRange: true,
    });
  });
});
