import { describe, expect, it } from "vitest";
import { getCardDef, getCardPool, getMonsterDef } from "../../src/game/cards";
import { applyCpuDecision, applyStoredAiDecision, chooseCpuDecision, inspectCpuTerminalPlan, listCpuDecisions, runCpuDecisionStep } from "../../src/game/cpuAi";
import { getEffectiveExperimentalMaster, getExperimentalNativeMasterActionIds, listExperimentalMasterActionCommands } from "../../src/game/experimentalMasters";
import { createInitialGame } from "../../src/game/rules";
import { appendBattleCommand, createBattleJournal, seekBattleJournal } from "../../src/replay/battleJournal";
import type { BattleJournalMetadataV2 } from "../../src/replay/types";
import type { ExperimentContextV1 } from "../../src/game/experimentalContext";
import type { MonsterState } from "../../src/game/types";

const timingContext: ExperimentContextV1 = {
  format: "isdf-card-hero-experiment-context",
  version: 1,
  rulesProfileId: "experimental-decoy-timing-v1",
  masterOverlayBySeat: { cpu: "timing" },
};
const decoyPlayerContext: ExperimentContextV1 = {
  ...timingContext,
  masterOverlayBySeat: { player: "decoy" },
};

describe("experimental master session integration", () => {
  it("exposes only candidate-native actions and rejects unavailable baseline powers", () => {
    const state = createInitialGame(93001, { firstPlayer: "cpu", trackEventLog: true });
    state.currentPlayer = "cpu";
    const native = getExperimentalNativeMasterActionIds(state, timingContext);
    expect(native).toEqual(["master_attack"]);
    expect(listCpuDecisions(state, undefined, timingContext).some((decision) =>
      decision.type === "master_action" && decision.actionId === "shield",
    )).toBe(false);
    expect(() => applyCpuDecision(state, {
      type: "master_action",
      actionId: "shield",
      target: { kind: "monster", slotKey: "player_front_left" },
      reason: "illegal baseline ability under overlay",
      score: 0,
    }, { experimentalContext: timingContext })).toThrow(/実験マスターでは使用できない/);
  });

  it("keeps experimental powers legal across normal CPU profiles, including WhiteV2 planning", () => {
    const state = createInitialGame(93004, {
      firstPlayer: "cpu",
      masterIds: { cpu: "black" },
    });
    state.currentPlayer = "cpu";
    state.players.cpu.stones = 8;
    for (const slot of Object.values(state.slots)) {
      delete slot.monster;
    }
    const profiles = ["stable", "white", "white_planner", "white_rollout", "white_v2"] as const;
    for (const profile of profiles) {
      const decision = chooseCpuDecision(state, {
        profiles: { player: "stable", cpu: profile },
        experimentalContext: {
          ...timingContext,
          masterOverlayBySeat: { cpu: "decoy" },
        },
      });
      expect(decision.type === "master_action" && ["berserk_power", "earth_anger"].includes(decision.actionId)).toBe(false);
      if (decision.type === "experimental_master_action") {
        expect(() => applyCpuDecision(state, decision, {
          experimentalContext: { ...timingContext, masterOverlayBySeat: { cpu: "decoy" } },
        })).not.toThrow();
      }
    }
  });

  it("resolves exchanged capability from the borrowed seat and blocks frozen actors", () => {
    const state = createInitialGame(93002);
    state.players.player.masterActionsExchanged = true;
    state.players.cpu.masterActionsExchanged = true;
    expect(getEffectiveExperimentalMaster(state, timingContext, "player")).toBe("timing");
    expect(getExperimentalNativeMasterActionIds(state, timingContext, "player")).toEqual(["master_attack"]);

    const frozen = structuredClone(state);
    frozen.currentPlayer = "player";
    frozen.players.player.masterFrozen = true;
    expect(listExperimentalMasterActionCommands(frozen, {
      ...timingContext,
      masterOverlayBySeat: { cpu: "timing" },
    })).toEqual([]);
  });

  it("applies a legal Quick Call with matching display/event logs and no virtual card residue", () => {
    const state = createInitialGame(93003, { firstPlayer: "cpu", trackEventLog: true });
    state.currentPlayer = "cpu";
    state.players.cpu.stones = 5;
    const cardIndex = state.players.cpu.deck.findIndex((card) => {
      const definition = getCardDef(card.cardId);
      return definition.type === "monster" && getCardPool(definition) === "normal";
    });
    expect(cardIndex).toBeGreaterThanOrEqual(0);
    const [card] = state.players.cpu.deck.splice(cardIndex, 1);
    const definition = getMonsterDef(card.cardId);
    state.slots.cpu_back_left.monster = createPreparedMonster(card.cardId, card.instanceId, {
      owner: "cpu",
      hp: definition.levels[0].maxHp,
      actionLimit: definition.actionLimit ?? 1,
    });

    const option = listExperimentalMasterActionCommands(state, timingContext)
      .find((candidate) => candidate.actionId === "quick_call");
    expect(option).toBeDefined();
    const next = applyCpuDecision(state, {
      type: "experimental_master_action",
      master: "timing",
      actionId: option!.actionId,
      target: option!.target,
      ...(option!.secondaryTarget ? { secondaryTarget: option!.secondaryTarget } : {}),
      reason: "legal Quick Call integration",
      score: 3,
    }, { experimentalContext: timingContext, reviewActor: "cpu" });

    expect(next.slots.cpu_back_left.monster?.status).toBe("active");
    expect(next.players.cpu.hand.some((item) => item.instanceId.startsWith("__master_lab_virtual__"))).toBe(false);
    expect(next.players.cpu.discard.some((item) => item.instanceId.startsWith("__master_lab_virtual__"))).toBe(false);
    expect(next.log).toEqual(expect.arrayContaining(next.eventLog ?? []));
    expect(next.eventLog?.at(-1)).toContain("クイックコール");
  });

  it("routes actual experimental CPU commands through v2 journals (decoy tuning is not a strength claim)", () => {
    const timing = createInitialGame(93005, { firstPlayer: "cpu", trackEventLog: true });
    timing.currentPlayer = "cpu";
    timing.players.cpu.stones = 1;
    timing.players.cpu.hand = [];
    for (const slot of Object.values(timing.slots)) delete slot.monster;
    const timingCard = takeFrontCard(timing, "cpu");
    timing.slots.cpu_back_left.monster = createPreparedMonster(timingCard.cardId, timingCard.instanceId, { owner: "cpu" });
    assertChosenExperimentalCommand(timing, timingContext, "timing");
    const plannerOptions = { profile: "white_planner" as const, experimentalContext: timingContext };
    expect(inspectCpuTerminalPlan(timing, plannerOptions)).toMatchObject({
      enabled: false,
      rejectedReason: "legacy terminal-plan root is disabled for experimental master overlays",
    });
    const plannerDecision = chooseCpuDecision(timing, plannerOptions);
    expect(plannerDecision.type === "master_action" && plannerDecision.actionId !== "master_attack").toBe(false);
    expect(() => runCpuDecisionStep(timing, plannerOptions)).not.toThrow();

    const decoy = createInitialGame(93006, { firstPlayer: "cpu", trackEventLog: true });
    decoy.currentPlayer = "player";
    decoy.players.player.stones = 2;
    decoy.players.player.masterHp = 1;
    decoy.players.player.hand = [];
    for (const slot of Object.values(decoy.slots)) delete slot.monster;
    const ally = takeFrontCard(decoy, "player");
    const enemy = takeFrontCard(decoy, "cpu");
    decoy.slots.player_back_left.monster = createPreparedMonster(ally.cardId, ally.instanceId, {
      owner: "player", status: "active", actionCount: 1,
    });
    decoy.slots.cpu_front_left.monster = createPreparedMonster(enemy.cardId, enemy.instanceId, {
      owner: "cpu", status: "active", actionCount: 0,
    });
    // This exercises chooser → apply → journal → replay wiring, not default tactical strength.
    assertChosenExperimentalCommand(decoy, decoyPlayerContext, "decoy", {
      actionBias: { experimental_master_action: 100 },
    });
  });
});

function assertChosenExperimentalCommand(
  before: ReturnType<typeof createInitialGame>,
  context: ExperimentContextV1,
  expectedMaster: "decoy" | "timing",
  tuning?: { actionBias: { experimental_master_action: number } },
): void {
  const decision = chooseCpuDecision(before, {
    profile: "white",
    experimentalContext: context,
    ...(tuning ? { tuning } : {}),
  });
  const experimentalCandidates = listCpuDecisions(before, undefined, context)
    .filter((candidate) => candidate.type === "experimental_master_action");
  expect(experimentalCandidates.length).toBeGreaterThan(0);
  expect(decision.type, `${expectedMaster} chooser selection; candidates=${JSON.stringify(experimentalCandidates)}`).toBe("experimental_master_action");
  if (decision.type !== "experimental_master_action") return;
  expect(decision.master).toBe(expectedMaster);
  expect(experimentalCandidates).toContainEqual(expect.objectContaining({
    master: decision.master,
    actionId: decision.actionId,
    target: decision.target,
    ...(decision.secondaryTarget ? { secondaryTarget: decision.secondaryTarget } : {}),
  }));
  const metadata: BattleJournalMetadataV2 = {
    controllerBySeat: { player: "cpu", cpu: "cpu" },
    experimentalContext: context,
    opponentKnowledgePolicy: "known_deck",
  };
  const journal = createBattleJournal(before, metadata);
  expect(journal.ok).toBe(true);
  if (!journal.ok) return;
  const after = applyStoredAiDecision(before, decision, { experimentalContext: context, reviewActor: before.currentPlayer });
  const appended = appendBattleCommand(journal.value, before, after, { controller: "ai", decision });
  expect(appended.ok, appended.ok ? "" : appended.error.message).toBe(true);
  if (!appended.ok) return;
  const replay = seekBattleJournal(appended.value, 1);
  expect(replay.ok, replay.ok ? "" : replay.error.message).toBe(true);
  if (replay.ok) expect(replay.value.state).toEqual(after);
}

function takeFrontCard(state: ReturnType<typeof createInitialGame>, owner: "player" | "cpu") {
  const player = state.players[owner];
  const zones = [player.hand, player.deck];
  for (const zone of zones) {
    const index = zone.findIndex((card) => {
      try {
        return getMonsterDef(card.cardId).role === "front";
      } catch {
        return false;
      }
    });
    if (index >= 0) return zone.splice(index, 1)[0];
  }
  throw new Error(`No front monster available for ${owner}`);
}

function createPreparedMonster(
  cardId: string,
  instanceId: string,
  overrides: Partial<MonsterState> = {},
): MonsterState {
  const definition = getMonsterDef(cardId);
  return {
    cardId,
    instanceId,
    owner: overrides.owner ?? "cpu",
    hp: overrides.hp ?? definition.levels[0].maxHp,
    level: 1,
    status: "prepared",
    investedStones: 1,
    actionCount: 0,
    actionLimit: overrides.actionLimit ?? definition.actionLimit ?? 1,
    focused: false,
    powerUp: false,
    shielded: false,
    ...overrides,
  };
}
