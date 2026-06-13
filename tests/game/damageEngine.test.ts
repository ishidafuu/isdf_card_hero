import { describe, expect, it } from "vitest";
import {
  createDamageContext,
  levelUpCapacityForMonster,
  masterDamageByPower,
  masterShieldDamage,
  previewMonsterDamage,
} from "../../src/game/ruleEngine/damage";
import { removeDefeatedMonster } from "../../src/game/ruleEngine/defeat";
import { createInitialGame } from "../../src/game/rules";
import type { MonsterState, PlayerId } from "../../src/game/types";

describe("damage rule engine helpers", () => {
  it("applies the permanent master shield as two damage reduction", () => {
    expect(masterShieldDamage(0)).toBe(0);
    expect(masterShieldDamage(2)).toBe(0);
    expect(masterShieldDamage(3)).toBe(1);
    expect(masterShieldDamage(5)).toBe(3);
    expect(masterDamageByPower(5)).toBe(3);
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

  it("previews monster damage reductions without mutating the monster", () => {
    const monster = createMonster("takokke", "player", {
      hp: 4,
      shielded: true,
      focused: true,
      halfShielded: true,
    });

    expect(previewMonsterDamage(monster, 4)).toEqual({ damage: 0, focusedReduction: 1 });
    expect(monster.focused).toBe(true);
    expect(monster.shielded).toBe(true);
  });

  it("removes defeated monsters, returns invested stones, and sends the card to discard", () => {
    const game = createInitialGame(20260613);
    game.players.player.stones = 0;
    game.slots.player_front_left.monster = createMonster("takokke", "player", {
      instanceId: "defeated_takokke",
      level: 2,
      investedStones: 2,
    });

    const result = removeDefeatedMonster(game, "player_front_left");

    expect(result.defeated).toEqual({
      owner: "player",
      cardId: "takokke",
      level: 2,
      investedStones: 2,
    });
    expect(result.returnedStones).toBe(2);
    expect(result.returnedToDeck).toBe(false);
    expect(game.players.player.stones).toBe(2);
    expect(game.slots.player_front_left.monster).toBeUndefined();
    expect(game.players.player.discard.at(-1)).toEqual({ cardId: "takokke", instanceId: "defeated_takokke" });
  });

  it("returns revive-on-defeat monsters to the top of the owner's deck", () => {
    const game = createInitialGame(20260613);
    game.players.cpu.deck = [{ cardId: "morgan", instanceId: "cpu_deck_top_before" }];
    game.slots.cpu_front_left.monster = createMonster("card_031", "cpu", {
      instanceId: "reviving_monster",
      reviveOnDefeat: true,
    });

    const result = removeDefeatedMonster(game, "cpu_front_left");

    expect(result.returnedToDeck).toBe(true);
    expect(game.players.cpu.deck[0]).toEqual({ cardId: "card_031", instanceId: "reviving_monster" });
    expect(game.players.cpu.deck[1]).toEqual({ cardId: "morgan", instanceId: "cpu_deck_top_before" });
    expect(game.players.cpu.discard).not.toContainEqual({ cardId: "card_031", instanceId: "reviving_monster" });
  });
});

function createMonster(cardId: string, owner: PlayerId, overrides: Partial<MonsterState> = {}): MonsterState {
  return {
    instanceId: `${owner}_${cardId}_damage_helper`,
    cardId,
    owner,
    hp: 3,
    level: 1,
    status: "active",
    investedStones: 1,
    actionCount: 0,
    actionLimit: 1,
    focused: false,
    powerUp: false,
    shielded: false,
    ...overrides,
  };
}
