import { afterEach, describe, expect, it } from "vitest";
import {
  clearDiagnosticContext,
  createDiagnosticReport,
  sanitizeDiagnosticValue,
  serializeDiagnosticReport,
  updateDiagnosticContext,
} from "../src/diagnostics/diagnosticReport";

afterEach(() => clearDiagnosticContext());

describe("diagnostic report", () => {
  it("keeps useful game state while redacting secret-shaped fields and text", () => {
    updateDiagnosticContext({
      turnNumber: 12,
      players: { player: { hand: [{ cardId: "monster-1" }], masterHp: 20 } },
      apiToken: "do-not-export",
      note: "Bearer abc123 password=hunter2",
      link: "https://example.test/report?session=private",
    });

    const report = createDiagnosticReport(new Error("render failed"));
    const json = serializeDiagnosticReport(report);

    expect(report.gameContext).toMatchObject({
      turnNumber: 12,
      players: { player: { hand: [{ cardId: "monster-1" }], masterHp: 20 } },
      apiToken: "[redacted]",
    });
    expect(json).not.toContain("do-not-export");
    expect(json).not.toContain("abc123");
    expect(json).not.toContain("hunter2");
    expect(json).not.toContain("session=private");
  });

  it("bounds recursive data and replaces cycles", () => {
    const circular: Record<string, unknown> = { value: 1 };
    circular.self = circular;
    expect(sanitizeDiagnosticValue(circular)).toEqual({ value: 1, self: "[circular]" });
  });

  it("still creates a usable report when the registered context cannot be read", () => {
    updateDiagnosticContext(new Proxy({}, { ownKeys: () => { throw new Error("unreadable"); } }));
    const report = createDiagnosticReport("render failed");
    expect(report.gameContext).toEqual({ status: "unavailable" });
    expect(report.contextNote).toBeTruthy();
    expect(() => serializeDiagnosticReport(report)).not.toThrow();
  });

  it("marks missing context clearly", () => {
    const report = createDiagnosticReport(new Error("boom"));
    expect(report.gameContext).toEqual({ status: "not registered" });
  });
});
