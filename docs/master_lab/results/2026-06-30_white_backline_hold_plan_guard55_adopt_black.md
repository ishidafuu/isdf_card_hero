# White Backline Summon Audit Loop

生成: 2026-06-30T01:24:24.505Z
seedStart: 137900
候補: current_last_back_slot_hold_plan_off, current_last_back_slot_no_reach_guard35, current_white_baseline
相手: black_1375_pressure, black_pressure_strong
試行: 2 games/matchup/direction
総試合: 24

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 195
- 後列召喚: 127 (65.1%)
- 前列あり後列召喚: 86 (67.7%)
- うち前衛ロール: 35 (40.7%)
- デスシープ後列召喚: 6 (7%)
- デスシープ特技封じ損: 1 (16.7%) / W-L 0-1
- デスシープ特技封じ平均コマンド数: 1
- Backline patternあり: 61 (70.9%)
- Backline patternなし: 25 (29.1%)
- 次自ターン攻撃: 22 (25.6%)
- 次自ターン後列攻撃: 22 (25.6%)
- 次自ターン前進: 2 (2.3%)
- 次自ターン仕事なし: 62 (72.1%)
- Bad blocked summon: 25 (29.1%)
- Bad with evaluation trace: 0 (0%)
- Bad with non-summon alt: 0 (0%)
- Bad close non-summon alt: 0 (0%)
- Bad medium non-summon alt <=100: 0 (0%)
- Bad distant non-summon alt <=200: 0 (0%)
- Bad avg best non-summon gap: 0
- Bad top summon alt: 0 (0%)
- Bad top summon same card: 0 (0%)
- Bad top summon backline pattern: 0 (0%)
- Bad with other backline work in hand: 2 (8%)
- Bad consumes last back slot: 19 (76%)
- Bad leaves no empty back slot: 19 (76%)
- Avg no-reach front cards in back after bad: 1.24
- Bad with deck backline work: 25 (100%)
- Bad with deck top5 backline work: 24 (96%)
- Bad consumes last back slot with deck backline work: 19 (76%)
- Avg deck backline work cards after bad: 6.6
- Avg deck top5 backline work cards after bad: 1.68

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Death Sheep Lock | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_last_back_slot_hold_plan_off | 4-4-0 | 63 | 44 (69.8%) | 33 (75%) | 13 (39.4%) | 0 (0%) | 23 (69.7%) | 10 (30.3%) | 8 (24.2%) | 8 (24.2%) | 0 (0%) | 25 (75.8%) | 10 (30.3%) | 0 (0%) | DeckReach10, DeckTop5Reach9, LastBack9, NoEmptyBack9 | 14 (42.4%) | 21/12 |
| current_last_back_slot_no_reach_guard35 | 2-6-0 | 65 | 39 (60%) | 26 (66.7%) | 13 (50%) | 1 (50%) | 17 (65.4%) | 9 (34.6%) | 2 (7.7%) | 2 (7.7%) | 2 (7.7%) | 22 (84.6%) | 9 (34.6%) | 0 (0%) | HandReach1, DeckReach9, DeckTop5Reach9, LastBack5, NoEmptyBack5 | 14 (53.8%) | 3/23 |
| current_white_baseline | 2-6-0 | 67 | 44 (65.7%) | 27 (61.4%) | 9 (33.3%) | 0 (0%) | 21 (77.8%) | 6 (22.2%) | 12 (44.4%) | 12 (44.4%) | 0 (0%) | 15 (55.6%) | 6 (22.2%) | 0 (0%) | HandReach1, DeckReach6, DeckTop5Reach6, LastBack5, NoEmptyBack5 | 11 (40.7%) | 9/18 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Death Sheep Lock | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_last_back_slot_hold_plan_off | black_1375_pressure | 2-2-0 | 17 | 0 (0%) | 12 (70.6%) | 5 (29.4%) | 13 (76.5%) | 5 (29.4%) | 0 (0%) |
| current_last_back_slot_hold_plan_off | black_pressure_strong | 2-2-0 | 16 | 0 (0%) | 11 (68.8%) | 5 (31.3%) | 12 (75%) | 5 (31.3%) | 0 (0%) |
| current_last_back_slot_no_reach_guard35 | black_1375_pressure | 1-3-0 | 17 | 1 (100%) | 11 (64.7%) | 6 (35.3%) | 17 (100%) | 6 (35.3%) | 0 (0%) |
| current_last_back_slot_no_reach_guard35 | black_pressure_strong | 1-3-0 | 9 | 0 (0%) | 6 (66.7%) | 3 (33.3%) | 5 (55.6%) | 3 (33.3%) | 0 (0%) |
| current_white_baseline | black_1375_pressure | 1-3-0 | 14 | 0 (0%) | 11 (78.6%) | 3 (21.4%) | 7 (50%) | 3 (21.4%) | 0 (0%) |
| current_white_baseline | black_pressure_strong | 1-3-0 | 13 | 0 (0%) | 10 (76.9%) | 3 (23.1%) | 8 (61.5%) | 3 (23.1%) | 0 (0%) |

## Samples

### blocked_backline_pattern_worked: ボムゾウ seed 137900 turn 2

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front デスシープ Lv1 HP6 / stones after 2 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ヤンバル,3:ボムゾウ,12:ボムゾウ,14:ピグミィ,16:ヤンバル,17:ピグミィ,19:ヤンバル,20:ピグミィ / top5BackWork=1:ヤンバル,3:ボムゾウ / noReachFront=5:真勇者ダイン,8:ポリスピナー,9:ドノマンティス,11:ドノマンティス,13:真勇者ダイン,15:ポリスピナー,22:ポリスピナー,23:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_back_right:storm_bomb->monster:cpu_front_left / ...
- reason: ボムゾウを空き枠へ召喚
- board: PF:デスシープ Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:デスシープ Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 prep / CF:ナッツロックル Lv1 HP6 prep / CB:ボムゾウ Lv1 HP6 prep

### front_role_allowed_by_range: ボムゾウ seed 137900 turn 2

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front デスシープ Lv1 HP6 / stones after 2 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ヤンバル,3:ボムゾウ,12:ボムゾウ,14:ピグミィ,16:ヤンバル,17:ピグミィ,19:ヤンバル,20:ピグミィ / top5BackWork=1:ヤンバル,3:ボムゾウ / noReachFront=5:真勇者ダイン,8:ポリスピナー,9:ドノマンティス,11:ドノマンティス,13:真勇者ダイン,15:ポリスピナー,22:ポリスピナー,23:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_back_right:storm_bomb->monster:cpu_front_left / ...
- reason: ボムゾウを空き枠へ召喚
- board: PF:デスシープ Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:デスシープ Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 prep / CF:ナッツロックル Lv1 HP6 prep / CB:ボムゾウ Lv1 HP6 prep

### front_role_allowed_by_range: ボムゾウ seed 137901 turn 2

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ボムゾウ,6:ピグミィ,14:ピグミィ,18:ヤンバル,21:ピグミィ,23:ヤンバル,24:ヤンバル / top5BackWork=2:ボムゾウ / noReachFront=4:ポリスピナー,7:真勇者ダイン,11:真勇者ダイン,12:ドノマンティス,15:デスシープ,17:ドノマンティス,20:デスシープ,22:真勇者ダイン
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_left:storm_bomb->monster:cpu_front_right / attack:player_front_left:attack->monster:cpu_front_left / focus:player_back_right / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 召喚は128点差で見送り、召喚は150点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ボムゾウ Lv1 HP6 / CF:ナッツロックル Lv1 HP6 prep / CF:ヤミー Lv1 HP5 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_backline_pattern_worked: ボムゾウ seed 137901 turn 4

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv1 HP3 prep / stones after 2 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=4:ピグミィ,12:ピグミィ,16:ヤンバル,19:ピグミィ,21:ヤンバル,22:ヤンバル / top5BackWork=4:ピグミィ / noReachFront=2:ポリスピナー,5:真勇者ダイン,9:真勇者ダイン,10:ドノマンティス,13:デスシープ,15:ドノマンティス,18:デスシープ,20:真勇者ダイン
- special lock: -
- next turn: focus:player_front_left / master:wake_up->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 召喚は150点差で見送り
- board: PF:ポリスピナー Lv1 HP3 prep / PF:ドノマンティス Lv1 HP5 / PB:ボムゾウ Lv1 HP6 / CF:ポリスピナー Lv1 HP3 prep / CB:ピグミィ Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 137901 turn 4

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv1 HP3 prep / stones after 2 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=4:ピグミィ,12:ピグミィ,16:ヤンバル,19:ピグミィ,21:ヤンバル,22:ヤンバル / top5BackWork=4:ピグミィ / noReachFront=2:ポリスピナー,5:真勇者ダイン,9:真勇者ダイン,10:ドノマンティス,13:デスシープ,15:ドノマンティス,18:デスシープ,20:真勇者ダイン
- special lock: -
- next turn: focus:player_front_left / master:wake_up->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 召喚は150点差で見送り
- board: PF:ポリスピナー Lv1 HP3 prep / PF:ドノマンティス Lv1 HP5 / PB:ボムゾウ Lv1 HP6 / CF:ポリスピナー Lv1 HP3 prep / CB:ピグミィ Lv1 HP3

### blocked_no_pattern_no_work: ポリスピナー seed 137901 turn 10

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP4 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=16 / backWork=6:ピグミィ,10:ヤンバル,13:ピグミィ,15:ヤンバル,16:ヤンバル / top5BackWork=- / noReachFront=3:真勇者ダイン,4:ドノマンティス,7:デスシープ,9:ドノマンティス,12:デスシープ,14:真勇者ダイン
- special lock: -
- next turn: attack:player_front_right:self_bomb->monster:cpu_front_right / attack:player_front_left:ダイン斬り->master:cpu / summon:player_polyspinner_2->player_front_right / focus:player_back_right / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 / PF:ボムゾウ Lv1 HP4 / PB:ピグミィ Lv2 HP3 / CB:ピグミィ Lv1 HP3 prep / CB:ピグミィ Lv2 HP3

### bad_blocked_no_eval_trace: ポリスピナー seed 137901 turn 10

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP4 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=16 / backWork=6:ピグミィ,10:ヤンバル,13:ピグミィ,15:ヤンバル,16:ヤンバル / top5BackWork=- / noReachFront=3:真勇者ダイン,4:ドノマンティス,7:デスシープ,9:ドノマンティス,12:デスシープ,14:真勇者ダイン
- special lock: -
- next turn: attack:player_front_right:self_bomb->monster:cpu_front_right / attack:player_front_left:ダイン斬り->master:cpu / summon:player_polyspinner_2->player_front_right / focus:player_back_right / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 / PF:ボムゾウ Lv1 HP4 / PB:ピグミィ Lv2 HP3 / CB:ピグミィ Lv1 HP3 prep / CB:ピグミィ Lv2 HP3

### blocked_backline_pattern_worked: ピグミィ seed 137902 turn 1

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role back / front デスシープ Lv1 HP6 prep / stones after 0 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ヤンバル,6:ヤンバル,12:ボムゾウ,13:ヤンバル,18:ボムゾウ,22:ボムゾウ,23:ピグミィ,24:ピグミィ / top5BackWork=1:ヤンバル / noReachFront=2:ドノマンティス,3:真勇者ダイン,4:ポリスピナー,8:ポリスピナー,10:ドノマンティス,15:真勇者ダイン,17:デスシープ,19:デスシープ,...(+2)
- special lock: -
- next turn: attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_left / summon:cpu_yanbaru_2->cpu_back_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は99点差で見送り
- board: PF:ナッツロックル Lv1 HP6 prep / PF:ヤミー Lv1 HP5 prep / PB:ピグミィ Lv1 HP3 prep / CF:デスシープ Lv1 HP6 prep / CB:真勇者ダイン Lv1 HP6 prep

### blocked_no_pattern_no_work: ドノマンティス seed 137902 turn 3

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front ヤンバル Lv2 HP3 / stones after 2 / score 24
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=4:ヤンバル,10:ボムゾウ,11:ヤンバル,16:ボムゾウ,20:ボムゾウ,21:ピグミィ,22:ピグミィ / top5BackWork=4:ヤンバル / noReachFront=1:真勇者ダイン,2:ポリスピナー,6:ポリスピナー,8:ドノマンティス,13:真勇者ダイン,15:デスシープ,17:デスシープ,18:ポリスピナー,...(+1)
- special lock: -
- next turn: summon:cpu_card_047_3->cpu_back_left / focus:cpu_front_left / focus:cpu_front_right / focus:cpu_back_right / ...
- reason: カードを後列左へ召喚
- board: CF:ヤンバル Lv2 HP3 / CF:デスシープ Lv1 HP6 / CB:ピグミィ Lv2 HP3

### bad_blocked_no_eval_trace: ドノマンティス seed 137902 turn 3

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front ヤンバル Lv2 HP3 / stones after 2 / score 24
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=4:ヤンバル,10:ボムゾウ,11:ヤンバル,16:ボムゾウ,20:ボムゾウ,21:ピグミィ,22:ピグミィ / top5BackWork=4:ヤンバル / noReachFront=1:真勇者ダイン,2:ポリスピナー,6:ポリスピナー,8:ドノマンティス,13:真勇者ダイン,15:デスシープ,17:デスシープ,18:ポリスピナー,...(+1)
- special lock: -
- next turn: summon:cpu_card_047_3->cpu_back_left / focus:cpu_front_left / focus:cpu_front_right / focus:cpu_back_right / ...
- reason: カードを後列左へ召喚
- board: CF:ヤンバル Lv2 HP3 / CF:デスシープ Lv1 HP6 / CB:ピグミィ Lv2 HP3

### blocked_no_pattern_no_work: 真勇者ダイン seed 137902 turn 4

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 4 / score 28
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=3:ヤンバル,9:ボムゾウ,10:ヤンバル,15:ボムゾウ,19:ボムゾウ,20:ピグミィ,21:ピグミィ / top5BackWork=3:ヤンバル / noReachFront=1:ポリスピナー,5:ポリスピナー,7:ドノマンティス,12:真勇者ダイン,14:デスシープ,16:デスシープ,17:ポリスピナー,18:ドノマンティス
- special lock: -
- next turn: master:wake_up->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / master:wake_up->monster:player_front_left / attack:cpu_front_left:attack->monster:player_front_left / ...
- reason: カードを後列左へ召喚 / 見送り: ためるは70点差で見送り、ためるは70点差で見送り
- board: CF:ドノマンティス Lv1 HP5 / CF:デスシープ Lv1 HP3 / CB:ピグミィ Lv2 HP1

### bad_blocked_no_eval_trace: 真勇者ダイン seed 137902 turn 4

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 4 / score 28
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=3:ヤンバル,9:ボムゾウ,10:ヤンバル,15:ボムゾウ,19:ボムゾウ,20:ピグミィ,21:ピグミィ / top5BackWork=3:ヤンバル / noReachFront=1:ポリスピナー,5:ポリスピナー,7:ドノマンティス,12:真勇者ダイン,14:デスシープ,16:デスシープ,17:ポリスピナー,18:ドノマンティス
- special lock: -
- next turn: master:wake_up->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / master:wake_up->monster:player_front_left / attack:cpu_front_left:attack->monster:player_front_left / ...
- reason: カードを後列左へ召喚 / 見送り: ためるは70点差で見送り、ためるは70点差で見送り
- board: CF:ドノマンティス Lv1 HP5 / CF:デスシープ Lv1 HP3 / CB:ピグミィ Lv2 HP1

### blocked_no_pattern_no_work: ポリスピナー seed 137902 turn 9

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv3 HP6 / stones after 4 / score 26
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=17 / backWork=4:ボムゾウ,5:ヤンバル,10:ボムゾウ,14:ボムゾウ,15:ピグミィ,16:ピグミィ,17:ヤンバル / top5BackWork=4:ボムゾウ,5:ヤンバル / noReachFront=2:ドノマンティス,7:真勇者ダイン,9:デスシープ,11:デスシープ,12:ポリスピナー,13:ドノマンティス
- special lock: -
- next turn: attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_front_left:ダイン斬り->master:player / end_turn
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は1点差で見送り
- board: PF:ボムゾウ Lv1 HP6 prep / CF:真勇者ダイン Lv3 HP6 / CF:デスシープ Lv2 HP6

### bad_blocked_no_eval_trace: ポリスピナー seed 137902 turn 9

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv3 HP6 / stones after 4 / score 26
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=17 / backWork=4:ボムゾウ,5:ヤンバル,10:ボムゾウ,14:ボムゾウ,15:ピグミィ,16:ピグミィ,17:ヤンバル / top5BackWork=4:ボムゾウ,5:ヤンバル / noReachFront=2:ドノマンティス,7:真勇者ダイン,9:デスシープ,11:デスシープ,12:ポリスピナー,13:ドノマンティス
- special lock: -
- next turn: attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_front_left:ダイン斬り->master:player / end_turn
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は1点差で見送り
- board: PF:ボムゾウ Lv1 HP6 prep / CF:真勇者ダイン Lv3 HP6 / CF:デスシープ Lv2 HP6

### blocked_no_pattern_no_work: ポリスピナー seed 137902 turn 9

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front デスシープ Lv2 HP6 / stones after 3 / score 26
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=4:ボムゾウ,5:ヤンバル,10:ボムゾウ,14:ボムゾウ,15:ピグミィ,16:ピグミィ,17:ヤンバル / top5BackWork=4:ボムゾウ,5:ヤンバル / noReachFront=2:ドノマンティス,7:真勇者ダイン,9:デスシープ,11:デスシープ,12:ポリスピナー,13:ドノマンティス
- special lock: -
- next turn: attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_front_left:ダイン斬り->master:player / end_turn
- reason: カードを後列右へ召喚
- board: PF:ボムゾウ Lv1 HP6 prep / CF:真勇者ダイン Lv3 HP6 / CF:デスシープ Lv2 HP6 / CB:ポリスピナー Lv1 HP3 prep

### bad_blocked_no_eval_trace: ポリスピナー seed 137902 turn 9

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front デスシープ Lv2 HP6 / stones after 3 / score 26
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=4:ボムゾウ,5:ヤンバル,10:ボムゾウ,14:ボムゾウ,15:ピグミィ,16:ピグミィ,17:ヤンバル / top5BackWork=4:ボムゾウ,5:ヤンバル / noReachFront=2:ドノマンティス,7:真勇者ダイン,9:デスシープ,11:デスシープ,12:ポリスピナー,13:ドノマンティス
- special lock: -
- next turn: attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_front_left:ダイン斬り->master:player / end_turn
- reason: カードを後列右へ召喚
- board: PF:ボムゾウ Lv1 HP6 prep / CF:真勇者ダイン Lv3 HP6 / CF:デスシープ Lv2 HP6 / CB:ポリスピナー Lv1 HP3 prep

### blocked_backline_pattern_worked: ピグミィ seed 137903 turn 6

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role back / front 真勇者ダイン Lv1 HP6 prep / stones after 4 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=1:ピグミィ,2:ボムゾウ,7:ボムゾウ,19:ボムゾウ / top5BackWork=1:ピグミィ,2:ボムゾウ / noReachFront=4:デスシープ,5:ポリスピナー,10:真勇者ダイン,12:ポリスピナー,13:デスシープ,15:ドノマンティス,16:真勇者ダイン,17:ポリスピナー
- special lock: -
- next turn: attack:cpu_back_right:スパイクボール->monster:player_front_right / attack:cpu_front_left:スパイクボール->monster:player_front_right / attack:cpu_front_right:ダイン斬り->monster:player_front_right / summon:cpu_card_051_1->cpu_back_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は163点差で見送り、マスター特技は172点差で見送り
- board: PF:ユニフォーン Lv2 HP5 / CF:デスシープ Lv1 HP1 / CF:真勇者ダイン Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_backline_pattern_worked: ピグミィ seed 137904 turn 2

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=ピグミィ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ヤンバル,2:ヤンバル,6:ピグミィ,7:ボムゾウ,12:ボムゾウ,24:ボムゾウ / top5BackWork=1:ヤンバル,2:ヤンバル / noReachFront=3:真勇者ダイン,5:ドノマンティス,9:デスシープ,10:ポリスピナー,15:真勇者ダイン,17:ポリスピナー,18:デスシープ,20:ドノマンティス,...(+2)
- special lock: -
- next turn: attack:player_back_left:wild_claw->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_right:attack->master:cpu / attack:player_front_left:attack->monster:cpu_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、ためるは2点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:ガンプ Lv1 HP5 prep / CB:ラティーヌ Lv1 HP4 prep / CB:バルキャノン Lv1 HP3 prep

### low_stone_blocked_no_work: ピグミィ seed 137904 turn 6

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_pressure_strong` (player, loss)
- decision: player_back_left / role back / front ヤンバル Lv1 HP3 / stones after 1 / score 67
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=真勇者ダイン / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=2:ピグミィ,3:ボムゾウ,8:ボムゾウ,20:ボムゾウ / top5BackWork=2:ピグミィ,3:ボムゾウ / noReachFront=1:ドノマンティス,5:デスシープ,6:ポリスピナー,11:真勇者ダイン,13:ポリスピナー,14:デスシープ,16:ドノマンティス,17:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_right:呪いの刃->master:cpu / master:shield->monster:player_front_right / end_turn
- reason: 後衛カードを後列左へ召喚 / 見送り: 攻撃は53点差で見送り、召喚は436点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:ドノマンティス Lv2 HP5 / PB:ヤンバル Lv1 HP3 / CB:バルキャノン Lv1 HP1

### low_stone_blocked_no_work: ピグミィ seed 137905 turn 5

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_pressure_strong` (player, win)
- decision: player_back_right / role back / front 真勇者ダイン Lv1 HP6 / stones after 1 / score 67
- flags: backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ヤンバル,6:ヤンバル,7:ボムゾウ,8:ボムゾウ,12:ピグミィ,13:ピグミィ,21:ボムゾウ / top5BackWork=1:ヤンバル / noReachFront=2:ドノマンティス,3:ポリスピナー,5:デスシープ,9:ドノマンティス,11:デスシープ,15:ポリスピナー,16:ポリスピナー,17:ドノマンティス,...(+2)
- special lock: -
- next turn: master:wake_up->monster:cpu_front_right / summon:player_yanbaru_1->player_back_left / master:wake_up->monster:player_back_left / attack:player_front_right:ダイン斬り->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは11点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:真勇者ダイン Lv1 HP6 / PB:ヤンバル Lv2 HP3 / CB:バルキャノン Lv1 HP1

### low_stone_blocked_no_work: ドノマンティス seed 137907 turn 4

- variant/opponent: `current_last_back_slot_hold_plan_off` vs `black_pressure_strong` (cpu, win)
- decision: cpu_back_right / role front / front ヤンバル Lv2 HP3 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=3:ピグミィ,6:ボムゾウ,8:ボムゾウ,11:ボムゾウ,14:ピグミィ,20:ピグミィ / top5BackWork=3:ピグミィ / noReachFront=4:真勇者ダイン,5:真勇者ダイン,9:ドノマンティス,12:ポリスピナー,15:デスシープ,16:真勇者ダイン,17:デスシープ,19:ポリスピナー
- special lock: -
- next turn: attack:cpu_front_right:attack->monster:player_front_right / summon:cpu_card_037_3->cpu_back_right / attack:cpu_front_left:attack->master:player / attack:cpu_back_left:wild_claw->master:player / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:ゾンビ Lv2 HP1 / CF:デスシープ Lv2 HP6 / CF:ヤンバル Lv2 HP3 / CB:ヤンバル Lv2 HP3

### low_stone_blocked_no_work: ヤンバル seed 137908 turn 1

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front ポリスピナー Lv1 HP3 prep / stones after 0 / score 68
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=ヤンバル / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=25 / backWork=7:ピグミィ,10:ボムゾウ,12:ボムゾウ,15:ボムゾウ,18:ピグミィ,24:ピグミィ / top5BackWork=- / noReachFront=2:デスシープ,3:ドノマンティス,4:ドノマンティス,8:真勇者ダイン,9:真勇者ダイン,13:ドノマンティス,16:ポリスピナー,19:デスシープ,...(+3)
- special lock: -
- next turn: focus:player_front_right / master:wake_up->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / move:player_front_left->player_back_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、召喚は92点差で見送り
- board: PF:ポリスピナー Lv1 HP3 prep / PB:ヤンバル Lv1 HP3 prep

### low_stone_blocked_no_work: ドノマンティス seed 137908 turn 4

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ヤンバル Lv1 HP3 / stones after 1 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=デスシープ / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=22 / backWork=4:ピグミィ,7:ボムゾウ,9:ボムゾウ,12:ボムゾウ,15:ピグミィ,21:ピグミィ / top5BackWork=4:ピグミィ / noReachFront=1:ドノマンティス,5:真勇者ダイン,6:真勇者ダイン,10:ドノマンティス,13:ポリスピナー,16:デスシープ,17:真勇者ダイン,18:デスシープ,...(+1)
- special lock: -
- next turn: move:player_back_right->player_back_left / attack:player_front_right:wild_claw->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は14点差で見送り、マスター特技は20点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:ヤンバル Lv2 HP3 / CF:真勇者ダイン Lv2 HP6 / CF:ヤンバル Lv1 HP1

### death_sheep_special_lock: デスシープ seed 137908 turn 4

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ヤンバル Lv2 HP3 / stones after 0 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=4:ピグミィ,7:ボムゾウ,9:ボムゾウ,12:ボムゾウ,15:ピグミィ,21:ピグミィ / top5BackWork=4:ピグミィ / noReachFront=1:ドノマンティス,5:真勇者ダイン,6:真勇者ダイン,10:ドノマンティス,13:ポリスピナー,16:デスシープ,17:真勇者ダイン,18:デスシープ,...(+1)
- special lock: ヤンバル Lv2: ワイルドクロウ
- next turn: move:player_back_right->player_back_left / attack:player_front_right:wild_claw->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / ...
- reason: デスシープを空き枠へ召喚
- board: PF:ヤンバル Lv1 HP3 / PF:ヤンバル Lv2 HP3 / PB:ドノマンティス Lv1 HP5 prep / CF:真勇者ダイン Lv2 HP6 / CF:ヤンバル Lv1 HP1

### front_role_allowed_by_range: ボムゾウ seed 137909 turn 11

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ヤンバル Lv2 HP3 / stones after 0 / score 23
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=0
- deck pressure: deck=16 / backWork=5:ヤンバル,6:ボムゾウ,7:ボムゾウ / top5BackWork=5:ヤンバル / noReachFront=1:ドノマンティス,2:ポリスピナー,3:ポリスピナー,4:デスシープ,9:デスシープ,13:デスシープ,15:真勇者ダイン,16:真勇者ダイン
- special lock: -
- next turn: summon:player_card_037_2->player_back_left / attack:player_front_left:ダイン斬り->master:cpu / end_turn
- reason: ボムゾウを空き枠へ召喚 / 見送り: 召喚は14点差で見送り
- board: PF:真勇者ダイン Lv2 HP6 / PF:ヤンバル Lv2 HP3

### front_role_allowed_by_range: ボムゾウ seed 137911 turn 6

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role front / front デスシープ Lv1 HP5 / stones after 2 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ドノマンティス,真勇者ダイン / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=4:ヤンバル,5:ピグミィ,6:ボムゾウ,10:ヤンバル,14:ピグミィ,16:ピグミィ / top5BackWork=4:ヤンバル,5:ピグミィ / noReachFront=1:ポリスピナー,8:ドノマンティス,13:ドノマンティス,15:デスシープ,17:デスシープ,18:真勇者ダイン
- special lock: -
- next turn: attack:cpu_front_left:ダイン斬り->master:player / master:master_attack->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は81点差で見送り、召喚は97点差で見送り
- board: PB:ヤンバル Lv1 HP3 / PB:ナッツロックル Lv1 HP5 / CF:真勇者ダイン Lv3 HP6 / CF:デスシープ Lv1 HP5 / CB:ヤンバル Lv1 HP3 prep


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

- デスシープを後列に置く候補は、同レーン前列の下段特技を封じる場合に `special lock loss` として別比較する。特にドノマンティスLv2など高打点/除去寄り特技持ちは、召喚評価から差し引く候補を作る。
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
