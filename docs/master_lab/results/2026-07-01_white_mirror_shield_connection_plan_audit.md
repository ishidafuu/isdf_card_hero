# White Shield Follow-up Loss Audit

生成: 2026-06-30T23:11:14.200Z
seedStart: 141200
候補: current_white_baseline, current_threat_then_setup
相手: white_current_mirror
試行: 2 games/matchup/direction
総試合: 8
負け試合: 7
盾あり負け試合: 7

## Purpose

盾をさらに減らすのではなく、負けseedのシールドが「攻撃」「ウェイクアップ」「敵前衛処理」へ接続できているかを見る。勝率採用判断ではなく、次の改善仮説を作るための監査。

## Summary

- 負け試合中のシールド: 72
- Team connected: 48 (66.7%)
- Target connected: 32 (44.4%)
- Front process connected: 45 (62.5%)
- Front damage/kill: 37 (51.4%)
- No contact / no connection: 11 (15.3%)
- Contact / no connection: 13 (18.1%)
- Low stone after shield: 59 (81.9%)
- Multi-shield turn: 8 (11.1%)
- Shield before same-turn work: 0 (0%)
- Any front-process plan: 64 (88.9%)
- No front-process plan: 8 (11.1%)
- Shield first with no front-process plan: 0 (0%)

## Variant Metrics

| Variant | W-L-D | Loss Shield | Team Conn | Target Conn | Front Proc | Front Dmg/Kill | Same Attack | Same Wake | Next Attack | Next Wake | NoContact NoConn | Contact NoConn | Removed | LowStone | MultiShield | Shield Before Work | Retreat |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 0-4-0 | 42 | 29 (69%) | 18 (42.9%) | 28 (66.7%) | 22 (52.4%) | 0 (0%) | 0 (0%) | 29 (69%) | 1 (2.4%) | 7 (16.7%) | 6 (14.3%) | 5 (11.9%) | 34 (81%) | 2 (4.8%) | 0 (0%) | 0 (0%) |
| current_threat_then_setup | 1-3-0 | 30 | 19 (63.3%) | 14 (46.7%) | 17 (56.7%) | 15 (50%) | 0 (0%) | 0 (0%) | 19 (63.3%) | 3 (10%) | 4 (13.3%) | 7 (23.3%) | 7 (23.3%) | 25 (83.3%) | 6 (20%) | 0 (0%) | 0 (0%) |

## Shield Connection Plan Metrics

| Variant | W-L-D | Loss Shield | Before Front | After Front | Next Front | Any Front Plan | No Front Plan | Shield First | Shield First No Plan | Shield After Front | Shield Before Front | Next Starts Front |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 0-4-0 | 42 | 32 (76.2%) | 0 (0%) | 28 (66.7%) | 39 (92.9%) | 3 (7.1%) | 0 (0%) | 0 (0%) | 32 (76.2%) | 0 (0%) | 13 (31%) |
| current_threat_then_setup | 1-3-0 | 30 | 23 (76.7%) | 0 (0%) | 17 (56.7%) | 25 (83.3%) | 5 (16.7%) | 0 (0%) | 0 (0%) | 23 (76.7%) | 0 (0%) | 9 (30%) |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Loss Shield | Team Conn | Target Conn | Front Proc | NoContact NoConn | MultiShield |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | white_current_mirror | 0-4-0 | 42 | 29 (69%) | 18 (42.9%) | 28 (66.7%) | 7 (16.7%) | 2 (4.8%) |
| current_threat_then_setup | white_current_mirror | 1-3-0 | 30 | 19 (63.3%) | 14 (46.7%) | 17 (56.7%) | 4 (13.3%) | 6 (20%) |

## Samples

### front_process_connected: 真勇者ダイン seed 141200 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 0 / score 55
- flags: team-connected, target-not-connected, front-process, no-contact, low-stone, front-plan
- same turn before shield: focus:player_front_left / focus:player_front_right / summon:player_yanbaru_3->player_back_left / focus:player_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_left / attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / ...
- next turn first: focus:player_front_left
- opponent response: focus:cpu_front_right / attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_front_left:attack->monster:player_front_left / summon:cpu_polyspinner_2->cpu_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ヤンバル Lv1 HP3 prep / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv1 HP6 prep / CF:ドノマンティス Lv1 HP5 prep / CB:ピグミィ Lv1 HP3 prep

### contact_no_connection: 真勇者ダイン seed 141200 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 1 / score 55
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: focus:player_front_left / attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: focus:cpu_front_right / magic:cpu_card_031_1->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り、マスター特技は192点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv1 HP5 / CF:ドノマンティス Lv1 HP5 shield / CB:ピグミィ Lv1 HP3 / CB:ポリスピナー Lv1 HP3 prep

### removed_without_connection: 真勇者ダイン seed 141200 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 1 / score 55
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: focus:player_front_left / attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: focus:cpu_front_right / magic:cpu_card_031_1->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り、マスター特技は192点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv1 HP5 / CF:ドノマンティス Lv1 HP5 shield / CB:ピグミィ Lv1 HP3 / CB:ポリスピナー Lv1 HP3 prep

### low_stone_no_connection: 真勇者ダイン seed 141200 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 1 / score 55
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: focus:player_front_left / attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: focus:cpu_front_right / magic:cpu_card_031_1->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り、マスター特技は192点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv1 HP5 / CF:ドノマンティス Lv1 HP5 shield / CB:ピグミィ Lv1 HP3 / CB:ポリスピナー Lv1 HP3 prep

### shield_after_front_process: 真勇者ダイン seed 141200 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 1 / score 55
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: focus:player_front_left / attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: focus:cpu_front_right / magic:cpu_card_031_1->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り、マスター特技は192点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv1 HP5 / CF:ドノマンティス Lv1 HP5 shield / CB:ピグミィ Lv1 HP3 / CB:ポリスピナー Lv1 HP3 prep

### shield_after_front_process: 真勇者ダイン seed 141200 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 2 / score 55
- flags: team-connected, target-not-connected, front-process, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_right / focus:player_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: magic:player_card_031_1->monster:cpu_back_left / attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_left / attack:player_front_right:attack->monster:cpu_front_right / ...
- next turn first: magic:player_card_031_1->monster:cpu_back_left
- opponent response: attack:cpu_back_left:スパイクボール->monster:player_front_right / focus:cpu_front_right / attack:cpu_front_left:attack->monster:player_front_left / focus:cpu_back_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り、マスター特技は38点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ヤンバル Lv2 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv1 HP6 prep / CF:ドノマンティス Lv1 HP4 shield / CB:ピグミィ Lv1 HP3 / CB:ポリスピナー Lv1 HP3

### front_process_connected: 真勇者ダイン seed 141200 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 2 / score 55
- flags: team-connected, target-not-connected, front-process, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_right / focus:player_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: magic:player_card_031_1->monster:cpu_back_left / attack:player_back_left:wild_claw->monster:cpu_front_right / focus:player_front_left / attack:player_front_right:attack->monster:cpu_front_right / ...
- next turn first: magic:player_card_031_1->monster:cpu_back_left
- opponent response: attack:cpu_back_left:スパイクボール->monster:player_front_right / focus:cpu_front_right / attack:cpu_front_left:attack->monster:player_front_left / focus:cpu_back_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り、マスター特技は38点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv1 HP6 / PB:ヤンバル Lv2 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv1 HP6 prep / CF:ドノマンティス Lv1 HP4 shield / CB:ピグミィ Lv1 HP3 / CB:ポリスピナー Lv1 HP3

### shield_after_front_process: デスシープ seed 141200 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 2 / score 59.5
- flags: team-connected, target-connected, front-process, no-contact, low-stone, multi-shield-turn, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_left:attack->master:cpu / attack:player_front_right:self_bomb->monster:cpu_front_right / summon:player_card_037_2->player_back_right / focus:player_back_left
- same turn: master:shield->monster:player_front_right / end_turn
- same turn first after shield: master:shield->monster:player_front_right
- next turn: attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- next turn first: attack:player_back_left:スパイクボール->monster:cpu_front_left
- opponent response: summon:cpu_yanbaru_2->cpu_back_right / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv1 HP3 / PB:ドノマンティス Lv1 HP5 prep / CF:ドノマンティス Lv1 HP5 prep / CB:ヤンバル Lv1 HP3 / CB:ボムゾウ Lv2 HP5

### next_turn_starts_front_process: デスシープ seed 141200 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 2 / score 59.5
- flags: team-connected, target-connected, front-process, no-contact, low-stone, multi-shield-turn, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_left:attack->master:cpu / attack:player_front_right:self_bomb->monster:cpu_front_right / summon:player_card_037_2->player_back_right / focus:player_back_left
- same turn: master:shield->monster:player_front_right / end_turn
- same turn first after shield: master:shield->monster:player_front_right
- next turn: attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- next turn first: attack:player_back_left:スパイクボール->monster:cpu_front_left
- opponent response: summon:cpu_yanbaru_2->cpu_back_right / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv1 HP3 / PB:ドノマンティス Lv1 HP5 prep / CF:ドノマンティス Lv1 HP5 prep / CB:ヤンバル Lv1 HP3 / CB:ボムゾウ Lv2 HP5

