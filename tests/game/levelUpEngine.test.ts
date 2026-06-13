import { describe, expect, it } from "vitest";
import { resolveLevelUpChoice } from "../../src/game/ruleEngine/levelUp";
import type { PendingLevelUp } from "../../src/game/types";

const pendingLevelUp: PendingLevelUp = {
  playerId: "player",
  attackerSlotKey: "player_front_left",
  maxLevels: 2,
  recoilDamage: 0,
  superOptions: [{ handInstanceId: "super_a", cardId: "card_006" }],
};

describe("level-up rule engine helpers", () => {
  it("resolves normal level-up, skip, and super choices", () => {
    expect(resolveLevelUpChoice(pendingLevelUp, 2)).toEqual({ kind: "level", levels: 2 });
    expect(resolveLevelUpChoice(pendingLevelUp, 0)).toEqual({ kind: "skip" });
    expect(resolveLevelUpChoice(pendingLevelUp, 1, "super_a")).toEqual({ kind: "super", handInstanceId: "super_a" });
  });

  it("rejects illegal level counts and unlisted super cards", () => {
    expect(() => resolveLevelUpChoice(pendingLevelUp, 3)).toThrow("選択できないレベルアップ数です");
    expect(() => resolveLevelUpChoice(pendingLevelUp, 1, "missing_super")).toThrow("選択できないスーパーカードです");
  });
});
