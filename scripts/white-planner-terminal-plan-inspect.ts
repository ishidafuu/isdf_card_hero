import { writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { mkdir } from "node:fs/promises";
import {
  inspectCpuTerminalPlan,
  type CpuAiOptions,
  type CpuDecision,
  type CpuTerminalPlanInspection,
} from "../src/game/cpuAi";
import { getCardName } from "../src/game/cards";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, type DeckPresetId } from "../src/game/deckPresets";
import { createInitialGame, runAutoStep, targetToKey } from "../src/game/rules";
import type { GameState, PlayerId, SlotKey } from "../src/game/types";
import { escapeMarkdownTableCell, readInteger, readString, round } from "./lib/cli";

type Direction = "challenger-as-cpu" | "challenger-as-player";

interface CliOptions {
  seed: number;
  direction: Direction;
  deckPreset: DeckPresetId;
  step: number;
  markdownPath?: string;
  jsonPath?: string;
}

interface CandidateRow {
  rank: number;
  selected: boolean;
  decision: string;
  rootScore: number;
  plannerScore: number;
  rolloutScore?: number;
  rolloutGap?: number;
  rolloutSteps?: number;
  rolloutWinner?: PlayerId;
}

interface InspectReport {
  generatedAt: string;
  options: CliOptions;
  state: string;
  board: string;
  fallback?: string;
  fallbackScore?: number;
  selected?: string;
  selectedPlannerScore?: number;
  runnerUpPlannerScore?: number;
  selectedRolloutScore?: number;
  selectedRolloutScoreGapToFallback?: number;
  adopted: boolean;
  rejectedReason?: string;
  candidates: CandidateRow[];
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

const options = parseArgs(process.argv.slice(2));
const state = replayToStep(options);
const aiOptions = aiOptionsFor(options.direction);
const inspection = inspectCpuTerminalPlan(state, aiOptions);
const report = buildReport(options, state, inspection);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, `${JSON.stringify(report, null, 2)}\n`);
}

console.log(`White planner terminal plan inspect: ${report.candidates.length} candidates`);
console.log(`selected: ${report.selected ?? "-"}, adopted ${report.adopted}`);
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function buildReport(
  options: CliOptions,
  state: GameState,
  inspection: CpuTerminalPlanInspection,
): InspectReport {
  const selectedKey = inspection.selectedDecision ? decisionKey(inspection.selectedDecision) : undefined;
  const candidates = inspection.candidates
    .map((candidate) => ({
      selected: selectedKey !== undefined && decisionKey(candidate.decision) === selectedKey,
      decision: decisionLabel(state, candidate.decision),
      rootScore: round(candidate.rootScore, 1),
      plannerScore: round(candidate.plannerScore, 1),
      ...(candidate.rolloutScore !== undefined ? { rolloutScore: round(candidate.rolloutScore, 1) } : {}),
      ...(candidate.rolloutScoreGapToFallback !== undefined
        ? { rolloutGap: round(candidate.rolloutScoreGapToFallback, 1) }
        : {}),
      ...(candidate.rolloutSteps !== undefined ? { rolloutSteps: candidate.rolloutSteps } : {}),
      ...(candidate.rolloutWinner ? { rolloutWinner: candidate.rolloutWinner } : {}),
    }))
    .sort((a, b) => b.plannerScore - a.plannerScore || b.rootScore - a.rootScore)
    .map((candidate, index) => ({ rank: index + 1, ...candidate }));

  return {
    generatedAt: new Date().toISOString(),
    options,
    state: stateLine(state),
    board: boardLine(state),
    ...(inspection.fallbackDecision ? { fallback: decisionLabel(state, inspection.fallbackDecision) } : {}),
    ...(inspection.fallbackScore !== undefined ? { fallbackScore: round(inspection.fallbackScore, 1) } : {}),
    ...(inspection.selectedDecision ? { selected: decisionLabel(state, inspection.selectedDecision) } : {}),
    ...(inspection.selectedPlannerScore !== undefined
      ? { selectedPlannerScore: round(inspection.selectedPlannerScore, 1) }
      : {}),
    ...(inspection.runnerUpPlannerScore !== undefined
      ? { runnerUpPlannerScore: round(inspection.runnerUpPlannerScore, 1) }
      : {}),
    ...(inspection.selectedRolloutScore !== undefined
      ? { selectedRolloutScore: round(inspection.selectedRolloutScore, 1) }
      : {}),
    ...(inspection.selectedRolloutScoreGapToFallback !== undefined
      ? { selectedRolloutScoreGapToFallback: round(inspection.selectedRolloutScoreGapToFallback, 1) }
      : {}),
    adopted: inspection.adopted,
    ...(inspection.rejectedReason ? { rejectedReason: inspection.rejectedReason } : {}),
    candidates,
  };
}

function replayToStep(options: CliOptions): GameState {
  let state = createWhiteMirrorGame(options.seed, options.deckPreset);
  const aiOptions = aiOptionsFor(options.direction);
  for (let step = 0; step < options.step && !state.winner; step += 1) {
    state = runAutoStep(state, aiOptions);
  }
  return state;
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

function aiOptionsFor(direction: Direction): CpuAiOptions {
  return {
    profiles: direction === "challenger-as-cpu"
      ? { player: "white", cpu: "white_planner" }
      : { player: "white_planner", cpu: "white" },
  };
}

function formatMarkdown(report: InspectReport): string {
  const lines = [
    "# White Planner Terminal Plan Inspect",
    "",
    `生成: ${report.generatedAt}`,
    `seed: ${report.options.seed}`,
    `direction: ${report.options.direction}`,
    `step: ${report.options.step}`,
    `deck: \`${report.options.deckPreset}\``,
    "",
    "## State",
    "",
    `- state: ${report.state}`,
    `- board: ${report.board}`,
    `- fallback: ${report.fallback ?? "-"}`,
    `- selected: ${report.selected ?? "-"}`,
    `- adopted: ${report.adopted}`,
    report.rejectedReason ? `- rejected: ${report.rejectedReason}` : "",
    "",
    "## Candidates",
    "",
    "| rank | selected | decision | root | planner | rollout | gap | steps | winner |",
    "| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |",
  ].filter(Boolean);

  for (const candidate of report.candidates) {
    lines.push(
      `| ${candidate.rank} | ${candidate.selected ? "Y" : ""} | ${escapeMarkdownTableCell(candidate.decision)} | ` +
        `${candidate.rootScore} | ${candidate.plannerScore} | ${candidate.rolloutScore ?? ""} | ` +
        `${candidate.rolloutGap ?? ""} | ${candidate.rolloutSteps ?? ""} | ${candidate.rolloutWinner ?? ""} |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

function stateLine(state: GameState): string {
  return [
    `turn ${state.turnNumber}`,
    `current ${state.currentPlayer}`,
    `HP player/cpu ${state.players.player.masterHp}/${state.players.cpu.masterHp}`,
    `stones player/cpu ${state.players.player.stones}/${state.players.cpu.stones}`,
    `deck player/cpu ${state.players.player.deck.length}/${state.players.cpu.deck.length}`,
    `hand player/cpu ${state.players.player.hand.length}/${state.players.cpu.hand.length}`,
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

function decisionKey(decision: CpuDecision): string {
  return JSON.stringify(decision);
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    seed: 994320,
    direction: "challenger-as-player",
    deckPreset: "master-lab-white-1377-death-sheep3",
    step: 101,
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--seed") {
      parsed.seed = readInteger(arg, next);
      index += 1;
    } else if (arg === "--direction") {
      parsed.direction = readString(arg, next) as Direction;
      index += 1;
    } else if (arg === "--deck-preset") {
      parsed.deckPreset = readString(arg, next) as DeckPresetId;
      index += 1;
    } else if (arg === "--step") {
      parsed.step = readInteger(arg, next);
      index += 1;
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      index += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
      index += 1;
    }
  }
  return parsed;
}

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}
