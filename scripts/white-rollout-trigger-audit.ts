import { performance } from "node:perf_hooks";
import {
  applyCpuDecision,
  chooseCpuDecision,
  CPU_AI_PROFILES,
  inspectCpuTerminalPlan,
  type CpuAiProfile,
  type CpuAiProfiles,
  type CpuDecision,
} from "../src/game/cpuAi";
import { getCardName, getMonsterDef } from "../src/game/cards";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, type DeckPresetId } from "../src/game/deckPresets";
import { createInitialGame, runAutoStep, targetToKey } from "../src/game/rules";
import type { CommandDef, GameState, Lane, PlayerId, Row, SlotKey } from "../src/game/types";
import { average, escapeMarkdownTableCell, readInteger, readString, round, writeReport } from "./lib/cli";

type Direction = "challenger-as-cpu" | "challenger-as-player";

interface CliOptions {
  seedStart: number;
  count: number;
  directions: Direction[];
  deckPreset: DeckPresetId;
  maxSteps: number;
  maxTurns: number;
  baselineProfile: CpuAiProfile;
  challengerProfile: CpuAiProfile;
  inspectThresholdMs: number;
  candidateLimit: number;
  streamProgress: boolean;
  markdownPath?: string;
  jsonPath?: string;
}

interface DecisionStats {
  decisions: number;
  elapsedMs: number;
  maxDecisionMs: number;
}

interface RolloutTriggerCandidate {
  rank: number;
  selectedByCpu: boolean;
  selectedByPlanner: boolean;
  fallback: boolean;
  decision: string;
  features: string;
  rootScore: number;
  plannerScore: number;
  responseScore: number;
  ownDelta: number;
  opponentDelta: number;
  rolloutScore?: number;
  rolloutScoreGapToFallback?: number;
  rolloutSteps?: number;
  rolloutWinner?: PlayerId;
  rolloutWinnerProfile?: CpuAiProfile;
}

interface RolloutTriggerEvent {
  seed: number;
  direction: Direction;
  step: number;
  turnNumber: number;
  side: PlayerId;
  elapsedMs: number;
  inspectionElapsedMs: number;
  rolloutTriggered: boolean;
  adopted: boolean;
  decision: string;
  fallbackDecision: string;
  selectedDecision: string;
  fallbackScore?: number;
  selectedPlannerScore?: number;
  runnerUpPlannerScore?: number;
  selectedRolloutScore?: number;
  selectedRolloutScoreGapToFallback?: number;
  rootScoreGapToFallback?: number;
  plannerMarginToFallback?: number;
  state: string;
  board: string;
  candidates: RolloutTriggerCandidate[];
}

interface RolloutTriggerGame {
  seed: number;
  direction: Direction;
  profiles: CpuAiProfiles;
  winner?: PlayerId;
  winnerProfile?: CpuAiProfile;
  steps: number;
  turns: number;
  playerHp: number;
  cpuHp: number;
  issue?: string;
  challengerStats: DecisionStats;
  events: RolloutTriggerEvent[];
}

interface RolloutTriggerReport {
  generatedAt: string;
  options: CliOptions;
  games: RolloutTriggerGame[];
  events: RolloutTriggerEvent[];
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
  seedStart: 994306,
  count: 1,
  directions: ["challenger-as-player"],
  deckPreset: "master-lab-white-1377-death-sheep3",
  maxSteps: 360,
  maxTurns: 90,
  baselineProfile: "white",
  challengerProfile: "white_rollout",
  inspectThresholdMs: 3000,
  candidateLimit: 4,
  streamProgress: false,
};

const options = parseArgs(process.argv.slice(2));
const report = runReport(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, `${JSON.stringify(report, null, 2)}\n`);
}

console.log(
  `White rollout trigger audit: ${report.games.length} games, ${report.events.length} inspected decisions, ` +
    `${report.events.filter((event) => event.rolloutTriggered).length} rollout-triggered decisions`,
);
for (const game of report.games) {
  console.log(
    `[game] seed ${game.seed} ${game.direction}: ${game.winnerProfile ?? "draw"}/${game.winner ?? "-"}, ` +
      `${game.steps} steps / ${game.turns} turns, events ${game.events.length}, ` +
      `max ${round(game.challengerStats.maxDecisionMs, 1)}ms`,
  );
}
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runReport(options: CliOptions): RolloutTriggerReport {
  const games: RolloutTriggerGame[] = [];
  for (const direction of options.directions) {
    for (let index = 0; index < options.count; index += 1) {
      const game = runGame(options.seedStart + index, direction, options);
      games.push(game);
      if (options.streamProgress) {
        console.log(
          `[game ${games.length}] seed ${game.seed} ${direction}: ${game.winnerProfile ?? "draw"}, ` +
            `${game.steps} steps / ${game.turns} turns, events ${game.events.length}`,
        );
      }
    }
  }
  const events = games.flatMap((game) => game.events);
  return {
    generatedAt: new Date().toISOString(),
    options,
    games,
    events,
    conclusion: buildConclusion(games, events),
  };
}

