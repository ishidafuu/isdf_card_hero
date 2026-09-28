import { describe, expect, it } from "vitest";
import { completeDraftBattleWithVerifiedHead, completeSealedBattleWithVerifiedHead, createDraftSession, getDraftView, pickDraftCard, startDraftBattle, createSealedSession, getSealedView, selectSealedDeck, startSealedBattle, isValidDraftProgress, isValidSealedProgress, updateSealedDeckSelection } from "../../src/sessions/limited";
import { getSessionArchiveEnvelope, parseSessionArchiveEnvelope, restoreSessionArchiveWithVerifiedHeads, serializeSessionArchive, serializeTrustedSessionRuntime, verifySessionArchiveReplayHeads } from "../../src/sessions/archive";
import { createBattleBranchPlan, startSession } from "../../src/sessions/plans";
import { buildDeckCardIds, getCardDefsByPool } from "../../src/game/cards";
import { endTurn } from "../../src/game/rules";
import { applyCpuDecision } from "../../src/game/cpuAi";
import { appendHumanActionReviewEntry } from "../../src/game/aiReviewTrace";
import { getEffectiveActor } from "../../src/game/seatControl";
import { appendBattleCommand, extractAiDecisionCommand, seekBattleJournal, seekBattleJournalAtCursors } from "../../src/replay/battleJournal";
import type { DraftPickEvent, SessionRuntime } from "../../src/sessions/types";

describe("limited sessions", () => {
  it("records six real passed packs as 60 unique seat picks and survives mid-draft save/restore", () => {
    const created = createDraftSession({ seed: 51_001, id: "draft-session", createdAt: "2026-09-29T00:00:00.000Z" });
    expect(created.ok).toBe(true);
    if (!created.ok || created.value.progress.kind !== "draft") return;
    let runtime = created.value;
    let humanPicks = 0;
    let savedMidDraft: SessionRuntime | undefined;
    let restoredMidDraft: SessionRuntime | undefined;
    while (runtime.progress.kind === "draft" && runtime.progress.status === "drafting") {
      const view = getDraftView(runtime, "player");
      expect(view.ok).toBe(true);
      if (!view.ok) return;
      expect(view.value.activeSeat).toBe("player");
      expect(view.value.choices.length).toBeGreaterThan(0);
      const picked = pickDraftCard(runtime, view.value.choices[0].pickId);
      expect(picked.ok).toBe(true);
      if (!picked.ok) return;
      runtime = picked.value;
      humanPicks += 1;
      if (humanPicks === 5) {
        savedMidDraft = runtime;
        const saved = serializeTrustedSessionRuntime(runtime);
        expect(saved.ok).toBe(true);
        if (!saved.ok) return;
        const parsed = parseSessionArchiveEnvelope(saved.value);
        expect(parsed.ok).toBe(true);
        if (!parsed.ok) return;
        const verifiedSave = verifySessionArchiveReplayHeads(parsed.value);
        expect(verifiedSave.ok).toBe(true);
        if (!verifiedSave.ok) return;
        const restored = restoreSessionArchiveWithVerifiedHeads(parsed.value, verifiedSave.value.replayHeads);
        expect(restored.ok).toBe(true);
        if (!restored.ok) return;
        restoredMidDraft = restored.value;
      }
      expect(runtime.progress.kind).toBe("draft");
    }
    expect(humanPicks).toBe(30);
    expect(runtime.progress.kind).toBe("draft");
    if (runtime.progress.kind !== "draft") return;
    expect(runtime.progress.status).toBe("deckReady");
    expect(runtime.progress.packIndex).toBe(6);
    expect(runtime.progress.pickEvents).toHaveLength(60);
    expect(new Set(runtime.progress.pickEvents.map((event) => event.pickId)).size).toBe(60);
    expect(runtime.progress.selectedDeckBySeat?.player).toHaveLength(30);
    expect(runtime.progress.selectedDeckBySeat?.cpu).toHaveLength(30);
    expect(isValidDraftProgress(runtime.manifest, runtime.progress)).toBe(true);
    expect(getDraftView(runtime, "cpu")).toMatchObject({ ok: true, value: { choices: [] } });

    expect(savedMidDraft?.progress.kind).toBe("draft");
    expect(savedMidDraft?.progress.kind === "draft" && savedMidDraft.progress.pickEvents).toHaveLength(10);
    expect(restoredMidDraft?.progress).toEqual(savedMidDraft?.progress);
    const resumed = restoredMidDraft && finishDraft(restoredMidDraft);
    expect(resumed?.ok).toBe(true);
    if (resumed?.ok && resumed.value.progress.kind === "draft" && runtime.progress.kind === "draft") {
      expect(resumed.value.progress.pickEvents).toEqual(runtime.progress.pickEvents);
      expect(resumed.value.progress.selectedDeckBySeat).toEqual(runtime.progress.selectedDeckBySeat);
    }

    const firstEvent = runtime.progress.kind === "draft" ? runtime.progress.pickEvents[0] : undefined;
    if (!firstEvent || runtime.progress.kind !== "draft") return;
    const tamperedEvent: DraftPickEvent = { ...firstEvent, picker: firstEvent.picker === "cpu" ? "player" : "cpu" };
    const tampered = { ...runtime.progress, pickEvents: [tamperedEvent, ...runtime.progress.pickEvents.slice(1)] };
    expect(isValidDraftProgress(runtime.manifest, tampered)).toBe(false);
  });

  it("starts an actual Draft battle with the exact pick-derived decks and verifies export", () => {
    const created = createDraftSession({ seed: 51_002, id: "draft-battle", createdAt: "2026-09-29T00:00:00.000Z" });
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const drafted = finishDraft(created.value);
    expect(drafted.ok).toBe(true);
    if (!drafted.ok || drafted.value.progress.kind !== "draft") return;
    const started = startDraftBattle(drafted.value);
    expect(started.ok).toBe(true);
    if (!started.ok || started.value.progress.kind !== "draft") return;
    expect(started.value.game).not.toBeNull();
    expect(started.value.journal?.schemaVersion).toBe(2);
    expect(started.value.manifest.decks.player.cardIds).toEqual(started.value.progress.selectedDeckBySeat?.player);
    expect(started.value.manifest.decks.cpu.cardIds).toEqual(started.value.progress.selectedDeckBySeat?.cpu);
    const alteredDraftManifest = {
      ...started.value.manifest,
      decks: { ...started.value.manifest.decks, player: { ...started.value.manifest.decks.player, cardIds: buildDeckCardIds(800_123, { masterId: "white" }) } },
    };
    expect(serializeSessionArchive({ ...started.value, manifest: alteredDraftManifest }).ok).toBe(false);
    const exported = serializeSessionArchive(started.value);
    expect(exported.ok).toBe(true);
    if (exported.ok) expect(parseSessionArchiveEnvelope(exported.value).ok).toBe(true);
  });

  it("gives each Sealed seat a deterministic private 60-instance pool and starts with legal selected decks", () => {
    const created = createSealedSession({ seed: 61_001, id: "sealed-session", createdAt: "2026-09-29T00:00:00.000Z" });
    const repeated = createSealedSession({ seed: 61_001, id: "sealed-session-two", createdAt: "2026-09-29T00:00:00.000Z" });
    expect(created.ok).toBe(true);
    expect(repeated.ok).toBe(true);
    if (!created.ok || !repeated.ok || created.value.progress.kind !== "sealed" || repeated.value.progress.kind !== "sealed") return;
    const playerView = getSealedView(created.value, "player");
    const cpuView = getSealedView(created.value, "cpu");
    expect(playerView.ok && playerView.value.pool).toHaveLength(60);
    expect(cpuView.ok && cpuView.value.pool).toHaveLength(60);
    if (!playerView.ok || !cpuView.ok) return;
    const repeatedPlayerView = getSealedView(repeated.value, "player");
    expect(repeatedPlayerView.ok).toBe(true);
    if (!repeatedPlayerView.ok) return;
    expect(playerView.value.pool).toEqual(repeatedPlayerView.value.pool);
    expect(playerView.value.pool.map((card) => card.instanceId)).not.toEqual(cpuView.value.pool.map((card) => card.instanceId));
    expect(getCardDefsByPool("normal").some((card) => !card.id)).toBe(false);

    const partial = updateSealedDeckSelection(created.value, playerView.value.pool.slice(0, 14).map((card) => card.instanceId));
    expect(partial.ok).toBe(true);
    if (!partial.ok) return;
    expect(partial.value.progress.kind === "sealed" && partial.value.progress.status).toBe("deckbuilding");
    expect(partial.value.progress.kind === "sealed" && partial.value.progress.selectedDeckBySeat?.player).toHaveLength(14);
    const partialExport = serializeSessionArchive(partial.value);
    expect(partialExport.ok).toBe(true);
    if (!partialExport.ok) return;
    const partialParsed = parseSessionArchiveEnvelope(partialExport.value);
    expect(partialParsed.ok).toBe(true);
    if (!partialParsed.ok) return;
    const partialVerified = verifySessionArchiveReplayHeads(partialParsed.value);
    expect(partialVerified.ok).toBe(true);
    if (!partialVerified.ok) return;
    const partialRestored = restoreSessionArchiveWithVerifiedHeads(partialParsed.value, partialVerified.value.replayHeads);
    expect(partialRestored.ok).toBe(true);
    if (!partialRestored.ok) return;
    const resumedSealedView = getSealedView(partialRestored.value, "player");
    expect(resumedSealedView.ok && resumedSealedView.value.selectedInstanceIds).toEqual(playerView.value.pool.slice(0, 14).map((card) => card.instanceId));

    const selected = selectSealedDeck(partialRestored.value, playerView.value.pool.slice(0, 30).map((card) => card.instanceId));
    expect(selected.ok).toBe(true);
    if (!selected.ok || selected.value.progress.kind !== "sealed") return;
    expect(selected.value.progress.status).toBe("deckReady");
    expect(isValidSealedProgress(selected.value.manifest, selected.value.progress)).toBe(true);
    expect(selected.value.progress.selectedDeckBySeat?.player).toEqual(playerView.value.pool.slice(0, 30).map((card) => card.instanceId));

    const started = startSealedBattle(selected.value);
    expect(started.ok).toBe(true);
    if (!started.ok || started.value.progress.kind !== "sealed") return;
    expect(started.value.game).not.toBeNull();
    expect(started.value.journal?.schemaVersion).toBe(2);
    expect(started.value.manifest.decks.player.cardIds).toEqual(selected.value.progress.selectedDeckBySeat?.player?.map((id) => playerView.value.pool.find((card) => card.instanceId === id)?.cardId));
    expect(started.value.manifest.decks.cpu.cardIds).toEqual(selected.value.progress.selectedDeckBySeat?.cpu?.map((id) => created.value.progress.kind === "sealed" ? created.value.progress.poolBySeat.cpu.find((card) => card.instanceId === id)?.cardId : undefined));
    const alteredSealedManifest = {
      ...started.value.manifest,
      decks: { ...started.value.manifest.decks, cpu: { ...started.value.manifest.decks.cpu, cardIds: buildDeckCardIds(800_124, { masterId: "white" }) } },
    };
    expect(serializeSessionArchive({ ...started.value, manifest: alteredSealedManifest }).ok).toBe(false);

    const badSelection = selectSealedDeck(created.value, Array(30).fill(playerView.value.pool[0].instanceId));
    expect(badSelection).toMatchObject({ ok: false, error: { code: "INVALID_PROGRESS" } });
    const tampered = { ...selected.value.progress, poolBySeat: { ...selected.value.progress.poolBySeat, player: selected.value.progress.poolBySeat.player.map((card, index) => index === 0 ? { ...card, cardId: "unknown-card" } : card) } };
    expect(isValidSealedProgress(selected.value.manifest, tampered)).toBe(false);
  });

  it("stores and restores actual winner results for Draft embedded journal and Sealed current journal", () => {
    const draftStarted = createDraftSession({ seed: 51_003, id: "draft-result", createdAt: "2026-09-29T00:00:00.000Z" });
    expect(draftStarted.ok).toBe(true);
    if (!draftStarted.ok) return;
    const finishedDraft = finishDraft(draftStarted.value);
    expect(finishedDraft.ok).toBe(true);
    if (!finishedDraft.ok) return;
    const draftBattle = startDraftBattle(finishedDraft.value);
    expect(draftBattle.ok).toBe(true);
    if (!draftBattle.ok) return;
    const terminalDraft = playToDeckout(draftBattle.value);
    expect(terminalDraft.ok).toBe(true);
    if (!terminalDraft.ok) return;
    const draftHead = seekBattleJournal(terminalDraft.value.journal!, terminalDraft.value.journal!.commands.length);
    expect(draftHead.ok).toBe(true);
    if (!draftHead.ok) return;
    const completedDraft = completeDraftBattleWithVerifiedHead(terminalDraft.value, draftHead.value, "2026-09-29T00:05:00.000Z");
    expect(completedDraft.ok).toBe(true);
    if (!completedDraft.ok) return;
    expect(completedDraft.value.journal).toBeNull();
    expect(completedDraft.value.progress.kind === "draft" && ["player", "cpu"].includes(completedDraft.value.progress.result?.result.winner ?? "draw")).toBe(true);
    const draftJson = serializeSessionArchive(completedDraft.value);
    expect(draftJson.ok).toBe(true);
    if (!draftJson.ok) return;
    const draftVerified = verifySessionArchiveReplayHeads(JSON.parse(draftJson.value) as unknown);
    expect(draftVerified.ok).toBe(true);
    if (draftVerified.ok) {
      expect(draftVerified.value.replayHeads.currentHead).toBeNull();
      expect(draftVerified.value.replayHeads.embeddedHeads).toHaveLength(1);
      expect(restoreSessionArchiveWithVerifiedHeads(draftVerified.value.archive, draftVerified.value.replayHeads).ok).toBe(true);
    }
    if (completedDraft.value.progress.kind !== "draft" || !completedDraft.value.progress.result) return;
    const completedDraftJournal = completedDraft.value.progress.result.journal;
    const branchCursor = seekBattleJournalAtCursors(completedDraftJournal, [0]);
    expect(branchCursor.ok).toBe(true);
    if (!branchCursor.ok) return;
    const draftBranchPlan = createBattleBranchPlan({
      sourceManifest: completedDraft.value.manifest,
      sourceJournal: completedDraftJournal,
      sourceProgress: completedDraft.value.progress,
      sourceCursor: 0,
      verifiedSourceSnapshot: branchCursor.value.get(0)!,
      controllerBySeat: { player: "human", cpu: "human" },
    });
    expect(draftBranchPlan.ok).toBe(true);
    if (!draftBranchPlan.ok) return;
    const draftBranch = startSession(draftBranchPlan.value, { createInitialGame: () => structuredClone(branchCursor.value.get(0)!.state) });
    expect(draftBranch.ok).toBe(true);
    if (!draftBranch.ok) return;
    const draftBranchArchive = serializeSessionArchive(getSessionArchiveEnvelope(draftBranch.value));
    expect(draftBranchArchive.ok).toBe(true);
    if (!draftBranchArchive.ok) return;
    const draftBranchVerified = verifySessionArchiveReplayHeads(JSON.parse(draftBranchArchive.value) as unknown);
    expect(draftBranchVerified.ok).toBe(true);
    if (draftBranchVerified.ok) expect(restoreSessionArchiveWithVerifiedHeads(draftBranchVerified.value.archive, draftBranchVerified.value.replayHeads).ok).toBe(true);

    const sealedStarted = createSealedSession({ seed: 61_002, id: "sealed-result", createdAt: "2026-09-29T00:00:00.000Z" });
    expect(sealedStarted.ok).toBe(true);
    if (!sealedStarted.ok) return;
    const sealedView = getSealedView(sealedStarted.value, "player");
    expect(sealedView.ok).toBe(true);
    if (!sealedView.ok) return;
    const sealedDeck = selectSealedDeck(sealedStarted.value, sealedView.value.pool.slice(0, 30).map((card) => card.instanceId));
    expect(sealedDeck.ok).toBe(true);
    if (!sealedDeck.ok) return;
    const sealedBattle = startSealedBattle(sealedDeck.value);
    expect(sealedBattle.ok).toBe(true);
    if (!sealedBattle.ok) return;
    const terminalSealed = playToDeckout(sealedBattle.value);
    expect(terminalSealed.ok).toBe(true);
    if (!terminalSealed.ok) return;
    const sealedHead = seekBattleJournal(terminalSealed.value.journal!, terminalSealed.value.journal!.commands.length);
    expect(sealedHead.ok).toBe(true);
    if (!sealedHead.ok) return;
    const completedSealed = completeSealedBattleWithVerifiedHead(terminalSealed.value, sealedHead.value, "2026-09-29T00:05:00.000Z");
    expect(completedSealed.ok).toBe(true);
    if (!completedSealed.ok) return;
    const sealedJson = serializeSessionArchive(completedSealed.value);
    expect(sealedJson.ok).toBe(true);
    if (!sealedJson.ok) return;
    const sealedVerified = verifySessionArchiveReplayHeads(JSON.parse(sealedJson.value) as unknown);
    expect(sealedVerified.ok).toBe(true);
    if (sealedVerified.ok) expect(restoreSessionArchiveWithVerifiedHeads(sealedVerified.value.archive, sealedVerified.value.replayHeads).ok).toBe(true);
  });
});

