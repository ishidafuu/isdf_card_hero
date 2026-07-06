# White Planner Phase 2

生成: 2026-07-06T13:15:34.528Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994325-994325
directions: challenger-as-cpu

## Summary

- games: 1
- wins: white 1
- draws/undecided: 0
- issues: 0
- decision diffs: 1
- planner-selected diffs: 0

## Timing

| profile | decisions | avg ms | max ms | total ms |
| --- | ---: | ---: | ---: | ---: |
| white | 156 | 399ms | 4061.4ms | 62248.2ms |
| white_planner | 156 | 593.8ms | 6015.8ms | 92639.5ms |

## Games

| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| challenger-as-cpu | 994325 | P white / C white_planner | white | 163 | 17 | P10/C0 | - | 1 | 0 |

## Decision Diff Samples

### seed 994325 step 13 challenger-as-cpu

- turn/current: 2 / player (white)
- selected: white / `master:shield->monster:player_front_left`
- white: `master:shield->monster:player_front_left` (108.7ms)
- white_planner: `master:shield->monster:player_front_right` (391ms)
- white reason: 高価値の味方を守るためシールド / 見送り: マスター特技は10点差で見送り
- planner reason: 高価値の味方を守るためシールド / 盾対象応答評価: 次自ターン168点、fallback比10点差
- board: player_front_left:player:ボムゾウ L1 HP6 act focus / player_front_right:player:ポリスピナー L1 HP3 act / player_back_left:player:ヤンバル L1 HP3 act focus / player_back_right:player:ピグミィ L1 HP3 prep / cpu_front_left:cpu:ボムゾウ L1 HP6 prep / cpu_front_right:cpu:ドノマンティス L1 HP5 prep / cpu_back_left:cpu:真勇者ダイン L1 HP6 prep

## Reading

- white_planner average decision 593.8ms, max 6015.8ms.
- white_planner diverged from white 1 times; inspect samples before changing search depth.

## Next Steps

- Review decision diff samples and classify good/bad planner divergences.
- If planner average decision time stays practical, run both directions with count 3-5.
- Try opponentTerminalPlanDepth 2 as a v2 candidate.
