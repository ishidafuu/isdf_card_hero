import type { CpuAiProfiles } from "./game/cpuAiTypes";
import type { OpponentKnowledgePolicy } from "./game/cpuAiTypes";
import type { ExperimentContextV1 } from "./game/experimentalContext";
import type { GameState } from "./game/types";
import type { SeatControllerBySeat } from "./game/seatControl";

const REQUIRED_SLOT_KEYS = [
  "player_front_left",
  "player_front_right",
  "player_back_left",
  "player_back_right",
  "cpu_front_left",
  "cpu_front_right",
  "cpu_back_left",
  "cpu_back_right",
] as const;

export type AutoStepWorkerMode = "auto" | "cpu";

export interface AutoStepRequestToken {
  requestId: number;
  battleGeneration: number;
  gameVersion: number;
}

export interface AutoStepWorkerRequest extends AutoStepRequestToken {
  type: "step";
  mode: AutoStepWorkerMode;
  game: GameState;
  aiProfiles: Partial<CpuAiProfiles>;
  /** Present only for fixed-seat v2 sessions; absence keeps legacy workspace takeover. */
  controllerBySeat?: SeatControllerBySeat;
  experimentalContext?: ExperimentContextV1;
  opponentKnowledgePolicy?: OpponentKnowledgePolicy;
}

export type AutoStepWorkerResponse =
  | (AutoStepRequestToken & {
      type: "result";
      game: GameState;
    })
  | (AutoStepRequestToken & {
      type: "error";
      error: string;
    });

export function isAutoStepWorkerResponse(value: unknown): value is AutoStepWorkerResponse {
  if (!value || typeof value !== "object") {
    return false;
  }
  const response = value as Partial<AutoStepWorkerResponse>;
  if (
    !Number.isSafeInteger(response.requestId) ||
    !Number.isSafeInteger(response.battleGeneration) ||
    !Number.isSafeInteger(response.gameVersion)
  ) {
    return false;
  }
  if (response.type === "error") {
    return typeof response.error === "string";
  }
  return response.type === "result" && isGameStateEnvelope(response.game);
}

function isGameStateEnvelope(value: unknown): value is GameState {
  if (!isRecord(value) || !isRecord(value.players) || !isRecord(value.slots)) {
    return false;
  }
  const players = value.players;
  const slots = value.slots;
  return (
    isPlayerStateEnvelope(players.player, "player") &&
    isPlayerStateEnvelope(players.cpu, "cpu") &&
    REQUIRED_SLOT_KEYS.every((slotKey) => isRecord(slots[slotKey])) &&
    isPlayerId(value.currentPlayer) &&
    isPlayerId(value.firstPlayer) &&
    Number.isSafeInteger(value.turnNumber) &&
    Number.isSafeInteger(value.randomSeed) &&
    Array.isArray(value.log)
  );
}

function isPlayerStateEnvelope(value: unknown, playerId: "player" | "cpu"): boolean {
  return Boolean(
    isRecord(value) &&
    value.id === playerId &&
    typeof value.masterId === "string" &&
    typeof value.masterHp === "number" &&
    Number.isFinite(value.masterHp) &&
    typeof value.stones === "number" &&
    Number.isFinite(value.stones) &&
    Array.isArray(value.deck) &&
    Array.isArray(value.hand) &&
    Array.isArray(value.discard) &&
    Number.isSafeInteger(value.turnsStarted),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPlayerId(value: unknown): value is "player" | "cpu" {
  return value === "player" || value === "cpu";
}

export function matchesAutoStepRequest(
  response: AutoStepRequestToken,
  active: AutoStepRequestToken | undefined,
): boolean {
  return Boolean(
    active &&
    response.requestId === active.requestId &&
    response.battleGeneration === active.battleGeneration &&
    response.gameVersion === active.gameVersion,
  );
}

export type AutoStepWorkerCreationResult<T> =
  | { ok: true; worker: T }
  | { ok: false; error: string };

export function tryCreateAutoStepWorker<T>(factory: () => T): AutoStepWorkerCreationResult<T> {
  try {
    return { ok: true, worker: factory() };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error && error.message
        ? error.message
        : "CPU処理Workerを起動できませんでした",
    };
  }
}
