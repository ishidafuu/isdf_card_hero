# White Planner Phase 2

生成: 2026-07-03T13:59:31.289Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994120-994120
directions: challenger-as-cpu, challenger-as-player

## Summary

- games: 2
- wins: -
- draws/undecided: 2
- issues: 2
- decision diffs: 25
- planner-selected diffs: 14

## Timing

| profile | decisions | avg ms | max ms | total ms |
| --- | ---: | ---: | ---: | ---: |
| white | 117 | 323.4ms | 1635.4ms | 37840.6ms |
| white_planner | 117 | 299.8ms | 1777.6ms | 35080.6ms |

## Games

| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| challenger-as-cpu | 994120 | P white / C white_planner | draw | 60 | 6 | P9/C10 | winner was not decided within 60 auto steps | 12 | 5 |
| challenger-as-player | 994120 | P white_planner / C white | draw | 60 | 7 | P10/C10 | winner was not decided within 60 auto steps | 13 | 9 |

## Decision Diff Samples

### seed 994120 step 8 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `focus:player_front_left`
- white: `focus:player_front_left` (594.9ms)
- white_planner: `focus:player_front_right` (514.7ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは4点差で見送り、移動は8点差で見送り
- planner reason: 有効攻撃がないためためる / 見送り: 移動は11点差で見送り、召喚は36点差で見送り
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 15 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `master:master_attack->monster:player_front_left`
- white: `attack:cpu_front_right:attack->monster:player_front_right` (781.4ms)
- white_planner: `master:master_attack->monster:player_front_left` (952.8ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: マスター特技は125点差で見送り、召喚は207点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / ターンプラン探索: 返し込み最終盤面151点、次点と74点差
- board: player_front_left:player:ヤンバル L1 HP2 act / player_front_right:player:真勇者ダイン L1 HP6 act shield focus / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 16 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `focus:cpu_front_right`
- white: `attack:cpu_front_right:attack->monster:player_front_right` (193.3ms)
- white_planner: `focus:cpu_front_right` (133.4ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: ためるは46点差で見送り、ためるは98点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面62点、次点と1点差
- board: player_front_right:player:真勇者ダイン L1 HP6 act shield focus / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 19 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `attack:player_back_right:スパイクボール->monster:cpu_front_right`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_right` (241ms)
- white_planner: `attack:player_front_left:attack->monster:cpu_front_left` (494.3ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は8点差で見送り、召喚は47点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面321点、次点と32点差
- board: player_front_left:player:ポリスピナー L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_left:cpu:デスシープ L1 HP6 act focus

### seed 994120 step 20 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `attack:player_front_right:ダイン斬り->monster:cpu_front_right`
- white: `attack:player_front_right:ダイン斬り->monster:cpu_front_right` (221.3ms)
- white_planner: `attack:player_front_left:attack->monster:cpu_front_left` (529.5ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は9点差で見送り、召喚は48点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面321点、次点と32点差
- board: player_front_left:player:ポリスピナー L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act focus

### seed 994120 step 21 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `master:master_attack->monster:cpu_front_right`
- white: `master:master_attack->monster:cpu_front_right` (237ms)
- white_planner: `attack:player_front_left:attack->monster:cpu_front_left` (610ms)
- white reason: マスターアタックで敵モンスターを撃破できるため使用 / 見送り: 攻撃は19点差で見送り、召喚は243点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / 見送り: マスター特技は36点差で見送り、召喚は170点差で見送り
- board: player_front_left:player:ポリスピナー L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP2 act / cpu_back_left:cpu:デスシープ L1 HP6 act focus

### seed 994120 step 39 challenger-as-cpu

- turn/current: 4 / cpu (white_planner)
- selected: white_planner / `attack:cpu_front_left:attack->master:player`
- white: `attack:cpu_front_right:self_bomb->monster:player_front_right` (1393.4ms)
- white_planner: `attack:cpu_front_left:attack->master:player` (1190.4ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: 攻撃は7点差で見送り、移動は154点差で見送り
- planner reason: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面183点、次点と90点差
- board: player_front_left:player:ボムゾウ L1 HP6 prep / player_front_right:player:真勇者ダイン L1 HP6 act shield focus / player_back_left:player:ドノマンティス L1 HP5 prep / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:デスシープ L2 HP5 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act / cpu_back_right:cpu:ポリスピナー L1 HP3 act

### seed 994120 step 40 challenger-as-cpu

- turn/current: 4 / cpu (white_planner)
- selected: white_planner / `focus:cpu_front_right`
- white: `move:cpu_back_left->cpu_front_right` (830.1ms)
- white_planner: `focus:cpu_front_right` (723.8ms)
- white reason: 前衛カードを前列へ出して攻撃しやすくするため移動 / 見送り: 移動は20点差で見送り、攻撃は47点差で見送り
- planner reason: 有効攻撃がないためためる / 見送り: 攻撃は37点差で見送り、ためるは39点差で見送り
- board: player_front_left:player:ボムゾウ L1 HP6 prep / player_front_right:player:真勇者ダイン L1 HP6 act shield focus / player_back_left:player:ドノマンティス L1 HP5 prep / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:デスシープ L2 HP5 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act / cpu_back_right:cpu:ポリスピナー L1 HP3 act

### seed 994120 step 45 challenger-as-cpu

- turn/current: 5 / player (white)
- selected: white / `end_turn`
- white: `end_turn` (587.6ms)
- white_planner: `attack:player_back_right:スパイクボール->monster:cpu_front_right` (355.8ms)
- white reason: 有効な行動がないためターン終了 / 見送り: ためるは14点差で見送り、ためるは14点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面222点、次点と28点差
- board: player_front_left:player:ボムゾウ L1 HP6 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ドノマンティス L1 HP5 act / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:デスシープ L2 HP5 act shield / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ポリスピナー L1 HP3 act focus

### seed 994120 step 46 challenger-as-cpu

- turn/current: 5 / cpu (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:cpu_front_left:attack->monster:player_front_left` (572.7ms)
- white_planner: `end_turn` (378.3ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は24点差で見送り、ためるは27点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面226点、次点と66点差
- board: player_front_left:player:ボムゾウ L1 HP6 act focus / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ドノマンティス L1 HP5 act focus / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:デスシープ L2 HP5 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ポリスピナー L1 HP3 act focus

### seed 994120 step 51 challenger-as-cpu

- turn/current: 6 / player (white)
- selected: white / `attack:player_back_right:スパイクボール->monster:cpu_front_right`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_right` (695.4ms)
- white_planner: `end_turn` (466.8ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: ためるは33点差で見送り、攻撃は102点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面124点、次点と36点差
- board: player_front_left:player:ボムゾウ L2 HP5 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ドノマンティス L1 HP5 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ポリスピナー L1 HP3 act focus

### seed 994120 step 52 challenger-as-cpu

- turn/current: 6 / player (white)
- selected: white / `master:master_attack->monster:cpu_front_right`
- white: `master:master_attack->monster:cpu_front_right` (574.5ms)
- white_planner: `end_turn` (343ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は57点差で見送り、攻撃は65点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面55点
- board: player_front_left:player:ボムゾウ L2 HP5 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ドノマンティス L1 HP5 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ポリスピナー L1 HP3 act focus

### seed 994120 step 8 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `focus:player_front_right`
- white: `focus:player_front_left` (579ms)
- white_planner: `focus:player_front_right` (516.4ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは4点差で見送り、移動は8点差で見送り
- planner reason: 有効攻撃がないためためる / 見送り: 移動は11点差で見送り、召喚は36点差で見送り
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 9 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `move:player_front_left->player_back_left`
- white: `move:player_front_left->player_back_right` (375.2ms)
- white_planner: `move:player_front_left->player_back_left` (304.8ms)
- white reason: 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: 移動は21点差で見送り、ためるは64点差で見送り
- planner reason: 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: 召喚は29点差で見送り、ためるは43点差で見送り
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 22 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:player_back_left:スパイクボール->monster:cpu_front_right` (263.7ms)
- white_planner: `end_turn` (191ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は52点差で見送り、ためるは192点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面112点
- board: player_front_left:player:ドノマンティス L1 HP5 prep / player_front_right:player:ポリスピナー L1 HP3 act focus / player_back_left:player:ピグミィ L1 HP3 act / player_back_right:player:真勇者ダイン L1 HP6 act focus / cpu_front_left:cpu:デスシープ L1 HP6 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_right:cpu:ドノマンティス L1 HP5 act focus

### seed 994120 step 28 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `attack:player_front_right:ダイン斬り->monster:cpu_front_right`
- white: `attack:player_back_left:スパイクボール->monster:cpu_front_left` (167.7ms)
- white_planner: `attack:player_front_right:ダイン斬り->monster:cpu_front_right` (255.7ms)
- white reason: デスシープを削れるため攻撃 / 見送り: 攻撃は31点差で見送り、攻撃は52点差で見送り
- planner reason: 敵モンスターを撃破できるため攻撃 / ターンプラン探索: 返し込み最終盤面108点、次点と1点差
- board: player_front_left:player:ドノマンティス L1 HP5 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:デスシープ L1 HP6 act focus / cpu_front_right:cpu:ボムゾウ L1 HP3 act / cpu_back_right:cpu:ドノマンティス L1 HP5 act focus

### seed 994120 step 31 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `summon:player_bomuzo_1->player_back_right`
- white: `attack:player_back_left:スパイクボール->monster:cpu_front_left` (139.9ms)
- white_planner: `summon:player_bomuzo_1->player_back_right` (125.2ms)
- white reason: デスシープを削れるため攻撃 / 見送り: 召喚は23点差で見送り、ためるは62点差で見送り
- planner reason: ボムゾウを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面170点、次点と14点差
- board: player_front_left:player:ドノマンティス L1 HP5 act focus / player_front_right:player:真勇者ダイン L2 HP6 act / player_back_left:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ドノマンティス L1 HP5 act focus

### seed 994120 step 32 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `focus:player_back_left`
- white: `attack:player_back_left:スパイクボール->monster:cpu_front_left` (105.3ms)
- white_planner: `focus:player_back_left` (93.6ms)
- white reason: デスシープを削れるため攻撃 / 見送り: ためるは48点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面96点、次点と29点差
- board: player_front_left:player:ドノマンティス L1 HP5 act focus / player_front_right:player:真勇者ダイン L2 HP6 act / player_back_left:player:ピグミィ L1 HP3 act / player_back_right:player:ボムゾウ L1 HP6 prep / cpu_front_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ドノマンティス L1 HP5 act focus

### seed 994120 step 37 challenger-as-player

- turn/current: 4 / cpu (white)
- selected: white / `attack:cpu_front_left:attack->monster:player_front_left`
- white: `attack:cpu_front_left:attack->monster:player_front_left` (262.3ms)
- white_planner: `end_turn` (118.4ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は83点差で見送り、攻撃は205点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面12点
- board: player_front_left:player:ドノマンティス L1 HP5 act shield focus / player_front_right:player:真勇者ダイン L2 HP6 act / player_back_left:player:ピグミィ L1 HP3 act focus / player_back_right:player:ボムゾウ L1 HP6 prep / cpu_front_left:cpu:デスシープ L1 HP6 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 38 challenger-as-player

- turn/current: 4 / cpu (white)
- selected: white / `attack:cpu_front_right:attack->monster:player_front_right`
- white: `attack:cpu_front_right:attack->monster:player_front_right` (365.2ms)
- white_planner: `end_turn` (155.2ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: 攻撃は166点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-51点
- board: player_front_left:player:ドノマンティス L1 HP4 act shield / player_front_right:player:真勇者ダイン L2 HP6 act / player_back_left:player:ピグミィ L1 HP3 act focus / player_back_right:player:ボムゾウ L1 HP6 prep / cpu_front_left:cpu:デスシープ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 41 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:player_front_left:attack->monster:cpu_front_left` (599.9ms)
- white_planner: `end_turn` (317.7ms)
- white reason: デスシープを削れるため攻撃 / 見送り: ためるは159点差で見送り、ためるは159点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面96点
- board: player_front_left:player:ドノマンティス L1 HP4 act / player_front_right:player:真勇者ダイン L2 HP3 act / player_back_left:player:ピグミィ L1 HP3 act focus / player_back_right:player:ボムゾウ L1 HP6 act / cpu_front_left:cpu:デスシープ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 45 challenger-as-player

- turn/current: 5 / cpu (white)
- selected: white / `attack:cpu_back_right:storm_bomb->monster:player_front_left`
- white: `attack:cpu_back_right:storm_bomb->monster:player_front_left` (239.2ms)
- white_planner: `focus:cpu_back_left` (157.1ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: ためるは59点差で見送り、ためるは81点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面174点、次点と0点差
- board: player_front_left:player:ドノマンティス L1 HP4 act focus / player_back_left:player:ピグミィ L1 HP3 act focus / player_back_right:player:ボムゾウ L1 HP6 act focus / cpu_front_left:cpu:デスシープ L1 HP6 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 48 challenger-as-player

- turn/current: 6 / player (white_planner)
- selected: white_planner / `attack:player_front_right:self_bomb->monster:cpu_front_right`
- white: `attack:player_back_left:スパイクボール->monster:cpu_front_left` (775ms)
- white_planner: `attack:player_front_right:self_bomb->monster:cpu_front_right` (1074.8ms)
- white reason: デスシープを削れるため攻撃 / 見送り: 攻撃は20点差で見送り、召喚は38点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面203点、次点と12点差
- board: player_front_left:player:ドノマンティス L1 HP4 act / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:デスシープ L1 HP6 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 49 challenger-as-player

- turn/current: 6 / player (white_planner)
- selected: white_planner / `master:master_attack->monster:cpu_front_right`
- white: `focus:player_front_left` (624.6ms)
- white_planner: `master:master_attack->monster:cpu_front_right` (629.6ms)
- white reason: 有効攻撃がないためためる / 見送り: マスター特技は11点差で見送り、召喚は47点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / ターンプラン探索: 返し込み最終盤面236点、次点と62点差
- board: player_front_left:player:ドノマンティス L1 HP4 act / player_front_right:player:ボムゾウ L1 HP4 act / player_back_left:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:デスシープ L1 HP6 act focus / cpu_front_right:cpu:ドノマンティス L1 HP2 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 55 challenger-as-player

- turn/current: 6 / cpu (white)
- selected: white / `focus:cpu_front_left`
- white: `focus:cpu_front_left` (823.6ms)
- white_planner: `attack:cpu_front_right:self_bomb->monster:player_front_right` (1447.6ms)
- white reason: 有効攻撃がないためためる / 見送り: 攻撃は2点差で見送り、召喚は134点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / 見送り: ためるは41点差で見送り、召喚は151点差で見送り
- board: player_front_left:player:ドノマンティス L1 HP4 act focus / player_front_right:player:ボムゾウ L1 HP4 act / player_back_left:player:ピグミィ L1 HP3 act focus / player_back_right:player:ドノマンティス L1 HP5 prep / cpu_front_left:cpu:デスシープ L1 HP6 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 act focus

## Reading

- white_planner average decision 299.8ms, max 1777.6ms.
- white_planner diverged from white 25 times; inspect samples before changing search depth.
- Some games hit the step/turn cap. Treat W-L-D as incomplete and use this run mainly for timing and decision-diff inspection.

## Next Steps

- Review decision diff samples and classify good/bad planner divergences.
- If planner average decision time stays practical, run both directions with count 3-5.
- Try opponentTerminalPlanDepth 2 as a v2 candidate.
