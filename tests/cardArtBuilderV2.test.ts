import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readFile, readdir, rename, rm, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { deflateSync } from "node:zlib";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { preflightV2Art, publishV2Art } from "../scripts/build-stone-tactics-art.mjs";

const SOURCE_COUNT = 150;
const ROOT = process.cwd();
const PRIVATE_ART = path.join(ROOT, "artifacts/art-readability-v2/test-fixtures");
const BUILDER = path.join(ROOT, "scripts/build-stone-tactics-art.mjs");
const RIGHTS = "Reference-based redraw of supplied card artwork; rights and trademark clearance are not asserted.";
const hash = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const typeBytes = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])), 0);
  return Buffer.concat([length, typeBytes, data, crc]);
}

function solidPng(red: number, green: number, blue: number): Buffer {
  const width = 512;
  const height = 512;
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  const row = Buffer.alloc(width * 4 + 1);
  for (let x = 0; x < width; x += 1) {
    const offset = 1 + x * 4;
    row[offset] = red;
    row[offset + 1] = green;
    row[offset + 2] = blue;
    row[offset + 3] = 255;
  }
  const pixels = Buffer.alloc(row.length * height);
  for (let y = 0; y < height; y += 1) row.copy(pixels, y * row.length);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(pixels)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function filename(sourceNo: number): string {
  return `card_${String(sourceNo).padStart(3, "0")}.png`;
}

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

interface Fixture {
  root: string;
  manifestPath: string;
  privatePath: string;
  publicManifestPath: string;
  publicCardsPath: string;
  stagePaths: string[];
  originalPaths: string[];
}

async function createFixture(approvalState: "draft" | "root-approved" = "draft"): Promise<Fixture> {
  const root = await mkdtemp(path.join(PRIVATE_ART, "fixture-"));
  const manifestPath = path.join(root, "artifacts/art-readability-v2/manifest-v2.json");
  const privatePath = path.join(root, "artifacts/art-readability-v2/private-provenance-v2.json");
  const stageRoot = path.join(root, "artifacts/art-readability-v2/staging");
  const originalRoot = path.join(root, "artifacts/art-readability-v2/generated-fixture");
  const referenceRoot = path.join(root, "artifacts/legacy-cardhero-assets/card-icons");
  const publicCardsPath = path.join(root, "public/art/cards");
  const publicManifestPath = path.join(root, "public/art/card-art-manifest.json");
  const cardDataSource = await readFile(path.join(ROOT, "src/game/cardData.ts"), "utf8");
  const cardDataMatch = cardDataSource.match(/export const CARD_DEFS = ([\s\S]*?) satisfies Record<string, CardDef>;/);
  if (!cardDataMatch) throw new Error("CARD_DEFS fixture parse failed");
  const cardDefinitions = Object.values(JSON.parse(cardDataMatch[1]) as Record<string, { id: string; sourceNo: number }>);
  const cardIdBySourceNo = new Map(cardDefinitions.map((card) => [card.sourceNo, card.id]));
  await Promise.all([
    mkdir(path.dirname(manifestPath), { recursive: true }),
    mkdir(stageRoot, { recursive: true }),
    mkdir(originalRoot, { recursive: true }),
    mkdir(referenceRoot, { recursive: true }),
    mkdir(publicCardsPath, { recursive: true }),
    mkdir(path.join(root, "src/game"), { recursive: true }),
  ]);
  await copyFile(path.join(ROOT, "src/game/cardData.ts"), path.join(root, "src/game/cardData.ts"));

  const manifestAssets: Array<Record<string, unknown>> = [];
  const privateAssets: Array<Record<string, unknown>> = [];
  const oldPublicAssets: Array<Record<string, unknown>> = [];
  const stagePaths: string[] = [];
  const originalPaths: string[] = [];

  for (let sourceNo = 1; sourceNo <= SOURCE_COUNT; sourceNo += 1) {
    const name = filename(sourceNo);
    const candidate = solidPng(sourceNo, 255 - sourceNo, (sourceNo * 37) % 256);
    const oldAsset = solidPng((sourceNo * 17) % 256, sourceNo, 255 - sourceNo);
    const stagePath = path.join(stageRoot, name);
    const originalPath = path.join(originalRoot, name);
    const publicPath = path.join(publicCardsPath, name);
    await Promise.all([
      writeFile(stagePath, candidate),
      writeFile(originalPath, candidate),
      writeFile(publicPath, oldAsset),
      writeFile(path.join(referenceRoot, `co${String(sourceNo).padStart(3, "0")}.jpg`), Buffer.from(`fixture reference ${sourceNo}`)),
    ]);
    stagePaths.push(stagePath);
    originalPaths.push(originalPath);

    const cardId = cardIdBySourceNo.get(sourceNo);
    if (!cardId) throw new Error(`CARD_DEFS is missing sourceNo ${sourceNo}`);
    const referencePath = path.join(referenceRoot, `co${String(sourceNo).padStart(3, "0")}.jpg`);
    const reference = await readFile(referencePath);
    const digest = hash(candidate);
    manifestAssets.push({
      sourceNo,
      cardId,
      variantId: `redraw-${sourceNo}`,
      variantKind: "reference-redraw",
      status: "approved",
      prompt: `Faithful reference-based redraw for source ${sourceNo}; preserve visible source shape and color blocks.`,
      tool: "built-in image_gen.imagegen",
      referenceSourceNo: sourceNo,
      referenceSHA256: hash(reference),
      rightsStatus: RIGHTS,
      publicPath: `public/art/cards/${name}`,
      url: `/art/cards/${name}`,
      sha256: digest,
      width: 512,
      height: 512,
    });
    privateAssets.push({
      sourceNo,
      variantId: `redraw-${sourceNo}`,
      selectedStagePath: `artifacts/art-readability-v2/staging/${name}`,
      originalGeneratedPath: originalPath,
      expectedSHA: digest,
      referencePath,
      expectedReferenceSHA: hash(reference),
    });
    oldPublicAssets.push({ sourceNo, sha256: hash(oldAsset), prompt: `Previously published v1 prompt for source number ${sourceNo}.` });
  }

  const manifest = { format: "stone-tactics-card-art", version: 2, approvalState, assets: manifestAssets };
  const privateData = { format: "stone-tactics-private-art-provenance", version: 1, assets: privateAssets };
  const currentPublic = { format: "stone-tactics-card-art", version: 1, status: "complete", assets: oldPublicAssets };
  await Promise.all([
    writeJson(manifestPath, manifest),
    writeJson(privatePath, privateData),
    writeJson(publicManifestPath, currentPublic),
  ]);
  execFileSync("git", ["init", "--quiet"], { cwd: root });
  execFileSync("git", ["add", "public/art/card-art-manifest.json"], { cwd: root });
  execFileSync("git", ["-c", "user.name=Art Test", "-c", "user.email=art-test@example.invalid", "commit", "--quiet", "-m", "公開v1 fixture"], { cwd: root });
  return { root, manifestPath, privatePath, publicManifestPath, publicCardsPath, stagePaths, originalPaths };
}

async function snapshotPublic(fixture: Fixture): Promise<{ manifest: string; files: string[] }> {
  const manifest = hash(await readFile(fixture.publicManifestPath));
  const names = (await readdir(fixture.publicCardsPath)).sort();
  const files = await Promise.all(names.map(async (name) => `${name}:${hash(await readFile(path.join(fixture.publicCardsPath, name)))}`));
  return { manifest, files };
}

describe("reference-based v2 card art builder safety", () => {
  let fixture: Fixture;

  beforeEach(async () => {
    await mkdir(PRIVATE_ART, { recursive: true });
    fixture = await createFixture();
  });

  afterEach(async () => {
    if (fixture) await rm(fixture.root, { recursive: true, force: true });
  });

  it("preflights all 150 reference-bound, unique PNG variants without touching public output", async () => {
    const before = await snapshotPublic(fixture);
    const result = await preflightV2Art({ root: fixture.root });

    expect(result.rows).toHaveLength(150);
    expect(new Set(result.rows.map((row) => row.sha256)).size).toBe(150);
    expect(result.publicManifest.assets.every((row) => row.variantKind === "reference-redraw")).toBe(true);
    expect(result.publicManifest.assets.every((row) => row.referenceSourceNo === row.sourceNo && row.referenceSHA256)).toBe(true);
    expect(result.publicManifest.rightsStatus).toContain("not asserted");
    expect(await snapshotPublic(fixture)).toEqual(before);
  });

  it("rejects a source/card mapping change, duplicate, unknown field, and non-approved candidate", async () => {
    const manifest = await readJson<{ assets: Array<Record<string, unknown>> } & Record<string, unknown>>(fixture.manifestPath);
    const original = structuredClone(manifest);
    manifest.assets[0].cardId = "card_002";
    await writeJson(fixture.manifestPath, manifest);
    await expect(preflightV2Art({ root: fixture.root })).rejects.toThrow(/CARD_DEFS/);

    const duplicate = structuredClone(original);
    duplicate.assets[1].sourceNo = 1;
    await writeJson(fixture.manifestPath, duplicate);
    await expect(preflightV2Art({ root: fixture.root })).rejects.toThrow(/重複/);

    const withUnknown = structuredClone(original);
    (withUnknown as Record<string, unknown>).unexpected = true;
    await writeJson(fixture.manifestPath, withUnknown);
    await expect(preflightV2Art({ root: fixture.root })).rejects.toThrow(/未知のfield/);

    const unapproved = structuredClone(original);
    unapproved.assets[0].status = "pending";
    await writeJson(fixture.manifestPath, unapproved);
    await expect(preflightV2Art({ root: fixture.root })).rejects.toThrow(/Root承認済み/);
  });

  it.each([
    "/Users/private/secret.png",
    "/home/runner/secret.png",
    ".codex/generated_images/secret.png",
    "C:\\Users\\private\\secret.png",
  ])("rejects private path leakage in a public prompt (%s)", async (privatePath) => {
    const manifest = await readJson<{ assets: Array<Record<string, unknown>> }>(fixture.manifestPath);
    manifest.assets[0].prompt = `Reference redraw evidence ${privatePath}`;
    await writeJson(fixture.manifestPath, manifest);
    await expect(preflightV2Art({ root: fixture.root })).rejects.toThrow(/private absolute path/i);
  });

  it("rejects reference/staged/original digest mismatches and stage traversal", async () => {
    const manifest = await readJson<{ assets: Array<Record<string, unknown>> }>(fixture.manifestPath);
    const privateData = await readJson<{ assets: Array<Record<string, unknown>> }>(fixture.privatePath);
    const originalManifest = structuredClone(manifest);
    const originalPrivate = structuredClone(privateData);

    privateData.assets[0].expectedReferenceSHA = "0".repeat(64);
    manifest.assets[0].referenceSHA256 = "0".repeat(64);
    await Promise.all([writeJson(fixture.privatePath, privateData), writeJson(fixture.manifestPath, manifest)]);
    await expect(preflightV2Art({ root: fixture.root })).rejects.toThrow(/reference SHA/);

    privateData.assets = originalPrivate.assets;
    privateData.assets[0].selectedStagePath = "../outside.png";
    await writeJson(fixture.privatePath, privateData);
    await expect(preflightV2Art({ root: fixture.root })).rejects.toThrow(/stage path|traversal/);

    privateData.assets = originalPrivate.assets;
    manifest.assets = originalManifest.assets;
    manifest.assets[0].sha256 = "0".repeat(64);
    await Promise.all([writeJson(fixture.privatePath, privateData), writeJson(fixture.manifestPath, manifest)]);
    await expect(preflightV2Art({ root: fixture.root })).rejects.toThrow(/SHA|一致/);

    await writeJson(fixture.manifestPath, originalManifest);
    await writeFile(fixture.originalPaths[0], Buffer.from("tampered generated original"));
    await expect(preflightV2Art({ root: fixture.root })).rejects.toThrow(/original|生成原本|SHA|一致/i);
    await writeJson(fixture.manifestPath, originalManifest);
  });

  it("rejects a symlinked staging image", async () => {
    const stagePath = fixture.stagePaths[0];
    const outsidePath = fixture.originalPaths[0];
    await rm(stagePath);
    await symlink(outsidePath, stagePath);
    await expect(preflightV2Art({ root: fixture.root })).rejects.toThrow(/symlink/);
  });

  it("keeps an explicit unchanged v1 asset in a distinct approved-fallback variant", async () => {
    const manifest = await readJson<{ assets: Array<Record<string, unknown>> }>(fixture.manifestPath);
    const privateData = await readJson<{ assets: Array<Record<string, unknown>> }>(fixture.privatePath);
    const current = await readJson<{ assets: Array<Record<string, unknown>> }>(fixture.publicManifestPath);
    const prior = current.assets[0];
    const oldBytes = await readFile(path.join(fixture.publicCardsPath, filename(1)));
    const asset = manifest.assets[0];
    asset.variantKind = "legacy-v1-retained";
    asset.status = "approved-fallback";
    asset.tool = "previous-v1-manifest";
    asset.prompt = prior.prompt;
    asset.sha256 = prior.sha256;
    asset.rightsStatus = "Previously shipped version-1 AI-generated concept retained unchanged; rights and trademark clearance are not asserted.";
    delete asset.referenceSourceNo;
    delete asset.referenceSHA256;
    const privateAsset = privateData.assets[0];
    privateAsset.expectedSHA = hash(oldBytes);
    privateAsset.selectedStagePath = null;
    privateAsset.originalGeneratedPath = null;
    delete privateAsset.referencePath;
    delete privateAsset.expectedReferenceSHA;
    await Promise.all([writeJson(fixture.manifestPath, manifest), writeJson(fixture.privatePath, privateData)]);

    const result = await preflightV2Art({ root: fixture.root });
    expect(result.rows[0].variantKind).toBe("legacy-v1-retained");
    expect(result.rows[0].status).toBe("approved-fallback");
    expect(result.publicManifest.assets[0].variantKind).toBe("legacy-v1-retained");

    const validManifest = structuredClone(manifest);
    const validPrivate = structuredClone(privateData);
    const withFalseReference = structuredClone(validManifest);
    withFalseReference.assets[0].referenceSourceNo = 1;
    withFalseReference.assets[0].referenceSHA256 = "0".repeat(64);
    await writeJson(fixture.manifestPath, withFalseReference);
    await expect(preflightV2Art({ root: fixture.root })).rejects.toThrow(/reference-redraw出典/);

    const changedPrompt = structuredClone(validManifest);
    changedPrompt.assets[0].prompt = "This is a changed retained prompt and must not replace the original v1 record.";
    await writeJson(fixture.manifestPath, changedPrompt);
    await expect(preflightV2Art({ root: fixture.root })).rejects.toThrow(/元のv1記録/);

    const wrongFallbackStatus = structuredClone(validManifest);
    wrongFallbackStatus.assets[0].status = "approved";
    await writeJson(fixture.manifestPath, wrongFallbackStatus);
    await expect(preflightV2Art({ root: fixture.root })).rejects.toThrow(/legacy権利表示/);

    const v1Candidate = structuredClone(validManifest) as Record<string, unknown>;
    v1Candidate.version = 1;
    await writeJson(fixture.manifestPath, v1Candidate);
    await expect(preflightV2Art({ root: fixture.root })).rejects.toThrow(/format\/version/);

    await Promise.all([writeJson(fixture.manifestPath, validManifest), writeJson(fixture.privatePath, validPrivate)]);
  });

  it("default CLI invocation is a dry-run and does not alter public files", async () => {
    const before = await snapshotPublic(fixture);
    const output = execFileSync(process.execPath, [BUILDER], { cwd: fixture.root, encoding: "utf8" });
    expect(output).toContain("dry-run PASS");
    expect(output).toContain("public files は変更していません");
    expect(await snapshotPublic(fixture)).toEqual(before);
  });

  it("refuses publishing until root-approved and refuses v1/public divergence without mutation", async () => {
    const before = await snapshotPublic(fixture);
    await expect(publishV2Art({ root: fixture.root })).rejects.toThrow(/Rootが承認/);
    expect(await snapshotPublic(fixture)).toEqual(before);

    const rowPath = path.join(fixture.publicCardsPath, filename(1));
    await writeFile(rowPath, Buffer.from("user edit"));
    const divergent = await snapshotPublic(fixture);
    const manifest = await readJson<Record<string, unknown>>(fixture.manifestPath);
    manifest.approvalState = "root-approved";
    await writeJson(fixture.manifestPath, manifest);
    await expect(publishV2Art({ root: fixture.root })).rejects.toThrow(/manifest\/hashが一致/);
    expect(await snapshotPublic(fixture)).toEqual(divergent);
  });

  it("publishes atomically once and treats an identical v2 rerun as a no-op", async () => {
    const manifest = await readJson<Record<string, unknown>>(fixture.manifestPath);
    manifest.approvalState = "root-approved";
    await writeJson(fixture.manifestPath, manifest);

    const published = await publishV2Art({ root: fixture.root });
    expect(published.count).toBe(150);
    const afterPublish = await snapshotPublic(fixture);
    expect(afterPublish.files).toHaveLength(150);
    const noOp = await publishV2Art({ root: fixture.root });
    expect(noOp).toEqual({ count: 0, backupDirectory: null });
    expect(await snapshotPublic(fixture)).toEqual(afterPublish);

    const existing = await readJson<Record<string, unknown>>(fixture.publicManifestPath);
    const tampered = { ...existing, unexpected: "unknown user/public edit" };
    await writeJson(fixture.publicManifestPath, tampered);
    const tamperedSnapshot = await snapshotPublic(fixture);
    await expect(publishV2Art({ root: fixture.root })).rejects.toThrow(/未知の差分/);
    expect(await snapshotPublic(fixture)).toEqual(tamperedSnapshot);
  });

  it("restores the exact v1 public files when the fourth swap rename fails", async () => {
    const manifest = await readJson<Record<string, unknown>>(fixture.manifestPath);
    manifest.approvalState = "root-approved";
    await writeJson(fixture.manifestPath, manifest);
    const before = await snapshotPublic(fixture);
    let renameCalls = 0;
    const swapError = new Error("injected fourth swap rename failure");

    await expect(publishV2Art({
      root: fixture.root,
      transactionFs: {
        rename: async (from, to) => {
          renameCalls += 1;
          if (renameCalls === 4) throw swapError;
          await rename(from, to);
        },
        rm,
      },
    })).rejects.toBe(swapError);

    expect(renameCalls).toBe(6);
    expect(await snapshotPublic(fixture)).toEqual(before);
  });

  it("surfaces the publish and rollback failures together with a recoverable backup path", async () => {
    const before = await snapshotPublic(fixture);
    const manifest = await readJson<Record<string, unknown>>(fixture.manifestPath);
    manifest.approvalState = "root-approved";
    await writeJson(fixture.manifestPath, manifest);
    const swapError = new Error("injected fourth swap rename failure");
    const rollbackRenameError = new Error("injected card restoration rename failure");
    const rollbackRmError = new Error("injected new-card cleanup failure");
    let renameCalls = 0;

    let caught: unknown;
    try {
      await publishV2Art({
        root: fixture.root,
        transactionFs: {
          rename: async (from, to) => {
            renameCalls += 1;
            if (renameCalls === 4) throw swapError;
            if (renameCalls === 5) throw rollbackRenameError;
            await rename(from, to);
          },
          rm: async (target, options) => {
            if (target === fixture.publicCardsPath && options?.recursive) throw rollbackRmError;
            await rm(target, options);
          },
        },
      });
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(AggregateError);
    const aggregate = caught as AggregateError;
    expect(aggregate.errors).toEqual([swapError, rollbackRmError, rollbackRenameError]);
    expect(aggregate.message).toContain("artifacts/art-readability-v2/publish-backup/transaction-");
    expect(renameCalls).toBe(6);

    const transactionRoot = aggregate.message.split("復旧元: ")[1];
    expect(transactionRoot).toBeTruthy();
    const backupCardsPath = path.join(transactionRoot, "previous-cards");
    const backupFiles = (await readdir(backupCardsPath)).sort();
    expect(backupFiles).toHaveLength(SOURCE_COUNT);
    const backedUpCards = await Promise.all(backupFiles.map(async (name) => `${name}:${hash(await readFile(path.join(backupCardsPath, name)))}`));
    expect(backedUpCards).toEqual(before.files);
    expect(hash(await readFile(fixture.publicManifestPath))).toBe(before.manifest);
  });
});
