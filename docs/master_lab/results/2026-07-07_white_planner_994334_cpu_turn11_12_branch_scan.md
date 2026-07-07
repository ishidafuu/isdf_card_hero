# White Planner Forced Branch Scan

生成: 2026-07-07T00:40:21.429Z
deck: `master-lab-white-1377-death-sheep3`
turnRange: 11-12
branchTop: 2
maxReplaySteps: 120
improvementThreshold: 300

## Conclusion

- 6 states scanned. promising 5件、winner flip 4件。
- winner flip または大きい score delta の局面だけを、評価概念へ還元して小規模実装候補にする。

## Promising

| seed | direction | step | turn | selected | best | delta | selected winner | best winner |
| ---: | --- | ---: | ---: | --- | --- | ---: | --- | --- |
| 994334 | challenger-as-cpu | 136 | 11 | attack:ピグミィ:スパイクボール->デスシープ | summon:ドノマンティス->cpu_front_right | 2000000 | white | white_planner |
| 994334 | challenger-as-cpu | 138 | 11 | summon:ドノマンティス->cpu_back_right | focus:ポリスピナー | 2000000 | white | white_planner |
| 994334 | challenger-as-cpu | 139 | 11 | attack:ポリスピナー:attack->ヤンバル | focus:ポリスピナー | 2000000 | white | white_planner |
| 994334 | challenger-as-cpu | 140 | 11 | master:master_attack->monster:player_front_left | attack:ポリスピナー:attack->ヤンバル | 2000000 | white | white_planner |
| 994334 | challenger-as-cpu | 135 | 11 | move:cpu_front_right->cpu_back_left | summon:ドノマンティス->cpu_back_left | 999721 | white | - |

## Samples

### 994334 challenger-as-cpu

- plannerSide: cpu
- capturedStates: 6

#### step 135 / turn 11

- state: turn 11 / current cpu / HP cpu/player 8/6 / stones cpu/player 6/0 / deck cpu/player 14/15 / hand cpu/player 5/5
- board: player_front_left:PF:ヤンバル Lv2 HP3 act1/1 shield | player_front_right:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ポリスピナー Lv2 HP3 act0/2 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2
- selected: move:cpu_front_right->cpu_back_left
- best: summon:ドノマンティス->cpu_back_left
- scoreDelta: 999721

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | move:cpu_front_right->cpu_back_left | 190.9 | white | -1000000 | 62 | turn 16 / current player / HP cpu/player 0/5 / stones cpu/player 14/4 / deck cpu/player 10/10 / hand cpu/player 5/6 |
| 2 |  | summon:ドノマンティス->cpu_back_left | 149.6 | - | -279 | 120 | turn 20 / current cpu / HP cpu/player 1/3 / stones cpu/player 9/7 / deck cpu/player 5/6 / hand cpu/player 6/5 |

#### step 136 / turn 11

- state: turn 11 / current cpu / HP cpu/player 8/6 / stones cpu/player 6/0 / deck cpu/player 14/15 / hand cpu/player 5/5
- board: player_front_left:PF:ヤンバル Lv2 HP3 act1/1 shield | player_front_right:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ポリスピナー Lv2 HP3 act0/2 | cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2
- selected: attack:ピグミィ:スパイクボール->デスシープ
- best: summon:ドノマンティス->cpu_front_right
- scoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ピグミィ:スパイクボール->デスシープ | 318.3 | white | -1000000 | 61 | turn 16 / current player / HP cpu/player 0/5 / stones cpu/player 14/4 / deck cpu/player 10/10 / hand cpu/player 5/6 |
| 2 |  | summon:ドノマンティス->cpu_front_right | 194.8 | white_planner | 1000000 | 67 | turn 21 / current cpu / HP cpu/player 4/0 / stones cpu/player 27/29 / deck cpu/player 4/5 / hand cpu/player 6/5 |

#### step 137 / turn 11

- state: turn 11 / current cpu / HP cpu/player 8/6 / stones cpu/player 6/0 / deck cpu/player 14/15 / hand cpu/player 5/5
- board: player_front_left:PF:ヤンバル Lv2 HP3 act1/1 shield | player_front_right:PF:デスシープ Lv2 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ポリスピナー Lv2 HP3 act0/2 | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2
- selected: summon:ドノマンティス->cpu_front_right
- best: summon:ドノマンティス->cpu_front_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ドノマンティス->cpu_front_right | 194.6 | white | -1000000 | 60 | turn 16 / current player / HP cpu/player 0/5 / stones cpu/player 14/4 / deck cpu/player 10/10 / hand cpu/player 5/6 |
| 2 |  | summon:ドノマンティス->cpu_front_right | 194.6 | white | -1000000 | 60 | turn 16 / current player / HP cpu/player 0/5 / stones cpu/player 14/4 / deck cpu/player 10/10 / hand cpu/player 5/6 |

#### step 138 / turn 11

- state: turn 11 / current cpu / HP cpu/player 8/6 / stones cpu/player 5/0 / deck cpu/player 14/15 / hand cpu/player 4/5
- board: player_front_left:PF:ヤンバル Lv2 HP3 act1/1 shield | player_front_right:PF:デスシープ Lv2 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ポリスピナー Lv2 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 prep | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2
- selected: summon:ドノマンティス->cpu_back_right
- best: focus:ポリスピナー
- scoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | focus:ポリスピナー | 197 | white_planner | 1000000 | 65 | turn 21 / current cpu / HP cpu/player 4/0 / stones cpu/player 27/29 / deck cpu/player 4/5 / hand cpu/player 6/5 |
| 2 | Y | summon:ドノマンティス->cpu_back_right | 144.6 | white | -1000000 | 59 | turn 16 / current player / HP cpu/player 0/5 / stones cpu/player 14/4 / deck cpu/player 10/10 / hand cpu/player 5/6 |

#### step 139 / turn 11

- state: turn 11 / current cpu / HP cpu/player 8/6 / stones cpu/player 4/0 / deck cpu/player 14/15 / hand cpu/player 3/5
- board: player_front_left:PF:ヤンバル Lv2 HP3 act1/1 shield | player_front_right:PF:デスシープ Lv2 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ポリスピナー Lv2 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 prep | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep
- selected: attack:ポリスピナー:attack->ヤンバル
- best: focus:ポリスピナー
- scoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | focus:ポリスピナー | 195.4 | white_planner | 1000000 | 64 | turn 21 / current cpu / HP cpu/player 4/0 / stones cpu/player 27/29 / deck cpu/player 4/5 / hand cpu/player 6/5 |
| 2 | Y | attack:ポリスピナー:attack->ヤンバル | 121.6 | white | -1000000 | 58 | turn 16 / current player / HP cpu/player 0/5 / stones cpu/player 14/4 / deck cpu/player 10/10 / hand cpu/player 5/6 |

#### step 140 / turn 11

- state: turn 11 / current cpu / HP cpu/player 8/6 / stones cpu/player 4/0 / deck cpu/player 14/15 / hand cpu/player 3/5
- board: player_front_left:PF:ヤンバル Lv2 HP1 act1/1 shield | player_front_right:PF:デスシープ Lv2 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ポリスピナー Lv2 HP3 act1/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 prep | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep
- selected: master:master_attack->monster:player_front_left
- best: attack:ポリスピナー:attack->ヤンバル
- scoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | attack:ポリスピナー:attack->ヤンバル | 667.9 | white_planner | 1000000 | 63 | turn 21 / current cpu / HP cpu/player 4/0 / stones cpu/player 27/29 / deck cpu/player 4/5 / hand cpu/player 6/5 |
| 2 | Y | master:master_attack->monster:player_front_left | 557.8 | white | -1000000 | 57 | turn 16 / current player / HP cpu/player 0/5 / stones cpu/player 14/4 / deck cpu/player 10/10 / hand cpu/player 5/6 |


