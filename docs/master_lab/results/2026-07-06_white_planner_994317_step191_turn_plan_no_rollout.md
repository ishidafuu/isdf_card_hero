# White Planner Turn Plan Response Audit

生成: 2026-07-05T18:22:19.707Z
seed: 994317
direction: `challenger-as-cpu`
deck: `master-lab-white-1377-death-sheep3`
search: `{"terminalPlanRolloutSteps":0}`
rolloutSteps: 0

## Conclusion

- 1 samples. terminal plan enabled 1件、adopted 0件。
- CPU選択がfallbackと異なる局面は0件。差分局面の own/opponent handoff board を実装候補にする。
- rollout 勝ち候補は0件。terminal score と rollout score が割れる候補を次の実装候補にする。

## Samples

### step 191 / turn 17

- state: turn 17 / current cpu / HP cpu/player 6/2 / stones cpu/player 3/9 / deck cpu/player 8/9 / hand cpu/player 5/4
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
- terminalPlan: enabled=true, adopted=false
- fallback: attack:ピグミィ:attack->真勇者ダイン (190.1)
- cpu: attack:ピグミィ:attack->真勇者ダイン
- planner selected: magic:ワープ->monster:player_front_left:monster:player_back_left (151.9)
- runnerUp: 151.9
- rejected: terminal plan candidate did not pass adoption gate

| rank | planner | cpu | fallback | decision | root | own | opp | response | planner score | rollout | rollout score | rollout gap |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y |  |  | magic:ワープ->monster:player_front_left:monster:player_back_left | 147.4 | 133 | 106 | 119.5 | 151.9 | - | - | - |
| 2 |  |  |  | magic:ワープ->monster:player_back_left:monster:player_front_left | 147.4 | 133 | 106 | 119.5 | 151.9 | - | - | - |
| 3 |  | Y | Y | attack:ピグミィ:attack->真勇者ダイン | 67.7 | 151 | 106 | 128.5 | 143.4 | - | - | - |
| 4 |  |  |  | end_turn | 4.4 | 93 | -83 | -9 | -39.6 | - | - | - |

#### Candidate Boards

- #1 magic:ワープ->monster:player_front_left:monster:player_back_left
  - after root: turn 17 / current cpu / HP cpu/player 6/2 / stones cpu/player 0/9 / deck cpu/player 8/9 / hand cpu/player 4/4
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_left:PB:真勇者ダイン Lv2 HP6 act0/1 focus | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
  - own handoff: turn 18 / current player / HP cpu/player 6/2 / stones cpu/player 0/12 / deck cpu/player 8/8 / hand cpu/player 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_left:PB:真勇者ダイン Lv2 HP6 act0/1 focus | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
  - opponent handoff: turn 18 / current cpu / HP cpu/player 6/2 / stones cpu/player 3/9 / deck cpu/player 7/8 / hand cpu/player 5/4
  - board: player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 focus | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:デスシープ Lv2 HP6 act0/1
- #2 magic:ワープ->monster:player_back_left:monster:player_front_left
  - after root: turn 17 / current cpu / HP cpu/player 6/2 / stones cpu/player 0/9 / deck cpu/player 8/9 / hand cpu/player 4/4
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_left:PB:真勇者ダイン Lv2 HP6 act0/1 focus | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
  - own handoff: turn 18 / current player / HP cpu/player 6/2 / stones cpu/player 0/12 / deck cpu/player 8/8 / hand cpu/player 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_left:PB:真勇者ダイン Lv2 HP6 act0/1 focus | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
  - opponent handoff: turn 18 / current cpu / HP cpu/player 6/2 / stones cpu/player 3/9 / deck cpu/player 7/8 / hand cpu/player 5/4
  - board: player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 focus | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:デスシープ Lv2 HP6 act0/1
- #3 attack:ピグミィ:attack->真勇者ダイン
  - after root: turn 17 / current cpu / HP cpu/player 6/2 / stones cpu/player 3/9 / deck cpu/player 8/9 / hand cpu/player 5/4
  - board: player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ピグミィ Lv2 HP3 act1/2 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
  - own handoff: turn 18 / current player / HP cpu/player 6/2 / stones cpu/player 0/12 / deck cpu/player 8/8 / hand cpu/player 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_left:PB:真勇者ダイン Lv2 HP6 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
  - opponent handoff: turn 18 / current cpu / HP cpu/player 6/2 / stones cpu/player 3/9 / deck cpu/player 7/8 / hand cpu/player 5/4
  - board: player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 focus | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:デスシープ Lv2 HP6 act0/1
- #4 end_turn
  - after root: turn 18 / current player / HP cpu/player 6/2 / stones cpu/player 3/12 / deck cpu/player 8/8 / hand cpu/player 5/5
  - board: player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
  - own handoff: turn 18 / current player / HP cpu/player 6/2 / stones cpu/player 3/12 / deck cpu/player 8/8 / hand cpu/player 5/5
  - board: player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
  - opponent handoff: turn 18 / current player / HP cpu/player 6/2 / stones cpu/player 5/12 / deck cpu/player 8/8 / hand cpu/player 5/5
  - board: player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1


