# White Planner Forced Branch Scan

生成: 2026-07-04T21:58:41.650Z
deck: `master-lab-white-1377-death-sheep3`
turnRange: 6-10
branchTop: 3
maxReplaySteps: 80
improvementThreshold: 120

## Conclusion

- 2 states scanned. promising 1件、winner flip 0件。
- winner flip または大きい score delta の局面だけを、評価概念へ還元して小規模実装候補にする。

## Promising

| seed | direction | step | turn | selected | best | delta | selected winner | best winner |
| ---: | --- | ---: | ---: | --- | --- | ---: | --- | --- |
| 994311 | challenger-as-player | 67 | 7 | focus:デスシープ | attack:デスシープ:attack->デスシープ | 474.8 | - | - |

## Samples

### 994311 challenger-as-player

- plannerSide: player
- capturedStates: 2

#### step 59 / turn 6

- state: turn 6 / current player / HP player/cpu 9/10 / stones player/cpu 10/1 / deck player/cpu 20/20 / hand player/cpu 4/3
- board: player_front_right:PF:デスシープ Lv1 HP6 act1/1 | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 shield | cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2
- selected: summon:デスシープ->player_front_left
- best: summon:デスシープ->player_back_left
- scoreDelta: 45.6

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:デスシープ->player_front_left | 134.9 | - | -527.8 | 80 | turn 12 / current cpu / HP player/cpu 7/10 / stones player/cpu 1/2 / deck player/cpu 14/13 / hand player/cpu 4/5 |
| 2 |  | summon:デスシープ->player_back_left | 84.8 | - | -482.2 | 80 | turn 12 / current player / HP player/cpu 6/9 / stones player/cpu 7/0 / deck player/cpu 14/14 / hand player/cpu 3/3 |
| 3 |  | summon:デスシープ->player_back_right | 84.8 | - | -551.8 | 80 | turn 12 / current cpu / HP player/cpu 8/10 / stones player/cpu 2/11 / deck player/cpu 14/13 / hand player/cpu 3/6 |

#### step 67 / turn 7

- state: turn 7 / current player / HP player/cpu 8/10 / stones player/cpu 13/4 / deck player/cpu 19/19 / hand player/cpu 4/4
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv2 HP4 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus
- selected: focus:デスシープ
- best: attack:デスシープ:attack->デスシープ
- scoreDelta: 474.8

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | focus:デスシープ | 391.3 | - | -481 | 80 | turn 13 / current cpu / HP player/cpu 7/10 / stones player/cpu 1/6 / deck player/cpu 13/12 / hand player/cpu 3/6 |
| 2 |  | master:master_attack->monster:cpu_front_left | 346.8 | - | -481 | 80 | turn 13 / current cpu / HP player/cpu 7/10 / stones player/cpu 1/6 / deck player/cpu 13/12 / hand player/cpu 3/6 |
| 3 |  | attack:デスシープ:attack->デスシープ | 144.4 | - | -6.2 | 80 | turn 13 / current player / HP player/cpu 8/9 / stones player/cpu 5/7 / deck player/cpu 13/13 / hand player/cpu 4/4 |
