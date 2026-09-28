import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { appendAiDecisionReviewEntry, appendHumanActionReviewEntry } from "../src/game/aiReviewTrace";
import { applyStoredAiDecision } from "../src/game/cpuAi";
import { createInitialGame, endTurn } from "../src/game/rules";
import {
  appendBattleCommand,
  createBattleJournal,
  hashBattleState,
  seekBattleJournal,
} from "../src/replay/battleJournal";
function requireValue<T>(result: { ok: true; value: T } | { ok: false; error: { message: string } }): T {
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

let state = createInitialGame(12345, { trackEventLog: true });
state.players.player.masterHp = 100_000;
state.players.cpu.masterHp = 100_000;
const journalResult = createBattleJournal(state);
let journal = requireValue(journalResult);
const aiDecision = { type: "end_turn" as const, reason: "241-round rollover verification", score: 0 };
const startedAt = performance.now();

for (let round = 0; round < 241; round += 1) {
  const humanBefore = state;
  const humanAfter = endTurn(humanBefore);
  appendHumanActionReviewEntry(humanAfter, humanBefore, { type: "end_turn" });
  journal = requireValue(appendBattleCommand(journal, humanBefore, humanAfter, {
    controller: "human",
    action: { type: "end_turn" },
  }));
  state = humanAfter;

  const aiBefore = state;
  const aiAfter = applyStoredAiDecision(aiBefore, aiDecision);
  appendAiDecisionReviewEntry(aiAfter, aiBefore, aiDecision, "end_turn");
  journal = requireValue(appendBattleCommand(journal, aiBefore, aiAfter, {
    controller: "ai",
    decision: aiDecision,
  }));
  state = aiAfter;
}

const recordingMs = performance.now() - startedAt;
const replayStartedAt = performance.now();
const replay = requireValue(seekBattleJournal(journal, journal.commands.length));
const replayMs = performance.now() - replayStartedAt;
if (journal.commands.length !== 482) throw new Error(`Expected 482 commands, got ${journal.commands.length}.`);
if (state.humanActionHistory?.length !== 240 || state.humanActionHistory.at(-1)?.sequence !== 241) {
  throw new Error("Human review history did not roll over at sequence 241.");
}
if (state.aiDecisionHistory?.length !== 240 || state.aiDecisionHistory.at(-1)?.sequence !== 241) {
  throw new Error("AI review history did not roll over at sequence 241.");
}
const expectedHash = hashBattleState(state);
const actualHash = hashBattleState(replay.state);
if (actualHash !== expectedHash) throw new Error(`Replay state mismatch: ${actualHash} !== ${expectedHash}.`);

console.info(JSON.stringify({
  commands: journal.commands.length,
  humanHistory: { count: state.humanActionHistory.length, lastSequence: state.humanActionHistory.at(-1)?.sequence },
  aiHistory: { count: state.aiDecisionHistory.length, lastSequence: state.aiDecisionHistory.at(-1)?.sequence },
  replayHash: actualHash,
  recordingMs: Number(recordingMs.toFixed(1)),
  replayMs: Number(replayMs.toFixed(1)),
}, null, 2));

if (process.env.WRITE_REPLAY_STRESS_ARTIFACT === "1") {
  const artifactPath = resolve("output/replay-stress/482-command-journal.json");
  mkdirSync(dirname(artifactPath), { recursive: true });
  // The full journal has already passed seek/hash verification above. Avoid a second
  // full replay here: this opt-in artifact is for manual browser responsiveness tests.
  writeFileSync(artifactPath, `${JSON.stringify(journal)}\n`);
  console.info(`Wrote verified stress journal: ${artifactPath}`);
}
