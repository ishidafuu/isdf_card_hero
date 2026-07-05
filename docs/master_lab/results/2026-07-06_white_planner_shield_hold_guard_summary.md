# White Planner Shield Hold Guard Summary

生成: 2026-07-06
deck: `master-lab-white-1377-death-sheep3`
対象: 白対白、終盤山札raceでの過剰シールド

## 結論

- 残っていた固定負け `994316 / challenger-as-player` は、終盤のシールドで石を使い切り、山札raceの詰めを落としていた。
- 最終勝敗まで読むロールアウト案は `994316` を勝ちに変えたが、最大思考時間が約41秒まで伸び、固定ベンチでも重すぎたため不採用。
- 採用したのは軽量guard。白ミラー終盤で、盾を張ると石が1以下になり、HPで1点だけ負けている山札raceでは、root差が許容範囲なら `end_turn` を優先する。

## forced branch

`2026-07-06_white_planner_994316_forced_branch_focus.md`

| step | turn | selected | best branch | result |
| ---: | ---: | --- | --- | --- |
| 192 | 16 | `shield player_back_right` | `shield player_front_right` / `end_turn` | 勝敗反転 |
| 222 | 18 | `shield player_front_right` | `end_turn` | 勝敗反転 |
| 278 | 23 | `shield player_front_left` | なし | 反転なし |
| 293 | 25 | `shield player_front_right` | `end_turn` | 勝敗反転 |
| 306 | 29 | `attack ヤンバル -> ダイン` | なし | 反転なし |

実装対象は `step 222` 相当へ絞った。`step 192` は山札10で早く、`step 293` は `step 222` を直せば到達しない負け筋だったため、広げすぎない。

## 実装

- `white_planner` / `white_rollout` に `terminalPlanAllowShieldHoldEndTurn` を追加。
- `chooseCpuDecision` の通常評価後、terminal plan 探索へ入る前に軽量guardを挟む。
- 発火条件:
  - 白対白。
  - turn 18 以降。
  - 両者山札8枚以下、山札差1以内。
  - 自分HPが相手HPより低いが、差は1以内。
  - fallback が自分モンスターへのシールド。
  - シールド後の石が1以下。
  - 相手の次ターン最大マスター打点が現在HPに届いていない。
  - `end_turn` とのroot評価差が300以内。

## 結果

### 対象trace

`2026-07-06_white_planner_trace_994316_player_after_shield_hold_guard.md`

- winner: `white_planner`
- final: turn 27、HP player/cpu `4/0`
- max decision: `15789.6ms`
- step 222: `end_turn`
- reason: `白ミラー終盤: 盾で石が1以下になり山札raceの詰めを落とすため見送り`

修正前の `2026-07-06_white_planner_trace_994316_player_loss_current.md` は turn 30、HP `0/1` で負け。

### 対象ベンチ

`2026-07-06_white_planner_shield_hold_guard_target_benchmark/benchmark-summary.json`

| seed | direction | result | steps | turns | issue |
| ---: | --- | --- | ---: | ---: | --- |
| 994316 | challenger-as-cpu | white_planner | 218 | 20 | 0F/0W |
| 994316 | challenger-as-player | white_planner | 300 | 27 | 0F/1W |

合計: `2-0-0`、0 failures / 1 warning。

### 固定セット確認

`994314-994317` の広い固定セットは、CPU側 `4-0` と player側 `994314` 勝ちまでは確認したが、player側 `994315` が長時間化したため中断した。これは今回のguard由来ではなく、既存の白ミラー長期戦探索コストとして別課題に分ける。

## 検証

- `npm run build`
- `npm test -- tests/game/cpuAi.test.ts`

## 次の課題

- 勝率改善とは別に、白ミラー長期戦の探索枝削減を進める。
- 特に固定ベンチの `994315 / challenger-as-player` は、勝敗よりも思考時間・長期戦警告の監査対象にする。
