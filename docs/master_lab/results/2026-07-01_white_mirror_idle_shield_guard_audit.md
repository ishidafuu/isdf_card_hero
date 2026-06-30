# White Shield Follow-up Loss Audit

生成: 2026-06-30T23:34:30.697Z
seedStart: 141300
候補: current_white_baseline, current_threat_then_setup
相手: white_current_mirror
試行: 2 games/matchup/direction
総試合: 8
負け試合: 5
盾あり負け試合: 5

## Purpose

盾をさらに減らすのではなく、負けseedのシールドが「攻撃」「ウェイクアップ」「敵前衛処理」へ接続できているかを見る。勝率採用判断ではなく、次の改善仮説を作るための監査。

## Summary

- 負け試合中のシールド: 37
- Team connected: 29 (78.4%)
- Target connected: 18 (48.6%)
- Front process connected: 27 (73%)
- Front damage/kill: 24 (64.9%)
- No contact / no connection: 2 (5.4%)
- Contact / no connection: 6 (16.2%)
- Low stone after shield: 34 (91.9%)
- Multi-shield turn: 2 (5.4%)
- Shield before same-turn work: 0 (0%)
- Any front-process plan: 35 (94.6%)
- No front-process plan: 2 (5.4%)
- Shield first with no front-process plan: 0 (0%)

## Variant Metrics

| Variant | W-L-D | Loss Shield | Team Conn | Target Conn | Front Proc | Front Dmg/Kill | Same Attack | Same Wake | Next Attack | Next Wake | NoContact NoConn | Contact NoConn | Removed | LowStone | MultiShield | Shield Before Work | Retreat |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 2-2-0 | 13 | 12 (92.3%) | 6 (46.2%) | 11 (84.6%) | 11 (84.6%) | 0 (0%) | 0 (0%) | 12 (92.3%) | 1 (7.7%) | 0 (0%) | 1 (7.7%) | 1 (7.7%) | 12 (92.3%) | 0 (0%) | 0 (0%) | 0 (0%) |
| current_threat_then_setup | 1-3-0 | 24 | 17 (70.8%) | 12 (50%) | 16 (66.7%) | 13 (54.2%) | 0 (0%) | 0 (0%) | 17 (70.8%) | 2 (8.3%) | 2 (8.3%) | 5 (20.8%) | 5 (20.8%) | 22 (91.7%) | 2 (8.3%) | 0 (0%) | 0 (0%) |

## Shield Connection Plan Metrics

| Variant | W-L-D | Loss Shield | Before Front | After Front | Next Front | Any Front Plan | No Front Plan | Shield First | Shield First No Plan | Shield After Front | Shield Before Front | Next Starts Front |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 2-2-0 | 13 | 10 (76.9%) | 0 (0%) | 11 (84.6%) | 12 (92.3%) | 1 (7.7%) | 0 (0%) | 0 (0%) | 10 (76.9%) | 0 (0%) | 4 (30.8%) |
| current_threat_then_setup | 1-3-0 | 24 | 21 (87.5%) | 0 (0%) | 16 (66.7%) | 23 (95.8%) | 1 (4.2%) | 1 (4.2%) | 0 (0%) | 21 (87.5%) | 0 (0%) | 9 (37.5%) |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Loss Shield | Team Conn | Target Conn | Front Proc | NoContact NoConn | MultiShield |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | white_current_mirror | 2-2-0 | 13 | 12 (92.3%) | 6 (46.2%) | 11 (84.6%) | 0 (0%) | 0 (0%) |
| current_threat_then_setup | white_current_mirror | 1-3-0 | 24 | 17 (70.8%) | 12 (50%) | 16 (66.7%) | 2 (8.3%) | 2 (8.3%) |

## Samples

### front_process_connected: デスシープ seed 141301 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 55
- flags: team-connected, target-not-connected, front-process, no-contact, low-stone, front-plan
- same turn before shield: summon:player_yanbaru_2->player_back_left / focus:player_front_right / focus:player_back_right / focus:player_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / move:player_front_left->player_back_left / ...
- next turn first: focus:player_front_right
- opponent response: attack:cpu_front_left:wild_claw->monster:player_front_right / focus:cpu_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_left / attack:cpu_back_right:スパイクボール->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は10点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:デスシープ Lv1 HP6 / PB:ヤンバル Lv1 HP3 prep / PB:ピグミィ Lv1 HP3 / CF:ボムゾウ Lv1 HP6 prep / CB:ヤンバル Lv1 HP3 prep / CB:ピグミィ Lv1 HP3 prep

### shield_after_front_process: デスシープ seed 141301 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 1 / score 55
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_right / focus:player_front_left / focus:player_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: summon:player_card_051_1->player_back_left / attack:player_front_left:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / master:shield->monster:player_front_left / ...
- next turn first: summon:player_card_051_1->player_back_left
- opponent response: focus:cpu_front_left / attack:cpu_back_right:スパイクボール->monster:player_front_left / attack:cpu_back_left:wild_claw->monster:player_front_left / attack:cpu_front_left:attack->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ポリスピナー Lv1 HP3 prep / CF:ボムゾウ Lv1 HP6 shield / CB:ヤンバル Lv1 HP3 prep / CB:ピグミィ Lv1 HP3

### front_process_connected: デスシープ seed 141301 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 1 / score 55
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_right / focus:player_front_left / focus:player_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: summon:player_card_051_1->player_back_left / attack:player_front_left:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / master:shield->monster:player_front_left / ...
- next turn first: summon:player_card_051_1->player_back_left
- opponent response: focus:cpu_front_left / attack:cpu_back_right:スパイクボール->monster:player_front_left / attack:cpu_back_left:wild_claw->monster:player_front_left / attack:cpu_front_left:attack->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ポリスピナー Lv1 HP3 prep / CF:ボムゾウ Lv1 HP6 shield / CB:ヤンバル Lv1 HP3 prep / CB:ピグミィ Lv1 HP3

### contact_no_connection: ヤンバル seed 141301 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role back / stones after 1 / score 110.2
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, front-plan, shield-after-front
- same turn before shield: summon:player_card_051_1->player_back_left / attack:player_front_left:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_back_left:wild_claw->monster:player_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は173点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:デスシープ Lv2 HP6 / PB:ピグミィ Lv1 HP3 prep / PB:ピグミィ Lv1 HP3 / CF:ポリスピナー Lv2 HP3 shield / CB:ヤンバル Lv1 HP3 / CB:ピグミィ Lv1 HP3

### removed_without_connection: ヤンバル seed 141301 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role back / stones after 1 / score 110.2
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, front-plan, shield-after-front
- same turn before shield: summon:player_card_051_1->player_back_left / attack:player_front_left:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_back_left:wild_claw->monster:player_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は173点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:デスシープ Lv2 HP6 / PB:ピグミィ Lv1 HP3 prep / PB:ピグミィ Lv1 HP3 / CF:ポリスピナー Lv2 HP3 shield / CB:ヤンバル Lv1 HP3 / CB:ピグミィ Lv1 HP3

### low_stone_no_connection: ヤンバル seed 141301 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role back / stones after 1 / score 110.2
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, front-plan, shield-after-front
- same turn before shield: summon:player_card_051_1->player_back_left / attack:player_front_left:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_back_left:wild_claw->monster:player_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は173点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:デスシープ Lv2 HP6 / PB:ピグミィ Lv1 HP3 prep / PB:ピグミィ Lv1 HP3 / CF:ポリスピナー Lv2 HP3 shield / CB:ヤンバル Lv1 HP3 / CB:ピグミィ Lv1 HP3

### shield_after_front_process: ヤンバル seed 141301 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role back / stones after 1 / score 110.2
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, front-plan, shield-after-front
- same turn before shield: summon:player_card_051_1->player_back_left / attack:player_front_left:wild_claw->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_back_left:wild_claw->monster:player_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は173点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:デスシープ Lv2 HP6 / PB:ピグミィ Lv1 HP3 prep / PB:ピグミィ Lv1 HP3 / CF:ポリスピナー Lv2 HP3 shield / CB:ヤンバル Lv1 HP3 / CB:ピグミィ Lv1 HP3

### front_process_connected: ピグミィ seed 141301 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_back_left / role back / stones after 2 / score 58.8
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan
- same turn before shield: move:player_front_left->player_back_right / summon:player_card_047_3->player_front_left / move:player_back_left->player_front_right / focus:player_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_left / attack:player_back_left:スパイクボール->monster:cpu_back_right / attack:player_back_left:スパイクボール->monster:cpu_back_right / attack:player_front_right:スパイクボール->monster:cpu_back_right / ...
- next turn first: focus:player_front_left
- opponent response: attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / attack:cpu_front_left:storm_bomb->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は11点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 prep / PF:真勇者ダイン Lv1 HP6 / PB:ピグミィ Lv2 HP3 / PB:ピグミィ Lv2 HP3 / CF:ボムゾウ Lv1 HP6 prep / CF:ポリスピナー Lv2 HP3 shield / CB:ピグミィ Lv1 HP3

### no_front_process_plan: デスシープ seed 141301 turn 13

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 5 / score 55
- flags: team-connected, target-connected, no-contact, no-front-plan
- same turn before shield: focus:player_front_left / attack:player_front_left:attack->master:cpu / focus:player_front_right / summon:player_bomuzo_2->player_back_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_left / attack:player_front_right:attack->master:cpu / end_turn
- next turn first: focus:player_front_left
- opponent response: move:cpu_front_right->cpu_back_left / master:master_attack->monster:player_front_left / summon:cpu_bomuzo_3->cpu_front_left / master:wake_up->monster:cpu_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は14点差で見送り
- board: PF:ポリスピナー Lv1 HP3 / PF:デスシープ Lv1 HP6 / PB:ボムゾウ Lv1 HP6 prep / PB:ピグミィ Lv2 HP1 / CF:ヤンバル Lv1 HP3 shield

### shield_after_front_process: ボムゾウ seed 141301 turn 17

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 1 / score 58.4
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_left:storm_bomb->monster:cpu_back_left / attack:player_front_right:スパイクボール->monster:cpu_back_left / move:player_front_right->player_back_left / summon:player_bomuzo_3->player_front_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_back_left:スパイクボール->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_right:self_bomb->monster:cpu_front_right / focus:player_front_left / ...
- next turn first: attack:player_back_left:スパイクボール->monster:cpu_front_right
- opponent response: focus:cpu_front_right / summon:cpu_card_047_2->cpu_front_left / focus:cpu_back_right / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は11点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv1 HP3 / PB:真勇者ダイン Lv1 HP6 prep / CF:ドノマンティス Lv1 HP5 prep / CB:ピグミィ Lv1 HP3

### next_turn_starts_front_process: ボムゾウ seed 141301 turn 17

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 1 / score 58.4
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_left:storm_bomb->monster:cpu_back_left / attack:player_front_right:スパイクボール->monster:cpu_back_left / move:player_front_right->player_back_left / summon:player_bomuzo_3->player_front_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_back_left:スパイクボール->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_right:self_bomb->monster:cpu_front_right / focus:player_front_left / ...
- next turn first: attack:player_back_left:スパイクボール->monster:cpu_front_right
- opponent response: focus:cpu_front_right / summon:cpu_card_047_2->cpu_front_left / focus:cpu_back_right / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は11点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv1 HP3 / PB:真勇者ダイン Lv1 HP6 prep / CF:ドノマンティス Lv1 HP5 prep / CB:ピグミィ Lv1 HP3

### front_process_connected: ボムゾウ seed 141301 turn 17

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 1 / score 58.4
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_left:storm_bomb->monster:cpu_back_left / attack:player_front_right:スパイクボール->monster:cpu_back_left / move:player_front_right->player_back_left / summon:player_bomuzo_3->player_front_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_back_left:スパイクボール->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / attack:player_front_right:self_bomb->monster:cpu_front_right / focus:player_front_left / ...
- next turn first: attack:player_back_left:スパイクボール->monster:cpu_front_right
- opponent response: focus:cpu_front_right / summon:cpu_card_047_2->cpu_front_left / focus:cpu_back_right / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は11点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv1 HP3 / PB:真勇者ダイン Lv1 HP6 prep / CF:ドノマンティス Lv1 HP5 prep / CB:ピグミィ Lv1 HP3

### shield_after_front_process: 真勇者ダイン seed 141303 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 1 / score 55
- flags: team-connected, target-not-connected, front-process, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: focus:cpu_front_right / move:cpu_front_left->cpu_back_left / attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:cpu_front_right / move:cpu_front_left->cpu_back_left / attack:cpu_back_right:スパイクボール->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / ...
- next turn first: focus:cpu_front_right
- opponent response: master:wake_up->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_front_right:ダイン斬り->monster:cpu_front_right / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は247点差で見送り、マスター特技は412点差で見送り
- board: PF:真勇者ダイン Lv2 HP4 / PF:真勇者ダイン Lv1 HP6 / CF:ヤンバル Lv1 HP3 prep / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv1 HP3 / CB:ピグミィ Lv2 HP3

### front_process_connected: 真勇者ダイン seed 141303 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 1 / score 55
- flags: team-connected, target-not-connected, front-process, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: focus:cpu_front_right / move:cpu_front_left->cpu_back_left / attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:cpu_front_right / move:cpu_front_left->cpu_back_left / attack:cpu_back_right:スパイクボール->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / ...
- next turn first: focus:cpu_front_right
- opponent response: master:wake_up->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_front_right:ダイン斬り->monster:cpu_front_right / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は247点差で見送り、マスター特技は412点差で見送り
- board: PF:真勇者ダイン Lv2 HP4 / PF:真勇者ダイン Lv1 HP6 / CF:ヤンバル Lv1 HP3 prep / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv1 HP3 / CB:ピグミィ Lv2 HP3

### shield_after_front_process: 真勇者ダイン seed 141303 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 2 / score 55
- flags: team-connected, target-not-connected, front-process, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: focus:cpu_front_right / move:cpu_front_left->cpu_back_left / attack:cpu_back_right:スパイクボール->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: master:master_attack->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / focus:cpu_front_right / attack:cpu_front_left:スパイクボール->monster:player_front_right / ...
- next turn first: master:master_attack->monster:player_front_left
- opponent response: attack:player_front_left:ダイン斬り->master:cpu / summon:player_yanbaru_3->player_back_left / attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_card_051_1->player_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は21点差で見送り、マスター特技は275点差で見送り
- board: PF:真勇者ダイン Lv3 HP3 / PF:真勇者ダイン Lv1 HP6 / CF:ピグミィ Lv1 HP3 prep / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv1 HP3 / CB:ピグミィ Lv2 HP3

### next_turn_starts_front_process: 真勇者ダイン seed 141303 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 1 / score 76.8
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: master:master_attack->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / focus:cpu_front_right / attack:cpu_front_left:スパイクボール->monster:player_front_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:cpu_back_left:スパイクボール->monster:player_front_left / attack:cpu_back_right:スパイクボール->monster:player_front_left / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_front_right:ダイン斬り->monster:player_front_right / ...
- next turn first: attack:cpu_back_left:スパイクボール->monster:player_front_left
- opponent response: attack:player_front_left:wild_claw->monster:cpu_front_right / focus:player_front_right / summon:player_card_133_3->player_back_left / focus:player_back_right
- reason: 次ターンのレベルアップ筋を残すためシールド / 見送り: マスター特技は44点差で見送り、マスター特技は130点差で見送り
- board: PF:真勇者ダイン Lv1 HP3 / PB:ヤンバル Lv1 HP3 prep / PB:ピグミィ Lv1 HP3 prep / CF:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv2 HP3 / CB:ピグミィ Lv2 HP3

### next_turn_starts_front_process: ピグミィ seed 141303 turn 7

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role back / stones after 1 / score 55.2
- flags: team-connected, target-not-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:cpu_back_left:スパイクボール->monster:player_front_left / attack:cpu_back_right:スパイクボール->monster:player_front_left / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_front_right:ダイン斬り->monster:player_front_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_back_left:スパイクボール->monster:player_front_right / master:master_attack->monster:player_front_right / move:cpu_front_left->cpu_back_right / ...
- next turn first: attack:cpu_back_left:スパイクボール->monster:player_front_right
- opponent response: focus:player_front_right / focus:player_front_left / summon:player_card_051_2->player_back_left / attack:player_back_right:スパイクボール->monster:cpu_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は2点差で見送り
- board: PF:真勇者ダイン Lv1 HP3 shield / PB:デスシープ Lv1 HP6 prep / PB:ピグミィ Lv1 HP3 / CF:ピグミィ Lv2 HP3 / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv2 HP3 / CB:ピグミィ Lv2 HP3

### next_turn_starts_front_process: ピグミィ seed 141303 turn 10

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role back / stones after 2 / score 118
- flags: team-connected, target-not-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: focus:cpu_front_left / move:cpu_front_right->cpu_back_right / attack:cpu_back_left:スパイクボール->monster:player_front_left / focus:cpu_back_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:cpu_back_right:スパイクボール->monster:player_front_left / master:master_attack->monster:player_front_left / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_right / ...
- next turn first: attack:cpu_back_right:スパイクボール->monster:player_front_left
- opponent response: focus:player_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_left / focus:player_front_right / focus:player_back_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は82点差で見送り、マスター特技は249点差で見送り
- board: PF:デスシープ Lv1 HP4 / PF:デスシープ Lv1 HP6 prep / PB:ピグミィ Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv1 HP6 / CF:ピグミィ Lv2 HP3 / CB:ピグミィ Lv2 HP2 / CB:ピグミィ Lv2 HP3

### next_turn_starts_front_process: 真勇者ダイン seed 141304 turn 6

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 2 / score 55
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: focus:player_front_left / attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_left / focus:player_back_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_front_right:attack->monster:cpu_front_right / attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_left / ...
- next turn first: attack:player_front_right:attack->monster:cpu_front_right
- opponent response: focus:cpu_front_right / attack:cpu_front_left:attack->monster:player_front_left / focus:cpu_back_left / master:master_attack->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は8点差で見送り、マスター特技は161点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ドノマンティス Lv1 HP4 / CF:真勇者ダイン Lv1 HP6 shield / CB:真勇者ダイン Lv1 HP6 prep / CB:デスシープ Lv2 HP6

### contact_no_connection: ヤンバル seed 141304 turn 13

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (player)
- decision: player_front_right / role back / stones after 0 / score 118
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_front_right:wild_claw->monster:cpu_back_right / summon:player_bomuzo_3->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: summon:cpu_card_051_2->cpu_back_left / move:cpu_front_left->cpu_back_right / summon:cpu_card_133_2->cpu_front_left / focus:cpu_back_right
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は281点差で見送り、マスター特技は282点差で見送り
- board: PF:真勇者ダイン Lv2 HP6 / PF:ヤンバル Lv2 HP3 / PB:ピグミィ Lv2 HP3 / PB:ボムゾウ Lv1 HP6 prep / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv2 HP3

### removed_without_connection: ヤンバル seed 141304 turn 13

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (player)
- decision: player_front_right / role back / stones after 0 / score 118
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_front_right:wild_claw->monster:cpu_back_right / summon:player_bomuzo_3->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: summon:cpu_card_051_2->cpu_back_left / move:cpu_front_left->cpu_back_right / summon:cpu_card_133_2->cpu_front_left / focus:cpu_back_right
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は281点差で見送り、マスター特技は282点差で見送り
- board: PF:真勇者ダイン Lv2 HP6 / PF:ヤンバル Lv2 HP3 / PB:ピグミィ Lv2 HP3 / PB:ボムゾウ Lv1 HP6 prep / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv2 HP3

### low_stone_no_connection: ヤンバル seed 141304 turn 13

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (player)
- decision: player_front_right / role back / stones after 0 / score 118
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_front_right:wild_claw->monster:cpu_back_right / summon:player_bomuzo_3->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: summon:cpu_card_051_2->cpu_back_left / move:cpu_front_left->cpu_back_right / summon:cpu_card_133_2->cpu_front_left / focus:cpu_back_right
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は281点差で見送り、マスター特技は282点差で見送り
- board: PF:真勇者ダイン Lv2 HP6 / PF:ヤンバル Lv2 HP3 / PB:ピグミィ Lv2 HP3 / PB:ボムゾウ Lv1 HP6 prep / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv2 HP3

### contact_no_connection: ボムゾウ seed 141304 turn 17

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 2 / score 49.6
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: focus:player_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: summon:cpu_bomuzo_1->cpu_back_right / magic:cpu_card_093_1->master:cpu
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ボムゾウ Lv1 HP4 / PB:ピグミィ Lv2 HP2 / PB:ドノマンティス Lv1 HP5 / CF:真勇者ダイン Lv3 HP6 shield / CB:ピグミィ Lv1 HP3 / CB:ピグミィ Lv2 HP3

### removed_without_connection: ボムゾウ seed 141304 turn 17

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 2 / score 49.6
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: focus:player_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: summon:cpu_bomuzo_1->cpu_back_right / magic:cpu_card_093_1->master:cpu
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ボムゾウ Lv1 HP4 / PB:ピグミィ Lv2 HP2 / PB:ドノマンティス Lv1 HP5 / CF:真勇者ダイン Lv3 HP6 shield / CB:ピグミィ Lv1 HP3 / CB:ピグミィ Lv2 HP3

