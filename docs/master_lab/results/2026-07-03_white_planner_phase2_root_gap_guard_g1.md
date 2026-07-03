# White Planner Phase 2

生成: 2026-07-03T13:46:19.183Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994120-994120
directions: challenger-as-cpu, challenger-as-player

## Summary

- games: 2
- wins: -
- draws/undecided: 2
- issues: 2
- decision diffs: 30
- planner-selected diffs: 12

## Timing

| profile | decisions | avg ms | max ms | total ms |
| --- | ---: | ---: | ---: | ---: |
| white | 115 | 313.8ms | 1640.8ms | 36088.8ms |
| white_planner | 115 | 128.6ms | 902.9ms | 14789ms |

## Games

| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| challenger-as-cpu | 994120 | P white / C white_planner | draw | 60 | 6 | P10/C10 | winner was not decided within 60 auto steps | 19 | 5 |
| challenger-as-player | 994120 | P white_planner / C white | draw | 60 | 6 | P10/C10 | winner was not decided within 60 auto steps | 11 | 7 |

## Decision Diff Samples

### seed 994120 step 1 challenger-as-cpu

- turn/current: 1 / player (white)
- selected: white / `summon:player_card_047_1->player_front_right`
- white: `summon:player_card_047_1->player_front_right` (104.1ms)
- white_planner: `summon:player_card_047_1->player_front_left` (41.8ms)
- white reason: 前衛カードを前列右へ召喚 / 見送り: 召喚は16点差で見送り、召喚は43点差で見送り
- planner reason: 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面200点、次点と3点差
- board: player_back_left:player:ヤンバル L1 HP3 prep

### seed 994120 step 8 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `focus:player_front_left`
- white: `focus:player_front_left` (595.9ms)
- white_planner: `summon:player_polyspinner_1->player_back_left` (264.1ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは4点差で見送り、移動は8点差で見送り
- planner reason: ポリスピナーを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面76点、次点と7点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 9 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `focus:player_front_right`
- white: `focus:player_front_right` (303.5ms)
- white_planner: `summon:player_polyspinner_1->player_back_left` (113.2ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は34点差で見送り、ためるは48点差で見送り
- planner reason: ポリスピナーを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面64点、次点と7点差
- board: player_front_left:player:ヤンバル L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 14 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `summon:cpu_bomuzo_2->cpu_back_right`
- white: `attack:cpu_front_left:self_bomb->monster:player_front_left` (1640.8ms)
- white_planner: `summon:cpu_bomuzo_2->cpu_back_right` (902.9ms)
- white reason: ヤンバルを削れるため攻撃 / 見送り: 攻撃は26点差で見送り、召喚は126点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面242点、次点と15点差
- board: player_front_left:player:ヤンバル L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act shield focus / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 16 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `focus:cpu_front_right`
- white: `attack:cpu_front_right:attack->monster:player_front_right` (542ms)
- white_planner: `focus:cpu_front_right` (161.7ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: ためるは41点差で見送り、ためるは79点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面156点、次点と1点差
- board: player_front_left:player:ヤンバル L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act shield focus / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 18 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `master:shield->monster:cpu_front_right`
- white: `master:shield->monster:cpu_back_left` (102.3ms)
- white_planner: `master:shield->monster:cpu_front_right` (37.5ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は4点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面143点、次点と8点差
- board: player_front_left:player:ヤンバル L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act shield focus / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 20 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `attack:player_front_left:wild_claw->monster:cpu_front_right`
- white: `attack:player_front_left:wild_claw->monster:cpu_front_right` (199.7ms)
- white_planner: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (77.9ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は44点差で見送り、移動は62点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面140点、次点と69点差
- board: player_front_left:player:ヤンバル L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield focus / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 22 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `attack:player_back_right:スパイクボール->monster:cpu_front_left`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (631.8ms)
- white_planner: `end_turn` (25.3ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: ためるは79点差で見送り、マスター特技は102点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面67点
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 23 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `focus:player_back_left`
- white: `focus:player_back_left` (468ms)
- white_planner: `end_turn` (24.6ms)
- white reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / 見送り: 攻撃は35点差で見送り、攻撃は84点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面2点
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP5 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 24 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `attack:player_front_right:ダイン斬り->monster:cpu_front_right`
- white: `attack:player_front_right:ダイン斬り->monster:cpu_front_right` (484.6ms)
- white_planner: `end_turn` (24.4ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 移動は67点差で見送り、攻撃は86点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-28点
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ポリスピナー L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP5 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 27 challenger-as-cpu

- turn/current: 3 / cpu (white_planner)
- selected: white_planner / `focus:cpu_front_right`
- white: `attack:cpu_back_right:storm_bomb->monster:player_front_left` (1039.7ms)
- white_planner: `focus:cpu_front_right` (613.6ms)
- white reason: ヤンバルを削れるため攻撃 / 見送り: ためるは72点差で見送り、攻撃は132点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面229点、次点と23点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act shield / player_back_left:player:ポリスピナー L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP5 act / cpu_front_right:cpu:ドノマンティス L1 HP3 act / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 32 challenger-as-cpu

- turn/current: 4 / player (white)
- selected: white / `attack:player_front_right:ダイン斬り->monster:cpu_front_right`
- white: `attack:player_front_right:ダイン斬り->monster:cpu_front_right` (322.5ms)
- white_planner: `summon:player_bomuzo_1->player_back_left` (204.6ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 召喚は1点差で見送り、攻撃は26点差で見送り
- planner reason: ボムゾウを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面267点、次点と21点差
- board: player_front_left:player:ポリスピナー L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act shield / cpu_front_right:cpu:ドノマンティス L1 HP3 act focus / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 33 challenger-as-cpu

- turn/current: 4 / player (white)
- selected: white / `summon:player_bomuzo_1->player_back_left`
- white: `summon:player_bomuzo_1->player_back_left` (212.5ms)
- white_planner: `master:master_attack->monster:cpu_front_right` (112.1ms)
- white reason: ボムゾウを空き枠へ召喚 / 見送り: 召喚は80点差で見送り、攻撃は95点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / ターンプラン探索: 返し込み最終盤面245点、次点と81点差
- board: player_front_left:player:ポリスピナー L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act shield / cpu_front_right:cpu:ドノマンティス L1 HP2 act / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 34 challenger-as-cpu

- turn/current: 4 / player (white)
- selected: white / `attack:player_back_right:スパイクボール->monster:cpu_front_right`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_right` (364.7ms)
- white_planner: `master:master_attack->monster:cpu_front_right` (57.8ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: マスター特技は326点差で見送り、ためるは328点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / ターンプラン探索: 返し込み最終盤面185点、次点と49点差
- board: player_front_left:player:ポリスピナー L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ボムゾウ L1 HP6 prep / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act shield / cpu_front_right:cpu:ドノマンティス L1 HP2 act / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 35 challenger-as-cpu

- turn/current: 4 / player (white)
- selected: white / `master:wake_up->monster:player_back_left`
- white: `master:wake_up->monster:player_back_left` (138.8ms)
- white_planner: `attack:player_back_right:スパイクボール->monster:cpu_front_right` (54.1ms)
- white reason: 準備中の味方を起こして敵を撃破できるためウェイクアップ / 見送り: 攻撃は183点差で見送り、ためるは319点差で見送り
- planner reason: 敵モンスターを撃破できるため攻撃 / ターンプラン探索: 返し込み最終盤面174点、次点と32点差
- board: player_front_left:player:ポリスピナー L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ボムゾウ L1 HP6 prep / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act shield / cpu_front_right:cpu:ドノマンティス L1 HP1 act / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 38 challenger-as-cpu

- turn/current: 4 / player (white)
- selected: white / `focus:player_back_right`
- white: `focus:player_back_right` (362.5ms)
- white_planner: `end_turn` (11.1ms)
- white reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / 見送り: 攻撃は116点差で見送り、攻撃は137点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面42点
- board: player_front_left:player:ポリスピナー L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ボムゾウ L2 HP5 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L2 HP5 act shield / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 40 challenger-as-cpu

- turn/current: 4 / cpu (white_planner)
- selected: white_planner / `summon:cpu_card_047_2->cpu_back_right`
- white: `attack:cpu_front_left:self_bomb->monster:player_front_left` (819.9ms)
- white_planner: `summon:cpu_card_047_2->cpu_back_right` (454.6ms)
- white reason: ポリスピナーを削れるため攻撃 / 見送り: 攻撃は59点差で見送り、召喚は175点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面216点、次点と6点差
- board: player_front_left:player:ポリスピナー L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ボムゾウ L2 HP5 act / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L2 HP5 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:デスシープ L1 HP6 act focus

### seed 994120 step 46 challenger-as-cpu

- turn/current: 5 / player (white)
- selected: white / `attack:player_front_right:ダイン斬り->monster:cpu_front_right`
- white: `attack:player_front_right:ダイン斬り->monster:cpu_front_right` (547.8ms)
- white_planner: `focus:player_front_right` (56.7ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: ためるは221点差で見送り、攻撃は284点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面77点、次点と52点差
- board: player_front_left:player:ボムゾウ L2 HP2 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_right:cpu:ボムゾウ L2 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:真勇者ダイン L1 HP6 prep

### seed 994120 step 47 challenger-as-cpu

- turn/current: 5 / player (white)
- selected: white / `master:master_attack->monster:cpu_front_right`
- white: `master:master_attack->monster:cpu_front_right` (351.9ms)
- white_planner: `summon:player_card_037_1->player_back_left` (183.2ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 召喚は104点差で見送り、移動は201点差で見送り
- planner reason: ドノマンティスを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面177点、次点と0点差
- board: player_front_left:player:ボムゾウ L2 HP2 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_right:cpu:ボムゾウ L2 HP3 act / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:真勇者ダイン L1 HP6 prep

### seed 994120 step 1 challenger-as-player

- turn/current: 1 / player (white_planner)
- selected: white_planner / `summon:player_card_047_1->player_front_left`
- white: `summon:player_card_047_1->player_front_right` (100.9ms)
- white_planner: `summon:player_card_047_1->player_front_left` (40.2ms)
- white reason: 前衛カードを前列右へ召喚 / 見送り: 召喚は16点差で見送り、召喚は43点差で見送り
- planner reason: 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面200点、次点と3点差
- board: player_back_left:player:ヤンバル L1 HP3 prep

### seed 994120 step 9 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `summon:player_polyspinner_1->player_front_right`
- white: `focus:player_front_left` (306.4ms)
- white_planner: `summon:player_polyspinner_1->player_front_right` (129.1ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は4点差で見送り、ためるは69点差で見送り
- planner reason: 前衛カードを前列右へ召喚 / ターンプラン探索: 返し込み最終盤面136点、次点と34点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 15 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `attack:cpu_front_left:self_bomb->monster:player_front_left`
- white: `attack:cpu_front_left:self_bomb->monster:player_front_left` (1136.1ms)
- white_planner: `summon:cpu_bomuzo_2->cpu_back_right` (552.7ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: 召喚は21点差で見送り、ためるは53点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面222点、次点と15点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act shield focus / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 16 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `focus:cpu_front_right`
- white: `focus:cpu_front_right` (758ms)
- white_planner: `summon:cpu_bomuzo_2->cpu_back_right` (313.9ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は27点差で見送り、ためるは54点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面124点、次点と16点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act shield / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 19 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `master:shield->monster:cpu_front_right`
- white: `master:shield->monster:cpu_front_right` (154.8ms)
- white_planner: `master:shield->monster:cpu_front_left` (59.4ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は8点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面36点、次点と3点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act shield / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 21 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `attack:player_back_left:wild_claw->monster:cpu_front_left`
- white: `focus:player_front_right` (524.7ms)
- white_planner: `attack:player_back_left:wild_claw->monster:cpu_front_left` (379.3ms)
- white reason: 有効攻撃がないためためる / 見送り: 攻撃は14点差で見送り、攻撃は18点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面230点、次点と0点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ヤンバル L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield focus / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 32 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `summon:player_bomuzo_1->player_back_right`
- white: `attack:player_back_left:wild_claw->monster:cpu_front_left` (1066.9ms)
- white_planner: `summon:player_bomuzo_1->player_back_right` (746.6ms)
- white reason: デスシープを削れるため攻撃 / 見送り: 攻撃は181点差で見送り、召喚は192点差で見送り
- planner reason: ボムゾウを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面189点、次点と3点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ピグミィ L1 HP3 act focus / player_back_left:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:デスシープ L1 HP6 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 act focus

### seed 994120 step 37 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `attack:player_back_right:storm_bomb->monster:cpu_front_left`
- white: `focus:player_back_right` (99.9ms)
- white_planner: `attack:player_back_right:storm_bomb->monster:cpu_front_left` (67.4ms)
- white reason: 有効攻撃がないためためる / 見送り: 攻撃は2点差で見送り、攻撃は72点差で見送り
- planner reason: 敵モンスターを撃破できるため攻撃 / ターンプラン探索: 返し込み最終盤面126点、次点と0点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ピグミィ L1 HP3 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ボムゾウ L1 HP6 act / cpu_front_left:cpu:デスシープ L1 HP1 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 act focus

### seed 994120 step 42 challenger-as-player

- turn/current: 4 / cpu (white)
- selected: white / `attack:cpu_front_right:attack->monster:player_front_right`
- white: `attack:cpu_front_right:attack->monster:player_front_right` (451.7ms)
- white_planner: `summon:cpu_card_047_2->cpu_back_left` (314.7ms)
- white reason: ピグミィを削れるため攻撃 / 見送り: 召喚は115点差で見送り、召喚は158点差で見送り
- planner reason: カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面197点、次点と6点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ピグミィ L1 HP3 act focus / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ボムゾウ L2 HP5 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act focus

### seed 994120 step 46 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `summon:player_card_037_1->player_back_right`
- white: `attack:player_back_left:wild_claw->monster:cpu_front_left` (808.5ms)
- white_planner: `summon:player_card_037_1->player_back_right` (364.8ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 召喚は98点差で見送り、攻撃は128点差で見送り
- planner reason: ドノマンティスを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面187点、次点と10点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ボムゾウ L2 HP5 act / player_back_left:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 act focus

### seed 994120 step 47 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `attack:player_front_right:self_bomb->monster:cpu_front_right`
- white: `attack:player_back_left:wild_claw->monster:cpu_front_left` (995.2ms)
- white_planner: `attack:player_front_right:self_bomb->monster:cpu_front_right` (644.2ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は88点差で見送り、攻撃は194点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面121点、次点と4点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ボムゾウ L2 HP5 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ドノマンティス L1 HP5 prep / cpu_front_left:cpu:ドノマンティス L1 HP5 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 act focus

## Reading

- white_planner average decision 128.6ms, max 902.9ms.
- white_planner diverged from white 30 times; inspect samples before changing search depth.
- Some games hit the step/turn cap. Treat W-L-D as incomplete and use this run mainly for timing and decision-diff inspection.

## Next Steps

- Review decision diff samples and classify good/bad planner divergences.
- If planner average decision time stays practical, run both directions with count 3-5.
- Try opponentTerminalPlanDepth 2 as a v2 candidate.
