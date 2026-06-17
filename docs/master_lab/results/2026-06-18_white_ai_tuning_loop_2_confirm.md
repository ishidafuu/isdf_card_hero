# White AI Tuning Loop

生成: 2026-06-17T15:40:32.761Z
候補: 6
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 8 games/matchup/direction
総試合: 384

## Conclusion

首位は `pressure_attack_monster_plus8`（score 54.2 / overall 51.6% / vs Black 50%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +15.6%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_attack_monster_plus8 50% / pressure_white_baseline 34.4% / white494_guard 28.1% / pressure_master_attack_plus8 28.1% / pressure_attack_master_plus8 28.1%。

### Next Steps

- 次は `pressure_attack_monster_plus8` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_attack_monster_plus8<br>攻撃: attack_monster+8 | action_bias | pressure-normal<br>通常プレッシャー | 54.2 | 33-31-0 | 51.6% | 50% (16-16-0) | 56.3% (9-7-0) | 50% (8-8-0) | 13.3 | 3.2 | shield:249, wake_up:192, master_attack:136 | 0F/0W | 黒耐性あり |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 47.8 | 31-33-0 | 48.4% | 34.4% (11-21-0) | 75% (12-4-0) | 50% (8-8-0) | 12.3 | 3 | shield:262, wake_up:217, master_attack:141 | 0F/0W | 黒に弱い<br>惜敗多め |
| 3 | white494_guard<br>投稿494: 保護重視 | hybrid | submission-pro-no-rare8-white-494<br>投稿Pro白8なし #494 高評価ホワイト | 45.1 | 31-33-0 | 48.4% | 28.1% (9-23-0) | 75% (12-4-0) | 62.5% (10-6-0) | 12.7 | 4.2 | shield:458, master_attack:203, wake_up:134 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 4 | pressure_master_attack_plus8<br>特技: master_attack+8 | action_bias | pressure-normal<br>通常プレッシャー | 43.1 | 28-36-0 | 43.8% | 28.1% (9-23-0) | 75% (12-4-0) | 43.8% (7-9-0) | 12.6 | 2.9 | shield:279, wake_up:195, master_attack:133 | 0F/0W | 黒に弱い<br>惜敗多め |
| 5 | pressure_attack_master_plus8<br>攻撃: attack_master+8 | action_bias | pressure-normal<br>通常プレッシャー | 41.9 | 27-37-0 | 42.2% | 28.1% (9-23-0) | 68.8% (11-5-0) | 43.8% (7-9-0) | 13.4 | 3.2 | shield:304, wake_up:193, master_attack:149 | 0F/0W | 黒に弱い |
| 6 | weights_counter<br>重み: 反撃重視 | weights | pressure-normal<br>通常プレッシャー | 40.2 | 26-38-0 | 40.6% | 28.1% (9-23-0) | 56.3% (9-7-0) | 50% (8-8-0) | 12.6 | 3.2 | shield:237, wake_up:210, master_attack:148 | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | pressure_attack_monster_plus8<br>攻撃: attack_monster+8 | 盤面制圧を少し厚くし、黒の前のめり展開を止める。 | action attack_monster+8 | 54.2 | 51.6% | 50% (16-16-0) | 56.3% (9-7-0) | 50% (8-8-0) | shield:249, wake_up:192, master_attack:136 | 黒耐性あり |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 47.8 | 48.4% | 34.4% (11-21-0) | 75% (12-4-0) | 50% (8-8-0) | shield:262, wake_up:217, master_attack:141 | 黒に弱い<br>惜敗多め |
| 3 | white494_guard<br>投稿494: 保護重視 | 投稿白デッキで守って育てる筋が黒相手に間に合うか見る。 | action shield+8<br>weights futureOwnLevelUp:0.26, futureOwnThreatenedMonster:0.36 | 45.1 | 48.4% | 28.1% (9-23-0) | 75% (12-4-0) | 62.5% (10-6-0) | shield:458, master_attack:203, wake_up:134 | 黒に弱い<br>シールド偏重 |
| 4 | pressure_master_attack_plus8<br>特技: master_attack+8 | 白が盤面処理をマスターアタックで補う価値を確認する。 | action master_attack+8 | 43.1 | 43.8% | 28.1% (9-23-0) | 75% (12-4-0) | 43.8% (7-9-0) | shield:279, wake_up:195, master_attack:133 | 黒に弱い<br>惜敗多め |
| 5 | pressure_attack_master_plus8<br>攻撃: attack_master+8 | 決着力不足の補正として、本体打点を少し押す。 | action attack_master+8 | 41.9 | 42.2% | 28.1% (9-23-0) | 68.8% (11-5-0) | 43.8% (7-9-0) | shield:304, wake_up:193, master_attack:149 | 黒に弱い |
| 6 | weights_counter<br>重み: 反撃重視 | 守った後に勝ち切れない問題へ、本体打点と敵駒圧力で対処する。 | action attack_master+4<br>weights masterDamageBase:104, monsterKillBase:270, futureOpponentThreatenedMonster:0.22 | 40.2 | 40.6% | 28.1% (9-23-0) | 56.3% (9-7-0) | 50% (8-8-0) | shield:237, wake_up:210, master_attack:148 | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 7 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 7 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 8 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 5 / C 3 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_decoy_back_stable_player | player | decoy_back_stable | P 6 / C 2 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 6 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 6 / C 2 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 5 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 7 / C 1 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 4 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 7 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 5 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| weights_counter_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 6 / D 0 | 0F/0W |
| weights_counter_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| weights_counter_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 5 / D 0 | 0F/0W |
| weights_counter_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 8 / C 0 / D 0 | 0F/0W |
| weights_counter_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 4 / D 0 | 0F/0W |
| weights_counter_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 3 / C 5 / D 0 | 0F/0W |
| weights_counter_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| weights_counter_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| white494_guard_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 6 / D 0 | 0F/0W |
| white494_guard_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 7 / C 1 / D 0 | 0F/0W |
| white494_guard_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 5 / D 0 | 0F/0W |
| white494_guard_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 5 / C 3 / D 0 | 0F/0W |
| white494_guard_vs_decoy_back_stable_player | player | decoy_back_stable | P 7 / C 1 / D 0 | 0F/0W |
| white494_guard_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 3 / C 5 / D 0 | 0F/0W |
| white494_guard_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| white494_guard_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 7 / D 0 | 0F/0W |

## Reading

- `Overall` と `vs ...` は引き分けを0.5勝として扱う勝ち点率。
- `vs Black` は黒速攻耐性の主指標。`black_pressure_strong` と `black_pressure_pressure` の両方を合算している。
- `vs Decoy` は現行第三マスターへの基準維持。高すぎる場合は白が基準を超えすぎていないかを見る。
- `vs White` は現行白基準との比較診断。採用判断では黒耐性と長期戦リスクを優先する。
- `Usage` は候補白側の通常マスター特技使用回数。`wake_up` / `shield` / `master_attack` の偏りを見る。
- `Loss Opp HP` は候補白側が負けた時の相手残HP平均。低いほど惜敗、高いほど押し切られ。
- ロストーン入りデッキは `Notes` に出る。現方針では本命候補から外す。
