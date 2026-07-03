# White Planner Response Probe

生成: 2026-07-03T22:27:31.874Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 120

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 1 | 0 | 0-0 | -321 | 1.2 | 1.2 | 現行 white_planner |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-0、平均score -321。
- 今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。

## Samples

### seed 994304 challenger-as-cpu step 242

- turn: 24
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 24 / current cpu / HP cpu/player 6/6 / stones cpu/player 8/8 / deck cpu/player 1/2 / hand cpu/player 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | attack:真勇者ダイン:ダイン斬り->player master | 2/-375.7 | 1.2 | - | -321 | turn 25 / current cpu / HP cpu/player 5/5 / stones cpu/player 12/12 / deck cpu/player 0/1 / hand cpu/player 6/5 | ターン開始時の最大打点1点で詰めろを作れるため攻撃 |

Top evaluations:
- current: 0 end_turn / -375.7 attack:真勇者ダイン:ダイン斬り->player master
  - alt end_turn root 0: branch - score -402 turn 25 / current cpu / HP cpu/player 5/6 / stones cpu/player 12/11 / deck cpu/player 0/1 / hand cpu/player 6/5
