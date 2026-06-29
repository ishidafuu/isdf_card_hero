# White Backline Summon Audit Loop

生成: 2026-06-29T11:08:38.328Z
seedStart: 136560
候補: current_white_baseline, current_back_slot_future_state55
相手: black_pressure_strong, decoy_back_stable
試行: 2 games/matchup/direction
総試合: 16

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 136
- 後列召喚: 72 (52.9%)
- 前列あり後列召喚: 53 (73.6%)
- うち前衛ロール: 22 (41.5%)
- デスシープ後列召喚: 6 (11.3%)
- デスシープ特技封じ損: 2 (33.3%) / W-L 1-1
- デスシープ特技封じ平均コマンド数: 1
- Backline patternあり: 38 (71.7%)
- Backline patternなし: 15 (28.3%)
- 次自ターン攻撃: 19 (35.8%)
- 次自ターン後列攻撃: 19 (35.8%)
- 次自ターン前進: 1 (1.9%)
- 次自ターン仕事なし: 33 (62.3%)
- Bad blocked summon: 14 (26.4%)
- Bad with evaluation trace: 0 (0%)
- Bad with non-summon alt: 0 (0%)
- Bad close non-summon alt: 0 (0%)
- Bad medium non-summon alt <=100: 0 (0%)
- Bad distant non-summon alt <=200: 0 (0%)
- Bad avg best non-summon gap: 0
- Bad top summon alt: 0 (0%)
- Bad top summon same card: 0 (0%)
- Bad top summon backline pattern: 0 (0%)
- Bad with other backline work in hand: 2 (14.3%)
- Bad consumes last back slot: 12 (85.7%)
- Bad leaves no empty back slot: 12 (85.7%)
- Avg no-reach front cards in back after bad: 1.07
- Bad with deck backline work: 14 (100%)
- Bad with deck top5 backline work: 11 (78.6%)
- Bad consumes last back slot with deck backline work: 12 (85.7%)
- Avg deck backline work cards after bad: 5.36
- Avg deck top5 backline work cards after bad: 1.43

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Death Sheep Lock | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_white_baseline | 5-3-0 | 56 | 27 (48.2%) | 19 (70.4%) | 8 (42.1%) | 2 (50%) | 12 (63.2%) | 7 (36.8%) | 8 (42.1%) | 8 (42.1%) | 1 (5.3%) | 10 (52.6%) | 6 (31.6%) | 0 (0%) | DeckReach6, DeckTop5Reach3, LastBack6, NoEmptyBack6 | 10 (52.6%) | 15/4 |
| current_back_slot_future_state55 | 2-4-2 | 80 | 45 (56.3%) | 34 (75.6%) | 14 (41.2%) | 0 (0%) | 26 (76.5%) | 8 (23.5%) | 11 (32.4%) | 11 (32.4%) | 0 (0%) | 23 (67.6%) | 8 (23.5%) | 0 (0%) | HandReach2, DeckReach8, DeckTop5Reach8, LastBack6, NoEmptyBack6 | 15 (44.1%) | 10/14 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Death Sheep Lock | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | black_pressure_strong | 1-3-0 | 7 | 1 (100%) | 4 (57.1%) | 3 (42.9%) | 3 (42.9%) | 2 (28.6%) | 0 (0%) |
| current_white_baseline | decoy_back_stable | 4-0-0 | 12 | 1 (33.3%) | 8 (66.7%) | 4 (33.3%) | 7 (58.3%) | 4 (33.3%) | 0 (0%) |
| current_back_slot_future_state55 | black_pressure_strong | 0-4-0 | 14 | 0 (0%) | 9 (64.3%) | 5 (35.7%) | 12 (85.7%) | 5 (35.7%) | 0 (0%) |
| current_back_slot_future_state55 | decoy_back_stable | 2-0-2 | 20 | 0 (0%) | 17 (85%) | 3 (15%) | 11 (55%) | 3 (15%) | 0 (0%) |

## Samples

