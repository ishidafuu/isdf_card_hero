import { describe, expect, it } from "vitest";
import {
  getBattleLogComment,
  getDisplayLogId,
  listBattleLogComments,
  pruneBattleLogCommentsForGame,
  updateBattleLogComment,
} from "../../src/battleLogComments";
import { appendLog } from "../../src/game/ruleEngine/log";
import { createInitialGame } from "../../src/game/rules";

describe("battle log comments", () => {
  it("keeps a comment attached to the same event after the display log rolls over", () => {
    const game = createInitialGame(118, { trackEventLog: true });
    for (let index = 0; index < 80; index += 1) {
      appendLog(game, `before ${index}`);
    }
    const displayIndex = game.log.length - 1;
    const logId = getDisplayLogId(game, displayIndex);
    const comments = updateBattleLogComment({}, game, displayIndex, "keep this event");
    const originalEntry = comments[logId]!.entry;

    for (let index = 0; index < 100; index += 1) {
      appendLog(game, `after ${index}`);
    }

    expect(game.logOffset).toBeGreaterThan(0);
    expect(game.log[displayIndex]).not.toBe(originalEntry);
    expect(listBattleLogComments(comments)).toEqual([
      { logId, entry: originalEntry, comment: "keep this event" },
    ]);
  });

  it("removes comments for events discarded by an undo branch", () => {
    const game = createInitialGame(119, { trackEventLog: true });
    appendLog(game, "branch action");
    const displayIndex = game.log.length - 1;
    const comments = updateBattleLogComment({}, game, displayIndex, "undo this comment");
    const previous = createInitialGame(119, { trackEventLog: true });

    expect(pruneBattleLogCommentsForGame(comments, previous)).toEqual({});
  });

  it("reads comments through the cumulative log id instead of the display index", () => {
    const game = createInitialGame(120, { trackEventLog: true });
    for (let index = 0; index < 130; index += 1) {
      appendLog(game, `event ${index}`);
    }
    const displayIndex = 25;
    const comments = updateBattleLogComment({}, game, displayIndex, "stable id");

    expect(getBattleLogComment(comments, game, displayIndex)).toBe("stable id");
    expect(Object.values(comments)[0]?.logId).toBe((game.logOffset ?? 0) + displayIndex);
  });
});
