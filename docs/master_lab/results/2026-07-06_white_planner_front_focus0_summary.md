# White Planner Front Focus Rollout 0 Summary

生成: 2026-07-06

## 目的

白ミラーの `white_planner` は勝率面では改善しているが、一部の判断が15-20秒級まで伸びていた。
今回は、強さを維持したまま「前衛の気合を剥がす攻撃を確認する追加rollout」を削れるか確認した。

## 現状の強さ指標

変更前の同seed帯では `white_planner` vs `white` が 22-10、WPR 68.75%。
今回の `terminalPlanRolloutFrontFocusStripAttackSteps: 0` 後も同じ 22-10、WPR 68.75% で、勝率は維持した。

| 条件 | 勝敗 | inspected events | 平均判断 | 最大判断 |
| --- | ---: | ---: | ---: | ---: |
| front focus steps 6 | 22-10 | 44 | 692.2ms | 20862.2ms |
| front focus steps 0 | 22-10 | 35 | 667.3ms | 15760.0ms |

体感としては、代表的な20秒級の山は削れた。
特に `994330 challenger-as-player` は単体traceで最大 20.5秒級から 5.7秒級まで落ち、勝ちも維持した。

## 採用内容

- `white_planner` / `white_rollout` の `terminalPlanRolloutFrontFocusStripAttackSteps` を `6` から `0` に変更。
- 前衛気合剥がし攻撃は候補としては残すが、その候補専用の追加rollout確認は行わない。

## 確認したこと

代表seed:

| seed | direction | 結果 | max decision |
| ---: | --- | --- | ---: |
| 994330 | challenger-as-player | 勝ち維持 | 5728.1ms |
| 994329 | challenger-as-player | 勝ち維持 | 5042.3ms |
| 994324 | challenger-as-cpu | 勝ち維持 | 15764.3ms |

guard seed:

| seed | direction | front0結果 | 補足 |
| ---: | --- | --- | --- |
| 994306 | challenger-as-player | 勝ち維持 | 最大 2616.7ms |
| 994311 | challenger-as-player | 敗戦のまま | もともと勝ち反転ではなくHP差改善止まりだったseed |
| 994309 | challenger-as-cpu | 敗戦のまま | 現行front6でも同じ敗戦・37秒級。front0固有の悪化ではない |

## 残課題

front focus strip は今回で削れたが、まだ13-15秒級の判断は残っている。
上位イベントは、前衛気合剥がしではなく、終盤の攻撃候補に対する通常rollout確認が中心だった。

| seed | direction | 最大判断 | 代表判断 |
| ---: | --- | ---: | --- |
| 994320 | challenger-as-player | 15760.0ms | ポリスピナーで前衛を攻撃 |
| 994328 | challenger-as-player | 14686.0ms | ポリスピナーで前衛を攻撃 |
| 994324 | challenger-as-cpu | 14245.4ms | ピグミィで真勇者ダインを攻撃 |
| 994321 | challenger-as-player | 13677.2ms | ピグミィでボムゾウを攻撃 |

これらは `selected == fallback` かつ `rolloutScoreGapToFallback == 0` が多く、最終判断を変えていない確認rolloutがまだ重い。
次は「選択を変えない終盤rolloutを同一ターン内で省略またはキャッシュする」方向がよい。

## 次ループ提案

1. 終盤攻撃rolloutのうち、`selected == fallback` かつ gap 0 の確認だけをスキップできるか検証する。
2. 同一ターン内で同じ候補 after state を複数回rolloutしていないか、state key でキャッシュ監査する。
3. `994320 / 994328 / 994324 / 994321` の4 seedを代表として、勝ち維持と最大判断短縮を確認する。
4. 32戦マトリクスは、候補が代表seedで勝ちを落とさないことを確認してから回す。
