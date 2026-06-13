import {
  getCardDef,
  getCardMemberRatingAverage,
  getCardName,
  summarizeDeckCardIds,
  type DeckCategory,
} from "./cards";
import { DECK_SUBMISSION_PRESETS, type DeckSubmissionGroupId, type DeckSubmissionPresetDef } from "./deckSubmissionPresets";
import type { MasterId } from "./types";

export type DeckTemplateArchetype =
  | "aggro"
  | "backline"
  | "balanced"
  | "control"
  | "magic-heavy"
  | "special"
  | "stone-tempo";

export interface DeckTemplateCardSummary {
  cardId: string;
  name: string;
  count: number;
  rating?: number;
}

export interface DeckTemplateAudit {
  id: DeckSubmissionPresetDef["id"];
  name: string;
  group: DeckSubmissionGroupId;
  sourceDeckId: number;
  sourceUrl: string;
  mode: string;
  masterId: MasterId;
  allowSpecial: boolean;
  counts: Record<DeckCategory, number>;
  total: number;
  averageRating: number;
  ratingCoverage: number;
  threeCopyCount: number;
  uniqueCards: number;
  implementationRisk: number;
  extremeCompositionScore: number;
  practicalScore: number;
  stressScore: number;
  archetypes: DeckTemplateArchetype[];
  keyCards: DeckTemplateCardSummary[];
  warnings: string[];
}

export interface DeckTemplateGroupSummary {
  group: DeckSubmissionGroupId;
  total: number;
  allowSpecial: number;
  averagePracticalScore: number;
  averageRating: number;
  archetypes: Partial<Record<DeckTemplateArchetype, number>>;
  topDecks: DeckTemplateAudit[];
}

const STONE_TEMPO_CARD_IDS = new Set([
  "card_105",
  "card_113",
  "card_119",
  "card_121",
  "card_122",
]);

const DEFENSE_CARD_IDS = new Set([
  "healing",
  "card_025",
  "card_030",
  "card_055",
  "card_062",
  "card_088",
  "card_089",
  "card_127",
  "card_128",
]);

const DIRECT_PRESSURE_CARD_IDS = new Set([
  "polyspinner",
  "morgan",
  "thunder",
  "power_up",
  "card_094",
  "card_118",
  "card_126",
  "card_129",
]);

export function analyzeDeckSubmissions(presets: readonly DeckSubmissionPresetDef[] = DECK_SUBMISSION_PRESETS): DeckTemplateAudit[] {
  return presets
    .map(analyzeDeckSubmission)
    .sort((a, b) => b.practicalScore - a.practicalScore || b.sourceDeckId - a.sourceDeckId);
}

export function summarizeDeckTemplateGroups(audits: readonly DeckTemplateAudit[]): DeckTemplateGroupSummary[] {
  const groups = new Map<DeckSubmissionGroupId, DeckTemplateAudit[]>();
  for (const audit of audits) {
    groups.set(audit.group, [...(groups.get(audit.group) ?? []), audit]);
  }
  return [...groups.entries()]
    .map(([group, entries]) => ({
      group,
      total: entries.length,
      allowSpecial: entries.filter((entry) => entry.allowSpecial).length,
      averagePracticalScore: round(average(entries.map((entry) => entry.practicalScore)), 1),
      averageRating: round(average(entries.map((entry) => entry.averageRating)), 2),
      archetypes: archetypeCounts(entries),
      topDecks: entries.slice(0, 5),
    }))
    .sort((a, b) => a.group.localeCompare(b.group));
}

export function analyzeDeckSubmission(preset: DeckSubmissionPresetDef): DeckTemplateAudit {
  const summary = summarizeDeckCardIds(preset.cardIds, [], { allowSpecial: preset.allowSpecial });
  const counts = cardCounts(preset.cardIds);
  const keyCards = keyCardSummaries(counts, preset.masterId);
  const ratings = preset.cardIds
    .map((cardId) => getCardMemberRatingAverage(cardId, preset.masterId))
    .filter((rating): rating is number => rating !== undefined);
  const averageRating = ratings.length > 0 ? average(ratings) : 0;
  const implementationRisk = implementationRiskScore(preset.cardIds);
  const extremeCompositionScore = compositionExtremeness(summary.categories);
  const archetypes = inferArchetypes(preset, summary.categories);
  const threeCopyCount = [...counts.values()].filter((count) => count >= 3).length;
  const ratingCoverage = preset.cardIds.length > 0 ? ratings.length / preset.cardIds.length : 0;
  const practicalScore = round(
    averageRating * 20 +
      Math.min(12, threeCopyCount * 1.4) +
      Math.min(8, keyCards.length) +
      (preset.allowSpecial ? 1 : 0) -
      implementationRisk * 10 -
      Math.max(0, extremeCompositionScore - 10) * 0.25,
    1,
  );
  const stressScore = round(extremeCompositionScore + summary.categories.special * 3 + implementationRisk * 12 + (preset.allowSpecial ? 5 : 0), 1);
  return {
    id: preset.id,
    name: preset.name,
    group: preset.group,
    sourceDeckId: preset.sourceDeckId,
    sourceUrl: preset.sourceUrl,
    mode: preset.mode,
    masterId: preset.masterId,
    allowSpecial: preset.allowSpecial,
    counts: summary.categories,
    total: summary.total,
    averageRating: round(averageRating, 2),
    ratingCoverage: round(ratingCoverage, 2),
    threeCopyCount,
    uniqueCards: counts.size,
    implementationRisk,
    extremeCompositionScore,
    practicalScore,
    stressScore,
    archetypes,
    keyCards,
    warnings: deckWarnings(summary.errors, implementationRisk, ratingCoverage),
  };
}

