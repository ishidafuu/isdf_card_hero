import { appendAiDecisionReviewEntry, appendHumanActionReviewEntry } from "../../src/game/aiReviewTrace";
import { applyStoredAiDecision } from "../../src/game/cpuAi";
import { createInitialGame, endTurn } from "../../src/game/rules";
import { appendBattleCommand, createBattleJournal, hashBattleState, seekBattleJournal } from "../../src/replay/battleJournal";

/** Builds the real 482-command cap-rollover journal used for browser Worker cancellation tests. */
export function buildRolloverJournalForBrowser(): string {
  let state = createInitialGame(12345, { trackEventLog: true });
  state.players.player.masterHp = 100_000;
  state.players.cpu.masterHp = 100_000;
  const created = createBattleJournal(state);
  if (!created.ok) throw new Error(created.error.message);
  let journal = created.value;
  const aiDecision = { type: "end_turn" as const, reason: "browser worker cancellation fixture", score: 0 };

  for (let round = 0; round < 241; round += 1) {
    const humanBefore = state;
    const humanAfter = endTurn(humanBefore);
    appendHumanActionReviewEntry(humanAfter, humanBefore, { type: "end_turn" });
    const humanAppend = appendBattleCommand(journal, humanBefore, humanAfter, {
      controller: "human",
      action: { type: "end_turn" },
    });
    if (!humanAppend.ok) throw new Error(humanAppend.error.message);
    journal = humanAppend.value;
    state = humanAfter;

    const aiBefore = state;
    const aiAfter = applyStoredAiDecision(aiBefore, aiDecision);
    appendAiDecisionReviewEntry(aiAfter, aiBefore, aiDecision, "end_turn");
    const aiAppend = appendBattleCommand(journal, aiBefore, aiAfter, {
      controller: "ai",
      decision: aiDecision,
    });
    if (!aiAppend.ok) throw new Error(aiAppend.error.message);
    journal = aiAppend.value;
    state = aiAfter;
  }

  if (journal.commands.length !== 482 || state.humanActionHistory?.at(-1)?.sequence !== 241 ||
    state.aiDecisionHistory?.at(-1)?.sequence !== 241) {
    throw new Error("Browser stress journal did not reach the expected history rollover.");
  }
  const replay = seekBattleJournal(journal, journal.commands.length);
  if (!replay.ok) throw new Error(replay.error.message);
  if (hashBattleState(replay.value.state) !== hashBattleState(state)) {
    throw new Error("Browser stress journal failed its complete replay hash check.");
  }
  return JSON.stringify(journal);
}
