# White Backline Summon Audit Loop

生成: 2026-06-29T10:32:16.546Z
seedStart: 136400
候補: current_white_baseline
相手: black_1375_pressure
試行: 4 games/matchup/direction
総試合: 8

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 78
- 後列召喚: 52 (66.7%)
- 前列あり後列召喚: 38 (73.1%)
- うち前衛ロール: 18 (47.4%)
- デスシープ後列召喚: 2 (5.3%)
- デスシープ特技封じ損: 0 (0%) / W-L 0-0
- デスシープ特技封じ平均コマンド数: 0
- Backline patternあり: 22 (57.9%)
- Backline patternなし: 16 (42.1%)
- 次自ターン攻撃: 10 (26.3%)
- 次自ターン後列攻撃: 10 (26.3%)
- 次自ターン前進: 0 (0%)
- 次自ターン仕事なし: 28 (73.7%)
- Bad blocked summon: 16 (42.1%)
- Bad with evaluation trace: 16 (100%)
- Bad with non-summon alt: 16 (100%)
- Bad close non-summon alt: 6 (37.5%)
- Bad medium non-summon alt <=100: 13 (81.3%)
- Bad distant non-summon alt <=200: 14 (87.5%)
- Bad avg best non-summon gap: 83.2
- Bad top summon alt: 7 (43.8%)
- Bad top summon same card: 4 (57.1%)
- Bad top summon backline pattern: 1 (14.3%)
- Bad with other backline work in hand: 1 (6.3%)
- Bad consumes last back slot: 16 (100%)
- Bad leaves no empty back slot: 16 (100%)
- Avg no-reach front cards in back after bad: 1.38
- Bad with deck backline work: 16 (100%)
- Bad with deck top5 backline work: 15 (93.8%)
- Bad consumes last back slot with deck backline work: 16 (100%)
- Avg deck backline work cards after bad: 6.56
- Avg deck top5 backline work cards after bad: 1.88

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Death Sheep Lock | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_white_baseline | 3-5-0 | 78 | 52 (66.7%) | 38 (73.1%) | 18 (47.4%) | 0 (0%) | 22 (57.9%) | 16 (42.1%) | 10 (26.3%) | 10 (26.3%) | 0 (0%) | 28 (73.7%) | 16 (42.1%) | 6 (37.5%) | Atk4, Focus3, End2, OtherSum6, SameCard4, ReachSum1, NoReachSum6, NonSum10013, HandReach1, DeckReach16, DeckTop5Reach15, LastBack16, NoEmptyBack16 | 15 (39.5%) | 17/21 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Death Sheep Lock | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | black_1375_pressure | 3-5-0 | 38 | 0 (0%) | 22 (57.9%) | 16 (42.1%) | 28 (73.7%) | 16 (42.1%) | 6 (37.5%) |

## Samples

