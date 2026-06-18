# White AI Tuning Loop

生成: 2026-06-18T15:44:48.024Z
候補: 3
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 6 games/matchup/direction
総試合: 144

## Conclusion

首位は `pressure_white_low_stone_focus_light_v1`（score 45.2 / overall 47.9% / vs Black 33.3%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +8.3%。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: pressure_white_low_stone_focus_light_v1 33.3% / pressure_white_baseline 25% / pressure_white_low_stone_focus_guard_v1 16.7%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_low_stone_focus_light_v1<br>本実装候補: 白低石focus抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 45.2 | 23-25-0 | 47.9% | 33.3% (8-16-0) | 50% (6-6-0) | 75% (9-3-0) | 11.4 | 3.5 | shield:189, wake_up:133, master_attack:75 | Ex 23.6%<br>Setup 52.9%<br>LowS 54.6%<br>ShieldConv 43.9%<br>Pygmy 42/188<br>Poly 87.5% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 33.5 | 18-30-0 | 37.5% | 25% (6-18-0) | 33.3% (4-8-0) | 66.7% (8-4-0) | 12.9 | 3 | shield:157, wake_up:152, master_attack:109 | Ex 22.6%<br>Setup 52.2%<br>LowS 55.2%<br>ShieldConv 36.3%<br>Pygmy 52/250<br>Poly 38.9% | 0F/0W | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_low_stone_focus_guard_v1<br>本実装候補: 白低石focus+盾起動抑制 | hybrid | pressure-normal<br>通常プレッシャー | 31.8 | 18-30-0 | 37.5% | 16.7% (4-20-0) | 50% (6-6-0) | 66.7% (8-4-0) | 11 | 3.4 | shield:156, wake_up:118, master_attack:87 | Ex 24.3%<br>Setup 51.4%<br>LowS 54.4%<br>ShieldConv 40.4%<br>Pygmy 22/175<br>Poly 46.2% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_low_stone_focus_light_v1<br>本実装候補: 白低石focus抑制軽量 | focus抑制を薄く入れ、待ちすぎの副作用を抑えながら石枯渇を減らす。 | situational whiteLowStoneFocusPenalty:4 | 45.2 | 47.9% | 33.3% (8-16-0) | 50% (6-6-0) | 75% (9-3-0) | shield:189, wake_up:133, master_attack:75 | Ex 23.6%<br>Setup 52.9%<br>LowS 54.6%<br>ShieldConv 43.9%<br>Pygmy 42/188<br>Poly 87.5% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 33.5 | 37.5% | 25% (6-18-0) | 33.3% (4-8-0) | 66.7% (8-4-0) | shield:157, wake_up:152, master_attack:109 | Ex 22.6%<br>Setup 52.2%<br>LowS 55.2%<br>ShieldConv 36.3%<br>Pygmy 52/250<br>Poly 38.9% | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_low_stone_focus_guard_v1<br>本実装候補: 白低石focus+盾起動抑制 | 低石focusを主対象にしつつ、シールド/ウェイクアップの低石化も薄く抑える。 | situational whiteLowStoneFocusPenalty:6, whiteLowStoneShieldPenalty:4, whiteLowStoneWakePenalty:4 | 31.8 | 37.5% | 16.7% (4-20-0) | 50% (6-6-0) | 66.7% (8-4-0) | shield:156, wake_up:118, master_attack:87 | Ex 24.3%<br>Setup 51.4%<br>LowS 54.4%<br>ShieldConv 40.4%<br>Pygmy 22/175<br>Poly 46.2% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 0 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 0 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_guard_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_guard_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_guard_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 6 / C 0 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_guard_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |

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
