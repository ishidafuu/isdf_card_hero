# White AI Tuning Loop

生成: 2026-06-18T01:35:31.508Z
候補: 8
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 12 games/matchup/direction
総試合: 768

## Conclusion

首位は `pressure_attack_monster_plus4`（score 51.8 / overall 50% / vs Black 45.8%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +6.2%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_attack_monster_plus4 45.8% / pressure_attack_monster8_shield4 43.8% / stone_guard_no_proactive_shield 41.7% / weights_deny_attack_monster8 37.5% / wounded_levelup_setup 33.3%。

### Next Steps

- 次は `pressure_attack_monster_plus4` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | action_bias | pressure-normal<br>通常プレッシャー | 51.8 | 48-48-0 | 50% | 45.8% (22-26-0) | 58.3% (14-10-0) | 50% (12-12-0) | 12.6 | 3.6 | shield:392, wake_up:288, master_attack:197 | Ex 22.8%<br>Setup 51.9%<br>LowS 52.3%<br>ShieldConv 48.5%<br>Pygmy 80/498<br>Poly 76% | 0F/0W | 盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_attack_monster8_shield4<br>混合: attack_monster+8 / shield+4 | action_bias | pressure-normal<br>通常プレッシャー | 50.8 | 47-49-0 | 49% | 43.8% (21-27-0) | 66.7% (16-8-0) | 41.7% (10-14-0) | 12.8 | 3.2 | shield:498, wake_up:307, master_attack:189 | Ex 22.5%<br>Setup 53%<br>LowS 55.4%<br>ShieldConv 50.2%<br>Pygmy 121/671<br>Poly 75% | 0F/0W | 盾の成果化不足<br>布石後の石枯渇 |
| 3 | stone_guard_no_proactive_shield<br>診断: 石温存 / 予防シールド抑制 | weights | pressure-normal<br>通常プレッシャー | 50.2 | 47-49-0 | 49% | 41.7% (20-28-0) | 75% (18-6-0) | 37.5% (9-15-0) | 13.4 | 3.1 | shield:402, wake_up:350, master_attack:227 | Ex 22.3%<br>Setup 53.1%<br>LowS 51%<br>ShieldConv 49%<br>Pygmy 101/585<br>Poly 64% | 0F/0W | 盾の成果化不足<br>布石後の石枯渇 |
| 4 | weights_deny_attack_monster8<br>重み: 拒否 + attack_monster+8 | weights | pressure-normal<br>通常プレッシャー | 49.1 | 49-47-0 | 51% | 37.5% (18-30-0) | 66.7% (16-8-0) | 62.5% (15-9-0) | 13.5 | 3.1 | shield:423, wake_up:334, master_attack:200 | Ex 22.7%<br>Setup 52.1%<br>LowS 54%<br>ShieldConv 57%<br>Pygmy 105/608<br>Poly 61.9% | 0F/0W | 黒に弱い<br>布石後の石枯渇 |
| 5 | wounded_levelup_setup<br>診断: 負傷レベルアップ布石 | weights | pressure-normal<br>通常プレッシャー | 45.1 | 45-51-0 | 46.9% | 33.3% (16-32-0) | 66.7% (16-8-0) | 54.2% (13-11-0) | 12.7 | 3.6 | shield:394, wake_up:270, master_attack:204 | Ex 22.6%<br>Setup 52.4%<br>LowS 54.2%<br>ShieldConv 52.3%<br>Pygmy 113/569<br>Poly 55.9% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 6 | pressure_attack_monster4_shield2<br>混合: attack_monster+4 / shield+2 | action_bias | pressure-normal<br>通常プレッシャー | 44.5 | 45-51-0 | 46.9% | 33.3% (16-32-0) | 54.2% (13-11-0) | 66.7% (16-8-0) | 13 | 3.6 | shield:395, wake_up:324, master_attack:223 | Ex 22.7%<br>Setup 52.4%<br>LowS 52.9%<br>ShieldConv 51.1%<br>Pygmy 91/550<br>Poly 65.7% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 7 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 43.2 | 40-56-0 | 41.7% | 39.6% (19-29-0) | 41.7% (10-14-0) | 45.8% (11-13-0) | 12.9 | 3.2 | shield:442, wake_up:313, master_attack:198 | Ex 21.8%<br>Setup 53.1%<br>LowS 53.7%<br>ShieldConv 52.9%<br>Pygmy 118/643<br>Poly 47.4% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 8 | pressure_attack_monster_plus8<br>攻撃: attack_monster+8 | action_bias | pressure-normal<br>通常プレッシャー | 38.6 | 51-45-0 | 53.1% | 41.7% (20-28-0) | 62.5% (15-9-0) | 66.7% (16-8-0) | 13 | 3.4 | shield:469, wake_up:329, master_attack:218 | Ex 22.8%<br>Setup 52.3%<br>LowS 54%<br>ShieldConv 56.3%<br>Pygmy 101/618<br>Poly 39.1% | 0F/2W | warning 2<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | 盤面制圧補正を薄く入れ、+8より副作用が少ないか見る。 | action attack_monster+4 | 51.8 | 50% | 45.8% (22-26-0) | 58.3% (14-10-0) | 50% (12-12-0) | shield:392, wake_up:288, master_attack:197 | Ex 22.8%<br>Setup 51.9%<br>LowS 52.3%<br>ShieldConv 48.5%<br>Pygmy 80/498<br>Poly 76% | 盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_attack_monster8_shield4<br>混合: attack_monster+8 / shield+4 | 盤面処理を主軸にしつつ、倒されると困る駒だけ少し守る。 | action attack_monster+8, shield+4 | 50.8 | 49% | 43.8% (21-27-0) | 66.7% (16-8-0) | 41.7% (10-14-0) | shield:498, wake_up:307, master_attack:189 | Ex 22.5%<br>Setup 53%<br>LowS 55.4%<br>ShieldConv 50.2%<br>Pygmy 121/671<br>Poly 75% | 盾の成果化不足<br>布石後の石枯渇 |
| 3 | stone_guard_no_proactive_shield<br>診断: 石温存 / 予防シールド抑制 | 石を残し、成果の薄いシールドと非リーサルのマスターアタックを抑える。 | action shield-4, master_attack-4<br>weights stone:9, genericMagicCost:11, futureOwnThreatenedMonster:0.32 | 50.2 | 49% | 41.7% (20-28-0) | 75% (18-6-0) | 37.5% (9-15-0) | shield:402, wake_up:350, master_attack:227 | Ex 22.3%<br>Setup 53.1%<br>LowS 51%<br>ShieldConv 49%<br>Pygmy 101/585<br>Poly 64% | 盾の成果化不足<br>布石後の石枯渇 |
| 4 | weights_deny_attack_monster8<br>重み: 拒否 + attack_monster+8 | 相手レベルアップ拒否と盤面攻撃補正を合わせ、黒速攻を盤面から止める。 | action attack_monster+8<br>weights monsterKillBase:320, futureOpponentLevelUp:0.36, futureOwnThreatenedMonster:0.32 | 49.1 | 51% | 37.5% (18-30-0) | 66.7% (16-8-0) | 62.5% (15-9-0) | shield:423, wake_up:334, master_attack:200 | Ex 22.7%<br>Setup 52.1%<br>LowS 54%<br>ShieldConv 57%<br>Pygmy 105/608<br>Poly 61.9% | 黒に弱い<br>布石後の石枯渇 |
| 5 | wounded_levelup_setup<br>診断: 負傷レベルアップ布石 | 負傷モンスターを守ってレベルアップ回復へ変換する布石を薄く強める。 | action shield+2, attack_monster+4<br>weights futureOwnLevelUp:0.32, futureOpponentLevelUp:0.26, futureOwnThreatenedMonster:0.32, healPerPoint:34 | 45.1 | 46.9% | 33.3% (16-32-0) | 66.7% (16-8-0) | 54.2% (13-11-0) | shield:394, wake_up:270, master_attack:204 | Ex 22.6%<br>Setup 52.4%<br>LowS 54.2%<br>ShieldConv 52.3%<br>Pygmy 113/569<br>Poly 55.9% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 6 | pressure_attack_monster4_shield2<br>混合: attack_monster+4 / shield+2 | 盤面処理と守りを薄く両立し、石枯渇を避ける現実的補正を見る。 | action attack_monster+4, shield+2 | 44.5 | 46.9% | 33.3% (16-32-0) | 54.2% (13-11-0) | 66.7% (16-8-0) | shield:395, wake_up:324, master_attack:223 | Ex 22.7%<br>Setup 52.4%<br>LowS 52.9%<br>ShieldConv 51.1%<br>Pygmy 91/550<br>Poly 65.7% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 7 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 43.2 | 41.7% | 39.6% (19-29-0) | 41.7% (10-14-0) | 45.8% (11-13-0) | shield:442, wake_up:313, master_attack:198 | Ex 21.8%<br>Setup 53.1%<br>LowS 53.7%<br>ShieldConv 52.9%<br>Pygmy 118/643<br>Poly 47.4% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 8 | pressure_attack_monster_plus8<br>攻撃: attack_monster+8 | 盤面制圧を少し厚くし、黒の前のめり展開を止める。 | action attack_monster+8 | 38.6 | 53.1% | 41.7% (20-28-0) | 62.5% (15-9-0) | 66.7% (16-8-0) | shield:469, wake_up:329, master_attack:218 | Ex 22.8%<br>Setup 52.3%<br>LowS 54%<br>ShieldConv 56.3%<br>Pygmy 101/618<br>Poly 39.1% | warning 2<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 4 / C 8 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 6 / C 6 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 5 / C 7 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 8 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 5 / C 7 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 7 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 8 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 5 / C 7 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_player | player | black_pressure_strong | P 5 / C 7 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 9 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 8 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_decoy_back_stable_player | player | decoy_back_stable | P 6 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 4 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_white_pressure_strong_player | player | white_pressure_strong | P 6 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 6 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_strong_player | player | black_pressure_strong | P 6 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 8 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 6 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 8 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_decoy_back_stable_player | player | decoy_back_stable | P 9 / C 3 / D 0 | 0F/2W |
| pressure_attack_monster_plus8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 6 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_white_pressure_strong_player | player | white_pressure_strong | P 7 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 9 / D 0 | 0F/0W |
| pressure_attack_monster4_shield2_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 11 / D 0 | 0F/0W |
| pressure_attack_monster4_shield2_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 8 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster4_shield2_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 7 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster4_shield2_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 8 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster4_shield2_vs_decoy_back_stable_player | player | decoy_back_stable | P 6 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster4_shield2_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 5 / C 7 / D 0 | 0F/0W |
| pressure_attack_monster4_shield2_vs_white_pressure_strong_player | player | white_pressure_strong | P 8 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster4_shield2_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_black_pressure_strong_player | player | black_pressure_strong | P 4 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 7 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 5 / C 7 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 5 / C 7 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_decoy_back_stable_player | player | decoy_back_stable | P 8 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 4 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 6 / C 6 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 9 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 6 / C 6 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 5 / C 7 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 8 / C 4 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_decoy_back_stable_player | player | decoy_back_stable | P 8 / C 4 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 4 / C 8 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_white_pressure_strong_player | player | white_pressure_strong | P 10 / C 2 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 7 / C 5 / D 0 | 0F/0W |
| stone_guard_no_proactive_shield_vs_black_pressure_strong_player | player | black_pressure_strong | P 5 / C 7 / D 0 | 0F/0W |
| stone_guard_no_proactive_shield_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 7 / C 5 / D 0 | 0F/0W |
| stone_guard_no_proactive_shield_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 6 / C 6 / D 0 | 0F/0W |
| stone_guard_no_proactive_shield_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 8 / C 4 / D 0 | 0F/0W |
| stone_guard_no_proactive_shield_vs_decoy_back_stable_player | player | decoy_back_stable | P 7 / C 5 / D 0 | 0F/0W |
| stone_guard_no_proactive_shield_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 11 / D 0 | 0F/0W |
| stone_guard_no_proactive_shield_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 8 / D 0 | 0F/0W |
| stone_guard_no_proactive_shield_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 7 / C 5 / D 0 | 0F/0W |
| wounded_levelup_setup_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 9 / D 0 | 0F/0W |
| wounded_levelup_setup_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 7 / C 5 / D 0 | 0F/0W |
| wounded_levelup_setup_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 6 / C 6 / D 0 | 0F/0W |
| wounded_levelup_setup_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 10 / C 2 / D 0 | 0F/0W |
| wounded_levelup_setup_vs_decoy_back_stable_player | player | decoy_back_stable | P 8 / C 4 / D 0 | 0F/0W |
| wounded_levelup_setup_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 4 / C 8 / D 0 | 0F/0W |
| wounded_levelup_setup_vs_white_pressure_strong_player | player | white_pressure_strong | P 6 / C 6 / D 0 | 0F/0W |
| wounded_levelup_setup_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 5 / C 7 / D 0 | 0F/0W |

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
