import { describe, expect, it } from "vitest";
import { getEffectiveActor, shouldRunAutoStep } from "../../src/game/seatControl";
import { createInitialGame } from "../../src/game/rules";

describe("seat controller routing", () => {
  it("uses pending level-up owner rather than currentPlayer", () => {
    const game = createInitialGame(7001);
    game.currentPlayer = "player";
    game.pendingLevelUp = { playerId: "cpu", attackerSlotKey: "cpu_front_left", maxLevels: 1 };

    expect(getEffectiveActor(game)).toBe("cpu");
    expect(shouldRunAutoStep(game, { player: "human", cpu: "cpu" })).toBe(true);
    expect(shouldRunAutoStep(game, { player: "cpu", cpu: "human" })).toBe(false);
  });

  it("routes either seat by immutable controller assignment and stops after winner", () => {
    const game = createInitialGame(7002);
    game.currentPlayer = "player";

    expect(shouldRunAutoStep(game, { player: "human", cpu: "cpu" })).toBe(false);
    expect(shouldRunAutoStep(game, { player: "cpu", cpu: "human" })).toBe(true);
    game.winner = "player";
    expect(shouldRunAutoStep(game, { player: "cpu", cpu: "cpu" })).toBe(false);
  });
});
