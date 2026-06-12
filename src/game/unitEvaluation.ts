import { getCardDef, getCardDefsByPool, getCardPool, getMonsterDef } from "./cards";
import { FIELD_ORDER, PLAYER_SLOT_ORDER } from "./ruleEngine/constants";
import { isOpponentMasterInCommandRange, isTargetInCommandRange } from "./ruleEngine/field";
import type {
  CardDef,
  CardInstance,
  CommandDef,
  GameState,
  MagicCardDef,
  MonsterCardDef,
  MonsterLevelDef,
  MonsterState,
  PlayerId,
  SlotKey,
  SlotState,
} from "./types";

export type EvaluationTone = "good" | "bad" | "neutral";

export interface EvaluationBreakdownItem {
  key: string;
  label: string;
  value: number;
  reason: string;
  tone: EvaluationTone;
}

export interface UnitEvaluation {
  total: number;
  grade: string;
  base: number;
  offense: number;
  defense: number;
  position: number;
  tempo: number;
  levelUp: number;
  risk: number;
  synergy: number;
  reasons: string[];
  breakdown: EvaluationBreakdownItem[];
}

export interface CardEvaluation extends UnitEvaluation {
  cardId: string;
  name: string;
  type: CardDef["type"];
  pool: ReturnType<typeof getCardPool>;
}

export interface BoardUnitEvaluation extends UnitEvaluation {
  slotKey: SlotKey;
  cardId: string;
  owner: PlayerId;
  threatened: boolean;
  lethalThreat: boolean;
  maxIncomingDamage: number;
}

interface ThreatEstimate {
  threatened: boolean;
  lethal: boolean;
  maxDamage: number;
}

const ALL_PLAYER_ORDER: PlayerId[] = ["player", "cpu"];

export function evaluateCard(cardId: string): CardEvaluation {
  const def = getCardDef(cardId);
  const evaluation = def.type === "monster" ? evaluateMonsterCard(def) : evaluateMagicCard(def);
  return {
    ...evaluation,
    cardId: def.id,
    name: def.name,
    type: def.type,
    pool: getCardPool(def),
  };
}

export function evaluateAllCards(): CardEvaluation[] {
  return getCardDefsByPool("all")
    .map((def) => evaluateCard(def.id))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name, "ja"));
}

export function evaluateBoardUnit(
  state: GameState,
  slotKey: SlotKey,
  perspective: PlayerId = state.slots[slotKey].monster?.owner ?? state.currentPlayer,
): BoardUnitEvaluation | undefined {
  const slot = state.slots[slotKey];
  const monster = slot.monster;
  if (!monster) {
    return undefined;
  }

  const card = evaluateCard(monster.cardId);
  const threat = incomingThreat(state, slotKey);
  const statusFactor = monster.status === "prepared" ? 0.6 : 1;
  const actionRemaining = monster.status === "active" && monster.actionCount < monster.actionLimit;
  const base = 30 + Math.round(card.base * 0.15);
  const offense = Math.round((estimateBoardOffense(state, slotKey) + card.offense * 0.25) * statusFactor);
  const defense = Math.round(
    monster.hp * 8 +
      card.defense * 0.2 +
      (monster.shielded ? 12 : 0) +
      (monster.focused ? 10 : 0) +
      (monster.halfShielded ? 14 : 0) +
      (monster.oneShotShield ? 10 : 0) +
      (monster.immune ? 18 : 0),
  );
  const position = cpuPlacementValue(state, slot, monster);
  const tempo = Math.round(
    (monster.level * 22 +
      monster.investedStones * 8 +
      (actionRemaining ? 12 : 0) +
      (monster.focused ? 8 : 0) +
      (monster.powerUp ? 10 : 0) +
      (monster.berserkPower ? 8 : 0) +
      (monster.status === "prepared" ? -14 : 0)) *
      statusFactor,
  );
  const levelUp = estimateNextLevelUpOpportunity(state, slotKey);
  const risk = estimateRiskScore(state, slotKey, threat, perspective);
  const synergy = Math.round(card.synergy * 0.35 + (monster.actionLimit > 1 ? 10 : 0));

  const total = Math.round(base + offense + defense + position + tempo + levelUp + risk + synergy);
  const breakdown = buildBreakdown({ base, offense, defense, position, tempo, levelUp, risk, synergy });
  const reasons = [
    ...card.reasons.slice(0, 2),
    actionRemaining ? "行動可能" : "",
    monster.status === "prepared" ? "準備中のため評価を抑制" : "",
    position < 0 ? "役割と配置が噛み合っていない" : "",
    threat.lethal ? "相手の撃破圏内" : threat.threatened ? `最大${threat.maxDamage}ダメージ圏内` : "",
    levelUp > 0 ? "撃破からレベルアップを狙える" : "",
  ].filter(Boolean);

  return {
    slotKey,
    cardId: monster.cardId,
    owner: monster.owner,
    total,
    grade: evaluationGrade(total),
    base,
    offense,
    defense,
    position,
    tempo,
    levelUp,
    risk,
    synergy,
    reasons,
    breakdown,
    threatened: threat.threatened,
    lethalThreat: threat.lethal,
    maxIncomingDamage: threat.maxDamage,
  };
}

