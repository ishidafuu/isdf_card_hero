# White Planner Turn Plan Response Audit

生成: 2026-07-05T13:38:05.321Z
seed: 994312
direction: `challenger-as-player`
deck: `master-lab-white-1377-death-sheep3`
search: `{}`
rolloutSteps: 0

## Conclusion

- 1 samples. terminal plan enabled 1件、adopted 1件。
- CPU選択がfallbackと異なる局面は1件。差分局面の own/opponent handoff board を実装候補にする。
- rollout 勝ち候補は1件。terminal score と rollout score が割れる候補を次の実装候補にする。

## Samples

### step 247 / turn 20

- state: turn 20 / current player / HP player/cpu 6/10 / stones player/cpu 8/2 / deck player/cpu 6/6 / hand player/cpu 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 shield | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus
- terminalPlan: enabled=true, adopted=true
- fallback: magic:ローテーション->master:player (306.8)
- cpu: move:player_back_left->player_front_right
- planner selected: move:player_back_left->player_front_right (707.4)
- runnerUp: 72.3

| rank | planner | cpu | fallback | decision | root | own | opp | response | planner score | rollout | rollout score | rollout gap |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y |  | move:player_back_left->player_front_right | 104 | 56 | 13 | 34.5 | 707.4 | white_planner | 1000000 | 2000000 |
| 2 |  |  | Y | magic:ローテーション->master:player | 46.6 | 246 | 178 | 212 | 72.3 | white | -1000000 | 0 |
| 3 |  |  |  | move:player_front_right->player_back_right | 58 | 184 | 93 | 138.5 | 1.3 | white | -1000000 | 0 |
| 4 |  |  |  | end_turn | -8 | 160 | 93 | 126.5 | -41.3 | white | -1000000 | 0 |

#### Candidate Boards

- #1 move:player_back_left->player_front_right
  - after root: turn 20 / current player / HP player/cpu 6/10 / stones player/cpu 8/2 / deck player/cpu 6/6 / hand player/cpu 6/5
  - board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 shield | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus
  - own handoff: turn 20 / current cpu / HP player/cpu 6/10 / stones player/cpu 8/5 / deck player/cpu 6/5 / hand player/cpu 5/6
  - board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus
  - opponent handoff: turn 21 / current player / HP player/cpu 5/10 / stones player/cpu 12/5 / deck player/cpu 5/5 / hand player/cpu 6/5
  - board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus
- #2 magic:ローテーション->master:player
  - after root: turn 20 / current player / HP player/cpu 6/10 / stones player/cpu 5/2 / deck player/cpu 6/6 / hand player/cpu 5/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ボムゾウ Lv2 HP5 act1/1 shield | cpu_back_right:CB:デスシープ Lv2 HP6 act1/1 shield
  - own handoff: turn 20 / current cpu / HP player/cpu 6/10 / stones player/cpu 2/6 / deck player/cpu 6/5 / hand player/cpu 5/6
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_right:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_back_right:CB:デスシープ Lv2 HP6 act0/1
  - opponent handoff: turn 21 / current player / HP player/cpu 6/10 / stones player/cpu 5/5 / deck player/cpu 5/5 / hand player/cpu 6/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ポリスピナー Lv1 HP3 prep | cpu_front_right:CF:ボムゾウ Lv2 HP5 act0/1 focus | cpu_back_right:CB:デスシープ Lv2 HP6 act0/1 focus
- #3 move:player_front_right->player_back_right
  - after root: turn 20 / current player / HP player/cpu 6/10 / stones player/cpu 8/2 / deck player/cpu 6/6 / hand player/cpu 6/5
  - board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 shield | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus
  - own handoff: turn 20 / current cpu / HP player/cpu 6/10 / stones player/cpu 8/5 / deck player/cpu 6/5 / hand player/cpu 5/6
  - board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus
  - opponent handoff: turn 21 / current player / HP player/cpu 5/10 / stones player/cpu 12/5 / deck player/cpu 5/5 / hand player/cpu 6/5
  - board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus
- #4 end_turn
  - after root: turn 20 / current cpu / HP player/cpu 6/10 / stones player/cpu 8/5 / deck player/cpu 6/5 / hand player/cpu 5/6
  - board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus
  - own handoff: turn 20 / current cpu / HP player/cpu 6/10 / stones player/cpu 8/5 / deck player/cpu 6/5 / hand player/cpu 5/6
  - board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus
  - opponent handoff: turn 21 / current player / HP player/cpu 5/10 / stones player/cpu 12/5 / deck player/cpu 5/5 / hand player/cpu 6/5
  - board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus


