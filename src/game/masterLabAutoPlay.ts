import {
  applyCpuDecision,
  chooseCpuDecision,
  inspectCpuDecisionEvaluations,
  type CpuAiProfile,
  type CpuAiProfiles,
  type CpuDecision,
} from "./cpuAi";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, type DeckPresetId } from "./deckPresets";
import {
  chooseMasterLabAction,
  inspectMasterLabActionEvaluations,
  playMasterLabAction,
  type MasterLabActionEvaluation,
  type MasterLabCandidateId,
  type MasterLabEvaluationTuning,
} from "./masterLab";
import { createInitialGame, runAutoStep, targetToKey } from "./rules";
import type { GameState, MasterId, PlayerId, SlotKey, Target } from "./types";

export type MasterLabParticipantId = MasterId | MasterLabCandidateId;
export type MasterLabIssueKind = "exception" | "unresolved_level_up" | "stagnation" | "step_limit" | "turn_limit" | "long_game";
export type MasterLabIssueSeverity = "failure" | "warning";
export type MasterLabDecisionSource = "cpu" | "master_lab";

export interface MasterLabAutoPlayOptions {
  seedStart?: number;
  seedEnd?: number;
  count?: number;
  deckPreset?: "random" | DeckPresetId;
  participants?: Partial<Record<PlayerId, MasterLabParticipantId>>;
  maxSteps?: number;
  maxTurns?: number;
  stagnationLimit?: number;
  longGameSteps?: number;
  longGameTurns?: number;
  historyLimit?: number;
  failOnWarnings?: boolean;
  aiProfile?: CpuAiProfile;
  aiProfiles?: Partial<CpuAiProfiles>;
  labActionMargin?: number;
  labEvaluationTuning?: MasterLabEvaluationTuning;
  includeGameHistory?: boolean;
}

type ResolvedMasterLabAutoPlayOptions = Required<
  Omit<MasterLabAutoPlayOptions, "seedEnd" | "failOnWarnings" | "participants" | "aiProfiles">
> & {
  seedEnd: number;
  failOnWarnings: boolean;
  participants: Record<PlayerId, MasterLabParticipantId>;
  aiProfiles: CpuAiProfiles;
};

export interface MasterLabDecisionEvent {
  seed: number;
  step: number;
  turnNumber: number;
  player: PlayerId;
  source: MasterLabDecisionSource;
  decision: string;
  reason: string;
  score: number;
  legalDecisionCount: number;
  labDecisionCount: number;
  before: MasterLabGameStateSummary;
  after: MasterLabGameStateSummary;
  newLog: string[];
}

export interface MasterLabGameStateSummary {
  currentPlayer: PlayerId;
  turnNumber: number;
  winner?: PlayerId;
  pendingLevelUp?: boolean;
  players: Record<PlayerId, {
    participant: MasterLabParticipantId;
    baseMasterId: MasterId;
    hp: number;
    stones: number;
    hand: number;
    deck: number;
    discard: number;
  }>;
  slots: Array<{
    slotKey: SlotKey;
    card?: string;
    owner?: PlayerId;
    hp?: number;
    level?: number;
    status?: string;
    scapegoat?: boolean;
    provokeTargetSlotKey?: SlotKey;
  }>;
}

export interface MasterLabIssue {
  kind: MasterLabIssueKind;
  severity: MasterLabIssueSeverity;
  seed: number;
  step: number;
  turnNumber: number;
  message: string;
  logTail: string[];
  stateSummary: MasterLabGameStateSummary;
  history: MasterLabDecisionEvent[];
}

export interface MasterLabGameResult {
  seed: number;
  steps: number;
  turns: number;
  winner?: PlayerId;
  issueCount: number;
  warningCount: number;
  labDecisionCount: number;
  labActionUsage: Record<string, number>;
  labActionTargetUsage: Record<string, number>;
  logTail?: string[];
  stateSummary?: MasterLabGameStateSummary;
  history?: MasterLabDecisionEvent[];
}

export interface MasterLabAutoPlayResult {
  ok: boolean;
  seeds: number[];
  options: ResolvedMasterLabAutoPlayOptions;
  games: MasterLabGameResult[];
  issues: MasterLabIssue[];
  summary: {
    games: number;
    winners: Record<PlayerId, number>;
    undecided: number;
    failures: number;
    warnings: number;
    maxSteps: number;
    maxTurns: number;
    labDecisionCount: number;
    labActionUsage: Record<string, number>;
    labActionTargetUsage: Record<string, number>;
  };
}

interface MasterLabRunContext {
  seed: number;
  options: ResolvedMasterLabAutoPlayOptions;
  history: MasterLabDecisionEvent[];
  issues: MasterLabIssue[];
}

type SelectedDecision =
  | { source: "cpu"; decision: CpuDecision; score: number; legalDecisionCount: number; labDecisionCount: number; reason: string }
  | { source: "master_lab"; evaluation: MasterLabActionEvaluation; score: number; legalDecisionCount: number; labDecisionCount: number; reason: string };

const DEFAULT_OPTIONS = {
  seedStart: 900,
  count: 20,
  maxSteps: 650,
  maxTurns: 140,
  stagnationLimit: 8,
  longGameSteps: 320,
  longGameTurns: 90,
  historyLimit: 40,
  failOnWarnings: false,
  includeGameHistory: false,
  deckPreset: "random" as const,
  participants: { player: "decoy", cpu: "black" } satisfies Record<PlayerId, MasterLabParticipantId>,
  aiProfile: "stable" as const satisfies CpuAiProfile,
  labActionMargin: 0,
  labEvaluationTuning: {} satisfies MasterLabEvaluationTuning,
};

export function validateMasterLabAutoPlay(options: MasterLabAutoPlayOptions = {}): MasterLabAutoPlayResult {
  const resolved = resolveOptions(options);
  const seeds = Array.from(
    { length: resolved.seedEnd - resolved.seedStart + 1 },
    (_, index) => resolved.seedStart + index,
  );
  const games: MasterLabGameResult[] = [];
  const issues: MasterLabIssue[] = [];

  for (const seed of seeds) {
    const game = runMasterLabAutoPlayGame(seed, resolved);
    games.push(game.result);
    issues.push(...game.issues);
  }

  const warnings = issues.filter((issue) => issue.severity === "warning").length;
  const failures = issues.filter((issue) => issue.severity === "failure").length;
  const winners: Record<PlayerId, number> = { player: 0, cpu: 0 };
  for (const game of games) {
    if (game.winner) {
      winners[game.winner] += 1;
    }
  }

  return {
    ok: failures === 0 && (!resolved.failOnWarnings || warnings === 0),
    seeds,
    options: resolved,
    games,
    issues,
    summary: {
      games: games.length,
      winners,
      undecided: games.filter((game) => !game.winner).length,
      failures,
      warnings,
      maxSteps: Math.max(0, ...games.map((game) => game.steps)),
      maxTurns: Math.max(0, ...games.map((game) => game.turns)),
      labDecisionCount: games.reduce((total, game) => total + game.labDecisionCount, 0),
      labActionUsage: mergeUsage(games.map((game) => game.labActionUsage)),
      labActionTargetUsage: mergeUsage(games.map((game) => game.labActionTargetUsage)),
    },
  };
}

export function formatMasterLabAutoPlaySummary(result: MasterLabAutoPlayResult): string {
  const lines = [
    `Master Lab auto play: ${result.ok ? "PASS" : "FAIL"}`,
    `Seeds: ${result.options.seedStart}-${result.options.seedEnd} (${result.summary.games} games)`,
    `Deck preset: ${result.options.deckPreset}`,
    `Participants: player ${result.options.participants.player}, cpu ${result.options.participants.cpu}`,
    `Base masters: player ${baseMasterFor(result.options.participants.player)}, cpu ${baseMasterFor(result.options.participants.cpu)}`,
    `AI profiles: player ${result.options.aiProfiles.player}, cpu ${result.options.aiProfiles.cpu}`,
    `Winners: player ${result.summary.winners.player}, cpu ${result.summary.winners.cpu}, undecided ${result.summary.undecided}`,
    `Max: ${result.summary.maxSteps} steps / ${result.summary.maxTurns} turns`,
    `Master Lab decisions: ${result.summary.labDecisionCount}`,
    `Master Lab action usage: ${formatUsage(result.summary.labActionUsage)}`,
    `Master Lab target usage: ${formatUsage(result.summary.labActionTargetUsage)}`,
    `Issues: ${result.summary.failures} failures, ${result.summary.warnings} warnings`,
  ];

  const issueSamples = result.issues.slice(0, 8);
  if (issueSamples.length > 0) {
    lines.push("Issue samples:");
    for (const issue of issueSamples) {
      lines.push(`- [${issue.severity}] seed ${issue.seed} step ${issue.step} turn ${issue.turnNumber}: ${issue.message}`);
    }
  }

  return lines.join("\n");
}

function resolveOptions(options: MasterLabAutoPlayOptions): ResolvedMasterLabAutoPlayOptions {
  const seedStart = integerOption(options.seedStart, DEFAULT_OPTIONS.seedStart);
  const count = integerOption(options.count, DEFAULT_OPTIONS.count);
  const seedEnd = integerOption(options.seedEnd, seedStart + count - 1);
  const fallbackAiProfile = options.aiProfile ?? DEFAULT_OPTIONS.aiProfile;
  if (seedEnd < seedStart) {
    throw new Error("seedEnd must be greater than or equal to seedStart");
  }

  return {
    seedStart,
    seedEnd,
    count: seedEnd - seedStart + 1,
    maxSteps: integerOption(options.maxSteps, DEFAULT_OPTIONS.maxSteps),
    maxTurns: integerOption(options.maxTurns, DEFAULT_OPTIONS.maxTurns),
    stagnationLimit: integerOption(options.stagnationLimit, DEFAULT_OPTIONS.stagnationLimit),
    longGameSteps: integerOption(options.longGameSteps, DEFAULT_OPTIONS.longGameSteps),
    longGameTurns: integerOption(options.longGameTurns, DEFAULT_OPTIONS.longGameTurns),
    historyLimit: integerOption(options.historyLimit, DEFAULT_OPTIONS.historyLimit),
    failOnWarnings: options.failOnWarnings ?? DEFAULT_OPTIONS.failOnWarnings,
    includeGameHistory: options.includeGameHistory ?? DEFAULT_OPTIONS.includeGameHistory,
    deckPreset: options.deckPreset ?? DEFAULT_OPTIONS.deckPreset,
    aiProfile: fallbackAiProfile,
    aiProfiles: {
      player: options.aiProfiles?.player ?? fallbackAiProfile,
      cpu: options.aiProfiles?.cpu ?? fallbackAiProfile,
    },
    participants: {
      player: options.participants?.player ?? DEFAULT_OPTIONS.participants.player,
      cpu: options.participants?.cpu ?? DEFAULT_OPTIONS.participants.cpu,
    },
    labActionMargin: options.labActionMargin ?? DEFAULT_OPTIONS.labActionMargin,
    labEvaluationTuning: options.labEvaluationTuning ?? DEFAULT_OPTIONS.labEvaluationTuning,
  };
}

function runMasterLabAutoPlayGame(
  seed: number,
  options: ResolvedMasterLabAutoPlayOptions,
): { result: MasterLabGameResult; issues: MasterLabIssue[] } {
  const context: MasterLabRunContext = { seed, options, history: [], issues: [] };
  let game = createMasterLabInitialGame(seed, options);
  let repeatedSignatureCount = 0;
  let previousSignature = progressSignature(game);
  let step = 0;
  const labActionUsage: Record<string, number> = {};
  const labActionTargetUsage: Record<string, number> = {};

  try {
    for (; step < options.maxSteps && !game.winner; step += 1) {
      if (game.turnNumber > options.maxTurns) {
        pushIssue(context, "turn_limit", "failure", game, step, `turn ${game.turnNumber} exceeded limit ${options.maxTurns}`);
        break;
      }

      if (game.pendingLevelUp) {
        game = runAutoStep(game, { profiles: options.aiProfiles });
        if (game.pendingLevelUp) {
          pushIssue(context, "unresolved_level_up", "failure", game, step, "level-up prompt remained after auto resolution");
          break;
        }
      } else {
        const transition = runMasterLabDecisionStep(game, step, context);
        game = transition.next;
        if (transition.source === "master_lab") {
          labActionUsage[transition.actionId] = (labActionUsage[transition.actionId] ?? 0) + 1;
          labActionTargetUsage[transition.targetUsageKey] = (labActionTargetUsage[transition.targetUsageKey] ?? 0) + 1;
        }
      }

      const nextSignature = progressSignature(game);
      repeatedSignatureCount = nextSignature === previousSignature ? repeatedSignatureCount + 1 : 0;
      previousSignature = nextSignature;
      if (repeatedSignatureCount >= options.stagnationLimit) {
        pushIssue(context, "stagnation", "failure", game, step, `same progress signature repeated ${repeatedSignatureCount} times`);
        break;
      }
    }
  } catch (error) {
    pushIssue(context, "exception", "failure", game, step, error instanceof Error ? error.message : String(error));
  }

  if (!game.winner && !context.issues.some((issue) => issue.severity === "failure")) {
    pushIssue(context, "step_limit", "failure", game, step, `winner was not decided within ${options.maxSteps} auto steps`);
  }

  if (game.winner && (step >= options.longGameSteps || game.turnNumber >= options.longGameTurns)) {
    pushIssue(context, "long_game", "warning", game, step, `long game finished after ${step} steps / ${game.turnNumber} turns`);
  }

  const issueCount = context.issues.filter((issue) => issue.severity === "failure").length;
  const warningCount = context.issues.filter((issue) => issue.severity === "warning").length;

  return {
    result: {
      seed,
      steps: step,
      turns: game.turnNumber,
      winner: game.winner,
      issueCount,
      warningCount,
      labDecisionCount: Object.values(labActionUsage).reduce((total, count) => total + count, 0),
      labActionUsage,
      labActionTargetUsage,
      ...(options.includeGameHistory
        ? {
            logTail: game.log.slice(-20),
            stateSummary: summarizeMasterLabGameState(game, options.participants),
            history: [...context.history],
          }
        : {}),
    },
    issues: context.issues,
  };
}

function runMasterLabDecisionStep(
  game: GameState,
  step: number,
  context: MasterLabRunContext,
): { next: GameState; source: "cpu" } | { next: GameState; source: "master_lab"; actionId: string; targetUsageKey: string } {
  const selected = chooseMixedDecision(game, context.options);
  const beforeSummary = summarizeMasterLabGameState(game, context.options.participants);
  const logBefore = game.log;
  const next = selected.source === "master_lab"
    ? playMasterLabAction(game, selected.evaluation.option)
    : applyCpuDecision(game, selected.decision);
  const event: MasterLabDecisionEvent = {
    seed: context.seed,
    step,
    turnNumber: game.turnNumber,
    player: game.currentPlayer,
    source: selected.source,
    decision: selected.source === "master_lab"
      ? `master_lab:${selected.evaluation.option.actionId}->${targetToKey(selected.evaluation.option.target)}`
      : decisionToText(selected.decision),
    reason: selected.reason,
    score: selected.score,
    legalDecisionCount: selected.legalDecisionCount,
    labDecisionCount: selected.labDecisionCount,
    before: beforeSummary,
    after: summarizeMasterLabGameState(next, context.options.participants),
    newLog: newLogEntries(logBefore, next.log),
  };
  pushHistory(context, event, context.options.historyLimit);
  if (selected.source === "master_lab") {
    const option = selected.evaluation.option;
    return {
      next,
      source: "master_lab",
      actionId: option.actionId,
      targetUsageKey: labActionTargetUsageKey(game, option.actionId, option.target),
    };
  }
  return { next, source: "cpu" };
}

function labActionTargetUsageKey(game: GameState, actionId: string, target: Target): string {
  if (target.kind === "master") {
    return `${actionId}:${target.playerId === game.currentPlayer ? "ally" : "enemy"}`;
  }
  const owner = game.slots[target.slotKey].monster?.owner;
  if (!owner) {
    return `${actionId}:none`;
  }
  return `${actionId}:${owner === game.currentPlayer ? "ally" : "enemy"}`;
}

function chooseMixedDecision(game: GameState, options: ResolvedMasterLabAutoPlayOptions): SelectedDecision {
  const participant = options.participants[game.currentPlayer];
  const profileOptions = { profiles: options.aiProfiles };
  if (!isMasterLabCandidateId(participant)) {
    const decision = chooseCpuDecision(game, profileOptions);
    return {
      source: "cpu",
      decision,
      score: decision.score,
      legalDecisionCount: 0,
      labDecisionCount: 0,
      reason: decision.reason,
    };
  }

  const cpuEvaluations = inspectCpuDecisionEvaluations(game, profileOptions).filter((evaluation) =>
    allowsCpuDecisionForLabSeat(evaluation.decision),
  );
  const bestCpu = cpuEvaluations.sort((a, b) => b.totalScore - a.totalScore || b.decision.score - a.decision.score)[0];
  const labEvaluations = inspectMasterLabActionEvaluations(game, participant, game.currentPlayer, options.labEvaluationTuning)
    .sort((a, b) => b.totalScore - a.totalScore || a.option.summary.localeCompare(b.option.summary));
  const bestLab = labEvaluations[0] ?? chooseMasterLabAction(game, participant, game.currentPlayer, options.labEvaluationTuning);

  if (bestLab && (!bestCpu || bestLab.totalScore >= bestCpu.totalScore + options.labActionMargin)) {
    return {
      source: "master_lab",
      evaluation: bestLab,
      score: bestLab.totalScore,
      legalDecisionCount: cpuEvaluations.length,
      labDecisionCount: labEvaluations.length,
      reason: bestLab.reason,
    };
  }

  const decision = bestCpu?.decision ?? chooseCpuDecision(game, profileOptions);
  return {
    source: "cpu",
    decision,
    score: bestCpu?.totalScore ?? decision.score,
    legalDecisionCount: cpuEvaluations.length,
    labDecisionCount: labEvaluations.length,
    reason: decision.reason,
  };
}

function createMasterLabInitialGame(seed: number, options: ResolvedMasterLabAutoPlayOptions): GameState {
  const masterIds = {
    player: baseMasterFor(options.participants.player),
    cpu: baseMasterFor(options.participants.cpu),
  } satisfies Record<PlayerId, MasterId>;

  if (options.deckPreset === "random") {
    return createInitialGame(seed, { masterIds });
  }
  const cardIds = buildDeckPresetCardIds(options.deckPreset);
  const allowSpecial = deckPresetAllowsSpecial(options.deckPreset);
  return createInitialGame(seed, {
    masterIds,
    playerDeckCardIds: cardIds,
    cpuDeckCardIds: cardIds,
    allowSpecialDecks: { player: allowSpecial, cpu: allowSpecial },
  });
}

function baseMasterFor(participant: MasterLabParticipantId): MasterId {
  return isMasterLabCandidateId(participant) ? "white" : participant;
}

function isMasterLabCandidateId(participant: MasterLabParticipantId): participant is MasterLabCandidateId {
  return participant === "decoy" || participant === "sacrifice" || participant === "timing";
}

function allowsCpuDecisionForLabSeat(decision: CpuDecision): boolean {
  return decision.type !== "master_action" || decision.actionId === "master_attack";
}

function integerOption(value: number | undefined, fallback: number): number {
  return Number.isInteger(value) && value !== undefined ? value : fallback;
}

function pushHistory(context: MasterLabRunContext, event: MasterLabDecisionEvent, limit: number): void {
  context.history.push(event);
  if (context.history.length > limit) {
    context.history = context.history.slice(-limit);
  }
}

function pushIssue(
  context: MasterLabRunContext,
  kind: MasterLabIssueKind,
  severity: MasterLabIssueSeverity,
  game: GameState,
  step: number,
  message: string,
): void {
  context.issues.push({
    kind,
    severity,
    seed: context.seed,
    step,
    turnNumber: game.turnNumber,
    message,
    logTail: game.log.slice(-30),
    stateSummary: summarizeMasterLabGameState(game, context.options.participants),
    history: structuredClone(context.history) as MasterLabDecisionEvent[],
  });
}

function summarizeMasterLabGameState(
  game: GameState,
  participants: Record<PlayerId, MasterLabParticipantId>,
): MasterLabGameStateSummary {
  return {
    currentPlayer: game.currentPlayer,
    turnNumber: game.turnNumber,
    winner: game.winner,
    pendingLevelUp: !!game.pendingLevelUp,
    players: {
      player: summarizePlayer(game, participants, "player"),
      cpu: summarizePlayer(game, participants, "cpu"),
    },
    slots: Object.entries(game.slots).map(([slotKey, slot]) => {
      const monster = slot.monster;
      return {
        slotKey: slotKey as SlotKey,
        card: monster?.cardId,
        owner: monster?.owner,
        hp: monster?.hp,
        level: monster?.level,
        status: monster?.status,
        scapegoat: monster?.scapegoat,
        provokeTargetSlotKey: monster?.provokeTargetSlotKey,
      };
    }),
  };
}

function summarizePlayer(
  game: GameState,
  participants: Record<PlayerId, MasterLabParticipantId>,
  playerId: PlayerId,
): MasterLabGameStateSummary["players"][PlayerId] {
  const player = game.players[playerId];
  return {
    participant: participants[playerId],
    baseMasterId: player.masterId,
    hp: player.masterHp,
    stones: player.stones,
    hand: player.hand.length,
    deck: player.deck.length,
    discard: player.discard.length,
  };
}

function decisionToText(decision: CpuDecision): string {
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

function progressSignature(game: GameState): string {
  return JSON.stringify({
    currentPlayer: game.currentPlayer,
    turnNumber: game.turnNumber,
    winner: game.winner,
    pendingLevelUp: game.pendingLevelUp,
    player: progressPlayerSignature(game, "player"),
    cpu: progressPlayerSignature(game, "cpu"),
    slots: Object.entries(game.slots).map(([slotKey, slot]) => [
      slotKey,
      slot.monster
        ? {
            id: slot.monster.instanceId,
            cardId: slot.monster.cardId,
            owner: slot.monster.owner,
            hp: slot.monster.hp,
            level: slot.monster.level,
            status: slot.monster.status,
            actionCount: slot.monster.actionCount,
            actionLimit: slot.monster.actionLimit,
            focused: slot.monster.focused,
            shielded: slot.monster.shielded,
            powerUp: slot.monster.powerUp,
            scapegoat: slot.monster.scapegoat,
            provokeTargetSlotKey: slot.monster.provokeTargetSlotKey,
          }
        : null,
    ]),
  });
}

function progressPlayerSignature(game: GameState, playerId: PlayerId): object {
  const player = game.players[playerId];
  return {
    hp: player.masterHp,
    stones: player.stones,
    hand: player.hand.length,
    deck: player.deck.length,
    discard: player.discard.length,
  };
}

function newLogEntries(before: string[], after: string[]): string[] {
  const maxOverlap = Math.min(before.length, after.length);
  for (let overlap = maxOverlap; overlap > 0; overlap -= 1) {
    const beforeStart = before.length - overlap;
    const beforeSuffix = before.slice(beforeStart);
    const afterPrefix = after.slice(0, overlap);
    if (beforeSuffix.every((entry, index) => entry === afterPrefix[index])) {
      return after.slice(overlap);
    }
  }
  return after;
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

function formatUsage(usage: Record<string, number>): string {
  const entries = Object.entries(usage).sort(([a], [b]) => a.localeCompare(b));
  return entries.length > 0 ? entries.map(([actionId, count]) => `${actionId} ${count}`).join(", ") : "none";
}
