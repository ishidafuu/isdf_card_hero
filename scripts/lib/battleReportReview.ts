import type { AiDecisionHistoryEntry } from "../../src/game/types";

export interface BattleReportComment {
  logIndex: number;
  entry: string;
  stamp?: "good" | "bad" | "question";
  comment: string;
}

export interface BattleReportForReview {
  reportId: string;
  generatedAt?: string;
  comments?: BattleReportComment[];
  aiDecisionHistory?: AiDecisionHistoryEntry[];
}

export interface CommentDecisionMatch {
  comment: BattleReportComment;
  decision: AiDecisionHistoryEntry;
}

export function matchReviewCommentsToDecisions(
  report: BattleReportForReview,
  stamps: readonly BattleReportComment["stamp"][] = ["bad", "question"],
): CommentDecisionMatch[] {
  const decisions = [...(report.aiDecisionHistory ?? [])].sort((a, b) => a.logIndex - b.logIndex);
  return (report.comments ?? [])
    .filter((comment) => comment.stamp && stamps.includes(comment.stamp))
    .flatMap((comment) => {
      const decision = decisions
        .filter((candidate) => candidate.logIndex <= comment.logIndex)
        .at(-1);
      return decision ? [{ comment, decision }] : [];
    });
}

export function assertBattleReportForReview(value: unknown): asserts value is BattleReportForReview {
  if (!value || typeof value !== "object") {
    throw new Error("battle report must be an object");
  }
  const report = value as Partial<BattleReportForReview>;
  if (typeof report.reportId !== "string" || !report.reportId) {
    throw new Error("battle report requires reportId");
  }
  if (!Array.isArray(report.aiDecisionHistory)) {
    throw new Error("battle report does not contain aiDecisionHistory; record a new review battle");
  }
}
