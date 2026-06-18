# White AI Tuning Loop

生成: 2026-06-18T07:07:15.305Z
候補: 5
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 12 games/matchup/direction
総試合: 480

## Conclusion

首位は `pressure_attack_monster_plus4`（score 51.9 / overall 50% / vs Black 54.2%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +14.6%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_attack_monster_plus4 54.2% / pressure_attack_monster_plus6 43.8% / pressure_attack_monster_plus2 33.3% / pressure_white_baseline 39.6% / pressure_attack_monster_plus4_shield_minus2 20.8%。

### Next Steps

- 次は `pressure_attack_monster_plus4` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | action_bias | pressure-normal<br>通常プレッシャー | 51.9 | 48-48-0 | 50% | 54.2% (26-22-0) | 54.2% (13-11-0) | 37.5% (9-15-0) | 12.4 | 3.6 | shield:392, wake_up:288, master_attack:195 | Ex 22.4%<br>Setup 52.9%<br>LowS 56%<br>ShieldConv 37.8%<br>Pygmy 118/619<br>Poly 63.6% | 0F/0W | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_attack_monster_plus6<br>攻撃: attack_monster+6 | action_bias | pressure-normal<br>通常プレッシャー | 50.7 | 49-47-0 | 51% | 43.8% (21-27-0) | 66.7% (16-8-0) | 50% (12-12-0) | 13.2 | 3 | shield:416, wake_up:332, master_attack:207 | Ex 23.1%<br>Setup 52.8%<br>LowS 52.7%<br>ShieldConv 34.9%<br>Pygmy 141/708<br>Poly 52.4% | 0F/0W | 惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_attack_monster_plus2<br>攻撃: attack_monster+2 | action_bias | pressure-normal<br>通常プレッシャー | 43.6 | 43-53-0 | 44.8% | 33.3% (16-32-0) | 66.7% (16-8-0) | 45.8% (11-13-0) | 12.3 | 3 | shield:379, wake_up:299, master_attack:246 | Ex 23.5%<br>Setup 52.2%<br>LowS 54.3%<br>ShieldConv 40.9%<br>Pygmy 84/469<br>Poly 53.3% | 0F/0W | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 39.2 | 50-46-0 | 52.1% | 39.6% (19-29-0) | 70.8% (17-7-0) | 58.3% (14-10-0) | 12.3 | 3.5 | shield:384, wake_up:317, master_attack:199 | Ex 22.9%<br>Setup 53.2%<br>LowS 54.5%<br>ShieldConv 42.4%<br>Pygmy 90/523<br>Poly 86.4% | 0F/2W | warning 2<br>黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 5 | pressure_attack_monster_plus4_shield_minus2<br>混合: attack_monster+4 / shield-2 | action_bias | pressure-normal<br>通常プレッシャー | 32.7 | 32-64-0 | 33.3% | 20.8% (10-38-0) | 54.2% (13-11-0) | 37.5% (9-15-0) | 12.7 | 3.5 | shield:382, wake_up:317, master_attack:232 | Ex 21.6%<br>Setup 52.8%<br>LowS 53.5%<br>ShieldConv 41.6%<br>Pygmy 114/650<br>Poly 60.9% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | 盤面制圧補正を薄く入れ、+8より副作用が少ないか見る。 | action attack_monster+4 | 51.9 | 50% | 54.2% (26-22-0) | 54.2% (13-11-0) | 37.5% (9-15-0) | shield:392, wake_up:288, master_attack:195 | Ex 22.4%<br>Setup 52.9%<br>LowS 56%<br>ShieldConv 37.8%<br>Pygmy 118/619<br>Poly 63.6% | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_attack_monster_plus6<br>攻撃: attack_monster+6 | 盤面制圧補正を+4より少し強め、黒耐性と白基準への勝ちすぎを確認する。 | action attack_monster+6 | 50.7 | 51% | 43.8% (21-27-0) | 66.7% (16-8-0) | 50% (12-12-0) | shield:416, wake_up:332, master_attack:207 | Ex 23.1%<br>Setup 52.8%<br>LowS 52.7%<br>ShieldConv 34.9%<br>Pygmy 141/708<br>Poly 52.4% | 惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_attack_monster_plus2<br>攻撃: attack_monster+2 | 盤面制圧補正を最小限にし、+4が強すぎないかの下限を見る。 | action attack_monster+2 | 43.6 | 44.8% | 33.3% (16-32-0) | 66.7% (16-8-0) | 45.8% (11-13-0) | shield:379, wake_up:299, master_attack:246 | Ex 23.5%<br>Setup 52.2%<br>LowS 54.3%<br>ShieldConv 40.9%<br>Pygmy 84/469<br>Poly 53.3% | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 39.2 | 52.1% | 39.6% (19-29-0) | 70.8% (17-7-0) | 58.3% (14-10-0) | shield:384, wake_up:317, master_attack:199 | Ex 22.9%<br>Setup 53.2%<br>LowS 54.5%<br>ShieldConv 42.4%<br>Pygmy 90/523<br>Poly 86.4% | warning 2<br>黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 5 | pressure_attack_monster_plus4_shield_minus2<br>混合: attack_monster+4 / shield-2 | 盤面処理補正を残しつつ、成果化しないシールドを軽く抑えられるか見る。 | action attack_monster+4, shield-2 | 32.7 | 33.3% | 20.8% (10-38-0) | 54.2% (13-11-0) | 37.5% (9-15-0) | shield:382, wake_up:317, master_attack:232 | Ex 21.6%<br>Setup 52.8%<br>LowS 53.5%<br>ShieldConv 41.6%<br>Pygmy 114/650<br>Poly 60.9% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 4 / C 8 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 7 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 6 / C 6 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 8 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 9 / C 3 / D 0 | 0F/2W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 4 / C 8 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 8 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 6 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus2_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 9 / D 0 | 0F/0W |
| pressure_attack_monster_plus2_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 10 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus2_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 5 / C 7 / D 0 | 0F/0W |
| pressure_attack_monster_plus2_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus2_vs_decoy_back_stable_player | player | decoy_back_stable | P 8 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus2_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 4 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster_plus2_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 9 / D 0 | 0F/0W |
| pressure_attack_monster_plus2_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_player | player | black_pressure_strong | P 5 / C 7 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 9 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 7 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 7 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_decoy_back_stable_player | player | decoy_back_stable | P 6 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 5 / C 7 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 9 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 6 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus6_vs_black_pressure_strong_player | player | black_pressure_strong | P 5 / C 7 / D 0 | 0F/0W |
| pressure_attack_monster_plus6_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 7 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus6_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 6 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus6_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 7 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus6_vs_decoy_back_stable_player | player | decoy_back_stable | P 7 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus6_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 3 / C 9 / D 0 | 0F/0W |
| pressure_attack_monster_plus6_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster_plus6_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_shield_minus2_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 9 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_shield_minus2_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 9 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_shield_minus2_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 10 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_shield_minus2_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 10 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_shield_minus2_vs_decoy_back_stable_player | player | decoy_back_stable | P 7 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_shield_minus2_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 6 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_shield_minus2_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 10 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_shield_minus2_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 5 / C 7 / D 0 | 0F/0W |

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
