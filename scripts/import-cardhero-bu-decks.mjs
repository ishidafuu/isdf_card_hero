import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { JSDOM } from "jsdom";

const DECK_LIST_URL = "https://www.cardhero-bu.com/deck/index.php";
const ROOT = process.cwd();
const CARD_DATA_PATH = path.join(ROOT, "src/game/cardData.ts");
const OUTPUT_PATH = path.join(ROOT, "src/game/deckSubmissionPresets.ts");

const TARGET_GROUPS = [
  {
    id: "pro-no-rare8-black",
    name: "投稿 Pro黒 8なし",
    label: "投稿Pro黒8なし",
    mode: "Pro 8なし",
    master: "ブラックマスター",
    masterId: "black",
  },
  {
    id: "pro-with-rare8-black",
    name: "投稿 Pro黒 8あり",
    label: "投稿Pro黒8あり",
    mode: "Pro 8あり",
    master: "ブラックマスター",
    masterId: "black",
  },
  {
    id: "pro-no-rare8-white",
    name: "投稿 Pro白 8なし",
    label: "投稿Pro白8なし",
    mode: "Pro 8なし",
    master: "ホワイトマスター",
    masterId: "white",
  },
  {
    id: "pro-with-rare8-white",
    name: "投稿 Pro白 8あり",
    label: "投稿Pro白8あり",
    mode: "Pro 8あり",
    master: "ホワイトマスター",
    masterId: "white",
  },
];

const TARGET_GROUP_BY_KEY = new Map(TARGET_GROUPS.map((group) => [`${group.mode}|${group.master}`, group]));

function normalizeToken(value) {
  return value.normalize("NFKC").replace(/\s+/g, "").trim();
}

function normalizeText(value) {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim();
}

function extractCardDefs(source) {
  const match = source.match(/export const CARD_DEFS = ([\s\S]*) satisfies Record<string, CardDef>;/);
  if (!match) {
    throw new Error(`CARD_DEFS object was not found in ${CARD_DATA_PATH}`);
  }
  return JSON.parse(match[1]);
}

async function loadCardNameMap() {
  const source = await readFile(CARD_DATA_PATH, "utf8");
  const cardDefs = extractCardDefs(source);
  const byName = new Map();
  for (const def of Object.values(cardDefs)) {
    const key = normalizeToken(def.name);
    if (byName.has(key)) {
      throw new Error(`Duplicate card name after normalization: ${def.name}`);
    }
    byName.set(key, def);
  }
  return byName;
}

async function fetchDocument(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  const html = await response.text();
  return new JSDOM(html, { url }).window.document;
}

function maxPageFromDocument(document) {
  let maxPage = 1;
  for (const anchor of document.querySelectorAll("a[href*='page=']")) {
    const page = Number.parseInt(new URL(anchor.href).searchParams.get("page") ?? "", 10);
    if (Number.isFinite(page)) {
      maxPage = Math.max(maxPage, page);
    }
  }
  return maxPage;
}

