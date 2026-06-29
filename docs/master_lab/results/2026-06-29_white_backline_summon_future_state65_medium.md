# White Backline Summon Audit Loop

生成: 2026-06-29T06:17:08.895Z
seedStart: 136500
候補: current_white_baseline, current_back_slot_future_state65
相手: black_1375_pressure, white_current_mirror
試行: 2 games/matchup/direction
総試合: 16

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 159
- 後列召喚: 102 (64.2%)
- 前列あり後列召喚: 83 (81.4%)
- うち前衛ロール: 50 (60.2%)
- Backline patternあり: 46 (55.4%)
- Backline patternなし: 37 (44.6%)
- 次自ターン攻撃: 21 (25.3%)
- 次自ターン後列攻撃: 21 (25.3%)
- 次自ターン前進: 3 (3.6%)
- 次自ターン仕事なし: 59 (71.1%)
- Bad blocked summon: 35 (42.2%)
- Bad with evaluation trace: 35 (100%)
- Bad with non-summon alt: 35 (100%)
- Bad close non-summon alt: 6 (17.1%)
- Bad medium non-summon alt <=100: 22 (62.9%)
- Bad distant non-summon alt <=200: 27 (77.1%)
- Bad avg best non-summon gap: 124
- Bad top summon alt: 26 (74.3%)
- Bad top summon same card: 10 (38.5%)
- Bad top summon backline pattern: 1 (3.8%)
- Bad with other backline work in hand: 3 (8.6%)
- Bad consumes last back slot: 31 (88.6%)
- Bad leaves no empty back slot: 31 (88.6%)
- Avg no-reach front cards in back after bad: 1.37
- Bad with deck backline work: 34 (97.1%)
- Bad with deck top5 backline work: 32 (91.4%)
- Bad consumes last back slot with deck backline work: 30 (85.7%)
- Avg deck backline work cards after bad: 5.66
- Avg deck top5 backline work cards after bad: 1.77

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_white_baseline | 6-2-0 | 76 | 52 (68.4%) | 42 (80.8%) | 25 (59.5%) | 22 (52.4%) | 20 (47.6%) | 12 (28.6%) | 12 (28.6%) | 1 (2.4%) | 29 (69%) | 19 (45.2%) | 2 (10.5%) | Focus3, End2, OtherSum14, SameCard8, NoReachSum15, NonSum1009, HandReach1, DeckReach19, DeckTop5Reach18, LastBack16, NoEmptyBack16 | 12 (28.6%) | 37/5 |
| current_back_slot_future_state65 | 2-6-0 | 83 | 50 (60.2%) | 41 (82%) | 25 (61%) | 24 (58.5%) | 17 (41.5%) | 9 (22%) | 9 (22%) | 2 (4.9%) | 30 (73.2%) | 16 (39%) | 4 (25%) | Atk2, Focus1, End3, OtherSum10, SameCard2, ReachSum1, NoReachSum10, NonSum10013, HandReach2, DeckReach15, DeckTop5Reach14, LastBack15, NoEmptyBack15 | 16 (39%) | 12/29 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | black_1375_pressure | 2-2-0 | 12 | 7 (58.3%) | 5 (41.7%) | 7 (58.3%) | 4 (33.3%) | 0 (0%) |
| current_white_baseline | white_current_mirror | 4-0-0 | 30 | 15 (50%) | 15 (50%) | 22 (73.3%) | 15 (50%) | 2 (13.3%) |
| current_back_slot_future_state65 | black_1375_pressure | 1-3-0 | 12 | 8 (66.7%) | 4 (33.3%) | 7 (58.3%) | 4 (33.3%) | 1 (25%) |
| current_back_slot_future_state65 | white_current_mirror | 1-3-0 | 29 | 16 (55.2%) | 13 (44.8%) | 23 (79.3%) | 12 (41.4%) | 3 (25%) |

## Samples

### low_stone_blocked_no_work: ピグミィ seed 136501 turn 1

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, win)
- decision: player_back_right / role back / front デスシープ Lv1 HP6 prep / stones after 0 / score 67
- flags: backline-pattern, next-no-work, very-low-stone, win
- alternatives: top=summon:+17.7 summon:player_card_133_1->player_front_left [デスシープ->player_front_left] / nonSummon=end_turn:+325.3 end_turn / attack=- / focus=- / end=end_turn:+325.3 end_turn / move=- / frontSummon=summon:+17.7 summon:player_card_133_1->player_front_left [デスシープ->player_front_left] / topSummon=summon:+17.7 summon:player_card_133_1->player_front_left [デスシープ->player_front_left]
- hand pressure: backWork=- / noReachFront=デスシープ,デスシープ / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=25 / backWork=1:ヤンバル,17:ボムゾウ,18:ボムゾウ,19:ピグミィ,20:ヤンバル,21:ボムゾウ,23:ヤンバル,24:ピグミィ / top5BackWork=1:ヤンバル / noReachFront=3:ポリスピナー,5:ドノマンティス,6:真勇者ダイン,9:ポリスピナー,11:ドノマンティス,14:ドノマンティス,16:ポリスピナー,22:真勇者ダイン
- next turn: focus:player_front_left / focus:player_front_right / summon:player_yanbaru_1->player_back_left / focus:player_back_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は18点差で見送り、召喚は18点差で見送り
- board: PF:デスシープ Lv1 HP6 prep / PB:真勇者ダイン Lv1 HP6 prep

### blocked_backline_pattern_worked: ヤンバル seed 136501 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, win)
- decision: player_back_left / role back / front 真勇者ダイン Lv1 HP6 / stones after 2 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=summon:+29.2 summon:player_card_133_1->player_back_left [デスシープ->player_back_left behind 真勇者ダイン HP6] / nonSummon=focus:+43 focus:player_back_right / attack=- / focus=focus:+43 focus:player_back_right / end=end_turn:+393.1 end_turn / move=- / frontSummon=- / topSummon=summon:+29.2 summon:player_card_133_1->player_back_left [デスシープ->player_back_left behind 真勇者ダイン HP6]
- hand pressure: backWork=- / noReachFront=デスシープ,デスシープ / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=16:ボムゾウ,17:ボムゾウ,18:ピグミィ,19:ヤンバル,20:ボムゾウ,22:ヤンバル,23:ピグミィ / top5BackWork=- / noReachFront=2:ポリスピナー,4:ドノマンティス,5:真勇者ダイン,8:ポリスピナー,10:ドノマンティス,13:ドノマンティス,15:ポリスピナー,21:真勇者ダイン
- next turn: attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_left:wild_claw->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_left:ダイン斬り->monster:cpu_front_left / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: 召喚は29点差で見送り、召喚は29点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ユニフォーン Lv1 HP5 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_no_pattern_move_forward: デスシープ seed 136501 turn 4

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, win)
- decision: player_back_left / role front / front 真勇者ダイン Lv2 HP6 / stones after 2 / score 25
- flags: no-backline-pattern, next-move-front, win
- alternatives: top=summon:+0 summon:player_card_133_2->player_back_left [デスシープ->player_back_left behind 真勇者ダイン HP6] / nonSummon=focus:+18.8 focus:player_back_right / attack=- / focus=focus:+18.8 focus:player_back_right / end=end_turn:+169.9 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_card_133_2->player_back_left [デスシープ->player_back_left behind 真勇者ダイン HP6]
- hand pressure: backWork=- / noReachFront=デスシープ,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=14:ボムゾウ,15:ボムゾウ,16:ピグミィ,17:ヤンバル,18:ボムゾウ,20:ヤンバル,21:ピグミィ / top5BackWork=- / noReachFront=2:ドノマンティス,3:真勇者ダイン,6:ポリスピナー,8:ドノマンティス,11:ドノマンティス,13:ポリスピナー,19:真勇者ダイン
- next turn: attack:player_front_left:ダイン斬り->monster:cpu_front_left / move:player_back_left->player_front_right / attack:player_back_right:スパイクボール->monster:cpu_back_left / attack:player_back_right:スパイクボール->monster:cpu_back_left / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、ためるは19点差で見送り
- board: PF:真勇者ダイン Lv2 HP6 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_no_pattern_no_work: 真勇者ダイン seed 136501 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, win)
- decision: player_back_right / role front / front デスシープ Lv1 HP6 / stones after 3 / score 28
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=summon:+3 summon:player_card_133_2->player_back_right [デスシープ->player_back_right behind デスシープ HP6] / nonSummon=focus:+92.8 focus:player_front_right / attack=- / focus=focus:+92.8 focus:player_front_right / end=end_turn:+227 end_turn / move=move:+148.8 move:player_back_left->player_front_right / frontSummon=- / topSummon=summon:+3 summon:player_card_133_2->player_back_right [デスシープ->player_back_right behind デスシープ HP6]
- hand pressure: backWork=- / noReachFront=デスシープ,ポリスピナー,ドノマンティス / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=11:ボムゾウ,12:ボムゾウ,13:ピグミィ,14:ヤンバル,15:ボムゾウ,17:ヤンバル,18:ピグミィ / top5BackWork=- / noReachFront=3:ポリスピナー,5:ドノマンティス,8:ドノマンティス,10:ポリスピナー,16:真勇者ダイン
- next turn: attack:player_front_left:ダイン斬り->master:cpu / attack:player_front_right:attack->monster:cpu_front_right / focus:player_back_right / master:master_attack->monster:cpu_front_right / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は3点差で見送り、召喚は16点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 / PF:デスシープ Lv1 HP6 / PB:デスシープ Lv1 HP6 / CF:ボムゾウ Lv1 HP6 prep / CB:ヤンバル Lv1 HP2

### blocked_backline_pattern_worked: ピグミィ seed 136502 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role back / front ヤンバル Lv1 HP3 / stones after 3 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=master_action:+333.3 master:master_attack->monster:player_front_left / nonSummon=master_action:+333.3 master:master_attack->monster:player_front_left / attack=- / focus=- / end=end_turn:+1111.1 end_turn / move=- / frontSummon=- / topSummon=summon:+399.6 summon:cpu_card_047_1->cpu_back_right [真勇者ダイン->cpu_back_right behind ヤンバル HP3]
- hand pressure: backWork=- / noReachFront=ドノマンティス,真勇者ダイン / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=5:ボムゾウ,6:ボムゾウ,7:ピグミィ,9:ヤンバル,19:ボムゾウ,21:ピグミィ / top5BackWork=5:ボムゾウ / noReachFront=1:ドノマンティス,2:ポリスピナー,3:デスシープ,4:ポリスピナー,10:真勇者ダイン,13:デスシープ,15:ドノマンティス,17:ポリスピナー,...(+1)
- next turn: attack:cpu_back_left:wild_claw->monster:player_front_right / move:cpu_front_right->cpu_back_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / summon:cpu_card_047_1->cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: マスター特技は333点差で見送り、召喚は400点差で見送り
- board: PF:真勇者ダイン Lv1 HP1 / PF:ユニフォーン Lv1 HP4 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv1 HP6 / CF:ヤンバル Lv1 HP3 / CB:ヤンバル Lv1 HP3

### blocked_no_pattern_no_work: デスシープ seed 136502 turn 5

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front デスシープ Lv1 HP6 / stones after 0 / score 25
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: top=summon:+13.5 summon:cpu_card_037_2->cpu_back_left [ドノマンティス->cpu_back_left behind デスシープ HP6] / nonSummon=end_turn:+243.1 end_turn / attack=- / focus=- / end=end_turn:+243.1 end_turn / move=- / frontSummon=- / topSummon=summon:+13.5 summon:cpu_card_037_2->cpu_back_left [ドノマンティス->cpu_back_left behind デスシープ HP6]
- hand pressure: backWork=- / noReachFront=ドノマンティス,ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=2:ボムゾウ,3:ボムゾウ,4:ピグミィ,6:ヤンバル,16:ボムゾウ,18:ピグミィ / top5BackWork=2:ボムゾウ,3:ボムゾウ,4:ピグミィ / noReachFront=1:ポリスピナー,7:真勇者ダイン,10:デスシープ,12:ドノマンティス,14:ポリスピナー,20:真勇者ダイン
- next turn: attack:cpu_front_right:ダイン斬り->monster:player_front_right / summon:cpu_card_037_2->cpu_back_right / focus:cpu_front_left / focus:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は13点差で見送り、召喚は13点差で見送り
- board: PB:ピグミィ Lv1 HP3 / PB:ヤンバル Lv1 HP3 prep / CF:デスシープ Lv1 HP6 / CF:真勇者ダイン Lv3 HP6 / CB:ピグミィ Lv2 HP3

### low_stone_blocked_no_work: デスシープ seed 136502 turn 5

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front デスシープ Lv1 HP6 / stones after 0 / score 25
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: top=summon:+13.5 summon:cpu_card_037_2->cpu_back_left [ドノマンティス->cpu_back_left behind デスシープ HP6] / nonSummon=end_turn:+243.1 end_turn / attack=- / focus=- / end=end_turn:+243.1 end_turn / move=- / frontSummon=- / topSummon=summon:+13.5 summon:cpu_card_037_2->cpu_back_left [ドノマンティス->cpu_back_left behind デスシープ HP6]
- hand pressure: backWork=- / noReachFront=ドノマンティス,ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=2:ボムゾウ,3:ボムゾウ,4:ピグミィ,6:ヤンバル,16:ボムゾウ,18:ピグミィ / top5BackWork=2:ボムゾウ,3:ボムゾウ,4:ピグミィ / noReachFront=1:ポリスピナー,7:真勇者ダイン,10:デスシープ,12:ドノマンティス,14:ポリスピナー,20:真勇者ダイン
- next turn: attack:cpu_front_right:ダイン斬り->monster:player_front_right / summon:cpu_card_037_2->cpu_back_right / focus:cpu_front_left / focus:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は13点差で見送り、召喚は13点差で見送り
- board: PB:ピグミィ Lv1 HP3 / PB:ヤンバル Lv1 HP3 prep / CF:デスシープ Lv1 HP6 / CF:真勇者ダイン Lv3 HP6 / CB:ピグミィ Lv2 HP3

### blocked_no_pattern_no_work: ドノマンティス seed 136502 turn 6

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front 真勇者ダイン Lv3 HP6 / stones after 4 / score 24
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=summon:+0 summon:cpu_card_037_3->cpu_back_right [ドノマンティス->cpu_back_right behind 真勇者ダイン HP6] / nonSummon=focus:+77.8 focus:cpu_back_left / attack=- / focus=focus:+77.8 focus:cpu_back_left / end=end_turn:+160.9 end_turn / move=move:+115.8 move:cpu_back_left->cpu_front_left / frontSummon=- / topSummon=summon:+0 summon:cpu_card_037_3->cpu_back_right [ドノマンティス->cpu_back_right behind 真勇者ダイン HP6]
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー,ポリスピナー / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=1:ボムゾウ,2:ボムゾウ,3:ピグミィ,5:ヤンバル,15:ボムゾウ,17:ピグミィ / top5BackWork=1:ボムゾウ,2:ボムゾウ,3:ピグミィ,5:ヤンバル / noReachFront=6:真勇者ダイン,9:デスシープ,11:ドノマンティス,13:ポリスピナー,19:真勇者ダイン
- next turn: attack:cpu_front_right:ダイン斬り->master:player / master:master_attack->monster:player_front_left / attack:cpu_front_left:attack->monster:player_front_left / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、召喚は23点差で見送り
- board: PF:ヤミー Lv1 HP5 prep / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv1 HP6 / CF:真勇者ダイン Lv3 HP6 / CB:デスシープ Lv1 HP6

### blocked_backline_pattern_worked: ピグミィ seed 136503 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role back / front 真勇者ダイン Lv1 HP4 / stones after 3 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: top=summon:+78.3 summon:cpu_card_133_3->cpu_back_right [デスシープ->cpu_back_right behind 真勇者ダイン HP4] / nonSummon=focus:+79.5 focus:cpu_back_left / attack=attack:+208.5 attack:cpu_front_right:ダイン斬り->monster:player_front_right / focus=focus:+79.5 focus:cpu_back_left / end=- / move=move:+214 move:cpu_back_left->cpu_front_right / frontSummon=- / topSummon=summon:+78.3 summon:cpu_card_133_3->cpu_back_right [デスシープ->cpu_back_right behind 真勇者ダイン HP4]
- hand pressure: backWork=- / noReachFront=デスシープ / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=3:ボムゾウ,5:ピグミィ,6:ピグミィ,10:ボムゾウ,12:ヤンバル,13:ボムゾウ,21:ヤンバル / top5BackWork=3:ボムゾウ,5:ピグミィ / noReachFront=2:ドノマンティス,7:デスシープ,9:真勇者ダイン,11:ドノマンティス,14:ポリスピナー,17:ドノマンティス,18:ポリスピナー,22:ポリスピナー,...(+1)
- next turn: attack:cpu_back_right:スパイクボール->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / focus:cpu_front_right / summon:cpu_card_133_3->cpu_back_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は78点差で見送り、ためるは80点差で見送り
- board: PF:真勇者ダイン Lv1 HP5 / PF:ナッツロックル Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP4 / CB:真勇者ダイン Lv1 HP6

### blocked_no_pattern_no_work: デスシープ seed 136503 turn 3

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv2 HP6 / stones after 3 / score 25
- flags: no-backline-pattern, next-no-work, loss
- alternatives: top=focus:+67.4 focus:cpu_back_right / nonSummon=focus:+67.4 focus:cpu_back_right / attack=attack:+146.5 attack:cpu_back_right:スパイクボール->monster:player_front_right / focus=focus:+67.4 focus:cpu_back_right / end=end_turn:+273.3 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=2:ボムゾウ,4:ピグミィ,5:ピグミィ,9:ボムゾウ,11:ヤンバル,12:ボムゾウ,20:ヤンバル / top5BackWork=2:ボムゾウ,4:ピグミィ,5:ピグミィ / noReachFront=1:ドノマンティス,6:デスシープ,8:真勇者ダイン,10:ドノマンティス,13:ポリスピナー,16:ドノマンティス,17:ポリスピナー,21:ポリスピナー,...(+1)
- next turn: attack:cpu_front_left:ダイン斬り->master:player / attack:cpu_back_right:スパイクボール->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / attack:cpu_front_right:ダイン斬り->monster:player_front_right / ...
- reason: カードを後列左へ召喚 / 見送り: ためるは67点差で見送り、攻撃は146点差で見送り
- board: PF:ナッツロックル Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv2 HP6 / CF:真勇者ダイン Lv1 HP4 / CB:ピグミィ Lv1 HP3

### blocked_backline_pattern_worked: ボムゾウ seed 136503 turn 5

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role front / front デスシープ Lv1 HP6 / stones after 2 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: top=end_turn:+256.1 end_turn / nonSummon=end_turn:+256.1 end_turn / attack=- / focus=- / end=end_turn:+256.1 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=2:ピグミィ,3:ピグミィ,7:ボムゾウ,9:ヤンバル,10:ボムゾウ,18:ヤンバル / top5BackWork=2:ピグミィ,3:ピグミィ / noReachFront=4:デスシープ,6:真勇者ダイン,8:ドノマンティス,11:ポリスピナー,14:ドノマンティス,15:ポリスピナー,19:ポリスピナー,20:デスシープ
- next turn: attack:cpu_front_left:ダイン斬り->monster:player_front_left / magic:cpu_card_031_1->monster:player_front_right / attack:cpu_back_right:storm_bomb->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / ...
- reason: カードを後列右へ召喚
- board: PF:ヤミー Lv1 HP5 prep / PB:ヤンバル Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv3 HP6 / CF:デスシープ Lv1 HP6 / CB:ピグミィ Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 136503 turn 5

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role front / front デスシープ Lv1 HP6 / stones after 2 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: top=end_turn:+256.1 end_turn / nonSummon=end_turn:+256.1 end_turn / attack=- / focus=- / end=end_turn:+256.1 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=2:ピグミィ,3:ピグミィ,7:ボムゾウ,9:ヤンバル,10:ボムゾウ,18:ヤンバル / top5BackWork=2:ピグミィ,3:ピグミィ / noReachFront=4:デスシープ,6:真勇者ダイン,8:ドノマンティス,11:ポリスピナー,14:ドノマンティス,15:ポリスピナー,19:ポリスピナー,20:デスシープ
- next turn: attack:cpu_front_left:ダイン斬り->monster:player_front_left / magic:cpu_card_031_1->monster:player_front_right / attack:cpu_back_right:storm_bomb->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / ...
- reason: カードを後列右へ召喚
- board: PF:ヤミー Lv1 HP5 prep / PB:ヤンバル Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv3 HP6 / CF:デスシープ Lv1 HP6 / CB:ピグミィ Lv1 HP3

### low_stone_blocked_no_work: ヤンバル seed 136504 turn 1

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_right / role back / front 真勇者ダイン Lv1 HP6 prep / stones after 0 / score 68
- flags: backline-pattern, next-no-work, very-low-stone, win
- alternatives: top=summon:+1 summon:player_card_051_1->player_back_right [ピグミィ->player_back_right behind 真勇者ダイン HP6] / nonSummon=end_turn:+326.3 end_turn / attack=- / focus=- / end=end_turn:+326.3 end_turn / move=- / frontSummon=summon:+163 summon:player_yanbaru_3->player_front_left [ヤンバル->player_front_left] / topSummon=summon:+1 summon:player_card_051_1->player_back_right [ピグミィ->player_back_right behind 真勇者ダイン HP6]
- hand pressure: backWork=ピグミィ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=25 / backWork=5:ボムゾウ,7:ピグミィ,8:ピグミィ,12:ボムゾウ,14:ヤンバル,15:ボムゾウ,23:ヤンバル / top5BackWork=5:ボムゾウ / noReachFront=1:デスシープ,4:ドノマンティス,9:デスシープ,11:真勇者ダイン,13:ドノマンティス,16:ポリスピナー,19:ドノマンティス,20:ポリスピナー,...(+2)
- next turn: focus:player_back_right / summon:player_card_051_1->player_back_left / focus:player_front_left / focus:player_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、召喚は163点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 prep / PB:真勇者ダイン Lv1 HP6 prep

### blocked_backline_pattern_worked: ピグミィ seed 136504 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_left / role back / front 真勇者ダイン Lv1 HP6 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=focus:+2 focus:player_front_left / nonSummon=focus:+2 focus:player_front_left / attack=- / focus=focus:+2 focus:player_front_left / end=end_turn:+362.4 end_turn / move=- / frontSummon=- / topSummon=summon:+75.3 summon:player_card_133_3->player_back_left [デスシープ->player_back_left behind 真勇者ダイン HP6]
- hand pressure: backWork=- / noReachFront=デスシープ / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=4:ボムゾウ,6:ピグミィ,7:ピグミィ,11:ボムゾウ,13:ヤンバル,14:ボムゾウ,22:ヤンバル / top5BackWork=4:ボムゾウ / noReachFront=3:ドノマンティス,8:デスシープ,10:真勇者ダイン,12:ドノマンティス,15:ポリスピナー,18:ドノマンティス,19:ポリスピナー,23:ポリスピナー,...(+1)
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: ためるは2点差で見送り、ためるは2点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:真勇者ダイン Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CB:ヤンバル Lv1 HP3 prep / CB:ボムゾウ Lv1 HP6 prep

### blocked_no_pattern_no_work: 真勇者ダイン seed 136504 turn 14

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_right / role front / front ピグミィ Lv1 HP3 / stones after 7 / score 28
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=summon:+3 summon:player_card_133_2->player_back_right [デスシープ->player_back_right behind ピグミィ HP3] / nonSummon=move:+38.3 move:player_front_right->player_back_right / attack=attack:+175.8 attack:player_back_left:スパイクボール->monster:cpu_front_right / focus=- / end=- / move=move:+38.3 move:player_front_right->player_back_right / frontSummon=- / topSummon=summon:+3 summon:player_card_133_2->player_back_right [デスシープ->player_back_right behind ピグミィ HP3]
- hand pressure: backWork=ボムゾウ,ボムゾウ / noReachFront=デスシープ,ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=12 / backWork=1:ヤンバル,2:ボムゾウ,10:ヤンバル / top5BackWork=1:ヤンバル,2:ボムゾウ / noReachFront=3:ポリスピナー,6:ドノマンティス,7:ポリスピナー,11:ポリスピナー,12:デスシープ
- next turn: move:player_front_left->player_back_left / move:player_front_right->player_back_right / master:shield->monster:player_front_left / end_turn
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は3点差で見送り、召喚は5点差で見送り
- board: PF:ドノマンティス Lv2 HP5 / PF:ピグミィ Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ボムゾウ Lv2 HP5

### front_role_allowed_by_range: ボムゾウ seed 136505 turn 7

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_right / role front / front ヤンバル Lv1 HP3 / stones after 4 / score 23
- flags: backline-pattern, next-no-work, win
- alternatives: top=summon:+29.4 summon:player_polyspinner_3->player_back_right [ポリスピナー->player_back_right behind ヤンバル HP3] / nonSummon=attack:+127.1 attack:player_front_left:storm_bomb->monster:cpu_front_right / attack=attack:+127.1 attack:player_front_left:storm_bomb->monster:cpu_front_right / focus=focus:+277.6 focus:player_back_left / end=- / move=move:+329.6 move:player_back_left->player_front_left / frontSummon=- / topSummon=summon:+29.4 summon:player_polyspinner_3->player_back_right [ポリスピナー->player_back_right behind ヤンバル HP3]
- hand pressure: backWork=- / noReachFront=ポリスピナー,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=5:ピグミィ,6:ピグミィ,7:ボムゾウ,10:ピグミィ,12:ヤンバル,17:ヤンバル / top5BackWork=5:ピグミィ / noReachFront=1:ドノマンティス,2:ドノマンティス,9:デスシープ,11:デスシープ,14:デスシープ,15:真勇者ダイン,16:真勇者ダイン
- next turn: summon:player_card_037_3->player_back_left / summon:player_polyspinner_3->player_back_right / master:master_attack->monster:cpu_front_right / attack:player_front_right:self_bomb->monster:cpu_front_right / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 召喚は29点差で見送り、召喚は29点差で見送り
- board: PF:ボムゾウ Lv1 HP4 / PF:ヤンバル Lv1 HP3 / PB:ポリスピナー Lv1 HP3 / CF:ポリスピナー Lv2 HP3 / CB:ドノマンティス Lv1 HP5 / CB:ピグミィ Lv1 HP3 prep

### bad_blocked_close_non_summon_alt: ドノマンティス seed 136505 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 3 / score 24
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=focus:+3.6 focus:player_back_right / nonSummon=focus:+3.6 focus:player_back_right / attack=- / focus=focus:+3.6 focus:player_back_right / end=end_turn:+305.2 end_turn / move=- / frontSummon=- / topSummon=summon:+23 summon:player_polyspinner_1->player_back_left [ポリスピナー->player_back_left behind ドノマンティス HP5]
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=3:ピグミィ,4:ピグミィ,5:ボムゾウ,8:ピグミィ,10:ヤンバル,15:ヤンバル / top5BackWork=3:ピグミィ,4:ピグミィ,5:ボムゾウ / noReachFront=7:デスシープ,9:デスシープ,12:デスシープ,13:真勇者ダイン,14:真勇者ダイン
- next turn: end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは4点差で見送り、召喚は23点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:ボムゾウ Lv2 HP2 / PB:ポリスピナー Lv1 HP3 / CB:ピグミィ Lv2 HP3

### front_role_allowed_by_range: ボムゾウ seed 136506 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, win)
- decision: cpu_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 2 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=summon:+34.4 summon:cpu_polyspinner_3->cpu_back_right [ポリスピナー->cpu_back_right behind ボムゾウ HP6] / nonSummon=end_turn:+299.9 end_turn / attack=- / focus=- / end=end_turn:+299.9 end_turn / move=- / frontSummon=- / topSummon=summon:+34.4 summon:cpu_polyspinner_3->cpu_back_right [ポリスピナー->cpu_back_right behind ボムゾウ HP6]
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=8:ヤンバル,10:ボムゾウ,16:ピグミィ,18:ピグミィ,20:ヤンバル,21:ピグミィ / top5BackWork=- / noReachFront=1:ポリスピナー,2:真勇者ダイン,4:真勇者ダイン,5:デスシープ,7:ポリスピナー,12:ドノマンティス,14:ドノマンティス,17:真勇者ダイン,...(+2)
- next turn: attack:cpu_back_right:storm_bomb->monster:player_front_right / focus:cpu_front_left / magic:cpu_card_031_1->monster:cpu_back_right / attack:cpu_back_left:storm_bomb->monster:player_front_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は34点差で見送り、マスター特技は456点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:真勇者ダイン Lv1 HP6 / PB:ボムゾウ Lv1 HP6 / CF:デスシープ Lv1 HP6 / CF:ボムゾウ Lv1 HP6 / CB:ヤンバル Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 136506 turn 13

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, win)
- decision: cpu_back_right / role front / front ヤンバル Lv2 HP3 / stones after 3 / score 23
- flags: backline-pattern, next-no-work, win
- alternatives: top=summon:+9.3 summon:cpu_card_133_3->cpu_back_right [デスシープ->cpu_back_right behind ヤンバル HP3] / nonSummon=attack:+44.2 attack:cpu_front_left:attack->monster:player_front_left / attack=attack:+44.2 attack:cpu_front_left:attack->monster:player_front_left / focus=focus:+91.5 focus:cpu_front_left / end=end_turn:+148.5 end_turn / move=- / frontSummon=- / topSummon=summon:+9.3 summon:cpu_card_133_3->cpu_back_right [デスシープ->cpu_back_right behind ヤンバル HP3]
- hand pressure: backWork=- / noReachFront=デスシープ,ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=12 / backWork=5:ピグミィ,7:ピグミィ,9:ヤンバル,10:ピグミィ / top5BackWork=5:ピグミィ / noReachFront=1:ドノマンティス,3:ドノマンティス,6:真勇者ダイン,11:デスシープ,12:ドノマンティス
- next turn: master:wake_up->monster:player_front_right / attack:cpu_front_left:wild_claw->monster:player_front_right / focus:cpu_front_right / summon:cpu_card_037_2->cpu_back_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は9点差で見送り、召喚は34点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv2 HP3 / CF:デスシープ Lv2 HP6 / CF:ヤンバル Lv2 HP3 / CB:ヤンバル Lv2 HP3

### bad_blocked_close_non_summon_alt: ポリスピナー seed 136506 turn 15

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, win)
- decision: cpu_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 10 / score 26
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=focus:+27.4 focus:cpu_back_right / nonSummon=focus:+27.4 focus:cpu_back_right / attack=- / focus=focus:+27.4 focus:cpu_back_right / end=end_turn:+262.5 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=10 / backWork=3:ピグミィ,5:ピグミィ,7:ヤンバル,8:ピグミィ / top5BackWork=3:ピグミィ,5:ピグミィ / noReachFront=1:ドノマンティス,4:真勇者ダイン,9:デスシープ,10:ドノマンティス
- next turn: focus:cpu_front_left / master:master_attack->monster:player_front_left / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_front_right:self_bomb->monster:player_front_right / ...
- reason: カードを後列左へ召喚 / 見送り: ためるは27点差で見送り、マスター特技は139点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv2 HP3 / CF:ドノマンティス Lv1 HP5 / CF:ボムゾウ Lv1 HP6 / CB:デスシープ Lv1 HP6

### front_role_allowed_by_range: ボムゾウ seed 136507 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, win)
- decision: cpu_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 3 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=summon:+0 summon:cpu_bomuzo_3->cpu_back_right [ボムゾウ->cpu_back_right behind デスシープ HP6] / nonSummon=master_action:+267.4 master:master_attack->monster:player_front_right / attack=attack:+461.6 attack:cpu_front_left:attack->monster:player_front_left / focus=- / end=- / move=- / frontSummon=- / topSummon=summon:+0 summon:cpu_bomuzo_3->cpu_back_right [ボムゾウ->cpu_back_right behind デスシープ HP6]
- hand pressure: backWork=- / noReachFront=ポリスピナー,ドノマンティス / emptyBack 2->1 / noReachBackAfter=0
- deck pressure: deck=21 / backWork=3:ピグミィ,4:ヤンバル,5:ヤンバル,6:ボムゾウ,8:ピグミィ,15:ボムゾウ,21:ピグミィ / top5BackWork=3:ピグミィ,4:ヤンバル,5:ヤンバル / noReachFront=2:ポリスピナー,7:ポリスピナー,11:デスシープ,12:デスシープ,17:ドノマンティス,18:真勇者ダイン,20:真勇者ダイン
- next turn: attack:cpu_front_left:attack->monster:player_front_left / magic:cpu_card_031_1->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_back_left:storm_bomb->monster:player_front_right / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は159点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ポリスピナー Lv1 HP1 / PB:ヤンバル Lv1 HP3 / PB:ボムゾウ Lv1 HP6 prep / CF:ドノマンティス Lv1 HP5 / CF:デスシープ Lv2 HP6

### bad_blocked_close_non_summon_alt: ポリスピナー seed 136510 turn 2

- variant/opponent: `current_back_slot_future_state65` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role front / front ポリスピナー Lv1 HP3 / stones after 0 / score 26
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: top=end_turn:+24.2 end_turn / nonSummon=end_turn:+24.2 end_turn / attack=attack:+146.6 attack:cpu_front_left:attack->monster:player_front_left / focus=- / end=end_turn:+24.2 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=1:ヤンバル,2:ピグミィ,9:ボムゾウ,11:ボムゾウ,15:ピグミィ,17:ヤンバル,18:ヤンバル,21:ピグミィ,...(+1) / top5BackWork=1:ヤンバル,2:ピグミィ / noReachFront=3:真勇者ダイン,5:ドノマンティス,7:真勇者ダイン,12:ドノマンティス,13:ドノマンティス,16:デスシープ,20:デスシープ,23:デスシープ
- next turn: focus:cpu_front_right / master:wake_up->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / summon:cpu_yanbaru_3->cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: 攻撃は147点差で見送り、攻撃は182点差で見送り
- board: PF:ナッツロックル Lv1 HP5 / PF:ボムゾウ Lv1 HP1 / PB:ヤミー Lv1 HP5 / CF:ポリスピナー Lv1 HP3 / CF:ポリスピナー Lv1 HP3 / CB:真勇者ダイン Lv1 HP6

### low_stone_blocked_no_work: ポリスピナー seed 136510 turn 2

- variant/opponent: `current_back_slot_future_state65` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role front / front ポリスピナー Lv1 HP3 / stones after 0 / score 26
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: top=end_turn:+24.2 end_turn / nonSummon=end_turn:+24.2 end_turn / attack=attack:+146.6 attack:cpu_front_left:attack->monster:player_front_left / focus=- / end=end_turn:+24.2 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=1:ヤンバル,2:ピグミィ,9:ボムゾウ,11:ボムゾウ,15:ピグミィ,17:ヤンバル,18:ヤンバル,21:ピグミィ,...(+1) / top5BackWork=1:ヤンバル,2:ピグミィ / noReachFront=3:真勇者ダイン,5:ドノマンティス,7:真勇者ダイン,12:ドノマンティス,13:ドノマンティス,16:デスシープ,20:デスシープ,23:デスシープ
- next turn: focus:cpu_front_right / master:wake_up->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / summon:cpu_yanbaru_3->cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: 攻撃は147点差で見送り、攻撃は182点差で見送り
- board: PF:ナッツロックル Lv1 HP5 / PF:ボムゾウ Lv1 HP1 / PB:ヤミー Lv1 HP5 / CF:ポリスピナー Lv1 HP3 / CF:ポリスピナー Lv1 HP3 / CB:真勇者ダイン Lv1 HP6

### bad_blocked_close_non_summon_alt: ポリスピナー seed 136512 turn 23

- variant/opponent: `current_back_slot_future_state65` vs `white_current_mirror` (player, win)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 10 / score 26
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=attack:+26.8 attack:player_back_left:wild_claw->monster:cpu_front_left / nonSummon=attack:+26.8 attack:player_back_left:wild_claw->monster:cpu_front_left / attack=attack:+26.8 attack:player_back_left:wild_claw->monster:cpu_front_left / focus=focus:+183.2 focus:player_front_left / end=end_turn:+291.2 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=3 / backWork=- / top5BackWork=- / noReachFront=1:ポリスピナー,2:デスシープ,3:ドノマンティス
- next turn: end_turn
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 攻撃は27点差で見送り、マスター特技は87点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:ポリスピナー Lv1 HP3 / CB:ピグミィ Lv1 HP3 / CB:ピグミィ Lv2 HP3

### bad_blocked_close_non_summon_alt: ドノマンティス seed 136513 turn 2

- variant/opponent: `current_back_slot_future_state65` vs `white_current_mirror` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 2 / score 24
- flags: no-backline-pattern, next-no-work, loss
- alternatives: top=focus:+8 focus:player_front_left / nonSummon=focus:+8 focus:player_front_left / attack=- / focus=focus:+8 focus:player_front_left / end=end_turn:+80.1 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ボムゾウ,10:ピグミィ,11:ピグミィ,12:ボムゾウ,13:ヤンバル,14:ヤンバル,15:ヤンバル / top5BackWork=2:ボムゾウ / noReachFront=1:デスシープ,3:ドノマンティス,4:真勇者ダイン,5:ポリスピナー,7:デスシープ,8:ポリスピナー,9:ドノマンティス,20:ポリスピナー,...(+2)
- next turn: magic:player_card_031_1->monster:cpu_back_left / attack:player_front_right:self_bomb->monster:cpu_front_right / attack:player_front_left:ダイン斬り->monster:cpu_front_left / focus:player_back_right / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは8点差で見送り、ためるは8点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:ドノマンティス Lv1 HP5 prep / CF:ドノマンティス Lv1 HP5 prep / CB:ヤンバル Lv1 HP3 prep

### blocked_no_pattern_move_forward: デスシープ seed 136513 turn 8

- variant/opponent: `current_back_slot_future_state65` vs `white_current_mirror` (player, loss)
- decision: player_back_left / role front / front ボムゾウ Lv2 HP5 / stones after 3 / score 25
- flags: no-backline-pattern, next-move-front, loss
- alternatives: top=summon:+5.2 summon:player_card_037_3->player_back_left [ドノマンティス->player_back_left behind ボムゾウ HP5] / nonSummon=end_turn:+62.2 end_turn / attack=- / focus=- / end=end_turn:+62.2 end_turn / move=- / frontSummon=- / topSummon=summon:+5.2 summon:player_card_037_3->player_back_left [ドノマンティス->player_back_left behind ボムゾウ HP5]
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=4:ピグミィ,5:ピグミィ,6:ボムゾウ,7:ヤンバル,8:ヤンバル,9:ヤンバル / top5BackWork=4:ピグミィ,5:ピグミィ / noReachFront=1:デスシープ,2:ポリスピナー,3:ドノマンティス,14:ポリスピナー,16:真勇者ダイン,18:デスシープ
- next turn: move:player_back_left->player_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_left:storm_bomb->monster:cpu_front_right / end_turn
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は5点差で見送り、召喚は28点差で見送り
- board: PF:ボムゾウ Lv2 HP5 / PF:真勇者ダイン Lv2 HP6 / PB:ピグミィ Lv2 HP3 / CF:ドノマンティス Lv1 HP5 / CB:ヤンバル Lv2 HP3

### low_stone_blocked_no_work: ピグミィ seed 136513 turn 12

- variant/opponent: `current_back_slot_future_state65` vs `white_current_mirror` (player, loss)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 prep / stones after 0 / score 67
- flags: backline-pattern, next-no-work, very-low-stone, loss
- alternatives: top=end_turn:+257.2 end_turn / nonSummon=end_turn:+257.2 end_turn / attack=- / focus=- / end=end_turn:+257.2 end_turn / move=- / frontSummon=- / topSummon=summon:+413.8 summon:player_card_037_1->player_back_right [ドノマンティス->player_back_right behind ドノマンティス HP5]
- hand pressure: backWork=- / noReachFront=ポリスピナー,ポリスピナー,ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=14 / backWork=1:ピグミィ,2:ボムゾウ,3:ヤンバル,4:ヤンバル,5:ヤンバル / top5BackWork=1:ピグミィ,2:ボムゾウ,3:ヤンバル,4:ヤンバル,5:ヤンバル / noReachFront=10:ポリスピナー,12:真勇者ダイン,14:デスシープ
- next turn: focus:player_front_right / summon:player_card_051_3->player_back_left / focus:player_back_right / end_turn
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は414点差で見送り、召喚は437点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:ドノマンティス Lv1 HP5 prep / PB:ピグミィ Lv2 HP3 / CF:真勇者ダイン Lv2 HP6 / CB:デスシープ Lv1 HP6 / CB:ヤンバル Lv2 HP3


## Notes

- この監査は前衛/後衛ラベルだけではなく、後列から攻撃できるパターンを別扱いにする。
- ボムゾウのような射程持ちは `Backline Pattern` 側に入り、今回の抑制候補からは外す。
- 前が詰まった後列に、後列攻撃パターンを持たないカードを置く例が一定数ある。ここだけを抑える候補は検証価値がある。
- 詰まり後列召喚が次自ターンの攻撃/前進に変換されない例が多い。召喚の盤面評価だけでなく次ターン仕事予定が必要。
- 詰まり後列召喚の多くは射程持ちカードでもあるため、一律ペナルティは避けるべき。
- 35点以内の近い非召喚代替は少なくても、100点以内なら存在する例が多い。召喚を禁止するより、非召喚側の局面評価を押し上げる余地がある。
- bad summon の代替召喚も後列射程なしに寄っている。後列で仕事できるカードを優先する召喚候補品質の改善が必要。
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
- `No Work`: 次自ターンにその召喚ユニットが攻撃も前進もしなかったケース。
- `Bad`: Blocked + No Pattern + No Work を満たす、今回もっとも疑う後列召喚。
- `Close Non-Summon`: Bad の局面で、選択召喚から35点以内に攻撃/ためる/移動/終了などの非召喚代替があったケース。
- `Medium Non-Summon`: Bad の局面で、選択召喚から100点以内に非召喚代替があったケース。
- `DeckReach`: Bad の局面で、残り山札に後列から仕事できるカードが残っていたケース。
- `DeckTop5Reach`: Bad の局面で、山札上位5枚に後列から仕事できるカードが残っていたケース。
