import { getCardDef, getCardDefsByPool, getCardPool, getMonsterDef } from "../cards";
import { shuffle } from "../ruleEngine/random";
import type { OpponentKnowledgePolicy } from "../cpuAiTypes";
import type { CardInstance, GameState, MonsterState, PlayerId, SlotKey, SuperLevelUpOption } from "../types";

/**
 * Builds the deterministic information-set view used by ordinary CPU profiles.
 * The live state is never changed; callers apply the chosen command to the live
 * state, not to this planning copy.
 */
export function createPublicInformationState(
  state: GameState,
  perspective: PlayerId,
  sampleIndex = 0,
  policy: OpponentKnowledgePolicy = "known_deck",
): GameState {
  const opponent = opponentOf(perspective);
  const next = createPlanningState(state);
  const hiddenPreparedSlots = (Object.keys(state.slots) as SlotKey[])
    .filter((slotKey) => {
      const monster = state.slots[slotKey].monster;
      return monster?.owner === opponent && monster.status === "prepared";
    })
    .sort();
  const opponentPlayer = state.players[opponent];
  const hiddenSize = opponentPlayer.hand.length + opponentPlayer.deck.length + hiddenPreparedSlots.length;
  const knownHiddenPool = policy === "unknown_composition" ? [] : stableCanonicalCards([
        ...opponentPlayer.hand,
        ...opponentPlayer.deck,
        ...hiddenPreparedSlots.flatMap((slotKey) => {
          const monster = state.slots[slotKey].monster;
          return monster ? [{ cardId: monster.cardId, instanceId: monster.instanceId }] : [];
        }),
      ]);
  const publicSeed = publicInformationSeed(
    state,
    perspective,
    sampleIndex,
    policy === "unknown_composition" ? [] : knownHiddenPool,
  );
  const hiddenPool = policy === "unknown_composition"
    ? createUnknownCompositionPool(state, opponent, hiddenSize, hiddenPreparedSlots.length, publicSeed)
    : knownHiddenPool;
  const shuffledHiddenPool = shuffle(hiddenPool, publicSeed);
  const preparedCards = shuffle(
    shuffledHiddenPool.filter((card) => isLegalPreparedCard(card.cardId)),
    hashString(`${publicSeed}:prepared`),
  ).slice(0, hiddenPreparedSlots.length);
  const preparedInstanceIds = new Set(preparedCards.map((card) => card.instanceId));
  const remainingHiddenPool = shuffledHiddenPool.filter((card) => !preparedInstanceIds.has(card.instanceId));
  let cursor = 0;

  for (const [index, slotKey] of hiddenPreparedSlots.entries()) {
    const card = preparedCards[index];
    const original = state.slots[slotKey].monster;
    if (card && original) {
      next.slots[slotKey].monster = canonicalPreparedMonster(card.cardId, opponent, slotKey);
    } else {
      throw new Error("Unknown-composition sampler could not produce a legal prepared monster.");
    }
  }

  const sampledOpponentHand = remainingHiddenPool.slice(cursor, cursor + opponentPlayer.hand.length);
  cursor += opponentPlayer.hand.length;
  next.players[opponent].hand = sampledOpponentHand.map((card, index) => ({
    cardId: card.cardId,
    instanceId: `info:${opponent}:hand:${index}:${card.cardId}`,
  }));
  next.players[opponent].deck = remainingHiddenPool.slice(cursor).map((card, index) => ({
    cardId: card.cardId,
    instanceId: `info:${opponent}:deck:${index}:${card.cardId}`,
  }));

  const ownPlayer = next.players[perspective];
  ownPlayer.deck = shuffle(
    stableCanonicalCards(ownPlayer.deck).map((card, index) => ({
      cardId: card.cardId,
      instanceId: `info:${perspective}:deck:${index}:${card.cardId}`,
    })),
    hashString(`${publicSeed}:own-deck`),
  );
  next.randomSeed = hashString(`${publicSeed}:rng`);

  if (next.pendingLevelUp?.playerId === opponent) {
    const superOptions = listSampledSuperOptions(next, next.pendingLevelUp.attackerSlotKey);
    next.pendingLevelUp = {
      ...next.pendingLevelUp,
      superOptions,
    };
    if (superOptions.length === 0) {
      delete next.pendingLevelUp.superOptions;
    }
  }

  return next;
}

/** Clones only decision-relevant state; verbose journals never enter search branches. */
export function createPlanningState(state: GameState): GameState {
  const next = structuredClone({
    ...state,
    log: [],
    logOffset: undefined,
    eventLog: undefined,
    aiDecisionHistory: undefined,
    humanActionHistory: undefined,
  });
  delete next.logOffset;
  delete next.eventLog;
  delete next.aiDecisionHistory;
  delete next.humanActionHistory;
  return next;
}

/** Kept as a compatibility alias for existing WhiteV2 response callers. */
export function determinizeOpponentPrivateZones(
  state: GameState,
  perspective: PlayerId,
  sampleIndex = 0,
  policy: OpponentKnowledgePolicy = "known_deck",
): GameState {
  return createPublicInformationState(state, perspective, sampleIndex, policy);
}

export function publicInformationStateKey(
  state: GameState,
  perspective: PlayerId,
  policy: OpponentKnowledgePolicy = "known_deck",
): string {
  const opponent = opponentOf(perspective);
  const hiddenPreparedSlots = (Object.keys(state.slots) as SlotKey[])
    .filter((slotKey) => {
      const monster = state.slots[slotKey].monster;
      return monster?.owner === opponent && monster.status === "prepared";
    })
    .sort();
  const hiddenPool = policy === "unknown_composition" ? [] : stableCanonicalCards([
        ...state.players[opponent].hand,
        ...state.players[opponent].deck,
        ...hiddenPreparedSlots.flatMap((slotKey) => {
          const monster = state.slots[slotKey].monster;
          return monster ? [{ cardId: monster.cardId, instanceId: monster.instanceId }] : [];
        }),
      ]);
  return JSON.stringify({
    publicSeed: publicInformationSeed(state, perspective, 0, hiddenPool),
    currentPlayer: state.currentPlayer,
    turnNumber: state.turnNumber,
    pending: state.pendingLevelUp
      ? {
          playerId: state.pendingLevelUp.playerId,
          attackerSlotKey: state.pendingLevelUp.attackerSlotKey,
          maxLevels: state.pendingLevelUp.maxLevels,
        }
      : null,
    ...publicMasterActionExchangeKey(state),
    players: Object.fromEntries((["player", "cpu"] as const).map((playerId) => {
      const player = state.players[playerId];
      return [playerId, {
        masterId: player.masterId,
        masterHp: player.masterHp,
        stones: player.stones,
        masterPowerBonus: player.masterPowerBonus ?? 0,
        masterFrozen: player.masterFrozen ?? false,
        hand: playerId === perspective ? player.hand.map((card) => card.cardId).sort() : player.hand.length,
        deck: player.deck.length,
        knownOwnDeckPool: playerId === perspective ? player.deck.map((card) => card.cardId).sort() : undefined,
        discard: player.discard.map((card) => card.cardId).sort(),
      }];
    })),
    slots: (Object.keys(state.slots) as SlotKey[]).sort().map((slotKey) => {
      const monster = state.slots[slotKey].monster;
      if (!monster) {
        return [slotKey, null];
      }
      if (monster.status === "prepared" && monster.owner !== perspective) {
        return [slotKey, { owner: monster.owner, status: "prepared" }];
      }
      return [slotKey, publicMonster(monster)];
    }),
    hiddenPool: policy === "unknown_composition" ? undefined : hiddenPool.map((card) => card.cardId).sort(),
    hiddenPreparedSlots,
    opponentKnowledgePolicy: policy,
  });
}

function createUnknownCompositionPool(
  state: GameState,
  opponent: PlayerId,
  size: number,
  preparedCount: number,
  publicSeed: number,
): CardInstance[] {
  if (size <= 0) {
    return [];
  }
  const counts = new Map<string, number>();
  for (const definition of getCardDefsByPool("normal")) {
    counts.set(definition.id, 3);
  }
  const publicKnown = [
    ...state.players[opponent].discard,
    ...(Object.values(state.slots).flatMap(({ monster }) =>
      monster && monster.owner === opponent && monster.status !== "prepared"
        ? [{ cardId: monster.cardId, instanceId: monster.instanceId }]
        : [])),
  ];
  for (const card of publicKnown) {
    counts.set(card.cardId, Math.max(0, (counts.get(card.cardId) ?? 0) - 1));
  }
  const candidatePool = [...counts.entries()].flatMap(([cardId, count]) =>
    Array.from({ length: count }, (_, copy) => ({ cardId, instanceId: `unknown-pool:${cardId}:${copy}` })),
  );
  const shuffled = shuffle(candidatePool, hashString(`${publicSeed}:unknown-composition`));
  const prepared = shuffled.filter((card) => isLegalPreparedCard(card.cardId)).slice(0, preparedCount);
  const preparedIds = new Set(prepared.map((card) => card.instanceId));
  const remainder = shuffled.filter((card) => !preparedIds.has(card.instanceId));
  return [...prepared, ...remainder]
    .slice(0, size)
    .map((card, index) => ({ ...card, instanceId: `unknown:${index}:${card.cardId}` }));
}

function publicInformationSeed(
  state: GameState,
  perspective: PlayerId,
  sampleIndex: number,
  hiddenPool: readonly CardInstance[],
): number {
  const publicState = {
    perspective,
    sampleIndex,
    currentPlayer: state.currentPlayer,
    firstPlayer: state.firstPlayer,
    turnNumber: state.turnNumber,
    winner: state.winner ?? "",
    pendingLevelUp: state.pendingLevelUp
      ? {
          playerId: state.pendingLevelUp.playerId,
          attackerSlotKey: state.pendingLevelUp.attackerSlotKey,
          maxLevels: state.pendingLevelUp.maxLevels,
        }
      : null,
    ...publicMasterActionExchangeKey(state),
    players: Object.fromEntries((["player", "cpu"] as const).map((playerId) => {
      const player = state.players[playerId];
      return [playerId, {
        masterId: player.masterId,
        masterHp: player.masterHp,
        stones: player.stones,
        masterPowerBonus: player.masterPowerBonus ?? 0,
        masterFrozen: player.masterFrozen ?? false,
        handSize: player.hand.length,
        knownHand: playerId === perspective ? player.hand.map((card) => card.cardId).sort() : undefined,
        deckSize: player.deck.length,
        knownOwnDeckPool: playerId === perspective ? player.deck.map((card) => card.cardId).sort() : undefined,
        discard: player.discard.map((card) => card.cardId).sort(),
        turnsStarted: player.turnsStarted,
      }];
    })),
    slots: (Object.keys(state.slots) as SlotKey[]).sort().map((slotKey) => {
      const monster = state.slots[slotKey].monster;
      if (!monster) {
        return [slotKey, null];
      }
      if (monster.status === "prepared" && monster.owner !== perspective) {
        return [slotKey, { owner: monster.owner, status: "prepared" }];
      }
      return [slotKey, publicMonster(monster)];
    }),
    hiddenPool: hiddenPool.map((card) => card.cardId).sort(),
  };
  return hashString(JSON.stringify(publicState));
}

function publicMasterActionExchangeKey(state: GameState): {
  masterActionsExchanged: { player: boolean; cpu: boolean };
  masterActionsExchangeExpiresOnStartOf: PlayerId | null;
} | Record<string, never> {
  const player = state.players.player.masterActionsExchanged === true;
  const cpu = state.players.cpu.masterActionsExchanged === true;
  const expiresOnStartOf = state.masterActionsExchangeExpiresOnStartOf;
  if (!player && !cpu && !expiresOnStartOf) {
    // Preserve the established sampler seed for ordinary games with no exchange state.
    return {};
  }
  return {
    masterActionsExchanged: { player, cpu },
    masterActionsExchangeExpiresOnStartOf: expiresOnStartOf ?? null,
  };
}

function publicMonster(monster: MonsterState): Omit<MonsterState, "instanceId"> {
  const { instanceId: _instanceId, ...visible } = monster;
  return visible;
}

function stableCanonicalCards(cards: readonly CardInstance[]): CardInstance[] {
  return [...cards]
    .map((card) => ({ cardId: card.cardId, instanceId: card.instanceId }))
    .sort((left, right) => left.cardId.localeCompare(right.cardId) || left.instanceId.localeCompare(right.instanceId))
    .map((card, index) => ({ cardId: card.cardId, instanceId: `canonical:${index}:${card.cardId}` }));
}

function canonicalPreparedMonster(cardId: string, owner: PlayerId, slotKey: SlotKey): MonsterState {
  const def = getMonsterDef(cardId);
  const monster: MonsterState = {
    instanceId: `info:${owner}:${slotKey}`,
    cardId,
    owner,
    hp: def.levels[0].maxHp,
    level: def.levels[0].level,
    status: "prepared",
    investedStones: 1,
    actionCount: 0,
    actionLimit: def.actionLimit ?? 1,
    focused: false,
    powerUp: false,
    shielded: false,
  };
  if (cardId === "card_144") {
    monster.stoneCurse = true;
    monster.hollow = true;
  }
  return monster;
}

function isLegalPreparedCard(cardId: string): boolean {
  const def = getCardDef(cardId);
  return def.type === "monster" && getCardPool(def) === "normal";
}

function listSampledSuperOptions(state: GameState, slotKey: SlotKey): SuperLevelUpOption[] {
  const monster = state.slots[slotKey].monster;
  const pending = state.pendingLevelUp;
  if (!monster || !pending || monster.levelFixed) {
    return [];
  }
  const player = state.players[monster.owner];
  return player.hand.flatMap((card) => {
    const def = getCardDef(card.cardId);
    if (
      def.type !== "monster" || getCardPool(def) !== "special" ||
      !def.evolvesFrom?.includes(monster.cardId)
    ) {
      return [];
    }
    const entryLevel = Math.min(...def.levels.map((level) => level.level));
    const requiredLevels = entryLevel - monster.level;
    return requiredLevels > 0 && requiredLevels <= pending.maxLevels && requiredLevels <= player.stones
      ? [{ handInstanceId: card.instanceId, cardId: card.cardId }]
      : [];
  });
}

function opponentOf(playerId: PlayerId): PlayerId {
  return playerId === "player" ? "cpu" : "player";
}

function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
