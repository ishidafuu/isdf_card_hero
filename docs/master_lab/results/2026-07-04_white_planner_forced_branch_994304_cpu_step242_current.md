# White Planner Forced Branch Probe

生成: 2026-07-03T23:55:16.836Z
seed: 994304
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 2
maxReplaySteps: 120

## Conclusion

- 強制分岐の範囲では、選択手を最終勝敗まで明確に上回る代替は見つからない。

## Samples

### step 242

- turn: 24
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 24 / current cpu / HP cpu/player 6/6 / stones cpu/player 8/8 / deck cpu/player 1/2 / hand cpu/player 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus
- selected: end_turn
- best: end_turn
- selectedRank: 1
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | end_turn | 0 | white | -1000000 | 13 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | attack:真勇者ダイン:ダイン斬り->player master | -375.7 | white | -1000000 | 13 | turn 28 / current cpu / HP cpu/player 0/2 / stones cpu/player 26/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
