import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  applyCpuDecision,
  chooseCpuDecision,
  inspectCpuDecisionEvaluations,
  type CpuAiOptions,
  type CpuAiSearchOptions,
  type CpuDecision,
  type CpuDecisionEvaluation,
} from "../src/game/cpuAi";
import { getCardName } from "../src/game/cards";
import {
  buildDeckPresetCardIds,
  deckPresetAllowsSpecial,
  type DeckPresetId,
} from "../src/game/deckPresets";
import { DEFAULT_CPU_DECK_PRESET_ID, DEFAULT_PLAYER_DECK_PRESET_ID } from "../src/game/defaultDeckPresets";
import { createInitialGame, opponentOf, runAutoStep, targetToKey } from "../src/game/rules";
import type { GameState, PlayerId, SlotKey, Target } from "../src/game/types";

interface CliOptions {
  deckA: DeckPresetId;
  deckB: DeckPresetId;
  seedStart: number;
  maxSeeds: number;
  maxEvents: number;
  maxSteps: number;
  maxTurns: number;
  maxSamples: number;
  search: CpuAiSearchOptions;
  markdownPath: string;
  jsonPath: string;
}

interface ChipAlternativeSummary {
  bestFocus?: DecisionSummary;
  endTurn?: DecisionSummary;
  bestImmediateFinish?: DecisionSummary;
  topCandidates: DecisionSummary[];
}

interface DecisionSummary {
  key: string;
  label: string;
  score: number;
}

interface FrontChipEvent {
  id: string;
  seed: number;
  direction: string;
  step: number;
  turnNumber: number;
  actingPlayer: PlayerId;
  responsePlayer: PlayerId;
  decisionKind: "attack" | "master_attack";
  decision: DecisionSummary;
  alternatives: ChipAlternativeSummary;
  attacker?: string;
  target: string;
  targetInstanceId: string;
  targetSlotKey: SlotKey;
  targetHpBefore: number;
  targetHpAfter: number;
  targetShieldedBefore: boolean;
  actingPlayerStonesBefore: number;
  actingPlayerStonesAfter: number;
  responsePlayerStonesBefore: number;
  responsePlayerStonesAfter: number;
  stateBefore: string;
  boardBefore: string;
  boardAfterChip: string;
  convertedSameTurn: boolean;
  responseStarted: boolean;
  targetRemovedBeforeResponse: boolean;
  targetRemovedBeforeActing: boolean;
  targetActed: boolean;
  targetAction?: DecisionSummary;
  targetActionTurn?: number;
  targetDamagedMaster: boolean;
  targetMasterDamage: number;
  targetDamagedOwnMonster: boolean;
  targetKilledOwnMonster: boolean;
  targetLeveledUpOnResponse: boolean;
  responseCompleted: boolean;
  finalOutcome: "converted" | "harmful_response" | "acted_no_damage" | "removed_before_acting" | "survived_no_action" | "unresolved";
  finalBoard?: string;
}

interface PendingFrontChipEvent extends FrontChipEvent {
  responseStarted: boolean;
}

interface GameAuditResult {
  seed: number;
  direction: string;
  playerDeck: DeckPresetId;
  cpuDeck: DeckPresetId;
  winner?: PlayerId;
  steps: number;
  turns: number;
  issue?: string;
  events: FrontChipEvent[];
}

interface FrontChipResponseAuditReport {
  generatedAt: string;
  deckA: DeckPresetId;
  deckB: DeckPresetId;
  seedStart: number;
  maxSeeds: number;
  maxEvents: number;
  search: CpuAiSearchOptions;
  games: GameAuditResult[];
  events: FrontChipEvent[];
  summary: {
    games: number;
    completedGames: number;
    events: number;
    convertedSameTurn: number;
    targetRemovedBeforeResponse: number;
    targetRemovedBeforeActing: number;
    targetActed: number;
    harmfulResponse: number;
    targetDamagedMaster: number;
    targetDamagedOwnMonster: number;
    targetKilledOwnMonster: number;
    targetLeveledUpOnResponse: number;
    focusAlternativeAvailable: number;
    immediateFinishAlternativeAvailable: number;
    averageTargetHpAfter: number;
    averageSelectedMinusBestFocus: number;
    averageSelectedMinusImmediateFinish: number;
    byHpAfter: Record<string, number>;
    byDecisionKind: Record<string, number>;
    byTarget: Record<string, number>;
  };
  conclusion: string[];
}

const DEFAULT_OPTIONS: CliOptions = {
  deckA: DEFAULT_PLAYER_DECK_PRESET_ID,
  deckB: DEFAULT_CPU_DECK_PRESET_ID,
  seedStart: 76000,
  maxSeeds: 40,
  maxEvents: 120,
  maxSteps: 800,
  maxTurns: 180,
  maxSamples: 12,
  search: {
    sameTurnSearchDepth: 3,
    sameTurnSearchWidth: 4,
    detailedWidth: 4,
    sameTurnTerminalPlanDepth: 6,
    sameTurnTerminalPlanWidth: 2,
    sameTurnTerminalPlanWeight: 2,
    sameTurnOpponentTerminalPlanDepth: 2,
    sameTurnOpponentTerminalPlanWidth: 1,
    sameTurnOpponentTerminalPlanWeight: 0.35,
  },
  markdownPath: "docs/master_lab/results/2026-06-27_white_mirror_front_chip_response_audit.md",
  jsonPath: "docs/master_lab/results/2026-06-27_white_mirror_front_chip_response_audit.json",
};

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

function runAudit(options: CliOptions): FrontChipResponseAuditReport {
  const games: GameAuditResult[] = [];
  const events: FrontChipEvent[] = [];
  const directions = [
    { id: "A-as-player", playerDeck: options.deckA, cpuDeck: options.deckB, seedOffset: 0 },
    { id: "B-as-player", playerDeck: options.deckB, cpuDeck: options.deckA, seedOffset: options.maxSeeds },
  ] as const;

  for (const direction of directions) {
    for (
      let index = 0;
      index < options.maxSeeds && events.length < options.maxEvents;
      index += 1
    ) {
      const result = runGameAudit(
        options.seedStart + direction.seedOffset + index,
        direction.id,
        direction.playerDeck,
        direction.cpuDeck,
        options,
        options.maxEvents - events.length,
      );
      games.push(result);
      events.push(...result.events);
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    deckA: options.deckA,
    deckB: options.deckB,
    seedStart: options.seedStart,
    maxSeeds: options.maxSeeds,
    maxEvents: options.maxEvents,
    search: options.search,
    games,
    events,
    summary: summarize(events, games),
    conclusion: buildConclusion(events),
  };
}

function runGameAudit(
  seed: number,
  direction: string,
  playerDeck: DeckPresetId,
  cpuDeck: DeckPresetId,
  options: CliOptions,
  eventBudget: number,
): GameAuditResult {
  let game = createGame(seed, playerDeck, cpuDeck);
  const aiOptions = createAiOptions(options);
  const events: FrontChipEvent[] = [];
  const pendingEvents: PendingFrontChipEvent[] = [];
  let issue: string | undefined;
  let step = 0;

  for (; step < options.maxSteps && !game.winner; step += 1) {
    if (game.turnNumber > options.maxTurns) {
      issue = `turn ${game.turnNumber} exceeded limit ${options.maxTurns}`;
      break;
    }

    const before = game;
    const choice = before.pendingLevelUp
      ? undefined
      : chooseDecisionWithEvaluation(before, aiOptions);
    const next = choice
      ? applyCpuDecision(before, choice.decision)
      : runAutoStep(before, aiOptions);

    observeTransition(before, next, choice?.decision, pendingEvents);
    finalizeEventsAfterTransition(next, pendingEvents, events);

    if (choice && events.length + pendingEvents.length < eventBudget) {
      const chip = createFrontChipEvent(before, next, choice, seed, direction, step, aiOptions);
      if (chip) {
        pendingEvents.push(chip);
      }
    }

    game = next;
    if (events.length >= eventBudget) {
      break;
    }
  }

  for (const event of pendingEvents) {
    event.finalOutcome = classifyFinalOutcome(event);
    event.finalBoard = boardLine(game);
    events.push(event);
  }

  if (!game.winner && !issue && step >= options.maxSteps) {
    issue = `winner was not decided within ${options.maxSteps} steps`;
  }

  return {
    seed,
    direction,
    playerDeck,
    cpuDeck,
    winner: game.winner,
    steps: step,
    turns: game.turnNumber,
    ...(issue ? { issue } : {}),
    events,
  };
}

function createGame(seed: number, playerDeck: DeckPresetId, cpuDeck: DeckPresetId): GameState {
  return createInitialGame(seed, {
    masterIds: { player: "white", cpu: "white" },
    playerDeckCardIds: buildDeckPresetCardIds(playerDeck),
    cpuDeckCardIds: buildDeckPresetCardIds(cpuDeck),
    allowSpecialDecks: {
      player: deckPresetAllowsSpecial(playerDeck),
      cpu: deckPresetAllowsSpecial(cpuDeck),
    },
  });
}

function createAiOptions(options: CliOptions): CpuAiOptions {
  return {
    profiles: { player: "white", cpu: "white" },
    searches: { player: options.search, cpu: options.search },
  };
}

function chooseDecisionWithEvaluation(
  state: GameState,
  aiOptions: CpuAiOptions,
): { decision: CpuDecision; evaluation?: CpuDecisionEvaluation; evaluations: CpuDecisionEvaluation[] } {
  const decision = chooseCpuDecision(state, aiOptions);
  const evaluations = inspectCpuDecisionEvaluations(state, aiOptions);
  const key = decisionKey(decision);
  return {
    decision,
    evaluation: evaluations.find((candidate) => decisionKey(candidate.decision) === key),
    evaluations,
  };
}

function createFrontChipEvent(
  before: GameState,
  after: GameState,
  choice: { decision: CpuDecision; evaluation?: CpuDecisionEvaluation; evaluations: CpuDecisionEvaluation[] },
  seed: number,
  direction: string,
  step: number,
  aiOptions: CpuAiOptions,
): PendingFrontChipEvent | undefined {
  const player = before.currentPlayer;
  const opponent = opponentOf(player);
  const decision = choice.decision;
  const target = chipTarget(decision);
  if (!target || target.kind !== "monster") {
    return undefined;
  }
  const beforeSlot = before.slots[target.slotKey];
  const beforeMonster = beforeSlot.monster;
  const afterMonster = after.slots[target.slotKey].monster;
  if (
    beforeSlot.row !== "front" ||
    !beforeMonster ||
    beforeMonster.owner !== opponent ||
    !afterMonster ||
    afterMonster.instanceId !== beforeMonster.instanceId ||
    afterMonster.hp >= beforeMonster.hp ||
    afterMonster.hp <= 0
  ) {
    return undefined;
  }

  const decisionKind = decision.type === "attack" ? "attack" : "master_attack";
  const selectedScore = choice.evaluation?.totalScore ?? decision.score;
  return {
    id: `${seed}:${direction}:${step}:${beforeMonster.instanceId}`,
    seed,
    direction,
    step,
    turnNumber: before.turnNumber,
    actingPlayer: player,
    responsePlayer: opponent,
    decisionKind,
    decision: summarizeDecision(before, decision, selectedScore),
    alternatives: summarizeAlternatives(before, target.slotKey, choice.evaluations, selectedScore, aiOptions),
    attacker: decision.type === "attack" ? monsterNameAt(before, decision.action.attackerSlotKey) : "white master",
    target: monsterLabel(beforeMonster),
    targetInstanceId: beforeMonster.instanceId,
    targetSlotKey: target.slotKey,
    targetHpBefore: beforeMonster.hp,
    targetHpAfter: afterMonster.hp,
    targetShieldedBefore: !!(beforeMonster.shielded || beforeMonster.halfShielded || beforeMonster.oneShotShield),
    actingPlayerStonesBefore: before.players[player].stones,
    actingPlayerStonesAfter: after.players[player].stones,
    responsePlayerStonesBefore: before.players[opponent].stones,
    responsePlayerStonesAfter: after.players[opponent].stones,
    stateBefore: stateLine(before),
    boardBefore: boardLine(before),
    boardAfterChip: boardLine(after),
    convertedSameTurn: false,
    responseStarted: false,
    targetRemovedBeforeResponse: false,
    targetRemovedBeforeActing: false,
    targetActed: false,
    targetDamagedMaster: false,
    targetMasterDamage: 0,
    targetDamagedOwnMonster: false,
    targetKilledOwnMonster: false,
    targetLeveledUpOnResponse: false,
    responseCompleted: false,
    finalOutcome: "unresolved",
  };
}

function chipTarget(decision: CpuDecision): Target | undefined {
  if (decision.type === "attack") {
    return decision.action.target;
  }
  if (decision.type === "master_action" && decision.actionId === "master_attack") {
    return decision.target;
  }
  return undefined;
}

function observeTransition(
  before: GameState,
  after: GameState,
  decision: CpuDecision | undefined,
  pendingEvents: PendingFrontChipEvent[],
): void {
  for (const event of pendingEvents) {
    if (!event.responseStarted && after.currentPlayer === event.responsePlayer && !after.pendingLevelUp) {
      event.responseStarted = true;
      if (!findMonsterSlotByInstanceId(after, event.targetInstanceId)) {
        event.targetRemovedBeforeResponse = true;
        event.convertedSameTurn = true;
      }
    }

    if (!event.responseStarted) {
      if (!findMonsterSlotByInstanceId(after, event.targetInstanceId)) {
        event.targetRemovedBeforeResponse = true;
        event.convertedSameTurn = true;
      }
      continue;
    }

    const targetSlotBefore = findMonsterSlotByInstanceId(before, event.targetInstanceId);
    const targetSlotAfter = findMonsterSlotByInstanceId(after, event.targetInstanceId);
    if (!targetSlotAfter && !event.targetActed) {
      event.targetRemovedBeforeActing = true;
    }
    if (!decision || before.currentPlayer !== event.responsePlayer || !targetSlotBefore) {
      continue;
    }
    if (!isDecisionByInstance(before, decision, event.targetInstanceId)) {
      continue;
    }

    event.targetActed = true;
    event.targetAction = summarizeDecision(before, decision, 0);
    event.targetActionTurn = before.turnNumber;
    const masterDamage = before.players[event.actingPlayer].masterHp - after.players[event.actingPlayer].masterHp;
    if (masterDamage > 0) {
      event.targetDamagedMaster = true;
      event.targetMasterDamage += masterDamage;
    }
    if (ownMonsterDamageOccurred(before, after, event.actingPlayer)) {
      event.targetDamagedOwnMonster = true;
    }
    if (ownMonsterKilled(before, after, event.actingPlayer)) {
      event.targetKilledOwnMonster = true;
    }
    if (
      after.pendingLevelUp?.playerId === event.responsePlayer &&
      after.pendingLevelUp.attackerSlotKey === targetSlotBefore
    ) {
      event.targetLeveledUpOnResponse = true;
    }
  }
}

function finalizeEventsAfterTransition(
  state: GameState,
  pendingEvents: PendingFrontChipEvent[],
  completed: FrontChipEvent[],
): void {
  for (let index = pendingEvents.length - 1; index >= 0; index -= 1) {
    const event = pendingEvents[index];
    const responseTurnEnded =
      event.responseStarted &&
      !state.pendingLevelUp &&
      (state.currentPlayer === event.actingPlayer || !!state.winner);
    const convertedBeforeResponse =
      event.convertedSameTurn && !event.responseStarted && !findMonsterSlotByInstanceId(state, event.targetInstanceId);
    if (!responseTurnEnded && !convertedBeforeResponse) {
      continue;
    }
    event.responseCompleted = responseTurnEnded;
    event.finalOutcome = classifyFinalOutcome(event);
    event.finalBoard = boardLine(state);
    completed.push(event);
    pendingEvents.splice(index, 1);
  }
}

function classifyFinalOutcome(event: FrontChipEvent): FrontChipEvent["finalOutcome"] {
  if (event.convertedSameTurn) {
    return "converted";
  }
  if (event.targetKilledOwnMonster || event.targetDamagedMaster || event.targetDamagedOwnMonster || event.targetLeveledUpOnResponse) {
    return "harmful_response";
  }
  if (event.targetActed) {
    return "acted_no_damage";
  }
  if (event.targetRemovedBeforeActing) {
    return "removed_before_acting";
  }
  if (event.responseCompleted) {
    return "survived_no_action";
  }
  return "unresolved";
}

function summarizeAlternatives(
  state: GameState,
  targetSlotKey: SlotKey,
  evaluations: readonly CpuDecisionEvaluation[],
  selectedScore: number,
  aiOptions: CpuAiOptions,
): ChipAlternativeSummary {
  const sorted = [...evaluations].sort((a, b) => b.totalScore - a.totalScore);
  const focus = sorted.find((candidate) => candidate.decision.type === "focus");
  const endTurn = sorted.find((candidate) => candidate.decision.type === "end_turn");
  const finish = findBestImmediateFinishAlternative(state, targetSlotKey, sorted, aiOptions);
  return {
    ...(focus ? { bestFocus: summarizeDecision(state, focus.decision, focus.totalScore - selectedScore) } : {}),
    ...(endTurn ? { endTurn: summarizeDecision(state, endTurn.decision, endTurn.totalScore - selectedScore) } : {}),
    ...(finish ? { bestImmediateFinish: summarizeDecision(state, finish.decision, finish.totalScore - selectedScore) } : {}),
    topCandidates: sorted.slice(0, 5).map((candidate) =>
      summarizeDecision(state, candidate.decision, candidate.totalScore - selectedScore),
    ),
  };
}

function findBestImmediateFinishAlternative(
  state: GameState,
  targetSlotKey: SlotKey,
  evaluations: readonly CpuDecisionEvaluation[],
  aiOptions: CpuAiOptions,
): CpuDecisionEvaluation | undefined {
  const target = state.slots[targetSlotKey].monster;
  if (!target) {
    return undefined;
  }
  const selectedKey = decisionKey(chooseCpuDecision(state, aiOptions));
  return evaluations.find((candidate) => {
    if (decisionKey(candidate.decision) === selectedKey || candidate.decision.type === "end_turn") {
      return false;
    }
    try {
      const after = applyCpuDecision(state, candidate.decision);
      return !findMonsterSlotByInstanceId(after, target.instanceId);
    } catch {
      return false;
    }
  });
}

function isDecisionByInstance(state: GameState, decision: CpuDecision, instanceId: string): boolean {
  if (decision.type === "attack") {
    return state.slots[decision.action.attackerSlotKey].monster?.instanceId === instanceId;
  }
  if (decision.type === "focus") {
    return state.slots[decision.slotKey].monster?.instanceId === instanceId;
  }
  if (decision.type === "move") {
    return state.slots[decision.fromSlotKey].monster?.instanceId === instanceId;
  }
  return false;
}

function ownMonsterDamageOccurred(before: GameState, after: GameState, owner: PlayerId): boolean {
  for (const slotKey of SLOT_ORDER) {
    const beforeMonster = before.slots[slotKey].monster;
    if (!beforeMonster || beforeMonster.owner !== owner) {
      continue;
    }
    const afterMonster = findMonsterByInstanceId(after, beforeMonster.instanceId);
    if (afterMonster && afterMonster.hp < beforeMonster.hp) {
      return true;
    }
  }
  return false;
}

function ownMonsterKilled(before: GameState, after: GameState, owner: PlayerId): boolean {
  for (const slotKey of SLOT_ORDER) {
    const beforeMonster = before.slots[slotKey].monster;
    if (beforeMonster?.owner === owner && !findMonsterByInstanceId(after, beforeMonster.instanceId)) {
      return true;
    }
  }
  return false;
}

function summarize(events: readonly FrontChipEvent[], games: readonly GameAuditResult[]): FrontChipResponseAuditReport["summary"] {
  const focusGaps = events
    .map((event) => event.alternatives.bestFocus?.score)
    .filter((value): value is number => value !== undefined);
  const finishGaps = events
    .map((event) => event.alternatives.bestImmediateFinish?.score)
    .filter((value): value is number => value !== undefined);
  return {
    games: games.length,
    completedGames: games.filter((game) => !game.issue).length,
    events: events.length,
    convertedSameTurn: events.filter((event) => event.convertedSameTurn).length,
    targetRemovedBeforeResponse: events.filter((event) => event.targetRemovedBeforeResponse).length,
    targetRemovedBeforeActing: events.filter((event) => event.targetRemovedBeforeActing).length,
    targetActed: events.filter((event) => event.targetActed).length,
    harmfulResponse: events.filter((event) => event.finalOutcome === "harmful_response").length,
    targetDamagedMaster: events.filter((event) => event.targetDamagedMaster).length,
    targetDamagedOwnMonster: events.filter((event) => event.targetDamagedOwnMonster).length,
    targetKilledOwnMonster: events.filter((event) => event.targetKilledOwnMonster).length,
    targetLeveledUpOnResponse: events.filter((event) => event.targetLeveledUpOnResponse).length,
    focusAlternativeAvailable: focusGaps.length,
    immediateFinishAlternativeAvailable: finishGaps.length,
    averageTargetHpAfter: round(average(events.map((event) => event.targetHpAfter)), 2),
    averageSelectedMinusBestFocus: round(-average(focusGaps), 1),
    averageSelectedMinusImmediateFinish: round(-average(finishGaps), 1),
    byHpAfter: countBy(events, (event) => `HP${event.targetHpAfter}`),
    byDecisionKind: countBy(events, (event) => event.decisionKind),
    byTarget: countBy(events, (event) => event.target),
  };
}

function buildConclusion(events: readonly FrontChipEvent[]): string[] {
  if (events.length === 0) {
    return ["白ミラーの指定条件では、非リーサル前衛削りイベントを採取できなかった。seed範囲を広げて再監査する。"];
  }
  const harmful = events.filter((event) => event.finalOutcome === "harmful_response");
  const converted = events.filter((event) => event.convertedSameTurn);
  const acted = events.filter((event) => event.targetActed);
  const hpOneHarmful = harmful.filter((event) => event.targetHpAfter <= 1);
  const hpTwoPlusHarmful = harmful.filter((event) => event.targetHpAfter >= 2);
  const focusAvailableHarmful = harmful.filter((event) => event.alternatives.bestFocus);
  const finishAvailable = events.filter((event) => event.alternatives.bestImmediateFinish);
  const lines = [
    `非リーサル前衛削りは ${events.length}件。返しで対象が行動したのは ${acted.length}件、明確な被害につながったのは ${harmful.length}件、同ターン中に処理へ変換できたのは ${converted.length}件。`,
    `被害イベントの内訳は、残HP1が ${hpOneHarmful.length}件、残HP2以上が ${hpTwoPlusHarmful.length}件。`,
    `被害イベントのうち、ためる代替が候補にあったものは ${focusAvailableHarmful.length}件。即撃破代替が候補にあった削りは全体で ${finishAvailable.length}件。`,
  ];
  if (harmful.length === 0) {
    lines.push("今回の母数では、非リーサル前衛削りが直接の返し被害になる例は出なかった。係数を増やすより、さらにseedを広げて稀な事故だけを探す段階。");
  } else if (hpTwoPlusHarmful.length >= hpOneHarmful.length) {
    lines.push("次の候補は一律ペナルティではなく、残HP2以上で返しに攻撃可能な前衛を残す局面だけを監査対象にする。");
  } else {
    lines.push("残HP1でも返し被害が出ているため、HPだけでは危険判定に足りない。対象の行動可否・射程・こちらの被撃破価値まで含める必要がある。");
  }
  return lines;
}

function formatMarkdown(report: FrontChipResponseAuditReport): string {
  const samples = [
    ...report.events.filter((event) => event.finalOutcome === "harmful_response"),
    ...report.events.filter((event) => event.convertedSameTurn),
    ...report.events.filter((event) => event.finalOutcome !== "harmful_response" && !event.convertedSameTurn),
  ].slice(0, options.maxSamples);

  return [
    "# White Mirror Front Chip Response Audit",
    "",
    `生成: ${report.generatedAt}`,
    `デッキ: \`${report.deckA}\` vs \`${report.deckB}\``,
    `seed: ${report.seedStart} から各方向最大 ${report.maxSeeds}`,
    `探索: depth ${report.search.sameTurnSearchDepth ?? "-"} / width ${report.search.sameTurnSearchWidth ?? "-"} / terminal ${report.search.sameTurnTerminalPlanDepth ?? 0}x${report.search.sameTurnTerminalPlanWidth ?? 0} weight ${report.search.sameTurnTerminalPlanWeight ?? 0} / opponent ${report.search.sameTurnOpponentTerminalPlanDepth ?? 0}x${report.search.sameTurnOpponentTerminalPlanWidth ?? 0} weight ${report.search.sameTurnOpponentTerminalPlanWeight ?? 0}`,
    "",
    "## Summary",
    "",
    `- games: ${report.summary.games} / completed: ${report.summary.completedGames}`,
    `- events: ${report.summary.events}`,
    `- converted same turn: ${report.summary.convertedSameTurn}`,
    `- target acted on response: ${report.summary.targetActed}`,
    `- harmful response: ${report.summary.harmfulResponse}`,
    `- damaged master: ${report.summary.targetDamagedMaster}`,
    `- damaged own monster: ${report.summary.targetDamagedOwnMonster}`,
    `- killed own monster: ${report.summary.targetKilledOwnMonster}`,
    `- target leveled up on response: ${report.summary.targetLeveledUpOnResponse}`,
    `- focus alternative available: ${report.summary.focusAlternativeAvailable}`,
    `- immediate finish alternative available: ${report.summary.immediateFinishAlternativeAvailable}`,
    `- avg target HP after chip: ${report.summary.averageTargetHpAfter}`,
    `- selected minus best focus avg: ${report.summary.averageSelectedMinusBestFocus}`,
    `- selected minus immediate finish avg: ${report.summary.averageSelectedMinusImmediateFinish}`,
    "",
    "## Buckets",
    "",
    `- by HP after: ${formatCounts(report.summary.byHpAfter)}`,
    `- by decision: ${formatCounts(report.summary.byDecisionKind)}`,
    `- by target: ${formatCounts(report.summary.byTarget)}`,
    "",
    "## Conclusion",
    "",
    ...report.conclusion.map((line) => `- ${line}`),
    "",
    "## Samples",
    "",
    ...formatSamples(samples),
    "",
    "## Reading",
    "",
    "- `converted same turn` は削った対象を相手ターン前に処理できたケース。",
    "- `harmful response` は削った対象が返しにマスター/味方へ被害、撃破、またはレベルアップを発生させたケース。",
    "- `selected minus best focus avg` と `selected minus immediate finish avg` は、選択手が代替候補より何点上だったか。正なら現在AIは削りを上に見ている。",
  ].join("\n");
}

function formatSamples(samples: readonly FrontChipEvent[]): string[] {
  if (samples.length === 0) {
    return ["サンプルなし。"];
  }
  const lines: string[] = [];
  for (const event of samples) {
    lines.push(`### ${event.finalOutcome} / seed ${event.seed} / ${event.direction} / turn ${event.turnNumber}`);
    lines.push("");
    lines.push(`- selected: ${event.decision.label} / score ${event.decision.score}`);
    lines.push(`- target: ${event.target} ${event.targetHpBefore}->${event.targetHpAfter} at ${event.targetSlotKey}`);
    lines.push(`- attacker: ${event.attacker ?? "-"}`);
    lines.push(`- stones: acting ${event.actingPlayerStonesBefore}->${event.actingPlayerStonesAfter}, response ${event.responsePlayerStonesBefore}->${event.responsePlayerStonesAfter}`);
    lines.push(`- alternatives: focus ${formatOptionalDecision(event.alternatives.bestFocus)}, finish ${formatOptionalDecision(event.alternatives.bestImmediateFinish)}, end ${formatOptionalDecision(event.alternatives.endTurn)}`);
    if (event.targetAction) {
      lines.push(`- response action: ${event.targetAction.label}`);
    }
    lines.push(`- flags: acted=${event.targetActed}, masterDamage=${event.targetMasterDamage}, monsterDamage=${event.targetDamagedOwnMonster}, monsterKill=${event.targetKilledOwnMonster}, levelUp=${event.targetLeveledUpOnResponse}, converted=${event.convertedSameTurn}`);
    lines.push(`- state: ${event.stateBefore}`);
    lines.push(`- before: ${event.boardBefore}`);
    lines.push(`- after chip: ${event.boardAfterChip}`);
    if (event.finalBoard) {
      lines.push(`- final: ${event.finalBoard}`);
    }
    lines.push("");
  }
  return lines;
}

function summarizeDecision(state: GameState, decision: CpuDecision, score: number): DecisionSummary {
  return {
    key: decisionKey(decision),
    label: decisionLabel(state, decision),
    score: round(score, 1),
  };
}

function decisionLabel(state: GameState, decision: CpuDecision): string {
  if (decision.type === "attack") {
    const attacker = monsterNameAt(state, decision.action.attackerSlotKey) ?? decision.action.attackerSlotKey;
    return `${attacker} ${decision.action.commandId} -> ${targetLabel(state, decision.action.target)}`;
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

function stateLine(game: GameState): string {
  return [
    `HP P/C ${game.players.player.masterHp}/${game.players.cpu.masterHp}`,
    `stones P/C ${game.players.player.stones}/${game.players.cpu.stones}`,
    `hand P/C ${game.players.player.hand.length}/${game.players.cpu.hand.length}`,
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
    monster.focused ? "focus" : "",
    monster.shielded ? "shield" : "",
    monster.powerUp ? "power" : "",
  ].filter(Boolean).join(",");
  return `${slotKey}:${side}${row}:${getCardName(monster.cardId)} Lv${monster.level} HP${monster.hp} ${status}${flags ? ` ${flags}` : ""}`;
}

function monsterNameAt(game: GameState, slotKey: SlotKey): string | undefined {
  const monster = game.slots[slotKey].monster;
  return monster ? getCardName(monster.cardId) : undefined;
}

function monsterLabel(monster: { cardId: string; level: number }): string {
  return `${getCardName(monster.cardId)} Lv${monster.level}`;
}

function findMonsterSlotByInstanceId(game: GameState, instanceId: string): SlotKey | undefined {
  return SLOT_ORDER.find((slotKey) => game.slots[slotKey].monster?.instanceId === instanceId);
}

function findMonsterByInstanceId(game: GameState, instanceId: string) {
  const slotKey = findMonsterSlotByInstanceId(game, instanceId);
  return slotKey ? game.slots[slotKey].monster : undefined;
}

function countBy<T>(items: readonly T[], keyFor: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFor(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return sortRecord(counts);
}

function sortRecord(record: Record<string, number>): Record<string, number> {
  return Object.fromEntries(Object.entries(record).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

function average(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value: number, digits: number): number {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

function formatOptionalDecision(decision: DecisionSummary | undefined): string {
  return decision ? `${decision.label} (${decision.score})` : "-";
}

function formatCounts(counts: Record<string, number>): string {
  const entries = Object.entries(counts);
  return entries.length > 0 ? entries.map(([key, count]) => `${key}:${count}`).join(", ") : "-";
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = { ...DEFAULT_OPTIONS, search: { ...DEFAULT_OPTIONS.search } };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--deck-a") {
      parsed.deckA = readString(arg, next) as DeckPresetId;
      i += 1;
    } else if (arg === "--deck-b") {
      parsed.deckB = readString(arg, next) as DeckPresetId;
      i += 1;
    } else if (arg === "--seed-start") {
      parsed.seedStart = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-seeds") {
      parsed.maxSeeds = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-events") {
      parsed.maxEvents = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-samples") {
      parsed.maxSamples = readNumber(arg, next);
      i += 1;
    } else if (arg === "--depth") {
      parsed.search.sameTurnSearchDepth = readNumber(arg, next);
      i += 1;
    } else if (arg === "--width") {
      parsed.search.sameTurnSearchWidth = readNumber(arg, next);
      i += 1;
    } else if (arg === "--detailed-width") {
      parsed.search.detailedWidth = readNumber(arg, next);
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
  assertMinimum("--seed-start", parsed.seedStart, 0);
  assertMinimum("--max-seeds", parsed.maxSeeds, 1);
  assertMinimum("--max-events", parsed.maxEvents, 1);
  assertMinimum("--max-steps", parsed.maxSteps, 1);
  assertMinimum("--max-turns", parsed.maxTurns, 1);
  assertMinimum("--max-samples", parsed.maxSamples, 0);
  return parsed;
}

function readNumber(name: string, value: string | undefined): number {
  const number = Number(readString(name, value));
  if (!Number.isInteger(number)) {
    throw new Error(`${name} must be an integer`);
  }
  return number;
}

function readString(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function assertMinimum(name: string, value: number, minimum: number): void {
  if (value < minimum) {
    throw new Error(`${name} must be ${minimum} or greater`);
  }
}

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${content}\n`);
}

function printHelp(): void {
  console.log(`
Usage:
  npm run audit:white-front-chip -- [options]

Options:
  --deck-a <id>          First deck. Default: ${DEFAULT_OPTIONS.deckA}
  --deck-b <id>          Second deck. Default: ${DEFAULT_OPTIONS.deckB}
  --seed-start <n>       First seed. Default: ${DEFAULT_OPTIONS.seedStart}
  --max-seeds <n>        Seeds per direction. Default: ${DEFAULT_OPTIONS.maxSeeds}
  --max-events <n>       Stop after this many chip events. Default: ${DEFAULT_OPTIONS.maxEvents}
  --depth <n>            sameTurnSearchDepth. Default: ${DEFAULT_OPTIONS.search.sameTurnSearchDepth}
  --width <n>            sameTurnSearchWidth. Default: ${DEFAULT_OPTIONS.search.sameTurnSearchWidth}
  --detailed-width <n>   detailedWidth. Default: ${DEFAULT_OPTIONS.search.detailedWidth}
  --markdown <path>      Write Markdown report.
  --json <path>          Write JSON report.
`);
}
