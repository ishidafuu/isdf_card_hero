# White Backline Summon Investigation Summary

生成: 2026-06-29

## 目的

白AIが、前列に味方がいるレーンの後列へ前衛カードを置く挙動を再検証した。

今回の論点は「前衛ラベルのカードを後列に置くこと」そのものではない。ボムゾウのように後列から仕事できるカードは許容する。問題は、後列から攻撃しにくいカードで最後の後列枠を埋め、後から引いた後衛カードの置き場や、同レーン前列の特技機会を潰すケース。

## 追加した監査

- `--blocked-summon-eval-trace` を追加し、選択行動が「前列あり後列召喚」の時だけ CPU 評価traceを残せるようにした。
- これにより、全行動traceより軽く、bad 後列召喚の近い代替手だけを追える。

## 結果

| Run | Variant | W-L-D | Blocked | Bad | LastBack | DeckTop5Reach | DeathSheepLock |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 対 black_1375 trace | current_white_baseline | 3-5-0 | 38 | 16 | 16 | 15 | 0 |
| 対 black_1375 candidates | reservation80 | 0-8-0 | 35 | 12 | 11 | 11 | 1 |
| 対 black_1375 candidates | reservation140 | 3-5-0 | 35 | 13 | 9 | 11 | 1 |
| 対 black_1375 candidates | low_stone_alt80 | 3-5-0 | 32 | 16 | 14 | 15 | 0 |
| 対 black_1375 candidates | low_stone_alt140 | 2-6-0 | 38 | 13 | 12 | 13 | 0 |
| 対 black_1375 future | future_state55 | 3-5-0 | 27 | 5 | 4 | 3 | 1 |
| 対 black_1375 future | future_state60 | 2-6-0 | 27 | 7 | 5 | 6 | 0 |
| 対 black_1375 future | future_state65 | 4-4-0 | 35 | 14 | 12 | 13 | 1 |
| 白ミラー軽量 | baseline | 1-0-1 | 12 | 4 | 4 | 4 | 0 |
| 白ミラー軽量 | future_state55 | 0-0-2 | 8 | 1 | 1 | 1 | 0 |
| black_strong + decoy 軽量 | baseline | 5-3-0 | 19 | 6 | 6 | 3 | 2 |
| black_strong + decoy 軽量 | future_state55 | 2-4-2 | 34 | 8 | 6 | 8 | 0 |

## 読み

- `future_state55` は、対 black_1375 では bad を 16 から 5 に減らし、白ミラー軽量でも bad を 4 から 1 に減らした。
- ただし、black_strong + decoy では勝敗が 5-3-0 から 2-4-2 に悪化し、bad も 6 から 8 に増えた。
- そのため、`whiteBackSlotFutureStateBonus:55` をそのまま本線採用するのはまだ危険。
- 既存の `reservation` / `low_stone_alt` 系も、bad は少し減るが勝敗悪化やデスシープ特技封じの副作用がある。
- 対 black_1375 の bad summon は、近い非召喚代替が多い。白ミラーでは非召喚代替が遠く、召喚カード選択の問題になりやすい。

## 方向性

本線に入れるべきなのは広い係数ではなく、次の条件を満たす狭い判断。

- 召喚先が後列。
- 同レーン前列に自軍ユニットがいる。
- 召喚カードが後列から攻撃しにくい。
- その召喚で最後の後列空き枠を消費する。
- 山札上位または手札に、後列から仕事できるカードが残っている。
- その召喚が同ターンのウェイク即仕事、撃破、レベルアップ、リーサル、前列脅威処理につながらない。
- デスシープを後列に置く場合は、同レーン前列の下段特技を封じるなら追加で悪く見る。

## 次の実装候補

`whiteLastBackSlotNoReachSummonGuard` のような新しい局面評価を作る。

- 召喚自体を一律禁止しない。
- ボムゾウなど後列から仕事できるカードは対象外にする。
- 前列がすぐ空く、またはウェイクで即仕事する場合も対象外にする。
- 対黒では近い `attack` / `focus` / `end_turn` を押し上げる。
- 白ミラーでは非召喚へ逃がすより、後列仕事カードや特技を塞がない召喚候補を優先する。

## 追加確認

全相手を一括で `games-per-matchup 4` まで広げる確認は重すぎたため中断した。次回は次の順に分ける。

1. 対 black_1375 小母数で、bad と勝敗の方向を見る。
2. 白ミラーを短い上限で副作用確認する。
3. black_strong と decoy は別枠で軽量確認する。
4. 3系統で崩れない候補だけ中母数に増やす。

## 出力

- `2026-06-29_white_backline_summon_blocked_trace_black1375_audit.md`
- `2026-06-29_white_backline_summon_blocked_trace_white_mirror_audit.md`
- `2026-06-29_white_backline_summon_candidate_screen_black1375.md`
- `2026-06-29_white_backline_summon_future_state_screen_black1375.md`
- `2026-06-29_white_backline_summon_future_state55_white_mirror_light.md`
- `2026-06-29_white_backline_summon_future_state55_blackstrong_decoy_light.md`
