import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const DEFAULT_PORT = 8787;
const MAX_BODY_BYTES = 5 * 1024 * 1024;
const OUT_DIR = resolve(process.cwd(), "docs/ai_playtest_reports/inbox");
const PORT = Number(process.env.BATTLE_REPORT_INBOX_PORT ?? DEFAULT_PORT);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function setCorsHeaders(res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Private-Network", "true");
}

function sendJson(res: ServerResponse, statusCode: number, payload: Record<string, unknown>) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  res.end(`${JSON.stringify(payload, null, 2)}\n`);
}

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    let bytes = 0;
    let tooLarge = false;

    req.setEncoding("utf8");
    req.on("data", (chunk: string) => {
      if (tooLarge) {
        return;
      }
      bytes += Buffer.byteLength(chunk, "utf8");
      if (bytes > MAX_BODY_BYTES) {
        tooLarge = true;
        reject(new Error("request body is too large"));
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on("end", () => {
      if (!tooLarge) {
        resolve(body);
      }
    });
    req.on("error", reject);
  });
}

function assertBattleReport(value: unknown): asserts value is Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error("report must be an object");
  }
  if (!isRecord(value.settings)) {
    throw new Error("report.settings is required");
  }
  if (!Array.isArray(value.log) && !Array.isArray(value.eventLog)) {
    throw new Error("report.log or report.eventLog is required");
  }
}

function safeFilePart(value: unknown, fallback: string): string {
  const raw = String(value ?? "").trim() || fallback;
  const safe = raw.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  return safe || fallback;
}

function countComments(report: Record<string, unknown>): number {
  if (!Array.isArray(report.comments)) {
    return 0;
  }
  return report.comments.filter((entry) => isRecord(entry) && typeof entry.comment === "string" && entry.comment.trim()).length;
}

function getSeed(report: Record<string, unknown>): string {
  if (!isRecord(report.settings)) {
    return "unknown-seed";
  }
  const seed = report.settings.seed;
  return typeof seed === "number" || typeof seed === "string" ? `seed-${safeFilePart(seed, "unknown")}` : "unknown-seed";
}

function createReportFileName(report: Record<string, unknown>): string {
  if (typeof report.reportId === "string" && report.reportId.trim()) {
    return `${safeFilePart(report.reportId, "battle-report")}.json`;
  }
  const generatedAt = typeof report.generatedAt === "string" ? report.generatedAt : new Date().toISOString();
  const timestamp = safeFilePart(generatedAt, "unknown-time");
  return `${timestamp}_${getSeed(report)}_comments-${countComments(report)}.json`;
}

async function saveBattleReport(report: Record<string, unknown>) {
  await mkdir(OUT_DIR, { recursive: true });
  const fileName = createReportFileName(report);
  const path = join(OUT_DIR, fileName);
  await writeFile(path, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  return { path, fileName };
}

const server = createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    sendJson(res, 200, { ok: true, outDir: OUT_DIR });
    return;
  }

  if (req.method !== "POST" || req.url !== "/battle-report") {
    sendJson(res, 404, { ok: false, error: "not found" });
    return;
  }

  try {
    const body = await readRequestBody(req);
    const parsed: unknown = JSON.parse(body);
    assertBattleReport(parsed);
    const saved = await saveBattleReport(parsed);
    sendJson(res, 200, { ok: true, ...saved, comments: countComments(parsed) });
  } catch (error) {
    sendJson(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Battle report inbox listening on http://127.0.0.1:${PORT}`);
  console.log(`Saving reports to ${OUT_DIR}`);
});
