import type { CpuAiProfiles, OpponentKnowledgePolicy } from "../game/cpuAiTypes";
import type { ExperimentContextV1 } from "../game/experimentalContext";
import type { GameState, MasterId, PlayerId } from "../game/types";
import type { BattleJournal, ReplaySnapshot } from "../replay/types";

export const SESSION_ARCHIVE_FORMAT = "isdf-card-hero-session-archive" as const;
export const SESSION_ARCHIVE_VERSION = 1 as const;
export const SESSION_MANIFEST_FORMAT = "isdf-card-hero-session-manifest" as const;
export const SESSION_MANIFEST_VERSION = 1 as const;

/** UI workspace (play/spectate/analyze) is deliberately not a session kind. */
export type SessionKind = "battle" | "daily" | "puzzle" | "gauntlet" | "draft" | "sealed" | "local-pvp" | "experimental";
export type SessionController = "human" | "cpu";
export type SessionControllers = Readonly<Record<PlayerId, SessionController>>;
export type SessionControlPolicy = "legacy-workspace" | "fixed-seat";
export type SessionOpponentKnowledgePolicy = OpponentKnowledgePolicy;

export interface SessionDeckSnapshot {
  /** Ordered card ids actually used to construct the deck, including duplicates. */
  readonly cardIds: readonly string[];
  readonly allowSpecial: boolean;
  readonly sourcePresetId?: string;
}

export type SessionExperimentContextV1 = ExperimentContextV1;

/** Immutable start-of-session configuration. Mutable challenge progress lives in the archive. */
export interface SessionManifest {
  readonly format: typeof SESSION_MANIFEST_FORMAT;
  readonly version: typeof SESSION_MANIFEST_VERSION;
  readonly id: string;
  readonly kind: SessionKind;
  readonly createdAt: string;
  readonly seed: number;
  readonly firstPlayer: PlayerId;
  readonly profiles: Readonly<CpuAiProfiles>;
  readonly masters: Readonly<Record<PlayerId, MasterId>>;
  readonly decks: Readonly<Record<PlayerId, SessionDeckSnapshot>>;
  readonly controllerBySeat: SessionControllers;
  /** Existing v1 standard battles retain workspace takeover; every challenge/PvP/branch is fixed-seat. */
  readonly controlPolicy: SessionControlPolicy;
  /** Captured AI information boundary, never inferred from mutable deck UI state on restore. */
  readonly opponentKnowledgePolicy: SessionOpponentKnowledgePolicy;
  readonly experimentalContext?: SessionExperimentContextV1;
  /** References a versioned definition for generated/curated challenge content. */
  readonly challengeDefinition?: { readonly id: string; readonly version: number };
}

export interface SessionPlanBase {
  readonly id?: string;
  readonly createdAt?: string;
  readonly seed: number;
  readonly firstPlayer: PlayerId;
  readonly profiles: Readonly<CpuAiProfiles>;
  readonly masters: Readonly<Record<PlayerId, MasterId>>;
  readonly decks: Readonly<Record<PlayerId, SessionDeckSnapshot>>;
  readonly controllerBySeat: SessionControllers;
  /** Normally derived from kind; branches must explicitly preserve source information policy. */
  readonly opponentKnowledgePolicy?: SessionOpponentKnowledgePolicy;
  readonly branchSource?: SessionBranchProvenance;
}

export type SessionPlan =
  | (SessionPlanBase & { readonly kind: "battle"; readonly experimentalContext?: SessionExperimentContextV1 })
  | (SessionPlanBase & { readonly kind: "daily"; readonly dateJst: string; readonly challengeDefinition: { readonly id: string; readonly version: number } })
  | (SessionPlanBase & { readonly kind: "puzzle"; readonly puzzleId: string; readonly puzzleVersion: number })
  | (SessionPlanBase & { readonly kind: "gauntlet"; readonly gauntletId: string; readonly gauntletVersion: number })
  | (SessionPlanBase & { readonly kind: "draft"; readonly draftId: string; readonly draftVersion: number })
  | (SessionPlanBase & { readonly kind: "sealed"; readonly sealedId: string; readonly sealedVersion: number })
  | (SessionPlanBase & { readonly kind: "local-pvp" })
  | (SessionPlanBase & { readonly kind: "experimental"; readonly experimentalContext: SessionExperimentContextV1 });

export interface SessionBattleResult {
  readonly winner: PlayerId | "draw";
  readonly turns: number;
  readonly completedAt: string;
  readonly headHash: string;
}

export interface BattleSessionProgress {
  readonly kind: "battle" | "daily" | "local-pvp" | "experimental";
  readonly status: "active" | "completed";
  readonly dateJst?: string;
  readonly result?: SessionBattleResult;
}

export interface PuzzleSessionProgress {
  readonly kind: "puzzle";
  readonly puzzleId: string;
  readonly puzzleVersion: number;
  readonly status: "ready" | "active" | "solved" | "failed";
  readonly attempts: number;
}

export interface GauntletCompletedBattle {
  readonly journal: BattleJournal;
  readonly result: SessionBattleResult;
}

export interface GauntletSessionProgress {
  readonly kind: "gauntlet";
  readonly gauntletId: string;
  readonly gauntletVersion: number;
  readonly status: "active" | "completed";
  readonly stageIndex: number;
  readonly completedBattles: readonly GauntletCompletedBattle[];
}

export interface DraftPickEvent {
  readonly sequence: number;
  readonly packIndex: number;
  readonly picker: PlayerId;
  readonly pickId: string;
  readonly cardId: string;
  readonly passedPackTo?: PlayerId;
}

export interface DraftSessionProgress {
  readonly kind: "draft";
  readonly draftId: string;
  readonly draftVersion: number;
  readonly status: "drafting" | "deckReady" | "battle" | "completed";
  readonly packIndex: number;
  readonly pickEvents: readonly DraftPickEvent[];
  /** Ordered cardId lists derived from the 60 seed-bound pick events, 30 cards per seat. */
  readonly selectedDeckBySeat?: Readonly<Record<PlayerId, readonly string[]>>;
  readonly result?: DraftCompletedBattle;
}

export interface DraftCompletedBattle {
  readonly journal: BattleJournal;
  readonly result: SessionBattleResult;
}

export interface SealedCard {
  readonly instanceId: string;
  readonly cardId: string;
}

export interface SealedSessionProgress {
  readonly kind: "sealed";
  readonly sealedId: string;
  readonly sealedVersion: number;
  readonly status: "pool" | "deckbuilding" | "deckReady" | "battle" | "completed";
  readonly poolBySeat: Readonly<Record<PlayerId, readonly SealedCard[]>>;
  /** Ordered SealedCard.instanceId lists; during deckbuilding the player list may be a saved 0–30 draft selection. */
  readonly selectedDeckBySeat?: Readonly<Record<PlayerId, readonly string[]>>;
  readonly result?: SessionBattleResult;
}

export type SessionProgress =
  | BattleSessionProgress
  | PuzzleSessionProgress
  | GauntletSessionProgress
  | DraftSessionProgress
  | SealedSessionProgress;

export interface SessionArchive {
  readonly format: typeof SESSION_ARCHIVE_FORMAT;
  readonly version: typeof SESSION_ARCHIVE_VERSION;
  readonly manifest: SessionManifest;
  /** Null only before a battle exists (for example, while drafting/building a sealed deck). */
  readonly journal: BattleJournal | null;
  readonly progress: SessionProgress;
  /** Immutable source evidence for an explicit branch; the new journal starts at the verified cursor snapshot. */
  readonly branchSource?: SessionBranchProvenance;
}

export interface SessionBranchProvenance {
  readonly sourceSessionId: string;
  readonly sourceManifest: SessionManifest;
  readonly sourceJournal: BattleJournal;
  /** Exact source progress is part of the initializer proof (for example, the active Gauntlet stage). */
  readonly sourceProgress: SessionProgress;
  readonly sourceCursor: number;
  /** Hash of the source journal state at sourceCursor (not necessarily its terminal head). */
  readonly sourceHeadHash: string;
  /** Present only when branching from a branch; preserves the original cursor proof chain. */
  readonly sourceBranchSource?: SessionBranchProvenance;
}

export interface SessionRuntime extends SessionArchive {
  /** Current state is never inferred from a legacy report or unverified journal. */
  readonly game: GameState | null;
}

export type SessionErrorCode =
  | "INVALID_PLAN"
  | "UNSUPPORTED_SESSION"
  | "INVALID_MANIFEST"
  | "INVALID_PROGRESS"
  | "INVALID_ARCHIVE"
  | "JOURNAL_REQUIRED"
  | "JOURNAL_MISMATCH"
  | "LEGACY_ANALYSIS_ONLY"
  | "UNSUPPORTED_VERSION"
  | "STORAGE_UNAVAILABLE"
  | "STORAGE_QUOTA_EXCEEDED"
  | "SERIALIZATION_FAILED";

export interface SessionError {
  readonly code: SessionErrorCode;
  readonly message: string;
  readonly path?: string;
  readonly cause?: unknown;
}

export type SessionResult<T> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: SessionError };

export type VerifiedSessionHead = ReplaySnapshot;
