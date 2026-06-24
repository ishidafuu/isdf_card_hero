import { describe, expect, it } from "vitest";
import { chooseCpuDecision, type CpuAiOptions } from "../../src/game/cpuAi";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial } from "../../src/game/deckPresets";
import { createInitialGame, runAutoStep } from "../../src/game/rules";
import type { GameState } from "../../src/game/types";

const WHITE_VS_BLACK_RAON_PRESSURE_SEED = 38607;

describe("white black specialist scenarios", () => {
  it("keeps seed-derived low-stone Raon turns on enemy-front pressure instead of focus", () => {
    const firstPressureState = replayWhiteCpuVsBlackStrongToStep(WHITE_VS_BLACK_RAON_PRESSURE_SEED, 15);
    const firstDecision = chooseCpuDecision(firstPressureState, defaultOptions());
    const firstDisabledDecision = chooseCpuDecision(firstPressureState, withoutBlackMonsterPressure());

    expect(firstPressureState.currentPlayer).toBe("cpu");
    expect(firstPressureState.players.cpu.stones).toBe(2);
    expect(firstDecision.type).toBe("attack");
    if (firstDecision.type === "attack") {
      expect(firstDecision.action.attackerSlotKey).toBe("cpu_front_right");
      expect(firstDecision.action.target).toEqual({ kind: "monster", slotKey: "player_front_right" });
    }
    expect(firstDisabledDecision.type).toBe("attack");
    if (firstDisabledDecision.type === "attack") {
      expect(firstDisabledDecision.action.attackerSlotKey).toBe("cpu_front_right");
      expect(firstDisabledDecision.action.target).toEqual({ kind: "monster", slotKey: "player_front_right" });
    }

    const followUpPressureState = replayWhiteCpuVsBlackStrongToStep(WHITE_VS_BLACK_RAON_PRESSURE_SEED, 25);
    const followUpDecision = chooseCpuDecision(followUpPressureState, defaultOptions());
    const followUpDisabledDecision = chooseCpuDecision(followUpPressureState, withoutBlackMonsterPressure());

    expect(followUpPressureState.currentPlayer).toBe("cpu");
    expect(followUpPressureState.players.cpu.stones).toBe(1);
    expect(followUpDecision.type).toBe("attack");
    if (followUpDecision.type === "attack") {
      expect(followUpDecision.action.attackerSlotKey).toBe("cpu_front_right");
      expect(followUpDecision.action.target).toEqual({ kind: "monster", slotKey: "player_front_right" });
    }
    expect(followUpDisabledDecision.type).toBe("focus");
    if (followUpDisabledDecision.type === "focus") {
      expect(followUpDisabledDecision.slotKey).toBe("cpu_front_right");
    }
  });
});

function replayWhiteCpuVsBlackStrongToStep(seed: number, targetStep: number): GameState {
  let game = createInitialGame(seed, {
    masterIds: { player: "black", cpu: "white" },
    playerDeckCardIds: buildDeckPresetCardIds("black-pressure"),
    cpuDeckCardIds: buildDeckPresetCardIds("pressure-normal"),
    allowSpecialDecks: {
      player: deckPresetAllowsSpecial("black-pressure"),
      cpu: deckPresetAllowsSpecial("pressure-normal"),
    },
  });
  const options = defaultOptions();
  for (let step = 0; step < targetStep; step += 1) {
    game = runAutoStep(game, options);
  }
  return game;
}

function defaultOptions(): CpuAiOptions {
  return { profiles: { player: "strong", cpu: "white" } };
}

function withoutBlackMonsterPressure(): CpuAiOptions {
  return {
    profiles: { player: "strong", cpu: "white" },
    tunings: {
      cpu: {
        situationalBias: {
          whiteMonsterPressureBonus: 0,
        },
      },
    },
  };
}
