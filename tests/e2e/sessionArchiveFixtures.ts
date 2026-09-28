import { appendControlledHumanActionReviewEntry } from "../../src/game/aiReviewTrace";
import { applyCpuDecision } from "../../src/game/cpuAi";
import { endTurn } from "../../src/game/rules";
import { getEffectiveActor } from "../../src/game/seatControl";
import { appendBattleCommand, extractAiDecisionCommand, seekBattleJournal } from "../../src/replay/battleJournal";
import { completeGauntletStage, createGauntletSession } from "../../src/sessions/challenges";
import { completeDraftBattleWithVerifiedHead, createDraftSession, getDraftView, pickDraftCard, startDraftBattle } from "../../src/sessions/limited";
import { serializeSessionArchive } from "../../src/sessions/archive";
import type { SessionRuntime } from "../../src/sessions/types";

const FIXTURE_TIME = "2026-09-29T00:00:00.000Z";

export function buildCompletedDraftArchiveForBrowser(seed: number): string {
  const created = createDraftSession({ seed, id: `e2e-draft-${seed}`, createdAt: FIXTURE_TIME });
  if (!created.ok) throw new Error(created.error.message);
  let prepared = created.value;
  for (let pick = 0; prepared.progress.kind === "draft" && prepared.progress.status === "drafting" && pick < 30; pick += 1) {
    const view = getDraftView(prepared, "player");
    if (!view.ok || !view.value.choices.length) throw new Error("Draft fixture has no legal player pick.");
    const next = pickDraftCard(prepared, view.value.choices[0].pickId);
    if (!next.ok) throw new Error(next.error.message);
    prepared = next.value;
  }
  const started = startDraftBattle(prepared);
  if (!started.ok) throw new Error(started.error.message);
  const terminal = finishAtNaturalDeckout(started.value);
  const head = seekBattleJournal(terminal.journal!, terminal.journal!.commands.length);
  if (!head.ok) throw new Error(head.error.message);
  const completed = completeDraftBattleWithVerifiedHead(terminal, head.value, FIXTURE_TIME);
  if (!completed.ok) throw new Error(completed.error.message);
  if (completed.value.game !== null || completed.value.journal !== null) throw new Error("Completed Draft fixture must store its result as an embedded battle.");
  const archive = serializeSessionArchive(completed.value);
  if (!archive.ok) throw new Error(archive.error.message);
  return archive.value;
}

export function buildCompletedGauntletArchiveForBrowser(seed: number): string {
  const created = createGauntletSession({ seed, id: `e2e-gauntlet-${seed}`, createdAt: FIXTURE_TIME });
  if (!created.ok) throw new Error(created.error.message);
  let runtime = created.value;
  for (let stage = 0; stage < 3; stage += 1) {
    runtime = finishAtNaturalDeckout(runtime);
    const completed = completeGauntletStage(runtime, `2026-09-29T00:0${stage}:00.000Z`);
    if (!completed.ok) throw new Error(completed.error.message);
    runtime = completed.value;
  }
  if (runtime.game !== null || runtime.journal !== null || runtime.progress.kind !== "gauntlet" || runtime.progress.status !== "completed") {
    throw new Error("Completed Gauntlet fixture must contain three embedded results and no current battle.");
  }
  const archive = serializeSessionArchive(runtime);
  if (!archive.ok) throw new Error(archive.error.message);
  return archive.value;
}

function finishAtNaturalDeckout(runtime: SessionRuntime): SessionRuntime {
  if (!runtime.game || !runtime.journal) throw new Error("Missing active battle state in session fixture.");
  let current = runtime;
  for (let step = 0; step < 180 && current.game && current.game.winner === undefined; step += 1) {
    const before = current.game;
    const actor = getEffectiveActor(before);
    let after;
    if (current.manifest.controllerBySeat[actor] === "human") {
      const action = { type: "end_turn" as const };
      after = endTurn(before);
      appendControlledHumanActionReviewEntry(after, before, action, current.manifest.controllerBySeat);
      const appended = appendBattleCommand(current.journal!, before, after, { controller: "human", action });
      if (!appended.ok) throw new Error(appended.error.message);
      current = { ...current, game: after, journal: appended.value };
    } else {
      const choice = { type: "end_turn" as const, reason: "E2E fixture uses a concrete legal end-turn choice", score: 0 };
      after = applyCpuDecision(before, choice, { reviewActor: actor });
      const extracted = extractAiDecisionCommand(before, after, current.journal!.metadata);
      if (!extracted.ok) throw new Error(extracted.error.message);
      const appended = appendBattleCommand(current.journal!, before, after, extracted.value);
      if (!appended.ok) throw new Error(appended.error.message);
      current = { ...current, game: after, journal: appended.value };
    }
  }
  if (!current.game?.winner) throw new Error("Fixture did not reach a real deckout winner within 180 legal turns.");
  return current;
}
