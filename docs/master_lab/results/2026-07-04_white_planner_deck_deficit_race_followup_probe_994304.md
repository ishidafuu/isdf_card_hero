# White Planner Response Probe

生成: 2026-07-03T22:43:17.800Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 120

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 4 | 0 | 0-1 | -250298 | 8.8 | 20.3 | 現行 white_planner |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-1、平均score -250298。
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
| current | attack:真勇者ダイン:ダイン斬り->player master | 2/-375.7 | 0.1 | - | -321 | turn 25 / current cpu / HP cpu/player 5/5 / stones cpu/player 12/12 / deck cpu/player 0/1 / hand cpu/player 6/5 | ターン開始時の最大打点1点で詰めろを作れるため攻撃 |

Top evaluations:
- current: 0 end_turn / -375.7 attack:真勇者ダイン:ダイン斬り->player master
  - alt end_turn root 0: branch - score -402 turn 25 / current cpu / HP cpu/player 5/6 / stones cpu/player 12/11 / deck cpu/player 0/1 / hand cpu/player 6/5

### seed 994304 challenger-as-cpu step 246

- turn: 25
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 25 / current cpu / HP cpu/player 5/5 / stones cpu/player 12/12 / deck cpu/player 0/1 / hand cpu/player 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/66 | 20.3 | - | -416 | turn 26 / current cpu / HP cpu/player 4/5 / stones cpu/player 16/15 / deck cpu/player 0/0 / hand cpu/player 5/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面29点 |

Top evaluations:
- current: 66 end_turn

### seed 994304 challenger-as-cpu step 248

- turn: 26
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 26 / current cpu / HP cpu/player 4/5 / stones cpu/player 16/15 / deck cpu/player 0/0 / hand cpu/player 5/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | attack:真勇者ダイン:ダイン斬り->player master | 2/-358.4 | 0.1 | - | -455 | turn 27 / current cpu / HP cpu/player 1/3 / stones cpu/player 22/20 / deck cpu/player 0/0 / hand cpu/player 5/5 | ターン開始時の最大打点1点で詰めろを作れるため攻撃 |

Top evaluations:
- current: 65.7 end_turn / -358.4 attack:真勇者ダイン:ダイン斬り->player master
  - alt end_turn root 65.7: branch - score -518 turn 27 / current cpu / HP cpu/player 1/4 / stones cpu/player 22/19 / deck cpu/player 0/0 / hand cpu/player 5/5

### seed 994304 challenger-as-cpu step 253

- turn: 27
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 27 / current cpu / HP cpu/player 1/3 / stones cpu/player 22/20 / deck cpu/player 0/0 / hand cpu/player 5/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/139.6 | 14.7 | player | -1000000 | turn 28 / current cpu / HP cpu/player 0/2 / stones cpu/player 26/24 / deck cpu/player 0/0 / hand cpu/player 5/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-749571点 |

Top evaluations:
- current: 139.6 end_turn
