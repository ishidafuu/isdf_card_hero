# White Shield Follow-up Loss Audit

生成: 2026-07-03T09:59:35.857Z
seedStart: 993300
候補: current_white_baseline, current_mirror_blocked_exposed45
相手: white_current_mirror
試行: 2 games/matchup/direction
総試合: 8
負け試合: 6
盾あり負け試合: 6

## Purpose

盾をさらに減らすのではなく、負けseedのシールドが「攻撃」「ウェイクアップ」「敵前衛処理」へ接続できているかを見る。勝率採用判断ではなく、次の改善仮説を作るための監査。

## Summary

- 負け試合中のシールド: 60
- Team connected: 40 (66.7%)
- Target connected: 25 (41.7%)
- Front process connected: 39 (65%)
- Front damage/kill: 26 (43.3%)
- No contact / no connection: 12 (20%)
- Contact / no connection: 8 (13.3%)
- Low stone after shield: 37 (61.7%)
- Multi-shield turn: 6 (10%)
- Shield before same-turn work: 0 (0%)
- Any front-process plan: 53 (88.3%)
- No front-process plan: 7 (11.7%)
- Shield first with no front-process plan: 0 (0%)

## Variant Metrics

| Variant | W-L-D | Loss Shield | Team Conn | Target Conn | Front Proc | Front Dmg/Kill | Same Attack | Same Wake | Next Attack | Next Wake | NoContact NoConn | Contact NoConn | Removed | LowStone | MultiShield | Shield Before Work | Retreat |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 1-3-0 | 28 | 23 (82.1%) | 14 (50%) | 22 (78.6%) | 12 (42.9%) | 0 (0%) | 0 (0%) | 23 (82.1%) | 4 (14.3%) | 4 (14.3%) | 1 (3.6%) | 1 (3.6%) | 15 (53.6%) | 2 (7.1%) | 0 (0%) | 0 (0%) |
| current_mirror_blocked_exposed45 | 1-3-0 | 32 | 17 (53.1%) | 11 (34.4%) | 17 (53.1%) | 14 (43.8%) | 0 (0%) | 0 (0%) | 17 (53.1%) | 1 (3.1%) | 8 (25%) | 7 (21.9%) | 7 (21.9%) | 22 (68.8%) | 4 (12.5%) | 0 (0%) | 0 (0%) |

## Shield Connection Plan Metrics

| Variant | W-L-D | Loss Shield | Before Front | After Front | Next Front | Any Front Plan | No Front Plan | Shield First | Shield First No Plan | Shield After Front | Shield Before Front | Next Starts Front |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 1-3-0 | 28 | 17 (60.7%) | 0 (0%) | 22 (78.6%) | 24 (85.7%) | 4 (14.3%) | 0 (0%) | 0 (0%) | 17 (60.7%) | 0 (0%) | 14 (50%) |
| current_mirror_blocked_exposed45 | 1-3-0 | 32 | 26 (81.3%) | 0 (0%) | 17 (53.1%) | 29 (90.6%) | 3 (9.4%) | 0 (0%) | 0 (0%) | 26 (81.3%) | 0 (0%) | 7 (21.9%) |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Loss Shield | Team Conn | Target Conn | Front Proc | NoContact NoConn | MultiShield |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | white_current_mirror | 1-3-0 | 28 | 23 (82.1%) | 14 (50%) | 22 (78.6%) | 4 (14.3%) | 2 (7.1%) |
| current_mirror_blocked_exposed45 | white_current_mirror | 1-3-0 | 32 | 17 (53.1%) | 11 (34.4%) | 17 (53.1%) | 8 (25%) | 4 (12.5%) |

## Samples

### next_turn_starts_front_process: ボムゾウ seed 993300 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 0 / score 55
- flags: team-connected, target-not-connected, front-process, no-contact, low-stone, front-plan, next-start-front
- same turn before shield: summon:player_yanbaru_2->player_back_right / move:player_back_left->player_front_right / focus:player_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_right / focus:player_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / focus:player_back_left / ...
- next turn first: attack:player_back_right:wild_claw->monster:cpu_front_right
- opponent response: focus:cpu_front_right / focus:cpu_back_left / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_front_right:attack->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は7点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 prep / CF:ドノマンティス Lv1 HP5 prep / CF:ポリスピナー Lv1 HP3 prep / CB:真勇者ダイン Lv1 HP6 prep

### front_process_connected: ボムゾウ seed 993300 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 0 / score 55
- flags: team-connected, target-not-connected, front-process, no-contact, low-stone, front-plan, next-start-front
- same turn before shield: summon:player_yanbaru_2->player_back_right / move:player_back_left->player_front_right / focus:player_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_right / focus:player_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / focus:player_back_left / ...
- next turn first: attack:player_back_right:wild_claw->monster:cpu_front_right
- opponent response: focus:cpu_front_right / focus:cpu_back_left / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_front_right:attack->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は7点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 prep / CF:ドノマンティス Lv1 HP5 prep / CF:ポリスピナー Lv1 HP3 prep / CB:真勇者ダイン Lv1 HP6 prep

### shield_after_front_process: ボムゾウ seed 993300 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 0 / score 55
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_back_right:wild_claw->monster:cpu_front_right / focus:player_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / focus:player_back_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:self_bomb->monster:cpu_front_left / master:shield->monster:player_front_right / ...
- next turn first: attack:player_front_right:storm_bomb->monster:cpu_front_left
- opponent response: attack:cpu_front_left:attack->monster:player_front_left / move:cpu_back_left->cpu_front_right / end_turn
- reason: 高価値の味方を守るためシールド
- board: PF:ボムゾウ Lv1 HP6 / PF:ボムゾウ Lv2 HP5 / PB:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:ドノマンティス Lv1 HP5 shield / CB:真勇者ダイン Lv1 HP6

### next_turn_starts_front_process: ボムゾウ seed 993300 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 0 / score 55
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_back_right:wild_claw->monster:cpu_front_right / focus:player_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / focus:player_back_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:self_bomb->monster:cpu_front_left / master:shield->monster:player_front_right / ...
- next turn first: attack:player_front_right:storm_bomb->monster:cpu_front_left
- opponent response: attack:cpu_front_left:attack->monster:player_front_left / move:cpu_back_left->cpu_front_right / end_turn
- reason: 高価値の味方を守るためシールド
- board: PF:ボムゾウ Lv1 HP6 / PF:ボムゾウ Lv2 HP5 / PB:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:ドノマンティス Lv1 HP5 shield / CB:真勇者ダイン Lv1 HP6

### front_process_connected: ボムゾウ seed 993300 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 0 / score 55
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_back_right:wild_claw->monster:cpu_front_right / focus:player_front_left / attack:player_front_right:self_bomb->monster:cpu_front_right / focus:player_back_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:self_bomb->monster:cpu_front_left / master:shield->monster:player_front_right / ...
- next turn first: attack:player_front_right:storm_bomb->monster:cpu_front_left
- opponent response: attack:cpu_front_left:attack->monster:player_front_left / move:cpu_back_left->cpu_front_right / end_turn
- reason: 高価値の味方を守るためシールド
- board: PF:ボムゾウ Lv1 HP6 / PF:ボムゾウ Lv2 HP5 / PB:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:ドノマンティス Lv1 HP5 shield / CB:真勇者ダイン Lv1 HP6

### shield_after_front_process: ボムゾウ seed 993300 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 58.4
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:self_bomb->monster:cpu_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_front_left:storm_bomb->monster:cpu_front_right / attack:player_front_right:self_bomb->monster:cpu_front_right / master:shield->monster:player_front_right / ...
- next turn first: attack:player_back_right:wild_claw->monster:cpu_front_right
- opponent response: focus:cpu_front_right / summon:cpu_card_037_1->cpu_front_left / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は9点差で見送り
- board: PF:ボムゾウ Lv2 HP5 / PF:ボムゾウ Lv2 HP5 / PB:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP6

### next_turn_starts_front_process: ボムゾウ seed 993300 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 58.4
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:self_bomb->monster:cpu_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_front_left:storm_bomb->monster:cpu_front_right / attack:player_front_right:self_bomb->monster:cpu_front_right / master:shield->monster:player_front_right / ...
- next turn first: attack:player_back_right:wild_claw->monster:cpu_front_right
- opponent response: focus:cpu_front_right / summon:cpu_card_037_1->cpu_front_left / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は9点差で見送り
- board: PF:ボムゾウ Lv2 HP5 / PF:ボムゾウ Lv2 HP5 / PB:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP6

### front_process_connected: ボムゾウ seed 993300 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 58.4
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:self_bomb->monster:cpu_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_front_left:storm_bomb->monster:cpu_front_right / attack:player_front_right:self_bomb->monster:cpu_front_right / master:shield->monster:player_front_right / ...
- next turn first: attack:player_back_right:wild_claw->monster:cpu_front_right
- opponent response: focus:cpu_front_right / summon:cpu_card_037_1->cpu_front_left / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は9点差で見送り
- board: PF:ボムゾウ Lv2 HP5 / PF:ボムゾウ Lv2 HP5 / PB:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP6

### shield_after_front_process: ボムゾウ seed 993300 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 1 / score 121.2
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_front_left:storm_bomb->monster:cpu_front_right / attack:player_front_right:self_bomb->monster:cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: master:wake_up->monster:cpu_front_right / attack:player_front_right:self_bomb->monster:cpu_front_right / summon:player_card_133_3->player_front_right / attack:player_back_right:wild_claw->monster:cpu_front_left / ...
- next turn first: master:wake_up->monster:cpu_front_right
- opponent response: focus:cpu_front_left / summon:cpu_polyspinner_3->cpu_front_right / end_turn
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は358点差で見送り
- board: PF:ボムゾウ Lv2 HP5 / PF:ボムゾウ Lv2 HP2 / PB:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:ドノマンティス Lv1 HP5 prep

### front_process_connected: ボムゾウ seed 993300 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 1 / score 121.2
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_back_right:wild_claw->monster:cpu_front_right / attack:player_front_left:storm_bomb->monster:cpu_front_right / attack:player_front_right:self_bomb->monster:cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: master:wake_up->monster:cpu_front_right / attack:player_front_right:self_bomb->monster:cpu_front_right / summon:player_card_133_3->player_front_right / attack:player_back_right:wild_claw->monster:cpu_front_left / ...
- next turn first: master:wake_up->monster:cpu_front_right
- opponent response: focus:cpu_front_left / summon:cpu_polyspinner_3->cpu_front_right / end_turn
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は358点差で見送り
- board: PF:ボムゾウ Lv2 HP5 / PF:ボムゾウ Lv2 HP2 / PB:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / CF:ドノマンティス Lv1 HP5 prep

### no_front_process_plan: デスシープ seed 993300 turn 7

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 2 / score 55
- flags: team-connected, target-connected, no-contact, low-stone, no-front-plan
- same turn before shield: summon:player_polyspinner_2->player_back_left / attack:player_front_left:attack->master:cpu / focus:player_front_right / focus:player_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: summon:player_card_047_2->player_back_left / focus:player_front_left / attack:player_front_right:attack->master:cpu / attack:player_front_left:attack->master:cpu / ...
- next turn first: summon:player_card_047_2->player_back_left
- opponent response: summon:cpu_card_133_1->cpu_back_left / master:master_attack->monster:player_front_left / master:master_attack->monster:player_front_left / master:master_attack->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は12点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv1 HP6 / PB:ポリスピナー Lv1 HP3 prep / PB:ヤンバル Lv1 HP3

### no_contact_no_connection: デスシープ seed 993300 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 3 / score 51.8
- flags: team-not-connected, target-not-connected, no-contact, no-front-plan
- same turn before shield: summon:player_card_047_2->player_back_left / focus:player_front_left / attack:player_front_right:attack->master:cpu / attack:player_front_left:attack->master:cpu
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_left / focus:player_front_right / summon:player_card_037_1->player_back_left / end_turn
- next turn first: focus:player_front_left
- opponent response: attack:cpu_front_left:attack->monster:player_front_left / master:master_attack->monster:player_front_left / summon:cpu_card_047_2->cpu_front_right / master:shield->monster:cpu_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は3点差で見送り
- board: PF:ポリスピナー Lv1 HP3 / PF:デスシープ Lv1 HP6 / PB:真勇者ダイン Lv1 HP6 prep / PB:ヤンバル Lv1 HP3 / CB:デスシープ Lv1 HP6 prep

### no_front_process_plan: デスシープ seed 993300 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 3 / score 51.8
- flags: team-not-connected, target-not-connected, no-contact, no-front-plan
- same turn before shield: summon:player_card_047_2->player_back_left / focus:player_front_left / attack:player_front_right:attack->master:cpu / attack:player_front_left:attack->master:cpu
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_left / focus:player_front_right / summon:player_card_037_1->player_back_left / end_turn
- next turn first: focus:player_front_left
- opponent response: attack:cpu_front_left:attack->monster:player_front_left / master:master_attack->monster:player_front_left / summon:cpu_card_047_2->cpu_front_right / master:shield->monster:cpu_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は3点差で見送り
- board: PF:ポリスピナー Lv1 HP3 / PF:デスシープ Lv1 HP6 / PB:真勇者ダイン Lv1 HP6 prep / PB:ヤンバル Lv1 HP3 / CB:デスシープ Lv1 HP6 prep

### next_turn_starts_front_process: ドノマンティス seed 993300 turn 11

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 4 / score 50.7
- flags: team-connected, target-not-connected, front-process, no-contact, front-plan, next-start-front
- same turn before shield: move:player_front_right->player_back_left / focus:player_front_left / magic:player_card_031_1->monster:cpu_back_left / summon:player_card_133_1->player_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_right / focus:player_front_left / focus:player_back_right / ...
- next turn first: attack:player_back_left:wild_claw->monster:cpu_front_right
- opponent response: focus:cpu_front_right / move:cpu_front_left->cpu_back_right / attack:cpu_back_right:スパイクボール->monster:player_front_left / summon:cpu_card_133_3->cpu_front_left
- reason: 高価値の味方を守るためシールド
- board: PF:真勇者ダイン Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / PB:デスシープ Lv1 HP6 prep / CF:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CB:デスシープ Lv1 HP6

### front_process_connected: ドノマンティス seed 993300 turn 11

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 4 / score 50.7
- flags: team-connected, target-not-connected, front-process, no-contact, front-plan, next-start-front
- same turn before shield: move:player_front_right->player_back_left / focus:player_front_left / magic:player_card_031_1->monster:cpu_back_left / summon:player_card_133_1->player_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_right / focus:player_front_left / focus:player_back_right / ...
- next turn first: attack:player_back_left:wild_claw->monster:cpu_front_right
- opponent response: focus:cpu_front_right / move:cpu_front_left->cpu_back_right / attack:cpu_back_right:スパイクボール->monster:player_front_left / summon:cpu_card_133_3->cpu_front_left
- reason: 高価値の味方を守るためシールド
- board: PF:真勇者ダイン Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / PB:デスシープ Lv1 HP6 prep / CF:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CB:デスシープ Lv1 HP6

### shield_after_front_process: 真勇者ダイン seed 993300 turn 12

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 5 / score 55
- flags: team-connected, target-not-connected, front-process, no-contact, front-plan, shield-after-front
- same turn before shield: attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_right / focus:player_front_left / focus:player_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_left / attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_right / end_turn
- next turn first: focus:player_front_left
- opponent response: focus:cpu_front_right / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_back_right:スパイクボール->monster:player_front_right / focus:cpu_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / PB:デスシープ Lv1 HP6 / CF:デスシープ Lv1 HP6 prep / CF:真勇者ダイン Lv1 HP6 shield / CB:デスシープ Lv1 HP6 / CB:ピグミィ Lv1 HP3

### shield_after_front_process: 真勇者ダイン seed 993300 turn 14

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 9 / score 55
- flags: team-connected, target-connected, front-process, no-contact, front-plan, shield-after-front
- same turn before shield: focus:player_front_right / attack:player_back_left:wild_claw->monster:cpu_front_left / focus:player_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: summon:player_card_051_2->player_back_right / attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / master:wake_up->monster:player_back_right / ...
- next turn first: summon:player_card_051_2->player_back_right
- opponent response: magic:cpu_card_031_1->monster:player_front_right / attack:cpu_front_right:ダイン斬り->monster:player_front_right / focus:cpu_front_left / focus:cpu_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は9点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / PB:デスシープ Lv1 HP6 / CF:デスシープ Lv1 HP6 shield / CF:真勇者ダイン Lv1 HP6 / CB:デスシープ Lv1 HP6 / CB:ピグミィ Lv1 HP3

### next_turn_starts_front_process: デスシープ seed 993301 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 5 / score 55
- flags: team-connected, target-connected, front-process, contact:1, front-plan, next-start-front
- same turn before shield: focus:player_front_left / summon:player_card_047_2->player_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_front_right:ダイン斬り->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / ...
- next turn first: attack:player_front_left:attack->monster:cpu_front_left
- opponent response: attack:cpu_back_right:wild_claw->monster:player_front_left / focus:cpu_front_left / focus:cpu_front_right / master:shield->monster:cpu_front_left
- reason: 高価値の味方を守るためシールド
- board: PF:デスシープ Lv1 HP6 / PF:真勇者ダイン Lv1 HP6 prep / CF:デスシープ Lv1 HP6 shield / CF:ドノマンティス Lv1 HP5 prep / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv2 HP1

### no_contact_no_connection: 真勇者ダイン seed 993301 turn 12

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 2 / score 55
- flags: team-not-connected, target-not-connected, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: focus:player_front_right / focus:player_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_left / summon:player_yanbaru_2->player_back_right / move:player_back_left->player_front_right / master:shield->monster:player_back_left / ...
- next turn first: focus:player_front_left
- opponent response: attack:cpu_back_right:wild_claw->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_back_left:スパイクボール->monster:player_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り、マスター特技は2点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:真勇者ダイン Lv1 HP5 / PB:デスシープ Lv1 HP6 prep / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:デスシープ Lv2 HP6 / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv2 HP1

### low_stone_no_connection: 真勇者ダイン seed 993301 turn 12

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 2 / score 55
- flags: team-not-connected, target-not-connected, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: focus:player_front_right / focus:player_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_left / summon:player_yanbaru_2->player_back_right / move:player_back_left->player_front_right / master:shield->monster:player_back_left / ...
- next turn first: focus:player_front_left
- opponent response: attack:cpu_back_right:wild_claw->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_back_left:スパイクボール->monster:player_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り、マスター特技は2点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:真勇者ダイン Lv1 HP5 / PB:デスシープ Lv1 HP6 prep / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:デスシープ Lv2 HP6 / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv2 HP1

### no_contact_no_connection: ボムゾウ seed 993301 turn 15

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 2 / score 58.4
- flags: team-not-connected, target-not-connected, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: magic:player_card_031_1->monster:cpu_back_left / attack:player_front_right:storm_bomb->monster:cpu_back_right / master:master_attack->monster:cpu_front_right / attack:player_back_right:wild_claw->monster:cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: end_turn
- next turn first: end_turn
- opponent response: attack:cpu_front_left:ダイン斬り->master:player / summon:cpu_card_047_1->cpu_front_right / summon:cpu_card_051_2->cpu_back_right / focus:cpu_back_left
- reason: 高価値の味方を守るためシールド
- board: PF:ボムゾウ Lv2 HP5 / PB:ヤンバル Lv2 HP3 / CF:真勇者ダイン Lv2 HP6 shield / CB:デスシープ Lv2 HP6

