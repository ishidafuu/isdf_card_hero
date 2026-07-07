# White Planner Forced Branch Probe

生成: 2026-07-06T23:04:59.946Z
seed: 994335
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 5
maxReplaySteps: 90

## Conclusion

- 強制分岐の範囲では、選択手を最終勝敗まで明確に上回る代替は見つからない。

## Samples

### step 218

- turn: 16
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 16 / current cpu / HP cpu/player 8/6 / stones cpu/player 6/2 / deck cpu/player 9/10 / hand cpu/player 4/5
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 focus | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ドノマンティス Lv1 HP5 act1/1 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act1/2 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1
- selected: attack:ポリスピナー:attack->player master
- best: attack:ポリスピナー:attack->player master
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ポリスピナー:attack->player master | 236.6 | white | -1000000 | 50 | turn 22 / current player / HP cpu/player 0/5 / stones cpu/player 11/10 / deck cpu/player 4/4 / hand cpu/player 5/6 |
| 2 |  | focus:ポリスピナー | 111.8 | white | -1000000 | 44 | turn 21 / current player / HP cpu/player 0/6 / stones cpu/player 14/6 / deck cpu/player 5/5 / hand cpu/player 5/6 |
| 3 |  | focus:ボムゾウ | 54.1 | white | -1000000 | 50 | turn 22 / current player / HP cpu/player 0/5 / stones cpu/player 11/10 / deck cpu/player 4/4 / hand cpu/player 5/6 |
| 4 |  | attack:ボムゾウ:self_bomb->デスシープ | -129.8 | white | -1000000 | 52 | turn 24 / current player / HP cpu/player 0/5 / stones cpu/player 21/20 / deck cpu/player 2/2 / hand cpu/player 5/6 |
| 5 |  | end_turn | -145.2 | white | -1000000 | 69 | turn 26 / current cpu / HP cpu/player 0/6 / stones cpu/player 15/20 / deck cpu/player 0/0 / hand cpu/player 5/5 |

### step 220

- turn: 16
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 16 / current cpu / HP cpu/player 8/5 / stones cpu/player 6/3 / deck cpu/player 9/10 / hand cpu/player 4/5
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 focus | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ドノマンティス Lv1 HP5 act1/1 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1
- selected: master:shield->monster:cpu_front_right
- best: master:shield->monster:cpu_front_right
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_front_right | 165.6 | white | -1000000 | 48 | turn 22 / current player / HP cpu/player 0/5 / stones cpu/player 11/10 / deck cpu/player 4/4 / hand cpu/player 5/6 |
| 2 |  | master:shield->monster:cpu_front_left | 133.6 | white | -1000000 | 48 | turn 22 / current player / HP cpu/player 0/5 / stones cpu/player 11/10 / deck cpu/player 4/4 / hand cpu/player 5/6 |
| 3 |  | master:shield->monster:cpu_back_left | 131.1 | white | -1000000 | 49 | turn 22 / current player / HP cpu/player 0/5 / stones cpu/player 7/14 / deck cpu/player 4/4 / hand cpu/player 5/6 |
| 4 |  | end_turn | -326.7 | white | -1000000 | 67 | turn 26 / current cpu / HP cpu/player 0/4 / stones cpu/player 18/21 / deck cpu/player 0/0 / hand cpu/player 5/5 |

### step 221

- turn: 16
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 16 / current cpu / HP cpu/player 8/5 / stones cpu/player 4/3 / deck cpu/player 9/10 / hand cpu/player 4/5
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 focus | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ドノマンティス Lv1 HP5 act1/1 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 shield | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1
- selected: master:shield->monster:cpu_front_left
- best: master:shield->monster:cpu_front_left
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_front_left | -116.6 | white | -1000000 | 47 | turn 22 / current player / HP cpu/player 0/5 / stones cpu/player 11/10 / deck cpu/player 4/4 / hand cpu/player 5/6 |
| 2 |  | master:shield->monster:cpu_back_left | -119.1 | white | -1000000 | 48 | turn 22 / current player / HP cpu/player 0/5 / stones cpu/player 7/14 / deck cpu/player 4/4 / hand cpu/player 5/6 |
| 3 |  | end_turn | -321.9 | white | -1000000 | 56 | turn 28 / current cpu / HP cpu/player 0/2 / stones cpu/player 30/33 / deck cpu/player 0/0 / hand cpu/player 5/5 |


