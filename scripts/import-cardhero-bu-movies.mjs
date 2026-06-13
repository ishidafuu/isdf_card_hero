import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { JSDOM } from "jsdom";

const MOVIE_LIST_URL = "https://www.cardhero-bu.com/movie/index.php";
const ROOT = process.cwd();
const DEFAULT_OUTPUT_PATH = path.join(ROOT, "docs/research/cardhero-bu-movies.json");
const DEFAULT_SUMMARY_PATH = path.join(ROOT, "docs/research/cardhero-bu-movies-summary.md");
const CARD_DATA_PATH = path.join(ROOT, "src/game/cardData.ts");

const CATEGORY_BY_LABEL = new Map([
  ["前衛", "front"],
  ["後衛", "back"],
  ["マジック", "magic"],
  ["スーパー", "super"],
]);

const MASTER_ID_BY_NAME = new Map([
  ["ブラックマスター", "black"],
  ["ホワイトマスター", "white"],
]);

const COMMENT_SIGNAL_RULES = [
  { id: "initial_hand_redraw", patterns: ["初期手札", "引き直し"] },
  { id: "opening_placement", patterns: ["配置", "前に", "後ろに", "後衛", "前衛"] },
  { id: "stone_tempo", patterns: ["ストーン", "石"] },
  { id: "level_up_line", patterns: ["レベルアップ"] },
  { id: "citrus_line", patterns: ["シトラス"] },
  { id: "magic_timing", patterns: ["マジック", "どこでも", "バーサク", "ウェイクアップ", "ローテーション"] },
  { id: "super_line", patterns: ["スーパー"] },
  { id: "lethal_or_closeout", patterns: ["詰め", "勝ち", "倒せ"] },
];

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    out: DEFAULT_OUTPUT_PATH,
    summary: DEFAULT_SUMMARY_PATH,
    limit: undefined,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--out") {
      options.out = path.resolve(ROOT, args[index + 1]);
      index += 1;
      continue;
    }
    if (arg === "--summary") {
      options.summary = path.resolve(ROOT, args[index + 1]);
      index += 1;
      continue;
    }
    if (arg === "--limit") {
      options.limit = Number.parseInt(args[index + 1], 10);
      index += 1;
      continue;
    }
    throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

function normalizeToken(value) {
  return value.normalize("NFKC").replace(/\s+/g, "").trim();
}

function normalizeText(value) {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim();
}

