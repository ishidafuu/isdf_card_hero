import {
  hashBattleState,
  seekBattleJournal,
  seekBattleJournalAtCursors,
} from "../replay/battleJournal";
import type { BattleJournal, ReplaySnapshot } from "../replay/types";
import { createInitialGame } from "../game/rules";
import { dailySeedForDateJst, isJstCalendarDate } from "./plans";
import { createChallengeInitialGame, matchesGauntletStageInitialState, puzzleProgressMatchesVerifiedHead } from "./challenges";
import { createLimitedModeInitialGame, isValidDraftProgress, isValidSealedProgress, matchesLimitedManifestDecks } from "./limited";
import { SESSION_ARCHIVE_FORMAT, SESSION_ARCHIVE_VERSION, type SessionArchive, type SessionBattleResult, type SessionBranchProvenance, type SessionError, type SessionManifest, type SessionProgress, type SessionResult, type SessionRuntime } from "./types";
import { validateSessionManifest } from "./manifest";

export const MAX_SESSION_ARCHIVE_BYTES = 30_000_000;

export interface RestoreSessionDependencies {
  /** Required for challenge archives: rebuild the versioned, seed-bound legal starting position. */
  createInitialGame?: (manifest: SessionManifest, progress: SessionProgress) => SessionRuntime["game"];
  now?: () => Date;
}

export interface RestoreSessionOptions {
  /** Required for branch archives when caller already verified this cursor in the replay Worker. */
  verifiedBranchSourceHead?: ReplaySnapshot;
  /** Cursor snapshots for every provenance link, ordered from immediate source to root source. */
  verifiedBranchSourceHeads?: readonly { readonly cursor: ReplaySnapshot; readonly terminal: ReplaySnapshot }[];
  /** Worker-verified heads for every embedded completed/source journal, in archive traversal order. */
  verifiedEmbeddedHeads?: readonly ReplaySnapshot[];
}

export interface SessionArchiveReplayHeads {
  readonly currentHead: ReplaySnapshot | null;
  readonly branchSourceHead?: ReplaySnapshot;
  readonly branchSourceHeads?: readonly { readonly cursor: ReplaySnapshot; readonly terminal: ReplaySnapshot }[];
  readonly branchSourceEmbeddedHeads?: readonly (readonly ReplaySnapshot[])[];
  readonly embeddedHeads: readonly ReplaySnapshot[];
}

export interface VerifiedSessionArchive {
  readonly archive: SessionArchive;
  readonly replayHeads: SessionArchiveReplayHeads;
}

/** Validates the session envelope and policy binding. Journal transitions are verified by restore/export. */
export function validateSessionArchiveStructure(value: unknown): SessionResult<SessionArchive> {
  try {
    if (!isRecord(value)) return fail("INVALID_ARCHIVE", "session archiveはobjectである必要があります。");
    const allowed = ["format", "version", "manifest", "journal", "progress", "branchSource"];
    if (!hasOnlyKeys(value, allowed)) return fail("INVALID_ARCHIVE", "session archiveに未知または不正なfieldがあります。");
    if (value.format !== SESSION_ARCHIVE_FORMAT || value.version !== SESSION_ARCHIVE_VERSION) {
      return fail("UNSUPPORTED_VERSION", "未対応のsession archive format/versionです。");
    }
    const manifestResult = validateSessionManifest(value.manifest, { allowEmptyDraftDecks: true });
    if (!manifestResult.ok) return { ok: false, error: { ...manifestResult.error, code: "INVALID_MANIFEST" } };
    const manifest = manifestResult.value;
    if (value.journal !== null && !isJournalEnvelope(value.journal)) return fail("INVALID_ARCHIVE", "journal envelopeが不正です。", "journal");
    if (value.branchSource !== undefined && !isBranchEnvelope(value.branchSource)) return fail("INVALID_ARCHIVE", "branch provenanceが不正です。", "branchSource");
    if (value.branchSource && manifest.controlPolicy !== "fixed-seat") return fail("INVALID_ARCHIVE", "branch provenanceはfixed-seat manifestが必要です。", "manifest.controlPolicy");
    if (!isSessionProgress(value.progress, manifest)) return fail("INVALID_PROGRESS", "session progressがmanifestと整合しません。", "progress");
    const journal = value.journal as BattleJournal | null;
    for (const [path, nestedJournal] of nestedJournals(value.progress as SessionProgress)) {
      const pair = validateJournalManifestPair(nestedJournal, manifest);
      if (!pair.ok) return { ok: false, error: { ...pair.error, path: `${path}.metadata` } };
    }
    if (journal === null) {
      if (!canBePreBattle(manifest.kind, value.progress as SessionProgress)) return fail("INVALID_ARCHIVE", "対局必須のsessionでjournalが欠落しています。", "journal");
    } else {
      const policyResult = validateJournalManifestPair(journal, manifest);
      if (!policyResult.ok) return policyResult;
      if (value.branchSource) {
        const branchCheck = validateBranchCheckpoint(value.branchSource, manifest, journal);
        if (!branchCheck.ok) return branchCheck;
      }
    }
    return { ok: true, value: value as unknown as SessionArchive };
  } catch (cause) {
    return fail("INVALID_ARCHIVE", "session archiveのschema検証で例外が発生しました。", undefined, cause);
  }
}

/**
 * Drops the transient live `game` field from a SessionRuntime at the archive boundary.
 * Runtime state is derived from the verified journal and is never serialized as authority.
 */
export function getSessionArchiveEnvelope(runtime: SessionRuntime): SessionArchive {
  return {
    format: runtime.format,
    version: runtime.version,
    manifest: runtime.manifest,
    journal: runtime.journal,
    progress: runtime.progress,
    ...(runtime.branchSource ? { branchSource: runtime.branchSource } : {}),
  };
}

