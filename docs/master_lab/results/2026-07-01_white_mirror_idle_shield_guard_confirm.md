# White Shield Follow-up Loss Audit

生成: 2026-06-30T23:52:50.287Z
seedStart: 141500
候補: current_white_baseline
相手: white_current_mirror
試行: 4 games/matchup/direction
総試合: 8
負け試合: 5
盾あり負け試合: 5

## Purpose

盾をさらに減らすのではなく、負けseedのシールドが「攻撃」「ウェイクアップ」「敵前衛処理」へ接続できているかを見る。勝率採用判断ではなく、次の改善仮説を作るための監査。

## Summary

- 負け試合中のシールド: 47
- Team connected: 30 (63.8%)
- Target connected: 21 (44.7%)
- Front process connected: 27 (57.4%)
- Front damage/kill: 21 (44.7%)
- No contact / no connection: 12 (25.5%)
- Contact / no connection: 5 (10.6%)
- Low stone after shield: 35 (74.5%)
- Multi-shield turn: 8 (17%)
- Shield before same-turn work: 0 (0%)
- Any front-process plan: 38 (80.9%)
- No front-process plan: 9 (19.1%)
- Shield first with no front-process plan: 1 (2.1%)

## Variant Metrics

| Variant | W-L-D | Loss Shield | Team Conn | Target Conn | Front Proc | Front Dmg/Kill | Same Attack | Same Wake | Next Attack | Next Wake | NoContact NoConn | Contact NoConn | Removed | LowStone | MultiShield | Shield Before Work | Retreat |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 3-5-0 | 47 | 30 (63.8%) | 21 (44.7%) | 27 (57.4%) | 21 (44.7%) | 0 (0%) | 0 (0%) | 30 (63.8%) | 5 (10.6%) | 12 (25.5%) | 5 (10.6%) | 5 (10.6%) | 35 (74.5%) | 8 (17%) | 0 (0%) | 0 (0%) |

## Shield Connection Plan Metrics

| Variant | W-L-D | Loss Shield | Before Front | After Front | Next Front | Any Front Plan | No Front Plan | Shield First | Shield First No Plan | Shield After Front | Shield Before Front | Next Starts Front |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 3-5-0 | 47 | 29 (61.7%) | 0 (0%) | 27 (57.4%) | 38 (80.9%) | 9 (19.1%) | 1 (2.1%) | 1 (2.1%) | 29 (61.7%) | 0 (0%) | 15 (31.9%) |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Loss Shield | Team Conn | Target Conn | Front Proc | NoContact NoConn | MultiShield |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | white_current_mirror | 3-5-0 | 47 | 30 (63.8%) | 21 (44.7%) | 27 (57.4%) | 12 (25.5%) | 8 (17%) |

## Samples

### shield_after_front_process: 真勇者ダイン seed 141501 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 2 / score 67.3
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: focus:player_front_left / summon:player_card_037_1->player_back_right / attack:player_back_left:wild_claw->monster:cpu_front_right / attack:player_front_right:ダイン斬り->monster:cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_front_left:wild_claw->monster:cpu_front_right / attack:player_front_right:ダイン斬り->monster:cpu_front_right / focus:player_back_right / end_turn
- next turn first: attack:player_front_left:wild_claw->monster:cpu_front_right
- opponent response: attack:cpu_front_left:ダイン斬り->monster:player_front_left / focus:cpu_front_right / attack:cpu_back_left:スパイクボール->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は20点差で見送り、マスター特技は263点差で見送り
- board: PF:デスシープ Lv1 HP3 / PF:真勇者ダイン Lv3 HP6 / PB:ヤンバル Lv1 HP3 / PB:ドノマンティス Lv1 HP5 prep / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv1 HP3 / CB:ドノマンティス Lv1 HP5 prep

### next_turn_starts_front_process: 真勇者ダイン seed 141501 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 2 / score 67.3
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: focus:player_front_left / summon:player_card_037_1->player_back_right / attack:player_back_left:wild_claw->monster:cpu_front_right / attack:player_front_right:ダイン斬り->monster:cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_front_left:wild_claw->monster:cpu_front_right / attack:player_front_right:ダイン斬り->monster:cpu_front_right / focus:player_back_right / end_turn
- next turn first: attack:player_front_left:wild_claw->monster:cpu_front_right
- opponent response: attack:cpu_front_left:ダイン斬り->monster:player_front_left / focus:cpu_front_right / attack:cpu_back_left:スパイクボール->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は20点差で見送り、マスター特技は263点差で見送り
- board: PF:デスシープ Lv1 HP3 / PF:真勇者ダイン Lv3 HP6 / PB:ヤンバル Lv1 HP3 / PB:ドノマンティス Lv1 HP5 prep / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv1 HP3 / CB:ドノマンティス Lv1 HP5 prep

### front_process_connected: 真勇者ダイン seed 141501 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 2 / score 67.3
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front, next-start-front
- same turn before shield: focus:player_front_left / summon:player_card_037_1->player_back_right / attack:player_back_left:wild_claw->monster:cpu_front_right / attack:player_front_right:ダイン斬り->monster:cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_front_left:wild_claw->monster:cpu_front_right / attack:player_front_right:ダイン斬り->monster:cpu_front_right / focus:player_back_right / end_turn
- next turn first: attack:player_front_left:wild_claw->monster:cpu_front_right
- opponent response: attack:cpu_front_left:ダイン斬り->monster:player_front_left / focus:cpu_front_right / attack:cpu_back_left:スパイクボール->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は20点差で見送り、マスター特技は263点差で見送り
- board: PF:デスシープ Lv1 HP3 / PF:真勇者ダイン Lv3 HP6 / PB:ヤンバル Lv1 HP3 / PB:ドノマンティス Lv1 HP5 prep / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv1 HP3 / CB:ドノマンティス Lv1 HP5 prep

### shield_after_front_process: ドノマンティス seed 141501 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 7 / score 50.7
- flags: team-connected, target-connected, front-process, no-contact, multi-shield-turn, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_card_051_3->player_back_left / move:player_back_right->player_front_left
- same turn: master:shield->monster:player_front_right / end_turn
- same turn first after shield: master:shield->monster:player_front_right
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:wake_up->monster:player_back_right / ...
- next turn first: attack:player_front_right:ダイン斬り->monster:cpu_front_right
- opponent response: focus:cpu_front_left / focus:cpu_front_right / summon:cpu_card_133_1->cpu_back_right / master:shield->monster:cpu_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は10点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv1 HP3 prep / CF:真勇者ダイン Lv2 HP6 shield / CB:ピグミィ Lv2 HP3 / CB:ドノマンティス Lv1 HP5 prep

### next_turn_starts_front_process: ドノマンティス seed 141501 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 7 / score 50.7
- flags: team-connected, target-connected, front-process, no-contact, multi-shield-turn, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_card_051_3->player_back_left / move:player_back_right->player_front_left
- same turn: master:shield->monster:player_front_right / end_turn
- same turn first after shield: master:shield->monster:player_front_right
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:wake_up->monster:player_back_right / ...
- next turn first: attack:player_front_right:ダイン斬り->monster:cpu_front_right
- opponent response: focus:cpu_front_left / focus:cpu_front_right / summon:cpu_card_133_1->cpu_back_right / master:shield->monster:cpu_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は10点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv1 HP3 prep / CF:真勇者ダイン Lv2 HP6 shield / CB:ピグミィ Lv2 HP3 / CB:ドノマンティス Lv1 HP5 prep

### front_process_connected: ドノマンティス seed 141501 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 7 / score 50.7
- flags: team-connected, target-connected, front-process, no-contact, multi-shield-turn, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_card_051_3->player_back_left / move:player_back_right->player_front_left
- same turn: master:shield->monster:player_front_right / end_turn
- same turn first after shield: master:shield->monster:player_front_right
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:wake_up->monster:player_back_right / ...
- next turn first: attack:player_front_right:ダイン斬り->monster:cpu_front_right
- opponent response: focus:cpu_front_left / focus:cpu_front_right / summon:cpu_card_133_1->cpu_back_right / master:shield->monster:cpu_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は10点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv1 HP3 prep / CF:真勇者ダイン Lv2 HP6 shield / CB:ピグミィ Lv2 HP3 / CB:ドノマンティス Lv1 HP5 prep

### shield_after_front_process: 真勇者ダイン seed 141501 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 5 / score 67.3
- flags: team-connected, target-connected, front-process, no-contact, multi-shield-turn, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_card_051_3->player_back_left / move:player_back_right->player_front_left / master:shield->monster:player_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:wake_up->monster:player_back_right / ...
- next turn first: attack:player_front_right:ダイン斬り->monster:cpu_front_right
- opponent response: focus:cpu_front_left / focus:cpu_front_right / summon:cpu_card_133_1->cpu_back_right / master:shield->monster:cpu_front_left
- reason: 高価値の味方を守るためシールド
- board: PF:ドノマンティス Lv1 HP5 shield / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv1 HP3 prep / CF:真勇者ダイン Lv2 HP6 shield / CB:ピグミィ Lv2 HP3 / CB:ドノマンティス Lv1 HP5 prep

### next_turn_starts_front_process: 真勇者ダイン seed 141501 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 5 / score 67.3
- flags: team-connected, target-connected, front-process, no-contact, multi-shield-turn, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_card_051_3->player_back_left / move:player_back_right->player_front_left / master:shield->monster:player_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:wake_up->monster:player_back_right / ...
- next turn first: attack:player_front_right:ダイン斬り->monster:cpu_front_right
- opponent response: focus:cpu_front_left / focus:cpu_front_right / summon:cpu_card_133_1->cpu_back_right / master:shield->monster:cpu_front_left
- reason: 高価値の味方を守るためシールド
- board: PF:ドノマンティス Lv1 HP5 shield / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv1 HP3 prep / CF:真勇者ダイン Lv2 HP6 shield / CB:ピグミィ Lv2 HP3 / CB:ドノマンティス Lv1 HP5 prep

### front_process_connected: 真勇者ダイン seed 141501 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 5 / score 67.3
- flags: team-connected, target-connected, front-process, no-contact, multi-shield-turn, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_card_051_3->player_back_left / move:player_back_right->player_front_left / master:shield->monster:player_front_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:wake_up->monster:player_back_right / ...
- next turn first: attack:player_front_right:ダイン斬り->monster:cpu_front_right
- opponent response: focus:cpu_front_left / focus:cpu_front_right / summon:cpu_card_133_1->cpu_back_right / master:shield->monster:cpu_front_left
- reason: 高価値の味方を守るためシールド
- board: PF:ドノマンティス Lv1 HP5 shield / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv1 HP3 prep / CF:真勇者ダイン Lv2 HP6 shield / CB:ピグミィ Lv2 HP3 / CB:ドノマンティス Lv1 HP5 prep

### shield_after_front_process: ドノマンティス seed 141501 turn 7

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 2 / score 116.7
- flags: team-connected, target-connected, front-process, no-contact, low-stone, multi-shield-turn, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:wake_up->monster:player_back_right / ...
- same turn: master:shield->monster:player_front_right / end_turn
- same turn first after shield: master:shield->monster:player_front_right
- next turn: attack:player_front_left:attack->monster:cpu_front_left / summon:player_card_047_1->player_back_right / move:player_back_left->player_front_right / master:shield->monster:player_front_right / ...
- next turn first: attack:player_front_left:attack->monster:cpu_front_left
- opponent response: magic:cpu_card_031_1->monster:player_front_right / attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / focus:cpu_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は65点差で見送り、マスター特技は70点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv2 HP3 / PB:ボムゾウ Lv1 HP6 / CF:真勇者ダイン Lv2 HP6 shield / CB:ピグミィ Lv2 HP3 / CB:デスシープ Lv1 HP6 prep

### next_turn_starts_front_process: ドノマンティス seed 141501 turn 7

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 2 / score 116.7
- flags: team-connected, target-connected, front-process, no-contact, low-stone, multi-shield-turn, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:wake_up->monster:player_back_right / ...
- same turn: master:shield->monster:player_front_right / end_turn
- same turn first after shield: master:shield->monster:player_front_right
- next turn: attack:player_front_left:attack->monster:cpu_front_left / summon:player_card_047_1->player_back_right / move:player_back_left->player_front_right / master:shield->monster:player_front_right / ...
- next turn first: attack:player_front_left:attack->monster:cpu_front_left
- opponent response: magic:cpu_card_031_1->monster:player_front_right / attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / focus:cpu_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は65点差で見送り、マスター特技は70点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv2 HP3 / PB:ボムゾウ Lv1 HP6 / CF:真勇者ダイン Lv2 HP6 shield / CB:ピグミィ Lv2 HP3 / CB:デスシープ Lv1 HP6 prep

### front_process_connected: ドノマンティス seed 141501 turn 7

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 2 / score 116.7
- flags: team-connected, target-connected, front-process, no-contact, low-stone, multi-shield-turn, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:wake_up->monster:player_back_right / ...
- same turn: master:shield->monster:player_front_right / end_turn
- same turn first after shield: master:shield->monster:player_front_right
- next turn: attack:player_front_left:attack->monster:cpu_front_left / summon:player_card_047_1->player_back_right / move:player_back_left->player_front_right / master:shield->monster:player_front_right / ...
- next turn first: attack:player_front_left:attack->monster:cpu_front_left
- opponent response: magic:cpu_card_031_1->monster:player_front_right / attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / focus:cpu_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は65点差で見送り、マスター特技は70点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv2 HP3 / PB:ボムゾウ Lv1 HP6 / CF:真勇者ダイン Lv2 HP6 shield / CB:ピグミィ Lv2 HP3 / CB:デスシープ Lv1 HP6 prep

### contact_no_connection: 真勇者ダイン seed 141501 turn 7

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 67.3
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, multi-shield-turn, front-plan, shield-after-front
- same turn before shield: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:wake_up->monster:player_back_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: magic:cpu_card_031_1->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は5点差で見送り
- board: PF:ドノマンティス Lv1 HP5 shield / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv2 HP3 / PB:ボムゾウ Lv1 HP6 / CF:真勇者ダイン Lv2 HP6 shield / CB:ピグミィ Lv2 HP3 / CB:デスシープ Lv1 HP6 prep

### removed_without_connection: 真勇者ダイン seed 141501 turn 7

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 67.3
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, multi-shield-turn, front-plan, shield-after-front
- same turn before shield: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:wake_up->monster:player_back_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: magic:cpu_card_031_1->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は5点差で見送り
- board: PF:ドノマンティス Lv1 HP5 shield / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv2 HP3 / PB:ボムゾウ Lv1 HP6 / CF:真勇者ダイン Lv2 HP6 shield / CB:ピグミィ Lv2 HP3 / CB:デスシープ Lv1 HP6 prep

### low_stone_no_connection: 真勇者ダイン seed 141501 turn 7

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 67.3
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, multi-shield-turn, front-plan, shield-after-front
- same turn before shield: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:wake_up->monster:player_back_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: magic:cpu_card_031_1->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は5点差で見送り
- board: PF:ドノマンティス Lv1 HP5 shield / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv2 HP3 / PB:ボムゾウ Lv1 HP6 / CF:真勇者ダイン Lv2 HP6 shield / CB:ピグミィ Lv2 HP3 / CB:デスシープ Lv1 HP6 prep

### multi_shield_no_connection: 真勇者ダイン seed 141501 turn 7

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 67.3
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, multi-shield-turn, front-plan, shield-after-front
- same turn before shield: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:wake_up->monster:player_back_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: magic:cpu_card_031_1->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は5点差で見送り
- board: PF:ドノマンティス Lv1 HP5 shield / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv2 HP3 / PB:ボムゾウ Lv1 HP6 / CF:真勇者ダイン Lv2 HP6 shield / CB:ピグミィ Lv2 HP3 / CB:デスシープ Lv1 HP6 prep

### shield_after_front_process: 真勇者ダイン seed 141501 turn 7

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 67.3
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, multi-shield-turn, front-plan, shield-after-front
- same turn before shield: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_bomuzo_2->player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:wake_up->monster:player_back_right / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: magic:cpu_card_031_1->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は5点差で見送り
- board: PF:ドノマンティス Lv1 HP5 shield / PF:真勇者ダイン Lv3 HP6 / PB:ピグミィ Lv2 HP3 / PB:ボムゾウ Lv1 HP6 / CF:真勇者ダイン Lv2 HP6 shield / CB:ピグミィ Lv2 HP3 / CB:デスシープ Lv1 HP6 prep

### front_process_connected: 真勇者ダイン seed 141501 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 2 / score 67.3
- flags: team-connected, target-connected, front-process, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_front_left:attack->monster:cpu_front_left / summon:player_card_047_1->player_back_right / move:player_back_left->player_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: summon:player_yanbaru_1->player_back_left / attack:player_front_right:ダイン斬り->monster:cpu_front_right / focus:player_front_left / focus:player_back_right / ...
- next turn first: summon:player_yanbaru_1->player_back_left
- opponent response: attack:cpu_front_left:ダイン斬り->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / focus:cpu_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は13点差で見送り、マスター特技は17点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:真勇者ダイン Lv3 HP6 / PB:ボムゾウ Lv1 HP6 / PB:真勇者ダイン Lv1 HP6 prep / CF:真勇者ダイン Lv2 HP6 shield / CF:デスシープ Lv2 HP6 / CB:ピグミィ Lv2 HP3

### no_contact_no_connection: 真勇者ダイン seed 141501 turn 13

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 65.1
- flags: team-not-connected, target-not-connected, no-contact, low-stone, no-front-plan
- same turn before shield: attack:player_front_right:ダイン斬り->master:cpu / summon:player_card_133_3->player_front_left / summon:player_card_133_2->player_back_left / focus:player_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: end_turn
- next turn first: end_turn
- opponent response: attack:cpu_front_left:ダイン斬り->master:player / focus:cpu_front_right / focus:cpu_back_left / focus:cpu_back_right
- reason: 高価値の味方を守るためシールド
- board: PF:デスシープ Lv1 HP6 prep / PF:真勇者ダイン Lv3 HP4 / PB:デスシープ Lv1 HP6 prep / PB:ピグミィ Lv2 HP3 / CF:真勇者ダイン Lv3 HP6 shield / CF:デスシープ Lv1 HP6 prep / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3

### low_stone_no_connection: 真勇者ダイン seed 141501 turn 13

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 65.1
- flags: team-not-connected, target-not-connected, no-contact, low-stone, no-front-plan
- same turn before shield: attack:player_front_right:ダイン斬り->master:cpu / summon:player_card_133_3->player_front_left / summon:player_card_133_2->player_back_left / focus:player_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: end_turn
- next turn first: end_turn
- opponent response: attack:cpu_front_left:ダイン斬り->master:player / focus:cpu_front_right / focus:cpu_back_left / focus:cpu_back_right
- reason: 高価値の味方を守るためシールド
- board: PF:デスシープ Lv1 HP6 prep / PF:真勇者ダイン Lv3 HP4 / PB:デスシープ Lv1 HP6 prep / PB:ピグミィ Lv2 HP3 / CF:真勇者ダイン Lv3 HP6 shield / CF:デスシープ Lv1 HP6 prep / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3

### no_front_process_plan: 真勇者ダイン seed 141501 turn 13

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 65.1
- flags: team-not-connected, target-not-connected, no-contact, low-stone, no-front-plan
- same turn before shield: attack:player_front_right:ダイン斬り->master:cpu / summon:player_card_133_3->player_front_left / summon:player_card_133_2->player_back_left / focus:player_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: end_turn
- next turn first: end_turn
- opponent response: attack:cpu_front_left:ダイン斬り->master:player / focus:cpu_front_right / focus:cpu_back_left / focus:cpu_back_right
- reason: 高価値の味方を守るためシールド
- board: PF:デスシープ Lv1 HP6 prep / PF:真勇者ダイン Lv3 HP4 / PB:デスシープ Lv1 HP6 prep / PB:ピグミィ Lv2 HP3 / CF:真勇者ダイン Lv3 HP6 shield / CF:デスシープ Lv1 HP6 prep / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3

### no_contact_no_connection: ピグミィ seed 141501 turn 16

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_back_right / role back / stones after 0 / score 58.8
- flags: team-not-connected, target-not-connected, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_front_right:attack->monster:cpu_front_right / move:player_front_left->player_back_right / master:master_attack->monster:cpu_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: end_turn
- next turn first: end_turn
- opponent response: summon:cpu_card_051_2->cpu_back_right / attack:cpu_front_left:ダイン斬り->master:player / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は11点差で見送り、召喚は128点差で見送り
- board: PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv2 HP3 / CF:真勇者ダイン Lv3 HP3 / CB:ピグミィ Lv2 HP3 / CB:ピグミィ Lv2 HP3

### low_stone_no_connection: ピグミィ seed 141501 turn 16

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_back_right / role back / stones after 0 / score 58.8
- flags: team-not-connected, target-not-connected, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_front_right:attack->monster:cpu_front_right / move:player_front_left->player_back_right / master:master_attack->monster:cpu_front_right / attack:player_back_right:スパイクボール->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: end_turn
- next turn first: end_turn
- opponent response: summon:cpu_card_051_2->cpu_back_right / attack:cpu_front_left:ダイン斬り->master:player / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は11点差で見送り、召喚は128点差で見送り
- board: PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv2 HP3 / CF:真勇者ダイン Lv3 HP3 / CB:ピグミィ Lv2 HP3 / CB:ピグミィ Lv2 HP3

### no_contact_no_connection: 真勇者ダイン seed 141502 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 1 / score 55
- flags: team-not-connected, target-not-connected, no-contact, low-stone, no-front-plan
- same turn before shield: focus:player_front_right / focus:player_front_left / attack:player_front_right:attack->master:cpu / focus:player_back_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_left / magic:player_card_031_1->monster:cpu_back_left / summon:player_yanbaru_2->player_back_right / end_turn
- next turn first: focus:player_front_left
- opponent response: attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_front_right:self_bomb->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left / summon:cpu_bomuzo_3->cpu_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は30点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ポリスピナー Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep / CB:ボムゾウ Lv1 HP6 prep

### low_stone_no_connection: 真勇者ダイン seed 141502 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 1 / score 55
- flags: team-not-connected, target-not-connected, no-contact, low-stone, no-front-plan
- same turn before shield: focus:player_front_right / focus:player_front_left / attack:player_front_right:attack->master:cpu / focus:player_back_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_left / magic:player_card_031_1->monster:cpu_back_left / summon:player_yanbaru_2->player_back_right / end_turn
- next turn first: focus:player_front_left
- opponent response: attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_front_right:self_bomb->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left / summon:cpu_bomuzo_3->cpu_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は30点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ポリスピナー Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep / CB:ボムゾウ Lv1 HP6 prep

### no_front_process_plan: 真勇者ダイン seed 141502 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 1 / score 55
- flags: team-not-connected, target-not-connected, no-contact, low-stone, no-front-plan
- same turn before shield: focus:player_front_right / focus:player_front_left / attack:player_front_right:attack->master:cpu / focus:player_back_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_left / magic:player_card_031_1->monster:cpu_back_left / summon:player_yanbaru_2->player_back_right / end_turn
- next turn first: focus:player_front_left
- opponent response: attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_front_right:self_bomb->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left / summon:cpu_bomuzo_3->cpu_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は30点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ポリスピナー Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep / CB:ボムゾウ Lv1 HP6 prep

### no_contact_no_connection: 真勇者ダイン seed 141502 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 2 / score 55
- flags: team-not-connected, target-not-connected, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / focus:player_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_left / summon:player_card_037_1->player_front_right / move:player_back_left->player_back_right / focus:player_back_right / ...
- next turn first: focus:player_front_left
- opponent response: summon:cpu_card_047_2->cpu_back_right / master:master_attack->monster:player_front_right / attack:cpu_front_right:self_bomb->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は12点差で見送り、マスター特技は252点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv1 HP3 / CB:ボムゾウ Lv1 HP6

### low_stone_no_connection: 真勇者ダイン seed 141502 turn 5

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 2 / score 55
- flags: team-not-connected, target-not-connected, no-contact, low-stone, front-plan, shield-after-front
- same turn before shield: attack:player_front_right:attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / focus:player_front_left / attack:player_back_left:スパイクボール->monster:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: focus:player_front_left / summon:player_card_037_1->player_front_right / move:player_back_left->player_back_right / focus:player_back_right / ...
- next turn first: focus:player_front_left
- opponent response: summon:cpu_card_047_2->cpu_back_right / master:master_attack->monster:player_front_right / attack:cpu_front_right:self_bomb->monster:player_front_right / attack:cpu_front_left:ダイン斬り->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は12点差で見送り、マスター特技は252点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv1 HP3 / CB:ボムゾウ Lv1 HP6

### next_turn_starts_front_process: デスシープ seed 141502 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 3 / score 55
- flags: team-connected, target-connected, front-process, no-contact, front-plan, shield-after-front, next-start-front
- same turn before shield: attack:player_front_right:attack->monster:cpu_front_right / focus:player_front_left / master:master_attack->monster:cpu_front_right / master:master_attack->monster:cpu_front_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / summon:player_bomuzo_1->player_back_left / master:wake_up->monster:player_back_left / ...
- next turn first: attack:player_front_right:ダイン斬り->monster:cpu_front_right
- opponent response: summon:cpu_yanbaru_3->cpu_back_right / master:master_attack->monster:player_front_right / attack:cpu_front_right:ダイン斬り->monster:player_front_right / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は4点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:真勇者ダイン Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CB:ピグミィ Lv1 HP3 / CB:真勇者ダイン Lv1 HP6

### no_contact_no_connection: ボムゾウ seed 141502 turn 12

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 1 / score 58.4
- flags: team-not-connected, target-not-connected, no-contact, low-stone, no-front-plan
- same turn before shield: focus:player_front_left / move:player_back_left->player_front_right / summon:player_yanbaru_3->player_back_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: move:player_front_left->player_back_right / summon:player_card_133_2->player_front_left / focus:player_front_right / master:shield->monster:player_front_right / ...
- next turn first: move:player_front_left->player_back_right
- opponent response: attack:cpu_back_right:wild_claw->monster:player_front_left / master:master_attack->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は3点差で見送り、マスター特技は285点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ボムゾウ Lv2 HP5 / PB:ヤンバル Lv1 HP3 prep / CF:真勇者ダイン Lv1 HP4 / CF:デスシープ Lv2 HP6 / CB:ピグミィ Lv1 HP3 / CB:ヤンバル Lv1 HP3

### no_front_process_plan: ボムゾウ seed 141502 turn 12

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 1 / score 58.4
- flags: team-not-connected, target-not-connected, no-contact, low-stone, no-front-plan
- same turn before shield: focus:player_front_left / move:player_back_left->player_front_right / summon:player_yanbaru_3->player_back_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: move:player_front_left->player_back_right / summon:player_card_133_2->player_front_left / focus:player_front_right / master:shield->monster:player_front_right / ...
- next turn first: move:player_front_left->player_back_right
- opponent response: attack:cpu_back_right:wild_claw->monster:player_front_left / master:master_attack->monster:player_front_left / attack:cpu_front_left:ダイン斬り->monster:player_front_left / end_turn
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は3点差で見送り、マスター特技は285点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ボムゾウ Lv2 HP5 / PB:ヤンバル Lv1 HP3 prep / CF:真勇者ダイン Lv1 HP4 / CF:デスシープ Lv2 HP6 / CB:ピグミィ Lv1 HP3 / CB:ヤンバル Lv1 HP3

### no_front_process_plan: ピグミィ seed 141502 turn 22

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role back / stones after 18 / score 115.6
- flags: team-not-connected, target-not-connected, no-contact, no-front-plan, shield-first
- same turn before shield: -
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:cpu_front_left:attack->master:player / attack:cpu_front_right:attack->master:player
- reason: 致死圏の味方を守れるためシールド
- board: PF:ボムゾウ Lv1 HP6 / PF:ピグミィ Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv2 HP6 / CF:デスシープ Lv2 HP6 / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3

### shield_first_no_front_plan: ピグミィ seed 141502 turn 22

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role back / stones after 18 / score 115.6
- flags: team-not-connected, target-not-connected, no-contact, no-front-plan, shield-first
- same turn before shield: -
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:cpu_front_left:attack->master:player / attack:cpu_front_right:attack->master:player
- reason: 致死圏の味方を守れるためシールド
- board: PF:ボムゾウ Lv1 HP6 / PF:ピグミィ Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv2 HP6 / CF:デスシープ Lv2 HP6 / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3

### contact_no_connection: ヤンバル seed 141504 turn 16

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role back / stones after 2 / score 68.9
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, no-front-plan
- same turn before shield: master:wake_up->monster:player_back_right / attack:cpu_front_left:wild_claw->monster:player_back_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:player_front_left:attack->monster:cpu_front_left
- reason: 倒されそうな高価値味方を守るためシールド
- board: PF:ポリスピナー Lv1 HP3 / PF:ピグミィ Lv2 HP3 shield / PB:ヤンバル Lv1 HP3 / CF:ヤンバル Lv2 HP2

### removed_without_connection: ヤンバル seed 141504 turn 16

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role back / stones after 2 / score 68.9
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, no-front-plan
- same turn before shield: master:wake_up->monster:player_back_right / attack:cpu_front_left:wild_claw->monster:player_back_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:player_front_left:attack->monster:cpu_front_left
- reason: 倒されそうな高価値味方を守るためシールド
- board: PF:ポリスピナー Lv1 HP3 / PF:ピグミィ Lv2 HP3 shield / PB:ヤンバル Lv1 HP3 / CF:ヤンバル Lv2 HP2

### no_front_process_plan: ヤンバル seed 141504 turn 16

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role back / stones after 2 / score 68.9
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone, no-front-plan
- same turn before shield: master:wake_up->monster:player_back_right / attack:cpu_front_left:wild_claw->monster:player_back_left
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:player_front_left:attack->monster:cpu_front_left
- reason: 倒されそうな高価値味方を守るためシールド
- board: PF:ポリスピナー Lv1 HP3 / PF:ピグミィ Lv2 HP3 shield / PB:ヤンバル Lv1 HP3 / CF:ヤンバル Lv2 HP2

