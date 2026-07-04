# White Planner Turn Plan Response Audit

生成: 2026-07-04T09:09:59.659Z
seed: 994304
direction: `challenger-as-cpu`
deck: `master-lab-white-1377-death-sheep3`
search: `{}`
rolloutSteps: 0

## Conclusion

- 2 samples. terminal plan enabled 2件、adopted 2件。
- CPU選択がfallbackと異なる局面は0件。差分局面の own/opponent handoff board を実装候補にする。
- rollout 勝ち候補は0件。terminal score と rollout score が割れる候補を次の実装候補にする。

## Samples

### step 101 / turn 9

- state: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 10/0 / deck cpu/player 16/17 / hand cpu/player 3/4
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP4 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2
- terminalPlan: enabled=true, adopted=true
- fallback: attack:ポリスピナー:attack->ボムゾウ (529.6)
- cpu: attack:ポリスピナー:attack->ボムゾウ
- planner selected: attack:ポリスピナー:attack->ボムゾウ (376)
- runnerUp: 370

| rank | planner | cpu | fallback | decision | root | own | opp | response | planner score | rollout | rollout score | rollout gap |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ポリスピナー:attack->ボムゾウ | 183.9 | 338.8 | 334 | 336.4 | 376 | - | - | - |
| 2 |  |  |  | focus:ドノマンティス | 195.2 | 326.8 | 334 | 330.4 | 370 | - | - | - |
| 3 |  |  |  | summon:デスシープ->cpu_back_left | 84.8 | 338.8 | 334 | 336.4 | 339.9 | - | - | - |
| 4 |  |  |  | summon:デスシープ->cpu_back_right | 84.8 | 338.8 | 334 | 336.4 | 339.9 | - | - | - |
| 5 |  |  |  | focus:ポリスピナー | 59.2 | 323.8 | 319 | 321.4 | 306.4 | - | - | - |
| 6 |  |  |  | end_turn | -42.3 | 91 | -15 | 38 | -50.1 | - | - | - |

#### Candidate Boards

- #1 attack:ポリスピナー:attack->ボムゾウ
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 10/0 / deck cpu/player 16/17 / hand cpu/player 3/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP2 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 5/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus | cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 9/8 / stones cpu/player 9/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_left:CB:デスシープ Lv1 HP6 act0/1 | cpu_back_right:CB:ポリスピナー Lv1 HP3 act0/2
- #2 focus:ドノマンティス
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 10/0 / deck cpu/player 16/17 / hand cpu/player 3/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP4 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 5/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus | cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 9/8 / stones cpu/player 9/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_left:CB:デスシープ Lv1 HP6 act0/1 | cpu_back_right:CB:ポリスピナー Lv1 HP3 act0/2
- #3 summon:デスシープ->cpu_back_left
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 9/0 / deck cpu/player 16/17 / hand cpu/player 2/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP4 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | cpu_back_left:CB:デスシープ Lv1 HP6 prep
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 5/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus | cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 9/8 / stones cpu/player 9/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_left:CB:デスシープ Lv1 HP6 act0/1 | cpu_back_right:CB:ポリスピナー Lv1 HP3 act0/2
- #4 summon:デスシープ->cpu_back_right
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 9/0 / deck cpu/player 16/17 / hand cpu/player 2/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP4 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | cpu_back_right:CB:デスシープ Lv1 HP6 prep
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 5/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus | cpu_back_left:CB:ポリスピナー Lv1 HP3 prep | cpu_back_right:CB:デスシープ Lv1 HP6 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 9/8 / stones cpu/player 9/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 | cpu_back_right:CB:デスシープ Lv1 HP6 act0/1
- #5 focus:ポリスピナー
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 10/0 / deck cpu/player 16/17 / hand cpu/player 3/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP4 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 2/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus | cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 9/8 / stones cpu/player 6/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_left:CB:デスシープ Lv1 HP6 act0/1 | cpu_back_right:CB:ポリスピナー Lv1 HP3 act0/2
- #6 end_turn
  - after root: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 10/3 / deck cpu/player 16/16 / hand cpu/player 3/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ボムゾウ Lv1 HP4 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 10/3 / deck cpu/player 16/16 / hand cpu/player 3/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ボムゾウ Lv1 HP4 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus
  - opponent handoff: turn 10 / current cpu / HP cpu/player 9/8 / stones cpu/player 14/3 / deck cpu/player 15/16 / hand cpu/player 4/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ボムゾウ Lv1 HP4 act0/1 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus

### step 103 / turn 9

- state: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 9/1 / deck cpu/player 16/17 / hand cpu/player 3/4
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2
- terminalPlan: enabled=true, adopted=true
- fallback: focus:ドノマンティス (302.8)
- cpu: focus:ドノマンティス
- planner selected: focus:ドノマンティス (163.5)
- runnerUp: 135.4

| rank | planner | cpu | fallback | decision | root | own | opp | response | planner score | rollout | rollout score | rollout gap |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ドノマンティス | 191.2 | 137.8 | 110 | 123.9 | 163.5 | - | - | - |
| 2 |  |  |  | summon:デスシープ->cpu_back_left | 84.8 | 149.8 | 110 | 129.9 | 135.4 | - | - | - |
| 3 |  |  |  | summon:デスシープ->cpu_back_right | 84.8 | 149.8 | 110 | 129.9 | 135.4 | - | - | - |
| 4 |  |  |  | summon:ポリスピナー->cpu_back_left | 75 | 149.8 | 110 | 129.9 | 128.3 | - | - | - |
| 5 |  |  |  | end_turn | -84.2 | 41 | -102 | -36.2 | -152.4 | - | - | - |

#### Candidate Boards

- #1 focus:ドノマンティス
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 9/1 / deck cpu/player 16/17 / hand cpu/player 3/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 7/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 10/8 / stones cpu/player 12/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | cpu_back_left:CB:デスシープ Lv1 HP6 act0/1
- #2 summon:デスシープ->cpu_back_left
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 8/1 / deck cpu/player 16/17 / hand cpu/player 2/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:デスシープ Lv1 HP6 prep
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 7/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 10/8 / stones cpu/player 12/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | cpu_back_left:CB:デスシープ Lv1 HP6 act0/1
- #3 summon:デスシープ->cpu_back_right
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 8/1 / deck cpu/player 16/17 / hand cpu/player 2/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_right:CB:デスシープ Lv1 HP6 prep
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 7/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:ポリスピナー Lv1 HP3 prep | cpu_back_right:CB:デスシープ Lv1 HP6 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 10/8 / stones cpu/player 12/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2
- #4 summon:ポリスピナー->cpu_back_left
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 8/1 / deck cpu/player 16/17 / hand cpu/player 2/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:ポリスピナー Lv1 HP3 prep
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 7/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:ポリスピナー Lv1 HP3 prep | cpu_back_right:CB:デスシープ Lv1 HP6 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 10/8 / stones cpu/player 12/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2
- #5 end_turn
  - after root: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 9/4 / deck cpu/player 16/16 / hand cpu/player 3/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 9/4 / deck cpu/player 16/16 / hand cpu/player 3/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2
  - opponent handoff: turn 10 / current cpu / HP cpu/player 10/8 / stones cpu/player 14/4 / deck cpu/player 15/16 / hand cpu/player 4/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus


