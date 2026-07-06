# White Planner Forced Branch Probe

生成: 2026-07-06T06:39:38.280Z
seed: 994322
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 8
maxReplaySteps: 320

## Conclusion

- 1/1 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 16

- turn: 2
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 2 / current cpu / HP cpu/player 10/10 / stones cpu/player 3/0 / deck cpu/player 23/24 / hand cpu/player 4/2
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1
- selected: magic:ローテーション->master:cpu
- best: end_turn
- selectedRank: 2
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | magic:ローテーション->master:cpu | 131.4 | white | -1000000 | 160 | turn 18 / current player / HP cpu/player 0/10 / stones cpu/player 10/12 / deck cpu/player 8/8 / hand cpu/player 5/6 |
| 2 |  | focus:真勇者ダイン | 74.8 | white | -1000000 | 160 | turn 18 / current player / HP cpu/player 0/10 / stones cpu/player 10/12 / deck cpu/player 8/8 / hand cpu/player 5/6 |
| 3 |  | end_turn | -69.6 | white_planner | 1000000 | 175 | turn 19 / current cpu / HP cpu/player 6/0 / stones cpu/player 11/9 / deck cpu/player 6/7 / hand cpu/player 6/5 |