### front_process_connected: デスシープ seed 141200 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 2 / score 59.5
- flags: team-connected, target-connected, front-process, no-contact, low-stone, multi-shield-turn, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_left:attack->master:cpu / attack:player_front_right:self_bomb->monster:cpu_front_right / summon:player_card_037_2->player_back_right / focus:player_back_left
- same turn: master:shield->monster:player_front_right / end_turn
- same turn first after shield: master:shield->monster:player_front_right
- next turn: attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- next turn first: attack:player_back_left:スパイクボール->monster:cpu_front_left
- opponent response: summon:cpu_yanbaru_2->cpu_back_right / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv1 HP3 / PB:ドノマンティス Lv1 HP5 prep / CF:ドノマンティス Lv1 HP5 prep / CB:ヤンバル Lv1 HP3 / CB:ボムゾウ Lv2 HP5

### shield_after_front_process: ボムゾウ seed 141200 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 58.4
- flags: team-connected, target-connected, front-process, no-contact, low-stone, multi-shield-turn, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_left:attack->master:cpu / attack:player_front_right:self_bomb->monster:cpu_front_right / summon:player_card_037_2->player_back_right / focus:player_back_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- next turn first: attack:player_back_left:スパイクボール->monster:cpu_front_left
- opponent response: summon:cpu_yanbaru_2->cpu_back_right / end_turn
- reason: 高価値の味方を守るためシールド
- board: PF:デスシープ Lv2 HP6 shield / PF:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv1 HP3 / PB:ドノマンティス Lv1 HP5 prep / CF:ドノマンティス Lv1 HP5 prep / CB:ヤンバル Lv1 HP3 / CB:ボムゾウ Lv2 HP5

### next_turn_starts_front_process: ボムゾウ seed 141200 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 58.4
- flags: team-connected, target-connected, front-process, no-contact, low-stone, multi-shield-turn, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_left:attack->master:cpu / attack:player_front_right:self_bomb->monster:cpu_front_right / summon:player_card_037_2->player_back_right / focus:player_back_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- next turn first: attack:player_back_left:スパイクボール->monster:cpu_front_left
- opponent response: summon:cpu_yanbaru_2->cpu_back_right / end_turn
- reason: 高価値の味方を守るためシールド
- board: PF:デスシープ Lv2 HP6 shield / PF:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv1 HP3 / PB:ドノマンティス Lv1 HP5 prep / CF:ドノマンティス Lv1 HP5 prep / CB:ヤンバル Lv1 HP3 / CB:ボムゾウ Lv2 HP5

### front_process_connected: ボムゾウ seed 141200 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 58.4
- flags: team-connected, target-connected, front-process, no-contact, low-stone, multi-shield-turn, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_left:attack->master:cpu / attack:player_front_right:self_bomb->monster:cpu_front_right / summon:player_card_037_2->player_back_right / focus:player_back_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- next turn first: attack:player_back_left:スパイクボール->monster:cpu_front_left
- opponent response: summon:cpu_yanbaru_2->cpu_back_right / end_turn
- reason: 高価値の味方を守るためシールド
- board: PF:デスシープ Lv2 HP6 shield / PF:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv1 HP3 / PB:ドノマンティス Lv1 HP5 prep / CF:ドノマンティス Lv1 HP5 prep / CB:ヤンバル Lv1 HP3 / CB:ボムゾウ Lv2 HP5

### shield_after_front_process: ボムゾウ seed 141200 turn 10

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 1 / score 124.4
- flags: team-connected, target-connected, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_front_right:storm_bomb->monster:cpu_back_left / attack:player_front_left:スパイクボール->monster:cpu_back_left / move:player_back_right->player_front_left / end_turn
- next turn first: attack:player_front_right:storm_bomb->monster:cpu_back_left
- opponent response: move:cpu_front_left->cpu_back_left / attack:cpu_front_right:storm_bomb->monster:player_front_left / attack:cpu_back_right:wild_claw->monster:player_front_left / summon:cpu_polyspinner_3->cpu_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は89点差で見送り、マスター特技は97点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:ボムゾウ Lv2 HP5 / PB:ピグミィ Lv1 HP3 / PB:ドノマンティス Lv1 HP5 / CF:ボムゾウ Lv2 HP5 / CB:ヤンバル Lv1 HP3 / CB:ヤンバル Lv1 HP3 prep

### no_contact_no_connection: ピグミィ seed 141200 turn 13

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_back_left / role back / stones after 6 / score 62
- flags: team-not-connected, target-not-connected, no-contact, no-front-plan
- same turn before shield: summon:player_card_133_2->player_front_left / summon:player_card_051_3->player_back_right / move:player_front_right->player_back_left / focus:player_back_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_left / focus:player_front_right / summon:player_polyspinner_3->player_back_right / master:shield->monster:player_front_right / ...
- next turn first: focus:player_front_left
- opponent response: master:wake_up->monster:player_back_right / attack:cpu_front_left:wild_claw->monster:player_back_right / summon:cpu_bomuzo_2->cpu_front_right / focus:cpu_back_left
- reason: 高価値の味方を守るためシールド
- board: PF:デスシープ Lv1 HP6 prep / PF:ボムゾウ Lv1 HP6 prep / PB:ピグミィ Lv2 HP3 / PB:ピグミィ Lv1 HP3 prep / CF:ヤンバル Lv2 HP3 shield / CB:ピグミィ Lv1 HP3 prep

### no_front_process_plan: ピグミィ seed 141200 turn 13

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_back_left / role back / stones after 6 / score 62
- flags: team-not-connected, target-not-connected, no-contact, no-front-plan
- same turn before shield: summon:player_card_133_2->player_front_left / summon:player_card_051_3->player_back_right / move:player_front_right->player_back_left / focus:player_back_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_left / focus:player_front_right / summon:player_polyspinner_3->player_back_right / master:shield->monster:player_front_right / ...
- next turn first: focus:player_front_left
- opponent response: master:wake_up->monster:player_back_right / attack:cpu_front_left:wild_claw->monster:player_back_right / summon:cpu_bomuzo_2->cpu_front_right / focus:cpu_back_left
- reason: 高価値の味方を守るためシールド
- board: PF:デスシープ Lv1 HP6 prep / PF:ボムゾウ Lv1 HP6 prep / PB:ピグミィ Lv2 HP3 / PB:ピグミィ Lv1 HP3 prep / CF:ヤンバル Lv2 HP3 shield / CB:ピグミィ Lv1 HP3 prep

### front_process_connected: ボムゾウ seed 141200 turn 14

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 7 / score 55
- flags: team-connected, target-not-connected, front-process, no-contact, front-plan
- same turn before shield: focus:player_front_left / focus:player_front_right / summon:player_polyspinner_3->player_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: move:player_back_right->player_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / ...
- next turn first: move:player_back_right->player_front_right
- opponent response: move:cpu_front_left->cpu_back_right / summon:cpu_bomuzo_3->cpu_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / focus:cpu_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は37点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ピグミィ Lv2 HP3 / PB:ポリスピナー Lv1 HP3 prep / CF:ヤンバル Lv2 HP3 shield / CF:ボムゾウ Lv1 HP6 prep / CB:ピグミィ Lv1 HP3

### next_turn_starts_front_process: ドノマンティス seed 141200 turn 22

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 2 / score 124.4
- flags: team-connected, target-not-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_left:呪いの刃->monster:cpu_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_back_left:スパイクボール->monster:cpu_front_left / master:shield->monster:player_front_left / end_turn
- next turn first: attack:player_back_left:スパイクボール->monster:cpu_front_left
- opponent response: attack:cpu_back_right:wild_claw->master:player / attack:cpu_front_right:呪いの刃->master:player / end_turn
- reason: 致死圏の味方を守れるためシールド
- board: PF:ドノマンティス Lv2 HP5 / PB:ピグミィ Lv2 HP3 / CF:ドノマンティス Lv2 HP5 / CB:デスシープ Lv1 HP6 prep / CB:ヤンバル Lv2 HP3

### no_contact_no_connection: ドノマンティス seed 141200 turn 23

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 6 / score 126.6
- flags: team-not-connected, target-not-connected, no-contact, front-plan, shield-after-front
- same turn before shield: attack:player_back_left:スパイクボール->monster:cpu_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:cpu_back_right:wild_claw->master:player
- reason: 致死圏の味方を守れるためシールド
- board: PF:ドノマンティス Lv2 HP5 / PB:ピグミィ Lv2 HP3 / CF:デスシープ Lv1 HP6 / CF:ドノマンティス Lv2 HP5 / CB:ヤンバル Lv2 HP3

### contact_no_connection: ピグミィ seed 141201 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_back_left / role back / stones after 1 / score 58.8
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_front_left:スパイクボール->monster:cpu_front_right / focus:player_front_right / move:player_front_left->player_back_left / move:player_back_right->player_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:cpu_front_left:ダイン斬り->monster:player_front_left / master:master_attack->monster:player_front_left / focus:cpu_front_right / attack:cpu_back_left:スパイクボール->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は6点差で見送り、マスター特技は9点差で見送り
- board: PF:ポリスピナー Lv1 HP3 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv2 HP3 / PB:デスシープ Lv1 HP6 prep / CF:真勇者ダイン Lv1 HP5 / CF:デスシープ Lv1 HP5 / CB:ピグミィ Lv2 HP3 / CB:ポリスピナー Lv1 HP3

### removed_without_connection: ピグミィ seed 141201 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_back_left / role back / stones after 1 / score 58.8
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_front_left:スパイクボール->monster:cpu_front_right / focus:player_front_right / move:player_front_left->player_back_left / move:player_back_right->player_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:cpu_front_left:ダイン斬り->monster:player_front_left / master:master_attack->monster:player_front_left / focus:cpu_front_right / attack:cpu_back_left:スパイクボール->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は6点差で見送り、マスター特技は9点差で見送り
- board: PF:ポリスピナー Lv1 HP3 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv2 HP3 / PB:デスシープ Lv1 HP6 prep / CF:真勇者ダイン Lv1 HP5 / CF:デスシープ Lv1 HP5 / CB:ピグミィ Lv2 HP3 / CB:ポリスピナー Lv1 HP3

### low_stone_no_connection: ピグミィ seed 141201 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_back_left / role back / stones after 1 / score 58.8
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_front_left:スパイクボール->monster:cpu_front_right / focus:player_front_right / move:player_front_left->player_back_left / move:player_back_right->player_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:cpu_front_left:ダイン斬り->monster:player_front_left / master:master_attack->monster:player_front_left / focus:cpu_front_right / attack:cpu_back_left:スパイクボール->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は6点差で見送り、マスター特技は9点差で見送り
- board: PF:ポリスピナー Lv1 HP3 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv2 HP3 / PB:デスシープ Lv1 HP6 prep / CF:真勇者ダイン Lv1 HP5 / CF:デスシープ Lv1 HP5 / CB:ピグミィ Lv2 HP3 / CB:ポリスピナー Lv1 HP3

### next_turn_starts_front_process: ピグミィ seed 141201 turn 7

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_back_left / role back / stones after 0 / score 58.8
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: focus:player_front_left / focus:player_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_front_left:self_bomb->monster:cpu_front_left / focus:player_front_right / master:master_attack->monster:cpu_front_left / attack:player_back_left:スパイクボール->monster:cpu_back_left / ...
- next turn first: attack:player_front_left:self_bomb->monster:cpu_front_left
- opponent response: focus:cpu_front_right / attack:cpu_front_left:スパイクボール->monster:player_front_right / move:cpu_back_right->cpu_front_left / master:shield->monster:cpu_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は8点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:デスシープ Lv1 HP4 / PB:ピグミィ Lv2 HP3 / PB:ドノマンティス Lv1 HP5 / CF:ピグミィ Lv2 HP3 / CF:真勇者ダイン Lv1 HP5 / CB:ポリスピナー Lv1 HP3 / CB:デスシープ Lv1 HP5

### no_contact_no_connection: 真勇者ダイン seed 141202 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 1 / score 55
- flags: team-not-connected, target-not-connected, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: focus:cpu_front_right / focus:cpu_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / summon:cpu_yanbaru_1->cpu_back_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:cpu_front_left / move:cpu_back_left->cpu_back_right / magic:cpu_card_093_1->master:cpu / summon:cpu_card_133_2->cpu_front_left / ...
- next turn first: focus:cpu_front_left
- opponent response: attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は8点差で見送り、マスター特技は41点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv2 HP6 / PB:ピグミィ Lv2 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3 prep

### low_stone_no_connection: 真勇者ダイン seed 141202 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 1 / score 55
- flags: team-not-connected, target-not-connected, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: focus:cpu_front_right / focus:cpu_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / summon:cpu_yanbaru_1->cpu_back_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:cpu_front_left / move:cpu_back_left->cpu_back_right / magic:cpu_card_093_1->master:cpu / summon:cpu_card_133_2->cpu_front_left / ...
- next turn first: focus:cpu_front_left
- opponent response: attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_right:スパイクボール->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は8点差で見送り、マスター特技は41点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:デスシープ Lv2 HP6 / PB:ピグミィ Lv2 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3 prep

### next_turn_starts_front_process: 真勇者ダイン seed 141202 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 2 / score 59.5
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: move:cpu_front_left->cpu_back_left / attack:cpu_front_right:ダイン斬り->master:player / attack:cpu_back_right:wild_claw->monster:player_front_left / summon:cpu_polyspinner_2->cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:cpu_front_right:ダイン斬り->monster:player_front_right / master:master_attack->monster:player_front_right / attack:cpu_back_right:wild_claw->monster:player_front_right / summon:cpu_card_051_1->cpu_back_left / ...
- next turn first: attack:cpu_front_right:ダイン斬り->monster:player_front_right
- opponent response: master:wake_up->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left / focus:player_front_right / focus:player_back_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は2点差で見送り、マスター特技は32点差で見送り
- board: PF:デスシープ Lv2 HP4 / PF:真勇者ダイン Lv1 HP6 prep / PB:ピグミィ Lv1 HP3 / PB:ピグミィ Lv2 HP3 / CF:ポリスピナー Lv1 HP3 prep / CF:真勇者ダイン Lv2 HP6 / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3

### contact_no_connection: ポリスピナー seed 141202 turn 14

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 0 / score 122.3
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, front-plan, shield-after-front
- same turn before shield: focus:cpu_front_left / move:cpu_front_right->cpu_back_left / master:master_attack->monster:player_front_left / attack:cpu_front_left:attack->monster:player_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: move:player_front_left->player_back_left / attack:player_back_right:wild_claw->monster:cpu_front_left / summon:player_polyspinner_3->player_front_left / master:wake_up->monster:player_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は390点差で見送り
- board: PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / PB:ヤンバル Lv2 HP3 / CF:ポリスピナー Lv2 HP3 / CB:ヤンバル Lv2 HP3 / CB:ヤンバル Lv1 HP3 prep

### removed_without_connection: ポリスピナー seed 141202 turn 14

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 0 / score 122.3
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, front-plan, shield-after-front
- same turn before shield: focus:cpu_front_left / move:cpu_front_right->cpu_back_left / master:master_attack->monster:player_front_left / attack:cpu_front_left:attack->monster:player_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: move:player_front_left->player_back_left / attack:player_back_right:wild_claw->monster:cpu_front_left / summon:player_polyspinner_3->player_front_left / master:wake_up->monster:player_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は390点差で見送り
- board: PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / PB:ヤンバル Lv2 HP3 / CF:ポリスピナー Lv2 HP3 / CB:ヤンバル Lv2 HP3 / CB:ヤンバル Lv1 HP3 prep

### low_stone_no_connection: ポリスピナー seed 141202 turn 14

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 0 / score 122.3
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, front-plan, shield-after-front
- same turn before shield: focus:cpu_front_left / move:cpu_front_right->cpu_back_left / master:master_attack->monster:player_front_left / attack:cpu_front_left:attack->monster:player_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: move:player_front_left->player_back_left / attack:player_back_right:wild_claw->monster:cpu_front_left / summon:player_polyspinner_3->player_front_left / master:wake_up->monster:player_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は390点差で見送り
- board: PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / PB:ヤンバル Lv2 HP3 / CF:ポリスピナー Lv2 HP3 / CB:ヤンバル Lv2 HP3 / CB:ヤンバル Lv1 HP3 prep

### contact_no_connection: ヤンバル seed 141202 turn 16

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role back / stones after 2 / score 134.1
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, no-front-plan
- same turn before shield: summon:cpu_card_051_3->cpu_back_left / attack:cpu_front_left:wild_claw->monster:player_back_left / summon:cpu_card_133_3->cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:player_back_left:wild_claw->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left
- reason: 致死圏の味方を守れるためシールド
- board: PF:ポリスピナー Lv1 HP3 prep / PF:デスシープ Lv1 HP6 shield / PB:ヤンバル Lv2 HP1 / PB:ピグミィ Lv1 HP3 / CF:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### removed_without_connection: ヤンバル seed 141202 turn 16

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role back / stones after 2 / score 134.1
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, no-front-plan
- same turn before shield: summon:cpu_card_051_3->cpu_back_left / attack:cpu_front_left:wild_claw->monster:player_back_left / summon:cpu_card_133_3->cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:player_back_left:wild_claw->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left
- reason: 致死圏の味方を守れるためシールド
- board: PF:ポリスピナー Lv1 HP3 prep / PF:デスシープ Lv1 HP6 shield / PB:ヤンバル Lv2 HP1 / PB:ピグミィ Lv1 HP3 / CF:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### low_stone_no_connection: ヤンバル seed 141202 turn 16

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role back / stones after 2 / score 134.1
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, no-front-plan
- same turn before shield: summon:cpu_card_051_3->cpu_back_left / attack:cpu_front_left:wild_claw->monster:player_back_left / summon:cpu_card_133_3->cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:player_back_left:wild_claw->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left
- reason: 致死圏の味方を守れるためシールド
- board: PF:ポリスピナー Lv1 HP3 prep / PF:デスシープ Lv1 HP6 shield / PB:ヤンバル Lv2 HP1 / PB:ピグミィ Lv1 HP3 / CF:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### no_front_process_plan: ヤンバル seed 141202 turn 16

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role back / stones after 2 / score 134.1
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, no-front-plan
- same turn before shield: summon:cpu_card_051_3->cpu_back_left / attack:cpu_front_left:wild_claw->monster:player_back_left / summon:cpu_card_133_3->cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:player_back_left:wild_claw->monster:cpu_front_left / attack:player_front_left:attack->monster:cpu_front_left
- reason: 致死圏の味方を守れるためシールド
- board: PF:ポリスピナー Lv1 HP3 prep / PF:デスシープ Lv1 HP6 shield / PB:ヤンバル Lv2 HP1 / PB:ピグミィ Lv1 HP3 / CF:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### no_contact_no_connection: ピグミィ seed 141202 turn 24

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role back / stones after 16 / score 120.1
- flags: team-not-connected, target-not-connected, no-contact, front-plan, shield-after-front
- same turn before shield: attack:cpu_front_right:スパイクボール->monster:player_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: end_turn
- next turn first: end_turn
- opponent response: end_turn
- reason: 致死圏の味方を守れるためシールド
- board: PF:ポリスピナー Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ピグミィ Lv2 HP3

### no_contact_no_connection: デスシープ seed 141203 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 0 / score 51.8
- flags: team-not-connected, target-not-connected, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: attack:cpu_front_left:attack->monster:player_front_left / focus:cpu_front_right / master:master_attack->monster:player_front_left / summon:cpu_card_037_1->cpu_back_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:cpu_front_right / focus:cpu_front_left / focus:cpu_back_right / master:shield->monster:cpu_front_left / ...
- next turn first: focus:cpu_front_right
- opponent response: attack:player_front_right:attack->monster:cpu_front_right / summon:player_card_047_1->player_back_left / focus:player_back_right / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は3点差で見送り
- board: PF:デスシープ Lv2 HP6 shield / PB:ボムゾウ Lv1 HP6 / PB:デスシープ Lv1 HP6 prep / CF:デスシープ Lv1 HP6 / CF:デスシープ Lv1 HP6 / CB:ドノマンティス Lv1 HP5 / CB:ドノマンティス Lv1 HP5 prep

### contact_no_connection: デスシープ seed 141203 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 1 / score 55
- flags: team-not-connected, target-not-connected, contact:1, low-stone, no-front-plan
- same turn before shield: focus:cpu_front_right / focus:cpu_front_left / focus:cpu_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: summon:cpu_card_051_2->cpu_back_right / end_turn
- next turn first: summon:cpu_card_051_2->cpu_back_right
- opponent response: attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / focus:player_back_left / attack:player_front_left:self_bomb->monster:cpu_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は2点差で見送り、マスター特技は278点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:デスシープ Lv2 HP6 / PB:真勇者ダイン Lv1 HP6 prep / PB:デスシープ Lv1 HP6 / CF:デスシープ Lv1 HP6 / CF:デスシープ Lv1 HP4 / CB:ドノマンティス Lv1 HP5 / CB:ドノマンティス Lv1 HP5

### no_front_process_plan: デスシープ seed 141203 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 1 / score 55
- flags: team-not-connected, target-not-connected, contact:1, low-stone, no-front-plan
- same turn before shield: focus:cpu_front_right / focus:cpu_front_left / focus:cpu_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: summon:cpu_card_051_2->cpu_back_right / end_turn
- next turn first: summon:cpu_card_051_2->cpu_back_right
- opponent response: attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / focus:player_back_left / attack:player_front_left:self_bomb->monster:cpu_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は2点差で見送り、マスター特技は278点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:デスシープ Lv2 HP6 / PB:真勇者ダイン Lv1 HP6 prep / PB:デスシープ Lv1 HP6 / CF:デスシープ Lv1 HP6 / CF:デスシープ Lv1 HP4 / CB:ドノマンティス Lv1 HP5 / CB:ドノマンティス Lv1 HP5

### removed_without_connection: ドノマンティス seed 141203 turn 10

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 2 / score 50.7
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, front-plan, shield-after-front
- same turn before shield: attack:cpu_front_left:スパイクボール->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / attack:cpu_back_right:スパイクボール->monster:player_front_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: magic:player_card_031_1->monster:cpu_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は26点差で見送り、マスター特技は241点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PB:ヤンバル Lv2 HP3 / PB:デスシープ Lv1 HP6 / CF:ボムゾウ Lv1 HP6 prep / CF:ドノマンティス Lv1 HP5 / CB:ピグミィ Lv1 HP3 / CB:ピグミィ Lv2 HP3

### no_front_process_plan: デスシープ seed 141205 turn 2

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 0 / score 55
- flags: team-not-connected, target-not-connected, no-contact, low-stone, no-front-plan
- same turn before shield: focus:player_front_right / summon:player_yanbaru_3->player_back_right / focus:player_front_left / attack:player_front_right:attack->master:cpu / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: move:player_back_left->player_front_right / focus:player_front_left / summon:player_card_037_2->player_back_right / master:shield->monster:player_front_left / ...
- next turn first: move:player_back_left->player_front_right
- opponent response: attack:cpu_back_left:wild_claw->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left / summon:cpu_bomuzo_1->cpu_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は10点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ポリスピナー Lv1 HP3 / PB:デスシープ Lv1 HP6 / PB:ヤンバル Lv1 HP3 prep / CF:真勇者ダイン Lv1 HP6 prep / CF:ドノマンティス Lv1 HP5 prep / CB:ヤンバル Lv1 HP3 prep

### multi_shield_no_connection: ヤンバル seed 141205 turn 6

- variant/opponent: `current_threat_then_setup` vs `white_current_mirror` (player)
- decision: player_front_left / role back / stones after 2 / score 110.2
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, multi-shield-turn, front-plan, shield-after-front
- same turn before shield: attack:player_front_left:wild_claw->monster:cpu_front_right / focus:player_front_right / summon:player_card_047_2->player_back_left
- same turn: master:shield->monster:player_front_right / end_turn
- same turn first after shield: master:shield->monster:player_front_right
- next turn: -
- next turn first: -
- opponent response: attack:cpu_back_right:wild_claw->monster:player_front_left / attack:cpu_back_left:wild_claw->monster:player_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は150点差で見送り
- board: PF:ヤンバル Lv1 HP3 / PF:デスシープ Lv2 HP6 / PB:真勇者ダイン Lv1 HP6 prep / PB:ドノマンティス Lv1 HP5 / CF:真勇者ダイン Lv1 HP5 / CF:ドノマンティス Lv2 HP5 shield / CB:ヤンバル Lv1 HP3 / CB:ヤンバル Lv2 HP3


## Notes

- この監査はAI本体を変更しない。負け試合に出たシールドだけを、同ターン/次自ターンの仕事へつながったかで分類する。
- `team-connected` は盾対象以外の攻撃/ウェイクも含む。`target-connected` は盾対象自身が攻撃/レベルアップへ変換されたケース。
- `front-process` は敵前衛への攻撃が選ばれたケースで、`front damage/kill` はその攻撃でHP減少または除去が発生したケース。
- 接触も後続仕事もない盾が目立つため、単純な盾抑制ではなく、盾前後の行動順と仕事予定の有無を次に見る価値がある。
- 相手に触られたが後続仕事へ残らない盾が一定数ある。守り切れない対象を守るより、相手に追加手数を強いるか、次ターンの処理役を残せたかで分ける必要がある。

## Next Loop Proposal

- 次は `shieldConnectionPlanAudit` として、シールド選択時に「この後または次自ターンに誰が何をする予定か」を候補評価ログへ出す。

## Reading

- `Team Conn`: 盾後、同ターンまたは次自ターンに自軍の攻撃/ウェイク/敵前衛処理が発生した割合。
- `Target Conn`: 盾対象自身が同ターン/次自ターンに攻撃、敵前衛処理、レベルアップへ変換された割合。
- `Front Proc`: 盾後の同ターン/次自ターンに敵前衛を攻撃した割合。
- `NoContact NoConn`: 次自ターンまで相手に触られず、かつ後続仕事にもつながらなかった盾。
- `Shield Before Work`: 同ターンに盾より後で攻撃またはウェイクアップをしているケース。相手反撃がないなら行動順の疑いがある。
