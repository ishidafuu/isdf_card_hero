import { useEffect, useMemo, useRef, useState } from "react";
import { getCardDef, getCardName } from "./game/cards";
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
  runCpuStep,
  summonMonster,
  targetToKey,
  useMasterAction,
  useMasterHpDraw,
} from "./game/rules";
import type { GameState, MasterActionId, PlayerId, SlotKey, Target } from "./game/types";

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

type Selection =
  | { kind: "hand"; instanceId: string }
  | { kind: "monster"; slotKey: SlotKey }
  | { kind: "command"; attackerSlotKey: SlotKey; commandId: string; targets: Target[] }
  | { kind: "masterAction"; actionId: MasterActionId; targets: Target[] }
  | { kind: "move"; fromSlotKey: SlotKey; targets: SlotKey[] };

const MASTER_ACTIONS: Array<{ id: MasterActionId; label: string }> = [
  { id: "master_attack", label: "Master Attack" },
  { id: "wake_up", label: "Wake Up" },
  { id: "shield", label: "Shield" },
];

type EffectKind = "attack" | "damage" | "summon" | "focus" | "move" | "heal" | "turn" | "default";

interface VisualEffect {
  kind: EffectKind;
  slots: SlotKey[];
  masters: PlayerId[];
}

export function App() {
  const [game, setGame] = useState<GameState>(() => createInitialGame());
  const [selection, setSelection] = useState<Selection | undefined>();
  const [error, setError] = useState<string>("");
  const [visualEffect, setVisualEffect] = useState<VisualEffect | undefined>();
  const previousGameRef = useRef<GameState>(game);

  const currentPlayer = game.players[game.currentPlayer];
  const isCpuResolving = game.currentPlayer === "cpu" && !game.winner && !game.pendingLevelUp;
  const controlsDisabled = game.currentPlayer !== "player" || !!game.winner || !!game.pendingLevelUp;
  const targetKeys = useMemo(() => {
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
  }, [game, selection]);

  useEffect(() => {
    const previous = previousGameRef.current;
    if (previous !== game) {
      setVisualEffect(createVisualEffect(previous, game));
      previousGameRef.current = game;
    }
  }, [game]);

  useEffect(() => {
    if (!isCpuResolving) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setGame((previous) => {
        if (previous.currentPlayer !== "cpu" || previous.winner || previous.pendingLevelUp) {
          return previous;
        }
        return runCpuStep(previous);
      });
    }, CPU_STEP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [game, isCpuResolving]);

  useEffect(() => {
    if (!visualEffect) {
      return undefined;
    }
    const timer = window.setTimeout(() => setVisualEffect(undefined), 460);
    return () => window.clearTimeout(timer);
  }, [visualEffect]);

  function applyChange(change: (state: GameState) => GameState, keepSelection = false) {
    try {
      setGame(change(game));
      setError("");
      if (!keepSelection) {
        setSelection(undefined);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "操作に失敗しました");
    }
  }

  function handleSlotClick(slotKey: SlotKey) {
    if (game.currentPlayer !== "player" || game.winner || game.pendingLevelUp) {
      return;
    }

    const slot = game.slots[slotKey];
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
      setSelection({ kind: "monster", slotKey });
      setError("");
      return;
    }

    setSelection(undefined);
  }

  function handleMasterClick(playerId: "player" | "cpu") {
    if (game.currentPlayer !== "player" || game.winner || game.pendingLevelUp) {
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
    setError("");
    setVisualEffect(undefined);
  }

  const selectedMonster =
    selection?.kind === "monster" ? game.slots[selection.slotKey].monster : undefined;
  const selectedHand =
    selection?.kind === "hand" ? currentPlayer.hand.find((card) => card.instanceId === selection.instanceId) : undefined;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>Card Hero Prototype</h1>
          <p>Turn {game.turnNumber} / {isCpuResolving ? "CPU resolving..." : playerLabel(game.currentPlayer)}</p>
        </div>
        <div className="topbar-actions">
          <button type="button" onClick={handleNewGame}>New Game</button>
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
                        selected={selection?.kind === "monster" && selection.slotKey === cell.slotKey}
                        targetable={targetKeys.has(`monster:${cell.slotKey}`)}
                        effectKind={visualEffect?.slots.includes(cell.slotKey) ? visualEffect.kind : undefined}
                        onClick={() => handleSlotClick(cell.slotKey)}
                      />
                    );
                  }
                  if (cell.kind === "master") {
                    return (
                      <button
                        key={cell.playerId}
                        type="button"
                        className={[
                          "master",
                          cell.playerId === "cpu" ? "master-cpu" : "master-player",
                          targetKeys.has(`master:${cell.playerId}`) ? "targetable" : "",
                          visualEffect?.masters.includes(cell.playerId) ? `effect-active effect-${visualEffect.kind}` : "",
                        ].join(" ")}
                        onClick={() => handleMasterClick(cell.playerId)}
                      >
                        <span>{cell.label}</span>
                        <strong>HP {game.players[cell.playerId].masterHp}</strong>
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
              <h2>{playerLabel(game.winner)} Win</h2>
              <button type="button" onClick={handleNewGame}>もう一戦</button>
            </section>
          )}

          {game.pendingLevelUp && (
            <section className="notice">
              <h2>Level Up</h2>
              <p>上げるレベル数を選択</p>
              <div className="button-row">
                {Array.from({ length: game.pendingLevelUp.maxLevels + 1 }, (_, level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => applyChange((state) => resolveLevelUp(state, level))}
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
              <button
                type="button"
                onClick={() => applyChange(useMasterHpDraw)}
                disabled={controlsDisabled || currentPlayer.deck.length === 0}
              >
                HP Draw
              </button>
              {MASTER_ACTIONS.map((action) => {
                const targets = getMasterActionTargets(game, action.id);
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => {
                      setSelection({ kind: "masterAction", actionId: action.id, targets });
                      setError("");
                    }}
                    disabled={controlsDisabled || targets.length === 0}
                  >
                    {action.label} {getMasterActionCost(action.id)}
                  </button>
                );
              })}
              <button type="button" onClick={handleEndTurn} disabled={controlsDisabled}>
                End Turn
              </button>
            </div>
            {selectedMonster && selection?.kind === "monster" && (
              <MonsterCommands
                game={game}
                slotKey={selection.slotKey}
                onCommand={(commandId, targets) => setSelection({ kind: "command", attackerSlotKey: selection.slotKey, commandId, targets })}
                onFocus={() => applyChange((state) => focusMonster(state, selection.slotKey))}
                onMove={(targets) => setSelection({ kind: "move", fromSlotKey: selection.slotKey, targets })}
              />
            )}
            {selectedHand && (
              <div className="selected-detail">
                <h3>{getCardName(selectedHand.cardId)}</h3>
                <p>{cardHelpText(selectedHand.cardId)}</p>
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
                <li className={`log-entry ${logTone(entry)}`} key={`${entry}_${index}`}>{entry}</li>
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
              className={`hand-card ${selection?.kind === "hand" && selection.instanceId === card.instanceId ? "selected" : ""}`}
              onClick={() => {
                setSelection({ kind: "hand", instanceId: card.instanceId });
                setError("");
              }}
              disabled={controlsDisabled}
            >
              <strong>{getCardName(card.cardId)}</strong>
              <span>{cardTypeLabel(card.cardId)}</span>
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
      <strong>{label}</strong>
      <span>HP {hp}</span>
      <span>Stone {stones}</span>
      <span>Deck {deck}</span>
      <span>Hand {hand}</span>
      <span>Discard {discard}</span>
    </div>
  );
}

interface BoardSlotProps {
  slotKey: SlotKey;
  game: GameState;
  selected: boolean;
  targetable: boolean;
  effectKind?: EffectKind;
  onClick: () => void;
}

function BoardSlot({ slotKey, game, selected, targetable, effectKind, onClick }: BoardSlotProps) {
  const slot = game.slots[slotKey];
  const monster = slot.monster;
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
      ].join(" ")}
      onClick={onClick}
    >
      <span className="slot-label">{label}</span>
      {monster ? (
        <span className="monster-card">
          <strong>{getCardName(monster.cardId)}</strong>
          <span>Lv{monster.level} / HP {monster.hp}</span>
          <span>{monster.status === "prepared" ? "準備中" : `${monster.actionCount}/${monster.actionLimit}行動`}</span>
          <span>{[monster.focused ? "気合い" : "", monster.powerUp ? "P+1" : "", monster.shielded ? "盾" : ""].filter(Boolean).join(" ")}</span>
        </span>
      ) : (
        <span className="empty-slot">Empty</span>
      )}
    </button>
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
      <h3>{getCardName(monster.cardId)} Lv{monster.level}</h3>
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
              {command.name} {command.power}P
            </button>
          );
        })}
        <button type="button" onClick={() => onMove(moveTargets)} disabled={moveTargets.length === 0}>
          Move / Swap
        </button>
        <button type="button" onClick={onFocus} disabled={!canFocusMonster(game, slotKey)}>
          ためる
        </button>
      </div>
    </div>
  );
}

function createVisualEffect(previous: GameState, next: GameState): VisualEffect {
  const latestLog = next.log[next.log.length - 1] ?? "";
  return {
    kind: effectKindFromLog(latestLog),
    slots: BOARD_SLOT_KEYS.filter((slotKey) => slotSignature(previous, slotKey) !== slotSignature(next, slotKey)),
    masters: PLAYER_IDS.filter(
      (playerId) => previous.players[playerId].masterHp !== next.players[playerId].masterHp,
    ),
  };
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

function cardTypeLabel(cardId: string): string {
  const def = getCardDef(cardId);
  if (def.type === "monster") {
    return def.role === "front" ? "前衛" : "後衛";
  }
  return `魔法 ${def.cost}`;
}

function cardHelpText(cardId: string): string {
  const def = getCardDef(cardId);
  if (def.type === "magic") {
    return def.description;
  }
  return `${def.role === "front" ? "前衛" : "後衛"}モンスター。空き枠を選ぶと召喚できます。`;
}

function slotLabel(slotKey: SlotKey): string {
  const [owner, row, lane] = slotKey.split("_");
  const ownerLabel = owner === "player" ? "P" : "C";
  const rowLabel = row === "front" ? "前" : "後";
  const laneLabel = lane === "left" ? "L" : "R";
  return `${ownerLabel}${rowLabel}${laneLabel}`;
}
