# White AI Tuning Loop

生成: 2026-06-18T23:32:47.631Z
候補: 3
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 8 games/matchup/direction
総試合: 192

## Conclusion

首位は `pressure_white_second_shield_guard_plus12_v1`（score 48.3 / overall 48.4% / vs Black 40.6%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +9.3%。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: pressure_white_second_shield_guard_plus12_v1 40.6% / pressure_white_second_shield_guard_light_v1 37.5% / pressure_white_baseline 31.3%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_second_shield_guard_plus12_v1<br>本実装候補: 白2枚目低石盾抑制+12 | hybrid | pressure-normal<br>通常プレッシャー | 48.3 | 31-33-0 | 48.4% | 40.6% (13-19-0) | 68.8% (11-5-0) | 43.8% (7-9-0) | 13.8 | 3.2 | shield:300, wake_up:232, master_attack:146 | Ex 21.9%<br>Setup 53.3%<br>LowS 54.3%<br>ShieldConv 33.3%<br>Pygmy 73/402<br>Poly 53.8% | 0F/0W | 盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_second_shield_guard_light_v1<br>本実装候補: 白2枚目低石盾抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 40.7 | 26-38-0 | 40.6% | 37.5% (12-20-0) | 31.3% (5-11-0) | 56.3% (9-7-0) | 13.3 | 3.3 | shield:285, wake_up:240, master_attack:158 | Ex 22.2%<br>Setup 53.1%<br>LowS 51.7%<br>ShieldConv 39.6%<br>Pygmy 69/397<br>Poly 66.7% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 40.6 | 26-38-0 | 40.6% | 31.3% (10-22-0) | 50% (8-8-0) | 50% (8-8-0) | 11.9 | 3.4 | shield:241, wake_up:191, master_attack:137 | Ex 23%<br>Setup 52.7%<br>LowS 53.2%<br>ShieldConv 35.3%<br>Pygmy 54/311<br>Poly 81.8% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_second_shield_guard_plus12_v1<br>本実装候補: 白2枚目低石盾抑制+12 | 同ターン2枚目以降の低石シールド抑制を強め、過剰コミットの減少幅を見る。 | situational whiteSecondShieldLowStonePenalty:12 | 48.3 | 48.4% | 40.6% (13-19-0) | 68.8% (11-5-0) | 43.8% (7-9-0) | shield:300, wake_up:232, master_attack:146 | Ex 21.9%<br>Setup 53.3%<br>LowS 54.3%<br>ShieldConv 33.3%<br>Pygmy 73/402<br>Poly 53.8% | 盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_second_shield_guard_light_v1<br>本実装候補: 白2枚目低石盾抑制軽量 | 同ターン2枚目以降の低石シールドだけを軽く抑え、必要な育成防御まで削らないか確認する。 | situational whiteSecondShieldLowStonePenalty:4 | 40.7 | 40.6% | 37.5% (12-20-0) | 31.3% (5-11-0) | 56.3% (9-7-0) | shield:285, wake_up:240, master_attack:158 | Ex 22.2%<br>Setup 53.1%<br>LowS 51.7%<br>ShieldConv 39.6%<br>Pygmy 69/397<br>Poly 66.7% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 40.6 | 40.6% | 31.3% (10-22-0) | 50% (8-8-0) | 50% (8-8-0) | shield:241, wake_up:191, master_attack:137 | Ex 23%<br>Setup 52.7%<br>LowS 53.2%<br>ShieldConv 35.3%<br>Pygmy 54/311<br>Poly 81.8% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 7 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_light_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_light_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 6 / C 2 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_light_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 6 / C 2 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_light_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_plus12_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_plus12_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_plus12_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_plus12_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_plus12_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_plus12_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_plus12_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_second_shield_guard_plus12_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |

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
