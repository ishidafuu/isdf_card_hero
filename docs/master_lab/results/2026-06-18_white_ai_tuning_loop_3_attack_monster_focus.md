# White AI Tuning Loop

生成: 2026-06-17T15:56:02.986Z
候補: 10
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 5 games/matchup/direction
総試合: 400

## Conclusion

首位は `pressure_white_baseline`（score 57.8 / overall 57.5% / vs Black 55%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 3 件。 上位候補: pressure_white_baseline 55% / pressure_attack_monster8_shield4 40% / pressure_attack_monster8_wake4 40% / pressure_attack_monster8_closeout4 50% / weights_deny_attack_monster8 45%。

### Next Steps

- 次は `pressure_white_baseline`, `pressure_attack_monster8_closeout4`, `weights_deny_attack_monster8` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 57.8 | 23-17-0 | 57.5% | 55% (11-9-0) | 50% (5-5-0) | 70% (7-3-0) | 11.8 | 3.3 | shield:163, wake_up:114, master_attack:67 | 0F/0W | 黒耐性あり |
| 2 | pressure_attack_monster8_shield4<br>混合: attack_monster+8 / shield+4 | action_bias | pressure-normal<br>通常プレッシャー | 53 | 22-18-0 | 55% | 40% (8-12-0) | 80% (8-2-0) | 60% (6-4-0) | 13.9 | 3.2 | shield:189, wake_up:122, master_attack:100 | 0F/0W | - |
| 3 | pressure_attack_monster8_wake4<br>混合: attack_monster+8 / wake_up+4 | action_bias | pressure-normal<br>通常プレッシャー | 52.6 | 22-18-0 | 55% | 40% (8-12-0) | 70% (7-3-0) | 70% (7-3-0) | 13.1 | 3.6 | shield:178, wake_up:117, master_attack:105 | 0F/0W | - |
| 4 | pressure_attack_monster8_closeout4<br>混合: attack_monster+8 / attack_master+4 | action_bias | pressure-normal<br>通常プレッシャー | 49.9 | 19-21-0 | 47.5% | 50% (10-10-0) | 40% (4-6-0) | 50% (5-5-0) | 13.1 | 3.6 | shield:153, wake_up:136, master_attack:89 | 0F/0W | 黒耐性あり |
| 5 | weights_deny_attack_monster8<br>重み: 拒否 + attack_monster+8 | weights | pressure-normal<br>通常プレッシャー | 49.8 | 19-21-0 | 47.5% | 45% (9-11-0) | 50% (5-5-0) | 50% (5-5-0) | 13 | 3 | wake_up:142, shield:138, master_attack:93 | 0F/0W | 惜敗多め |
| 6 | pressure_attack_monster_plus12<br>攻撃: attack_monster+12 | action_bias | pressure-normal<br>通常プレッシャー | 47.6 | 19-21-0 | 47.5% | 35% (7-13-0) | 80% (8-2-0) | 40% (4-6-0) | 14.5 | 3.4 | shield:192, wake_up:149, master_attack:101 | 0F/0W | 黒に弱い |
| 7 | balanced_attack_monster8<br>balanced: attack_monster+8 | hybrid | balanced-normal<br>通常バランス | 42.4 | 18-22-0 | 45% | 30% (6-14-0) | 50% (5-5-0) | 70% (7-3-0) | 14.1 | 4.6 | shield:189, wake_up:177, master_attack:100 | 0F/0W | 黒に弱い |
| 8 | pressure_attack_monster_plus8<br>攻撃: attack_monster+8 | action_bias | pressure-normal<br>通常プレッシャー | 42.3 | 16-24-0 | 40% | 35% (7-13-0) | 50% (5-5-0) | 40% (4-6-0) | 13.2 | 3.1 | shield:169, wake_up:142, master_attack:87 | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 57.8 | 57.5% | 55% (11-9-0) | 50% (5-5-0) | 70% (7-3-0) | shield:163, wake_up:114, master_attack:67 | 黒耐性あり |
| 2 | pressure_attack_monster8_shield4<br>混合: attack_monster+8 / shield+4 | 盤面処理を主軸にしつつ、倒されると困る駒だけ少し守る。 | action attack_monster+8, shield+4 | 53 | 55% | 40% (8-12-0) | 80% (8-2-0) | 60% (6-4-0) | shield:189, wake_up:122, master_attack:100 | - |
| 3 | pressure_attack_monster8_wake4<br>混合: attack_monster+8 / wake_up+4 | 盤面処理の補助としてウェイクアップを薄く足し、反撃速度を確保する。 | action attack_monster+8, wake_up+4 | 52.6 | 55% | 40% (8-12-0) | 70% (7-3-0) | 70% (7-3-0) | shield:178, wake_up:117, master_attack:105 | - |
| 4 | pressure_attack_monster8_closeout4<br>混合: attack_monster+8 / attack_master+4 | 盤面処理に寄せすぎた時の決着力不足を本体攻撃補正で補う。 | action attack_monster+8, attack_master+4 | 49.9 | 47.5% | 50% (10-10-0) | 40% (4-6-0) | 50% (5-5-0) | shield:153, wake_up:136, master_attack:89 | 黒耐性あり |
| 5 | weights_deny_attack_monster8<br>重み: 拒否 + attack_monster+8 | 相手レベルアップ拒否と盤面攻撃補正を合わせ、黒速攻を盤面から止める。 | action attack_monster+8<br>weights monsterKillBase:320, futureOpponentLevelUp:0.36, futureOwnThreatenedMonster:0.32 | 49.8 | 47.5% | 45% (9-11-0) | 50% (5-5-0) | 50% (5-5-0) | wake_up:142, shield:138, master_attack:93 | 惜敗多め |
| 6 | pressure_attack_monster_plus12<br>攻撃: attack_monster+12 | 盤面制圧補正を強め、黒耐性の上限と勝ち切り遅延を測る。 | action attack_monster+12 | 47.6 | 47.5% | 35% (7-13-0) | 80% (8-2-0) | 40% (4-6-0) | shield:192, wake_up:149, master_attack:101 | 黒に弱い |
| 7 | balanced_attack_monster8<br>balanced: attack_monster+8 | 標準構成でも盤面処理補正が再現するかを見る。 | action attack_monster+8 | 42.4 | 45% | 30% (6-14-0) | 50% (5-5-0) | 70% (7-3-0) | shield:189, wake_up:177, master_attack:100 | 黒に弱い |
| 8 | pressure_attack_monster_plus8<br>攻撃: attack_monster+8 | 盤面制圧を少し厚くし、黒の前のめり展開を止める。 | action attack_monster+8 | 42.3 | 40% | 35% (7-13-0) | 50% (5-5-0) | 40% (4-6-0) | shield:169, wake_up:142, master_attack:87 | 黒に弱い |
| 9 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | 盤面制圧補正を薄く入れ、+8より副作用が少ないか見る。 | action attack_monster+4 | 38.7 | 35% | 35% (7-13-0) | 40% (4-6-0) | 30% (3-7-0) | shield:190, wake_up:134, master_attack:102 | 黒に弱い<br>惜敗多め |
| 10 | pressure_attack_monster_plus16<br>攻撃: attack_monster+16 | 盤面処理へ強く寄せた時、白らしさを保てるかの上限確認。 | action attack_monster+16 | 30.1 | 32.5% | 30% (6-14-0) | 40% (4-6-0) | 30% (3-7-0) | shield:185, wake_up:127, master_attack:84 | warning 1<br>黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 4 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 4 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus12_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus12_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus12_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus12_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus12_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus12_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus12_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus12_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus16_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus16_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus16_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus16_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus16_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus16_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 3 / D 0 | 0F/1W |
| pressure_attack_monster_plus16_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus16_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 5 / C 0 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster8_wake4_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster8_wake4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster8_wake4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster8_wake4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster8_wake4_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster8_wake4_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster8_wake4_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster8_wake4_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 3 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 2 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 2 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 3 / C 2 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 1 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 1 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 1 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 4 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 1 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 2 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 3 / C 2 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 4 / D 0 | 0F/0W |

## Reading

- `Overall` と `vs ...` は引き分けを0.5勝として扱う勝ち点率。
- `vs Black` は黒速攻耐性の主指標。`black_pressure_strong` と `black_pressure_pressure` の両方を合算している。
- `vs Decoy` は現行第三マスターへの基準維持。高すぎる場合は白が基準を超えすぎていないかを見る。
- `vs White` は現行白基準との比較診断。採用判断では黒耐性と長期戦リスクを優先する。
- `Usage` は候補白側の通常マスター特技使用回数。`wake_up` / `shield` / `master_attack` の偏りを見る。
- `Loss Opp HP` は候補白側が負けた時の相手残HP平均。低いほど惜敗、高いほど押し切られ。
- ロストーン入りデッキは `Notes` に出る。現方針では本命候補から外す。
