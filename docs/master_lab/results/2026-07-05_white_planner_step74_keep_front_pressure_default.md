# White Planner Turn Plan Response Audit

生成: 2026-07-05T07:00:39.945Z
seed: 994309
direction: `challenger-as-cpu`
deck: `master-lab-white-1377-death-sheep3`
search: `{}`
rolloutSteps: 0

## Conclusion

- 1 samples. terminal plan enabled 1件、adopted 1件。
- CPU選択がfallbackと異なる局面は1件。差分局面の own/opponent handoff board を実装候補にする。
- rollout 勝ち候補は0件。terminal score と rollout score が割れる候補を次の実装候補にする。

## Samples

### step 74 / turn 7

- state: turn 7 / current cpu / HP cpu/player 10/9 / stones cpu/player 9/1 / deck cpu/player 18/19 / hand cpu/player 5/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus
- terminalPlan: enabled=true, adopted=true
- fallback: focus:デスシープ (310.2)
- cpu: magic:ワープ->monster:player_front_right:monster:player_back_left
- planner selected: magic:ワープ->monster:player_front_right:monster:player_back_left (449.3)
- runnerUp: 332.4

| rank | planner | cpu | fallback | decision | root | own | opp | response | planner score | rollout | rollout score | rollout gap |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y |  | magic:ワープ->monster:player_front_right:monster:player_back_left | 61 | 224 | 177 | 200.5 | 449.3 | - | - | - |
| 2 |  |  | Y | focus:デスシープ | 190.2 | 341 | 261 | 301 | 332.4 | - | -54.6 | 0 |
| 3 |  |  |  | magic:ワープ->monster:player_front_right:monster:player_back_right | 61 | 295 | 203 | 249 | 317.8 | - | - | - |
| 4 |  |  |  | summon:ポリスピナー->cpu_back_right | 80 | 341 | 261 | 301 | 303.5 | - | - | - |
| 5 |  |  |  | magic:ワープ->monster:player_front_left:monster:player_back_left | 65 | 252 | 162 | 207 | 198.7 | - | - | - |
| 6 |  |  |  | magic:ワープ->monster:player_back_left:monster:player_front_left | 65 | 252 | 162 | 207 | 198.7 | - | - | - |
| 7 |  |  |  | attack:デスシープ:attack->真勇者ダイン | -47 | 229 | 131 | 180 | 79.6 | - | -76.4 | -21.8 |
| 8 |  |  |  | end_turn | -84.2 | 117 | -31 | 36 | -79.8 | - | - | - |

#### Candidate Boards

- #1 magic:ワープ->monster:player_front_right:monster:player_back_left
  - after root: turn 7 / current cpu / HP cpu/player 10/9 / stones cpu/player 6/1 / deck cpu/player 18/19 / hand cpu/player 4/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_left:PB:真勇者ダイン Lv3 HP6 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus
  - own handoff: turn 8 / current player / HP cpu/player 10/9 / stones cpu/player 5/4 / deck cpu/player 18/18 / hand cpu/player 3/6
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_left:PB:真勇者ダイン Lv3 HP6 act0/1 | player_back_right:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - opponent handoff: turn 8 / current cpu / HP cpu/player 9/9 / stones cpu/player 9/4 / deck cpu/player 17/18 / hand cpu/player 4/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_left:PB:真勇者ダイン Lv3 HP6 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 act0/2
- #2 focus:デスシープ
  - after root: turn 7 / current cpu / HP cpu/player 10/9 / stones cpu/player 9/1 / deck cpu/player 18/19 / hand cpu/player 5/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus
  - own handoff: turn 8 / current player / HP cpu/player 10/9 / stones cpu/player 2/6 / deck cpu/player 18/18 / hand cpu/player 3/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - opponent handoff: turn 8 / current cpu / HP cpu/player 8/9 / stones cpu/player 7/6 / deck cpu/player 17/18 / hand cpu/player 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 act0/2
- #3 magic:ワープ->monster:player_front_right:monster:player_back_right
  - after root: turn 7 / current cpu / HP cpu/player 10/9 / stones cpu/player 6/1 / deck cpu/player 18/19 / hand cpu/player 4/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus
  - own handoff: turn 8 / current player / HP cpu/player 10/9 / stones cpu/player 2/6 / deck cpu/player 18/18 / hand cpu/player 3/6
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - opponent handoff: turn 8 / current cpu / HP cpu/player 8/9 / stones cpu/player 7/6 / deck cpu/player 17/18 / hand cpu/player 4/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 act0/2
- #4 summon:ポリスピナー->cpu_back_right
  - after root: turn 7 / current cpu / HP cpu/player 10/9 / stones cpu/player 8/1 / deck cpu/player 18/19 / hand cpu/player 4/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - own handoff: turn 8 / current player / HP cpu/player 10/9 / stones cpu/player 2/6 / deck cpu/player 18/18 / hand cpu/player 3/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - opponent handoff: turn 8 / current cpu / HP cpu/player 8/9 / stones cpu/player 7/6 / deck cpu/player 17/18 / hand cpu/player 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 act0/2
- #5 magic:ワープ->monster:player_front_left:monster:player_back_left
  - after root: turn 7 / current cpu / HP cpu/player 10/9 / stones cpu/player 6/1 / deck cpu/player 18/19 / hand cpu/player 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 act1/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus
  - own handoff: turn 8 / current player / HP cpu/player 10/9 / stones cpu/player 5/4 / deck cpu/player 18/18 / hand cpu/player 3/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 prep | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act1/2 focus
  - opponent handoff: turn 8 / current cpu / HP cpu/player 8/9 / stones cpu/player 10/4 / deck cpu/player 17/18 / hand cpu/player 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- #6 magic:ワープ->monster:player_back_left:monster:player_front_left
  - after root: turn 7 / current cpu / HP cpu/player 10/9 / stones cpu/player 6/1 / deck cpu/player 18/19 / hand cpu/player 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 act1/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus
  - own handoff: turn 8 / current player / HP cpu/player 10/9 / stones cpu/player 5/4 / deck cpu/player 18/18 / hand cpu/player 3/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 prep | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act1/2 focus
  - opponent handoff: turn 8 / current cpu / HP cpu/player 8/9 / stones cpu/player 10/4 / deck cpu/player 17/18 / hand cpu/player 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- #7 attack:デスシープ:attack->真勇者ダイン
  - after root: turn 7 / current cpu / HP cpu/player 10/9 / stones cpu/player 9/1 / deck cpu/player 18/19 / hand cpu/player 5/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus
  - own handoff: turn 8 / current player / HP cpu/player 10/9 / stones cpu/player 2/6 / deck cpu/player 18/18 / hand cpu/player 3/6
  - board: player_front_left:PF:真勇者ダイン Lv1 HP5 act0/1 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - opponent handoff: turn 8 / current cpu / HP cpu/player 8/9 / stones cpu/player 7/6 / deck cpu/player 17/18 / hand cpu/player 4/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP5 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 act0/2
- #8 end_turn
  - after root: turn 8 / current player / HP cpu/player 10/9 / stones cpu/player 9/4 / deck cpu/player 18/18 / hand cpu/player 5/6
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus
  - own handoff: turn 8 / current player / HP cpu/player 10/9 / stones cpu/player 9/4 / deck cpu/player 18/18 / hand cpu/player 5/6
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus
  - opponent handoff: turn 8 / current cpu / HP cpu/player 8/9 / stones cpu/player 14/4 / deck cpu/player 17/18 / hand cpu/player 6/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus


