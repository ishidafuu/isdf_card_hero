import { getCardName } from "./cards";
import {
  applyCpuDecision,
  chooseCpuDecision,
  listCpuDecisions,
  type CpuAiProfile,
  type CpuAiProfiles,
  type CpuDecision,
} from "./cpuAi";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, type DeckPresetId } from "./deckPresets";
import { createInitialGame, runAutoStep, targetToKey } from "./rules";
import type { GameState, MasterId, PlayerId, SlotKey } from "./types";

export type AutoPlayIssueKind =
  | "exception"
  | "unresolved_level_up"
  | "stagnation"
  | "step_limit"
  | "turn_limit"
  | "long_game"
  | "suspicious_decision";

export type AutoPlayIssueSeverity = "failure" | "warning";

export interface AutoPlayValidationOptions {
  seedStart?: number;
  seedEnd?: number;
  count?: number;
  deckPreset?: "random" | DeckPresetId;
  masterIds?: Partial<Record<PlayerId, MasterId>>;
  maxSteps?: number;
  maxTurns?: number;
  stagnationLimit?: number;
  longGameSteps?: number;
  longGameTurns?: number;
  historyLimit?: number;
  failOnWarnings?: boolean;
  aiProfile?: CpuAiProfile;
  aiProfiles?: Partial<CpuAiProfiles>;
}

type ResolvedAutoPlayValidationOptions = Required<
  Omit<AutoPlayValidationOptions, "seedEnd" | "failOnWarnings" | "masterIds" | "aiProfiles">
> & {
  seedEnd: number;
  failOnWarnings: boolean;
  masterIds: Record<PlayerId, MasterId>;
  aiProfiles: CpuAiProfiles;
};

export interface AutoPlayDecisionEvent {
  seed: number;
  step: number;
  turnNumber: number;
  player: PlayerId;
  decision: string;
  reason: string;
  score: number;
  legalDecisionCount: number;
  nonEndDecisionCount: number;
  before: GameStateSummary;
  after: GameStateSummary;
  newLog: string[];
}

export interface GameStateSummary {
  currentPlayer: PlayerId;
  turnNumber: number;
  winner?: PlayerId;
  pendingLevelUp?: boolean;
  players: Record<PlayerId, {
    masterId: MasterId;
    hp: number;
    stones: number;
    hand: number;
    deck: number;
    discard: number;
  }>;
  slots: Array<{
    slotKey: SlotKey;
    card?: string;
    name?: string;
    owner?: PlayerId;
    hp?: number;
    level?: number;
    status?: string;
    actions?: string;
    focused?: boolean;
    berserkPower?: boolean;
    shielded?: boolean;
  }>;
}

export interface AutoPlayIssue {
  kind: AutoPlayIssueKind;
  severity: AutoPlayIssueSeverity;
  seed: number;
  step: number;
  turnNumber: number;
  message: string;
  logTail: string[];
  state: GameState;
  stateSummary: GameStateSummary;
  history: AutoPlayDecisionEvent[];
}

export interface AutoPlayGameResult {
  seed: number;
  steps: number;
  turns: number;
  winner?: PlayerId;
  issueCount: number;
  warningCount: number;
}

export interface AutoPlayValidationResult {
  ok: boolean;
  seeds: number[];
  options: ResolvedAutoPlayValidationOptions;
  games: AutoPlayGameResult[];
  issues: AutoPlayIssue[];
  summary: {
    games: number;
    winners: Record<PlayerId, number>;
    failures: number;
    warnings: number;
    maxSteps: number;
    maxTurns: number;
  };
}

interface RunContext {
  seed: number;
  history: AutoPlayDecisionEvent[];
  issues: AutoPlayIssue[];
  moveCountsByTurn: Map<string, number>;
}

const DEFAULT_OPTIONS = {
  seedStart: 400,
  count: 100,
  maxSteps: 500,
  maxTurns: 120,
  stagnationLimit: 8,
  longGameSteps: 300,
  longGameTurns: 80,
  historyLimit: 30,
  failOnWarnings: false,
  deckPreset: "random" as const,
  masterIds: { player: "white", cpu: "white" } satisfies Record<PlayerId, MasterId>,
  aiProfile: "stable" as const satisfies CpuAiProfile,
};

export function validateAutoPlay(options: AutoPlayValidationOptions = {}): AutoPlayValidationResult {
  const resolved = resolveOptions(options);
  const seeds = Array.from(
    { length: resolved.seedEnd - resolved.seedStart + 1 },
    (_, index) => resolved.seedStart + index,
  );
  const games: AutoPlayGameResult[] = [];
  const issues: AutoPlayIssue[] = [];

  for (const seed of seeds) {
    const gameResult = runAutoPlayGame(seed, resolved);
    games.push(gameResult.result);
    issues.push(...gameResult.issues);
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
      failures,
      warnings,
      maxSteps: Math.max(0, ...games.map((game) => game.steps)),
      maxTurns: Math.max(0, ...games.map((game) => game.turns)),
    },
  };
}

export function formatAutoPlayValidationSummary(result: AutoPlayValidationResult): string {
  const lines = [
    `Auto play validation: ${result.ok ? "PASS" : "FAIL"}`,
    `Seeds: ${result.options.seedStart}-${result.options.seedEnd} (${result.summary.games} games)`,
    `Deck preset: ${result.options.deckPreset}`,
    `Masters: player ${result.options.masterIds.player}, cpu ${result.options.masterIds.cpu}`,
    `AI profiles: player ${result.options.aiProfiles.player}, cpu ${result.options.aiProfiles.cpu}`,
    `Winners: player ${result.summary.winners.player}, cpu ${result.summary.winners.cpu}`,
    `Max: ${result.summary.maxSteps} steps / ${result.summary.maxTurns} turns`,
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

function resolveOptions(options: AutoPlayValidationOptions): AutoPlayValidationResult["options"] {
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
    deckPreset: options.deckPreset ?? DEFAULT_OPTIONS.deckPreset,
    aiProfile: fallbackAiProfile,
    aiProfiles: {
      player: options.aiProfiles?.player ?? fallbackAiProfile,
      cpu: options.aiProfiles?.cpu ?? fallbackAiProfile,
    },
    masterIds: {
      player: options.masterIds?.player ?? DEFAULT_OPTIONS.masterIds.player,
      cpu: options.masterIds?.cpu ?? DEFAULT_OPTIONS.masterIds.cpu,
    },
  };
}

function integerOption(value: number | undefined, fallback: number): number {
  return Number.isInteger(value) && value !== undefined ? value : fallback;
}

function runAutoPlayGame(
  seed: number,
  options: AutoPlayValidationResult["options"],
): { result: AutoPlayGameResult; issues: AutoPlayIssue[] } {
  const context: RunContext = {
    seed,
    history: [],
    issues: [],
    moveCountsByTurn: new Map(),
  };
  let game = createAutoPlayInitialGame(seed, options.deckPreset, options.masterIds);
  let repeatedSignatureCount = 0;
  let previousSignature = progressSignature(game);
  let step = 0;

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
        game = runDecisionStepWithTrace(game, step, options, context);
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
    pushIssue(
      context,
      "long_game",
      "warning",
      game,
      step,
      `long game finished after ${step} steps / ${game.turnNumber} turns`,
    );
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
    },
    issues: context.issues,
  };
}

function createAutoPlayInitialGame(
  seed: number,
  deckPreset: AutoPlayValidationResult["options"]["deckPreset"],
  masterIds: Record<PlayerId, MasterId>,
): GameState {
  if (deckPreset === "random") {
    return createInitialGame(seed, { masterIds });
  }
  const cardIds = buildDeckPresetCardIds(deckPreset);
  const allowSpecial = deckPresetAllowsSpecial(deckPreset);
  return createInitialGame(seed, {
    masterIds,
    playerDeckCardIds: cardIds,
    cpuDeckCardIds: cardIds,
    allowSpecialDecks: { player: allowSpecial, cpu: allowSpecial },
  });
}

function runDecisionStepWithTrace(
  game: GameState,
  step: number,
  options: AutoPlayValidationResult["options"],
  context: RunContext,
): GameState {
  const decisions = listCpuDecisions(game);
  const decision = chooseCpuDecision(game, { profiles: options.aiProfiles });
  const beforeSummary = summarizeGameState(game);
  const logBefore = game.log;
  const next = applyCpuDecision(game, decision);
  const event: AutoPlayDecisionEvent = {
    seed: context.seed,
    step,
    turnNumber: game.turnNumber,
    player: game.currentPlayer,
    decision: decisionToText(decision),
    reason: decision.reason,
    score: decision.score,
    legalDecisionCount: decisions.length,
    nonEndDecisionCount: decisions.filter((candidate) => candidate.type !== "end_turn").length,
    before: beforeSummary,
    after: summarizeGameState(next),
    newLog: newLogEntries(logBefore, next.log),
  };
  pushHistory(context, event, options.historyLimit);
  detectSuspiciousDecision(context, game, next, decision, decisions, step);
  return next;
}

function detectSuspiciousDecision(
  context: RunContext,
  before: GameState,
  after: GameState,
  decision: CpuDecision,
  decisions: CpuDecision[],
  step: number,
): void {
  if (decision.type === "end_turn" && !after.winner) {
    const strongCandidate = decisions.find((candidate) => candidate.type !== "end_turn" && candidate.score >= 200);
    if (strongCandidate) {
      pushIssue(
        context,
        "suspicious_decision",
        "warning",
        after,
        step,
        `ended turn despite strong candidate: ${decisionToText(strongCandidate)}`,
      );
    }
  }

  if (decision.type === "move") {
    const key = `${before.currentPlayer}:${before.turnNumber}`;
    const moveCount = (context.moveCountsByTurn.get(key) ?? 0) + 1;
    context.moveCountsByTurn.set(key, moveCount);
    if (moveCount >= 3) {
      pushIssue(
        context,
        "suspicious_decision",
        "warning",
        after,
        step,
        `${before.currentPlayer} selected ${moveCount} moves in the same turn`,
      );
    }
  }

  if (decision.type === "magic" && decision.score < 10 && !after.winner) {
    pushIssue(
      context,
      "suspicious_decision",
      "warning",
      after,
      step,
      `low-score magic selected: ${decision.reason} (score ${decision.score})`,
    );
  }
}

function pushHistory(context: RunContext, event: AutoPlayDecisionEvent, limit: number): void {
  context.history.push(event);
  if (context.history.length > limit) {
    context.history = context.history.slice(-limit);
  }
}

function pushIssue(
  context: RunContext,
  kind: AutoPlayIssueKind,
  severity: AutoPlayIssueSeverity,
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
    state: structuredClone(game) as GameState,
    stateSummary: summarizeGameState(game),
    history: structuredClone(context.history) as AutoPlayDecisionEvent[],
  });
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

export function summarizeGameState(game: GameState): GameStateSummary {
  return {
    currentPlayer: game.currentPlayer,
    turnNumber: game.turnNumber,
    winner: game.winner,
    pendingLevelUp: !!game.pendingLevelUp,
    players: {
      player: summarizePlayer(game, "player"),
      cpu: summarizePlayer(game, "cpu"),
    },
    slots: Object.entries(game.slots).map(([slotKey, slot]) => {
      const monster = slot.monster;
      return {
        slotKey: slotKey as SlotKey,
        card: monster?.cardId,
        name: monster ? getCardName(monster.cardId) : undefined,
        owner: monster?.owner,
        hp: monster?.hp,
        level: monster?.level,
        status: monster?.status,
        actions: monster ? `${monster.actionCount}/${monster.actionLimit}` : undefined,
        focused: monster?.focused,
        berserkPower: monster?.berserkPower,
        shielded: monster?.shielded,
      };
    }),
  };
}

function summarizePlayer(game: GameState, playerId: PlayerId): GameStateSummary["players"][PlayerId] {
  const player = game.players[playerId];
  return {
    masterId: player.masterId,
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
    player: {
      hp: game.players.player.masterHp,
      stones: game.players.player.stones,
      hand: game.players.player.hand.length,
      deck: game.players.player.deck.length,
      discard: game.players.player.discard.length,
    },
    cpu: {
      hp: game.players.cpu.masterHp,
      stones: game.players.cpu.stones,
      hand: game.players.cpu.hand.length,
      deck: game.players.cpu.deck.length,
      discard: game.players.cpu.discard.length,
    },
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
          }
        : null,
    ]),
  });
}
