# White Planner Phase 2

生成: 2026-07-03T13:52:18.829Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994200-994201
directions: challenger-as-cpu, challenger-as-player

## Summary

- games: 4
- wins: -
- draws/undecided: 4
- issues: 4
- decision diffs: 138
- planner-selected diffs: 70

## Timing

| profile | decisions | avg ms | max ms | total ms |
| --- | ---: | ---: | ---: | ---: |
| white | 394 | 547.1ms | 3011.6ms | 215552.9ms |
| white_planner | 394 | 246ms | 1492.9ms | 96920.1ms |

## Games

| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| challenger-as-cpu | 994200 | P white / C white_planner | draw | 100 | 10 | P10/C9 | winner was not decided within 100 auto steps | 30 | 14 |
| challenger-as-cpu | 994201 | P white / C white_planner | draw | 100 | 10 | P8/C10 | winner was not decided within 100 auto steps | 33 | 22 |
| challenger-as-player | 994200 | P white_planner / C white | draw | 100 | 9 | P9/C9 | winner was not decided within 100 auto steps | 37 | 18 |
| challenger-as-player | 994201 | P white_planner / C white | draw | 100 | 9 | P9/C9 | winner was not decided within 100 auto steps | 38 | 16 |

## Decision Diff Samples

### seed 994200 step 5 challenger-as-cpu

- turn/current: 1 / cpu (white_planner)
- selected: white_planner / `summon:cpu_card_037_2->cpu_front_left`
- white: `summon:cpu_card_037_2->cpu_front_right` (112.7ms)
- white_planner: `summon:cpu_card_037_2->cpu_front_left` (60ms)
- white reason: 前衛カードを前列右へ召喚 / 見送り: 召喚は16点差で見送り、召喚は40点差で見送り
- planner reason: 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面11点、次点と3点差
- board: player_front_left:player:デスシープ L1 HP6 prep / player_front_right:player:ボムゾウ L1 HP6 prep / player_back_left:player:真勇者ダイン L1 HP6 prep / cpu_back_left:cpu:ピグミィ L1 HP3 prep