### low_stone_no_connection: ボムゾウ seed 993301 turn 15

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 2 / score 58.4
- flags: team-not-connected, target-not-connected, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: magic:player_card_031_1->monster:cpu_back_left / attack:player_front_right:storm_bomb->monster:cpu_back_right / master:master_attack->monster:cpu_front_right / attack:player_back_right:wild_claw->monster:cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: end_turn
- next turn first: end_turn
- opponent response: attack:cpu_front_left:ダイン斬り->master:player / summon:cpu_card_047_1->cpu_front_right / summon:cpu_card_051_2->cpu_back_right / focus:cpu_back_left
- reason: 高価値の味方を守るためシールド
- board: PF:ボムゾウ Lv2 HP5 / PB:ヤンバル Lv2 HP3 / CF:真勇者ダイン Lv2 HP6 shield / CB:デスシープ Lv2 HP6

### contact_no_connection: ヤンバル seed 993302 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role back / stones after 6 / score 47.5
- flags: team-not-connected, target-not-connected, contact:2, removed, no-front-plan
- same turn before shield: move:cpu_front_left->cpu_back_right / focus:cpu_front_right / summon:cpu_card_037_3->cpu_front_left / focus:cpu_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: summon:player_card_047_2->player_back_left / attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_right:wild_claw->monster:cpu_front_right
- reason: 高価値の味方を守るためシールド
- board: PF:ドノマンティス Lv1 HP5 prep / PF:デスシープ Lv2 HP6 shield / PB:ヤンバル Lv2 HP3 / CF:ドノマンティス Lv1 HP5 prep / CF:ヤンバル Lv1 HP3 / CB:ピグミィ Lv1 HP3

### removed_without_connection: ヤンバル seed 993302 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role back / stones after 6 / score 47.5
- flags: team-not-connected, target-not-connected, contact:2, removed, no-front-plan
- same turn before shield: move:cpu_front_left->cpu_back_right / focus:cpu_front_right / summon:cpu_card_037_3->cpu_front_left / focus:cpu_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: summon:player_card_047_2->player_back_left / attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_right:wild_claw->monster:cpu_front_right
- reason: 高価値の味方を守るためシールド
- board: PF:ドノマンティス Lv1 HP5 prep / PF:デスシープ Lv2 HP6 shield / PB:ヤンバル Lv2 HP3 / CF:ドノマンティス Lv1 HP5 prep / CF:ヤンバル Lv1 HP3 / CB:ピグミィ Lv1 HP3


## Notes

- この監査はAI本体を変更しない。負け試合に出たシールドだけを、同ターン/次自ターンの仕事へつながったかで分類する。
- `team-connected` は盾対象以外の攻撃/ウェイクも含む。`target-connected` は盾対象自身が攻撃/レベルアップへ変換されたケース。
- `front-process` は敵前衛への攻撃が選ばれたケースで、`front damage/kill` はその攻撃でHP減少または除去が発生したケース。
- 接触も後続仕事もない盾が目立つため、単純な盾抑制ではなく、盾前後の行動順と仕事予定の有無を次に見る価値がある。

## Next Loop Proposal

- 次は `shieldConnectionPlanAudit` として、シールド選択時に「この後または次自ターンに誰が何をする予定か」を候補評価ログへ出す。

## Reading

- `Team Conn`: 盾後、同ターンまたは次自ターンに自軍の攻撃/ウェイク/敵前衛処理が発生した割合。
- `Target Conn`: 盾対象自身が同ターン/次自ターンに攻撃、敵前衛処理、レベルアップへ変換された割合。
- `Front Proc`: 盾後の同ターン/次自ターンに敵前衛を攻撃した割合。
- `NoContact NoConn`: 次自ターンまで相手に触られず、かつ後続仕事にもつながらなかった盾。
- `Shield Before Work`: 同ターンに盾より後で攻撃またはウェイクアップをしているケース。相手反撃がないなら行動順の疑いがある。
