# White Planner Phase 2

生成: 2026-07-03T13:36:39.177Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994120-994120
directions: challenger-as-cpu, challenger-as-player

## Summary

- games: 2
- wins: -
- draws/undecided: 2
- issues: 2
- decision diffs: 44
- planner-selected diffs: 21

## Timing

| profile | decisions | avg ms | max ms | total ms |
| --- | ---: | ---: | ---: | ---: |
| white | 115 | 387.5ms | 1745.5ms | 44557.7ms |
| white_planner | 115 | 126.3ms | 669.8ms | 14529.4ms |

## Games

| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| challenger-as-cpu | 994120 | P white / C white_planner | draw | 60 | 6 | P10/C10 | winner was not decided within 60 auto steps | 23 | 8 |
| challenger-as-player | 994120 | P white_planner / C white | draw | 60 | 6 | P10/C10 | winner was not decided within 60 auto steps | 21 | 13 |

## Decision Diff Samples

### seed 994120 step 1 challenger-as-cpu

- turn/current: 1 / player (white)
- selected: white / `summon:player_card_047_1->player_front_right`
- white: `summon:player_card_047_1->player_front_right` (105.8ms)
- white_planner: `summon:player_card_047_1->player_front_left` (42.3ms)
- white reason: 前衛カードを前列右へ召喚 / 見送り: 召喚は16点差で見送り、召喚は43点差で見送り
- planner reason: 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面169点、次点と0点差
- board: player_back_left:player:ヤンバル L1 HP3 prep

