# White Planner Forced Branch Probe

生成: 2026-07-06T17:16:08.446Z
seed: 994331
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 5
maxReplaySteps: 180

## Conclusion

- 1/2 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 123

- turn: 11
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 11 / current cpu / HP cpu/player 8/7 / stones cpu/player 7/2 / deck cpu/player 14/15 / hand cpu/player 5/2
- board: player_front_left:PF:ボムゾウ Lv1 HP6 prep | player_front_right:PF:真勇者ダイン Lv3 HP5 act1/1 shield | player_back_left:PB:ピグミィ Lv2 HP1 act2/2 | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP5 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 prep
- selected: master:shield->monster:cpu_front_left
- best: end_turn
- selectedRank: 2
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_front_left | 240.2 | white | -1000000 | 76 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 19/12 / deck cpu/player 6/6 / hand cpu/player 5/6 |
| 2 |  | master:shield->monster:cpu_front_right | 120.2 | white | -1000000 | 76 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 19/12 / deck cpu/player 6/6 / hand cpu/player 5/6 |
| 3 |  | end_turn | -51.9 | white_planner | 1000000 | 101 | turn 30 / current player / HP cpu/player 1/0 / stones cpu/player 44/46 / deck cpu/player 0/0 / hand cpu/player 5/5 |

### step 124

- turn: 11
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 11 / current cpu / HP cpu/player 8/7 / stones cpu/player 5/2 / deck cpu/player 14/15 / hand cpu/player 5/2
- board: player_front_left:PF:ボムゾウ Lv1 HP6 prep | player_front_right:PF:真勇者ダイン Lv3 HP5 act1/1 shield | player_back_left:PB:ピグミィ Lv2 HP1 act2/2 | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP5 act1/1 shield | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 prep
- selected: master:shield->monster:cpu_front_right
- best: master:shield->monster:cpu_front_right
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_front_right | 83.3 | white | -1000000 | 75 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 19/12 / deck cpu/player 6/6 / hand cpu/player 5/6 |
| 2 |  | end_turn | -46.9 | white | -1000000 | 74 | turn 20 / current player / HP cpu/player 0/2 / stones cpu/player 21/12 / deck cpu/player 6/6 / hand cpu/player 5/6 |


