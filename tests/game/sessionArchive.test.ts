import { describe, expect, it } from "vitest";
import { createDefaultAiProfiles } from "../../src/game/defaultAiProfiles";
import { buildDeckCardIds } from "../../src/game/cards";
import { createInitialGame, endTurn } from "../../src/game/rules";
import { applyStoredAiDecision } from "../../src/game/cpuAi";
import type { ExperimentContextV1 } from "../../src/game/experimentalContext";
import { appendHumanActionReviewEntry } from "../../src/game/aiReviewTrace";
import { appendBattleCommand, hashBattleState, seekBattleJournalAtCursors } from "../../src/replay/battleJournal";
import { getSessionArchiveEnvelope, parseSessionArchiveEnvelope, restoreSessionArchive, restoreSessionArchiveWithSnapshot, restoreSessionArchiveWithVerifiedHeads, serializeSessionArchive, serializeTrustedSessionRuntime, validateSessionArchiveStructure, verifySessionArchiveReplayHeads } from "../../src/sessions/archive";
import { createBattleBranchPlan, startSession } from "../../src/sessions/plans";
import { completeGauntletStage, createGauntletSession } from "../../src/sessions/challenges";
import type { SessionArchive, SessionPlan, SessionPlanBase, SessionRuntime } from "../../src/sessions/types";
import { loadSessionArchive, saveSessionRuntime, type SessionStorageLike } from "../../src/sessions/storage";

function plan(): SessionPlan {
  const decks: SessionPlanBase["decks"] = {
    player: { cardIds: buildDeckCardIds(12446, { masterId: "white" }), allowSpecial: false },
    cpu: { cardIds: buildDeckCardIds(12547, { masterId: "black" }), allowSpecial: false },
  };
  return { kind: "battle", seed: 12345, firstPlayer: "player", profiles: createDefaultAiProfiles(), masters: { player: "white", cpu: "black" }, decks, controllerBySeat: { player: "human", cpu: "cpu" } };
}
function createRuntime() {
  const value = plan();
  const result = startSession(value, { createId: () => "archive-session", createInitialGame: () => createInitialGame(value.seed, {
    firstPlayer: value.firstPlayer, masterIds: value.masters, playerDeckCardIds: [...value.decks.player.cardIds],
    cpuDeckCardIds: [...value.decks.cpu.cardIds], allowSpecialDecks: { player: false, cpu: false }, trackEventLog: true,
  }) });
  if (!result.ok || !result.value.journal || !result.value.game) throw new Error(result.ok ? "missing game" : result.error.message);
  const action = { type: "end_turn" as const };
  const before = result.value.game;
  const after = endTurn(before);
  appendHumanActionReviewEntry(after, before, action);
  const nextJournal = appendBattleCommand(result.value.journal, before, after, { controller: "human", action });
  if (!nextJournal.ok) throw new Error(nextJournal.error.message);
  return { ...result.value, game: after, journal: nextJournal.value };
}

