import { executeBattleJournalWorkerRequest, type BattleJournalWorkerRequest } from "./workerProtocol";

interface WorkerScope {
  onmessage: ((event: MessageEvent<unknown>) => void) | null;
  postMessage(message: unknown): void;
}

const workerScope = self as unknown as WorkerScope;
workerScope.onmessage = (event) => {
  const request = event.data as BattleJournalWorkerRequest;
  for (const response of executeBattleJournalWorkerRequest(request)) {
    workerScope.postMessage(response);
  }
};
