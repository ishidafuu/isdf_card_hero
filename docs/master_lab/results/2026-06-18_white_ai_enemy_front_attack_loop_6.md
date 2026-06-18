# White AI Tuning Loop

生成: 2026-06-18T08:25:16.834Z
候補: 4
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 3 games/matchup/direction
総試合: 96

## Conclusion

首位は `pressure_white_baseline`（score 57.8 / overall 54.2% / vs Black 66.7%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 2 件。 上位候補: pressure_white_baseline 66.7% / pressure_white_monster_pressure_v1 50% / pressure_white_enemy_front_attack_v1 41.7% / pressure_attack_monster_plus4 8.3%。

### Next Steps

- 次は `pressure_white_baseline`, `pressure_white_monster_pressure_v1` を games-per-matchup 8-12 で確認する。
- 首位はシールド寄り。確認ループでは `wake_up` 補正を少し足す条件を横に置き、守った後の勝ち切り不足を確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 57.8 | 13-11-0 | 54.2% | 66.7% (8-4-0) | 50% (3-3-0) | 33.3% (2-4-0) | 12 | - | shield:135, wake_up:62, master_attack:37 | - | 0F/0W | 黒耐性あり<br>シールド偏重 |
| 2 | pressure_white_monster_pressure_v1<br>本実装候補: 白盤面処理+4 | hybrid | pressure-normal<br>通常プレッシャー | 53 | 12-12-0 | 50% | 50% (6-6-0) | 50% (3-3-0) | 50% (3-3-0) | 11.9 | - | shield:106, wake_up:67, master_attack:41 | - | 0F/0W | 黒耐性あり |
| 3 | pressure_white_enemy_front_attack_v1<br>本実装候補: 白敵前衛攻撃+4 | hybrid | pressure-normal<br>通常プレッシャー | 48 | 11-13-0 | 45.8% | 41.7% (5-7-0) | 66.7% (4-2-0) | 33.3% (2-4-0) | 13.5 | - | shield:111, wake_up:83, master_attack:57 | - | 0F/0W | - |
| 4 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | action_bias | pressure-normal<br>通常プレッシャー | 35.7 | 11-13-0 | 45.8% | 8.3% (1-11-0) | 100% (6-0-0) | 66.7% (4-2-0) | 12.8 | - | shield:127, wake_up:71, master_attack:52 | - | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 57.8 | 54.2% | 66.7% (8-4-0) | 50% (3-3-0) | 33.3% (2-4-0) | shield:135, wake_up:62, master_attack:37 | - | 黒耐性あり<br>シールド偏重 |
| 2 | pressure_white_monster_pressure_v1<br>本実装候補: 白盤面処理+4 | 白マスター限定で、敵モンスターへの実ダメージ/撃破評価だけを薄く上げる。 | situational whiteMonsterPressureBonus:4 | 53 | 50% | 50% (6-6-0) | 50% (3-3-0) | 50% (3-3-0) | shield:106, wake_up:67, master_attack:41 | - | 黒耐性あり |
| 3 | pressure_white_enemy_front_attack_v1<br>本実装候補: 白敵前衛攻撃+4 | 白マスター限定で、HP減少の有無にかかわらず敵前衛へ攻撃する価値を薄く上げる。 | situational whiteEnemyFrontAttackBonus:4 | 48 | 45.8% | 41.7% (5-7-0) | 66.7% (4-2-0) | 33.3% (2-4-0) | shield:111, wake_up:83, master_attack:57 | - | - |
| 4 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | 盤面制圧補正を薄く入れ、+8より副作用が少ないか見る。 | action attack_monster+4 | 35.7 | 45.8% | 8.3% (1-11-0) | 100% (6-0-0) | 66.7% (4-2-0) | shield:127, wake_up:71, master_attack:52 | - | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 0 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 0 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 0 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 0 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 0 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_enemy_front_attack_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 0 / D 0 | 0F/0W |

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
