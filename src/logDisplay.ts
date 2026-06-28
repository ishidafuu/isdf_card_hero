import { getAllCardDefs } from "./game/cards";

export type LogFilter = "all" | "battle" | "damage" | "support" | "turn" | "cpu";

export type LogToken =
  | { kind: "card"; cardId: string; text: string }
  | { kind: "chip"; icon: string; text: string }
  | { kind: "text"; text: string };

const LOG_CARD_NAME_MATCHERS = getAllCardDefs()
  .map((def) => ({ id: def.id, name: def.name }))
  .sort((a, b) => b.name.length - a.name.length || a.name.localeCompare(b.name, "ja"));

export function tokenizeLogEntry(entry: string): LogToken[] {
  const cardTokens = tokenizeCardsInLog(entry);
  return cardTokens.flatMap((token) => {
    if (token.kind === "card") {
      return [token];
    }
    return tokenizeLogText(token.text);
  });
}

function tokenizeCardsInLog(entry: string): LogToken[] {
  const tokens: LogToken[] = [];
  let cursor = 0;
  while (cursor < entry.length) {
    const match = findNextCardName(entry, cursor);
    if (!match) {
      tokens.push({ kind: "text", text: entry.slice(cursor) });
      break;
    }
    if (match.index > cursor) {
      tokens.push({ kind: "text", text: entry.slice(cursor, match.index) });
    }
    tokens.push({ kind: "card", cardId: match.cardId, text: match.name });
    cursor = match.index + match.name.length;
  }
  return tokens.filter((token) => token.kind !== "text" || token.text.length > 0);
}

function findNextCardName(entry: string, start: number): { index: number; cardId: string; name: string } | undefined {
  let best: { index: number; cardId: string; name: string } | undefined;
  for (const card of LOG_CARD_NAME_MATCHERS) {
    const index = entry.indexOf(card.name, start);
    if (index < 0) {
      continue;
    }
    if (!best || index < best.index || (index === best.index && card.name.length > best.name.length)) {
      best = { index, cardId: card.id, name: card.name };
    }
  }
  return best;
}

function tokenizeLogText(text: string): LogToken[] {
  const pattern = /(Player|CPU|HP|Stone|ストーン|マスターアタック|ウェイクアップ|シールド|バーサクパワー|大地の怒り|ためた|召喚|登場|倒れた|撃破|山札切れ|判断:|ターン|引いた|使った|入れ替え|移動|レベルアップ|勝利|ダメージ|回復|コピー|ローテーション|リフレッシュ|手札|山札|Lv)/g;
  const tokens: LogToken[] = [];
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      tokens.push({ kind: "text", text: text.slice(cursor, index) });
    }
    tokens.push(logKeywordToken(match[0]));
    cursor = index + match[0].length;
  }
  if (cursor < text.length) {
    tokens.push({ kind: "text", text: text.slice(cursor) });
  }
  return tokens.filter((token) => token.kind !== "text" || token.text.length > 0);
}

function logKeywordToken(text: string): LogToken {
  if (text === "Player") {
    return { kind: "chip", icon: "🙂", text };
  }
  if (text === "CPU") {
    return { kind: "chip", icon: "🧠", text };
  }
  if (text === "HP") {
    return { kind: "chip", icon: "❤️", text };
  }
  if (text === "Stone" || text === "ストーン") {
    return { kind: "chip", icon: "💎", text };
  }
  if (text === "マスターアタック") {
    return { kind: "chip", icon: "⚔️", text };
  }
  if (text === "ウェイクアップ") {
    return { kind: "chip", icon: "⏰", text };
  }
  if (text === "シールド") {
    return { kind: "chip", icon: "🛡️", text };
  }
  if (text === "バーサクパワー") {
    return { kind: "chip", icon: "😡", text };
  }
  if (text === "大地の怒り") {
    return { kind: "chip", icon: "🌋", text };
  }
  if (text === "ためた") {
    return { kind: "chip", icon: "🔥", text };
  }
  if (text === "召喚" || text === "登場") {
    return { kind: "chip", icon: "🂠", text };
  }
  if (text === "倒れた" || text === "撃破" || text === "山札切れ") {
    return { kind: "chip", icon: "💥", text };
  }
  if (text === "判断:") {
    return { kind: "chip", icon: "🧠", text };
  }
  if (text === "ダメージ") {
    return { kind: "chip", icon: "💢", text };
  }
  if (text === "回復") {
    return { kind: "chip", icon: "➕", text };
  }
  if (text === "コピー") {
    return { kind: "chip", icon: "⧉", text };
  }
  if (text === "ローテーション" || text === "リフレッシュ") {
    return { kind: "chip", icon: "🔁", text };
  }
  if (text === "手札") {
    return { kind: "chip", icon: "🃏", text };
  }
  if (text === "山札") {
    return { kind: "chip", icon: "🂠", text };
  }
  if (text === "Lv") {
    return { kind: "chip", icon: "⬆", text };
  }
  if (text === "ターン") {
    return { kind: "chip", icon: "⏭️", text };
  }
  if (text === "引いた") {
    return { kind: "chip", icon: "✋", text };
  }
  if (text === "使った") {
    return { kind: "chip", icon: "✨", text };
  }
  if (text === "入れ替え" || text === "移動") {
    return { kind: "chip", icon: "🧭", text };
  }
  if (text === "レベルアップ") {
    return { kind: "chip", icon: "✨", text };
  }
  if (text === "勝利") {
    return { kind: "chip", icon: "🏆", text };
  }
  return { kind: "chip", icon: "•", text };
}

