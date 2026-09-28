import { useState } from "react";
import type { ReactNode } from "react";
import { getCardName } from "../game/cards";
import type { GameState, SlotKey } from "../game/types";
import type { BattleJournal, BattleJournalResult, ReplaySnapshot } from "../replay/types";
import type { BattleJournalWorkerOperation, BattleJournalWorkerStage } from "../replay/workerProtocol";

export interface BattleJournalOperationStatus {
  operation: BattleJournalWorkerOperation;
  target: string;
  stage: BattleJournalWorkerStage;
  elapsedMs: number;
}

interface BattleJournalPanelProps {
  journal: BattleJournal | null;
  cursor: number;
  replay: BattleJournalResult<ReplaySnapshot> | undefined;
  imported: boolean;
  message: string;
  onSeek: (cursor: number) => void;
  onReturnToLive: () => void;
  onImport: (json: string) => void;
  onExport: () => void;
  operation?: BattleJournalOperationStatus;
  workerError?: string;
  onCancelOperation: () => void;
  seekCancelled: boolean;
  onRetrySeek: () => void;
  renderCardIcon: (cardId: string) => ReactNode;
}

export function BattleJournalPanel({
  journal,
  cursor,
  replay,
  imported,
  message,
  onSeek,
  onReturnToLive,
  onImport,
  onExport,
  operation,
  workerError,
  onCancelOperation,
  seekCancelled,
  onRetrySeek,
  renderCardIcon,
}: BattleJournalPanelProps) {
  const [importText, setImportText] = useState("");
  const maximumCursor = journal?.completeness.status === "incomplete"
    ? Math.min(journal.commands.length, journal.completeness.afterSequence)
    : journal?.commands.length ?? 0;
  const state = replay?.ok ? replay.value.state : undefined;
  const nonSeekBusy = Boolean(operation && operation.operation !== "seek");

  return (
    <section className="zone-panel battle-journal-panel" aria-busy={Boolean(operation)}>
      <div className="zone-panel-heading">
        <div>
          <h3>対局Journal / Replay</h3>
          <p>Analyze専用・読み取り専用です。再生位置の変更は現在の対局を変更しません。</p>
        </div>
        <div className="battle-journal-actions">
          <button type="button" onClick={onReturnToLive}>現在の対局</button>
          <button type="button" onClick={onExport} disabled={nonSeekBusy || !journal || journal.completeness.status !== "complete"}>
            JSONを書き出す
          </button>
        </div>
      </div>
      {operation && <JournalOperationNotice operation={operation} onCancel={onCancelOperation} />}
      {workerError && <p className="battle-journal-error" role="alert">{workerError}</p>}
      {!journal ? (
        <p className="empty-zone">Journalを作成できませんでした。</p>
      ) : (
        <>
          <div className="battle-journal-status" role="status">
            <strong>{imported ? "読み込みJournal" : "現在の対局"}</strong>
            <span>{cursor} / {journal.commands.length} commands</span>
            <span>{journal.completeness.status === "complete" ? "完全" : `不完全: ${journal.completeness.reason}`}</span>
          </div>
          <div className="battle-journal-seeker">
            <button type="button" onClick={() => onSeek(Math.max(0, cursor - 1))} disabled={nonSeekBusy || cursor <= 0} aria-label="1 command戻る">←</button>
            <label>
              Replay position
              <input
                type="range"
                min={0}
                max={maximumCursor}
                value={Math.min(cursor, maximumCursor)}
                onChange={(event) => onSeek(Number(event.target.value))}
                disabled={nonSeekBusy}
              />
            </label>
            <button type="button" onClick={() => onSeek(Math.min(maximumCursor, cursor + 1))} disabled={nonSeekBusy || cursor >= maximumCursor} aria-label="1 command進む">→</button>
          </div>
          {replay && !replay.ok && <p className="battle-journal-error" role="alert">{replay.error.message}</p>}
          {seekCancelled && <div className="battle-journal-cancelled" role="status">
            <span>このReplay再構築はキャンセルされました。現在の対局には影響していません。</span>
            <button type="button" onClick={onRetrySeek}>再試行</button>
          </div>}
          {state && <JournalStateView state={state} renderCardIcon={renderCardIcon} />}
          <label className="battle-journal-import">
            Journal JSONを貼り付けて読み込む
            <textarea value={importText} onChange={(event) => setImportText(event.target.value)} spellCheck={false} />
          </label>
          <button type="button" onClick={() => onImport(importText)} disabled={nonSeekBusy || !importText.trim()}>
            JSONを読み込む
          </button>
          {message && <p className="battle-journal-message" role="status">{message}</p>}
        </>
      )}
    </section>
  );
}

