# White Planner Forced Branch Probe

生成: 2026-07-06T16:54:48.190Z
seed: 994331
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 10
maxReplaySteps: 240

## Conclusion

- 強制分岐の範囲では、選択手を最終勝敗まで明確に上回る代替は見つからない。

## Samples

### step 176

- turn: 16
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 16 / current cpu / HP cpu/player 6/3 / stones cpu/player 13/3 / deck cpu/player 9/10 / hand cpu/player 5/5
- board: player_front_left:PF:ボムゾウ Lv2 HP2 act1/1 shield | player_back_left:PB:真勇者ダイン Lv3 HP5 act1/1 | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act1/2
- selected: attack:ポリスピナー:attack->player master
- best: attack:ポリスピナー:attack->player master
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ポリスピナー:attack->player master | 1100.3 | white | -1000000 | 23 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 19/12 / deck cpu/player 6/6 / hand cpu/player 5/6 |
| 2 |  | end_turn | 602.9 | white | -1000000 | 19 | turn 20 / current player / HP cpu/player 0/3 / stones cpu/player 25/11 / deck cpu/player 6/6 / hand cpu/player 5/6 |

### step 177

- turn: 16
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 16 / current cpu / HP cpu/player 6/2 / stones cpu/player 13/4 / deck cpu/player 9/10 / hand cpu/player 5/5
- board: player_front_left:PF:ボムゾウ Lv2 HP2 act1/1 shield | player_back_left:PB:真勇者ダイン Lv3 HP5 act1/1 | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2
- selected: master:shield->monster:cpu_front_left
- best: master:shield->monster:cpu_front_left
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_front_left | 219.1 | white | -1000000 | 22 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 19/12 / deck cpu/player 6/6 / hand cpu/player 5/6 |
| 2 |  | master:shield->monster:cpu_front_right | 160.6 | white | -1000000 | 22 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 19/12 / deck cpu/player 6/6 / hand cpu/player 5/6 |
| 3 |  | end_turn | -317.2 | white | -1000000 | 16 | turn 19 / current player / HP cpu/player 0/2 / stones cpu/player 22/12 / deck cpu/player 7/7 / hand cpu/player 5/6 |

### step 178

- turn: 16
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 16 / current cpu / HP cpu/player 6/2 / stones cpu/player 11/4 / deck cpu/player 9/10 / hand cpu/player 5/5
- board: player_front_left:PF:ボムゾウ Lv2 HP2 act1/1 shield | player_back_left:PB:真勇者ダイン Lv3 HP5 act1/1 | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 focus,shield | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2
- selected: master:shield->monster:cpu_front_right
- best: master:shield->monster:cpu_front_right
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_front_right | 160.6 | white | -1000000 | 21 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 19/12 / deck cpu/player 6/6 / hand cpu/player 5/6 |
| 2 |  | end_turn | -317.2 | white | -1000000 | 16 | turn 19 / current player / HP cpu/player 0/2 / stones cpu/player 20/12 / deck cpu/player 7/7 / hand cpu/player 5/6 |

### step 189

- turn: 18
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 18 / current cpu / HP cpu/player 5/2 / stones cpu/player 16/6 / deck cpu/player 7/8 / hand cpu/player 6/5
- board: player_front_left:PF:ボムゾウ Lv2 HP2 act0/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act1/2 focus | player_back_left:PB:真勇者ダイン Lv3 HP5 act0/1 focus | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 focus
- selected: attack:ピグミィ:attack->ボムゾウ
- best: attack:ピグミィ:attack->ボムゾウ
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ピグミィ:attack->ボムゾウ | 499.8 | white | -1000000 | 10 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 19/12 / deck cpu/player 6/6 / hand cpu/player 5/6 |
| 2 |  | attack:ピグミィ:スパイクボール->ポリスピナー | 385.4 | white | -1000000 | 14 | turn 21 / current player / HP cpu/player 0/2 / stones cpu/player 20/15 / deck cpu/player 5/5 / hand cpu/player 5/6 |
| 3 |  | end_turn | -11.6 | white | -1000000 | 7 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 24/14 / deck cpu/player 6/6 / hand cpu/player 5/6 |

### step 190

- turn: 18
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 18 / current cpu / HP cpu/player 5/2 / stones cpu/player 16/6 / deck cpu/player 7/8 / hand cpu/player 6/5
- board: player_front_left:PF:ボムゾウ Lv2 HP2 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act1/2 focus | player_back_left:PB:真勇者ダイン Lv3 HP5 act0/1 focus | cpu_front_left:CF:ピグミィ Lv1 HP3 act1/2
- selected: master:master_attack->monster:player_front_left
- best: master:master_attack->monster:player_front_left
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:master_attack->monster:player_front_left | 898.2 | white | -1000000 | 9 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 19/12 / deck cpu/player 6/6 / hand cpu/player 5/6 |
| 2 |  | attack:ピグミィ:スパイクボール->ポリスピナー | 659.9 | white | -1000000 | 9 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 19/12 / deck cpu/player 6/6 / hand cpu/player 5/6 |
| 3 |  | end_turn | 44.5 | white | -1000000 | 13 | turn 21 / current player / HP cpu/player 0/2 / stones cpu/player 22/15 / deck cpu/player 5/5 / hand cpu/player 5/6 |

### step 191

- turn: 18
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 18 / current cpu / HP cpu/player 5/2 / stones cpu/player 13/8 / deck cpu/player 7/8 / hand cpu/player 6/5
- board: player_front_right:PF:ポリスピナー Lv1 HP3 act1/2 focus | player_back_left:PB:真勇者ダイン Lv3 HP5 act0/1 focus | cpu_front_left:CF:ピグミィ Lv1 HP3 act1/2
- selected: attack:ピグミィ:スパイクボール->ポリスピナー
- best: attack:ピグミィ:スパイクボール->ポリスピナー
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ピグミィ:スパイクボール->ポリスピナー | 366.6 | white | -1000000 | 8 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 19/12 / deck cpu/player 6/6 / hand cpu/player 5/6 |
| 2 |  | end_turn | -1102.6 | white | -1000000 | 8 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 19/12 / deck cpu/player 6/6 / hand cpu/player 5/6 |

### step 196

- turn: 19
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 19 / current cpu / HP cpu/player 2/2 / stones cpu/player 19/9 / deck cpu/player 6/7 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP5 act1/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 focus,shield | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2
- selected: master:shield->monster:cpu_front_left
- best: master:shield->monster:cpu_front_left
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_front_left | 61.6 | white | -1000000 | 3 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 19/12 / deck cpu/player 6/6 / hand cpu/player 5/6 |
| 2 |  | end_turn | -851738.3 | white | -1000000 | 2 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 21/12 / deck cpu/player 6/6 / hand cpu/player 5/6 |


