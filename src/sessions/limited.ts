import { buildDeckCardIds, getCardDef, getCardDefsByPool, summarizeDeckCardIds } from "../game/cards";
import type { DeckPresetId } from "../game/deckPresets";
import { createDefaultAiProfiles } from "../game/defaultAiProfiles";
import { createInitialGame } from "../game/rules";
import { hashBattleState } from "../replay/battleJournal";
import type { ReplaySnapshot } from "../replay/types";
import { startSession } from "./plans";
import type {
  DraftPickEvent,
  DraftSessionProgress,
  SealedCard,
  SealedSessionProgress,
  SessionBattleResult,
  SessionManifest,
  SessionPlan,
  SessionProgress,
  SessionResult,
  SessionRuntime,
} from "./types";
import type { GameState, PlayerId } from "../game/types";

export const DRAFT_DEFINITION = { id: "two-seat-three-pack-v1", version: 1 } as const;
export const SEALED_DEFINITION = { id: "normal-sixty-pool-v1", version: 1 } as const;
const SEATS = ["player", "cpu"] as const satisfies readonly PlayerId[];
const PACKS_PER_SEAT = 3;
const PACK_COUNT = PACKS_PER_SEAT * 2;
const PACK_SIZE = 10;
const TOTAL_PICKS = PACK_COUNT * PACK_SIZE;
const DECK_SIZE = 30;

export interface LimitedStartOptions {
  readonly id?: string;
  readonly createdAt?: string;
  readonly seed?: number;
  readonly firstPlayer?: PlayerId;
  readonly deckPreset?: DeckPresetId;
  readonly masters?: Partial<Record<PlayerId, "white" | "black">>;
}

export interface DraftCardChoice {
  readonly pickId: string;
  readonly cardId: string;
  readonly name: string;
  readonly type: string;
}

export interface DraftSeatView {
  readonly status: DraftSessionProgress["status"];
  readonly packIndex: number;
  readonly activeSeat: PlayerId | null;
  readonly choices: readonly DraftCardChoice[];
  readonly draftedCardIds: readonly string[];
  readonly pickedCountBySeat: Readonly<Record<PlayerId, number>>;
}

export interface SealedSeatView {
  readonly status: SealedSessionProgress["status"];
  readonly pool: readonly SealedCard[];
  readonly selectedInstanceIds: readonly string[];
  readonly requiredSelectionCount: number;
}

export interface StartLimitedBattleOptions {
  readonly createInitialGame?: (plan: SessionPlan) => GameState;
}

/** Creates a private, seed-reconstructable 2-seat draft with six real 10-card packs. */
export function createDraftSession(options: LimitedStartOptions = {}): SessionResult<SessionRuntime> {
  const seed = validSeed(options.seed ?? 510_001);
  if (seed === undefined) return invalid("Draft seedは0〜999999999の整数にしてください。");
  const plan: SessionPlan = {
    kind: "draft",
    draftId: DRAFT_DEFINITION.id,
    draftVersion: DRAFT_DEFINITION.version,
    ...(options.id ? { id: options.id } : {}),
    ...(options.createdAt ? { createdAt: options.createdAt } : {}),
    seed,
    firstPlayer: options.firstPlayer ?? "player",
    profiles: createDefaultAiProfiles(),
    masters: { player: options.masters?.player ?? "white", cpu: options.masters?.cpu ?? "white" },
    decks: { player: { cardIds: [], allowSpecial: false }, cpu: { cardIds: [], allowSpecial: false } },
    controllerBySeat: { player: "human", cpu: "cpu" },
  };
  const started = startSession(plan, { createInitialGame: () => null });
  if (!started.ok) return started;
  return continueCpuDraftPicks(started.value);
}

/** Returns only the current pack choices and picks belonging to the requested seat. */
export function getDraftView(runtime: SessionRuntime, seat: PlayerId = "player"): SessionResult<DraftSeatView> {
  const checked = getDraftProgress(runtime);
  if (!checked.ok) return checked;
  const progress = checked.value;
  const packIndex = Math.min(progress.packIndex, PACK_COUNT - 1);
  const activeSeat = progress.status === "drafting" ? activeDraftSeat(runtime.manifest.seed, progress.pickEvents) : null;
  const pickedIds = new Set(progress.pickEvents.map((event) => event.pickId));
  const pack = makeDraftPacks(runtime.manifest.seed)[packIndex] ?? [];
  const choices = activeSeat === seat && progress.status === "drafting"
    ? pack.filter((choice) => !pickedIds.has(choice.pickId))
    : [];
  return {
    ok: true,
    value: {
      status: progress.status,
      packIndex,
      activeSeat,
      choices,
      draftedCardIds: progress.pickEvents.filter((event) => event.picker === seat).map((event) => event.cardId),
      pickedCountBySeat: countPicks(progress.pickEvents),
    },
  };
}

/** Records one human pick, then resolves CPU turns using only its current visible pack. */
export function pickDraftCard(runtime: SessionRuntime, pickId: string): SessionResult<SessionRuntime> {
  const checked = getDraftProgress(runtime);
  if (!checked.ok) return checked;
  const progress = checked.value;
  if (progress.status !== "drafting" || activeDraftSeat(runtime.manifest.seed, progress.pickEvents) !== "player") {
    return invalid("現在はplayerのDraft pickではありません。");
  }
  const next = recordDraftPick(runtime.manifest, progress, "player", pickId);
  if (!next.ok) return next;
  const runtimeWithPick = { ...runtime, progress: next.value };
  return continueCpuDraftPicks(runtimeWithPick);
}

/** Starts the actual battle only after all 60 pick events have produced two legal 30-card decks. */
export function startDraftBattle(
  runtime: SessionRuntime,
  options: StartLimitedBattleOptions = {},
): SessionResult<SessionRuntime> {
  const checked = getDraftProgress(runtime);
  if (!checked.ok) return checked;
  const progress = checked.value;
  if (progress.status !== "deckReady" || !progress.selectedDeckBySeat || !isValidDraftProgress(runtime.manifest, progress)) {
    return invalid("Draftは60回の検証済みpickと両seatの合法deck完成後に開始できます。");
  }
  const plans = battlePlan(runtime, progress.selectedDeckBySeat);
  const started = startSession(plans, {
    createInitialGame: (battlePlan) => options.createInitialGame?.(battlePlan) ?? createLimitedGame(battlePlan),
  });
  if (!started.ok) return started;
  if (started.value.progress.kind !== "draft") return invalid("Draft battle progressの初期化に失敗しました。");
  const nextProgress: DraftSessionProgress = {
    ...progress,
    status: "battle",
    selectedDeckBySeat: cloneSeatDecks(progress.selectedDeckBySeat),
  };
  return { ok: true, value: { ...started.value, progress: freeze(nextProgress) } };
}

/** Moves a real terminal Draft battle into an embedded, replay-verifiable result. */
export function completeDraftBattleWithVerifiedHead(
  runtime: SessionRuntime,
  verifiedHead: ReplaySnapshot,
  completedAt: string = new Date().toISOString(),
): SessionResult<SessionRuntime> {
  const checked = getDraftProgress(runtime);
  if (!checked.ok) return checked;
  const progress = checked.value;
  if (runtime.manifest.kind !== "draft" || progress.status !== "battle" || !progress.selectedDeckBySeat || !runtime.game || !runtime.journal) {
    return invalid("Draft runtimeに完了可能なbattleがありません。");
  }
  const terminal = verifyTerminal(runtime.game, runtime.journal, verifiedHead, completedAt);
  if (!terminal.ok) return terminal;
  const result: SessionBattleResult = {
    winner: terminal.value.winner!,
    turns: terminal.value.turnNumber,
    completedAt,
    headHash: hashBattleState(terminal.value),
  };
  const completed: DraftSessionProgress = {
    ...progress,
    status: "completed",
    result: { journal: runtime.journal, result },
  };
  return { ok: true, value: { ...runtime, game: null, journal: null, progress: freeze(completed) } };
}

/** Creates a 60-card seed-bound private pool per seat for actual Sealed deck construction. */
export function createSealedSession(options: LimitedStartOptions = {}): SessionResult<SessionRuntime> {
  const seed = validSeed(options.seed ?? 610_001);
  if (seed === undefined) return invalid("Sealed seedは0〜999999999の整数にしてください。");
  const plan: SessionPlan = {
    kind: "sealed",
    sealedId: SEALED_DEFINITION.id,
    sealedVersion: SEALED_DEFINITION.version,
    ...(options.id ? { id: options.id } : {}),
    ...(options.createdAt ? { createdAt: options.createdAt } : {}),
    seed,
    firstPlayer: options.firstPlayer ?? "player",
    profiles: createDefaultAiProfiles(),
    masters: { player: options.masters?.player ?? "white", cpu: options.masters?.cpu ?? "white" },
    decks: { player: { cardIds: [], allowSpecial: false }, cpu: { cardIds: [], allowSpecial: false } },
    controllerBySeat: { player: "human", cpu: "cpu" },
  };
  const started = startSession(plan, { createInitialGame: () => null });
  if (!started.ok) return started;
  const progress: SealedSessionProgress = {
    kind: "sealed",
    sealedId: SEALED_DEFINITION.id,
    sealedVersion: SEALED_DEFINITION.version,
    status: "deckbuilding",
    poolBySeat: createSealedPools(seed),
  };
  const withPools = { ...started.value, progress: freeze(progress) };
  return { ok: true, value: chooseDefaultCpuSealedDeck(withPools) };
}

