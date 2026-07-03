# White Planner Phase 2

生成: 2026-07-03T13:44:31.025Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994120-994120
directions: challenger-as-cpu, challenger-as-player

## Summary

- games: 2
- wins: -
- draws/undecided: 2
- issues: 2
- decision diffs: 35
- planner-selected diffs: 15

## Timing

| profile | decisions | avg ms | max ms | total ms |
| --- | ---: | ---: | ---: | ---: |
| white | 116 | 342.2ms | 1644.5ms | 39689.5ms |
| white_planner | 116 | 139.5ms | 892.8ms | 16180ms |

## Games

| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| challenger-as-cpu | 994120 | P white / C white_planner | draw | 60 | 7 | P10/C10 | winner was not decided within 60 auto steps | 20 | 7 |
| challenger-as-player | 994120 | P white_planner / C white | draw | 60 | 6 | P10/C10 | winner was not decided within 60 auto steps | 15 | 8 |

## Decision Diff Samples

### seed 994120 step 1 challenger-as-cpu

- turn/current: 1 / player (white)
- selected: white / `summon:player_card_047_1->player_front_right`
- white: `summon:player_card_047_1->player_front_right` (103ms)
- white_planner: `summon:player_card_047_1->player_front_left` (41.2ms)
- white reason: 前衛カードを前列右へ召喚 / 見送り: 召喚は16点差で見送り、召喚は43点差で見送り
- planner reason: 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面200点、次点と3点差
- board: player_back_left:player:ヤンバル L1 HP3 prep

