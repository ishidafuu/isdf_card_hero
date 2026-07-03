# White Planner Phase 2

生成: 2026-07-03T14:53:23.109Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994300-994300
directions: challenger-as-player

## Summary

- games: 1
- wins: white 1
- draws/undecided: 0
- issues: 0
- decision diffs: 7
- planner-selected diffs: 6

## Timing

| profile | decisions | avg ms | max ms | total ms |
| --- | ---: | ---: | ---: | ---: |
| white | 163 | 428.1ms | 2574.2ms | 69781.1ms |
| white_planner | 163 | 594.7ms | 4266.4ms | 96930.4ms |

## Games

| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| challenger-as-player | 994300 | P white_planner / C white | white | 168 | 14 | P0/C9 | - | 7 | 6 |

## Decision Diff Samples

### seed 994300 step 8 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `focus:player_front_right`
- white: `move:player_back_left->player_front_right` (386.3ms)
- white_planner: `focus:player_front_right` (588.2ms)
- white reason: 前衛カードを前列へ出して攻撃しやすくするため移動 / 見送り: ためるは8点差で見送り、ためるは89点差で見送り
- planner reason: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面14点、次点と10点差
- board: player_front_left:player:ドノマンティス L1 HP5 act / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ボムゾウ L1 HP6 act / cpu_front_right:cpu:デスシープ L1 HP6 prep / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ヤンバル L1 HP3 prep

### seed 994300 step 12 challenger-as-player

- turn/current: 2 / player (white_planner)
- selected: white_planner / `master:shield->monster:player_front_right`
- white: `master:shield->monster:player_front_left` (94.5ms)
- white_planner: `master:shield->monster:player_front_right` (142.8ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は9点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面-82点、次点と5点差
- board: player_front_left:player:ドノマンティス L1 HP5 act focus / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ボムゾウ L1 HP6 act focus / cpu_front_right:cpu:デスシープ L1 HP6 prep / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep / cpu_back_right:cpu:ヤンバル L1 HP3 prep

### seed 994300 step 22 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `attack:player_front_left:storm_bomb->monster:cpu_front_right`
- white: `master:master_attack->monster:cpu_front_left` (293.9ms)
- white_planner: `attack:player_front_left:storm_bomb->monster:cpu_front_right` (336.6ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: 攻撃は51点差で見送り、攻撃は80点差で見送り
- planner reason: デスシープを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面-59点、次点と1点差
- board: player_front_left:player:ボムゾウ L1 HP6 act focus / player_front_right:player:ポリスピナー L1 HP3 act focus / player_back_left:player:ピグミィ L1 HP3 prep / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:デスシープ L1 HP6 act focus / cpu_back_left:cpu:ドノマンティス L1 HP5 prep / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 24 challenger-as-player

- turn/current: 3 / player (white_planner)
- selected: white_planner / `master:shield->monster:player_front_left`
- white: `master:master_attack->monster:cpu_front_right` (234ms)
- white_planner: `master:shield->monster:player_front_left` (325.3ms)
- white reason: ストーンに余裕があり敵を削れるためマスターアタック / 見送り: マスター特技は18点差で見送り、マスター特技は21点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面-71点、次点と1点差
- board: player_front_left:player:ボムゾウ L1 HP6 act / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ピグミィ L1 HP3 prep / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:デスシープ L1 HP3 act / cpu_back_left:cpu:ドノマンティス L1 HP5 prep / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 30 challenger-as-player

- turn/current: 3 / cpu (white)
- selected: white / `master:shield->monster:cpu_front_left`
- white: `master:shield->monster:cpu_front_left` (170.4ms)
- white_planner: `master:shield->monster:cpu_front_right` (224.9ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は15点差で見送り、マスター特技は22点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面47点、次点と8点差
- board: player_front_left:player:ボムゾウ L1 HP6 act shield / player_back_left:player:ピグミィ L1 HP3 prep / cpu_front_left:cpu:真勇者ダイン L1 HP6 act focus / cpu_front_right:cpu:デスシープ L2 HP6 act / cpu_back_left:cpu:ドノマンティス L1 HP5 act focus / cpu_back_right:cpu:ヤンバル L1 HP3 act

### seed 994300 step 58 challenger-as-player

- turn/current: 6 / player (white_planner)
- selected: white_planner / `summon:player_polyspinner_3->player_back_left`
- white: `focus:player_back_right` (608.2ms)
- white_planner: `summon:player_polyspinner_3->player_back_left` (723.2ms)
- white reason: 有効攻撃がないためためる / 見送り: 攻撃は115点差で見送り、攻撃は120点差で見送り
- planner reason: ポリスピナーを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面111点、次点と13点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act focus / player_front_right:player:デスシープ L1 HP2 act focus / player_back_right:player:ピグミィ L1 HP3 act / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:ヤンバル L1 HP3 act / cpu_back_right:cpu:ヤンバル L1 HP3 prep

### seed 994300 step 60 challenger-as-player

- turn/current: 6 / player (white_planner)
- selected: white_planner / `master:shield->monster:player_front_left`
- white: `master:shield->monster:player_front_right` (152.2ms)
- white_planner: `master:shield->monster:player_front_left` (217.6ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は184点差で見送り
- planner reason: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面49点、次点と8点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act focus / player_front_right:player:デスシープ L1 HP2 act focus / player_back_left:player:ポリスピナー L1 HP3 prep / player_back_right:player:ピグミィ L1 HP3 act focus / cpu_front_left:cpu:真勇者ダイン L1 HP6 act / cpu_front_right:cpu:ドノマンティス L1 HP5 act / cpu_back_left:cpu:ヤンバル L1 HP3 act / cpu_back_right:cpu:ヤンバル L1 HP3 prep

## Reading

- white_planner average decision 594.7ms, max 4266.4ms.
- white_planner diverged from white 7 times; inspect samples before changing search depth.

## Next Steps

- Review decision diff samples and classify good/bad planner divergences.
- If planner average decision time stays practical, run both directions with count 3-5.
- Try opponentTerminalPlanDepth 2 as a v2 candidate.
