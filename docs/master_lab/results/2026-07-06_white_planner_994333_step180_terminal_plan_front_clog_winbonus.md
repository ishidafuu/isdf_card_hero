# White Planner Terminal Plan Inspect
生成: 2026-07-06T15:21:05.452Z
seed: 994333
direction: challenger-as-player
step: 180
deck: `master-lab-white-1377-death-sheep3`
## State
- state: turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 6/3 / deck player/cpu 12/12 / hand player/cpu 6/5
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:デスシープ Lv2 HP1 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus
- fallback: summon:デスシープ->player_front_right
- selected: end_turn
- adopted: true
## Candidates
| rank | selected | decision | root | planner | rollout | gap | steps | winner |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | Y | end_turn | -70 | 1331.6 | 1000000 | 2000000 | 54 | player |
| 2 |  | master:master_attack->monster:cpu_front_right | 463 | 643.2 | -129 | 999871 | 60 |  |
| 3 |  | summon:デスシープ->player_back_right | 89.8 | 470.7 | -129 | 999871 | 60 |  |
| 4 |  | summon:デスシープ->player_front_right | 131.8 | -32.1 | -1000000 | 0 | 26 | cpu |
