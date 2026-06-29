# White Backline Summon Audit Loop

生成: 2026-06-29T00:54:21.372Z
seedStart: 136400
候補: current_blocked_backline_no_work120
相手: black_1375_pressure, white_current_mirror
試行: 1 games/matchup/direction
総試合: 4

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 52
- 後列召喚: 26 (50%)
- 前列あり後列召喚: 18 (69.2%)
- うち前衛ロール: 9 (50%)
- Backline patternあり: 11 (61.1%)
- Backline patternなし: 7 (38.9%)
- 次自ターン攻撃: 6 (33.3%)
- 次自ターン後列攻撃: 6 (33.3%)
- 次自ターン前進: 0 (0%)
- 次自ターン仕事なし: 12 (66.7%)

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_blocked_backline_no_work120 | 2-2-0 | 52 | 26 (50%) | 18 (69.2%) | 9 (50%) | 11 (61.1%) | 7 (38.9%) | 6 (33.3%) | 6 (33.3%) | 0 (0%) | 12 (66.7%) | 8 (44.4%) | 11/7 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Backline Pattern | No Pattern | No Work |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| current_blocked_backline_no_work120 | black_1375_pressure | 1-1-0 | 10 | 5 (50%) | 5 (50%) | 8 (80%) |
| current_blocked_backline_no_work120 | white_current_mirror | 1-1-0 | 8 | 6 (75%) | 2 (25%) | 4 (50%) |

## Samples

### blocked_backline_pattern_worked: ピグミィ seed 136400 turn 2

- variant/opponent: `current_blocked_backline_no_work120` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは2点差で見送り、ためるは2点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ナッツロックル Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### blocked_no_pattern_no_work: デスシープ seed 136400 turn 12

- variant/opponent: `current_blocked_backline_no_work120` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv1 HP3 / stones after 2 / score 25
- flags: no-backline-pattern, next-no-work, loss
- next turn: focus:player_front_left / master:wake_up->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / focus:player_front_right / ...
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は110点差で見送り
- board: PF:ポリスピナー Lv1 HP3 / PF:デスシープ Lv1 HP4 / CB:ヤンバル Lv1 HP2

### blocked_no_pattern_no_work: ドノマンティス seed 136400 turn 13

- variant/opponent: `current_blocked_backline_no_work120` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv2 HP3 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- next turn: magic:player_card_031_1->monster:cpu_back_right / attack:player_front_right:attack->monster:cpu_front_right / focus:player_front_left / master:shield->monster:player_front_right / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:ポリスピナー Lv2 HP3 / PF:デスシープ Lv1 HP4 / CF:真勇者ダイン Lv1 HP6 prep / CB:ヤンバル Lv1 HP2

### low_stone_blocked_no_work: ドノマンティス seed 136400 turn 13

- variant/opponent: `current_blocked_backline_no_work120` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ポリスピナー Lv2 HP3 / stones after 0 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, loss
- next turn: magic:player_card_031_1->monster:cpu_back_right / attack:player_front_right:attack->monster:cpu_front_right / focus:player_front_left / master:shield->monster:player_front_right / ...
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:ポリスピナー Lv2 HP3 / PF:デスシープ Lv1 HP4 / CF:真勇者ダイン Lv1 HP6 prep / CB:ヤンバル Lv1 HP2

### blocked_no_pattern_no_work: 真勇者ダイン seed 136400 turn 15

- variant/opponent: `current_blocked_backline_no_work120` vs `black_1375_pressure` (player, loss)
- decision: player_back_left / role front / front ドノマンティス Lv1 HP5 / stones after 2 / score 28
- flags: no-backline-pattern, next-no-work, loss
- next turn: end_turn
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は1点差で見送り、マスター特技は3点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv1 HP3 / CF:ボムゾウ Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CB:ヤンバル Lv2 HP1

### blocked_backline_pattern_worked: ピグミィ seed 136401 turn 2

- variant/opponent: `current_blocked_backline_no_work120` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role back / front ヤンバル Lv1 HP3 / stones after 3 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, win
- next turn: move:cpu_front_right->cpu_back_right / attack:cpu_back_left:wild_claw->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / summon:cpu_bomuzo_3->cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は160点差で見送り、マスター特技は297点差で見送り
- board: PF:真勇者ダイン Lv1 HP1 / PF:ヤミー Lv1 HP4 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ヤンバル Lv1 HP3 / CB:ヤンバル Lv1 HP3

### blocked_no_pattern_no_work: デスシープ seed 136401 turn 9

- variant/opponent: `current_blocked_backline_no_work120` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv2 HP6 / stones after 9 / score 25
- flags: no-backline-pattern, next-no-work, win
- next turn: attack:cpu_front_left:ダイン斬り->master:player / focus:cpu_front_right / summon:cpu_bomuzo_1->cpu_back_left / master:shield->monster:cpu_front_right / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り
- board: CF:真勇者ダイン Lv2 HP6 / CF:ドノマンティス Lv1 HP5

### front_role_allowed_by_range: ボムゾウ seed 136401 turn 10

- variant/opponent: `current_blocked_backline_no_work120` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv2 HP6 / stones after 10 / score 23
- flags: backline-pattern, next-no-work, win
- next turn: master:wake_up->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / magic:cpu_card_031_1->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り
- board: PF:ユニフォーン Lv1 HP5 prep / PB:ヤンバル Lv1 HP3 prep / CF:真勇者ダイン Lv2 HP6 / CF:ドノマンティス Lv1 HP5

### blocked_no_pattern_no_work: 真勇者ダイン seed 136401 turn 11

- variant/opponent: `current_blocked_backline_no_work120` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_right / role front / front ドノマンティス Lv2 HP5 / stones after 2 / score 28
- flags: no-backline-pattern, next-no-work, win
- next turn: attack:cpu_front_left:ダイン斬り->monster:player_front_left / master:wake_up->monster:player_front_right / attack:cpu_front_right:呪いの刃->monster:player_front_right / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: ためるは86点差で見送り
- board: PB:ユニフォーン Lv1 HP5 / CF:真勇者ダイン Lv3 HP6 / CF:ドノマンティス Lv2 HP5 / CB:ボムゾウ Lv1 HP6

### blocked_backline_pattern_worked: ヤンバル seed 136402 turn 2

- variant/opponent: `current_blocked_backline_no_work120` vs `white_current_mirror` (player, win)
- decision: player_back_right / role back / front ボムゾウ Lv1 HP6 / stones after 2 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, win
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_back_left:wild_claw->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、ためるは14点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 prep / CB:真勇者ダイン Lv1 HP6 prep / CB:ドノマンティス Lv1 HP5 prep

### low_stone_blocked_no_work: ドノマンティス seed 136402 turn 20

- variant/opponent: `current_blocked_backline_no_work120` vs `white_current_mirror` (player, win)
- decision: player_back_left / role front / front デスシープ Lv1 HP6 / stones after 1 / score 24
- flags: no-backline-pattern, next-no-work, very-low-stone, win
- next turn: attack:player_front_right:呪いの刃->monster:cpu_front_right / focus:player_front_left / summon:player_bomuzo_2->player_back_right / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: 召喚は23点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv2 HP5 / PB:ピグミィ Lv2 HP1 / CF:ヤンバル Lv2 HP3 / CB:ピグミィ Lv1 HP3

### blocked_backline_pattern_worked: ボムゾウ seed 136402 turn 21

- variant/opponent: `current_blocked_backline_no_work120` vs `white_current_mirror` (player, win)
- decision: player_back_right / role front / front ドノマンティス Lv2 HP5 / stones after 4 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, win
- next turn: attack:player_front_right:呪いの刃->monster:cpu_front_right / summon:player_polyspinner_1->player_back_left / attack:player_front_left:attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: ためるは36点差で見送り、召喚は194点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv2 HP5 / PB:ドノマンティス Lv1 HP5 / CB:ヤンバル Lv2 HP3

### front_role_allowed_by_range: ボムゾウ seed 136402 turn 21

- variant/opponent: `current_blocked_backline_no_work120` vs `white_current_mirror` (player, win)
- decision: player_back_right / role front / front ドノマンティス Lv2 HP5 / stones after 4 / score 23
- flags: backline-pattern, next-attack, next-backline-attack, win
- next turn: attack:player_front_right:呪いの刃->monster:cpu_front_right / summon:player_polyspinner_1->player_back_left / attack:player_front_left:attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / ...
- reason: ボムゾウを空き枠へ召喚 / 見送り: ためるは36点差で見送り、召喚は194点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv2 HP5 / PB:ドノマンティス Lv1 HP5 / CB:ヤンバル Lv2 HP3

### blocked_backline_pattern_worked: ピグミィ seed 136403 turn 2

- variant/opponent: `current_blocked_backline_no_work120` vs `white_current_mirror` (cpu, loss)
- decision: cpu_back_right / role back / front ボムゾウ Lv1 HP6 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, loss
- next turn: attack:cpu_back_left:wild_claw->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_back_right:スパイクボール->monster:player_front_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、召喚は1点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ボムゾウ Lv1 HP6 / PB:真勇者ダイン Lv1 HP6 prep / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv1 HP6 / CB:ヤンバル Lv1 HP3


## Notes

- この監査は前衛/後衛ラベルだけではなく、後列から攻撃できるパターンを別扱いにする。
- ボムゾウのような射程持ちは `Backline Pattern` 側に入り、今回の抑制候補からは外す。
- 前が詰まった後列に、後列攻撃パターンを持たないカードを置く例が一定数ある。ここだけを抑える候補は検証価値がある。
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
