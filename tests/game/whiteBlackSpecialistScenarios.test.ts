import { describe, expect, it } from "vitest";
import { chooseCpuDecision, type CpuAiOptions } from "../../src/game/cpuAi";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial } from "../../src/game/deckPresets";
import { createInitialGame, runAutoStep } from "../../src/game/rules";
import type { GameState } from "../../src/game/types";

const WHITE_VS_BLACK_FRONT_PRESSURE_SEED = 38004;

describe("white black specialist scenarios", () => {
  it("keeps a seed-derived low-stone white turn on enemy-front pressure instead of focus", () => {
    const pressureState = replayWhiteCpuVsBlackStrongToStep(WHITE_VS_BLACK_FRONT_PRESSURE_SEED, 16);
    const decision = chooseCpuDecision(pressureState, defaultOptions());
    const disabledDecision = chooseCpuDecision(pressureState, withoutBlackMonsterPressure());

    expect(pressureState.currentPlayer).toBe("cpu");
    expect(pressureState.players.cpu.stones).toBe(2);
    expect(decision.type).toBe("attack");
    if (decision.type === "attack") {
      expect(decision.action.attackerSlotKey).toBe("cpu_front_left");
      expect(decision.action.target).toEqual({ kind: "monster", slotKey: "player_front_left" });
    }
    expect(disabledDecision.type).toBe("focus");
    if (disabledDecision.type === "focus") {
      expect(disabledDecision.slotKey).toBe("cpu_front_left");
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
