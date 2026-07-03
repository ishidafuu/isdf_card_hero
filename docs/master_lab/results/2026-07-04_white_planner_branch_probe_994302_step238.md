# White Planner Response Probe

生成: 2026-07-03T18:16:44.249Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 30

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 1 | 0 | 0-0 | -481 | 58.8 | 58.8 | 現行 white_planner |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-0、平均score -481。
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
| current | end_turn | 1/122.7 | 58.8 | - | -481 | turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面135点 |

Top evaluations:
- current: 122.7 end_turn / -173.6 attack:デスシープ:attack->cpu master
  - alt attack:デスシープ:attack->cpu master root -173.6: branch - score -418 turn 24 / current player / HP player/cpu 3/6 / stones player/cpu 15/3 / deck player/cpu 2/2 / hand player/cpu 6/5


