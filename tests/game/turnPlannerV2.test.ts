import { beforeEach, describe, expect, it } from "vitest";
import {
  chooseTurnPlannerV2Decision,
  clearTurnPlannerV2Cache,
  type TurnPlannerDecisionEvaluation,
  type TurnPlannerV2Dependencies,
} from "../../src/game/cpuAiV2/turnPlanner";
import type { CpuDecision } from "../../src/game/cpuAiTypes";
import type { GameState, PlayerId } from "../../src/game/types";

interface FixtureState extends GameState {
  fixtureId: string;
  cpuScore: number;
}

describe("turn planner v2", () => {
  beforeEach(() => clearTurnPlannerV2Cache());

  it("chooses the lower immediate plan when the opponent full-turn response is safer", () => {
    const fixture = createPlannerFixture();

    const selected = chooseTurnPlannerV2Decision(fixture.states.root, fixture.dependencies, {
      ownMaxActions: 3,
      ownBeamWidth: 8,
      ownBranchWidth: 8,
      ownResponseRootWidth: 4,
      opponentMaxActions: 3,
      opponentBeamWidth: 8,
      opponentBranchWidth: 8,
    });

    expect(selected?.type).toBe("summon");
    expect(selected?.trace?.turnPlan?.actions).toEqual(["safe_setup", "safe_end"]);
    expect(selected?.trace?.turnPlan?.opponentActions).toEqual(["safe_response", "safe_response_end"]);
    expect(selected?.trace?.turnPlan?.responseScore).toBe(10);
  });

  it("continues the selected turn sequence on the expected next state", () => {
    const fixture = createPlannerFixture();
    const options = {
      ownMaxActions: 3,
      ownBeamWidth: 8,
      ownBranchWidth: 8,
      ownResponseRootWidth: 4,
      opponentMaxActions: 3,
      opponentBeamWidth: 8,
      opponentBranchWidth: 8,
    };
    const selected = chooseTurnPlannerV2Decision(fixture.states.root, fixture.dependencies, options);
    expect(selected?.type).toBe("summon");

    const continued = chooseTurnPlannerV2Decision(fixture.states.safeSetup, fixture.dependencies, options);

    expect(continued?.type).toBe("end_turn");
    expect(continued?.trace?.turnPlan?.phase).toBe("continuation");
    expect(continued?.trace?.turnPlan?.step).toBe(2);
    expect(continued?.trace?.turnPlan?.planId).toBe(selected?.trace?.turnPlan?.planId);
  });

  it("selects a plan by the average worst response across hidden-info samples", () => {
    const root = fixtureState("root", "cpu", 0);
    const greedyHandoff = fixtureState("greedy_handoff", "player", 100);
    const safeHandoff = fixtureState("safe_handoff", "player", 80);
    const greedySampleA = fixtureState("greedy_sample_a", "player", 100);
    const greedySampleB = fixtureState("greedy_sample_b", "player", 100);
    const safeSampleA = fixtureState("safe_sample_a", "player", 80);
    const safeSampleB = fixtureState("safe_sample_b", "player", 80);
    const greedyFinalA = fixtureState("greedy_final_a", "cpu", -100);
    const greedyFinalB = fixtureState("greedy_final_b", "cpu", 200);
    const safeFinalA = fixtureState("safe_final_a", "cpu", 10);
    const safeFinalB = fixtureState("safe_final_b", "cpu", 10);
    const transitions = new Map<string, TurnPlannerDecisionEvaluation[]>([
      ["root", [
        evaluation(decision("focus", "greedy"), 100, greedyHandoff, 0),
        evaluation(decision("summon", "safe"), 80, safeHandoff, 1),
      ]],
      ["greedy_sample_a", [evaluation(decision("end_turn", "greedy_a_response"), 0, greedyFinalA, 0)]],
      ["greedy_sample_b", [evaluation(decision("end_turn", "greedy_b_response"), 0, greedyFinalB, 0)]],
      ["safe_sample_a", [evaluation(decision("end_turn", "safe_a_response"), 0, safeFinalA, 0)]],
      ["safe_sample_b", [evaluation(decision("end_turn", "safe_b_response"), 0, safeFinalB, 0)]],
    ]);
    const dependencies: TurnPlannerV2Dependencies = {
      evaluateDecisions: (state) => transitions.get((state as FixtureState).fixtureId) ?? [],
      evaluatePosition: (state, perspective) => {
        const score = (state as FixtureState).cpuScore;
        return perspective === "cpu" ? score : -score;
      },
      stateKey: (state) => (state as FixtureState).fixtureId,
      decisionKey: (item) => item.reason,
      prepareOpponentResponseStates: (state) =>
        (state as FixtureState).fixtureId === "greedy_handoff"
          ? [greedySampleA, greedySampleB]
          : [safeSampleA, safeSampleB],
      opponentKnowledgeLabel: "fixture-x2",
    };

    const selected = chooseTurnPlannerV2Decision(root, dependencies, {
      ownMaxActions: 1,
      ownBeamWidth: 4,
      ownBranchWidth: 4,
      ownResponseRootWidth: 2,
      opponentMaxActions: 1,
      opponentBeamWidth: 4,
      opponentBranchWidth: 4,
    });

    expect(selected?.type).toBe("focus");
    expect(selected?.trace?.turnPlan?.responseScore).toBe(50);
    expect(selected?.trace?.turnPlan?.opponentWorstResponseScore).toBe(-100);
    expect(selected?.trace?.turnPlan?.opponentSampleCount).toBe(2);
    expect(selected?.trace?.turnPlan?.opponentKnowledge).toBe("fixture-x2");
  });

  it("compares every legal pending level-up choice and only returns a complete handoff plan", () => {
    const root = {
      ...fixtureState("pending_root", "cpu", 0),
      pendingLevelUp: { playerId: "cpu", attackerSlotKey: "cpu_front_left", maxLevels: 2 },
    } as FixtureState;
    const resolved0 = fixtureState("resolved_0", "cpu", 10);
    const resolved1 = fixtureState("resolved_1", "cpu", 20);
    const resolved2 = fixtureState("resolved_2", "cpu", 100);
    const resolvedSuper = fixtureState("resolved_super", "cpu", 70);
    const handed = [
      fixtureState("handoff_0", "player", 10),
      fixtureState("handoff_1", "player", 20),
      fixtureState("handoff_2", "player", 100),
      fixtureState("handoff_super", "player", 70),
    ];
    const transitions = new Map<string, TurnPlannerDecisionEvaluation[]>([
      ["pending_root", [
        evaluation(levelUpDecision(0, "decline"), 0, resolved0, 0),
        evaluation(levelUpDecision(1, "partial"), 0, resolved1, 1),
        evaluation(levelUpDecision(2, "full"), 0, resolved2, 2),
        evaluation(levelUpDecision(1, "super", "super-card"), 0, resolvedSuper, 3),
      ]],
      ...[resolved0, resolved1, resolved2, resolvedSuper].map((state, index) => [
        state.fixtureId,
        [evaluation(decision("end_turn", `end-${index}`), 0, handed[index], 0)],
      ] as [string, TurnPlannerDecisionEvaluation[]]),
    ]);
    const dependencies: TurnPlannerV2Dependencies = {
      evaluateDecisions: (state) => transitions.get((state as FixtureState).fixtureId) ?? [],
      evaluatePosition: (state) => (state as FixtureState).cpuScore,
      stateKey: (state) => (state as FixtureState).fixtureId,
      decisionKey: (item) => item.reason,
    };

    const selected = chooseTurnPlannerV2Decision(root, dependencies, {
      ownMaxActions: 1,
      ownBeamWidth: 4,
      ownBranchWidth: 1,
      ownResponseRootWidth: 4,
      opponentMaxActions: 1,
      opponentBeamWidth: 1,
      opponentBranchWidth: 1,
    });

    expect(selected).toMatchObject({ type: "resolve_level_up", levels: 2 });
    expect(selected?.trace?.turnPlan?.actions).toEqual(["full", "end-2"]);
    expect(selected?.trace?.turnPlan?.length).toBe(2);
  });

  it("never completes a plan when the budget ends with an unresolved pending choice", () => {
    const root = {
      ...fixtureState("stuck_pending", "cpu", 0),
      pendingLevelUp: { playerId: "cpu", attackerSlotKey: "cpu_front_left", maxLevels: 2 },
    } as FixtureState;
    const selected = chooseTurnPlannerV2Decision(root, {
      evaluateDecisions: () => [],
      evaluatePosition: (state) => (state as FixtureState).cpuScore,
      stateKey: (state) => (state as FixtureState).fixtureId,
      decisionKey: (item) => item.reason,
    }, {
      ownMaxActions: 1,
      ownBeamWidth: 1,
      ownBranchWidth: 1,
      ownResponseRootWidth: 1,
      opponentMaxActions: 1,
      opponentBeamWidth: 1,
      opponentBranchWidth: 1,
    });
    expect(selected).toBeUndefined();
  });

  it("normalizes unsafe options and does not reuse a continuation across option sets", () => {
    const fixture = createPlannerFixture();
    const first = chooseTurnPlannerV2Decision(fixture.states.root, fixture.dependencies, {
      ownMaxActions: Number.POSITIVE_INFINITY,
      ownBeamWidth: 0,
      ownBranchWidth: -8,
      ownResponseRootWidth: Number.NaN,
    });
    expect(first).toBeDefined();
    const changedOptions = chooseTurnPlannerV2Decision(fixture.states.safeSetup, fixture.dependencies, {
      ownMaxActions: 1,
      ownBeamWidth: 1,
      ownBranchWidth: 1,
      ownResponseRootWidth: 1,
    });
    expect(changedOptions?.trace?.turnPlan?.phase).toBe("root");
    expect(changedOptions?.trace?.turnPlan?.planId).not.toBe(first?.trace?.turnPlan?.planId);
  });

});

function createPlannerFixture(): {
  states: Record<
    "root" | "greedySetup" | "greedyHandoff" | "greedyResponse" | "greedyFinal" |
    "greedyPass" | "safeSetup" | "safeHandoff" | "safeResponse" | "safeFinal" | "safePass",
    FixtureState
  >;
  dependencies: TurnPlannerV2Dependencies;
} {
  const states = {
    root: fixtureState("root", "cpu", 0),
    greedySetup: fixtureState("greedy_setup", "cpu", 80),
    greedyHandoff: fixtureState("greedy_handoff", "player", 100),
    greedyResponse: fixtureState("greedy_response", "player", -100),
    greedyFinal: fixtureState("greedy_final", "cpu", -100),
    greedyPass: fixtureState("greedy_pass", "cpu", 100),
    safeSetup: fixtureState("safe_setup", "cpu", 60),
    safeHandoff: fixtureState("safe_handoff", "player", 80),
    safeResponse: fixtureState("safe_response", "player", 10),
    safeFinal: fixtureState("safe_final", "cpu", 10),
    safePass: fixtureState("safe_pass", "cpu", 80),
  };
  const greedySetup = decision("focus", "greedy_setup");
  const greedyEnd = decision("end_turn", "greedy_end");
  const greedyResponse = decision("attack", "greedy_response");
  const greedyResponseEnd = decision("end_turn", "greedy_response_end");
  const safeSetup = decision("summon", "safe_setup");
  const safeEnd = decision("end_turn", "safe_end");
  const safeResponse = decision("attack", "safe_response");
  const safeResponseEnd = decision("end_turn", "safe_response_end");
  const transitions = new Map<string, TurnPlannerDecisionEvaluation[]>([
    ["root", [evaluation(greedySetup, 120, states.greedySetup, 0), evaluation(safeSetup, 80, states.safeSetup, 1)]],
    ["greedy_setup", [evaluation(greedyEnd, 0, states.greedyHandoff, 0)]],
    ["safe_setup", [evaluation(safeEnd, 0, states.safeHandoff, 0)]],
    ["greedy_handoff", [
      evaluation(greedyResponse, 150, states.greedyResponse, 0),
      evaluation(decision("end_turn", "greedy_pass"), 0, states.greedyPass, 1),
    ]],
    ["greedy_response", [evaluation(greedyResponseEnd, 0, states.greedyFinal, 0)]],
    ["safe_handoff", [
      evaluation(safeResponse, 60, states.safeResponse, 0),
      evaluation(decision("end_turn", "safe_pass"), 0, states.safePass, 1),
    ]],
    ["safe_response", [evaluation(safeResponseEnd, 0, states.safeFinal, 0)]],
  ]);
  return {
    states,
    dependencies: {
      evaluateDecisions: (state) => transitions.get((state as FixtureState).fixtureId) ?? [],
      evaluatePosition: (state, perspective) => {
        const score = (state as FixtureState).cpuScore;
        return perspective === "cpu" ? score : -score;
      },
      stateKey: (state) => (state as FixtureState).fixtureId,
      decisionKey: (item) => item.reason,
    },
  };
}

function fixtureState(fixtureId: string, currentPlayer: PlayerId, cpuScore: number): FixtureState {
  return { fixtureId, currentPlayer, cpuScore } as FixtureState;
}

function evaluation(
  item: CpuDecision,
  totalScore: number,
  after: GameState,
  index: number,
): TurnPlannerDecisionEvaluation {
  return { decision: item, totalScore, after, index };
}

function decision(type: CpuDecision["type"], key: string): CpuDecision {
  if (type === "focus") {
    return { type, slotKey: "cpu_front_left", reason: key, score: 0 };
  }
  if (type === "summon") {
    return {
      type,
      handInstanceId: "fixture_hand",
      slotKey: "cpu_front_left",
      reason: key,
      score: 0,
    };
  }
  if (type === "attack") {
    return {
      type,
      action: {
        attackerSlotKey: "player_front_left",
        commandId: "fixture_attack",
        target: { kind: "monster", slotKey: "cpu_front_left" },
      },
      reason: key,
      score: 0,
    };
  }
  return { type: "end_turn", reason: key, score: 0 };
}

function levelUpDecision(levels: number, reason: string, superHandInstanceId?: string): CpuDecision {
  return { type: "resolve_level_up", levels, superHandInstanceId, reason, score: 0 };
}
