import { describe, expect, it } from "vitest";
import { buildDeck, getAllCardDefs, getCardDef, getCardIconPath, getMonsterDef, validateRandomDeck } from "../../src/game/cards";
import {
  attackWithCommand,
  canFocusMonster,
  createInitialGame,
  endTurn,
  focusMonster,
  getCommandTargets,
  getCommandHandChoices,
  getMagicHandChoices,
  getMagicSearchCategories,
  getMagicSecondaryTargets,
  getMagicTargets,
  getMasterActionTargets,
  getMovableTargets,
  playMagic,
  resolveLevelUp,
  startTurn,
  summonMonster,
  useMasterAction,
  useMasterHpDraw,
} from "../../src/game/rules";
import type { CardInstance, GameState, MonsterState, PlayerId } from "../../src/game/types";

describe("battle prototype rules", () => {
  it("builds a 30-card random deck with guaranteed composition and copy limits", () => {
    const deck = buildDeck("test", 123);
    const counts = new Map<string, number>();
    const categories = { front: 0, back: 0, magic: 0 };

    for (const card of deck) {
      counts.set(card.cardId, (counts.get(card.cardId) ?? 0) + 1);
      const def = getCardDef(card.cardId);
      if (def.type === "magic") {
        categories.magic += 1;
      } else {
        categories[def.role] += 1;
      }
    }

    expect(validateRandomDeck(deck)).toBe(true);
    expect(deck).toHaveLength(30);
    expect([...counts.values()].every((count) => count <= 3)).toBe(true);
    expect(categories.front).toBeGreaterThanOrEqual(12);
    expect(categories.back).toBeGreaterThanOrEqual(6);
    expect(categories.magic).toBeGreaterThanOrEqual(6);
    expect(buildDeck("test", 1).map((card) => card.cardId).join(",")).not.toBe(
      buildDeck("test", 2).map((card) => card.cardId).join(","),
    );
  });

  it("imports the non-super original card pool with temporary icons", () => {
    const cards = getAllCardDefs();

    expect(cards).toHaveLength(126);
    expect(cards.filter((card) => card.type === "monster" && card.role === "front")).toHaveLength(46);
    expect(cards.filter((card) => card.type === "monster" && card.role === "back")).toHaveLength(26);
    expect(cards.filter((card) => card.type === "magic")).toHaveLength(54);
    expect(cards.every((card) => card.icon?.startsWith("/card-icons/co"))).toBe(true);
    expect(getCardIconPath("takokke")).toBe("/card-icons/co004.jpg");
  });

  it("does not keep imported cards marked as unimplemented", () => {
    for (const card of getAllCardDefs()) {
      if (card.type === "magic") {
        expect(card.implemented).not.toBe(false);
        continue;
      }
      for (const level of card.levels) {
        for (const command of level.commands) {
          expect(command.implemented).not.toBe(false);
          expect(command.range).not.toBe("unimplemented");
        }
      }
    }
  });

  it("skips only the first player's opening draw", () => {
    const game = createInitialGame(100);

    expect(game.currentPlayer).toBe("player");
    expect(game.players.player.stones).toBe(3);
    expect(game.players.player.hand).toHaveLength(5);
    expect(game.players.player.deck).toHaveLength(25);

    const cpuTurn = endTurn(game);
    expect(cpuTurn.currentPlayer).toBe("cpu");
    expect(cpuTurn.players.cpu.stones).toBe(3);
    expect(cpuTurn.players.cpu.hand).toHaveLength(6);
    expect(cpuTurn.players.cpu.deck).toHaveLength(24);
  });

  it("spends master HP to draw and converts the HP loss into stone", () => {
    const game = createInitialGame(101);
    const before = game.players.player;

    const next = useMasterHpDraw(game);

    expect(next.players.player.masterHp).toBe(before.masterHp - 1);
    expect(next.players.player.stones).toBe(before.stones + 1);
    expect(next.players.player.hand).toHaveLength(before.hand.length + 1);
    expect(next.players.player.deck).toHaveLength(before.deck.length - 1);
  });

  it("allows master HP draw at 1 HP and immediately loses", () => {
    const game = createInitialGame(102);
    game.players.player.masterHp = 1;

    const next = useMasterHpDraw(game);

    expect(next.players.player.masterHp).toBe(0);
    expect(next.winner).toBe("cpu");
  });

  it("does not allow master HP draw when the deck is empty", () => {
    const game = createInitialGame(103);
    game.players.player.deck = [];

    expect(() => useMasterHpDraw(game)).toThrow("山札が0枚");
  });

  it("applies deck-out penalty on forced draw and grants stone from HP loss", () => {
    const game = createInitialGame(104);
    game.players.player.deck = [];
    game.players.player.turnsStarted = 1;
    game.players.player.stones = 0;

    const next = startTurn(game, "player");

    expect(next.players.player.masterHp).toBe(9);
    expect(next.players.player.stones).toBe(4);
    expect(next.winner).toBeUndefined();
  });

  it("summons prepared monsters and advances back-row monsters on turn start", () => {
    let game = createGameWithPlayerHand([{ cardId: "takokke", instanceId: "test_takokke" }]);
    game.players.player.stones = 1;

    game = summonMonster(game, "test_takokke", "player_back_left");
    expect(game.slots.player_back_left.monster?.status).toBe("prepared");

    const next = startTurn(game, "player");

    expect(next.slots.player_back_left.monster).toBeUndefined();
    expect(next.slots.player_front_left.monster?.status).toBe("active");
    expect(next.slots.player_front_left.monster?.cardId).toBe("takokke");
  });

  it("hides CPU prepared card names in summon logs", () => {
    const game = createInitialGame(116);
    game.currentPlayer = "cpu";
    game.players.cpu.stones = 1;
    game.players.cpu.hand = [{ cardId: "takokke", instanceId: "cpu_hidden_takokke" }];

    const next = summonMonster(game, "cpu_hidden_takokke", "cpu_back_left");

    expect(next.slots.cpu_back_left.monster?.cardId).toBe("takokke");
    expect(next.log.at(-1)).toBe("CPUはカードを準備中で召喚した");
    expect(next.log.at(-1)).not.toContain("タコッケー");
  });

  it("lets any_target attacks damage the opponent master through the 2P shield", () => {
    let game = createGameWithPlayerHand([{ cardId: "morgan", instanceId: "test_morgan" }]);
    game.players.player.stones = 1;

    game = summonMonster(game, "test_morgan", "player_back_left");
    game = startTurn(game, "player");
    const monster = game.slots.player_front_left.monster;
    expect(monster?.cardId).toBe("morgan");
    if (!monster) {
      throw new Error("morgan was not advanced");
    }
    monster.level = 2;
    monster.hp = 4;

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "arc_drive",
      target: { kind: "master", playerId: "cpu" },
    });

    expect(next.players.cpu.masterHp).toBe(9);
    expect(next.players.cpu.stones).toBe(1);
  });

  it("lets adjacent monster attacks target the opponent master when in range", () => {
    const game = createInitialGame(121);
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");

    expect(getCommandTargets(game, "player_front_left", "attack")).toContainEqual({
      kind: "master",
      playerId: "cpu",
    });

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "master", playerId: "cpu" },
    });

    expect(next.players.cpu.masterHp).toBe(10);
    expect(next.players.cpu.stones).toBe(0);
  });

  it("lets stronger adjacent monster attacks pierce the opponent master shield", () => {
    const game = createInitialGame(122);
    game.slots.player_front_right.monster = createActiveMonster("takokke", "player", {
      hp: 4,
      level: 2,
    });

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_front_right",
      commandId: "attack",
      target: { kind: "master", playerId: "cpu" },
    });

    expect(next.players.cpu.masterHp).toBe(9);
    expect(next.players.cpu.stones).toBe(1);
  });

  it("lets CPU adjacent monster attacks target the player master when in range", () => {
    const game = createInitialGame(123);
    game.currentPlayer = "cpu";
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    expect(getCommandTargets(game, "cpu_front_left", "attack")).toContainEqual({
      kind: "master",
      playerId: "player",
    });
  });

  it("creates a player choice when a monster can level up after defeating a monster", () => {
    const game = createInitialGame(105);
    game.players.player.stones = 1;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 2 });

    const pending = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(pending.pendingLevelUp?.maxLevels).toBe(1);

    const next = resolveLevelUp(pending, 1);
    const attacker = next.slots.player_front_left.monster;
    expect(next.pendingLevelUp).toBeUndefined();
    expect(attacker?.level).toBe(2);
    expect(attacker?.hp).toBe(6);
    expect(attacker?.investedStones).toBe(2);
    expect(next.players.player.stones).toBe(0);
  });

  it("can raise a level 1 monster by two levels after defeating a level 2 monster", () => {
    const game = createInitialGame(106);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("sigma", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      hp: 1,
      level: 2,
      investedStones: 2,
    });

    const pending = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(pending.pendingLevelUp?.maxLevels).toBe(2);

    const next = resolveLevelUp(pending, 2);
    const attacker = next.slots.player_front_left.monster;
    expect(attacker?.level).toBe(3);
    expect(attacker?.investedStones).toBe(3);
    expect(next.players.player.stones).toBe(0);
  });

  it("returns all invested stones when a level 3 monster is defeated", () => {
    const game = createInitialGame(107);
    game.currentPlayer = "cpu";
    game.players.player.stones = 0;
    game.players.cpu.stones = 0;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("sigma", "player", {
      hp: 2,
      level: 3,
      investedStones: 3,
    });

    const next = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(next.slots.player_front_left.monster).toBeUndefined();
    expect(next.players.player.stones).toBe(3);
  });

  it("lets the white master attack active front monsters without triggering level up", () => {
    const game = createInitialGame(108);
    game.players.player.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 2 });

    expect(getMasterActionTargets(game, "master_attack")).toEqual([
      { kind: "monster", slotKey: "cpu_front_left" },
    ]);

    const next = useMasterAction(game, "master_attack", { kind: "monster", slotKey: "cpu_front_left" });

    expect(next.players.player.stones).toBe(0);
    expect(next.slots.cpu_front_left.monster).toBeUndefined();
    expect(next.pendingLevelUp).toBeUndefined();
  });

  it("wakes up any prepared monster with white master magic", () => {
    const game = createInitialGame(109);
    game.players.player.stones = 2;
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu", {
      status: "prepared",
      actionCount: 1,
    });

    const next = useMasterAction(game, "wake_up", { kind: "monster", slotKey: "cpu_back_left" });

    expect(next.players.player.stones).toBe(0);
    expect(next.slots.cpu_back_left.monster?.status).toBe("active");
    expect(next.slots.cpu_back_left.monster?.actionCount).toBe(0);
  });

  it("reduces monster damage by one with white master shield until the owner's next turn", () => {
    let game = createInitialGame(110);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = useMasterAction(game, "shield", { kind: "monster", slotKey: "player_front_left" });
    expect(game.slots.player_front_left.monster?.shielded).toBe(true);

    game.currentPlayer = "cpu";
    const attacked = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(attacked.slots.player_front_left.monster?.hp).toBe(4);

    const cleared = startTurn(attacked, "player");
    expect(cleared.slots.player_front_left.monster?.shielded).toBe(false);
  });

  it("lets a two-action monster spend its remaining action to focus", () => {
    let game = createInitialGame(111);
    game.slots.player_front_left.monster = createActiveMonster("polyspinner", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    expect(game.slots.player_front_left.monster?.actionCount).toBe(1);
    expect(canFocusMonster(game, "player_front_left")).toBe(true);

    const focused = focusMonster(game, "player_front_left");
    expect(focused.slots.player_front_left.monster?.focused).toBe(true);
    expect(focused.slots.player_front_left.monster?.actionCount).toBe(2);
    expect(canFocusMonster(focused, "player_front_left")).toBe(false);

    const nextTurn = startTurn(focused, "player");
    const focusedAttack = attackWithCommand(nextTurn, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    expect(focusedAttack.slots.cpu_front_left.monster).toBeUndefined();
    expect(focusedAttack.slots.player_front_left.monster?.focused).toBe(false);
  });

  it("does not apply focus attack power to lower commands but still clears focus", () => {
    const game = createInitialGame(118);
    game.slots.player_front_right.monster = createActiveMonster("yanbaru", "player", { focused: true });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_front_right",
      commandId: "wild_claw",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(next.slots.cpu_front_left.monster?.hp).toBe(3);
    expect(next.slots.player_front_right.monster?.focused).toBe(false);
  });

  it("does not let focused lower commands deal extra damage to masters", () => {
    const game = createInitialGame(119);
    game.slots.player_front_left.monster = createActiveMonster("morgan", "player", {
      focused: true,
      hp: 4,
      level: 2,
    });

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "arc_drive",
      target: { kind: "master", playerId: "cpu" },
    });

    expect(next.players.cpu.masterHp).toBe(9);
    expect(next.slots.player_front_left.monster?.focused).toBe(false);
  });

  it("reduces incoming monster damage by one while focused", () => {
    let game = createInitialGame(117);
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = focusMonster(game, "player_front_left");
    game.currentPlayer = "cpu";
    const attacked = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(attacked.slots.player_front_left.monster?.hp).toBe(4);
    expect(attacked.slots.player_front_left.monster?.focused).toBe(false);
    expect(attacked.log.some((entry) => entry.includes("気合いで1ダメージ軽減した"))).toBe(true);
  });

  it("lets range-2 attacks target the diagonally forward skipped lane", () => {
    const game = createInitialGame(112);
    game.slots.player_back_left.monster = createActiveMonster("yanbaru", "player");
    game.slots.cpu_front_right.monster = createActiveMonster("takokke", "cpu");

    expect(getCommandTargets(game, "player_back_left", "wild_claw")).toContainEqual({
      kind: "monster",
      slotKey: "cpu_front_right",
    });

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "wild_claw",
      target: { kind: "monster", slotKey: "cpu_front_right" },
    });

    expect(next.slots.cpu_front_right.monster?.hp).toBe(3);
  });

  it("lets range-2 attacks target the opponent master coordinate", () => {
    const game = createInitialGame(124);
    game.slots.player_back_left.monster = createActiveMonster("yanbaru", "player");

    expect(getCommandTargets(game, "player_back_left", "wild_claw")).toContainEqual({
      kind: "master",
      playerId: "cpu",
    });

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "wild_claw",
      target: { kind: "master", playerId: "cpu" },
    });

    expect(next.players.cpu.masterHp).toBe(10);
    expect(next.players.cpu.stones).toBe(0);
  });

  it("lets range-2 attacks reach from the right front to the opposite left front", () => {
    const game = createInitialGame(114);
    game.slots.player_front_right.monster = createActiveMonster("yanbaru", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    expect(getCommandTargets(game, "player_front_right", "wild_claw")).toContainEqual({
      kind: "monster",
      slotKey: "cpu_front_left",
    });

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_front_right",
      commandId: "wild_claw",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(next.slots.cpu_front_left.monster?.hp).toBe(3);
  });

  it("lets range-3 attacks reach from the bottom right to the top left", () => {
    const game = createInitialGame(126);
    game.players.player.stones = 3;
    game.slots.player_back_right.monster = createActiveMonster("card_022", "player");
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu");

    expect(getCommandTargets(game, "player_back_right", "キラーニードル")).toContainEqual({
      kind: "monster",
      slotKey: "cpu_back_left",
    });
  });

  it("lets Pigmy Lv2 spike ball target both range-2 and range-3 squares", () => {
    const game = createInitialGame(129);
    game.slots.player_back_right.monster = createActiveMonster("card_051", "player", {
      level: 2,
      hp: 3,
      investedStones: 2,
    });
    game.slots.player_front_right.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_right.monster = createActiveMonster("takokke", "cpu");
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu");

    const targets = getCommandTargets(game, "player_back_right", "スパイクボール");

    expect(targets).toContainEqual({ kind: "monster", slotKey: "cpu_front_right" });
    expect(targets).toContainEqual({ kind: "monster", slotKey: "cpu_back_left" });
    expect(targets).not.toContainEqual({ kind: "monster", slotKey: "player_front_right" });
  });

  it("gives every imported magic card at least one playable target in a populated board", () => {
    const magicCards = getAllCardDefs().filter((card) => card.type === "magic");

    for (const magic of magicCards) {
      const game = createInitialGame(127);
      game.players.player.stones = 99;
      game.players.player.hand = [
        { cardId: magic.id, instanceId: `magic_${magic.id}` },
        { cardId: "takokke", instanceId: `extra_${magic.id}` },
      ];
      game.slots.player_front_left.monster = createActiveMonster("card_001", "player");
      game.slots.player_front_right.monster = createActiveMonster("takokke", "player");
      game.slots.player_back_left.monster = createActiveMonster("sigma", "player", { status: "prepared" });
      game.slots.player_back_right.monster = createActiveMonster("card_083", "player");
      game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
      game.slots.cpu_front_right.monster = createActiveMonster("card_084", "cpu");
      game.slots.cpu_back_left.monster = createActiveMonster("sigma", "cpu", { status: "prepared" });
      game.slots.cpu_back_right.monster = createActiveMonster("takokke", "cpu", { level: 2, investedStones: 2 });

      expect(getMagicTargets(game, `magic_${magic.id}`).length, magic.name).toBeGreaterThan(0);
    }
  });

  it("gives every imported monster command at least one playable target in a populated board", () => {
    const monsters = getAllCardDefs().filter((card) => card.type === "monster");

    for (const card of monsters) {
      for (const level of card.levels) {
        for (const command of level.commands) {
          const game = createInitialGame(128);
          game.players.player.stones = 99;
          game.slots.player_back_right.monster = createActiveMonster(card.id, "player", {
            hp: level.maxHp,
            level: level.level,
            investedStones: level.level,
          });
          game.slots.player_front_right.monster = createActiveMonster("takokke", "player", { level: 2, investedStones: 2 });
          game.slots.player_front_left.monster = createActiveMonster("card_084", "player");
          game.slots.player_back_left.monster = createActiveMonster("sigma", "player", { status: "prepared" });
          game.slots.cpu_front_right.monster = createActiveMonster("takokke", "cpu", { level: 2, investedStones: 2 });
          game.slots.cpu_front_left.monster = createActiveMonster("card_083", "cpu");
          game.slots.cpu_back_right.monster = createActiveMonster("sigma", "cpu", { level: 2, investedStones: 2 });
          game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu", { status: "prepared" });

          expect(getCommandTargets(game, "player_back_right", command.id).length, `${card.name} Lv${level.level} ${command.name}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("allows attacks against allied monsters", () => {
    const game = createInitialGame(113);
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.player_back_left.monster = createActiveMonster("takokke", "player");

    expect(getCommandTargets(game, "player_front_left", "attack")).toContainEqual({
      kind: "monster",
      slotKey: "player_back_left",
    });

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_back_left" },
    });

    expect(next.slots.player_back_left.monster?.hp).toBe(3);
  });

  it("penalizes the master instead of leveling up when an allied monster is defeated", () => {
    const game = createInitialGame(114);
    game.players.player.stones = 0;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.player_back_left.monster = createActiveMonster("takokke", "player", { hp: 2 });

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_back_left" },
    });

    expect(next.slots.player_back_left.monster).toBeUndefined();
    expect(next.players.player.masterHp).toBe(9);
    expect(next.players.player.stones).toBe(2);
    expect(next.pendingLevelUp).toBeUndefined();
  });

  it("uses explicit secondary monster targets for double shield and warp effects", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_030", instanceId: "double_shield" }]);
    game.players.player.stones = 3;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    expect(getMagicSecondaryTargets(game, {
      handInstanceId: "double_shield",
      target: { kind: "monster", slotKey: "player_front_left" },
    })).toContainEqual({ kind: "monster", slotKey: "cpu_front_left" });

    game = playMagic(game, {
      handInstanceId: "double_shield",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.player_front_left.monster?.shielded).toBe(true);
    expect(game.slots.cpu_front_left.monster?.shielded).toBe(true);

    game.players.player.hand = [{ cardId: "card_031", instanceId: "warp" }];
    game.players.player.stones = 3;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { instanceId: "left" });
    game.slots.player_front_right.monster = createActiveMonster("sigma", "player", { instanceId: "right" });

    game = playMagic(game, {
      handInstanceId: "warp",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "player_front_right" },
    });

    expect(game.slots.player_front_left.monster?.instanceId).toBe("right");
    expect(game.slots.player_front_right.monster?.instanceId).toBe("left");
  });

  it("uses explicit hand choices for shift change, soul switch, refresh, and card search", () => {
    let game = createGameWithPlayerHand([
      { cardId: "card_065", instanceId: "shift" },
      { cardId: "sigma", instanceId: "hand_sigma" },
    ]);
    game.players.player.stones = 4;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { instanceId: "field_takokke" });

    expect(getMagicHandChoices(game, "shift").map((card) => card.instanceId)).toEqual(["hand_sigma"]);

    game = playMagic(game, {
      handInstanceId: "shift",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryHandInstanceId: "hand_sigma",
    });

    expect(game.slots.player_front_left.monster?.cardId).toBe("sigma");
    expect(game.players.player.hand.some((card) => card.instanceId === "field_takokke")).toBe(true);

    game.players.player.hand = [{ cardId: "takokke", instanceId: "soul_takokke" }];
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("card_134", "player", { level: 2, investedStones: 2 });

    expect(getCommandHandChoices(game, "player_front_left", "ソウルスイッチ")).toHaveLength(1);

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "ソウルスイッチ",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryHandInstanceId: "soul_takokke",
    });

    expect(game.slots.player_front_left.monster?.cardId).toBe("takokke");
    expect(game.players.player.discard.some((card) => card.cardId === "card_134")).toBe(true);

    game.players.player.hand = [
      { cardId: "card_116", instanceId: "refresh" },
      { cardId: "takokke", instanceId: "keep" },
      { cardId: "sigma", instanceId: "discard_me" },
    ];
    game.players.player.deck = [{ cardId: "bomuzo", instanceId: "drawn_bomuzo" }];
    game.players.player.stones = 2;

    game = playMagic(game, {
      handInstanceId: "refresh",
      target: { kind: "master", playerId: "player" },
      selectedHandInstanceIds: ["discard_me"],
    });

    expect(game.players.player.hand.map((card) => card.instanceId)).toEqual(["keep", "drawn_bomuzo"]);
    expect(game.players.player.discard.some((card) => card.instanceId === "discard_me")).toBe(true);

    game.players.player.hand = [{ cardId: "card_123", instanceId: "search" }];
    game.players.player.deck = [
      { cardId: "takokke", instanceId: "front_card" },
      { cardId: "yanbaru", instanceId: "back_card" },
      { cardId: "healing", instanceId: "magic_card" },
    ];
    game.players.player.stones = 2;

    expect(getMagicSearchCategories(game, "search")).toEqual(["front", "back", "magic"]);

    game = playMagic(game, {
      handInstanceId: "search",
      target: { kind: "master", playerId: "player" },
      searchCategory: "back",
    });

    expect(game.players.player.hand.some((card) => card.instanceId === "back_card")).toBe(true);
    expect(game.players.player.deck.some((card) => card.instanceId === "back_card")).toBe(false);
  });

  it("applies deterministic random effects for level change, plastone, and Din blast", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_028", instanceId: "level_change" }]);
    game.randomSeed = 7;
    game.players.player.stones = 10;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");

    game = playMagic(game, {
      handInstanceId: "level_change",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.level).toBe(2);

    game.players.player.hand = [{ cardId: "card_121", instanceId: "plastone" }];
    game.players.player.stones = 1;
    game.randomSeed = 1;

    game = playMagic(game, {
      handInstanceId: "plastone",
      target: { kind: "master", playerId: "player" },
    });

    expect(game.players.player.stones).toBe(2);

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
  });

  it("applies defensive persistent effects: goddess, dragon shield, scapegoat, and death chain", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_091", instanceId: "goddess" }]);
    game.randomSeed = 7;
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMagic(game, {
      handInstanceId: "goddess",
      target: { kind: "monster", slotKey: "player_front_left" },
    });
    game.currentPlayer = "cpu";
    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.hp).toBe(5);

    game.currentPlayer = "player";
    game.players.player.hand = [{ cardId: "card_089", instanceId: "dragon" }];
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMagic(game, {
      handInstanceId: "dragon",
      target: { kind: "monster", slotKey: "player_front_left" },
    });
    game.currentPlayer = "cpu";
    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.hp).toBe(4);
    expect(game.slots.cpu_front_left.monster?.hp).toBe(4);

    game.currentPlayer = "player";
    game.players.player.hand = [{ cardId: "card_128", instanceId: "scapegoat" }];
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { level: 2, hp: 6, investedStones: 2 });

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

    game.currentPlayer = "player";
    game.players.player.hand = [{ cardId: "card_098", instanceId: "chain" }];
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.player_front_right.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMagic(game, {
      handInstanceId: "chain",
      target: { kind: "monster", slotKey: "cpu_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "player_front_left" },
    });
    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(3);
    expect(game.slots.player_front_left.monster?.hp).toBe(3);
  });

  it("applies action restrictions from command seal, Death Sheep, provoke, stone curse, and dark hole", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_058", instanceId: "seal" }]);
    game.players.player.stones = 2;
    game.slots.cpu_front_left.monster = createActiveMonster("bomuzo", "cpu");

    game = playMagic(game, {
      handInstanceId: "seal",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    game.currentPlayer = "cpu";

    expect(getCommandTargets(game, "cpu_front_left", "storm_bomb")).toEqual([]);

    game = createInitialGame(220);
    game.currentPlayer = "cpu";
    game.players.cpu.stones = 99;
    game.slots.player_front_left.monster = createActiveMonster("card_133", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("bomuzo", "cpu");

    expect(getCommandTargets(game, "cpu_front_left", "storm_bomb")).toEqual([]);

    game = createGameWithPlayerHand([{ cardId: "card_097", instanceId: "provoke" }]);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
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
    expect(getMovableTargets(game, "cpu_front_left")).toEqual([]);

    game = createInitialGame(221);
    game.currentPlayer = "player";
    game.players.player.stones = 1;
    game.slots.player_front_left.monster = createActiveMonster("card_144", "player", { stoneCurse: true });

    expect(getCommandTargets(game, "player_front_left", "ホロウ斬り")).toEqual([]);

    game.players.player.hand = [{ cardId: "card_095", instanceId: "dark_hole" }];
    game.players.player.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMagic(game, {
      handInstanceId: "dark_hole",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    game.currentPlayer = "cpu";
    game = endTurn(game);

    expect(game.slots.cpu_front_left.monster).toBeUndefined();
  });

  it("applies damage and defeat traits: reincarnation, revive, curses, counters, retreat, devotion, grudge, and suspended animation", () => {
    let game = createInitialGame(230);
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("card_035", "cpu", { hp: 1 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.cardId).toBe("card_035");
    expect(game.slots.cpu_front_left.monster?.revivedOnce).toBe(true);
    expect(game.pendingLevelUp).toBeUndefined();

    game = createInitialGame(231);
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("card_067", "cpu", { hp: 1 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.cardId).toBe("card_067");
    expect(game.slots.cpu_front_left.monster?.revivedOnce).toBe(true);

    game = createInitialGame(232);
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("card_099", "cpu", { hp: 1 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.player_front_left.monster?.stoneCurse).toBe(true);

    game = createInitialGame(233);
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("card_100", "cpu", { hp: 1 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.player_front_left.monster?.damageCurse).toBe(true);

    game = createInitialGame(234);
    game.currentPlayer = "cpu";
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("card_102", "player", { level: 2, hp: 5, investedStones: 2 });

    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(3);

    game = createInitialGame(235);
    game.currentPlayer = "cpu";
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("card_080", "player", { hp: 3 });

    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster).toBeUndefined();
    expect(game.slots.player_back_left.monster?.cardId).toBe("card_080");

    game = createInitialGame(236);
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

    game = createInitialGame(237);
    game.currentPlayer = "cpu";
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 6 });
    game.slots.player_front_left.monster = createActiveMonster("card_109", "player", { hp: 6 });

    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(4);

    game = createInitialGame(238);
    game.currentPlayer = "cpu";
    game.slots.cpu_front_left.monster = createActiveMonster("polyspinner", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("card_077", "player");

    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });
    const afterFirstHit = game.slots.player_front_left.monster?.hp;
    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.hp).toBe(afterFirstHit);
  });

  it("discards the oldest cards until the hand has 5 cards at turn end", () => {
    const game = createGameWithPlayerHand([
      { cardId: "takokke", instanceId: "old_1" },
      { cardId: "bomuzo", instanceId: "old_2" },
      { cardId: "polyspinner", instanceId: "old_3" },
      { cardId: "sigma", instanceId: "old_4" },
      { cardId: "beyond", instanceId: "old_5" },
      { cardId: "yanbaru", instanceId: "old_6" },
      { cardId: "morgan", instanceId: "old_7" },
    ]);

    const next = endTurn(game);

    expect(next.players.player.hand.map((card) => card.instanceId)).toEqual([
      "old_3",
      "old_4",
      "old_5",
      "old_6",
      "old_7",
    ]);
    expect(next.players.player.discard.map((card) => card.instanceId)).toEqual(["old_1", "old_2"]);
  });
});

function createGameWithPlayerHand(hand: CardInstance[]): GameState {
  const game = createInitialGame(200);
  game.players.player.hand = hand;
  game.players.player.discard = [];
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
    instanceId: `${owner}_${cardId}_fixture`,
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
