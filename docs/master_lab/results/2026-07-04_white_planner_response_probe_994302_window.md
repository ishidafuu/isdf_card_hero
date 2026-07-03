# White Planner Response Probe

生成: 2026-07-03T18:13:37.656Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 30

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 3 | 0 | 0-0 | -616.7 | 44.4 | 65.7 | 現行 white_planner |
| response2_width2 | 3 | 0 | 0-0 | -616.7 | 48 | 73.4 | 相手応答を深さ2・幅2で読む |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-0、平均score -616.7。
- 今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。

## Samples

### seed 994302 challenger-as-player step 238

- turn: 23
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 23 / current player / HP player/cpu 3/7 / stones player/cpu 11/5 / deck player/cpu 3/3 / hand player/cpu 6/5
- board: player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:デスシープ Lv2 HP6 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act0/1 focus,shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/122.7 | 54.3 | - | -481 | turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面135点 |
| response2_width2 | end_turn | 1/122.7 | 59.5 | - | -481 | turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面114点 |

Top evaluations:
- current: 122.7 end_turn / -173.6 attack:デスシープ:attack->cpu master
- response2_width2: 122.7 end_turn / -173.6 attack:デスシープ:attack->cpu master

### seed 994302 challenger-as-player step 244

- turn: 24
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5
- board: player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | move:player_back_right->player_front_left | 1/132.2 | 65.7 | - | -635 | turn 25 / current player / HP player/cpu 3/7 / stones player/cpu 20/3 / deck player/cpu 1/1 / hand player/cpu 6/5 | 移動後に強い攻撃筋を作れるため移動 / 見送り: 移動は79点差で見送り |
| response2_width2 | move:player_back_right->player_front_left | 1/132.2 | 73.4 | - | -635 | turn 25 / current player / HP player/cpu 3/7 / stones player/cpu 20/3 / deck player/cpu 1/1 / hand player/cpu 6/5 | 移動後に強い攻撃筋を作れるため移動 / 見送り: 移動は79点差で見送り |

Top evaluations:
- current: 132.2 move:player_back_right->player_front_left / 18 move:player_back_right->player_back_left / 3.9 end_turn
- response2_width2: 132.2 move:player_back_right->player_front_left / 18 move:player_back_right->player_back_left / 3.9 end_turn

### seed 994302 challenger-as-player step 250

- turn: 25
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 25 / current player / HP player/cpu 3/7 / stones player/cpu 20/3 / deck player/cpu 1/1 / hand player/cpu 6/5
- board: player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/12.5 | 13.2 | - | -734 | turn 26 / current player / HP player/cpu 2/7 / stones player/cpu 24/6 / deck player/cpu 0/0 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-30点 |
| response2_width2 | end_turn | 1/12.5 | 11.2 | - | -734 | turn 26 / current player / HP player/cpu 2/7 / stones player/cpu 24/6 / deck player/cpu 0/0 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-30点 |

Top evaluations:
- current: 12.5 end_turn
- response2_width2: 12.5 end_turn


