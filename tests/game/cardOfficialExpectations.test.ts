import { describe, expect, it } from "vitest";
import { getAllCardDefs, getCardDef, getMonsterDef, getSpecialCardDefs } from "../../src/game/cards";
import {
  attackWithCommand,
  createInitialGame,
  endTurn,
  getCommandTargets,
  getMagicTargets,
  getMovableTargets,
  playMagic,
  resolveLevelUp,
  startTurn,
  summonMonster,
  useMasterAction,
} from "../../src/game/rules";
import type { CardDef, CardInstance, GameState, MonsterCardDef, MonsterState, PlayerId } from "../../src/game/types";

const SPECIAL_LEVEL_UP_CASES = getSpecialCardDefs().flatMap((card) => {
  if (card.type !== "monster") {
    return [];
  }
  const special = card as MonsterCardDef;
  const entryLevel = Math.min(...special.levels.map((level) => level.level));
  return (special.evolvesFrom ?? []).map((seedCardId) => [
    `${special.id} ${special.name} from ${seedCardId}`,
    special,
    seedCardId,
    entryLevel,
  ] as const);
});

describe("official card effect expectations", () => {
  it.each(getAllCardDefs().map((card) => [`${card.id} ${card.name}`, card] as const))(
    "%s has reviewed official source data",
    (_label, card) => {
      expect(officialSourceSnapshot(card)).toMatchSnapshot();
    },
  );

  it.each(getSpecialCardDefs().map((card) => [`${card.id} ${card.name}`, card] as const))(
    "%s has reviewed official super source data",
    (_label, card) => {
      expect(officialSourceSnapshot(card)).toMatchSnapshot();
    },
  );

  it.each(SPECIAL_LEVEL_UP_CASES)(
    "%s can enter through a matching super level-up",
    (_label, special, seedCardId, entryLevel) => {
      const game = createGameWithPlayerHand([{ cardId: special.id, instanceId: "super_card" }]);
      const startLevel = Math.max(1, entryLevel - 1);
      const requiredLevels = entryLevel - startLevel;
      const expectedHp = special.levels.find((level) => level.level === entryLevel)?.maxHp;
      game.players.player.stones = requiredLevels;
      game.slots.player_front_left.monster = createActiveMonster(seedCardId, "player", {
        level: startLevel,
        hp: 1,
        investedStones: startLevel,
      });
      game.pendingLevelUp = {
        playerId: "player",
        attackerSlotKey: "player_front_left",
        maxLevels: requiredLevels,
        recoilDamage: 0,
        superOptions: [{ handInstanceId: "super_card", cardId: special.id }],
      };

      const next = resolveLevelUp(game, requiredLevels, "super_card");

      expect(next.pendingLevelUp).toBeUndefined();
      expect(next.slots.player_front_left.monster).toMatchObject({
        cardId: special.id,
        level: entryLevel,
        hp: expectedHp,
        investedStones: entryLevel,
      });
      expect(next.players.player.hand).toEqual([]);
      expect(next.players.player.discard.some((card) => card.cardId === seedCardId)).toBe(true);
    },
  );

  it("super action-limit traits allow T3-00 three actions and El Spinner two actions", () => {
    let game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_012", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 10 });

    for (let i = 0; i < 3; i += 1) {
      expect(getCommandTargets(game, "player_front_left", "attack")).toContainEqual({
        kind: "monster",
        slotKey: "cpu_front_left",
      });
      game = attackWithCommand(game, {
        attackerSlotKey: "player_front_left",
        commandId: "attack",
        target: { kind: "monster", slotKey: "cpu_front_left" },
      });
    }
    expect(getCommandTargets(game, "player_front_left", "attack")).toEqual([]);

    game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_143", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 11 });

    for (let i = 0; i < 2; i += 1) {
      game = attackWithCommand(game, {
        attackerSlotKey: "player_front_left",
        commandId: "ヒートブレード",
        target: { kind: "monster", slotKey: "cpu_front_left" },
      });
    }
    expect(getCommandTargets(game, "player_front_left", "ヒートブレード")).toEqual([]);
  });

  it("super recoil, piercing, and life drain commands resolve their official side effects", () => {
    let game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_006", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 10 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "大爆発",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.player_front_left.monster).toBeUndefined();
    expect(game.slots.cpu_front_left.monster?.hp).toBe(4);

    game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_042", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 7 });
    game.slots.cpu_back_left.monster = createActiveMonster("yanbaru", "cpu", { hp: 6 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "シャインアロー",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(2);
    expect(game.slots.cpu_back_left.monster?.hp).toBe(1);

    game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_038", "player", { hp: 3 });
    game.slots.cpu_back_right.monster = createActiveMonster("takokke", "cpu", { hp: 5 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "ライフドレイン_2",
      target: { kind: "monster", slotKey: "cpu_back_right" },
    });

    expect(game.slots.player_front_left.monster?.hp).toBe(5);
    expect(game.slots.cpu_back_right.monster?.hp).toBe(3);
  });

  it("super utility commands level, reset, rotate, and transform monsters", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("card_036", "player");
    game.slots.player_front_right.monster = createActiveMonster("takokke", "player");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "夢幻の光",
      target: { kind: "monster", slotKey: "player_front_right" },
    });

    expect(game.slots.player_front_right.monster?.level).toBe(2);

    game = createGameWithPlayerHand([]);
    game.players.player.stones = 1;
    game.slots.player_front_left.monster = createActiveMonster("card_036", "player");
    game.slots.player_front_right.monster = createActiveMonster("takokke", "player", {
      level: 2,
      investedStones: 2,
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "夢幻の光",
      target: { kind: "monster", slotKey: "player_front_right" },
    });

    expect(game.slots.player_front_right.monster).toBeUndefined();

    game = createGameWithPlayerHand([]);
    game.players.player.stones = 4;
    game.slots.player_back_left.monster = createActiveMonster("card_054", "player");
    game.slots.player_front_left.monster = createActiveMonster("sigma", "player", {
      level: 3,
      hp: 1,
      investedStones: 3,
      powerUp: true,
      shielded: true,
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "再生",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster).toMatchObject({
      level: 1,
      hp: 6,
      investedStones: 1,
      powerUp: false,
      shielded: false,
    });
    expect(game.players.player.stones).toBe(2);

    game = createGameWithPlayerHand([]);
    game.slots.player_back_left.monster = createActiveMonster("card_136", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 8 });
    game.slots.cpu_front_right.monster = createActiveMonster("bomuzo", "cpu");
    game.slots.cpu_back_left.monster = createActiveMonster("yanbaru", "cpu");
    game.slots.cpu_back_right.monster = createActiveMonster("sigma", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "エアロターン",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.cardId).toBe("sigma");
    expect(game.slots.cpu_front_right.monster?.cardId).toBe("takokke");
    expect(game.slots.cpu_back_left.monster?.cardId).toBe("bomuzo");
    expect(game.slots.cpu_back_right.monster?.cardId).toBe("yanbaru");

    game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_131", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("sigma", "cpu", {
      level: 3,
      hp: 2,
      investedStones: 3,
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "マナ変化",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster).toMatchObject({
      cardId: "card_002",
      level: 2,
      hp: 2,
    });
  });

  it("super field-wide, freeze, level-move, and self-sacrifice effects resolve", () => {
    let game = createGameWithPlayerHand([]);
    game.slots.player_back_left.monster = createActiveMonster("card_079", "player");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 3 });
    game.slots.player_front_right.monster = createActiveMonster("bomuzo", "player", { hp: 2 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "神秘のキノコ",
      target: { kind: "master", playerId: "player" },
    });

    expect(game.slots.player_front_left.monster?.hp).toBe(5);
    expect(game.slots.player_front_right.monster?.hp).toBe(4);

    game = createGameWithPlayerHand([]);
    game.slots.player_back_left.monster = createActiveMonster("card_079", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 5 });
    game.slots.cpu_front_right.monster = createActiveMonster("bomuzo", "cpu", { hp: 6 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "神秘のキノコ",
      target: { kind: "master", playerId: "cpu" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(3);
    expect(game.slots.cpu_front_right.monster?.hp).toBe(4);

    game = createGameWithPlayerHand([]);
    game.players.player.stones = 4;
    game.players.cpu.stones = 4;
    game.slots.player_front_left.monster = createActiveMonster("card_140", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "コールドブレス",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    expect(game.slots.cpu_front_left.monster?.cannotActUntilDamaged).toBe(true);

    game.currentPlayer = "cpu";
    expect(getCommandTargets(game, "cpu_front_left", "attack")).toEqual([]);

    game.currentPlayer = "player";
    game.slots.player_front_left.monster = createActiveMonster("card_140", "player");
    game.players.player.stones = 3;
    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "コールドブレス",
      target: { kind: "master", playerId: "cpu" },
    });
    expect(game.players.cpu.masterFrozen).toBe(true);

    game = createGameWithPlayerHand([]);
    game.players.player.stones = 1;
    game.slots.player_back_left.monster = createActiveMonster("card_138", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("sigma", "cpu", {
      level: 2,
      investedStones: 2,
    });
    game.slots.cpu_front_right.monster = createActiveMonster("takokke", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "レベルムーブ",
      target: { kind: "monster", slotKey: "cpu_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_right" },
    });

    expect(game.slots.cpu_front_left.monster?.level).toBe(1);
    expect(game.slots.cpu_front_right.monster?.level).toBe(2);

    game = createGameWithPlayerHand([]);
    game.players.player.stones = 0;
    game.slots.player_front_left.monster = createActiveMonster("card_142", "player", { hp: 5 });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.currentPlayer = "cpu";

    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.players.player.stones).toBe(2);
  });

  it("super damage curse, counter, last scream, healing feather, and jackpot resolve", () => {
    let game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_101", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 5 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "火の魂",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.damageCurse).toBe(true);
    game.currentPlayer = "cpu";
    game.slots.player_front_left.monster = createActiveMonster("card_101", "player", { hp: 10 });
    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });
    expect(game.slots.cpu_front_left.monster?.hp).toBe(1);

    game = createGameWithPlayerHand([]);
    game.currentPlayer = "cpu";
    game.slots.player_front_left.monster = createActiveMonster("card_103", "player", {
      level: 3,
      hp: 5,
      investedStones: 3,
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 5 });

    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });
    expect(game.slots.cpu_front_left.monster?.hp).toBe(2);

    game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_068", "player", { hp: 2 });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 6 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "最後の叫び",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    expect(game.slots.cpu_front_left.monster?.hp).toBe(2);
    expect(game.slots.player_front_left.monster).toBeUndefined();

    game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_139", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 3 });
    game.players.cpu.masterHp = 7;

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "癒しの羽",
      target: { kind: "master", playerId: "cpu" },
    });
    expect(game.players.cpu.masterHp).toBe(9);

    game = createGameWithPlayerHand([]);
    game.players.player.stones = 0;
    game.slots.player_front_left.monster = createActiveMonster("card_141", "player");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "ジャックポット",
      target: { kind: "monster", slotKey: "player_front_left" },
    });
    expect(game.players.player.stones).toBe(4);
  });

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

  it("card_057 エスケープ removes an allied monster from the field", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_057", instanceId: "escape" }]);
    game.players.player.stones = magicCost("card_057");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    expect(getMagicTargets(game, "escape")).toContainEqual({ kind: "monster", slotKey: "player_front_left" });
    expect(getMagicTargets(game, "escape")).not.toContainEqual({ kind: "monster", slotKey: "cpu_front_left" });

    game = playMagic(game, {
      handInstanceId: "escape",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster).toBeUndefined();
    expect(game.players.player.discard.some((card) => card.cardId === "takokke")).toBe(true);
    expect(game.players.player.stones).toBe(1);
  });

  it("card_058 特技封じ prevents only the lower monster command", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_058", instanceId: "seal" }]);
    game.players.player.stones = magicCost("card_058");
    game.slots.cpu_front_left.monster = createActiveMonster("card_020", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");

    game = playMagic(game, {
      handInstanceId: "seal",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    game.currentPlayer = "cpu";
    game.players.cpu.stones = 3;

    expect(getCommandTargets(game, "cpu_front_left", "バズーカ")).toEqual([]);
    expect(getCommandTargets(game, "cpu_front_left", "attack")).toContainEqual({
      kind: "monster",
      slotKey: "player_front_left",
    });
  });

  it("card_061 誘惑 always removes the allied bait and randomly removes the enemy", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_061", instanceId: "tempt_success" }]);
    game.randomSeed = 7;
    game.players.player.stones = magicCost("card_061");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMagic(game, {
      handInstanceId: "tempt_success",
      target: { kind: "monster", slotKey: "cpu_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster).toBeUndefined();
    expect(game.slots.cpu_front_left.monster).toBeUndefined();
    expect(game.log.some((entry) => entry.includes("ランダム結果: 誘惑"))).toBe(true);

    game = createGameWithPlayerHand([{ cardId: "card_061", instanceId: "tempt_fail" }]);
    game.randomSeed = 1;
    game.players.player.stones = magicCost("card_061");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMagic(game, {
      handInstanceId: "tempt_fail",
      target: { kind: "monster", slotKey: "cpu_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster).toBeUndefined();
    expect(game.slots.cpu_front_left.monster?.cardId).toBe("takokke");
    expect(game.log.some((entry) => entry.includes("ランダム結果: 誘惑"))).toBe(true);
  });

  it("card_064 黄昏の風 removes all monster effects including shield and power effects", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_064", instanceId: "twilight" }]);
    game.players.player.stones = magicCost("card_064");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      shielded: true,
      powerModifier: 1,
      cannotMove: true,
      commandSealed: true,
      scapegoat: true,
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      shielded: true,
      powerModifier: -1,
      cannotMove: true,
      reviveOnDefeat: true,
    });

    game = playMagic(game, {
      handInstanceId: "twilight",
      target: { kind: "master", playerId: "player" },
    });

    for (const slotKey of ["player_front_left", "cpu_front_left"] as const) {
      const monster = game.slots[slotKey].monster;
      expect(monster?.shielded).toBe(false);
      expect(monster?.powerModifier).toBe(0);
      expect(monster?.cannotMove).toBe(false);
      expect(monster?.commandSealed).toBe(false);
      expect(monster?.scapegoat).toBe(false);
      expect(monster?.reviveOnDefeat).toBe(false);
    }
  });

  it("card_087 浄化 removes only removable effects on the chosen field", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_087", instanceId: "cleanse" }]);
    game.players.player.stones = magicCost("card_087");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      shielded: true,
      powerModifier: 1,
      cannotMove: true,
      commandSealed: true,
      scapegoat: true,
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      cannotMove: true,
      commandSealed: true,
    });

    game = playMagic(game, {
      handInstanceId: "cleanse",
      target: { kind: "master", playerId: "player" },
    });

    expect(game.slots.player_front_left.monster?.shielded).toBe(true);
    expect(game.slots.player_front_left.monster?.powerModifier).toBe(1);
    expect(game.slots.player_front_left.monster?.cannotMove).toBe(false);
    expect(game.slots.player_front_left.monster?.commandSealed).toBe(false);
    expect(game.slots.player_front_left.monster?.scapegoat).toBe(false);
    expect(game.slots.cpu_front_left.monster?.cannotMove).toBe(true);
    expect(game.slots.cpu_front_left.monster?.commandSealed).toBe(true);
  });

  it("card_090 墓荒らし returns the defeated monster to the top of its owner's deck", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_090", instanceId: "grave" }]);
    game.players.player.stones = magicCost("card_090");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 1 });

    game = playMagic(game, {
      handInstanceId: "grave",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster).toBeUndefined();
    expect(game.players.cpu.deck[0]?.cardId).toBe("takokke");
    expect(game.players.cpu.discard.some((card) => card.cardId === "takokke")).toBe(false);
  });

  it("card_097 挑発 restricts a provoked monster to the bait when it can attack it", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_097", instanceId: "provoke" }]);
    game.players.player.stones = magicCost("card_097");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.player_front_right.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMagic(game, {
      handInstanceId: "provoke",
      target: { kind: "monster", slotKey: "cpu_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "player_front_left" },
    });

    game.currentPlayer = "cpu";

    expect(getCommandTargets(game, "cpu_front_left", "attack")).toEqual([
      { kind: "monster", slotKey: "player_front_left" },
    ]);
  });

  it("card_098 デスチェーン links one enemy and one ally, then clears the link when one leaves", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_098", instanceId: "chain" }]);
    game.players.player.stones = magicCost("card_098");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 1 });

    game = playMagic(game, {
      handInstanceId: "chain",
      target: { kind: "monster", slotKey: "cpu_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.deathChainSlotKey).toBe("player_front_left");
    expect(game.slots.player_front_left.monster?.deathChainSlotKey).toBe("cpu_front_left");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster).toBeUndefined();
    expect(game.slots.player_front_left.monster?.deathChainSlotKey).toBeUndefined();
  });

  it("card_124 エクスチェンジ toggles the exchanged master action state", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_124", instanceId: "exchange" }]);
    game.players.player.stones = magicCost("card_124");

    game = playMagic(game, {
      handInstanceId: "exchange",
      target: { kind: "master", playerId: "player" },
    });

    expect(game.players.player.masterActionsExchanged).toBe(true);
    expect(game.players.cpu.masterActionsExchanged).toBe(true);
  });

  it("card_125 かげ呪い damages the cursed monster's master when it leaves", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_125", instanceId: "shadow" }]);
    game.players.player.stones = magicCost("card_125");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 1 });

    game = playMagic(game, {
      handInstanceId: "shadow",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.players.cpu.masterHp).toBe(9);
    expect(game.players.cpu.stones).toBe(2);
  });

  it("card_128 スケープゴート redirects master damage to the chosen allied monster", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_128", instanceId: "scapegoat" }]);
    game.players.player.stones = magicCost("card_128");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { level: 2, hp: 5, investedStones: 2 });

    game = playMagic(game, {
      handInstanceId: "scapegoat",
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

  it("card_129 ソウルチャージ applies focus and boosts only the upper command once", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_129", instanceId: "charge" }]);
    game.players.player.stones = magicCost("card_129");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMagic(game, {
      handInstanceId: "charge",
      target: { kind: "monster", slotKey: "player_front_left" },
    });
    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(2);
    expect(game.slots.player_front_left.monster?.focused).toBe(false);
  });

  it("card_015 パワーホーン damages the target and raises that target's power", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("card_015", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "パワーホーン",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(2);
    expect(game.slots.cpu_front_left.monster?.powerModifier).toBe(1);
  });

  it("card_033 テトカ lowers a monster's level with レベルダウン", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("card_033", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "レベルダウン",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.level).toBe(1);
    expect(game.slots.cpu_front_left.monster?.investedStones).toBe(1);
    expect(game.players.cpu.stones).toBe(1);
  });

  it("card_035 バルバス＆パフ levels up a target with 福音の花 and then resolves its revival trait", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 4;
    game.slots.player_back_left.monster = createActiveMonster("card_035", "player");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 1 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "福音の花",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.level).toBe(2);
    expect(game.slots.player_front_left.monster?.hp).toBe(getMonsterDef("takokke").levels[1].maxHp);
    expect(game.slots.player_back_left.monster?.cardId).toBe("card_035");
    expect(game.slots.player_back_left.monster?.revivedOnce).toBe(true);
  });

  it("card_039 ケントゥリアス logs and applies the random miss result for ジェミニランス", () => {
    let game = createGameWithPlayerHand([]);
    game.randomSeed = 7;
    game.slots.player_front_left.monster = createActiveMonster("card_039", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "ジェミニランス",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(5);
    expect(game.log.some((entry) => entry.includes("ランダム結果: ジェミニランス"))).toBe(true);
    expect(game.log.some((entry) => entry.includes("空振り"))).toBe(true);
  });

  it("card_040 ゴーストシープ fixes a monster's level", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 2;
    game.slots.player_back_left.monster = createActiveMonster("card_040", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "レベル固定",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.levelFixed).toBe(true);
  });

  it("card_043 ガンプ removes a monster with ヘブンズドア", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 3;
    game.slots.player_back_left.monster = createActiveMonster("card_043", "player", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "ヘブンズドア",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster).toBeUndefined();
  });

  it("bomuzo ボムゾウ takes recoil when using 自爆", () => {
    let game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("bomuzo", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 1 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "self_bomb",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.pendingLevelUp?.recoilDamage).toBe(2);
    expect(game.slots.cpu_front_left.monster).toBeUndefined();

    game = resolveLevelUp(game, 0);

    expect(game.slots.player_front_left.monster?.hp).toBe(4);
  });

  it("polyspinner ポリスピナー can act twice in one turn", () => {
    let game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("polyspinner", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.player_front_left.monster?.actionCount).toBe(1);
    expect(getCommandTargets(game, "player_front_left", "attack")).toContainEqual({
      kind: "monster",
      slotKey: "cpu_front_left",
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.player_front_left.monster?.actionCount).toBe(2);
    expect(getCommandTargets(game, "player_front_left", "attack")).toEqual([]);
  });

  it("card_044 ヒートロン gains power when healed by magic", () => {
    let game = createGameWithPlayerHand([{ cardId: "healing", instanceId: "heal_heatron" }]);
    game.players.player.stones = magicCost("healing");
    game.slots.player_front_left.monster = createActiveMonster("card_044", "player", { hp: 4 });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMagic(game, {
      handInstanceId: "heal_heatron",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.hp).toBe(5);
    expect(game.slots.player_front_left.monster?.powerModifier).toBe(1);

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(2);
    expect(game.slots.player_front_left.monster?.powerModifier).toBe(0);
  });

  it("card_046 シトラス gives its level-up right to another ally", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("card_046", "player");
    game.slots.player_front_right.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("card_099", "cpu", { hp: 1 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.pendingLevelUp?.attackerSlotKey).toBe("player_front_right");

    game = resolveLevelUp(game, 1);

    expect(game.slots.player_front_left.monster?.level).toBe(1);
    expect(game.slots.player_front_right.monster?.level).toBe(2);
  });

  it("card_048 グリフォン retreats after using its lower command when the back slot is open", () => {
    let game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_048", "player");
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu");
    const target = getCommandTargets(game, "player_front_left", "バック_クロウ")[0];
    if (!target) {
      throw new Error("グリフォンのバック・クロウ対象がありません");
    }

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "バック_クロウ",
      target,
    });

    expect(game.slots.player_front_left.monster).toBeUndefined();
    expect(game.slots.player_back_left.monster?.cardId).toBe("card_048");
  });

  it("card_077 ゼス guards against further damage after taking damage in the same turn", () => {
    let game = createGameWithPlayerHand([]);
    game.currentPlayer = "cpu";
    game.slots.cpu_front_left.monster = createActiveMonster("polyspinner", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("card_077", "player");

    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });
    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.hp).toBe(2);
    expect(game.log.some((entry) => entry.includes("仮死状態で攻撃を受けつけなかった"))).toBe(true);
  });

  it("card_081 マンクス heals the monster directly in front after taking damage", () => {
    let game = createGameWithPlayerHand([]);
    game.currentPlayer = "cpu";
    game.slots.cpu_front_left.monster = createActiveMonster("bomuzo", "cpu");
    game.slots.player_back_left.monster = createActiveMonster("card_081", "player");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 2 });

    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "storm_bomb",
      target: { kind: "monster", slotKey: "player_back_left" },
    });

    expect(game.slots.player_front_left.monster?.hp).toBe(3);
    expect(game.log.some((entry) => entry.includes("献身が発動した"))).toBe(true);
  });

  it("card_052 クレア clears effects from the damaged target with ウォッシュ", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 2;
    game.slots.player_back_left.monster = createActiveMonster("card_052", "player", {
      level: 2,
      hp: 4,
      investedStones: 2,
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      shielded: true,
      powerModifier: 1,
      cannotMove: true,
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "ウォッシュ",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.shielded).toBe(false);
    expect(game.slots.cpu_front_left.monster?.powerModifier).toBe(0);
    expect(game.slots.cpu_front_left.monster?.cannotMove).toBe(false);
  });

  it("card_053 ラティーヌ heals masters with Lv2 癒しの光", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 2;
    game.players.player.masterHp = 9;
    game.slots.player_back_left.monster = createActiveMonster("card_053", "player", {
      level: 2,
      hp: 3,
      investedStones: 2,
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "癒しの光",
      target: { kind: "master", playerId: "player" },
    });

    expect(game.players.player.masterHp).toBe(10);
  });

  it("card_066 ディン resolves 爆雷撃 as seeded random damage and matching recoil", () => {
    let game = createGameWithPlayerHand([]);
    game.randomSeed = 1;
    game.players.player.stones = 1;
    game.slots.player_front_left.monster = createActiveMonster("card_066", "player", { hp: 10 });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 10 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "爆雷撃",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(6);
    expect(game.slots.player_front_left.monster?.hp).toBe(6);
    expect(game.log.some((entry) => entry.includes("ランダム結果: 爆雷撃 -> 4P"))).toBe(true);
  });

  it("card_069 フール applies 挑発 from its command", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 2;
    game.slots.player_back_left.monster = createActiveMonster("card_069", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "挑発",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.provokeTargetSlotKey).toBe("player_back_left");
  });

  it("card_072 ブラッド伯爵 heals itself after 吸血 deals damage", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("card_072", "player", { hp: 2 });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "吸血",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(4);
    expect(game.slots.player_front_left.monster?.hp).toBe(3);
  });

  it("card_074 アドラ applies cannot-act until damage with ホワイトブレス", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 2;
    game.slots.player_back_left.monster = createActiveMonster("card_074", "player", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "ホワイトブレス",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    game.currentPlayer = "cpu";
    expect(game.slots.cpu_front_left.monster?.cannotActUntilDamaged).toBe(true);
    expect(getCommandTargets(game, "cpu_front_left", "attack")).toEqual([]);
  });

  it("card_076 グングニエル moves forward before resolving なぎ払い", () => {
    let game = createGameWithPlayerHand([]);
    game.slots.player_back_left.monster = createActiveMonster("card_076", "player", {
      level: 2,
      hp: 6,
      investedStones: 2,
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "なぎ払い",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.player_front_left.monster?.cardId).toBe("card_076");
    expect(game.slots.player_back_left.monster).toBeUndefined();
    expect(game.slots.cpu_front_left.monster?.hp).toBe(3);
  });

  it("card_078 オヤコダケ spreads 爆裂キノコ damage around the target", () => {
    let game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_078", "player", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "爆裂キノコ",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(2);
    expect(game.slots.cpu_back_left.monster?.hp).toBe(3);
  });

  it("card_080 マッド・ダミー removes an ally and powers itself with マッドホール", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("card_080", "player", { hp: 2 });
    game.slots.player_front_right.monster = createActiveMonster("takokke", "player");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "マッドホール",
      target: { kind: "monster", slotKey: "player_front_right" },
    });

    expect(game.slots.player_front_right.monster).toBeUndefined();
    expect(game.slots.player_front_left.monster?.hp).toBe(3);
    expect(game.slots.player_front_left.monster?.powerModifier).toBe(1);
  });

  it("card_082 マージス deals target-level damage with 真名之書", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 1;
    game.slots.player_back_left.monster = createActiveMonster("card_082", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "真名之書",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(3);
  });

  it("card_083 and card_084 extend 双華剣 targeting when both partners are active", () => {
    const game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_083", "player", {
      level: 2,
      hp: 3,
      investedStones: 2,
    });
    game.slots.player_front_right.monster = createActiveMonster("card_084", "player", {
      level: 2,
      hp: 3,
      investedStones: 2,
    });
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    expect(getCommandTargets(game, "player_front_left", "双華剣_陽")).toContainEqual({
      kind: "monster",
      slotKey: "cpu_back_left",
    });
    expect(getCommandTargets(game, "player_front_right", "双華剣_陰")).toContainEqual({
      kind: "monster",
      slotKey: "cpu_front_left",
    });
  });

  it("card_085 オーパス swaps same-side monsters with ワープ", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 3;
    game.slots.player_back_left.monster = createActiveMonster("card_085", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.cpu_front_right.monster = createActiveMonster("yanbaru", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "ワープ",
      target: { kind: "monster", slotKey: "cpu_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_right" },
    });

    expect(game.slots.cpu_front_left.monster?.cardId).toBe("yanbaru");
    expect(game.slots.cpu_front_right.monster?.cardId).toBe("takokke");
  });

  it("card_104 ユニフォーン wakes a prepared target before ブレイクホーン damage", () => {
    let game = createGameWithPlayerHand([]);
    game.slots.player_back_left.monster = createActiveMonster("card_104", "player", {
      level: 2,
      hp: 4,
      investedStones: 2,
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { status: "prepared" });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "ブレイクホーン",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.status).toBe("active");
    expect(game.slots.cpu_front_left.monster?.hp).toBe(3);
  });

  it("card_105 ヤミー steals up to two stones from the enemy master", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 1;
    game.players.cpu.stones = 3;
    game.slots.player_back_left.monster = createActiveMonster("card_105", "player");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "それちょうだい",
      target: { kind: "master", playerId: "cpu" },
    });

    expect(game.players.cpu.stones).toBe(1);
    expect(game.players.player.stones).toBe(2);
  });

  it("card_051 ピグミィ can act twice in one turn", () => {
    let game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_051", "player");
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu");
    const target = getCommandTargets(game, "player_front_left", "スパイクボール")[0];
    if (!target) {
      throw new Error("ピグミィのスパイクボール対象がありません");
    }

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "スパイクボール",
      target,
    });
    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "スパイクボール",
      target,
    });

    expect(game.slots.player_front_left.monster?.actionCount).toBe(2);
    expect(getCommandTargets(game, "player_front_left", "スパイクボール")).toEqual([]);
  });

  it("card_099 ゴーント gives Stone Curse to the monster that defeats it", () => {
    let game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("card_099", "cpu", { hp: 1 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.player_front_left.monster?.stoneCurse).toBe(true);
    expect(game.log.some((entry) => entry.includes("ストーン呪を受けた"))).toBe(true);
  });

  it("card_100 カムロ gives Damage Curse to the monster that defeats it", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 0;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("card_100", "cpu", { hp: 1 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.player_front_left.monster?.damageCurse).toBe(true);

    const attacker = game.slots.player_front_left.monster;
    if (attacker) {
      attacker.actionCount = 0;
    }
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.player_front_left.monster?.hp).toBe(1);
    expect(game.slots.player_front_left.monster?.damageCurse).toBe(false);
  });

  it("card_102 赤竜キバ counterattacks only at Lv2", () => {
    let game = createGameWithPlayerHand([]);
    game.currentPlayer = "cpu";
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("card_102", "player", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(3);
  });

  it("card_109 ナッツロックル attacks the monster directly in front after taking damage", () => {
    let game = createGameWithPlayerHand([]);
    game.currentPlayer = "cpu";
    game.players.cpu.stones = 3;
    game.slots.player_front_left.monster = createActiveMonster("card_109", "player", { hp: 6 });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = useMasterAction(game, "master_attack", { kind: "monster", slotKey: "player_front_left" });

    expect(game.slots.player_front_left.monster?.hp).toBe(4);
    expect(game.slots.cpu_front_left.monster?.hp).toBe(3);
    expect(game.log.some((entry) => entry.includes("やつあたりが発動した"))).toBe(true);
  });

  it("card_109 ナッツロックル attacks the unit in front after taking ranged damage", () => {
    let game = createGameWithPlayerHand([]);
    game.currentPlayer = "player";
    game.slots.player_front_right.monster = createActiveMonster("bomuzo", "player", { level: 2, hp: 2, investedStones: 2 });
    game.slots.cpu_back_left.monster = createActiveMonster("card_109", "cpu", { hp: 6 });
    game.slots.cpu_front_left.monster = createActiveMonster("card_001", "cpu", { hp: 3 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_right",
      commandId: "storm_bomb",
      target: { kind: "monster", slotKey: "cpu_back_left" },
    });

    expect(game.slots.cpu_back_left.monster?.hp).toBe(4);
    expect(game.slots.cpu_front_left.monster?.hp).toBe(1);
    expect(game.slots.player_front_right.monster?.hp).toBe(2);
    expect(game.log.some((entry) => entry.includes("やつあたりが発動した"))).toBe(true);
  });

  it("card_109 ナッツロックル does not recursively trigger another やつあたり", () => {
    let game = createGameWithPlayerHand([]);
    game.currentPlayer = "cpu";
    game.slots.player_front_left.monster = createActiveMonster("card_109", "player", { hp: 6 });
    game.slots.cpu_front_left.monster = createActiveMonster("card_109", "cpu", { hp: 6 });

    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.hp).toBe(4);
    expect(game.slots.cpu_front_left.monster?.hp).toBe(4);
    expect(game.log.filter((entry) => entry.includes("やつあたりが発動した"))).toHaveLength(1);
  });

  it("card_132 オクトロス randomly changes power at turn start", () => {
    let game = createGameWithPlayerHand([]);
    game.randomSeed = 7;
    game.players.player.turnsStarted = 1;
    game.slots.player_front_left.monster = createActiveMonster("card_132", "player");

    game = startTurn(game, "player");

    expect(Math.abs(game.slots.player_front_left.monster?.powerModifier ?? 0)).toBe(1);
    expect(game.log.some((entry) => entry.includes("ランダム結果: きまぐれ"))).toBe(true);
  });

  it("card_144 ホロウダイン enters with Stone Curse", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_144", instanceId: "hollow" }]);
    game.players.player.stones = 1;

    game = summonMonster(game, "hollow", "player_back_left");

    expect(game.slots.player_back_left.monster?.stoneCurse).toBe(true);
    expect(game.slots.player_back_left.monster?.hollow).toBe(true);
  });

  it("card_106 ピュア powers the next master attack and then leaves", () => {
    let game = createGameWithPlayerHand([]);
    game.slots.player_back_left.monster = createActiveMonster("card_106", "player");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "パワーチャージ",
      target: { kind: "monster", slotKey: "player_back_left" },
    });

    expect(game.players.player.masterPowerBonus).toBe(1);
    expect(game.slots.player_back_left.monster).toBeUndefined();
  });

  it("card_133 デスシープ seals only the lower command of the monster directly in front", () => {
    const game = createGameWithPlayerHand([]);
    game.currentPlayer = "cpu";
    game.players.cpu.stones = 3;
    game.slots.player_front_left.monster = createActiveMonster("card_133", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("card_020", "cpu");

    expect(getCommandTargets(game, "cpu_front_left", "バズーカ")).toEqual([]);
    expect(getCommandTargets(game, "cpu_front_left", "attack")).toContainEqual({
      kind: "monster",
      slotKey: "player_front_left",
    });
  });

  it("card_107 and card_108 combine their upper attack power for ドリルブレイク", () => {
    let game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_108", "player", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });
    game.slots.player_front_right.monster = createActiveMonster("card_107", "player", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_right",
      commandId: "ドリルブレイク",
      target: { kind: "master", playerId: "cpu" },
    });

    expect(game.players.cpu.masterHp).toBe(6);
  });

  it("card_111 ダロス draws one card with ドローフォース only under the hand limit", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 1;
    game.players.player.deck = [{ cardId: "takokke", instanceId: "drawn_takokke" }];
    game.players.player.hand = [{ cardId: "yanbaru", instanceId: "keep_yanbaru" }];
    game.slots.player_back_left.monster = createActiveMonster("card_111", "player");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "ドローフォース",
      target: { kind: "monster", slotKey: "player_back_left" },
    });

    expect(game.players.player.hand.map((card) => card.instanceId)).toContain("drawn_takokke");
  });

  it("card_112 ロブーン levels itself up or leaves when already max level", () => {
    let game = createGameWithPlayerHand([]);
    game.players.player.stones = 1;
    game.slots.player_back_left.monster = createActiveMonster("card_112", "player");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "レベルアップ",
      target: { kind: "monster", slotKey: "player_back_left" },
    });

    expect(game.slots.player_back_left.monster?.level).toBe(2);
    expect(game.players.player.stones).toBe(0);

    game.players.player.stones = 0;
    game.slots.player_back_left.monster = createActiveMonster("card_112", "player", {
      level: 3,
      hp: 5,
      investedStones: 3,
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "レベルアップ",
      target: { kind: "monster", slotKey: "player_back_left" },
    });

    expect(game.slots.player_back_left.monster).toBeUndefined();
  });

  it("card_134 ファントム swaps with a hand monster at the current level", () => {
    let game = createGameWithPlayerHand([{ cardId: "takokke", instanceId: "switch_takokke" }]);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("card_134", "player", {
      level: 2,
      hp: 3,
      investedStones: 2,
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "ソウルスイッチ",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryHandInstanceId: "switch_takokke",
    });

    expect(game.slots.player_front_left.monster?.cardId).toBe("takokke");
    expect(game.slots.player_front_left.monster?.level).toBe(2);
    expect(game.players.player.discard.some((card) => card.cardId === "card_134")).toBe(true);
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

function officialSourceSnapshot(card: CardDef) {
  const base = {
    id: card.id,
    name: card.name,
    ...(card.pool ? { pool: card.pool } : {}),
    sourceNo: card.sourceNo,
    sourceUrl: card.sourceUrl,
    rarity: card.rarity,
    catchcopy: card.catchcopy,
    notes: card.notes ?? [],
  };

  if (card.type === "magic") {
    return {
      ...base,
      type: card.type,
      cost: card.cost,
      category: card.category,
      continuance: card.continuance,
      targetKinds: card.targetKinds,
      description: card.description,
      implemented: card.implemented,
    };
  }

  return {
    ...base,
    type: card.type,
    role: card.role,
    ...(card.evolvesFrom ? { evolvesFrom: card.evolvesFrom } : {}),
    maxLevel: card.maxLevel,
    actionLimit: card.actionLimit,
    levels: card.levels.map((level) => ({
      level: level.level,
      maxHp: level.maxHp,
      commands: level.commands.map((command) => ({
        id: command.id,
        name: command.name,
        power: command.power,
        range: command.range,
        rangeText: command.rangeText,
        stoneCost: command.stoneCost,
        recoilDamage: command.recoilDamage,
        effectText: command.effectText,
        implemented: command.implemented,
      })),
    })),
  };
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
