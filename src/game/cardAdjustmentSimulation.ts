import { getCardDef, getCardName } from "./cards";
import { getMagicAiTrait } from "./aiTraits";
import { getMonsterAiTrait } from "./aiUnitTraits";
import { evaluateCard } from "./unitEvaluation";

export type CardAdjustmentRiskLevel = "low" | "medium" | "high";

export interface CardAdjustmentDraft {
  cardId: string;
  hpDelta?: number;
  powerDelta?: number;
  costDelta?: number;
  note?: string;
}

export interface CardAdjustmentImpact {
  cardId: string;
  name: string;
  type: "monster" | "magic";
  beforeTotal: number;
  estimatedTotal: number;
  estimatedDelta: number;
  riskLevel: CardAdjustmentRiskLevel;
  tags: string[];
  reviewNotes: string[];
}

export interface CardAdjustmentSimulationReport {
  changes: CardAdjustmentDraft[];
  impacts: CardAdjustmentImpact[];
  highRiskCount: number;
  mediumRiskCount: number;
  reviewFocus: string[];
}

export function simulateCardAdjustmentImpacts(
  changes: readonly CardAdjustmentDraft[],
): CardAdjustmentSimulationReport {
  const impacts = changes.map(simulateCardAdjustmentImpact).sort((a, b) => Math.abs(b.estimatedDelta) - Math.abs(a.estimatedDelta));
  return {
    changes: [...changes],
    impacts,
    highRiskCount: impacts.filter((impact) => impact.riskLevel === "high").length,
    mediumRiskCount: impacts.filter((impact) => impact.riskLevel === "medium").length,
    reviewFocus: buildReviewFocus(impacts),
  };
}

export function simulateCardAdjustmentImpact(change: CardAdjustmentDraft): CardAdjustmentImpact {
  const def = getCardDef(change.cardId);
  const before = evaluateCard(change.cardId);
  const estimatedDelta = Math.round(
    (change.hpDelta ?? 0) * hpWeight(def.type) +
      (change.powerDelta ?? 0) * powerWeight(def.type) -
      (change.costDelta ?? 0) * costWeight(def.type),
  );
  const tags = cardAdjustmentTags(change.cardId);
  const riskLevel = adjustmentRiskLevel(estimatedDelta, tags);
  return {
    cardId: change.cardId,
    name: getCardName(change.cardId),
    type: def.type,
    beforeTotal: before.total,
    estimatedTotal: before.total + estimatedDelta,
    estimatedDelta,
    riskLevel,
    tags,
    reviewNotes: adjustmentReviewNotes(change, tags, riskLevel),
  };
}

export function formatCardAdjustmentSimulationMarkdown(report: CardAdjustmentSimulationReport): string {
  return [
    `# カード調整シミュレーション`,
    ``,
    `## Summary`,
    ``,
    `| 項目 | 値 |`,
    `| --- | ---: |`,
    `| Changes | ${report.changes.length} |`,
    `| High risk | ${report.highRiskCount} |`,
    `| Medium risk | ${report.mediumRiskCount} |`,
    ``,
    `## Review Focus`,
    ``,
    ...report.reviewFocus.map((focus) => `- ${focus}`),
    ``,
    `## Impacts`,
    ``,
    `| Card | Type | Before | Estimated | Delta | Risk | Tags | Notes |`,
    `| --- | --- | ---: | ---: | ---: | --- | --- | --- |`,
    ...report.impacts.map((impact) =>
      `| ${impact.name} (${impact.cardId}) | ${impact.type} | ${impact.beforeTotal} | ${impact.estimatedTotal} | ` +
      `${formatSignedNumber(impact.estimatedDelta)} | ${impact.riskLevel} | ${impact.tags.join(", ")} | ` +
      `${impact.reviewNotes.join("<br>")} |`,
    ),
    ``,
  ].join("\n");
}

function hpWeight(type: "monster" | "magic"): number {
  return type === "monster" ? 12 : 0;
}

function powerWeight(type: "monster" | "magic"): number {
  return type === "monster" ? 20 : 14;
}

function costWeight(type: "monster" | "magic"): number {
  return type === "magic" ? 9 : 4;
}

function cardAdjustmentTags(cardId: string): string[] {
  const def = getCardDef(cardId);
  if (def.type === "magic") {
    const trait = getMagicAiTrait(cardId);
    return [
      "magic",
      trait ? `effect:${trait.effectKind}` : "effect:unclassified",
      trait ? `value:${trait.valueModel}` : "value:unknown",
      ...(trait?.intents ?? []).map((intent) => `intent:${intent}`),
    ];
  }
  const trait = getMonsterAiTrait(cardId);
  return ["monster", `role:${trait.role}`, ...trait.intents.map((intent) => `intent:${intent}`)];
}

function adjustmentRiskLevel(delta: number, tags: readonly string[]): CardAdjustmentRiskLevel {
  const magnitude = Math.abs(delta);
  if (magnitude >= 38 || tags.includes("intent:lethal") || tags.includes("effect:damage")) {
    return magnitude >= 22 ? "high" : "medium";
  }
  if (magnitude >= 20 || tags.includes("effect:search") || tags.includes("effect:draw")) {
    return "medium";
  }
  return "low";
}

function adjustmentReviewNotes(
  change: CardAdjustmentDraft,
  tags: readonly string[],
  riskLevel: CardAdjustmentRiskLevel,
): string[] {
  const notes = [
    riskLevel === "high" ? "実戦スコアとAI重み比較を必ず再計測" : "",
    riskLevel === "medium" ? "smoke以上の実戦スコアで確認" : "",
    tags.includes("effect:damage") ? "ダメージ系はリーサル/撃破判断のtraceを確認" : "",
    tags.includes("effect:heal") || tags.includes("effect:shield") ? "防御系は長期戦化しないか確認" : "",
    (change.hpDelta ?? 0) !== 0 ? "HP変更は撃破価値と盤面滞在時間に影響" : "",
    (change.costDelta ?? 0) !== 0 ? "コスト変更は石テンポとマジック使用順に影響" : "",
    change.note ?? "",
  ].filter(Boolean);
  return notes.length > 0 ? notes : ["低リスク。通常の回帰テストで確認"];
}

function buildReviewFocus(impacts: readonly CardAdjustmentImpact[]): string[] {
  const highRisk = impacts.filter((impact) => impact.riskLevel === "high");
  const mediumRisk = impacts.filter((impact) => impact.riskLevel === "medium");
  return [
    highRisk[0]
      ? `${highRisk[0].name}: high risk。safety:card-adjustment と compare:ai-weights を優先。`
      : undefined,
    mediumRisk[0] ? `${mediumRisk[0].name}: medium risk。smoke実戦で勝率・速度・警告を確認。` : undefined,
    impacts.some((impact) => impact.tags.includes("effect:damage"))
      ? "ダメージ魔法を含むため、勝ち切りtraceとマスター打点評価を確認。"
      : undefined,
    impacts.some((impact) => impact.tags.includes("effect:heal") || impact.tags.includes("effect:shield"))
      ? "防御系を含むため、白同士長期戦と過剰防御を確認。"
      : undefined,
  ].filter((item): item is string => !!item);
}

function formatSignedNumber(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}
