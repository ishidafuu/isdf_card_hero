# White Planner Turn Plan Response Audit

生成: 2026-07-05T07:38:00.487Z
seed: 994308
direction: `challenger-as-player`
deck: `master-lab-white-1377-death-sheep3`
search: `{"terminalPlanRolloutSteps":0,"terminalPlanRolloutWeight":0}`
rolloutSteps: 0

## Conclusion

- 1 samples. terminal plan enabled 1件、adopted 1件。
- CPU選択がfallbackと異なる局面は0件。差分局面の own/opponent handoff board を実装候補にする。
- rollout 勝ち候補は0件。terminal score と rollout score が割れる候補を次の実装候補にする。

## Samples

### step 60 / turn 6

- state: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 4/0 / deck player/cpu 20/20 / hand player/cpu 5/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
- terminalPlan: enabled=true, adopted=true
- fallback: focus:デスシープ (333)
- cpu: focus:デスシープ
- planner selected: focus:デスシープ (284.5)
- runnerUp: 263.1

| rank | planner | cpu | fallback | decision | root | own | opp | response | planner score | rollout | rollout score | rollout gap |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:デスシープ | 186.2 | 252.8 | 237 | 244.9 | 284.5 | - | - | - |
| 2 |  |  |  | summon:真勇者ダイン->player_back_right | 92.8 | 264.8 | 234 | 249.4 | 263.1 | - | - | - |
| 3 |  |  |  | focus:デスシープ | 44 | 264.8 | 234 | 249.4 | 228 | - | - | - |
| 4 |  |  |  | move:player_front_right->player_back_left | 140 | 106.8 | 109 | 107.9 | 138.7 | - | - | - |
| 5 |  |  |  | move:player_back_left->player_front_right | 122 | 106.8 | 109 | 107.9 | 134.7 | - | - | - |
| 6 |  |  |  | attack:デスシープ:attack->真勇者ダイン | -47 | 198.8 | 138 | 168.4 | 81.5 | - | - | - |
| 7 |  |  |  | end_turn | -19.8 | 151 | 84 | 117.5 | 50.2 | - | - | - |

#### Candidate Boards

- #1 focus:デスシープ
  - after root: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 4/0 / deck player/cpu 20/20 / hand player/cpu 5/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
  - own handoff: turn 6 / current cpu / HP player/cpu 10/9 / stones player/cpu 0/3 / deck player/cpu 20/19 / hand player/cpu 3/6
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act1/1 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 7 / current player / HP player/cpu 9/9 / stones player/cpu 4/3 / deck player/cpu 19/19 / hand player/cpu 4/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus
- #2 summon:真勇者ダイン->player_back_right
  - after root: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 3/0 / deck player/cpu 20/20 / hand player/cpu 4/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
  - own handoff: turn 6 / current cpu / HP player/cpu 10/9 / stones player/cpu 0/3 / deck player/cpu 20/19 / hand player/cpu 3/6
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 7 / current player / HP player/cpu 10/9 / stones player/cpu 3/3 / deck player/cpu 19/19 / hand player/cpu 4/5
  - board: player_front_left:PF:デスシープ Lv1 HP5 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- #3 focus:デスシープ
  - after root: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 4/0 / deck player/cpu 20/20 / hand player/cpu 5/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
  - own handoff: turn 6 / current cpu / HP player/cpu 10/9 / stones player/cpu 0/3 / deck player/cpu 20/19 / hand player/cpu 3/6
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 7 / current player / HP player/cpu 10/9 / stones player/cpu 3/3 / deck player/cpu 19/19 / hand player/cpu 4/5
  - board: player_front_left:PF:デスシープ Lv1 HP5 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- #4 move:player_front_right->player_back_left
  - after root: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 4/0 / deck player/cpu 20/20 / hand player/cpu 5/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
  - own handoff: turn 6 / current cpu / HP player/cpu 10/9 / stones player/cpu 3/3 / deck player/cpu 20/19 / hand player/cpu 4/6
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
  - opponent handoff: turn 7 / current player / HP player/cpu 9/9 / stones player/cpu 7/3 / deck player/cpu 19/19 / hand player/cpu 5/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- #5 move:player_back_left->player_front_right
  - after root: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 4/0 / deck player/cpu 20/20 / hand player/cpu 5/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
  - own handoff: turn 6 / current cpu / HP player/cpu 10/9 / stones player/cpu 3/3 / deck player/cpu 20/19 / hand player/cpu 4/6
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
  - opponent handoff: turn 7 / current player / HP player/cpu 9/9 / stones player/cpu 7/3 / deck player/cpu 19/19 / hand player/cpu 5/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- #6 attack:デスシープ:attack->真勇者ダイン
  - after root: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 4/0 / deck player/cpu 20/20 / hand player/cpu 5/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
  - own handoff: turn 6 / current cpu / HP player/cpu 10/9 / stones player/cpu 0/3 / deck player/cpu 20/19 / hand player/cpu 3/6
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP5 act0/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 7 / current player / HP player/cpu 10/9 / stones player/cpu 3/3 / deck player/cpu 19/19 / hand player/cpu 4/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP5 act0/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus
- #7 end_turn
  - after root: turn 6 / current cpu / HP player/cpu 10/9 / stones player/cpu 4/3 / deck player/cpu 20/19 / hand player/cpu 5/6
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
  - own handoff: turn 6 / current cpu / HP player/cpu 10/9 / stones player/cpu 4/3 / deck player/cpu 20/19 / hand player/cpu 5/6
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
  - opponent handoff: turn 7 / current player / HP player/cpu 9/9 / stones player/cpu 8/3 / deck player/cpu 19/19 / hand player/cpu 6/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus


