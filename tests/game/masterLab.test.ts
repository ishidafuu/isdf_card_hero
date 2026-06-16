import { describe, expect, it } from "vitest";
import {
  buildMasterLabMatchups,
  chooseMasterLabAction,
  formatMasterLabMarkdown,
  inspectMasterLabActionEvaluations,
  listMasterLabActionOptions,
  MASTER_LAB_CANDIDATES,
  playMasterLabAction,
  resolvedMasterLabActionCost,
  validateMasterLabCandidates,
} from "../../src/game/masterLab";
import {
  formatMasterLabSelectionLoopMarkdown,
  runMasterLabSelectionLoop,
} from "../../src/game/masterLabSelectionLoop";
import { createInitialGame } from "../../src/game/rules";
import { getMonsterDef } from "../../src/game/cards";
import type { MonsterState, PlayerId } from "../../src/game/types";

describe("master lab", () => {
  it("keeps experimental master definitions statically valid", () => {
    expect(validateMasterLabCandidates()).toEqual([]);
  });

  it("defines the decoy master around provoke and scapegoat", () => {
    const decoy = MASTER_LAB_CANDIDATES.find((candidate) => candidate.id === "decoy");
    expect(decoy).toBeDefined();
    expect(decoy?.actions.map((action) => action.id)).toEqual(["master_attack", "provoke", "scapegoat"]);

    const provoke = decoy?.actions.find((action) => action.id === "provoke");
    const scapegoat = decoy?.actions.find((action) => action.id === "scapegoat");
    expect(provoke).toMatchObject({ kind: "magic_ref", cardId: "card_097" });
    expect(scapegoat).toMatchObject({ kind: "magic_ref", cardId: "card_128" });
    expect(provoke ? resolvedMasterLabActionCost(provoke) : undefined).toBe(3);
    expect(scapegoat ? resolvedMasterLabActionCost(scapegoat) : undefined).toBe(2);
  });

  it("defines the timing candidate as a low-stress tempo master", () => {
    const timing = MASTER_LAB_CANDIDATES.find((candidate) => candidate.id === "timing");
    expect(timing).toBeDefined();
    expect(timing?.name).toBe("テンポマスター");
    expect(timing?.actions.map((action) => action.id)).toEqual(["master_attack", "quick_call", "shift"]);
    expect(timing?.actions.find((action) => action.id === "quick_call")).toMatchObject({
      kind: "experimental_effect",
      effectId: "accelerate_own_prepared_monster",
      cost: 1,
    });
    expect(timing?.actions.find((action) => action.id === "shift")).toMatchObject({
      kind: "experimental_effect",
      effectId: "move_or_swap_own_active_monster",
      cost: 2,
    });
    expect(JSON.stringify(timing)).not.toContain("delay_prepared_enemy");
    expect(JSON.stringify(timing)).not.toContain("ステイ");
  });

  it("runs a static fourth-master selection loop", () => {
    const report = runMasterLabSelectionLoop(new Date("2026-06-17T00:00:00.000Z"));

    expect(report.best.candidate.id).toBe("tempo");
    expect(report.best.judgement).toBe("prototype");
    expect(report.entries[0].candidate.label).toBe("テンポマスター");
    expect(report.entries.find((entry) => entry.candidate.id === "old_timing")?.judgement).toBe("reject");

    const markdown = formatMasterLabSelectionLoopMarkdown(report);
    expect(markdown).toContain("# Master Lab Selection Loop");
    expect(markdown).toContain("テンポマスター");
    expect(markdown).toContain("クイックコール");
    expect(markdown).toContain("旧タイミング型");
    expect(markdown).toContain("Master Lab 台帳の `timing`");
  });

  it("builds a matchup matrix for every candidate against white and black", () => {
    const matchups = buildMasterLabMatchups();
    for (const candidate of MASTER_LAB_CANDIDATES) {
      const candidateMatchups = matchups.filter((matchup) => matchup.candidateId === candidate.id);
      expect(candidateMatchups).toHaveLength(5);
      expect(candidateMatchups.some((matchup) => matchup.opponentId === "white" && matchup.challengerSeat === "player")).toBe(true);
      expect(candidateMatchups.some((matchup) => matchup.opponentId === "white" && matchup.challengerSeat === "cpu")).toBe(true);
      expect(candidateMatchups.some((matchup) => matchup.opponentId === "black" && matchup.challengerSeat === "player")).toBe(true);
      expect(candidateMatchups.some((matchup) => matchup.opponentId === "black" && matchup.challengerSeat === "cpu")).toBe(true);
      expect(candidateMatchups.some((matchup) => matchup.opponentId === candidate.id)).toBe(true);
    }
  });

  it("formats the current roadmap and candidates as markdown", () => {
    const markdown = formatMasterLabMarkdown();
    expect(markdown).toContain("# Master Lab 現状");
    expect(markdown).toContain("デコイマスター");
    expect(markdown).toContain("挑発");
    expect(markdown).toContain("スケープゴート");
    expect(markdown).toContain("magic_ref");
    expect(markdown).toContain("- PASS");
  });

  it("resolves scapegoat as a decoy master action without retaining a virtual hand card", () => {
    const game = createInitialGame(900);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    const options = listMasterLabActionOptions(game, "decoy").filter((item) => item.actionId === "scapegoat");
    expect(options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionName: "スケープゴート",
          cost: 2,
          target: { kind: "monster", slotKey: "player_front_left" },
        }),
        expect.objectContaining({
          actionName: "スケープゴート",
          cost: 2,
          target: { kind: "monster", slotKey: "cpu_front_left" },
        }),
      ]),
    );

    const next = playMasterLabAction(game, {
      candidateId: "decoy",
      actionId: "scapegoat",
      target: { kind: "monster", slotKey: "player_front_left" },
    });

    expect(next.players.player.stones).toBe(0);
    expect(next.slots.player_front_left.monster?.scapegoat).toBe(true);
    expect(next.players.player.hand.some((card) => card.instanceId.startsWith("__master_lab_virtual__"))).toBe(false);
    expect(next.players.player.discard.some((card) => card.instanceId.startsWith("__master_lab_virtual__"))).toBe(false);
    expect(game.slots.player_front_left.monster?.scapegoat).toBeUndefined();
  });

  it("resolves enemy scapegoat as a decoy master target", () => {
    const game = createInitialGame(904);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    const next = playMasterLabAction(game, {
      candidateId: "decoy",
      actionId: "scapegoat",
      target: { kind: "monster", slotKey: "cpu_front_left" },
    });

    expect(next.players.player.stones).toBe(0);
    expect(next.slots.cpu_front_left.monster?.scapegoat).toBe(true);
    expect(next.slots.player_front_left.monster?.scapegoat).toBeUndefined();
  });

  it("resolves provoke with an explicit bait target and the lab action cost", () => {
    const game = createInitialGame(901);
    game.players.player.stones = 3;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.player_front_right.monster = createActiveMonster("sigma", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    const provokeOptions = listMasterLabActionOptions(game, "decoy").filter((item) => item.actionId === "provoke");
    expect(provokeOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          cost: 3,
          target: { kind: "monster", slotKey: "cpu_front_left" },
          secondaryTarget: { kind: "monster", slotKey: "player_front_right" },
        }),
      ]),
    );

    const next = playMasterLabAction(game, {
      candidateId: "decoy",
      actionId: "provoke",
      target: { kind: "monster", slotKey: "cpu_front_left" },
      secondaryTarget: { kind: "monster", slotKey: "player_front_right" },
    });

    expect(next.players.player.stones).toBe(0);
    expect(next.slots.cpu_front_left.monster?.provokeTargetSlotKey).toBe("player_front_right");
    expect(next.players.player.discard.some((card) => card.instanceId.startsWith("__master_lab_virtual__"))).toBe(false);
  });

  it("does not list provoke when only the original card cost can be paid", () => {
    const game = createInitialGame(902);
    game.players.player.stones = 2;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    expect(listMasterLabActionOptions(game, "decoy").some((item) => item.actionId === "provoke")).toBe(false);
  });

  it("evaluates decoy master lab actions as one-step tactical probes", () => {
    const game = createInitialGame(903);
    game.players.player.stones = 3;
    game.players.player.masterHp = 3;
    game.players.cpu.masterHp = 4;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player");
    game.slots.cpu_front_left.monster = createActiveMonster("takokke", "cpu");

    const evaluations = inspectMasterLabActionEvaluations(game, "decoy", "player");
    const tunedEvaluations = inspectMasterLabActionEvaluations(game, "decoy", "player", {
      actionBias: { scapegoat: 10 },
    });
    const targetTunedEvaluations = inspectMasterLabActionEvaluations(game, "decoy", "player", {
      targetOwnerBias: { enemy: 12, ally: -6 },
    });
    const scapegoat = evaluations.find((evaluation) =>
      evaluation.option.actionId === "scapegoat" &&
      evaluation.option.target.kind === "monster" &&
      evaluation.option.target.slotKey === "player_front_left",
    );
    const enemyScapegoat = evaluations.find((evaluation) =>
      evaluation.option.actionId === "scapegoat" &&
      evaluation.option.target.kind === "monster" &&
      evaluation.option.target.slotKey === "cpu_front_left",
    );
    const tunedScapegoat = tunedEvaluations.find((evaluation) =>
      evaluation.option.actionId === "scapegoat" &&
      evaluation.option.target.kind === "monster" &&
      evaluation.option.target.slotKey === "player_front_left",
    );
    const targetTunedAlly = targetTunedEvaluations.find((evaluation) =>
      evaluation.option.actionId === "scapegoat" &&
      evaluation.option.target.kind === "monster" &&
      evaluation.option.target.slotKey === "player_front_left",
    );
    const targetTunedEnemy = targetTunedEvaluations.find((evaluation) =>
      evaluation.option.actionId === "scapegoat" &&
      evaluation.option.target.kind === "monster" &&
      evaluation.option.target.slotKey === "cpu_front_left",
    );
    const chosen = chooseMasterLabAction(game, "decoy", "player");

    expect(scapegoat?.heuristicScore).toBeGreaterThan(0);
    expect(enemyScapegoat?.heuristicScore).toBeGreaterThan(0);
    expect(tunedScapegoat?.heuristicScore).toBe((scapegoat?.heuristicScore ?? 0) + 10);
    expect(targetTunedAlly?.heuristicScore).toBe((scapegoat?.heuristicScore ?? 0) - 6);
    expect(targetTunedEnemy?.heuristicScore).toBe((enemyScapegoat?.heuristicScore ?? 0) + 12);
    expect(scapegoat?.reason).toContain("補助評価");
    expect(chosen).toBeDefined();
    expect(evaluations.every((evaluation) => Number.isFinite(evaluation.totalScore))).toBe(true);
  });

  it("evaluates tempo master lab actions as board-speed probes", () => {
    const game = createInitialGame(905);
    game.players.player.stones = 4;
    game.slots.player_front_left.monster = createActiveMonster("takokke", "player", {
      status: "prepared",
    });
    game.slots.player_front_right.monster = createActiveMonster("yanbaru", "player");

    const evaluations = inspectMasterLabActionEvaluations(game, "timing", "player", {
      actionBias: { quick_call: 8, shift: 4 },
    });
    const quickCall = evaluations.find((evaluation) => evaluation.option.actionId === "quick_call");
    const shift = evaluations.find((evaluation) => evaluation.option.actionId === "shift");

    expect(quickCall?.heuristicScore).toBeGreaterThan(8);
    expect(quickCall?.after.slots.player_front_left.monster?.masterAttackBlockedUntilTurnEnd).toBe(true);
    expect(shift?.heuristicScore).toBeGreaterThan(4);
    expect(evaluations.every((evaluation) => Number.isFinite(evaluation.totalScore))).toBe(true);
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
    instanceId: `${owner}_${cardId}_master_lab_fixture`,
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
