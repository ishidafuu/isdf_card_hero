# White Planner Front Ace Shield Phase Summary

生成: 2026-07-04

## 目的

前回の setup-over-focus 採用後、次の候補として `focus` と `attack` の押し引きを forced branch で監査した。
その過程で、より大きい改善候補として「白ミラーで前衛エースではなく低レベル側面アタッカーに盾を張る」局面が見つかったため、先に盾対象評価へ落とし込んだ。

## 監査結果

### forced branch scan

- 対象: `994300 / challenger-as-cpu / turn 8-10`
- 根拠: `2026-07-04_white_planner_focus_attack_forced_branch_scan_994300_cpu_t8_t10.md`

有望局面:

| step | selected | best | delta | 補足 |
| ---: | --- | --- | ---: | --- |
| 90 | `master:shield->monster:cpu_front_right` | `master:shield->monster:cpu_front_left` | 1000336 | Lv2ヤンバル盾よりLv3ダイン盾の分岐が勝ちへ反転 |
| 88 | `attack:ヤンバル->デスシープ` | `summon:ヤンバル->cpu_back_right` | 673.4 | 攻撃より後続布石が高評価。今回は未採用 |

広い `994300-994305` scan も開始したが、36分時点で途中停止した。
full forced replay は重いため、以降は promising seed/turn に絞って再実行する。

### branch timeline

- 根拠: `2026-07-04_white_planner_branch_timeline_994300_cpu_step90_shield_target.md`
- 旧 selected: `master:shield->monster:cpu_front_right`
  - ヤンバルLv2を守る。
  - final: baseline white win。
- forced best: `master:shield->monster:cpu_front_left`
  - 真勇者ダインLv3を守る。
  - final: white_planner win。

この局面では、Lv3ダインを残すと次ターン以降の盤面制圧とマスター打点が残る。
一方で、ヤンバルLv2盾は主力前衛を失いやすく、終盤で押し返された。

## 実装

`whiteShieldFrontAceBonus` を追加した。

条件:

- 白ミラーのみ。
- そのターン最初のシールドのみ。
- 対象が自軍前衛。
- 対象が前衛ロール。
- 対象がLv3以上。
- 次ターン仕事、顔打点、または脅威軽減が見込める。

意図:

- 盾全体を強くするのではなく、複数の盾候補がある時に「盤面制圧の軸になる前衛エース」を優先する。
- 低レベル側面アタッカーや後衛への広い加点はしない。

## PDCA結果

### seeds 994300-994303 / both directions

- 根拠: `2026-07-04_white_planner_pdca_front_ace_shield_seeds994300_994303.md`
- 結果: 7-1-0
- avg HP margin: 4.38

前回同範囲の current は 7-1-0 / avg HP margin 3.25 だったため、勝敗維持で margin 改善。

主な差:

- `994300 / challenger-as-cpu`
  - 旧: P6/C0 で敗北。
  - 今回: P2/C0 で敗北。
  - 勝敗反転までは届かないが、負け幅は縮小。
- `994302 / challenger-as-cpu`
  - 旧: P0/C2 で勝利。
  - 今回: P0/C7 で勝利。
  - 勝ち幅改善。

### seeds 994304-994305 / both directions

- 根拠: `2026-07-04_white_planner_pdca_front_ace_shield_seeds994304_994305.md`
- 結果: 4-0-0
- avg HP margin: 6.25

前回 setup-over-focus の保護 seed セットは 4-0 維持。
`994305 / challenger-as-cpu` は P0/C1 から P0/C8 へ改善。

## 判断

採用。

理由:

- forced branch で勝敗反転級の盾対象ミスが確認できた。
- 実装条件が白ミラーの前衛Lv3エースに限定されている。
- 既存の保護 seed で悪化せず、周辺 seed で avg HP margin が改善した。
- regression test で、補正ありではLv3前衛エース盾が低レベル側面アタッカー盾を上回り、補正を切ると元の評価差へ戻ることを固定した。

## 次フェーズ

次は今回未採用にした step 88 の「攻撃より後列ヤンバル召喚」へ進む。

見るべき観点:

1. 倒しきれない攻撃をしても、相手の返しで盤面制圧に変換されないか。
2. 低石でも、次ターンの役割配置を作る召喚が攻撃より大きいか。
3. forced branch の winner flip ではなく、score delta 型の改善をどう採用条件に落とすか。
