# White Planner Late No-Stone Face Hold Summary

生成: 2026-07-07
deck: `master-lab-white-1377-death-sheep3`
対象: 白ミラー終盤の非リーサル顔打点抑制

## 目的

`994336 challenger-as-cpu` の負けでは、終盤に石0の状態からポリスピナーで相手マスターへ非リーサル1点を入れ、相手に石を渡したあと反撃を許していた。

白ミラーでは、相手前衛脅威が残っている終盤に「倒し切れない顔打点」で相手の石を増やすと、盤面制圧と山札raceの両方で損になる場合がある。今回はこの局面だけを狭く抑制し、顔打点全体を弱めないことを狙った。

## 実装方針

- 白ミラー限定。
- 終盤 `turnNumber >= 18` 限定。
- 自分の石が0。
- 双方の山札が8枚以下。
- fallback が相手マスターへの非リーサル攻撃。
- 攻撃後も相手HPが4以上残る。
- 攻撃で相手の石が増える。
- こちらがHPで最低1以上優位。
- 相手前衛の形成脅威が高い。
- 上記を満たし、`end_turn` のroot評価差が許容内なら、攻撃せずターン終了を選ぶ。

## 分岐確認

forced branch:

- `docs/master_lab/results/2026-07-07_white_planner_994336_cpu_turn18_forced_branch.md`
- 対象: `seed 994336 / challenger-as-cpu / step 203`

結果:

| step | 選択 | 結果 |
| ---: | --- | --- |
| 203 | `attack:ポリスピナー:attack->player master` | loss |
| 203 | `end_turn` | win |
| 203 | `focus:ポリスピナー` | win |
| 203 | `move:cpu_back_left->cpu_front_right` | win |

このため、該当局面は「顔打点を入れること自体が負け筋」で、`end_turn` が明確な勝ち分岐だった。

## 実trace確認

trace:

- `docs/master_lab/results/2026-07-07_white_planner_trace_994336_cpu_late_face_hold_after_terminal_gap500.md`

修正後:

| seed | direction | 結果 | steps | turns | max decision |
| ---: | --- | --- | ---: | ---: | ---: |
| 994336 | challenger-as-cpu | white_planner win | 234 | 23 | 2544.3ms |

該当step:

| step | before | after |
| ---: | --- | --- |
| 203 | `attack:ポリスピナー:attack->player master` | `end_turn` |

reason:

`白ミラー終盤: 石0で相手に石を渡す非リーサル顔打点を見送り、盤面と山札raceを優先`

## スモーク結果

### 既知seed帯

report:

- `docs/master_lab/results/2026-07-07_white_planner_late_face_hold_known_smoke_994330_994333.md`

| seeds | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision | max decision |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 994330-994333 x both directions | 8-0-0 | 100% | +6.63 | 227.3 | 22.1 | 731.8ms | 7580.8ms |

直前の良好な既知seed帯は崩れていない。

### 新seed帯

注意:

- `994334-994337` の正式summaryは、実行終了直前の interrupt 入力によりファイル出力されなかった。
- ただし標準出力で8戦分の個別結果は取得済み。

手動集計:

| direction | seed | result | steps | turns | HP | candidate margin |
| --- | ---: | --- | ---: | ---: | --- | ---: |
| challenger-as-cpu | 994334 | white | 197 | 16 | P5/C0 | -5 |
| challenger-as-cpu | 994335 | white | 268 | 22 | P5/C0 | -5 |
| challenger-as-cpu | 994336 | white_planner | 234 | 23 | P0/C6 | +6 |
| challenger-as-cpu | 994337 | white_planner | 175 | 17 | P0/C4 | +4 |
| challenger-as-player | 994334 | white_planner | 207 | 17 | P6/C0 | +6 |
| challenger-as-player | 994335 | white_planner | 325 | 27 | P6/C0 | +6 |
| challenger-as-player | 994336 | white_planner | 249 | 26 | P8/C0 | +8 |
| challenger-as-player | 994337 | white_planner | 203 | 18 | P4/C0 | +4 |

| seeds | W-L-D | WPR | avg HP margin | avg steps | avg turns |
| --- | ---: | ---: | ---: | ---: | ---: |
| 994334-994337 x both directions | 6-2-0 | 75% | +3.00 | 232.3 | 20.8 |

以前の同seed帯は 5-3 だったため、今回の修正で `994336 challenger-as-cpu` が反転し、+1勝になった。

## 所感

体感では、現状の白AIは「盤面制圧を優先しつつ、終盤の勝ち切り/負け回避を読みで拾う」段階に入っている。

今回の改善は大きな係数追加ではなく、forced branch で勝ち分岐が確認できた局面だけを拾っているため、強さの伸びとしては信用しやすい。一方で、`994334` と `994335 challenger-as-cpu` はまだ落としており、別系統の負け筋が残っている。

## 次の改善候補

1. `994334 challenger-as-cpu` の負けtraceを切り出す。
2. `994335 challenger-as-cpu` の負けtraceを切り出す。
3. `994335 challenger-as-player` の長考箇所を確認し、探索爆発の原因を分離する。
4. 改善候補は、顔打点抑制のような係数ではなく、forced branch で勝ち分岐が出た局面だけを狭く採用する。

