# White AI Action Order Audit

生成: 2026-06-23T05:45:33.325Z
候補: `pressure_white_baseline`, `pressure_white_safe_retreat_order_light_v1`, `pressure_white_safe_retreat_order_v1`, `pressure_white_shield_quality_retreat_order_v1`
相手: black_pressure_strong, black_pressure_pressure, white_pressure_strong
seed: 28100-28105 / 各seat
close margin: 15

## Conclusion

- pressure_white_baseline: シールド 124件中、同一対象の後退候補あり 6件、後退が上回ったもの 0件、同ターン shield->retreat 1件。
- pressure_white_baseline: 後衛ロールを盾してから後退する例が残るため、シールド係数ではなく安全後退そのものの評価を候補にする価値がある。
- pressure_white_safe_retreat_order_light_v1: シールド 120件中、同一対象の後退候補あり 5件、後退が上回ったもの 0件、同ターン shield->retreat 1件。
- pressure_white_safe_retreat_order_light_v1: 後衛ロールを盾してから後退する例が残るため、シールド係数ではなく安全後退そのものの評価を候補にする価値がある。
- pressure_white_safe_retreat_order_v1: シールド 122件中、同一対象の後退候補あり 6件、後退が上回ったもの 0件、同ターン shield->retreat 2件。
- pressure_white_safe_retreat_order_v1: 後衛ロールを盾してから後退する例が残るため、シールド係数ではなく安全後退そのものの評価を候補にする価値がある。
- pressure_white_shield_quality_retreat_order_v1: シールド 134件中、同一対象の後退候補あり 8件、後退が上回ったもの 0件、同ターン shield->retreat 2件。
- pressure_white_shield_quality_retreat_order_v1: 後衛ロールを盾してから後退する例が残るため、シールド係数ではなく安全後退そのものの評価を候補にする価値がある。

## Summary

| Variant | W-L-D | Steps | Shield | Retreat Alt | Retreat Higher | Retreat Close | Shield->Retreat | BackRole S->R | Attack Higher/Close | Wake Higher/Close |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pressure_white_baseline | 13-23-0 | 1530 | 124 (8.1%) | 6 (4.8%) | 0 (0%) | 0 (0%) | 1 (0.8%) | 1 (0.8%) | 0 (0%) / 4 (3.2%) | 0 (0%) / 3 (2.4%) |
| pressure_white_safe_retreat_order_light_v1 | 10-26-0 | 1522 | 120 (7.9%) | 5 (4.2%) | 0 (0%) | 0 (0%) | 1 (0.8%) | 1 (0.8%) | 0 (0%) / 4 (3.3%) | 0 (0%) / 4 (3.3%) |
| pressure_white_safe_retreat_order_v1 | 12-24-0 | 1523 | 122 (8%) | 6 (4.9%) | 0 (0%) | 0 (0%) | 2 (1.6%) | 2 (1.6%) | 0 (0%) / 3 (2.5%) | 0 (0%) / 3 (2.5%) |
| pressure_white_shield_quality_retreat_order_v1 | 9-27-0 | 1520 | 134 (8.8%) | 8 (6%) | 0 (0%) | 0 (0%) | 2 (1.5%) | 1 (0.7%) | 0 (0%) / 7 (5.2%) | 0 (0%) / 3 (2.2%) |

## Samples

### pressure_white_baseline

- back_role_shield_then_retreat: seed 28100 / black_pressure_strong / player / turn 10 step 94 / ピグミィ player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score 304.3
  - retreat: move:front->back `move:player_front_left->player_back_right` score 235.7
  - attack: attack:ピグミィ:enemy_back `attack:player_front_left:スパイクボール->monster:cpu_back_left` score 35
  - later move: move:front->back `move:player_front_left->player_back_right` score 232.1
  - state: HP P/C 7/9 / stones P/C 4/1 / hand P/C 6/4
  - board: cpu_back_left:CB:バルキャノン Lv1 HP3 act1/1 | cpu_back_right:CB:ゼック Lv1 HP2 prep | cpu_front_left:CF:フーヨウ Lv1 HP3 act1/1 | player_front_left:PF:ピグミィ Lv1 HP2 act0/2 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2

### pressure_white_safe_retreat_order_light_v1

- back_role_shield_then_retreat: seed 28100 / black_pressure_pressure / player / turn 8 step 83 / ピグミィ player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score 309.6
  - retreat: move:front->back `move:player_front_left->player_back_left` score 237.1
  - attack: attack:アーシュ＆ロロ:enemy_master `attack:player_front_right:attack->master:cpu` score 249.8
  - later move: move:front->back `move:player_front_left->player_back_left` score 204.3
  - state: HP P/C 6/6 / stones P/C 6/0 / hand P/C 6/4
  - board: cpu_back_left:CB:ビヨンド Lv1 HP2 prep | cpu_back_right:CB:フーヨウ Lv2 HP3 act1/1 | cpu_front_right:CF:ヒートロン Lv1 HP4 act1/1 | player_front_left:PF:ピグミィ Lv2 HP3 act0/2 | player_front_right:PF:アーシュ＆ロロ Lv2 HP5 act0/1 | player_back_right:PB:マッド・ダミー Lv1 HP3 act0/1

