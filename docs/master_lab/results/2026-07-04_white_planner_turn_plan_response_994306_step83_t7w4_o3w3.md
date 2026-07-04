# White Planner Turn Plan Response Audit

生成: 2026-07-04T01:40:08.953Z
seed: 994306
direction: `challenger-as-player`
deck: `master-lab-white-1377-death-sheep3`
search: `{"sameTurnSearchDepth":3,"sameTurnSearchWidth":4,"detailedWidth":4,"sameTurnTerminalPlanDepth":7,"sameTurnTerminalPlanWidth":4,"sameTurnTerminalPlanWeight":1,"sameTurnOpponentTerminalPlanDepth":3,"sameTurnOpponentTerminalPlanWidth":3,"sameTurnOpponentTerminalPlanWeight":0.5}`

## Conclusion

- 1 samples. terminal plan enabled 1件、adopted 1件。
- CPU選択がfallbackと異なる局面は0件。差分局面の own/opponent handoff board を実装候補にする。

## Samples

### step 83 / turn 8

- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- terminalPlan: enabled=true, adopted=true
- fallback: move:player_front_right->player_back_left (333.6)
- cpu: move:player_front_right->player_back_left
- planner selected: move:player_front_right->player_back_left (302.6)
- runnerUp: 187.4

| rank | planner | cpu | fallback | decision | root | own | opp | response | planner score |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | Y | Y | Y | move:player_front_right->player_back_left | 112 | 278 | 278 | 278 | 302.6 |
| 2 |  |  |  | summon:ボムゾウ->player_back_left | 87.8 | 273.2 | 130.6 | 168.1 | 187.4 |
| 3 |  |  |  | summon:ボムゾウ->player_back_right | 87.8 | 273.2 | 130.6 | 168.1 | 187.4 |
| 4 |  |  |  | focus:ヤンバル | 32 | 131.4 | -89.6 | -4.4 | 2.7 |
| 5 |  |  |  | move:player_front_left->player_back_right | 108 | 125 | -143.6 | -46.5 | -22.7 |
| 6 |  |  |  | end_turn | -119 | 27.4 | -313.6 | -198.4 | -300.1 |

#### Candidate Boards

- #1 move:player_front_right->player_back_left
  - after root: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
  - own handoff: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 1/3 / deck player/cpu 18/18 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
  - opponent handoff: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 1/3 / deck player/cpu 18/18 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- #2 summon:ボムゾウ->player_back_left
  - after root: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 6/1 / deck player/cpu 18/18 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
  - own handoff: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 0/6 / deck player/cpu 18/17 / hand player/cpu 3/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 5/4 / deck player/cpu 17/17 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 | player_back_right:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ボムゾウ Lv1 HP6 prep
- #3 summon:ボムゾウ->player_back_right
  - after root: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 6/1 / deck player/cpu 18/18 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
  - own handoff: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 0/6 / deck player/cpu 18/17 / hand player/cpu 3/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 5/4 / deck player/cpu 17/17 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ボムゾウ Lv1 HP6 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ボムゾウ Lv1 HP6 prep
- #4 focus:ヤンバル
  - after root: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act1/1 focus | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
  - own handoff: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 5/4 / deck player/cpu 18/17 / hand player/cpu 3/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act1/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 12/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus
- #5 move:player_front_left->player_back_right
  - after root: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
  - board: player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
  - own handoff: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 5/4 / deck player/cpu 18/17 / hand player/cpu 3/6
  - board: player_front_left:PF:デスシープ Lv1 HP6 prep | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 12/2 / deck player/cpu 17/17 / hand player/cpu 4/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus
- #6 end_turn
  - after root: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 7/4 / deck player/cpu 18/17 / hand player/cpu 5/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - own handoff: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 7/4 / deck player/cpu 18/17 / hand player/cpu 5/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 14/2 / deck player/cpu 17/17 / hand player/cpu 6/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus


