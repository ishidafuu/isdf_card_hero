# White AI Tuning Loop

生成: 2026-06-23T03:17:40.794Z
候補: 3
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 4 games/matchup/direction
総試合: 96

## Conclusion

首位は `pressure_white_baseline`（score 49.9 / overall 50% / vs Black 43.8%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: pressure_white_baseline 43.8% / pressure_white_shield_quality_second_guard_v1 37.5% / pressure_white_shield_threat_conversion_v1 18.8%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 首位はシールド寄り。確認ループでは `wake_up` 補正を少し足す条件を横に置き、守った後の勝ち切り不足を確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 49.9 | 16-16-0 | 50% | 43.8% (7-9-0) | 50% (4-4-0) | 62.5% (5-3-0) | 12.6 | 3.4 | shield:174, wake_up:76, master_attack:56 | Ex 23.2%<br>Setup 49.9%<br>LowS 55.6%<br>ShieldConv 50%<br>Pygmy 33/168<br>Poly 66.7% | 0F/0W | シールド偏重<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_shield_quality_second_guard_v1<br>本実装候補: 白盾品質+2枚目抑制 | hybrid | pressure-normal<br>通常プレッシャー | 33 | 10-22-0 | 31.3% | 37.5% (6-10-0) | 12.5% (1-7-0) | 37.5% (3-5-0) | 13.6 | 3.5 | shield:225, wake_up:91, master_attack:63 | Ex 21.2%<br>Setup 52.7%<br>LowS 54.9%<br>ShieldConv 46.7%<br>Pygmy 43/222<br>Poly 70% | 0F/0W | 黒に弱い<br>シールド偏重<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_shield_threat_conversion_v1<br>本実装候補: 白盾脅威/成果化+8 | hybrid | pressure-normal<br>通常プレッシャー | 29.7 | 11-21-0 | 34.4% | 18.8% (3-13-0) | 25% (2-6-0) | 75% (6-2-0) | 12.8 | 3.2 | shield:157, wake_up:101, master_attack:70 | Ex 22.3%<br>Setup 52.1%<br>LowS 53.7%<br>ShieldConv 45.2%<br>Pygmy 41/175<br>Poly 50% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 49.9 | 50% | 43.8% (7-9-0) | 50% (4-4-0) | 62.5% (5-3-0) | shield:174, wake_up:76, master_attack:56 | Ex 23.2%<br>Setup 49.9%<br>LowS 55.6%<br>ShieldConv 50%<br>Pygmy 33/168<br>Poly 66.7% | シールド偏重<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_shield_quality_second_guard_v1<br>本実装候補: 白盾品質+2枚目抑制 | 質の高い盾を押しつつ、2枚目低石シールドの全力投入を抑える。 | situational whiteShieldThreatConversionBonus:8, whiteSecondShieldLowStonePenalty:8 | 33 | 31.3% | 37.5% (6-10-0) | 12.5% (1-7-0) | 37.5% (3-5-0) | shield:225, wake_up:91, master_attack:63 | Ex 21.2%<br>Setup 52.7%<br>LowS 54.9%<br>ShieldConv 46.7%<br>Pygmy 43/222<br>Poly 70% | 黒に弱い<br>シールド偏重<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_shield_threat_conversion_v1<br>本実装候補: 白盾脅威/成果化+8 | 白マスター限定で、脅威軽減または次ターン成果化が見えるシールドだけを加点する。 | situational whiteShieldThreatConversionBonus:8 | 29.7 | 34.4% | 18.8% (3-13-0) | 25% (2-6-0) | 75% (6-2-0) | shield:157, wake_up:101, master_attack:70 | Ex 22.3%<br>Setup 52.1%<br>LowS 53.7%<br>ShieldConv 45.2%<br>Pygmy 41/175<br>Poly 50% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |

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
