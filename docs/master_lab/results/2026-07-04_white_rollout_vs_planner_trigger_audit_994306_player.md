# White Rollout Trigger Audit

生成: 2026-07-04T06:33:21.031Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994306-994306
directions: challenger-as-player
baseline: `white_planner`, challenger: `white_rollout`
inspectThresholdMs: 3000

## Conclusion

- 1 games. challenger wins 1, inspected decisions 1, rollout-triggered decisions 1.
- max challenger decision 96165.2ms, avg challenger decision 1153.7ms.
- rollout adopted 1/1; avg selected rollout gap 278.2.
- Next implementation target is the repeated rollout-trigger shape, not a broad coefficient change.

## Games

| seed | direction | result | steps | turns | HP | decisions | avg ms | max ms | events | issue |
| ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 994306 | challenger-as-player | white_rollout | 281 | 27 | P5/C0 | 137 | 1153.7 | 96165.2 | 1 | - |

## Events

### seed 994306 / challenger-as-player / step 83 / turn 8

- elapsed: 96165.2ms / inspection 94566.9ms
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
