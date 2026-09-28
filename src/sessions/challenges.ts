import { getMonsterDef } from "../game/cards";
import { CPU_AI_PROFILES, type CpuAiProfiles } from "../game/cpuAiTypes";
import { isExperimentContextV1, type ExperimentContextV1 } from "../game/experimentalContext";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, type DeckPresetId } from "../game/deckPresets";
import { createInitialGame, attackWithCommand, discardHandCard, endTurn, endTurnWithHandLimitDiscards, focusMonster, moveMonster, playMagic, resolveLevelUp, summonMonster, useMasterAction, useMasterHpDraw } from "../game/rules";
import { appendHumanActionReviewEntry } from "../game/aiReviewTrace";
import { getEffectiveActor } from "../game/seatControl";
import { appendBattleCommand, createBattleJournal, hashBattleState, seekBattleJournal, seekBattleJournalAtCursors } from "../replay/battleJournal";
import { captureJstDate, dailySeedForDateJst, startSession } from "./plans";
import type { PlayerId, GameState, HumanActionSnapshot, MonsterState } from "../game/types";
import type { GauntletSessionProgress, SessionBattleResult, SessionControllers, SessionDeckSnapshot, SessionManifest, SessionPlan, SessionResult, SessionRuntime, SessionProgress } from "./types";
import type { ReplaySnapshot } from "../replay/types";

const DAILY_DEFINITION = { id: "daily-standard-v1", version: 1 } as const;
export const GAUNTLET_DEFINITION = { id: "core-three-stage-v1", version: 1 } as const;
const DEFAULT_DECK: DeckPresetId = "balanced-normal";
const PUZZLE_VERSION = 1;

export interface ChallengeStartOptions {
  id?: string;
  createdAt?: string;
  firstPlayer?: PlayerId;
  profiles?: Partial<CpuAiProfiles>;
  masters?: Partial<Record<PlayerId, "white" | "black">>;
  deckPreset?: DeckPresetId;
}

export interface ExperimentalSessionStartOptions {
  seed: number;
  id?: string;
  createdAt?: string;
  firstPlayer?: PlayerId;
  controllerBySeat: SessionControllers;
  experimentalContext: ExperimentContextV1;
  profiles?: Partial<CpuAiProfiles>;
  masters?: Partial<Record<PlayerId, "white" | "black">>;
  deckPresetBySeat?: Partial<Record<PlayerId, DeckPresetId>>;
}

export interface PuzzleCatalogEntry {
  id: string;
  version: number;
  title: string;
  prompt: string;
  mechanic: "master-action" | "monster-attack" | "focus";
}

const PUZZLE_CATALOG: readonly PuzzleCatalogEntry[] = [
  { id: "master-lethal", version: PUZZLE_VERSION, title: "一撃で決める", prompt: "1手で相手マスターを倒してください。", mechanic: "master-action" },
  { id: "frontline-break", version: PUZZLE_VERSION, title: "前衛を突破", prompt: "1手で正面の前衛を通常攻撃で倒してください。", mechanic: "monster-attack" },
  { id: "focus-the-guard", version: PUZZLE_VERSION, title: "狙いを定める", prompt: "1手で味方ユニットを集中状態にしてください。", mechanic: "focus" },
];

export function listPuzzleCatalog(): readonly PuzzleCatalogEntry[] {
  return PUZZLE_CATALOG.map((entry) => ({ ...entry }));
}

export function createDailyChallengePlan(now: Date = new Date(), options: ChallengeStartOptions = {}): SessionPlan {
  const dateJst = captureJstDate(now);
  const seed = dailySeedForDateJst(dateJst);
  return makePlanBase(options, seed, "daily", {
    dateJst,
    challengeDefinition: DAILY_DEFINITION,
  });
}

export function createDailyChallengeSession(now: Date = new Date(), options: ChallengeStartOptions = {}): SessionResult<SessionRuntime> {
  try {
    const plan = createDailyChallengePlan(now, options);
    return startSession(plan, { createInitialGame: () => createForPlan(plan) });
  } catch (cause) {
    return invalidPlan(`Daily sessionを初期化できません: ${cause instanceof Error ? cause.message : String(cause)}`);
  }
}

/** Starts an explicitly versioned experimental rules session; normal battle constructors remain unchanged. */
export function createExperimentalSession(options: ExperimentalSessionStartOptions): SessionResult<SessionRuntime> {
  try {
    const seed = validSeed(options.seed);
    if (seed === undefined) return invalidPlan("Experimental seedが不正です。");
    if (!isExperimentContextV1(options.experimentalContext)) return invalidPlan("Experimental contextが未対応または不正です。");
    const decks = {} as Record<PlayerId, SessionDeckSnapshot>;
    for (const seat of ["player", "cpu"] as const) {
      const presetId = options.deckPresetBySeat?.[seat] ?? DEFAULT_DECK;
      const cardIds = buildDeckPresetCardIds(presetId);
      decks[seat] = {
        cardIds,
        allowSpecial: deckPresetAllowsSpecial(presetId),
        sourcePresetId: presetId,
      };
    }
    const plan: SessionPlan = {
      kind: "experimental",
      id: options.id,
      createdAt: options.createdAt,
      seed,
      firstPlayer: options.firstPlayer ?? "player",
      controllerBySeat: options.controllerBySeat,
      profiles: {
        player: options.profiles?.player ?? CPU_AI_PROFILES[0],
        cpu: options.profiles?.cpu ?? CPU_AI_PROFILES[0],
      },
      masters: {
        player: options.masters?.player ?? "white",
        cpu: options.masters?.cpu ?? "white",
      },
      decks,
      experimentalContext: options.experimentalContext,
    };
    return startSession(plan, { createInitialGame: () => createConfiguredGame(plan.seed, plan.firstPlayer, plan.masters, plan.decks) });
  } catch (cause) {
    return invalidPlan(`Experimental sessionを初期化できません: ${cause instanceof Error ? cause.message : String(cause)}`);
  }
}

export function createPuzzleSession(puzzleId: string, options: ChallengeStartOptions & { seed?: number } = {}): SessionResult<SessionRuntime> {
  try {
    const definition = getPuzzleEntry(puzzleId);
    if (!definition) return unsupported(`未対応のPuzzle definitionです: ${puzzleId}`);
    if (options.firstPlayer !== undefined && options.firstPlayer !== "player") return invalidPlan("Puzzleはplayer先攻固定です。");
    const seed = validSeed(options.seed ?? 7000);
    if (seed === undefined) return invalidPlan("Puzzle seedが不正です。");
    const basePlan = makePlanBase(options, seed, "puzzle", { puzzleId, puzzleVersion: definition.version });
    const plan = definition.id === "focus-the-guard" ? ensureFocusTrainingDeck(basePlan) : basePlan;
    return startSession(plan, { createInitialGame: () => createPuzzleInitialState(plan) });
  } catch (cause) {
    return invalidPlan(`Puzzle sessionを初期化できません: ${cause instanceof Error ? cause.message : String(cause)}`);
  }
}

export function applyPuzzleAction(runtime: SessionRuntime, action: HumanActionSnapshot): SessionResult<SessionRuntime> {
  const identity = getPuzzleIdentity(runtime);
  if (!identity.ok) return identity;
  if (!runtime.journal || !runtime.game || runtime.progress.kind !== "puzzle" || !["active", "ready"].includes(runtime.progress.status)) {
    return invalid("Puzzleは入力可能なactive stateではありません。");
  }
  if (getEffectiveActor(runtime.game) !== "player" || runtime.manifest.controllerBySeat.player !== "human") {
    return invalid("Puzzleの操作seatがhuman playerではありません。");
  }
  let next: GameState;
  try {
    next = applyHumanAction(runtime.game, action);
  } catch (cause) {
    return invalid(`Puzzle actionが合法でないため適用しません: ${cause instanceof Error ? cause.message : String(cause)}`);
  }
  appendHumanActionReviewEntry(next, runtime.game, action);
  const appended = appendBattleCommand(runtime.journal, runtime.game, next, { controller: "human", action });
  if (!appended.ok) return invalid(`Puzzle command journalを更新できません: ${appended.error.message}`);
  const solved = matchesPuzzleAnswer(identity.value.definition.id, runtime.game, next, action);
  const progress = {
    ...runtime.progress,
    status: solved ? "solved" as const : "failed" as const,
    attempts: runtime.progress.attempts + 1,
  };
  return { ok: true, value: { ...runtime, game: next, journal: appended.value, progress } };
}

export function resetPuzzle(runtime: SessionRuntime): SessionResult<SessionRuntime> {
  const identity = getPuzzleIdentity(runtime);
  if (!identity.ok) return identity;
  const plan: SessionPlan = {
    kind: "puzzle",
    puzzleId: identity.value.definition.id,
    puzzleVersion: identity.value.definition.version,
    id: runtime.manifest.id,
    createdAt: runtime.manifest.createdAt,
    seed: runtime.manifest.seed,
    firstPlayer: "player",
    profiles: runtime.manifest.profiles,
    masters: runtime.manifest.masters,
    decks: runtime.manifest.decks,
    controllerBySeat: runtime.manifest.controllerBySeat,
    opponentKnowledgePolicy: runtime.manifest.opponentKnowledgePolicy,
  };
  const reset = startSession(plan, { createInitialGame: () => createPuzzleInitialState(plan) });
  if (!reset.ok) return reset;
  if (reset.value.progress.kind !== "puzzle") return invalid("Puzzle reset progressが不正です。");
  return { ok: true, value: { ...reset.value, progress: { ...reset.value.progress, attempts: runtime.progress.kind === "puzzle" ? runtime.progress.attempts : 0 } } };
}

export function createGauntletSession(options: ChallengeStartOptions & { seed?: number } = {}): SessionResult<SessionRuntime> {
  try {
    const seed = validSeed(options.seed ?? 8000, 999_999_997);
    if (seed === undefined) return invalidPlan("Gauntlet seedはstage用seedを確保できる整数で指定してください。");
    const plan = makePlanBase(options, seed, "gauntlet", {
      gauntletId: GAUNTLET_DEFINITION.id,
      gauntletVersion: GAUNTLET_DEFINITION.version,
    });
    return startSession(plan, { createInitialGame: () => createGauntletInitialState(plan, 0) });
  } catch (cause) {
    return invalidPlan(`Gauntlet sessionを初期化できません: ${cause instanceof Error ? cause.message : String(cause)}`);
  }
}

/** Completes exactly the current verified stage, then creates the next real rules battle. */
export function completeGauntletStage(runtime: SessionRuntime, completedAt: string = new Date().toISOString()): SessionResult<SessionRuntime> {
  return completeGauntletStageInternal(runtime, completedAt);
}

/** Trusted Worker snapshot variant; cursor and command head hashes are still checked locally. */
export function completeGauntletStageWithVerifiedHead(
  runtime: SessionRuntime,
  verifiedHead: ReplaySnapshot,
  completedAt: string = new Date().toISOString(),
): SessionResult<SessionRuntime> {
  return completeGauntletStageInternal(runtime, completedAt, verifiedHead);
}

/** Records a Daily battle only when its actual terminal state matches the complete journal head. */
export function completeDailyChallenge(
  runtime: SessionRuntime,
  completedAt: string = new Date().toISOString(),
  verifiedHead?: ReplaySnapshot,
): SessionResult<SessionRuntime> {
  if (runtime.manifest.kind !== "daily" || runtime.progress.kind !== "daily" ||
      runtime.progress.status !== "active" || !runtime.game || !runtime.journal) {
    return invalid("Daily runtimeに完了可能な対局がありません。");
  }
  if (runtime.manifest.challengeDefinition?.id !== DAILY_DEFINITION.id ||
      runtime.manifest.challengeDefinition.version !== DAILY_DEFINITION.version ||
      !runtime.progress.dateJst || dailySeedForDateJst(runtime.progress.dateJst) !== runtime.manifest.seed ||
      !matchesDailyInitialState(runtime.manifest, runtime.progress.dateJst, runtime.journal.initialState)) {
    return invalid("Daily definition/date/seedが不一致です。");
  }
  if (!isIsoTimestamp(completedAt) || runtime.journal.completeness.status !== "complete") {
    return invalid("Daily completedAtまたはjournalが完了状態ではありません。");
  }
  const expectedHeadHash = runtime.journal.commands.at(-1)?.afterHash ?? runtime.journal.initialHash;
  let state: GameState;
  if (verifiedHead) {
    if (verifiedHead.cursor !== runtime.journal.commands.length || verifiedHead.totalCommands !== runtime.journal.commands.length ||
        hashBattleState(verifiedHead.state) !== expectedHeadHash) {
      return invalid("Worker検証済みDaily headがjournal末尾cursor/hashと一致しません。");
    }
    state = verifiedHead.state;
  } else {
    const verified = seekBattleJournal(runtime.journal, runtime.journal.commands.length);
    if (!verified.ok) return invalid(`Daily journalを検証できません: ${verified.error.message}`);
    state = verified.value.state;
  }
  if (state.winner === undefined || state.winner !== runtime.game.winner || hashBattleState(state) !== hashBattleState(runtime.game)) {
    return invalid("Daily battleはjournalと一致する実際の勝者で終局していません。");
  }
  const result: SessionBattleResult = {
    winner: state.winner,
    turns: state.turnNumber,
    completedAt,
    headHash: hashBattleState(state),
  };
  return { ok: true, value: { ...runtime, progress: { ...runtime.progress, status: "completed", result } } };
}

function completeGauntletStageInternal(
  runtime: SessionRuntime,
  completedAt: string,
  verifiedHead?: ReplaySnapshot,
): SessionResult<SessionRuntime> {
  if (runtime.manifest.kind !== "gauntlet" || runtime.progress.kind !== "gauntlet" || !runtime.game || !runtime.journal) {
    return invalid("Gauntlet runtimeに現在の対局がありません。");
  }
  const progress = runtime.progress;
  if (progress.status !== "active" || progress.stageIndex !== progress.completedBattles.length || progress.stageIndex < 0 || progress.stageIndex > 2) {
    return invalid("GauntletのstageIndex/progressが不正です。");
  }
  if (!isIsoTimestamp(completedAt)) return invalid("completedAtが実在するISO日時ではありません。");
  if (runtime.journal.completeness.status !== "complete" ||
      !matchesGauntletStageInitialState(runtime.manifest, progress.stageIndex, runtime.journal.initialState)) {
    return invalid("Gauntlet stage journalの初期状態がimmutable stage definitionと一致しません。");
  }
  const expectedHeadHash = runtime.journal.commands.at(-1)?.afterHash ?? runtime.journal.initialHash;
  let state: GameState;
  if (verifiedHead) {
    if (verifiedHead.cursor !== runtime.journal.commands.length || verifiedHead.totalCommands !== runtime.journal.commands.length ||
        hashBattleState(verifiedHead.state) !== expectedHeadHash) {
      return invalid("Worker検証済みGauntlet headがjournal末尾cursor/hashと一致しません。");
    }
    state = verifiedHead.state;
  } else {
    const verified = seekBattleJournal(runtime.journal, runtime.journal.commands.length);
    if (!verified.ok) return invalid(`Gauntlet stage journalを検証できません: ${verified.error.message}`);
    state = verified.value.state;
  }
  if (state.winner === undefined || state.winner !== runtime.game.winner || hashBattleState(state) !== hashBattleState(runtime.game)) {
    return invalid("Gauntlet stageはjournalと一致する実際の勝者で終局していません。");
  }
  const result: SessionBattleResult = {
    winner: state.winner,
    turns: state.turnNumber,
    completedAt,
    headHash: hashBattleState(state),
  };
  const completedBattles = [...progress.completedBattles, { journal: runtime.journal, result }];
  const nextStage = completedBattles.length;
  const nextProgress: GauntletSessionProgress = nextStage === 3
    ? { ...progress, status: "completed", stageIndex: 3, completedBattles }
    : { ...progress, status: "active", stageIndex: nextStage, completedBattles };
  if (nextStage === 3) return { ok: true, value: { ...runtime, progress: nextProgress, journal: null, game: null } };

  const nextGame = createGauntletInitialState(runtime.manifest, nextStage);
  const journal = createBattleJournal(nextGame, {
    controllerBySeat: runtime.manifest.controllerBySeat,
    opponentKnowledgePolicy: runtime.manifest.opponentKnowledgePolicy,
  });
  if (!journal.ok) return invalid(`次のGauntlet journalを作成できません: ${journal.error.message}`);
  return { ok: true, value: { ...runtime, progress: nextProgress, journal: journal.value, game: nextGame } };
}

export function createGauntletStageInitialGame(manifest: SessionManifest, stageIndex: number): GameState | null {
  if (manifest.kind !== "gauntlet" || manifest.challengeDefinition?.id !== GAUNTLET_DEFINITION.id ||
      manifest.challengeDefinition.version !== GAUNTLET_DEFINITION.version || !Number.isSafeInteger(stageIndex) || stageIndex < 0 || stageIndex > 2 ||
      manifest.seed + stageIndex > 999_999_999) return null;
  return createGauntletInitialState(manifest, stageIndex);
}

export function matchesPuzzleInitialState(manifest: SessionManifest, state: GameState): boolean {
  if (manifest.kind !== "puzzle" || !manifest.challengeDefinition || manifest.firstPlayer !== "player") return false;
  try {
    const expected = createPuzzleInitialState(planFromManifest(manifest));
    return expected.winner === undefined && state.winner === undefined && hashBattleState(expected) === hashBattleState(state);
  } catch {
    return false;
  }
}

export function matchesDailyInitialState(manifest: SessionManifest, dateJst: string, state: GameState): boolean {
  if (manifest.kind !== "daily" || manifest.challengeDefinition?.id !== DAILY_DEFINITION.id ||
      manifest.challengeDefinition.version !== DAILY_DEFINITION.version || dailySeedForDateJst(dateJst) !== manifest.seed) return false;
  try {
    const expected = createConfiguredGame(manifest.seed, manifest.firstPlayer, manifest.masters, manifest.decks);
    return expected.winner === undefined && state.winner === undefined && hashBattleState(expected) === hashBattleState(state);
  } catch {
    return false;
  }
}

export function matchesGauntletStageInitialState(manifest: SessionManifest, stageIndex: number, state: GameState): boolean {
  const expected = createGauntletStageInitialGame(manifest, stageIndex);
  return !!expected && expected.winner === undefined && state.winner === undefined && hashBattleState(expected) === hashBattleState(state);
}

/** Derive puzzle outcome from verified concrete commands rather than trusting serialized progress. */
export function getPuzzleOutcomeFromJournal(puzzleId: string, journal: import("../replay/types").BattleJournal): SessionResult<"active" | "solved" | "failed"> {
  const definition = getPuzzleEntry(puzzleId);
  if (!definition || journal.initialState.winner !== undefined || journal.completeness.status !== "complete" || journal.commands.length > 1) {
    return invalid("Puzzle journal definition/initial state/command count is unsupported.");
  }
  if (journal.commands.length === 0) return { ok: true, value: "active" };
  const command = journal.commands[0];
  if (command.playerId !== "player" || command.controller !== "human") return invalid("Puzzle answer command must be a player human action.");
  const replay = seekBattleJournalAtCursors(journal, [0, 1]);
  if (!replay.ok) return invalid(`Puzzle journal verification failed: ${replay.error.message}`);
  const before = replay.value.get(0)?.state;
  const after = replay.value.get(1)?.state;
  if (!before || !after) return invalid("Puzzle journal answer snapshots are missing.");
  const solved = matchesPuzzleAnswer(definition.id, before, after, command.action);
  return { ok: true, value: solved ? "solved" : "failed" };
}

export function puzzleProgressMatchesJournal(puzzleId: string, progress: Extract<SessionProgress, { kind: "puzzle" }>, journal: import("../replay/types").BattleJournal): boolean {
  const outcome = getPuzzleOutcomeFromJournal(puzzleId, journal);
  return outcome.ok && (progress.status === outcome.value || (progress.status === "ready" && outcome.value === "active"));
}

/** Verify puzzle status from snapshots an archive Worker has already fully replay-verified. */
export function puzzleProgressMatchesVerifiedHead(
  puzzleId: string,
  progress: Extract<SessionProgress, { kind: "puzzle" }>,
  journal: import("../replay/types").BattleJournal,
  verifiedHeadState: GameState,
): boolean {
  const definition = getPuzzleEntry(puzzleId);
  if (!definition || journal.completeness.status !== "complete" || journal.initialState.winner !== undefined ||
      verifiedHeadState.winner !== undefined && journal.commands.length === 0) return false;
  const expectedHeadHash = journal.commands.at(-1)?.afterHash ?? journal.initialHash;
  if (hashBattleState(verifiedHeadState) !== expectedHeadHash) return false;
  if (journal.commands.length === 0) {
    return (progress.status === "active" || progress.status === "ready") &&
      hashBattleState(journal.initialState) === journal.initialHash;
  }
  if (journal.commands.length !== 1) return false;
  const command = journal.commands[0];
  if (command.playerId !== "player" || command.controller !== "human") return false;
  const solved = matchesPuzzleAnswer(definition.id, journal.initialState, verifiedHeadState, command.action);
  return progress.status === (solved ? "solved" : "failed");
}

/** Archive restore hook: reconstructs the current challenge stage only from immutable manifest data. */
export function createChallengeInitialGame(manifest: SessionManifest, progress: SessionProgress): GameState | null {
  if (manifest.kind !== progress.kind) return null;
  try {
    if (manifest.kind === "daily" && progress.kind === "daily" && progress.dateJst) {
      const dailyState = createConfiguredGame(manifest.seed, manifest.firstPlayer, manifest.masters, manifest.decks);
      if (matchesDailyInitialState(manifest, progress.dateJst, dailyState)) return dailyState;
    }
    if (manifest.kind === "experimental" && progress.kind === "experimental" && isExperimentContextV1(manifest.experimentalContext)) {
      return createConfiguredGame(manifest.seed, manifest.firstPlayer, manifest.masters, manifest.decks);
    }
    if (manifest.kind === "puzzle" && progress.kind === "puzzle") {
      if (manifest.challengeDefinition?.id !== progress.puzzleId || manifest.challengeDefinition.version !== progress.puzzleVersion) return null;
      const plan = planFromManifest(manifest);
      return createPuzzleInitialState(plan);
    }
    if (manifest.kind === "gauntlet" && progress.kind === "gauntlet" && manifest.challengeDefinition?.id === GAUNTLET_DEFINITION.id &&
        manifest.challengeDefinition.version === GAUNTLET_DEFINITION.version && progress.stageIndex >= 0 && progress.stageIndex <= 2 &&
        progress.stageIndex === progress.completedBattles.length) {
      return createGauntletInitialState(manifest, progress.stageIndex);
    }
    return null;
  } catch {
    return null;
  }
}

function createPuzzleInitialState(plan: SessionPlan): GameState {
  if (plan.kind !== "puzzle") throw new Error("Puzzle initializer requires puzzle plan");
  const definition = getPuzzleEntry(plan.puzzleId);
  if (!definition || definition.version !== plan.puzzleVersion) throw new Error("Unsupported puzzle definition/version");
  const state = createConfiguredGame(plan.seed, plan.firstPlayer, plan.masters, plan.decks);
  if (definition.id === "master-lethal") {
    state.players.player.stones = 3;
    state.players.player.masterPowerBonus = 12;
    state.players.cpu.masterHp = 1;
  } else if (definition.id === "frontline-break") {
    const attackerCard = takeAvailableFrontMonster(state, "player", plan.decks.player.cardIds);
    const defenderCard = takeAvailableFrontMonster(state, "cpu", plan.decks.cpu.cardIds);
    const attacker = makeMonster(attackerCard.cardId, "player", attackerCard.instanceId);
    const defender = makeMonster(defenderCard.cardId, "cpu", defenderCard.instanceId, { hp: 1 });
    state.slots.player_front_left.monster = attacker;
    state.slots.cpu_front_left.monster = defender;
    state.players.player.stones = 3;
  } else if (definition.id === "focus-the-guard") {
    const card = takeAvailableFrontMonster(state, "player", plan.decks.player.cardIds, { requireMultipleActions: true });
    state.slots.player_front_left.monster = makeMonster(card.cardId, "player", card.instanceId);
  }
  if (state.winner !== undefined) throw new Error("Puzzle initializer must not start with a winner");
  return state;
}

function ensureFocusTrainingDeck(plan: SessionPlan): SessionPlan {
  const deck = plan.decks.player;
  const hasMultiActionFront = deck.cardIds.some((cardId) => {
    try {
      const definition = getMonsterDef(cardId);
      return definition.role === "front" && (definition.actionLimit ?? 1) > 1;
    } catch {
      return false;
    }
  });
  if (hasMultiActionFront) return plan;

  const trainingCardId = "polyspinner";
  const trainingDefinition = getMonsterDef(trainingCardId);
  if (trainingDefinition.role !== "front" || (trainingDefinition.actionLimit ?? 1) <= 1) {
    throw new Error("Focus Puzzle用の通常・複数行動前衛を用意できません。");
  }
  const counts = new Map<string, number>();
  for (const cardId of deck.cardIds) counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
  if ((counts.get(trainingCardId) ?? 0) >= 3) throw new Error("Focus Puzzle deckの同名カード上限に達しています。");
  let replaceIndex = -1;
  for (let index = deck.cardIds.length - 1; index >= 0; index -= 1) {
    if ((counts.get(deck.cardIds[index]) ?? 0) > 1) {
      replaceIndex = index;
      break;
    }
  }
  if (replaceIndex < 0) throw new Error("Focus Puzzle deckに合法な置換枠がありません。");
  const cardIds = [...deck.cardIds];
  cardIds[replaceIndex] = trainingCardId;
  return {
    ...plan,
    decks: {
      ...plan.decks,
      player: { ...deck, cardIds },
    },
  } as SessionPlan;
}

function createGauntletInitialState(planOrManifest: SessionPlan | SessionManifest, stageIndex: number): GameState {
  const seed = planOrManifest.seed + stageIndex;
  const firstPlayer = stageIndex % 2 === 0 ? planOrManifest.firstPlayer : opponent(planOrManifest.firstPlayer);
  return createConfiguredGame(seed, firstPlayer, planOrManifest.masters, planOrManifest.decks);
}

function createForPlan(plan: SessionPlan): GameState {
  if (plan.kind === "daily") return createConfiguredGame(plan.seed, plan.firstPlayer, plan.masters, plan.decks);
  if (plan.kind === "gauntlet") return createGauntletInitialState(plan, 0);
  throw new Error("Unsupported challenge plan initializer");
}

function createConfiguredGame(seed: number, firstPlayer: PlayerId, masters: Record<PlayerId, "white" | "black"> | SessionManifest["masters"], decks: SessionManifest["decks"]): GameState {
  return createInitialGame(seed, {
    firstPlayer,
    masterIds: masters,
    playerDeckCardIds: [...decks.player.cardIds],
    cpuDeckCardIds: [...decks.cpu.cardIds],
    allowSpecialDecks: { player: decks.player.allowSpecial, cpu: decks.cpu.allowSpecial },
    trackEventLog: true,
  });
}

function takeAvailableFrontMonster(
  state: GameState,
  owner: PlayerId,
  deck: readonly string[],
  options: { requireMultipleActions?: boolean } = {},
) {
  for (const cardId of deck) {
    let def;
    try { def = getMonsterDef(cardId); } catch { continue; }
    if (def.role !== "front" || (options.requireMultipleActions && (def.actionLimit ?? 1) <= 1) || !def.levels[0]?.commands.some((command) =>
      command.implemented && command.id === "attack" && (command.power ?? 0) > 0,
    )) continue;
    const player = state.players[owner];
    for (const zone of [player.hand, player.deck]) {
      const index = zone.findIndex((card) => card.cardId === cardId);
      if (index >= 0) return zone.splice(index, 1)[0];
    }
  }
  throw new Error(`Puzzle deck for ${owner} has no available normal front attacker`);
}

function makeMonster(cardId: string, owner: PlayerId, instanceId: string, overrides: Partial<MonsterState> = {}): MonsterState {
  const def = getMonsterDef(cardId);
  const level = def.levels[0];
  return {
    instanceId: `challenge_${owner}_${instanceId}`,
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

function applyHumanAction(state: GameState, action: HumanActionSnapshot): GameState {
  switch (action.type) {
    case "attack": return attackWithCommand(state, action.action);
    case "master_action": return useMasterAction(state, action.actionId, action.target);
    case "summon": return summonMonster(state, action.handInstanceId, action.slotKey);
    case "magic": return playMagic(state, action.action);
    case "move": return moveMonster(state, action.fromSlotKey, action.toSlotKey);
    case "focus": return focusMonster(state, action.slotKey);
    case "master_hp_draw": return useMasterHpDraw(state);
    case "discard_hand": return discardHandCard(state, action.handInstanceId);
    case "resolve_level_up": return resolveLevelUp(state, action.levels, action.superHandInstanceId);
    case "end_turn": return action.discardHandInstanceIds
      ? endTurnWithHandLimitDiscards(state, action.discardHandInstanceIds)
      : endTurn(state);
    case "experimental_master_action": throw new Error("Puzzle sessions do not allow experimental master actions");
  }
}

function matchesPuzzleAnswer(id: string, before: GameState, after: GameState, action: HumanActionSnapshot): boolean {
  if (id === "master-lethal") {
    return action.type === "master_action" && action.actionId === "master_attack" && action.target.kind === "master" &&
      action.target.playerId === "cpu" && after.winner === "player";
  }
  if (id === "frontline-break") {
    return action.type === "attack" && action.action.attackerSlotKey === "player_front_left" &&
      action.action.commandId === "attack" && action.action.target.kind === "monster" &&
      action.action.target.slotKey === "cpu_front_left" && !after.slots.cpu_front_left.monster;
  }
  if (id === "focus-the-guard") {
    return action.type === "focus" && action.slotKey === "player_front_left" &&
      !before.slots.player_front_left.monster?.focused && !!after.slots.player_front_left.monster?.focused;
  }
  return false;
}

function getPuzzleIdentity(runtime: SessionRuntime): SessionResult<{ id: string; definition: PuzzleCatalogEntry }> {
  if (runtime.manifest.kind !== "puzzle" || runtime.progress.kind !== "puzzle") return invalid("RuntimeはPuzzle sessionではありません。");
  const id = runtime.manifest.challengeDefinition?.id;
  const definition = id ? getPuzzleEntry(id) : undefined;
  if (!definition || runtime.manifest.challengeDefinition?.version !== definition.version ||
      runtime.progress.puzzleId !== definition.id || runtime.progress.puzzleVersion !== definition.version) {
    return unsupported("Puzzle definition/versionまたはprogressが不一致です。");
  }
  return { ok: true, value: { id: definition.id, definition } };
}

function getPuzzleEntry(id: string): PuzzleCatalogEntry | undefined {
  return PUZZLE_CATALOG.find((entry) => entry.id === id && entry.version === PUZZLE_VERSION);
}

function makePlanBase<T extends "daily" | "puzzle" | "gauntlet">(
  options: ChallengeStartOptions,
  seed: number,
  kind: T,
  specific: T extends "daily" ? { dateJst: string; challengeDefinition: { id: string; version: number } }
    : T extends "puzzle" ? { puzzleId: string; puzzleVersion: number }
      : { gauntletId: string; gauntletVersion: number },
): SessionPlan {
  const deckPreset = options.deckPreset ?? DEFAULT_DECK;
  const deckIds = buildDeckPresetCardIds(deckPreset);
  const deck = { cardIds: deckIds, allowSpecial: deckPresetAllowsSpecial(deckPreset), sourcePresetId: deckPreset };
  const base = {
    ...specific,
    id: options.id,
    createdAt: options.createdAt,
    seed,
    firstPlayer: options.firstPlayer ?? "player" as const,
    profiles: {
      player: options.profiles?.player ?? CPU_AI_PROFILES[0],
      cpu: options.profiles?.cpu ?? CPU_AI_PROFILES[0],
    },
    masters: { player: options.masters?.player ?? "white", cpu: options.masters?.cpu ?? "white" },
    decks: { player: deck, cpu: deck },
    controllerBySeat: { player: "human" as const, cpu: "cpu" as const },
  };
  return { ...base, kind } as SessionPlan;
}

function planFromManifest(manifest: SessionManifest): SessionPlan {
  if (manifest.kind !== "puzzle" || !manifest.challengeDefinition) throw new Error("Not a supported puzzle manifest");
  return {
    kind: "puzzle",
    puzzleId: manifest.challengeDefinition.id,
    puzzleVersion: manifest.challengeDefinition.version,
    id: manifest.id,
    createdAt: manifest.createdAt,
    seed: manifest.seed,
    firstPlayer: manifest.firstPlayer,
    profiles: manifest.profiles,
    masters: manifest.masters,
    decks: manifest.decks,
    controllerBySeat: manifest.controllerBySeat,
    opponentKnowledgePolicy: manifest.opponentKnowledgePolicy,
  };
}

function validSeed(value: number, maximum = 999_999_999): number | undefined {
  return Number.isSafeInteger(value) && value >= 0 && value <= maximum ? value : undefined;
}

function opponent(seat: PlayerId): PlayerId { return seat === "player" ? "cpu" : "player"; }
function isIsoTimestamp(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value) || !Number.isFinite(Date.parse(value))) return false;
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
function invalid<T = never>(message: string): SessionResult<T> { return { ok: false, error: { code: "INVALID_PROGRESS", message } }; }
function invalidPlan<T = never>(message: string): SessionResult<T> { return { ok: false, error: { code: "INVALID_PLAN", message } }; }
function unsupported<T = never>(message: string): SessionResult<T> { return { ok: false, error: { code: "UNSUPPORTED_SESSION", message } }; }
