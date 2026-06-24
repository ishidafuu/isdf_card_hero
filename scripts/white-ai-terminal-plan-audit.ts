import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  applyCpuDecision,
  chooseCpuDecision,
  evaluateState,
  inspectCpuDecisionEvaluations,
  type CpuAiOptions,
  type CpuAiSearchOptions,
  type CpuDecision,
  type CpuDecisionEvaluation,
} from "../src/game/cpuAi";
import { AI_EVALUATION_WEIGHTS } from "../src/game/aiWeights";
import { getCardName } from "../src/game/cards";
import {
  buildDeckPresetCardIds,
  deckPresetAllowsSpecial,
  getDeckPreset,
  type DeckPresetId,
} from "../src/game/deckPresets";
import { createInitialGame, opponentOf, runAutoStep, targetToKey } from "../src/game/rules";
import type { GameState, PlayerId, SlotKey, Target } from "../src/game/types";

interface CliOptions {
  deckA: DeckPresetId;
  deckB: DeckPresetId;
  seedStart: number;
  maxSeeds: number;
  scenarios: number;
  maxSteps: number;
  maxTurns: number;
  minTurn: number;
  minOccupiedSlots: number;
  beamWidth: number;
  maxActions: number;
  topLines: number;
  search: CpuAiSearchOptions;
  markdownPath: string;
  jsonPath: string;
}

interface PlanAction {
  key: string;
  label: string;
  score: number;
  reason: string;
}

interface PlanLine {
  sequenceKey: string;
  actions: PlanAction[];
  guideScoreTotal: number;
  terminalScore: number;
  terminalScoreDelta: number;
  finalState: string;
  finalBoard: string;
  finalMetrics: PlanMetrics;
  opponentResponse?: OpponentResponseLine;
  truncated: boolean;
}

interface InternalPlanLine extends PlanLine {
  finalGameState: GameState;
}

interface OpponentResponseLine {
  actions: PlanAction[];
  terminalScore: number;
  terminalScoreDelta: number;
  finalState: string;
  finalBoard: string;
  finalMetrics: PlanMetrics;
  truncated: boolean;
}

interface PlanMetrics {
  ownHp: number;
  enemyHp: number;
  ownStones: number;
  enemyStones: number;
  ownBoardValue: number;
  enemyBoardValue: number;
  ownReadyActions: number;
  enemyReadyActions: number;
  ownShielded: number;
  enemyShielded: number;
  ownLevel2Plus: number;
  enemyLevel2Plus: number;
}

interface PlanScenario {
  seed: number;
  step: number;
  turnNumber: number;
  player: PlayerId;
  state: string;
  board: string;
  initialScore: number;
  selectedPlan: PlanLine;
  selectedTerminalRank: number;
  terminalGapToBest: number;
  topTerminalPlans: PlanLine[];
}

interface TerminalPlanAuditReport {
  generatedAt: string;
  deckA: DeckPresetId;
  deckB: DeckPresetId;
  seedStart: number;
  maxSeeds: number;
  search: CpuAiSearchOptions;
  beamWidth: number;
  maxActions: number;
  scenarios: PlanScenario[];
  summary: {
    selectedTop1: number;
    selectedAverageRank: number;
    averageGapToBest: number;
    maxGapToBest: number;
  };
  conclusion: string[];
}

const DEFAULT_MARKDOWN_PATH = "docs/master_lab/results/2026-06-24_white_ai_terminal_plan_audit.md";
const DEFAULT_JSON_PATH = "docs/master_lab/results/2026-06-24_white_ai_terminal_plan_audit.json";
const SLOT_ORDER: SlotKey[] = [
  "cpu_back_left",
  "cpu_back_right",
  "cpu_front_left",
  "cpu_front_right",
  "player_front_left",
  "player_front_right",
  "player_back_left",
  "player_back_right",
];

const options = parseArgs(process.argv.slice(2));
const report = runAudit(options);
const markdown = formatMarkdown(report);
await writeReport(options.markdownPath, markdown);
await writeReport(options.jsonPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(markdown);

function runAudit(options: CliOptions): TerminalPlanAuditReport {
  const scenarios: PlanScenario[] = [];
  for (let seed = options.seedStart; seed < options.seedStart + options.maxSeeds && scenarios.length < options.scenarios; seed += 1) {
    let game = createGame(seed, options);
    const aiOptions = aiOptionsFor(options);
    for (let step = 0; step < options.maxSteps && !game.winner && scenarios.length < options.scenarios; step += 1) {
      if (game.turnNumber > options.maxTurns) {
        break;
      }
      if (isAuditableScenario(game, options, aiOptions)) {
        scenarios.push(auditScenario(game, seed, step, options, aiOptions));
        break;
      }
      game = runAutoStep(game, aiOptions);
    }
  }

  const selectedTop1 = scenarios.filter((scenario) => scenario.selectedTerminalRank === 1).length;
  const selectedAverageRank = average(scenarios.map((scenario) => scenario.selectedTerminalRank));
  const averageGapToBest = average(scenarios.map((scenario) => scenario.terminalGapToBest));
  const maxGapToBest = Math.max(0, ...scenarios.map((scenario) => scenario.terminalGapToBest));

  return {
    generatedAt: new Date().toISOString(),
    deckA: options.deckA,
    deckB: options.deckB,
    seedStart: options.seedStart,
    maxSeeds: options.maxSeeds,
    search: options.search,
    beamWidth: options.beamWidth,
    maxActions: options.maxActions,
    scenarios,
    summary: {
      selectedTop1,
      selectedAverageRank: round(selectedAverageRank, 2),
      averageGapToBest: round(averageGapToBest, 1),
      maxGapToBest: round(maxGapToBest, 1),
    },
    conclusion: buildConclusion(scenarios),
  };
}

function createGame(seed: number, options: CliOptions): GameState {
  return createInitialGame(seed, {
    masterIds: { player: "white", cpu: "white" },
    playerDeckCardIds: buildDeckPresetCardIds(options.deckA),
    cpuDeckCardIds: buildDeckPresetCardIds(options.deckB),
    allowSpecialDecks: {
      player: deckPresetAllowsSpecial(options.deckA),
      cpu: deckPresetAllowsSpecial(options.deckB),
    },
  });
}

function aiOptionsFor(options: CliOptions): CpuAiOptions {
  return {
    profiles: { player: "white", cpu: "white" },
    searches: { player: options.search, cpu: options.search },
  };
}

function isAuditableScenario(game: GameState, options: CliOptions, aiOptions: CpuAiOptions): boolean {
  if (game.winner || game.pendingLevelUp || game.turnNumber < options.minTurn) {
    return false;
  }
  if (game.players[game.currentPlayer].masterId !== "white") {
    return false;
  }
  if (occupiedSlotCount(game) < options.minOccupiedSlots) {
    return false;
  }
  return inspectCpuDecisionEvaluations(game, aiOptions).some((evaluation) => evaluation.decision.type !== "end_turn");
}

function auditScenario(
  game: GameState,
  seed: number,
  step: number,
  options: CliOptions,
  aiOptions: CpuAiOptions,
): PlanScenario {
  const perspective = game.currentPlayer;
  const initialScore = evaluateTerminalScore(game, perspective);
  const selectedPlan = buildSelectedPlan(game, perspective, options, aiOptions);
  const generatedPlans = buildCandidatePlans(game, perspective, options, aiOptions);
  const rankedPlans = mergePlans([selectedPlan, ...generatedPlans])
    .sort((a, b) => b.terminalScore - a.terminalScore || a.sequenceKey.localeCompare(b.sequenceKey));
  const selectedRank = rankedPlans.findIndex((plan) => plan.sequenceKey === selectedPlan.sequenceKey) + 1;
  const topPlan = rankedPlans[0] ?? selectedPlan;
  const selectedWithResponse = withOpponentResponse(selectedPlan, perspective, options, aiOptions);
  const topTerminalPlans = rankedPlans
    .slice(0, options.topLines)
    .map((plan) => withOpponentResponse(plan, perspective, options, aiOptions));

  return {
    seed,
    step,
    turnNumber: game.turnNumber,
    player: perspective,
    state: stateLine(game, perspective),
    board: boardLine(game),
    initialScore,
    selectedPlan: selectedWithResponse,
    selectedTerminalRank: selectedRank || rankedPlans.length,
    terminalGapToBest: round(topPlan.terminalScore - selectedPlan.terminalScore, 1),
    topTerminalPlans,
  };
}

function buildSelectedPlan(
  initial: GameState,
  perspective: PlayerId,
  options: CliOptions,
  aiOptions: CpuAiOptions,
): InternalPlanLine {
  let current = initial;
  const actions: PlanAction[] = [];
  let guideScoreTotal = 0;
  let truncated = false;

  for (let actionIndex = 0; actionIndex < options.maxActions; actionIndex += 1) {
    if (isTerminalPlanState(current, perspective)) {
      return createPlanLine(initial, current, perspective, actions, guideScoreTotal, truncated);
    }
    const decision = chooseCpuDecision(current, aiOptions);
    const evaluation = findMatchingEvaluation(current, aiOptions, decision);
    actions.push(describeDecision(current, decision, evaluation?.totalScore ?? decision.score));
    guideScoreTotal += evaluation?.totalScore ?? decision.score;
    current = applyAndResolvePending(current, decision, aiOptions);
    if (decision.type === "end_turn" || isTerminalPlanState(current, perspective)) {
      return createPlanLine(initial, current, perspective, actions, guideScoreTotal, truncated);
    }
  }

  truncated = true;
  const forcedEnd = forceEndTurn(current, aiOptions);
  if (forcedEnd) {
    actions.push(describeDecision(current, forcedEnd.decision, forcedEnd.totalScore));
    guideScoreTotal += forcedEnd.totalScore;
    current = forcedEnd.after;
  }
  return createPlanLine(initial, current, perspective, actions, guideScoreTotal, truncated);
}

function buildCandidatePlans(
  initial: GameState,
  perspective: PlayerId,
  options: CliOptions,
  aiOptions: CpuAiOptions,
): InternalPlanLine[] {
  const plans: InternalPlanLine[] = [];

  const visit = (
    current: GameState,
    actions: PlanAction[],
    guideScoreTotal: number,
    depth: number,
    truncated: boolean,
  ) => {
    if (isTerminalPlanState(current, perspective)) {
      plans.push(createPlanLine(initial, current, perspective, actions, guideScoreTotal, truncated));
      return;
    }
    if (depth >= options.maxActions) {
      const forcedEnd = forceEndTurn(current, aiOptions);
      if (forcedEnd) {
        plans.push(
          createPlanLine(
            initial,
            forcedEnd.after,
            perspective,
            [...actions, describeDecision(current, forcedEnd.decision, forcedEnd.totalScore)],
            guideScoreTotal + forcedEnd.totalScore,
            true,
          ),
        );
      } else {
        plans.push(createPlanLine(initial, current, perspective, actions, guideScoreTotal, true));
      }
      return;
    }

    for (const evaluation of branchEvaluations(current, aiOptions, options.beamWidth)) {
      const decision = evaluation.decision;
      let after: GameState;
      try {
        after = applyAndResolvePending(current, decision, aiOptions);
      } catch {
        continue;
      }
      visit(
        after,
        [...actions, describeDecision(current, decision, evaluation.totalScore)],
        guideScoreTotal + evaluation.totalScore,
        depth + 1,
        truncated,
      );
    }
  };

  visit(initial, [], 0, 0, false);
  return mergePlans(plans);
}

function branchEvaluations(
  state: GameState,
  aiOptions: CpuAiOptions,
  beamWidth: number,
): CpuDecisionEvaluation[] {
  const sorted = inspectCpuDecisionEvaluations(state, aiOptions)
    .sort((a, b) => b.totalScore - a.totalScore || decisionKey(a.decision).localeCompare(decisionKey(b.decision)));
  const nonEnd = sorted.filter((evaluation) => evaluation.decision.type !== "end_turn").slice(0, beamWidth);
  const endTurn = sorted.find((evaluation) => evaluation.decision.type === "end_turn");
  return mergeEvaluations(endTurn ? [...nonEnd, endTurn] : nonEnd);
}

function forceEndTurn(
  state: GameState,
  aiOptions: CpuAiOptions,
): { decision: CpuDecision; totalScore: number; after: GameState } | undefined {
  const evaluation = inspectCpuDecisionEvaluations(state, aiOptions).find((candidate) => candidate.decision.type === "end_turn");
  if (!evaluation) {
    return undefined;
  }
  return {
    decision: evaluation.decision,
    totalScore: evaluation.totalScore,
    after: applyAndResolvePending(state, evaluation.decision, aiOptions),
  };
}

function findMatchingEvaluation(
  state: GameState,
  aiOptions: CpuAiOptions,
  decision: CpuDecision,
): CpuDecisionEvaluation | undefined {
  const key = decisionKey(decision);
  return inspectCpuDecisionEvaluations(state, aiOptions).find((evaluation) => decisionKey(evaluation.decision) === key);
}

function applyAndResolvePending(state: GameState, decision: CpuDecision, aiOptions: CpuAiOptions): GameState {
  let current = applyCpuDecision(state, decision);
  for (let guard = 0; guard < 4 && current.pendingLevelUp && !current.winner; guard += 1) {
    current = runAutoStep(current, aiOptions);
  }
  return current;
}

function createPlanLine(
  initial: GameState,
  finalState: GameState,
  perspective: PlayerId,
  actions: PlanAction[],
  guideScoreTotal: number,
  truncated: boolean,
): InternalPlanLine {
  const terminalScore = evaluateTerminalScore(finalState, perspective);
  const sequenceKey = actions.map((action) => action.key).join(" > ") || "none";
  return {
    sequenceKey,
    actions,
    guideScoreTotal: round(guideScoreTotal, 1),
    terminalScore: round(terminalScore, 1),
    terminalScoreDelta: round(terminalScore - evaluateTerminalScore(initial, perspective), 1),
    finalState: stateLine(finalState, perspective),
    finalBoard: boardLine(finalState),
    finalMetrics: metricsLine(finalState, perspective),
    finalGameState: finalState,
    truncated,
  };
}

function mergePlans(plans: readonly InternalPlanLine[]): InternalPlanLine[] {
  const merged = new Map<string, InternalPlanLine>();
  for (const plan of plans) {
    const existing = merged.get(plan.sequenceKey);
    if (!existing || plan.terminalScore > existing.terminalScore) {
      merged.set(plan.sequenceKey, plan);
    }
  }
  return [...merged.values()];
}

function withOpponentResponse(
  plan: InternalPlanLine,
  perspective: PlayerId,
  options: CliOptions,
  aiOptions: CpuAiOptions,
): PlanLine {
  const { finalGameState, ...publicPlan } = plan;
  return {
    ...publicPlan,
    opponentResponse: buildOpponentResponse(finalGameState, perspective, options, aiOptions),
  };
}

function buildOpponentResponse(
  handoffState: GameState,
  perspective: PlayerId,
  options: CliOptions,
  aiOptions: CpuAiOptions,
): OpponentResponseLine {
  const opponent = opponentOf(perspective);
  const handoffScore = evaluateTerminalScore(handoffState, perspective);
  let current = handoffState;
  const actions: PlanAction[] = [];
  let truncated = false;

  for (let actionIndex = 0; actionIndex < options.maxActions; actionIndex += 1) {
    if (current.winner || current.pendingLevelUp || current.currentPlayer !== opponent) {
      return createOpponentResponseLine(handoffState, current, perspective, actions, truncated);
    }
    const decision = chooseCpuDecision(current, aiOptions);
    const evaluation = findMatchingEvaluation(current, aiOptions, decision);
    actions.push(describeDecision(current, decision, evaluation?.totalScore ?? decision.score));
    current = applyAndResolvePending(current, decision, aiOptions);
    if (decision.type === "end_turn" || current.currentPlayer !== opponent || current.winner || current.pendingLevelUp) {
      return createOpponentResponseLine(handoffState, current, perspective, actions, truncated);
    }
  }

  truncated = true;
  const forcedEnd = forceEndTurn(current, aiOptions);
  if (forcedEnd) {
    actions.push(describeDecision(current, forcedEnd.decision, forcedEnd.totalScore));
    current = forcedEnd.after;
  }
  const response = createOpponentResponseLine(handoffState, current, perspective, actions, truncated);
  return {
    ...response,
    terminalScoreDelta: round(response.terminalScore - handoffScore, 1),
  };
}

function createOpponentResponseLine(
  handoffState: GameState,
  finalState: GameState,
  perspective: PlayerId,
  actions: PlanAction[],
  truncated: boolean,
): OpponentResponseLine {
  const terminalScore = evaluateTerminalScore(finalState, perspective);
  return {
    actions,
    terminalScore: round(terminalScore, 1),
    terminalScoreDelta: round(terminalScore - evaluateTerminalScore(handoffState, perspective), 1),
    finalState: stateLine(finalState, perspective),
    finalBoard: boardLine(finalState),
    finalMetrics: metricsLine(finalState, perspective),
    truncated,
  };
}

function mergeEvaluations(evaluations: readonly CpuDecisionEvaluation[]): CpuDecisionEvaluation[] {
  const merged = new Map<string, CpuDecisionEvaluation>();
  for (const evaluation of evaluations) {
    merged.set(decisionKey(evaluation.decision), evaluation);
  }
  return [...merged.values()];
}

function isTerminalPlanState(state: GameState, perspective: PlayerId): boolean {
  return !!state.winner || !!state.pendingLevelUp || state.currentPlayer !== perspective;
}

function evaluateTerminalScore(state: GameState, perspective: PlayerId): number {
  return evaluateState(state, perspective, AI_EVALUATION_WEIGHTS.white);
}

function describeDecision(state: GameState, decision: CpuDecision, totalScore: number): PlanAction {
  return {
    key: decisionKey(decision),
    label: decisionLabel(state, decision),
    score: round(totalScore, 1),
    reason: decision.reason,
  };
}

function decisionLabel(state: GameState, decision: CpuDecision): string {
  if (decision.type === "attack") {
    const attacker = monsterNameAt(state, decision.action.attackerSlotKey) ?? decision.action.attackerSlotKey;
    const target = decision.action.target.kind === "monster"
      ? monsterNameAt(state, decision.action.target.slotKey) ?? decision.action.target.slotKey
      : `${decision.action.target.playerId} master`;
    return `${attacker} ${decision.action.commandId} -> ${target}`;
  }
  if (decision.type === "master_action") {
    return `master ${decision.actionId} -> ${targetLabel(state, decision.target)}`;
  }
  if (decision.type === "summon") {
    const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === decision.handInstanceId);
    return `summon ${card ? getCardName(card.cardId) : decision.handInstanceId} -> ${decision.slotKey}`;
  }
  if (decision.type === "magic") {
    const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === decision.action.handInstanceId);
    return `magic ${card ? getCardName(card.cardId) : decision.action.handInstanceId} -> ${targetLabel(state, decision.action.target)}`;
  }
  if (decision.type === "move") {
    return `move ${monsterNameAt(state, decision.fromSlotKey) ?? decision.fromSlotKey} ${decision.fromSlotKey}->${decision.toSlotKey}`;
  }
  if (decision.type === "focus") {
    return `focus ${monsterNameAt(state, decision.slotKey) ?? decision.slotKey}`;
  }
  return "end turn";
}

function targetLabel(state: GameState, target: Target): string {
  if (target.kind === "monster") {
    return `${monsterNameAt(state, target.slotKey) ?? "empty"}@${target.slotKey}`;
  }
  return `${target.playerId} master`;
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

function stateLine(game: GameState, perspective: PlayerId): string {
  const opponent = opponentOf(perspective);
  return [
    `turn ${game.turnNumber}`,
    `current ${game.currentPlayer}`,
    `HP ${perspective}/${opponent} ${game.players[perspective].masterHp}/${game.players[opponent].masterHp}`,
    `stones ${perspective}/${opponent} ${game.players[perspective].stones}/${game.players[opponent].stones}`,
    `hand ${perspective}/${opponent} ${game.players[perspective].hand.length}/${game.players[opponent].hand.length}`,
  ].join(" / ");
}

function boardLine(game: GameState): string {
  return SLOT_ORDER.map((slotKey) => slotLine(game, slotKey)).filter(Boolean).join(" | ") || "empty";
}

function slotLine(game: GameState, slotKey: SlotKey): string {
  const monster = game.slots[slotKey].monster;
  if (!monster) {
    return "";
  }
  const side = monster.owner === "player" ? "P" : "C";
  const row = game.slots[slotKey].row === "front" ? "F" : "B";
  const status = monster.status === "prepared" ? "prep" : `act${monster.actionCount}/${monster.actionLimit}`;
  const flags = [
    monster.shielded ? "shield" : "",
    monster.focused ? "focus" : "",
    monster.berserkPower ? "berserk" : "",
  ].filter(Boolean);
  return `${slotKey}:${side}${row}:${getCardName(monster.cardId)} Lv${monster.level} HP${monster.hp} ${status}${flags.length > 0 ? ` ${flags.join(",")}` : ""}`;
}

function metricsLine(state: GameState, perspective: PlayerId): PlanMetrics {
  const opponent = opponentOf(perspective);
  return {
    ownHp: state.players[perspective].masterHp,
    enemyHp: state.players[opponent].masterHp,
    ownStones: state.players[perspective].stones,
    enemyStones: state.players[opponent].stones,
    ownBoardValue: boardValue(state, perspective),
    enemyBoardValue: boardValue(state, opponent),
    ownReadyActions: readyActionCount(state, perspective),
    enemyReadyActions: readyActionCount(state, opponent),
    ownShielded: shieldedCount(state, perspective),
    enemyShielded: shieldedCount(state, opponent),
    ownLevel2Plus: level2PlusCount(state, perspective),
    enemyLevel2Plus: level2PlusCount(state, opponent),
  };
}

function boardValue(state: GameState, playerId: PlayerId): number {
  return SLOT_ORDER.reduce((total, slotKey) => {
    const monster = state.slots[slotKey].monster;
    if (!monster || monster.owner !== playerId) {
      return total;
    }
    return total + monster.level * 100 + monster.hp * 10 + (monster.shielded ? 20 : 0);
  }, 0);
}

function readyActionCount(state: GameState, playerId: PlayerId): number {
  return SLOT_ORDER.filter((slotKey) => {
    const monster = state.slots[slotKey].monster;
    return !!monster && monster.owner === playerId && monster.status === "active" && monster.actionCount < monster.actionLimit;
  }).length;
}

function shieldedCount(state: GameState, playerId: PlayerId): number {
  return SLOT_ORDER.filter((slotKey) => {
    const monster = state.slots[slotKey].monster;
    return !!monster && monster.owner === playerId && monster.shielded;
  }).length;
}

function level2PlusCount(state: GameState, playerId: PlayerId): number {
  return SLOT_ORDER.filter((slotKey) => {
    const monster = state.slots[slotKey].monster;
    return !!monster && monster.owner === playerId && monster.level >= 2;
  }).length;
}

function monsterNameAt(game: GameState, slotKey: SlotKey): string | undefined {
  const monster = game.slots[slotKey].monster;
  return monster ? getCardName(monster.cardId) : undefined;
}

function occupiedSlotCount(game: GameState): number {
  return SLOT_ORDER.filter((slotKey) => !!game.slots[slotKey].monster).length;
}

function buildConclusion(scenarios: readonly PlanScenario[]): string[] {
  if (scenarios.length === 0) {
    return ["監査対象局面を取得できなかった。minTurn/minOccupiedSlots/maxSeeds を緩めて再実行する。"];
  }
  const top1 = scenarios.filter((scenario) => scenario.selectedTerminalRank === 1).length;
  const averageGap = average(scenarios.map((scenario) => scenario.terminalGapToBest));
  const largeGaps = scenarios.filter((scenario) => scenario.terminalGapToBest >= 80);
  const selectedShield = scenarios.filter((scenario) => hasAction(scenario.selectedPlan, "master:shield")).length;
  const topShield = scenarios.filter((scenario) => hasAction(scenario.topTerminalPlans[0], "master:shield")).length;
  const selectedFocus = scenarios.filter((scenario) => hasAction(scenario.selectedPlan, "focus:")).length;
  const topFocus = scenarios.filter((scenario) => hasAction(scenario.topTerminalPlans[0], "focus:")).length;
  const lines = [
    `現行AIの選択手順が終端盤面1位だった局面は ${top1}/${scenarios.length}。`,
    `平均ギャップは ${round(averageGap, 1)} 点。80点以上のズレは ${largeGaps.length}/${scenarios.length}。`,
    `現行選択はシールド ${selectedShield}/${scenarios.length}、フォーカス ${selectedFocus}/${scenarios.length} を含む。一方、終端1位はシールド ${topShield}/${scenarios.length}、フォーカス ${topFocus}/${scenarios.length}。`,
  ];
  if (largeGaps.length > 0) {
    lines.push("勝率ベンチを増やす前に、ズレが大きい局面の手順評価を読み、追加行動の局所加点より終端盤面の石・行動済み・レベルアップ成果を優先する候補を作る。");
  } else {
    lines.push("このサンプルでは現行AIの手順選択と終端盤面評価のズレは限定的。次はサンプル局面を増やすか、対黒局面でも同じ監査を行う。");
  }
  return lines;
}

function hasAction(plan: PlanLine | undefined, keyPrefix: string): boolean {
  return !!plan?.actions.some((action) => action.key.startsWith(keyPrefix));
}

function formatMarkdown(report: TerminalPlanAuditReport): string {
  const lines = [
    "# White AI Terminal Plan Audit",
    "",
    `生成: ${report.generatedAt}`,
    `デッキ: \`${report.deckA}\` vs \`${report.deckB}\``,
    `seedStart: ${report.seedStart}, maxSeeds: ${report.maxSeeds}`,
    `search: depth ${report.search.sameTurnSearchDepth}, width ${report.search.sameTurnSearchWidth}, detailed ${report.search.detailedWidth}`,
    `terminalPlan: depth ${report.search.sameTurnTerminalPlanDepth}, width ${report.search.sameTurnTerminalPlanWidth}, weight ${report.search.sameTurnTerminalPlanWeight}`,
    `opponentTerminalPlan: depth ${report.search.sameTurnOpponentTerminalPlanDepth}, width ${report.search.sameTurnOpponentTerminalPlanWidth}, weight ${report.search.sameTurnOpponentTerminalPlanWeight}`,
    `beamWidth: ${report.beamWidth}, maxActions: ${report.maxActions}`,
    "",
    "## Summary",
    "",
    `- selected top1: ${report.summary.selectedTop1}/${report.scenarios.length}`,
    `- selected average rank: ${report.summary.selectedAverageRank}`,
    `- average gap to best: ${report.summary.averageGapToBest}`,
    `- max gap to best: ${report.summary.maxGapToBest}`,
    "",
    "## Method",
    "",
    "- 実戦途中の白同士局面から、現行AI評価の上位候補を幅 `beamWidth` で拾い、各手順をエンドターンまで進めた。",
    "- `terminal` は、相手ターン開始後の盤面を白AI重みの `evaluateState` で評価した値。`guide` は現行AIの局所評価合計で、terminalとは別物。",
    "- `opponent response` は、渡した盤面から相手AIが同じ軽量設定でエンドターンまで進めた後の盤面評価。勝率ではなく「渡した盤面が相手にどう返されるか」を見るための補助線。",
    "- この監査は勝率ではなく、現行AIの選択手順と「相手へ渡す最終盤面」「相手から返る最終盤面」のズレを見るためのもの。",
    "",
    "## Conclusion",
    "",
    ...report.conclusion.map((line) => `- ${line}`),
    "",
    "## Scenarios",
    "",
  ];

  report.scenarios.forEach((scenario, index) => {
    lines.push(
      `### ${index + 1}. seed ${scenario.seed} turn ${scenario.turnNumber} ${scenario.player}`,
      "",
      `- step: ${scenario.step}`,
      `- state: ${scenario.state}`,
      `- initialScore: ${round(scenario.initialScore, 1)}`,
      `- selectedTerminalRank: ${scenario.selectedTerminalRank}`,
      `- terminalGapToBest: ${scenario.terminalGapToBest}`,
      `- board: ${scenario.board}`,
      "",
      "#### Selected plan",
      "",
      ...formatPlanLines([scenario.selectedPlan]),
      "",
      "#### Top terminal plans",
      "",
      ...formatPlanLines(scenario.topTerminalPlans),
      "",
    );
  });

  return `${lines.join("\n")}\n`;
}

function formatPlanLines(plans: readonly PlanLine[]): string[] {
  const lines: string[] = [];
  plans.forEach((plan, index) => {
    const actions = plan.actions.map((action) => `${action.label} [${action.score}]`).join(" -> ") || "none";
    lines.push(
      `${index + 1}. terminal ${plan.terminalScore} (${plan.terminalScoreDelta >= 0 ? "+" : ""}${plan.terminalScoreDelta}) / guide ${plan.guideScoreTotal}${plan.truncated ? " / truncated" : ""}`,
      `   - actions: ${actions}`,
      `   - final: ${plan.finalState}`,
      `   - metrics: HP ${plan.finalMetrics.ownHp}/${plan.finalMetrics.enemyHp}, stones ${plan.finalMetrics.ownStones}/${plan.finalMetrics.enemyStones}, boardValue ${plan.finalMetrics.ownBoardValue}/${plan.finalMetrics.enemyBoardValue}, ready ${plan.finalMetrics.ownReadyActions}/${plan.finalMetrics.enemyReadyActions}, shield ${plan.finalMetrics.ownShielded}/${plan.finalMetrics.enemyShielded}, Lv2+ ${plan.finalMetrics.ownLevel2Plus}/${plan.finalMetrics.enemyLevel2Plus}`,
      `   - board: ${plan.finalBoard}`,
    );
    if (plan.opponentResponse) {
      const responseActions = plan.opponentResponse.actions.map((action) => `${action.label} [${action.score}]`).join(" -> ") || "none";
      lines.push(
        `   - opponent response: terminal ${plan.opponentResponse.terminalScore} (${plan.opponentResponse.terminalScoreDelta >= 0 ? "+" : ""}${plan.opponentResponse.terminalScoreDelta})${plan.opponentResponse.truncated ? " / truncated" : ""}`,
        `     - actions: ${responseActions}`,
        `     - final: ${plan.opponentResponse.finalState}`,
        `     - metrics: HP ${plan.opponentResponse.finalMetrics.ownHp}/${plan.opponentResponse.finalMetrics.enemyHp}, stones ${plan.opponentResponse.finalMetrics.ownStones}/${plan.opponentResponse.finalMetrics.enemyStones}, boardValue ${plan.opponentResponse.finalMetrics.ownBoardValue}/${plan.opponentResponse.finalMetrics.enemyBoardValue}, ready ${plan.opponentResponse.finalMetrics.ownReadyActions}/${plan.opponentResponse.finalMetrics.enemyReadyActions}, shield ${plan.opponentResponse.finalMetrics.ownShielded}/${plan.opponentResponse.finalMetrics.enemyShielded}, Lv2+ ${plan.opponentResponse.finalMetrics.ownLevel2Plus}/${plan.opponentResponse.finalMetrics.enemyLevel2Plus}`,
        `     - board: ${plan.opponentResponse.finalBoard}`,
      );
    }
  });
  return lines;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    deckA: "submission-pro-with-rare8-white-1339",
    deckB: "submission-pro-no-rare8-white-1377",
    seedStart: 56000,
    maxSeeds: 20,
    scenarios: 3,
    maxSteps: 700,
    maxTurns: 160,
    minTurn: 5,
    minOccupiedSlots: 4,
    beamWidth: 2,
    maxActions: 8,
    topLines: 3,
    search: {
      sameTurnSearchDepth: 4,
      sameTurnSearchWidth: 4,
      detailedWidth: 4,
      sameTurnTerminalPlanDepth: 6,
      sameTurnTerminalPlanWidth: 2,
      sameTurnTerminalPlanWeight: 2,
      sameTurnOpponentTerminalPlanDepth: 2,
      sameTurnOpponentTerminalPlanWidth: 1,
      sameTurnOpponentTerminalPlanWeight: 0.35,
    },
    markdownPath: DEFAULT_MARKDOWN_PATH,
    jsonPath: DEFAULT_JSON_PATH,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--deck-a") {
      parsed.deckA = readDeckPresetId(arg, next);
      i += 1;
    } else if (arg === "--deck-b") {
      parsed.deckB = readDeckPresetId(arg, next);
      i += 1;
    } else if (arg === "--seed-start") {
      parsed.seedStart = readInteger(arg, next);
      i += 1;
    } else if (arg === "--max-seeds") {
      parsed.maxSeeds = readInteger(arg, next);
      i += 1;
    } else if (arg === "--scenarios") {
      parsed.scenarios = readInteger(arg, next);
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readInteger(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readInteger(arg, next);
      i += 1;
    } else if (arg === "--min-turn") {
      parsed.minTurn = readInteger(arg, next);
      i += 1;
    } else if (arg === "--min-occupied-slots") {
      parsed.minOccupiedSlots = readInteger(arg, next);
      i += 1;
    } else if (arg === "--beam-width") {
      parsed.beamWidth = readInteger(arg, next);
      i += 1;
    } else if (arg === "--max-actions") {
      parsed.maxActions = readInteger(arg, next);
      i += 1;
    } else if (arg === "--top-lines") {
      parsed.topLines = readInteger(arg, next);
      i += 1;
    } else if (arg === "--search") {
      parsed.search = readSearchOptions(arg, next);
      i += 1;
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      i += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return parsed;
}

function readSearchOptions(name: string, value: string | undefined): CpuAiSearchOptions {
  const raw = readString(name, value);
  const [
    depth,
    width,
    detailedWidth = width,
    terminalDepth,
    terminalWidth,
    terminalWeight,
    opponentDepth,
    opponentWidth,
    opponentWeight,
  ] = raw.split(":").map(Number);
  if (!Number.isInteger(depth) || !Number.isInteger(width) || !Number.isInteger(detailedWidth)) {
    throw new Error(`${name} must be formatted as depth:width[:detailedWidth[:terminalDepth:terminalWidth:terminalWeight]]`);
  }
  const search: CpuAiSearchOptions = {
    sameTurnSearchDepth: depth,
    sameTurnSearchWidth: width,
    detailedWidth,
  };
  if (terminalDepth !== undefined || terminalWidth !== undefined || terminalWeight !== undefined) {
    if (!Number.isInteger(terminalDepth) || !Number.isInteger(terminalWidth) || !Number.isFinite(terminalWeight)) {
      throw new Error(`${name} terminal plan options must be formatted as terminalDepth:terminalWidth:terminalWeight`);
    }
    search.sameTurnTerminalPlanDepth = terminalDepth;
    search.sameTurnTerminalPlanWidth = terminalWidth;
    search.sameTurnTerminalPlanWeight = terminalWeight;
  }
  if (opponentDepth !== undefined || opponentWidth !== undefined || opponentWeight !== undefined) {
    if (!Number.isInteger(opponentDepth) || !Number.isInteger(opponentWidth) || !Number.isFinite(opponentWeight)) {
      throw new Error(`${name} opponent terminal plan options must be formatted as opponentDepth:opponentWidth:opponentWeight`);
    }
    search.sameTurnOpponentTerminalPlanDepth = opponentDepth;
    search.sameTurnOpponentTerminalPlanWidth = opponentWidth;
    search.sameTurnOpponentTerminalPlanWeight = opponentWeight;
  }
  return search;
}

function readDeckPresetId(name: string, value: string | undefined): DeckPresetId {
  const deckPreset = readString(name, value) as DeckPresetId;
  getDeckPreset(deckPreset);
  return deckPreset;
}

function readInteger(name: string, value: string | undefined): number {
  const number = Number(readString(name, value));
  if (!Number.isInteger(number) || number < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
  return number;
}

function readString(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf8");
}

function average(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function round(value: number, precision: number): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function printHelp(): void {
  console.log(`
Usage:
  npm run audit:white-terminal-plans -- [options]

Options:
  --deck-a <id>                 First white deck. Default: submission-pro-with-rare8-white-1339
  --deck-b <id>                 Second white deck. Default: submission-pro-no-rare8-white-1377
  --seed-start <n>              First seed. Default: 56000
  --max-seeds <n>               Maximum seeds to scan. Default: 20
  --scenarios <n>               Audited scenarios. Default: 3
  --min-turn <n>                First turn number to audit. Default: 5
  --min-occupied-slots <n>      Minimum occupied slots. Default: 4
  --beam-width <n>              Candidate branch width. Default: 2
  --max-actions <n>             Maximum own-turn actions before forced end turn. Default: 8
  --top-lines <n>               Top terminal plans per scenario. Default: 3
  --search <d:w[:dw[:td:tw:twgt[:od:ow:owgt]]]>
                                AI search options for guide scores. Default: 4:4:4:6:2:2:2:1:0.35
  --markdown <path>             Markdown output path.
  --json <path>                 JSON output path.
`);
}
