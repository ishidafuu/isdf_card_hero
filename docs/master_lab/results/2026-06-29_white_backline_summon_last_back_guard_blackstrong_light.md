# White Backline Summon Audit Loop

生成: 2026-06-29T14:50:37.454Z
seedStart: 136780
候補: current_white_baseline, current_last_back_slot_no_reach_guard35, current_last_back_slot_no_reach_guard55
相手: black_pressure_strong
試行: 3 games/matchup/direction
総試合: 18

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 137
- 後列召喚: 88 (64.2%)
- 前列あり後列召喚: 57 (64.8%)
- うち前衛ロール: 31 (54.4%)
- デスシープ後列召喚: 8 (14%)
- デスシープ特技封じ損: 0 (0%) / W-L 0-0
- デスシープ特技封じ平均コマンド数: 0
- Backline patternあり: 32 (56.1%)
- Backline patternなし: 25 (43.9%)
- 次自ターン攻撃: 16 (28.1%)
- 次自ターン後列攻撃: 16 (28.1%)
- 次自ターン前進: 2 (3.5%)
- 次自ターン仕事なし: 39 (68.4%)
- Bad blocked summon: 24 (42.1%)
- Bad with evaluation trace: 0 (0%)
- Bad with non-summon alt: 0 (0%)
- Bad close non-summon alt: 0 (0%)
- Bad medium non-summon alt <=100: 0 (0%)
- Bad distant non-summon alt <=200: 0 (0%)
- Bad avg best non-summon gap: 0
- Bad top summon alt: 0 (0%)
- Bad top summon same card: 0 (0%)
- Bad top summon backline pattern: 0 (0%)
- Bad with other backline work in hand: 3 (12.5%)
- Bad consumes last back slot: 22 (91.7%)
- Bad leaves no empty back slot: 22 (91.7%)
- Avg no-reach front cards in back after bad: 1.25
- Bad with deck backline work: 24 (100%)
- Bad with deck top5 backline work: 20 (83.3%)
- Bad consumes last back slot with deck backline work: 22 (91.7%)
- Avg deck backline work cards after bad: 6.46
- Avg deck top5 backline work cards after bad: 1.38

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Death Sheep Lock | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_white_baseline | 1-5-0 | 44 | 34 (77.3%) | 22 (64.7%) | 12 (54.5%) | 0 (0%) | 12 (54.5%) | 10 (45.5%) | 7 (31.8%) | 7 (31.8%) | 2 (9.1%) | 13 (59.1%) | 9 (40.9%) | 0 (0%) | HandReach2, DeckReach9, DeckTop5Reach6, LastBack9, NoEmptyBack9 | 12 (54.5%) | 3/19 |
| current_last_back_slot_no_reach_guard35 | 3-3-0 | 38 | 23 (60.5%) | 14 (60.9%) | 8 (57.1%) | 0 (0%) | 9 (64.3%) | 5 (35.7%) | 5 (35.7%) | 5 (35.7%) | 0 (0%) | 9 (64.3%) | 5 (35.7%) | 0 (0%) | DeckReach5, DeckTop5Reach4, LastBack5, NoEmptyBack5 | 3 (21.4%) | 8/6 |
| current_last_back_slot_no_reach_guard55 | 4-2-0 | 55 | 31 (56.4%) | 21 (67.7%) | 11 (52.4%) | 0 (0%) | 11 (52.4%) | 10 (47.6%) | 4 (19%) | 4 (19%) | 0 (0%) | 17 (81%) | 10 (47.6%) | 0 (0%) | HandReach1, DeckReach10, DeckTop5Reach10, LastBack8, NoEmptyBack8 | 10 (47.6%) | 15/6 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Death Sheep Lock | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | black_pressure_strong | 1-5-0 | 22 | 0 (0%) | 12 (54.5%) | 10 (45.5%) | 13 (59.1%) | 9 (40.9%) | 0 (0%) |
| current_last_back_slot_no_reach_guard35 | black_pressure_strong | 3-3-0 | 14 | 0 (0%) | 9 (64.3%) | 5 (35.7%) | 9 (64.3%) | 5 (35.7%) | 0 (0%) |
| current_last_back_slot_no_reach_guard55 | black_pressure_strong | 4-2-0 | 21 | 0 (0%) | 11 (52.4%) | 10 (47.6%) | 17 (81%) | 10 (47.6%) | 0 (0%) |

## Samples

### blocked_backline_pattern_worked: ヤンバル seed 136780 turn 2

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=3:ピグミィ,4:ボムゾウ,7:ヤンバル,10:ボムゾウ,12:ボムゾウ,14:ピグミィ,23:ピグミィ / top5BackWork=3:ピグミィ,4:ボムゾウ / noReachFront=1:ドノマンティス,5:デスシープ,6:ポリスピナー,9:ドノマンティス,15:真勇者ダイン,16:デスシープ,18:デスシープ,20:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_back_left:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / attack:player_front_left:ダイン斬り->monster:cpu_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは2点差で見送り、ためるは2点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:グングニエル Lv1 HP5 prep / CF:神斬丸 Lv1 HP5 prep / CB:ゼック Lv1 HP2 prep

### blocked_no_pattern_no_work: ドノマンティス seed 136780 turn 6

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 prep / stones after 4 / score 24
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=3:ヤンバル,6:ボムゾウ,8:ボムゾウ,10:ピグミィ,19:ピグミィ / top5BackWork=3:ヤンバル / noReachFront=1:デスシープ,2:ポリスピナー,5:ドノマンティス,11:真勇者ダイン,12:デスシープ,14:デスシープ,16:真勇者ダイン,20:ポリスピナー
- special lock: -
- next turn: attack:player_front_left:ダイン斬り->master:cpu / master:wake_up->monster:cpu_back_left / attack:player_back_left:スパイクボール->monster:cpu_back_left / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は23点差で見送り、ためるは42点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 / PF:ボムゾウ Lv1 HP6 prep / PB:ピグミィ Lv2 HP1 / CB:フーヨウ Lv1 HP3 prep

### bad_blocked_no_eval_trace: ドノマンティス seed 136780 turn 6

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 prep / stones after 4 / score 24
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=3:ヤンバル,6:ボムゾウ,8:ボムゾウ,10:ピグミィ,19:ピグミィ / top5BackWork=3:ヤンバル / noReachFront=1:デスシープ,2:ポリスピナー,5:ドノマンティス,11:真勇者ダイン,12:デスシープ,14:デスシープ,16:真勇者ダイン,20:ポリスピナー
- special lock: -
- next turn: attack:player_front_left:ダイン斬り->master:cpu / master:wake_up->monster:cpu_back_left / attack:player_back_left:スパイクボール->monster:cpu_back_left / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は23点差で見送り、ためるは42点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 / PF:ボムゾウ Lv1 HP6 prep / PB:ピグミィ Lv2 HP1 / CB:フーヨウ Lv1 HP3 prep

### blocked_backline_pattern_worked: ピグミィ seed 136781 turn 2

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=デスシープ / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ピグミィ,4:ヤンバル,7:ボムゾウ,14:ボムゾウ,16:ピグミィ,22:ヤンバル / top5BackWork=2:ピグミィ,4:ヤンバル / noReachFront=1:ドノマンティス,3:ポリスピナー,5:デスシープ,8:ドノマンティス,11:デスシープ,12:ポリスピナー,13:真勇者ダイン,15:真勇者ダイン,...(+2)
- special lock: -
- next turn: attack:player_back_left:wild_claw->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは2点差で見送り、ためるは2点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:グングニエル Lv1 HP5 prep / CB:ゼック Lv1 HP2 prep

### blocked_no_pattern_no_work: デスシープ seed 136781 turn 5

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP3 / stones after 2 / score 25
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ヤンバル,4:ボムゾウ,11:ボムゾウ,13:ピグミィ,19:ヤンバル / top5BackWork=1:ヤンバル,4:ボムゾウ / noReachFront=2:デスシープ,5:ドノマンティス,8:デスシープ,9:ポリスピナー,10:真勇者ダイン,12:真勇者ダイン,17:真勇者ダイン,21:ポリスピナー
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / move:player_front_left->player_back_right / summon:player_yanbaru_1->player_back_left / master:shield->monster:player_front_left / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は13点差で見送り、召喚は36点差で見送り
- board: PF:ボムゾウ Lv2 HP2 / PF:ドノマンティス Lv1 HP3 / PB:ピグミィ Lv2 HP3 / CF:ヒートロン Lv1 HP5 prep / CB:ガンプ Lv1 HP2

### bad_blocked_no_eval_trace: デスシープ seed 136781 turn 5

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP3 / stones after 2 / score 25
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ヤンバル,4:ボムゾウ,11:ボムゾウ,13:ピグミィ,19:ヤンバル / top5BackWork=1:ヤンバル,4:ボムゾウ / noReachFront=2:デスシープ,5:ドノマンティス,8:デスシープ,9:ポリスピナー,10:真勇者ダイン,12:真勇者ダイン,17:真勇者ダイン,21:ポリスピナー
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / move:player_front_left->player_back_right / summon:player_yanbaru_1->player_back_left / master:shield->monster:player_front_left / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は13点差で見送り、召喚は36点差で見送り
- board: PF:ボムゾウ Lv2 HP2 / PF:ドノマンティス Lv1 HP3 / PB:ピグミィ Lv2 HP3 / CF:ヒートロン Lv1 HP5 prep / CB:ガンプ Lv1 HP2

### blocked_backline_pattern_worked: ヤンバル seed 136781 turn 6

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_left / role back / front デスシープ Lv1 HP6 / stones after 4 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=3:ボムゾウ,10:ボムゾウ,12:ピグミィ,18:ヤンバル / top5BackWork=3:ボムゾウ / noReachFront=1:デスシープ,4:ドノマンティス,7:デスシープ,8:ポリスピナー,9:真勇者ダイン,11:真勇者ダイン,16:真勇者ダイン,20:ポリスピナー
- special lock: -
- next turn: attack:player_front_right:呪いの刃->master:cpu / attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:wild_claw->monster:cpu_front_left / focus:player_back_right / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: マスター特技は21点差で見送り、召喚は90点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv2 HP5 / PB:ピグミィ Lv2 HP3 / CF:ヒートロン Lv2 HP5

### blocked_no_pattern_move_forward: デスシープ seed 136781 turn 8

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_left / role front / front デスシープ Lv1 HP3 / stones after 6 / score 25
- flags: no-backline-pattern, next-move-front, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=1:ボムゾウ,8:ボムゾウ,10:ピグミィ,16:ヤンバル / top5BackWork=1:ボムゾウ / noReachFront=2:ドノマンティス,5:デスシープ,6:ポリスピナー,7:真勇者ダイン,9:真勇者ダイン,14:真勇者ダイン,18:ポリスピナー
- special lock: -
- next turn: master:wake_up->monster:cpu_back_left / attack:player_front_right:スパイクボール->monster:cpu_back_left / move:player_back_left->player_front_right / summon:player_bomuzo_2->player_back_right / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は13点差で見送り、ためるは14点差で見送り
- board: PF:デスシープ Lv1 HP3 / PF:ドノマンティス Lv2 HP2 / PB:ピグミィ Lv2 HP1 / CF:ホロウダイン Lv1 HP5 prep

### front_role_allowed_by_range: ボムゾウ seed 136781 turn 9

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role front / front デスシープ Lv1 HP6 / stones after 6 / score 23
- flags: backline-pattern, next-move-front, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=7:ボムゾウ,9:ピグミィ,15:ヤンバル / top5BackWork=- / noReachFront=1:ドノマンティス,4:デスシープ,5:ポリスピナー,6:真勇者ダイン,8:真勇者ダイン,13:真勇者ダイン,17:ポリスピナー
- special lock: -
- next turn: move:player_back_right->player_front_left / focus:player_front_right / focus:player_back_left / master:shield->monster:player_back_left / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 攻撃は109点差で見送り、召喚は149点差で見送り
- board: PF:デスシープ Lv1 HP3 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv2 HP1 / CF:ホロウダイン Lv1 HP5

### blocked_backline_pattern_worked: ヤンバル seed 136782 turn 3

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_left / role back / front デスシープ Lv1 HP6 / stones after 1 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=0
- deck pressure: deck=23 / backWork=4:ボムゾウ,8:ピグミィ,9:ピグミィ,13:ヤンバル,14:ボムゾウ,15:ピグミィ,20:ヤンバル,22:ボムゾウ / top5BackWork=4:ボムゾウ / noReachFront=1:真勇者ダイン,2:真勇者ダイン,3:ポリスピナー,5:ドノマンティス,6:デスシープ,7:ドノマンティス,10:ポリスピナー,11:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_left:attack->master:cpu / attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_right / summon:player_card_047_2->player_back_right / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は3点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / CF:フーヨウ Lv1 HP3 / CF:グングニエル Lv1 HP5 / CB:神斬丸 Lv1 HP5 prep

### blocked_no_pattern_no_work: 真勇者ダイン seed 136782 turn 4

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 28
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=3:ボムゾウ,7:ピグミィ,8:ピグミィ,12:ヤンバル,13:ボムゾウ,14:ピグミィ,19:ヤンバル,21:ボムゾウ / top5BackWork=3:ボムゾウ / noReachFront=1:真勇者ダイン,2:ポリスピナー,4:ドノマンティス,5:デスシープ,6:ドノマンティス,9:ポリスピナー,10:真勇者ダイン,11:デスシープ
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_right / attack:player_back_left:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->master:cpu / ...
- reason: 真勇者ダインを空き枠へ召喚
- board: PF:デスシープ Lv2 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv2 HP3 / CF:ゾンビ Lv1 HP4 prep / CB:神斬丸 Lv1 HP5

### bad_blocked_no_eval_trace: 真勇者ダイン seed 136782 turn 4

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 28
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=3:ボムゾウ,7:ピグミィ,8:ピグミィ,12:ヤンバル,13:ボムゾウ,14:ピグミィ,19:ヤンバル,21:ボムゾウ / top5BackWork=3:ボムゾウ / noReachFront=1:真勇者ダイン,2:ポリスピナー,4:ドノマンティス,5:デスシープ,6:ドノマンティス,9:ポリスピナー,10:真勇者ダイン,11:デスシープ
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_right / attack:player_back_left:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->master:cpu / ...
- reason: 真勇者ダインを空き枠へ召喚
- board: PF:デスシープ Lv2 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv2 HP3 / CF:ゾンビ Lv1 HP4 prep / CB:神斬丸 Lv1 HP5

### blocked_no_pattern_no_work: デスシープ seed 136783 turn 1

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_right / role front / front 真勇者ダイン Lv1 HP6 prep / stones after 0 / score 25
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=ヤンバル / noReachFront=デスシープ / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ボムゾウ,3:ピグミィ,10:ピグミィ,15:ピグミィ,16:ヤンバル,17:ヤンバル,18:ボムゾウ,24:ボムゾウ / top5BackWork=1:ボムゾウ,3:ピグミィ / noReachFront=4:ポリスピナー,6:ポリスピナー,7:ポリスピナー,8:デスシープ,9:ドノマンティス,12:ドノマンティス,13:ドノマンティス,23:真勇者ダイン
- special lock: -
- next turn: master:wake_up->monster:player_front_right / attack:cpu_front_right:ダイン斬り->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left / summon:cpu_yanbaru_3->cpu_back_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は12点差で見送り、召喚は30点差で見送り
- board: PF:グングニエル Lv1 HP5 prep / PB:フーヨウ Lv1 HP3 prep / CF:真勇者ダイン Lv1 HP6 prep / CB:真勇者ダイン Lv1 HP6 prep

### bad_blocked_no_eval_trace: デスシープ seed 136783 turn 1

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_right / role front / front 真勇者ダイン Lv1 HP6 prep / stones after 0 / score 25
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=ヤンバル / noReachFront=デスシープ / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ボムゾウ,3:ピグミィ,10:ピグミィ,15:ピグミィ,16:ヤンバル,17:ヤンバル,18:ボムゾウ,24:ボムゾウ / top5BackWork=1:ボムゾウ,3:ピグミィ / noReachFront=4:ポリスピナー,6:ポリスピナー,7:ポリスピナー,8:デスシープ,9:ドノマンティス,12:ドノマンティス,13:ドノマンティス,23:真勇者ダイン
- special lock: -
- next turn: master:wake_up->monster:player_front_right / attack:cpu_front_right:ダイン斬り->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left / summon:cpu_yanbaru_3->cpu_back_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は12点差で見送り、召喚は30点差で見送り
- board: PF:グングニエル Lv1 HP5 prep / PB:フーヨウ Lv1 HP3 prep / CF:真勇者ダイン Lv1 HP6 prep / CB:真勇者ダイン Lv1 HP6 prep

### low_stone_blocked_no_work: デスシープ seed 136783 turn 1

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_right / role front / front 真勇者ダイン Lv1 HP6 prep / stones after 0 / score 25
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=ヤンバル / noReachFront=デスシープ / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ボムゾウ,3:ピグミィ,10:ピグミィ,15:ピグミィ,16:ヤンバル,17:ヤンバル,18:ボムゾウ,24:ボムゾウ / top5BackWork=1:ボムゾウ,3:ピグミィ / noReachFront=4:ポリスピナー,6:ポリスピナー,7:ポリスピナー,8:デスシープ,9:ドノマンティス,12:ドノマンティス,13:ドノマンティス,23:真勇者ダイン
- special lock: -
- next turn: master:wake_up->monster:player_front_right / attack:cpu_front_right:ダイン斬り->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left / summon:cpu_yanbaru_3->cpu_back_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は12点差で見送り、召喚は30点差で見送り
- board: PF:グングニエル Lv1 HP5 prep / PB:フーヨウ Lv1 HP3 prep / CF:真勇者ダイン Lv1 HP6 prep / CB:真勇者ダイン Lv1 HP6 prep

### low_stone_blocked_no_work: ヤンバル seed 136783 turn 2

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_left / role back / front 真勇者ダイン Lv1 HP6 / stones after 0 / score 68
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=デスシープ / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=2:ピグミィ,9:ピグミィ,14:ピグミィ,15:ヤンバル,16:ヤンバル,17:ボムゾウ,23:ボムゾウ / top5BackWork=2:ピグミィ / noReachFront=3:ポリスピナー,5:ポリスピナー,6:ポリスピナー,7:デスシープ,8:ドノマンティス,11:ドノマンティス,12:ドノマンティス,22:真勇者ダイン
- special lock: -
- next turn: master:master_attack->monster:player_front_left / move:cpu_front_left->cpu_back_right / summon:cpu_card_133_1->cpu_back_left / end_turn
- reason: 後衛カードを後列左へ召喚 / 見送り: ためるは51点差で見送り、召喚は76点差で見送り
- board: PF:グングニエル Lv1 HP2 / PB:フーヨウ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:真勇者ダイン Lv2 HP6 / CB:デスシープ Lv1 HP6

### blocked_no_pattern_no_work: デスシープ seed 136783 turn 3

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_left / role front / front デスシープ Lv1 HP6 / stones after 0 / score 25
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=1:ピグミィ,8:ピグミィ,13:ピグミィ,14:ヤンバル,15:ヤンバル,16:ボムゾウ,22:ボムゾウ / top5BackWork=1:ピグミィ / noReachFront=2:ポリスピナー,4:ポリスピナー,5:ポリスピナー,6:デスシープ,7:ドノマンティス,10:ドノマンティス,11:ドノマンティス,21:真勇者ダイン
- special lock: -
- next turn: attack:cpu_front_right:ダイン斬り->monster:player_front_right / focus:cpu_front_left / focus:cpu_back_left / focus:cpu_back_right / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は2点差で見送り
- board: PF:神斬丸 Lv1 HP5 prep / PB:フーヨウ Lv1 HP3 / CF:デスシープ Lv1 HP6 / CF:真勇者ダイン Lv2 HP6 / CB:ヤンバル Lv1 HP3

### bad_blocked_no_eval_trace: デスシープ seed 136783 turn 3

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_left / role front / front デスシープ Lv1 HP6 / stones after 0 / score 25
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=1:ピグミィ,8:ピグミィ,13:ピグミィ,14:ヤンバル,15:ヤンバル,16:ボムゾウ,22:ボムゾウ / top5BackWork=1:ピグミィ / noReachFront=2:ポリスピナー,4:ポリスピナー,5:ポリスピナー,6:デスシープ,7:ドノマンティス,10:ドノマンティス,11:ドノマンティス,21:真勇者ダイン
- special lock: -
- next turn: attack:cpu_front_right:ダイン斬り->monster:player_front_right / focus:cpu_front_left / focus:cpu_back_left / focus:cpu_back_right / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は2点差で見送り
- board: PF:神斬丸 Lv1 HP5 prep / PB:フーヨウ Lv1 HP3 / CF:デスシープ Lv1 HP6 / CF:真勇者ダイン Lv2 HP6 / CB:ヤンバル Lv1 HP3

### low_stone_blocked_no_work: デスシープ seed 136783 turn 3

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_left / role front / front デスシープ Lv1 HP6 / stones after 0 / score 25
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=1:ピグミィ,8:ピグミィ,13:ピグミィ,14:ヤンバル,15:ヤンバル,16:ボムゾウ,22:ボムゾウ / top5BackWork=1:ピグミィ / noReachFront=2:ポリスピナー,4:ポリスピナー,5:ポリスピナー,6:デスシープ,7:ドノマンティス,10:ドノマンティス,11:ドノマンティス,21:真勇者ダイン
- special lock: -
- next turn: attack:cpu_front_right:ダイン斬り->monster:player_front_right / focus:cpu_front_left / focus:cpu_back_left / focus:cpu_back_right / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は2点差で見送り
- board: PF:神斬丸 Lv1 HP5 prep / PB:フーヨウ Lv1 HP3 / CF:デスシープ Lv1 HP6 / CF:真勇者ダイン Lv2 HP6 / CB:ヤンバル Lv1 HP3

### blocked_backline_pattern_worked: ピグミィ seed 136783 turn 6

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_left / role back / front デスシープ Lv1 HP6 / stones after 3 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=5:ピグミィ,10:ピグミィ,11:ヤンバル,12:ヤンバル,13:ボムゾウ,19:ボムゾウ / top5BackWork=5:ピグミィ / noReachFront=1:ポリスピナー,2:ポリスピナー,3:デスシープ,4:ドノマンティス,7:ドノマンティス,8:ドノマンティス,18:真勇者ダイン
- special lock: -
- next turn: attack:cpu_front_right:ダイン斬り->master:player / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: 召喚は77点差で見送り、召喚は112点差で見送り
- board: PF:ゾンビ Lv1 HP2 / PB:フーヨウ Lv1 HP3 / CF:デスシープ Lv1 HP6 / CF:真勇者ダイン Lv3 HP6 / CB:ヤンバル Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 136784 turn 6

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 6 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=2:ピグミィ,3:ボムゾウ,9:ヤンバル,13:ヤンバル,14:ピグミィ,15:ボムゾウ / top5BackWork=2:ピグミィ,3:ボムゾウ / noReachFront=1:ポリスピナー,6:真勇者ダイン,7:ポリスピナー,8:デスシープ,10:真勇者ダイン,11:ドノマンティス,12:デスシープ,17:ポリスピナー,...(+1)
- special lock: -
- next turn: magic:cpu_card_093_1->master:cpu / attack:cpu_front_left:self_bomb->monster:player_front_left / attack:cpu_front_right:ダイン斬り->monster:player_front_right / summon:cpu_card_037_3->cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は11点差で見送り
- board: PF:ゾンビ Lv1 HP2 / PB:バルキャノン Lv2 HP3 / PB:ホロウダイン Lv1 HP5 prep / CF:真勇者ダイン Lv1 HP6 / CF:デスシープ Lv2 HP6 / CB:ヤンバル Lv2 HP3