function text(element) {
  return element?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function stripCommentCount(title) {
  return title.replace(/\(\d+\)\s*$/, "").trim();
}

function parseJapaneseDate(value) {
  const match = value.match(/(\d{4})年(\d{1,2})月(\d{1,2})日\s+(\d{1,2}):(\d{2})/);
  if (!match) {
    return undefined;
  }
  const [, year, month, day, hour, minute] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute}:00+09:00`;
}

function extractCardDefs(source) {
  const match = source.match(/export const CARD_DEFS = ([\s\S]*) satisfies Record<string, CardDef>;/);
  if (!match) {
    throw new Error(`CARD_DEFS object was not found in ${CARD_DATA_PATH}`);
  }
  return JSON.parse(match[1]);
}

async function loadCardNameMap() {
  const source = await import("node:fs/promises").then((fs) => fs.readFile(CARD_DATA_PATH, "utf8"));
  const cardDefs = extractCardDefs(source);
  return new Map(Object.values(cardDefs).map((def) => [normalizeToken(def.name), def]));
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

function topicMetaFromListTable(table) {
  const anchor = table.querySelector("thead a[href*='topic.php?id=']");
  const href = anchor?.href ?? "";
  const id = Number.parseInt(new URL(href || MOVIE_LIST_URL).searchParams.get("id") ?? "", 10);
  if (!Number.isFinite(id)) {
    return undefined;
  }

  const dateText = text(table.querySelector("thead .date")).replace(/^\[|\]$/g, "");
  const [publishedAtText, lastActivityAtText] = dateText.split("～").map((part) => part.trim());
  const titleWithCount = text(anchor);
  const commentCount = Number.parseInt(titleWithCount.match(/\((\d+)\)\s*$/)?.[1] ?? "0", 10);

  return {
    id,
    sourceUrl: new URL(`topic.php?id=${id}`, MOVIE_LIST_URL).href,
    title: stripCommentCount(titleWithCount),
    commentCount,
    publishedAt: parseJapaneseDate(publishedAtText),
    lastActivityAt: parseJapaneseDate(lastActivityAtText || publishedAtText),
  };
}

async function collectTopicIndex() {
  const firstDocument = await fetchDocument(MOVIE_LIST_URL);
  const maxPage = maxPageFromDocument(firstDocument);
  const topics = [];

  for (let page = 1; page <= maxPage; page += 1) {
    const document = page === 1 ? firstDocument : await fetchDocument(`${MOVIE_LIST_URL}?page=${page}`);
    for (const table of document.querySelectorAll("table.topic_list")) {
      const meta = topicMetaFromListTable(table);
      if (meta) {
        topics.push(meta);
      }
    }
  }

  return topics.sort((a, b) => a.id - b.id);
}

function matchupFromTitle(title) {
  const label = title.match(/『([^』]+)』/)?.[1];
  const sides = label?.split(/VS/i).map((side) => side.trim());
  if (!label || sides?.length !== 2) {
    return undefined;
  }

  return {
    label,
    player: sideToMasterId(sides[0]),
    opponent: sideToMasterId(sides[1]),
  };
}

function sideToMasterId(side) {
  const normalized = normalizeToken(side);
  if (normalized.includes("黒")) {
    return "black";
  }
  if (normalized.includes("白")) {
    return "white";
  }
  if (normalized.includes("グレート")) {
    return "great";
  }
  return undefined;
}

function modeFromTitle(title) {
  return title.match(/^No\.\d+\s+(.+?)『/)?.[1]?.trim();
}

function deckCodeFromDocument(document) {
  const code = document.querySelector("input.deck_code")?.getAttribute("value")?.trim();
  return code ? code.replace(/^\{d=/, "").replace(/\}$/, "") : undefined;
}

function editorUrlFromDocument(document) {
  return document.querySelector("a[href*='/deck/editor.php#']")?.href;
}

function parseCardEntry(cardNameMap, rawCard) {
  const match = rawCard.match(/^(.+?)x(\d+)$/u);
  if (!match) {
    throw new Error(`Could not parse movie deck card entry: ${rawCard}`);
  }
  const [, name, rawCount] = match;
  const count = Number.parseInt(rawCount, 10);
  const cardDef = cardNameMap.get(normalizeToken(name));
  return {
    name,
    count,
    cardId: cardDef?.id,
  };
}

function parseDeckLine(document, htmlLine, cardNameMap) {
  const template = document.createElement("template");
  template.innerHTML = htmlLine;
  const lineText = text(template.content);
  const match = lineText.match(/^(前衛|後衛|マジック|スーパー)\((\d+)\)/);
  if (!match) {
    return undefined;
  }

  const [, label, rawDeclaredCount] = match;
  const cards = [...template.content.querySelectorAll("span.strong")]
    .map((element) => text(element))
    .filter((value) => value.includes("x"))
    .map((value) => parseCardEntry(cardNameMap, value));

  return {
    key: CATEGORY_BY_LABEL.get(label),
    label,
    declaredCount: Number.parseInt(rawDeclaredCount, 10),
    cards,
  };
}

function parseDeck(document, cardNameMap) {
  const deckBody = document.querySelector("p.deck_body");
  if (!deckBody) {
    return undefined;
  }

  const mode = text(deckBody.querySelector("span.strong")).replace(/^【|】$/g, "");
  const deckText = text(deckBody);
  const masterName = deckText.match(/マスター：\s*([^\s]+マスター)/)?.[1];
  const totalRarity = Number.parseInt(deckText.match(/合計レア度：\s*(\d+)/)?.[1] ?? "", 10);
  const maxRarity = Number.parseInt(deckText.match(/最大レア度：\s*(\d+)/)?.[1] ?? "", 10);

  const sections = {};
  for (const line of deckBody.innerHTML.split(/<br\s*\/?>/i)) {
    const section = parseDeckLine(document, line, cardNameMap);
    if (section?.key) {
      sections[section.key] = {
        label: section.label,
        declaredCount: section.declaredCount,
        cards: section.cards,
      };
    }
  }

  const cardCount = Object.values(sections)
    .flatMap((section) => section.cards)
    .reduce((sum, card) => sum + card.count, 0);
  const unresolvedCards = Object.values(sections)
    .flatMap((section) => section.cards)
    .filter((card) => !card.cardId)
    .map((card) => card.name);

  return {
    mode,
    masterName,
    masterId: masterName ? MASTER_ID_BY_NAME.get(masterName) : undefined,
    sections,
    cardCount,
    deckCode: deckCodeFromDocument(document),
    editorUrl: editorUrlFromDocument(document),
    totalRarity: Number.isFinite(totalRarity) ? totalRarity : undefined,
    maxRarity: Number.isFinite(maxRarity) ? maxRarity : undefined,
    unresolvedCards,
  };
}

function parseNicoVideos(document) {
  return [...document.querySelectorAll("a[href*='nicovideo.jp/watch/']")]
    .map((anchor) => {
      const url = anchor.href;
      return {
        id: url.match(/\/watch\/([^/?#]+)/)?.[1],
        url,
      };
    })
    .filter((video, index, videos) => video.id && videos.findIndex((item) => item.id === video.id) === index);
}

function parseYoutubeVideos(document) {
  return [...document.querySelectorAll("param[name='movie'][value*='youtube.com/v/'], embed[src*='youtube.com/v/']")]
    .map((element) => element.getAttribute("value") ?? element.getAttribute("src") ?? "")
    .map((url) => {
      const id = url.match(/youtube\.com\/v\/([^?&#]+)/)?.[1];
      return id ? { id, url: `https://www.youtube.com/watch?v=${id}` } : undefined;
    })
    .filter(Boolean)
    .filter((video, index, videos) => videos.findIndex((item) => item.id === video.id) === index)
    .map((video, index) => ({ ...video, part: index + 1 }));
}

function parseCommentSignalTags(document) {
  const tags = new Set();
  for (const table of document.querySelectorAll("table.topic_comment")) {
    const body = normalizeText(text(table.querySelector("tbody td")));
    for (const rule of COMMENT_SIGNAL_RULES) {
      if (rule.patterns.some((pattern) => body.includes(pattern))) {
        tags.add(rule.id);
      }
    }
  }
  return [...tags].sort();
}

function parseCommentCount(document) {
  return document.querySelectorAll("table.topic_comment").length;
}

async function collectMovieTopic(meta, cardNameMap) {
  const document = await fetchDocument(meta.sourceUrl);
  const title = text(document.querySelector("table.topic_detail span.title")) || meta.title;
  const author = text(document.querySelector("table.topic_detail span.name")).replace(/^（|）$/g, "");
  const publishedAtText = text(document.querySelector("table.topic_detail span.date")).replace(/^\[|\]$/g, "");
  const deck = parseDeck(document, cardNameMap);
  const commentCount = parseCommentCount(document);
  const youtube = parseYoutubeVideos(document);
  const nicovideo = parseNicoVideos(document);

  return {
    id: meta.id,
    number: title.match(/No\.(\d+)/)?.[1],
    title,
    sourceUrl: meta.sourceUrl,
    author,
    publishedAt: parseJapaneseDate(publishedAtText) ?? meta.publishedAt,
    lastActivityAt: meta.lastActivityAt,
    modeLabel: modeFromTitle(title),
    matchup: matchupFromTitle(title),
    videos: {
      nicovideo,
      youtube,
    },
    recordedDeck: deck,
    commentCount,
    commentSignalTags: parseCommentSignalTags(document),
    validation: {
      hasRecordedDeck: Boolean(deck),
      recordedDeckCardCount: deck?.cardCount,
      unresolvedCards: deck?.unresolvedCards ?? [],
      videoPartCount: youtube.length,
      nicoVideoCount: nicovideo.length,
      commentCountMatchesIndex: commentCount === meta.commentCount,
    },
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function categoryCount(movie, key) {
  return movie.recordedDeck?.sections?.[key]?.declaredCount ?? 0;
}

function increment(map, key, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function sortedEntries(map) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"));
}

function summarizeMovies(movies) {
  const matchupCounts = new Map();
  const deckMasterCounts = new Map();
  const cardCounts = new Map();
  const commentSignalCounts = new Map();
  const videoParts = movies.reduce((sum, movie) => sum + movie.videos.youtube.length, 0);
  const commentCount = movies.reduce((sum, movie) => sum + movie.commentCount, 0);
  const deckCount = movies.filter((movie) => movie.recordedDeck).length;
  const unresolvedMovies = movies.filter((movie) => movie.validation.unresolvedCards.length > 0);
  const invalidDeckCountMovies = movies.filter((movie) => movie.recordedDeck && movie.recordedDeck.cardCount !== 30);

  for (const movie of movies) {
    increment(matchupCounts, movie.matchup?.label ?? "unknown");
    increment(deckMasterCounts, movie.recordedDeck?.masterName ?? "unknown");
    for (const tag of movie.commentSignalTags) {
      increment(commentSignalCounts, tag);
    }
    for (const section of Object.values(movie.recordedDeck?.sections ?? {})) {
      for (const card of section.cards) {
        increment(cardCounts, card.name, card.count);
      }
    }
  }

  return {
    movieCount: movies.length,
    deckCount,
    videoParts,
    commentCount,
    matchupCounts: Object.fromEntries(sortedEntries(matchupCounts)),
    deckMasterCounts: Object.fromEntries(sortedEntries(deckMasterCounts)),
    topCards: sortedEntries(cardCounts).slice(0, 20).map(([name, count]) => ({ name, count })),
    commentSignalCounts: Object.fromEntries(sortedEntries(commentSignalCounts)),
    unresolvedMovieIds: unresolvedMovies.map((movie) => movie.id),
    invalidDeckCountMovieIds: invalidDeckCountMovies.map((movie) => movie.id),
  };
}

function formatSummaryMarkdown(dataset) {
  const summary = dataset.summary;
  const topCards = summary.topCards.map((card) => `| ${card.name} | ${card.count} |`).join("\n");
  const matchupRows = Object.entries(summary.matchupCounts).map(([label, count]) => `| ${label} | ${count} |`).join("\n");
  const signalRows = Object.entries(summary.commentSignalCounts).map(([label, count]) => `| ${label} | ${count} |`).join("\n");

  return [
    "# カードヒーロー部.com 対戦動画データ サマリ",
    "",
    `生成日時: ${dataset.generatedAt}`,
    `取得元: ${dataset.source}`,
    "",
    "## 件数",
    "",
    `- 対戦動画: ${summary.movieCount}`,
    `- 使用デッキ取得: ${summary.deckCount}`,
    `- YouTube分割パート: ${summary.videoParts}`,
    `- コメント数: ${summary.commentCount}`,
    "",
    "## マッチアップ",
    "",
    "| マッチアップ | 件数 |",
    "| --- | ---: |",
    matchupRows || "| unknown | 0 |",
    "",
    "## コメント由来シグナル",
    "",
    "コメント本文は保存せず、将来の手動レビュー候補にするためのタグだけを保存する。",
    "",
    "| タグ | 件数 |",
    "| --- | ---: |",
    signalRows || "| none | 0 |",
    "",
    "## 使用カード上位",
    "",
    "| カード | 使用枚数 |",
    "| --- | ---: |",
    topCards || "| none | 0 |",
    "",
    "## 検証",
    "",
    `- 未解決カードを含む動画ID: ${summary.unresolvedMovieIds.length ? summary.unresolvedMovieIds.join(", ") : "なし"}`,
    `- 30枚以外の使用デッキ動画ID: ${summary.invalidDeckCountMovieIds.length ? summary.invalidDeckCountMovieIds.join(", ") : "なし"}`,
    "",
  ].join("\n");
}

async function main() {
  const options = parseArgs();
  const cardNameMap = await loadCardNameMap();
  const topics = await collectTopicIndex();
  const selectedTopics = Number.isFinite(options.limit) ? topics.slice(0, options.limit) : topics;
  const movies = [];

  for (const [index, topic] of selectedTopics.entries()) {
    movies.push(await collectMovieTopic(topic, cardNameMap));
    if (index < selectedTopics.length - 1) {
      await sleep(75);
    }
  }

  const dataset = {
    generatedAt: new Date().toISOString(),
    source: MOVIE_LIST_URL,
    notes: [
      "動画本体、スクリーンショット、コメント全文は保存しない。",
      "recordedDeckはページに掲載された使用デッキであり、対戦相手デッキではない。",
      "commentSignalTagsはコメント本文から機械抽出したタグで、判断局面の手動レビュー候補として扱う。",
    ],
    summary: summarizeMovies(movies),
    movies,
  };

  await mkdir(path.dirname(options.out), { recursive: true });
  await writeFile(options.out, `${JSON.stringify(dataset, null, 2)}\n`);
  await mkdir(path.dirname(options.summary), { recursive: true });
  await writeFile(options.summary, formatSummaryMarkdown(dataset));

  console.log(`Wrote ${movies.length} movies to ${options.out}`);
  console.log(`Wrote summary to ${options.summary}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
