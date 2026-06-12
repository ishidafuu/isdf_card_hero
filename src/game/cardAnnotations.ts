import type { CardDef } from "./types";

export const IMPLEMENTED_PERSONALITY_CARD_IDS = [
  "bomuzo",
  "polyspinner",
  "card_006",
  "card_012",
  "card_035",
  "card_038",
  "card_039",
  "card_044",
  "card_046",
  "card_048",
  "card_051",
  "card_052",
  "card_067",
  "card_072",
  "card_073",
  "card_077",
  "card_078",
  "card_080",
  "card_081",
  "card_099",
  "card_100",
  "card_101",
  "card_102",
  "card_103",
  "card_106",
  "card_109",
  "card_112",
  "card_132",
  "card_133",
  "card_142",
  "card_143",
  "card_144",
] as const;

export type ImplementedPersonalityCardId = typeof IMPLEMENTED_PERSONALITY_CARD_IDS[number];

export type CardNoteKind = "personality" | "rule";

export interface CardNoteDisplay {
  kind: CardNoteKind;
  label: string;
  text: string;
  summary: string;
}

const IMPLEMENTED_PERSONALITY_CARD_ID_SET = new Set<string>(IMPLEMENTED_PERSONALITY_CARD_IDS);

export function isImplementedPersonalityCard(cardId: string): cardId is ImplementedPersonalityCardId {
  return IMPLEMENTED_PERSONALITY_CARD_ID_SET.has(cardId);
}

export function isNonGameplayNote(note: string): boolean {
  const normalized = note.normalize("NFKC").toLowerCase();
  return (
    normalized.includes("spd使用不可") ||
    normalized.includes("スーパーカード") ||
    normalized.includes("全てのスーパー") ||
    /^lv\d+からレベルアップで .+ になれる$/.test(normalized) ||
    /限定版|非売品|超レア|入手困難|流出モノ|珍品/.test(note) ||
    /^（[^）]+）$/.test(note)
  );
}

export function getCardNoteDisplays(card: Pick<CardDef, "id" | "notes">): CardNoteDisplay[] {
  return (card.notes ?? [])
    .map((note) => note.replace(/\s+/g, " ").trim())
    .filter((note) => note && !isNonGameplayNote(note))
    .map((note) => {
      if (isPersonalityNote(note)) {
        const summary = personalitySummary(note);
        return {
          kind: "personality",
          label: "性格",
          text: note,
          summary,
        };
      }

      return {
        kind: "rule",
        label: "効果",
        text: note,
        summary: note,
      };
    });
}

function isPersonalityNote(note: string): boolean {
  return note.trim().startsWith("性格");
}

function personalitySummary(note: string): string {
  return note.replace(/^性格[:：]\s*/, "");
}
