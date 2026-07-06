import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { performance } from "node:perf_hooks";
import {
  applyCpuDecision,
  chooseCpuDecision,
  evaluateState,
  inspectCpuDecisionEvaluations,
  inspectCpuTerminalPlan,
  listCpuDecisions,
  type CpuAiOptions,
  type CpuAiProfile,
  type CpuDecision,
} from "../src/game/cpuAi";
import { AI_EVALUATION_WEIGHTS } from "../src/game/aiWeights";
import { getCardName } from "../src/game/cards";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, type DeckPresetId } from "../src/game/deckPresets";
import type { CpuAiSearchOptions } from "../src/game/cpuAiTypes";
import { createInitialGame, opponentOf, runAutoStep, targetToKey } from "../src/game/rules";
import type { GameState, PlayerId, SlotKey } from "../src/game/types";
import { readInteger, readString, round } from "./lib/cli";

type Direction = "challenger-as-cpu" | "challenger-as-player";

interface CliOptions {
  seed: number;
  direction: Direction;
  deckPreset: DeckPresetId;
  maxSteps: number;
  maxTurns: number;
  search: CpuAiSearchOptions;
  streamDecisions: boolean;
  dumpEvaluationsOnSlow: boolean;
  profileStep?: number;
  stopAfterSlowMs?: number;
  markdownPath?: string;
  jsonPath?: string;
}

interface DecisionTraceEntry {
  step: number;
  turnNumber: number;
  side: PlayerId;
  elapsedMs: number;
  decision: string;
  reason: string;
  score: number;
  state: string;
  board: string;
  afterState: string;
  afterBoard: string;
}

interface DecisionTraceReport {
  generatedAt: string;
  options: CliOptions;
  profiles: Record<PlayerId, CpuAiProfile>;
  plannerSide: PlayerId;
  winner?: PlayerId;
  winnerProfile?: CpuAiProfile;
  steps: number;
  turns: number;
  finalState: string;
  finalBoard: string;
  decisions: DecisionTraceEntry[];
  conclusion: string[];
}

const SLOT_ORDER: SlotKey[] = [
  "player_front_left",
  "player_front_right",
  "player_back_left",
  "player_back_right",
  "cpu_front_left",
  "cpu_front_right",
  "cpu_back_left",
  "cpu_back_right",
];

const DEFAULT_OPTIONS: CliOptions = {
  seed: 994311,
  direction: "challenger-as-player",
  deckPreset: "master-lab-white-1377-death-sheep3",
  maxSteps: 420,
  maxTurns: 90,
  search: {},
  streamDecisions: false,
  dumpEvaluationsOnSlow: false,
};

const options = parseArgs(process.argv.slice(2));
const report = runTrace(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, `${JSON.stringify(report, null, 2)}\n`);
}

console.log(
  `White planner decision trace: ${report.decisions.length} decisions, ` +
    `winner ${report.winnerProfile ?? report.winner ?? "-"}, ${report.steps} steps / ${report.turns} turns`,
);
console.log(`max decision ${round(Math.max(0, ...report.decisions.map((entry) => entry.elapsedMs)), 1)}ms`);
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runTrace(options: CliOptions): DecisionTraceReport {
  let state = createWhiteMirrorGame(options.seed, options.deckPreset);
  const profiles = profilesForDirection(options.direction);
  const plannerSide = plannerSideForDirection(options.direction);
  const aiOptions: CpuAiOptions = {
    profiles,
    ...(Object.keys(options.search).length > 0 ? { searches: { [plannerSide]: options.search } } : {}),
  };
  const decisions: DecisionTraceEntry[] = [];
  let steps = 0;

  for (; steps < options.maxSteps && !state.winner; steps += 1) {
    if (state.turnNumber > options.maxTurns) {
      break;
    }
    if (state.pendingLevelUp || state.currentPlayer !== plannerSide) {
      state = runAutoStep(state, aiOptions);
      continue;
    }

    const before = state;
    if (options.profileStep === steps) {
      const listStartedAt = performance.now();
      const listed = listCpuDecisions(before, AI_EVALUATION_WEIGHTS.white);
      const listElapsedMs = performance.now() - listStartedAt;
      console.log(`[profile] step ${steps} listCpuDecisions ${round(listElapsedMs, 1)}ms count ${listed.length}`);

      const whiteEvalStartedAt = performance.now();
      const whiteEvaluations = inspectCpuDecisionEvaluations(before, { profile: "white" });
      const whiteEvalElapsedMs = performance.now() - whiteEvalStartedAt;
      console.log(`[profile] step ${steps} inspect white ${round(whiteEvalElapsedMs, 1)}ms count ${whiteEvaluations.length}`);
      whiteEvaluations
        .sort((a, b) =>
          b.totalScore - a.totalScore || compareDecisionTraceTieBreak(a.decision, b.decision, a.index, b.index),
        )
        .slice(0, 8)
        .forEach((evaluation, rank) => {
          console.log(
            `[profile white evaluation ${rank + 1}] ${round(evaluation.totalScore, 1)} ` +
              `${decisionLabel(before, evaluation.decision)}`,
          );
        });

      const plannerEvalStartedAt = performance.now();
      const plannerEvaluations = inspectCpuDecisionEvaluations(before, { profile: "white_planner" });
      const plannerEvalElapsedMs = performance.now() - plannerEvalStartedAt;
      console.log(`[profile] step ${steps} inspect white_planner ${round(plannerEvalElapsedMs, 1)}ms count ${plannerEvaluations.length}`);
      plannerEvaluations
        .sort((a, b) =>
          b.totalScore - a.totalScore || compareDecisionTraceTieBreak(a.decision, b.decision, a.index, b.index),
        )
        .slice(0, 12)
        .forEach((evaluation, rank) => {
          console.log(
            `[profile evaluation ${rank + 1}] ${round(evaluation.totalScore, 1)} ` +
              `${decisionLabel(before, evaluation.decision)}`,
          );
        });
      const terminalPlan = inspectCpuTerminalPlan(before, { profile: "white_planner" });
      console.log(
        `[profile terminal] enabled=${terminalPlan.enabled} adopted=${terminalPlan.adopted} ` +
          `selected=${terminalPlan.selectedDecision ? decisionLabel(before, terminalPlan.selectedDecision) : "-"} ` +
          `fallback=${terminalPlan.fallbackDecision ? decisionLabel(before, terminalPlan.fallbackDecision) : "-"} ` +
          `reason=${terminalPlan.rejectedReason ?? "-"}`,
      );
      terminalPlan.candidates
        .sort((a, b) => b.plannerScore - a.plannerScore || b.rootScore - a.rootScore)
        .slice(0, 8)
        .forEach((candidate, rank) => {
          console.log(
            `[profile terminal ${rank + 1}] root=${round(candidate.rootScore, 1)} ` +
              `planner=${round(candidate.plannerScore, 1)} ` +
              `response=${round(candidate.responseScore, 1)} ` +
              `${decisionLabel(before, candidate.decision)}`,
          );
        });
    }
    const startedAt = performance.now();
    const decision = chooseCpuDecision(before, aiOptions);
    const elapsedMs = performance.now() - startedAt;
    const after = applyCpuDecision(before, decision);
    const entry: DecisionTraceEntry = {
      step: steps,
      turnNumber: before.turnNumber,
      side: before.currentPlayer,
      elapsedMs: round(elapsedMs, 1),
      decision: decisionLabel(before, decision),
      reason: decision.reason,
      score: round(decision.score, 1),
      state: stateLine(before, plannerSide),
      board: boardLine(before),
      afterState: stateLine(after, plannerSide),
      afterBoard: boardLine(after),
    };
    decisions.push(entry);
    if (options.streamDecisions) {
      console.log(
        `[decision] step ${entry.step} turn ${entry.turnNumber} ${entry.elapsedMs}ms ` +
          `${entry.decision} / ${entry.reason}`,
      );
    }
    if (
      options.dumpEvaluationsOnSlow &&
      options.stopAfterSlowMs !== undefined &&
      elapsedMs >= options.stopAfterSlowMs
    ) {
      const evaluations = inspectCpuDecisionEvaluations(before, { profile: "white" })
        .sort((a, b) =>
          b.totalScore - a.totalScore || compareDecisionTraceTieBreak(a.decision, b.decision, a.index, b.index),
        )
        .slice(0, 12);
      evaluations.forEach((evaluation, index) => {
        console.log(
          `[evaluation ${index + 1}] ${round(evaluation.totalScore, 1)} ` +
            `${decisionLabel(before, evaluation.decision)}`,
        );
      });
    }
    state = after;
    if (options.stopAfterSlowMs !== undefined && elapsedMs >= options.stopAfterSlowMs) {
      break;
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    options,
    profiles,
    plannerSide,
    ...(state.winner ? { winner: state.winner, winnerProfile: profiles[state.winner] } : {}),
    steps,
    turns: state.turnNumber,
    finalState: stateLine(state, plannerSide),
    finalBoard: boardLine(state),
    decisions,
    conclusion: buildConclusion(state, plannerSide, decisions),
  };
}

function createWhiteMirrorGame(seed: number, deckPreset: DeckPresetId): GameState {
  const deck = buildDeckPresetCardIds(deckPreset);
  const allowSpecial = deckPresetAllowsSpecial(deckPreset);
  return createInitialGame(seed, {
    masterIds: { player: "white", cpu: "white" },
    playerDeckCardIds: deck,
    cpuDeckCardIds: deck,
    allowSpecialDecks: { player: allowSpecial, cpu: allowSpecial },
  });
}

function profilesForDirection(direction: Direction): Record<PlayerId, CpuAiProfile> {
  return direction === "challenger-as-cpu"
    ? { player: "white", cpu: "white_planner" }
    : { player: "white_planner", cpu: "white" };
}

function plannerSideForDirection(direction: Direction): PlayerId {
  return direction === "challenger-as-cpu" ? "cpu" : "player";
}

function buildConclusion(
  state: GameState,
  plannerSide: PlayerId,
  decisions: readonly DecisionTraceEntry[],
): string[] {
  const maxDecision = Math.max(0, ...decisions.map((entry) => entry.elapsedMs));
  const slowDecisions = decisions.filter((entry) => entry.elapsedMs >= 5_000);
  const focusCount = decisions.filter((entry) => entry.decision.startsWith("focus:")).length;
  const attackCount = decisions.filter((entry) => entry.decision.startsWith("attack:")).length;
  const score = evaluateState(state, plannerSide, AI_EVALUATION_WEIGHTS.white);
  return [
    `winner: ${state.winner ?? "none"}, final score ${round(score, 1)}.`,
    `planner decisions ${decisions.length}, attacks ${attackCount}, focus ${focusCount}, max decision ${round(maxDecision, 1)}ms.`,
    `slow decisions >=5000ms: ${slowDecisions.length}.`,
    "Use this trace to pick exact turn/step targets before running expensive branch replay.",
  ];
}

function formatMarkdown(report: DecisionTraceReport): string {
  const lines = [
    "# White Planner Decision Trace",
    "",
    `生成: ${report.generatedAt}`,
    `deck: \`${report.options.deckPreset}\``,
    `seed: ${report.options.seed}`,
    `direction: ${report.options.direction}`,
    `search: \`${JSON.stringify(report.options.search)}\``,
    "",
    "## Conclusion",
    "",
  ];
  report.conclusion.forEach((line) => lines.push(`- ${line}`));
  lines.push("", "## Final", "");
  lines.push(`- state: ${report.finalState}`);
  lines.push(`- board: ${report.finalBoard}`);
  lines.push("", "## Decisions", "");
  lines.push("| step | turn | ms | decision | score | state | board | after | reason |");
  lines.push("| ---: | ---: | ---: | --- | ---: | --- | --- | --- | --- |");
  for (const entry of report.decisions) {
    lines.push(
      `| ${entry.step} | ${entry.turnNumber} | ${entry.elapsedMs} | ${escapeCell(entry.decision)} | ` +
        `${entry.score} | ${escapeCell(entry.state)} | ${escapeCell(entry.board)} | ` +
        `${escapeCell(entry.afterState)} | ${escapeCell(entry.reason)} |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

function stateLine(state: GameState, perspective: PlayerId): string {
  const opponent = opponentOf(perspective);
  return [
    `turn ${state.turnNumber}`,
    `current ${state.currentPlayer}`,
    `HP ${perspective}/${opponent} ${state.players[perspective].masterHp}/${state.players[opponent].masterHp}`,
    `stones ${perspective}/${opponent} ${state.players[perspective].stones}/${state.players[opponent].stones}`,
    `deck ${perspective}/${opponent} ${state.players[perspective].deck.length}/${state.players[opponent].deck.length}`,
    `hand ${perspective}/${opponent} ${state.players[perspective].hand.length}/${state.players[opponent].hand.length}`,
  ].join(" / ");
}

function boardLine(state: GameState): string {
  return SLOT_ORDER.map((slotKey) => slotLine(state, slotKey)).filter(Boolean).join(" | ") || "empty";
}

function slotLine(state: GameState, slotKey: SlotKey): string {
  const monster = state.slots[slotKey].monster;
  if (!monster) {
    return "";
  }
  const side = monster.owner === "player" ? "P" : "C";
  const row = state.slots[slotKey].row === "front" ? "F" : "B";
  const status = monster.status === "prepared" ? "prep" : `act${monster.actionCount}/${monster.actionLimit}`;
  const flags = [monster.focused ? "focus" : "", monster.shielded ? "shield" : ""].filter(Boolean);
  return `${slotKey}:${side}${row}:${getCardName(monster.cardId)} Lv${monster.level} HP${monster.hp} ${status}${flags.length > 0 ? ` ${flags.join(",")}` : ""}`;
}

function decisionLabel(state: GameState, decision: CpuDecision): string {
  if (decision.type === "attack") {
    const attacker = monsterNameAt(state, decision.action.attackerSlotKey) ?? decision.action.attackerSlotKey;
    const target = decision.action.target.kind === "monster"
      ? monsterNameAt(state, decision.action.target.slotKey) ?? decision.action.target.slotKey
      : `${decision.action.target.playerId} master`;
    return `attack:${attacker}:${decision.action.commandId}->${target}`;
  }
  if (decision.type === "master_action") {
    return `master:${decision.actionId}->${targetToKey(decision.target)}`;
  }
  if (decision.type === "summon") {
    const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === decision.handInstanceId);
    return `summon:${card ? getCardName(card.cardId) : decision.handInstanceId}->${decision.slotKey}`;
  }
  if (decision.type === "magic") {
    const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === decision.action.handInstanceId);
    return `magic:${card ? getCardName(card.cardId) : decision.action.handInstanceId}->${targetToKey(decision.action.target)}`;
  }
  if (decision.type === "move") {
    return `move:${decision.fromSlotKey}->${decision.toSlotKey}`;
  }
  if (decision.type === "focus") {
    return `focus:${monsterNameAt(state, decision.slotKey) ?? decision.slotKey}`;
  }
  return "end_turn";
}

function monsterNameAt(state: GameState, slotKey: SlotKey): string | undefined {
  const monster = state.slots[slotKey].monster;
  return monster ? getCardName(monster.cardId) : undefined;
}

function escapeCell(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

function compareDecisionTraceTieBreak(a: CpuDecision, b: CpuDecision, aIndex: number, bIndex: number): number {
  const priority = (decision: CpuDecision): number => {
    if (decision.type === "attack") {
      return 0;
    }
    if (decision.type === "magic") {
      return 1;
    }
    if (decision.type === "master_action") {
      return 2;
    }
    if (decision.type === "summon") {
      return 3;
    }
    if (decision.type === "move") {
      return 4;
    }
    if (decision.type === "focus") {
      return 5;
    }
    return 6;
  };
  return priority(a) - priority(b) || aIndex - bIndex;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = { ...DEFAULT_OPTIONS, search: { ...DEFAULT_OPTIONS.search } };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--seed") {
      parsed.seed = readInteger(arg, next);
      index += 1;
    } else if (arg === "--direction") {
      parsed.direction = readDirection(readString(arg, next));
      index += 1;
    } else if (arg === "--deck-preset") {
      parsed.deckPreset = readString(arg, next) as DeckPresetId;
      index += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readInteger(arg, next);
      index += 1;
    } else if (arg === "--same-turn-search-depth") {
      parsed.search = { ...parsed.search, sameTurnSearchDepth: readInteger(arg, next) };
      index += 1;
    } else if (arg === "--same-turn-search-width") {
      parsed.search = { ...parsed.search, sameTurnSearchWidth: readInteger(arg, next) };
      index += 1;
    } else if (arg === "--same-turn-terminal-plan-weight") {
      parsed.search = { ...parsed.search, sameTurnTerminalPlanWeight: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--same-turn-terminal-plan-depth") {
      parsed.search = { ...parsed.search, sameTurnTerminalPlanDepth: readInteger(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-steps") {
      parsed.search = { ...parsed.search, terminalPlanRolloutSteps: readInteger(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-candidate-limit") {
      parsed.search = { ...parsed.search, terminalPlanRolloutCandidateLimit: readInteger(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-weight") {
      parsed.search = { ...parsed.search, terminalPlanRolloutWeight: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-front-focus-steps") {
      parsed.search = { ...parsed.search, terminalPlanRolloutFrontFocusStripAttackSteps: readInteger(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-late-deck-hold-steps") {
      parsed.search = { ...parsed.search, terminalPlanRolloutLateDeckHoldEndTurnSteps: readInteger(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-shield-target-tie-steps") {
      parsed.search = { ...parsed.search, terminalPlanRolloutShieldTargetTieSteps: readInteger(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-use-handoff") {
      parsed.search = { ...parsed.search, terminalPlanRolloutUseHandoff: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-use-lightweight-profile") {
      parsed.search = { ...parsed.search, terminalPlanRolloutUseLightweightProfile: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--stream-decisions") {
      parsed.streamDecisions = true;
    } else if (arg === "--dump-evaluations-on-slow") {
      parsed.dumpEvaluationsOnSlow = true;
    } else if (arg === "--profile-step") {
      parsed.profileStep = readInteger(arg, next);
      index += 1;
    } else if (arg === "--stop-after-slow-ms") {
      parsed.stopAfterSlowMs = readInteger(arg, next);
      index += 1;
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      index += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelpAndExit();
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return parsed;
}

function readDirection(value: string): Direction {
  if (value === "challenger-as-cpu" || value === "challenger-as-player") {
    return value;
  }
  throw new Error("--direction must be one of: challenger-as-cpu, challenger-as-player");
}

function readNumber(name: string, value: string | undefined): number {
  const number = Number(readString(name, value));
  if (!Number.isFinite(number)) {
    throw new Error(`${name} must be a number`);
  }
  return number;
}

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

function printHelpAndExit(): never {
  console.log(`Usage:
  npm run audit:white-planner-decision-trace -- [options]

Options:
  --seed <n>             Seed. Default: ${DEFAULT_OPTIONS.seed}
  --direction <value>    challenger-as-cpu or challenger-as-player. Default: ${DEFAULT_OPTIONS.direction}
  --deck-preset <id>     Deck preset. Default: ${DEFAULT_OPTIONS.deckPreset}
  --max-steps <n>        Step cap. Default: ${DEFAULT_OPTIONS.maxSteps}
  --max-turns <n>        Turn cap. Default: ${DEFAULT_OPTIONS.maxTurns}
  --same-turn-search-depth <n>
  --same-turn-search-width <n>
  --same-turn-terminal-plan-weight <n>
  --same-turn-terminal-plan-depth <n>
  --planner-rollout-steps <n>
  --planner-rollout-candidate-limit <n>
  --planner-rollout-weight <n>
  --planner-rollout-front-focus-steps <n>
  --planner-rollout-late-deck-hold-steps <n>
  --planner-rollout-shield-target-tie-steps <n>
  --planner-rollout-use-handoff <0|1>
  --planner-rollout-use-lightweight-profile <0|1>
  --stream-decisions       Print each planner decision while tracing.
  --dump-evaluations-on-slow Print fallback white root evaluations when stopping on a slow decision.
  --profile-step <n>    Print list/evaluation timing before choosing at this auto step.
  --stop-after-slow-ms <n> Stop after the first planner decision at or above this elapsed time.
  --markdown <path>      Write Markdown report.
  --json <path>          Write JSON report.
`);
  process.exit(0);
}
