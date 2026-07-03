# White Planner Phase 2

生成: 2026-07-03T14:45:12.350Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994300-994300
directions: challenger-as-player

## Summary

- games: 1
- wins: white 1
- draws/undecided: 0
- issues: 0
- decision diffs: 26
- planner-selected diffs: 20

## Timing

| profile | decisions | avg ms | max ms | total ms |
| --- | ---: | ---: | ---: | ---: |
| white | 142 | 280ms | 1354.3ms | 39758.6ms |
| white_planner | 142 | 138.6ms | 1175.8ms | 19680.8ms |

## Games

| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| challenger-as-player | 994300 | P white_planner / C white | white | 144 | 15 | P0/C9 | - | 26 | 20 |

## Decision Diff Samples

### seed 994300 step 8 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `focus:player_front_right`
- white: `move:player_back_left->player_front_right` (390.9ms)
- white_planner: `focus:player_front_right` (225.9ms)
- white reason: 前衛カードを前列へ出して攻撃しやすくするため移動 / 見送り: ためるは8点差で見送り、ためるは89点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面14点、次点と10点差
- board: player_front_left:player:ドノマンティス L1 HP5 act / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ボムゾウ L1 HP6 act / cpu_front_right:cpu:デスシープ L1 HP6 prep / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ヤンバル L1 HP3 prep

### seed 994300 step 9 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `attack:player_front_right:attack->master:cpu`
- white: `focus:player_front_left` (488.6ms)
- white_planner: `attack:player_front_right:attack->master:cpu` (120.8ms)
- white reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / 見送り: 攻撃は153点差で見送り、ためるは206点差で見送り
- planner reason: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面10点、次点と168点差
- board: player_front_left:player:ドノマンティス L1 HP5 act / player_front_right:player:ポリスピナー L1 HP3 act focus / player_back_left:player:ボムゾウ L1 HP6 act / cpu_front_right:cpu:デスシープ L1 HP6 prep / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ヤンバル L1 HP3 prep

### seed 994300 step 25 challenger-as-player

