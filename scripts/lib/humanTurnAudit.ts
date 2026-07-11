import {
  chooseCpuDecision,
  inspectCpuDecisionEvaluations,
  type CpuDecision,
} from "../../src/game/cpuAi";
import { clearTurnPlannerV2Cache } from "../../src/game/cpuAiV2/turnPlanner";
import { restoreAiDecisionStateSnapshot } from "../../src/game/aiReviewTrace";
import { endTurn } from "../../src/game/rules";
import type {
  AiDecisionHistoryEntry,
  HumanActionHistoryEntry,
} from "../../src/game/types";

export type HumanTurnAuditClassification =
  | "aligned"
  | "ordering_gap"
  | "evaluation_gap"
  | "candidate_missing"
  | "legacy_observation_only";

export interface HumanTurnAuditReportInput {
  reportId: string;
  generatedAt?: string;
  eventLog?: string[];
  aiDecisionHistory?: AiDecisionHistoryEntry[];
  humanActionHistory?: HumanActionHistoryEntry[];
}

export interface HumanTurnAuditEntry {
  turnNumber: number;
  source: "structured" | "legacy";
  observedActions: string[];
  v2Selected: string;
  v2Reason: string;
  v2PlanActions: string[];
  v2OpponentActions: string[];
  candidateCoverage?: { covered: number; comparable: number };
  classification: HumanTurnAuditClassification;
}

export interface HumanTurnAuditResult {
  reportId: string;
  generatedAt?: string;
  entries: HumanTurnAuditEntry[];
}

export function analyzeHumanTurnReport(report: HumanTurnAuditReportInput): HumanTurnAuditResult {
  const structured = extractStructuredHumanTurns(report);
  const entries = structured.length > 0 ? structured : extractLegacyHumanTurns(report);
  return { reportId: report.reportId, generatedAt: report.generatedAt, entries };
}

export function extractStructuredHumanTurns(report: HumanTurnAuditReportInput): HumanTurnAuditEntry[] {
  const grouped = new Map<number, HumanActionHistoryEntry[]>();
  for (const entry of report.humanActionHistory ?? []) {
    if (entry.playerId !== "player") {
      continue;
    }
    const turn = grouped.get(entry.turnNumber) ?? [];
    turn.push(entry);
    grouped.set(entry.turnNumber, turn);
  }

  return [...grouped.entries()]
    .sort(([a], [b]) => a - b)
    .map(([turnNumber, actions]) => {
      actions.sort((a, b) => a.sequence - b.sequence);
      const start = restoreAiDecisionStateSnapshot(actions[0].stateBefore);
      const v2 = inspectV2Turn(start);
      const observedActions = actions.map((entry) => entry.actionKey);
      const comparableActions = actions.filter((entry) => isComparableHumanAction(entry.actionKey));
      const covered = comparableActions.filter((entry) => {
        const state = restoreAiDecisionStateSnapshot(entry.stateBefore);
        const available = inspectCpuDecisionEvaluations(state, { profile: "white" })
          .map((candidate) => cpuDecisionReviewKey(candidate.decision));
        return available.includes(normalizeReviewKey(entry.actionKey));
      }).length;
      const firstHuman = comparableActions[0]?.actionKey;
      return {
        turnNumber,
        source: "structured" as const,
        observedActions,
        ...v2,
        candidateCoverage: { covered, comparable: comparableActions.length },
        classification: classifyStructuredTurn(firstHuman, covered, comparableActions.length, v2),
      };
    });
}

export function extractLegacyHumanTurns(report: HumanTurnAuditReportInput): HumanTurnAuditEntry[] {
  const decisions = [...(report.aiDecisionHistory ?? [])].sort((a, b) => a.logIndex - b.logIndex);
  const cpuEnds = decisions.filter(
    (entry) => entry.playerId === "cpu" && entry.decision.type === "end_turn",
  );
  return cpuEnds.flatMap((entry) => {
    let start;
    try {
      start = endTurn(restoreAiDecisionStateSnapshot(entry.stateBefore));
    } catch {
      return [];
    }
    if (start.currentPlayer !== "player" || start.winner) {
      return [];
    }
    const nextCpuDecision = decisions.find(
      (candidate) => candidate.logIndex > entry.logIndex && candidate.playerId === "cpu",
    );
    const segment = (report.eventLog ?? []).slice(
      entry.logIndex,
      nextCpuDecision ? Math.max(entry.logIndex, nextCpuDecision.logIndex - 1) : undefined,
    );
    const observedActions = legacyPlayerActionLogs(segment);
    const v2 = inspectV2Turn(start);
    return [{
      turnNumber: start.turnNumber,
      source: "legacy" as const,
      observedActions,
      ...v2,
      classification: "legacy_observation_only" as const,
    }];
  });
}

function inspectV2Turn(state: ReturnType<typeof restoreAiDecisionStateSnapshot>) {
  clearTurnPlannerV2Cache();
  const decision = chooseCpuDecision(state, { profile: "white_v2" });
  const plan = decision.trace?.turnPlan;
  return {
    v2Selected: cpuDecisionReviewKey(decision),
    v2Reason: decision.reason,
    v2PlanActions: plan?.actions ?? [cpuDecisionReviewKey(decision)],
    v2OpponentActions: plan?.opponentActions ?? [],
  };
}