### pressure_white_safe_retreat_order_v1

- back_role_shield_then_retreat: seed 28100 / black_pressure_strong / player / turn 7 step 71 / ピグミィ player_front_right
  - selected: master:shield:own_front `master:shield->monster:player_front_right` score 284.6
  - retreat: move:front->back `move:player_front_right->player_back_right` score 255.1
  - attack: attack:アサシン:enemy_master `attack:player_front_left:attack->master:cpu` score 230.2
  - later move: move:front->back `move:player_front_right->player_back_right` score 296.2
  - state: HP P/C 7/6 / stones P/C 6/2 / hand P/C 5/4
  - board: cpu_back_left:CB:ヒートロン Lv1 HP5 act0/1 | cpu_back_right:CB:フーヨウ Lv1 HP3 prep | cpu_front_left:CF:ナッツロックル Lv1 HP4 act1/1 | cpu_front_right:CF:フーヨウ Lv2 HP3 act1/1 | player_front_left:PF:アサシン Lv1 HP4 act0/1 | player_front_right:PF:ピグミィ Lv1 HP3 act0/2 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2
- back_role_shield_then_retreat: seed 28100 / black_pressure_pressure / player / turn 7 step 71 / ピグミィ player_front_right
  - selected: master:shield:own_front `master:shield->monster:player_front_right` score 284.6
  - retreat: move:front->back `move:player_front_right->player_back_right` score 255.1
  - attack: attack:アサシン:enemy_master `attack:player_front_left:attack->master:cpu` score 230.2
  - later move: move:front->back `move:player_front_right->player_back_right` score 296.2
  - state: HP P/C 7/6 / stones P/C 6/2 / hand P/C 5/4
  - board: cpu_back_left:CB:ヒートロン Lv1 HP5 act0/1 | cpu_back_right:CB:フーヨウ Lv1 HP3 prep | cpu_front_left:CF:ナッツロックル Lv1 HP4 act1/1 | cpu_front_right:CF:フーヨウ Lv2 HP3 act1/1 | player_front_left:PF:アサシン Lv1 HP4 act0/1 | player_front_right:PF:ピグミィ Lv1 HP3 act0/2 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2

### pressure_white_shield_quality_retreat_order_v1

- back_role_shield_then_retreat: seed 28100 / black_pressure_strong / player / turn 7 step 69 / ピグミィ player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score 310.3
  - retreat: move:front->back `move:player_front_left->player_back_left` score 279.5
  - attack: attack:アーシュ＆ロロ:enemy_master `attack:player_front_right:attack->master:cpu` score 291.7
  - later move: move:front->back `move:player_front_left->player_back_left` score 227.5
  - state: HP P/C 6/7 / stones P/C 3/1 / hand P/C 7/4
  - board: cpu_back_left:CB:フーヨウ Lv1 HP3 prep | cpu_back_right:CB:ゴーント Lv1 HP1 act1/1 | cpu_front_left:CF:フーヨウ Lv2 HP3 act1/1 | cpu_front_right:CF:ヒートロン Lv1 HP5 act1/1 | player_front_left:PF:ピグミィ Lv2 HP3 act0/2 | player_front_right:PF:アーシュ＆ロロ Lv2 HP3 act0/1 | player_back_right:PB:マッド・ダミー Lv1 HP3 act0/1
- shield_then_retreat: seed 28100 / black_pressure_pressure / player / turn 7 step 68 / ピグミィ player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score 336.5
  - retreat: move:front->back `move:player_front_left->player_back_left` score 273.1
  - attack: attack:アーシュ＆ロロ:enemy_master `attack:player_front_right:attack->master:cpu` score 292.3
  - later move: move:front->back `move:player_front_left->player_back_left` score 284.4
  - state: HP P/C 6/7 / stones P/C 5/1 / hand P/C 7/4
  - board: cpu_back_left:CB:フーヨウ Lv1 HP3 prep | cpu_back_right:CB:ゴーント Lv1 HP1 act1/1 | cpu_front_left:CF:フーヨウ Lv2 HP3 act1/1 | cpu_front_right:CF:ヒートロン Lv1 HP5 act1/1 | player_front_left:PF:ピグミィ Lv2 HP3 act0/2 | player_front_right:PF:アーシュ＆ロロ Lv2 HP5 act0/1 | player_back_right:PB:マッド・ダミー Lv1 HP3 act0/1


## Reading

- `Retreat Alt` は、シールド選択前の同一局面に同じ対象を前列から後列へ下げる移動候補が存在した件数。
- `Retreat Higher` は、その後退候補の評価点が選択されたシールドを上回った件数。
- `Retreat Close` は、選択シールドとの差が close margin 以内の件数。
- `Shield->Retreat` は、シールドした対象を同ターン中に後列へ下げた件数。行動順としては雑になりやすい。
- `Attack/Wake Higher/Close` は、シールドを選ぶ前に攻撃またはウェイクアップがどれくらい競合していたかの探索値。