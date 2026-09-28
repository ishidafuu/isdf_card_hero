import { useEffect, useMemo, useState } from "react";
import { getCardDef } from "../game/cards";
import {
  getDraftView,
  getSealedView,
  type DraftCardChoice,
  type DraftSeatView,
  type SealedSeatView,
} from "../sessions/limited";
import type { SessionRuntime } from "../sessions/types";

interface LimitedSessionPanelProps {
  runtime: SessionRuntime;
  error?: string;
  busy?: boolean;
  onPickDraft: (pickId: string) => void;
  onUpdateSealedSelection: (instanceIds: readonly string[]) => void;
  onSelectSealed: (instanceIds: readonly string[]) => void;
  onStartBattle: () => void;
  onReviewCompletedBattle?: () => void;
  onCoachCompletedBattle?: (seat: "player" | "cpu") => void;
}

export function LimitedSessionPanel({
  runtime,
  error,
  busy = false,
  onPickDraft,
  onUpdateSealedSelection,
  onSelectSealed,
  onStartBattle,
  onReviewCompletedBattle,
  onCoachCompletedBattle,
}: LimitedSessionPanelProps) {
  const draftResult = runtime.progress.kind === "draft" ? getDraftView(runtime, "player") : undefined;
  const sealedResult = runtime.progress.kind === "sealed" ? getSealedView(runtime, "player") : undefined;
  const draftView = draftResult?.ok ? draftResult.value : undefined;
  const sealedView = sealedResult?.ok ? sealedResult.value : undefined;
  const [selectedInstances, setSelectedInstances] = useState<readonly string[]>([]);
  const selectedKey = runtime.manifest.id + (sealedView?.selectedInstanceIds.join(",") ?? "");

  useEffect(() => {
    setSelectedInstances(sealedView?.selectedInstanceIds ?? []);
  }, [selectedKey]);

  if (!draftView && !sealedView) return null;
  return (
    <section className="limited-session-panel" aria-labelledby="limited-session-title">
      <div className="limited-session-heading">
        <div>
          <p className="eyebrow">PRIVATE LIMITED POOL</p>
          <h2 id="limited-session-title">{draftView ? "Draft" : "Sealed"} 準備</h2>
        </div>
        <p role="status">{draftView ? draftStatus(draftView) : sealedStatus(sealedView!)}</p>
      </div>
      {error && <p className="session-launcher-error" role="alert">{error}</p>}
      {draftView && <DraftPicker view={draftView} disabled={busy} onPick={onPickDraft} />}
      {sealedView && (
        <SealedBuilder
          view={sealedView}
          selected={selectedInstances}
          disabled={busy || sealedView.status !== "deckbuilding"}
          onToggle={(instanceId) => {
            const next = toggle(selectedInstances, instanceId);
            setSelectedInstances(next);
            onUpdateSealedSelection(next);
          }}
          onApply={() => onSelectSealed(selectedInstances)}
        />
      )}
      {(draftView?.status === "deckReady" || sealedView?.status === "deckReady") && (
        <button className="primary-button" type="button" disabled={busy} onClick={onStartBattle}>
          {draftView ? "Draftデッキで対局開始" : "Sealedデッキで対局開始"}
        </button>
      )}
      {(draftView?.status === "completed" || sealedView?.status === "completed") && (
        <div className="limited-result-card" role="group" aria-label="限定戦の対局結果">
          <p role="status">
            {runtime.progress.kind === "draft" && runtime.progress.result
              ? `対局完了 · ${winnerLabel(runtime.progress.result.result.winner)}勝利 · ${runtime.progress.result.result.turns} turns`
              : runtime.progress.kind === "sealed" && runtime.progress.result
                ? `対局完了 · ${winnerLabel(runtime.progress.result.winner)}勝利 · ${runtime.progress.result.turns} turns`
                : "このセッションの対局は完了しました."}
            {" "}相手pool／pick内容は限定戦の記録境界に従って表示しません。
          </p>
          {runtime.progress.kind === "draft" && runtime.progress.result && <>
            <button type="button" onClick={onReviewCompletedBattle}>この対局を振り返る</button>
            {onCoachCompletedBattle && <button type="button" onClick={() => onCoachCompletedBattle("player")}>席1のコーチ分析</button>}
            {onCoachCompletedBattle && <button type="button" onClick={() => onCoachCompletedBattle("cpu")}>席2のコーチ分析</button>}
          </>}
        </div>
      )}
    </section>
  );
}

