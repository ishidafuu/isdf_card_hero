# White AI Action Order Audit

生成: 2026-07-03T09:30:12.551Z
候補: `current_white_baseline`, `current_mirror_blocked_exposed45`
相手: white_current_mirror
seed: 993100-993102 / 各seat
close margin: 15

## Conclusion

- current_white_baseline: シールド 59件中、同一対象の後退候補あり 0件、後退が上回ったもの 0件、同ターン shield->retreat 0件。
- current_white_baseline: turn order は shield含み 57/130ターン、shield先行後にattack/wake 0件、attack/wake後にshield 42件、wake後attack 18件。
- current_mirror_blocked_exposed45: シールド 59件中、同一対象の後退候補あり 0件、後退が上回ったもの 0件、同ターン shield->retreat 0件。
- current_mirror_blocked_exposed45: 参照候補より shield->retreat を減らせず勝数も伸びていないため、このままの行動順補正は採用見送り。
- current_mirror_blocked_exposed45: turn order は shield含み 57/130ターン、shield先行後にattack/wake 0件、attack/wake後にshield 42件、wake後attack 18件。

## Summary

| Variant | W-L-D | Incomplete | Steps | Turns | Shield | Shield Turns | Shield First | Shield Then Work | Work Then Shield | Retreat Alt | Shield->Retreat | Shield Attack Higher/Close | Shield Wake Higher/Close | Wake | Wake Attack Higher/Close | Wake Then Attack |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 3-3-0 | 0 | 696 | 130 | 59 (8.5%) | 57 (43.8%) | 7 (12.3%) | 0 (0%) | 42 (73.7%) | 0 (0%) | 0 (0%) | 0 (0%) / 0 (0%) | 0 (0%) / 0 (0%) | 18 (2.6%) | 0 (0%) / 0 (0%) | 18 (13.8%) |
| current_mirror_blocked_exposed45 | 3-3-0 | 0 | 696 | 130 | 59 (8.5%) | 57 (43.8%) | 7 (12.3%) | 0 (0%) | 42 (73.7%) | 0 (0%) | 0 (0%) | 0 (0%) / 0 (0%) | 0 (0%) / 0 (0%) | 18 (2.6%) | 0 (0%) / 0 (0%) | 18 (13.8%) |

## Samples

### current_white_baseline

- shield_first_turn: seed 993100 / white_current_mirror / player / turn 18 step 192 / ヤンバル player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score 6.8
  - selected reason: 倒されそうな高価値味方を守るためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_front `master:shield->monster:player_front_left` score 6.8 / 倒されそうな高価値味方を守るためシールド
    - end_turn `end_turn` score -73.2 / 有効な行動がないためターン終了
  - state: HP P/C 4/6 / stones P/C 14/4 / hand P/C 6/5
  - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 [focus] | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 [focus] | cpu_front_left:CF:デスシープ Lv2 HP4 act1/1 [shield] | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 | player_front_left:PF:ヤンバル Lv1 HP3 act0/1
- shield_first_turn: seed 993100 / white_current_mirror / player / turn 21 step 207 / ヤンバル player_front_right
  - selected: master:shield:own_front `master:shield->monster:player_front_right` score 141.4
  - selected reason: 致死圏の味方を守れるためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_front `master:shield->monster:player_front_right` score 141.4 / 致死圏の味方を守れるためシールド
    - end_turn `end_turn` score 60.7 / 有効な行動がないためターン終了
  - state: HP P/C 2/6 / stones P/C 13/11 / hand P/C 6/5
  - board: cpu_back_left:CB:デスシープ Lv2 HP2 act0/1 [focus,shield] | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 [focus] | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 [focus] | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 [focus] | player_front_right:PF:ヤンバル Lv1 HP3 act0/1
- shield_first_turn: seed 993102 / white_current_mirror / player / turn 24 step 277 / ピグミィ player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score -50.2
  - selected reason: 致死圏の味方を守れるためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_front `master:shield->monster:player_front_left` score -50.2 / 致死圏の味方を守れるためシールド
    - end_turn `end_turn` score -265.8 / 有効な行動がないためターン終了
  - state: HP P/C 6/8 / stones P/C 5/7 / hand P/C 6/5
  - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 [focus] | player_front_left:PF:ピグミィ Lv2 HP3 act0/2 [focus]
- shield_first_turn: seed 993100 / white_current_mirror / cpu / turn 20 step 205 / デスシープ cpu_back_left
  - selected: master:shield:own_back `master:shield->monster:cpu_back_left` score 234.8
  - selected reason: 致死圏の味方を守れるためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_back `master:shield->monster:cpu_back_left` score 234.8 / 致死圏の味方を守れるためシールド
    - end_turn `end_turn` score 150.3 / 有効な行動がないためターン終了
  - state: HP P/C 2/6 / stones P/C 10/13 / hand P/C 5/6
  - board: cpu_back_left:CB:デスシープ Lv2 HP2 act0/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 [focus] | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 [focus] | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 [focus] | player_front_right:PF:ヤンバル Lv1 HP3 act1/1 [shield]
- shield_first_turn: seed 993100 / white_current_mirror / cpu / turn 22 step 213 / デスシープ cpu_back_left
  - selected: master:shield:own_back `master:shield->monster:cpu_back_left` score 55.4
  - selected reason: 倒されそうな高価値味方を守るためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_back `master:shield->monster:cpu_back_left` score 55.4 / 倒されそうな高価値味方を守るためシールド
    - end_turn `end_turn` score -347.4 / 有効な行動がないためターン終了
  - state: HP P/C 2/6 / stones P/C 12/17 / hand P/C 5/6
  - board: cpu_back_left:CB:デスシープ Lv2 HP1 act0/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 [focus] | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 [focus] | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 [focus] | player_front_right:PF:ヤンバル Lv1 HP3 act1/1 [shield]
- shield_first_turn: seed 993100 / white_current_mirror / cpu / turn 23 step 216 / デスシープ cpu_back_left
  - selected: master:shield:own_back `master:shield->monster:cpu_back_left` score 238.6
  - selected reason: 致死圏の味方を守れるためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_back `master:shield->monster:cpu_back_left` score 238.6 / 致死圏の味方を守れるためシールド
    - end_turn `end_turn` score -382.9 / 有効な行動がないためターン終了
  - state: HP P/C 2/6 / stones P/C 15/18 / hand P/C 5/6
  - board: cpu_back_left:CB:デスシープ Lv2 HP1 act0/1 [focus] | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 [focus] | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 [focus] | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 [focus] | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 [focus]
- shield_first_turn: seed 993100 / white_current_mirror / cpu / turn 24 step 219 / デスシープ cpu_back_left
  - selected: master:shield:own_back `master:shield->monster:cpu_back_left` score 238.6
  - selected reason: 致死圏の味方を守れるためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_back `master:shield->monster:cpu_back_left` score 238.6 / 致死圏の味方を守れるためシールド
    - end_turn `end_turn` score -384 / 有効な行動がないためターン終了
  - state: HP P/C 2/6 / stones P/C 18/19 / hand P/C 5/6
  - board: cpu_back_left:CB:デスシープ Lv2 HP1 act0/1 [focus] | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 [focus] | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 [focus] | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 [focus] | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 [focus]

### current_mirror_blocked_exposed45

- shield_first_turn: seed 993100 / white_current_mirror / player / turn 18 step 192 / ヤンバル player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score 6.8
  - selected reason: 倒されそうな高価値味方を守るためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_front `master:shield->monster:player_front_left` score 6.8 / 倒されそうな高価値味方を守るためシールド
    - end_turn `end_turn` score -73.2 / 有効な行動がないためターン終了
  - state: HP P/C 4/6 / stones P/C 14/4 / hand P/C 6/5
  - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 [focus] | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 [focus] | cpu_front_left:CF:デスシープ Lv2 HP4 act1/1 [shield] | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 | player_front_left:PF:ヤンバル Lv1 HP3 act0/1
- shield_first_turn: seed 993100 / white_current_mirror / player / turn 21 step 207 / ヤンバル player_front_right
  - selected: master:shield:own_front `master:shield->monster:player_front_right` score 141.4
  - selected reason: 致死圏の味方を守れるためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_front `master:shield->monster:player_front_right` score 141.4 / 致死圏の味方を守れるためシールド
    - end_turn `end_turn` score 60.7 / 有効な行動がないためターン終了
  - state: HP P/C 2/6 / stones P/C 13/11 / hand P/C 6/5
  - board: cpu_back_left:CB:デスシープ Lv2 HP2 act0/1 [focus,shield] | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 [focus] | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 [focus] | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 [focus] | player_front_right:PF:ヤンバル Lv1 HP3 act0/1
- shield_first_turn: seed 993102 / white_current_mirror / player / turn 24 step 277 / ピグミィ player_front_left
  - selected: master:shield:own_front `master:shield->monster:player_front_left` score -50.2
  - selected reason: 致死圏の味方を守れるためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_front `master:shield->monster:player_front_left` score -50.2 / 致死圏の味方を守れるためシールド
    - end_turn `end_turn` score -265.8 / 有効な行動がないためターン終了
  - state: HP P/C 6/8 / stones P/C 5/7 / hand P/C 6/5
  - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 [focus] | player_front_left:PF:ピグミィ Lv2 HP3 act0/2 [focus]
- shield_first_turn: seed 993100 / white_current_mirror / cpu / turn 20 step 205 / デスシープ cpu_back_left
  - selected: master:shield:own_back `master:shield->monster:cpu_back_left` score 234.8
  - selected reason: 致死圏の味方を守れるためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_back `master:shield->monster:cpu_back_left` score 234.8 / 致死圏の味方を守れるためシールド
    - end_turn `end_turn` score 150.3 / 有効な行動がないためターン終了
  - state: HP P/C 2/6 / stones P/C 10/13 / hand P/C 5/6
  - board: cpu_back_left:CB:デスシープ Lv2 HP2 act0/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 [focus] | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 [focus] | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 [focus] | player_front_right:PF:ヤンバル Lv1 HP3 act1/1 [shield]
- shield_first_turn: seed 993100 / white_current_mirror / cpu / turn 22 step 213 / デスシープ cpu_back_left
  - selected: master:shield:own_back `master:shield->monster:cpu_back_left` score 55.4
  - selected reason: 倒されそうな高価値味方を守るためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_back `master:shield->monster:cpu_back_left` score 55.4 / 倒されそうな高価値味方を守るためシールド
    - end_turn `end_turn` score -347.4 / 有効な行動がないためターン終了
  - state: HP P/C 2/6 / stones P/C 12/17 / hand P/C 5/6
  - board: cpu_back_left:CB:デスシープ Lv2 HP1 act0/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 [focus] | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 [focus] | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 [focus] | player_front_right:PF:ヤンバル Lv1 HP3 act1/1 [shield]
- shield_first_turn: seed 993100 / white_current_mirror / cpu / turn 23 step 216 / デスシープ cpu_back_left
  - selected: master:shield:own_back `master:shield->monster:cpu_back_left` score 238.6
  - selected reason: 致死圏の味方を守れるためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_back `master:shield->monster:cpu_back_left` score 238.6 / 致死圏の味方を守れるためシールド
    - end_turn `end_turn` score -382.9 / 有効な行動がないためターン終了
  - state: HP P/C 2/6 / stones P/C 15/18 / hand P/C 5/6
  - board: cpu_back_left:CB:デスシープ Lv2 HP1 act0/1 [focus] | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 [focus] | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 [focus] | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 [focus] | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 [focus]
- shield_first_turn: seed 993100 / white_current_mirror / cpu / turn 24 step 219 / デスシープ cpu_back_left
  - selected: master:shield:own_back `master:shield->monster:cpu_back_left` score 238.6
  - selected reason: 致死圏の味方を守れるためシールド
  - alternatives: master_action 1, end_turn 1
  - top alternatives:
    - master:shield:own_back `master:shield->monster:cpu_back_left` score 238.6 / 致死圏の味方を守れるためシールド
    - end_turn `end_turn` score -384 / 有効な行動がないためターン終了
  - state: HP P/C 2/6 / stones P/C 18/19 / hand P/C 5/6
  - board: cpu_back_left:CB:デスシープ Lv2 HP1 act0/1 [focus] | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 [focus] | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 [focus] | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 [focus] | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 [focus]


## Reading

- `Retreat Alt` は、シールド選択前の同一局面に同じ対象を前列から後列へ下げる移動候補が存在した件数。
- `Retreat Higher` は、その後退候補の評価点が選択されたシールドを上回った件数。
- `Retreat Close` は、選択シールドとの差が close margin 以内の件数。
- `Shield->Retreat` は、シールドした対象を同ターン中に後列へ下げた件数。行動順としては雑になりやすい。
- `Attack/Wake Higher/Close` は、シールドを選ぶ前に攻撃またはウェイクアップがどれくらい競合していたかの探索値。
- `Wake Attack Higher/Close` は、ウェイクアップを選んだ局面で、攻撃候補がどれくらい競合していたかの探索値。
- `Turn Order` では、実際の同一ターン内で shield の後に attack/wake したか、attack/wake の後に shield したかを見る。
- `Incomplete` は、勝敗が決まる前に `--max-steps` または `--max-turns` へ到達したゲーム数。W-L-D の draw には含めない。
- `partial` は、サンプル採取用に `--stop-after-samples` で途中終了したゲーム数。勝敗集計には含めない。