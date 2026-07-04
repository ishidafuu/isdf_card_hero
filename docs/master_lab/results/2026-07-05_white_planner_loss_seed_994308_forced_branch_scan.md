# White Planner Forced Branch Scan

生成: 2026-07-04T21:54:36.709Z
deck: `master-lab-white-1377-death-sheep3`
turnRange: 6-10
branchTop: 3
maxReplaySteps: 120
improvementThreshold: 120

## Conclusion

- 2 states scanned. 勝敗反転または閾値以上の改善候補は見つからない。
- 次は turn 範囲か seed を広げる、または相手手番込みの二手番プラン探索へ移る。

## Promising

- なし

## Samples

### 994308 challenger-as-player

- plannerSide: player
- capturedStates: 2

#### step 61 / turn 6

- state: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 4/0 / deck player/cpu 20/20 / hand player/cpu 5/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
- selected: attack:ピグミィ:スパイクボール->真勇者ダイン
- best: attack:ピグミィ:スパイクボール->真勇者ダイン
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ピグミィ:スパイクボール->真勇者ダイン | 243.6 | - | 229 | 120 | turn 15 / current cpu / HP player/cpu 8/6 / stones player/cpu 3/0 / deck player/cpu 11/10 / hand player/cpu 5/4 |
| 2 |  | move:player_front_right->player_back_left | 237.9 | - | -85.2 | 120 | turn 15 / current cpu / HP player/cpu 5/7 / stones player/cpu 3/2 / deck player/cpu 11/10 / hand player/cpu 5/3 |
| 3 |  | move:player_back_left->player_front_right | 219.9 | - | -85.2 | 120 | turn 15 / current cpu / HP player/cpu 5/7 / stones player/cpu 3/2 / deck player/cpu 11/10 / hand player/cpu 5/3 |

#### step 63 / turn 6

- state: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 1/0 / deck player/cpu 20/20 / hand player/cpu 4/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 | cpu_front_left:CF:ヤンバル Lv1 HP3 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- selected: attack:ピグミィ:スパイクボール->ヤンバル
- best: attack:ピグミィ:スパイクボール->ヤンバル
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ピグミィ:スパイクボール->ヤンバル | 515.4 | - | 80 | 120 | turn 16 / current player / HP player/cpu 6/6 / stones player/cpu 8/0 / deck player/cpu 10/10 / hand player/cpu 6/4 |
| 2 |  | attack:デスシープ:attack->ヤンバル | 440 | - | -427.4 | 120 | turn 15 / current cpu / HP player/cpu 8/9 / stones player/cpu 3/4 / deck player/cpu 11/10 / hand player/cpu 5/5 |
| 3 |  | summon:真勇者ダイン->player_back_left | 297.1 | - | -427.4 | 120 | turn 15 / current cpu / HP player/cpu 8/9 / stones player/cpu 3/4 / deck player/cpu 11/10 / hand player/cpu 5/5 |
