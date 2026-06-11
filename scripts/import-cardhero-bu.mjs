import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { JSDOM } from "jsdom";

const CARD_LIST_URL = "https://www.cardhero-bu.com/card/";
const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "src/game/cardData.ts");
const ICON_DIR = path.join(ROOT, "public/card-icons");

const CARD_ID_OVERRIDES = new Map([
  ["タコッケー", "takokke"],
  ["ボムゾウ", "bomuzo"],
  ["ポリスピナー", "polyspinner"],
  ["鉄拳シグマ", "sigma"],
  ["ビヨンド", "beyond"],
  ["ヤンバル", "yanbaru"],
  ["モーガン", "morgan"],
  ["ヒーリング", "healing"],
  ["サンダー", "thunder"],
  ["パワーアップ", "power_up"],
]);

const IMPLEMENTED_MAGIC = new Map([
  ["ヒーリング", { targetKinds: ["ally_monster"], implemented: true }],
  ["サンダー", { targetKinds: ["enemy_monster", "enemy_master"], implemented: true }],
  ["パワーアップ", { targetKinds: ["ally_monster"], implemented: true }],
]);

const COMMAND_ID_OVERRIDES = new Map([
  ["アタック", "attack"],
  ["自爆", "self_bomb"],
  ["ストームボム", "storm_bomb"],
  ["虎皇拳", "tiger_fist"],
  ["エアロシュート", "aero_shoot"],
  ["ワイルドクロウ", "wild_claw"],
  ["アークドライブ", "arc_drive"],
]);

function text(element) {
  return element?.textContent.replace(/\s+/g, " ").trim() ?? "";
}

function cardIdFor(no, name) {
  return CARD_ID_OVERRIDES.get(name) ?? `card_${no}`;
}

function commandIdFor(name) {
  if (COMMAND_ID_OVERRIDES.has(name)) {
    return COMMAND_ID_OVERRIDES.get(name);
  }
  return name
    .normalize("NFKC")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase() || "command";
}

function numericValue(raw) {
  const normalized = raw.normalize("NFKC");
  const match = normalized.match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : 0;
}

function sanitizeNotes(notes) {
  return notes
    .map((note) => note.replace(/\s+/g, " ").trim())
    .filter((note) => note && !isNonGameplayNote(note));
}

function isNonGameplayNote(note) {
  const normalized = note.normalize("NFKC").toLowerCase();
  return (
    normalized.includes("spd使用不可") ||
    normalized.includes("スーパーカード") ||
    normalized.includes("全てのスーパー") ||
    /^lv\d+からレベルアップで .+ になれる$/.test(normalized) ||
    note.includes("限定版") ||
    note.includes("非売品") ||
    note.includes("超レア") ||
    note.includes("入手困難") ||
    note.includes("流出モノ") ||
    note.includes("珍品") ||
    /^（[^）]+）$/.test(note)
  );
}

function commandRange(rawRange, cardName, commandName, hasPower) {
  const normalized = rawRange.normalize("NFKC");
  if (!normalized) {
    return hasPower ? "adjacent" : "special";
  }
  if (normalized.includes("1つ飛び")) {
    return "one_skip";
  }
  if (normalized.includes("2つ")) {
    return "two_skip";
  }
  if (normalized.includes("どこでもモンスター")) {
    return "any_monster";
  }
  if (normalized.includes("どこでも")) {
    return cardName === "モーガン" && commandName === "アークドライブ" ? "any_target" : "any_monster";
  }
  if (normalized.includes("減るまっすぐ")) {
    return "decreasing_straight";
  }
  if (normalized.includes("まっすぐ")) {
    return "straight";
  }
  if (normalized.includes("貫通")) {
    return "piercing";
  }
  if (normalized.includes("一直線")) {
    return "line";
  }
  return "special";
}

function isImplementedRange(range) {
  return [
    "adjacent",
    "one_skip",
    "any_monster",
    "any_target",
    "master",
    "two_skip",
    "straight",
    "piercing",
    "decreasing_straight",
    "line",
    "special",
  ].includes(range);
}

