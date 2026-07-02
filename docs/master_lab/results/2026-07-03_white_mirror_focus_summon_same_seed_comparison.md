# White Mirror Focus/Summon Same Seed Comparison

- date: 2026-07-03
- matchup: white_current_mirror only
- deck: master-lab-white-1377-death-sheep3
- games-per-matchup: 1
- directions: 2
- seed-start: 991000
- compared variants:
  - current_white_baseline
  - current_mirror_blocked_backline_no_work120

## Summary

`current_mirror_blocked_backline_no_work120` は、狙い通り `backSummonsBlockedNoPattern` を 9 -> 6 に減らした。
ただし、同一 seed の監査では `lowStonePunished`、`lowStoneSummonPunished`、`summonNoNextWorkPunished` が悪化し、平均盤面 swing も悪くなった。

そのため、この候補は「後列詰まりを多少減らすが、低石ターン全体の押し引きを壊しやすい」と判断する。現時点では mainline 採用しない。

## Metrics

| metric | baseline | blocked120 | delta |
|---|---:|---:|---:|
| games | 2 | 2 | 0 |
| wins | 0 | 1 | 1 |
| losses | 1 | 0 | -1 |
| draws | 1 | 1 | 0 |
| turns | 45 | 36 | -9 |
| lowStoneHandoffs | 20 | 23 | 3 |
| lowStonePunished | 13 | 17 | 4 |
| lowStoneFocusTurns | 12 | 9 | -3 |
| lowStoneFocusPunished | 9 | 8 | -1 |
| focusNoNextWorkPunished | 5 | 5 | 0 |
| lowStoneSummonTurns | 13 | 15 | 2 |
| lowStoneSummonPunished | 7 | 9 | 2 |
| backSummonsBlockedNoPattern | 9 | 6 | -3 |
| summonNoNextWorkPunished | 4 | 6 | 2 |
| summonNoWorkNoAttackPunished | 4 | 4 | 0 |
| summonFillsLastBackSlotWithBacklineWorkInHand | 2 | 2 | 0 |
| averageLowStoneOwnBoardSwing | -148.1 | -167.7 | -19.6 |
| averageFocusNoWorkOwnBoardSwing | -203 | -235.4 | -32.4 |
| averagePlacedOnlySummonOwnBoardSwing | -91.3 | -96.8 | -5.5 |

## Interpretation

### blocked120

良かった点:

- `backSummonsBlockedNoPattern` は減った。
- 同一 seed 監査では勝敗だけ見ると baseline より良い方向に揺れた。

悪かった点:

- `lowStonePunished` が 13 -> 17 に増えた。
- `lowStoneSummonPunished` が 7 -> 9 に増えた。
- `summonNoNextWorkPunished` が 4 -> 6 に増えた。
- 盤面 swing 平均が全体的に悪化した。
- `summonNoWorkNoAttackPunished` は改善していない。

結論:

`whiteBlockedBacklineNoWorkSummonPenalty` を一律に上げるのは粗い。後列詰まりそのものは減るが、召喚を避けた結果として低石ターンの受け渡しが悪くなっている可能性が高い。

### focus quality

`current_mirror_focus_quality_mid` は候補ループの一次確認で 25% に落ちた。低石 focus の「変換できない気合い」を抑えたい意図は正しいが、現状の hook は広すぎる可能性がある。

結論:

focus を雑に下げるのではなく、以下のような条件へ絞るべき。

- focus した前衛が次ターン前に倒される。
- focus した駒が次ターンに撃破、レベルアップ、相手打点源処理のいずれにも変換されない。
- focus によりこのターンの敵前衛処理を放棄している。
- focus 後に相手へレベルアップ機会を渡している。

## Next Action

次は勝率ループを増やすより、bad action の分岐比較を入れるのがよい。

候補:

1. `backSummonsBlockedNoPattern` が発生したターンで、召喚しない場合、前衛攻撃する場合、後衛攻撃する場合、focus する場合の最終盤面評価を比較する。
2. `summonNoNextWorkPunished` のうち、低石かつ最後列 slot を埋めるケースだけを抽出する。
3. `focusNoNextWorkPunished` のうち、敵前衛を削れる active 駒がいたケースだけを抽出する。
4. その上で、係数ではなく「この局面でこの行動を避ける」形の小さいルールに還元する。

今回の検証では mainline AI の変更は見送る。
