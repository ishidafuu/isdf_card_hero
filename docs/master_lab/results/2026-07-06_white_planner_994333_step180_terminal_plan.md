# White Planner Terminal Plan Inspect
生成: 2026-07-06T15:10:48.851Z
seed: 994333
direction: challenger-as-player
step: 180
deck: `master-lab-white-1377-death-sheep3`
## State
- state: turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 6/3 / deck player/cpu 12/12 / hand player/cpu 6/5
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:デスシープ Lv2 HP1 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus
- fallback: summon:デスシープ->player_front_right
- selected: master:master_attack->monster:cpu_front_right
- adopted: false
- rejected: terminal plan candidate did not pass adoption gate
## Candidates
| rank | selected | decision | root | planner | rollout | gap | steps | winner |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | Y | master:master_attack->monster:cpu_front_right | 463 | 162.5 |  |  |  |  |
| 2 |  | summon:デスシープ->player_front_right | 131.8 | 117.9 |  |  |  |  |
| 3 |  | summon:デスシープ->player_back_right | 89.8 | -9.9 |  |  |  |  |
| 4 |  | end_turn | -70 | -318.4 |  |  |  |  |
