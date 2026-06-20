# White AI Tuning Loop

生成: 2026-06-20T01:17:12.252Z
候補: 5
相手: black_pressure_strong, black_pressure_pressure
試行: 8 games/matchup/direction
総試合: 160

## Conclusion

首位は `pressure_white_low_stone_focus_missed_attack_light_v1`（score 34.8 / overall 40.6% / vs Black 40.6%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: pressure_white_low_stone_focus_missed_attack_light_v1 40.6% / pressure_white_baseline 40.6% / pressure_white_low_stone_focus_conversion_v1 34.4% / pressure_white_threat_left_focus_missed_attack_v1 34.4% / pressure_white_shield_quality_second_guard_v1 34.4%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_low_stone_focus_missed_attack_light_v1<br>本実装候補: 白低石focus攻撃見送り抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 34.8 | 13-19-0 | 40.6% | 40.6% (13-19-0) | - | - | 10.5 | 2.4 | wake_up:91, shield:67, master_attack:61 | Ex 28.5%<br>Setup 48.1%<br>LowS 55.6%<br>ShieldConv 41.8%<br>Pygmy 16/88<br>Poly 100% | 0F/0W | 惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 33.3 | 13-19-0 | 40.6% | 40.6% (13-19-0) | - | - | 10.3 | 3.1 | shield:94, wake_up:91, master_attack:68 | Ex 26.2%<br>Setup 51.6%<br>LowS 47.7%<br>ShieldConv 41.5%<br>Pygmy 18/113<br>Poly 50% | 0F/0W | 盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_low_stone_focus_conversion_v1<br>本実装候補: 白低石focus成果化+8 | hybrid | pressure-normal<br>通常プレッシャー | 29.6 | 11-21-0 | 34.4% | 34.4% (11-21-0) | - | - | 9.9 | 3.4 | shield:99, wake_up:93, master_attack:68 | Ex 25.7%<br>Setup 52.9%<br>LowS 51.8%<br>ShieldConv 38.4%<br>Pygmy 21/147<br>Poly 75% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | pressure_white_threat_left_focus_missed_attack_v1<br>本実装候補: 白脅威残り布石+対黒focus手がかり | hybrid | pressure-normal<br>通常プレッシャー | 29.1 | 11-21-0 | 34.4% | 34.4% (11-21-0) | - | - | 9.8 | 2.9 | wake_up:84, shield:78, master_attack:70 | Ex 27.2%<br>Setup 50.8%<br>LowS 50.5%<br>ShieldConv 47.4%<br>Pygmy 26/116<br>Poly 50% | 0F/0W | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 5 | pressure_white_shield_quality_second_guard_v1<br>本実装候補: 白盾品質+2枚目抑制 | hybrid | pressure-normal<br>通常プレッシャー | 28.1 | 11-21-0 | 34.4% | 34.4% (11-21-0) | - | - | 9.9 | 3.7 | wake_up:89, master_attack:68, shield:65 | Ex 27.2%<br>Setup 50.6%<br>LowS 55.6%<br>ShieldConv 40%<br>Pygmy 27/125<br>Poly 40% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_low_stone_focus_missed_attack_light_v1<br>本実装候補: 白低石focus攻撃見送り抑制軽量 | 白マスター限定で、攻撃という同ターンの仕事が残っている低石focusだけを軽く抑える。 | situational whiteLowStoneFocusMissedAttackPenalty:4 | 34.8 | 40.6% | 40.6% (13-19-0) | - | - | wake_up:91, shield:67, master_attack:61 | Ex 28.5%<br>Setup 48.1%<br>LowS 55.6%<br>ShieldConv 41.8%<br>Pygmy 16/88<br>Poly 100% | 惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 33.3 | 40.6% | 40.6% (13-19-0) | - | - | shield:94, wake_up:91, master_attack:68 | Ex 26.2%<br>Setup 51.6%<br>LowS 47.7%<br>ShieldConv 41.5%<br>Pygmy 18/113<br>Poly 50% | 盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_low_stone_focus_conversion_v1<br>本実装候補: 白低石focus成果化+8 | 白マスター限定で、低石でも次ターン攻撃/レベルアップへ変換できるfocusだけを加点する。 | situational whiteLowStoneFocusConversionBonus:8 | 29.6 | 34.4% | 34.4% (11-21-0) | - | - | shield:99, wake_up:93, master_attack:68 | Ex 25.7%<br>Setup 52.9%<br>LowS 51.8%<br>ShieldConv 38.4%<br>Pygmy 21/147<br>Poly 75% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | pressure_white_threat_left_focus_missed_attack_v1<br>本実装候補: 白脅威残り布石+対黒focus手がかり | 汎用の脅威残り低石布石抑制に、黒限定で有効だった攻撃見送りfocus抑制を軽く混ぜ、副作用の有無を見る。 | situational whiteThreatLeftLowStoneSetupPenalty:6, whiteLowStoneFocusMissedAttackPenalty:4 | 29.1 | 34.4% | 34.4% (11-21-0) | - | - | wake_up:84, shield:78, master_attack:70 | Ex 27.2%<br>Setup 50.8%<br>LowS 50.5%<br>ShieldConv 47.4%<br>Pygmy 26/116<br>Poly 50% | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 5 | pressure_white_shield_quality_second_guard_v1<br>本実装候補: 白盾品質+2枚目抑制 | 質の高い盾を押しつつ、2枚目低石シールドの全力投入を抑える。 | situational whiteShieldThreatConversionBonus:8, whiteSecondShieldLowStonePenalty:8 | 28.1 | 34.4% | 34.4% (11-21-0) | - | - | wake_up:89, master_attack:68, shield:65 | Ex 27.2%<br>Setup 50.6%<br>LowS 55.6%<br>ShieldConv 40%<br>Pygmy 27/125<br>Poly 40% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 6 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_conversion_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_conversion_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_conversion_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_conversion_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 7 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 7 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 6 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 5 / D 0 | 0F/0W |

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
