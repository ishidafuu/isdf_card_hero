# White Planner Forced Branch Probe

生成: 2026-07-05T18:23:51.279Z
seed: 994317
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 4
maxReplaySteps: 120

## Conclusion

- 1/1 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 191

- turn: 17
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 17 / current cpu / HP cpu/player 6/2 / stones cpu/player 3/9 / deck cpu/player 8/9 / hand cpu/player 5/4
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
- selected: attack:ピグミィ:attack->真勇者ダイン
- best: end_turn
- selectedRank: 4
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | magic:ワープ->monster:player_front_left:monster:player_back_left | 226.1 | white | -1000000 | 19 | turn 21 / current player / HP cpu/player 0/2 / stones cpu/player 15/13 / deck cpu/player 5/5 / hand cpu/player 5/6 |
| 2 |  | magic:ワープ->monster:player_back_left:monster:player_front_left | 226.1 | white | -1000000 | 19 | turn 21 / current player / HP cpu/player 0/2 / stones cpu/player 15/13 / deck cpu/player 5/5 / hand cpu/player 5/6 |
| 3 | Y | attack:ピグミィ:attack->真勇者ダイン | 190.1 | white | -1000000 | 29 | turn 24 / current player / HP cpu/player 0/2 / stones cpu/player 24/20 / deck cpu/player 2/2 / hand cpu/player 5/6 |
| 4 |  | end_turn | 4.4 | white_planner | 1000000 | 6 | turn 18 / current cpu / HP cpu/player 6/0 / stones cpu/player 8/13 / deck cpu/player 7/8 / hand cpu/player 6/5 |


