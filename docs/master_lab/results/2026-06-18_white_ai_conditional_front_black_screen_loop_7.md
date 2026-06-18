# White AI Tuning Loop

生成: 2026-06-18T14:27:17.032Z
候補: 7
相手: black_pressure_strong, black_pressure_pressure
試行: 4 games/matchup/direction
総試合: 112

## Conclusion

首位は `pressure_white_enemy_front_attack_v1`（score 45.4 / overall 56.3% / vs Black 56.3%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +6.3%。 安定候補（vs Black 45%以上、0F/1W以下）は 2 件。 上位候補: pressure_white_enemy_front_attack_v1 56.3% / pressure_white_baseline 50% / pressure_attack_monster_plus4 43.8% / pressure_white_active_front_work_v1 43.8% / pressure_white_pygmy_front_setup_v1 43.8%。

### Next Steps

- 次は `pressure_white_enemy_front_attack_v1`, `pressure_white_baseline` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_enemy_front_attack_v1<br>本実装候補: 白敵前衛攻撃+4 | hybrid | pressure-normal<br>通常プレッシャー | 45.4 | 9-7-0 | 56.3% | 56.3% (9-7-0) | - | - | 9 | - | wake_up:35, shield:26, master_attack:25 | - | 0F/0W | 黒耐性あり |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 41 | 8-8-0 | 50% | 50% (8-8-0) | - | - | 10.6 | - | shield:54, wake_up:47, master_attack:33 | - | 0F/0W | 黒耐性あり |
| 3 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | action_bias | pressure-normal<br>通常プレッシャー | 36.7 | 7-9-0 | 43.8% | 43.8% (7-9-0) | - | - | 9.4 | - | shield:48, wake_up:31, master_attack:27 | - | 0F/0W | - |
| 4 | pressure_white_active_front_work_v1<br>本実装候補: 白既存駒前衛仕事+4 | hybrid | pressure-normal<br>通常プレッシャー | 36.7 | 7-9-0 | 43.8% | 43.8% (7-9-0) | - | - | 9.9 | - | shield:50, wake_up:43, master_attack:26 | - | 0F/0W | - |
| 5 | pressure_white_pygmy_front_setup_v1<br>本実装候補: 白ピグミィ撃破圏+10 | hybrid | pressure-normal<br>通常プレッシャー | 36.7 | 7-9-0 | 43.8% | 43.8% (7-9-0) | - | - | 11.9 | - | shield:69, wake_up:53, master_attack:43 | - | 0F/0W | - |
| 6 | pressure_white_black_front_threat_v1<br>本実装候補: 白黒前衛脅威処理+8 | hybrid | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 11.3 | - | shield:51, wake_up:48, master_attack:46 | - | 0F/0W | 黒に弱い |
| 7 | pressure_white_monster_pressure_v1<br>本実装候補: 白盤面処理+4 | hybrid | pressure-normal<br>通常プレッシャー | 27.9 | 5-11-0 | 31.3% | 31.3% (5-11-0) | - | - | 11.1 | - | shield:54, wake_up:48, master_attack:43 | - | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_enemy_front_attack_v1<br>本実装候補: 白敵前衛攻撃+4 | 白マスター限定で、HP減少の有無にかかわらず敵前衛へ攻撃する価値を薄く上げる。 | situational whiteEnemyFrontAttackBonus:4 | 45.4 | 56.3% | 56.3% (9-7-0) | - | - | wake_up:35, shield:26, master_attack:25 | - | 黒耐性あり |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 41 | 50% | 50% (8-8-0) | - | - | shield:54, wake_up:47, master_attack:33 | - | 黒耐性あり |
| 3 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | 盤面制圧補正を薄く入れ、+8より副作用が少ないか見る。 | action attack_monster+4 | 36.7 | 43.8% | 43.8% (7-9-0) | - | - | shield:48, wake_up:31, master_attack:27 | - | - |
| 4 | pressure_white_active_front_work_v1<br>本実装候補: 白既存駒前衛仕事+4 | 白マスター限定で、召喚より既存アクティブ駒で敵前衛を削る行動を薄く上げる。 | situational whiteActiveFrontWorkBonus:4 | 36.7 | 43.8% | 43.8% (7-9-0) | - | - | shield:50, wake_up:43, master_attack:26 | - | - |
| 5 | pressure_white_pygmy_front_setup_v1<br>本実装候補: 白ピグミィ撃破圏+10 | 白マスター限定で、ピグミィが敵前衛を撃破圏へ入れる小打点を評価する。 | situational whitePygmyFrontSetupBonus:10 | 36.7 | 43.8% | 43.8% (7-9-0) | - | - | shield:69, wake_up:53, master_attack:43 | - | - |
| 6 | pressure_white_black_front_threat_v1<br>本実装候補: 白黒前衛脅威処理+8 | 白マスター限定で、黒の次ターン打点源になりうる敵前衛を削る時だけ加点する。 | situational whiteBlackFrontThreatBonus:8 | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | shield:51, wake_up:48, master_attack:46 | - | 黒に弱い |
| 7 | pressure_white_monster_pressure_v1<br>本実装候補: 白盤面処理+4 | 白マスター限定で、敵モンスターへの実ダメージ/撃破評価だけを薄く上げる。 | situational whiteMonsterPressureBonus:4 | 27.9 | 31.3% | 31.3% (5-11-0) | - | - | shield:54, wake_up:48, master_attack:43 | - | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_pygmy_front_setup_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_pygmy_front_setup_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_pygmy_front_setup_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_pygmy_front_setup_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |

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
