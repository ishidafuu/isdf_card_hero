# White Backline Summon Audit Loop

生成: 2026-06-29T03:53:05.104Z
seedStart: 136400
候補: current_back_slot_future_value80
相手: black_1375_pressure, white_current_mirror
試行: 1 games/matchup/direction
総試合: 4

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 51
- 後列召喚: 26 (51%)
- 前列あり後列召喚: 19 (73.1%)
- うち前衛ロール: 9 (47.4%)
- Backline patternあり: 12 (63.2%)
- Backline patternなし: 7 (36.8%)
- 次自ターン攻撃: 6 (31.6%)
- 次自ターン後列攻撃: 6 (31.6%)
- 次自ターン前進: 0 (0%)
- 次自ターン仕事なし: 13 (68.4%)
- Bad blocked summon: 7 (36.8%)
- Bad with evaluation trace: 7 (100%)
- Bad close non-summon alt: 2 (28.6%)
- Bad top summon alt: 7 (100%)
- Bad top summon same card: 6 (85.7%)
- Bad top summon backline pattern: 0 (0%)
- Bad with other backline work in hand: 0 (0%)
- Bad consumes last back slot: 2 (28.6%)
- Bad leaves no empty back slot: 2 (28.6%)
- Avg no-reach front cards in back after bad: 1

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_back_slot_future_value80 | 2-2-0 | 51 | 26 (51%) | 19 (73.1%) | 9 (47.4%) | 12 (63.2%) | 7 (36.8%) | 6 (31.6%) | 6 (31.6%) | 0 (0%) | 13 (68.4%) | 7 (36.8%) | 2 (28.6%) | FrontSum1, OtherSum6, SameCard6, NoReachSum7, LastBack2, NoEmptyBack2 | 7 (36.8%) | 11/8 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_back_slot_future_value80 | black_1375_pressure | 1-1-0 | 10 | 5 (50%) | 5 (50%) | 8 (80%) | 5 (50%) | 1 (20%) |
| current_back_slot_future_value80 | white_current_mirror | 1-1-0 | 9 | 7 (77.8%) | 2 (22.2%) | 5 (55.6%) | 2 (22.2%) | 1 (50%) |

## Samples

### blocked_backline_pattern_worked: ピグミィ seed 136400 turn 2

- variant/opponent: `current_back_slot_future_value80` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: top=focus:+2 focus:player_front_left / nonSummon=focus:+2 focus:player_front_left / attack=- / focus=focus:+2 focus:player_front_left / end=end_turn:+238.3 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは2点差で見送り、ためるは2点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ナッツロックル Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_no_pattern_no_work: デスシープ seed 136400 turn 12

- variant/opponent: `current_back_slot_future_value80` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv1 HP3 / stones after 2 / score 25
- flags: no-backline-pattern, next-no-work, loss
- alternatives: top=summon:+0 summon:player_card_133_2->player_back_right [デスシープ->player_back_right behind デスシープ HP4] / nonSummon=attack:+34.4 attack:player_front_left:attack->master:cpu / attack=attack:+34.4 attack:player_front_left:attack->master:cpu / focus=- / end=end_turn:+281.2 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_card_133_2->player_back_right [デスシープ->player_back_right behind デスシープ HP4]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- next turn: focus:player_front_left / master:wake_up->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / focus:player_front_right / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は34点差で見送り
- board: PF:ポリスピナー Lv1 HP3 / PF:デスシープ Lv1 HP4 / CB:ヤンバル Lv1 HP2

### bad_blocked_close_non_summon_alt: デスシープ seed 136400 turn 12

- variant/opponent: `current_back_slot_future_value80` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv1 HP3 / stones after 2 / score 25
- flags: no-backline-pattern, next-no-work, loss
- alternatives: top=summon:+0 summon:player_card_133_2->player_back_right [デスシープ->player_back_right behind デスシープ HP4] / nonSummon=attack:+34.4 attack:player_front_left:attack->master:cpu / attack=attack:+34.4 attack:player_front_left:attack->master:cpu / focus=- / end=end_turn:+281.2 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_card_133_2->player_back_right [デスシープ->player_back_right behind デスシープ HP4]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- next turn: focus:player_front_left / master:wake_up->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / focus:player_front_right / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は34点差で見送り
- board: PF:ポリスピナー Lv1 HP3 / PF:デスシープ Lv1 HP4 / CB:ヤンバル Lv1 HP2

### blocked_no_pattern_no_work: ドノマンティス seed 136400 turn 13

- variant/opponent: `current_back_slot_future_value80` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv2 HP3 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: top=summon:+0 summon:player_card_037_3->player_back_right [ドノマンティス->player_back_right behind デスシープ HP4] / nonSummon=end_turn:+295.7 end_turn / attack=- / focus=- / end=end_turn:+295.7 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_card_037_3->player_back_right [ドノマンティス->player_back_right behind デスシープ HP4]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- next turn: magic:player_card_031_1->monster:cpu_back_right / attack:player_front_right:attack->monster:cpu_front_right / focus:player_front_left / master:shield->monster:player_front_right / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:ポリスピナー Lv2 HP3 / PF:デスシープ Lv1 HP4 / CF:真勇者ダイン Lv1 HP6 prep / CB:ヤンバル Lv1 HP2

### low_stone_blocked_no_work: ドノマンティス seed 136400 turn 13

- variant/opponent: `current_back_slot_future_value80` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv2 HP3 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: top=summon:+0 summon:player_card_037_3->player_back_right [ドノマンティス->player_back_right behind デスシープ HP4] / nonSummon=end_turn:+295.7 end_turn / attack=- / focus=- / end=end_turn:+295.7 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_card_037_3->player_back_right [ドノマンティス->player_back_right behind デスシープ HP4]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- next turn: magic:player_card_031_1->monster:cpu_back_right / attack:player_front_right:attack->monster:cpu_front_right / focus:player_front_left / master:shield->monster:player_front_right / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:ポリスピナー Lv2 HP3 / PF:デスシープ Lv1 HP4 / CF:真勇者ダイン Lv1 HP6 prep / CB:ヤンバル Lv1 HP2

### blocked_no_pattern_no_work: 真勇者ダイン seed 136400 turn 15

- variant/opponent: `current_back_slot_future_value80` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 28
- flags: no-backline-pattern, next-no-work, loss
- alternatives: top=summon:+0 summon:player_card_047_1->player_back_right [真勇者ダイン->player_back_right behind デスシープ HP3] / nonSummon=attack:+73.4 attack:player_front_left:attack->monster:cpu_front_left / attack=attack:+73.4 attack:player_front_left:attack->monster:cpu_front_left / focus=focus:+148.2 focus:player_front_right / end=end_turn:+211.1 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_card_047_1->player_back_right [真勇者ダイン->player_back_right behind デスシープ HP3]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- next turn: end_turn
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は73点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv1 HP3 / CF:ボムゾウ Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CB:ヤンバル Lv2 HP1

### blocked_backline_pattern_worked: ピグミィ seed 136401 turn 2

- variant/opponent: `current_back_slot_future_value80` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role back / front ヤンバル Lv1 HP3 / stones after 3 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=summon:+159.5 summon:cpu_bomuzo_3->cpu_back_right [ボムゾウ->cpu_back_right behind ヤンバル HP3] / nonSummon=master_action:+296.8 master:master_attack->monster:player_front_left / attack=- / focus=- / end=- / move=- / frontSummon=- / topSummon=summon:+159.5 summon:cpu_bomuzo_3->cpu_back_right [ボムゾウ->cpu_back_right behind ヤンバル HP3]
- hand pressure: backWork=ボムゾウ / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- next turn: move:cpu_front_right->cpu_back_right / attack:cpu_back_left:wild_claw->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / summon:cpu_bomuzo_3->cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は160点差で見送り、マスター特技は297点差で見送り
- board: PF:真勇者ダイン Lv1 HP1 / PF:ヤミー Lv1 HP4 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ヤンバル Lv1 HP3 / CB:ヤンバル Lv1 HP3

### blocked_no_pattern_no_work: 真勇者ダイン seed 136401 turn 7

- variant/opponent: `current_back_slot_future_value80` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front ピグミィ Lv2 HP3 / stones after 8 / score 28
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=summon:+86.2 summon:cpu_card_047_1->cpu_front_right [真勇者ダイン->cpu_front_right] / nonSummon=- / attack=- / focus=- / end=- / move=- / frontSummon=summon:+86.2 summon:cpu_card_047_1->cpu_front_right [真勇者ダイン->cpu_front_right] / topSummon=summon:+86.2 summon:cpu_card_047_1->cpu_front_right [真勇者ダイン->cpu_front_right]
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 2->1 / noReachBackAfter=1
- next turn: move:cpu_front_right->cpu_back_left / focus:cpu_front_left / master:shield->monster:cpu_front_left / end_turn
- reason: カードを後列左へ召喚 / 見送り: 召喚は86点差で見送り、召喚は87点差で見送り
- board: CF:ピグミィ Lv2 HP3

### blocked_no_pattern_no_work: デスシープ seed 136401 turn 9

- variant/opponent: `current_back_slot_future_value80` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front 真勇者ダイン Lv1 HP6 / stones after 9 / score 25
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=summon:+96.8 summon:cpu_card_133_2->cpu_back_left [デスシープ->cpu_back_left behind ドノマンティス HP5] / nonSummon=end_turn:+217.2 end_turn / attack=- / focus=- / end=end_turn:+217.2 end_turn / move=- / frontSummon=- / topSummon=summon:+96.8 summon:cpu_card_133_2->cpu_back_left [デスシープ->cpu_back_left behind ドノマンティス HP5]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- next turn: attack:cpu_front_left:呪いの刃->master:player / attack:cpu_front_right:ダイン斬り->master:player / summon:cpu_bomuzo_1->cpu_back_left / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は97点差で見送り
- board: CF:ドノマンティス Lv2 HP5 / CF:真勇者ダイン Lv1 HP6

### front_role_allowed_by_range: ボムゾウ seed 136401 turn 10

- variant/opponent: `current_back_slot_future_value80` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front ドノマンティス Lv2 HP5 / stones after 8 / score 23
- flags: backline-pattern, next-no-work, win
- alternatives: top=focus:+44.5 focus:cpu_back_right / nonSummon=focus:+44.5 focus:cpu_back_right / attack=- / focus=focus:+44.5 focus:cpu_back_right / end=end_turn:+250.1 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- next turn: attack:cpu_front_left:呪いの刃->monster:player_front_left / focus:cpu_front_right / focus:cpu_back_left / master:shield->monster:cpu_front_right / ...
- reason: カードを後列左へ召喚 / 見送り: ためるは45点差で見送り
- board: PF:ユニフォーン Lv1 HP5 prep / PB:ヤンバル Lv1 HP3 prep / CF:ドノマンティス Lv2 HP5 / CF:真勇者ダイン Lv1 HP6 / CB:デスシープ Lv1 HP6

### blocked_backline_pattern_worked: ヤンバル seed 136402 turn 2

- variant/opponent: `current_back_slot_future_value80` vs `white_current_mirror` (player, win)
- decision: player_back_right / role back / front ボムゾウ Lv1 HP6 / stones after 2 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=summon:+1 summon:player_card_051_2->player_back_right [ピグミィ->player_back_right behind ボムゾウ HP6] / nonSummon=focus:+14.4 focus:player_front_right / attack=- / focus=focus:+14.4 focus:player_front_right / end=end_turn:+410 end_turn / move=- / frontSummon=- / topSummon=summon:+1 summon:player_card_051_2->player_back_right [ピグミィ->player_back_right behind ボムゾウ HP6]
- hand pressure: backWork=ピグミィ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_back_left:wild_claw->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、ためるは14点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 prep / CB:真勇者ダイン Lv1 HP6 prep / CB:ドノマンティス Lv1 HP5 prep

### low_stone_blocked_no_work: ドノマンティス seed 136402 turn 20

- variant/opponent: `current_back_slot_future_value80` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front デスシープ Lv1 HP6 / stones after 1 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: top=summon:+23 summon:player_polyspinner_1->player_back_left [ポリスピナー->player_back_left behind デスシープ HP6] / nonSummon=end_turn:+124.6 end_turn / attack=- / focus=- / end=end_turn:+124.6 end_turn / move=- / frontSummon=- / topSummon=summon:+23 summon:player_polyspinner_1->player_back_left [ポリスピナー->player_back_left behind デスシープ HP6]
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- next turn: attack:player_front_right:呪いの刃->monster:cpu_front_right / focus:player_front_left / summon:player_bomuzo_2->player_back_right / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は23点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv2 HP5 / PB:ピグミィ Lv2 HP1 / CF:ヤンバル Lv2 HP3 / CB:ピグミィ Lv1 HP3

### blocked_backline_pattern_worked: ボムゾウ seed 136402 turn 21

- variant/opponent: `current_back_slot_future_value80` vs `white_current_mirror` (player, win)
- decision: player_back_right / role front / front ドノマンティス Lv2 HP5 / stones after 4 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=focus:+35.7 focus:player_back_left / nonSummon=focus:+35.7 focus:player_back_left / attack=- / focus=focus:+35.7 focus:player_back_left / end=end_turn:+163 end_turn / move=- / frontSummon=- / topSummon=summon:+194.4 summon:player_polyspinner_1->player_back_right [ポリスピナー->player_back_right behind ドノマンティス HP5]
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- next turn: attack:player_front_right:呪いの刃->monster:cpu_front_right / summon:player_polyspinner_1->player_back_left / attack:player_front_left:attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: ためるは36点差で見送り、召喚は194点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv2 HP5 / PB:ドノマンティス Lv1 HP5 / CB:ヤンバル Lv2 HP3

### front_role_allowed_by_range: ボムゾウ seed 136402 turn 21

- variant/opponent: `current_back_slot_future_value80` vs `white_current_mirror` (player, win)
- decision: player_back_right / role front / front ドノマンティス Lv2 HP5 / stones after 4 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=focus:+35.7 focus:player_back_left / nonSummon=focus:+35.7 focus:player_back_left / attack=- / focus=focus:+35.7 focus:player_back_left / end=end_turn:+163 end_turn / move=- / frontSummon=- / topSummon=summon:+194.4 summon:player_polyspinner_1->player_back_right [ポリスピナー->player_back_right behind ドノマンティス HP5]
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- next turn: attack:player_front_right:呪いの刃->monster:cpu_front_right / summon:player_polyspinner_1->player_back_left / attack:player_front_left:attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: ためるは36点差で見送り、召喚は194点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv2 HP5 / PB:ドノマンティス Lv1 HP5 / CB:ヤンバル Lv2 HP3

### bad_blocked_close_non_summon_alt: ポリスピナー seed 136402 turn 22

- variant/opponent: `current_back_slot_future_value80` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 6 / score 26
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=summon:+0 summon:player_polyspinner_2->player_back_left [ポリスピナー->player_back_left behind ドノマンティス HP5] / nonSummon=attack:+29.1 attack:player_front_left:attack->monster:cpu_front_left / attack=attack:+29.1 attack:player_front_left:attack->monster:cpu_front_left / focus=focus:+120.6 focus:player_back_right / end=end_turn:+107.4 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_polyspinner_2->player_back_left [ポリスピナー->player_back_left behind ドノマンティス HP5]
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- next turn: attack:player_front_right:呪いの刃->master:cpu / end_turn
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は29点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:ドノマンティス Lv2 HP5 / PB:ボムゾウ Lv1 HP6 / CF:デスシープ Lv1 HP6

### blocked_backline_pattern_worked: ピグミィ seed 136403 turn 2

- variant/opponent: `current_back_slot_future_value80` vs `white_current_mirror` (cpu, loss)
- decision: cpu_back_right / role back / front ボムゾウ Lv1 HP6 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: top=summon:+0 summon:cpu_card_051_2->cpu_back_right [ピグミィ->cpu_back_right behind ボムゾウ HP6] / nonSummon=master_action:+323.2 master:master_attack->monster:player_front_left / attack=- / focus=- / end=end_turn:+404.8 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:cpu_card_051_2->cpu_back_right [ピグミィ->cpu_back_right behind ボムゾウ HP6]
- hand pressure: backWork=ピグミィ,ピグミィ / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- next turn: attack:cpu_back_left:wild_claw->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_back_right:スパイクボール->monster:player_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、召喚は1点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ボムゾウ Lv1 HP6 / PB:真勇者ダイン Lv1 HP6 prep / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv1 HP6 / CB:ヤンバル Lv1 HP3


## Notes

- この監査は前衛/後衛ラベルだけではなく、後列から攻撃できるパターンを別扱いにする。
- ボムゾウのような射程持ちは `Backline Pattern` 側に入り、今回の抑制候補からは外す。
- 前が詰まった後列に、後列攻撃パターンを持たないカードを置く例が一定数ある。ここだけを抑える候補は検証価値がある。
- 詰まり後列召喚が次自ターンの攻撃/前進に変換されない例が多い。召喚の盤面評価だけでなく次ターン仕事予定が必要。
- 詰まり後列召喚の多くは射程持ちカードでもあるため、一律ペナルティは避けるべき。
- bad summon の代替召喚が同じカードに寄っている。カード選択より、同カードを左右後列に置く予約召喚そのものを疑うべき。
- bad summon の代替召喚も後列射程なしに寄っている。後列で仕事できるカードを優先する召喚候補品質の改善が必要。

## Next Loop Proposal

- 次は bad summon 局面で、後列射程なし前衛カード同士の召喚を避け、手札内に後列仕事カードがあるならそちらを優先する候補を作る。
- 候補 `whiteBlockedBacklineNoWorkSummonPenalty` は一括スクリーニングだけで判断せず、同一seed比較で勝率と `blocked_no_pattern_no_work` 減少が両立する値だけ中母数確認する。
- ボムゾウ等の射程持ちを許容できているか、サンプルで `front_role_allowed_by_range` を確認する。

## Reading

- `Blocked`: 同レーン前列に自軍ユニットがいる後列召喚。
- `Backline Pattern`: 後列から攻撃しうる射程/攻撃パターンをカードが持つ。ボムゾウ系はここに入る。
- `No Pattern`: 後列から攻撃しにくいカード。ここが多い場合だけ抑制候補にする。
- `No Work`: 次自ターンにその召喚ユニットが攻撃も前進もしなかったケース。
- `Bad`: Blocked + No Pattern + No Work を満たす、今回もっとも疑う後列召喚。
- `Close Non-Summon`: Bad の局面で、選択召喚から35点以内に攻撃/ためる/移動/終了などの非召喚代替があったケース。
