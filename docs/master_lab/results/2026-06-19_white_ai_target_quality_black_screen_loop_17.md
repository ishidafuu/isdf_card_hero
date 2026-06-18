# White AI Tuning Loop

生成: 2026-06-18T22:53:13.345Z
候補: 7
相手: black_pressure_strong, black_pressure_pressure
試行: 4 games/matchup/direction
総試合: 112

## Conclusion

首位は `pressure_white_shield_threat_conversion_v1`（score 36.7 / overall 43.8% / vs Black 43.8%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +6.3%。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: pressure_white_shield_threat_conversion_v1 43.8% / pressure_white_baseline 37.5% / pressure_white_closeout_after_shield_v1 37.5% / pressure_white_shield_threat_conversion_plus12_v1 31.3% / pressure_white_shield_wake_quality_v1 31.3%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_shield_threat_conversion_v1<br>本実装候補: 白盾脅威/成果化+8 | hybrid | pressure-normal<br>通常プレッシャー | 36.7 | 7-9-0 | 43.8% | 43.8% (7-9-0) | - | - | 10.3 | - | wake_up:49, shield:38, master_attack:31 | - | 0F/0W | - |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 11.2 | - | shield:52, wake_up:50, master_attack:46 | - | 0F/0W | 黒に弱い |
| 3 | pressure_white_closeout_after_shield_v1<br>本実装候補: 白盾後詰め+8 | hybrid | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 8.6 | - | shield:36, wake_up:32, master_attack:19 | - | 0F/0W | 黒に弱い |
| 4 | pressure_white_shield_threat_conversion_plus12_v1<br>本実装候補: 白盾脅威/成果化+12 | hybrid | pressure-normal<br>通常プレッシャー | 27.9 | 5-11-0 | 31.3% | 31.3% (5-11-0) | - | - | 9.6 | - | shield:44, wake_up:32, master_attack:28 | - | 0F/0W | 黒に弱い |
| 5 | pressure_white_shield_wake_quality_v1<br>本実装候補: 白盾起動品質+8 | hybrid | pressure-normal<br>通常プレッシャー | 27.9 | 5-11-0 | 31.3% | 31.3% (5-11-0) | - | - | 9.6 | - | shield:49, wake_up:41, master_attack:20 | - | 0F/0W | 黒に弱い |
| 6 | pressure_white_next_turn_plan_quality_v1<br>本実装候補: 白次ターン布石品質 | hybrid | pressure-normal<br>通常プレッシャー | 23.5 | 4-12-0 | 25% | 25% (4-12-0) | - | - | 9.9 | - | shield:57, wake_up:36, master_attack:33 | - | 0F/0W | 黒に弱い |
| 7 | pressure_white_wake_immediate_work_v1<br>本実装候補: 白起動即仕事+8 | hybrid | pressure-normal<br>通常プレッシャー | 23.5 | 4-12-0 | 25% | 25% (4-12-0) | - | - | 9 | - | wake_up:42, shield:32, master_attack:30 | - | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_shield_threat_conversion_v1<br>本実装候補: 白盾脅威/成果化+8 | 白マスター限定で、脅威軽減または次ターン成果化が見えるシールドだけを加点する。 | situational whiteShieldThreatConversionBonus:8 | 36.7 | 43.8% | 43.8% (7-9-0) | - | - | wake_up:49, shield:38, master_attack:31 | - | - |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | shield:52, wake_up:50, master_attack:46 | - | 黒に弱い |
| 3 | pressure_white_closeout_after_shield_v1<br>本実装候補: 白盾後詰め+8 | 既に守った駒がいる局面で、相手HP3以下へ詰める手を加点して守り続けを避ける。 | situational whiteCloseoutAfterShieldBonus:8 | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | shield:36, wake_up:32, master_attack:19 | - | 黒に弱い |
| 4 | pressure_white_shield_threat_conversion_plus12_v1<br>本実装候補: 白盾脅威/成果化+12 | 成果化シールド加点を強め、2枚守りより質の高い1枚守りへ寄るか確認する。 | situational whiteShieldThreatConversionBonus:12 | 27.9 | 31.3% | 31.3% (5-11-0) | - | - | shield:44, wake_up:32, master_attack:28 | - | 黒に弱い |
| 5 | pressure_white_shield_wake_quality_v1<br>本実装候補: 白盾起動品質+8 | シールドとウェイクアップを、消費量ではなく次ターン成果化の質で押す。 | situational whiteShieldThreatConversionBonus:8, whiteWakeImmediateWorkBonus:8 | 27.9 | 31.3% | 31.3% (5-11-0) | - | - | shield:49, wake_up:41, master_attack:20 | - | 黒に弱い |
| 6 | pressure_white_next_turn_plan_quality_v1<br>本実装候補: 白次ターン布石品質 | 盾/起動の対象品質と、守った後の詰めを同時に見る本命複合候補。 | situational whiteShieldThreatConversionBonus:8, whiteWakeImmediateWorkBonus:8, whiteCloseoutAfterShieldBonus:6 | 23.5 | 25% | 25% (4-12-0) | - | - | shield:57, wake_up:36, master_attack:33 | - | 黒に弱い |
| 7 | pressure_white_wake_immediate_work_v1<br>本実装候補: 白起動即仕事+8 | 白マスター限定で、起こした味方が即攻撃またはレベルアップ筋へつながるウェイクアップを加点する。 | situational whiteWakeImmediateWorkBonus:8 | 23.5 | 25% | 25% (4-12-0) | - | - | wake_up:42, shield:32, master_attack:30 | - | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_plus12_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_plus12_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_plus12_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_plus12_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_wake_immediate_work_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_wake_immediate_work_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_wake_immediate_work_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_wake_immediate_work_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_wake_quality_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_wake_quality_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_wake_quality_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_wake_quality_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 0 / D 0 | 0F/0W |

## Reading

- `Overall` と `vs ...` は引き分けを0.5勝として扱う勝ち点率。
- `vs Black` は黒速攻耐性の主指標。`black_pressure_strong` と `black_pressure_pressure` の両方を合算している。
- `vs Decoy` は現行第三マスターへの基準維持。高すぎる場合は白が基準を超えすぎていないかを見る。
- `vs White` は現行白基準との比較診断。採用判断では黒耐性と長期戦リスクを優先する。
- `Usage` は候補白側の通常マスター特技使用回数。`wake_up` / `shield` / `master_attack` の偏りを見る。
- `Intent` は白側行動の診断値。`Ex` はこのターンの仕事率、`Setup` は布石率、`LowS` は布石後に石が1以下、`ShieldConv` はシールドが次ターン成果へ変換された率。
- `Pygmy` はピグミィの小打点が撃破圏作りに寄与した回数、`Poly` はポリスピナー1回目行動が同ターン成果へつながった率。
- `Loss Opp HP` は候補白側が負けた時の相手残HP平均。低いほど惜敗、高いほど押し切られ。
- ロストーン入りデッキは `Notes` に出る。現方針では本命候補から外す。
