# White Back Slot Hold Plan Audit

生成: 2026-06-30T01:02:47.988Z
seedStart: 137300
相手: black_1375_pressure, black_pressure_strong
試行: 4 games/matchup/direction
総試合: 16

## Purpose

最後の後列空き枠を、後列から仕事できない召喚で潰した局面について、`summon now` と `hold slot` の評価差を確認する。

## Summary

- 対象召喚: 18
- 評価traceあり: 18 (100%)
- W-L-D: 5-13-0
- Hold close <=35: 7 (38.9%)
- Hold medium <=80: 9 (50%)
- Hold distant <=160: 12 (66.7%)
- Hold altなし: 0 (0%)
- Hold gap平均: 107.3
- 同カード前列代替: 0 (0%)
- 同カード前列 close <=120: 0 (0%)
- 手札に他の後列仕事カード: 0 (0%)
- 山札に後列仕事カード: 18 (100%)
- 山札上位5枚に後列仕事カード: 16 (88.9%)
- Best hold type: attack:1, focus:9, end:6, master:2

## Opponent Metrics

| Opponent | W-L-D | Records | Trace | Close Hold | Medium Hold | Distant Hold | No Hold | Same Card Front | Hand Back | Deck Top5 | Best Hold Types |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| black_1375_pressure | 2-6-0 | 6 | 6 (100%) | 2 (33.3%) | 3 (50%) | 4 (66.7%) | 0 (0%) | 0 (0%) | 0 (0%) | 4 (66.7%) | attack:1, focus:2, end:2, master:1 |
| black_pressure_strong | 2-6-0 | 12 | 12 (100%) | 5 (41.7%) | 6 (50%) | 8 (66.7%) | 0 (0%) | 0 (0%) | 0 (0%) | 12 (100%) | focus:7, end:4, master:1 |

## Samples

### loss_far_hold_alt: 真勇者ダイン -> player_back_right seed 137300 turn 4

- opponent/outcome: `black_1375_pressure` / player loss
- selected: 真勇者ダイン -> player_back_right / score 51.4 / front デスシープ Lv1 HP6 / stones 1
- best hold: master:shield->monster:player_front_left / gap 169.7 / total -118.3
- best non-summon: master:shield->monster:player_front_left / gap 169.7 / total -118.3
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=8 / top5=-
- next turn: attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / summon:player_card_037_2->player_back_left / focus:player_back_right / master:shield->monster:player_front_right / end_turn
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: マスター特技は170点差で見送り、マスター特技は185点差で見送り
- board: player_front_left:真勇者ダイン Lv3 HP6 / player_front_right:デスシープ Lv1 HP6 / player_back_left:ヤンバル Lv1 HP3 / player_back_right:真勇者ダイン Lv1 HP6 prep / cpu_front_right:ボムゾウ Lv1 HP4 / cpu_back_left:ヤンバル Lv1 HP3 prep

### medium_hold_alt: ドノマンティス -> player_back_left seed 137300 turn 5

- opponent/outcome: `black_1375_pressure` / player loss
- selected: ドノマンティス -> player_back_left / score 119.6 / front 真勇者ダイン Lv3 HP6 / stones 4
- best hold: focus:player_back_right / gap 36.7 / total 83
- best non-summon: focus:player_back_right / gap 36.7 / total 83
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=8 / top5=-
- next turn: attack:player_front_right:attack->monster:cpu_front_right / attack:player_front_left:ダイン斬り->master:cpu / master:master_attack->monster:cpu_front_right / focus:player_back_left / master:shield->monster:player_front_left / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは37点差で見送り、マスター特技は39点差で見送り
- board: player_front_left:真勇者ダイン Lv3 HP6 / player_front_right:デスシープ Lv1 HP6 / player_back_left:ドノマンティス Lv1 HP5 prep / player_back_right:真勇者ダイン Lv1 HP6 / cpu_front_right:ボムゾウ Lv1 HP3

### top5_backline_work_wait: ポリスピナー -> player_back_right seed 137300 turn 8

- opponent/outcome: `black_1375_pressure` / player loss
- selected: ポリスピナー -> player_back_right / score 61.4 / front 真勇者ダイン Lv3 HP6 / stones 3
- best hold: end_turn / gap 195.6 / total -134.2
- best non-summon: end_turn / gap 195.6 / total -134.2
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=8 / top5=5:ピグミィ
- next turn: attack:player_front_right:ダイン斬り->master:cpu / attack:player_front_left:ダイン斬り->master:cpu / master:shield->monster:player_front_right / end_turn
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は26点差で見送り
- board: player_front_left:真勇者ダイン Lv3 HP6 / player_front_right:真勇者ダイン Lv3 HP6 / player_back_left:ドノマンティス Lv1 HP5 / player_back_right:ポリスピナー Lv1 HP3 prep

### close_hold_alt: 真勇者ダイン -> player_back_right seed 137303 turn 2

- opponent/outcome: `black_1375_pressure` / player loss
- selected: 真勇者ダイン -> player_back_right / score 35.5 / front ポリスピナー Lv1 HP3 / stones 2
- best hold: attack:player_front_right:attack->master:cpu / gap 24.3 / total 11.2
- best non-summon: attack:player_front_right:attack->master:cpu / gap 24.3 / total 11.2
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=8 / top5=1:ボムゾウ,5:ヤンバル
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / summon:player_bomuzo_1->player_back_right / attack:player_front_right:ダイン斬り->monster:cpu_front_right / end_turn
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 攻撃は24点差で見送り、召喚は39点差で見送り
- board: player_front_left:デスシープ Lv1 HP6 / player_front_right:ポリスピナー Lv1 HP3 / player_back_left:ピグミィ Lv1 HP3 / player_back_right:真勇者ダイン Lv1 HP6 prep / cpu_front_left:真勇者ダイン Lv1 HP6 prep / cpu_front_right:ナッツロックル Lv1 HP6 prep / cpu_back_left:ボムゾウ Lv1 HP6 prep

### top5_backline_work_wait: 真勇者ダイン -> player_back_right seed 137303 turn 2

- opponent/outcome: `black_1375_pressure` / player loss
- selected: 真勇者ダイン -> player_back_right / score 35.5 / front ポリスピナー Lv1 HP3 / stones 2
- best hold: attack:player_front_right:attack->master:cpu / gap 24.3 / total 11.2
- best non-summon: attack:player_front_right:attack->master:cpu / gap 24.3 / total 11.2
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=8 / top5=1:ボムゾウ,5:ヤンバル
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / summon:player_bomuzo_1->player_back_right / attack:player_front_right:ダイン斬り->monster:cpu_front_right / end_turn
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 攻撃は24点差で見送り、召喚は39点差で見送り
- board: player_front_left:デスシープ Lv1 HP6 / player_front_right:ポリスピナー Lv1 HP3 / player_back_left:ピグミィ Lv1 HP3 / player_back_right:真勇者ダイン Lv1 HP6 prep / cpu_front_left:真勇者ダイン Lv1 HP6 prep / cpu_front_right:ナッツロックル Lv1 HP6 prep / cpu_back_left:ボムゾウ Lv1 HP6 prep

### top5_backline_work_wait: ポリスピナー -> player_back_right seed 137303 turn 5

- opponent/outcome: `black_1375_pressure` / player loss
- selected: ポリスピナー -> player_back_right / score -174.1 / front ボムゾウ Lv2 HP5 / stones 3
- best hold: end_turn / gap 116.2 / total -290.2
- best non-summon: end_turn / gap 116.2 / total -290.2
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=7 / top5=2:ヤンバル,5:ヤンバル
- next turn: attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / focus:player_back_right / master:shield->monster:player_front_left / master:shield->monster:player_front_right / end_turn
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は135点差で見送り
- board: player_front_left:デスシープ Lv1 HP6 / player_front_right:ボムゾウ Lv2 HP5 / player_back_left:ピグミィ Lv2 HP3 / player_back_right:ポリスピナー Lv1 HP3 prep / cpu_front_left:真勇者ダイン Lv1 HP6 prep / cpu_back_left:ヤミー Lv1 HP5 prep / cpu_back_right:ピグミィ Lv1 HP3

### close_hold_alt: ドノマンティス -> cpu_back_right seed 137307 turn 4

- opponent/outcome: `black_1375_pressure` / cpu loss
- selected: ドノマンティス -> cpu_back_right / score 20.7 / front ボムゾウ Lv2 HP2 / stones 5
- best hold: focus:cpu_front_left / gap 26.6 / total -5.9
- best non-summon: focus:cpu_front_left / gap 26.6 / total -5.9
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=7 / top5=1:ピグミィ,4:ヤンバル
- next turn: attack:cpu_front_left:attack->monster:player_front_left / master:master_attack->monster:player_front_left / master:master_attack->monster:player_front_left / attack:cpu_front_right:self_bomb->master:player / summon:cpu_card_051_3->cpu_front_right / focus:cpu_back_right / focus:cpu_back_left / master:shield->monster:cpu_front_left
- reason: カードを後列右へ召喚 / 見送り: ためるは27点差で見送り、ためるは31点差で見送り
- board: player_front_left:ヤミー Lv1 HP5 prep / cpu_front_left:デスシープ Lv1 HP3 / cpu_front_right:ボムゾウ Lv2 HP2 / cpu_back_left:ドノマンティス Lv1 HP5 prep / cpu_back_right:ドノマンティス Lv1 HP5 prep

### top5_backline_work_wait: ドノマンティス -> cpu_back_right seed 137307 turn 4

- opponent/outcome: `black_1375_pressure` / cpu loss
- selected: ドノマンティス -> cpu_back_right / score 20.7 / front ボムゾウ Lv2 HP2 / stones 5
- best hold: focus:cpu_front_left / gap 26.6 / total -5.9
- best non-summon: focus:cpu_front_left / gap 26.6 / total -5.9
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=7 / top5=1:ピグミィ,4:ヤンバル
- next turn: attack:cpu_front_left:attack->monster:player_front_left / master:master_attack->monster:player_front_left / master:master_attack->monster:player_front_left / attack:cpu_front_right:self_bomb->master:player / summon:cpu_card_051_3->cpu_front_right / focus:cpu_back_right / focus:cpu_back_left / master:shield->monster:cpu_front_left
- reason: カードを後列右へ召喚 / 見送り: ためるは27点差で見送り、ためるは31点差で見送り
- board: player_front_left:ヤミー Lv1 HP5 prep / cpu_front_left:デスシープ Lv1 HP3 / cpu_front_right:ボムゾウ Lv2 HP2 / cpu_back_left:ドノマンティス Lv1 HP5 prep / cpu_back_right:ドノマンティス Lv1 HP5 prep

### medium_hold_alt: ドノマンティス -> player_back_right seed 137308 turn 2

- opponent/outcome: `black_pressure_strong` / player loss
- selected: ドノマンティス -> player_back_right / score 24.2 / front ボムゾウ Lv1 HP6 / stones 2
- best hold: focus:player_front_left / gap 38.3 / total -14.1
- best non-summon: focus:player_front_left / gap 38.3 / total -14.1
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=7 / top5=4:ピグミィ
- next turn: attack:player_front_right:self_bomb->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / focus:player_back_right / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは38点差で見送り、ためるは38点差で見送り
- board: player_front_left:デスシープ Lv1 HP6 / player_front_right:ボムゾウ Lv1 HP6 / player_back_left:ピグミィ Lv1 HP3 / player_back_right:ドノマンティス Lv1 HP5 prep / cpu_front_left:ガンプ Lv1 HP5 prep / cpu_front_right:ファントム Lv1 HP5 prep / cpu_back_left:グングニエル Lv1 HP5 prep

### top5_backline_work_wait: ドノマンティス -> player_back_right seed 137308 turn 2

- opponent/outcome: `black_pressure_strong` / player loss
- selected: ドノマンティス -> player_back_right / score 24.2 / front ボムゾウ Lv1 HP6 / stones 2
- best hold: focus:player_front_left / gap 38.3 / total -14.1
- best non-summon: focus:player_front_left / gap 38.3 / total -14.1
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=7 / top5=4:ピグミィ
- next turn: attack:player_front_right:self_bomb->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / focus:player_back_right / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは38点差で見送り、ためるは38点差で見送り
- board: player_front_left:デスシープ Lv1 HP6 / player_front_right:ボムゾウ Lv1 HP6 / player_back_left:ピグミィ Lv1 HP3 / player_back_right:ドノマンティス Lv1 HP5 prep / cpu_front_left:ガンプ Lv1 HP5 prep / cpu_front_right:ファントム Lv1 HP5 prep / cpu_back_left:グングニエル Lv1 HP5 prep

### close_hold_alt: ドノマンティス -> player_back_right seed 137309 turn 5

- opponent/outcome: `black_pressure_strong` / player loss
- selected: ドノマンティス -> player_back_right / score 65.8 / front ポリスピナー Lv2 HP3 / stones 0
- best hold: focus:player_front_right / gap 31.6 / total 34.2
- best non-summon: focus:player_front_right / gap 31.6 / total 34.2
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=8 / top5=2:ボムゾウ,3:ピグミィ
- next turn: attack:player_front_right:attack->master:cpu / attack:player_front_right:attack->master:cpu / focus:player_front_left / focus:player_back_right / master:shield->monster:player_front_right / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは32点差で見送り、攻撃は48点差で見送り
- board: player_front_left:ドノマンティス Lv1 HP5 / player_front_right:ポリスピナー Lv2 HP3 / player_back_left:真勇者ダイン Lv1 HP6 / player_back_right:ドノマンティス Lv1 HP5 prep / cpu_front_right:ファントム Lv1 HP4 / cpu_back_left:ロブーン Lv1 HP1

### top5_backline_work_wait: ドノマンティス -> player_back_right seed 137309 turn 5

- opponent/outcome: `black_pressure_strong` / player loss
- selected: ドノマンティス -> player_back_right / score 65.8 / front ポリスピナー Lv2 HP3 / stones 0
- best hold: focus:player_front_right / gap 31.6 / total 34.2
- best non-summon: focus:player_front_right / gap 31.6 / total 34.2
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=8 / top5=2:ボムゾウ,3:ピグミィ
- next turn: attack:player_front_right:attack->master:cpu / attack:player_front_right:attack->master:cpu / focus:player_front_left / focus:player_back_right / master:shield->monster:player_front_right / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは32点差で見送り、攻撃は48点差で見送り
- board: player_front_left:ドノマンティス Lv1 HP5 / player_front_right:ポリスピナー Lv2 HP3 / player_back_left:真勇者ダイン Lv1 HP6 / player_back_right:ドノマンティス Lv1 HP5 prep / cpu_front_right:ファントム Lv1 HP4 / cpu_back_left:ロブーン Lv1 HP1

### close_hold_alt: 真勇者ダイン -> player_back_left seed 137311 turn 12

- opponent/outcome: `black_pressure_strong` / player loss
- selected: 真勇者ダイン -> player_back_left / score 62.8 / front ボムゾウ Lv1 HP1 / stones 4
- best hold: focus:player_back_right / gap 21.8 / total 41
- best non-summon: focus:player_back_right / gap 21.8 / total 41
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=4 / top5=5:ピグミィ
- next turn: attack:player_front_right:attack->master:cpu / focus:player_front_left / summon:player_card_047_1->player_back_left / end_turn
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は16点差で見送り、ためるは22点差で見送り
- board: player_front_left:ボムゾウ Lv1 HP1 / player_front_right:ドノマンティス Lv1 HP2 / player_back_left:真勇者ダイン Lv1 HP6 prep / player_back_right:ヤンバル Lv1 HP1

### top5_backline_work_wait: 真勇者ダイン -> player_back_left seed 137311 turn 12

- opponent/outcome: `black_pressure_strong` / player loss
- selected: 真勇者ダイン -> player_back_left / score 62.8 / front ボムゾウ Lv1 HP1 / stones 4
- best hold: focus:player_back_right / gap 21.8 / total 41
- best non-summon: focus:player_back_right / gap 21.8 / total 41
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=4 / top5=5:ピグミィ
- next turn: attack:player_front_right:attack->master:cpu / focus:player_front_left / summon:player_card_047_1->player_back_left / end_turn
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は16点差で見送り、ためるは22点差で見送り
- board: player_front_left:ボムゾウ Lv1 HP1 / player_front_right:ドノマンティス Lv1 HP2 / player_back_left:真勇者ダイン Lv1 HP6 prep / player_back_right:ヤンバル Lv1 HP1

### top5_backline_work_wait: 真勇者ダイン -> player_back_left seed 137311 turn 13

- opponent/outcome: `black_pressure_strong` / player loss
- selected: 真勇者ダイン -> player_back_left / score 24.5 / front 真勇者ダイン Lv1 HP6 / stones 7
- best hold: end_turn / gap 248.5 / total -224
- best non-summon: end_turn / gap 248.5 / total -224
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=4 / top5=4:ピグミィ,5:ボムゾウ
- next turn: magic:player_card_093_1->master:player / summon:player_card_037_2->player_back_left / attack:player_front_right:ダイン斬り->master:cpu / end_turn
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は16点差で見送り
- board: player_front_left:真勇者ダイン Lv1 HP6 / player_front_right:ドノマンティス Lv1 HP2 / player_back_left:真勇者ダイン Lv1 HP6 prep / player_back_right:ヤンバル Lv1 HP1

### close_hold_alt: ドノマンティス -> player_back_left seed 137311 turn 14

- opponent/outcome: `black_pressure_strong` / player loss
- selected: ドノマンティス -> player_back_left / score 35.6 / front 真勇者ダイン Lv1 HP6 / stones 7
- best hold: focus:player_front_left / gap 16.4 / total 19.2
- best non-summon: focus:player_front_left / gap 16.4 / total 19.2
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=4 / top5=3:ピグミィ,4:ボムゾウ
- next turn: attack:player_front_left:ダイン斬り->master:cpu / master:shield->monster:player_back_right / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは16点差で見送り、攻撃は92点差で見送り
- board: player_front_left:真勇者ダイン Lv1 HP6 / player_front_right:真勇者ダイン Lv1 HP6 / player_back_left:ドノマンティス Lv1 HP5 prep / player_back_right:ヤンバル Lv1 HP1 / cpu_front_right:ガンプ Lv1 HP5 prep

### top5_backline_work_wait: ドノマンティス -> player_back_left seed 137311 turn 14

- opponent/outcome: `black_pressure_strong` / player loss
- selected: ドノマンティス -> player_back_left / score 35.6 / front 真勇者ダイン Lv1 HP6 / stones 7
- best hold: focus:player_front_left / gap 16.4 / total 19.2
- best non-summon: focus:player_front_left / gap 16.4 / total 19.2
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=4 / top5=3:ピグミィ,4:ボムゾウ
- next turn: attack:player_front_left:ダイン斬り->master:cpu / master:shield->monster:player_back_right / end_turn
- reason: ドノマンティスを空き枠へ召喚 / 見送り: ためるは16点差で見送り、攻撃は92点差で見送り
- board: player_front_left:真勇者ダイン Lv1 HP6 / player_front_right:真勇者ダイン Lv1 HP6 / player_back_left:ドノマンティス Lv1 HP5 prep / player_back_right:ヤンバル Lv1 HP1 / cpu_front_right:ガンプ Lv1 HP5 prep

### top5_backline_work_wait: ポリスピナー -> cpu_back_right seed 137312 turn 2

- opponent/outcome: `black_pressure_strong` / cpu loss
- selected: ポリスピナー -> cpu_back_right / score 34.1 / front ドノマンティス Lv1 HP5 / stones 2
- best hold: focus:cpu_front_right / gap 122.4 / total -88.3
- best non-summon: focus:cpu_front_right / gap 122.4 / total -88.3
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=8 / top5=1:ボムゾウ,2:ボムゾウ
- next turn: attack:cpu_front_left:ダイン斬り->monster:player_front_left / master:master_attack->monster:player_front_right / attack:cpu_back_left:wild_claw->monster:player_front_right / focus:cpu_front_right / focus:cpu_back_right / end_turn
- reason: カードを後列右へ召喚 / 見送り: ためるは122点差で見送り、攻撃は123点差で見送り
- board: player_front_right:ナッツロックル Lv1 HP6 / player_back_left:ゴーント Lv1 HP1 / cpu_front_left:真勇者ダイン Lv1 HP6 / cpu_front_right:ドノマンティス Lv1 HP5 / cpu_back_left:ヤンバル Lv2 HP3 / cpu_back_right:ポリスピナー Lv1 HP3 prep

### top5_backline_work_wait: デスシープ -> cpu_back_left seed 137313 turn 9

- opponent/outcome: `black_pressure_strong` / cpu win
- selected: デスシープ -> cpu_back_left / score 68.1 / front デスシープ Lv2 HP4 / stones 4
- best hold: master:master_attack->monster:player_front_left / gap 83 / total -14.8
- best non-summon: move:cpu_back_right->cpu_back_left / gap 61.6 / total 6.5
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=7 / top5=2:ヤンバル,3:ヤンバル
- next turn: attack:cpu_front_right:ダイン斬り->master:player / focus:cpu_front_left / summon:cpu_card_133_2->cpu_back_left / master:shield->monster:cpu_front_left / end_turn
- reason: カードを後列左へ召喚 / 見送り: 召喚は13点差で見送り、移動は62点差で見送り
- board: player_front_left:ナッツロックル Lv1 HP5 / player_back_left:ビヨンド Lv1 HP1 / player_back_right:ロブーン Lv1 HP1 prep / cpu_front_left:デスシープ Lv2 HP4 / cpu_front_right:真勇者ダイン Lv3 HP6 / cpu_back_left:デスシープ Lv1 HP6 prep / cpu_back_right:ピグミィ Lv1 HP3

### top5_backline_work_wait: デスシープ -> cpu_back_left seed 137313 turn 10

- opponent/outcome: `black_pressure_strong` / cpu win
- selected: デスシープ -> cpu_back_left / score -22.1 / front デスシープ Lv1 HP6 / stones 5
- best hold: end_turn / gap 209.3 / total -231.5
- best non-summon: end_turn / gap 209.3 / total -231.5
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=7 / top5=1:ヤンバル,2:ヤンバル
- next turn: master:wake_up->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / attack:cpu_front_right:ダイン斬り->master:player / focus:cpu_front_left / focus:cpu_back_left / master:shield->monster:cpu_front_right / end_turn
- reason: カードを後列左へ召喚 / 見送り: 召喚は13点差で見送り
- board: player_front_left:ゾンビ Lv1 HP4 prep / player_back_left:ロブーン Lv1 HP1 / cpu_front_left:デスシープ Lv1 HP6 / cpu_front_right:真勇者ダイン Lv3 HP3 / cpu_back_left:デスシープ Lv1 HP6 prep / cpu_back_right:ピグミィ Lv1 HP3

### top5_backline_work_wait: 真勇者ダイン -> cpu_back_right seed 137314 turn 7

- opponent/outcome: `black_pressure_strong` / cpu win
- selected: 真勇者ダイン -> cpu_back_right / score 37.9 / front ボムゾウ Lv1 HP6 / stones 10
- best hold: end_turn / gap 232.6 / total -194.7
- best non-summon: end_turn / gap 232.6 / total -194.7
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=6 / top5=3:ヤンバル
- next turn: focus:cpu_front_left / focus:cpu_front_right / summon:cpu_card_037_2->cpu_back_left / end_turn
- reason: カードを後列右へ召喚
- board: cpu_front_left:真勇者ダイン Lv1 HP6 / cpu_front_right:ボムゾウ Lv1 HP6 / cpu_back_left:ピグミィ Lv2 HP1 / cpu_back_right:真勇者ダイン Lv1 HP6 prep

### close_hold_alt: ドノマンティス -> cpu_back_left seed 137314 turn 8

- opponent/outcome: `black_pressure_strong` / cpu win
- selected: ドノマンティス -> cpu_back_left / score 53 / front 真勇者ダイン Lv1 HP5 / stones 12
- best hold: focus:cpu_back_right / gap 8.8 / total 44.2
- best non-summon: focus:cpu_back_right / gap 8.8 / total 44.2
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=6 / top5=2:ヤンバル
- next turn: attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_front_right:ダイン斬り->master:player / summon:cpu_polyspinner_2->cpu_back_right / focus:cpu_back_left / master:shield->monster:cpu_front_left / end_turn
- reason: カードを後列左へ召喚 / 見送り: ためるは9点差で見送り
- board: player_back_left:ゼック Lv1 HP2 prep / cpu_front_left:真勇者ダイン Lv1 HP5 / cpu_front_right:ボムゾウ Lv1 HP4 / cpu_back_left:ドノマンティス Lv1 HP5 prep / cpu_back_right:真勇者ダイン Lv1 HP6

### top5_backline_work_wait: ドノマンティス -> cpu_back_left seed 137314 turn 8

- opponent/outcome: `black_pressure_strong` / cpu win
- selected: ドノマンティス -> cpu_back_left / score 53 / front 真勇者ダイン Lv1 HP5 / stones 12
- best hold: focus:cpu_back_right / gap 8.8 / total 44.2
- best non-summon: focus:cpu_back_right / gap 8.8 / total 44.2
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=6 / top5=2:ヤンバル
- next turn: attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_front_right:ダイン斬り->master:player / summon:cpu_polyspinner_2->cpu_back_right / focus:cpu_back_left / master:shield->monster:cpu_front_left / end_turn
- reason: カードを後列左へ召喚 / 見送り: ためるは9点差で見送り
- board: player_back_left:ゼック Lv1 HP2 prep / cpu_front_left:真勇者ダイン Lv1 HP5 / cpu_front_right:ボムゾウ Lv1 HP4 / cpu_back_left:ドノマンティス Lv1 HP5 prep / cpu_back_right:真勇者ダイン Lv1 HP6

### close_hold_alt: ポリスピナー -> cpu_back_right seed 137314 turn 9

- opponent/outcome: `black_pressure_strong` / cpu win
- selected: ポリスピナー -> cpu_back_right / score 57 / front 真勇者ダイン Lv1 HP6 / stones 14
- best hold: focus:cpu_back_left / gap 10.8 / total 46.2
- best non-summon: focus:cpu_back_left / gap 10.8 / total 46.2
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=6 / top5=1:ヤンバル
- next turn: attack:cpu_front_left:ダイン斬り->master:player / end_turn
- reason: カードを後列右へ召喚 / 見送り: ためるは11点差で見送り
- board: cpu_front_left:真勇者ダイン Lv2 HP6 / cpu_front_right:真勇者ダイン Lv1 HP6 / cpu_back_left:ドノマンティス Lv1 HP5 / cpu_back_right:ポリスピナー Lv1 HP3 prep

### top5_backline_work_wait: ポリスピナー -> cpu_back_right seed 137314 turn 9

- opponent/outcome: `black_pressure_strong` / cpu win
- selected: ポリスピナー -> cpu_back_right / score 57 / front 真勇者ダイン Lv1 HP6 / stones 14
- best hold: focus:cpu_back_left / gap 10.8 / total 46.2
- best non-summon: focus:cpu_back_left / gap 10.8 / total 46.2
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=6 / top5=1:ヤンバル
- next turn: attack:cpu_front_left:ダイン斬り->master:player / end_turn
- reason: カードを後列右へ召喚 / 見送り: ためるは11点差で見送り
- board: cpu_front_left:真勇者ダイン Lv2 HP6 / cpu_front_right:真勇者ダイン Lv1 HP6 / cpu_back_left:ドノマンティス Lv1 HP5 / cpu_back_right:ポリスピナー Lv1 HP3 prep

### top5_backline_work_wait: ポリスピナー -> cpu_back_left seed 137315 turn 6

- opponent/outcome: `black_pressure_strong` / cpu loss
- selected: ポリスピナー -> cpu_back_left / score 45.9 / front 真勇者ダイン Lv2 HP2 / stones 4
- best hold: end_turn / gap 338.3 / total -292.4
- best non-summon: end_turn / gap 338.3 / total -292.4
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=7 / top5=1:ピグミィ,3:ボムゾウ
- next turn: master:master_attack->monster:player_front_left / attack:cpu_front_right:ダイン斬り->master:player / focus:cpu_front_left / attack:cpu_front_left:attack->monster:player_front_left / summon:cpu_card_051_3->cpu_back_left / master:shield->monster:cpu_front_left / end_turn
- reason: カードを後列左へ召喚
- board: player_front_left:ヒートロン Lv1 HP5 prep / cpu_front_left:真勇者ダイン Lv2 HP2 / cpu_front_right:真勇者ダイン Lv1 HP3 / cpu_back_left:ポリスピナー Lv1 HP3 prep / cpu_back_right:デスシープ Lv1 HP6


## Notes

- 近い hold slot 代替が一定数ある。候補生成には残っているため、評価調整で拾える可能性が高い。
- 中距離の hold slot 代替が多い。強い禁止ではなく、ターン計画比較の追加評価が向いている。
- 山札上位5枚に後列仕事カードが残る例が多い。近い将来の置き場価値を局面評価に入れる価値がある。

## Next Loop Proposal

- 次は勝率係数ではなく、最後の後列枠を潰す召喚に対して `bestHold.deltaFromSelected` を記録する回帰ケースを作る。
- `hold slot` 候補が80点以内にある局面だけ、後列仕事カードの近いドローと同カード前列代替を加点/減点候補にする。
- 山札上位5枚に後列仕事カードがある場合だけ、枠保持の局面評価を追加する。全体の後列枠保存にはしない。
- 採用候補は黒限定 no-history で小母数確認し、白ミラーは最後に副作用確認だけ行う。
