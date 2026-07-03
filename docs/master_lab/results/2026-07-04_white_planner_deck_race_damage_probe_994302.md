# White Planner Response Probe

生成: 2026-07-03T20:14:47.464Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 90

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 2 | 0 | 0-0 | -232 | 11.7 | 23.2 | 現行 white_planner |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-0、平均score -232。
- 今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。

## Samples

### seed 994302 challenger-as-player step 233

- turn: 22
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 22 / current player / HP player/cpu 4/7 / stones player/cpu 7/4 / deck player/cpu 4/4 / hand player/cpu 6/5
- board: player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:デスシープ Lv2 HP6 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv2 HP3 act0/1 focus,shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | attack:デスシープ:attack->cpu master | 3/-112.3 | 0.2 | - | -232 | turn 23 / current player / HP player/cpu 4/6 / stones player/cpu 8/6 / deck player/cpu 3/3 / hand player/cpu 6/5 | ターン開始時の最大打点1点で詰めろを作れるため攻撃 |

Top evaluations:
- current: 152.2 end_turn / -6.8 attack:ピグミィ:attack->デスシープ / -112.3 attack:デスシープ:attack->cpu master
  - alt end_turn root 152.2: branch - score -354 turn 23 / current player / HP player/cpu 3/7 / stones player/cpu 11/5 / deck player/cpu 3/3 / hand player/cpu 6/5
  - alt attack:ピグミィ:attack->デスシープ root -6.8: branch - score -232 turn 23 / current player / HP player/cpu 4/6 / stones player/cpu 8/6 / deck player/cpu 3/3 / hand player/cpu 6/5

### seed 994302 challenger-as-player step 238

- turn: 22
- plannerSide: player
- currentPlayer: cpu
- plannerTurn: N
- state: turn 22 / current cpu / HP player/cpu 4/6 / stones player/cpu 5/6 / deck player/cpu 4/3 / hand player/cpu 5/6
- board: player_front_left:PF:ピグミィ Lv1 HP3 act1/2 focus,shield | player_front_right:PF:デスシープ Lv2 HP6 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act0/1 focus,shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/10.9 | 23.2 | - | -232 | turn 23 / current player / HP player/cpu 4/6 / stones player/cpu 8/6 / deck player/cpu 3/3 / hand player/cpu 6/5 | 有効な行動がないためターン終了 |

Top evaluations:
- current: 10.9 end_turn