/** Reveals only the requested seat's pool and its selected instances. */
export function getSealedView(runtime: SessionRuntime, seat: PlayerId = "player"): SessionResult<SealedSeatView> {
  const checked = getSealedProgress(runtime);
  if (!checked.ok) return checked;
  const progress = checked.value;
  return {
    ok: true,
    value: {
      status: progress.status,
      pool: progress.poolBySeat[seat].map((card) => ({ ...card })),
      selectedInstanceIds: progress.selectedDeckBySeat?.[seat] ? [...progress.selectedDeckBySeat[seat]] : [],
      requiredSelectionCount: DECK_SIZE,
    },
  };
}

/** Selects exactly 30 unique pool instances for player and validates the resulting engine deck. */
export function selectSealedDeck(runtime: SessionRuntime, instanceIds: readonly string[]): SessionResult<SessionRuntime> {
  const partial = updateSealedDeckSelection(runtime, instanceIds);
  if (!partial.ok) return partial;
  const checked = getSealedProgress(partial.value);
  if (!checked.ok) return checked;
  const progress = checked.value;
  if (progress.status !== "deckbuilding") return invalid("現在はSealed deckを構築できません。");
  const playerDeck = cardIdsFromInstances(progress.poolBySeat.player, instanceIds);
  if (!playerDeck.ok) return playerDeck;
  const cpuInstances = progress.selectedDeckBySeat?.cpu;
  if (!cpuInstances) return invalid("CPU Sealed deckの内部構成が不正です。");
  const cpuDeck = cardIdsFromInstances(progress.poolBySeat.cpu, cpuInstances);
  if (!cpuDeck.ok) return invalid("CPU Sealed deckの内部構成が不正です。");
  const selected = { player: playerDeck.value.instanceIds, cpu: [...cpuInstances] };
  const next: SealedSessionProgress = { ...progress, status: "deckReady", selectedDeckBySeat: selected };
  const updated = { ...partial.value, progress: freeze(next) };
  if (!isValidSealedProgress(updated.manifest, next)) return invalid("Sealed progress検証に失敗しました。");
  return { ok: true, value: updated };
}

/** Persists a legal 0–30 temporary Sealed selection before the explicit exact-30 confirmation. */
export function updateSealedDeckSelection(runtime: SessionRuntime, instanceIds: readonly string[]): SessionResult<SessionRuntime> {
  const checked = getSealedProgress(runtime);
  if (!checked.ok) return checked;
  const progress = checked.value;
  if (progress.status !== "deckbuilding") return invalid("現在はSealed deckを構築できません。");
  if (!isValidSealedPartialSelection(progress.poolBySeat.player, instanceIds)) return invalid("Sealedの一時選択はpool内の重複なし・最大30枚・同名3枚以下で指定してください。");
  const cpuInstances = progress.selectedDeckBySeat?.cpu;
  if (!cpuInstances || !isValidSealedSeatSelection(progress.poolBySeat.cpu, cpuInstances)) return invalid("CPU Sealed deckの内部構成が不正です。");
  const next: SealedSessionProgress = {
    ...progress,
    selectedDeckBySeat: { player: [...instanceIds], cpu: [...cpuInstances] },
  };
  if (!isValidSealedProgress(runtime.manifest, next)) return invalid("Sealed partial selection検証に失敗しました。");
  return { ok: true, value: { ...runtime, progress: freeze(next) } };
}

export function startSealedBattle(
  runtime: SessionRuntime,
  options: StartLimitedBattleOptions = {},
): SessionResult<SessionRuntime> {
  const checked = getSealedProgress(runtime);
  if (!checked.ok) return checked;
  const progress = checked.value;
  if (progress.status !== "deckReady" || !progress.selectedDeckBySeat || !isValidSealedProgress(runtime.manifest, progress)) {
    return invalid("Sealed battleには両seatの合法な30枚deckが必要です。");
  }
  const decks = resolveSealedDecks(progress);
  if (!decks) return invalid("Sealed deckのpool instance参照が不正です。");
  const started = startSession(battlePlan(runtime, decks), {
    createInitialGame: (plan) => options.createInitialGame?.(plan) ?? createLimitedGame(plan),
  });
  if (!started.ok) return started;
  if (started.value.progress.kind !== "sealed") return invalid("Sealed battle progressの初期化に失敗しました。");
  const next: SealedSessionProgress = { ...progress, status: "battle", selectedDeckBySeat: cloneSeatDecks(progress.selectedDeckBySeat) };
  return { ok: true, value: { ...started.value, progress: freeze(next) } };
}

export function completeSealedBattleWithVerifiedHead(
  runtime: SessionRuntime,
  verifiedHead: ReplaySnapshot,
  completedAt: string = new Date().toISOString(),
): SessionResult<SessionRuntime> {
  const checked = getSealedProgress(runtime);
  if (!checked.ok) return checked;
  const progress = checked.value;
  if (runtime.manifest.kind !== "sealed" || progress.status !== "battle" || !progress.selectedDeckBySeat || !runtime.game || !runtime.journal) {
    return invalid("Sealed runtimeに完了可能なbattleがありません。");
  }
  const terminal = verifyTerminal(runtime.game, runtime.journal, verifiedHead, completedAt);
  if (!terminal.ok) return terminal;
  const result: SessionBattleResult = {
    winner: terminal.value.winner!,
    turns: terminal.value.turnNumber,
    completedAt,
    headHash: hashBattleState(terminal.value),
  };
  const next: SealedSessionProgress = { ...progress, status: "completed", result };
  return { ok: true, value: { ...runtime, progress: freeze(next) } };
}

/** Deep validator used both at transitions and archive import/restore. */
export function isValidDraftProgress(manifest: SessionManifest, progress: DraftSessionProgress): boolean {
  if (manifest.kind !== "draft" || manifest.challengeDefinition?.id !== DRAFT_DEFINITION.id || manifest.challengeDefinition.version !== DRAFT_DEFINITION.version ||
      progress.kind !== "draft" || progress.draftId !== DRAFT_DEFINITION.id || progress.draftVersion !== DRAFT_DEFINITION.version ||
      !Number.isSafeInteger(progress.packIndex) || progress.packIndex < 0 || progress.packIndex > PACK_COUNT ||
      !Array.isArray(progress.pickEvents) || progress.pickEvents.length > TOTAL_PICKS) return false;
  const packs = makeDraftPacks(manifest.seed);
  const remaining = packs.map((pack) => new Set(pack.map((choice) => choice.pickId)));
  const pickedBySeat: Record<PlayerId, string[]> = { player: [], cpu: [] };
  for (const [index, event] of progress.pickEvents.entries()) {
    const packIndex = Math.floor(index / PACK_SIZE);
    const pickInPack = index % PACK_SIZE;
    const expectedSeat = seatForPick(manifest.seed, packIndex, pickInPack);
    if (event.sequence !== index + 1 || event.packIndex !== packIndex || event.picker !== expectedSeat ||
        event.passedPackTo !== (pickInPack < PACK_SIZE - 1 ? otherSeat(expectedSeat) : undefined)) return false;
    const option = packs[packIndex]?.find((choice) => choice.pickId === event.pickId);
    if (!option || option.cardId !== event.cardId || !remaining[packIndex].delete(event.pickId)) return false;
    const picker: PlayerId = event.picker === "player" ? "player" : event.picker === "cpu" ? "cpu" : "player";
    if (picker !== event.picker) return false;
    pickedBySeat[picker].push(event.cardId);
  }
  const complete = progress.pickEvents.length === TOTAL_PICKS;
  const expectedPackIndex = complete ? PACK_COUNT : Math.floor(progress.pickEvents.length / PACK_SIZE);
  if (progress.packIndex !== expectedPackIndex) return false;
  if (!complete) return progress.status === "drafting" && progress.selectedDeckBySeat === undefined && progress.result === undefined;
  const expectedSelected: Record<PlayerId, readonly string[]> = { player: pickedBySeat.player, cpu: pickedBySeat.cpu };
  if (!progress.selectedDeckBySeat || !sameDecks(progress.selectedDeckBySeat, expectedSelected) ||
      SEATS.some((seat) => !isLegalDeck(progress.selectedDeckBySeat![seat]))) return false;
  if (progress.status === "deckReady" || progress.status === "battle") return progress.result === undefined;
  return progress.status === "completed" && progress.result !== undefined;
}

/** Deep validator proves the 60-card pool is seed-derived and selections are in-pool legal card IDs. */
export function isValidSealedProgress(manifest: SessionManifest, progress: SealedSessionProgress): boolean {
  if (manifest.kind !== "sealed" || manifest.challengeDefinition?.id !== SEALED_DEFINITION.id || manifest.challengeDefinition.version !== SEALED_DEFINITION.version ||
      progress.kind !== "sealed" || progress.sealedId !== SEALED_DEFINITION.id || progress.sealedVersion !== SEALED_DEFINITION.version ||
      !samePools(progress.poolBySeat, createSealedPools(manifest.seed))) return false;
  if (progress.status === "pool") return progress.selectedDeckBySeat === undefined && progress.result === undefined;
  if (progress.status === "deckbuilding") {
    if (progress.result !== undefined) return false;
    if (progress.selectedDeckBySeat === undefined) return true;
    return isValidSealedPartialSelection(progress.poolBySeat.player, progress.selectedDeckBySeat.player) &&
      isValidSealedSeatSelection(progress.poolBySeat.cpu, progress.selectedDeckBySeat.cpu);
  }
  if (!progress.selectedDeckBySeat || !isValidSelectedSealedDecks(progress.poolBySeat, progress.selectedDeckBySeat)) return false;
  if (progress.status === "deckReady" || progress.status === "battle") return progress.result === undefined;
  return progress.status === "completed" && progress.result !== undefined;
}

/** Confirms a live limited-mode manifest deck is exactly the result of its recorded picks/selections. */
export function matchesLimitedManifestDecks(manifest: SessionManifest, progress: DraftSessionProgress | SealedSessionProgress): boolean {
  if (progress.status !== "battle" && progress.status !== "completed") return true;
  if (!progress.selectedDeckBySeat) return false;
  for (const seat of SEATS) {
    const expected = progress.kind === "draft"
      ? progress.selectedDeckBySeat[seat]
      : progress.selectedDeckBySeat[seat].map((instanceId) => progress.poolBySeat[seat].find((card) => card.instanceId === instanceId)?.cardId ?? "");
    const actual = manifest.decks[seat].cardIds;
    if (actual.length !== expected.length || actual.some((cardId, index) => cardId !== expected[index])) return false;
  }
  return true;
}

/** Reconstructs limited-mode initial state from immutable manifest deck/seed for archive validation. */
export function createLimitedModeInitialGame(manifest: SessionManifest, progress: SessionProgress): GameState | null {
  if ((manifest.kind !== "draft" && manifest.kind !== "sealed") ||
      !["battle", "completed"].includes((progress as DraftSessionProgress | SealedSessionProgress).status) ||
      !manifest.decks.player.cardIds.length || !manifest.decks.cpu.cardIds.length) return null;
  if (!summarizeDeckCardIds(manifest.decks.player.cardIds, [], { allowSpecial: manifest.decks.player.allowSpecial }).valid ||
      !summarizeDeckCardIds(manifest.decks.cpu.cardIds, [], { allowSpecial: manifest.decks.cpu.allowSpecial }).valid) return null;
  return createInitialGame(manifest.seed, {
    firstPlayer: manifest.firstPlayer,
    masterIds: manifest.masters,
    playerDeckCardIds: [...manifest.decks.player.cardIds],
    cpuDeckCardIds: [...manifest.decks.cpu.cardIds],
    allowSpecialDecks: { player: manifest.decks.player.allowSpecial, cpu: manifest.decks.cpu.allowSpecial },
    trackEventLog: true,
  });
}

function continueCpuDraftPicks(runtime: SessionRuntime): SessionResult<SessionRuntime> {
  let current = runtime;
  while (current.progress.kind === "draft" && current.progress.status === "drafting" &&
    activeDraftSeat(current.manifest.seed, current.progress.pickEvents) === "cpu") {
    const view = getDraftView(current, "cpu");
    if (!view.ok || !view.value.choices.length) return invalid("CPUが現在のpackから合法なpickを選べません。");
    const ownDraftedCardIds = current.progress.pickEvents.filter((event) => event.picker === "cpu").map((event) => event.cardId);
    const choice = chooseCpuDraftCard(view.value.choices, ownDraftedCardIds);
    const appended = recordDraftPick(current.manifest, current.progress, "cpu", choice.pickId);
    if (!appended.ok) return appended;
    current = { ...current, progress: appended.value };
  }
  return { ok: true, value: current };
}

function recordDraftPick(manifest: SessionManifest, progress: DraftSessionProgress, picker: PlayerId, pickId: string): SessionResult<DraftSessionProgress> {
  const packIndex = Math.floor(progress.pickEvents.length / PACK_SIZE);
  const pickInPack = progress.pickEvents.length % PACK_SIZE;
  const active = seatForPick(manifest.seed, packIndex, pickInPack);
  if (progress.status !== "drafting" || picker !== active) return invalid("Draft pick seat/orderが一致しません。");
  const option = makeDraftPacks(manifest.seed)[packIndex]?.find((choice) => choice.pickId === pickId);
  if (!option || progress.pickEvents.some((event) => event.pickId === pickId)) return invalid("現在のpackに存在しないpickです。");
  const event: DraftPickEvent = {
    sequence: progress.pickEvents.length + 1,
    packIndex,
    picker,
    pickId,
    cardId: option.cardId,
    ...(pickInPack < PACK_SIZE - 1 ? { passedPackTo: otherSeat(picker) } : {}),
  };
  const pickEvents = [...progress.pickEvents, event];
  const packComplete = pickEvents.length === TOTAL_PICKS;
  const next: DraftSessionProgress = {
    ...progress,
    status: packComplete ? "deckReady" : "drafting",
    packIndex: packComplete ? PACK_COUNT : Math.floor(pickEvents.length / PACK_SIZE),
    pickEvents,
    ...(packComplete ? { selectedDeckBySeat: deckByPicks(pickEvents) } : {}),
  };
  if (!isValidDraftProgress(manifest, next)) return invalid("Draft pick progressの検証に失敗しました。");
  return { ok: true, value: freeze(next) };
}

function makeDraftPacks(seed: number): DraftCardChoice[][] {
  const cards = shuffleStable(getCardDefsByPool("normal").map((card) => card.id).sort(), seed ^ 0x44524146);
  if (cards.length < TOTAL_PICKS) return [];
  return Array.from({ length: PACK_COUNT }, (_, packIndex) => cards.slice(packIndex * PACK_SIZE, (packIndex + 1) * PACK_SIZE).map((cardId, slotIndex) => {
    const def = getCardDef(cardId);
    return { pickId: `draft-${packIndex}-${slotIndex}`, cardId, name: def.name, type: def.type };
  }));
}

function chooseCpuDraftCard(choices: readonly DraftCardChoice[], own: readonly string[]): DraftCardChoice {
  const counts = new Map<string, number>();
  for (const id of own) counts.set(id, (counts.get(id) ?? 0) + 1);
  // The chooser receives only this currently visible pack. It cannot inspect a human pick or unopened pack.
  return [...choices].sort((a, b) => draftScore(b, counts) - draftScore(a, counts) || a.cardId.localeCompare(b.cardId))[0];
}

function draftScore(choice: DraftCardChoice, ownCounts: ReadonlyMap<string, number>): number {
  const count = ownCounts.get(choice.cardId) ?? 0;
  const def = getCardDef(choice.cardId);
  const category = def.type === "magic" ? 3 : def.type === "monster" ? 2 : 1;
  return count >= 3 ? -100 : category * 10 + (2 - count);
}

function deckByPicks(events: readonly DraftPickEvent[]): Record<PlayerId, string[]> {
  return { player: events.filter((event) => event.picker === "player").map((event) => event.cardId), cpu: events.filter((event) => event.picker === "cpu").map((event) => event.cardId) };
}

function activeDraftSeat(seed: number, events: readonly DraftPickEvent[]): PlayerId | null {
  if (events.length >= TOTAL_PICKS) return null;
  return seatForPick(seed, Math.floor(events.length / PACK_SIZE), events.length % PACK_SIZE);
}

function seatForPick(seed: number, packIndex: number, pickInPack: number): PlayerId {
  const first: PlayerId = ((Math.floor(seed) + packIndex) % 2 === 0) ? "player" : "cpu";
  return pickInPack % 2 === 0 ? first : otherSeat(first);
}

function createSealedPools(seed: number): Record<PlayerId, SealedCard[]> {
  return Object.fromEntries(SEATS.map((seat, seatIndex) => {
    const poolSeed = (seed ^ 0x5345414c ^ Math.imul(seatIndex + 1, 0x9e3779b9)) >>> 0;
    const cardIds = [
      ...buildDeckCardIds(poolSeed, { includeSpecial: false, masterId: "white" }),
      ...buildDeckCardIds(poolSeed ^ 0xa5a5a5a5, { includeSpecial: false, masterId: "white" }),
    ];
    return [seat, cardIds.map((cardId, index) => ({ instanceId: `sealed-${seat}-${index}`, cardId }))];
  })) as Record<PlayerId, SealedCard[]>;
}

function chooseDefaultCpuSealedDeck(runtime: SessionRuntime): SessionRuntime {
  if (runtime.progress.kind !== "sealed") return runtime;
  const pool = runtime.progress.poolBySeat.cpu;
  const deck = pool.slice(0, DECK_SIZE).map((card) => card.instanceId);
  const progress: SealedSessionProgress = { ...runtime.progress, selectedDeckBySeat: { cpu: deck, player: [] } };
  return { ...runtime, progress: freeze(progress) };
}

function cardIdsFromInstances(pool: readonly SealedCard[], selectedIds: readonly string[]): SessionResult<{ instanceIds: string[]; cardIds: string[] }> {
  if (!Array.isArray(selectedIds) || selectedIds.length !== DECK_SIZE || new Set(selectedIds).size !== DECK_SIZE) {
    return invalid("Sealedは重複しない30個のpool instanceを選択してください。");
  }
  const byId = new Map(pool.map((card) => [card.instanceId, card]));
  const chosen = selectedIds.map((instanceId) => byId.get(instanceId));
  if (chosen.some((card) => !card)) return invalid("Sealed selectionにpool外のinstanceがあります。");
  const cardIds = chosen.map((card) => card!.cardId);
  if (!isLegalDeck(cardIds)) return invalid("Sealed選択deckは30枚/同名3枚以下/normal cardの合法性に適合しません。");
  return { ok: true, value: { instanceIds: [...selectedIds], cardIds } };
}

function isValidSelectedSealedDecks(poolBySeat: SealedSessionProgress["poolBySeat"], decks: Readonly<Record<PlayerId, readonly string[]>>): boolean {
  for (const seat of SEATS) {
    if (!isValidSealedSeatSelection(poolBySeat[seat], decks[seat])) return false;
  }
  return true;
}

function isValidSealedSeatSelection(pool: readonly SealedCard[], selected: readonly string[]): boolean {
  if (!selected || selected.length !== DECK_SIZE || new Set(selected).size !== DECK_SIZE) return false;
  const byInstance = new Map(pool.map((card) => [card.instanceId, card]));
  const chosen = selected.map((instanceId) => byInstance.get(instanceId));
  return !chosen.some((card) => !card) && isLegalDeck(chosen.map((card) => card!.cardId));
}

function isValidSealedPartialSelection(pool: readonly SealedCard[], selected: readonly string[]): boolean {
  if (!Array.isArray(selected) || selected.length > DECK_SIZE || new Set(selected).size !== selected.length) return false;
  const byInstance = new Map(pool.map((card) => [card.instanceId, card]));
  const chosen = selected.map((instanceId) => byInstance.get(instanceId));
  if (chosen.some((card) => !card)) return false;
  const cardIds = chosen.map((card) => card!.cardId);
  const counts = new Map<string, number>();
  for (const cardId of cardIds) counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
  return cardIds.every((cardId) => getCardDef(cardId).pool !== "special") && [...counts.values()].every((count) => count <= 3);
}

function resolveSealedDecks(progress: SealedSessionProgress): Record<PlayerId, string[]> | undefined {
  if (!progress.selectedDeckBySeat) return undefined;
  const decks = {} as Record<PlayerId, string[]>;
  for (const seat of SEATS) {
    const resolved = cardIdsFromInstances(progress.poolBySeat[seat], progress.selectedDeckBySeat[seat]);
    if (!resolved.ok) return undefined;
    decks[seat] = resolved.value.cardIds;
  }
  return decks;
}

function battlePlan(runtime: SessionRuntime, decks: Readonly<Record<PlayerId, readonly string[]>>): SessionPlan {
  const kind = runtime.manifest.kind;
  if (kind !== "draft" && kind !== "sealed") throw new Error("Limited battle requires Draft or Sealed runtime.");
  return {
    kind,
    ...(kind === "draft" ? { draftId: DRAFT_DEFINITION.id, draftVersion: DRAFT_DEFINITION.version } : { sealedId: SEALED_DEFINITION.id, sealedVersion: SEALED_DEFINITION.version }),
    id: runtime.manifest.id,
    createdAt: runtime.manifest.createdAt,
    seed: runtime.manifest.seed,
    firstPlayer: runtime.manifest.firstPlayer,
    profiles: runtime.manifest.profiles,
    masters: runtime.manifest.masters,
    decks: { player: { cardIds: [...decks.player], allowSpecial: false }, cpu: { cardIds: [...decks.cpu], allowSpecial: false } },
    controllerBySeat: runtime.manifest.controllerBySeat,
    opponentKnowledgePolicy: "unknown_composition",
  } as SessionPlan;
}

