# White Planner Forced Branch Probe

生成: 2026-07-06T02:29:55.242Z
seed: 994320
direction: challenger-as-player
deck: `master-lab-white-1377-death-sheep3`
branchTop: 16
maxReplaySteps: 120

## Conclusion

- 1/1 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 101

- turn: 10
- plannerSide: player
- currentPlayer: player
- state: turn 10 / current player / HP player/cpu 6/8 / stones player/cpu 8/4 / deck player/cpu 16/16 / hand player/cpu 5/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- selected: master:wake_up->monster:cpu_back_left
- best: attack:ピグミィ:スパイクボール->真勇者ダイン
- selectedRank: 8
- bestVsSelectedScoreDelta: 1000038.8

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:wake_up->monster:cpu_back_left | 651.8 | white | -1000000 | 49 | turn 13 / current cpu / HP player/cpu 0/6 / stones player/cpu 5/9 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 2 |  | attack:ピグミィ:スパイクボール->デスシープ | 624.8 | white | -1000000 | 49 | turn 13 / current cpu / HP player/cpu 0/6 / stones player/cpu 5/9 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 3 |  | focus:真勇者ダイン | 552.1 | white | -1000000 | 39 | turn 13 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/9 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 4 |  | attack:ヤンバル:wild_claw->ピグミィ | 248.5 | - | -177.2 | 120 | turn 19 / current cpu / HP player/cpu 6/8 / stones player/cpu 5/10 / deck player/cpu 7/6 / hand player/cpu 5/5 |
| 5 |  | end_turn | 83.8 | white | -1000000 | 27 | turn 13 / current cpu / HP player/cpu 0/6 / stones player/cpu 15/12 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 6 |  | move:player_front_right->player_back_right | 44 | - | -164 | 120 | turn 19 / current cpu / HP player/cpu 6/7 / stones player/cpu 4/5 / deck player/cpu 7/6 / hand player/cpu 5/6 |
| 7 |  | focus:ピグミィ | 44 | white | -1000000 | 36 | turn 13 / current cpu / HP player/cpu 0/8 / stones player/cpu 5/8 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 8 |  | focus:ヤンバル | 30 | - | -365.6 | 120 | turn 18 / current cpu / HP player/cpu 6/7 / stones player/cpu 1/2 / deck player/cpu 8/7 / hand player/cpu 4/5 |
| 9 |  | move:player_back_left->player_back_right | 24.5 | white | -1000000 | 39 | turn 13 / current cpu / HP player/cpu 0/8 / stones player/cpu 11/9 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 10 |  | attack:ヤンバル:wild_claw->デスシープ | 6.4 | - | -207 | 120 | turn 19 / current player / HP player/cpu 6/8 / stones player/cpu 7/4 / deck player/cpu 7/7 / hand player/cpu 6/5 |
| 11 |  | attack:真勇者ダイン:ダイン斬り->デスシープ | -38.6 | white | -1000000 | 36 | turn 13 / current cpu / HP player/cpu 0/8 / stones player/cpu 5/8 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 12 |  | attack:ピグミィ:スパイクボール->真勇者ダイン | -231 | - | 38.8 | 120 | turn 19 / current player / HP player/cpu 5/7 / stones player/cpu 2/3 / deck player/cpu 7/7 / hand player/cpu 5/5 |
| 13 |  | summon:ピグミィ->player_back_right | -253.6 | - | -795 | 120 | turn 24 / current player / HP player/cpu 2/5 / stones player/cpu 21/30 / deck player/cpu 2/2 / hand player/cpu 6/5 |
| 14 |  | move:player_front_right->player_back_left | -298 | white | -1000000 | 19 | turn 12 / current cpu / HP player/cpu 0/7 / stones player/cpu 18/6 / deck player/cpu 14/13 / hand player/cpu 5/6 |
| 15 |  | master:master_attack->monster:cpu_front_right | -341 | - | -431.2 | 120 | turn 20 / current player / HP player/cpu 3/8 / stones player/cpu 5/5 / deck player/cpu 6/6 / hand player/cpu 4/5 |
