import { describe, expect, it } from "vitest";
import { getMonsterDef } from "../../src/game/cards";
import { applyCpuDecision, chooseCpuDecision, listCpuDecisions } from "../../src/game/cpuAi";
import { attackWithCommand, createInitialGame, endTurn, runAutoStep, runCpuStep } from "../../src/game/rules";
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

  it("can choose actions for the player side during auto play", () => {
    const game = createPlayerAutoGame([{ cardId: "takokke", instanceId: "player_takokke_test" }]);

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("summon");
    if (decision.type === "summon") {
      expect(decision.slotKey).toBe("player_front_left");
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
    expect(next.log.some((entry) => entry.startsWith("CPU判断:"))).toBe(true);
    expect(next.log.find((entry) => entry.startsWith("CPU判断:"))).not.toContain("タコッケー");
  });

  it("wakes up a prepared ally when it can act immediately", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 5;
    game.slots.cpu_back_left.monster = createActiveMonster("morgan", "cpu", {
      status: "prepared",
      hp: 4,
    });

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("master_action");
    if (decision.type === "master_action") {
      expect(decision.actionId).toBe("wake_up");
      expect(decision.reason).toContain("ウェイクアップ");
    }
  });

  it("wakes up an enemy prepared monster when it can be defeated immediately", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 5;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      hp: 2,
      status: "prepared",
    });

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("master_action");
    if (decision.type === "master_action") {
      expect(decision.actionId).toBe("wake_up");
      expect(decision.target).toEqual({ kind: "monster", slotKey: "player_front_left" });
      expect(decision.reason).toContain("相手の準備中");
    }
  });

  it("shields a threatened valuable ally", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 5;
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", { hp: 2 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("master_action");
    if (decision.type === "master_action") {
      expect(decision.actionId).toBe("shield");
      expect(decision.target).toEqual({ kind: "monster", slotKey: "cpu_front_left" });
      expect(decision.reason).toContain("シールド");
    }
  });

  it("uses thunder when it can finish the opponent master", () => {
    const game = createCpuGame([{ cardId: "thunder", instanceId: "cpu_thunder_test" }]);
    game.players.cpu.stones = 4;
    game.players.player.masterHp = 1;

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("magic");
    if (decision.type === "magic") {
      expect(decision.action.target).toEqual({ kind: "master", playerId: "player" });
      expect(decision.reason).toContain("相手マスターを倒せる");
    }
  });

  it("uses healing for a threatened valuable ally with meaningful missing hp", () => {
    const game = createCpuGame([{ cardId: "healing", instanceId: "cpu_healing_test" }]);
    game.players.cpu.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      hp: 2,
      level: 2,
      investedStones: 2,
    });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("magic");
    if (decision.type === "magic") {
      expect(decision.action.handInstanceId).toBe("cpu_healing_test");
      expect(decision.action.target).toEqual({ kind: "monster", slotKey: "cpu_front_left" });
      expect(decision.reason).toContain("回復");
    }
  });

  it("uses power up when it creates an immediate monster kill", () => {
    const game = createCpuGame([{ cardId: "power_up", instanceId: "cpu_power_up_test" }]);
    game.players.cpu.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 3 });

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("magic");
    if (decision.type === "magic") {
      expect(decision.action.handInstanceId).toBe("cpu_power_up_test");
      expect(decision.action.target).toEqual({ kind: "monster", slotKey: "cpu_front_left" });
      expect(decision.reason).toContain("攻撃につなげられる");
    }
  });

  it("does not use damage magic to defeat its own monster", () => {
    const game = createCpuGame([{ cardId: "card_026", instanceId: "cpu_spark_test" }]);
    game.players.cpu.stones = 1;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 1 });

    const decision = chooseCpuDecision(game);

    expect(decision.type).not.toBe("magic");
  });

  it("moves monsters to improve role placement", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 0;
    game.slots.cpu_front_left.monster = createActiveMonster("yanbaru", "cpu");

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("move");
    if (decision.type === "move") {
      expect(decision.fromSlotKey).toBe("cpu_front_left");
      expect(decision.toSlotKey).toBe("cpu_back_left");
      expect(decision.reason).toContain("後列");
    }
  });

  it("prioritizes a swap when it creates a stronger follow-up attack lane", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 0;
    game.slots.cpu_front_left.monster = createActiveMonster("yanbaru", "cpu");
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 3 });

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("move");
    if (decision.type === "move") {
      expect(decision.fromSlotKey).toBe("cpu_front_left");
      expect(decision.toSlotKey).toBe("cpu_back_left");
      expect(decision.reason).toContain("攻撃筋");
    }
  });

  it("does not immediately reverse a same-turn swap", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 0;
    game.slots.cpu_front_left.monster = createActiveMonster("yanbaru", "cpu");
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 3 });

    const firstDecision = chooseCpuDecision(game);
    expect(firstDecision.type).toBe("move");
    if (firstDecision.type !== "move") {
      return;
    }

    const moved = applyCpuDecision(game, firstDecision);
    const nextDecision = chooseCpuDecision(moved);

    expect(
      nextDecision.type === "move" &&
        nextDecision.fromSlotKey === firstDecision.toSlotKey &&
        nextDecision.toSlotKey === firstDecision.fromSlotKey,
    ).toBe(false);
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

  it("auto step resolves player level-up prompts without manual input", () => {
    const game = createPlayerAutoGame([]);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 2 });

    const pending = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(pending.pendingLevelUp?.maxLevels).toBe(1);

    const resolved = runAutoStep(pending);

    expect(resolved.pendingLevelUp).toBeUndefined();
    expect(resolved.slots.player_front_left.monster?.level).toBe(2);
  });

  it("runs both sides in auto play across seeds without getting stuck", () => {
    for (let seed = 330; seed < 340; seed += 1) {
      let game = createInitialGame(seed);
      for (let step = 0; step < 120 && !game.winner; step += 1) {
        game = runAutoStep(game);
        if (game.pendingLevelUp) {
          game = runAutoStep(game);
          expect(game.pendingLevelUp).toBeUndefined();
        }
      }

      expect(game.turnNumber).toBeGreaterThan(1);
    }
  });

  it("finishes 100 auto-play games without exceptions, unresolved prompts, or extreme length", () => {
    const results: Array<{ seed: number; steps: number; turns: number; winner: PlayerId | undefined }> = [];

    for (let seed = 400; seed < 500; seed += 1) {
      let game = createInitialGame(seed);
      let repeatedSignatureCount = 0;
      let previousSignature = progressSignature(game);
      let step = 0;

      for (; step < 500 && !game.winner; step += 1) {
        game = runAutoStep(game);
        if (game.pendingLevelUp) {
          game = runAutoStep(game);
        }

        const nextSignature = progressSignature(game);
        repeatedSignatureCount = nextSignature === previousSignature ? repeatedSignatureCount + 1 : 0;
        previousSignature = nextSignature;

        expect(game.pendingLevelUp, `seed ${seed} left unresolved level-up`).toBeUndefined();
        expect(repeatedSignatureCount, `seed ${seed} repeated the same state too many times`).toBeLessThan(8);
      }

      results.push({ seed, steps: step, turns: game.turnNumber, winner: game.winner });
      expect(game.winner, `seed ${seed} did not finish within 500 auto steps`).toBeDefined();
      expect(step, `seed ${seed} took too many auto steps`).toBeLessThan(500);
    }

    const maxSteps = Math.max(...results.map((result) => result.steps));
    const maxTurns = Math.max(...results.map((result) => result.turns));
    expect(maxSteps).toBeLessThan(500);
    expect(maxTurns).toBeLessThan(120);
  }, 60_000);
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

function createPlayerAutoGame(hand: CardInstance[] = []): GameState {
  const game = createInitialGame(251);
  game.currentPlayer = "player";
  game.players.player.stones = 3;
  game.players.player.hand = hand;
  game.players.player.discard = [];
  game.players.cpu.hand = [];
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

function progressSignature(game: GameState): string {
  return JSON.stringify({
    currentPlayer: game.currentPlayer,
    turnNumber: game.turnNumber,
    winner: game.winner,
    player: {
      hp: game.players.player.masterHp,
      stones: game.players.player.stones,
      hand: game.players.player.hand.length,
      deck: game.players.player.deck.length,
      discard: game.players.player.discard.length,
    },
    cpu: {
      hp: game.players.cpu.masterHp,
      stones: game.players.cpu.stones,
      hand: game.players.cpu.hand.length,
      deck: game.players.cpu.deck.length,
      discard: game.players.cpu.discard.length,
    },
    slots: Object.entries(game.slots).map(([slotKey, slot]) => [
      slotKey,
      slot.monster
        ? {
            id: slot.monster.instanceId,
            cardId: slot.monster.cardId,
            owner: slot.monster.owner,
            hp: slot.monster.hp,
            level: slot.monster.level,
            status: slot.monster.status,
            actionCount: slot.monster.actionCount,
            focused: slot.monster.focused,
            shielded: slot.monster.shielded,
          }
        : null,
    ]),
  });
}
