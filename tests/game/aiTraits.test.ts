import { describe, expect, it } from "vitest";
import { getCardDef } from "../../src/game/cards";
import { getImplementedMagicCardsWithoutAiTraits, MAGIC_AI_TRAITS } from "../../src/game/aiTraits";

describe("ai traits", () => {
  it("classifies every implemented magic card", () => {
    const missing = getImplementedMagicCardsWithoutAiTraits();

    expect(missing.map((card) => card.id)).toEqual([]);
  });

  it("only defines traits for existing magic cards", () => {
    const invalid = Object.keys(MAGIC_AI_TRAITS).filter((cardId) => getCardDef(cardId).type !== "magic");

    expect(invalid).toEqual([]);
  });
});
