# White Planner Forced Branch Probe

生成: 2026-07-05T09:07:41.715Z
seed: 994310
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 8
maxReplaySteps: 240

## Conclusion

- 1/1 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 54

- turn: 5
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 5 / current cpu / HP cpu/player 10/10 / stones cpu/player 6/0 / deck cpu/player 20/21 / hand cpu/player 4/4
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1
- selected: focus:デスシープ
- best: summon:デスシープ->cpu_back_right
- selectedRank: 3
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | focus:デスシープ | 318.8 | white | -1000000 | 150 | turn 21 / current player / HP cpu/player 0/10 / stones cpu/player 14/20 / deck cpu/player 5/5 / hand cpu/player 5/6 |
| 2 |  | summon:デスシープ->cpu_front_right | 247.6 | white | -1000000 | 150 | turn 21 / current player / HP cpu/player 0/10 / stones cpu/player 14/20 / deck cpu/player 5/5 / hand cpu/player 5/6 |
| 3 |  | summon:デスシープ->cpu_back_left | 202 | white | -1000000 | 182 | turn 26 / current cpu / HP cpu/player 0/10 / stones cpu/player 26/12 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 4 |  | summon:デスシープ->cpu_back_right | 188 | white_planner | 1000000 | 216 | turn 27 / current player / HP cpu/player 6/0 / stones cpu/player 16/16 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 5 |  | end_turn | 18.3 | white_planner | 1000000 | 207 | turn 23 / current cpu / HP cpu/player 5/0 / stones cpu/player 4/22 / deck cpu/player 2/3 / hand cpu/player 6/5 |
| 6 |  | master:master_attack->monster:player_front_right | -1 | white | -1000000 | 150 | turn 21 / current player / HP cpu/player 0/10 / stones cpu/player 14/20 / deck cpu/player 5/5 / hand cpu/player 5/6 |
| 7 |  | attack:デスシープ:attack->デスシープ | -58 | white | -1000000 | 217 | turn 27 / current player / HP cpu/player 0/3 / stones cpu/player 17/20 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 8 |  | master:master_attack->monster:player_front_left | -198 | white | -1000000 | 217 | turn 27 / current player / HP cpu/player 0/3 / stones cpu/player 17/20 / deck cpu/player 0/0 / hand cpu/player 5/5 |