### seed 994120 step 8 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `focus:player_front_left`
- white: `focus:player_front_left` (588ms)
- white_planner: `move:player_front_left->player_back_left` (225.8ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは4点差で見送り、移動は8点差で見送り
- planner reason: 後衛カードを後列へ戻して射程を活かすため移動 / ターンプラン探索: 返し込み最終盤面-63点、次点と0点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 9 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `focus:player_front_right`
- white: `focus:player_front_right` (288ms)
- white_planner: `summon:player_polyspinner_1->player_back_left` (121.6ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は34点差で見送り、ためるは48点差で見送り
- planner reason: ポリスピナーを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面-105点、次点と0点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 12 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `master:shield->monster:player_front_right`
- white: `master:shield->monster:player_front_right` (107.5ms)
- white_planner: `end_turn` (53.5ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は10点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-184点、次点と4点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 14 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `attack:cpu_front_right:attack->monster:player_front_right`
- white: `attack:cpu_front_left:self_bomb->monster:player_front_left` (1658.4ms)
- white_planner: `attack:cpu_front_right:attack->monster:player_front_right` (669.8ms)
- white reason: ヤンバルを削れるため攻撃 / 見送り: 攻撃は26点差で見送り、召喚は126点差で見送り
- planner reason: 真勇者ダインを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面54点、次点と11点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act shield / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 15 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `summon:cpu_bomuzo_2->cpu_back_right`
- white: `attack:cpu_front_left:self_bomb->monster:player_front_left` (947.3ms)
- white_planner: `summon:cpu_bomuzo_2->cpu_back_right` (386.8ms)
- white reason: ヤンバルを削れるため攻撃 / 見送り: ためるは130点差で見送り、召喚は145点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面48点、次点と6点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act shield / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 16 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `end_turn`
- white: `focus:cpu_front_left` (581.2ms)
- white_planner: `end_turn` (126.4ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは119点差で見送り、攻撃は213点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-12点、次点と6点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act shield / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 17 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `focus:player_front_right`
- white: `focus:player_front_right` (993ms)
- white_planner: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (421.1ms)
- white reason: 有効攻撃がないためためる / 見送り: 攻撃は57点差で見送り、ためるは131点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面-39点、次点と0点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 20 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `attack:player_front_left:wild_claw->monster:cpu_front_right`
- white: `attack:player_front_left:wild_claw->monster:cpu_front_right` (500.6ms)
- white_planner: `end_turn` (142.9ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: ためるは30点差で見送り、攻撃は39点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-69点、次点と6点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 27 challenger-as-cpu

- turn/current: 3 / cpu (white_planner)
- selected: white_planner / `end_turn`
- white: `master:shield->monster:cpu_front_left` (140.5ms)
- white_planner: `end_turn` (50.9ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は15点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-69点、次点と4点差
- board: player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ドノマンティス L1 HP5 prep

### seed 994120 step 32 challenger-as-cpu

- turn/current: 4 / player (white)
- selected: white / `attack:player_back_right:スパイクボール->monster:cpu_front_right`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_right` (477.5ms)
- white_planner: `end_turn` (15.7ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: ためるは111点差で見送り、攻撃は123点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-123点
- board: player_front_left:player:ポリスピナー L2 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ボムゾウ L1 HP6 prep / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ドノマンティス L1 HP5 prep

### seed 994120 step 39 challenger-as-cpu

- turn/current: 4 / cpu (white_planner)
- selected: white_planner / `summon:cpu_card_047_2->cpu_back_left`
- white: `focus:cpu_front_right` (365.3ms)
- white_planner: `summon:cpu_card_047_2->cpu_back_left` (136.6ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は88点差で見送り、召喚は88点差で見送り
- planner reason: カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面55点、次点と0点差
- board: player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ボムゾウ L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:デスシープ L2 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act

### seed 994120 step 40 challenger-as-cpu

- turn/current: 4 / cpu (white_planner)
- selected: white_planner / `summon:cpu_polyspinner_1->cpu_back_right`
- white: `master:master_attack->monster:player_front_right` (404.6ms)
- white_planner: `summon:cpu_polyspinner_1->cpu_back_right` (73.4ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は32点差で見送り、ためるは110点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面-5点、次点と6点差
- board: player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ボムゾウ L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:デスシープ L2 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep

### seed 994120 step 41 challenger-as-cpu

- turn/current: 4 / cpu (white_planner)
- selected: white_planner / `end_turn`
- white: `master:master_attack->monster:player_front_right` (339.1ms)
- white_planner: `end_turn` (51.4ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は32点差で見送り、ためるは150点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-54点、次点と6点差
- board: player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ボムゾウ L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:デスシープ L2 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ポリスピナー L1 HP3 prep

### seed 994120 step 43 challenger-as-cpu

- turn/current: 5 / player (white)
- selected: white / `focus:player_front_right`
- white: `focus:player_front_right` (636.2ms)
- white_planner: `attack:player_back_right:スパイクボール->monster:cpu_front_right` (270.2ms)
- white reason: 有効攻撃がないためためる / 見送り: 攻撃は48点差で見送り、召喚は94点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面-28点、次点と0点差
- board: player_front_left:player:ボムゾウ L1 HP6 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:デスシープ L2 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ポリスピナー L1 HP3 prep

### seed 994120 step 46 challenger-as-cpu

- turn/current: 5 / player (white)
- selected: white / `focus:player_back_right`
- white: `focus:player_back_right` (457.8ms)
- white_planner: `end_turn` (60.4ms)
- white reason: 有効攻撃がないためためる / 見送り: マスター特技は37点差で見送り、攻撃は100点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-114点、次点と6点差
- board: player_front_left:player:ボムゾウ L1 HP6 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ドノマンティス L1 HP5 prep / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:デスシープ L2 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ポリスピナー L1 HP3 prep

### seed 994120 step 1 challenger-as-player

- turn/current: 1 / player (white_planner)
- selected: white_planner / `summon:player_card_047_1->player_front_left`
- white: `summon:player_card_047_1->player_front_right` (101.5ms)
- white_planner: `summon:player_card_047_1->player_front_left` (41.1ms)
- white reason: 前衛カードを前列右へ召喚 / 見送り: 召喚は16点差で見送り、召喚は43点差で見送り
- planner reason: 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面169点、次点と0点差
- board: player_back_left:player:ヤンバル L1 HP3 prep

### seed 994120 step 9 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `summon:player_polyspinner_1->player_front_right`
- white: `focus:player_front_left` (303.4ms)
- white_planner: `summon:player_polyspinner_1->player_front_right` (123.5ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は4点差で見送り、ためるは69点差で見送り
- planner reason: 前衛カードを前列右へ召喚 / ターンプラン探索: 返し込み最終盤面-55点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 10 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `focus:player_front_left` (247.1ms)
- white_planner: `end_turn` (100.8ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは66点差で見送り、ためるは66点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-138点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 11 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `focus:cpu_front_left`
- white: `focus:cpu_front_left` (801.5ms)
- white_planner: `summon:cpu_bomuzo_2->cpu_back_right` (318.5ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は100点差で見送り、ためるは136点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面47点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 12 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `focus:cpu_front_right`
- white: `focus:cpu_front_right` (513.7ms)
- white_planner: `summon:cpu_bomuzo_2->cpu_back_right` (204.7ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は22点差で見送り、ためるは49点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面35点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 14 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `focus:cpu_back_left`
- white: `focus:cpu_back_left` (146.3ms)
- white_planner: `end_turn` (59.1ms)
- white reason: 有効攻撃がないためためる
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-36点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 15 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `master:shield->monster:cpu_front_right`
- white: `master:shield->monster:cpu_front_right` (107ms)
- white_planner: `end_turn` (42.1ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は12点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-48点、次点と4点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 19 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `master:master_attack->monster:cpu_front_left`
- white: `attack:player_front_left:ダイン斬り->monster:cpu_front_left` (487.3ms)
- white_planner: `master:master_attack->monster:cpu_front_left` (105.5ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: マスター特技は32点差で見送り、ためるは117点差で見送り
- planner reason: ストーンに余裕があり敵を削れるためマスターアタック / ターンプラン探索: 返し込み最終盤面65点、次点と9点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP5 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 22 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `focus:player_front_right` (91.6ms)
- white_planner: `end_turn` (20.2ms)
- white reason: 有効攻撃がないためためる / 見送り: 攻撃は408点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-102点、次点と6点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 36 challenger-as-player

- turn/current: 4 / cpu (white)
- selected: white / `focus:cpu_front_right`
- white: `focus:cpu_front_right` (743.3ms)
- white_planner: `summon:cpu_card_047_2->cpu_back_left` (289.3ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは11点差で見送り、召喚は123点差で見送り
- planner reason: カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面0点、次点と6点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ボムゾウ L2 HP5 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 37 challenger-as-player

- turn/current: 4 / cpu (white)
- selected: white / `focus:cpu_front_left`
- white: `focus:cpu_front_left` (852.3ms)
- white_planner: `summon:cpu_card_047_2->cpu_back_left` (144.2ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は87点差で見送り、召喚は128点差で見送り
- planner reason: カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面-12点、次点と6点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ボムゾウ L2 HP5 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 40 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `attack:player_back_left:wild_claw->monster:cpu_front_left`
- white: `attack:player_back_left:wild_claw->monster:cpu_front_right` (1612.1ms)
- white_planner: `attack:player_back_left:wild_claw->monster:cpu_front_left` (629.4ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は33点差で見送り、攻撃は137点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面104点、次点と0点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ボムゾウ L2 HP5 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 41 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `attack:player_back_right:スパイクボール->monster:cpu_front_right`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (969.3ms)
- white_planner: `attack:player_back_right:スパイクボール->monster:cpu_front_right` (419.5ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は24点差で見送り、攻撃は72点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面98点、次点と6点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ボムゾウ L2 HP5 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 42 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `attack:player_front_right:self_bomb->monster:cpu_front_right`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (494.3ms)
- white_planner: `attack:player_front_right:self_bomb->monster:cpu_front_right` (253.8ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は18点差で見送り、攻撃は45点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面145点、次点と65点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ボムゾウ L2 HP5 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 44 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `attack:player_front_left:ダイン斬り->monster:cpu_front_left`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (213.7ms)
- white_planner: `attack:player_front_left:ダイン斬り->monster:cpu_front_left` (20.6ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は18点差で見送り、攻撃は808点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面80点、次点と0点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ボムゾウ L2 HP2 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP4 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 49 challenger-as-player

- turn/current: 5 / cpu (white)
- selected: white / `attack:cpu_front_left:ダイン斬り->monster:player_front_left`
- white: `attack:cpu_front_left:ダイン斬り->monster:player_front_left` (429.6ms)
- white_planner: `summon:cpu_polyspinner_1->cpu_back_left` (102.5ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: ためるは152点差で見送り、召喚は250点差で見送り
- planner reason: カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面11点、次点と0点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L2 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:ボムゾウ L2 HP5 act

## Reading

- white_planner average decision 126.3ms, max 669.8ms.
- white_planner diverged from white 44 times; inspect samples before changing search depth.
- Some games hit the step/turn cap. Treat W-L-D as incomplete and use this run mainly for timing and decision-diff inspection.

## Next Steps

- Review decision diff samples and classify good/bad planner divergences.
- If planner average decision time stays practical, run both directions with count 3-5.
- Try opponentTerminalPlanDepth 2 as a v2 candidate.
