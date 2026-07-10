import { describe, expect, it } from "vitest";
import {
  isAllowedBattleReportOrigin,
  isJsonContentType,
  parseBattleReportAllowedOrigins,
} from "../../scripts/lib/battleReportInboxPolicy";

describe("battle report inbox policy", () => {
  it("allows loopback app origins and requests without an Origin header", () => {
    const configured = new Set<string>();

    expect(isAllowedBattleReportOrigin(undefined, configured)).toBe(true);
    expect(isAllowedBattleReportOrigin("http://127.0.0.1:5174", configured)).toBe(true);
    expect(isAllowedBattleReportOrigin("http://localhost:5174", configured)).toBe(true);
    expect(isAllowedBattleReportOrigin("http://[::1]:5174", configured)).toBe(true);
  });

  it("rejects public and lookalike origins unless explicitly configured", () => {
    const configured = parseBattleReportAllowedOrigins("https://isdf-card-hero.vercel.app/");

    expect(isAllowedBattleReportOrigin("https://attacker.example", configured)).toBe(false);
    expect(isAllowedBattleReportOrigin("http://127.0.0.1.attacker.example", configured)).toBe(false);
    expect(isAllowedBattleReportOrigin("https://isdf-card-hero.vercel.app", configured)).toBe(true);
  });

  it("accepts only JSON request content types", () => {
    expect(isJsonContentType("application/json")).toBe(true);
    expect(isJsonContentType("application/json; charset=utf-8")).toBe(true);
    expect(isJsonContentType("text/plain")).toBe(false);
    expect(isJsonContentType(undefined)).toBe(false);
  });
});