export function JournalOperationNotice({ operation, onCancel }: { operation: BattleJournalOperationStatus; onCancel: () => void }) {
  const label: Record<BattleJournalWorkerOperation, string> = {
    seek: "Replay位置を再構築中",
    undo: "Undo位置を検証中",
    branch: "分岐位置を検証中",
    import: "Journalを読み込み・検証中",
    export: "Journalを書き出し・検証中",
  };
  const stage: Record<BattleJournalWorkerStage, string> = {
    replaying: "状態を再生しています",
    "verifying-branch": "分岐を検証しています",
    "validating-import": "JSONと履歴を検証しています",
    "validating-export": "履歴の整合性を検証しています",
  };
  return (
    <div className="journal-worker-notice" role="status" data-testid="journal-worker-status">
      <span><strong>{label[operation.operation]}</strong> · {operation.target} · {stage[operation.stage]} · {(operation.elapsedMs / 1000).toFixed(1)}秒</span>
      <button type="button" onClick={onCancel} data-testid="journal-worker-cancel">キャンセル</button>
    </div>
  );
}

function JournalStateView({ state, renderCardIcon }: { state: GameState; renderCardIcon: (cardId: string) => ReactNode }) {
  const player = state.players.player;
  const cpu = state.players.cpu;
  const slot = (slotKey: SlotKey) => {
    const monster = state.slots[slotKey].monster;
    return (
      <div className={`battle-journal-slot ${monster ? "occupied" : "empty"}`} key={slotKey}>
        <small>{slotKey.replace("_", " ").replace("_", " ")}</small>
        {monster ? (
          <>
            {renderCardIcon(monster.cardId)}
            <strong>{getCardName(monster.cardId)}</strong>
            <span>HP {monster.hp} · Lv {monster.level}</span>
            <span>{monster.status === "prepared" ? "準備中" : "登場"}</span>
          </>
        ) : <span>空き</span>}
      </div>
    );
  };
  const master = (playerId: "player" | "cpu") => {
    const masterPlayer = state.players[playerId];
    return (
      <div className="battle-journal-master" key={`master_${playerId}`}>
        <small>{playerId === "player" ? "Player Master" : "CPU Master"}</small>
        <strong>{masterPlayer.masterId}</strong>
        <span>HP {masterPlayer.masterHp} · Stone {masterPlayer.stones}</span>
      </div>
    );
  };

  return (
    <div className="battle-journal-state">
      <h4>この位置のGameState</h4>
      <p>
        Turn {state.turnNumber} · {state.currentPlayer === "player" ? "Player" : "CPU"} turn ·{" "}
        Player HP {player.masterHp} / Stone {player.stones} / Hand {player.hand.length} ·{" "}
        CPU HP {cpu.masterHp} / Stone {cpu.stones} / Hand {cpu.hand.length}
      </p>
      <div className="battle-journal-board" role="group" aria-label="Replay snapshot board">
        <div className="battle-journal-board-row">{slot("cpu_back_left")}<div className="battle-journal-gap" />{slot("cpu_back_right")}</div>
        <div className="battle-journal-board-row">{slot("cpu_front_left")}{master("cpu")}{slot("cpu_front_right")}</div>
        <div className="battle-journal-board-row">{slot("player_front_left")}{master("player")}{slot("player_front_right")}</div>
        <div className="battle-journal-board-row">{slot("player_back_left")}<div className="battle-journal-gap" />{slot("player_back_right")}</div>
      </div>
      <details>
        <summary>この位置までの最新ログ</summary>
        <ol>{state.log.slice(-8).map((entry, index) => <li key={`${state.log.length - 8 + index}_${entry}`}>{entry}</li>)}</ol>
      </details>
    </div>
  );
}
