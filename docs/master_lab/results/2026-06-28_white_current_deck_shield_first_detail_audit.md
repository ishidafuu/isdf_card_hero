# White AI Action Order Audit

生成: 2026-06-28T00:10:50.177Z
候補: `current_white_baseline`
相手: black_pressure_strong, black_1375_pressure, white_current_mirror
seed: 83100-83103 / 各seat
close margin: 20

## Conclusion

- current_white_baseline: シールド 42件中、同一対象の後退候補あり 0件、後退が上回ったもの 0件、同ターン shield->retreat 0件。
- current_white_baseline: サンプル採取のため 1ゲームを途中終了。勝率ではなく行動例の監査として読む。
- current_white_baseline: turn order は shield含み 38/87ターン、shield先行後にattack/wake 0件、attack/wake後にshield 30件、wake後attack 14件。

## Summary

| Variant | W-L-D | Steps | Turns | Shield | Shield Turns | Shield First | Shield Then Work | Work Then Shield | Retreat Alt | Shield->Retreat | Shield Attack Higher/Close | Shield Wake Higher/Close | Wake | Wake Attack Higher/Close | Wake Then Attack |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 1-4-0 (+1 partial) | 395 | 87 | 42 (10.6%) | 38 (43.7%) | 4 (10.5%) | 0 (0%) | 30 (78.9%) | 0 (0%) | 0 (0%) | 0 (0%) / 0 (0%) | 0 (0%) / 0 (0%) | 16 (4.1%) | 0 (0%) / 0 (0%) | 14 (16.1%) |

## Samples

### current_white_baseline

- shield_first_turn: seed 83103 / black_pressure_strong / player / turn 11 step 98 / ヤンバル player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score -65.5
  - selected reason: 倒されそうな高価値味方を守るためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_front `master:shield->monster:player_front_left` score -65.5 / 倒されそうな高価値味方を守るためシールド
    - end_turn `end_turn` score -146.3 / 有効な行動がないためターン終了
  - state: HP P/C 7/4 / stones P/C 8/1 / hand P/C 6/5
  - board: cpu_front_left:CF:ファントム Lv1 HP5 prep | player_front_left:PF:ヤンバル Lv1 HP1 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_right:PB:ピグミィ Lv2 HP1 act0/2 [focus]
- shield_first_turn: seed 83103 / black_pressure_strong / player / turn 18 step 145 / ピグミィ player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score 44.1
  - selected reason: 致死圏の味方を守れるためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_front `master:shield->monster:player_front_left` score 44.1 / 致死圏の味方を守れるためシールド
    - end_turn `end_turn` score -851637.1 / 有効な行動がないためターン終了
  - state: HP P/C 2/2 / stones P/C 33/1 / hand P/C 6/5
  - board: cpu_back_left:CB:フーヨウ Lv2 HP3 act1/1 [focus] | cpu_back_right:CB:ヴァルテル Lv1 HP1 act1/1 [focus] | cpu_front_left:CF:ファントム Lv2 HP3 act1/1 [focus] | cpu_front_right:CF:ナッツロックル Lv1 HP4 act1/1 | player_front_left:PF:ピグミィ Lv1 HP3 act0/2
- shield_first_turn: seed 83100 / black_pressure_strong / cpu / turn 18 step 149 / デスシープ cpu_front_right
  - selected: master:shield:own_front `master:shield->monster:cpu_front_right` score 154.7
  - selected reason: 致死圏の味方を守れるためシールド / 見送り: マジックは64点差で見送り、マジックは64点差で見送り
  - alternatives: master_action 1, magic 2, end_turn 1
  - top alternatives:
    - master:shield:own_front `master:shield->monster:cpu_front_right` score 154.7 / 致死圏の味方を守れるためシールド
    - magic `magic:cpu_card_031_1->monster:player_front_left` score 91.1 / ワープで追加対象も有効にできるため使用
    - magic `magic:cpu_card_031_1->monster:player_back_left` score 91.1 / ワープで追加対象も有効にできるため使用
    - end_turn `end_turn` score -65.8 / 有効な行動がないためターン終了
  - state: HP P/C 2/5 / stones P/C 4/22 / hand P/C 5/6
  - board: cpu_front_right:CF:デスシープ Lv1 HP4 act0/1 | player_front_left:PF:ヒートロン Lv1 HP4 act1/1 | player_back_left:PB:フーヨウ Lv1 HP3 act1/1
- shield_first_turn: seed 83101 / black_pressure_strong / cpu / turn 11 step 80 / ポリスピナー cpu_front_left
  - selected: master:shield:own_front `master:shield->monster:cpu_front_left` score -699542.4
  - selected reason: 倒されそうな高価値味方を守るためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_front `master:shield->monster:cpu_front_left` score -699542.4 / 倒されそうな高価値味方を守るためシールド
    - end_turn `end_turn` score -1551315.8 / 有効な行動がないためターン終了
  - state: HP P/C 7/1 / stones P/C 0/26 / hand P/C 5/6
  - board: cpu_front_left:CF:ポリスピナー Lv1 HP2 act0/2 | player_front_left:PF:真勇者ダイン Lv1 HP5 act1/1 [focus] | player_front_right:PF:ゾンビ Lv1 HP3 act1/1 | player_back_left:PB:フーヨウ Lv1 HP3 act1/1


## Reading

- `Retreat Alt` は、シールド選択前の同一局面に同じ対象を前列から後列へ下げる移動候補が存在した件数。
- `Retreat Higher` は、その後退候補の評価点が選択されたシールドを上回った件数。
- `Retreat Close` は、選択シールドとの差が close margin 以内の件数。
- `Shield->Retreat` は、シールドした対象を同ターン中に後列へ下げた件数。行動順としては雑になりやすい。
- `Attack/Wake Higher/Close` は、シールドを選ぶ前に攻撃またはウェイクアップがどれくらい競合していたかの探索値。
- `Wake Attack Higher/Close` は、ウェイクアップを選んだ局面で、攻撃候補がどれくらい競合していたかの探索値。
- `Turn Order` では、実際の同一ターン内で shield の後に attack/wake したか、attack/wake の後に shield したかを見る。
- `partial` は、サンプル採取用に `--stop-after-samples` で途中終了したゲーム数。勝敗集計には含めない。