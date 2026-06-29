# White Backline Summon Audit Loop

生成: 2026-06-29T05:32:00.610Z
seedStart: 136400
候補: current_white_baseline, current_search_terminal_w3, current_search_terminal_w4
相手: black_1375_pressure, white_current_mirror
試行: 1 games/matchup/direction
総試合: 12

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 134
- 後列召喚: 75 (56%)
- 前列あり後列召喚: 54 (72%)
- うち前衛ロール: 22 (40.7%)
- Backline patternあり: 38 (70.4%)
- Backline patternなし: 16 (29.6%)
- 次自ターン攻撃: 13 (24.1%)
- 次自ターン後列攻撃: 13 (24.1%)
- 次自ターン前進: 3 (5.6%)
- 次自ターン仕事なし: 38 (70.4%)
- Bad blocked summon: 13 (24.1%)
- Bad with evaluation trace: 13 (100%)
- Bad with non-summon alt: 13 (100%)
- Bad close non-summon alt: 0 (0%)
- Bad medium non-summon alt <=100: 6 (46.2%)
- Bad distant non-summon alt <=200: 7 (53.8%)
- Bad avg best non-summon gap: 156
- Bad top summon alt: 8 (61.5%)
- Bad top summon same card: 4 (50%)
- Bad top summon backline pattern: 0 (0%)
- Bad with other backline work in hand: 1 (7.7%)
- Bad consumes last back slot: 10 (76.9%)
- Bad leaves no empty back slot: 10 (76.9%)
- Avg no-reach front cards in back after bad: 1
- Bad with deck backline work: 13 (100%)
- Bad with deck top5 backline work: 13 (100%)
- Bad consumes last back slot with deck backline work: 10 (76.9%)
- Avg deck backline work cards after bad: 5.15
- Avg deck top5 backline work cards after bad: 1.62

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_white_baseline | 2-2-0 | 40 | 20 (50%) | 14 (70%) | 4 (28.6%) | 11 (78.6%) | 3 (21.4%) | 7 (50%) | 7 (50%) | 0 (0%) | 7 (50%) | 3 (21.4%) | 0 (0%) | Atk1, End1, OtherSum1, SameCard1, NoReachSum1, NonSum1001, DeckReach3, DeckTop5Reach3, LastBack2, NoEmptyBack2 | 4 (28.6%) | 8/6 |
| current_search_terminal_w3 | 2-2-0 | 49 | 27 (55.1%) | 22 (81.5%) | 9 (40.9%) | 16 (72.7%) | 6 (27.3%) | 4 (18.2%) | 4 (18.2%) | 1 (4.5%) | 17 (77.3%) | 5 (22.7%) | 0 (0%) | Atk1, End1, OtherSum3, SameCard1, NoReachSum3, HandReach1, DeckReach5, DeckTop5Reach5, LastBack4, NoEmptyBack4 | 7 (31.8%) | 10/12 |
| current_search_terminal_w4 | 1-3-0 | 45 | 28 (62.2%) | 18 (64.3%) | 9 (50%) | 11 (61.1%) | 7 (38.9%) | 2 (11.1%) | 2 (11.1%) | 2 (11.1%) | 14 (77.8%) | 5 (27.8%) | 0 (0%) | Focus1, OtherSum4, SameCard2, NoReachSum4, NonSum1005, DeckReach5, DeckTop5Reach5, LastBack4, NoEmptyBack4 | 8 (44.4%) | 7/11 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | black_1375_pressure | 1-1-0 | 8 | 5 (62.5%) | 3 (37.5%) | 6 (75%) | 3 (37.5%) | 0 (0%) |
| current_white_baseline | white_current_mirror | 1-1-0 | 6 | 6 (100%) | 0 (0%) | 1 (16.7%) | 0 (0%) | 0 (0%) |
| current_search_terminal_w3 | black_1375_pressure | 2-0-0 | 10 | 6 (60%) | 4 (40%) | 6 (60%) | 3 (30%) | 0 (0%) |
| current_search_terminal_w3 | white_current_mirror | 0-2-0 | 12 | 10 (83.3%) | 2 (16.7%) | 11 (91.7%) | 2 (16.7%) | 0 (0%) |
| current_search_terminal_w4 | black_1375_pressure | 0-2-0 | 7 | 4 (57.1%) | 3 (42.9%) | 6 (85.7%) | 3 (42.9%) | 0 (0%) |
| current_search_terminal_w4 | white_current_mirror | 1-1-0 | 11 | 7 (63.6%) | 4 (36.4%) | 8 (72.7%) | 2 (18.2%) | 0 (0%) |

