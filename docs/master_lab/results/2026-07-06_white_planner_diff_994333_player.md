# White Planner Phase 2

生成: 2026-07-06T13:17:22.309Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994333-994333
directions: challenger-as-player

## Summary

- games: 1
- wins: white 1
- draws/undecided: 0
- issues: 0
- decision diffs: 2
- planner-selected diffs: 2

## Timing

| profile | decisions | avg ms | max ms | total ms |
| --- | ---: | ---: | ---: | ---: |
| white | 196 | 541.7ms | 4165.4ms | 106173.1ms |
| white_planner | 196 | 797.7ms | 6063.6ms | 156349.9ms |

## Games

| direction | seed | profiles | result | steps | turns | HP | issue | diff | planner selected diff |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: |
| challenger-as-player | 994333 | P white_planner / C white | white | 206 | 17 | P0/C2 | - | 2 | 2 |

## Decision Diff Samples

### seed 994333 step 98 challenger-as-player

- turn/current: 8 / player (white_planner)
- selected: white_planner / `attack:player_front_left:self_bomb->monster:cpu_front_left`
- white: `attack:player_back_right:スパイクボール->monster:cpu_front_left` (938.7ms)
- white_planner: `attack:player_front_left:self_bomb->monster:cpu_front_left` (1420.8ms)
- white reason: ボムゾウを削れるため攻撃 / 見送り: 攻撃は122点差で見送り、召喚は189点差で見送り
- planner reason: 敵モンスターを撃破できるため攻撃 / ターンプラン探索: 返し込み最終盤面168点、次点と27点差
- board: player_front_left:player:ボムゾウ L1 HP6 act / player_front_right:player:ドノマンティス L2 HP4 act / player_back_right:player:ピグミィ L2 HP3 act / cpu_front_left:cpu:ボムゾウ L2 HP2 act / cpu_front_right:cpu:デスシープ L1 HP6 prep / cpu_back_left:cpu:ヤンバル L1 HP3 act / cpu_back_right:cpu:ピグミィ L2 HP3 act shield

### seed 994333 step 190 challenger-as-player

- turn/current: 15 / player (white_planner)
- selected: white_planner / `attack:player_back_left:スパイクボール->monster:cpu_front_right`
- white: `attack:player_back_left:スパイクボール->monster:cpu_front_left` (477.2ms)
- white_planner: `attack:player_back_left:スパイクボール->monster:cpu_front_right` (494.1ms)
- white reason: ポリスピナーを削れるため攻撃 / 見送り: 攻撃は190点差で見送り、攻撃は292点差で見送り
- planner reason: 真勇者ダインを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面124点、次点と54点差
- board: player_front_left:player:真勇者ダイン L2 HP6 act / player_back_left:player:ピグミィ L2 HP3 act / cpu_front_left:cpu:ポリスピナー L1 HP3 act focus / cpu_front_right:cpu:真勇者ダイン L3 HP6 act

## Reading

- white_planner average decision 797.7ms, max 6063.6ms.
- white_planner diverged from white 2 times; inspect samples before changing search depth.

## Next Steps

- Review decision diff samples and classify good/bad planner divergences.
- If planner average decision time stays practical, run both directions with count 3-5.
- Try opponentTerminalPlanDepth 2 as a v2 candidate.
