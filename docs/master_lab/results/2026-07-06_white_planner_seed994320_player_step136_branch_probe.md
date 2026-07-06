# White Planner Forced Branch Probe

生成: 2026-07-06T02:17:59.415Z
seed: 994320
direction: challenger-as-player
deck: `master-lab-white-1377-death-sheep3`
branchTop: 12
maxReplaySteps: 100

## Conclusion

- 強制分岐の範囲では、選択手を最終勝敗まで明確に上回る代替は見つからない。

## Samples

### step 136

- turn: 12
- plannerSide: player
- currentPlayer: player
- state: turn 12 / current player / HP player/cpu 5/8 / stones player/cpu 5/1 / deck player/cpu 14/14 / hand player/cpu 5/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 | cpu_front_left:CF:デスシープ Lv2 HP4 act1/1 | cpu_front_right:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_back_left:CB:ドノマンティス Lv1 HP5 act1/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP2 act1/2 focus
- selected: master:master_attack->monster:cpu_front_left
- best: attack:ドノマンティス:attack->デスシープ
- selectedRank: 2
- bestVsSelectedScoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | attack:ドノマンティス:attack->デスシープ | 450.4 | white | -1000000 | 10 | turn 13 / current cpu / HP player/cpu 0/8 / stones player/cpu 8/9 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 2 | Y | master:master_attack->monster:cpu_front_left | 397.6 | white | -1000000 | 14 | turn 13 / current cpu / HP player/cpu 0/6 / stones player/cpu 5/9 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 3 |  | attack:ピグミィ:スパイクボール->真勇者ダイン | 315.7 | white | -1000000 | 14 | turn 13 / current cpu / HP player/cpu 0/6 / stones player/cpu 5/9 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 4 |  | focus:ドノマンティス | 151.3 | white | -1000000 | 13 | turn 13 / current cpu / HP player/cpu 0/8 / stones player/cpu 9/7 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 5 |  | end_turn | 38.4 | white | -1000000 | 8 | turn 13 / current cpu / HP player/cpu 0/8 / stones player/cpu 13/5 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 6 |  | focus:ピグミィ | 32 | white | -1000000 | 14 | turn 13 / current cpu / HP player/cpu 0/6 / stones player/cpu 5/9 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 7 |  | master:master_attack->monster:cpu_front_right | -1 | white | -1000000 | 13 | turn 13 / current cpu / HP player/cpu 0/7 / stones player/cpu 8/4 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 8 |  | attack:ピグミィ:スパイクボール->デスシープ | -69 | white | -1000000 | 14 | turn 13 / current cpu / HP player/cpu 0/6 / stones player/cpu 5/9 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 9 |  | summon:ポリスピナー->player_front_right | -273 | white | -1000000 | 14 | turn 13 / current cpu / HP player/cpu 0/6 / stones player/cpu 5/9 / deck player/cpu 13/12 / hand player/cpu 5/6 |
| 10 |  | summon:ポリスピナー->player_back_right | -480.4 | white | -1000000 | 14 | turn 13 / current cpu / HP player/cpu 0/6 / stones player/cpu 5/9 / deck player/cpu 13/12 / hand player/cpu 5/6 |
