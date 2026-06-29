# White Backline Summon Audit Loop

生成: 2026-06-29T14:53:25.421Z
seedStart: 136820
候補: current_white_baseline, current_last_back_slot_no_reach_guard35
相手: decoy_back_stable
試行: 2 games/matchup/direction
総試合: 8

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 74
- 後列召喚: 47 (63.5%)
- 前列あり後列召喚: 35 (74.5%)
- うち前衛ロール: 18 (51.4%)
- デスシープ後列召喚: 1 (2.9%)
- デスシープ特技封じ損: 1 (100%) / W-L 1-0
- デスシープ特技封じ平均コマンド数: 1
- Backline patternあり: 23 (65.7%)
- Backline patternなし: 12 (34.3%)
- 次自ターン攻撃: 8 (22.9%)
- 次自ターン後列攻撃: 8 (22.9%)
- 次自ターン前進: 1 (2.9%)
- 次自ターン仕事なし: 26 (74.3%)
- Bad blocked summon: 11 (31.4%)
- Bad with evaluation trace: 0 (0%)
- Bad with non-summon alt: 0 (0%)
- Bad close non-summon alt: 0 (0%)
- Bad medium non-summon alt <=100: 0 (0%)
- Bad distant non-summon alt <=200: 0 (0%)
- Bad avg best non-summon gap: 0
- Bad top summon alt: 0 (0%)
- Bad top summon same card: 0 (0%)
- Bad top summon backline pattern: 0 (0%)
- Bad with other backline work in hand: 1 (9.1%)
- Bad consumes last back slot: 9 (81.8%)
- Bad leaves no empty back slot: 9 (81.8%)
- Avg no-reach front cards in back after bad: 1.27
- Bad with deck backline work: 11 (100%)
- Bad with deck top5 backline work: 11 (100%)
- Bad consumes last back slot with deck backline work: 9 (81.8%)
- Avg deck backline work cards after bad: 5.45
- Avg deck top5 backline work cards after bad: 2

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Death Sheep Lock | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_white_baseline | 3-0-1 | 32 | 20 (62.5%) | 13 (65%) | 4 (30.8%) | 1 (100%) | 9 (69.2%) | 4 (30.8%) | 5 (38.5%) | 5 (38.5%) | 0 (0%) | 8 (61.5%) | 4 (30.8%) | 0 (0%) | DeckReach4, DeckTop5Reach4, LastBack4, NoEmptyBack4 | 8 (61.5%) | 10/0 |
| current_last_back_slot_no_reach_guard35 | 3-0-1 | 42 | 27 (64.3%) | 22 (81.5%) | 14 (63.6%) | 0 (0%) | 14 (63.6%) | 8 (36.4%) | 3 (13.6%) | 3 (13.6%) | 1 (4.5%) | 18 (81.8%) | 7 (31.8%) | 0 (0%) | HandReach1, DeckReach7, DeckTop5Reach7, LastBack5, NoEmptyBack5 | 8 (36.4%) | 17/0 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Death Sheep Lock | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | decoy_back_stable | 3-0-1 | 13 | 1 (100%) | 9 (69.2%) | 4 (30.8%) | 8 (61.5%) | 4 (30.8%) | 0 (0%) |
| current_last_back_slot_no_reach_guard35 | decoy_back_stable | 3-0-1 | 22 | 0 (0%) | 14 (63.6%) | 8 (36.4%) | 18 (81.8%) | 7 (31.8%) | 0 (0%) |

## Samples

### blocked_no_pattern_no_work: ドノマンティス seed 136820 turn 3

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=1:ピグミィ,9:ボムゾウ,10:ヤンバル,15:ピグミィ,18:ボムゾウ,19:ヤンバル,21:ピグミィ / top5BackWork=1:ピグミィ / noReachFront=3:ドノマンティス,4:ポリスピナー,6:真勇者ダイン,8:ポリスピナー,11:真勇者ダイン,13:デスシープ,14:デスシープ,16:デスシープ,...(+2)
- special lock: -
- next turn: attack:player_front_right:self_bomb->monster:cpu_front_right / attack:player_back_left:wild_claw->monster:cpu_front_right / master:master_attack->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / ...
- reason: ドノマンティスを空き枠へ召喚
- board: PF:真勇者ダイン Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv2 HP3 / CF:ヒートロン Lv1 HP5 / CB:ホロウダイン Lv1 HP5 / CB:ラティーヌ Lv1 HP4 prep

### bad_blocked_no_eval_trace: ドノマンティス seed 136820 turn 3

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=1:ピグミィ,9:ボムゾウ,10:ヤンバル,15:ピグミィ,18:ボムゾウ,19:ヤンバル,21:ピグミィ / top5BackWork=1:ピグミィ / noReachFront=3:ドノマンティス,4:ポリスピナー,6:真勇者ダイン,8:ポリスピナー,11:真勇者ダイン,13:デスシープ,14:デスシープ,16:デスシープ,...(+2)
- special lock: -
- next turn: attack:player_front_right:self_bomb->monster:cpu_front_right / attack:player_back_left:wild_claw->monster:cpu_front_right / master:master_attack->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / ...
- reason: ドノマンティスを空き枠へ召喚
- board: PF:真勇者ダイン Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv2 HP3 / CF:ヒートロン Lv1 HP5 / CB:ホロウダイン Lv1 HP5 / CB:ラティーヌ Lv1 HP4 prep

### low_stone_blocked_no_work: ドノマンティス seed 136820 turn 3

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=1:ピグミィ,9:ボムゾウ,10:ヤンバル,15:ピグミィ,18:ボムゾウ,19:ヤンバル,21:ピグミィ / top5BackWork=1:ピグミィ / noReachFront=3:ドノマンティス,4:ポリスピナー,6:真勇者ダイン,8:ポリスピナー,11:真勇者ダイン,13:デスシープ,14:デスシープ,16:デスシープ,...(+2)
- special lock: -
- next turn: attack:player_front_right:self_bomb->monster:cpu_front_right / attack:player_back_left:wild_claw->monster:cpu_front_right / master:master_attack->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / ...
- reason: ドノマンティスを空き枠へ召喚
- board: PF:真勇者ダイン Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv2 HP3 / CF:ヒートロン Lv1 HP5 / CB:ホロウダイン Lv1 HP5 / CB:ラティーヌ Lv1 HP4 prep

### low_stone_blocked_no_work: ピグミィ seed 136820 turn 7

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 1 / score 67
- flags: backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=5:ボムゾウ,6:ヤンバル,11:ピグミィ,14:ボムゾウ,15:ヤンバル,17:ピグミィ / top5BackWork=5:ボムゾウ / noReachFront=2:真勇者ダイン,4:ポリスピナー,7:真勇者ダイン,9:デスシープ,10:デスシープ,12:デスシープ,13:ポリスピナー,16:ドノマンティス
- special lock: -
- next turn: attack:player_front_left:ダイン斬り->master:cpu / attack:player_back_left:wild_claw->master:cpu / master:shield->monster:player_front_right / end_turn
- reason: 後衛カードを後列右へ召喚 / 見送り: マスター特技は89点差で見送り、召喚は89点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv2 HP3 / CB:ゾンビ Lv1 HP4

### blocked_no_pattern_no_work: ポリスピナー seed 136821 turn 2

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (player, draw)
- decision: player_back_right / role front / front デスシープ Lv1 HP6 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ピグミィ,7:ピグミィ,8:ヤンバル,10:ヤンバル,11:ピグミィ,17:ボムゾウ,19:ヤンバル,20:ボムゾウ,...(+1) / top5BackWork=2:ピグミィ / noReachFront=4:ドノマンティス,9:ポリスピナー,12:真勇者ダイン,14:ポリスピナー,15:デスシープ,18:デスシープ,21:ドノマンティス,23:ドノマンティス
- special lock: -
- next turn: focus:player_front_left / focus:player_front_right / focus:player_back_right / focus:player_back_left / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:真勇者ダイン Lv1 HP6 / CF:アンノウン Lv1 HP5 prep / CF:神斬丸 Lv1 HP5 prep / CB:フーヨウ Lv1 HP3 prep

### bad_blocked_no_eval_trace: ポリスピナー seed 136821 turn 2

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (player, draw)
- decision: player_back_right / role front / front デスシープ Lv1 HP6 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ピグミィ,7:ピグミィ,8:ヤンバル,10:ヤンバル,11:ピグミィ,17:ボムゾウ,19:ヤンバル,20:ボムゾウ,...(+1) / top5BackWork=2:ピグミィ / noReachFront=4:ドノマンティス,9:ポリスピナー,12:真勇者ダイン,14:ポリスピナー,15:デスシープ,18:デスシープ,21:ドノマンティス,23:ドノマンティス
- special lock: -
- next turn: focus:player_front_left / focus:player_front_right / focus:player_back_right / focus:player_back_left / ...
- reason: ポリスピナーを空き枠へ召喚
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:真勇者ダイン Lv1 HP6 / CF:アンノウン Lv1 HP5 prep / CF:神斬丸 Lv1 HP5 prep / CB:フーヨウ Lv1 HP3 prep

### blocked_backline_pattern_worked: ピグミィ seed 136821 turn 4

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (player, draw)
- decision: player_back_right / role back / front デスシープ Lv1 HP6 / stones after 0 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, very-low-stone, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=5:ピグミィ,6:ヤンバル,8:ヤンバル,9:ピグミィ,15:ボムゾウ,17:ヤンバル,18:ボムゾウ,20:ボムゾウ / top5BackWork=5:ピグミィ / noReachFront=2:ドノマンティス,7:ポリスピナー,10:真勇者ダイン,12:ポリスピナー,13:デスシープ,16:デスシープ,19:ドノマンティス,21:ドノマンティス
- special lock: -
- next turn: attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / focus:player_front_right / attack:player_front_left:attack->master:cpu / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 攻撃は87点差で見送り、移動は253点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ポリスピナー Lv1 HP3 / CF:神斬丸 Lv1 HP5 / CB:フーヨウ Lv1 HP3 / CB:フーヨウ Lv1 HP3

### blocked_backline_pattern_worked: ピグミィ seed 136822 turn 1

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_right / role back / front ボムゾウ Lv1 HP6 prep / stones after 0 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=ピグミィ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ヤンバル,8:ピグミィ,10:ボムゾウ,13:ボムゾウ,19:ヤンバル / top5BackWork=2:ヤンバル / noReachFront=1:デスシープ,3:デスシープ,4:ポリスピナー,5:ポリスピナー,7:ドノマンティス,11:真勇者ダイン,16:真勇者ダイン,18:真勇者ダイン,...(+4)
- special lock: -
- next turn: focus:cpu_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_left / move:cpu_front_left->cpu_back_left / attack:cpu_back_right:スパイクボール->monster:player_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、召喚は92点差で見送り
- board: PF:アンノウン Lv1 HP5 prep / PF:神斬丸 Lv1 HP5 prep / PB:フーヨウ Lv1 HP3 prep / CF:ボムゾウ Lv1 HP6 prep / CB:ヤンバル Lv1 HP3 prep

### low_stone_blocked_no_work: ヤンバル seed 136822 turn 4

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_right / role back / front ピグミィ Lv1 HP3 / stones after 0 / score 68
- flags: backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=ピグミィ / noReachFront=デスシープ / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=5:ピグミィ,7:ボムゾウ,10:ボムゾウ,16:ヤンバル / top5BackWork=5:ピグミィ / noReachFront=1:ポリスピナー,2:ポリスピナー,4:ドノマンティス,8:真勇者ダイン,13:真勇者ダイン,15:真勇者ダイン,18:ドノマンティス,19:ポリスピナー,...(+2)
- special lock: -
- next turn: attack:cpu_front_right:wild_claw->monster:player_back_left / attack:cpu_front_left:attack->master:player / summon:cpu_card_051_1->cpu_back_right / master:shield->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は4点差で見送り、攻撃は95点差で見送り
- board: PF:神斬丸 Lv1 HP5 / PB:フーヨウ Lv1 HP3 / PB:フーヨウ Lv1 HP3 / CF:デスシープ Lv1 HP6 / CF:ピグミィ Lv1 HP3 / CB:ヤンバル Lv2 HP3

### blocked_backline_pattern_worked: ピグミィ seed 136822 turn 5

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_right / role back / front ヤンバル Lv2 HP3 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=デスシープ,ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=4:ピグミィ,6:ボムゾウ,9:ボムゾウ,15:ヤンバル / top5BackWork=4:ピグミィ / noReachFront=1:ポリスピナー,3:ドノマンティス,7:真勇者ダイン,12:真勇者ダイン,14:真勇者ダイン,17:ドノマンティス,18:ポリスピナー,19:デスシープ,...(+1)
- special lock: -
- next turn: attack:cpu_front_right:wild_claw->monster:player_back_right / attack:cpu_front_left:wild_claw->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 攻撃は106点差で見送り、召喚は123点差で見送り
- board: PF:ヒートロン Lv1 HP4 / PF:神斬丸 Lv2 HP5 / PB:フーヨウ Lv1 HP3 / CF:デスシープ Lv1 HP6 / CF:ヤンバル Lv2 HP3 / CB:ヤンバル Lv2 HP3

### blocked_no_pattern_no_work: デスシープ seed 136822 turn 6

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_left / role front / front ヤンバル Lv2 HP3 / stones after 1 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=3:ピグミィ,5:ボムゾウ,8:ボムゾウ,14:ヤンバル / top5BackWork=3:ピグミィ,5:ボムゾウ / noReachFront=2:ドノマンティス,6:真勇者ダイン,11:真勇者ダイン,13:真勇者ダイン,16:ドノマンティス,17:ポリスピナー,18:デスシープ,19:ドノマンティス
- special lock: ヤンバル Lv2: ワイルドクロウ
- next turn: master:wake_up->monster:player_back_left / attack:cpu_front_right:wild_claw->monster:player_back_left / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_back_right:スパイクボール->monster:player_front_left / ...
- reason: カードを後列左へ召喚 / 見送り: マスター特技は14点差で見送り、召喚は36点差で見送り
- board: PF:ヒートロン Lv1 HP4 / PB:ヒートロン Lv1 HP5 prep / CF:ヤンバル Lv2 HP3 / CF:ヤンバル Lv2 HP3 / CB:ピグミィ Lv2 HP3

### bad_blocked_no_eval_trace: デスシープ seed 136822 turn 6

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_left / role front / front ヤンバル Lv2 HP3 / stones after 1 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=3:ピグミィ,5:ボムゾウ,8:ボムゾウ,14:ヤンバル / top5BackWork=3:ピグミィ,5:ボムゾウ / noReachFront=2:ドノマンティス,6:真勇者ダイン,11:真勇者ダイン,13:真勇者ダイン,16:ドノマンティス,17:ポリスピナー,18:デスシープ,19:ドノマンティス
- special lock: ヤンバル Lv2: ワイルドクロウ
- next turn: master:wake_up->monster:player_back_left / attack:cpu_front_right:wild_claw->monster:player_back_left / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_back_right:スパイクボール->monster:player_front_left / ...
- reason: カードを後列左へ召喚 / 見送り: マスター特技は14点差で見送り、召喚は36点差で見送り
- board: PF:ヒートロン Lv1 HP4 / PB:ヒートロン Lv1 HP5 prep / CF:ヤンバル Lv2 HP3 / CF:ヤンバル Lv2 HP3 / CB:ピグミィ Lv2 HP3

### death_sheep_special_lock: デスシープ seed 136822 turn 6

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_left / role front / front ヤンバル Lv2 HP3 / stones after 1 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=3:ピグミィ,5:ボムゾウ,8:ボムゾウ,14:ヤンバル / top5BackWork=3:ピグミィ,5:ボムゾウ / noReachFront=2:ドノマンティス,6:真勇者ダイン,11:真勇者ダイン,13:真勇者ダイン,16:ドノマンティス,17:ポリスピナー,18:デスシープ,19:ドノマンティス
- special lock: ヤンバル Lv2: ワイルドクロウ
- next turn: master:wake_up->monster:player_back_left / attack:cpu_front_right:wild_claw->monster:player_back_left / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_back_right:スパイクボール->monster:player_front_left / ...
- reason: カードを後列左へ召喚 / 見送り: マスター特技は14点差で見送り、召喚は36点差で見送り
- board: PF:ヒートロン Lv1 HP4 / PB:ヒートロン Lv1 HP5 prep / CF:ヤンバル Lv2 HP3 / CF:ヤンバル Lv2 HP3 / CB:ピグミィ Lv2 HP3

### low_stone_blocked_no_work: デスシープ seed 136822 turn 6

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_left / role front / front ヤンバル Lv2 HP3 / stones after 1 / score 25
- flags: no-backline-pattern, death-sheep-special-lock, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=3:ピグミィ,5:ボムゾウ,8:ボムゾウ,14:ヤンバル / top5BackWork=3:ピグミィ,5:ボムゾウ / noReachFront=2:ドノマンティス,6:真勇者ダイン,11:真勇者ダイン,13:真勇者ダイン,16:ドノマンティス,17:ポリスピナー,18:デスシープ,19:ドノマンティス
- special lock: ヤンバル Lv2: ワイルドクロウ
- next turn: master:wake_up->monster:player_back_left / attack:cpu_front_right:wild_claw->monster:player_back_left / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_back_right:スパイクボール->monster:player_front_left / ...
- reason: カードを後列左へ召喚 / 見送り: マスター特技は14点差で見送り、召喚は36点差で見送り
- board: PF:ヒートロン Lv1 HP4 / PB:ヒートロン Lv1 HP5 prep / CF:ヤンバル Lv2 HP3 / CF:ヤンバル Lv2 HP3 / CB:ピグミィ Lv2 HP3

### blocked_no_pattern_no_work: ポリスピナー seed 136822 turn 7

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_left / role front / front デスシープ Lv1 HP6 / stones after 3 / score 26
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=2:ピグミィ,4:ボムゾウ,7:ボムゾウ,13:ヤンバル / top5BackWork=2:ピグミィ,4:ボムゾウ / noReachFront=1:ドノマンティス,5:真勇者ダイン,10:真勇者ダイン,12:真勇者ダイン,15:ドノマンティス,16:ポリスピナー,17:デスシープ,18:ドノマンティス
- special lock: -
- next turn: attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_back_right:wild_claw->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / focus:cpu_front_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、マスター特技は328点差で見送り
- board: PF:ヒートロン Lv1 HP5 / CF:デスシープ Lv1 HP6 / CF:ヤンバル Lv2 HP3 / CB:ピグミィ Lv2 HP3

### bad_blocked_no_eval_trace: ポリスピナー seed 136822 turn 7

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_left / role front / front デスシープ Lv1 HP6 / stones after 3 / score 26
- flags: no-backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=2:ピグミィ,4:ボムゾウ,7:ボムゾウ,13:ヤンバル / top5BackWork=2:ピグミィ,4:ボムゾウ / noReachFront=1:ドノマンティス,5:真勇者ダイン,10:真勇者ダイン,12:真勇者ダイン,15:ドノマンティス,16:ポリスピナー,17:デスシープ,18:ドノマンティス
- special lock: -
- next turn: attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_back_right:wild_claw->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / focus:cpu_front_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、マスター特技は328点差で見送り
- board: PF:ヒートロン Lv1 HP5 / CF:デスシープ Lv1 HP6 / CF:ヤンバル Lv2 HP3 / CB:ピグミィ Lv2 HP3

### blocked_backline_pattern_worked: ヤンバル seed 136823 turn 6

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_left / role back / front 真勇者ダイン Lv1 HP6 / stones after 5 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ,ピグミィ / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=2:ピグミィ,6:ボムゾウ,11:ヤンバル / top5BackWork=2:ピグミィ / noReachFront=3:デスシープ,5:ポリスピナー,8:デスシープ,10:ドノマンティス,12:ポリスピナー,13:真勇者ダイン,16:ドノマンティス,18:デスシープ,...(+1)
- special lock: -
- next turn: attack:cpu_front_right:wild_claw->monster:player_back_right / summon:cpu_card_051_1->cpu_back_right / attack:cpu_back_left:wild_claw->monster:player_front_right / master:master_attack->monster:player_front_right / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: 攻撃は1点差で見送り、召喚は1点差で見送り
- board: PF:ラティーヌ Lv2 HP4 / PF:真勇者ダイン Lv1 HP6 prep / PB:バルキャノン Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:真勇者ダイン Lv3 HP6 / CB:ヤンバル Lv1 HP3

### blocked_backline_pattern_worked: ピグミィ seed 136823 turn 12

- variant/opponent: `current_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_right / role back / front ピグミィ Lv1 HP3 / stones after 5 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=デスシープ,ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=13 / backWork=5:ヤンバル / top5BackWork=5:ヤンバル / noReachFront=2:デスシープ,4:ドノマンティス,6:ポリスピナー,7:真勇者ダイン,10:ドノマンティス,12:デスシープ,13:ドノマンティス
- special lock: -
- next turn: attack:cpu_back_right:スパイクボール->monster:player_front_right / end_turn
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は75点差で見送り、召喚は77点差で見送り
- board: PF:ナッツロックル Lv1 HP6 prep / CF:真勇者ダイン Lv1 HP6 / CF:ピグミィ Lv1 HP3 / CB:ヤンバル Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 136824 turn 4

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `decoy_back_stable` (player, draw)
- decision: player_back_left / role front / front ヤンバル Lv1 HP3 / stones after 6 / score 23
- flags: backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=真勇者ダイン,ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=2:ピグミィ,3:ヤンバル,5:ピグミィ,9:ボムゾウ,14:ヤンバル / top5BackWork=2:ピグミィ,3:ヤンバル,5:ピグミィ / noReachFront=6:デスシープ,8:ポリスピナー,11:デスシープ,13:ドノマンティス,15:ポリスピナー,16:真勇者ダイン,19:ドノマンティス,21:デスシープ,...(+1)
- special lock: -
- next turn: summon:player_card_047_2->player_back_left / attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_front_left:self_bomb->monster:cpu_front_left / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 攻撃は60点差で見送り、召喚は93点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:ボムゾウ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:ヒートロン Lv1 HP5 / CF:ナッツロックル Lv1 HP6 / CB:フーヨウ Lv1 HP1

### blocked_no_pattern_no_work: 真勇者ダイン seed 136824 turn 5

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `decoy_back_stable` (player, draw)
- decision: player_back_left / role front / front ボムゾウ Lv1 HP6 / stones after 8 / score 28
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ピグミィ,2:ヤンバル,4:ピグミィ,8:ボムゾウ,13:ヤンバル / top5BackWork=1:ピグミィ,2:ヤンバル,4:ピグミィ / noReachFront=5:デスシープ,7:ポリスピナー,10:デスシープ,12:ドノマンティス,14:ポリスピナー,15:真勇者ダイン,18:ドノマンティス,20:デスシープ,...(+1)
- special lock: -
- next turn: attack:player_back_right:スパイクボール->monster:cpu_front_right / attack:player_front_left:storm_bomb->monster:cpu_front_right / focus:player_back_left / focus:player_back_right / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 攻撃は48点差で見送り、召喚は50点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv1 HP3 / CF:ヒートロン Lv1 HP5 / CF:ナッツロックル Lv1 HP6 / CB:神斬丸 Lv1 HP5 prep

### bad_blocked_no_eval_trace: 真勇者ダイン seed 136824 turn 5

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `decoy_back_stable` (player, draw)
- decision: player_back_left / role front / front ボムゾウ Lv1 HP6 / stones after 8 / score 28
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ピグミィ,2:ヤンバル,4:ピグミィ,8:ボムゾウ,13:ヤンバル / top5BackWork=1:ピグミィ,2:ヤンバル,4:ピグミィ / noReachFront=5:デスシープ,7:ポリスピナー,10:デスシープ,12:ドノマンティス,14:ポリスピナー,15:真勇者ダイン,18:ドノマンティス,20:デスシープ,...(+1)
- special lock: -
- next turn: attack:player_back_right:スパイクボール->monster:cpu_front_right / attack:player_front_left:storm_bomb->monster:cpu_front_right / focus:player_back_left / focus:player_back_right / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 攻撃は48点差で見送り、召喚は50点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv1 HP3 / CF:ヒートロン Lv1 HP5 / CF:ナッツロックル Lv1 HP6 / CB:神斬丸 Lv1 HP5 prep

### front_role_allowed_by_range: ボムゾウ seed 136824 turn 13

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `decoy_back_stable` (player, draw)
- decision: player_back_left / role front / front ピグミィ Lv1 HP3 / stones after 3 / score 23
- flags: backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=13 / backWork=5:ヤンバル / top5BackWork=5:ヤンバル / noReachFront=2:デスシープ,4:ドノマンティス,6:ポリスピナー,7:真勇者ダイン,10:ドノマンティス,12:デスシープ,13:ドノマンティス
- special lock: -
- next turn: focus:player_front_left / focus:player_back_left / focus:player_front_right / magic:player_card_031_1->monster:cpu_back_left / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 移動は11点差で見送り、移動は32点差で見送り
- board: PF:ピグミィ Lv1 HP3 / PF:デスシープ Lv1 HP6 / PB:真勇者ダイン Lv1 HP5 / CF:ラティーヌ Lv1 HP4 / CF:ゾンビ Lv1 HP1 / CB:ラティーヌ Lv1 HP4 prep / CB:神斬丸 Lv1 HP5

### low_stone_blocked_no_work: ドノマンティス seed 136825 turn 5

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `decoy_back_stable` (player, win)
- decision: player_back_right / role front / front 真勇者ダイン Lv3 HP6 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ヤンバル,2:ボムゾウ,4:ボムゾウ,6:ヤンバル,9:ピグミィ,12:ピグミィ,21:ピグミィ / top5BackWork=1:ヤンバル,2:ボムゾウ,4:ボムゾウ / noReachFront=5:デスシープ,7:ドノマンティス,8:ポリスピナー,11:ポリスピナー,13:ポリスピナー,14:デスシープ,15:デスシープ,16:ドノマンティス,...(+2)
- special lock: -
- next turn: attack:player_back_left:wild_claw->monster:cpu_front_left / attack:player_front_left:self_bomb->monster:cpu_front_left / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは18点差で見送り、攻撃は339点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:真勇者ダイン Lv3 HP6 / PB:ヤンバル Lv2 HP3 / CF:グングニエル Lv1 HP5 / CB:ナッツロックル Lv1 HP6 / CB:ラティーヌ Lv1 HP4 prep

### front_role_allowed_by_range: ボムゾウ seed 136825 turn 9

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `decoy_back_stable` (player, win)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 1 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, very-low-stone, win
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=2:ヤンバル,5:ピグミィ,8:ピグミィ,17:ピグミィ / top5BackWork=2:ヤンバル,5:ピグミィ / noReachFront=1:デスシープ,3:ドノマンティス,4:ポリスピナー,7:ポリスピナー,9:ポリスピナー,10:デスシープ,11:デスシープ,12:ドノマンティス,...(+2)
- special lock: -
- next turn: focus:player_front_left / move:player_front_right->player_back_right / attack:player_back_left:storm_bomb->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、マスター特技は182点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv3 HP4 / PB:ヤンバル Lv1 HP3 / CF:ヒートロン Lv1 HP5 / CB:ナッツロックル Lv1 HP6 / CB:ヒートロン Lv1 HP5 prep

### front_role_allowed_by_range: ボムゾウ seed 136826 turn 4

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_right / role front / front ボムゾウ Lv2 HP3 / stones after 3 / score 23
- flags: backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=2:ヤンバル,4:ピグミィ,7:ピグミィ,10:ヤンバル,11:ピグミィ,12:ヤンバル / top5BackWork=2:ヤンバル,4:ピグミィ / noReachFront=1:ポリスピナー,8:デスシープ,9:ポリスピナー,16:デスシープ,17:真勇者ダイン,19:真勇者ダイン,21:デスシープ
- special lock: -
- next turn: summon:cpu_polyspinner_3->cpu_back_right / move:cpu_back_left->cpu_front_left / attack:cpu_front_right:self_bomb->monster:player_front_right / master:master_attack->monster:player_front_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は98点差で見送り、召喚は98点差で見送り
- board: PF:ナッツロックル Lv1 HP6 / PF:アンノウン Lv1 HP5 / PB:神斬丸 Lv1 HP5 prep / CF:真勇者ダイン Lv2 HP6 / CF:ボムゾウ Lv2 HP3 / CB:ドノマンティス Lv1 HP5

### blocked_no_pattern_move_forward: ポリスピナー seed 136826 turn 5

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 7 / score 26
- flags: no-backline-pattern, next-move-front, win
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=1:ヤンバル,3:ピグミィ,6:ピグミィ,9:ヤンバル,10:ピグミィ,11:ヤンバル / top5BackWork=1:ヤンバル,3:ピグミィ / noReachFront=7:デスシープ,8:ポリスピナー,15:デスシープ,16:真勇者ダイン,18:真勇者ダイン,20:デスシープ
- special lock: -
- next turn: move:cpu_back_right->cpu_front_left / focus:cpu_front_right / summon:cpu_yanbaru_3->cpu_back_left / master:shield->monster:cpu_front_left / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、召喚は10点差で見送り
- board: PF:ナッツロックル Lv1 HP6 / PF:アンノウン Lv1 HP5 / PB:神斬丸 Lv1 HP5 / PB:ラティーヌ Lv1 HP4 prep / CF:真勇者ダイン Lv2 HP6 / CF:ボムゾウ Lv1 HP6 / CB:ドノマンティス Lv1 HP5

### front_role_allowed_by_range: ボムゾウ seed 136827 turn 5

- variant/opponent: `current_last_back_slot_no_reach_guard35` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_right / role front / front ピグミィ Lv1 HP3 / stones after 4 / score 23
- flags: backline-pattern, next-no-work, win
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=20 / backWork=2:ヤンバル,7:ピグミィ,14:ボムゾウ,16:ピグミィ,20:ヤンバル / top5BackWork=2:ヤンバル / noReachFront=3:ドノマンティス,4:ドノマンティス,5:デスシープ,6:ドノマンティス,9:デスシープ,10:真勇者ダイン,11:真勇者ダイン,13:ポリスピナー,...(+1)
- special lock: -
- next turn: attack:cpu_back_left:wild_claw->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / master:master_attack->monster:player_front_right / attack:cpu_front_right:self_bomb->monster:player_front_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、移動は69点差で見送り
- board: PF:神斬丸 Lv1 HP5 prep / PF:神斬丸 Lv1 HP1 / PB:真勇者ダイン Lv1 HP6 prep / PB:グングニエル Lv1 HP5 prep / CF:真勇者ダイン Lv1 HP6 / CF:ピグミィ Lv1 HP3 / CB:ヤンバル Lv2 HP3


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
