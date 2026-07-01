import {
  applyCpuDecision,
  chooseCpuDecision,
  inspectCpuDecisionEvaluations,
  type CpuAiOptions,
  type CpuDecision,
  type CpuDecisionEvaluation,
} from "../src/game/cpuAi";
import { getCardName } from "../src/game/cards";
import {
  CURRENT_WHITE_AI_BLACK_1375_PRESSURE_OPPONENT,
  CURRENT_WHITE_AI_BLACK_PRESSURE_STRONG_OPPONENT,
  CURRENT_WHITE_AI_MIRROR_OPPONENT,
  createCurrentWhiteAiVariant,
} from "../src/game/currentWhiteAiFixtures";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial } from "../src/game/deckPresets";
import { createInitialGame, opponentOf, runAutoStep, targetToKey } from "../src/game/rules";
import type { WhiteAiTuningOpponent, WhiteAiTuningVariant } from "../src/game/whiteAiTuningLoop";
import { escapeMarkdownTableCell, formatPercent, readInteger, readString, round, writeReport } from "./lib/cli";
import type { GameState, MasterId, PlayerId, SlotKey, Target } from "../src/game/types";

type MatrixClass = "ignored_both" | "deterrent" | "anomaly" | "absorbed";
type CandidateSeatOption = PlayerId | "both";

interface CliOptions {
  variantIds: readonly string[];
  opponentIds: readonly string[];
  candidateSeat: CandidateSeatOption;
  gamesPerMatchup: number;
  seedStart: number;
  maxSteps: number;
  maxTurns: number;
  maxOwnActionsAfterShield: number;
  maxOpponentActions: number;
  maxShieldEventsPerGame: number;
  maxShieldEventsPerAudit: number;
  maxSamples: number;
  markdownPath: string;
  jsonPath: string;
}

interface ShieldBranchHandoff {
  state: GameState;
  ownActions: readonly string[];
  truncated: boolean;
}

interface ResponseResult {
  targetPresentAtHandoff: boolean;
  targetPresentAfterResponse: boolean;
  targetRemovedDuringResponse: boolean;
  targetDamagedDuringResponse: boolean;
  targetContacted: boolean;
  masterDamageTaken: number;
  actions: readonly string[];
  contactActions: readonly string[];
  truncated: boolean;
  finalState: string;
  finalBoard: string;
}

interface ShieldMatrixEvent {
  variantId: string;
  opponentId: string;
  candidateSeat: PlayerId;
  seed: number;
  step: number;
  turnNumber: number;
  shieldScore: number;
  shieldReason: string;
  targetSlotKey: SlotKey;
  targetCardName: string;
  targetHp: number;
  targetLevel: number;
  targetFocused: boolean;
  targetShieldedBefore: boolean;
  ownStonesBefore: number;
  ownHpBefore: number;
  enemyHpBefore: number;
  matrixClass: MatrixClass;
  withShieldOwnBranchTruncated: boolean;
  noShieldOwnBranchTruncated: boolean;
  withShieldOwnActions: readonly string[];
  noShieldOwnActions: readonly string[];
  withShieldResponse: ResponseResult;
  noShieldResponse: ResponseResult;
  boardBefore: string;
  stateBefore: string;
}

interface ShieldMatrixMetrics {
  games: number;
  shieldEvents: number;
  ignoredBoth: number;
  deterrent: number;
  anomaly: number;
  absorbed: number;
  withShieldContacts: number;
  noShieldContacts: number;
  withShieldTargetRemoved: number;
  noShieldTargetRemoved: number;
  shieldSavedTarget: number;
  withShieldMasterDamageMore: number;
  withShieldMasterDamageLess: number;
  noShieldTargetMissingAtHandoff: number;
  withShieldTargetMissingAtHandoff: number;
  ownBranchTruncated: number;
  responseTruncated: number;
}

interface ShieldMatrixAudit {
  variantId: string;
  opponentId: string;
  candidateSeat: PlayerId;
  seedStart: number;
  games: number;
  metrics: ShieldMatrixMetrics;
  samples: readonly ShieldMatrixEvent[];
}

interface ShieldMatrixReport {
  generatedAt: string;
  options: CliOptions;
  audits: readonly ShieldMatrixAudit[];
  totals: ShieldMatrixMetrics;
  conclusion: readonly string[];
}

const DEFAULT_MARKDOWN_PATH = "docs/master_lab/results/2026-07-01_white_shield_response_matrix_audit.md";
const DEFAULT_JSON_PATH = "docs/master_lab/results/2026-07-01_white_shield_response_matrix_audit.json";

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

const AVAILABLE_VARIANTS: readonly WhiteAiTuningVariant[] = [
  createCurrentWhiteAiVariant(
    "current_white_baseline",
    "現行白AI",
    undefined,
    "現行の白AI・暫定白最強デッキを、そのまま盾応答分岐監査にかける。",
  ),
];

const AVAILABLE_OPPONENTS: readonly WhiteAiTuningOpponent[] = [
  CURRENT_WHITE_AI_MIRROR_OPPONENT,
  CURRENT_WHITE_AI_BLACK_PRESSURE_STRONG_OPPONENT,
  CURRENT_WHITE_AI_BLACK_1375_PRESSURE_OPPONENT,
];

const options = parseArgs(process.argv.slice(2));
const report = runAudit(options);
const markdown = formatMarkdown(report);
await writeReport(options.markdownPath, markdown);
await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
console.log(markdown);

function runAudit(options: CliOptions): ShieldMatrixReport {
  const variants = selectVariants(options.variantIds);
  const opponents = selectOpponents(options.opponentIds);
  const seats = candidateSeats(options.candidateSeat);
  const audits: ShieldMatrixAudit[] = [];

  for (const variant of variants) {
    for (const opponent of opponents) {
      for (const candidateSeat of seats) {
        audits.push(runMatchupAudit(variant, opponent, candidateSeat, options));
      }
    }
  }

  const totals = mergeMetrics(audits.map((audit) => audit.metrics));
  return {
    generatedAt: new Date().toISOString(),
    options,
    audits,
    totals,
    conclusion: buildConclusion(totals, audits),
  };
}

function runMatchupAudit(
  variant: WhiteAiTuningVariant,
  opponent: WhiteAiTuningOpponent,
  candidateSeat: PlayerId,
  options: CliOptions,
): ShieldMatrixAudit {
  const metrics = createMetrics(0);
  const samples: ShieldMatrixEvent[] = [];
  const opponentMasterId = playableMasterId(opponent);
  const seedOffset = candidateSeat === "player" ? 0 : options.gamesPerMatchup;

  for (
    let gameIndex = 0;
    gameIndex < options.gamesPerMatchup && metrics.shieldEvents < options.maxShieldEventsPerAudit;
    gameIndex += 1
  ) {
    const seed = options.seedStart + seedOffset + gameIndex;
    let game = createGame(seed, variant, opponent, opponentMasterId, candidateSeat);
    const aiOptions = aiOptionsFor(variant, opponent, candidateSeat);
    let gameShieldEvents = 0;
    metrics.games += 1;

    for (let step = 0; step < options.maxSteps && !game.winner; step += 1) {
      if (game.turnNumber > options.maxTurns) {
        break;
      }
      if (game.pendingLevelUp) {
        game = runAutoStep(game, aiOptions);
        continue;
      }

      const decision = chooseCpuDecision(game, aiOptions);
      if (
        isCandidateShieldDecision(game, decision, candidateSeat) &&
        gameShieldEvents < options.maxShieldEventsPerGame &&
        metrics.shieldEvents < options.maxShieldEventsPerAudit
      ) {
        const event = auditShieldDecision(game, decision, variant.id, opponent.id, candidateSeat, seed, step, options, aiOptions);
        gameShieldEvents += 1;
        collectMetrics(metrics, event);
        if (samples.length < options.maxSamples || shouldKeepSample(event)) {
          samples.push(event);
        }
      }

      game = applyAndResolvePending(game, decision, aiOptions);
    }
  }

  return {
    variantId: variant.id,
    opponentId: opponent.id,
    candidateSeat,
    seedStart: options.seedStart + seedOffset,
    games: metrics.games,
    metrics,
    samples: prioritizeSamples(samples, options.maxSamples),
  };
}

function auditShieldDecision(
  game: GameState,
  decision: CpuDecision,
  variantId: string,
  opponentId: string,
  candidateSeat: PlayerId,
  seed: number,
  step: number,
  options: CliOptions,
  aiOptions: CpuAiOptions,
): ShieldMatrixEvent {
  if (decision.type !== "master_action" || decision.actionId !== "shield" || decision.target.kind !== "monster") {
    throw new Error("shield decision expected");
  }
  const targetSlotKey = decision.target.slotKey;
  const target = game.slots[targetSlotKey].monster;
  if (!target) {
    throw new Error("shield target monster expected");
  }
  const targetInstanceId = target.instanceId;
  const withShieldStart = applyAndResolvePending(game, decision, aiOptions);
  const withShieldHandoff = continueToOpponentTurn(withShieldStart, candidateSeat, aiOptions, undefined, options.maxOwnActionsAfterShield);
  const noShieldHandoff = continueToOpponentTurn(game, candidateSeat, aiOptions, targetInstanceId, options.maxOwnActionsAfterShield);
  const withShieldResponse = simulateOpponentResponse(
    withShieldHandoff.state,
    candidateSeat,
    aiOptions,
    targetInstanceId,
    options.maxOpponentActions,
  );
  const noShieldResponse = simulateOpponentResponse(
    noShieldHandoff.state,
    candidateSeat,
    aiOptions,
    targetInstanceId,
    options.maxOpponentActions,
  );
  const matrixClass = classifyResponse(noShieldResponse.targetContacted, withShieldResponse.targetContacted);

  return {
    variantId,
    opponentId,
    candidateSeat,
    seed,
    step,
    turnNumber: game.turnNumber,
    shieldScore: round(decision.score, 1),
    shieldReason: decision.reason,
    targetSlotKey,
    targetCardName: getCardName(target.cardId),
    targetHp: target.hp,
    targetLevel: target.level,
    targetFocused: target.focused,
    targetShieldedBefore: target.shielded,
    ownStonesBefore: game.players[candidateSeat].stones,
    ownHpBefore: game.players[candidateSeat].masterHp,
    enemyHpBefore: game.players[opponentOf(candidateSeat)].masterHp,
    matrixClass,
    withShieldOwnBranchTruncated: withShieldHandoff.truncated,
    noShieldOwnBranchTruncated: noShieldHandoff.truncated,
    withShieldOwnActions: withShieldHandoff.ownActions,
    noShieldOwnActions: noShieldHandoff.ownActions,
    withShieldResponse,
    noShieldResponse,
    boardBefore: formatBoard(game),
    stateBefore: formatStateLine(game, candidateSeat),
  };
}

function continueToOpponentTurn(
  start: GameState,
  perspective: PlayerId,
  aiOptions: CpuAiOptions,
  noShieldInstanceId: string | undefined,
  maxActions: number,
): ShieldBranchHandoff {
  let current = start;
  const ownActions: string[] = [];

  for (let actions = 0; actions < maxActions; actions += 1) {
    if (current.winner) {
      return { state: current, ownActions, truncated: false };
    }
    if (current.pendingLevelUp) {
      current = runAutoStep(current, aiOptions);
      continue;
    }
    if (current.currentPlayer !== perspective) {
      return { state: current, ownActions, truncated: false };
    }

    const nextDecision = noShieldInstanceId
      ? chooseDecisionExcludingShieldToInstance(current, aiOptions, noShieldInstanceId)
      : chooseCpuDecision(current, aiOptions);
    ownActions.push(decisionToText(current, nextDecision));
    current = applyAndResolvePending(current, nextDecision, aiOptions);
    if (nextDecision.type === "end_turn" || current.currentPlayer !== perspective) {
      return { state: current, ownActions, truncated: false };
    }
  }

  return { state: current, ownActions, truncated: true };
}

function simulateOpponentResponse(
  start: GameState,
  perspective: PlayerId,
  aiOptions: CpuAiOptions,
  targetInstanceId: string,
  maxActions: number,
): ResponseResult {
  let current = start;
  const opponent = opponentOf(perspective);
  const actions: string[] = [];
  const contactActions: string[] = [];
  let targetDamagedDuringResponse = false;
  let targetRemovedDuringResponse = false;
  let targetContacted = false;
  let masterDamageTaken = 0;
  const targetPresentAtHandoff = !!findMonsterByInstance(current, targetInstanceId);

  for (let actionIndex = 0; actionIndex < maxActions; actionIndex += 1) {
    if (current.winner) {
      return buildResponseResult(
        current,
        perspective,
        targetInstanceId,
        targetPresentAtHandoff,
        targetRemovedDuringResponse,
        targetDamagedDuringResponse,
        targetContacted,
        masterDamageTaken,
        actions,
        contactActions,
        false,
      );
    }
    if (current.pendingLevelUp) {
      current = runAutoStep(current, aiOptions);
      continue;
    }
    if (current.currentPlayer !== opponent) {
      return buildResponseResult(
        current,
        perspective,
        targetInstanceId,
        targetPresentAtHandoff,
        targetRemovedDuringResponse,
        targetDamagedDuringResponse,
        targetContacted,
        masterDamageTaken,
        actions,
        contactActions,
        false,
      );
    }

    const before = current;
    const decision = chooseCpuDecision(current, aiOptions);
    const text = decisionToText(before, decision);
    const targeted = decisionTargetsInstance(before, decision, targetInstanceId);
    current = applyAndResolvePending(current, decision, aiOptions);
    const contact = targetContactBetween(before, current, targetInstanceId);
    const contactedByAction = targeted || contact.damaged || contact.removed;
    actions.push(text);
    if (contactedByAction) {
      contactActions.push(text);
      targetContacted = true;
    }
    if (contact.damaged) {
      targetDamagedDuringResponse = true;
    }
    if (contact.removed) {
      targetRemovedDuringResponse = true;
    }
    masterDamageTaken += Math.max(0, before.players[perspective].masterHp - current.players[perspective].masterHp);

    if (decision.type === "end_turn" || current.currentPlayer !== opponent) {
      return buildResponseResult(
        current,
        perspective,
        targetInstanceId,
        targetPresentAtHandoff,
        targetRemovedDuringResponse,
        targetDamagedDuringResponse,
        targetContacted,
        masterDamageTaken,
        actions,
        contactActions,
        false,
      );
    }
  }

  return buildResponseResult(
    current,
    perspective,
    targetInstanceId,
    targetPresentAtHandoff,
    targetRemovedDuringResponse,
    targetDamagedDuringResponse,
    targetContacted,
    masterDamageTaken,
    actions,
    contactActions,
    true,
  );
}

function buildResponseResult(
  current: GameState,
  perspective: PlayerId,
  targetInstanceId: string,
  targetPresentAtHandoff: boolean,
  targetRemovedDuringResponse: boolean,
  targetDamagedDuringResponse: boolean,
  targetContacted: boolean,
  masterDamageTaken: number,
  actions: readonly string[],
  contactActions: readonly string[],
  truncated: boolean,
): ResponseResult {
  return {
    targetPresentAtHandoff,
    targetPresentAfterResponse: !!findMonsterByInstance(current, targetInstanceId),
    targetRemovedDuringResponse,
    targetDamagedDuringResponse,
    targetContacted,
    masterDamageTaken,
    actions,
    contactActions,
    truncated,
    finalState: formatStateLine(current, perspective),
    finalBoard: formatBoard(current),
  };
}

function chooseDecisionExcludingShieldToInstance(
  state: GameState,
  aiOptions: CpuAiOptions,
  targetInstanceId: string,
): CpuDecision {
  const evaluations = inspectCpuDecisionEvaluations(state, aiOptions)
    .filter((evaluation) => !isShieldDecisionToInstance(state, evaluation.decision, targetInstanceId))
    .sort(compareEvaluations);
  return evaluations[0]?.decision ?? {
    type: "end_turn",
    reason: "監査分岐: 対象へのシールドを除外",
    score: 0,
  };
}

function compareEvaluations(a: CpuDecisionEvaluation, b: CpuDecisionEvaluation): number {
  return b.totalScore - a.totalScore || a.index - b.index;
}

function applyAndResolvePending(state: GameState, decision: CpuDecision, aiOptions: CpuAiOptions): GameState {
  let current = applyCpuDecision(state, decision);
  for (let guard = 0; guard < 8 && current.pendingLevelUp && !current.winner; guard += 1) {
    current = runAutoStep(current, aiOptions);
  }
  return current;
}

function isCandidateShieldDecision(state: GameState, decision: CpuDecision, candidateSeat: PlayerId): boolean {
  return (
    state.currentPlayer === candidateSeat &&
    state.players[candidateSeat].masterId === "white" &&
    decision.type === "master_action" &&
    decision.actionId === "shield" &&
    decision.target.kind === "monster" &&
    state.slots[decision.target.slotKey].monster?.owner === candidateSeat
  );
}

function isShieldDecisionToInstance(state: GameState, decision: CpuDecision, targetInstanceId: string): boolean {
  return (
    decision.type === "master_action" &&
    decision.actionId === "shield" &&
    decision.target.kind === "monster" &&
    state.slots[decision.target.slotKey].monster?.instanceId === targetInstanceId
  );
}

function decisionTargetsInstance(state: GameState, decision: CpuDecision, targetInstanceId: string): boolean {
  const targets = decisionTargets(decision);
  return targets.some(
    (target) => target.kind === "monster" && state.slots[target.slotKey].monster?.instanceId === targetInstanceId,
  );
}

function decisionTargets(decision: CpuDecision): Target[] {
  if (decision.type === "attack") {
    return [decision.action.target, decision.action.secondaryTarget].filter((target): target is Target => !!target);
  }
  if (decision.type === "master_action") {
    return [decision.target];
  }
  if (decision.type === "magic") {
    return [decision.action.target, decision.action.secondaryTarget].filter((target): target is Target => !!target);
  }
  return [];
}

function targetContactBetween(before: GameState, after: GameState, targetInstanceId: string): { damaged: boolean; removed: boolean } {
  const beforeMonster = findMonsterByInstance(before, targetInstanceId);
  const afterMonster = findMonsterByInstance(after, targetInstanceId);
  return {
    damaged: !!beforeMonster && !!afterMonster && afterMonster.hp < beforeMonster.hp,
    removed: !!beforeMonster && !afterMonster,
  };
}

function findMonsterByInstance(state: GameState, targetInstanceId: string) {
  for (const slotKey of SLOT_ORDER) {
    const monster = state.slots[slotKey].monster;
    if (monster?.instanceId === targetInstanceId) {
      return {
        slotKey,
        hp: monster.hp,
        shielded: monster.shielded,
        focused: monster.focused,
        level: monster.level,
        cardName: getCardName(monster.cardId),
      };
    }
  }
  return undefined;
}

function classifyResponse(noShieldContacted: boolean, withShieldContacted: boolean): MatrixClass {
  if (!noShieldContacted && !withShieldContacted) {
    return "ignored_both";
  }
  if (noShieldContacted && !withShieldContacted) {
    return "deterrent";
  }
  if (!noShieldContacted && withShieldContacted) {
    return "anomaly";
  }
  return "absorbed";
}

function collectMetrics(metrics: ShieldMatrixMetrics, event: ShieldMatrixEvent): void {
  metrics.shieldEvents += 1;
  if (event.matrixClass === "ignored_both") metrics.ignoredBoth += 1;
  if (event.matrixClass === "deterrent") metrics.deterrent += 1;
  if (event.matrixClass === "anomaly") metrics.anomaly += 1;
  if (event.matrixClass === "absorbed") metrics.absorbed += 1;
  if (event.withShieldResponse.targetContacted) metrics.withShieldContacts += 1;
  if (event.noShieldResponse.targetContacted) metrics.noShieldContacts += 1;
  if (event.withShieldResponse.targetRemovedDuringResponse) metrics.withShieldTargetRemoved += 1;
  if (event.noShieldResponse.targetRemovedDuringResponse) metrics.noShieldTargetRemoved += 1;
  if (event.noShieldResponse.targetRemovedDuringResponse && event.withShieldResponse.targetPresentAfterResponse) {
    metrics.shieldSavedTarget += 1;
  }
  if (event.withShieldResponse.masterDamageTaken > event.noShieldResponse.masterDamageTaken) {
    metrics.withShieldMasterDamageMore += 1;
  }
  if (event.withShieldResponse.masterDamageTaken < event.noShieldResponse.masterDamageTaken) {
    metrics.withShieldMasterDamageLess += 1;
  }
  if (!event.noShieldResponse.targetPresentAtHandoff) metrics.noShieldTargetMissingAtHandoff += 1;
  if (!event.withShieldResponse.targetPresentAtHandoff) metrics.withShieldTargetMissingAtHandoff += 1;
  if (event.withShieldOwnBranchTruncated || event.noShieldOwnBranchTruncated) {
    metrics.ownBranchTruncated += 1;
  }
  if (event.withShieldResponse.truncated || event.noShieldResponse.truncated) {
    metrics.responseTruncated += 1;
  }
}

function createMetrics(games: number): ShieldMatrixMetrics {
  return {
    games,
    shieldEvents: 0,
    ignoredBoth: 0,
    deterrent: 0,
    anomaly: 0,
    absorbed: 0,
    withShieldContacts: 0,
    noShieldContacts: 0,
    withShieldTargetRemoved: 0,
    noShieldTargetRemoved: 0,
    shieldSavedTarget: 0,
    withShieldMasterDamageMore: 0,
    withShieldMasterDamageLess: 0,
    noShieldTargetMissingAtHandoff: 0,
    withShieldTargetMissingAtHandoff: 0,
    ownBranchTruncated: 0,
    responseTruncated: 0,
  };
}

function mergeMetrics(metricsList: readonly ShieldMatrixMetrics[]): ShieldMatrixMetrics {
  const merged = createMetrics(0);
  for (const metrics of metricsList) {
    merged.games += metrics.games;
    merged.shieldEvents += metrics.shieldEvents;
    merged.ignoredBoth += metrics.ignoredBoth;
    merged.deterrent += metrics.deterrent;
    merged.anomaly += metrics.anomaly;
    merged.absorbed += metrics.absorbed;
    merged.withShieldContacts += metrics.withShieldContacts;
    merged.noShieldContacts += metrics.noShieldContacts;
    merged.withShieldTargetRemoved += metrics.withShieldTargetRemoved;
    merged.noShieldTargetRemoved += metrics.noShieldTargetRemoved;
    merged.shieldSavedTarget += metrics.shieldSavedTarget;
    merged.withShieldMasterDamageMore += metrics.withShieldMasterDamageMore;
    merged.withShieldMasterDamageLess += metrics.withShieldMasterDamageLess;
    merged.noShieldTargetMissingAtHandoff += metrics.noShieldTargetMissingAtHandoff;
    merged.withShieldTargetMissingAtHandoff += metrics.withShieldTargetMissingAtHandoff;
    merged.ownBranchTruncated += metrics.ownBranchTruncated;
    merged.responseTruncated += metrics.responseTruncated;
  }
  return merged;
}

function shouldKeepSample(event: ShieldMatrixEvent): boolean {
  return (
    event.matrixClass === "ignored_both" ||
    event.matrixClass === "anomaly" ||
    event.withShieldResponse.masterDamageTaken > event.noShieldResponse.masterDamageTaken ||
    (event.matrixClass === "absorbed" && event.withShieldResponse.targetRemovedDuringResponse)
  );
}

function prioritizeSamples(samples: readonly ShieldMatrixEvent[], maxSamples: number): readonly ShieldMatrixEvent[] {
  return [...samples].sort(samplePriority).slice(0, maxSamples);
}

function samplePriority(a: ShieldMatrixEvent, b: ShieldMatrixEvent): number {
  return sampleScore(b) - sampleScore(a) || a.seed - b.seed || a.step - b.step;
}

function sampleScore(event: ShieldMatrixEvent): number {
  let score = 0;
  if (event.matrixClass === "ignored_both") score += 100;
  if (event.matrixClass === "anomaly") score += 90;
  if (event.withShieldResponse.masterDamageTaken > event.noShieldResponse.masterDamageTaken) score += 70;
  if (event.matrixClass === "absorbed" && event.withShieldResponse.targetRemovedDuringResponse) score += 50;
  if (event.matrixClass === "deterrent") score += 30;
  return score;
}

function createGame(
  seed: number,
  variant: WhiteAiTuningVariant,
  opponent: WhiteAiTuningOpponent,
  opponentMasterId: MasterId,
  candidateSeat: PlayerId,
): GameState {
  const opponentSeat = opponentOf(candidateSeat);
  const masterIds = {
    [candidateSeat]: "white",
    [opponentSeat]: opponentMasterId,
  } as Record<PlayerId, MasterId>;
  const playerDeckId = candidateSeat === "player" ? variant.deckPreset : opponent.deckPreset;
  const cpuDeckId = candidateSeat === "cpu" ? variant.deckPreset : opponent.deckPreset;

  return createInitialGame(seed, {
    masterIds,
    playerDeckCardIds: buildDeckPresetCardIds(playerDeckId),
    cpuDeckCardIds: buildDeckPresetCardIds(cpuDeckId),
    allowSpecialDecks: {
      player: deckPresetAllowsSpecial(playerDeckId),
      cpu: deckPresetAllowsSpecial(cpuDeckId),
    },
  });
}

function aiOptionsFor(
  variant: WhiteAiTuningVariant,
  opponent: WhiteAiTuningOpponent,
  candidateSeat: PlayerId,
): CpuAiOptions {
  const opponentSeat = opponentOf(candidateSeat);
  return {
    profiles: {
      [candidateSeat]: variant.aiProfile,
      [opponentSeat]: opponent.aiProfile,
    },
    ...(variant.search ? { searches: { [candidateSeat]: variant.search } } : {}),
    ...(variant.tuning ? { tunings: { [candidateSeat]: variant.tuning } } : {}),
  };
}

function playableMasterId(opponent: WhiteAiTuningOpponent): MasterId {
  if (opponent.participant === "white" || opponent.participant === "black") {
    return opponent.participant;
  }
  throw new Error(`${opponent.id} is not supported by this state-branch audit. Use a white/black opponent.`);
}

function selectVariants(ids: readonly string[]): readonly WhiteAiTuningVariant[] {
  return ids.map((id) => {
    const variant = AVAILABLE_VARIANTS.find((candidate) => candidate.id === id);
    if (!variant) {
      throw new Error(`Unknown variant: ${id}`);
    }
    return variant;
  });
}

function selectOpponents(ids: readonly string[]): readonly WhiteAiTuningOpponent[] {
  return ids.map((id) => {
    const opponent = AVAILABLE_OPPONENTS.find((candidate) => candidate.id === id);
    if (!opponent) {
      throw new Error(`Unknown opponent: ${id}`);
    }
    return opponent;
  });
}

function candidateSeats(option: CandidateSeatOption): readonly PlayerId[] {
  if (option === "both") {
    return ["player", "cpu"];
  }
  return [option];
}

function formatMarkdown(report: ShieldMatrixReport): string {
  const lines: string[] = [];
  lines.push("# White Shield Response Matrix Audit");
  lines.push("");
  lines.push(`- generatedAt: ${report.generatedAt}`);
  lines.push(`- gamesPerMatchup: ${report.options.gamesPerMatchup}`);
  lines.push(`- seedStart: ${report.options.seedStart}`);
  lines.push(`- maxSteps/maxTurns: ${report.options.maxSteps}/${report.options.maxTurns}`);
  lines.push(`- maxOwnActionsAfterShield/maxOpponentActions: ${report.options.maxOwnActionsAfterShield}/${report.options.maxOpponentActions}`);
  lines.push(`- maxShieldEventsPerGame/maxShieldEventsPerAudit: ${report.options.maxShieldEventsPerGame}/${report.options.maxShieldEventsPerAudit}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(formatMetricsBullets(report.totals));
  lines.push("");
  lines.push("## Matchups");
  lines.push("");
  lines.push("| variant | opponent | seat | games | shield | ignored_both | deterrent | anomaly | absorbed | with contact | no contact | saved | face worse |");
  lines.push("|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
  for (const audit of report.audits) {
    const m = audit.metrics;
    lines.push(
      [
        escapeMarkdownTableCell(audit.variantId),
        escapeMarkdownTableCell(audit.opponentId),
        audit.candidateSeat,
        `${audit.games}`,
        `${m.shieldEvents}`,
        countWithRate(m.ignoredBoth, m.shieldEvents),
        countWithRate(m.deterrent, m.shieldEvents),
        countWithRate(m.anomaly, m.shieldEvents),
        countWithRate(m.absorbed, m.shieldEvents),
        countWithRate(m.withShieldContacts, m.shieldEvents),
        countWithRate(m.noShieldContacts, m.shieldEvents),
        countWithRate(m.shieldSavedTarget, m.shieldEvents),
        countWithRate(m.withShieldMasterDamageMore, m.shieldEvents),
      ].join(" | ").replace(/^/, "| ").replace(/$/, " |"),
    );
  }
  lines.push("");
  lines.push("## Reading");
  lines.push("");
  for (const conclusion of report.conclusion) {
    lines.push(`- ${conclusion}`);
  }
  lines.push("");
  lines.push("## Samples");
  for (const audit of report.audits) {
    if (audit.samples.length === 0) {
      continue;
    }
    lines.push("");
    lines.push(`### ${audit.variantId} vs ${audit.opponentId} (${audit.candidateSeat})`);
    lines.push("");
    lines.push("| class | seed/turn/step | target | state | no-shield response | with-shield response | branch actions | board |");
    lines.push("|---|---|---|---|---|---|---|---|");
    for (const sample of audit.samples) {
      const noResponse = formatResponseCell(sample.noShieldResponse);
      const withResponse = formatResponseCell(sample.withShieldResponse);
      const branches = [
        `no: ${sample.noShieldOwnActions.join("<br>") || "(none)"}`,
        `with: ${sample.withShieldOwnActions.join("<br>") || "(none)"}`,
      ].join("<br>");
      lines.push(
        [
          sample.matrixClass,
          `${sample.seed}/T${sample.turnNumber}/S${sample.step}`,
          `${sample.targetCardName} ${sample.targetSlotKey} HP${sample.targetHp} Lv${sample.targetLevel}${sample.targetFocused ? " 気合" : ""}`,
          sample.stateBefore,
          noResponse,
          withResponse,
          branches,
          sample.boardBefore,
        ].map(escapeMarkdownTableCell).join(" | ").replace(/^/, "| ").replace(/$/, " |"),
      );
    }
  }
  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push("- `ignored_both`: 盾なしでも盾ありでも相手が対象に触らない。現状の第一改善候補。");
  lines.push("- `deterrent`: 盾なしなら対象に触るが、盾ありなら触らない。価値はあるが、顔面へ逃がしていないかを見る。");
  lines.push("- `absorbed`: 盾ありでも相手が対象に触る。攻撃を使わせているので基本は良いが、1接触で除去される場合は過信を疑う。");
  lines.push("- `anomaly`: 盾なしでは触られないのに盾ありでは触られる。分岐の行動順差や対象価値の逆転を優先確認する。");
  return lines.join("\n");
}

function formatMetricsBullets(metrics: ShieldMatrixMetrics): string {
  return [
    `- shield events: ${metrics.shieldEvents}`,
    `- ignored_both: ${countWithRate(metrics.ignoredBoth, metrics.shieldEvents)}`,
    `- deterrent: ${countWithRate(metrics.deterrent, metrics.shieldEvents)}`,
    `- anomaly: ${countWithRate(metrics.anomaly, metrics.shieldEvents)}`,
    `- absorbed: ${countWithRate(metrics.absorbed, metrics.shieldEvents)}`,
    `- no-shield contact: ${countWithRate(metrics.noShieldContacts, metrics.shieldEvents)}`,
    `- with-shield contact: ${countWithRate(metrics.withShieldContacts, metrics.shieldEvents)}`,
    `- shield saved target: ${countWithRate(metrics.shieldSavedTarget, metrics.shieldEvents)}`,
    `- with-shield face damage worse: ${countWithRate(metrics.withShieldMasterDamageMore, metrics.shieldEvents)}`,
    `- branch truncation: own ${metrics.ownBranchTruncated}, response ${metrics.responseTruncated}`,
  ].join("\n");
}

function formatResponseCell(response: ResponseResult): string {
  const contact = response.targetContacted ? "contact" : "no contact";
  const removed = response.targetRemovedDuringResponse ? "removed" : response.targetPresentAfterResponse ? "survive" : "missing";
  const actions = response.actions.length > 0 ? response.actions.join("<br>") : "(none)";
  return `${contact}/${removed}/face ${response.masterDamageTaken}<br>${actions}`;
}

function buildConclusion(metrics: ShieldMatrixMetrics, audits: readonly ShieldMatrixAudit[]): readonly string[] {
  if (metrics.shieldEvents === 0) {
    return ["監査対象のシールド判断が発生しなかった。seed数か相手を増やして再実行する。"];
  }
  const conclusions: string[] = [];
  const ignoredRate = rate(metrics.ignoredBoth, metrics.shieldEvents);
  const deterrentRate = rate(metrics.deterrent, metrics.shieldEvents);
  const absorbedRate = rate(metrics.absorbed, metrics.shieldEvents);
  const faceWorseRate = rate(metrics.withShieldMasterDamageMore, metrics.shieldEvents);
  conclusions.push(
    `盾応答の内訳は ignored_both ${formatPercent(ignoredRate)} / deterrent ${formatPercent(deterrentRate)} / absorbed ${formatPercent(absorbedRate)}。`,
  );
  if (ignoredRate >= 0.25) {
    conclusions.push("まずは `ignored_both` を優先監査する。相手がそもそも殴らない対象への盾なので、候補化前の threat/target-quality gate に戻す価値が高い。");
  } else {
    conclusions.push("無仕事盾はかなり抑えられている。次は deterrent が顔面被弾増に変換されていないかを見る段階。");
  }
  if (faceWorseRate >= 0.15) {
    conclusions.push(`盾後の相手応答で顔面被ダメが増えるケースが ${formatPercent(faceWorseRate)} ある。対象を守る価値だけでなく「守ったせいで相手攻撃がマスターへ逃げる」評価が必要。`);
  }
  const worstAudit = audits
    .filter((audit) => audit.metrics.shieldEvents > 0)
    .sort((a, b) => rate(b.metrics.ignoredBoth, b.metrics.shieldEvents) - rate(a.metrics.ignoredBoth, a.metrics.shieldEvents))[0];
  if (worstAudit) {
    conclusions.push(
      `最も ignored_both が濃い組み合わせは ${worstAudit.variantId} vs ${worstAudit.opponentId} (${worstAudit.candidateSeat}) の ${formatPercent(rate(worstAudit.metrics.ignoredBoth, worstAudit.metrics.shieldEvents))}。`,
    );
  }
  return conclusions;
}

function formatStateLine(game: GameState, perspective: PlayerId): string {
  const enemy = opponentOf(perspective);
  return [
    `turn ${game.turnNumber}`,
    `${perspective} HP${game.players[perspective].masterHp}/S${game.players[perspective].stones}`,
    `${enemy} HP${game.players[enemy].masterHp}/S${game.players[enemy].stones}`,
    `current ${game.currentPlayer}`,
  ].join(" ");
}

function formatBoard(game: GameState): string {
  return SLOT_ORDER.map((slotKey) => {
    const monster = game.slots[slotKey].monster;
    if (!monster) {
      return `${slotKey}:empty`;
    }
    const flags = [
      monster.status === "active" ? "A" : "P",
      monster.focused ? "F" : "",
      monster.shielded ? "S" : "",
      monster.commandSealed ? "Seal" : "",
    ].filter(Boolean);
    return `${slotKey}:${getCardName(monster.cardId)} HP${monster.hp} Lv${monster.level} ${flags.join("/")}`;
  }).join("<br>");
}

function decisionToText(state: GameState, decision: CpuDecision): string {
  if (decision.type === "attack") {
    return `attack:${decision.action.attackerSlotKey}:${decision.action.commandId}->${targetToKey(decision.action.target)}`;
  }
  if (decision.type === "master_action") {
    return `master:${decision.actionId}->${targetToKey(decision.target)}`;
  }
  if (decision.type === "summon") {
    return `summon:${handCardName(state, decision.handInstanceId)}->${decision.slotKey}`;
  }
  if (decision.type === "magic") {
    return `magic:${handCardName(state, decision.action.handInstanceId)}->${targetToKey(decision.action.target)}`;
  }
  if (decision.type === "move") {
    return `move:${decision.fromSlotKey}->${decision.toSlotKey}`;
  }
  if (decision.type === "focus") {
    return `focus:${decision.slotKey}`;
  }
  return "end_turn";
}

function handCardName(state: GameState, handInstanceId: string): string {
  const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === handInstanceId);
  return card ? getCardName(card.cardId) : handInstanceId;
}

function countWithRate(count: number, total: number): string {
  return `${count}<br>${formatPercent(rate(count, total))}`;
}

function rate(count: number, total: number): number {
  return total > 0 ? count / total : 0;
}

function parseArgs(args: readonly string[]): CliOptions {
  const variantIds: string[] = [];
  const opponentIds: string[] = [];
  let candidateSeat: CandidateSeatOption = "both";
  let gamesPerMatchup = 6;
  let seedStart = 931000;
  let maxSteps = 700;
  let maxTurns = 140;
  let maxOwnActionsAfterShield = 12;
  let maxOpponentActions = 12;
  let maxShieldEventsPerGame = 10;
  let maxShieldEventsPerAudit = 40;
  let maxSamples = 48;
  let markdownPath = DEFAULT_MARKDOWN_PATH;
  let jsonPath = DEFAULT_JSON_PATH;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--variant") {
      variantIds.push(readString(arg, args[++i]));
    } else if (arg === "--opponent") {
      opponentIds.push(readString(arg, args[++i]));
    } else if (arg === "--candidate-seat") {
      candidateSeat = readCandidateSeat(readString(arg, args[++i]));
    } else if (arg === "--games-per-matchup") {
      gamesPerMatchup = readInteger(arg, args[++i]);
    } else if (arg === "--seed-start") {
      seedStart = readInteger(arg, args[++i]);
    } else if (arg === "--max-steps") {
      maxSteps = readInteger(arg, args[++i]);
    } else if (arg === "--max-turns") {
      maxTurns = readInteger(arg, args[++i]);
    } else if (arg === "--max-own-actions-after-shield") {
      maxOwnActionsAfterShield = readInteger(arg, args[++i]);
    } else if (arg === "--max-opponent-actions") {
      maxOpponentActions = readInteger(arg, args[++i]);
    } else if (arg === "--max-shield-events-per-game") {
      maxShieldEventsPerGame = readInteger(arg, args[++i]);
    } else if (arg === "--max-shield-events-per-audit") {
      maxShieldEventsPerAudit = readInteger(arg, args[++i]);
    } else if (arg === "--max-samples") {
      maxSamples = readInteger(arg, args[++i]);
    } else if (arg === "--markdown") {
      markdownPath = readString(arg, args[++i]);
    } else if (arg === "--json") {
      jsonPath = readString(arg, args[++i]);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return {
    variantIds: variantIds.length > 0 ? variantIds : ["current_white_baseline"],
    opponentIds: opponentIds.length > 0 ? opponentIds : [CURRENT_WHITE_AI_MIRROR_OPPONENT.id],
    candidateSeat,
    gamesPerMatchup,
    seedStart,
    maxSteps,
    maxTurns,
    maxOwnActionsAfterShield,
    maxOpponentActions,
    maxShieldEventsPerGame,
    maxShieldEventsPerAudit,
    maxSamples,
    markdownPath,
    jsonPath,
  };
}

function readCandidateSeat(value: string): CandidateSeatOption {
  if (value === "player" || value === "cpu" || value === "both") {
    return value;
  }
  throw new Error("--candidate-seat must be player, cpu, or both");
}