### blocked_backline_pattern_worked: ピグミィ seed 136400 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: top=focus:+2 focus:player_front_left / nonSummon=focus:+2 focus:player_front_left / attack=- / focus=focus:+2 focus:player_front_left / end=end_turn:+238.3 end_turn / move=- / frontSummon=- / topSummon=-
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
- alternatives: top=attack:+52.7 attack:player_front_left:self_bomb->master:cpu / nonSummon=attack:+52.7 attack:player_front_left:self_bomb->master:cpu / attack=attack:+52.7 attack:player_front_left:self_bomb->master:cpu / focus=focus:+142.3 focus:player_front_right / end=end_turn:+114.3 end_turn / move=- / frontSummon=- / topSummon=-
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
- alternatives: top=attack:+52.7 attack:player_front_left:self_bomb->master:cpu / nonSummon=attack:+52.7 attack:player_front_left:self_bomb->master:cpu / attack=attack:+52.7 attack:player_front_left:self_bomb->master:cpu / focus=focus:+142.3 focus:player_front_right / end=end_turn:+114.3 end_turn / move=- / frontSummon=- / topSummon=-
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
- alternatives: top=focus:+7.2 focus:player_back_left / nonSummon=focus:+7.2 focus:player_back_left / attack=- / focus=focus:+7.2 focus:player_back_left / end=end_turn:+318.5 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=1:ピグミィ,3:ヤンバル,5:ピグミィ,8:ヤンバル,12:ボムゾウ,14:ボムゾウ,19:ヤンバル,23:ボムゾウ / top5BackWork=1:ピグミィ,3:ヤンバル,5:ピグミィ / noReachFront=7:真勇者ダイン,9:ポリスピナー,10:ポリスピナー,11:ドノマンティス,16:ポリスピナー,18:デスシープ,20:ドノマンティス,21:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:player_front_right:attack->monster:cpu_front_right / magic:player_card_031_1->monster:cpu_back_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_left / ...
- reason: デスシープを空き枠へ召喚 / 見送り: ためるは7点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:ナッツロックル Lv1 HP6 prep / CF:ボムゾウ Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### bad_blocked_close_non_summon_alt: デスシープ seed 136401 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 25
- flags: no-backline-pattern, next-no-work, loss
- alternatives: top=focus:+7.2 focus:player_back_left / nonSummon=focus:+7.2 focus:player_back_left / attack=- / focus=focus:+7.2 focus:player_back_left / end=end_turn:+318.5 end_turn / move=- / frontSummon=- / topSummon=-
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
- alternatives: top=attack:+105.5 attack:player_front_left:スパイクボール->monster:cpu_back_left / nonSummon=attack:+105.5 attack:player_front_left:スパイクボール->monster:cpu_back_left / attack=attack:+105.5 attack:player_front_left:スパイクボール->monster:cpu_back_left / focus=- / end=end_turn:+849.4 end_turn / move=move:+194.6 move:player_front_left->player_back_left / frontSummon=- / topSummon=-
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
- alternatives: top=summon:+0 summon:player_polyspinner_2->player_back_left [ポリスピナー->player_back_left behind ヤンバル HP3] / nonSummon=master_action:+28.6 master:master_attack->monster:cpu_front_left / attack=attack:+124.9 attack:player_back_right:wild_claw->monster:cpu_front_left / focus=- / end=end_turn:+732.6 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_polyspinner_2->player_back_left [ポリスピナー->player_back_left behind ヤンバル HP3]
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=15 / backWork=2:ボムゾウ,4:ボムゾウ,9:ヤンバル,13:ボムゾウ / top5BackWork=2:ボムゾウ,4:ボムゾウ / noReachFront=1:ドノマンティス,6:ポリスピナー,8:デスシープ,10:ドノマンティス,11:真勇者ダイン,14:真勇者ダイン,15:真勇者ダイン
- special lock: -
- next turn: move:player_front_left->player_back_left / master:master_attack->monster:cpu_front_right / attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->master:cpu / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、マスター特技は29点差で見送り
- board: PF:ヤンバル Lv2 HP3 / PF:デスシープ Lv2 HP6 / PB:ヤンバル Lv1 HP3 / CF:ボムゾウ Lv1 HP4 / CB:ユニフォーン Lv1 HP5 prep

### bad_blocked_close_non_summon_alt: ポリスピナー seed 136401 turn 12

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ヤンバル Lv2 HP3 / stones after 9 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: top=summon:+0 summon:player_polyspinner_2->player_back_left [ポリスピナー->player_back_left behind ヤンバル HP3] / nonSummon=master_action:+28.6 master:master_attack->monster:cpu_front_left / attack=attack:+124.9 attack:player_back_right:wild_claw->monster:cpu_front_left / focus=- / end=end_turn:+732.6 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:player_polyspinner_2->player_back_left [ポリスピナー->player_back_left behind ヤンバル HP3]
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
- alternatives: top=summon:+1 summon:player_card_051_2->player_back_right [ピグミィ->player_back_right behind ボムゾウ HP6] / nonSummon=focus:+2.4 focus:player_front_left / attack=- / focus=focus:+2.4 focus:player_front_left / end=end_turn:+241.5 end_turn / move=- / frontSummon=- / topSummon=summon:+1 summon:player_card_051_2->player_back_right [ピグミィ->player_back_right behind ボムゾウ HP6]
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
- alternatives: top=summon:+39.4 summon:player_polyspinner_3->player_back_right [ポリスピナー->player_back_right behind ドノマンティス HP5] / nonSummon=end_turn:+356.7 end_turn / attack=- / focus=- / end=end_turn:+356.7 end_turn / move=- / frontSummon=- / topSummon=summon:+39.4 summon:player_polyspinner_3->player_back_right [ポリスピナー->player_back_right behind ドノマンティス HP5]
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
- alternatives: top=summon:+0 summon:player_polyspinner_2->player_back_right [ポリスピナー->player_back_right behind 真勇者ダイン HP6] / nonSummon=attack:+80.1 attack:player_front_right:ダイン斬り->monster:cpu_front_right / attack=attack:+80.1 attack:player_front_right:ダイン斬り->monster:cpu_front_right / focus=focus:+135.7 focus:player_back_left / end=- / move=move:+101.7 move:player_back_left->player_front_left / frontSummon=- / topSummon=summon:+0 summon:player_polyspinner_2->player_back_right [ポリスピナー->player_back_right behind 真勇者ダイン HP6]
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
- alternatives: top=attack:+41.5 attack:player_front_left:attack->master:cpu / nonSummon=attack:+41.5 attack:player_front_left:attack->master:cpu / attack=attack:+41.5 attack:player_front_left:attack->master:cpu / focus=- / end=end_turn:+253.4 end_turn / move=move:+397.2 move:player_back_right->player_front_left / frontSummon=- / topSummon=-
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
- alternatives: top=focus:+7.7 focus:player_front_left / nonSummon=focus:+7.7 focus:player_front_left / attack=attack:+187.2 attack:player_front_right:スパイクボール->monster:cpu_back_right / focus=focus:+7.7 focus:player_front_left / end=end_turn:+309.2 end_turn / move=move:+58.1 move:player_front_right->player_back_left / frontSummon=- / topSummon=summon:+65.1 summon:player_yanbaru_3->player_back_left [ヤンバル->player_back_left behind ドノマンティス HP5]
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
- alternatives: top=attack:+51.8 attack:player_front_left:attack->monster:cpu_front_left / nonSummon=attack:+51.8 attack:player_front_left:attack->monster:cpu_front_left / attack=attack:+51.8 attack:player_front_left:attack->monster:cpu_front_left / focus=focus:+352.7 focus:player_front_left / end=- / move=move:+367 move:player_front_right->player_back_right / frontSummon=- / topSummon=-
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
- alternatives: top=summon:+2.6 summon:cpu_card_037_1->cpu_back_right [ドノマンティス->cpu_back_right behind デスシープ HP6] / nonSummon=- / attack=- / focus=- / end=- / move=- / frontSummon=summon:+38.2 summon:cpu_yanbaru_3->cpu_front_left [ヤンバル->cpu_front_left] / topSummon=summon:+2.6 summon:cpu_card_037_1->cpu_back_right [ドノマンティス->cpu_back_right behind デスシープ HP6]
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
- alternatives: top=end_turn:+279.8 end_turn / nonSummon=end_turn:+279.8 end_turn / attack=- / focus=- / end=end_turn:+279.8 end_turn / move=- / frontSummon=- / topSummon=-
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
- alternatives: top=summon:+0 summon:cpu_bomuzo_2->cpu_back_right [ボムゾウ->cpu_back_right behind 真勇者ダイン HP3] / nonSummon=master_action:+31.5 master:master_attack->monster:player_front_left / attack=- / focus=- / end=end_turn:+282.1 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:cpu_bomuzo_2->cpu_back_right [ボムゾウ->cpu_back_right behind 真勇者ダイン HP3]
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
- alternatives: top=end_turn:+199.1 end_turn / nonSummon=end_turn:+199.1 end_turn / attack=- / focus=- / end=end_turn:+199.1 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=16 / backWork=1:ボムゾウ,2:ピグミィ,7:ボムゾウ,12:ヤンバル,14:ピグミィ / top5BackWork=1:ボムゾウ,2:ピグミィ / noReachFront=3:ドノマンティス,4:真勇者ダイン,5:ポリスピナー,9:デスシープ,10:ポリスピナー,15:デスシープ,16:ドノマンティス
- special lock: -
- next turn: attack:cpu_front_right:ダイン斬り->monster:player_front_right / attack:cpu_front_left:attack->master:player / focus:cpu_back_right / master:shield->monster:cpu_front_left / ...
- reason: カードを後列右へ召喚
- board: PB:ピグミィ Lv1 HP3 prep / PB:ヤンバル Lv1 HP3 / CF:デスシープ Lv2 HP6 / CF:真勇者ダイン Lv3 HP6 / CB:ボムゾウ Lv1 HP6

### bad_blocked_close_non_summon_alt: ドノマンティス seed 136406 turn 3

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv3 HP6 / stones after 1 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: top=summon:+0 summon:cpu_card_037_3->cpu_back_left [ドノマンティス->cpu_back_left behind 真勇者ダイン HP6] / nonSummon=master_action:+25.3 master:shield->monster:cpu_front_right / attack=- / focus=- / end=end_turn:+216.4 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:cpu_card_037_3->cpu_back_left [ドノマンティス->cpu_back_left behind 真勇者ダイン HP6]
- hand pressure: backWork=- / noReachFront=ポリスピナー,ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=2:ピグミィ,3:ボムゾウ,9:ヤンバル,13:ピグミィ,14:ボムゾウ,15:ピグミィ,18:ボムゾウ / top5BackWork=2:ピグミィ,3:ボムゾウ / noReachFront=1:真勇者ダイン,6:ポリスピナー,8:真勇者ダイン,12:ポリスピナー,17:ドノマンティス,19:デスシープ,22:デスシープ
- special lock: -
- next turn: attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_front_right:attack->master:player / summon:cpu_card_047_3->cpu_back_right / focus:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は23点差で見送り
- board: PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv3 HP6 / CF:デスシープ Lv1 HP4 / CB:ヤンバル Lv2 HP3

### low_stone_blocked_no_work: ドノマンティス seed 136406 turn 3

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv3 HP6 / stones after 1 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: top=summon:+0 summon:cpu_card_037_3->cpu_back_left [ドノマンティス->cpu_back_left behind 真勇者ダイン HP6] / nonSummon=master_action:+25.3 master:shield->monster:cpu_front_right / attack=- / focus=- / end=end_turn:+216.4 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:cpu_card_037_3->cpu_back_left [ドノマンティス->cpu_back_left behind 真勇者ダイン HP6]
- hand pressure: backWork=- / noReachFront=ポリスピナー,ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=2:ピグミィ,3:ボムゾウ,9:ヤンバル,13:ピグミィ,14:ボムゾウ,15:ピグミィ,18:ボムゾウ / top5BackWork=2:ピグミィ,3:ボムゾウ / noReachFront=1:真勇者ダイン,6:ポリスピナー,8:真勇者ダイン,12:ポリスピナー,17:ドノマンティス,19:デスシープ,22:デスシープ
- special lock: -
- next turn: attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_front_right:attack->master:player / summon:cpu_card_047_3->cpu_back_right / focus:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は23点差で見送り
- board: PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv3 HP6 / CF:デスシープ Lv1 HP4 / CB:ヤンバル Lv2 HP3

### bad_blocked_close_non_summon_alt: ポリスピナー seed 136407 turn 3

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front ボムゾウ Lv1 HP4 / stones after 0 / score 26
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: top=summon:+0 summon:cpu_polyspinner_2->cpu_back_left [ポリスピナー->cpu_back_left behind ボムゾウ HP4] / nonSummon=focus:+29.9 focus:cpu_back_right / attack=- / focus=focus:+29.9 focus:cpu_back_right / end=end_turn:+246.6 end_turn / move=- / frontSummon=- / topSummon=summon:+0 summon:cpu_polyspinner_2->cpu_back_left [ポリスピナー->cpu_back_left behind ボムゾウ HP4]
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=2:ピグミィ,5:ピグミィ,9:ヤンバル,14:ヤンバル,17:ヤンバル,19:ボムゾウ / top5BackWork=2:ピグミィ,5:ピグミィ / noReachFront=4:デスシープ,7:真勇者ダイン,8:デスシープ,11:ドノマンティス,16:真勇者ダイン,18:ポリスピナー,20:ドノマンティス,21:デスシープ
- special lock: -
- next turn: attack:cpu_front_right:ダイン斬り->monster:player_front_right / focus:cpu_front_left / summon:cpu_polyspinner_2->cpu_back_right / focus:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、ためるは30点差で見送り
- board: PF:ナッツロックル Lv1 HP3 / CF:ボムゾウ Lv1 HP4 / CF:ドノマンティス Lv1 HP1 / CB:真勇者ダイン Lv1 HP6

### bad_blocked_close_non_summon_alt: ポリスピナー seed 136407 turn 4

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front 真勇者ダイン Lv2 HP6 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=focus:+8.7 focus:cpu_back_left / nonSummon=focus:+8.7 focus:cpu_back_left / attack=- / focus=focus:+8.7 focus:cpu_back_left / end=end_turn:+268.6 end_turn / move=- / frontSummon=- / topSummon=-
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ピグミィ,4:ピグミィ,8:ヤンバル,13:ヤンバル,16:ヤンバル,18:ボムゾウ / top5BackWork=1:ピグミィ,4:ピグミィ / noReachFront=3:デスシープ,6:真勇者ダイン,7:デスシープ,10:ドノマンティス,15:真勇者ダイン,17:ポリスピナー,19:ドノマンティス,20:デスシープ
- special lock: -
- next turn: master:master_attack->monster:player_front_left / attack:cpu_front_left:self_bomb->monster:player_front_left / focus:cpu_front_right / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: ためるは9点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 prep / PB:真勇者ダイン Lv1 HP6 prep / PB:ポリスピナー Lv1 HP3 prep / CF:ボムゾウ Lv1 HP4 / CF:真勇者ダイン Lv2 HP6 / CB:ポリスピナー Lv1 HP3


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
- `Death Sheep Lock`: デスシープを後列に置いたことで、同レーン味方前列の下段特技を封じたケース。
- `No Work`: 次自ターンにその召喚ユニットが攻撃も前進もしなかったケース。
- `Bad`: Blocked + No Pattern + No Work を満たす、今回もっとも疑う後列召喚。
- `Close Non-Summon`: Bad の局面で、選択召喚から35点以内に攻撃/ためる/移動/終了などの非召喚代替があったケース。
- `Medium Non-Summon`: Bad の局面で、選択召喚から100点以内に非召喚代替があったケース。
- `DeckReach`: Bad の局面で、残り山札に後列から仕事できるカードが残っていたケース。
- `DeckTop5Reach`: Bad の局面で、山札上位5枚に後列から仕事できるカードが残っていたケース。
