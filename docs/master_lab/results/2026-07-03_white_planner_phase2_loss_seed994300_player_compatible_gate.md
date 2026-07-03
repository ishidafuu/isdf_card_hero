# White Planner Phase 2

生成: 2026-07-03T14:56:30.974Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994300-994300
directions: challenger-as-player

## Summary

- games: 1
- wins: white_planner 1
- draws/undecided: 0
- issues: 0
- decision diffs: 1
- planner-selected diffs: 0

## Timing

| profile | decisions | avg ms | max ms | total ms |
| --- | ---: | ---: | ---: | ---: |
| white | 212 | 221.5ms | 1214ms | 46948.4ms |
| white_planner | 212 | 294.4ms | 1932ms | 62404.5ms |

## Games

| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| challenger-as-player | 994300 | P white_planner / C white | white_planner | 220 | 26 | P2/C0 | - | 1 | 0 |

## Decision Diff Samples

### seed 994300 step 98 challenger-as-player

- turn/current: 9 / cpu (white)
- selected: white / `attack:cpu_front_right:wild_claw->monster:player_front_left`
- white: `attack:cpu_front_right:wild_claw->monster:player_front_left` (551ms)
- white_planner: `attack:cpu_front_left:ダイン斬り->monster:player_front_left` (784.3ms)
- white reason: ヤンバルを削れるため攻撃 / 見送り: 攻撃は46点差で見送り、移動は197点差で見送り
- planner reason: 敵モンスターを撃破できるため攻撃 / ターンプラン探索: 返し込み最終盤面53点、次点と95点差
- board: player_front_left:player:ヤンバル L1 HP3 act / player_front_right:player:真勇者ダイン L3 HP6 act / player_back_left:player:真勇者ダイン L1 HP6 prep / player_back_right:player:ポリスピナー L1 HP3 act focus / cpu_front_left:cpu:真勇者ダイン L3 HP6 act / cpu_front_right:cpu:ヤンバル L1 HP3 act / cpu_back_left:cpu:ポリスピナー L1 HP3 act focus

## Reading

- white_planner average decision 294.4ms, max 1932ms.
- white_planner diverged from white 1 times; inspect samples before changing search depth.

## Next Steps

- Review decision diff samples and classify good/bad planner divergences.
- If planner average decision time stays practical, run both directions with count 3-5.
- Try opponentTerminalPlanDepth 2 as a v2 candidate.
