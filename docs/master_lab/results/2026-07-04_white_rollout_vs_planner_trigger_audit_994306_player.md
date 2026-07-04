# White Rollout Trigger Audit

生成: 2026-07-04T07:18:37.087Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994306-994306
directions: challenger-as-player
baseline: `white_planner`, challenger: `white_rollout`
inspectThresholdMs: 3000

## Conclusion

- 1 games. challenger wins 1, inspected decisions 1, rollout-triggered decisions 1.
- max challenger decision 96631.1ms, avg challenger decision 1159.1ms.
- rollout adopted 1/1; avg selected rollout gap 278.2.
- Only one rollout-triggered decision was captured. Treat it as a local clue until the same feature repeats across seeds.

## Games

| seed | direction | result | steps | turns | HP | decisions | avg ms | max ms | events | issue |
| ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 994306 | challenger-as-player | white_rollout | 281 | 27 | P5/C0 | 137 | 1159.1 | 96631.1 | 1 | - |

## Events

### seed 994306 / challenger-as-player / step 83 / turn 8

- elapsed: 96631.1ms / inspection 95285.6ms
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


