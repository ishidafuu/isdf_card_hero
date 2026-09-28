import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getCardDefsByPool, getCardIconPath } from "../src/game/cards";

interface CardArtManifest {
  format: string;
  version: number;
  status: string;
  rightsStatus: string;
  assets: Array<{
    sourceNo: number;
    cardId: string;
    path: string;
    url: string;
    sha256: string;
    width: number;
    height: number;
    tool: string;
    prompt: string;
    selectionNote?: string;
  }>;
}

describe("Stone Tactics card art", () => {
  it("ships 150 distinct square assets with source-number and card-id bindings", () => {
    const manifestPath = resolve(process.cwd(), "public/art/card-art-manifest.json");
    const manifestText = readFileSync(manifestPath, "utf8");
    const manifest = JSON.parse(manifestText) as CardArtManifest;
    const cards = getCardDefsByPool("all");

    expect(manifest.format).toBe("stone-tactics-card-art");
    expect(manifest.version).toBe(1);
    expect(manifest.status).toBe("complete");
    expect(manifest.rightsStatus).toContain("clearance is not asserted");
    expect(manifest.assets).toHaveLength(150);
    expect(cards).toHaveLength(150);
    expect(manifestText).not.toContain("/Users/");
    expect(manifestText).not.toContain(".codex/generated_images");

    const bySourceNo = new Map(manifest.assets.map((asset) => [asset.sourceNo, asset]));
    expect(bySourceNo.size).toBe(150);
    expect(new Set(manifest.assets.map((asset) => asset.cardId)).size).toBe(150);
    expect(new Set(manifest.assets.map((asset) => asset.sha256)).size).toBe(150);

    for (const card of cards) {
      const sourceNo = card.sourceNo;
      if (sourceNo === undefined) throw new Error(`Missing source number for ${card.id}`);
      const asset = bySourceNo.get(sourceNo);
      const filename = `card_${String(sourceNo).padStart(3, "0")}.png`;
      expect(asset?.cardId).toBe(card.id);
      expect(asset?.path).toBe(`public/art/cards/${filename}`);
      expect(asset?.url).toBe(`/art/cards/${filename}`);
      expect(getCardIconPath(card.id)).toBe(asset?.url);
      expect(asset?.tool).toBe("built-in image_gen.imagegen");
      expect(asset?.prompt.length).toBeGreaterThan(20);
      expect(asset?.width).toBeGreaterThanOrEqual(512);
      expect(asset?.height).toBe(asset?.width);

      const bytes = readFileSync(resolve(process.cwd(), asset!.path));
      const hash = createHash("sha256").update(bytes).digest("hex");
      expect(hash).toBe(asset?.sha256);
      expect(bytes.readUInt32BE(16)).toBe(asset?.width);
      expect(bytes.readUInt32BE(20)).toBe(asset?.height);
    }

    expect(bySourceNo.get(1)?.selectionNote).toContain("Spartas");
  });
});
