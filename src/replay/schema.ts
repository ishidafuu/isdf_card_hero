import type {
  AiDecisionSnapshot,
  GameState,
  HumanActionSnapshot,
  MagicAction,
  MonsterState,
  PlayerId,
  SlotKey,
  Target,
} from "../game/types";
import { getCardDef, getCardPool, getMonsterDef } from "../game/cards";

const SLOT_KEYS = [
  "player_front_left", "player_front_right", "player_back_left", "player_back_right",
  "cpu_front_left", "cpu_front_right", "cpu_back_left", "cpu_back_right",
] as const;
const SLOT_KEY_SET = new Set<string>(SLOT_KEYS);
const MASTER_IDS = new Set(["white", "black"]);
const MASTER_ACTIONS = new Set(["master_attack", "wake_up", "shield", "berserk_power", "earth_anger"]);
const MAGIC_CATEGORIES = new Set(["front", "back", "magic", "special"]);

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: JsonRecord, keys: readonly string[]): boolean {
  const allowed = new Set(keys);
  return Object.keys(value).every((key) => allowed.has(key));
}

function isString(value: unknown, maxLength = 20_000): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= maxLength;
}

function isOptionalString(value: unknown, maxLength = 20_000): boolean {
  return value === undefined || isString(value, maxLength);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isInteger(value: unknown, minimum = 0): value is number {
  return Number.isSafeInteger(value) && (value as number) >= minimum;
}

function isStringArray(value: unknown, maximum = 100_000): value is string[] {
  return Array.isArray(value) && value.length <= maximum && value.every((entry) => isString(entry));
}

function isOptionalStringArray(value: unknown, maximum = 100_000): boolean {
  return value === undefined || isStringArray(value, maximum);
}

function isPlayerId(value: unknown): value is PlayerId {
  return value === "player" || value === "cpu";
}

function isSlotKey(value: unknown): value is SlotKey {
  return typeof value === "string" && SLOT_KEY_SET.has(value);
}

function isTarget(value: unknown): value is Target {
  if (!isRecord(value)) return false;
  if (value.kind === "monster") return hasOnlyKeys(value, ["kind", "slotKey"]) && isSlotKey(value.slotKey);
  if (value.kind === "master") return hasOnlyKeys(value, ["kind", "playerId"]) && isPlayerId(value.playerId);
  return false;
}

function isKnownCardId(value: unknown): value is string {
  if (!isString(value, 256)) return false;
  try {
    getCardDef(value);
    return true;
  } catch {
    return false;
  }
}

function isCardInstance(value: unknown): boolean {
  return isRecord(value) && hasOnlyKeys(value, ["instanceId", "cardId"]) &&
    isString(value.instanceId, 256) && isKnownCardId(value.cardId);
}

function isCardInstanceArray(value: unknown): value is Array<{ instanceId: string; cardId: string }> {
  return Array.isArray(value) && value.length <= 100_000 && value.every(isCardInstance);
}

function isPlayerState(value: unknown, playerId: PlayerId): boolean {
  if (!isRecord(value) || !hasOnlyKeys(value, [
    "id", "masterId", "masterHp", "stones", "masterPowerBonus", "masterFrozen", "deck", "hand", "discard",
    "turnsStarted", "masterActionsExchanged",
  ])) return false;
  return value.id === playerId && typeof value.masterId === "string" && MASTER_IDS.has(value.masterId) &&
    isInteger(value.masterHp) && isInteger(value.stones) &&
    optionalNumber(value.masterPowerBonus) && optionalBoolean(value.masterFrozen) &&
    isCardInstanceArray(value.deck) && isCardInstanceArray(value.hand) && isCardInstanceArray(value.discard) &&
    isInteger(value.turnsStarted) && optionalBoolean(value.masterActionsExchanged);
}

function optionalBoolean(value: unknown): boolean {
  return value === undefined || typeof value === "boolean";
}

function optionalNumber(value: unknown): boolean {
  return value === undefined || isFiniteNumber(value);
}

function isMirroredFormSnapshot(value: unknown): boolean {
  if (!isRecord(value) || !hasOnlyKeys(value, ["cardId", "level", "actionLimit", "revivedOnce", "usedCommandIds", "hollow"]) ||
    !isInteger(value.level, 1) || !isInteger(value.actionLimit, 1)) return false;
  try {
    const definition = getMonsterDef(String(value.cardId));
    return definition.levels.some((level) => level.level === value.level) &&
    optionalBoolean(value.revivedOnce) && isOptionalStringArray(value.usedCommandIds, 200) && optionalBoolean(value.hollow);
  } catch {
    return false;
  }
}

const MONSTER_BOOLEAN_KEYS = [
  "focused", "powerUp", "shielded", "cannotMove", "levelFixed", "immune", "halfShielded", "oneShotShield",
  "reviveOnDefeat", "shadowCursed", "scapegoat", "canAttackAnywhere", "commandSealed", "cannotActUntilDamaged",
  "berserkPower", "dodgeChance", "dragonShield", "stoneCurse", "damageCurse", "hollow", "damageGuarded",
  "masterAttackBlockedUntilTurnEnd", "revivedOnce",
] as const;
const REQUIRED_MONSTER_BOOLEAN_KEYS = ["focused", "powerUp", "shielded"] as const;
const MONSTER_NUMBER_KEYS = ["powerModifier", "powerOverride", "stoneCostMultiplier"] as const;
const MONSTER_STRING_KEYS = ["provokeTargetSlotKey", "deathChainSlotKey", "darkHoleSlotKey"] as const;
const MONSTER_KEYS = [
  "instanceId", "cardId", "owner", "hp", "level", "status", "investedStones", "actionCount", "actionLimit",
  ...MONSTER_BOOLEAN_KEYS, ...MONSTER_NUMBER_KEYS, ...MONSTER_STRING_KEYS, "usedCommandIds", "mirroredFormOriginal",
] as const;

function isMonsterState(value: unknown): value is MonsterState {
  if (!isRecord(value) || !hasOnlyKeys(value, MONSTER_KEYS)) return false;
  if (!(isString(value.instanceId, 256) && isKnownCardId(value.cardId) && isPlayerId(value.owner) &&
    isInteger(value.hp, 1) && isInteger(value.level, 1) &&
    (value.status === "prepared" || value.status === "active") &&
    isInteger(value.investedStones) && isInteger(value.actionCount) && isInteger(value.actionLimit, 1))) return false;
  let definition;
  try {
    definition = getCardDef(value.cardId);
  } catch {
    return false;
  }
  if (definition.type !== "monster" || !definition.levels.some((level) => level.level === value.level)) return false;
  if (!REQUIRED_MONSTER_BOOLEAN_KEYS.every((key) => typeof value[key] === "boolean")) return false;
  if (!MONSTER_BOOLEAN_KEYS.every((key) => optionalBoolean(value[key]))) return false;
  if (!MONSTER_NUMBER_KEYS.every((key) => optionalNumber(value[key]))) return false;
  if (!MONSTER_STRING_KEYS.every((key) => value[key] === undefined || isSlotKey(value[key]))) return false;
  return isOptionalStringArray(value.usedCommandIds, 500) &&
    (value.mirroredFormOriginal === undefined || isMirroredFormSnapshot(value.mirroredFormOriginal));
}

function isSlotState(value: unknown, key: SlotKey): boolean {
  const [owner, row, lane] = key.split("_");
  const monster = isRecord(value) ? value.monster : undefined;
  return isRecord(value) && hasOnlyKeys(value, ["key", "owner", "row", "lane", "monster"]) &&
    value.key === key && value.owner === owner && value.row === row && value.lane === lane &&
    (monster === undefined || (isMonsterState(monster) && monster.owner === owner));
}

function isSuperLevelUpOption(value: unknown): boolean {
  if (!isRecord(value) || !hasOnlyKeys(value, ["handInstanceId", "cardId"]) || !isString(value.handInstanceId, 256)) return false;
  try {
    const definition = getMonsterDef(String(value.cardId));
    return getCardPool(definition) === "special";
  } catch {
    return false;
  }
}

function isMoveHistoryEntry(value: unknown): boolean {
  return isRecord(value) && hasOnlyKeys(value, ["playerId", "fromSlotKey", "toSlotKey", "moverInstanceId", "swappedInstanceId"]) &&
    isPlayerId(value.playerId) && isSlotKey(value.fromSlotKey) && isSlotKey(value.toSlotKey) &&
    isString(value.moverInstanceId, 256) && isOptionalString(value.swappedInstanceId, 256);
}

function isMasterActionHistoryEntry(value: unknown): boolean {
  return isRecord(value) && hasOnlyKeys(value, ["playerId", "actionId", "target", "turnNumber"]) &&
    isPlayerId(value.playerId) && typeof value.actionId === "string" && MASTER_ACTIONS.has(value.actionId) &&
    isTarget(value.target) && isInteger(value.turnNumber);
}

function isCommandAction(value: unknown): boolean {
  if (!isRecord(value) || !hasOnlyKeys(value, ["attackerSlotKey", "commandId", "target", "secondaryTarget", "secondaryHandInstanceId"])) return false;
  return isSlotKey(value.attackerSlotKey) && isString(value.commandId, 256) && isTarget(value.target) &&
    (value.secondaryTarget === undefined || isTarget(value.secondaryTarget)) &&
    isOptionalString(value.secondaryHandInstanceId, 256);
}

function hasUniqueStrings(value: string[] | undefined): boolean {
  return !value || new Set(value).size === value.length;
}

function isMagicAction(value: unknown): value is MagicAction {
  if (!isRecord(value) || !hasOnlyKeys(value, [
    "handInstanceId", "target", "secondaryTarget", "secondaryHandInstanceId", "selectedHandInstanceIds",
    "deckTopOrderInstanceIds", "searchCategory", "rotationDirection",
  ])) return false;
  return isString(value.handInstanceId, 256) && isTarget(value.target) &&
    (value.secondaryTarget === undefined || isTarget(value.secondaryTarget)) &&
    isOptionalString(value.secondaryHandInstanceId, 256) &&
    isOptionalStringArray(value.selectedHandInstanceIds, 100) && hasUniqueStrings(value.selectedHandInstanceIds as string[] | undefined) &&
    isOptionalStringArray(value.deckTopOrderInstanceIds, 100) && hasUniqueStrings(value.deckTopOrderInstanceIds as string[] | undefined) &&
    (value.searchCategory === undefined || (typeof value.searchCategory === "string" && MAGIC_CATEGORIES.has(value.searchCategory))) &&
    (value.rotationDirection === undefined || value.rotationDirection === "clockwise" || value.rotationDirection === "counterclockwise");
}

function isHumanAction(value: unknown): value is HumanActionSnapshot {
  if (!isRecord(value) || typeof value.type !== "string") return false;
  switch (value.type) {
    case "attack":
      return hasOnlyKeys(value, ["type", "action"]) && isCommandAction(value.action);
    case "master_action":
      return hasOnlyKeys(value, ["type", "actionId", "target"]) && typeof value.actionId === "string" && MASTER_ACTIONS.has(value.actionId) && isTarget(value.target);
    case "summon":
      return hasOnlyKeys(value, ["type", "handInstanceId", "slotKey"]) && isString(value.handInstanceId, 256) && isSlotKey(value.slotKey);
    case "magic":
      return hasOnlyKeys(value, ["type", "action"]) && isMagicAction(value.action);
    case "move":
      return hasOnlyKeys(value, ["type", "fromSlotKey", "toSlotKey"]) && isSlotKey(value.fromSlotKey) && isSlotKey(value.toSlotKey);
    case "focus":
      return hasOnlyKeys(value, ["type", "slotKey"]) && isSlotKey(value.slotKey);
    case "master_hp_draw":
      return hasOnlyKeys(value, ["type"]);
    case "discard_hand":
      return hasOnlyKeys(value, ["type", "handInstanceId"]) && isString(value.handInstanceId, 256);
    case "resolve_level_up":
      return hasOnlyKeys(value, ["type", "levels", "superHandInstanceId"]) && isInteger(value.levels) && isOptionalString(value.superHandInstanceId, 256);
    case "end_turn":
      return hasOnlyKeys(value, ["type", "discardHandInstanceIds"]) && isOptionalStringArray(value.discardHandInstanceIds, 100) &&
        hasUniqueStrings(value.discardHandInstanceIds as string[] | undefined);
    default:
      return false;
  }
}

function isAiDecision(value: unknown): value is AiDecisionSnapshot {
  if (!isRecord(value) || typeof value.type !== "string" || !isString(value.reason, 20_000) || !isFiniteNumber(value.score)) return false;
  const optional = hasOnlyKeys(value, [
    "type", "reason", "score", "trace", "action", "actionId", "target", "handInstanceId", "slotKey",
    "fromSlotKey", "toSlotKey", "discardHandInstanceIds", "levels", "superHandInstanceId",
    "searchCategory", "rotationDirection",
  ]);
  if (!optional || !isOptionalAiTrace(value.trace)) return false;
  const decision = { ...value } as JsonRecord;
  delete decision.reason; delete decision.score; delete decision.trace;
  const searchCategory = decision.searchCategory;
  const rotationDirection = decision.rotationDirection;
  delete decision.searchCategory;
  delete decision.rotationDirection;
  if (value.type === "discard_hand") return false;
  if (searchCategory !== undefined && !(typeof searchCategory === "string" && MAGIC_CATEGORIES.has(searchCategory))) return false;
  if (rotationDirection !== undefined && rotationDirection !== "clockwise" && rotationDirection !== "counterclockwise") return false;
  return isHumanAction({ ...decision, type: value.type });
}

function isOptionalAiTrace(value: unknown): boolean {
  if (value === undefined) return true;
  if (!isRecord(value) || !hasOnlyKeys(value, ["totalScore", "baseScore", "alternatives", "turnPlan"])) return false;
  if (!optionalNumber(value.totalScore) || !optionalNumber(value.baseScore)) return false;
  if (value.alternatives !== undefined && (!Array.isArray(value.alternatives) || value.alternatives.length > 100 ||
    !value.alternatives.every((entry) => isRecord(entry) && hasOnlyKeys(entry, ["label", "totalScore", "scoreGap"]) &&
      isString(entry.label, 2_000) && isFiniteNumber(entry.totalScore) && isFiniteNumber(entry.scoreGap)))) return false;
  if (value.turnPlan === undefined) return true;
  const plan = value.turnPlan;
  return isRecord(plan) && hasOnlyKeys(plan, [
    "planId", "phase", "step", "length", "ownHandoffScore", "responseScore", "generatedPlanCount",
    "comparedRootCount", "opponentPlanCount", "opponentSampleCount", "opponentWorstResponseScore",
    "opponentKnowledge", "actions", "opponentActions",
  ]) && isString(plan.planId, 256) && (plan.phase === "root" || plan.phase === "continuation") &&
    isInteger(plan.step, 1) && isInteger(plan.length, 1) && isFiniteNumber(plan.ownHandoffScore) &&
    isFiniteNumber(plan.responseScore) && isInteger(plan.generatedPlanCount) && isInteger(plan.comparedRootCount) &&
    isInteger(plan.opponentPlanCount) && optionalNumber(plan.opponentSampleCount) && optionalNumber(plan.opponentWorstResponseScore) &&
    isOptionalString(plan.opponentKnowledge, 4_000) && isStringArray(plan.actions, 500) && isStringArray(plan.opponentActions, 500);
}

function isStateSnapshot(value: unknown): boolean {
  return validateGameState(value, true);
}

function isAiDecisionHistoryEntry(value: unknown): boolean {
  return isRecord(value) && hasOnlyKeys(value, ["sequence", "logIndex", "playerId", "turnNumber", "decisionKey", "decision", "stateBefore"]) &&
    isInteger(value.sequence, 1) && isInteger(value.logIndex) && isPlayerId(value.playerId) && isInteger(value.turnNumber) &&
    isString(value.decisionKey, 10_000) && isAiDecision(value.decision) && isStateSnapshot(value.stateBefore);
}

function isHumanActionHistoryEntry(value: unknown): boolean {
  return isRecord(value) && hasOnlyKeys(value, ["sequence", "logIndex", "playerId", "turnNumber", "actionKey", "action", "stateBefore"]) &&
    isInteger(value.sequence, 1) && isInteger(value.logIndex) && isPlayerId(value.playerId) && isInteger(value.turnNumber) &&
    isString(value.actionKey, 10_000) && isHumanAction(value.action) && isStateSnapshot(value.stateBefore);
}

function isOptionalEntryArray(value: unknown, validator: (entry: unknown) => boolean): boolean {
  if (value === undefined) return true;
  if (!Array.isArray(value) || value.length > 240 || !value.every(validator)) return false;
  return value.every((entry, index) => index === 0 || (value[index - 1] as { sequence: number }).sequence < (entry as { sequence: number }).sequence);
}

function isGameState(value: unknown): value is GameState {
  return validateGameState(value, false);
}

function validateGameState(value: unknown, snapshot: boolean): boolean {
  if (!isRecord(value)) return false;
  const snapshotKeys = ["players", "slots", "currentPlayer", "firstPlayer", "turnNumber", "randomSeed", "deckoutOccurred", "winner", "pendingLevelUp", "turnMoveHistory", "turnMasterActionHistory", "turnAiRolloutDecisionHistory", "masterActionsExchangeExpiresOnStartOf"];
  const fullKeys = [...snapshotKeys, "log", "logOffset", "eventLog", "aiDecisionHistory", "humanActionHistory"];
  const players = value.players;
  const slots = value.slots;
  if (!hasOnlyKeys(value, snapshot ? snapshotKeys : fullKeys) || !isRecord(players) || !hasOnlyKeys(players, ["player", "cpu"]) ||
    !isRecord(slots) || !hasOnlyKeys(slots, SLOT_KEYS)) return false;
  if (!isPlayerState(players.player, "player") || !isPlayerState(players.cpu, "cpu") ||
    !SLOT_KEYS.every((slot) => isSlotState(slots[slot], slot)) ||
    !isPlayerId(value.currentPlayer) || !isPlayerId(value.firstPlayer) || !isInteger(value.turnNumber) ||
    !isInteger(value.randomSeed) || (value.randomSeed as number) > 0xffff_ffff) return false;
  if (!snapshot && (!isStringArray(value.log) || !optionalNumber(value.logOffset) ||
    (value.eventLog !== undefined && !isStringArray(value.eventLog)))) return false;
  if (!optionalBoolean(value.deckoutOccurred) || (value.winner !== undefined && !isPlayerId(value.winner)) ||
    !optionalPlayerId(value.masterActionsExchangeExpiresOnStartOf)) return false;
  if (value.pendingLevelUp !== undefined && !isPendingLevelUp(value.pendingLevelUp, players, slots)) return false;
  if (value.turnMoveHistory !== undefined && (!Array.isArray(value.turnMoveHistory) || value.turnMoveHistory.length > 1_000 || !value.turnMoveHistory.every(isMoveHistoryEntry))) return false;
  if (value.turnMasterActionHistory !== undefined && (!Array.isArray(value.turnMasterActionHistory) || value.turnMasterActionHistory.length > 1_000 || !value.turnMasterActionHistory.every(isMasterActionHistoryEntry))) return false;
  if (value.turnAiRolloutDecisionHistory !== undefined && (!Array.isArray(value.turnAiRolloutDecisionHistory) || value.turnAiRolloutDecisionHistory.length > 10_000 ||
    !value.turnAiRolloutDecisionHistory.every((entry) => isRecord(entry) && hasOnlyKeys(entry, ["playerId", "turnNumber"]) && isPlayerId(entry.playerId) && isInteger(entry.turnNumber)))) return false;
  if (!snapshot && (!isOptionalEntryArray(value.aiDecisionHistory, isAiDecisionHistoryEntry) || !isOptionalEntryArray(value.humanActionHistory, isHumanActionHistoryEntry))) return false;
  return hasUniqueAuthoritativeInstanceIds(players, slots);
}

function isPendingLevelUp(value: unknown, players: JsonRecord, slots: JsonRecord): boolean {
  if (!isRecord(value) || !hasOnlyKeys(value, ["playerId", "attackerSlotKey", "maxLevels", "superOptions"]) ||
    !isPlayerId(value.playerId) || !isSlotKey(value.attackerSlotKey) || !isInteger(value.maxLevels, 1)) return false;
  const player = players[value.playerId];
  const slot = slots[value.attackerSlotKey];
  if (!isRecord(player) || !isRecord(slot) || !isMonsterState(slot.monster) || slot.monster.owner !== value.playerId) return false;
  const hand = player.hand;
  if (!Array.isArray(hand)) return false;
  const monster = slot.monster;
  const persistentCardId = monster.mirroredFormOriginal?.cardId ?? monster.cardId;
  const persistentLevel = monster.mirroredFormOriginal?.level ?? monster.level;
  try {
    getMonsterDef(persistentCardId);
  } catch {
    return false;
  }
  if ((value.maxLevels as number) > (player.stones as number)) return false;
  if (value.superOptions === undefined) return true;
  if (!Array.isArray(value.superOptions) || value.superOptions.length > 100 || !value.superOptions.every(isSuperLevelUpOption)) return false;
  return value.superOptions.every((option) => {
    const card = hand.find((entry) => isRecord(entry) && entry.instanceId === option.handInstanceId && entry.cardId === option.cardId);
    if (!card) return false;
    try {
      const definition = getMonsterDef(option.cardId);
      if (getCardPool(definition) !== "special" || !definition.evolvesFrom?.includes(persistentCardId)) return false;
      const requiredLevels = Math.min(...definition.levels.map((level) => level.level)) - persistentLevel;
      return requiredLevels > 0 && requiredLevels <= (value.maxLevels as number) && requiredLevels <= (player.stones as number);
    } catch {
      return false;
    }
  });
}

function optionalPlayerId(value: unknown): boolean {
  return value === undefined || isPlayerId(value);
}

function hasUniqueAuthoritativeInstanceIds(players: JsonRecord, slots: JsonRecord): boolean {
  const ids: string[] = [];
  for (const playerId of ["player", "cpu"] as const) {
    const player = players[playerId] as JsonRecord;
    for (const zone of ["deck", "hand", "discard"] as const) {
      for (const card of player[zone] as Array<JsonRecord>) ids.push(card.instanceId as string);
    }
  }
  for (const slot of SLOT_KEYS) {
    const monster = (slots[slot] as JsonRecord).monster;
    if (monster !== undefined) ids.push((monster as MonsterState).instanceId);
  }
  return new Set(ids).size === ids.length;
}

export function isValidBattleGameState(value: unknown): value is GameState {
  return isGameState(value);
}

export function isValidHumanAction(value: unknown): value is HumanActionSnapshot {
  return isHumanAction(value);
}

export function isValidAiDecision(value: unknown): value is AiDecisionSnapshot {
  return isAiDecision(value);
}

export function isValidBattleCommandPayload(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (value.controller === "human") return hasOnlyKeys(value, ["controller", "action"]) && isHumanAction(value.action);
  if (value.controller === "ai") return hasOnlyKeys(value, ["controller", "decision"]) && isAiDecision(value.decision);
  return false;
}

export function isValidPlayerId(value: unknown): value is PlayerId {
  return isPlayerId(value);
}
