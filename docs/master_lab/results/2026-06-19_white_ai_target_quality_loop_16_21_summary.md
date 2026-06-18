# White AI Target Quality Loop 16-21 Summary

## Goal

前回の「低石ペナルティ」では、白が育てるために必要な石消費まで抑えてしまう危険があった。

今回は「石をケチる」ではなく、「今ターンに守り/起動へ全力投入しすぎて、次ターンの仕事へ変換されない」問題として扱った。具体的には、盾/ウェイクアップ対象の品質監査を追加し、ペナルティより加点寄りの候補を中心に検証した。

## Added Audit

`white-ai-loss-audit` に `Target Quality` を追加した。

- `SAtk`: シールド対象が次の自ターンに攻撃した率。
- `SLv`: シールド対象が次の自ターンにレベルアップした回数。
- `SDead`: シールド対象が次の自ターン前に倒された率。
- `S2Low`: 同ターン2枚目以降のシールドで残石1以下になった回数。
- `WNow`: ウェイクアップ対象が同ターンに攻撃した率。
- `WExec`: ウェイクアップ対象が同ターンに成果行動へつながった率。
- `WNext`: ウェイクアップ対象が次の自ターンに攻撃した率。
- `WLowNo`: 低石で起こして同ターン仕事しなかった回数。

これで「盾を張ったが次ターンに何もできない」「起こしたが仕事しない」「2枚目シールドで低石化する」を勝ち/負け別に見られる。

## Loop 16: Baseline Target Quality Audit

- Report: `2026-06-19_white_ai_target_quality_baseline_audit_loop_16.md`
- 条件: baseline vs 黒2相手、8 games/matchup/direction、historyあり。
- 結果: 9-23。

| Outcome | LowS | ShieldConv | Target Quality |
| --- | ---: | ---: | --- |
| Win | 53.9% | 32.0% | SAtk 52.0%、SDead 40.0%、S2Low 5/5、WNow 22.2%、WLowNo 7/9 |
| Loss | 54.1% | 42.6% | SAtk 60.3%、SDead 20.6%、S2Low 8/10、WNow 28.8%、WLowNo 12/21 |

読み取り:

- LowS は勝敗差がほぼない。やはり単純な低石抑制は主因ではない。
- 負け側でもシールド対象の次ターン攻撃率は低くない。盾そのものより、盾後に勝ち切れない/起動が弱い可能性がある。
- `WLowNo` が負け側で 12/21。低石ウェイクアップが同ターン仕事に変換されない局面は次の監査対象として有効。

## Loop 17: Target Quality Black Screen

- Report: `2026-06-19_white_ai_target_quality_black_screen_loop_17.md`
- 条件: 黒2相手、4 games/matchup/direction、no-history。

| Rank | Variant | vs Black | Note |
| ---: | --- | ---: | --- |
| 1 | `pressure_white_shield_threat_conversion_v1` | 43.8% | 脅威軽減/成果化が見えるシールド+8。 |
| 2 | `pressure_white_baseline` | 37.5% | 基準。 |
| 3 | `pressure_white_closeout_after_shield_v1` | 37.5% | 守った後のHP3以下詰め+8。 |
| 4 | `pressure_white_shield_threat_conversion_plus12_v1` | 31.3% | +12 は強すぎる。 |
| 7 | `pressure_white_wake_immediate_work_v1` | 25.0% | ウェイク即仕事単体は悪化。 |

読み取り:

- 盾品質+8は小母数でbaselineを上回った。
- ウェイクアップ即仕事加点は伸びなかった。起動判断は「即攻撃」だけでは雑で、相手の黒打点や次ターン防御まで含める必要がありそう。
- 盾品質+12や盾+起動複合は悪化。加点を盛るほど白が守りへ寄りすぎる。

## Loop 18: Target Quality Confirm

- Report: `2026-06-19_white_ai_target_quality_confirm_loop_18.md`
- 条件: 全相手、6 games/matchup/direction、historyあり。

| Rank | Variant | Overall | vs Black | vs Decoy | vs White | Intent |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | `pressure_white_shield_threat_conversion_v1` | 52.1% | 33.3% | 58.3% | 83.3% | LowS 52.5%、ShieldConv 37.4% |
| 2 | `pressure_white_closeout_after_shield_v1` | 43.8% | 25.0% | 83.3% | 41.7% | LowS 53.4%、ShieldConv 41.4% |
| 3 | `pressure_white_baseline` | 45.8% | 33.3% | 75.0% | 41.7% | LowS 54.2%、ShieldConv 38.4% |

読み取り:

- 盾品質+8は overall 首位。ただし vs Black は baseline と同等で、黒耐性の決定打ではない。
- vs White 83.3% は少し高い。白ミラー基準を歪める可能性があるため、即default採用は危険。
- `closeout_after_shield` はデコイに勝ちすぎ、黒に悪い。採用なし。

## Loop 19: Shield Quality Loss Audit

- Report: `2026-06-19_white_ai_target_quality_loss_audit_loop_19.md`
- 条件: baseline と盾品質+8、黒2相手、8 games/matchup/direction、historyあり。

| Variant | W-L-D | Loss LowS | Loss ShieldConv | Loss Target Quality |
| --- | --- | ---: | ---: | --- |
| `pressure_white_baseline` | 9-23-0 | 52.2% | 44.7% | SAtk 61.8%、SDead 17.1%、S2Low 10/11、WNow 26.7%、WLowNo 32/42 |
| `pressure_white_shield_threat_conversion_v1` | 11-21-0 | 54.0% | 36.1% | SAtk 55.6%、SDead 26.4%、S2Low 12/12、WNow 23.1%、WLowNo 16/20 |

読み取り:

- 盾品質+8は 9-23 -> 11-21 と少し改善。
- ただし `S2Low` は残り、むしろ比率上は悪い。ユーザーの懸念である「2枚守りで全力投入」は解決していない。
- `WLowNo` は 32/42 -> 16/20 と減ったが、これはウェイクアップ回数が減った影響も大きい。起動品質の改善とは言い切れない。

## Loop 20: Second Shield Black Screen

- Report: `2026-06-19_white_ai_second_shield_black_screen_loop_20.md`
- 条件: 黒2相手、4 games/matchup/direction、no-history。

| Rank | Variant | vs Black | Note |
| ---: | --- | ---: | --- |
| 1 | `pressure_white_shield_threat_conversion_v1` | 37.5% | 盾品質+8が再び首位。 |
| 2 | `pressure_white_second_shield_guard_v1` | 31.3% | 2枚目低石シールド抑制。baselineよりは上。 |
| 3 | `pressure_white_baseline` | 25.0% | 基準。 |
| 4 | `pressure_white_shield_quality_second_guard_v1` | 18.8% | 盾品質+2枚目抑制の複合は悪化。 |

読み取り:

- 2枚目低石シールド抑制は方向としては悪くないが、盾品質+8には届かない。
- 盾品質加点と2枚目抑制を同時に入れると悪化した。シールド評価を二重に触ると探索の局所解が崩れる疑いがある。

## Loop 21: Second Shield Loss Audit

- Report: `2026-06-19_white_ai_second_shield_loss_audit_loop_21.md`
- 条件: baseline と2枚目低石シールド抑制、黒2相手、4 games/matchup/direction、historyあり。

| Variant | W-L-D | Loss LowS | Loss ShieldConv | Loss Target Quality |
| --- | --- | ---: | ---: | --- |
| `pressure_white_baseline` | 4-12-0 | 56.1% | 16.0% | SAtk 32.0%、SDead 28.0%、S2Low 3/3、WNow 20.0%、WLowNo 14/16 |
| `pressure_white_second_shield_guard_v1` | 6-10-0 | 48.7% | 25.0% | SAtk 57.1%、SDead 25.0%、S2Low 4/4、WNow 29.2%、WLowNo 9/10 |

読み取り:

- 2枚目低石シールド抑制は 4-12 -> 6-10、Loss LowS 56.1% -> 48.7%、Loss ShieldConv 16.0% -> 25.0% と小母数では改善。
- ただし `S2Low` 自体は消えていない。抑制が効いた局面もあるが、全体の行動系列が変わり、別の2枚目低石盾が出ている可能性がある。
- 単独候補として次ループに残す価値はあるが、default採用にはまだ足りない。

## Conclusion

今回のループでは、前回よりユーザーの意図に近い知見が出た。

- `pressure_white_shield_threat_conversion_v1` は採用候補として残す。
  - 黒で小幅改善し、全相手overallも良い。
  - ただし白ミラーに勝ちすぎるseedがあり、即default採用はしない。
- `pressure_white_second_shield_guard_v1` も次ループ候補として残す。
  - 「現在ターンに全力を出しすぎない」という意図に最も近い。
  - 小母数のloss auditでは LowS / ShieldConv / 勝敗が改善した。
  - ただし S2Low を完全には消せていない。
- 採用なし:
  - `pressure_white_wake_immediate_work_v1`: 即仕事だけを見るウェイク加点は黒に弱い。
  - `pressure_white_closeout_after_shield_v1`: デコイに勝ちすぎ、黒に悪い。
  - `pressure_white_shield_quality_second_guard_v1`: 盾品質加点と2枚目抑制の複合は悪化。

## Next Loop Proposal

次は大きく新候補を増やさず、2本に絞って再現性を見る。

1. `pressure_white_shield_threat_conversion_v1`
   - 盾の対象品質を上げる候補。
   - vs White 勝ちすぎが偶然か、別seedで確認する。
2. `pressure_white_second_shield_guard_v1`
   - 2枚目低石シールドの過剰コミット抑制候補。
   - S2Low が本当に減るseedと減らないseedを分けて監査する。

推奨ループ:

- 黒限定 historyあり 8 games/matchup/direction を seed帯違いで2セット。
- その後、上位1本だけ全相手 8 games/matchup/direction。
- 追加監査として、`S2Low` が出た試合だけをseed抽出し、2枚目シールド直前の候補評価差分を見る。

現時点の判断は「default反映はまだしないが、次はこの2本だけを掘る」。特にユーザーの指摘した「盾を2枚張って次ターンの仕事がなくなる」問題には、`pressure_white_second_shield_guard_v1` が最も近い。
