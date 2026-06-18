# White AI Shield/Stone Focus Loop 10-15 Summary

## Goal

白AIの黒速攻耐性について、前回の敵前衛攻撃系ではなく、盾の成果化とストーン枯渇を中心に改善候補を検証した。

今回のゴールは「default白AIへ入れる候補を見つける」ことだったが、採用ラインは「黒相手で再現して伸びる」「白/デコイ相手を歪めない」「低石率だけの改善で勝率が落ちない」とした。

## Loop 10: Baseline Loss Audit

- Report: `2026-06-19_white_ai_baseline_loss_audit_loop_10.md`
- 条件: `pressure_white_baseline` vs 黒2相手、8 games/matchup/direction、historyあり。
- 結果: 14-18、負け時の相手残HP平均 2.8。
- 勝ち側: LowS 53.3%、ShieldConv 55.6%。
- 負け側: LowS 52.1%、ShieldConv 36.2%。
- 負け側の低石化行動: focus 96、summon 58、shield 24、wake_up 23、move 21、attack 19。

読み取り:

- LowS自体は勝敗で大差がなく、単純な「石を残す」だけでは原因に届かない可能性が高い。
- ShieldConv は勝ち側と負け側で差が大きい。盾を張った後の成果化不足は実在する。
- 低石化は shield/wake より focus が多い。つまり「石を使ったから負けた」より、「石が少ない状態で有効な仕事が残らずfocusしている」局面が多い。

## Loop 11: Shield/Stone Black Screen

- Report: `2026-06-19_white_ai_shield_stone_black_screen_loop_11.md`
- 条件: 黒2相手、4 games/matchup/direction、no-history。

| Rank | Variant | vs Black | Note |
| ---: | --- | ---: | --- |
| 1 | `pressure_white_low_stone_setup_v1` | 56.3% | 全布石の低石化を抑制。小母数では首位。 |
| 2 | `pressure_white_low_stone_shield_wake_v1` | 50.0% | shield/wake の低石化だけ抑制。 |
| 3 | `pressure_white_baseline` | 37.5% | 基準。 |
| 6 | `pressure_white_low_stone_summon_v1` | 12.5% | 召喚低石抑制は大きく悪化。 |

読み取り:

- 初回スクリーニングでは「全布石低石抑制」と「shield/wake低石抑制」が良く見えた。
- ただし no-history 小母数なので、次の全相手確認で再現性を見る必要があった。

## Loop 12: Shield/Stone Confirm

- Report: `2026-06-19_white_ai_shield_stone_confirm_loop_12.md`
- 条件: 全相手、6 games/matchup/direction、historyあり。

| Rank | Variant | Overall | vs Black | vs Decoy | vs White | Intent |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | `pressure_white_baseline` | 45.8% | 41.7% | 50.0% | 50.0% | LowS 54.0%、ShieldConv 21.2% |
| 2 | `pressure_white_low_stone_shield_wake_v1` | 37.5% | 29.2% | 41.7% | 50.0% | LowS 51.7%、ShieldConv 39.1% |
| 3 | `pressure_white_low_stone_setup_v1` | 47.9% | 29.2% | 66.7% | 66.7% | LowS 48.9%、ShieldConv 39.0% |

読み取り:

- 低石抑制は LowS と ShieldConv を改善したが、vs Black は 41.7% -> 29.2% に落ちた。
- `pressure_white_low_stone_setup_v1` はデコイ/白に勝ちすぎ、黒に落ちる。白基準として採用しにくい。
- この時点で「強い低石ペナルティ」は不採用。

## Loop 13: Low-Stone Focus Screen

- Report: `2026-06-19_white_ai_low_stone_focus_black_screen_loop_13.md`
- 条件: 黒2相手、4 games/matchup/direction、no-history。

| Rank | Variant | vs Black | Note |
| ---: | --- | ---: | --- |
| 1 | `pressure_white_low_stone_focus_guard_v1` | 50.0% | low-stone focus + shield/wake を薄く抑制。 |
| 2 | `pressure_white_low_stone_focus_light_v1` | 43.8% | low-stone focus だけ軽く抑制。 |
| 5 | `pressure_white_baseline` | 31.3% | 基準。 |
| 6 | `pressure_white_low_stone_setup_v1` | 31.3% | 強い全布石抑制は再現せず。 |

読み取り:

- Loop 10 の監査に合わせて、focus 系へ候補を絞った。
- 小母数では focus 系が伸びたが、前回同様、全相手確認が必要。

## Loop 14: Low-Stone Focus Confirm

- Report: `2026-06-19_white_ai_low_stone_focus_confirm_loop_14.md`
- 条件: 全相手、6 games/matchup/direction、historyあり。

