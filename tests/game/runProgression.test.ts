import { describe, expect, it } from "vitest";
import { createDeckFromCardIds, getMonsterDef, validateRandomDeck } from "../../src/game/cards";
import {
  applyRunReward,
  createBattleFromRun,
  createInitialRun,
  generateBattleRewards,
  isValidRunDeck,
} from "../../src/game/runProgression";
import { attackWithCommand, createInitialGame } from "../../src/game/rules";
import type { GameState, MonsterState, PlayerId } from "../../src/game/types";

describe("run progression rewards", () => {
  it("starts a run with a valid 30-card player deck and uses it for battles", () => {
    const run = createInitialRun(1200);
    const battle = createBattleFromRun(run);
    const battleCardIds = [...battle.players.player.hand, ...battle.players.player.deck].map((card) => card.cardId).sort();

    expect(isValidRunDeck(run.playerDeckCardIds)).toBe(true);
    expect(validateRandomDeck(createDeckFromCardIds("test", run.playerDeckCardIds))).toBe(true);
    expect(battleCardIds).toEqual([...run.playerDeckCardIds].sort());
  });

  it("records defeated monsters with the player who caused the defeat", () => {
    let game = createInitialGame(1201);
    game = setupDefeatGame(game);

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(next.defeatedMonsters).toContainEqual(
      expect.objectContaining({
        owner: "cpu",
        defeatedBy: "player",
        cardId: "takokke",
        level: 1,
      }),
    );
  });

  it("offers card and meat rewards from defeated enemies and keeps the deck valid after applying one", () => {
    const run = createInitialRun(1202);
    let game = createBattleFromRun(run);
    game = setupDefeatGame(game);
    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    game.winner = "player";

    const rewards = generateBattleRewards(game, run);
    const meatReward = rewards.find((reward) => reward.kind === "meat");
    const cardReward = rewards.find((reward) => reward.kind === "card");

    expect(rewards).toHaveLength(3);
    expect(meatReward).toBeDefined();
    expect(cardReward).toBeDefined();
    expect(rewards.every((reward) => reward.description.includes("次戦"))).toBe(true);

    const nextRun = applyRunReward(run, rewards[0]);

    expect(nextRun.battleNumber).toBe(run.battleNumber + 1);
    expect(nextRun.playerDeckCardIds).toHaveLength(30);
    expect(nextRun.playerDeckCardIds).not.toEqual(run.playerDeckCardIds);
    expect(isValidRunDeck(nextRun.playerDeckCardIds)).toBe(true);
    expect(nextRun.rewardHistory).toHaveLength(1);
  });
});

function setupDefeatGame(game: GameState): GameState {
  game.currentPlayer = "player";
  game.players.player.stones = 10;
  game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
  game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 1 });
  return game;
}

function createActiveMonster(
  cardId: string,
  owner: PlayerId,
  options: Partial<MonsterState> = {},
): MonsterState {
  const def = getMonsterDef(cardId);
  const level = options.level ?? 1;
  const levelDef = def.levels.find((candidate) => candidate.level === level) ?? def.levels[0];
  return {
    instanceId: `${owner}_${cardId}_test`,
    cardId,
    owner,
    hp: options.hp ?? levelDef.maxHp,
    level,
    status: options.status ?? "active",
    investedStones: options.investedStones ?? level,
    actionCount: options.actionCount ?? 0,
    actionLimit: options.actionLimit ?? def.actionLimit ?? 1,
    focused: options.focused ?? false,
    powerUp: options.powerUp ?? false,
    shielded: options.shielded ?? false,
    ...options,
  };
}
