# White Planner Turn Plan Response Audit

生成: 2026-07-04T02:04:37.086Z
seed: 994306
direction: `challenger-as-player`
deck: `master-lab-white-1377-death-sheep3`
search: `{"terminalPlanRolloutSteps":160,"terminalPlanRolloutCandidateLimit":3,"terminalPlanRolloutWeight":0.2,"terminalPlanRolloutAdoptionMinScoreGap":200}`
rolloutSteps: 0

## Conclusion

- 1 samples. terminal plan enabled 1件、adopted 0件。
- CPU選択がfallbackと異なる局面は0件。差分局面の own/opponent handoff board を実装候補にする。
- rollout 勝ち候補は0件。terminal score と rollout score が割れる候補を次の実装候補にする。

## Samples

### step 83 / turn 8

- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- terminalPlan: enabled=true, adopted=false
- fallback: move:player_front_right->player_back_left (333.6)
- cpu: move:player_front_right->player_back_left
- planner selected: move:player_front_left->player_back_right (114.5)
- runnerUp: 98.9
- rejected: terminal plan candidate did not pass adoption gate

| rank | planner | cpu | fallback | decision | root | own | opp | response | planner score | rollout | rollout score |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| 1 | Y |  |  | move:player_front_left->player_back_right | 108 | 125 | 56.4 | 90.7 | 114.5 | - | - |
| 2 |  |  |  | focus:ヤンバル | 32 | 131.4 | 52.4 | 91.9 | 98.9 | - | - |
| 3 |  |  |  | summon:ボムゾウ->player_back_right | 87.8 | 143.4 | 52.4 | 97.9 | 61.8 | - | - |

#### Candidate Boards

- #1 move:player_front_left->player_back_right
  - after root: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
  - board: player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
  - own handoff: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 5/4 / deck player/cpu 18/17 / hand player/cpu 3/6
  - board: player_front_left:PF:デスシープ Lv1 HP6 prep | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 10/3 / deck player/cpu 17/17 / hand player/cpu 4/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus
- #2 focus:ヤンバル
  - after root: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act1/1 focus | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
  - own handoff: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 5/4 / deck player/cpu 18/17 / hand player/cpu 3/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act1/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 10/3 / deck player/cpu 17/17 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus
- #3 summon:ボムゾウ->player_back_right
  - after root: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 6/1 / deck player/cpu 18/18 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
  - own handoff: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 5/4 / deck player/cpu 18/17 / hand player/cpu 3/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | player_back_left:PB:ドノマンティス Lv1 HP5 prep | player_back_right:PB:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 10/3 / deck player/cpu 17/17 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 | player_back_right:PB:ボムゾウ Lv1 HP6 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus


