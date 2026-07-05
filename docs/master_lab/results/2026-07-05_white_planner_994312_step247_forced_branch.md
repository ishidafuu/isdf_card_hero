# White Planner Forced Branch Probe

生成: 2026-07-05T13:23:19.820Z
seed: 994312
direction: challenger-as-player
deck: `master-lab-white-1377-death-sheep3`
branchTop: 8
maxReplaySteps: 220

## Conclusion

- 1/1 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 247

- turn: 20
- plannerSide: player
- currentPlayer: player
- state: turn 20 / current player / HP player/cpu 6/10 / stones player/cpu 8/2 / deck player/cpu 6/6 / hand player/cpu 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 shield | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus
- selected: magic:ローテーション->master:player
- best: move:player_back_left->player_front_right
- selectedRank: 3
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | magic:ローテーション->master:player | 306.8 | white | -1000000 | 62 | turn 31 / current player / HP player/cpu 0/4 / stones player/cpu 27/30 / deck player/cpu 0/0 / hand player/cpu 5/4 |
| 2 |  | move:player_back_left->player_front_right | 185.9 | white_planner | 1000000 | 62 | turn 27 / current player / HP player/cpu 4/0 / stones player/cpu 15/23 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 3 |  | move:player_front_right->player_back_right | 146.9 | white | -1000000 | 48 | turn 27 / current player / HP player/cpu 0/6 / stones player/cpu 15/20 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 4 |  | end_turn | 80.3 | white | -1000000 | 63 | turn 31 / current player / HP player/cpu 0/1 / stones player/cpu 32/31 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 5 |  | focus:ピグミィ | -46 | white | -1000000 | 63 | turn 31 / current player / HP player/cpu 0/4 / stones player/cpu 27/30 / deck player/cpu 0/0 / hand player/cpu 5/4 |
| 6 |  | move:player_front_right->player_back_left | -58 | white_planner | 1000000 | 62 | turn 27 / current player / HP player/cpu 4/0 / stones player/cpu 15/23 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 7 |  | move:player_back_left->player_front_left | -81.2 | white | -1000000 | 58 | turn 27 / current cpu / HP player/cpu 0/8 / stones player/cpu 20/21 / deck player/cpu 0/0 / hand player/cpu 5/5 |
| 8 |  | attack:ドノマンティス:attack->ボムゾウ | -193 | white | -1000000 | 62 | turn 28 / current cpu / HP player/cpu 0/2 / stones player/cpu 22/26 / deck player/cpu 0/0 / hand player/cpu 5/5 |


