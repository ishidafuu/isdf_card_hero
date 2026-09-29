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
    variantId?: string;
    variantKind?: "reference-redraw" | "legacy-v1-retained";
    path: string;
    url: string;
    sha256: string;
    width: number;
    height: number;
    tool: string;
    prompt: string;
    referenceSourceNo?: number;
    referenceSHA256?: string;
    rightsStatus?: string;
  }>;
}

const SHA256 = /^[a-f0-9]{64}$/;
const RETAINED_V1_SOURCE_NOS = [4, 5, 7];
const PRIVATE_PATH_MARKERS = [
  /\/Users\//i,
  /\/home\//i,
  /\/tmp\//i,
  /\/var\//i,
  /\/etc\//i,
  /\.codex[\\/]+generated_images[\\/]/i,
  /\b[A-Z]:[\\/]/i,
  /file:\/\//i,
  /\/private\//i,
];
const RIGHTS_NOT_CLEARED = /clearance (?:is|are) not asserted/i;

function assertV2Composition(manifest: CardArtManifest) {
  expect(manifest.rightsStatus).toMatch(RIGHTS_NOT_CLEARED);
  const redraws = manifest.assets.filter((asset) => asset.variantKind === "reference-redraw");
  const retained = manifest.assets.filter((asset) => asset.variantKind === "legacy-v1-retained");
  expect(redraws).toHaveLength(147);
  expect(retained.map((asset) => asset.sourceNo).sort((a, b) => a - b)).toEqual(RETAINED_V1_SOURCE_NOS);
  expect(retained.every((asset) => asset.sha256 && asset.prompt)).toBe(true);
  expect(manifest.assets.every((asset) => asset.variantKind !== undefined)).toBe(true);
  expect(new Set(manifest.assets.map((asset) => asset.variantId)).size).toBe(150);

  for (const asset of redraws) {
    expect(asset.referenceSourceNo).toBe(asset.sourceNo);
    expect(asset.referenceSHA256).toMatch(SHA256);
    expect(asset.tool).toBe("built-in image_gen.imagegen");
    expect(asset.rightsStatus).toMatch(RIGHTS_NOT_CLEARED);
  }
  for (const asset of retained) {
    expect(asset.tool).toBe("previous-v1-manifest");
    expect(asset.referenceSourceNo).toBeUndefined();
    expect(asset.referenceSHA256).toBeUndefined();
    expect(asset.rightsStatus).toMatch(RIGHTS_NOT_CLEARED);
  }
}

describe("Stone Tactics card art", () => {
  it("detects common private-path spellings, including JSON-escaped Windows paths", () => {
    const privatePathExamples = [
      "/Users/someone/generated.png",
      "/home/someone/generated.png",
      "/tmp/generated.png",
      "/var/tmp/generated.png",
      "/etc/private/generated.png",
      "/private/tmp/generated.png",
      ".codex/generated_images/generated.png",
      "file:///Users/someone/generated.png",
      String.raw`C:\Users\someone\generated.png`,
      JSON.stringify(String.raw`C:\Users\someone\generated.png`),
    ];
    for (const path of privatePathExamples) {
      expect(PRIVATE_PATH_MARKERS.some((marker) => marker.test(path)), path).toBe(true);
    }
  });

  it("ships 150 distinct square assets with source-number and card-id bindings", () => {
    const manifestPath = resolve(process.cwd(), "public/art/card-art-manifest.json");
    const manifestText = readFileSync(manifestPath, "utf8");
    const manifest = JSON.parse(manifestText) as CardArtManifest;
    const cards = getCardDefsByPool("all");

    expect(manifest.format).toBe("stone-tactics-card-art");
    expect(manifest.status).toBe("complete");
    expect(manifest.version).toBe(2);
    expect(manifest.assets).toHaveLength(150);
    expect(cards).toHaveLength(150);
    for (const privatePathMarker of PRIVATE_PATH_MARKERS) {
      expect(manifestText).not.toMatch(privatePathMarker);
    }

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
      expect(asset?.prompt.length).toBeGreaterThan(20);
      expect(asset?.width).toBeGreaterThanOrEqual(512);
      expect(asset?.height).toBe(asset?.width);
      expect(asset?.sha256).toMatch(SHA256);

      expect(asset?.variantId).toBeTruthy();

      const bytes = readFileSync(resolve(process.cwd(), asset!.path));
      expect(bytes.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      const hash = createHash("sha256").update(bytes).digest("hex");
      expect(hash).toBe(asset?.sha256);
      expect(bytes.readUInt32BE(16)).toBe(asset?.width);
      expect(bytes.readUInt32BE(20)).toBe(asset?.height);
    }

    assertV2Composition(manifest);
  });

  it("requires the approved v2 split of 147 reference redraws and three explicitly retained v1 assets", () => {
    const manifest: CardArtManifest = {
      format: "stone-tactics-card-art",
      version: 2,
      status: "complete",
      rightsStatus: "This set includes reference-based redraws and explicitly approved retained assets; rights and trademark clearance are not asserted.",
      assets: Array.from({ length: 150 }, (_, index) => {
        const sourceNo = index + 1;
        const retained = RETAINED_V1_SOURCE_NOS.includes(sourceNo);
        return {
          sourceNo,
          cardId: `card_${String(sourceNo).padStart(3, "0")}`,
          variantId: retained ? `legacy-v1-retained-${sourceNo}` : `reference-redraw-v2-${sourceNo}`,
          variantKind: retained ? "legacy-v1-retained" : "reference-redraw",
          path: `public/art/cards/card_${String(sourceNo).padStart(3, "0")}.png`,
          url: `/art/cards/card_${String(sourceNo).padStart(3, "0")}.png`,
          sha256: sourceNo.toString(16).padStart(64, "0"),
          width: 1254,
          height: 1254,
          tool: retained ? "previous-v1-manifest" : "built-in image_gen.imagegen",
          prompt: "Fixture prompt describing a reference-based redraw or unchanged v1 retained image.",
          ...(retained
            ? { rightsStatus: "Previously shipped version-1 AI-generated concept retained unchanged; rights and trademark clearance are not asserted." }
            : {
                referenceSourceNo: sourceNo,
                referenceSHA256: sourceNo.toString(16).padStart(64, "0"),
                rightsStatus: "Reference-based redraw of supplied card artwork; rights and trademark clearance are not asserted.",
              }),
        };
      }),
    };

    expect(() => assertV2Composition(manifest)).not.toThrow();
    manifest.assets[4]!.variantKind = "reference-redraw";
    expect(() => assertV2Composition(manifest)).toThrow();
  });
});
