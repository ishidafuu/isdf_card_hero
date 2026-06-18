# White AI Tuning Loop

生成: 2026-06-18T07:29:06.169Z
候補: 3
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 15 games/matchup/direction
総試合: 360

## Conclusion

首位は `pressure_attack_monster_plus4`（score 48.1 / overall 46.7% / vs Black 50%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +15%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_attack_monster_plus4 50% / pressure_white_baseline 35% / pressure_white_monster_pressure_v1 33.3%。

### Next Steps

- 次は `pressure_attack_monster_plus4` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | action_bias | pressure-normal<br>通常プレッシャー | 48.1 | 56-64-0 | 46.7% | 50% (30-30-0) | 46.7% (14-16-0) | 40% (12-18-0) | 12.7 | 3 | shield:540, wake_up:377, master_attack:251 | Ex 22.4%<br>Setup 52.3%<br>LowS 54.2%<br>ShieldConv 39.3%<br>Pygmy 118/705<br>Poly 39.3% | 0F/0W | 黒耐性あり<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 41.6 | 50-70-0 | 41.7% | 35% (21-39-0) | 40% (12-18-0) | 56.7% (17-13-0) | 12.7 | 3.3 | shield:492, wake_up:383, master_attack:274 | Ex 22.2%<br>Setup 53.1%<br>LowS 53.8%<br>ShieldConv 35.8%<br>Pygmy 115/706<br>Poly 76.2% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_monster_pressure_v1<br>本実装候補: 白盤面処理+4 | hybrid | pressure-normal<br>通常プレッシャー | 40.6 | 49-71-0 | 40.8% | 33.3% (20-40-0) | 53.3% (16-14-0) | 43.3% (13-17-0) | 12.6 | 3.2 | shield:474, wake_up:367, master_attack:280 | Ex 23%<br>Setup 51.7%<br>LowS 53.2%<br>ShieldConv 35.4%<br>Pygmy 94/619<br>Poly 53.1% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | 盤面制圧補正を薄く入れ、+8より副作用が少ないか見る。 | action attack_monster+4 | 48.1 | 46.7% | 50% (30-30-0) | 46.7% (14-16-0) | 40% (12-18-0) | shield:540, wake_up:377, master_attack:251 | Ex 22.4%<br>Setup 52.3%<br>LowS 54.2%<br>ShieldConv 39.3%<br>Pygmy 118/705<br>Poly 39.3% | 黒耐性あり<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 41.6 | 41.7% | 35% (21-39-0) | 40% (12-18-0) | 56.7% (17-13-0) | shield:492, wake_up:383, master_attack:274 | Ex 22.2%<br>Setup 53.1%<br>LowS 53.8%<br>ShieldConv 35.8%<br>Pygmy 115/706<br>Poly 76.2% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_monster_pressure_v1<br>本実装候補: 白盤面処理+4 | 白マスター限定で、敵モンスターへの実ダメージ/撃破評価だけを薄く上げる。 | situational whiteMonsterPressureBonus:4 | 40.6 | 40.8% | 33.3% (20-40-0) | 53.3% (16-14-0) | 43.3% (13-17-0) | shield:474, wake_up:367, master_attack:280 | Ex 23%<br>Setup 51.7%<br>LowS 53.2%<br>ShieldConv 35.4%<br>Pygmy 94/619<br>Poly 53.1% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 13 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 10 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 6 / C 9 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 7 / C 8 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 5 / C 10 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 8 / C 7 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 9 / C 6 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 7 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_player | player | black_pressure_strong | P 7 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 6 / C 9 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 6 / C 9 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 7 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_decoy_back_stable_player | player | decoy_back_stable | P 9 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 10 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_white_pressure_strong_player | player | white_pressure_strong | P 5 / C 10 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 8 / C 7 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 4 / C 11 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 8 / C 7 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 6 / C 9 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 12 / C 3 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 8 / C 7 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 7 / C 8 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 5 / C 10 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 7 / C 8 / D 0 | 0F/0W |

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
