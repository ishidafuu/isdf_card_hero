# White AI Tuning Loop

生成: 2026-06-18T23:20:49.647Z
候補: 5
相手: black_pressure_strong, black_pressure_pressure
試行: 6 games/matchup/direction
総試合: 120

## Conclusion

首位は `pressure_white_second_shield_guard_plus12_v1`（score 38.1 / overall 45.8% / vs Black 45.8%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +20.8%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_white_second_shield_guard_plus12_v1 45.8% / pressure_white_second_shield_guard_light_v1 41.7% / pressure_white_shield_threat_conversion_v1 37.5% / pressure_white_baseline 25% / pressure_white_second_shield_guard_v1 20.8%。

### Next Steps

- 次は `pressure_white_second_shield_guard_plus12_v1` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_second_shield_guard_plus12_v1<br>本実装候補: 白2枚目低石盾抑制+12 | hybrid | pressure-normal<br>通常プレッシャー | 38.1 | 11-13-0 | 45.8% | 45.8% (11-13-0) | - | - | 10.8 | - | wake_up:85, shield:60, master_attack:43 | - | 0F/0W | - |
| 2 | pressure_white_second_shield_guard_light_v1<br>本実装候補: 白2枚目低石盾抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 35.2 | 10-14-0 | 41.7% | 41.7% (10-14-0) | - | - | 10.2 | - | wake_up:68, shield:61, master_attack:54 | - | 0F/0W | - |
| 3 | pressure_white_shield_threat_conversion_v1<br>本実装候補: 白盾脅威/成果化+8 | hybrid | pressure-normal<br>通常プレッシャー | 32.3 | 9-15-0 | 37.5% | 37.5% (9-15-0) | - | - | 10.2 | - | shield:78, wake_up:57, master_attack:44 | - | 0F/0W | 黒に弱い |
| 4 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 23.5 | 6-18-0 | 25% | 25% (6-18-0) | - | - | 12 | - | shield:96, wake_up:89, master_attack:57 | - | 0F/0W | 黒に弱い |
| 5 | pressure_white_second_shield_guard_v1<br>本実装候補: 白2枚目低石盾抑制 | hybrid | pressure-normal<br>通常プレッシャー | 20.6 | 5-19-0 | 20.8% | 20.8% (5-19-0) | - | - | 10 | - | shield:86, wake_up:79, master_attack:43 | - | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_second_shield_guard_plus12_v1<br>本実装候補: 白2枚目低石盾抑制+12 | 同ターン2枚目以降の低石シールド抑制を強め、過剰コミットの減少幅を見る。 | situational whiteSecondShieldLowStonePenalty:12 | 38.1 | 45.8% | 45.8% (11-13-0) | - | - | wake_up:85, shield:60, master_attack:43 | - | - |
| 2 | pressure_white_second_shield_guard_light_v1<br>本実装候補: 白2枚目低石盾抑制軽量 | 同ターン2枚目以降の低石シールドだけを軽く抑え、必要な育成防御まで削らないか確認する。 | situational whiteSecondShieldLowStonePenalty:4 | 35.2 | 41.7% | 41.7% (10-14-0) | - | - | wake_up:68, shield:61, master_attack:54 | - | - |
| 3 | pressure_white_shield_threat_conversion_v1<br>本実装候補: 白盾脅威/成果化+8 | 白マスター限定で、脅威軽減または次ターン成果化が見えるシールドだけを加点する。 | situational whiteShieldThreatConversionBonus:8 | 32.3 | 37.5% | 37.5% (9-15-0) | - | - | shield:78, wake_up:57, master_attack:44 | - | 黒に弱い |
| 4 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 23.5 | 25% | 25% (6-18-0) | - | - | shield:96, wake_up:89, master_attack:57 | - | 黒に弱い |
| 5 | pressure_white_second_shield_guard_v1<br>本実装候補: 白2枚目低石盾抑制 | 白マスター限定で、同ターン2枚目以降のシールドで残石1以下になる過剰コミットを抑える。 | situational whiteSecondShieldLowStonePenalty:8 | 20.6 | 20.8% | 20.8% (5-19-0) | - | - | shield:86, wake_up:79, master_attack:43 | - | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 6 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_plus12_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_plus12_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_plus12_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_plus12_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 2 / D 0 | 0F/0W |

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
