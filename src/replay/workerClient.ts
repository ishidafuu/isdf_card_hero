import type { BattleJournal } from "./types";
import type { GameState } from "../game/types";
import type {
  BattleJournalWorkerOperation,
  BattleJournalWorkerRequest,
  BattleJournalWorkerResponse,
  BattleJournalWorkerStage,
  BattleJournalWorkerValue,
} from "./workerProtocol";

export type BattleJournalWorkerInput =
  | { operation: "seek"; journal: BattleJournal; cursor: number }
  | { operation: "undo"; journal: BattleJournal; cursor: number; expectedState: GameState }
  | { operation: "branch"; journal: BattleJournal; cursor: number }
  | { operation: "import"; json: string }
  | { operation: "export"; journal: BattleJournal };

export interface BattleJournalWorkerCompletion {
  requestId: number;
  generation: number;
  operation: BattleJournalWorkerOperation;
  result: import("./types").BattleJournalResult<BattleJournalWorkerValue>;
}

export interface BattleJournalWorkerClient {
  run(
    generation: number,
    input: BattleJournalWorkerInput,
    onStage?: (stage: BattleJournalWorkerStage, requestId: number) => void,
  ): Promise<BattleJournalWorkerCompletion>;
  cancel(requestId?: number): void;
  dispose(): void;
}

export type BattleJournalWorkerFactory = () => Worker;

export function createBattleJournalWorkerClient(
  workerFactory: BattleJournalWorkerFactory = () => new Worker(new URL("./battleJournal.worker.ts", import.meta.url), { type: "module" }),
): BattleJournalWorkerClient {
  let requestIdSequence = 0;
  let active: { requestId: number; generation: number; worker: Worker; reject: (reason: Error) => void } | undefined;

  const cancel = (requestId?: number) => {
    if (!active || (requestId !== undefined && active.requestId !== requestId)) return;
    const previous = active;
    active = undefined;
    previous.worker.terminate();
    previous.reject(new Error("Battle journal operation cancelled."));
  };

  return {
    run(generation, input, onStage) {
      cancel();
      const requestId = ++requestIdSequence;
      const request = addRequestMetadata(input, requestId, generation);
      return new Promise<BattleJournalWorkerCompletion>((resolve, reject) => {
        let worker: Worker;
        try {
          worker = workerFactory();
        } catch (cause) {
          reject(asError(cause));
          return;
        }
        active = { requestId, generation, worker, reject };
        worker.onmessage = (event: MessageEvent<unknown>) => {
          if (!hasRequestToken(event.data)) return;
          if (active?.worker !== worker || event.data.requestId !== requestId || event.data.generation !== generation) return;
          if (!isWorkerResponse(event.data) || event.data.operation !== input.operation) {
            active = undefined;
            worker.terminate();
            reject(new Error("Battle journal Worker sent a malformed or mismatched response."));
            return;
          }
          const response = event.data;
          if (response.type === "stage") {
            onStage?.(response.stage, requestId);
            return;
          }
          active = undefined;
          worker.terminate();
          resolve({ requestId, generation, operation: response.operation, result: response.result });
        };
        worker.onerror = (event) => {
          event.preventDefault();
          if (active?.worker !== worker) return;
          active = undefined;
          worker.terminate();
          reject(new Error(event.message || "Battle journal Worker failed."));
        };
        worker.onmessageerror = () => {
          if (active?.worker !== worker) return;
          active = undefined;
          worker.terminate();
          reject(new Error("Battle journal Worker response could not be read."));
        };
        try {
          worker.postMessage(request);
        } catch (cause) {
          active = undefined;
          worker.terminate();
          reject(asError(cause));
        }
      });
    },
    cancel,
    dispose() { cancel(); },
  };
}

function asError(cause: unknown): Error {
  return cause instanceof Error ? cause : new Error(String(cause));
}

function addRequestMetadata(input: BattleJournalWorkerInput, requestId: number, generation: number): BattleJournalWorkerRequest {
  switch (input.operation) {
    case "seek":
    case "undo":
    case "branch": return { ...input, requestId, generation };
    case "import":
    case "export": return { ...input, requestId, generation };
  }
}

function isWorkerResponse(value: unknown): value is BattleJournalWorkerResponse {
  if (typeof value !== "object" || value === null) return false;
  const response = value as Partial<BattleJournalWorkerResponse>;
  if (!hasRequestToken(value) || typeof response.operation !== "string") return false;
  if (response.type === "stage") {
    return response.stage === "replaying" || response.stage === "verifying-branch" ||
      response.stage === "validating-import" || response.stage === "validating-export";
  }
  if (response.type !== "result" || typeof response.result !== "object" || response.result === null) return false;
  const result = response.result as { ok?: unknown; value?: unknown; error?: unknown };
  if (result.ok === true) return result.value !== undefined;
  if (result.ok !== false || typeof result.error !== "object" || result.error === null) return false;
  const error = result.error as { code?: unknown; message?: unknown };
  return typeof error.code === "string" && typeof error.message === "string";
}

function hasRequestToken(value: unknown): value is { requestId: number; generation: number } {
  if (typeof value !== "object" || value === null) return false;
  const token = value as { requestId?: unknown; generation?: unknown };
  return Number.isSafeInteger(token.requestId) && Number.isSafeInteger(token.generation);
}
