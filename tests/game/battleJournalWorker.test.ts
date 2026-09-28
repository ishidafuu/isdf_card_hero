import { describe, expect, it } from "vitest";
import { createInitialGame } from "../../src/game/rules";
import { appendHumanActionReviewEntry } from "../../src/game/aiReviewTrace";
import { useMasterAction } from "../../src/game/rules";
import { appendBattleCommand, createBattleJournal, hashBattleState } from "../../src/replay/battleJournal";
import { createBattleJournalWorkerClient } from "../../src/replay/workerClient";
import { executeBattleJournalWorkerRequest, type BattleJournalWorkerRequest, type BattleJournalWorkerResponse } from "../../src/replay/workerProtocol";
import { createDraftSession } from "../../src/sessions/limited";
import { serializeTrustedSessionRuntime } from "../../src/sessions/archive";

function makeJournal() {
  const result = createBattleJournal(createInitialGame(12345, { trackEventLog: true }));
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

function makeWinningCoachRequest() {
  const before = createInitialGame(93201, { firstPlayer: "player", trackEventLog: true });
  before.players.player.stones = 3;
  before.players.player.masterPowerBonus = 12;
  before.players.cpu.masterHp = 1;
  const created = createBattleJournal(before);
  if (!created.ok) throw new Error(created.error.message);
  const action = { type: "master_action" as const, actionId: "master_attack" as const, target: { kind: "master" as const, playerId: "cpu" as const } };
  const after = useMasterAction(before, action.actionId, action.target);
  appendHumanActionReviewEntry(after, before, action);
  const appended = appendBattleCommand(created.value, before, after, { controller: "human", action });
  if (!appended.ok) throw new Error(appended.error.message);
  return {
    operation: "coach" as const,
    journal: appended.value,
    seat: "player" as const,
    result: { winner: "player" as const, turns: after.turnNumber, completedAt: "2026-09-29T00:00:00.000Z", headHash: hashBattleState(after) },
  };
}

describe("battle journal worker protocol", () => {
  it("executes seek, undo, branch, import and export using the existing Result contracts", () => {
    const journal = makeJournal();
    const requests: BattleJournalWorkerRequest[] = [
      { requestId: 1, generation: 4, operation: "seek", journal, cursor: 0 },
      { requestId: 2, generation: 4, operation: "undo", journal, cursor: 0, expectedState: journal.initialState },
      { requestId: 3, generation: 4, operation: "branch", journal, cursor: 0 },
      { requestId: 4, generation: 4, operation: "import", json: JSON.stringify(journal) },
      { requestId: 5, generation: 4, operation: "export", journal },
    ];
    const responses = requests.map((request) => [...executeBattleJournalWorkerRequest(request)]);
    for (const [index, pair] of responses.entries()) {
      expect(pair).toHaveLength(2);
      expect(pair[0]).toMatchObject({ type: "stage", requestId: index + 1, generation: 4 });
      expect(pair[1]).toMatchObject({ type: "result", requestId: index + 1, generation: 4, result: { ok: true } });
    }
    expect(responses[0][1]).toMatchObject({ result: { ok: true, value: { cursor: 0, totalCommands: 0 } } });
    expect(responses[1][1]).toMatchObject({ result: { ok: true, value: { journal: { commands: [] }, snapshot: { cursor: 0, totalCommands: 0 } } } });
    expect(responses[2][1]).toMatchObject({ result: { ok: true, value: { journal: { commands: [] }, snapshot: { cursor: 0, totalCommands: 0 } } } });
    expect(responses[4][1]).toMatchObject({ result: { ok: true, value: expect.any(String) } });

    const wrongExpectedState = structuredClone(journal.initialState);
    wrongExpectedState.players.player.masterHp -= 1;
    const undoMismatch = [...executeBattleJournalWorkerRequest({
      requestId: 6,
      generation: 4,
      operation: "undo",
      journal,
      cursor: 0,
      expectedState: wrongExpectedState,
    })][1];
    expect(undoMismatch).toMatchObject({ type: "result", result: { ok: false, error: { code: "HASH_MISMATCH" } } });
    const invalidImport = [...executeBattleJournalWorkerRequest({
      requestId: 7,
      generation: 4,
      operation: "import",
      json: "{",
    })][1];
    expect(invalidImport).toMatchObject({ type: "result", result: { ok: false, error: { code: "INVALID_JSON", cause: expect.any(String) } } });
  });

  it("yields the coach stage before analysis and returns only a verified winner report", () => {
    const request = { ...makeWinningCoachRequest(), requestId: 31, generation: 8 };
    const iterator = executeBattleJournalWorkerRequest(request);
    expect(iterator.next().value).toMatchObject({ type: "stage", operation: "coach", stage: "analyzing-coach", requestId: 31 });
    const response = iterator.next().value;
    expect(response).toMatchObject({ type: "result", operation: "coach", result: { ok: true, value: { format: "isdf-card-hero-postgame-coach", winner: "player", sampledCommandCount: 1 } } });
    const invalidIterator = executeBattleJournalWorkerRequest({
      ...request,
      requestId: 32,
      result: { ...request.result, winner: "cpu" },
    });
    invalidIterator.next();
    expect(invalidIterator.next().value).toMatchObject({ type: "result", result: { ok: false, error: { code: "EXECUTION_FAILED" } } });
  });

  it("restores a pre-battle archive in the Worker without requiring a fake journal head", () => {
    const started = createDraftSession({ seed: 12345, id: "draft-worker-session" });
    expect(started.ok).toBe(true);
    if (!started.ok) return;
    const serialized = serializeTrustedSessionRuntime(started.value);
    expect(serialized.ok).toBe(true);
    if (!serialized.ok) return;
    const iterator = executeBattleJournalWorkerRequest({ requestId: 41, generation: 9, operation: "restore-session", json: serialized.value });
    expect(iterator.next().value).toMatchObject({ type: "stage", operation: "restore-session", stage: "restoring-session" });
    expect(iterator.next().value).toMatchObject({
      type: "result", operation: "restore-session", result: { ok: true, value: { archive: { journal: null }, replayHeads: { currentHead: null, embeddedHeads: [] } } },
    });
    const malformed = JSON.parse(serialized.value) as Record<string, unknown>;
    malformed.game = null;
    const failed = executeBattleJournalWorkerRequest({ requestId: 42, generation: 9, operation: "restore-session", json: JSON.stringify(malformed) });
    failed.next();
    expect(failed.next().value).toMatchObject({ type: "result", result: { ok: false, error: { code: "EXECUTION_FAILED" } } });
  });

  it("terminates a cancelled request and ignores stale or wrong-generation messages", async () => {
    const workers: FakeWorker[] = [];
    const client = createBattleJournalWorkerClient(() => {
      const worker = new FakeWorker();
      workers.push(worker);
      return worker as unknown as Worker;
    });
    const journal = makeJournal();
    const stages: string[] = [];
    const first = client.run(10, { operation: "seek", journal, cursor: 0 }, (stage) => stages.push(stage));
    const firstRejected = expect(first).rejects.toThrow("cancelled");
    const firstWorker = workers[0];
    expect(firstWorker.sent).toMatchObject({ requestId: 1, generation: 10, operation: "seek" });
    client.cancel(1);
    await firstRejected;
    expect(firstWorker.didTerminate).toBe(true);

    const second = client.run(11, { operation: "seek", journal, cursor: 0 }, (stage) => stages.push(stage));
    const secondWorker = workers[1];
    secondWorker.message({ type: "stage", requestId: 2, generation: 10, operation: "seek", stage: "replaying" });
    expect(stages).toEqual([]);
    secondWorker.message({ type: "stage", requestId: 2, generation: 11, operation: "seek", stage: "replaying" });
    const result = [...executeBattleJournalWorkerRequest(secondWorker.sent as BattleJournalWorkerRequest)][1];
    secondWorker.message(result);
    await expect(second).resolves.toMatchObject({ requestId: 2, generation: 11, operation: "seek", result: { ok: true } });
    expect(stages).toEqual(["replaying"]);
    expect(secondWorker.didTerminate).toBe(true);
    client.dispose();
  });

  it("cancels a coach request and ignores its late report after a newer intent", async () => {
    const workers: FakeWorker[] = [];
    const client = createBattleJournalWorkerClient(() => {
      const worker = new FakeWorker();
      workers.push(worker);
      return worker as unknown as Worker;
    });
    const request = makeWinningCoachRequest();
    const stalePromise = client.run(20, request);
    const staleRejected = expect(stalePromise).rejects.toThrow("cancelled");
    const staleWorker = workers[0];
    const staleResponses = [...executeBattleJournalWorkerRequest({ ...request, requestId: 1, generation: 20 })];
    client.cancel(1);
    await staleRejected;
    expect(staleWorker.didTerminate).toBe(true);

    const current = client.run(21, { operation: "seek", journal: request.journal, cursor: 0 });
    const currentWorker = workers[1];
    for (const message of staleResponses) staleWorker.message(message);
    expect(currentWorker.didTerminate).toBe(false);
    const currentResponse = [...executeBattleJournalWorkerRequest(currentWorker.sent as BattleJournalWorkerRequest)];
    currentWorker.message(currentResponse[0]);
    currentWorker.message(currentResponse[1]);
    await expect(current).resolves.toMatchObject({ generation: 21, operation: "seek", result: { ok: true } });
    client.dispose();
  });

  it("rejects malformed results for the active request instead of remaining busy", async () => {
    const worker = new FakeWorker();
    const client = createBattleJournalWorkerClient(() => worker as unknown as Worker);
    const journal = makeJournal();
    const operation = client.run(3, { operation: "seek", journal, cursor: 0 });
    const rejection = expect(operation).rejects.toThrow("malformed or mismatched");
    worker.message({ type: "result", requestId: 1, generation: 3, operation: "seek", result: { ok: "yes" } } as unknown as BattleJournalWorkerResponse);
    await rejection;
    expect(worker.didTerminate).toBe(true);
    client.dispose();
  });
});

class FakeWorker {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  sent: unknown;
  didTerminate = false;

  postMessage(message: unknown): void { this.sent = message; }
  terminate(): void { this.didTerminate = true; }
  message(data: BattleJournalWorkerResponse): void { this.onmessage?.({ data } as MessageEvent<unknown>); }
}
