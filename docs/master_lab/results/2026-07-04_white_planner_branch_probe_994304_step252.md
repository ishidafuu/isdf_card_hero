# White Planner Response Probe

生成: 2026-07-03T18:18:44.580Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 30

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 1 | 0 | 0-1 | -1000000 | 54.3 | 54.3 | 現行 white_planner |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-1、平均score -1000000。
- 今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。

## Samples

### seed 994304 challenger-as-cpu step 252

- turn: 27
- plannerSide: cpu
- currentPlayer: cpu
- plannerTurn: Y
- state: turn 27 / current cpu / HP cpu/player 1/5 / stones cpu/player 22/18 / deck cpu/player 0/0 / hand cpu/player 5/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/44.1 | 54.3 | player | -1000000 | turn 28 / current cpu / HP cpu/player 0/4 / stones cpu/player 26/22 / deck cpu/player 0/0 / hand cpu/player 5/5 | 有効な行動がないためターン終了 / 見送り: 攻撃は220点差で見送り、攻撃は308点差で見送り |

Top evaluations:
- current: 44.1 end_turn / 30.7 attack:真勇者ダイン:ダイン斬り->ドノマンティス / -289.8 attack:真勇者ダイン:ダイン斬り->player master
  - alt attack:真勇者ダイン:ダイン斬り->ドノマンティス root 30.7: branch player score -1000000 turn 28 / current cpu / HP cpu/player 0/4 / stones cpu/player 25/23 / deck cpu/player 0/0 / hand cpu/player 5/5
  - alt attack:真勇者ダイン:ダイン斬り->player master root -289.8: branch player score -1000000 turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5