/** Explicit export is expensive by design: it replays and verifies the full journal first. */
export function serializeSessionArchive(value: SessionArchive | SessionRuntime): SessionResult<string> {
  try {
    const envelope = "game" in value ? getSessionArchiveEnvelope(value) : value;
    const validation = validateSessionArchiveStructure(envelope);
    if (!validation.ok) return validation;
    const archive = validation.value;
    const integrity = verifyAllArchiveJournals(archive);
    if (!integrity.ok) return integrity;
    const json = JSON.stringify(archive);
    if (new TextEncoder().encode(json).byteLength > MAX_SESSION_ARCHIVE_BYTES) return fail("SERIALIZATION_FAILED", "session archive JSONがサイズ上限を超えています。");
    return { ok: true, value: json };
  } catch (cause) {
    return fail("SERIALIZATION_FAILED", "session archiveをJSON化できませんでした。", undefined, cause);
  }
}

/** For autosaving an already-trusted live runtime only. Never use for import or user export. */
export function serializeTrustedSessionRuntime(runtime: SessionRuntime): SessionResult<string> {
  try {
    const envelope = getSessionArchiveEnvelope(runtime);
    const shape = validateSessionArchiveStructure(envelope);
    if (!shape.ok) return shape;
    const json = JSON.stringify(envelope);
    if (new TextEncoder().encode(json).byteLength > MAX_SESSION_ARCHIVE_BYTES) return fail("SERIALIZATION_FAILED", "session archive JSONがサイズ上限を超えています。");
    return { ok: true, value: json };
  } catch (cause) {
    return fail("SERIALIZATION_FAILED", "trusted session runtimeを保存用JSONにできませんでした。", undefined, cause);
  }
}

export function parseSessionArchiveEnvelope(json: string): SessionResult<SessionArchive> {
  try {
    if (typeof json !== "string") return fail("INVALID_ARCHIVE", "session archive inputは文字列ではありません。");
    if (new TextEncoder().encode(json).byteLength > MAX_SESSION_ARCHIVE_BYTES) return fail("SERIALIZATION_FAILED", "session archive JSONがサイズ上限を超えています。");
    let parsed: unknown;
    try { parsed = JSON.parse(json) as unknown; } catch (cause) { return fail("INVALID_ARCHIVE", "session archive JSONを解析できませんでした。", undefined, cause); }
    return validateSessionArchiveStructure(parsed);
  } catch (cause) {
    return fail("INVALID_ARCHIVE", "session archive parse中に例外が発生しました。", undefined, cause);
  }
}

export function restoreSessionArchive(value: unknown, dependencies: RestoreSessionDependencies = {}): SessionResult<SessionRuntime> {
  try {
    const verification = verifySessionArchiveReplayHeads(value);
    if (!verification.ok) return verification;
    return restoreSessionArchiveWithVerifiedHeads(verification.value.archive, verification.value.replayHeads, dependencies);
  } catch (cause) {
    return fail("INVALID_ARCHIVE", "session archive restore中に例外が発生しました。", undefined, cause);
  }
}

/** Uses a replay-Worker verified head and avoids running a second full replay on the UI thread. */
export function restoreSessionArchiveWithSnapshot(
  value: unknown,
  verifiedHead: ReplaySnapshot | null,
  dependencies: RestoreSessionDependencies = {},
  options: RestoreSessionOptions = {},
): SessionResult<SessionRuntime> {
  return restoreSessionArchiveWithVerifiedHeads(value, {
    currentHead: verifiedHead,
    ...(options.verifiedBranchSourceHead ? { branchSourceHead: options.verifiedBranchSourceHead } : {}),
    ...(options.verifiedBranchSourceHeads ? { branchSourceHeads: options.verifiedBranchSourceHeads } : {}),
    embeddedHeads: options.verifiedEmbeddedHeads ?? [],
  }, dependencies);
}

/** Replays every journal exactly once; intended to run in the journal Worker before UI restore. */
export function verifySessionArchiveReplayHeads(value: unknown): SessionResult<VerifiedSessionArchive> {
  try {
    const validation = validateSessionArchiveStructure(value);
    if (!validation.ok) return validation;
    const archive = validation.value;
    const currentHead = archive.journal ? seekCompleteHead(archive.journal, "journal") : null;
    if (currentHead && !currentHead.ok) return currentHead;
    let branchSourceHead: ReplaySnapshot | undefined;
    const branchSourceHeads: Array<{ cursor: ReplaySnapshot; terminal: ReplaySnapshot }> = [];
    const branchSourceEmbeddedHeads: ReplaySnapshot[][] = [];
    if (archive.branchSource) {
      for (const [index, source] of branchSourceChain(archive.branchSource).entries()) {
        const sourceHeads = seekCompleteCursorPair(source.sourceJournal, source.sourceCursor, `branchSource.${index}.sourceJournal`);
        if (!sourceHeads.ok) return sourceHeads;
        if (hashBattleState(sourceHeads.value.cursor.state) !== source.sourceHeadHash) return fail("JOURNAL_MISMATCH", "branch source cursor state hashが一致しません。", `branchSource.${index}.sourceHeadHash`);
        branchSourceHeads.push(sourceHeads.value);
        const nestedHeads: ReplaySnapshot[] = [];
        for (const [path, nestedJournal] of nestedJournals(source.sourceProgress)) {
          const head = seekCompleteHead(nestedJournal, `branchSource.${index}.sourceProgress.${path}`);
          if (!head.ok) return head;
          nestedHeads.push(head.value);
        }
        branchSourceEmbeddedHeads.push(nestedHeads);
      }
      branchSourceHead = branchSourceHeads[0].cursor;
    }
    const embeddedHeads: ReplaySnapshot[] = [];
    for (const [path, journal] of nestedJournals(archive.progress)) {
      const head = seekCompleteHead(journal, path);
      if (!head.ok) return head;
      embeddedHeads.push(head.value);
    }
    const replayHeads = {
      currentHead: currentHead?.ok ? currentHead.value : null,
      ...(branchSourceHead ? { branchSourceHead, branchSourceHeads, branchSourceEmbeddedHeads } : {}),
      embeddedHeads,
    };
    const semantics = validateArchiveReplaySemantics(archive, replayHeads);
    if (!semantics.ok) return semantics;
    return { ok: true, value: { archive, replayHeads } };
  } catch (cause) {
    return fail("JOURNAL_MISMATCH", "session archive replay head検証中に例外が発生しました。", undefined, cause);
  }
}

/** Installs an archive only after a Worker verified every current/embedded/source journal head. */
export function restoreSessionArchiveWithVerifiedHeads(
  value: unknown,
  replayHeads: SessionArchiveReplayHeads,
  dependencies: RestoreSessionDependencies = {},
): SessionResult<SessionRuntime> {
  try {
    const validation = validateSessionArchiveStructure(value);
    if (!validation.ok) return validation;
    const archive = validation.value;
    if (archive.journal
      ? !replayHeads.currentHead || !matchesJournalHead(archive.journal, replayHeads.currentHead)
      : replayHeads.currentHead !== null) {
      return fail("JOURNAL_MISMATCH", "Worker current headがarchive journalの有無/末尾cursor/hashと一致しません。", "journal");
    }
    const embedded = nestedJournals(archive.progress);
    if (embedded.length !== replayHeads.embeddedHeads.length || embedded.some(([_, journal], index) => !matchesJournalHead(journal, replayHeads.embeddedHeads[index]))) {
      return fail("JOURNAL_MISMATCH", "embedded result/source journalは各Worker verified headが必要です。", "progress");
    }
    if (archive.branchSource) {
      const chain = branchSourceChain(archive.branchSource);
      const verified = replayHeads.branchSourceHeads;
      if (!verified || verified.length !== chain.length || chain.some((source, index) => !matchesCursor(source, verified[index]?.cursor))) {
        return fail("JOURNAL_MISMATCH", "Workerで検証したbranch source cursor chainが不在または一致しません。", "branchSource");
      }
      if (replayHeads.branchSourceEmbeddedHeads && replayHeads.branchSourceEmbeddedHeads.length !== chain.length) {
        return fail("JOURNAL_MISMATCH", "Workerで検証したbranch source embedded heads chainが不正です。", "branchSource");
      }
    } else if (replayHeads.branchSourceHead || replayHeads.branchSourceHeads?.length) {
      return fail("JOURNAL_MISMATCH", "archiveにbranch sourceがないのにWorker source headがあります。", "branchSource");
    }
    const semantics = validateArchiveReplaySemantics(archive, replayHeads, dependencies);
    if (!semantics.ok) return semantics;
    const game = replayHeads.currentHead ? structuredClone(replayHeads.currentHead.state) : null;
    return { ok: true, value: immutableRestoredRuntime(archive, game) };
  } catch (cause) {
    return fail("INVALID_ARCHIVE", "Worker snapshot restore中のvalidation/cloneで例外が発生しました。", undefined, cause);
  }
}

