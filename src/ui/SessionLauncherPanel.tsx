import type { ReactNode } from "react";
import { JournalOperationNotice, type BattleJournalOperationStatus } from "./BattleJournalPanel";
import { ExperimentalSessionSetup, type ExperimentalLaunchOptions } from "./ExperimentalSessionSetup";
import type { CpuAiProfiles } from "../game/cpuAiTypes";
import type { MasterId, PlayerId } from "../game/types";

export interface PuzzleLauncherOption {
  id: string;
  title: string;
  prompt: string;
}

export type SessionLauncherKind = "battle" | "local-pvp" | "daily" | "puzzle" | "gauntlet" | "draft" | "sealed";

interface SessionLauncherPanelProps {
  asPage?: boolean;
  sessionLabel: string;
  progressLabel?: string;
  busy?: boolean;
  operation?: BattleJournalOperationStatus;
  readTarget?: string;
  error?: string;
  puzzles: readonly PuzzleLauncherOption[];
  onLaunch: (kind: SessionLauncherKind) => void;
  onLaunchExperimental?: (options: ExperimentalLaunchOptions) => void;
  experimentalDefaults?: { seed: number; profiles: CpuAiProfiles; masters: Record<PlayerId, MasterId> };
  onLaunchPuzzle: (puzzleId: string) => void;
  onRestore: (file: File) => void;
  onSaveArchive?: () => void;
  canSaveArchive?: boolean;
  autosaveEnabled?: boolean;
  autosaveStatus?: string;
  onResumeAutosave?: () => void;
  onToggleAutosave?: () => void;
  onCancelRestore?: () => void;
  onCancelOperation?: () => void;
  onClose?: () => void;
  children?: ReactNode;
}

export function SessionLauncherPanel({
  asPage = false,
  sessionLabel,
  progressLabel,
  busy = false,
  operation,
  readTarget,
  error,
  puzzles,
  onLaunch,
  onLaunchExperimental,
  experimentalDefaults,
  onLaunchPuzzle,
  onRestore,
  onSaveArchive,
  canSaveArchive = true,
  autosaveEnabled = false,
  autosaveStatus,
  onResumeAutosave,
  onToggleAutosave,
  onCancelRestore,
  onCancelOperation,
  onClose,
  children,
}: SessionLauncherPanelProps) {
  return (
    <section className={`session-launcher-panel ${asPage ? "session-launcher-page" : ""}`} aria-labelledby="session-launcher-title" aria-busy={busy}>
      <div className="session-launcher-heading">
        <div>
          <p className="eyebrow">STONE TACTICS · SESSION HUB</p>
          <h2 id="session-launcher-title">セッション</h2>
          <p>{sessionLabel}{progressLabel ? ` · ${progressLabel}` : ""}</p>
        </div>
        {onClose && <button type="button" onClick={onClose} aria-label="セッションパネルを閉じる">閉じる</button>}
      </div>
      {error && <p role="alert" className="session-launcher-error">{error}</p>}
      {busy && <p role="status">セッションを検証・切替中です。完了するまで操作をお待ちください。</p>}
      {operation && onCancelOperation && <JournalOperationNotice operation={operation} onCancel={onCancelOperation} />}
      {readTarget && <div className="session-restore-reading" role="status"><span>保存ファイルを読み込み中 · {readTarget}</span>{onCancelRestore && <button type="button" onClick={onCancelRestore}>復帰をキャンセル</button>}</div>}
      <div className="session-launcher-actions" aria-label="セッションを開始">
        <button type="button" disabled={busy} onClick={() => onLaunch("battle")}>通常対戦を開始</button>
        <button type="button" disabled={busy} onClick={() => onLaunch("local-pvp")}>Local PvPを開始</button>
        <button type="button" disabled={busy} onClick={() => onLaunch("daily")}>今日のDailyを開始</button>
        <button type="button" disabled={busy} onClick={() => onLaunch("gauntlet")}>3戦Gauntletを開始</button>
        <button type="button" disabled={busy} onClick={() => onLaunch("draft")}>Draftを開始</button>
        <button type="button" disabled={busy} onClick={() => onLaunch("sealed")}>Sealedを開始</button>
      </div>
      <div className="session-launcher-puzzles">
        <h3>Puzzle</h3>
        <div className="session-launcher-actions">
          {puzzles.map((puzzle) => (
            <button key={puzzle.id} type="button" disabled={busy} onClick={() => onLaunchPuzzle(puzzle.id)}>
              <strong>{puzzle.title}</strong><span>{puzzle.prompt}</span>
            </button>
          ))}
        </div>
      </div>
      {onLaunchExperimental && experimentalDefaults && (
        <details className="session-launcher-experimental">
          <summary>Experimental · 研究用ルール</summary>
          <ExperimentalSessionSetup
            key={`${experimentalDefaults.seed}:${experimentalDefaults.masters.player}:${experimentalDefaults.masters.cpu}:${experimentalDefaults.profiles.player}:${experimentalDefaults.profiles.cpu}`}
            busy={busy}
            defaults={experimentalDefaults}
            onStart={onLaunchExperimental}
          />
        </details>
      )}
      <label className="session-archive-import">
        <span>保存済みセッションを検証して復帰</span>
        <input
          type="file"
          accept="application/json,.json"
        disabled={busy && !readTarget}
          aria-label="セッションアーカイブJSONを選択"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) onRestore(file);
            event.currentTarget.value = "";
          }}
        />
      </label>
      {onSaveArchive && (
        <div className="session-archive-export">
          <p>保存JSONは再現用のため、双方の手札・山札順・準備中カード、限定戦の非公開pool/pickを含みます。共有せず安全に保管してください。</p>
          <button type="button" disabled={busy || !canSaveArchive} onClick={onSaveArchive}>
            セッションを検証してJSON保存
          </button>
        </div>
      )}
      {(onResumeAutosave || onToggleAutosave) && (
        <div className="session-autosave-controls">
          {onToggleAutosave && <button type="button" disabled={busy} onClick={onToggleAutosave}>
            {autosaveEnabled ? "端末autosaveを停止" : "この端末でautosaveを有効化"}
          </button>}
          {onResumeAutosave && <button type="button" disabled={busy} onClick={onResumeAutosave}>端末autosaveから復帰</button>}
          {autosaveStatus && <p role="status">{autosaveStatus}</p>}
          {!autosaveEnabled && <p>autosaveはタブ再読み込み後に自動再開しません。保存済みセッションを確認してから手動復帰し、必要なら再度有効化してください。</p>}
        </div>
      )}
      {children}
    </section>
  );
}