### seed 994200 step 8 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `focus:player_front_right`
- white: `focus:player_front_right` (867.9ms)
- white_planner: `summon:player_yanbaru_2->player_back_right` (264.1ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは3点差で見送り、召喚は8点差で見送り
- planner reason: 後衛カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面156点、次点と33点差
- board: player_front_left:player:デスシープ L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 act / cpu_front_left:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:ピグミィ L1 HP3 prep / cpu_back_right:cpu:ピグミィ L1 HP3 prep

### seed 994200 step 10 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `focus:player_front_left`
- white: `focus:player_front_left` (522.3ms)
- white_planner: `focus:player_back_left` (117.2ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは53点差で見送り、移動は184点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面48点、次点と0点差
- board: player_front_left:player:デスシープ L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:真勇者ダイン L1 HP6 act / player_back_right:player:ヤンバル L1 HP3 prep / cpu_front_left:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:ピグミィ L1 HP3 prep / cpu_back_right:cpu:ピグミィ L1 HP3 prep

### seed 994200 step 15 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `move:cpu_front_right->cpu_back_right`
- white: `focus:cpu_front_right` (1493.6ms)
- white_planner: `move:cpu_front_right->cpu_back_right` (1006.7ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは14点差で見送り、移動は22点差で見送り
- planner reason: 移動後に強い攻撃筋を作れるため移動 / ターンプラン探索: 返し込み最終盤面106点、次点と4点差
- board: player_front_left:player:デスシープ L1 HP6 act shield focus / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 prep / cpu_front_left:cpu:ドノマンティス L1 HP5 act / cpu_front_right:cpu:ピグミィ L1 HP3 act / cpu_back_left:cpu:ピグミィ L1 HP3 act

### seed 994200 step 16 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `focus:cpu_front_left`
- white: `attack:cpu_front_left:attack->monster:player_front_left` (507.7ms)
- white_planner: `focus:cpu_front_left` (248.7ms)
- white reason: デスシープを削れるため攻撃 / 見送り: ためるは57点差で見送り、攻撃は88点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面78点、次点と3点差
- board: player_front_left:player:デスシープ L1 HP6 act shield focus / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 prep / cpu_front_left:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:ピグミィ L1 HP3 act / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 21 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `attack:player_back_right:wild_claw->monster:cpu_front_left`
- white: `attack:player_back_right:wild_claw->monster:cpu_front_left` (684.6ms)
- white_planner: `end_turn` (42.6ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: ためるは114点差で見送り、ためるは139点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面221点、次点と50点差
- board: player_front_left:player:デスシープ L1 HP6 act focus / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act shield focus / cpu_back_left:cpu:ピグミィ L1 HP3 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act focus

### seed 994200 step 24 challenger-as-cpu

- turn/current: 3 / cpu (white_planner)
- selected: white_planner / `summon:cpu_card_037_1->cpu_back_right`
- white: `attack:cpu_back_left:スパイクボール->monster:player_front_right` (1336.3ms)
- white_planner: `summon:cpu_card_037_1->cpu_back_right` (541.3ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は25点差で見送り、攻撃は79点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面219点、次点と5点差
- board: player_front_left:player:デスシープ L1 HP6 act focus / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act focus / cpu_front_right:cpu:ピグミィ L1 HP3 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 act focus

### seed 994200 step 25 challenger-as-cpu

- turn/current: 3 / cpu (white_planner)
- selected: white_planner / `attack:cpu_back_left:スパイクボール->monster:player_front_left`
- white: `attack:cpu_back_left:スパイクボール->monster:player_front_right` (1018.3ms)
- white_planner: `attack:cpu_back_left:スパイクボール->monster:player_front_left` (793ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は14点差で見送り、攻撃は25点差で見送り
- planner reason: デスシープを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面158点、次点と0点差
- board: player_front_left:player:デスシープ L1 HP6 act focus / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act focus / cpu_front_right:cpu:ピグミィ L1 HP3 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 act focus / cpu_back_right:cpu:ドノマンティス L1 HP5 prep

### seed 994200 step 27 challenger-as-cpu

- turn/current: 3 / cpu (white_planner)
- selected: white_planner / `end_turn`
- white: `focus:cpu_front_right` (703.4ms)
- white_planner: `end_turn` (192.3ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは17点差で見送り、攻撃は129点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面146点、次点と1点差
- board: player_front_left:player:デスシープ L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act focus / cpu_front_right:cpu:ピグミィ L1 HP3 act / cpu_back_left:cpu:ピグミィ L1 HP3 act / cpu_back_right:cpu:ドノマンティス L1 HP5 prep

### seed 994200 step 28 challenger-as-cpu

- turn/current: 4 / player (white)
- selected: white / `focus:player_front_left`
- white: `focus:player_front_left` (1393ms)
- white_planner: `attack:player_back_right:wild_claw->monster:cpu_front_left` (942.9ms)
- white reason: 有効攻撃がないためためる / 見送り: 攻撃は4点差で見送り、攻撃は17点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面276点、次点と25点差
- board: player_front_left:player:デスシープ L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act focus / cpu_front_right:cpu:ピグミィ L1 HP3 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 act focus / cpu_back_right:cpu:ドノマンティス L1 HP5 prep

### seed 994200 step 32 challenger-as-cpu

- turn/current: 4 / player (white)
- selected: white / `magic:player_card_031_1->monster:cpu_back_left`
- white: `magic:player_card_031_1->monster:cpu_back_left` (224.1ms)
- white_planner: `master:shield->monster:player_front_right` (76ms)
- white reason: ワープで追加対象も有効にできるため使用 / 見送り: マジックは1点差で見送り、マスター特技は69点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面73点、次点と1点差
- board: player_front_left:player:デスシープ L1 HP6 act focus / player_front_right:player:ボムゾウ L2 HP5 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 act focus / cpu_back_right:cpu:ドノマンティス L1 HP5 prep

### seed 994200 step 33 challenger-as-cpu

- turn/current: 4 / player (white)
- selected: white / `master:shield->monster:player_front_left`
- white: `master:shield->monster:player_front_left` (151.6ms)
- white_planner: `master:shield->monster:player_front_right` (50.5ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は4点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面33点、次点と8点差
- board: player_front_left:player:デスシープ L1 HP6 act focus / player_front_right:player:ボムゾウ L2 HP5 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ピグミィ L1 HP3 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ドノマンティス L1 HP5 prep

### seed 994200 step 37 challenger-as-cpu

- turn/current: 4 / cpu (white_planner)
- selected: white_planner / `summon:cpu_bomuzo_3->cpu_front_left`
- white: `master:master_attack->monster:player_front_right` (289.5ms)
- white_planner: `summon:cpu_bomuzo_3->cpu_front_left` (57.9ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は41点差で見送り、召喚は244点差で見送り
- planner reason: 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面245点、次点と38点差
- board: player_front_left:player:デスシープ L1 HP6 act shield focus / player_front_right:player:ボムゾウ L2 HP5 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 38 challenger-as-cpu

- turn/current: 4 / cpu (white_planner)
- selected: white_planner / `focus:cpu_back_right`
- white: `attack:cpu_back_right:スパイクボール->monster:player_front_right` (249.5ms)
- white_planner: `focus:cpu_back_right` (35.7ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: マスター特技は10点差で見送り、ためるは324点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面145点、次点と9点差
- board: player_front_left:player:デスシープ L1 HP6 act shield focus / player_front_right:player:ボムゾウ L2 HP5 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 40 challenger-as-cpu

- turn/current: 5 / player (white)
- selected: white / `attack:player_back_right:wild_claw->monster:cpu_front_right`
- white: `attack:player_back_right:wild_claw->monster:cpu_front_right` (1040ms)
- white_planner: `attack:player_front_left:attack->master:cpu` (584ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は80点差で見送り、攻撃は119点差で見送り
- planner reason: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面175点、次点と102点差
- board: player_front_left:player:デスシープ L1 HP6 act focus / player_front_right:player:ボムゾウ L2 HP5 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act focus

### seed 994200 step 41 challenger-as-cpu

- turn/current: 5 / player (white)
- selected: white / `attack:player_front_right:self_bomb->monster:cpu_front_right`
- white: `attack:player_front_right:self_bomb->monster:cpu_front_right` (657.4ms)
- white_planner: `attack:player_front_left:attack->master:cpu` (360ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は33点差で見送り、攻撃は51点差で見送り
- planner reason: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面68点、次点と2点差
- board: player_front_left:player:デスシープ L1 HP6 act focus / player_front_right:player:ボムゾウ L2 HP5 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP4 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act focus

### seed 994200 step 52 challenger-as-cpu

- turn/current: 6 / player (white)
- selected: white / `move:player_front_right->player_back_right`
- white: `move:player_front_right->player_back_right` (579.1ms)
- white_planner: `summon:player_card_037_3->player_back_right` (215.8ms)
- white reason: 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: 召喚は78点差で見送り、移動は110点差で見送り
- planner reason: ドノマンティスを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面168点、次点と13点差
- board: player_front_left:player:デスシープ L1 HP6 act focus / player_front_right:player:ヤンバル L1 HP3 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act focus / cpu_front_right:cpu:真勇者ダイン L1 HP6 prep / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act focus

### seed 994200 step 57 challenger-as-cpu

- turn/current: 7 / player (white)
- selected: white / `attack:player_back_right:wild_claw->monster:cpu_front_left`
- white: `attack:player_back_right:wild_claw->monster:cpu_front_left` (482.2ms)
- white_planner: `end_turn` (135.7ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は292点差で見送り、移動は363点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面232点、次点と26点差
- board: player_front_left:player:デスシープ L1 HP6 act focus / player_front_right:player:デスシープ L1 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act focus / cpu_front_right:cpu:真勇者ダイン L1 HP6 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act focus

### seed 994200 step 58 challenger-as-cpu

- turn/current: 7 / player (white)
- selected: white / `master:master_attack->monster:cpu_front_left`
- white: `master:master_attack->monster:cpu_front_left` (311ms)
- white_planner: `attack:player_front_left:attack->monster:cpu_front_left` (94.8ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は69点差で見送り、ためるは126点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面203点、次点と58点差
- board: player_front_left:player:デスシープ L1 HP6 act focus / player_front_right:player:デスシープ L1 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP5 act / cpu_front_right:cpu:真勇者ダイン L1 HP6 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act focus

### seed 994200 step 65 challenger-as-cpu

- turn/current: 7 / cpu (white_planner)
- selected: white_planner / `attack:cpu_front_right:ダイン斬り->monster:player_front_right`
- white: `focus:cpu_back_right` (665.5ms)
- white_planner: `attack:cpu_front_right:ダイン斬り->monster:player_front_right` (113.2ms)
- white reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / 見送り: 攻撃は79点差で見送り、攻撃は84点差で見送り
- planner reason: デスシープを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面168点、次点と63点差
- board: player_front_left:player:デスシープ L2 HP6 act / player_front_right:player:デスシープ L1 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act focus / cpu_front_right:cpu:真勇者ダイン L1 HP6 act focus / cpu_back_left:cpu:ボムゾウ L1 HP6 prep / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 67 challenger-as-cpu

- turn/current: 7 / cpu (white_planner)
- selected: white_planner / `attack:cpu_back_right:スパイクボール->monster:player_front_right`
- white: `master:wake_up->monster:cpu_back_left` (844.8ms)
- white_planner: `attack:cpu_back_right:スパイクボール->monster:player_front_right` (121ms)
- white reason: 準備中の味方を起こして敵を撃破できるためウェイクアップ / 見送り: 攻撃は122点差で見送り、マスター特技は460点差で見送り
- planner reason: 敵モンスターを撃破できるため攻撃 / ターンプラン探索: 返し込み最終盤面199点、次点と13点差
- board: player_front_left:player:デスシープ L2 HP6 act / player_front_right:player:デスシープ L1 HP1 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act focus / cpu_front_right:cpu:真勇者ダイン L1 HP6 act / cpu_back_left:cpu:ボムゾウ L1 HP6 prep / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 68 challenger-as-cpu

- turn/current: 7 / cpu (white_planner)
- selected: white_planner / `end_turn`
- white: `master:master_attack->monster:player_front_left` (602.4ms)
- white_planner: `end_turn` (20.9ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は237点差で見送り、攻撃は677点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面17点
- board: player_front_left:player:デスシープ L2 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act focus / cpu_front_right:cpu:真勇者ダイン L1 HP6 act / cpu_back_left:cpu:ボムゾウ L1 HP6 prep / cpu_back_right:cpu:ピグミィ L2 HP3 act

### seed 994200 step 69 challenger-as-cpu

- turn/current: 8 / player (white)
- selected: white / `move:player_back_left->player_front_right`
- white: `move:player_back_left->player_front_right` (2474.5ms)
- white_planner: `summon:player_card_051_3->player_back_right` (1023.5ms)
- white reason: 移動後に強い攻撃筋を作れるため移動 / 見送り: 召喚は13点差で見送り、召喚は107点差で見送り
- planner reason: 後衛カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面196点、次点と30点差
- board: player_front_left:player:デスシープ L2 HP6 act / player_front_right:player:ヤンバル L1 HP3 act / player_back_left:player:真勇者ダイン L1 HP6 act focus / cpu_front_left:cpu:ドノマンティス L1 HP5 act focus / cpu_front_right:cpu:真勇者ダイン L1 HP6 act / cpu_back_left:cpu:ボムゾウ L1 HP6 prep / cpu_back_right:cpu:ピグミィ L2 HP3 act

### seed 994200 step 70 challenger-as-cpu

- turn/current: 8 / player (white)
- selected: white / `attack:player_front_left:attack->monster:cpu_front_left`
- white: `attack:player_front_left:attack->monster:cpu_front_left` (1133.9ms)
- white_planner: `summon:player_card_051_3->player_back_right` (505ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 召喚は35点差で見送り、召喚は126点差で見送り
- planner reason: 後衛カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面88点、次点と30点差
- board: player_front_left:player:デスシープ L2 HP6 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act focus / cpu_front_right:cpu:真勇者ダイン L1 HP6 act / cpu_back_left:cpu:ボムゾウ L1 HP6 prep / cpu_back_right:cpu:ピグミィ L2 HP3 act

### seed 994201 step 1 challenger-as-cpu

- turn/current: 1 / player (white)
- selected: white / `summon:player_card_037_2->player_front_right`
- white: `summon:player_card_037_2->player_front_right` (135.8ms)
- white_planner: `summon:player_card_037_2->player_front_left` (49.1ms)
- white reason: 前衛カードを前列右へ召喚 / 見送り: 召喚は16点差で見送り、召喚は40点差で見送り
- planner reason: 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面194点、次点と3点差
- board: player_back_left:player:ピグミィ L1 HP3 prep

### seed 994201 step 8 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `move:player_front_left->player_back_right`
- white: `move:player_front_left->player_back_right` (1601.8ms)
- white_planner: `move:player_front_left->player_back_left` (473.8ms)
- white reason: 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: ためるは222点差で見送り、ためるは254点差で見送り
- planner reason: 後衛カードを後列へ戻して射程を活かすため移動 / ターンプラン探索: 返し込み最終盤面13点、次点と3点差
- board: player_front_left:player:ピグミィ L1 HP3 act / player_front_right:player:ドノマンティス L1 HP5 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ボムゾウ L1 HP6 prep / cpu_back_left:cpu:ピグミィ L1 HP3 prep

### seed 994201 step 10 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `master:shield->monster:player_front_right`
- white: `master:shield->monster:player_front_right` (267.4ms)
- white_planner: `master:shield->monster:player_front_left` (89.9ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は16点差で見送り、マスター特技は25点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面-127点、次点と5点差
- board: player_front_left:player:ピグミィ L1 HP3 act / player_front_right:player:ドノマンティス L1 HP5 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ボムゾウ L1 HP6 prep / cpu_back_left:cpu:ピグミィ L1 HP3 prep

### seed 994201 step 14 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `summon:cpu_polyspinner_1->cpu_back_right`
- white: `attack:cpu_front_right:self_bomb->monster:player_front_right` (312.8ms)
- white_planner: `summon:cpu_polyspinner_1->cpu_back_right` (155.3ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: ためるは34点差で見送り、召喚は62点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面180点、次点と0点差
- board: player_front_right:player:ドノマンティス L1 HP5 act shield focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:ピグミィ L1 HP3 act

### seed 994201 step 15 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `focus:cpu_front_right`
- white: `attack:cpu_front_right:self_bomb->monster:player_front_right` (202.1ms)
- white_planner: `focus:cpu_front_right` (76ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: ためるは34点差で見送り、攻撃は89点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面119点、次点と4点差
- board: player_front_right:player:ドノマンティス L1 HP5 act shield focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:ピグミィ L1 HP3 act / cpu_back_right:cpu:ポリスピナー L1 HP3 prep

### seed 994201 step 19 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `attack:player_front_right:attack->monster:cpu_front_right`
- white: `attack:player_front_right:attack->monster:cpu_front_right` (295.6ms)
- white_planner: `end_turn` (16.4ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は20点差で見送り、マスター特技は318点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-21点
- board: player_front_right:player:ドノマンティス L1 HP5 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:ピグミィ L1 HP3 act focus / cpu_back_right:cpu:ポリスピナー L1 HP3 prep

### seed 994201 step 24 challenger-as-cpu

- turn/current: 3 / cpu (white_planner)
- selected: white_planner / `summon:cpu_polyspinner_3->cpu_back_right`
- white: `attack:cpu_front_left:storm_bomb->monster:player_back_right` (518.9ms)
- white_planner: `summon:cpu_polyspinner_3->cpu_back_right` (270ms)
- white reason: ピグミィを削れるため攻撃 / 見送り: マジックは122点差で見送り、マジックは122点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面397点、次点と4点差
- board: player_front_right:player:ドノマンティス L1 HP5 act / player_back_right:player:ピグミィ L2 HP3 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act / cpu_front_right:cpu:ポリスピナー L1 HP3 act / cpu_back_left:cpu:ピグミィ L1 HP3 act focus

### seed 994201 step 25 challenger-as-cpu

- turn/current: 3 / cpu (white_planner)
- selected: white_planner / `magic:cpu_card_031_1->monster:player_front_right`
- white: `attack:cpu_front_left:storm_bomb->monster:player_back_right` (1123.2ms)
- white_planner: `magic:cpu_card_031_1->monster:player_front_right` (461.7ms)
- white reason: ピグミィを削れるため攻撃 / 見送り: マジックは125点差で見送り、マジックは125点差で見送り
- planner reason: ワープで追加対象も有効にできるため使用 / ターンプラン探索: 返し込み最終盤面344点、次点と0点差
- board: player_front_right:player:ドノマンティス L1 HP5 act / player_back_right:player:ピグミィ L2 HP3 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act / cpu_front_right:cpu:ポリスピナー L1 HP3 act / cpu_back_left:cpu:ピグミィ L1 HP3 act focus / cpu_back_right:cpu:ポリスピナー L1 HP3 prep

### seed 994201 step 26 challenger-as-cpu

- turn/current: 3 / cpu (white_planner)
- selected: white_planner / `attack:cpu_back_left:スパイクボール->monster:player_front_right`
- white: `attack:cpu_front_left:storm_bomb->monster:player_front_right` (407.6ms)
- white_planner: `attack:cpu_back_left:スパイクボール->monster:player_front_right` (318.3ms)
- white reason: ピグミィを削れるため攻撃 / 見送り: 攻撃は115点差で見送り、攻撃は214点差で見送り
- planner reason: ピグミィを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面331点、次点と0点差
- board: player_front_right:player:ピグミィ L2 HP3 act / player_back_right:player:ドノマンティス L1 HP5 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act / cpu_front_right:cpu:ポリスピナー L1 HP3 act / cpu_back_left:cpu:ピグミィ L1 HP3 act focus / cpu_back_right:cpu:ポリスピナー L1 HP3 prep

### seed 994201 step 28 challenger-as-cpu

- turn/current: 3 / cpu (white_planner)
- selected: white_planner / `attack:cpu_front_right:attack->master:player`
- white: `attack:cpu_front_left:storm_bomb->monster:player_back_right` (121.1ms)
- white_planner: `attack:cpu_front_right:attack->master:player` (53.7ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: ためるは28点差で見送り、攻撃は74点差で見送り
- planner reason: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面192点、次点と66点差
- board: player_back_right:player:ドノマンティス L1 HP5 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act / cpu_front_right:cpu:ポリスピナー L2 HP3 act / cpu_back_left:cpu:ピグミィ L1 HP3 act / cpu_back_right:cpu:ポリスピナー L1 HP3 prep

### seed 994201 step 29 challenger-as-cpu

- turn/current: 3 / cpu (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:cpu_front_left:storm_bomb->monster:player_back_right` (111.5ms)
- white_planner: `end_turn` (31.1ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: ためるは10点差で見送り、攻撃は118点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面51点、次点と21点差
- board: player_back_right:player:ドノマンティス L1 HP5 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act / cpu_front_right:cpu:ポリスピナー L2 HP3 act / cpu_back_left:cpu:ピグミィ L1 HP3 act / cpu_back_right:cpu:ポリスピナー L1 HP3 prep

### seed 994201 step 37 challenger-as-cpu

- turn/current: 5 / player (white)
- selected: white / `attack:player_front_right:attack->monster:cpu_front_right`
- white: `attack:player_front_right:attack->monster:cpu_front_right` (756.1ms)
- white_planner: `focus:player_front_left` (397.2ms)
- white reason: ポリスピナーを削れるため攻撃 / 見送り: ためるは284点差で見送り、召喚は467点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面213点、次点と5点差
- board: player_front_left:player:ドノマンティス L1 HP5 act / player_front_right:player:ドノマンティス L1 HP5 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act focus / cpu_front_right:cpu:ポリスピナー L1 HP3 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 prep

### seed 994201 step 38 challenger-as-cpu

- turn/current: 5 / player (white)
- selected: white / `focus:player_front_left`
- white: `focus:player_front_left` (363.4ms)
- white_planner: `master:master_attack->monster:cpu_front_right` (197.5ms)
- white reason: 有効攻撃がないためためる / 見送り: マスター特技は26点差で見送り、召喚は141点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / ターンプラン探索: 返し込み最終盤面207点、次点と77点差
- board: player_front_left:player:ドノマンティス L1 HP5 act / player_front_right:player:ドノマンティス L1 HP5 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act focus / cpu_front_right:cpu:ポリスピナー L1 HP2 act / cpu_back_left:cpu:ピグミィ L1 HP3 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 prep

### seed 994201 step 42 challenger-as-cpu

- turn/current: 5 / cpu (white_planner)
- selected: white_planner / `summon:cpu_card_051_3->cpu_back_right`
- white: `attack:cpu_front_right:スパイクボール->monster:player_front_left` (1096.5ms)
- white_planner: `summon:cpu_card_051_3->cpu_back_right` (757.7ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 移動は49点差で見送り、攻撃は57点差で見送り
- planner reason: 後衛カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面167点、次点と2点差
- board: player_front_left:player:ドノマンティス L1 HP5 act focus / player_front_right:player:ドノマンティス L1 HP5 act / player_back_left:player:ボムゾウ L1 HP6 prep / cpu_front_left:cpu:ボムゾウ L2 HP5 act focus / cpu_front_right:cpu:ピグミィ L1 HP3 act / cpu_back_left:cpu:ピグミィ L1 HP3 act focus

### seed 994201 step 43 challenger-as-cpu

- turn/current: 5 / cpu (white_planner)
- selected: white_planner / `attack:cpu_front_left:self_bomb->monster:player_front_left`
- white: `attack:cpu_front_right:スパイクボール->monster:player_front_left` (818.2ms)
- white_planner: `attack:cpu_front_left:self_bomb->monster:player_front_left` (697.6ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は21点差で見送り、攻撃は57点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面164点、次点と10点差
- board: player_front_left:player:ドノマンティス L1 HP5 act focus / player_front_right:player:ドノマンティス L1 HP5 act / player_back_left:player:ボムゾウ L1 HP6 prep / cpu_front_left:cpu:ボムゾウ L2 HP5 act focus / cpu_front_right:cpu:ピグミィ L1 HP3 act / cpu_back_left:cpu:ピグミィ L1 HP3 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 prep

### seed 994201 step 45 challenger-as-cpu

- turn/current: 5 / cpu (white_planner)
- selected: white_planner / `attack:cpu_front_right:スパイクボール->monster:player_front_left`
- white: `master:wake_up->monster:cpu_back_right` (590.2ms)
- white_planner: `attack:cpu_front_right:スパイクボール->monster:player_front_left` (651.2ms)
- white reason: 準備中の味方を起こして敵を撃破できるためウェイクアップ / 見送り: 攻撃は58点差で見送り、攻撃は75点差で見送り
- planner reason: 敵モンスターを撃破できるため攻撃 / ターンプラン探索: 返し込み最終盤面131点、次点と13点差
- board: player_front_left:player:ドノマンティス L1 HP1 act / player_front_right:player:ドノマンティス L1 HP5 act / player_back_left:player:ボムゾウ L1 HP6 prep / cpu_front_left:cpu:ボムゾウ L2 HP2 act / cpu_front_right:cpu:ピグミィ L1 HP3 act / cpu_back_left:cpu:ピグミィ L1 HP3 act / cpu_back_right:cpu:ピグミィ L1 HP3 prep

### seed 994201 step 46 challenger-as-cpu

- turn/current: 5 / cpu (white_planner)
- selected: white_planner / `focus:cpu_front_right`
- white: `master:master_attack->monster:player_front_right` (169.2ms)
- white_planner: `focus:cpu_front_right` (75.8ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: ためるは130点差で見送り、ためるは137点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面-29点、次点と0点差
- board: player_front_right:player:ドノマンティス L1 HP5 act / player_back_left:player:ボムゾウ L1 HP6 prep / cpu_front_left:cpu:ボムゾウ L2 HP2 act / cpu_front_right:cpu:ピグミィ L2 HP3 act / cpu_back_left:cpu:ピグミィ L1 HP3 act / cpu_back_right:cpu:ピグミィ L1 HP3 prep

### seed 994201 step 47 challenger-as-cpu

- turn/current: 5 / cpu (white_planner)
- selected: white_planner / `focus:cpu_back_left`
- white: `master:master_attack->monster:player_front_right` (196.1ms)
- white_planner: `focus:cpu_back_left` (29.2ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: ためるは99点差で見送り、攻撃は186点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面-42点、次点と95点差
- board: player_front_right:player:ドノマンティス L1 HP5 act / player_back_left:player:ボムゾウ L1 HP6 prep / cpu_front_left:cpu:ボムゾウ L2 HP2 act / cpu_front_right:cpu:ピグミィ L2 HP3 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 act / cpu_back_right:cpu:ピグミィ L1 HP3 prep

### seed 994201 step 48 challenger-as-cpu

- turn/current: 5 / cpu (white_planner)
- selected: white_planner / `end_turn`
- white: `master:master_attack->monster:player_front_right` (94ms)
- white_planner: `end_turn` (13.5ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-146点
- board: player_front_right:player:ドノマンティス L1 HP5 act / player_back_left:player:ボムゾウ L1 HP6 prep / cpu_front_left:cpu:ボムゾウ L2 HP2 act / cpu_front_right:cpu:ピグミィ L2 HP3 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 prep

### seed 994201 step 49 challenger-as-cpu

- turn/current: 6 / player (white)
- selected: white / `attack:player_front_left:self_bomb->monster:cpu_front_left`
- white: `attack:player_front_left:self_bomb->monster:cpu_front_left` (782.1ms)
- white_planner: `master:master_attack->monster:cpu_front_left` (507.9ms)
- white reason: 敵モンスターを撃破できるため攻撃 / 見送り: マスター特技は38点差で見送り、攻撃は84点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / ターンプラン探索: 返し込み最終盤面281点、次点と113点差
- board: player_front_left:player:ボムゾウ L1 HP6 act / player_front_right:player:ドノマンティス L1 HP5 act / cpu_front_left:cpu:ボムゾウ L2 HP2 act / cpu_front_right:cpu:ピグミィ L2 HP3 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 prep

### seed 994201 step 54 challenger-as-cpu

- turn/current: 6 / cpu (white_planner)
- selected: white_planner / `move:cpu_front_right->cpu_back_left`
- white: `summon:cpu_card_047_3->cpu_back_right` (1273ms)
- white_planner: `move:cpu_front_right->cpu_back_left` (685.9ms)
- white reason: カードを後列右へ召喚 / 見送り: 移動は4点差で見送り、移動は117点差で見送り
- planner reason: 後衛カードを後列へ戻して射程を活かすため移動 / ターンプラン探索: 返し込み最終盤面208点、次点と4点差
- board: player_front_left:player:ボムゾウ L2 HP5 act / player_front_right:player:ドノマンティス L1 HP5 act / cpu_front_left:cpu:ピグミィ L1 HP3 act focus / cpu_front_right:cpu:ピグミィ L1 HP3 act

### seed 994201 step 57 challenger-as-cpu

- turn/current: 6 / cpu (white_planner)
- selected: white_planner / `summon:cpu_card_047_3->cpu_front_right`
- white: `master:master_attack->monster:player_front_right` (354.1ms)
- white_planner: `summon:cpu_card_047_3->cpu_front_right` (207.9ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 召喚は11点差で見送り、攻撃は21点差で見送り
- planner reason: 前衛カードを前列右へ召喚 / ターンプラン探索: 返し込み最終盤面292点、次点と15点差
- board: player_front_left:player:ボムゾウ L2 HP5 act / player_front_right:player:ドノマンティス L1 HP3 act / cpu_front_left:cpu:ピグミィ L1 HP3 act / cpu_back_left:cpu:ピグミィ L1 HP3 act

### seed 994201 step 58 challenger-as-cpu

- turn/current: 6 / cpu (white_planner)
- selected: white_planner / `master:master_attack->monster:player_front_right`
- white: `attack:cpu_back_left:スパイクボール->monster:player_front_right` (428.9ms)
- white_planner: `master:master_attack->monster:player_front_right` (143.4ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: マスター特技は78点差で見送り、ためるは336点差で見送り
- planner reason: ストーンに余裕があり敵を削れるためマスターアタック / ターンプラン探索: 返し込み最終盤面205点、次点と7点差
- board: player_front_left:player:ボムゾウ L2 HP5 act / player_front_right:player:ドノマンティス L1 HP3 act / cpu_front_left:cpu:ピグミィ L1 HP3 act / cpu_front_right:cpu:真勇者ダイン L1 HP6 prep / cpu_back_left:cpu:ピグミィ L1 HP3 act

### seed 994201 step 60 challenger-as-cpu

- turn/current: 6 / cpu (white_planner)
- selected: white_planner / `attack:cpu_back_left:スパイクボール->monster:player_front_right`
- white: `attack:cpu_front_right:ダイン斬り->monster:player_front_right` (260.4ms)
- white_planner: `attack:cpu_back_left:スパイクボール->monster:player_front_right` (123ms)
- white reason: 敵モンスターを撃破できるため攻撃 / 見送り: 攻撃は42点差で見送り、ためるは89点差で見送り
- planner reason: 敵モンスターを撃破できるため攻撃 / ターンプラン探索: 返し込み最終盤面176点、次点と10点差
- board: player_front_left:player:ボムゾウ L2 HP5 act / player_front_right:player:ドノマンティス L1 HP1 act / cpu_front_left:cpu:ピグミィ L1 HP3 act / cpu_front_right:cpu:真勇者ダイン L1 HP6 act / cpu_back_left:cpu:ピグミィ L1 HP3 act

### seed 994200 step 5 challenger-as-player

- turn/current: 1 / cpu (white)
- selected: white / `summon:cpu_card_037_2->cpu_front_right`
- white: `summon:cpu_card_037_2->cpu_front_right` (109.4ms)
- white_planner: `summon:cpu_card_037_2->cpu_front_left` (58.6ms)
- white reason: 前衛カードを前列右へ召喚 / 見送り: 召喚は16点差で見送り、召喚は40点差で見送り
- planner reason: 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面11点、次点と3点差
- board: player_front_left:player:デスシープ L1 HP6 prep / player_front_right:player:ボムゾウ L1 HP6 prep / player_back_left:player:真勇者ダイン L1 HP6 prep / cpu_back_left:cpu:ピグミィ L1 HP3 prep

### seed 994200 step 8 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `summon:player_yanbaru_2->player_back_right`
- white: `focus:player_front_left` (748.2ms)
- white_planner: `summon:player_yanbaru_2->player_back_right` (221.1ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは3点差で見送り、召喚は8点差で見送り
- planner reason: 後衛カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面156点、次点と33点差
- board: player_front_left:player:デスシープ L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:ピグミィ L1 HP3 prep / cpu_back_right:cpu:ピグミィ L1 HP3 prep

### seed 994200 step 9 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `focus:player_back_left`
- white: `move:player_back_left->player_front_right` (918.2ms)
- white_planner: `focus:player_back_left` (182.7ms)
- white reason: 前衛カードを前列へ出して攻撃しやすくするため移動 / 見送り: ためるは78点差で見送り、ためるは81点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面60点、次点と0点差
- board: player_front_left:player:デスシープ L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 act / player_back_right:player:ヤンバル L1 HP3 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:ピグミィ L1 HP3 prep / cpu_back_right:cpu:ピグミィ L1 HP3 prep

### seed 994200 step 15 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `attack:cpu_front_right:attack->monster:player_front_right`
- white: `attack:cpu_front_right:attack->monster:player_front_right` (1588.8ms)
- white_planner: `move:cpu_front_left->cpu_back_left` (896.7ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: ためるは45点差で見送り、移動は53点差で見送り
- planner reason: 移動後に強い攻撃筋を作れるため移動 / ターンプラン探索: 返し込み最終盤面112点、次点と12点差
- board: player_front_left:player:デスシープ L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act shield focus / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 prep / cpu_front_left:cpu:ピグミィ L1 HP3 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 17 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `master:master_attack->monster:player_front_left`
- white: `master:master_attack->monster:player_front_left` (601.7ms)
- white_planner: `focus:cpu_back_left` (297ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は34点差で見送り、攻撃は34点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面20点、次点と0点差
- board: player_front_left:player:デスシープ L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act shield / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:ピグミィ L1 HP3 act / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 18 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `attack:cpu_back_left:スパイクボール->monster:player_front_left`
- white: `attack:cpu_back_left:スパイクボール->monster:player_front_left` (285.5ms)
- white_planner: `focus:cpu_back_left` (141.6ms)
- white reason: デスシープを削れるため攻撃 / 見送り: 攻撃は1点差で見送り、ためるは24点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面19点、次点と0点差
- board: player_front_left:player:デスシープ L1 HP4 act / player_front_right:player:ボムゾウ L1 HP6 act shield / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:ピグミィ L1 HP3 act / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 19 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `attack:cpu_back_right:スパイクボール->monster:player_front_left`
- white: `attack:cpu_back_right:スパイクボール->monster:player_front_left` (89.4ms)
- white_planner: `focus:cpu_back_right` (43.8ms)
- white reason: デスシープを削れるため攻撃 / 見送り: ためるは24点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面-40点、次点と49点差
- board: player_front_left:player:デスシープ L1 HP3 act / player_front_right:player:ボムゾウ L1 HP6 act shield / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:ピグミィ L1 HP3 act / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 22 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `focus:player_front_left` (741ms)
- white_planner: `end_turn` (112.4ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは53点差で見送り、攻撃は63点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面183点、次点と8点差
- board: player_front_left:player:デスシープ L1 HP2 act / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:ピグミィ L1 HP3 act / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 24 challenger-as-player

- turn/current: 3 / cpu (white)
- selected: white / `attack:cpu_back_right:スパイクボール->monster:player_front_left`
- white: `attack:cpu_back_right:スパイクボール->monster:player_front_left` (1653.9ms)
- white_planner: `move:cpu_front_left->cpu_back_left` (1291.1ms)
- white reason: デスシープを削れるため攻撃 / 見送り: 移動は92点差で見送り、攻撃は120点差で見送り
- planner reason: 後衛カードを後列へ戻して射程を活かすため移動 / ターンプラン探索: 返し込み最終盤面419点、次点と70点差
- board: player_front_left:player:デスシープ L1 HP2 act focus / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act focus / cpu_front_left:cpu:ピグミィ L1 HP3 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 25 challenger-as-player

- turn/current: 3 / cpu (white)
- selected: white / `attack:cpu_back_right:スパイクボール->monster:player_front_left`
- white: `attack:cpu_back_right:スパイクボール->monster:player_front_left` (1094.5ms)
- white_planner: `master:master_attack->monster:player_front_left` (929.2ms)
- white reason: デスシープを削れるため攻撃 / 見送り: 移動は134点差で見送り、マスター特技は324点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / ターンプラン探索: 返し込み最終盤面261点、次点と7点差
- board: player_front_left:player:デスシープ L1 HP2 act / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act focus / cpu_front_left:cpu:ピグミィ L1 HP3 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 30 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `attack:player_front_left:ダイン斬り->master:cpu`
- white: `magic:player_card_031_1->monster:cpu_back_left` (586ms)
- white_planner: `attack:player_front_left:ダイン斬り->master:cpu` (207.9ms)
- white reason: ワープで追加対象も有効にできるため使用 / 見送り: マジックは1点差で見送り、攻撃は11点差で見送り
- planner reason: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面265点、次点と1点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act focus / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act focus / cpu_front_left:cpu:ドノマンティス L1 HP5 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_left:cpu:ピグミィ L2 HP3 act / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 31 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `attack:player_back_right:wild_claw->monster:cpu_front_right`
- white: `magic:player_card_031_1->monster:cpu_back_left` (603.3ms)
- white_planner: `attack:player_back_right:wild_claw->monster:cpu_front_right` (318.8ms)
- white reason: ワープで追加対象も有効にできるため使用 / 見送り: マジックは1点差で見送り、攻撃は14点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面207点、次点と3点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_right:player:ヤンバル L1 HP3 act focus / cpu_front_left:cpu:ドノマンティス L1 HP5 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_left:cpu:ピグミィ L2 HP3 act / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 38 challenger-as-player

- turn/current: 4 / cpu (white)
- selected: white / `magic:cpu_card_093_1->master:cpu`
- white: `magic:cpu_card_093_1->master:cpu` (742ms)
- white_planner: `focus:cpu_front_left` (412.2ms)
- white reason: ローテーションで局面を改善できるため使用 / 見送り: ためるは1点差で見送り、移動は101点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面239点、次点と24点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ボムゾウ L2 HP5 act shield / player_back_left:player:デスシープ L1 HP6 prep / player_back_right:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act / cpu_front_right:cpu:ピグミィ L1 HP3 act / cpu_back_left:cpu:ドノマンティス L1 HP4 act

### seed 994200 step 40 challenger-as-player

- turn/current: 4 / cpu (white)
- selected: white / `focus:cpu_front_left`
- white: `focus:cpu_front_left` (638.5ms)
- white_planner: `summon:cpu_bomuzo_3->cpu_back_left` (304ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は23点差で見送り、ためるは41点差で見送り
- planner reason: カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面164点、次点と9点差
- board: player_front_left:player:デスシープ L1 HP6 prep / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ボムゾウ L2 HP5 act shield / cpu_front_left:cpu:ドノマンティス L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 44 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `focus:player_front_right`
- white: `attack:player_back_left:wild_claw->monster:cpu_front_right` (1365.3ms)
- white_planner: `focus:player_front_right` (1155.7ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は67点差で見送り、ためるは150点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面223点、次点と0点差
- board: player_front_left:player:デスシープ L1 HP6 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ボムゾウ L2 HP5 act / cpu_front_left:cpu:ドノマンティス L1 HP4 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_left:cpu:ボムゾウ L1 HP6 prep / cpu_back_right:cpu:ピグミィ L1 HP3 act focus

### seed 994200 step 45 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `focus:player_front_left`
- white: `attack:player_back_left:wild_claw->monster:cpu_front_left` (793.9ms)
- white_planner: `focus:player_front_left` (803.7ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は1点差で見送り、攻撃は218点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面211点、次点と7点差
- board: player_front_left:player:デスシープ L1 HP6 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ボムゾウ L2 HP5 act / cpu_front_left:cpu:ドノマンティス L1 HP4 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_left:cpu:ボムゾウ L1 HP6 prep / cpu_back_right:cpu:ピグミィ L1 HP3 act focus

### seed 994200 step 50 challenger-as-player

- turn/current: 5 / cpu (white)
- selected: white / `move:cpu_front_right->cpu_back_right`
- white: `move:cpu_front_right->cpu_back_right` (563.7ms)
- white_planner: `summon:cpu_card_047_1->cpu_back_right` (233.3ms)
- white reason: 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: 攻撃は28点差で見送り、移動は39点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面182点、次点と72点差
- board: player_front_left:player:デスシープ L1 HP6 act focus / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ボムゾウ L2 HP5 act / cpu_front_left:cpu:ドノマンティス L1 HP4 act focus / cpu_front_right:cpu:ピグミィ L1 HP3 act focus / cpu_back_left:cpu:ボムゾウ L1 HP6 act

### seed 994200 step 52 challenger-as-player

- turn/current: 5 / cpu (white)
- selected: white / `focus:cpu_back_left`
- white: `focus:cpu_back_left` (270.4ms)
- white_planner: `end_turn` (121.7ms)
- white reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / 見送り: ためるは12点差で見送り、攻撃は56点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面107点、次点と24点差
- board: player_front_left:player:デスシープ L1 HP6 act focus / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ボムゾウ L2 HP5 act / cpu_front_left:cpu:ドノマンティス L1 HP4 act focus / cpu_front_right:cpu:真勇者ダイン L1 HP6 prep / cpu_back_left:cpu:ボムゾウ L1 HP6 act / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 53 challenger-as-player

- turn/current: 5 / cpu (white)
- selected: white / `attack:cpu_front_left:attack->monster:player_front_left`
- white: `attack:cpu_front_left:attack->monster:player_front_left` (313ms)
- white_planner: `end_turn` (57ms)
- white reason: デスシープを削れるため攻撃 / 見送り: 攻撃は155点差で見送り、攻撃は197点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面82点、次点と11点差
- board: player_front_left:player:デスシープ L1 HP6 act focus / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ボムゾウ L2 HP5 act / cpu_front_left:cpu:ドノマンティス L1 HP4 act focus / cpu_front_right:cpu:真勇者ダイン L1 HP6 prep / cpu_back_left:cpu:ボムゾウ L1 HP6 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 56 challenger-as-player

- turn/current: 5 / cpu (white)
- selected: white / `attack:cpu_back_right:スパイクボール->monster:player_front_right`
- white: `attack:cpu_back_right:スパイクボール->monster:player_front_right` (83.1ms)
- white_planner: `focus:cpu_back_right` (39.7ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: ためるは125点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面92点、次点と17点差
- board: player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ボムゾウ L2 HP5 act / cpu_front_left:cpu:ドノマンティス L1 HP4 act / cpu_front_right:cpu:真勇者ダイン L1 HP6 prep / cpu_back_left:cpu:ボムゾウ L1 HP6 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 59 challenger-as-player

- turn/current: 6 / player (white_planner)
- selected: white_planner / `master:master_attack->monster:cpu_front_left`
- white: `move:player_front_left->player_back_left` (486.4ms)
- white_planner: `master:master_attack->monster:cpu_front_left` (380.7ms)
- white reason: 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: ためるは261点差で見送り、ためるは277点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / ターンプラン探索: 返し込み最終盤面185点、次点と19点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ボムゾウ L2 HP5 act / cpu_front_left:cpu:ドノマンティス L1 HP2 act / cpu_front_right:cpu:真勇者ダイン L1 HP6 prep / cpu_back_left:cpu:ボムゾウ L1 HP6 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 60 challenger-as-player

- turn/current: 6 / player (white_planner)
- selected: white_planner / `summon:player_card_037_3->player_back_left`
- white: `move:player_front_left->player_back_left` (316.7ms)
- white_planner: `summon:player_card_037_3->player_back_left` (108.6ms)
- white reason: 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: ためるは29点差で見送り、ためるは48点差で見送り
- planner reason: ドノマンティスを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面84点、次点と13点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ボムゾウ L2 HP5 act / cpu_front_right:cpu:真勇者ダイン L1 HP6 prep / cpu_back_left:cpu:ボムゾウ L1 HP6 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 62 challenger-as-player

- turn/current: 6 / player (white_planner)
- selected: white_planner / `focus:player_front_left`
- white: `attack:player_front_left:wild_claw->monster:cpu_back_right` (114.9ms)
- white_planner: `focus:player_front_left` (32.5ms)
- white reason: ピグミィを削れるため攻撃 / 見送り: ためるは11点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面-1点、次点と48点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ドノマンティス L1 HP5 prep / player_back_right:player:ボムゾウ L2 HP5 act / cpu_front_right:cpu:真勇者ダイン L1 HP6 prep / cpu_back_left:cpu:ボムゾウ L1 HP6 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994200 step 65 challenger-as-player

- turn/current: 6 / cpu (white)
- selected: white / `attack:cpu_back_right:スパイクボール->monster:player_front_right`
- white: `attack:cpu_back_right:スパイクボール->monster:player_front_right` (2074.8ms)
- white_planner: `attack:cpu_front_left:self_bomb->monster:player_front_left` (935.1ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: 攻撃は42点差で見送り、ためるは123点差で見送り
- planner reason: ヤンバルを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面251点、次点と83点差
- board: player_front_left:player:ヤンバル L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ドノマンティス L1 HP5 prep / player_back_right:player:ボムゾウ L2 HP5 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act focus / cpu_front_right:cpu:真勇者ダイン L1 HP6 act / cpu_back_left:cpu:ボムゾウ L1 HP6 prep / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994201 step 1 challenger-as-player

- turn/current: 1 / player (white_planner)
- selected: white_planner / `summon:player_card_037_2->player_front_left`
- white: `summon:player_card_037_2->player_front_right` (132.4ms)
- white_planner: `summon:player_card_037_2->player_front_left` (49.3ms)
- white reason: 前衛カードを前列右へ召喚 / 見送り: 召喚は16点差で見送り、召喚は40点差で見送り
- planner reason: 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面194点、次点と3点差
- board: player_back_left:player:ピグミィ L1 HP3 prep

### seed 994201 step 8 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `move:player_front_right->player_back_right`
- white: `move:player_front_right->player_back_left` (1600.7ms)
- white_planner: `move:player_front_right->player_back_right` (457.1ms)
- white reason: 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: ためるは222点差で見送り、ためるは254点差で見送り
- planner reason: 後衛カードを後列へ戻して射程を活かすため移動 / ターンプラン探索: 返し込み最終盤面13点、次点と3点差
- board: player_front_left:player:ドノマンティス L1 HP5 act / player_front_right:player:ピグミィ L1 HP3 act / player_back_left:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ボムゾウ L1 HP6 prep / cpu_back_left:cpu:ピグミィ L1 HP3 prep

### seed 994201 step 9 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `focus:player_back_left`
- white: `focus:player_front_left` (605.3ms)
- white_planner: `focus:player_back_left` (194.2ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは37点差で見送り、ためるは58点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面-6点、次点と6点差
- board: player_front_left:player:ドノマンティス L1 HP5 act / player_back_left:player:ピグミィ L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ボムゾウ L1 HP6 prep / cpu_back_left:cpu:ピグミィ L1 HP3 prep

### seed 994201 step 15 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `end_turn`
- white: `end_turn` (513.3ms)
- white_planner: `focus:cpu_back_left` (205.6ms)
- white reason: 有効な行動がないためターン終了 / 見送り: 攻撃は6点差で見送り、ためるは17点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面223点、次点と1点差
- board: player_front_left:player:ドノマンティス L1 HP5 act shield focus / player_back_left:player:ピグミィ L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:ピグミィ L1 HP3 act / cpu_back_right:cpu:ポリスピナー L1 HP3 prep

### seed 994201 step 16 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `magic:player_card_093_1->master:player`
- white: `attack:player_front_right:attack->monster:cpu_front_right` (931.5ms)
- white_planner: `magic:player_card_093_1->master:player` (361.2ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は6点差で見送り、攻撃は6点差で見送り
- planner reason: ローテーションで局面を改善できるため使用 / ターンプラン探索: 返し込み最終盤面149点、次点と1点差
- board: player_front_left:player:ドノマンティス L1 HP5 act focus / player_front_right:player:ピグミィ L1 HP3 act focus / player_back_left:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act focus / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 act focus / cpu_back_right:cpu:ポリスピナー L1 HP3 prep

### seed 994201 step 18 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `move:player_front_left->player_back_left`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_right` (608.7ms)
- white_planner: `move:player_front_left->player_back_left` (54.3ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は6点差で見送り、移動は35点差で見送り
- planner reason: 後衛カードを後列へ戻して射程を活かすため移動 / ターンプラン探索: 返し込み最終盤面107点、次点と33点差
- board: player_front_left:player:ピグミィ L1 HP3 act focus / player_front_right:player:ドノマンティス L1 HP5 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ピグミィ L1 HP3 act focus / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:ポリスピナー L1 HP3 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 act focus

### seed 994201 step 19 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_right` (383.4ms)
- white_planner: `end_turn` (23.5ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: ためるは127点差で見送り、ためるは129点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面95点
- board: player_front_right:player:ドノマンティス L1 HP5 act focus / player_back_left:player:ピグミィ L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ピグミィ L1 HP3 act focus / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:ポリスピナー L1 HP3 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 act focus

### seed 994201 step 21 challenger-as-player

- turn/current: 3 / cpu (white)
- selected: white / `move:cpu_front_left->cpu_back_left`
- white: `move:cpu_front_left->cpu_back_left` (530.5ms)
- white_planner: `focus:cpu_back_left` (224.7ms)
- white reason: 移動後に強い攻撃筋を作れるため移動 / 見送り: 移動は18点差で見送り、移動は18点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面238点、次点と21点差
- board: player_front_right:player:ドノマンティス L1 HP5 act focus / player_back_left:player:ピグミィ L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ピグミィ L1 HP3 act focus / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_left:cpu:ポリスピナー L1 HP3 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act focus

### seed 994201 step 22 challenger-as-player

- turn/current: 3 / cpu (white)
- selected: white / `attack:cpu_back_right:storm_bomb->monster:player_front_right`
- white: `attack:cpu_back_right:storm_bomb->monster:player_front_right` (403.5ms)
- white_planner: `magic:cpu_card_031_1->monster:player_front_right` (166.2ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: マジックは1点差で見送り、マジックは1点差で見送り
- planner reason: ワープで追加対象も有効にできるため使用 / ターンプラン探索: 返し込み最終盤面175点、次点と0点差
- board: player_front_right:player:ドノマンティス L1 HP5 act focus / player_back_left:player:ピグミィ L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ポリスピナー L1 HP3 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act focus

### seed 994201 step 24 challenger-as-player

- turn/current: 3 / cpu (white)
- selected: white / `master:shield->monster:cpu_back_left`
- white: `master:shield->monster:cpu_back_left` (226.5ms)
- white_planner: `master:shield->monster:cpu_front_left` (90.7ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は3点差で見送り、マスター特技は4点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面69点、次点と6点差
- board: player_front_right:player:ピグミィ L1 HP3 act focus / player_back_left:player:ピグミィ L1 HP3 act focus / player_back_right:player:ドノマンティス L1 HP5 act / cpu_front_left:cpu:ポリスピナー L1 HP3 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994201 step 27 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `summon:player_card_037_1->player_front_right`
- white: `attack:player_back_left:スパイクボール->monster:cpu_front_left` (1136.6ms)
- white_planner: `summon:player_card_037_1->player_front_right` (647.6ms)
- white reason: ポリスピナーを削れるため攻撃 / 見送り: 攻撃は20点差で見送り、攻撃は38点差で見送り
- planner reason: 前衛カードを前列右へ召喚 / ターンプラン探索: 返し込み最終盤面344点、次点と7点差
- board: player_front_left:player:ピグミィ L1 HP3 act focus / player_back_left:player:ピグミィ L1 HP3 act / player_back_right:player:ドノマンティス L1 HP5 act / cpu_front_left:cpu:ポリスピナー L1 HP3 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 act shield / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994201 step 28 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `attack:player_front_left:attack->monster:cpu_front_left`
- white: `attack:player_back_left:スパイクボール->monster:cpu_front_left` (1197.8ms)
- white_planner: `attack:player_front_left:attack->monster:cpu_front_left` (867.4ms)
- white reason: ポリスピナーを削れるため攻撃 / 見送り: 攻撃は18点差で見送り、攻撃は23点差で見送り
- planner reason: ポリスピナーを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面269点、次点と16点差
- board: player_front_left:player:ピグミィ L1 HP3 act focus / player_front_right:player:ドノマンティス L1 HP5 prep / player_back_left:player:ピグミィ L1 HP3 act / player_back_right:player:ドノマンティス L1 HP5 act / cpu_front_left:cpu:ポリスピナー L1 HP3 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 act shield / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994201 step 30 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:player_back_left:スパイクボール->monster:cpu_front_right` (463ms)
- white_planner: `end_turn` (278.3ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は10点差で見送り、移動は49点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面165点、次点と1点差
- board: player_front_left:player:ピグミィ L1 HP3 act / player_front_right:player:ドノマンティス L1 HP5 prep / player_back_left:player:ピグミィ L1 HP3 act / player_back_right:player:ドノマンティス L1 HP5 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 act shield / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994201 step 31 challenger-as-player

- turn/current: 4 / cpu (white)
- selected: white / `summon:cpu_card_051_1->cpu_back_left`
- white: `summon:cpu_card_051_1->cpu_back_left` (474.2ms)
- white_planner: `attack:cpu_front_right:self_bomb->master:player` (596.5ms)
- white reason: 後衛カードを後列左へ召喚 / 見送り: 移動は35点差で見送り、移動は53点差で見送り
- planner reason: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面241点、次点と13点差
- board: player_front_left:player:ピグミィ L1 HP3 act focus / player_front_right:player:ドノマンティス L1 HP5 prep / player_back_left:player:ピグミィ L1 HP3 act focus / player_back_right:player:ドノマンティス L1 HP5 act focus / cpu_front_left:cpu:ピグミィ L1 HP3 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994201 step 32 challenger-as-player

- turn/current: 4 / cpu (white)
- selected: white / `attack:cpu_front_left:スパイクボール->monster:player_back_left`
- white: `attack:cpu_front_left:スパイクボール->monster:player_back_left` (615.4ms)
- white_planner: `attack:cpu_front_right:self_bomb->master:player` (550.1ms)
- white reason: ピグミィを削れるため攻撃 / 見送り: 移動は61点差で見送り、移動は79点差で見送り
- planner reason: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面171点、次点と22点差
- board: player_front_left:player:ピグミィ L1 HP3 act focus / player_front_right:player:ドノマンティス L1 HP5 prep / player_back_left:player:ピグミィ L1 HP3 act focus / player_back_right:player:ドノマンティス L1 HP5 act focus / cpu_front_left:cpu:ピグミィ L1 HP3 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994201 step 33 challenger-as-player

- turn/current: 4 / cpu (white)
- selected: white / `move:cpu_front_left->cpu_back_right`
- white: `move:cpu_front_left->cpu_back_right` (752.8ms)
- white_planner: `attack:cpu_front_right:self_bomb->master:player` (287.3ms)
- white reason: 移動後に強い攻撃筋を作れるため移動 / 見送り: 移動は18点差で見送り、攻撃は78点差で見送り
- planner reason: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面160点、次点と96点差
- board: player_front_left:player:ピグミィ L1 HP3 act focus / player_front_right:player:ドノマンティス L1 HP5 prep / player_back_left:player:ピグミィ L1 HP3 act / player_back_right:player:ドノマンティス L1 HP5 act focus / cpu_front_left:cpu:ピグミィ L1 HP3 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_left:cpu:ピグミィ L1 HP3 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994201 step 41 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `attack:player_front_left:スパイクボール->monster:cpu_back_right`
- white: `move:player_front_left->player_back_right` (792.8ms)
- white_planner: `attack:player_front_left:スパイクボール->monster:cpu_back_right` (488.4ms)
- white reason: 移動後に強い攻撃筋を作れるため移動 / 見送り: 移動は18点差で見送り、攻撃は20点差で見送り
- planner reason: ピグミィを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面-7点、次点と65点差
- board: player_front_left:player:ピグミィ L1 HP3 act focus / player_front_right:player:ドノマンティス L1 HP5 act / player_back_left:player:ピグミィ L2 HP3 act / player_back_right:player:ドノマンティス L1 HP5 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act shield / cpu_back_left:cpu:ピグミィ L1 HP3 prep / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994201 step 42 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `focus:player_front_left`
- white: `move:player_front_left->player_back_right` (945.1ms)
- white_planner: `focus:player_front_left` (441.8ms)
- white reason: 移動後に強い攻撃筋を作れるため移動 / 見送り: 移動は18点差で見送り、攻撃は91点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面9点、次点と52点差
- board: player_front_left:player:ピグミィ L1 HP3 act / player_front_right:player:ドノマンティス L1 HP5 act / player_back_left:player:ピグミィ L2 HP3 act / player_back_right:player:ドノマンティス L1 HP5 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act shield / cpu_back_left:cpu:ピグミィ L1 HP3 prep / cpu_back_right:cpu:ピグミィ L1 HP2 act

### seed 994201 step 45 challenger-as-player

- turn/current: 5 / cpu (white)
- selected: white / `attack:cpu_front_left:self_bomb->monster:player_front_left`
- white: `attack:cpu_front_left:self_bomb->monster:player_front_left` (2784.5ms)
- white_planner: `focus:cpu_front_left` (1367.4ms)
- white reason: ピグミィを削れるため攻撃 / 見送り: ためるは102点差で見送り、移動は108点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面367点、次点と18点差
- board: player_front_left:player:ピグミィ L1 HP3 act focus / player_front_right:player:ドノマンティス L1 HP5 act / player_back_left:player:ピグミィ L2 HP3 act shield / player_back_right:player:ドノマンティス L1 HP5 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ピグミィ L1 HP2 act / cpu_back_left:cpu:ピグミィ L1 HP3 act

### seed 994201 step 46 challenger-as-player

- turn/current: 5 / cpu (white)
- selected: white / `attack:cpu_back_left:スパイクボール->monster:player_front_left`
- white: `attack:cpu_back_left:スパイクボール->monster:player_front_left` (2358.5ms)
- white_planner: `summon:cpu_card_051_3->cpu_back_right` (1174.3ms)
- white reason: ピグミィを削れるため攻撃 / 見送り: 攻撃は92点差で見送り、召喚は129点差で見送り
- planner reason: 後衛カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面350点、次点と13点差
- board: player_front_left:player:ピグミィ L1 HP2 act / player_front_right:player:ドノマンティス L1 HP5 act / player_back_left:player:ピグミィ L2 HP3 act shield / player_back_right:player:ドノマンティス L1 HP5 act focus / cpu_front_left:cpu:ボムゾウ L1 HP4 act / cpu_front_right:cpu:ピグミィ L1 HP2 act / cpu_back_left:cpu:ピグミィ L1 HP3 act

### seed 994201 step 57 challenger-as-player

- turn/current: 6 / cpu (white)
- selected: white / `attack:cpu_front_right:スパイクボール->monster:player_back_left`
- white: `attack:cpu_front_right:スパイクボール->monster:player_back_left` (1546.6ms)
- white_planner: `summon:cpu_card_047_3->cpu_back_right` (819.3ms)
- white reason: ピグミィを削れるため攻撃 / 見送り: 召喚は3点差で見送り、召喚は45点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面291点、次点と5点差
- board: player_front_left:player:真勇者ダイン L1 HP6 prep / player_front_right:player:ドノマンティス L1 HP5 act / player_back_left:player:ピグミィ L2 HP3 act focus / player_back_right:player:ドノマンティス L1 HP5 act focus / cpu_front_left:cpu:ボムゾウ L1 HP4 act focus / cpu_front_right:cpu:ピグミィ L1 HP3 act / cpu_back_left:cpu:ピグミィ L1 HP3 act focus

### seed 994201 step 58 challenger-as-player

- turn/current: 6 / cpu (white)
- selected: white / `magic:cpu_card_093_1->master:cpu`
- white: `magic:cpu_card_093_1->master:cpu` (791.3ms)
- white_planner: `summon:cpu_card_047_3->cpu_back_right` (336.3ms)
- white reason: ローテーションで局面を改善できるため使用 / 見送り: 召喚は88点差で見送り、召喚は130点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面305点、次点と7点差
- board: player_front_left:player:真勇者ダイン L1 HP6 prep / player_front_right:player:ドノマンティス L1 HP5 act / player_back_left:player:ピグミィ L2 HP3 act / player_back_right:player:ドノマンティス L1 HP5 act focus / cpu_front_left:cpu:ボムゾウ L1 HP4 act focus / cpu_front_right:cpu:ピグミィ L1 HP3 act / cpu_back_left:cpu:ピグミィ L1 HP3 act focus

### seed 994201 step 61 challenger-as-player

- turn/current: 6 / cpu (white)
- selected: white / `move:cpu_front_left->cpu_back_left`
- white: `move:cpu_front_left->cpu_back_left` (365.1ms)
- white_planner: `summon:cpu_card_047_3->cpu_back_left` (120.4ms)
- white reason: 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: ためるは94点差で見送り、召喚は100点差で見送り
- planner reason: カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面153点、次点と17点差
- board: player_front_right:player:真勇者ダイン L1 HP6 prep / player_back_left:player:ドノマンティス L1 HP5 act focus / player_back_right:player:ドノマンティス L1 HP5 act / cpu_front_left:cpu:ピグミィ L2 HP3 act / cpu_front_right:cpu:ボムゾウ L1 HP4 act focus / cpu_back_right:cpu:ピグミィ L1 HP3 act

### seed 994201 step 71 challenger-as-player

- turn/current: 7 / cpu (white)
- selected: white / `attack:cpu_front_left:ダイン斬り->monster:player_front_left`
- white: `attack:cpu_front_left:ダイン斬り->monster:player_front_left` (849.2ms)
- white_planner: `attack:cpu_back_left:スパイクボール->monster:player_back_right` (51.9ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は71点差で見送り、ためるは269点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面158点、次点と61点差
- board: player_front_left:player:ドノマンティス L1 HP5 act / player_front_right:player:真勇者ダイン L1 HP6 act shield focus / player_back_left:player:ボムゾウ L1 HP6 prep / player_back_right:player:ドノマンティス L1 HP5 act focus / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:ボムゾウ L1 HP4 act focus / cpu_back_left:cpu:ピグミィ L2 HP3 act / cpu_back_right:cpu:ピグミィ L1 HP3 act focus

## Reading

- white_planner average decision 246ms, max 1492.9ms.
- white_planner diverged from white 138 times; inspect samples before changing search depth.
- Some games hit the step/turn cap. Treat W-L-D as incomplete and use this run mainly for timing and decision-diff inspection.

## Next Steps

- Review decision diff samples and classify good/bad planner divergences.
- If planner average decision time stays practical, run both directions with count 3-5.
- Try opponentTerminalPlanDepth 2 as a v2 candidate.