function runGame(seed: number, direction: Direction, options: CliOptions): RolloutTriggerGame {
  let game = createWhiteMirrorGame(seed, options.deckPreset);
  const profiles = profilesForDirection(direction, options.baselineProfile, options.challengerProfile);
  const challenger = challengerPlayer(direction);
  const aiOptions = { profiles };
  const challengerStats: DecisionStats = { decisions: 0, elapsedMs: 0, maxDecisionMs: 0 };
  const events: RolloutTriggerEvent[] = [];
  let issue: string | undefined;
  let steps = 0;

  for (; steps < options.maxSteps && !game.winner; steps += 1) {
    if (game.turnNumber > options.maxTurns) {
      issue = `turn ${game.turnNumber} exceeded limit ${options.maxTurns}`;
      break;
    }
    if (game.pendingLevelUp) {
      game = runAutoStep(game, aiOptions);
      continue;
    }

    const side = game.currentPlayer;
    const startedAt = performance.now();
    const decision = chooseCpuDecision(game, aiOptions);
    const elapsedMs = performance.now() - startedAt;

    if (side === challenger) {
      addDecisionStats(challengerStats, elapsedMs);
      if (shouldInspectDecision(decision, elapsedMs, options)) {
        const inspectionStartedAt = performance.now();
        const inspection = inspectCpuTerminalPlan(game, aiOptions);
        const inspectionElapsedMs = performance.now() - inspectionStartedAt;
        events.push(buildEvent(seed, direction, steps, game, decision, elapsedMs, inspectionElapsedMs, inspection, options));
      }
    }

    game = applyCpuDecision(game, decision);
  }

  if (!game.winner && !issue) {
    issue = `winner was not decided within ${options.maxSteps} auto steps`;
  }

  return {
    seed,
    direction,
    profiles,
    winner: game.winner,
    ...(game.winner ? { winnerProfile: profiles[game.winner] } : {}),
    steps,
    turns: game.turnNumber,
    playerHp: game.players.player.masterHp,
    cpuHp: game.players.cpu.masterHp,
    ...(issue ? { issue } : {}),
    challengerStats,
    events,
  };
}

function shouldInspectDecision(decision: CpuDecision, elapsedMs: number, options: CliOptions): boolean {
  return elapsedMs >= options.inspectThresholdMs || decision.reason.includes("rollout");
}

function buildEvent(
  seed: number,
  direction: Direction,
  step: number,
  state: GameState,
  decision: CpuDecision,
  elapsedMs: number,
  inspectionElapsedMs: number,
  inspection: ReturnType<typeof inspectCpuTerminalPlan>,
  options: CliOptions,
): RolloutTriggerEvent {
  const cpuKey = decisionKey(decision);
  const fallbackKey = inspection.fallbackDecision ? decisionKey(inspection.fallbackDecision) : "";
  const selectedKey = inspection.selectedDecision ? decisionKey(inspection.selectedDecision) : "";
  const ranked = [...inspection.candidates].sort((a, b) =>
    b.plannerScore - a.plannerScore ||
    b.rootScore - a.rootScore ||
    a.index - b.index,
  );
  const selectedCandidate = ranked.find((candidate) => decisionKey(candidate.decision) === selectedKey);
  const fallbackCandidate = ranked.find((candidate) => decisionKey(candidate.decision) === fallbackKey);
  const candidates = (options.candidateLimit > 0 ? ranked.slice(0, options.candidateLimit) : ranked).map(
    (candidate, index): RolloutTriggerCandidate => {
      const key = decisionKey(candidate.decision);
      return {
        rank: index + 1,
        selectedByCpu: key === cpuKey,
        selectedByPlanner: key === selectedKey,
        fallback: key === fallbackKey,
        decision: decisionLabel(state, candidate.decision),
        features: candidateFeatureSummary(state, candidate.decision, candidate.afterRootState, inspection.fallbackDecision),
        rootScore: round(candidate.rootScore, 1),
        plannerScore: round(candidate.plannerScore, 1),
        responseScore: round(candidate.responseScore, 1),
        ownDelta: round(candidate.ownDelta, 1),
        opponentDelta: round(candidate.opponentDelta, 1),
        ...(candidate.rolloutScore !== undefined ? { rolloutScore: round(candidate.rolloutScore, 1) } : {}),
        ...(candidate.rolloutScoreGapToFallback !== undefined
          ? { rolloutScoreGapToFallback: round(candidate.rolloutScoreGapToFallback, 1) }
          : {}),
        ...(candidate.rolloutSteps !== undefined ? { rolloutSteps: candidate.rolloutSteps } : {}),
        ...(candidate.rolloutWinner ? { rolloutWinner: candidate.rolloutWinner } : {}),
        ...(candidate.rolloutWinnerProfile ? { rolloutWinnerProfile: candidate.rolloutWinnerProfile } : {}),
      };
    },
  );

  return {
    seed,
    direction,
    step,
    turnNumber: state.turnNumber,
    side: state.currentPlayer,
    elapsedMs: round(elapsedMs, 1),
    inspectionElapsedMs: round(inspectionElapsedMs, 1),
    rolloutTriggered: inspection.candidates.some((candidate) => candidate.rolloutScore !== undefined),
    adopted: inspection.adopted,
    decision: decisionLabel(state, decision),
    fallbackDecision: inspection.fallbackDecision ? decisionLabel(state, inspection.fallbackDecision) : "-",
    selectedDecision: inspection.selectedDecision ? decisionLabel(state, inspection.selectedDecision) : "-",
    ...(inspection.fallbackScore !== undefined ? { fallbackScore: round(inspection.fallbackScore, 1) } : {}),
    ...(inspection.selectedPlannerScore !== undefined ? { selectedPlannerScore: round(inspection.selectedPlannerScore, 1) } : {}),
    ...(inspection.runnerUpPlannerScore !== undefined ? { runnerUpPlannerScore: round(inspection.runnerUpPlannerScore, 1) } : {}),
    ...(inspection.selectedRolloutScore !== undefined ? { selectedRolloutScore: round(inspection.selectedRolloutScore, 1) } : {}),
    ...(inspection.selectedRolloutScoreGapToFallback !== undefined
      ? { selectedRolloutScoreGapToFallback: round(inspection.selectedRolloutScoreGapToFallback, 1) }
      : {}),
    ...(selectedCandidate && inspection.fallbackScore !== undefined
      ? { rootScoreGapToFallback: round(inspection.fallbackScore - selectedCandidate.rootScore, 1) }
      : {}),
    ...(selectedCandidate && fallbackCandidate
      ? { plannerMarginToFallback: round(selectedCandidate.plannerScore - fallbackCandidate.plannerScore, 1) }
      : {}),
    state: stateLine(state, state.currentPlayer),
    board: boardLine(state),
    candidates,
  };
}

