# White Planner Forced Branch Probe

生成: 2026-07-04T00:11:48.539Z
seed: 994306
direction: challenger-as-player
deck: `master-lab-white-1377-death-sheep3`
branchTop: 6
maxReplaySteps: 260

## Conclusion

- 1/1 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 83

- turn: 8
- plannerSide: player
- currentPlayer: player
- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- selected: move:player_front_right->player_back_left
- best: summon:ボムゾウ->player_back_right
- selectedRank: 4
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | move:player_front_right->player_back_left | 333.6 | white | -1000000 | 92 | turn 22 / current cpu / HP player/cpu 0/6 / stones player/cpu 33/31 / deck player/cpu 4/3 / hand player/cpu 5/6 |
| 2 |  | move:player_front_left->player_back_right | 241.9 | white | -1000000 | 148 | turn 28 / current player / HP player/cpu 0/5 / stones player/cpu 42/39 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 3 |  | summon:ボムゾウ->player_back_right | 185.3 | white_planner | 1000000 | 198 | turn 27 / current player / HP player/cpu 5/0 / stones player/cpu 11/23 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 4 |  | summon:ボムゾウ->player_back_left | 183.1 | white | -1000000 | 187 | turn 27 / current player / HP player/cpu 0/6 / stones player/cpu 28/21 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 5 |  | summon:ドノマンティス->player_back_left | 85.2 | white_planner | 1000000 | 201 | turn 29 / current cpu / HP player/cpu 5/0 / stones player/cpu 19/28 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 6 |  | summon:ドノマンティス->player_back_right | 85.2 | white_planner | 1000000 | 122 | turn 22 / current player / HP player/cpu 1/0 / stones player/cpu 24/25 / deck player/cpu 4/4 / hand player/cpu 6/5 |


