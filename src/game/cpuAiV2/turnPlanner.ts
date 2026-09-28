import type { CpuDecision, CpuTurnPlanTrace } from "../cpuAiTypes";
import type { GameState, PlayerId } from "../types";

export interface TurnPlannerDecisionEvaluation {
  decision: CpuDecision;
  totalScore: number;
  index: number;
  after: GameState;
}

export interface TurnPlannerV2Dependencies {
  evaluateDecisions: (state: GameState, perspective: PlayerId) => TurnPlannerDecisionEvaluation[];
  evaluatePosition: (state: GameState, perspective: PlayerId) => number;
  stateKey: (state: GameState) => string;
  decisionKey: (decision: CpuDecision) => string;
  prepareOpponentResponseStates?: (state: GameState, perspective: PlayerId) => GameState[];
  opponentKnowledgeLabel?: string;
  cacheNamespace?: string;
}

export interface TurnPlannerV2Options {
  ownMaxActions: number;
  ownBeamWidth: number;
  ownBranchWidth: number;
  ownResponseRootWidth: number;
  opponentMaxActions: number;
  opponentBeamWidth: number;
  opponentBranchWidth: number;
}

interface TurnPlan {
  decisions: CpuDecision[];
  handoffState: GameState;
  handoffScore: number;
  orderingScore: number;
}

interface ScoredTurnPlan extends TurnPlan {
  responseScore: number;
  opponentLine: CpuDecision[];
  opponentPlanCount: number;
  opponentSampleCount: number;
  opponentWorstResponseScore: number;
}

interface SearchNode {
  state: GameState;
  decisions: CpuDecision[];
  orderingScore: number;
  actionCount: number;
  transitionCount: number;
}

interface CachedPlanStep {
  decisionKey: string;
  trace: CpuTurnPlanTrace;
}

const DEFAULT_OPTIONS: TurnPlannerV2Options = {
  ownMaxActions: 10,
  ownBeamWidth: 18,
  ownBranchWidth: 10,
  ownResponseRootWidth: 6,
  opponentMaxActions: 8,
  opponentBeamWidth: 12,
  opponentBranchWidth: 8,
};

const PLAN_CACHE_LIMIT = 20_000;
const continuationPlanCache = new Map<string, CachedPlanStep>();
let nextPlanId = 1;

export function chooseTurnPlannerV2Decision(
  state: GameState,
  dependencies: TurnPlannerV2Dependencies,
  overrides: Partial<TurnPlannerV2Options> = {},
): CpuDecision | undefined {
  const options = normalizeOptions(overrides);
  const scopedDependencies: TurnPlannerV2Dependencies = {
    ...dependencies,
    cacheNamespace: `${dependencies.cacheNamespace ?? "default"}:${JSON.stringify(options)}`,
  };
  const perspective = state.currentPlayer;
  const continued = continueCachedPlan(state, perspective, scopedDependencies);
  if (continued) {
    return continued;
  }

  const ownPlans = generateTurnPlans(state, perspective, scopedDependencies, {
    maxActions: options.ownMaxActions,
    beamWidth: options.ownBeamWidth,
    branchWidth: options.ownBranchWidth,
  });
  if (ownPlans.length === 0) {
    return undefined;
  }

  const responseRoots = selectResponseRoots(ownPlans, options.ownResponseRootWidth, scopedDependencies);
  const scored = responseRoots.map((plan) =>
    scoreOpponentResponse(plan, perspective, scopedDependencies, options),
  );
  scored.sort(compareScoredPlans);
  const selected = scored[0];
  if (!selected?.decisions[0]) {
    return undefined;
  }

  const planId = `v2-${nextPlanId++}`;
  const trace = createPlanTrace(planId, selected, scored, ownPlans.length, scopedDependencies, 1);
  cachePlanContinuation(state, selected, trace, scopedDependencies);
  return withPlanTrace(selected.decisions[0], trace);
}

function normalizeOptions(overrides: Partial<TurnPlannerV2Options>): TurnPlannerV2Options {
  const normalize = (value: number | undefined, fallback: number, maximum: number): number =>
    Number.isFinite(value) ? Math.max(1, Math.min(maximum, Math.trunc(value!))) : fallback;
  return {
    ownMaxActions: normalize(overrides.ownMaxActions, DEFAULT_OPTIONS.ownMaxActions, 24),
    ownBeamWidth: normalize(overrides.ownBeamWidth, DEFAULT_OPTIONS.ownBeamWidth, 64),
    ownBranchWidth: normalize(overrides.ownBranchWidth, DEFAULT_OPTIONS.ownBranchWidth, 64),
    ownResponseRootWidth: normalize(overrides.ownResponseRootWidth, DEFAULT_OPTIONS.ownResponseRootWidth, 32),
    opponentMaxActions: normalize(overrides.opponentMaxActions, DEFAULT_OPTIONS.opponentMaxActions, 24),
    opponentBeamWidth: normalize(overrides.opponentBeamWidth, DEFAULT_OPTIONS.opponentBeamWidth, 64),
    opponentBranchWidth: normalize(overrides.opponentBranchWidth, DEFAULT_OPTIONS.opponentBranchWidth, 64),
  };
}

export function clearTurnPlannerV2Cache(): void {
  continuationPlanCache.clear();
  nextPlanId = 1;
}

function continueCachedPlan(
  state: GameState,
  perspective: PlayerId,
  dependencies: TurnPlannerV2Dependencies,
): CpuDecision | undefined {
  const key = continuationCacheKey(state, dependencies);
  const cached = continuationPlanCache.get(key);
  if (!cached) {
    return undefined;
  }
  continuationPlanCache.delete(key);
  const candidate = dependencies
    .evaluateDecisions(state, perspective)
    .find((evaluation) => dependencies.decisionKey(evaluation.decision) === cached.decisionKey);
  if (!candidate) {
    return undefined;
  }
  return withPlanTrace(candidate.decision, cached.trace);
}

function generateTurnPlans(
  rootState: GameState,
  actor: PlayerId,
  dependencies: TurnPlannerV2Dependencies,
  options: { maxActions: number; beamWidth: number; branchWidth: number },
): TurnPlan[] {
  let frontier: SearchNode[] = [{
    state: rootState,
    decisions: [],
    orderingScore: dependencies.evaluatePosition(rootState, actor),
    actionCount: 0,
    transitionCount: 0,
  }];
  const completed = new Map<string, TurnPlan>();
  const transitionLimit = options.maxActions * 3 + 1;

  for (let depth = 0; depth < transitionLimit && frontier.length > 0; depth += 1) {
    const expanded: SearchNode[] = [];
    for (const node of frontier) {
      if (isTurnHandoff(node.state, actor)) {
        addCompletedPlan(completed, node, actor, dependencies);
        continue;
      }
      if (node.transitionCount >= transitionLimit) {
        const forced = forceTurnHandoff(node, actor, dependencies);
        if (forced) {
          addCompletedPlan(completed, forced, actor, dependencies);
        }
        continue;
      }
      if (!node.state.pendingLevelUp && node.actionCount >= options.maxActions) {
        const forced = forceTurnHandoff(node, actor, dependencies);
        if (forced) {
          addCompletedPlan(completed, forced, actor, dependencies);
        }
        continue;
      }
      const candidates = dependencies.evaluateDecisions(node.state, actor);
      const evaluations = node.state.pendingLevelUp
        ? candidates
        : selectDiverseEvaluations(candidates, options.branchWidth);
      for (const evaluation of evaluations) {
        const decisions = [...node.decisions, evaluation.decision];
        const orderingScore =
          dependencies.evaluatePosition(evaluation.after, actor) + evaluation.totalScore * 0.12 - decisions.length * 0.25;
        const next = {
          state: evaluation.after,
          decisions,
          orderingScore,
          actionCount: node.actionCount + (node.state.pendingLevelUp ? 0 : 1),
          transitionCount: node.transitionCount + 1,
        };
        if (isTurnHandoff(evaluation.after, actor)) {
          addCompletedPlan(completed, next, actor, dependencies);
        } else {
          expanded.push(next);
        }
      }
    }
    frontier = selectDiverseNodes(expanded, options.beamWidth, dependencies);
  }

  for (const node of frontier) {
    const forced = forceTurnHandoff(node, actor, dependencies);
    if (forced) {
      addCompletedPlan(completed, forced, actor, dependencies);
    }
  }

  return [...completed.values()].sort(compareTurnPlans);
}

function selectDiverseEvaluations(
  evaluations: readonly TurnPlannerDecisionEvaluation[],
  limit: number,
): TurnPlannerDecisionEvaluation[] {
  const ranked = [...evaluations].sort(
    (a, b) => b.totalScore - a.totalScore || a.index - b.index,
  );
  const selected: TurnPlannerDecisionEvaluation[] = [];
  const selectedIndexes = new Set<number>();
  const buckets = new Map<string, number>();

  for (const candidate of ranked) {
    const bucket = decisionBucket(candidate.decision);
    if ((buckets.get(bucket) ?? 0) >= 2) {
      continue;
    }
    selected.push(candidate);
    selectedIndexes.add(candidate.index);
    buckets.set(bucket, (buckets.get(bucket) ?? 0) + 1);
    if (selected.length >= limit) {
      return selected;
    }
  }
  for (const candidate of ranked) {
    if (!selectedIndexes.has(candidate.index)) {
      selected.push(candidate);
      if (selected.length >= limit) {
        break;
      }
    }
  }
  return selected;
}

function selectDiverseNodes(
  nodes: readonly SearchNode[],
  limit: number,
  dependencies: TurnPlannerV2Dependencies,
): SearchNode[] {
  const deduplicated = new Map<string, SearchNode>();
  for (const node of nodes) {
    const key = dependencies.stateKey(node.state);
    const current = deduplicated.get(key);
    if (!current || node.orderingScore > current.orderingScore) {
      deduplicated.set(key, node);
    }
  }
  const ranked = [...deduplicated.values()].sort((a, b) => b.orderingScore - a.orderingScore);
  const selected: SearchNode[] = [];
  const firstBuckets = new Set<string>();
  for (const node of ranked) {
    const first = node.decisions[0];
    const bucket = first ? decisionBucket(first) : "none";
    if (!firstBuckets.has(bucket)) {
      selected.push(node);
      firstBuckets.add(bucket);
      if (selected.length >= limit) {
        return selected;
      }
    }
  }
  for (const node of ranked) {
    if (!selected.includes(node)) {
      selected.push(node);
      if (selected.length >= limit) {
        break;
      }
    }
  }
  return selected;
}

function forceTurnHandoff(
  node: SearchNode,
  actor: PlayerId,
  dependencies: TurnPlannerV2Dependencies,
): SearchNode | undefined {
  if (isTurnHandoff(node.state, actor)) {
    return node;
  }
  if (node.state.pendingLevelUp) {
    return undefined;
  }
  const endTurn = dependencies
    .evaluateDecisions(node.state, actor)
    .find((evaluation) => evaluation.decision.type === "end_turn");
  if (!endTurn) {
    return undefined;
  }
  return {
    state: endTurn.after,
    decisions: [...node.decisions, endTurn.decision],
    orderingScore: dependencies.evaluatePosition(endTurn.after, actor),
    actionCount: node.actionCount + 1,
    transitionCount: node.transitionCount + 1,
  };
}

function addCompletedPlan(
  completed: Map<string, TurnPlan>,
  node: SearchNode,
  actor: PlayerId,
  dependencies: TurnPlannerV2Dependencies,
): void {
  if (node.decisions.length === 0 || !isTurnHandoff(node.state, actor)) {
    return;
  }
  const handoffScore = dependencies.evaluatePosition(node.state, actor);
  const plan: TurnPlan = {
    decisions: node.decisions,
    handoffState: node.state,
    handoffScore,
    orderingScore: node.orderingScore,
  };
  const key = dependencies.stateKey(node.state);
  const current = completed.get(key);
  if (!current || compareTurnPlans(plan, current) < 0) {
    completed.set(key, plan);
  }
}

function selectResponseRoots(
  plans: readonly TurnPlan[],
  limit: number,
  dependencies: TurnPlannerV2Dependencies,
): TurnPlan[] {
  const selected: TurnPlan[] = [];
  const firstKeys = new Set<string>();
  for (const plan of plans) {
    const first = plan.decisions[0];
    const firstKey = first ? dependencies.decisionKey(first) : "";
    if (!firstKeys.has(firstKey)) {
      selected.push(plan);
      firstKeys.add(firstKey);
      if (selected.length >= limit) {
        return selected;
      }
    }
  }
  for (const plan of plans) {
    if (!selected.includes(plan)) {
      selected.push(plan);
      if (selected.length >= limit) {
        break;
      }
    }
  }
  return selected;
}

function scoreOpponentResponse(
  plan: TurnPlan,
  perspective: PlayerId,
  dependencies: TurnPlannerV2Dependencies,
  options: TurnPlannerV2Options,
): ScoredTurnPlan {
  if (plan.handoffState.winner || plan.handoffState.pendingLevelUp || plan.handoffState.currentPlayer === perspective) {
    return {
      ...plan,
      responseScore: plan.handoffScore,
      opponentLine: [],
      opponentPlanCount: 0,
      opponentSampleCount: 0,
      opponentWorstResponseScore: plan.handoffScore,
    };
  }
  const opponent = plan.handoffState.currentPlayer;
  const responseStates = dependencies.prepareOpponentResponseStates
    ? dependencies.prepareOpponentResponseStates(plan.handoffState, perspective)
    : [plan.handoffState];
  const sampleResponses = responseStates.map((responseState) => {
    const responses = generateTurnPlans(responseState, opponent, dependencies, {
      maxActions: options.opponentMaxActions,
      beamWidth: options.opponentBeamWidth,
      branchWidth: options.opponentBranchWidth,
    });
    const worst = [...responses].sort(
      (a, b) =>
        dependencies.evaluatePosition(a.handoffState, perspective) -
          dependencies.evaluatePosition(b.handoffState, perspective) ||
        a.decisions.length - b.decisions.length,
    )[0];
    return {
      score: worst
        ? dependencies.evaluatePosition(worst.handoffState, perspective)
        : dependencies.evaluatePosition(responseState, perspective),
      line: worst?.decisions ?? [],
      planCount: responses.length,
    };
  });
  if (sampleResponses.length === 0) {
    return {
      ...plan,
      responseScore: plan.handoffScore,
      opponentLine: [],
      opponentPlanCount: 0,
      opponentSampleCount: 0,
      opponentWorstResponseScore: plan.handoffScore,
    };
  }
  const worstSample = [...sampleResponses].sort((a, b) => a.score - b.score)[0];
  return {
    ...plan,
    responseScore:
      sampleResponses.reduce((total, sample) => total + sample.score, 0) / sampleResponses.length,
    opponentLine: worstSample.line,
    opponentPlanCount: sampleResponses.reduce((total, sample) => total + sample.planCount, 0),
    opponentSampleCount: sampleResponses.length,
    opponentWorstResponseScore: worstSample.score,
  };
}

function compareScoredPlans(a: ScoredTurnPlan, b: ScoredTurnPlan): number {
  return (
    b.responseScore - a.responseScore ||
    b.handoffScore - a.handoffScore ||
    a.decisions.length - b.decisions.length ||
    b.orderingScore - a.orderingScore
  );
}

function compareTurnPlans(a: TurnPlan, b: TurnPlan): number {
  return (
    b.handoffScore - a.handoffScore ||
    a.decisions.length - b.decisions.length ||
    b.orderingScore - a.orderingScore
  );
}

function createPlanTrace(
  planId: string,
  selected: ScoredTurnPlan,
  scored: readonly ScoredTurnPlan[],
  generatedPlanCount: number,
  dependencies: TurnPlannerV2Dependencies,
  step: number,
): CpuTurnPlanTrace {
  return {
    planId,
    phase: step === 1 ? "root" : "continuation",
    step,
    length: selected.decisions.length,
    ownHandoffScore: selected.handoffScore,
    responseScore: selected.responseScore,
    generatedPlanCount,
    comparedRootCount: scored.length,
    opponentPlanCount: selected.opponentPlanCount,
    opponentSampleCount: selected.opponentSampleCount,
    opponentWorstResponseScore: selected.opponentWorstResponseScore,
    opponentKnowledge: dependencies.opponentKnowledgeLabel,
    actions: selected.decisions.map(dependencies.decisionKey),
    opponentActions: selected.opponentLine.map(dependencies.decisionKey),
  };
}

function cachePlanContinuation(
  rootState: GameState,
  selected: ScoredTurnPlan,
  rootTrace: CpuTurnPlanTrace,
  dependencies: TurnPlannerV2Dependencies,
): void {
  let current = rootState;
  for (let index = 0; index < selected.decisions.length - 1; index += 1) {
    const currentDecision = selected.decisions[index];
    const nextDecision = selected.decisions[index + 1];
    const transition = dependencies
      .evaluateDecisions(current, current.currentPlayer)
      .find((evaluation) => dependencies.decisionKey(evaluation.decision) === dependencies.decisionKey(currentDecision));
    if (!transition || transition.after.winner) {
      break;
    }
    current = transition.after;
    if (current.pendingLevelUp && current.pendingLevelUp.playerId !== rootState.currentPlayer) {
      break;
    }
    if (current.currentPlayer !== rootState.currentPlayer) {
      break;
    }
    continuationPlanCache.set(continuationCacheKey(current, dependencies), {
      decisionKey: dependencies.decisionKey(nextDecision),
      trace: {
        ...rootTrace,
        phase: "continuation",
        step: index + 2,
      },
    });
  }
  if (continuationPlanCache.size > PLAN_CACHE_LIMIT) {
    continuationPlanCache.clear();
  }
}

function withPlanTrace(decision: CpuDecision, turnPlan: CpuTurnPlanTrace): CpuDecision {
  const phase = turnPlan.phase === "root" ? "選択" : "継続";
  return {
    ...decision,
    reason:
      `${decision.reason} / V2ターンプラン${phase}: ` +
      `${turnPlan.step}/${turnPlan.length}、自ターン後${Math.round(turnPlan.ownHandoffScore)}点、` +
      `相手応答後${Math.round(turnPlan.responseScore)}点、${turnPlan.generatedPlanCount}案比較`,
    trace: {
      ...decision.trace,
      totalScore: turnPlan.responseScore,
      baseScore: decision.score,
      turnPlan,
    },
  } as CpuDecision;
}

function continuationCacheKey(state: GameState, dependencies: TurnPlannerV2Dependencies): string {
  return `${dependencies.cacheNamespace ?? "default"}:${dependencies.stateKey(state)}`;
}

function decisionBucket(decision: CpuDecision): string {
  if (decision.type === "attack") {
    return decision.action.target.kind === "master" ? "attack_master" : "attack_monster";
  }
  if (decision.type === "master_action") {
    return `master_${decision.actionId}`;
  }
  if (decision.type === "magic") {
    return "magic";
  }
  if (decision.type === "summon") {
    return decision.slotKey.includes("_front_") ? "summon_front" : "summon_back";
  }
  return decision.type;
}

function isTurnHandoff(state: GameState, actor: PlayerId): boolean {
  return !!state.winner || (!state.pendingLevelUp && state.currentPlayer !== actor);
}
