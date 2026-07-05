# White Planner Forced Branch Probe

生成: 2026-07-05T14:50:05.140Z
seed: 994314
direction: challenger-as-player
deck: `master-lab-white-1377-death-sheep3`
branchTop: 8
maxReplaySteps: 140

## Conclusion

- 1/1 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 170

- turn: 15
- plannerSide: player
- currentPlayer: player
- state: turn 15 / current player / HP player/cpu 10/5 / stones player/cpu 11/0 / deck player/cpu 11/11 / hand player/cpu 6/5
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv2 HP4 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP1 act2/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
- selected: summon:ヤンバル->player_back_left
- best: end_turn
- selectedRank: 5
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | attack:デスシープ:attack->cpu master | 239.5 | white | -1000000 | 49 | turn 25 / current cpu / HP player/cpu 0/2 / stones player/cpu 54/13 / deck player/cpu 1/0 / hand player/cpu 5/6 |
| 2 | Y | summon:ヤンバル->player_back_left | 174.7 | white | -1000000 | 54 | turn 25 / current cpu / HP player/cpu 0/2 / stones player/cpu 52/11 / deck player/cpu 1/0 / hand player/cpu 5/6 |
| 3 |  | end_turn | 149.6 | white_planner | 1000000 | 52 | turn 29 / current cpu / HP player/cpu 7/0 / stones player/cpu 54/40 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 4 |  | focus:デスシープ | 47.3 | white_planner | 1000000 | 62 | turn 26 / current cpu / HP player/cpu 3/0 / stones player/cpu 47/28 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 5 |  | attack:ボムゾウ:self_bomb->デスシープ | -288.8 | white_planner | 1000000 | 56 | turn 26 / current cpu / HP player/cpu 9/0 / stones player/cpu 33/27 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 6 |  | attack:ヤンバル:wild_claw->デスシープ | -298 | white | -1000000 | 54 | turn 25 / current cpu / HP player/cpu 0/2 / stones player/cpu 54/11 / deck player/cpu 1/0 / hand player/cpu 5/6 |
| 7 |  | attack:ボムゾウ:self_bomb->cpu master | -328.1 | white | -1000000 | 49 | turn 25 / current cpu / HP player/cpu 0/2 / stones player/cpu 54/13 / deck player/cpu 1/0 / hand player/cpu 5/6 |


