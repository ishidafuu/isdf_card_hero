# White Planner Response Probe

生成: 2026-07-03T19:48:50.335Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 90

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 9 | 0 | 0-1 | -111536.9 | 70.7 | 164.7 | 現行 white_planner |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-1、平均score -111536.9。
- 今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。

## Samples

### seed 994302 challenger-as-player step 227

- turn: 21
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 21 / current player / HP player/cpu 4/7 / stones player/cpu 5/2 / deck player/cpu 5/5 / hand player/cpu 5/5
- board: player_front_left:PF:ピグミィ Lv1 HP3 act0/2 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ボムゾウ Lv1 HP4 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | attack:ヤンバル:wild_claw->ボムゾウ | 1/586.5 | 164.7 | - | -331 | turn 22 / current player / HP player/cpu 4/7 / stones player/cpu 7/4 / deck player/cpu 4/4 / hand player/cpu 6/5 | ボムゾウを削れるため攻撃 / 見送り: 攻撃は62点差で見送り |

Top evaluations:
- current: 586.5 attack:ヤンバル:wild_claw->ボムゾウ / 506.5 attack:デスシープ:attack->ボムゾウ / 110.3 end_turn
  - alt attack:デスシープ:attack->ボムゾウ root 506.5: branch - score -331 turn 22 / current player / HP player/cpu 4/7 / stones player/cpu 7/4 / deck player/cpu 4/4 / hand player/cpu 6/5
  - alt end_turn root 110.3: branch - score -605 turn 22 / current player / HP player/cpu 4/7 / stones player/cpu 9/2 / deck player/cpu 4/4 / hand player/cpu 6/5

### seed 994302 challenger-as-player step 228

- turn: 21
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 21 / current player / HP player/cpu 4/7 / stones player/cpu 5/2 / deck player/cpu 5/5 / hand player/cpu 5/5
- board: player_front_left:PF:ピグミィ Lv1 HP3 act0/2 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ボムゾウ Lv1 HP2 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | attack:デスシープ:attack->ボムゾウ | 1/720.8 | 104.8 | - | -331 | turn 22 / current player / HP player/cpu 4/7 / stones player/cpu 7/4 / deck player/cpu 4/4 / hand player/cpu 6/5 | 敵モンスターを撃破できるため攻撃 / ターンプラン探索: 返し込み最終盤面142点、次点と11点差 |

Top evaluations:
- current: 720.8 attack:デスシープ:attack->ボムゾウ / 349.8 master:master_attack->monster:cpu_front_right / 75.5 end_turn
  - alt master:master_attack->monster:cpu_front_right root 349.8: branch - score -382 turn 22 / current player / HP player/cpu 4/7 / stones player/cpu 5/6 / deck player/cpu 4/4 / hand player/cpu 6/5
  - alt end_turn root 75.5: branch - score -560 turn 22 / current player / HP player/cpu 3/7 / stones player/cpu 9/5 / deck player/cpu 4/4 / hand player/cpu 6/5

### seed 994302 challenger-as-player step 230

- turn: 21
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 21 / current player / HP player/cpu 4/7 / stones player/cpu 4/3 / deck player/cpu 5/5 / hand player/cpu 5/5
- board: player_front_left:PF:ピグミィ Lv1 HP3 act0/2 | player_front_right:PF:デスシープ Lv2 HP6 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/184 | 43.9 | - | -331 | turn 22 / current player / HP player/cpu 4/7 / stones player/cpu 7/4 / deck player/cpu 4/4 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / 見送り: マスター特技は88点差で見送り |

Top evaluations:
- current: 184 end_turn / 103.6 master:shield->monster:player_front_left
  - alt master:shield->monster:player_front_left root 103.6: branch - score -341 turn 22 / current player / HP player/cpu 4/7 / stones player/cpu 5/4 / deck player/cpu 4/4 / hand player/cpu 6/5

### seed 994302 challenger-as-player step 233

