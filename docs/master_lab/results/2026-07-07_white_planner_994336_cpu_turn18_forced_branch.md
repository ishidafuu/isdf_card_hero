# White Planner Forced Branch Probe

生成: 2026-07-06T21:28:25.842Z
seed: 994336
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 6
maxReplaySteps: 120

## Conclusion

- 1/5 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 200

- turn: 18
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 18 / current cpu / HP cpu/player 8/6 / stones cpu/player 4/0 / deck cpu/player 7/8 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act2/2 | player_back_left:PB:デスシープ Lv1 HP1 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1
- selected: attack:ボムゾウ:storm_bomb->デスシープ
- best: attack:ボムゾウ:storm_bomb->デスシープ
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ボムゾウ:storm_bomb->デスシープ | 815.3 | white | -1000000 | 59 | turn 29 / current cpu / HP cpu/player 0/1 / stones cpu/player 30/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | attack:ポリスピナー:attack->ポリスピナー | 798.6 | white | -1000000 | 35 | turn 24 / current player / HP cpu/player 0/3 / stones cpu/player 19/15 / deck cpu/player 1/2 / hand cpu/player 5/6 |
| 3 |  | magic:ワープ->monster:player_front_right:monster:player_back_right | 782.9 | white | -1000000 | 59 | turn 29 / current cpu / HP cpu/player 0/1 / stones cpu/player 30/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 4 |  | attack:ボムゾウ:storm_bomb->ポリスピナー | 88.5 | white | -1000000 | 60 | turn 28 / current cpu / HP cpu/player 0/1 / stones cpu/player 17/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 5 |  | magic:ワープ->monster:player_back_right:monster:player_front_right | 63.2 | white | -1000000 | 59 | turn 29 / current cpu / HP cpu/player 0/1 / stones cpu/player 30/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 6 |  | magic:ワープ->monster:player_front_left:monster:player_back_right | 62.5 | white | -1000000 | 62 | turn 28 / current cpu / HP cpu/player 0/4 / stones cpu/player 24/18 / deck cpu/player 0/0 / hand cpu/player 5/5 |

### step 201

- turn: 18
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 18 / current cpu / HP cpu/player 8/6 / stones cpu/player 4/1 / deck cpu/player 7/8 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act2/2 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1
- selected: magic:ワープ->monster:player_front_right:monster:player_back_right
- best: magic:ワープ->monster:player_front_left:monster:player_back_right
- selectedRank: 2
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | magic:ワープ->monster:player_front_left:monster:player_back_right | 755.9 | white | -1000000 | 61 | turn 28 / current cpu / HP cpu/player 0/4 / stones cpu/player 24/18 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 | Y | magic:ワープ->monster:player_front_right:monster:player_back_right | 682.2 | white | -1000000 | 58 | turn 29 / current cpu / HP cpu/player 0/1 / stones cpu/player 30/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | magic:ワープ->monster:player_back_right:monster:player_front_right | 682.2 | white | -1000000 | 58 | turn 29 / current cpu / HP cpu/player 0/1 / stones cpu/player 30/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 4 |  | attack:ポリスピナー:attack->ポリスピナー | 579.5 | white | -1000000 | 27 | turn 22 / current player / HP cpu/player 0/1 / stones cpu/player 17/9 / deck cpu/player 4/4 / hand cpu/player 5/6 |
| 5 |  | magic:ワープ->monster:player_back_right:monster:player_front_left | 61 | white | -1000000 | 61 | turn 28 / current cpu / HP cpu/player 0/4 / stones cpu/player 24/18 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 6 |  | master:master_attack->monster:player_front_right | -2.4 | white | -1000000 | 28 | turn 22 / current player / HP cpu/player 0/1 / stones cpu/player 14/9 / deck cpu/player 4/4 / hand cpu/player 5/6 |

### step 202

- turn: 18
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 18 / current cpu / HP cpu/player 8/6 / stones cpu/player 1/1 / deck cpu/player 7/8 / hand cpu/player 5/5
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ポリスピナー Lv1 HP3 act2/2 | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1
- selected: attack:ポリスピナー:attack->ヤンバル
- best: attack:ポリスピナー:attack->ヤンバル
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ポリスピナー:attack->ヤンバル | 702.8 | white | -1000000 | 57 | turn 29 / current cpu / HP cpu/player 0/1 / stones cpu/player 30/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | focus:真勇者ダイン | 71.7 | white | -1000000 | 57 | turn 29 / current cpu / HP cpu/player 0/1 / stones cpu/player 30/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | end_turn | -64.5 | white | -1000000 | 69 | turn 27 / current cpu / HP cpu/player 0/4 / stones cpu/player 23/12 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 4 |  | move:cpu_back_left->cpu_front_right | -210.4 | white | -1000000 | 32 | turn 22 / current player / HP cpu/player 0/6 / stones cpu/player 11/10 / deck cpu/player 4/4 / hand cpu/player 5/6 |
| 5 |  | attack:ポリスピナー:attack->player master | -407.4 | white | -1000000 | 40 | turn 24 / current player / HP cpu/player 0/3 / stones cpu/player 20/18 / deck cpu/player 2/2 / hand cpu/player 5/6 |

### step 203

- turn: 18
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 18 / current cpu / HP cpu/player 8/6 / stones cpu/player 0/3 / deck cpu/player 7/8 / hand cpu/player 5/5
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act2/2 | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act1/2 | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1
- selected: attack:ポリスピナー:attack->player master
- best: end_turn
- selectedRank: 4
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ポリスピナー:attack->player master | 179 | white | -1000000 | 56 | turn 29 / current cpu / HP cpu/player 0/1 / stones cpu/player 30/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | end_turn | 112 | white_planner | 1000000 | 31 | turn 23 / current cpu / HP cpu/player 6/0 / stones cpu/player 9/19 / deck cpu/player 2/3 / hand cpu/player 6/5 |
| 3 |  | focus:ポリスピナー | 77.4 | white_planner | 1000000 | 33 | turn 23 / current cpu / HP cpu/player 6/0 / stones cpu/player 9/19 / deck cpu/player 2/3 / hand cpu/player 6/5 |
| 4 |  | focus:真勇者ダイン | -13 | white | -1000000 | 56 | turn 29 / current cpu / HP cpu/player 0/1 / stones cpu/player 30/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 5 |  | move:cpu_back_left->cpu_front_right | -86.5 | white_planner | 1000000 | 46 | turn 29 / current player / HP cpu/player 5/0 / stones cpu/player 34/29 / deck cpu/player 0/0 / hand cpu/player 5/5 |

### step 204

- turn: 18
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 18 / current cpu / HP cpu/player 8/5 / stones cpu/player 0/4 / deck cpu/player 7/8 / hand cpu/player 5/5
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act2/2 | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1
- selected: focus:真勇者ダイン
- best: focus:真勇者ダイン
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | focus:真勇者ダイン | 38 | white | -1000000 | 55 | turn 29 / current cpu / HP cpu/player 0/1 / stones cpu/player 30/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | end_turn | -30.3 | white | -1000000 | 54 | turn 29 / current cpu / HP cpu/player 0/1 / stones cpu/player 30/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |


