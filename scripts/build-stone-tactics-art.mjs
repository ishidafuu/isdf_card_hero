import { copyFile, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const STAGING_DIR = path.join(ROOT, "output/card-art-staging");
const PUBLIC_DIR = path.join(ROOT, "public/art/cards");
const PUBLIC_MANIFEST = path.join(ROOT, "public/art/card-art-manifest.json");
const PRIVATE_051_100 = path.join(ROOT, "docs/art-staging/staging-metadata-private-051-100.json");
const PRIVATE_101_150 = path.join(ROOT, "docs/art-staging/staging-metadata-private-101-150.json");
const RIGHTS_STATUS = "AI-generated original concepts; rights or trademark clearance is not asserted.";

const cardDataText = await readFile(path.join(ROOT, "src/game/cardData.ts"), "utf8");
const cardDataMatch = cardDataText.match(/export const CARD_DEFS = ([\s\S]*?) satisfies Record<string, CardDef>;/);
if (!cardDataMatch) throw new Error("CARD_DEFS を読み取れません。");
const cardDefs = JSON.parse(cardDataMatch[1]);
const cardBySourceNo = new Map();
const cardById = new Map(Object.values(cardDefs).map((card) => [card.id, card]));
for (const card of Object.values(cardDefs)) {
  if (!Number.isInteger(card.sourceNo) || card.sourceNo < 1 || card.sourceNo > 150) continue;
  if (cardBySourceNo.has(card.sourceNo)) throw new Error(`sourceNo ${card.sourceNo} が重複しています。`);
  cardBySourceNo.set(card.sourceNo, card);
}

const subjectFiles = [
  "docs/art-staging/card-art-subjects-002-050.json",
  "docs/art-staging/card-art-subjects-051-100.json",
  "docs/art-staging/card-art-subjects-101-150.json",
];
const subjects = new Map();
for (const filename of subjectFiles) {
  const document = JSON.parse(await readFile(path.join(ROOT, filename), "utf8"));
  for (const item of document.subjects ?? []) {
    const sourceNo = item.sourceNo ?? cardById.get(item.cardId)?.sourceNo;
    if (!Number.isInteger(sourceNo)) throw new Error(`subject ${item.cardId} のsourceNoを解決できません。`);
    if (subjects.has(sourceNo)) throw new Error(`subject sourceNo ${sourceNo} が重複しています。`);
    subjects.set(sourceNo, { ...item, sourceNo });
  }
}

const manifest05100 = JSON.parse(await readFile(path.join(STAGING_DIR, "manifest-051-100.json"), "utf8"));
const private05100 = JSON.parse(await readFile(PRIVATE_051_100, "utf8"));
const manifest101150 = JSON.parse(await readFile(path.join(STAGING_DIR, "manifest-101-150.json"), "utf8"));
const private101150 = JSON.parse(await readFile(PRIVATE_101_150, "utf8"));
const markdownFiles = await readdir(STAGING_DIR);

function indexedBySource(items) {
  return new Map(items.filter((item) => Number.isInteger(item.sourceNo)).map((item) => [item.sourceNo, item]));
}

const private05100ByCard = new Map(private05100.assets.map((item) => [item.cardId, item]));
const private101150BySource = indexedBySource(private101150.assets);
const public101150BySource = indexedBySource(manifest101150.assets);
const public05100ByNo = new Map();
for (const item of manifest05100.assets) {
  const match = item.projectPath.match(/card_(\d{3})(?:-revision-\d+)?\.png$/);
  if (match) public05100ByNo.set(Number(match[1]), item);
}
const markdownBySource = new Map();
for (const filename of markdownFiles.filter((name) => name.endsWith(".metadata.md"))) {
  const match = filename.match(/^card_(\d{3})(?:_[^.]+)?\.metadata\.md$/);
  if (match) markdownBySource.set(Number(match[1]), filename);
}

function parseMarkdownMetadata(sourceNo, contents) {
  const prompt = contents.match(/## Full prompt\s+```(?:text)?\s*\n([\s\S]*?)\n```/i)?.[1]?.trim()
    ?? contents.split(/## Full prompt\s*/i)[1]?.trim();
  const sourcePath = contents.match(/(?:Generated source|Generated output path(?: \(private evidence\))?|generated output path):\s*`([^\`]+)`/i)?.[1];
  const sha256 = contents.match(/SHA-256:\s*`([a-f0-9]{64})`/i)?.[1];
  if (!prompt || !sha256 || !sourcePath) throw new Error(`sourceNo ${sourceNo} のmetadata.mdにprompt/SHA-256/原本pathがありません。`);
  return { prompt, sourcePath, claimedSha256: sha256 };
}

async function getStagingRecord(sourceNo, actualCardId) {
  if (sourceNo >= 51 && sourceNo <= 100) {
    const row = public05100ByNo.get(sourceNo);
    const privateRow = private05100ByCard.get(actualCardId);
    if (!row || !privateRow) throw new Error(`sourceNo ${sourceNo} の051-100 manifest/provenanceがありません。`);
    return {
      prompt: row.prompt,
      claimedSha256: row.sha256,
      sourcePath: privateRow.originalGeneratedOutputPath,
      stagedSha256: privateRow.stagedSha256,
      stagingPath: path.join(ROOT, row.projectPath),
    };
  }
  if (sourceNo >= 101 && sourceNo <= 121) {
    const row = public101150BySource.get(sourceNo);
    const privateRow = private101150BySource.get(sourceNo);
    if (!row || !privateRow) throw new Error(`sourceNo ${sourceNo} の101-121 manifest/provenanceがありません。`);
    return {
      prompt: privateRow.prompt,
      claimedSha256: row.sha256,
      sourcePath: privateRow.originalGeneratedOutputPath,
      stagedSha256: privateRow.sha256,
      stagingPath: path.join(ROOT, row.projectPath),
    };
  }
  const markdownFile = markdownBySource.get(sourceNo);
  if (!markdownFile) throw new Error(`sourceNo ${sourceNo} のmetadata.mdがありません。`);
  return {
    ...parseMarkdownMetadata(sourceNo, await readFile(path.join(STAGING_DIR, markdownFile), "utf8")),
    stagingPath: path.join(STAGING_DIR, sourceNo === 1 ? "card_001_training_dummy_prototype.png" : `card_${String(sourceNo).padStart(3, "0")}.png`),
  };
}

const entries = [];
const stagedSources = [];
for (let sourceNo = 1; sourceNo <= 150; sourceNo += 1) {
  const card = cardBySourceNo.get(sourceNo);
  if (!card) throw new Error(`CARD_DEFS に sourceNo ${sourceNo} がありません。`);
  const subject = subjects.get(sourceNo);
  const record = await getStagingRecord(sourceNo, card.id);
  const stagingPath = record.stagingPath;
  const stagingFilename = path.relative(STAGING_DIR, stagingPath);
  const file = await readFile(stagingPath).catch(() => undefined);
  if (!file) throw new Error(`staging asset がありません: ${stagingFilename}`);
  if (file.length < 24 || file.toString("hex", 0, 8) !== "89504e470d0a1a0a") throw new Error(`PNGではありません: ${stagingFilename}`);
  const width = file.readUInt32BE(16);
  const height = file.readUInt32BE(20);
  if (width !== height || width < 512) throw new Error(`sourceNo ${sourceNo} は正方形512px以上ではありません: ${width}x${height}`);
  const sha256 = crypto.createHash("sha256").update(file).digest("hex");
  if (!record.sourcePath) throw new Error(`sourceNo ${sourceNo} に検証可能な原画pathがありません。`);
  if (record.claimedSha256 !== sha256 || (record.stagedSha256 && record.stagedSha256 !== sha256)) {
    throw new Error(`sourceNo ${sourceNo} のstaging SHAがmanifestと一致しません。`);
  }
  if (record.sourcePath) {
    const original = await readFile(record.sourcePath).catch(() => undefined);
    if (!original || crypto.createHash("sha256").update(original).digest("hex") !== sha256) {
      throw new Error(`sourceNo ${sourceNo} のoriginal source SHAを確認できません。`);
    }
  }
  const target = `public/art/cards/card_${String(sourceNo).padStart(3, "0")}.png`;
  entries.push({
    sourceNo,
    cardId: card.id,
    aliasKey: subject?.aliasKey ?? card.id,
    aliases: subject?.aliases ?? [],
    pool: subject?.pool ?? card.pool ?? "normal",
    sourceLabel: subject?.sourceLabel ?? card.name,
    subject: subject?.subject ?? "Original fantasy card artwork matching the card's name and role.",
    path: target,
    url: `/art/cards/card_${String(sourceNo).padStart(3, "0")}.png`,
    sha256,
    width,
    height,
    tool: "built-in image_gen.imagegen",
    prompt: record.prompt,
    ...(sourceNo === 1 ? {
      selectionNote: "The approved bronze training-dummy prototype is adopted as Spartas (sourceNo 1); the original card name and rules remain unchanged.",
    } : {}),
  });
  stagedSources.push({ source: stagingPath, target: path.join(ROOT, target), sha256 });
}

if (entries.length !== 150 || new Set(entries.map((entry) => entry.cardId)).size !== 150 ||
    new Set(entries.map((entry) => entry.sha256)).size !== 150) {
  throw new Error("150 sourceNo / actual cardId / artwork hash の一対一性を確認できません。");
}

for (const { target, sha256 } of stagedSources) {
  const existing = await readFile(target).catch(() => undefined);
  if (existing && crypto.createHash("sha256").update(existing).digest("hex") !== sha256) {
    throw new Error(`異なる画像が既にあります。上書きしません: ${path.relative(ROOT, target)}`);
  }
}

await mkdir(PUBLIC_DIR, { recursive: true });
for (const { source, target } of stagedSources) {
  if (!(await stat(target).catch(() => undefined))) await copyFile(source, target);
}
const publicManifest = {
  format: "stone-tactics-card-art",
  version: 1,
  status: "complete",
  rightsStatus: RIGHTS_STATUS,
  assets: entries,
};
await writeFile(PUBLIC_MANIFEST, `${JSON.stringify(publicManifest, null, 2)}\n`, "utf8");
console.log(`Published ${entries.length} independently generated card assets and provenance records.`);
