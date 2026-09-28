import { describe, expect, it } from "vitest";
import { appendHumanActionReviewEntry } from "../../src/game/aiReviewTrace";
import { createInitialGame, endTurn, useMasterAction } from "../../src/game/rules";
import { appendBattleCommand, createBattleJournal, hashBattleState } from "../../src/replay/battleJournal";
import { createPostgameCoachReport, summarizePublicState } from "../../src/sessions/coach";
import { getMonsterDef } from "../../src/game/cards";
import type { HumanActionSnapshot, MonsterState, PlayerId } from "../../src/game/types";

describe("postgame coach", () => {
  it("verifies a completed journal and returns public facts plus a cursor branch link", () => {
    const before = createInitialGame(93201, { firstPlayer: "player", trackEventLog: true });
    before.players.player.stones = 3;
    before.players.player.masterPowerBonus = 12;
    before.players.cpu.masterHp = 1;
    const created = createBattleJournal(before);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const action: HumanActionSnapshot = {
      type: "master_action",
      actionId: "master_attack",
      target: { kind: "master", playerId: "cpu" },
    };
    const after = useMasterAction(before, action.actionId, action.target);
    appendHumanActionReviewEntry(after, before, action);
    expect(after.winner).toBe("player");
    const appended = appendBattleCommand(created.value, before, after, { controller: "human", action });
    expect(appended.ok).toBe(true);
    if (!appended.ok) return;
    const report = createPostgameCoachReport({
      journal: appended.value,
      result: {
        winner: "player",
        turns: after.turnNumber,
        completedAt: "2026-09-29T00:00:00.000Z",
        headHash: hashBattleState(after),
      },
      seat: "player",
    });

    expect(report.ok).toBe(true);
    if (!report.ok) return;
    expect(report.value.observations).toHaveLength(1);
    expect(report.value.observations[0]).toMatchObject({
      actorSeat: "player",
      action: { kind: "master_action", masterAction: "master_attack", target: "master:cpu" },
      replayLink: {
        verifiedJournalHeadHash: hashBattleState(after),
        cursorBefore: 0,
        cursorBeforeHash: hashBattleState(before),
        seat: "player",
      },
      review: { kind: "human", actionKey: JSON.stringify({ kind: "master_action", masterAction: "master_attack", target: "master:cpu" }) },
    });
    expect(report.value.caveat).toContain("最善手や勝率を保証しません");
    for (const card of before.players.player.hand) {
      expect(JSON.stringify(report.value)).not.toContain(card.instanceId);
    }
    expect(JSON.stringify(report.value)).not.toContain("randomSeed");
  });

  it("rejects mismatched winner/head and incomplete records", () => {
    const game = createInitialGame(93202, { firstPlayer: "player", trackEventLog: true });
    game.players.player.stones = 3;
    game.players.player.masterPowerBonus = 12;
    game.players.cpu.masterHp = 1;
    const created = createBattleJournal(game);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const action: HumanActionSnapshot = {
      type: "master_action",
      actionId: "master_attack",
      target: { kind: "master", playerId: "cpu" },
    };
    const finished = useMasterAction(game, action.actionId, action.target);
    appendHumanActionReviewEntry(finished, game, action);
    const completed = appendBattleCommand(created.value, game, finished, { controller: "human", action });
    expect(completed.ok).toBe(true);
    if (!completed.ok) return;
    const validResult = {
      winner: "player" as const,
      turns: finished.turnNumber,
      completedAt: "2026-09-29T00:00:00.000Z",
      headHash: hashBattleState(finished),
    };
    expect(createPostgameCoachReport({
      journal: completed.value,
      result: { ...validResult, winner: "cpu" },
      seat: "player",
    })).toMatchObject({ ok: false, error: { code: "INVALID_RESULT" } });
    expect(createPostgameCoachReport({
      journal: completed.value,
      result: { ...validResult, headHash: "dual32-v2:0000000000000000" },
      seat: "player",
    })).toMatchObject({ ok: false, error: { code: "INVALID_RESULT" } });
    expect(createPostgameCoachReport({
      journal: completed.value,
      result: { ...validResult, completedAt: "2026-02-30T00:00:00.000Z" },
      seat: "player",
    })).toMatchObject({ ok: false, error: { code: "INVALID_RESULT" } });
    const alreadyOverState = createInitialGame(93203, { firstPlayer: "player", trackEventLog: true });
    alreadyOverState.winner = "player";
    const alreadyOver = createBattleJournal(alreadyOverState);
    expect(alreadyOver.ok).toBe(true);
    if (alreadyOver.ok) {
      expect(createPostgameCoachReport({ journal: alreadyOver.value, result: { ...validResult, headHash: hashBattleState(alreadyOverState) }, seat: "player" }))
        .toMatchObject({ ok: false, error: { code: "INVALID_RESULT" } });
    }
    const incomplete = { ...completed.value, completeness: { status: "incomplete" as const, reason: "test", afterSequence: 0 } };
    expect(createPostgameCoachReport({ journal: incomplete, result: validResult, seat: "player" }))
      .toMatchObject({ ok: false, error: { code: "INCOMPLETE" } });
  });

  it("reports end-turn unused action counts as observation, with no hidden-zone data", () => {
    let game = createInitialGame(93204, { firstPlayer: "player", trackEventLog: true });
    game.players.player.stones = 3;
    game.players.player.masterPowerBonus = 12;
    game.players.cpu.masterHp = 1;
    game.slots.player_front_left.monster = makeActiveMonster("card_001", "player");
    const created = createBattleJournal(game);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    let journal = created.value;

    const actions: HumanActionSnapshot[] = [
      { type: "end_turn" },
      { type: "end_turn" },
      { type: "master_action", actionId: "master_attack", target: { kind: "master", playerId: "cpu" } },
    ];
    for (const action of actions) {
      const before = game;
      let after;
      if (action.type === "end_turn") after = endTurn(before);
      else if (action.type === "master_action") after = useMasterAction(before, action.actionId, action.target);
      else throw new Error(`unexpected coach fixture action: ${action.type}`);
      appendHumanActionReviewEntry(after, before, action);
      const appended = appendBattleCommand(journal, before, after, { controller: "human", action });
      expect(appended.ok).toBe(true);
      if (!appended.ok) return;
      game = after;
      journal = appended.value;
    }

    const report = createPostgameCoachReport({
      journal,
      result: {
        winner: "player",
        turns: game.turnNumber,
        completedAt: "2026-09-29T00:00:00.000Z",
        headHash: hashBattleState(game),
      },
      seat: "player",
    });
    expect(report.ok).toBe(true);
    if (!report.ok) return;
    expect(report.value.heuristics).toHaveLength(1);
    expect(report.value.heuristics[0]).toMatchObject({ kind: "heuristic", commandSequence: 1 });
    expect(report.value.heuristics[0].text).toContain("行動回数が残っている味方が1体");
    expect(report.value.heuristics[0].text).toContain("合法行動があったことを保証しません");
    expect(report.value.observations[0].before.board).toContainEqual({
      slot: "player_front_left",
      owner: "player",
      status: "active",
      cardId: "card_001",
      level: 1,
      hp: getMonsterDef("card_001").levels[0].maxHp,
      actionCount: 0,
      actionLimit: getMonsterDef("card_001").actionLimit ?? 1,
    });

    const privateVariant = structuredClone(createInitialGame(93205, { firstPlayer: "player", trackEventLog: true }));
    privateVariant.players.player.hand = privateVariant.players.player.hand.map((card, index) => ({
      ...card,
      instanceId: `private-hand-${index}`,
      cardId: index % 2 === 0 ? "card_046" : "card_083",
    }));
    privateVariant.players.cpu.deck = privateVariant.players.cpu.deck.map((card, index) => ({
      ...card,
      instanceId: `private-deck-${index}`,
      cardId: index % 2 === 0 ? "card_005" : "card_138",
    }));
    expect(summarizePublicState(privateVariant)).toEqual(summarizePublicState(createInitialGame(93206, { firstPlayer: "player", trackEventLog: true })));
  });
});

function makeActiveMonster(cardId: string, owner: PlayerId): MonsterState {
  const definition = getMonsterDef(cardId);
  const level = definition.levels[0];
  return {
    instanceId: `${owner}_${cardId}_coach-fixture`,
    cardId,
    owner,
    hp: level.maxHp,
    level: level.level,
    status: "active",
    investedStones: 1,
    actionCount: 0,
    actionLimit: definition.actionLimit ?? 1,
    focused: false,
    powerUp: false,
    shielded: false,
  };
}