### contact_no_connection: ポリスピナー seed 141505 turn 12

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 3 / score 117.8
- flags: team-not-connected, target-not-connected, contact:2, removed, no-front-plan
- same turn before shield: attack:cpu_front_right:attack->master:player / focus:cpu_back_right / attack:cpu_front_left:attack->master:player / focus:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:player_front_left:呪いの刃->monster:cpu_front_left / attack:player_back_left:wild_claw->monster:cpu_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は119点差で見送り、マスター特技は156点差で見送り
- board: PF:ドノマンティス Lv2 HP5 shield / PF:真勇者ダイン Lv1 HP6 prep / PB:ヤンバル Lv2 HP3 / PB:ピグミィ Lv1 HP3 / CF:ポリスピナー Lv1 HP3 / CF:デスシープ Lv2 HP6 / CB:ヤンバル Lv1 HP3 prep / CB:ヤンバル Lv2 HP3

### removed_without_connection: ポリスピナー seed 141505 turn 12

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 3 / score 117.8
- flags: team-not-connected, target-not-connected, contact:2, removed, no-front-plan
- same turn before shield: attack:cpu_front_right:attack->master:player / focus:cpu_back_right / attack:cpu_front_left:attack->master:player / focus:cpu_front_left / ...
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: attack:player_front_left:呪いの刃->monster:cpu_front_left / attack:player_back_left:wild_claw->monster:cpu_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は119点差で見送り、マスター特技は156点差で見送り
- board: PF:ドノマンティス Lv2 HP5 shield / PF:真勇者ダイン Lv1 HP6 prep / PB:ヤンバル Lv2 HP3 / PB:ピグミィ Lv1 HP3 / CF:ポリスピナー Lv1 HP3 / CF:デスシープ Lv2 HP6 / CB:ヤンバル Lv1 HP3 prep / CB:ヤンバル Lv2 HP3

### contact_no_connection: 真勇者ダイン seed 141507 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 3 / score 55
- flags: team-not-connected, target-not-connected, contact:1, removed, front-plan, shield-after-front
- same turn before shield: focus:cpu_front_right / focus:cpu_front_left / attack:cpu_back_left:wild_claw->monster:player_front_right / focus:cpu_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: magic:player_card_093_1->master:player
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv2 HP5 shield / PB:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv1 HP6 / CB:ヤンバル Lv1 HP3 / CB:ヤンバル Lv1 HP3

### removed_without_connection: 真勇者ダイン seed 141507 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 3 / score 55
- flags: team-not-connected, target-not-connected, contact:1, removed, front-plan, shield-after-front
- same turn before shield: focus:cpu_front_right / focus:cpu_front_left / attack:cpu_back_left:wild_claw->monster:player_front_right / focus:cpu_back_right
- same turn: end_turn
- same turn first after shield: end_turn
- next turn: -
- next turn first: -
- opponent response: magic:player_card_093_1->master:player
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:デスシープ Lv2 HP5 shield / PB:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv1 HP6 / CB:ヤンバル Lv1 HP3 / CB:ヤンバル Lv1 HP3


## Notes

- この監査はAI本体を変更しない。負け試合に出たシールドだけを、同ターン/次自ターンの仕事へつながったかで分類する。
- `team-connected` は盾対象以外の攻撃/ウェイクも含む。`target-connected` は盾対象自身が攻撃/レベルアップへ変換されたケース。
- `front-process` は敵前衛への攻撃が選ばれたケースで、`front damage/kill` はその攻撃でHP減少または除去が発生したケース。
- 接触も後続仕事もない盾が目立つため、単純な盾抑制ではなく、盾前後の行動順と仕事予定の有無を次に見る価値がある。

## Next Loop Proposal

- 次は `shieldConnectionPlanAudit` として、シールド選択時に「この後または次自ターンに誰が何をする予定か」を候補評価ログへ出す。
- 同ターン2枚盾は、2枚目の後に仕事が残る場合だけ許す条件を設計する。単純ペナルティではなく `second shield keeps a converter alive` を見る。

## Reading

- `Team Conn`: 盾後、同ターンまたは次自ターンに自軍の攻撃/ウェイク/敵前衛処理が発生した割合。
- `Target Conn`: 盾対象自身が同ターン/次自ターンに攻撃、敵前衛処理、レベルアップへ変換された割合。
- `Front Proc`: 盾後の同ターン/次自ターンに敵前衛を攻撃した割合。
- `NoContact NoConn`: 次自ターンまで相手に触られず、かつ後続仕事にもつながらなかった盾。
- `Shield Before Work`: 同ターンに盾より後で攻撃またはウェイクアップをしているケース。相手反撃がないなら行動順の疑いがある。
