# White Planner Front Reach Retreat Summary

生成: 2026-07-07
deck: `master-lab-white-1377-death-sheep3`
対象: 白ミラー中盤の射程持ち前衛退避

## 目的

`994335 challenger-as-cpu` の負けでは、こちらに Lv3 真勇者ダインがいる中盤で、前列に出ているヤンバルを後列へ戻さず、後列枠を召喚で埋めていた。

forced branch では、この後列召喚が負け分岐で、ヤンバルを後列へ戻す分岐が勝ち分岐だった。

## 実装方針

白ミラー限定で、以下の条件を満たす時だけ、後列召喚より射程持ち前衛の後列退避を優先する。

- 中盤 `turnNumber 10-14`。
- 後列空きが1枠だけ。
- fallback が後列召喚で、その空き枠を埋める。
- こちらに別の Lv3 前衛エースがいる。
- 退避候補は前列の射程持ち/複数行動持ち。
- 相手に次ターンの後衛圧、または高レベル前衛圧が残っている。
- root 評価差が 120 点以内。

狙いは、Lv3主軸の横で働ける射程持ちを温存し、後列枠を安易に召喚で潰さないこと。

## 分岐確認

forced branch:

- `docs/master_lab/results/2026-07-07_white_planner_994335_cpu_turn12_forced_branch.md`

### step 152

| selected | decision | winner | final score |
| --- | --- | --- | ---: |
| Y | `summon:ドノマンティス->cpu_back_left` | white | -1000000 |
|  | `move:cpu_front_left->cpu_back_left` | white_planner | 1000000 |

selected rank は 6、bestVsSelectedScoreDelta は 2000000。

### step 153

| selected | decision | winner | final score |
| --- | --- | --- | ---: |
| Y | `end_turn` | white | -1000000 |
|  | `attack:ヤンバル:wild_claw->ピグミィ` | white_planner | 1000000 |
|  | `focus:ヤンバル` | white_planner | 1000000 |

step152 でヤンバルを退避できていれば、後続の仕事が残る。

## 実trace確認

trace:

- before: `docs/master_lab/results/2026-07-07_white_planner_trace_994335_cpu_after_late_face_hold.md`
- after: `docs/master_lab/results/2026-07-07_white_planner_trace_994335_cpu_front_reach_retreat_after_fix.md`

| seed | direction | before | after | max decision after |
| ---: | --- | --- | --- | ---: |
| 994335 | challenger-as-cpu | white win | white_planner win | 6010.6ms |

修正後の該当step:

| step | decision | reason |
| ---: | --- | --- |
| 152 | `move:cpu_front_left->cpu_back_left` | 白ミラー中盤: 後列枠を召喚で埋める前に射程持ち前衛を下げ、Lv3主軸の横の仕事を残す |

## スモーク結果

### 新seed帯

report:

- `docs/master_lab/results/2026-07-07_white_planner_front_reach_retreat_new_smoke_994334_994337.md`

| seeds | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision | max decision |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 994334-994337 x both directions | 7-1-0 | 87.5% | +4.25 | 231.8 | 21.6 | 1244.9ms | 210618.8ms |

今回の2修正前は同seed帯が 5-3、非リーサル顔打点抑制後は 6-2、今回の射程持ち前衛退避後は 7-1。

### 既知seed帯

report:

- `docs/master_lab/results/2026-07-07_white_planner_front_reach_retreat_known_smoke_994330_994333.md`

| seeds | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision | max decision |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 994330-994333 x both directions | 8-0-0 | 100% | +6.63 | 227.3 | 22.1 | 729.7ms | 7582.5ms |

既知seed帯は崩れていない。

## 所感

今回の改善は、白ミラーの「盤面制圧優先」をかなり具体的に拾えている。

特に重要なのは、後列枠を単なる召喚先として使うのではなく、既に盤面にいる射程持ちを継続的に働かせる資源として扱えた点。これはユーザー指摘の「後列に前衛を置く/後列枠を潰す問題」と同じ系統で、デッキ内の後衛・射程持ちを活かすには重要な改善。

一方で `994334 challenger-as-cpu` はまだ負けており、最大decision 210秒級の長考も残っている。次は勝率改善より先に、このseedの長考箇所と負け筋を分離した方がよい。

## 次の改善候補

1. `994334 challenger-as-cpu` の最大decision 176-210秒級の局面を切り出す。
2. その局面で上位候補が実質同値なら、探索枝刈り/候補数制限で速度改善する。
3. 勝ち分岐がある場合のみ、今回同様に forced branch で確認して狭く採用する。

