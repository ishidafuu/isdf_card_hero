# White Planner Forced Branch Scan

生成: 2026-07-04T13:22:09.477Z
deck: `master-lab-white-1377-death-sheep3`
turnRange: 8-10
branchTop: 4
maxReplaySteps: 150
improvementThreshold: 180

## Conclusion

- 3 states scanned. 勝敗反転または閾値以上の改善候補は見つからない。
- 次は turn 範囲か seed を広げる、または相手手番込みの二手番プラン探索へ移る。

## Promising

- なし

## Samples

### 994300 challenger-as-cpu

- plannerSide: cpu
- capturedStates: 3

#### step 89 / turn 8

- state: turn 8 / current cpu / HP cpu/player 10/10 / stones cpu/player 5/2 / deck cpu/player 17/18 / hand cpu/player 5/4
- board: player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus
- selected: move:cpu_back_left->cpu_front_right
- best: move:cpu_back_left->cpu_front_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | move:cpu_back_left->cpu_front_right | 112.3 | - | 106.8 | 150 | turn 21 / current cpu / HP cpu/player 6/5 / stones cpu/player 8/7 / deck cpu/player 4/5 / hand cpu/player 5/4 |
| 2 |  | master:master_attack->monster:player_front_right | 78.4 | white | -1000000 | 130 | turn 20 / current player / HP cpu/player 0/4 / stones cpu/player 7/5 / deck cpu/player 6/6 / hand cpu/player 5/6 |
| 3 |  | summon:ヤンバル->cpu_front_right | 58 | - | 29 | 150 | turn 21 / current cpu / HP cpu/player 7/9 / stones cpu/player 0/1 / deck cpu/player 4/5 / hand cpu/player 4/5 |
| 4 |  | summon:ヤンバル->cpu_back_right | 13.6 | white | -1000000 | 93 | turn 18 / current player / HP cpu/player 0/2 / stones cpu/player 2/16 / deck cpu/player 8/8 / hand cpu/player 5/6 |

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
| 3 |  | master:master_attack->monster:player_front_right | -124.8 | white | -1000000 | 128 | turn 20 / current player / HP cpu/player 0/4 / stones cpu/player 7/5 / deck cpu/player 6/6 / hand cpu/player 5/6 |

#### step 99 / turn 9

- state: turn 9 / current cpu / HP cpu/player 10/10 / stones cpu/player 5/2 / deck cpu/player 16/17 / hand cpu/player 5/4
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 shield | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act0/1 | cpu_front_right:CF:ポリスピナー Lv1 HP2 act0/2 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1
- selected: attack:ヤンバル:wild_claw->真勇者ダイン
- best: attack:ヤンバル:wild_claw->真勇者ダイン
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ヤンバル:wild_claw->真勇者ダイン | 385.2 | - | -57.6 | 150 | turn 22 / current player / HP cpu/player 6/5 / stones cpu/player 3/9 / deck cpu/player 4/4 / hand cpu/player 5/4 |
| 2 |  | attack:真勇者ダイン:ダイン斬り->真勇者ダイン | 323.5 | - | -57.6 | 150 | turn 22 / current player / HP cpu/player 6/5 / stones cpu/player 3/9 / deck cpu/player 4/4 / hand cpu/player 5/4 |
| 3 |  | focus:真勇者ダイン | 45.3 | - | -109 | 150 | turn 21 / current cpu / HP cpu/player 8/7 / stones cpu/player 8/0 / deck cpu/player 4/5 / hand cpu/player 6/5 |
| 4 |  | focus:ヤンバル | -65 | white | -1000000 | 77 | turn 17 / current player / HP cpu/player 0/10 / stones cpu/player 10/9 / deck cpu/player 9/9 / hand cpu/player 5/6 |
