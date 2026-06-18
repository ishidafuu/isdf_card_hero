# White AI Tuning Loop

生成: 2026-06-18T23:13:26.106Z
候補: 3
相手: black_pressure_strong, black_pressure_pressure
試行: 8 games/matchup/direction
総試合: 96

## Conclusion

首位は `pressure_white_baseline`（score 39.8 / overall 50% / vs Black 50%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_white_baseline 50% / pressure_white_shield_threat_conversion_v1 40.6% / pressure_white_second_shield_guard_v1 31.3%。

### Next Steps

- 次は `pressure_white_baseline` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 39.8 | 16-16-0 | 50% | 50% (16-16-0) | - | - | 10 | 2.8 | wake_up:105, shield:73, master_attack:60 | Ex 26.6%<br>Setup 51.4%<br>LowS 56.3%<br>ShieldConv 35.6%<br>Pygmy 26/169<br>Poly 66.7% | 0F/0W | 黒耐性あり<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_shield_threat_conversion_v1<br>本実装候補: 白盾脅威/成果化+8 | hybrid | pressure-normal<br>通常プレッシャー | 33.5 | 13-19-0 | 40.6% | 40.6% (13-19-0) | - | - | 10.5 | 2.5 | shield:91, wake_up:91, master_attack:62 | Ex 26.8%<br>Setup 50.6%<br>LowS 54.3%<br>ShieldConv 46.2%<br>Pygmy 26/125<br>Poly 60% | 0F/0W | 惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_second_shield_guard_v1<br>本実装候補: 白2枚目低石盾抑制 | hybrid | pressure-normal<br>通常プレッシャー | 26.9 | 10-22-0 | 31.3% | 31.3% (10-22-0) | - | - | 11 | 3.4 | shield:108, wake_up:98, master_attack:87 | Ex 26%<br>Setup 51.4%<br>LowS 52.3%<br>ShieldConv 47.2%<br>Pygmy 16/105<br>Poly 54.5% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 39.8 | 50% | 50% (16-16-0) | - | - | wake_up:105, shield:73, master_attack:60 | Ex 26.6%<br>Setup 51.4%<br>LowS 56.3%<br>ShieldConv 35.6%<br>Pygmy 26/169<br>Poly 66.7% | 黒耐性あり<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_shield_threat_conversion_v1<br>本実装候補: 白盾脅威/成果化+8 | 白マスター限定で、脅威軽減または次ターン成果化が見えるシールドだけを加点する。 | situational whiteShieldThreatConversionBonus:8 | 33.5 | 40.6% | 40.6% (13-19-0) | - | - | shield:91, wake_up:91, master_attack:62 | Ex 26.8%<br>Setup 50.6%<br>LowS 54.3%<br>ShieldConv 46.2%<br>Pygmy 26/125<br>Poly 60% | 惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_second_shield_guard_v1<br>本実装候補: 白2枚目低石盾抑制 | 白マスター限定で、同ターン2枚目以降のシールドで残石1以下になる過剰コミットを抑える。 | situational whiteSecondShieldLowStonePenalty:8 | 26.9 | 31.3% | 31.3% (10-22-0) | - | - | shield:108, wake_up:98, master_attack:87 | Ex 26%<br>Setup 51.4%<br>LowS 52.3%<br>ShieldConv 47.2%<br>Pygmy 16/105<br>Poly 54.5% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 2 / D 0 | 0F/0W |

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