function classifyStructuredTurn(
  firstHuman: string | undefined,
  covered: number,
  comparable: number,
  v2: ReturnType<typeof inspectV2Turn>,
): HumanTurnAuditClassification {
  if (!firstHuman) {
    return "aligned";
  }
  const normalizedHuman = normalizeReviewKey(firstHuman);
  if (normalizedHuman === normalizeReviewKey(v2.v2Selected)) {
    return "aligned";
  }
  if (covered < comparable) {
    return "candidate_missing";
  }
  if (v2.v2PlanActions.map(normalizeReviewKey).includes(normalizedHuman)) {
    return "ordering_gap";
  }
  return "evaluation_gap";
}

function isComparableHumanAction(actionKey: string): boolean {
  return !actionKey.startsWith("level_up:") &&
    !actionKey.startsWith("discard_hand:") &&
    actionKey !== "master_hp_draw";
}

function normalizeReviewKey(key: string): string {
  return key.startsWith("end_turn:") ? "end_turn" : key;
}

function legacyPlayerActionLogs(segment: readonly string[]): string[] {
  const start = segment.findIndex((line) => line === "プレイヤーのターン開始");
  const scoped = start >= 0 ? segment.slice(start + 1) : [...segment];
  const end = scoped.findIndex((line) => line === "CPUのターン開始");
  return (end >= 0 ? scoped.slice(0, end) : scoped).filter((line) => !isLegacyAutomaticTurnLog(line));
}

function isLegacyAutomaticTurnLog(line: string): boolean {
  return line === "先攻1ターン目のため、カードは引かない" ||
    line.startsWith("プレイヤーはストーンを") ||
    line.startsWith("プレイヤーはカードを引いた") ||
    line.startsWith("プレイヤーは") && line.endsWith("を引いた") ||
    line.includes("が登場した") ||
    line.includes("が前衛へ自動移動した") ||
    line.includes("の防御効果が切れた");
}

function cpuDecisionReviewKey(decision: CpuDecision): string {
  if (decision.type === "attack") {
    return `attack:${decision.action.attackerSlotKey}:${decision.action.commandId}:${targetKey(decision.action.target)}`;
  }
  if (decision.type === "master_action") {
    return `master:${decision.actionId}:${targetKey(decision.target)}`;
  }
  if (decision.type === "summon") {
    return `summon:${decision.handInstanceId}:${decision.slotKey}`;
  }
  if (decision.type === "magic") {
    return `magic:${decision.action.handInstanceId}:${targetKey(decision.action.target)}`;
  }
  if (decision.type === "move") {
    return `move:${decision.fromSlotKey}:${decision.toSlotKey}`;
  }
  if (decision.type === "focus") {
    return `focus:${decision.slotKey}`;
  }
  return "end_turn";
}

function targetKey(target: { kind: "monster"; slotKey: string } | { kind: "master"; playerId: string }): string {
  return target.kind === "monster" ? `monster:${target.slotKey}` : `master:${target.playerId}`;
}

export function formatHumanTurnAuditMarkdown(results: readonly HumanTurnAuditResult[]): string {
  const entries = results.flatMap((result) => result.entries);
  const structuredCount = entries.filter((entry) => entry.source === "structured").length;
  const lines = [
    "# Human Turn Imitation Audit",
    "",
    `- reports: ${results.length}`,
    `- audited turns: ${entries.length}`,
    `- structured turns: ${structuredCount}`,
    `- legacy observation turns: ${entries.length - structuredCount}`,
    "",
    "旧レポートは人間操作が文章ログだけのため、候補被覆と評価差の確定判定は行わない。新形式のレポートでは構造化操作を使って分類する。",
    "",
  ];
  for (const result of results) {
    lines.push(
      `## ${result.reportId}`,
      "",
      `- generated: ${result.generatedAt ?? "unknown"}`,
      `- turns: ${result.entries.length}`,
      "",
    );
    for (const entry of result.entries) {
      lines.push(
        `### Turn ${entry.turnNumber} (${entry.source})`,
        "",
        `- classification: \`${entry.classification}\``,
        `- human: ${entry.observedActions.length > 0 ? entry.observedActions.map((action) => `\`${action}\``).join(" -> ") : "記録なし"}`,
        `- White V2: \`${entry.v2Selected}\``,
        `- reason: ${entry.v2Reason}`,
        `- V2 line: ${entry.v2PlanActions.map((action) => `\`${action}\``).join(" -> ")}`,
      );
      if (entry.candidateCoverage) {
        lines.push(`- candidate coverage: ${entry.candidateCoverage.covered}/${entry.candidateCoverage.comparable}`);
      }
      if (entry.v2OpponentActions.length > 0) {
        lines.push(`- opponent response: ${entry.v2OpponentActions.map((action) => `\`${action}\``).join(" -> ")}`);
      }
      lines.push("");
    }
  }
  return lines.join("\n").trimEnd();
}
