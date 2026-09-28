import type {
  AiDecisionSnapshot,
  GameState,
  HumanActionSnapshot,
  PlayerId,
} from "../game/types";
import type { ExperimentContextV1 } from "../game/experimentalContext";
import type { OpponentKnowledgePolicy } from "../game/cpuAiTypes";

export const BATTLE_JOURNAL_FORMAT = "isdf-card-hero-battle-journal" as const;
export const BATTLE_JOURNAL_SCHEMA_VERSION = 1 as const;
export const BATTLE_JOURNAL_SCHEMA_VERSION_V2 = 2 as const;
export const BATTLE_JOURNAL_RULES_VERSION = 1 as const;

export type BattleCommandPayload =
  | { controller: "human"; action: HumanActionSnapshot }
  | { controller: "ai"; decision: AiDecisionSnapshot };

export type BattleCommand = BattleCommandPayload & {
  sequence: number;
  playerId: PlayerId;
  beforeHash: string;
  afterHash: string;
};

export interface BattleJournalMetadataV2 {
  readonly controllerBySeat: Readonly<Record<PlayerId, "human" | "cpu">>;
  readonly experimentalContext?: ExperimentContextV1;
  readonly opponentKnowledgePolicy: OpponentKnowledgePolicy;
}

export type BattleJournalCompleteness =
  | { status: "complete" }
  | { status: "incomplete"; reason: string; afterSequence: number };

export interface BattleJournal {
  format: typeof BATTLE_JOURNAL_FORMAT;
  schemaVersion: typeof BATTLE_JOURNAL_SCHEMA_VERSION | typeof BATTLE_JOURNAL_SCHEMA_VERSION_V2;
  rulesVersion: typeof BATTLE_JOURNAL_RULES_VERSION;
  /** Present only for schema v2. Absence is part of the immutable legacy v1 format. */
  metadata?: BattleJournalMetadataV2;
  initialState: GameState;
  initialHash: string;
  commands: BattleCommand[];
  completeness: BattleJournalCompleteness;
}

export type BattleJournalErrorCode =
  | "INVALID_GAME_STATE"
  | "INVALID_COMMAND"
  | "DUPLICATE_INSTANCE_ID"
  | "COMMAND_LIMIT_EXCEEDED"
  | "IMPORT_TOO_LARGE"
  | "INVALID_JSON"
  | "LEGACY_ANALYSIS_ONLY"
  | "INVALID_JOURNAL"
  | "UNSUPPORTED_VERSION"
  | "INVALID_CURSOR"
  | "INCOMPLETE_JOURNAL"
  | "BEFORE_HASH_MISMATCH"
  | "HASH_MISMATCH"
  | "AI_DECISION_NOT_FOUND"
  | "AI_DECISION_AMBIGUOUS"
  | "EXECUTION_FAILED";

export interface BattleJournalError {
  code: BattleJournalErrorCode;
  message: string;
  sequence?: number;
  expectedHash?: string;
  actualHash?: string;
  cause?: unknown;
}

export type BattleJournalResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: BattleJournalError };

export interface ReplaySnapshot {
  state: GameState;
  cursor: number;
  totalCommands: number;
}

export interface BattleJournalBranchSnapshot {
  journal: BattleJournal;
  snapshot: ReplaySnapshot;
}

export interface AiDecisionExtraction {
  controller: "ai";
  decision: AiDecisionSnapshot;
}
