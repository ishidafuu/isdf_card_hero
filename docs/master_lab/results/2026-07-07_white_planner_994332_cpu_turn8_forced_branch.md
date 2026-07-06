# White Planner Forced Branch Probe

生成: 2026-07-06T19:16:48.466Z
seed: 994332
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 6
maxReplaySteps: 220

## Conclusion

- 1/6 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 94

- turn: 8
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 8 / current cpu / HP cpu/player 8/10 / stones cpu/player 4/1 / deck cpu/player 17/18 / hand cpu/player 6/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 shield | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus
- selected: move:cpu_front_right->cpu_back_left
- best: attack:ピグミィ:スパイクボール->ヤンバル
- selectedRank: 3
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | master:master_attack->monster:player_front_left | 268.6 | white | -1000000 | 38 | turn 12 / current player / HP cpu/player 0/10 / stones cpu/player 8/6 / deck cpu/player 14/14 / hand cpu/player 5/6 |
| 2 | Y | move:cpu_front_right->cpu_back_left | 206.8 | white | -1000000 | 104 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | move:cpu_front_right->cpu_back_right | 206.8 | white | -1000000 | 104 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 4 |  | attack:ピグミィ:スパイクボール->ヤンバル | 184.2 | white | -1000000 | 104 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 5 |  | move:cpu_front_right->cpu_front_left | 6.5 | white | -1000000 | 63 | turn 15 / current player / HP cpu/player 0/9 / stones cpu/player 23/8 / deck cpu/player 11/11 / hand cpu/player 5/6 |
| 6 |  | attack:ピグミィ:スパイクボール->ヤンバル | -8.3 | white_planner | 1000000 | 56 | turn 15 / current cpu / HP cpu/player 3/0 / stones cpu/player 14/25 / deck cpu/player 10/11 / hand cpu/player 6/5 |

### step 95

- turn: 8
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 8 / current cpu / HP cpu/player 8/10 / stones cpu/player 4/1 / deck cpu/player 17/18 / hand cpu/player 6/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 shield | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2
- selected: attack:ピグミィ:スパイクボール->ヤンバル
- best: attack:ピグミィ:スパイクボール->ヤンバル
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ピグミィ:スパイクボール->ヤンバル | 285.3 | white | -1000000 | 103 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | master:master_attack->monster:player_front_left | 264.9 | white | -1000000 | 37 | turn 12 / current player / HP cpu/player 0/10 / stones cpu/player 8/6 / deck cpu/player 14/14 / hand cpu/player 5/6 |
| 3 |  | focus:ピグミィ | 36.7 | white | -1000000 | 64 | turn 14 / current player / HP cpu/player 0/8 / stones cpu/player 10/7 / deck cpu/player 12/12 / hand cpu/player 5/6 |
| 4 |  | summon:ボムゾウ->cpu_front_left | -39.4 | white | -1000000 | 103 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 5 |  | end_turn | -44.3 | white | -1000000 | 102 | turn 19 / current player / HP cpu/player 0/9 / stones cpu/player 7/9 / deck cpu/player 7/7 / hand cpu/player 5/6 |
| 6 |  | summon:ボムゾウ->cpu_front_left | -198.2 | white | -1000000 | 103 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |

### step 96

- turn: 8
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 8 / current cpu / HP cpu/player 8/10 / stones cpu/player 4/1 / deck cpu/player 17/18 / hand cpu/player 6/5
- board: player_front_left:PF:ヤンバル Lv1 HP2 act1/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 shield | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2
- selected: summon:ボムゾウ->cpu_front_left
- best: summon:ボムゾウ->cpu_front_left
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ボムゾウ->cpu_front_left | 541.8 | white | -1000000 | 102 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | summon:ボムゾウ->cpu_front_left | 541.8 | white | -1000000 | 102 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | summon:ポリスピナー->cpu_front_left | 508.1 | white | -1000000 | 31 | turn 12 / current player / HP cpu/player 0/10 / stones cpu/player 15/6 / deck cpu/player 14/14 / hand cpu/player 5/6 |
| 4 |  | master:master_attack->monster:player_front_left | 332.1 | white | -1000000 | 36 | turn 12 / current player / HP cpu/player 0/10 / stones cpu/player 8/6 / deck cpu/player 14/14 / hand cpu/player 5/6 |
| 5 |  | end_turn | -66.5 | white | -1000000 | 45 | turn 13 / current player / HP cpu/player 0/10 / stones cpu/player 13/5 / deck cpu/player 13/13 / hand cpu/player 5/6 |
| 6 |  | summon:ボムゾウ->cpu_front_right | -220.2 | white | -1000000 | 84 | turn 16 / current player / HP cpu/player 0/7 / stones cpu/player 11/10 / deck cpu/player 10/10 / hand cpu/player 5/6 |

