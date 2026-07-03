# White Planner Phase 2

生成: 2026-07-03T14:47:27.217Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994300-994300
directions: challenger-as-player

## Summary

- games: 1
- wins: white 1
- draws/undecided: 0
- issues: 0
- decision diffs: 25
- planner-selected diffs: 18

## Timing

| profile | decisions | avg ms | max ms | total ms |
| --- | ---: | ---: | ---: | ---: |
| white | 127 | 314.8ms | 2837.6ms | 39981.1ms |
| white_planner | 127 | 136.6ms | 979.1ms | 17342.5ms |

## Games

| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| challenger-as-player | 994300 | P white_planner / C white | white | 130 | 15 | P0/C9 | - | 25 | 18 |

## Decision Diff Samples

### seed 994300 step 8 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `focus:player_front_right`
- white: `move:player_back_left->player_front_right` (392.5ms)
- white_planner: `focus:player_front_right` (238.6ms)
- white reason: 前衛カードを前列へ出して攻撃しやすくするため移動 / 見送り: ためるは8点差で見送り、ためるは89点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面14点、次点と10点差
- board: player_front_left:player:ドノマンティス L1 HP5 act / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ボムゾウ L1 HP6 act / cpu_front_right:cpu:デスシープ L1 HP6 prep / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ヤンバル L1 HP3 prep

### seed 994300 step 9 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `move:player_back_left->player_front_left`
- white: `focus:player_front_left` (494.6ms)
- white_planner: `move:player_back_left->player_front_left` (132.2ms)
- white reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / 見送り: 攻撃は153点差で見送り、ためるは206点差で見送り
- planner reason: 前衛カードを前列へ出して攻撃しやすくするため移動 / 見送り: 攻撃は14点差で見送り、ためるは55点差で見送り
- board: player_front_left:player:ドノマンティス L1 HP5 act / player_front_right:player:ポリスピナー L1 HP3 act focus / player_back_left:player:ボムゾウ L1 HP6 act / cpu_front_right:cpu:デスシープ L1 HP6 prep / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ヤンバル L1 HP3 prep

### seed 994300 step 21 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `focus:player_back_left`
- white: `move:player_back_left->player_front_right` (157.7ms)
- white_planner: `focus:player_back_left` (67.9ms)
- white reason: 前衛カードを前列へ出して攻撃しやすくするため移動 / 見送り: ためるは65点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面36点、次点と26点差
- board: player_front_left:player:ボムゾウ L1 HP6 act focus / player_back_left:player:ドノマンティス L1 HP5 act / player_back_right:player:ピグミィ L1 HP3 prep / cpu_front_left:cpu:真勇者ダイン L1 HP6 act focus / cpu_front_right:cpu:デスシープ L2 HP6 act shield / cpu_back_left:cpu:ドノマンティス L1 HP5 prep / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 38 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `summon:player_card_047_2->player_back_left`
- white: `focus:player_front_right` (572.8ms)
- white_planner: `summon:player_card_047_2->player_back_left` (86.6ms)
- white reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / 見送り: 攻撃は90点差で見送り、マスター特技は131点差で見送り
- planner reason: 真勇者ダインを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面215点、次点と130点差
- board: player_front_left:player:ドノマンティス L1 HP5 act focus / player_front_right:player:デスシープ L1 HP6 act / player_back_right:player:ボムゾウ L1 HP6 act focus / cpu_front_left:cpu:真勇者ダイン L2 HP6 act / cpu_front_right:cpu:デスシープ L2 HP6 act shield / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 39 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:player_front_left:attack->monster:cpu_front_left` (539.5ms)
- white_planner: `end_turn` (53ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: マスター特技は41点差で見送り、攻撃は90点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面128点
- board: player_front_left:player:ドノマンティス L1 HP5 act focus / player_front_right:player:デスシープ L1 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 prep / player_back_right:player:ボムゾウ L1 HP6 act focus / cpu_front_left:cpu:真勇者ダイン L2 HP6 act / cpu_front_right:cpu:デスシープ L2 HP6 act shield / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 40 challenger-as-player

- turn/current: 5 / cpu (white)
- selected: white / `attack:cpu_back_right:wild_claw->monster:player_front_right`
- white: `attack:cpu_back_right:wild_claw->monster:player_front_right` (417ms)
- white_planner: `end_turn` (326.9ms)
- white reason: デスシープを削れるため攻撃 / 見送り: 攻撃は19点差で見送り、攻撃は79点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面178点、次点と15点差
- board: player_front_left:player:ドノマンティス L1 HP5 act focus / player_front_right:player:デスシープ L1 HP6 act focus / player_back_left:player:真勇者ダイン L1 HP6 prep / player_back_right:player:ボムゾウ L1 HP6 act focus / cpu_front_left:cpu:真勇者ダイン L2 HP6 act / cpu_front_right:cpu:デスシープ L2 HP6 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 45 challenger-as-player

- turn/current: 6 / player (white_planner)
- selected: white_planner / `summon:player_polyspinner_3->player_back_right`
- white: `focus:player_back_left` (226.7ms)
- white_planner: `summon:player_polyspinner_3->player_back_right` (62.5ms)
- white reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / 見送り: 攻撃は114点差で見送り、マスター特技は131点差で見送り
- planner reason: ポリスピナーを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面156点、次点と133点差
- board: player_front_left:player:ドノマンティス L1 HP5 act focus / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:真勇者ダイン L1 HP6 act / cpu_front_left:cpu:真勇者ダイン L2 HP6 act focus / cpu_front_right:cpu:デスシープ L2 HP6 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 46 challenger-as-player

- turn/current: 6 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:player_front_right:self_bomb->monster:cpu_front_right` (206.6ms)
- white_planner: `end_turn` (34.5ms)
- white reason: デスシープを削れるため攻撃 / 見送り: マスター特技は17点差で見送り、攻撃は19点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面77点
- board: player_front_left:player:ドノマンティス L1 HP5 act focus / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:真勇者ダイン L1 HP6 act / player_back_right:player:ポリスピナー L1 HP3 prep / cpu_front_left:cpu:真勇者ダイン L2 HP6 act focus / cpu_front_right:cpu:デスシープ L2 HP6 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 52 challenger-as-player

