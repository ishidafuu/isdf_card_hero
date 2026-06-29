# White Backline Summon Audit Loop

生成: 2026-06-29T11:04:12.246Z
seedStart: 136520
候補: current_white_baseline, current_back_slot_future_state55
相手: white_current_mirror
試行: 1 games/matchup/direction
総試合: 4

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 39
- 後列召喚: 26 (66.7%)
- 前列あり後列召喚: 20 (76.9%)
- うち前衛ロール: 7 (35%)
- デスシープ後列召喚: 1 (5%)
- デスシープ特技封じ損: 0 (0%) / W-L 0-0
- デスシープ特技封じ平均コマンド数: 0
- Backline patternあり: 15 (75%)
- Backline patternなし: 5 (25%)
- 次自ターン攻撃: 2 (10%)
- 次自ターン後列攻撃: 2 (10%)
- 次自ターン前進: 0 (0%)
- 次自ターン仕事なし: 18 (90%)
- Bad blocked summon: 5 (25%)
- Bad with evaluation trace: 0 (0%)
- Bad with non-summon alt: 0 (0%)
- Bad close non-summon alt: 0 (0%)
- Bad medium non-summon alt <=100: 0 (0%)
- Bad distant non-summon alt <=200: 0 (0%)
- Bad avg best non-summon gap: 0
- Bad top summon alt: 0 (0%)
- Bad top summon same card: 0 (0%)
- Bad top summon backline pattern: 0 (0%)
- Bad with other backline work in hand: 1 (20%)
- Bad consumes last back slot: 5 (100%)
- Bad leaves no empty back slot: 5 (100%)
- Avg no-reach front cards in back after bad: 1.4
- Bad with deck backline work: 5 (100%)
- Bad with deck top5 backline work: 5 (100%)
- Bad consumes last back slot with deck backline work: 5 (100%)
- Avg deck backline work cards after bad: 6.6
- Avg deck top5 backline work cards after bad: 1.4

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Death Sheep Lock | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_white_baseline | 1-0-1 | 20 | 15 (75%) | 12 (80%) | 5 (41.7%) | 0 (0%) | 8 (66.7%) | 4 (33.3%) | 1 (8.3%) | 1 (8.3%) | 0 (0%) | 11 (91.7%) | 4 (33.3%) | 0 (0%) | HandReach1, DeckReach4, DeckTop5Reach4, LastBack4, NoEmptyBack4 | 3 (25%) | 4/0 |
| current_back_slot_future_state55 | 0-0-2 | 19 | 11 (57.9%) | 8 (72.7%) | 2 (25%) | 0 (0%) | 7 (87.5%) | 1 (12.5%) | 1 (12.5%) | 1 (12.5%) | 0 (0%) | 7 (87.5%) | 1 (12.5%) | 0 (0%) | DeckReach1, DeckTop5Reach1, LastBack1, NoEmptyBack1 | 2 (25%) | 0/0 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Death Sheep Lock | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | white_current_mirror | 1-0-1 | 12 | 0 (0%) | 8 (66.7%) | 4 (33.3%) | 11 (91.7%) | 4 (33.3%) | 0 (0%) |
| current_back_slot_future_state55 | white_current_mirror | 0-0-2 | 8 | 0 (0%) | 7 (87.5%) | 1 (12.5%) | 7 (87.5%) | 1 (12.5%) | 0 (0%) |

## Samples

### low_stone_blocked_no_work: ヤンバル seed 136520 turn 1

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role back / front デスシープ Lv1 HP6 prep / stones after 0 / score 68
- flags: backline-pattern, next-no-work, very-low-stone, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=25 / backWork=5:ボムゾウ,8:ピグミィ,10:ピグミィ,13:ヤンバル,16:ピグミィ,19:ボムゾウ,20:ボムゾウ,23:ヤンバル / top5BackWork=5:ボムゾウ / noReachFront=1:ドノマンティス,3:真勇者ダイン,4:ポリスピナー,9:ポリスピナー,11:ポリスピナー,14:ドノマンティス,15:デスシープ,17:デスシープ,...(+2)
- special lock: -
- next turn: focus:player_front_left / focus:player_front_right / summon:player_card_037_2->player_back_left / focus:player_back_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は163点差で見送り
- board: PF:デスシープ Lv1 HP6 prep / PB:真勇者ダイン Lv1 HP6 prep

### blocked_no_pattern_no_work: ドノマンティス seed 136520 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 2 / score 24
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=4:ボムゾウ,7:ピグミィ,9:ピグミィ,12:ヤンバル,15:ピグミィ,18:ボムゾウ,19:ボムゾウ,22:ヤンバル / top5BackWork=4:ボムゾウ / noReachFront=2:真勇者ダイン,3:ポリスピナー,8:ポリスピナー,10:ポリスピナー,13:ドノマンティス,14:デスシープ,16:デスシープ,20:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは26点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:ボムゾウ Lv1 HP6 prep / CF:ドノマンティス Lv1 HP5 prep / CB:ピグミィ Lv1 HP3 prep

### bad_blocked_no_eval_trace: ドノマンティス seed 136520 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 2 / score 24
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=4:ボムゾウ,7:ピグミィ,9:ピグミィ,12:ヤンバル,15:ピグミィ,18:ボムゾウ,19:ボムゾウ,22:ヤンバル / top5BackWork=4:ボムゾウ / noReachFront=2:真勇者ダイン,3:ポリスピナー,8:ポリスピナー,10:ポリスピナー,13:ドノマンティス,14:デスシープ,16:デスシープ,20:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは26点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:ボムゾウ Lv1 HP6 prep / CF:ドノマンティス Lv1 HP5 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_no_pattern_no_work: 真勇者ダイン seed 136520 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role front / front ヤンバル Lv1 HP3 / stones after 3 / score 28
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=3:ピグミィ,5:ピグミィ,8:ヤンバル,11:ピグミィ,14:ボムゾウ,15:ボムゾウ,18:ヤンバル / top5BackWork=3:ピグミィ,5:ピグミィ / noReachFront=4:ポリスピナー,6:ポリスピナー,9:ドノマンティス,10:デスシープ,12:デスシープ,16:真勇者ダイン,20:ドノマンティス
- special lock: -
- next turn: attack:player_front_left:ダイン斬り->monster:cpu_front_left / focus:player_front_right / summon:player_bomuzo_1->player_back_right / master:shield->monster:player_front_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は2点差で見送り、召喚は43点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 / PF:ヤンバル Lv1 HP3 / PB:ドノマンティス Lv1 HP5 / CF:真勇者ダイン Lv1 HP6 prep / CF:ドノマンティス Lv2 HP5 / CB:ピグミィ Lv1 HP1

### bad_blocked_no_eval_trace: 真勇者ダイン seed 136520 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role front / front ヤンバル Lv1 HP3 / stones after 3 / score 28
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=3:ピグミィ,5:ピグミィ,8:ヤンバル,11:ピグミィ,14:ボムゾウ,15:ボムゾウ,18:ヤンバル / top5BackWork=3:ピグミィ,5:ピグミィ / noReachFront=4:ポリスピナー,6:ポリスピナー,9:ドノマンティス,10:デスシープ,12:デスシープ,16:真勇者ダイン,20:ドノマンティス
- special lock: -
- next turn: attack:player_front_left:ダイン斬り->monster:cpu_front_left / focus:player_front_right / summon:player_bomuzo_1->player_back_right / master:shield->monster:player_front_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は2点差で見送り、召喚は43点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 / PF:ヤンバル Lv1 HP3 / PB:ドノマンティス Lv1 HP5 / CF:真勇者ダイン Lv1 HP6 prep / CF:ドノマンティス Lv2 HP5 / CB:ピグミィ Lv1 HP1

### front_role_allowed_by_range: ボムゾウ seed 136520 turn 7

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role front / front 真勇者ダイン Lv1 HP6 / stones after 4 / score 23
- flags: backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=2:ピグミィ,4:ピグミィ,7:ヤンバル,10:ピグミィ,13:ボムゾウ,14:ボムゾウ,17:ヤンバル / top5BackWork=2:ピグミィ,4:ピグミィ / noReachFront=3:ポリスピナー,5:ポリスピナー,8:ドノマンティス,9:デスシープ,11:デスシープ,15:真勇者ダイン,19:ドノマンティス
- special lock: -
- next turn: attack:player_front_left:ダイン斬り->monster:cpu_front_left / focus:player_front_right / summon:player_polyspinner_3->player_back_right / master:master_attack->monster:cpu_front_left / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 召喚は34点差で見送り、マスター特技は118点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 / PF:真勇者ダイン Lv1 HP6 / PB:ドノマンティス Lv1 HP5 / CF:真勇者ダイン Lv1 HP3 / CF:ドノマンティス Lv2 HP5 / CB:デスシープ Lv1 HP6 prep / CB:ピグミィ Lv1 HP1

### blocked_no_pattern_no_work: ポリスピナー seed 136520 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 5 / score 26
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=1:ピグミィ,3:ピグミィ,6:ヤンバル,9:ピグミィ,12:ボムゾウ,13:ボムゾウ,16:ヤンバル / top5BackWork=1:ピグミィ,3:ピグミィ / noReachFront=2:ポリスピナー,4:ポリスピナー,7:ドノマンティス,8:デスシープ,10:デスシープ,14:真勇者ダイン,18:ドノマンティス
- special lock: -
- next turn: attack:player_front_right:storm_bomb->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / focus:player_back_right / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: マスター特技は7点差で見送り、マスター特技は370点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ドノマンティス Lv1 HP5 / CF:真勇者ダイン Lv1 HP1 / CF:ドノマンティス Lv2 HP5 / CB:デスシープ Lv1 HP6 / CB:ピグミィ Lv2 HP3

### bad_blocked_no_eval_trace: ポリスピナー seed 136520 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 5 / score 26
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=1:ピグミィ,3:ピグミィ,6:ヤンバル,9:ピグミィ,12:ボムゾウ,13:ボムゾウ,16:ヤンバル / top5BackWork=1:ピグミィ,3:ピグミィ / noReachFront=2:ポリスピナー,4:ポリスピナー,7:ドノマンティス,8:デスシープ,10:デスシープ,14:真勇者ダイン,18:ドノマンティス
- special lock: -
- next turn: attack:player_front_right:storm_bomb->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / focus:player_back_right / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: マスター特技は7点差で見送り、マスター特技は370点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ドノマンティス Lv1 HP5 / CF:真勇者ダイン Lv1 HP1 / CF:ドノマンティス Lv2 HP5 / CB:デスシープ Lv1 HP6 / CB:ピグミィ Lv2 HP3

### blocked_backline_pattern_worked: ピグミィ seed 136520 turn 11

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role back / front ポリスピナー Lv1 HP3 / stones after 3 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, draw
- alternatives: no-trace
- hand pressure: backWork=ピグミィ / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=15 / backWork=3:ヤンバル,6:ピグミィ,9:ボムゾウ,10:ボムゾウ,13:ヤンバル / top5BackWork=3:ヤンバル / noReachFront=1:ポリスピナー,4:ドノマンティス,5:デスシープ,7:デスシープ,11:真勇者ダイン,15:ドノマンティス
- special lock: -
- next turn: summon:player_card_051_1->player_back_right / move:player_front_right->player_back_left / attack:player_front_left:attack->monster:cpu_front_left / summon:player_polyspinner_2->player_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、召喚は102点差で見送り
- board: PF:真勇者ダイン Lv3 HP4 / PF:ポリスピナー Lv1 HP3 / PB:ドノマンティス Lv1 HP5 / CF:デスシープ Lv1 HP6 prep / CF:ドノマンティス Lv2 HP5 / CB:ピグミィ Lv2 HP3

### blocked_no_pattern_no_work: ドノマンティス seed 136521 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, win)
- decision: cpu_back_left / role front / front デスシープ Lv2 HP6 / stones after 5 / score 24
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=5:ボムゾウ,10:ヤンバル,13:ボムゾウ,17:ピグミィ / top5BackWork=5:ボムゾウ / noReachFront=2:デスシープ,3:ポリスピナー,6:ドノマンティス,12:真勇者ダイン,15:ポリスピナー,16:デスシープ
- special lock: -
- next turn: attack:cpu_front_right:ダイン斬り->master:player / attack:cpu_front_left:attack->master:player / master:shield->monster:cpu_front_left / end_turn
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は23点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:真勇者ダイン Lv2 HP4 / CF:デスシープ Lv2 HP6 / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv1 HP3

### bad_blocked_no_eval_trace: ドノマンティス seed 136521 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, win)
- decision: cpu_back_left / role front / front デスシープ Lv2 HP6 / stones after 5 / score 24
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=5:ボムゾウ,10:ヤンバル,13:ボムゾウ,17:ピグミィ / top5BackWork=5:ボムゾウ / noReachFront=2:デスシープ,3:ポリスピナー,6:ドノマンティス,12:真勇者ダイン,15:ポリスピナー,16:デスシープ
- special lock: -
- next turn: attack:cpu_front_right:ダイン斬り->master:player / attack:cpu_front_left:attack->master:player / master:shield->monster:cpu_front_left / end_turn
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は23点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:真勇者ダイン Lv2 HP4 / CF:デスシープ Lv2 HP6 / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv1 HP3

### blocked_backline_pattern_worked: ヤンバル seed 136522 turn 2

- variant/opponent: `current_back_slot_future_state55` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,デスシープ / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ピグミィ,3:ピグミィ,12:ボムゾウ,17:ヤンバル,20:ボムゾウ,24:ピグミィ / top5BackWork=2:ピグミィ,3:ピグミィ / noReachFront=1:真勇者ダイン,4:真勇者ダイン,7:ポリスピナー,9:デスシープ,10:ポリスピナー,13:ドノマンティス,19:真勇者ダイン,22:ポリスピナー,...(+1)
- special lock: -
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_back_left:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / attack:player_front_left:self_bomb->monster:cpu_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは13点差で見送り、召喚は186点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CB:真勇者ダイン Lv1 HP6 prep / CB:デスシープ Lv1 HP6 prep

### blocked_no_pattern_no_work: デスシープ seed 136523 turn 4

- variant/opponent: `current_back_slot_future_state55` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 4 / score 25
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ピグミィ,6:ボムゾウ,8:ピグミィ,14:ボムゾウ,17:ボムゾウ,19:ピグミィ,20:ヤンバル / top5BackWork=1:ピグミィ / noReachFront=3:ポリスピナー,7:ドノマンティス,9:真勇者ダイン,10:デスシープ,13:デスシープ,16:ポリスピナー,21:ポリスピナー
- special lock: -
- next turn: attack:cpu_back_right:wild_claw->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left / focus:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は13点差で見送り、マスター特技は304点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:真勇者ダイン Lv1 HP4 / PB:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ドノマンティス Lv1 HP5 / CB:ヤンバル Lv1 HP3

### bad_blocked_no_eval_trace: デスシープ seed 136523 turn 4

- variant/opponent: `current_back_slot_future_state55` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 4 / score 25
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ピグミィ,6:ボムゾウ,8:ピグミィ,14:ボムゾウ,17:ボムゾウ,19:ピグミィ,20:ヤンバル / top5BackWork=1:ピグミィ / noReachFront=3:ポリスピナー,7:ドノマンティス,9:真勇者ダイン,10:デスシープ,13:デスシープ,16:ポリスピナー,21:ポリスピナー
- special lock: -
- next turn: attack:cpu_back_right:wild_claw->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left / focus:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は13点差で見送り、マスター特技は304点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:真勇者ダイン Lv1 HP4 / PB:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ドノマンティス Lv1 HP5 / CB:ヤンバル Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 136523 turn 10

- variant/opponent: `current_back_slot_future_state55` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_left / role front / front ポリスピナー Lv2 HP3 / stones after 3 / score 23
- flags: backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=15 / backWork=2:ピグミィ,8:ボムゾウ,11:ボムゾウ,13:ピグミィ,14:ヤンバル / top5BackWork=2:ピグミィ / noReachFront=1:ドノマンティス,3:真勇者ダイン,4:デスシープ,7:デスシープ,10:ポリスピナー,15:ポリスピナー
- special lock: -
- next turn: move:cpu_front_right->cpu_back_right / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_front_left:attack->monster:player_front_left / summon:cpu_card_037_2->cpu_front_right / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は66点差で見送り、マスター特技は484点差で見送り
- board: PF:真勇者ダイン Lv2 HP6 / PB:ヤンバル Lv2 HP3 / PB:デスシープ Lv1 HP6 / CF:ポリスピナー Lv2 HP3 / CF:ヤンバル Lv1 HP3 / CB:ピグミィ Lv1 HP3


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
