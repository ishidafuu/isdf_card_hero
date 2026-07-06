# White Planner Forced Branch Probe

生成: 2026-07-06T17:44:53.840Z
seed: 994331
direction: challenger-as-player
deck: `master-lab-white-1377-death-sheep3`
branchTop: 5
maxReplaySteps: 220

## Conclusion

- 強制分岐の範囲では、選択手を最終勝敗まで明確に上回る代替は見つからない。

## Samples

### step 108

- turn: 10
- plannerSide: player
- currentPlayer: player
- state: turn 10 / current player / HP player/cpu 9/8 / stones player/cpu 4/2 / deck player/cpu 16/16 / hand player/cpu 2/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP5 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 shield | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act1/1 focus
- selected: master:shield->monster:player_front_right
- best: master:shield->monster:player_front_right
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:player_front_right | 193.6 | white | -1000000 | 116 | turn 30 / current player / HP player/cpu 0/1 / stones player/cpu 46/44 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 2 |  | master:shield->monster:player_front_left | 49.7 | white | -1000000 | 173 | turn 29 / current player / HP player/cpu 0/2 / stones player/cpu 20/24 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 3 |  | end_turn | -315.6 | white | -1000000 | 66 | turn 15 / current cpu / HP player/cpu 0/7 / stones player/cpu 15/7 / deck player/cpu 11/10 / hand player/cpu 4/6 |

### step 118

- turn: 11
- plannerSide: player
- currentPlayer: player
- state: turn 11 / current player / HP player/cpu 9/8 / stones player/cpu 2/5 / deck player/cpu 15/15 / hand player/cpu 2/5
- board: player_front_left:PF:ボムゾウ Lv1 HP6 prep | player_front_right:PF:真勇者ダイン Lv3 HP5 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP5 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 prep
- selected: master:shield->monster:player_front_right
- best: master:shield->monster:player_front_right
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:player_front_right | 197.7 | white | -1000000 | 106 | turn 30 / current player / HP player/cpu 0/1 / stones player/cpu 46/44 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 2 |  | end_turn | -34.3 | white | -1000000 | 124 | turn 29 / current player / HP player/cpu 0/1 / stones player/cpu 43/27 / deck player/cpu 0/0 / hand player/cpu 5/4 |


