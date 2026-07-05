# White Rollout Trigger Audit

生成: 2026-07-05T21:39:16.292Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994315-994315
directions: challenger-as-player
baseline: `white`, challenger: `white_planner`
inspectThresholdMs: 5000

## Conclusion

- 1 games. challenger wins 0, inspected decisions 1, rollout-triggered decisions 0.
- max challenger decision 7806.8ms, avg challenger decision 850.3ms.
- No rollout-triggered decision was captured. Lower --inspect-threshold-ms or expand seeds before tuning.

## Games

| seed | direction | result | steps | turns | HP | decisions | avg ms | max ms | events | issue |
| ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 994315 | challenger-as-player | draw | 27 | 3 | P10/C10 | 16 | 850.3 | 7806.8 | 1 | winner was not decided within 27 auto steps |

## Events

### seed 994315 / challenger-as-player / step 26 / turn 3

- elapsed: 7806.8ms / inspection 267.4ms
- state: turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 23/23 / hand player/cpu 3/3
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 focus | player_back_right:PB:デスシープ Lv1 HP6 act1/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 shield | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
- rolloutTriggered: false, adopted: false
- decision: master:shield->monster:player_front_right
- fallback: master:shield->monster:player_front_right (-190)
- planner selected: master:shield->monster:player_front_left (73.7)
- root gap to fallback: -243.8
- planner margin to fallback: 6.3

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 |  | Y |  | master:shield->monster:player_front_left | - | 53.8 | 73.7 | 61.9 | 93.4 | 30.4 | - | - | - |
| 2 | Y |  | Y | master:shield->monster:player_front_right | - | 57 | 67.4 | 54.9 | 79.4 | 30.4 | - | - | - |
| 3 |  |  |  | end_turn | - | -100.6 | -2 | 58.9 | 77.4 | 40.4 | - | - | - |


