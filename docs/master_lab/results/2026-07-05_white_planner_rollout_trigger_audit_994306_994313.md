# White Rollout Trigger Audit

生成: 2026-07-04T20:07:49.667Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994306-994313
directions: challenger-as-cpu, challenger-as-player
baseline: `white`, challenger: `white_planner`
inspectThresholdMs: 10000

## Conclusion

- 16 games. challenger wins 10, inspected decisions 3, rollout-triggered decisions 3.
- max challenger decision 97374.8ms, avg challenger decision 712.1ms.
- rollout adopted 3/3; avg selected rollout gap 92.7.
- Next implementation target is the repeated rollout-trigger shape, not a broad coefficient change.

## Games

| seed | direction | result | steps | turns | HP | decisions | avg ms | max ms | events | issue |
| ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 994306 | challenger-as-cpu | white_planner | 175 | 22 | P0/C6 | 84 | 579.9 | 4725.9 | 0 | - |
| 994307 | challenger-as-cpu | white | 288 | 27 | P7/C0 | 158 | 657.8 | 3798 | 0 | - |
| 994308 | challenger-as-cpu | white_planner | 253 | 22 | P0/C7 | 126 | 652.7 | 3303.1 | 0 | - |
| 994309 | challenger-as-cpu | white_planner | 248 | 22 | P0/C2 | 122 | 638.4 | 4645.3 | 0 | - |
| 994310 | challenger-as-cpu | white | 204 | 21 | P10/C0 | 96 | 346.9 | 1583.5 | 0 | - |
| 994311 | challenger-as-cpu | white_planner | 217 | 26 | P0/C7 | 109 | 397.8 | 1906.4 | 0 | - |
| 994312 | challenger-as-cpu | white_planner | 227 | 27 | P0/C9 | 90 | 596.8 | 3082.1 | 0 | - |
| 994313 | challenger-as-cpu | white | 298 | 28 | P3/C0 | 138 | 760.2 | 3295.5 | 0 | - |
| 994306 | challenger-as-player | white_planner | 281 | 27 | P5/C0 | 137 | 1031.3 | 78644 | 1 | - |
| 994307 | challenger-as-player | white_planner | 292 | 27 | P7/C0 | 128 | 1306.1 | 97374.8 | 1 | - |
| 994308 | challenger-as-player | white | 221 | 21 | P0/C4 | 114 | 703.3 | 4742.4 | 0 | - |
| 994309 | challenger-as-player | white_planner | 205 | 18 | P6/C0 | 99 | 592.2 | 2482.2 | 0 | - |
| 994310 | challenger-as-player | white_planner | 204 | 21 | P10/C0 | 103 | 1192.3 | 80602.7 | 1 | - |
| 994311 | challenger-as-player | white | 240 | 21 | P0/C10 | 110 | 480.3 | 2446.7 | 0 | - |
| 994312 | challenger-as-player | white | 305 | 29 | P0/C5 | 158 | 617.4 | 4655.1 | 0 | - |
| 994313 | challenger-as-player | white_planner | 250 | 22 | P5/C0 | 123 | 840.5 | 3953.8 | 0 | - |

## Events

### seed 994306 / challenger-as-player / step 83 / turn 8

- elapsed: 78644ms / inspection 77828.4ms
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

### seed 994307 / challenger-as-player / step 58 / turn 6

- elapsed: 97374.8ms / inspection 97306.7ms
- state: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 5/1 / deck player/cpu 20/20 / hand player/cpu 6/4
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus,shield | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 | cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2
- rolloutTriggered: true, adopted: true
- decision: move:player_front_right->player_back_left
- fallback: move:player_front_right->player_back_left (219.2)
- planner selected: move:player_front_right->player_back_left (215.3)
- root gap to fallback: 107.2
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | move:player_front_right->player_back_left | move:player-front-right->player-back-left; mover:ヤンバルLv1HP3(act0/1); fallbackMove:player-front-right->player-back-left:keepsTo | 112 | 215.3 | 160.6 | 149.4 | 171.8 | - | 200.4 | 0 |
| 2 |  |  |  | summon:デスシープ->player_back_left | summon:デスシープ->back-left; noBacklineReach; behindOwnFront:真勇者ダインLv2HP6(act0/1); sameLaneEnemyFront:デスシープLv1HP6(act1/1,focus,shield); after:prepared; fallbackMove:player-front-right->player-back-left:blocksTo | 89.8 | 168.9 | 167.8 | 167.8 | 167.8 | - | -124.6 | -325 |
| 3 |  |  |  | summon:デスシープ->player_back_left | summon:デスシープ->back-left; noBacklineReach; behindOwnFront:真勇者ダインLv2HP6(act0/1); sameLaneEnemyFront:デスシープLv1HP6(act1/1,focus,shield); after:prepared; fallbackMove:player-front-right->player-back-left:blocksTo | 89.8 | 168.9 | 167.8 | 167.8 | 167.8 | - | -124.6 | -325 |

### seed 994310 / challenger-as-player / step 60 / turn 6

- elapsed: 80602.7ms / inspection 81193.8ms
- state: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 4/0 / deck player/cpu 20/20 / hand player/cpu 5/3
- board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1
- rolloutTriggered: true, adopted: true
- decision: move:player_front_right->player_back_left
- fallback: move:player_front_right->player_back_left (253)
- planner selected: move:player_front_right->player_back_left (341.8)
- root gap to fallback: 114.5
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | move:player_front_right->player_back_left | move:player-front-right->player-back-left; mover:ピグミィLv2HP3(act0/2); fallbackMove:player-front-right->player-back-left:keepsTo | 138.5 | 341.8 | 283.8 | 271 | 296.6 | - | 183.8 | 0 |
| 2 |  |  |  | summon:ドノマンティス->player_back_left | summon:ドノマンティス->back-left; noBacklineReach; behindOwnFront:デスシープLv2HP6(act0/1); sameLaneEnemyFront:デスシープLv1HP6(act1/1,focus); after:prepared; fallbackMove:player-front-right->player-back-left:blocksTo | 85.2 | 339.4 | 283.8 | 271 | 296.6 | - | 245.8 | 62 |
| 3 |  |  |  | summon:ドノマンティス->player_back_right | summon:ドノマンティス->back-right; noBacklineReach; behindOwnFront:ピグミィLv2HP3(act0/2); sameLaneEnemyFront:デスシープLv1HP6(act1/1); after:prepared; fallbackMove:player-front-right->player-back-left:keepsTo | 85.2 | 330.1 | 283.8 | 271 | 296.6 | - | 183.8 | 0 |
