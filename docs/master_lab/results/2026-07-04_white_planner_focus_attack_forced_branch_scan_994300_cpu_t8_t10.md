# White Planner Forced Branch Scan

生成: 2026-07-04T12:25:02.763Z
deck: `master-lab-white-1377-death-sheep3`
turnRange: 8-10
branchTop: 3
maxReplaySteps: 160
improvementThreshold: 200

## Conclusion

- 2 states scanned. promising 2件、winner flip 1件。
- winner flip または大きい score delta の局面だけを、評価概念へ還元して小規模実装候補にする。

## Promising

| seed | direction | step | turn | selected | best | delta | selected winner | best winner |
| ---: | --- | ---: | ---: | --- | --- | ---: | --- | --- |
| 994300 | challenger-as-cpu | 90 | 8 | master:shield->monster:cpu_front_right | master:shield->monster:cpu_front_left | 1000336 | - | white_planner |
| 994300 | challenger-as-cpu | 88 | 8 | attack:ヤンバル:wild_claw->デスシープ | summon:ヤンバル->cpu_back_right | 673.4 | - | - |

## Samples

### 994300 challenger-as-cpu

- plannerSide: cpu
- capturedStates: 2

#### step 88 / turn 8

- state: turn 8 / current cpu / HP cpu/player 10/10 / stones cpu/player 4/5 / deck cpu/player 17/18 / hand cpu/player 5/4
- board: player_front_left:PF:デスシープ Lv2 HP2 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:ポリスピナー Lv1 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus
- selected: attack:ヤンバル:wild_claw->デスシープ
- best: summon:ヤンバル->cpu_back_right
- scoreDelta: 673.4

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ヤンバル:wild_claw->デスシープ | 739.5 | - | -334 | 160 | turn 22 / current player / HP cpu/player 1/6 / stones cpu/player 10/9 / deck cpu/player 4/4 / hand cpu/player 5/6 |
| 2 |  | master:master_attack->monster:player_front_left | 554.3 | white | -1000000 | 127 | turn 21 / current player / HP cpu/player 0/8 / stones cpu/player 16/7 / deck cpu/player 5/5 / hand cpu/player 5/6 |
| 3 |  | summon:ヤンバル->cpu_back_right | 552.2 | - | 339.4 | 160 | turn 22 / current player / HP cpu/player 9/5 / stones cpu/player 2/6 / deck cpu/player 4/4 / hand cpu/player 5/6 |

#### step 90 / turn 8

- state: turn 8 / current cpu / HP cpu/player 10/10 / stones cpu/player 2/7 / deck cpu/player 17/18 / hand cpu/player 4/4
- board: player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:ポリスピナー Lv1 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 prep
- selected: master:shield->monster:cpu_front_right
- best: master:shield->monster:cpu_front_left
- scoreDelta: 1000336

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_front_right | 158.4 | - | -336 | 160 | turn 22 / current player / HP cpu/player 1/6 / stones cpu/player 10/7 / deck cpu/player 4/4 / hand cpu/player 5/6 |
| 2 |  | master:shield->monster:cpu_front_left | 78.7 | white_planner | 1000000 | 126 | turn 28 / current player / HP cpu/player 2/0 / stones cpu/player 45/40 / deck cpu/player 0/0 / hand cpu/player 5/5 |


