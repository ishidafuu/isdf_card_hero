# White Backline Summon Audit Loop

生成: 2026-06-29T10:38:58.260Z
seedStart: 136400
候補: current_white_baseline, current_back_slot_reservation_plan80, current_back_slot_reservation_plan140, current_low_stone_back_slot_alt80, current_low_stone_back_slot_alt140
相手: black_1375_pressure
試行: 4 games/matchup/direction
総試合: 40

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 355
- 後列召喚: 242 (68.2%)
- 前列あり後列召喚: 178 (73.6%)
- うち前衛ロール: 92 (51.7%)
- デスシープ後列召喚: 13 (7.3%)
- デスシープ特技封じ損: 2 (15.4%) / W-L 1-1
- デスシープ特技封じ平均コマンド数: 1
- Backline patternあり: 106 (59.6%)
- Backline patternなし: 72 (40.4%)
- 次自ターン攻撃: 37 (20.8%)
- 次自ターン後列攻撃: 36 (20.2%)
- 次自ターン前進: 2 (1.1%)
- 次自ターン仕事なし: 140 (78.7%)
- Bad blocked summon: 70 (39.3%)
- Bad with evaluation trace: 0 (0%)
- Bad with non-summon alt: 0 (0%)
- Bad close non-summon alt: 0 (0%)
- Bad medium non-summon alt <=100: 0 (0%)
- Bad distant non-summon alt <=200: 0 (0%)
- Bad avg best non-summon gap: 0
- Bad top summon alt: 0 (0%)
- Bad top summon same card: 0 (0%)
- Bad top summon backline pattern: 0 (0%)
- Bad with other backline work in hand: 10 (14.3%)
- Bad consumes last back slot: 62 (88.6%)
- Bad leaves no empty back slot: 62 (88.6%)
- Avg no-reach front cards in back after bad: 1.31
- Bad with deck backline work: 70 (100%)
- Bad with deck top5 backline work: 65 (92.9%)
- Bad consumes last back slot with deck backline work: 62 (88.6%)
- Avg deck backline work cards after bad: 6.31
- Avg deck top5 backline work cards after bad: 1.93

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Death Sheep Lock | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_white_baseline | 3-5-0 | 78 | 52 (66.7%) | 38 (73.1%) | 18 (47.4%) | 0 (0%) | 22 (57.9%) | 16 (42.1%) | 10 (26.3%) | 10 (26.3%) | 0 (0%) | 28 (73.7%) | 16 (42.1%) | 0 (0%) | HandReach1, DeckReach16, DeckTop5Reach15, LastBack16, NoEmptyBack16 | 15 (39.5%) | 17/21 |
| current_back_slot_reservation_plan80 | 0-8-0 | 78 | 47 (60.3%) | 35 (74.5%) | 16 (45.7%) | 1 (50%) | 22 (62.9%) | 13 (37.1%) | 8 (22.9%) | 7 (20%) | 1 (2.9%) | 27 (77.1%) | 12 (34.3%) | 0 (0%) | HandReach1, DeckReach12, DeckTop5Reach11, LastBack11, NoEmptyBack11 | 16 (45.7%) | 0/35 |
| current_back_slot_reservation_plan140 | 3-5-0 | 72 | 47 (65.3%) | 35 (74.5%) | 16 (45.7%) | 1 (25%) | 21 (60%) | 14 (40%) | 5 (14.3%) | 5 (14.3%) | 1 (2.9%) | 29 (82.9%) | 13 (37.1%) | 0 (0%) | HandReach2, DeckReach13, DeckTop5Reach11, LastBack9, NoEmptyBack9 | 19 (54.3%) | 13/22 |
| current_low_stone_back_slot_alt80 | 3-5-0 | 64 | 46 (71.9%) | 32 (69.6%) | 21 (65.6%) | 0 (0%) | 16 (50%) | 16 (50%) | 3 (9.4%) | 3 (9.4%) | 0 (0%) | 29 (90.6%) | 16 (50%) | 0 (0%) | HandReach2, DeckReach16, DeckTop5Reach15, LastBack14, NoEmptyBack14 | 14 (43.8%) | 10/22 |
| current_low_stone_back_slot_alt140 | 2-6-0 | 63 | 50 (79.4%) | 38 (76%) | 21 (55.3%) | 0 (0%) | 25 (65.8%) | 13 (34.2%) | 11 (28.9%) | 11 (28.9%) | 0 (0%) | 27 (71.1%) | 13 (34.2%) | 0 (0%) | HandReach4, DeckReach13, DeckTop5Reach13, LastBack12, NoEmptyBack12 | 17 (44.7%) | 11/27 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Death Sheep Lock | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | black_1375_pressure | 3-5-0 | 38 | 0 (0%) | 22 (57.9%) | 16 (42.1%) | 28 (73.7%) | 16 (42.1%) | 0 (0%) |
| current_back_slot_reservation_plan80 | black_1375_pressure | 0-8-0 | 35 | 1 (50%) | 22 (62.9%) | 13 (37.1%) | 27 (77.1%) | 12 (34.3%) | 0 (0%) |
| current_back_slot_reservation_plan140 | black_1375_pressure | 3-5-0 | 35 | 1 (25%) | 21 (60%) | 14 (40%) | 29 (82.9%) | 13 (37.1%) | 0 (0%) |
| current_low_stone_back_slot_alt80 | black_1375_pressure | 3-5-0 | 32 | 0 (0%) | 16 (50%) | 16 (50%) | 29 (90.6%) | 16 (50%) | 0 (0%) |
| current_low_stone_back_slot_alt140 | black_1375_pressure | 2-6-0 | 38 | 0 (0%) | 25 (65.8%) | 13 (34.2%) | 27 (71.1%) | 13 (34.2%) | 0 (0%) |

## Samples

### blocked_backline_pattern_worked: ピグミィ seed 136400 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ヤンバル,6:ボムゾウ,21:ヤンバル,22:ボムゾウ,23:ピグミィ,24:ヤンバル / top5BackWork=2:ヤンバル / noReachFront=4:デスシープ,5:真勇者ダイン,9:ポリスピナー,10:デスシープ,11:ドノマンティス,13:真勇者ダイン,14:真勇者ダイン,15:ポリスピナー,...(+3)
- special lock: -
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは2点差で見送り、ためるは2点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ナッツロックル Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_no_pattern_no_work: 真勇者ダイン seed 136400 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front デスシープ Lv1 HP6 / stones after 0 / score 28
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=1:ボムゾウ,16:ヤンバル,17:ボムゾウ,18:ピグミィ,19:ヤンバル / top5BackWork=1:ボムゾウ / noReachFront=4:ポリスピナー,5:デスシープ,6:ドノマンティス,8:真勇者ダイン,9:真勇者ダイン,10:ポリスピナー,11:ポリスピナー,13:ドノマンティス,...(+1)
- special lock: -
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_front_right:attack->master:cpu / summon:player_bomuzo_2->player_front_left / attack:player_back_left:スパイクボール->monster:cpu_back_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 攻撃は53点差で見送り、ためるは142点差で見送り
- board: PF:ボムゾウ Lv2 HP3 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3 prep / CB:ピグミィ Lv1 HP3 prep

### bad_blocked_no_eval_trace: 真勇者ダイン seed 136400 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front デスシープ Lv1 HP6 / stones after 0 / score 28
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=1:ボムゾウ,16:ヤンバル,17:ボムゾウ,18:ピグミィ,19:ヤンバル / top5BackWork=1:ボムゾウ / noReachFront=4:ポリスピナー,5:デスシープ,6:ドノマンティス,8:真勇者ダイン,9:真勇者ダイン,10:ポリスピナー,11:ポリスピナー,13:ドノマンティス,...(+1)
- special lock: -
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_front_right:attack->master:cpu / summon:player_bomuzo_2->player_front_left / attack:player_back_left:スパイクボール->monster:cpu_back_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 攻撃は53点差で見送り、ためるは142点差で見送り
- board: PF:ボムゾウ Lv2 HP3 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3 prep / CB:ピグミィ Lv1 HP3 prep

