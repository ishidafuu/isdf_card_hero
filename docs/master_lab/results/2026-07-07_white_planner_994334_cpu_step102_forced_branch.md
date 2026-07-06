# White Planner Forced Branch Probe

生成: 2026-07-06T20:34:03.235Z
seed: 994334
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 4
maxReplaySteps: 190

## Conclusion

- 強制分岐の範囲では、選択手を最終勝敗まで明確に上回る代替は見つからない。

## Samples

### step 102

- turn: 9
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 9 / current cpu / HP cpu/player 9/7 / stones cpu/player 7/0 / deck cpu/player 16/17 / hand cpu/player 6/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:デスシープ Lv2 HP6 act1/1 shield | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2
- selected: move:cpu_front_right->cpu_back_left
- best: move:cpu_front_right->cpu_back_left
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | move:cpu_front_right->cpu_back_left | 309.2 | white | -1000000 | 95 | turn 16 / current player / HP cpu/player 0/5 / stones cpu/player 14/4 / deck cpu/player 10/10 / hand cpu/player 5/6 |
| 2 |  | summon:ピグミィ->cpu_back_right | 243.5 | white | -1000000 | 95 | turn 16 / current player / HP cpu/player 0/5 / stones cpu/player 14/4 / deck cpu/player 10/10 / hand cpu/player 5/6 |
| 3 |  | summon:ピグミィ->cpu_back_left | 217.6 | white | -1000000 | 95 | turn 16 / current player / HP cpu/player 0/5 / stones cpu/player 14/4 / deck cpu/player 10/10 / hand cpu/player 5/6 |
| 4 |  | summon:ドノマンティス->cpu_back_left | 175.6 | white | -1000000 | 135 | turn 20 / current player / HP cpu/player 0/5 / stones cpu/player 10/4 / deck cpu/player 6/6 / hand cpu/player 5/6 |