export function isRandomResultLog(entry: string): boolean {
  return entry.includes("ランダム結果");
}

export function logTone(entry: string): string {
  if (entry.includes("勝利") || entry.includes("敗北")) {
    return "log-win";
  }
  if (isRandomResultLog(entry)) {
    return "log-random";
  }
  if (entry.includes("ダメージ") || entry.includes("倒れ") || entry.includes("HPが") || entry.includes("山札切れ")) {
    return "log-damage";
  }
  if (entry.includes("レベル") || entry.includes("Lv")) {
    return "log-level";
  }
  if (entry.includes("召喚") || entry.includes("登場")) {
    return "log-summon";
  }
  if (entry.includes("ため") || entry.includes("気合い")) {
    return "log-focus";
  }
  if (entry.includes("シールド") || entry.includes("ウェイクアップ") || entry.includes("回復")) {
    return "log-support";
  }
  if (entry.includes("ターン") || entry.includes("引いた") || entry.includes("ストーン")) {
    return "log-turn";
  }
  return "log-normal";
}

export function logMatchesFilter(entry: string, filter: LogFilter): boolean {
  if (filter === "all") {
    return true;
  }
  if (filter === "cpu") {
    return entry.includes("判断:");
  }
  if (filter === "battle") {
    return entry.includes("攻撃") || entry.includes("アタック") || entry.includes("倒れ") || entry.includes("撃破");
  }
  if (filter === "damage") {
    return entry.includes("ダメージ") || entry.includes("HPが") || entry.includes("山札切れ");
  }
  if (filter === "support") {
    return (
      entry.includes("使った") ||
      entry.includes("シールド") ||
      entry.includes("ウェイクアップ") ||
      entry.includes("回復") ||
      entry.includes("コピー") ||
      entry.includes("入れ替え") ||
      entry.includes("ローテーション") ||
      entry.includes("リフレッシュ") ||
      isRandomResultLog(entry)
    );
  }
  return entry.includes("ターン") || entry.includes("引いた") || entry.includes("ストーン") || entry.includes("召喚");
}

export function logFilterLabel(filter: LogFilter): string {
  if (filter === "all") {
    return "All";
  }
  if (filter === "battle") {
    return "Battle";
  }
  if (filter === "damage") {
    return "Damage";
  }
  if (filter === "support") {
    return "Support";
  }
  if (filter === "turn") {
    return "Turn";
  }
  return "CPU";
}

export function logFilterIcon(filter: LogFilter): string {
  if (filter === "battle") {
    return "⚔️";
  }
  if (filter === "damage") {
    return "💥";
  }
  if (filter === "support") {
    return "🛡️";
  }
  if (filter === "turn") {
    return "⏭️";
  }
  if (filter === "cpu") {
    return "🧠";
  }
  return "•";
}

export function logCategoryLabel(entry: string): string {
  if (entry.includes("判断:")) {
    return "CPU判断";
  }
  if (logMatchesFilter(entry, "damage")) {
    return "ダメージ/HP";
  }
  if (logMatchesFilter(entry, "battle")) {
    return "戦闘";
  }
  if (logMatchesFilter(entry, "support")) {
    return "支援/特殊効果";
  }
  if (logMatchesFilter(entry, "turn")) {
    return "ターン進行";
  }
  return "その他";
}
