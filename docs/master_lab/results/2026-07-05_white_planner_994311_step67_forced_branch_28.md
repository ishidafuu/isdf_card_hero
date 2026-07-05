# White Planner Forced Branch Probe

生成: 2026-07-05T12:02:59.950Z
seed: 994311
direction: challenger-as-player
deck: `master-lab-white-1377-death-sheep3`
branchTop: 8
maxReplaySteps: 28

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
- selectedRank: 2
- bestVsSelectedScoreDelta: 237.2

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | focus:デスシープ | 391.3 | - | -539.4 | 28 | turn 8 / current cpu / HP player/cpu 8/10 / stones player/cpu 2/4 / deck player/cpu 18/17 / hand player/cpu 3/3 |
| 2 |  | master:master_attack->monster:cpu_front_left | 346.8 | - | -539.4 | 28 | turn 8 / current cpu / HP player/cpu 8/10 / stones player/cpu 2/4 / deck player/cpu 18/17 / hand player/cpu 3/3 |
| 3 | Y | attack:デスシープ:attack->デスシープ | 144.4 | - | -302.2 | 28 | turn 9 / current player / HP player/cpu 8/10 / stones player/cpu 4/3 / deck player/cpu 17/17 / hand player/cpu 2/4 |
| 4 |  | end_turn | 32.3 | - | -65 | 28 | turn 9 / current player / HP player/cpu 8/10 / stones player/cpu 8/1 / deck player/cpu 17/17 / hand player/cpu 3/5 |
| 5 |  | summon:ヤンバル->player_back_left | -70.2 | - | -539.4 | 28 | turn 8 / current cpu / HP player/cpu 8/10 / stones player/cpu 2/4 / deck player/cpu 18/17 / hand player/cpu 3/3 |
| 6 |  | summon:ヤンバル->player_back_right | -212.6 | - | -322.6 | 28 | turn 9 / current player / HP player/cpu 8/10 / stones player/cpu 3/2 / deck player/cpu 17/17 / hand player/cpu 3/3 |


