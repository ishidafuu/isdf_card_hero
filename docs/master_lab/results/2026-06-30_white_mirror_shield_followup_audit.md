# White Shield Follow-up Loss Audit

生成: 2026-06-30T09:59:49.824Z
seedStart: 140000
候補: current_white_baseline, current_wake_safe_work4, current_shield_wake_quality, current_threat_then_setup, current_shield_no_pressure4_wake4
相手: white_current_mirror
試行: 2 games/matchup/direction
総試合: 20
負け試合: 10
盾あり負け試合: 10

## Purpose

盾をさらに減らすのではなく、負けseedのシールドが「攻撃」「ウェイクアップ」「敵前衛処理」へ接続できているかを見る。勝率採用判断ではなく、次の改善仮説を作るための監査。

## Summary

- 負け試合中のシールド: 93
- Team connected: 63 (67.7%)
- Target connected: 47 (50.5%)
- Front process connected: 56 (60.2%)
- Front damage/kill: 50 (53.8%)
- No contact / no connection: 17 (18.3%)
- Contact / no connection: 13 (14%)
- Low stone after shield: 72 (77.4%)
- Multi-shield turn: 12 (12.9%)
- Shield before same-turn work: 0 (0%)

## Variant Metrics

| Variant | W-L-D | Loss Shield | Team Conn | Target Conn | Front Proc | Front Dmg/Kill | Same Attack | Same Wake | Next Attack | Next Wake | NoContact NoConn | Contact NoConn | Removed | LowStone | MultiShield | Shield Before Work | Retreat |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 1-3-0 | 32 | 24 (75%) | 19 (59.4%) | 21 (65.6%) | 19 (59.4%) | 0 (0%) | 0 (0%) | 24 (75%) | 1 (3.1%) | 5 (15.6%) | 3 (9.4%) | 3 (9.4%) | 25 (78.1%) | 6 (18.8%) | 0 (0%) | 0 (0%) |
| current_wake_safe_work4 | 2-2-0 | 21 | 15 (71.4%) | 10 (47.6%) | 14 (66.7%) | 11 (52.4%) | 0 (0%) | 0 (0%) | 15 (71.4%) | 0 (0%) | 3 (14.3%) | 3 (14.3%) | 3 (14.3%) | 14 (66.7%) | 4 (19%) | 0 (0%) | 0 (0%) |
| current_shield_wake_quality | 2-2-0 | 15 | 8 (53.3%) | 7 (46.7%) | 6 (40%) | 6 (40%) | 0 (0%) | 0 (0%) | 8 (53.3%) | 0 (0%) | 3 (20%) | 4 (26.7%) | 4 (26.7%) | 13 (86.7%) | 2 (13.3%) | 0 (0%) | 0 (0%) |
| current_threat_then_setup | 4-0-0 | 0 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) |
| current_shield_no_pressure4_wake4 | 1-3-0 | 25 | 16 (64%) | 11 (44%) | 15 (60%) | 14 (56%) | 0 (0%) | 0 (0%) | 16 (64%) | 3 (12%) | 6 (24%) | 3 (12%) | 3 (12%) | 20 (80%) | 0 (0%) | 0 (0%) | 0 (0%) |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Loss Shield | Team Conn | Target Conn | Front Proc | NoContact NoConn | MultiShield |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | white_current_mirror | 1-3-0 | 32 | 24 (75%) | 19 (59.4%) | 21 (65.6%) | 5 (15.6%) | 6 (18.8%) |
| current_wake_safe_work4 | white_current_mirror | 2-2-0 | 21 | 15 (71.4%) | 10 (47.6%) | 14 (66.7%) | 3 (14.3%) | 4 (19%) |
| current_shield_wake_quality | white_current_mirror | 2-2-0 | 15 | 8 (53.3%) | 7 (46.7%) | 6 (40%) | 3 (20%) | 2 (13.3%) |
| current_threat_then_setup | white_current_mirror | 4-0-0 | 0 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) |
| current_shield_no_pressure4_wake4 | white_current_mirror | 1-3-0 | 25 | 16 (64%) | 11 (44%) | 15 (60%) | 6 (24%) | 0 (0%) |

## Samples

### front_process_connected: ドノマンティス seed 140001 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 53.9
- flags: team-connected, target-connected, front-process, no-contact, low-stone
- same turn: end_turn
- next turn: attack:player_front_right:attack->monster:cpu_front_right / focus:player_front_left / focus:player_back_right / attack:player_back_left:wild_claw->monster:cpu_front_left / ...
- opponent response: attack:cpu_front_right:attack->monster:player_front_right / focus:cpu_front_right / focus:cpu_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は4点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / PB:ドノマンティス Lv1 HP5 prep / CF:デスシープ Lv1 HP6 prep / CF:ポリスピナー Lv1 HP3 prep / CB:ピグミィ Lv1 HP3 prep

### front_process_connected: ドノマンティス seed 140001 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 1 / score 53.9
- flags: team-connected, target-not-connected, front-process, no-contact, low-stone
- same turn: end_turn
- next turn: attack:player_back_left:wild_claw->monster:cpu_front_right / summon:player_card_051_3->player_back_right / attack:player_front_right:attack->monster:cpu_front_right / focus:player_front_left / ...
- opponent response: focus:cpu_front_right / attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_back_left:スパイクボール->monster:player_front_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は7点差で見送り、マスター特技は190点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 / PB:ドノマンティス Lv1 HP5 / CF:デスシープ Lv1 HP5 / CF:ポリスピナー Lv1 HP3 shield / CB:ピグミィ Lv1 HP3 / CB:真勇者ダイン Lv1 HP6 prep

### front_process_connected: ドノマンティス seed 140001 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 1 / score 58.4
- flags: team-connected, target-connected, front-process, no-contact, low-stone
- same turn: end_turn
- next turn: attack:player_back_right:スパイクボール->monster:cpu_front_right / attack:player_front_right:呪いの刃->monster:cpu_front_right / master:master_attack->monster:cpu_front_right / move:player_front_left->player_back_left / ...
- opponent response: attack:cpu_back_left:スパイクボール->monster:player_front_left / attack:cpu_back_left:スパイクボール->monster:player_front_left / attack:cpu_front_left:attack->monster:player_front_left / summon:cpu_yanbaru_2->cpu_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は6点差で見送り、マスター特技は9点差で見送り
- board: PF:ドノマンティス Lv1 HP5 / PF:ドノマンティス Lv2 HP5 / PB:ヤンバル Lv1 HP3 / PB:ピグミィ Lv1 HP3 prep / CF:デスシープ Lv1 HP5 / CB:ピグミィ Lv2 HP3 / CB:真勇者ダイン Lv1 HP6

### front_process_connected: ドノマンティス seed 140001 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_left / role front / stones after 1 / score 58.4
- flags: team-connected, target-connected, front-process, no-contact, low-stone
- same turn: end_turn
- next turn: attack:player_back_left:スパイクボール->monster:cpu_front_left / attack:player_front_left:呪いの刃->monster:cpu_front_left / move:player_front_right->player_back_right / master:master_attack->monster:cpu_front_left / ...
- opponent response: attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_back_right:wild_claw->monster:player_front_right / attack:cpu_front_right:attack->monster:player_front_right / focus:cpu_front_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り、マスター特技は3点差で見送り
- board: PF:ドノマンティス Lv2 HP5 / PF:真勇者ダイン Lv1 HP6 / PB:ピグミィ Lv1 HP3 prep / PB:ヤンバル Lv1 HP3 / CF:ボムゾウ Lv1 HP6 prep / CF:デスシープ Lv1 HP4 / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv2 HP3

### front_process_connected: 真勇者ダイン seed 140001 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 0 / score 66.2
- flags: team-connected, target-connected, front-process, no-contact, low-stone
- same turn: end_turn
- next turn: attack:player_front_right:ダイン斬り->monster:cpu_front_right / master:shield->monster:player_front_right / end_turn
- opponent response: focus:cpu_front_left / attack:cpu_front_right:スパイクボール->monster:player_back_right / attack:cpu_back_left:スパイクボール->monster:player_back_right / attack:cpu_front_right:スパイクボール->monster:player_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は14点差で見送り
- board: PF:真勇者ダイン Lv3 HP5 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv1 HP6 / CB:ピグミィ Lv2 HP3 / CB:ピグミィ Lv1 HP3 prep

### no_contact_no_connection: ボムゾウ seed 140001 turn 12

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 6 / score 49.6
- flags: team-not-connected, target-not-connected, no-contact
- same turn: end_turn
- next turn: focus:player_front_right / master:master_attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / ...
- opponent response: move:cpu_front_left->cpu_back_right / focus:cpu_front_right / focus:cpu_back_left / master:shield->monster:cpu_front_right
- reason: 高価値の味方を守るためシールド
- board: PF:ボムゾウ Lv1 HP4 / CF:ピグミィ Lv2 HP3 / CF:デスシープ Lv1 HP6 shield / CB:ピグミィ Lv1 HP3 prep / CB:真勇者ダイン Lv3 HP6 shield

### contact_no_connection: ボムゾウ seed 140002 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 1 / score 73.2
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_yanbaru_2->player_back_left / master:wake_up->monster:player_back_left / attack:player_back_left:wild_claw->monster:cpu_front_right
- reason: 倒されそうな高価値味方を守るためシールド / 見送り: マスター特技は153点差で見送り
- board: PF:デスシープ Lv1 HP6 shield / PF:真勇者ダイン Lv1 HP6 prep / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv2 HP2 / CB:ヤンバル Lv1 HP3 / CB:デスシープ Lv1 HP6 prep

### removed_without_connection: ボムゾウ seed 140002 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 1 / score 73.2
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_yanbaru_2->player_back_left / master:wake_up->monster:player_back_left / attack:player_back_left:wild_claw->monster:cpu_front_right
- reason: 倒されそうな高価値味方を守るためシールド / 見送り: マスター特技は153点差で見送り
- board: PF:デスシープ Lv1 HP6 shield / PF:真勇者ダイン Lv1 HP6 prep / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv2 HP2 / CB:ヤンバル Lv1 HP3 / CB:デスシープ Lv1 HP6 prep

### low_stone_no_connection: ボムゾウ seed 140002 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 1 / score 73.2
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: attack:player_front_right:ダイン斬り->monster:cpu_front_right / summon:player_yanbaru_2->player_back_left / master:wake_up->monster:player_back_left / attack:player_back_left:wild_claw->monster:cpu_front_right
- reason: 倒されそうな高価値味方を守るためシールド / 見送り: マスター特技は153点差で見送り
- board: PF:デスシープ Lv1 HP6 shield / PF:真勇者ダイン Lv1 HP6 prep / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv2 HP2 / CB:ヤンバル Lv1 HP3 / CB:デスシープ Lv1 HP6 prep

### contact_no_connection: ボムゾウ seed 140002 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 1 / score 124.4
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: magic:player_card_031_1->monster:cpu_back_right
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は164点差で見送り
- board: PF:ボムゾウ Lv1 HP5 / PF:真勇者ダイン Lv1 HP5 / PB:デスシープ Lv1 HP6 / CF:ボムゾウ Lv2 HP5 / CB:ヤンバル Lv1 HP3

### removed_without_connection: ボムゾウ seed 140002 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 1 / score 124.4
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: magic:player_card_031_1->monster:cpu_back_right
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は164点差で見送り
- board: PF:ボムゾウ Lv1 HP5 / PF:真勇者ダイン Lv1 HP5 / PB:デスシープ Lv1 HP6 / CF:ボムゾウ Lv2 HP5 / CB:ヤンバル Lv1 HP3

### low_stone_no_connection: ボムゾウ seed 140002 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 1 / score 124.4
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: magic:player_card_031_1->monster:cpu_back_right
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は164点差で見送り
- board: PF:ボムゾウ Lv1 HP5 / PF:真勇者ダイン Lv1 HP5 / PB:デスシープ Lv1 HP6 / CF:ボムゾウ Lv2 HP5 / CB:ヤンバル Lv1 HP3

### no_contact_no_connection: デスシープ seed 140002 turn 18

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 1 / score 124.4
- flags: team-not-connected, target-not-connected, no-contact, low-stone
- same turn: end_turn
- next turn: end_turn
- opponent response: attack:player_front_right:ダイン斬り->master:cpu / end_turn
- reason: 致死圏の味方を守れるためシールド
- board: PF:ドノマンティス Lv1 HP5 prep / PF:真勇者ダイン Lv2 HP6 shield / PB:ヤンバル Lv2 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv2 HP5 / CF:ドノマンティス Lv1 HP5 prep / CB:ドノマンティス Lv1 HP5 / CB:真勇者ダイン Lv1 HP6 prep

### low_stone_no_connection: デスシープ seed 140002 turn 18

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 1 / score 124.4
- flags: team-not-connected, target-not-connected, no-contact, low-stone
- same turn: end_turn
- next turn: end_turn
- opponent response: attack:player_front_right:ダイン斬り->master:cpu / end_turn
- reason: 致死圏の味方を守れるためシールド
- board: PF:ドノマンティス Lv1 HP5 prep / PF:真勇者ダイン Lv2 HP6 shield / PB:ヤンバル Lv2 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv2 HP5 / CF:ドノマンティス Lv1 HP5 prep / CB:ドノマンティス Lv1 HP5 / CB:真勇者ダイン Lv1 HP6 prep

### no_contact_no_connection: ドノマンティス seed 140002 turn 20

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 9 / score 118.9
- flags: team-not-connected, target-not-connected, no-contact, multi-shield-turn
- same turn: master:shield->monster:cpu_front_left / end_turn
- next turn: -
- opponent response: attack:player_back_left:wild_claw->master:cpu / attack:player_front_right:ダイン斬り->master:cpu
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は58点差で見送り
- board: PF:ドノマンティス Lv1 HP5 shield / PF:真勇者ダイン Lv2 HP6 / PB:ヤンバル Lv2 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv2 HP5 / CF:ドノマンティス Lv1 HP5 / CB:ドノマンティス Lv1 HP5 / CB:真勇者ダイン Lv1 HP6

### multi_shield_no_connection: ドノマンティス seed 140002 turn 20

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 9 / score 118.9
- flags: team-not-connected, target-not-connected, no-contact, multi-shield-turn
- same turn: master:shield->monster:cpu_front_left / end_turn
- next turn: -
- opponent response: attack:player_back_left:wild_claw->master:cpu / attack:player_front_right:ダイン斬り->master:cpu
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は58点差で見送り
- board: PF:ドノマンティス Lv1 HP5 shield / PF:真勇者ダイン Lv2 HP6 / PB:ヤンバル Lv2 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv2 HP5 / CF:ドノマンティス Lv1 HP5 / CB:ドノマンティス Lv1 HP5 / CB:真勇者ダイン Lv1 HP6

### no_contact_no_connection: デスシープ seed 140002 turn 20

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 7 / score 124.4
- flags: team-not-connected, target-not-connected, no-contact, multi-shield-turn
- same turn: end_turn
- next turn: -
- opponent response: attack:player_back_left:wild_claw->master:cpu / attack:player_front_right:ダイン斬り->master:cpu
- reason: 致死圏の味方を守れるためシールド
- board: PF:ドノマンティス Lv1 HP5 shield / PF:真勇者ダイン Lv2 HP6 / PB:ヤンバル Lv2 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv2 HP5 / CF:ドノマンティス Lv1 HP5 shield / CB:ドノマンティス Lv1 HP5 / CB:真勇者ダイン Lv1 HP6

### multi_shield_no_connection: デスシープ seed 140002 turn 20

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 7 / score 124.4
- flags: team-not-connected, target-not-connected, no-contact, multi-shield-turn
- same turn: end_turn
- next turn: -
- opponent response: attack:player_back_left:wild_claw->master:cpu / attack:player_front_right:ダイン斬り->master:cpu
- reason: 致死圏の味方を守れるためシールド
- board: PF:ドノマンティス Lv1 HP5 shield / PF:真勇者ダイン Lv2 HP6 / PB:ヤンバル Lv2 HP3 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv2 HP5 / CF:ドノマンティス Lv1 HP5 shield / CB:ドノマンティス Lv1 HP5 / CB:真勇者ダイン Lv1 HP6

### contact_no_connection: 真勇者ダイン seed 140003 turn 15

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 9 / score 55
- flags: team-not-connected, target-not-connected, contact:1, removed
- same turn: end_turn
- next turn: -
- opponent response: magic:player_card_031_1->monster:cpu_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は27点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 shield / PF:デスシープ Lv1 HP6 prep / PB:ピグミィ Lv1 HP3 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ドノマンティス Lv1 HP5 prep / CB:ポリスピナー Lv1 HP3 / CB:ピグミィ Lv2 HP3

### removed_without_connection: 真勇者ダイン seed 140003 turn 15

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 9 / score 55
- flags: team-not-connected, target-not-connected, contact:1, removed
- same turn: end_turn
- next turn: -
- opponent response: magic:player_card_031_1->monster:cpu_back_right
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は27点差で見送り
- board: PF:真勇者ダイン Lv3 HP6 shield / PF:デスシープ Lv1 HP6 prep / PB:ピグミィ Lv1 HP3 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CF:ドノマンティス Lv1 HP5 prep / CB:ポリスピナー Lv1 HP3 / CB:ピグミィ Lv2 HP3

### no_contact_no_connection: ピグミィ seed 140003 turn 24

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role back / stones after 3 / score 120.1
- flags: team-not-connected, target-not-connected, no-contact
- same turn: end_turn
- next turn: end_turn
- opponent response: end_turn
- reason: 致死圏の味方を守れるためシールド
- board: PF:ポリスピナー Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ピグミィ Lv2 HP3

### contact_no_connection: ボムゾウ seed 140004 turn 17

