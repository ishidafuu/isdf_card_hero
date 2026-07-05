# White Planner Forced Branch Scan

生成: 2026-07-05T22:42:37.633Z
deck: `master-lab-white-1377-death-sheep3`
turnRange: 9-14
branchTop: 4
maxReplaySteps: 220
improvementThreshold: 120

## Conclusion

- 12 states scanned. promising 1件、winner flip 1件。
- winner flip または大きい score delta の局面だけを、評価概念へ還元して小規模実装候補にする。

## Promising

| seed | direction | step | turn | selected | best | delta | selected winner | best winner |
| ---: | --- | ---: | ---: | --- | --- | ---: | --- | --- |
| 994314 | challenger-as-cpu | 113 | 10 | attack:ポリスピナー:attack->player master | attack:ポリスピナー:attack->真勇者ダイン | 2000000 | white | white_planner |

## Samples

### 994314 challenger-as-cpu

- plannerSide: cpu
- capturedStates: 12

#### step 106 / turn 9

- state: turn 9 / current cpu / HP cpu/player 7/8 / stones cpu/player 7/0 / deck cpu/player 16/17 / hand cpu/player 5/4
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 shield | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ドノマンティス Lv2 HP3 act0/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- selected: attack:ドノマンティス:呪いの刃->player master
- best: attack:ドノマンティス:呪いの刃->player master
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ドノマンティス:呪いの刃->player master | 357.3 | white | -1000000 | 32 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 19/20 / deck cpu/player 11/11 / hand cpu/player 5/6 |
| 2 |  | focus:ポリスピナー | -16 | white | -1000000 | 33 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 19/20 / deck cpu/player 11/11 / hand cpu/player 5/6 |
| 3 |  | move:cpu_back_left->cpu_front_left | -64.6 | white | -1000000 | 34 | turn 14 / current player / HP cpu/player 0/1 / stones cpu/player 7/19 / deck cpu/player 12/12 / hand cpu/player 5/6 |
| 4 |  | focus:ドノマンティス | -84.5 | white | -1000000 | 120 | turn 27 / current cpu / HP cpu/player 0/1 / stones cpu/player 34/35 / deck cpu/player 0/0 / hand cpu/player 5/5 |

#### step 112 / turn 10

- state: turn 10 / current cpu / HP cpu/player 7/6 / stones cpu/player 10/1 / deck cpu/player 15/16 / hand cpu/player 6/4
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 prep | cpu_front_left:CF:ポリスピナー Lv1 HP3 act0/2 focus | cpu_front_right:CF:ドノマンティス Lv2 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- selected: attack:ドノマンティス:呪いの刃->player master
- best: attack:ドノマンティス:呪いの刃->player master
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ドノマンティス:呪いの刃->player master | 1147.1 | white | -1000000 | 26 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 19/20 / deck cpu/player 11/11 / hand cpu/player 5/6 |
| 2 |  | summon:ボムゾウ->cpu_back_left | 143.9 | white | -1000000 | 31 | turn 16 / current player / HP cpu/player 0/1 / stones cpu/player 26/21 / deck cpu/player 10/10 / hand cpu/player 5/6 |
| 3 |  | summon:ポリスピナー->cpu_back_left | 136.1 | white | -1000000 | 29 | turn 16 / current player / HP cpu/player 0/3 / stones cpu/player 26/19 / deck cpu/player 10/10 / hand cpu/player 5/6 |
| 4 |  | move:cpu_back_right->cpu_back_left | 62.6 | white | -1000000 | 27 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 21/20 / deck cpu/player 11/11 / hand cpu/player 5/6 |

#### step 113 / turn 10

- state: turn 10 / current cpu / HP cpu/player 7/4 / stones cpu/player 9/3 / deck cpu/player 15/16 / hand cpu/player 6/4
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 prep | cpu_front_left:CF:ポリスピナー Lv1 HP3 act0/2 focus | cpu_front_right:CF:ドノマンティス Lv2 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- selected: attack:ポリスピナー:attack->player master
- best: attack:ポリスピナー:attack->真勇者ダイン
- scoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ポリスピナー:attack->player master | -562.2 | white | -1000000 | 25 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 19/20 / deck cpu/player 11/11 / hand cpu/player 5/6 |
| 2 |  | attack:ポリスピナー:attack->真勇者ダイン | -1088 | white_planner | 1000000 | 56 | turn 27 / current player / HP cpu/player 6/0 / stones cpu/player 60/55 / deck cpu/player 0/0 / hand cpu/player 5/5 |

#### step 114 / turn 10

- state: turn 10 / current cpu / HP cpu/player 7/3 / stones cpu/player 9/4 / deck cpu/player 15/16 / hand cpu/player 6/4
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 prep | cpu_front_left:CF:ポリスピナー Lv1 HP3 act1/2 | cpu_front_right:CF:ドノマンティス Lv2 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- selected: master:shield->monster:cpu_front_right
- best: master:shield->monster:cpu_front_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_front_right | 160.6 | white | -1000000 | 24 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 19/20 / deck cpu/player 11/11 / hand cpu/player 5/6 |
| 2 |  | master:shield->monster:cpu_front_left | 133 | white | -1000000 | 26 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 17/17 / deck cpu/player 11/11 / hand cpu/player 5/6 |

#### step 118 / turn 11

- state: turn 11 / current cpu / HP cpu/player 7/3 / stones cpu/player 11/7 / deck cpu/player 14/15 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ドノマンティス Lv2 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- selected: attack:ピグミィ:スパイクボール->デスシープ
- best: attack:ピグミィ:スパイクボール->デスシープ
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ピグミィ:スパイクボール->デスシープ | 409.6 | white | -1000000 | 20 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 19/20 / deck cpu/player 11/11 / hand cpu/player 5/6 |

#### step 119 / turn 11

- state: turn 11 / current cpu / HP cpu/player 7/3 / stones cpu/player 11/7 / deck cpu/player 14/15 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ドノマンティス Lv2 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2
- selected: master:shield->monster:cpu_front_right
- best: master:shield->monster:cpu_front_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_front_right | 165 | white | -1000000 | 19 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 19/20 / deck cpu/player 11/11 / hand cpu/player 5/6 |

#### step 124 / turn 12

- state: turn 12 / current cpu / HP cpu/player 5/3 / stones cpu/player 14/10 / deck cpu/player 13/14 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ドノマンティス Lv2 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- selected: master:shield->monster:cpu_front_right
- best: master:shield->monster:cpu_front_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_front_right | 165 | white | -1000000 | 14 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 19/20 / deck cpu/player 11/11 / hand cpu/player 5/6 |

#### step 128 / turn 13

- state: turn 13 / current cpu / HP cpu/player 3/3 / stones cpu/player 17/13 / deck cpu/player 12/13 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ドノマンティス Lv2 HP3 act0/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- selected: attack:ピグミィ:スパイクボール->デスシープ
- best: attack:ピグミィ:スパイクボール->デスシープ
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ピグミィ:スパイクボール->デスシープ | 1569.8 | white | -1000000 | 10 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 19/20 / deck cpu/player 11/11 / hand cpu/player 5/6 |
| 2 |  | attack:ドノマンティス:attack->player master | 500.6 | white | -1000000 | 10 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 19/20 / deck cpu/player 11/11 / hand cpu/player 5/6 |

#### step 129 / turn 13

- state: turn 13 / current cpu / HP cpu/player 3/3 / stones cpu/player 17/13 / deck cpu/player 12/13 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ドノマンティス Lv2 HP3 act0/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2
- selected: attack:ドノマンティス:attack->player master
- best: attack:ドノマンティス:attack->player master
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ドノマンティス:attack->player master | 145.4 | white | -1000000 | 9 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 19/20 / deck cpu/player 11/11 / hand cpu/player 5/6 |
| 2 |  | attack:ドノマンティス:attack->デスシープ | -232.2 | white | -1000000 | 10 | turn 15 / current player / HP cpu/player 0/3 / stones cpu/player 19/17 / deck cpu/player 11/11 / hand cpu/player 5/6 |

#### step 130 / turn 13

- state: turn 13 / current cpu / HP cpu/player 3/2 / stones cpu/player 17/14 / deck cpu/player 12/13 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ドノマンティス Lv2 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2
- selected: master:shield->monster:cpu_front_right
- best: master:shield->monster:cpu_front_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_front_right | 160.6 | white | -1000000 | 8 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 19/20 / deck cpu/player 11/11 / hand cpu/player 5/6 |

#### step 134 / turn 14

- state: turn 14 / current cpu / HP cpu/player 1/2 / stones cpu/player 20/17 / deck cpu/player 11/12 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ドノマンティス Lv2 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- selected: attack:ピグミィ:スパイクボール->デスシープ
- best: attack:ピグミィ:スパイクボール->デスシープ
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ピグミィ:スパイクボール->デスシープ | 191.5 | white | -1000000 | 4 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 19/20 / deck cpu/player 11/11 / hand cpu/player 5/6 |

#### step 135 / turn 14

- state: turn 14 / current cpu / HP cpu/player 1/2 / stones cpu/player 20/17 / deck cpu/player 11/12 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ドノマンティス Lv2 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2
- selected: master:shield->monster:cpu_front_right
- best: master:shield->monster:cpu_front_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_front_right | 165 | white | -1000000 | 3 | turn 15 / current player / HP cpu/player 0/2 / stones cpu/player 19/20 / deck cpu/player 11/11 / hand cpu/player 5/6 |


