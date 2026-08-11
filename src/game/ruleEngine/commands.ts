import type { CommandDef } from "../types";

const UTILITY_COMMAND_NAMES = new Set([
  "レベルダウン",
  "レベルムーブ",
  "ヘブンズドア",
  "ホワイトブレス",
  "マッドホール",
  "それちょうだい",
  "パワーチャージ",
  "ドローフォース",
  "レベルアップ",
  "夢幻の光",
  "ソウルスイッチ",
  "ヒーリング",
  "癒しの光",
  "癒しの羽",
  "コールドブレス",
  "神秘のキノコ",
  "マナ変化",
  "再生",
  "ジャックポット",
  "ウォッシュ",
  "レベル固定",
  "福音の花",
  "ウェイクホーン",
  "ワープ",
  "挑発",
]);

/** Commands outside the explicit utility list enter the damage resolution path. */
export function isDamageCommand(command: CommandDef): boolean {
  return !UTILITY_COMMAND_NAMES.has(command.name);
}

export function isUtilityCommand(command: CommandDef): boolean {
  return UTILITY_COMMAND_NAMES.has(command.name);
}
