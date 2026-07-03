# White Planner Phase 2

生成: 2026-07-03T14:49:38.654Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994300-994300
directions: challenger-as-player

## Summary

- games: 1
- wins: white 1
- draws/undecided: 0
- issues: 0
- decision diffs: 16
- planner-selected diffs: 9

## Timing

| profile | decisions | avg ms | max ms | total ms |
| --- | ---: | ---: | ---: | ---: |
| white | 118 | 283.8ms | 1510.1ms | 33490.1ms |
| white_planner | 118 | 384.8ms | 2218.7ms | 45409.6ms |

## Games

| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| challenger-as-player | 994300 | P white_planner / C white | white | 121 | 12 | P0/C7 | - | 16 | 9 |

## Decision Diff Samples

### seed 994300 step 8 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `focus:player_front_right`
- white: `move:player_back_left->player_front_right` (385.1ms)
- white_planner: `focus:player_front_right` (587.1ms)
- white reason: 前衛カードを前列へ出して攻撃しやすくするため移動 / 見送り: ためるは8点差で見送り、ためるは89点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面14点、次点と10点差
- board: player_front_left:player:ドノマンティス L1 HP5 act / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ボムゾウ L1 HP6 act / cpu_front_right:cpu:デスシープ L1 HP6 prep / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ヤンバル L1 HP3 prep