## Samples

### blocked_backline_pattern_worked: ピグミィ seed 136400 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: top=focus:+2 focus:player_front_left / nonSummon=focus:+2 focus:player_front_left / attack=- / focus=focus:+2 focus:player_front_left / end=end_turn:+238.3 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ヤンバル,6:ボムゾウ,21:ヤンバル,22:ボムゾウ,23:ピグミィ,24:ヤンバル / top5BackWork=2:ヤンバル / noReachFront=4:デスシープ,5:真勇者ダイン,9:ポリスピナー,10:デスシープ,11:ドノマンティス,13:真勇者ダイン,14:真勇者ダイン,15:ポリスピナー,...(+3)
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは2点差で見送り、ためるは2点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ナッツロックル Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_no_pattern_no_work: 真勇者ダイン seed 136400 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front デスシープ Lv1 HP6 / stones after 0 / score 28
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: top=attack:+52.7 attack:player_front_left:self_bomb->master:cpu / nonSummon=attack:+52.7 attack:player_front_left:self_bomb->master:cpu / attack=attack:+52.7 attack:player_front_left:self_bomb->master:cpu / focus=focus:+142.3 focus:player_front_right / end=end_turn:+114.3 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=1:ボムゾウ,16:ヤンバル,17:ボムゾウ,18:ピグミィ,19:ヤンバル / top5BackWork=1:ボムゾウ / noReachFront=4:ポリスピナー,5:デスシープ,6:ドノマンティス,8:真勇者ダイン,9:真勇者ダイン,10:ポリスピナー,11:ポリスピナー,13:ドノマンティス,...(+1)
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_front_right:attack->master:cpu / summon:player_bomuzo_2->player_front_left / attack:player_back_left:スパイクボール->monster:cpu_back_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 攻撃は53点差で見送り、ためるは142点差で見送り
- board: PF:ボムゾウ Lv2 HP3 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3 prep / CB:ピグミィ Lv1 HP3 prep

### low_stone_blocked_no_work: 真勇者ダイン seed 136400 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front デスシープ Lv1 HP6 / stones after 0 / score 28
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: top=attack:+52.7 attack:player_front_left:self_bomb->master:cpu / nonSummon=attack:+52.7 attack:player_front_left:self_bomb->master:cpu / attack=attack:+52.7 attack:player_front_left:self_bomb->master:cpu / focus=focus:+142.3 focus:player_front_right / end=end_turn:+114.3 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=1:ボムゾウ,16:ヤンバル,17:ボムゾウ,18:ピグミィ,19:ヤンバル / top5BackWork=1:ボムゾウ / noReachFront=4:ポリスピナー,5:デスシープ,6:ドノマンティス,8:真勇者ダイン,9:真勇者ダイン,10:ポリスピナー,11:ポリスピナー,13:ドノマンティス,...(+1)
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_front_right:attack->master:cpu / summon:player_bomuzo_2->player_front_left / attack:player_back_left:スパイクボール->monster:cpu_back_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 攻撃は53点差で見送り、ためるは142点差で見送り
- board: PF:ボムゾウ Lv2 HP3 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_backline_pattern_worked: ピグミィ seed 136401 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role back / front ヤンバル Lv1 HP3 / stones after 3 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=summon:+159.5 summon:cpu_bomuzo_3->cpu_back_right [ボムゾウ->cpu_back_right behind ヤンバル HP3] / nonSummon=master_action:+296.8 master:master_attack->monster:player_front_left / attack=- / focus=- / end=- / move=- / frontSummon=- / topSummon=summon:+159.5 summon:cpu_bomuzo_3->cpu_back_right [ボムゾウ->cpu_back_right behind ヤンバル HP3]
- hand pressure: backWork=ボムゾウ / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=3:ピグミィ,8:ボムゾウ,13:ヤンバル,18:ボムゾウ,21:ピグミィ / top5BackWork=3:ピグミィ / noReachFront=1:ポリスピナー,2:真勇者ダイン,7:デスシープ,9:真勇者ダイン,10:デスシープ,11:ポリスピナー,14:ドノマンティス,16:デスシープ,...(+2)
- next turn: attack:cpu_back_left:wild_claw->monster:player_front_right / move:cpu_front_right->cpu_back_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / summon:cpu_bomuzo_3->cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は160点差で見送り、マスター特技は297点差で見送り
- board: PF:真勇者ダイン Lv1 HP1 / PF:ヤミー Lv1 HP4 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ヤンバル Lv1 HP3 / CB:ヤンバル Lv1 HP3