### low_stone_no_connection: ボムゾウ seed 141304 turn 17

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 2 / score 49.6
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: focus:player_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: summon:cpu_bomuzo_1->cpu_back_right / magic:cpu_card_093_1->master:cpu
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ボムゾウ Lv1 HP4 / PB:ピグミィ Lv2 HP2 / PB:ドノマンティス Lv1 HP5 / CF:真勇者ダイン Lv3 HP6 shield / CB:ピグミィ Lv1 HP3 / CB:ピグミィ Lv2 HP3

### contact_no_connection: ピグミィ seed 141304 turn 18

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (player)
- decision: player_back_right / role back / stones after 0 / score 57.7
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: focus:player_front_right / move:player_front_left->player_back_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / summon:player_card_037_1->player_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: summon:cpu_card_037_1->cpu_back_left / attack:cpu_front_left:storm_bomb->monster:player_front_right / master:master_attack->monster:player_front_right / attack:cpu_front_right:ダイン斬り->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は275点差で見送り、マスター特技は289点差で見送り
- board: PF:ドノマンティス Lv2 HP5 / PF:ボムゾウ Lv1 HP4 / PB:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv2 HP2 / CF:真勇者ダイン Lv3 HP6 / CB:ボムゾウ Lv1 HP6 prep / CB:ピグミィ Lv2 HP3

### removed_without_connection: ピグミィ seed 141304 turn 18

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (player)
- decision: player_back_right / role back / stones after 0 / score 57.7
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: focus:player_front_right / move:player_front_left->player_back_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / summon:player_card_037_1->player_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: summon:cpu_card_037_1->cpu_back_left / attack:cpu_front_left:storm_bomb->monster:player_front_right / master:master_attack->monster:player_front_right / attack:cpu_front_right:ダイン斬り->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は275点差で見送り、マスター特技は289点差で見送り
- board: PF:ドノマンティス Lv2 HP5 / PF:ボムゾウ Lv1 HP4 / PB:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv2 HP2 / CF:真勇者ダイン Lv3 HP6 / CB:ボムゾウ Lv1 HP6 prep / CB:ピグミィ Lv2 HP3

### low_stone_no_connection: ピグミィ seed 141304 turn 18

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (player)
- decision: player_back_right / role back / stones after 0 / score 57.7
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: focus:player_front_right / move:player_front_left->player_back_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / summon:player_card_037_1->player_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: summon:cpu_card_037_1->cpu_back_left / attack:cpu_front_left:storm_bomb->monster:player_front_right / master:master_attack->monster:player_front_right / attack:cpu_front_right:ダイン斬り->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は275点差で見送り、マスター特技は289点差で見送り
- board: PF:ドノマンティス Lv2 HP5 / PF:ボムゾウ Lv1 HP4 / PB:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv2 HP2 / CF:真勇者ダイン Lv3 HP6 / CB:ボムゾウ Lv1 HP6 prep / CB:ピグミィ Lv2 HP3

### contact_no_connection: ピグミィ seed 141305 turn 13

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (player)
- decision: player_front_right / role back / stones after 0 / score 67.8
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: summon:player_card_051_3->player_back_left / focus:player_front_left / attack:player_front_right:スパイクボール->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:cpu_back_right:スパイクボール->monster:player_front_left / master:master_attack->monster:player_front_right
- reason: 倒されそうな高価値味方を守るためシールド / 見送り: マスター特技は70点差で見送り、マスター特技は77点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ピグミィ Lv2 HP1 / PB:ピグミィ Lv2 HP3 / CF:ヤンバル Lv2 HP3 shield / CB:ヤンバル Lv2 HP3 / CB:ピグミィ Lv1 HP3 prep

### removed_without_connection: ピグミィ seed 141305 turn 13

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (player)
- decision: player_front_right / role back / stones after 0 / score 67.8
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: summon:player_card_051_3->player_back_left / focus:player_front_left / attack:player_front_right:スパイクボール->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:cpu_back_right:スパイクボール->monster:player_front_left / master:master_attack->monster:player_front_right
- reason: 倒されそうな高価値味方を守るためシールド / 見送り: マスター特技は70点差で見送り、マスター特技は77点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ピグミィ Lv2 HP1 / PB:ピグミィ Lv2 HP3 / CF:ヤンバル Lv2 HP3 shield / CB:ヤンバル Lv2 HP3 / CB:ピグミィ Lv1 HP3 prep

