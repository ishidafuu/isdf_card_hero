import { CPU_AI_PROFILES, type CpuAiProfiles } from "../game/cpuAiTypes";
import { summarizeDeckCardIds, getMonsterDef } from "../game/cards";
import { isExperimentContextV1 } from "../game/experimentalContext";
import { createBattleJournal, hashBattleState } from "../replay/battleJournal";
import type { BattleJournal, ReplaySnapshot } from "../replay/types";
import { validateSessionManifest } from "./manifest";
import type { GameState, PlayerId } from "../game/types";
import {
  SESSION_MANIFEST_FORMAT,
  SESSION_MANIFEST_VERSION,
  type SessionError,
  type SessionExperimentContextV1,
  type SessionManifest,
  type SessionBranchProvenance,
  type SessionControllers,
  type SessionPlan,
  type SessionProgress,
  type SessionResult,
  type SessionRuntime,
} from "./types";

export interface StartSessionDependencies {
  createInitialGame?: (plan: SessionPlan) => GameState | null;
  now?: () => Date;
  createId?: () => string;
}

export interface BattleBranchPlanOptions {
  /** The entire source journal must have been verified by the replay Worker before this call. */
  readonly sourceManifest: SessionManifest;
  readonly sourceJournal: BattleJournal;
  readonly sourceProgress: SessionProgress;
  readonly sourceBranchSource?: SessionBranchProvenance;
  readonly sourceCursor: number;
  readonly verifiedSourceSnapshot: ReplaySnapshot;
  /** Branch profiles default to the captured source profiles; changing them is an explicit choice. */
  readonly profiles?: Readonly<CpuAiProfiles>;
  /** Controller ownership is always explicit for a branch, even when source was legacy v1. */
  readonly controllerBySeat: SessionControllers;
  readonly id?: string;
  readonly createdAt?: string;
}

export function startSession(plan: SessionPlan, dependencies: StartSessionDependencies = {}): SessionResult<SessionRuntime> {
  try {
    const validation = validateSessionPlan(plan);
    if (validation) return { ok: false, error: validation };

    const now = dependencies.now?.() ?? new Date();
    if (!Number.isFinite(now.getTime())) {
      return failure("INVALID_PLAN", "セッション開始時刻が不正です。", "createdAt");
    }
    const manifest = freezeDeep<SessionManifest>({
      format: SESSION_MANIFEST_FORMAT,
      version: SESSION_MANIFEST_VERSION,
      id: plan.id ?? dependencies.createId?.() ?? createSessionId(now),
      kind: plan.kind,
      createdAt: plan.createdAt ?? now.toISOString(),
      seed: plan.seed,
      firstPlayer: plan.firstPlayer,
      profiles: { ...plan.profiles },
      masters: { ...plan.masters },
      decks: {
        player: cloneDeck(plan.decks.player),
        cpu: cloneDeck(plan.decks.cpu),
      },
      controllerBySeat: { ...plan.controllerBySeat },
      controlPolicy: plan.kind === "battle" && !plan.branchSource ? "legacy-workspace" : "fixed-seat",
      opponentKnowledgePolicy: plan.opponentKnowledgePolicy ?? plan.branchSource?.sourceManifest.opponentKnowledgePolicy ??
        (plan.kind === "draft" || plan.kind === "sealed" || plan.kind === "local-pvp" ? "unknown_composition" : "known_deck"),
      ...(plan.kind === "experimental" || (plan.kind === "battle" && plan.branchSource?.sourceManifest.experimentalContext)
        ? { experimentalContext: cloneJson(plan.kind === "experimental" ? plan.experimentalContext : plan.branchSource!.sourceManifest.experimentalContext!) }
        : {}),
      ...(getChallengeDefinition(plan) ? { challengeDefinition: getChallengeDefinition(plan)! } : {}),
    });
    if (!validId(manifest.id)) return failure("INVALID_PLAN", "session id factoryが不正なIDを返しました。", "id");
    if (!isIsoTimestamp(manifest.createdAt)) return failure("INVALID_PLAN", "session時刻が実在するISO日時ではありません。", "createdAt");
    const manifestCheck = validateSessionManifest(manifest, { allowEmptyDraftDecks: true });
    if (!manifestCheck.ok) return { ok: false, error: { ...manifestCheck.error, code: "INVALID_MANIFEST" } };
    const progress = freezeDeep(makeInitialProgress(plan));
    const game = dependencies.createInitialGame?.(plan) ?? null;
    if (requiresInitialBattle(plan.kind) && !game) {
      return failure("UNSUPPORTED_SESSION", "このセッションには初期GameState生成が必要です。", "game");
    }
    if (game) {
      const mismatch = plan.branchSource
        ? validateBranchInitialGame(game, plan.branchSource)
        : validateInitialGameMatchesManifest(game, manifest);
      if (mismatch) return { ok: false, error: mismatch };
    }
    const createdJournal = game
      ? manifest.controlPolicy === "fixed-seat"
        ? createBattleJournal(game, {
          controllerBySeat: manifest.controllerBySeat,
          ...(manifest.experimentalContext ? { experimentalContext: manifest.experimentalContext } : {}),
          opponentKnowledgePolicy: manifest.opponentKnowledgePolicy,
        })
        : createBattleJournal(game)
      : null;
    if (createdJournal && !createdJournal.ok) {
      return failure("JOURNAL_REQUIRED", `初期Journalを安全に作成できません: ${createdJournal.error.message}`, "journal", createdJournal.error);
    }
    const journal = createdJournal?.ok ? createdJournal.value : null;
    const runtime: SessionRuntime = {
      format: "isdf-card-hero-session-archive",
      version: 1,
      manifest,
      journal,
      progress,
      game,
      ...(plan.branchSource ? { branchSource: freezeDeep(cloneJson(plan.branchSource)) } : {}),
    };
    return { ok: true, value: runtime };
  } catch (cause) {
    return failure("INVALID_PLAN", "セッション開始中に検証/初期化例外が発生しました。", undefined, cause);
  }
}

