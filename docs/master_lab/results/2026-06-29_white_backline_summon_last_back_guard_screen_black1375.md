# White Backline Summon Audit Loop

生成: 2026-06-29T14:32:20.519Z
seedStart: 136700
候補: current_white_baseline, current_last_back_slot_no_reach_guard35, current_last_back_slot_no_reach_guard55, current_last_back_slot_no_reach_guard75, current_last_back_slot_no_reach_guard95
相手: black_1375_pressure
試行: 4 games/matchup/direction
総試合: 40

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 353
- 後列召喚: 223 (63.2%)
- 前列あり後列召喚: 152 (68.2%)
- うち前衛ロール: 71 (46.7%)
- デスシープ後列召喚: 11 (7.2%)
- デスシープ特技封じ損: 3 (27.3%) / W-L 2-1
- デスシープ特技封じ平均コマンド数: 1
- Backline patternあり: 100 (65.8%)
- Backline patternなし: 52 (34.2%)
- 次自ターン攻撃: 40 (26.3%)
- 次自ターン後列攻撃: 39 (25.7%)
- 次自ターン前進: 4 (2.6%)
- 次自ターン仕事なし: 109 (71.7%)
- Bad blocked summon: 49 (32.2%)
- Bad with evaluation trace: 0 (0%)
- Bad with non-summon alt: 0 (0%)
- Bad close non-summon alt: 0 (0%)
- Bad medium non-summon alt <=100: 0 (0%)
- Bad distant non-summon alt <=200: 0 (0%)
- Bad avg best non-summon gap: 0
- Bad top summon alt: 0 (0%)
- Bad top summon same card: 0 (0%)
- Bad top summon backline pattern: 0 (0%)
- Bad with other backline work in hand: 5 (10.2%)
- Bad consumes last back slot: 34 (69.4%)
- Bad leaves no empty back slot: 34 (69.4%)
- Avg no-reach front cards in back after bad: 1.24
- Bad with deck backline work: 49 (100%)
- Bad with deck top5 backline work: 42 (85.7%)
- Bad consumes last back slot with deck backline work: 34 (69.4%)
- Avg deck backline work cards after bad: 5.69
- Avg deck top5 backline work cards after bad: 1.61

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Death Sheep Lock | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_white_baseline | 1-7-0 | 67 | 47 (70.1%) | 32 (68.1%) | 17 (53.1%) | 1 (100%) | 19 (59.4%) | 13 (40.6%) | 10 (31.3%) | 10 (31.3%) | 2 (6.3%) | 20 (62.5%) | 12 (37.5%) | 0 (0%) | HandReach1, DeckReach12, DeckTop5Reach10, LastBack9, NoEmptyBack9 | 12 (37.5%) | 6/26 |
| current_last_back_slot_no_reach_guard35 | 3-5-0 | 76 | 52 (68.4%) | 34 (65.4%) | 16 (47.1%) | 1 (50%) | 23 (67.6%) | 11 (32.4%) | 10 (29.4%) | 9 (26.5%) | 1 (2.9%) | 24 (70.6%) | 10 (29.4%) | 0 (0%) | HandReach1, DeckReach10, DeckTop5Reach9, LastBack7, NoEmptyBack7 | 12 (35.3%) | 16/18 |
| current_last_back_slot_no_reach_guard55 | 3-5-0 | 74 | 43 (58.1%) | 28 (65.1%) | 12 (42.9%) | 1 (33.3%) | 18 (64.3%) | 10 (35.7%) | 7 (25%) | 7 (25%) | 0 (0%) | 21 (75%) | 10 (35.7%) | 0 (0%) | HandReach1, DeckReach10, DeckTop5Reach9, LastBack5, NoEmptyBack5 | 9 (32.1%) | 7/21 |
| current_last_back_slot_no_reach_guard75 | 2-6-0 | 69 | 44 (63.8%) | 33 (75%) | 16 (48.5%) | 0 (0%) | 23 (69.7%) | 10 (30.3%) | 5 (15.2%) | 5 (15.2%) | 0 (0%) | 28 (84.8%) | 10 (30.3%) | 0 (0%) | DeckReach10, DeckTop5Reach7, LastBack8, NoEmptyBack8 | 14 (42.4%) | 7/26 |
| current_last_back_slot_no_reach_guard95 | 0-8-0 | 67 | 37 (55.2%) | 25 (67.6%) | 10 (40%) | 0 (0%) | 17 (68%) | 8 (32%) | 8 (32%) | 8 (32%) | 1 (4%) | 16 (64%) | 7 (28%) | 0 (0%) | HandReach2, DeckReach7, DeckTop5Reach7, LastBack5, NoEmptyBack5 | 8 (32%) | 0/25 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Death Sheep Lock | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | black_1375_pressure | 1-7-0 | 32 | 1 (100%) | 19 (59.4%) | 13 (40.6%) | 20 (62.5%) | 12 (37.5%) | 0 (0%) |
| current_last_back_slot_no_reach_guard35 | black_1375_pressure | 3-5-0 | 34 | 1 (50%) | 23 (67.6%) | 11 (32.4%) | 24 (70.6%) | 10 (29.4%) | 0 (0%) |
| current_last_back_slot_no_reach_guard55 | black_1375_pressure | 3-5-0 | 28 | 1 (33.3%) | 18 (64.3%) | 10 (35.7%) | 21 (75%) | 10 (35.7%) | 0 (0%) |
| current_last_back_slot_no_reach_guard75 | black_1375_pressure | 2-6-0 | 33 | 0 (0%) | 23 (69.7%) | 10 (30.3%) | 28 (84.8%) | 10 (30.3%) | 0 (0%) |
| current_last_back_slot_no_reach_guard95 | black_1375_pressure | 0-8-0 | 25 | 0 (0%) | 17 (68%) | 8 (32%) | 16 (64%) | 7 (28%) | 0 (0%) |

## Samples

### blocked_no_pattern_no_work: 真勇者ダイン seed 136700 turn 3

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 5 / score 28
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=23 / backWork=1:ピグミィ,3:ボムゾウ,4:ボムゾウ,7:ヤンバル,8:ヤンバル,9:ヤンバル,12:ピグミィ,22:ピグミィ,...(+1) / top5BackWork=1:ピグミィ,3:ボムゾウ,4:ボムゾウ / noReachFront=2:ドノマンティス,5:デスシープ,6:デスシープ,11:真勇者ダイン,13:真勇者ダイン,14:ポリスピナー,15:ドノマンティス,17:ポリスピナー,...(+1)
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / summon:player_card_051_1->player_back_right / focus:player_front_left / focus:player_back_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、マジックは79点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv1 HP6 / CF:ナッツロックル Lv1 HP6 / CF:ナッツロックル Lv1 HP5 / CB:ピグミィ Lv1 HP3

### bad_blocked_no_eval_trace: 真勇者ダイン seed 136700 turn 3

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 5 / score 28
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=23 / backWork=1:ピグミィ,3:ボムゾウ,4:ボムゾウ,7:ヤンバル,8:ヤンバル,9:ヤンバル,12:ピグミィ,22:ピグミィ,...(+1) / top5BackWork=1:ピグミィ,3:ボムゾウ,4:ボムゾウ / noReachFront=2:ドノマンティス,5:デスシープ,6:デスシープ,11:真勇者ダイン,13:真勇者ダイン,14:ポリスピナー,15:ドノマンティス,17:ポリスピナー,...(+1)
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / summon:player_card_051_1->player_back_right / focus:player_front_left / focus:player_back_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、マジックは79点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv1 HP6 / CF:ナッツロックル Lv1 HP6 / CF:ナッツロックル Lv1 HP5 / CB:ピグミィ Lv1 HP3

### blocked_backline_pattern_worked: ピグミィ seed 136700 turn 4

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front デスシープ Lv2 HP6 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=2:ボムゾウ,3:ボムゾウ,6:ヤンバル,7:ヤンバル,8:ヤンバル,11:ピグミィ,21:ピグミィ,22:ボムゾウ / top5BackWork=2:ボムゾウ,3:ボムゾウ / noReachFront=1:ドノマンティス,4:デスシープ,5:デスシープ,10:真勇者ダイン,12:真勇者ダイン,13:ポリスピナー,14:ドノマンティス,16:ポリスピナー,...(+1)
- special lock: -
- next turn: master:wake_up->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは2点差で見送り、ためるは58点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv2 HP6 / PB:真勇者ダイン Lv1 HP6 / CB:ナッツロックル Lv1 HP6 / CB:ピグミィ Lv1 HP2

### low_stone_blocked_no_work: ピグミィ seed 136701 turn 1

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front デスシープ Lv1 HP6 prep / stones after 0 / score 67
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=ピグミィ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=25 / backWork=4:ヤンバル,7:ボムゾウ,8:ボムゾウ,11:ピグミィ,16:ヤンバル,25:ボムゾウ / top5BackWork=4:ヤンバル / noReachFront=2:ポリスピナー,3:ポリスピナー,5:ドノマンティス,9:真勇者ダイン,10:真勇者ダイン,12:ドノマンティス,13:ポリスピナー,15:ドノマンティス,...(+3)
- special lock: -
- next turn: focus:player_front_left / focus:player_front_right / summon:player_card_051_1->player_back_left / focus:player_back_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、召喚は92点差で見送り
- board: PF:デスシープ Lv1 HP6 prep / PB:ヤンバル Lv1 HP3 prep

### blocked_backline_pattern_worked: ピグミィ seed 136701 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role back / front ヤンバル Lv1 HP3 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=3:ヤンバル,6:ボムゾウ,7:ボムゾウ,10:ピグミィ,15:ヤンバル,24:ボムゾウ / top5BackWork=3:ヤンバル / noReachFront=1:ポリスピナー,2:ポリスピナー,4:ドノマンティス,8:真勇者ダイン,9:真勇者ダイン,11:ドノマンティス,12:ポリスピナー,14:ドノマンティス,...(+3)
- special lock: -
- next turn: attack:player_back_right:スパイクボール->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / move:player_front_left->player_back_left / summon:player_polyspinner_3->player_front_left / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: ためるは43点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ユニフォーン Lv1 HP5 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_backline_pattern_worked: ヤンバル seed 136701 turn 5

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role back / front ピグミィ Lv1 HP3 / stones after 6 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=3:ボムゾウ,4:ボムゾウ,7:ピグミィ,12:ヤンバル,21:ボムゾウ / top5BackWork=3:ボムゾウ,4:ボムゾウ / noReachFront=1:ドノマンティス,5:真勇者ダイン,6:真勇者ダイン,8:ドノマンティス,9:ポリスピナー,11:ドノマンティス,13:デスシープ,16:デスシープ,...(+1)
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_left:wild_claw->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / attack:player_front_left:スパイクボール->monster:cpu_back_right / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: 移動は21点差で見送り、攻撃は32点差で見送り
- board: PF:ピグミィ Lv1 HP3 / PF:デスシープ Lv2 HP6 / PB:ピグミィ Lv1 HP3 / CF:ボムゾウ Lv1 HP6 prep / CB:ヤンバル Lv1 HP3 / CB:ピグミィ Lv2 HP3

### blocked_no_pattern_no_work: ポリスピナー seed 136701 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 5 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=19 / backWork=1:ボムゾウ,2:ボムゾウ,5:ピグミィ,10:ヤンバル,19:ボムゾウ / top5BackWork=1:ボムゾウ,2:ボムゾウ,5:ピグミィ / noReachFront=3:真勇者ダイン,4:真勇者ダイン,6:ドノマンティス,7:ポリスピナー,9:ドノマンティス,11:デスシープ,14:デスシープ,17:真勇者ダイン
- special lock: -
- next turn: attack:player_front_left:attack->master:cpu / attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv2 HP4 / CF:ヤミー Lv1 HP5 prep / CB:ヤンバル Lv1 HP3 prep

### bad_blocked_no_eval_trace: ポリスピナー seed 136701 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 5 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=19 / backWork=1:ボムゾウ,2:ボムゾウ,5:ピグミィ,10:ヤンバル,19:ボムゾウ / top5BackWork=1:ボムゾウ,2:ボムゾウ,5:ピグミィ / noReachFront=3:真勇者ダイン,4:真勇者ダイン,6:ドノマンティス,7:ポリスピナー,9:ドノマンティス,11:デスシープ,14:デスシープ,17:真勇者ダイン
- special lock: -
- next turn: attack:player_front_left:attack->master:cpu / attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv2 HP4 / CF:ヤミー Lv1 HP5 prep / CB:ヤンバル Lv1 HP3 prep

### blocked_backline_pattern_worked: ボムゾウ seed 136701 turn 8

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front デスシープ Lv2 HP4 / stones after 3 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=1:ボムゾウ,4:ピグミィ,9:ヤンバル,18:ボムゾウ / top5BackWork=1:ボムゾウ,4:ピグミィ / noReachFront=2:真勇者ダイン,3:真勇者ダイン,5:ドノマンティス,6:ポリスピナー,8:ドノマンティス,10:デスシープ,13:デスシープ,16:真勇者ダイン
- special lock: -
- next turn: attack:player_front_right:storm_bomb->monster:cpu_back_left / attack:player_front_left:attack->monster:cpu_front_left / summon:player_bomuzo_3->player_back_right / master:wake_up->monster:player_back_right / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: ためるは150点差で見送り、マスター特技は243点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv2 HP4 / PB:ポリスピナー Lv1 HP3 / CF:ヤミー Lv1 HP1 / CB:ピグミィ Lv1 HP3 prep / CB:ヤンバル Lv1 HP2

### front_role_allowed_by_range: ボムゾウ seed 136701 turn 8

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front デスシープ Lv2 HP4 / stones after 3 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=1:ボムゾウ,4:ピグミィ,9:ヤンバル,18:ボムゾウ / top5BackWork=1:ボムゾウ,4:ピグミィ / noReachFront=2:真勇者ダイン,3:真勇者ダイン,5:ドノマンティス,6:ポリスピナー,8:ドノマンティス,10:デスシープ,13:デスシープ,16:真勇者ダイン
- special lock: -
- next turn: attack:player_front_right:storm_bomb->monster:cpu_back_left / attack:player_front_left:attack->monster:cpu_front_left / summon:player_bomuzo_3->player_back_right / master:wake_up->monster:player_back_right / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: ためるは150点差で見送り、マスター特技は243点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv2 HP4 / PB:ポリスピナー Lv1 HP3 / CF:ヤミー Lv1 HP1 / CB:ピグミィ Lv1 HP3 prep / CB:ヤンバル Lv1 HP2

### front_role_allowed_by_range: ボムゾウ seed 136701 turn 9

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv2 HP5 / stones after 4 / score 23
- flags: backline-pattern, next-move-front, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=3:ピグミィ,8:ヤンバル,17:ボムゾウ / top5BackWork=3:ピグミィ / noReachFront=1:真勇者ダイン,2:真勇者ダイン,4:ドノマンティス,5:ポリスピナー,7:ドノマンティス,9:デスシープ,12:デスシープ,15:真勇者ダイン
- special lock: -
- next turn: attack:player_front_right:self_bomb->master:cpu / move:player_back_right->player_front_left / master:shield->monster:player_front_left / end_turn
- reason: ボムゾウを空き枠へ召喚 / 見送り: マスター特技は236点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:ボムゾウ Lv2 HP5 / PB:ポリスピナー Lv1 HP3 / CF:ピグミィ Lv2 HP1

### blocked_no_pattern_no_work: 真勇者ダイン seed 136701 turn 11

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP1 / stones after 6 / score 28
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=真勇者ダイン / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=15 / backWork=1:ピグミィ,6:ヤンバル,15:ボムゾウ / top5BackWork=1:ピグミィ / noReachFront=2:ドノマンティス,3:ポリスピナー,5:ドノマンティス,7:デスシープ,10:デスシープ,13:真勇者ダイン
- special lock: -
- next turn: end_turn
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は78点差で見送り
- board: PF:ボムゾウ Lv2 HP5 / PF:ドノマンティス Lv1 HP1 / PB:ポリスピナー Lv1 HP3 / CF:ポリスピナー Lv2 HP3

### bad_blocked_no_eval_trace: 真勇者ダイン seed 136701 turn 11

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP1 / stones after 6 / score 28
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=真勇者ダイン / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=15 / backWork=1:ピグミィ,6:ヤンバル,15:ボムゾウ / top5BackWork=1:ピグミィ / noReachFront=2:ドノマンティス,3:ポリスピナー,5:ドノマンティス,7:デスシープ,10:デスシープ,13:真勇者ダイン
- special lock: -
- next turn: end_turn
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は78点差で見送り
- board: PF:ボムゾウ Lv2 HP5 / PF:ドノマンティス Lv1 HP1 / PB:ポリスピナー Lv1 HP3 / CF:ポリスピナー Lv2 HP3

### blocked_backline_pattern_worked: ヤンバル seed 136702 turn 4

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 4 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=1:ボムゾウ,3:ヤンバル,4:ピグミィ,11:ピグミィ,13:ボムゾウ,16:ボムゾウ,18:ヤンバル / top5BackWork=1:ボムゾウ,3:ヤンバル,4:ピグミィ / noReachFront=2:デスシープ,6:ポリスピナー,8:ポリスピナー,14:真勇者ダイン,15:ポリスピナー,17:ドノマンティス,19:ドノマンティス,20:真勇者ダイン,...(+2)
- special lock: -
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:ダイン斬り->master:cpu / focus:player_front_right / summon:player_bomuzo_3->player_back_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 攻撃は76点差で見送り、マスター特技は188点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv2 HP3 / CF:ナッツロックル Lv1 HP4 / CF:ヤミー Lv1 HP2 / CB:ピグミィ Lv1 HP3 prep

### front_role_allowed_by_range: ボムゾウ seed 136702 turn 5

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front 真勇者ダイン Lv2 HP6 / stones after 4 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=2:ヤンバル,3:ピグミィ,10:ピグミィ,12:ボムゾウ,15:ボムゾウ,17:ヤンバル / top5BackWork=2:ヤンバル,3:ピグミィ / noReachFront=1:デスシープ,5:ポリスピナー,7:ポリスピナー,13:真勇者ダイン,14:ポリスピナー,16:ドノマンティス,18:ドノマンティス,19:真勇者ダイン,...(+2)
- special lock: -
- next turn: attack:player_front_left:ダイン斬り->master:cpu / attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_back_left:storm_bomb->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / ...
- reason: ボムゾウを空き枠へ召喚
- board: PF:真勇者ダイン Lv2 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv2 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CB:ヤンバル Lv1 HP3 prep

### blocked_no_pattern_no_work: ポリスピナー seed 136702 turn 12

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ボムゾウ Lv2 HP2 / stones after 6 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=14 / backWork=3:ピグミィ,5:ボムゾウ,8:ボムゾウ,10:ヤンバル / top5BackWork=3:ピグミィ,5:ボムゾウ / noReachFront=6:真勇者ダイン,7:ポリスピナー,9:ドノマンティス,11:ドノマンティス,12:真勇者ダイン,13:デスシープ,14:デスシープ
- special lock: -
- next turn: focus:player_front_left / attack:player_front_left:attack->master:cpu / focus:player_front_right / summon:player_polyspinner_1->player_back_left / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、ためるは17点差で見送り
- board: PF:ボムゾウ Lv2 HP2 / PF:デスシープ Lv1 HP4 / PB:ピグミィ Lv1 HP1

### bad_blocked_no_eval_trace: ポリスピナー seed 136702 turn 12

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ボムゾウ Lv2 HP2 / stones after 6 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=14 / backWork=3:ピグミィ,5:ボムゾウ,8:ボムゾウ,10:ヤンバル / top5BackWork=3:ピグミィ,5:ボムゾウ / noReachFront=6:真勇者ダイン,7:ポリスピナー,9:ドノマンティス,11:ドノマンティス,12:真勇者ダイン,13:デスシープ,14:デスシープ
- special lock: -
- next turn: focus:player_front_left / attack:player_front_left:attack->master:cpu / focus:player_front_right / summon:player_polyspinner_1->player_back_left / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、ためるは17点差で見送り
- board: PF:ボムゾウ Lv2 HP2 / PF:デスシープ Lv1 HP4 / PB:ピグミィ Lv1 HP1

### blocked_no_pattern_no_work: ポリスピナー seed 136702 turn 13

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv1 HP3 / stones after 10 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=13 / backWork=2:ピグミィ,4:ボムゾウ,7:ボムゾウ,9:ヤンバル / top5BackWork=2:ピグミィ,4:ボムゾウ / noReachFront=5:真勇者ダイン,6:ポリスピナー,8:ドノマンティス,10:ドノマンティス,11:真勇者ダイン,12:デスシープ,13:デスシープ
- special lock: -
- next turn: attack:player_front_right:attack->master:cpu / attack:player_front_left:attack->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / master:shield->monster:player_front_right / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:ポリスピナー Lv1 HP3 / PF:デスシープ Lv1 HP4 / PB:ピグミィ Lv1 HP1 / CB:ヤンバル Lv1 HP3 prep

### bad_blocked_no_eval_trace: ポリスピナー seed 136702 turn 13

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv1 HP3 / stones after 10 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=13 / backWork=2:ピグミィ,4:ボムゾウ,7:ボムゾウ,9:ヤンバル / top5BackWork=2:ピグミィ,4:ボムゾウ / noReachFront=5:真勇者ダイン,6:ポリスピナー,8:ドノマンティス,10:ドノマンティス,11:真勇者ダイン,12:デスシープ,13:デスシープ
- special lock: -
- next turn: attack:player_front_right:attack->master:cpu / attack:player_front_left:attack->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / master:shield->monster:player_front_right / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:ポリスピナー Lv1 HP3 / PF:デスシープ Lv1 HP4 / PB:ピグミィ Lv1 HP1 / CB:ヤンバル Lv1 HP3 prep

### low_stone_blocked_no_work: ヤンバル seed 136703 turn 1

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front デスシープ Lv1 HP6 prep / stones after 0 / score 68
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=25 / backWork=2:ピグミィ,9:ボムゾウ,10:ボムゾウ,12:ピグミィ,13:ボムゾウ,14:ヤンバル,17:ピグミィ,22:ヤンバル / top5BackWork=2:ピグミィ / noReachFront=3:ドノマンティス,4:真勇者ダイン,5:真勇者ダイン,6:ドノマンティス,7:ドノマンティス,8:ポリスピナー,18:ポリスピナー,19:ポリスピナー,...(+2)
- special lock: -
- next turn: focus:player_front_left / focus:player_front_right / focus:player_back_right / master:shield->monster:player_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は163点差で見送り
- board: PF:デスシープ Lv1 HP6 prep / PB:デスシープ Lv1 HP6 prep

### death_sheep_special_lock: デスシープ seed 136706 turn 3

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front ピグミィ Lv1 HP3 / stones after 4 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=2:ボムゾウ,7:ボムゾウ,13:ヤンバル,18:ヤンバル,19:ボムゾウ,20:ピグミィ,21:ピグミィ / top5BackWork=2:ボムゾウ / noReachFront=3:真勇者ダイン,4:ドノマンティス,5:ドノマンティス,8:真勇者ダイン,9:デスシープ,11:ポリスピナー,14:デスシープ,22:ポリスピナー
- special lock: ピグミィ Lv1: スパイクボール
- next turn: attack:cpu_front_left:ダイン斬り->master:player / magic:cpu_card_031_1->monster:player_front_right / attack:cpu_back_left:wild_claw->monster:player_front_right / focus:cpu_front_right / ...
- reason: カードを後列右へ召喚 / 見送り: 攻撃は46点差で見送り、攻撃は53点差で見送り
- board: PF:ヤミー Lv1 HP5 / PF:真勇者ダイン Lv1 HP6 prep / PB:ピグミィ Lv1 HP3 prep / CF:真勇者ダイン Lv1 HP6 / CF:ピグミィ Lv1 HP3 / CB:ヤンバル Lv2 HP3

### low_stone_blocked_no_work: ドノマンティス seed 136706 turn 4

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front デスシープ Lv1 HP6 / stones after 1 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ボムゾウ,6:ボムゾウ,12:ヤンバル,17:ヤンバル,18:ボムゾウ,19:ピグミィ,20:ピグミィ / top5BackWork=1:ボムゾウ / noReachFront=2:真勇者ダイン,3:ドノマンティス,4:ドノマンティス,7:真勇者ダイン,8:デスシープ,10:ポリスピナー,13:デスシープ,21:ポリスピナー
- special lock: -
- next turn: attack:cpu_front_right:attack->monster:player_front_right / master:master_attack->monster:player_front_right / focus:cpu_front_left / summon:cpu_bomuzo_2->cpu_back_left / ...
- reason: カードを後列右へ召喚 / 見送り: マスター特技は154点差で見送り、マスター特技は165点差で見送り
- board: PB:真勇者ダイン Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CF:デスシープ Lv1 HP6 / CB:ヤンバル Lv2 HP3

### front_role_allowed_by_range: ボムゾウ seed 136706 turn 5

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv1 HP3 / stones after 2 / score 23
- flags: backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=5:ボムゾウ,11:ヤンバル,16:ヤンバル,17:ボムゾウ,18:ピグミィ,19:ピグミィ / top5BackWork=5:ボムゾウ / noReachFront=1:真勇者ダイン,2:ドノマンティス,3:ドノマンティス,6:真勇者ダイン,7:デスシープ,9:ポリスピナー,12:デスシープ,20:ポリスピナー
- special lock: -
- next turn: move:cpu_back_right->cpu_front_left / focus:cpu_front_right / focus:cpu_back_left / master:shield->monster:cpu_front_right / ...
- reason: カードを後列左へ召喚 / 見送り: ためるは33点差で見送り
- board: CF:真勇者ダイン Lv1 HP3 / CF:デスシープ Lv1 HP4 / CB:ドノマンティス Lv1 HP5

### low_stone_blocked_no_work: 真勇者ダイン seed 136706 turn 11

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv3 HP6 / stones after 0 / score 28
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=ドノマンティス,ドノマンティス / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=14 / backWork=5:ヤンバル,10:ヤンバル,11:ボムゾウ,12:ピグミィ,13:ピグミィ / top5BackWork=5:ヤンバル / noReachFront=1:デスシープ,3:ポリスピナー,6:デスシープ,14:ポリスピナー
- special lock: -
- next turn: attack:cpu_front_left:ダイン斬り->master:player / attack:cpu_front_right:ダイン斬り->master:player / master:shield->monster:cpu_front_right / end_turn
- reason: カードを後列左へ召喚 / 見送り: 召喚は5点差で見送り、召喚は16点差で見送り
- board: PF:ヤミー Lv1 HP5 prep / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv3 HP6 / CF:デスシープ Lv2 HP3 / CB:真勇者ダイン Lv1 HP3

### blocked_no_pattern_move_forward: ポリスピナー seed 136707 turn 6

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role front / front 真勇者ダイン Lv1 HP6 prep / stones after 1 / score 26
- flags: no-backline-pattern, next-move-front, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=1:ヤンバル,3:ボムゾウ,5:ヤンバル,8:ヤンバル,12:ボムゾウ,14:ボムゾウ / top5BackWork=1:ヤンバル,3:ボムゾウ,5:ヤンバル / noReachFront=4:真勇者ダイン,9:ドノマンティス,10:デスシープ,11:ドノマンティス,13:真勇者ダイン,15:ポリスピナー,19:デスシープ
- special lock: -
- next turn: attack:cpu_front_left:attack->monster:player_front_left / move:cpu_back_right->cpu_front_right / master:master_attack->monster:player_front_left / master:master_attack->monster:player_front_left / ...
- reason: カードを後列右へ召喚 / 見送り: マスター特技は138点差で見送り
- board: PF:ボムゾウ Lv1 HP6 prep / PF:ピグミィ Lv2 HP3 / PB:ヤンバル Lv2 HP3 / CF:デスシープ Lv2 HP6 / CF:真勇者ダイン Lv1 HP6 prep / CB:ドノマンティス Lv1 HP5 prep

### low_stone_blocked_no_work: ピグミィ seed 136708 turn 5

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role back / front デスシープ Lv2 HP6 / stones after 1 / score 67
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=3:ヤンバル,5:ボムゾウ,7:ヤンバル,10:ヤンバル,14:ボムゾウ,16:ボムゾウ / top5BackWork=3:ヤンバル,5:ボムゾウ / noReachFront=1:ポリスピナー,6:真勇者ダイン,11:ドノマンティス,12:デスシープ,13:ドノマンティス,15:真勇者ダイン,17:ポリスピナー,21:デスシープ
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_front_right:ダイン斬り->master:cpu / focus:player_back_left / master:shield->monster:player_front_right / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: 召喚は185点差で見送り、マスター特技は250点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:真勇者ダイン Lv1 HP2 / PB:ピグミィ Lv1 HP3 / CB:ポリスピナー Lv1 HP3 prep

### front_role_allowed_by_range: ボムゾウ seed 136710 turn 9

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv1 HP3 / stones after 0 / score 23
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=2:ヤンバル,10:ピグミィ,11:ボムゾウ,13:ヤンバル / top5BackWork=2:ヤンバル / noReachFront=1:ドノマンティス,4:真勇者ダイン,5:ドノマンティス,9:デスシープ,12:ポリスピナー,14:デスシープ,15:真勇者ダイン,17:デスシープ,...(+1)
- special lock: -
- next turn: attack:player_front_right:呪いの刃->master:cpu / attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / master:shield->monster:player_front_right / ...
- reason: ボムゾウを空き枠へ召喚
- board: PF:ポリスピナー Lv1 HP3 / PF:ドノマンティス Lv2 HP3 / PB:ピグミィ Lv1 HP3 / CF:ポリスピナー Lv1 HP3 prep

### blocked_no_pattern_move_forward: ポリスピナー seed 136711 turn 4

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front デスシープ Lv1 HP6 / stones after 1 / score 26
- flags: no-backline-pattern, next-attack, next-move-front, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=3:ボムゾウ,7:ピグミィ,11:ボムゾウ,12:ピグミィ,13:ヤンバル,14:ピグミィ,21:ボムゾウ / top5BackWork=3:ボムゾウ / noReachFront=4:ポリスピナー,6:ドノマンティス,8:ポリスピナー,9:真勇者ダイン,16:デスシープ,17:デスシープ,18:真勇者ダイン,19:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / move:player_back_left->player_front_right / attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_left / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: マスター特技は1点差で見送り、マスター特技は43点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv2 HP5 / PB:ヤンバル Lv2 HP3 / CF:ヤミー Lv1 HP5 prep / CB:真勇者ダイン Lv1 HP6

### death_sheep_special_lock: デスシープ seed 136713 turn 15

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front ボムゾウ Lv1 HP4 / stones after 7 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=10 / backWork=3:ヤンバル,8:ボムゾウ / top5BackWork=3:ヤンバル / noReachFront=1:真勇者ダイン,4:デスシープ,5:ポリスピナー,6:真勇者ダイン,7:真勇者ダイン
- special lock: ボムゾウ Lv1: ストームボム
- next turn: attack:cpu_front_right:attack->master:player / attack:cpu_front_right:attack->master:player / end_turn
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は10点差で見送り
- board: PF:ヤミー Lv1 HP5 prep / CF:ボムゾウ Lv1 HP4 / CF:ポリスピナー Lv2 HP3

### death_sheep_special_lock: デスシープ seed 136716 turn 8

- variant/opponent: `current_last_back_slot_no_reach_guard55` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ピグミィ Lv1 HP3 / stones after 3 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ポリスピナー / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=18 / backWork=2:ピグミィ,6:ピグミィ,14:ボムゾウ,15:ヤンバル,17:ボムゾウ / top5BackWork=2:ピグミィ / noReachFront=4:デスシープ,7:ドノマンティス,8:真勇者ダイン,9:デスシープ,10:真勇者ダイン,12:ドノマンティス,16:真勇者ダイン
- special lock: ピグミィ Lv1: スパイクボール
- next turn: master:master_attack->monster:cpu_front_left / focus:player_front_left / attack:player_front_left:attack->master:cpu / move:player_front_right->player_back_right / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 移動は25点差で見送り、召喚は76点差で見送り
- board: PF:ピグミィ Lv1 HP3 / PF:ポリスピナー Lv1 HP3 / CF:ボムゾウ Lv2 HP5 / CB:真勇者ダイン Lv1 HP6 prep

### blocked_no_pattern_move_forward: デスシープ seed 136736 turn 11

- variant/opponent: `current_last_back_slot_no_reach_guard95` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role front / front 真勇者ダイン Lv1 HP6 / stones after 3 / score 25
- flags: no-backline-pattern, next-move-front, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=14 / backWork=3:ボムゾウ,5:ヤンバル,6:ボムゾウ / top5BackWork=3:ボムゾウ,5:ヤンバル / noReachFront=7:デスシープ,8:ポリスピナー,10:真勇者ダイン,11:ドノマンティス,14:ドノマンティス
- special lock: -
- next turn: move:cpu_back_right->cpu_front_right / focus:cpu_front_left / master:shield->monster:cpu_back_left / end_turn
- reason: カードを後列右へ召喚 / 見送り: 召喚は36点差で見送り、召喚は36点差で見送り
- board: CF:真勇者ダイン Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv2 HP3


## Notes

- この監査は前衛/後衛ラベルだけではなく、後列から攻撃できるパターンを別扱いにする。
- ボムゾウのような射程持ちは `Backline Pattern` 側に入り、今回の抑制候補からは外す。
- 前が詰まった後列に、後列攻撃パターンを持たないカードを置く例が一定数ある。ここだけを抑える候補は検証価値がある。
- 詰まり後列召喚が次自ターンの攻撃/前進に変換されない例が多い。召喚の盤面評価だけでなく次ターン仕事予定が必要。
- 詰まり後列召喚の多くは射程持ちカードでもあるため、一律ペナルティは避けるべき。
- デスシープ後列召喚の中に、味方前列の下段特技を封じる例が混ざっている。後列枠問題とは別に、前列特技の機会損失として監査・候補化すべき。
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
