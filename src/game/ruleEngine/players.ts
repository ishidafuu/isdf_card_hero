import type { PlayerId } from "../types";

export function opponentOf(playerId: PlayerId): PlayerId {
  return playerId === "player" ? "cpu" : "player";
}

export function playerLabel(playerId: PlayerId): string {
  return playerId === "player" ? "プレイヤー" : "CPU";
}
