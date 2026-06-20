import { describe, expect, it } from "vitest";
import { getMonsterDef } from "../../src/game/cards";
import { createInitialGame } from "../../src/game/rules";
import {
  cpuMonsterValue,
  evaluateAllCards,
  evaluateBoardUnit,
  evaluateCard,
  memberRatingValueBonus,
} from "../../src/game/unitEvaluation";
import type { GameState, MonsterState, PlayerId } from "../../src/game/types";

describe("unit evaluation", () => {
  it("keeps the CPU monster value compatible with the existing board heuristic", () => {
    const game = createEvaluationGame();
    game.slots.player_front_left.monster = createMonster("takokke", "player", {
      hp: 5,
      level: 1,
      investedStones: 1,
    });

    expect(cpuMonsterValue(game, "player_front_left")).toBe(127);
  });

  it("scores front-role units higher in the front row than the back row for placement", () => {
    const frontGame = createEvaluationGame();
    frontGame.slots.player_front_left.monster = createMonster("takokke", "player");

    const backGame = createEvaluationGame();
    backGame.slots.player_back_left.monster = createMonster("takokke", "player");

    const front = evaluateBoardUnit(frontGame, "player_front_left");
    const back = evaluateBoardUnit(backGame, "player_back_left");

    expect(front?.position).toBeGreaterThan(back?.position ?? 0);
  });

  it("scores back-role units higher when protected by a front ally", () => {
    const protectedGame = createEvaluationGame();
    protectedGame.slots.player_front_left.monster = createMonster("takokke", "player");
    protectedGame.slots.player_back_left.monster = createMonster("yanbaru", "player");

    const exposedGame = createEvaluationGame();
    exposedGame.slots.player_back_left.monster = createMonster("yanbaru", "player");

    const protectedYanbaru = evaluateBoardUnit(protectedGame, "player_back_left");
    const exposedYanbaru = evaluateBoardUnit(exposedGame, "player_back_left");

    expect(protectedYanbaru?.position).toBeGreaterThan(exposedYanbaru?.position ?? 0);
  });

  it("marks a unit in lethal range as risky for its owner", () => {
    const game = createEvaluationGame();
    game.slots.player_front_left.monster = createMonster("takokke", "player", { hp: 2 });
    game.slots.cpu_front_left.monster = createMonster("takokke", "cpu");

    const evaluation = evaluateBoardUnit(game, "player_front_left");

    expect(evaluation?.lethalThreat).toBe(true);
    expect(evaluation?.risk).toBeLessThan(0);
    expect(evaluation?.reasons.some((reason) => reason.includes("撃破圏"))).toBe(true);
  });

  it("scores Drill Break board offense only while the partner can act", () => {
    const pairGame = createEvaluationGame();
    pairGame.slots.player_front_right.monster = createMonster("card_107", "player", {
      level: 2,
      investedStones: 2,
    });
    pairGame.slots.player_front_left.monster = createMonster("card_108", "player", {
      level: 2,
      investedStones: 2,
    });

    const spentPartnerGame = createEvaluationGame();
    spentPartnerGame.slots.player_front_right.monster = createMonster("card_107", "player", {
      level: 2,
      investedStones: 2,
    });
    spentPartnerGame.slots.player_front_left.monster = createMonster("card_108", "player", {
      level: 2,
      investedStones: 2,
      actionCount: 1,
    });

    const pairRaon = evaluateBoardUnit(pairGame, "player_front_right");
    const spentPartnerRaon = evaluateBoardUnit(spentPartnerGame, "player_front_right");

    expect(pairRaon?.offense).toBeGreaterThan((spentPartnerRaon?.offense ?? 0) + 100);
  });

  it("reflects representative card traits in relative card evaluation", () => {
    const polyspinner = evaluateCard("polyspinner");
    const takokke = evaluateCard("takokke");
    const morgan = evaluateCard("morgan");

    expect(polyspinner.tempo).toBeGreaterThan(takokke.tempo);
    expect(morgan.offense).toBeGreaterThan(takokke.offense);
  });

  it("keeps master-specific member ratings as a small AI value modifier", () => {
    expect(memberRatingValueBonus("polyspinner", "black")).toBeGreaterThan(memberRatingValueBonus("takokke", "black"));
    expect(memberRatingValueBonus("sigma", "white")).toBeGreaterThan(memberRatingValueBonus("takokke", "white"));
  });

  it("keeps high-HP front units ordered by growth and combat ceiling for catalog sorting", () => {
    const sigma = evaluateCard("sigma");
    const takokke = evaluateCard("takokke");

    expect(sigma.defense).toBeGreaterThanOrEqual(takokke.defense);
    expect(sigma.levelUp).toBeGreaterThan(takokke.levelUp);
    expect(sigma.total).toBeGreaterThan(takokke.total);
    expect(sigma.breakdown.map((item) => item.key)).toEqual([
      "base",
      "offense",
      "defense",
      "position",
      "tempo",
      "levelUp",
      "risk",
      "synergy",
    ]);
  });

  it("can evaluate every card for catalog and statistics display", () => {
    const evaluations = evaluateAllCards();

    expect(evaluations.length).toBeGreaterThan(120);
    expect(evaluations.every((evaluation) => Number.isFinite(evaluation.total))).toBe(true);
    expect(evaluations.every((evaluation) => evaluation.breakdown.length === 8)).toBe(true);
  });
});

function createEvaluationGame(): GameState {
  const game = createInitialGame(20260612, { firstPlayer: "player" });
  for (const playerId of ["player", "cpu"] as const) {
    game.players[playerId].hand = [];
    game.players[playerId].deck = [];
    game.players[playerId].discard = [];
  }
  return game;
}

function createMonster(cardId: string, owner: PlayerId, overrides: Partial<MonsterState> = {}): MonsterState {
  const def = getMonsterDef(cardId);
  const level = overrides.level ?? 1;
  const levelDef = def.levels.find((candidate) => candidate.level === level) ?? def.levels[0];
  return {
    instanceId: `${owner}_${cardId}_${level}`,
    cardId,
    owner,
    hp: levelDef.maxHp,
    level,
    status: "active",
    investedStones: level,
    actionCount: 0,
    actionLimit: def.actionLimit ?? 1,
    focused: false,
    powerUp: false,
    shielded: false,
    ...overrides,
  };
}