### blocked_no_pattern_no_work: ドノマンティス seed 136401 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv1 HP6 prep / stones after 6 / score 24
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=end_turn:+248.8 end_turn / nonSummon=end_turn:+248.8 end_turn / attack=- / focus=- / end=end_turn:+248.8 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=3:ボムゾウ,8:ヤンバル,13:ボムゾウ,16:ピグミィ / top5BackWork=3:ボムゾウ / noReachFront=2:デスシープ,4:真勇者ダイン,5:デスシープ,6:ポリスピナー,9:ドノマンティス,11:デスシープ,12:ドノマンティス,14:ポリスピナー
- next turn: move:cpu_front_right->cpu_back_left / focus:cpu_front_left / master:shield->monster:cpu_front_left / end_turn
- reason: カードを後列左へ召喚
- board: CF:真勇者ダイン Lv1 HP6 prep / CF:ポリスピナー Lv1 HP3 prep / CB:ピグミィ Lv2 HP3

### blocked_no_pattern_no_work: デスシープ seed 136401 turn 9

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv2 HP6 / stones after 9 / score 25
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=summon:+0 summon:cpu_card_133_2->cpu_back_right [デスシープ->cpu_back_right behind ドノマンティス HP5] / nonSummon=end_turn:+297.7 end_turn / attack=- / focus=- / end=end_turn:+297.7 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:cpu_card_133_2->cpu_back_right [デスシープ->cpu_back_right behind ドノマンティス HP5]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=17 / backWork=1:ボムゾウ,6:ヤンバル,11:ボムゾウ,14:ピグミィ / top5BackWork=1:ボムゾウ / noReachFront=2:真勇者ダイン,3:デスシープ,4:ポリスピナー,7:ドノマンティス,9:デスシープ,10:ドノマンティス,12:ポリスピナー,17:ポリスピナー
- next turn: attack:cpu_front_left:ダイン斬り->master:player / attack:cpu_front_right:attack->master:player / summon:cpu_bomuzo_1->cpu_back_right / focus:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り
- board: CF:真勇者ダイン Lv2 HP6 / CF:ドノマンティス Lv1 HP5

### front_role_allowed_by_range: ボムゾウ seed 136401 turn 10

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 9 / score 23
- flags: backline-pattern, next-no-work, win
- alternatives: top=focus:+44.5 focus:cpu_back_left / nonSummon=focus:+44.5 focus:cpu_back_left / attack=- / focus=focus:+44.5 focus:cpu_back_left / end=end_turn:+250.4 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=16 / backWork=5:ヤンバル,10:ボムゾウ,13:ピグミィ / top5BackWork=5:ヤンバル / noReachFront=1:真勇者ダイン,2:デスシープ,3:ポリスピナー,6:ドノマンティス,8:デスシープ,9:ドノマンティス,11:ポリスピナー,16:ポリスピナー
- next turn: magic:cpu_card_031_1->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / focus:cpu_front_right / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: ためるは45点差で見送り
- board: PF:ユニフォーン Lv1 HP5 prep / PB:ヤンバル Lv1 HP3 prep / CF:真勇者ダイン Lv2 HP6 / CF:ドノマンティス Lv1 HP5 / CB:デスシープ Lv1 HP6

### blocked_backline_pattern_worked: ヤンバル seed 136402 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_right / role back / front ボムゾウ Lv1 HP6 / stones after 2 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=summon:+1 summon:player_card_051_2->player_back_right [ピグミィ->player_back_right behind ボムゾウ HP6] / nonSummon=focus:+14.4 focus:player_front_right / attack=- / focus=focus:+14.4 focus:player_front_right / end=end_turn:+410 end_turn / move=- / frontSummon=- / topSummon=summon:+1 summon:player_card_051_2->player_back_right [ピグミィ->player_back_right behind ボムゾウ HP6]
- hand pressure: backWork=ピグミィ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=4:ピグミィ,9:ボムゾウ,14:ヤンバル,19:ボムゾウ,22:ピグミィ / top5BackWork=4:ピグミィ / noReachFront=1:ドノマンティス,2:ポリスピナー,3:真勇者ダイン,8:デスシープ,10:真勇者ダイン,11:デスシープ,12:ポリスピナー,15:ドノマンティス,...(+3)
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_back_left:wild_claw->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、ためるは14点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 prep / CB:真勇者ダイン Lv1 HP6 prep / CB:ドノマンティス Lv1 HP5 prep

### blocked_backline_pattern_worked: ピグミィ seed 136402 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_left / role back / front ヤンバル Lv1 HP3 / stones after 5 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=summon:+0 summon:player_card_051_2->player_back_right [ピグミィ->player_back_right behind ヤンバル HP3] / nonSummon=attack:+113 attack:player_front_left:wild_claw->monster:cpu_front_right / attack=attack:+113 attack:player_front_left:wild_claw->monster:cpu_front_right / focus=- / end=- / move=move:+219.8 move:player_front_left->player_back_right / frontSummon=- / topSummon=summon:+0 summon:player_card_051_2->player_back_right [ピグミィ->player_back_right behind ヤンバル HP3]
- hand pressure: backWork=ピグミィ / noReachFront=ポリスピナー,真勇者ダイン / emptyBack 2->1 / noReachBackAfter=0
- deck pressure: deck=20 / backWork=5:ボムゾウ,10:ヤンバル,15:ボムゾウ,18:ピグミィ / top5BackWork=5:ボムゾウ / noReachFront=4:デスシープ,6:真勇者ダイン,7:デスシープ,8:ポリスピナー,11:ドノマンティス,13:デスシープ,14:ドノマンティス,16:ポリスピナー
- next turn: move:player_front_right->player_back_right / attack:player_front_left:wild_claw->monster:cpu_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は1点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:ヤンバル Lv2 HP3 / CF:ポリスピナー Lv1 HP3

### blocked_backline_pattern_worked: ピグミィ seed 136402 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_right / role back / front ヤンバル Lv2 HP3 / stones after 4 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=master_action:+106.4 master:wake_up->monster:player_back_left / nonSummon=master_action:+106.4 master:wake_up->monster:player_back_left / attack=- / focus=- / end=end_turn:+1081 end_turn / move=- / frontSummon=- / topSummon=summon:+175.8 summon:player_card_047_1->player_back_right [真勇者ダイン->player_back_right behind ヤンバル HP3]
- hand pressure: backWork=- / noReachFront=ポリスピナー,真勇者ダイン / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=5:ボムゾウ,10:ヤンバル,15:ボムゾウ,18:ピグミィ / top5BackWork=5:ボムゾウ / noReachFront=4:デスシープ,6:真勇者ダイン,7:デスシープ,8:ポリスピナー,11:ドノマンティス,13:デスシープ,14:ドノマンティス,16:ポリスピナー
- next turn: move:player_front_right->player_back_right / attack:player_front_left:wild_claw->monster:cpu_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: マスター特技は106点差で見送り、召喚は176点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:ヤンバル Lv2 HP3 / PB:ピグミィ Lv1 HP3 prep / CF:ポリスピナー Lv1 HP1

### low_stone_blocked_no_work: ヤンバル seed 136404 turn 8

- variant/opponent: `current_search_terminal_w3` vs `black_1375_pressure` (player, win)
- decision: player_back_right / role back / front ピグミィ Lv1 HP3 / stones after 1 / score 68
- flags: backline-pattern, next-no-work, very-low-stone, win
- alternatives: top=move:+24.5 move:player_front_right->player_back_right / nonSummon=move:+24.5 move:player_front_right->player_back_right / attack=attack:+80.7 attack:player_back_left:wild_claw->monster:cpu_front_right / focus=focus:+356.8 focus:player_front_right / end=- / move=move:+24.5 move:player_front_right->player_back_right / frontSummon=- / topSummon=summon:+68.8 summon:player_card_047_3->player_back_right [真勇者ダイン->player_back_right behind ピグミィ HP3]
- hand pressure: backWork=- / noReachFront=真勇者ダイン,ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=6:ボムゾウ,11:ボムゾウ,12:ヤンバル / top5BackWork=- / noReachFront=3:ポリスピナー,8:デスシープ,10:ポリスピナー,13:ポリスピナー,14:デスシープ,16:ドノマンティス,17:デスシープ,18:真勇者ダイン
- next turn: attack:player_front_right:wild_claw->monster:cpu_front_left / summon:player_card_047_3->player_front_left / master:wake_up->monster:player_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 移動は24点差で見送り、召喚は69点差で見送り
- board: PF:真勇者ダイン Lv2 HP5 / PF:ピグミィ Lv1 HP3 / PB:ヤンバル Lv1 HP3 / CF:ナッツロックル Lv1 HP6 prep / CF:ピグミィ Lv2 HP2 / CB:ポリスピナー Lv1 HP3 prep / CB:ヤミー Lv1 HP5

### blocked_no_pattern_move_forward: ドノマンティス seed 136404 turn 9

- variant/opponent: `current_search_terminal_w3` vs `black_1375_pressure` (player, win)
- decision: player_back_left / role front / front 真勇者ダイン Lv2 HP6 / stones after 3 / score 24
- flags: no-backline-pattern, next-move-front, win
- alternatives: top=summon:+0 summon:player_card_037_1->player_back_right [ドノマンティス->player_back_right behind ヤンバル HP3] / nonSummon=master_action:+111 master:master_attack->monster:cpu_front_right / attack=- / focus=- / end=end_turn:+325.7 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_card_037_1->player_back_right [ドノマンティス->player_back_right behind ヤンバル HP3]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=17 / backWork=5:ボムゾウ,10:ボムゾウ,11:ヤンバル / top5BackWork=5:ボムゾウ / noReachFront=2:ポリスピナー,7:デスシープ,9:ポリスピナー,12:ポリスピナー,13:デスシープ,15:ドノマンティス,16:デスシープ,17:真勇者ダイン
- next turn: attack:player_front_left:ダイン斬り->master:cpu / move:player_back_left->player_front_right / master:master_attack->monster:cpu_front_right / master:shield->monster:player_front_right / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、マスター特技は111点差で見送り
- board: PF:真勇者ダイン Lv2 HP6 / PF:ヤンバル Lv1 HP3 / CF:ヤミー Lv2 HP5

### blocked_no_pattern_no_work: ポリスピナー seed 136404 turn 11

- variant/opponent: `current_search_terminal_w3` vs `black_1375_pressure` (player, win)
- decision: player_back_left / role front / front 真勇者ダイン Lv2 HP4 / stones after 3 / score 26
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=summon:+0 summon:player_polyspinner_3->player_back_right [ポリスピナー->player_back_right behind ドノマンティス HP5] / nonSummon=end_turn:+244.4 end_turn / attack=- / focus=- / end=end_turn:+244.4 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_polyspinner_3->player_back_right [ポリスピナー->player_back_right behind ドノマンティス HP5]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=15 / backWork=3:ボムゾウ,8:ボムゾウ,9:ヤンバル / top5BackWork=3:ボムゾウ / noReachFront=5:デスシープ,7:ポリスピナー,10:ポリスピナー,11:デスシープ,13:ドノマンティス,14:デスシープ,15:真勇者ダイン
- next turn: attack:player_front_left:ダイン斬り->master:cpu / attack:player_front_right:呪いの刃->master:cpu / master:shield->monster:player_front_left / end_turn
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:真勇者ダイン Lv2 HP4 / PF:ドノマンティス Lv2 HP5 / CF:ユニフォーン Lv1 HP5 prep / CB:ヤンバル Lv1 HP3

### blocked_no_pattern_no_work: ドノマンティス seed 136405 turn 2

- variant/opponent: `current_search_terminal_w3` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front 真勇者ダイン Lv1 HP4 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: top=end_turn:+279.8 end_turn / nonSummon=end_turn:+279.8 end_turn / attack=- / focus=- / end=end_turn:+279.8 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=1:ボムゾウ,2:ピグミィ,3:ヤンバル,9:ボムゾウ,10:ピグミィ,15:ボムゾウ,20:ヤンバル,22:ピグミィ / top5BackWork=1:ボムゾウ,2:ピグミィ,3:ヤンバル / noReachFront=4:デスシープ,7:ドノマンティス,8:ポリスピナー,11:ドノマンティス,12:真勇者ダイン,13:ポリスピナー,17:デスシープ,18:ポリスピナー,...(+1)
- next turn: attack:cpu_back_left:wild_claw->monster:player_front_right / attack:cpu_front_right:ダイン斬り->monster:player_front_right / focus:cpu_front_left / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚
- board: PF:ナッツロックル Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:真勇者ダイン Lv1 HP4 / CB:ヤンバル Lv1 HP3

### low_stone_blocked_no_work: ドノマンティス seed 136405 turn 2

- variant/opponent: `current_search_terminal_w3` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front 真勇者ダイン Lv1 HP4 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: top=end_turn:+279.8 end_turn / nonSummon=end_turn:+279.8 end_turn / attack=- / focus=- / end=end_turn:+279.8 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=1:ボムゾウ,2:ピグミィ,3:ヤンバル,9:ボムゾウ,10:ピグミィ,15:ボムゾウ,20:ヤンバル,22:ピグミィ / top5BackWork=1:ボムゾウ,2:ピグミィ,3:ヤンバル / noReachFront=4:デスシープ,7:ドノマンティス,8:ポリスピナー,11:ドノマンティス,12:真勇者ダイン,13:ポリスピナー,17:デスシープ,18:ポリスピナー,...(+1)
- next turn: attack:cpu_back_left:wild_claw->monster:player_front_right / attack:cpu_front_right:ダイン斬り->monster:player_front_right / focus:cpu_front_left / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚
- board: PF:ナッツロックル Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:真勇者ダイン Lv1 HP4 / CB:ヤンバル Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 136406 turn 4

- variant/opponent: `current_search_terminal_w3` vs `white_current_mirror` (player, loss)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 3 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: top=master_action:+33.3 master:master_attack->monster:cpu_front_right / nonSummon=master_action:+33.3 master:master_attack->monster:cpu_front_right / attack=- / focus=- / end=end_turn:+796.6 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=1:ピグミィ,2:ヤンバル,8:ボムゾウ,9:ピグミィ,14:ボムゾウ,19:ヤンバル,21:ピグミィ / top5BackWork=1:ピグミィ,2:ヤンバル / noReachFront=3:デスシープ,6:ドノマンティス,7:ポリスピナー,10:ドノマンティス,11:真勇者ダイン,12:ポリスピナー,16:デスシープ,17:ポリスピナー,...(+1)
- next turn: focus:player_front_left / focus:player_front_right / summon:player_card_051_3->player_back_left / focus:player_back_right / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: マスター特技は33点差で見送り、マスター特技は648点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:ドノマンティス Lv2 HP5 / CF:デスシープ Lv1 HP2 / CB:真勇者ダイン Lv1 HP6 / CB:ヤンバル Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 136407 turn 2

- variant/opponent: `current_search_terminal_w3` vs `white_current_mirror` (cpu, loss)
- decision: cpu_back_right / role front / front ポリスピナー Lv1 HP3 / stones after 2 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: top=master_action:+306.5 master:master_attack->monster:player_front_right / nonSummon=master_action:+306.5 master:master_attack->monster:player_front_right / attack=- / focus=- / end=end_turn:+907.8 end_turn / move=- / frontSummon=- / topSummon=summon:+568 summon:cpu_card_047_2->cpu_back_right [真勇者ダイン->cpu_back_right behind ポリスピナー HP3]
- hand pressure: backWork=- / noReachFront=ドノマンティス,真勇者ダイン / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=3:ピグミィ,6:ピグミィ,10:ヤンバル,15:ヤンバル,18:ヤンバル,20:ボムゾウ / top5BackWork=3:ピグミィ / noReachFront=1:ポリスピナー,5:デスシープ,8:真勇者ダイン,9:デスシープ,12:ドノマンティス,17:真勇者ダイン,19:ポリスピナー,21:ドノマンティス,...(+1)
- next turn: focus:cpu_front_left / focus:cpu_front_right / focus:cpu_back_left / summon:cpu_card_047_2->cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: マスター特技は307点差で見送り、召喚は568点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP1 / PB:ヤンバル Lv1 HP3 prep / PB:ヤンバル Lv1 HP3 / CF:ボムゾウ Lv1 HP6 / CF:ポリスピナー Lv1 HP3 / CB:ピグミィ Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 136407 turn 22

- variant/opponent: `current_search_terminal_w3` vs `white_current_mirror` (cpu, loss)
- decision: cpu_back_right / role front / front ヤンバル Lv2 HP3 / stones after 9 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: top=focus:+28.6 focus:cpu_back_left / nonSummon=focus:+28.6 focus:cpu_back_left / attack=attack:+257 attack:cpu_back_left:スパイクボール->monster:player_front_left / focus=focus:+28.6 focus:cpu_back_left / end=end_turn:+259.2 end_turn / move=- / frontSummon=- / topSummon=summon:+34.4 summon:cpu_polyspinner_1->cpu_back_right [ポリスピナー->cpu_back_right behind ヤンバル HP3]
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=3 / backWork=- / top5BackWork=- / noReachFront=1:ドノマンティス,2:デスシープ
- next turn: attack:cpu_back_left:スパイクボール->monster:player_front_left / master:shield->monster:cpu_back_left / end_turn
- reason: カードを後列右へ召喚 / 見送り: ためるは29点差で見送り、召喚は34点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:ボムゾウ Lv1 HP6 prep / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv1 HP6 / CF:ヤンバル Lv2 HP3 / CB:ピグミィ Lv2 HP1

### low_stone_blocked_no_work: ドノマンティス seed 136408 turn 6

- variant/opponent: `current_search_terminal_w4` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv1 HP3 / stones after 1 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: top=focus:+37.8 focus:player_back_right / nonSummon=focus:+37.8 focus:player_back_right / attack=- / focus=focus:+37.8 focus:player_back_right / end=end_turn:+263.2 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=3:ピグミィ,7:ヤンバル,12:ヤンバル,15:ヤンバル,17:ボムゾウ / top5BackWork=3:ピグミィ / noReachFront=2:デスシープ,5:真勇者ダイン,6:デスシープ,9:ドノマンティス,14:真勇者ダイン,16:ポリスピナー,18:ドノマンティス,19:デスシープ
- next turn: attack:player_front_right:ダイン斬り->master:cpu / focus:player_front_left / attack:player_front_left:attack->master:cpu / focus:player_back_left / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは38点差で見送り
- board: PF:ポリスピナー Lv1 HP3 / PF:真勇者ダイン Lv1 HP6 / PB:ピグミィ Lv2 HP3

### front_role_allowed_by_range: ボムゾウ seed 136409 turn 4

- variant/opponent: `current_search_terminal_w4` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role front / front ポリスピナー Lv2 HP3 / stones after 2 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: top=attack:+26 attack:cpu_front_right:attack->master:player / nonSummon=attack:+26 attack:cpu_front_right:attack->master:player / attack=attack:+26 attack:cpu_front_right:attack->master:player / focus=- / end=end_turn:+633.9 end_turn / move=- / frontSummon=- / topSummon=summon:+34.4 summon:cpu_polyspinner_3->cpu_back_right [ポリスピナー->cpu_back_right behind ポリスピナー HP3]
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ピグミィ,2:ヤンバル,6:ボムゾウ,14:ピグミィ,17:ボムゾウ,19:ピグミィ / top5BackWork=1:ピグミィ,2:ヤンバル / noReachFront=3:ポリスピナー,8:デスシープ,11:真勇者ダイン,13:デスシープ,15:ドノマンティス,16:ドノマンティス,18:真勇者ダイン,21:デスシープ
- next turn: attack:cpu_front_right:attack->monster:player_front_right / end_turn
- reason: カードを後列右へ召喚 / 見送り: 攻撃は26点差で見送り、召喚は34点差で見送り
- board: PF:ボムゾウ Lv1 HP6 prep / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv3 HP6 / CF:ポリスピナー Lv2 HP3 / CB:ヤンバル Lv1 HP3

### blocked_no_pattern_move_forward: ポリスピナー seed 136410 turn 12

- variant/opponent: `current_search_terminal_w4` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front ボムゾウ Lv1 HP6 / stones after 1 / score 26
- flags: no-backline-pattern, next-move-front, very-low-stone, win
- alternatives: top=summon:+0 summon:player_polyspinner_1->player_back_right [ポリスピナー->player_back_right behind ポリスピナー HP3] / nonSummon=master_action:+57.6 master:shield->monster:player_front_right / attack=- / focus=- / end=end_turn:+215.5 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_polyspinner_1->player_back_right [ポリスピナー->player_back_right behind ポリスピナー HP3]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=14 / backWork=7:ピグミィ,10:ボムゾウ,12:ピグミィ / top5BackWork=- / noReachFront=1:デスシープ,4:真勇者ダイン,6:デスシープ,8:ドノマンティス,9:ドノマンティス,11:真勇者ダイン,14:デスシープ
- next turn: master:master_attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_left:storm_bomb->monster:cpu_front_right / move:player_back_left->player_front_right / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、マスター特技は58点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ポリスピナー Lv2 HP3 / CF:ボムゾウ Lv2 HP5

### blocked_no_pattern_move_forward: ポリスピナー seed 136411 turn 9

- variant/opponent: `current_search_terminal_w4` vs `white_current_mirror` (cpu, loss)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 2 / score 26
- flags: no-backline-pattern, next-move-front, loss
- alternatives: top=summon:+0 summon:cpu_polyspinner_1->cpu_back_right [ポリスピナー->cpu_back_right behind ボムゾウ HP4] / nonSummon=end_turn:+260.8 end_turn / attack=- / focus=- / end=end_turn:+260.8 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:cpu_polyspinner_1->cpu_back_right [ポリスピナー->cpu_back_right behind ボムゾウ HP4]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=16 / backWork=2:ヤンバル,6:ヤンバル,9:ボムゾウ,13:ピグミィ,14:ボムゾウ / top5BackWork=2:ヤンバル / noReachFront=1:真勇者ダイン,4:デスシープ,7:ポリスピナー,8:ドノマンティス,10:デスシープ,12:デスシープ,16:ドノマンティス
- next turn: attack:cpu_front_left:ダイン斬り->monster:player_front_left / summon:cpu_card_047_3->cpu_back_right / move:cpu_back_left->cpu_front_right / focus:cpu_front_right / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:ボムゾウ Lv1 HP6 prep / PB:ピグミィ Lv2 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv1 HP4


## Notes

- この監査は前衛/後衛ラベルだけではなく、後列から攻撃できるパターンを別扱いにする。
- ボムゾウのような射程持ちは `Backline Pattern` 側に入り、今回の抑制候補からは外す。
- 前が詰まった後列に、後列攻撃パターンを持たないカードを置く例が一定数ある。ここだけを抑える候補は検証価値がある。
- 詰まり後列召喚が次自ターンの攻撃/前進に変換されない例が多い。召喚の盤面評価だけでなく次ターン仕事予定が必要。
- 詰まり後列召喚の多くは射程持ちカードでもあるため、一律ペナルティは避けるべき。
- 35点以内の近い非召喚代替は少なくても、100点以内なら存在する例が多い。召喚を禁止するより、非召喚側の局面評価を押し上げる余地がある。
- bad summon の代替召喚が同じカードに寄っている。カード選択より、同カードを左右後列に置く予約召喚そのものを疑うべき。
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
