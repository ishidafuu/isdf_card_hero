# White Planner Response Probe

生成: 2026-07-03T22:24:51.354Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 120

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 9 | 0 | 0-1 | -111457.4 | 315.5 | 1384.8 | 現行 white_planner |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-1、平均score -111457.4。
- 今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。

## Samples

### seed 994304 challenger-as-cpu step 229

- turn: 22
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 22 / current cpu / HP cpu/player 6/6 / stones cpu/player 6/4 / deck cpu/player 3/4 / hand cpu/player 6/5
- board: player_front_left:PF:ボムゾウ Lv2 HP2 act1/1 shield | player_front_right:PF:ピグミィ Lv1 HP3 act2/2 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | attack:真勇者ダイン:ダイン斬り->ボムゾウ | 1/460.8 | 947.2 | - | -270.8 | turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 5/5 / deck cpu/player 2/3 / hand cpu/player 6/4 | ボムゾウを削れるため攻撃 / 見送り: 召喚は94点差で見送り、召喚は212点差で見送り |

Top evaluations:
- current: 460.8 attack:真勇者ダイン:ダイン斬り->ボムゾウ / 366.5 summon:ヤンバル->cpu_back_left / 313.3 summon:ヤンバル->cpu_back_right / 239.7 focus:真勇者ダイン / 58.1 end_turn
  - alt summon:ヤンバル->cpu_back_left root 366.5: branch - score -361.8 turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 4/1 / deck cpu/player 2/3 / hand cpu/player 6/4
  - alt summon:ヤンバル->cpu_back_right root 313.3: branch - score -300.8 turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 3/5 / deck cpu/player 2/3 / hand cpu/player 6/4
  - alt focus:真勇者ダイン root 239.7: branch - score -305.8 turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 4/5 / deck cpu/player 2/3 / hand cpu/player 6/3
  - alt end_turn root 58.1: branch - score -592 turn 23 / current cpu / HP cpu/player 5/6 / stones cpu/player 11/5 / deck cpu/player 2/3 / hand cpu/player 6/5
  - alt summon:ヤンバル->cpu_front_right root 49.6: branch - score -287.8 turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 3/5 / deck cpu/player 2/3 / hand cpu/player 6/4
  - alt master:master_attack->monster:player_front_right root -1: branch - score -305.8 turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 4/5 / deck cpu/player 2/3 / hand cpu/player 6/3

### seed 994304 challenger-as-cpu step 230

- turn: 22
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 22 / current cpu / HP cpu/player 6/6 / stones cpu/player 6/4 / deck cpu/player 3/4 / hand cpu/player 6/5
- board: player_front_left:PF:ボムゾウ Lv2 HP1 act1/1 shield | player_front_right:PF:ピグミィ Lv1 HP3 act2/2 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | master:master_attack->monster:player_front_left | 1/545.2 | 1384.8 | - | -270.8 | turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 5/5 / deck cpu/player 2/3 / hand cpu/player 6/4 | マスターアタックで敵モンスターを撃破できるため使用 / ターンプラン探索: 返し込み最終盤面168点、次点と55点差 |

Top evaluations:
- current: 545.2 master:master_attack->monster:player_front_left / 537.3 summon:ヤンバル->cpu_back_left / 479 summon:ヤンバル->cpu_front_right / 477.9 summon:ヤンバル->cpu_back_right / -1 master:master_attack->monster:player_front_right
  - alt summon:ヤンバル->cpu_back_left root 537.3: branch - score -361.8 turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 4/1 / deck cpu/player 2/3 / hand cpu/player 6/4
  - alt summon:ヤンバル->cpu_front_right root 479: branch - score -287.8 turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 3/5 / deck cpu/player 2/3 / hand cpu/player 6/4
  - alt summon:ヤンバル->cpu_back_right root 477.9: branch - score -300.8 turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 3/5 / deck cpu/player 2/3 / hand cpu/player 6/4
  - alt master:master_attack->monster:player_front_right root -1: branch - score -361.8 turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 4/1 / deck cpu/player 2/3 / hand cpu/player 6/4
  - alt end_turn root -78.1: branch - score -640 turn 23 / current cpu / HP cpu/player 5/6 / stones cpu/player 11/2 / deck cpu/player 2/3 / hand cpu/player 6/4

### seed 994304 challenger-as-cpu step 231

- turn: 22
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 22 / current cpu / HP cpu/player 6/6 / stones cpu/player 3/6 / deck cpu/player 3/4 / hand cpu/player 6/5
- board: player_front_right:PF:ピグミィ Lv1 HP3 act2/2 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | summon:ヤンバル->cpu_back_left | 1/146.4 | 327.4 | - | -270.8 | turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 5/5 / deck cpu/player 2/3 / hand cpu/player 6/4 | 後衛カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面16点、次点と37点差 |

Top evaluations:
- current: 146.4 summon:ヤンバル->cpu_back_left / 93.2 summon:ヤンバル->cpu_back_right / 55.4 summon:ヤンバル->cpu_front_right / -9.5 master:master_attack->monster:player_front_right / -26.8 end_turn
  - alt summon:ヤンバル->cpu_back_right root 93.2: branch - score -308.8 turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 5/5 / deck cpu/player 2/3 / hand cpu/player 6/4
  - alt summon:ヤンバル->cpu_front_right root 55.4: branch - score -308.8 turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 5/5 / deck cpu/player 2/3 / hand cpu/player 6/4
  - alt master:master_attack->monster:player_front_right root -9.5: branch - score -397.8 turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 3/5 / deck cpu/player 2/3 / hand cpu/player 6/4
  - alt end_turn root -26.8: branch - score -394.8 turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 6/5 / deck cpu/player 2/3 / hand cpu/player 6/4

### seed 994304 challenger-as-cpu step 240

- turn: 23
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 5/5 / deck cpu/player 2/3 / hand cpu/player 6/4
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:デスシープ Lv1 HP6 prep | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/49.7 | 41.5 | - | -333 | turn 24 / current cpu / HP cpu/player 6/6 / stones cpu/player 8/8 / deck cpu/player 1/2 / hand cpu/player 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面13点 |

Top evaluations:
- current: 49.7 end_turn

### seed 994304 challenger-as-cpu step 242

- turn: 24
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 24 / current cpu / HP cpu/player 6/6 / stones cpu/player 8/8 / deck cpu/player 1/2 / hand cpu/player 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/0 | 69.4 | - | -402 | turn 25 / current cpu / HP cpu/player 5/6 / stones cpu/player 12/11 / deck cpu/player 0/1 / hand cpu/player 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面75点 |

Top evaluations:
- current: 0 end_turn / -375.7 attack:真勇者ダイン:ダイン斬り->player master
  - alt attack:真勇者ダイン:ダイン斬り->player master root -375.7: branch - score -321 turn 25 / current cpu / HP cpu/player 5/5 / stones cpu/player 12/12 / deck cpu/player 0/1 / hand cpu/player 6/5

### seed 994304 challenger-as-cpu step 246

- turn: 25
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 25 / current cpu / HP cpu/player 5/6 / stones cpu/player 12/11 / deck cpu/player 0/1 / hand cpu/player 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/67.3 | 21.5 | - | -497 | turn 26 / current cpu / HP cpu/player 4/6 / stones cpu/player 16/14 / deck cpu/player 0/0 / hand cpu/player 5/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面29点 |

Top evaluations:
- current: 67.3 end_turn

### seed 994304 challenger-as-cpu step 248

- turn: 26
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 26 / current cpu / HP cpu/player 4/6 / stones cpu/player 16/14 / deck cpu/player 0/0 / hand cpu/player 5/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | attack:真勇者ダイン:ダイン斬り->player master | 2/-343.7 | 1.5 | - | -536 | turn 27 / current cpu / HP cpu/player 1/4 / stones cpu/player 22/19 / deck cpu/player 0/0 / hand cpu/player 5/5 | ターン開始時の最大打点1点で詰めろを作れるため攻撃 |

Top evaluations:
- current: 64.7 end_turn / -343.7 attack:真勇者ダイン:ダイン斬り->player master
  - alt end_turn root 64.7: branch - score -599 turn 27 / current cpu / HP cpu/player 1/5 / stones cpu/player 22/18 / deck cpu/player 0/0 / hand cpu/player 5/5

### seed 994304 challenger-as-cpu step 249

- turn: 26
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 26 / current cpu / HP cpu/player 4/5 / stones cpu/player 16/15 / deck cpu/player 0/0 / hand cpu/player 5/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/66 | 31 | - | -536 | turn 27 / current cpu / HP cpu/player 1/4 / stones cpu/player 22/19 / deck cpu/player 0/0 / hand cpu/player 5/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面78点 |

Top evaluations:
- current: 66 end_turn

### seed 994304 challenger-as-cpu step 253

- turn: 27
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 27 / current cpu / HP cpu/player 1/4 / stones cpu/player 22/19 / deck cpu/player 0/0 / hand cpu/player 5/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/139.9 | 14.8 | player | -1000000 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-749511点 |

Top evaluations:
- current: 139.9 end_turn