### seed 994300 step 12 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `master:shield->monster:player_front_right`
- white: `master:shield->monster:player_front_left` (94.7ms)
- white_planner: `master:shield->monster:player_front_right` (140.2ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は9点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面-82点、次点と5点差
- board: player_front_left:player:ドノマンティス L1 HP5 act focus / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ボムゾウ L1 HP6 act focus / cpu_front_right:cpu:デスシープ L1 HP6 prep / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ヤンバル L1 HP3 prep

### seed 994300 step 22 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `attack:player_front_left:storm_bomb->monster:cpu_front_right`
- white: `master:master_attack->monster:cpu_front_left` (288.9ms)
- white_planner: `attack:player_front_left:storm_bomb->monster:cpu_front_right` (332.5ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は51点差で見送り、攻撃は80点差で見送り
- planner reason: デスシープを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面-59点、次点と1点差
- board: player_front_left:player:ボムゾウ L1 HP6 act focus / player_front_right:player:ポリスピナー L1 HP3 act focus / player_back_left:player:ピグミィ L1 HP3 prep / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:デスシープ L1 HP6 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 prep / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 23 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `attack:player_front_right:attack->monster:cpu_front_right` (491.5ms)
- white_planner: `end_turn` (507ms)
- white reason: デスシープを削れるため攻撃 / 見送り: 攻撃は169点差で見送り、マスター特技は182点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-93点
- board: player_front_left:player:ボムゾウ L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 act focus / player_back_left:player:ピグミィ L1 HP3 prep / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:デスシープ L1 HP6 act / cpu_back_left:cpu:ドノマンティス L1 HP5 prep / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 28 challenger-as-player

- turn/current: 3 / cpu (white)
- selected: white / `master:shield->monster:cpu_front_left`
- white: `master:shield->monster:cpu_front_left` (167.5ms)
- white_planner: `master:shield->monster:cpu_front_right` (221.3ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は15点差で見送り、マスター特技は22点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面35点、次点と8点差
- board: player_front_left:player:ボムゾウ L1 HP6 act / player_back_left:player:ピグミィ L1 HP3 prep / cpu_front_left:cpu:真勇者ダイン L1 HP6 act focus / cpu_front_right:cpu:デスシープ L2 HP6 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 49 challenger-as-player

- turn/current: 5 / cpu (white)
- selected: white / `move:cpu_front_right->cpu_back_right`
- white: `move:cpu_front_right->cpu_back_right` (484.1ms)
- white_planner: `summon:cpu_card_047_1->cpu_back_right` (687.7ms)
- white reason: 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: 攻撃は56点差で見送り、召喚は99点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面187点、次点と21点差
- board: player_front_left:player:ボムゾウ L1 HP6 act focus / player_front_right:player:デスシープ L2 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 prep / cpu_front_left:cpu:真勇者ダイン L2 HP6 act / cpu_front_right:cpu:ヤンバル L1 HP3 act / cpu_back_left:cpu:ヤンバル L1 HP3 act

### seed 994300 step 52 challenger-as-player

- turn/current: 5 / cpu (white)
- selected: white / `master:master_attack->monster:player_front_left`
- white: `master:master_attack->monster:player_front_left` (246.5ms)
- white_planner: `attack:cpu_front_left:ダイン斬り->monster:player_front_left` (308.8ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は151点差で見送り、ためるは437点差で見送り
- planner reason: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面38点、次点と83点差
- board: player_front_left:player:ボムゾウ L1 HP5 act / player_front_right:player:デスシープ L2 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 prep / cpu_front_left:cpu:真勇者ダイン L2 HP6 act / cpu_front_right:cpu:真勇者ダイン L1 HP6 prep / cpu_back_left:cpu:ヤンバル L1 HP3 act / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 66 challenger-as-player

- turn/current: 7 / player (white_planner)
- selected: white_planner / `summon:player_card_047_3->player_back_left`
- white: `attack:player_front_right:attack->monster:cpu_front_right` (395ms)
- white_planner: `summon:player_card_047_3->player_back_left` (477.4ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: 召喚は109点差で見送り、召喚は109点差で見送り
- planner reason: 真勇者ダインを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面117点、次点と0点差
- board: player_front_left:player:ポリスピナー L1 HP3 act / player_front_right:player:デスシープ L2 HP6 act / cpu_front_left:cpu:真勇者ダイン L3 HP6 act / cpu_front_right:cpu:真勇者ダイン L1 HP6 act focus / cpu_back_left:cpu:ヤンバル L1 HP3 act / cpu_back_right:cpu:ヤンバル L1 HP3 act focus

### seed 994300 step 67 challenger-as-player

- turn/current: 7 / player (white_planner)
- selected: white_planner / `focus:player_front_left`
- white: `attack:player_front_left:attack->monster:cpu_front_left` (290.9ms)
- white_planner: `focus:player_front_left` (319.7ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: 攻撃は54点差で見送り、マスター特技は98点差で見送り
- planner reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / ターンプラン探索: 返し込み最終盤面35点、次点と20点差
- board: player_front_left:player:ポリスピナー L1 HP3 act / player_front_right:player:デスシープ L2 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 prep / cpu_front_left:cpu:真勇者ダイン L3 HP6 act / cpu_front_right:cpu:真勇者ダイン L1 HP6 act focus / cpu_back_left:cpu:ヤンバル L1 HP3 act / cpu_back_right:cpu:ヤンバル L1 HP3 act focus

### seed 994300 step 85 challenger-as-player

- turn/current: 8 / cpu (white)
- selected: white / `move:cpu_front_left->cpu_back_left`
- white: `move:cpu_front_left->cpu_back_left` (241ms)
- white_planner: `summon:cpu_yanbaru_2->cpu_back_left` (340.7ms)
- white reason: 後衛カードを後列へ戻して射程を活かすため移動 / 見送り: 召喚は31点差で見送り、攻撃は81点差で見送り
- planner reason: 後衛カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面123点、次点と41点差
- board: player_front_left:player:真勇者ダイン L1 HP5 act / player_back_left:player:ヤンバル L2 HP3 act / cpu_front_left:cpu:ヤンバル L1 HP3 act / cpu_front_right:cpu:真勇者ダイン L3 HP6 act / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 90 challenger-as-player

- turn/current: 9 / player (white_planner)
- selected: white_planner / `summon:player_card_037_2->player_front_right`
- white: `focus:player_front_left` (358.1ms)
- white_planner: `summon:player_card_037_2->player_front_right` (455.8ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は12点差で見送り、召喚は60点差で見送り
- planner reason: 前衛カードを前列右へ召喚 / ターンプラン探索: 返し込み最終盤面84点、次点と15点差
- board: player_front_left:player:真勇者ダイン L1 HP5 act / player_back_left:player:ヤンバル L2 HP3 act / cpu_front_right:cpu:真勇者ダイン L3 HP6 act / cpu_back_left:cpu:ヤンバル L1 HP3 act / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 92 challenger-as-player

- turn/current: 9 / player (white_planner)
- selected: white_planner / `master:shield->monster:player_front_left`
- white: `end_turn` (90.4ms)
- white_planner: `master:shield->monster:player_front_left` (115.2ms)
- white reason: 有効な行動がないためターン終了 / 見送り: マスター特技は8点差で見送り、マスター特技は355点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面-17点、次点と28点差
- board: player_front_left:player:真勇者ダイン L1 HP5 act focus / player_front_right:player:ドノマンティス L1 HP5 prep / player_back_left:player:ヤンバル L2 HP3 act / cpu_front_right:cpu:真勇者ダイン L3 HP6 act / cpu_back_left:cpu:ヤンバル L1 HP3 act / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 96 challenger-as-player

- turn/current: 9 / cpu (white)
- selected: white / `attack:cpu_back_right:wild_claw->monster:player_front_left`
- white: `attack:cpu_back_right:wild_claw->monster:player_front_left` (1027.9ms)
- white_planner: `focus:cpu_back_right` (1213.3ms)
- white reason: 真勇者ダインを削れるため攻撃 / 見送り: 攻撃は76点差で見送り、ためるは81点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面46点、次点と36点差
- board: player_front_left:player:真勇者ダイン L1 HP5 act shield focus / player_front_right:player:ドノマンティス L1 HP5 prep / player_back_left:player:ヤンバル L2 HP3 act / cpu_front_left:cpu:ヤンバル L1 HP3 act / cpu_front_right:cpu:真勇者ダイン L3 HP6 act / cpu_back_left:cpu:ヤンバル L1 HP3 prep / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 97 challenger-as-player

- turn/current: 9 / cpu (white)
- selected: white / `attack:cpu_front_left:wild_claw->monster:player_back_left`
- white: `attack:cpu_front_left:wild_claw->monster:player_back_left` (464.1ms)
- white_planner: `focus:cpu_front_left` (593.7ms)
- white reason: ヤンバルを削れるため攻撃 / 見送り: ためるは1点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面-20点、次点と35点差
- board: player_front_left:player:真勇者ダイン L1 HP5 act shield / player_front_right:player:ドノマンティス L1 HP5 prep / player_back_left:player:ヤンバル L2 HP3 act / cpu_front_left:cpu:ヤンバル L1 HP3 act / cpu_front_right:cpu:真勇者ダイン L3 HP6 act / cpu_back_left:cpu:ヤンバル L1 HP3 prep / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 105 challenger-as-player

- turn/current: 10 / player (white_planner)
- selected: white_planner / `end_turn`
- white: `summon:player_bomuzo_3->player_back_right` (128ms)
- white_planner: `end_turn` (145.1ms)
- white reason: ボムゾウを空き枠へ召喚
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-275点
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ドノマンティス L1 HP5 act focus / player_back_left:player:ヤンバル L2 HP1 act / cpu_front_right:cpu:真勇者ダイン L3 HP6 act shield / cpu_back_left:cpu:ヤンバル L1 HP3 prep / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 108 challenger-as-player

- turn/current: 10 / cpu (white)
- selected: white / `master:master_attack->monster:player_front_right`
- white: `master:master_attack->monster:player_front_right` (199.7ms)
- white_planner: `attack:cpu_front_right:ダイン斬り->monster:player_front_right` (231.8ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は172点差で見送り、召喚は236点差で見送り
- planner reason: 敵モンスターを撃破できるため攻撃 / ターンプラン探索: 返し込み最終盤面50点、次点と78点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_front_right:player:ドノマンティス L1 HP4 act / cpu_front_left:cpu:ヤンバル L2 HP3 act / cpu_front_right:cpu:真勇者ダイン L3 HP6 act / cpu_back_right:cpu:ヤンバル L1 HP3 act

## Reading

- white_planner average decision 384.8ms, max 2218.7ms.
- white_planner diverged from white 16 times; inspect samples before changing search depth.

## Next Steps

- Review decision diff samples and classify good/bad planner divergences.
- If planner average decision time stays practical, run both directions with count 3-5.
- Try opponentTerminalPlanDepth 2 as a v2 candidate.
