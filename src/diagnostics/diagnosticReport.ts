import type { ErrorInfo } from "react";

const MAX_DEPTH = 10;
const MAX_ARRAY_ITEMS = 500;
const MAX_OBJECT_KEYS = 500;
const MAX_STRING_LENGTH = 20_000;
const REDACTED = "[redacted]";

let diagnosticContext: unknown;

const sensitiveKey = /(?:password|passwd|secret|token|api[-_]?key|private[-_]?key|access[-_]?key|authorization|cookie|credential|session(?:[-_]?id)?|e-?mail)/i;
const sensitiveText = /\b(Bearer\s+)[A-Za-z0-9._~+/-]+=*|\b(password|passwd|secret|token|api[-_]?key|private[-_]?key|access[-_]?key|authorization|cookie|session(?:[-_]?id)?|e-?mail)\s*[:=]\s*([^\s,;]+)/gi;

function redactText(value: string): string {
  return value
    .replace(sensitiveText, (_match, bearerPrefix: string | undefined, key: string | undefined) =>
      bearerPrefix ? `${bearerPrefix}${REDACTED}` : `${key ?? "value"}=${REDACTED}`,
    )
    .replace(/(https?:\/\/[^\s?#]+)\?[^\s#]*/gi, "$1?[query redacted]")
    .slice(0, MAX_STRING_LENGTH);
}

function sanitizeValue(value: unknown, seen: WeakSet<object>, depth: number): unknown {
  if (value === null || typeof value === "boolean" || typeof value === "number") return value;
  if (typeof value === "string") return redactText(value);
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "undefined") return "[undefined]";
  if (typeof value === "function" || typeof value === "symbol") return `[${typeof value}]`;
  if (depth >= MAX_DEPTH) return "[max depth]";

  const objectValue = value as object;
  if (seen.has(objectValue)) return "[circular]";
  seen.add(objectValue);

  if (Array.isArray(value)) {
    return value.slice(0, MAX_ARRAY_ITEMS).map((entry) => sanitizeValue(entry, seen, depth + 1));
  }

  const result: Record<string, unknown> = {};
  let count = 0;
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (count >= MAX_OBJECT_KEYS) {
      result["[truncated]"] = true;
      break;
    }
    result[redactText(key)] = sensitiveKey.test(key) ? REDACTED : sanitizeValue(entry, seen, depth + 1);
    count += 1;
  }
  return result;
}

export function sanitizeDiagnosticValue(value: unknown): unknown {
  return sanitizeValue(value, new WeakSet<object>(), 0);
}

/** Register a JSON-like UI snapshot (typically GameState and screen mode) for the next crash report. */
export function updateDiagnosticContext(context: unknown): void {
  diagnosticContext = context;
}

export function clearDiagnosticContext(): void {
  diagnosticContext = undefined;
}

export interface DiagnosticReport {
  format: "card-hero-diagnostic-v1";
  capturedAt: string;
  app: { name: string; version: string };
  error: { name: string; message: string; stack?: string };
  componentStack?: string;
  gameContext: unknown;
  contextNote?: string;
}

export function createDiagnosticReport(error: unknown, info?: ErrorInfo): DiagnosticReport {
  const normalized = error instanceof Error
    ? error
    : new Error(typeof error === "string" ? error : "Unknown rendering error");
  let gameContext: unknown;
  let contextNote: string | undefined;
  try {
    gameContext = sanitizeDiagnosticValue(diagnosticContext ?? { status: "not registered" });
  } catch {
    gameContext = { status: "unavailable" };
    contextNote = "Game context could not be serialized.";
  }

  return {
    format: "card-hero-diagnostic-v1",
    capturedAt: new Date().toISOString(),
    app: { name: "isdf_card_hero", version: "0.1.0" },
    error: {
      name: redactText(normalized.name),
      message: redactText(normalized.message),
      ...(normalized.stack ? { stack: redactText(normalized.stack) } : {}),
    },
    ...(info?.componentStack ? { componentStack: redactText(info.componentStack) } : {}),
    gameContext,
    ...(contextNote ? { contextNote } : {}),
  };
}

export function serializeDiagnosticReport(report: DiagnosticReport): string {
  try {
    return JSON.stringify(report, null, 2);
  } catch {
    return JSON.stringify({
      format: "card-hero-diagnostic-v1",
      capturedAt: new Date().toISOString(),
      error: { message: "Diagnostic report serialization failed." },
      gameContext: { status: "unavailable" },
    }, null, 2);
  }
}

export function downloadDiagnosticReport(report: DiagnosticReport): void {
  const content = serializeDiagnosticReport(report);
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `card-hero-diagnostic-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    anchor.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function copyDiagnosticReport(report: DiagnosticReport): Promise<void> {
  const content = serializeDiagnosticReport(report);
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(content);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  try {
    textarea.select();
    if (!document.execCommand("copy")) throw new Error("Clipboard copy is unavailable.");
  } finally {
    textarea.remove();
  }
}