### seed 994120 step 8 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `focus:player_front_left`
- white: `focus:player_front_left` (577.5ms)
- white_planner: `summon:player_polyspinner_1->player_back_left` (250.2ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは4点差で見送り、移動は8点差で見送り
- planner reason: ポリスピナーを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面76点、次点と7点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 9 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `focus:player_front_right`
- white: `focus:player_front_right` (282.4ms)
- white_planner: `summon:player_polyspinner_1->player_back_left` (111.2ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は34点差で見送り、ためるは48点差で見送り
- planner reason: ポリスピナーを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面64点、次点と7点差
- board: player_front_left:player:ヤンバル L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 14 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `summon:cpu_bomuzo_2->cpu_back_right`
- white: `attack:cpu_front_left:self_bomb->monster:player_front_left` (1644.5ms)
- white_planner: `summon:cpu_bomuzo_2->cpu_back_right` (892.8ms)
- white reason: ヤンバルを削れるため攻撃 / 見送り: 攻撃は26点差で見送り、召喚は126点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面242点、次点と15点差
- board: player_front_left:player:ヤンバル L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act shield focus / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 16 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `focus:cpu_front_right`
- white: `attack:cpu_front_right:attack->monster:player_front_right` (522.9ms)
- white_planner: `focus:cpu_front_right` (162.4ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: ためるは41点差で見送り、ためるは79点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面156点、次点と1点差
- board: player_front_left:player:ヤンバル L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act shield focus / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 18 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `master:shield->monster:cpu_front_right`
- white: `master:shield->monster:cpu_back_left` (97.8ms)
- white_planner: `master:shield->monster:cpu_front_right` (36.9ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は4点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面143点、次点と8点差
- board: player_front_left:player:ヤンバル L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act shield focus / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 20 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `attack:player_front_left:wild_claw->monster:cpu_front_right`
- white: `attack:player_front_left:wild_claw->monster:cpu_front_right` (195.8ms)
- white_planner: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (78.1ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は44点差で見送り、移動は62点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面140点、次点と41点差
- board: player_front_left:player:ヤンバル L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield focus / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 22 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `attack:player_back_right:スパイクボール->monster:cpu_front_left`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (633.5ms)
- white_planner: `end_turn` (25.6ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: ためるは79点差で見送り、マスター特技は102点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面67点
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 23 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `focus:player_back_left`
- white: `focus:player_back_left` (467.1ms)
- white_planner: `end_turn` (24.3ms)
- white reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / 見送り: 攻撃は35点差で見送り、攻撃は84点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面2点
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP5 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 24 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `attack:player_front_right:ダイン斬り->monster:cpu_front_right`
- white: `attack:player_front_right:ダイン斬り->monster:cpu_front_right` (492.1ms)
- white_planner: `end_turn` (25.2ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 移動は67点差で見送り、攻撃は86点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-20点
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ポリスピナー L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP5 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 27 challenger-as-cpu

- turn/current: 3 / cpu (white_planner)
- selected: white_planner / `focus:cpu_front_right`
- white: `attack:cpu_back_right:storm_bomb->monster:player_front_left` (1039.3ms)
- white_planner: `focus:cpu_front_right` (632.7ms)
- white reason: ヤンバルを削れるため攻撃 / 見送り: ためるは72点差で見送り、攻撃は132点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面229点、次点と22点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act shield / player_back_left:player:ポリスピナー L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP5 act / cpu_front_right:cpu:ドノマンティス L1 HP3 act / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 29 challenger-as-cpu

- turn/current: 3 / cpu (white_planner)
- selected: white_planner / `master:master_attack->monster:player_front_left`
- white: `attack:cpu_front_left:self_bomb->monster:player_front_left` (402.4ms)
- white_planner: `master:master_attack->monster:player_front_left` (151.1ms)
- white reason: 敵モンスターを撃破できるため攻撃 / 見送り: マスター特技は498点差で見送り、ためるは552点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / ターンプラン探索: 返し込み最終盤面204点、次点と31点差
- board: player_front_left:player:ヤンバル L1 HP2 act / player_front_right:player:真勇者ダイン L1 HP6 act shield / player_back_left:player:ポリスピナー L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP5 act / cpu_front_right:cpu:ドノマンティス L1 HP3 act focus / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 32 challenger-as-cpu

- turn/current: 4 / player (white)
- selected: white / `attack:player_front_right:ダイン斬り->monster:cpu_front_right`
- white: `attack:player_front_right:ダイン斬り->monster:cpu_front_right` (669.7ms)
- white_planner: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (435.2ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は40点差で見送り、召喚は194点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面329点、次点と0点差
- board: player_front_left:player:ポリスピナー L1 HP3 act focus / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP5 act focus / cpu_front_right:cpu:ドノマンティス L1 HP3 act focus / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 36 challenger-as-cpu

- turn/current: 4 / player (white)
- selected: white / `attack:player_front_left:attack->monster:cpu_front_left`
- white: `attack:player_front_left:attack->monster:cpu_front_left` (137.4ms)
- white_planner: `summon:player_bomuzo_1->player_back_left` (188.3ms)
- white reason: 敵モンスターを撃破できるため攻撃 / 見送り: 攻撃は5点差で見送り、召喚は80点差で見送り
- planner reason: ボムゾウを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面213点、次点と4点差
- board: player_front_left:player:ポリスピナー L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP2 act / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 49 challenger-as-cpu

- turn/current: 5 / player (white)
- selected: white / `attack:player_back_right:スパイクボール->monster:cpu_front_right`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_right` (248.1ms)
- white_planner: `summon:player_card_037_1->player_back_left` (89.1ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 召喚は28点差で見送り
- planner reason: ドノマンティスを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面125点、次点と7点差
- board: player_front_left:player:ボムゾウ L1 HP6 act focus / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:デスシープ L2 HP6 act shield / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ドノマンティス L1 HP5 prep

### seed 994120 step 52 challenger-as-cpu

- turn/current: 5 / player (white)
- selected: white / `master:shield->monster:player_front_right`
- white: `master:shield->monster:player_front_right` (173.7ms)
- white_planner: `master:shield->monster:player_front_left` (43.2ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は8点差で見送り、マスター特技は243点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面55点、次点と7点差
- board: player_front_left:player:ボムゾウ L1 HP6 act focus / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ドノマンティス L1 HP5 prep / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:デスシープ L2 HP6 act shield / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ドノマンティス L1 HP5 prep

### seed 994120 step 54 challenger-as-cpu

- turn/current: 5 / cpu (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:cpu_front_right:storm_bomb->monster:player_front_left` (251.5ms)
- white_planner: `end_turn` (62.8ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 移動は14点差で見送り、移動は14点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面198点、次点と56点差
- board: player_front_left:player:ボムゾウ L1 HP6 act focus / player_front_right:player:真勇者ダイン L1 HP6 act shield focus / player_back_left:player:ドノマンティス L1 HP5 prep / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:デスシープ L2 HP6 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 act / cpu_back_right:cpu:ドノマンティス L1 HP5 act

### seed 994120 step 56 challenger-as-cpu

- turn/current: 6 / player (white)
- selected: white / `attack:player_back_right:スパイクボール->monster:cpu_front_right`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_right` (405.4ms)
- white_planner: `end_turn` (79.7ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は122点差で見送り、攻撃は127点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面228点、次点と55点差
- board: player_front_left:player:ボムゾウ L1 HP6 act focus / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ドノマンティス L1 HP5 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:デスシープ L2 HP6 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_left:cpu:真勇者ダイン L1 HP6 act focus / cpu_back_right:cpu:ドノマンティス L1 HP5 act focus

### seed 994120 step 58 challenger-as-cpu

- turn/current: 6 / cpu (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:cpu_front_right:storm_bomb->monster:player_front_left` (627.2ms)
- white_planner: `end_turn` (128ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は29点差で見送り、移動は138点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面225点、次点と63点差
- board: player_front_left:player:ボムゾウ L1 HP6 act focus / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ドノマンティス L1 HP5 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:デスシープ L2 HP6 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 act focus / cpu_back_right:cpu:ドノマンティス L1 HP5 act focus

### seed 994120 step 59 challenger-as-cpu

- turn/current: 7 / player (white)
- selected: white / `attack:player_front_right:ダイン斬り->monster:cpu_front_right`
- white: `attack:player_front_right:ダイン斬り->monster:cpu_front_right` (440.8ms)
- white_planner: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (143.2ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は90点差で見送り、攻撃は97点差で見送り
- planner reason: デスシープを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面246点、次点と46点差
- board: player_front_left:player:ボムゾウ L1 HP6 act focus / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ドノマンティス L1 HP5 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:デスシープ L2 HP6 act focus / cpu_front_right:cpu:ボムゾウ L1 HP6 act focus / cpu_back_left:cpu:真勇者ダイン L1 HP6 act focus / cpu_back_right:cpu:ドノマンティス L1 HP5 act focus

### seed 994120 step 1 challenger-as-player

- turn/current: 1 / player (white_planner)
- selected: white_planner / `summon:player_card_047_1->player_front_left`
- white: `summon:player_card_047_1->player_front_right` (103.7ms)
- white_planner: `summon:player_card_047_1->player_front_left` (42.5ms)
- white reason: 前衛カードを前列右へ召喚 / 見送り: 召喚は16点差で見送り、召喚は43点差で見送り
- planner reason: 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面200点、次点と3点差
- board: player_back_left:player:ヤンバル L1 HP3 prep

### seed 994120 step 9 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `summon:player_polyspinner_1->player_front_right`
- white: `focus:player_front_left` (321ms)
- white_planner: `summon:player_polyspinner_1->player_front_right` (131.6ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は4点差で見送り、ためるは69点差で見送り
- planner reason: 前衛カードを前列右へ召喚 / ターンプラン探索: 返し込み最終盤面136点、次点と27点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 15 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `attack:cpu_front_left:self_bomb->monster:player_front_left`
- white: `attack:cpu_front_left:self_bomb->monster:player_front_left` (1148.8ms)
- white_planner: `summon:cpu_bomuzo_2->cpu_back_right` (534.4ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: 召喚は21点差で見送り、ためるは53点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面222点、次点と15点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act shield focus / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 16 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `focus:cpu_front_right`
- white: `focus:cpu_front_right` (661.8ms)
- white_planner: `summon:cpu_bomuzo_2->cpu_back_right` (265.5ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は27点差で見送り、ためるは54点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面124点、次点と16点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act shield / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 19 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `master:shield->monster:cpu_front_right`
- white: `master:shield->monster:cpu_front_right` (140.8ms)
- white_planner: `master:shield->monster:cpu_front_left` (57.2ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は8点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面36点、次点と3点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act shield / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act focus / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 21 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `attack:player_back_left:wild_claw->monster:cpu_front_left`
- white: `focus:player_front_right` (535.2ms)
- white_planner: `attack:player_back_left:wild_claw->monster:cpu_front_left` (387.1ms)
- white reason: 有効攻撃がないためためる / 見送り: 攻撃は14点差で見送り、攻撃は18点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面230点、次点と0点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ヤンバル L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield focus / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 22 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `attack:player_front_right:attack->monster:cpu_front_right`
- white: `attack:player_front_left:ダイン斬り->monster:cpu_front_left` (257.1ms)
- white_planner: `attack:player_front_right:attack->monster:cpu_front_right` (159ms)
- white reason: 敵モンスターを撃破できるため攻撃 / 見送り: 攻撃は145点差で見送り、攻撃は268点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面233点、次点と12点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP2 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield focus / cpu_back_left:cpu:デスシープ L1 HP6 act focus / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 32 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `summon:player_bomuzo_1->player_back_right`
- white: `attack:player_back_left:wild_claw->monster:cpu_front_left` (1093.8ms)
- white_planner: `summon:player_bomuzo_1->player_back_right` (731.3ms)
- white reason: デスシープを削れるため攻撃 / 見送り: 攻撃は181点差で見送り、召喚は192点差で見送り
- planner reason: ボムゾウを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面189点、次点と3点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ピグミィ L1 HP3 act focus / player_back_left:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:デスシープ L1 HP6 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 act focus

### seed 994120 step 42 challenger-as-player

- turn/current: 4 / cpu (white)
- selected: white / `attack:cpu_front_right:attack->monster:player_front_right`
- white: `attack:cpu_front_right:attack->monster:player_front_right` (559.9ms)
- white_planner: `master:master_attack->monster:player_front_right` (289.1ms)
- white reason: 敵モンスターを撃破できるため攻撃 / 見送り: ためるは254点差で見送り、召喚は367点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / ターンプラン探索: 返し込み最終盤面267点、次点と6点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ピグミィ L2 HP2 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ボムゾウ L1 HP6 act focus / cpu_front_left:cpu:ドノマンティス L1 HP5 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 48 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `master:master_attack->monster:cpu_front_left`
- white: `attack:player_front_right:storm_bomb->monster:cpu_front_left` (134.2ms)
- white_planner: `master:master_attack->monster:cpu_front_left` (99.6ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は29点差で見送り、召喚は53点差で見送り
- planner reason: ストーンに余裕があり敵を削れるためマスターアタック / ターンプラン探索: 返し込み最終盤面149点、次点と5点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP4 act / cpu_front_right:cpu:ドノマンティス L2 HP5 act shield / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 52 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:player_front_right:storm_bomb->monster:cpu_back_right` (151.4ms)
- white_planner: `end_turn` (15.4ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は266点差で見送り、攻撃は311点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-118点
- board: player_front_left:player:真勇者ダイン L3 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ドノマンティス L1 HP5 prep / cpu_front_right:cpu:ドノマンティス L2 HP5 act shield / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 53 challenger-as-player

- turn/current: 5 / cpu (white)
- selected: white / `attack:cpu_back_right:storm_bomb->monster:player_front_right`
- white: `attack:cpu_back_right:storm_bomb->monster:player_front_right` (1167.2ms)
- white_planner: `summon:cpu_polyspinner_1->cpu_back_left` (400.8ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は48点差で見送り、召喚は353点差で見送り
- planner reason: カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面147点、次点と76点差
- board: player_front_left:player:真勇者ダイン L3 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ドノマンティス L1 HP5 prep / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:ドノマンティス L2 HP5 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 54 challenger-as-player

- turn/current: 5 / cpu (white)
- selected: white / `master:master_attack->monster:player_front_right`
- white: `master:master_attack->monster:player_front_right` (968ms)
- white_planner: `summon:cpu_polyspinner_1->cpu_back_left` (269.9ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は14点差で見送り、召喚は165点差で見送り
- planner reason: カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面65点、次点と41点差
- board: player_front_left:player:真勇者ダイン L3 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ドノマンティス L1 HP5 prep / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:ドノマンティス L2 HP5 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 55 challenger-as-player

- turn/current: 5 / cpu (white)
- selected: white / `attack:cpu_front_right:呪いの刃->monster:player_front_right`
- white: `attack:cpu_front_right:呪いの刃->monster:player_front_right` (498.5ms)
- white_planner: `summon:cpu_polyspinner_1->cpu_back_left` (126.1ms)
- white reason: 敵モンスターを撃破できるため攻撃 / 見送り: ためるは160点差で見送り、召喚は340点差で見送り
- planner reason: カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面31点、次点と27点差
- board: player_front_left:player:真勇者ダイン L3 HP6 act / player_front_right:player:ボムゾウ L1 HP4 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ドノマンティス L1 HP5 prep / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:ドノマンティス L2 HP5 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 58 challenger-as-player

- turn/current: 6 / player (white_planner)
- selected: white_planner / `summon:player_card_037_3->player_back_right`
- white: `attack:player_back_left:wild_claw->monster:cpu_front_right` (634.9ms)
- white_planner: `summon:player_card_037_3->player_back_right` (234.3ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は11点差で見送り、攻撃は81点差で見送り
- planner reason: ドノマンティスを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面193点、次点と19点差
- board: player_front_left:player:真勇者ダイン L3 HP6 act / player_front_right:player:ドノマンティス L1 HP5 act / player_back_left:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP6 act focus / cpu_front_right:cpu:ドノマンティス L2 HP5 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act

## Reading

- white_planner average decision 139.5ms, max 892.8ms.
- white_planner diverged from white 35 times; inspect samples before changing search depth.
- Some games hit the step/turn cap. Treat W-L-D as incomplete and use this run mainly for timing and decision-diff inspection.

## Next Steps

- Review decision diff samples and classify good/bad planner divergences.
- If planner average decision time stays practical, run both directions with count 3-5.
- Try opponentTerminalPlanDepth 2 as a v2 candidate.
