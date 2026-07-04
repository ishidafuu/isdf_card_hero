# White Planner Summon Slot Audit

生成: 2026-07-04T14:35:19.631Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994300-994303
directions: challenger-as-cpu, challenger-as-player
turnRange: 6-12
branchTop: 4
maxReplaySteps: 150
improvementThreshold: 180

## Conclusion

- 14件の selected summon slot choice を再生比較したが、閾値以上の悪化は見つからない。
- 次は summon slot より、召喚を選ばない/選ぶの二択、または相手応答込みの候補比較へ移る。

## Promising

- なし

## Samples

### 994300 challenger-as-cpu

- plannerSide: cpu
- scannedSteps: 220
- capturedCases: 2

#### step 91 / turn 8

- state: turn 8 / current cpu / HP cpu/player 10/10 / stones cpu/player 5/2 / deck cpu/player 17/18 / hand cpu/player 5/4
- board: player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus
- selected: summon:ヤンバル->cpu_back_left
- best: summon:ヤンバル->cpu_back_left
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ヤンバル->cpu_back_left | 171.4 | - | 202.8 | 150 | turn 21 / current cpu / HP cpu/player 6/5 / stones cpu/player 2/8 / deck cpu/player 4/5 / hand cpu/player 5/4 |
| 2 |  | summon:ヤンバル->cpu_back_right | 171.4 | white | -1000000 | 91 | turn 18 / current player / HP cpu/player 0/2 / stones cpu/player 2/16 / deck cpu/player 8/8 / hand cpu/player 5/6 |

#### step 111 / turn 10

- state: turn 10 / current cpu / HP cpu/player 10/10 / stones cpu/player 5/4 / deck cpu/player 15/16 / hand cpu/player 6/4
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 shield | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1
- selected: summon:デスシープ->cpu_front_right
- best: summon:デスシープ->cpu_front_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:デスシープ->cpu_front_right | 234 | - | 215 | 150 | turn 23 / current player / HP cpu/player 6/5 / stones cpu/player 0/6 / deck cpu/player 3/3 / hand cpu/player 5/5 |
| 2 |  | summon:デスシープ->cpu_back_right | 192 | - | 215 | 150 | turn 23 / current player / HP cpu/player 6/5 / stones cpu/player 0/6 / deck cpu/player 3/3 / hand cpu/player 5/5 |

### 994300 challenger-as-player

- plannerSide: player
- scannedSteps: 220
- capturedCases: 0

### 994301 challenger-as-cpu

- plannerSide: cpu
- scannedSteps: 220
- capturedCases: 2

#### step 66 / turn 6

- state: turn 6 / current cpu / HP cpu/player 10/10 / stones cpu/player 6/1 / deck cpu/player 19/20 / hand cpu/player 4/4
- board: player_front_left:PF:真勇者ダイン Lv1 HP3 act1/1 | player_front_right:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2
- selected: summon:ポリスピナー->cpu_front_right
- best: summon:ポリスピナー->cpu_front_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ポリスピナー->cpu_front_right | 181.2 | - | 387 | 150 | turn 22 / current cpu / HP cpu/player 6/1 / stones cpu/player 12/26 / deck cpu/player 3/4 / hand cpu/player 6/5 |
| 2 |  | summon:ポリスピナー->cpu_back_right | 161.6 | white | -1000000 | 73 | turn 13 / current player / HP cpu/player 0/7 / stones cpu/player 17/9 / deck cpu/player 13/13 / hand cpu/player 5/6 |

#### step 81 / turn 7

- state: turn 7 / current cpu / HP cpu/player 10/10 / stones cpu/player 5/1 / deck cpu/player 18/19 / hand cpu/player 4/4
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv2 HP6 act1/1 shield | player_back_left:PB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:ピグミィ Lv2 HP3 act2/2 | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2
- selected: summon:ドノマンティス->cpu_front_right
- best: summon:ドノマンティス->cpu_front_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ドノマンティス->cpu_front_right | 154.4 | white_planner | 1000000 | 148 | turn 27 / current player / HP cpu/player 5/0 / stones cpu/player 21/42 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | summon:ドノマンティス->cpu_back_right | 109.3 | white_planner | 1000000 | 148 | turn 27 / current player / HP cpu/player 5/0 / stones cpu/player 21/42 / deck cpu/player 0/0 / hand cpu/player 5/5 |

### 994301 challenger-as-player

- plannerSide: player
- scannedSteps: 112
- capturedCases: 3

#### step 65 / turn 6

- state: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 4/2 / deck player/cpu 20/20 / hand player/cpu 4/3
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1
- selected: summon:真勇者ダイン->player_front_right
- best: summon:真勇者ダイン->player_front_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:真勇者ダイン->player_front_right | 235.2 | white_planner | 1000000 | 48 | turn 12 / current player / HP player/cpu 9/0 / stones player/cpu 11/14 / deck player/cpu 14/14 / hand player/cpu 6/5 |
| 2 |  | summon:真勇者ダイン->player_back_right | 193.2 | white_planner | 1000000 | 48 | turn 12 / current player / HP player/cpu 9/0 / stones player/cpu 11/14 / deck player/cpu 14/14 / hand player/cpu 6/5 |

#### step 74 / turn 7

- state: turn 7 / current player / HP player/cpu 10/9 / stones player/cpu 5/4 / deck player/cpu 19/19 / hand player/cpu 4/3
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 prep
- selected: summon:ポリスピナー->player_back_left
- best: summon:ポリスピナー->player_back_left
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ポリスピナー->player_back_left | 177.2 | white_planner | 1000000 | 39 | turn 12 / current player / HP player/cpu 9/0 / stones player/cpu 11/14 / deck player/cpu 14/14 / hand player/cpu 6/5 |
| 2 |  | summon:ポリスピナー->player_back_right | 177.2 | white_planner | 1000000 | 38 | turn 12 / current player / HP player/cpu 9/0 / stones player/cpu 14/14 / deck player/cpu 14/14 / hand player/cpu 6/5 |

#### step 94 / turn 9

- state: turn 9 / current player / HP player/cpu 10/7 / stones player/cpu 5/0 / deck player/cpu 17/17 / hand player/cpu 5/4
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 focus
- selected: summon:ヤンバル->player_back_left
- best: summon:ヤンバル->player_back_left
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ヤンバル->player_back_left | 193.1 | white_planner | 1000000 | 19 | turn 12 / current player / HP player/cpu 9/0 / stones player/cpu 11/14 / deck player/cpu 14/14 / hand player/cpu 6/5 |
| 2 |  | summon:ヤンバル->player_back_right | 139.9 | white_planner | 1000000 | 18 | turn 12 / current player / HP player/cpu 10/0 / stones player/cpu 8/16 / deck player/cpu 14/14 / hand player/cpu 6/5 |
| 3 |  | summon:ヤンバル->player_front_right | 100.3 | white_planner | 1000000 | 32 | turn 13 / current player / HP player/cpu 5/0 / stones player/cpu 15/7 / deck player/cpu 13/13 / hand player/cpu 6/5 |

### 994302 challenger-as-cpu

- plannerSide: cpu
- scannedSteps: 220
- capturedCases: 1

#### step 121 / turn 11

- state: turn 11 / current cpu / HP cpu/player 10/7 / stones cpu/player 5/1 / deck cpu/player 14/15 / hand cpu/player 6/4
- board: player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus
- selected: summon:デスシープ->cpu_front_left
- best: summon:デスシープ->cpu_front_left
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:デスシープ->cpu_front_left | 189.7 | white_planner | 1000000 | 102 | turn 27 / current player / HP cpu/player 7/0 / stones cpu/player 29/42 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | summon:デスシープ->cpu_back_left | -82 | white_planner | 1000000 | 41 | turn 17 / current cpu / HP cpu/player 10/0 / stones cpu/player 12/16 / deck cpu/player 8/9 / hand cpu/player 6/5 |

### 994302 challenger-as-player

- plannerSide: player
- scannedSteps: 117
- capturedCases: 4

#### step 62 / turn 6

- state: turn 6 / current player / HP player/cpu 9/10 / stones player/cpu 5/2 / deck player/cpu 20/20 / hand player/cpu 4/4
- board: player_front_left:PF:ヤンバル Lv2 HP3 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep
- selected: summon:ヤンバル->player_back_right
- best: summon:ヤンバル->player_back_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ヤンバル->player_back_right | 163.3 | - | -514 | 150 | turn 20 / current player / HP player/cpu 5/7 / stones player/cpu 8/1 / deck player/cpu 6/6 / hand player/cpu 6/5 |
| 2 |  | summon:ヤンバル->player_front_right | 120.6 | - | -514 | 150 | turn 20 / current player / HP player/cpu 5/7 / stones player/cpu 8/1 / deck player/cpu 6/6 / hand player/cpu 6/5 |

#### step 72 / turn 7

