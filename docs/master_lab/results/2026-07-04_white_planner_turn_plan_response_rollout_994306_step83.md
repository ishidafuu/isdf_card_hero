# White Planner Turn Plan Response Audit

生成: 2026-07-04T01:48:01.562Z
seed: 994306
direction: `challenger-as-player`
deck: `master-lab-white-1377-death-sheep3`
search: `{}`
rolloutSteps: 160

## Conclusion

- 1 samples. terminal plan enabled 1件、adopted 0件。
- CPU選択がfallbackと異なる局面は0件。差分局面の own/opponent handoff board を実装候補にする。
- rollout 勝ち候補は0件。terminal score と rollout score が割れる候補を次の実装候補にする。

## Samples

### step 83 / turn 8

- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- terminalPlan: enabled=true, adopted=false
- fallback: move:player_front_right->player_back_left (333.6)
- cpu: move:player_front_right->player_back_left
- planner selected: summon:ボムゾウ->player_back_left (117.2)
- runnerUp: 117.2
- rejected: terminal plan candidate did not pass adoption gate

| rank | planner | cpu | fallback | decision | root | own | opp | response | planner score | rollout | rollout score |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| 1 | Y |  |  | summon:ボムゾウ->player_back_left | 87.8 | 143.4 | 52.4 | 97.9 | 117.2 | - | -570 |
| 2 |  |  |  | summon:ボムゾウ->player_back_right | 87.8 | 143.4 | 52.4 | 97.9 | 117.2 | - | -277.2 |
| 3 |  | Y | Y | move:player_front_right->player_back_left | 112 | 125 | 56.4 | 90.7 | 115.3 | white | -1000000 |
| 4 |  |  |  | move:player_front_left->player_back_right | 108 | 125 | 56.4 | 90.7 | 114.5 | white | -1000000 |
| 5 |  |  |  | focus:ヤンバル | 32 | 131.4 | 52.4 | 91.9 | 98.9 | white | -1000000 |
| 6 |  |  |  | end_turn | -119 | 27.4 | -151.6 | -76.9 | -178.6 | white | -1000000 |

#### Candidate Boards

- #1 summon:ボムゾウ->player_back_left
  - after root: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 6/1 / deck player/cpu 18/18 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
  - own handoff: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 5/4 / deck player/cpu 18/17 / hand player/cpu 3/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 10/3 / deck player/cpu 17/17 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus
  - rollout: - / score -570 / steps 160
  - final: turn 21 / current player / HP player/cpu 4/9 / stones player/cpu 6/4 / deck player/cpu 5/5 / hand player/cpu 6/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | cpu_front_left:CF:ピグミィ Lv1 HP3 act1/2 focus,shield | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- #2 summon:ボムゾウ->player_back_right
  - after root: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 6/1 / deck player/cpu 18/18 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
  - own handoff: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 5/4 / deck player/cpu 18/17 / hand player/cpu 3/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | player_back_left:PB:ドノマンティス Lv1 HP5 prep | player_back_right:PB:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 10/3 / deck player/cpu 17/17 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 | player_back_right:PB:ボムゾウ Lv1 HP6 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus
  - rollout: - / score -277.2 / steps 160
  - final: turn 21 / current player / HP player/cpu 8/6 / stones player/cpu 4/0 / deck player/cpu 5/5 / hand player/cpu 6/4
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 prep | cpu_front_right:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus
- #3 move:player_front_right->player_back_left
  - after root: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
  - own handoff: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 5/4 / deck player/cpu 18/17 / hand player/cpu 3/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 prep | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 10/3 / deck player/cpu 17/17 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ボムゾウ Lv1 HP6 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus
  - rollout: white / score -1000000 / steps 92
  - final: turn 22 / current cpu / HP player/cpu 0/6 / stones player/cpu 33/31 / deck player/cpu 4/3 / hand player/cpu 5/6
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1
- #4 move:player_front_left->player_back_right
  - after root: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
  - board: player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
  - own handoff: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 5/4 / deck player/cpu 18/17 / hand player/cpu 3/6
  - board: player_front_left:PF:デスシープ Lv1 HP6 prep | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 10/3 / deck player/cpu 17/17 / hand player/cpu 4/5
  - board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus
  - rollout: white / score -1000000 / steps 148
  - final: turn 28 / current player / HP player/cpu 0/5 / stones player/cpu 42/39 / deck player/cpu 0/0 / hand player/cpu 5/5
  - board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus
- #5 focus:ヤンバル
  - after root: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act1/1 focus | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
  - own handoff: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 5/4 / deck player/cpu 18/17 / hand player/cpu 3/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act1/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 10/3 / deck player/cpu 17/17 / hand player/cpu 4/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus
  - rollout: white / score -1000000 / steps 66
  - final: turn 14 / current cpu / HP player/cpu 0/9 / stones player/cpu 9/11 / deck player/cpu 12/11 / hand player/cpu 5/6
  - board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus,shield | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus
- #6 end_turn
  - after root: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 7/4 / deck player/cpu 18/17 / hand player/cpu 5/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - own handoff: turn 8 / current cpu / HP player/cpu 9/10 / stones player/cpu 7/4 / deck player/cpu 18/17 / hand player/cpu 5/6
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
  - opponent handoff: turn 9 / current player / HP player/cpu 7/10 / stones player/cpu 12/3 / deck player/cpu 17/17 / hand player/cpu 6/5
  - board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 focus | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus
  - rollout: white / score -1000000 / steps 53
  - final: turn 13 / current cpu / HP player/cpu 0/10 / stones player/cpu 13/3 / deck player/cpu 13/12 / hand player/cpu 5/6
  - board: player_front_left:PF:ポリスピナー Lv1 HP3 act0/2 focus,shield | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP4 act1/1 | cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1


