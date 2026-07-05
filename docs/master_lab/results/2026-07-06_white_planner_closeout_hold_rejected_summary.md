# White Planner Closeout Hold Rejected Summary

生成: 2026-07-06
deck: `master-lab-white-1377-death-sheep3`
対象: 白対白、終盤の詰めろ維持判断

## 結論

- 現行AIには「相手マスターHPを2まで詰めた後、勝ち筋を維持するだけでよい局面で余計な攻撃/マジックを打つ」負け筋がある。
- `994317 / challenger-as-cpu / step 191` では、現行選択の `attack:ピグミィ:attack->真勇者ダイン` は最終的に負け、`end_turn` は次ターン勝ちだった。
- ただし、「終盤の非進行攻撃/非進行マジックを広く抑制する」実験は `994317` を救えた一方で、直前に勝っていた `994314` と `994315` を落としたため不採用とする。
- 次は係数や広い禁止ではなく、ターンプラン探索/強制分岐で勝ち切りが確認できた局面だけを狭く採用する。

## 現行確認

`2026-07-06_white_planner_current_probe_994314_994317.md`

| seed | direction | result | HP |
| ---: | --- | --- | --- |
| 994314 | challenger-as-cpu | white_planner | P0/C2 |
| 994315 | challenger-as-cpu | white_planner | P0/C2 |
| 994316 | challenger-as-cpu | white_planner | P0/C4 |
| 994317 | challenger-as-cpu | white | P2/C0 |
| 994314 | challenger-as-player | white_planner | P7/C0 |
| 994315 | challenger-as-player | white_planner | P9/C0 |
| 994316 | challenger-as-player | white | P0/C1 |
| 994317 | challenger-as-player | white_planner | P6/C0 |

合計は `6-2-0 / WPR 75%`。悪い負けではなく、限定的な終盤判断の取りこぼしとして扱う。

## 負け筋

`2026-07-06_white_planner_trace_994317_cpu_loss_current.md`

問題局面は turn 17、CPU側 white_planner、HP `cpu/player = 6/2`。

- step 189: `attack:ヤンバル:wild_claw->player master`
- step 190: `attack:デスシープ:attack->player master`
- step 191: `attack:ピグミィ:attack->真勇者ダイン`
- step 192: `magic:ワープ->monster:player_front_left`
- step 193: `end_turn`

step 190 時点で相手HP2まで詰めている。ここから相手盤面処理に寄っても勝ち切れず、ワープで石を使った結果、最終的に白側へ逆転されている。

## 強制分岐

`2026-07-06_white_planner_994317_step191_forced_branch.md`

| rank | decision | winner | final score |
| ---: | --- | --- | ---: |
| 1 | `magic:ワープ->monster:player_front_left:monster:player_back_left` | white | -1000000 |
| 2 | `magic:ワープ->monster:player_back_left:monster:player_front_left` | white | -1000000 |
| 3 | `attack:ピグミィ:attack->真勇者ダイン` | white | -1000000 |
| 4 | `end_turn` | white_planner | 1000000 |

root評価では `end_turn` が低いが、実際のリプレイでは `end_turn` だけが勝ち。ここは「盤面評価を上げる手」より「勝ち筋を壊さず渡す手」が正しい。

## 却下した実験

広い closeout 抑制として、以下を試した。

- 終盤で相手HP2以下のとき、致死回避にならない0ダメージ攻撃を抑制
- 終盤で相手HP2以下のとき、敵数を減らさず、マスター打点にもならず、脅威軽減にもならないマジックを抑制
- closeout hold 用の end_turn ロールアウト候補追加

この実験により `994317` は勝ちに反転したが、同じ `994314-994317` の再確認で `994314` と `994315` の CPU側勝ちが落ちた。よってこのままの抑制は広すぎる。

## 次の実装条件

次に試す場合は、以下の条件をすべて満たす局面に限定する。

- 白対白である。
- 相手マスターHPが2以下である。
- 現在の手で即リーサルはないが、次自ターンの顔打点が見えている。
- 候補手が敵撃破、致死回避、明確なマスター打点、次ターン打点源の保護に変換されていない。
- `end_turn` または保護手が強制分岐/短いロールアウトで勝ち、現行選択が負けることを確認できる。

採用判定は `994317` を救うだけでは不十分。最低でも `994314` と `994315` の CPU側勝ちを維持してから、小母数へ進める。

## 次ループ

1. `994317 / step 191` で end_turn/保護手を比較する専用監査を追加する。
2. closeout 抑制をスコア係数ではなく、ロールアウトで勝敗差が出た場合だけ root 選択へ昇格する形にする。
3. `994314-994317 / challenger-as-cpu` を最小退行セットとして使う。
4. 退行なしなら `challenger-as-player` も含めた小母数に広げる。
