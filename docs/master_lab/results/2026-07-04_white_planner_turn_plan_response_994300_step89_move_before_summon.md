# White Planner Turn Plan Response Audit

生成: 2026-07-04T13:06:50.167Z
seed: 994300
direction: `challenger-as-cpu`
deck: `master-lab-white-1377-death-sheep3`
search: `{}`
rolloutSteps: 0

## Conclusion

- 1 samples. terminal plan enabled 1件、adopted 1件。
- CPU選択がfallbackと異なる局面は0件。差分局面の own/opponent handoff board を実装候補にする。
- rollout 勝ち候補は0件。terminal score と rollout score が割れる候補を次の実装候補にする。

## Samples

### step 89 / turn 8

- state: turn 8 / current cpu / HP cpu/player 10/10 / stones cpu/player 5/2 / deck cpu/player 17/18 / hand cpu/player 5/4
- board: player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus
- terminalPlan: enabled=true, adopted=true
- fallback: summon:ヤンバル->cpu_back_right (107.6)
- cpu: summon:ヤンバル->cpu_back_right
- planner selected: summon:ヤンバル->cpu_back_right (62.4)
- runnerUp: 59.3

| rank | planner | cpu | fallback | decision | root | own | opp | response | planner score | rollout | rollout score | rollout gap |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ヤンバル->cpu_back_right | 89.2 | 55.2 | 30.4 | 42.8 | 62.4 | - | - | - |
| 2 |  |  |  | move:cpu_back_left->cpu_front_right | 75 | 55.2 | 30.4 | 42.8 | 59.3 | - | - | - |
| 3 |  |  |  | summon:ヤンバル->cpu_front_right | 49.6 | 12.4 | -27.6 | -7.6 | 3.3 | - | - | - |
| 4 |  |  |  | end_turn | -105.6 | -34.2 | -110.6 | -72.4 | -153 | - | - | - |

#### Candidate Boards

- #1 summon:ヤンバル->cpu_back_right
  - after root: turn 8 / current cpu / HP cpu/player 10/10 / stones cpu/player 4/2 / deck cpu/player 17/18 / hand cpu/player 4/4
  - board: player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 prep
  - own handoff: turn 9 / current player / HP cpu/player 10/10 / stones cpu/player 4/5 / deck cpu/player 17/17 / hand cpu/player 4/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act0/1 | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 prep
  - opponent handoff: turn 9 / current cpu / HP cpu/player 10/10 / stones cpu/player 7/4 / deck cpu/player 16/17 / hand cpu/player 5/4
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:真勇者ダイン Lv2 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act0/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
- #2 move:cpu_back_left->cpu_front_right
  - after root: turn 8 / current cpu / HP cpu/player 10/10 / stones cpu/player 5/2 / deck cpu/player 17/18 / hand cpu/player 5/4
  - board: player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2
  - own handoff: turn 9 / current player / HP cpu/player 10/10 / stones cpu/player 4/5 / deck cpu/player 17/17 / hand cpu/player 4/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act0/1 | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 prep
  - opponent handoff: turn 9 / current cpu / HP cpu/player 10/10 / stones cpu/player 7/4 / deck cpu/player 16/17 / hand cpu/player 5/4
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:真勇者ダイン Lv2 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act0/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1
- #3 summon:ヤンバル->cpu_front_right
  - after root: turn 8 / current cpu / HP cpu/player 10/10 / stones cpu/player 4/2 / deck cpu/player 17/18 / hand cpu/player 4/4
  - board: player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 prep | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus
  - own handoff: turn 9 / current player / HP cpu/player 10/10 / stones cpu/player 4/5 / deck cpu/player 17/17 / hand cpu/player 4/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act0/1 | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 prep | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus
  - opponent handoff: turn 9 / current cpu / HP cpu/player 10/10 / stones cpu/player 7/4 / deck cpu/player 16/17 / hand cpu/player 5/4
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:真勇者ダイン Lv2 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus
- #4 end_turn
  - after root: turn 9 / current player / HP cpu/player 10/10 / stones cpu/player 5/5 / deck cpu/player 17/17 / hand cpu/player 5/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act0/1 | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus
  - own handoff: turn 9 / current player / HP cpu/player 10/10 / stones cpu/player 5/5 / deck cpu/player 17/17 / hand cpu/player 5/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act0/1 | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus
  - opponent handoff: turn 9 / current cpu / HP cpu/player 10/10 / stones cpu/player 8/4 / deck cpu/player 16/17 / hand cpu/player 6/4
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:真勇者ダイン Lv2 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:デスシープ Lv2 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act0/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus
