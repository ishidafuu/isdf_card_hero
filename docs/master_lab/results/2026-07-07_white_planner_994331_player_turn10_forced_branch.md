# White Planner Forced Branch Probe

生成: 2026-07-06T18:17:34.283Z
seed: 994331
direction: challenger-as-player
deck: `master-lab-white-1377-death-sheep3`
branchTop: 5
maxReplaySteps: 220

## Conclusion

- 2/3 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 101

- turn: 10
- plannerSide: player
- currentPlayer: player
- state: turn 10 / current player / HP player/cpu 9/8 / stones player/cpu 8/1 / deck player/cpu 16/16 / hand player/cpu 3/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:真勇者ダイン Lv3 HP5 act0/1 | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 shield | cpu_front_right:CF:ボムゾウ Lv1 HP6 act1/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act1/1 focus
- selected: summon:ピグミィ->player_back_left
- best: move:player_back_right->player_front_left
- selectedRank: 3
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ピグミィ->player_back_left | 152.8 | white | -1000000 | 123 | turn 30 / current player / HP player/cpu 0/1 / stones player/cpu 46/44 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 2 |  | move:player_front_left->player_back_left | 104.1 | white | -1000000 | 109 | turn 20 / current cpu / HP player/cpu 0/8 / stones player/cpu 20/12 / deck player/cpu 6/5 / hand player/cpu 5/6 |
| 3 |  | move:player_back_right->player_front_left | 95.9 | white_planner | 1000000 | 166 | turn 27 / current cpu / HP player/cpu 5/0 / stones player/cpu 3/32 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 4 |  | end_turn | 39.6 | white_planner | 1000000 | 134 | turn 29 / current cpu / HP player/cpu 1/0 / stones player/cpu 33/40 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 5 |  | move:player_back_right->player_front_right | -42.3 | white | -1000000 | 89 | turn 19 / current cpu / HP player/cpu 0/6 / stones player/cpu 30/15 / deck player/cpu 7/6 / hand player/cpu 5/6 |

### step 104

- turn: 10
- plannerSide: player
- currentPlayer: player
- state: turn 10 / current player / HP player/cpu 9/8 / stones player/cpu 7/1 / deck player/cpu 16/16 / hand player/cpu 2/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 shield | cpu_front_right:CF:ボムゾウ Lv1 HP1 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act1/1 focus
- selected: master:wake_up->monster:player_back_left
- best: master:wake_up->monster:player_back_left
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:wake_up->monster:player_back_left | 640 | white | -1000000 | 120 | turn 30 / current player / HP player/cpu 0/1 / stones player/cpu 46/44 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 2 |  | master:master_attack->monster:cpu_front_right | 430.9 | white | -1000000 | 117 | turn 30 / current player / HP player/cpu 0/1 / stones player/cpu 45/44 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 3 |  | end_turn | -50.1 | white | -1000000 | 90 | turn 21 / current cpu / HP player/cpu 0/6 / stones player/cpu 27/16 / deck player/cpu 5/4 / hand player/cpu 5/6 |

### step 105

- turn: 10
- plannerSide: player
- currentPlayer: player
- state: turn 10 / current player / HP player/cpu 9/8 / stones player/cpu 5/1 / deck player/cpu 16/16 / hand player/cpu 2/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 shield | cpu_front_right:CF:ボムゾウ Lv1 HP1 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act1/1 focus
- selected: attack:ピグミィ:スパイクボール->ボムゾウ
- best: end_turn
- selectedRank: 2
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ピグミィ:スパイクボール->ボムゾウ | 634.4 | white | -1000000 | 119 | turn 30 / current player / HP player/cpu 0/1 / stones player/cpu 46/44 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 2 |  | master:master_attack->monster:cpu_front_right | 393.8 | white | -1000000 | 91 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 18/8 / deck player/cpu 8/7 / hand player/cpu 5/6 |
| 3 |  | focus:ピグミィ | 345.5 | white | -1000000 | 119 | turn 30 / current player / HP player/cpu 0/1 / stones player/cpu 46/44 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 4 |  | end_turn | -20.1 | white_planner | 1000000 | 173 | turn 30 / current cpu / HP player/cpu 1/0 / stones player/cpu 19/42 / deck player/cpu 0/0 / hand player/cpu 5/5 |


