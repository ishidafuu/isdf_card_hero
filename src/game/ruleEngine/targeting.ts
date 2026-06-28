import { getCardDef, getMonsterDef, isSummonableMonsterCard } from "../cards";
import { getMasterActionDef, getMasterActionIds } from "../masters";
import type {
  CardInstance,
  CommandAction,
  CommandDef,
  GameState,
  Lane,
  MagicAction,
  MasterActionId,
  MonsterState,
  PlayerId,
  Row,
  SlotKey,
  SlotState,
  Target,
} from "../types";
import { FIELD_ORDER, PLAYER_SLOT_ORDER } from "./constants";
import { drillBreakPartnerSlotKey } from "./drillBreak";
import { isOpponentMasterInCommandRange, isTargetInCommandRange } from "./field";
import { opponentOf } from "./players";

export function getCommandTargets(
  state: GameState,
  attackerSlotKey: SlotKey,
  commandId: string,
): Target[] {
  if (state.winner || state.pendingLevelUp) {
    return [];
  }
  const slot = state.slots[attackerSlotKey];
  const monster = slot.monster;
  if (!monster || monster.owner !== state.currentPlayer || monster.status !== "active") {
    return [];
  }
  if (monster.cardId === "card_045" && commandId === "飛竜ロロ" && monster.usedCommandIds?.includes("飛竜ロロ")) {
    return [];
  }
  if (monster.actionCount >= monster.actionLimit) {
    return [];
  }

  const command = getCommandForTargeting(monster, commandId);
  if (monster.cannotActUntilDamaged) {
    return [];
  }
  if (isSpecialCommandSealed(state, attackerSlotKey, command)) {
    return [];
  }
  const actor = state.players[state.currentPlayer];
  if (getCommandStoneCost(monster, command) + getMonsterActionExtraCost(monster) > actor.stones) {
    return [];
  }

  return applyProvokeRestriction(state, attackerSlotKey, command, getCommandTargetsUnchecked(state, attackerSlotKey, command));
}

export function getCommandTargetsUnchecked(
  state: GameState,
  attackerSlotKey: SlotKey,
  command: CommandDef,
): Target[] {
  const slot = state.slots[attackerSlotKey];
  const monster = slot.monster;
  if (!monster) {
    return [];
  }

  const opponent = opponentOf(monster.owner);
  const activeMonsterTargets = monsterTargets(state, {
    excludeSlotKey: attackerSlotKey,
    activeOnly: true,
  });
  const allMonsterTargets = monsterTargets(state, {
    excludeSlotKey: attackerSlotKey,
    activeOnly: false,
  });

  if (isSelfTargetCommand(command)) {
    return [{ kind: "monster", slotKey: attackerSlotKey }];
  }
  if (command.name === "それちょうだい") {
    return opponentMasterTargets(monster, opponent);
  }
  if (command.name === "レベルダウン") {
    return activeMonsterTargets.filter((target) => {
      const targetMonster = target.kind === "monster" ? state.slots[target.slotKey].monster : undefined;
      return !!targetMonster && targetMonster.level > 1 && !targetMonster.levelFixed;
    });
  }
  if (command.name === "レベルムーブ") {
    return activeMonsterTargets.filter((target) => {
      if (target.kind !== "monster") {
        return false;
      }
      const targetMonster = state.slots[target.slotKey].monster;
      return !!targetMonster && targetMonster.level > 1 && !targetMonster.levelFixed && hasLevelMoveRecipient(state, target.slotKey);
    });
  }
  if (command.name === "ヘブンズドア") {
    return activeMonsterTargets;
  }
  if (command.name === "ホワイトブレス") {
    return activeMonsterTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].owner === opponent);
  }
  if (command.name === "マッドホール") {
    return activeMonsterTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].owner === monster.owner);
  }
  if (command.name === "ヒーリング") {
    return activeMonsterTargets.filter((target) => target.kind === "monster");
  }
  if (command.name === "癒しの光") {
    return [
      ...activeMonsterTargets.filter((target) => target.kind === "monster"),
      { kind: "master", playerId: monster.owner },
    ];
  }
  if (command.name === "癒しの羽" || command.name === "コールドブレス") {
    return [
      ...activeMonsterTargets.filter((target) => target.kind === "monster"),
      { kind: "master", playerId: monster.owner },
      ...opponentMasterTargets(monster, opponent),
    ];
  }
  if (command.name === "神秘のキノコ") {
    return [
      { kind: "master", playerId: monster.owner },
      ...opponentMasterTargets(monster, opponent),
    ];
  }
  if (command.name === "ウォッシュ" || command.name === "レベル固定") {
    return activeMonsterTargets;
  }
  if (command.name === "福音の花") {
    return activeMonsterTargets.filter((target) => {
      const targetMonster = target.kind === "monster" ? state.slots[target.slotKey].monster : undefined;
      if (!targetMonster || targetMonster.levelFixed) {
        return false;
      }
      return targetMonster.level < getMonsterDef(targetMonster.cardId).maxLevel;
    });
  }
  if (command.name === "ウェイクホーン") {
    return allMonsterTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].monster?.status === "prepared");
  }
  if (command.name === "ブレイクホーン") {
    return allMonsterTargets;
  }
  if (command.name === "ワープ") {
    return activeMonsterTargets.filter((target) => target.kind === "monster" && findSwapPartnerSlot(state, target.slotKey));
  }
  if (command.name === "挑発") {
    return activeMonsterTargets.filter((target) => target.kind === "monster" && target.slotKey !== attackerSlotKey);
  }
  if (command.name === "爆裂キノコ") {
    return activeMonsterTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].owner === opponent);
  }
  if (command.name === "真名之書") {
    return activeMonsterTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].owner === opponent);
  }
  if (command.name === "ドリルブレイク") {
    return drillBreakPartnerSlotKey(state, slot) ? opponentMasterTargets(monster, opponent) : [];
  }
  if (command.rangeText === "前衛攻撃") {
    if (hasActiveAllyCard(state, monster.owner, "card_084")) {
      return activeMonsterTargets;
    }
    return activeMonsterTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].row === "front");
  }
  if (command.rangeText === "後衛攻撃") {
    if (hasActiveAllyCard(state, monster.owner, "card_083")) {
      return activeMonsterTargets;
    }
    return activeMonsterTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].row === "back");
  }
  if (command.rangeText === "ラオンソード" || command.rangeText === "レオンソード") {
    return rangeTargets(state, slot, command, activeMonsterTargets, opponent, "adjacent");
  }
  if (command.name === "なぎ払い") {
    return rangeTargets(state, sweepingAttackSlot(state, attackerSlotKey), command, activeMonsterTargets, opponent, "adjacent");
  }

  if (command.range === "any_monster") {
    return activeMonsterTargets;
  }
  if (command.range === "any_target") {
    return [...activeMonsterTargets, ...opponentMasterTargets(monster, opponent)];
  }
  if (command.range === "master") {
    return opponentMasterTargets(monster, opponent);
  }
  if (monster.canAttackAnywhere && command.id === "attack") {
    return [...activeMonsterTargets, ...opponentMasterTargets(monster, opponent)];
  }

  return rangeTargets(state, slot, command, activeMonsterTargets, opponent, command.range);
}

export function getMasterActionTargets(state: GameState, actionId: MasterActionId): Target[] {
  if (state.winner || state.pendingLevelUp) {
    return [];
  }
  const player = state.players[state.currentPlayer];
  if (player.masterFrozen) {
    return [];
  }
  if (!getMasterActionIdsForPlayer(state, state.currentPlayer).includes(actionId)) {
    return [];
  }
  if (player.stones < getMasterActionCost(actionId)) {
    return [];
  }

  if (actionId === "master_attack") {
    const opponent = opponentOf(state.currentPlayer);
    const monsterTargets = PLAYER_SLOT_ORDER[opponent]
      .filter((slotKey) => {
        const slot = state.slots[slotKey];
        return slot.row === "front" && slot.monster?.status === "active";
      })
      .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
    return [...monsterTargets, { kind: "master", playerId: opponent }];
  }

  if (actionId === "wake_up") {
    return FIELD_ORDER
      .filter((slotKey) => state.slots[slotKey].monster?.status === "prepared")
      .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
  }

  if (actionId === "berserk_power") {
    return FIELD_ORDER
      .filter((slotKey) => state.slots[slotKey].monster?.status === "active")
      .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
  }

  if (actionId === "earth_anger") {
    return FIELD_ORDER.some((slotKey) => state.slots[slotKey].monster?.status === "active")
      ? [{ kind: "master", playerId: state.currentPlayer }]
      : [];
  }

  return PLAYER_SLOT_ORDER[state.currentPlayer]
    .filter((slotKey) => {
      const monster = state.slots[slotKey].monster;
      return monster?.status === "active" && !monster.shielded;
    })
    .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
}

export function getMagicTargets(state: GameState, handInstanceId: string): Target[] {
  if (state.winner || state.pendingLevelUp) {
    return [];
  }
  const player = state.players[state.currentPlayer];
  const card = player.hand.find((handCard) => handCard.instanceId === handInstanceId);
  if (!card) {
    return [];
  }
  const def = getCardDef(card.cardId);
  if (def.type !== "magic" || player.stones < def.cost) {
    return [];
  }

  return getMagicTargetsByCardId(state, def.id);
}

export function getMagicSecondaryTargets(state: GameState, action: Pick<MagicAction, "handInstanceId" | "target">): Target[] {
  const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === action.handInstanceId);
  if (!card || action.target.kind !== "monster") {
    return [];
  }
  const primarySlotKey = action.target.slotKey;

  if (card.cardId === "card_030") {
    return monsterTargets(state, { excludeSlotKey: primarySlotKey, activeOnly: true });
  }
  if (card.cardId === "card_031") {
    return PLAYER_SLOT_ORDER[state.slots[primarySlotKey].owner]
      .filter((slotKey) => slotKey !== primarySlotKey && state.slots[slotKey].monster?.status === "active")
      .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
  }
  if (card.cardId === "card_061") {
    return PLAYER_SLOT_ORDER[opponentOf(state.slots[primarySlotKey].owner)]
      .filter((slotKey) => state.slots[slotKey].monster?.status === "active")
      .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
  }
  if (card.cardId === "card_097" || card.cardId === "card_098") {
    return PLAYER_SLOT_ORDER[state.currentPlayer]
      .filter((slotKey) => state.slots[slotKey].monster?.status === "active")
      .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
  }
  if (card.cardId === "card_148") {
    return PLAYER_SLOT_ORDER[opponentOf(state.currentPlayer)]
      .filter((slotKey) => state.slots[slotKey].monster?.status === "active")
      .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
  }
  return [];
}

export function getCommandSecondaryTargets(
  state: GameState,
  action: Pick<CommandAction, "attackerSlotKey" | "commandId" | "target">,
): Target[] {
  const monster = state.slots[action.attackerSlotKey].monster;
  if (!monster || action.target.kind !== "monster") {
    return [];
  }
  const primarySlotKey = action.target.slotKey;
  const command = getCommandForTargeting(monster, action.commandId);
  if (command.name !== "ワープ") {
    if (command.name === "レベルムーブ") {
      return monsterTargets(state, { excludeSlotKey: primarySlotKey, activeOnly: true }).filter((target) => {
        const targetMonster = target.kind === "monster" ? state.slots[target.slotKey].monster : undefined;
        return !!targetMonster && !targetMonster.levelFixed && targetMonster.level < getMonsterDef(targetMonster.cardId).maxLevel;
      });
    }
    return [];
  }
  return PLAYER_SLOT_ORDER[state.slots[primarySlotKey].owner]
    .filter((slotKey) => slotKey !== primarySlotKey && state.slots[slotKey].monster?.status === "active")
    .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
}

export function getMagicHandChoices(state: GameState, handInstanceId: string): CardInstance[] {
  const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === handInstanceId);
  if (!card) {
    return [];
  }
  if (card.cardId === "card_065") {
    return state.players[state.currentPlayer].hand.filter((handCard) => isSummonableMonsterCard(handCard.cardId));
  }
  if (card.cardId === "card_116") {
    return state.players[state.currentPlayer].hand.filter((handCard) => handCard.instanceId !== handInstanceId);
  }
  return [];
}

export function getCommandHandChoices(state: GameState, attackerSlotKey: SlotKey, commandId: string): CardInstance[] {
  const monster = state.slots[attackerSlotKey].monster;
  if (!monster) {
    return [];
  }
  const command = getCommandForTargeting(monster, commandId);
  if (command.name !== "ソウルスイッチ") {
    return [];
  }
  return state.players[monster.owner].hand.filter((card) => isSummonableMonsterCard(card.cardId));
}

export function getMagicSearchCategories(state: GameState, handInstanceId: string): Array<NonNullable<MagicAction["searchCategory"]>> {
  const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === handInstanceId);
  return card?.cardId === "card_123" ? ["front", "back", "magic", "special"] : [];
}

export function getMasterActionCost(actionId: MasterActionId): number {
  return getMasterActionDef(actionId).cost;
}

export function getMasterActionIdsForPlayer(state: GameState, playerId: PlayerId): MasterActionId[] {
  const actionOwner = state.players[playerId].masterActionsExchanged ? opponentOf(playerId) : playerId;
  return getMasterActionIds(state.players[actionOwner].masterId);
}

export function targetToKey(target: Target): string {
  return target.kind === "master" ? `master:${target.playerId}` : `monster:${target.slotKey}`;
}

export function isSameTarget(a: Target, b: Target): boolean {
  if (a.kind !== b.kind) {
    return false;
  }
  if (a.kind === "master" && b.kind === "master") {
    return a.playerId === b.playerId;
  }
  if (a.kind === "monster" && b.kind === "monster") {
    return a.slotKey === b.slotKey;
  }
  return false;
}

export function getCommandForTargeting(monster: MonsterState, commandId: string): CommandDef {
  const command = getMonsterCommandsForTargeting(monster).find((item) => item.id === commandId);
  if (command) {
    return command;
  }
  const fallback = getMonsterDef(monster.cardId).levels
    .filter((level) => level.level === monster.level)
    .flatMap((level) => level.commands)
    .find((item) => item.id === commandId);
  if (!fallback) {
    throw new Error("指定したコマンドがありません");
  }
  return fallback;
}

function getMagicTargetsByCardId(state: GameState, cardId: string): Target[] {
  const playerId = state.currentPlayer;
  const opponent = opponentOf(playerId);
  const activeTargets = monsterTargets(state, { activeOnly: true });
  const allMonsterTargets = monsterTargets(state, { activeOnly: false });
  const allyActive = activeTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].owner === playerId);
  const enemyActive = activeTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].owner === opponent);
  const preparedTargets = allMonsterTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].monster?.status === "prepared");
  const ownMaster: Target[] = [{ kind: "master", playerId }];
  const enemyMaster: Target[] = [{ kind: "master", playerId: opponent }];
  const allMasters: Target[] = [{ kind: "master", playerId: "player" }, { kind: "master", playerId: "cpu" }];

  if (cardId === "healing") {
    return allyActive;
  }
  if (cardId === "thunder") {
    return [...enemyActive, ...enemyMaster];
  }
  if (cardId === "power_up") {
    return allyActive.filter((target) => target.kind === "monster" && !state.slots[target.slotKey].monster?.powerUp);
  }
  if (cardId === "card_025" || cardId === "card_055" || cardId === "card_062" || cardId === "card_088" || cardId === "card_089" || cardId === "card_091") {
    return activeTargets;
  }
  if (cardId === "card_030") {
    return activeTargets.filter((target) => target.kind === "monster" && findFirstOtherActiveSlot(state, target.slotKey));
  }
  if (cardId === "card_026" || cardId === "card_092") {
    return [...activeTargets, ...enemyMaster];
  }
  if (cardId === "card_027" || cardId === "card_028" || cardId === "card_058" || cardId === "card_059" || cardId === "card_060" || cardId === "card_086" || cardId === "card_090" || cardId === "card_094" || cardId === "card_095" || cardId === "card_119" || cardId === "card_125" || cardId === "card_129" || cardId === "card_130") {
    return activeTargets;
  }
  if (cardId === "card_029") {
    return activeTargets.filter((target) => {
      const monster = target.kind === "monster" ? state.slots[target.slotKey].monster : undefined;
      return !!monster && monster.level > 1 && !monster.levelFixed;
    });
  }
  if (cardId === "card_031") {
    return activeTargets.filter((target) => target.kind === "monster" && findSwapPartnerSlot(state, target.slotKey));
  }
  if (cardId === "card_056" || cardId === "card_064" || cardId === "card_093" || cardId === "card_114" || cardId === "card_115" || cardId === "card_116" || cardId === "card_120" || cardId === "card_121" || cardId === "card_123" || cardId === "card_124" || cardId === "card_126") {
    return ownMaster;
  }
  if (cardId === "card_057" || cardId === "card_063" || cardId === "card_065") {
    if (cardId === "card_065" && !state.players[playerId].hand.some((card) => isSummonableMonsterCard(card.cardId))) {
      return [];
    }
    return allyActive;
  }
  if (cardId === "card_128") {
    return activeTargets;
  }
  if (cardId === "card_061") {
    return allyActive.length > 0 && enemyActive.length > 0 ? [...allyActive, ...enemyActive] : [];
  }
  if (cardId === "card_097" || cardId === "card_098") {
    return allyActive.length > 0 ? enemyActive : [];
  }
  if (cardId === "card_148") {
    return enemyActive.length > 0 ? allyActive : [];
  }
  if (cardId === "card_087") {
    return allMasters;
  }
  if (cardId === "card_113") {
    return enemyMaster;
  }
  if (cardId === "card_117" || cardId === "card_122") {
    return preparedTargets;
  }
  if (cardId === "card_118") {
    return activeTargets.filter((target) => target.kind === "monster" && state.slots[target.slotKey].row === "front");
  }
  if (cardId === "card_127") {
    return [...activeTargets, ...allMasters];
  }
  if (cardId === "card_149") {
    return allyActive.filter((target) => {
      const monster = target.kind === "monster" ? state.slots[target.slotKey].monster : undefined;
      return !!monster && !monster.levelFixed && monster.level < getMonsterDef(monster.cardId).maxLevel;
    });
  }
  if (cardId === "card_150") {
    return allyActive.filter((target) => target.kind === "monster" && state.slots[target.slotKey].monster?.cardId === "card_001");
  }

  return activeTargets;
}

function monsterTargets(
  state: GameState,
  options: { excludeSlotKey?: SlotKey; activeOnly: boolean },
): Target[] {
  return FIELD_ORDER
    .filter((slotKey) => slotKey !== options.excludeSlotKey)
    .filter((slotKey) => {
      const monster = state.slots[slotKey].monster;
      return !!monster && (!options.activeOnly || monster.status === "active");
    })
    .map<Target>((slotKey) => ({ kind: "monster", slotKey }));
}

function opponentMasterTargets(monster: MonsterState, opponent: PlayerId): Target[] {
  return monster.masterAttackBlockedUntilTurnEnd ? [] : [{ kind: "master", playerId: opponent }];
}

function rangeTargets(
  state: GameState,
  attackerSlot: SlotState,
  command: CommandDef,
  activeMonsterTargets: Target[],
  opponent: PlayerId,
  range: CommandDef["range"],
): Target[] {
  const targets = activeMonsterTargets.filter((target) => {
    if (target.kind !== "monster") {
      return false;
    }
    const targetSlot = state.slots[target.slotKey];
    return isTargetInCommandRange(attackerSlot, targetSlot, command, range);
  });

  if (isOpponentMasterInCommandRange(attackerSlot, opponent, command, range) && !attackerSlot.monster?.masterAttackBlockedUntilTurnEnd) {
    targets.push({ kind: "master", playerId: opponent });
  }

  return targets;
}

function isSelfTargetCommand(command: CommandDef): boolean {
  return (
    command.name === "パワーチャージ" ||
    command.name === "ドローフォース" ||
    command.name === "レベルアップ" ||
    command.name === "ソウルスイッチ" ||
    command.name === "ジャックポット"
  );
}

function hasActiveAllyCard(state: GameState, playerId: PlayerId, cardId: string): boolean {
  return PLAYER_SLOT_ORDER[playerId].some((slotKey) => {
    const monster = state.slots[slotKey].monster;
    return monster?.cardId === cardId && monster.status === "active";
  });
}

function hasLevelMoveRecipient(state: GameState, excludeSlotKey: SlotKey): boolean {
  return FIELD_ORDER.some((slotKey) => {
    if (slotKey === excludeSlotKey) {
      return false;
    }
    const monster = state.slots[slotKey].monster;
    return !!monster && monster.status === "active" && !monster.levelFixed && monster.level < getMonsterDef(monster.cardId).maxLevel;
  });
}

function getCommandStoneCost(monster: MonsterState, command: CommandDef): number {
  return (command.stoneCost ?? 0) * (monster.stoneCostMultiplier ?? 1);
}

function getMonsterActionExtraCost(monster: MonsterState): number {
  return monster.stoneCurse ? 2 : 0;
}

function isSpecialCommandSealed(state: GameState, slotKey: SlotKey, command: CommandDef): boolean {
  const monster = state.slots[slotKey].monster;
  if (!monster || isUpperCommand(monster, command)) {
    return false;
  }
  if (monster.commandSealed) {
    return true;
  }
  return FIELD_ORDER.some((candidateSlotKey) => {
    const candidate = state.slots[candidateSlotKey];
    return (
      candidate.monster?.cardId === "card_133" &&
      candidate.monster.status === "active" &&
      slotInFrontOf(candidate) === slotKey
    );
  });
}

function applyProvokeRestriction(
  state: GameState,
  attackerSlotKey: SlotKey,
  command: CommandDef,
  targets: Target[],
): Target[] {
  const monster = state.slots[attackerSlotKey].monster;
  const provokeTargetSlotKey = monster?.provokeTargetSlotKey;
  if (!monster || !provokeTargetSlotKey || isSelfTargetCommand(command)) {
    return targets;
  }
  if (!state.slots[provokeTargetSlotKey].monster) {
    monster.provokeTargetSlotKey = undefined;
    return targets;
  }
  return targets.some((target) => target.kind === "monster" && target.slotKey === provokeTargetSlotKey)
    ? [{ kind: "monster", slotKey: provokeTargetSlotKey }]
    : targets;
}

function isUpperCommand(monster: MonsterState, command: CommandDef): boolean {
  return getMonsterCommandsForTargeting(monster)[0]?.id === command.id;
}

function getMonsterCommandsForTargeting(monster: MonsterState): CommandDef[] {
  return getMonsterLevelDefForTargeting(monster).commands;
}

function getMonsterLevelDefForTargeting(monster: MonsterState) {
  const def = getMonsterDef(monster.cardId);
  const candidates = def.levels.filter((item) => item.level === monster.level);
  const level = selectMonsterLevelForm(monster, candidates);
  if (!level) {
    throw new Error("モンスターレベル定義がありません");
  }
  return level;
}

function selectMonsterLevelForm(
  monster: MonsterState,
  candidates: ReturnType<typeof getMonsterDef>["levels"],
) {
  if (candidates.length <= 1) {
    return candidates[0];
  }
  if (monster.cardId === "card_035" || monster.cardId === "card_067") {
    return monster.revivedOnce ? candidates[candidates.length - 1] : candidates[0];
  }
  if (monster.cardId === "card_045") {
    return monster.usedCommandIds?.includes("飛竜ロロ") ? candidates[candidates.length - 1] : candidates[0];
  }
  return candidates[0];
}

function findFirstOtherActiveSlot(state: GameState, slotKey: SlotKey): SlotKey | undefined {
  return FIELD_ORDER.find((candidate) => candidate !== slotKey && state.slots[candidate].monster?.status === "active");
}

function findSwapPartnerSlot(state: GameState, slotKey: SlotKey): SlotKey | undefined {
  const slot = state.slots[slotKey];
  return PLAYER_SLOT_ORDER[slot.owner].find((candidate) => candidate !== slotKey && state.slots[candidate].monster?.status === "active");
}

function sweepingAttackSlot(state: GameState, attackerSlotKey: SlotKey): SlotState {
  const attackerSlot = state.slots[attackerSlotKey];
  const destinationSlotKey = sweepingDestinationSlotKey(attackerSlot);
  return destinationSlotKey ? state.slots[destinationSlotKey] : attackerSlot;
}

function sweepingDestinationSlotKey(attackerSlot: SlotState): SlotKey | undefined {
  if (attackerSlot.row !== "back") {
    return undefined;
  }
  return makeSlotKey(attackerSlot.owner, "front", attackerSlot.lane);
}

function slotInFrontOf(slot: SlotState): SlotKey | undefined {
  if (slot.row === "back") {
    return makeSlotKey(slot.owner, "front", slot.lane);
  }
  return makeSlotKey(opponentOf(slot.owner), "front", slot.lane);
}

function makeSlotKey(owner: PlayerId, row: Row, lane: Lane): SlotKey {
  return `${owner}_${row}_${lane}`;
}
