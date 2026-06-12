export type PlayerId = "player" | "cpu";
export type Row = "front" | "back";
export type Lane = "left" | "right";
export type SlotKey = `${PlayerId}_${Row}_${Lane}`;

export type CardType = "monster" | "magic";
export type CardPool = "normal" | "special";
export type MonsterRole = "front" | "back";
export type MonsterStatus = "prepared" | "active";
export type RangeTag =
  | "adjacent"
  | "one_skip"
  | "any_monster"
  | "any_target"
  | "master"
  | "two_skip"
  | "straight"
  | "piercing"
  | "decreasing_straight"
  | "line"
  | "special";
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
  rangeText?: string;
  stoneCost?: number;
  recoilDamage?: number;
  effectText?: string;
  implemented?: boolean;
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
  pool?: CardPool;
  role: MonsterRole;
  maxLevel: number;
  actionLimit?: number;
  sourceNo?: number;
  sourceUrl?: string;
  icon?: string;
  rarity?: number;
  catchcopy?: string;
  notes?: string[];
  levels: MonsterLevelDef[];
}

export interface MagicCardDef {
  id: string;
  name: string;
  type: "magic";
  pool?: CardPool;
  cost: number;
  description: string;
  targetKinds: MagicTargetKind[];
  sourceNo?: number;
  sourceUrl?: string;
  icon?: string;
  rarity?: number;
  catchcopy?: string;
  category?: string;
  continuance?: string;
  implemented?: boolean;
  notes?: string[];
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
  powerModifier?: number;
  powerOverride?: number;
  cannotMove?: boolean;
  levelFixed?: boolean;
  immune?: boolean;
  halfShielded?: boolean;
  oneShotShield?: boolean;
  reviveOnDefeat?: boolean;
  shadowCursed?: boolean;
  scapegoat?: boolean;
  canAttackAnywhere?: boolean;
  stoneCostMultiplier?: number;
  commandSealed?: boolean;
  cannotActUntilDamaged?: boolean;
  berserkPower?: boolean;
  dodgeChance?: boolean;
  dragonShield?: boolean;
  provokeTargetSlotKey?: SlotKey;
  deathChainSlotKey?: SlotKey;
  darkHoleSlotKey?: SlotKey;
  stoneCurse?: boolean;
  damageCurse?: boolean;
  hollow?: boolean;
  damageGuarded?: boolean;
  revivedOnce?: boolean;
  usedCommandIds?: string[];
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
  masterPowerBonus?: number;
  deck: CardInstance[];
  hand: CardInstance[];
  discard: CardInstance[];
  turnsStarted: number;
  masterActionsExchanged?: boolean;
}

export interface MoveHistoryEntry {
  playerId: PlayerId;
  fromSlotKey: SlotKey;
  toSlotKey: SlotKey;
  moverInstanceId: string;
  swappedInstanceId?: string;
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
  firstPlayer: PlayerId;
  turnNumber: number;
  randomSeed: number;
  log: string[];
  winner?: PlayerId;
  pendingLevelUp?: PendingLevelUp;
  turnMoveHistory?: MoveHistoryEntry[];
}

export type Target =
  | { kind: "monster"; slotKey: SlotKey }
  | { kind: "master"; playerId: PlayerId };

export interface CommandAction {
  attackerSlotKey: SlotKey;
  commandId: string;
  target: Target;
  secondaryTarget?: Target;
  secondaryHandInstanceId?: string;
}

export interface MagicAction {
  handInstanceId: string;
  target: Target;
  secondaryTarget?: Target;
  secondaryHandInstanceId?: string;
  selectedHandInstanceIds?: string[];
  searchCategory?: "front" | "back" | "magic";
}

export type MasterActionId = "master_attack" | "wake_up" | "shield";
