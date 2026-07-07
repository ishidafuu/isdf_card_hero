# White Planner Forced Branch Probe

生成: 2026-07-06T23:13:33.698Z
seed: 994335
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 6
maxReplaySteps: 120

## Conclusion

- 強制分岐の範囲では、選択手を最終勝敗まで明確に上回る代替は見つからない。

## Samples

### step 139

- turn: 11
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 11 / current cpu / HP cpu/player 10/10 / stones cpu/player 7/2 / deck cpu/player 14/15 / hand cpu/player 5/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 shield | player_front_right:PF:デスシープ Lv1 HP6 prep | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP5 act0/1 | cpu_front_right:CF:真勇者ダイン Lv3 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- selected: attack:真勇者ダイン:ダイン斬り->player master
- best: attack:真勇者ダイン:ダイン斬り->player master
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:真勇者ダイン:ダイン斬り->player master | 473.1 | - | -602 | 120 | turn 20 / current cpu / HP cpu/player 4/5 / stones cpu/player 8/4 / deck cpu/player 5/6 / hand cpu/player 6/5 |
| 2 |  | focus:デスシープ | 205.9 | - | -602 | 120 | turn 20 / current cpu / HP cpu/player 4/5 / stones cpu/player 8/4 / deck cpu/player 5/6 / hand cpu/player 6/5 |
| 3 |  | attack:デスシープ:attack->真勇者ダイン | 165.4 | - | -603 | 120 | turn 20 / current player / HP cpu/player 5/6 / stones cpu/player 3/7 / deck cpu/player 6/6 / hand cpu/player 5/5 |
| 4 |  | focus:真勇者ダイン | 135.7 | - | -666 | 120 | turn 21 / current player / HP cpu/player 5/7 / stones cpu/player 1/8 / deck cpu/player 5/5 / hand cpu/player 5/5 |
| 5 |  | end_turn | 82.8 | - | -1068 | 120 | turn 21 / current cpu / HP cpu/player 7/10 / stones cpu/player 7/10 / deck cpu/player 4/5 / hand cpu/player 6/5 |