- variant/opponent: `current_wake_safe_work4` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 13 / score 113.5
- flags: team-not-connected, target-not-connected, contact:1, removed
- same turn: end_turn
- next turn: -
- opponent response: attack:cpu_front_left:ダイン斬り->master:player / attack:cpu_front_right:attack->monster:player_front_right
- reason: 致死圏の味方を守れるためシールド
- board: PF:ボムゾウ Lv1 HP2 / CF:真勇者ダイン Lv3 HP6 / CB:ドノマンティス Lv1 HP5 / CB:デスシープ Lv2 HP6

### removed_without_connection: ボムゾウ seed 140004 turn 17

- variant/opponent: `current_wake_safe_work4` vs `white_current_mirror` (player)
- decision: player_front_right / role front / stones after 13 / score 113.5
- flags: team-not-connected, target-not-connected, contact:1, removed
- same turn: end_turn
- next turn: -
- opponent response: attack:cpu_front_left:ダイン斬り->master:player / attack:cpu_front_right:attack->monster:player_front_right
- reason: 致死圏の味方を守れるためシールド
- board: PF:ボムゾウ Lv1 HP2 / CF:真勇者ダイン Lv3 HP6 / CB:ドノマンティス Lv1 HP5 / CB:デスシープ Lv2 HP6

### contact_no_connection: デスシープ seed 140006 turn 5

- variant/opponent: `current_wake_safe_work4` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 1 / score 55
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: magic:player_card_031_1->monster:cpu_back_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は42点差で見送り
- board: PF:デスシープ Lv1 HP6 / PB:ポリスピナー Lv1 HP3 / PB:ボムゾウ Lv2 HP2 shield / CF:真勇者ダイン Lv1 HP6 prep / CF:デスシープ Lv1 HP6 / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3

### removed_without_connection: デスシープ seed 140006 turn 5

- variant/opponent: `current_wake_safe_work4` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 1 / score 55
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: magic:player_card_031_1->monster:cpu_back_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は42点差で見送り
- board: PF:デスシープ Lv1 HP6 / PB:ポリスピナー Lv1 HP3 / PB:ボムゾウ Lv2 HP2 shield / CF:真勇者ダイン Lv1 HP6 prep / CF:デスシープ Lv1 HP6 / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3

### low_stone_no_connection: デスシープ seed 140006 turn 5

- variant/opponent: `current_wake_safe_work4` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role front / stones after 1 / score 55
- flags: team-not-connected, target-not-connected, contact:1, removed, low-stone
- same turn: end_turn
- next turn: -
- opponent response: magic:player_card_031_1->monster:cpu_back_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は42点差で見送り
- board: PF:デスシープ Lv1 HP6 / PB:ポリスピナー Lv1 HP3 / PB:ボムゾウ Lv2 HP2 shield / CF:真勇者ダイン Lv1 HP6 prep / CF:デスシープ Lv1 HP6 / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3

### low_stone_no_connection: ピグミィ seed 140006 turn 15

- variant/opponent: `current_wake_safe_work4` vs `white_current_mirror` (cpu)
- decision: cpu_front_right / role back / stones after 1 / score 55.2
- flags: team-not-connected, target-not-connected, no-contact, low-stone
- same turn: end_turn
- next turn: move:cpu_back_right->cpu_front_left / move:cpu_front_right->cpu_back_left / focus:cpu_back_left / end_turn
- opponent response: summon:player_polyspinner_2->player_back_right / attack:player_front_right:storm_bomb->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / focus:player_back_left
- reason: 高価値の味方を守るためシールド / 見送り: マスター特技は4点差で見送り、マスター特技は11点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 / PF:ボムゾウ Lv2 HP5 / PB:真勇者ダイン Lv1 HP6 prep / CF:ヤンバル Lv1 HP3 / CF:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3 / CB:デスシープ Lv1 HP6 prep

### multi_shield_no_connection: ポリスピナー seed 140010 turn 6

- variant/opponent: `current_shield_wake_quality` vs `white_current_mirror` (cpu)
- decision: cpu_front_left / role front / stones after 2 / score 114.5
- flags: team-not-connected, target-not-connected, contact:2, removed, low-stone, multi-shield-turn
- same turn: master:shield->monster:cpu_front_right / end_turn
- next turn: -
- opponent response: attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:self_bomb->monster:cpu_front_left
- reason: 致死圏の味方を守れるためシールド / 見送り: マスター特技は160点差で見送り
- board: PF:ボムゾウ Lv1 HP6 prep / PF:真勇者ダイン Lv2 HP6 shield / PB:ドノマンティス Lv1 HP5 prep / PB:ヤンバル Lv2 HP3 / CF:ポリスピナー Lv1 HP3 / CF:デスシープ Lv2 HP4


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
