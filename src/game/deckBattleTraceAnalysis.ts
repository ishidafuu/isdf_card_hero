export type TraceDecisionIssueId =
  | "over_defense"
  | "missed_attack_pressure"
  | "low_impact_movement"
  | "late_focus"
  | "resource_stall"
  | "closeout_delay";

export interface TraceDecisionIssueSummary {
  id: TraceDecisionIssueId;
  count: number;
  examples: string[];
}

export interface TraceDecisionIssueReport {
  totalEntries: number;
  issues: TraceDecisionIssueSummary[];
}

const ISSUE_LABELS = {
  over_defense: "守りすぎ候補",
  missed_attack_pressure: "攻撃見送り候補",
  low_impact_movement: "低影響移動候補",
  late_focus: "終盤ためる候補",
  resource_stall: "リソース停滞候補",
  closeout_delay: "勝ち切り遅延候補",
} satisfies Record<TraceDecisionIssueId, string>;

export function analyzeTraceDecisionIssues(
  traces: readonly { logTail: readonly string[] }[],
): TraceDecisionIssueReport {
  const summaries = new Map<TraceDecisionIssueId, TraceDecisionIssueSummary>();
  let totalEntries = 0;

  for (const trace of traces) {
    for (const entry of trace.logTail) {
      if (!entry.includes("判断:")) {
        continue;
      }
      totalEntries += 1;
      for (const issueId of classifyDecisionLogEntry(entry)) {
        const summary = summaries.get(issueId) ?? { id: issueId, count: 0, examples: [] };
        summary.count += 1;
        if (summary.examples.length < 3) {
          summary.examples.push(entry);
        }
        summaries.set(issueId, summary);
      }
    }
  }

  return {
    totalEntries,
    issues: [...summaries.values()].sort((a, b) => b.count - a.count || issueLabel(a.id).localeCompare(issueLabel(b.id))),
  };
}

export function classifyDecisionLogEntry(entry: string): TraceDecisionIssueId[] {
  const issues = new Set<TraceDecisionIssueId>();
  const hasCloseoutSignal =
    entry.includes("相手マスター") ||
    entry.includes("マスター攻撃") ||
    entry.includes("倒せる") ||
    entry.includes("撃破");

  if ((entry.includes("シールド") || entry.includes("守")) && !entry.includes("倒せる")) {
    issues.add("over_defense");
  }
  if (entry.includes("見送り") && (entry.includes("攻撃") || entry.includes("マジック") || entry.includes("マスター特技"))) {
    issues.add("missed_attack_pressure");
  }
  if (entry.includes("移動") && !entry.includes("強い攻撃筋") && !entry.includes("攻撃しやすく")) {
    issues.add("low_impact_movement");
  }
  if (entry.includes("ためる") && !entry.includes("マスター攻撃につなげる")) {
    issues.add("late_focus");
  }
  if (entry.includes("ターン終了") || entry.includes("有効な行動がない")) {
    issues.add("resource_stall");
  }
  if (entry.includes("見送り") && hasCloseoutSignal) {
    issues.add("closeout_delay");
  }

  return [...issues];
}

export function formatTraceDecisionIssuesMarkdown(report: TraceDecisionIssueReport): string {
  return [
    `## Decision Issue Summary`,
    ``,
    `Decision log entries: ${report.totalEntries}`,
    ``,
    `| Issue | Count | Examples |`,
    `| --- | ---: | --- |`,
    ...report.issues.map((issue) =>
      `| ${issueLabel(issue.id)} | ${issue.count} | ${issue.examples.map(escapeMarkdownTableCell).join("<br>")} |`,
    ),
    ``,
  ].join("\n");
}

export function issueLabel(issueId: TraceDecisionIssueId): string {
  return ISSUE_LABELS[issueId];
}

function escapeMarkdownTableCell(value: string): string {
  return value.replaceAll("|", "\\|");
}
