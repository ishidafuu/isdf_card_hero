# White Planner Turn Plan Response Audit

生成: 2026-07-05T10:24:49.688Z
seed: 994308
direction: `challenger-as-cpu`
deck: `master-lab-white-1377-death-sheep3`
search: `{"terminalPlanRolloutSteps":0,"terminalPlanRolloutWeight":0}`
rolloutSteps: 0

## Conclusion

- 1 samples. terminal plan enabled 1件、adopted 1件。
- CPU選択がfallbackと異なる局面は0件。差分局面の own/opponent handoff board を実装候補にする。
- rollout 勝ち候補は0件。terminal score と rollout score が割れる候補を次の実装候補にする。

## Samples

### step 51 / turn 5

- state: turn 5 / current cpu / HP cpu/player 9/10 / stones cpu/player 6/0 / deck cpu/player 20/21 / hand cpu/player 6/4
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP5 act1/1 focus | player_back_left:PB:デスシープ Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1
- terminalPlan: enabled=true, adopted=true
- fallback: focus:真勇者ダイン (325.8)
- cpu: focus:真勇者ダイン
- planner selected: focus:真勇者ダイン (174.4)
- runnerUp: 172.1

| rank | planner | cpu | fallback | decision | root | own | opp | response | planner score | rollout | rollout score | rollout gap |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:真勇者ダイン | 179 | 147.2 | 122.8 | 135 | 174.4 | - | - | - |
| 2 |  |  |  | summon:ピグミィ->cpu_back_right | 141.4 | 159.2 | 122.8 | 141 | 172.1 | - | - | - |
| 3 |  |  |  | summon:真勇者ダイン->cpu_back_right | 92.8 | 149.6 | 106.8 | 128.2 | 145.5 | - | - | - |
| 4 |  |  |  | focus:ヤンバル | 32 | 147.2 | 122.8 | 135 | 108.5 | - | - | - |
| 5 |  |  |  | attack:ヤンバル:wild_claw->デスシープ | 115 | 103.2 | 33.8 | 68.5 | 93.8 | - | - | - |
| 6 |  |  |  | end_turn | -67.1 | 86.8 | -1.2 | 42.8 | -55 | - | - | - |

#### Candidate Boards

- #1 focus:真勇者ダイン
  - after root: turn 5 / current cpu / HP cpu/player 9/10 / stones cpu/player 6/0 / deck cpu/player 20/21 / hand cpu/player 6/4
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP5 act1/1 focus | player_back_left:PB:デスシープ Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1
  - own handoff: turn 6 / current player / HP cpu/player 9/10 / stones cpu/player 5/3 / deck cpu/player 20/20 / hand cpu/player 5/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 prep
  - opponent handoff: turn 6 / current cpu / HP cpu/player 8/10 / stones cpu/player 9/3 / deck cpu/player 19/20 / hand cpu/player 6/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP5 act1/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2
- #2 summon:ピグミィ->cpu_back_right
  - after root: turn 5 / current cpu / HP cpu/player 9/10 / stones cpu/player 5/0 / deck cpu/player 20/21 / hand cpu/player 5/4
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP5 act1/1 focus | player_back_left:PB:デスシープ Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 prep
  - own handoff: turn 6 / current player / HP cpu/player 9/10 / stones cpu/player 5/3 / deck cpu/player 20/20 / hand cpu/player 5/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 prep
  - opponent handoff: turn 6 / current cpu / HP cpu/player 8/10 / stones cpu/player 9/3 / deck cpu/player 19/20 / hand cpu/player 6/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP5 act1/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2
- #3 summon:真勇者ダイン->cpu_back_right
  - after root: turn 5 / current cpu / HP cpu/player 9/10 / stones cpu/player 5/0 / deck cpu/player 20/21 / hand cpu/player 5/4
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP5 act1/1 focus | player_back_left:PB:デスシープ Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep
  - own handoff: turn 6 / current player / HP cpu/player 9/10 / stones cpu/player 5/3 / deck cpu/player 20/20 / hand cpu/player 5/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep
  - opponent handoff: turn 6 / current cpu / HP cpu/player 8/10 / stones cpu/player 9/3 / deck cpu/player 19/20 / hand cpu/player 6/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP5 act1/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1
- #4 focus:ヤンバル
  - after root: turn 5 / current cpu / HP cpu/player 9/10 / stones cpu/player 6/0 / deck cpu/player 20/21 / hand cpu/player 6/4
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP5 act1/1 focus | player_back_left:PB:デスシープ Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 focus
  - own handoff: turn 6 / current player / HP cpu/player 9/10 / stones cpu/player 5/3 / deck cpu/player 20/20 / hand cpu/player 5/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 prep
  - opponent handoff: turn 6 / current cpu / HP cpu/player 8/10 / stones cpu/player 9/3 / deck cpu/player 19/20 / hand cpu/player 6/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP5 act1/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2
- #5 attack:ヤンバル:wild_claw->デスシープ
  - after root: turn 5 / current cpu / HP cpu/player 9/10 / stones cpu/player 6/0 / deck cpu/player 20/21 / hand cpu/player 6/4
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP4 act1/1 | player_back_left:PB:デスシープ Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1
  - own handoff: turn 6 / current player / HP cpu/player 9/10 / stones cpu/player 5/3 / deck cpu/player 20/20 / hand cpu/player 5/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP4 act0/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 prep
  - opponent handoff: turn 6 / current cpu / HP cpu/player 9/10 / stones cpu/player 8/3 / deck cpu/player 19/20 / hand cpu/player 6/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP4 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2
- #6 end_turn
  - after root: turn 6 / current player / HP cpu/player 9/10 / stones cpu/player 6/3 / deck cpu/player 20/20 / hand cpu/player 5/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus
  - own handoff: turn 6 / current player / HP cpu/player 9/10 / stones cpu/player 6/3 / deck cpu/player 20/20 / hand cpu/player 5/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus
  - opponent handoff: turn 6 / current cpu / HP cpu/player 8/10 / stones cpu/player 10/3 / deck cpu/player 19/20 / hand cpu/player 6/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP5 act1/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus


