# White Planner Forced Branch Probe

生成: 2026-07-05T20:14:28.104Z
seed: 994316
direction: challenger-as-player
deck: `master-lab-white-1377-death-sheep3`
branchTop: 5
maxReplaySteps: 430

## Conclusion

- 3/5 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 192

- turn: 16
- plannerSide: player
- currentPlayer: player
- state: turn 16 / current player / HP player/cpu 8/9 / stones player/cpu 3/2 / deck player/cpu 10/10 / hand player/cpu 4/3
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:ドノマンティス Lv1 HP5 prep | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 prep | cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 focus
- selected: master:shield->monster:player_back_right
- best: master:shield->monster:player_front_right
- selectedRank: 4
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:player_back_right | 73.9 | white | -1000000 | 117 | turn 30 / current player / HP player/cpu 0/1 / stones player/cpu 28/19 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 2 |  | master:shield->monster:player_front_right | 66 | white_planner | 1000000 | 108 | turn 30 / current cpu / HP player/cpu 3/0 / stones player/cpu 29/28 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 3 |  | master:shield->monster:player_front_left | 58.2 | white_planner | 1000000 | 90 | turn 26 / current cpu / HP player/cpu 6/0 / stones player/cpu 21/17 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 4 |  | end_turn | -44.8 | white_planner | 1000000 | 107 | turn 31 / current cpu / HP player/cpu 2/0 / stones player/cpu 41/38 / deck player/cpu 0/0 / hand player/cpu 5/5 |

### step 222

- turn: 18
- plannerSide: player
- currentPlayer: player
- state: turn 18 / current player / HP player/cpu 8/9 / stones player/cpu 3/4 / deck player/cpu 8/8 / hand player/cpu 4/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 prep | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 focus | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 shield | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep
- selected: master:shield->monster:player_front_right
- best: end_turn
- selectedRank: 3
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:player_front_right | 192.6 | white | -1000000 | 87 | turn 30 / current player / HP player/cpu 0/1 / stones player/cpu 28/19 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 2 |  | end_turn | -52.5 | white_planner | 1000000 | 78 | turn 27 / current player / HP player/cpu 4/0 / stones player/cpu 13/16 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 3 |  | master:master_attack->monster:cpu_front_left | -224.5 | white_planner | 1000000 | 80 | turn 29 / current cpu / HP player/cpu 3/0 / stones player/cpu 26/26 / deck player/cpu 0/0 / hand player/cpu 5/5 |

### step 278

- turn: 23
- plannerSide: player
- currentPlayer: player
- state: turn 23 / current player / HP player/cpu 5/5 / stones player/cpu 8/1 / deck player/cpu 3/3 / hand player/cpu 5/4
- board: player_front_left:PF:ピグミィ Lv2 HP2 act2/2 | player_front_right:PF:真勇者ダイン Lv1 HP4 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 prep | cpu_front_right:CF:真勇者ダイン Lv1 HP6 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 shield
- selected: master:shield->monster:player_front_left
- best: master:shield->monster:player_front_left
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:player_front_left | 217.2 | white | -1000000 | 31 | turn 30 / current player / HP player/cpu 0/1 / stones player/cpu 28/19 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 2 |  | end_turn | -73.9 | white | -1000000 | 23 | turn 26 / current cpu / HP player/cpu 0/2 / stones player/cpu 18/6 / deck player/cpu 0/0 / hand player/cpu 5/5 |

### step 293

- turn: 25
- plannerSide: player
- currentPlayer: player
- state: turn 25 / current player / HP player/cpu 5/5 / stones player/cpu 11/3 / deck player/cpu 1/1 / hand player/cpu 6/5
- board: player_front_left:PF:ヤンバル Lv2 HP3 act1/1 | player_front_right:PF:ヤンバル Lv2 HP3 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1
- selected: master:shield->monster:player_front_right
- best: end_turn
- selectedRank: 2
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:player_front_right | 188.7 | white | -1000000 | 16 | turn 30 / current player / HP player/cpu 0/1 / stones player/cpu 28/19 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 2 |  | magic:ローテーション->master:player | 156.3 | white | -1000000 | 15 | turn 30 / current player / HP player/cpu 0/1 / stones player/cpu 30/19 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 3 |  | end_turn | -11.6 | white_planner | 1000000 | 19 | turn 30 / current cpu / HP player/cpu 1/0 / stones player/cpu 27/24 / deck player/cpu 0/0 / hand player/cpu 5/4 |

### step 306

- turn: 29
- plannerSide: player
- currentPlayer: player
- state: turn 29 / current player / HP player/cpu 1/2 / stones player/cpu 24/15 / deck player/cpu 0/0 / hand player/cpu 5/5
- board: player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus
- selected: attack:ヤンバル:attack->真勇者ダイン
- best: attack:ヤンバル:attack->真勇者ダイン
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ヤンバル:attack->真勇者ダイン | 1763.7 | white | -1000000 | 3 | turn 30 / current player / HP player/cpu 0/1 / stones player/cpu 28/19 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 2 |  | end_turn | -851684 | white | -1000000 | 2 | turn 29 / current cpu / HP player/cpu 0/1 / stones player/cpu 25/19 / deck player/cpu 0/0 / hand player/cpu 5/5 |
