# White Backline Summon Audit Loop

生成: 2026-06-29T14:59:57.072Z
seedStart: 136860
候補: current_white_baseline, current_last_back_slot_no_reach_guard35
相手: white_current_mirror
試行: 2 games/matchup/direction
総試合: 8

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 88
- 後列召喚: 53 (60.2%)
- 前列あり後列召喚: 43 (81.1%)
- うち前衛ロール: 20 (46.5%)
- デスシープ後列召喚: 2 (4.7%)
- デスシープ特技封じ損: 0 (0%) / W-L 0-0
- デスシープ特技封じ平均コマンド数: 0
- Backline patternあり: 27 (62.8%)
- Backline patternなし: 16 (37.2%)
- 次自ターン攻撃: 9 (20.9%)
- 次自ターン後列攻撃: 9 (20.9%)
- 次自ターン前進: 2 (4.7%)
- 次自ターン仕事なし: 32 (74.4%)
- Bad blocked summon: 15 (34.9%)
- Bad with evaluation trace: 0 (0%)
- Bad with non-summon alt: 0 (0%)
- Bad close non-summon alt: 0 (0%)
- Bad medium non-summon alt <=100: 0 (0%)
- Bad distant non-summon alt <=200: 0 (0%)
- Bad avg best non-summon gap: 0
- Bad top summon alt: 0 (0%)
- Bad top summon same card: 0 (0%)
- Bad top summon backline pattern: 0 (0%)
- Bad with other backline work in hand: 0 (0%)
- Bad consumes last back slot: 12 (80%)
- Bad leaves no empty back slot: 12 (80%)
- Avg no-reach front cards in back after bad: 1.47
- Bad with deck backline work: 15 (100%)
- Bad with deck top5 backline work: 15 (100%)
- Bad consumes last back slot with deck backline work: 12 (80%)
- Avg deck backline work cards after bad: 8
- Avg deck top5 backline work cards after bad: 1.93

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Death Sheep Lock | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_white_baseline | 2-0-2 | 42 | 29 (69%) | 24 (82.8%) | 12 (50%) | 0 (0%) | 13 (54.2%) | 11 (45.8%) | 5 (20.8%) | 5 (20.8%) | 1 (4.2%) | 18 (75%) | 10 (41.7%) | 0 (0%) | DeckReach10, DeckTop5Reach10, LastBack8, NoEmptyBack8 | 8 (33.3%) | 12/0 |
| current_last_back_slot_no_reach_guard35 | 0-0-4 | 46 | 24 (52.2%) | 19 (79.2%) | 8 (42.1%) | 0 (0%) | 14 (73.7%) | 5 (26.3%) | 4 (21.1%) | 4 (21.1%) | 1 (5.3%) | 14 (73.7%) | 5 (26.3%) | 0 (0%) | DeckReach5, DeckTop5Reach5, LastBack4, NoEmptyBack4 | 10 (52.6%) | 0/0 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Death Sheep Lock | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | white_current_mirror | 2-0-2 | 24 | 0 (0%) | 13 (54.2%) | 11 (45.8%) | 18 (75%) | 10 (41.7%) | 0 (0%) |
| current_last_back_slot_no_reach_guard35 | white_current_mirror | 0-0-4 | 19 | 0 (0%) | 14 (73.7%) | 5 (26.3%) | 14 (73.7%) | 5 (26.3%) | 0 (0%) |

## Samples

### blocked_backline_pattern_worked: ピグミィ seed 136860 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_left / role back / front 真勇者ダイン Lv1 HP6 / stones after 3 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=0
- deck pressure: deck=24 / backWork=1:ボムゾウ,6:ピグミィ,8:ピグミィ,14:ヤンバル,15:ボムゾウ,17:ヤンバル,20:ヤンバル,24:ボムゾウ / top5BackWork=1:ボムゾウ / noReachFront=3:ドノマンティス,4:真勇者ダイン,7:ドノマンティス,9:真勇者ダイン,10:デスシープ,11:ポリスピナー,16:ドノマンティス,19:デスシープ,...(+2)
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / summon:player_bomuzo_1->player_back_right / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、ためるは14点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / CF:ドノマンティス Lv1 HP5 prep / CB:真勇者ダイン Lv1 HP6 prep

### front_role_allowed_by_range: ボムゾウ seed 136860 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role front / front デスシープ Lv1 HP6 / stones after 3 / score 23
- flags: backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=5:ピグミィ,7:ピグミィ,13:ヤンバル,14:ボムゾウ,16:ヤンバル,19:ヤンバル,23:ボムゾウ / top5BackWork=5:ピグミィ / noReachFront=2:ドノマンティス,3:真勇者ダイン,6:ドノマンティス,8:真勇者ダイン,9:デスシープ,10:ポリスピナー,15:ドノマンティス,18:デスシープ,...(+2)
- special lock: -
- next turn: move:player_back_left->player_front_left / focus:player_front_right / focus:player_back_right / master:shield->monster:player_front_left / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 攻撃は286点差で見送り、マスター特技は310点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ドノマンティス Lv1 HP1 / CB:真勇者ダイン Lv1 HP6 prep

### blocked_no_pattern_no_work: ドノマンティス seed 136860 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role front / front デスシープ Lv2 HP6 / stones after 3 / score 24
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=3:ピグミィ,5:ピグミィ,11:ヤンバル,12:ボムゾウ,14:ヤンバル,17:ヤンバル,21:ボムゾウ / top5BackWork=3:ピグミィ,5:ピグミィ / noReachFront=1:真勇者ダイン,4:ドノマンティス,6:真勇者ダイン,7:デスシープ,8:ポリスピナー,13:ドノマンティス,16:デスシープ,18:ポリスピナー,...(+1)
- special lock: -
- next turn: master:wake_up->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / attack:player_front_left:self_bomb->monster:cpu_front_left / summon:player_card_047_3->player_front_left / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: マスター特技は267点差で見送り
- board: PF:ボムゾウ Lv2 HP5 / PF:デスシープ Lv2 HP6 / PB:ピグミィ Lv1 HP1 / CF:真勇者ダイン Lv1 HP6 / CB:ヤンバル Lv1 HP3

### bad_blocked_no_eval_trace: ドノマンティス seed 136860 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role front / front デスシープ Lv2 HP6 / stones after 3 / score 24
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=3:ピグミィ,5:ピグミィ,11:ヤンバル,12:ボムゾウ,14:ヤンバル,17:ヤンバル,21:ボムゾウ / top5BackWork=3:ピグミィ,5:ピグミィ / noReachFront=1:真勇者ダイン,4:ドノマンティス,6:真勇者ダイン,7:デスシープ,8:ポリスピナー,13:ドノマンティス,16:デスシープ,18:ポリスピナー,...(+1)
- special lock: -
- next turn: master:wake_up->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / attack:player_front_left:self_bomb->monster:cpu_front_left / summon:player_card_047_3->player_front_left / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: マスター特技は267点差で見送り
- board: PF:ボムゾウ Lv2 HP5 / PF:デスシープ Lv2 HP6 / PB:ピグミィ Lv1 HP1 / CF:真勇者ダイン Lv1 HP6 / CB:ヤンバル Lv1 HP3

### blocked_backline_pattern_worked: ピグミィ seed 136860 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_left / role back / front デスシープ Lv2 HP6 / stones after 3 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=0
- deck pressure: deck=18 / backWork=2:ピグミィ,8:ヤンバル,9:ボムゾウ,11:ヤンバル,14:ヤンバル,18:ボムゾウ / top5BackWork=2:ピグミィ / noReachFront=1:ドノマンティス,3:真勇者ダイン,4:デスシープ,5:ポリスピナー,10:ドノマンティス,13:デスシープ,15:ポリスピナー,17:ポリスピナー
- special lock: -
- next turn: master:wake_up->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / focus:player_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:真勇者ダイン Lv1 HP6 / CF:真勇者ダイン Lv1 HP5 / CB:ボムゾウ Lv1 HP6 prep

### blocked_no_pattern_no_work: ドノマンティス seed 136860 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role front / front 真勇者ダイン Lv1 HP6 / stones after 1 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=1:ピグミィ,7:ヤンバル,8:ボムゾウ,10:ヤンバル,13:ヤンバル,17:ボムゾウ / top5BackWork=1:ピグミィ / noReachFront=2:真勇者ダイン,3:デスシープ,4:ポリスピナー,9:ドノマンティス,12:デスシープ,14:ポリスピナー,16:ポリスピナー
- special lock: -
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / attack:player_front_left:attack->master:cpu / focus:player_back_right / master:shield->monster:player_front_left / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは39点差で見送り、攻撃は151点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:真勇者ダイン Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP5 / CB:ボムゾウ Lv1 HP6

### bad_blocked_no_eval_trace: ドノマンティス seed 136860 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role front / front 真勇者ダイン Lv1 HP6 / stones after 1 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=1:ピグミィ,7:ヤンバル,8:ボムゾウ,10:ヤンバル,13:ヤンバル,17:ボムゾウ / top5BackWork=1:ピグミィ / noReachFront=2:真勇者ダイン,3:デスシープ,4:ポリスピナー,9:ドノマンティス,12:デスシープ,14:ポリスピナー,16:ポリスピナー
- special lock: -
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / attack:player_front_left:attack->master:cpu / focus:player_back_right / master:shield->monster:player_front_left / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは39点差で見送り、攻撃は151点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:真勇者ダイン Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP5 / CB:ボムゾウ Lv1 HP6

### low_stone_blocked_no_work: ドノマンティス seed 136860 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role front / front 真勇者ダイン Lv1 HP6 / stones after 1 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=1:ピグミィ,7:ヤンバル,8:ボムゾウ,10:ヤンバル,13:ヤンバル,17:ボムゾウ / top5BackWork=1:ピグミィ / noReachFront=2:真勇者ダイン,3:デスシープ,4:ポリスピナー,9:ドノマンティス,12:デスシープ,14:ポリスピナー,16:ポリスピナー
- special lock: -
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / attack:player_front_left:attack->master:cpu / focus:player_back_right / master:shield->monster:player_front_left / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは39点差で見送り、攻撃は151点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:真勇者ダイン Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP5 / CB:ボムゾウ Lv1 HP6

### blocked_no_pattern_no_work: 真勇者ダイン seed 136861 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 4 / score 28
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=23 / backWork=1:ヤンバル,5:ボムゾウ,11:ヤンバル,14:ピグミィ,16:ボムゾウ,19:ピグミィ,20:ヤンバル,22:ボムゾウ,...(+1) / top5BackWork=1:ヤンバル,5:ボムゾウ / noReachFront=3:ポリスピナー,6:ポリスピナー,10:ドノマンティス,12:デスシープ,13:真勇者ダイン,15:ポリスピナー,17:デスシープ,18:デスシープ,...(+1)
- special lock: -
- next turn: focus:player_front_right / attack:player_front_left:ダイン斬り->monster:cpu_front_left / summon:player_yanbaru_2->player_back_right / focus:player_back_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、マスター特技は244点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / CF:真勇者ダイン Lv1 HP6 / CF:デスシープ Lv1 HP6 / CB:ピグミィ Lv1 HP3

### bad_blocked_no_eval_trace: 真勇者ダイン seed 136861 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 4 / score 28
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=23 / backWork=1:ヤンバル,5:ボムゾウ,11:ヤンバル,14:ピグミィ,16:ボムゾウ,19:ピグミィ,20:ヤンバル,22:ボムゾウ,...(+1) / top5BackWork=1:ヤンバル,5:ボムゾウ / noReachFront=3:ポリスピナー,6:ポリスピナー,10:ドノマンティス,12:デスシープ,13:真勇者ダイン,15:ポリスピナー,17:デスシープ,18:デスシープ,...(+1)
- special lock: -
- next turn: focus:player_front_right / attack:player_front_left:ダイン斬り->monster:cpu_front_left / summon:player_yanbaru_2->player_back_right / focus:player_back_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、マスター特技は244点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / CF:真勇者ダイン Lv1 HP6 / CF:デスシープ Lv1 HP6 / CB:ピグミィ Lv1 HP3

### blocked_backline_pattern_worked: ヤンバル seed 136861 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 4 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=4:ボムゾウ,10:ヤンバル,13:ピグミィ,15:ボムゾウ,18:ピグミィ,19:ヤンバル,21:ボムゾウ,22:ピグミィ / top5BackWork=4:ボムゾウ / noReachFront=2:ポリスピナー,5:ポリスピナー,9:ドノマンティス,11:デスシープ,12:真勇者ダイン,14:ポリスピナー,16:デスシープ,17:デスシープ,...(+1)
- special lock: -
- next turn: focus:player_front_right / attack:player_back_right:wild_claw->monster:cpu_front_left / focus:player_front_left / end_turn
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは61点差で見送り、マスター特技は264点差で見送り
- board: PF:真勇者ダイン Lv1 HP5 / PF:ドノマンティス Lv1 HP5 / PB:真勇者ダイン Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CF:デスシープ Lv1 HP6 / CB:デスシープ Lv1 HP6 prep / CB:ピグミィ Lv1 HP3

### blocked_no_pattern_no_work: ポリスピナー seed 136861 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 5 / score 26
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=2:ボムゾウ,8:ヤンバル,11:ピグミィ,13:ボムゾウ,16:ピグミィ,17:ヤンバル,19:ボムゾウ,20:ピグミィ / top5BackWork=2:ボムゾウ / noReachFront=3:ポリスピナー,7:ドノマンティス,9:デスシープ,10:真勇者ダイン,12:ポリスピナー,14:デスシープ,15:デスシープ,18:ドノマンティス
- special lock: -
- next turn: focus:player_front_left / magic:player_card_031_1->monster:cpu_back_left / attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:真勇者ダイン Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 / CB:デスシープ Lv1 HP6 / CB:ピグミィ Lv1 HP3

### bad_blocked_no_eval_trace: ポリスピナー seed 136861 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 5 / score 26
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=2:ボムゾウ,8:ヤンバル,11:ピグミィ,13:ボムゾウ,16:ピグミィ,17:ヤンバル,19:ボムゾウ,20:ピグミィ / top5BackWork=2:ボムゾウ / noReachFront=3:ポリスピナー,7:ドノマンティス,9:デスシープ,10:真勇者ダイン,12:ポリスピナー,14:デスシープ,15:デスシープ,18:ドノマンティス
- special lock: -
- next turn: focus:player_front_left / magic:player_card_031_1->monster:cpu_back_left / attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:真勇者ダイン Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 / CB:デスシープ Lv1 HP6 / CB:ピグミィ Lv1 HP3

### blocked_no_pattern_no_work: ポリスピナー seed 136861 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front ボムゾウ Lv2 HP4 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=5:ヤンバル,8:ピグミィ,10:ボムゾウ,13:ピグミィ,14:ヤンバル,16:ボムゾウ,17:ピグミィ / top5BackWork=5:ヤンバル / noReachFront=4:ドノマンティス,6:デスシープ,7:真勇者ダイン,9:ポリスピナー,11:デスシープ,12:デスシープ,15:ドノマンティス
- special lock: -
- next turn: focus:player_front_left / attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / focus:player_front_right / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 攻撃は20点差で見送り、ためるは34点差で見送り
- board: PF:ボムゾウ Lv2 HP4 / PF:ドノマンティス Lv2 HP5 / PB:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 / CB:ピグミィ Lv1 HP3 / CB:ピグミィ Lv1 HP2

### bad_blocked_no_eval_trace: ポリスピナー seed 136861 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front ボムゾウ Lv2 HP4 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=5:ヤンバル,8:ピグミィ,10:ボムゾウ,13:ピグミィ,14:ヤンバル,16:ボムゾウ,17:ピグミィ / top5BackWork=5:ヤンバル / noReachFront=4:ドノマンティス,6:デスシープ,7:真勇者ダイン,9:ポリスピナー,11:デスシープ,12:デスシープ,15:ドノマンティス
- special lock: -
- next turn: focus:player_front_left / attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / focus:player_front_right / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 攻撃は20点差で見送り、ためるは34点差で見送り
- board: PF:ボムゾウ Lv2 HP4 / PF:ドノマンティス Lv2 HP5 / PB:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 / CB:ピグミィ Lv1 HP3 / CB:ピグミィ Lv1 HP2

### blocked_backline_pattern_worked: ピグミィ seed 136862 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_right / role back / front ポリスピナー Lv1 HP3 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=6:ボムゾウ,7:ボムゾウ,9:ヤンバル,10:ヤンバル,11:ピグミィ,12:ボムゾウ,17:ピグミィ / top5BackWork=- / noReachFront=3:真勇者ダイン,5:ドノマンティス,8:デスシープ,14:ポリスピナー,15:デスシープ,16:真勇者ダイン,19:ポリスピナー,21:ドノマンティス,...(+2)
- special lock: -
- next turn: focus:cpu_front_left / magic:cpu_card_093_1->master:cpu / attack:cpu_back_right:スパイクボール->monster:player_front_left / focus:cpu_back_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 攻撃は83点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 prep / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ポリスピナー Lv1 HP3 / CB:ヤンバル Lv1 HP3

### low_stone_blocked_no_work: ヤンバル seed 136862 turn 11

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_left / role back / front デスシープ Lv1 HP6 prep / stones after 1 / score 68
- flags: backline-pattern, next-no-work, very-low-stone, draw
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=14 / backWork=1:ヤンバル,2:ピグミィ,3:ボムゾウ,8:ピグミィ / top5BackWork=1:ヤンバル,2:ピグミィ,3:ボムゾウ / noReachFront=5:ポリスピナー,6:デスシープ,7:真勇者ダイン,10:ポリスピナー,12:ドノマンティス,13:ドノマンティス,14:デスシープ
- special lock: -
- next turn: end_turn
- reason: 後衛カードを後列左へ召喚 / 見送り: 召喚は78点差で見送り、攻撃は167点差で見送り
- board: PF:ボムゾウ Lv1 HP6 prep / PB:ピグミィ Lv2 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv1 HP6 prep / CF:ボムゾウ Lv2 HP5 / CB:ピグミィ Lv2 HP3

### low_stone_blocked_no_work: ピグミィ seed 136862 turn 14

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_right / role back / front ヤンバル Lv1 HP3 / stones after 0 / score 67
- flags: backline-pattern, next-no-work, very-low-stone, draw
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=11 / backWork=5:ピグミィ / top5BackWork=5:ピグミィ / noReachFront=2:ポリスピナー,3:デスシープ,4:真勇者ダイン,7:ポリスピナー,9:ドノマンティス,10:ドノマンティス,11:デスシープ
- special lock: -
- next turn: -
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は77点差で見送り
- board: PB:ピグミィ Lv1 HP3 / CF:ボムゾウ Lv2 HP5 / CF:ヤンバル Lv1 HP3 / CB:ヤンバル Lv2 HP3

### low_stone_blocked_no_work: ポリスピナー seed 136863 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, win)
- decision: cpu_back_right / role front / front デスシープ Lv1 HP6 / stones after 0 / score 26
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=3:ボムゾウ,6:ピグミィ,7:ヤンバル,11:ヤンバル,12:ボムゾウ,15:ピグミィ,20:ヤンバル,21:ピグミィ,...(+1) / top5BackWork=3:ボムゾウ / noReachFront=1:デスシープ,2:ドノマンティス,4:ポリスピナー,8:ドノマンティス,16:ポリスピナー,17:ドノマンティス,18:真勇者ダイン,19:真勇者ダイン
- special lock: -
- next turn: focus:cpu_front_left / end_turn
- reason: カードを後列右へ召喚 / 見送り: ためるは30点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PB:ヤンバル Lv1 HP3 / PB:ピグミィ Lv1 HP3 prep / CF:デスシープ Lv1 HP6 / CF:デスシープ Lv1 HP6 / CB:真勇者ダイン Lv1 HP6

### low_stone_blocked_no_work: ドノマンティス seed 136863 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, win)
- decision: cpu_back_right / role front / front ボムゾウ Lv2 HP5 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=3:ピグミィ,4:ヤンバル,8:ヤンバル,9:ボムゾウ,12:ピグミィ,17:ヤンバル,18:ピグミィ,19:ボムゾウ / top5BackWork=3:ピグミィ,4:ヤンバル / noReachFront=1:ポリスピナー,5:ドノマンティス,13:ポリスピナー,14:ドノマンティス,15:真勇者ダイン,16:真勇者ダイン
- special lock: -
- next turn: attack:cpu_front_right:self_bomb->master:player / attack:cpu_front_left:attack->master:player / focus:cpu_back_right / summon:cpu_polyspinner_3->cpu_back_left / ...
- reason: カードを後列右へ召喚 / 見送り: ためるは32点差で見送り
- board: CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv2 HP5 / CB:デスシープ Lv1 HP6

### blocked_backline_pattern_worked: ヤンバル seed 136863 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, win)
- decision: cpu_back_right / role back / front ドノマンティス Lv2 HP5 / stones after 7 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=16 / backWork=4:ヤンバル,5:ボムゾウ,8:ピグミィ,13:ヤンバル,14:ピグミィ,15:ボムゾウ / top5BackWork=4:ヤンバル,5:ボムゾウ / noReachFront=1:ドノマンティス,9:ポリスピナー,10:ドノマンティス,11:真勇者ダイン,12:真勇者ダイン
- special lock: -
- next turn: summon:cpu_card_037_1->cpu_back_left / attack:cpu_back_right:wild_claw->monster:player_front_left / master:master_attack->monster:player_front_left / attack:cpu_front_right:呪いの刃->monster:player_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 攻撃は40点差で見送り、マスター特技は76点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PB:ボムゾウ Lv1 HP6 / CF:ポリスピナー Lv1 HP2 / CF:ドノマンティス Lv2 HP5 / CB:ピグミィ Lv1 HP3

### blocked_no_pattern_move_forward: ドノマンティス seed 136863 turn 10

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, win)
- decision: cpu_back_left / role front / front ピグミィ Lv1 HP3 / stones after 4 / score 24
- flags: no-backline-pattern, next-move-front, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=15 / backWork=3:ヤンバル,4:ボムゾウ,7:ピグミィ,12:ヤンバル,13:ピグミィ,14:ボムゾウ / top5BackWork=3:ヤンバル,4:ボムゾウ / noReachFront=8:ポリスピナー,9:ドノマンティス,10:真勇者ダイン,11:真勇者ダイン
- special lock: -
- next turn: move:cpu_back_right->cpu_front_right / move:cpu_back_left->cpu_front_left / master:shield->monster:cpu_front_right / end_turn
- reason: カードを後列左へ召喚 / 見送り: 攻撃は6点差で見送り、攻撃は15点差で見送り
- board: PF:ボムゾウ Lv1 HP4 / PF:ボムゾウ Lv2 HP5 / CF:ピグミィ Lv1 HP3 / CF:ドノマンティス Lv2 HP5 / CB:ヤンバル Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 136864 turn 6

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `white_current_mirror` (player, draw)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 5 / score 23
- flags: backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=3:ピグミィ,4:ヤンバル,8:ヤンバル,9:ボムゾウ,12:ピグミィ,17:ヤンバル,18:ピグミィ,19:ボムゾウ / top5BackWork=3:ピグミィ,4:ヤンバル / noReachFront=1:ポリスピナー,5:ドノマンティス,13:ポリスピナー,14:ドノマンティス,15:真勇者ダイン,16:真勇者ダイン
- special lock: -
- next turn: summon:player_polyspinner_3->player_back_left / master:master_attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: マスター特技は206点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv1 HP4 / PB:デスシープ Lv1 HP6 / CF:デスシープ Lv2 HP6 / CF:ボムゾウ Lv2 HP3 / CB:ヤンバル Lv1 HP3 / CB:ヤンバル Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 136866 turn 7

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 2 / score 23
- flags: backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=1:ヤンバル,6:ピグミィ,8:ボムゾウ,9:ヤンバル,11:ボムゾウ,18:ヤンバル / top5BackWork=1:ヤンバル / noReachFront=5:ドノマンティス,7:デスシープ,12:ポリスピナー,13:デスシープ,14:真勇者ダイン,16:真勇者ダイン,17:デスシープ
- special lock: -
- next turn: attack:cpu_front_left:self_bomb->monster:player_front_left / master:master_attack->monster:player_front_left / summon:cpu_yanbaru_3->cpu_back_left / master:wake_up->monster:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は85点差で見送り、ためるは106点差で見送り
- board: PF:ボムゾウ Lv2 HP5 / PB:デスシープ Lv1 HP6 prep / PB:ドノマンティス Lv1 HP5 / CF:真勇者ダイン Lv1 HP6 / CF:ドノマンティス Lv1 HP5 / CB:ピグミィ Lv2 HP3

### front_role_allowed_by_range: ボムゾウ seed 136867 turn 3

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_right / role front / front デスシープ Lv1 HP6 / stones after 1 / score 23
- flags: backline-pattern, next-move-front, very-low-stone, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=2:ヤンバル,3:ピグミィ,11:ヤンバル,13:ピグミィ,16:ボムゾウ,17:ヤンバル,19:ボムゾウ / top5BackWork=2:ヤンバル,3:ピグミィ / noReachFront=4:真勇者ダイン,5:ドノマンティス,9:ドノマンティス,15:ポリスピナー,18:真勇者ダイン,20:ポリスピナー,21:真勇者ダイン
- special lock: -
- next turn: move:cpu_back_right->cpu_front_left / focus:cpu_front_right / summon:cpu_card_037_1->cpu_back_left / master:shield->monster:cpu_front_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は104点差で見送り、召喚は108点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PB:ピグミィ Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv1 HP6 / CF:デスシープ Lv1 HP6 / CB:デスシープ Lv1 HP6


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
