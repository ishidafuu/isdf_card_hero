import { describe, expect, it } from "vitest";
import { applyCpuDecision, applyStoredAiDecision, chooseCpuDecision } from "../../src/game/cpuAi";
import { appendAiDecisionReviewEntry, appendControlledHumanActionReviewEntry, appendHumanActionReviewEntry } from "../../src/game/aiReviewTrace";
import { getCardDef, getCardPool, getMonsterDef } from "../../src/game/cards";
import { listExperimentalMasterActionCommands } from "../../src/game/experimentalMasters";
import type { ExperimentContextV1 } from "../../src/game/experimentalContext";
import {
  attackWithCommand,
  createInitialGame,
  discardHandCard,
  endTurn,
  endTurnWithHandLimitDiscards,
  focusMonster,
  moveMonster,
  playMagic,
  resolveLevelUp,
  summonMonster,
  useMasterAction,
  useMasterHpDraw,
} from "../../src/game/rules";
import {
  appendBattleCommand,
  branchBattleJournal,
  createBattleJournal,
  extractAiDecisionCommand,
  hashBattleState,
  markBattleJournalIncomplete,
  parseBattleJournal,
  seekBattleJournal,
  seekBattleJournalAtCursors,
  serializeBattleJournal,
} from "../../src/replay/battleJournal";
import { isValidHumanAction } from "../../src/replay/schema";
import type { GameState, HumanActionSnapshot, MonsterState, PlayerId } from "../../src/game/types";
import type { BattleJournal } from "../../src/replay/types";
import type { BattleJournalMetadataV2 } from "../../src/replay/types";

function initialState(firstPlayer: "player" | "cpu" = "player"): GameState {
  return createInitialGame(12345, { firstPlayer, trackEventLog: true });
}

function applyHumanEndTurn(state: GameState): GameState {
  const action: HumanActionSnapshot = { type: "end_turn" };
  const next = endTurn(state);
  appendHumanActionReviewEntry(next, state, action);
  return next;
}

function appendHumanEndTurn(journal: BattleJournal, state: GameState) {
  const action: HumanActionSnapshot = { type: "end_turn" };
  const next = endTurn(state);
  appendHumanActionReviewEntry(next, state, action);
  const result = appendBattleCommand(journal, state, next, { controller: "human", action });
  if (!result.ok) throw new Error(result.error.message);
  return { journal: result.value, state: next };
}

function stateWithSummonedMonster(): GameState {
  for (let seed = 12345; seed < 12360; seed += 1) {
    const state = createInitialGame(seed, { trackEventLog: true });
    const card = state.players.player.hand.find((entry) => getCardDef(entry.cardId).type === "monster");
    if (card) return summonMonster(state, card.instanceId, "player_front_left");
  }
  throw new Error("Expected a monster in one of the deterministic opening hands.");
}

function activeMonster(cardId: string, owner: PlayerId, overrides: Partial<MonsterState> = {}): MonsterState {
  const def = getMonsterDef(cardId);
  const level = def.levels[0];
  return {
    instanceId: `${owner}_${cardId}_journal_fixture`,
    cardId,
    owner,
    hp: level.maxHp,
    level: level.level,
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

function verifyHumanCommandRoundTrip(before: GameState, action: HumanActionSnapshot, apply: (state: GameState) => GameState) {
  const after = apply(before);
  appendHumanActionReviewEntry(after, before, action);
  const created = createBattleJournal(before);
  expect(created.ok).toBe(true);
  if (!created.ok) return;
  const appended = appendBattleCommand(created.value, before, after, { controller: "human", action });
  expect(appended.ok, appended.ok ? "" : appended.error.message).toBe(true);
  if (!appended.ok) return;
  const replay = seekBattleJournal(appended.value, 1);
  expect(replay.ok, replay.ok ? "" : replay.error.message).toBe(true);
  if (replay.ok) expect(replay.value.state).toEqual(after);
}

describe("battle command journal", () => {
  it("keeps v1 legacy shape while v2 records fixed controllers and controlled-seat human history", () => {
    const before = initialState("player");
    const metadata: BattleJournalMetadataV2 = {
      controllerBySeat: { player: "human", cpu: "cpu" },
      opponentKnowledgePolicy: "known_deck",
    };
    const v1 = createBattleJournal(before);
    const v2 = createBattleJournal(before, metadata);
    expect(v1.ok && v1.value.schemaVersion).toBe(1);
    expect(v2.ok && v2.value.schemaVersion).toBe(2);
    if (!v2.ok) return;
    expect(v2.value.metadata).toEqual(metadata);

    const action: HumanActionSnapshot = { type: "end_turn" };
    const after = endTurn(before);
    appendControlledHumanActionReviewEntry(after, before, action, metadata.controllerBySeat);
    const appended = appendBattleCommand(v2.value, before, after, { controller: "human", action });
    expect(appended.ok, appended.ok ? "" : appended.error.message).toBe(true);
    if (!appended.ok) return;
    const replay = seekBattleJournal(appended.value, 1);
    expect(replay.ok, replay.ok ? "" : replay.error.message).toBe(true);
    if (replay.ok) expect(replay.value.state).toEqual(after);

    const wrongController = appendBattleCommand(v2.value, before, after, { controller: "ai", decision: {
      type: "end_turn", reason: "wrong seat controller", score: 0,
    } });
    expect(wrongController).toMatchObject({ ok: false, error: { code: "INVALID_COMMAND" } });
    if (appended.ok) {
      const imported = parseBattleJournal(JSON.stringify(appended.value));
      expect(imported.ok, imported.ok ? "" : imported.error.message).toBe(true);
    }
  });

  it("replays v2 CPU commands using the CPU-to-ai command mapping", () => {
    const before = initialState("cpu");
    const metadata: BattleJournalMetadataV2 = {
      controllerBySeat: { player: "human", cpu: "cpu" },
      opponentKnowledgePolicy: "known_deck",
    };
    const created = createBattleJournal(before, metadata);
    expect(created.ok && created.value.schemaVersion).toBe(2);
    if (!created.ok) return;
    const decision = { type: "end_turn" as const, reason: "v2 CPU mapping", score: 1 };
    const after = applyCpuDecision(before, decision, { reviewActor: "cpu" });
    const extracted = extractAiDecisionCommand(before, after, metadata);
    expect(extracted.ok, extracted.ok ? "" : extracted.error.message).toBe(true);
    if (!extracted.ok) return;
    const appended = appendBattleCommand(created.value, before, after, extracted.value);
    expect(appended.ok, appended.ok ? "" : appended.error.message).toBe(true);
    if (!appended.ok) return;
    expect(appended.value.commands[0]).toMatchObject({ controller: "ai", playerId: "cpu" });
    const replay = seekBattleJournal(appended.value, 1);
    expect(replay.ok, replay.ok ? "" : replay.error.message).toBe(true);
    if (replay.ok) expect(replay.value.state).toEqual(after);
  });

  it("records and replays a concrete experimental CPU action without re-running its chooser", () => {
    const context: ExperimentContextV1 = {
      format: "isdf-card-hero-experiment-context",
      version: 1,
      rulesProfileId: "experimental-decoy-timing-v1",
      masterOverlayBySeat: { cpu: "timing" },
    };
    const metadata: BattleJournalMetadataV2 = {
      controllerBySeat: { player: "human", cpu: "cpu" },
      experimentalContext: context,
      opponentKnowledgePolicy: "known_deck",
    };
    const before = initialState("cpu");
    before.players.cpu.stones = 5;
    const cardIndex = before.players.cpu.deck.findIndex((card) => {
      const definition = getCardDef(card.cardId);
      return definition.type === "monster" && getCardPool(definition) === "normal";
    });
    expect(cardIndex).toBeGreaterThanOrEqual(0);
    const [card] = before.players.cpu.deck.splice(cardIndex, 1);
    const definition = getMonsterDef(card.cardId);
    before.slots.cpu_back_left.monster = {
      ...activeMonster(card.cardId, "cpu", { hp: definition.levels[0].maxHp, actionLimit: definition.actionLimit ?? 1 }),
      status: "prepared",
    };

    const option = listExperimentalMasterActionCommands(before, context).find((candidate) => candidate.actionId === "quick_call");
    expect(option).toBeDefined();
    const created = createBattleJournal(before, metadata);
    expect(created.ok).toBe(true);
    if (!created.ok || !option) return;
    const decision = {
      type: "experimental_master_action" as const,
      ...option,
      reason: "stored experimental Quick Call",
      score: 7,
    };
    const after = applyCpuDecision(before, decision, { experimentalContext: context, reviewActor: "cpu" });
    const concrete = extractAiDecisionCommand(before, after, metadata);
    expect(concrete.ok).toBe(true);
    if (!concrete.ok) return;
    const appended = appendBattleCommand(created.value, before, after, concrete.value);
    expect(appended.ok, appended.ok ? "" : appended.error.message).toBe(true);
    if (!appended.ok) return;
    const serialized = serializeBattleJournal(appended.value);
    expect(serialized.ok).toBe(true);
    if (!serialized.ok) return;
    const parsed = parseBattleJournal(serialized.value);
    expect(parsed.ok, parsed.ok ? "" : parsed.error.message).toBe(true);
    if (!parsed.ok) return;
    const replay = seekBattleJournal(parsed.value, 1);
    expect(replay.ok, replay.ok ? "" : replay.error.message).toBe(true);
    if (replay.ok) expect(replay.value.state).toEqual(after);
    expect(() => applyCpuDecision(before, {
      ...decision,
      master: "decoy",
      actionId: "provoke",
    }, { experimentalContext: context, reviewActor: "cpu" })).toThrow();
  });

  it("keeps the legacy pending-owner/current-player AI replay hash exact", () => {
    const before = createInitialGame(7001, { firstPlayer: "cpu", trackEventLog: true });
    const cpuCard = before.players.cpu.hand.find((card) => card.cardId === "card_046");
    expect(cpuCard?.instanceId).toBe("cpu_card_046_2");
    if (!cpuCard) return;
    let pending = summonMonster(before, cpuCard.instanceId, "cpu_front_left");
    pending.slots.cpu_front_left.monster!.status = "active";
    pending.currentPlayer = "player";
    pending.pendingLevelUp = { playerId: "cpu", attackerSlotKey: "cpu_front_left", maxLevels: 1 };
    const decision = { type: "resolve_level_up" as const, levels: 0, reason: "legacy pending owner mismatch", score: 0 };
    const after = applyStoredAiDecision(pending, decision);
    expect(hashBattleState(pending)).toBe("dual32-v2:884f55c699db5714");
    expect(hashBattleState(after)).toBe("dual32-v2:263a693370572b83");
    const created = createBattleJournal(pending);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const appended = appendBattleCommand(created.value, pending, after, { controller: "ai", decision });
    expect(appended.ok, appended.ok ? "" : appended.error.message).toBe(true);
    if (!appended.ok) return;
    expect(appended.value.commands[0].playerId).toBe("player");
    const replay = seekBattleJournal(appended.value, 1);
    expect(replay.ok, replay.ok ? "" : replay.error.message).toBe(true);
    if (replay.ok) expect(replay.value.state).toEqual(after);
  });

  it("replays v2 pending-owner actions by effective seat for both human and CPU controllers", () => {
    const makePending = () => {
      const state = createInitialGame(7001, { firstPlayer: "cpu", trackEventLog: true });
      const card = state.players.cpu.hand.find((entry) => entry.cardId === "card_046");
      if (!card) throw new Error("Expected CPU card_046 fixture.");
      const pending = summonMonster(state, card.instanceId, "cpu_front_left");
      pending.slots.cpu_front_left.monster!.status = "active";
      pending.currentPlayer = "player";
      pending.pendingLevelUp = { playerId: "cpu", attackerSlotKey: "cpu_front_left", maxLevels: 1 };
      return pending;
    };
    const action: HumanActionSnapshot = { type: "resolve_level_up", levels: 0 };
    const humanMeta: BattleJournalMetadataV2 = {
      controllerBySeat: { player: "cpu", cpu: "human" },
      opponentKnowledgePolicy: "known_deck",
    };
    const humanBefore = makePending();
    const humanJournal = createBattleJournal(humanBefore, humanMeta);
    expect(humanJournal.ok).toBe(true);
    if (!humanJournal.ok) return;
    const humanAfter = resolveLevelUp(humanBefore, 0);
    appendControlledHumanActionReviewEntry(humanAfter, humanBefore, action, humanMeta.controllerBySeat);
    const humanAppend = appendBattleCommand(humanJournal.value, humanBefore, humanAfter, { controller: "human", action });
    expect(humanAppend.ok, humanAppend.ok ? "" : humanAppend.error.message).toBe(true);
    if (!humanAppend.ok) return;
    expect(humanAppend.value.commands[0].playerId).toBe("cpu");
    const humanReplay = seekBattleJournal(humanAppend.value, 1);
    expect(humanReplay.ok, humanReplay.ok ? "" : humanReplay.error.message).toBe(true);
    if (humanReplay.ok) expect(humanReplay.value.state).toEqual(humanAfter);

    const cpuMeta: BattleJournalMetadataV2 = {
      controllerBySeat: { player: "human", cpu: "cpu" },
      opponentKnowledgePolicy: "known_deck",
    };
    const cpuBefore = makePending();
    const cpuJournal = createBattleJournal(cpuBefore, cpuMeta);
    expect(cpuJournal.ok).toBe(true);
    if (!cpuJournal.ok) return;
    const decision = { type: "resolve_level_up" as const, levels: 0, reason: "v2 pending-owner", score: 0 };
    const cpuAfter = applyCpuDecision(cpuBefore, decision, { reviewActor: "cpu" });
    const cpuPayload = extractAiDecisionCommand(cpuBefore, cpuAfter, cpuMeta);
    expect(cpuPayload.ok, cpuPayload.ok ? "" : cpuPayload.error.message).toBe(true);
    if (!cpuPayload.ok) return;
    const cpuAppend = appendBattleCommand(cpuJournal.value, cpuBefore, cpuAfter, cpuPayload.value);
    expect(cpuAppend.ok, cpuAppend.ok ? "" : cpuAppend.error.message).toBe(true);
    if (!cpuAppend.ok) return;
    expect(cpuAppend.value.commands[0].playerId).toBe("cpu");
    const cpuReplay = seekBattleJournal(cpuAppend.value, 1);
    expect(cpuReplay.ok, cpuReplay.ok ? "" : cpuReplay.error.message).toBe(true);
    if (cpuReplay.ok) expect(cpuReplay.value.state).toEqual(cpuAfter);
  });

  it("round-trips concrete human commands through the actual rules dispatcher", () => {
    const attack = initialState();
    attack.slots.player_front_left.monster = activeMonster("polyspinner", "player");
    attack.slots.cpu_front_left.monster = activeMonster("takokke", "cpu");
    const attackAction: HumanActionSnapshot = {
      type: "attack",
      action: { attackerSlotKey: "player_front_left", commandId: "attack", target: { kind: "monster", slotKey: "cpu_front_left" } },
    };
    verifyHumanCommandRoundTrip(attack, attackAction, (state) => attackWithCommand(state, attackAction.action));

    const masterAction = initialState();
    masterAction.players.player.stones = 3;
    const masterAttack: HumanActionSnapshot = { type: "master_action", actionId: "master_attack", target: { kind: "master", playerId: "cpu" } };
    verifyHumanCommandRoundTrip(masterAction, masterAttack, (state) => useMasterAction(state, masterAttack.actionId, masterAttack.target));

    const summon = initialState();
    const summonCard = summon.players.player.hand.find((card) => getCardDef(card.cardId).type === "monster");
    expect(summonCard).toBeDefined();
    if (summonCard) {
      const summonAction: HumanActionSnapshot = { type: "summon", handInstanceId: summonCard.instanceId, slotKey: "player_front_left" };
      verifyHumanCommandRoundTrip(summon, summonAction, (state) => summonMonster(state, summonAction.handInstanceId, summonAction.slotKey));
    }

    const magic = initialState();
    magic.players.player.hand = [{ cardId: "card_148", instanceId: "journal_mirror" }];
    const mirrorDef = getCardDef("card_148");
    expect(mirrorDef.type).toBe("magic");
    magic.players.player.stones = mirrorDef.type === "magic" ? mirrorDef.cost + 1 : 0;
    magic.slots.player_front_left.monster = activeMonster("bomuzo", "player", { hp: 2, level: 2, investedStones: 2 });
    magic.slots.cpu_front_left.monster = activeMonster("polyspinner", "cpu", { level: 2, investedStones: 2 });
    const magicAction: HumanActionSnapshot = {
      type: "magic",
      action: {
        handInstanceId: "journal_mirror",
        target: { kind: "monster", slotKey: "player_front_left" },
        secondaryTarget: { kind: "monster", slotKey: "cpu_front_left" },
      },
    };
    verifyHumanCommandRoundTrip(magic, magicAction, (state) => playMagic(state, magicAction.action));

    const move = initialState();
    move.slots.player_front_left.monster = activeMonster("polyspinner", "player");
    const moveAction: HumanActionSnapshot = { type: "move", fromSlotKey: "player_front_left", toSlotKey: "player_back_left" };
    verifyHumanCommandRoundTrip(move, moveAction, (state) => moveMonster(state, moveAction.fromSlotKey, moveAction.toSlotKey));

    const focus = initialState();
    focus.slots.player_front_left.monster = activeMonster("polyspinner", "player", { actionCount: 1 });
    const focusAction: HumanActionSnapshot = { type: "focus", slotKey: "player_front_left" };
    verifyHumanCommandRoundTrip(focus, focusAction, (state) => focusMonster(state, focusAction.slotKey));

    const hpDraw = initialState();
    verifyHumanCommandRoundTrip(hpDraw, { type: "master_hp_draw" }, useMasterHpDraw);

    const discard = initialState();
    const extraDiscardCard = discard.players.player.deck.pop();
    expect(extraDiscardCard).toBeDefined();
    if (!extraDiscardCard) return;
    discard.players.player.hand.push({ ...extraDiscardCard, instanceId: "journal_manual_discard" });
    const discardId = "journal_manual_discard";
    verifyHumanCommandRoundTrip(discard, { type: "discard_hand", handInstanceId: discardId }, (state) => discardHandCard(state, discardId));

    const decline = initialState();
    decline.slots.player_front_left.monster = activeMonster("bomuzo", "player");
    decline.pendingLevelUp = { playerId: "player", attackerSlotKey: "player_front_left", maxLevels: 1 };
    verifyHumanCommandRoundTrip(decline, { type: "resolve_level_up", levels: 0 }, (state) => resolveLevelUp(state, 0));

    const partial = initialState();
    partial.players.player.stones = 3;
    partial.slots.player_front_left.monster = activeMonster("bomuzo", "player");
    partial.pendingLevelUp = { playerId: "player", attackerSlotKey: "player_front_left", maxLevels: 2 };
    verifyHumanCommandRoundTrip(partial, { type: "resolve_level_up", levels: 1 }, (state) => resolveLevelUp(state, 1));

    const superLevel = initialState();
    superLevel.players.player.hand = [{ cardId: "card_006", instanceId: "journal_bomb_king" }];
    superLevel.players.player.stones = 3;
    superLevel.slots.player_front_left.monster = activeMonster("bomuzo", "player", { level: 2, investedStones: 2 });
    superLevel.pendingLevelUp = {
      playerId: "player", attackerSlotKey: "player_front_left", maxLevels: 1,
      superOptions: [{ handInstanceId: "journal_bomb_king", cardId: "card_006" }],
    };
    verifyHumanCommandRoundTrip(
      superLevel,
      { type: "resolve_level_up", levels: 1, superHandInstanceId: "journal_bomb_king" },
      (state) => resolveLevelUp(state, 1, "journal_bomb_king"),
    );

    const overflow = initialState();
    const extraCard = overflow.players.player.deck.pop();
    expect(extraCard).toBeDefined();
    if (extraCard) {
      const extraId = "journal_hand_limit_discard";
      overflow.players.player.hand.push({ ...extraCard, instanceId: extraId });
      const action: HumanActionSnapshot = { type: "end_turn", discardHandInstanceIds: [extraId] };
      verifyHumanCommandRoundTrip(overflow, action, (state) => endTurnWithHandLimitDiscards(state, [extraId]));
    }
  });

  it("replays several choices produced by the real CPU chooser without re-choosing", () => {
    let state = initialState("cpu");
    const created = createBattleJournal(state);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    let journal = created.value;
    let cpuChoices = 0;

    for (let step = 0; step < 10 && !state.winner; step += 1) {
      if (state.currentPlayer === "player") {
        const before = state;
        const action: HumanActionSnapshot = { type: "end_turn" };
        const after = endTurn(before);
        appendHumanActionReviewEntry(after, before, action);
        const appended = appendBattleCommand(journal, before, after, { controller: "human", action });
        expect(appended.ok, appended.ok ? "" : appended.error.message).toBe(true);
        if (!appended.ok) return;
        journal = appended.value;
        state = after;
        continue;
      }
      const before = state;
      const choice = chooseCpuDecision(before);
      const after = applyCpuDecision(before, choice);
      const extracted = extractAiDecisionCommand(before, after);
      expect(extracted.ok, extracted.ok ? "" : extracted.error.message).toBe(true);
      if (!extracted.ok) return;
      const appended = appendBattleCommand(journal, before, after, extracted.value);
      expect(appended.ok, appended.ok ? "" : appended.error.message).toBe(true);
      if (!appended.ok) return;
      journal = appended.value;
      state = after;
      cpuChoices += 1;
    }

    expect(cpuChoices).toBeGreaterThanOrEqual(2);
    const replay = seekBattleJournal(journal, journal.commands.length);
    expect(replay.ok, replay.ok ? "" : replay.error.message).toBe(true);
    if (replay.ok) expect(replay.value.state).toEqual(state);
  });

  it("records Sort Card's concrete live deck order and replays the exact stored order", () => {
    const state = createInitialGame(78127, { firstPlayer: "cpu", trackEventLog: true });
    state.currentPlayer = "cpu";
    state.players.cpu.stones = 1;
    state.players.cpu.masterHp = 3;
    state.players.cpu.hand = [{ cardId: "card_115", instanceId: "journal_cpu_sort" }];
    state.players.cpu.deck = ["card_047", "card_001", "card_133", "card_051", "card_006"].map(
      (cardId, index) => ({ cardId, instanceId: `journal_cpu_top_${index}` }),
    );
    state.players.player.hand = [];
    for (const slot of Object.values(state.slots)) delete slot.monster;
    const created = createBattleJournal(state);
    expect(created.ok).toBe(true);
    if (!created.ok) return;

    const genericDecision = {
      type: "magic" as const,
      action: { handInstanceId: "journal_cpu_sort", target: { kind: "master" as const, playerId: "cpu" as const } },
      reason: "Sort Card live journal fixture",
      score: 0,
    };
    const actual = applyCpuDecision(state, genericDecision);
    const savedDecision = actual.aiDecisionHistory?.at(-1)?.decision;
    expect(savedDecision?.type).toBe("magic");
    if (savedDecision?.type !== "magic") return;
    expect(savedDecision.action.deckTopOrderInstanceIds).toEqual(actual.players.cpu.deck.slice(0, 5).map((card) => card.instanceId));
    expect(savedDecision.action.deckTopOrderInstanceIds).not.toContain("info:cpu:deck:0:card_047");

    const payload = extractAiDecisionCommand(state, actual);
    expect(payload.ok, payload.ok ? "" : payload.error.message).toBe(true);
    if (!payload.ok) return;
    const appended = appendBattleCommand(created.value, state, actual, payload.value);
    expect(appended.ok, appended.ok ? "" : appended.error.message).toBe(true);
    if (!appended.ok) return;
    const replay = seekBattleJournal(appended.value, 1);
    expect(replay.ok, replay.ok ? "" : replay.error.message).toBe(true);
    if (replay.ok) expect(replay.value.state).toEqual(actual);
  });

  it("seeks and parses more than 240 commands independently of review-history caps", () => {
    let state = createInitialGame(12345);
    state.players.player.masterHp = 100_000;
    state.players.cpu.masterHp = 100_000;
    const created = createBattleJournal(state);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    let journal = created.value;
    const aiDecision = { type: "end_turn" as const, reason: "bounded history fixture", score: 0 };
    const startedAt = performance.now();
    for (let index = 0; index < 121; index += 1) {
      const humanBefore = state;
      const humanAfter = applyHumanEndTurn(humanBefore);
      const humanAppend = appendBattleCommand(journal, humanBefore, humanAfter, { controller: "human", action: { type: "end_turn" } });
      expect(humanAppend.ok).toBe(true);
      if (!humanAppend.ok) return;
      journal = humanAppend.value;
      state = humanAfter;

      const aiBefore = state;
      const aiAfter = applyStoredAiDecision(aiBefore, aiDecision);
      const aiAppend = appendBattleCommand(journal, aiBefore, aiAfter, { controller: "ai", decision: aiDecision });
      expect(aiAppend.ok).toBe(true);
      if (!aiAppend.ok) return;
      journal = aiAppend.value;
      state = aiAfter;
    }
    expect(journal.commands).toHaveLength(242);
    const seekStartedAt = performance.now();
    const replay = seekBattleJournal(journal, journal.commands.length);
    expect(replay.ok).toBe(true);
    if (replay.ok) expect(replay.value.state).toEqual(state);
    const seekMs = performance.now() - seekStartedAt;
    const serialized = serializeBattleJournal(journal);
    expect(serialized.ok).toBe(true);
    if (!serialized.ok) return;
    const parseStartedAt = performance.now();
    const parsed = parseBattleJournal(serialized.value);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(seekBattleJournal(parsed.value, 242)).toMatchObject({ ok: true, value: { state } });
    const parseMs = performance.now() - parseStartedAt;
    console.info(`battleJournal 242-command benchmark: seek=${seekMs.toFixed(1)}ms parse+replay=${parseMs.toFixed(1)}ms`);
    expect(performance.now() - startedAt).toBeLessThan(120_000);
  });

  it("continues complete journal recording while both 240-entry review histories roll over", () => {
    let state = initialState();
    state.players.player.masterHp = 100_000;
    state.players.cpu.masterHp = 100_000;
    const aiDecision = { type: "end_turn" as const, reason: "review history cutoff fixture", score: 0 };
    for (let index = 0; index < 239; index += 1) {
      appendHumanActionReviewEntry(state, state, { type: "end_turn" });
      appendAiDecisionReviewEntry(state, state, aiDecision, "end_turn");
    }
    const created = createBattleJournal(state);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    let journal = created.value;
    for (let index = 0; index < 2; index += 1) {
      const humanBefore = state;
      const humanAfter = applyHumanEndTurn(humanBefore);
      const humanAppend = appendBattleCommand(journal, humanBefore, humanAfter, { controller: "human", action: { type: "end_turn" } });
      expect(humanAppend.ok).toBe(true);
      if (!humanAppend.ok) return;
      journal = humanAppend.value;
      state = humanAfter;
      const aiBefore = state;
      const aiAfter = applyStoredAiDecision(aiBefore, aiDecision);
      const aiAppend = appendBattleCommand(journal, aiBefore, aiAfter, { controller: "ai", decision: aiDecision });
      expect(aiAppend.ok).toBe(true);
      if (!aiAppend.ok) return;
      journal = aiAppend.value;
      state = aiAfter;
    }
    expect(journal.commands).toHaveLength(4);
    expect(state.humanActionHistory).toHaveLength(240);
    expect(state.humanActionHistory?.at(-1)?.sequence).toBe(241);
    expect(state.aiDecisionHistory).toHaveLength(240);
    expect(state.aiDecisionHistory?.at(-1)?.sequence).toBe(241);
    const replay = seekBattleJournal(journal, journal.commands.length);
    expect(replay.ok).toBe(true);
    if (replay.ok) expect(replay.value.state).toEqual(state);
  });

  it("contains hostile runtime validation exceptions inside Result failures", () => {
    const state = initialState();
    const hostile = new Proxy(state, { get() { throw new Error("hostile state getter"); } }) as GameState;
    expect(() => createBattleJournal(hostile)).not.toThrow();
    expect(createBattleJournal(hostile)).toMatchObject({ ok: false, error: { code: "INVALID_GAME_STATE" } });
    const valid = createBattleJournal(state);
    expect(valid.ok).toBe(true);
    if (!valid.ok) return;
    const hostileJournal = new Proxy(valid.value, { get(target, key, receiver) {
      if (key === "commands") throw new Error("hostile journal getter");
      return Reflect.get(target, key, receiver);
    } }) as BattleJournal;
    expect(() => serializeBattleJournal(hostileJournal)).not.toThrow();
    expect(serializeBattleJournal(hostileJournal).ok).toBe(false);
    expect(parseBattleJournal("{" )).toMatchObject({ ok: false, error: { code: "INVALID_JSON" } });
  });

  it("replays human and stored AI decisions to identical full states, including logs, RNG, and review histories", () => {
    const start = initialState();
    const journalResult = createBattleJournal(start);
    expect(journalResult.ok).toBe(true);
    if (!journalResult.ok) return;

    const humanStep = appendHumanEndTurn(journalResult.value, start);
    const aiDecision = {
      type: "end_turn" as const,
      reason: "stored fixture decision",
      score: 17,
      trace: { totalScore: 19, baseScore: 17 },
    };
    const actualAfterAi = applyStoredAiDecision(humanStep.state, aiDecision);
    const extracted = extractAiDecisionCommand(humanStep.state, actualAfterAi);
    expect(extracted.ok).toBe(true);
    if (!extracted.ok) return;

    const aiAppend = appendBattleCommand(humanStep.journal, humanStep.state, actualAfterAi, extracted.value);
    expect(aiAppend, aiAppend.ok ? "" : aiAppend.error.message).toMatchObject({ ok: true });
    if (!aiAppend.ok) return;

    const replay = seekBattleJournal(aiAppend.value, 2);
    expect(replay.ok).toBe(true);
    if (!replay.ok) return;
    expect(replay.value.state).toEqual(actualAfterAi);
    expect(replay.value.state.randomSeed).toBe(actualAfterAi.randomSeed);
    expect(replay.value.state.log).toEqual(actualAfterAi.log);
    expect(replay.value.state.eventLog).toEqual(actualAfterAi.eventLog);
    expect(replay.value.state.humanActionHistory).toEqual(actualAfterAi.humanActionHistory);
    expect(replay.value.state.aiDecisionHistory).toEqual(actualAfterAi.aiDecisionHistory);
  });

  it("returns multiple cursor snapshots from one fully validated replay pass", () => {
    const start = initialState();
    const created = createBattleJournal(start);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const first = appendHumanEndTurn(created.value, start);
    const decision = { type: "end_turn" as const, reason: "multi cursor", score: 0 };
    const secondAfter = applyStoredAiDecision(first.state, decision);
    const payload = extractAiDecisionCommand(first.state, secondAfter);
    expect(payload.ok).toBe(true);
    if (!payload.ok) return;
    const second = appendBattleCommand(first.journal, first.state, secondAfter, payload.value);
    expect(second.ok).toBe(true);
    if (!second.ok) return;
    const snapshots = seekBattleJournalAtCursors(second.value, [2, 0, 1]);
    expect(snapshots.ok, snapshots.ok ? "" : snapshots.error.message).toBe(true);
    if (!snapshots.ok) return;
    expect(snapshots.value.get(0)?.state).toEqual(start);
    expect(snapshots.value.get(1)?.state).toEqual(first.state);
    expect(snapshots.value.get(2)?.state).toEqual(secondAfter);
    for (const cursor of [0, 1, 2]) {
      const single = seekBattleJournal(second.value, cursor);
      expect(single.ok).toBe(true);
      if (single.ok) expect(snapshots.value.get(cursor)).toEqual(single.value);
    }
    const malformed = structuredClone(second.value);
    malformed.commands[0].sequence = 99;
    expect(seekBattleJournalAtCursors(malformed, [0, 1])).toMatchObject({ ok: false, error: { code: "INVALID_JOURNAL" } });
    const unknownRoot = { ...second.value, stateSummary: "unexpected" };
    expect(seekBattleJournalAtCursors(unknownRoot, [0, 1])).toMatchObject({ ok: false, error: { code: "INVALID_JOURNAL" } });
  });

  it("keeps seek and branch pure and leaves the original journal unchanged", () => {
    const start = initialState();
    const created = createBattleJournal(start);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const one = appendHumanEndTurn(created.value, start);
    const beforeBranch = structuredClone(one.journal);

    const atZero = seekBattleJournal(one.journal, 0);
    const atOne = seekBattleJournal(one.journal, 1);
    const branch = branchBattleJournal(one.journal, 0);
    expect(atZero.ok && atZero.value.state).toEqual(start);
    expect(atOne.ok && atOne.value.state).toEqual(one.state);
    expect(branch.ok).toBe(true);
    if (!branch.ok) return;
    expect(branch.value.commands).toHaveLength(0);
    expect(one.journal).toEqual(beforeBranch);
    expect(one.journal.commands).toHaveLength(1);
  });

  it("rejects a branch when a semantically corrupt command exists after the selected cursor", () => {
    const start = initialState();
    const created = createBattleJournal(start);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const one = appendHumanEndTurn(created.value, start);
    const corrupted = structuredClone(one.journal);
    corrupted.commands[0].afterHash = "dual32-v2:0000000000000000";
    expect(branchBattleJournal(corrupted, 0)).toMatchObject({ ok: false, error: { code: "HASH_MISMATCH" } });
  });

  it("imports only complete valid journals and rejects corrupt state, unknown actions, and legacy reports", () => {
    const start = initialState();
    const created = createBattleJournal(start);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const emptyJson = serializeBattleJournal(created.value);
    expect(emptyJson.ok).toBe(true);
    if (emptyJson.ok) {
      const emptyImport = parseBattleJournal(emptyJson.value);
      expect(emptyImport.ok).toBe(true);
      if (emptyImport.ok) expect(seekBattleJournal(emptyImport.value, 0)).toMatchObject({ ok: true, value: { cursor: 0, totalCommands: 0, state: start } });
    }
    const { journal } = appendHumanEndTurn(created.value, start);
    const serialized = serializeBattleJournal(journal);
    expect(serialized.ok).toBe(true);
    if (!serialized.ok) return;

    const roundTrip = parseBattleJournal(serialized.value);
    expect(roundTrip.ok).toBe(true);
    if (roundTrip.ok) expect(seekBattleJournal(roundTrip.value, 1).ok).toBe(true);

    const tampered = structuredClone(journal);
    tampered.commands[0].afterHash = tampered.initialHash;
    expect(serializeBattleJournal(tampered).ok).toBe(false);

    const corruptSnapshot = JSON.parse(serialized.value) as { initialState: GameState } & Record<string, unknown>;
    corruptSnapshot.initialState.players.player.masterHp -= 1;
    expect(parseBattleJournal(JSON.stringify(corruptSnapshot))).toMatchObject({ ok: false, error: { code: "HASH_MISMATCH" } });

    const unknownAction = JSON.parse(serialized.value) as { commands: Array<Record<string, unknown>> } & Record<string, unknown>;
    unknownAction.commands[0].action = { type: "future_action" };
    expect(parseBattleJournal(JSON.stringify(unknownAction))).toMatchObject({ ok: false, error: { code: "INVALID_JOURNAL" } });

    const legacyReport = { reportId: "old", stateSummary: {}, aiDecisionHistory: [], log: ["only a partial report"] };
    expect(parseBattleJournal(JSON.stringify(legacyReport))).toMatchObject({ ok: false, error: { code: "LEGACY_ANALYSIS_ONLY" } });
  });

  it("rejects incomplete export while allowing seek only within the captured prefix", () => {
    const start = initialState();
    const created = createBattleJournal(start);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const one = appendHumanEndTurn(created.value, start);
    const incomplete = markBattleJournalIncomplete(one.journal, "worker decision missing");
    expect(serializeBattleJournal(incomplete)).toMatchObject({ ok: false, error: { code: "INCOMPLETE_JOURNAL" } });
    expect(seekBattleJournal(incomplete, 1).ok).toBe(true);
    expect(seekBattleJournal(incomplete, 2)).toMatchObject({ ok: false, error: { code: "INVALID_CURSOR" } });
  });

  it("validates every concrete human action including a zero-level decline", () => {
    const actions: HumanActionSnapshot[] = [
      { type: "attack", action: { attackerSlotKey: "player_front_left", commandId: "attack", target: { kind: "master", playerId: "cpu" } } },
      { type: "master_action", actionId: "master_attack", target: { kind: "master", playerId: "cpu" } },
      { type: "summon", handInstanceId: "hand-1", slotKey: "player_front_left" },
      { type: "magic", action: { handInstanceId: "hand-2", target: { kind: "master", playerId: "cpu" } } },
      { type: "move", fromSlotKey: "player_front_left", toSlotKey: "player_back_left" },
      { type: "focus", slotKey: "player_front_left" },
      { type: "master_hp_draw" },
      { type: "discard_hand", handInstanceId: "hand-3" },
      { type: "resolve_level_up", levels: 0 },
      { type: "end_turn", discardHandInstanceIds: ["hand-4"] },
    ];
    expect(actions.every(isValidHumanAction)).toBe(true);
  });

  it("rejects unknown cards, duplicate card-instance IDs, invalid monster placement/values, and unknown state fields", () => {
    const valid = stateWithSummonedMonster();
    expect(createBattleJournal(valid).ok).toBe(true);

    const unknownCard = structuredClone(valid);
    unknownCard.players.player.hand[0].cardId = "unknown-card";
    expect(createBattleJournal(unknownCard)).toMatchObject({ ok: false, error: { code: "INVALID_GAME_STATE" } });

    const duplicate = structuredClone(valid);
    duplicate.players.player.hand[0].instanceId = duplicate.players.player.deck[0].instanceId;
    expect(createBattleJournal(duplicate)).toMatchObject({ ok: false, error: { code: "INVALID_GAME_STATE" } });

    const wrongOwner = structuredClone(valid);
    const monster = wrongOwner.slots.player_front_left.monster;
    expect(monster).toBeDefined();
    if (monster) {
      delete wrongOwner.slots.player_front_left.monster;
      wrongOwner.slots.cpu_front_left.monster = { ...monster, owner: "player" };
    }
    expect(createBattleJournal(wrongOwner)).toMatchObject({ ok: false, error: { code: "INVALID_GAME_STATE" } });

    const badHealth = structuredClone(valid);
    badHealth.players.player.masterHp = 19.5;
    expect(createBattleJournal(badHealth)).toMatchObject({ ok: false, error: { code: "INVALID_GAME_STATE" } });

    const badMonsterType = structuredClone(valid);
    const magicCard = badMonsterType.players.player.deck.find((entry) => getCardDef(entry.cardId).type === "magic");
    expect(magicCard).toBeDefined();
    if (magicCard && badMonsterType.slots.player_front_left.monster) {
      badMonsterType.slots.player_front_left.monster.cardId = magicCard.cardId;
    }
    expect(createBattleJournal(badMonsterType)).toMatchObject({ ok: false, error: { code: "INVALID_GAME_STATE" } });

    const badLevel = structuredClone(valid);
    if (badLevel.slots.player_front_left.monster) badLevel.slots.player_front_left.monster.level = 99;
    expect(createBattleJournal(badLevel)).toMatchObject({ ok: false, error: { code: "INVALID_GAME_STATE" } });

    const missingMonsterFlag = structuredClone(valid);
    if (missingMonsterFlag.slots.player_front_left.monster) {
      Object.assign(missingMonsterFlag.slots.player_front_left.monster, { focused: undefined });
    }
    expect(createBattleJournal(missingMonsterFlag)).toMatchObject({ ok: false, error: { code: "INVALID_GAME_STATE" } });

    const badInvestedStones = structuredClone(valid);
    if (badInvestedStones.slots.player_front_left.monster) badInvestedStones.slots.player_front_left.monster.investedStones = 0.5;
    expect(createBattleJournal(badInvestedStones)).toMatchObject({ ok: false, error: { code: "INVALID_GAME_STATE" } });

    const unknownField = { ...valid, injected: true };
    expect(createBattleJournal(unknownField)).toMatchObject({ ok: false, error: { code: "INVALID_GAME_STATE" } });

    const missingPendingAttacker = initialState();
    missingPendingAttacker.pendingLevelUp = { playerId: "player", attackerSlotKey: "player_front_left", maxLevels: 1 };
    expect(createBattleJournal(missingPendingAttacker).ok).toBe(false);

    const wrongPendingOwner = initialState();
    wrongPendingOwner.slots.player_front_left.monster = activeMonster("bomuzo", "player");
    wrongPendingOwner.pendingLevelUp = { playerId: "cpu", attackerSlotKey: "player_front_left", maxLevels: 1 };
    expect(createBattleJournal(wrongPendingOwner).ok).toBe(false);

    const invalidSuperOption = initialState();
    invalidSuperOption.slots.player_front_left.monster = activeMonster("bomuzo", "player", { level: 2, investedStones: 2 });
    invalidSuperOption.players.player.hand = [{ cardId: "card_148", instanceId: "not_a_super" }];
    invalidSuperOption.pendingLevelUp = {
      playerId: "player", attackerSlotKey: "player_front_left", maxLevels: 1,
      superOptions: [{ handInstanceId: "not_a_super", cardId: "card_148" }],
    };
    expect(createBattleJournal(invalidSuperOption).ok).toBe(false);

    const invalidMirror = structuredClone(valid);
    const mirrorMonster = invalidMirror.slots.player_front_left.monster;
    if (mirrorMonster) {
      mirrorMonster.mirroredFormOriginal = { cardId: "card_148", level: 1, actionLimit: 1 };
    }
    expect(createBattleJournal(invalidMirror).ok).toBe(false);

    const validMirror = structuredClone(valid);
    const validMirrorMonster = validMirror.slots.player_front_left.monster;
    if (validMirrorMonster) {
      const original = getMonsterDef("bomuzo");
      validMirrorMonster.mirroredFormOriginal = { cardId: "bomuzo", level: 1, actionLimit: original.actionLimit ?? 1 };
    }
    expect(createBattleJournal(validMirror).ok).toBe(true);
  });

  it("uses stable key ordering and detects an after-state mismatch during recording", () => {
    const state = initialState();
    const reordered = Object.fromEntries(Object.entries(state).reverse()) as GameState;
    expect(hashBattleState(reordered)).toBe(hashBattleState(state));
    const created = createBattleJournal(state);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const actual = applyHumanEndTurn(state);
    const wrongAfter = structuredClone(actual);
    wrongAfter.randomSeed = (wrongAfter.randomSeed + 1) >>> 0;
    expect(appendBattleCommand(created.value, state, wrongAfter, { controller: "human", action: { type: "end_turn" } }))
      .toMatchObject({ ok: false, error: { code: "HASH_MISMATCH" } });
  });
});