- turn/current: 3 / cpu (white)
- selected: white / `attack:cpu_front_left:ダイン斬り->monster:player_front_left`
- white: `attack:cpu_front_left:ダイン斬り->monster:player_front_left` (846.1ms)
- white_planner: `end_turn` (369.1ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 移動は4点差で見送り、攻撃は38点差で見送り
- planner reason: 有効な行動がないためターン終了 / 見送り: 移動は96点差で見送り、攻撃は106点差で見送り
- board: player_front_left:player:ドノマンティス L1 HP5 act shield focus / player_front_right:player:ボムゾウ L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 prep / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:デスシープ L2 HP6 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 26 challenger-as-player

- turn/current: 3 / cpu (white)
- selected: white / `attack:cpu_front_right:attack->monster:player_front_right`
- white: `attack:cpu_front_right:attack->monster:player_front_right` (645ms)
- white_planner: `end_turn` (205.4ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: ためるは13点差で見送り、ためるは18点差で見送り
- planner reason: 有効な行動がないためターン終了 / 見送り: ためるは78点差で見送り、ためるは84点差で見送り
- board: player_front_left:player:ドノマンティス L1 HP5 act shield / player_front_right:player:ボムゾウ L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 prep / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:デスシープ L2 HP6 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 29 challenger-as-player

- turn/current: 3 / cpu (white)
- selected: white / `end_turn`
- white: `end_turn` (73.4ms)
- white_planner: `focus:cpu_back_left` (23.4ms)
- white reason: 有効な行動がないためターン終了 / 見送り: ためるは3点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面15点、次点と10点差
- board: player_front_left:player:ドノマンティス L1 HP5 act shield / player_back_right:player:ピグミィ L1 HP3 prep / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:デスシープ L2 HP6 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 32 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `attack:player_back_left:スパイクボール->monster:cpu_front_right`
- white: `summon:player_card_133_3->player_front_right` (221.9ms)
- white_planner: `attack:player_back_left:スパイクボール->monster:cpu_front_right` (131.1ms)
- white reason: 前衛カードを前列右へ召喚 / 見送り: 攻撃は17点差で見送り、召喚は22点差で見送り
- planner reason: デスシープを削れるため攻撃 / 見送り: 召喚は19点差で見送り、召喚は29点差で見送り
- board: player_front_left:player:ドノマンティス L1 HP5 act focus / player_back_left:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:デスシープ L2 HP6 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 36 challenger-as-player

- turn/current: 4 / cpu (white)
- selected: white / `attack:cpu_back_right:wild_claw->monster:player_front_left`
- white: `attack:cpu_back_right:wild_claw->monster:player_front_left` (572.2ms)
- white_planner: `focus:cpu_front_left` (375.8ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: マジックは165点差で見送り、マジックは165点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面152点、次点と41点差
- board: player_front_left:player:ドノマンティス L1 HP5 act focus / player_front_right:player:デスシープ L1 HP6 prep / player_back_left:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:デスシープ L2 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 42 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `attack:player_back_right:スパイクボール->monster:cpu_front_left`
- white: `summon:player_card_047_2->player_front_left` (216.6ms)
- white_planner: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (134.7ms)
- white reason: 前衛カードを前列左へ召喚 / 見送り: 攻撃は24点差で見送り、召喚は25点差で見送り
- planner reason: 真勇者ダインを削れるため攻撃 / 見送り: 召喚は12点差で見送り、召喚は25点差で見送り
- board: player_front_right:player:デスシープ L1 HP6 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:デスシープ L2 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 43 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `summon:player_card_047_2->player_front_left`
- white: `master:master_attack->monster:cpu_front_left` (298.6ms)
- white_planner: `summon:player_card_047_2->player_front_left` (59.1ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: マスター特技は178点差で見送り、召喚は374点差で見送り
- planner reason: 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面103点、次点と15点差
- board: player_front_right:player:デスシープ L1 HP6 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP5 act / cpu_front_right:cpu:デスシープ L2 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 44 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `master:master_attack->monster:cpu_front_left` (157ms)
- white_planner: `end_turn` (22.3ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: マスター特技は49点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-11点
- board: player_front_left:player:真勇者ダイン L1 HP6 prep / player_front_right:player:デスシープ L1 HP6 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP5 act / cpu_front_right:cpu:デスシープ L2 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 45 challenger-as-player

- turn/current: 5 / cpu (white)
- selected: white / `attack:cpu_back_right:wild_claw->monster:player_front_right`
- white: `attack:cpu_back_right:wild_claw->monster:player_front_right` (640.4ms)
- white_planner: `magic:cpu_card_031_1->monster:player_front_right` (259.3ms)
- white reason: デスシープを削れるため攻撃 / 見送り: マジックは36点差で見送り、マジックは36点差で見送り
- planner reason: ワープで追加対象も有効にできるため使用 / ターンプラン探索: 返し込み最終盤面214点、次点と0点差
- board: player_front_left:player:真勇者ダイン L1 HP6 prep / player_front_right:player:デスシープ L1 HP6 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP5 act / cpu_front_right:cpu:デスシープ L2 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 53 challenger-as-player

- turn/current: 6 / player (white_planner)
- selected: white_planner / `summon:player_polyspinner_3->player_front_right`
- white: `master:master_attack->monster:cpu_front_right` (419.9ms)
- white_planner: `summon:player_polyspinner_3->player_front_right` (60.9ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: マスター特技は552点差で見送り、召喚は559点差で見送り
- planner reason: 前衛カードを前列右へ召喚 / ターンプラン探索: 返し込み最終盤面86点、次点と15点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP5 act / cpu_front_right:cpu:デスシープ L2 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 54 challenger-as-player

- turn/current: 6 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `master:master_attack->monster:cpu_front_right` (206.2ms)
- white_planner: `end_turn` (23.1ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: マスター特技は184点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-15点
- board: player_front_left:player:真勇者ダイン L1 HP6 act focus / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP5 act / cpu_front_right:cpu:デスシープ L2 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 61 challenger-as-player

- turn/current: 7 / player (white_planner)
- selected: white_planner / `attack:player_back_left:スパイクボール->monster:cpu_front_left`
- white: `attack:player_back_left:スパイクボール->monster:cpu_front_right` (612.5ms)
- white_planner: `attack:player_back_left:スパイクボール->monster:cpu_front_left` (339.3ms)
- white reason: デスシープを削れるため攻撃 / 見送り: ためるは155点差で見送り、マスター特技は200点差で見送り
- planner reason: 真勇者ダインを削れるため攻撃 / 見送り: 攻撃は34点差で見送り、召喚は34点差で見送り
- board: player_front_left:player:真勇者ダイン L1 HP5 act focus / player_back_left:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP5 act focus / cpu_front_right:cpu:デスシープ L2 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 62 challenger-as-player

- turn/current: 7 / player (white_planner)
- selected: white_planner / `attack:player_back_left:スパイクボール->monster:cpu_front_right`
- white: `summon:player_card_047_3->player_front_right` (239.5ms)
- white_planner: `attack:player_back_left:スパイクボール->monster:cpu_front_right` (148.5ms)
- white reason: 前衛カードを前列右へ召喚 / 見送り: 攻撃は18点差で見送り、召喚は22点差で見送り
- planner reason: デスシープを削れるため攻撃 / 見送り: 召喚は18点差で見送り、召喚は28点差で見送り
- board: player_front_left:player:真勇者ダイン L1 HP5 act focus / player_back_left:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP5 act / cpu_front_right:cpu:デスシープ L2 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 64 challenger-as-player

- turn/current: 7 / player (white_planner)
- selected: white_planner / `master:master_attack->monster:cpu_front_right`
- white: `summon:player_card_047_3->player_front_right` (566.8ms)
- white_planner: `master:master_attack->monster:cpu_front_right` (123.2ms)
- white reason: 前衛カードを前列右へ召喚 / 見送り: マスター特技は222点差で見送り、マスター特技は392点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / ターンプラン探索: 返し込み最終盤面278点、次点と60点差
- board: player_front_left:player:真勇者ダイン L1 HP5 act focus / player_back_left:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP5 act / cpu_front_right:cpu:デスシープ L2 HP2 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 65 challenger-as-player

- turn/current: 7 / player (white_planner)
- selected: white_planner / `summon:player_card_047_3->player_front_right`
- white: `master:master_attack->monster:cpu_front_left` (251.4ms)
- white_planner: `summon:player_card_047_3->player_front_right` (64.6ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 召喚は7点差で見送り、召喚は61点差で見送り
- planner reason: 前衛カードを前列右へ召喚 / ターンプラン探索: 返し込み最終盤面130点、次点と15点差
- board: player_front_left:player:真勇者ダイン L1 HP5 act focus / player_back_left:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 66 challenger-as-player

- turn/current: 7 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `master:master_attack->monster:cpu_front_left` (105.3ms)
- white_planner: `end_turn` (23.6ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面23点
- board: player_front_left:player:真勇者ダイン L1 HP5 act focus / player_front_right:player:真勇者ダイン L1 HP6 prep / player_back_left:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 75 challenger-as-player

- turn/current: 8 / player (white_planner)
- selected: white_planner / `master:master_attack->monster:cpu_front_right`
- white: `summon:player_yanbaru_1->player_back_left` (345.8ms)
- white_planner: `master:master_attack->monster:cpu_front_right` (189.2ms)
- white reason: 後衛カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、攻撃は245点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / 見送り: 召喚は44点差で見送り、召喚は44点差で見送り
- board: player_front_left:player:真勇者ダイン L1 HP5 act focus / player_front_right:player:真勇者ダイン L1 HP6 act / cpu_front_left:cpu:真勇者ダイン L1 HP5 act focus / cpu_front_right:cpu:ヤンバル L1 HP1 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 76 challenger-as-player

- turn/current: 8 / player (white_planner)
- selected: white_planner / `summon:player_yanbaru_1->player_back_left`
- white: `attack:player_front_left:ダイン斬り->monster:cpu_front_left` (573.9ms)
- white_planner: `summon:player_yanbaru_1->player_back_left` (52.8ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: 召喚は320点差で見送り、召喚は320点差で見送り
- planner reason: 後衛カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面131点、次点と0点差
- board: player_front_left:player:真勇者ダイン L1 HP5 act focus / player_front_right:player:真勇者ダイン L1 HP6 act / cpu_front_left:cpu:真勇者ダイン L1 HP5 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 90 challenger-as-player

- turn/current: 9 / player (white_planner)
- selected: white_planner / `master:wake_up->monster:cpu_back_left`
- white: `attack:player_front_left:wild_claw->monster:cpu_front_right` (1354.3ms)
- white_planner: `master:wake_up->monster:cpu_back_left` (1175.8ms)
- white reason: ヤンバルを削れるため攻撃 / 見送り: マスター特技は14点差で見送り、攻撃は281点差で見送り
- planner reason: 相手の準備中モンスターを起こして撃破できるためウェイクアップ / 見送り: 攻撃は137点差で見送り、攻撃は211点差で見送り
- board: player_front_left:player:ヤンバル L2 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / cpu_front_left:cpu:ドノマンティス L2 HP5 act / cpu_front_right:cpu:ヤンバル L1 HP3 act shield / cpu_back_left:cpu:ヤンバル L1 HP3 prep / cpu_back_right:cpu:真勇者ダイン L1 HP6 prep

### seed 994300 step 91 challenger-as-player

- turn/current: 9 / player (white_planner)
- selected: white_planner / `attack:player_front_left:wild_claw->monster:cpu_back_left`
- white: `summon:player_card_037_2->player_back_left` (814.7ms)
- white_planner: `attack:player_front_left:wild_claw->monster:cpu_back_left` (575.9ms)
- white reason: ドノマンティスを空き枠へ召喚 / 見送り: 攻撃は49点差で見送り、攻撃は129点差で見送り
- planner reason: 敵モンスターを撃破できるため攻撃 / ターンプラン探索: 返し込み最終盤面157点、次点と223点差
- board: player_front_left:player:ヤンバル L2 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / cpu_front_left:cpu:ドノマンティス L2 HP5 act / cpu_front_right:cpu:ヤンバル L1 HP3 act shield / cpu_back_left:cpu:ヤンバル L1 HP3 act / cpu_back_right:cpu:真勇者ダイン L1 HP6 prep

### seed 994300 step 113 challenger-as-player

- turn/current: 11 / player (white_planner)
- selected: white_planner / `focus:player_front_right`
- white: `attack:player_front_left:storm_bomb->monster:cpu_front_right` (788.5ms)
- white_planner: `focus:player_front_right` (276.1ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: 攻撃は52点差で見送り、マスター特技は97点差で見送り
- planner reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / 見送り: 攻撃は16点差で見送り、攻撃は184点差で見送り
- board: player_front_left:player:ボムゾウ L1 HP6 act / player_front_right:player:真勇者ダイン L2 HP3 act / cpu_front_left:cpu:ドノマンティス L2 HP5 act shield / cpu_front_right:cpu:真勇者ダイン L1 HP6 act / cpu_back_left:cpu:ヤンバル L2 HP3 act / cpu_back_right:cpu:デスシープ L1 HP6 prep

### seed 994300 step 119 challenger-as-player

- turn/current: 11 / cpu (white)
- selected: white / `attack:cpu_front_right:ダイン斬り->monster:player_front_right`
- white: `attack:cpu_front_right:ダイン斬り->monster:player_front_right` (429.3ms)
- white_planner: `attack:cpu_back_left:wild_claw->monster:player_front_left` (218.9ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: 攻撃は23点差で見送り、攻撃は49点差で見送り
- planner reason: 敵モンスターを撃破できるため攻撃 / ターンプラン探索: 返し込み最終盤面219点、次点と199点差
- board: player_front_left:player:ボムゾウ L1 HP3 act / player_front_right:player:真勇者ダイン L2 HP3 act shield focus / cpu_front_left:cpu:ドノマンティス L2 HP5 act / cpu_front_right:cpu:真勇者ダイン L1 HP4 act / cpu_back_left:cpu:ヤンバル L2 HP3 act / cpu_back_right:cpu:デスシープ L1 HP6 act

### seed 994300 step 124 challenger-as-player

- turn/current: 12 / player (white_planner)
- selected: white_planner / `attack:player_front_right:ダイン斬り->monster:cpu_front_right`
- white: `focus:player_front_right` (240.5ms)
- white_planner: `attack:player_front_right:ダイン斬り->monster:cpu_front_right` (36.4ms)
- white reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / 見送り: 攻撃は10点差で見送り、攻撃は195点差で見送り
- planner reason: 真勇者ダインを削れるため攻撃 / 見送り: ためるは16点差で見送り、マスター特技は170点差で見送り
- board: player_front_right:player:真勇者ダイン L2 HP3 act / cpu_front_left:cpu:ドノマンティス L2 HP5 act / cpu_front_right:cpu:真勇者ダイン L1 HP4 act shield / cpu_back_left:cpu:ヤンバル L2 HP3 act / cpu_back_right:cpu:デスシープ L1 HP6 act focus

### seed 994300 step 139 challenger-as-player

- turn/current: 14 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `summon:player_card_047_1->player_back_left` (22.9ms)
- white_planner: `end_turn` (11.8ms)
- white reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は1点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-222点
- board: cpu_front_left:cpu:デスシープ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L2 HP5 act / cpu_back_left:cpu:ボムゾウ L1 HP6 prep / cpu_back_right:cpu:真勇者ダイン L3 HP6 act focus

## Reading

- white_planner average decision 138.6ms, max 1175.8ms.
- white_planner diverged from white 26 times; inspect samples before changing search depth.

## Next Steps

- Review decision diff samples and classify good/bad planner divergences.
- If planner average decision time stays practical, run both directions with count 3-5.
- Try opponentTerminalPlanDepth 2 as a v2 candidate.
