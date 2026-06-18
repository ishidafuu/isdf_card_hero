# White AI Tuning Loop

生成: 2026-06-18T14:32:27.854Z
候補: 3
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 6 games/matchup/direction
総試合: 144

## Conclusion

首位は `pressure_attack_monster_plus4`（score 59.5 / overall 62.5% / vs Black 50%）。 現行 `pressure_white_baseline` 比の vs Black 差分は -4.2%。 安定候補（vs Black 45%以上、0F/1W以下）は 2 件。 上位候補: pressure_attack_monster_plus4 50% / pressure_white_baseline 54.2% / pressure_white_enemy_front_attack_v1 20.8%。

### Next Steps

- 次は `pressure_attack_monster_plus4`, `pressure_white_baseline` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | action_bias | pressure-normal<br>通常プレッシャー | 59.5 | 30-18-0 | 62.5% | 50% (12-12-0) | 91.7% (11-1-0) | 58.3% (7-5-0) | 12.1 | 3.6 | shield:203, wake_up:147, master_attack:87 | Ex 23.2%<br>Setup 52.5%<br>LowS 57.6%<br>ShieldConv 35.5%<br>Pygmy 58/319<br>Poly 71.4% | 0F/0W | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 53.8 | 25-23-0 | 52.1% | 54.2% (13-11-0) | 58.3% (7-5-0) | 41.7% (5-7-0) | 12.5 | 3.2 | shield:201, wake_up:145, master_attack:105 | Ex 23.6%<br>Setup 52.4%<br>LowS 55.6%<br>ShieldConv 41.8%<br>Pygmy 44/239<br>Poly 61.5% | 0F/0W | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_enemy_front_attack_v1<br>本実装候補: 白敵前衛攻撃+4 | hybrid | pressure-normal<br>通常プレッシャー | 37.8 | 20-28-0 | 41.7% | 20.8% (5-19-0) | 66.7% (8-4-0) | 58.3% (7-5-0) | 12.3 | 2.6 | shield:182, wake_up:164, master_attack:100 | Ex 23.1%<br>Setup 52.9%<br>LowS 50.3%<br>ShieldConv 41.8%<br>Pygmy 58/281<br>Poly 66.7% | 0F/0W | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | 盤面制圧補正を薄く入れ、+8より副作用が少ないか見る。 | action attack_monster+4 | 59.5 | 62.5% | 50% (12-12-0) | 91.7% (11-1-0) | 58.3% (7-5-0) | shield:203, wake_up:147, master_attack:87 | Ex 23.2%<br>Setup 52.5%<br>LowS 57.6%<br>ShieldConv 35.5%<br>Pygmy 58/319<br>Poly 71.4% | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 53.8 | 52.1% | 54.2% (13-11-0) | 58.3% (7-5-0) | 41.7% (5-7-0) | shield:201, wake_up:145, master_attack:105 | Ex 23.6%<br>Setup 52.4%<br>LowS 55.6%<br>ShieldConv 41.8%<br>Pygmy 44/239<br>Poly 61.5% | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_enemy_front_attack_v1<br>本実装候補: 白敵前衛攻撃+4 | 白マスター限定で、HP減少の有無にかかわらず敵前衛へ攻撃する価値を薄く上げる。 | situational whiteEnemyFrontAttackBonus:4 | 37.8 | 41.7% | 20.8% (5-19-0) | 66.7% (8-4-0) | 58.3% (7-5-0) | shield:182, wake_up:164, master_attack:100 | Ex 23.1%<br>Setup 52.9%<br>LowS 50.3%<br>ShieldConv 41.8%<br>Pygmy 58/281<br>Poly 66.7% | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_decoy_back_stable_player | player | decoy_back_stable | P 5 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 6 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 4 / D 0 | 0F/0W |

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
