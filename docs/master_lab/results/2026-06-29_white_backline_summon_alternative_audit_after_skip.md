# White Backline Summon Audit Loop

生成: 2026-06-29T01:53:02.112Z
seedStart: 136400
候補: current_white_baseline
相手: black_1375_pressure, white_current_mirror
試行: 1 games/matchup/direction
総試合: 4

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 52
- 後列召喚: 29 (55.8%)
- 前列あり後列召喚: 23 (79.3%)
- うち前衛ロール: 12 (52.2%)
- Backline patternあり: 12 (52.2%)
- Backline patternなし: 11 (47.8%)
- 次自ターン攻撃: 7 (30.4%)
- 次自ターン後列攻撃: 7 (30.4%)
- 次自ターン前進: 1 (4.3%)
- 次自ターン仕事なし: 15 (65.2%)
- Bad blocked summon: 10 (43.5%)
- Bad with evaluation trace: 10 (100%)
- Bad close non-summon alt: 1 (10%)

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_white_baseline | 3-1-0 | 52 | 29 (55.8%) | 23 (79.3%) | 12 (52.2%) | 12 (52.2%) | 11 (47.8%) | 7 (30.4%) | 7 (30.4%) | 1 (4.3%) | 15 (65.2%) | 10 (43.5%) | 1 (10%) | FrontSum1, OtherSum9 | 7 (30.4%) | 18/5 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | black_1375_pressure | 1-1-0 | 10 | 5 (50%) | 5 (50%) | 8 (80%) | 5 (50%) | 1 (20%) |
| current_white_baseline | white_current_mirror | 2-0-0 | 13 | 7 (53.8%) | 6 (46.2%) | 7 (53.8%) | 5 (38.5%) | 0 (0%) |

## Samples

### blocked_backline_pattern_worked: ピグミィ seed 136400 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- alternatives: top=focus:+2 focus:player_front_left / nonSummon=focus:+2 focus:player_front_left / attack=- / focus=focus:+2 focus:player_front_left / end=end_turn:+238.3 end_turn / move=- / frontSummon=-
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは2点差で見送り、ためるは2点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ナッツロックル Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_no_pattern_no_work: デスシープ seed 136400 turn 12

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv1 HP3 / stones after 2 / score 25
- flags: no-backline-pattern, next-no-work, loss
- alternatives: top=summon:+0 summon:player_card_133_2->player_back_right / nonSummon=attack:+34.4 attack:player_front_left:attack->master:cpu / attack=attack:+34.4 attack:player_front_left:attack->master:cpu / focus=- / end=end_turn:+281.2 end_turn / move=- / frontSummon=-
- next turn: focus:player_front_left / master:wake_up->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / focus:player_front_right / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は34点差で見送り
- board: PF:ポリスピナー Lv1 HP3 / PF:デスシープ Lv1 HP4 / CB:ヤンバル Lv1 HP2

### bad_blocked_close_non_summon_alt: デスシープ seed 136400 turn 12

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv1 HP3 / stones after 2 / score 25
- flags: no-backline-pattern, next-no-work, loss
- alternatives: top=summon:+0 summon:player_card_133_2->player_back_right / nonSummon=attack:+34.4 attack:player_front_left:attack->master:cpu / attack=attack:+34.4 attack:player_front_left:attack->master:cpu / focus=- / end=end_turn:+281.2 end_turn / move=- / frontSummon=-
- next turn: focus:player_front_left / master:wake_up->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / focus:player_front_right / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は34点差で見送り
- board: PF:ポリスピナー Lv1 HP3 / PF:デスシープ Lv1 HP4 / CB:ヤンバル Lv1 HP2

### blocked_no_pattern_no_work: ドノマンティス seed 136400 turn 13

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv2 HP3 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: top=summon:+0 summon:player_card_037_3->player_back_right / nonSummon=end_turn:+295.7 end_turn / attack=- / focus=- / end=end_turn:+295.7 end_turn / move=- / frontSummon=-
- next turn: magic:player_card_031_1->monster:cpu_back_right / attack:player_front_right:attack->monster:cpu_front_right / focus:player_front_left / master:shield->monster:player_front_right / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:ポリスピナー Lv2 HP3 / PF:デスシープ Lv1 HP4 / CF:真勇者ダイン Lv1 HP6 prep / CB:ヤンバル Lv1 HP2

### low_stone_blocked_no_work: ドノマンティス seed 136400 turn 13

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv2 HP3 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- alternatives: top=summon:+0 summon:player_card_037_3->player_back_right / nonSummon=end_turn:+295.7 end_turn / attack=- / focus=- / end=end_turn:+295.7 end_turn / move=- / frontSummon=-
- next turn: magic:player_card_031_1->monster:cpu_back_right / attack:player_front_right:attack->monster:cpu_front_right / focus:player_front_left / master:shield->monster:player_front_right / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:ポリスピナー Lv2 HP3 / PF:デスシープ Lv1 HP4 / CF:真勇者ダイン Lv1 HP6 prep / CB:ヤンバル Lv1 HP2

### blocked_no_pattern_no_work: 真勇者ダイン seed 136400 turn 15

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 28
- flags: no-backline-pattern, next-no-work, loss
- alternatives: top=summon:+0 summon:player_card_047_1->player_back_right / nonSummon=attack:+73.4 attack:player_front_left:attack->monster:cpu_front_left / attack=attack:+73.4 attack:player_front_left:attack->monster:cpu_front_left / focus=focus:+148.2 focus:player_front_right / end=end_turn:+211.1 end_turn / move=- / frontSummon=-
- next turn: end_turn
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は73点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv1 HP3 / CF:ボムゾウ Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CB:ヤンバル Lv2 HP1

### blocked_backline_pattern_worked: ピグミィ seed 136401 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role back / front ヤンバル Lv1 HP3 / stones after 3 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=summon:+159.5 summon:cpu_bomuzo_3->cpu_back_right / nonSummon=master_action:+296.8 master:master_attack->monster:player_front_left / attack=- / focus=- / end=- / move=- / frontSummon=-
- next turn: move:cpu_front_right->cpu_back_right / attack:cpu_back_left:wild_claw->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / summon:cpu_bomuzo_3->cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は160点差で見送り、マスター特技は297点差で見送り
- board: PF:真勇者ダイン Lv1 HP1 / PF:ヤミー Lv1 HP4 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ヤンバル Lv1 HP3 / CB:ヤンバル Lv1 HP3

### blocked_no_pattern_no_work: 真勇者ダイン seed 136401 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front ピグミィ Lv2 HP3 / stones after 8 / score 28
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=summon:+90.6 summon:cpu_card_047_1->cpu_front_right / nonSummon=- / attack=- / focus=- / end=- / move=- / frontSummon=summon:+90.6 summon:cpu_card_047_1->cpu_front_right
- next turn: move:cpu_front_right->cpu_back_left / focus:cpu_front_left / master:shield->monster:cpu_front_left / end_turn
- reason: カードを後列左へ召喚 / 見送り: 召喚は91点差で見送り、召喚は92点差で見送り
- board: CF:ピグミィ Lv2 HP3

### blocked_no_pattern_no_work: デスシープ seed 136401 turn 10

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front 真勇者ダイン Lv1 HP6 / stones after 9 / score 25
- flags: no-backline-pattern, next-no-work, win
- alternatives: top=summon:+102.8 summon:cpu_card_133_2->cpu_back_left / nonSummon=end_turn:+440.2 end_turn / attack=- / focus=- / end=end_turn:+440.2 end_turn / move=- / frontSummon=-
- next turn: attack:cpu_front_left:呪いの刃->monster:player_front_left / focus:cpu_front_right / focus:cpu_back_left / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は103点差で見送り、召喚は172点差で見送り
- board: PF:ユニフォーン Lv1 HP5 prep / PB:ヤンバル Lv1 HP3 prep / CF:ドノマンティス Lv2 HP5 / CF:真勇者ダイン Lv1 HP6

### front_role_allowed_by_range: ボムゾウ seed 136401 turn 10

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front ドノマンティス Lv2 HP5 / stones after 8 / score 23
- flags: backline-pattern, next-no-work, win
- alternatives: top=end_turn:+366.1 end_turn / nonSummon=end_turn:+366.1 end_turn / attack=- / focus=- / end=end_turn:+366.1 end_turn / move=- / frontSummon=-
- next turn: attack:cpu_front_left:呪いの刃->monster:player_front_left / focus:cpu_front_right / focus:cpu_back_left / focus:cpu_back_right / ...
- reason: カードを後列左へ召喚
- board: PF:ユニフォーン Lv1 HP5 prep / PB:ヤンバル Lv1 HP3 prep / CF:ドノマンティス Lv2 HP5 / CF:真勇者ダイン Lv1 HP6 / CB:デスシープ Lv1 HP6 prep

### blocked_backline_pattern_worked: ヤンバル seed 136402 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_right / role back / front ボムゾウ Lv1 HP6 / stones after 2 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=summon:+1 summon:player_card_051_2->player_back_right / nonSummon=focus:+14.4 focus:player_front_right / attack=- / focus=focus:+14.4 focus:player_front_right / end=end_turn:+410 end_turn / move=- / frontSummon=-
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_back_left:wild_claw->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、ためるは14点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 prep / CB:真勇者ダイン Lv1 HP6 prep / CB:ドノマンティス Lv1 HP5 prep

### blocked_backline_pattern_worked: ピグミィ seed 136402 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_right / role back / front ヤンバル Lv1 HP3 / stones after 3 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=attack:+2.9 attack:player_back_left:wild_claw->monster:cpu_front_left / nonSummon=attack:+2.9 attack:player_back_left:wild_claw->monster:cpu_front_left / attack=attack:+2.9 attack:player_back_left:wild_claw->monster:cpu_front_left / focus=focus:+391.2 focus:player_back_left / end=- / move=move:+377.2 move:player_front_right->player_back_right / frontSummon=-
- next turn: master:wake_up->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / move:player_front_right->player_back_right / attack:player_back_left:wild_claw->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 攻撃は3点差で見送り、攻撃は57点差で見送り
- board: PF:真勇者ダイン Lv2 HP6 / PF:ヤンバル Lv1 HP3 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP4 / CF:ドノマンティス Lv2 HP5 / CB:ボムゾウ Lv1 HP6

### blocked_no_pattern_move_forward: デスシープ seed 136402 turn 19

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 6 / score 25
- flags: no-backline-pattern, next-move-front, win
- alternatives: top=attack:+4 attack:player_back_right:スパイクボール->monster:cpu_front_left / nonSummon=attack:+4 attack:player_back_right:スパイクボール->monster:cpu_front_left / attack=attack:+4 attack:player_back_right:スパイクボール->monster:cpu_front_left / focus=focus:+35.1 focus:player_back_right / end=end_turn:+239.1 end_turn / move=- / frontSummon=-
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_front_right:スパイクボール->monster:cpu_front_left / move:player_back_left->player_front_right / summon:player_card_037_1->player_back_right / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 攻撃は4点差で見送り、攻撃は31点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv2 HP1 / PB:ピグミィ Lv2 HP3 / CF:ドノマンティス Lv2 HP5 / CB:ヤンバル Lv1 HP3 / CB:ピグミィ Lv1 HP2

### blocked_backline_pattern_worked: ピグミィ seed 136403 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, win)
- decision: cpu_back_right / role back / front ボムゾウ Lv1 HP6 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- alternatives: top=summon:+0 summon:cpu_card_051_2->cpu_back_right / nonSummon=attack:+11.8 attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack=attack:+11.8 attack:cpu_front_left:ダイン斬り->monster:player_front_left / focus=focus:+178.4 focus:cpu_front_left / end=- / move=- / frontSummon=-
- next turn: attack:cpu_back_left:wild_claw->monster:player_front_left / attack:cpu_back_right:スパイクボール->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_front_right:self_bomb->monster:player_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、召喚は1点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ドノマンティス Lv1 HP5 / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv1 HP6 / CB:ヤンバル Lv1 HP3


## Notes

- この監査は前衛/後衛ラベルだけではなく、後列から攻撃できるパターンを別扱いにする。
- ボムゾウのような射程持ちは `Backline Pattern` 側に入り、今回の抑制候補からは外す。
- 前が詰まった後列に、後列攻撃パターンを持たないカードを置く例が一定数ある。ここだけを抑える候補は検証価値がある。
- 詰まり後列召喚が次自ターンの攻撃/前進に変換されない例が多い。召喚の盤面評価だけでなく次ターン仕事予定が必要。
- 詰まり後列召喚の多くは射程持ちカードでもあるため、一律ペナルティは避けるべき。

## Next Loop Proposal

- bad summon の代替が召喚同士に寄る場合、後列仕事なし召喚を抑えるより、召喚先・カード選択の品質を比較する候補へ移る。
- 候補 `whiteBlockedBacklineNoWorkSummonPenalty` は一括スクリーニングだけで判断せず、同一seed比較で勝率と `blocked_no_pattern_no_work` 減少が両立する値だけ中母数確認する。
- ボムゾウ等の射程持ちを許容できているか、サンプルで `front_role_allowed_by_range` を確認する。

## Reading

- `Blocked`: 同レーン前列に自軍ユニットがいる後列召喚。
- `Backline Pattern`: 後列から攻撃しうる射程/攻撃パターンをカードが持つ。ボムゾウ系はここに入る。
- `No Pattern`: 後列から攻撃しにくいカード。ここが多い場合だけ抑制候補にする。
- `No Work`: 次自ターンにその召喚ユニットが攻撃も前進もしなかったケース。
- `Bad`: Blocked + No Pattern + No Work を満たす、今回もっとも疑う後列召喚。
- `Close Non-Summon`: Bad の局面で、選択召喚から35点以内に攻撃/ためる/移動/終了などの非召喚代替があったケース。
