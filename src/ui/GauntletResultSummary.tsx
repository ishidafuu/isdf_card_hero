import type { GauntletSessionProgress } from "../sessions/types";

export function GauntletResultSummary({
  progress,
  seed,
  onReviewBattle,
  onCoachBattle,
}: {
  progress: GauntletSessionProgress;
  seed: number;
  onReviewBattle?: (stageIndex: number) => void;
  onCoachBattle?: (stageIndex: number, seat: "player" | "cpu") => void;
}) {
  if (!progress.completedBattles.length) return null;
  return (
    <section className="gauntlet-result-summary" aria-labelledby="gauntlet-results-title" data-testid="gauntlet-result-summary">
      <h3 id="gauntlet-results-title">Gauntlet結果 · {progress.completedBattles.length}/3</h3>
      <ol>
        {progress.completedBattles.map(({ result }, index) => (
          <li key={`${index}_${result.headHash}`}>
            <strong>第{index + 1}戦 · Seed {seed + index}</strong>
            <span>{winnerLabel(result.winner)} · {result.turns} turns</span>
            {onReviewBattle && <button type="button" onClick={() => onReviewBattle(index)}>この対局を振り返る</button>}
            {onCoachBattle && <>
              <button type="button" onClick={() => onCoachBattle(index, "player")}>席1のコーチ分析</button>
              <button type="button" onClick={() => onCoachBattle(index, "cpu")}>席2のコーチ分析</button>
            </>}
          </li>
        ))}
      </ol>
      {progress.status === "completed" && <p role="status">3戦すべて完了しました。</p>}
    </section>
  );
}

function winnerLabel(winner: "player" | "cpu" | "draw"): string {
  return winner === "draw" ? "引き分け" : winner === "player" ? "席1の勝ち" : "席2の勝ち";
}