function validateArchiveReplaySemantics(
  archive: SessionArchive,
  replayHeads: SessionArchiveReplayHeads,
  dependencies: RestoreSessionDependencies = {},
): SessionResult<void> {
  const game = replayHeads.currentHead?.state ?? null;
  const progress = validateProgressAgainstHead(archive.progress, game, archive.journal, replayHeads.embeddedHeads);
  if (!progress.ok) return progress;
  if ((archive.progress.kind === "draft" || archive.progress.kind === "sealed") &&
      !matchesLimitedManifestDecks(archive.manifest, archive.progress)) {
    return fail("INVALID_PROGRESS", "limited battle manifest deckがpick/Sealed pool選択と一致しません。", "manifest.decks");
  }
  const limitedResultJournal = archive.progress.kind === "draft" ? archive.progress.result?.journal : null;
  const limitedJournal = archive.journal ?? limitedResultJournal;
  if ((archive.progress.kind === "draft" || archive.progress.kind === "sealed") && limitedJournal) {
    const expected = createLimitedModeInitialGame(archive.manifest, archive.progress);
    if (!expected || limitedJournal.initialState.winner || hashBattleState(expected) !== limitedJournal.initialHash) {
      return fail("JOURNAL_MISMATCH", "limited battle initial stateがimmutable seed/master/deck/pool選択から再構築した盤面と一致しません。", "journal.initialState");
    }
  }
  const initial = validateChallengeInitialState(archive, dependencies);
  if (!initial.ok) return initial;
  if (archive.branchSource) {
    const chain = branchSourceChain(archive.branchSource);
    const heads = replayHeads.branchSourceHeads;
    if (!heads || heads.length !== chain.length) return fail("JOURNAL_MISMATCH", "branch source全chainのWorker headが必要です。", "branchSource");
    const embeddedGroups = replayHeads.branchSourceEmbeddedHeads ?? [];
    if (embeddedGroups.length !== chain.length) return fail("JOURNAL_MISMATCH", "branch source embedded head groupsが必要です。", "branchSource");
    for (const [index, source] of chain.entries()) {
      const manifest = validateSessionManifest(source.sourceManifest, { allowEmptyDraftDecks: true });
      if (!manifest.ok) return { ok: false, error: { ...manifest.error, code: "INVALID_MANIFEST" } };
      const head = heads[index];
      if (!head || !matchesCursor(source, head.cursor) || !matchesJournalHead(source.sourceJournal, head.terminal)) {
        return fail("JOURNAL_MISMATCH", "branch source cursor/terminal Worker snapshotがjournalと一致しません。", `branchSource.${index}`);
      }
      const selectedGauntletEmbeddedBattle = source.sourceProgress.kind === "gauntlet" &&
        source.sourceProgress.completedBattles.some((battle) => sameJson(battle.journal, source.sourceJournal));
      const completedEmbeddedOnly = (source.sourceProgress.kind === "draft" && source.sourceProgress.status === "completed") ||
        selectedGauntletEmbeddedBattle;
      if (source.sourceProgress.kind === "draft" && source.sourceProgress.status === "completed" &&
          !sameJson(source.sourceProgress.result?.journal, source.sourceJournal)) {
        return fail("JOURNAL_MISMATCH", "completed Draft branch sourceは保存済みresult journalそのものを参照してください。", `branchSource.${index}.sourceJournal`);
      }
      if (source.sourceProgress.kind === "gauntlet" && source.sourceProgress.status === "completed" &&
          !source.sourceProgress.completedBattles.some((battle) => sameJson(battle.journal, source.sourceJournal))) {
        return fail("JOURNAL_MISMATCH", "completed Gauntlet branch sourceは保存済みstage journalを参照してください。", `branchSource.${index}.sourceJournal`);
      }
      const progress = completedEmbeddedOnly
        ? validateProgressAgainstHead(source.sourceProgress, null, null, embeddedGroups[index], true)
        : validateProgressAgainstHead(source.sourceProgress, head.terminal.state, source.sourceJournal, embeddedGroups[index]);
      if (!progress.ok) return progress;
      if ((source.sourceProgress.kind === "draft" || source.sourceProgress.kind === "sealed") &&
          !matchesLimitedManifestDecks(manifest.value, source.sourceProgress)) {
        return fail("INVALID_PROGRESS", "branch source limited deckとpick/poolの記録が一致しません。", `branchSource.${index}.sourceProgress`);
      }
      if (source.sourceProgress.kind === "puzzle" &&
          !puzzleProgressMatchesVerifiedHead(source.sourceProgress.puzzleId, source.sourceProgress, source.sourceJournal, head.terminal.state)) {
        return fail("INVALID_PROGRESS", "branch source Puzzle progressがverified terminalと一致しません。", `branchSource.${index}.sourceProgress`);
      }
      if (source.sourceProgress.kind === "gauntlet") {
        for (const [stageIndex, completed] of source.sourceProgress.completedBattles.entries()) {
          if (!matchesGauntletStageInitialState(manifest.value, stageIndex, completed.journal.initialState)) {
            return fail("JOURNAL_MISMATCH", "branch source Gauntlet stageがcanonical initializerと一致しません。", `branchSource.${index}.sourceProgress.completedBattles.${stageIndex}`);
          }
        }
      }
    }
  }
  if (archive.progress.kind === "gauntlet") {
    for (const [path, journal] of nestedJournals(archive.progress)) {
      const stageIndex = Number(path.match(/completedBattles\.(\d+)/)?.[1]);
      if (!matchesGauntletStageInitialState(archive.manifest, stageIndex, journal.initialState)) {
        return fail("JOURNAL_MISMATCH", "Gauntlet completed journal initial stateがversioned stage seed/deck/master/先攻と一致しません。", path);
      }
    }
  }
  if (archive.progress.kind === "puzzle" && archive.journal &&
    !puzzleProgressMatchesVerifiedHead(archive.progress.puzzleId, archive.progress, archive.journal, replayHeads.currentHead?.state ?? archive.journal.initialState)) {
    return fail("INVALID_PROGRESS", "Puzzleのactive/solved/failed statusがverified journal上の実操作と一致しません。", "progress.status");
  }
  return { ok: true, value: undefined };
}

function seekCompleteHead(journal: BattleJournal, path: string): SessionResult<ReplaySnapshot> {
  if (journal.completeness.status !== "complete") return fail("JOURNAL_MISMATCH", "不完全なjournalはsession restoreできません。", path);
  const result = seekBattleJournal(journal, journal.commands.length);
  return result.ok ? result : fail("JOURNAL_MISMATCH", result.error.message, path, result.error);
}

function seekCompleteCursorPair(journal: BattleJournal, cursor: number, path: string): SessionResult<{ cursor: ReplaySnapshot; terminal: ReplaySnapshot }> {
  if (journal.completeness.status !== "complete") return fail("JOURNAL_MISMATCH", "不完全なbranch source journalは復帰できません。", path);
  const result = seekBattleJournalAtCursors(journal, [cursor, journal.commands.length]);
  if (!result.ok) return fail("JOURNAL_MISMATCH", result.error.message, path, result.error);
  const cursorSnapshot = result.value.get(cursor);
  const terminal = result.value.get(journal.commands.length);
  return cursorSnapshot && terminal
    ? { ok: true, value: { cursor: cursorSnapshot, terminal } }
    : fail("JOURNAL_MISMATCH", "branch source cursor/terminal snapshotが不足しています。", path);
}

function immutableRestoredRuntime(archive: SessionArchive, game: SessionRuntime["game"]): SessionRuntime {
  const frozen = structuredClone({
    manifest: archive.manifest,
    journal: archive.journal,
    progress: archive.progress,
    ...(archive.branchSource ? { branchSource: archive.branchSource } : {}),
  });
  freezeDeep(frozen);
  return {
    format: archive.format,
    version: archive.version,
    ...frozen,
    game,
  };
}