- turn: 22
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 22 / current player / HP player/cpu 4/7 / stones player/cpu 7/4 / deck player/cpu 4/4 / hand player/cpu 6/5
- board: player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:デスシープ Lv2 HP6 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv2 HP3 act0/1 focus,shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/152.2 | 137.3 | - | -354 | turn 23 / current player / HP player/cpu 3/7 / stones player/cpu 11/5 / deck player/cpu 3/3 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面178点、次点と3点差 |

Top evaluations:
- current: 152.2 end_turn / -6.8 attack:ピグミィ:attack->デスシープ / -112.3 attack:デスシープ:attack->cpu master
  - alt attack:ピグミィ:attack->デスシープ root -6.8: branch - score -303 turn 23 / current player / HP player/cpu 4/7 / stones player/cpu 10/5 / deck player/cpu 3/3 / hand player/cpu 6/5
  - alt attack:デスシープ:attack->cpu master root -112.3: branch - score -232 turn 23 / current player / HP player/cpu 4/6 / stones player/cpu 8/6 / deck player/cpu 3/3 / hand player/cpu 6/5

### seed 994302 challenger-as-player step 238

- turn: 23
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 23 / current player / HP player/cpu 3/7 / stones player/cpu 11/5 / deck player/cpu 3/3 / hand player/cpu 6/5
- board: player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:デスシープ Lv2 HP6 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act0/1 focus,shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/122.7 | 59.8 | - | -481 | turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面135点 |

Top evaluations:
- current: 122.7 end_turn / -173.6 attack:デスシープ:attack->cpu master
  - alt attack:デスシープ:attack->cpu master root -173.6: branch - score -418 turn 24 / current player / HP player/cpu 3/6 / stones player/cpu 15/3 / deck player/cpu 2/2 / hand player/cpu 6/5

### seed 994302 challenger-as-player step 244

- turn: 24
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5
- board: player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | move:player_back_right->player_front_left | 1/132.2 | 69 | - | -635 | turn 25 / current player / HP player/cpu 3/7 / stones player/cpu 20/3 / deck player/cpu 1/1 / hand player/cpu 6/5 | 移動後に強い攻撃筋を作れるため移動 / 見送り: 移動は79点差で見送り |

Top evaluations:
- current: 132.2 move:player_back_right->player_front_left / 18 move:player_back_right->player_back_left / 3.9 end_turn
  - alt move:player_back_right->player_back_left root 18: branch - score -568 turn 25 / current player / HP player/cpu 2/7 / stones player/cpu 19/3 / deck player/cpu 1/1 / hand player/cpu 6/5
  - alt end_turn root 3.9: branch - score -582 turn 25 / current player / HP player/cpu 2/7 / stones player/cpu 19/3 / deck player/cpu 1/1 / hand player/cpu 6/5

### seed 994302 challenger-as-player step 245

- turn: 24
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/-8.1 | 28.3 | - | -635 | turn 25 / current player / HP player/cpu 3/7 / stones player/cpu 20/3 / deck player/cpu 1/1 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-23点 |

Top evaluations:
- current: -8.1 end_turn

### seed 994302 challenger-as-player step 250

- turn: 25
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 25 / current player / HP player/cpu 3/7 / stones player/cpu 20/3 / deck player/cpu 1/1 / hand player/cpu 6/5
- board: player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/12.5 | 10.8 | - | -734 | turn 26 / current player / HP player/cpu 2/7 / stones player/cpu 24/6 / deck player/cpu 0/0 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-30点 |

Top evaluations:
- current: 12.5 end_turn

### seed 994302 challenger-as-player step 253

- turn: 26
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 26 / current player / HP player/cpu 2/7 / stones player/cpu 24/6 / deck player/cpu 0/0 / hand player/cpu 6/5
- board: player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act0/1 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/-203.6 | 17.8 | cpu | -1000000 | turn 27 / current player / HP player/cpu 0/6 / stones player/cpu 29/10 / deck player/cpu 0/0 / hand player/cpu 5/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-749388点 |

Top evaluations:
- current: -203.6 end_turn


