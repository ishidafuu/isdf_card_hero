# White Planner Response Probe

生成: 2026-07-04T00:29:55.578Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 60

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 1 | 0 | 0-0 | -194.8 | 2812.6 | 2812.6 | 現行 white_planner |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-0、平均score -194.8。
- 今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。

## Samples

### seed 994306 challenger-as-player step 83

- turn: 8
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | summon:ボムゾウ->player_back_right | 1/348.3 | 2812.6 | - | -194.8 | turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5 | ボムゾウを空き枠へ召喚 / 見送り: 召喚は2点差で見送り、召喚は13点差で見送り |

Top evaluations:
- current: 348.3 summon:ボムゾウ->player_back_right / 346.1 summon:ボムゾウ->player_back_left / 345.7 summon:ドノマンティス->player_back_right / 343.5 summon:ドノマンティス->player_back_left / 132.8 summon:デスシープ->player_back_left
  - alt summon:ボムゾウ->player_back_left root 346.1: branch - score -136.8 turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ドノマンティス->player_back_right root 345.7: branch - score -200.8 turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ドノマンティス->player_back_left root 343.5: branch - score -142.8 turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:デスシープ->player_back_left root 132.8: branch - score -554 turn 9 / current player / HP player/cpu 6/10 / stones player/cpu 13/2 / deck player/cpu 17/17 / hand player/cpu 4/5


