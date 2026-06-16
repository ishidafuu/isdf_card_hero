import {
  formatMasterLabAutoPlaySummary,
  validateMasterLabAutoPlay,
  type MasterLabAutoPlayOptions,
  type MasterLabAutoPlayResult,
  type MasterLabParticipantId,
} from "./masterLabAutoPlay";
import type { MasterLabCandidateId } from "./masterLab";
import type { PlayerId } from "./types";

export interface MasterLabFinalGateMatchup {
  id: string;
  participants: Record<PlayerId, MasterLabParticipantId>;
  seedStart: number;
  recommendedGames: number;
  purpose: string;
}

export interface MasterLabFinalGateOptions extends Omit<MasterLabAutoPlayOptions, "participants" | "seedStart" | "count" | "seedEnd"> {
  candidateId?: MasterLabCandidateId;
  gamesPerMatchup?: number;
}

export interface MasterLabFinalGateRun {
  matchup: MasterLabFinalGateMatchup;
  result: MasterLabAutoPlayResult;
}

export interface MasterLabFinalGateResult {
  ok: boolean;
  candidateId: MasterLabCandidateId;
  runs: MasterLabFinalGateRun[];
  summary: {
    games: number;
    failures: number;
    warnings: number;
    labDecisionCount: number;
    labActionUsage: Record<string, number>;
    labActionTargetUsage: Record<string, number>;
    magicCardUsage: Record<string, number>;
    issueSeeds: number[];
  };
  adoptionJudgement: "ready_for_review" | "needs_iteration";
  notes: string[];
}

const DEFAULT_CANDIDATE_ID = "decoy" satisfies MasterLabCandidateId;

export function buildMasterLabFinalGateMatchups(
  candidateId: MasterLabCandidateId = DEFAULT_CANDIDATE_ID,
): MasterLabFinalGateMatchup[] {
  return [
    {
      id: `${candidateId}_vs_white`,
      participants: { player: candidateId, cpu: "white" },
      seedStart: 1000,
      recommendedGames: 100,
      purpose: "候補がホワイトの育成維持を壊しすぎないか確認する",
    },
    {
      id: `white_vs_${candidateId}`,
      participants: { player: "white", cpu: candidateId },
      seedStart: 1100,
      recommendedGames: 100,
      purpose: "座席差込みでホワイト相手の再現性を見る",
    },
    {
      id: `${candidateId}_vs_black`,
      participants: { player: candidateId, cpu: "black" },
      seedStart: 1200,
      recommendedGames: 100,
      purpose: "候補がブラックの速攻に対抗できるか確認する",
    },
    {
      id: `black_vs_${candidateId}`,
      participants: { player: "black", cpu: candidateId },
      seedStart: 1300,
      recommendedGames: 100,
      purpose: "座席差込みでブラック相手の再現性を見る",
    },
    {
      id: `${candidateId}_mirror`,
      participants: { player: candidateId, cpu: candidateId },
      seedStart: 1400,
      recommendedGames: 50,
      purpose: "同型でロックや長期戦が起きないか確認する",
    },
  ];
}