function parseMonsterLevels(table, cardName) {
  const body = table.querySelectorAll("td.body")[0];
  const levels = [];
  let currentLevel;
  let currentCommand;

  for (const element of body?.children ?? []) {
    const classList = [...element.classList];
    if (classList.includes("mn_lv")) {
      currentLevel = {
        level: numericValue(text(element)),
        maxHp: 1,
        commands: [],
      };
      levels.push(currentLevel);
      currentCommand = undefined;
      continue;
    }
    if (!currentLevel) {
      continue;
    }
    if (classList.includes("mn_max_hp")) {
      currentLevel.maxHp = numericValue(text(element));
      continue;
    }
    if (classList.includes("mn_att_name") || classList.includes("mn_spe_name")) {
      currentCommand = {
        id: commandIdFor(text(element)),
        name: text(element),
        power: 0,
        range: "special",
      };
      currentLevel.commands.push(currentCommand);
      continue;
    }
    if (!currentCommand) {
      continue;
    }
    if (classList.includes("mn_att_power") || classList.includes("mn_spe_power")) {
      currentCommand.power = numericValue(text(element));
      currentCommand.range = commandRange(currentCommand.rangeText ?? "", cardName, currentCommand.name, true);
      continue;
    }
    if (classList.includes("mn_spe_stone")) {
      currentCommand.stoneCost = numericValue(text(element));
      continue;
    }
    if (classList.includes("mn_att_range") || classList.includes("mn_spe_range")) {
      currentCommand.rangeText = text(element);
      currentCommand.range = commandRange(currentCommand.rangeText, cardName, currentCommand.name, currentCommand.power > 0);
      continue;
    }
    if (classList.includes("mn_spe_desc")) {
      currentCommand.effectText = text(element).replace(/^特技：\s*/, "");
    }
  }

  return levels.map((level) => ({
    ...level,
    commands: level.commands.map((command) => {
      const range = command.range === "special"
        ? commandRange(command.rangeText ?? "", cardName, command.name, command.power > 0)
        : command.range;
      return {
        ...command,
        range,
        recoilDamage: cardName === "ボムゾウ" && command.name === "自爆" ? 1 : undefined,
        implemented: isImplementedRange(range),
      };
    }),
  }));
}

function parseNotes(table) {
  return sanitizeNotes([
    ...[...table.querySelectorAll(".mn_cha_desc")].map((element) => text(element)),
    ...[...table.querySelectorAll(".mn_condition")].map((element) => text(element)),
    ...[...table.querySelectorAll(".mn_name_super")].map((element) => text(element)),
    ...[...table.querySelectorAll(".mn_name_seed")].map((element) => text(element)),
  ]);
}

function parseMagic(table, base) {
  const description = text(table.querySelector(".mg_desc"));
  const magic = IMPLEMENTED_MAGIC.get(base.name);
  return {
    ...base,
    type: "magic",
    cost: numericValue(text(table.querySelector(".mg_stone"))),
    description,
    targetKinds: magic?.targetKinds ?? [],
    category: description.match(/【(.+?)】/)?.[1],
    continuance: text(table.querySelector(".mg_continuance")) || undefined,
    implemented: magic?.implemented ?? false,
    notes: sanitizeNotes([text(table.querySelector(".annotation"))]),
  };
}

function parseMonster(table, base, role) {
  const levels = parseMonsterLevels(table, base.name);
  const notes = parseNotes(table);
  return {
    ...base,
    type: "monster",
    role,
    maxLevel: Math.max(...levels.map((level) => level.level)),
    actionLimit: notes.some((note) => note.includes("３行動")) ? 3 : notes.some((note) => note.includes("２行動")) ? 2 : undefined,
    notes,
    levels,
  };
}

async function downloadIcon(url, no) {
  const fileName = `co${no}.jpg`;
  const outputPath = path.join(ICON_DIR, fileName);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
  return `/card-icons/${fileName}`;
}

async function main() {
  const response = await fetch(CARD_LIST_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch card list: ${response.status}`);
  }

  await mkdir(ICON_DIR, { recursive: true });
  const html = await response.text();
  const document = new JSDOM(html).window.document;
  const cards = [];

  for (const table of document.querySelectorAll("table.card_basic")) {
    const no = text(table.querySelector(".id")).match(/No\.(\d+)/)?.[1];
    const typeLabel = text(table.querySelector(".type"));
    if (!no || typeLabel === "スーパー") {
      continue;
    }

    const name = text(table.querySelector(".name a"));
    const detailUrl = table.querySelector(".name a")?.getAttribute("href") ?? `${CARD_LIST_URL}detail.php?id=${Number(no)}`;
    const iconUrl = table.querySelector(".image img")?.getAttribute("src");
    const base = {
      id: cardIdFor(no, name),
      name,
      sourceNo: Number(no),
      sourceUrl: detailUrl,
      icon: iconUrl ? await downloadIcon(iconUrl, no) : undefined,
      rarity: numericValue(text(table.querySelector(".rarity"))),
      catchcopy: text(table.querySelector(".catchcopy")).replace(/^『|』$/g, "") || undefined,
    };

    if (typeLabel === "マジック") {
      cards.push(parseMagic(table, base));
    } else {
      cards.push(parseMonster(table, base, typeLabel === "前衛" ? "front" : "back"));
    }
  }

  const cardDefs = Object.fromEntries(cards.map((card) => [card.id, card]));
  const generated = `import type { CardDef } from \"./types\";\n\n` +
    `// Generated by scripts/import-cardhero-bu.mjs from ${CARD_LIST_URL}\n` +
    `// Super cards are intentionally excluded for the current prototype scope.\n` +
    `export const CARD_DEFS = ${JSON.stringify(cardDefs, null, 2)} satisfies Record<string, CardDef>;\n`;

  await writeFile(DATA_PATH, generated);
  console.log(`Imported ${cards.length} non-super cards and icons.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
