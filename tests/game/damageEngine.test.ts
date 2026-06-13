import { describe, expect, it } from "vitest";
import { createDamageContext, levelUpCapacityForMonster, masterShieldDamage } from "../../src/game/ruleEngine/damage";
import { createInitialGame } from "../../src/game/rules";
import type { MonsterState } from "../../src/game/types";

describe("damage rule engine helpers", () => {
  it("applies the permanent master shield as two damage reduction", () => {
    expect(masterShieldDamage(0)).toBe(0);
    expect(masterShieldDamage(2)).toBe(0);
    expect(masterShieldDamage(3)).toBe(1);
    expect(masterShieldDamage(5)).toBe(3);
  });

  it("normalizes string damage sources into effect contexts", () => {
    expect(createDamageContext("テスト")).toEqual({ source: "テスト", kind: "effect" });
    expect(createDamageContext({ source: "攻撃", kind: "command", ignoreCounter: true })).toEqual({
      source: "攻撃",
      kind: "command",
      ignoreCounter: true,
    });
  });

  it("caps level-up capacity by defeated level, available stones, and max level room", () => {
    const game = createInitialGame(20260613);
    const monster: MonsterState = {
      instanceId: "level_helper",
      cardId: "takokke",
      owner: "player",
      hp: 4,
      level: 1,
      status: "active",
      investedStones: 1,
      actionCount: 0,
      actionLimit: 1,
      focused: false,
      powerUp: false,
      shielded: false,
    };

    game.players.player.stones = 3;
    expect(levelUpCapacityForMonster(game, monster, 2, 3)).toBe(2);
    expect(levelUpCapacityForMonster(game, monster, 5, 2)).toBe(1);

    game.players.player.stones = 0;
    expect(levelUpCapacityForMonster(game, monster, 2, 3)).toBe(0);

    monster.levelFixed = true;
    game.players.player.stones = 3;
    expect(levelUpCapacityForMonster(game, monster, 2, 3)).toBe(0);
  });
});