### low_stone_blocked_no_work: 真勇者ダイン seed 136400 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front デスシープ Lv1 HP6 / stones after 0 / score 28
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=1:ボムゾウ,16:ヤンバル,17:ボムゾウ,18:ピグミィ,19:ヤンバル / top5BackWork=1:ボムゾウ / noReachFront=4:ポリスピナー,5:デスシープ,6:ドノマンティス,8:真勇者ダイン,9:真勇者ダイン,10:ポリスピナー,11:ポリスピナー,13:ドノマンティス,...(+1)
- special lock: -
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_front_right:attack->master:cpu / summon:player_bomuzo_2->player_front_left / attack:player_back_left:スパイクボール->monster:cpu_back_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 攻撃は53点差で見送り、ためるは142点差で見送り
- board: PF:ボムゾウ Lv2 HP3 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_no_pattern_no_work: デスシープ seed 136401 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 25
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ピグミィ,3:ヤンバル,5:ピグミィ,8:ヤンバル,12:ボムゾウ,14:ボムゾウ,19:ヤンバル,23:ボムゾウ / top5BackWork=1:ピグミィ,3:ヤンバル,5:ピグミィ / noReachFront=7:真勇者ダイン,9:ポリスピナー,10:ポリスピナー,11:ドノマンティス,16:ポリスピナー,18:デスシープ,20:ドノマンティス,21:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / magic:player_card_031_1->monster:cpu_back_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_left / ...
- reason: デスシープを空き枠へ召喚 / 見送り: ためるは7点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:ナッツロックル Lv1 HP6 prep / CF:ボムゾウ Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### bad_blocked_no_eval_trace: デスシープ seed 136401 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 25
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ピグミィ,3:ヤンバル,5:ピグミィ,8:ヤンバル,12:ボムゾウ,14:ボムゾウ,19:ヤンバル,23:ボムゾウ / top5BackWork=1:ピグミィ,3:ヤンバル,5:ピグミィ / noReachFront=7:真勇者ダイン,9:ポリスピナー,10:ポリスピナー,11:ドノマンティス,16:ポリスピナー,18:デスシープ,20:ドノマンティス,21:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / magic:player_card_031_1->monster:cpu_back_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_left / ...
- reason: デスシープを空き枠へ召喚 / 見送り: ためるは7点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:ナッツロックル Lv1 HP6 prep / CF:ボムゾウ Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_backline_pattern_worked: ヤンバル seed 136401 turn 10

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role back / front ピグミィ Lv1 HP3 / stones after 8 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=4:ボムゾウ,6:ボムゾウ,11:ヤンバル,15:ボムゾウ / top5BackWork=4:ボムゾウ / noReachFront=1:ポリスピナー,2:ポリスピナー,3:ドノマンティス,8:ポリスピナー,10:デスシープ,12:ドノマンティス,13:真勇者ダイン,16:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_left:wild_claw->monster:cpu_front_right / end_turn
- reason: 後衛カードを後列左へ召喚 / 見送り: 攻撃は105点差で見送り、移動は195点差で見送り
- board: PF:ピグミィ Lv1 HP3 / PF:デスシープ Lv2 HP6 / PB:ヤンバル Lv1 HP3 / CF:ヤミー Lv1 HP5 prep / CB:ヤンバル Lv1 HP1 / CB:ピグミィ Lv2 HP3

### blocked_no_pattern_no_work: ポリスピナー seed 136401 turn 12

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ヤンバル Lv2 HP3 / stones after 9 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=15 / backWork=2:ボムゾウ,4:ボムゾウ,9:ヤンバル,13:ボムゾウ / top5BackWork=2:ボムゾウ,4:ボムゾウ / noReachFront=1:ドノマンティス,6:ポリスピナー,8:デスシープ,10:ドノマンティス,11:真勇者ダイン,14:真勇者ダイン,15:真勇者ダイン
- special lock: -
- next turn: move:player_front_left->player_back_left / master:master_attack->monster:cpu_front_right / attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->master:cpu / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、マスター特技は29点差で見送り
- board: PF:ヤンバル Lv2 HP3 / PF:デスシープ Lv2 HP6 / PB:ヤンバル Lv1 HP3 / CF:ボムゾウ Lv1 HP4 / CB:ユニフォーン Lv1 HP5 prep

### bad_blocked_no_eval_trace: ポリスピナー seed 136401 turn 12

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ヤンバル Lv2 HP3 / stones after 9 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=15 / backWork=2:ボムゾウ,4:ボムゾウ,9:ヤンバル,13:ボムゾウ / top5BackWork=2:ボムゾウ,4:ボムゾウ / noReachFront=1:ドノマンティス,6:ポリスピナー,8:デスシープ,10:ドノマンティス,11:真勇者ダイン,14:真勇者ダイン,15:真勇者ダイン
- special lock: -
- next turn: move:player_front_left->player_back_left / master:master_attack->monster:cpu_front_right / attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->master:cpu / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、マスター特技は29点差で見送り
- board: PF:ヤンバル Lv2 HP3 / PF:デスシープ Lv2 HP6 / PB:ヤンバル Lv1 HP3 / CF:ボムゾウ Lv1 HP4 / CB:ユニフォーン Lv1 HP5 prep

### blocked_backline_pattern_worked: ヤンバル seed 136402 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front ボムゾウ Lv1 HP6 / stones after 2 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=ピグミィ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=4:ピグミィ,9:ボムゾウ,14:ヤンバル,19:ボムゾウ,22:ピグミィ / top5BackWork=4:ピグミィ / noReachFront=1:ドノマンティス,2:ポリスピナー,3:真勇者ダイン,8:デスシープ,10:真勇者ダイン,11:デスシープ,12:ポリスピナー,15:ドノマンティス,...(+3)
- special lock: -
- next turn: attack:player_front_right:self_bomb->monster:cpu_front_right / attack:player_back_right:wild_claw->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_left:ダイン斬り->monster:cpu_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、ためるは2点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ボムゾウ Lv1 HP6 prep / CB:ヤミー Lv1 HP5 prep

### blocked_no_pattern_no_work: 真勇者ダイン seed 136403 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 28
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=8:ピグミィ,9:ピグミィ,10:ボムゾウ,12:ヤンバル,13:ヤンバル,14:ボムゾウ,17:ピグミィ,22:ヤンバル / top5BackWork=- / noReachFront=1:ポリスピナー,5:真勇者ダイン,11:ドノマンティス,16:ドノマンティス,18:ポリスピナー,20:デスシープ,23:真勇者ダイン,24:デスシープ
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_left:storm_bomb->monster:cpu_front_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は39点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ボムゾウ Lv1 HP6 / CF:ボムゾウ Lv1 HP6 prep / CF:ユニフォーン Lv1 HP5 prep / CB:ピグミィ Lv1 HP3 prep

### bad_blocked_no_eval_trace: 真勇者ダイン seed 136403 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 28
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=8:ピグミィ,9:ピグミィ,10:ボムゾウ,12:ヤンバル,13:ヤンバル,14:ボムゾウ,17:ピグミィ,22:ヤンバル / top5BackWork=- / noReachFront=1:ポリスピナー,5:真勇者ダイン,11:ドノマンティス,16:ドノマンティス,18:ポリスピナー,20:デスシープ,23:真勇者ダイン,24:デスシープ
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_left:storm_bomb->monster:cpu_front_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は39点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ボムゾウ Lv1 HP6 / CF:ボムゾウ Lv1 HP6 prep / CF:ユニフォーン Lv1 HP5 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_no_pattern_no_work: ポリスピナー seed 136403 turn 5

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front 真勇者ダイン Lv1 HP6 / stones after 4 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=5:ピグミィ,6:ピグミィ,7:ボムゾウ,9:ヤンバル,10:ヤンバル,11:ボムゾウ,14:ピグミィ,19:ヤンバル / top5BackWork=5:ピグミィ / noReachFront=2:真勇者ダイン,8:ドノマンティス,13:ドノマンティス,15:ポリスピナー,17:デスシープ,20:真勇者ダイン,21:デスシープ
- special lock: -
- next turn: summon:player_polyspinner_2->player_back_left / master:master_attack->monster:cpu_front_left / attack:player_front_left:self_bomb->monster:cpu_front_left / focus:player_front_right / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は80点差で見送り
- board: PF:デスシープ Lv1 HP3 / PF:真勇者ダイン Lv1 HP6 / PB:ボムゾウ Lv1 HP6 / CF:ユニフォーン Lv1 HP5 prep / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv1 HP3 prep / CB:ピグミィ Lv2 HP3

### bad_blocked_no_eval_trace: ポリスピナー seed 136403 turn 5

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front 真勇者ダイン Lv1 HP6 / stones after 4 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=5:ピグミィ,6:ピグミィ,7:ボムゾウ,9:ヤンバル,10:ヤンバル,11:ボムゾウ,14:ピグミィ,19:ヤンバル / top5BackWork=5:ピグミィ / noReachFront=2:真勇者ダイン,8:ドノマンティス,13:ドノマンティス,15:ポリスピナー,17:デスシープ,20:真勇者ダイン,21:デスシープ
- special lock: -
- next turn: summon:player_polyspinner_2->player_back_left / master:master_attack->monster:cpu_front_left / attack:player_front_left:self_bomb->monster:cpu_front_left / focus:player_front_right / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は80点差で見送り
- board: PF:デスシープ Lv1 HP3 / PF:真勇者ダイン Lv1 HP6 / PB:ボムゾウ Lv1 HP6 / CF:ユニフォーン Lv1 HP5 prep / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv1 HP3 prep / CB:ピグミィ Lv2 HP3

### low_stone_blocked_no_work: 真勇者ダイン seed 136403 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv1 HP3 / stones after 1 / score 28
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=3:ピグミィ,4:ピグミィ,5:ボムゾウ,7:ヤンバル,8:ヤンバル,9:ボムゾウ,12:ピグミィ,17:ヤンバル / top5BackWork=3:ピグミィ,4:ピグミィ,5:ボムゾウ / noReachFront=6:ドノマンティス,11:ドノマンティス,13:ポリスピナー,15:デスシープ,18:真勇者ダイン,19:デスシープ
- special lock: -
- next turn: focus:player_front_left / attack:player_front_left:attack->monster:cpu_front_left / focus:player_front_right / focus:player_back_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 攻撃は41点差で見送り、移動は397点差で見送り
- board: PF:ポリスピナー Lv1 HP3 / PF:真勇者ダイン Lv1 HP6 / PB:ポリスピナー Lv1 HP3 / CB:ヤンバル Lv1 HP3 prep / CB:ピグミィ Lv2 HP3

### blocked_backline_pattern_worked: ヤンバル seed 136403 turn 14

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front ピグミィ Lv1 HP3 / stones after 3 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=0
- deck pressure: deck=12 / backWork=1:ヤンバル,2:ボムゾウ,5:ピグミィ,10:ヤンバル / top5BackWork=1:ヤンバル,2:ボムゾウ,5:ピグミィ / noReachFront=4:ドノマンティス,6:ポリスピナー,8:デスシープ,11:真勇者ダイン,12:デスシープ
- special lock: -
- next turn: summon:player_yanbaru_2->player_back_right / attack:player_front_left:attack->monster:cpu_front_left / master:wake_up->monster:player_back_right / attack:player_back_right:wild_claw->monster:cpu_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは8点差で見送り、移動は58点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:ピグミィ Lv1 HP3 / CB:ボムゾウ Lv1 HP6 prep / CB:ピグミィ Lv2 HP3

### blocked_backline_pattern_worked: ヤンバル seed 136403 turn 15

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front ヤンバル Lv1 HP3 / stones after 6 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=11 / backWork=1:ボムゾウ,4:ピグミィ,9:ヤンバル / top5BackWork=1:ボムゾウ,4:ピグミィ / noReachFront=3:ドノマンティス,5:ポリスピナー,7:デスシープ,10:真勇者ダイン,11:デスシープ
- special lock: -
- next turn: attack:player_back_right:wild_claw->master:cpu / end_turn
- reason: 後衛カードを後列右へ召喚 / 見送り: 攻撃は52点差で見送り、攻撃は52点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:ヤンバル Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ボムゾウ Lv1 HP3 / CB:ピグミィ Lv2 HP3

### front_role_allowed_by_range: ボムゾウ seed 136404 turn 1

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front デスシープ Lv1 HP6 prep / stones after 0 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=ヤンバル,ピグミィ / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ボムゾウ,3:ピグミィ,6:ヤンバル,7:ヤンバル,18:ボムゾウ,23:ピグミィ / top5BackWork=1:ボムゾウ,3:ピグミィ / noReachFront=2:ポリスピナー,5:デスシープ,9:真勇者ダイン,10:ドノマンティス,12:ポリスピナー,14:デスシープ,21:ポリスピナー,22:ドノマンティス,...(+1)
- special lock: -
- next turn: attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_back_right:storm_bomb->monster:player_front_left / attack:cpu_front_right:attack->monster:player_front_right / summon:cpu_yanbaru_3->cpu_back_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は3点差で見送り、召喚は38点差で見送り
- board: PF:ボムゾウ Lv1 HP6 prep / PF:ユニフォーン Lv1 HP5 prep / PB:ピグミィ Lv1 HP3 prep / CF:デスシープ Lv1 HP6 prep / CB:真勇者ダイン Lv1 HP6 prep

### low_stone_blocked_no_work: ドノマンティス seed 136405 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=1:ボムゾウ,2:ピグミィ,3:ヤンバル,9:ボムゾウ,10:ピグミィ,15:ボムゾウ,20:ヤンバル,22:ピグミィ / top5BackWork=1:ボムゾウ,2:ピグミィ,3:ヤンバル / noReachFront=4:デスシープ,7:ドノマンティス,8:ポリスピナー,11:ドノマンティス,12:真勇者ダイン,13:ポリスピナー,17:デスシープ,18:ポリスピナー,...(+1)
- special lock: -
- next turn: attack:cpu_back_right:wild_claw->monster:player_front_right / attack:cpu_front_right:ダイン斬り->monster:player_front_right / focus:cpu_front_left / focus:cpu_back_left / ...
- reason: カードを後列左へ召喚
- board: PF:ナッツロックル Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:真勇者ダイン Lv1 HP4 / CB:ヤンバル Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 136405 turn 8

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front デスシープ Lv1 HP6 prep / stones after 6 / score 23
- flags: backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=0
- deck pressure: deck=17 / backWork=3:ボムゾウ,4:ピグミィ,9:ボムゾウ,14:ヤンバル,16:ピグミィ / top5BackWork=3:ボムゾウ,4:ピグミィ / noReachFront=1:ドノマンティス,2:ポリスピナー,5:ドノマンティス,6:真勇者ダイン,7:ポリスピナー,11:デスシープ,12:ポリスピナー,17:デスシープ
- special lock: -
- next turn: attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_front_right:ダイン斬り->master:player / summon:cpu_card_037_1->cpu_back_right / focus:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、マスター特技は31点差で見送り
- board: PF:ヤミー Lv2 HP5 / CF:デスシープ Lv1 HP6 prep / CF:真勇者ダイン Lv2 HP3

### low_stone_blocked_no_work: ポリスピナー seed 136405 turn 10

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front 真勇者ダイン Lv3 HP6 / stones after 0 / score 26
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=16 / backWork=1:ボムゾウ,2:ピグミィ,7:ボムゾウ,12:ヤンバル,14:ピグミィ / top5BackWork=1:ボムゾウ,2:ピグミィ / noReachFront=3:ドノマンティス,4:真勇者ダイン,5:ポリスピナー,9:デスシープ,10:ポリスピナー,15:デスシープ,16:ドノマンティス
- special lock: -
- next turn: attack:cpu_front_right:ダイン斬り->monster:player_front_right / attack:cpu_front_left:attack->master:player / focus:cpu_back_right / master:shield->monster:cpu_front_left / ...
- reason: カードを後列右へ召喚
- board: PB:ピグミィ Lv1 HP3 prep / PB:ヤンバル Lv1 HP3 / CF:デスシープ Lv2 HP6 / CF:真勇者ダイン Lv3 HP6 / CB:ボムゾウ Lv1 HP6

### low_stone_blocked_no_work: ドノマンティス seed 136406 turn 3

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv3 HP6 / stones after 1 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=2:ピグミィ,3:ボムゾウ,9:ヤンバル,13:ピグミィ,14:ボムゾウ,15:ピグミィ,18:ボムゾウ / top5BackWork=2:ピグミィ,3:ボムゾウ / noReachFront=1:真勇者ダイン,6:ポリスピナー,8:真勇者ダイン,12:ポリスピナー,17:ドノマンティス,19:デスシープ,22:デスシープ
- special lock: -
- next turn: attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_front_right:attack->master:player / summon:cpu_card_047_3->cpu_back_right / focus:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は23点差で見送り
- board: PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv3 HP6 / CF:デスシープ Lv1 HP4 / CB:ヤンバル Lv2 HP3

### front_role_allowed_by_range: ボムゾウ seed 136409 turn 2

- variant/opponent: `current_back_slot_reservation_plan80` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ヤンバル,2:ボムゾウ,11:ピグミィ,13:ボムゾウ,15:ヤンバル,18:ヤンバル,20:ピグミィ / top5BackWork=1:ヤンバル,2:ボムゾウ / noReachFront=3:真勇者ダイン,4:真勇者ダイン,5:デスシープ,9:デスシープ,16:真勇者ダイン,17:ポリスピナー,21:ドノマンティス,22:ポリスピナー,...(+1)
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / end_turn
- reason: ボムゾウを空き枠へ召喚 / 見送り: 召喚は34点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ナッツロックル Lv1 HP6 prep / CB:ヤンバル Lv1 HP3 prep

### front_role_allowed_by_range: ボムゾウ seed 136410 turn 5

- variant/opponent: `current_back_slot_reservation_plan80` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front 真勇者ダイン Lv1 HP6 / stones after 4 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ピグミィ,2:ヤンバル,6:ボムゾウ,14:ピグミィ,17:ボムゾウ,19:ピグミィ / top5BackWork=1:ピグミィ,2:ヤンバル / noReachFront=3:ポリスピナー,8:デスシープ,11:真勇者ダイン,13:デスシープ,15:ドノマンティス,16:ドノマンティス,18:真勇者ダイン,21:デスシープ
- special lock: -
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_left:attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / ...
- reason: ボムゾウを空き枠へ召喚
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv1 HP6 / PB:ポリスピナー Lv1 HP3 / CF:ナッツロックル Lv1 HP6 prep / CF:ナッツロックル Lv1 HP6 prep / CB:ボムゾウ Lv1 HP6 prep / CB:ポリスピナー Lv1 HP3 prep

### front_role_allowed_by_range: ボムゾウ seed 136411 turn 5

- variant/opponent: `current_back_slot_reservation_plan80` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ヤンバル Lv2 HP3 / stones after 0 / score 23
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ピグミィ,4:ボムゾウ,13:ヤンバル,17:ヤンバル,19:ピグミィ / top5BackWork=1:ピグミィ,4:ボムゾウ / noReachFront=2:デスシープ,5:デスシープ,8:ドノマンティス,10:ポリスピナー,15:真勇者ダイン,16:真勇者ダイン,18:真勇者ダイン,20:ドノマンティス,...(+1)
- special lock: -
- next turn: attack:player_front_right:attack->master:cpu / focus:player_front_left / focus:player_back_right / summon:player_card_051_2->player_back_left / ...
- reason: ボムゾウを空き枠へ召喚
- board: PF:ヤンバル Lv2 HP3 / PF:デスシープ Lv2 HP6 / PB:ドノマンティス Lv1 HP5

### death_sheep_special_lock: デスシープ seed 136411 turn 7

- variant/opponent: `current_back_slot_reservation_plan80` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ボムゾウ Lv1 HP4 / stones after 7 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=2:ボムゾウ,11:ヤンバル,15:ヤンバル,17:ピグミィ,20:ピグミィ / top5BackWork=2:ボムゾウ / noReachFront=3:デスシープ,6:ドノマンティス,8:ポリスピナー,13:真勇者ダイン,14:真勇者ダイン,16:真勇者ダイン,18:ドノマンティス,19:ポリスピナー
- special lock: ボムゾウ Lv1: ストームボム
- next turn: attack:player_front_right:attack->master:cpu / focus:player_front_left / focus:player_back_left / master:shield->monster:player_front_right / ...
- reason: デスシープを空き枠へ召喚
- board: PF:ボムゾウ Lv1 HP4 / PF:デスシープ Lv2 HP3 / PB:ドノマンティス Lv1 HP3 / CB:ピグミィ Lv1 HP3 prep

### blocked_no_pattern_move_forward: ポリスピナー seed 136413 turn 9

- variant/opponent: `current_back_slot_reservation_plan80` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_left / role front / front デスシープ Lv1 HP6 / stones after 9 / score 26
- flags: no-backline-pattern, next-attack, next-move-front, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=3:ヤンバル,4:ボムゾウ,5:ボムゾウ,11:ボムゾウ,12:ヤンバル / top5BackWork=3:ヤンバル,4:ボムゾウ,5:ボムゾウ / noReachFront=1:真勇者ダイン,2:ドノマンティス,9:ポリスピナー,10:真勇者ダイン,13:デスシープ,17:ドノマンティス
- special lock: -
- next turn: attack:cpu_front_left:attack->master:player / attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / ...
- reason: カードを後列左へ召喚
- board: PF:ナッツロックル Lv1 HP6 prep / CF:デスシープ Lv1 HP6 / CF:デスシープ Lv1 HP6 / CB:ピグミィ Lv2 HP1

### death_sheep_special_lock: デスシープ seed 136418 turn 9

- variant/opponent: `current_back_slot_reservation_plan140` vs `black_1375_pressure` (player, win)
- decision: player_back_right / role front / front ヤンバル Lv2 HP1 / stones after 3 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=2:ヤンバル,10:ボムゾウ,15:ボムゾウ,17:ピグミィ / top5BackWork=2:ヤンバル / noReachFront=1:真勇者ダイン,3:ポリスピナー,5:ドノマンティス,12:ドノマンティス,13:真勇者ダイン,14:真勇者ダイン,16:ポリスピナー
- special lock: ヤンバル Lv2: ワイルドクロウ
- next turn: summon:player_card_047_1->player_back_right / attack:player_front_left:attack->master:cpu / focus:player_front_right / focus:player_back_left / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は13点差で見送り
- board: PF:デスシープ Lv1 HP2 / PF:ヤンバル Lv2 HP1 / PB:デスシープ Lv1 HP6 prep

### blocked_no_pattern_move_forward: 真勇者ダイン seed 136419 turn 2

- variant/opponent: `current_back_slot_reservation_plan140` vs `black_1375_pressure` (player, win)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 28
- flags: no-backline-pattern, next-move-front, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ヤンバル,2:ピグミィ,6:ピグミィ,8:ボムゾウ,10:ボムゾウ,11:ヤンバル,14:ヤンバル,23:ピグミィ / top5BackWork=1:ヤンバル,2:ピグミィ / noReachFront=4:真勇者ダイン,13:ドノマンティス,15:デスシープ,16:デスシープ,18:ポリスピナー,19:ドノマンティス,20:ポリスピナー,21:デスシープ,...(+1)
- special lock: -
- next turn: magic:player_card_031_1->monster:cpu_back_left / move:player_back_right->player_front_left / attack:player_front_right:attack->monster:cpu_front_right / end_turn
- reason: 真勇者ダインを空き枠へ召喚
- board: PF:ボムゾウ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:真勇者ダイン Lv1 HP6 / CF:ヤミー Lv1 HP5 prep / CF:ユニフォーン Lv1 HP5 prep / CB:ピグミィ Lv1 HP3 prep


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
