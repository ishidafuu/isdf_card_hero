# White Planner Forced Branch Probe

生成: 2026-07-06T18:58:48.894Z
seed: 994332
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 6
maxReplaySteps: 220

## Conclusion

- 強制分岐の範囲では、選択手を最終勝敗まで明確に上回る代替は見つからない。

## Samples

### step 107

- turn: 9
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 9 / current cpu / HP cpu/player 7/10 / stones cpu/player 6/1 / deck cpu/player 16/17 / hand cpu/player 6/5
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 shield | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2
- selected: move:cpu_front_left->cpu_back_left
- best: move:cpu_front_left->cpu_back_left
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | move:cpu_front_left->cpu_back_left | 327.7 | white | -1000000 | 91 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | move:cpu_front_left->cpu_back_right | 327.7 | white | -1000000 | 31 | turn 12 / current player / HP cpu/player 0/10 / stones cpu/player 5/8 / deck cpu/player 14/14 / hand cpu/player 5/6 |
| 3 |  | focus:ピグミィ | 177.4 | white | -1000000 | 25 | turn 12 / current player / HP cpu/player 0/10 / stones cpu/player 6/10 / deck cpu/player 14/14 / hand cpu/player 5/6 |
| 4 |  | attack:ピグミィ:スパイクボール->真勇者ダイン | 160.1 | white | -1000000 | 54 | turn 15 / current player / HP cpu/player 0/9 / stones cpu/player 8/14 / deck cpu/player 11/11 / hand cpu/player 5/6 |
| 5 |  | end_turn | 6.2 | white | -1000000 | 94 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 36/47 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 6 |  | move:cpu_front_left->cpu_front_right | 3.2 | white | -1000000 | 61 | turn 18 / current player / HP cpu/player 0/7 / stones cpu/player 18/20 / deck cpu/player 8/8 / hand cpu/player 5/6 |

### step 108

- turn: 9
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 9 / current cpu / HP cpu/player 7/10 / stones cpu/player 6/1 / deck cpu/player 16/17 / hand cpu/player 6/5
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2
- selected: attack:ピグミィ:スパイクボール->真勇者ダイン
- best: attack:ピグミィ:スパイクボール->真勇者ダイン
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ピグミィ:スパイクボール->真勇者ダイン | 304.8 | white | -1000000 | 90 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | attack:ピグミィ:スパイクボール->ボムゾウ | 196.3 | white | -1000000 | 37 | turn 13 / current player / HP cpu/player 0/10 / stones cpu/player 10/6 / deck cpu/player 13/13 / hand cpu/player 5/6 |
| 3 |  | master:master_attack->monster:player_front_right | 178.6 | white | -1000000 | 114 | turn 21 / current player / HP cpu/player 0/7 / stones cpu/player 6/11 / deck cpu/player 5/5 / hand cpu/player 5/6 |
| 4 |  | focus:ピグミィ | 36.7 | white | -1000000 | 34 | turn 12 / current player / HP cpu/player 0/8 / stones cpu/player 6/9 / deck cpu/player 14/14 / hand cpu/player 5/6 |
| 5 |  | end_turn | -43.5 | white | -1000000 | 14 | turn 12 / current player / HP cpu/player 0/10 / stones cpu/player 17/10 / deck cpu/player 14/14 / hand cpu/player 5/6 |
| 6 |  | master:master_attack->monster:player_front_left | -176 | white | -1000000 | 37 | turn 13 / current player / HP cpu/player 0/10 / stones cpu/player 10/6 / deck cpu/player 13/13 / hand cpu/player 5/6 |

### step 109

- turn: 9
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 9 / current cpu / HP cpu/player 7/10 / stones cpu/player 6/1 / deck cpu/player 16/17 / hand cpu/player 6/5
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv2 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2
- selected: summon:ボムゾウ->cpu_front_right
- best: master:master_attack->monster:player_front_right
- selectedRank: 6
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | master:master_attack->monster:player_front_right | 18 | white | -1000000 | 113 | turn 21 / current player / HP cpu/player 0/7 / stones cpu/player 6/11 / deck cpu/player 5/5 / hand cpu/player 5/6 |
| 2 |  | end_turn | -65.6 | white | -1000000 | 15 | turn 12 / current player / HP cpu/player 0/10 / stones cpu/player 15/10 / deck cpu/player 14/14 / hand cpu/player 5/6 |
| 3 |  | master:master_attack->monster:player_front_left | -157 | white | -1000000 | 30 | turn 12 / current player / HP cpu/player 0/9 / stones cpu/player 6/10 / deck cpu/player 14/14 / hand cpu/player 5/6 |
| 4 |  | summon:ボムゾウ->cpu_front_left | -239.2 | white | -1000000 | 126 | turn 24 / current player / HP cpu/player 0/6 / stones cpu/player 14/27 / deck cpu/player 2/2 / hand cpu/player 5/6 |
| 5 |  | summon:ポリスピナー->cpu_front_left | -247 | white | -1000000 | 80 | turn 19 / current player / HP cpu/player 0/4 / stones cpu/player 19/20 / deck cpu/player 7/7 / hand cpu/player 5/5 |
| 6 | Y | summon:ボムゾウ->cpu_front_right | -265.2 | white | -1000000 | 89 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |

### step 110

- turn: 9
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 9 / current cpu / HP cpu/player 7/10 / stones cpu/player 5/1 / deck cpu/player 16/17 / hand cpu/player 5/5
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv2 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 shield | cpu_front_right:CF:ボムゾウ Lv1 HP6 prep | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2
- selected: summon:ポリスピナー->cpu_front_left
- best: end_turn
- selectedRank: 4
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | end_turn | -67.6 | white | -1000000 | 16 | turn 12 / current player / HP cpu/player 0/10 / stones cpu/player 14/10 / deck cpu/player 14/14 / hand cpu/player 5/6 |
| 2 |  | master:master_attack->monster:player_front_left | -157.9 | white | -1000000 | 29 | turn 12 / current player / HP cpu/player 0/9 / stones cpu/player 6/10 / deck cpu/player 14/14 / hand cpu/player 5/6 |
| 3 |  | master:master_attack->monster:player_front_right | -163.9 | white | -1000000 | 112 | turn 21 / current player / HP cpu/player 0/7 / stones cpu/player 6/11 / deck cpu/player 5/5 / hand cpu/player 5/6 |
| 4 | Y | summon:ポリスピナー->cpu_front_left | -216.2 | white | -1000000 | 88 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 5 |  | summon:ポリスピナー->cpu_back_right | -284.3 | white | -1000000 | 22 | turn 12 / current player / HP cpu/player 0/10 / stones cpu/player 14/8 / deck cpu/player 14/14 / hand cpu/player 5/6 |

### step 111

- turn: 9
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 9 / current cpu / HP cpu/player 7/10 / stones cpu/player 4/1 / deck cpu/player 16/17 / hand cpu/player 4/5
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv2 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 shield | cpu_front_left:CF:ポリスピナー Lv1 HP3 prep | cpu_front_right:CF:ボムゾウ Lv1 HP6 prep | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2
- selected: master:shield->monster:cpu_back_left
- best: master:shield->monster:cpu_back_left
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_back_left | 53 | white | -1000000 | 87 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | end_turn | -67.6 | white | -1000000 | 52 | turn 17 / current player / HP cpu/player 0/9 / stones cpu/player 24/11 / deck cpu/player 9/9 / hand cpu/player 5/6 |
| 3 |  | master:master_attack->monster:player_front_right | -214.6 | white | -1000000 | 54 | turn 16 / current player / HP cpu/player 0/9 / stones cpu/player 13/7 / deck cpu/player 10/10 / hand cpu/player 5/6 |
| 4 |  | master:master_attack->monster:player_front_left | -353.6 | white | -1000000 | 67 | turn 16 / current player / HP cpu/player 0/8 / stones cpu/player 9/10 / deck cpu/player 10/10 / hand cpu/player 5/6 |

### step 112

- turn: 9
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 9 / current cpu / HP cpu/player 7/10 / stones cpu/player 2/1 / deck cpu/player 16/17 / hand cpu/player 4/5
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv2 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 shield | cpu_front_left:CF:ポリスピナー Lv1 HP3 prep | cpu_front_right:CF:ボムゾウ Lv1 HP6 prep | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 shield
- selected: end_turn
- best: end_turn
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | end_turn | -67.6 | white | -1000000 | 86 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |


