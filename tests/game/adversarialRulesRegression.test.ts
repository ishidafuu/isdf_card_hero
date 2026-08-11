import { describe, expect, it } from "vitest";
import { getCardDef, getMonsterDef } from "../../src/game/cards";
import {
  attackWithCommand,
  canFocusMonster,
  createInitialGame,
  endTurn,
  getCommandTargets,
  getMagicTargets,
  getMovableTargets,
  moveMonster,
  playMagic,
  resolveLevelUp,
} from "../../src/game/rules";
import type { CardInstance, GameState, MonsterState, PlayerId } from "../../src/game/types";

describe("adversarial rules regressions", () => {
  it("rejects direct movement of a bound monster without mutating the caller state", () => {
    const game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { cannotMove: true });
    const before = JSON.stringify(game);

    expect(() => moveMonster(game, "player_front_left", "player_back_left"))
      .toThrow("このモンスターは移動できません");
    expect(JSON.stringify(game)).toBe(before);
  });

  it("rejects injected magic secondary targets and optional selections atomically", () => {
    const provokeGame = createGameWithPlayerHand([{ cardId: "card_097", instanceId: "provoke" }]);
    provokeGame.players.player.stones = magicCost("card_097");
    provokeGame.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    provokeGame.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    provokeGame.slots.cpu_front_right.monster = createActiveMonster("takokke", "cpu");
    expectAtomicThrow(provokeGame, () => playMagic(provokeGame, {
      handInstanceId: "provoke",
      target: { kind: "monster", slotKey: "cpu_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_right" },
    }), "マジックの二次対象が不正です");

    const shiftGame = createGameWithPlayerHand([
      { cardId: "card_065", instanceId: "shift" },
      { cardId: "takokke", instanceId: "valid_monster" },
    ]);
    shiftGame.players.player.stones = magicCost("card_065");
    shiftGame.slots.player_front_left.monster = createActiveMonster("sigma", "player");
    expectAtomicThrow(shiftGame, () => playMagic(shiftGame, {
      handInstanceId: "shift",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryHandInstanceId: "missing_monster",
    }), "マジックの手札選択が不正です");

    const searchGame = createGameWithPlayerHand([{ cardId: "card_123", instanceId: "search" }]);
    searchGame.players.player.stones = magicCost("card_123");
    expectAtomicThrow(searchGame, () => playMagic(searchGame, {
      handInstanceId: "search",
      target: { kind: "master", playerId: "player" },
      searchCategory: "invalid" as "front",
    }), "カードサーチのカテゴリ指定が不正です");

    const refreshGame = createGameWithPlayerHand([
      { cardId: "card_116", instanceId: "refresh" },
      { cardId: "takokke", instanceId: "ignored_secondary" },
    ]);
    refreshGame.players.player.stones = magicCost("card_116");
    expectAtomicThrow(refreshGame, () => playMagic(refreshGame, {
      handInstanceId: "refresh",
      target: { kind: "master", playerId: "player" },
      secondaryHandInstanceId: "ignored_secondary",
    }), "マジックの手札選択が不正です");
  });

  it("rejects commands that belong only to an inactive same-level form", () => {
    const preRevival = createGameWithPlayerHand([]);
    preRevival.players.player.stones = 3;
    preRevival.slots.player_back_left.monster = createActiveMonster("card_035", "player", {
      revivedOnce: false,
    });
    preRevival.slots.player_front_left.monster = createActiveMonster("takokke", "player");

    expect(getCommandTargets(preRevival, "player_back_left", "福音の花")).toEqual([]);
    expectAtomicThrow(preRevival, () => attackWithCommand(preRevival, {
      attackerSlotKey: "player_back_left",
      commandId: "福音の花",
      target: { kind: "monster", slotKey: "player_front_left" },
    }), "その対象には攻撃できません");

    const usedRoRo = createGameWithPlayerHand([]);
    usedRoRo.slots.player_back_left.monster = createActiveMonster("card_045", "player", {
      usedCommandIds: ["飛竜ロロ"],
    });
    usedRoRo.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    expect(getCommandTargets(usedRoRo, "player_back_left", "飛竜ロロ")).toEqual([]);
    expectAtomicThrow(usedRoRo, () => attackWithCommand(usedRoRo, {
      attackerSlotKey: "player_back_left",
      commandId: "飛竜ロロ",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    }), "その対象には攻撃できません");
  });

  it("rejects an injected prepared recipient for level move atomically", () => {
    const game = createGameWithPlayerHand([]);
    game.players.player.stones = 1;
    game.slots.player_back_left.monster = createActiveMonster("card_138", "player", {
      level: 3,
      investedStones: 3,
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      level: 2,
      investedStones: 2,
    });
    game.slots.player_front_right.monster = createActiveMonster("takokke", "player");
    game.slots.player_back_right.monster = createActiveMonster("sigma", "player", { status: "prepared" });

    expectAtomicThrow(game, () => attackWithCommand(game, {
      attackerSlotKey: "player_back_left",
      commandId: "レベルムーブ",
      target: { kind: "monster", slotKey: "cpu_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "player_back_right" },
    }), "コマンドの二次対象が不正です");
  });

  it("lets a guarded secondary monster reject a magic effect while still spending the card and cost", () => {
    const game = createGameWithPlayerHand([{ cardId: "card_061", instanceId: "tempt" }]);
    game.players.player.stones = magicCost("card_061");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("card_077", "cpu", { damageGuarded: true });

    const next = playMagic(game, {
      handInstanceId: "tempt",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(next.players.player.stones).toBe(0);
    expect(next.players.player.hand).toEqual([]);
    expect(next.players.player.discard).toContainEqual({ cardId: "card_061", instanceId: "tempt" });
    expect(next.slots.player_front_left.monster?.cardId).toBe("takokke");
    expect(next.slots.cpu_front_left.monster?.cardId).toBe("card_077");
    expect(next.log.some((entry) => entry.includes("仮死状態で効果を受けつけなかった"))).toBe(true);

    const shieldGame = createGameWithPlayerHand([{ cardId: "card_030", instanceId: "double_shield" }]);
    shieldGame.players.player.stones = magicCost("card_030");
    shieldGame.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    shieldGame.slots.cpu_front_left.monster = createActiveMonster("card_077", "cpu", { damageGuarded: true });
    const shielded = playMagic(shieldGame, {
      handInstanceId: "double_shield",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_left" },
    });
    expect(shielded.slots.player_front_left.monster?.shielded).toBe(true);
    expect(shielded.slots.cpu_front_left.monster?.shielded).toBe(false);
  });

  it("blocks utility-command effects on guarded primary and secondary targets after spending the action", () => {
    const secondaryGuarded = createGameWithPlayerHand([]);
    secondaryGuarded.players.player.stones = 3;
    secondaryGuarded.slots.player_back_left.monster = createActiveMonster("card_085", "player", {
      instanceId: "warper",
    });
    secondaryGuarded.slots.player_front_right.monster = createActiveMonster("takokke", "player", {
      instanceId: "primary",
    });
    secondaryGuarded.slots.player_back_right.monster = createActiveMonster("card_077", "player", {
      instanceId: "guarded_secondary",
      damageGuarded: true,
    });

    const afterSecondary = attackWithCommand(secondaryGuarded, {
      attackerSlotKey: "player_back_left",
      commandId: "ワープ",
      target: { kind: "monster", slotKey: "player_front_right" },
      secondaryTarget: { kind: "monster", slotKey: "player_back_right" },
    });

    expect(afterSecondary.players.player.stones).toBe(0);
    expect(afterSecondary.slots.player_back_left.monster?.actionCount).toBe(1);
    expect(afterSecondary.slots.player_front_right.monster?.instanceId).toBe("primary");
    expect(afterSecondary.slots.player_back_right.monster?.instanceId).toBe("guarded_secondary");

    const primaryGuarded = createGameWithPlayerHand([]);
    primaryGuarded.players.player.stones = 3;
    primaryGuarded.slots.player_back_left.monster = createActiveMonster("card_085", "player", {
      instanceId: "warper",
    });
    primaryGuarded.slots.player_front_right.monster = createActiveMonster("card_077", "player", {
      instanceId: "guarded_primary",
      damageGuarded: true,
    });
    primaryGuarded.slots.player_back_right.monster = createActiveMonster("takokke", "player", {
      instanceId: "secondary",
    });

    const afterPrimary = attackWithCommand(primaryGuarded, {
      attackerSlotKey: "player_back_left",
      commandId: "ワープ",
      target: { kind: "monster", slotKey: "player_front_right" },
      secondaryTarget: { kind: "monster", slotKey: "player_back_right" },
    });

    expect(afterPrimary.players.player.stones).toBe(0);
    expect(afterPrimary.slots.player_back_left.monster?.actionCount).toBe(1);
    expect(afterPrimary.slots.player_front_right.monster?.instanceId).toBe("guarded_primary");
    expect(afterPrimary.slots.player_back_right.monster?.instanceId).toBe("secondary");
  });

  it("does not apply post-damage command effects after a guarded target rejects the attack", () => {
    const game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_101", "player", {
      level: 3,
      hp: 4,
      investedStones: 3,
    });
    game.slots.cpu_front_left.monster = createActiveMonster("card_077", "cpu", {
      hp: 4,
      damageGuarded: true,
    });

    const next = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "火の魂",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(next.slots.player_front_left.monster?.actionCount).toBe(1);
    expect(next.slots.cpu_front_left.monster?.hp).toBe(4);
    expect(next.slots.cpu_front_left.monster?.damageCurse).toBeUndefined();

    const newlyGuarded = createGameWithPlayerHand([]);
    newlyGuarded.slots.player_front_left.monster = createActiveMonster("card_101", "player", {
      level: 3,
      hp: 4,
      investedStones: 3,
    });
    newlyGuarded.slots.cpu_front_left.monster = createActiveMonster("card_077", "cpu", { hp: 6 });
    const afterFirstHit = attackWithCommand(newlyGuarded, {
      attackerSlotKey: "player_front_left",
      commandId: "火の魂",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    expect(afterFirstHit.slots.cpu_front_left.monster).toMatchObject({
      hp: 2,
      damageGuarded: true,
    });
    expect(afterFirstHit.slots.cpu_front_left.monster?.damageCurse).toBeUndefined();
  });

  it("continues attacker healing, splash, and piercing beyond a guarded primary target", () => {
    const drainGame = createGameWithPlayerHand([]);
    drainGame.players.player.stones = 2;
    drainGame.slots.player_front_left.monster = createActiveMonster("card_072", "player", { hp: 2 });
    drainGame.slots.cpu_front_left.monster = createActiveMonster("card_077", "cpu", {
      damageGuarded: true,
    });
    const drained = attackWithCommand(drainGame, {
      attackerSlotKey: "player_front_left",
      commandId: "吸血",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    expect(drained.slots.player_front_left.monster?.hp).toBe(3);
    expect(drained.slots.cpu_front_left.monster?.hp).toBe(4);

    const splashGame = createGameWithPlayerHand([]);
    splashGame.slots.player_front_left.monster = createActiveMonster("card_078", "player");
    splashGame.slots.cpu_front_left.monster = createActiveMonster("card_077", "cpu", {
      damageGuarded: true,
    });
    splashGame.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu", { hp: 5 });
    const splashed = attackWithCommand(splashGame, {
      attackerSlotKey: "player_front_left",
      commandId: "爆裂キノコ",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    expect(splashed.slots.cpu_front_left.monster?.hp).toBe(4);
    expect(splashed.slots.cpu_back_left.monster?.hp).toBe(4);

    const piercingGame = createGameWithPlayerHand([]);
    piercingGame.players.player.stones = 1;
    piercingGame.slots.player_front_left.monster = createActiveMonster("card_008", "player");
    piercingGame.slots.cpu_front_left.monster = createActiveMonster("card_077", "cpu", {
      damageGuarded: true,
    });
    piercingGame.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu", { hp: 5 });
    const pierced = attackWithCommand(piercingGame, {
      attackerSlotKey: "player_front_left",
      commandId: "スマートビーム",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    expect(pierced.slots.cpu_front_left.monster?.hp).toBe(4);
    expect(pierced.slots.cpu_back_left.monster?.hp).toBe(3);
  });

  it("consumes death chain before propagating its first hit", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_098", instanceId: "chain" }]);
    game.players.player.stones = magicCost("card_098");
    game.slots.player_front_left.monster = createActiveMonster("polyspinner", "player", { hp: 10 });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 10 });
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
    const hpAfterFirstAttack = game.slots.player_front_left.monster?.hp;
    expect(hpAfterFirstAttack).toBe(8);
    expect(game.slots.player_front_left.monster?.deathChainSlotKey).toBeUndefined();
    expect(game.slots.cpu_front_left.monster?.deathChainSlotKey).toBeUndefined();

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    expect(game.slots.player_front_left.monster?.hp).toBe(hpAfterFirstAttack);
  });

  it("does not double-defeat a target removed by a nested death-chain counter", () => {
    const game = createInitialGame(904);
    game.currentPlayer = "cpu";
    game.players.cpu.hand = [{ cardId: "thunder", instanceId: "thunder" }];
    game.players.cpu.stones = magicCost("thunder");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      hp: 4,
      deathChainSlotKey: "cpu_front_left",
    });
    game.slots.cpu_front_left.monster = createActiveMonster("card_109", "cpu", {
      deathChainSlotKey: "player_front_left",
    });

    const next = playMagic(game, {
      handInstanceId: "thunder",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(next.slots.player_front_left.monster).toBeUndefined();
    expect(next.slots.cpu_front_left.monster?.hp).toBe(3);
    expect(next.slots.cpu_front_left.monster?.deathChainSlotKey).toBeUndefined();
  });

  it("blocks alternate commands while provoked and consumes provoke on the forced attack", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_097", instanceId: "provoke" }]);
    game.players.player.stones = magicCost("card_097");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 10 });
    game.slots.player_back_right.monster = createActiveMonster("takokke", "player", { hp: 10 });
    game.slots.cpu_front_left.monster = createActiveMonster("bomuzo", "cpu", { hp: 10 });
    game = playMagic(game, {
      handInstanceId: "provoke",
      target: { kind: "monster", slotKey: "cpu_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "player_front_left" },
    });
    game.currentPlayer = "cpu";

    expect(getCommandTargets(game, "cpu_front_left", "self_bomb")).toEqual([
      { kind: "monster", slotKey: "player_front_left" },
    ]);
    expect(getCommandTargets(game, "cpu_front_left", "storm_bomb")).toEqual([]);

    game = createGameWithPlayerHand([{ cardId: "card_097", instanceId: "provoke" }]);
    game.players.player.stones = magicCost("card_097");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 10 });
    game.slots.cpu_front_left.monster = createActiveMonster("polyspinner", "cpu", { hp: 10 });
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu", { hp: 10 });
    game = playMagic(game, {
      handInstanceId: "provoke",
      target: { kind: "monster", slotKey: "cpu_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "player_front_left" },
    });
    game.currentPlayer = "cpu";
    game = attackWithCommand(game, {
      attackerSlotKey: "cpu_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.cpu_front_left.monster?.provokeTargetSlotKey).toBeUndefined();
    expect(getCommandTargets(game, "cpu_front_left", "attack")).toContainEqual({
      kind: "monster",
      slotKey: "cpu_back_left",
    });
  });

  it("lets only executable damage commands enforce and consume provoke", () => {
    const reachable = createGameWithPlayerHand([]);
    reachable.players.player.stones = 1;
    reachable.slots.player_front_left.monster = createActiveMonster("card_053", "player", {
      provokeTargetSlotKey: "cpu_front_left",
    });
    reachable.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 2 });

    expect(getCommandTargets(reachable, "player_front_left", "attack")).toEqual([
      { kind: "monster", slotKey: "cpu_front_left" },
    ]);
    expect(getCommandTargets(reachable, "player_front_left", "ヒーリング")).toEqual([]);
    expectAtomicThrow(reachable, () => attackWithCommand(reachable, {
      attackerSlotKey: "player_front_left",
      commandId: "ヒーリング",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    }), "その対象には攻撃できません");

    let unreachable = createGameWithPlayerHand([]);
    unreachable.players.player.stones = 1;
    unreachable.slots.player_back_left.monster = createActiveMonster("card_053", "player", {
      provokeTargetSlotKey: "cpu_back_right",
    });
    unreachable.slots.cpu_back_right.monster = createActiveMonster("takokke", "cpu", { hp: 2 });
    expect(getCommandTargets(unreachable, "player_back_left", "attack")).not.toContainEqual({
      kind: "monster",
      slotKey: "cpu_back_right",
    });
    expect(getCommandTargets(unreachable, "player_back_left", "ヒーリング")).toContainEqual({
      kind: "monster",
      slotKey: "cpu_back_right",
    });

    unreachable = attackWithCommand(unreachable, {
      attackerSlotKey: "player_back_left",
      commandId: "ヒーリング",
      target: { kind: "monster", slotKey: "cpu_back_right" },
    });
    expect(unreachable.slots.player_back_left.monster?.provokeTargetSlotKey).toBe("cpu_back_right");
  });

  it("does not block move or focus when the only reaching damage command is unaffordable or sealed", () => {
    const unaffordable = createGameWithPlayerHand([]);
    unaffordable.players.player.stones = 0;
    unaffordable.slots.player_back_left.monster = createActiveMonster("card_020", "player", {
      provokeTargetSlotKey: "cpu_front_left",
    });
    unaffordable.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    expect(getCommandTargets(unaffordable, "player_back_left", "バズーカ")).toEqual([]);
    expect(getMovableTargets(unaffordable, "player_back_left").length).toBeGreaterThan(0);
    expect(canFocusMonster(unaffordable, "player_back_left")).toBe(true);

    const sealed = createGameWithPlayerHand([]);
    sealed.players.player.stones = 1;
    sealed.slots.player_back_left.monster = createActiveMonster("card_020", "player", {
      provokeTargetSlotKey: "cpu_front_left",
      commandSealed: true,
    });
    sealed.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    expect(getCommandTargets(sealed, "player_back_left", "バズーカ")).toEqual([]);
    expect(getMovableTargets(sealed, "player_back_left").length).toBeGreaterThan(0);
    expect(canFocusMonster(sealed, "player_back_left")).toBe(true);
  });

  it("treats a zero-power attack command as an attack for provoke", () => {
    const game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("card_048", "player", {
      provokeTargetSlotKey: "cpu_front_left",
    });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    expect(getCommandTargets(game, "player_front_left", "attack")).toEqual([
      { kind: "monster", slotKey: "cpu_front_left" },
    ]);
    expect(canFocusMonster(game, "player_front_left")).toBe(false);
  });

  it("keeps provoke and death-chain references attached to monsters moved or swapped manually", () => {
    let moved = createGameWithPlayerHand([]);
    moved.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      instanceId: "bait",
      deathChainSlotKey: "cpu_front_left",
    });
    moved.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      provokeTargetSlotKey: "player_front_left",
      deathChainSlotKey: "player_front_left",
    });

    moved = moveMonster(moved, "player_front_left", "player_back_left");
    expect(moved.slots.player_back_left.monster?.instanceId).toBe("bait");
    expect(moved.slots.player_back_left.monster?.deathChainSlotKey).toBe("cpu_front_left");
    expect(moved.slots.cpu_front_left.monster).toMatchObject({
      provokeTargetSlotKey: "player_back_left",
      deathChainSlotKey: "player_back_left",
    });

    let swapped = createGameWithPlayerHand([]);
    swapped.slots.player_front_left.monster = createActiveMonster("takokke", "player", { instanceId: "left" });
    swapped.slots.player_front_right.monster = createActiveMonster("sigma", "player", { instanceId: "right" });
    swapped.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      provokeTargetSlotKey: "player_front_left",
    });
    swapped.slots.cpu_front_right.monster = createActiveMonster("takokke", "cpu", {
      provokeTargetSlotKey: "player_front_right",
    });

    swapped = moveMonster(swapped, "player_front_left", "player_front_right");
    expect(swapped.slots.player_front_right.monster?.instanceId).toBe("left");
    expect(swapped.slots.player_front_left.monster?.instanceId).toBe("right");
    expect(swapped.slots.cpu_front_left.monster?.provokeTargetSlotKey).toBe("player_front_right");
    expect(swapped.slots.cpu_front_right.monster?.provokeTargetSlotKey).toBe("player_front_left");
  });

  it("remaps marker targets through magic swaps and simultaneous field rotation", () => {
    let warped = createGameWithPlayerHand([{ cardId: "card_031", instanceId: "warp" }]);
    warped.players.player.stones = magicCost("card_031");
    warped.slots.player_front_left.monster = createActiveMonster("takokke", "player", { instanceId: "primary" });
    warped.slots.player_front_right.monster = createActiveMonster("sigma", "player", { instanceId: "secondary" });
    warped.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      provokeTargetSlotKey: "player_front_left",
    });
    warped = playMagic(warped, {
      handInstanceId: "warp",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "player_front_right" },
    });
    expect(warped.slots.player_front_right.monster?.instanceId).toBe("primary");
    expect(warped.slots.cpu_front_left.monster?.provokeTargetSlotKey).toBe("player_front_right");

    let rotated = createGameWithPlayerHand([{ cardId: "card_093", instanceId: "rotate" }]);
    rotated.players.player.stones = magicCost("card_093");
    rotated.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      instanceId: "player_link",
      deathChainSlotKey: "cpu_front_left",
    });
    rotated.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      instanceId: "cpu_link",
      provokeTargetSlotKey: "player_front_left",
      deathChainSlotKey: "player_front_left",
    });
    rotated = playMagic(rotated, {
      handInstanceId: "rotate",
      target: { kind: "master", playerId: "player" },
    });
    expect(rotated.slots.player_front_right.monster).toMatchObject({
      instanceId: "player_link",
      deathChainSlotKey: "cpu_front_right",
    });
    expect(rotated.slots.cpu_front_right.monster).toMatchObject({
      instanceId: "cpu_link",
      provokeTargetSlotKey: "player_front_right",
      deathChainSlotKey: "player_front_right",
    });
  });

  it("remaps marker targets through automatic advance, retreat, and sweeping movement", () => {
    let advanced = createGameWithPlayerHand([]);
    advanced.currentPlayer = "cpu";
    advanced.slots.player_back_left.monster = createActiveMonster("takokke", "player", {
      instanceId: "advancing_bait",
    });
    advanced.slots.player_front_right.monster = createActiveMonster("takokke", "player", {
      provokeTargetSlotKey: "player_back_left",
    });
    advanced = endTurn(advanced);
    expect(advanced.slots.player_front_left.monster?.instanceId).toBe("advancing_bait");
    expect(advanced.slots.player_front_right.monster?.provokeTargetSlotKey).toBe("player_front_left");

    let retreated = createGameWithPlayerHand([]);
    retreated.slots.player_front_left.monster = createActiveMonster("card_048", "player", {
      instanceId: "retreating_bait",
    });
    retreated.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu", {
      provokeTargetSlotKey: "player_front_left",
    });
    retreated = attackWithCommand(retreated, {
      attackerSlotKey: "player_front_left",
      commandId: "バック_クロウ",
      target: { kind: "monster", slotKey: "cpu_back_left" },
    });
    expect(retreated.slots.player_back_left.monster?.instanceId).toBe("retreating_bait");
    expect(retreated.slots.cpu_back_left.monster?.provokeTargetSlotKey).toBe("player_back_left");

    let swept = createGameWithPlayerHand([]);
    swept.slots.player_back_left.monster = createActiveMonster("card_076", "player", {
      instanceId: "sweeper",
      level: 2,
      hp: 6,
      investedStones: 2,
    });
    swept.slots.player_front_left.monster = createActiveMonster("sigma", "player", {
      instanceId: "swapped_ally",
    });
    swept.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      hp: 10,
      provokeTargetSlotKey: "player_back_left",
    });
    swept.slots.cpu_front_right.monster = createActiveMonster("takokke", "cpu", {
      provokeTargetSlotKey: "player_front_left",
    });
    swept = attackWithCommand(swept, {
      attackerSlotKey: "player_back_left",
      commandId: "なぎ払い",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });
    expect(swept.slots.player_front_left.monster?.instanceId).toBe("sweeper");
    expect(swept.slots.player_back_left.monster?.instanceId).toBe("swapped_ally");
    expect(swept.slots.cpu_front_left.monster?.provokeTargetSlotKey).toBe("player_front_left");
    expect(swept.slots.cpu_front_right.monster?.provokeTargetSlotKey).toBe("player_back_left");
  });

  it("clears inbound markers when a monster leaves or is replaced in the same slot", () => {
    let removed = createGameWithPlayerHand([{ cardId: "card_057", instanceId: "escape" }]);
    removed.players.player.stones = magicCost("card_057");
    removed.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      deathChainSlotKey: "cpu_front_left",
    });
    removed.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      provokeTargetSlotKey: "player_front_left",
      deathChainSlotKey: "player_front_left",
    });
    removed = playMagic(removed, {
      handInstanceId: "escape",
      target: { kind: "monster", slotKey: "player_front_left" },
    });
    expect(removed.slots.cpu_front_left.monster?.provokeTargetSlotKey).toBeUndefined();
    expect(removed.slots.cpu_front_left.monster?.deathChainSlotKey).toBeUndefined();

    let shifted = createGameWithPlayerHand([
      { cardId: "card_065", instanceId: "shift" },
      { cardId: "sigma", instanceId: "new_field_monster" },
    ]);
    shifted.players.player.stones = magicCost("card_065");
    shifted.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      instanceId: "old_field_monster",
      deathChainSlotKey: "cpu_front_left",
    });
    shifted.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      provokeTargetSlotKey: "player_front_left",
      deathChainSlotKey: "player_front_left",
    });
    shifted = playMagic(shifted, {
      handInstanceId: "shift",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryHandInstanceId: "new_field_monster",
    });
    expect(shifted.slots.player_front_left.monster?.instanceId).toBe("new_field_monster");
    expect(shifted.slots.cpu_front_left.monster?.provokeTargetSlotKey).toBeUndefined();
    expect(shifted.slots.cpu_front_left.monster?.deathChainSlotKey).toBeUndefined();

    let switched = createGameWithPlayerHand([{ cardId: "takokke", instanceId: "soul_replacement" }]);
    switched.players.player.stones = 2;
    switched.slots.player_front_left.monster = createActiveMonster("card_134", "player", {
      instanceId: "phantom",
    });
    switched.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      provokeTargetSlotKey: "player_front_left",
    });
    switched = attackWithCommand(switched, {
      attackerSlotKey: "player_front_left",
      commandId: "ソウルスイッチ",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryHandInstanceId: "soul_replacement",
    });
    expect(switched.slots.player_front_left.monster?.instanceId).toBe("soul_replacement");
    expect(switched.slots.cpu_front_left.monster?.provokeTargetSlotKey).toBeUndefined();
  });

  it("consumes the attack-anywhere marker when the first normal attack starts", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_063", instanceId: "anywhere" }]);
    game.players.player.stones = magicCost("card_063");
    game.slots.player_front_left.monster = createActiveMonster("polyspinner", "player", { hp: 10 });
    game.slots.cpu_back_right.monster = createActiveMonster("takokke", "cpu", { hp: 10 });
    game = playMagic(game, {
      handInstanceId: "anywhere",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    game = attackWithCommand(game, {
      attackerSlotKey: "player_front_left",
      commandId: "attack",
      target: { kind: "monster", slotKey: "cpu_back_right" },
    });

    expect(game.slots.player_front_left.monster?.canAttackAnywhere).toBe(false);
    expect(getCommandTargets(game, "player_front_left", "attack")).not.toContainEqual({
      kind: "monster",
      slotKey: "cpu_back_right",
    });
  });

  it("restores the original mirrored form at the end of its owner's turn while preserving HP", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_148", instanceId: "mirror" }]);
    game.players.player.stones = magicCost("card_148");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 2 });
    game.slots.cpu_front_left.monster = createActiveMonster("polyspinner", "cpu", {
      level: 2,
      investedStones: 2,
    });
    game = playMagic(game, {
      handInstanceId: "mirror",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_left" },
    });
    expect(game.slots.player_front_left.monster).toMatchObject({
      cardId: "polyspinner",
      level: 2,
      actionLimit: 2,
      hp: 2,
    });

    game = endTurn(game);

    expect(game.slots.player_front_left.monster).toMatchObject({
      cardId: "takokke",
      level: 1,
      actionLimit: 1,
      hp: 2,
    });
    expect(game.slots.player_front_left.monster?.mirroredFormOriginal).toBeUndefined();
  });

  it("clamps current HP to the original maximum when a mirrored form expires", () => {
    let game = createGameWithPlayerHand([{ cardId: "card_148", instanceId: "mirror" }]);
    game.players.player.stones = magicCost("card_148");
    game.slots.player_front_left.monster = createActiveMonster("polyspinner", "player", { hp: 3 });
    game.slots.cpu_front_left.monster = createActiveMonster("card_109", "cpu");
    game = playMagic(game, {
      handInstanceId: "mirror",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_left" },
    });
    const mirrored = game.slots.player_front_left.monster;
    if (!mirrored) {
      throw new Error("mirrored monster is missing");
    }
    mirrored.hp = 6;

    game = endTurn(game);

    expect(game.slots.player_front_left.monster).toMatchObject({
      cardId: "polyspinner",
      hp: 3,
      actionLimit: 2,
    });
  });

  it("copies the source monster's active conditional form without resetting one-shot form state", () => {
    let usedRoRo = createGameWithPlayerHand([{ cardId: "card_148", instanceId: "mirror" }]);
    usedRoRo.players.player.stones = magicCost("card_148");
    usedRoRo.slots.player_back_left.monster = createActiveMonster("takokke", "player");
    usedRoRo.slots.cpu_front_left.monster = createActiveMonster("card_045", "cpu", {
      usedCommandIds: ["飛竜ロロ"],
    });
    usedRoRo = playMagic(usedRoRo, {
      handInstanceId: "mirror",
      target: { kind: "monster", slotKey: "player_back_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_left" },
    });
    expect(usedRoRo.slots.player_back_left.monster?.usedCommandIds).toEqual(["飛竜ロロ"]);
    expect(getCommandTargets(usedRoRo, "player_back_left", "飛竜ロロ")).toEqual([]);

    let revived = createGameWithPlayerHand([{ cardId: "card_148", instanceId: "mirror" }]);
    revived.players.player.stones = magicCost("card_148") + 3;
    revived.slots.player_back_left.monster = createActiveMonster("takokke", "player");
    revived.slots.player_front_left.monster = createActiveMonster("sigma", "player");
    revived.slots.cpu_front_left.monster = createActiveMonster("card_035", "cpu", {
      revivedOnce: true,
    });
    revived = playMagic(revived, {
      handInstanceId: "mirror",
      target: { kind: "monster", slotKey: "player_back_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_left" },
    });
    expect(revived.slots.player_back_left.monster?.revivedOnce).toBe(true);
    expect(getCommandTargets(revived, "player_back_left", "福音の花")).toContainEqual({
      kind: "monster",
      slotKey: "player_front_left",
    });
  });

  it("restores the real form before regeneration resets it to entry stats", () => {
    let game = createGameWithPlayerHand([
      { cardId: "card_148", instanceId: "mirror" },
      { cardId: "card_130", instanceId: "regenerate" },
    ]);
    game.players.player.stones = magicCost("card_148") + magicCost("card_130");
    game.slots.player_front_left.monster = createActiveMonster("bomuzo", "player", {
      level: 2,
      hp: 2,
      investedStones: 2,
      actionCount: 1,
    });
    game.slots.cpu_front_left.monster = createActiveMonster("polyspinner", "cpu", {
      level: 2,
      investedStones: 2,
    });
    game = playMagic(game, {
      handInstanceId: "mirror",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_left" },
    });
    game = playMagic(game, {
      handInstanceId: "regenerate",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(game.slots.player_front_left.monster).toMatchObject({
      cardId: "bomuzo",
      level: 1,
      hp: 6,
      investedStones: 1,
      actionCount: 0,
      actionLimit: 1,
    });
    expect(game.slots.player_front_left.monster?.mirroredFormOriginal).toBeUndefined();
  });

  it("ends mirror before permanent mana transformation and super evolution", () => {
    let manaGame = createGameWithPlayerHand([{ cardId: "card_148", instanceId: "mirror" }]);
    manaGame.players.player.stones = magicCost("card_148");
    manaGame.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 2 });
    manaGame.slots.player_back_left.monster = createActiveMonster("card_131", "player", {
      level: 3,
      investedStones: 3,
    });
    manaGame.slots.cpu_front_left.monster = createActiveMonster("polyspinner", "cpu", {
      level: 2,
      investedStones: 2,
    });
    manaGame = playMagic(manaGame, {
      handInstanceId: "mirror",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_left" },
    });
    manaGame = attackWithCommand(manaGame, {
      attackerSlotKey: "player_back_left",
      commandId: "マナ変化",
      target: { kind: "monster", slotKey: "player_front_left" },
    });
    expect(manaGame.slots.player_front_left.monster).toMatchObject({
      cardId: "card_002",
      level: 1,
      hp: 2,
    });
    expect(manaGame.slots.player_front_left.monster?.mirroredFormOriginal).toBeUndefined();

    let superGame = createGameWithPlayerHand([
      { cardId: "card_148", instanceId: "mirror" },
      { cardId: "card_006", instanceId: "bomb_king" },
    ]);
    superGame.players.player.stones = magicCost("card_148") + 1;
    superGame.slots.player_front_left.monster = createActiveMonster("bomuzo", "player", {
      level: 2,
      hp: 2,
      investedStones: 2,
    });
    superGame.slots.cpu_front_left.monster = createActiveMonster("polyspinner", "cpu", {
      level: 2,
      investedStones: 2,
    });
    superGame = playMagic(superGame, {
      handInstanceId: "mirror",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_left" },
    });
    superGame.pendingLevelUp = {
      playerId: "player",
      attackerSlotKey: "player_front_left",
      maxLevels: 1,
      superOptions: [{ handInstanceId: "bomb_king", cardId: "card_006" }],
    };
    superGame = resolveLevelUp(superGame, 1, "bomb_king");
    expect(superGame.slots.player_front_left.monster).toMatchObject({
      cardId: "card_006",
      level: 3,
      instanceId: "bomb_king",
    });
    expect(superGame.slots.player_front_left.monster?.mirroredFormOriginal).toBeUndefined();
  });

  it("returns the real card identity when a mirrored monster leaves or is defeated", () => {
    let removedGame = createGameWithPlayerHand([
      { cardId: "card_148", instanceId: "mirror" },
      { cardId: "card_057", instanceId: "escape" },
    ]);
    removedGame.players.player.stones = magicCost("card_148") + magicCost("card_057");
    removedGame.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      instanceId: "real_takokke",
      hp: 2,
    });
    removedGame.slots.cpu_front_left.monster = createActiveMonster("polyspinner", "cpu");
    removedGame = playMagic(removedGame, {
      handInstanceId: "mirror",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_left" },
    });
    removedGame = playMagic(removedGame, {
      handInstanceId: "escape",
      target: { kind: "monster", slotKey: "player_front_left" },
    });
    expect(removedGame.players.player.discard).toContainEqual({
      cardId: "takokke",
      instanceId: "real_takokke",
    });

    let defeatedGame = createGameWithPlayerHand([{ cardId: "card_148", instanceId: "mirror" }]);
    defeatedGame.players.player.stones = magicCost("card_148");
    defeatedGame.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      instanceId: "defeated_real_takokke",
      hp: 2,
    });
    defeatedGame.slots.cpu_front_left.monster = createActiveMonster("polyspinner", "cpu");
    defeatedGame = playMagic(defeatedGame, {
      handInstanceId: "mirror",
      target: { kind: "monster", slotKey: "player_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "cpu_front_left" },
    });
    defeatedGame.currentPlayer = "cpu";
    defeatedGame.players.cpu.hand = [{ cardId: "thunder", instanceId: "thunder" }];
    defeatedGame.players.cpu.stones = magicCost("thunder");
    defeatedGame = playMagic(defeatedGame, {
      handInstanceId: "thunder",
      target: { kind: "monster", slotKey: "player_front_left" },
    });
    expect(defeatedGame.players.player.discard).toContainEqual({
      cardId: "takokke",
      instanceId: "defeated_real_takokke",
    });
  });

  it("keeps the first winner when later effects reduce the other master to zero", () => {
    const game = createGameWithPlayerHand([{ cardId: "card_126", instanceId: "earth" }]);
    game.players.player.stones = magicCost("card_126");
    game.players.player.masterHp = 1;
    game.players.cpu.masterHp = 1;
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu", {
      hp: 1,
      shadowCursed: true,
    });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      hp: 1,
      shadowCursed: true,
    });

    const next = playMagic(game, {
      handInstanceId: "earth",
      target: { kind: "master", playerId: "player" },
    });

    expect(next.players.cpu.masterHp).toBe(0);
    expect(next.players.player.masterHp).toBe(0);
    expect(next.winner).toBe("player");
  });

  it("keeps super level-up as a pending remainder after reaching the normal maximum", () => {
    const game = createGameWithPlayerHand([{ cardId: "card_006", instanceId: "bomb_king" }]);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("bomuzo", "player");
    game.pendingLevelUp = {
      playerId: "player",
      attackerSlotKey: "player_front_left",
      maxLevels: 2,
      superOptions: [{ handInstanceId: "bomb_king", cardId: "card_006" }],
    };

    const next = resolveLevelUp(game, 2);

    expect(next.slots.player_front_left.monster?.level).toBe(2);
    expect(next.pendingLevelUp).toEqual({
      playerId: "player",
      attackerSlotKey: "player_front_left",
      maxLevels: 1,
      superOptions: [{ handInstanceId: "bomb_king", cardId: "card_006" }],
    });
  });

  it("rejects fractional and NaN level-up counts without mutating the pending state", () => {
    const game = createGameWithPlayerHand([]);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.pendingLevelUp = {
      playerId: "player",
      attackerSlotKey: "player_front_left",
      maxLevels: 1,
    };
    const before = JSON.stringify(game);

    expect(() => resolveLevelUp(game, 0.5)).toThrow("選択できないレベルアップ数です");
    expect(JSON.stringify(game)).toBe(before);
    expect(() => resolveLevelUp(game, Number.NaN)).toThrow("選択できないレベルアップ数です");
    expect(JSON.stringify(game)).toBe(before);
  });

  it("uses and advances the game RNG stream when reshuffling a hand", () => {
    const first = playMagic(createReshuffleGame(1), {
      handInstanceId: "reshuffle",
      target: { kind: "master", playerId: "player" },
    });
    const replay = playMagic(createReshuffleGame(1), {
      handInstanceId: "reshuffle",
      target: { kind: "master", playerId: "player" },
    });
    const otherSeed = playMagic(createReshuffleGame(999), {
      handInstanceId: "reshuffle",
      target: { kind: "master", playerId: "player" },
    });

    expect(cardOrder(first)).toEqual(cardOrder(replay));
    expect(first.randomSeed).toBe(replay.randomSeed);
    expect(first.randomSeed).not.toBe(1);
    expect(cardOrder(first)).not.toEqual(cardOrder(otherSeed));
  });

  it("does not enumerate acted monsters as water-crystal targets", () => {
    const game = createGameWithPlayerHand([{ cardId: "card_062", instanceId: "crystal" }]);
    game.players.player.stones = magicCost("card_062");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { actionCount: 1 });
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { actionCount: 0 });

    expect(getMagicTargets(game, "crystal")).not.toContainEqual({
      kind: "monster",
      slotKey: "player_front_left",
    });
    expect(getMagicTargets(game, "crystal")).toContainEqual({
      kind: "monster",
      slotKey: "cpu_front_left",
    });
  });

  it("keeps targeting queries pure when a provoke target has left the field", () => {
    const game = createGameWithPlayerHand([]);
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      provokeTargetSlotKey: "cpu_front_left",
    });
    const before = JSON.stringify(game);

    getCommandTargets(game, "player_front_left", "attack");

    expect(JSON.stringify(game)).toBe(before);
    expect(game.slots.player_front_left.monster?.provokeTargetSlotKey).toBe("cpu_front_left");
  });
});

function createGameWithPlayerHand(hand: CardInstance[]): GameState {
  const game = createInitialGame(903);
  game.players.player.hand = hand;
  game.players.player.discard = [];
  return game;
}

function createReshuffleGame(seed: number): GameState {
  const game = createGameWithPlayerHand([
    { cardId: "card_114", instanceId: "reshuffle" },
    { cardId: "takokke", instanceId: "hand_1" },
    { cardId: "sigma", instanceId: "hand_2" },
    { cardId: "yanbaru", instanceId: "hand_3" },
  ]);
  game.randomSeed = seed;
  game.players.player.stones = magicCost("card_114");
  game.players.player.deck = [
    { cardId: "bomuzo", instanceId: "deck_1" },
    { cardId: "polyspinner", instanceId: "deck_2" },
    { cardId: "healing", instanceId: "deck_3" },
    { cardId: "thunder", instanceId: "deck_4" },
  ];
  return game;
}

function cardOrder(game: GameState): string[] {
  return [...game.players.player.hand, ...game.players.player.deck].map((card) => card.instanceId);
}

function expectAtomicThrow(game: GameState, action: () => unknown, message: string): void {
  const before = JSON.stringify(game);
  expect(action).toThrow(message);
  expect(JSON.stringify(game)).toBe(before);
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
    instanceId: `${owner}_${cardId}_adversarial_fixture`,
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
