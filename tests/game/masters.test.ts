import { describe, expect, it } from "vitest";
import { getCardDef } from "../../src/game/cards";
import { getMasterActionDef, getMasterActionMagicCardId } from "../../src/game/masters";
import type { MasterActionId } from "../../src/game/types";

describe("master action metadata", () => {
  it("links master skills to their matching magic card icons", () => {
    const mappedActions: Array<{ actionId: MasterActionId; cardId: string; cardName: string }> = [
      { actionId: "wake_up", cardId: "card_117", cardName: "ウェイクアップ" },
      { actionId: "shield", cardId: "card_025", cardName: "鉄の盾" },
      { actionId: "berserk_power", cardId: "card_094", cardName: "バーサクパワー" },
      { actionId: "earth_anger", cardId: "card_126", cardName: "大地の怒り" },
    ];

    for (const { actionId, cardId, cardName } of mappedActions) {
      const card = getCardDef(cardId);
      expect(getMasterActionMagicCardId(actionId)).toBe(cardId);
      expect(card.type).toBe("magic");
      if (card.type !== "magic") {
        throw new Error(`${cardId} must be a magic card`);
      }
      expect(card.name).toBe(cardName);
      expect(card.cost).toBe(getMasterActionDef(actionId).cost);
    }
  });

  it("keeps master attack on the fallback icon because it has no matching magic card", () => {
    expect(getMasterActionMagicCardId("master_attack")).toBeUndefined();
  });
});
