# White Backline Summon Audit Loop

生成: 2026-06-30T01:21:08.083Z
seedStart: 137800
候補: current_last_back_slot_hold_plan_off, current_white_baseline, current_last_back_slot_hold_plan32, current_last_back_slot_no_reach_guard55
相手: black_1375_pressure, black_pressure_strong
試行: 2 games/matchup/direction
総試合: 32

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 234
- 後列召喚: 146 (62.4%)
- 前列あり後列召喚: 103 (70.5%)
- うち前衛ロール: 59 (57.3%)
- デスシープ後列召喚: 12 (11.7%)
- デスシープ特技封じ損: 0 (0%) / W-L 0-0
- デスシープ特技封じ平均コマンド数: 0
- Backline patternあり: 57 (55.3%)
- Backline patternなし: 46 (44.7%)
- 次自ターン攻撃: 19 (18.4%)
- 次自ターン後列攻撃: 19 (18.4%)
- 次自ターン前進: 3 (2.9%)
- 次自ターン仕事なし: 81 (78.6%)
- Bad blocked summon: 45 (43.7%)
- Bad with evaluation trace: 0 (0%)
- Bad with non-summon alt: 0 (0%)
- Bad close non-summon alt: 0 (0%)
- Bad medium non-summon alt <=100: 0 (0%)
- Bad distant non-summon alt <=200: 0 (0%)
- Bad avg best non-summon gap: 0
- Bad top summon alt: 0 (0%)
- Bad top summon same card: 0 (0%)
- Bad top summon backline pattern: 0 (0%)
- Bad with other backline work in hand: 5 (11.1%)
- Bad consumes last back slot: 35 (77.8%)
- Bad leaves no empty back slot: 35 (77.8%)
- Avg no-reach front cards in back after bad: 1.44
- Bad with deck backline work: 45 (100%)
- Bad with deck top5 backline work: 37 (82.2%)
- Bad consumes last back slot with deck backline work: 35 (77.8%)
- Avg deck backline work cards after bad: 6.6
- Avg deck top5 backline work cards after bad: 1.47

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Death Sheep Lock | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_last_back_slot_hold_plan_off | 3-5-0 | 62 | 39 (62.9%) | 26 (66.7%) | 19 (73.1%) | 0 (0%) | 12 (46.2%) | 14 (53.8%) | 3 (11.5%) | 3 (11.5%) | 1 (3.8%) | 22 (84.6%) | 13 (50%) | 0 (0%) | HandReach2, DeckReach13, DeckTop5Reach10, LastBack10, NoEmptyBack10 | 15 (57.7%) | 9/17 |
| current_white_baseline | 2-6-0 | 55 | 36 (65.5%) | 27 (75%) | 12 (44.4%) | 0 (0%) | 17 (63%) | 10 (37%) | 9 (33.3%) | 9 (33.3%) | 1 (3.7%) | 17 (63%) | 10 (37%) | 0 (0%) | HandReach1, DeckReach10, DeckTop5Reach8, LastBack9, NoEmptyBack9 | 13 (48.1%) | 7/20 |
| current_last_back_slot_hold_plan32 | 5-3-0 | 61 | 36 (59%) | 28 (77.8%) | 18 (64.3%) | 0 (0%) | 15 (53.6%) | 13 (46.4%) | 4 (14.3%) | 4 (14.3%) | 0 (0%) | 24 (85.7%) | 13 (46.4%) | 0 (0%) | HandReach1, DeckReach13, DeckTop5Reach11, LastBack11, NoEmptyBack11 | 15 (53.6%) | 20/8 |
| current_last_back_slot_no_reach_guard55 | 4-4-0 | 56 | 35 (62.5%) | 22 (62.9%) | 10 (45.5%) | 0 (0%) | 13 (59.1%) | 9 (40.9%) | 3 (13.6%) | 3 (13.6%) | 1 (4.5%) | 18 (81.8%) | 9 (40.9%) | 0 (0%) | HandReach1, DeckReach9, DeckTop5Reach8, LastBack5, NoEmptyBack5 | 11 (50%) | 16/6 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Death Sheep Lock | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_last_back_slot_hold_plan_off | black_1375_pressure | 0-4-0 | 15 | 0 (0%) | 6 (40%) | 9 (60%) | 14 (93.3%) | 8 (53.3%) | 0 (0%) |
| current_last_back_slot_hold_plan_off | black_pressure_strong | 3-1-0 | 11 | 0 (0%) | 6 (54.5%) | 5 (45.5%) | 8 (72.7%) | 5 (45.5%) | 0 (0%) |
| current_white_baseline | black_1375_pressure | 1-3-0 | 14 | 0 (0%) | 11 (78.6%) | 3 (21.4%) | 7 (50%) | 3 (21.4%) | 0 (0%) |
| current_white_baseline | black_pressure_strong | 1-3-0 | 13 | 0 (0%) | 6 (46.2%) | 7 (53.8%) | 10 (76.9%) | 7 (53.8%) | 0 (0%) |
| current_last_back_slot_hold_plan32 | black_1375_pressure | 2-2-0 | 14 | 0 (0%) | 6 (42.9%) | 8 (57.1%) | 13 (92.9%) | 8 (57.1%) | 0 (0%) |
| current_last_back_slot_hold_plan32 | black_pressure_strong | 3-1-0 | 14 | 0 (0%) | 9 (64.3%) | 5 (35.7%) | 11 (78.6%) | 5 (35.7%) | 0 (0%) |
| current_last_back_slot_no_reach_guard55 | black_1375_pressure | 2-2-0 | 10 | 0 (0%) | 7 (70%) | 3 (30%) | 8 (80%) | 3 (30%) | 0 (0%) |
| current_last_back_slot_no_reach_guard55 | black_pressure_strong | 2-2-0 | 12 | 0 (0%) | 6 (50%) | 6 (50%) | 10 (83.3%) | 6 (50%) | 0 (0%) |

## Samples

### blocked_no_pattern_no_work: ポリスピナー seed 137800 turn 2

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=14:ヤンバル,16:ヤンバル,17:ピグミィ,18:ピグミィ,22:ヤンバル,23:ボムゾウ / top5BackWork=- / noReachFront=1:真勇者ダイン,2:デスシープ,4:ドノマンティス,8:ポリスピナー,9:真勇者ダイン,10:ポリスピナー,12:真勇者ダイン,13:デスシープ,...(+2)
- special lock: -
- next turn: attack:player_front_right:self_bomb->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: ためるは33点差で見送り、ためるは33点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:ナッツロックル Lv1 HP6 prep / CF:ポリスピナー Lv1 HP3 prep / CB:ヤンバル Lv1 HP3 prep

### bad_blocked_no_eval_trace: ポリスピナー seed 137800 turn 2

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=14:ヤンバル,16:ヤンバル,17:ピグミィ,18:ピグミィ,22:ヤンバル,23:ボムゾウ / top5BackWork=- / noReachFront=1:真勇者ダイン,2:デスシープ,4:ドノマンティス,8:ポリスピナー,9:真勇者ダイン,10:ポリスピナー,12:真勇者ダイン,13:デスシープ,...(+2)
- special lock: -
- next turn: attack:player_front_right:self_bomb->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: ためるは33点差で見送り、ためるは33点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:ナッツロックル Lv1 HP6 prep / CF:ポリスピナー Lv1 HP3 prep / CB:ヤンバル Lv1 HP3 prep

### blocked_no_pattern_no_work: デスシープ seed 137800 turn 5

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 2 / score 25
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=21 / backWork=11:ヤンバル,13:ヤンバル,14:ピグミィ,15:ピグミィ,19:ヤンバル,20:ボムゾウ / top5BackWork=- / noReachFront=1:ドノマンティス,5:ポリスピナー,6:真勇者ダイン,7:ポリスピナー,9:真勇者ダイン,10:デスシープ,16:ドノマンティス,21:ドノマンティス
- special lock: -
- next turn: master:master_attack->monster:cpu_front_right / attack:player_front_left:ダイン斬り->monster:cpu_front_left / summon:player_bomuzo_1->player_front_right / summon:player_card_037_2->player_back_right / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、召喚は2点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ポリスピナー Lv2 HP3 / CF:ボムゾウ Lv1 HP6 prep / CB:ポリスピナー Lv1 HP3 prep / CB:ボムゾウ Lv2 HP5

### bad_blocked_no_eval_trace: デスシープ seed 137800 turn 5

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 2 / score 25
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=21 / backWork=11:ヤンバル,13:ヤンバル,14:ピグミィ,15:ピグミィ,19:ヤンバル,20:ボムゾウ / top5BackWork=- / noReachFront=1:ドノマンティス,5:ポリスピナー,6:真勇者ダイン,7:ポリスピナー,9:真勇者ダイン,10:デスシープ,16:ドノマンティス,21:ドノマンティス
- special lock: -
- next turn: master:master_attack->monster:cpu_front_right / attack:player_front_left:ダイン斬り->monster:cpu_front_left / summon:player_bomuzo_1->player_front_right / summon:player_card_037_2->player_back_right / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、召喚は2点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ポリスピナー Lv2 HP3 / CF:ボムゾウ Lv1 HP6 prep / CB:ポリスピナー Lv1 HP3 prep / CB:ボムゾウ Lv2 HP5

### blocked_no_pattern_no_work: ドノマンティス seed 137800 turn 6

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 prep / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=10:ヤンバル,12:ヤンバル,13:ピグミィ,14:ピグミィ,18:ヤンバル,19:ボムゾウ / top5BackWork=- / noReachFront=4:ポリスピナー,5:真勇者ダイン,6:ポリスピナー,8:真勇者ダイン,9:デスシープ,15:ドノマンティス,20:ドノマンティス
- special lock: -
- next turn: attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは32点差で見送り
- board: PF:真勇者ダイン Lv2 HP6 / PF:ボムゾウ Lv1 HP6 prep / PB:デスシープ Lv1 HP6 / CB:ポリスピナー Lv1 HP3 / CB:ユニフォーン Lv1 HP5 prep

### bad_blocked_no_eval_trace: ドノマンティス seed 137800 turn 6

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 prep / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=10:ヤンバル,12:ヤンバル,13:ピグミィ,14:ピグミィ,18:ヤンバル,19:ボムゾウ / top5BackWork=- / noReachFront=4:ポリスピナー,5:真勇者ダイン,6:ポリスピナー,8:真勇者ダイン,9:デスシープ,15:ドノマンティス,20:ドノマンティス
- special lock: -
- next turn: attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは32点差で見送り
- board: PF:真勇者ダイン Lv2 HP6 / PF:ボムゾウ Lv1 HP6 prep / PB:デスシープ Lv1 HP6 / CB:ポリスピナー Lv1 HP3 / CB:ユニフォーン Lv1 HP5 prep

### low_stone_blocked_no_work: ドノマンティス seed 137800 turn 6

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 prep / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=10:ヤンバル,12:ヤンバル,13:ピグミィ,14:ピグミィ,18:ヤンバル,19:ボムゾウ / top5BackWork=- / noReachFront=4:ポリスピナー,5:真勇者ダイン,6:ポリスピナー,8:真勇者ダイン,9:デスシープ,15:ドノマンティス,20:ドノマンティス
- special lock: -
- next turn: attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは32点差で見送り
- board: PF:真勇者ダイン Lv2 HP6 / PF:ボムゾウ Lv1 HP6 prep / PB:デスシープ Lv1 HP6 / CB:ポリスピナー Lv1 HP3 / CB:ユニフォーン Lv1 HP5 prep

### blocked_no_pattern_no_work: ポリスピナー seed 137801 turn 4

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=1:ボムゾウ,7:ボムゾウ,14:ピグミィ,18:ピグミィ,20:ピグミィ,22:ヤンバル / top5BackWork=1:ボムゾウ / noReachFront=4:デスシープ,6:真勇者ダイン,8:ドノマンティス,9:ポリスピナー,13:ドノマンティス,15:デスシープ,16:真勇者ダイン,19:デスシープ,...(+1)
- special lock: -
- next turn: attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / summon:player_bomuzo_3->player_back_left / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:真勇者ダイン Lv3 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:ポリスピナー Lv1 HP3 prep / CB:ヤンバル Lv1 HP3 prep / CB:ユニフォーン Lv1 HP5 prep

### bad_blocked_no_eval_trace: ポリスピナー seed 137801 turn 4

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=1:ボムゾウ,7:ボムゾウ,14:ピグミィ,18:ピグミィ,20:ピグミィ,22:ヤンバル / top5BackWork=1:ボムゾウ / noReachFront=4:デスシープ,6:真勇者ダイン,8:ドノマンティス,9:ポリスピナー,13:ドノマンティス,15:デスシープ,16:真勇者ダイン,19:デスシープ,...(+1)
- special lock: -
- next turn: attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / summon:player_bomuzo_3->player_back_left / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:真勇者ダイン Lv3 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:ポリスピナー Lv1 HP3 prep / CB:ヤンバル Lv1 HP3 prep / CB:ユニフォーン Lv1 HP5 prep

### front_role_allowed_by_range: ボムゾウ seed 137801 turn 5

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front 真勇者ダイン Lv3 HP6 / stones after 0 / score 23
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=6:ボムゾウ,13:ピグミィ,17:ピグミィ,19:ピグミィ,21:ヤンバル / top5BackWork=- / noReachFront=3:デスシープ,5:真勇者ダイン,7:ドノマンティス,8:ポリスピナー,12:ドノマンティス,14:デスシープ,15:真勇者ダイン,18:デスシープ,...(+1)
- special lock: -
- next turn: attack:player_front_left:ダイン斬り->monster:cpu_front_left / master:master_attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_right:attack->master:cpu / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: ためるは12点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 / PF:ボムゾウ Lv1 HP3 / PB:ポリスピナー Lv1 HP3 / CB:ヤンバル Lv1 HP3 prep / CB:ユニフォーン Lv1 HP5

### low_stone_blocked_no_work: ボムゾウ seed 137801 turn 5

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front 真勇者ダイン Lv3 HP6 / stones after 0 / score 23
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=6:ボムゾウ,13:ピグミィ,17:ピグミィ,19:ピグミィ,21:ヤンバル / top5BackWork=- / noReachFront=3:デスシープ,5:真勇者ダイン,7:ドノマンティス,8:ポリスピナー,12:ドノマンティス,14:デスシープ,15:真勇者ダイン,18:デスシープ,...(+1)
- special lock: -
- next turn: attack:player_front_left:ダイン斬り->monster:cpu_front_left / master:master_attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_right:attack->master:cpu / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: ためるは12点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 / PF:ボムゾウ Lv1 HP3 / PB:ポリスピナー Lv1 HP3 / CB:ヤンバル Lv1 HP3 prep / CB:ユニフォーン Lv1 HP5

### blocked_no_pattern_no_work: デスシープ seed 137801 turn 8

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ポリスピナー Lv1 HP1 / stones after 6 / score 25
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=18 / backWork=3:ボムゾウ,10:ピグミィ,14:ピグミィ,16:ピグミィ,18:ヤンバル / top5BackWork=3:ボムゾウ / noReachFront=2:真勇者ダイン,4:ドノマンティス,5:ポリスピナー,9:ドノマンティス,11:デスシープ,12:真勇者ダイン,15:デスシープ,17:ドノマンティス
- special lock: -
- next turn: attack:player_front_left:self_bomb->master:cpu / end_turn
- reason: デスシープを空き枠へ召喚 / 見送り: ためるは38点差で見送り、攻撃は101点差で見送り
- board: PF:ボムゾウ Lv1 HP4 / PF:ポリスピナー Lv1 HP1 / CB:ピグミィ Lv1 HP3 prep

### bad_blocked_no_eval_trace: デスシープ seed 137801 turn 8

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ポリスピナー Lv1 HP1 / stones after 6 / score 25
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=18 / backWork=3:ボムゾウ,10:ピグミィ,14:ピグミィ,16:ピグミィ,18:ヤンバル / top5BackWork=3:ボムゾウ / noReachFront=2:真勇者ダイン,4:ドノマンティス,5:ポリスピナー,9:ドノマンティス,11:デスシープ,12:真勇者ダイン,15:デスシープ,17:ドノマンティス
- special lock: -
- next turn: attack:player_front_left:self_bomb->master:cpu / end_turn
- reason: デスシープを空き枠へ召喚 / 見送り: ためるは38点差で見送り、攻撃は101点差で見送り
- board: PF:ボムゾウ Lv1 HP4 / PF:ポリスピナー Lv1 HP1 / CB:ピグミィ Lv1 HP3 prep

### blocked_no_pattern_move_forward: 真勇者ダイン seed 137802 turn 4

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv3 HP6 / stones after 3 / score 28
- flags: no-backline-pattern, next-move-front, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=2:ボムゾウ,3:ヤンバル,9:ピグミィ,10:ボムゾウ,12:ピグミィ / top5BackWork=2:ボムゾウ,3:ヤンバル / noReachFront=1:デスシープ,4:ドノマンティス,6:ドノマンティス,7:真勇者ダイン,14:ドノマンティス,15:デスシープ,16:デスシープ,17:ポリスピナー,...(+2)
- special lock: -
- next turn: move:cpu_back_left->cpu_front_right / master:master_attack->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / summon:cpu_card_133_3->cpu_back_right / ...
- reason: カードを後列左へ召喚
- board: PF:ポリスピナー Lv1 HP3 prep / PB:ヤンバル Lv1 HP3 prep / PB:ユニフォーン Lv1 HP5 prep / CF:真勇者ダイン Lv3 HP6 / CF:ボムゾウ Lv1 HP6 / CB:ピグミィ Lv1 HP3

### low_stone_blocked_no_work: デスシープ seed 137802 turn 5

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role front / front 真勇者ダイン Lv1 HP6 / stones after 1 / score 25
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=1:ボムゾウ,2:ヤンバル,8:ピグミィ,9:ボムゾウ,11:ピグミィ / top5BackWork=1:ボムゾウ,2:ヤンバル / noReachFront=3:ドノマンティス,5:ドノマンティス,6:真勇者ダイン,13:ドノマンティス,14:デスシープ,15:デスシープ,16:ポリスピナー,17:ポリスピナー,...(+1)
- special lock: -
- next turn: attack:cpu_front_right:ダイン斬り->monster:player_front_right / attack:cpu_front_left:ダイン斬り->master:player / focus:cpu_back_left / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: マスター特技は88点差で見送り、マスター特技は103点差で見送り
- board: PF:ポリスピナー Lv2 HP3 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv3 HP6 / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 137802 turn 8

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role front / front デスシープ Lv1 HP4 / stones after 7 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=5:ピグミィ,6:ボムゾウ,8:ピグミィ / top5BackWork=5:ピグミィ / noReachFront=2:ドノマンティス,3:真勇者ダイン,10:ドノマンティス,11:デスシープ,12:デスシープ,13:ポリスピナー,14:ポリスピナー,16:ポリスピナー
- special lock: -
- next turn: attack:cpu_front_left:ダイン斬り->master:player / attack:cpu_front_right:attack->master:player / master:shield->monster:cpu_front_left / end_turn
- reason: カードを後列右へ召喚 / 見送り: 召喚は85点差で見送り
- board: CF:真勇者ダイン Lv3 HP2 / CF:デスシープ Lv1 HP4 / CB:ヤンバル Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 137803 turn 9

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role front / front ドノマンティス Lv1 HP3 / stones after 6 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=16 / backWork=8:ピグミィ,12:ボムゾウ,13:ヤンバル,14:ヤンバル / top5BackWork=- / noReachFront=3:ポリスピナー,6:デスシープ,7:ドノマンティス,9:ドノマンティス,10:真勇者ダイン,11:デスシープ,15:ポリスピナー,16:真勇者ダイン
- special lock: -
- next turn: move:cpu_back_left->cpu_front_right / attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_front_left:attack->monster:player_front_left / master:shield->monster:cpu_front_right / ...
- reason: カードを後列右へ召喚 / 見送り: 攻撃は68点差で見送り、マスター特技は136点差で見送り
- board: PF:ユニフォーン Lv1 HP5 / PF:ナッツロックル Lv1 HP5 / PB:ヤンバル Lv1 HP3 prep / PB:真勇者ダイン Lv1 HP6 prep / CF:デスシープ Lv1 HP6 / CF:ドノマンティス Lv1 HP3 / CB:ポリスピナー Lv1 HP3

### blocked_backline_pattern_worked: ヤンバル seed 137804 turn 7

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role back / front 真勇者ダイン Lv1 HP6 / stones after 3 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=ピグミィ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=3:ボムゾウ,11:ピグミィ,15:ボムゾウ,16:ヤンバル,17:ヤンバル / top5BackWork=3:ボムゾウ / noReachFront=1:デスシープ,2:ポリスピナー,6:ポリスピナー,9:デスシープ,10:ドノマンティス,12:ドノマンティス,13:真勇者ダイン,14:デスシープ,...(+2)
- special lock: -
- next turn: attack:player_front_left:呪いの刃->master:cpu / master:wake_up->monster:cpu_front_left / attack:player_back_right:wild_claw->monster:cpu_front_left / end_turn
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は130点差で見送り
- board: PF:ドノマンティス Lv2 HP5 / PF:真勇者ダイン Lv1 HP6 / PB:ピグミィ Lv2 HP3 / CF:ガンプ Lv1 HP4 / CB:バルキャノン Lv1 HP2

### blocked_backline_pattern_worked: ヤンバル seed 137805 turn 2

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_pressure_strong` (player, win)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=8:ボムゾウ,9:ピグミィ,10:ボムゾウ,12:ピグミィ,13:ヤンバル,19:ピグミィ / top5BackWork=- / noReachFront=4:真勇者ダイン,6:デスシープ,7:ポリスピナー,14:ポリスピナー,15:真勇者ダイン,18:真勇者ダイン,20:デスシープ,22:ドノマンティス,...(+1)
- special lock: -
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_left:attack->monster:cpu_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは2点差で見送り、ためるは2点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:ナッツロックル Lv1 HP6 prep / CF:アンノウン Lv1 HP5 prep / CB:ヴァルテル Lv1 HP1 prep

### front_role_allowed_by_range: ボムゾウ seed 137805 turn 5

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_pressure_strong` (player, win)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 0 / score 23
- flags: backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=5:ボムゾウ,6:ピグミィ,7:ボムゾウ,9:ピグミィ,10:ヤンバル,16:ピグミィ / top5BackWork=5:ボムゾウ / noReachFront=1:真勇者ダイン,3:デスシープ,4:ポリスピナー,11:ポリスピナー,12:真勇者ダイン,15:真勇者ダイン,17:デスシープ,19:ドノマンティス,...(+1)
- special lock: -
- next turn: attack:player_front_left:wild_claw->monster:cpu_back_left / magic:player_card_031_1->monster:player_front_left / attack:player_front_left:storm_bomb->monster:cpu_back_right / attack:player_front_right:attack->master:cpu / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 召喚は118点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv2 HP3 / CB:バルキャノン Lv1 HP3 / CB:ヴァルテル Lv1 HP1

### low_stone_blocked_no_work: ボムゾウ seed 137805 turn 5

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_pressure_strong` (player, win)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 0 / score 23
- flags: backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=5:ボムゾウ,6:ピグミィ,7:ボムゾウ,9:ピグミィ,10:ヤンバル,16:ピグミィ / top5BackWork=5:ボムゾウ / noReachFront=1:真勇者ダイン,3:デスシープ,4:ポリスピナー,11:ポリスピナー,12:真勇者ダイン,15:真勇者ダイン,17:デスシープ,19:ドノマンティス,...(+1)
- special lock: -
- next turn: attack:player_front_left:wild_claw->monster:cpu_back_left / magic:player_card_031_1->monster:player_front_left / attack:player_front_left:storm_bomb->monster:cpu_back_right / attack:player_front_right:attack->master:cpu / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 召喚は118点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv2 HP3 / CB:バルキャノン Lv1 HP3 / CB:ヴァルテル Lv1 HP1

### low_stone_blocked_no_work: 真勇者ダイン seed 137805 turn 7

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_pressure_strong` (player, win)
- decision: player_back_left / role front / front ボムゾウ Lv1 HP1 / stones after 1 / score 28
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=3:ボムゾウ,4:ピグミィ,5:ボムゾウ,7:ピグミィ,8:ヤンバル,14:ピグミィ / top5BackWork=3:ボムゾウ,4:ピグミィ,5:ボムゾウ / noReachFront=1:デスシープ,2:ポリスピナー,9:ポリスピナー,10:真勇者ダイン,13:真勇者ダイン,15:デスシープ,17:ドノマンティス,19:ドノマンティス
- special lock: -
- next turn: attack:player_front_right:attack->master:cpu / focus:player_front_left / summon:player_card_133_3->player_back_left / master:shield->monster:player_front_right / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: ためるは1点差で見送り、召喚は39点差で見送り
- board: PF:ボムゾウ Lv1 HP1 / PF:デスシープ Lv2 HP3 / PB:ドノマンティス Lv1 HP3

### blocked_backline_pattern_worked: ボムゾウ seed 137807 turn 3

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_pressure_strong` (cpu, win)
- decision: cpu_back_right / role front / front ドノマンティス Lv2 HP5 / stones after 2 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=2:ピグミィ,5:ヤンバル,7:ボムゾウ,10:ボムゾウ,14:ピグミィ,16:ヤンバル,17:ヤンバル / top5BackWork=2:ピグミィ,5:ヤンバル / noReachFront=1:ドノマンティス,3:ポリスピナー,4:ドノマンティス,6:デスシープ,8:ポリスピナー,9:ポリスピナー,11:真勇者ダイン,12:真勇者ダイン,...(+2)
- special lock: -
- next turn: attack:cpu_back_left:スパイクボール->monster:player_back_left / attack:cpu_front_right:呪いの刃->master:player / attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / ...
- reason: カードを後列右へ召喚
- board: PF:ガンプ Lv1 HP5 prep / PB:フーヨウ Lv1 HP1 / CF:真勇者ダイン Lv1 HP6 / CF:ドノマンティス Lv2 HP5 / CB:ピグミィ Lv2 HP3

### front_role_allowed_by_range: ボムゾウ seed 137807 turn 3

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_pressure_strong` (cpu, win)
- decision: cpu_back_right / role front / front ドノマンティス Lv2 HP5 / stones after 2 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=2:ピグミィ,5:ヤンバル,7:ボムゾウ,10:ボムゾウ,14:ピグミィ,16:ヤンバル,17:ヤンバル / top5BackWork=2:ピグミィ,5:ヤンバル / noReachFront=1:ドノマンティス,3:ポリスピナー,4:ドノマンティス,6:デスシープ,8:ポリスピナー,9:ポリスピナー,11:真勇者ダイン,12:真勇者ダイン,...(+2)
- special lock: -
- next turn: attack:cpu_back_left:スパイクボール->monster:player_back_left / attack:cpu_front_right:呪いの刃->master:player / attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / ...
- reason: カードを後列右へ召喚
- board: PF:ガンプ Lv1 HP5 prep / PB:フーヨウ Lv1 HP1 / CF:真勇者ダイン Lv1 HP6 / CF:ドノマンティス Lv2 HP5 / CB:ピグミィ Lv2 HP3

### blocked_backline_pattern_worked: ピグミィ seed 137809 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ピグミィ,3:ヤンバル,4:ヤンバル,10:ボムゾウ,11:ボムゾウ,22:ボムゾウ,23:ヤンバル / top5BackWork=2:ピグミィ,3:ヤンバル,4:ヤンバル / noReachFront=5:真勇者ダイン,7:真勇者ダイン,9:デスシープ,12:ポリスピナー,13:デスシープ,17:ポリスピナー,20:真勇者ダイン,24:ポリスピナー
- special lock: -
- next turn: attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは2点差で見送り、ためるは2点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ヤミー Lv1 HP5 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_backline_pattern_worked: ピグミィ seed 137810 turn 1

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role back / front ドノマンティス Lv1 HP5 prep / stones after 0 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=ピグミィ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ヤンバル,4:ボムゾウ,11:ボムゾウ,12:ピグミィ,20:ボムゾウ,23:ヤンバル / top5BackWork=2:ヤンバル,4:ボムゾウ / noReachFront=3:真勇者ダイン,7:ドノマンティス,8:ポリスピナー,13:真勇者ダイン,14:ドノマンティス,15:ポリスピナー,17:真勇者ダイン,18:デスシープ,...(+3)
- special lock: -
- next turn: attack:cpu_front_left:wild_claw->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / summon:cpu_card_051_2->cpu_back_left / attack:cpu_back_right:スパイクボール->monster:player_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、召喚は115点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 prep / PF:ユニフォーン Lv1 HP5 prep / PB:ピグミィ Lv1 HP3 prep / CF:ドノマンティス Lv1 HP5 prep / CB:ヤンバル Lv1 HP3 prep


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
