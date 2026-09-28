import { useEffect, useState } from "react";
import type { PlayerId } from "../game/types";
import type { PostgameCoachReport } from "../sessions/coach";
import type { CpuAiProfiles } from "../game/cpuAiTypes";
import type { SessionControllers } from "../sessions/types";
import type { BattleJournalOperationStatus } from "./BattleJournalPanel";
import { JournalOperationNotice } from "./BattleJournalPanel";
import { BranchSessionSetup } from "./BranchSessionSetup";

interface PostgameCoachPanelProps {
  report?: PostgameCoachReport;
  seat: PlayerId;
  message: string;
  operation?: BattleJournalOperationStatus;
  workerError?: string;
  onCancel: () => void;
  onReviewObservation: (cursor: number) => void;
  branchDefaults?: { controllerBySeat: SessionControllers; profiles: CpuAiProfiles };
  onStartBranch?: (cursor: number, controllers: SessionControllers, profiles: CpuAiProfiles) => void;
}

export function PostgameCoachPanel({
  report,
  seat,
  message,
  operation,
  workerError,
  onCancel,
  onReviewObservation,
  branchDefaults,
  onStartBranch,
}: PostgameCoachPanelProps) {
  const [branchCursor, setBranchCursor] = useState<number | undefined>();
  useEffect(() => {
    setBranchCursor(undefined);
  }, [report?.verifiedHeadHash]);

  return (
    <section className="zone-panel postgame-coach-panel" aria-busy={Boolean(operation)}>
      <div className="zone-panel-heading">
        <div>
          <h3>対局コーチ · {seat === "player" ? "席1" : "席2"}</h3>
          <p>検証済みの対局記録と公開局面から作る振り返りです。</p>
        </div>
      </div>
      {operation && <JournalOperationNotice operation={operation} onCancel={onCancel} />}
      {workerError && <p className="battle-journal-error" role="alert">{workerError}</p>}
      {message && <p className="battle-journal-message" role="status">{message}</p>}
      {!report ? (
        operation ? <p className="empty-zone">完了Journalを検証して振り返りを準備しています。</p>
          : workerError ? null
            : message ? <p className="empty-zone">分析は完了していません。再度振り返りを開始してください。</p>
              : <p className="empty-zone">完了した対局の振り返りを選んでください。</p>
      ) : (
        <>
          <div className="coach-report-summary" role="status">
            <strong>勝者: {report.winner === "draw" ? "引き分け" : report.winner === "player" ? "席1" : "席2"}</strong>
            <span>確認した行動 {report.sampledCommandCount}件 / 判断・操作記録あり {report.reviewedCommandCount}件</span>
          </div>
          {report.observations.length > 0 ? (
            <ol className="coach-observation-list">
              {report.observations.map((observation) => (
                <li key={observation.commandSequence}>
                  <div>
                    <strong>Turn {observation.turnNumber} · 行動 {observation.commandSequence}</strong>
                    <span>{Object.entries(observation.action).map(([key, value]) => `${key}: ${String(value)}`).join(" · ")}</span>
                    <span>{formatPublicFactDelta(observation)}</span>
                    {observation.review?.kind === "ai" && observation.review.recordedReason
                      ? <span>記録時の説明: {observation.review.recordedReason}</span>
                      : observation.review && <span>記録操作があります。</span>}
                  </div>
                  <button type="button" onClick={() => onReviewObservation(observation.replayLink.cursorBefore)}>
                    この行動前の盤面を見る
                  </button>
                  {onStartBranch && <button type="button" onClick={() => setBranchCursor(observation.replayLink.cursorBefore)}>
                    この行動前から分岐
                  </button>}
                </li>
              ))}
            </ol>
          ) : <p className="empty-zone">この席には記録済みの行動がありません。</p>}
          {report.heuristics.length > 0 && (
            <section className="coach-heuristics">
              <h4>確認候補（ヒューリスティック）</h4>
              <ul>{report.heuristics.map((item, index) => <li key={`${item.commandSequence}_${index}`}>{item.text}</li>)}</ul>
            </section>
          )}
          {branchCursor !== undefined && onStartBranch && (
            <BranchSessionSetup
              cursor={branchCursor}
              defaults={branchDefaults ?? { controllerBySeat: { player: "human", cpu: "cpu" }, profiles: { player: "white_v2", cpu: "white_v2" } }}
              onStart={onStartBranch}
              onCancel={() => setBranchCursor(undefined)}
            />
          )}
          <p className="coach-caveat">{report.caveat}</p>
        </>
      )}
    </section>
  );
}

function formatPublicFactDelta(observation: PostgameCoachReport["observations"][number]): string {
  const own = observation.actorSeat;
  const opponent = own === "player" ? "cpu" : "player";
  const beforeOwn = observation.before.masters[own];
  const afterOwn = observation.after.masters[own];
  const beforeOpponent = observation.before.masters[opponent];
  const afterOpponent = observation.after.masters[opponent];
  return `公開事実: 自席HP ${beforeOwn.hp}→${afterOwn.hp} / 相手HP ${beforeOpponent.hp}→${afterOpponent.hp} / stone ${beforeOwn.stones}→${afterOwn.stones} / 盤面 ${observation.before.board.length}→${observation.after.board.length}体`;
}
