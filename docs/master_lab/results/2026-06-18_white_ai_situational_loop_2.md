# White AI Tuning Loop

生成: 2026-06-18T06:01:19.949Z
候補: 5
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 10 games/matchup/direction
総試合: 400

## Conclusion

首位は `pressure_attack_monster_plus4`（score 51.2 / overall 48.8% / vs Black 52.5%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +20%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_attack_monster_plus4 52.5% / pressure_attack_monster4_anti_berserk_front 37.5% / pressure_white_baseline 32.5% / pressure_attack_monster4_stone_conserve 37.5% / pressure_attack_monster4_shield_convert 27.5%。

### Next Steps

- 次は `pressure_attack_monster_plus4` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | action_bias | pressure-normal<br>通常プレッシャー | 51.2 | 39-41-0 | 48.8% | 52.5% (21-19-0) | 45% (9-11-0) | 45% (9-11-0) | 12.5 | 3.1 | shield:337, wake_up:241, master_attack:171 | Ex 23.3%<br>Setup 52.7%<br>LowS 54%<br>ShieldConv 40.1%<br>Pygmy 91/448<br>Poly 62.5% | 0F/0W | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_attack_monster4_anti_berserk_front<br>状況: attack_monster+4 / 対黒前衛処理 | hybrid | pressure-normal<br>通常プレッシャー | 48.2 | 40-40-0 | 50% | 37.5% (15-25-0) | 65% (13-7-0) | 60% (12-8-0) | 13.2 | 3.6 | shield:313, wake_up:266, master_attack:186 | Ex 22.2%<br>Setup 52.1%<br>LowS 53.8%<br>ShieldConv 40.6%<br>Pygmy 121/490<br>Poly 66.7% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 46.4 | 39-41-0 | 48.8% | 32.5% (13-27-0) | 65% (13-7-0) | 65% (13-7-0) | 12.1 | 3.4 | shield:317, wake_up:225, master_attack:167 | Ex 22.7%<br>Setup 51.8%<br>LowS 52.5%<br>ShieldConv 42.9%<br>Pygmy 66/412<br>Poly 85.7% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | pressure_attack_monster4_stone_conserve<br>状況: attack_monster+4 / 石温存 | hybrid | pressure-normal<br>通常プレッシャー | 42.1 | 32-48-0 | 40% | 37.5% (15-25-0) | 45% (9-11-0) | 40% (8-12-0) | 12.7 | 3.5 | shield:342, wake_up:260, master_attack:185 | Ex 21.6%<br>Setup 52.9%<br>LowS 48.6%<br>ShieldConv 33.3%<br>Pygmy 78/498<br>Poly 63.6% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 5 | pressure_attack_monster4_shield_convert<br>状況: attack_monster+4 / 成果化シールド | hybrid | pressure-normal<br>通常プレッシャー | 35.4 | 28-52-0 | 35% | 27.5% (11-29-0) | 45% (9-11-0) | 40% (8-12-0) | 13.2 | 3 | shield:386, wake_up:269, master_attack:169 | Ex 22.8%<br>Setup 52.6%<br>LowS 54.7%<br>ShieldConv 41.7%<br>Pygmy 91/511<br>Poly 60.9% | 0F/0W | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | 盤面制圧補正を薄く入れ、+8より副作用が少ないか見る。 | action attack_monster+4 | 51.2 | 48.8% | 52.5% (21-19-0) | 45% (9-11-0) | 45% (9-11-0) | shield:337, wake_up:241, master_attack:171 | Ex 23.3%<br>Setup 52.7%<br>LowS 54%<br>ShieldConv 40.1%<br>Pygmy 91/448<br>Poly 62.5% | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_attack_monster4_anti_berserk_front<br>状況: attack_monster+4 / 対黒前衛処理 | 黒相手のバーサク打点源になりやすい敵前衛処理だけを状況加点する。 | action attack_monster+4<br>situational antiBerserkFrontBonus:16 | 48.2 | 50% | 37.5% (15-25-0) | 65% (13-7-0) | 60% (12-8-0) | shield:313, wake_up:266, master_attack:186 | Ex 22.2%<br>Setup 52.1%<br>LowS 53.8%<br>ShieldConv 40.6%<br>Pygmy 121/490<br>Poly 66.7% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 46.4 | 48.8% | 32.5% (13-27-0) | 65% (13-7-0) | 65% (13-7-0) | shield:317, wake_up:225, master_attack:167 | Ex 22.7%<br>Setup 51.8%<br>LowS 52.5%<br>ShieldConv 42.9%<br>Pygmy 66/412<br>Poly 85.7% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | pressure_attack_monster4_stone_conserve<br>状況: attack_monster+4 / 石温存 | 盤面処理補正は残し、布石後に石が1以下になる手を少し抑える。 | action attack_monster+4<br>situational setupLowStonePenalty:12 | 42.1 | 40% | 37.5% (15-25-0) | 45% (9-11-0) | 40% (8-12-0) | shield:342, wake_up:260, master_attack:185 | Ex 21.6%<br>Setup 52.9%<br>LowS 48.6%<br>ShieldConv 33.3%<br>Pygmy 78/498<br>Poly 63.6% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 5 | pressure_attack_monster4_shield_convert<br>状況: attack_monster+4 / 成果化シールド | シールド対象が次ターン攻撃・撃破・レベルアップへ変換できる時だけ少し押す。 | action attack_monster+4<br>situational shieldConversionBonus:12 | 35.4 | 35% | 27.5% (11-29-0) | 45% (9-11-0) | 40% (8-12-0) | shield:386, wake_up:269, master_attack:169 | Ex 22.8%<br>Setup 52.6%<br>LowS 54.7%<br>ShieldConv 41.7%<br>Pygmy 91/511<br>Poly 60.9% | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 8 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 6 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 7 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 6 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 3 / C 7 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 8 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 5 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_player | player | black_pressure_strong | P 6 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_decoy_back_stable_player | player | decoy_back_stable | P 6 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 7 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_white_pressure_strong_player | player | white_pressure_strong | P 5 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 6 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster4_stone_conserve_vs_black_pressure_strong_player | player | black_pressure_strong | P 4 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster4_stone_conserve_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster4_stone_conserve_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 9 / D 0 | 0F/0W |
| pressure_attack_monster4_stone_conserve_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster4_stone_conserve_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster4_stone_conserve_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 5 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster4_stone_conserve_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster4_stone_conserve_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 6 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster4_shield_convert_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 9 / D 0 | 0F/0W |
| pressure_attack_monster4_shield_convert_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 7 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster4_shield_convert_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster4_shield_convert_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 5 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster4_shield_convert_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster4_shield_convert_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 5 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster4_shield_convert_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster4_shield_convert_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster4_anti_berserk_front_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster4_anti_berserk_front_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster4_anti_berserk_front_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster4_anti_berserk_front_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster4_anti_berserk_front_vs_decoy_back_stable_player | player | decoy_back_stable | P 5 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster4_anti_berserk_front_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster4_anti_berserk_front_vs_white_pressure_strong_player | player | white_pressure_strong | P 5 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster4_anti_berserk_front_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 7 / D 0 | 0F/0W |

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
