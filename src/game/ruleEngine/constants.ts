import type { Lane, PlayerId, Row, SlotKey } from "../types";

export const MASTER_HP = 10;
export const HAND_LIMIT = 6;
export const DRAW_FIVE_HAND_SIZE = 5;
export const MASTER_ATTACK_COST = 3;
export const MASTER_ATTACK_POWER = 2;
export const WAKE_UP_COST = 2;
export const SHIELD_COST = 2;

export const PLAYER_ORDER: PlayerId[] = ["player", "cpu"];
export const ROW_ORDER: Row[] = ["front", "back"];
export const LANE_ORDER: Lane[] = ["left", "right"];

export const PLAYER_SLOT_ORDER: Record<PlayerId, SlotKey[]> = {
  player: ["player_front_left", "player_front_right", "player_back_left", "player_back_right"],
  cpu: ["cpu_front_left", "cpu_front_right", "cpu_back_left", "cpu_back_right"],
};

export const FIELD_ORDER: SlotKey[] = [
  "cpu_back_left",
  "cpu_back_right",
  "cpu_front_left",
  "cpu_front_right",
  "player_front_left",
  "player_front_right",
  "player_back_left",
  "player_back_right",
];
