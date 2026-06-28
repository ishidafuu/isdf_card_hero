# White Shield Follow-up Loss Audit

生成: 2026-06-28T06:23:47.087Z
seedStart: 135200
候補: current_white_baseline
相手: black_1375_pressure, white_current_mirror
試行: 3 games/matchup/direction
総試合: 12
負け試合: 6
盾あり負け試合: 6

## Purpose

盾をさらに減らすのではなく、負けseedのシールドが「攻撃」「ウェイクアップ」「敵前衛処理」へ接続できているかを見る。勝率採用判断ではなく、次の改善仮説を作るための監査。

## Summary

- 負け試合中のシールド: 46
- Team connected: 33 (71.7%)
- Target connected: 25 (54.3%)
- Front process connected: 31 (67.4%)
- Front damage/kill: 25 (54.3%)
- No contact / no connection: 3 (6.5%)
- Contact / no connection: 10 (21.7%)
- Low stone after shield: 33 (71.7%)
- Multi-shield turn: 12 (26.1%)
- Shield before same-turn work: 0 (0%)

## Variant Metrics

| Variant | W-L-D | Loss Shield | Team Conn | Target Conn | Front Proc | Front Dmg/Kill | Same Attack | Same Wake | Next Attack | Next Wake | NoContact NoConn | Contact NoConn | Removed | LowStone | MultiShield | Shield Before Work | Retreat |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 6-6-0 | 46 | 33 (71.7%) | 25 (54.3%) | 31 (67.4%) | 25 (54.3%) | 0 (0%) | 0 (0%) | 33 (71.7%) | 1 (2.2%) | 3 (6.5%) | 10 (21.7%) | 10 (21.7%) | 33 (71.7%) | 12 (26.1%) | 0 (0%) | 0 (0%) |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Loss Shield | Team Conn | Target Conn | Front Proc | NoContact NoConn | MultiShield |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | black_1375_pressure | 4-2-0 | 10 | 8 (80%) | 8 (80%) | 8 (80%) | 0 (0%) | 5 (50%) |
| current_white_baseline | white_current_mirror | 2-4-0 | 36 | 25 (69.4%) | 17 (47.2%) | 23 (63.9%) | 3 (8.3%) | 7 (19.4%) |

## Samples

### front_process_connected: ポリスピナー seed 135200 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player)
- decision: player_front_right / role front / stones after 0 / score 48.5
- flags: team-connected, target-connected, front-process, no-contact, low-stone
- same turn: end_turn
- next turn: attack:player_front_right:attack->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / attack:player_front_left:storm_bomb->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- opponent response: master:berserk_power->monster:cpu_back_left / attack:cpu_back_left:wild_claw->master:player / focus:cpu_front_right / focus:cpu_front_left
- reason: 高価値の味方を守るためシールド
- board: PF:ボムゾウ Lv1 HP6 prep / PF:ポリスピナー Lv1 HP3 / PB:ピグミィ Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ナッツロックル Lv1 HP6 prep / CF:ヤミー Lv1 HP5 prep / CB:ヤンバル Lv1 HP3 prep

### front_process_connected: ボムゾウ seed 135200 turn 3

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player)
- decision: player_front_left / role front / stones after 1 / score 73.6
- flags: team-connected, target-connected, front-process, no-contact, low-stone
- same turn: end_turn
- next turn: attack:player_front_left:storm_bomb->monster:cpu_back_left / attack:player_back_left:スパイクボール->monster:cpu_back_left / summon:player_card_051_2->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_left / ...
- opponent response: master:berserk_power->monster:cpu_front_right / attack:cpu_front_right:attack->monster:player_front_right / focus:cpu_front_left / focus:cpu_back_left
- reason: 次ターンのレベルアップ筋を残すためシールド / 見送り: マスター特技は9点差で見送り、マスター特技は25点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ポリスピナー Lv1 HP3 / PB:ピグミィ Lv2 HP3 / PB:ピグミィ Lv1 HP3 / CF:ナッツロックル Lv1 HP6 / CB:ヤンバル Lv1 HP1 / CB:ユニフォーン Lv1 HP5 prep

### front_process_connected: 真勇者ダイン seed 135200 turn 6

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player)
- decision: player_front_right / role front / stones after 2 / score 67.3
- flags: team-connected, target-connected, front-process, no-contact, low-stone, multi-shield-turn
- same turn: master:shield->monster:player_front_left / end_turn
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / master:master_attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / attack:player_front_left:self_bomb->master:cpu / ...
- opponent response: master:berserk_power->monster:cpu_front_left / master:berserk_power->monster:cpu_front_right / attack:cpu_front_left:attack->master:player / attack:cpu_front_right:self_bomb->master:player
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は13点差で見送り
- board: PF:ボムゾウ Lv2 HP5 / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ボムゾウ Lv1 HP6 prep / CB:ユニフォーン Lv1 HP5 / CB:ユニフォーン Lv1 HP5 prep

### front_process_connected: ボムゾウ seed 135200 turn 6

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player)
- decision: player_front_left / role front / stones after 0 / score 58.4
- flags: team-connected, target-connected, front-process, no-contact, low-stone, multi-shield-turn
- same turn: end_turn
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / master:master_attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / attack:player_front_left:self_bomb->master:cpu / ...
- opponent response: master:berserk_power->monster:cpu_front_left / master:berserk_power->monster:cpu_front_right / attack:cpu_front_left:attack->master:player / attack:cpu_front_right:self_bomb->master:player
- reason: 高価値の味方を守るためシールド
- board: PF:ボムゾウ Lv2 HP5 / PF:真勇者ダイン Lv3 HP6 shield / PB:ピグミィ Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ボムゾウ Lv1 HP6 prep / CB:ユニフォーン Lv1 HP5 / CB:ユニフォーン Lv1 HP5 prep

### front_process_connected: ヤンバル seed 135204 turn 4

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu)
- decision: cpu_back_right / role back / stones after 0 / score 58.8
- flags: team-connected, target-connected, front-process, no-contact, low-stone
- same turn: end_turn
- next turn: attack:cpu_back_left:wild_claw->monster:player_front_left / attack:cpu_back_right:wild_claw->master:player / focus:cpu_front_right / focus:cpu_front_left / ...
- opponent response: summon:player_card_047_2->player_front_right / master:berserk_power->monster:player_front_left / summon:player_polyspinner_3->player_back_right / attack:player_front_left:self_bomb->master:cpu
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は44点差で見送り、マスター特技は44点差で見送り
- board: PF:ボムゾウ Lv1 HP6 prep / PB:ボムゾウ Lv1 HP6 prep / CF:真勇者ダイン Lv1 HP6 prep / CF:ボムゾウ Lv2 HP5 / CB:ヤンバル Lv2 HP3 / CB:ヤンバル Lv2 HP3

### contact_no_connection: ボムゾウ seed 135204 turn 6

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu)
- decision: cpu_front_right / role front / stones after 2 / score 121.2
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, multi-shield-turn
- same turn: master:shield->monster:cpu_front_left / end_turn
- next turn: -
- opponent response: attack:player_front_right:attack->monster:cpu_front_right
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は107点差で見送り、マスター特技は166点差で見送り
- board: PB:ポリスピナー Lv1 HP3 prep / PB:ポリスピナー Lv1 HP3 / CF:真勇者ダイン Lv2 HP6 / CF:ボムゾウ Lv2 HP2 / CB:ヤンバル Lv2 HP3 shield / CB:ヤンバル Lv2 HP3

### removed_without_connection: ボムゾウ seed 135204 turn 6

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu)
- decision: cpu_front_right / role front / stones after 2 / score 121.2
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, multi-shield-turn
- same turn: master:shield->monster:cpu_front_left / end_turn
- next turn: -
- opponent response: attack:player_front_right:attack->monster:cpu_front_right
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は107点差で見送り、マスター特技は166点差で見送り
- board: PB:ポリスピナー Lv1 HP3 prep / PB:ポリスピナー Lv1 HP3 / CF:真勇者ダイン Lv2 HP6 / CF:ボムゾウ Lv2 HP2 / CB:ヤンバル Lv2 HP3 shield / CB:ヤンバル Lv2 HP3

### low_stone_no_connection: ボムゾウ seed 135204 turn 6

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu)
- decision: cpu_front_right / role front / stones after 2 / score 121.2
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, multi-shield-turn
- same turn: master:shield->monster:cpu_front_left / end_turn
- next turn: -
- opponent response: attack:player_front_right:attack->monster:cpu_front_right
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は107点差で見送り、マスター特技は166点差で見送り
- board: PB:ポリスピナー Lv1 HP3 prep / PB:ポリスピナー Lv1 HP3 / CF:真勇者ダイン Lv2 HP6 / CF:ボムゾウ Lv2 HP2 / CB:ヤンバル Lv2 HP3 shield / CB:ヤンバル Lv2 HP3

### multi_shield_no_connection: ボムゾウ seed 135204 turn 6

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu)
- decision: cpu_front_right / role front / stones after 2 / score 121.2
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, multi-shield-turn
- same turn: master:shield->monster:cpu_front_left / end_turn
- next turn: -
- opponent response: attack:player_front_right:attack->monster:cpu_front_right
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は107点差で見送り、マスター特技は166点差で見送り
- board: PB:ポリスピナー Lv1 HP3 prep / PB:ポリスピナー Lv1 HP3 / CF:真勇者ダイン Lv2 HP6 / CF:ボムゾウ Lv2 HP2 / CB:ヤンバル Lv2 HP3 shield / CB:ヤンバル Lv2 HP3

### contact_no_connection: ヤンバル seed 135204 turn 8

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu)
- decision: cpu_front_right / role back / stones after 8 / score 70
- flags: team-not-connected, target-not-connected, contact:1, removed
- same turn: end_turn
- next turn: -
- opponent response: master:berserk_power->monster:player_front_right / attack:player_front_right:ダイン斬り->monster:cpu_front_right
- reason: 倒されそうな高価値味方を守るためシールド
- board: PF:真勇者ダイン Lv1 HP6 prep / CF:真勇者ダイン Lv3 HP3 / CF:ヤンバル Lv2 HP1

### removed_without_connection: ヤンバル seed 135204 turn 8

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu)
- decision: cpu_front_right / role back / stones after 8 / score 70
- flags: team-not-connected, target-not-connected, contact:1, removed
- same turn: end_turn
- next turn: -
- opponent response: master:berserk_power->monster:player_front_right / attack:player_front_right:ダイン斬り->monster:cpu_front_right
- reason: 倒されそうな高価値味方を守るためシールド
- board: PF:真勇者ダイン Lv1 HP6 prep / CF:真勇者ダイン Lv3 HP3 / CF:ヤンバル Lv2 HP1

### contact_no_connection: ピグミィ seed 135207 turn 19

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role back / stones after 2 / score 85
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: attack:cpu_back_right:wild_claw->monster:player_front_left
- reason: 倒されそうな高価値味方を守るためシールド / 見送り: マスター特技は34点差で見送り
- board: PF:ピグミィ Lv1 HP2 / PF:デスシープ Lv1 HP6 prep / PB:ピグミィ Lv2 HP3 / CF:ピグミィ Lv1 HP3 / CF:デスシープ Lv2 HP2 shield / CB:ヤンバル Lv1 HP3 prep / CB:ヤンバル Lv2 HP1

### removed_without_connection: ピグミィ seed 135207 turn 19

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role back / stones after 2 / score 85
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: attack:cpu_back_right:wild_claw->monster:player_front_left
- reason: 倒されそうな高価値味方を守るためシールド / 見送り: マスター特技は34点差で見送り
- board: PF:ピグミィ Lv1 HP2 / PF:デスシープ Lv1 HP6 prep / PB:ピグミィ Lv2 HP3 / CF:ピグミィ Lv1 HP3 / CF:デスシープ Lv2 HP2 shield / CB:ヤンバル Lv1 HP3 prep / CB:ヤンバル Lv2 HP1

### low_stone_no_connection: ピグミィ seed 135207 turn 19

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role back / stones after 2 / score 85
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: attack:cpu_back_right:wild_claw->monster:player_front_left
- reason: 倒されそうな高価値味方を守るためシールド / 見送り: マスター特技は34点差で見送り
- board: PF:ピグミィ Lv1 HP2 / PF:デスシープ Lv1 HP6 prep / PB:ピグミィ Lv2 HP3 / CF:ピグミィ Lv1 HP3 / CF:デスシープ Lv2 HP2 shield / CB:ヤンバル Lv1 HP3 prep / CB:ヤンバル Lv2 HP1

### no_contact_no_connection: ピグミィ seed 135207 turn 24

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role back / stones after 6 / score 123.4
- flags: team-not-connected, target-not-connected, no-contact
- same turn: end_turn
- next turn: -
- opponent response: attack:cpu_front_right:呪いの刃->master:player
- reason: 致死圏の味方を守れるためシールド
- board: PF:ピグミィ Lv2 HP3 / PB:ヤンバル Lv2 HP3 / CF:ドノマンティス Lv2 HP5 shield / CB:ヤンバル Lv2 HP3

### contact_no_connection: ボムゾウ seed 135208 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_back_left / role front / stones after 0 / score 54.8
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: attack:cpu_front_left:wild_claw->monster:player_back_right / attack:cpu_front_right:スパイクボール->monster:player_back_right / attack:cpu_back_right:wild_claw->monster:player_front_left / attack:cpu_front_right:スパイクボール->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は3点差で見送り、マスター特技は5点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv1 HP6 prep / PB:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv1 HP3 / CF:ピグミィ Lv1 HP3 prep / CB:ヤンバル Lv1 HP3 / CB:ヤンバル Lv1 HP3

### removed_without_connection: ボムゾウ seed 135208 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_back_left / role front / stones after 0 / score 54.8
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: attack:cpu_front_left:wild_claw->monster:player_back_right / attack:cpu_front_right:スパイクボール->monster:player_back_right / attack:cpu_back_right:wild_claw->monster:player_front_left / attack:cpu_front_right:スパイクボール->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は3点差で見送り、マスター特技は5点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv1 HP6 prep / PB:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv1 HP3 / CF:ピグミィ Lv1 HP3 prep / CB:ヤンバル Lv1 HP3 / CB:ヤンバル Lv1 HP3

### low_stone_no_connection: ボムゾウ seed 135208 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_back_left / role front / stones after 0 / score 54.8
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: attack:cpu_front_left:wild_claw->monster:player_back_right / attack:cpu_front_right:スパイクボール->monster:player_back_right / attack:cpu_back_right:wild_claw->monster:player_front_left / attack:cpu_front_right:スパイクボール->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は3点差で見送り、マスター特技は5点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv1 HP6 prep / PB:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv1 HP3 / CF:ピグミィ Lv1 HP3 prep / CB:ヤンバル Lv1 HP3 / CB:ヤンバル Lv1 HP3

### contact_no_connection: ボムゾウ seed 135208 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 1 / score 121.2
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: attack:cpu_back_right:wild_claw->monster:player_front_left / summon:cpu_card_037_3->cpu_front_left / master:wake_up->monster:cpu_front_left / attack:cpu_front_left:attack->monster:player_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は291点差で見送り
- board: PF:ボムゾウ Lv2 HP2 / PF:真勇者ダイン Lv1 HP6 / PB:デスシープ Lv1 HP6 prep / PB:デスシープ Lv1 HP6 prep / CF:ピグミィ Lv2 HP3 shield / CB:ヤンバル Lv1 HP3

### removed_without_connection: ボムゾウ seed 135208 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 1 / score 121.2
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: attack:cpu_back_right:wild_claw->monster:player_front_left / summon:cpu_card_037_3->cpu_front_left / master:wake_up->monster:cpu_front_left / attack:cpu_front_left:attack->monster:player_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は291点差で見送り
- board: PF:ボムゾウ Lv2 HP2 / PF:真勇者ダイン Lv1 HP6 / PB:デスシープ Lv1 HP6 prep / PB:デスシープ Lv1 HP6 prep / CF:ピグミィ Lv2 HP3 shield / CB:ヤンバル Lv1 HP3

### low_stone_no_connection: ボムゾウ seed 135208 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 1 / score 121.2
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: attack:cpu_back_right:wild_claw->monster:player_front_left / summon:cpu_card_037_3->cpu_front_left / master:wake_up->monster:cpu_front_left / attack:cpu_front_left:attack->monster:player_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は291点差で見送り
- board: PF:ボムゾウ Lv2 HP2 / PF:真勇者ダイン Lv1 HP6 / PB:デスシープ Lv1 HP6 prep / PB:デスシープ Lv1 HP6 prep / CF:ピグミィ Lv2 HP3 shield / CB:ヤンバル Lv1 HP3

### low_stone_no_connection: ピグミィ seed 135209 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role back / stones after 2 / score 115.6
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: attack:player_front_right:ダイン斬り->monster:cpu_front_right / attack:player_back_right:wild_claw->monster:cpu_front_right
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は125点差で見送り、マスター特技は153点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 shield / PB:ピグミィ Lv1 HP3 prep / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ピグミィ Lv1 HP3 / CB:ヤンバル Lv2 HP3 / CB:ヤンバル Lv1 HP3 prep

### no_contact_no_connection: デスシープ seed 135210 turn 14

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 1 / score 55
- flags: team-not-connected, target-not-connected, no-contact, low-stone
- same turn: end_turn
- next turn: focus:cpu_front_right / summon:cpu_yanbaru_2->cpu_back_right / focus:cpu_front_left / magic:cpu_card_093_1->master:cpu / ...
- opponent response: attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / move:player_front_left->player_back_left / summon:player_card_133_3->player_front_left
- reason: 高価値の味方を守るためシールド
- board: PF:ドノマンティス Lv1 HP5 prep / PB:ピグミィ Lv2 HP3 / PB:ピグミィ Lv2 HP3 shield / CF:デスシープ Lv1 HP6 / CF:デスシープ Lv1 HP6 / CB:ドノマンティス Lv1 HP5 prep

### no_contact_no_connection: ドノマンティス seed 135210 turn 16

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 1 / score 53.9
- flags: team-not-connected, target-not-connected, no-contact, low-stone
- same turn: end_turn
- next turn: summon:cpu_card_133_1->cpu_back_left / summon:cpu_polyspinner_2->cpu_back_right / end_turn
- opponent response: attack:player_back_right:スパイクボール->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_back_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り、マスター特技は4点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv1 HP6 shield / PB:ピグミィ Lv2 HP3 / PB:ピグミィ Lv2 HP3 / CF:ドノマンティス Lv1 HP5 / CF:デスシープ Lv1 HP4 / CB:ヤンバル Lv1 HP3 / CB:デスシープ Lv1 HP6


## Notes

- この監査はAI本体を変更しない。負け試合に出たシールドだけを、同ターン/次自ターンの仕事へつながったかで分類する。
- `team-connected` は盾対象以外の攻撃/ウェイクも含む。`target-connected` は盾対象自身が攻撃/レベルアップへ変換されたケース。
- `front-process` は敵前衛への攻撃が選ばれたケースで、`front damage/kill` はその攻撃でHP減少または除去が発生したケース。
- 相手に触られたが後続仕事へ残らない盾が一定数ある。守り切れない対象を守るより、相手に追加手数を強いるか、次ターンの処理役を残せたかで分ける必要がある。
- 負け試合で同ターン複数盾が多い。盾の枚数削減ではなく、2枚目盾が後続仕事を消していないかを局面条件で見る必要がある。

## Next Loop Proposal

- 次は `shieldConnectionPlanAudit` として、シールド選択時に「この後または次自ターンに誰が何をする予定か」を候補評価ログへ出す。
- 同ターン2枚盾は、2枚目の後に仕事が残る場合だけ許す条件を設計する。単純ペナルティではなく `second shield keeps a converter alive` を見る。

## Reading

- `Team Conn`: 盾後、同ターンまたは次自ターンに自軍の攻撃/ウェイク/敵前衛処理が発生した割合。
- `Target Conn`: 盾対象自身が同ターン/次自ターンに攻撃、敵前衛処理、レベルアップへ変換された割合。
- `Front Proc`: 盾後の同ターン/次自ターンに敵前衛を攻撃した割合。
- `NoContact NoConn`: 次自ターンまで相手に触られず、かつ後続仕事にもつながらなかった盾。
- `Shield Before Work`: 同ターンに盾より後で攻撃またはウェイクアップをしているケース。相手反撃がないなら行動順の疑いがある。
