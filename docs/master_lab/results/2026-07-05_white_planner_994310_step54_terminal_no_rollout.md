# White Planner Turn Plan Response Audit

生成: 2026-07-05T09:08:05.498Z
seed: 994310
direction: `challenger-as-cpu`
deck: `master-lab-white-1377-death-sheep3`
search: `{"terminalPlanRolloutSteps":0,"terminalPlanRolloutWeight":0}`
rolloutSteps: 0

## Conclusion

- 1 samples. terminal plan enabled 1件、adopted 1件。
- CPU選択がfallbackと異なる局面は0件。差分局面の own/opponent handoff board を実装候補にする。
- rollout 勝ち候補は0件。terminal score と rollout score が割れる候補を次の実装候補にする。

## Samples

### step 54 / turn 5

- state: turn 5 / current cpu / HP cpu/player 10/10 / stones cpu/player 6/0 / deck cpu/player 20/21 / hand cpu/player 4/4
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1
- terminalPlan: enabled=true, adopted=true
- fallback: focus:デスシープ (306.8)
- cpu: focus:デスシープ
- planner selected: focus:デスシープ (156)
- runnerUp: 124.9

| rank | planner | cpu | fallback | decision | root | own | opp | response | planner score | rollout | rollout score | rollout gap |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:デスシープ | 191.2 | 140.8 | 92 | 116.4 | 156 | - | - | - |
| 2 |  |  |  | summon:デスシープ->cpu_back_left | 84.8 | 136.8 | 102 | 119.4 | 124.9 | - | - | - |
| 3 |  |  |  | summon:デスシープ->cpu_front_right | 126.8 | 96.8 | 62 | 79.4 | 107.3 | - | - | - |
| 4 |  |  |  | summon:デスシープ->cpu_back_right | 84.8 | 84.8 | 62 | 73.4 | 78.9 | - | - | - |
| 5 |  |  |  | end_turn | -43.2 | 25 | -63 | -19 | -105.7 | - | - | - |

#### Candidate Boards

- #1 focus:デスシープ
  - after root: turn 5 / current cpu / HP cpu/player 10/10 / stones cpu/player 6/0 / deck cpu/player 20/21 / hand cpu/player 4/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus
  - own handoff: turn 6 / current player / HP cpu/player 10/10 / stones cpu/player 0/3 / deck cpu/player 20/20 / hand cpu/player 2/5
  - board: player_front_left:PF:ピグミィ Lv2 HP3 act0/2 | player_front_right:PF:デスシープ Lv2 HP6 act0/1 | player_back_right:PB:デスシープ Lv1 HP3 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 prep | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 focus,shield
  - opponent handoff: turn 6 / current cpu / HP cpu/player 9/10 / stones cpu/player 4/3 / deck cpu/player 19/20 / hand cpu/player 3/5
  - board: player_front_left:PF:ピグミィ Lv2 HP3 act0/2 focus | player_front_right:PF:デスシープ Lv2 HP6 act1/1 | player_back_right:PB:デスシープ Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus
- #2 summon:デスシープ->cpu_back_left
  - after root: turn 5 / current cpu / HP cpu/player 10/10 / stones cpu/player 5/0 / deck cpu/player 20/21 / hand cpu/player 3/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_left:CB:デスシープ Lv1 HP6 prep
  - own handoff: turn 6 / current player / HP cpu/player 10/10 / stones cpu/player 2/3 / deck cpu/player 20/20 / hand cpu/player 2/5
  - board: player_front_left:PF:ピグミィ Lv2 HP3 act0/2 | player_front_right:PF:デスシープ Lv2 HP6 act0/1 | player_back_right:PB:デスシープ Lv1 HP3 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 prep | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus
  - opponent handoff: turn 6 / current cpu / HP cpu/player 9/10 / stones cpu/player 6/3 / deck cpu/player 19/20 / hand cpu/player 3/5
  - board: player_front_left:PF:ピグミィ Lv2 HP3 act0/2 focus | player_front_right:PF:デスシープ Lv2 HP6 act1/1 | player_back_right:PB:デスシープ Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus
- #3 summon:デスシープ->cpu_front_right
  - after root: turn 5 / current cpu / HP cpu/player 10/10 / stones cpu/player 5/0 / deck cpu/player 20/21 / hand cpu/player 3/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 prep
  - own handoff: turn 6 / current player / HP cpu/player 10/10 / stones cpu/player 5/3 / deck cpu/player 20/20 / hand cpu/player 3/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP3 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 prep
  - opponent handoff: turn 6 / current cpu / HP cpu/player 9/10 / stones cpu/player 9/3 / deck cpu/player 19/20 / hand cpu/player 4/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP3 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1
- #4 summon:デスシープ->cpu_back_right
  - after root: turn 5 / current cpu / HP cpu/player 10/10 / stones cpu/player 5/0 / deck cpu/player 20/21 / hand cpu/player 3/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_right:CB:デスシープ Lv1 HP6 prep
  - own handoff: turn 6 / current player / HP cpu/player 10/10 / stones cpu/player 5/3 / deck cpu/player 20/20 / hand cpu/player 3/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP3 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_back_right:CB:デスシープ Lv1 HP6 prep
  - opponent handoff: turn 6 / current cpu / HP cpu/player 9/10 / stones cpu/player 9/3 / deck cpu/player 19/20 / hand cpu/player 4/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP3 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1
- #5 end_turn
  - after root: turn 6 / current player / HP cpu/player 10/10 / stones cpu/player 6/3 / deck cpu/player 20/20 / hand cpu/player 4/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP3 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus
  - own handoff: turn 6 / current player / HP cpu/player 10/10 / stones cpu/player 6/3 / deck cpu/player 20/20 / hand cpu/player 4/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP3 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus
  - opponent handoff: turn 6 / current cpu / HP cpu/player 9/10 / stones cpu/player 10/3 / deck cpu/player 19/20 / hand cpu/player 5/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP3 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus


