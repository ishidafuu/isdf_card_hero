# White Planner Response Probe

生成: 2026-07-03T19:13:10.683Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 30

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 2 | 0 | 0-0 | -635 | 28.3 | 49.4 | 現行 white_planner |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-0、平均score -635。
- 今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。

## Samples

### seed 994302 challenger-as-player step 247

- turn: 24
- plannerSide: player
- currentPlayer: cpu
- plannerTurn: N
- state: turn 24 / current cpu / HP player/cpu 3/7 / stones player/cpu 15/5 / deck player/cpu 2/1 / hand player/cpu 5/6
- board: player_front_left:PF:デスシープ Lv2 HP3 act1/1 | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv2 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | attack:デスシープ:attack->デスシープ | 1/707.9 | 49.4 | - | -635 | turn 25 / current player / HP player/cpu 3/7 / stones player/cpu 20/3 / deck player/cpu 1/1 / hand player/cpu 6/5 | 敵モンスターを撃破できるため攻撃 / 見送り: 攻撃は660点差で見送り |

Top evaluations:
- current: 707.9 attack:デスシープ:attack->デスシープ / 47.4 attack:デスシープ:attack->player master / -257 end_turn
  - alt attack:デスシープ:attack->player master root 47.4: branch - score -568 turn 25 / current player / HP player/cpu 2/7 / stones player/cpu 19/3 / deck player/cpu 1/1 / hand player/cpu 6/5
  - alt end_turn root -257: branch - score -515 turn 25 / current player / HP player/cpu 3/7 / stones player/cpu 18/5 / deck player/cpu 1/1 / hand player/cpu 6/5

### seed 994302 challenger-as-player step 248

- turn: 24
- plannerSide: player
- currentPlayer: cpu
- plannerTurn: N
- state: turn 24 / current cpu / HP player/cpu 3/7 / stones player/cpu 17/5 / deck player/cpu 2/1 / hand player/cpu 5/6
- board: player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | master:shield->monster:cpu_front_right | 1/148.8 | 7.2 | - | -635 | turn 25 / current player / HP player/cpu 3/7 / stones player/cpu 20/3 / deck player/cpu 1/1 / hand player/cpu 6/5 | 致死圏の味方を守れるためシールド |

Top evaluations:
- current: 148.8 master:shield->monster:cpu_front_right / 0 end_turn
  - alt end_turn root 0: branch - score -633 turn 25 / current player / HP player/cpu 3/7 / stones player/cpu 20/5 / deck player/cpu 1/1 / hand player/cpu 6/5


