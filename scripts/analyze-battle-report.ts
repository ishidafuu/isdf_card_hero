import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, resolve } from "node:path";
import {
  chooseCpuDecision,
  inspectCpuDecisionEvaluations,
  type CpuAiProfile,
  type CpuDecision,
} from "../src/game/cpuAi";
import { clearTurnPlannerV2Cache } from "../src/game/cpuAiV2/turnPlanner";
import { restoreAiDecisionStateSnapshot } from "../src/game/aiReviewTrace";
import {
  assertBattleReportForReview,
  matchReviewCommentsToDecisions,
} from "./lib/battleReportReview";

interface CliOptions {
  reportPath: string;
  outputPath?: string;
  includeGood: boolean;
}

const options = parseArgs(process.argv.slice(2));
const reportValue: unknown = JSON.parse(await readFile(options.reportPath, "utf8"));
assertBattleReportForReview(reportValue);
const matches = matchReviewCommentsToDecisions(
  reportValue,
  options.includeGood ? ["bad", "question", "good"] : ["bad", "question"],
);
const markdown = formatAnalysis(reportValue.reportId, reportValue.generatedAt, matches);
const outputPath = options.outputPath ?? defaultOutputPath(options.reportPath);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${markdown}\n`);
console.log(`Battle report analysis: ${outputPath}`);
console.log(`Matched review comments: ${matches.length}`);

function formatAnalysis(
  reportId: string,
  generatedAt: string | undefined,
  matches: ReturnType<typeof matchReviewCommentsToDecisions>,
): string {
  const lines = [
    "# AI Battle Report Analysis",
    "",
    `- report: \`${reportId}\``,
    `- generated: ${generatedAt ?? "unknown"}`,
    `- matched comments: ${matches.length}`,
    "",
  ];
  if (matches.length === 0) {
    lines.push("BAD / QUESTION コメントに対応するAI判断はありませんでした。");
    return lines.join("\n");
  }

  matches.forEach((match, index) => {
    const state = restoreAiDecisionStateSnapshot(match.decision.stateBefore);
    const legacy = inspectDecision(state, "white_planner");
    clearTurnPlannerV2Cache();
    const v2 = inspectDecision(state, "white_v2");
    lines.push(
      `## ${index + 1}. ${match.comment.stamp?.toUpperCase()} log ${match.comment.logIndex}`,
      "",
      `- comment: ${match.comment.comment}`,
      `- commented entry: ${match.comment.entry}`,
      `- source AI decision: turn ${match.decision.turnNumber} ${match.decision.playerId} \`${match.decision.decisionKey}\``,
      `- original reason: ${match.decision.decision.reason}`,
      "",
      "### Legacy White Planner",
      "",
      ...formatInspection(legacy),
      "",
      "### White V2",
      "",
      ...formatInspection(v2),
      "",
    );
  });
  return lines.join("\n");
}

function inspectDecision(state: ReturnType<typeof restoreAiDecisionStateSnapshot>, profile: CpuAiProfile) {
  const decision = chooseCpuDecision(state, { profile });
  const alternatives = inspectCpuDecisionEvaluations(state, { profile })
    .sort((a, b) => b.totalScore - a.totalScore || a.index - b.index)
    .slice(0, 5)
    .map((candidate) => ({
      key: decisionKey(candidate.decision),
      score: Math.round(candidate.totalScore),
      reason: candidate.decision.reason,
    }));
  return { decision, alternatives };
}

function formatInspection(inspection: ReturnType<typeof inspectDecision>): string[] {
  const plan = inspection.decision.trace?.turnPlan;
  const lines = [
    `- selected: \`${decisionKey(inspection.decision)}\``,
    `- reason: ${inspection.decision.reason}`,
  ];
  if (plan) {
    lines.push(
      `- plan score: own ${Math.round(plan.ownHandoffScore)} / response ${Math.round(plan.responseScore)}`,
      `- opponent model: ${plan.opponentKnowledge ?? "exact state"} / ${plan.opponentSampleCount ?? 1} samples / worst ${Math.round(plan.opponentWorstResponseScore ?? plan.responseScore)}`,
      `- own line: ${plan.actions.map((action) => `\`${action}\``).join(" -> ")}`,
      `- opponent worst line: ${plan.opponentActions.length > 0 ? plan.opponentActions.map((action) => `\`${action}\``).join(" -> ") : "none"}`,
      `- coverage: ${plan.generatedPlanCount} own plans / ${plan.comparedRootCount} roots / ${plan.opponentPlanCount} opponent plans`,
    );
  }
  lines.push("- immediate alternatives:");
  inspection.alternatives.forEach((candidate) => {
    lines.push(`  - ${candidate.score}: \`${candidate.key}\` - ${candidate.reason}`);
  });
  return lines;
}

function decisionKey(decision: CpuDecision): string {
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

function parseArgs(args: string[]): CliOptions {
  let reportPath = "";
  let outputPath: string | undefined;
  let includeGood = false;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--report") {
      reportPath = resolve(readValue(arg, next));
      index += 1;
    } else if (arg === "--output") {
      outputPath = resolve(readValue(arg, next));
      index += 1;
    } else if (arg === "--include-good") {
      includeGood = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  if (!reportPath) {
    throw new Error("--report is required");
  }
  return { reportPath, outputPath, includeGood };
}

function defaultOutputPath(reportPath: string): string {
  const name = basename(reportPath, extname(reportPath));
  return resolve("docs/ai_playtest_reports/analysis", `${name}.md`);
}

function readValue(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function printHelp(): void {
  console.log(`Usage:
  npm run analyze:battle-report -- --report <json> [--output <md>] [--include-good]
`);
}