export function cpuMonsterValue(state: GameState, slotKey: SlotKey): number {
  const slot = state.slots[slotKey];
  const monster = slot.monster;
  if (!monster) {
    return 0;
  }

  const statusFactor = monster.status === "prepared" ? 0.6 : 1;
  const value =
    30 +
    monster.level * 35 +
    monster.hp * 6 +
    monster.investedStones * 8 +
    (monster.actionCount < monster.actionLimit ? 12 : 0) +
    (monster.focused ? 18 : 0) +
    (monster.powerUp ? 16 : 0) +
    (monster.shielded ? 12 : 0) +
    cpuPlacementValue(state, slot, monster);
  return value * statusFactor;
}

export function cpuPlacementValue(state: GameState, slot: SlotState, monster: MonsterState): number {
  const def = getMonsterDef(monster.cardId);
  if (def.role === "front") {
    return slot.row === "front" ? 12 : -8;
  }

  if (slot.row === "front") {
    return -12;
  }

  return 16 + (state.slots[frontSlotFor(slot)].monster ? 10 : -12);
}

export function evaluateHandCardKeepValue(state: GameState, card: Pick<CardInstance, "cardId">): number {
  const def = getCardDef(card.cardId);
  if (def.type === "magic") {
    if (def.id === "thunder" || def.id === "card_026" || def.id === "card_092" || def.id === "card_118") {
      return 48;
    }
    if (def.id === "healing" || def.id === "card_127" || def.id === "power_up") {
      return 42;
    }
    if (def.id === "card_030" || def.id === "card_031" || def.id === "card_123") {
      return 34;
    }
    return 24;
  }

  if (getCardPool(def) === "special") {
    const hasSeedInPlay = PLAYER_SLOT_ORDER[state.currentPlayer].some((slotKey) =>
      def.evolvesFrom?.includes(state.slots[slotKey].monster?.cardId ?? ""),
    );
    return hasSeedInPlay ? 58 + def.maxLevel * 8 : 8;
  }

  const ownSlots = PLAYER_SLOT_ORDER[state.currentPlayer];
  const frontCount = ownSlots.filter((slotKey) => state.slots[slotKey].row === "front" && state.slots[slotKey].monster).length;
  const backCount = ownSlots.filter((slotKey) => state.slots[slotKey].row === "back" && state.slots[slotKey].monster).length;
  const roleNeed = def.role === "front" ? Math.max(0, 2 - frontCount) : Math.max(0, 2 - backCount);
  return 30 + def.maxLevel * 12 + (def.role === "front" ? 8 : 10) + roleNeed * 14;
}

export function evaluateHandMonsterPlacementValue(state: GameState, cardId: string, slotKey: SlotKey): number {
  const def = getCardDef(cardId);
  if (def.type !== "monster") {
    return evaluateHandCardKeepValue(state, { cardId });
  }
  if (getCardPool(def) === "special") {
    return evaluateHandCardKeepValue(state, { cardId });
  }

  const firstLevel = def.levels[0];
  const slot = state.slots[slotKey];
  const placement = def.role === slot.row ? 22 : -18;
  const laneSupport = def.role === "back" && slot.row === "back" && state.slots[frontSlotFor(slot)].monster ? 10 : 0;
  return 30 + def.maxLevel * 12 + firstLevel.maxHp * 6 + placement + laneSupport;
}

export function estimateCommandPowerForEvaluation(monster: MonsterState, command: CommandDef): number {
  let power = command.power;
  const upperCommand = getMonsterCommandsForState(monster)[0];
  if (monster.focused && upperCommand?.id === command.id) {
    power += 1;
  }
  if (monster.powerUp) {
    power += 1;
  }
  if (monster.powerOverride !== undefined) {
    power = monster.powerOverride;
  }
  power += monster.powerModifier ?? 0;
  if (monster.berserkPower) {
    power += 1;
  }
  return Math.max(0, power);
}

function evaluateMonsterCard(def: MonsterCardDef): UnitEvaluation {
  const hpValues = def.levels.map((level) => level.maxHp);
  const avgHp = average(hpValues);
  const maxHp = Math.max(...hpValues);
  const commands = def.levels.flatMap((level) => level.commands);
  const maxPower = Math.max(0, ...commands.map((command) => command.power));
  const avgPower = average(commands.map((command) => command.power));
  const rangeFlex = Math.max(0, ...commands.map(commandReachScore));
  const effectText = [
    def.catchcopy ?? "",
    ...def.notes ?? [],
    ...commands.map((command) => command.effectText ?? ""),
  ].join(" ");

  const base = 24 + def.maxLevel * 8 + (getCardPool(def) === "special" ? 18 : 0);
  const offense = Math.round(maxPower * 18 + avgPower * 8 + rangeFlex + (def.actionLimit && def.actionLimit > 1 ? 18 : 0));
  const defense = Math.round(avgHp * 7 + maxHp * 3 + textScore(effectText, DEFENSE_KEYWORDS));
  const position = def.role === "front" ? 10 : 14;
  const tempo = Math.round((def.levels[0]?.maxHp ?? 3) * 3 + (def.actionLimit && def.actionLimit > 1 ? 14 : 0));
  const levelUp = def.maxLevel >= 3 ? 22 : def.maxLevel === 2 ? 10 : 0;
  const risk = getCardPool(def) === "special" && def.evolvesFrom?.length ? -8 : 0;
  const synergy = Math.round(textScore(effectText, SYNERGY_KEYWORDS) + (def.evolvesFrom?.length ? 14 : 0));
  const total = Math.round(base + offense + defense + position + tempo + levelUp + risk + synergy);

  return {
    total,
    grade: evaluationGrade(total),
    base,
    offense,
    defense,
    position,
    tempo,
    levelUp,
    risk,
    synergy,
    reasons: [
      def.role === "front" ? "前衛配置で圧力を作る" : "後衛配置で射程と支援を活かす",
      maxPower >= 4 ? "高火力技を持つ" : "",
      rangeFlex >= 24 ? "射程が広い" : "",
      def.actionLimit && def.actionLimit > 1 ? "複数回行動" : "",
      textScore(effectText, DEFENSE_KEYWORDS) > 0 ? "防御・継続能力あり" : "",
      textScore(effectText, SYNERGY_KEYWORDS) > 0 ? "特殊効果で盤面価値が変動" : "",
    ].filter(Boolean),
    breakdown: buildBreakdown({ base, offense, defense, position, tempo, levelUp, risk, synergy }),
  };
}

function evaluateMagicCard(def: MagicCardDef): UnitEvaluation {
  const text = `${def.description} ${def.category ?? ""} ${def.continuance ?? ""} ${(def.notes ?? []).join(" ")}`;
  const base = 18;
  const offense = Math.round(textScore(text, OFFENSE_KEYWORDS) + (def.targetKinds.includes("enemy_master") ? 14 : 0));
  const defense = Math.round(textScore(text, DEFENSE_KEYWORDS) + (def.targetKinds.includes("ally_monster") ? 8 : 0));
  const position = 0;
  const tempo = Math.round(Math.max(0, 22 - def.cost * 4) + (def.continuance ? 10 : 0));
  const levelUp = text.includes("レベル") ? 12 : 0;
  const risk = def.cost >= 4 ? -8 : 0;
  const synergy = Math.round(textScore(text, SYNERGY_KEYWORDS) + (def.targetKinds.length > 1 ? 8 : 0));
  const total = Math.round(base + offense + defense + position + tempo + levelUp + risk + synergy);

  return {
    total,
    grade: evaluationGrade(total),
    base,
    offense,
    defense,
    position,
    tempo,
    levelUp,
    risk,
    synergy,
    reasons: [
      def.cost <= 2 ? "低コストで使いやすい" : "",
      offense > defense && offense > 0 ? "攻撃的な魔法" : "",
      defense >= offense && defense > 0 ? "防御・回復寄りの魔法" : "",
      def.continuance ? `継続: ${def.continuance}` : "",
      def.targetKinds.length > 1 ? "対象選択の幅がある" : "",
    ].filter(Boolean),
    breakdown: buildBreakdown({ base, offense, defense, position, tempo, levelUp, risk, synergy }),
  };
}

function estimateBoardOffense(state: GameState, slotKey: SlotKey): number {
  const slot = state.slots[slotKey];
  const monster = slot.monster;
  if (!monster) {
    return 0;
  }

  const commands = getMonsterCommandsForState(monster);
  const canAct = monster.status === "active" && monster.actionCount < monster.actionLimit;
  let bestTargetScore = 0;
  let commandFlex = 0;

  for (const command of commands) {
    const power = estimateCommandPowerForEvaluation(monster, command);
    commandFlex = Math.max(commandFlex, commandReachScore(command) - (command.stoneCost ?? 0) * 5);
    for (const targetKey of FIELD_ORDER) {
      const targetSlot = state.slots[targetKey];
      const target = targetSlot.monster;
      if (!target || target.owner === monster.owner || !canCommandReachMonster(slot, targetSlot, command)) {
        continue;
      }
      const damage = estimateMonsterDamage(target, monster, command);
      const targetValue = target.level * 25 + target.investedStones * 8 + target.hp * 6;
      const score = damage >= target.hp ? 90 + targetValue : damage * 24;
      bestTargetScore = Math.max(bestTargetScore, score);
    }

    const opponent = otherPlayer(monster.owner);
    if (canCommandReachMaster(slot, opponent, command)) {
      const masterDamage = Math.max(0, power - 2);
      bestTargetScore = Math.max(bestTargetScore, masterDamage * 60);
    }
  }

  const actionFactor = canAct ? 1 : monster.status === "prepared" ? 0.4 : 0.65;
  return Math.round((bestTargetScore + commandFlex) * actionFactor);
}

function estimateNextLevelUpOpportunity(state: GameState, slotKey: SlotKey): number {
  const slot = state.slots[slotKey];
  const monster = slot.monster;
  if (!monster) {
    return 0;
  }
  const def = getMonsterDef(monster.cardId);
  if (monster.level >= def.maxLevel || monster.status !== "active") {
    return 0;
  }

  let best = 0;
  for (const command of getMonsterCommandsForState(monster)) {
    for (const targetKey of FIELD_ORDER) {
      const targetSlot = state.slots[targetKey];
      const target = targetSlot.monster;
      if (!target || target.owner === monster.owner || !canCommandReachMonster(slot, targetSlot, command)) {
        continue;
      }
      const damage = estimateMonsterDamage(target, monster, command);
      if (damage < target.hp) {
        continue;
      }
      const levels = Math.min(def.maxLevel - monster.level, target.level);
      best = Math.max(best, levels * 28 + target.level * 10);
    }
  }
  return best;
}

function estimateRiskScore(state: GameState, slotKey: SlotKey, threat: ThreatEstimate, perspective: PlayerId): number {
  const monster = state.slots[slotKey].monster;
  if (!monster) {
    return 0;
  }

  const sign = monster.owner === perspective ? -1 : 1;
  if (threat.lethal) {
    return sign * 54;
  }
  if (threat.threatened) {
    return sign * Math.max(10, threat.maxDamage * 14);
  }
  return 0;
}

function incomingThreat(state: GameState, targetSlotKey: SlotKey): ThreatEstimate {
  const targetSlot = state.slots[targetSlotKey];
  const target = targetSlot.monster;
  if (!target) {
    return { threatened: false, lethal: false, maxDamage: 0 };
  }

  let threatened = false;
  let lethal = false;
  let maxDamage = 0;
  for (const attackerSlotKey of FIELD_ORDER) {
    const attackerSlot = state.slots[attackerSlotKey];
    const attacker = attackerSlot.monster;
    if (!attacker || attacker.owner === target.owner || attacker.status !== "active") {
      continue;
    }
    for (const command of getMonsterCommandsForState(attacker)) {
      if (!canCommandReachMonster(attackerSlot, targetSlot, command)) {
        continue;
      }
      const damage = estimateMonsterDamage(target, attacker, command);
      if (damage > 0) {
        threatened = true;
        maxDamage = Math.max(maxDamage, damage);
      }
      if (damage >= target.hp) {
        lethal = true;
      }
    }
  }

  return { threatened, lethal, maxDamage };
}

function estimateMonsterDamage(target: MonsterState, attacker: MonsterState, command: CommandDef): number {
  if (target.immune) {
    return 0;
  }
  let damage = estimateCommandPowerForEvaluation(attacker, command);
  if (target.shielded) {
    damage = Math.max(0, damage - 1);
  }
  if (target.focused) {
    damage = Math.max(0, damage - 1);
  }
  if (target.halfShielded) {
    damage = Math.max(0, Math.floor(damage / 2));
  }
  return damage;
}

function getMonsterCommandsForState(monster: MonsterState): CommandDef[] {
  const def = getMonsterDef(monster.cardId);
  const level = findMonsterLevel(def, monster.level);
  return level.commands;
}

function findMonsterLevel(def: MonsterCardDef, level: number): MonsterLevelDef {
  return def.levels.find((candidate) => candidate.level === level) ?? def.levels[0];
}

function canCommandReachMonster(attackerSlot: SlotState, targetSlot: SlotState, command: CommandDef): boolean {
  if (command.range === "any_monster" || command.range === "any_target") {
    return true;
  }
  if (command.range === "master") {
    return false;
  }
  return isTargetInCommandRange(attackerSlot, targetSlot, command, command.range);
}

function canCommandReachMaster(attackerSlot: SlotState, opponent: PlayerId, command: CommandDef): boolean {
  if (command.range === "any_target" || command.range === "master") {
    return true;
  }
  if (command.range === "any_monster") {
    return false;
  }
  return isOpponentMasterInCommandRange(attackerSlot, opponent, command, command.range);
}

function commandReachScore(command: CommandDef): number {
  if (command.range === "any_target") {
    return 42;
  }
  if (command.range === "any_monster") {
    return 34;
  }
  if (command.range === "master") {
    return 28;
  }
  if (command.range === "two_skip") {
    return command.rangeText?.includes("１つ") ? 32 : 26;
  }
  if (command.range === "one_skip" || command.range === "line" || command.range === "piercing") {
    return 22;
  }
  if (command.range === "straight" || command.range === "decreasing_straight") {
    return 18;
  }
  if (command.range === "special") {
    return 20;
  }
  return 8;
}

function buildBreakdown(values: Omit<UnitEvaluation, "total" | "grade" | "reasons" | "breakdown">): EvaluationBreakdownItem[] {
  return [
    { key: "base", label: "基礎", value: values.base, reason: "カード本体の基礎値", tone: toneFor(values.base) },
    { key: "offense", label: "攻撃", value: values.offense, reason: "火力、射程、現在狙える対象", tone: toneFor(values.offense) },
    { key: "defense", label: "耐久", value: values.defense, reason: "HP、軽減、継続防御", tone: toneFor(values.defense) },
    { key: "position", label: "配置", value: values.position, reason: "前衛/後衛役割と現在位置", tone: toneFor(values.position) },
    { key: "tempo", label: "テンポ", value: values.tempo, reason: "行動可能性、投資ストーン、状態強化", tone: toneFor(values.tempo) },
    { key: "levelUp", label: "Lv機会", value: values.levelUp, reason: "撃破からのレベルアップ余地", tone: toneFor(values.levelUp) },
    { key: "risk", label: "危険度", value: values.risk, reason: "相手から受ける撃破/被弾リスク", tone: toneFor(values.risk) },
    { key: "synergy", label: "効果", value: values.synergy, reason: "特殊能力、支援、コンボ性", tone: toneFor(values.synergy) },
  ];
}

function evaluationGrade(score: number): string {
  if (score >= 220) {
    return "S";
  }
  if (score >= 170) {
    return "A";
  }
  if (score >= 125) {
    return "B";
  }
  if (score >= 85) {
    return "C";
  }
  return "D";
}

function toneFor(value: number): EvaluationTone {
  if (value === 0) {
    return "neutral";
  }
  return value > 0 ? "good" : "bad";
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function frontSlotFor(slot: SlotState): SlotKey {
  return `${slot.owner}_front_${slot.lane}`;
}

function otherPlayer(playerId: PlayerId): PlayerId {
  return ALL_PLAYER_ORDER.find((candidate) => candidate !== playerId) ?? "cpu";
}

function textScore(text: string, entries: Array<[string, number]>): number {
  return entries.reduce((score, [keyword, value]) => score + (text.includes(keyword) ? value : 0), 0);
}

const OFFENSE_KEYWORDS: Array<[string, number]> = [
  ["ダメージ", 18],
  ["攻撃", 14],
  ["パワー", 12],
  ["バーサク", 16],
  ["一撃", 20],
  ["撃破", 18],
  ["貫通", 12],
  ["ランダム", 6],
];

const DEFENSE_KEYWORDS: Array<[string, number]> = [
  ["回復", 18],
  ["シールド", 18],
  ["軽減", 16],
  ["無効", 18],
  ["復活", 20],
  ["身代わり", 14],
  ["HP", 8],
];

const SYNERGY_KEYWORDS: Array<[string, number]> = [
  ["性格", 12],
  ["登場時", 14],
  ["死亡時", 16],
  ["被ダメージ", 14],
  ["呪", 12],
  ["移動", 10],
  ["入れ替え", 12],
  ["レベル", 10],
  ["カード", 8],
  ["ストーン", 8],
  ["手札", 8],
];
