# White AI Same-Turn Second Shield Loop 22-29 Summary

## Goal

前回の `whiteSecondShieldLowStonePenalty` は、「同ターン2枚目のシールド」ではなく「既に盾持ちがいる状態のシールド」全般へかかっていた。

これはユーザーの指摘した「盾を2枚張って次ターンに枯渇する」問題より広く、前ターンから盾が残っているだけの健全な守りまで抑える可能性があった。

今回のループでは、同ターンのマスター特技履歴を追加し、白AIの二枚目低石シールド抑制を正確に「同ターン2枚目以降」へ寄せた。

## Implementation

- `GameState.turnMasterActionHistory` を追加。
- `useMasterAction` でターン中のマスター特技履歴を記録。
- `endTurn` のターン終了マーカーで `turnMasterActionHistory` をクリア。
- `whiteSecondShieldLowStonePenalty` を、同ターン中に既に `shield` を使っている場合だけ発火するよう修正。
- `white` profile の標準補正として `whiteSecondShieldLowStonePenalty: 12` を採用。
- 実験用に以下を追加。
  - `pressure_white_second_shield_guard_light_v1`: +4
  - `pressure_white_second_shield_guard_plus12_v1`: +12

## Loop 22: Pre-Fix Black Confirm

- Report A: `2026-06-19_white_ai_target_quality_black_confirm_loop_22a.md`
- Report B: `2026-06-19_white_ai_target_quality_black_confirm_loop_22b.md`
- 条件: 黒2相手、8 games/matchup/direction、historyあり。

| Set | Baseline | Shield Quality +8 | Old Second Shield +8 |
| --- | ---: | ---: | ---: |
| 22a | 50.0% | 40.6% | 31.3% |
| 22b | 40.6% | 21.9% | 34.4% |

読み取り:

- 盾品質加点は seed を変えると大きく崩れた。
- 旧2枚目盾ガードは「盾持ちがいるだけ」で罰していたため、白の本筋まで削った疑いが強い。
- この時点で、盾品質加点は打ち切り、2枚目盾ガードは実装修正して再検証する方針にした。

## Loop 23: Same-Turn Second Shield Screen

- Report: `2026-06-19_white_ai_same_turn_second_shield_black_screen_loop_23.md`
- 条件: 黒2相手、6 games/matchup/direction、no-history。

| Rank | Variant | vs Black |
| ---: | --- | ---: |
| 1 | `pressure_white_second_shield_guard_plus12_v1` | 45.8% |
| 2 | `pressure_white_second_shield_guard_light_v1` | 41.7% |
| 3 | `pressure_white_shield_threat_conversion_v1` | 37.5% |
| 4 | `pressure_white_baseline` | 25.0% |
| 5 | `pressure_white_second_shield_guard_v1` | 20.8% |

読み取り:

- 同ターン2枚目へ絞ると、+12 が明確に上振れた。
- +8 は中途半端に悪く、係数としては候補外。
- +4 は副作用が少なそうだが、黒への伸びは +12 より弱い。

## Loop 24: Black Confirm

- Report: `2026-06-19_white_ai_same_turn_second_shield_black_confirm_loop_24.md`
- 条件: 黒2相手、8 games/matchup/direction、historyあり。

| Rank | Variant | vs Black | ShieldConv | LowS |
| ---: | --- | ---: | ---: | ---: |
| 1 | `pressure_white_second_shield_guard_plus12_v1` | 37.5% | 46.0% | 51.1% |
| 2 | `pressure_white_baseline` | 34.4% | 37.0% | 52.8% |
| 3 | `pressure_white_second_shield_guard_light_v1` | 31.3% | 38.6% | 53.9% |

読み取り:

- +12 は historyありでも baseline を少し上回った。
- `ShieldConv` が 37.0% -> 46.0% へ上がり、単なる石温存ではなく守った対象の成果化が改善した。
- ただし vs Black 45% には届かないため、これ単体で黒対策が完成したわけではない。

## Loop 25: Loss Audit

- Report: `2026-06-19_white_ai_same_turn_second_shield_loss_audit_loop_25.md`
- 条件: 黒2相手、8 games/matchup/direction、historyあり。

| Variant | W-L-D | Loss LowS | Loss ShieldConv | Loss Target Quality |
| --- | --- | ---: | ---: | --- |
| `pressure_white_baseline` | 9-23-0 | 56.1% | 45.2% | SAtk 57.1%、SDead 16.7%、S2Low 13/15、WLowNo 22/30 |
| `pressure_white_second_shield_guard_light_v1` | 16-16-0 | 50.9% | 41.7% | SAtk 55.6%、SDead 13.9%、S2Low 8/11、WLowNo 18/25 |
| `pressure_white_second_shield_guard_plus12_v1` | 9-23-0 | 50.5% | 33.8% | SAtk 52.9%、SDead 8.8%、S2Low 9/10、WLowNo 20/30 |

読み取り:

- loss audit では light が勝敗面で最も良かった。
- +12 は `Loss LowS` を改善したが、勝敗は baseline と同等だった。
- ただし +12 は `SDead` が低く、守った駒が即死しにくい方向へ寄っている。
- `S2Low` は完全には消えない。二枚目盾を完全禁止するのではなく、「強い場面ではまだ使う」挙動になっている。

## Loop 26-27: All Opponent Confirm

- Report 26: `2026-06-19_white_ai_same_turn_second_shield_all_confirm_loop_26.md`
- Report 27: `2026-06-19_white_ai_same_turn_second_shield_all_confirm_loop_27.md`
- 条件: 全相手、8 games/matchup/direction、historyあり。

| Loop | Variant | Overall | vs Black | vs Decoy | vs White |
| --- | --- | ---: | ---: | ---: | ---: |
| 26 | `pressure_white_second_shield_guard_plus12_v1` | 48.4% | 40.6% | 68.8% | 43.8% |
| 26 | `pressure_white_second_shield_guard_light_v1` | 40.6% | 37.5% | 31.3% | 56.3% |
| 26 | `pressure_white_baseline` | 40.6% | 31.3% | 50.0% | 50.0% |
| 27 | `pressure_white_second_shield_guard_plus12_v1` | 50.0% | 34.4% | 81.3% | 50.0% |
| 27 | `pressure_white_baseline` | 48.4% | 31.3% | 68.8% | 62.5% |

読み取り:

- +12 は2 seed帯とも baseline より overall / vs Black が上。
- Decoy への勝率は高めに出たが、ユーザー方針として「白は基準デッキなので、勝ちすぎは問題にしない」と明確化された。
- White mirror は 43.8% / 50.0% で、白同士の基準を一方的には壊していない。
- 採用阻害だった「白/デコイに勝ちすぎる懸念」は、今回の方針変更により優先度を下げた。

## Loop 28-29: Adopted Baseline Check

- Report 28: `2026-06-19_white_ai_same_turn_second_shield_adopted_baseline_loop_28.md`
- Report 29: `2026-06-19_white_ai_same_turn_second_shield_adopted_loss_audit_loop_29.md`
- 条件: +12 を `white` profile 標準へ入れた後の baseline 確認。

| Report | Condition | Result |
| --- | --- | --- |
| Loop 28 | 全相手 8 games/matchup/direction | Overall 48.4%、vs Black 37.5%、vs Decoy 56.3%、vs White 62.5%、0F/0W |
| Loop 29 | 黒2相手 loss audit | 12-20-0、Loss Opp HP 2.7、Loss LowS 52.7%、Loss ShieldConv 43.9% |

Loop 29 の負け側 target quality:

- `SAtk`: 61.4%
- `SLv`: 3
- `SDead`: 21.1%
- `S2Low`: 9/10
- `WNow`: 32.7%
- `WExec`: 17.3%
- `WLowNo`: 14/24

読み取り:

- 採用後baselineは警告なしで回った。
- 黒相手はまだ負け越すが、負け時の相手HP平均 2.7 で惜敗寄り。
- `S2Low` はまだ残る。これは「禁止」ではなく「同ターン2枚目低石盾の評価を下げる」調整なので想定内。
- 次の改善対象は盾より、低石状態の `focus` / `summon` / `wake_up` の品質になりそう。

## Decision

`whiteSecondShieldLowStonePenalty: 12` を `white` profile の標準補正として採用した。

理由:

- ユーザーの意図である「石を単純にケチる」ではなく、「今ターンに全力を出しすぎる2枚目盾」を狙えている。
- 同ターン履歴に基づくため、前ターンから盾が残っているだけの健全な守りは罰しない。
- 黒相手の勝率は複数seedで小幅改善。
- 白が基準デッキとして強めに出ることは許容されるため、Decoy勝率の高さは今回は採用阻害にしない。

## Next Loop Proposal

次は「盾」ではなく、低石状態でのターン終盤行動の品質を見る。

1. `low_stone_focus_audit` を追加する。
   - 低石で focus してターンを渡した後、次自ターンに攻撃/撃破/レベルアップへ変換されたか。
   - 黒の次ターン打点源を放置した focus だったか。
   - `Loss LowS By Action` では focus が最大なので、ここが次の本命。

2. `wake_up_work_quality_v2` を作る。
   - 低石 wake_up が同ターン攻撃だけでなく、敵前衛処理、撃破圏作り、壁化へつながったかを見る。
   - 今回も `WLowNo` が残っているため、wake_up はまだ改善余地がある。

3. 候補はペナルティ中心にしない。
   - `whiteLowStoneFocusPenalty` のような単純抑制は、白の育成速度を落とす危険がある。
   - まずは「低石でも次ターン成果が見える focus / wake_up」を加点する形に寄せる。

推奨ループ:

- 採用済み baseline を固定。
- 黒限定 no-history 4-6 games/matchup/direction で `focus` / `wake_up` 品質候補を一次スクリーニング。
- 上位2本だけ historyあり 8 games/matchup/direction。
- 最後に全相手 8 games/matchup/direction。

今回で「2枚盾過剰コミット」は一段落。次は「盾を張る/張らない」より、低石でターンを返す時に次ターンの仕事が本当に残っているかを見る段階に進む。
