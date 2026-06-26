import { describe, expect, it } from "vitest";
import { getMonsterDef } from "../../src/game/cards";
import { applyCpuDecision, chooseCpuDecision, inspectCpuDecisionEvaluations, listCpuDecisions } from "../../src/game/cpuAi";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial } from "../../src/game/deckPresets";
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

  it("prioritizes direct master damage over non-lethal monster damage when behind in the HP race", () => {
    const game = createCpuGame();
    game.players.cpu.hand = [];
    game.players.cpu.stones = 0;
    game.players.cpu.masterHp = 6;
    game.players.player.masterHp = 10;
    game.slots.cpu_front_left.monster = createActiveMonster("morgan", "cpu", {
      hp: 4,
      level: 2,
    });
    game.slots.player_front_left.monster = createActiveMonster("morgan", "player", {
      hp: 4,
      level: 2,
    });

    const decision = chooseCpuDecision(game, { profile: "strong" });

    expect(decision.type).toBe("attack");
    if (decision.type === "attack") {
      expect(decision.action.target).toEqual({ kind: "master", playerId: "player" });
    }
  });

  it("keeps white on board control over non-lethal master damage while an enemy front remains", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.player.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 0;
    game.players.cpu.masterHp = 10;
    game.players.player.masterHp = 10;
    game.slots.cpu_front_left.monster = createActiveMonster("morgan", "cpu", {
      hp: 4,
      level: 2,
    });
    game.slots.player_front_left.monster = createActiveMonster("morgan", "player", {
      hp: 4,
      level: 2,
    });

    const decision = chooseCpuDecision(game, { profile: "white" });

    expect(decision.type).toBe("attack");
    if (decision.type === "attack") {
      expect(decision.action.target).toEqual({ kind: "monster", slotKey: "player_front_left" });
    }
  });

  it("does not spend an action focusing when direct master damage is already available", () => {
    const game = createCpuGame();
    game.players.cpu.hand = [];
    game.players.cpu.stones = 0;
    game.players.cpu.masterHp = 10;
    game.players.player.masterHp = 10;
    game.slots.cpu_front_left.monster = createActiveMonster("morgan", "cpu", {
      hp: 4,
      level: 2,
    });

    const decision = chooseCpuDecision(game, { profile: "strong" });

    expect(decision.type).toBe("attack");
    if (decision.type === "attack") {
      expect(decision.action.target).toEqual({ kind: "master", playerId: "player" });
    }
  });

  it("uses Drill Break damage when scoring focus deterrence", () => {
    const drillBreakReady = createCpuGame();
    drillBreakReady.players.cpu.hand = [];
    drillBreakReady.players.cpu.stones = 0;
    drillBreakReady.slots.cpu_front_right.monster = createActiveMonster("card_107", "cpu", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });
    drillBreakReady.slots.cpu_front_left.monster = createActiveMonster("card_108", "cpu", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });

    const partnerSpent = createCpuGame();
    partnerSpent.players.cpu.hand = [];
    partnerSpent.players.cpu.stones = 0;
    partnerSpent.slots.cpu_front_right.monster = createActiveMonster("card_107", "cpu", {
      level: 2,
      hp: 5,
      investedStones: 2,
    });
    partnerSpent.slots.cpu_front_left.monster = createActiveMonster("card_108", "cpu", {
      level: 2,
      hp: 5,
      investedStones: 2,
      actionCount: 1,
    });

    const readyRaonFocus = listCpuDecisions(drillBreakReady).find(
      (decision) => decision.type === "focus" && decision.slotKey === "cpu_front_right",
    );
    const spentRaonFocus = listCpuDecisions(partnerSpent).find(
      (decision) => decision.type === "focus" && decision.slotKey === "cpu_front_right",
    );

    expect(readyRaonFocus?.score).toBeLessThan((spentRaonFocus?.score ?? 0) - 80);
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

  it("uses Bomuzo self-bomb to avoid becoming opponent level-up feed", () => {
    const game = createCpuGame();
    game.players.cpu.hand = [];
    game.players.cpu.stones = 0;
    game.players.player.stones = 2;
    game.slots.cpu_front_left.monster = createActiveMonster("bomuzo", "cpu", {
      hp: 2,
      instanceId: "cpu_doomed_bomuzo",
    });
    game.slots.player_front_left.monster = createActiveMonster("sigma", "player", {
      hp: 5,
      level: 2,
      investedStones: 2,
      instanceId: "player_feed_sigma",
    });

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("attack");
    if (decision.type === "attack") {
      expect(decision.action.attackerSlotKey).toBe("cpu_front_left");
      expect(decision.action.commandId).toBe("self_bomb");
      expect(decision.action.target).toEqual({ kind: "monster", slotKey: "player_front_left" });
    }
  });

  it("allows black backline ally attacks only when they set up berserk feed denial", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "black";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 3;
    game.players.player.stones = 2;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      hp: 3,
      level: 2,
      investedStones: 2,
      cannotActUntilDamaged: true,
      instanceId: "cpu_feed_takokke",
    });
    game.slots.cpu_back_left.monster = createActiveMonster("morgan", "cpu", {
      hp: 1,
      instanceId: "cpu_setup_morgan",
    });
    game.slots.player_front_left.monster = createActiveMonster("sigma", "player", {
      hp: 4,
      level: 2,
      investedStones: 2,
      instanceId: "player_front_sigma",
    });
    game.slots.player_back_left.monster = createActiveMonster("yanbaru", "player", {
      instanceId: "player_back_yanbaru",
    });

    const setupDecision = listCpuDecisions(game).find(
      (decision) =>
        decision.type === "attack" &&
        decision.action.attackerSlotKey === "cpu_back_left" &&
        decision.action.target.kind === "monster" &&
        decision.action.target.slotKey === "cpu_front_left",
    );
    expect(setupDecision).toBeDefined();
    if (!setupDecision || setupDecision.type !== "attack") {
      return;
    }
    expect(setupDecision.reason).toContain("餌");

    let next = applyCpuDecision(game, setupDecision);
    expect(next.slots.cpu_front_left.monster?.hp).toBe(1);
    expect(next.slots.cpu_front_left.monster?.cannotActUntilDamaged).toBe(false);

    const berserkDecision = chooseCpuDecision(next);
    expect(berserkDecision.type).toBe("master_action");
    if (berserkDecision.type !== "master_action") {
      return;
    }
    expect(berserkDecision.actionId).toBe("berserk_power");
    expect(berserkDecision.target).toEqual({ kind: "monster", slotKey: "cpu_front_left" });

    next = applyCpuDecision(next, berserkDecision);
    const selfDestructAttack = chooseCpuDecision(next);
    expect(selfDestructAttack.type).toBe("attack");
    if (selfDestructAttack.type !== "attack") {
      return;
    }
    expect(selfDestructAttack.action.attackerSlotKey).toBe("cpu_front_left");

    next = applyCpuDecision(next, selfDestructAttack);
    expect(next.slots.cpu_front_left.monster).toBeUndefined();
  });

  it("does not choose a zero-damage attack", () => {
    const game = createCpuGame();
    game.players.cpu.hand = [];
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { shielded: true });

    const decision = chooseCpuDecision(game);

    expect(decision.type).not.toBe("attack");
  });

  it("does not spend white closeout turns on non-defensive zero-damage focus stripping", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 0;
    game.players.player.masterHp = 4;
    game.slots.cpu_back_left.monster = createActiveMonster("card_051", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("beyond", "player", { focused: true });

    const decisions = listCpuDecisions(game);

    expect(
      decisions.some(
        (decision) =>
          decision.type === "attack" &&
          decision.action.target.kind === "monster" &&
          decision.action.target.slotKey === "player_front_left",
      ),
    ).toBe(false);
  });

  it("does not spend closeout turns on zero-damage attacks that only strip focus", () => {
    const game = createPlayerAutoGame([]);
    game.players.player.stones = 0;
    game.players.cpu.masterHp = 2;
    game.slots.player_front_left.monster = createActiveMonster("card_051", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("card_051", "cpu", { focused: true });

    const decisions = listCpuDecisions(game);

    expect(
      decisions.some(
        (decision) =>
          decision.type === "attack" &&
          decision.action.target.kind === "monster" &&
          decision.action.target.slotKey === "cpu_front_left",
      ),
    ).toBe(false);
  });

  it("does not spend deck-out turns on nonlethal defensive zero-damage focus stripping", () => {
    const game = createPlayerAutoGame([]);
    game.players.player.deck = [];
    game.players.player.stones = 0;
    game.players.player.masterHp = 8;
    game.players.cpu.masterHp = 8;
    game.slots.player_front_left.monster = createActiveMonster("card_051", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("morgan", "cpu", {
      hp: 4,
      level: 2,
      focused: true,
    });

    const decisions = listCpuDecisions(game);

    expect(
      decisions.some(
        (decision) =>
          decision.type === "attack" &&
          decision.action.target.kind === "monster" &&
          decision.action.target.slotKey === "cpu_front_left",
      ),
    ).toBe(false);
  });

  it("does not chip a deck-out lethal threat unless the hit removes that threat", () => {
    const game = createPlayerAutoGame([]);
    game.players.player.deck = [];
    game.players.player.stones = 0;
    game.players.player.masterHp = 1;
    game.players.cpu.masterHp = 3;
    game.slots.player_back_right.monster = createActiveMonster("card_051", "player", { level: 2 });
    game.slots.cpu_front_left.monster = createActiveMonster("bomuzo", "cpu", {
      hp: 5,
      level: 2,
    });

    const decisions = listCpuDecisions(game);

    expect(
      decisions.some(
        (decision) =>
          decision.type === "attack" &&
          decision.action.target.kind === "monster" &&
          decision.action.target.slotKey === "cpu_front_left",
      ),
    ).toBe(false);
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

  it("applies per-seat action tuning to evaluation scores", () => {
    const game = createCpuGame();
    game.players.cpu.hand = [];
    game.players.cpu.stones = 3;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 2 });

    const findMasterAttack = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "master_attack",
      );
    const baseline = findMasterAttack();
    const tuned = findMasterAttack({ tunings: { cpu: { actionBias: { master_attack: -25 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) - 25);
  });

  it("applies white monster pressure tuning only to effective white monster attacks", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 0;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 5 });

    const findFrontAttack = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "attack" &&
          evaluation.decision.action.target.kind === "monster" &&
          evaluation.decision.action.target.slotKey === "player_front_left",
      );
    const baseline = findFrontAttack();
    const tuned = findFrontAttack({ tunings: { cpu: { situationalBias: { whiteMonsterPressureBonus: 4 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) + 4);
  });

  it("applies white enemy front attack tuning only to white enemy front attacks", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 0;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 5 });

    const findFrontAttack = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "attack" &&
          evaluation.decision.action.target.kind === "monster" &&
          evaluation.decision.action.target.slotKey === "player_front_left",
      );
    const baseline = findFrontAttack();
    const tuned = findFrontAttack({ tunings: { cpu: { situationalBias: { whiteEnemyFrontAttackBonus: 4 } } } });

    game.players.cpu.masterId = "black";
    const blackTuned = findFrontAttack({ tunings: { cpu: { situationalBias: { whiteEnemyFrontAttackBonus: 4 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) + 4);

    const blackBaseline = findFrontAttack();
    expect(blackBaseline).toBeDefined();
    expect(blackTuned).toBeDefined();
    expect(blackTuned?.totalScore).toBeCloseTo(blackBaseline?.totalScore ?? 0);
  });

  it("applies white black front threat tuning only to black front damage sources", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 0;
    game.players.player.masterId = "black";
    game.players.player.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 5 });

    const findFrontAttack = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "attack" &&
          evaluation.decision.action.target.kind === "monster" &&
          evaluation.decision.action.target.slotKey === "player_front_left",
      );
    const baseline = findFrontAttack();
    const tuned = findFrontAttack({ tunings: { cpu: { situationalBias: { whiteBlackFrontThreatBonus: 8 } } } });

    game.players.player.masterId = "white";
    const whiteOpponentBaseline = findFrontAttack();
    const whiteOpponentTuned = findFrontAttack({ tunings: { cpu: { situationalBias: { whiteBlackFrontThreatBonus: 8 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) + 8);
    expect(whiteOpponentBaseline).toBeDefined();
    expect(whiteOpponentTuned).toBeDefined();
    expect(whiteOpponentTuned?.totalScore).toBeCloseTo(whiteOpponentBaseline?.totalScore ?? 0);
  });

  it("uses black front threat handling in the default white profile", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 0;
    game.players.player.masterId = "black";
    game.players.player.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 5 });

    const findFrontAttack = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "attack" &&
          evaluation.decision.action.target.kind === "monster" &&
          evaluation.decision.action.target.slotKey === "player_front_left",
      );
    const disabled = findFrontAttack({
      profile: "white",
      tunings: { cpu: { situationalBias: { whiteBlackFrontThreatBonus: 0 } } },
    });
    const defaultWhite = findFrontAttack({ profile: "white" });

    expect(disabled).toBeDefined();
    expect(defaultWhite).toBeDefined();
    expect(defaultWhite?.totalScore).toBeCloseTo((disabled?.totalScore ?? 0) + 8);
  });

  it("penalizes omniscient end turns that allow a known opponent response", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 0;
    game.players.player.hand = [{ cardId: "card_026", instanceId: "player_known_spark" }];
    game.players.player.stones = 1;
    game.players.player.deck = [];
    game.slots.cpu_front_left.monster = createActiveMonster("morgan", "cpu", {
      hp: 1,
      level: 2,
      investedStones: 2,
    });

    const findEndTurn = (profile: "strong" | "omniscient") =>
      inspectCpuDecisionEvaluations(game, { profile }).find((evaluation) => evaluation.decision.type === "end_turn");
    const strong = findEndTurn("strong");
    const omniscient = findEndTurn("omniscient");

    expect(strong).toBeDefined();
    expect(omniscient).toBeDefined();
    expect(omniscient?.totalScore).toBeLessThan((strong?.totalScore ?? 0) - 20);
  });

  it("uses omniscient berserk tempo when it creates immediate master pressure", () => {
    const preset = "submission-pro-with-rare8-black-999";
    const cardIds = buildDeckPresetCardIds(preset);
    const allowSpecial = deckPresetAllowsSpecial(preset);
    let game = createInitialGame(430, {
      masterIds: { player: "black", cpu: "black" },
      playerDeckCardIds: cardIds,
      cpuDeckCardIds: cardIds,
      allowSpecialDecks: { player: allowSpecial, cpu: allowSpecial },
    });
    const profiles = { player: "strong", cpu: "omniscient" } as const;
    for (let step = 0; step < 11; step += 1) {
      game = runAutoStep(game, { profiles });
    }

    const decision = chooseCpuDecision(game, { profile: "omniscient" });
    expect(decision.type).toBe("master_action");
    if (decision.type === "master_action") {
      expect(decision.actionId).toBe("berserk_power");
    }
  });

  it("applies monster pressure handling to the default white profile only against black", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 0;
    game.players.player.masterId = "black";
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 5 });

    const findFrontAttack = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "attack" &&
          evaluation.decision.action.target.kind === "monster" &&
          evaluation.decision.action.target.slotKey === "player_front_left",
      );
    const disabled = findFrontAttack({
      profile: "white",
      tunings: { cpu: { situationalBias: { whiteMonsterPressureBonus: 0 } } },
    });
    const defaultWhite = findFrontAttack({ profile: "white" });

    game.players.player.masterId = "white";
    const whiteOpponentBaseline = findFrontAttack({
      profile: "white",
      tunings: { cpu: { situationalBias: { whiteMonsterPressureBonus: 0 } } },
    });
    const whiteOpponentDefault = findFrontAttack({ profile: "white" });

    expect(disabled).toBeDefined();
    expect(defaultWhite).toBeDefined();
    expect(defaultWhite?.totalScore).toBeCloseTo((disabled?.totalScore ?? 0) + 4);
    expect(whiteOpponentBaseline).toBeDefined();
    expect(whiteOpponentDefault).toBeDefined();
    expect(whiteOpponentDefault?.totalScore).toBeCloseTo(whiteOpponentBaseline?.totalScore ?? 0);
  });

  it("applies white active front work tuning only when an enemy front is damaged", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 0;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 5 });

    const findFrontAttack = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "attack" &&
          evaluation.decision.action.target.kind === "monster" &&
          evaluation.decision.action.target.slotKey === "player_front_left",
      );
    const baseline = findFrontAttack();
    const tuned = findFrontAttack({ tunings: { cpu: { situationalBias: { whiteActiveFrontWorkBonus: 4 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) + 4);
  });

  it("applies white pygmy front setup tuning when Pygmy creates a front kill range", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 0;
    game.slots.cpu_back_left.monster = createActiveMonster("card_051", "cpu");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 3 });

    const findPygmyFrontAttack = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "attack" &&
          evaluation.decision.action.attackerSlotKey === "cpu_back_left" &&
          evaluation.decision.action.target.kind === "monster" &&
          evaluation.decision.action.target.slotKey === "player_front_left",
      );
    const baseline = findPygmyFrontAttack();
    const tuned = findPygmyFrontAttack({ tunings: { cpu: { situationalBias: { whitePygmyFrontSetupBonus: 10 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) + 10);
  });

  it("does not penalize urgent white shields with strict shield tuning", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 4;
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", { hp: 2, actionCount: 1 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { shielded: true });
    const findUrgentShield = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "shield" &&
          evaluation.decision.target.kind === "monster" &&
          evaluation.decision.target.slotKey === "cpu_front_left",
      );
    const urgentBaseline = findUrgentShield();
    const urgentTuned = findUrgentShield({ tunings: { cpu: { situationalBias: { whiteStrictShieldPenalty: 10 } } } });

    expect(urgentBaseline).toBeDefined();
    expect(urgentTuned).toBeDefined();
    expect(urgentTuned?.totalScore).toBeCloseTo(urgentBaseline?.totalScore ?? 0);
  });

  it("penalizes white shields that remain lethal after master attack pressure", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 4;
    game.players.player.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", { hp: 2, actionCount: 1 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { shielded: true });

    const findShield = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "shield" &&
          evaluation.decision.target.kind === "monster" &&
          evaluation.decision.target.slotKey === "cpu_front_left",
      );
    const baseline = findShield();
    const tuned = findShield({ tunings: { cpu: { situationalBias: { whiteShieldBreakthroughPenalty: 9 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) - 9);
  });

  it("does not penalize white shields that remove master attack lethal pressure", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 4;
    game.players.player.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 3, actionCount: 1 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { shielded: true });

    const findShield = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "shield" &&
          evaluation.decision.target.kind === "monster" &&
          evaluation.decision.target.slotKey === "cpu_front_left",
      );
    const baseline = findShield();
    const tuned = findShield({ tunings: { cpu: { situationalBias: { whiteShieldBreakthroughPenalty: 9 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo(baseline?.totalScore ?? 0);
  });

  it("bonuses safe retreat for a threatened white back-role monster in the front row", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 4;
    game.players.player.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("card_051", "cpu", { hp: 2 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { shielded: true });

    const findRetreat = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options)
        .filter(
          (evaluation) =>
            evaluation.decision.type === "move" &&
            evaluation.decision.fromSlotKey === "cpu_front_left" &&
            game.slots[evaluation.decision.toSlotKey].row === "back",
        )
        .sort((a, b) => b.totalScore - a.totalScore)[0];
    const baseline = findRetreat();
    const tuned = findRetreat({ tunings: { cpu: { situationalBias: { whiteSafeRetreatOverShieldBonus: 11 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) + 11);
  });

  it("penalizes white retreats that consume an unacted back-row ally", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 0;
    game.slots.cpu_front_left.monster = createActiveMonster("card_051", "cpu", { hp: 1 });
    game.slots.cpu_front_right.monster = createActiveMonster("takokke", "cpu");
    game.slots.cpu_back_left.monster = createActiveMonster("yanbaru", "cpu");
    game.slots.cpu_back_right.monster = createActiveMonster("morgan", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");

    const findRetreat = (options = {}) =>
      inspectCpuDecisionEvaluations(game, { profile: "white", ...options }).find(
        (evaluation) =>
          evaluation.decision.type === "move" &&
          evaluation.decision.fromSlotKey === "cpu_front_left" &&
          evaluation.decision.toSlotKey === "cpu_back_left",
      );
    const penalized = findRetreat();
    const unpenalized = findRetreat({
      tunings: { cpu: { situationalBias: { whiteReadyBacklineRetreatPenalty: 0 } } },
    });

    expect(penalized).toBeDefined();
    expect(unpenalized).toBeDefined();
    expect(penalized?.totalScore).toBeLessThan((unpenalized?.totalScore ?? 0) - 170);
  });

  it("does not list shielding before a safe back-role retreat", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 4;
    game.players.player.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("card_051", "cpu", { hp: 2 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { shielded: true });

    const decisions = listCpuDecisions(game);

    expect(
      decisions.some(
        (decision) =>
          decision.type === "master_action" &&
          decision.actionId === "shield" &&
          decision.target.kind === "monster" &&
          decision.target.slotKey === "cpu_front_left",
      ),
    ).toBe(false);
    expect(
      decisions.some(
        (decision) =>
          decision.type === "move" &&
          decision.fromSlotKey === "cpu_front_left" &&
          game.slots[decision.toSlotKey].row === "back",
      ),
    ).toBe(true);
  });

  it("lists a front-role shield after current-turn work is spent", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 4;
    game.players.player.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 2, actionCount: 1 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { shielded: true });

    const shield = listCpuDecisions(game).find(
      (decision) =>
        decision.type === "master_action" &&
        decision.actionId === "shield" &&
        decision.target.kind === "monster" &&
        decision.target.slotKey === "cpu_front_left",
    );

    expect(shield).toBeDefined();
  });

  it("penalizes low-stone white shield, wake, and summon setup by decision type", () => {
    const shieldGame = createCpuGame();
    shieldGame.players.cpu.masterId = "white";
    shieldGame.players.cpu.hand = [];
    shieldGame.players.cpu.stones = 3;
    shieldGame.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", { hp: 2, actionCount: 1 });
    shieldGame.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    const findShield = (options = {}) =>
      inspectCpuDecisionEvaluations(shieldGame, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "shield" &&
          evaluation.decision.target.kind === "monster" &&
          evaluation.decision.target.slotKey === "cpu_front_left",
      );
    const shieldBaseline = findShield();
    const shieldTuned = findShield({ tunings: { cpu: { situationalBias: { whiteLowStoneShieldPenalty: 7 } } } });

    const wakeGame = createCpuGame();
    wakeGame.players.cpu.masterId = "white";
    wakeGame.players.cpu.hand = [];
    wakeGame.players.cpu.stones = 3;
    wakeGame.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { status: "prepared" });
    wakeGame.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 2 });
    const findWake = (options = {}) =>
      inspectCpuDecisionEvaluations(wakeGame, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "wake_up" &&
          evaluation.decision.target.kind === "monster" &&
          evaluation.decision.target.slotKey === "cpu_front_left",
      );
    const wakeBaseline = findWake();
    const wakeTuned = findWake({ tunings: { cpu: { situationalBias: { whiteLowStoneWakePenalty: 7 } } } });

    const summonGame = createCpuGame([{ cardId: "takokke", instanceId: "cpu_summon_takokke" }]);
    summonGame.players.cpu.masterId = "white";
    summonGame.players.cpu.stones = 2;
    const findSummon = (options = {}) =>
      inspectCpuDecisionEvaluations(summonGame, options).find(
        (evaluation) => evaluation.decision.type === "summon" && evaluation.decision.handInstanceId === "cpu_summon_takokke",
      );
    const summonBaseline = findSummon();
    const summonTuned = findSummon({ tunings: { cpu: { situationalBias: { whiteLowStoneSummonPenalty: 7 } } } });

    const focusGame = createCpuGame();
    focusGame.players.cpu.masterId = "white";
    focusGame.players.cpu.hand = [];
    focusGame.players.cpu.stones = 1;
    focusGame.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    const findFocus = (options = {}) =>
      inspectCpuDecisionEvaluations(focusGame, options).find(
        (evaluation) => evaluation.decision.type === "focus" && evaluation.decision.slotKey === "cpu_front_left",
      );
    const focusBaseline = findFocus();
    const focusTuned = findFocus({ tunings: { cpu: { situationalBias: { whiteLowStoneFocusPenalty: 7 } } } });

    expect(shieldBaseline).toBeDefined();
    expect(shieldTuned).toBeDefined();
    expect(shieldTuned?.totalScore).toBeCloseTo((shieldBaseline?.totalScore ?? 0) - 7);
    expect(wakeBaseline).toBeDefined();
    expect(wakeTuned).toBeDefined();
    expect(wakeTuned?.totalScore).toBeCloseTo((wakeBaseline?.totalScore ?? 0) - 7);
    expect(summonBaseline).toBeDefined();
    expect(summonTuned).toBeDefined();
    expect(summonTuned?.totalScore).toBeCloseTo((summonBaseline?.totalScore ?? 0) - 7);
    expect(focusBaseline).toBeDefined();
    expect(focusTuned).toBeDefined();
    expect(focusTuned?.totalScore).toBeCloseTo((focusBaseline?.totalScore ?? 0) - 7);
  });

  it("penalizes low-stone setup while enemy front threats remain", () => {
    const game = createCpuGame([{ cardId: "takokke", instanceId: "cpu_threat_left_summon" }]);
    game.players.cpu.masterId = "white";
    game.players.cpu.stones = 1;
    for (const slot of Object.values(game.slots)) {
      delete slot.monster;
    }
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", { hp: 3 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { shielded: true });

    const findSummon = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) => evaluation.decision.type === "summon" && evaluation.decision.handInstanceId === "cpu_threat_left_summon",
      );
    const baseline = findSummon();
    const tuned = findSummon({ tunings: { cpu: { situationalBias: { whiteThreatLeftLowStoneSetupPenalty: 7 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) - 7);
  });

  it("does not penalize urgent low-stone shield while enemy front threats remain", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 2;
    for (const slot of Object.values(game.slots)) {
      delete slot.monster;
    }
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", { hp: 2, actionCount: 1 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { shielded: true });

    const findShield = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "shield" &&
          evaluation.decision.target.kind === "monster" &&
          evaluation.decision.target.slotKey === "cpu_front_left",
      );
    const baseline = findShield();
    const tuned = findShield({ tunings: { cpu: { situationalBias: { whiteThreatLeftLowStoneSetupPenalty: 7 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo(baseline?.totalScore ?? 0);
  });

  it("bonuses white shield and wake decisions when they convert into work", () => {
    const shieldGame = createCpuGame();
    shieldGame.players.cpu.masterId = "white";
    shieldGame.players.cpu.hand = [];
    shieldGame.players.cpu.stones = 4;
    shieldGame.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", { hp: 2, actionCount: 1 });
    shieldGame.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    const findShield = (options = {}) =>
      inspectCpuDecisionEvaluations(shieldGame, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "shield" &&
          evaluation.decision.target.kind === "monster" &&
          evaluation.decision.target.slotKey === "cpu_front_left",
      );
    const shieldBaseline = findShield();
    const shieldTuned = findShield({ tunings: { cpu: { situationalBias: { whiteShieldThreatConversionBonus: 8 } } } });

    const wakeGame = createCpuGame();
    wakeGame.players.cpu.masterId = "white";
    wakeGame.players.cpu.hand = [];
    wakeGame.players.cpu.stones = 4;
    wakeGame.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      status: "prepared",
    });
    wakeGame.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 2 });
    const findWake = (options = {}) =>
      inspectCpuDecisionEvaluations(wakeGame, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "wake_up" &&
          evaluation.decision.target.kind === "monster" &&
          evaluation.decision.target.slotKey === "cpu_front_left",
      );
    const wakeBaseline = findWake();
    const wakeTuned = findWake({ tunings: { cpu: { situationalBias: { whiteWakeImmediateWorkBonus: 8 } } } });

    expect(shieldBaseline).toBeDefined();
    expect(shieldTuned).toBeDefined();
    expect(shieldTuned?.totalScore).toBeCloseTo((shieldBaseline?.totalScore ?? 0) + 8);
    expect(wakeBaseline).toBeDefined();
    expect(wakeTuned).toBeDefined();
    expect(wakeTuned?.totalScore).toBeCloseTo((wakeBaseline?.totalScore ?? 0) + 8);
  });

  it("bonuses white closeout pressure after a shield is already committed", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 0;
    game.players.player.masterHp = 3;
    game.slots.cpu_back_left.monster = createActiveMonster("morgan", "cpu", {
      hp: 4,
      level: 2,
      shielded: true,
    });

    const findMasterAttack = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "attack" &&
          evaluation.decision.action.attackerSlotKey === "cpu_back_left" &&
          evaluation.decision.action.target.kind === "master",
      );
    const baseline = findMasterAttack();
    const tuned = findMasterAttack({ tunings: { cpu: { situationalBias: { whiteCloseoutAfterShieldBonus: 8 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) + 8);
  });

  it("penalizes a second low-stone white shield commitment", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", { hp: 2, actionCount: 1 });
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu", { shielded: true, actionCount: 1 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { shielded: true });
    game.turnMasterActionHistory = [
      {
        playerId: "cpu",
        actionId: "shield",
        target: { kind: "monster", slotKey: "cpu_back_left" },
        turnNumber: game.turnNumber,
      },
    ];

    const findShield = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "shield" &&
          evaluation.decision.target.kind === "monster" &&
          evaluation.decision.target.slotKey === "cpu_front_left",
      );
    const baseline = findShield();
    const tuned = findShield({ tunings: { cpu: { situationalBias: { whiteSecondShieldLowStonePenalty: 7 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore ?? 0).toBeLessThanOrEqual((baseline?.totalScore ?? 0) - 7);
  });

  it("penalizes a second same-turn white shield commitment even when stones remain", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 5;
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", { hp: 2, actionCount: 1 });
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu", { shielded: true, actionCount: 1 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { shielded: true });
    game.turnMasterActionHistory = [
      {
        playerId: "cpu",
        actionId: "shield",
        target: { kind: "monster", slotKey: "cpu_back_left" },
        turnNumber: game.turnNumber,
      },
    ];

    const findShield = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "shield" &&
          evaluation.decision.target.kind === "monster" &&
          evaluation.decision.target.slotKey === "cpu_front_left",
      );
    const baseline = findShield();
    const tuned = findShield({ tunings: { cpu: { situationalBias: { whiteSecondShieldCommitmentPenalty: 13 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) - 13);
  });

  it("does not penalize a high-value second white shield target", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 5;
    game.slots.cpu_front_left.monster = createActiveMonster("morgan", "cpu", {
      level: 2,
      hp: 2,
      actionCount: 1,
    });
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu", { shielded: true, actionCount: 1 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { shielded: true });
    game.turnMasterActionHistory = [
      {
        playerId: "cpu",
        actionId: "shield",
        target: { kind: "monster", slotKey: "cpu_back_left" },
        turnNumber: game.turnNumber,
      },
    ];

    const findShield = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "shield" &&
          evaluation.decision.target.kind === "monster" &&
          evaluation.decision.target.slotKey === "cpu_front_left",
      );
    const baseline = findShield();
    const tuned = findShield({ tunings: { cpu: { situationalBias: { whiteSecondShieldCommitmentPenalty: 13 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo(baseline?.totalScore ?? 0);
  });

  it("does not penalize a first current-turn shield just because a previous shield remains", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", { hp: 2, actionCount: 1 });
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu", { shielded: true, actionCount: 1 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");

    const findShield = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "shield" &&
          evaluation.decision.target.kind === "monster" &&
          evaluation.decision.target.slotKey === "cpu_front_left",
      );
    const baseline = findShield();
    const tuned = findShield({ tunings: { cpu: { situationalBias: { whiteSecondShieldLowStonePenalty: 7 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo(baseline?.totalScore ?? 0);
  });

  it("uses the same-turn second shield guard in the default white profile", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", { hp: 2, actionCount: 1 });
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu", { shielded: true, actionCount: 1 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.turnMasterActionHistory = [
      {
        playerId: "cpu",
        actionId: "shield",
        target: { kind: "monster", slotKey: "cpu_back_left" },
        turnNumber: game.turnNumber,
      },
    ];

    const findShield = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "shield" &&
          evaluation.decision.target.kind === "monster" &&
          evaluation.decision.target.slotKey === "cpu_front_left",
      );
    const defaultWhite = findShield({ profile: "white" });
    const withoutGuard = findShield({
      profile: "white",
      tuning: { situationalBias: { whiteSecondShieldLowStonePenalty: 0 } },
    });

    expect(defaultWhite).toBeDefined();
    expect(withoutGuard).toBeDefined();
    expect(defaultWhite?.totalScore).toBeCloseTo((withoutGuard?.totalScore ?? 0) - 120);
  });

  it("uses the same-turn second shield commitment guard in the default white profile", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 5;
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", { hp: 2, actionCount: 1 });
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu", { shielded: true, actionCount: 1 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { shielded: true });
    game.turnMasterActionHistory = [
      {
        playerId: "cpu",
        actionId: "shield",
        target: { kind: "monster", slotKey: "cpu_back_left" },
        turnNumber: game.turnNumber,
      },
    ];

    const findShield = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "shield" &&
          evaluation.decision.target.kind === "monster" &&
          evaluation.decision.target.slotKey === "cpu_front_left",
      );
    const defaultWhite = findShield({ profile: "white" });
    const withoutGuard = findShield({
      profile: "white",
      tuning: { situationalBias: { whiteSecondShieldCommitmentPenalty: 0 } },
    });

    expect(defaultWhite).toBeDefined();
    expect(withoutGuard).toBeDefined();
    expect(defaultWhite?.totalScore ?? 0).toBeLessThanOrEqual((withoutGuard?.totalScore ?? 0) - 180);
  });

  it("bonuses low-stone white focus only when it converts into next-turn work", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 1;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 2 });

    const findFocus = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) => evaluation.decision.type === "focus" && evaluation.decision.slotKey === "cpu_front_left",
      );
    const baseline = findFocus();
    const tuned = findFocus({ tunings: { cpu: { situationalBias: { whiteLowStoneFocusConversionBonus: 9 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) + 9);
  });

  it("penalizes low-stone white focus when an attack is still available", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 1;
    for (const slot of Object.values(game.slots)) {
      delete slot.monster;
    }
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 3 });

    const findFocus = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) => evaluation.decision.type === "focus" && evaluation.decision.slotKey === "cpu_front_left",
      );
    const baseline = findFocus();
    const tuned = findFocus({ tunings: { cpu: { situationalBias: { whiteLowStoneFocusMissedAttackPenalty: 7 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) - 7);
  });

  it("does not penalize low-stone white focus when no attack is available", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 1;
    for (const slot of Object.values(game.slots)) {
      delete slot.monster;
    }
    game.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu");

    const findFocus = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) => evaluation.decision.type === "focus" && evaluation.decision.slotKey === "cpu_back_left",
      );
    const baseline = findFocus();
    const tuned = findFocus({ tunings: { cpu: { situationalBias: { whiteLowStoneFocusMissedAttackPenalty: 7 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo(baseline?.totalScore ?? 0);
  });

  it("bonuses white attacks against enemy front threat sources", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    for (const slot of Object.values(game.slots)) {
      delete slot.monster;
    }
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 3 });

    const findAttack = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "attack" &&
          evaluation.decision.action.attackerSlotKey === "cpu_front_left" &&
          evaluation.decision.action.target.kind === "monster" &&
          evaluation.decision.action.target.slotKey === "player_front_left",
      );
    const baseline = findAttack();
    const tuned = findAttack({ tunings: { cpu: { situationalBias: { whiteThreatSourceAttackBonus: 7 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) + 7);
  });

  it("treats spent enemy front attackers as next-turn threat sources", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.player.masterId = "white";
    game.players.cpu.hand = [];
    for (const slot of Object.values(game.slots)) {
      delete slot.monster;
    }
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      hp: 3,
      actionCount: 1,
    });

    const findAttack = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "attack" &&
          evaluation.decision.action.attackerSlotKey === "cpu_front_left" &&
          evaluation.decision.action.target.kind === "monster" &&
          evaluation.decision.action.target.slotKey === "player_front_left",
      );
    const baseline = findAttack();
    const tuned = findAttack({ tunings: { cpu: { situationalBias: { whiteThreatSourceAttackBonus: 7 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) + 7);
  });

  it("bonuses low-stone setup only after current-turn work has cleared front threats", () => {
    const clearGame = createCpuGame();
    clearGame.players.cpu.masterId = "white";
    clearGame.players.cpu.hand = [];
    clearGame.players.cpu.stones = 1;
    for (const slot of Object.values(clearGame.slots)) {
      delete slot.monster;
    }
    clearGame.slots.cpu_back_left.monster = createActiveMonster("takokke", "cpu", { actionCount: 1 });
    clearGame.slots.cpu_back_right.monster = createActiveMonster("takokke", "cpu");

    const findClearFocus = (options = {}) =>
      inspectCpuDecisionEvaluations(clearGame, options).find(
        (evaluation) => evaluation.decision.type === "focus" && evaluation.decision.slotKey === "cpu_back_right",
      );
    const clearBaseline = findClearFocus();
    const clearTuned = findClearFocus({ tunings: { cpu: { situationalBias: { whiteSetupAfterThreatReductionBonus: 7 } } } });

    const threatenedGame = structuredClone(clearGame);
    threatenedGame.slots.cpu_front_right.monster = createActiveMonster("takokke", "cpu", { actionCount: 1 });
    threatenedGame.slots.player_front_right.monster = createActiveMonster("takokke", "player");
    const findThreatenedFocus = (options = {}) =>
      inspectCpuDecisionEvaluations(threatenedGame, options).find(
        (evaluation) => evaluation.decision.type === "focus" && evaluation.decision.slotKey === "cpu_back_right",
      );
    const threatenedBaseline = findThreatenedFocus();
    const threatenedTuned = findThreatenedFocus({ tunings: { cpu: { situationalBias: { whiteSetupAfterThreatReductionBonus: 7 } } } });

    expect(clearBaseline).toBeDefined();
    expect(clearTuned).toBeDefined();
    expect(clearTuned?.totalScore).toBeCloseTo((clearBaseline?.totalScore ?? 0) + 7);
    expect(threatenedBaseline).toBeDefined();
    expect(threatenedTuned).toBeDefined();
    expect(threatenedTuned?.totalScore).toBeCloseTo(threatenedBaseline?.totalScore ?? 0);
  });

  it("penalizes low-value white attacks into redirect-marked enemies", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    for (const slot of Object.values(game.slots)) {
      delete slot.monster;
    }
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("sigma", "player", {
      hp: 5,
      scapegoat: true,
    });

    const findAttack = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "attack" &&
          evaluation.decision.action.target.kind === "monster" &&
          evaluation.decision.action.target.slotKey === "player_front_left",
      );
    const baseline = findAttack();
    const tuned = findAttack({ tunings: { cpu: { situationalBias: { whiteRedirectMarkedAttackPenalty: 7 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore ?? 0).toBeLessThanOrEqual((baseline?.totalScore ?? 0) - 7);
  });

  it("does not penalize redirect-marked attacks that put the target into kill range", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    for (const slot of Object.values(game.slots)) {
      delete slot.monster;
    }
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      hp: 3,
      provokeTargetSlotKey: "cpu_front_left",
    });

    const findAttack = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "attack" &&
          evaluation.decision.action.target.kind === "monster" &&
          evaluation.decision.action.target.slotKey === "player_front_left",
      );
    const baseline = findAttack();
    const tuned = findAttack({ tunings: { cpu: { situationalBias: { whiteRedirectMarkedAttackPenalty: 7 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo(baseline?.totalScore ?? 0);
  });

  it("bonuses white wake-up when work is visible and exposure is not lethal", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 4;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      status: "prepared",
    });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 2 });

    const findWake = (options = {}) =>
      inspectCpuDecisionEvaluations(game, options).find(
        (evaluation) =>
          evaluation.decision.type === "master_action" &&
          evaluation.decision.actionId === "wake_up" &&
          evaluation.decision.target.kind === "monster" &&
          evaluation.decision.target.slotKey === "cpu_front_left",
      );
    const baseline = findWake();
    const tuned = findWake({ tunings: { cpu: { situationalBias: { whiteWakeSafeWorkBonus: 7 } } } });

    expect(baseline).toBeDefined();
    expect(tuned).toBeDefined();
    expect(tuned?.totalScore).toBeCloseTo((baseline?.totalScore ?? 0) + 7);
  });

  it("keeps a backline opening monster in the back row when no front guard is available", () => {
    const game = createCpuGame([{ instanceId: "cpu_beyond_hand", cardId: "beyond" }]);
    game.players.cpu.masterId = "white";
    game.players.cpu.stones = 1;
    for (const slot of Object.values(game.slots)) {
      delete slot.monster;
    }

    const decision = chooseCpuDecision(game, { profile: "white" });

    expect(decision.type).toBe("summon");
    if (decision.type === "summon") {
      expect(decision.handInstanceId).toBe("cpu_beyond_hand");
      expect(decision.slotKey).toContain("_back_");
    }
  });

  it("keeps a lone opening front-role monster in the back row when wake-up has no work", () => {
    const game = createCpuGame([{ instanceId: "cpu_takokke_hand", cardId: "takokke" }]);
    game.players.cpu.masterId = "white";
    game.players.cpu.stones = 5;
    for (const slot of Object.values(game.slots)) {
      delete slot.monster;
    }

    const decision = chooseCpuDecision(game, { profile: "white" });

    expect(decision.type).toBe("summon");
    if (decision.type === "summon") {
      expect(decision.handInstanceId).toBe("cpu_takokke_hand");
      expect(decision.slotKey).toContain("_back_");
    }
  });

  it("does not wake a lone front monster when it cannot act before passing the turn", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 4;
    for (const slot of Object.values(game.slots)) {
      delete slot.monster;
    }
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { status: "prepared" });

    const decision = chooseCpuDecision(game, { profile: "white" });

    expect(decision.type).toBe("end_turn");
  });

  it("uses black master berserk power when it creates a monster kill", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "black";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 3 });

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("master_action");
    if (decision.type === "master_action") {
      expect(decision.actionId).toBe("berserk_power");
      expect(decision.target).toEqual({ kind: "monster", slotKey: "cpu_front_left" });
    }
  });

  it("prefers white level-up with meaningful HP recovery over full-HP level-up", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "white";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 1;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      hp: 5,
      instanceId: "cpu_full_takokke",
    });
    game.slots.cpu_front_right.monster = createActiveMonster("takokke", "cpu", {
      hp: 2,
      instanceId: "cpu_wounded_takokke",
    });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      hp: 2,
      instanceId: "player_left_takokke",
    });
    game.slots.player_front_right.monster = createActiveMonster("takokke", "player", {
      hp: 2,
      instanceId: "player_right_takokke",
    });

    const decision = chooseCpuDecision(game, { profile: "strong" });

    expect(decision.type).toBe("attack");
    if (decision.type === "attack") {
      expect(decision.action.attackerSlotKey).toBe("cpu_front_right");
      expect(decision.action.target).toEqual({ kind: "monster", slotKey: "player_front_right" });
    }
  });

  it("can choose a legal decision with the strong AI profile", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "black";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 3 });

    const decision = chooseCpuDecision(game, { profile: "strong" });
    const next = applyCpuDecision(game, decision);

    expect(next.currentPlayer).toBeDefined();
    expect(next.log.some((entry) => entry.startsWith("CPU判断:"))).toBe(true);
  });

  it("does not overvalue black master berserk power as a two-power boost", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "black";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("sigma", "cpu");
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 3 });

    const decisions = listCpuDecisions(game);

    expect(
      decisions.some(
        (decision) =>
          decision.type === "master_action" &&
          decision.actionId === "berserk_power" &&
          decision.target.kind === "monster" &&
          decision.target.slotKey === "cpu_front_left",
      ),
    ).toBe(false);
  });

  it("keeps black strong AI on direct master damage after berserk power", () => {
    let game = createCpuGame();
    game.players.cpu.masterId = "black";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    const setupDecision = chooseCpuDecision(game, { profile: "strong" });
    expect(setupDecision.type).toBe("master_action");
    if (setupDecision.type !== "master_action") {
      return;
    }
    expect(setupDecision.actionId).toBe("berserk_power");
    game = applyCpuDecision(game, setupDecision);

    const attackDecision = chooseCpuDecision(game, { profile: "strong" });

    expect(attackDecision.type).toBe("attack");
    if (attackDecision.type === "attack") {
      expect(attackDecision.action.target).toEqual({ kind: "master", playerId: "player" });
    }
  });

  it("lists black master earth anger when the field-wide exchange is favorable", () => {
    const game = createCpuGame();
    game.players.cpu.masterId = "black";
    game.players.cpu.hand = [];
    game.players.cpu.stones = 6;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 3 });
    game.slots.player_front_right.monster = createActiveMonster("sigma", "player", { hp: 3 });

    const decisions = listCpuDecisions(game);

    expect(
      decisions.some(
        (decision) =>
          decision.type === "master_action" &&
          decision.actionId === "earth_anger" &&
          decision.target.kind === "master" &&
          decision.target.playerId === "cpu",
      ),
    ).toBe(true);
  });

  it("summons front-role cards to the front row", () => {
    const game = createCpuGame([{ cardId: "takokke", instanceId: "cpu_takokke_test" }]);
    game.players.cpu.masterId = "black";

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
      expect(decision.slotKey).toBe("player_back_left");
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

  it("does not spend closeout turns on focus-only actions", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 0;
    game.players.cpu.masterHp = 4;
    game.slots.cpu_back_left.monster = createActiveMonster("yanbaru", "cpu");

    const decisions = listCpuDecisions(game);

    expect(decisions.some((decision) => decision.type === "focus")).toBe(false);
  });

  it("does not use closeout master attack for non-lethal chip damage", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 3;
    game.players.player.masterHp = 4;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 3 });

    const decisions = listCpuDecisions(game);

    expect(
      decisions.some(
        (decision) =>
          decision.type === "master_action" &&
          decision.actionId === "master_attack" &&
          decision.target.kind === "monster" &&
          decision.target.slotKey === "player_front_left",
      ),
    ).toBe(false);
  });

  it("applies the chosen decision through existing rule functions", () => {
    const game = createCpuGame([{ cardId: "takokke", instanceId: "cpu_takokke_test" }]);
    const decision = chooseCpuDecision(game);

    const next = applyCpuDecision(game, decision);

    expect(next.slots.cpu_back_left.monster?.cardId).toBe("takokke");
    expect(next.players.cpu.stones).toBe(2);
    expect(next.log.some((entry) => entry.startsWith("CPU判断:"))).toBe(true);
    expect(next.log.find((entry) => entry.startsWith("CPU判断:"))).not.toContain("タコッケー");
  });

  it("wakes up a prepared ally when it can immediately defeat an enemy", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 5;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      status: "prepared",
    });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 2 });

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("master_action");
    if (decision.type === "master_action") {
      expect(decision.actionId).toBe("wake_up");
      expect(decision.reason).toContain("ウェイクアップ");
    }
  });

  it("does not wake a prepared ally just for non-lethal action or future focus", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 5;
    game.slots.cpu_back_left.monster = createActiveMonster("morgan", "cpu", {
      status: "prepared",
      hp: 4,
    });

    const decisions = listCpuDecisions(game);

    expect(
      decisions.some(
        (decision) =>
          decision.type === "master_action" &&
          decision.actionId === "wake_up" &&
          decision.target.kind === "monster" &&
          decision.target.slotKey === "cpu_back_left",
      ),
    ).toBe(false);
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
    game.players.player.stones = 0;
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", { hp: 2, actionCount: 1 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { shielded: true });

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("master_action");
    if (decision.type === "master_action") {
      expect(decision.actionId).toBe("shield");
      expect(decision.target).toEqual({ kind: "monster", slotKey: "cpu_front_left" });
      expect(decision.reason).toContain("シールド");
    }
  });

  it("treats an enemy that acted last turn as a next-turn shield threat", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 5;
    game.players.player.stones = 0;
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", { hp: 2, actionCount: 1 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { actionCount: 1, shielded: true });

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("master_action");
    if (decision.type === "master_action") {
      expect(decision.actionId).toBe("shield");
      expect(decision.target).toEqual({ kind: "monster", slotKey: "cpu_front_left" });
    }
  });

  it("defers white shield while current-turn monster work remains", () => {
    const game = createCpuGame([]);
    game.players.cpu.masterId = "white";
    game.players.cpu.stones = 5;
    game.players.player.stones = 0;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 2 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");

    const decisions = listCpuDecisions(game);

    expect(
      decisions.some(
        (decision) =>
          decision.type === "attack" &&
          decision.action.attackerSlotKey === "cpu_front_left" &&
          decision.action.target.kind === "monster" &&
          decision.action.target.slotKey === "player_front_left",
      ),
    ).toBe(true);
    expect(
      decisions.some(
        (decision) =>
          decision.type === "master_action" &&
          decision.actionId === "shield" &&
          decision.target.kind === "monster" &&
          decision.target.slotKey === "cpu_front_left",
      ),
    ).toBe(false);
  });

  it("keeps white shield before attacking into immediate counter damage", () => {
    const game = createCpuGame([]);
    game.players.cpu.masterId = "white";
    game.players.cpu.stones = 5;
    game.players.player.stones = 0;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 2 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { dragonShield: true });

    const decisions = listCpuDecisions(game);

    expect(
      decisions.some(
        (decision) =>
          decision.type === "master_action" &&
          decision.actionId === "shield" &&
          decision.target.kind === "monster" &&
          decision.target.slotKey === "cpu_front_left",
      ),
    ).toBe(true);
  });

  it("moves a front back-role ally instead of shielding when master attack still breaks through", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 5;
    game.players.player.stones = 3;
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", { hp: 2 });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("move");
    if (decision.type === "move") {
      expect(decision.fromSlotKey).toBe("cpu_front_left");
      expect(decision.toSlotKey).toBe("cpu_back_left");
    }
  });

  it("does not spend deck-out shield on allies without master pressure", () => {
    const game = createCpuGame([]);
    game.players.cpu.deck = [];
    game.players.cpu.stones = 5;
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", {
      hp: 2,
      levelFixed: true,
    });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");

    const decisions = listCpuDecisions(game);

    expect(
      decisions.some(
        (decision) =>
          decision.type === "master_action" &&
          decision.actionId === "shield" &&
          decision.target.kind === "monster" &&
          decision.target.slotKey === "cpu_front_left",
      ),
    ).toBe(false);
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

  it("uses thunder as non-lethal master pressure over monster chip damage", () => {
    const game = createCpuGame([{ cardId: "thunder", instanceId: "cpu_thunder_pressure" }]);
    game.players.cpu.masterId = "black";
    game.players.cpu.stones = 4;
    game.players.player.masterHp = 8;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", { hp: 5 });

    const decision = chooseCpuDecision(game, { profile: "strong" });

    expect(decision.type).toBe("magic");
    if (decision.type === "magic") {
      expect(decision.action.handInstanceId).toBe("cpu_thunder_pressure");
      expect(decision.action.target).toEqual({ kind: "master", playerId: "player" });
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

  it("uses power up so Polyspinner can close out a 2 HP master with two actions", () => {
    let game = createCpuGame([{ cardId: "power_up", instanceId: "cpu_power_up_polyspinner" }]);
    game.players.cpu.stones = 3;
    game.players.player.masterHp = 2;
    game.slots.cpu_front_left.monster = createActiveMonster("polyspinner", "cpu");

    const powerUp = chooseCpuDecision(game);
    expect(powerUp.type).toBe("magic");
    if (powerUp.type === "magic") {
      expect(powerUp.action.handInstanceId).toBe("cpu_power_up_polyspinner");
      expect(powerUp.action.target).toEqual({ kind: "monster", slotKey: "cpu_front_left" });
    }

    game = applyCpuDecision(game, powerUp);
    const firstAttack = chooseCpuDecision(game);
    expect(firstAttack.type).toBe("attack");
    if (firstAttack.type === "attack") {
      expect(firstAttack.action.target).toEqual({ kind: "master", playerId: "player" });
    }

    game = applyCpuDecision(game, firstAttack);
    expect(game.players.player.masterHp).toBe(1);
    expect(game.slots.cpu_front_left.monster).toMatchObject({ actionCount: 1, powerUp: true });

    const secondAttack = chooseCpuDecision(game);
    expect(secondAttack.type).toBe("attack");
    if (secondAttack.type === "attack") {
      expect(secondAttack.action.target).toEqual({ kind: "master", playerId: "player" });
    }

    game = applyCpuDecision(game, secondAttack);
    expect(game.winner).toBe("cpu");
  });

  it("does not use damage magic to defeat its own monster", () => {
    const game = createCpuGame([{ cardId: "card_026", instanceId: "cpu_spark_test" }]);
    game.players.cpu.stones = 1;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 1 });

    const decision = chooseCpuDecision(game);

    expect(decision.type).not.toBe("magic");
  });

  it("evaluates secondary targets for double shield magic", () => {
    const game = createCpuGame([{ cardId: "card_030", instanceId: "cpu_double_shield_test" }]);
    game.players.cpu.stones = 5;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", { hp: 2, actionCount: 1 });
    game.slots.cpu_front_right.monster = createActiveMonster("beyond", "cpu", { hp: 2, actionCount: 1 });

    const decisions = listCpuDecisions(game).filter(
      (decision) => decision.type === "magic" && decision.action.handInstanceId === "cpu_double_shield_test",
    );

    expect(decisions.length).toBeGreaterThan(0);
    expect(decisions.some((decision) => decision.type === "magic" && !!decision.action.secondaryTarget)).toBe(true);
    const bestDoubleShield = decisions.reduce((best, decision) => (decision.score > best.score ? decision : best));
    expect(bestDoubleShield.type).toBe("magic");
    if (bestDoubleShield.type === "magic") {
      expect(bestDoubleShield.action.secondaryTarget?.kind).toBe("monster");
      if (bestDoubleShield.action.secondaryTarget?.kind === "monster") {
        expect(game.slots[bestDoubleShield.action.secondaryTarget.slotKey].owner).toBe("cpu");
      }
    }
  });

  it("evaluates hand choices for shift change magic", () => {
    const game = createCpuGame([
      { cardId: "card_065", instanceId: "cpu_shift_test" },
      { cardId: "yanbaru", instanceId: "cpu_shift_yanbaru" },
      { cardId: "takokke", instanceId: "cpu_shift_takokke" },
    ]);
    game.players.cpu.stones = 5;
    game.slots.cpu_front_left.monster = createActiveMonster("card_001", "cpu");
    game.slots.cpu_front_right.monster = createActiveMonster("card_084", "cpu");
    game.slots.cpu_back_left.monster = createActiveMonster("sigma", "cpu");
    game.slots.cpu_back_right.monster = createActiveMonster("morgan", "cpu");

    const decisions = listCpuDecisions(game).filter(
      (decision) => decision.type === "magic" && decision.action.handInstanceId === "cpu_shift_test",
    );

    expect(decisions.some((decision) => decision.type === "magic" && decision.action.secondaryHandInstanceId === "cpu_shift_takokke")).toBe(true);
    const bestShift = decisions.reduce((best, decision) => (decision.score > best.score ? decision : best));
    expect(bestShift.type).toBe("magic");
    if (bestShift.type === "magic") {
      expect(bestShift.action.secondaryHandInstanceId).toBe("cpu_shift_takokke");
    }
  });

  it("evaluates card search categories from the deck", () => {
    const game = createCpuGame([{ cardId: "card_123", instanceId: "cpu_search_test" }]);
    game.players.cpu.stones = 5;
    game.players.cpu.deck = [
      { cardId: "healing", instanceId: "cpu_search_magic" },
      { cardId: "card_107", instanceId: "cpu_search_front" },
      { cardId: "morgan", instanceId: "cpu_search_back" },
    ];

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("magic");
    if (decision.type === "magic") {
      expect(decision.action.handInstanceId).toBe("cpu_search_test");
      expect(decision.action.searchCategory).toBe("back");
    }
  });

  it("evaluates hand choices for Soul Switch commands", () => {
    const game = createCpuGame([
      { cardId: "yanbaru", instanceId: "cpu_soul_yanbaru" },
      { cardId: "takokke", instanceId: "cpu_soul_takokke" },
    ]);
    game.players.cpu.stones = 5;
    game.slots.cpu_front_left.monster = createActiveMonster("card_134", "cpu", { hp: 1 });

    const decisions = listCpuDecisions(game).filter(
      (decision) =>
        decision.type === "attack" &&
        decision.action.attackerSlotKey === "cpu_front_left" &&
        decision.action.commandId === "ソウルスイッチ",
    );

    expect(decisions.some((decision) => decision.type === "attack" && decision.action.secondaryHandInstanceId === "cpu_soul_takokke")).toBe(true);
    const bestSoulSwitch = decisions.reduce((best, decision) => (decision.score > best.score ? decision : best));
    expect(bestSoulSwitch.type).toBe("attack");
    if (bestSoulSwitch.type === "attack") {
      expect(bestSoulSwitch.action.secondaryHandInstanceId).toBe("cpu_soul_takokke");
    }
  });

  it("shields a monster that can convert survival into a next-turn level-up", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 2;
    game.slots.cpu_back_left.monster = createActiveMonster("morgan", "cpu", {
      actionCount: 1,
      hp: 2,
    });
    game.slots.player_back_left.monster = createActiveMonster("takokke", "player", {
      level: 2,
      hp: 2,
      investedStones: 2,
    });

    const decision = chooseCpuDecision(game);

    expect(decision.type).toBe("master_action");
    if (decision.type === "master_action") {
      expect(decision.actionId).toBe("shield");
      expect(decision.target).toEqual({ kind: "monster", slotKey: "cpu_back_left" });
      expect(decision.reason).toContain("レベルアップ");
    }
  });

  it("does not list a redundant shield action for an ally already protected", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 5;
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu", {
      hp: 2,
      shielded: true,
    });
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");

    const shieldDecisions = listCpuDecisions(game).filter(
      (decision) => decision.type === "master_action" && decision.actionId === "shield",
    );

    expect(
      shieldDecisions.some(
        (decision) =>
          decision.type === "master_action" &&
          decision.target.kind === "monster" &&
          decision.target.slotKey === "cpu_front_left",
      ),
    ).toBe(false);
  });

  it("does not take proactive white shield over direct master pressure", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 4;
    game.players.cpu.masterHp = 5;
    game.players.player.masterHp = 5;
    game.slots.cpu_front_left.monster = createActiveMonster("morgan", "cpu", {
      hp: 4,
      level: 2,
    });
    game.slots.cpu_back_left.monster = createActiveMonster("beyond", "cpu", {
      hp: 4,
    });

    const decisions = listCpuDecisions(game);

    expect(
      decisions.some(
        (decision) =>
          decision.type === "master_action" &&
          decision.actionId === "shield" &&
          decision.target.kind === "monster" &&
          decision.target.slotKey === "cpu_back_left",
      ),
    ).toBe(false);

    const decision = chooseCpuDecision(game, { profile: "strong" });
    expect(decision.type).toBe("attack");
    if (decision.type === "attack") {
      expect(decision.action.target).toEqual({ kind: "master", playerId: "player" });
    }
  });

  it("keeps high-value hand cards when evaluating refresh discard choices", () => {
    const game = createCpuGame([
      { cardId: "card_116", instanceId: "cpu_refresh_test" },
      { cardId: "thunder", instanceId: "cpu_keep_thunder" },
      { cardId: "morgan", instanceId: "cpu_keep_morgan" },
      { cardId: "card_027", instanceId: "cpu_discard_power_down" },
    ]);
    game.players.cpu.stones = 5;
    game.players.cpu.deck = [{ cardId: "morgan", instanceId: "cpu_refresh_draw" }];

    const refreshDecisions = listCpuDecisions(game).filter(
      (decision) => decision.type === "magic" && decision.action.handInstanceId === "cpu_refresh_test",
    );

    expect(refreshDecisions.length).toBeGreaterThan(0);
    const bestRefresh = refreshDecisions.reduce((best, decision) => (decision.score > best.score ? decision : best));
    expect(bestRefresh.type).toBe("magic");
    if (bestRefresh.type === "magic") {
      expect(bestRefresh.action.selectedHandInstanceIds).toEqual(["cpu_discard_power_down"]);
    }
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

  it("does not spend deck-out turns on placement-only movement", () => {
    const game = createCpuGame([]);
    game.players.cpu.deck = [];
    game.players.cpu.stones = 0;
    game.players.player.masterHp = 8;
    game.slots.cpu_front_left.monster = createActiveMonster("beyond", "cpu", {
      levelFixed: true,
    });

    const decisions = listCpuDecisions(game);

    expect(
      decisions.some(
        (decision) =>
          decision.type === "move" &&
          decision.fromSlotKey === "cpu_front_left" &&
          decision.toSlotKey === "cpu_back_left",
      ),
    ).toBe(false);
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

  it("does not choose a third same-turn move for placement-only improvement", () => {
    const game = createCpuGame([]);
    game.players.cpu.stones = 0;
    game.slots.cpu_front_left.monster = createActiveMonster("yanbaru", "cpu");
    game.turnMoveHistory = [
      {
        playerId: "cpu",
        fromSlotKey: "cpu_front_left",
        toSlotKey: "cpu_back_left",
        moverInstanceId: "cpu_yanbaru_cpu_ai_fixture",
      },
      {
        playerId: "cpu",
        fromSlotKey: "cpu_back_left",
        toSlotKey: "cpu_front_left",
        moverInstanceId: "cpu_yanbaru_cpu_ai_fixture",
      },
    ];

    const decision = chooseCpuDecision(game);

    expect(decision.type).not.toBe("move");
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
    for (let seed = 330; seed < 334; seed += 1) {
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
  }, 30_000);

  it("runs a short strong AI auto-play sequence without getting stuck", () => {
    let game = createInitialGame(340);
    for (let step = 0; step < 40 && !game.winner; step += 1) {
      game = runAutoStep(game, { profile: "strong" });
      if (game.pendingLevelUp) {
        game = runAutoStep(game, { profile: "strong" });
        expect(game.pendingLevelUp).toBeUndefined();
      }
    }

    expect(game.turnNumber).toBeGreaterThan(1);
  }, 30_000);

  it("finishes a representative auto-play seed range without exceptions or unresolved prompts", () => {
    const results: Array<{ seed: number; steps: number; turns: number; winner: PlayerId | undefined }> = [];

    for (let seed = 400; seed < 405; seed += 1) {
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
  }, 30_000);
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
