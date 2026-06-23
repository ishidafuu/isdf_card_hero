export type SeId =
  | "select"
  | "confirm"
  | "summon"
  | "attack"
  | "damage"
  | "magic"
  | "shield"
  | "focus"
  | "turn"
  | "invalid"
  | "win";

export const SE_SOURCES: Record<SeId, string> = {
  select: "/audio/se/select.mp3",
  confirm: "/audio/se/confirm.mp3",
  summon: "/audio/se/summon.mp3",
  attack: "/audio/se/attack.mp3",
  damage: "/audio/se/damage.mp3",
  magic: "/audio/se/magic.mp3",
  shield: "/audio/se/shield.mp3",
  focus: "/audio/se/focus.mp3",
  turn: "/audio/se/turn.mp3",
  invalid: "/audio/se/invalid.mp3",
  win: "/audio/se/win.mp3",
};