function freezeDeep<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) freezeDeep(child);
  }
  return value;
}

function validateJournalManifestPair(journal: BattleJournal, manifest: SessionManifest): SessionResult<void> {
  const isV1 = journal.schemaVersion === 1;
  if ((manifest.controlPolicy === "legacy-workspace") !== isV1) return fail("JOURNAL_MISMATCH", "journal schemaとmanifest controlPolicyが一致しません。", "journal.schemaVersion");
  if (isV1) {
    if (journal.metadata !== undefined || manifest.experimentalContext !== undefined) return fail("JOURNAL_MISMATCH", "v1 journalはsession v2 contextを保持できません。", "journal.metadata");
    return { ok: true, value: undefined };
  }
  const metadata = journal.metadata;
  if (!metadata || !sameJson(metadata.controllerBySeat, manifest.controllerBySeat) ||
    metadata.opponentKnowledgePolicy !== manifest.opponentKnowledgePolicy ||
    !sameJson(metadata.experimentalContext, manifest.experimentalContext)) {
    return fail("JOURNAL_MISMATCH", "v2 journal metadataがimmutable manifestと一致しません。", "journal.metadata");
  }
  return { ok: true, value: undefined };
}

function validateBranchCheckpoint(source: unknown, manifest: SessionManifest, journal: BattleJournal, depth = 0): SessionResult<void> {
  if (depth >= 8) return fail("INVALID_ARCHIVE", "branch provenance chainの上限8を超えています。", "branchSource.sourceBranchSource");
  if (!isRecord(source) || !isRecord(source.sourceManifest) || !isRecord(source.sourceJournal)) return fail("INVALID_ARCHIVE", "branch provenance envelopeが不正です.", "branchSource");
  const sourceManifest = validateSessionManifest(source.sourceManifest, { allowEmptyDraftDecks: true });
  if (!sourceManifest.ok) return { ok: false, error: { ...sourceManifest.error, code: "INVALID_ARCHIVE" } };
  if (!isSessionProgress(source.sourceProgress, sourceManifest.value)) return fail("INVALID_PROGRESS", "branch source progressがsource manifestと一致しません。", "branchSource.sourceProgress");
  const sourceJournal = source.sourceJournal as unknown as BattleJournal;
  const sourceJournalManifestCheck = validateJournalManifestPair(sourceJournal, sourceManifest.value);
  if (!sourceJournalManifestCheck.ok) return sourceJournalManifestCheck;
  if (source.sourceBranchSource !== undefined) {
    const parent = validateBranchCheckpoint(source.sourceBranchSource, sourceManifest.value, sourceJournal, depth + 1);
    if (!parent.ok) return parent;
  } else {
    const initial = validateBranchSourceInitial(source as unknown as SessionBranchProvenance, sourceManifest.value);
    if (!initial.ok) return initial;
  }
  const cursor = source.sourceCursor as number;
  const cursorHash = cursor === 0 ? sourceJournal.initialHash : sourceJournal.commands[cursor - 1]?.afterHash;
  if (source.sourceSessionId !== sourceManifest.value.id || cursorHash !== source.sourceHeadHash ||
    manifest.seed !== sourceManifest.value.seed || manifest.firstPlayer !== sourceManifest.value.firstPlayer ||
    !sameJson(manifest.masters, sourceManifest.value.masters) || !sameJson(manifest.decks, sourceManifest.value.decks) ||
    !sameJson(manifest.experimentalContext, sourceManifest.value.experimentalContext) ||
    manifest.opponentKnowledgePolicy !== sourceManifest.value.opponentKnowledgePolicy ||
    journal.initialHash !== source.sourceHeadHash) {
    return fail("JOURNAL_MISMATCH", "branch checkpointまたは保持対象の元manifest設定が一致しません。", "branchSource");
  }
  return { ok: true, value: undefined };
}

function validateBranchSourceInitial(source: SessionBranchProvenance, manifest: SessionManifest): SessionResult<void> {
  if (source.sourceBranchSource) return { ok: true, value: undefined };
  if (source.sourceProgress.kind === "gauntlet") {
    const stageIndex = source.sourceProgress.completedBattles.findIndex((battle) => sameJson(battle.journal, source.sourceJournal));
    if (stageIndex >= 0) {
      if (!matchesGauntletStageInitialState(manifest, stageIndex, source.sourceJournal.initialState)) {
        return fail("JOURNAL_MISMATCH", "Gauntlet embedded source journalはversioned stage initial stateに一致しません。", "branchSource.sourceJournal.initialState");
      }
      return { ok: true, value: undefined };
    }
    if (source.sourceProgress.status === "completed") {
      return fail("JOURNAL_MISMATCH", "completed Gauntlet source journalは保存済みstage履歴にありません。", "branchSource.sourceJournal");
    }
  }
  const sourceArchive: SessionArchive = {
    format: SESSION_ARCHIVE_FORMAT,
    version: SESSION_ARCHIVE_VERSION,
    manifest,
    journal: source.sourceJournal,
    progress: source.sourceProgress,
  };
  return validateChallengeInitialState(sourceArchive, {});
}

function validateChallengeInitialState(archive: SessionArchive, dependencies: RestoreSessionDependencies): SessionResult<void> {
  if (!archive.journal || archive.branchSource) return { ok: true, value: undefined };
  try {
    const expected = dependencies.createInitialGame
      ? dependencies.createInitialGame(archive.manifest, archive.progress)
      : ["battle", "local-pvp", "experimental"].includes(archive.manifest.kind)
        ? createInitialGame(archive.manifest.seed, {
          firstPlayer: archive.manifest.firstPlayer,
          masterIds: archive.manifest.masters,
          playerDeckCardIds: [...archive.manifest.decks.player.cardIds],
          cpuDeckCardIds: [...archive.manifest.decks.cpu.cardIds],
          allowSpecialDecks: { player: archive.manifest.decks.player.allowSpecial, cpu: archive.manifest.decks.cpu.allowSpecial },
          trackEventLog: archive.journal.initialState.eventLog !== undefined,
        })
        : archive.manifest.kind === "draft" || archive.manifest.kind === "sealed"
          ? createLimitedModeInitialGame(archive.manifest, archive.progress)
          : createChallengeInitialGame(archive.manifest, archive.progress);
    if (!expected) return fail("INVALID_ARCHIVE", "challenge復帰にはversioned definition/seedから初期盤面を再構築するinitializerが必要です。", "journal.initialState");
    if (!expected || expected.winner || archive.journal.initialState.winner ||
      hashBattleState(expected) !== archive.journal.initialHash) {
      return fail("JOURNAL_MISMATCH", "challenge初期journalがversioned initializerのseed/deck/master/rules contextと一致しません。", "journal.initialState");
    }
    return { ok: true, value: undefined };
  } catch (cause) {
    return fail("INVALID_ARCHIVE", "challenge初期盤面の再構築に失敗しました。", "journal.initialState", cause);
  }
}

function validateProgressAgainstHead(progress: SessionProgress, game: SessionRuntime["game"], journal: BattleJournal | null, embeddedHeads?: readonly ReplaySnapshot[], allowEmbeddedGauntletSourceWithoutCurrentBattle = false): SessionResult<void> {
  if (progress.kind === "puzzle") return { ok: true, value: undefined };
  if (progress.kind === "draft") {
    if (progress.status === "completed") {
      const snapshot = embeddedHeads?.[0];
      if (journal || game || !progress.result) return fail("INVALID_PROGRESS", "completed Draftはcurrent battleを持たずembedded resultが必要です。", "progress.result");
      if (embeddedHeads && !snapshot) return fail("JOURNAL_MISMATCH", "Draft embedded worker headが不足しています。", "progress.result.journal");
      const replay = snapshot
        ? matchesJournalHead(progress.result.journal, snapshot) ? { ok: true as const, value: snapshot } : { ok: false as const }
        : seekBattleJournal(progress.result.journal, progress.result.journal.commands.length);
      if (!replay.ok || !matchesResult(progress.result.result, replay.value.state, progress.result.journal)) return fail("INVALID_PROGRESS", "Draft resultがcompleted journalと一致しません。", "progress.result");
    } else if (progress.status === "battle") {
      if (!journal || !game || progress.result) return fail("INVALID_PROGRESS", "battle statusにはresultを持たないcurrent journal/headが必要です。", "progress.status");
    } else if (journal || game || progress.result) {
      return fail("INVALID_PROGRESS", "Draft preparation状態はcurrent battle/resultを持てません。", "progress.status");
    }
    return { ok: true, value: undefined };
  }
  if (progress.kind === "sealed") {
    if (progress.status === "completed") {
      if (!progress.result || !journal || !game || !matchesResult(progress.result, game, journal)) return fail("INVALID_PROGRESS", "completed Sealed resultがverified journal headと一致しません。", "progress.result");
    } else if (progress.status === "battle") {
      if (!journal || !game || progress.result) return fail("INVALID_PROGRESS", "battle Sealedにはresultを持たないcurrent journal/headが必要です。", "progress.status");
    } else if (journal || game || progress.result) return fail("INVALID_PROGRESS", "Sealed deck preparation状態はcurrent battle/resultを持てません。", "progress.status");
    return { ok: true, value: undefined };
  }
  if (progress.kind === "gauntlet") {
    if (progress.stageIndex !== progress.completedBattles.length) return fail("INVALID_PROGRESS", "Gauntlet stageIndexは保存済みcompleted battle数と一致する必要があります。", "progress.stageIndex");
    for (const [index, completed] of progress.completedBattles.entries()) {
      const snapshot = embeddedHeads?.[index];
      if (embeddedHeads && !snapshot) return fail("JOURNAL_MISMATCH", "Gauntlet embedded worker headが不足しています。", `progress.completedBattles.${index}`);
      const replay = snapshot
        ? matchesJournalHead(completed.journal, snapshot) ? { ok: true as const, value: snapshot } : { ok: false as const }
        : seekBattleJournal(completed.journal, completed.journal.commands.length);
      if (!replay.ok || !matchesResult(completed.result, replay.value.state, completed.journal)) return fail("INVALID_PROGRESS", `Gauntlet completed battle ${index + 1} がjournal headと一致しません。`, `progress.completedBattles.${index}`);
    }
    if (progress.status === "completed") {
      if (journal || game || progress.stageIndex !== 3) return fail("INVALID_PROGRESS", "完了Gauntletには3つのcompleted battle履歴が必要でcurrent battleは残せません。", "progress");
    } else if (!journal || !game) {
      const validEmbeddedSource = allowEmbeddedGauntletSourceWithoutCurrentBattle && progress.status === "active" && progress.stageIndex > 0 && !journal && !game;
      if (!validEmbeddedSource) return fail("INVALID_PROGRESS", "active Gauntletには現在対局のjournal/headが必要です。", "journal");
    }
    return { ok: true, value: undefined };
  }
  if (progress.kind === "daily" && (typeof progress.dateJst !== "string" || dailySeedForDateJst(progress.dateJst) !== journal?.initialState.randomSeed)) {
    return fail("INVALID_PROGRESS", "Daily dateとjournal initial seedが一致しません。", "progress.dateJst");
  }
  if (progress.status === "completed") {
    if (!progress.result || !journal || !game || !matchesResult(progress.result, game, journal)) return fail("INVALID_PROGRESS", "completed resultがverified journal headと一致しません。", "progress.result");
  } else if (progress.result !== undefined) return fail("INVALID_PROGRESS", "active sessionに完了resultは設定できません。", "progress.result");
  return { ok: true, value: undefined };
}

function matchesResult(result: SessionBattleResult, game: NonNullable<SessionRuntime["game"]>, journal: BattleJournal): boolean {
  const headHash = journal.commands.at(-1)?.afterHash ?? journal.initialHash;
  return game.winner === result.winner && result.headHash === headHash && Number.isSafeInteger(result.turns) &&
    result.turns === game.turnNumber && isIsoTimestamp(result.completedAt);
}

function matchesJournalHead(journal: BattleJournal, snapshot: ReplaySnapshot): boolean {
  if (!snapshot || !Number.isSafeInteger(snapshot.cursor) || !Number.isSafeInteger(snapshot.totalCommands) ||
    snapshot.cursor !== journal.commands.length || snapshot.totalCommands !== journal.commands.length) return false;
  const expected = journal.commands.at(-1)?.afterHash ?? journal.initialHash;
  return hashBattleState(snapshot.state) === expected;
}

function isSessionProgress(value: unknown, manifest: SessionManifest): value is SessionProgress {
  if (!isRecord(value) || value.kind !== manifest.kind) return false;
  switch (value.kind) {
    case "battle": case "local-pvp": case "experimental": case "daily":
      if (!hasOnlyKeys(value, ["kind", "status", "dateJst", "result"]) || !["active", "completed"].includes(String(value.status))) return false;
      if (value.kind === "daily" && (!isJstCalendarDate(value.dateJst) || dailySeedForDateJst(value.dateJst) !== manifest.seed)) return false;
      if (value.kind !== "daily" && value.dateJst !== undefined) return false;
      return value.status === "completed" ? isBattleResult(value.result) : value.result === undefined;
    case "puzzle":
      return hasOnlyKeys(value, ["kind", "puzzleId", "puzzleVersion", "status", "attempts"]) &&
        value.puzzleId === manifest.challengeDefinition?.id && value.puzzleVersion === manifest.challengeDefinition?.version &&
        ["ready", "active", "solved", "failed"].includes(String(value.status)) && Number.isSafeInteger(value.attempts) && Number(value.attempts) >= 0;
    case "gauntlet":
      return hasOnlyKeys(value, ["kind", "gauntletId", "gauntletVersion", "status", "stageIndex", "completedBattles"]) &&
        value.gauntletId === manifest.challengeDefinition?.id && value.gauntletVersion === manifest.challengeDefinition?.version &&
        ["active", "completed"].includes(String(value.status)) && Number.isSafeInteger(value.stageIndex) && Number(value.stageIndex) >= 0 &&
        Array.isArray(value.completedBattles) && value.completedBattles.every(isCompletedBattle);
    case "draft":
      return hasOnlyKeys(value, ["kind", "draftId", "draftVersion", "status", "packIndex", "pickEvents", "selectedDeckBySeat", "result"]) &&
        value.draftId === manifest.challengeDefinition?.id && value.draftVersion === manifest.challengeDefinition?.version &&
        ["drafting", "deckReady", "battle", "completed"].includes(String(value.status)) && Number.isSafeInteger(value.packIndex) &&
        Array.isArray(value.pickEvents) && value.pickEvents.length <= 60 && value.pickEvents.every(isDraftPick) &&
        (value.selectedDeckBySeat === undefined || isDeckBySeat(value.selectedDeckBySeat)) &&
        (value.result === undefined || (isRecord(value.result) && isRecord(value.result.result) && isBattleResult(value.result.result) && isJournalEnvelope(value.result.journal))) &&
        (value.status !== "completed" || value.result !== undefined) &&
        (value.status !== "battle" || (value.selectedDeckBySeat !== undefined && value.selectedDeckBySeat !== null)) &&
        isValidDraftProgress(manifest, value as unknown as import("./types").DraftSessionProgress);
    case "sealed":
      return hasOnlyKeys(value, ["kind", "sealedId", "sealedVersion", "status", "poolBySeat", "selectedDeckBySeat", "result"]) &&
        value.sealedId === manifest.challengeDefinition?.id && value.sealedVersion === manifest.challengeDefinition?.version &&
        ["pool", "deckbuilding", "deckReady", "battle", "completed"].includes(String(value.status)) && isSealedPools(value.poolBySeat) &&
        (value.selectedDeckBySeat === undefined || isDeckBySeat(value.selectedDeckBySeat)) &&
        (value.result === undefined || isBattleResult(value.result)) &&
        isValidSealedProgress(manifest, value as unknown as import("./types").SealedSessionProgress);
    default: return false;
  }
}

function canBePreBattle(kind: SessionManifest["kind"], progress: SessionProgress): boolean {
  return (kind === "draft" && progress.kind === "draft" && progress.status === "drafting") ||
    (kind === "draft" && progress.kind === "draft" && progress.status === "deckReady") ||
    (kind === "draft" && progress.kind === "draft" && progress.status === "completed") ||
    (kind === "gauntlet" && progress.kind === "gauntlet" && progress.status === "completed" && progress.stageIndex === 3) ||
    (kind === "sealed" && progress.kind === "sealed" && ["pool", "deckbuilding", "deckReady"].includes(progress.status));
}
function isJournalEnvelope(value: unknown): value is BattleJournal {
  if (!isRecord(value) || value.format !== "isdf-card-hero-battle-journal" ||
    (value.schemaVersion !== 1 && value.schemaVersion !== 2) || value.rulesVersion !== 1 || !isRecord(value.initialState) ||
    typeof value.initialHash !== "string" || !Array.isArray(value.commands) || !isRecord(value.completeness)) return false;
  return value.commands.every((command) => isRecord(command) && typeof command.afterHash === "string");
}
function nestedJournals(progress: SessionProgress): Array<[string, BattleJournal]> {
  if (progress.kind === "gauntlet") return progress.completedBattles.map((battle, index) => [`progress.completedBattles.${index}.journal`, battle.journal]);
  if (progress.kind === "draft" && progress.result) return [["progress.result.journal", progress.result.journal]];
  return [];
}
function verifyAllArchiveJournals(archive: SessionArchive): SessionResult<void> {
  const result = verifySessionArchiveReplayHeads(archive);
  return result.ok ? { ok: true, value: undefined } : result;
}
function isBranchEnvelope(value: unknown, depth = 0): boolean {
  return depth < 8 && isRecord(value) && hasOnlyKeys(value, ["sourceSessionId", "sourceManifest", "sourceJournal", "sourceProgress", "sourceCursor", "sourceHeadHash", "sourceBranchSource"]) &&
    typeof value.sourceSessionId === "string" && isRecord(value.sourceManifest) && isJournalEnvelope(value.sourceJournal) && isRecord(value.sourceProgress) &&
    (value.sourceBranchSource === undefined || isBranchEnvelope(value.sourceBranchSource, depth + 1)) &&
    Number.isSafeInteger(value.sourceCursor) && Number(value.sourceCursor) >= 0 && Number(value.sourceCursor) <= (value.sourceJournal as BattleJournal).commands.length &&
    typeof value.sourceHeadHash === "string";
}
function branchSourceChain(source: SessionBranchProvenance): SessionBranchProvenance[] {
  const chain: SessionBranchProvenance[] = [];
  let current: SessionBranchProvenance | undefined = source;
  while (current) {
    if (chain.length >= 8) throw new Error("branch provenance chain exceeds maximum depth 8");
    chain.push(current);
    current = current.sourceBranchSource;
  }
  return chain;
}
function matchesCursor(source: SessionBranchProvenance, snapshot: ReplaySnapshot | undefined): boolean {
  return !!snapshot && snapshot.cursor === source.sourceCursor && snapshot.totalCommands === source.sourceJournal.commands.length &&
    hashBattleState(snapshot.state) === source.sourceHeadHash;
}
function isCompletedBattle(value: unknown): boolean {
  return isRecord(value) && hasOnlyKeys(value, ["journal", "result"]) && isJournalEnvelope(value.journal) && isBattleResult(value.result);
}
function isBattleResult(value: unknown): value is SessionBattleResult {
  return isRecord(value) && hasOnlyKeys(value, ["winner", "turns", "completedAt", "headHash"]) &&
    (value.winner === "player" || value.winner === "cpu" || value.winner === "draw") && Number.isSafeInteger(value.turns) && Number(value.turns) >= 0 &&
    isIsoTimestamp(value.completedAt) && typeof value.headHash === "string" && /^dual32-v2:[0-9a-f]{16}$/.test(value.headHash);
}
function isDraftPick(value: unknown): boolean {
  return isRecord(value) && hasOnlyKeys(value, ["sequence", "packIndex", "picker", "pickId", "cardId", "passedPackTo"]) &&
    Number.isSafeInteger(value.sequence) && Number(value.sequence) > 0 && Number.isSafeInteger(value.packIndex) && Number(value.packIndex) >= 0 &&
    (value.picker === "player" || value.picker === "cpu") && typeof value.pickId === "string" && typeof value.cardId === "string" &&
    (value.passedPackTo === undefined || value.passedPackTo === "player" || value.passedPackTo === "cpu");
}
function isDeckBySeat(value: unknown): boolean {
  return isRecord(value) && hasOnlyKeys(value, ["player", "cpu"]) && ["player", "cpu"].every((seat) => Array.isArray(value[seat]) && value[seat].length <= 60 && value[seat].every((id) => typeof id === "string"));
}
function isSealedPools(value: unknown): boolean {
  return isRecord(value) && hasOnlyKeys(value, ["player", "cpu"]) && ["player", "cpu"].every((seat) => Array.isArray(value[seat]) && value[seat].length <= 60 && value[seat].every((card) =>
    isRecord(card) && hasOnlyKeys(card, ["instanceId", "cardId"]) && typeof card.instanceId === "string" && typeof card.cardId === "string"));
}
function isRecord(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
function hasOnlyKeys(value: Record<string, unknown>, allowed: string[]): boolean { return Object.keys(value).every((key) => allowed.includes(key)); }
function sameJson(left: unknown, right: unknown): boolean {
  try { return JSON.stringify(canonicalValue(left)) === JSON.stringify(canonicalValue(right)); } catch { return false; }
}
function canonicalValue(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(canonicalValue);
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(value as Record<string, unknown>).sort()) {
    result[key] = canonicalValue((value as Record<string, unknown>)[key]);
  }
  return result;
}
function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(value) || !Number.isFinite(Date.parse(value))) return false;
  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
function fail<T = never>(code: SessionError["code"], message: string, path?: string, cause?: unknown): SessionResult<T> {
  return { ok: false, error: { code, message, ...(path ? { path } : {}), ...(cause !== undefined ? { cause } : {}) } };
}
