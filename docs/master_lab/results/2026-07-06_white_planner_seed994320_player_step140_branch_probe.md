# White Planner Forced Branch Probe

生成: 2026-07-06T02:16:39.888Z
seed: 994320
direction: challenger-as-player
deck: `master-lab-white-1377-death-sheep3`
branchTop: 12
maxReplaySteps: 80

## Conclusion

- 強制分岐の範囲では、選択手を最終勝敗まで明確に上回る代替は見つからない。

## Samples

### step 140

- turn: 12
- plannerSide: player
- currentPlayer: player
- state: turn 12 / current player / HP player/cpu 5/8 / stones player/cpu 1/3 / deck player/cpu 14/14 / hand player/cpu 5/5
- board: player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | cpu_back_left:CB:ドノマンティス Lv1 HP5 act1/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP2 act1/2 focus
- selected: summon:ポリスピナー->player_front_right
- best: end_turn
- selectedRank: 2
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | end_turn | -300.1 | white | -1000000 | 8 | turn 13 / current cpu / HP player/cpu 0/6 / stones player/cpu 8/9 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 2 | Y | summon:ポリスピナー->player_front_right | -407.4 | white | -1000000 | 10 | turn 13 / current cpu / HP player/cpu 0/6 / stones player/cpu 5/9 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 3 |  | summon:ポリスピナー->player_back_right | -454.4 | white | -1000000 | 10 | turn 13 / current cpu / HP player/cpu 0/6 / stones player/cpu 5/9 / deck player/cpu 13/12 / hand player/cpu 5/6 |
