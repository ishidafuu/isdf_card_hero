# White Rollout Trigger Audit

生成: 2026-07-04T20:43:53.466Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994306-994313
directions: challenger-as-cpu, challenger-as-player
baseline: `white`, challenger: `white_planner`
inspectThresholdMs: 10000

## Conclusion

- 16 games. challenger wins 10, inspected decisions 1, rollout-triggered decisions 1.
- max challenger decision 78533.1ms, avg challenger decision 616ms.
- rollout adopted 1/1; avg selected rollout gap 278.2.
- Only one rollout-triggered decision was captured. Treat it as a local clue until the same feature repeats across seeds.

## Games

| seed | direction | result | steps | turns | HP | decisions | avg ms | max ms | events | issue |
| ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 994306 | challenger-as-cpu | white_planner | 175 | 22 | P0/C6 | 84 | 582.9 | 4742.1 | 0 | - |
| 994307 | challenger-as-cpu | white | 288 | 27 | P7/C0 | 158 | 660 | 3734.7 | 0 | - |
| 994308 | challenger-as-cpu | white_planner | 253 | 22 | P0/C7 | 126 | 655.1 | 3327 | 0 | - |
| 994309 | challenger-as-cpu | white_planner | 248 | 22 | P0/C2 | 122 | 640.8 | 4646.2 | 0 | - |
| 994310 | challenger-as-cpu | white | 204 | 21 | P10/C0 | 96 | 347.2 | 1627.9 | 0 | - |
| 994311 | challenger-as-cpu | white_planner | 217 | 26 | P0/C7 | 109 | 397.9 | 1906 | 0 | - |
| 994312 | challenger-as-cpu | white_planner | 227 | 27 | P0/C9 | 90 | 594.6 | 3070.2 | 0 | - |
| 994313 | challenger-as-cpu | white | 298 | 28 | P3/C0 | 138 | 754.1 | 3294.7 | 0 | - |
| 994306 | challenger-as-player | white_planner | 281 | 27 | P5/C0 | 137 | 1027.1 | 78533.1 | 1 | - |
| 994307 | challenger-as-player | white_planner | 292 | 27 | P7/C0 | 128 | 550.4 | 3009.6 | 0 | - |
| 994308 | challenger-as-player | white | 221 | 21 | P0/C4 | 114 | 702.5 | 4722.2 | 0 | - |
| 994309 | challenger-as-player | white_planner | 205 | 18 | P6/C0 | 99 | 593.7 | 2479 | 0 | - |
| 994310 | challenger-as-player | white_planner | 204 | 21 | P10/C0 | 103 | 409 | 2501.7 | 0 | - |
| 994311 | challenger-as-player | white | 240 | 21 | P0/C10 | 110 | 477.8 | 2475.2 | 0 | - |
| 994312 | challenger-as-player | white | 305 | 29 | P0/C5 | 158 | 618.2 | 4667.6 | 0 | - |
| 994313 | challenger-as-player | white_planner | 250 | 22 | P5/C0 | 123 | 844.2 | 3983.3 | 0 | - |

## Events

### seed 994306 / challenger-as-player / step 83 / turn 8

- elapsed: 78533.1ms / inspection 77161.5ms
- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- rolloutTriggered: true, adopted: true
- decision: summon:ボムゾウ->player_back_right
- fallback: move:player_front_right->player_back_left (333.6)
- planner selected: summon:ボムゾウ->player_back_right (115.6)
- root gap to fallback: 245.8
- planner margin to fallback: 43.6
- selected rollout gap to fallback: 278.2

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y |  | summon:ボムゾウ->player_back_right | summon:ボムゾウ->back-right; backlineReach; behindOwnFront:ヤンバルLv2HP3(act0/1); sameLaneEnemyFront:デスシープLv2HP6(act1/1); after:prepared; fallbackMove:player-front-right->player-back-left:keepsTo | 87.8 | 115.6 | 97.9 | 143.4 | 52.4 | - | -10.8 | 278.2 |
| 2 |  |  |  | summon:ボムゾウ->player_back_left | summon:ボムゾウ->back-left; backlineReach; behindOwnFront:ヤンバルLv1HP3(act0/1); sameLaneEnemyFront:ドノマンティスLv2HP5(act1/1,shield); after:prepared; fallbackMove:player-front-right->player-back-left:blocksTo | 87.8 | 78.8 | 97.9 | 143.4 | 52.4 | - | -255.8 | 33.2 |
| 3 |  |  | Y | move:player_front_right->player_back_left | move:player-front-right->player-back-left; mover:ヤンバルLv2HP3(act0/1); fallbackMove:player-front-right->player-back-left:keepsTo | 112 | 72 | 90.7 | 125 | 56.4 | - | -289 | 0 |