### low_stone_blocked_no_work: ドノマンティス seed 136785 turn 3

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, win)
- decision: cpu_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=7:ピグミィ,8:ヤンバル,12:ボムゾウ,14:ボムゾウ,18:ヤンバル,21:ヤンバル,22:ピグミィ / top5BackWork=- / noReachFront=1:デスシープ,4:ポリスピナー,6:ドノマンティス,10:真勇者ダイン,16:真勇者ダイン,17:真勇者ダイン,20:デスシープ
- special lock: -
- next turn: summon:cpu_card_133_1->cpu_back_left / focus:cpu_front_right / focus:cpu_front_left / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は23点差で見送り、召喚は23点差で見送り
- board: CF:デスシープ Lv1 HP6 / CF:ドノマンティス Lv1 HP5 / CB:ピグミィ Lv2 HP3

### low_stone_blocked_no_work: ドノマンティス seed 136786 turn 7

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv2 HP5 / stones after 1 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,デスシープ / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=4:ピグミィ,5:ヤンバル,9:ボムゾウ,11:ボムゾウ,15:ヤンバル,18:ヤンバル,19:ピグミィ / top5BackWork=4:ピグミィ,5:ヤンバル / noReachFront=1:ポリスピナー,3:ドノマンティス,7:真勇者ダイン,13:真勇者ダイン,14:真勇者ダイン,17:デスシープ
- special lock: -
- next turn: attack:player_front_right:呪いの刃->master:cpu / attack:player_front_left:attack->master:cpu / master:shield->monster:player_front_right / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は23点差で見送り、ためるは72点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv2 HP5 / PB:ピグミィ Lv2 HP3 / CB:バルキャノン Lv1 HP3 prep

### front_role_allowed_by_range: ボムゾウ seed 136788 turn 9

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_pressure_strong` (player, loss)
- decision: player_back_left / role front / front ヤンバル Lv1 HP2 / stones after 4 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=5:ピグミィ,6:ボムゾウ,10:ヤンバル,11:ヤンバル,12:ボムゾウ,17:ピグミィ / top5BackWork=5:ピグミィ / noReachFront=2:ポリスピナー,3:真勇者ダイン,4:デスシープ,8:デスシープ,9:真勇者ダイン,13:デスシープ,14:ドノマンティス,15:ポリスピナー,...(+1)
- special lock: -
- next turn: end_turn
- reason: ボムゾウを空き枠へ召喚 / 見送り: 攻撃は71点差で見送り、移動は93点差で見送り
- board: PF:ヤンバル Lv1 HP2 / PF:真勇者ダイン Lv1 HP4 / PB:ピグミィ Lv2 HP3 / CF:ヒートロン Lv1 HP4 / CB:バルキャノン Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 136789 turn 6

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_pressure_strong` (cpu, win)
- decision: cpu_back_left / role front / front デスシープ Lv1 HP6 / stones after 4 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,デスシープ / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=3:ボムゾウ,9:ピグミィ,11:ピグミィ,12:ヤンバル,16:ボムゾウ,18:ヤンバル / top5BackWork=3:ボムゾウ / noReachFront=1:デスシープ,2:ドノマンティス,7:ポリスピナー,8:真勇者ダイン,13:ドノマンティス,17:ポリスピナー
- special lock: -
- next turn: attack:cpu_back_right:スパイクボール->monster:player_back_right / attack:cpu_back_left:storm_bomb->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_front_left:attack->monster:player_front_left / ...
- reason: カードを後列左へ召喚 / 見送り: 移動は88点差で見送り、攻撃は91点差で見送り
- board: PF:ファントム Lv2 HP5 / PF:ゾンビ Lv2 HP1 / PB:フーヨウ Lv2 HP3 / PB:ヴァルテル Lv1 HP1 / CF:デスシープ Lv1 HP6 / CF:ドノマンティス Lv1 HP5 / CB:ピグミィ Lv2 HP3

### front_role_allowed_by_range: ボムゾウ seed 136789 turn 9

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_pressure_strong` (cpu, win)
- decision: cpu_back_right / role front / front デスシープ Lv1 HP6 prep / stones after 3 / score 23
- flags: backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=デスシープ,ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=16 / backWork=6:ピグミィ,8:ピグミィ,9:ヤンバル,13:ボムゾウ,15:ヤンバル / top5BackWork=- / noReachFront=4:ポリスピナー,5:真勇者ダイン,10:ドノマンティス,14:ポリスピナー
- special lock: -
- next turn: attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_front_left:attack->master:player / end_turn
- reason: カードを後列右へ召喚 / 見送り: 召喚は59点差で見送り、召喚は73点差で見送り
- board: PF:ヒートロン Lv2 HP3 / PB:ビヨンド Lv1 HP2 prep / CF:デスシープ Lv2 HP6 / CF:デスシープ Lv1 HP6 prep / CB:ボムゾウ Lv2 HP5


## Notes

- この監査は前衛/後衛ラベルだけではなく、後列から攻撃できるパターンを別扱いにする。
- ボムゾウのような射程持ちは `Backline Pattern` 側に入り、今回の抑制候補からは外す。
- 前が詰まった後列に、後列攻撃パターンを持たないカードを置く例が一定数ある。ここだけを抑える候補は検証価値がある。
- 詰まり後列召喚が次自ターンの攻撃/前進に変換されない例が多い。召喚の盤面評価だけでなく次ターン仕事予定が必要。
- 詰まり後列召喚の多くは射程持ちカードでもあるため、一律ペナルティは避けるべき。
- 一部の bad summon には候補評価traceがない。古い結果ファイルではなく、このスクリプトで再生成した履歴を使う必要がある。
- bad summon の多くで非召喚代替が候補上位に残っていない。召喚候補だけでなく、end_turn/focus/attack の候補品質も確認する必要がある。
- bad summon が最後の後列空き枠を消費している。後から後衛カードを引いた時の置き場を潰す問題として扱うべき。
- bad summon が最後の後列空き枠を潰し、かつ残り山札に後列仕事カードがある。手札だけでなく次以降のドロー枠を守る評価が必要。
- bad summon 時点で山札上位5枚に後列仕事カードが残る例がある。近い将来の配置詰まりとして優先度を上げて見るべき。

## Next Loop Proposal

- 次候補は、最後の後列空き枠を潰す召喚で、残り山札に後列仕事カードがある場合を `summon now` と `hold slot` のターン計画比較に回す。
- 候補 `whiteBlockedBacklineNoWorkSummonPenalty` は一括スクリーニングだけで判断せず、同一seed比較で勝率と `blocked_no_pattern_no_work` 減少が両立する値だけ中母数確認する。
- ボムゾウ等の射程持ちを許容できているか、サンプルで `front_role_allowed_by_range` を確認する。

## Reading

- `Blocked`: 同レーン前列に自軍ユニットがいる後列召喚。
- `Backline Pattern`: 後列から攻撃しうる射程/攻撃パターンをカードが持つ。ボムゾウ系はここに入る。
- `No Pattern`: 後列から攻撃しにくいカード。ここが多い場合だけ抑制候補にする。
- `Death Sheep Lock`: デスシープを後列に置いたことで、同レーン味方前列の下段特技を封じたケース。
- `No Work`: 次自ターンにその召喚ユニットが攻撃も前進もしなかったケース。
- `Bad`: Blocked + No Pattern + No Work を満たす、今回もっとも疑う後列召喚。
- `Close Non-Summon`: Bad の局面で、選択召喚から35点以内に攻撃/ためる/移動/終了などの非召喚代替があったケース。
- `Medium Non-Summon`: Bad の局面で、選択召喚から100点以内に非召喚代替があったケース。
- `DeckReach`: Bad の局面で、残り山札に後列から仕事できるカードが残っていたケース。
- `DeckTop5Reach`: Bad の局面で、山札上位5枚に後列から仕事できるカードが残っていたケース。
