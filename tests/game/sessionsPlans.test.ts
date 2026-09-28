import { describe, expect, it } from "vitest";
import { createDefaultAiProfiles } from "../../src/game/defaultAiProfiles";
import { appendHumanActionReviewEntry } from "../../src/game/aiReviewTrace";
import { createInitialGame, endTurn } from "../../src/game/rules";
import { appendBattleCommand, hashBattleState, seekBattleJournalAtCursors } from "../../src/replay/battleJournal";
import { createBattleBranchPlan, startSession, dailySeedForDateJst, captureJstDate } from "../../src/sessions/plans";
import type { SessionPlan, SessionPlanBase } from "../../src/sessions/types";
import type { GameState, PlayerId } from "../../src/game/types";

function collectDecks(game: GameState): SessionPlanBase["decks"] {
  const decks = {} as Record<PlayerId, { cardIds: string[]; allowSpecial: boolean }>;
  for (const seat of ["player", "cpu"] as const) {
    decks[seat] = {
      cardIds: [...game.players[seat].deck, ...game.players[seat].hand, ...game.players[seat].discard].map((card) => card.cardId),
      allowSpecial: false,
    };
  }
  return decks;
}

function createBattlePlan(): SessionPlan {
  const state = createInitialGame(12345, { firstPlayer: "player" });
  return {
    kind: "battle",
    seed: 12345,
    firstPlayer: "player",
    profiles: createDefaultAiProfiles(),
    masters: { player: state.players.player.masterId, cpu: state.players.cpu.masterId },
    decks: collectDecks(state),
    controllerBySeat: { player: "human", cpu: "cpu" },
  };
}

describe("session plans", () => {
  it("starts atomically with immutable manifest/progress and a journal while leaving GameState mutable", () => {
    const plan = createBattlePlan();
    let createdGame: GameState | null = null;
    const started = startSession(plan, {
      now: () => new Date("2026-09-29T02:00:00.000Z"),
      createId: () => "test-session",
      createInitialGame: () => {
        createdGame = createInitialGame(plan.seed, { firstPlayer: plan.firstPlayer, masterIds: plan.masters });
        return createdGame;
      },
    });
    expect(started.ok).toBe(true);
    if (!started.ok) return;
    expect(started.value.manifest.id).toBe("test-session");
    expect(started.value.manifest.controllerBySeat).toEqual({ player: "human", cpu: "cpu" });
    expect(started.value.progress).toEqual({ kind: "battle", status: "active" });
    expect(started.value.journal?.commands).toEqual([]);
    expect(Object.isFrozen(started.value.manifest)).toBe(true);
    expect(Object.isFrozen(started.value.manifest.decks.player.cardIds)).toBe(true);
    expect(Object.isFrozen(started.value.progress)).toBe(true);
    expect(Object.isFrozen(started.value.game)).toBe(false);
    expect(createdGame).toBe(started.value.game);
  });

  it("rejects mismatched initial state without producing a partial runtime", () => {
    const plan = createBattlePlan();
    const failed = startSession(plan, {
      createInitialGame: () => createInitialGame(54321, { firstPlayer: "player" }),
    });
    expect(failed).toMatchObject({ ok: false, error: { code: "INVALID_PLAN", path: "game.randomSeed" } });
  });

  it("rejects control characters in generated session identifiers", () => {
    const plan = createBattlePlan();
    expect(startSession(plan, { createId: () => "draft\u0001cpu" })).toMatchObject({
      ok: false, error: { code: "INVALID_PLAN", path: "id" },
    });
  });

  it("creates a fixed-seat v2 branch from a verified cursor without reapplying fresh-deck checks", () => {
    const plan = createBattlePlan();
    const sourcePlan: SessionPlan = { ...plan, kind: "local-pvp", controllerBySeat: { player: "human", cpu: "human" } };
    const source = startSession(sourcePlan, {
      createId: () => "source-session",
      createInitialGame: () => createInitialGame(sourcePlan.seed, { firstPlayer: sourcePlan.firstPlayer, masterIds: sourcePlan.masters, trackEventLog: true }),
    });
    expect(source.ok).toBe(true);
    if (!source.ok || !source.value.journal || !source.value.game) return;
    const before = source.value.game;
    const action = { type: "end_turn" as const };
    const after = endTurn(before);
    appendHumanActionReviewEntry(after, before, action);
    const appended = appendBattleCommand(source.value.journal, before, after, { controller: "human", action });
    expect(appended.ok).toBe(true);
    if (!appended.ok) return;
    const branchPlan: SessionPlan = {
      ...plan,
      kind: "battle",
      opponentKnowledgePolicy: source.value.manifest.opponentKnowledgePolicy,
      branchSource: {
        sourceSessionId: source.value.manifest.id,
        sourceManifest: source.value.manifest,
        sourceJournal: appended.value,
        sourceProgress: source.value.progress,
        sourceCursor: 1,
        sourceHeadHash: hashBattleState(after),
      },
    };
    const branch = startSession(branchPlan, { createInitialGame: () => structuredClone(after) });
    expect(branch.ok, branch.ok ? "" : branch.error.message).toBe(true);
    if (!branch.ok) return;
    expect(branch.value.manifest.controlPolicy).toBe("fixed-seat");
    expect(branch.value.manifest.opponentKnowledgePolicy).toBe("unknown_composition");
    expect(branch.value.journal?.schemaVersion).toBe(2);
    expect(branch.value.journal?.commands).toEqual([]);
    expect(branch.value.journal?.initialState).toEqual(after);
    expect(branch.value.branchSource?.sourceJournal).toEqual(appended.value);
  });

  it("builds a branch plan only from a Worker-verified cursor and preserves source config by default", () => {
    const standard = createBattlePlan();
    const sourcePlan: SessionPlan = { ...standard, kind: "local-pvp", controllerBySeat: { player: "human", cpu: "human" } };
    const source = startSession(sourcePlan, {
      createId: () => "branch-helper-source",
      createInitialGame: () => createInitialGame(sourcePlan.seed, { firstPlayer: sourcePlan.firstPlayer, masterIds: sourcePlan.masters, trackEventLog: true }),
    });
    expect(source.ok).toBe(true);
    if (!source.ok || !source.value.journal || !source.value.game) return;
    const before = source.value.game;
    const action = { type: "end_turn" as const };
    const after = endTurn(before);
    appendHumanActionReviewEntry(after, before, action);
    const appended = appendBattleCommand(source.value.journal, before, after, { controller: "human", action });
    expect(appended.ok).toBe(true);
    if (!appended.ok) return;
    const verified = seekBattleJournalAtCursors(appended.value, [1]);
    expect(verified.ok).toBe(true);
    if (!verified.ok) return;
    const plan = createBattleBranchPlan({
      sourceManifest: source.value.manifest,
      sourceJournal: appended.value,
      sourceProgress: source.value.progress,
      sourceCursor: 1,
      verifiedSourceSnapshot: verified.value.get(1)!,
      controllerBySeat: { player: "human", cpu: "cpu" },
      id: "branch-helper-result",
    });
    expect(plan.ok).toBe(true);
    if (!plan.ok) return;
    expect(plan.value).toMatchObject({
      kind: "battle",
      id: "branch-helper-result",
      seed: source.value.manifest.seed,
      firstPlayer: source.value.manifest.firstPlayer,
      masters: source.value.manifest.masters,
      decks: source.value.manifest.decks,
      profiles: source.value.manifest.profiles,
      opponentKnowledgePolicy: "unknown_composition",
      branchSource: { sourceSessionId: "branch-helper-source", sourceCursor: 1, sourceHeadHash: hashBattleState(after) },
    });
    expect(plan.value.kind === "battle" && plan.value.branchSource?.sourceManifest.kind).toBe("local-pvp");
    const branch = startSession(plan.value, { createInitialGame: () => structuredClone(after) });
    expect(branch.ok).toBe(true);
    const rejected = createBattleBranchPlan({
      sourceManifest: source.value.manifest,
      sourceJournal: appended.value,
      sourceProgress: source.value.progress,
      sourceCursor: 0,
      verifiedSourceSnapshot: verified.value.get(1)!,
      controllerBySeat: { player: "human", cpu: "cpu" },
    });
    expect(rejected).toMatchObject({ ok: false, error: { code: "JOURNAL_MISMATCH" } });
  });

  it("requires both local PvP seats to be human-controlled", () => {
    const plan = { ...createBattlePlan(), kind: "local-pvp", controllerBySeat: { player: "human", cpu: "cpu" } } as SessionPlan;
    expect(startSession(plan)).toMatchObject({ ok: false, error: { code: "INVALID_PLAN", path: "controllerBySeat" } });
  });

  it("allows empty pre-battle draft state but does not require a fake game or journal", () => {
    const plan = createBattlePlan();
    const started = startSession({
      ...plan,
      kind: "draft",
      draftId: "draft-2026-01",
      draftVersion: 1,
      decks: {
        player: { cardIds: [], allowSpecial: false },
        cpu: { cardIds: [], allowSpecial: false },
      },
    }, { createInitialGame: () => null });
    expect(started).toMatchObject({
      ok: true,
      value: { game: null, journal: null, progress: { kind: "draft", status: "drafting", packIndex: 0, pickEvents: [] } },
    });
  });

  it("captures JST date once and derives deterministic distinct daily seeds", () => {
    const beforeJstMidnight = new Date("2026-09-28T14:59:59.999Z");
    const afterJstMidnight = new Date("2026-09-28T15:00:00.000Z");
    const dateA = captureJstDate(beforeJstMidnight);
    const dateB = captureJstDate(afterJstMidnight);
    expect(dateA).toBe("2026-09-28");
    expect(dateB).toBe("2026-09-29");
    expect(dailySeedForDateJst(dateA)).toBe(dailySeedForDateJst(dateA));
    expect(dailySeedForDateJst(dateA)).not.toBe(dailySeedForDateJst(dateB));
    expect(() => dailySeedForDateJst("2026-02-30")).toThrow(RangeError);
  });
});