function text(element) {
  return element?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function decodeHtmlLine(document, html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function stripCommentCount(title) {
  return title.replace(/\(\d+\)\s*$/, "").trim();
}

function topicMeta(table) {
  const anchor = table.querySelector("a[href*='topic.php?id=']");
  const href = anchor?.href ?? "";
  const id = Number.parseInt(new URL(href || DECK_LIST_URL).searchParams.get("id") ?? "", 10);
  if (!Number.isFinite(id)) {
    return undefined;
  }
  return {
    sourceDeckId: id,
    sourceUrl: new URL(`topic.php?id=${id}`, DECK_LIST_URL).href,
    title: stripCommentCount(text(anchor)),
  };
}

function parseDeckHeader(deckBody) {
  const raw = deckBody.textContent ?? "";
  const mode = raw.match(/[【〖]([^】〗]+)[】〗]/)?.[1]?.trim();
  const master = raw.match(/マスター：\s*([^\r\n]+?)(?=\s*前衛|\s*$)/)?.[1]?.trim();
  if (!mode || !master) {
    return undefined;
  }
  return {
    mode: normalizeText(mode),
    master: normalizeText(master),
  };
}

function parseCardLine(document, htmlLine, cardNameMap) {
  const lineText = decodeHtmlLine(document, htmlLine);
  if (!/^(前衛|後衛|マジック|スーパー)\(/.test(lineText)) {
    return [];
  }

  const fragment = document.createElement("template");
  fragment.innerHTML = htmlLine;
  const strongCards = [...fragment.content.querySelectorAll("span.strong")].map((element) => text(element));
  const rawCards = strongCards.length > 0
    ? strongCards
    : lineText
      .replace(/^[^：]*：/, "")
      .split("、")
      .map((part) => part.trim())
      .filter(Boolean);

  const cardIds = [];
  for (const rawCard of rawCards) {
    const match = rawCard.match(/^(.+?)x(\d+)$/u);
    if (!match) {
      throw new Error(`Could not parse deck card entry: ${rawCard}`);
    }
    const [, rawName, rawCount] = match;
    const def = cardNameMap.get(normalizeToken(rawName));
    if (!def) {
      throw new Error(`Unknown card name in deck submission: ${rawName}`);
    }
    const count = Number.parseInt(rawCount, 10);
    for (let index = 0; index < count; index += 1) {
      cardIds.push(def.id);
    }
  }
  return cardIds;
}

function deckCodeFromTable(table) {
  const code = table.querySelector("input.deck_code")?.getAttribute("value")?.trim();
  return code ? code.replace(/^\{d=/, "").replace(/\}$/, "") : undefined;
}

function parseDeckSubmission(table, cardNameMap) {
  const meta = topicMeta(table);
  const deckBody = table.querySelector("p.deck_body");
  if (!meta || !deckBody) {
    return undefined;
  }

  const header = parseDeckHeader(deckBody);
  if (!header) {
    return undefined;
  }
  const group = TARGET_GROUP_BY_KEY.get(`${header.mode}|${header.master}`);
  if (!group) {
    return undefined;
  }

  const cardIds = deckBody.innerHTML
    .split(/<br\s*\/?>/i)
    .flatMap((line) => parseCardLine(table.ownerDocument, line, cardNameMap));
  if (cardIds.length !== 30) {
    throw new Error(`Deck #${meta.sourceDeckId} has ${cardIds.length} cards`);
  }

  const sourceTitle = meta.title || `投稿デッキ${meta.sourceDeckId}`;
  const deckCode = deckCodeFromTable(table);
  const allowSpecial = cardIds.some((cardId) => cardNameMapById(cardNameMap).get(cardId)?.pool === "special");
  return {
    id: `submission-${group.id}-${meta.sourceDeckId}`,
    name: `${group.label} #${meta.sourceDeckId} ${sourceTitle}`,
    description: `カードヒーロー部.com投稿 #${meta.sourceDeckId} / ${group.mode} / ${group.master}`,
    cardIds,
    allowSpecial,
    sourceUrl: meta.sourceUrl,
    sourceDeckId: meta.sourceDeckId,
    mode: group.mode,
    masterId: group.masterId,
    deckCode,
    group: group.id,
  };
}

function cardNameMapById(cardNameMap) {
  return new Map([...cardNameMap.values()].map((def) => [def.id, def]));
}

async function collectDeckSubmissions() {
  const cardNameMap = await loadCardNameMap();
  const firstDocument = await fetchDocument(DECK_LIST_URL);
  const maxPage = maxPageFromDocument(firstDocument);
  const presets = [];

  for (let page = 1; page <= maxPage; page += 1) {
    const document = page === 1 ? firstDocument : await fetchDocument(`${DECK_LIST_URL}?page=${page}`);
    for (const table of document.querySelectorAll("table.topic_list")) {
      const preset = parseDeckSubmission(table, cardNameMap);
      if (preset) {
        presets.push(preset);
      }
    }
  }

  return presets;
}

function formatString(value) {
  return JSON.stringify(value);
}

function formatStringArray(values) {
  return `[${values.map(formatString).join(", ")}]`;
}

function formatPreset(preset) {
  const fields = [
    `id: ${formatString(preset.id)}`,
    `name: ${formatString(preset.name)}`,
    `description: ${formatString(preset.description)}`,
    `cardIds: ${formatStringArray(preset.cardIds)}`,
    `allowSpecial: ${preset.allowSpecial}`,
    `sourceUrl: ${formatString(preset.sourceUrl)}`,
    `sourceDeckId: ${preset.sourceDeckId}`,
    `mode: ${formatString(preset.mode)}`,
    `masterId: ${formatString(preset.masterId)}`,
    preset.deckCode ? `deckCode: ${formatString(preset.deckCode)}` : undefined,
    `group: ${formatString(preset.group)}`,
  ].filter(Boolean);
  return `  {\n    ${fields.join(",\n    ")}\n  }`;
}

function formatGroup(group) {
  return `  ${JSON.stringify(
    {
      id: group.id,
      name: group.name,
      mode: group.mode,
      masterId: group.masterId,
      sourceMaster: group.master,
    },
    null,
    2,
  ).replace(/\n/g, "\n  ")}`;
}

function generatedSource(presets) {
  const groups = TARGET_GROUPS.map((group) => ({
    ...group,
    count: presets.filter((preset) => preset.group === group.id).length,
  }));
  return `import type { MasterId } from "./types";

// Generated by scripts/import-cardhero-bu-decks.mjs from https://www.cardhero-bu.com/deck/index.php
// Only Pro 8なし/8あり decks for black and white masters are included.
export type DeckSubmissionGroupId =
  | "pro-no-rare8-black"
  | "pro-with-rare8-black"
  | "pro-no-rare8-white"
  | "pro-with-rare8-white";

export interface DeckSubmissionGroupDef {
  id: DeckSubmissionGroupId;
  name: string;
  mode: string;
  masterId: MasterId;
  sourceMaster: string;
}

export interface DeckSubmissionPresetDef {
  id: \`submission-\${string}\`;
  name: string;
  description: string;
  cardIds: readonly string[];
  allowSpecial: boolean;
  sourceUrl: string;
  sourceDeckId: number;
  mode: string;
  masterId: MasterId;
  deckCode?: string;
  group: DeckSubmissionGroupId;
}

export const DECK_SUBMISSION_PRESET_GROUPS = [
${groups.map(formatGroup).join(",\n")}
] as const satisfies readonly DeckSubmissionGroupDef[];

export const DECK_SUBMISSION_PRESETS = [
${presets.map(formatPreset).join(",\n")}
] as const satisfies readonly DeckSubmissionPresetDef[];
`;
}

const presets = await collectDeckSubmissions();
await writeFile(OUTPUT_PATH, generatedSource(presets));

const counts = Object.fromEntries(TARGET_GROUPS.map((group) => [group.id, presets.filter((preset) => preset.group === group.id).length]));
console.log(`Imported ${presets.length} deck submissions into ${OUTPUT_PATH}`);
console.log(JSON.stringify(counts, null, 2));