function createLimitedGame(plan: SessionPlan): GameState {
  return createInitialGame(plan.seed, {
    firstPlayer: plan.firstPlayer,
    masterIds: plan.masters,
    playerDeckCardIds: [...plan.decks.player.cardIds],
    cpuDeckCardIds: [...plan.decks.cpu.cardIds],
    allowSpecialDecks: { player: false, cpu: false },
    trackEventLog: true,
  });
}

function verifyTerminal(game: GameState, journal: NonNullable<SessionRuntime["journal"]>, head: ReplaySnapshot, completedAt: string): SessionResult<GameState> {
  const expectedHash = journal.commands.at(-1)?.afterHash ?? journal.initialHash;
  if (!head || journal.completeness.status !== "complete" || head.cursor !== journal.commands.length || head.totalCommands !== journal.commands.length ||
      hashBattleState(head.state) !== expectedHash || hashBattleState(game) !== expectedHash || !game.winner || head.state.winner !== game.winner ||
      !isIsoTimestamp(completedAt)) return invalid("limited battleはjournalと一致するverified terminal winnerで完了していません。");
  return { ok: true, value: head.state };
}

function getDraftProgress(runtime: SessionRuntime): SessionResult<DraftSessionProgress> {
  if (runtime.manifest.kind !== "draft" || runtime.progress.kind !== "draft" || !isValidDraftProgress(runtime.manifest, runtime.progress)) {
    return invalid("Draft runtime/progressがseed由来の完全性検証に失敗しました。");
  }
  return { ok: true, value: runtime.progress };
}

function getSealedProgress(runtime: SessionRuntime): SessionResult<SealedSessionProgress> {
  if (runtime.manifest.kind !== "sealed" || runtime.progress.kind !== "sealed" || !isValidSealedProgress(runtime.manifest, runtime.progress)) {
    return invalid("Sealed runtime/progressがseed由来の完全性検証に失敗しました。");
  }
  return { ok: true, value: runtime.progress };
}

function isLegalDeck(cardIds: readonly string[]): boolean {
  return cardIds.length === DECK_SIZE && cardIds.every((id) => getCardDef(id).pool !== "special") &&
    summarizeDeckCardIds(cardIds, [], { allowSpecial: false }).valid;
}

function sameDecks(left: Readonly<Record<PlayerId, readonly string[]>>, right: Readonly<Record<PlayerId, readonly string[]>>): boolean {
  return SEATS.every((seat) => left[seat]?.length === right[seat].length && left[seat].every((cardId, index) => cardId === right[seat][index]));
}

function samePools(left: SealedSessionProgress["poolBySeat"], right: SealedSessionProgress["poolBySeat"]): boolean {
  return SEATS.every((seat) => left?.[seat]?.length === 60 && left[seat].every((card, index) => card.instanceId === right[seat]?.[index]?.instanceId && card.cardId === right[seat]?.[index]?.cardId));
}

function countPicks(events: readonly DraftPickEvent[]): Record<PlayerId, number> {
  return { player: events.filter((event) => event.picker === "player").length, cpu: events.filter((event) => event.picker === "cpu").length };
}

function cloneSeatDecks(decks: Readonly<Record<PlayerId, readonly string[]>>): Record<PlayerId, string[]> {
  return { player: [...decks.player], cpu: [...decks.cpu] };
}

function shuffleStable<T>(values: readonly T[], seed: number): T[] {
  const result = [...values];
  let state = seed >>> 0;
  const random = () => {
    state += 0x6d2b79f5;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function otherSeat(seat: PlayerId): PlayerId { return seat === "player" ? "cpu" : "player"; }
function validSeed(value: unknown): number | undefined { return Number.isSafeInteger(value) && Number(value) >= 0 && Number(value) <= 999_999_999 ? Number(value) : undefined; }
function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d\d-\d\dT/.test(value) || !Number.isFinite(Date.parse(value))) return false;
  const [date] = value.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const actual = new Date(Date.UTC(year, month - 1, day));
  return actual.getUTCFullYear() === year && actual.getUTCMonth() === month - 1 && actual.getUTCDate() === day;
}
function freeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) freeze(child);
  }
  return value;
}
function invalid(message: string): SessionResult<never> { return { ok: false, error: { code: "INVALID_PROGRESS", message } }; }
