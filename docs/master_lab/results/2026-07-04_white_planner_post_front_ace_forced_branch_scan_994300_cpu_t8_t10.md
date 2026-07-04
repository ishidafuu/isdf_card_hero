# White Planner Forced Branch Scan

生成: 2026-07-04T13:03:58.059Z
deck: `master-lab-white-1377-death-sheep3`
turnRange: 8-10
branchTop: 4
maxReplaySteps: 150
improvementThreshold: 180

## Conclusion

- 3 states scanned. promising 1件、winner flip 1件。
- winner flip または大きい score delta の局面だけを、評価概念へ還元して小規模実装候補にする。

## Promising

| seed | direction | step | turn | selected | best | delta | selected winner | best winner |
| ---: | --- | ---: | ---: | --- | --- | ---: | --- | --- |
| 994300 | challenger-as-cpu | 89 | 8 | summon:ヤンバル->cpu_back_right | move:cpu_back_left->cpu_front_right | 2000000 | white | white_planner |

## Samples

### 994300 challenger-as-cpu

- plannerSide: cpu
- capturedStates: 3

#### step 89 / turn 8

- state: turn 8 / current cpu / HP cpu/player 10/10 / stones cpu/player 5/2 / deck cpu/player 17/18 / hand cpu/player 5/4
- board: player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus
- selected: summon:ヤンバル->cpu_back_right
- best: move:cpu_back_left->cpu_front_right
- scoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ヤンバル->cpu_back_right | 193 | white | -1000000 | 93 | turn 18 / current player / HP cpu/player 0/2 / stones cpu/player 2/16 / deck cpu/player 8/8 / hand cpu/player 5/6 |
| 2 |  | move:cpu_back_left->cpu_front_right | 112.3 | white_planner | 1000000 | 130 | turn 20 / current cpu / HP cpu/player 6/0 / stones cpu/player 7/10 / deck cpu/player 5/6 / hand cpu/player 6/5 |
| 3 |  | master:master_attack->monster:player_front_right | 78.4 | white | -1000000 | 104 | turn 18 / current player / HP cpu/player 0/3 / stones cpu/player 8/11 / deck cpu/player 8/8 / hand cpu/player 5/6 |
| 4 |  | summon:ヤンバル->cpu_front_right | 58 | - | 29 | 150 | turn 21 / current cpu / HP cpu/player 7/9 / stones cpu/player 0/1 / deck cpu/player 4/5 / hand cpu/player 4/5 |

#### step 91 / turn 8

- state: turn 8 / current cpu / HP cpu/player 10/10 / stones cpu/player 4/2 / deck cpu/player 17/18 / hand cpu/player 4/4
- board: player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep
- selected: focus:ポリスピナー
- best: focus:ポリスピナー
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | focus:ポリスピナー | 378.7 | white | -1000000 | 91 | turn 18 / current player / HP cpu/player 0/2 / stones cpu/player 2/16 / deck cpu/player 8/8 / hand cpu/player 5/6 |
| 2 |  | attack:ポリスピナー:attack->真勇者ダイン | -116.4 | white | -1000000 | 104 | turn 18 / current player / HP cpu/player 0/3 / stones cpu/player 8/7 / deck cpu/player 8/8 / hand cpu/player 5/6 |
| 3 |  | master:master_attack->monster:player_front_right | -254.9 | white | -1000000 | 102 | turn 18 / current player / HP cpu/player 0/3 / stones cpu/player 8/11 / deck cpu/player 8/8 / hand cpu/player 5/6 |

#### step 99 / turn 9

- state: turn 9 / current cpu / HP cpu/player 10/10 / stones cpu/player 5/2 / deck cpu/player 16/17 / hand cpu/player 5/4
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 shield | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act0/1 | cpu_front_right:CF:ポリスピナー Lv1 HP2 act0/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
- selected: attack:ヤンバル:wild_claw->真勇者ダイン
- best: attack:ヤンバル:wild_claw->真勇者ダイン
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ヤンバル:wild_claw->真勇者ダイン | 385.2 | white | -1000000 | 83 | turn 18 / current player / HP cpu/player 0/2 / stones cpu/player 2/16 / deck cpu/player 8/8 / hand cpu/player 5/6 |
| 2 |  | attack:真勇者ダイン:ダイン斬り->真勇者ダイン | 323.5 | white | -1000000 | 65 | turn 17 / current player / HP cpu/player 0/6 / stones cpu/player 20/9 / deck cpu/player 9/9 / hand cpu/player 5/6 |
| 3 |  | focus:真勇者ダイン | 45.3 | white | -1000000 | 99 | turn 18 / current player / HP cpu/player 0/2 / stones cpu/player 7/8 / deck cpu/player 8/8 / hand cpu/player 5/6 |
| 4 |  | focus:ヤンバル | -65 | white | -1000000 | 69 | turn 17 / current player / HP cpu/player 0/9 / stones cpu/player 14/9 / deck cpu/player 9/9 / hand cpu/player 5/6 |