### step 97

- turn: 8
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 8 / current cpu / HP cpu/player 8/10 / stones cpu/player 3/1 / deck cpu/player 17/18 / hand cpu/player 5/5
- board: player_front_left:PF:ヤンバル Lv1 HP2 act1/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 shield | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ボムゾウ Lv1 HP6 prep | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2
- selected: master:wake_up->monster:cpu_front_left
- best: master:wake_up->monster:cpu_front_left
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:wake_up->monster:cpu_front_left | 612.6 | white | -1000000 | 101 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | master:master_attack->monster:player_front_left | 305.4 | white | -1000000 | 83 | turn 15 / current player / HP cpu/player 0/7 / stones cpu/player 10/8 / deck cpu/player 11/11 / hand cpu/player 5/6 |
| 3 |  | summon:ボムゾウ->cpu_front_right | 103.1 | white | -1000000 | 69 | turn 15 / current player / HP cpu/player 0/10 / stones cpu/player 12/13 / deck cpu/player 11/11 / hand cpu/player 5/6 |
| 4 |  | summon:ポリスピナー->cpu_front_right | 95.3 | white | -1000000 | 46 | turn 13 / current player / HP cpu/player 0/10 / stones cpu/player 7/7 / deck cpu/player 13/13 / hand cpu/player 5/6 |
| 5 |  | end_turn | -67.5 | white | -1000000 | 115 | turn 28 / current cpu / HP cpu/player 0/5 / stones cpu/player 42/41 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 6 |  | summon:ボムゾウ->cpu_back_right | -262.2 | white | -1000000 | 69 | turn 15 / current player / HP cpu/player 0/10 / stones cpu/player 12/13 / deck cpu/player 11/11 / hand cpu/player 5/6 |

### step 98

- turn: 8
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 8 / current cpu / HP cpu/player 8/10 / stones cpu/player 1/1 / deck cpu/player 17/18 / hand cpu/player 5/5
- board: player_front_left:PF:ヤンバル Lv1 HP2 act1/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 shield | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2
- selected: attack:ボムゾウ:self_bomb->ヤンバル
- best: attack:ボムゾウ:self_bomb->ヤンバル
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ボムゾウ:self_bomb->ヤンバル | 628.8 | white | -1000000 | 100 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | focus:ボムゾウ | 92.9 | white | -1000000 | 62 | turn 15 / current player / HP cpu/player 0/9 / stones cpu/player 15/7 / deck cpu/player 11/11 / hand cpu/player 5/6 |
| 3 |  | attack:ボムゾウ:storm_bomb->ヤンバル | 13.4 | white | -1000000 | 93 | turn 18 / current player / HP cpu/player 0/10 / stones cpu/player 12/15 / deck cpu/player 8/8 / hand cpu/player 5/6 |
| 4 |  | end_turn | -3.5 | white | -1000000 | 117 | turn 24 / current player / HP cpu/player 0/5 / stones cpu/player 18/28 / deck cpu/player 2/2 / hand cpu/player 5/6 |
| 5 |  | summon:ボムゾウ->cpu_front_right | -54.5 | white | -1000000 | 68 | turn 15 / current player / HP cpu/player 0/10 / stones cpu/player 12/13 / deck cpu/player 11/11 / hand cpu/player 5/6 |
| 6 |  | summon:ポリスピナー->cpu_front_right | -319.2 | white | -1000000 | 45 | turn 13 / current player / HP cpu/player 0/10 / stones cpu/player 7/7 / deck cpu/player 13/13 / hand cpu/player 5/6 |

### step 99

- turn: 8
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 8 / current cpu / HP cpu/player 8/10 / stones cpu/player 0/2 / deck cpu/player 17/18 / hand cpu/player 5/5
- board: player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 shield | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2
- selected: end_turn
- best: end_turn
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | end_turn | -121.7 | white | -1000000 | 99 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |


