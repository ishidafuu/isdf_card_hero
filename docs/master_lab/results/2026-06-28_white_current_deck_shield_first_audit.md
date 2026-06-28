# White AI Action Order Audit

生成: 2026-06-28T00:07:10.373Z
候補: `current_white_baseline`
相手: black_pressure_strong, black_1375_pressure, white_current_mirror
seed: 83100-83103 / 各seat
close margin: 20

## Conclusion

- current_white_baseline: シールド 134件中、同一対象の後退候補あり 0件、後退が上回ったもの 0件、同ターン shield->retreat 0件。
- current_white_baseline: サンプル採取のため 1ゲームを途中終了。勝率ではなく行動例の監査として読む。
- current_white_baseline: turn order は shield含み 125/302ターン、shield先行後にattack/wake 0件、attack/wake後にshield 101件、wake後attack 48件。

## Summary

| Variant | W-L-D | Steps | Turns | Shield | Shield Turns | Shield First | Shield Then Work | Work Then Shield | Retreat Alt | Shield->Retreat | Shield Attack Higher/Close | Shield Wake Higher/Close | Wake | Wake Attack Higher/Close | Wake Then Attack |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 4-15-0 (+1 partial) | 1474 | 302 | 134 (9.1%) | 125 (41.4%) | 8 (6.4%) | 0 (0%) | 101 (80.8%) | 0 (0%) | 0 (0%) | 0 (0%) / 0 (0%) | 0 (0%) / 0 (0%) | 51 (3.5%) | 0 (0%) / 0 (0%) | 48 (15.9%) |

## Samples

### current_white_baseline

- shield_first_turn: seed 83103 / black_pressure_strong / player / turn 11 step 98 / ヤンバル player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score -65.5
  - selected reason: 倒されそうな高価値味方を守るためシールド
  - state: HP P/C 7/4 / stones P/C 8/1 / hand P/C 6/5
  - board: cpu_front_left:CF:ファントム Lv1 HP5 prep | player_front_left:PF:ヤンバル Lv1 HP1 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_right:PB:ピグミィ Lv2 HP1 act0/2
- shield_first_turn: seed 83103 / black_pressure_strong / player / turn 18 step 145 / ピグミィ player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score 44.1
  - selected reason: 致死圏の味方を守れるためシールド
  - state: HP P/C 2/2 / stones P/C 33/1 / hand P/C 6/5
  - board: cpu_back_left:CB:フーヨウ Lv2 HP3 act1/1 | cpu_back_right:CB:ヴァルテル Lv1 HP1 act1/1 | cpu_front_left:CF:ファントム Lv2 HP3 act1/1 | cpu_front_right:CF:ナッツロックル Lv1 HP4 act1/1 | player_front_left:PF:ピグミィ Lv1 HP3 act0/2
- shield_first_turn: seed 83100 / black_pressure_strong / cpu / turn 18 step 149 / デスシープ cpu_front_right
  - selected: master:shield:own_front `master:shield->monster:cpu_front_right` score 154.7
  - selected reason: 致死圏の味方を守れるためシールド / 見送り: マジックは64点差で見送り、マジックは64点差で見送り
  - state: HP P/C 2/5 / stones P/C 4/22 / hand P/C 5/6
  - board: cpu_front_right:CF:デスシープ Lv1 HP4 act0/1 | player_front_left:PF:ヒートロン Lv1 HP4 act1/1 | player_back_left:PB:フーヨウ Lv1 HP3 act1/1
- shield_first_turn: seed 83101 / black_pressure_strong / cpu / turn 11 step 80 / ポリスピナー cpu_front_left
  - selected: master:shield:own_front `master:shield->monster:cpu_front_left` score -699542.4
  - selected reason: 倒されそうな高価値味方を守るためシールド
  - state: HP P/C 7/1 / stones P/C 0/26 / hand P/C 5/6
  - board: cpu_front_left:CF:ポリスピナー Lv1 HP2 act0/2 | player_front_left:PF:真勇者ダイン Lv1 HP5 act1/1 | player_front_right:PF:ゾンビ Lv1 HP3 act1/1 | player_back_left:PB:フーヨウ Lv1 HP3 act1/1
- shield_first_turn: seed 83101 / black_1375_pressure / player / turn 9 step 72 / ピグミィ player_front_right
  - selected: master:shield:own_front `master:shield->monster:player_front_right` score -143.5
  - selected reason: 致死圏の味方を守れるためシールド
  - state: HP P/C 7/2 / stones P/C 10/3 / hand P/C 6/4
  - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act1/2 | cpu_front_left:CF:ポリスピナー Lv1 HP3 prep | cpu_front_right:CF:真勇者ダイン Lv3 HP6 act1/1 | player_front_left:PF:ピグミィ Lv1 HP3 act0/2 | player_front_right:PF:ピグミィ Lv1 HP3 act0/2
- shield_first_turn: seed 83100 / black_1375_pressure / cpu / turn 15 step 138 / 真勇者ダイン cpu_front_left
  - selected: master:shield:own_front `master:shield->monster:cpu_front_left` score -1
  - selected reason: 致死圏の味方を守れるためシールド
  - state: HP P/C 6/3 / stones P/C 0/27 / hand P/C 5/6
  - board: cpu_front_left:CF:真勇者ダイン Lv1 HP3 act0/1 | player_front_left:PF:ピグミィ Lv1 HP3 act2/2 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 prep
- shield_first_turn: seed 83103 / white_current_mirror / player / turn 12 step 129 / ピグミィ player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score -132.7
  - selected reason: 倒されそうな高価値味方を守るためシールド
  - state: HP P/C 4/8 / stones P/C 4/4 / hand P/C 5/5
  - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 | player_front_left:PF:ピグミィ Lv2 HP3 act0/2
- shield_first_turn: seed 83103 / white_current_mirror / player / turn 14 step 137 / ピグミィ player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score -2.6
  - selected reason: 致死圏の味方を守れるためシールド
  - state: HP P/C 3/8 / stones P/C 7/10 / hand P/C 6/5
  - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 | cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | player_front_left:PF:ピグミィ Lv2 HP3 act0/2


## Reading

- `Retreat Alt` は、シールド選択前の同一局面に同じ対象を前列から後列へ下げる移動候補が存在した件数。
- `Retreat Higher` は、その後退候補の評価点が選択されたシールドを上回った件数。
- `Retreat Close` は、選択シールドとの差が close margin 以内の件数。
- `Shield->Retreat` は、シールドした対象を同ターン中に後列へ下げた件数。行動順としては雑になりやすい。
- `Attack/Wake Higher/Close` は、シールドを選ぶ前に攻撃またはウェイクアップがどれくらい競合していたかの探索値。
- `Wake Attack Higher/Close` は、ウェイクアップを選んだ局面で、攻撃候補がどれくらい競合していたかの探索値。
- `Turn Order` では、実際の同一ターン内で shield の後に attack/wake したか、attack/wake の後に shield したかを見る。
- `partial` は、サンプル採取用に `--stop-after-samples` で途中終了したゲーム数。勝敗集計には含めない。