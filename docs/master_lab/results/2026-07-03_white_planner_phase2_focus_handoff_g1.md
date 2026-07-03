# White Planner Phase 2

生成: 2026-07-03T13:41:31.140Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994120-994120
directions: challenger-as-cpu, challenger-as-player

## Summary

- games: 2
- wins: -
- draws/undecided: 2
- issues: 2
- decision diffs: 59
- planner-selected diffs: 24

## Timing

| profile | decisions | avg ms | max ms | total ms |
| --- | ---: | ---: | ---: | ---: |
| white | 115 | 390.8ms | 1636.9ms | 44945.9ms |
| white_planner | 115 | 144.4ms | 674.4ms | 16609.9ms |

## Games

| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| challenger-as-cpu | 994120 | P white / C white_planner | draw | 60 | 7 | P10/C10 | winner was not decided within 60 auto steps | 27 | 11 |
| challenger-as-player | 994120 | P white_planner / C white | draw | 60 | 7 | P10/C10 | winner was not decided within 60 auto steps | 32 | 13 |

## Decision Diff Samples

### seed 994120 step 1 challenger-as-cpu

- turn/current: 1 / player (white)
- selected: white / `summon:player_card_047_1->player_front_right`
- white: `summon:player_card_047_1->player_front_right` (104.5ms)
- white_planner: `summon:player_card_047_1->player_front_left` (41.9ms)
- white reason: 前衛カードを前列右へ召喚 / 見送り: 召喚は16点差で見送り、召喚は43点差で見送り
- planner reason: 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面169点、次点と0点差
- board: player_back_left:player:ヤンバル L1 HP3 prep

### seed 994120 step 8 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `focus:player_front_left`
- white: `focus:player_front_left` (584ms)
- white_planner: `summon:player_polyspinner_1->player_back_left` (224.6ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは4点差で見送り、移動は8点差で見送り
- planner reason: ポリスピナーを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面59点、次点と0点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 9 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `focus:player_front_right`
- white: `focus:player_front_right` (280.7ms)
- white_planner: `summon:player_polyspinner_1->player_back_left` (110ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は34点差で見送り、ためるは48点差で見送り
- planner reason: ポリスピナーを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面47点、次点と0点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 12 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `master:shield->monster:player_front_right`
- white: `master:shield->monster:player_front_right` (105.6ms)
- white_planner: `end_turn` (41.9ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は10点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-32点、次点と4点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 14 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `summon:cpu_bomuzo_2->cpu_back_right`
- white: `attack:cpu_front_left:self_bomb->monster:player_front_left` (1636.9ms)
- white_planner: `summon:cpu_bomuzo_2->cpu_back_right` (674.4ms)
- white reason: ヤンバルを削れるため攻撃 / 見送り: 攻撃は26点差で見送り、召喚は126点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面223点、次点と14点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act shield / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 15 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `end_turn`
- white: `focus:cpu_front_left` (701ms)
- white_planner: `end_turn` (273.1ms)
- white reason: 有効攻撃がないためためる / 見送り: 攻撃は40点差で見送り、ためるは74点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面164点、次点と6点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act shield / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 17 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `attack:player_front_left:wild_claw->monster:cpu_front_right`
- white: `attack:player_front_left:wild_claw->monster:cpu_front_right` (636.1ms)
- white_planner: `attack:player_front_right:ダイン斬り->monster:cpu_front_right` (402.2ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は12点差で見送り、攻撃は31点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面160点、次点と3点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 18 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `attack:player_front_right:ダイン斬り->monster:cpu_front_right`
- white: `attack:player_front_right:ダイン斬り->monster:cpu_front_right` (309.2ms)
- white_planner: `attack:player_back_right:スパイクボール->monster:cpu_front_right` (93.1ms)
- white reason: 敵モンスターを撃破できるため攻撃 / 見送り: 攻撃は131点差で見送り、攻撃は254点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面116点、次点と10点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP3 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 20 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `attack:player_back_right:スパイクボール->monster:cpu_front_left`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (410.2ms)
- white_planner: `focus:player_back_left` (130.1ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: ためるは122点差で見送り、ためるは179点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面49点、次点と0点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L2 HP6 act / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 24 challenger-as-cpu

- turn/current: 3 / cpu (white_planner)
- selected: white_planner / `summon:cpu_card_037_3->cpu_back_right`
- white: `focus:cpu_front_left` (785.3ms)
- white_planner: `summon:cpu_card_037_3->cpu_back_right` (274.5ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは6点差で見送り、召喚は123点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面209点、次点と6点差
- board: player_front_left:player:ヤンバル L1 HP3 act shield / player_front_right:player:真勇者ダイン L2 HP6 act / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 25 challenger-as-cpu

- turn/current: 3 / cpu (white_planner)
- selected: white_planner / `end_turn`
- white: `focus:cpu_front_left` (545.9ms)
- white_planner: `end_turn` (141.1ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは5点差で見送り、攻撃は260点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面152点、次点と6点差
- board: player_front_left:player:ヤンバル L1 HP3 act shield / player_front_right:player:真勇者ダイン L2 HP6 act / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ドノマンティス L1 HP5 prep

### seed 994120 step 26 challenger-as-cpu

- turn/current: 4 / player (white)
- selected: white / `attack:player_front_right:ダイン斬り->monster:cpu_front_right`
- white: `attack:player_front_right:ダイン斬り->monster:cpu_front_right` (1175.2ms)
- white_planner: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (322.5ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は17点差で見送り、攻撃は246点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面195点、次点と0点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L2 HP6 act / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ドノマンティス L1 HP5 prep

### seed 994120 step 27 challenger-as-cpu

- turn/current: 4 / player (white)
- selected: white / `attack:player_front_left:wild_claw->monster:cpu_front_right`
- white: `attack:player_front_left:wild_claw->monster:cpu_front_right` (878.5ms)
- white_planner: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (427.8ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は60点差で見送り、ためるは254点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面134点、次点と6点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L2 HP6 act / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ボムゾウ L1 HP4 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ドノマンティス L1 HP5 prep

### seed 994120 step 33 challenger-as-cpu

- turn/current: 4 / cpu (white_planner)
- selected: white_planner / `summon:cpu_card_047_2->cpu_back_right`
- white: `attack:cpu_front_left:self_bomb->monster:player_front_left` (594.5ms)
- white_planner: `summon:cpu_card_047_2->cpu_back_right` (165.1ms)
- white reason: ヤンバルを削れるため攻撃 / 見送り: 召喚は74点差で見送り、召喚は115点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面195点、次点と14点差
- board: player_front_left:player:ヤンバル L1 HP3 act shield / player_front_right:player:真勇者ダイン L2 HP6 act / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L2 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 34 challenger-as-cpu

- turn/current: 4 / cpu (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:cpu_front_left:self_bomb->monster:player_front_left` (426.6ms)
- white_planner: `end_turn` (63.3ms)
- white reason: ヤンバルを削れるため攻撃 / 見送り: ためるは170点差で見送り、攻撃は244点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面136点、次点と36点差
- board: player_front_left:player:ヤンバル L1 HP3 act shield / player_front_right:player:真勇者ダイン L2 HP6 act / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L2 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:真勇者ダイン L1 HP6 prep

### seed 994120 step 35 challenger-as-cpu

- turn/current: 5 / player (white)
- selected: white / `attack:player_back_right:スパイクボール->monster:cpu_front_left`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (924.6ms)
- white_planner: `magic:player_card_031_1->monster:player_front_left` (550.6ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: マジックは110点差で見送り、マジックは110点差で見送り
- planner reason: ワープで追加対象も有効にできるため使用 / ターンプラン探索: 返し込み最終盤面226点、次点と0点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L2 HP6 act / player_back_left:player:ポリスピナー L1 HP3 act / player_back_right:player:ピグミィ L2 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:真勇者ダイン L1 HP6 prep

### seed 994120 step 1 challenger-as-player

- turn/current: 1 / player (white_planner)
- selected: white_planner / `summon:player_card_047_1->player_front_left`
- white: `summon:player_card_047_1->player_front_right` (111.4ms)
- white_planner: `summon:player_card_047_1->player_front_left` (41.3ms)
- white reason: 前衛カードを前列右へ召喚 / 見送り: 召喚は16点差で見送り、召喚は43点差で見送り
- planner reason: 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面169点、次点と0点差
- board: player_back_left:player:ヤンバル L1 HP3 prep

### seed 994120 step 9 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `summon:player_polyspinner_1->player_front_right`
- white: `focus:player_front_left` (306.9ms)
- white_planner: `summon:player_polyspinner_1->player_front_right` (123.6ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は4点差で見送り、ためるは69点差で見送り
- planner reason: 前衛カードを前列右へ召喚 / ターンプラン探索: 返し込み最終盤面105点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 10 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `focus:player_front_left` (246ms)
- white_planner: `end_turn` (99.3ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは66点差で見送り、ためるは66点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面22点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 11 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `focus:cpu_front_left`
- white: `focus:cpu_front_left` (816.6ms)
- white_planner: `summon:cpu_bomuzo_2->cpu_back_right` (318.3ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は100点差で見送り、ためるは136点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面227点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 12 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `focus:cpu_front_right`
- white: `focus:cpu_front_right` (526.6ms)
- white_planner: `summon:cpu_bomuzo_2->cpu_back_right` (208.6ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は22点差で見送り、ためるは49点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面215点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 14 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `focus:cpu_back_left`
- white: `focus:cpu_back_left` (163.5ms)
- white_planner: `end_turn` (61.8ms)
- white reason: 有効攻撃がないためためる
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面144点、次点と3点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 15 challenger-as-player

- turn/current: 2 / cpu (white)
- selected: white / `master:shield->monster:cpu_front_right`
- white: `master:shield->monster:cpu_front_right` (113.2ms)
- white_planner: `master:shield->monster:cpu_front_left` (45.9ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は12点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面135点、次点と3点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 prep / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 17 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `attack:player_front_right:attack->monster:cpu_front_right`
- white: `attack:player_back_left:wild_claw->monster:cpu_front_left` (496.5ms)
- white_planner: `attack:player_front_right:attack->monster:cpu_front_right` (198.9ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は28点差で見送り、攻撃は366点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面145点、次点と0点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 18 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `attack:player_back_right:スパイクボール->monster:cpu_front_left`
- white: `attack:player_back_left:wild_claw->monster:cpu_front_left` (438.8ms)
- white_planner: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (158.7ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は159点差で見送り、ためるは194点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面127点、次点と9点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 19 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:player_back_left:wild_claw->monster:cpu_front_left` (463.7ms)
- white_planner: `end_turn` (22.9ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は27点差で見送り、ためるは310点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面127点
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act shield / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 22 challenger-as-player

- turn/current: 3 / cpu (white)
- selected: white / `focus:cpu_front_left`
- white: `focus:cpu_front_left` (339.9ms)
- white_planner: `end_turn` (92ms)
- white reason: 有効攻撃がないためためる / 見送り: 攻撃は46点差で見送り、ためるは159点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面200点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 23 challenger-as-player

- turn/current: 3 / cpu (white)
- selected: white / `attack:cpu_back_right:storm_bomb->monster:player_front_left`
- white: `attack:cpu_back_right:storm_bomb->monster:player_front_left` (141.2ms)
- white_planner: `end_turn` (41ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: ためるは116点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面188点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 26 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `summon:player_bomuzo_1->player_back_right`
- white: `attack:player_back_left:wild_claw->monster:cpu_front_left` (687.7ms)
- white_planner: `summon:player_bomuzo_1->player_back_right` (299.1ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は33点差で見送り、召喚は76点差で見送り
- planner reason: ボムゾウを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面169点、次点と0点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ピグミィ L1 HP3 act / player_back_left:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 27 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `attack:player_front_right:スパイクボール->monster:cpu_front_left`
- white: `attack:player_back_left:wild_claw->monster:cpu_front_right` (811.3ms)
- white_planner: `attack:player_front_right:スパイクボール->monster:cpu_front_left` (192.4ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 移動は206点差で見送り、攻撃は245点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面109点、次点と5点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ピグミィ L1 HP3 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ボムゾウ L1 HP6 prep / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 28 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:player_back_left:wild_claw->monster:cpu_front_right` (738.2ms)
- white_planner: `end_turn` (52ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は29点差で見送り、攻撃は165点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面109点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ピグミィ L1 HP3 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ボムゾウ L1 HP6 prep / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 29 challenger-as-player

- turn/current: 4 / cpu (white)
- selected: white / `focus:cpu_front_left`
- white: `focus:cpu_front_left` (952.4ms)
- white_planner: `end_turn` (587.6ms)
- white reason: 有効攻撃がないためためる / 見送り: 攻撃は28点差で見送り、攻撃は115点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面194点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ピグミィ L1 HP3 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ボムゾウ L1 HP6 prep / cpu_front_left:cpu:ボムゾウ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act / cpu_back_right:cpu:ボムゾウ L1 HP6 act

## Reading

- white_planner average decision 144.4ms, max 674.4ms.
- white_planner diverged from white 59 times; inspect samples before changing search depth.
- Some games hit the step/turn cap. Treat W-L-D as incomplete and use this run mainly for timing and decision-diff inspection.

## Next Steps

- Review decision diff samples and classify good/bad planner divergences.
- If planner average decision time stays practical, run both directions with count 3-5.
- Try opponentTerminalPlanDepth 2 as a v2 candidate.
