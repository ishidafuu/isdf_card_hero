# White Planner Terminal Plan Inspect
生成: 2026-07-07T02:15:07.692Z
seed: 994339
direction: challenger-as-player
step: 13
deck: `master-lab-white-1377-death-sheep3`
## State
- state: turn 2 / current player / HP player/cpu 10/9 / stones player/cpu 2/1 / deck player/cpu 24/24 / hand player/cpu 2/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act2/2 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:ボムゾウ Lv1 HP6 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 prep | cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep
- fallback: master:shield->monster:player_front_left
- selected: master:shield->monster:player_front_right
- adopted: false
- rejected: terminal plan candidate did not pass adoption gate
## Candidates
| rank | selected | decision | root | planner | rollout | gap | steps | winner |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | Y | master:shield->monster:player_front_right | 50.5 | -58.3 |  |  |  |  |
| 2 |  | master:shield->monster:player_front_left | 57 | -63.9 |  |  |  |  |
| 3 |  | end_turn | -174.2 | -186.3 |  |  |  |  |
