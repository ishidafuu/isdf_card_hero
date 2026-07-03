# White Planner Response Probe

生成: 2026-07-03T23:15:30.332Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 80

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 6 | 0 | 0-0 | -405.8 | 980.4 | 2827.4 | 現行 white_planner |

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
| current | move:player_front_right->player_back_left | 1/333.6 | 2827.4 | - | -405.8 | turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 5/5 | 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: 移動は92点差で見送り、召喚は148点差で見送り |

Top evaluations:
- current: 333.6 move:player_front_right->player_back_left / 241.9 move:player_front_left->player_back_right / 185.3 summon:ボムゾウ->player_back_right / 183.1 summon:ボムゾウ->player_back_left / 85.2 summon:ドノマンティス->player_back_left
  - alt move:player_front_left->player_back_right root 241.9: branch - score -334 turn 9 / current player / HP player/cpu 6/10 / stones player/cpu 11/1 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ボムゾウ->player_back_right root 185.3: branch - score -194.8 turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ボムゾウ->player_back_left root 183.1: branch - score -136.8 turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ドノマンティス->player_back_left root 85.2: branch - score -142.8 turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ドノマンティス->player_back_right root 85.2: branch - score -200.8 turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt attack:ヤンバル:wild_claw->ヤンバル root 62.4: branch - score -342 turn 9 / current player / HP player/cpu 8/10 / stones player/cpu 10/1 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt move:player_front_right->player_back_right root 46: branch - score -367.8 turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 5/5
  - alt move:player_front_left->player_back_left root 42: branch - score -498 turn 9 / current player / HP player/cpu 6/10 / stones player/cpu 13/0 / deck player/cpu 17/17 / hand player/cpu 4/5

### seed 994306 challenger-as-player step 84

- turn: 8
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | attack:ヤンバル:wild_claw->デスシープ | 1/241.6 | 1670.7 | - | -405.8 | turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 5/5 | デスシープを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面267点、次点と174点差 |

Top evaluations:
- current: 241.6 attack:ヤンバル:wild_claw->デスシープ / 194.7 summon:デスシープ->player_front_right / 191.3 summon:ボムゾウ->player_front_right / 191.2 summon:ドノマンティス->player_front_right / 89.8 summon:デスシープ->player_back_right
  - alt summon:デスシープ->player_front_right root 194.7: branch - score -334 turn 9 / current player / HP player/cpu 6/10 / stones player/cpu 11/1 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ボムゾウ->player_front_right root 191.3: branch - score -334 turn 9 / current player / HP player/cpu 6/10 / stones player/cpu 11/1 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ドノマンティス->player_front_right root 191.2: branch - score -340 turn 9 / current player / HP player/cpu 6/10 / stones player/cpu 11/1 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:デスシープ->player_back_right root 89.8: branch - score -338.8 turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ボムゾウ->player_back_right root 87.8: branch - score -194.8 turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:ドノマンティス->player_back_right root 85.2: branch - score -200.8 turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 4/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt attack:ヤンバル:wild_claw->ヤンバル root 62.4: branch - score -342 turn 9 / current player / HP player/cpu 8/10 / stones player/cpu 10/1 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt focus:ヤンバル root 28: branch - score -354 turn 9 / current player / HP player/cpu 8/10 / stones player/cpu 10/1 / deck player/cpu 17/17 / hand player/cpu 4/5

### seed 994306 challenger-as-player step 86

- turn: 8
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 6/1 / deck player/cpu 18/18 / hand player/cpu 4/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP6 prep | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP4 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | master:master_attack->monster:cpu_front_right | 1/455.3 | 461 | - | -405.8 | turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 5/5 | ストーンに余裕があり敵を削れるためマスターアタック / ターンプラン探索: 返し込み最終盤面172点、次点と220点差 |

Top evaluations:
- current: 455.3 master:master_attack->monster:cpu_front_right / 80.2 summon:ドノマンティス->player_back_right / -35.2 summon:デスシープ->player_back_right / -55.3 end_turn
  - alt summon:ドノマンティス->player_back_right root 80.2: branch - score -350.8 turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:デスシープ->player_back_right root -35.2: branch - score -344.8 turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt end_turn root -55.3: branch - score -469 turn 9 / current player / HP player/cpu 8/10 / stones player/cpu 11/3 / deck player/cpu 17/17 / hand player/cpu 5/5

### seed 994306 challenger-as-player step 87

- turn: 8
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 3/1 / deck player/cpu 18/18 / hand player/cpu 4/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP6 prep | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP2 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | master:wake_up->monster:player_front_right | 1/706 | 514.4 | - | -405.8 | turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 5/5 | 準備中の味方を起こして敵を撃破できるためウェイクアップ / ターンプラン探索: 返し込み最終盤面211点、次点と142点差 |

Top evaluations:
- current: 706 master:wake_up->monster:player_front_right / 638.8 master:master_attack->monster:cpu_front_right / 458.7 summon:ドノマンティス->player_back_right / 343.3 summon:デスシープ->player_back_right / -54 end_turn
  - alt master:master_attack->monster:cpu_front_right root 638.8: branch - score -442.8 turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 5/5
  - alt summon:ドノマンティス->player_back_right root 458.7: branch - score -350.8 turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:デスシープ->player_back_right root 343.3: branch - score -344.8 turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt end_turn root -54: branch - score -450 turn 9 / current player / HP player/cpu 8/10 / stones player/cpu 8/1 / deck player/cpu 17/17 / hand player/cpu 5/5

### seed 994306 challenger-as-player step 88

- turn: 8
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 1/1 / deck player/cpu 18/18 / hand player/cpu 4/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP6 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP2 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | attack:ボムゾウ:self_bomb->デスシープ | 1/972.1 | 326.5 | - | -405.8 | turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 5/5 | 敵モンスターを撃破できるため攻撃 / ターンプラン探索: 返し込み最終盤面168点、次点と347点差 |

Top evaluations:
- current: 972.1 attack:ボムゾウ:self_bomb->デスシープ / 366.1 summon:ドノマンティス->player_back_right / 250.7 summon:デスシープ->player_back_right / 113.9 focus:ボムゾウ / -11.3 end_turn
  - alt summon:ドノマンティス->player_back_right root 366.1: branch - score -350.8 turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt summon:デスシープ->player_back_right root 250.7: branch - score -344.8 turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt focus:ボムゾウ root 113.9: branch - score -454 turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - alt end_turn root -11.3: branch - score -553 turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 7/2 / deck player/cpu 17/17 / hand player/cpu 5/5

### seed 994306 challenger-as-player step 90

- turn: 8
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 0/3 / deck player/cpu 18/18 / hand player/cpu 4/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:ボムゾウ Lv2 HP5 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/-27.8 | 82.6 | - | -405.8 | turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 6/1 / deck player/cpu 17/17 / hand player/cpu 5/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-197点 |

Top evaluations:
- current: -27.8 end_turn
