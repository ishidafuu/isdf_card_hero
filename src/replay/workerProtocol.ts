import {
  branchBattleJournalWithSnapshot,
  hashBattleState,
  parseBattleJournal,
  seekBattleJournal,
  serializeBattleJournal,
} from "./battleJournal";
import type { BattleJournal, BattleJournalBranchSnapshot, BattleJournalError, BattleJournalResult, ReplaySnapshot } from "./types";
import { createPostgameCoachReport, type PostgameCoachReport } from "../sessions/coach";
import type { SessionBattleResult } from "../sessions/types";
import { parseSessionArchiveEnvelope, verifySessionArchiveReplayHeads } from "../sessions/archive";
import type { VerifiedSessionArchive } from "../sessions/archive";

export type BattleJournalWorkerOperation = "seek" | "undo" | "branch" | "import" | "export" | "coach" | "restore-session";
export type BattleJournalWorkerStage = "replaying" | "verifying-branch" | "validating-import" | "validating-export" | "analyzing-coach" | "restoring-session";

interface WorkerRequestBase {
  requestId: number;
  generation: number;
}

export type BattleJournalWorkerRequest =
  | (WorkerRequestBase & { operation: "seek"; journal: BattleJournal; cursor: number })
  | (WorkerRequestBase & { operation: "undo"; journal: BattleJournal; cursor: number; expectedState: import("../game/types").GameState })
  | (WorkerRequestBase & { operation: "branch"; journal: BattleJournal; cursor: number })
  | (WorkerRequestBase & { operation: "import"; json: string })
  | (WorkerRequestBase & { operation: "export"; journal: BattleJournal })
  | (WorkerRequestBase & { operation: "coach"; journal: BattleJournal; result: SessionBattleResult; seat: import("../game/types").PlayerId })
  | (WorkerRequestBase & { operation: "restore-session"; json: string });

export type BattleJournalWorkerValue = ReplaySnapshot | BattleJournal | BattleJournalBranchSnapshot | PostgameCoachReport | VerifiedSessionArchive | string;

export type BattleJournalWorkerResponse =
  | (WorkerRequestBase & { type: "stage"; operation: BattleJournalWorkerOperation; stage: BattleJournalWorkerStage })
  | (WorkerRequestBase & {
    type: "result";
    operation: BattleJournalWorkerOperation;
    result: BattleJournalResult<BattleJournalWorkerValue>;
  });

export function* executeBattleJournalWorkerRequest(request: BattleJournalWorkerRequest): IterableIterator<BattleJournalWorkerResponse> {
  yield {
    type: "stage",
    requestId: request.requestId,
    generation: request.generation,
    operation: request.operation,
    stage: stageForOperation(request.operation),
  };
  let result: BattleJournalResult<BattleJournalWorkerValue>;
  try {
    switch (request.operation) {
      case "seek":
        result = seekBattleJournal(request.journal, request.cursor);
        break;
      case "undo": {
        const undo = branchBattleJournalWithSnapshot(request.journal, request.cursor);
        if (!undo.ok) {
          result = undo;
          break;
        }
        const expectedHash = hashBattleState(request.expectedState);
        const actualHash = hashBattleState(undo.value.snapshot.state);
        result = expectedHash === actualHash
          ? undo
          : {
            ok: false,
            error: {
              code: "HASH_MISMATCH",
              message: "undo対象の盤面がjournal seek結果と一致しません。",
              expectedHash,
              actualHash,
            },
          };
        break;
      }
      case "branch":
        result = branchBattleJournalWithSnapshot(request.journal, request.cursor);
        break;
      case "import":
        result = parseBattleJournal(request.json);
        break;
      case "export":
        result = serializeBattleJournal(request.journal);
        break;
      case "coach": {
        const report = createPostgameCoachReport({ journal: request.journal, result: request.result, seat: request.seat });
        result = report.ok
          ? { ok: true, value: report.value }
          : { ok: false, error: { code: "EXECUTION_FAILED", message: report.error.message } };
        break;
      }
      case "restore-session": {
        const parsed = parseSessionArchiveEnvelope(request.json);
        if (!parsed.ok) {
          result = { ok: false, error: { code: "EXECUTION_FAILED", message: parsed.error.message } };
          break;
        }
        const verified = verifySessionArchiveReplayHeads(parsed.value);
        result = verified.ok
          ? { ok: true, value: verified.value }
          : { ok: false, error: { code: "EXECUTION_FAILED", message: verified.error.message } };
        break;
      }
    }
  } catch (cause) {
    result = {
      ok: false,
      error: {
        code: "INVALID_JOURNAL",
        message: "journal Worker内で予期しない例外が発生しました。",
        cause,
      } satisfies BattleJournalError,
    };
  }
  result = toStructuredCloneResult(result);
  yield {
    type: "result",
    requestId: request.requestId,
    generation: request.generation,
    operation: request.operation,
    result,
  };
}

function toStructuredCloneResult<T>(result: BattleJournalResult<T>): BattleJournalResult<T> {
  if (result.ok || result.error.cause === undefined) return result;
  let cause: string;
  try {
    cause = result.error.cause instanceof Error
      ? `${result.error.cause.name}: ${result.error.cause.message}`
      : String(result.error.cause);
  } catch {
    cause = "Unserializable cause";
  }
  return { ok: false, error: { ...result.error, cause } };
}

function stageForOperation(operation: BattleJournalWorkerOperation): BattleJournalWorkerStage {
  switch (operation) {
    case "seek":
      return "replaying";
    case "branch": return "verifying-branch";
    case "undo": return "verifying-branch";
    case "import": return "validating-import";
    case "export": return "validating-export";
    case "coach": return "analyzing-coach";
    case "restore-session": return "restoring-session";
  }
}