function finishDraft(runtime: SessionRuntime) {
  let current = runtime;
  while (current.progress.kind === "draft" && current.progress.status === "drafting") {
    const view = getDraftView(current, "player");
    if (!view.ok || view.value.choices.length === 0) return { ok: false as const };
    const picked = pickDraftCard(current, view.value.choices[0].pickId);
    if (!picked.ok) return picked;
    current = picked.value;
  }
  return { ok: true as const, value: current };
}

function playToDeckout(runtime: SessionRuntime) {
  if (!runtime.game || !runtime.journal) return { ok: false as const };
  let current = runtime;
  for (let step = 0; step < 150 && current.game && !current.game.winner; step += 1) {
    const before = current.game;
    const actor = getEffectiveActor(before);
    let after;
    if (current.manifest.controllerBySeat[actor] === "human") {
      const action = { type: "end_turn" as const };
      after = endTurn(before);
      appendHumanActionReviewEntry(after, before, action);
      const appended = appendBattleCommand(current.journal!, before, after, { controller: "human", action });
      if (!appended.ok) return { ok: false as const };
      current = { ...current, game: after, journal: appended.value };
    } else {
      const decision = { type: "end_turn" as const, reason: "bounded actual deckout result fixture", score: 0 };
      after = applyCpuDecision(before, decision, { reviewActor: actor });
      const extracted = extractAiDecisionCommand(before, after, current.journal!.metadata);
      if (!extracted.ok) return { ok: false as const };
      const appended = appendBattleCommand(current.journal!, before, after, extracted.value);
      if (!appended.ok) return { ok: false as const };
      current = { ...current, game: after, journal: appended.value };
    }
  }
  return current.game?.winner ? { ok: true as const, value: current } : { ok: false as const };
}
