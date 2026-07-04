# White Planner Response Probe

生成: 2026-07-04T22:00:14.118Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 80

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 1 | 0 | 0-0 | -405.4 | 1092.6 | 1092.6 | 現行 white_planner |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-0、平均score -405.4。
- 今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。

## Samples

### seed 994311 challenger-as-player step 67

- turn: 7
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 7 / current player / HP player/cpu 8/10 / stones player/cpu 13/4 / deck player/cpu 19/19 / hand player/cpu 4/4
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv2 HP4 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | focus:デスシープ | 1/391.3 | 1092.6 | - | -405.4 | turn 8 / current player / HP player/cpu 8/10 / stones player/cpu 6/1 / deck player/cpu 18/18 / hand player/cpu 4/3 | 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面321点、次点と80点差 |

Top evaluations:
- current: 391.3 focus:デスシープ / 346.8 master:master_attack->monster:cpu_front_left / 144.4 attack:デスシープ:attack->デスシープ / 32.3 end_turn / -70.2 summon:ヤンバル->player_back_left
  - alt master:master_attack->monster:cpu_front_left root 346.8: branch - score -405.4 turn 8 / current player / HP player/cpu 8/10 / stones player/cpu 6/1 / deck player/cpu 18/18 / hand player/cpu 4/3
  - alt attack:デスシープ:attack->デスシープ root 144.4: branch - score -424.4 turn 8 / current player / HP player/cpu 8/10 / stones player/cpu 11/0 / deck player/cpu 18/18 / hand player/cpu 4/3
  - alt end_turn root 32.3: branch - score -510 turn 8 / current player / HP player/cpu 8/10 / stones player/cpu 17/2 / deck player/cpu 18/18 / hand player/cpu 5/5
  - alt summon:ヤンバル->player_back_left root -70.2: branch - score -405.4 turn 8 / current player / HP player/cpu 8/10 / stones player/cpu 6/1 / deck player/cpu 18/18 / hand player/cpu 4/3
  - alt summon:ヤンバル->player_back_right root -212.6: branch - score -455.4 turn 8 / current player / HP player/cpu 8/10 / stones player/cpu 6/1 / deck player/cpu 18/18 / hand player/cpu 4/3
