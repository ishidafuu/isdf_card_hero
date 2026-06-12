import { describe, expect, it } from "vitest";
import { getCardDefsByPool, getMonsterDef } from "../../src/game/cards";
import {
  attackWithCommand,
  createInitialGame,
  getCommandTargets,
  getMagicTargets,
  playMagic,
} from "../../src/game/rules";
import type { CardInstance, GameState, MonsterState, PlayerId, SlotKey } from "../../src/game/types";

let monsterInstanceSequence = 0;

describe("card effect resolution coverage", () => {
  it("resolves every imported magic card effect at least once", () => {
    const magicCards = getCardDefsByPool("all").filter((card) => card.type === "magic");

    for (const magic of magicCards) {
      const game = createMagicResolutionGame(magic.id);
      const targets = getMagicTargets(game, `magic_${magic.id}`);
      expect(targets.length, magic.name).toBeGreaterThan(0);

      const next = playMagic(game, {
        handInstanceId: `magic_${magic.id}`,
        target: targets[0],
      });

      expect(next.players.player.discard.some((card) => card.instanceId === `magic_${magic.id}`), magic.name).toBe(true);
      expect(next.log.at(-1), magic.name).toBeDefined();
    }
  });

  it("resolves every imported monster command at least once", () => {
    const monsterCards = getCardDefsByPool("all").filter((card) => card.type === "monster");

    for (const card of monsterCards) {
      for (const level of card.levels) {
        for (const command of level.commands) {
          const { game, attackerSlotKey } = createCommandResolutionGame(card.id, level.level, level.maxHp);
          const targets = getCommandTargets(game, attackerSlotKey, command.id);
          const label = `${card.name} Lv${level.level} ${command.name}`;
          expect(targets.length, label).toBeGreaterThan(0);

          const next = attackWithCommand(game, {
            attackerSlotKey,
            commandId: command.id,
            target: targets[0],
          });

          expect(next.log.at(-1), label).toBeDefined();
        }
      }
    }
  });
});

function createMagicResolutionGame(magicCardId: string): GameState {
  const game = createInitialGame(310);
  game.players.player.stones = 99;
  game.players.cpu.stones = 99;
  game.players.player.hand = [
    { cardId: magicCardId, instanceId: `magic_${magicCardId}` },
    { cardId: "takokke", instanceId: `extra_front_${magicCardId}` },
    { cardId: "sigma", instanceId: `extra_back_${magicCardId}` },
  ];
  game.players.player.deck = [
    { cardId: "takokke", instanceId: `deck_front_${magicCardId}` },
    { cardId: "yanbaru", instanceId: `deck_back_${magicCardId}` },
    { cardId: "healing", instanceId: `deck_magic_${magicCardId}` },
  ];
  game.players.player.discard = [];
  populateResolutionBoard(game);
  return game;
}

function createCommandResolutionGame(
  cardId: string,
  level: number,
  maxHp: number,
): { game: GameState; attackerSlotKey: SlotKey } {
  const game = createInitialGame(311);
  game.players.player.stones = 99;
  game.players.cpu.stones = 99;
  game.players.player.hand = [{ cardId: "takokke", instanceId: `soul_switch_${cardId}_${level}` }];
  game.players.player.discard = [];
  populateResolutionBoard(game);

  let attackerSlotKey: SlotKey = "player_back_right";
  game.slots.player_back_right.monster = createActiveMonster(cardId, "player", {
    hp: maxHp,
    level,
    investedStones: level,
  });

  if (cardId === "card_107") {
    attackerSlotKey = "player_front_right";
    game.slots.player_front_right.monster = createActiveMonster(cardId, "player", {
      hp: maxHp,
      level,
      investedStones: level,
    });
    game.slots.player_front_left.monster = createActiveMonster("card_108", "player", {
      level,
      investedStones: level,
    });
    delete game.slots.player_back_right.monster;
  }

  if (cardId === "card_108") {
    attackerSlotKey = "player_front_left";
    game.slots.player_front_left.monster = createActiveMonster(cardId, "player", {
      hp: maxHp,
      level,
      investedStones: level,
    });
    game.slots.player_front_right.monster = createActiveMonster("card_107", "player", {
      level,
      investedStones: level,
    });
    delete game.slots.player_back_right.monster;
  }

  return { game, attackerSlotKey };
}

function populateResolutionBoard(game: GameState): void {
  game.slots.player_front_left.monster = createActiveMonster("card_001", "player");
  game.slots.player_front_right.monster = createActiveMonster("takokke", "player", { level: 2, investedStones: 2 });
  game.slots.player_back_left.monster = createActiveMonster("sigma", "player", { status: "prepared" });
  game.slots.player_back_right.monster = createActiveMonster("card_083", "player");
  game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { level: 2, investedStones: 2 });
  game.slots.cpu_front_right.monster = createActiveMonster("card_084", "cpu");
  game.slots.cpu_back_left.monster = createActiveMonster("sigma", "cpu", { status: "prepared" });
  game.slots.cpu_back_right.monster = createActiveMonster("takokke", "cpu", { level: 2, investedStones: 2 });
}

function createActiveMonster(
  cardId: string,
  owner: PlayerId,
  overrides: Partial<MonsterState> = {},
): MonsterState {
  const def = getMonsterDef(cardId);
  const firstLevel = def.levels[0];
  monsterInstanceSequence += 1;
  return {
    instanceId: `${owner}_${cardId}_resolution_${monsterInstanceSequence}`,
    cardId,
    owner,
    hp: firstLevel.maxHp,
    level: firstLevel.level,
    status: "active",
    investedStones: 1,
    actionCount: 0,
    actionLimit: def.actionLimit ?? 1,
    focused: false,
    powerUp: false,
    shielded: false,
    ...overrides,
  };
}
