# White Planner Response Probe

生成: 2026-07-05T01:15:32.428Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 80

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 3 | 0 | 0-0 | -70.3 | 1418.1 | 3889.4 | 現行 white_planner |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-0、平均score -70.3。
- 今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。

## Samples

### seed 994307 challenger-as-cpu step 18

- turn: 2
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 2 / current cpu / HP cpu/player 10/10 / stones cpu/player 3/0 / deck cpu/player 23/24 / hand cpu/player 4/2
- board: player_front_left:PF:真勇者ダイン Lv1 HP5 act1/1 shield | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ポリスピナー Lv1 HP3 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 focus | cpu_front_left:CF:ポリスピナー Lv1 HP3 act2/2 | cpu_front_right:CF:デスシープ Lv1 HP6 prep | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | master:shield->monster:cpu_front_left | 1/49.8 | 119.8 | - | -105 | turn 3 / current cpu / HP cpu/player 10/10 / stones cpu/player 4/1 / deck cpu/player 22/23 / hand cpu/player 5/3 | 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面5点、次点と62点差 |

Top evaluations:
- current: 49.8 master:shield->monster:cpu_front_left / -101.4 end_turn / -191.5 master:master_attack->monster:player_front_right
  - alt end_turn root -101.4: branch - score -263 turn 3 / current cpu / HP cpu/player 10/10 / stones cpu/player 7/0 / deck cpu/player 22/23 / hand cpu/player 5/3
  - alt master:master_attack->monster:player_front_right root -191.5: branch - score -266 turn 3 / current cpu / HP cpu/player 10/10 / stones cpu/player 4/0 / deck cpu/player 22/23 / hand cpu/player 5/3

### seed 994307 challenger-as-cpu step 68

- turn: 6
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 6 / current cpu / HP cpu/player 10/10 / stones cpu/player 4/1 / deck cpu/player 19/20 / hand cpu/player 5/4
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 shield | player_front_right:PF:デスシープ Lv1 HP6 prep | player_back_left:PB:ヤンバル Lv1 HP1 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 prep | cpu_front_left:CF:デスシープ Lv1 HP5 act1/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_back_left:CB:デスシープ Lv1 HP6 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | master:shield->monster:cpu_front_left | 1/57.3 | 245.1 | - | -170 | turn 7 / current cpu / HP cpu/player 10/10 / stones cpu/player 6/0 / deck cpu/player 18/19 / hand cpu/player 6/5 | 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面-81点、次点と0点差 |

Top evaluations:
- current: 57.3 master:shield->monster:cpu_front_left / 55.2 master:shield->monster:cpu_front_right / -107.9 end_turn
  - alt master:shield->monster:cpu_front_right root 55.2: branch - score -100 turn 7 / current cpu / HP cpu/player 10/10 / stones cpu/player 6/0 / deck cpu/player 18/19 / hand cpu/player 6/5
  - alt end_turn root -107.9: branch - score -90 turn 7 / current cpu / HP cpu/player 10/10 / stones cpu/player 8/0 / deck cpu/player 18/19 / hand cpu/player 6/5

### seed 994307 challenger-as-cpu step 102

- turn: 9
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 9 / current cpu / HP cpu/player 10/10 / stones cpu/player 3/2 / deck cpu/player 16/17 / hand cpu/player 6/5
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 shield | player_back_left:PB:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 focus | cpu_front_right:CF:ボムゾウ Lv2 HP5 act1/1 | cpu_back_left:CB:デスシープ Lv1 HP1 act1/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | master:shield->monster:cpu_front_right | 2/43.5 | 3889.4 | - | 64.2 | turn 10 / current cpu / HP cpu/player 10/10 / stones cpu/player 4/4 / deck cpu/player 15/16 / hand cpu/player 6/5 | 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面253点、次点と232点差、rollout 64点 |

Top evaluations:
- current: 47.8 master:shield->monster:cpu_front_left / 43.5 master:shield->monster:cpu_front_right / -90.9 end_turn / -195 master:master_attack->monster:player_front_left
  - alt master:shield->monster:cpu_front_left root 47.8: branch - score -138.8 turn 10 / current cpu / HP cpu/player 10/10 / stones cpu/player 6/0 / deck cpu/player 15/16 / hand cpu/player 6/5
  - alt end_turn root -90.9: branch - score -116.8 turn 10 / current cpu / HP cpu/player 10/10 / stones cpu/player 8/0 / deck cpu/player 15/16 / hand cpu/player 6/5
  - alt master:master_attack->monster:player_front_left root -195: branch - score -119.8 turn 10 / current cpu / HP cpu/player 10/10 / stones cpu/player 5/0 / deck cpu/player 15/16 / hand cpu/player 6/5


