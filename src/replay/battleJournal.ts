import { applyStoredAiDecision } from "../game/cpuAi";
import {
  attackWithCommand,
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
} from "../game/rules";
import { appendHumanActionReviewEntry, createAiDecisionStateSnapshot } from "../game/aiReviewTrace";
import type { GameState, HumanActionSnapshot } from "../game/types";
import {
  BATTLE_JOURNAL_FORMAT,
  BATTLE_JOURNAL_RULES_VERSION,
  BATTLE_JOURNAL_SCHEMA_VERSION,
  type AiDecisionExtraction,
  type BattleCommand,
  type BattleCommandPayload,
  type BattleJournalBranchSnapshot,
  type BattleJournal,
  type BattleJournalError,
  type BattleJournalResult,
  type ReplaySnapshot,
} from "./types";
import {
  isValidAiDecision,
  isValidBattleCommandPayload,
  isValidBattleGameState,
  isValidPlayerId,
} from "./schema";

export const MAX_BATTLE_JOURNAL_COMMANDS = 5_000;
export const MAX_BATTLE_JOURNAL_IMPORT_BYTES = 25_000_000;

function failure<T>(code: BattleJournalError["code"], message: string, extra: Partial<BattleJournalError> = {}): BattleJournalResult<T> {
  return { ok: false, error: { code, message, ...extra } };
}

function canonicalJson(value: unknown): string {
  const canonicalize = (entry: unknown): unknown => {
    if (entry === null || typeof entry === "string" || typeof entry === "boolean") return entry;
    if (typeof entry === "number") {
      if (!Number.isFinite(entry)) throw new Error("State contains a non-finite number.");
      return entry;
    }
    if (Array.isArray(entry)) return entry.map((item) => item === undefined ? null : canonicalize(item));
    if (typeof entry !== "object" || entry === undefined) throw new Error("State contains a non-JSON value.");
    const input = entry as Record<string, unknown>;
    const output: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
    for (const key of Object.keys(input).sort()) {
      const item = input[key];
      if (item !== undefined) output[key] = canonicalize(item);
    }
    return output;
  };
  return JSON.stringify(canonicalize(value));
}

/** Deterministic non-cryptographic fingerprint; integrity is checked by replay, not authentication. */
export function hashBattleState(state: GameState): string {
  const bytes = new TextEncoder().encode(canonicalJson(state));
  let fnv32 = 0x811c9dc5;
  let djb32 = 5381;
  for (const byte of bytes) {
    fnv32 = Math.imul(fnv32 ^ byte, 0x01000193);
    djb32 = Math.imul(djb32, 33) ^ byte;
  }
  return `dual32-v2:${(fnv32 >>> 0).toString(16).padStart(8, "0")}${(djb32 >>> 0).toString(16).padStart(8, "0")}`;
}

function cloneState(state: GameState): GameState {
  return structuredClone(state);
}

export function createBattleJournal(initialState: GameState): BattleJournalResult<BattleJournal> {
  try {
    if (!isValidBattleGameState(initialState)) {
      return failure("INVALID_GAME_STATE", "初期GameStateのschemaまたはID整合性が不正です。");
    }
    try {
      const initial = cloneState(initialState);
      return {
        ok: true,
        value: {
          format: BATTLE_JOURNAL_FORMAT,
          schemaVersion: BATTLE_JOURNAL_SCHEMA_VERSION,
          rulesVersion: BATTLE_JOURNAL_RULES_VERSION,
          initialState: initial,
          initialHash: hashBattleState(initial),
          commands: [],
          completeness: { status: "complete" },
        },
      };
    } catch (cause) {
      return failure("INVALID_GAME_STATE", "初期GameStateを安全に複製できませんでした。", { cause });
    }
  } catch (cause) {
    return failure("INVALID_GAME_STATE", "初期GameStateの検証中に例外が発生しました。", { cause });
  }
}

export function appendBattleCommand(
  journal: BattleJournal,
  before: GameState,
  after: GameState,
  payload: BattleCommandPayload,
): BattleJournalResult<BattleJournal> {
  try {
    if (journal.completeness.status !== "complete") {
      return failure("INCOMPLETE_JOURNAL", "不完全なjournalにはコマンドを追加できません。");
    }
    if (journal.commands.length >= MAX_BATTLE_JOURNAL_COMMANDS) {
      return failure("COMMAND_LIMIT_EXCEEDED", "journalのコマンド数上限を超えました。");
    }
    // The journal head hash binds `before` to a state created by a validated snapshot or
    // an earlier verified command. Reapplying the payload and comparing the full after
    // hash validates the transition without rescanning up to 240 bounded review entries
    // on both large states for every append.
    if (!isValidBattleCommandPayload(payload) || !isValidPlayerId(before.currentPlayer)) {
      return failure("INVALID_COMMAND", "concrete command schemaが不正です。");
    }
    const beforeHash = hashBattleState(before);
    const expectedBeforeHash = journal.commands.at(-1)?.afterHash ?? journal.initialHash;
    if (beforeHash !== expectedBeforeHash) {
      return failure("BEFORE_HASH_MISMATCH", "journal headとコマンド前状態が一致しません。", {
        expectedHash: expectedBeforeHash,
        actualHash: beforeHash,
      });
    }
    const sequence = journal.commands.length + 1;
    const command: BattleCommand = {
      ...structuredClone(payload),
      sequence,
      playerId: before.currentPlayer,
      beforeHash,
      afterHash: hashBattleState(after),
    };
    let replayedAfter: GameState;
    try {
      replayedAfter = applyBattleCommand(cloneState(before), command);
    } catch (cause) {
      return failure("EXECUTION_FAILED", "記録したcommandを前状態へ適用できませんでした。", { sequence, cause });
    }
    const replayedAfterHash = hashBattleState(replayedAfter);
    if (replayedAfterHash !== command.afterHash) {
      return failure("HASH_MISMATCH", "記録commandの再適用結果が実際のafter stateと一致しません。", {
        sequence,
        expectedHash: command.afterHash,
        actualHash: replayedAfterHash,
      });
    }
    return { ok: true, value: { ...journal, commands: [...journal.commands, command] } };
  } catch (cause) {
    return failure("INVALID_COMMAND", "command追加中のvalidation/hash/cloneで例外が発生しました。", { cause });
  }
}

export function markBattleJournalIncomplete(journal: BattleJournal, reason: string): BattleJournal {
  if (journal.completeness.status === "incomplete") return journal;
  return {
    ...journal,
    completeness: {
      status: "incomplete",
      reason: reason.slice(0, 2_000) || "Command journal capture failed.",
      afterSequence: journal.commands.length,
    },
  };
}

export function extractAiDecisionCommand(requestBefore: GameState, responseGame: GameState): BattleJournalResult<AiDecisionExtraction> {
  try {
    if (!isValidBattleGameState(requestBefore) || !isValidBattleGameState(responseGame)) {
      return failure("INVALID_GAME_STATE", "Worker request/response GameStateが不正です。");
    }
    const previousSequence = requestBefore.aiDecisionHistory?.at(-1)?.sequence ?? 0;
    const appended = (responseGame.aiDecisionHistory ?? []).filter((entry) => entry.sequence > previousSequence);
    if (appended.length === 0) {
      return failure("AI_DECISION_NOT_FOUND", "Worker結果から保存済みAI commandを特定できませんでした。");
    }
    if (appended.length !== 1) {
      return failure("AI_DECISION_AMBIGUOUS", "Worker結果に複数の新規AI decisionがあります。");
    }
    const entry = appended[0];
    const expectedSnapshot = createAiDecisionStateSnapshot(requestBefore);
    if (entry.sequence !== previousSequence + 1 || entry.playerId !== requestBefore.currentPlayer ||
      entry.turnNumber !== requestBefore.turnNumber || canonicalJson(entry.stateBefore) !== canonicalJson(expectedSnapshot) ||
      !isValidAiDecision(entry.decision)) {
      return failure("AI_DECISION_NOT_FOUND", "WorkerのAI decision履歴がリクエスト前状態と一致しません。");
    }
    return {
      ok: true,
      value: { controller: "ai", decision: structuredClone(entry.decision) },
    };
  } catch (cause) {
    return failure("INVALID_COMMAND", "Worker decision抽出中に例外が発生しました。", { cause });
  }
}

export function seekBattleJournal(journal: BattleJournal, cursor: number): BattleJournalResult<ReplaySnapshot> {
  try {
    if (!Number.isSafeInteger(cursor) || cursor < 0 || cursor > journal.commands.length) {
      return failure("INVALID_CURSOR", `cursorは0から${journal.commands.length}の範囲で指定してください。`);
    }
    if (journal.completeness.status === "incomplete" && cursor > journal.completeness.afterSequence) {
      return failure("INCOMPLETE_JOURNAL", "不完全化した位置より後ろへseekできません。");
    }
    if (!isValidBattleGameState(journal.initialState)) {
      return failure("INVALID_JOURNAL", "journalの初期GameStateが不正です。");
    }
    const initialHash = hashBattleState(journal.initialState);
    if (initialHash !== journal.initialHash) {
      return failure("HASH_MISMATCH", "journal初期snapshot hashが一致しません。", { expectedHash: journal.initialHash, actualHash: initialHash });
    }
    let state = cloneState(journal.initialState);
    for (const command of journal.commands.slice(0, cursor)) {
      const beforeHash = hashBattleState(state);
      if (beforeHash !== command.beforeHash) {
        return failure("HASH_MISMATCH", "replay前状態hashが一致しません。", { sequence: command.sequence, expectedHash: command.beforeHash, actualHash: beforeHash });
      }
      if (state.currentPlayer !== command.playerId) {
        return failure("INVALID_COMMAND", "commandのplayerIdがreplay状態と一致しません。", { sequence: command.sequence });
      }
      try {
        state = applyBattleCommand(state, command);
      } catch (cause) {
        return failure("EXECUTION_FAILED", `sequence ${command.sequence} のcommand適用に失敗しました。`, { sequence: command.sequence, cause });
      }
      const afterHash = hashBattleState(state);
      if (afterHash !== command.afterHash) {
        return failure("HASH_MISMATCH", "replay後状態hashが一致しません。", { sequence: command.sequence, expectedHash: command.afterHash, actualHash: afterHash });
      }
    }
    return { ok: true, value: { state, cursor, totalCommands: journal.commands.length } };
  } catch (cause) {
    return failure("INVALID_JOURNAL", "journal seek中のvalidation/hash/cloneで例外が発生しました。", { cause });
  }
}

function applyBattleCommand(state: GameState, command: BattleCommand): GameState {
  if (command.controller === "ai") {
    return applyStoredAiDecision(state, command.decision);
  }
  const action: HumanActionSnapshot = command.action;
  let next: GameState;
  switch (action.type) {
    case "attack": next = attackWithCommand(state, action.action); break;
    case "master_action": next = useMasterAction(state, action.actionId, action.target); break;
    case "summon": next = summonMonster(state, action.handInstanceId, action.slotKey); break;
    case "magic": next = playMagic(state, action.action); break;
    case "move": next = moveMonster(state, action.fromSlotKey, action.toSlotKey); break;
    case "focus": next = focusMonster(state, action.slotKey); break;
    case "master_hp_draw": next = useMasterHpDraw(state); break;
    case "discard_hand": next = discardHandCard(state, action.handInstanceId); break;
    case "resolve_level_up": next = resolveLevelUp(state, action.levels, action.superHandInstanceId); break;
    case "end_turn": next = action.discardHandInstanceIds?.length
      ? endTurnWithHandLimitDiscards(state, action.discardHandInstanceIds)
      : endTurn(state); break;
    default: return assertNever(action);
  }
  appendHumanActionReviewEntry(next, state, action);
  return next;
}

function assertNever(value: never): never {
  throw new Error(`Unknown battle command: ${JSON.stringify(value)}`);
}