/**
 * Builds a fixed-seat v2 branch plan from a Worker-verified source cursor.
 * The original source remains immutable provenance; no source configuration is inferred from an unbound journal.
 */
export function createBattleBranchPlan(options: BattleBranchPlanOptions): SessionResult<SessionPlan> {
  try {
    const manifestResult = validateSessionManifest(options.sourceManifest, { allowEmptyDraftDecks: true });
    if (!manifestResult.ok) return { ok: false, error: { ...manifestResult.error, code: "INVALID_MANIFEST" } };
    const sourceManifest = manifestResult.value;
    const { sourceJournal, sourceCursor, verifiedSourceSnapshot } = options;
    if (!sourceJournal || sourceJournal.completeness.status !== "complete" ||
        !Number.isSafeInteger(sourceCursor) || sourceCursor < 0 || sourceCursor > sourceJournal.commands.length ||
        verifiedSourceSnapshot.cursor !== sourceCursor || verifiedSourceSnapshot.totalCommands !== sourceJournal.commands.length) {
      return failure("JOURNAL_MISMATCH", "branch source journal/cursorはWorker検証済みの完全履歴である必要があります。", "sourceJournal");
    }
    const expectedCursorHash = sourceCursor === 0 ? sourceJournal.initialHash : sourceJournal.commands[sourceCursor - 1]?.afterHash;
    const actualCursorHash = hashBattleState(verifiedSourceSnapshot.state);
    if (!expectedCursorHash || actualCursorHash !== expectedCursorHash) {
      return failure("JOURNAL_MISMATCH", "Worker verified snapshotが指定source cursorのhashと一致しません。", "verifiedSourceSnapshot");
    }
    if (!journalMatchesManifest(sourceJournal, sourceManifest)) {
      return failure("JOURNAL_MISMATCH", "source journal schema/context/controllerがsource manifestと一致しません。", "sourceJournal.metadata");
    }
    const branchSource: SessionBranchProvenance = {
      sourceSessionId: sourceManifest.id,
      sourceManifest,
      sourceJournal,
      sourceProgress: cloneJson(options.sourceProgress),
      sourceCursor,
      sourceHeadHash: actualCursorHash,
      ...(options.sourceBranchSource ? { sourceBranchSource: cloneJson(options.sourceBranchSource) } : {}),
    };
    const plan: SessionPlan = {
      kind: "battle",
      ...(options.id ? { id: options.id } : {}),
      ...(options.createdAt ? { createdAt: options.createdAt } : {}),
      seed: sourceManifest.seed,
      firstPlayer: sourceManifest.firstPlayer,
      profiles: { ...(options.profiles ?? sourceManifest.profiles) },
      masters: { ...sourceManifest.masters },
      decks: {
        player: cloneDeck(sourceManifest.decks.player),
        cpu: cloneDeck(sourceManifest.decks.cpu),
      },
      controllerBySeat: { ...options.controllerBySeat },
      opponentKnowledgePolicy: sourceManifest.opponentKnowledgePolicy,
      ...(sourceManifest.experimentalContext ? { experimentalContext: cloneJson(sourceManifest.experimentalContext) } : {}),
      branchSource,
    };
    const validation = validateSessionPlan(plan);
    return validation ? { ok: false, error: validation } : { ok: true, value: plan };
  } catch (cause) {
    return failure("INVALID_PLAN", "branch planの構築/検証に失敗しました。", undefined, cause);
  }
}

export function validateSessionPlan(plan: SessionPlan): SessionError | undefined {
  if (!isRecord(plan)) return error("INVALID_PLAN", "開始planがオブジェクトではありません。");
  if (!isSessionKind(plan.kind)) return error("UNSUPPORTED_SESSION", "未対応のセッション種別です。", "kind");
  if (!Number.isSafeInteger(plan.seed) || plan.seed < 0 || plan.seed > 999_999_999) {
    return error("INVALID_PLAN", "seedは0〜999999999の整数で指定してください。", "seed");
  }
  if (plan.firstPlayer !== "player" && plan.firstPlayer !== "cpu") {
    return error("INVALID_PLAN", "先攻seatが不正です。", "firstPlayer");
  }
  for (const seat of ["player", "cpu"] as const) {
    if (!CPU_AI_PROFILES.includes(plan.profiles?.[seat])) {
      return error("INVALID_PLAN", "AI profileが不正です。", `profiles.${seat}`);
    }
    if (plan.masters?.[seat] !== "white" && plan.masters?.[seat] !== "black") {
      return error("INVALID_PLAN", "Master設定が不正です。", `masters.${seat}`);
    }
    if (plan.controllerBySeat?.[seat] !== "human" && plan.controllerBySeat?.[seat] !== "cpu") {
      return error("INVALID_PLAN", "controller設定が不正です。", `controllerBySeat.${seat}`);
    }
    const deck = plan.decks?.[seat];
    if (!deck || !Array.isArray(deck.cardIds) || deck.cardIds.some((cardId) => typeof cardId !== "string" || !cardId.trim())) {
      return error("INVALID_PLAN", "deck snapshotのcard id列が不正です。", `decks.${seat}.cardIds`);
    }
    if (typeof deck.allowSpecial !== "boolean") {
      return error("INVALID_PLAN", "allowSpecialはbooleanで指定してください。", `decks.${seat}.allowSpecial`);
    }
    const allowsPrebattlePlaceholder = (plan.kind === "draft" || plan.kind === "sealed") && deck.cardIds.length === 0;
    if (!allowsPrebattlePlaceholder) {
      // Match existing rules: exact size/copy/special validity, without adding a new category-ratio rule.
      const deckSummary = summarizeDeckCardIds(deck.cardIds, [], { allowSpecial: deck.allowSpecial });
      if (!deckSummary.valid) return error("INVALID_PLAN", `deck snapshotが合法デッキではありません: ${deckSummary.errors.join(" / ")}`, `decks.${seat}.cardIds`);
    }
  }
  if (plan.kind === "local-pvp" && (plan.controllerBySeat.player !== "human" || plan.controllerBySeat.cpu !== "human")) {
    return error("INVALID_PLAN", "local PvPでは両seatをhuman controllerにしてください。", "controllerBySeat");
  }
  if (plan.kind === "daily") {
    if (!isJstCalendarDate(plan.dateJst)) return error("INVALID_PLAN", "Dailyの日付は実在するJST YYYY-MM-DDで指定してください。", "dateJst");
    if (plan.seed !== dailySeedForDateJst(plan.dateJst)) {
      return error("INVALID_PLAN", "Daily seedが開始時に捕捉したJST日付から導出した値と一致しません。", "seed");
    }
    if (!validDefinitionVersion(plan.challengeDefinition)) return error("INVALID_PLAN", "Daily challenge definitionが不正です。", "challengeDefinition");
  }
  if (plan.kind === "puzzle" && (!validId(plan.puzzleId) || !positiveVersion(plan.puzzleVersion))) {
    return error("INVALID_PLAN", "Puzzle id/versionが不正です。", "puzzleId");
  }
  if (plan.kind === "gauntlet" && (!validId(plan.gauntletId) || !positiveVersion(plan.gauntletVersion))) {
    return error("INVALID_PLAN", "Gauntlet id/versionが不正です。", "gauntletId");
  }
  if (plan.kind === "draft" && (!validId(plan.draftId) || !positiveVersion(plan.draftVersion))) {
    return error("INVALID_PLAN", "Draft id/versionが不正です。", "draftId");
  }
  if (plan.kind === "sealed" && (!validId(plan.sealedId) || !positiveVersion(plan.sealedVersion))) {
    return error("INVALID_PLAN", "Sealed id/versionが不正です。", "sealedId");
  }
  if (plan.kind === "experimental" && !isValidExperimentalContext(plan.experimentalContext)) {
    return error("UNSUPPORTED_SESSION", "experimental contextのschema/valueが未対応です。", "experimentalContext");
  }
  if (plan.kind === "battle" && plan.experimentalContext !== undefined &&
    (!plan.branchSource || !isValidExperimentalContext(plan.experimentalContext) ||
      !isRecord(plan.branchSource.sourceManifest) || !isEqualJson(plan.experimentalContext, plan.branchSource.sourceManifest.experimentalContext))) {
    return error("INVALID_PLAN", "battle branchのexperimental contextはsource manifestから保持してください。", "experimentalContext");
  }
  if (plan.kind !== "experimental" && plan.kind !== "battle" && "experimentalContext" in plan) {
    return error("INVALID_PLAN", "experimental contextはexperimental sessionまたはそのbranchでのみ指定できます。", "experimentalContext");
  }
  if (plan.branchSource !== undefined && (plan.kind !== "battle" || !isValidBranchSource(plan.branchSource))) {
    return error("INVALID_PLAN", "branch sourceは検証済みbattle branchにのみ指定できます。", "branchSource");
  }
  if (plan.kind === "battle" && plan.branchSource) {
    const source = plan.branchSource.sourceManifest;
    if (plan.seed !== source.seed || plan.firstPlayer !== source.firstPlayer ||
      !isEqualJson(plan.masters, source.masters) || !isEqualJson(plan.decks, source.decks) ||
      !isEqualJson(plan.experimentalContext, source.experimentalContext)) {
      return error("INVALID_PLAN", "branchはsourceのseed/firstPlayer/master/deck/実験rules contextを保持してください。", "branchSource");
    }
    if (plan.opponentKnowledgePolicy !== source.opponentKnowledgePolicy) {
      return error("INVALID_PLAN", "branchはsourceのopponent knowledge policyを明示保持してください。", "opponentKnowledgePolicy");
    }
  }
  if (plan.opponentKnowledgePolicy !== undefined && !["known_deck", "unknown_composition"].includes(plan.opponentKnowledgePolicy)) {
    return error("INVALID_PLAN", "opponent knowledge policyが不正です。", "opponentKnowledgePolicy");
  }
  const expectedKnowledge = plan.branchSource?.sourceManifest.opponentKnowledgePolicy ??
    (plan.kind === "draft" || plan.kind === "sealed" || plan.kind === "local-pvp" ? "unknown_composition" : "known_deck");
  if (plan.opponentKnowledgePolicy !== undefined && plan.opponentKnowledgePolicy !== expectedKnowledge) {
    return error("INVALID_PLAN", "opponent knowledge policyはsession kind/source manifestと一致させてください。", "opponentKnowledgePolicy");
  }
  if (plan.id !== undefined && !validId(plan.id)) return error("INVALID_PLAN", "session idが不正です。", "id");
  if (plan.createdAt !== undefined && !isIsoTimestamp(plan.createdAt)) return error("INVALID_PLAN", "createdAtはISO日時で指定してください。", "createdAt");
  return undefined;
}

export function dailySeedForDateJst(date: string): number {
  if (!isJstCalendarDate(date)) throw new RangeError("Daily date must be a real JST calendar date (YYYY-MM-DD).");
  let hash = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(`isdf-card-hero-daily-v1:${date}`)) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) % 1_000_000_000;
}

/** Capture this exactly once when a Daily session is started; never recompute it mid-battle. */
export function captureJstDate(now: Date = new Date()): string {
  if (!Number.isFinite(now.getTime())) throw new RangeError("Invalid clock value.");
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function isJstCalendarDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function makeInitialProgress(plan: SessionPlan): SessionProgress {
  switch (plan.kind) {
    case "daily":
      return { kind: "daily", status: "active", dateJst: plan.dateJst };
    case "puzzle":
      return { kind: "puzzle", puzzleId: plan.puzzleId, puzzleVersion: plan.puzzleVersion, status: "active", attempts: 0 };
    case "gauntlet":
      return { kind: "gauntlet", gauntletId: plan.gauntletId, gauntletVersion: plan.gauntletVersion, status: "active", stageIndex: 0, completedBattles: [] };
    case "draft":
      return { kind: "draft", draftId: plan.draftId, draftVersion: plan.draftVersion, status: "drafting", packIndex: 0, pickEvents: [] };
    case "sealed":
      return { kind: "sealed", sealedId: plan.sealedId, sealedVersion: plan.sealedVersion, status: "pool", poolBySeat: { player: [], cpu: [] } };
    case "local-pvp":
    case "experimental":
    case "battle":
      return { kind: plan.kind, status: "active" };
  }
}

function validateInitialGameMatchesManifest(game: GameState, manifest: SessionManifest): SessionError | undefined {
  if (!Number.isSafeInteger(game.randomSeed) || game.randomSeed !== manifest.seed) {
    return error("INVALID_PLAN", "初期GameState seedがmanifestと一致しません。", "game.randomSeed");
  }
  if (game.firstPlayer !== manifest.firstPlayer) return error("INVALID_PLAN", "初期GameStateのfirstPlayerがmanifestと一致しません。", "game.firstPlayer");
  const ids = ["player", "cpu"] as const;
  for (const seat of ids) {
    if (game.players[seat].masterId !== manifest.masters[seat]) {
      return error("INVALID_PLAN", "初期GameStateのMasterがmanifestと一致しません。", `game.players.${seat}.masterId`);
    }
    const remainingCards = [...game.players[seat].deck, ...game.players[seat].hand, ...game.players[seat].discard].map((card) => card.cardId);
    const boardMonsters = Object.values(game.slots).filter((slot) => slot.owner === seat && slot.monster);
    const expectedCounts = countValues(manifest.decks[seat].cardIds);
    const remainingCounts = countValues(remainingCards);
    for (const [cardId, count] of remainingCounts) {
      if ((expectedCounts.get(cardId) ?? 0) < count) {
        return error("INVALID_PLAN", "初期GameStateのzone cardがmanifest deckに存在しません。", `game.players.${seat}`);
      }
    }
    const unlocatedDeckCards = [...expectedCounts.entries()].reduce((total, [cardId, count]) => total + count - (remainingCounts.get(cardId) ?? 0), 0);
    if (unlocatedDeckCards !== boardMonsters.length || boardMonsters.some((slot) => !slot.monster || !getMonsterDef(slot.monster.cardId))) {
      return error("INVALID_PLAN", "初期盤面を含むGameStateのcard instance数がmanifest deckと整合しません。", `game.slots.${seat}`);
    }
  }
  return undefined;
}

/** A cursor branch starts from a verified historical state, not from a fresh deck/seed. */
function validateBranchInitialGame(game: GameState, source: import("./types").SessionBranchProvenance): SessionError | undefined {
  if (!validBranchSourceHead(source)) return error("INVALID_PLAN", "branch source cursor/hashがsource journalと一致しません。", "branchSource.sourceHeadHash");
  let actualHash: string;
  try {
    actualHash = hashBattleState(game);
  } catch (cause) {
    return { code: "INVALID_PLAN", message: "branch cursor stateのhash検証に失敗しました。", path: "game", cause };
  }
  if (actualHash !== source.sourceHeadHash) return error("INVALID_PLAN", "branch初期GameStateがWorker検証済みcursor hashと一致しません。", "game");
  return undefined;
}

function getChallengeDefinition(plan: SessionPlan): { id: string; version: number } | undefined {
  switch (plan.kind) {
    case "daily": return plan.challengeDefinition;
    case "puzzle": return { id: plan.puzzleId, version: plan.puzzleVersion };
    case "gauntlet": return { id: plan.gauntletId, version: plan.gauntletVersion };
    case "draft": return { id: plan.draftId, version: plan.draftVersion };
    case "sealed": return { id: plan.sealedId, version: plan.sealedVersion };
    default: return undefined;
  }
}

function requiresInitialBattle(kind: SessionPlan["kind"]): boolean {
  return kind !== "draft" && kind !== "sealed";
}

function isValidExperimentalContext(value: unknown): value is SessionExperimentContextV1 {
  return isExperimentContextV1(value);
}
function isValidBranchSource(value: unknown, depth = 0): boolean {
  if (!isRecord(value)) return false;
  if (!validId(value.sourceSessionId) || !isRecord(value.sourceManifest) || !isRecord(value.sourceJournal) || !isRecord(value.sourceProgress) ||
    !Number.isSafeInteger(value.sourceCursor) || Number(value.sourceCursor) < 0 ||
    typeof value.sourceHeadHash !== "string" || !/^dual32-v2:[0-9a-f]{16}$/.test(value.sourceHeadHash)) return false;
  if (depth >= 8) return false;
  if (value.sourceBranchSource !== undefined && !isValidBranchSource(value.sourceBranchSource, depth + 1)) return false;
  const sourceManifest = validateSessionManifest(value.sourceManifest, { allowEmptyDraftDecks: true });
  if (!sourceManifest.ok || sourceManifest.value.id !== value.sourceSessionId || value.sourceProgress.kind !== sourceManifest.value.kind) return false;
  const journal = value.sourceJournal;
  if (journal.format !== "isdf-card-hero-battle-journal" || !Array.isArray(journal.commands) ||
    Number(value.sourceCursor) > journal.commands.length) return false;
  return branchHashAtCursor(journal, Number(value.sourceCursor)) === value.sourceHeadHash;
}

function journalMatchesManifest(journal: BattleJournal, manifest: SessionManifest): boolean {
  if (journal.schemaVersion === 1) {
    return manifest.controlPolicy === "legacy-workspace" && journal.metadata === undefined && manifest.experimentalContext === undefined;
  }
  return journal.schemaVersion === 2 && manifest.controlPolicy === "fixed-seat" && journal.metadata !== undefined &&
    isEqualJson(journal.metadata.controllerBySeat, manifest.controllerBySeat) &&
    journal.metadata.opponentKnowledgePolicy === manifest.opponentKnowledgePolicy &&
    isEqualJson(journal.metadata.experimentalContext, manifest.experimentalContext);
}

function validBranchSourceHead(source: import("./types").SessionBranchProvenance): boolean {
  return isValidBranchSource(source);
}

function branchHashAtCursor(journal: Record<string, unknown>, cursor: number): string | undefined {
  if (!Array.isArray(journal.commands)) return undefined;
  if (cursor === 0) return typeof journal.initialHash === "string" ? journal.initialHash : undefined;
  const command = journal.commands[cursor - 1];
  return isRecord(command) && typeof command.afterHash === "string" ? command.afterHash : undefined;
}

function isEqualJson(left: unknown, right: unknown): boolean {
  try { return JSON.stringify(canonicalJsonValue(left)) === JSON.stringify(canonicalJsonValue(right)); } catch { return false; }
}
function canonicalJsonValue(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(canonicalJsonValue);
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(value as Record<string, unknown>).sort()) {
    result[key] = canonicalJsonValue((value as Record<string, unknown>)[key]);
  }
  return result;
}

function isSessionKind(value: unknown): value is SessionPlan["kind"] {
  return ["battle", "daily", "puzzle", "gauntlet", "draft", "sealed", "local-pvp", "experimental"].includes(String(value));
}
function validDefinitionVersion(value: { id: string; version: number }): boolean { return validId(value.id) && positiveVersion(value.version); }
function positiveVersion(value: unknown): value is number { return Number.isSafeInteger(value) && Number(value) > 0; }
function validId(value: unknown): value is string { return typeof value === "string" && value.length > 0 && value.length <= 128 && !hasControlCharacters(value); }
function hasControlCharacters(value: string): boolean { return Array.from(value).some((character) => character.charCodeAt(0) < 0x20 || character.charCodeAt(0) === 0x7f); }
function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = /^(\d{4})-(\d\d)-(\d\d)T/.exec(value);
  if (!match || !Number.isFinite(Date.parse(value))) return false;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}
function isRecord(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
function cloneDeck(deck: SessionPlan["decks"][PlayerId]): SessionPlan["decks"][PlayerId] {
  return { cardIds: [...deck.cardIds], allowSpecial: deck.allowSpecial, ...(deck.sourcePresetId ? { sourcePresetId: deck.sourcePresetId } : {}) };
}
function countValues(values: readonly string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}
function cloneJson<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function freezeDeep<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) freezeDeep(child);
  }
  return value;
}
function createSessionId(now: Date): string {
  const uuid = globalThis.crypto?.randomUUID?.();
  return `session-${now.toISOString().replace(/[:.]/g, "-")}-${uuid ?? Math.random().toString(36).slice(2, 12)}`;
}
function error(code: SessionError["code"], message: string, path?: string): SessionError { return { code, message, ...(path ? { path } : {}) }; }
function failure(code: SessionError["code"], message: string, path?: string, cause?: unknown): SessionResult<never> {
  return { ok: false, error: { code, message, ...(path ? { path } : {}), ...(cause !== undefined ? { cause } : {}) } };
}
