# White Planner Forced Branch Probe

生成: 2026-07-06T17:03:02.837Z
seed: 994332
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 10
maxReplaySteps: 240

## Conclusion

- 強制分岐の範囲では、選択手を最終勝敗まで明確に上回る代替は見つからない。

## Samples

### step 165

- turn: 18
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 18 / current cpu / HP cpu/player 3/10 / stones cpu/player 24/10 / deck cpu/player 7/8 / hand cpu/player 6/5
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act0/1 focus,shield | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1
- selected: attack:真勇者ダイン:ダイン斬り->ボムゾウ
- best: attack:真勇者ダイン:ダイン斬り->ボムゾウ
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:真勇者ダイン:ダイン斬り->ボムゾウ | 168.5 | white | -1000000 | 33 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | magic:ワープ->monster:player_front_left:monster:player_back_right | 125.7 | white | -1000000 | 28 | turn 26 / current cpu / HP cpu/player 0/8 / stones cpu/player 45/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | magic:ワープ->monster:player_back_right:monster:player_front_left | 125.7 | white | -1000000 | 28 | turn 26 / current cpu / HP cpu/player 0/8 / stones cpu/player 45/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 4 |  | end_turn | 97.1 | white | -1000000 | 28 | turn 27 / current cpu / HP cpu/player 0/7 / stones cpu/player 51/39 / deck cpu/player 0/0 / hand cpu/player 5/5 |

### step 166

- turn: 18
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 18 / current cpu / HP cpu/player 3/10 / stones cpu/player 24/10 / deck cpu/player 7/8 / hand cpu/player 6/5
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act0/1 shield | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1
- selected: magic:ワープ->monster:player_front_left:monster:player_back_right
- best: magic:ワープ->monster:player_front_left:monster:player_back_right
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | magic:ワープ->monster:player_front_left:monster:player_back_right | 60.3 | white | -1000000 | 32 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | magic:ワープ->monster:player_back_right:monster:player_front_left | 60.3 | white | -1000000 | 32 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | end_turn | 21.5 | white | -1000000 | 32 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |

### step 175

- turn: 20
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 20 / current cpu / HP cpu/player 3/10 / stones cpu/player 27/9 / deck cpu/player 5/6 / hand cpu/player 6/5
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act0/1 focus,shield | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1
- selected: attack:真勇者ダイン:ダイン斬り->ボムゾウ
- best: attack:真勇者ダイン:ダイン斬り->ボムゾウ
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:真勇者ダイン:ダイン斬り->ボムゾウ | 135.6 | white | -1000000 | 23 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | end_turn | 97.1 | white | -1000000 | 22 | turn 28 / current cpu / HP cpu/player 0/7 / stones cpu/player 51/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |

### step 183

- turn: 22
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 22 / current cpu / HP cpu/player 2/10 / stones cpu/player 34/13 / deck cpu/player 3/4 / hand cpu/player 6/5
- board: player_front_left:PF:ボムゾウ Lv1 HP2 act1/1 shield | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1
- selected: attack:真勇者ダイン:ダイン斬り->ボムゾウ
- best: attack:真勇者ダイン:ダイン斬り->ボムゾウ
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:真勇者ダイン:ダイン斬り->ボムゾウ | 353.7 | white | -1000000 | 15 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | end_turn | 110.9 | white | -1000000 | 15 | turn 26 / current cpu / HP cpu/player 0/10 / stones cpu/player 48/20 / deck cpu/player 0/0 / hand cpu/player 5/5 |

### step 184

- turn: 22
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 22 / current cpu / HP cpu/player 2/10 / stones cpu/player 34/13 / deck cpu/player 3/4 / hand cpu/player 6/5
- board: player_front_left:PF:ボムゾウ Lv1 HP1 act1/1 shield | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1
- selected: master:master_attack->monster:player_front_left
- best: master:master_attack->monster:player_front_left
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:master_attack->monster:player_front_left | 330.7 | white | -1000000 | 14 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | end_turn | -11.6 | white | -1000000 | 15 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/29 / deck cpu/player 0/0 / hand cpu/player 5/5 |

### step 195

- turn: 26
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 26 / current cpu / HP cpu/player 1/10 / stones cpu/player 44/26 / deck cpu/player 0/0 / hand cpu/player 5/5
- board: player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus
- selected: attack:真勇者ダイン:ダイン斬り->player master
- best: attack:真勇者ダイン:ダイン斬り->player master
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:真勇者ダイン:ダイン斬り->player master | 136.3 | white | -1000000 | 3 | turn 27 / current cpu / HP cpu/player 0/8 / stones cpu/player 48/31 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | end_turn | 66 | white | -1000000 | 2 | turn 27 / current cpu / HP cpu/player 0/9 / stones cpu/player 48/30 / deck cpu/player 0/0 / hand cpu/player 5/5 |


