# White Planner Response Probe

生成: 2026-07-03T23:25:08.300Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 80

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 1 | 0 | 0-0 | -405.8 | 2783.4 | 2783.4 | 現行 white_planner |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-0、平均score -405.8。
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
| current | move:player_front_right->player_back_left | 1/333.6 | 2783.4 | - | -405.8 | turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 5/5 | 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: 移動は92点差で見送り、召喚は148点差で見送り |

Top evaluations:
- current: 333.6 move:player_front_right->player_back_left / 241.9 move:player_front_left->player_back_right / 185.3 summon:ボムゾウ->player_back_right / 183.1 summon:ボムゾウ->player_back_left / 85.2 summon:ドノマンティス->player_back_left
  - alt move:player_front_left->player_back_right root 241.9: branch - score -334 turn 9 / current player / HP player/cpu 6/10 / stones player/cpu 11/1 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ボムゾウ->player_back_right root 185.3: branch - score -194.8 turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ボムゾウ->player_back_left root 183.1: branch - score -136.8 turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ドノマンティス->player_back_left root 85.2: branch - score -142.8 turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ドノマンティス->player_back_right root 85.2: branch - score -200.8 turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt attack:ヤンバル:wild_claw->ヤンバル root 62.4: branch - score -342 turn 9 / current player / HP player/cpu 8/10 / stones player/cpu 10/1 / deck player/cpu 17/17 / hand player/cpu 4/5
