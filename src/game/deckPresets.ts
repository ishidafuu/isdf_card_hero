import { summarizeDeckCardIds } from "./cards";

export type DeckPresetId = "special-showcase";

export const DECK_PRESET_IDS: DeckPresetId[] = ["special-showcase"];

const SPECIAL_SHOWCASE_DECK_CARD_IDS = [
  "bomuzo",
  "bomuzo",
  "bomuzo",
  "polyspinner",
  "polyspinner",
  "polyspinner",
  "card_003",
  "card_003",
  "card_003",
  "card_033",
  "card_033",
  "card_033",
  "yanbaru",
  "yanbaru",
  "yanbaru",
  "card_020",
  "card_020",
  "card_020",
  "healing",
  "healing",
  "thunder",
  "thunder",
  "card_123",
  "card_123",
  "card_006",
  "card_012",
  "card_138",
  "card_141",
  "card_142",
  "card_143",
] as const;

export function buildDeckPresetCardIds(presetId: DeckPresetId): string[] {
  if (presetId === "special-showcase") {
    return [...SPECIAL_SHOWCASE_DECK_CARD_IDS];
  }
  const exhaustive: never = presetId;
  throw new Error(`Unknown deck preset: ${exhaustive}`);
}

export function deckPresetAllowsSpecial(presetId: DeckPresetId): boolean {
  return presetId === "special-showcase";
}

export function validateDeckPresets(): void {
  for (const presetId of DECK_PRESET_IDS) {
    const summary = summarizeDeckCardIds(buildDeckPresetCardIds(presetId), [], {
      allowSpecial: deckPresetAllowsSpecial(presetId),
    });
    if (!summary.valid) {
      throw new Error(`${presetId} deck preset is invalid: ${summary.errors.join(" / ")}`);
    }
  }
}
