# White Planner Forced Branch Probe

生成: 2026-07-05T07:37:04.484Z
seed: 994308
direction: challenger-as-player
deck: `master-lab-white-1377-death-sheep3`
branchTop: 6
maxReplaySteps: 220

## Conclusion

- 1/1 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 60

- turn: 6
- plannerSide: player
- currentPlayer: player
- state: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 4/0 / deck player/cpu 20/20 / hand player/cpu 5/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
- selected: focus:デスシープ
- best: summon:真勇者ダイン->player_back_right
- selectedRank: 3
- bestVsSelectedScoreDelta: 1001007

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | focus:デスシープ | 345 | white | -1000000 | 157 | turn 19 / current cpu / HP player/cpu 0/6 / stones player/cpu 6/9 / deck player/cpu 7/6 / hand player/cpu 5/6 |
| 2 |  | move:player_front_right->player_back_left | 299.7 | white | -1000000 | 108 | turn 15 / current cpu / HP player/cpu 0/7 / stones player/cpu 10/6 / deck player/cpu 11/10 / hand player/cpu 5/6 |
| 3 |  | move:player_back_left->player_front_right | 281.7 | white | -1000000 | 108 | turn 15 / current cpu / HP player/cpu 0/7 / stones player/cpu 10/6 / deck player/cpu 11/10 / hand player/cpu 5/6 |
| 4 |  | summon:真勇者ダイン->player_back_right | 237.2 | - | 1007 | 220 | turn 25 / current player / HP player/cpu 8/2 / stones player/cpu 11/10 / deck player/cpu 1/1 / hand player/cpu 6/5 |
| 5 |  | attack:ピグミィ:スパイクボール->真勇者ダイン | 86.5 | white | -1000000 | 157 | turn 19 / current cpu / HP player/cpu 0/6 / stones player/cpu 6/9 / deck player/cpu 7/6 / hand player/cpu 5/6 |
| 6 |  | move:player_front_right->player_back_right | 72.5 | - | 91 | 220 | turn 22 / current cpu / HP player/cpu 8/6 / stones player/cpu 6/3 / deck player/cpu 4/3 / hand player/cpu 3/6 |


