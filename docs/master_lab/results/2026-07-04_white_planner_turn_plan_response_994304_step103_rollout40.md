# White Planner Turn Plan Response Audit

生成: 2026-07-04T09:14:08.959Z
seed: 994304
direction: `challenger-as-cpu`
deck: `master-lab-white-1377-death-sheep3`
search: `{}`
rolloutSteps: 40

## Conclusion

- 1 samples. terminal plan enabled 1件、adopted 1件。
- CPU選択がfallbackと異なる局面は0件。差分局面の own/opponent handoff board を実装候補にする。
- rollout 勝ち候補は0件。terminal score と rollout score が割れる候補を次の実装候補にする。

## Samples

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
| 1 | Y | Y | Y | focus:ドノマンティス | 191.2 | 137.8 | 110 | 123.9 | 163.5 | - | -79 | - |
| 2 |  |  |  | summon:デスシープ->cpu_back_left | 84.8 | 149.8 | 110 | 129.9 | 135.4 | - | 160 | - |
| 3 |  |  |  | summon:デスシープ->cpu_back_right | 84.8 | 149.8 | 110 | 129.9 | 135.4 | - | 16.8 | - |
| 4 |  |  |  | summon:ポリスピナー->cpu_back_left | 75 | 149.8 | 110 | 129.9 | 128.3 | - | 204 | - |

#### Candidate Boards

- #1 focus:ドノマンティス
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 9/1 / deck cpu/player 16/17 / hand cpu/player 3/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 7/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 10/8 / stones cpu/player 12/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | cpu_back_left:CB:デスシープ Lv1 HP6 act0/1
  - rollout: - / score -79 / steps 40
  - final: turn 13 / current player / HP cpu/player 9/6 / stones cpu/player 4/8 / deck cpu/player 13/13 / hand cpu/player 3/6
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus
- #2 summon:デスシープ->cpu_back_left
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 8/1 / deck cpu/player 16/17 / hand cpu/player 2/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:デスシープ Lv1 HP6 prep
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 7/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 10/8 / stones cpu/player 12/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | cpu_back_left:CB:デスシープ Lv1 HP6 act0/1
  - rollout: - / score 160 / steps 40
  - final: turn 12 / current player / HP cpu/player 10/7 / stones cpu/player 1/8 / deck cpu/player 14/14 / hand cpu/player 2/3
  - board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act2/2 focus | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 | player_back_right:PB:ボムゾウ Lv1 HP6 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:デスシープ Lv1 HP6 act1/1 focus
- #3 summon:デスシープ->cpu_back_right
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 8/1 / deck cpu/player 16/17 / hand cpu/player 2/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_right:CB:デスシープ Lv1 HP6 prep
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 7/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:ポリスピナー Lv1 HP3 prep | cpu_back_right:CB:デスシープ Lv1 HP6 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 10/8 / stones cpu/player 12/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2
  - rollout: - / score 16.8 / steps 40
  - final: turn 12 / current cpu / HP cpu/player 10/8 / stones cpu/player 2/0 / deck cpu/player 13/14 / hand cpu/player 3/3
  - board: player_front_left:PF:ボムゾウ Lv1 HP6 prep | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 focus,shield | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
- #4 summon:ポリスピナー->cpu_back_left
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 8/1 / deck cpu/player 16/17 / hand cpu/player 2/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:ポリスピナー Lv1 HP3 prep
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 7/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:ポリスピナー Lv1 HP3 prep | cpu_back_right:CB:デスシープ Lv1 HP6 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 10/8 / stones cpu/player 12/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2
  - rollout: - / score 204 / steps 40
  - final: turn 13 / current player / HP cpu/player 9/6 / stones cpu/player 0/11 / deck cpu/player 13/13 / hand cpu/player 3/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2


