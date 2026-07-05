import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { performance } from "node:perf_hooks";
import {
  applyCpuDecision,
  chooseCpuDecision,
  evaluateState,
  type CpuAiOptions,
  type CpuAiProfile,
  type CpuDecision,
} from "../src/game/cpuAi";
import { AI_EVALUATION_WEIGHTS } from "../src/game/aiWeights";
import { getCardName } from "../src/game/cards";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, type DeckPresetId } from "../src/game/deckPresets";
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
  const aiOptions: CpuAiOptions = { profiles };
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
    const startedAt = performance.now();
    const decision = chooseCpuDecision(before, aiOptions);
    const elapsedMs = performance.now() - startedAt;
    const after = applyCpuDecision(before, decision);
    decisions.push({
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
    });
    state = after;
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

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = { ...DEFAULT_OPTIONS };
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
  --markdown <path>      Write Markdown report.
  --json <path>          Write JSON report.
`);
  process.exit(0);
}
