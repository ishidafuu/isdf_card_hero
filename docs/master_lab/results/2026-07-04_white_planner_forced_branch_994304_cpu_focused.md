# White Planner Forced Branch Probe

生成: 2026-07-03T23:08:34.789Z
seed: 994304
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 4
maxReplaySteps: 340

## Conclusion

- 強制分岐の範囲では、選択手を最終勝敗まで明確に上回る代替は見つからない。

## Samples

### step 230

- turn: 22
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 22 / current cpu / HP cpu/player 6/6 / stones cpu/player 6/4 / deck cpu/player 3/4 / hand cpu/player 6/5
- board: player_front_left:PF:ボムゾウ Lv2 HP1 act1/1 shield | player_front_right:PF:ピグミィ Lv1 HP3 act2/2 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1
- selected: master:master_attack->monster:player_front_left
- best: master:master_attack->monster:player_front_left
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:master_attack->monster:player_front_left | 545.2 | white | -1000000 | 25 | turn 28 / current cpu / HP cpu/player 0/2 / stones cpu/player 26/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | summon:ヤンバル->cpu_back_left | 537.3 | white | -1000000 | 29 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 25/19 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | summon:ヤンバル->cpu_front_right | 479 | white | -1000000 | 32 | turn 29 / current cpu / HP cpu/player 0/1 / stones cpu/player 25/27 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 4 |  | summon:ヤンバル->cpu_back_right | 477.9 | white | -1000000 | 34 | turn 29 / current cpu / HP cpu/player 0/1 / stones cpu/player 24/29 / deck cpu/player 0/0 / hand cpu/player 5/5 |

### step 231

- turn: 22
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 22 / current cpu / HP cpu/player 6/6 / stones cpu/player 3/6 / deck cpu/player 3/4 / hand cpu/player 6/5
- board: player_front_right:PF:ピグミィ Lv1 HP3 act2/2 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1
- selected: summon:ヤンバル->cpu_back_left
- best: summon:ヤンバル->cpu_back_left
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ヤンバル->cpu_back_left | 146.4 | white | -1000000 | 24 | turn 28 / current cpu / HP cpu/player 0/2 / stones cpu/player 26/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | summon:ヤンバル->cpu_back_right | 93.2 | white | -1000000 | 31 | turn 29 / current cpu / HP cpu/player 0/1 / stones cpu/player 26/27 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | summon:ヤンバル->cpu_front_right | 55.4 | white | -1000000 | 31 | turn 29 / current cpu / HP cpu/player 0/1 / stones cpu/player 26/27 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 4 |  | master:master_attack->monster:player_front_right | -9.5 | white | -1000000 | 25 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 24/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |

### step 242

- turn: 24
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 24 / current cpu / HP cpu/player 6/6 / stones cpu/player 8/8 / deck cpu/player 1/2 / hand cpu/player 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus
- selected: attack:真勇者ダイン:ダイン斬り->player master
- best: end_turn
- selectedRank: 2
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | end_turn | 0 | white | -1000000 | 13 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 | Y | attack:真勇者ダイン:ダイン斬り->player master | -375.7 | white | -1000000 | 13 | turn 28 / current cpu / HP cpu/player 0/2 / stones cpu/player 26/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
