# White Planner Forced Branch / Rejected Candidate Summary

生成: 2026-07-04

## 目的

白対白の残り負け seed を、局所評価の係数追加ではなく「候補手を強制して最後まで流す」形で確認した。
勝ち筋が見える候補だけ実装に進め、勝率改善が出ない候補は mainline に残さない。

## 追加した監査

- `npm run audit:white-planner-forced-branch`
- 指定 step まで再生し、root 上位候補と実選択手をそれぞれ強制適用する。
- その後は通常 AI に戻して `maxReplaySteps` まで流し、最終勝敗または評価値を比較する。
- response probe では「一手後の返し込みスコア」は見えるが、強制分岐では「その候補から最終的に勝てるか」を確認できる。

## 994304 challenger-as-cpu

参照:

- `2026-07-04_white_planner_994304_cpu_loss_handoff_probe.md`
- `2026-07-04_white_planner_deck_deficit_race_probe_994304.md`
- `2026-07-04_white_planner_deck_deficit_race_followup_probe_994304.md`
- `2026-07-04_white_planner_forced_branch_994304_cpu_focused.md`（`deckDeficitRace` 候補中の証跡）
- `2026-07-04_white_planner_forced_branch_994304_cpu_step242_current.md`

結果:

- step 242 では `end_turn` より `ダイン斬り -> player master` の局所分岐が良く見えた。
- ただし、強制分岐で最後まで流すと `end_turn` も `ダイン斬り` も最終的に白側勝ちになった。
- step 230 / 231 の上位候補も、最終勝敗を覆すものは見つからなかった。
- AI 本体を戻した現在版の step 242 短縮 forced branch では、選択手は `end_turn`。代替 `ダイン斬り` も同じく最終的に白側勝ち。

判断:

- `deckDeficitRace` のように山札枚数差だけで顔打点を強制する案は不採用。
- 局所スコアは改善しても、6ゲーム確認では勝ち数が増えなかった。
- 994304 は T24 の一手ではなく、もっと前から「勝てる盤面を作れていない」可能性が高い。

## 994306 challenger-as-player

参照:

- `2026-07-04_white_planner_994306_t8_threat_probe.md`
- `2026-07-04_white_planner_994306_front_guard_retreat_probe.md`
- `2026-07-04_white_planner_994306_front_guard_terminal_override_probe.md`
- `2026-07-04_white_planner_994306_passive_guard_retreat_probe.md`
- `2026-07-04_white_planner_994306_emergency_retreat_probe.md`
- `2026-07-04_white_planner_994306_terminal_compare_probe.md`

観察:

- 元の step 83 では `player_front_right` の Lv2 ヤンバルを後列へ下げる手が root 333.6 で選ばれていた。
- response probe 上は、後列へボムゾウを置いて前列を維持する候補の方が返し込みスコアは良かった。
- ただし、`terminal_compare1` でも選択は変わらず、既存 terminal 評価だけではこの差を十分に拾えていない。

試したが戻した案:

- 白ミラーで、敵前衛脅威が残るときの受動的な前列ガード退避を prune。
- HP2以下の緊急退避だけ許す条件も試した。

検証:

- `994306 challenger-as-player` 単体: 依然として white/cpu 勝ち、182 steps / 18 turns。
- `994305-994306 both` 確認: 2-2。
- 以前の同範囲では 3-1 相当だったため、勝率面では悪化。

判断:

- 前列退避の違和感は実ログ上の問題として残る。
- ただし、単純に退避候補を落とすと、別 seed の player 側が悪化した。
- 退避そのものを禁止するのではなく、「退避後に何へ接続するか」「前列維持で得る返しの安全性」をターンプラン評価へ入れる必要がある。

## 次フェーズ提案

次は挙動を直接変えず、強制分岐で「勝てる候補が実在する局面」を先に探す。

1. 白対白の負け seed から、T6-T14 の root 上位候補を 2-4 本ずつ forced branch で流す。
2. 最終勝敗が覆る、または最終評価が大きく改善する step だけを実装候補にする。
3. 候補が見つかったら、その局面を説明できる評価概念へ還元する。
4. 勝てる強制分岐が見つからない場合は、同一ターン探索ではなく相手ターン込みの二手番プランへ進む。

現時点の結論:

- 今回は AI 挙動の mainline 変更なし。
- forced branch 監査は有用なので残す。
- 局所的な `deckDeficitRace` と `passive front guard retreat prune` は不採用。