export function runMasterLabFinalGate(options: MasterLabFinalGateOptions = {}): MasterLabFinalGateResult {
  const candidateId = options.candidateId ?? DEFAULT_CANDIDATE_ID;
  const runs = buildMasterLabFinalGateMatchups(candidateId).map((matchup): MasterLabFinalGateRun => {
    const count = options.gamesPerMatchup ?? matchup.recommendedGames;
    const result = validateMasterLabAutoPlay({
      ...options,
      participants: matchup.participants,
      seedStart: matchup.seedStart,
      count,
    });
    return { matchup: { ...matchup, recommendedGames: count }, result };
  });

  const failures = runs.reduce((total, run) => total + run.result.summary.failures, 0);
  const warnings = runs.reduce((total, run) => total + run.result.summary.warnings, 0);
  const labDecisionCount = runs.reduce((total, run) => total + run.result.summary.labDecisionCount, 0);
  const games = runs.reduce((total, run) => total + run.result.summary.games, 0);
  const ok = runs.every((run) => run.result.ok);
  const issueSeeds = uniqueSorted(runs.flatMap((run) => run.result.issues.map((issue) => issue.seed)));
  const labActionUsage = mergeUsage(runs.map((run) => run.result.summary.labActionUsage));
  const labActionTargetUsage = mergeUsage(runs.map((run) => run.result.summary.labActionTargetUsage));
  const magicCardUsage = mergeUsage(runs.map((run) => run.result.summary.magicCardUsage));
  const notes = buildJudgementNotes(runs, labDecisionCount);

  return {
    ok,
    candidateId,
    runs,
    summary: {
      games,
      failures,
      warnings,
      labDecisionCount,
      labActionUsage,
      labActionTargetUsage,
      magicCardUsage,
      issueSeeds,
    },
    adoptionJudgement: ok && failures === 0 && labDecisionCount > 0 ? "ready_for_review" : "needs_iteration",
    notes,
  };
}

export function formatMasterLabFinalGateMarkdown(result: MasterLabFinalGateResult): string {
  const lines = [
    `# Master Lab Final Gate: ${result.candidateId}`,
    "",
    `判定: ${result.adoptionJudgement}`,
    `総合: ${result.ok ? "PASS" : "FAIL"}`,
    `試合数: ${result.summary.games}`,
    `Issues: ${result.summary.failures} failures, ${result.summary.warnings} warnings`,
    `Master Lab decisions: ${result.summary.labDecisionCount}`,
    `Master Lab action usage: ${formatUsage(result.summary.labActionUsage)}`,
    `Master Lab target usage: ${formatUsage(result.summary.labActionTargetUsage)}`,
    `Magic card usage: ${formatUsage(result.summary.magicCardUsage)}`,
    "",
    "## Runs",
    "",
  ];

  for (const run of result.runs) {
    lines.push(`### ${run.matchup.id}`);
    lines.push("");
    lines.push(`目的: ${run.matchup.purpose}`);
    lines.push("");
    lines.push("```text");
    lines.push(formatMasterLabAutoPlaySummary(run.result));
    lines.push("```");
    lines.push("");
  }

  lines.push("## Notes");
  lines.push("");
  for (const note of result.notes) {
    lines.push(`- ${note}`);
  }
  if (result.summary.issueSeeds.length > 0) {
    lines.push(`- issue seeds: ${result.summary.issueSeeds.join(", ")}`);
  }

  return lines.join("\n");
}

function buildJudgementNotes(runs: MasterLabFinalGateRun[], labDecisionCount: number): string[] {
  const notes: string[] = [];
  if (runs.some((run) => !run.result.ok)) {
    notes.push("failure または warning 扱いの問題があるため、先に該当seedを確認する。");
  }
  if (labDecisionCount === 0) {
    notes.push("Master Lab特技が一度も選ばれていないため、AI評価またはコストを調整する。");
  }
  if (notes.length === 0) {
    notes.push("本線移植レビューに進める最低限の自動対戦条件を満たした。");
  }
  notes.push("本採用前に、バーサク詰め、挑発ロック、スケープゴート連打のシナリオテストを別途確認する。");
  return notes;
}

function mergeUsage(usages: Array<Record<string, number>>): Record<string, number> {
  const merged: Record<string, number> = {};
  for (const usage of usages) {
    for (const [actionId, count] of Object.entries(usage)) {
      merged[actionId] = (merged[actionId] ?? 0) + count;
    }
  }
  return merged;
}

function uniqueSorted(values: number[]): number[] {
  return [...new Set(values)].sort((a, b) => a - b);
}

function formatUsage(usage: Record<string, number>): string {
  const entries = Object.entries(usage).sort(([a], [b]) => a.localeCompare(b));
  return entries.length > 0 ? entries.map(([actionId, count]) => `${actionId} ${count}`).join(", ") : "none";
}