- state: turn 7 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 19/19 / hand player/cpu 4/4
- board: player_front_right:PF:ヤンバル Lv1 HP3 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 | cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus
- selected: summon:ポリスピナー->player_front_left
- best: summon:ポリスピナー->player_front_left
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ポリスピナー->player_front_left | 139.3 | - | -388.2 | 150 | turn 20 / current cpu / HP player/cpu 4/7 / stones player/cpu 1/5 / deck player/cpu 6/5 / hand player/cpu 4/5 |
| 2 |  | summon:ポリスピナー->player_back_left | 92.3 | - | -648 | 150 | turn 23 / current cpu / HP player/cpu 4/9 / stones player/cpu 23/24 / deck player/cpu 3/2 / hand player/cpu 5/6 |

#### step 83 / turn 8

- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 3/2 / deck player/cpu 18/18 / hand player/cpu 4/5
- board: player_front_left:PF:ヤンバル Lv2 HP3 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act1/2 | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus
- selected: summon:ドノマンティス->player_front_right
- best: summon:ドノマンティス->player_front_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ドノマンティス->player_front_right | 153.3 | - | -331 | 150 | turn 22 / current player / HP player/cpu 4/7 / stones player/cpu 7/4 / deck player/cpu 4/4 / hand player/cpu 6/5 |
| 2 |  | summon:ドノマンティス->player_back_right | -72.5 | - | -331 | 150 | turn 22 / current player / HP player/cpu 4/7 / stones player/cpu 7/4 / deck player/cpu 4/4 / hand player/cpu 6/5 |

#### step 117 / turn 11

- state: turn 11 / current player / HP player/cpu 5/8 / stones player/cpu 3/4 / deck player/cpu 15/15 / hand player/cpu 5/5
- board: player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:ピグミィ Lv1 HP3 prep | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 shield | cpu_back_left:CB:ドノマンティス Lv1 HP5 act1/1 focus | cpu_back_right:CB:ボムゾウ Lv2 HP5 act1/1 shield
- selected: summon:真勇者ダイン->player_front_right
- best: summon:真勇者ダイン->player_front_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:真勇者ダイン->player_front_right | 234.7 | white_planner | 1000000 | 147 | turn 28 / current player / HP player/cpu 1/0 / stones player/cpu 21/22 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 2 |  | summon:真勇者ダイン->player_front_left | 216.5 | - | -513 | 150 | turn 27 / current cpu / HP player/cpu 2/6 / stones player/cpu 12/24 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 3 |  | summon:真勇者ダイン->player_back_left | -91 | white | -1000000 | 140 | turn 29 / current player / HP player/cpu 0/1 / stones player/cpu 34/37 / deck player/cpu 0/0 / hand player/cpu 5/5 |

### 994303 challenger-as-cpu

- plannerSide: cpu
- scannedSteps: 220
- capturedCases: 1

#### step 113 / turn 9

- state: turn 9 / current cpu / HP cpu/player 8/8 / stones cpu/player 6/4 / deck cpu/player 16/17 / hand cpu/player 5/4
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ドノマンティス Lv1 HP5 act1/1 focus | player_back_right:PB:ボムゾウ Lv2 HP5 act1/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- selected: summon:真勇者ダイン->cpu_front_left
- best: summon:真勇者ダイン->cpu_front_left
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:真勇者ダイン->cpu_front_left | 216.8 | white_planner | 1000000 | 109 | turn 19 / current cpu / HP cpu/player 6/0 / stones cpu/player 10/13 / deck cpu/player 6/7 / hand cpu/player 6/5 |
| 2 |  | summon:真勇者ダイン->cpu_back_left | 197.5 | - | 351.8 | 150 | turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 9/4 / deck cpu/player 2/3 / hand cpu/player 6/4 |

### 994303 challenger-as-player

- plannerSide: player
- scannedSteps: 220
- capturedCases: 1

#### step 88 / turn 8

- state: turn 8 / current player / HP player/cpu 10/8 / stones player/cpu 6/4 / deck player/cpu 18/18 / hand player/cpu 6/4
- board: player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ボムゾウ Lv1 HP4 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
- selected: summon:真勇者ダイン->player_front_left
- best: summon:真勇者ダイン->player_front_left
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:真勇者ダイン->player_front_left | 198.7 | - | 901 | 150 | turn 22 / current cpu / HP player/cpu 8/1 / stones player/cpu 9/14 / deck player/cpu 4/3 / hand player/cpu 5/6 |
| 2 |  | summon:真勇者ダイン->player_back_left | 179.4 | white | -1000000 | 142 | turn 20 / current cpu / HP player/cpu 0/5 / stones player/cpu 6/13 / deck player/cpu 6/5 / hand player/cpu 5/6 |
