# White Backline Summon Audit Loop

生成: 2026-06-30T01:28:08.960Z
seedStart: 138000
候補: current_last_back_slot_no_reach_guard35, current_white_baseline, current_last_back_slot_hold_plan20
相手: black_1375_pressure, black_pressure_strong
試行: 2 games/matchup/direction
総試合: 24

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 206
- 後列召喚: 140 (68%)
- 前列あり後列召喚: 93 (66.4%)
- うち前衛ロール: 48 (51.6%)
- デスシープ後列召喚: 3 (3.2%)
- デスシープ特技封じ損: 0 (0%) / W-L 0-0
- デスシープ特技封じ平均コマンド数: 0
- Backline patternあり: 58 (62.4%)
- Backline patternなし: 35 (37.6%)
- 次自ターン攻撃: 26 (28%)
- 次自ターン後列攻撃: 26 (28%)
- 次自ターン前進: 0 (0%)
- 次自ターン仕事なし: 67 (72%)
- Bad blocked summon: 35 (37.6%)
- Bad with evaluation trace: 0 (0%)
- Bad with non-summon alt: 0 (0%)
- Bad close non-summon alt: 0 (0%)
- Bad medium non-summon alt <=100: 0 (0%)
- Bad distant non-summon alt <=200: 0 (0%)
- Bad avg best non-summon gap: 0
- Bad top summon alt: 0 (0%)
- Bad top summon same card: 0 (0%)
- Bad top summon backline pattern: 0 (0%)
- Bad with other backline work in hand: 4 (11.4%)
- Bad consumes last back slot: 25 (71.4%)
- Bad leaves no empty back slot: 25 (71.4%)
- Avg no-reach front cards in back after bad: 1.23
- Bad with deck backline work: 35 (100%)
- Bad with deck top5 backline work: 33 (94.3%)
- Bad consumes last back slot with deck backline work: 25 (71.4%)
- Avg deck backline work cards after bad: 5.89
- Avg deck top5 backline work cards after bad: 1.6

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Death Sheep Lock | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_last_back_slot_no_reach_guard35 | 1-7-0 | 65 | 43 (66.2%) | 26 (60.5%) | 11 (42.3%) | 0 (0%) | 19 (73.1%) | 7 (26.9%) | 11 (42.3%) | 11 (42.3%) | 0 (0%) | 15 (57.7%) | 7 (26.9%) | 0 (0%) | HandReach1, DeckReach7, DeckTop5Reach7, LastBack6, NoEmptyBack6 | 11 (42.3%) | 5/21 |
| current_white_baseline | 2-6-0 | 72 | 51 (70.8%) | 35 (68.6%) | 18 (51.4%) | 0 (0%) | 22 (62.9%) | 13 (37.1%) | 9 (25.7%) | 9 (25.7%) | 0 (0%) | 26 (74.3%) | 13 (37.1%) | 0 (0%) | HandReach2, DeckReach13, DeckTop5Reach12, LastBack9, NoEmptyBack9 | 17 (48.6%) | 11/24 |
| current_last_back_slot_hold_plan20 | 3-5-0 | 69 | 46 (66.7%) | 32 (69.6%) | 19 (59.4%) | 0 (0%) | 17 (53.1%) | 15 (46.9%) | 6 (18.8%) | 6 (18.8%) | 0 (0%) | 26 (81.3%) | 15 (46.9%) | 0 (0%) | HandReach1, DeckReach15, DeckTop5Reach14, LastBack10, NoEmptyBack10 | 11 (34.4%) | 12/20 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Death Sheep Lock | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_last_back_slot_no_reach_guard35 | black_1375_pressure | 0-4-0 | 14 | 0 (0%) | 8 (57.1%) | 6 (42.9%) | 10 (71.4%) | 6 (42.9%) | 0 (0%) |
| current_last_back_slot_no_reach_guard35 | black_pressure_strong | 1-3-0 | 12 | 0 (0%) | 11 (91.7%) | 1 (8.3%) | 5 (41.7%) | 1 (8.3%) | 0 (0%) |
| current_white_baseline | black_1375_pressure | 2-2-0 | 18 | 0 (0%) | 13 (72.2%) | 5 (27.8%) | 11 (61.1%) | 5 (27.8%) | 0 (0%) |
| current_white_baseline | black_pressure_strong | 0-4-0 | 17 | 0 (0%) | 9 (52.9%) | 8 (47.1%) | 15 (88.2%) | 8 (47.1%) | 0 (0%) |
| current_last_back_slot_hold_plan20 | black_1375_pressure | 2-2-0 | 19 | 0 (0%) | 10 (52.6%) | 9 (47.4%) | 15 (78.9%) | 9 (47.4%) | 0 (0%) |
| current_last_back_slot_hold_plan20 | black_pressure_strong | 1-3-0 | 13 | 0 (0%) | 7 (53.8%) | 6 (46.2%) | 11 (84.6%) | 6 (46.2%) | 0 (0%) |

## Samples

### blocked_backline_pattern_worked: ヤンバル seed 138000 turn 2

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ピグミィ,6:ボムゾウ,8:ボムゾウ,9:ヤンバル,14:ヤンバル,16:ボムゾウ,23:ピグミィ / top5BackWork=1:ピグミィ / noReachFront=2:ポリスピナー,3:デスシープ,7:ドノマンティス,10:ドノマンティス,12:デスシープ,13:デスシープ,19:ポリスピナー,20:真勇者ダイン,...(+2)
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは2点差で見送り、ためるは2点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ボムゾウ Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_no_pattern_no_work: ポリスピナー seed 138000 turn 7

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front 真勇者ダイン Lv3 HP1 / stones after 5 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=1:ボムゾウ,3:ボムゾウ,4:ヤンバル,9:ヤンバル,11:ボムゾウ,18:ピグミィ / top5BackWork=1:ボムゾウ,3:ボムゾウ,4:ヤンバル / noReachFront=2:ドノマンティス,5:ドノマンティス,7:デスシープ,8:デスシープ,14:ポリスピナー,15:真勇者ダイン,16:真勇者ダイン,17:ポリスピナー
- special lock: -
- next turn: focus:player_front_left / master:wake_up->monster:cpu_front_left / attack:player_front_right:attack->master:cpu / attack:player_front_left:attack->monster:cpu_front_left / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:真勇者ダイン Lv3 HP1 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3

### bad_blocked_no_eval_trace: ポリスピナー seed 138000 turn 7

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front 真勇者ダイン Lv3 HP1 / stones after 5 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=1:ボムゾウ,3:ボムゾウ,4:ヤンバル,9:ヤンバル,11:ボムゾウ,18:ピグミィ / top5BackWork=1:ボムゾウ,3:ボムゾウ,4:ヤンバル / noReachFront=2:ドノマンティス,5:ドノマンティス,7:デスシープ,8:デスシープ,14:ポリスピナー,15:真勇者ダイン,16:真勇者ダイン,17:ポリスピナー
- special lock: -
- next turn: focus:player_front_left / master:wake_up->monster:cpu_front_left / attack:player_front_right:attack->master:cpu / attack:player_front_left:attack->monster:cpu_front_left / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:真勇者ダイン Lv3 HP1 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3

### blocked_no_pattern_no_work: ポリスピナー seed 138001 turn 7

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 0 / score 26
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=1:ヤンバル,6:ボムゾウ,7:ピグミィ,10:ピグミィ,14:ヤンバル,16:ヤンバル,17:ボムゾウ,19:ピグミィ / top5BackWork=1:ヤンバル / noReachFront=2:ポリスピナー,3:真勇者ダイン,4:デスシープ,8:デスシープ,9:デスシープ,12:ドノマンティス,13:真勇者ダイン,15:真勇者ダイン
- special lock: -
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / summon:player_yanbaru_2->player_back_left / focus:player_back_right / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:ドノマンティス Lv2 HP1 / PF:ドノマンティス Lv1 HP5 / PB:ボムゾウ Lv2 HP5 / CF:ユニフォーン Lv1 HP5 prep / CB:ピグミィ Lv1 HP3 prep / CB:ナッツロックル Lv1 HP6

### bad_blocked_no_eval_trace: ポリスピナー seed 138001 turn 7

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 0 / score 26
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=1:ヤンバル,6:ボムゾウ,7:ピグミィ,10:ピグミィ,14:ヤンバル,16:ヤンバル,17:ボムゾウ,19:ピグミィ / top5BackWork=1:ヤンバル / noReachFront=2:ポリスピナー,3:真勇者ダイン,4:デスシープ,8:デスシープ,9:デスシープ,12:ドノマンティス,13:真勇者ダイン,15:真勇者ダイン
- special lock: -
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / summon:player_yanbaru_2->player_back_left / focus:player_back_right / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:ドノマンティス Lv2 HP1 / PF:ドノマンティス Lv1 HP5 / PB:ボムゾウ Lv2 HP5 / CF:ユニフォーン Lv1 HP5 prep / CB:ピグミィ Lv1 HP3 prep / CB:ナッツロックル Lv1 HP6

### low_stone_blocked_no_work: ポリスピナー seed 138001 turn 7

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 0 / score 26
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=1:ヤンバル,6:ボムゾウ,7:ピグミィ,10:ピグミィ,14:ヤンバル,16:ヤンバル,17:ボムゾウ,19:ピグミィ / top5BackWork=1:ヤンバル / noReachFront=2:ポリスピナー,3:真勇者ダイン,4:デスシープ,8:デスシープ,9:デスシープ,12:ドノマンティス,13:真勇者ダイン,15:真勇者ダイン
- special lock: -
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / summon:player_yanbaru_2->player_back_left / focus:player_back_right / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:ドノマンティス Lv2 HP1 / PF:ドノマンティス Lv1 HP5 / PB:ボムゾウ Lv2 HP5 / CF:ユニフォーン Lv1 HP5 prep / CB:ピグミィ Lv1 HP3 prep / CB:ナッツロックル Lv1 HP6

### blocked_no_pattern_no_work: ポリスピナー seed 138001 turn 9

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ヤンバル Lv1 HP3 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=4:ボムゾウ,5:ピグミィ,8:ピグミィ,12:ヤンバル,14:ヤンバル,15:ボムゾウ,17:ピグミィ / top5BackWork=4:ボムゾウ,5:ピグミィ / noReachFront=1:真勇者ダイン,2:デスシープ,6:デスシープ,7:デスシープ,10:ドノマンティス,11:真勇者ダイン,13:真勇者ダイン
- special lock: -
- next turn: attack:player_front_right:呪いの刃->master:cpu / master:shield->monster:player_front_left / end_turn
- reason: ポリスピナーを空き枠へ召喚
- board: PF:ヤンバル Lv1 HP3 / PF:ドノマンティス Lv2 HP5 / PB:ポリスピナー Lv1 HP3 / CF:ユニフォーン Lv1 HP5 prep / CB:ピグミィ Lv1 HP3 prep / CB:ナッツロックル Lv1 HP6

### bad_blocked_no_eval_trace: ポリスピナー seed 138001 turn 9

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ヤンバル Lv1 HP3 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=4:ボムゾウ,5:ピグミィ,8:ピグミィ,12:ヤンバル,14:ヤンバル,15:ボムゾウ,17:ピグミィ / top5BackWork=4:ボムゾウ,5:ピグミィ / noReachFront=1:真勇者ダイン,2:デスシープ,6:デスシープ,7:デスシープ,10:ドノマンティス,11:真勇者ダイン,13:真勇者ダイン
- special lock: -
- next turn: attack:player_front_right:呪いの刃->master:cpu / master:shield->monster:player_front_left / end_turn
- reason: ポリスピナーを空き枠へ召喚
- board: PF:ヤンバル Lv1 HP3 / PF:ドノマンティス Lv2 HP5 / PB:ポリスピナー Lv1 HP3 / CF:ユニフォーン Lv1 HP5 prep / CB:ピグミィ Lv1 HP3 prep / CB:ナッツロックル Lv1 HP6

### front_role_allowed_by_range: ボムゾウ seed 138002 turn 2

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role front / front ポリスピナー Lv1 HP3 / stones after 3 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,真勇者ダイン / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=3:ピグミィ,6:ピグミィ,9:ヤンバル,16:ボムゾウ,17:ピグミィ,18:ボムゾウ,20:ヤンバル / top5BackWork=3:ピグミィ / noReachFront=1:ポリスピナー,2:デスシープ,4:真勇者ダイン,5:デスシープ,8:ドノマンティス,10:ドノマンティス,11:ドノマンティス,23:デスシープ
- special lock: -
- next turn: attack:cpu_back_left:wild_claw->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_front_right:storm_bomb->monster:player_front_left / summon:cpu_card_047_1->cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: 攻撃は110点差で見送り、ためるは138点差で見送り
- board: PF:真勇者ダイン Lv1 HP5 / PF:ボムゾウ Lv1 HP1 / PB:ポリスピナー Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ポリスピナー Lv1 HP3 / CB:ヤンバル Lv1 HP3

### blocked_no_pattern_no_work: 真勇者ダイン seed 138002 turn 3

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role front / front ボムゾウ Lv2 HP5 / stones after 2 / score 28
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=2:ピグミィ,5:ピグミィ,8:ヤンバル,15:ボムゾウ,16:ピグミィ,17:ボムゾウ,19:ヤンバル / top5BackWork=2:ピグミィ,5:ピグミィ / noReachFront=1:デスシープ,3:真勇者ダイン,4:デスシープ,7:ドノマンティス,9:ドノマンティス,10:ドノマンティス,22:デスシープ
- special lock: -
- next turn: attack:cpu_back_left:wild_claw->monster:player_front_right / master:master_attack->monster:player_front_right / attack:cpu_front_right:self_bomb->monster:player_front_right / focus:cpu_front_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は39点差で見送り、召喚は39点差で見送り
- board: PB:ボムゾウ Lv1 HP6 prep / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv2 HP5 / CB:ヤンバル Lv2 HP3

### bad_blocked_no_eval_trace: 真勇者ダイン seed 138002 turn 3

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role front / front ボムゾウ Lv2 HP5 / stones after 2 / score 28
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=2:ピグミィ,5:ピグミィ,8:ヤンバル,15:ボムゾウ,16:ピグミィ,17:ボムゾウ,19:ヤンバル / top5BackWork=2:ピグミィ,5:ピグミィ / noReachFront=1:デスシープ,3:真勇者ダイン,4:デスシープ,7:ドノマンティス,9:ドノマンティス,10:ドノマンティス,22:デスシープ
- special lock: -
- next turn: attack:cpu_back_left:wild_claw->monster:player_front_right / master:master_attack->monster:player_front_right / attack:cpu_front_right:self_bomb->monster:player_front_right / focus:cpu_front_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は39点差で見送り、召喚は39点差で見送り
- board: PB:ボムゾウ Lv1 HP6 prep / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv2 HP5 / CB:ヤンバル Lv2 HP3

### blocked_backline_pattern_worked: ピグミィ seed 138002 turn 5

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role back / front 真勇者ダイン Lv1 HP6 / stones after 4 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ポリスピナー,デスシープ / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=3:ピグミィ,6:ヤンバル,13:ボムゾウ,14:ピグミィ,15:ボムゾウ,17:ヤンバル / top5BackWork=3:ピグミィ / noReachFront=1:真勇者ダイン,2:デスシープ,5:ドノマンティス,7:ドノマンティス,8:ドノマンティス,20:デスシープ
- special lock: -
- next turn: attack:cpu_front_left:wild_claw->monster:player_back_left / attack:cpu_front_right:ダイン斬り->master:player / attack:cpu_back_right:スパイクボール->monster:player_front_left / summon:cpu_card_047_2->cpu_back_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 攻撃は44点差で見送り、マスター特技は174点差で見送り
- board: PF:ナッツロックル Lv1 HP6 / PF:ユニフォーン Lv1 HP5 / PB:ピグミィ Lv1 HP3 prep / CF:真勇者ダイン Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CB:ヤンバル Lv2 HP3

### blocked_no_pattern_no_work: 真勇者ダイン seed 138002 turn 6

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_left / role front / front ヤンバル Lv2 HP1 / stones after 4 / score 28
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ポリスピナー,デスシープ / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=2:ピグミィ,5:ヤンバル,12:ボムゾウ,13:ピグミィ,14:ボムゾウ,16:ヤンバル / top5BackWork=2:ピグミィ,5:ヤンバル / noReachFront=1:デスシープ,4:ドノマンティス,6:ドノマンティス,7:ドノマンティス,19:デスシープ
- special lock: -
- next turn: attack:cpu_front_left:attack->master:player / attack:cpu_front_left:attack->master:player / attack:cpu_front_right:ダイン斬り->master:player / summon:cpu_card_133_3->cpu_back_right / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は39点差で見送り、召喚は39点差で見送り
- board: PF:ナッツロックル Lv1 HP3 / CF:ヤンバル Lv2 HP1 / CF:真勇者ダイン Lv2 HP6 / CB:ピグミィ Lv1 HP3

### bad_blocked_no_eval_trace: 真勇者ダイン seed 138002 turn 6

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_left / role front / front ヤンバル Lv2 HP1 / stones after 4 / score 28
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ポリスピナー,デスシープ / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=2:ピグミィ,5:ヤンバル,12:ボムゾウ,13:ピグミィ,14:ボムゾウ,16:ヤンバル / top5BackWork=2:ピグミィ,5:ヤンバル / noReachFront=1:デスシープ,4:ドノマンティス,6:ドノマンティス,7:ドノマンティス,19:デスシープ
- special lock: -
- next turn: attack:cpu_front_left:attack->master:player / attack:cpu_front_left:attack->master:player / attack:cpu_front_right:ダイン斬り->master:player / summon:cpu_card_133_3->cpu_back_right / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は39点差で見送り、召喚は39点差で見送り
- board: PF:ナッツロックル Lv1 HP3 / CF:ヤンバル Lv2 HP1 / CF:真勇者ダイン Lv2 HP6 / CB:ピグミィ Lv1 HP3

### blocked_backline_pattern_worked: ヤンバル seed 138003 turn 2

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role back / front ボムゾウ Lv2 HP5 / stones after 3 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=1:ヤンバル,4:ピグミィ,9:ボムゾウ,15:ピグミィ,18:ヤンバル,19:ピグミィ / top5BackWork=1:ヤンバル,4:ピグミィ / noReachFront=5:ドノマンティス,6:真勇者ダイン,7:真勇者ダイン,8:ドノマンティス,12:真勇者ダイン,13:ポリスピナー,14:ドノマンティス,16:ポリスピナー,...(+1)
- special lock: -
- next turn: master:wake_up->monster:player_front_right / attack:cpu_front_right:self_bomb->monster:player_front_right / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_back_right:wild_claw->monster:player_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: マジックは31点差で見送り、マジックは31点差で見送り
- board: PF:ボムゾウ Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 / CF:ボムゾウ Lv2 HP5 / CB:デスシープ Lv1 HP6

### blocked_backline_pattern_worked: ヤンバル seed 138003 turn 4

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_left / role back / front デスシープ Lv2 HP6 / stones after 3 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=2:ピグミィ,7:ボムゾウ,13:ピグミィ,16:ヤンバル,17:ピグミィ / top5BackWork=2:ピグミィ / noReachFront=3:ドノマンティス,4:真勇者ダイン,5:真勇者ダイン,6:ドノマンティス,10:真勇者ダイン,11:ポリスピナー,12:ドノマンティス,14:ポリスピナー,...(+1)
- special lock: -
- next turn: attack:cpu_front_left:attack->master:player / attack:cpu_back_left:wild_claw->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / master:shield->monster:cpu_front_left / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: ためるは14点差で見送り、ためるは67点差で見送り
- board: PB:ユニフォーン Lv1 HP4 / CF:デスシープ Lv2 HP6 / CF:デスシープ Lv1 HP6 / CB:ヤンバル Lv1 HP3

### blocked_backline_pattern_worked: ボムゾウ seed 138004 turn 2

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 2 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ヤンバル,2:ヤンバル,5:ピグミィ,10:ボムゾウ,16:ピグミィ,19:ヤンバル,20:ピグミィ / top5BackWork=1:ヤンバル,2:ヤンバル,5:ピグミィ / noReachFront=6:ドノマンティス,7:真勇者ダイン,8:真勇者ダイン,9:ドノマンティス,13:真勇者ダイン,14:ポリスピナー,15:ドノマンティス,17:ポリスピナー,...(+1)
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_back_right:storm_bomb->monster:cpu_front_left / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 召喚は132点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:デスシープ Lv1 HP6 / CF:神斬丸 Lv1 HP5 prep / CF:ガンプ Lv1 HP5 prep / CB:フーヨウ Lv1 HP3 prep

### front_role_allowed_by_range: ボムゾウ seed 138004 turn 2

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 2 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ヤンバル,2:ヤンバル,5:ピグミィ,10:ボムゾウ,16:ピグミィ,19:ヤンバル,20:ピグミィ / top5BackWork=1:ヤンバル,2:ヤンバル,5:ピグミィ / noReachFront=6:ドノマンティス,7:真勇者ダイン,8:真勇者ダイン,9:ドノマンティス,13:真勇者ダイン,14:ポリスピナー,15:ドノマンティス,17:ポリスピナー,...(+1)
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_back_right:storm_bomb->monster:cpu_front_left / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 召喚は132点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:デスシープ Lv1 HP6 / CF:神斬丸 Lv1 HP5 prep / CF:ガンプ Lv1 HP5 prep / CB:フーヨウ Lv1 HP3 prep

### low_stone_blocked_no_work: ピグミィ seed 138005 turn 1

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 prep / stones after 0 / score 67
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=25 / backWork=3:ヤンバル,12:ピグミィ,16:ボムゾウ,17:ヤンバル,22:ボムゾウ,23:ボムゾウ,25:ピグミィ / top5BackWork=3:ヤンバル / noReachFront=2:ドノマンティス,5:ポリスピナー,7:真勇者ダイン,8:デスシープ,10:ポリスピナー,13:デスシープ,15:真勇者ダイン,18:真勇者ダイン,...(+3)
- special lock: -
- next turn: move:player_front_left->player_back_right / focus:player_front_right / master:shield->monster:player_front_right / end_turn
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は92点差で見送り
- board: PF:ドノマンティス Lv1 HP5 prep / PB:ヤンバル Lv1 HP3 prep

### front_role_allowed_by_range: ボムゾウ seed 138006 turn 3

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_left / role front / front ピグミィ Lv2 HP3 / stones after 2 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=1:ヤンバル,6:ヤンバル,7:ボムゾウ,13:ピグミィ,14:ピグミィ,17:ボムゾウ / top5BackWork=1:ヤンバル / noReachFront=2:真勇者ダイン,3:真勇者ダイン,8:真勇者ダイン,10:デスシープ,11:ドノマンティス,12:デスシープ,16:ドノマンティス,18:ポリスピナー,...(+2)
- special lock: -
- next turn: attack:cpu_back_left:storm_bomb->monster:player_front_right / move:cpu_front_left->cpu_back_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / summon:cpu_yanbaru_2->cpu_front_left / ...
- reason: カードを後列左へ召喚 / 見送り: 攻撃は56点差で見送り、移動は63点差で見送り
- board: PF:ナッツロックル Lv1 HP6 prep / PB:フーヨウ Lv1 HP3 / CF:ピグミィ Lv2 HP3 / CF:ポリスピナー Lv2 HP3 / CB:ヤンバル Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 138007 turn 7

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_pressure_strong` (cpu, win)
- decision: cpu_back_right / role front / front ボムゾウ Lv1 HP6 prep / stones after 7 / score 23
- flags: backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=2:ピグミィ,14:ボムゾウ,18:ヤンバル / top5BackWork=2:ピグミィ / noReachFront=3:デスシープ,6:ポリスピナー,9:デスシープ,11:ポリスピナー,12:真勇者ダイン,13:真勇者ダイン,16:ドノマンティス,17:デスシープ
- special lock: -
- next turn: master:master_attack->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / focus:cpu_front_right / focus:cpu_back_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は85点差で見送り
- board: PF:ヒートロン Lv1 HP5 prep / CF:真勇者ダイン Lv2 HP3 / CF:ボムゾウ Lv1 HP6 prep / CB:ドノマンティス Lv1 HP5 prep

### front_role_allowed_by_range: ボムゾウ seed 138010 turn 12

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 23
- flags: backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=13 / backWork=1:ボムゾウ,3:ピグミィ,5:ボムゾウ / top5BackWork=1:ボムゾウ,3:ピグミィ,5:ボムゾウ / noReachFront=2:デスシープ,4:真勇者ダイン,6:真勇者ダイン,8:ドノマンティス,9:ポリスピナー,13:ポリスピナー
- special lock: -
- next turn: master:master_attack->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / summon:cpu_card_037_3->cpu_back_left / focus:cpu_front_right / ...
- reason: カードを後列右へ召喚 / 見送り: マスター特技は45点差で見送り、攻撃は58点差で見送り
- board: PF:ナッツロックル Lv1 HP4 / PB:ボムゾウ Lv1 HP6 prep / CF:真勇者ダイン Lv3 HP6 / CF:ドノマンティス Lv1 HP5 / CB:ピグミィ Lv1 HP3 prep

### low_stone_blocked_no_work: ドノマンティス seed 138010 turn 13

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv3 HP3 / stones after 1 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=ポリスピナー / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=12 / backWork=2:ピグミィ,4:ボムゾウ / top5BackWork=2:ピグミィ,4:ボムゾウ / noReachFront=1:デスシープ,3:真勇者ダイン,5:真勇者ダイン,7:ドノマンティス,8:ポリスピナー,12:ポリスピナー
- special lock: -
- next turn: attack:cpu_front_left:ダイン斬り->master:player / summon:cpu_polyspinner_1->cpu_back_right / attack:cpu_front_right:self_bomb->master:player / focus:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は63点差で見送り
- board: CF:真勇者ダイン Lv3 HP3 / CF:ボムゾウ Lv1 HP6

### low_stone_blocked_no_work: ボムゾウ seed 138010 turn 13

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 0 / score 23
- flags: backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=12 / backWork=2:ピグミィ,4:ボムゾウ / top5BackWork=2:ピグミィ,4:ボムゾウ / noReachFront=1:デスシープ,3:真勇者ダイン,5:真勇者ダイン,7:ドノマンティス,8:ポリスピナー,12:ポリスピナー
- special lock: -
- next turn: attack:cpu_front_left:ダイン斬り->master:player / summon:cpu_polyspinner_1->cpu_back_right / attack:cpu_front_right:self_bomb->master:player / focus:cpu_back_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は186点差で見送り
- board: CF:真勇者ダイン Lv3 HP3 / CF:ボムゾウ Lv1 HP6 / CB:ドノマンティス Lv1 HP5 prep

### low_stone_blocked_no_work: ポリスピナー seed 138011 turn 10

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_left / role front / front デスシープ Lv2 HP6 / stones after 0 / score 26
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=15 / backWork=1:ピグミィ,7:ピグミィ,10:ピグミィ / top5BackWork=1:ピグミィ / noReachFront=2:ドノマンティス,3:デスシープ,5:ドノマンティス,6:真勇者ダイン,12:ポリスピナー,13:ドノマンティス,14:デスシープ,15:真勇者ダイン
- special lock: -
- next turn: attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_front_right:wild_claw->monster:player_front_left / summon:cpu_card_051_3->cpu_back_right / master:wake_up->monster:cpu_back_right / ...
- reason: カードを後列左へ召喚
- board: PF:ナッツロックル Lv1 HP6 / PB:真勇者ダイン Lv1 HP6 prep / PB:ボムゾウ Lv1 HP6 prep / CF:デスシープ Lv2 HP6 / CF:ボムゾウ Lv2 HP2 / CB:ヤンバル Lv2 HP3


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
