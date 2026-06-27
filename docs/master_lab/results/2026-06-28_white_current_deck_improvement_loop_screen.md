# White AI Tuning Loop

生成: 2026-06-27T15:44:04.438Z
候補: 12
相手: black_pressure_strong, black_1375_pressure, decoy_back_stable, white_current_mirror
試行: 1 games/matchup/direction
総試合: 96

## Conclusion

首位は `current_threat_source_attack8`（score 53 / overall 50% / vs Black 50%）。 安定候補（vs Black 45%以上、0F/1W以下）は 3 件。 上位候補: current_threat_source_attack8 50% / current_front_work_light 25% / current_white_baseline 50% / current_strong_profile 25% / current_shield_wake_quality 50%。

### Next Steps

- 次は `current_threat_source_attack8`, `current_white_baseline`, `current_shield_wake_quality` を games-per-matchup 8-12 で確認する。
- 首位はシールド寄り。確認ループでは `wake_up` 補正を少し足す条件を横に置き、守った後の勝ち切り不足を確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | current_threat_source_attack8<br>候補: 脅威源攻撃 8 | hybrid | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 53 | 4-4-0 | 50% | 50% (2-2-0) | 50% (1-1-0) | 50% (1-1-0) | 17.1 | - | shield:47, master_attack:38, wake_up:15 | - | 0F/0W | 黒耐性あり<br>シールド偏重 |
| 2 | current_front_work_light<br>候補: 既存前衛仕事 48 | hybrid | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 50 | 5-3-0 | 62.5% | 25% (1-3-0) | 100% (2-0-0) | 100% (2-0-0) | 13.9 | - | shield:40, master_attack:32, wake_up:18 | - | 0F/0W | 黒に弱い<br>シールド偏重 |
| 3 | current_white_baseline<br>現行: デスシープ3 / white | baseline | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 49 | 4-4-0 | 50% | 50% (2-2-0) | 100% (2-0-0) | 0% (0-2-0) | 15 | - | shield:49, master_attack:39, wake_up:17 | - | 0F/0W | 黒耐性あり<br>シールド偏重 |
| 4 | current_strong_profile<br>比較: デスシープ3 / strong | baseline | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 44.5 | 4-4-0 | 50% | 25% (1-3-0) | 100% (2-0-0) | 50% (1-1-0) | 15.9 | - | shield:71, master_attack:33, wake_up:8 | - | 0F/0W | 黒に弱い<br>シールド偏重 |
| 5 | current_shield_wake_quality<br>候補: 盾/起動品質 | hybrid | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 41.5 | 3-5-0 | 37.5% | 50% (2-2-0) | 50% (1-1-0) | 0% (0-2-0) | 17.8 | - | master_attack:54, shield:51, wake_up:17 | - | 0F/0W | 黒耐性あり<br>シールド偏重 |
| 6 | current_threat_source_attack4<br>候補: 脅威源攻撃 4 | hybrid | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 37 | 3-5-0 | 37.5% | 25% (1-3-0) | 50% (1-1-0) | 50% (1-1-0) | 15 | - | shield:53, master_attack:40, wake_up:15 | - | 0F/0W | 黒に弱い<br>シールド偏重 |
| 7 | current_threat_then_setup<br>候補: 脅威処理後布石 | hybrid | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 37 | 3-5-0 | 37.5% | 25% (1-3-0) | 50% (1-1-0) | 50% (1-1-0) | 17.4 | - | shield:55, master_attack:42, wake_up:13 | - | 0F/0W | 黒に弱い<br>シールド偏重 |
| 8 | current_wake_safe_work8<br>候補: 安全ウェイク仕事 8 | hybrid | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 37 | 3-5-0 | 37.5% | 25% (1-3-0) | 50% (1-1-0) | 50% (1-1-0) | 16.3 | - | shield:61, master_attack:30, wake_up:18 | - | 0F/0W | 黒に弱い<br>シールド偏重 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | current_threat_source_attack8<br>候補: 脅威源攻撃 8 | 脅威源処理を強め、黒/デコイ/白ミラーへの副作用を確認する。 | situational whiteThreatSourceAttackBonus:8 | 53 | 50% | 50% (2-2-0) | 50% (1-1-0) | 50% (1-1-0) | shield:47, master_attack:38, wake_up:15 | - | 黒耐性あり<br>シールド偏重 |
| 2 | current_front_work_light<br>候補: 既存前衛仕事 48 | デスシープで前衛が厚くなったため、現行72が押しすぎていないか軽量化を見る。 | situational whiteActiveFrontWorkBonus:48 | 50 | 62.5% | 25% (1-3-0) | 100% (2-0-0) | 100% (2-0-0) | shield:40, master_attack:32, wake_up:18 | - | 黒に弱い<br>シールド偏重 |
| 3 | current_white_baseline<br>現行: デスシープ3 / white | 暫定白最強デッキで現行white profileを基準化する。 | - | 49 | 50% | 50% (2-2-0) | 100% (2-0-0) | 0% (0-2-0) | shield:49, master_attack:39, wake_up:17 | - | 黒耐性あり<br>シールド偏重 |
| 4 | current_strong_profile<br>比較: デスシープ3 / strong | 白専用補正が本当に必要かを確認するため、strong profileを横に置く。 | - | 44.5 | 50% | 25% (1-3-0) | 100% (2-0-0) | 50% (1-1-0) | shield:71, master_attack:33, wake_up:8 | - | 黒に弱い<br>シールド偏重 |
| 5 | current_shield_wake_quality<br>候補: 盾/起動品質 | 守る価値のある盾と仕事へ変換できる起動だけを少し押す。 | situational whiteShieldThreatConversionBonus:8, whiteWakeSafeWorkBonus:4 | 41.5 | 37.5% | 50% (2-2-0) | 50% (1-1-0) | 0% (0-2-0) | master_attack:54, shield:51, wake_up:17 | - | 黒耐性あり<br>シールド偏重 |
| 6 | current_threat_source_attack4<br>候補: 脅威源攻撃 4 | 相手マスター種別を問わず、次ターン打点源を削る攻撃を軽く押す。 | situational whiteThreatSourceAttackBonus:4 | 37 | 37.5% | 25% (1-3-0) | 50% (1-1-0) | 50% (1-1-0) | shield:53, master_attack:40, wake_up:15 | - | 黒に弱い<br>シールド偏重 |
| 7 | current_threat_then_setup<br>候補: 脅威処理後布石 | このターンの脅威処理を済ませてから、次ターンの布石へ入る順序を押す。 | situational whiteThreatSourceAttackBonus:6, whiteSetupAfterThreatReductionBonus:6 | 37 | 37.5% | 25% (1-3-0) | 50% (1-1-0) | 50% (1-1-0) | shield:55, master_attack:42, wake_up:13 | - | 黒に弱い<br>シールド偏重 |
| 8 | current_wake_safe_work8<br>候補: 安全ウェイク仕事 8 | ウェイクアップ品質加点を強め、気合ため目的の起こし過ぎが出ないか見る。 | situational whiteWakeSafeWorkBonus:8 | 37 | 37.5% | 25% (1-3-0) | 50% (1-1-0) | 50% (1-1-0) | shield:61, master_attack:30, wake_up:18 | - | 黒に弱い<br>シールド偏重 |
| 9 | current_front_work_strong<br>候補: 既存前衛仕事 96 | デスシープ型でも既存前衛でこのターンの仕事をする価値をさらに押す。 | situational whiteActiveFrontWorkBonus:96 | 34 | 50% | 0% (0-4-0) | 100% (2-0-0) | 100% (2-0-0) | shield:56, master_attack:40, wake_up:15 | - | 黒に弱い<br>シールド偏重 |
| 10 | current_black_front_threat16<br>候補: 黒前衛脅威 16 | 黒の次ターン打点源になりうる前衛処理を、現行8より強く見る。 | situational whiteBlackFrontThreatBonus:16 | 30 | 37.5% | 25% (1-3-0) | 100% (2-0-0) | 0% (0-2-0) | shield:51, master_attack:44, wake_up:22 | - | warning 1<br>黒に弱い<br>シールド偏重 |
| 11 | current_wake_safe_work4<br>候補: 安全ウェイク仕事 4 | 味方ウェイクアップを、即仕事または次ターン仕事へ変換できる場面だけ軽く押す。 | situational whiteWakeSafeWorkBonus:4 | 28.5 | 25% | 25% (1-3-0) | 50% (1-1-0) | 0% (0-2-0) | master_attack:47, shield:43, wake_up:16 | - | 黒に弱い<br>シールド偏重 |
| 12 | current_threat_left_low_stone_guard<br>候補: 脅威残り低石布石抑制 | 脅威が残ったまま石1以下へ落とす盾/起動/召喚/集中を軽く抑える。 | situational whiteThreatLeftLowStoneSetupPenalty:6 | 21 | 25% | 0% (0-4-0) | 50% (1-1-0) | 50% (1-1-0) | shield:58, master_attack:37, wake_up:22 | - | 黒に弱い<br>シールド偏重 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| current_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 1 / D 0 | 0F/0W |
| current_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 0 / D 0 | 0F/0W |
| current_white_baseline_vs_black_1375_pressure_player | player | black_1375_pressure | P 1 / C 0 / D 0 | 0F/0W |
| current_white_baseline_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 0 / C 1 / D 0 | 0F/0W |
| current_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 0 / D 0 | 0F/0W |
| current_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 1 / D 0 | 0F/0W |
| current_white_baseline_vs_white_current_mirror_player | player | white_current_mirror | P 0 / C 1 / D 0 | 0F/0W |
| current_white_baseline_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 1 / C 0 / D 0 | 0F/0W |
| current_strong_profile_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 1 / D 0 | 0F/0W |
| current_strong_profile_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 0 / D 0 | 0F/0W |
| current_strong_profile_vs_black_1375_pressure_player | player | black_1375_pressure | P 1 / C 0 / D 0 | 0F/0W |
| current_strong_profile_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 1 / C 0 / D 0 | 0F/0W |
| current_strong_profile_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 0 / D 0 | 0F/0W |
| current_strong_profile_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 1 / D 0 | 0F/0W |
| current_strong_profile_vs_white_current_mirror_player | player | white_current_mirror | P 1 / C 0 / D 0 | 0F/0W |
| current_strong_profile_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 1 / C 0 / D 0 | 0F/0W |
| current_front_work_light_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 0 / D 0 | 0F/0W |
| current_front_work_light_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 0 / D 0 | 0F/0W |
| current_front_work_light_vs_black_1375_pressure_player | player | black_1375_pressure | P 0 / C 1 / D 0 | 0F/0W |
| current_front_work_light_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 1 / C 0 / D 0 | 0F/0W |
| current_front_work_light_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 0 / D 0 | 0F/0W |
| current_front_work_light_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 1 / D 0 | 0F/0W |
| current_front_work_light_vs_white_current_mirror_player | player | white_current_mirror | P 1 / C 0 / D 0 | 0F/0W |
| current_front_work_light_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 0 / C 1 / D 0 | 0F/0W |
| current_front_work_strong_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 1 / D 0 | 0F/0W |
| current_front_work_strong_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 0 / D 0 | 0F/0W |
| current_front_work_strong_vs_black_1375_pressure_player | player | black_1375_pressure | P 0 / C 1 / D 0 | 0F/0W |
| current_front_work_strong_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 1 / C 0 / D 0 | 0F/0W |
| current_front_work_strong_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 0 / D 0 | 0F/0W |
| current_front_work_strong_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 1 / D 0 | 0F/0W |
| current_front_work_strong_vs_white_current_mirror_player | player | white_current_mirror | P 1 / C 0 / D 0 | 0F/0W |
| current_front_work_strong_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 0 / C 1 / D 0 | 0F/0W |
| current_black_front_threat16_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 1 / D 0 | 0F/0W |
| current_black_front_threat16_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 0 / D 0 | 0F/0W |
| current_black_front_threat16_vs_black_1375_pressure_player | player | black_1375_pressure | P 1 / C 0 / D 0 | 0F/0W |
| current_black_front_threat16_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 1 / C 0 / D 0 | 0F/0W |
| current_black_front_threat16_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 0 / D 0 | 0F/0W |
| current_black_front_threat16_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 1 / D 0 | 0F/0W |
| current_black_front_threat16_vs_white_current_mirror_player | player | white_current_mirror | P 0 / C 1 / D 0 | 0F/0W |
| current_black_front_threat16_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 1 / C 0 / D 0 | 0F/1W |
| current_threat_source_attack4_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 1 / D 0 | 0F/0W |
| current_threat_source_attack4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 0 / C 1 / D 0 | 0F/0W |
| current_threat_source_attack4_vs_black_1375_pressure_player | player | black_1375_pressure | P 0 / C 1 / D 0 | 0F/0W |
| current_threat_source_attack4_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_source_attack4_vs_decoy_back_stable_player | player | decoy_back_stable | P 0 / C 1 / D 0 | 0F/0W |
| current_threat_source_attack4_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 1 / D 0 | 0F/0W |
| current_threat_source_attack4_vs_white_current_mirror_player | player | white_current_mirror | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_source_attack4_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 0 / C 1 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_black_1375_pressure_player | player | black_1375_pressure | P 0 / C 1 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_white_current_mirror_player | player | white_current_mirror | P 0 / C 1 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 0 / C 1 / D 0 | 0F/0W |
| current_threat_then_setup_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_then_setup_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_then_setup_vs_black_1375_pressure_player | player | black_1375_pressure | P 0 / C 1 / D 0 | 0F/0W |
| current_threat_then_setup_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_then_setup_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_then_setup_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_then_setup_vs_white_current_mirror_player | player | white_current_mirror | P 0 / C 1 / D 0 | 0F/0W |
| current_threat_then_setup_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 0 / C 1 / D 0 | 0F/0W |
| current_threat_left_low_stone_guard_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 1 / D 0 | 0F/0W |
| current_threat_left_low_stone_guard_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_left_low_stone_guard_vs_black_1375_pressure_player | player | black_1375_pressure | P 0 / C 1 / D 0 | 0F/0W |
| current_threat_left_low_stone_guard_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_left_low_stone_guard_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_left_low_stone_guard_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_left_low_stone_guard_vs_white_current_mirror_player | player | white_current_mirror | P 1 / C 0 / D 0 | 0F/0W |
| current_threat_left_low_stone_guard_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 1 / C 0 / D 0 | 0F/0W |
| current_wake_safe_work4_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 1 / D 0 | 0F/0W |
| current_wake_safe_work4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 0 / D 0 | 0F/0W |
| current_wake_safe_work4_vs_black_1375_pressure_player | player | black_1375_pressure | P 0 / C 1 / D 0 | 0F/0W |
| current_wake_safe_work4_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 0 / C 1 / D 0 | 0F/0W |
| current_wake_safe_work4_vs_decoy_back_stable_player | player | decoy_back_stable | P 0 / C 1 / D 0 | 0F/0W |
| current_wake_safe_work4_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 1 / D 0 | 0F/0W |
| current_wake_safe_work4_vs_white_current_mirror_player | player | white_current_mirror | P 0 / C 1 / D 0 | 0F/0W |
| current_wake_safe_work4_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 1 / C 0 / D 0 | 0F/0W |
| current_wake_safe_work8_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 0 / D 0 | 0F/0W |
| current_wake_safe_work8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 0 / D 0 | 0F/0W |
| current_wake_safe_work8_vs_black_1375_pressure_player | player | black_1375_pressure | P 0 / C 1 / D 0 | 0F/0W |
| current_wake_safe_work8_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 1 / C 0 / D 0 | 0F/0W |
| current_wake_safe_work8_vs_decoy_back_stable_player | player | decoy_back_stable | P 0 / C 1 / D 0 | 0F/0W |
| current_wake_safe_work8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 1 / D 0 | 0F/0W |
| current_wake_safe_work8_vs_white_current_mirror_player | player | white_current_mirror | P 1 / C 0 / D 0 | 0F/0W |
| current_wake_safe_work8_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 1 / C 0 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 0 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 0 / C 1 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_black_1375_pressure_player | player | black_1375_pressure | P 0 / C 1 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 1 / C 0 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 0 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 0 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_white_current_mirror_player | player | white_current_mirror | P 0 / C 1 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 1 / C 0 / D 0 | 0F/0W |

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
