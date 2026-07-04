# White Rollout Trigger Audit

生成: 2026-07-04T05:20:08.848Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994306-994306
directions: challenger-as-player
baseline: `white`, challenger: `white_rollout`
inspectThresholdMs: 3000

## Conclusion

- 1 games. challenger wins 1, inspected decisions 2, rollout-triggered decisions 2.
- max challenger decision 78918.4ms, avg challenger decision 1563.9ms.
- rollout adopted 2/2; avg selected rollout gap 139.1.
- Next implementation target is the repeated rollout-trigger shape, not a broad coefficient change.

## Games

| seed | direction | result | steps | turns | HP | decisions | avg ms | max ms | events | issue |
| ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 994306 | challenger-as-player | white_rollout | 281 | 27 | P5/C0 | 137 | 1563.9 | 78918.4 | 2 | - |

## Events

### seed 994306 / challenger-as-player / step 83 / turn 8

- elapsed: 78918.4ms / inspection 77451.8ms
- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- rolloutTriggered: true, adopted: true
- decision: summon:ボムゾウ->player_back_right
- fallback: move:player_front_right->player_back_left (333.6)
- planner selected: summon:ボムゾウ->player_back_right (115.6)
- root gap to fallback: 245.8
- planner margin to fallback: 43.6
- selected rollout gap to fallback: 278.2

| rank | cpu | planner | fallback | decision | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y |  | summon:ボムゾウ->player_back_right | 87.8 | 115.6 | 97.9 | 143.4 | 52.4 | - | -10.8 | 278.2 |
| 2 |  |  |  | summon:ボムゾウ->player_back_left | 87.8 | 78.8 | 97.9 | 143.4 | 52.4 | - | -255.8 | 33.2 |
| 3 |  |  | Y | move:player_front_right->player_back_left | 112 | 72 | 90.7 | 125 | 56.4 | - | -289 | 0 |

### seed 994306 / challenger-as-player / step 84 / turn 8

- elapsed: 74458.3ms / inspection 72752.5ms
- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 6/1 / deck player/cpu 18/18 / hand player/cpu 4/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- rolloutTriggered: true, adopted: true
- decision: move:player_front_right->player_back_left
- fallback: move:player_front_right->player_back_left (258.9)
- planner selected: move:player_front_right->player_back_left (53.9)
- root gap to fallback: 146.9
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | move:player_front_right->player_back_left | 112 | 53.9 | 30.9 | 65.2 | -3.4 | - | -10.8 | 0 |
| 2 |  |  |  | move:player_front_left->player_back_left | 42 | -31.4 | 30.9 | 65.2 | -3.4 | - | -476.8 | -466 |
| 3 |  |  |  | summon:ドノマンティス->player_back_left | 80.2 | -94.3 | 38.1 | 83.6 | -7.4 | white | -1000000 | -999989.2 |
