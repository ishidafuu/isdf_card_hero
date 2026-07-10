import { describe, expect, it } from "vitest";
import { determinizeOpponentPrivateZones } from "../../src/game/cpuAiV2/opponentKnowledge";
import { createInitialGame } from "../../src/game/rules";

describe("white v2 opponent knowledge", () => {
  it("does not depend on the opponent's actual hand partition or deck order", () => {
    const first = createInitialGame(78123, { firstPlayer: "cpu" });
    const second = structuredClone(first);
    const hidden = [...second.players.player.hand, ...second.players.player.deck].reverse();
    second.players.player.hand = hidden.slice(0, second.players.player.hand.length);
    second.players.player.deck = hidden.slice(second.players.player.hand.length);

    const firstSample = determinizeOpponentPrivateZones(first, "cpu");
    const secondSample = determinizeOpponentPrivateZones(second, "cpu");

    expect(privateZoneKeys(firstSample, "player")).toEqual(privateZoneKeys(secondSample, "player"));
    expect(privateZoneKeys(firstSample, "cpu")).toEqual(privateZoneKeys(first, "cpu"));
    expect(firstSample.players.player.hand).toHaveLength(first.players.player.hand.length);
    expect(firstSample.players.player.deck).toHaveLength(first.players.player.deck.length);
  });

  it("uses the sample index to produce a separate deterministic hypothesis", () => {
    const state = createInitialGame(78124, { firstPlayer: "cpu" });

    const first = determinizeOpponentPrivateZones(state, "cpu", 0);
    const repeated = determinizeOpponentPrivateZones(state, "cpu", 0);
    const second = determinizeOpponentPrivateZones(state, "cpu", 1);

    expect(privateZoneKeys(first, "player")).toEqual(privateZoneKeys(repeated, "player"));
    expect(privateZoneKeys(second, "player")).not.toEqual(privateZoneKeys(first, "player"));
  });
});

function privateZoneKeys(state: ReturnType<typeof createInitialGame>, playerId: "player" | "cpu"): string[] {
  const player = state.players[playerId];
  return [...player.hand, ...player.deck].map((card) => `${card.instanceId}:${card.cardId}`);
}
