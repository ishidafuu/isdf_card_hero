# White Planner Response Probe

生成: 2026-07-03T23:27:06.650Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 60

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| terminal_compare1 | 1 | 0 | 0-0 | -405.8 | 2784.7 | 2784.7 | 終端盤面差を局所評価へ弱めに戻す |

## Conclusion

- 監査対象が不足している。

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
| terminal_compare1 | move:player_front_right->player_back_left | 1/326.4 | 2784.7 | - | -405.8 | turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 5/5 | 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: 移動は92点差で見送り、召喚は148点差で見送り |

Top evaluations:
- terminal_compare1: 326.4 move:player_front_right->player_back_left / 234.7 move:player_front_left->player_back_right / 185.3 summon:ボムゾウ->player_back_right / 183.1 summon:ボムゾウ->player_back_left / 85.2 summon:ドノマンティス->player_back_left
  - alt move:player_front_left->player_back_right root 234.7: branch - score -334 turn 9 / current player / HP player/cpu 6/10 / stones player/cpu 11/1 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ボムゾウ->player_back_right root 185.3: branch - score -442.8 turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 5/5
  - alt summon:ボムゾウ->player_back_left root 183.1: branch - score -136.8 turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ドノマンティス->player_back_left root 85.2: branch - score -142.8 turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ドノマンティス->player_back_right root 85.2: branch - score -448.8 turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 5/5
