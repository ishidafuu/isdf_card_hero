const LOOPBACK_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function parseBattleReportAllowedOrigins(value: string | undefined): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((origin) => normalizeOrigin(origin))
      .filter((origin): origin is string => !!origin),
  );
}

export function isAllowedBattleReportOrigin(
  origin: string | undefined,
  configuredOrigins: ReadonlySet<string>,
): boolean {
  if (!origin) {
    return true;
  }
  const normalized = normalizeOrigin(origin);
  if (!normalized) {
    return false;
  }
  if (configuredOrigins.has(normalized)) {
    return true;
  }
  try {
    const url = new URL(normalized);
    return (url.protocol === "http:" || url.protocol === "https:") && LOOPBACK_HOSTNAMES.has(url.hostname);
  } catch {
    return false;
  }
}

export function isJsonContentType(value: string | undefined): boolean {
  return value?.split(";", 1)[0]?.trim().toLowerCase() === "application/json";
}

function normalizeOrigin(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  try {
    return new URL(trimmed).origin;
  } catch {
    return undefined;
  }
}
