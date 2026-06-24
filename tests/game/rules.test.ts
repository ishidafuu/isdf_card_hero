import { describe, expect, it } from "vitest";
import {
  buildDeck,
  deckTextFromCardIds,
  getAllCardDefs,
  getCardMemberRating,
  getCardDefsByPool,
  getCardDef,
  getCardIconPath,
  getCardPool,
  getDeckSelectionWeight,
  getMonsterDef,
  getSpecialCardDefs,
  parseDeckText,
  summarizeDeckCardIds,
  validateRandomDeck,
} from "../../src/game/cards";
import {
  attackWithCommand,
  canFocusMonster,
  canSummonTo,
  createInitialGame,
  discardHandCard,
  endTurn,
  focusMonster,
  getCommandTargets,
  getCommandHandChoices,
  getMagicHandChoices,
  getMagicSearchCategories,
  getMagicSecondaryTargets,
  getMagicTargets,
  getCurrentMasterActionIds,
  getMasterActionTargets,
  getMovableTargets,
  getMonsterCommands,
  getMonsterDisplayName,
  moveMonster,
  playMagic,
  resolveLevelUp,
  startTurn,
  summonMonster,
  useMasterAction,
  useMasterHpDraw,
} from "../../src/game/rules";
import { appendLog } from "../../src/game/ruleEngine/log";
import type { CardInstance, GameState, MonsterState, PlayerId, SlotKey } from "../../src/game/types";

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
    expect(deck.every((card) => getCardPool(card.cardId) === "normal")).toBe(true);
    expect(categories.front).toBeGreaterThanOrEqual(12);
    expect(categories.back).toBeGreaterThanOrEqual(6);
    expect(categories.magic).toBeGreaterThanOrEqual(6);
    expect(buildDeck("test", 1).map((card) => card.cardId).join(",")).not.toBe(
      buildDeck("test", 2).map((card) => card.cardId).join(","),
    );
  });

  it("imports member ratings and uses them for master-aware random deck weights", () => {
    expect(getCardMemberRating("bomuzo", "black")).toMatchObject({ average: 4.0, votes: 131 });
    expect(getCardMemberRating("bomuzo", "white")).toMatchObject({ average: 3.8, votes: 132 });
    expect(getDeckSelectionWeight("polyspinner", "black")).toBeGreaterThan(getDeckSelectionWeight("takokke", "black"));

    const blackDeck = buildDeck("black_weighted", 20260613, { masterId: "black" });
    const whiteDeck = buildDeck("white_weighted", 20260613, { masterId: "white" });

    expect(validateRandomDeck(blackDeck)).toBe(true);
    expect(validateRandomDeck(whiteDeck)).toBe(true);
    expect(blackDeck.map((card) => card.cardId).join(",")).not.toBe(whiteDeck.map((card) => card.cardId).join(","));
  });

  it("validates editable fixed deck text by card name and card id", () => {
    const randomCardIds = buildDeck("fixed", 321).map((card) => card.cardId);
    const text = `${deckTextFromCardIds(randomCardIds.slice(0, 29))}\n${randomCardIds[29]}`;
    const parsed = parseDeckText(text);
    const summary = summarizeDeckCardIds(parsed.cardIds, parsed.unknownTokens);

    expect(parsed.cardIds).toEqual(randomCardIds);
    expect(parsed.disallowedSpecialTokens).toEqual([]);
    expect(summary.valid).toBe(true);
    expect(summary.total).toBe(30);
    expect(summary.specialViolations).toEqual([]);
  });

  it("reports fixed deck composition and copy limit violations", () => {
    const invalidCardIds = Array.from({ length: 30 }, () => "card_001");
    const summary = summarizeDeckCardIds(invalidCardIds);

    expect(summary.valid).toBe(false);
    expect(summary.duplicateViolations).toEqual([{ cardId: "card_001", count: 30 }]);
    expect(summary.errors).toContain("同名カードは3枚までです");
  });

  it("imports the normal and special original card pools with temporary icons", () => {
    const cards = getAllCardDefs();
    const specialCards = getSpecialCardDefs();

    expect(cards).toHaveLength(126);
    expect(getCardDefsByPool("all")).toHaveLength(150);
    expect(specialCards).toHaveLength(24);
    expect(cards.every((card) => getCardPool(card) === "normal")).toBe(true);
    expect(specialCards.every((card) => getCardPool(card) === "special")).toBe(true);
    expect(specialCards.every((card) => card.type === "monster" && card.evolvesFrom && card.evolvesFrom.length > 0)).toBe(true);
    expect(cards.filter((card) => card.type === "monster" && card.role === "front")).toHaveLength(46);
    expect(cards.filter((card) => card.type === "monster" && card.role === "back")).toHaveLength(26);
    expect(cards.filter((card) => card.type === "magic")).toHaveLength(54);
    expect(getCardDefsByPool("all").every((card) => card.icon?.startsWith("/card-icons/co"))).toBe(true);
    expect(getCardIconPath("takokke")).toBe("/card-icons/co004.jpg");
    expect(getCardIconPath("card_006")).toBe("/card-icons/co006.jpg");
  });

  it("keeps command ids unique within each monster level", () => {
    const duplicateCommandIds: string[] = [];

    for (const card of getCardDefsByPool("all")) {
      if (card.type !== "monster") {
        continue;
      }
      for (const level of card.levels) {
        const seen = new Set<string>();
        for (const command of level.commands) {
          if (seen.has(command.id)) {
            duplicateCommandIds.push(`${card.name} Lv${level.level} ${command.id}`);
          }
          seen.add(command.id);
        }
      }
    }

    expect(duplicateCommandIds).toEqual([]);
  });

  it("requires an explicit special deck opt-in for super cards", () => {
    const base = buildDeck("special", 555).map((card) => card.cardId);
    const replaceIndex = base.findIndex((_, index) =>
      summarizeDeckCardIds(base.map((cardId, candidateIndex) => (candidateIndex === index ? "card_006" : cardId)), [], { allowSpecial: true }).valid,
    );
    expect(replaceIndex).toBeGreaterThanOrEqual(0);
    const withSuper = base.map((cardId, index) => (index === replaceIndex ? "card_006" : cardId));
    const parsedOff = parseDeckText(deckTextFromCardIds(withSuper));
    const summaryOff = summarizeDeckCardIds(parsedOff.cardIds, parsedOff.unknownTokens, {
      disallowedSpecialTokens: parsedOff.disallowedSpecialTokens,
    });
    const parsedOn = parseDeckText(deckTextFromCardIds(withSuper), { allowSpecial: true });
    const summaryOn = summarizeDeckCardIds(parsedOn.cardIds, parsedOn.unknownTokens, { allowSpecial: true });

    expect(parsedOff.disallowedSpecialTokens).toEqual(["ボムキング"]);
    expect(summaryOff.valid).toBe(false);
    expect(summaryOff.specialViolations).toEqual(["ボムキング"]);
    expect(parsedOn.cardIds).toContain("card_006");
    expect(summaryOn.categories.special).toBe(1);
    expect(summaryOn.valid).toBe(true);
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
    expect(game.firstPlayer).toBe("player");
    expect(game.players.player.stones).toBe(3);
    expect(game.players.player.hand).toHaveLength(5);
    expect(game.players.player.deck).toHaveLength(25);

    const cpuTurn = endTurn(game);
    expect(cpuTurn.currentPlayer).toBe("cpu");
    expect(cpuTurn.players.cpu.stones).toBe(3);
    expect(cpuTurn.players.cpu.hand).toHaveLength(6);
    expect(cpuTurn.players.cpu.deck).toHaveLength(24);
  });

  it("skips the CPU opening draw when CPU is configured as the first player", () => {
    const game = createInitialGame(100, { firstPlayer: "cpu" });

    expect(game.currentPlayer).toBe("cpu");
    expect(game.firstPlayer).toBe("cpu");
    expect(game.turnNumber).toBe(1);
    expect(game.players.cpu.stones).toBe(3);
    expect(game.players.cpu.hand).toHaveLength(5);
    expect(game.players.cpu.deck).toHaveLength(25);

    const playerTurn = endTurn(game);
    expect(playerTurn.currentPlayer).toBe("player");
    expect(playerTurn.turnNumber).toBe(1);
    expect(playerTurn.players.player.stones).toBe(3);
    expect(playerTurn.players.player.hand).toHaveLength(6);
    expect(playerTurn.players.player.deck).toHaveLength(24);
  });

  it("starts a battle with fixed player and CPU deck contents", () => {
    const playerDeckCardIds = buildDeck("player_fixed", 10).map((card) => card.cardId);
    const cpuDeckCardIds = buildDeck("cpu_fixed", 20).map((card) => card.cardId);
    const game = createInitialGame(200, { playerDeckCardIds, cpuDeckCardIds });
    const playerBattleCards = [...game.players.player.hand, ...game.players.player.deck].map((card) => card.cardId).sort();
    const cpuBattleCards = [...game.players.cpu.hand, ...game.players.cpu.deck].map((card) => card.cardId).sort();

    expect(playerBattleCards).toEqual([...playerDeckCardIds].sort());
    expect(cpuBattleCards).toEqual([...cpuDeckCardIds].sort());
  });

  it("rejects invalid fixed decks at battle creation", () => {
    expect(() => createInitialGame(200, { playerDeckCardIds: Array.from({ length: 30 }, () => "card_001") }))
      .toThrow("プレイヤーの固定デッキが不正です");
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
    expect(next.deckoutOccurred).toBe(true);
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

  it("hides CPU drawn card names in display and event logs", () => {
    const game = createInitialGame(117, { trackEventLog: true });
    game.players.cpu.deck = [{ cardId: "takokke", instanceId: "cpu_secret_draw" }];

    const next = startTurn(game, "cpu");
    const eventLog = next.eventLog ?? [];

    expect(next.players.cpu.hand.map((card) => card.instanceId)).toContain("cpu_secret_draw");
    expect(next.log).toContain("CPUはカードを引いた");
    expect(eventLog).toContain("CPUはカードを引いた");
    expect(next.log.join("\n")).not.toContain("タコッケー");
    expect(eventLog.join("\n")).not.toContain("タコッケー");
  });

  it("keeps extended event history while capping the display log", () => {
    const game = createInitialGame(118, { trackEventLog: true });
    const initialEventLogLength = game.eventLog?.length ?? 0;

    for (let index = 0; index < 130; index += 1) {
      appendLog(game, `event ${index}`);
    }

    expect(game.log).toHaveLength(120);
    expect(game.log[0]).toBe("event 10");
    expect(game.eventLog).toHaveLength(initialEventLogLength + 130);
    expect(game.eventLog?.[0]).toBe("バトル開始");
    expect(game.eventLog?.at(-1)).toBe("event 129");
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

  it("prevents movement swaps between allies with different remaining action state", () => {
    const game = createInitialGame(124);
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.player_back_left.monster = createActiveMonster("yanbaru", "player", {
      actionCount: 1,
      actionLimit: 1,
    });
    game.slots.player_front_right.monster = createActiveMonster("sigma", "player");

    const targets = getMovableTargets(game, "player_front_left");

    expect(targets).not.toContain("player_back_left");
    expect(targets).toContain("player_front_right");
    expect(() => moveMonster(game, "player_front_left", "player_back_left")).toThrow(
      "行動状態が異なる味方とは入れ替えられません",
    );

    const swapped = moveMonster(game, "player_front_left", "player_front_right");

    expect(swapped.slots.player_front_right.monster?.cardId).toBe("takokke");
    expect(swapped.slots.player_front_left.monster?.cardId).toBe("sigma");
  });

  it("spends both allies actions when movement swaps their slots", () => {
    const game = createInitialGame(125);
    game.slots.player_front_left.monster = createActiveMonster("polyspinner", "player");
    game.slots.player_front_right.monster = createActiveMonster("takokke", "player");

    const swapped = moveMonster(game, "player_front_left", "player_front_right");

    expect(swapped.slots.player_front_right.monster).toMatchObject({
      cardId: "polyspinner",
      actionCount: 2,
      actionLimit: 2,
    });
    expect(swapped.slots.player_front_left.monster).toMatchObject({
      cardId: "takokke",
      actionCount: 1,
      actionLimit: 1,
    });
  });

  it("focuses a moved two-action monster if it still has an action at turn end", () => {
    let game = createInitialGame(126);
    game.slots.player_front_left.monster = createActiveMonster("polyspinner", "player");

    game = moveMonster(game, "player_front_left", "player_back_left");
    expect(game.slots.player_back_left.monster).toMatchObject({
      cardId: "polyspinner",
      actionCount: 1,
      actionLimit: 2,
      focused: false,
    });

    const next = endTurn(game);

    expect(next.slots.player_back_left.monster).toMatchObject({
      cardId: "polyspinner",
      focused: true,
    });
    expect(next.log.some((entry) => entry.includes("ポリスピナー") && entry.includes("気合いだめした"))).toBe(true);
  });

  it("keeps focus when an active back-row monster auto-advances to an empty front row", () => {
    const game = createInitialGame(127);
    game.slots.player_back_left.monster = createActiveMonster("polyspinner", "player", {
      focused: true,
    });

    const next = startTurn(game, "player");

    expect(next.slots.player_back_left.monster).toBeUndefined();
    expect(next.slots.player_front_left.monster).toMatchObject({
      cardId: "polyspinner",
      focused: true,
    });
    expect(next.log.some((entry) => entry.includes("ポリスピナー") && entry.includes("前衛へ自動移動した"))).toBe(true);
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

  it("keeps the level-up choice pending when resolving a two-level chance one level at a time", () => {
    const game = createInitialGame(107);
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

    const firstStep = resolveLevelUp(pending, 1);
    const afterFirst = firstStep.slots.player_front_left.monster;
    expect(afterFirst?.level).toBe(2);
    expect(afterFirst?.investedStones).toBe(2);
    expect(firstStep.players.player.stones).toBe(1);
    expect(firstStep.pendingLevelUp?.maxLevels).toBe(1);

    const secondStep = resolveLevelUp(firstStep, 1);
    const afterSecond = secondStep.slots.player_front_left.monster;
    expect(afterSecond?.level).toBe(3);
    expect(afterSecond?.investedStones).toBe(3);
    expect(secondStep.players.player.stones).toBe(0);
    expect(secondStep.pendingLevelUp).toBeUndefined();
  });

  it("uses a matching super card from hand when resolving level up", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_006", instanceId: "bombking" }]);
    game.players.player.stones = 1;
    game.slots.player_front_left.monster = createActiveMonster("bomuzo", "player", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 3 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "self_bomb",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.pendingLevelUp?.maxLevels).toBe(1);
    expect(game.pendingLevelUp?.superOptions).toEqual([{ handInstanceId: "bombking", cardId: "card_006" }]);
    expect(game.slots.player_front_left.monster?.hp).toBe(2);

    game = resolveLevelUp(game, 1, "bombking");

    const superMonster = game.slots.player_front_left.monster;
    expect(superMonster?.cardId).toBe("card_006");
    expect(superMonster?.level).toBe(3);
    expect(superMonster?.hp).toBe(4);
    expect(superMonster?.investedStones).toBe(3);
    expect(game.players.player.hand).toEqual([]);
    expect(game.players.player.discard.some((card) => card.cardId === "bomuzo")).toBe(true);
  });

  it("does not allow super cards to be summoned directly", () => {
    const game = createGameWithPlayerHand([{ cardId: "card_006", instanceId: "bombking" }]);
    game.players.player.stones = 1;

    expect(canSummonTo(game, "bombking", "player_front_left")).toBe(false);
    expect(() => summonMonster(game, "bombking", "player_front_left")).toThrow("スーパーカード");
  });

  it("applies representative super command effects", () => {
    let game = createInitialGame(108);
    game.players.player.stones = 10;
    game.players.cpu.stones = 10;
    game.slots.player_front_left.monster = createActiveMonster("card_140", "player");
    game.slots.player_back_left.monster = createActiveMonster("card_141", "player");
    game.slots.player_front_right.monster = createActiveMonster("card_131", "player");
    game.slots.player_back_right.monster = createActiveMonster("card_138", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.cpu_back_left.monster = createActiveMonster("sigma", "cpu", {
      level: 2,
      investedStones: 2,
    });
    game.slots.cpu_front_right.monster = createActiveMonster("card_003", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "コールドブレス",
      target: { kind: "master", playerId: "cpu" },
    });
    expect(game.players.cpu.masterFrozen).toBe(true);
    game.currentPlayer = "cpu";
    expect(getMasterActionTargets(game, "master_attack")).toEqual([]);
    game.currentPlayer = "player";

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "ジャックポット",
      target: { kind: "monster", slotKey: "player_back_left" },
    });
    expect(game.players.player.stones).toBe(11);

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_right",
      commandId: "マナ変化",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    expect(game.slots.cpu_front_left.monster?.cardId).toBe("card_002");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_right",
      commandId: "レベルムーブ",
      target: { kind: "monster", slotKey: "cpu_back_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_right" },
    });
    expect(game.slots.cpu_back_left.monster?.level).toBe(1);
    expect(game.slots.cpu_front_right.monster?.level).toBe(2);
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

  it("uses only berserk power and earth anger as black master specialty actions", () => {
    let game = createInitialGame(111, { masterIds: { player: "black" } });
    game.players.player.stones = 6;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 5 });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 5 });
    game.slots.cpu_back_left.monster = createActiveMonster("yanbaru", "cpu", {
      status: "prepared",
      hp: 3,
    });

    expect(getCurrentMasterActionIds(game)).toEqual(["master_attack", "berserk_power", "earth_anger"]);
    expect(getMasterActionTargets(game, "wake_up")).toEqual([]);
    expect(getMasterActionTargets(game, "shield")).toEqual([]);
    expect(getMasterActionTargets(game, "berserk_power")).toEqual([
      { kind: "monster", slotKey: "cpu_front_left" },
      { kind: "monster", slotKey: "player_front_left" },
    ]);
    expect(getMasterActionTargets(game, "earth_anger")).toEqual([{ kind: "master", playerId: "player" }]);

    game = useMasterAction(game, "berserk_power", { kind: "monster", slotKey: "player_front_left" });
    expect(game.players.player.stones).toBe(3);
    expect(game.slots.player_front_left.monster?.berserkPower).toBe(true);

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.hp).toBe(2);
    expect(game.slots.player_front_left.monster?.hp).toBe(4);
    expect(game.slots.player_front_left.monster?.berserkPower).toBe(false);
  });

  it("damages every active monster but not prepared cards with black master earth anger", () => {
    const game = createInitialGame(112, { masterIds: { player: "black" } });
    game.players.player.stones = 6;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 5 });
    game.slots.player_back_left.monster = createActiveMonster("yanbaru", "player", {
      status: "prepared",
      hp: 3,
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 5 });
    game.slots.cpu_back_left.monster = createActiveMonster("yanbaru", "cpu", { hp: 4 });

    const next = useMasterAction(game, "earth_anger", { kind: "master", playerId: "player" });

    expect(next.players.player.stones).toBe(0);
    expect(next.slots.player_front_left.monster?.hp).toBe(2);
    expect(next.slots.player_back_left.monster?.hp).toBe(3);
    expect(next.slots.cpu_front_left.monster?.hp).toBe(2);
    expect(next.slots.cpu_back_left.monster?.hp).toBe(1);
  });

  it("exchanges white and black master action sets", () => {
    let game = createInitialGame(113, { masterIds: { player: "white", cpu: "black" } });
    game.players.player.hand = [{ cardId: "card_124", instanceId: "exchange" }];
    game.players.player.stones = magicCost("card_124");

    game = playMagic(game, {
      handInstanceId: "exchange",
      target: { kind: "master", playerId: "player" },
    });

    expect(getCurrentMasterActionIds(game)).toEqual(["master_attack", "berserk_power", "earth_anger"]);
    game.currentPlayer = "cpu";
    expect(getCurrentMasterActionIds(game)).toEqual(["master_attack", "wake_up", "shield"]);

    game.currentPlayer = "player";
    game = endTurn(game);
    expect(game.currentPlayer).toBe("cpu");
    expect(getCurrentMasterActionIds(game)).toEqual(["master_attack", "wake_up", "shield"]);

    game = endTurn(game);
    expect(game.currentPlayer).toBe("player");
    expect(getCurrentMasterActionIds(game)).toEqual(["master_attack", "wake_up", "shield"]);
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

  it("keeps focus when shield alone prevents all incoming damage", () => {
    let game = createInitialGame(118);
    game.slots.player_front_left.monster = createActiveMonster("card_051", "player");
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu", {
      focused: true,
      shielded: true,
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "スパイクボール",
      target: { kind: "monster", slotKey: "cpu_back_left" },
    });

    expect(game.slots.cpu_back_left.monster?.hp).toBe(getMonsterDef("takokke").levels[0].maxHp);
    expect(game.slots.cpu_back_left.monster?.shielded).toBe(true);
    expect(game.slots.cpu_back_left.monster?.focused).toBe(true);
    expect(game.log.some((entry) => entry.includes("気合いで1ダメージ軽減した"))).toBe(false);
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

  it("can miss with Kentaurus Gemini Lance", () => {
    const game = createInitialGame(130);
    game.randomSeed = 0;
    game.slots.player_front_left.monster = createActiveMonster("card_039", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "ジェミニランス",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(next.slots.cpu_front_left.monster?.hp).toBe(5);
    expect(next.log.some((entry) => entry.includes("ジェミニランスは空振りした"))).toBe(true);
  });

  it("uses Raon and Leon combined power only for Drill Break against the master", () => {
    const game = createInitialGame(131);
    game.slots.player_front_right.monster = createActiveMonster("card_107", "player", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });
    game.slots.player_front_left.monster = createActiveMonster("card_108", "player", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });
    game.slots.cpu_front_right.monster = createActiveMonster("takokke", "cpu");

    expect(getCommandTargets(game, "player_front_right", "ドリルブレイク")).toEqual([
      { kind: "master", playerId: "cpu" },
    ]);

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_front_right",
      commandId: "ドリルブレイク",
      target: { kind: "master", playerId: "cpu" },
    });

    expect(next.players.cpu.masterHp).toBe(6);
    expect(next.players.cpu.stones).toBe(4);
    expect(next.slots.player_front_right.monster?.actionCount).toBe(1);
    expect(next.slots.player_front_left.monster?.actionCount).toBe(1);
    expect(getCommandTargets(next, "player_front_left", "ドリルブレイク")).toEqual([]);
  });

  it("requires the Drill Break partner to have an action available", () => {
    const game = createInitialGame(132);
    game.slots.player_front_right.monster = createActiveMonster("card_107", "player", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });
    game.slots.player_front_left.monster = createActiveMonster("card_108", "player", {
      level: 2,
      hp: 5,
      investedStones: 2,
      actionCount: 1,
    });

    expect(getCommandTargets(game, "player_front_right", "ドリルブレイク")).toEqual([]);
  });

  it("clears the Drill Break partner focus when spending its action", () => {
    const game = createInitialGame(133);
    game.slots.player_front_right.monster = createActiveMonster("card_107", "player", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });
    game.slots.player_front_left.monster = createActiveMonster("card_108", "player", {
      level: 2,
      hp: 5,
      investedStones: 2,
      focused: true,
    });

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_front_right",
      commandId: "ドリルブレイク",
      target: { kind: "master", playerId: "cpu" },
    });

    expect(next.slots.player_front_left.monster?.actionCount).toBe(1);
    expect(next.slots.player_front_left.monster?.focused).toBe(false);
  });

  it("moves Gungnir forward before sweep attacking", () => {
    const game = createInitialGame(132);
    game.slots.player_back_left.monster = createActiveMonster("card_076", "player", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      instanceId: "front_ally",
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    expect(getCommandTargets(game, "player_back_left", "なぎ払い")).toContainEqual({
      kind: "monster",
      slotKey: "cpu_front_left",
    });

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "なぎ払い",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(next.slots.player_front_left.monster?.cardId).toBe("card_076");
    expect(next.slots.player_back_left.monster?.instanceId).toBe("front_ally");
    expect(next.slots.cpu_front_left.monster?.hp).toBe(3);
  });

  it("turns Arshu & Ro Ro into Arshu after the once-only Ro Ro attack", () => {
    let game = createInitialGame(133);
    game.slots.player_back_left.monster = createActiveMonster("card_045", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    const beforeArshu = game.slots.player_back_left.monster;
    if (!beforeArshu) {
      throw new Error("Arshu should be on the field");
    }

    expect(getMonsterDisplayName(beforeArshu)).toBe("アーシュ＆ロロ");
    expect(getMonsterCommands(beforeArshu).map((command) => command.id)).toEqual([
      "attack",
      "飛竜ロロ",
    ]);

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "飛竜ロロ",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    const arshu = game.slots.player_back_left.monster;
    if (!arshu) {
      throw new Error("Arshu should remain on the field");
    }
    arshu.actionCount = 0;

    expect(getMonsterDisplayName(arshu)).toBe("アーシュ");
    expect(getMonsterCommands(arshu).map((command) => command.id)).toEqual(["attack"]);
    expect(getCommandTargets(game, "player_back_left", "飛竜ロロ")).toEqual([]);
    expect(game.log.at(-1)).toContain("飛び去り");
  });

  it("keeps Arshu without Ro Ro after leveling up from the once-only attack", () => {
    let game = createInitialGame(134);
    game.slots.player_back_left.monster = createActiveMonster("card_045", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 2 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "飛竜ロロ",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(game.pendingLevelUp?.maxLevels).toBe(1);
    game = resolveLevelUp(game, 1);

    const arshu = game.slots.player_back_left.monster;
    if (!arshu) {
      throw new Error("Arshu should remain on the field");
    }
    arshu.actionCount = 0;

    expect(arshu.level).toBe(2);
    expect(arshu.hp).toBe(5);
    expect(arshu.investedStones).toBe(2);
    expect(getMonsterDisplayName(arshu)).toBe("アーシュ");
    expect(getMonsterCommands(arshu).map((command) => `${command.id}:${command.power}`)).toEqual(["attack:3"]);
    expect(getCommandTargets(game, "player_back_left", "飛竜ロロ")).toEqual([]);
  });

  it("limits special attack targets from card text", () => {
    let game = createInitialGame(135);
    game.slots.player_front_left.monster = createActiveMonster("card_078", "player", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });
    game.slots.player_back_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_back_right.monster = createActiveMonster("takokke", "cpu");
    game.slots.cpu_front_right.monster = createActiveMonster("takokke", "cpu");

    expect(getCommandTargets(game, "player_front_left", "爆裂キノコ")).toContainEqual({
      kind: "monster",
      slotKey: "cpu_back_right",
    });
    expect(getCommandTargets(game, "player_front_left", "爆裂キノコ")).not.toContainEqual({
      kind: "monster",
      slotKey: "player_back_left",
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "爆裂キノコ",
      target: { kind: "monster", slotKey: "cpu_back_right" },
    });

    expect(game.slots.cpu_back_right.monster?.hp).toBe(2);
    expect(game.slots.cpu_front_right.monster?.hp).toBe(3);

    game = createInitialGame(135);
    game.players.player.stones = 1;
    game.slots.player_front_left.monster = createActiveMonster("card_082", "player");
    game.slots.player_front_right.monster = createActiveMonster("takokke", "player", { level: 2, investedStones: 2 });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { level: 2, investedStones: 2 });

    expect(getCommandTargets(game, "player_front_left", "真名之書")).toEqual([
      { kind: "monster", slotKey: "cpu_front_left" },
    ]);
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
          let attackerSlotKey: SlotKey = "player_back_right";
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

          if (command.name === "ドリルブレイク" && card.id === "card_107") {
            attackerSlotKey = "player_front_right";
            game.slots.player_front_right.monster = createActiveMonster(card.id, "player", {
              hp: level.maxHp,
              level: level.level,
              investedStones: level.level,
            });
            game.slots.player_front_left.monster = createActiveMonster("card_108", "player", {
              level: level.level,
              investedStones: level.level,
            });
            delete game.slots.player_back_right.monster;
          }
          if (command.name === "ドリルブレイク" && card.id === "card_108") {
            attackerSlotKey = "player_front_left";
            game.slots.player_front_left.monster = createActiveMonster(card.id, "player", {
              hp: level.maxHp,
              level: level.level,
              investedStones: level.level,
            });
            game.slots.player_front_right.monster = createActiveMonster("card_107", "player", {
              level: level.level,
              investedStones: level.level,
            });
            delete game.slots.player_back_right.monster;
          }

          expect(getCommandTargets(game, attackerSlotKey, command.id).length, `${card.name} Lv${level.level} ${command.name}`).toBeGreaterThan(0);
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
      { cardId: "card_006", instanceId: "super_card" },
    ];
    game.players.player.stones = 2;

    expect(getMagicSearchCategories(game, "search")).toEqual(["front", "back", "magic", "special"]);

    game = playMagic(game, {
      handInstanceId: "search",
      target: { kind: "master", playerId: "player" },
      searchCategory: "special",
    });

    expect(game.players.player.hand.some((card) => card.instanceId === "super_card")).toBe(true);
    expect(game.players.player.deck.some((card) => card.instanceId === "super_card")).toBe(false);
  });

  it("honors selected secondary targets and hand choices instead of defaulting to the first candidate", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_030", instanceId: "double_shield" }]);
    game.players.player.stones = 3;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.cpu_front_right.monster = createActiveMonster("beyond", "cpu");

    game = playMagic(game, {
      handInstanceId: "double_shield",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_right" },
    });

    expect(game.slots.player_front_left.monster?.shielded).toBe(true);
    expect(game.slots.cpu_front_right.monster?.shielded).toBe(true);
    expect(game.slots.cpu_front_left.monster?.shielded).toBe(false);

    game = createInitialGame(240);
    game.players.player.hand = [
      { cardId: "yanbaru", instanceId: "keep_yanbaru" },
      { cardId: "takokke", instanceId: "chosen_takokke" },
    ];
    game.players.player.discard = [];
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("card_134", "player", { level: 2, investedStones: 2 });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "ソウルスイッチ",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryHandInstanceId: "chosen_takokke",
    });

    expect(game.slots.player_front_left.monster?.cardId).toBe("takokke");
    expect(game.players.player.hand.map((card) => card.instanceId)).toEqual(["keep_yanbaru"]);
    expect(game.players.player.discard.some((card) => card.cardId === "card_134")).toBe(true);
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
    expect(game.log.some((entry) => entry.includes("ランダム結果: レベルチェンジ"))).toBe(true);

    game.players.player.hand = [{ cardId: "card_121", instanceId: "plastone" }];
    game.players.player.stones = 1;
    game.randomSeed = 1;

    game = playMagic(game, {
      handInstanceId: "plastone",
      target: { kind: "master", playerId: "player" },
    });

    expect(game.players.player.stones).toBe(2);
    expect(game.log.some((entry) => entry.includes("ランダム結果: プラストーン -> ストーン2個"))).toBe(true);

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

  it("keeps shield and power effects when cleansing a field", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_087", instanceId: "cleanse" }]);
    game.players.player.stones = 99;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      shielded: true,
      halfShielded: true,
      oneShotShield: true,
      dragonShield: true,
      powerUp: true,
      powerModifier: 1,
      powerOverride: 2,
      berserkPower: true,
      cannotMove: true,
      commandSealed: true,
      dodgeChance: true,
      scapegoat: true,
      stoneCostMultiplier: 2,
      darkHoleSlotKey: "player_front_left",
      stoneCurse: true,
      damageCurse: true,
    });

    game = playMagic(game, {
      handInstanceId: "cleanse",
      target: { kind: "master", playerId: "player" },
    });

    const monster = game.slots.player_front_left.monster;
    expect(monster?.shielded).toBe(true);
    expect(monster?.halfShielded).toBe(true);
    expect(monster?.oneShotShield).toBe(true);
    expect(monster?.dragonShield).toBe(true);
    expect(monster?.powerUp).toBe(true);
    expect(monster?.powerModifier).toBe(1);
    expect(monster?.powerOverride).toBe(2);
    expect(monster?.berserkPower).toBe(true);
    expect(monster?.cannotMove).toBe(false);
    expect(monster?.commandSealed).toBe(false);
    expect(monster?.dodgeChance).toBe(false);
    expect(monster?.scapegoat).toBe(false);
    expect(monster?.stoneCostMultiplier).toBeUndefined();
    expect(monster?.darkHoleSlotKey).toBeUndefined();
    expect(monster?.stoneCurse).toBe(false);
    expect(monster?.damageCurse).toBe(false);
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
    expect(game.pendingLevelUp?.maxLevels).toBe(1);

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
    expect(game.pendingLevelUp?.maxLevels).toBe(1);

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
    expect(next.log.some((entry) => entry.includes("カード溢れ"))).toBe(true);
  });

  it("lets the current player explicitly discard a hand card only above the hand limit", () => {
    const game = createGameWithPlayerHand([
      { cardId: "takokke", instanceId: "keep" },
      { cardId: "bomuzo", instanceId: "keep_2" },
      { cardId: "polyspinner", instanceId: "keep_3" },
      { cardId: "beyond", instanceId: "keep_4" },
      { cardId: "yanbaru", instanceId: "keep_5" },
      { cardId: "sigma", instanceId: "discard" },
    ]);

    const next = discardHandCard(game, "discard");

    expect(next.players.player.hand.map((card) => card.instanceId)).toEqual(["keep", "keep_2", "keep_3", "keep_4", "keep_5"]);
    expect(next.players.player.discard.map((card) => card.instanceId)).toEqual(["discard"]);
    expect(next.log.at(-1)).toContain("手札から捨てた");

    expect(() => discardHandCard(next, "keep")).toThrow("手札上限を超えている時だけ捨てられます");
  });

  it("copies a selected enemy card identity with illusion mirror while keeping current HP", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_148", instanceId: "mirror" }]);
    game.players.player.stones = magicCost("card_148");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 2 });
    game.slots.cpu_front_left.monster = createActiveMonster("polyspinner", "cpu", {
      hp: 4,
      level: 2,
      investedStones: 2,
    });

    game = playMagic(game, {
      handInstanceId: "mirror",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_left" },
    });

    const copied = game.slots.player_front_left.monster;
    expect(copied?.cardId).toBe("polyspinner");
    expect(copied?.level).toBe(2);
    expect(copied?.hp).toBe(2);
    expect(copied?.actionLimit).toBe(2);
    expect(copied?.revivedOnce).toBe(false);
    expect(copied?.usedCommandIds).toBeUndefined();
  });

  it("returns a prepared monster to the bottom of the owner's deck with invested stones", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_122", instanceId: "return" }]);
    game.players.player.stones = magicCost("card_122");
    game.players.player.deck = [];
    game.slots.player_back_left.monster = createActiveMonster("takokke", "player", {
      status: "prepared",
      investedStones: 2,
    });

    game = playMagic(game, {
      handInstanceId: "return",
      target: { kind: "monster", slotKey: "player_back_left" },
    });

    expect(game.slots.player_back_left.monster).toBeUndefined();
    expect(game.players.player.stones).toBe(2);
    expect(game.players.player.deck.at(-1)).toEqual({
      cardId: "takokke",
      instanceId: "player_takokke_fixture",
    });
  });

  it("uses glass shield as a one-hit half shield and clears it after damage", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_055", instanceId: "glass" }]);
    game.players.player.stones = magicCost("card_055");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    game = playMagic(game, {
      handInstanceId: "glass",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.halfShielded).toBe(true);
    expect(game.slots.player_front_left.monster?.oneShotShield).toBe(true);

    game.currentPlayer = "cpu";
    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster?.hp).toBe(getMonsterDef("takokke").levels[0].maxHp - 1);
    expect(game.slots.player_front_left.monster?.halfShielded).toBe(false);
    expect(game.slots.player_front_left.monster?.oneShotShield).toBe(false);
  });

  it("rotates each player's monsters clockwise across front-left, front-right, back-right, and back-left", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_093", instanceId: "rotation" }]);
    game.players.player.stones = magicCost("card_093");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.player_front_right.monster = createActiveMonster("sigma", "player");
    game.slots.player_back_left.monster = createActiveMonster("yanbaru", "player");
    game.slots.player_back_right.monster = createActiveMonster("morgan", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("card_001", "cpu");
    game.slots.cpu_front_right.monster = createActiveMonster("card_002", "cpu");
    game.slots.cpu_back_left.monster = createActiveMonster("card_003", "cpu");
    game.slots.cpu_back_right.monster = createActiveMonster("card_007", "cpu");

    game = playMagic(game, {
      handInstanceId: "rotation",
      target: { kind: "master", playerId: "player" },
    });

    expect(game.slots.player_front_left.monster?.cardId).toBe("yanbaru");
    expect(game.slots.player_front_right.monster?.cardId).toBe("takokke");
    expect(game.slots.player_back_left.monster?.cardId).toBe("morgan");
    expect(game.slots.player_back_right.monster?.cardId).toBe("sigma");
    expect(game.slots.cpu_front_left.monster?.cardId).toBe("card_003");
    expect(game.slots.cpu_front_right.monster?.cardId).toBe("card_001");
    expect(game.slots.cpu_back_left.monster?.cardId).toBe("card_007");
    expect(game.slots.cpu_back_right.monster?.cardId).toBe("card_002");
  });

  it("rotates each player's monsters counterclockwise across front-left, back-left, back-right, and front-right", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_093", instanceId: "rotation" }]);
    game.players.player.stones = magicCost("card_093");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.player_front_right.monster = createActiveMonster("sigma", "player");
    game.slots.player_back_left.monster = createActiveMonster("yanbaru", "player");
    game.slots.player_back_right.monster = createActiveMonster("morgan", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("card_001", "cpu");
    game.slots.cpu_front_right.monster = createActiveMonster("card_002", "cpu");
    game.slots.cpu_back_left.monster = createActiveMonster("card_003", "cpu");
    game.slots.cpu_back_right.monster = createActiveMonster("card_007", "cpu");

    game = playMagic(game, {
      handInstanceId: "rotation",
      target: { kind: "master", playerId: "player" },
      rotationDirection: "counterclockwise",
    });

    expect(game.slots.player_front_left.monster?.cardId).toBe("sigma");
    expect(game.slots.player_front_right.monster?.cardId).toBe("morgan");
    expect(game.slots.player_back_left.monster?.cardId).toBe("takokke");
    expect(game.slots.player_back_right.monster?.cardId).toBe("yanbaru");
    expect(game.slots.cpu_front_left.monster?.cardId).toBe("card_002");
    expect(game.slots.cpu_front_right.monster?.cardId).toBe("card_007");
    expect(game.slots.cpu_back_left.monster?.cardId).toBe("card_001");
    expect(game.slots.cpu_back_right.monster?.cardId).toBe("card_003");
  });

  it("warps the selected same-side secondary target instead of a fallback monster", () => {
    let game = createInitialGame(240);
    game.players.player.stones = 3;
    game.slots.player_back_left.monster = createActiveMonster("card_085", "player");
    game.slots.player_front_right.monster = createActiveMonster("takokke", "player");
    game.slots.player_back_right.monster = createActiveMonster("sigma", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("yanbaru", "cpu");

    game = attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "ワープ",
      target: { kind: "monster", slotKey: "player_front_right" },
      secondaryTarget: { kind: "monster", slotKey: "player_back_right" },
    });

    expect(game.slots.player_front_right.monster?.cardId).toBe("sigma");
    expect(game.slots.player_back_right.monster?.cardId).toBe("takokke");
    expect(game.slots.cpu_front_left.monster?.cardId).toBe("yanbaru");
  });
});

function createGameWithPlayerHand(hand: CardInstance[]): GameState {
  const game = createInitialGame(200);
  game.players.player.hand = hand;
  game.players.player.discard = [];
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
