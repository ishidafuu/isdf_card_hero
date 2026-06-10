import { describe, expect, it } from "vitest";
import { getMonsterDef } from "../../src/game/cards";
import { applyCpuDecision, chooseCpuDecision, listCpuDecisions } from "../../src/game/cpuAi";
import { createInitialGame, endTurn, runCpuStep } from "../../src/game/rules";
import type { CardInstance, GameState, MonsterState, PlayerId } from "../../src/game/types";

describe("cpu ai", () => {
  it("chooses a lethal master attack when one is available", () => {
    const game = createCpuGame();
    game.players.player.masterHp = 1;
    game.slots.cpu_back_left.monster = createActiveMonster("morgan", "cpu", {
      hp: 4,
      level: 2,
    });

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("attack");
    expect(decision.reason).toContain("相手マスターを倒せる");
    if (decision.type === "attack") {
      expect(decision.action.target).toEqual({ kind: "master", playerId: "player" });
    }
  });

  it("chooses an enemy monster kill over non-lethal master damage", () => {
    const game = createCpuGame();
    game.slots.cpu_back_left.monster = createActiveMonster("morgan", "cpu", {
      hp: 4,
      level: 2,
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 2 });

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("attack");
    expect(decision.reason).toContain("撃破");
    if (decision.type === "attack") {
      expect(decision.action.target).toEqual({ kind: "monster", slotKey: "player_front_left" });
    }
  });

  it("does not list attacks against allied monsters", () => {
    const game = createCpuGame();
    game.players.cpu.hand = [];
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu");

    const decisions = listCpuDecisions(game);

    expect(
      decisions.some(
        (decision) =>
          decision.type === "attack" &&
          decision.action.target.kind === "monster" &&
          game.slots[decision.action.target.slotKey].monster?.owner === "cpu",
      ),
    ).toBe(false);
  });

  it("does not choose a zero-damage attack", () => {
    const game = createCpuGame();
    game.players.cpu.hand = [];
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");

    const decision = chooseCpuDecision(game);

    expect(decision.type).not.toBe("attack");
  });

  it("uses master attack when it can defeat a front enemy", () => {
    const game = createCpuGame();
    game.players.cpu.hand = [];
    game.players.cpu.stones = 3;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 2 });

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("master_action");
    expect(decision.reason).toContain("マスターアタック");
    if (decision.type === "master_action") {
      expect(decision.actionId).toBe("master_attack");
      expect(decision.target).toEqual({ kind: "monster", slotKey: "player_front_left" });
    }
  });

  it("summons front-role cards to the front row", () => {
    const game = createCpuGame([{ cardId: "takokke", instanceId: "cpu_takokke_test" }]);

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("summon");
    if (decision.type === "summon") {
      expect(decision.slotKey).toBe("cpu_front_left");
    }
  });

  it("summons back-role cards behind an occupied front lane", () => {
    const game = createCpuGame([{ cardId: "yanbaru", instanceId: "cpu_yanbaru_test" }]);
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("summon");
    if (decision.type === "summon") {
      expect(decision.slotKey).toBe("cpu_back_left");
    }
  });

  it("focuses when there is no useful attack or summon", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 0;
    game.slots.cpu_back_left.monster = createActiveMonster("yanbaru", "cpu");

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("focus");
    expect(decision.reason).toContain("ためる");
  });

  it("applies the chosen decision through existing rule functions", () => {
    const game = createCpuGame([{ cardId: "takokke", instanceId: "cpu_takokke_test" }]);
    const decision = chooseCpuDecision(game);

    const next = applyCpuDecision(game, decision);

    expect(next.slots.cpu_front_left.monster?.cardId).toBe("takokke");
    expect(next.players.cpu.stones).toBe(2);
  });

  it("runs deterministic CPU turns across seeds without getting stuck", () => {
    for (let seed = 300; seed < 330; seed += 1) {
      let game = endTurn(createInitialGame(seed));
      for (let step = 0; step < 80 && game.currentPlayer === "cpu" && !game.winner; step += 1) {
        game = runCpuStep(game);
      }

      expect(game.currentPlayer).not.toBe("cpu");
      expect(game.pendingLevelUp).toBeUndefined();
    }
  });
});

function createCpuGame(hand: CardInstance[] = []): GameState {
  const game = createInitialGame(250);
  game.currentPlayer = "cpu";
  game.players.cpu.stones = 3;
  game.players.cpu.hand = hand;
  game.players.cpu.discard = [];
  game.players.player.hand = [];
  return game;
}

function createActiveMonster(
  cardId: string,
  owner: PlayerId,
  overrides: Partial<MonsterState> = {},
): MonsterState {
  const def = getMonsterDef(cardId);
  const firstLevel = def.levels[0];
  return {
    instanceId: `${owner}_${cardId}_cpu_ai_fixture`,
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
