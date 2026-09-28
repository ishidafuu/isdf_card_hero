import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { cardArtPath, validateCardSourceRecords } from "../scripts/card-art-import-guards.mjs";

describe("card art importer guards", () => {
  it("maps imported source numbers to bundled artwork without fetching legacy images", () => {
    expect(cardArtPath(1)).toBe("/art/cards/card_001.png");
    expect(cardArtPath(96)).toBe("/art/cards/card_096.png");
    expect(cardArtPath(150)).toBe("/art/cards/card_150.png");
    expect(() => cardArtPath(0)).toThrow();
    expect(() => cardArtPath(151)).toThrow();

    const importer = readFileSync(resolve(process.cwd(), "scripts/import-cardhero-bu.mjs"), "utf8");
    expect(importer).toContain("validateCardSourceRecords(cards)");
    expect(importer).toContain("cardArtPath(Number(no))");
    expect(importer).not.toMatch(/downloadIcon|ICON_DIR|card-icons/);
    expect(importer).not.toContain("iconUrl");
  });

  it("refuses incomplete, duplicated, or renumbered source fixtures before data generation", () => {
    const completeFixture = Array.from({ length: 150 }, (_, index) => ({
      id: index === 3 ? "takokke" : `card_${String(index + 1).padStart(3, "0")}`,
      sourceNo: index + 1,
    }));
    expect(validateCardSourceRecords(completeFixture)).toEqual({ ok: true });
    expect(validateCardSourceRecords(completeFixture.slice(0, 149)).ok).toBe(false);
    expect(validateCardSourceRecords(completeFixture.map((card, index) => index === 149 ? { ...card, sourceNo: 149 } : card).map((card, index) => index === 149 ? { ...card, id: "card_150" } : card)).ok).toBe(false);
    expect(validateCardSourceRecords(completeFixture.map((card, index) => index === 149 ? { ...card, id: "takokke" } : card).map((card, index) => index === 149 ? { ...card, sourceNo: 150 } : card)).ok).toBe(false);
  });
});
