# White Planner Forced Branch Scan

生成: 2026-07-04T00:04:30.627Z
deck: `master-lab-white-1377-death-sheep3`
turnRange: 6-8
branchTop: 2
maxReplaySteps: 80
improvementThreshold: 220

## Conclusion

- 2 states scanned. 勝敗反転または閾値以上の改善候補は見つからない。
- 次は turn 範囲か seed を広げる、または相手手番込みの二手番プラン探索へ移る。

## Promising

- なし

## Samples

### 994306 challenger-as-player

- plannerSide: player
- capturedStates: 2

#### step 58 / turn 6

- state: turn 6 / current player / HP player/cpu 9/10 / stones player/cpu 6/3 / deck player/cpu 20/20 / hand player/cpu 4/5
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP3 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 shield | cpu_back_left:CB:デスシープ Lv1 HP6 act1/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- selected: focus:真勇者ダイン
- best: focus:真勇者ダイン
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | focus:真勇者ダイン | 585.1 | - | -378 | 80 | turn 13 / current player / HP player/cpu 3/8 / stones player/cpu 4/8 / deck player/cpu 13/13 / hand player/cpu 6/5 |
| 2 |  | attack:ヤンバル:wild_claw->デスシープ | 578.9 | - | -378 | 80 | turn 13 / current player / HP player/cpu 3/8 / stones player/cpu 4/8 / deck player/cpu 13/13 / hand player/cpu 6/5 |

#### step 60 / turn 6

- state: turn 6 / current player / HP player/cpu 9/10 / stones player/cpu 6/3 / deck player/cpu 20/20 / hand player/cpu 4/5
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP1 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 shield | cpu_back_left:CB:デスシープ Lv1 HP6 act1/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- selected: attack:ボムゾウ:self_bomb->デスシープ
- best: attack:ボムゾウ:self_bomb->デスシープ
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ボムゾウ:self_bomb->デスシープ | 627.9 | - | -410 | 80 | turn 14 / current player / HP player/cpu 3/8 / stones player/cpu 7/11 / deck player/cpu 12/12 / hand player/cpu 6/5 |
| 2 |  | master:master_attack->monster:cpu_front_left | 352.5 | - | -477.4 | 80 | turn 12 / current cpu / HP player/cpu 8/10 / stones player/cpu 2/14 / deck player/cpu 14/13 / hand player/cpu 3/6 |


