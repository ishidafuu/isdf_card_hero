# White Planner Forced Branch Probe

生成: 2026-07-05T11:38:38.060Z
seed: 994311
direction: challenger-as-player
deck: `master-lab-white-1377-death-sheep3`
branchTop: 8
maxReplaySteps: 240

## Conclusion

- 1/1 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 67

- turn: 7
- plannerSide: player
- currentPlayer: player
- state: turn 7 / current player / HP player/cpu 8/10 / stones player/cpu 13/4 / deck player/cpu 19/19 / hand player/cpu 4/4
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv2 HP4 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus
- selected: attack:デスシープ:attack->デスシープ
- best: end_turn
- selectedRank: 4
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | focus:デスシープ | 391.3 | white | -1000000 | 173 | turn 21 / current cpu / HP player/cpu 0/10 / stones player/cpu 13/6 / deck player/cpu 5/4 / hand player/cpu 5/5 |
| 2 |  | master:master_attack->monster:cpu_front_left | 346.8 | white | -1000000 | 173 | turn 21 / current cpu / HP player/cpu 0/10 / stones player/cpu 13/6 / deck player/cpu 5/4 / hand player/cpu 5/5 |
| 3 | Y | attack:デスシープ:attack->デスシープ | 144.4 | white | -1000000 | 126 | turn 18 / current cpu / HP player/cpu 0/6 / stones player/cpu 8/13 / deck player/cpu 8/7 / hand player/cpu 5/6 |
| 4 |  | end_turn | 32.3 | white_planner | 1000000 | 227 | turn 27 / current cpu / HP player/cpu 2/0 / stones player/cpu 11/30 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 5 |  | summon:ヤンバル->player_back_left | -70.2 | white | -1000000 | 173 | turn 21 / current cpu / HP player/cpu 0/10 / stones player/cpu 13/6 / deck player/cpu 5/4 / hand player/cpu 5/5 |
| 6 |  | summon:ヤンバル->player_back_right | -212.6 | white | -1000000 | 165 | turn 20 / current cpu / HP player/cpu 0/9 / stones player/cpu 10/9 / deck player/cpu 6/5 / hand player/cpu 5/6 |


