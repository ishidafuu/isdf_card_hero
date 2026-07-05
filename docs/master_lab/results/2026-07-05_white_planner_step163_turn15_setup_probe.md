# White Planner Response Probe

生成: 2026-07-05T00:11:17.504Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 40

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 1 | 0 | 0-0 | -570.8 | 681.9 | 681.9 | 現行 white_planner |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-0、平均score -570.8。
- 今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。

## Samples

### seed 994311 challenger-as-player step 163

- turn: 15
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 15 / current player / HP player/cpu 5/8 / stones player/cpu 13/1 / deck player/cpu 11/11 / hand player/cpu 5/5
- board: player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | master:master_attack->monster:cpu_front_right | 3/53.6 | 681.9 | - | -570.8 | turn 16 / current player / HP player/cpu 4/8 / stones player/cpu 4/3 / deck player/cpu 10/10 / hand player/cpu 5/5 | ストーンに余裕があり敵を削れるためマスターアタック / 見送り: マスター特技は176点差で見送り、召喚は269点差で見送り |

Top evaluations:
- current: 114 move:player_front_left->player_back_left / 114 move:player_front_left->player_back_right / 53.6 master:master_attack->monster:cpu_front_right / -66.9 end_turn / -122.4 master:master_attack->monster:cpu_front_left
  - alt move:player_front_left->player_back_left root 114: branch - score -570.8 turn 16 / current player / HP player/cpu 4/8 / stones player/cpu 4/3 / deck player/cpu 10/10 / hand player/cpu 5/5
  - alt move:player_front_left->player_back_right root 114: branch - score -608.8 turn 16 / current player / HP player/cpu 4/8 / stones player/cpu 4/3 / deck player/cpu 10/10 / hand player/cpu 5/5
  - alt end_turn root -66.9: branch - score -956 turn 16 / current player / HP player/cpu 3/8 / stones player/cpu 18/4 / deck player/cpu 10/10 / hand player/cpu 6/5
  - alt master:master_attack->monster:cpu_front_left root -122.4: branch - score -570.8 turn 16 / current player / HP player/cpu 4/8 / stones player/cpu 4/3 / deck player/cpu 10/10 / hand player/cpu 5/5
  - alt summon:真勇者ダイン->player_front_right root -215.2: branch - score -627.8 turn 16 / current player / HP player/cpu 4/8 / stones player/cpu 7/5 / deck player/cpu 10/10 / hand player/cpu 5/5