- turn/current: 7 / player (white_planner)
- selected: white_planner / `summon:player_card_047_3->player_back_left`
- white: `focus:player_back_right` (223.5ms)
- white_planner: `summon:player_card_047_3->player_back_left` (64.4ms)
- white reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / 見送り: 召喚は63点差で見送り、攻撃は116点差で見送り
- planner reason: 真勇者ダインを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面185点、次点と148点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act focus / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_right:player:ポリスピナー L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L2 HP6 act / cpu_front_right:cpu:デスシープ L2 HP6 act shield focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L2 HP3 act

### seed 994300 step 53 challenger-as-player

- turn/current: 7 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `master:master_attack->monster:cpu_front_left` (195.8ms)
- white_planner: `end_turn` (39.1ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は4点差で見送り、攻撃は61点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面95点
- board: player_front_left:player:真勇者ダイン L1 HP6 act focus / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:真勇者ダイン L1 HP6 prep / player_back_right:player:ポリスピナー L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L2 HP6 act / cpu_front_right:cpu:デスシープ L2 HP6 act shield focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L2 HP3 act

### seed 994300 step 54 challenger-as-player

- turn/current: 7 / cpu (white)
- selected: white / `attack:cpu_back_right:wild_claw->monster:player_front_left`
- white: `attack:cpu_back_right:wild_claw->monster:player_front_left` (469.2ms)
- white_planner: `attack:cpu_front_right:attack->monster:player_front_right` (328.9ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: 攻撃は1点差で見送り、攻撃は22点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面173点、次点と3点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act focus / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:真勇者ダイン L1 HP6 prep / player_back_right:player:ポリスピナー L1 HP3 act focus / cpu_front_left:cpu:真勇者ダイン L2 HP6 act / cpu_front_right:cpu:デスシープ L2 HP6 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L2 HP3 act

### seed 994300 step 57 challenger-as-player

- turn/current: 7 / cpu (white)
- selected: white / `attack:cpu_front_right:attack->master:player`
- white: `attack:cpu_front_right:attack->master:player` (137.1ms)
- white_planner: `end_turn` (14.1ms)
- white reason: 相手マスターへ実ダメージを与えられるため攻撃 / 見送り: 攻撃は160点差で見送り、移動は339点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-6点
- board: player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:真勇者ダイン L1 HP6 prep / player_back_right:player:ポリスピナー L1 HP3 act focus / cpu_front_left:cpu:真勇者ダイン L2 HP6 act / cpu_front_right:cpu:デスシープ L2 HP6 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L2 HP3 act

### seed 994300 step 59 challenger-as-player

- turn/current: 8 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:player_front_right:self_bomb->monster:cpu_front_right` (427.5ms)
- white_planner: `end_turn` (57.3ms)
- white reason: デスシープを削れるため攻撃 / 見送り: マスター特技は10点差で見送り、攻撃は12点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面92点
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_right:player:ポリスピナー L1 HP3 act focus / cpu_front_left:cpu:真勇者ダイン L2 HP6 act / cpu_front_right:cpu:デスシープ L2 HP6 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L2 HP3 act

### seed 994300 step 60 challenger-as-player

- turn/current: 8 / cpu (white)
- selected: white / `attack:cpu_back_right:wild_claw->monster:player_front_left`
- white: `attack:cpu_back_right:wild_claw->monster:player_front_left` (719.4ms)
- white_planner: `end_turn` (298.6ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: 攻撃は65点差で見送り、ためるは160点差で見送り
- planner reason: 有効な行動がないためターン終了 / 見送り: 攻撃は30点差で見送り、攻撃は31点差で見送り
- board: player_front_left:player:真勇者ダイン L1 HP6 act focus / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_right:player:ポリスピナー L1 HP3 act focus / cpu_front_left:cpu:真勇者ダイン L2 HP6 act / cpu_front_right:cpu:デスシープ L2 HP6 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L2 HP3 act

### seed 994300 step 64 challenger-as-player

- turn/current: 9 / player (white_planner)
- selected: white_planner / `move:player_back_right->player_front_left`
- white: `master:master_attack->monster:cpu_front_left` (600.4ms)
- white_planner: `move:player_back_right->player_front_left` (78ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は355点差で見送り、召喚は391点差で見送り
- planner reason: 移動後に強い攻撃筋を作れるため移動 / ターンプラン探索: 返し込み最終盤面33点、次点と57点差
- board: player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_right:player:ポリスピナー L1 HP3 act focus / cpu_front_left:cpu:真勇者ダイン L2 HP6 act / cpu_front_right:cpu:デスシープ L2 HP6 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L2 HP3 act

### seed 994300 step 65 challenger-as-player

- turn/current: 9 / player (white_planner)
- selected: white_planner / `focus:player_front_left`
- white: `attack:player_front_right:self_bomb->monster:cpu_front_right` (493.9ms)
- white_planner: `focus:player_front_left` (64.5ms)
- white reason: デスシープを削れるため攻撃 / 見送り: 召喚は153点差で見送り、攻撃は191点差で見送り
- planner reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / 見送り: 攻撃は259点差で見送り、攻撃は394点差で見送り
- board: player_front_left:player:ポリスピナー L1 HP3 act / player_front_right:player:ボムゾウ L1 HP6 act focus / cpu_front_left:cpu:真勇者ダイン L2 HP6 act / cpu_front_right:cpu:デスシープ L2 HP6 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L2 HP3 act

### seed 994300 step 68 challenger-as-player

- turn/current: 9 / player (white_planner)
- selected: white_planner / `master:master_attack->monster:cpu_front_left`
- white: `summon:player_yanbaru_1->player_back_left` (354.7ms)
- white_planner: `master:master_attack->monster:cpu_front_left` (228.1ms)
- white reason: 後衛カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は345点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / 見送り: 召喚は192点差で見送り、召喚は192点差で見送り
- board: player_front_left:player:ポリスピナー L1 HP3 act focus / player_front_right:player:ボムゾウ L1 HP6 act focus / cpu_front_left:cpu:真勇者ダイン L2 HP2 act / cpu_front_right:cpu:デスシープ L2 HP6 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L2 HP3 act

### seed 994300 step 75 challenger-as-player

- turn/current: 9 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `summon:player_card_037_2->player_back_right` (139.7ms)
- white_planner: `end_turn` (27.8ms)
- white reason: ドノマンティスを空き枠へ召喚
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-175点
- board: player_front_left:player:ポリスピナー L1 HP3 act focus / player_front_right:player:ボムゾウ L1 HP4 act / player_back_left:player:ヤンバル L2 HP3 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L2 HP3 act

### seed 994300 step 79 challenger-as-player

- turn/current: 9 / cpu (white)
- selected: white / `attack:cpu_front_left:attack->monster:player_front_left`
- white: `attack:cpu_front_left:attack->monster:player_front_left` (814.8ms)
- white_planner: `master:master_attack->monster:player_front_right` (356.1ms)
- white reason: ポリスピナーを削れるため攻撃 / 見送り: マスター特技は81点差で見送り、攻撃は816点差で見送り
- planner reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は45点差で見送り、攻撃は602点差で見送り
- board: player_front_left:player:ポリスピナー L1 HP3 act focus / player_front_right:player:ボムゾウ L1 HP4 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act focus / cpu_front_right:cpu:ヤンバル L2 HP3 act / cpu_back_left:cpu:ヤンバル L1 HP3 prep / cpu_back_right:cpu:ヤンバル L1 HP3 prep

### seed 994300 step 81 challenger-as-player

- turn/current: 9 / cpu (white)
- selected: white / `master:wake_up->monster:cpu_back_right`
- white: `master:wake_up->monster:cpu_back_right` (544.4ms)
- white_planner: `attack:cpu_back_left:wild_claw->monster:player_front_left` (361.4ms)
- white reason: 準備中の味方を起こして敵を撃破できるためウェイクアップ / 見送り: 攻撃は19点差で見送り、攻撃は132点差で見送り
- planner reason: 敵モンスターを撃破できるため攻撃 / ターンプラン探索: 返し込み最終盤面133点、次点と3点差
- board: player_front_left:player:ポリスピナー L1 HP1 act / player_front_right:player:ボムゾウ L1 HP4 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act / cpu_front_right:cpu:ヤンバル L2 HP3 act / cpu_back_left:cpu:ヤンバル L1 HP3 act / cpu_back_right:cpu:ヤンバル L1 HP3 prep

### seed 994300 step 85 challenger-as-player

- turn/current: 10 / player (white_planner)
- selected: white_planner / `master:master_attack->monster:cpu_front_right`
- white: `attack:player_front_right:self_bomb->monster:cpu_front_right` (709.9ms)
- white_planner: `master:master_attack->monster:cpu_front_right` (383.4ms)
- white reason: ヤンバルを削れるため攻撃 / 見送り: 攻撃は71点差で見送り、マスター特技は155点差で見送り
- planner reason: ストーンに余裕があり敵を削れるためマスターアタック / ターンプラン探索: 返し込み最終盤面307点、次点と63点差
- board: player_front_right:player:ボムゾウ L1 HP4 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act / cpu_front_right:cpu:ヤンバル L2 HP3 act / cpu_back_left:cpu:ヤンバル L2 HP3 act / cpu_back_right:cpu:ヤンバル L1 HP3 act focus

### seed 994300 step 88 challenger-as-player

- turn/current: 10 / player (white_planner)
- selected: white_planner / `master:master_attack->monster:cpu_front_left`
- white: `summon:player_bomuzo_3->player_front_left` (201.3ms)
- white_planner: `master:master_attack->monster:cpu_front_left` (35.6ms)
- white reason: 前衛カードを前列左へ召喚 / 見送り: 召喚は12点差で見送り、マスター特技は18点差で見送り
- planner reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 召喚は185点差で見送り、召喚は188点差で見送り
- board: player_front_right:player:ボムゾウ L2 HP5 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:ヤンバル L2 HP3 act / cpu_back_right:cpu:ヤンバル L1 HP3 act focus

### seed 994300 step 90 challenger-as-player

- turn/current: 10 / player (white_planner)
- selected: white_planner / `summon:player_bomuzo_3->player_front_left`
- white: `summon:player_card_037_2->player_front_left` (607.5ms)
- white_planner: `summon:player_bomuzo_3->player_front_left` (329.4ms)
- white reason: 前衛カードを前列左へ召喚 / 見送り: 召喚は11点差で見送り、召喚は53点差で見送り
- planner reason: 前衛カードを前列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は25点差で見送り
- board: player_front_right:player:ボムゾウ L2 HP5 act / cpu_front_left:cpu:ドノマンティス L1 HP1 act / cpu_back_left:cpu:ヤンバル L2 HP3 act / cpu_back_right:cpu:ヤンバル L1 HP3 act focus

### seed 994300 step 97 challenger-as-player

- turn/current: 10 / cpu (white)
- selected: white / `summon:cpu_card_047_1->cpu_back_left`
- white: `summon:cpu_card_047_1->cpu_back_left` (263.8ms)
- white_planner: `move:cpu_front_right->cpu_back_left` (206.9ms)
- white reason: カードを後列左へ召喚 / 見送り: 移動は10点差で見送り、召喚は29点差で見送り
- planner reason: 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: 召喚は19点差で見送り、召喚は48点差で見送り
- board: player_front_left:player:ボムゾウ L2 HP5 act / cpu_front_left:cpu:ヤンバル L2 HP3 act / cpu_front_right:cpu:ヤンバル L1 HP3 act focus

### seed 994300 step 127 challenger-as-player

- turn/current: 15 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:player_front_right:attack->master:cpu` (29.5ms)
- white_planner: `end_turn` (9.2ms)
- white reason: 相手マスターへ実ダメージを与えられるため攻撃
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面22点
- board: player_front_right:player:ドノマンティス L1 HP5 act focus / cpu_front_left:cpu:ドノマンティス L1 HP5 act focus / cpu_front_right:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act focus

## Reading

- white_planner average decision 136.6ms, max 979.1ms.
- white_planner diverged from white 25 times; inspect samples before changing search depth.

## Next Steps

- Review decision diff samples and classify good/bad planner divergences.
- If planner average decision time stays practical, run both directions with count 3-5.
- Try opponentTerminalPlanDepth 2 as a v2 candidate.
