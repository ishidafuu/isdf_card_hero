import { parseSessionArchiveEnvelope, serializeTrustedSessionRuntime } from "./archive";
import type { SessionArchive, SessionError, SessionResult, SessionRuntime } from "./types";

export const SESSION_AUTOSAVE_KEY = "isdf-card-hero.session.current.v1";

export interface SessionStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Saves a trusted in-memory runtime without repeating its potentially expensive replay. */
export function saveSessionRuntime(
  runtime: SessionRuntime,
  storage?: SessionStorageLike,
  key = SESSION_AUTOSAVE_KEY,
): SessionResult<void> {
  const target = resolveStorage(storage);
  if (!target.ok) return target;
  const serialized = serializeTrustedSessionRuntime(runtime);
  if (!serialized.ok) return serialized;
  try {
    target.value.setItem(key, serialized.value);
    return { ok: true, value: undefined };
  } catch (cause) {
    return storageFailure(cause);
  }
}

/** Parses only the strict archive envelope; caller must Worker-verify journals before restore. */
export function loadSessionArchive(
  storage?: SessionStorageLike,
  key = SESSION_AUTOSAVE_KEY,
): SessionResult<SessionArchive | null> {
  const target = resolveStorage(storage);
  if (!target.ok) return target;
  try {
    const json = target.value.getItem(key);
    if (json === null) return { ok: true, value: null };
    return parseSessionArchiveEnvelope(json);
  } catch (cause) {
    return storageFailure(cause);
  }
}

export function clearSessionAutosave(
  storage?: SessionStorageLike,
  key = SESSION_AUTOSAVE_KEY,
): SessionResult<void> {
  const target = resolveStorage(storage);
  if (!target.ok) return target;
  try {
    target.value.removeItem(key);
    return { ok: true, value: undefined };
  } catch (cause) {
    return storageFailure(cause);
  }
}

function resolveStorage(storage: SessionStorageLike | undefined): SessionResult<SessionStorageLike> {
  if (storage) return { ok: true, value: storage };
  try {
    if (typeof globalThis.localStorage === "undefined") {
      return { ok: false, error: { code: "STORAGE_UNAVAILABLE", message: "この環境ではsession autosave storageを利用できません。" } };
    }
    return { ok: true, value: globalThis.localStorage };
  } catch (cause) {
    return storageFailure(cause);
  }
}

function storageFailure(cause: unknown): SessionResult<never> {
  if (isQuotaExceeded(cause)) {
    return { ok: false, error: { code: "STORAGE_QUOTA_EXCEEDED", message: "session autosaveの保存容量が不足しています。既存saveは保持しました。", cause } };
  }
  return { ok: false, error: { code: "STORAGE_UNAVAILABLE", message: "session autosave storageを読み書きできませんでした。", cause } };
}

function isQuotaExceeded(cause: unknown): boolean {
  if (!cause || typeof cause !== "object") return false;
  const value = cause as { name?: unknown; code?: unknown };
  return value.name === "QuotaExceededError" || value.name === "NS_ERROR_DOM_QUOTA_REACHED" || value.code === 22 || value.code === 1014;
}

export function isSessionStorageError(error: SessionError): boolean {
  return error.code === "STORAGE_UNAVAILABLE" || error.code === "STORAGE_QUOTA_EXCEEDED";
}
