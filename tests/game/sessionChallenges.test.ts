import { describe, expect, it } from "vitest";
import { appendHumanActionReviewEntry } from "../../src/game/aiReviewTrace";
import { applyStoredAiDecision } from "../../src/game/cpuAi";
import { dailySeedForDateJst } from "../../src/sessions/plans";
import { appendBattleCommand, hashBattleState, seekBattleJournal } from "../../src/replay/battleJournal";
import {
  applyPuzzleAction,
  completeDailyChallenge,
  completeGauntletStage,
  createChallengeInitialGame,
  createDailyChallengeSession,
  createExperimentalSession,
  createGauntletSession,
  createPuzzleSession,
  getPuzzleOutcomeFromJournal,
  listPuzzleCatalog,
  matchesGauntletStageInitialState,
  matchesPuzzleInitialState,
  puzzleProgressMatchesJournal,
  resetPuzzle,
} from "../../src/sessions/challenges";
import { canFocusMonster, endTurn } from "../../src/game/rules";
import type { GameState, HumanActionSnapshot } from "../../src/game/types";
import type { SessionRuntime } from "../../src/sessions/types";

describe("versioned session challenges", () => {
  it("captures the Daily JST date and deterministic seed once", () => {
    const runtime = createDailyChallengeSession(new Date("2026-09-28T15:30:00.000Z"), { id: "daily-test" });
    expect(runtime.ok).toBe(true);
    if (!runtime.ok) return;
    expect(runtime.value.manifest.kind).toBe("daily");
    expect(runtime.value.manifest.experimentalContext).toBeUndefined();
    expect(runtime.value.manifest.seed).toBe(dailySeedForDateJst("2026-09-29"));
    expect(runtime.value.progress).toMatchObject({ kind: "daily", status: "active", dateJst: "2026-09-29" });
    expect(runtime.value.journal?.schemaVersion).toBe(2);
    expect(createChallengeInitialGame(runtime.value.manifest, runtime.value.progress)).toEqual(runtime.value.journal?.initialState);
    expect(completeDailyChallenge(runtime.value, "2026-09-29T00:00:00.000Z")).toMatchObject({ ok: false });
    expect(createDailyChallengeSession(new Date(Number.NaN))).toMatchObject({ ok: false, error: { code: "INVALID_PLAN" } });
    expect(createDailyChallengeSession(new Date("2026-09-29T00:00:00.000Z"), { deckPreset: "missing" as never }))
      .toMatchObject({ ok: false, error: { code: "INVALID_PLAN" } });
    const finished = finishWithRealEndTurns(runtime.value);
    const completed = completeDailyChallenge(finished, "2026-09-29T00:00:00.000Z");
    expect(completed.ok).toBe(true);
    if (completed.ok) expect(completed.value.progress).toMatchObject({ kind: "daily", status: "completed", result: { winner: finished.game?.winner } });
  });

  it("runs three different legal one-action puzzles and journals their actual answers", () => {
    const catalog = listPuzzleCatalog();
    expect(catalog.map((entry) => entry.mechanic)).toEqual(["master-action", "monster-attack", "focus"]);
    const master = createPuzzleSession("master-lethal", { seed: 8101 });
    expect(master.ok).toBe(true);
    if (!master.ok || !master.value.game) return;
    expect(master.value.game.winner).toBeUndefined();
    expect(matchesPuzzleInitialState(master.value.manifest, master.value.game)).toBe(true);
    const masterSolved = applyPuzzleAction(master.value, {
      type: "master_action",
      actionId: "master_attack",
      target: { kind: "master", playerId: "cpu" },
    });
    expect(masterSolved.ok).toBe(true);
    if (!masterSolved.ok || !masterSolved.value.journal) return;
    expect(masterSolved.value.progress).toMatchObject({ kind: "puzzle", status: "solved", attempts: 1 });
    expect(getPuzzleOutcomeFromJournal("master-lethal", masterSolved.value.journal)).toEqual({ ok: true, value: "solved" });
    if (masterSolved.value.progress.kind === "puzzle") {
      expect(puzzleProgressMatchesJournal("master-lethal", masterSolved.value.progress, masterSolved.value.journal)).toBe(true);
    }

    const frontline = createPuzzleSession("frontline-break", { seed: 8102 });
    expect(frontline.ok).toBe(true);
    if (!frontline.ok || !frontline.value.game) return;
    const attack = applyPuzzleAction(frontline.value, {
      type: "attack",
      action: {
        attackerSlotKey: "player_front_left",
        commandId: "attack",
        target: { kind: "monster", slotKey: "cpu_front_left" },
      },
    });
    expect(attack.ok).toBe(true);
    if (!attack.ok) return;
    expect(attack.value.progress).toMatchObject({ kind: "puzzle", status: "solved", attempts: 1 });
    expect(attack.value.game?.slots.cpu_front_left.monster).toBeUndefined();

    const focus = createPuzzleSession("focus-the-guard", { seed: 8103 });
    expect(focus.ok).toBe(true);
    if (!focus.ok || !focus.value.game) return;
    const guard = focus.value.game.slots.player_front_left.monster;
    expect(guard?.actionLimit).toBeGreaterThan(1);
    expect(canFocusMonster(focus.value.game, "player_front_left")).toBe(true);
    const focused = applyPuzzleAction(focus.value, { type: "focus", slotKey: "player_front_left" });
    expect(focused.ok).toBe(true);
    if (!focused.ok) return;
    expect(focused.value.progress).toMatchObject({ kind: "puzzle", status: "solved", attempts: 1 });
    expect(focused.value.game?.slots.player_front_left.monster?.focused).toBe(true);
  });

  it("starts an explicit experimental session with per-seat controllers and immutable overlay context", () => {
    const context = {
      format: "isdf-card-hero-experiment-context",
      version: 1,
      rulesProfileId: "experimental-decoy-timing-v1",
      masterOverlayBySeat: { player: "decoy", cpu: "timing" },
    } as const;
    const experimental = createExperimentalSession({
      id: "experiment-test",
      seed: 8451,
      controllerBySeat: { player: "human", cpu: "cpu" },
      experimentalContext: context,
      masters: { player: "white", cpu: "black" },
      deckPresetBySeat: { player: "pressure-normal", cpu: "black-pressure" },
    });
    expect(experimental.ok).toBe(true);
    if (!experimental.ok || !experimental.value.game || !experimental.value.journal) return;
    expect(experimental.value.manifest).toMatchObject({
      kind: "experimental",
      controllerBySeat: { player: "human", cpu: "cpu" },
      experimentalContext: context,
      masters: { player: "white", cpu: "black" },
      decks: {
        player: { sourcePresetId: "pressure-normal" },
        cpu: { sourcePresetId: "black-pressure" },
      },
    });
    expect(experimental.value.journal.schemaVersion).toBe(2);
    expect(experimental.value.journal.metadata?.experimentalContext).toEqual(context);
    expect(createChallengeInitialGame(experimental.value.manifest, experimental.value.progress)).toEqual(experimental.value.journal.initialState);
    expect(createExperimentalSession({
      seed: 8451,
      controllerBySeat: { player: "human", cpu: "cpu" },
      experimentalContext: { ...context, version: 99 } as never,
    })).toMatchObject({ ok: false, error: { code: "INVALID_PLAN" } });
    expect(createExperimentalSession({
      seed: 8451,
      controllerBySeat: { player: "human", cpu: "cpu" },
      experimentalContext: context,
      deckPresetBySeat: { player: "unknown-preset" as never },
    })).toMatchObject({ ok: false, error: { code: "INVALID_PLAN" } });
  });

  it("records wrong legal answers, rejects unknown ids and resets while preserving attempt count", () => {
    expect(createPuzzleSession("unknown-puzzle")).toMatchObject({ ok: false, error: { code: "UNSUPPORTED_SESSION" } });
    expect(createPuzzleSession("master-lethal", { firstPlayer: "cpu" })).toMatchObject({ ok: false, error: { code: "INVALID_PLAN" } });
    const puzzle = createPuzzleSession("master-lethal", { seed: 8201 });
    expect(puzzle.ok).toBe(true);
    if (!puzzle.ok) return;
    const wrong = applyPuzzleAction(puzzle.value, { type: "end_turn" });
    expect(wrong.ok).toBe(true);
    if (!wrong.ok || !wrong.value.journal || wrong.value.progress.kind !== "puzzle") return;
    expect(wrong.value.progress).toMatchObject({ status: "failed", attempts: 1 });
    expect(getPuzzleOutcomeFromJournal("master-lethal", wrong.value.journal)).toEqual({ ok: true, value: "failed" });
    const reset = resetPuzzle(wrong.value);
    expect(reset.ok).toBe(true);
    if (!reset.ok || !reset.value.game || !reset.value.journal || reset.value.progress.kind !== "puzzle") return;
    expect(reset.value.progress).toMatchObject({ status: "active", attempts: 1 });
    expect(reset.value.journal.commands).toHaveLength(0);
    expect(matchesPuzzleInitialState(reset.value.manifest, reset.value.game)).toBe(true);
  });

  it("advances only after three actual replay-verified Gauntlet battles", () => {
    const started = createGauntletSession({ seed: 8300, id: "gauntlet-test" });
    expect(started.ok).toBe(true);
    if (!started.ok) return;
    let runtime = started.value;
    expect(runtime.progress).toMatchObject({ kind: "gauntlet", status: "active", stageIndex: 0, completedBattles: [] });
    expect(createChallengeInitialGame(runtime.manifest, runtime.progress)).toEqual(runtime.journal?.initialState);
    expect(completeGauntletStage(runtime)).toMatchObject({ ok: false });

    for (let stageIndex = 0; stageIndex < 3; stageIndex += 1) {
      if (runtime.progress.kind !== "gauntlet") return;
      expect(runtime.progress.stageIndex).toBe(stageIndex);
      const stageInitial = runtime.journal?.initialState;
      expect(stageInitial).toBeDefined();
      if (stageInitial) expect(matchesGauntletStageInitialState(runtime.manifest, stageIndex, stageInitial)).toBe(true);
      runtime = finishGauntletWithRealRules(runtime);
      const completed = completeGauntletStage(runtime, "2026-09-29T00:00:00.000Z");
      expect(completed.ok).toBe(true);
      if (!completed.ok) return;
      runtime = completed.value;
    }

    expect(runtime.progress).toMatchObject({ kind: "gauntlet", status: "completed", stageIndex: 3 });
    if (runtime.progress.kind !== "gauntlet") return;
    expect(runtime.progress.completedBattles).toHaveLength(3);
    expect(runtime.game).toBeNull();
    expect(runtime.journal).toBeNull();
    for (const battle of runtime.progress.completedBattles) {
      const verified = seekBattleJournal(battle.journal, battle.journal.commands.length);
      expect(verified.ok).toBe(true);
      if (verified.ok) {
        expect(verified.value.state.winner).toBe(battle.result.winner);
        expect(hashBattleState(verified.value.state)).toBe(battle.result.headHash);
      }
    }
  });
});

function finishGauntletWithRealRules(runtime: SessionRuntime): SessionRuntime {
  if (runtime.progress.kind !== "gauntlet" || !runtime.game || !runtime.journal) throw new Error("missing active Gauntlet state");
  let game: GameState = runtime.game;
  let journal = runtime.journal;
  for (let step = 0; game.winner === undefined && step < 150; step += 1) {
    if (game.currentPlayer === "cpu") {
      const before = game;
      const decision = { type: "end_turn" as const, reason: "fixture passes its turn", score: 0 };
      const after = applyStoredAiDecision(before, decision, { reviewActor: "cpu" });
      const appended = appendBattleCommand(journal, before, after, { controller: "ai", decision });
      if (!appended.ok) throw new Error(appended.error.message);
      game = after;
      journal = appended.value;
    } else {
      const before = game;
      const action: HumanActionSnapshot = { type: "end_turn" };
      const after = endTurn(before);
      appendHumanActionReviewEntry(after, before, action);
      const appended = appendBattleCommand(journal, before, after, { controller: "human", action });
      if (!appended.ok) throw new Error(appended.error.message);
      game = after;
      journal = appended.value;
    }
  }
  if (game.winner === undefined) throw new Error("Gauntlet deckout fixture exceeded 150 real end-turn commands");
  return { ...runtime, game, journal };
}

function finishWithRealEndTurns(runtime: SessionRuntime): SessionRuntime {
  if (!runtime.game || !runtime.journal) throw new Error("missing active session state");
  let game: GameState = runtime.game;
  let journal = runtime.journal;
  for (let step = 0; game.winner === undefined && step < 150; step += 1) {
    const before = game;
    let after: GameState;
    let command: Parameters<typeof appendBattleCommand>[3];
    if (game.currentPlayer === "cpu") {
      const decision = { type: "end_turn" as const, reason: "fixture passes its turn", score: 0 };
      after = applyStoredAiDecision(before, decision, { reviewActor: "cpu" });
      command = { controller: "ai", decision };
    } else {
      const action: HumanActionSnapshot = { type: "end_turn" };
      after = endTurn(before);
      appendHumanActionReviewEntry(after, before, action);
      command = { controller: "human", action };
    }
    const appended = appendBattleCommand(journal, before, after, command);
    if (!appended.ok) throw new Error(appended.error.message);
    game = after;
    journal = appended.value;
  }
  if (game.winner === undefined) throw new Error("Session deckout fixture exceeded 150 real end-turn commands");
  return { ...runtime, game, journal };
}
