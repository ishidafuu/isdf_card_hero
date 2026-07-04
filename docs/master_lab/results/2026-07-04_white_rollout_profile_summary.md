# White Rollout Profile Summary

生成: 2026-07-04

## 目的

係数を追加して即時評価をいじるのではなく、白ミラーの終盤寄り局面で「最終盤面候補をいくつか作り、その後の相手応答も含めて短く自動進行し、良い候補を選ぶ」方向を検証した。

## 実装

- `white_rollout` プロファイルを追加。
- `white_planner` のターンプラン探索をベースに、terminal plan 上位候補と fallback 候補だけを短く rollout する。
- rollout はネストしない。rollout 内では rollout 機能を無効化して、再帰的に重くならないようにした。
- 採用対象を絞るため、次の条件を満たす局面だけ rollout する。
  - turn 6-10
  - 相手ストーン 1 以下
  - fallback の即時root評価が planner 候補より 120 点以上高い
  - terminal planner 上では planner 候補と fallback が 40 点以内
- rollout score が fallback を 200 点以上上回る場合は、通常の root score gap gate を超えて採用可能にした。

## 主要確認局面

対象: `seed 994306 / challenger-as-player / step 83 / turn 8`

元の問題は、即時評価では `move:player_front_right->player_back_left` が高く、白ミラーの最終盤面としては `summon:ボムゾウ->player_back_right` の方が勝ち筋に接続する局面だった。

| 設定 | 選択 | 判定 |
| --- | --- | --- |
| rollout 40手 | `summon:ボムゾウ->player_back_left` | 失敗。左右差を取り違えた |
| rollout 50手 | `summon:ボムゾウ->player_back_left` | 失敗。まだ読みが浅い |
| rollout 60手 | `summon:ボムゾウ->player_back_right` | 成功 |
| rollout 80手 | `summon:ボムゾウ->player_back_right` | 成功 |

60手が最小の成功ラインだったため、`white_rollout` の初期値は 60手にした。

## 小母数結果

`rollout3_60_w015_gap200`

| 対象 | W-L-D | 平均HP差 | 平均手数 | 平均ターン | 平均decision ms | 最大decision ms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| seeds 994305-994306 / 両方向 | 4-0-0 | +4.5 | 268 | 25.5 | 1949.9 | 138216 |

実プロファイル `white_rollout` でも、既知の負け seed である `994306 / challenger-as-player` は勝利。

- winnerProfile: `white_rollout`
- steps: 281
- turns: 27
- HP: player 5 / cpu 0
- issueCount: 0
- warningCount: 0

## 判断

強さの方向性は当たり。少なくとも、これまで `white_planner` が落としていた 994306 の白ミラー局面を修正できた。

一方で、最大 decision time が 138 秒まで伸びている。実プレイで「1ターン1分程度は許容」という前提でも、現状のまま全局面で使うには重い。したがって、`white_planner` は軽量な通常プロファイルとして残し、`white_rollout` は高思考・実験用の最強候補として分離する。

## 次フェーズ

次は強さをさらに上げるより、同じ読み筋を安定して使えるように軽量化する。

- rollout 対象局面の gate をさらに監査し、無駄な発火を減らす。
- rollout 内の state 評価結果を memoize し、同一枝の再評価を減らす。
- 最大 decision time を抑える hard budget を入れる。
- 軽量化後に 994300-994306 の14戦を再実行し、`white_planner` からの純増を確認する。
