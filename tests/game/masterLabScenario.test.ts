import { describe, expect, it } from "vitest";
import { listMasterLabActionOptions, playMasterLabAction } from "../../src/game/masterLab";
import {
  attackWithCommand,
  createInitialGame,
  endTurn,
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

describe("master lab tempo scenarios", () => {
  it("quick calls only own prepared monsters and blocks same-turn master attacks", () => {
    let game = createInitialGame(960);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      status: "prepared",
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      status: "prepared",
    });

    const options = listMasterLabActionOptions(game, "timing").filter((item) => item.actionId === "quick_call");
    expect(options).toEqual([
      expect.objectContaining({
        actionName: "クイックコール",
        cost: 1,
        target: { kind: "monster", slotKey: "player_front_left" },
      }),
    ]);

    game = playMasterLabAction(game, {
      candidateId: "timing",
      actionId: "quick_call",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.players.player.stones).toBe(1);
    expect(game.slots.player_front_left.monster).toMatchObject({
      status: "active",
      actionCount: 0,
      masterAttackBlockedUntilTurnEnd: true,
    });
    expect(getCommandTargets(game, "player_front_left", "attack")).not.toContainEqual({
      kind: "master",
      playerId: "cpu",
    });

    game = endTurn(game);
    expect(game.slots.player_front_left.monster?.masterAttackBlockedUntilTurnEnd).toBeUndefined();
  });

  it("lets a quick-called monster fight the board without enabling direct master damage", () => {
    let game = createInitialGame(961);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      status: "prepared",
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMasterLabAction(game, {
      candidateId: "timing",
      actionId: "quick_call",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(getCommandTargets(game, "player_front_left", "attack")).toContainEqual({
      kind: "monster",
      slotKey: "cpu_front_left",
    });
    expect(getCommandTargets(game, "player_front_left", "attack")).not.toContainEqual({
      kind: "master",
      playerId: "cpu",
    });
  });

  it("shifts own active monsters without consuming or restoring monster actions", () => {
    const game = createInitialGame(962);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("yanbaru", "player", {
      actionCount: 1,
    });
    game.slots.player_back_left.monster = createActiveMonster("sigma", "player", {
      status: "prepared",
    });
    game.slots.cpu_back_left.monster = createActiveMonster("sigma", "cpu");

    const options = listMasterLabActionOptions(game, "timing").filter((item) => item.actionId === "shift");
    expect(options).toContainEqual(
      expect.objectContaining({
        target: { kind: "monster", slotKey: "player_front_left" },
        secondaryTarget: { kind: "monster", slotKey: "player_back_right" },
      }),
    );
    expect(options).not.toContainEqual(
      expect.objectContaining({
        target: { kind: "monster", slotKey: "player_front_left" },
        secondaryTarget: { kind: "monster", slotKey: "player_back_left" },
      }),
    );
    expect(options).not.toContainEqual(
      expect.objectContaining({
        target: { kind: "monster", slotKey: "player_front_left" },
        secondaryTarget: { kind: "monster", slotKey: "cpu_back_left" },
      }),
    );

    const next = playMasterLabAction(game, {
      candidateId: "timing",
      actionId: "shift",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "player_back_right" },
    });

    expect(next.players.player.stones).toBe(0);
    expect(next.slots.player_back_right.monster).toMatchObject({
      cardId: "yanbaru",
      actionCount: 1,
    });
    expect(next.slots.player_front_left.monster).toBeUndefined();
    expect(game.slots.player_front_left.monster?.cardId).toBe("yanbaru");
  });

  it("swaps two own active monsters with shift", () => {
    const game = createInitialGame(963);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("yanbaru", "player");
    game.slots.player_back_left.monster = createActiveMonster("sigma", "player");

    const next = playMasterLabAction(game, {
      candidateId: "timing",
      actionId: "shift",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "player_back_left" },
    });

    expect(next.slots.player_front_left.monster?.cardId).toBe("sigma");
    expect(next.slots.player_back_left.monster?.cardId).toBe("yanbaru");
    expect(next.turnMoveHistory).toEqual([
      expect.objectContaining({
        playerId: "player",
        fromSlotKey: "player_front_left",
        toSlotKey: "player_back_left",
        swappedInstanceId: "player_sigma_master_lab_scenario_fixture",
      }),
    ]);
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
