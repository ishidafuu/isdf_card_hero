import type { DeckSubmissionGroupId } from "./deckSubmissionPresets";
import { analyzeDeckSubmissions, type DeckTemplateAudit } from "./deckTemplateAnalysis";
import type { DeckSubmissionPresetId } from "./deckPresets";

export type DeckBenchmarkSuiteId = "smoke" | "core" | "stress" | "holdout";

export interface DeckBenchmarkSuite {
  id: DeckBenchmarkSuiteId;
  name: string;
  description: string;
  deckPresetIds: DeckSubmissionPresetId[];
}

const GROUP_ORDER: DeckSubmissionGroupId[] = [
  "pro-no-rare8-black",
  "pro-with-rare8-black",
  "pro-no-rare8-white",
  "pro-with-rare8-white",
];

export const DECK_BENCHMARK_SUITE_IDS: DeckBenchmarkSuiteId[] = ["smoke", "core", "stress", "holdout"];

export function getDeckBenchmarkSuites(): DeckBenchmarkSuite[] {
  const audits = analyzeDeckSubmissions();
  const byGroup = auditsByGroup(audits);
  const core = takePerGroup(byGroup, 10, practicalSort);
  const smoke = takePerGroup(byGroup, 2, practicalSort);
  const holdout = takePerGroup(byGroup, 5, practicalSort, new Set(core.map((audit) => audit.id)));
  const stressExcluded = new Set([...core, ...holdout].map((audit) => audit.id));
  const stress = takePerGroup(byGroup, 3, stressSort, stressExcluded);

  return [
    {
      id: "smoke",
      name: "投稿デッキSmoke",
      description: "各投稿グループから上位2件。AI評価変更の最小ゲート。",
      deckPresetIds: toPresetIds(smoke),
    },
    {
      id: "core",
      name: "投稿デッキCore",
      description: "各投稿グループから上位10件。AI評価変更の主検証セット。",
      deckPresetIds: toPresetIds(core),
    },
    {
      id: "stress",
      name: "投稿デッキStress",
      description: "特殊カード、極端構成、複雑寄りの投稿デッキ。警告や長期戦の確認用。",
      deckPresetIds: toPresetIds(stress),
    },
    {
      id: "holdout",
      name: "投稿デッキHoldout",
      description: "Coreから外した上位投稿デッキ。調整後の汎化チェック用。",
      deckPresetIds: toPresetIds(holdout),
    },
  ];
}

export function getDeckBenchmarkSuite(suiteId: DeckBenchmarkSuiteId): DeckBenchmarkSuite {
  const suite = getDeckBenchmarkSuites().find((candidate) => candidate.id === suiteId);
  if (!suite) {
    throw new Error(`Unknown deck benchmark suite: ${suiteId}`);
  }
  return suite;
}

function auditsByGroup(audits: readonly DeckTemplateAudit[]): Map<DeckSubmissionGroupId, DeckTemplateAudit[]> {
  const byGroup = new Map<DeckSubmissionGroupId, DeckTemplateAudit[]>();
  for (const group of GROUP_ORDER) {
    byGroup.set(group, audits.filter((audit) => audit.group === group));
  }
  return byGroup;
}

function takePerGroup(
  byGroup: Map<DeckSubmissionGroupId, DeckTemplateAudit[]>,
  count: number,
  sortFn: (a: DeckTemplateAudit, b: DeckTemplateAudit) => number,
  exclude = new Set<string>(),
): DeckTemplateAudit[] {
  return GROUP_ORDER.flatMap((group) =>
    [...(byGroup.get(group) ?? [])]
      .filter((audit) => !exclude.has(audit.id))
      .sort(sortFn)
      .slice(0, count),
  );
}

function practicalSort(a: DeckTemplateAudit, b: DeckTemplateAudit): number {
  return b.practicalScore - a.practicalScore || b.averageRating - a.averageRating || b.sourceDeckId - a.sourceDeckId;
}

function stressSort(a: DeckTemplateAudit, b: DeckTemplateAudit): number {
  return b.stressScore - a.stressScore || b.practicalScore - a.practicalScore || b.sourceDeckId - a.sourceDeckId;
}

function toPresetIds(audits: readonly DeckTemplateAudit[]): DeckSubmissionPresetId[] {
  return audits.map((audit) => audit.id as DeckSubmissionPresetId);
}
