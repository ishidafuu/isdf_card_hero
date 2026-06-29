# White Backline Summon Audit Loop

生成: 2026-06-29T05:13:53.557Z
seedStart: 136400
候補: current_white_baseline
相手: black_1375_pressure, white_current_mirror
試行: 1 games/matchup/direction
総試合: 4

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 40
- 後列召喚: 21 (52.5%)
- 前列あり後列召喚: 14 (66.7%)
- うち前衛ロール: 5 (35.7%)
- Backline patternあり: 10 (71.4%)
- Backline patternなし: 4 (28.6%)
- 次自ターン攻撃: 6 (42.9%)
- 次自ターン後列攻撃: 6 (42.9%)
- 次自ターン前進: 0 (0%)
- 次自ターン仕事なし: 8 (57.1%)
- Bad blocked summon: 4 (28.6%)
- Bad with evaluation trace: 4 (100%)
- Bad with non-summon alt: 4 (100%)
- Bad close non-summon alt: 1 (25%)
- Bad medium non-summon alt <=100: 2 (50%)
- Bad distant non-summon alt <=200: 2 (50%)
- Bad avg best non-summon gap: 154
- Bad top summon alt: 4 (100%)
- Bad top summon same card: 4 (100%)
- Bad top summon backline pattern: 0 (0%)
- Bad with other backline work in hand: 0 (0%)
- Bad consumes last back slot: 0 (0%)
- Bad leaves no empty back slot: 0 (0%)
- Avg no-reach front cards in back after bad: 1
- Bad with deck backline work: 4 (100%)
- Bad with deck top5 backline work: 1 (25%)
- Bad consumes last back slot with deck backline work: 0 (0%)
- Avg deck backline work cards after bad: 4
- Avg deck top5 backline work cards after bad: 0.25

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_white_baseline | 2-2-0 | 40 | 21 (52.5%) | 14 (66.7%) | 5 (35.7%) | 10 (71.4%) | 4 (28.6%) | 6 (42.9%) | 6 (42.9%) | 0 (0%) | 8 (57.1%) | 4 (28.6%) | 1 (25%) | OtherSum4, SameCard4, NoReachSum4, NonSum1002, DeckReach4, DeckTop5Reach1 | 7 (50%) | 7/7 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | black_1375_pressure | 1-1-0 | 9 | 5 (55.6%) | 4 (44.4%) | 7 (77.8%) | 4 (44.4%) | 1 (25%) |
| current_white_baseline | white_current_mirror | 1-1-0 | 5 | 5 (100%) | 0 (0%) | 1 (20%) | 0 (0%) | 0 (0%) |

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

### blocked_no_pattern_no_work: デスシープ seed 136400 turn 12

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv1 HP3 / stones after 2 / score 0
- flags: no-backline-pattern, next-no-work, loss
- alternatives: top=summon:+0 summon:player_card_133_2->player_back_right [デスシープ->player_back_right behind デスシープ HP4] / nonSummon=attack:+22.9 attack:player_front_left:attack->master:cpu / attack=attack:+22.9 attack:player_front_left:attack->master:cpu / focus=- / end=end_turn:+256.2 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_card_133_2->player_back_right [デスシープ->player_back_right behind デスシープ HP4]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=15 / backWork=11:ヤンバル,12:ボムゾウ,13:ピグミィ,14:ヤンバル / top5BackWork=- / noReachFront=1:ドノマンティス,3:真勇者ダイン,4:真勇者ダイン,5:ポリスピナー,6:ポリスピナー,8:ドノマンティス,10:デスシープ,15:真勇者ダイン
- next turn: focus:player_front_left / master:wake_up->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / focus:player_front_right / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は23点差で見送り
- board: PF:ポリスピナー Lv1 HP3 / PF:デスシープ Lv1 HP4 / CB:ヤンバル Lv1 HP2

### bad_blocked_close_non_summon_alt: デスシープ seed 136400 turn 12

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv1 HP3 / stones after 2 / score 0
- flags: no-backline-pattern, next-no-work, loss
- alternatives: top=summon:+0 summon:player_card_133_2->player_back_right [デスシープ->player_back_right behind デスシープ HP4] / nonSummon=attack:+22.9 attack:player_front_left:attack->master:cpu / attack=attack:+22.9 attack:player_front_left:attack->master:cpu / focus=- / end=end_turn:+256.2 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_card_133_2->player_back_right [デスシープ->player_back_right behind デスシープ HP4]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=15 / backWork=11:ヤンバル,12:ボムゾウ,13:ピグミィ,14:ヤンバル / top5BackWork=- / noReachFront=1:ドノマンティス,3:真勇者ダイン,4:真勇者ダイン,5:ポリスピナー,6:ポリスピナー,8:ドノマンティス,10:デスシープ,15:真勇者ダイン
- next turn: focus:player_front_left / master:wake_up->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / focus:player_front_right / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は23点差で見送り
- board: PF:ポリスピナー Lv1 HP3 / PF:デスシープ Lv1 HP4 / CB:ヤンバル Lv1 HP2

### blocked_no_pattern_no_work: ドノマンティス seed 136400 turn 13

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv2 HP3 / stones after 0 / score -1
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: top=summon:+0 summon:player_card_037_3->player_back_right [ドノマンティス->player_back_right behind デスシープ HP4] / nonSummon=end_turn:+270.7 end_turn / attack=- / focus=- / end=end_turn:+270.7 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_card_037_3->player_back_right [ドノマンティス->player_back_right behind デスシープ HP4]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=15 / backWork=10:ヤンバル,11:ボムゾウ,12:ピグミィ,13:ヤンバル / top5BackWork=- / noReachFront=2:真勇者ダイン,3:真勇者ダイン,4:ポリスピナー,5:ポリスピナー,7:ドノマンティス,9:デスシープ,14:真勇者ダイン,15:デスシープ
- next turn: magic:player_card_031_1->monster:cpu_back_right / attack:player_front_right:attack->monster:cpu_front_right / focus:player_front_left / master:shield->monster:player_front_right / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:ポリスピナー Lv2 HP3 / PF:デスシープ Lv1 HP4 / CF:真勇者ダイン Lv1 HP6 prep / CB:ヤンバル Lv1 HP2

### low_stone_blocked_no_work: ドノマンティス seed 136400 turn 13

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv2 HP3 / stones after 0 / score -1
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: top=summon:+0 summon:player_card_037_3->player_back_right [ドノマンティス->player_back_right behind デスシープ HP4] / nonSummon=end_turn:+270.7 end_turn / attack=- / focus=- / end=end_turn:+270.7 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_card_037_3->player_back_right [ドノマンティス->player_back_right behind デスシープ HP4]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=15 / backWork=10:ヤンバル,11:ボムゾウ,12:ピグミィ,13:ヤンバル / top5BackWork=- / noReachFront=2:真勇者ダイン,3:真勇者ダイン,4:ポリスピナー,5:ポリスピナー,7:ドノマンティス,9:デスシープ,14:真勇者ダイン,15:デスシープ
- next turn: magic:player_card_031_1->monster:cpu_back_right / attack:player_front_right:attack->monster:cpu_front_right / focus:player_front_left / master:shield->monster:player_front_right / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:ポリスピナー Lv2 HP3 / PF:デスシープ Lv1 HP4 / CF:真勇者ダイン Lv1 HP6 prep / CB:ヤンバル Lv1 HP2

### blocked_no_pattern_no_work: 真勇者ダイン seed 136400 turn 15

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 3
- flags: no-backline-pattern, next-no-work, loss
- alternatives: top=summon:+0 summon:player_card_047_1->player_back_right [真勇者ダイン->player_back_right behind デスシープ HP3] / nonSummon=attack:+50.2 attack:player_front_left:attack->monster:cpu_front_left / attack=attack:+50.2 attack:player_front_left:attack->monster:cpu_front_left / focus=focus:+123.2 focus:player_front_right / end=end_turn:+186.1 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_card_047_1->player_back_right [真勇者ダイン->player_back_right behind デスシープ HP3]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=13 / backWork=8:ヤンバル,9:ボムゾウ,10:ピグミィ,11:ヤンバル / top5BackWork=- / noReachFront=1:真勇者ダイン,2:ポリスピナー,3:ポリスピナー,5:ドノマンティス,7:デスシープ,12:真勇者ダイン,13:デスシープ
- next turn: end_turn
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は50点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv1 HP3 / CF:ボムゾウ Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CB:ヤンバル Lv2 HP1

### blocked_backline_pattern_worked: ピグミィ seed 136401 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role back / front ヤンバル Lv1 HP3 / stones after 3 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=summon:+159.5 summon:cpu_bomuzo_3->cpu_back_right [ボムゾウ->cpu_back_right behind ヤンバル HP3] / nonSummon=master_action:+296.8 master:master_attack->monster:player_front_left / attack=- / focus=- / end=- / move=- / frontSummon=- / topSummon=summon:+159.5 summon:cpu_bomuzo_3->cpu_back_right [ボムゾウ->cpu_back_right behind ヤンバル HP3]
- hand pressure: backWork=ボムゾウ / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=3:ピグミィ,8:ボムゾウ,13:ヤンバル,18:ボムゾウ,21:ピグミィ / top5BackWork=3:ピグミィ / noReachFront=1:ポリスピナー,2:真勇者ダイン,7:デスシープ,9:真勇者ダイン,10:デスシープ,11:ポリスピナー,14:ドノマンティス,16:デスシープ,...(+2)
- next turn: move:cpu_front_right->cpu_back_right / attack:cpu_back_left:wild_claw->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / summon:cpu_bomuzo_3->cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は160点差で見送り、マスター特技は297点差で見送り
- board: PF:真勇者ダイン Lv1 HP1 / PF:ヤミー Lv1 HP4 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ヤンバル Lv1 HP3 / CB:ヤンバル Lv1 HP3

### blocked_no_pattern_no_work: デスシープ seed 136401 turn 9

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front 真勇者ダイン Lv1 HP6 / stones after 9 / score 0
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=summon:+96.8 summon:cpu_card_133_2->cpu_back_left [デスシープ->cpu_back_left behind ドノマンティス HP5] / nonSummon=end_turn:+272.2 end_turn / attack=- / focus=- / end=end_turn:+272.2 end_turn / move=- / frontSummon=- / topSummon=summon:+96.8 summon:cpu_card_133_2->cpu_back_left [デスシープ->cpu_back_left behind ドノマンティス HP5]
- hand pressure: backWork=- / noReachFront=- / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=17 / backWork=1:ボムゾウ,6:ヤンバル,11:ボムゾウ,14:ピグミィ / top5BackWork=1:ボムゾウ / noReachFront=2:真勇者ダイン,3:デスシープ,4:ポリスピナー,7:ドノマンティス,9:デスシープ,10:ドノマンティス,12:ポリスピナー,17:ポリスピナー
- next turn: attack:cpu_front_left:呪いの刃->master:player / attack:cpu_front_right:ダイン斬り->master:player / summon:cpu_bomuzo_1->cpu_back_left / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は97点差で見送り
- board: CF:ドノマンティス Lv2 HP5 / CF:真勇者ダイン Lv1 HP6

### front_role_allowed_by_range: ボムゾウ seed 136401 turn 10

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front ドノマンティス Lv2 HP5 / stones after 8 / score 23
- flags: backline-pattern, next-no-work, win
- alternatives: top=focus:+44.5 focus:cpu_back_right / nonSummon=focus:+44.5 focus:cpu_back_right / attack=- / focus=focus:+44.5 focus:cpu_back_right / end=end_turn:+250.1 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=16 / backWork=5:ヤンバル,10:ボムゾウ,13:ピグミィ / top5BackWork=5:ヤンバル / noReachFront=1:真勇者ダイン,2:デスシープ,3:ポリスピナー,6:ドノマンティス,8:デスシープ,9:ドノマンティス,11:ポリスピナー,16:ポリスピナー
- next turn: attack:cpu_front_left:呪いの刃->monster:player_front_left / focus:cpu_front_right / focus:cpu_back_left / master:shield->monster:cpu_front_right / ...
- reason: カードを後列左へ召喚 / 見送り: ためるは45点差で見送り
- board: PF:ユニフォーン Lv1 HP5 prep / PB:ヤンバル Lv1 HP3 prep / CF:ドノマンティス Lv2 HP5 / CF:真勇者ダイン Lv1 HP6 / CB:デスシープ Lv1 HP6

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

### blocked_backline_pattern_worked: ピグミィ seed 136402 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_right / role back / front ヤンバル Lv1 HP3 / stones after 1 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, very-low-stone, win
- alternatives: top=attack:+83.5 attack:player_front_right:wild_claw->monster:cpu_front_left / nonSummon=attack:+83.5 attack:player_front_right:wild_claw->monster:cpu_front_left / attack=attack:+83.5 attack:player_front_right:wild_claw->monster:cpu_front_left / focus=focus:+420.2 focus:player_front_right / end=end_turn:+938.2 end_turn / move=move:+406.2 move:player_front_right->player_back_right / frontSummon=- / topSummon=summon:+127.8 summon:player_card_047_1->player_back_right [真勇者ダイン->player_back_right behind ヤンバル HP3]
- hand pressure: backWork=- / noReachFront=ポリスピナー,真勇者ダイン / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ピグミィ,6:ボムゾウ,11:ヤンバル,16:ボムゾウ,19:ピグミィ / top5BackWork=1:ピグミィ / noReachFront=5:デスシープ,7:真勇者ダイン,8:デスシープ,9:ポリスピナー,12:ドノマンティス,14:デスシープ,15:ドノマンティス,17:ポリスピナー
- next turn: attack:player_back_left:wild_claw->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / attack:player_front_left:ダイン斬り->master:cpu / move:player_front_right->player_back_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 攻撃は84点差で見送り、召喚は128点差で見送り
- board: PF:真勇者ダイン Lv2 HP6 / PF:ヤンバル Lv1 HP3 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP2 / CB:ポリスピナー Lv1 HP3 / CB:ポリスピナー Lv1 HP3 prep

### blocked_backline_pattern_worked: ピグミィ seed 136403 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, loss)
- decision: cpu_back_right / role back / front ボムゾウ Lv1 HP6 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: top=summon:+0 summon:cpu_card_051_2->cpu_back_right [ピグミィ->cpu_back_right behind ボムゾウ HP6] / nonSummon=master_action:+323.2 master:master_attack->monster:player_front_left / attack=- / focus=- / end=end_turn:+404.8 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:cpu_card_051_2->cpu_back_right [ピグミィ->cpu_back_right behind ボムゾウ HP6]
- hand pressure: backWork=ピグミィ,ピグミィ / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=5:ヤンバル,11:ボムゾウ,16:ボムゾウ,17:ヤンバル / top5BackWork=5:ヤンバル / noReachFront=2:真勇者ダイン,3:ドノマンティス,8:ポリスピナー,13:デスシープ,15:ポリスピナー,18:ポリスピナー,19:デスシープ,21:ドノマンティス,...(+2)
- next turn: attack:cpu_back_left:wild_claw->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_back_right:スパイクボール->monster:player_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、召喚は1点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ボムゾウ Lv1 HP6 / PB:真勇者ダイン Lv1 HP6 prep / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv1 HP6 / CB:ヤンバル Lv1 HP3


## Notes

- この監査は前衛/後衛ラベルだけではなく、後列から攻撃できるパターンを別扱いにする。
- ボムゾウのような射程持ちは `Backline Pattern` 側に入り、今回の抑制候補からは外す。
- 前が詰まった後列に、後列攻撃パターンを持たないカードを置く例が一定数ある。ここだけを抑える候補は検証価値がある。
- 詰まり後列召喚が次自ターンの攻撃/前進に変換されない例が多い。召喚の盤面評価だけでなく次ターン仕事予定が必要。
- 詰まり後列召喚の多くは射程持ちカードでもあるため、一律ペナルティは避けるべき。
- 35点以内の近い非召喚代替は少なくても、100点以内なら存在する例が多い。召喚を禁止するより、非召喚側の局面評価を押し上げる余地がある。
- bad summon の代替召喚が同じカードに寄っている。カード選択より、同カードを左右後列に置く予約召喚そのものを疑うべき。
- bad summon の代替召喚も後列射程なしに寄っている。後列で仕事できるカードを優先する召喚候補品質の改善が必要。
- bad summon 時点で山札上位5枚に後列仕事カードが残る例がある。近い将来の配置詰まりとして優先度を上げて見るべき。

## Next Loop Proposal

- 次候補は、bad summon で100点以内の非召喚代替がある局面に絞り、後列枠保存・次ターン配置余地を非召喚側の評価へ足す。
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