| Rank | Variant | Overall | vs Black | vs Decoy | vs White | Intent |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | `pressure_white_low_stone_focus_light_v1` | 47.9% | 33.3% | 50.0% | 75.0% | LowS 54.6%、ShieldConv 43.9% |
| 2 | `pressure_white_baseline` | 37.5% | 25.0% | 33.3% | 66.7% | LowS 55.2%、ShieldConv 36.3% |
| 3 | `pressure_white_low_stone_focus_guard_v1` | 37.5% | 16.7% | 50.0% | 66.7% | LowS 54.4%、ShieldConv 40.4% |

読み取り:

- `focus_light` は同seed帯では baseline より良い。
- ただし vs Black 33.3% は採用ラインには届かない。
- `focus_guard` は黒にさらに悪く、shield/wake 低石抑制を混ぜると黒速攻への対応が遅れる疑いがある。

## Loop 15: Focus Light Loss Audit

- Report: `2026-06-19_white_ai_focus_light_loss_audit_loop_15.md`
- 条件: baseline と `focus_light`、黒2相手、8 games/matchup/direction、historyあり。

| Variant | W-L-D | Loss Opp HP | Loss LowS | Loss ShieldConv | Loss LowS By Action |
| --- | --- | ---: | ---: | ---: | --- |
| `pressure_white_baseline` | 15-17-0 | 3.5 | 54.1% | 36.4% | focus 80、summon 54、shield 28、wake_up 22 |
| `pressure_white_low_stone_focus_light_v1` | 10-22-0 | 3.0 | 51.0% | 34.2% | focus 105、summon 71、shield 39、wake_up 24 |

読み取り:

- `focus_light` は負け側LowSを少し下げたが、勝率は 15-17 -> 10-22 に悪化した。
- 低石focusは原因というより、すでに苦しい局面で出ている症状の可能性が高い。
- `focus_light` は Loop 14 では良く見えたが、黒監査で再現しなかったため採用しない。

## Conclusion

今回のループでは、default白AIへ入れるべき石管理候補は見つからなかった。

- 採用なし: `pressure_white_low_stone_setup_v1`
  - LowS/ShieldConv は改善するが、黒相手が悪化し、白/デコイ相手への勝ち方も歪む。
- 採用なし: `pressure_white_low_stone_shield_wake_v1`
  - shield/wake を抑えると、黒速攻に必要な受け手段まで遅れる。
- 採用なし: `pressure_white_low_stone_summon_v1`
  - 召喚低石抑制は盤面形成を落としすぎる。
- 採用なし: `pressure_white_low_stone_focus_light_v1`
  - 一部seedでは良いが、黒監査で悪化。低石focusは原因というより症状。

ただし収穫はある。

- 負け試合では ShieldConv が低い。盾の対象品質は次の本命テーマ。
- 負け時の相手残HPは 2.8〜3.5 で、完敗だけではなく惜敗が多い。単に守るより、守った後の詰め・反撃の手順が課題。
- 低石化は勝ち負け両方で多い。白は石を使わないと仕事ができないため、石を残すペナルティを直接入れるのは危険。

## Next Loop Proposal

次は石消費そのものを抑えるのではなく、盾/ウェイクアップの「対象品質」を監査してから候補化する。

1. `shield_target_audit` を追加する。
   - 盾対象が次自ターンに攻撃したか。
   - 盾対象がレベルアップしたか。
   - 盾しても倒されたか。
   - 盾対象がそもそも黒の次ターン打点源を止める駒だったか。
2. `wake_up_target_audit` を追加する。
   - 起こした味方が同ターンに仕事したか。
   - 起こした駒が次ターンの撃破/レベルアップ/壁に変換されたか。
   - 低石で起こした結果、次ターンの防御手段が消えたか。
3. 候補はペナルティより加点寄りにする。
   - `whiteShieldThreatConversionBonus`: 脅威軽減か次ターン成果化が見える盾を加点。
   - `whiteWakeImmediateWorkBonus`: 起こして即仕事できる、または次ターンの撃破圏を作るウェイクアップを加点。
   - `whiteCloseoutAfterShieldBonus`: 守った後に相手HP3以下を詰める手を加点。
4. ループ配分。
   - 黒限定 no-history 3-4 games/matchup/direction で一次スクリーニング。
   - 上位2候補だけ全相手 historyあり 6-8 games/matchup/direction。
   - 最後に黒限定 loss audit 8 games/matchup/direction で再現性を見る。

今回の結論としては、白AIの次ループは「石をケチるAI」ではなく、「使った盾/起動を成果へ変換するAI」に寄せるべき。
