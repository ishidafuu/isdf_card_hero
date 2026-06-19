# White AI Tuning Loop

生成: 2026-06-19T01:44:17.268Z
候補: 3
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 8 games/matchup/direction
総試合: 192

## Conclusion

首位は `pressure_white_baseline`（score 43.9 / overall 45.3% / vs Black 31.3%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: pressure_white_baseline 31.3% / pressure_white_low_stone_focus_light_v1 31.3% / pressure_white_focus_wake_quality_v1 31.3%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 43.9 | 29-35-0 | 45.3% | 31.3% (10-22-0) | 56.3% (9-7-0) | 62.5% (10-6-0) | 13.8 | 2.7 | shield:291, wake_up:225, master_attack:144 | Ex 22.2%<br>Setup 51.5%<br>LowS 51.9%<br>ShieldConv 47.4%<br>Pygmy 60/412<br>Poly 85.7% | 0F/0W | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_low_stone_focus_light_v1<br>本実装候補: 白低石focus抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 39.2 | 25-39-0 | 39.1% | 31.3% (10-22-0) | 50% (8-8-0) | 43.8% (7-9-0) | 12.6 | 3.4 | shield:227, wake_up:177, master_attack:136 | Ex 22%<br>Setup 51.1%<br>LowS 52.7%<br>ShieldConv 41.9%<br>Pygmy 54/363<br>Poly 57.1% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_focus_wake_quality_v1<br>本実装候補: 白focus/wake布石品質 | hybrid | pressure-normal<br>通常プレッシャー | 38.5 | 26-38-0 | 40.6% | 31.3% (10-22-0) | 37.5% (6-10-0) | 62.5% (10-6-0) | 12.1 | 3.3 | shield:271, wake_up:196, master_attack:123 | Ex 22.6%<br>Setup 52.9%<br>LowS 53.7%<br>ShieldConv 36.2%<br>Pygmy 61/346<br>Poly 54.5% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 43.9 | 45.3% | 31.3% (10-22-0) | 56.3% (9-7-0) | 62.5% (10-6-0) | shield:291, wake_up:225, master_attack:144 | Ex 22.2%<br>Setup 51.5%<br>LowS 51.9%<br>ShieldConv 47.4%<br>Pygmy 60/412<br>Poly 85.7% | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_low_stone_focus_light_v1<br>本実装候補: 白低石focus抑制軽量 | focus抑制を薄く入れ、待ちすぎの副作用を抑えながら石枯渇を減らす。 | situational whiteLowStoneFocusPenalty:4 | 39.2 | 39.1% | 31.3% (10-22-0) | 50% (8-8-0) | 43.8% (7-9-0) | shield:227, wake_up:177, master_attack:136 | Ex 22%<br>Setup 51.1%<br>LowS 52.7%<br>ShieldConv 41.9%<br>Pygmy 54/363<br>Poly 57.1% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_focus_wake_quality_v1<br>本実装候補: 白focus/wake布石品質 | 低石focusと自陣ウェイクを、消費量ではなく次ターンの仕事へ変換できる品質で押す。 | situational whiteLowStoneFocusConversionBonus:8, whiteWakeSafeWorkBonus:8 | 38.5 | 40.6% | 31.3% (10-22-0) | 37.5% (6-10-0) | 62.5% (10-6-0) | shield:271, wake_up:196, master_attack:123 | Ex 22.6%<br>Setup 52.9%<br>LowS 53.7%<br>ShieldConv 36.2%<br>Pygmy 61/346<br>Poly 54.5% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 7 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 7 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 7 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 6 / C 2 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 7 / C 1 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 7 / C 1 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |

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