function cardCounts(cardIds: readonly string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const cardId of cardIds) {
    counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
  }
  return counts;
}

function keyCardSummaries(counts: Map<string, number>, masterId: MasterId): DeckTemplateCardSummary[] {
  return [...counts.entries()]
    .map(([cardId, count]) => ({
      cardId,
      name: getCardName(cardId),
      count,
      rating: getCardMemberRatingAverage(cardId, masterId),
    }))
    .sort((a, b) => {
      const countDiff = b.count - a.count;
      if (countDiff !== 0) {
        return countDiff;
      }
      return (b.rating ?? 0) - (a.rating ?? 0) || a.name.localeCompare(b.name, "ja");
    })
    .slice(0, 8)
    .map((card) => ({
      ...card,
      rating: card.rating === undefined ? undefined : round(card.rating, 2),
    }));
}

function implementationRiskScore(cardIds: readonly string[]): number {
  let risk = 0;
  for (const cardId of new Set(cardIds)) {
    const def = getCardDef(cardId);
    if (def.type === "magic" && def.implemented === false) {
      risk += 1;
    }
    if (def.type === "monster") {
      risk += def.levels.flatMap((level) => level.commands).filter((command) => command.implemented === false).length;
    }
  }
  return risk;
}

function compositionExtremeness(counts: Record<DeckCategory, number>): number {
  return Math.abs(counts.front - 12) + Math.abs(counts.back - 6) + Math.abs(counts.magic - 6) + counts.special * 1.5;
}

function inferArchetypes(
  preset: DeckSubmissionPresetDef,
  counts: Record<DeckCategory, number>,
): DeckTemplateArchetype[] {
  const cardIdSet = new Set(preset.cardIds);
  const archetypes = new Set<DeckTemplateArchetype>();
  if (counts.special >= 2 || preset.allowSpecial) {
    archetypes.add("special");
  }
  if (counts.magic >= 11) {
    archetypes.add("magic-heavy");
  }
  if (counts.back >= 8) {
    archetypes.add("backline");
  }
  if (counts.front >= 15 || hasAny(cardIdSet, DIRECT_PRESSURE_CARD_IDS)) {
    archetypes.add("aggro");
  }
  if (hasAny(cardIdSet, STONE_TEMPO_CARD_IDS)) {
    archetypes.add("stone-tempo");
  }
  if (hasAny(cardIdSet, DEFENSE_CARD_IDS) || counts.magic >= 9) {
    archetypes.add("control");
  }
  if (archetypes.size === 0) {
    archetypes.add("balanced");
  }
  return [...archetypes].sort();
}

function hasAny(source: Set<string>, targets: Set<string>): boolean {
  for (const target of targets) {
    if (source.has(target)) {
      return true;
    }
  }
  return false;
}

function deckWarnings(errors: readonly string[], implementationRisk: number, ratingCoverage: number): string[] {
  const warnings = [...errors];
  if (implementationRisk > 0) {
    warnings.push(`実装リスク ${implementationRisk}`);
  }
  if (ratingCoverage < 0.8) {
    warnings.push(`評価カバー率 ${round(ratingCoverage * 100, 1)}%`);
  }
  return warnings;
}

function archetypeCounts(entries: readonly DeckTemplateAudit[]): Partial<Record<DeckTemplateArchetype, number>> {
  const counts: Partial<Record<DeckTemplateArchetype, number>> = {};
  for (const entry of entries) {
    for (const archetype of entry.archetypes) {
      counts[archetype] = (counts[archetype] ?? 0) + 1;
    }
  }
  return counts;
}

function average(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function round(value: number, digits: number): number {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}
