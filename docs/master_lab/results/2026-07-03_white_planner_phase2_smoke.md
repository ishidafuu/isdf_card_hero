# White Planner Phase 2

生成: 2026-07-03T13:35:17.530Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994100-994100
directions: challenger-as-cpu

## Summary

- games: 1
- wins: -
- draws/undecided: 1
- issues: 1
- decision diffs: 13
- planner-selected diffs: 4

## Timing

| profile | decisions | avg ms | max ms | total ms |
| --- | ---: | ---: | ---: | ---: |
| white | 28 | 574.6ms | 3094.4ms | 16087.8ms |
| white_planner | 28 | 183.6ms | 924.2ms | 5141.6ms |

## Games

| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| challenger-as-cpu | 994100 | P white / C white_planner | draw | 30 | 4 | P10/C10 | winner was not decided within 30 auto steps | 13 | 4 |

## Decision Diff Samples

### seed 994100 step 6 challenger-as-cpu

- turn/current: 1 / cpu (white_planner)
- selected: white_planner / `summon:cpu_bomuzo_1->cpu_front_right`
- white: `summon:cpu_bomuzo_1->cpu_back_right` (75.3ms)
- white_planner: `summon:cpu_bomuzo_1->cpu_front_right` (41.9ms)
- white reason: カードを後列右へ召喚 / 見送り: 召喚は1点差で見送り、召喚は3点差で見送り
- planner reason: 前衛カードを前列右へ召喚 / ターンプラン探索: 返し込み最終盤面-81点、次点と0点差
- board: player_front_left:player:真勇者ダイン L1 HP6 prep / player_front_right:player:ボムゾウ L1 HP6 prep / player_back_left:player:ヤンバル L1 HP3 prep / cpu_front_left:cpu:デスシープ L1 HP6 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994100 step 8 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `focus:player_front_left`
- white: `focus:player_front_left` (577.2ms)
- white_planner: `summon:player_card_051_3->player_back_right` (238.4ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは1点差で見送り、召喚は2点差で見送り
- planner reason: 後衛カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面-68点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / cpu_front_left:cpu:デスシープ L1 HP6 prep / cpu_front_right:cpu:ボムゾウ L1 HP6 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994100 step 10 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `focus:player_front_right`
- white: `focus:player_front_right` (282.3ms)
- white_planner: `end_turn` (113ms)
- white reason: 有効攻撃がないためためる / 見送り: ためるは47点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-149点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 prep / cpu_front_left:cpu:デスシープ L1 HP6 prep / cpu_front_right:cpu:ボムゾウ L1 HP6 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994100 step 11 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `focus:player_back_left`
- white: `focus:player_back_left` (174.6ms)
- white_planner: `end_turn` (72.5ms)
- white reason: 有効攻撃がないためためる
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-161点、次点と6点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 prep / cpu_front_left:cpu:デスシープ L1 HP6 prep / cpu_front_right:cpu:ボムゾウ L1 HP6 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994100 step 12 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `master:shield->monster:player_front_left`
- white: `master:shield->monster:player_front_left` (128.5ms)
- white_planner: `end_turn` (52.8ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- planner reason: 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-173点、次点と4点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 prep / cpu_front_left:cpu:デスシープ L1 HP6 prep / cpu_front_right:cpu:ボムゾウ L1 HP6 prep / cpu_back_left:cpu:デスシープ L1 HP6 prep

### seed 994100 step 14 challenger-as-cpu

- turn/current: 2 / cpu (white_planner)
- selected: white_planner / `summon:cpu_bomuzo_3->cpu_back_right`
- white: `focus:cpu_front_right` (2036.6ms)
- white_planner: `summon:cpu_bomuzo_3->cpu_back_right` (698.5ms)
- white reason: 有効攻撃がないためためる / 見送り: 召喚は100点差で見送り、召喚は112点差で見送り
- planner reason: カードを後列右へ召喚 / ターンプラン探索: 返し込み最終盤面18点、次点と5点差
- board: player_front_left:player:真勇者ダイン L1 HP6 act shield / player_front_right:player:ボムゾウ L1 HP6 act / player_back_left:player:ヤンバル L1 HP3 act / player_back_right:player:ピグミィ L1 HP3 prep / cpu_front_left:cpu:デスシープ L1 HP6 act / cpu_front_right:cpu:ボムゾウ L1 HP6 act / cpu_back_left:cpu:デスシープ L1 HP6 act

## Reading

- white_planner average decision 183.6ms, max 924.2ms.
- white_planner diverged from white 13 times; inspect samples before changing search depth.
- Some games hit the step/turn cap. Treat W-L-D as incomplete and use this run mainly for timing and decision-diff inspection.

## Next Steps

- Review decision diff samples and classify good/bad planner divergences.
- If planner average decision time stays practical, run both directions with count 3-5.
- Try opponentTerminalPlanDepth 2 as a v2 candidate.