### low_stone_no_connection: ピグミィ seed 141305 turn 13

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (player)
- decision: player_front_right / role back / stones after 0 / score 67.8
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: summon:player_card_051_3->player_back_left / focus:player_front_left / attack:player_front_right:スパイクボール->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:cpu_back_right:スパイクボール->monster:player_front_left / master:master_attack->monster:player_front_right
- reason: 倒されそうな高価値味方を守るためシールド / 見送り: マスター特技は70点差で見送り、マスター特技は77点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ピグミィ Lv2 HP1 / PB:ピグミィ Lv2 HP3 / CF:ヤンバル Lv2 HP3 shield / CB:ヤンバル Lv2 HP3 / CB:ピグミィ Lv1 HP3 prep

### no_front_process_plan: ドノマンティス seed 141306 turn 7

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 0 / score 58.4
- flags: team-not-connected, target-not-connected, contact:3, removed, low-stone, no-front-plan
- same turn before shield: move:cpu_front_left->cpu_back_right / attack:cpu_front_right:呪いの刃->master:player / summon:cpu_card_051_3->cpu_back_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: focus:player_front_left / attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_front_right:self_bomb->monster:cpu_front_right / master:master_attack->monster:cpu_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / PB:ヤンバル Lv2 HP3 / CF:ドノマンティス Lv2 HP5 / CB:ピグミィ Lv1 HP3 prep / CB:ヤンバル Lv1 HP3

### no_contact_no_connection: ピグミィ seed 141306 turn 12

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role back / stones after 2 / score 123.4
- flags: team-not-connected, target-not-connected, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: master:master_attack->monster:player_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: master:shield->monster:cpu_front_right / end_turn
- next turn first: master:shield->monster:cpu_front_right
- opponent response: attack:player_back_right:wild_claw->master:cpu / attack:player_front_left:ダイン斬り->master:cpu / end_turn
- reason: 致死圏の味方を守れるためシールド
- board: PF:ピグミィ Lv1 HP3 / PB:真勇者ダイン Lv1 HP6 / PB:ヤンバル Lv2 HP3 / CF:ピグミィ Lv2 HP3

### no_contact_no_connection: ピグミィ seed 141306 turn 14

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role back / stones after 7 / score 72.1
- flags: team-not-connected, target-not-connected, no-contact, front-plan, shield-after-front
- same turn before shield: attack:cpu_front_right:スパイクボール->monster:player_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:player_back_right:wild_claw->master:cpu
- reason: 倒されそうな高価値味方を守るためシールド
- board: PF:真勇者ダイン Lv1 HP6 / PF:ピグミィ Lv1 HP3 / PB:ヤンバル Lv2 HP3 / CF:ピグミィ Lv2 HP3


## Notes

- この監査はAI本体を変更しない。負け試合に出たシールドだけを、同ターン/次自ターンの仕事へつながったかで分類する。
- `team-connected` は盾対象以外の攻撃/ウェイクも含む。`target-connected` は盾対象自身が攻撃/レベルアップへ変換されたケース。
- `front-process` は敵前衛への攻撃が選ばれたケースで、`front damage/kill` はその攻撃でHP減少または除去が発生したケース。
- 相手に触られたが後続仕事へ残らない盾が一定数ある。守り切れない対象を守るより、相手に追加手数を強いるか、次ターンの処理役を残せたかで分ける必要がある。

## Next Loop Proposal

- 次は `shieldConnectionPlanAudit` として、シールド選択時に「この後または次自ターンに誰が何をする予定か」を候補評価ログへ出す。

## Reading

- `Team Conn`: 盾後、同ターンまたは次自ターンに自軍の攻撃/ウェイク/敵前衛処理が発生した割合。
- `Target Conn`: 盾対象自身が同ターン/次自ターンに攻撃、敵前衛処理、レベルアップへ変換された割合。
- `Front Proc`: 盾後の同ターン/次自ターンに敵前衛を攻撃した割合。
- `NoContact NoConn`: 次自ターンまで相手に触られず、かつ後続仕事にもつながらなかった盾。
- `Shield Before Work`: 同ターンに盾より後で攻撃またはウェイクアップをしているケース。相手反撃がないなら行動順の疑いがある。
