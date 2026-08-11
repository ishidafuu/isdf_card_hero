import { describe, expect, it } from "vitest";
import {
  isAutoStepWorkerResponse,
  matchesAutoStepRequest,
  tryCreateAutoStepWorker,
  type AutoStepRequestToken,
} from "../../src/autoStepWorkerProtocol";

describe("auto step worker protocol", () => {
  const active: AutoStepRequestToken = {
    requestId: 4,
    battleGeneration: 2,
    gameVersion: 9,
  };
  const playerState = (id: "player" | "cpu") => ({
    id,
    masterId: "white",
    masterHp: 10,
    stones: 0,
    deck: [],
    hand: [],
    discard: [],
    turnsStarted: 0,
  });
  const slots = Object.fromEntries([
    "player_front_left",
    "player_front_right",
    "player_back_left",
    "player_back_right",
    "cpu_front_left",
    "cpu_front_right",
    "cpu_back_left",
    "cpu_back_right",
  ].map((slotKey) => [slotKey, {}]));

  it("accepts only the response for the active battle state", () => {
    expect(matchesAutoStepRequest({ ...active }, active)).toBe(true);
    expect(matchesAutoStepRequest({ ...active, requestId: 3 }, active)).toBe(false);
  });

  it("rejects responses invalidated by Auto Stop, New Game, or a newer game version", () => {
    expect(matchesAutoStepRequest(active, undefined)).toBe(false);
    expect(matchesAutoStepRequest({ ...active, battleGeneration: 1 }, active)).toBe(false);
    expect(matchesAutoStepRequest({ ...active, gameVersion: 8 }, active)).toBe(false);
  });

  it("rejects malformed worker messages before reading game state", () => {
    expect(isAutoStepWorkerResponse(null)).toBe(false);
    expect(isAutoStepWorkerResponse({ type: "result", ...active })).toBe(false);
    expect(isAutoStepWorkerResponse({ type: "error", ...active, error: "boom" })).toBe(true);
    expect(isAutoStepWorkerResponse({ type: "result", ...active, game: {} })).toBe(false);
    expect(isAutoStepWorkerResponse({
      type: "result",
      ...active,
      game: {
        players: { player: playerState("player"), cpu: playerState("cpu") },
        slots,
        currentPlayer: "player",
        firstPlayer: "cpu",
        turnNumber: 3,
        randomSeed: 42,
        log: [],
      },
    })).toBe(true);
  });

  it("turns unsupported or failed Worker creation into a recoverable result", () => {
    const failure = tryCreateAutoStepWorker(() => {
      throw new Error("Web Worker is unavailable");
    });
    expect(failure).toEqual({ ok: false, error: "Web Worker is unavailable" });

    const worker = { postMessage() {} };
    expect(tryCreateAutoStepWorker(() => worker)).toEqual({ ok: true, worker });
  });
});
