# White Planner Low-Stone Shield Target Tie Summary

生成: 2026-07-05

## 目的

白ミラーで「高価値だから守る」盾が、石1以下まで落ちる局面で盾対象を誤り、次ターンの手残りを悪化させる問題を確認した。盾全体の抑制ではなく、低石になる盾候補が僅差のときだけ、相手の返しを受けて次の自ターンに戻った盤面で対象を比較する。

## 実装

- `terminalPlanRolloutAllowShieldTargetTie` を追加。
- 白ミラー、盾後の石が1以下、盾候補がroot 12点以内で複数ある場合だけ発火。
- 盾対象tieではフルロールアウトではなく、次の自ターンまでの軽量handoff評価を使う。
- 通常の盾評価や、石2以上残る盾対象比較には入れない。

## 主要結果

- seed `994307` / `challenger-as-cpu`
  - 変更前: 基準white勝ち、315 steps / 28 turns、HP P6/C0。
  - 変更後: white_planner勝ち、297 steps / 28 turns、HP P0/C2。
  - step 102で `cpu_front_left` 盾から `cpu_front_right` 盾へ切り替わり、次自ターン評価が -138.8 から 64.2 へ改善。

- 近傍小母数 `994306-994309` / 両方向
  - 6-2-0、WPR 75%、avg HP margin +2.5。
  - 共通確認範囲では、994307 が両seatで white_planner 勝ち。
  - 最大思考 78.8s が出たため、次フェーズでは既存の通常rollout重さを別途監査する。

## 採否

採用候補。今回の改善は低石盾対象tieに限定され、盾全体の雑な抑制ではない。994307の負け筋を解消し、小母数でも勝率は良い。

残課題は、今回追加した盾tieよりも既存の通常rolloutで重いdecisionが残る点。次フェーズは強さを落とさずに通常rolloutの発火条件と最大stepを監査する。
