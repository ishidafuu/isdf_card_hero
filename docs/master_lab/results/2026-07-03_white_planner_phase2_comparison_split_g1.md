# White Planner Phase 2

生成: 2026-07-03T14:01:36.703Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994120-994120
directions: challenger-as-cpu, challenger-as-player

## Summary

- games: 2
- wins: -
- draws/undecided: 2
- issues: 2
- decision diffs: 19
- planner-selected diffs: 11

## Timing

| profile | decisions | avg ms | max ms | total ms |
| --- | ---: | ---: | ---: | ---: |
| white | 117 | 300.7ms | 1623.8ms | 35180.8ms |
| white_planner | 117 | 145ms | 928.8ms | 16966.9ms |

## Games

| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| challenger-as-cpu | 994120 | P white / C white_planner | draw | 60 | 6 | P10/C10 | winner was not decided within 60 auto steps | 8 | 2 |
| challenger-as-player | 994120 | P white_planner / C white | draw | 60 | 6 | P10/C10 | winner was not decided within 60 auto steps | 11 | 9 |

## Decision Diff Samples

### seed 994120 step 8 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `focus:player_front_left`
- white: `focus:player_front_left` (577.4ms)
- white_planner: `focus:player_front_right` (267.8ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは4点差で見送り、移動は8点差で見送り
- planner reason: 有効攻撃がないためためる / 見送り: 移動は5点差で見送り、召喚は42点差で見送り
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 15 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `master:master_attack->monster:player_front_left`
- white: `attack:cpu_front_right:attack->monster:player_front_right` (775.2ms)
- white_planner: `master:master_attack->monster:player_front_left` (494.9ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: マスター特技は125点差で見送り、召喚は207点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / ターンプラン探索: 返し込み最終盤面151点、次点と74点差
- board: player_front_left:player:ヤンバル L1 HP2 act / player_front_right:player:真勇者ダイン L1 HP6 act shield focus / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act

### seed 994120 step 19 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `focus:player_front_right`
- white: `focus:player_front_right` (394ms)
- white_planner: `attack:player_front_left:attack->monster:cpu_front_left` (371.5ms)
- white reason: 有効攻撃がないためためる / 見送り: 攻撃は151点差で見送り、召喚は156点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面321点、次点と8点差
- board: player_front_left:player:ポリスピナー L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act focus

### seed 994120 step 20 challenger-as-cpu

- turn/current: 3 / player (white)
- selected: white / `summon:player_card_037_1->player_back_left`
- white: `summon:player_card_037_1->player_back_left` (209.8ms)
- white_planner: `attack:player_front_left:attack->monster:cpu_front_left` (247.1ms)
- white reason: ドノマンティスを空き枠へ召喚 / 見送り: 攻撃は10点差で見送り、ためるは44点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面309点、次点と34点差
- board: player_front_left:player:ポリスピナー L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:ボムゾウ L1 HP4 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:デスシープ L1 HP6 act focus

### seed 994120 step 31 challenger-as-cpu

- turn/current: 3 / cpu (white_planner)
- selected: white_planner / `master:shield->monster:cpu_front_left`
- white: `summon:cpu_card_037_3->cpu_back_right` (182.4ms)
- white_planner: `master:shield->monster:cpu_front_left` (90.7ms)
- white reason: カードを後列右へ召喚 / 見送り: 召喚は24点差で見送り、マスター特技は163点差で見送り
- planner reason: 高価値の味方を守るためシールド / 見送り: 召喚は1点差で見送り、召喚は6点差で見送り
- board: player_front_right:player:真勇者ダイン L1 HP6 act shield / player_back_left:player:ドノマンティス L1 HP5 prep / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:デスシープ L2 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP4 act / cpu_back_left:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 33 challenger-as-cpu

- turn/current: 4 / player (white)
- selected: white / `focus:player_front_left`
- white: `focus:player_front_left` (303.5ms)
- white_planner: `attack:player_front_right:ダイン斬り->monster:cpu_front_right` (342.2ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は175点差で見送り、攻撃は251点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / 見送り: マスター特技は22点差で見送り、ためるは40点差で見送り
- board: player_front_left:player:ドノマンティス L1 HP5 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:デスシープ L2 HP6 act shield / cpu_front_right:cpu:ドノマンティス L1 HP4 act / cpu_back_left:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 34 challenger-as-cpu

- turn/current: 4 / player (white)
- selected: white / `summon:player_bomuzo_1->player_back_left`
- white: `summon:player_bomuzo_1->player_back_left` (256.3ms)
- white_planner: `attack:player_front_right:ダイン斬り->monster:cpu_front_right` (225.3ms)
- white reason: ボムゾウを空き枠へ召喚 / 見送り: マスター特技は86点差で見送り、攻撃は116点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / 見送り: マスター特技は21点差で見送り、召喚は211点差で見送り
- board: player_front_left:player:ドノマンティス L1 HP5 act focus / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:デスシープ L2 HP6 act shield / cpu_front_right:cpu:ドノマンティス L1 HP4 act / cpu_back_left:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 47 challenger-as-cpu

- turn/current: 5 / player (white)
- selected: white / `attack:player_back_right:スパイクボール->monster:cpu_front_left`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (593.9ms)
- white_planner: `end_turn` (37.8ms)
- white reason: デスシープを削れるため攻撃 / 見送り: 攻撃は112点差で見送り、マスター特技は115点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面54点
- board: player_front_left:player:ボムゾウ L2 HP5 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:デスシープ L2 HP6 act / cpu_front_right:cpu:真勇者ダイン L1 HP6 prep / cpu_back_left:cpu:ボムゾウ L1 HP6 act

### seed 994120 step 8 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `focus:player_front_right`
- white: `focus:player_front_left` (569.8ms)
- white_planner: `focus:player_front_right` (266.5ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは4点差で見送り、移動は8点差で見送り
- planner reason: 有効攻撃がないためためる / 見送り: 移動は5点差で見送り、召喚は42点差で見送り
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 9 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `move:player_front_left->player_back_left`
- white: `move:player_front_left->player_back_right` (371.1ms)
- white_planner: `move:player_front_left->player_back_left` (157.7ms)
- white reason: 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: 移動は21点差で見送り、ためるは64点差で見送り
- planner reason: 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: 召喚は41点差で見送り、ためるは55点差で見送り
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L1 HP6 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994120 step 20 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `summon:player_card_037_1->player_back_left`
- white: `move:player_front_left->player_back_left` (242.1ms)
- white_planner: `summon:player_card_037_1->player_back_left` (118.2ms)
- white reason: 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: 移動は104点差で見送り、召喚は117点差で見送り
- planner reason: ドノマンティスを空き枠へ召喚 / 見送り: 移動は4点差で見送り、移動は7点差で見送り
- board: player_front_left:player:ピグミィ L1 HP3 act focus / player_front_right:player:ポリスピナー L1 HP3 act focus / player_back_right:player:真勇者ダイン L1 HP6 act focus / cpu_front_left:cpu:デスシープ L1 HP6 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_right:cpu:ドノマンティス L1 HP5 act focus

### seed 994120 step 28 challenger-as-player

- turn/current: 4 / player (white_planner)
- selected: white_planner / `attack:player_front_right:スパイクボール->monster:cpu_front_left`
- white: `move:player_front_right->player_back_left` (581.2ms)
- white_planner: `attack:player_front_right:スパイクボール->monster:cpu_front_left` (284ms)
- white reason: 移動後に強い攻撃筋を作れるため移動 / 見送り: 移動は18点差で見送り、攻撃は19点差で見送り
- planner reason: デスシープを削れるため攻撃 / 見送り: 移動は13点差で見送り、移動は31点差で見送り
- board: player_front_left:player:真勇者ダイン L1 HP6 act focus / player_front_right:player:ピグミィ L1 HP3 act / player_back_left:player:ドノマンティス L1 HP5 act / cpu_front_left:cpu:デスシープ L1 HP6 act focus / cpu_front_right:cpu:ボムゾウ L1 HP4 act / cpu_back_right:cpu:ドノマンティス L1 HP5 act focus

### seed 994120 step 35 challenger-as-player

- turn/current: 4 / cpu (white)
- selected: white / `focus:cpu_front_left`
- white: `focus:cpu_front_left` (620.3ms)
- white_planner: `master:master_attack->monster:player_front_right` (246.5ms)
- white reason: 有効攻撃がないためためる / 見送り: マスター特技は11点差で見送り、召喚は113点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / ターンプラン探索: 返し込み最終盤面142点、次点と55点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act focus / player_front_right:player:ドノマンティス L1 HP2 act / player_back_left:player:ピグミィ L1 HP3 act / player_back_right:player:ボムゾウ L1 HP6 prep / cpu_front_left:cpu:デスシープ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act

### seed 994120 step 37 challenger-as-player

- turn/current: 4 / cpu (white)
- selected: white / `summon:cpu_card_037_3->cpu_back_left`
- white: `summon:cpu_card_037_3->cpu_back_left` (187.5ms)
- white_planner: `summon:cpu_card_047_2->cpu_back_left` (73.4ms)
- white reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は5点差で見送り
- planner reason: カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面32点、次点と0点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act focus / player_back_left:player:ピグミィ L1 HP3 act / player_back_right:player:ボムゾウ L1 HP6 prep / cpu_front_left:cpu:デスシープ L1 HP6 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act

### seed 994120 step 39 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `attack:player_back_left:スパイクボール->monster:cpu_front_left`
- white: `attack:player_front_right:self_bomb->monster:cpu_front_right` (387.7ms)
- white_planner: `attack:player_back_left:スパイクボール->monster:cpu_front_left` (140ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は214点差で見送り、攻撃は230点差で見送り
- planner reason: デスシープを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面110点、次点と22点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act focus / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:デスシープ L1 HP6 act focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 prep

### seed 994120 step 40 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `attack:player_front_left:ダイン斬り->monster:cpu_front_left`
- white: `attack:player_front_right:self_bomb->monster:cpu_front_right` (362.7ms)
- white_planner: `attack:player_front_left:ダイン斬り->monster:cpu_front_left` (48.1ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は13点差で見送り、攻撃は39点差で見送り
- planner reason: デスシープを削れるため攻撃 / 見送り: 攻撃は1点差で見送り、攻撃は25点差で見送り
- board: player_front_left:player:真勇者ダイン L1 HP6 act focus / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:デスシープ L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 prep

### seed 994120 step 41 challenger-as-player

- turn/current: 5 / player (white_planner)
- selected: white_planner / `master:master_attack->monster:cpu_front_left`
- white: `focus:player_front_right` (423.8ms)
- white_planner: `master:master_attack->monster:cpu_front_left` (359.1ms)
- white reason: 有効攻撃がないためためる / 見送り: マスター特技は90点差で見送り、攻撃は329点差で見送り
- planner reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は13点差で見送り、攻撃は13点差で見送り
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:デスシープ L1 HP3 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:ドノマンティス L1 HP5 prep

### seed 994120 step 53 challenger-as-player

- turn/current: 6 / player (white_planner)
- selected: white_planner / `attack:player_front_right:self_bomb->monster:cpu_front_right`
- white: `attack:player_front_left:ダイン斬り->monster:cpu_front_left` (1011.5ms)
- white_planner: `attack:player_front_right:self_bomb->monster:cpu_front_right` (649.4ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: 攻撃は101点差で見送り、マスター特技は132点差で見送り
- planner reason: ドノマンティスを削れるため攻撃 / 見送り: マスター特技は31点差で見送り、攻撃は118点差で見送り
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act focus / player_back_left:player:ピグミィ L2 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act shield focus / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

### seed 994120 step 54 challenger-as-player

- turn/current: 6 / player (white_planner)
- selected: white_planner / `master:master_attack->monster:cpu_front_right`
- white: `attack:player_front_left:ダイン斬り->monster:cpu_front_left` (896.4ms)
- white_planner: `master:master_attack->monster:cpu_front_right` (537.5ms)
- white reason: ドノマンティスを削れるため攻撃 / 見送り: マスター特技は15点差で見送り、攻撃は36点差で見送り
- planner reason: マスターアタックで敵モンスターを撃破できるため使用 / ターンプラン探索: 返し込み最終盤面106点、次点と130点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ボムゾウ L1 HP4 act / player_back_left:player:ピグミィ L2 HP3 act / cpu_front_left:cpu:ドノマンティス L1 HP5 act shield focus / cpu_front_right:cpu:ドノマンティス L1 HP2 act / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ボムゾウ L1 HP6 prep

## Reading

- white_planner average decision 145ms, max 928.8ms.
- white_planner diverged from white 19 times; inspect samples before changing search depth.
- Some games hit the step/turn cap. Treat W-L-D as incomplete and use this run mainly for timing and decision-diff inspection.

## Next Steps

- Review decision diff samples and classify good/bad planner divergences.
- If planner average decision time stays practical, run both directions with count 3-5.
- Try opponentTerminalPlanDepth 2 as a v2 candidate.