function DraftPicker({ view, disabled, onPick }: { view: DraftSeatView; disabled: boolean; onPick: (pickId: string) => void }) {
  if (view.status !== "drafting") {
    return <p>自分のpick {view.draftedCardIds.length}/30 · 両デッキ30枚</p>;
  }
  if (view.activeSeat !== "player") return <p role="status">相手の公開pack内でCPUがpick中です。</p>;
  return (
    <div className="limited-choice-list" aria-label="現在のpackからカードをpick">
      <p>Pack {Math.floor(view.packIndex / 2) + 1}/3 · 自分のpick {view.pickedCountBySeat.player}/30</p>
      {view.choices.map((choice) => <DraftChoice key={choice.pickId} choice={choice} disabled={disabled} onPick={onPick} />)}
      {!view.choices.length && <p role="status">現在のpackにpickできるカードがありません。</p>}
    </div>
  );
}

function DraftChoice({ choice, disabled, onPick }: { choice: DraftCardChoice; disabled: boolean; onPick: (pickId: string) => void }) {
  return <button type="button" disabled={disabled} onClick={() => onPick(choice.pickId)}>
    <strong>{choice.name}</strong><span>{choice.type}</span>
  </button>;
}

function SealedBuilder({
  view,
  selected,
  disabled,
  onToggle,
  onApply,
}: {
  view: SealedSeatView;
  selected: readonly string[];
  disabled: boolean;
  onToggle: (instanceId: string) => void;
  onApply: () => void;
}) {
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  return (
    <div className="limited-sealed-builder">
      <p>自分の60枚poolから30枚選択 · 現在 {selected.length}/30</p>
      <div className="limited-sealed-pool" aria-label="自分のSealed pool">
        {view.pool.map((card) => {
          const name = getCardDef(card.cardId).name;
          const checked = selectedSet.has(card.instanceId);
          return <label key={card.instanceId} className={checked ? "selected" : ""}>
            <input type="checkbox" checked={checked} disabled={disabled || (!checked && selected.length >= 30)} onChange={() => onToggle(card.instanceId)} />
            <span>{name}</span>
          </label>;
        })}
      </div>
      <button type="button" disabled={disabled || selected.length !== view.requiredSelectionCount} onClick={onApply}>
        この30枚でデッキを確定
      </button>
      {view.status === "deckReady" && <p role="status">自分の30枚デッキは確定済みです。CPUのpoolとデッキ内容は非公開です。</p>}
    </div>
  );
}

function draftStatus(view: DraftSeatView): string {
  if (view.status === "drafting") return `pick ${view.pickedCountBySeat.player}/30 · pack ${Math.min(3, Math.floor(view.packIndex / 2) + 1)}/3`;
  if (view.status === "deckReady") return "30枚デッキ完成";
  if (view.status === "battle") return "対局中";
  return "完了";
}

function sealedStatus(view: SealedSeatView): string {
  if (view.status === "deckbuilding") return `${view.pool.length}枚の自分のpool`;
  if (view.status === "deckReady") return "30枚デッキ完成";
  if (view.status === "battle") return "対局中";
  return "完了";
}

function toggle(values: readonly string[], value: string): readonly string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function winnerLabel(winner: "player" | "cpu" | "draw"): string {
  return winner === "draw" ? "引き分け" : winner === "player" ? "席1" : "席2";
}
