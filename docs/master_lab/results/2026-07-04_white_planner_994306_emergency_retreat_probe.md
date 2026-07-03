# White Planner Response Probe

生成: 2026-07-03T23:31:44.059Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 60

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 1 | 0 | 0-0 | -441 | 338.1 | 338.1 | 現行 white_planner |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-0、平均score -441。
- 今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。

## Samples

### seed 994306 challenger-as-player step 83

- turn: 8
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 3/2 / deck player/cpu 18/18 / hand player/cpu 3/5
- board: player_front_left:PF:ピグミィ Lv1 HP3 act1/2 focus | player_front_right:PF:ボムゾウ Lv1 HP6 act0/1 focus | player_back_left:PB:ドノマンティス Lv1 HP5 prep | player_back_right:PB:ヤンバル Lv2 HP2 act1/1 | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP5 act1/1 shield | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/-84.4 | 338.1 | - | -441 | turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 8/1 / deck player/cpu 17/17 / hand player/cpu 4/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-29点 |

Top evaluations:
- current: -84.4 end_turn / -227.8 attack:ボムゾウ:self_bomb->デスシープ / -351.8 attack:ボムゾウ:self_bomb->cpu master
  - alt attack:ボムゾウ:self_bomb->デスシープ root -227.8: branch - score -475 turn 9 / current player / HP player/cpu 8/10 / stones player/cpu 6/4 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt attack:ボムゾウ:self_bomb->cpu master root -351.8: branch - score -408 turn 9 / current player / HP player/cpu 8/9 / stones player/cpu 6/3 / deck player/cpu 17/17 / hand player/cpu 4/5
