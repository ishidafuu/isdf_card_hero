import { describe, expect, it } from "vitest";
import { playMasterLabAction } from "../../src/game/masterLab";
import {
  attackWithCommand,
  createInitialGame,
  getCommandTargets,
  getMovableTargets,
} from "../../src/game/rules";
import { getMonsterDef } from "../../src/game/cards";
import type { MonsterState, PlayerId } from "../../src/game/types";

describe("master lab decoy scenarios", () => {
  it("uses scapegoat to redirect a level 2 front attack away from the master", () => {
    let game = createInitialGame(950);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      hp: 5,
      investedStones: 2,
      level: 2,
    });

    game = playMasterLabAction(game, {
      candidateId: "decoy",
      actionId: "scapegoat",
      target: { kind: "monster", slotKey: "player_front_left" },
    });
    game.currentPlayer = "cpu";
    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "master", playerId: "player" },
    });

    expect(game.players.player.masterHp).toBe(10);
    expect(game.slots.player_front_left.monster?.hp).toBe(2);
  });

  it("uses provoke to force the enemy attacker into the selected bait", () => {
    let game = createInitialGame(951);
    game.players.player.stones = 3;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.player_front_right.monster = createActiveMonster("sigma", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMasterLabAction(game, {
      candidateId: "decoy",
      actionId: "provoke",
      target: { kind: "monster", slotKey: "cpu_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "player_front_left" },
    });
    game.currentPlayer = "cpu";

    expect(getCommandTargets(game, "cpu_front_left", "attack")).toEqual([
      { kind: "monster", slotKey: "player_front_left" },
    ]);
    expect(getMovableTargets(game, "cpu_front_left")).toEqual([]);
  });

  it("does not keep provoke as a hard lock when the bait is gone", () => {
    let game = createInitialGame(952);
    game.players.player.stones = 3;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.player_front_right.monster = createActiveMonster("sigma", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMasterLabAction(game, {
      candidateId: "decoy",
      actionId: "provoke",
      target: { kind: "monster", slotKey: "cpu_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "player_front_left" },
    });
    delete game.slots.player_front_left.monster;
    game.currentPlayer = "cpu";

    expect(getCommandTargets(game, "cpu_front_left", "attack")).toContainEqual({
      kind: "master",
      playerId: "player",
    });
    expect(game.slots.cpu_front_left.monster?.provokeTargetSlotKey).toBeUndefined();
  });
});

function createActiveMonster(
  cardId: string,
  owner: PlayerId,
  overrides: Partial<MonsterState> = {},
): MonsterState {
  const def = getMonsterDef(cardId);
  const firstLevel = def.levels[0];
  return {
    instanceId: `${owner}_${cardId}_master_lab_scenario_fixture`,
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
