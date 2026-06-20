# White AI Tuning Loop

生成: 2026-06-20T00:38:50.901Z
候補: 8
相手: black_pressure_strong, black_pressure_pressure
試行: 4 games/matchup/direction
総試合: 128

## Conclusion

首位は `pressure_attack_monster_plus4`（score 41 / overall 50% / vs Black 50%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +18.7%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_attack_monster_plus4 50% / pressure_white_monster_pressure_v1 43.8% / pressure_white_threat_source_attack_light_v1 43.8% / pressure_white_enemy_front_attack_v1 37.5% / pressure_white_threat_then_setup_v1 37.5%。

### Next Steps

- 次は `pressure_attack_monster_plus4` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | action_bias | pressure-normal<br>通常プレッシャー | 41 | 8-8-0 | 50% | 50% (8-8-0) | - | - | 10.3 | - | shield:45, wake_up:41, master_attack:21 | - | 0F/0W | 黒耐性あり |
| 2 | pressure_white_monster_pressure_v1<br>本実装候補: 白盤面処理+4 | hybrid | pressure-normal<br>通常プレッシャー | 36.7 | 7-9-0 | 43.8% | 43.8% (7-9-0) | - | - | 11.9 | - | shield:61, wake_up:54, master_attack:39 | - | 0F/0W | - |
| 3 | pressure_white_threat_source_attack_light_v1<br>本実装候補: 白脅威源攻撃+4 | hybrid | pressure-normal<br>通常プレッシャー | 36.7 | 7-9-0 | 43.8% | 43.8% (7-9-0) | - | - | 10.8 | - | shield:50, wake_up:47, master_attack:32 | - | 0F/0W | - |
| 4 | pressure_white_enemy_front_attack_v1<br>本実装候補: 白敵前衛攻撃+4 | hybrid | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 10.4 | - | wake_up:55, shield:38, master_attack:34 | - | 0F/0W | 黒に弱い |
| 5 | pressure_white_threat_then_setup_v1<br>本実装候補: 白脅威処理後布石 | hybrid | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 11.9 | - | shield:64, wake_up:59, master_attack:33 | - | 0F/0W | 黒に弱い |
| 6 | pressure_white_active_front_work_v1<br>本実装候補: 白既存駒前衛仕事+4 | hybrid | pressure-normal<br>通常プレッシャー | 27.9 | 5-11-0 | 31.3% | 31.3% (5-11-0) | - | - | 10.4 | - | shield:44, master_attack:43, wake_up:35 | - | 0F/0W | 黒に弱い |
| 7 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 27.9 | 5-11-0 | 31.3% | 31.3% (5-11-0) | - | - | 10.1 | - | shield:47, wake_up:42, master_attack:32 | - | 0F/0W | 黒に弱い |
| 8 | pressure_white_threat_left_low_stone_setup_guard_light_v1<br>本実装候補: 白脅威残り低石布石抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 27.9 | 5-11-0 | 31.3% | 31.3% (5-11-0) | - | - | 9.9 | - | shield:44, wake_up:36, master_attack:29 | - | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | 盤面制圧補正を薄く入れ、+8より副作用が少ないか見る。 | action attack_monster+4 | 41 | 50% | 50% (8-8-0) | - | - | shield:45, wake_up:41, master_attack:21 | - | 黒耐性あり |
| 2 | pressure_white_monster_pressure_v1<br>本実装候補: 白盤面処理+4 | 白マスター限定で、敵モンスターへの実ダメージ/撃破評価だけを薄く上げる。 | situational whiteMonsterPressureBonus:4 | 36.7 | 43.8% | 43.8% (7-9-0) | - | - | shield:61, wake_up:54, master_attack:39 | - | - |
| 3 | pressure_white_threat_source_attack_light_v1<br>本実装候補: 白脅威源攻撃+4 | 敵前衛の打点源処理を軽く押し、Decoyや白ミラーへの副作用を確認する。 | situational whiteThreatSourceAttackBonus:4 | 36.7 | 43.8% | 43.8% (7-9-0) | - | - | shield:50, wake_up:47, master_attack:32 | - | - |
| 4 | pressure_white_enemy_front_attack_v1<br>本実装候補: 白敵前衛攻撃+4 | 白マスター限定で、HP減少の有無にかかわらず敵前衛へ攻撃する価値を薄く上げる。 | situational whiteEnemyFrontAttackBonus:4 | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | wake_up:55, shield:38, master_attack:34 | - | 黒に弱い |
| 5 | pressure_white_threat_then_setup_v1<br>本実装候補: 白脅威処理後布石 | 脅威源を削ってから低石布石へ移る順序を加点し、全力布石の前に盤面の仕事を済ませる。 | situational whiteThreatSourceAttackBonus:6, whiteSetupAfterThreatReductionBonus:6 | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | shield:64, wake_up:59, master_attack:33 | - | 黒に弱い |
| 6 | pressure_white_active_front_work_v1<br>本実装候補: 白既存駒前衛仕事+4 | 白マスター限定で、召喚より既存アクティブ駒で敵前衛を削る行動を薄く上げる。 | situational whiteActiveFrontWorkBonus:4 | 27.9 | 31.3% | 31.3% (5-11-0) | - | - | shield:44, master_attack:43, wake_up:35 | - | 黒に弱い |
| 7 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 27.9 | 31.3% | 31.3% (5-11-0) | - | - | shield:47, wake_up:42, master_attack:32 | - | 黒に弱い |
| 8 | pressure_white_threat_left_low_stone_setup_guard_light_v1<br>本実装候補: 白脅威残り低石布石抑制軽量 | 白マスター限定で、敵前衛脅威が残る低石布石だけを軽く抑え、緊急/成果化シールドや仕事が見える起動/集中は残す。 | situational whiteThreatLeftLowStoneSetupPenalty:6 | 27.9 | 31.3% | 31.3% (5-11-0) | - | - | shield:44, wake_up:36, master_attack:29 | - | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_threat_source_attack_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_source_attack_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_threat_source_attack_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_threat_source_attack_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_threat_then_setup_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_threat_then_setup_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_threat_then_setup_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_then_setup_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |

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
