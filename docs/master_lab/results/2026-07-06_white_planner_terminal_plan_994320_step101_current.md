# White Planner Terminal Plan Inspect
生成: 2026-07-06T02:57:49.452Z
seed: 994320
direction: challenger-as-player
step: 101
deck: `master-lab-white-1377-death-sheep3`
## State
- state: turn 10 / current player / HP player/cpu 6/8 / stones player/cpu 8/4 / deck player/cpu 16/16 / hand player/cpu 5/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- fallback: master:wake_up->monster:cpu_back_left
- selected: focus:真勇者ダイン
- adopted: false
- rejected: terminal plan candidate did not pass adoption gate
## Candidates
| rank | selected | decision | root | planner | rollout | gap | steps | winner |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | Y | focus:真勇者ダイン | 186.2 | 157.6 |  |  |  |  |
| 2 |  | master:wake_up->monster:cpu_back_left | 295 | 153 |  |  |  |  |
| 3 |  | attack:ピグミィ:スパイクボール->デスシープ | 92.9 | 72.8 |  |  |  |  |
| 4 |  | focus:ピグミィ | 44 | 56.6 |  |  |  |  |
| 5 |  | attack:ヤンバル:wild_claw->デスシープ | 6.4 | 29.5 |  |  |  |  |
| 6 |  | attack:ヤンバル:wild_claw->ピグミィ | 66 | -57.6 |  |  |  |  |
| 7 |  | end_turn | -51.2 | -100 |  |  |  |  |
