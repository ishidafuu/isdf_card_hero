# White Planner Move Before Summon Phase Summary

生成: 2026-07-04

## 目的

前フェーズ後に `994300 / challenger-as-cpu / turn 8` を再監査したところ、白ミラーで後列の行動可能ユニットを前に出す前に、最後の後列枠を召喚で埋める順序ミスが残っていた。

問題の局面:

- 盤面: 自軍 `真勇者ダイン Lv3` が前列、`ポリスピナー` が後列、右前列と右後列が空き。
- 手札: `ヤンバル` 召喚可能。
- 旧選択: `summon:ヤンバル->cpu_back_right`
- forced best: `move:cpu_back_left->cpu_front_right`

旧選択は、先に右後列へヤンバルを置いてからポリスピナーを右前列へ出すため、ヤンバルがポリスピナーの後ろに固定される。
移動を先に行うと左後列が空き、次にヤンバルをLv3ダインの後ろへ置ける。

## 実装

`whiteBacklineMoveBeforeSummonPenalty` を追加した。

条件:

- 白ミラーのみ。
- 後列への召喚で最後の後列空き枠を埋める。
- 召喚後に即勝ちではない。
- 召喚前に、後列の行動可能ユニットを空き前列へ移動できる。
- その移動で新しく空く後列枠へ同じ手札カードを召喚できる。
- 移動で新しく空く後列枠の前にいる味方の支えが、現在の召喚先より明確に良い。

意図:

- 召喚全体を弱くしない。
- ヤンバルのような射程持ち召喚も一律には抑えない。
- 「先に移動すれば、より良いレーンに召喚できる」局面だけ順序を補正する。
- 対黒の既存調整と混ぜないため白ミラー限定にした。

## Regression

`tests/game/cpuAi.test.ts` に、再現局面を固定するテストを追加した。

確認内容:

- 補正ありでは `summon:ヤンバル->cpu_back_right` の評価が補正なしより100点以上下がる。
- 補正ありでは `move:cpu_back_left->cpu_front_right` が召喚を上回る。
- `chooseCpuDecision(... white_planner ...)` が実際に `move:cpu_back_left->cpu_front_right` を選ぶ。

## 監査結果

### forced branch scan

- 根拠: `2026-07-04_white_planner_move_before_summon_forced_branch_scan_994300_cpu_t8_t10.md`
- 対象: `994300 / challenger-as-cpu / turn 8-10`
- 結果: 3 states scanned / promising 0

重要局面:

| step | selected | best | scoreDelta |
| ---: | --- | --- | ---: |
| 89 | `move:cpu_back_left->cpu_front_right` | `move:cpu_back_left->cpu_front_right` | 0 |
| 91 | `summon:ヤンバル->cpu_back_left` | `summon:ヤンバル->cpu_back_left` | 0 |
| 99 | `attack:ヤンバル:wild_claw->真勇者ダイン` | 同左 | 0 |

旧scanでは step 89 が `summon:ヤンバル->cpu_back_right` で、forced move が勝敗反転級だった。
今回、その差分は消えた。

### seeds 994300-994303 / both directions

- 根拠: `2026-07-04_white_planner_pdca_move_before_summon_seeds994300_994303.md`
- 結果: 7-1-0
- avg HP margin: 4.0
- issues: 0
- avg decision ms: 491.6
- max decision ms: 5049

前フェーズは同範囲で 7-1-0 / avg HP margin 4.38。
平均HP差は少し下がったが、`994300 / challenger-as-cpu` は敗北から勝利へ反転した。

### seeds 994304-994305 / both directions

- 根拠: `2026-07-04_white_planner_pdca_move_before_summon_seeds994304_994305.md`
- 結果: 4-0-0
- avg HP margin: 6.0
- issues: 0
- avg decision ms: 687.5
- max decision ms: 4728

前フェーズの保護seed範囲も 4-0 維持。
avg HP margin は 6.25 から 6.0 へわずかに低下したが、大きな退化は見えない。

## 判断

採用。

理由:

- forced branch で見えていた勝敗反転級の順序ミスが消えた。
- 実装条件が「白ミラー」「最後の後列枠」「先移動でより良い召喚先が作れる」に限定されている。
- 問題seedの実戦結果が敗北から勝利へ反転した。
- 保護seedで 4-0 を維持した。
- 思考時間は最大約5秒で、実プレイ向けAIとして許容範囲。

注意点:

- この補正は `WHITE_AI_BASE_TUNING` に入れたため、`white` と `white_planner` の両方に効く。
- 今回のPDCAは、更新後の `white` baseline と `white_planner` の比較である。

## 次フェーズ

次は、今回のforced scanで残った「step 91 の summon lane tie」を見る。

現状では root score 上は `cpu_back_left` と `cpu_back_right` が同点だが、replayでは `cpu_back_left` が残り、`cpu_back_right` は敗北している。
次の候補は、召喚先のレーン選択を単純なslot順ではなく、前列の主力・前列の行動済み状況・後続の守りやすさで比較すること。

ただし、今回の改善で step 91 はすでに `cpu_back_left` を選べているため、まずは別seedでも同じ「同点レーン選択」が悪さをしているかを監査してから実装候補化する。