export function branchBattleJournal(journal: BattleJournal, cursor: number): BattleJournalResult<BattleJournal> {
  const branched = branchBattleJournalWithSnapshot(journal, cursor);
  if (!branched.ok) return branched;
  return { ok: true, value: branched.value.journal };
}

export function branchBattleJournalWithSnapshot(
  journal: BattleJournal,
  cursor: number,
): BattleJournalResult<BattleJournalBranchSnapshot> {
  try {
    if (!Number.isSafeInteger(cursor) || cursor < 0 || cursor > journal.commands.length) {
      return failure("INVALID_CURSOR", `cursorは0から${journal.commands.length}の範囲で指定してください。`);
    }
    if (journal.completeness.status === "incomplete" && cursor > journal.completeness.afterSequence) {
      return failure("INCOMPLETE_JOURNAL", "不完全化した位置より後ろからbranchできません。");
    }
    const snapshot = seekBattleJournal(journal, cursor);
    if (!snapshot.ok) return snapshot;
    const prefix: BattleJournal = {
      ...journal,
      initialState: cloneState(journal.initialState),
      commands: structuredClone(journal.commands.slice(0, cursor)),
      completeness: { status: "complete" },
    };
    return {
      ok: true,
      value: { journal: prefix, snapshot: snapshot.value },
    };
  } catch (cause) {
    return failure("INVALID_JOURNAL", "journal branchの検証/複製中に例外が発生しました。", { cause });
  }
}

export function serializeBattleJournal(journal: BattleJournal): BattleJournalResult<string> {
  try {
    if (journal.completeness.status !== "complete") {
      return failure("INCOMPLETE_JOURNAL", "不完全なjournalは完全replayとしてexportできません。");
    }
    const validation = validateBattleJournalShape(journal);
    if (!validation.ok) return validation;
    const replay = seekBattleJournal(journal, journal.commands.length);
    if (!replay.ok) return replay;
    try {
      const json = JSON.stringify(journal);
      if (new TextEncoder().encode(json).byteLength > MAX_BATTLE_JOURNAL_IMPORT_BYTES) {
        return failure("IMPORT_TOO_LARGE", "journal JSONがサイズ上限を超えています。");
      }
      return { ok: true, value: json };
    } catch (cause) {
      return failure("INVALID_JOURNAL", "journalをJSON化できませんでした。", { cause });
    }
  } catch (cause) {
    return failure("INVALID_JOURNAL", "journal export中の検証/再生で例外が発生しました。", { cause });
  }
}

export function parseBattleJournal(json: string): BattleJournalResult<BattleJournal> {
  try {
    if (typeof json !== "string") return failure("INVALID_JSON", "journal inputはJSON文字列である必要があります。");
    if (new TextEncoder().encode(json).byteLength > MAX_BATTLE_JOURNAL_IMPORT_BYTES) {
      return failure("IMPORT_TOO_LARGE", "journal JSONがサイズ上限を超えています。");
    }
    let value: unknown;
    try {
      value = JSON.parse(json) as unknown;
    } catch (cause) {
      return failure("INVALID_JSON", "journal JSONを解析できませんでした。", { cause });
    }
    const validation = validateBattleJournalShape(value);
    if (!validation.ok) return validation;
    const journal = structuredClone(validation.value);
    const replay = seekBattleJournal(journal, journal.commands.length);
    if (!replay.ok) return replay;
    return { ok: true, value: journal };
  } catch (cause) {
    return failure("INVALID_JOURNAL", "journal import中のschema/clone/replayで例外が発生しました。", { cause });
  }
}

