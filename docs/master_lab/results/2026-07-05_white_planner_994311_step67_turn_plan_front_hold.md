# White Planner Turn Plan Response Audit

生成: 2026-07-05T12:05:03.873Z
seed: 994311
direction: `challenger-as-player`
deck: `master-lab-white-1377-death-sheep3`
search: `{}`
rolloutSteps: 0

## Conclusion

- 1 samples. terminal plan enabled 1件、adopted 1件。
- CPU選択がfallbackと異なる局面は1件。差分局面の own/opponent handoff board を実装候補にする。
- rollout 勝ち候補は0件。terminal score と rollout score が割れる候補を次の実装候補にする。

## Samples

### step 67 / turn 7

- state: turn 7 / current player / HP player/cpu 8/10 / stones player/cpu 13/4 / deck player/cpu 19/19 / hand player/cpu 4/4
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv2 HP4 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus
- terminalPlan: enabled=true, adopted=true
- fallback: focus:デスシープ (379.3)
- cpu: end_turn
- planner selected: end_turn (392.6)
- runnerUp: 323.3

| rank | planner | cpu | fallback | decision | root | own | opp | response | planner score | rollout | rollout score | rollout gap |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y |  | end_turn | -34.6 | 25 | -15 | 5 | 392.6 | - | -65 | 474.4 |
| 2 |  |  |  | attack:デスシープ:attack->デスシープ | -49 | 242 | 195.6 | 218.8 | 323.3 | - | -302.2 | 237.2 |
| 3 |  |  |  | master:master_attack->monster:cpu_front_left | 16.6 | 296 | 267.6 | 281.8 | 241.7 | - | - | - |
| 4 |  |  | Y | focus:デスシープ | 184.2 | 296 | 267.6 | 281.8 | 240.5 | - | -539.4 | 0 |

#### Candidate Boards

- #1 end_turn
  - after root: turn 7 / current cpu / HP player/cpu 8/10 / stones player/cpu 13/7 / deck player/cpu 19/18 / hand player/cpu 4/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv2 HP4 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
  - own handoff: turn 7 / current cpu / HP player/cpu 8/10 / stones player/cpu 13/7 / deck player/cpu 19/18 / hand player/cpu 4/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv2 HP4 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
  - opponent handoff: turn 8 / current player / HP player/cpu 7/10 / stones player/cpu 17/7 / deck player/cpu 18/18 / hand player/cpu 5/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv2 HP4 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- #2 attack:デスシープ:attack->デスシープ
  - after root: turn 7 / current player / HP player/cpu 8/10 / stones player/cpu 13/4 / deck player/cpu 19/19 / hand player/cpu 4/4
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | cpu_front_left:CF:デスシープ Lv2 HP4 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 | cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus
  - own handoff: turn 7 / current cpu / HP player/cpu 8/10 / stones player/cpu 4/9 / deck player/cpu 19/18 / hand player/cpu 3/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
  - opponent handoff: turn 8 / current player / HP player/cpu 8/10 / stones player/cpu 7/8 / deck player/cpu 18/18 / hand player/cpu 4/4
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- #3 master:master_attack->monster:cpu_front_left
  - after root: turn 7 / current player / HP player/cpu 8/10 / stones player/cpu 10/4 / deck player/cpu 19/19 / hand player/cpu 4/4
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv2 HP2 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus
  - own handoff: turn 7 / current cpu / HP player/cpu 8/10 / stones player/cpu 4/9 / deck player/cpu 19/18 / hand player/cpu 3/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
  - opponent handoff: turn 8 / current player / HP player/cpu 8/10 / stones player/cpu 7/8 / deck player/cpu 18/18 / hand player/cpu 4/4
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- #4 focus:デスシープ
  - after root: turn 7 / current player / HP player/cpu 8/10 / stones player/cpu 13/4 / deck player/cpu 19/19 / hand player/cpu 4/4
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_left:CF:デスシープ Lv2 HP4 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus
  - own handoff: turn 7 / current cpu / HP player/cpu 8/10 / stones player/cpu 4/9 / deck player/cpu 19/18 / hand player/cpu 3/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
  - opponent handoff: turn 8 / current player / HP player/cpu 8/10 / stones player/cpu 7/8 / deck player/cpu 18/18 / hand player/cpu 4/4
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus


