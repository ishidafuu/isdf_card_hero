# White Backline Summon Audit Loop

生成: 2026-06-29T01:00:08.133Z
seedStart: 136400
候補: current_white_baseline, current_blocked_backline_no_work40, current_blocked_backline_no_work80, current_blocked_backline_no_work120
相手: black_1375_pressure, white_current_mirror
試行: 1 games/matchup/direction
総試合: 16

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 180
- 後列召喚: 98 (54.4%)
- 前列あり後列召喚: 70 (71.4%)
- うち前衛ロール: 26 (37.1%)
- Backline patternあり: 54 (77.1%)
- Backline patternなし: 16 (22.9%)
- 次自ターン攻撃: 16 (22.9%)
- 次自ターン後列攻撃: 16 (22.9%)
- 次自ターン前進: 0 (0%)
- 次自ターン仕事なし: 54 (77.1%)

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 2-2-0 | 40 | 20 (50%) | 14 (70%) | 4 (28.6%) | 11 (78.6%) | 3 (21.4%) | 7 (50%) | 7 (50%) | 0 (0%) | 7 (50%) | 4 (28.6%) | 8/6 |
| current_blocked_backline_no_work40 | 3-1-0 | 41 | 23 (56.1%) | 18 (78.3%) | 7 (38.9%) | 15 (83.3%) | 3 (16.7%) | 3 (16.7%) | 3 (16.7%) | 0 (0%) | 15 (83.3%) | 7 (38.9%) | 15/3 |
| current_blocked_backline_no_work80 | 2-2-0 | 56 | 32 (57.1%) | 22 (68.8%) | 9 (40.9%) | 15 (68.2%) | 7 (31.8%) | 0 (0%) | 0 (0%) | 0 (0%) | 22 (100%) | 12 (54.5%) | 13/9 |
| current_blocked_backline_no_work120 | 2-2-0 | 43 | 23 (53.5%) | 16 (69.6%) | 6 (37.5%) | 13 (81.3%) | 3 (18.8%) | 6 (37.5%) | 6 (37.5%) | 0 (0%) | 10 (62.5%) | 6 (37.5%) | 9/7 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Backline Pattern | No Pattern | No Work |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | black_1375_pressure | 1-1-0 | 8 | 5 (62.5%) | 3 (37.5%) | 6 (75%) |
| current_white_baseline | white_current_mirror | 1-1-0 | 6 | 6 (100%) | 0 (0%) | 1 (16.7%) |
| current_blocked_backline_no_work40 | black_1375_pressure | 2-0-0 | 6 | 6 (100%) | 0 (0%) | 4 (66.7%) |
| current_blocked_backline_no_work40 | white_current_mirror | 1-1-0 | 12 | 9 (75%) | 3 (25%) | 11 (91.7%) |
| current_blocked_backline_no_work80 | black_1375_pressure | 1-1-0 | 9 | 6 (66.7%) | 3 (33.3%) | 9 (100%) |
| current_blocked_backline_no_work80 | white_current_mirror | 1-1-0 | 13 | 9 (69.2%) | 4 (30.8%) | 13 (100%) |
| current_blocked_backline_no_work120 | black_1375_pressure | 1-1-0 | 5 | 4 (80%) | 1 (20%) | 4 (80%) |
| current_blocked_backline_no_work120 | white_current_mirror | 1-1-0 | 11 | 9 (81.8%) | 2 (18.2%) | 6 (54.5%) |

## Samples

### blocked_backline_pattern_worked: ピグミィ seed 136400 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは2点差で見送り、ためるは2点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ナッツロックル Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_no_pattern_no_work: 真勇者ダイン seed 136400 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front デスシープ Lv1 HP6 / stones after 0 / score 28
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_front_right:attack->master:cpu / summon:player_bomuzo_2->player_front_left / attack:player_back_left:スパイクボール->monster:cpu_back_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 攻撃は53点差で見送り、ためるは142点差で見送り
- board: PF:ボムゾウ Lv2 HP3 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3 prep / CB:ピグミィ Lv1 HP3 prep

### low_stone_blocked_no_work: 真勇者ダイン seed 136400 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front デスシープ Lv1 HP6 / stones after 0 / score 28
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_front_right:attack->master:cpu / summon:player_bomuzo_2->player_front_left / attack:player_back_left:スパイクボール->monster:cpu_back_left / ...
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 攻撃は53点差で見送り、ためるは142点差で見送り
- board: PF:ボムゾウ Lv2 HP3 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_backline_pattern_worked: ピグミィ seed 136401 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role back / front ヤンバル Lv1 HP3 / stones after 3 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- next turn: attack:cpu_back_left:wild_claw->monster:player_front_right / move:cpu_front_right->cpu_back_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / summon:cpu_bomuzo_3->cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は160点差で見送り、マスター特技は297点差で見送り
- board: PF:真勇者ダイン Lv1 HP1 / PF:ヤミー Lv1 HP4 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ヤンバル Lv1 HP3 / CB:ヤンバル Lv1 HP3

### blocked_no_pattern_no_work: ドノマンティス seed 136401 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv1 HP6 prep / stones after 6 / score 24
- flags: no-backline-pattern, next-no-work, win
- next turn: move:cpu_front_right->cpu_back_left / focus:cpu_front_left / master:shield->monster:cpu_front_left / end_turn
- reason: カードを後列左へ召喚
- board: CF:真勇者ダイン Lv1 HP6 prep / CF:ポリスピナー Lv1 HP3 prep / CB:ピグミィ Lv2 HP3

### blocked_no_pattern_no_work: デスシープ seed 136401 turn 9

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv2 HP6 / stones after 9 / score 25
- flags: no-backline-pattern, next-no-work, win
- next turn: attack:cpu_front_left:ダイン斬り->master:player / attack:cpu_front_right:attack->master:player / summon:cpu_bomuzo_1->cpu_back_right / focus:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り
- board: CF:真勇者ダイン Lv2 HP6 / CF:ドノマンティス Lv1 HP5

### front_role_allowed_by_range: ボムゾウ seed 136401 turn 10

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 9 / score 23
- flags: backline-pattern, next-no-work, win
- next turn: magic:cpu_card_031_1->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / focus:cpu_front_right / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: ためるは45点差で見送り
- board: PF:ユニフォーン Lv1 HP5 prep / PB:ヤンバル Lv1 HP3 prep / CF:真勇者ダイン Lv2 HP6 / CF:ドノマンティス Lv1 HP5 / CB:デスシープ Lv1 HP6

### blocked_backline_pattern_worked: ヤンバル seed 136402 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_right / role back / front ボムゾウ Lv1 HP6 / stones after 2 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, win
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_back_left:wild_claw->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、ためるは14点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 prep / CB:真勇者ダイン Lv1 HP6 prep / CB:ドノマンティス Lv1 HP5 prep

### blocked_backline_pattern_worked: ピグミィ seed 136402 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_left / role back / front ヤンバル Lv1 HP3 / stones after 5 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- next turn: move:player_front_right->player_back_right / attack:player_front_left:wild_claw->monster:cpu_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は1点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:ヤンバル Lv2 HP3 / CF:ポリスピナー Lv1 HP3

### blocked_backline_pattern_worked: ピグミィ seed 136402 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, win)
- decision: player_back_right / role back / front ヤンバル Lv2 HP3 / stones after 4 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- next turn: move:player_front_right->player_back_right / attack:player_front_left:wild_claw->monster:cpu_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: マスター特技は106点差で見送り、召喚は176点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:ヤンバル Lv2 HP3 / PB:ピグミィ Lv1 HP3 prep / CF:ポリスピナー Lv1 HP1

### front_role_allowed_by_range: ボムゾウ seed 136405 turn 3

- variant/opponent: `current_blocked_backline_no_work40` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv2 HP6 / stones after 2 / score 23
- flags: backline-pattern, next-no-work, win
- next turn: attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_front_right:ダイン斬り->master:player / summon:cpu_card_051_3->cpu_back_right / focus:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は91点差で見送り
- board: PB:ヤンバル Lv1 HP3 prep / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv2 HP6 / CF:真勇者ダイン Lv2 HP6 / CB:ヤンバル Lv1 HP3

### low_stone_blocked_no_work: ヤンバル seed 136406 turn 1

- variant/opponent: `current_blocked_backline_no_work40` vs `white_current_mirror` (player, win)
- decision: player_back_right / role back / front 真勇者ダイン Lv1 HP6 prep / stones after 0 / score 68
- flags: backline-pattern, next-no-work, very-low-stone, win
- next turn: focus:player_front_right / focus:player_front_left / focus:player_back_right / master:shield->monster:player_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は163点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 prep / PB:真勇者ダイン Lv1 HP6 prep

### blocked_no_pattern_no_work: ドノマンティス seed 136406 turn 3

- variant/opponent: `current_blocked_backline_no_work40` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 3 / score 24
- flags: no-backline-pattern, next-no-work, win
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_right:wild_claw->monster:cpu_front_left / summon:player_bomuzo_2->player_back_left / master:wake_up->monster:player_back_left / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 攻撃は82点差で見送り、ためるは204点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:真勇者ダイン Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:ドノマンティス Lv1 HP5 prep / CF:デスシープ Lv1 HP6 / CB:真勇者ダイン Lv1 HP6 / CB:ヤンバル Lv1 HP3

### front_role_allowed_by_range: ボムゾウ seed 136406 turn 4

- variant/opponent: `current_blocked_backline_no_work40` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 6 / score 23
- flags: backline-pattern, next-no-work, win
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_card_051_3->player_back_left / attack:player_front_left:storm_bomb->monster:cpu_front_right / master:wake_up->monster:player_back_left / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: 攻撃は209点差で見送り、マスター特技は287点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:ドノマンティス Lv2 HP1 / CF:デスシープ Lv1 HP6 / CB:真勇者ダイン Lv1 HP6 / CB:ヤンバル Lv1 HP3

### blocked_no_pattern_no_work: デスシープ seed 136406 turn 7

- variant/opponent: `current_blocked_backline_no_work40` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front ヤンバル Lv2 HP3 / stones after 5 / score 25
- flags: no-backline-pattern, next-no-work, win
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_right / focus:player_front_left / master:master_attack->monster:cpu_front_right / attack:player_front_right:ダイン斬り->monster:cpu_front_right / ...
- reason: デスシープを空き枠へ召喚 / 見送り: マスター特技は507点差で見送り
- board: PF:ヤンバル Lv2 HP3 / PF:真勇者ダイン Lv1 HP6 / PB:ヤンバル Lv2 HP3 / CF:真勇者ダイン Lv3 HP6 / CB:真勇者ダイン Lv1 HP6 prep

### front_role_allowed_by_range: ボムゾウ seed 136406 turn 12

- variant/opponent: `current_blocked_backline_no_work40` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front ポリスピナー Lv2 HP3 / stones after 6 / score 23
- flags: backline-pattern, next-no-work, win
- next turn: attack:player_front_left:attack->master:cpu / end_turn
- reason: ボムゾウを空き枠へ召喚
- board: PF:ポリスピナー Lv2 HP3 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv2 HP3 / CF:真勇者ダイン Lv1 HP6 prep

### front_role_allowed_by_range: ボムゾウ seed 136407 turn 2

- variant/opponent: `current_blocked_backline_no_work40` vs `white_current_mirror` (cpu, loss)
- decision: cpu_back_right / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 23
- flags: backline-pattern, next-no-work, loss
- next turn: move:cpu_front_left->cpu_back_left / focus:cpu_front_right / summon:cpu_card_047_2->cpu_front_left / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: ためるは32点差で見送り、召喚は75点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ヤンバル Lv1 HP3 prep / PB:ヤンバル Lv1 HP3 / CF:ボムゾウ Lv1 HP6 / CF:ドノマンティス Lv1 HP5 / CB:ピグミィ Lv1 HP3

### low_stone_blocked_no_work: ピグミィ seed 136408 turn 9

- variant/opponent: `current_blocked_backline_no_work80` vs `black_1375_pressure` (player, win)
- decision: player_back_left / role back / front ドノマンティス Lv1 HP5 / stones after 0 / score 67
- flags: backline-pattern, next-no-work, very-low-stone, win
- next turn: attack:player_front_right:ダイン斬り->master:cpu / end_turn
- reason: 後衛カードを後列左へ召喚 / 見送り: 攻撃は117点差で見送り、攻撃は187点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv2 HP3 / CF:ヤミー Lv2 HP5 / CB:ユニフォーン Lv1 HP5 prep

### low_stone_blocked_no_work: ピグミィ seed 136410 turn 19

- variant/opponent: `current_blocked_backline_no_work80` vs `white_current_mirror` (player, loss)
- decision: player_back_left / role back / front デスシープ Lv1 HP6 / stones after 0 / score 67
- flags: backline-pattern, next-no-work, very-low-stone, loss
- next turn: attack:player_front_left:スパイクボール->monster:cpu_back_right / move:player_front_left->player_back_left / summon:player_card_037_2->player_front_left / master:master_attack->monster:cpu_front_right / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: 召喚は97点差で見送り、召喚は149点差で見送り
- board: PF:デスシープ Lv1 HP6 / CF:デスシープ Lv1 HP6 / CB:ヤンバル Lv1 HP3 prep / CB:ピグミィ Lv2 HP1

### low_stone_blocked_no_work: ピグミィ seed 136414 turn 1

- variant/opponent: `current_blocked_backline_no_work120` vs `white_current_mirror` (player, win)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 prep / stones after 0 / score 67
- flags: backline-pattern, next-no-work, very-low-stone, win
- next turn: focus:player_front_right / move:player_front_left->player_back_left / summon:player_card_047_3->player_front_left / focus:player_back_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は92点差で見送り
- board: PF:ドノマンティス Lv1 HP5 prep / PB:ヤンバル Lv1 HP3 prep


## Notes

- この監査は前衛/後衛ラベルだけではなく、後列から攻撃できるパターンを別扱いにする。
- ボムゾウのような射程持ちは `Backline Pattern` 側に入り、今回の抑制候補からは外す。
- 詰まり後列召喚が次自ターンの攻撃/前進に変換されない例が多い。召喚の盤面評価だけでなく次ターン仕事予定が必要。
- 詰まり後列召喚の多くは射程持ちカードでもあるため、一律ペナルティは避けるべき。

## Next Loop Proposal

- 候補 `whiteBlockedBacklineNoWorkSummonPenalty` は一括スクリーニングだけで判断せず、同一seed比較で勝率と `blocked_no_pattern_no_work` 減少が両立する値だけ中母数確認する。
- ボムゾウ等の射程持ちを許容できているか、サンプルで `front_role_allowed_by_range` を確認する。

## Reading

- `Blocked`: 同レーン前列に自軍ユニットがいる後列召喚。
- `Backline Pattern`: 後列から攻撃しうる射程/攻撃パターンをカードが持つ。ボムゾウ系はここに入る。
- `No Pattern`: 後列から攻撃しにくいカード。ここが多い場合だけ抑制候補にする。
- `No Work`: 次自ターンにその召喚ユニットが攻撃も前進もしなかったケース。
