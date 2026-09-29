import {
  lstat,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const MANIFEST_RELATIVE = "artifacts/art-readability-v2/manifest-v2.json";
const PRIVATE_RELATIVE = "artifacts/art-readability-v2/private-provenance-v2.json";
const PUBLIC_DIR_RELATIVE = "public/art/cards";
const PUBLIC_MANIFEST_RELATIVE = "public/art/card-art-manifest.json";
const FORMAT = "stone-tactics-card-art";
const RIGHTS_REFERENCE_REDRAW = "Reference-based redraw of supplied card artwork; rights and trademark clearance are not asserted.";
const RIGHTS_V1_RETAINED = "Previously shipped version-1 AI-generated concept retained unchanged; rights and trademark clearance are not asserted.";
const RIGHTS_MANIFEST_SUMMARY = "This set may include reference-based redraws and explicitly approved retained assets; each asset records its own provenance and rights status. Rights and trademark clearance are not asserted.";
const CARD_COUNT = 150;
const HEX_SHA = /^[a-f0-9]{64}$/;

const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const cardFilename = (sourceNo) => `card_${String(sourceNo).padStart(3, "0")}.png`;
const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function assertSafeRelativePath(value, label) {
  if (typeof value !== "string" || value.length === 0 || path.isAbsolute(value) || value.includes("\\")) {
    throw new Error(`${label}: repository-relative path が必要です。`);
  }
  const normalized = path.posix.normalize(value);
  if (normalized !== value || normalized === "." || normalized.startsWith("../") || normalized.split("/").includes("..")) {
    throw new Error(`${label}: path traversal は許可されません。`);
  }
  return value;
}

async function assertNoSymlink(root, relativePath, label) {
  const safePath = assertSafeRelativePath(relativePath, label);
  const pieces = safePath.split("/");
  let current = root;
  for (const piece of pieces) {
    current = path.join(current, piece);
    const info = await lstat(current).catch(() => undefined);
    if (!info) throw new Error(`${label}: ファイルがありません (${safePath})。`);
    if (info.isSymbolicLink()) throw new Error(`${label}: symlink は許可されません (${safePath})。`);
  }
  const resolved = path.resolve(root, safePath);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) throw new Error(`${label}: repository外です。`);
  return resolved;
}

async function assertNoSymlinkComponents(root, relativePath, label) {
  const safePath = assertSafeRelativePath(relativePath, label);
  let current = root;
  for (const piece of safePath.split("/")) {
    current = path.join(current, piece);
    const info = await lstat(current).catch(() => undefined);
    if (!info) break;
    if (info.isSymbolicLink()) throw new Error(`${label}: symlink は許可されません (${safePath})。`);
  }
  return path.resolve(root, safePath);
}

async function assertNoSymlinkAbsolute(value, label) {
  if (typeof value !== "string" || !path.isAbsolute(value)) throw new Error(`${label}: 検証可能なabsolute pathが必要です。`);
  const resolved = path.resolve(value);
  const parsed = path.parse(resolved);
  let current = parsed.root;
  for (const piece of resolved.slice(parsed.root.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, piece);
    const info = await lstat(current).catch(() => undefined);
    if (!info) throw new Error(`${label}: ファイルがありません。`);
    if (info.isSymbolicLink()) throw new Error(`${label}: symlink は許可されません。`);
  }
  return resolved;
}

async function loadCardDefs(root) {
  const source = await readFile(path.join(root, "src/game/cardData.ts"), "utf8");
  const match = source.match(/export const CARD_DEFS = ([\s\S]*?) satisfies Record<string, CardDef>;/);
  if (!match) throw new Error("CARD_DEFS を安全に読み取れません。");
  const definitions = JSON.parse(match[1]);
  const bySourceNo = new Map();
  const cardIds = new Set();
  for (const card of Object.values(definitions)) {
    if (typeof card.id !== "string" || card.id.trim().length === 0) throw new Error("CARD_DEFS に空または非文字列のcard.idがあります。");
    if (cardIds.has(card.id)) throw new Error(`CARD_DEFS のcard.id ${card.id} が重複しています。`);
    cardIds.add(card.id);
    if (!Number.isInteger(card.sourceNo) || card.sourceNo < 1 || card.sourceNo > CARD_COUNT) {
      throw new Error(`CARD_DEFS に無効なsourceNoがあります (${card.id})。`);
    }
    if (bySourceNo.has(card.sourceNo)) throw new Error(`CARD_DEFS のsourceNo ${card.sourceNo} が重複しています。`);
    const expectedUrl = `/art/cards/${cardFilename(card.sourceNo)}`;
    if (card.icon !== expectedUrl) throw new Error(`CARD_DEFS ${card.id} の画像URLがsourceNo規約と一致しません。`);
    bySourceNo.set(card.sourceNo, card);
  }
  if (bySourceNo.size !== CARD_COUNT || cardIds.size !== CARD_COUNT) throw new Error(`CARD_DEFS はsourceNo/card.idとも1..150件一意である必要があります (sourceNo=${bySourceNo.size}, card.id=${cardIds.size})。`);
  return bySourceNo;
}

function assertNoPrivateAbsolutePaths(publicManifest) {
  const serialized = JSON.stringify(publicManifest);
  if (/\/(?:Users|home|tmp|private|var|etc|Volumes|root|mnt|opt|usr|System|Applications)\/[^\s"']+/i.test(serialized) ||
      /(?:^|[\s"'=])(?:~\/|\.codex\/generated_images\/|\/[^\s"']*\/\.codex\/generated_images\/)[^\s"']*/i.test(serialized) ||
      /[A-Z]:\\[^\s"']+/i.test(serialized) || /file:\/\//i.test(serialized)) {
    throw new Error("公開manifestにprivate absolute pathが含まれています。");
  }
}

function checkManifestShape(manifest, privateData) {
  if (!isPlainObject(manifest) || manifest.format !== FORMAT || manifest.version !== 2 || !Array.isArray(manifest.assets)) {
    throw new Error("manifest-v2.json のformat/version/assetsが不正です。");
  }
  if (!isPlainObject(privateData) || privateData.format !== "stone-tactics-private-art-provenance" || privateData.version !== 1 || !Array.isArray(privateData.assets)) {
    throw new Error("private-provenance-v2.json のformat/version/assetsが不正です。");
  }
  if (manifest.assets.length !== CARD_COUNT || privateData.assets.length !== CARD_COUNT) {
    throw new Error(`全150件が必要です (public=${manifest.assets.length}, private=${privateData.assets.length})。`);
  }
  if (manifest.approvalState !== "draft" && manifest.approvalState !== "root-approved") {
    throw new Error("approvalState は draft または root-approved でなければなりません。");
  }
  assertAllowedKeys(manifest, ["format", "version", "approvalState", "assets"], "manifest-v2");
  assertAllowedKeys(privateData, ["format", "version", "assets"], "private provenance");
  const publicRows = new Map();
  for (const row of manifest.assets) {
    if (!isPlainObject(row) || !Number.isInteger(row.sourceNo) || row.sourceNo < 1 || row.sourceNo > CARD_COUNT) {
      throw new Error("manifest に無効なsourceNoがあります。");
    }
    if (publicRows.has(row.sourceNo)) throw new Error(`manifest のsourceNo ${row.sourceNo} が重複しています。`);
    assertAllowedKeys(row, ["sourceNo", "cardId", "variantId", "variantKind", "status", "prompt", "tool", "referenceSourceNo", "referenceSHA256", "rightsStatus", "publicPath", "url", "sha256", "width", "height"], `manifest sourceNo ${row.sourceNo}`);
    publicRows.set(row.sourceNo, row);
  }
  const privateRows = new Map();
  for (const row of privateData.assets) {
    if (!isPlainObject(row) || !Number.isInteger(row.sourceNo) || row.sourceNo < 1 || row.sourceNo > CARD_COUNT) {
      throw new Error("private provenance に無効なsourceNoがあります。");
    }
    if (privateRows.has(row.sourceNo)) throw new Error(`private provenance のsourceNo ${row.sourceNo} が重複しています。`);
    assertAllowedKeys(row, ["sourceNo", "variantId", "selectedStagePath", "originalGeneratedPath", "expectedSHA", "referencePath", "expectedReferenceSHA"], `private provenance sourceNo ${row.sourceNo}`);
    privateRows.set(row.sourceNo, row);
  }
  for (let number = 1; number <= CARD_COUNT; number += 1) {
    if (!publicRows.has(number) || !privateRows.has(number)) throw new Error(`sourceNo ${number} がmanifestから欠落しています。`);
  }
  return { publicRows, privateRows };
}

function assertAllowedKeys(value, allowedKeys, label) {
  const allowed = new Set(allowedKeys);
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length > 0) throw new Error(`${label}: 未知のfieldを拒否します (${unknown.join(", ")})。`);
}

async function readAndVerifyImage(root, row, privateRow, card, currentPublic) {
  const cardId = card.id;
  if (row.cardId !== cardId || row.sourceNo !== card.sourceNo) throw new Error(`sourceNo ${row.sourceNo} と実CARD_DEFSのcardIdが一致しません。`);
  const expectedPublicPath = `${PUBLIC_DIR_RELATIVE}/${cardFilename(row.sourceNo)}`;
  const expectedUrl = `/art/cards/${cardFilename(row.sourceNo)}`;
  if (row.publicPath !== expectedPublicPath || row.url !== expectedUrl || card.icon !== expectedUrl) {
    throw new Error(`sourceNo ${row.sourceNo} の公開path/urlが安定URL規約に一致しません。`);
  }
  if (row.status !== "approved" && row.status !== "approved-fallback") throw new Error(`sourceNo ${row.sourceNo} はRoot承認済みではありません。`);
  if (typeof row.variantId !== "string" || row.variantId.length < 1) throw new Error(`sourceNo ${row.sourceNo} のvariantIdがありません。`);
  if (typeof row.prompt !== "string" || row.prompt.trim().length < 20) throw new Error(`sourceNo ${row.sourceNo} の完全promptがありません。`);
  if (typeof row.tool !== "string" || row.tool.trim().length < 3) throw new Error(`sourceNo ${row.sourceNo} の生成tool記録がありません。`);
  if (!HEX_SHA.test(row.sha256 ?? "")) throw new Error(`sourceNo ${row.sourceNo} のSHA-256が不正です。`);

  let bytes;
  if (row.variantKind === "reference-redraw") {
    if (row.status !== "approved" || row.rightsStatus !== RIGHTS_REFERENCE_REDRAW) throw new Error(`sourceNo ${row.sourceNo} の権利/承認表示が不正です。`);
    if (row.tool !== "built-in image_gen.imagegen") throw new Error(`sourceNo ${row.sourceNo} のreference redraw toolが不正です。`);
    if (privateRow.sourceNo !== row.sourceNo || privateRow.variantId !== row.variantId || privateRow.expectedSHA !== row.sha256) {
      throw new Error(`sourceNo ${row.sourceNo} のprivate asset選択/SHAが公開候補と一致しません。`);
    }
    const cardStem = cardFilename(row.sourceNo).replace(".png", "");
    if (typeof privateRow.selectedStagePath !== "string" ||
        !new RegExp(`^artifacts/art-readability-v2/staging/${cardStem}(?:-revision-[1-9][0-9]*)?\\.png$`).test(privateRow.selectedStagePath)) {
      throw new Error(`sourceNo ${row.sourceNo} のstage pathがカード別staging allowlist外です。`);
    }
    if (privateRow.originalGeneratedPath == null || !HEX_SHA.test(privateRow.expectedSHA ?? "")) {
      throw new Error(`sourceNo ${row.sourceNo} の生成原本evidenceがありません。`);
    }
    if (typeof privateRow.referencePath !== "string" || !HEX_SHA.test(privateRow.expectedReferenceSHA ?? "") ||
        row.referenceSHA256 !== privateRow.expectedReferenceSHA || row.referenceSourceNo !== row.sourceNo) {
      throw new Error(`sourceNo ${row.sourceNo} の元画像reference evidenceがありません。`);
    }
    const expectedReferencePath = path.join(root, "artifacts/legacy-cardhero-assets/card-icons", `co${String(row.sourceNo).padStart(3, "0")}.jpg`);
    const referencePath = await assertNoSymlinkAbsolute(privateRow.referencePath, `sourceNo ${row.sourceNo} reference`);
    if (referencePath !== expectedReferencePath) throw new Error(`sourceNo ${row.sourceNo} reference pathがsourceNo規約に一致しません。`);
    const referenceBytes = await readFile(referencePath);
    if (sha256(referenceBytes) !== privateRow.expectedReferenceSHA) throw new Error(`sourceNo ${row.sourceNo} reference SHAが一致しません。`);
    const stagePath = await assertNoSymlink(root, privateRow.selectedStagePath, `sourceNo ${row.sourceNo} staging`);
    const originalPath = await assertNoSymlinkAbsolute(privateRow.originalGeneratedPath, `sourceNo ${row.sourceNo} generated original`);
    const [staged, original] = await Promise.all([readFile(stagePath), readFile(originalPath)]);
    if (sha256(staged) !== row.sha256 || sha256(original) !== row.sha256) throw new Error(`sourceNo ${row.sourceNo} staged/original SHAが一致しません。`);
    bytes = staged;
  } else if (row.variantKind === "legacy-v1-retained") {
    if (row.status !== "approved-fallback" || row.rightsStatus !== RIGHTS_V1_RETAINED) throw new Error(`sourceNo ${row.sourceNo} のlegacy権利表示が不正です。`);
    if (row.tool !== "previous-v1-manifest") throw new Error(`sourceNo ${row.sourceNo} のlegacy provenance toolが不正です。`);
    const prior = currentPublic.rows.get(row.sourceNo);
    if (!prior || prior.sha256 !== row.sha256) throw new Error(`sourceNo ${row.sourceNo} のlegacy v1 source/hashが現行v1 manifestと一致しません。`);
    if (row.prompt !== prior.prompt) throw new Error(`sourceNo ${row.sourceNo} のlegacy-retained promptは元のv1記録から変更できません。`);
    if (row.referenceSourceNo != null || row.referenceSHA256 != null || privateRow.referencePath != null || privateRow.expectedReferenceSHA != null) {
      throw new Error(`sourceNo ${row.sourceNo} のlegacy-retained assetにreference-redraw出典を付与できません。`);
    }
    if (currentPublic.version === 2 && prior.variantKind !== "legacy-v1-retained") {
      throw new Error(`sourceNo ${row.sourceNo} の現行v2 assetはlegacy-v1-retained fallbackとして再分類できません。`);
    }
    if (privateRow.sourceNo !== row.sourceNo || privateRow.variantId !== row.variantId || privateRow.expectedSHA !== row.sha256 ||
        privateRow.selectedStagePath !== null || privateRow.originalGeneratedPath !== null) {
      throw new Error(`sourceNo ${row.sourceNo} のlegacy-retained sidecarが不正です。`);
    }
    const legacyPath = await assertNoSymlink(root, expectedPublicPath, `sourceNo ${row.sourceNo} existing v1 asset`);
    bytes = await readFile(legacyPath);
    if (sha256(bytes) !== row.sha256) throw new Error(`sourceNo ${row.sourceNo} の既存v1画像が期待SHAと一致しません。`);
  } else {
    throw new Error(`sourceNo ${row.sourceNo} のvariantKindは未対応です。`);
  }

  const actualHash = sha256(bytes);
  if (actualHash !== row.sha256) throw new Error(`sourceNo ${row.sourceNo} の画像SHAが一致しません。`);
  if (bytes.length < 24 || bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") throw new Error(`sourceNo ${row.sourceNo} はPNGではありません。`);
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width < 512 || width !== height || row.width !== width || row.height !== height) throw new Error(`sourceNo ${row.sourceNo} は正方形512px以上の画像ではありません。`);
  return { bytes, width, height, hash: actualHash };
}

async function readCurrentPublicManifest(root) {
  const manifestPath = path.join(root, PUBLIC_MANIFEST_RELATIVE);
  await assertNoSymlinkAbsolute(manifestPath, "公開manifest");
  const parsed = JSON.parse(await readFile(manifestPath, "utf8"));
  if (parsed.format !== FORMAT || ![1, 2].includes(parsed.version) || parsed.status !== "complete" || !Array.isArray(parsed.assets)) {
    throw new Error("現在の公開manifestは既知のv1/v2形式ではありません。上書きを拒否します。");
  }
  const rows = new Map(parsed.assets.map((item) => [item.sourceNo, item]));
  if (rows.size !== CARD_COUNT) throw new Error("既存manifestが150件ではありません。上書きを拒否します。");
  await assertNoSymlinkAbsolute(path.join(root, PUBLIC_DIR_RELATIVE), "公開カードdirectory");
  return { parsed, rows, bytes: await readFile(manifestPath), version: parsed.version };
}

async function assertCurrentPublicMatchesTrustedManifest(root, current) {
  const manifestRelative = PUBLIC_MANIFEST_RELATIVE;
  let baselineManifest;
  try {
    baselineManifest = execFileSync("git", ["show", `HEAD:${manifestRelative}`], { cwd: root, stdio: ["ignore", "pipe", "ignore"], maxBuffer: 16 * 1024 * 1024 });
  } catch {
    throw new Error("既存公開manifestのGit基準値を確認できません。安全のためpublishを停止しました。");
  }
  if (current.version === 1) {
    if (sha256(baselineManifest) !== sha256(current.bytes)) throw new Error("現行v1 manifestに未承認の変更があります。上書きを拒否します。");
  } else if (current.version !== 2) {
    throw new Error("既知の公開versionではありません。");
  }
  const expectedNames = new Set(Array.from({ length: CARD_COUNT }, (_, index) => cardFilename(index + 1)));
  const actualNames = await readdir(path.join(root, PUBLIC_DIR_RELATIVE));
  if (actualNames.length !== CARD_COUNT || actualNames.some((name) => !expectedNames.has(name))) {
    throw new Error("現行公開cards directoryに150件以外の未知ファイルがあります。上書きを拒否します。");
  }
  for (let number = 1; number <= CARD_COUNT; number += 1) {
    const relative = `${PUBLIC_DIR_RELATIVE}/${cardFilename(number)}`;
    const absolute = path.join(root, relative);
    const info = await lstat(absolute).catch(() => undefined);
    if (!info || info.isSymbolicLink() || !info.isFile()) throw new Error(`現行公開画像が通常ファイルではありません (${relative})。`);
    const actual = await readFile(absolute);
    const manifestRow = current.rows.get(number);
    if (!manifestRow || manifestRow.sha256 !== sha256(actual)) throw new Error(`現行manifest/hashが一致しません (${relative})。`);
  }
}

function createPublicManifest(rows) {
  const manifest = {
    format: FORMAT,
    version: 2,
    status: "complete",
    rightsStatus: RIGHTS_MANIFEST_SUMMARY,
    assets: rows.map((row) => ({
      sourceNo: row.sourceNo,
      cardId: row.cardId,
      variantId: row.variantId,
      variantKind: row.variantKind,
      path: row.publicPath,
      url: row.url,
      sha256: row.sha256,
      width: row.width,
      height: row.height,
      tool: row.tool,
      prompt: row.prompt,
      ...(row.referenceSHA256 ? { referenceSourceNo: row.referenceSourceNo, referenceSHA256: row.referenceSHA256 } : {}),
      rightsStatus: row.rightsStatus,
    })),
  };
  assertNoPrivateAbsolutePaths(manifest);
  return manifest;
}

export async function preflightV2Art({ root = process.cwd() } = {}) {
  const resolvedRoot = path.resolve(root);
  await assertNoSymlinkAbsolute(resolvedRoot, "repository root");
  await assertNoSymlink(resolvedRoot, MANIFEST_RELATIVE, "v2 manifest");
  await assertNoSymlink(resolvedRoot, PRIVATE_RELATIVE, "private v2 provenance");
  const [manifestBytes, privateBytes] = await Promise.all([
    readFile(path.join(resolvedRoot, MANIFEST_RELATIVE)),
    readFile(path.join(resolvedRoot, PRIVATE_RELATIVE)),
  ]);
  const manifest = JSON.parse(manifestBytes.toString("utf8"));
  const privateData = JSON.parse(privateBytes.toString("utf8"));
  const { publicRows, privateRows } = checkManifestShape(manifest, privateData);
  const cards = await loadCardDefs(resolvedRoot);
  const currentPublic = await readCurrentPublicManifest(resolvedRoot);
  const preparedRows = [];
  const sourceHashes = new Set();
  const targetPaths = new Set();
  for (let sourceNo = 1; sourceNo <= CARD_COUNT; sourceNo += 1) {
    const row = publicRows.get(sourceNo);
    const privateRow = privateRows.get(sourceNo);
    const card = cards.get(sourceNo);
    const checked = await readAndVerifyImage(resolvedRoot, row, privateRow, card, currentPublic);
    if (sourceHashes.has(checked.hash)) throw new Error(`sourceNo ${sourceNo} のSHAが他カードと重複しています。`);
    sourceHashes.add(checked.hash);
    if (targetPaths.has(row.publicPath)) throw new Error(`公開pathが重複しています (${row.publicPath})。`);
    targetPaths.add(row.publicPath);
    preparedRows.push({ ...row, ...checked });
  }
  if (preparedRows.length !== CARD_COUNT || targetPaths.size !== CARD_COUNT || sourceHashes.size !== CARD_COUNT) {
    throw new Error("sourceNo/cardId/artworkの一対一性を確認できません。");
  }
  if (manifest.approvalState === "root-approved") {
    const approvedCount = manifest.assets.filter((entry) => entry.status === "approved" || entry.status === "approved-fallback").length;
    if (approvedCount !== CARD_COUNT) throw new Error("Root承認済み状態には150件すべての明示承認variantが必要です。");
  }
  return { manifest, currentPublic, rows: preparedRows, publicManifest: createPublicManifest(preparedRows) };
}

async function ensureOutputDirectoryIsOrdinary(root, relativePath) {
  const absolute = path.join(root, relativePath);
  const info = await lstat(absolute).catch(() => undefined);
  if (info?.isSymbolicLink()) throw new Error(`公開先ディレクトリがsymlinkです: ${relativePath}`);
  if (info && !info.isDirectory()) throw new Error(`公開先がdirectoryではありません: ${relativePath}`);
  return absolute;
}

export async function publishV2Art({ root = process.cwd(), transactionFs } = {}) {
  const resolvedRoot = path.resolve(root);
  const prepared = await preflightV2Art({ root: resolvedRoot });
  if (prepared.manifest.approvalState !== "root-approved") throw new Error("公開にはRootが承認した approvalState=root-approved が必要です。");
  const publicRoot = await ensureOutputDirectoryIsOrdinary(resolvedRoot, "public/art");
  const currentManifestPath = path.join(resolvedRoot, PUBLIC_MANIFEST_RELATIVE);
  const currentCardsPath = path.join(resolvedRoot, PUBLIC_DIR_RELATIVE);
  await assertNoSymlinkAbsolute(publicRoot, "public/art");
  await assertNoSymlinkAbsolute(currentManifestPath, "公開manifest");
  await assertNoSymlinkAbsolute(currentCardsPath, "公開カードdirectory");
  await assertCurrentPublicMatchesTrustedManifest(resolvedRoot, prepared.currentPublic);
  if (prepared.currentPublic.version === 2) {
    const currentCanonical = `${JSON.stringify(prepared.currentPublic.parsed, null, 2)}\n`;
    const expectedCanonical = `${JSON.stringify(prepared.publicManifest, null, 2)}\n`;
    if (currentCanonical !== expectedCanonical) throw new Error("現行v2公開物に未知の差分があります。上書きを拒否します。");
    console.log("公開済みv2と同一です。no-op (public files は変更していません)。");
    return { count: 0, backupDirectory: null };
  }
  const transactionOperations = transactionFs ?? { rename, rm };
  if (!isPlainObject(transactionOperations) || typeof transactionOperations.rename !== "function" || typeof transactionOperations.rm !== "function") {
    throw new Error("transactionFsにはrename/rm関数が必要です。");
  }
  const artInfo = await lstat(publicRoot);
  if (artInfo.isSymbolicLink()) throw new Error("public/art がsymlinkのためpublishを拒否しました。");

  const backupParent = path.join(resolvedRoot, "artifacts/art-readability-v2/publish-backup");
  await assertNoSymlinkComponents(resolvedRoot, "artifacts/art-readability-v2/publish-backup", "backup directory");
  await mkdir(backupParent, { recursive: true });
  await assertNoSymlinkAbsolute(backupParent, "private backup directory");
  const transactionRoot = await mkdtemp(path.join(backupParent, "transaction-"));
  await assertNoSymlinkAbsolute(transactionRoot, "publish transaction directory");
  const nextCards = path.join(transactionRoot, "cards-v2");
  const nextManifest = path.join(transactionRoot, "manifest-v2.json");
  const backupCards = path.join(transactionRoot, "previous-cards");
  const backupManifest = path.join(transactionRoot, "previous-manifest.json");
  let oldCardsMoved = false;
  let oldManifestMoved = false;
  let newCardsMoved = false;
  let newManifestMoved = false;
  try {
    await mkdir(nextCards, { recursive: true });
    for (const row of prepared.rows) await writeFile(path.join(nextCards, cardFilename(row.sourceNo)), row.bytes);
    await writeFile(nextManifest, `${JSON.stringify(prepared.publicManifest, null, 2)}\n`, "utf8");
    const currentBeforeSwap = await readCurrentPublicManifest(resolvedRoot);
    if (sha256(currentBeforeSwap.bytes) !== sha256(prepared.currentPublic.bytes)) {
      throw new Error("出力準備中に公開manifestが変更されました。公開を中止します。");
    }
    await assertNoSymlinkAbsolute(publicRoot, "public/art");
    await assertNoSymlinkAbsolute(currentCardsPath, "公開カードdirectory");
    await assertNoSymlinkAbsolute(currentManifestPath, "公開manifest");
    await assertCurrentPublicMatchesTrustedManifest(resolvedRoot, currentBeforeSwap);
    await transactionOperations.rename(currentCardsPath, backupCards);
    oldCardsMoved = true;
    await transactionOperations.rename(currentManifestPath, backupManifest);
    oldManifestMoved = true;
    await transactionOperations.rename(nextCards, currentCardsPath);
    newCardsMoved = true;
    await transactionOperations.rename(nextManifest, currentManifestPath);
    newManifestMoved = true;
    const publishedManifest = JSON.parse(await readFile(currentManifestPath, "utf8"));
    assertNoPrivateAbsolutePaths(publishedManifest);
    for (const row of prepared.rows) {
      if (sha256(await readFile(path.join(currentCardsPath, cardFilename(row.sourceNo)))) !== row.sha256) {
        throw new Error(`公開後検証に失敗しました (${row.sourceNo})。`);
      }
    }
  } catch (error) {
    const rollbackErrors = [];
    if (newManifestMoved) await transactionOperations.rm(currentManifestPath, { force: true }).catch((rollbackError) => rollbackErrors.push(rollbackError));
    if (newCardsMoved) await transactionOperations.rm(currentCardsPath, { recursive: true, force: true }).catch((rollbackError) => rollbackErrors.push(rollbackError));
    if (oldCardsMoved) await transactionOperations.rename(backupCards, currentCardsPath).catch((rollbackError) => rollbackErrors.push(rollbackError));
    if (oldManifestMoved) await transactionOperations.rename(backupManifest, currentManifestPath).catch((rollbackError) => rollbackErrors.push(rollbackError));
    if (rollbackErrors.length > 0) {
      throw new AggregateError([error, ...rollbackErrors], `公開に失敗し、rollbackも完了できませんでした。復旧元: ${transactionRoot}`);
    }
    throw error;
  }
  console.log(`公開成功: ${prepared.rows.length}件。以前の公開物はprivate backup ${path.relative(resolvedRoot, transactionRoot)} に保持しました。`);
  return { count: prepared.rows.length, backupDirectory: transactionRoot };
}

async function main(args) {
  const unknown = args.filter((arg) => arg !== "--publish-v2");
  if (unknown.length > 0) throw new Error(`未知の引数です: ${unknown.join(" ")}`);
  if (args.includes("--publish-v2")) {
    await publishV2Art();
    return;
  }
  const result = await preflightV2Art();
  console.log(`dry-run PASS: ${result.rows.length}件すべて検証済み。public files は変更していません。公開には --publish-v2 とRoot承認manifestが必要です。`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(`アートpreflight/publishを中止しました: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
