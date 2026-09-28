import { describe, expect, it } from "vitest";
import { applyCpuDecision, applyStoredAiDecision, chooseCpuDecision } from "../../src/game/cpuAi";
import { getCardDef, getCardDefsByPool, getCardPool, getMonsterDef } from "../../src/game/cards";
import {
  createPlanningState,
  createPublicInformationState,
  determinizeOpponentPrivateZones,
  publicInformationStateKey,
} from "../../src/game/cpuAiV2/opponentKnowledge";
import { createInitialGame } from "../../src/game/rules";
import {
  appendBattleCommand,
  createBattleJournal,
  extractAiDecisionCommand,
  seekBattleJournal,
} from "../../src/replay/battleJournal";
import type { MonsterState } from "../../src/game/types";

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
    expect(firstSample.players.cpu.hand).toEqual(first.players.cpu.hand);
    expect(firstSample.players.cpu.deck.map((card) => card.cardId).sort()).toEqual(
      first.players.cpu.deck.map((card) => card.cardId).sort(),
    );
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

  it("does not expose a prepared monster identity or private fields to the other side", () => {
    const first = createInitialGame(78125, { firstPlayer: "cpu" });
    const normalCardIndex = first.players.player.deck.findIndex((card) => {
      const def = getCardDef(card.cardId);
      return def.type === "monster" && getCardPool(def) === "normal";
    });
    const handIndex = first.players.player.hand.findIndex((card) => {
      const def = getCardDef(card.cardId);
      return def.type === "monster" && getCardPool(def) === "normal";
    });
    expect(normalCardIndex).toBeGreaterThanOrEqual(0);
    expect(handIndex).toBeGreaterThanOrEqual(0);
    const preparedCard = first.players.player.deck.splice(normalCardIndex, 1)[0];
    first.slots.player_back_left.monster = createPreparedMonster(preparedCard.cardId, preparedCard.instanceId, {
      hp: 1,
      focused: true,
      powerUp: true,
    });

    const exchanged = structuredClone(first);
    const prepared = exchanged.slots.player_back_left.monster!;
    const handCard = exchanged.players.player.hand[handIndex];
    exchanged.players.player.hand[handIndex] = { ...handCard, cardId: prepared.cardId };
    exchanged.slots.player_back_left.monster = createPreparedMonster(handCard.cardId, prepared.instanceId, {
      hp: 2,
      shielded: true,
    });

    expect(publicInformationStateKey(first, "cpu")).toBe(publicInformationStateKey(exchanged, "cpu"));
    const firstSample = createPublicInformationState(first, "cpu");
    const exchangedSample = createPublicInformationState(exchanged, "cpu");
    expect(firstSample.slots.player_back_left.monster?.cardId).toBe(
      exchangedSample.slots.player_back_left.monster?.cardId,
    );
    const sampledMonster = firstSample.slots.player_back_left.monster;
    expect(sampledMonster).toMatchObject({
      status: "prepared",
      focused: false,
      powerUp: false,
      shielded: false,
      instanceId: "info:player:player_back_left",
    });
    expect(sampledMonster?.hp).toBe(getMonsterDef(sampledMonster!.cardId).levels[0].maxHp);
  });

  it("keeps normal-profile decision payload invariant under hidden-zone and RNG changes", () => {
    const first = createInitialGame(78126, { firstPlayer: "cpu" });
    first.currentPlayer = "cpu";
    first.players.cpu.hand = [];
    first.players.cpu.stones = 0;
    first.players.cpu.masterHp = 10;
    first.players.cpu.deck = [
      { cardId: "card_047", instanceId: "cpu-known-a" },
      { cardId: "card_051", instanceId: "cpu-known-b" },
    ];
    for (const slot of Object.values(first.slots)) {
      delete slot.monster;
    }
    const second = structuredClone(first);
    const hidden = [...second.players.player.hand, ...second.players.player.deck].reverse();
    second.players.player.hand = hidden.slice(0, second.players.player.hand.length);
    second.players.player.deck = hidden.slice(second.players.player.hand.length);
    second.players.cpu.deck.reverse();
    second.randomSeed ^= 0x5a5a5a5a;

    const firstDecision = chooseCpuDecision(first, { profile: "strong" });
    const secondDecision = chooseCpuDecision(second, { profile: "strong" });

    expect(decisionPayloadKey(secondDecision)).toBe(decisionPayloadKey(firstDecision));
    expect(firstDecision.type).toBe("master_hp_draw");
    expect(secondDecision.type).toBe("master_hp_draw");
    const applied = applyCpuDecision(first, firstDecision);
    expect(applied.players.cpu.hand.at(-1)?.cardId).toBe("card_047");
  });

  it("keeps every normal profile invariant for either seat across hidden-zone and RNG changes", () => {
    const profiles = ["stable", "strong", "pressure", "defensive", "white", "white_planner", "white_v2", "white_rollout"] as const;
    for (const perspective of ["player", "cpu"] as const) {
      for (const profile of profiles) {
        const first = createInitialGame(78128, { firstPlayer: perspective });
        first.currentPlayer = perspective;
        const opponent = perspective === "player" ? "cpu" : "player";
        const preparedIndex = first.players[opponent].deck.findIndex((card) => {
          const def = getCardDef(card.cardId);
          return def.type === "monster" && getCardPool(def) === "normal";
        });
        expect(preparedIndex, `${profile}/${perspective} prepared candidate`).toBeGreaterThanOrEqual(0);
        const preparedCard = first.players[opponent].deck.splice(preparedIndex, 1)[0];
        first.slots[`${opponent}_back_left` as const].monster = createPreparedMonster(
          preparedCard.cardId,
          preparedCard.instanceId,
          { owner: opponent },
        );

        const second = structuredClone(first);
        const handIndex = second.players[opponent].hand.findIndex((card) => {
          const def = getCardDef(card.cardId);
          return def.type === "monster" && getCardPool(def) === "normal";
        });
        expect(handIndex, `${profile}/${perspective} hand candidate`).toBeGreaterThanOrEqual(0);
        const hiddenPrepared = second.slots[`${opponent}_back_left` as const].monster!;
        const handCard = second.players[opponent].hand[handIndex];
        second.players[opponent].hand[handIndex] = { ...handCard, cardId: hiddenPrepared.cardId };
        second.slots[`${opponent}_back_left` as const].monster = createPreparedMonster(
          handCard.cardId,
          hiddenPrepared.instanceId,
          { owner: opponent, hp: 1, shielded: true, focused: true },
        );
        second.players[perspective].deck.reverse();
        second.players[opponent].deck.reverse();
        second.randomSeed ^= 0x76543210;

        const options = { profiles: { player: profile, cpu: profile } };
        const firstDecision = chooseCpuDecision(first, options);
        const secondDecision = chooseCpuDecision(second, options);
        expect(decisionPayloadKey(secondDecision), `${profile}/${perspective}`).toBe(
          decisionPayloadKey(firstDecision),
        );
      }
    }
  });

  it("does not use a limited opponent's hidden composition under unknown-composition policy", () => {
    const first = createInitialGame(78130, { firstPlayer: "cpu" });
    first.currentPlayer = "cpu";
    const second = structuredClone(first);
    second.players.player.hand = second.players.player.hand.map((card, index) => ({
      ...card,
      cardId: index % 2 === 0 ? "card_001" : "card_047",
    }));
    second.players.player.deck = second.players.player.deck.map((card, index) => ({
      ...card,
      cardId: index % 2 === 0 ? "card_006" : "card_051",
    })).reverse();
    second.randomSeed ^= 0x5a5a5a5a;

    expect(publicInformationStateKey(first, "cpu", "unknown_composition")).toBe(
      publicInformationStateKey(second, "cpu", "unknown_composition"),
    );
    expect(createPublicInformationState(first, "cpu", 0, "unknown_composition")).toEqual(
      createPublicInformationState(second, "cpu", 0, "unknown_composition"),
    );
    const limitedSample = createPublicInformationState(first, "cpu", 0, "unknown_composition");
    expect([...limitedSample.players.player.hand, ...limitedSample.players.player.deck].every((card) =>
      getCardPool(getCardDef(card.cardId)) === "normal",
    )).toBe(true);
    const profiles = ["stable", "strong", "pressure", "defensive", "white", "white_planner", "white_v2", "white_rollout", "omniscient"] as const;
    for (const profile of profiles) {
      expect(decisionPayloadKey(chooseCpuDecision(first, {
        profile,
        opponentKnowledgePolicy: "unknown_composition",
      }))).toBe(decisionPayloadKey(chooseCpuDecision(second, {
        profile,
        opponentKnowledgePolicy: "unknown_composition",
      })));
    }
  });

  it("includes public exchanged-master capability state in the information key", () => {
    const ordinary = createInitialGame(78131, { firstPlayer: "cpu" });
    const exchanged = structuredClone(ordinary);
    exchanged.players.cpu.masterActionsExchanged = true;
    exchanged.players.player.masterActionsExchanged = true;
    exchanged.masterActionsExchangeExpiresOnStartOf = "cpu";

    expect(publicInformationStateKey(ordinary, "cpu")).not.toBe(publicInformationStateKey(exchanged, "cpu"));
  });

  it("resamples hidden prepared identities from public counts under unknown policy", () => {
    const first = createInitialGame(78132, { firstPlayer: "cpu" });
    const preparedIndex = first.players.player.deck.findIndex((card) => {
      const definition = getCardDef(card.cardId);
      return definition.type === "monster" && getCardPool(definition) === "normal";
    });
    expect(preparedIndex).toBeGreaterThanOrEqual(0);
    const [preparedCard] = first.players.player.deck.splice(preparedIndex, 1);
    first.slots.player_back_left.monster = createPreparedMonster(preparedCard.cardId, preparedCard.instanceId);
    const firstSample = createPublicInformationState(first, "cpu", 1, "unknown_composition");
    const sampledPreparedId = firstSample.slots.player_back_left.monster?.cardId;
    const second = structuredClone(first);
    const otherMonster = getCardDefsByPool("normal").find((definition) =>
      definition.type === "monster" && definition.id !== preparedCard.cardId && definition.id !== sampledPreparedId,
    );
    expect(otherMonster).toBeDefined();
    const secondPrepared = second.slots.player_back_left.monster!;
    second.slots.player_back_left.monster = createPreparedMonster(otherMonster!.id, secondPrepared.instanceId, {
      hp: getMonsterDef(otherMonster!.id).levels[0].maxHp,
      focused: true,
      shielded: true,
    });
    second.players.player.deck[0] = { ...second.players.player.deck[0], cardId: "card_047" };

    expect(publicInformationStateKey(first, "cpu", "unknown_composition")).toBe(
      publicInformationStateKey(second, "cpu", "unknown_composition"),
    );
    const secondSample = createPublicInformationState(second, "cpu", 1, "unknown_composition");
    expect(firstSample).toEqual(secondSample);
    expect(firstSample.slots.player_back_left.monster?.cardId).not.toBe(preparedCard.cardId);
  });

  it("excludes verbose journals before planning clones without mutating the live state", () => {
    const state = createInitialGame(78129, { firstPlayer: "cpu", trackEventLog: true });
    state.currentPlayer = "cpu";
    const withHistory = structuredClone(state);
    withHistory.log = Array.from({ length: 500 }, (_, index) => `log-${index}`);
    withHistory.logOffset = 200;
    withHistory.eventLog = Array.from({ length: 1000 }, (_, index) => `event-${index}`);
    withHistory.aiDecisionHistory = [];
    withHistory.humanActionHistory = [];
    const original = structuredClone(withHistory);

    const withoutHistoryDecision = chooseCpuDecision(state, { profile: "white_v2" });
    const withHistoryDecision = chooseCpuDecision(withHistory, { profile: "white_v2" });
    const planningCopy = createPlanningState(withHistory);

    expect(decisionPayloadKey(withHistoryDecision)).toBe(decisionPayloadKey(withoutHistoryDecision));
    expect(withHistory).toEqual(original);
    expect(planningCopy.log).toEqual([]);
    expect(planningCopy.logOffset).toBeUndefined();
    expect(planningCopy.eventLog).toBeUndefined();
    expect(planningCopy.aiDecisionHistory).toBeUndefined();
    expect(planningCopy.humanActionHistory).toBeUndefined();
  });

  it("keeps Sort Card generic in the chooser and stores the live resolved order on apply", () => {
    const first = createInitialGame(78127, { firstPlayer: "cpu", trackEventLog: true });
    first.currentPlayer = "cpu";
    first.players.cpu.stones = 1;
    first.players.cpu.masterHp = 3;
    first.players.cpu.hand = [{ cardId: "card_115", instanceId: "cpu-sort-card" }];
    first.players.cpu.deck = ["card_047", "card_001", "card_133", "card_051", "card_006"].map(
      (cardId, index) => ({ cardId, instanceId: `cpu-sort-${index}` }),
    );
    first.players.player.hand = [];
    for (const slot of Object.values(first.slots)) {
      delete slot.monster;
    }
    const second = structuredClone(first);
    second.players.cpu.deck.reverse();
    second.randomSeed ^= 0x12345678;

    const firstDecision = chooseCpuDecision(first, { profile: "strong" });
    const secondDecision = chooseCpuDecision(second, { profile: "strong" });
    expect(decisionPayloadKey(secondDecision)).toBe(decisionPayloadKey(firstDecision));
    const genericSortDecision = {
      type: "magic" as const,
      action: { handInstanceId: "cpu-sort-card", target: { kind: "master" as const, playerId: "cpu" as const } },
      reason: "Sort Cardの実行テスト",
      score: 0,
    };

    const applied = applyCpuDecision(first, genericSortDecision);
    const stored = applied.aiDecisionHistory?.at(-1)?.decision;
    expect(stored?.type).toBe("magic");
    if (stored?.type !== "magic") {
      return;
    }
    expect(stored.action.deckTopOrderInstanceIds).toHaveLength(5);
    expect(stored.action.deckTopOrderInstanceIds).not.toContain("info:cpu:deck:0:card_047");
    expect(applyStoredAiDecision(first, stored)).toEqual(applied);
  });

  it("strips unknown-composition omniscient Sort Card details before live apply and journal replay", () => {
    const state = createInitialGame(78133, { firstPlayer: "cpu", trackEventLog: true });
    state.currentPlayer = "cpu";
    state.players.cpu.stones = 1;
    state.players.cpu.masterHp = 1;
    state.players.cpu.hand = [{ cardId: "card_115", instanceId: "cpu-unknown-sort" }];
    state.players.cpu.deck = ["card_047", "card_001", "card_133", "card_051", "card_006"].map(
      (cardId, index) => ({ cardId, instanceId: `cpu-unknown-top-${index}` }),
    );
    state.players.player.hand = [];
    for (const slot of Object.values(state.slots)) delete slot.monster;

    const decision = chooseCpuDecision(state, {
      profile: "omniscient",
      opponentKnowledgePolicy: "unknown_composition",
      tuning: { weights: { genericMagicCost: -1000 } },
    });
    expect(decision.type).toBe("magic");
    if (decision.type !== "magic") return;
    expect(decision.action.handInstanceId).toBe("cpu-unknown-sort");
    expect(decision.action.deckTopOrderInstanceIds).toBeUndefined();

    const actual = applyCpuDecision(state, decision);
    const stored = actual.aiDecisionHistory?.at(-1)?.decision;
    expect(stored?.type).toBe("magic");
    if (stored?.type !== "magic") return;
    expect(stored.action.deckTopOrderInstanceIds).toEqual(
      actual.players.cpu.deck.slice(0, 5).map((card) => card.instanceId),
    );
    expect(stored.action.deckTopOrderInstanceIds).not.toContain("info:cpu:deck:0:card_047");
    expect(applyStoredAiDecision(state, stored)).toEqual(actual);

    const created = createBattleJournal(state);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const payload = extractAiDecisionCommand(state, actual);
    expect(payload.ok).toBe(true);
    if (!payload.ok) return;
    const appended = appendBattleCommand(created.value, state, actual, payload.value);
    expect(appended.ok).toBe(true);
    if (!appended.ok) return;
    const replay = seekBattleJournal(appended.value, 1);
    expect(replay.ok).toBe(true);
    if (replay.ok) expect(replay.value.state).toEqual(actual);
  });
});

function privateZoneKeys(state: ReturnType<typeof createInitialGame>, playerId: "player" | "cpu"): string[] {
  const player = state.players[playerId];
  return [...player.hand, ...player.deck].map((card) => `${card.instanceId}:${card.cardId}`);
}

function createPreparedMonster(
  cardId: string,
  instanceId: string,
  overrides: Partial<MonsterState> = {},
): MonsterState {
  return {
    cardId,
    instanceId,
    owner: overrides.owner ?? "player",
    hp: 6,
    level: 1,
    status: "prepared",
    investedStones: 1,
    actionCount: 0,
    actionLimit: 1,
    focused: false,
    powerUp: false,
    shielded: false,
    ...overrides,
  };
}

function decisionPayloadKey(decision: ReturnType<typeof chooseCpuDecision>): string {
  const { reason: _reason, score: _score, trace: _trace, ...payload } = decision;
  return JSON.stringify(payload);
}
