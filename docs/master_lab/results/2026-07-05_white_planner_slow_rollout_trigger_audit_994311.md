# White Rollout Trigger Audit

生成: 2026-07-05T00:18:46.191Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994311-994311
directions: challenger-as-player
baseline: `white`, challenger: `white_planner`
inspectThresholdMs: 5000

## Conclusion

- 1 games. challenger wins 0, inspected decisions 2, rollout-triggered decisions 2.
- max challenger decision 26035.5ms, avg challenger decision 1037.7ms.
- rollout adopted 2/2; avg selected rollout gap 118.6.
- Next implementation target is the repeated rollout-trigger shape, not a broad coefficient change.

## Games

| seed | direction | result | steps | turns | HP | decisions | avg ms | max ms | events | issue |
| ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 994311 | challenger-as-player | white | 193 | 18 | P0/C6 | 82 | 1037.7 | 26035.5 | 2 | - |

## Events

### seed 994311 / challenger-as-player / step 67 / turn 7

- elapsed: 24995.4ms / inspection 24870.3ms
- state: turn 7 / current player / HP player/cpu 8/10 / stones player/cpu 13/4 / deck player/cpu 19/19 / hand player/cpu 4/4
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv2 HP4 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus
- rolloutTriggered: true, adopted: true
- decision: attack:デスシープ:attack->デスシープ
- fallback: focus:デスシープ (379.3)
- planner selected: attack:デスシープ:attack->デスシープ (323.3)
- root gap to fallback: 428.3
- planner margin to fallback: 82.8
- selected rollout gap to fallback: 237.2

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y |  | attack:デスシープ:attack->デスシープ | attackTarget:cpu-front-right:デスシープLv1HP6(act1/1,focus) | -49 | 323.3 | 218.8 | 242 | 195.6 | - | -302.2 | 237.2 |
| 2 |  |  | Y | focus:デスシープ | - | 184.2 | 240.5 | 281.8 | 296 | 267.6 | - | -539.4 | 0 |

### seed 994311 / challenger-as-player / step 92 / turn 9

- elapsed: 26035.5ms / inspection 25953.1ms
- state: turn 9 / current player / HP player/cpu 8/10 / stones player/cpu 8/3 / deck player/cpu 17/17 / hand player/cpu 3/4
- board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP5 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 act1/1 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_right:CF:ボムゾウ Lv2 HP3 act0/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_right:CB:デスシープ Lv1 HP5 act0/1 focus
- rolloutTriggered: true, adopted: true
- decision: focus:デスシープ
- fallback: focus:デスシープ (258.8)
- planner selected: focus:デスシープ (302.6)
- root gap to fallback: 216.8
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:デスシープ | - | 42 | 302.6 | 342 | 342 | 342 | - | -301.8 | 0 |
| 2 |  |  |  | attack:デスシープ:attack->ヤンバル | attackTarget:cpu-front-left:ヤンバルLv1HP3(act0/1,focus) | 128.7 | 213.1 | 218.2 | 212.8 | 223.6 | - | -223 | 78.8 |
