# White Rollout Trigger Audit

生成: 2026-07-04T06:27:33.080Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994306-994306
directions: challenger-as-cpu
baseline: `white_planner`, challenger: `white_rollout`
inspectThresholdMs: 3000

## Conclusion

- 1 games. challenger wins 1, inspected decisions 2, rollout-triggered decisions 0.
- max challenger decision 4664ms, avg challenger decision 577.2ms.
- No rollout-triggered decision was captured. Lower --inspect-threshold-ms or expand seeds before tuning.

## Games

| seed | direction | result | steps | turns | HP | decisions | avg ms | max ms | events | issue |
| ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 994306 | challenger-as-cpu | white_rollout | 175 | 22 | P0/C6 | 84 | 577.2 | 4664 | 2 | - |

## Events

### seed 994306 / challenger-as-cpu / step 76 / turn 7

- elapsed: 4664ms / inspection 4660.3ms
- state: turn 7 / current cpu / HP cpu/player 10/9 / stones cpu/player 7/1 / deck cpu/player 18/19 / hand cpu/player 6/4
- board: player_front_left:PF:ボムゾウ Lv2 HP2 act1/1 shield | player_front_right:PF:ピグミィ Lv1 HP3 prep | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
- rolloutTriggered: false, adopted: false
- decision: attack:ヤンバル:wild_claw->ボムゾウ
- fallback: attack:ヤンバル:wild_claw->ボムゾウ (672.2)
- planner selected: master:wake_up->monster:player_front_right (363)
- root gap to fallback: 394.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 |  | Y |  | master:wake_up->monster:player_front_right | 277.4 | 363 | 323.4 | 325 | 321.8 | - | - | - |
| 2 | Y |  | Y | attack:ヤンバル:wild_claw->ボムゾウ | 241.2 | 363 | 323.4 | 325 | 321.8 | - | - | - |
| 3 |  |  |  | attack:ドノマンティス:attack->ボムゾウ | 161.2 | 330.8 | 313.4 | 315 | 311.8 | - | - | - |
| 4 |  |  |  | attack:デスシープ:attack->player master | 157.8 | 300.7 | 285.8 | 292 | 279.6 | - | - | - |

### seed 994306 / challenger-as-cpu / step 91 / turn 8

- elapsed: 3819.4ms / inspection 3725.9ms
- state: turn 8 / current cpu / HP cpu/player 10/9 / stones cpu/player 6/0 / deck cpu/player 17/18 / hand cpu/player 6/4
- board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:ボムゾウ Lv2 HP5 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1
- rolloutTriggered: false, adopted: false
- decision: attack:ヤンバル:wild_claw->ヤンバル
- fallback: attack:ヤンバル:wild_claw->ヤンバル (577.8)
- planner selected: attack:ドノマンティス:呪いの刃->ヤンバル (270.6)
- root gap to fallback: 73.1
- planner margin to fallback: 37.9

| rank | cpu | planner | fallback | decision | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 |  | Y |  | attack:ドノマンティス:呪いの刃->ヤンバル | 504.7 | 270.6 | 231 | 241.8 | 220.2 | - | - | - |
| 2 | Y |  | Y | attack:ヤンバル:wild_claw->ヤンバル | 237.1 | 232.7 | 286.9 | 305.8 | 268 | - | - | - |
| 3 |  |  |  | attack:ヤンバル:wild_claw->ヤンバル | 157.1 | 206.6 | 305.9 | 305.8 | 306 | - | - | - |
| 4 |  |  |  | attack:ドノマンティス:attack->ヤンバル | 157.1 | 110.7 | 210 | 226.8 | 193.2 | - | - | - |
