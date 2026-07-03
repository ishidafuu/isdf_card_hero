# White Planner Response Probe

生成: 2026-07-03T18:11:16.217Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 30

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 3 | 0 | 0-1 | -333610 | 36.5 | 52.1 | 現行 white_planner |
| response2_width2 | 3 | 0 | 0-1 | -333610 | 40.6 | 53.1 | 相手応答を深さ2・幅2で読む |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-1、平均score -333610。
- 今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。

## Samples

### seed 994304 challenger-as-cpu step 240

- turn: 23
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 23 / current cpu / HP cpu/player 6/6 / stones cpu/player 5/5 / deck cpu/player 2/3 / hand cpu/player 6/4
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:デスシープ Lv1 HP6 prep | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/49.7 | 37.4 | - | -333 | turn 24 / current cpu / HP cpu/player 6/6 / stones cpu/player 8/8 / deck cpu/player 1/2 / hand cpu/player 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面13点 |
| response2_width2 | end_turn | 1/49.7 | 48.3 | - | -333 | turn 24 / current cpu / HP cpu/player 6/6 / stones cpu/player 8/8 / deck cpu/player 1/2 / hand cpu/player 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-29点 |

Top evaluations:
- current: 49.7 end_turn
- response2_width2: 49.7 end_turn

### seed 994304 challenger-as-cpu step 246

- turn: 25
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 25 / current cpu / HP cpu/player 5/6 / stones cpu/player 12/11 / deck cpu/player 0/1 / hand cpu/player 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/67.3 | 20.1 | - | -497 | turn 26 / current cpu / HP cpu/player 4/6 / stones cpu/player 16/14 / deck cpu/player 0/0 / hand cpu/player 5/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面29点 |
| response2_width2 | end_turn | 1/67.3 | 20.4 | - | -497 | turn 26 / current cpu / HP cpu/player 4/6 / stones cpu/player 16/14 / deck cpu/player 0/0 / hand cpu/player 5/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面29点 |

Top evaluations:
- current: 67.3 end_turn
- response2_width2: 67.3 end_turn

### seed 994304 challenger-as-cpu step 252

- turn: 27
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 27 / current cpu / HP cpu/player 1/5 / stones cpu/player 22/18 / deck cpu/player 0/0 / hand cpu/player 5/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/44.1 | 52.1 | player | -1000000 | turn 28 / current cpu / HP cpu/player 0/4 / stones cpu/player 26/22 / deck cpu/player 0/0 / hand cpu/player 5/5 | 有効な行動がないためターン終了 / 見送り: 攻撃は220点差で見送り、攻撃は308点差で見送り |
| response2_width2 | end_turn | 1/44.1 | 53.1 | player | -1000000 | turn 28 / current cpu / HP cpu/player 0/4 / stones cpu/player 26/22 / deck cpu/player 0/0 / hand cpu/player 5/5 | 有効な行動がないためターン終了 / 見送り: 攻撃は220点差で見送り、攻撃は308点差で見送り |

Top evaluations:
- current: 44.1 end_turn / 30.7 attack:真勇者ダイン:ダイン斬り->ドノマンティス / -289.8 attack:真勇者ダイン:ダイン斬り->player master
- response2_width2: 44.1 end_turn / 30.7 attack:真勇者ダイン:ダイン斬り->ドノマンティス / -289.8 attack:真勇者ダイン:ダイン斬り->player master


