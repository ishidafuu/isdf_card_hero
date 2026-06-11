import { useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent, PointerEvent as ReactPointerEvent } from "react";
import { getCardDef, getCardIconPath, getCardName } from "./game/cards";
import {
  attackWithCommand,
  canFocusMonster,
  canSummonTo,
  createInitialGame,
  endTurn,
  focusMonster,
  getCommandTargets,
  getHandCard,
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
import type { CommandDef, GameState, MagicTargetKind, MasterActionId, PlayerId, SlotKey, Target } from "./game/types";

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

type Selection =
  | { kind: "hand"; instanceId: string }
  | { kind: "monster"; slotKey: SlotKey }
  | { kind: "command"; attackerSlotKey: SlotKey; commandId: string; targets: Target[] }
  | { kind: "masterAction"; actionId: MasterActionId; targets: Target[] }
  | { kind: "move"; fromSlotKey: SlotKey; targets: SlotKey[] };

type DragPayload =
  | { kind: "hand"; instanceId: string }
  | { kind: "monster"; slotKey: SlotKey };

type PendingDropAction =
  | { kind: "magic"; handInstanceId: string; target: Target }
  | { kind: "attackTarget"; attackerSlotKey: SlotKey; target: Target; commandIds: string[] }
  | { kind: "move"; fromSlotKey: SlotKey; toSlotKey: SlotKey };

const DRAG_MIME = "application/x-card-hero-drag";

const MASTER_ACTIONS: Array<{ id: MasterActionId; label: string }> = [
  { id: "master_attack", label: "Master Attack" },
  { id: "wake_up", label: "Wake Up" },
  { id: "shield", label: "Shield" },
];

type EffectKind = "attack" | "damage" | "summon" | "focus" | "move" | "heal" | "turn" | "default";

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

export function App() {
  const [game, setGame] = useState<GameState>(() => createInitialGame());
  const [selection, setSelection] = useState<Selection | undefined>();
  const [pendingDropAction, setPendingDropAction] = useState<PendingDropAction | undefined>();
  const [error, setError] = useState<string>("");
  const [visualEffect, setVisualEffect] = useState<VisualEffect | undefined>();
  const [pointerDragging, setPointerDragging] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [autoStepDelayMs, setAutoStepDelayMs] = useState(AUTO_STEP_DELAY_DEFAULT_MS);
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

  const currentPlayer = game.players[game.currentPlayer];
  const isAutoResolving = !game.winner && (autoPlayEnabled || (game.currentPlayer === "cpu" && !game.pendingLevelUp));
  const controlsDisabled = autoPlayEnabled || game.currentPlayer !== "player" || !!game.winner || !!game.pendingLevelUp;
  const turnStatus = game.winner
    ? `${playerLabel(game.winner)} win`
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
    if (selection.kind === "masterAction") {
      return new Set(selection.targets.map(targetToKey));
    }
    if (selection.kind === "move") {
      return new Set(selection.targets.map((slotKey) => `monster:${slotKey}`));
    }
    if (selection.kind === "hand") {
      return new Set(getMagicTargets(game, selection.instanceId).map(targetToKey));
    }
    return new Set<string>();
  }, [game, pendingDropAction, selection]);

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
        if (autoPlayEnabled) {
          return runAutoStep(previous);
        }
        if (previous.currentPlayer === "cpu" && !previous.pendingLevelUp) {
          return runCpuStep(previous);
        }
        return previous;
      });
    }, autoPlayEnabled ? autoStepDelayMs : CPU_STEP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [autoPlayEnabled, autoStepDelayMs, game, isAutoResolving]);

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

  function handleSlotClick(slotKey: SlotKey) {
    if (consumeSuppressedClick()) {
      return;
    }
    if (game.currentPlayer !== "player" || game.winner || game.pendingLevelUp) {
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
        applyChange((state) => playMagic(state, { handInstanceId: selection.instanceId, target }));
        return;
      }
    }

    if (selection?.kind === "command") {
      const target: Target = { kind: "monster", slotKey };
      if (targetKeys.has(targetToKey(target))) {
        applyChange((state) =>
          attackWithCommand(state, {
            attackerSlotKey: selection.attackerSlotKey,
            commandId: selection.commandId,
            target,
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

    if (slot.monster?.owner === game.currentPlayer && slot.monster.status === "active") {
      setPendingDropAction(undefined);
      setSelection({ kind: "monster", slotKey });
      setError("");
      return;
    }

    setSelection(undefined);
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
      applyChange((state) =>
        attackWithCommand(state, {
          attackerSlotKey: selection.attackerSlotKey,
          commandId: selection.commandId,
          target,
        }),
      );
    }
    if (selection?.kind === "hand" && targetKeys.has(targetToKey(target))) {
      applyChange((state) => playMagic(state, { handInstanceId: selection.instanceId, target }));
    }
  }

  function handleEndTurn() {
    applyChange(endTurn);
  }

  function handleNewGame() {
    const next = createInitialGame();
    previousGameRef.current = next;
    setGame(next);
    setSelection(undefined);
    setPendingDropAction(undefined);
    setError("");
    setVisualEffect(undefined);
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
      applyChange((state) => playMagic(state, { handInstanceId: pendingDropAction.handInstanceId, target: pendingDropAction.target }));
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
    applyChange((state) =>
      attackWithCommand(state, {
        attackerSlotKey: pendingDropAction.attackerSlotKey,
        commandId,
        target: pendingDropAction.target,
      }),
    );
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
          <button type="button" onClick={() => setAutoPlayEnabled((enabled) => !enabled)}>
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
          <button type="button" onClick={handleNewGame}>
            <Icon icon="🔄" /> New Game
          </button>
        </div>
      </header>

      <section className="status-strip" aria-label="players">
        <PlayerStatus label="プレイヤー" hp={game.players.player.masterHp} stones={game.players.player.stones} deck={game.players.player.deck.length} hand={game.players.player.hand.length} discard={game.players.player.discard.length} active={game.currentPlayer === "player"} />
        <PlayerStatus label="CPU" hp={game.players.cpu.masterHp} stones={game.players.cpu.stones} deck={game.players.cpu.deck.length} hand={game.players.cpu.hand.length} discard={game.players.cpu.discard.length} active={game.currentPlayer === "cpu"} />
      </section>

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
                    return (
                      <button
                        key={cell.playerId}
                        type="button"
                        className={[
                          "master",
                          cell.playerId === "cpu" ? "master-cpu" : "master-player",
                          targetKeys.has(`master:${cell.playerId}`) ? "targetable" : "",
                          visualEffect?.masters.includes(cell.playerId) ? `effect-active effect-${visualEffect.kind}` : "",
                          damageFlash?.defeated ? "effect-defeated" : "",
                        ].join(" ")}
                        onDragOver={handleDragOver}
                        onDrop={(event) => handleMasterDrop(event, cell.playerId)}
                        data-master-id={cell.playerId}
                        onClick={() => handleMasterClick(cell.playerId)}
                      >
                        <span>{cell.label}</span>
                        <strong>HP {game.players[cell.playerId].masterHp}</strong>
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
        </div>

        <aside className="side-panel">
          {game.winner && (
            <section className="notice">
              <h2><Icon icon="🏆" /> {playerLabel(game.winner)} Win</h2>
              <button type="button" onClick={handleNewGame}><Icon icon="🔄" /> もう一戦</button>
            </section>
          )}

          {game.pendingLevelUp && (
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
          )}

          <section className="actions">
            <h2>Actions</h2>
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
            {pendingDropAction && (
              <PendingDropActionPanel
                action={pendingDropAction}
                game={game}
                onAttackCommand={handlePendingAttackCommand}
                onConfirm={handleConfirmPendingDropAction}
                onCancel={handleCancelPendingDropAction}
              />
            )}
            {selectedMonster && selection?.kind === "monster" && (
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
            )}
            {selectedHand && (
              <div className="selected-detail">
                <CardDetail cardId={selectedHand.cardId} />
              </div>
            )}
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

          <section className="log-panel">
            <h2>Log</h2>
            <ol>
              {game.log.slice(-18).map((entry, index) => (
                <li className={`log-entry ${logTone(entry)}`} key={`${entry}_${index}`}>
                  <Icon icon={logIcon(entry)} /> {entry}
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </section>

      <section className="hand-area">
        <div className="hand-heading">
          <h2>Hand</h2>
          <span>{currentPlayer.hand.length} cards</span>
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
      </section>
    </main>
  );
}

interface PlayerStatusProps {
  label: string;
  hp: number;
  stones: number;
  deck: number;
  hand: number;
  discard: number;
  active: boolean;
}

function PlayerStatus({ label, hp, stones, deck, hand, discard, active }: PlayerStatusProps) {
  return (
    <div className={`player-status ${active ? "active" : ""}`}>
      <strong><Icon icon={active ? "▶️" : "👤"} /> {label}</strong>
      <span><Icon icon="❤️" /> HP {hp}</span>
      <span><Icon icon="🪨" /> Stone {stones}</span>
      <span><Icon icon="🂠" /> Deck {deck}</span>
      <span><Icon icon="✋" /> Hand {hand}</span>
      <span><Icon icon="🗑️" /> Discard {discard}</span>
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

interface BoardSlotProps {
  slotKey: SlotKey;
  game: GameState;
  selected: boolean;
  targetable: boolean;
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
  const monster = game.slots[slotKey].monster;
  if (!monster) {
    return null;
  }
  const moveTargets = getMovableTargets(game, slotKey);

  return (
    <div className="selected-detail">
      <h3><CardIcon cardId={monster.cardId} /> {getCardName(monster.cardId)} Lv{monster.level}</h3>
      <div className="button-stack">
        {getMonsterCommands(monster).map((command) => {
          const targets = getCommandTargets(game, slotKey, command.id);
          return (
            <button
              key={command.id}
              type="button"
              onClick={() => onCommand(command.id, targets)}
              disabled={targets.length === 0}
            >
              <Icon icon={commandIcon(command)} /> {command.name} {command.power}P
            </button>
          );
        })}
        <button type="button" onClick={() => onMove(moveTargets)} disabled={moveTargets.length === 0}>
          <Icon icon="🧭" /> Move / Swap
        </button>
        <button type="button" onClick={onFocus} disabled={!canFocusMonster(game, slotKey)}>
          <Icon icon="💪" /> ためる
        </button>
      </div>
    </div>
  );
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
  return selection?.kind === "monster" && selection.slotKey === slotKey;
}

function isSelectedSourceHand(selection: Selection | undefined, action: PendingDropAction | undefined, instanceId: string): boolean {
  if (action?.kind === "magic" && action.handInstanceId === instanceId) {
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

function createVisualEffect(previous: GameState, next: GameState, id: number): VisualEffect {
  const appendedLogs = getAppendedLogs(previous.log, next.log);
  const latestLog = appendedLogs.at(-1) ?? next.log[next.log.length - 1] ?? "";
  return {
    id,
    kind: effectKindFromLog(latestLog),
    slots: BOARD_SLOT_KEYS.filter((slotKey) => slotSignature(previous, slotKey) !== slotSignature(next, slotKey)),
    masters: PLAYER_IDS.filter(
      (playerId) => previous.players[playerId].masterHp !== next.players[playerId].masterHp,
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
  ].join(":");
}

function effectKindFromLog(entry: string): EffectKind {
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

function logTone(entry: string): string {
  if (entry.includes("勝利") || entry.includes("敗北")) {
    return "log-win";
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
    </>
  );
}

interface CardDetailProps {
  cardId: string;
}

function CardDetail({ cardId }: CardDetailProps) {
  const def = getCardDef(cardId);
  if (def.type === "magic") {
    return (
      <>
        <h3><CardIcon cardId={def.id} /> {def.name}</h3>
        <div className="card-meta-row">
          <span className="card-chip magic">✨ 魔法</span>
          <span><Icon icon="🪨" /> Cost {def.cost}</span>
          <span>{targetKindsLabel(def.targetKinds)}</span>
        </div>
        <p>{def.description}</p>
      </>
    );
  }

  return (
    <>
      <h3><CardIcon cardId={def.id} /> {def.name}</h3>
      <div className="card-meta-row">
        <span className="card-chip"><Icon icon={roleIcon(def.role)} /> {def.role === "front" ? "前衛" : "後衛"}</span>
        <span><Icon icon="🪨" /> 召喚 1</span>
        <span><Icon icon="✨" /> MaxLv {def.maxLevel}</span>
        {def.actionLimit && <span><Icon icon="⚡" /> {def.actionLimit}回行動</span>}
      </div>
      <div className="level-detail-list">
        {def.levels.map((level) => (
          <div className="level-detail" key={level.level}>
            <strong><Icon icon="✨" /> Lv{level.level} / <Icon icon="❤️" /> HP {level.maxHp}</strong>
            <ul>
              {level.commands.map((command) => (
                <li key={command.id}>{commandSummary(command)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

function commandSummary(command: CommandDef): string {
  return [
    `${commandIcon(command)} ${command.name} ${command.power}P`,
    rangeLabel(command.range, command.rangeText),
    command.stoneCost ? `Stone ${command.stoneCost}` : "",
    command.effectText ? `効果 ${command.effectText}` : "",
    command.recoilDamage ? `反動 ${command.recoilDamage}` : "",
    command.implemented === false ? "未実装" : "",
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
  if (range === "unimplemented") {
    return rawRange ? `未対応: ${rawRange}` : "未対応";
  }
  return "👑 マスター";
}

function targetKindsLabel(targetKinds: MagicTargetKind[]): string {
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
