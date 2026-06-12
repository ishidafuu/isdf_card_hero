import { useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent, PointerEvent as ReactPointerEvent } from "react";
import { getCardNoteDisplays } from "./game/cardAnnotations";
import {
  buildDeckCardIds,
  deckCategoryLabel,
  deckTextFromCardIds,
  getAllCardDefs,
  getCardDef,
  getCardIconPath,
  getCardName,
  parseDeckText,
  summarizeDeckCardIds,
} from "./game/cards";
import {
  attackWithCommand,
  canFocusMonster,
  canSummonTo,
  createInitialGame,
  discardHandCard,
  endTurn,
  focusMonster,
  getCommandTargets,
  getCommandHandChoices,
  getCommandSecondaryTargets,
  getHandCard,
  getMagicHandChoices,
  getMagicSearchCategories,
  getMagicSecondaryTargets,
  getMagicTargets,
  getMasterActionCost,
  getMasterActionTargets,
  getMonsterCommands,
  getMovableTargets,
  moveMonster,
  opponentOf,
  playMagic,
  playerLabel,
  resolveLevelUp,
  runAutoStep,
  runCpuStep,
  summonMonster,
  targetToKey,
  useMasterAction,
  useMasterHpDraw,
} from "./game/rules";
import type { CardInstance, CommandDef, GameState, MagicAction, MagicCardDef, MagicTargetKind, MasterActionId, PlayerId, SlotKey, Target } from "./game/types";
import type { DeckValidationSummary } from "./game/cards";

type BoardCell =
  | { kind: "slot"; slotKey: SlotKey }
  | { kind: "master"; playerId: PlayerId; label: string }
  | { kind: "blocked"; label: string };

const BOARD_CELLS: BoardCell[][] = [
  [
    { kind: "slot", slotKey: "cpu_back_left" },
    { kind: "blocked", label: "進入不可" },
    { kind: "slot", slotKey: "cpu_back_right" },
  ],
  [
    { kind: "slot", slotKey: "cpu_front_left" },
    { kind: "master", playerId: "cpu", label: "CPU Master" },
    { kind: "slot", slotKey: "cpu_front_right" },
  ],
  [
    { kind: "slot", slotKey: "player_front_left" },
    { kind: "master", playerId: "player", label: "Player Master" },
    { kind: "slot", slotKey: "player_front_right" },
  ],
  [
    { kind: "slot", slotKey: "player_back_left" },
    { kind: "blocked", label: "進入不可" },
    { kind: "slot", slotKey: "player_back_right" },
  ],
];

const BOARD_SLOT_KEYS = BOARD_CELLS.flatMap((row) =>
  row.flatMap((cell) => (cell.kind === "slot" ? [cell.slotKey] : [])),
);
const PLAYER_IDS: PlayerId[] = ["player", "cpu"];
const CPU_STEP_DELAY_MS = 520;
const VISUAL_EFFECT_DURATION_MS = 900;
const AUTO_STEP_DELAY_MIN_MS = 100;
const AUTO_STEP_DELAY_MAX_MS = 3000;
const AUTO_STEP_DELAY_STEP_MS = 50;
const AUTO_STEP_DELAY_DEFAULT_MS = 650;
const MAX_VISIBLE_RESOURCE_ICONS = 10;
const DEFAULT_BATTLE_SEED = 20260612;

type Selection =
  | { kind: "hand"; instanceId: string }
  | { kind: "monster"; slotKey: SlotKey }
  | { kind: "command"; attackerSlotKey: SlotKey; commandId: string; targets: Target[] }
  | { kind: "commandSecondaryTarget"; attackerSlotKey: SlotKey; commandId: string; target: Target; targets: Target[] }
  | { kind: "commandHandChoice"; attackerSlotKey: SlotKey; commandId: string; target: Target; choices: CardInstance[] }
  | { kind: "masterAction"; actionId: MasterActionId; targets: Target[] }
  | { kind: "magicSecondaryTarget"; handInstanceId: string; target: Target; targets: Target[] }
  | { kind: "magicHandChoice"; handInstanceId: string; target: Target; choices: CardInstance[] }
  | { kind: "magicRefresh"; handInstanceId: string; target: Target; choices: CardInstance[]; selectedIds: string[] }
  | { kind: "magicSearch"; handInstanceId: string; target: Target; categories: Array<NonNullable<MagicAction["searchCategory"]>> }
  | { kind: "move"; fromSlotKey: SlotKey; targets: SlotKey[] };

type DragPayload =
  | { kind: "hand"; instanceId: string }
  | { kind: "monster"; slotKey: SlotKey };

type PendingDropAction =
  | { kind: "magic"; handInstanceId: string; target: Target }
  | { kind: "attackTarget"; attackerSlotKey: SlotKey; target: Target; commandIds: string[] }
  | { kind: "move"; fromSlotKey: SlotKey; toSlotKey: SlotKey };

type ZoneView =
  | { kind: "playerZone"; playerId: PlayerId; zone: "deck" | "discard" | "hand" }
  | { kind: "catalog" }
  | { kind: "effects" }
  | { kind: "deckSetup" };
type LogFilter = "all" | "battle" | "damage" | "support" | "turn" | "cpu";
type BattleMode = "player-vs-cpu" | "cpu-vs-cpu";
type TargetRole = "ally" | "enemy" | "move" | "summon" | "empty" | "master";

interface BattleSettings {
  seed: number;
  seedInput: string;
  firstPlayer: PlayerId;
  mode: BattleMode;
}

interface DeckSettings {
  fixed: Record<PlayerId, boolean>;
  text: Record<PlayerId, string>;
}

interface DeckDraft {
  playerId: PlayerId;
  fixed: boolean;
  cardIds: string[];
  summary: DeckValidationSummary;
}

const DRAG_MIME = "application/x-card-hero-drag";

const LOG_FILTERS: LogFilter[] = ["all", "battle", "damage", "support", "turn", "cpu"];

const MASTER_ACTIONS: Array<{ id: MasterActionId; label: string }> = [
  { id: "master_attack", label: "Master Attack" },
  { id: "wake_up", label: "Wake Up" },
  { id: "shield", label: "Shield" },
];

type EffectKind = "attack" | "damage" | "summon" | "focus" | "move" | "heal" | "turn" | "random" | "default";

interface VisualEffect {
  id: number;
  kind: EffectKind;
  slots: SlotKey[];
  masters: PlayerId[];
  slotDamageFlashes: SlotDamageFlash[];
  masterDamageFlashes: MasterDamageFlash[];
}

interface DamageFlash {
  amount: number;
  defeated: boolean;
}

interface SlotDamageFlash extends DamageFlash {
  slotKey: SlotKey;
}

interface MasterDamageFlash extends DamageFlash {
  playerId: PlayerId;
}

function createBattleSettings(seed: number): BattleSettings {
  return {
    seed,
    seedInput: String(seed),
    firstPlayer: "player",
    mode: "player-vs-cpu",
  };
}

function createDeckSettings(seed: number): DeckSettings {
  return {
    fixed: { player: false, cpu: false },
    text: {
      player: generatedDeckText("player", seed),
      cpu: generatedDeckText("cpu", seed),
    },
  };
}

function createGameFromSettings(settings: BattleSettings, deckSettings: DeckSettings): GameState {
  const playerDeck = createDeckDraft(settings, deckSettings, "player");
  const cpuDeck = createDeckDraft(settings, deckSettings, "cpu");
  return createInitialGame(settings.seed, {
    firstPlayer: settings.firstPlayer,
    playerDeckCardIds: deckSettings.fixed.player ? playerDeck.cardIds : undefined,
    cpuDeckCardIds: deckSettings.fixed.cpu ? cpuDeck.cardIds : undefined,
  });
}

function createDeckDraft(settings: BattleSettings, deckSettings: DeckSettings, playerId: PlayerId): DeckDraft {
  if (!deckSettings.fixed[playerId]) {
    const cardIds = generatedDeckCardIds(playerId, settings.seed);
    return {
      playerId,
      fixed: false,
      cardIds,
      summary: summarizeDeckCardIds(cardIds),
    };
  }

  const parsed = parseDeckText(deckSettings.text[playerId]);
  return {
    playerId,
    fixed: true,
    cardIds: parsed.cardIds,
    summary: summarizeDeckCardIds(parsed.cardIds, parsed.unknownTokens),
  };
}

function createDeckDrafts(settings: BattleSettings, deckSettings: DeckSettings): Record<PlayerId, DeckDraft> {
  return {
    player: createDeckDraft(settings, deckSettings, "player"),
    cpu: createDeckDraft(settings, deckSettings, "cpu"),
  };
}

function generatedDeckCardIds(playerId: PlayerId, seed: number): string[] {
  return buildDeckCardIds(seed + (playerId === "player" ? 101 : 202));
}

function generatedDeckText(playerId: PlayerId, seed: number): string {
  return deckTextFromCardIds(generatedDeckCardIds(playerId, seed));
}

function normalizeSeedInput(value: string, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.max(0, Math.floor(parsed)) >>> 0;
}

export function App() {
  const [battleSettings, setBattleSettings] = useState<BattleSettings>(() => createBattleSettings(DEFAULT_BATTLE_SEED));
  const [deckSettings, setDeckSettings] = useState<DeckSettings>(() => createDeckSettings(DEFAULT_BATTLE_SEED));
  const [game, setGame] = useState<GameState>(() =>
    createGameFromSettings(createBattleSettings(DEFAULT_BATTLE_SEED), createDeckSettings(DEFAULT_BATTLE_SEED)),
  );
  const [selection, setSelection] = useState<Selection | undefined>();
  const [pendingDropAction, setPendingDropAction] = useState<PendingDropAction | undefined>();
  const [error, setError] = useState<string>("");
  const [visualEffect, setVisualEffect] = useState<VisualEffect | undefined>();
  const [pointerDragging, setPointerDragging] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [autoStepDelayMs, setAutoStepDelayMs] = useState(AUTO_STEP_DELAY_DEFAULT_MS);
  const [zoneView, setZoneView] = useState<ZoneView | undefined>();
  const [logFilter, setLogFilter] = useState<LogFilter>("all");
  const [selectedLogIndex, setSelectedLogIndex] = useState<number | undefined>();
  const previousGameRef = useRef<GameState>(game);
  const visualEffectIdRef = useRef(0);
  const pointerDragRef = useRef<{
    payload: DragPayload;
    startX: number;
    startY: number;
    dragging: boolean;
  } | undefined>(undefined);
  const pointerDragCleanupRef = useRef<(() => void) | undefined>(undefined);
  const suppressNextClickRef = useRef(false);

  const deckDrafts = useMemo(() => createDeckDrafts(battleSettings, deckSettings), [battleSettings, deckSettings]);
  const fixedDeckError = PLAYER_IDS.some((playerId) => deckSettings.fixed[playerId] && !deckDrafts[playerId].summary.valid);
  const currentPlayer = game.players[game.currentPlayer];
  const cpuVsCpu = battleSettings.mode === "cpu-vs-cpu";
  const isAutoResolving = !game.winner && (cpuVsCpu || autoPlayEnabled || (game.currentPlayer === "cpu" && !game.pendingLevelUp));
  const controlsDisabled = cpuVsCpu || autoPlayEnabled || game.currentPlayer !== "player" || !!game.winner || !!game.pendingLevelUp;
  const turnStatus = game.winner
    ? `${playerLabel(game.winner)} win`
    : cpuVsCpu
      ? `CPU vs CPU... ${playerLabel(game.currentPlayer)}`
      : autoPlayEnabled
      ? `Auto playing... ${playerLabel(game.currentPlayer)}`
      : isAutoResolving
        ? "CPU resolving..."
        : playerLabel(game.currentPlayer);
  const targetKeys = useMemo(() => {
    if (pendingDropAction) {
      return new Set([pendingDropActionTargetKey(pendingDropAction)]);
    }
    if (!selection) {
      return new Set<string>();
    }
    if (selection.kind === "command") {
      return new Set(selection.targets.map(targetToKey));
    }
    if (selection.kind === "commandSecondaryTarget") {
      return new Set(selection.targets.map(targetToKey));
    }
    if (selection.kind === "masterAction") {
      return new Set(selection.targets.map(targetToKey));
    }
    if (selection.kind === "magicSecondaryTarget") {
      return new Set(selection.targets.map(targetToKey));
    }
    if (selection.kind === "move") {
      return new Set(selection.targets.map((slotKey) => `monster:${slotKey}`));
    }
    if (selection.kind === "hand") {
      const handCard = getHandCard(game, selection.instanceId);
      if (!handCard) {
        return new Set<string>();
      }
      const def = getCardDef(handCard.cardId);
      if (def.type === "magic") {
        return new Set(getMagicTargets(game, selection.instanceId).map(targetToKey));
      }
      return new Set(
        BOARD_SLOT_KEYS
          .filter((slotKey) => canSummonTo(game, selection.instanceId, slotKey))
          .map((slotKey) => `monster:${slotKey}`),
      );
    }
    return new Set<string>();
  }, [game, pendingDropAction, selection]);
  const visibleLogEntries = useMemo(
    () =>
      game.log
        .map((entry, index) => ({ entry, index }))
        .filter(({ entry }) => logMatchesFilter(entry, logFilter))
        .slice(-24),
    [game.log, logFilter],
  );
  const selectedLogEntry = selectedLogIndex !== undefined ? game.log[selectedLogIndex] : undefined;

  useEffect(() => {
    if (selectedLogIndex === undefined) {
      return;
    }
    const entry = game.log[selectedLogIndex];
    if (!entry || !logMatchesFilter(entry, logFilter)) {
      setSelectedLogIndex(undefined);
    }
  }, [game.log, logFilter, selectedLogIndex]);

  useEffect(() => {
    const previous = previousGameRef.current;
    if (previous !== game) {
      visualEffectIdRef.current += 1;
      setVisualEffect(createVisualEffect(previous, game, visualEffectIdRef.current));
      previousGameRef.current = game;
    }
  }, [game]);

  useEffect(() => {
    if (!isAutoResolving) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setGame((previous) => {
        if (previous.winner) {
          return previous;
        }
        if (cpuVsCpu || autoPlayEnabled) {
          return runAutoStep(previous);
        }
        if (previous.currentPlayer === "cpu" && !previous.pendingLevelUp) {
          return runCpuStep(previous);
        }
        return previous;
      });
    }, cpuVsCpu || autoPlayEnabled ? autoStepDelayMs : CPU_STEP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [autoPlayEnabled, autoStepDelayMs, cpuVsCpu, game, isAutoResolving]);

  useEffect(() => {
    if (!visualEffect) {
      return undefined;
    }
    const timer = window.setTimeout(() => setVisualEffect(undefined), VISUAL_EFFECT_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [visualEffect]);

  useEffect(() => () => clearPointerDrag(), []);

  function applyChange(change: (state: GameState) => GameState, keepSelection = false) {
    try {
      setGame(change(game));
      setError("");
      setPendingDropAction(undefined);
      if (!keepSelection) {
        setSelection(undefined);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "操作に失敗しました");
    }
  }

  function resolveMagicPrimaryTarget(handInstanceId: string, target: Target) {
    const secondaryTargets = getMagicSecondaryTargets(game, { handInstanceId, target });
    if (secondaryTargets.length > 0) {
      setPendingDropAction(undefined);
      setSelection({ kind: "magicSecondaryTarget", handInstanceId, target, targets: secondaryTargets });
      setError("");
      return;
    }

    const handChoices = getMagicHandChoices(game, handInstanceId);
    const handCard = getHandCard(game, handInstanceId);
    if (handCard?.cardId === "card_116" && handChoices.length > 0) {
      setPendingDropAction(undefined);
      setSelection({
        kind: "magicRefresh",
        handInstanceId,
        target,
        choices: handChoices,
        selectedIds: handChoices.map((card) => card.instanceId),
      });
      setError("");
      return;
    }
    if (handChoices.length > 0) {
      setPendingDropAction(undefined);
      setSelection({ kind: "magicHandChoice", handInstanceId, target, choices: handChoices });
      setError("");
      return;
    }

    const categories = getMagicSearchCategories(game, handInstanceId);
    if (categories.length > 0) {
      setPendingDropAction(undefined);
      setSelection({ kind: "magicSearch", handInstanceId, target, categories });
      setError("");
      return;
    }

    applyChange((state) => playMagic(state, { handInstanceId, target }));
  }

  function resolveCommandPrimaryTarget(attackerSlotKey: SlotKey, commandId: string, target: Target) {
    const secondaryTargets = getCommandSecondaryTargets(game, { attackerSlotKey, commandId, target });
    if (secondaryTargets.length > 0) {
      setPendingDropAction(undefined);
      setSelection({ kind: "commandSecondaryTarget", attackerSlotKey, commandId, target, targets: secondaryTargets });
      setError("");
      return;
    }

    const handChoices = getCommandHandChoices(game, attackerSlotKey, commandId);
    if (handChoices.length > 0) {
      setPendingDropAction(undefined);
      setSelection({ kind: "commandHandChoice", attackerSlotKey, commandId, target, choices: handChoices });
      setError("");
      return;
    }

    applyChange((state) =>
      attackWithCommand(state, {
        attackerSlotKey,
        commandId,
        target,
      }),
    );
  }

  function handleSlotClick(slotKey: SlotKey) {
    if (consumeSuppressedClick()) {
      return;
    }
    if (game.currentPlayer !== "player" || game.winner || game.pendingLevelUp) {
      selectSlotForInfo(slotKey);
      return;
    }

    const slot = game.slots[slotKey];
    if (pendingDropAction) {
      if (slot.monster?.owner === game.currentPlayer && slot.monster.status === "active") {
        setPendingDropAction(undefined);
        setSelection({ kind: "monster", slotKey });
        setError("");
        return;
      }
      setPendingDropAction(undefined);
      setSelection(undefined);
      return;
    }

    if (selection?.kind === "hand") {
      const target: Target = { kind: "monster", slotKey };
      const handCard = getHandCard(game, selection.instanceId);
      if (handCard && getCardDef(handCard.cardId).type === "monster" && canSummonTo(game, selection.instanceId, slotKey)) {
        applyChange((state) => summonMonster(state, selection.instanceId, slotKey));
        return;
      }
      if (targetKeys.has(targetToKey(target))) {
        resolveMagicPrimaryTarget(selection.instanceId, target);
        return;
      }
    }

    if (selection?.kind === "command") {
      const target: Target = { kind: "monster", slotKey };
      if (targetKeys.has(targetToKey(target))) {
        resolveCommandPrimaryTarget(selection.attackerSlotKey, selection.commandId, target);
        return;
      }
    }

    if (selection?.kind === "magicSecondaryTarget") {
      const target: Target = { kind: "monster", slotKey };
      if (targetKeys.has(targetToKey(target))) {
        applyChange((state) =>
          playMagic(state, {
            handInstanceId: selection.handInstanceId,
            target: selection.target,
            secondaryTarget: target,
          }),
        );
        return;
      }
    }

    if (selection?.kind === "commandSecondaryTarget") {
      const target: Target = { kind: "monster", slotKey };
      if (targetKeys.has(targetToKey(target))) {
        applyChange((state) =>
          attackWithCommand(state, {
            attackerSlotKey: selection.attackerSlotKey,
            commandId: selection.commandId,
            target: selection.target,
            secondaryTarget: target,
          }),
        );
        return;
      }
    }

    if (selection?.kind === "masterAction") {
      const target: Target = { kind: "monster", slotKey };
      if (targetKeys.has(targetToKey(target))) {
        applyChange((state) => useMasterAction(state, selection.actionId, target));
        return;
      }
    }

    if (selection?.kind === "move" && targetKeys.has(`monster:${slotKey}`)) {
      applyChange((state) => moveMonster(state, selection.fromSlotKey, slotKey));
      return;
    }

    selectSlotForInfo(slotKey);
  }

  function selectSlotForInfo(slotKey: SlotKey) {
    setPendingDropAction(undefined);
    setSelection(game.slots[slotKey].monster ? { kind: "monster", slotKey } : undefined);
    setError("");
  }

  function handleMasterClick(playerId: "player" | "cpu") {
    if (consumeSuppressedClick()) {
      return;
    }
    if (game.currentPlayer !== "player" || game.winner || game.pendingLevelUp) {
      return;
    }
    if (pendingDropAction) {
      return;
    }
    const target: Target = { kind: "master", playerId };
    if (selection?.kind === "command" && targetKeys.has(targetToKey(target))) {
      resolveCommandPrimaryTarget(selection.attackerSlotKey, selection.commandId, target);
      return;
    }
    if (selection?.kind === "hand" && targetKeys.has(targetToKey(target))) {
      resolveMagicPrimaryTarget(selection.instanceId, target);
      return;
    }
    setPendingDropAction(undefined);
    setSelection(undefined);
    setError("");
  }

  function handleEndTurn() {
    applyChange(endTurn);
  }

  function startNewGame(settings: BattleSettings, decks: DeckSettings) {
    const drafts = createDeckDrafts(settings, decks);
    const invalidPlayer = PLAYER_IDS.find((playerId) => decks.fixed[playerId] && !drafts[playerId].summary.valid);
    if (invalidPlayer) {
      setZoneView({ kind: "deckSetup" });
      setError(`${playerLabel(invalidPlayer)}の固定デッキを修正してください`);
      return;
    }

    const next = createGameFromSettings(settings, decks);
    previousGameRef.current = next;
    setGame(next);
    setSelection(undefined);
    setPendingDropAction(undefined);
    setZoneView(undefined);
    setError("");
    setVisualEffect(undefined);
    setAutoPlayEnabled(false);
  }

  function handleNewGame() {
    startNewGame(battleSettings, deckSettings);
  }

  function handleRandomSeedNewGame() {
    const seed = Math.floor(Math.random() * 1_000_000_000);
    const nextSettings = { ...battleSettings, seed, seedInput: String(seed) };
    setBattleSettings(nextSettings);
    startNewGame(nextSettings, deckSettings);
  }

  function handleBattleSeedChange(value: string) {
    const parsed = normalizeSeedInput(value, battleSettings.seed);
    setBattleSettings({ ...battleSettings, seedInput: value, seed: parsed });
  }

  function handleBattleFirstPlayerChange(value: string) {
    if (value !== "player" && value !== "cpu") {
      return;
    }
    setBattleSettings({ ...battleSettings, firstPlayer: value });
  }

  function handleBattleModeChange(value: string) {
    if (value !== "player-vs-cpu" && value !== "cpu-vs-cpu") {
      return;
    }
    setBattleSettings({ ...battleSettings, mode: value });
    setAutoPlayEnabled(false);
  }

  function handleRandomSeed() {
    const seed = Math.floor(Math.random() * 1_000_000_000);
    setBattleSettings({ ...battleSettings, seed, seedInput: String(seed) });
  }

  function handleDeckFixedChange(playerId: PlayerId, fixed: boolean) {
    setDeckSettings((previous) => ({
      fixed: { ...previous.fixed, [playerId]: fixed },
      text: {
        ...previous.text,
        [playerId]: previous.text[playerId] || generatedDeckText(playerId, battleSettings.seed),
      },
    }));
  }

  function handleDeckTextChange(playerId: PlayerId, text: string) {
    setDeckSettings((previous) => ({
      ...previous,
      text: { ...previous.text, [playerId]: text },
    }));
  }

  function handleUseGeneratedDeckAsFixed(playerId: PlayerId) {
    setDeckSettings((previous) => ({
      fixed: { ...previous.fixed, [playerId]: true },
      text: { ...previous.text, [playerId]: generatedDeckText(playerId, battleSettings.seed) },
    }));
  }

  function handleAutoDelayChange(value: string) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return;
    }
    setAutoStepDelayMs(clampNumber(
      Math.round(parsed / AUTO_STEP_DELAY_STEP_MS) * AUTO_STEP_DELAY_STEP_MS,
      AUTO_STEP_DELAY_MIN_MS,
      AUTO_STEP_DELAY_MAX_MS,
    ));
  }

  function handleHandDragStart(event: DragEvent<HTMLButtonElement>, instanceId: string) {
    startDrag(event, { kind: "hand", instanceId });
  }

  function handleMonsterDragStart(event: DragEvent<HTMLButtonElement>, slotKey: SlotKey) {
    if (!canDragMonsterFromSlot(slotKey)) {
      event.preventDefault();
      return;
    }
    startDrag(event, { kind: "monster", slotKey });
  }

  function startDrag(event: DragEvent<HTMLElement>, payload: DragPayload) {
    if (controlsDisabled) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(DRAG_MIME, JSON.stringify(payload));
  }

  function handleHandPointerDown(event: ReactPointerEvent<HTMLButtonElement>, instanceId: string) {
    startPointerDrag(event, { kind: "hand", instanceId });
  }

  function handleMonsterPointerDown(event: ReactPointerEvent<HTMLButtonElement>, slotKey: SlotKey) {
    if (!canDragMonsterFromSlot(slotKey)) {
      return;
    }
    startPointerDrag(event, { kind: "monster", slotKey });
  }

  function startPointerDrag(event: ReactPointerEvent<HTMLElement>, payload: DragPayload) {
    if (controlsDisabled || event.button !== 0) {
      return;
    }

    clearPointerDrag();
    pointerDragRef.current = {
      payload,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
    };

    const handleMove = (nativeEvent: PointerEvent) => {
      const current = pointerDragRef.current;
      if (!current) {
        return;
      }
      const distance = Math.hypot(nativeEvent.clientX - current.startX, nativeEvent.clientY - current.startY);
      if (!current.dragging && distance >= 8) {
        current.dragging = true;
        setPointerDragging(true);
      }
      if (current.dragging) {
        nativeEvent.preventDefault();
      }
    };

    const handleUp = (nativeEvent: PointerEvent) => {
      const current = pointerDragRef.current;
      clearPointerDrag();
      if (!current?.dragging) {
        return;
      }
      nativeEvent.preventDefault();
      suppressNextClick();

      const target = dropTargetFromPoint(nativeEvent.clientX, nativeEvent.clientY);
      if (!target) {
        setPendingDropAction(undefined);
        setError("この移動に対応する行動がありません");
        return;
      }
      handleDropAction(current.payload, target);
    };

    const handleCancel = () => {
      clearPointerDrag();
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp, { once: true });
    window.addEventListener("pointercancel", handleCancel, { once: true });
    pointerDragCleanupRef.current = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleCancel);
    };
  }

  function clearPointerDrag() {
    pointerDragCleanupRef.current?.();
    pointerDragCleanupRef.current = undefined;
    pointerDragRef.current = undefined;
    setPointerDragging(false);
  }

  function suppressNextClick() {
    suppressNextClickRef.current = true;
    window.setTimeout(() => {
      suppressNextClickRef.current = false;
    }, 0);
  }

  function consumeSuppressedClick(): boolean {
    if (!suppressNextClickRef.current) {
      return false;
    }
    suppressNextClickRef.current = false;
    return true;
  }

  function dropTargetFromPoint(x: number, y: number): Target | undefined {
    const element = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-slot-key], [data-master-id]");
    if (!element) {
      return undefined;
    }
    const slotKey = element.dataset.slotKey;
    if (slotKey && slotKey in game.slots) {
      return { kind: "monster", slotKey: slotKey as SlotKey };
    }
    const masterId = element.dataset.masterId;
    if (masterId === "player" || masterId === "cpu") {
      return { kind: "master", playerId: masterId };
    }
    return undefined;
  }

  function handleDragOver(event: DragEvent<HTMLElement>) {
    if (!Array.from(event.dataTransfer.types).includes(DRAG_MIME)) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleSlotDrop(event: DragEvent<HTMLElement>, slotKey: SlotKey) {
    event.preventDefault();
    const payload = readDragPayload(event);
    if (!payload) {
      return;
    }
    handleDropAction(payload, { kind: "monster", slotKey });
  }

  function handleMasterDrop(event: DragEvent<HTMLElement>, playerId: PlayerId) {
    event.preventDefault();
    const payload = readDragPayload(event);
    if (!payload) {
      return;
    }
    handleDropAction(payload, { kind: "master", playerId });
  }

  function readDragPayload(event: DragEvent<HTMLElement>): DragPayload | undefined {
    const raw = event.dataTransfer.getData(DRAG_MIME);
    if (!raw) {
      return undefined;
    }
    try {
      const parsed = JSON.parse(raw) as Partial<DragPayload>;
      if (parsed.kind === "hand" && typeof parsed.instanceId === "string") {
        return { kind: "hand", instanceId: parsed.instanceId };
      }
      if (parsed.kind === "monster" && typeof parsed.slotKey === "string" && parsed.slotKey in game.slots) {
        return { kind: "monster", slotKey: parsed.slotKey as SlotKey };
      }
    } catch {
      return undefined;
    }
    return undefined;
  }

  function handleDropAction(payload: DragPayload, target: Target) {
    if (applyImmediateDropAction(payload, target)) {
      return;
    }

    const action = createPendingDropAction(payload, target);
    if (!action) {
      setPendingDropAction(undefined);
      setError("この移動に対応する行動がありません");
      return;
    }
    setPendingDropAction(action);
    setSelection(selectionFromPendingDropAction(action));
    setError("");
  }

  function applyImmediateDropAction(payload: DragPayload, target: Target): boolean {
    if (controlsDisabled || payload.kind !== "hand" || target.kind !== "monster") {
      return false;
    }

    const handCard = getHandCard(game, payload.instanceId);
    if (!handCard) {
      return false;
    }

    const def = getCardDef(handCard.cardId);
    if (def.type !== "monster" || !canSummonTo(game, payload.instanceId, target.slotKey)) {
      return false;
    }

    applyChange((state) => summonMonster(state, payload.instanceId, target.slotKey));
    return true;
  }

  function createPendingDropAction(payload: DragPayload, target: Target): PendingDropAction | undefined {
    if (controlsDisabled) {
      return undefined;
    }

    if (payload.kind === "hand") {
      const handCard = getHandCard(game, payload.instanceId);
      if (!handCard) {
        return undefined;
      }
      const def = getCardDef(handCard.cardId);
      if (def.type === "magic" && getMagicTargets(game, payload.instanceId).some((candidate) => targetToKey(candidate) === targetToKey(target))) {
        return { kind: "magic", handInstanceId: payload.instanceId, target };
      }
      return undefined;
    }

    const source = game.slots[payload.slotKey];
    const monster = source.monster;
    if (!monster || monster.owner !== game.currentPlayer || monster.status !== "active" || monster.actionCount >= monster.actionLimit) {
      return undefined;
    }

    if (target.kind === "monster") {
      const targetSlot = game.slots[target.slotKey];
      if (targetSlot.owner === game.currentPlayer && getMovableTargets(game, payload.slotKey).includes(target.slotKey)) {
        return { kind: "move", fromSlotKey: payload.slotKey, toSlotKey: target.slotKey };
      }
    }

    const commandIds = getCommandsTargetingTarget(game, payload.slotKey, target).map((command) => command.id);
    if (commandIds.length === 0) {
      return undefined;
    }
    return { kind: "attackTarget", attackerSlotKey: payload.slotKey, commandIds, target };
  }

  function canDragMonsterFromSlot(slotKey: SlotKey): boolean {
    const monster = game.slots[slotKey].monster;
    return (
      !controlsDisabled &&
      !!monster &&
      monster.owner === game.currentPlayer &&
      monster.status === "active" &&
      monster.actionCount < monster.actionLimit
    );
  }

  function handleConfirmPendingDropAction() {
    if (!pendingDropAction) {
      return;
    }
    if (pendingDropAction.kind === "attackTarget") {
      return;
    }
    if (pendingDropAction.kind === "magic") {
      resolveMagicPrimaryTarget(pendingDropAction.handInstanceId, pendingDropAction.target);
      return;
    }
    if (pendingDropAction.kind === "move") {
      applyChange((state) => moveMonster(state, pendingDropAction.fromSlotKey, pendingDropAction.toSlotKey));
      return;
    }
  }

  function handlePendingAttackCommand(commandId: string) {
    if (!pendingDropAction || pendingDropAction.kind !== "attackTarget") {
      return;
    }
    resolveCommandPrimaryTarget(pendingDropAction.attackerSlotKey, commandId, pendingDropAction.target);
  }

  function handleCancelPendingDropAction() {
    setPendingDropAction(undefined);
    setSelection(undefined);
    setError("");
  }

  const selectedMonster =
    selection?.kind === "monster" ? game.slots[selection.slotKey].monster : undefined;
  const selectedHand =
    selection?.kind === "hand" ? currentPlayer.hand.find((card) => card.instanceId === selection.instanceId) : undefined;

  return (
    <main className={`app-shell ${pointerDragging ? "dragging" : ""}`}>
      <header className="topbar">
        <div>
          <h1>Card Hero Prototype</h1>
          <p>Turn {game.turnNumber} / {turnStatus}</p>
        </div>
        <div className="topbar-actions">
          <label className="battle-setting-control">
            Seed
            <input
              type="number"
              min={0}
              value={battleSettings.seedInput}
              onChange={(event) => handleBattleSeedChange(event.target.value)}
            />
          </label>
          <label className="battle-setting-control">
            First
            <select
              value={battleSettings.firstPlayer}
              onChange={(event) => handleBattleFirstPlayerChange(event.target.value)}
            >
              <option value="player">Player</option>
              <option value="cpu">CPU</option>
            </select>
          </label>
          <label className="battle-setting-control">
            Mode
            <select
              value={battleSettings.mode}
              onChange={(event) => handleBattleModeChange(event.target.value)}
            >
              <option value="player-vs-cpu">Player vs CPU</option>
              <option value="cpu-vs-cpu">CPU vs CPU</option>
            </select>
          </label>
          <button type="button" onClick={() => setAutoPlayEnabled((enabled) => !enabled)} disabled={cpuVsCpu}>
            <Icon icon={autoPlayEnabled ? "⏸️" : "▶️"} /> {autoPlayEnabled ? "Auto Stop" : "Auto Play"}
          </button>
          <label className="auto-delay-control">
            Wait
            <input
              type="number"
              min={AUTO_STEP_DELAY_MIN_MS}
              max={AUTO_STEP_DELAY_MAX_MS}
              step={AUTO_STEP_DELAY_STEP_MS}
              value={autoStepDelayMs}
              onChange={(event) => handleAutoDelayChange(event.target.value)}
            />
            ms
          </label>
          <button type="button" onClick={handleRandomSeed}>
            <Icon icon="🎲" /> Seed
          </button>
          <button
            type="button"
            className={zoneView?.kind === "deckSetup" ? "selected" : ""}
            onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "deckSetup" }))}
          >
            <Icon icon="🧩" /> Decks
          </button>
          <button type="button" onClick={handleNewGame} disabled={fixedDeckError}>
            <Icon icon="🔄" /> New Game
          </button>
        </div>
      </header>

      <section className="play-layout">
        <div className="battle-area">
          <div className="board" aria-label="field">
            {BOARD_CELLS.map((row, rowIndex) => (
              <div className="board-row" key={rowIndex}>
                {row.map((cell) => {
                  if (cell.kind === "slot") {
                    return (
                      <BoardSlot
                        key={cell.slotKey}
                        slotKey={cell.slotKey}
                        game={game}
                        selected={isSelectedSourceSlot(selection, pendingDropAction, cell.slotKey)}
                        targetable={targetKeys.has(`monster:${cell.slotKey}`)}
                        targetRole={targetRoleForTarget(game, { kind: "monster", slotKey: cell.slotKey }, targetKeys, selection, pendingDropAction)}
                        effectKind={visualEffect?.slots.includes(cell.slotKey) ? visualEffect.kind : undefined}
                        effectId={visualEffect?.id}
                        damageFlash={visualEffect?.slotDamageFlashes.find((flash) => flash.slotKey === cell.slotKey)}
                        draggable={canDragMonsterFromSlot(cell.slotKey)}
                        onDragStart={(event) => handleMonsterDragStart(event, cell.slotKey)}
                        onPointerDown={(event) => handleMonsterPointerDown(event, cell.slotKey)}
                        onDragOver={handleDragOver}
                        onDrop={(event) => handleSlotDrop(event, cell.slotKey)}
                        onClick={() => handleSlotClick(cell.slotKey)}
                      />
                    );
                  }
                  if (cell.kind === "master") {
                    const damageFlash = visualEffect?.masterDamageFlashes.find((flash) => flash.playerId === cell.playerId);
                    const targetRole = targetRoleForTarget(game, { kind: "master", playerId: cell.playerId }, targetKeys, selection, pendingDropAction);
                    return (
                      <button
                        key={cell.playerId}
                        type="button"
                        className={[
                          "master",
                          cell.playerId === "cpu" ? "master-cpu" : "master-player",
                          targetKeys.has(`master:${cell.playerId}`) ? "targetable" : "",
                          targetRole ? `target-${targetRole}` : "",
                          visualEffect?.masters.includes(cell.playerId) ? `effect-active effect-${visualEffect.kind}` : "",
                          damageFlash?.defeated ? "effect-defeated" : "",
                        ].join(" ")}
                        onDragOver={handleDragOver}
                        onDrop={(event) => handleMasterDrop(event, cell.playerId)}
                        data-master-id={cell.playerId}
                        onClick={() => handleMasterClick(cell.playerId)}
                        aria-label={`${cell.label} HP ${game.players[cell.playerId].masterHp} Stone ${game.players[cell.playerId].stones} Deck ${game.players[cell.playerId].deck.length} Hand ${game.players[cell.playerId].hand.length}`}
                      >
                        <MasterResourceDisplay
                          label={cell.label}
                          active={game.currentPlayer === cell.playerId}
                          hp={game.players[cell.playerId].masterHp}
                          stones={game.players[cell.playerId].stones}
                          deck={game.players[cell.playerId].deck.length}
                          hand={game.players[cell.playerId].hand.length}
                        />
                        {targetRole && <span className="target-badge">{targetRoleLabel(targetRole)}</span>}
                        <DamageBubble key={visualEffect?.id} flash={damageFlash} />
                      </button>
                    );
                  }
                  return (
                    <div key={`${cell.label}_${rowIndex}`} className="blocked-cell" aria-label={cell.label}>
                      <span>{cell.label}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <section className="hand-area">
            <div className="hand-heading">
              <h2>Hand</h2>
              <div className="hand-tools">
                <button
                  type="button"
                  className={isZoneView(zoneView, "player", "deck") ? "selected" : ""}
                  onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "playerZone", playerId: "player", zone: "deck" }))}
                >
                  <Icon icon="🂠" /> Deck {game.players.player.deck.length}
                </button>
                <button
                  type="button"
                  className={isZoneView(zoneView, "player", "discard") ? "selected" : ""}
                  onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "playerZone", playerId: "player", zone: "discard" }))}
                >
                  <Icon icon="🗂️" /> Discard {game.players.player.discard.length}
                </button>
                <button
                  type="button"
                  className={isZoneView(zoneView, "player", "hand") ? "selected" : ""}
                  onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "playerZone", playerId: "player", zone: "hand" }))}
                >
                  <Icon icon="🃏" /> Hand {game.players.player.hand.length}
                </button>
                <button
                  type="button"
                  className={isZoneView(zoneView, "cpu", "discard") ? "selected" : ""}
                  onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "playerZone", playerId: "cpu", zone: "discard" }))}
                >
                  <Icon icon="🗂️" /> CPU {game.players.cpu.discard.length}
                </button>
                <button
                  type="button"
                  className={zoneView?.kind === "effects" ? "selected" : ""}
                  onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "effects" }))}
                >
                  <Icon icon="📜" /> Effects
                </button>
                <button
                  type="button"
                  className={zoneView?.kind === "catalog" ? "selected" : ""}
                  onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "catalog" }))}
                >
                  <Icon icon="📚" /> Card List
                </button>
                <StatusIconCount label="Cards" icon="🃏" amount={currentPlayer.hand.length} cap={MAX_VISIBLE_RESOURCE_ICONS} />
              </div>
            </div>
            <div className="hand-list">
              {currentPlayer.hand.map((card) => (
                <button
                  type="button"
                  key={card.instanceId}
                  className={`hand-card ${isSelectedSourceHand(selection, pendingDropAction, card.instanceId) ? "selected" : ""}`}
                  draggable={!controlsDisabled}
                  onDragStart={(event) => handleHandDragStart(event, card.instanceId)}
                  onPointerDown={(event) => handleHandPointerDown(event, card.instanceId)}
                  onClick={() => {
                    if (consumeSuppressedClick()) {
                      return;
                    }
                    setPendingDropAction(undefined);
                    setSelection({ kind: "hand", instanceId: card.instanceId });
                    setError("");
                  }}
                  disabled={controlsDisabled}
                >
                  <HandCardContent cardId={card.cardId} />
                </button>
              ))}
            </div>
            {zoneView?.kind === "deckSetup" ? (
              <DeckSetupPanel
                battleSettings={battleSettings}
                deckSettings={deckSettings}
                drafts={deckDrafts}
                onClose={() => setZoneView(undefined)}
                onFixedChange={handleDeckFixedChange}
                onTextChange={handleDeckTextChange}
                onUseGeneratedDeck={handleUseGeneratedDeckAsFixed}
              />
            ) : zoneView ? (
              <CardZonePanel
                game={game}
                view={zoneView}
                onClose={() => setZoneView(undefined)}
              />
            ) : null}
          </section>
        </div>

        <aside className="side-panel">
          <section className="log-panel">
            <div className="log-heading">
              <h2>Log</h2>
              <span>{visibleLogEntries.length}/{game.log.length}</span>
            </div>
            <div className="log-filter-row" aria-label="log filters">
              {LOG_FILTERS.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  className={filter === logFilter ? "selected" : ""}
                  onClick={() => setLogFilter(filter)}
                >
                  <Icon icon={logFilterIcon(filter)} /> {logFilterLabel(filter)}
                </button>
              ))}
            </div>
            <ol>
              {visibleLogEntries.map(({ entry, index }) => (
                <li className={`log-entry ${logTone(entry)}`} key={`${entry}_${index}`}>
                  <button
                    type="button"
                    className={`log-entry-button ${selectedLogIndex === index ? "selected" : ""}`}
                    onClick={() => setSelectedLogIndex(selectedLogIndex === index ? undefined : index)}
                  >
                    <Icon icon={logIcon(entry)} />
                    <span className="log-entry-index">#{index + 1}</span>
                    <span className="log-entry-text">{entry}</span>
                  </button>
                </li>
              ))}
            </ol>
            {selectedLogEntry && (
              <div className={`log-detail ${logTone(selectedLogEntry)}`}>
                <strong><Icon icon={logIcon(selectedLogEntry)} /> #{selectedLogIndex! + 1} {logCategoryLabel(selectedLogEntry)}</strong>
                <p>{selectedLogEntry}</p>
              </div>
            )}
            <LatestEventSummary log={game.log} />
          </section>

          {game.winner ? (
            <section className="notice">
              <h2><Icon icon="🏆" /> {playerLabel(game.winner)} Win</h2>
              <p>
                Seed {battleSettings.seed} / 先攻 {playerLabel(battleSettings.firstPlayer)} /
                {battleSettings.mode === "cpu-vs-cpu" ? " CPU vs CPU" : " Player vs CPU"}
              </p>
              <div className="button-stack">
                <button type="button" onClick={handleNewGame} disabled={fixedDeckError}>
                  <Icon icon="🔄" /> 同じ条件で再戦
                </button>
                <button type="button" onClick={handleRandomSeedNewGame} disabled={fixedDeckError}>
                  <Icon icon="🎲" /> Seedを変えて再戦
                </button>
                <button type="button" onClick={() => setZoneView({ kind: "deckSetup" })}>
                  <Icon icon="🧩" /> デッキ設定
                </button>
              </div>
            </section>
          ) : game.pendingLevelUp ? (
            <section className="notice">
              <h2><Icon icon="✨" /> Level Up</h2>
              <p>上げるレベル数を選択</p>
              <div className="button-row">
                {Array.from({ length: game.pendingLevelUp.maxLevels + 1 }, (_, level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => applyChange((state) => resolveLevelUp(state, level))}
                    disabled={autoPlayEnabled}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </section>
          ) : pendingDropAction ? (
            <section className="side-context-panel">
              <PendingDropActionPanel
                action={pendingDropAction}
                game={game}
                onAttackCommand={handlePendingAttackCommand}
                onConfirm={handleConfirmPendingDropAction}
                onCancel={handleCancelPendingDropAction}
              />
              {error && <p className="error">{error}</p>}
            </section>
          ) : isAdditionalChoiceSelection(selection) ? (
            <section className="side-context-panel card-info-panel">
              <AdditionalChoicePanel
                selection={selection}
                game={game}
                onCancel={() => {
                  setSelection(undefined);
                  setError("");
                }}
                onSecondaryTarget={(target) => {
                  if (selection.kind === "magicSecondaryTarget") {
                    applyChange((state) =>
                      playMagic(state, {
                        handInstanceId: selection.handInstanceId,
                        target: selection.target,
                        secondaryTarget: target,
                      }),
                    );
                    return;
                  }
                  if (selection.kind === "commandSecondaryTarget") {
                    applyChange((state) =>
                      attackWithCommand(state, {
                        attackerSlotKey: selection.attackerSlotKey,
                        commandId: selection.commandId,
                        target: selection.target,
                        secondaryTarget: target,
                      }),
                    );
                  }
                }}
                onMagicHand={(instanceId) => {
                  if (selection.kind !== "magicHandChoice") {
                    return;
                  }
                  applyChange((state) =>
                    playMagic(state, {
                      handInstanceId: selection.handInstanceId,
                      target: selection.target,
                      secondaryHandInstanceId: instanceId,
                    }),
                  );
                }}
                onCommandHand={(instanceId) => {
                  if (selection.kind !== "commandHandChoice") {
                    return;
                  }
                  applyChange((state) =>
                    attackWithCommand(state, {
                      attackerSlotKey: selection.attackerSlotKey,
                      commandId: selection.commandId,
                      target: selection.target,
                      secondaryHandInstanceId: instanceId,
                    }),
                  );
                }}
                onRefreshToggle={(instanceId) => {
                  if (selection.kind !== "magicRefresh") {
                    return;
                  }
                  setSelection({
                    ...selection,
                    selectedIds: selection.selectedIds.includes(instanceId)
                      ? selection.selectedIds.filter((id) => id !== instanceId)
                      : [...selection.selectedIds, instanceId],
                  });
                }}
                onRefreshConfirm={() => {
                  if (selection.kind !== "magicRefresh") {
                    return;
                  }
                  applyChange((state) =>
                    playMagic(state, {
                      handInstanceId: selection.handInstanceId,
                      target: selection.target,
                      selectedHandInstanceIds: selection.selectedIds,
                    }),
                  );
                }}
                onSearch={(category) => {
                  if (selection.kind !== "magicSearch") {
                    return;
                  }
                  applyChange((state) =>
                    playMagic(state, {
                      handInstanceId: selection.handInstanceId,
                      target: selection.target,
                      searchCategory: category,
                    }),
                  );
                }}
              />
              {error && <p className="error">{error}</p>}
            </section>
          ) : selectedMonster && selection?.kind === "monster" ? (
            <section className="side-context-panel card-info-panel">
              <MonsterCommands
                game={game}
                slotKey={selection.slotKey}
                onCommand={(commandId, targets) => {
                  setPendingDropAction(undefined);
                  setSelection({ kind: "command", attackerSlotKey: selection.slotKey, commandId, targets });
                }}
                onFocus={() => applyChange((state) => focusMonster(state, selection.slotKey))}
                onMove={(targets) => {
                  setPendingDropAction(undefined);
                  setSelection({ kind: "move", fromSlotKey: selection.slotKey, targets });
                }}
              />
              {error && <p className="error">{error}</p>}
            </section>
          ) : selectedHand ? (
            <section className="side-context-panel card-info-panel">
              <HandCardPanel
                card={selectedHand}
                game={game}
                disabled={controlsDisabled}
                onDiscard={() => applyChange((state) => discardHandCard(state, selectedHand.instanceId))}
              />
              {error && <p className="error">{error}</p>}
            </section>
          ) : (
            <section className="actions">
              <h2>Actions</h2>
              <TargetSelectionSummary selection={selection} game={game} />
              <div className="button-stack">
                {MASTER_ACTIONS.map((action) => {
                  const targets = getMasterActionTargets(game, action.id);
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => {
                        setPendingDropAction(undefined);
                        setSelection({ kind: "masterAction", actionId: action.id, targets });
                        setError("");
                      }}
                      disabled={controlsDisabled || targets.length === 0}
                    >
                      <Icon icon={masterActionIcon(action.id)} /> {action.label} {getMasterActionCost(action.id)}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => applyChange(useMasterHpDraw)}
                  disabled={controlsDisabled || currentPlayer.deck.length === 0}
                >
                  <Icon icon="🩸" /> HP Draw
                </button>
                <button type="button" onClick={handleEndTurn} disabled={controlsDisabled}>
                  <Icon icon="⏭️" /> End Turn
                </button>
              </div>
              {selection?.kind === "command" && (
                <p className="hint">攻撃対象を選択してください。</p>
              )}
              {selection?.kind === "move" && (
                <p className="hint">移動先または入れ替え先を選択してください。</p>
              )}
              {selection?.kind === "masterAction" && (
                <p className="hint">マスター特技の対象を選択してください。</p>
              )}
              {error && <p className="error">{error}</p>}
            </section>
          )}
        </aside>
      </section>
    </main>
  );
}

function TargetSelectionSummary({ selection, game }: { selection: Selection | undefined; game: GameState }) {
  if (selection?.kind === "command") {
    const monster = game.slots[selection.attackerSlotKey].monster;
    const command = monster ? getMonsterCommands(monster).find((candidate) => candidate.id === selection.commandId) : undefined;
    if (!command) {
      return null;
    }
    return (
      <div className="target-summary">
        <strong><Icon icon={commandIcon(command)} /> {command.name} {command.power}P</strong>
        <span>{slotMonsterLabel(game, selection.attackerSlotKey)}</span>
        <span>{commandActionSummary(command)}</span>
        <TargetChipList game={game} targets={selection.targets} />
      </div>
    );
  }

  if (selection?.kind === "move") {
    return (
      <div className="target-summary">
        <strong><Icon icon="🧭" /> Move / Swap</strong>
        <span>{slotMonsterLabel(game, selection.fromSlotKey)}</span>
        <span>自陣内の空き枠または味方と入れ替え</span>
        <TargetChipList game={game} targets={selection.targets.map((slotKey) => ({ kind: "monster", slotKey }))} />
      </div>
    );
  }

  if (selection?.kind === "masterAction") {
    return (
      <div className="target-summary">
        <strong><Icon icon={masterActionIcon(selection.actionId)} /> {masterActionLabel(selection.actionId)}</strong>
        <span>Cost {getMasterActionCost(selection.actionId)}</span>
        <TargetChipList game={game} targets={selection.targets} />
      </div>
    );
  }

  return null;
}

function TargetChipList({ game, targets }: { game: GameState; targets: Target[] }) {
  const visibleTargets = targets.slice(0, 8);
  return (
    <span className="target-chip-list">
      <span className="target-count">候補 {targets.length}</span>
      {visibleTargets.map((target) => (
        <span className="target-chip" key={targetToKey(target)}>{targetLabel(game, target)}</span>
      ))}
      {targets.length > visibleTargets.length && <span className="target-chip">+{targets.length - visibleTargets.length}</span>}
    </span>
  );
}

function LatestEventSummary({ log }: { log: string[] }) {
  const latest = log.at(-1);
  if (!latest) {
    return null;
  }
  return (
    <div className={`latest-event ${logTone(latest)}`}>
      <strong><Icon icon={logIcon(latest)} /> Latest: {logCategoryLabel(latest)}</strong>
      <p>{latest}</p>
    </div>
  );
}

interface StatusIconCountProps {
  label: string;
  icon: string;
  amount: number;
  cap?: number;
}

function StatusIconCount({ label, icon, amount, cap }: StatusIconCountProps) {
  const visibleAmount = Math.max(0, cap ? Math.min(amount, cap) : amount);
  const extraAmount = cap && amount > cap ? amount - cap : 0;

  return (
    <span className="status-icon-count" title={`${label}: ${amount}`}>
      <span className="status-icon-label">{label}</span>
      <span className="status-icons" aria-hidden="true">
        {Array.from({ length: visibleAmount }, (_, index) => (
          <span className="status-count-icon" key={`${label}_${index}`}>{icon}</span>
        ))}
        {extraAmount ? <span className="status-overflow">+{extraAmount}</span> : null}
      </span>
    </span>
  );
}

interface MasterResourceDisplayProps {
  label: string;
  active: boolean;
  hp: number;
  stones: number;
  deck: number;
  hand: number;
}

function MasterResourceDisplay({ label, active, hp, stones, deck, hand }: MasterResourceDisplayProps) {
  return (
    <div className="master-resource-display">
      <strong className="master-name">{active ? <Icon icon="▶️" /> : null}{label}</strong>
      <ResourceIconRow label="HP" icon="❤️" amount={hp} />
      <ResourceIconRow label="Stone" icon="🪨" amount={stones} cap={MAX_VISIBLE_RESOURCE_ICONS} />
      <ResourceNumberRow label="Deck" icon="🂠" amount={deck} />
      <ResourceIconRow label="Hand" icon="🃏" amount={hand} cap={MAX_VISIBLE_RESOURCE_ICONS} />
    </div>
  );
}

interface ResourceNumberRowProps {
  label: string;
  icon: string;
  amount: number;
}

function ResourceNumberRow({ label, icon, amount }: ResourceNumberRowProps) {
  return (
    <div className="resource-row resource-number-row" title={`${label}: ${amount}`}>
      <span className="resource-label">{label}</span>
      <span className="resource-number"><Icon icon={icon} />{amount}</span>
    </div>
  );
}

interface ResourceIconRowProps {
  label: string;
  icon: string;
  amount: number;
  cap?: number;
}

function ResourceIconRow({ label, icon, amount, cap }: ResourceIconRowProps) {
  const visibleAmount = Math.max(0, cap ? Math.min(amount, cap) : amount);
  const extraAmount = cap && amount > cap ? amount - cap : 0;

  return (
    <div className="resource-row" title={`${label}: ${amount}`}>
      <span className="resource-label">{label}</span>
      <span className="resource-icons" aria-hidden="true">
        {Array.from({ length: visibleAmount }, (_, index) => (
          <span className="resource-icon" key={`${label}_${index}`}>{icon}</span>
        ))}
        {extraAmount ? <span className="resource-overflow">+{extraAmount}</span> : null}
      </span>
    </div>
  );
}

interface PendingDropActionPanelProps {
  action: PendingDropAction;
  game: GameState;
  onAttackCommand: (commandId: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function PendingDropActionPanel({ action, game, onAttackCommand, onConfirm, onCancel }: PendingDropActionPanelProps) {
  const attackCommands = action.kind === "attackTarget" ? getPendingAttackCommands(game, action) : [];

  return (
    <div className="pending-action">
      <h3><Icon icon={pendingDropActionIcon(action)} /> 選択中: {pendingDropActionTitle(action)}</h3>
      <p>{pendingDropActionDescription(action, game)}</p>
      {action.kind === "attackTarget" ? (
        <div className="button-stack">
          {attackCommands.map((command) => (
            <button type="button" key={command.id} onClick={() => onAttackCommand(command.id)}>
              <Icon icon={commandIcon(command)} /> {command.name} {command.power}P
            </button>
          ))}
          <button type="button" onClick={onCancel}>
            <Icon icon="✕" /> キャンセル
          </button>
        </div>
      ) : (
        <div className="button-row">
          <button type="button" onClick={onConfirm}>
            <Icon icon="✅" /> 確定
          </button>
          <button type="button" onClick={onCancel}>
            <Icon icon="✕" /> キャンセル
          </button>
        </div>
      )}
    </div>
  );
}

type AdditionalChoiceSelection = Extract<
  Selection,
  | { kind: "commandSecondaryTarget" }
  | { kind: "commandHandChoice" }
  | { kind: "magicSecondaryTarget" }
  | { kind: "magicHandChoice" }
  | { kind: "magicRefresh" }
  | { kind: "magicSearch" }
>;

function isAdditionalChoiceSelection(selection: Selection | undefined): selection is AdditionalChoiceSelection {
  return (
    selection?.kind === "commandSecondaryTarget" ||
    selection?.kind === "commandHandChoice" ||
    selection?.kind === "magicSecondaryTarget" ||
    selection?.kind === "magicHandChoice" ||
    selection?.kind === "magicRefresh" ||
    selection?.kind === "magicSearch"
  );
}

interface AdditionalChoicePanelProps {
  selection: AdditionalChoiceSelection;
  game: GameState;
  onCancel: () => void;
  onSecondaryTarget: (target: Target) => void;
  onMagicHand: (instanceId: string) => void;
  onCommandHand: (instanceId: string) => void;
  onRefreshToggle: (instanceId: string) => void;
  onRefreshConfirm: () => void;
  onSearch: (category: NonNullable<MagicAction["searchCategory"]>) => void;
}

function AdditionalChoicePanel({
  selection,
  game,
  onCancel,
  onSecondaryTarget,
  onMagicHand,
  onCommandHand,
  onRefreshToggle,
  onRefreshConfirm,
  onSearch,
}: AdditionalChoicePanelProps) {
  if (selection.kind === "magicSecondaryTarget" || selection.kind === "commandSecondaryTarget") {
    return (
      <div className="selected-detail">
        <h3><Icon icon="🎯" /> 追加対象を選択</h3>
        <p className="hint">候補マスをクリックして確定します。</p>
        <div className="card-meta-row">
          <span>第一対象: {targetLabel(game, selection.target)}</span>
          <span>候補 {selection.targets.length}</span>
        </div>
        <div className="button-stack">
          {selection.targets.map((target) => (
            <button type="button" key={targetToKey(target)} onClick={() => onSecondaryTarget(target)}>
              <Icon icon="🎯" /> {targetLabel(game, target)}
            </button>
          ))}
          <button type="button" onClick={onCancel}><Icon icon="✕" /> キャンセル</button>
        </div>
      </div>
    );
  }

  if (selection.kind === "magicHandChoice") {
    return (
      <div className="selected-detail">
        <h3><Icon icon="🃏" /> 入れ替える手札</h3>
        <p className="hint">{targetLabel(game, selection.target)} と入れ替えるカードを選びます。</p>
        <div className="button-stack">
          {selection.choices.map((card) => (
            <button type="button" key={card.instanceId} onClick={() => onMagicHand(card.instanceId)}>
              <CardIcon cardId={card.cardId} /> {getCardName(card.cardId)}
            </button>
          ))}
          <button type="button" onClick={onCancel}><Icon icon="✕" /> キャンセル</button>
        </div>
      </div>
    );
  }

  if (selection.kind === "commandHandChoice") {
    return (
      <div className="selected-detail">
        <h3><Icon icon="🃏" /> ソウルスイッチ</h3>
        <p className="hint">入れ替える手札のモンスターを選びます。</p>
        <div className="button-stack">
          {selection.choices.map((card) => (
            <button type="button" key={card.instanceId} onClick={() => onCommandHand(card.instanceId)}>
              <CardIcon cardId={card.cardId} /> {getCardName(card.cardId)}
            </button>
          ))}
          <button type="button" onClick={onCancel}><Icon icon="✕" /> キャンセル</button>
        </div>
      </div>
    );
  }

  if (selection.kind === "magicRefresh") {
    return (
      <div className="selected-detail">
        <h3><Icon icon="🔁" /> リフレッシュ</h3>
        <p className="hint">捨てるカードを選び、同じ枚数を引きます。</p>
        <div className="button-stack">
          {selection.choices.map((card) => (
            <button
              type="button"
              key={card.instanceId}
              className={selection.selectedIds.includes(card.instanceId) ? "selected" : ""}
              onClick={() => onRefreshToggle(card.instanceId)}
            >
              <span>{selection.selectedIds.includes(card.instanceId) ? "☑" : "☐"}</span>
              <CardIcon cardId={card.cardId} /> {getCardName(card.cardId)}
            </button>
          ))}
          <button type="button" onClick={onRefreshConfirm}><Icon icon="✅" /> 確定</button>
          <button type="button" onClick={onCancel}><Icon icon="✕" /> キャンセル</button>
        </div>
      </div>
    );
  }

  return (
    <div className="selected-detail">
      <h3><Icon icon="🔎" /> カードサーチ</h3>
      <p className="hint">山札から手札に入れる種類を選びます。</p>
      <div className="button-row">
        {selection.categories.map((category) => (
          <button type="button" key={category} onClick={() => onSearch(category)}>
            {category === "front" ? "🛡️ 前衛" : category === "back" ? "🏹 後衛" : "✨ 魔法"}
          </button>
        ))}
        <button type="button" onClick={onCancel}><Icon icon="✕" /> キャンセル</button>
      </div>
    </div>
  );
}

interface HandCardPanelProps {
  card: CardInstance;
  game: GameState;
  disabled: boolean;
  onDiscard: () => void;
}

function HandCardPanel({ card, game, disabled, onDiscard }: HandCardPanelProps) {
  const def = getCardDef(card.cardId);
  const actionHint = def.type === "monster"
    ? `召喚可能 ${BOARD_SLOT_KEYS.filter((slotKey) => canSummonTo(game, card.instanceId, slotKey)).length}枠`
    : `対象 ${getMagicTargets(game, card.instanceId).length}`;

  return (
    <div className="selected-detail">
      <CardDetail cardId={card.cardId} />
      <div className="hand-action-panel">
        <span className="hint"><Icon icon={def.type === "monster" ? "🂠" : "🎯"} /> {actionHint}</span>
        <button type="button" className="danger-button" onClick={onDiscard} disabled={disabled}>
          <Icon icon="🗑️" /> 手札から捨てる
        </button>
      </div>
    </div>
  );
}

interface CardZonePanelProps {
  game: GameState;
  view: Exclude<ZoneView, { kind: "deckSetup" }>;
  onClose: () => void;
}

interface DeckSetupPanelProps {
  battleSettings: BattleSettings;
  deckSettings: DeckSettings;
  drafts: Record<PlayerId, DeckDraft>;
  onClose: () => void;
  onFixedChange: (playerId: PlayerId, fixed: boolean) => void;
  onTextChange: (playerId: PlayerId, text: string) => void;
  onUseGeneratedDeck: (playerId: PlayerId) => void;
}

function DeckSetupPanel({
  battleSettings,
  deckSettings,
  drafts,
  onClose,
  onFixedChange,
  onTextChange,
  onUseGeneratedDeck,
}: DeckSetupPanelProps) {
  return (
    <section className="zone-panel deck-setup-panel">
      <div className="zone-panel-heading">
        <div>
          <h3><Icon icon="🧩" /> Deck Setup</h3>
          <p>30枚固定、同名3枚まで、前衛12 / 後衛6 / 魔法6以上。山札順はseedで再現されます。</p>
        </div>
        <button type="button" onClick={onClose} aria-label="閉じる">
          <Icon icon="✕" /> Close
        </button>
      </div>
      <div className="deck-setup-grid">
        {PLAYER_IDS.map((playerId) => {
          const draft = drafts[playerId];
          const summary = draft.summary;
          const fixed = deckSettings.fixed[playerId];
          return (
            <section className={`deck-editor-card ${summary.valid ? "" : "invalid"}`} key={playerId}>
              <div className="deck-editor-heading">
                <div>
                  <h4>{playerLabel(playerId)} Deck</h4>
                  <p>{fixed ? "固定デッキ" : `ランダム生成 / seed ${battleSettings.seed}`}</p>
                </div>
                <label className="deck-mode-toggle">
                  <input
                    type="checkbox"
                    checked={fixed}
                    onChange={(event) => onFixedChange(playerId, event.target.checked)}
                  />
                  固定
                </label>
              </div>
              <DeckSummaryView summary={summary} />
              <div className="deck-editor-actions">
                <button type="button" onClick={() => onUseGeneratedDeck(playerId)}>
                  <Icon icon="📌" /> 現在seedの内容を固定
                </button>
                {fixed && (
                  <button type="button" onClick={() => onFixedChange(playerId, false)}>
                    <Icon icon="🎲" /> ランダムに戻す
                  </button>
                )}
              </div>
              {fixed ? (
                <textarea
                  className="deck-editor-textarea"
                  value={deckSettings.text[playerId]}
                  onChange={(event) => onTextChange(playerId, event.target.value)}
                  spellCheck={false}
                />
              ) : (
                <DeckCardList cardIds={draft.cardIds} />
              )}
              {fixed && <DeckCardList cardIds={draft.cardIds} />}
              {!summary.valid && (
                <ul className="deck-errors">
                  {summary.errors.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}

function DeckSummaryView({ summary }: { summary: DeckValidationSummary }) {
  return (
    <div className="deck-summary-row">
      <span className={summary.total === 30 ? "ok" : "ng"}><Icon icon="🃏" /> {summary.total}/30</span>
      {(["front", "back", "magic"] as const).map((category) => (
        <span
          key={category}
          className={deckCategoryValid(summary, category) ? "ok" : "ng"}
        >
          {deckCategoryIcon(category)} {deckCategoryLabel(category)} {summary.categories[category]}
        </span>
      ))}
      <span className={summary.duplicateViolations.length === 0 ? "ok" : "ng"}>
        <Icon icon="🔢" /> 3枚制限
      </span>
    </div>
  );
}

function DeckCardList({ cardIds }: { cardIds: string[] }) {
  const counts = new Map<string, number>();
  for (const cardId of cardIds) {
    counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
  }
  const rows = [...counts.entries()]
    .map(([cardId, count]) => ({ cardId, count, def: getCardDef(cardId) }))
    .sort((a, b) => {
      const categoryDiff = deckCategorySortValue(a.def) - deckCategorySortValue(b.def);
      return categoryDiff || a.def.name.localeCompare(b.def.name, "ja");
    });

  return (
    <details className="deck-card-list">
      <summary><Icon icon="📋" /> 内容 {cardIds.length}枚 / {rows.length}種類</summary>
      <div className="deck-card-grid">
        {rows.map(({ cardId, count, def }) => (
          <span className="deck-card-chip" key={cardId}>
            <CardIcon cardId={cardId} />
            {def.name} x{count}
          </span>
        ))}
      </div>
    </details>
  );
}

function CardZonePanel({ game, view, onClose }: CardZonePanelProps) {
  if (view.kind === "catalog") {
    return <CardCatalogPanel onClose={onClose} />;
  }
  if (view.kind === "effects") {
    return <EffectHistoryPanel game={game} onClose={onClose} />;
  }

  const cards = game.players[view.playerId][view.zone];
  const title = `${playerLabel(view.playerId)} ${zoneLabel(view.zone)}`;
  const helpText = zoneHelpText(view.zone);

  return (
    <section className="zone-panel">
      <div className="zone-panel-heading">
        <div>
          <h3><Icon icon={zoneIcon(view.zone)} /> {title}</h3>
          <p>{cards.length} cards / {helpText}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="閉じる">
          <Icon icon="✕" /> Close
        </button>
      </div>
      {cards.length === 0 ? (
        <p className="empty-zone"><Icon icon="□" /> Empty</p>
      ) : (
        <div className="zone-card-list">
          {cards.map((card, index) => (
            <details className="zone-card-row" key={`${card.instanceId}_${index}`}>
              <summary>
                <span className="zone-card-index">{index + 1}</span>
                <CardIcon cardId={card.cardId} />
                <span className="zone-card-name">{getCardName(card.cardId)}</span>
                <span className="zone-card-type">{cardTypeLabel(card.cardId)}</span>
              </summary>
              <div className="catalog-card-detail">
                <CardDetail cardId={card.cardId} showTitle={false} />
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}

function EffectHistoryPanel({ game, onClose }: { game: GameState; onClose: () => void }) {
  const effectEntries = game.log
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => logCategoryLabel(entry) !== "通常");

  return (
    <section className="zone-panel">
      <div className="zone-panel-heading">
        <div>
          <h3><Icon icon="📜" /> Effect History</h3>
          <p>{effectEntries.length} entries / ダメージ、支援、ランダム、CPU判断を抽出</p>
        </div>
        <button type="button" onClick={onClose} aria-label="閉じる">
          <Icon icon="✕" /> Close
        </button>
      </div>
      {effectEntries.length === 0 ? (
        <p className="empty-zone"><Icon icon="□" /> Empty</p>
      ) : (
        <ol className="effect-history-list">
          {effectEntries.map(({ entry, index }) => (
            <li className={`effect-history-row ${logTone(entry)}`} key={`${entry}_${index}`}>
              <span className="zone-card-index">{index + 1}</span>
              <span className="effect-history-kind"><Icon icon={logIcon(entry)} /> {logCategoryLabel(entry)}</span>
              <span className="effect-history-text">{entry}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function CardCatalogPanel({ onClose }: { onClose: () => void }) {
  const cards = getAllCardDefs();

  return (
    <section className="zone-panel">
      <div className="zone-panel-heading">
        <div>
          <h3><Icon icon="📚" /> Card List</h3>
          <p>{cards.length} cards / 通常カードのみ</p>
        </div>
        <button type="button" onClick={onClose} aria-label="閉じる">
          <Icon icon="✕" /> Close
        </button>
      </div>
      <div className="catalog-card-list">
        {cards.map((card) => (
          <details className="catalog-card-row" key={card.id}>
            <summary>
              <CardIcon cardId={card.id} />
              <span className="catalog-card-name">{card.name}</span>
              <span className="zone-card-type">{cardTypeLabel(card.id)}</span>
            </summary>
            <div className="catalog-card-detail">
              <CardDetail cardId={card.id} showTitle={false} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

interface BoardSlotProps {
  slotKey: SlotKey;
  game: GameState;
  selected: boolean;
  targetable: boolean;
  targetRole?: TargetRole;
  effectKind?: EffectKind;
  effectId?: number;
  damageFlash?: DamageFlash;
  draggable: boolean;
  onDragStart: (event: DragEvent<HTMLButtonElement>) => void;
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onDragOver: (event: DragEvent<HTMLButtonElement>) => void;
  onDrop: (event: DragEvent<HTMLButtonElement>) => void;
  onClick: () => void;
}

function BoardSlot({
  slotKey,
  game,
  selected,
  targetable,
  targetRole,
  effectKind,
  effectId,
  damageFlash,
  draggable,
  onDragStart,
  onPointerDown,
  onDragOver,
  onDrop,
  onClick,
}: BoardSlotProps) {
  const slot = game.slots[slotKey];
  const monster = slot.monster;
  const hidePreparedInfo = monster?.status === "prepared" && monster.owner !== "player";
  const label = slotLabel(slotKey);

  return (
    <button
      type="button"
      className={[
        "board-slot",
        slot.owner,
        selected ? "selected" : "",
        targetable ? "targetable" : "",
        targetRole ? `target-${targetRole}` : "",
        monster?.status === "prepared" ? "prepared" : "",
        effectKind ? `effect-active effect-${effectKind}` : "",
        damageFlash?.defeated ? "effect-defeated" : "",
      ].join(" ")}
      data-slot-key={slotKey}
      draggable={draggable}
      onDragStart={onDragStart}
      onPointerDown={onPointerDown}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
    >
      <span className="slot-label">{label}</span>
      {targetRole && <span className="target-badge">{targetRoleLabel(targetRole)}</span>}
      {monster && hidePreparedInfo ? (
        <span className="monster-card hidden-prepared">
          <strong><Icon icon="🂠" /> 準備中カード</strong>
          <span><Icon icon="🔒" /> 情報非公開</span>
        </span>
      ) : monster ? (
        <span className="monster-card">
          <strong><CardIcon cardId={monster.cardId} /> {getCardName(monster.cardId)}</strong>
          <span><Icon icon="✨" /> Lv{monster.level} / <Icon icon="❤️" /> HP {monster.hp}</span>
          <span>
            <Icon icon={monster.status === "prepared" ? "🕒" : "⚡"} />
            {monster.status === "prepared" ? "準備中" : `${monster.actionCount}/${monster.actionLimit}行動`}
          </span>
          <MonsterTraitSummary cardId={monster.cardId} />
          <span>
            {[
              monster.focused ? "💪 気合い 上技+1/被ダメ-1" : "",
              monster.powerUp ? "⬆️ P+1" : "",
              monster.shielded ? "🛡️ 盾" : "",
            ].filter(Boolean).join(" ")}
          </span>
        </span>
      ) : (
        <span className="empty-slot"><Icon icon="□" /> Empty</span>
      )}
      <DamageBubble key={effectId} flash={damageFlash} />
    </button>
  );
}

function DamageBubble({ flash }: { flash?: DamageFlash }) {
  if (!flash) {
    return null;
  }

  return (
    <span className={`damage-bubble ${flash.defeated ? "damage-bubble-ko" : ""}`} aria-hidden="true">
      <span className="damage-value">-{flash.amount}</span>
      {flash.defeated && <strong className="damage-ko-label">KO</strong>}
    </span>
  );
}

interface MonsterCommandsProps {
  game: GameState;
  slotKey: SlotKey;
  onCommand: (commandId: string, targets: Target[]) => void;
  onFocus: () => void;
  onMove: (targets: SlotKey[]) => void;
}

function MonsterCommands({ game, slotKey, onCommand, onFocus, onMove }: MonsterCommandsProps) {
  const slot = game.slots[slotKey];
  const monster = game.slots[slotKey].monster;
  if (!monster) {
    return null;
  }
  const hidePreparedInfo = monster.status === "prepared" && monster.owner !== "player";
  const moveTargets = getMovableTargets(game, slotKey);
  const moveDisabledReason = getMoveDisabledReason(game, slotKey, moveTargets);
  const focusDisabledReason = getFocusDisabledReason(game, slotKey);

  return (
    <div className="selected-detail">
      <h3>
        {hidePreparedInfo ? <Icon icon="🂠" /> : <CardIcon cardId={monster.cardId} />}
        {hidePreparedInfo ? "準備中カード" : `${getCardName(monster.cardId)} Lv${monster.level}`}
      </h3>
      <div className="card-meta-row">
        <span>{playerLabel(slot.owner)}</span>
        <span>{slotLabel(slotKey)}</span>
        <span><Icon icon={monster.status === "prepared" ? "🕒" : "⚡"} /> {monster.status === "prepared" ? "準備中" : `${monster.actionCount}/${monster.actionLimit}行動`}</span>
        {!hidePreparedInfo && <span><Icon icon="❤️" /> HP {monster.hp}</span>}
        {!hidePreparedInfo && <span><Icon icon="🪨" /> 投資 {monster.investedStones}</span>}
      </div>
      {hidePreparedInfo ? (
        <p className="hint"><Icon icon="🔒" /> CPUの準備中カードの情報は非公開です。</p>
      ) : (
        <div className="board-card-detail">
          <CardDetail cardId={monster.cardId} showTitle={false} />
        </div>
      )}
      {!hidePreparedInfo && (
        <div className="button-stack">
          {getMonsterCommands(monster).map((command) => {
            const targets = getCommandTargets(game, slotKey, command.id);
            const disabledReason = getCommandDisabledReason(game, slotKey, command, targets);
            return (
              <button
                className="command-button"
                key={command.id}
                type="button"
                onClick={() => onCommand(command.id, targets)}
                disabled={!!disabledReason}
                title={disabledReason ?? `${targets.length}対象`}
              >
                <span className="command-button-main">
                  <Icon icon={commandIcon(command)} />
                  <strong>{command.name} {command.power}P</strong>
                </span>
                <span className="command-button-meta">{commandActionSummary(command)}</span>
                <span className={disabledReason ? "command-button-reason" : "command-button-ready"}>
                  {disabledReason ?? `対象 ${targets.length}`}
                </span>
              </button>
            );
          })}
          <button
            className="command-button"
            type="button"
            onClick={() => onMove(moveTargets)}
            disabled={!!moveDisabledReason}
            title={moveDisabledReason ?? `${moveTargets.length}マス`}
          >
            <span className="command-button-main"><Icon icon="🧭" /><strong>Move / Swap</strong></span>
            <span className="command-button-meta">自陣内 / 空きマスまたは味方と入れ替え</span>
            <span className={moveDisabledReason ? "command-button-reason" : "command-button-ready"}>
              {moveDisabledReason ?? `候補 ${moveTargets.length}`}
            </span>
          </button>
          <button
            className="command-button"
            type="button"
            onClick={onFocus}
            disabled={!!focusDisabledReason}
            title={focusDisabledReason ?? "次の上の技+1P / 被ダメージ-1"}
          >
            <span className="command-button-main"><Icon icon="💪" /><strong>ためる</strong></span>
            <span className="command-button-meta">上の技+1P / 被ダメージ-1 / 行動後に解除</span>
            <span className={focusDisabledReason ? "command-button-reason" : "command-button-ready"}>
              {focusDisabledReason ?? "使用可"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function getCommandDisabledReason(game: GameState, slotKey: SlotKey, command: CommandDef, targets: Target[]): string | undefined {
  const actionReason = getMonsterActionDisabledReason(game, slotKey);
  if (actionReason) {
    return actionReason;
  }

  const player = game.players[game.currentPlayer];
  const cost = command.stoneCost ?? 0;
  if (cost > player.stones) {
    return `Stone不足: 必要${cost} / 所持${player.stones}`;
  }
  if (targets.length === 0) {
    return "射程内に対象なし";
  }
  return undefined;
}

function getMoveDisabledReason(game: GameState, slotKey: SlotKey, targets: SlotKey[]): string | undefined {
  const actionReason = getMonsterActionDisabledReason(game, slotKey);
  if (actionReason) {
    return actionReason;
  }
  if (targets.length === 0) {
    return "移動・入れ替え先なし";
  }
  return undefined;
}

function getFocusDisabledReason(game: GameState, slotKey: SlotKey): string | undefined {
  const actionReason = getMonsterActionDisabledReason(game, slotKey);
  if (actionReason) {
    return actionReason;
  }
  const monster = game.slots[slotKey].monster;
  if (monster?.focused) {
    return "すでに気合い中";
  }
  if (!canFocusMonster(game, slotKey)) {
    return "ためられない状態";
  }
  return undefined;
}

function getMonsterActionDisabledReason(game: GameState, slotKey: SlotKey): string | undefined {
  if (game.winner) {
    return "勝敗決定済み";
  }
  if (game.pendingLevelUp) {
    return "レベルアップ選択中";
  }
  if (game.currentPlayer !== "player") {
    return "CPUターン中";
  }

  const monster = game.slots[slotKey].monster;
  if (!monster) {
    return "カードがありません";
  }
  if (monster.owner !== game.currentPlayer) {
    return "相手のカードです";
  }
  if (monster.status !== "active") {
    return "準備中のため行動不可";
  }
  if (monster.actionCount >= monster.actionLimit) {
    return "このターンは行動済み";
  }
  return undefined;
}

function pendingDropActionTargetKey(action: PendingDropAction): string {
  if (action.kind === "move") {
    return `monster:${action.toSlotKey}`;
  }
  return targetToKey(action.target);
}

function selectionFromPendingDropAction(action: PendingDropAction): Selection {
  if (action.kind === "magic") {
    return { kind: "hand", instanceId: action.handInstanceId };
  }
  if (action.kind === "move") {
    return { kind: "monster", slotKey: action.fromSlotKey };
  }
  return { kind: "monster", slotKey: action.attackerSlotKey };
}

function isSelectedSourceSlot(selection: Selection | undefined, action: PendingDropAction | undefined, slotKey: SlotKey): boolean {
  if (action?.kind === "move") {
    return action.fromSlotKey === slotKey;
  }
  if (action?.kind === "attackTarget") {
    return action.attackerSlotKey === slotKey;
  }
  if (selection?.kind === "commandSecondaryTarget" || selection?.kind === "commandHandChoice") {
    return selection.attackerSlotKey === slotKey;
  }
  if (
    (selection?.kind === "magicSecondaryTarget" ||
      selection?.kind === "magicHandChoice" ||
      selection?.kind === "magicRefresh" ||
      selection?.kind === "magicSearch") &&
    selection.target.kind === "monster"
  ) {
    return selection.target.slotKey === slotKey;
  }
  return selection?.kind === "monster" && selection.slotKey === slotKey;
}

function isSelectedSourceHand(selection: Selection | undefined, action: PendingDropAction | undefined, instanceId: string): boolean {
  if (action?.kind === "magic" && action.handInstanceId === instanceId) {
    return true;
  }
  if (
    (selection?.kind === "magicSecondaryTarget" ||
      selection?.kind === "magicHandChoice" ||
      selection?.kind === "magicRefresh" ||
      selection?.kind === "magicSearch") &&
    selection.handInstanceId === instanceId
  ) {
    return true;
  }
  return selection?.kind === "hand" && selection.instanceId === instanceId;
}

function pendingDropActionIcon(action: PendingDropAction): string {
  if (action.kind === "magic") {
    return "✨";
  }
  if (action.kind === "move") {
    return "🧭";
  }
  return "⚔️";
}

function pendingDropActionTitle(action: PendingDropAction): string {
  if (action.kind === "magic") {
    return "マジック";
  }
  if (action.kind === "move") {
    return "Move / Swap";
  }
  return "技を選択";
}

function pendingDropActionDescription(action: PendingDropAction, game: GameState): string {
  if (action.kind === "magic") {
    return `${handCardLabel(game, action.handInstanceId)} -> ${targetLabel(game, action.target)}`;
  }
  if (action.kind === "move") {
    return `${slotMonsterLabel(game, action.fromSlotKey)} -> ${targetLabel(game, { kind: "monster", slotKey: action.toSlotKey })}`;
  }
  return `${slotMonsterLabel(game, action.attackerSlotKey)} -> ${targetLabel(game, action.target)}`;
}

function getPendingAttackCommands(game: GameState, action: Extract<PendingDropAction, { kind: "attackTarget" }>): CommandDef[] {
  return getCommandsTargetingTarget(game, action.attackerSlotKey, action.target)
    .filter((command) => action.commandIds.includes(command.id));
}

function getCommandsTargetingTarget(game: GameState, attackerSlotKey: SlotKey, target: Target): CommandDef[] {
  const monster = game.slots[attackerSlotKey].monster;
  if (!monster) {
    return [];
  }
  return getMonsterCommands(monster)
    .filter((command) =>
      getCommandTargets(game, attackerSlotKey, command.id)
        .some((candidateTarget) => targetToKey(candidateTarget) === targetToKey(target)),
    );
}

function handCardLabel(game: GameState, instanceId: string): string {
  const card = getHandCard(game, instanceId);
  return card ? getCardName(card.cardId) : "カード";
}

function slotMonsterLabel(game: GameState, slotKey: SlotKey): string {
  const monster = game.slots[slotKey].monster;
  return monster ? `${slotLabel(slotKey)} ${getCardName(monster.cardId)}` : slotLabel(slotKey);
}

function targetLabel(game: GameState, target: Target): string {
  if (target.kind === "master") {
    return `${playerLabel(target.playerId)}マスター`;
  }
  return slotMonsterLabel(game, target.slotKey);
}

function targetRoleForTarget(
  game: GameState,
  target: Target,
  targetKeys: Set<string>,
  selection: Selection | undefined,
  action: PendingDropAction | undefined,
): TargetRole | undefined {
  if (!targetKeys.has(targetToKey(target))) {
    return undefined;
  }
  if (selection?.kind === "move" || action?.kind === "move") {
    return "move";
  }
  if (selection?.kind === "hand") {
    const handCard = getHandCard(game, selection.instanceId);
    if (handCard && getCardDef(handCard.cardId).type === "monster") {
      return "summon";
    }
  }
  if (target.kind === "master") {
    return "master";
  }
  const slot = game.slots[target.slotKey];
  if (!slot.monster) {
    return "empty";
  }
  return slot.monster.owner === game.currentPlayer ? "ally" : "enemy";
}

function targetRoleLabel(role: TargetRole): string {
  if (role === "ally") {
    return "味方対象";
  }
  if (role === "enemy") {
    return "敵対象";
  }
  if (role === "move") {
    return "移動先";
  }
  if (role === "summon") {
    return "召喚先";
  }
  if (role === "master") {
    return "マスター";
  }
  return "空き枠";
}

function isZoneView(view: ZoneView | undefined, playerId: PlayerId, zone: Extract<ZoneView, { kind: "playerZone" }>["zone"]): boolean {
  return view?.kind === "playerZone" && view.playerId === playerId && view.zone === zone;
}

function toggleZoneView(current: ZoneView | undefined, next: ZoneView): ZoneView | undefined {
  if (next.kind === "catalog") {
    return current?.kind === "catalog" ? undefined : next;
  }
  if (next.kind === "effects") {
    return current?.kind === "effects" ? undefined : next;
  }
  if (next.kind === "deckSetup") {
    return current?.kind === "deckSetup" ? undefined : next;
  }
  return isZoneView(current, next.playerId, next.zone) ? undefined : next;
}

function zoneLabel(zone: Extract<ZoneView, { kind: "playerZone" }>["zone"]): string {
  if (zone === "deck") {
    return "Deck";
  }
  if (zone === "hand") {
    return "Hand";
  }
  return "Discard";
}

function zoneIcon(zone: Extract<ZoneView, { kind: "playerZone" }>["zone"]): string {
  if (zone === "deck") {
    return "🂠";
  }
  if (zone === "hand") {
    return "🃏";
  }
  return "🗂️";
}

function zoneHelpText(zone: Extract<ZoneView, { kind: "playerZone" }>["zone"]): string {
  if (zone === "deck") {
    return "上から順に引きます。";
  }
  if (zone === "hand") {
    return "現在選べるカードです。";
  }
  return "捨てられた順に並びます。";
}

function cardTypeLabel(cardId: string): string {
  const def = getCardDef(cardId);
  if (def.type === "magic") {
    return "魔法";
  }
  return def.role === "front" ? "前衛" : "後衛";
}

function deckCategoryValid(summary: DeckValidationSummary, category: "front" | "back" | "magic"): boolean {
  if (category === "front") {
    return summary.categories.front >= 12;
  }
  if (category === "back") {
    return summary.categories.back >= 6;
  }
  return summary.categories.magic >= 6;
}

function deckCategoryIcon(category: "front" | "back" | "magic"): string {
  if (category === "front") {
    return "🛡️";
  }
  if (category === "back") {
    return "🏹";
  }
  return "✨";
}

function deckCategorySortValue(def: ReturnType<typeof getCardDef>): number {
  if (def.type === "magic") {
    return 3;
  }
  return def.role === "front" ? 1 : 2;
}

function createVisualEffect(previous: GameState, next: GameState, id: number): VisualEffect {
  const appendedLogs = getAppendedLogs(previous.log, next.log);
  const latestLog = appendedLogs.at(-1) ?? next.log[next.log.length - 1] ?? "";
  const kind = effectKindFromLogs(appendedLogs, latestLog);
  return {
    id,
    kind,
    slots: BOARD_SLOT_KEYS.filter((slotKey) => slotSignature(previous, slotKey) !== slotSignature(next, slotKey)),
    masters: PLAYER_IDS.filter(
      (playerId) =>
        previous.players[playerId].masterHp !== next.players[playerId].masterHp ||
        (kind === "random" && previous.players[playerId].stones !== next.players[playerId].stones),
    ),
    slotDamageFlashes: createSlotDamageFlashes(previous, next, appendedLogs),
    masterDamageFlashes: createMasterDamageFlashes(previous, next),
  };
}

function getAppendedLogs(previousLog: string[], nextLog: string[]): string[] {
  const maxOverlap = Math.min(previousLog.length, nextLog.length);
  for (let overlap = maxOverlap; overlap > 0; overlap -= 1) {
    const previousStart = previousLog.length - overlap;
    const matches = previousLog
      .slice(previousStart)
      .every((entry, index) => entry === nextLog[index]);
    if (matches) {
      return nextLog.slice(overlap);
    }
  }
  return nextLog.length > 0 ? [nextLog[nextLog.length - 1]] : [];
}

function createSlotDamageFlashes(
  previous: GameState,
  next: GameState,
  appendedLogs: string[],
): SlotDamageFlash[] {
  return BOARD_SLOT_KEYS.flatMap((slotKey) => {
    const previousMonster = previous.slots[slotKey].monster;
    if (!previousMonster) {
      return [];
    }

    const nextMonster = next.slots[slotKey].monster;
    if (nextMonster?.instanceId === previousMonster.instanceId) {
      const amount = previousMonster.hp - nextMonster.hp;
      const flash: SlotDamageFlash = { slotKey, amount, defeated: false };
      return amount > 0 ? [flash] : [];
    }

    if (wasDefeated(previousMonster.cardId, appendedLogs)) {
      const flash: SlotDamageFlash = { slotKey, amount: Math.max(1, previousMonster.hp), defeated: true };
      return [flash];
    }

    return [];
  });
}

function createMasterDamageFlashes(previous: GameState, next: GameState): MasterDamageFlash[] {
  return PLAYER_IDS.flatMap((playerId) => {
    const amount = previous.players[playerId].masterHp - next.players[playerId].masterHp;
    const flash: MasterDamageFlash = { playerId, amount, defeated: next.players[playerId].masterHp <= 0 };
    return amount > 0 ? [flash] : [];
  });
}

function wasDefeated(cardId: string, appendedLogs: string[]): boolean {
  const cardName = getCardName(cardId);
  return appendedLogs.some((entry) => entry.includes(cardName) && entry.includes("は倒れ"));
}

function slotSignature(game: GameState, slotKey: SlotKey): string {
  const monster = game.slots[slotKey].monster;
  if (!monster) {
    return "empty";
  }
  return [
    monster.instanceId,
    monster.cardId,
    monster.owner,
    monster.hp,
    monster.level,
    monster.status,
    monster.investedStones,
    monster.actionCount,
    monster.actionLimit,
    monster.focused,
    monster.powerUp,
    monster.shielded,
    monster.powerModifier,
    monster.powerOverride,
    monster.cannotMove,
    monster.levelFixed,
    monster.immune,
    monster.halfShielded,
    monster.oneShotShield,
    monster.reviveOnDefeat,
    monster.shadowCursed,
    monster.scapegoat,
    monster.canAttackAnywhere,
    monster.stoneCostMultiplier,
    monster.commandSealed,
    monster.cannotActUntilDamaged,
    monster.berserkPower,
    monster.dodgeChance,
    monster.dragonShield,
    monster.provokeTargetSlotKey,
    monster.deathChainSlotKey,
    monster.stoneCurse,
    monster.damageCurse,
  ].join(":");
}

function effectKindFromLogs(appendedLogs: string[], fallback: string): EffectKind {
  return appendedLogs.some(isRandomResultLog) ? "random" : effectKindFromLog(fallback);
}

function effectKindFromLog(entry: string): EffectKind {
  if (isRandomResultLog(entry)) {
    return "random";
  }
  if (entry.includes("ダメージ") || entry.includes("倒れ") || entry.includes("攻撃") || entry.includes("アタック")) {
    return "attack";
  }
  if (entry.includes("HPが") || entry.includes("山札切れ")) {
    return "damage";
  }
  if (entry.includes("召喚") || entry.includes("登場")) {
    return "summon";
  }
  if (entry.includes("ため") || entry.includes("気合い")) {
    return "focus";
  }
  if (entry.includes("移動") || entry.includes("入れ替え")) {
    return "move";
  }
  if (entry.includes("回復") || entry.includes("シールド") || entry.includes("ウェイクアップ")) {
    return "heal";
  }
  if (entry.includes("ターン") || entry.includes("引いた") || entry.includes("ストーン")) {
    return "turn";
  }
  return "default";
}

function isRandomResultLog(entry: string): boolean {
  return entry.includes("ランダム結果");
}

function logTone(entry: string): string {
  if (entry.includes("勝利") || entry.includes("敗北")) {
    return "log-win";
  }
  if (isRandomResultLog(entry)) {
    return "log-random";
  }
  if (entry.includes("ダメージ") || entry.includes("倒れ") || entry.includes("HPが") || entry.includes("山札切れ")) {
    return "log-damage";
  }
  if (entry.includes("レベル") || entry.includes("Lv")) {
    return "log-level";
  }
  if (entry.includes("召喚") || entry.includes("登場")) {
    return "log-summon";
  }
  if (entry.includes("ため") || entry.includes("気合い")) {
    return "log-focus";
  }
  if (entry.includes("シールド") || entry.includes("ウェイクアップ") || entry.includes("回復")) {
    return "log-support";
  }
  if (entry.includes("ターン") || entry.includes("引いた") || entry.includes("ストーン")) {
    return "log-turn";
  }
  return "log-normal";
}

function logMatchesFilter(entry: string, filter: LogFilter): boolean {
  if (filter === "all") {
    return true;
  }
  if (filter === "cpu") {
    return entry.includes("判断:");
  }
  if (filter === "battle") {
    return entry.includes("攻撃") || entry.includes("アタック") || entry.includes("倒れ") || entry.includes("撃破");
  }
  if (filter === "damage") {
    return entry.includes("ダメージ") || entry.includes("HPが") || entry.includes("山札切れ");
  }
  if (filter === "support") {
    return (
      entry.includes("使った") ||
      entry.includes("シールド") ||
      entry.includes("ウェイクアップ") ||
      entry.includes("回復") ||
      entry.includes("コピー") ||
      entry.includes("入れ替え") ||
      entry.includes("ローテーション") ||
      entry.includes("リフレッシュ") ||
      isRandomResultLog(entry)
    );
  }
  return entry.includes("ターン") || entry.includes("引いた") || entry.includes("ストーン") || entry.includes("召喚");
}

function logFilterLabel(filter: LogFilter): string {
  if (filter === "all") {
    return "All";
  }
  if (filter === "battle") {
    return "Battle";
  }
  if (filter === "damage") {
    return "Damage";
  }
  if (filter === "support") {
    return "Support";
  }
  if (filter === "turn") {
    return "Turn";
  }
  return "CPU";
}

function logFilterIcon(filter: LogFilter): string {
  if (filter === "battle") {
    return "⚔️";
  }
  if (filter === "damage") {
    return "💥";
  }
  if (filter === "support") {
    return "🛡️";
  }
  if (filter === "turn") {
    return "⏭️";
  }
  if (filter === "cpu") {
    return "🧠";
  }
  return "•";
}

function logCategoryLabel(entry: string): string {
  if (entry.includes("判断:")) {
    return "CPU判断";
  }
  if (logMatchesFilter(entry, "damage")) {
    return "ダメージ/HP";
  }
  if (logMatchesFilter(entry, "battle")) {
    return "戦闘";
  }
  if (logMatchesFilter(entry, "support")) {
    return "支援/特殊効果";
  }
  if (logMatchesFilter(entry, "turn")) {
    return "ターン進行";
  }
  return "その他";
}

interface HandCardContentProps {
  cardId: string;
}

function HandCardContent({ cardId }: HandCardContentProps) {
  const def = getCardDef(cardId);

  if (def.type === "magic") {
    return (
      <>
        <span className="hand-card-title">
          <strong><CardIcon cardId={def.id} /> {def.name}</strong>
          <span className="card-chip magic">魔法</span>
        </span>
        <span className="hand-card-meta"><Icon icon="🪨" /> Cost {def.cost} / {targetKindsLabel(def.targetKinds)}</span>
        <span className="hand-card-text">{def.description}</span>
        <CardNotes card={def} compact />
      </>
    );
  }

  const firstLevel = def.levels[0];
  const maxHpText = def.levels.map((level) => `Lv${level.level} HP${level.maxHp}`).join(" / ");
  const commandText = firstLevel.commands.map(commandSummary).join(" / ");
  return (
    <>
      <span className="hand-card-title">
        <strong><CardIcon cardId={def.id} /> {def.name}</strong>
        <span className="card-chip"><Icon icon={roleIcon(def.role)} /> {def.role === "front" ? "前衛" : "後衛"}</span>
      </span>
      <span className="hand-card-meta"><Icon icon="🪨" /> 召喚 1 / <Icon icon="✨" /> MaxLv {def.maxLevel}</span>
      <span className="hand-card-meta"><Icon icon="❤️" /> {maxHpText}</span>
      <span className="hand-card-text">{commandText}</span>
      <CardNotes card={def} compact />
    </>
  );
}

interface CardDetailProps {
  cardId: string;
  showTitle?: boolean;
}

function CardDetail({ cardId, showTitle = true }: CardDetailProps) {
  const def = getCardDef(cardId);
  if (def.type === "magic") {
    return (
      <>
        {showTitle && <h3><CardIcon cardId={def.id} /> {def.name}</h3>}
        <div className="card-meta-row">
          <span className="card-chip magic">✨ 魔法</span>
          <span><Icon icon="🪨" /> Cost {def.cost}</span>
          <span>{targetKindsLabel(def.targetKinds)}</span>
        </div>
        <EffectBreakdown
          items={[
            { label: "条件", text: `手札から使用 / Stone ${def.cost}` },
            { label: "対象", text: targetKindsLabel(def.targetKinds) },
            { label: "持続", text: magicDurationText(def) },
          ]}
        />
        <p>{def.description}</p>
        <CardNotes card={def} />
      </>
    );
  }

  return (
    <>
      {showTitle && <h3><CardIcon cardId={def.id} /> {def.name}</h3>}
      <div className="card-meta-row">
        <span className="card-chip"><Icon icon={roleIcon(def.role)} /> {def.role === "front" ? "前衛" : "後衛"}</span>
        <span><Icon icon="🪨" /> 召喚 1</span>
        <span><Icon icon="✨" /> MaxLv {def.maxLevel}</span>
        {def.actionLimit && <span><Icon icon="⚡" /> {def.actionLimit}回行動</span>}
      </div>
      <CardNotes card={def} />
      <div className="level-detail-list">
        {def.levels.map((level) => (
          <div className="level-detail" key={level.level}>
            <strong><Icon icon="✨" /> Lv{level.level} / <Icon icon="❤️" /> HP {level.maxHp}</strong>
            <ul>
              {level.commands.map((command) => (
                <li key={command.id}>
                  <span>{commandSummary(command)}</span>
                  <EffectBreakdown
                    compact
                    items={[
                      { label: "条件", text: commandConditionText(command) },
                      { label: "対象", text: rangeLabel(command.range, command.rangeText) },
                      { label: "持続", text: commandDurationText(command) },
                    ]}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

function EffectBreakdown({
  items,
  compact = false,
}: {
  items: Array<{ label: string; text: string }>;
  compact?: boolean;
}) {
  return (
    <span className={`effect-breakdown ${compact ? "compact" : ""}`}>
      {items.map((item) => (
        <span className="effect-breakdown-chip" key={`${item.label}_${item.text}`}>
          <span>{item.label}</span>
          <strong>{item.text}</strong>
        </span>
      ))}
    </span>
  );
}

function CardNotes({ card, compact = false }: { card: ReturnType<typeof getCardDef>; compact?: boolean }) {
  const visibleNotes = getCardNoteDisplays(card);
  if (visibleNotes.length === 0) {
    return null;
  }

  return (
    <span className={`card-notes ${compact ? "compact" : ""}`}>
      {visibleNotes.map((note) => (
        <span className={`card-note card-note-${note.kind}`} key={`${note.kind}_${note.text}`}>
          <span className="card-note-label">{note.label}</span>
          <span className="card-note-text">{note.text}</span>
        </span>
      ))}
    </span>
  );
}

function MonsterTraitSummary({ cardId }: { cardId: string }) {
  const def = getCardDef(cardId);
  if (def.type !== "monster") {
    return null;
  }

  const traitNotes = getCardNoteDisplays(def)
    .filter((note) => note.kind === "personality")
    .map((note) => note.summary);
  if (traitNotes.length === 0) {
    return null;
  }

  return (
    <span className="monster-trait-line" title={traitNotes.join("\n")}>
      <Icon icon="🧬" /> {traitNotes.join(" / ")}
    </span>
  );
}

function commandSummary(command: CommandDef): string {
  return [
    `${commandIcon(command)} ${command.name} ${command.power}P`,
    rangeLabel(command.range, command.rangeText),
    command.stoneCost ? `Stone ${command.stoneCost}` : "",
    command.effectText ? `効果 ${command.effectText}` : "",
    command.recoilDamage ? `反動 ${command.recoilDamage}` : "",
  ].filter(Boolean).join(" / ");
}

function commandActionSummary(command: CommandDef): string {
  return [
    rangeLabel(command.range, command.rangeText),
    command.stoneCost ? `Stone ${command.stoneCost}` : "Stone 0",
    command.effectText ? command.effectText : "",
    command.recoilDamage ? `反動 ${command.recoilDamage}` : "",
  ].filter(Boolean).join(" / ");
}

function rangeLabel(range: string, rawRange?: string): string {
  if (range === "adjacent") {
    return "↔️ 隣接";
  }
  if (range === "one_skip") {
    return "🎯 射程2";
  }
  if (range === "any_monster") {
    return "◎ 任意モンスター";
  }
  if (range === "any_target") {
    return "✦ 任意対象";
  }
  if (range === "two_skip") {
    if (rawRange?.includes("１つ")) {
      return "🎯 射程2/3";
    }
    if (rawRange?.includes("桂馬")) {
      return "🎯 射程3/桂馬";
    }
    return "🎯 射程3";
  }
  if (range === "straight") {
    return `↕️ ${rawRange ?? "まっすぐ"}`;
  }
  if (range === "piercing") {
    return `⇈ ${rawRange ?? "貫通"}`;
  }
  if (range === "decreasing_straight") {
    return `↘️ ${rawRange ?? "減るまっすぐ"}`;
  }
  if (range === "line") {
    return `↔️ ${rawRange ?? "一直線"}`;
  }
  if (range === "special") {
    return rawRange ? `✨ ${rawRange}` : "✨ 特殊";
  }
  return "👑 マスター";
}

function targetKindsLabel(targetKinds: MagicTargetKind[]): string {
  if (targetKinds.length === 0) {
    return "カード効果";
  }
  return targetKinds
    .map((kind) => {
      if (kind === "ally_monster") {
        return "味方モンスター";
      }
      if (kind === "enemy_monster") {
        return "敵モンスター";
      }
      return "敵マスター";
    })
    .join(" / ");
}

function magicDurationText(def: MagicCardDef): string {
  if (def.continuance) {
    return def.continuance;
  }
  if (def.description.includes("次のターン") || def.description.includes("次ターン")) {
    return "次ターンまで";
  }
  if (def.description.includes("ずっと") || def.description.includes("永続")) {
    return "継続";
  }
  return "即時";
}

function commandConditionText(command: CommandDef): string {
  const conditions = [];
  if (command.stoneCost) {
    conditions.push(`Stone ${command.stoneCost}`);
  }
  if (command.recoilDamage) {
    conditions.push(`反動 ${command.recoilDamage}`);
  }
  if (command.implemented === false) {
    conditions.push("要確認");
  }
  return conditions.length > 0 ? conditions.join(" / ") : "行動可能時";
}

function commandDurationText(command: CommandDef): string {
  if (command.effectText?.includes("次")) {
    return "次回/次ターン";
  }
  if (command.effectText?.includes("ずっと") || command.effectText?.includes("継続")) {
    return "継続";
  }
  return command.effectText ? "効果依存" : "即時";
}

function slotLabel(slotKey: SlotKey): string {
  const [owner, row, lane] = slotKey.split("_");
  const ownerLabel = owner === "player" ? "P" : "C";
  const rowLabel = row === "front" ? "前" : "後";
  const laneLabel = lane === "left" ? "L" : "R";
  return `${ownerLabel}${rowLabel}${laneLabel}`;
}

interface IconProps {
  icon: string;
}

function Icon({ icon }: IconProps) {
  return <span className="ui-icon" aria-hidden="true">{icon}</span>;
}

interface CardIconProps {
  cardId: string;
}

function CardIcon({ cardId }: CardIconProps) {
  const iconPath = getCardIconPath(cardId);
  if (iconPath) {
    return <img className="card-image-icon" src={iconPath} alt="" aria-hidden="true" />;
  }
  return <Icon icon={cardIcon(cardId)} />;
}

function cardIcon(cardId: string): string {
  if (cardId === "takokke") {
    return "🔴";
  }
  if (cardId === "bomuzo") {
    return "💣";
  }
  if (cardId === "polyspinner") {
    return "⚙️";
  }
  if (cardId === "sigma") {
    return "✊";
  }
  if (cardId === "beyond") {
    return "🎯";
  }
  if (cardId === "yanbaru") {
    return "🏹";
  }
  if (cardId === "morgan") {
    return "✨";
  }
  if (cardId === "healing") {
    return "💚";
  }
  if (cardId === "thunder") {
    return "⚡";
  }
  if (cardId === "power_up") {
    return "⬆️";
  }
  return "◆";
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roleIcon(role: string): string {
  return role === "front" ? "🛡️" : "🏹";
}

function commandIcon(command: CommandDef): string {
  if (command.recoilDamage) {
    return "💣";
  }
  if (command.range === "one_skip") {
    return "🎯";
  }
  if (command.range === "any_target" || command.range === "any_monster") {
    return "✨";
  }
  return "⚔️";
}

function masterActionIcon(actionId: MasterActionId): string {
  if (actionId === "master_attack") {
    return "⚔️";
  }
  if (actionId === "wake_up") {
    return "⏰";
  }
  return "🛡️";
}

function masterActionLabel(actionId: MasterActionId): string {
  if (actionId === "master_attack") {
    return "Master Attack";
  }
  if (actionId === "wake_up") {
    return "Wake Up";
  }
  return "Shield";
}

function logIcon(entry: string): string {
  if (entry.includes("勝利") || entry.includes("敗北")) {
    return "🏆";
  }
  if (entry.includes("倒れ") || entry.includes("ダメージ") || entry.includes("攻撃") || entry.includes("アタック")) {
    return "⚔️";
  }
  if (entry.includes("HPが") || entry.includes("山札切れ")) {
    return "❤️";
  }
  if (entry.includes("レベル") || entry.includes("Lv")) {
    return "✨";
  }
  if (entry.includes("召喚") || entry.includes("登場")) {
    return "🂠";
  }
  if (entry.includes("ため") || entry.includes("気合い")) {
    return "💪";
  }
  if (entry.includes("シールド") || entry.includes("ウェイクアップ") || entry.includes("回復")) {
    return "🛡️";
  }
  if (entry.includes("引いた")) {
    return "✋";
  }
  if (entry.includes("ストーン")) {
    return "🪨";
  }
  if (entry.includes("ターン")) {
    return "⏭️";
  }
  return "•";
}
