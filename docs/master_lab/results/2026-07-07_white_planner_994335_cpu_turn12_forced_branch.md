# White Planner Forced Branch Probe

生成: 2026-07-06T23:30:03.448Z
seed: 994335
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 6
maxReplaySteps: 120

## Conclusion

- 2/2 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 152

- turn: 12
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 12 / current cpu / HP cpu/player 10/8 / stones cpu/player 9/4 / deck cpu/player 13/14 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 focus,shield | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 | cpu_front_right:CF:真勇者ダイン Lv3 HP6 act0/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- selected: summon:ドノマンティス->cpu_back_left
- best: move:cpu_front_left->cpu_back_left
- selectedRank: 6
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ドノマンティス->cpu_back_left | 95.8 | white | -1000000 | 116 | turn 22 / current player / HP cpu/player 0/5 / stones cpu/player 11/10 / deck cpu/player 4/4 / hand cpu/player 5/6 |
| 2 |  | summon:ポリスピナー->cpu_back_left | 90.6 | - | -684 | 120 | turn 21 / current cpu / HP cpu/player 4/5 / stones cpu/player 5/6 / deck cpu/player 4/5 / hand cpu/player 6/5 |
| 3 |  | summon:ポリスピナー->cpu_back_left | 90.6 | - | -684 | 120 | turn 21 / current cpu / HP cpu/player 4/5 / stones cpu/player 5/6 / deck cpu/player 4/5 / hand cpu/player 6/5 |
| 4 |  | end_turn | 84.5 | - | -407 | 120 | turn 22 / current player / HP cpu/player 7/7 / stones cpu/player 2/7 / deck cpu/player 4/4 / hand cpu/player 5/6 |
| 5 |  | move:cpu_front_left->cpu_back_left | 46 | white_planner | 1000000 | 112 | turn 29 / current player / HP cpu/player 5/0 / stones cpu/player 46/29 / deck cpu/player 0/0 / hand cpu/player 4/5 |
| 6 |  | move:cpu_back_right->cpu_back_left | 6.5 | - | -1763 | 120 | turn 25 / current player / HP cpu/player 2/7 / stones cpu/player 20/14 / deck cpu/player 1/0 / hand cpu/player 5/5 |

### step 153

- turn: 12
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 12 / current cpu / HP cpu/player 10/8 / stones cpu/player 8/4 / deck cpu/player 13/14 / hand cpu/player 5/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 focus,shield | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 | cpu_front_right:CF:真勇者ダイン Lv3 HP6 act0/1 | cpu_back_left:CB:ドノマンティス Lv1 HP5 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- selected: end_turn
- best: attack:ヤンバル:wild_claw->ピグミィ
- selectedRank: 5
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | end_turn | 82.5 | white | -1000000 | 115 | turn 22 / current player / HP cpu/player 0/5 / stones cpu/player 11/10 / deck cpu/player 4/4 / hand cpu/player 5/6 |
| 2 |  | attack:ヤンバル:wild_claw->デスシープ | -35.3 | white | -1000000 | 88 | turn 27 / current cpu / HP cpu/player 0/2 / stones cpu/player 46/28 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | attack:ヤンバル:wild_claw->ピグミィ | -55.5 | white_planner | 1000000 | 116 | turn 29 / current player / HP cpu/player 5/0 / stones cpu/player 23/40 / deck cpu/player 0/0 / hand cpu/player 4/5 |
| 4 |  | attack:ヤンバル:wild_claw->ピグミィ | -55.5 | - | -1283 | 120 | turn 24 / current player / HP cpu/player 2/5 / stones cpu/player 8/17 / deck cpu/player 2/2 / hand cpu/player 5/6 |
| 5 |  | focus:真勇者ダイン | -68.4 | - | -1678 | 120 | turn 26 / current cpu / HP cpu/player 2/7 / stones cpu/player 13/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 6 |  | focus:ヤンバル | -70 | white_planner | 1000000 | 109 | turn 28 / current player / HP cpu/player 7/0 / stones cpu/player 34/21 / deck cpu/player 0/0 / hand cpu/player 5/5 |