function addDecisionStats(stats: DecisionStats, elapsedMs: number): void {
  stats.decisions += 1;
  stats.elapsedMs += elapsedMs;
  stats.maxDecisionMs = Math.max(stats.maxDecisionMs, elapsedMs);
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

function profilesForDirection(
  direction: Direction,
  baselineProfile: CpuAiProfile,
  challengerProfile: CpuAiProfile,
): CpuAiProfiles {
  return direction === "challenger-as-cpu"
    ? { player: baselineProfile, cpu: challengerProfile }
    : { player: challengerProfile, cpu: baselineProfile };
}

function challengerPlayer(direction: Direction): PlayerId {
  return direction === "challenger-as-cpu" ? "cpu" : "player";
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

function decisionKey(decision: CpuDecision): string {
  if (decision.type === "attack") {
    return `attack:${decision.action.attackerSlotKey}:${decision.action.commandId}->${targetToKey(decision.action.target)}`;
  }
  if (decision.type === "master_action") {
    return `master:${decision.actionId}->${targetToKey(decision.target)}`;
  }
  if (decision.type === "summon") {
    return `summon:${decision.handInstanceId}->${decision.slotKey}`;
  }
  if (decision.type === "magic") {
    return `magic:${decision.action.handInstanceId}->${targetToKey(decision.action.target)}`;
  }
  if (decision.type === "move") {
    return `move:${decision.fromSlotKey}->${decision.toSlotKey}`;
  }
  if (decision.type === "focus") {
    return `focus:${decision.slotKey}`;
  }
  return "end_turn";
}

function stateLine(state: GameState, perspective: PlayerId): string {
  const opponent = perspective === "player" ? "cpu" : "player";
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

function monsterNameAt(state: GameState, slotKey: SlotKey): string | undefined {
  const monster = state.slots[slotKey].monster;
  return monster ? getCardName(monster.cardId) : undefined;
}

function candidateFeatureSummary(
  before: GameState,
  decision: CpuDecision,
  afterRoot: GameState,
  fallbackDecision: CpuDecision | undefined,
): string {
  const pieces: string[] = [];
  if (decision.type === "summon") {
    const card = before.players[before.currentPlayer].hand.find((handCard) => handCard.instanceId === decision.handInstanceId);
    const slot = before.slots[decision.slotKey];
    const summonName = card ? getCardName(card.cardId) : decision.handInstanceId;
    pieces.push(`summon:${summonName}->${slot.row}-${slot.lane}`);
    if (card) {
      pieces.push(monsterHasBacklineAttackPattern(card.cardId) ? "backlineReach" : "noBacklineReach");
    }
    const ownFront = before.slots[slotKey(before.currentPlayer, "front", slot.lane)].monster;
    if (ownFront) {
      pieces.push(`behindOwnFront:${monsterShort(before, slotKey(before.currentPlayer, "front", slot.lane))}`);
    }
    const enemyFrontSlotKey = slotKey(opponentOfLocal(before.currentPlayer), "front", slot.lane);
    const enemyFront = before.slots[enemyFrontSlotKey].monster;
    if (enemyFront) {
      pieces.push(`sameLaneEnemyFront:${monsterShort(before, enemyFrontSlotKey)}`);
    }
    const summoned = afterRoot.slots[decision.slotKey].monster;
    if (summoned) {
      pieces.push(`after:${summoned.status}`);
    }
  } else if (decision.type === "move") {
    pieces.push(`move:${slotCoord(before, decision.fromSlotKey)}->${slotCoord(before, decision.toSlotKey)}`);
    pieces.push(`mover:${monsterShort(before, decision.fromSlotKey)}`);
  } else if (decision.type === "attack" && decision.action.target.kind === "monster") {
    pieces.push(`attackTarget:${slotCoord(before, decision.action.target.slotKey)}:${monsterShort(before, decision.action.target.slotKey)}`);
  }

  if (fallbackDecision?.type === "move") {
    pieces.push(
      decision.type === "summon" && decision.slotKey === fallbackDecision.toSlotKey
        ? `fallbackMove:${slotCoord(before, fallbackDecision.fromSlotKey)}->${slotCoord(before, fallbackDecision.toSlotKey)}:blocksTo`
        : `fallbackMove:${slotCoord(before, fallbackDecision.fromSlotKey)}->${slotCoord(before, fallbackDecision.toSlotKey)}:keepsTo`,
    );
  }

  return pieces.join("; ") || "-";
}

function monsterHasBacklineAttackPattern(cardId: string): boolean {
  const def = getMonsterDef(cardId);
  return def.levels.some((level) => level.commands.some(commandHasBacklineAttackPattern));
}

function commandHasBacklineAttackPattern(command: CommandDef): boolean {
  if (!command.implemented || command.power <= 0) {
    return false;
  }
  if (command.rangeText === "前衛攻撃" || command.rangeText === "後衛攻撃" || command.rangeText === "桂馬飛び") {
    return true;
  }
  return [
    "one_skip",
    "two_skip",
    "straight",
    "piercing",
    "decreasing_straight",
    "line",
    "any_monster",
    "any_target",
    "master",
  ].includes(command.range);
}

function monsterShort(state: GameState, key: SlotKey): string {
  const monster = state.slots[key].monster;
  if (!monster) {
    return "empty";
  }
  const status = monster.status === "prepared" ? "prep" : `act${monster.actionCount}/${monster.actionLimit}`;
  const flags = [monster.focused ? "focus" : "", monster.shielded ? "shield" : ""].filter(Boolean).join(",");
  return `${getCardName(monster.cardId)}Lv${monster.level}HP${monster.hp}${flags ? `(${status},${flags})` : `(${status})`}`;
}

function slotCoord(state: GameState, key: SlotKey): string {
  const slot = state.slots[key];
  return `${slot.owner}-${slot.row}-${slot.lane}`;
}

function slotKey(playerId: PlayerId, row: Row, lane: Lane): SlotKey {
  return `${playerId}_${row}_${lane}` as SlotKey;
}

function opponentOfLocal(playerId: PlayerId): PlayerId {
  return playerId === "player" ? "cpu" : "player";
}

function buildConclusion(games: readonly RolloutTriggerGame[], events: readonly RolloutTriggerEvent[]): string[] {
  const rolloutEvents = events.filter((event) => event.rolloutTriggered);
  const wins = games.filter((game) => game.winnerProfile === game.profiles[challengerPlayer(game.direction)]).length;
  const maxDecision = Math.max(0, ...games.map((game) => game.challengerStats.maxDecisionMs));
  const lines = [
    `${games.length} games. challenger wins ${wins}, inspected decisions ${events.length}, rollout-triggered decisions ${rolloutEvents.length}.`,
    `max challenger decision ${round(maxDecision, 1)}ms, avg challenger decision ${round(average(games.map((game) => game.challengerStats.elapsedMs / Math.max(1, game.challengerStats.decisions))), 1)}ms.`,
  ];
  if (rolloutEvents.length === 0) {
    lines.push("No rollout-triggered decision was captured. Lower --inspect-threshold-ms or expand seeds before tuning.");
  } else {
    const adopted = rolloutEvents.filter((event) => event.adopted).length;
    const avgGap = average(rolloutEvents.flatMap((event) =>
      event.selectedRolloutScoreGapToFallback === undefined ? [] : [event.selectedRolloutScoreGapToFallback],
    ));
    lines.push(`rollout adopted ${adopted}/${rolloutEvents.length}; avg selected rollout gap ${round(avgGap, 1)}.`);
    lines.push(
      rolloutEvents.length >= 2
        ? "Next implementation target is the repeated rollout-trigger shape, not a broad coefficient change."
        : "Only one rollout-triggered decision was captured. Treat it as a local clue until the same feature repeats across seeds.",
    );
  }
  return lines;
}

function formatMarkdown(report: RolloutTriggerReport): string {
  const lines = [
    "# White Rollout Trigger Audit",
    "",
    `生成: ${report.generatedAt}`,
    `deck: \`${report.options.deckPreset}\``,
    `seeds: ${report.options.seedStart}-${report.options.seedStart + report.options.count - 1}`,
    `directions: ${report.options.directions.join(", ")}`,
    `baseline: \`${report.options.baselineProfile}\`, challenger: \`${report.options.challengerProfile}\``,
    `inspectThresholdMs: ${report.options.inspectThresholdMs}`,
    "",
    "## Conclusion",
    "",
  ];
  report.conclusion.forEach((line) => lines.push(`- ${line}`));

  lines.push("", "## Games", "");
  lines.push("| seed | direction | result | steps | turns | HP | decisions | avg ms | max ms | events | issue |");
  lines.push("| ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |");
  for (const game of report.games) {
    const stats = game.challengerStats;
    lines.push(
      `| ${game.seed} | ${game.direction} | ${game.winnerProfile ?? "draw"} | ${game.steps} | ${game.turns} | ` +
        `P${game.playerHp}/C${game.cpuHp} | ${stats.decisions} | ${round(stats.elapsedMs / Math.max(1, stats.decisions), 1)} | ` +
        `${round(stats.maxDecisionMs, 1)} | ${game.events.length} | ${escapeMarkdownTableCell(game.issue ?? "-")} |`,
    );
  }

  lines.push("", "## Events", "");
  if (report.events.length === 0) {
    lines.push("No inspected decisions.");
    return `${lines.join("\n")}\n`;
  }

  for (const event of report.events) {
    lines.push(
      `### seed ${event.seed} / ${event.direction} / step ${event.step} / turn ${event.turnNumber}`,
      "",
      `- elapsed: ${event.elapsedMs}ms / inspection ${event.inspectionElapsedMs}ms`,
      `- state: ${event.state}`,
      `- board: ${event.board}`,
      `- rolloutTriggered: ${event.rolloutTriggered}, adopted: ${event.adopted}`,
      `- decision: ${event.decision}`,
      `- fallback: ${event.fallbackDecision}${event.fallbackScore === undefined ? "" : ` (${event.fallbackScore})`}`,
      `- planner selected: ${event.selectedDecision}${event.selectedPlannerScore === undefined ? "" : ` (${event.selectedPlannerScore})`}`,
      ...(event.rootScoreGapToFallback === undefined ? [] : [`- root gap to fallback: ${event.rootScoreGapToFallback}`]),
      ...(event.plannerMarginToFallback === undefined ? [] : [`- planner margin to fallback: ${event.plannerMarginToFallback}`]),
      ...(event.selectedRolloutScoreGapToFallback === undefined
        ? []
        : [`- selected rollout gap to fallback: ${event.selectedRolloutScoreGapToFallback}`]),
      "",
      "| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |",
      "| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |",
    );
    for (const candidate of event.candidates) {
      const rollout = candidate.rolloutWinnerProfile ?? candidate.rolloutWinner ?? "-";
      lines.push(
        `| ${candidate.rank} | ${candidate.selectedByCpu ? "Y" : ""} | ${candidate.selectedByPlanner ? "Y" : ""} | ` +
          `${candidate.fallback ? "Y" : ""} | ${escapeMarkdownTableCell(candidate.decision)} | ${escapeMarkdownTableCell(candidate.features)} | ` +
          `${candidate.rootScore} | ${candidate.plannerScore} | ${candidate.responseScore} | ${candidate.ownDelta} | ${candidate.opponentDelta} | ` +
          `${rollout} | ${candidate.rolloutScore ?? "-"} | ${candidate.rolloutScoreGapToFallback ?? "-"} |`,
      );
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = { ...DEFAULT_OPTIONS, directions: [...DEFAULT_OPTIONS.directions] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--seed-start") {
      parsed.seedStart = readInteger(arg, next);
      index += 1;
    } else if (arg === "--count") {
      parsed.count = readInteger(arg, next);
      index += 1;
    } else if (arg === "--direction") {
      parsed.directions = readDirections(readString(arg, next));
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
    } else if (arg === "--baseline-ai") {
      parsed.baselineProfile = readAiProfile(arg, next);
      index += 1;
    } else if (arg === "--challenger-ai") {
      parsed.challengerProfile = readAiProfile(arg, next);
      index += 1;
    } else if (arg === "--inspect-threshold-ms") {
      parsed.inspectThresholdMs = readInteger(arg, next);
      index += 1;
    } else if (arg === "--candidate-limit") {
      parsed.candidateLimit = readInteger(arg, next);
      index += 1;
    } else if (arg === "--stream-progress") {
      parsed.streamProgress = true;
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

function readDirections(value: string): Direction[] {
  if (value === "both") {
    return ["challenger-as-cpu", "challenger-as-player"];
  }
  if (value === "challenger-as-cpu" || value === "challenger-as-player") {
    return [value];
  }
  throw new Error("--direction must be one of: both, challenger-as-cpu, challenger-as-player");
}

function readAiProfile(name: string, value: string | undefined): CpuAiProfile {
  if ((CPU_AI_PROFILES as readonly string[]).includes(value ?? "")) {
    return value as CpuAiProfile;
  }
  throw new Error(`${name} must be one of: ${CPU_AI_PROFILES.join(", ")}`);
}

function printHelpAndExit(): never {
  console.log(`Usage:
  npm run audit:white-rollout-triggers -- [options]

Options:
  --seed-start <n>           First seed. Default: ${DEFAULT_OPTIONS.seedStart}
  --count <n>                Seeds per direction. Default: ${DEFAULT_OPTIONS.count}
  --direction <value>        both, challenger-as-cpu, challenger-as-player. Default: challenger-as-player
  --deck-preset <id>         Deck preset. Default: ${DEFAULT_OPTIONS.deckPreset}
  --baseline-ai <id>         Baseline profile. Default: ${DEFAULT_OPTIONS.baselineProfile}. Values: ${CPU_AI_PROFILES.join(", ")}
  --challenger-ai <id>       Challenger profile. Default: ${DEFAULT_OPTIONS.challengerProfile}. Values: ${CPU_AI_PROFILES.join(", ")}
  --inspect-threshold-ms <n> Inspect decisions at or above this time. Default: ${DEFAULT_OPTIONS.inspectThresholdMs}
  --candidate-limit <n>      Candidate rows per event. 0 means all. Default: ${DEFAULT_OPTIONS.candidateLimit}
  --max-steps <n>            Max auto steps. Default: ${DEFAULT_OPTIONS.maxSteps}
  --max-turns <n>            Max turns. Default: ${DEFAULT_OPTIONS.maxTurns}
  --stream-progress          Print one line per game.
  --markdown <path>          Write Markdown report.
  --json <path>              Write JSON report.
`);
  process.exit(0);
}
