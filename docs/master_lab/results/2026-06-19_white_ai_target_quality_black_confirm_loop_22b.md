# White AI Tuning Loop

生成: 2026-06-18T23:15:47.898Z
候補: 3
相手: black_pressure_strong, black_pressure_pressure
試行: 8 games/matchup/direction
総試合: 96

## Conclusion

首位は `pressure_white_baseline`（score 34.2 / overall 40.6% / vs Black 40.6%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: pressure_white_baseline 40.6% / pressure_white_second_shield_guard_v1 34.4% / pressure_white_shield_threat_conversion_v1 21.9%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 34.2 | 13-19-0 | 40.6% | 40.6% (13-19-0) | - | - | 10.3 | 3.6 | wake_up:103, shield:95, master_attack:77 | Ex 26.2%<br>Setup 51.8%<br>LowS 51.8%<br>ShieldConv 33.7%<br>Pygmy 25/141<br>Poly 87.5% | 0F/0W | 盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_second_shield_guard_v1<br>本実装候補: 白2枚目低石盾抑制 | hybrid | pressure-normal<br>通常プレッシャー | 30.4 | 11-21-0 | 34.4% | 34.4% (11-21-0) | - | - | 10.2 | 3.8 | shield:87, wake_up:86, master_attack:77 | Ex 27.4%<br>Setup 49.1%<br>LowS 53.3%<br>ShieldConv 35.6%<br>Pygmy 16/111<br>Poly 100% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_shield_threat_conversion_v1<br>本実装候補: 白盾脅威/成果化+8 | hybrid | pressure-normal<br>通常プレッシャー | 20.4 | 7-25-0 | 21.9% | 21.9% (7-25-0) | - | - | 10.6 | 3.3 | wake_up:100, shield:94, master_attack:74 | Ex 26%<br>Setup 51.2%<br>LowS 54.9%<br>ShieldConv 40.4%<br>Pygmy 40/175<br>Poly 66.7% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 34.2 | 40.6% | 40.6% (13-19-0) | - | - | wake_up:103, shield:95, master_attack:77 | Ex 26.2%<br>Setup 51.8%<br>LowS 51.8%<br>ShieldConv 33.7%<br>Pygmy 25/141<br>Poly 87.5% | 盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_second_shield_guard_v1<br>本実装候補: 白2枚目低石盾抑制 | 白マスター限定で、同ターン2枚目以降のシールドで残石1以下になる過剰コミットを抑える。 | situational whiteSecondShieldLowStonePenalty:8 | 30.4 | 34.4% | 34.4% (11-21-0) | - | - | shield:87, wake_up:86, master_attack:77 | Ex 27.4%<br>Setup 49.1%<br>LowS 53.3%<br>ShieldConv 35.6%<br>Pygmy 16/111<br>Poly 100% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_shield_threat_conversion_v1<br>本実装候補: 白盾脅威/成果化+8 | 白マスター限定で、脅威軽減または次ターン成果化が見えるシールドだけを加点する。 | situational whiteShieldThreatConversionBonus:8 | 20.4 | 21.9% | 21.9% (7-25-0) | - | - | wake_up:100, shield:94, master_attack:74 | Ex 26%<br>Setup 51.2%<br>LowS 54.9%<br>ShieldConv 40.4%<br>Pygmy 40/175<br>Poly 66.7% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 7 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 6 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 2 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 8 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 5 / C 3 / D 0 | 0F/0W |

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
