# White Planner Response Probe

生成: 2026-07-03T20:08:39.813Z
deck: `master-lab-white-1377-death-sheep3`
maxReplaySteps: 90

## Summary

| candidate | samples | changed | W-L | avg score | avg ms | max ms | note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| current | 2 | 0 | 0-0 | -417.5 | 97.4 | 132.5 | 現行 white_planner |
| response2_width2 | 2 | 0 | 0-0 | -417.5 | 108.6 | 154.2 | 相手応答を深さ2・幅2で読む |
| response2_width3 | 2 | 0 | 0-0 | -417.5 | 137.6 | 180.5 | 相手応答を深さ2・幅3で読む |
| response2_width2_weight075 | 2 | 0 | 0-0 | -417.5 | 108.9 | 155.5 | 相手応答2x2をやや強く反映する |
| terminal6_response2_width2 | 2 | 0 | 0-0 | -417.5 | 108.3 | 153.9 | 自ターン終端深さ6 + 相手応答2x2 |
| deckout_loose_override | 2 | 0 | 0-0 | -417.5 | 95 | 133.4 | 終盤検証用にターンプラン採用ゲートを緩める |
| terminal_compare1 | 2 | 0 | 0-0 | -417.5 | 94.9 | 131.7 | 終端盤面差を局所評価へ弱めに戻す |
| terminal_compare1_loose | 2 | 0 | 0-0 | -417.5 | 96.8 | 136.8 | 終端盤面差を局所評価へ戻し、採用ゲートも緩める |

## Conclusion

- 終盤局面の軽量分岐では best=current、W-L 0-0、平均score -417.5。
- 今回の局面では現行設定を上回る応答幅候補は見えない。幅拡張のデフォルト採用は見送り、局面抽出を増やす。

## Samples

### seed 994302 challenger-as-player step 233

- turn: 22
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 22 / current player / HP player/cpu 4/7 / stones player/cpu 7/4 / deck player/cpu 4/4 / hand player/cpu 6/5
- board: player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:デスシープ Lv2 HP6 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv2 HP3 act0/1 focus,shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/152.2 | 132.5 | - | -354 | turn 23 / current player / HP player/cpu 3/7 / stones player/cpu 11/5 / deck player/cpu 3/3 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面178点、次点と3点差 |
| response2_width2 | end_turn | 1/152.2 | 154.2 | - | -354 | turn 23 / current player / HP player/cpu 3/7 / stones player/cpu 11/5 / deck player/cpu 3/3 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / 見送り: 攻撃は65点差で見送り、攻撃は92点差で見送り |
| response2_width3 | end_turn | 1/152.2 | 180.5 | - | -354 | turn 23 / current player / HP player/cpu 3/7 / stones player/cpu 11/5 / deck player/cpu 3/3 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / 見送り: 攻撃は60点差で見送り、攻撃は87点差で見送り |
| response2_width2_weight075 | end_turn | 1/152.2 | 155.5 | - | -354 | turn 23 / current player / HP player/cpu 3/7 / stones player/cpu 11/5 / deck player/cpu 3/3 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / 見送り: 攻撃は35点差で見送り、攻撃は76点差で見送り |
| terminal6_response2_width2 | end_turn | 1/152.2 | 153.9 | - | -354 | turn 23 / current player / HP player/cpu 3/7 / stones player/cpu 11/5 / deck player/cpu 3/3 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / 見送り: 攻撃は65点差で見送り、攻撃は92点差で見送り |
| deckout_loose_override | end_turn | 1/152.2 | 133.4 | - | -354 | turn 23 / current player / HP player/cpu 3/7 / stones player/cpu 11/5 / deck player/cpu 3/3 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面178点、次点と3点差 |
| terminal_compare1 | end_turn | 1/121.7 | 131.7 | - | -354 | turn 23 / current player / HP player/cpu 3/7 / stones player/cpu 11/5 / deck player/cpu 3/3 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面178点、次点と3点差 |
| terminal_compare1_loose | end_turn | 1/121.7 | 136.8 | - | -354 | turn 23 / current player / HP player/cpu 3/7 / stones player/cpu 11/5 / deck player/cpu 3/3 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面178点、次点と3点差 |

Top evaluations:
- current: 152.2 end_turn / -6.8 attack:ピグミィ:attack->デスシープ / -112.3 attack:デスシープ:attack->cpu master
  - alt attack:ピグミィ:attack->デスシープ root -6.8: branch - score -303 turn 23 / current player / HP player/cpu 4/7 / stones player/cpu 10/5 / deck player/cpu 3/3 / hand player/cpu 6/5
  - alt attack:デスシープ:attack->cpu master root -112.3: branch - score -232 turn 23 / current player / HP player/cpu 4/6 / stones player/cpu 8/6 / deck player/cpu 3/3 / hand player/cpu 6/5
- response2_width2: 152.2 end_turn / -6.8 attack:ピグミィ:attack->デスシープ / -112.3 attack:デスシープ:attack->cpu master
  - alt attack:ピグミィ:attack->デスシープ root -6.8: branch - score -303 turn 23 / current player / HP player/cpu 4/7 / stones player/cpu 10/5 / deck player/cpu 3/3 / hand player/cpu 6/5
  - alt attack:デスシープ:attack->cpu master root -112.3: branch - score -232 turn 23 / current player / HP player/cpu 4/6 / stones player/cpu 8/6 / deck player/cpu 3/3 / hand player/cpu 6/5
- response2_width3: 152.2 end_turn / -6.8 attack:ピグミィ:attack->デスシープ / -112.3 attack:デスシープ:attack->cpu master
  - alt attack:ピグミィ:attack->デスシープ root -6.8: branch - score -303 turn 23 / current player / HP player/cpu 4/7 / stones player/cpu 10/5 / deck player/cpu 3/3 / hand player/cpu 6/5
  - alt attack:デスシープ:attack->cpu master root -112.3: branch - score -232 turn 23 / current player / HP player/cpu 4/6 / stones player/cpu 8/6 / deck player/cpu 3/3 / hand player/cpu 6/5
- response2_width2_weight075: 152.2 end_turn / -6.8 attack:ピグミィ:attack->デスシープ / -112.3 attack:デスシープ:attack->cpu master
  - alt attack:ピグミィ:attack->デスシープ root -6.8: branch - score -303 turn 23 / current player / HP player/cpu 4/7 / stones player/cpu 10/5 / deck player/cpu 3/3 / hand player/cpu 6/5
  - alt attack:デスシープ:attack->cpu master root -112.3: branch - score -232 turn 23 / current player / HP player/cpu 4/6 / stones player/cpu 8/6 / deck player/cpu 3/3 / hand player/cpu 6/5
- terminal6_response2_width2: 152.2 end_turn / -6.8 attack:ピグミィ:attack->デスシープ / -112.3 attack:デスシープ:attack->cpu master
  - alt attack:ピグミィ:attack->デスシープ root -6.8: branch - score -303 turn 23 / current player / HP player/cpu 4/7 / stones player/cpu 10/5 / deck player/cpu 3/3 / hand player/cpu 6/5
  - alt attack:デスシープ:attack->cpu master root -112.3: branch - score -232 turn 23 / current player / HP player/cpu 4/6 / stones player/cpu 8/6 / deck player/cpu 3/3 / hand player/cpu 6/5
- deckout_loose_override: 152.2 end_turn / -6.8 attack:ピグミィ:attack->デスシープ / -112.3 attack:デスシープ:attack->cpu master
  - alt attack:ピグミィ:attack->デスシープ root -6.8: branch - score -303 turn 23 / current player / HP player/cpu 4/7 / stones player/cpu 10/5 / deck player/cpu 3/3 / hand player/cpu 6/5
  - alt attack:デスシープ:attack->cpu master root -112.3: branch - score -232 turn 23 / current player / HP player/cpu 4/6 / stones player/cpu 8/6 / deck player/cpu 3/3 / hand player/cpu 6/5
- terminal_compare1: 121.7 end_turn / -41.8 attack:ピグミィ:attack->デスシープ / -112.3 attack:デスシープ:attack->cpu master
  - alt attack:ピグミィ:attack->デスシープ root -41.8: branch - score -303 turn 23 / current player / HP player/cpu 4/7 / stones player/cpu 10/5 / deck player/cpu 3/3 / hand player/cpu 6/5
  - alt attack:デスシープ:attack->cpu master root -112.3: branch - score -232 turn 23 / current player / HP player/cpu 4/6 / stones player/cpu 8/6 / deck player/cpu 3/3 / hand player/cpu 6/5
- terminal_compare1_loose: 121.7 end_turn / -41.8 attack:ピグミィ:attack->デスシープ / -112.3 attack:デスシープ:attack->cpu master
  - alt attack:ピグミィ:attack->デスシープ root -41.8: branch - score -303 turn 23 / current player / HP player/cpu 4/7 / stones player/cpu 10/5 / deck player/cpu 3/3 / hand player/cpu 6/5
  - alt attack:デスシープ:attack->cpu master root -112.3: branch - score -232 turn 23 / current player / HP player/cpu 4/6 / stones player/cpu 8/6 / deck player/cpu 3/3 / hand player/cpu 6/5

### seed 994302 challenger-as-player step 238

- turn: 23
- plannerSide: player
- currentPlayer: player
- plannerTurn: Y
- state: turn 23 / current player / HP player/cpu 3/7 / stones player/cpu 11/5 / deck player/cpu 3/3 / hand player/cpu 6/5
- board: player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:デスシープ Lv2 HP6 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act0/1 focus,shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 focus

| candidate | decision | root | ms | branch winner | branch score | branch state | reason |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| current | end_turn | 1/122.7 | 62.2 | - | -481 | turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面135点 |
| response2_width2 | end_turn | 1/122.7 | 62.9 | - | -481 | turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面114点 |
| response2_width3 | end_turn | 1/122.7 | 94.6 | - | -481 | turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面94点 |
| response2_width2_weight075 | end_turn | 1/122.7 | 62.3 | - | -481 | turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面91点 |
| terminal6_response2_width2 | end_turn | 1/122.7 | 62.6 | - | -481 | turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面114点 |
| deckout_loose_override | end_turn | 1/122.7 | 56.6 | - | -481 | turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面135点 |
| terminal_compare1 | end_turn | 1/122.7 | 58.1 | - | -481 | turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面135点 |
| terminal_compare1_loose | end_turn | 1/122.7 | 56.7 | - | -481 | turn 24 / current player / HP player/cpu 3/7 / stones player/cpu 15/2 / deck player/cpu 2/2 / hand player/cpu 6/5 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面135点 |

Top evaluations:
- current: 122.7 end_turn / -173.6 attack:デスシープ:attack->cpu master
  - alt attack:デスシープ:attack->cpu master root -173.6: branch - score -418 turn 24 / current player / HP player/cpu 3/6 / stones player/cpu 15/3 / deck player/cpu 2/2 / hand player/cpu 6/5
- response2_width2: 122.7 end_turn / -173.6 attack:デスシープ:attack->cpu master
  - alt attack:デスシープ:attack->cpu master root -173.6: branch - score -418 turn 24 / current player / HP player/cpu 3/6 / stones player/cpu 15/3 / deck player/cpu 2/2 / hand player/cpu 6/5
- response2_width3: 122.7 end_turn / -173.6 attack:デスシープ:attack->cpu master
  - alt attack:デスシープ:attack->cpu master root -173.6: branch - score -418 turn 24 / current player / HP player/cpu 3/6 / stones player/cpu 15/3 / deck player/cpu 2/2 / hand player/cpu 6/5
- response2_width2_weight075: 122.7 end_turn / -173.6 attack:デスシープ:attack->cpu master
  - alt attack:デスシープ:attack->cpu master root -173.6: branch - score -418 turn 24 / current player / HP player/cpu 3/6 / stones player/cpu 15/3 / deck player/cpu 2/2 / hand player/cpu 6/5
- terminal6_response2_width2: 122.7 end_turn / -173.6 attack:デスシープ:attack->cpu master
  - alt attack:デスシープ:attack->cpu master root -173.6: branch - score -418 turn 24 / current player / HP player/cpu 3/6 / stones player/cpu 15/3 / deck player/cpu 2/2 / hand player/cpu 6/5
- deckout_loose_override: 122.7 end_turn / -173.6 attack:デスシープ:attack->cpu master
  - alt attack:デスシープ:attack->cpu master root -173.6: branch - score -418 turn 24 / current player / HP player/cpu 3/6 / stones player/cpu 15/3 / deck player/cpu 2/2 / hand player/cpu 6/5
- terminal_compare1: 122.7 end_turn / -176.6 attack:デスシープ:attack->cpu master
  - alt attack:デスシープ:attack->cpu master root -176.6: branch - score -418 turn 24 / current player / HP player/cpu 3/6 / stones player/cpu 15/3 / deck player/cpu 2/2 / hand player/cpu 6/5
- terminal_compare1_loose: 122.7 end_turn / -176.6 attack:デスシープ:attack->cpu master
  - alt attack:デスシープ:attack->cpu master root -176.6: branch - score -418 turn 24 / current player / HP player/cpu 3/6 / stones player/cpu 15/3 / deck player/cpu 2/2 / hand player/cpu 6/5


