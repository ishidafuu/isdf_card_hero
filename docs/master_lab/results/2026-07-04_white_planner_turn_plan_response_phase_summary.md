# White Planner Turn Plan Response Phase Summary

生成: 2026-07-04

## 目的

白ミラー `1377 death-sheep3` 基準で、係数追加ではなく「ターンプラン探索 + 相手応答読み」に移るための次フェーズを進めた。

今回は AI 本体の挙動を変える前に、以下を確認した。

- 強制分岐で勝ち候補が実在する局面を探す。
- その局面を既存 terminal plan がどう評価しているかを見る。
- 採用ゲートを緩めれば拾えるのか、探索深さ/幅を増やせば自然に拾えるのかを確認する。

## 追加した検証口

### `audit:white-planner-forced-branch-scan`

複数 seed / turn 範囲から planner 側の意思決定局面を抜き出し、root 候補を強制して最後まで流すスキャン。

用途:

- 局所評価だけではなく、最終勝敗が覆る候補を探す。
- 勝ち筋が見える局面だけを次の実装候補にする。

### `audit:white-planner-turn-plan-response`

指定 step の root 候補について、以下を Markdown / JSON に出す監査。

- fallback の通常評価手。
- terminal plan の選択候補。
- root 後盤面。
- 自ターン終局面。
- 相手応答後盤面。
- own delta / opponent delta / response score / planner score。
- terminal plan が採用されたか、採用ゲートで落ちたか。

追加で `--rollout-steps` を指定すると、各 root 候補を強制した後に通常AIへ戻して指定 steps まで流し、rollout winner / rollout score / final board も同じ表に出す。

## 強制分岐で見えた候補

対象:

- `seed 994306`
- `challenger-as-player`
- `step 83`

現行AIは `player_front_right -> player_back_left` の退避を選ぶ。

強制分岐では、以下の候補が最終勝敗を反転した。

| candidate | result |
| --- | --- |
| `summon:ボムゾウ->player_back_right` | white_planner 勝ち |
| `summon:ドノマンティス->player_back_left` | white_planner 勝ち |
| `summon:ドノマンティス->player_back_right` | white_planner 勝ち |

一方で `summon:ボムゾウ->player_back_left` は勝ち筋にならない。
つまり「退避より後列補強」だけでなく、左右レーン差まで見る必要がある。

## 後列補強ヒューリスティックの扱い

強制分岐を受けて、白ミラーで後列補強を加点する候補を試した。

結果:

| candidate | local result | medium result | judgment |
| --- | --- | --- | --- |
| broad backline reinforcement | `994306 player` は反転 | `994305-994306 both` で 1-3 | 不採用 |
| narrowed min | `994306 player` は反転 | `994305-994306 both` で 1-3 | 不採用 |
| leveled narrow | `994305-994306 both` で 3-1 | `994300-994306 both` で 10-4 | 不採用 |

`leveled narrow` は総合 10-4 だが、直近基準の 10-4 と勝率自体は伸びていない。
さらに CPU 側が 5-2 相当から 3-4 に落ちたため、ユーザーが対戦するCPUとしては悪化。

判断:

- AI 本体には採用しない。
- 強制分岐で見えた概念は、ヒューリスティックではなく rollout / terminal評価改善へ回す。

## Terminal Plan Response Audit

### current search

`2026-07-04_white_planner_turn_plan_response_994306_step83.md`

| rank | decision | root | own | opponent | response | planner |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | `summon:ボムゾウ->player_back_left` | 87.8 | 143.4 | 52.4 | 97.9 | 117.2 |
| 2 | `summon:ボムゾウ->player_back_right` | 87.8 | 143.4 | 52.4 | 97.9 | 117.2 |
| 3 | `move:player_front_right->player_back_left` | 112.0 | 125.0 | 56.4 | 90.7 | 115.3 |

観察:

- terminal plan 上は召喚が退避より少し良い。
- ただし `back_left` と `back_right` が完全同点。
- 採用ゲートでは root score gap と互換性制約により不採用。
- ここで単に採用ゲートを緩めると、勝てない `back_left` を選びやすい。

### terminal depth 6 / width 3 / opponent 2x2

`2026-07-04_white_planner_turn_plan_response_994306_step83_t6w3_o2w2.md`

| rank | decision | root | own | opponent | response | planner |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | `move:player_front_left->player_back_right` | 108.0 | 125.0 | 5.4 | 65.2 | 89.0 |
| 2 | `summon:ボムゾウ->player_back_left` | 87.8 | 143.4 | 1.4 | 66.9 | 86.2 |
| 5 | `summon:ボムゾウ->player_back_right` | 87.8 | 183.2 | 13.4 | 45.4 | 64.8 |

観察:

- 深さ/幅を少し増やしても、勝ち候補の `back_right` は上がらない。
- 相手応答後の評価でむしろ下がる。

### terminal depth 7 / width 4 / opponent 3x3

`2026-07-04_white_planner_turn_plan_response_994306_step83_t7w4_o3w3.md`

| rank | decision | root | own | opponent | response | planner |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | `move:player_front_right->player_back_left` | 112.0 | 278.0 | 278.0 | 278.0 | 302.6 |
| 2 | `summon:ボムゾウ->player_back_left` | 87.8 | 273.2 | 130.6 | 168.1 | 187.4 |
| 3 | `summon:ボムゾウ->player_back_right` | 87.8 | 273.2 | 130.6 | 168.1 | 187.4 |

観察:

- さらに深くすると、planner も fallback の退避を選ぶ。
- 勝ち候補の左右差は解けない。
- 既存 terminal plan の短期終局面評価だけでは、強制分岐の最終勝敗差を説明できない。

### current search + rollout 160

`2026-07-04_white_planner_turn_plan_response_rollout_994306_step83.md`

| rank | decision | terminal planner | rollout | rollout score |
| ---: | --- | ---: | --- | ---: |
| 1 | `summon:ボムゾウ->player_back_left` | 117.2 | unresolved | -570.0 |
| 2 | `summon:ボムゾウ->player_back_right` | 117.2 | unresolved | -277.2 |
| 3 | `move:player_front_right->player_back_left` | 115.3 | white | -1000000 |

観察:

- 160 steps では `back_right` も勝ち切らないが、`back_left` との差は明確に出た。
- terminal plan では同点だった左右差を、rollout score は区別できている。
- 強制分岐 260 steps では `back_right` が勝ちまで届いていたため、rollout を候補選定に混ぜる方向は有望。

## 結論

今回のフェーズでは、AI挙動の mainline 変更は行わない。

理由:

- 強制分岐では勝ち候補が実在する。
- しかし既存 terminal plan はその候補を安定して上位化できない。
- 採用ゲートを緩めると、勝てない同点候補を拾う危険がある。
- 深さ/幅を上げても、勝ち候補の左右差は出なかった。

次に進むべき方向:

1. root 候補を terminal score だけで選ばず、短い rollout score を併用する。
2. rollout は全候補ではなく、terminal plan 上位 + fallback + forced branch で差が出やすい候補だけに限定する。
3. rollout の評価は「数ターン後の評価値」ではなく、可能なら勝敗 / HP差 / 盤面崩壊 / 山札レースを分けて記録する。
4. 採用はすぐ mainline に入れず、まず `white_planner_rollout` 相当の実験プロファイルまたは監査スクリプトで検証する。

次フェーズ提案:

- rollout 候補を上位3件程度へ絞るオプションを足す。
- `994306 step83` で rollout score 上位の候補を実際に採用した場合の小母数を確認する。
- その後、`994300-994306` の負け/警告局面へ同じ rollout 監査を広げる。
