export type PlayerId = "player" | "cpu";
export type Row = "front" | "back";
export type Lane = "left" | "right";
export type SlotKey = `${PlayerId}_${Row}_${Lane}`;

export type CardType = "monster" | "magic";
export type MonsterRole = "front" | "back";
export type MonsterStatus = "prepared" | "active";
export type RangeTag = "adjacent" | "one_skip" | "any_monster" | "any_target" | "master";
export type MagicTargetKind = "ally_monster" | "enemy_monster" | "enemy_master";

export interface CardInstance {
  instanceId: string;
  cardId: string;
}

export interface CommandDef {
  id: string;
  name: string;
  power: number;
  range: RangeTag;
  stoneCost?: number;
  recoilDamage?: number;
}

export interface MonsterLevelDef {
  level: number;
  maxHp: number;
  commands: CommandDef[];
}

export interface MonsterCardDef {
  id: string;
  name: string;
  type: "monster";
  role: MonsterRole;
  maxLevel: number;
  actionLimit?: number;
  levels: MonsterLevelDef[];
}

export interface MagicCardDef {
  id: string;
  name: string;
  type: "magic";
  cost: number;
  description: string;
  targetKinds: MagicTargetKind[];
}

export type CardDef = MonsterCardDef | MagicCardDef;

export interface MonsterState {
  instanceId: string;
  cardId: string;
  owner: PlayerId;
  hp: number;
  level: number;
  status: MonsterStatus;
  investedStones: number;
  actionCount: number;
  actionLimit: number;
  focused: boolean;
  powerUp: boolean;
  shielded: boolean;
}

export interface SlotState {
  key: SlotKey;
  owner: PlayerId;
  row: Row;
  lane: Lane;
  monster?: MonsterState;
}

export interface PlayerState {
  id: PlayerId;
  masterHp: number;
  stones: number;
  deck: CardInstance[];
  hand: CardInstance[];
  discard: CardInstance[];
  turnsStarted: number;
}

export interface PendingLevelUp {
  playerId: PlayerId;
  attackerSlotKey: SlotKey;
  maxLevels: number;
  recoilDamage: number;
}

export interface GameState {
  players: Record<PlayerId, PlayerState>;
  slots: Record<SlotKey, SlotState>;
  currentPlayer: PlayerId;
  turnNumber: number;
  log: string[];
  winner?: PlayerId;
  pendingLevelUp?: PendingLevelUp;
}

export type Target =
  | { kind: "monster"; slotKey: SlotKey }
  | { kind: "master"; playerId: PlayerId };

export interface CommandAction {
  attackerSlotKey: SlotKey;
  commandId: string;
  target: Target;
}

export interface MagicAction {
  handInstanceId: string;
  target: Target;
}

export type MasterActionId = "master_attack" | "wake_up" | "shield";
