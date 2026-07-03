# White Planner Response Probe

生成: 2026-07-03T19:51:49.095Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 90

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 1 | 0 | 0-0 | -582 | 37.5 | 37.5 | 現行 white_planner |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-0、平均score -582。
- 今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。

## Samples

### seed 994302 challenger-as-player step 244

- turn: 24
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5
- board: player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 2/3.9 | 37.5 | - | -582 | turn 25 / current player / HP player/cpu 2/7 / stones player/cpu 19/3 / deck player/cpu 1/1 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面30点 |

Top evaluations:
- current: 18 move:player_back_right->player_back_left / 3.9 end_turn
  - alt move:player_back_right->player_back_left root 18: branch - score -568 turn 25 / current player / HP player/cpu 2/7 / stones player/cpu 19/3 / deck player/cpu 1/1 / hand player/cpu 6/5