describe("session archive", () => {
  it("round-trips an externally exported legacy battle archive through full validation and restore", () => {
    const runtime = createRuntime();
    const serialized = serializeSessionArchive(runtime);
    expect(serialized.ok, serialized.ok ? "" : serialized.error.message).toBe(true);
    if (!serialized.ok) return;
    const parsed = parseSessionArchiveEnvelope(serialized.value);
    expect(parsed.ok, parsed.ok ? "" : parsed.error.message).toBe(true);
    if (!parsed.ok) return;
    const restored = restoreSessionArchive(parsed.value);
    expect(restored.ok, restored.ok ? "" : restored.error.message).toBe(true);
    if (restored.ok) expect(restored.value.game).toEqual(runtime.game);
  });

  it("accepts a Worker-verified head without replaying again and rejects stale or altered heads", () => {
    const runtime = createRuntime();
    const expected = runtime.journal!.commands.at(-1)!.afterHash;
    const snapshot = { state: runtime.game!, cursor: runtime.journal!.commands.length, totalCommands: runtime.journal!.commands.length };
    expect(hashBattleState(snapshot.state)).toBe(expected);
    const envelope = getSessionArchiveEnvelope(runtime);
    const accepted = restoreSessionArchiveWithSnapshot(envelope, snapshot);
    expect(accepted.ok, accepted.ok ? "" : accepted.error.message).toBe(true);
    const stale = restoreSessionArchiveWithSnapshot(envelope, { ...snapshot, cursor: snapshot.cursor - 1 });
    expect(stale).toMatchObject({ ok: false, error: { code: "JOURNAL_MISMATCH" } });
    const altered = structuredClone(snapshot);
    altered.state.randomSeed += 1;
    expect(restoreSessionArchiveWithSnapshot(envelope, altered)).toMatchObject({ ok: false, error: { code: "JOURNAL_MISMATCH" } });
  });

  it("rejects mismatched v2 controller metadata and never upgrades incomplete captures", () => {
    const runtime = createRuntime();
    const trusted = serializeTrustedSessionRuntime(runtime);
    expect(trusted.ok).toBe(true);
    if (!trusted.ok) return;
    const parsed = JSON.parse(trusted.value) as Record<string, unknown>;
    const journal = parsed.journal as Record<string, unknown>;
    journal.schemaVersion = 2;
    journal.metadata = { controllerBySeat: { player: "cpu", cpu: "human" }, opponentKnowledgePolicy: "known_deck" };
    expect(validateSessionArchiveStructure(parsed)).toMatchObject({ ok: false, error: { code: "JOURNAL_MISMATCH" } });
  });

  it("rejects runtime-only keys from imported archive envelopes", () => {
    const runtime = createRuntime();
    expect(validateSessionArchiveStructure({ ...getSessionArchiveEnvelope(runtime), game: runtime.game }))
      .toMatchObject({ ok: false, error: { code: "INVALID_ARCHIVE" } });
  });

  it("validates pre-battle progress even when there is no current journal", () => {
    const battlePlan = plan();
    const gauntletPlan: SessionPlan = {
      ...battlePlan,
      kind: "gauntlet",
      gauntletId: "three-battle-test",
      gauntletVersion: 1,
    };
    const created = startSession(gauntletPlan, {
      createId: () => "gauntlet-session",
      createInitialGame: () => createInitialGame(gauntletPlan.seed, {
        firstPlayer: gauntletPlan.firstPlayer,
        masterIds: gauntletPlan.masters,
        playerDeckCardIds: [...gauntletPlan.decks.player.cardIds],
        cpuDeckCardIds: [...gauntletPlan.decks.cpu.cardIds],
        allowSpecialDecks: { player: false, cpu: false },
        trackEventLog: true,
      }),
    });
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const malformed: SessionArchive = {
      ...getSessionArchiveEnvelope(created.value),
      journal: null,
      progress: { kind: "gauntlet", gauntletId: "three-battle-test", gauntletVersion: 1, status: "completed", stageIndex: 3, completedBattles: [] },
    };
    expect(validateSessionArchiveStructure(malformed).ok).toBe(true);
    expect(serializeSessionArchive(malformed)).toMatchObject({ ok: false, error: { code: "INVALID_PROGRESS" } });
  });

  it("autosaves trusted runtime as an envelope and reports storage/quota failures", () => {
    const runtime = createRuntime();
    let saved: string | null = null;
    const memory: SessionStorageLike = {
      getItem: () => saved,
      setItem: (_key, value) => { saved = value; },
      removeItem: () => { saved = null; },
    };
    expect(saveSessionRuntime(runtime, memory).ok).toBe(true);
    const loaded = loadSessionArchive(memory);
    expect(loaded.ok && loaded.value?.journal).toEqual(runtime.journal);
    expect(saved).not.toContain('"game"');
    const broken: SessionStorageLike = { ...memory, setItem: () => { throw Object.assign(new Error("quota"), { name: "QuotaExceededError" }); } };
    expect(saveSessionRuntime(runtime, broken)).toMatchObject({ ok: false, error: { code: "STORAGE_QUOTA_EXCEEDED" } });
    const unavailable: SessionStorageLike = { ...memory, getItem: () => { throw new Error("denied"); } };
    expect(loadSessionArchive(unavailable)).toMatchObject({ ok: false, error: { code: "STORAGE_UNAVAILABLE" } });
    const corrupt: SessionStorageLike = { ...memory, getItem: () => "{" };
    expect(loadSessionArchive(corrupt)).toMatchObject({ ok: false, error: { code: "INVALID_ARCHIVE" } });
  });

  it("isolates restored manifest and branch provenance from later caller mutation", () => {
    const base = plan();
    const sourcePlan: SessionPlan = { ...base, kind: "local-pvp", controllerBySeat: { player: "human", cpu: "human" } };
    const source = startSession(sourcePlan, {
      createId: () => "immutable-source",
      createInitialGame: () => createInitialGame(sourcePlan.seed, {
        firstPlayer: sourcePlan.firstPlayer, masterIds: sourcePlan.masters,
        playerDeckCardIds: [...sourcePlan.decks.player.cardIds], cpuDeckCardIds: [...sourcePlan.decks.cpu.cardIds],
        allowSpecialDecks: { player: false, cpu: false }, trackEventLog: true,
      }),
    });
    expect(source.ok).toBe(true);
    if (!source.ok || !source.value.journal || !source.value.game) return;
    const before = source.value.game;
    const after = endTurn(before);
    appendHumanActionReviewEntry(after, before, { type: "end_turn" });
    const sourceJournal = appendBattleCommand(source.value.journal, before, after, { controller: "human", action: { type: "end_turn" } });
    expect(sourceJournal.ok).toBe(true);
    if (!sourceJournal.ok) return;
    const branchSource = {
      sourceSessionId: source.value.manifest.id,
      sourceManifest: source.value.manifest,
      sourceJournal: sourceJournal.value,
      sourceProgress: source.value.progress,
      sourceCursor: 0,
      sourceHeadHash: hashBattleState(before),
    };
    const branchPlan: SessionPlan = { ...base, opponentKnowledgePolicy: "unknown_composition", branchSource };
    const branch = startSession(branchPlan, { createId: () => "immutable-branch", createInitialGame: () => structuredClone(before) });
    expect(branch.ok).toBe(true);
    if (!branch.ok || !branch.value.game) return;
    const envelope = structuredClone(getSessionArchiveEnvelope(branch.value));
    const verification = verifySessionArchiveReplayHeads(envelope);
    expect(verification.ok).toBe(true);
    if (!verification.ok) return;
    const restored = restoreSessionArchiveWithVerifiedHeads(envelope, verification.value.replayHeads);
    expect(restored.ok).toBe(true);
    if (!restored.ok || !restored.value.branchSource) return;
    const frozenManifest = restored.value.manifest;
    const frozenSource = restored.value.branchSource;
    (envelope.manifest as unknown as { seed: number }).seed = 99;
    (envelope.branchSource!.sourceManifest as unknown as { seed: number }).seed = 98;
    expect(restored.value.manifest).toBe(frozenManifest);
    expect(restored.value.branchSource).toBe(frozenSource);
    expect(restored.value.manifest.seed).toBe(12345);
    expect(restored.value.branchSource.sourceManifest.seed).toBe(12345);
    expect(Object.isFrozen(restored.value.manifest.decks.player.cardIds)).toBe(true);
    expect(Object.isFrozen(restored.value.branchSource.sourceJournal.commands)).toBe(true);

    for (const mutateBothConfigs of [
      (current: { seed: number }, sourceConfig: { seed: number }) => { current.seed += 1; sourceConfig.seed += 1; },
      (current: { masters: { player: string } }, sourceConfig: { masters: { player: string } }) => { current.masters.player = "black"; sourceConfig.masters.player = "black"; },
      (current: { decks: { player: { cardIds: string[] } } }, sourceConfig: { decks: { player: { cardIds: string[] } } }) => { current.decks.player.cardIds.reverse(); sourceConfig.decks.player.cardIds.reverse(); },
    ]) {
      const tampered = structuredClone(envelope) as unknown as {
        manifest: { seed: number; masters: { player: string }; decks: { player: { cardIds: string[] } } };
        branchSource: { sourceManifest: { seed: number; masters: { player: string }; decks: { player: { cardIds: string[] } } } };
      };
      mutateBothConfigs(tampered.manifest, tampered.branchSource.sourceManifest);
      expect(verifySessionArchiveReplayHeads(tampered)).toMatchObject({ ok: false, error: { code: "JOURNAL_MISMATCH" } });
    }

    const branchGame = branch.value.game;
    const branchAfter = endTurn(branchGame);
    appendHumanActionReviewEntry(branchAfter, branchGame, { type: "end_turn" });
    const branchJournal = appendBattleCommand(branch.value.journal!, branchGame, branchAfter, { controller: "human", action: { type: "end_turn" } });
    expect(branchJournal.ok).toBe(true);
    if (!branchJournal.ok || !branch.value.branchSource) return;
    const branchHead = seekBattleJournalAtCursors(branchJournal.value, [1]);
    expect(branchHead.ok).toBe(true);
    if (!branchHead.ok) return;
    const secondPlan = createBattleBranchPlan({
      sourceManifest: branch.value.manifest,
      sourceJournal: branchJournal.value,
      sourceProgress: branch.value.progress,
      sourceBranchSource: branch.value.branchSource,
      sourceCursor: 1,
      verifiedSourceSnapshot: branchHead.value.get(1)!,
      controllerBySeat: { player: "human", cpu: "human" },
    });
    expect(secondPlan.ok).toBe(true);
    if (!secondPlan.ok) return;
    const secondBranch = startSession(secondPlan.value, { createInitialGame: () => structuredClone(branchAfter) });
    expect(secondBranch.ok).toBe(true);
    if (!secondBranch.ok) return;
    const secondVerification = verifySessionArchiveReplayHeads(getSessionArchiveEnvelope(secondBranch.value));
    expect(secondVerification.ok).toBe(true);
    if (!secondVerification.ok) return;
    expect(restoreSessionArchiveWithVerifiedHeads(secondVerification.value.archive, secondVerification.value.replayHeads).ok).toBe(true);

    const corruptTail = structuredClone(getSessionArchiveEnvelope(branch.value));
    const corruptSourceJournal = corruptTail.branchSource!.sourceJournal as unknown as { commands: Array<{ afterHash: string }> };
    corruptSourceJournal.commands[0].afterHash = "dual32-v2:0000000000000000";
    expect(serializeSessionArchive(corruptTail)).toMatchObject({ ok: false, error: { code: "JOURNAL_MISMATCH" } });
    expect(verifySessionArchiveReplayHeads(corruptTail)).toMatchObject({ ok: false, error: { code: "JOURNAL_MISMATCH" } });
  });

  it("fails closed when branch provenance exceeds the documented depth limit", () => {
    let source: SessionRuntime = createRuntime();
    let created = 0;
    for (let depth = 0; depth <= 8; depth += 1) {
      const journal = source.journal;
      const state = source.game;
      if (!journal || !state) throw new Error("branch chain fixture lost its battle");
      const verified = seekBattleJournalAtCursors(journal, [0]);
      expect(verified.ok).toBe(true);
      if (!verified.ok) return;
      const branchPlan = createBattleBranchPlan({
        sourceManifest: source.manifest,
        sourceJournal: journal,
        sourceProgress: source.progress,
        ...(source.branchSource ? { sourceBranchSource: source.branchSource } : {}),
        sourceCursor: 0,
        verifiedSourceSnapshot: verified.value.get(0)!,
        controllerBySeat: { player: "human", cpu: "human" },
        id: `depth-branch-${depth}`,
      });
      if (depth === 8) {
        expect(branchPlan).toMatchObject({ ok: false, error: { code: "INVALID_PLAN" } });
        break;
      }
      expect(branchPlan.ok).toBe(true);
      if (!branchPlan.ok) return;
      const branch = startSession(branchPlan.value, {
        createId: () => `depth-session-${created++}`,
        createInitialGame: () => structuredClone(verified.value.get(0)!.state),
      });
      expect(branch.ok).toBe(true);
      if (!branch.ok) return;
      source = branch.value;
    }
  });

  it("binds experimental branch context to the source journal metadata", () => {
    const base = plan();
    const context: ExperimentContextV1 = {
      format: "isdf-card-hero-experiment-context" as const,
      version: 1 as const,
      rulesProfileId: "experimental-decoy-timing-v1" as const,
      masterOverlayBySeat: { player: "decoy" as const },
    };
    const sourcePlan: SessionPlan = {
      ...base,
      kind: "experimental",
      experimentalContext: context,
      controllerBySeat: { player: "human", cpu: "cpu" },
    };
    const source = startSession(sourcePlan, {
      createInitialGame: () => createInitialGame(sourcePlan.seed, {
        firstPlayer: sourcePlan.firstPlayer,
        masterIds: sourcePlan.masters,
        playerDeckCardIds: [...sourcePlan.decks.player.cardIds],
        cpuDeckCardIds: [...sourcePlan.decks.cpu.cardIds],
        allowSpecialDecks: { player: false, cpu: false },
        trackEventLog: true,
      }),
    });
    expect(source.ok).toBe(true);
    if (!source.ok || !source.value.journal || !source.value.game) return;
    const before = source.value.game;
    const after = endTurn(before);
    appendHumanActionReviewEntry(after, before, { type: "end_turn" });
    const journal = appendBattleCommand(source.value.journal, before, after, { controller: "human", action: { type: "end_turn" } });
    expect(journal.ok).toBe(true);
    if (!journal.ok) return;
    const snapshot = seekBattleJournalAtCursors(journal.value, [0]);
    expect(snapshot.ok).toBe(true);
    if (!snapshot.ok) return;
    const branchPlan = createBattleBranchPlan({
      sourceManifest: source.value.manifest,
      sourceJournal: journal.value,
      sourceProgress: source.value.progress,
      sourceCursor: 0,
      verifiedSourceSnapshot: snapshot.value.get(0)!,
      controllerBySeat: { player: "human", cpu: "human" },
    });
    expect(branchPlan.ok).toBe(true);
    if (!branchPlan.ok) return;
    const branch = startSession(branchPlan.value, { createInitialGame: () => structuredClone(before) });
    expect(branch.ok).toBe(true);
    if (!branch.ok) return;
    const envelope = structuredClone(getSessionArchiveEnvelope(branch.value)) as unknown as {
      manifest: { experimentalContext: ExperimentContextV1 };
      branchSource: { sourceManifest: { experimentalContext: ExperimentContextV1 } };
    };
    envelope.manifest.experimentalContext.masterOverlayBySeat = { player: "timing" };
    envelope.branchSource.sourceManifest.experimentalContext.masterOverlayBySeat = { player: "timing" };
    expect(verifySessionArchiveReplayHeads(envelope)).toMatchObject({ ok: false, error: { code: "JOURNAL_MISMATCH" } });
  });

  it("binds a completed Gauntlet stage-two source cursor to its canonical initializer", () => {
    const created = createGauntletSession({ id: "gauntlet-branch-source", seed: 85_100 });
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    let runtime = created.value;
    for (let stage = 0; stage < 3; stage += 1) {
      runtime = finishGauntletWithEndTurns(runtime);
      const completed = completeGauntletStage(runtime, "2026-09-29T00:00:00.000Z");
      expect(completed.ok).toBe(true);
      if (!completed.ok) return;
      runtime = completed.value;
    }
    expect(runtime.progress.kind === "gauntlet" && runtime.progress.status).toBe("completed");
    if (runtime.progress.kind !== "gauntlet") return;
    const selected = runtime.progress.completedBattles[2];
    const verified = seekBattleJournalAtCursors(selected.journal, [0]);
    expect(verified.ok).toBe(true);
    if (!verified.ok) return;
    const plan = createBattleBranchPlan({
      sourceManifest: runtime.manifest,
      sourceJournal: selected.journal,
      sourceProgress: runtime.progress,
      sourceCursor: 0,
      verifiedSourceSnapshot: verified.value.get(0)!,
      controllerBySeat: { player: "human", cpu: "human" },
    });
    expect(plan.ok).toBe(true);
    if (!plan.ok) return;
    const branch = startSession(plan.value, { createInitialGame: () => structuredClone(verified.value.get(0)!.state) });
    expect(branch.ok).toBe(true);
    if (!branch.ok) return;
    const replayVerified = verifySessionArchiveReplayHeads(getSessionArchiveEnvelope(branch.value));
    expect(replayVerified.ok).toBe(true);
    if (!replayVerified.ok) return;
    expect(restoreSessionArchiveWithVerifiedHeads(replayVerified.value.archive, replayVerified.value.replayHeads).ok).toBe(true);
  });

  it("restores a branch from a completed embedded stage while its Gauntlet is still active", () => {
    const started = createGauntletSession({ id: "active-gauntlet-embedded-branch", seed: 85_100 });
    expect(started.ok).toBe(true);
    if (!started.ok) return;
    const finishedStage = finishGauntletWithEndTurns(started.value);
    const advanced = completeGauntletStage(finishedStage, "2026-09-29T00:00:00.000Z");
    expect(advanced.ok).toBe(true);
    if (!advanced.ok || advanced.value.progress.kind !== "gauntlet") return;
    expect(advanced.value.progress.status).toBe("active");
    expect(advanced.value.progress.stageIndex).toBe(1);

    const selected = advanced.value.progress.completedBattles[0];
    const sourceHead = seekBattleJournalAtCursors(selected.journal, [0]);
    expect(sourceHead.ok).toBe(true);
    if (!sourceHead.ok) return;
    const branchPlan = createBattleBranchPlan({
      sourceManifest: advanced.value.manifest,
      sourceJournal: selected.journal,
      sourceProgress: advanced.value.progress,
      sourceCursor: 0,
      verifiedSourceSnapshot: sourceHead.value.get(0)!,
      controllerBySeat: { player: "human", cpu: "human" },
    });
    expect(branchPlan.ok, branchPlan.ok ? "" : branchPlan.error.message).toBe(true);
    if (!branchPlan.ok) return;
    const branch = startSession(branchPlan.value, { createInitialGame: () => structuredClone(sourceHead.value.get(0)!.state) });
    expect(branch.ok, branch.ok ? "" : branch.error.message).toBe(true);
    if (!branch.ok) return;

    const envelope = getSessionArchiveEnvelope(branch.value);
    const verified = verifySessionArchiveReplayHeads(envelope);
    expect(verified.ok, verified.ok ? "" : verified.error.message).toBe(true);
    if (!verified.ok) return;
    const restored = restoreSessionArchiveWithVerifiedHeads(verified.value.archive, verified.value.replayHeads);
    expect(restored.ok, restored.ok ? "" : restored.error.message).toBe(true);
    if (restored.ok) {
      expect(restored.value.branchSource?.sourceProgress).toEqual(advanced.value.progress);
      expect(restored.value.branchSource?.sourceJournal).toEqual(selected.journal);
    }

    const altered = structuredClone(envelope) as unknown as {
      manifest: { seed: number };
      branchSource?: { sourceManifest: { seed: number } };
    };
    if (altered.branchSource) {
      altered.manifest.seed += 1;
      altered.branchSource.sourceManifest.seed += 1;
    }
    expect(verifySessionArchiveReplayHeads(altered)).toMatchObject({ ok: false, error: { code: "JOURNAL_MISMATCH" } });
  });

  it("revalidates immutable challenge configuration at the Worker-head restore boundary", () => {
    const started = createGauntletSession({ id: "restore-gauntlet", seed: 81111 });
    expect(started.ok).toBe(true);
    if (!started.ok) return;
    const envelope = getSessionArchiveEnvelope(started.value);
    const verified = verifySessionArchiveReplayHeads(envelope);
    expect(verified.ok).toBe(true);
    if (!verified.ok) return;
    const altered = structuredClone(envelope);
    (altered.manifest as unknown as { seed: number }).seed += 1;
    expect(restoreSessionArchiveWithVerifiedHeads(altered, verified.value.replayHeads))
      .toMatchObject({ ok: false, error: { code: "JOURNAL_MISMATCH" } });
  });
});

function finishGauntletWithEndTurns(runtime: SessionRuntime): SessionRuntime {
  if (!runtime.game || !runtime.journal) throw new Error("missing active Gauntlet state");
  let game = runtime.game;
  let journal = runtime.journal;
  for (let step = 0; game.winner === undefined && step < 150; step += 1) {
    const before = game;
    let after: typeof game;
    let command: Parameters<typeof appendBattleCommand>[3];
    if (before.currentPlayer === "cpu") {
      const decision = { type: "end_turn" as const, reason: "archive branch fixture end-turn", score: 0 };
      after = applyStoredAiDecision(before, decision, { reviewActor: "cpu" });
      command = { controller: "ai", decision };
    } else {
      const action = { type: "end_turn" as const };
      after = endTurn(before);
      appendHumanActionReviewEntry(after, before, action);
      command = { controller: "human", action };
    }
    const appended = appendBattleCommand(journal, before, after, command);
    if (!appended.ok) throw new Error(appended.error.message);
    game = after;
    journal = appended.value;
  }
  if (game.winner === undefined) throw new Error("Gauntlet branch fixture exceeded 150 real end-turn commands");
  return { ...runtime, game, journal };
}
