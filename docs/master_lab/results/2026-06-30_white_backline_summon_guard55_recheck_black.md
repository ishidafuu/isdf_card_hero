# White Backline Summon Audit Loop

生成: 2026-06-30T01:04:53.412Z
seedStart: 137500
候補: current_white_baseline, current_last_back_slot_no_reach_guard55
相手: black_1375_pressure, black_pressure_strong
試行: 2 games/matchup/direction
総試合: 16

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 125
- 後列召喚: 93 (74.4%)
- 前列あり後列召喚: 64 (68.8%)
- うち前衛ロール: 37 (57.8%)
- デスシープ後列召喚: 5 (7.8%)
- デスシープ特技封じ損: 0 (0%) / W-L 0-0
- デスシープ特技封じ平均コマンド数: 0
- Backline patternあり: 39 (60.9%)
- Backline patternなし: 25 (39.1%)
- 次自ターン攻撃: 16 (25%)
- 次自ターン後列攻撃: 16 (25%)
- 次自ターン前進: 0 (0%)
- 次自ターン仕事なし: 48 (75%)
- Bad blocked summon: 25 (39.1%)
- Bad with evaluation trace: 0 (0%)
- Bad with non-summon alt: 0 (0%)
- Bad close non-summon alt: 0 (0%)
- Bad medium non-summon alt <=100: 0 (0%)
- Bad distant non-summon alt <=200: 0 (0%)
- Bad avg best non-summon gap: 0
- Bad top summon alt: 0 (0%)
- Bad top summon same card: 0 (0%)
- Bad top summon backline pattern: 0 (0%)
- Bad with other backline work in hand: 1 (4%)
- Bad consumes last back slot: 16 (64%)
- Bad leaves no empty back slot: 16 (64%)
- Avg no-reach front cards in back after bad: 1.28
- Bad with deck backline work: 25 (100%)
- Bad with deck top5 backline work: 21 (84%)
- Bad consumes last back slot with deck backline work: 16 (64%)
- Avg deck backline work cards after bad: 6.72
- Avg deck top5 backline work cards after bad: 2

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Death Sheep Lock | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_white_baseline | 2-6-0 | 56 | 44 (78.6%) | 28 (63.6%) | 18 (64.3%) | 0 (0%) | 14 (50%) | 14 (50%) | 6 (21.4%) | 6 (21.4%) | 0 (0%) | 22 (78.6%) | 14 (50%) | 0 (0%) | HandReach1, DeckReach14, DeckTop5Reach11, LastBack9, NoEmptyBack9 | 11 (39.3%) | 6/22 |
| current_last_back_slot_no_reach_guard55 | 5-3-0 | 69 | 49 (71%) | 36 (73.5%) | 19 (52.8%) | 0 (0%) | 25 (69.4%) | 11 (30.6%) | 10 (27.8%) | 10 (27.8%) | 0 (0%) | 26 (72.2%) | 11 (30.6%) | 0 (0%) | DeckReach11, DeckTop5Reach10, LastBack7, NoEmptyBack7 | 17 (47.2%) | 20/16 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Death Sheep Lock | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | black_1375_pressure | 1-3-0 | 17 | 0 (0%) | 8 (47.1%) | 9 (52.9%) | 14 (82.4%) | 9 (52.9%) | 0 (0%) |
| current_white_baseline | black_pressure_strong | 1-3-0 | 11 | 0 (0%) | 6 (54.5%) | 5 (45.5%) | 8 (72.7%) | 5 (45.5%) | 0 (0%) |
| current_last_back_slot_no_reach_guard55 | black_1375_pressure | 2-2-0 | 20 | 0 (0%) | 12 (60%) | 8 (40%) | 16 (80%) | 8 (40%) | 0 (0%) |
| current_last_back_slot_no_reach_guard55 | black_pressure_strong | 3-1-0 | 16 | 0 (0%) | 13 (81.3%) | 3 (18.8%) | 10 (62.5%) | 3 (18.8%) | 0 (0%) |

## Samples

### low_stone_blocked_no_work: ピグミィ seed 137500 turn 1

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front デスシープ Lv1 HP6 prep / stones after 0 / score 67
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=25 / backWork=3:ボムゾウ,4:ヤンバル,5:ヤンバル,9:ボムゾウ,10:ボムゾウ,12:ピグミィ,18:ヤンバル,21:ピグミィ / top5BackWork=3:ボムゾウ,4:ヤンバル,5:ヤンバル / noReachFront=6:ドノマンティス,8:真勇者ダイン,11:デスシープ,13:真勇者ダイン,14:ポリスピナー,15:ポリスピナー,16:ポリスピナー,20:真勇者ダイン,...(+1)
- special lock: -
- next turn: summon:player_card_037_2->player_back_left / focus:player_front_left / focus:player_front_right / focus:player_back_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は31点差で見送り、召喚は163点差で見送り
- board: PF:デスシープ Lv1 HP6 prep / PB:デスシープ Lv1 HP6 prep

### blocked_no_pattern_no_work: ドノマンティス seed 137500 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front デスシープ Lv1 HP6 / stones after 2 / score 24
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ボムゾウ,3:ヤンバル,4:ヤンバル,8:ボムゾウ,9:ボムゾウ,11:ピグミィ,17:ヤンバル,20:ピグミィ / top5BackWork=2:ボムゾウ,3:ヤンバル,4:ヤンバル / noReachFront=5:ドノマンティス,7:真勇者ダイン,10:デスシープ,12:真勇者ダイン,13:ポリスピナー,14:ポリスピナー,15:ポリスピナー,19:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_right / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは11点差で見送り、ためるは11点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ボムゾウ Lv1 HP6 prep

### bad_blocked_no_eval_trace: ドノマンティス seed 137500 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front デスシープ Lv1 HP6 / stones after 2 / score 24
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ボムゾウ,3:ヤンバル,4:ヤンバル,8:ボムゾウ,9:ボムゾウ,11:ピグミィ,17:ヤンバル,20:ピグミィ / top5BackWork=2:ボムゾウ,3:ヤンバル,4:ヤンバル / noReachFront=5:ドノマンティス,7:真勇者ダイン,10:デスシープ,12:真勇者ダイン,13:ポリスピナー,14:ポリスピナー,15:ポリスピナー,19:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_right / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは11点差で見送り、ためるは11点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ボムゾウ Lv1 HP6 prep

### front_role_allowed_by_range: ボムゾウ seed 137500 turn 11

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ヤンバル Lv1 HP3 / stones after 4 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ,ボムゾウ / noReachFront=ドノマンティス,真勇者ダイン / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=15 / backWork=2:ピグミィ,8:ヤンバル,11:ピグミィ / top5BackWork=2:ピグミィ / noReachFront=1:デスシープ,3:真勇者ダイン,4:ポリスピナー,5:ポリスピナー,6:ポリスピナー,10:真勇者ダイン,13:ドノマンティス
- special lock: -
- next turn: attack:player_front_right:wild_claw->monster:cpu_back_right / attack:player_front_left:スパイクボール->monster:cpu_back_right / end_turn
- reason: ボムゾウを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、召喚は50点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:ヤンバル Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ヤンバル Lv2 HP3 / CB:ヤンバル Lv1 HP3 prep / CB:ピグミィ Lv1 HP3

### blocked_no_pattern_no_work: ドノマンティス seed 137501 turn 3

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 5 / score 24
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=23 / backWork=4:ピグミィ,6:ボムゾウ,7:ヤンバル,8:ヤンバル,12:ボムゾウ,13:ヤンバル,17:ピグミィ,23:ピグミィ / top5BackWork=4:ピグミィ / noReachFront=1:ポリスピナー,2:ポリスピナー,9:デスシープ,10:真勇者ダイン,11:真勇者ダイン,14:デスシープ,15:デスシープ,16:ドノマンティス,...(+2)
- special lock: -
- next turn: master:master_attack->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_front_right:self_bomb->master:cpu / focus:player_back_left / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は47点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:ボムゾウ Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CF:真勇者ダイン Lv1 HP5 / CB:ピグミィ Lv1 HP3

### bad_blocked_no_eval_trace: ドノマンティス seed 137501 turn 3

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 5 / score 24
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=23 / backWork=4:ピグミィ,6:ボムゾウ,7:ヤンバル,8:ヤンバル,12:ボムゾウ,13:ヤンバル,17:ピグミィ,23:ピグミィ / top5BackWork=4:ピグミィ / noReachFront=1:ポリスピナー,2:ポリスピナー,9:デスシープ,10:真勇者ダイン,11:真勇者ダイン,14:デスシープ,15:デスシープ,16:ドノマンティス,...(+2)
- special lock: -
- next turn: master:master_attack->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_front_right:self_bomb->master:cpu / focus:player_back_left / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は47点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:ボムゾウ Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CF:真勇者ダイン Lv1 HP5 / CB:ピグミィ Lv1 HP3

### blocked_no_pattern_no_work: ポリスピナー seed 137501 turn 4

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv2 HP2 / stones after 0 / score 26
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=3:ピグミィ,5:ボムゾウ,6:ヤンバル,7:ヤンバル,11:ボムゾウ,12:ヤンバル,16:ピグミィ,22:ピグミィ / top5BackWork=3:ピグミィ,5:ボムゾウ / noReachFront=1:ポリスピナー,8:デスシープ,9:真勇者ダイン,10:真勇者ダイン,13:デスシープ,14:デスシープ,15:ドノマンティス,18:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_left:呪いの刃->master:cpu / focus:player_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:ドノマンティス Lv2 HP5 / PF:ボムゾウ Lv2 HP2 / PB:ドノマンティス Lv1 HP5 / CF:ユニフォーン Lv1 HP5 prep / CB:ピグミィ Lv1 HP3

### bad_blocked_no_eval_trace: ポリスピナー seed 137501 turn 4

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv2 HP2 / stones after 0 / score 26
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=3:ピグミィ,5:ボムゾウ,6:ヤンバル,7:ヤンバル,11:ボムゾウ,12:ヤンバル,16:ピグミィ,22:ピグミィ / top5BackWork=3:ピグミィ,5:ボムゾウ / noReachFront=1:ポリスピナー,8:デスシープ,9:真勇者ダイン,10:真勇者ダイン,13:デスシープ,14:デスシープ,15:ドノマンティス,18:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_left:呪いの刃->master:cpu / focus:player_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:ドノマンティス Lv2 HP5 / PF:ボムゾウ Lv2 HP2 / PB:ドノマンティス Lv1 HP5 / CF:ユニフォーン Lv1 HP5 prep / CB:ピグミィ Lv1 HP3

### low_stone_blocked_no_work: ポリスピナー seed 137501 turn 4

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv2 HP2 / stones after 0 / score 26
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=3:ピグミィ,5:ボムゾウ,6:ヤンバル,7:ヤンバル,11:ボムゾウ,12:ヤンバル,16:ピグミィ,22:ピグミィ / top5BackWork=3:ピグミィ,5:ボムゾウ / noReachFront=1:ポリスピナー,8:デスシープ,9:真勇者ダイン,10:真勇者ダイン,13:デスシープ,14:デスシープ,15:ドノマンティス,18:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_left:呪いの刃->master:cpu / focus:player_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:ドノマンティス Lv2 HP5 / PF:ボムゾウ Lv2 HP2 / PB:ドノマンティス Lv1 HP5 / CF:ユニフォーン Lv1 HP5 prep / CB:ピグミィ Lv1 HP3

### blocked_no_pattern_no_work: ポリスピナー seed 137501 turn 6

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 3 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=20 / backWork=1:ピグミィ,3:ボムゾウ,4:ヤンバル,5:ヤンバル,9:ボムゾウ,10:ヤンバル,14:ピグミィ,20:ピグミィ / top5BackWork=1:ピグミィ,3:ボムゾウ,4:ヤンバル,5:ヤンバル / noReachFront=6:デスシープ,7:真勇者ダイン,8:真勇者ダイン,11:デスシープ,12:デスシープ,13:ドノマンティス,16:真勇者ダイン,18:ポリスピナー
- special lock: -
- next turn: attack:player_front_right:attack->master:cpu / attack:player_front_right:attack->master:cpu / end_turn
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は78点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:ポリスピナー Lv2 HP3 / CB:ピグミィ Lv1 HP2

### bad_blocked_no_eval_trace: ポリスピナー seed 137501 turn 6

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 3 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=20 / backWork=1:ピグミィ,3:ボムゾウ,4:ヤンバル,5:ヤンバル,9:ボムゾウ,10:ヤンバル,14:ピグミィ,20:ピグミィ / top5BackWork=1:ピグミィ,3:ボムゾウ,4:ヤンバル,5:ヤンバル / noReachFront=6:デスシープ,7:真勇者ダイン,8:真勇者ダイン,11:デスシープ,12:デスシープ,13:ドノマンティス,16:真勇者ダイン,18:ポリスピナー
- special lock: -
- next turn: attack:player_front_right:attack->master:cpu / attack:player_front_right:attack->master:cpu / end_turn
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は78点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:ポリスピナー Lv2 HP3 / CB:ピグミィ Lv1 HP2

### blocked_backline_pattern_worked: ヤンバル seed 137502 turn 1

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role back / front デスシープ Lv1 HP6 prep / stones after 0 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=5:ボムゾウ,6:ピグミィ,7:ボムゾウ,9:ヤンバル,10:ヤンバル,18:ピグミィ,22:ボムゾウ,23:ピグミィ / top5BackWork=5:ボムゾウ / noReachFront=1:ポリスピナー,2:ポリスピナー,3:ドノマンティス,4:ドノマンティス,11:デスシープ,12:デスシープ,13:ポリスピナー,16:ドノマンティス,...(+2)
- special lock: -
- next turn: attack:cpu_back_right:wild_claw->monster:player_front_left / master:master_attack->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_front_right:attack->monster:player_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は99点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 prep / PF:真勇者ダイン Lv1 HP6 prep / PB:ピグミィ Lv1 HP3 prep / CF:デスシープ Lv1 HP6 prep / CB:真勇者ダイン Lv1 HP6 prep

### blocked_no_pattern_no_work: ポリスピナー seed 137502 turn 3

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv2 HP6 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=3:ボムゾウ,4:ピグミィ,5:ボムゾウ,7:ヤンバル,8:ヤンバル,16:ピグミィ,20:ボムゾウ,21:ピグミィ / top5BackWork=3:ボムゾウ,4:ピグミィ,5:ボムゾウ / noReachFront=1:ドノマンティス,2:ドノマンティス,9:デスシープ,10:デスシープ,11:ポリスピナー,14:ドノマンティス,17:真勇者ダイン,19:真勇者ダイン
- special lock: -
- next turn: master:master_attack->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_back_right:wild_claw->master:player / end_turn
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:ユニフォーン Lv1 HP5 prep / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv2 HP6 / CF:デスシープ Lv1 HP6 / CB:ヤンバル Lv2 HP3

### bad_blocked_no_eval_trace: ポリスピナー seed 137502 turn 3

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv2 HP6 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=3:ボムゾウ,4:ピグミィ,5:ボムゾウ,7:ヤンバル,8:ヤンバル,16:ピグミィ,20:ボムゾウ,21:ピグミィ / top5BackWork=3:ボムゾウ,4:ピグミィ,5:ボムゾウ / noReachFront=1:ドノマンティス,2:ドノマンティス,9:デスシープ,10:デスシープ,11:ポリスピナー,14:ドノマンティス,17:真勇者ダイン,19:真勇者ダイン
- special lock: -
- next turn: master:master_attack->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_back_right:wild_claw->master:player / end_turn
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:ユニフォーン Lv1 HP5 prep / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv2 HP6 / CF:デスシープ Lv1 HP6 / CB:ヤンバル Lv2 HP3

### blocked_backline_pattern_worked: ボムゾウ seed 137503 turn 1

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front デスシープ Lv1 HP6 prep / stones after 0 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=ピグミィ / noReachFront=ドノマンティス,デスシープ / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ヤンバル,9:ピグミィ,10:ボムゾウ,13:ヤンバル,18:ピグミィ,20:ボムゾウ,22:ヤンバル / top5BackWork=1:ヤンバル / noReachFront=3:ドノマンティス,5:真勇者ダイン,6:真勇者ダイン,7:ポリスピナー,11:ポリスピナー,14:ポリスピナー,21:真勇者ダイン,23:ドノマンティス
- special lock: -
- next turn: attack:cpu_front_left:attack->monster:player_front_left / summon:cpu_yanbaru_2->cpu_back_left / attack:cpu_back_right:storm_bomb->monster:player_front_left / master:wake_up->monster:cpu_back_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は39点差で見送り、召喚は100点差で見送り
- board: PF:ナッツロックル Lv1 HP6 prep / PF:ナッツロックル Lv1 HP6 prep / PB:ユニフォーン Lv1 HP5 prep / CF:デスシープ Lv1 HP6 prep / CB:デスシープ Lv1 HP6 prep

### front_role_allowed_by_range: ボムゾウ seed 137503 turn 1

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front デスシープ Lv1 HP6 prep / stones after 0 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=ピグミィ / noReachFront=ドノマンティス,デスシープ / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ヤンバル,9:ピグミィ,10:ボムゾウ,13:ヤンバル,18:ピグミィ,20:ボムゾウ,22:ヤンバル / top5BackWork=1:ヤンバル / noReachFront=3:ドノマンティス,5:真勇者ダイン,6:真勇者ダイン,7:ポリスピナー,11:ポリスピナー,14:ポリスピナー,21:真勇者ダイン,23:ドノマンティス
- special lock: -
- next turn: attack:cpu_front_left:attack->monster:player_front_left / summon:cpu_yanbaru_2->cpu_back_left / attack:cpu_back_right:storm_bomb->monster:player_front_left / master:wake_up->monster:cpu_back_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は39点差で見送り、召喚は100点差で見送り
- board: PF:ナッツロックル Lv1 HP6 prep / PF:ナッツロックル Lv1 HP6 prep / PB:ユニフォーン Lv1 HP5 prep / CF:デスシープ Lv1 HP6 prep / CB:デスシープ Lv1 HP6 prep

### blocked_backline_pattern_worked: ピグミィ seed 137503 turn 3

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role back / front ヤンバル Lv2 HP3 / stones after 3 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,デスシープ / emptyBack 2->1 / noReachBackAfter=0
- deck pressure: deck=22 / backWork=7:ピグミィ,8:ボムゾウ,11:ヤンバル,16:ピグミィ,18:ボムゾウ,20:ヤンバル / top5BackWork=- / noReachFront=1:ドノマンティス,3:真勇者ダイン,4:真勇者ダイン,5:ポリスピナー,9:ポリスピナー,12:ポリスピナー,19:真勇者ダイン,21:ドノマンティス
- special lock: -
- next turn: master:wake_up->monster:player_front_right / attack:cpu_front_right:self_bomb->monster:player_front_right / move:cpu_front_left->cpu_back_left / summon:cpu_card_133_1->cpu_front_left / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は25点差で見送り
- board: PF:ユニフォーン Lv2 HP5 / CF:ヤンバル Lv2 HP3 / CF:ボムゾウ Lv2 HP5

### blocked_backline_pattern_worked: ピグミィ seed 137504 turn 1

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role back / front デスシープ Lv1 HP6 prep / stones after 0 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=25 / backWork=2:ヤンバル,10:ピグミィ,11:ボムゾウ,14:ヤンバル,19:ピグミィ,21:ボムゾウ,23:ヤンバル / top5BackWork=2:ヤンバル / noReachFront=1:デスシープ,4:ドノマンティス,6:真勇者ダイン,7:真勇者ダイン,8:ポリスピナー,12:ポリスピナー,15:ポリスピナー,22:真勇者ダイン,...(+1)
- special lock: -
- next turn: master:wake_up->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / end_turn
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は20点差で見送り、召喚は31点差で見送り
- board: PF:デスシープ Lv1 HP6 prep / PB:デスシープ Lv1 HP6 prep

### front_role_allowed_by_range: ボムゾウ seed 137504 turn 4

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role front / front デスシープ Lv1 HP3 / stones after 5 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=7:ピグミィ,8:ボムゾウ,11:ヤンバル,16:ピグミィ,18:ボムゾウ,20:ヤンバル / top5BackWork=- / noReachFront=1:ドノマンティス,3:真勇者ダイン,4:真勇者ダイン,5:ポリスピナー,9:ポリスピナー,12:ポリスピナー,19:真勇者ダイン,21:ドノマンティス
- special lock: -
- next turn: master:master_attack->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_front_right:attack->master:cpu / focus:player_back_left / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 召喚は73点差で見送り
- board: PF:デスシープ Lv1 HP3 / PF:デスシープ Lv1 HP3 / PB:デスシープ Lv1 HP6 prep / CF:ホロウダイン Lv1 HP5 prep

### low_stone_blocked_no_work: デスシープ seed 137505 turn 3

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role front / front デスシープ Lv2 HP6 / stones after 0 / score 25
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=23 / backWork=10:ヤンバル,13:ピグミィ,14:ボムゾウ,15:ピグミィ,17:ピグミィ,19:ボムゾウ,21:ボムゾウ / top5BackWork=- / noReachFront=1:ポリスピナー,4:デスシープ,6:ポリスピナー,7:ドノマンティス,9:真勇者ダイン,11:ポリスピナー,12:ドノマンティス,16:真勇者ダイン,...(+2)
- special lock: -
- next turn: master:wake_up->monster:cpu_back_right / attack:player_front_right:attack->master:cpu / attack:player_front_left:wild_claw->monster:cpu_back_right / focus:player_back_right / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は120点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:デスシープ Lv2 HP6 / CF:ホロウダイン Lv3 HP5

### blocked_backline_pattern_worked: ピグミィ seed 137506 turn 6

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_left / role back / front ドノマンティス Lv1 HP5 / stones after 8 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=1:ピグミィ,3:ボムゾウ,9:ヤンバル,11:ボムゾウ,15:ピグミィ,19:ヤンバル / top5BackWork=1:ピグミィ,3:ボムゾウ / noReachFront=4:真勇者ダイン,5:ドノマンティス,6:ドノマンティス,7:ポリスピナー,8:ポリスピナー,10:デスシープ,12:真勇者ダイン,17:デスシープ,...(+1)
- special lock: -
- next turn: attack:cpu_front_left:attack->monster:player_front_left / summon:cpu_card_051_1->cpu_back_right / attack:cpu_back_left:スパイクボール->monster:player_front_left / master:wake_up->monster:cpu_back_right / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: マスター特技は57点差で見送り、攻撃は108点差で見送り
- board: PF:ゾンビ Lv2 HP4 / PF:ナッツロックル Lv1 HP6 / CF:ドノマンティス Lv1 HP5 / CF:ボムゾウ Lv2 HP1 / CB:ポリスピナー Lv1 HP1

### front_role_allowed_by_range: ボムゾウ seed 137507 turn 2

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, win)
- decision: cpu_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 2 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,真勇者ダイン / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=8:ヤンバル,15:ピグミィ,17:ピグミィ,20:ピグミィ,21:ボムゾウ,22:ヤンバル / top5BackWork=- / noReachFront=1:デスシープ,2:ドノマンティス,4:ポリスピナー,6:デスシープ,9:ポリスピナー,12:デスシープ,13:ドノマンティス,14:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_back_left:wild_claw->monster:player_front_right / focus:cpu_front_right / attack:cpu_back_right:storm_bomb->monster:player_front_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は56点差で見送り、召喚は73点差で見送り
- board: PF:ゾンビ Lv1 HP4 / PB:ラティーヌ Lv1 HP4 / CF:真勇者ダイン Lv2 HP6 / CF:ボムゾウ Lv1 HP6 / CB:ヤンバル Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 137508 turn 2

- variant/opponent: `current_last_back_slot_no_reach_guard55` vs `black_1375_pressure` (player, win)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 2 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=9:ヤンバル,16:ピグミィ,18:ピグミィ,21:ピグミィ,22:ボムゾウ,23:ヤンバル / top5BackWork=- / noReachFront=1:真勇者ダイン,2:デスシープ,3:ドノマンティス,5:ポリスピナー,7:デスシープ,10:ポリスピナー,13:デスシープ,14:ドノマンティス,...(+2)
- special lock: -
- next turn: attack:player_front_right:self_bomb->monster:cpu_front_right / attack:player_back_left:wild_claw->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_left:ダイン斬り->monster:cpu_front_left / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: ためるは24点差で見送り、召喚は108点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:ヤミー Lv1 HP5 prep / CF:ヤミー Lv1 HP5 prep / CB:真勇者ダイン Lv1 HP6 prep

### low_stone_blocked_no_work: デスシープ seed 137508 turn 8

- variant/opponent: `current_last_back_slot_no_reach_guard55` vs `black_1375_pressure` (player, win)
- decision: player_back_right / role front / front 真勇者ダイン Lv1 HP6 / stones after 0 / score 25
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=3:ヤンバル,10:ピグミィ,12:ピグミィ,15:ピグミィ,16:ボムゾウ,17:ヤンバル / top5BackWork=3:ヤンバル / noReachFront=1:デスシープ,4:ポリスピナー,7:デスシープ,8:ドノマンティス,9:真勇者ダイン,13:ポリスピナー
- special lock: -
- next turn: summon:player_card_133_1->player_front_left / summon:player_card_037_3->player_back_left / summon:player_polyspinner_3->player_back_right / end_turn
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は13点差で見送り、召喚は36点差で見送り
- board: PF:真勇者ダイン Lv3 HP4 / PF:真勇者ダイン Lv1 HP6 / PB:ヤンバル Lv2 HP3 / CF:ナッツロックル Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 / CB:ピグミィ Lv1 HP3

### low_stone_blocked_no_work: ヤンバル seed 137512 turn 1

- variant/opponent: `current_last_back_slot_no_reach_guard55` vs `black_pressure_strong` (player, win)
- decision: player_back_right / role back / front デスシープ Lv1 HP6 prep / stones after 0 / score 68
- flags: backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=25 / backWork=3:ボムゾウ,6:ボムゾウ,8:ピグミィ,9:ピグミィ,10:ピグミィ,21:ヤンバル,22:ヤンバル / top5BackWork=3:ボムゾウ / noReachFront=1:真勇者ダイン,4:真勇者ダイン,5:デスシープ,11:ドノマンティス,13:ポリスピナー,14:デスシープ,16:ポリスピナー,18:ドノマンティス,...(+2)
- special lock: -
- next turn: focus:player_front_left / focus:player_front_right / focus:player_back_right / summon:player_bomuzo_2->player_back_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は21点差で見送り、召喚は78点差で見送り
- board: PF:デスシープ Lv1 HP6 prep / PB:真勇者ダイン Lv1 HP6 prep


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
