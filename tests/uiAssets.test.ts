import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface NativeUiAssetManifest {
  format: string;
  version: number;
  productionAssets: Array<{
    path: string;
    source: string;
    tool: string;
    rightsStatus: string;
  }>;
}

describe("Stone Tactics native UI art", () => {
  it("records every repository-authored SVG and brand mark without relying on private staging data", () => {
    const manifestPath = resolve(process.cwd(), "public/art/ui/ui-asset-manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as NativeUiAssetManifest;

    expect(manifest.format).toBe("stone-tactics-native-ui-art");
    expect(manifest.version).toBe(1);
    expect(manifest.productionAssets).toHaveLength(8);
    for (const asset of manifest.productionAssets) {
      expect(asset.source.toLowerCase()).toContain("repository-local original");
      expect(asset.rightsStatus.toLowerCase()).toContain("clearance");
      expect(existsSync(resolve(process.cwd(), asset.path))).toBe(true);
    }
    expect(manifest.productionAssets.find((asset) => asset.path.endsWith("StoneTacticsBrand.tsx"))?.tool)
      .toContain("React markup");
  });
});