function validateBattleJournalShape(value: unknown): BattleJournalResult<BattleJournal> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return failure("INVALID_JOURNAL", "journal rootはobjectである必要があります。");
  }
  const record = value as Record<string, unknown>;
  if (record.reportId !== undefined && record.stateSummary !== undefined &&
    (record.aiDecisionHistory !== undefined || record.humanActionHistory !== undefined)) {
    return failure("LEGACY_ANALYSIS_ONLY", "旧Battle Reportには完全なcommand journalがないため、分析用としてのみ利用できます。");
  }
  if (record.format !== BATTLE_JOURNAL_FORMAT || record.schemaVersion !== BATTLE_JOURNAL_SCHEMA_VERSION ||
    record.rulesVersion !== BATTLE_JOURNAL_RULES_VERSION) {
    return failure("UNSUPPORTED_VERSION", "journal format/schema/rules versionをサポートしていません。");
  }
  if (!hasExactCommandKeys(record, ["format", "schemaVersion", "rulesVersion", "initialState", "initialHash", "commands", "completeness"])) {
    return failure("INVALID_JOURNAL", "journalに未知または不正なroot fieldがあります。");
  }
  if (!isValidBattleGameState(record.initialState) || typeof record.initialHash !== "string" ||
    !/^dual32-v2:[0-9a-f]{16}$/.test(record.initialHash) || !Array.isArray(record.commands) ||
    !record.commands.every(isBattleCommand) || record.commands.length > MAX_BATTLE_JOURNAL_COMMANDS ||
    !isCompleteness(record.completeness)) {
    return failure("INVALID_JOURNAL", "journalのschemaまたはcommand countが不正です。");
  }
  if (record.completeness.status !== "complete") {
    return failure("INCOMPLETE_JOURNAL", "import対象のjournalは不完全な状態です。");
  }
  const initialHash = hashBattleState(record.initialState);
  if (initialHash !== record.initialHash) {
    return failure("HASH_MISMATCH", "journal初期snapshot hashが一致しません。", { expectedHash: record.initialHash, actualHash: initialHash });
  }
  let previousHash = initialHash;
  for (let index = 0; index < record.commands.length; index += 1) {
    const command = record.commands[index];
    if (command.sequence !== index + 1 || command.beforeHash !== previousHash) {
      return failure("INVALID_JOURNAL", "command sequenceまたはhash chainが不正です。", { sequence: index + 1 });
    }
    previousHash = command.afterHash;
  }
  return { ok: true, value: value as BattleJournal };
}

function isBattleCommand(value: unknown): value is BattleCommand {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const command = value as Record<string, unknown>;
  if (!Number.isSafeInteger(command.sequence) || (command.sequence as number) < 1 || !isValidPlayerId(command.playerId)) return false;
  const payload = command.controller === "human"
    ? { controller: command.controller, action: command.action }
    : command.controller === "ai"
      ? { controller: command.controller, decision: command.decision }
      : undefined;
  if (!payload || !isValidBattleCommandPayload(payload)) return false;
  return typeof command.beforeHash === "string" && /^dual32-v2:[0-9a-f]{16}$/.test(command.beforeHash) &&
    typeof command.afterHash === "string" && /^dual32-v2:[0-9a-f]{16}$/.test(command.afterHash) &&
    (command.controller === "human"
      ? hasExactCommandKeys(command, ["controller", "action", "sequence", "playerId", "beforeHash", "afterHash"])
      : hasExactCommandKeys(command, ["controller", "decision", "sequence", "playerId", "beforeHash", "afterHash"]));
}

function hasExactCommandKeys(command: Record<string, unknown>, keys: readonly string[]): boolean {
  const allowed = new Set(keys);
  return Object.keys(command).every((key) => allowed.has(key));
}

function isCompleteness(value: unknown): value is BattleJournal["completeness"] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  if (record.status === "complete") return Object.keys(record).length === 1;
  return record.status === "incomplete" && Number.isSafeInteger(record.afterSequence) && (record.afterSequence as number) >= 0 &&
    typeof record.reason === "string" && record.reason.length <= 2_000 && Object.keys(record).length === 3;
}

export { BATTLE_JOURNAL_FORMAT, BATTLE_JOURNAL_RULES_VERSION, BATTLE_JOURNAL_SCHEMA_VERSION } from "./types";
export type {
  AiDecisionExtraction,
  BattleCommand,
  BattleCommandPayload,
  BattleJournal,
  BattleJournalCompleteness,
  BattleJournalError,
  BattleJournalErrorCode,
  BattleJournalResult,
  ReplaySnapshot,
} from "./types";
