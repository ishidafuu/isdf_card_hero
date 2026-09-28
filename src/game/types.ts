export type PlayerId = "player" | "cpu";
export type MasterId = "white" | "black";
export type MemberRatingKey = "proBlack" | "proWhite";
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

export interface MemberRating {
  average: number;
  votes: number;
}

export type MemberRatings = Partial<Record<MemberRatingKey, MemberRating>>;

export type RecoilDamage = number | "power";

export interface CommandDef {
  id: string;
  name: string;
  power: number;
  range: RangeTag;
  rangeText?: string;
  stoneCost?: number;
  recoilDamage?: RecoilDamage;
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
  evolvesFrom?: string[];
  role: MonsterRole;
  maxLevel: number;
  actionLimit?: number;
  sourceNo?: number;
  sourceUrl?: string;
  icon?: string;
  rarity?: number;
  memberRatings?: MemberRatings;
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
  memberRatings?: MemberRatings;
  catchcopy?: string;
  category?: string;
  continuance?: string;
  implemented?: boolean;
  notes?: string[];
}

export type CardDef = MonsterCardDef | MagicCardDef;

export interface MirroredFormSnapshot {
  cardId: string;
  level: number;
  actionLimit: number;
  revivedOnce?: boolean;
  usedCommandIds?: string[];
  hollow?: boolean;
}

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
  masterAttackBlockedUntilTurnEnd?: boolean;
  revivedOnce?: boolean;
  usedCommandIds?: string[];
  mirroredFormOriginal?: MirroredFormSnapshot;
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
  masterId: MasterId;
  masterHp: number;
  stones: number;
  masterPowerBonus?: number;
  masterFrozen?: boolean;
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

export interface MasterActionHistoryEntry {
  playerId: PlayerId;
  actionId: MasterActionId;
  target: Target;
  turnNumber: number;
}

export interface AiRolloutDecisionHistoryEntry {
  playerId: PlayerId;
  turnNumber: number;
}

export interface PendingLevelUp {
  playerId: PlayerId;
  attackerSlotKey: SlotKey;
  maxLevels: number;
  superOptions?: SuperLevelUpOption[];
}

export interface SuperLevelUpOption {
  handInstanceId: string;
  cardId: string;
}

export interface GameState {
  players: Record<PlayerId, PlayerState>;
  slots: Record<SlotKey, SlotState>;
  currentPlayer: PlayerId;
  firstPlayer: PlayerId;
  turnNumber: number;
  randomSeed: number;
  log: string[];
  logOffset?: number;
  eventLog?: string[];
  deckoutOccurred?: boolean;
  winner?: PlayerId;
  pendingLevelUp?: PendingLevelUp;
  turnMoveHistory?: MoveHistoryEntry[];
  turnMasterActionHistory?: MasterActionHistoryEntry[];
  turnAiRolloutDecisionHistory?: AiRolloutDecisionHistoryEntry[];
  aiDecisionHistory?: AiDecisionHistoryEntry[];
  humanActionHistory?: HumanActionHistoryEntry[];
  masterActionsExchangeExpiresOnStartOf?: PlayerId;
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
  deckTopOrderInstanceIds?: string[];
  searchCategory?: "front" | "back" | "magic" | "special";
  rotationDirection?: "clockwise" | "counterclockwise";
}

export type MasterActionId = "master_attack" | "wake_up" | "shield" | "berserk_power" | "earth_anger";

export interface AiTurnPlanTrace {
  planId: string;
  phase: "root" | "continuation";
  step: number;
  length: number;
  ownHandoffScore: number;
  responseScore: number;
  generatedPlanCount: number;
  comparedRootCount: number;
  opponentPlanCount: number;
  opponentSampleCount?: number;
  opponentWorstResponseScore?: number;
  opponentKnowledge?: string;
  actions: string[];
  opponentActions: string[];
}

export interface AiDecisionTraceSnapshot {
  totalScore?: number;
  baseScore?: number;
  alternatives?: Array<{
    label: string;
    totalScore: number;
    scoreGap: number;
  }>;
  turnPlan?: AiTurnPlanTrace;
}

export type AiDecisionSnapshot = (
  | { type: "attack"; action: CommandAction }
  | { type: "master_action"; actionId: MasterActionId; target: Target }
  | { type: "summon"; handInstanceId: string; slotKey: SlotKey }
  | { type: "magic"; action: MagicAction }
  | { type: "move"; fromSlotKey: SlotKey; toSlotKey: SlotKey }
  | { type: "focus"; slotKey: SlotKey }
  | { type: "end_turn"; discardHandInstanceIds?: string[] }
  | { type: "master_hp_draw" }
  | { type: "resolve_level_up"; levels: number; superHandInstanceId?: string }
) & {
  reason: string;
  score: number;
  trace?: AiDecisionTraceSnapshot;
};

export type AiDecisionStateSnapshot = Omit<
  GameState,
  "log" | "logOffset" | "eventLog" | "aiDecisionHistory" | "humanActionHistory"
>;

export interface AiDecisionHistoryEntry {
  sequence: number;
  logIndex: number;
  playerId: PlayerId;
  turnNumber: number;
  decisionKey: string;
  decision: AiDecisionSnapshot;
  stateBefore: AiDecisionStateSnapshot;
}

export type HumanActionSnapshot =
  | { type: "attack"; action: CommandAction }
  | { type: "master_action"; actionId: MasterActionId; target: Target }
  | { type: "summon"; handInstanceId: string; slotKey: SlotKey }
  | { type: "magic"; action: MagicAction }
  | { type: "move"; fromSlotKey: SlotKey; toSlotKey: SlotKey }
  | { type: "focus"; slotKey: SlotKey }
  | { type: "master_hp_draw" }
  | { type: "discard_hand"; handInstanceId: string }
  | { type: "resolve_level_up"; levels: number; superHandInstanceId?: string }
  | { type: "end_turn"; discardHandInstanceIds?: string[] };

export interface HumanActionHistoryEntry {
  sequence: number;
  logIndex: number;
  playerId: PlayerId;
  turnNumber: number;
  actionKey: string;
  action: HumanActionSnapshot;
  stateBefore: AiDecisionStateSnapshot;
}
