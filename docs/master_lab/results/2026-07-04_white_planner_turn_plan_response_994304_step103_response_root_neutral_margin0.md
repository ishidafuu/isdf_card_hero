# White Planner Turn Plan Response Audit

生成: 2026-07-04T09:37:19.779Z
seed: 994304
direction: `challenger-as-cpu`
deck: `master-lab-white-1377-death-sheep3`
search: `{"terminalPlanRootDecisionWeight":0,"terminalPlanRootGapPenaltyWeight":0,"terminalPlanAdoptionMaxRootScoreGap":260,"terminalPlanAdoptionMinMargin":0,"terminalPlanRequireCompatibleFallbackAction":0}`
rolloutSteps: 0

## Conclusion

- 1 samples. terminal plan enabled 1件、adopted 1件。
- CPU選択がfallbackと異なる局面は1件。差分局面の own/opponent handoff board を実装候補にする。
- rollout 勝ち候補は0件。terminal score と rollout score が割れる候補を次の実装候補にする。

## Samples

### step 103 / turn 9

- state: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 9/1 / deck cpu/player 16/17 / hand cpu/player 3/4
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2
- terminalPlan: enabled=true, adopted=true
- fallback: focus:ドノマンティス (302.8)
- cpu: summon:デスシープ->cpu_back_left
- planner selected: summon:デスシープ->cpu_back_left (129.9)
- runnerUp: 129.9

| rank | planner | cpu | fallback | decision | root | own | opp | response | planner score | rollout | rollout score | rollout gap |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y |  | summon:デスシープ->cpu_back_left | 84.8 | 149.8 | 110 | 129.9 | 129.9 | - | - | - |
| 2 |  |  |  | summon:デスシープ->cpu_back_right | 84.8 | 149.8 | 110 | 129.9 | 129.9 | - | - | - |
| 3 |  |  |  | summon:ポリスピナー->cpu_back_left | 75 | 149.8 | 110 | 129.9 | 129.9 | - | - | - |
| 4 |  |  | Y | focus:ドノマンティス | 191.2 | 137.8 | 110 | 123.9 | 123.9 | - | - | - |
| 5 |  |  |  | end_turn | -84.2 | 41 | -102 | -36.2 | -36.2 | - | - | - |

#### Candidate Boards

- #1 summon:デスシープ->cpu_back_left
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 8/1 / deck cpu/player 16/17 / hand cpu/player 2/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:デスシープ Lv1 HP6 prep
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 7/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 10/8 / stones cpu/player 12/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | cpu_back_left:CB:デスシープ Lv1 HP6 act0/1
- #2 summon:デスシープ->cpu_back_right
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 8/1 / deck cpu/player 16/17 / hand cpu/player 2/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_right:CB:デスシープ Lv1 HP6 prep
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 7/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:ポリスピナー Lv1 HP3 prep | cpu_back_right:CB:デスシープ Lv1 HP6 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 10/8 / stones cpu/player 12/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2
- #3 summon:ポリスピナー->cpu_back_left
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 8/1 / deck cpu/player 16/17 / hand cpu/player 2/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:ポリスピナー Lv1 HP3 prep
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 7/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:ポリスピナー Lv1 HP3 prep | cpu_back_right:CB:デスシープ Lv1 HP6 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 10/8 / stones cpu/player 12/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2
- #4 focus:ドノマンティス
  - after root: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 9/1 / deck cpu/player 16/17 / hand cpu/player 3/4
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 7/4 / deck cpu/player 16/16 / hand cpu/player 1/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
  - opponent handoff: turn 10 / current cpu / HP cpu/player 10/8 / stones cpu/player 12/4 / deck cpu/player 15/16 / hand cpu/player 2/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | cpu_back_left:CB:デスシープ Lv1 HP6 act0/1
- #5 end_turn
  - after root: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 9/4 / deck cpu/player 16/16 / hand cpu/player 3/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2
  - own handoff: turn 10 / current player / HP cpu/player 10/8 / stones cpu/player 9/4 / deck cpu/player 16/16 / hand cpu/player 3/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2
  - opponent handoff: turn 10 / current cpu / HP cpu/player 10/8 / stones cpu/player 14/4 / deck cpu/player 15/16 / hand cpu/player 4/5
  - board: player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus


