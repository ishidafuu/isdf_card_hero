import { describe, expect, it } from "vitest";
import { getCardDef, getMonsterDef } from "../../src/game/cards";
import {
  attackWithCommand,
  createInitialGame,
  endTurn,
  getCommandTargets,
  getMagicTargets,
  getMovableTargets,
  playMagic,
} from "../../src/game/rules";
import type { CardInstance, GameState, MonsterState, PlayerId } from "../../src/game/types";

describe("official card effect expectations", () => {
  it("card_027 パワーダウン lowers only the next attack by 1P", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_027", instanceId: "power_down" }]);
    game.players.player.stones = magicCost("card_027");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMagic(game, {
      handInstanceId: "power_down",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.powerModifier).toBe(-1);

    game.currentPlayer = "cpu";
    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.hp).toBe(4);
    expect(game.slots.cpu_front_left.monster?.powerModifier).toBe(0);
  });

  it("card_059 パワー２ overrides the next attack power to exactly 2P", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_059", instanceId: "power_2" }]);
    game.players.player.stones = magicCost("card_059");
    game.slots.player_front_left.monster = createActiveMonster("morgan", "player", {
      level: 2,
      hp: 4,
      investedStones: 2,
    });

    game = playMagic(game, {
      handInstanceId: "power_2",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.powerOverride).toBe(2);

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "arc_drive",
      target: { kind: "master", playerId: "cpu" },
    });

    expect(game.players.cpu.masterHp).toBe(10);
    expect(game.players.cpu.stones).toBe(0);
    expect(game.slots.player_front_left.monster?.powerOverride).toBeUndefined();
  });

  it("card_094 バーサクパワー adds 1P once and deals 1 recoil after the attack", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_094", instanceId: "berserk" }]);
    game.players.player.stones = magicCost("card_094");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMagic(game, {
      handInstanceId: "berserk",
      target: { kind: "monster", slotKey: "player_front_left" },
    });
    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(2);
    expect(game.slots.player_front_left.monster?.hp).toBe(4);
    expect(game.slots.player_front_left.monster?.berserkPower).toBe(false);
  });

  it("card_063 どこでも makes only the normal attack reach any active monster for one turn", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_063", instanceId: "anywhere" }]);
    game.players.player.stones = magicCost("card_063");
    game.slots.player_front_left.monster = createActiveMonster("card_013", "player");
    game.slots.cpu_back_right.monster = createActiveMonster("takokke", "cpu");

    expect(getCommandTargets(game, "player_front_left", "attack")).not.toContainEqual({
      kind: "monster",
      slotKey: "cpu_back_right",
    });
    expect(getCommandTargets(game, "player_front_left", "ボーンショット")).not.toContainEqual({
      kind: "monster",
      slotKey: "cpu_back_right",
    });

    game = playMagic(game, {
      handInstanceId: "anywhere",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(getCommandTargets(game, "player_front_left", "attack")).toContainEqual({
      kind: "monster",
      slotKey: "cpu_back_right",
    });
    expect(getCommandTargets(game, "player_front_left", "ボーンショット")).not.toContainEqual({
      kind: "monster",
      slotKey: "cpu_back_right",
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_back_right" },
    });

    expect(game.slots.cpu_back_right.monster?.hp).toBe(3);
    expect(endTurn(game).slots.player_front_left.monster?.canAttackAnywhere).toBe(false);
  });

  it("card_118 かまいたち can hit front monsters on either side but not back monsters", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_118", instanceId: "wind" }]);
    game.players.player.stones = magicCost("card_118");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.player_back_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu");

    expect(getMagicTargets(game, "wind")).toContainEqual({ kind: "monster", slotKey: "player_front_left" });
    expect(getMagicTargets(game, "wind")).toContainEqual({ kind: "monster", slotKey: "cpu_front_left" });
    expect(getMagicTargets(game, "wind")).not.toContainEqual({ kind: "monster", slotKey: "player_back_left" });
    expect(getMagicTargets(game, "wind")).not.toContainEqual({ kind: "monster", slotKey: "cpu_back_left" });

    game = playMagic(game, {
      handInstanceId: "wind",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.hp).toBe(4);
  });

  it("card_119 バイストーン doubles special stone cost until the target owner's next turn", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_119", instanceId: "bystone" }]);
    game.players.player.stones = magicCost("card_119") + 2;
    game.slots.player_back_left.monster = createActiveMonster("card_020", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMagic(game, {
      handInstanceId: "bystone",
      target: { kind: "monster", slotKey: "player_back_left" },
    });

    expect(game.slots.player_back_left.monster?.stoneCostMultiplier).toBe(2);
    expect(getCommandTargets(game, "player_back_left", "バズーカ")).toContainEqual({
      kind: "monster",
      slotKey: "cpu_front_left",
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "バズーカ",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.players.player.stones).toBe(0);
    expect(endTurn(game).slots.player_back_left.monster?.stoneCostMultiplier).toBeUndefined();
  });

  it("card_062 水晶の壁 blocks damage until the target owner's next turn", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_062", instanceId: "crystal" }]);
    game.players.player.stones = magicCost("card_062");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMagic(game, {
      handInstanceId: "crystal",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.immune).toBe(true);

    game.currentPlayer = "cpu";
    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.hp).toBe(5);
    expect(endTurn(game).slots.player_front_left.monster?.immune).toBe(false);
  });

  it("card_086 呪縛 prevents movement until the target owner's next turn", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_086", instanceId: "bind" }]);
    game.players.player.stones = magicCost("card_086");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMagic(game, {
      handInstanceId: "bind",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    game = endTurn(game);
    expect(game.currentPlayer).toBe("cpu");
    expect(getMovableTargets(game, "cpu_front_left")).toEqual([]);

    const afterBoundTurn = endTurn(game);
    expect(afterBoundTurn.slots.cpu_front_left.monster?.cannotMove).toBe(false);
  });

  it("card_130 再生 resets a monster to its entry level and returns excess invested stones", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_130", instanceId: "reset" }]);
    game.players.player.stones = magicCost("card_130");
    game.slots.player_front_left.monster = createActiveMonster("morgan", "player", {
      level: 2,
      hp: 1,
      investedStones: 2,
    });

    game = playMagic(game, {
      handInstanceId: "reset",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.level).toBe(1);
    expect(game.slots.player_front_left.monster?.hp).toBe(getMonsterDef("morgan").levels[0].maxHp);
    expect(game.slots.player_front_left.monster?.investedStones).toBe(1);
    expect(game.players.player.stones).toBe(1);
  });

  it("card_127 癒しの光 heals either a master or a monster by 1", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_127", instanceId: "light_master" }]);
    game.players.player.stones = magicCost("card_127");
    game.players.player.masterHp = 9;

    game = playMagic(game, {
      handInstanceId: "light_master",
      target: { kind: "master", playerId: "player" },
    });

    expect(game.players.player.masterHp).toBe(10);

    game.players.player.hand = [{ cardId: "card_127", instanceId: "light_monster" }];
    game.players.player.stones = magicCost("card_127");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 4 });

    game = playMagic(game, {
      handInstanceId: "light_monster",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.hp).toBe(5);
  });

  it("card_149 福音の鐘 levels up an eligible ally by spending one stone", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_149", instanceId: "bell" }]);
    game.players.player.stones = magicCost("card_149") + 1;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 1 });

    game = playMagic(game, {
      handInstanceId: "bell",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.level).toBe(2);
    expect(game.slots.player_front_left.monster?.hp).toBe(getMonsterDef("takokke").levels[1].maxHp);
    expect(game.slots.player_front_left.monster?.investedStones).toBe(2);
    expect(game.players.player.stones).toBe(0);
  });

  it("card_150 スパルタス覚醒 powers up Spartas and levels it up when a stone is available", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_150", instanceId: "awakening" }]);
    game.players.player.stones = magicCost("card_150") + 1;
    game.slots.player_front_left.monster = createActiveMonster("card_001", "player");

    game = playMagic(game, {
      handInstanceId: "awakening",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.level).toBe(2);
    expect(game.slots.player_front_left.monster?.investedStones).toBe(2);
    expect(game.slots.player_front_left.monster?.powerModifier).toBe(2);
    expect(game.players.player.stones).toBe(0);
  });
});

function createGameWithPlayerHand(hand: CardInstance[]): GameState {
  const game = createInitialGame(900);
  game.players.player.hand = hand;
  game.players.player.discard = [];
  game.players.cpu.hand = [];
  return game;
}

function magicCost(cardId: string): number {
  const def = getCardDef(cardId);
  if (def.type !== "magic") {
    throw new Error(`${cardId} is not a magic card`);
  }
  return def.cost;
}

function createActiveMonster(
  cardId: string,
  owner: PlayerId,
  overrides: Partial<MonsterState> = {},
): MonsterState {
  const def = getMonsterDef(cardId);
  const firstLevel = def.levels[0];
  return {
    instanceId: `${owner}_${cardId}_official_fixture`,
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