### blocked_backline_pattern_worked: ヤンバル seed 136560 turn 2

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / role back / front ボムゾウ Lv1 HP6 / stones after 2 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=ピグミィ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=6:ピグミィ,11:ボムゾウ,21:ピグミィ,22:ボムゾウ,24:ヤンバル / top5BackWork=- / noReachFront=1:真勇者ダイン,4:ドノマンティス,7:ポリスピナー,8:ドノマンティス,9:真勇者ダイン,10:デスシープ,12:デスシープ,13:ドノマンティス,...(+3)
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / attack:player_back_left:wild_claw->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、ためるは2点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:アンノウン Lv1 HP5 prep / CF:グングニエル Lv1 HP5 prep / CB:フーヨウ Lv1 HP3 prep

### blocked_backline_pattern_worked: ピグミィ seed 136560 turn 8

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_left / role back / front ヤンバル Lv1 HP3 / stones after 4 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=5:ボムゾウ,15:ピグミィ,16:ボムゾウ,18:ヤンバル / top5BackWork=5:ボムゾウ / noReachFront=1:ポリスピナー,2:ドノマンティス,3:真勇者ダイン,4:デスシープ,6:デスシープ,7:ドノマンティス,10:ポリスピナー,11:ポリスピナー,...(+1)
- special lock: -
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / focus:player_front_right / focus:player_back_left / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: 移動は78点差で見送り、召喚は89点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:真勇者ダイン Lv1 HP6 prep / PB:ヤンバル Lv2 HP3 / CF:神斬丸 Lv1 HP5 prep

### blocked_backline_pattern_worked: ピグミィ seed 136561 turn 2

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=9:ヤンバル,10:ボムゾウ,12:ボムゾウ,16:ヤンバル,19:ピグミィ,21:ピグミィ / top5BackWork=- / noReachFront=2:ポリスピナー,3:デスシープ,5:ドノマンティス,6:ドノマンティス,8:ポリスピナー,11:真勇者ダイン,17:真勇者ダイン,18:真勇者ダイン,...(+2)
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_left:attack->monster:cpu_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは2点差で見送り、ためるは2点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:グングニエル Lv1 HP5 prep / CF:ヒートロン Lv1 HP5 prep

### blocked_no_pattern_move_forward: ドノマンティス seed 136561 turn 8

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_back_right / role front / front デスシープ Lv1 HP6 prep / stones after 4 / score 24
- flags: no-backline-pattern, next-move-front, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=3:ヤンバル,4:ボムゾウ,6:ボムゾウ,10:ヤンバル,13:ピグミィ,15:ピグミィ / top5BackWork=3:ヤンバル,4:ボムゾウ / noReachFront=2:ポリスピナー,5:真勇者ダイン,11:真勇者ダイン,12:真勇者ダイン,14:ポリスピナー,18:デスシープ
- special lock: -
- next turn: attack:player_front_left:スパイクボール->monster:cpu_front_right / move:player_back_right->player_front_left / focus:player_front_right / summon:player_card_037_3->player_back_left / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、召喚は23点差で見送り
- board: PF:ドノマンティス Lv2 HP2 / PF:デスシープ Lv1 HP6 prep / PB:ピグミィ Lv2 HP1 / CF:ホロウダイン Lv2 HP4

### blocked_no_pattern_no_work: ドノマンティス seed 136561 turn 9

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 7 / score 24
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=2:ヤンバル,3:ボムゾウ,5:ボムゾウ,9:ヤンバル,12:ピグミィ,14:ピグミィ / top5BackWork=2:ヤンバル,3:ボムゾウ,5:ボムゾウ / noReachFront=1:ポリスピナー,4:真勇者ダイン,10:真勇者ダイン,11:真勇者ダイン,13:ポリスピナー,17:デスシープ
- special lock: -
- next turn: attack:player_front_right:attack->master:cpu / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は23点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv2 HP1

### bad_blocked_no_eval_trace: ドノマンティス seed 136561 turn 9

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 7 / score 24
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=2:ヤンバル,3:ボムゾウ,5:ボムゾウ,9:ヤンバル,12:ピグミィ,14:ピグミィ / top5BackWork=2:ヤンバル,3:ボムゾウ,5:ボムゾウ / noReachFront=1:ポリスピナー,4:真勇者ダイン,10:真勇者ダイン,11:真勇者ダイン,13:ポリスピナー,17:デスシープ
- special lock: -
- next turn: attack:player_front_right:attack->master:cpu / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は23点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv2 HP1

### blocked_no_pattern_no_work: デスシープ seed 136562 turn 2

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 1 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=2:ピグミィ,5:ピグミィ,6:ヤンバル,7:ヤンバル,13:ボムゾウ,16:ピグミィ,17:ボムゾウ,19:ヤンバル / top5BackWork=2:ピグミィ,5:ピグミィ / noReachFront=1:ドノマンティス,3:真勇者ダイン,8:デスシープ,11:ドノマンティス,15:ポリスピナー,18:真勇者ダイン,21:ポリスピナー,23:ポリスピナー
- special lock: ボムゾウ Lv1: ストームボム
- next turn: attack:cpu_front_right:self_bomb->master:player / focus:cpu_front_left / focus:cpu_back_right / master:shield->monster:cpu_front_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は13点差で見送り、ためるは34点差で見送り
- board: CF:デスシープ Lv1 HP6 / CF:ボムゾウ Lv1 HP6 / CB:真勇者ダイン Lv1 HP6

### bad_blocked_no_eval_trace: デスシープ seed 136562 turn 2

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 1 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=2:ピグミィ,5:ピグミィ,6:ヤンバル,7:ヤンバル,13:ボムゾウ,16:ピグミィ,17:ボムゾウ,19:ヤンバル / top5BackWork=2:ピグミィ,5:ピグミィ / noReachFront=1:ドノマンティス,3:真勇者ダイン,8:デスシープ,11:ドノマンティス,15:ポリスピナー,18:真勇者ダイン,21:ポリスピナー,23:ポリスピナー
- special lock: ボムゾウ Lv1: ストームボム
- next turn: attack:cpu_front_right:self_bomb->master:player / focus:cpu_front_left / focus:cpu_back_right / master:shield->monster:cpu_front_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は13点差で見送り、ためるは34点差で見送り
- board: CF:デスシープ Lv1 HP6 / CF:ボムゾウ Lv1 HP6 / CB:真勇者ダイン Lv1 HP6

### death_sheep_special_lock: デスシープ seed 136562 turn 2

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 1 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=2:ピグミィ,5:ピグミィ,6:ヤンバル,7:ヤンバル,13:ボムゾウ,16:ピグミィ,17:ボムゾウ,19:ヤンバル / top5BackWork=2:ピグミィ,5:ピグミィ / noReachFront=1:ドノマンティス,3:真勇者ダイン,8:デスシープ,11:ドノマンティス,15:ポリスピナー,18:真勇者ダイン,21:ポリスピナー,23:ポリスピナー
- special lock: ボムゾウ Lv1: ストームボム
- next turn: attack:cpu_front_right:self_bomb->master:player / focus:cpu_front_left / focus:cpu_back_right / master:shield->monster:cpu_front_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は13点差で見送り、ためるは34点差で見送り
- board: CF:デスシープ Lv1 HP6 / CF:ボムゾウ Lv1 HP6 / CB:真勇者ダイン Lv1 HP6

### low_stone_blocked_no_work: デスシープ seed 136562 turn 2

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 1 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=2:ピグミィ,5:ピグミィ,6:ヤンバル,7:ヤンバル,13:ボムゾウ,16:ピグミィ,17:ボムゾウ,19:ヤンバル / top5BackWork=2:ピグミィ,5:ピグミィ / noReachFront=1:ドノマンティス,3:真勇者ダイン,8:デスシープ,11:ドノマンティス,15:ポリスピナー,18:真勇者ダイン,21:ポリスピナー,23:ポリスピナー
- special lock: ボムゾウ Lv1: ストームボム
- next turn: attack:cpu_front_right:self_bomb->master:player / focus:cpu_front_left / focus:cpu_back_right / master:shield->monster:cpu_front_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は13点差で見送り、ためるは34点差で見送り
- board: CF:デスシープ Lv1 HP6 / CF:ボムゾウ Lv1 HP6 / CB:真勇者ダイン Lv1 HP6

### low_stone_blocked_no_work: ピグミィ seed 136563 turn 3

- variant/opponent: `current_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_right / role back / front ポリスピナー Lv1 HP3 / stones after 1 / score 67
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=1:ボムゾウ,5:ヤンバル,7:ボムゾウ,8:ヤンバル,16:ヤンバル,19:ピグミィ / top5BackWork=1:ボムゾウ,5:ヤンバル / noReachFront=3:真勇者ダイン,6:デスシープ,10:デスシープ,11:デスシープ,12:ドノマンティス,13:ドノマンティス,14:真勇者ダイン,17:ポリスピナー,...(+3)
- special lock: -
- next turn: attack:cpu_front_right:スパイクボール->monster:player_front_left / attack:cpu_front_left:self_bomb->monster:player_front_left / move:cpu_front_right->cpu_back_right / summon:cpu_bomuzo_3->cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 攻撃は32点差で見送り、ためるは176点差で見送り
- board: PF:ガンプ Lv1 HP5 prep / PF:ナッツロックル Lv1 HP6 prep / PB:バルキャノン Lv1 HP3 prep / CF:ボムゾウ Lv2 HP5 / CF:ポリスピナー Lv1 HP3 / CB:ピグミィ Lv2 HP3

### blocked_backline_pattern_worked: ピグミィ seed 136564 turn 3

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_back_right / role back / front ポリスピナー Lv1 HP3 / stones after 4 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=2:ボムゾウ,6:ヤンバル,8:ボムゾウ,9:ヤンバル,17:ヤンバル,20:ピグミィ / top5BackWork=2:ボムゾウ / noReachFront=4:真勇者ダイン,7:デスシープ,11:デスシープ,12:デスシープ,13:ドノマンティス,14:ドノマンティス,15:真勇者ダイン,18:ポリスピナー,...(+3)
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / attack:player_front_right:attack->master:cpu / move:player_front_left->player_back_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: マスター特技は146点差で見送り、攻撃は170点差で見送り
- board: PF:ボムゾウ Lv1 HP4 / PF:ポリスピナー Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ホロウダイン Lv1 HP2 / CF:ヒートロン Lv1 HP5 / CB:真勇者ダイン Lv1 HP6

### blocked_no_pattern_no_work: デスシープ seed 136564 turn 14

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_back_left / role front / front ボムゾウ Lv1 HP4 / stones after 6 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=12 / backWork=6:ヤンバル,9:ピグミィ / top5BackWork=- / noReachFront=1:デスシープ,2:ドノマンティス,3:ドノマンティス,4:真勇者ダイン,7:ポリスピナー,10:ドノマンティス,11:真勇者ダイン,12:ポリスピナー
- special lock: ボムゾウ Lv1: ストームボム
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / ...
- reason: デスシープを空き枠へ召喚
- board: PF:ボムゾウ Lv1 HP4 / PF:デスシープ Lv2 HP6 / PB:ヤンバル Lv2 HP3 / CF:ファントム Lv1 HP5 / CF:アンノウン Lv1 HP5 prep

### bad_blocked_no_eval_trace: デスシープ seed 136564 turn 14

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_back_left / role front / front ボムゾウ Lv1 HP4 / stones after 6 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=12 / backWork=6:ヤンバル,9:ピグミィ / top5BackWork=- / noReachFront=1:デスシープ,2:ドノマンティス,3:ドノマンティス,4:真勇者ダイン,7:ポリスピナー,10:ドノマンティス,11:真勇者ダイン,12:ポリスピナー
- special lock: ボムゾウ Lv1: ストームボム
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / ...
- reason: デスシープを空き枠へ召喚
- board: PF:ボムゾウ Lv1 HP4 / PF:デスシープ Lv2 HP6 / PB:ヤンバル Lv2 HP3 / CF:ファントム Lv1 HP5 / CF:アンノウン Lv1 HP5 prep

### death_sheep_special_lock: デスシープ seed 136564 turn 14

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_back_left / role front / front ボムゾウ Lv1 HP4 / stones after 6 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=12 / backWork=6:ヤンバル,9:ピグミィ / top5BackWork=- / noReachFront=1:デスシープ,2:ドノマンティス,3:ドノマンティス,4:真勇者ダイン,7:ポリスピナー,10:ドノマンティス,11:真勇者ダイン,12:ポリスピナー
- special lock: ボムゾウ Lv1: ストームボム
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / ...
- reason: デスシープを空き枠へ召喚
- board: PF:ボムゾウ Lv1 HP4 / PF:デスシープ Lv2 HP6 / PB:ヤンバル Lv2 HP3 / CF:ファントム Lv1 HP5 / CF:アンノウン Lv1 HP5 prep

### blocked_no_pattern_no_work: デスシープ seed 136564 turn 17

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_back_left / role front / front デスシープ Lv1 HP6 / stones after 2 / score 25
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=9 / backWork=3:ヤンバル,6:ピグミィ / top5BackWork=3:ヤンバル / noReachFront=1:真勇者ダイン,4:ポリスピナー,7:ドノマンティス,8:真勇者ダイン,9:ポリスピナー
- special lock: -
- next turn: end_turn
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は13点差で見送り、召喚は13点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:デスシープ Lv2 HP6 / PB:ヤンバル Lv2 HP3 / CF:ナッツロックル Lv1 HP6 prep

### bad_blocked_no_eval_trace: デスシープ seed 136564 turn 17

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_back_left / role front / front デスシープ Lv1 HP6 / stones after 2 / score 25
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=9 / backWork=3:ヤンバル,6:ピグミィ / top5BackWork=3:ヤンバル / noReachFront=1:真勇者ダイン,4:ポリスピナー,7:ドノマンティス,8:真勇者ダイン,9:ポリスピナー
- special lock: -
- next turn: end_turn
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は13点差で見送り、召喚は13点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:デスシープ Lv2 HP6 / PB:ヤンバル Lv2 HP3 / CF:ナッツロックル Lv1 HP6 prep

### blocked_backline_pattern_worked: ヤンバル seed 136565 turn 8

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 prep / stones after 2 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=6:ボムゾウ,8:ヤンバル,9:ボムゾウ,10:ピグミィ,11:ヤンバル,15:ピグミィ / top5BackWork=- / noReachFront=1:ドノマンティス,4:ドノマンティス,5:ポリスピナー,7:真勇者ダイン,13:デスシープ,16:デスシープ,17:デスシープ
- special lock: -
- next turn: attack:player_front_left:ダイン斬り->master:cpu / attack:player_back_left:スパイクボール->monster:cpu_front_right / attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 攻撃は82点差で見送り、攻撃は107点差で見送り
- board: PF:真勇者ダイン Lv2 HP6 / PF:ドノマンティス Lv1 HP5 prep / PB:ピグミィ Lv1 HP3 / CF:神斬丸 Lv1 HP5 / CF:ラティーヌ Lv1 HP4

### blocked_no_pattern_no_work: 真勇者ダイン seed 136566 turn 6

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_right / role front / front ヤンバル Lv2 HP3 / stones after 4 / score 28
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=デスシープ,ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=12:ボムゾウ,14:ピグミィ,15:ヤンバル,17:ヤンバル,18:ボムゾウ,19:ピグミィ / top5BackWork=- / noReachFront=4:ポリスピナー,5:ドノマンティス,6:デスシープ,7:ポリスピナー,11:ドノマンティス,13:ポリスピナー,16:真勇者ダイン
- special lock: -
- next turn: attack:cpu_front_right:wild_claw->monster:player_back_right / attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は16点差で見送り、ためるは18点差で見送り
- board: PF:神斬丸 Lv1 HP5 prep / PF:アンノウン Lv1 HP5 / PB:ラティーヌ Lv1 HP1 / CF:真勇者ダイン Lv3 HP6 / CF:ヤンバル Lv2 HP3 / CB:ピグミィ Lv1 HP3

### bad_blocked_no_eval_trace: 真勇者ダイン seed 136566 turn 6

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_right / role front / front ヤンバル Lv2 HP3 / stones after 4 / score 28
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=デスシープ,ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=12:ボムゾウ,14:ピグミィ,15:ヤンバル,17:ヤンバル,18:ボムゾウ,19:ピグミィ / top5BackWork=- / noReachFront=4:ポリスピナー,5:ドノマンティス,6:デスシープ,7:ポリスピナー,11:ドノマンティス,13:ポリスピナー,16:真勇者ダイン
- special lock: -
- next turn: attack:cpu_front_right:wild_claw->monster:player_back_right / attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は16点差で見送り、ためるは18点差で見送り
- board: PF:神斬丸 Lv1 HP5 prep / PF:アンノウン Lv1 HP5 / PB:ラティーヌ Lv1 HP1 / CF:真勇者ダイン Lv3 HP6 / CF:ヤンバル Lv2 HP3 / CB:ピグミィ Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 136567 turn 1

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_right / role front / front デスシープ Lv1 HP6 prep / stones after 0 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=ピグミィ,ボムゾウ / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=4:ヤンバル,10:ピグミィ,14:ピグミィ,16:ヤンバル,20:ヤンバル,22:ボムゾウ / top5BackWork=4:ヤンバル / noReachFront=1:ポリスピナー,2:ポリスピナー,3:ドノマンティス,11:デスシープ,13:ドノマンティス,15:デスシープ,18:真勇者ダイン,23:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:cpu_front_right:attack->monster:player_front_right / focus:cpu_front_left / summon:cpu_card_051_3->cpu_back_left / attack:cpu_back_right:storm_bomb->monster:player_front_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、召喚は8点差で見送り
- board: PF:神斬丸 Lv1 HP5 prep / PF:ゴーント Lv1 HP1 prep / PB:ラティーヌ Lv1 HP4 prep / CF:デスシープ Lv1 HP6 prep / CB:真勇者ダイン Lv1 HP6 prep

### low_stone_blocked_no_work: デスシープ seed 136569 turn 9

- variant/opponent: `current_back_slot_future_state55` vs `black_pressure_strong` (player, loss)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 0 / score 25
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=3:ピグミィ,4:ボムゾウ,8:ボムゾウ,12:ヤンバル,16:ヤンバル / top5BackWork=3:ピグミィ,4:ボムゾウ / noReachFront=1:ポリスピナー,2:真勇者ダイン,6:真勇者ダイン,10:デスシープ,11:ドノマンティス,14:真勇者ダイン,15:ドノマンティス
- special lock: -
- next turn: master:master_attack->monster:cpu_front_left / attack:player_front_right:attack->master:cpu / attack:player_front_left:attack->monster:cpu_front_left / focus:player_back_left / ...
- reason: デスシープを空き枠へ召喚
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv2 HP6 / PB:ピグミィ Lv2 HP3 / CF:ゾンビ Lv2 HP1

### front_role_allowed_by_range: ボムゾウ seed 136570 turn 4

- variant/opponent: `current_back_slot_future_state55` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_right / role front / front ボムゾウ Lv2 HP5 / stones after 7 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=ポリスピナー,ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=4:ヤンバル,7:ピグミィ,9:ヤンバル,12:ヤンバル,15:ピグミィ / top5BackWork=4:ヤンバル / noReachFront=5:ポリスピナー,6:ドノマンティス,8:デスシープ,10:デスシープ,13:真勇者ダイン,14:デスシープ,18:ポリスピナー,19:真勇者ダイン,...(+1)
- special lock: -
- next turn: master:wake_up->monster:player_back_left / attack:cpu_front_left:スパイクボール->monster:player_back_left / move:cpu_front_left->cpu_back_right / master:master_attack->monster:player_front_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は68点差で見送り
- board: PF:フーヨウ Lv1 HP3 / CF:真勇者ダイン Lv1 HP3 / CF:ボムゾウ Lv2 HP5 / CB:ピグミィ Lv2 HP3

### front_role_allowed_by_range: ボムゾウ seed 136570 turn 5

- variant/opponent: `current_back_slot_future_state55` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_left / role front / front ボムゾウ Lv1 HP6 / stones after 0 / score 23
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=3:ヤンバル,6:ピグミィ,8:ヤンバル,11:ヤンバル,14:ピグミィ / top5BackWork=3:ヤンバル / noReachFront=4:ポリスピナー,5:ドノマンティス,7:デスシープ,9:デスシープ,12:真勇者ダイン,13:デスシープ,17:ポリスピナー,18:真勇者ダイン,...(+1)
- special lock: -
- next turn: magic:cpu_card_093_1->master:cpu / attack:cpu_front_left:self_bomb->monster:player_front_left / attack:cpu_front_right:storm_bomb->monster:player_front_left / focus:cpu_back_right / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は66点差で見送り、召喚は89点差で見送り
- board: CF:ボムゾウ Lv1 HP6 / CF:ボムゾウ Lv2 HP2 / CB:ピグミィ Lv2 HP3

### low_stone_blocked_no_work: ボムゾウ seed 136570 turn 5

- variant/opponent: `current_back_slot_future_state55` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_left / role front / front ボムゾウ Lv1 HP6 / stones after 0 / score 23
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=3:ヤンバル,6:ピグミィ,8:ヤンバル,11:ヤンバル,14:ピグミィ / top5BackWork=3:ヤンバル / noReachFront=4:ポリスピナー,5:ドノマンティス,7:デスシープ,9:デスシープ,12:真勇者ダイン,13:デスシープ,17:ポリスピナー,18:真勇者ダイン,...(+1)
- special lock: -
- next turn: magic:cpu_card_093_1->master:cpu / attack:cpu_front_left:self_bomb->monster:player_front_left / attack:cpu_front_right:storm_bomb->monster:player_front_left / focus:cpu_back_right / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は66点差で見送り、召喚は89点差で見送り
- board: CF:ボムゾウ Lv1 HP6 / CF:ボムゾウ Lv2 HP2 / CB:ピグミィ Lv2 HP3

### low_stone_blocked_no_work: ドノマンティス seed 136570 turn 6

- variant/opponent: `current_back_slot_future_state55` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_left / role front / front ボムゾウ Lv1 HP4 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=2:ヤンバル,5:ピグミィ,7:ヤンバル,10:ヤンバル,13:ピグミィ / top5BackWork=2:ヤンバル,5:ピグミィ / noReachFront=3:ポリスピナー,4:ドノマンティス,6:デスシープ,8:デスシープ,11:真勇者ダイン,12:デスシープ,16:ポリスピナー,17:真勇者ダイン,...(+1)
- special lock: -
- next turn: end_turn
- reason: カードを後列左へ召喚 / 見送り: 召喚は23点差で見送り
- board: CF:ボムゾウ Lv1 HP4 / CF:ボムゾウ Lv2 HP5 / CB:ピグミィ Lv2 HP3

### front_role_allowed_by_range: ボムゾウ seed 136572 turn 18

- variant/opponent: `current_back_slot_future_state55` vs `decoy_back_stable` (player, draw)
- decision: player_back_right / role front / front ドノマンティス Lv2 HP5 / stones after 5 / score 23
- flags: backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=真勇者ダイン,ポリスピナー,デスシープ / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=8 / backWork=4:ヤンバル,6:ヤンバル,7:ボムゾウ / top5BackWork=4:ヤンバル / noReachFront=1:ドノマンティス,5:真勇者ダイン,8:ドノマンティス
- special lock: -
- next turn: -
- reason: ボムゾウを空き枠へ召喚 / 見送り: 移動は61点差で見送り、召喚は113点差で見送り
- board: PF:ピグミィ Lv2 HP3 / PF:ドノマンティス Lv2 HP5 / PB:ピグミィ Lv2 HP3 / CF:グングニエル Lv1 HP5 / CF:ゾンビ Lv1 HP1 / CB:真勇者ダイン Lv1 HP6 / CB:ガンプ Lv1 HP5 prep

### front_role_allowed_by_range: ボムゾウ seed 136574 turn 7

- variant/opponent: `current_back_slot_future_state55` vs `decoy_back_stable` (cpu, draw)
- decision: cpu_back_left / role front / front ピグミィ Lv2 HP3 / stones after 0 / score 23
- flags: backline-pattern, next-no-work, very-low-stone, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 2->1 / noReachBackAfter=0
- deck pressure: deck=18 / backWork=1:ヤンバル,2:ピグミィ,4:ピグミィ,6:ヤンバル,8:ボムゾウ,14:ボムゾウ / top5BackWork=1:ヤンバル,2:ピグミィ,4:ピグミィ / noReachFront=5:デスシープ,11:デスシープ,13:ドノマンティス,15:真勇者ダイン,16:ドノマンティス,18:デスシープ
- special lock: -
- next turn: move:cpu_front_left->cpu_back_left / summon:cpu_yanbaru_3->cpu_back_right / summon:cpu_polyspinner_2->cpu_front_right / master:shield->monster:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は199点差で見送り
- board: CF:ピグミィ Lv2 HP3 / CF:ポリスピナー Lv2 HP3


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
