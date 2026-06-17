# White AI Tuning Loop

生成: 2026-06-17T15:26:46.663Z
候補: 28
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 2 games/matchup/direction
総試合: 448

## Conclusion

首位は `pressure_master_attack_plus8`（score 59.5 / overall 56.3% / vs Black 62.5%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +50%。 安定候補（vs Black 45%以上、0F/1W以下）は 2 件。 上位候補: pressure_master_attack_plus8 62.5% / pressure_attack_master_plus8 37.5% / pressure_attack_monster_plus8 37.5% / weights_counter 37.5% / white494_guard 37.5%。

### Next Steps

- 次は `pressure_master_attack_plus8`, `pressure_strong_baseline` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_master_attack_plus8<br>特技: master_attack+8 | action_bias | pressure-normal<br>通常プレッシャー | 59.5 | 9-7-0 | 56.3% | 62.5% (5-3-0) | 50% (2-2-0) | 50% (2-2-0) | 10.6 | 3.9 | shield:42, wake_up:39, master_attack:27 | 0F/0W | 黒耐性あり |
| 2 | pressure_attack_master_plus8<br>攻撃: attack_master+8 | action_bias | pressure-normal<br>通常プレッシャー | 55.3 | 10-6-0 | 62.5% | 37.5% (3-5-0) | 75% (3-1-0) | 100% (4-0-0) | 13.9 | 2.2 | shield:68, wake_up:60, master_attack:31 | 0F/0W | 黒に弱い<br>惜敗多め |
| 3 | pressure_attack_monster_plus8<br>攻撃: attack_monster+8 | action_bias | pressure-normal<br>通常プレッシャー | 52.5 | 9-7-0 | 56.3% | 37.5% (3-5-0) | 75% (3-1-0) | 75% (3-1-0) | 12.4 | 3.4 | shield:68, wake_up:42, master_attack:40 | 0F/0W | 黒に弱い |
| 4 | weights_counter<br>重み: 反撃重視 | weights | pressure-normal<br>通常プレッシャー | 52.5 | 9-7-0 | 56.3% | 37.5% (3-5-0) | 100% (4-0-0) | 50% (2-2-0) | 14.4 | 3.4 | shield:88, wake_up:68, master_attack:45 | 0F/0W | 黒に弱い |
| 5 | white494_guard<br>投稿494: 保護重視 | hybrid | submission-pro-no-rare8-white-494<br>投稿Pro白8なし #494 高評価ホワイト | 52.5 | 9-7-0 | 56.3% | 37.5% (3-5-0) | 75% (3-1-0) | 75% (3-1-0) | 11.9 | 5.9 | shield:104, wake_up:41, master_attack:40 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 6 | balanced_white_baseline<br>比較: balanced-normal / white | baseline | balanced-normal<br>通常バランス | 49.8 | 8-8-0 | 50% | 37.5% (3-5-0) | 75% (3-1-0) | 50% (2-2-0) | 12.2 | 3.8 | shield:64, wake_up:51, master_attack:31 | 0F/0W | 黒に弱い |
| 7 | balanced_guard<br>balanced: 保護重視 | hybrid | balanced-normal<br>通常バランス | 45.5 | 7-9-0 | 43.8% | 37.5% (3-5-0) | 75% (3-1-0) | 25% (1-3-0) | 13.9 | 5.1 | shield:99, master_attack:39, wake_up:39 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 8 | pressure_shield_plus8<br>特技: shield+8 | action_bias | pressure-normal<br>通常プレッシャー | 45 | 7-9-0 | 43.8% | 37.5% (3-5-0) | 50% (2-2-0) | 50% (2-2-0) | 13.5 | 3.4 | shield:69, wake_up:52, master_attack:47 | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | pressure_master_attack_plus8<br>特技: master_attack+8 | 白が盤面処理をマスターアタックで補う価値を確認する。 | action master_attack+8 | 59.5 | 56.3% | 62.5% (5-3-0) | 50% (2-2-0) | 50% (2-2-0) | shield:42, wake_up:39, master_attack:27 | 黒耐性あり |
| 2 | pressure_attack_master_plus8<br>攻撃: attack_master+8 | 決着力不足の補正として、本体打点を少し押す。 | action attack_master+8 | 55.3 | 62.5% | 37.5% (3-5-0) | 75% (3-1-0) | 100% (4-0-0) | shield:68, wake_up:60, master_attack:31 | 黒に弱い<br>惜敗多め |
| 3 | pressure_attack_monster_plus8<br>攻撃: attack_monster+8 | 盤面制圧を少し厚くし、黒の前のめり展開を止める。 | action attack_monster+8 | 52.5 | 56.3% | 37.5% (3-5-0) | 75% (3-1-0) | 75% (3-1-0) | shield:68, wake_up:42, master_attack:40 | 黒に弱い |
| 4 | weights_counter<br>重み: 反撃重視 | 守った後に勝ち切れない問題へ、本体打点と敵駒圧力で対処する。 | action attack_master+4<br>weights masterDamageBase:104, monsterKillBase:270, futureOpponentThreatenedMonster:0.22 | 52.5 | 56.3% | 37.5% (3-5-0) | 100% (4-0-0) | 50% (2-2-0) | shield:88, wake_up:68, master_attack:45 | 黒に弱い |
| 5 | white494_guard<br>投稿494: 保護重視 | 投稿白デッキで守って育てる筋が黒相手に間に合うか見る。 | action shield+8<br>weights futureOwnLevelUp:0.26, futureOwnThreatenedMonster:0.36 | 52.5 | 56.3% | 37.5% (3-5-0) | 75% (3-1-0) | 75% (3-1-0) | shield:104, wake_up:41, master_attack:40 | 黒に弱い<br>シールド偏重 |
| 6 | balanced_white_baseline<br>比較: balanced-normal / white | 標準構成で白AIの守備寄り判断が安定するかを見る。 | - | 49.8 | 50% | 37.5% (3-5-0) | 75% (3-1-0) | 50% (2-2-0) | shield:64, wake_up:51, master_attack:31 | 黒に弱い |
| 7 | balanced_guard<br>balanced: 保護重視 | 標準構成で過剰防御にならず黒に耐えられるか見る。 | action shield+8<br>weights masterHp:92, futureOwnThreatenedMonster:0.36 | 45.5 | 43.8% | 37.5% (3-5-0) | 75% (3-1-0) | 25% (1-3-0) | shield:99, master_attack:39, wake_up:39 | 黒に弱い<br>シールド偏重 |
| 8 | pressure_shield_plus8<br>特技: shield+8 | 守る価値のある駒を残しやすくし、レベルアップまでつなげる。 | action shield+8 | 45 | 43.8% | 37.5% (3-5-0) | 50% (2-2-0) | 50% (2-2-0) | shield:69, wake_up:52, master_attack:47 | 黒に弱い |
| 9 | weights_level_up<br>重み: レベルアップ最大化 | 白の本筋である、守った駒のレベルアップ期待をさらに強める。 | weights futureOwnLevelUp:0.3, futureOpponentLevelUp:0.28, futureOwnThreatenedMonster:0.34, masterDamageBase:90 | 45 | 43.8% | 37.5% (3-5-0) | 50% (2-2-0) | 50% (2-2-0) | shield:87, wake_up:57, master_attack:40 | 黒に弱い<br>惜敗多め |
| 10 | pressure_strong_baseline<br>比較: pressure-normal / strong | 白専用補正なしの強AI。white profileの差分基準にする。 | - | 42.5 | 37.5% | 50% (4-4-0) | 25% (1-3-0) | 25% (1-3-0) | shield:67, wake_up:54, master_attack:34 | 黒耐性あり |
| 11 | pressure_wake8_shield8<br>混合: wake_up+8 / shield+8 | 展開前倒しと保護を薄く両立し、白らしい制圧へ寄せる。 | action wake_up+8, shield+8 | 41.8 | 43.8% | 25% (2-6-0) | 75% (3-1-0) | 50% (2-2-0) | shield:70, wake_up:48, master_attack:43 | 黒に弱い |
| 12 | weights_deny<br>重み: 相手レベルアップ拒否 | 黒のバーサク供養に近い、相手のレベルアップ機会を奪う判断を強める。 | action attack_monster+4<br>weights monsterKillBase:320, futureOpponentLevelUp:0.36, futureOwnThreatenedMonster:0.32 | 41.8 | 43.8% | 25% (2-6-0) | 75% (3-1-0) | 50% (2-2-0) | shield:62, wake_up:54, master_attack:43 | 黒に弱い<br>惜敗多め |
| 13 | pressure_shield_minus8<br>特技: shield-8 | 守りすぎで反撃が遅い仮説を確認する。 | action shield-8 | 40.8 | 37.5% | 37.5% (3-5-0) | 50% (2-2-0) | 25% (1-3-0) | shield:70, wake_up:59, master_attack:41 | 黒に弱い |
| 14 | pressure_wake_plus16<br>特技: wake_up+16 | ウェイクアップを明確に厚くし、使いすぎの副作用を測る。 | action wake_up+16 | 39.8 | 43.8% | 25% (2-6-0) | 50% (2-2-0) | 75% (3-1-0) | shield:68, wake_up:51, master_attack:32 | 黒に弱い |
| 15 | weights_guard<br>重み: 保護重視 | 黒速攻を受け止める方向へ寄せ、長期戦化の副作用を見る。 | action shield+6<br>weights masterHp:92, healPerPoint:34, futureOwnLevelUp:0.22, futureOwnThreatenedMonster:0.38 | 39.8 | 43.8% | 25% (2-6-0) | 50% (2-2-0) | 75% (3-1-0) | shield:64, wake_up:46, master_attack:26 | 黒に弱い<br>惜敗多め |
| 16 | white494_white_baseline<br>比較: 投稿494 / white | 投稿白デッキ候補で、白AIの上限と癖を見る。 | - | 37 | 37.5% | 25% (2-6-0) | 50% (2-2-0) | 50% (2-2-0) | shield:134, master_attack:54, wake_up:33 | 黒に弱い<br>シールド偏重 |
| 17 | weights_stone_light<br>重み: ストーン軽視 | 白特技を温存しすぎる仮説を確認し、石を盤面へ変換しやすくする。 | action wake_up+4, shield+4<br>weights stone:3, genericMagicCost:6 | 30.3 | 25% | 37.5% (3-5-0) | 25% (1-3-0) | 0% (0-4-0) | shield:55, wake_up:50, master_attack:38 | 黒に弱い |
| 18 | white1340_white_baseline<br>比較: 投稿1340 / white | 育成寄り白デッキで、守ってレベルを上げる筋が伸びるかを見る。 | - | 29.5 | 25% | 25% (2-6-0) | 25% (1-3-0) | 25% (1-3-0) | shield:72, master_attack:55, wake_up:55 | 黒に弱い |
| 19 | white494_wake8<br>投稿494: wake_up+8 | 投稿白デッキでウェイクアップ補正が再現するかを見る。 | action wake_up+8 | 29 | 31.3% | 12.5% (1-7-0) | 50% (2-2-0) | 50% (2-2-0) | shield:116, master_attack:45, wake_up:41 | 黒に弱い<br>シールド偏重 |
| 20 | pressure_master_attack_minus8<br>特技: master_attack-8 | 白がマスターアタックへ逃げすぎていないかを切り分ける。 | action master_attack-8 | 27.3 | 31.3% | 25% (2-6-0) | 0% (0-4-0) | 75% (3-1-0) | shield:75, wake_up:41, master_attack:24 | 黒に弱い |
| 21 | balanced_wake8_shield8<br>balanced: wake/shield+8 | 標準構成で展開と保護を同時に押した場合の平均値を見る。 | action wake_up+8, shield+8 | 26.8 | 25% | 12.5% (1-7-0) | 75% (3-1-0) | 0% (0-4-0) | shield:75, wake_up:49, master_attack:44 | 黒に弱い |
| 22 | pressure_full_hybrid<br>複合: レベルアップ + wake/shield | 白の主筋を広く押し、単独補正より安定するかを見る。 | action wake_up+8, shield+6, attack_monster+4<br>weights futureOwnLevelUp:0.28, futureOpponentLevelUp:0.3, futureOwnThreatenedMonster:0.36 | 26.3 | 25% | 12.5% (1-7-0) | 50% (2-2-0) | 25% (1-3-0) | shield:65, wake_up:55, master_attack:32 | 黒に弱い<br>惜敗多め |
| 23 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 26.3 | 25% | 12.5% (1-7-0) | 50% (2-2-0) | 25% (1-3-0) | shield:49, wake_up:38, master_attack:26 | 黒に弱い<br>惜敗多め |
| 24 | weights_stone_guard<br>重み: ストーン温存 | 石の尽き方が負け筋なら、必要な盾だけ撃つ形が安定するか見る。 | action shield+8<br>weights stone:8, genericMagicCost:10, futureOwnThreatenedMonster:0.34 | 26.3 | 25% | 12.5% (1-7-0) | 50% (2-2-0) | 25% (1-3-0) | shield:115, wake_up:41, master_attack:37 | 黒に弱い<br>シールド偏重 |
| 25 | pressure_wake16_shield_minus8<br>混合: wake_up+16 / shield-8 | 守るより起こして動かす形へ寄せ、速度不足を補えるか見る。 | action wake_up+16, shield-8 | 21.8 | 18.8% | 25% (2-6-0) | 0% (0-4-0) | 25% (1-3-0) | wake_up:82, shield:69, master_attack:42 | 黒に弱い |
| 26 | white1340_level<br>投稿1340: レベルアップ重視 | 育成寄りデッキで白AIの本筋を最大化する。 | action shield+6, wake_up+6<br>weights futureOwnLevelUp:0.32, futureOpponentLevelUp:0.28 | 21.8 | 18.8% | 25% (2-6-0) | 0% (0-4-0) | 25% (1-3-0) | wake_up:72, master_attack:62, shield:61 | 黒に弱い |
| 27 | pressure_wake_plus8<br>特技: wake_up+8 | 準備中の味方を早めに起こし、黒の速度に盤面展開で対抗できるか見る。 | action wake_up+8 | 21.5 | 18.8% | 12.5% (1-7-0) | 25% (1-3-0) | 25% (1-3-0) | shield:100, wake_up:70, master_attack:32 | 黒に弱い<br>惜敗多め |
| 28 | white1347_defensive_baseline<br>比較: 投稿1347 / defensive | 防御密度の高い候補で、長期戦化しすぎないかを見る。 | - | 20.8 | 25% | 12.5% (1-7-0) | 0% (0-4-0) | 75% (3-1-0) | shield:88, wake_up:46, master_attack:13 | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 0 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_strong_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_strong_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_strong_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_strong_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_strong_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_strong_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| pressure_strong_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_strong_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| balanced_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| balanced_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| balanced_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| balanced_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| balanced_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| balanced_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| balanced_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| balanced_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| white494_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| white494_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| white494_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| white494_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| white494_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| white494_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| white494_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| white494_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| white1340_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| white1340_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| white1340_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| white1340_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 0 / D 0 | 0F/0W |
| white1340_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| white1340_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| white1340_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| white1340_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| white1347_defensive_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| white1347_defensive_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| white1347_defensive_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| white1347_defensive_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| white1347_defensive_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| white1347_defensive_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| white1347_defensive_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| white1347_defensive_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake_plus8_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_wake_plus8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_wake_plus8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| pressure_wake_plus8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake_plus8_vs_decoy_back_stable_player | player | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| pressure_wake_plus8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake_plus8_vs_white_pressure_strong_player | player | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_wake_plus8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake_plus16_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_wake_plus16_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_wake_plus16_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake_plus16_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake_plus16_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake_plus16_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake_plus16_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_wake_plus16_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_shield_plus8_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_shield_plus8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_shield_plus8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_shield_plus8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_shield_plus8_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_shield_plus8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_shield_plus8_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_shield_plus8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_shield_minus8_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_shield_minus8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_shield_minus8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_shield_minus8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_shield_minus8_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_shield_minus8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_shield_minus8_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_shield_minus8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_master_attack_minus8_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_master_attack_minus8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_master_attack_minus8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_master_attack_minus8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 0 / D 0 | 0F/0W |
| pressure_master_attack_minus8_vs_decoy_back_stable_player | player | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| pressure_master_attack_minus8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| pressure_master_attack_minus8_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_master_attack_minus8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 0 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_master_attack_plus8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 0 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 0 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_attack_master_plus8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_wake8_shield8_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake8_shield8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake8_shield8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| pressure_wake8_shield8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 0 / D 0 | 0F/0W |
| pressure_wake8_shield8_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake8_shield8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| pressure_wake8_shield8_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake8_shield8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake16_shield_minus8_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake16_shield_minus8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_wake16_shield_minus8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| pressure_wake16_shield_minus8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake16_shield_minus8_vs_decoy_back_stable_player | player | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| pressure_wake16_shield_minus8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| pressure_wake16_shield_minus8_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_wake16_shield_minus8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| weights_level_up_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| weights_level_up_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| weights_level_up_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| weights_level_up_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| weights_level_up_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| weights_level_up_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| weights_level_up_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| weights_level_up_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| weights_guard_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| weights_guard_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| weights_guard_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| weights_guard_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| weights_guard_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| weights_guard_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| weights_guard_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| weights_guard_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| weights_counter_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| weights_counter_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| weights_counter_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| weights_counter_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| weights_counter_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| weights_counter_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| weights_counter_vs_white_pressure_strong_player | player | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| weights_counter_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| weights_deny_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| weights_deny_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| weights_deny_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| weights_deny_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 0 / D 0 | 0F/0W |
| weights_deny_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| weights_deny_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| weights_deny_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| weights_deny_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| weights_stone_light_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| weights_stone_light_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| weights_stone_light_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| weights_stone_light_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| weights_stone_light_vs_decoy_back_stable_player | player | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| weights_stone_light_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| weights_stone_light_vs_white_pressure_strong_player | player | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| weights_stone_light_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| weights_stone_guard_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| weights_stone_guard_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| weights_stone_guard_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| weights_stone_guard_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 0 / D 0 | 0F/0W |
| weights_stone_guard_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| weights_stone_guard_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| weights_stone_guard_vs_white_pressure_strong_player | player | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| weights_stone_guard_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_full_hybrid_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_full_hybrid_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_full_hybrid_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| pressure_full_hybrid_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 0 / D 0 | 0F/0W |
| pressure_full_hybrid_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| pressure_full_hybrid_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| pressure_full_hybrid_vs_white_pressure_strong_player | player | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_full_hybrid_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| white494_wake8_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| white494_wake8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| white494_wake8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| white494_wake8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 0 / D 0 | 0F/0W |
| white494_wake8_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| white494_wake8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| white494_wake8_vs_white_pressure_strong_player | player | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| white494_wake8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| white494_guard_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| white494_guard_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| white494_guard_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| white494_guard_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| white494_guard_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| white494_guard_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| white494_guard_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| white494_guard_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| white1340_level_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| white1340_level_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| white1340_level_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| white1340_level_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| white1340_level_vs_decoy_back_stable_player | player | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| white1340_level_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| white1340_level_vs_white_pressure_strong_player | player | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| white1340_level_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| balanced_guard_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| balanced_guard_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| balanced_guard_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| balanced_guard_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| balanced_guard_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| balanced_guard_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| balanced_guard_vs_white_pressure_strong_player | player | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| balanced_guard_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| balanced_wake8_shield8_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| balanced_wake8_shield8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| balanced_wake8_shield8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| balanced_wake8_shield8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 0 / D 0 | 0F/0W |
| balanced_wake8_shield8_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| balanced_wake8_shield8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| balanced_wake8_shield8_vs_white_pressure_strong_player | player | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| balanced_wake8_shield8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |

## Reading

- `Overall` と `vs ...` は引き分けを0.5勝として扱う勝ち点率。
- `vs Black` は黒速攻耐性の主指標。`black_pressure_strong` と `black_pressure_pressure` の両方を合算している。
- `vs Decoy` は現行第三マスターへの基準維持。高すぎる場合は白が基準を超えすぎていないかを見る。
- `vs White` は現行白基準との比較診断。採用判断では黒耐性と長期戦リスクを優先する。
- `Usage` は候補白側の通常マスター特技使用回数。`wake_up` / `shield` / `master_attack` の偏りを見る。
- `Loss Opp HP` は候補白側が負けた時の相手残HP平均。低いほど惜敗、高いほど押し切られ。
- ロストーン入りデッキは `Notes` に出る。現方針では本命候補から外す。
