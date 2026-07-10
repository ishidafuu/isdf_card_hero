import type { GameState } from "./game/types";

export interface BattleLogCommentRecord {
  logId: number;
  entry: string;
  comment: string;
}

export type BattleLogComments = Record<number, BattleLogCommentRecord>;

export function getDisplayLogStartId(game: GameState): number {
  if (game.logOffset !== undefined) {
    return game.logOffset;
  }
  const retainedHistoryLength = game.eventLog?.length ?? game.log.length;
  return Math.max(0, retainedHistoryLength - game.log.length);
}

export function getDisplayLogId(game: GameState, displayIndex: number): number {
  return getDisplayLogStartId(game) + displayIndex;
}

export function getBattleLogComment(
  comments: BattleLogComments,
  game: GameState,
  displayIndex: number,
): string {
  return comments[getDisplayLogId(game, displayIndex)]?.comment ?? "";
}

export function updateBattleLogComment(
  comments: BattleLogComments,
  game: GameState,
  displayIndex: number,
  value: string,
): BattleLogComments {
  const logId = getDisplayLogId(game, displayIndex);
  const next = { ...comments };
  if (!value.trim()) {
    delete next[logId];
    return next;
  }
  next[logId] = {
    logId,
    entry: game.log[displayIndex] ?? "",
    comment: value,
  };
  return next;
}

export function pruneBattleLogCommentsForGame(
  comments: BattleLogComments,
  game: GameState,
): BattleLogComments {
  const startId = getDisplayLogStartId(game);
  const endId = startId + game.log.length;
  let changed = false;
  const next: BattleLogComments = {};

  for (const record of Object.values(comments)) {
    if (record.logId >= endId) {
      changed = true;
      continue;
    }
    if (record.logId >= startId && game.log[record.logId - startId] !== record.entry) {
      changed = true;
      continue;
    }
    next[record.logId] = record;
  }

  return changed ? next : comments;
}

export function listBattleLogComments(comments: BattleLogComments): BattleLogCommentRecord[] {
  return Object.values(comments).sort((left, right) => left.logId - right.logId);
}
