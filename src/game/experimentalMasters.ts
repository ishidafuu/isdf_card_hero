import { getEffectiveActor } from "./seatControl";
import { getMasterLabCandidate, listMasterLabActionOptions, playMasterLabAction } from "./masterLab";
import { useMasterAction } from "./rules";
import { resolveExperimentalMasterForSeat, type ExperimentContextV1, type ExperimentalMasterId } from "./experimentalContext";
import type { GameState, MasterActionId, PlayerId, Target } from "./types";

export interface ExperimentalMasterActionCommand {
  master: ExperimentalMasterId;
  actionId: string;
  target: Target;
  secondaryTarget?: Target;
}

/** Capability follows the borrowed master while Exchange is active. */
export function getEffectiveExperimentalMaster(
  state: GameState,
  context: ExperimentContextV1 | undefined,
  actor: PlayerId = getEffectiveActor(state),
): ExperimentalMasterId | undefined {
  if (!context) {
    return undefined;
  }
  const capabilityOwner = state.players[actor].masterActionsExchanged
    ? actor === "player" ? "cpu" : "player"
    : actor;
  return resolveExperimentalMasterForSeat(context, capabilityOwner);
}

export function listExperimentalMasterActionCommands(
  state: GameState,
  context: ExperimentContextV1 | undefined,
): ExperimentalMasterActionCommand[] {
  const actor = getEffectiveActor(state);
  const master = getEffectiveExperimentalMaster(state, context, actor);
  if (!master || state.winner || state.pendingLevelUp) {
    return [];
  }
  const actorState = actor === state.currentPlayer ? state : { ...state, currentPlayer: actor };
  return listMasterLabActionOptions(actorState, master).filter((option) => option.kind !== "builtin").map((option) => ({
    master,
    actionId: option.actionId,
    target: structuredClone(option.target),
    ...(option.secondaryTarget ? { secondaryTarget: structuredClone(option.secondaryTarget) } : {}),
  }));
}

/** Native action allowlist for an overlay; undefined means use the standard master rules. */
export function getExperimentalNativeMasterActionIds(
  state: GameState,
  context: ExperimentContextV1 | undefined,
  actor: PlayerId = getEffectiveActor(state),
): MasterActionId[] | undefined {
  const master = getEffectiveExperimentalMaster(state, context, actor);
  if (!master) {
    return undefined;
  }
  return getMasterLabCandidate(master).actions.flatMap((action) =>
    action.kind === "builtin" ? [action.actionId] : [],
  );
}

export function isExperimentalSessionMasterActionAllowed(
  state: GameState,
  context: ExperimentContextV1 | undefined,
  actionId: MasterActionId,
  actor: PlayerId = getEffectiveActor(state),
): boolean {
  const allowed = getExperimentalNativeMasterActionIds(state, context, actor);
  return allowed === undefined || allowed.includes(actionId);
}

export function applyExperimentalMasterAction(
  state: GameState,
  context: ExperimentContextV1 | undefined,
  command: ExperimentalMasterActionCommand,
): GameState {
  const actor = getEffectiveActor(state);
  if (!validateExperimentalMasterActionCommand(state, context, command)) {
    throw new Error("現在の席がこの実験マスター特技を使用できません");
  }
  const actorState = actor === state.currentPlayer ? state : { ...state, currentPlayer: actor };
  const next = playMasterLabAction(actorState, {
    candidateId: command.master,
    actionId: command.actionId,
    target: command.target,
    ...(command.secondaryTarget ? { secondaryTarget: command.secondaryTarget } : {}),
  });
  if (actor === state.currentPlayer) {
    return next;
  }
  // A pending prompt normally owns the current transaction. Preserve the stored turn seat.
  next.currentPlayer = state.currentPlayer;
  return next;
}

/** Session-aware native action dispatcher shared by human UI and replay. */
export function applySessionNativeMasterAction(
  state: GameState,
  context: ExperimentContextV1 | undefined,
  actionId: MasterActionId,
  target: Target,
): GameState {
  const actor = getEffectiveActor(state);
  if (!isExperimentalSessionMasterActionAllowed(state, context, actionId, actor)) {
    throw new Error("この実験マスターでは使用できない通常特技です");
  }
  return useMasterAction(state, actionId, target);
}

export function validateExperimentalMasterActionCommand(
  state: GameState,
  context: ExperimentContextV1 | undefined,
  command: ExperimentalMasterActionCommand,
): boolean {
  return listExperimentalMasterActionCommands(state, context).some((option) =>
    option.master === command.master &&
    option.actionId === command.actionId &&
    sameTarget(option.target, command.target) &&
    sameOptionalTarget(option.secondaryTarget, command.secondaryTarget),
  );
}

export function experimentalMasterCandidateName(master: ExperimentalMasterId): string {
  return getMasterLabCandidate(master).name;
}

function sameOptionalTarget(left: Target | undefined, right: Target | undefined): boolean {
  return left === undefined ? right === undefined : right !== undefined && sameTarget(left, right);
}

function sameTarget(left: Target, right: Target): boolean {
  return left.kind === right.kind && (left.kind === "monster"
    ? right.kind === "monster" && left.slotKey === right.slotKey
    : right.kind === "master" && left.playerId === right.playerId);
}
