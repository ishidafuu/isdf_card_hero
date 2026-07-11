import { describe, expect, it } from "vitest";
import {
  analyzeHumanTurnReport,
  extractLegacyHumanTurns,
  formatHumanTurnAuditMarkdown,
} from "../../scripts/lib/humanTurnAudit";
import { createAiDecisionStateSnapshot } from "../../src/game/aiReviewTrace";
import { createInitialGame } from "../../src/game/rules";
import type { AiDecisionHistoryEntry, HumanActionHistoryEntry } from "../../src/game/types";

describe("human turn audit", () => {
  it("compares structured human actions with White V2 candidates", () => {
    const state = createInitialGame(81001, { firstPlayer: "player", trackEventLog: true });
    state.players.player.hand = [];
    state.players.player.deck = [];
    state.players.cpu.hand = [];
    state.players.cpu.deck = [];
    for (const slot of Object.values(state.slots)) {
      delete slot.monster;
    }
    const humanEntry: HumanActionHistoryEntry = {
      sequence: 1,
      logIndex: 1,
      playerId: "player",
      turnNumber: state.turnNumber,
      actionKey: "end_turn:",
      action: { type: "end_turn" },
      stateBefore: createAiDecisionStateSnapshot(state),
    };

    const result = analyzeHumanTurnReport({
      reportId: "structured-fixture",
      humanActionHistory: [humanEntry],
    });

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]).toMatchObject({
      source: "structured",
      classification: "aligned",
      candidateCoverage: { covered: 1, comparable: 1 },
      v2Selected: "end_turn",
    });
  });

  it("extracts legacy player turns from CPU end-turn snapshots and event logs", () => {
    const state = createInitialGame(81002, { firstPlayer: "cpu", trackEventLog: true });
    state.players.player.hand = [];
    state.players.player.deck = [{ cardId: "card_064", instanceId: "player_twilight" }];
    state.players.cpu.hand = [];
    state.players.cpu.deck = [{ cardId: "card_064", instanceId: "cpu_twilight" }];
    for (const slot of Object.values(state.slots)) {
      delete slot.monster;
    }
    const endEntry: AiDecisionHistoryEntry = {
      sequence: 1,
      logIndex: 1,
      playerId: "cpu",
      turnNumber: state.turnNumber,
      decisionKey: "end_turn",
      decision: { type: "end_turn", reason: "fixture", score: 0 },
      stateBefore: createAiDecisionStateSnapshot(state),
    };
    const nextEntry: AiDecisionHistoryEntry = {
      ...endEntry,
      sequence: 2,
      logIndex: 7,
      turnNumber: state.turnNumber + 1,
      decisionKey: "focus:cpu_front_left",
      decision: { type: "focus", slotKey: "cpu_front_left", reason: "fixture", score: 0 },
    };

    const entries = extractLegacyHumanTurns({
      reportId: "legacy-fixture",
      aiDecisionHistory: [endEntry, nextEntry],
      eventLog: [
        "CPU判断: ターン終了",
        "プレイヤーのターン開始",
        "プレイヤーはストーンを3個得た",
        "プレイヤーはカードを引いた",
        "ピグミィ Lv1は気合いだめした",
        "CPUのターン開始",
        "CPU判断: 次の行動",
      ],
    });

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      source: "legacy",
      classification: "legacy_observation_only",
      observedActions: ["ピグミィ Lv1は気合いだめした"],
    });
    expect(formatHumanTurnAuditMarkdown([{ reportId: "legacy-fixture", entries }]))
      .toContain("legacy observation turns: 1");
  });
});
