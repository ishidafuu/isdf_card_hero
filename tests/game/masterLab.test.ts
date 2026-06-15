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

    const option = listMasterLabActionOptions(game, "decoy").find((item) => item.actionId === "scapegoat");
    expect(option).toMatchObject({
      actionName: "スケープゴート",
      cost: 2,
      target: { kind: "monster", slotKey: "player_front_left" },
    });

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
    const scapegoat = evaluations.find((evaluation) => evaluation.option.actionId === "scapegoat");
    const chosen = chooseMasterLabAction(game, "decoy", "player");

    expect(scapegoat?.heuristicScore).toBeGreaterThan(0);
    expect(scapegoat?.reason).toContain("補助評価");
    expect(chosen).toBeDefined();
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
