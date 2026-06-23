# White AI Action Order Audit

生成: 2026-06-23T05:38:01.693Z
候補: `pressure_white_baseline`, `pressure_white_shield_quality_breakthrough_v1`
相手: black_pressure_strong, black_pressure_pressure, white_pressure_strong
seed: 28000-28007 / 各seat
close margin: 15

## Conclusion

- pressure_white_baseline: シールド 240件中、同一対象の後退候補あり 7件、後退が上回ったもの 0件、同ターン shield->retreat 3件。
- pressure_white_baseline: 後衛ロールを盾してから後退する例が残るため、シールド係数ではなく安全後退そのものの評価を候補にする価値がある。
- pressure_white_shield_quality_breakthrough_v1: シールド 232件中、同一対象の後退候補あり 7件、後退が上回ったもの 0件、同ターン shield->retreat 3件。

## Summary

| Variant | W-L-D | Steps | Shield | Retreat Alt | Retreat Higher | Retreat Close | Shield->Retreat | BackRole S->R | Attack Higher/Close | Wake Higher/Close |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pressure_white_baseline | 15-33-0 | 2487 | 240 (9.7%) | 7 (2.9%) | 0 (0%) | 1 (0.4%) | 3 (1.3%) | 1 (0.4%) | 0 (0%) / 23 (9.6%) | 0 (0%) / 7 (2.9%) |
| pressure_white_shield_quality_breakthrough_v1 | 18-30-0 | 2453 | 232 (9.5%) | 7 (3%) | 0 (0%) | 1 (0.4%) | 3 (1.3%) | 0 (0%) | 0 (0%) / 23 (9.9%) | 0 (0%) / 6 (2.6%) |

## Samples

### pressure_white_baseline

- back_role_shield_then_retreat: seed 28005 / black_pressure_pressure / player / turn 13 step 137 / ピグミィ player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score 122.3
  - retreat: move:front->back `move:player_front_left->player_back_left` score 50.8
  - later move: move:front->back `move:player_front_left->player_back_left` score 68.6
  - state: HP P/C 4/3 / stones P/C 4/1 / hand P/C 7/4
  - board: cpu_back_left:CB:ヴァルテル Lv1 HP1 act0/1 | cpu_back_right:CB:バルキャノン Lv1 HP3 act1/1 | cpu_front_left:CF:グングニエル Lv1 HP5 act1/1 | cpu_front_right:CF:ゾンビ Lv1 HP1 act1/1 | player_front_left:PF:ピグミィ Lv1 HP2 act0/2 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_right:PB:アーシュ＆ロロ Lv2 HP2 act0/1
- shield_then_retreat: seed 28007 / white_pressure_strong / player / turn 4 step 31 / オヤコダケ player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score 274.4
  - retreat: move:front->back `move:player_front_left->player_back_right` score 194.8
  - attack: attack:アーシュ＆ロロ:enemy_front `attack:player_front_right:attack->monster:cpu_front_right` score 48
  - later move: move:front->back `move:player_front_left->player_back_right` score 174
  - state: HP P/C 10/10 / stones P/C 4/0 / hand P/C 4/3
  - board: cpu_back_left:CB:ホロウダイン Lv1 HP5 act0/1 | cpu_back_right:CB:ラッフィー Lv1 HP5 prep | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act1/1 | player_front_left:PF:オヤコダケ Lv1 HP2 act0/1 | player_front_right:PF:アーシュ＆ロロ Lv1 HP4 act0/1 | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1
- retreat_alt_close: seed 28007 / white_pressure_strong / cpu / turn 7 step 68 / マッド・ダミー cpu_front_right
  - selected: master:shield:own_front `master:shield->monster:cpu_front_right` score 317.8
  - retreat: move:front->back `move:cpu_front_right->cpu_back_left` score 314.1
  - attack: attack:マッド・ダミー:enemy_front `attack:cpu_front_right:attack->monster:player_front_right` score 48.5
  - state: HP P/C 9/9 / stones P/C 1/6 / hand P/C 4/6
  - board: cpu_back_left:CB:ホロウダイン Lv1 HP5 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP5 act0/1 | cpu_front_right:CF:マッド・ダミー Lv1 HP2 act0/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 | player_front_right:PF:マッド・ダミー Lv1 HP3 act1/1 | player_back_left:PB:オヤコダケ Lv1 HP2 act1/1 | player_back_right:PB:オーパス Lv1 HP4 prep
- shield_then_retreat: seed 28007 / white_pressure_strong / cpu / turn 7 step 68 / マッド・ダミー cpu_front_right
  - selected: master:shield:own_front `master:shield->monster:cpu_front_right` score 317.8
  - retreat: move:front->back `move:cpu_front_right->cpu_back_left` score 314.1
  - attack: attack:マッド・ダミー:enemy_front `attack:cpu_front_right:attack->monster:player_front_right` score 48.5
  - later move: move:front->back `move:cpu_front_right->cpu_back_left` score 286.4
  - state: HP P/C 9/9 / stones P/C 1/6 / hand P/C 4/6
  - board: cpu_back_left:CB:ホロウダイン Lv1 HP5 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP5 act0/1 | cpu_front_right:CF:マッド・ダミー Lv1 HP2 act0/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 | player_front_right:PF:マッド・ダミー Lv1 HP3 act1/1 | player_back_left:PB:オヤコダケ Lv1 HP2 act1/1 | player_back_right:PB:オーパス Lv1 HP4 prep

### pressure_white_shield_quality_breakthrough_v1

- shield_then_retreat: seed 28007 / white_pressure_strong / player / turn 4 step 31 / オヤコダケ player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score 282.4
  - retreat: move:front->back `move:player_front_left->player_back_right` score 199.1
  - attack: attack:アーシュ＆ロロ:enemy_front `attack:player_front_right:attack->monster:cpu_front_right` score 48
  - later move: move:front->back `move:player_front_left->player_back_right` score 174
  - state: HP P/C 10/10 / stones P/C 4/0 / hand P/C 4/3
  - board: cpu_back_left:CB:ホロウダイン Lv1 HP5 act0/1 | cpu_back_right:CB:ラッフィー Lv1 HP5 prep | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act1/1 | player_front_left:PF:オヤコダケ Lv1 HP2 act0/1 | player_front_right:PF:アーシュ＆ロロ Lv1 HP4 act0/1 | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1
- shield_then_retreat: seed 28002 / white_pressure_strong / cpu / turn 6 step 68 / ピグミィ cpu_front_left
  - selected: master:shield:own_front `master:shield->monster:cpu_front_left` score 323.9
  - retreat: move:front->back `move:cpu_front_left->cpu_back_right` score 286.6
  - attack: attack:アーシュ＆ロロ:enemy_master `attack:cpu_front_right:attack->master:player` score 260.5
  - later move: move:front->back `move:cpu_front_left->cpu_back_right` score 259.5
  - state: HP P/C 7/7 / stones P/C 0/5 / hand P/C 4/5
  - board: cpu_back_right:CB:真勇者ダイン Lv2 HP6 act0/1 | cpu_front_left:CF:ピグミィ Lv1 HP2 act0/2 | cpu_front_right:CF:アーシュ＆ロロ Lv2 HP5 act0/1 | player_front_left:PF:ラッフィー Lv1 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:オーパス Lv1 HP4 act1/1
- retreat_alt_close: seed 28007 / white_pressure_strong / cpu / turn 7 step 68 / マッド・ダミー cpu_front_right
  - selected: master:shield:own_front `master:shield->monster:cpu_front_right` score 325.8
  - retreat: move:front->back `move:cpu_front_right->cpu_back_left` score 318.5
  - attack: attack:マッド・ダミー:enemy_front `attack:cpu_front_right:attack->monster:player_front_right` score 48.5
  - state: HP P/C 9/9 / stones P/C 1/6 / hand P/C 4/6
  - board: cpu_back_left:CB:ホロウダイン Lv1 HP5 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP5 act0/1 | cpu_front_right:CF:マッド・ダミー Lv1 HP2 act0/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 | player_front_right:PF:マッド・ダミー Lv1 HP3 act1/1 | player_back_left:PB:オヤコダケ Lv1 HP2 act1/1 | player_back_right:PB:オーパス Lv1 HP4 prep
- shield_then_retreat: seed 28007 / white_pressure_strong / cpu / turn 7 step 68 / マッド・ダミー cpu_front_right
  - selected: master:shield:own_front `master:shield->monster:cpu_front_right` score 325.8
  - retreat: move:front->back `move:cpu_front_right->cpu_back_left` score 318.5
  - attack: attack:マッド・ダミー:enemy_front `attack:cpu_front_right:attack->monster:player_front_right` score 48.5
  - later move: move:front->back `move:cpu_front_right->cpu_back_left` score 289.1
  - state: HP P/C 9/9 / stones P/C 1/6 / hand P/C 4/6
  - board: cpu_back_left:CB:ホロウダイン Lv1 HP5 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP5 act0/1 | cpu_front_right:CF:マッド・ダミー Lv1 HP2 act0/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 | player_front_right:PF:マッド・ダミー Lv1 HP3 act1/1 | player_back_left:PB:オヤコダケ Lv1 HP2 act1/1 | player_back_right:PB:オーパス Lv1 HP4 prep


## Reading

- `Retreat Alt` は、シールド選択前の同一局面に同じ対象を前列から後列へ下げる移動候補が存在した件数。
- `Retreat Higher` は、その後退候補の評価点が選択されたシールドを上回った件数。
- `Retreat Close` は、選択シールドとの差が close margin 以内の件数。
- `Shield->Retreat` は、シールドした対象を同ターン中に後列へ下げた件数。行動順としては雑になりやすい。
- `Attack/Wake Higher/Close` は、シールドを選ぶ前に攻撃またはウェイクアップがどれくらい競合していたかの探索値。