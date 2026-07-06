# White Rollout Trigger Audit

生成: 2026-07-06T11:49:58.803Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994318-994333
directions: challenger-as-cpu, challenger-as-player
baseline: `white`, challenger: `white_planner`
inspectThresholdMs: 8000

## Conclusion

- 32 games. challenger wins 22, inspected decisions 7, rollout-triggered decisions 7.
- max challenger decision 11334.1ms, avg challenger decision 644.4ms.
- rollout adopted 6/7; avg selected rollout gap 14.3.
- Next implementation target is the repeated rollout-trigger shape, not a broad coefficient change.

## Games

| seed | direction | result | steps | turns | HP | decisions | avg ms | max ms | events | issue |
| ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 994318 | challenger-as-cpu | white_planner | 181 | 17 | P0/C9 | 89 | 550.2 | 3518.4 | 0 | - |
| 994319 | challenger-as-cpu | white_planner | 291 | 29 | P0/C5 | 156 | 646.2 | 3989.5 | 0 | - |
| 994320 | challenger-as-cpu | white_planner | 195 | 27 | P0/C7 | 101 | 466 | 2793.2 | 0 | - |
| 994321 | challenger-as-cpu | white | 189 | 16 | P7/C0 | 83 | 545.3 | 2135.5 | 0 | - |
| 994322 | challenger-as-cpu | white_planner | 191 | 19 | P0/C6 | 93 | 646.7 | 4760.5 | 0 | - |
| 994323 | challenger-as-cpu | white | 262 | 24 | P5/C0 | 128 | 940.2 | 6112.4 | 0 | - |
| 994324 | challenger-as-cpu | white_planner | 249 | 23 | P0/C7 | 131 | 778.7 | 4038.4 | 1 | - |
| 994325 | challenger-as-cpu | white | 163 | 17 | P10/C0 | 69 | 854.4 | 11334.1 | 1 | - |
| 994326 | challenger-as-cpu | white_planner | 149 | 15 | P0/C5 | 78 | 346.5 | 1563 | 0 | - |
| 994327 | challenger-as-cpu | white_planner | 143 | 14 | P0/C9 | 73 | 458.7 | 3187 | 0 | - |
| 994328 | challenger-as-cpu | white_planner | 265 | 24 | P0/C5 | 132 | 612.7 | 3660.5 | 1 | - |
| 994329 | challenger-as-cpu | white_planner | 228 | 19 | P0/C8 | 113 | 840.7 | 5457.4 | 0 | - |
| 994330 | challenger-as-cpu | white_planner | 271 | 26 | P0/C9 | 131 | 653.6 | 4197.4 | 0 | - |
| 994331 | challenger-as-cpu | white | 199 | 20 | P2/C0 | 92 | 896.2 | 4441.4 | 0 | - |
| 994332 | challenger-as-cpu | white | 198 | 27 | P8/C0 | 93 | 517.4 | 3168.3 | 0 | - |
| 994333 | challenger-as-cpu | white_planner | 199 | 16 | P0/C8 | 99 | 893.6 | 6203 | 1 | - |
| 994318 | challenger-as-player | white | 181 | 16 | P0/C4 | 96 | 433.9 | 2588.2 | 0 | - |
| 994319 | challenger-as-player | white_planner | 178 | 21 | P9/C0 | 93 | 288.7 | 1443.6 | 0 | - |
| 994320 | challenger-as-player | white_planner | 301 | 29 | P1/C0 | 129 | 638.2 | 4330.3 | 0 | - |
| 994321 | challenger-as-player | white_planner | 297 | 31 | P3/C0 | 157 | 811.3 | 4505.3 | 0 | - |
| 994322 | challenger-as-player | white_planner | 244 | 27 | P6/C0 | 124 | 573.2 | 5037.5 | 0 | - |
| 994323 | challenger-as-player | white_planner | 262 | 24 | P5/C0 | 125 | 639.8 | 4253.7 | 1 | - |
| 994324 | challenger-as-player | white | 184 | 21 | P0/C2 | 83 | 558.5 | 3356.7 | 0 | - |
| 994325 | challenger-as-player | white | 89 | 9 | P0/C3 | 48 | 501.2 | 2204 | 0 | - |
| 994326 | challenger-as-player | white_planner | 134 | 14 | P10/C0 | 63 | 361 | 1846.9 | 1 | - |
| 994327 | challenger-as-player | white | 146 | 14 | P0/C8 | 71 | 398.2 | 2645.9 | 0 | - |
| 994328 | challenger-as-player | white_planner | 292 | 25 | P5/C0 | 150 | 694.3 | 2596.2 | 0 | - |
| 994329 | challenger-as-player | white_planner | 307 | 28 | P7/C0 | 157 | 760.8 | 4675.8 | 0 | - |
| 994330 | challenger-as-player | white_planner | 265 | 27 | P8/C0 | 143 | 834.8 | 5303.3 | 0 | - |
| 994331 | challenger-as-player | white_planner | 199 | 20 | P2/C0 | 103 | 585.5 | 2749.9 | 0 | - |
| 994332 | challenger-as-player | white_planner | 165 | 15 | P10/C0 | 81 | 1126.7 | 7393.8 | 1 | - |
| 994333 | challenger-as-player | white | 206 | 17 | P0/C2 | 101 | 766.9 | 4937.2 | 0 | - |

## Events

### seed 994324 / challenger-as-cpu / step 243 / turn 22

- elapsed: 683ms / inspection 673.8ms
- state: turn 22 / current cpu / HP cpu/player 7/2 / stones cpu/player 2/12 / deck cpu/player 3/4 / hand cpu/player 6/5
- board: player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->真勇者ダイン
- fallback: attack:ピグミィ:スパイクボール->真勇者ダイン (146)
- planner selected: attack:ピグミィ:スパイクボール->真勇者ダイン (388.6)
- root gap to fallback: 43.5
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:player-front-right:真勇者ダインLv1HP6(act0/1,focus) | 102.5 | 388.6 | 216 | 212 | 220 | white_planner | 1000000 | 0 |
| 2 |  |  |  | end_turn | - | 50.4 | 319.6 | 158.5 | 194 | 123 | white_planner | 1000000 | 0 |

### seed 994325 / challenger-as-cpu / step 106 / turn 9

- elapsed: 11334.1ms / inspection 11288.2ms
- state: turn 9 / current cpu / HP cpu/player 9/10 / stones cpu/player 2/5 / deck cpu/player 16/17 / hand cpu/player 5/4
- board: player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep
- rolloutTriggered: true, adopted: false
- decision: end_turn
- fallback: end_turn (-89.2)
- planner selected: master:shield->monster:cpu_front_left (-72.2)
- root gap to fallback: -153.7
- planner margin to fallback: 47.7
- selected rollout gap to fallback: 100

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 |  | Y |  | master:shield->monster:cpu_front_left | - | 64.4 | -72.2 | -27 | -9 | -45 | - | -395.8 | 100 |
| 2 |  |  |  | master:shield->monster:cpu_back_left | - | 53.1 | -94.6 | -34 | -23 | -45 | - | -482 | 13.8 |
| 3 | Y |  | Y | end_turn | - | -32.4 | -119.9 | -30 | -25 | -35 | - | -495.8 | 0 |

### seed 994328 / challenger-as-cpu / step 258 / turn 23

- elapsed: 1279ms / inspection 1217.6ms
- state: turn 23 / current cpu / HP cpu/player 5/2 / stones cpu/player 3/10 / deck cpu/player 2/3 / hand cpu/player 6/5
- board: player_front_left:PF:ポリスピナー Lv1 HP3 act1/2 focus | player_front_right:PF:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:attack->ポリスピナー
- fallback: attack:ピグミィ:attack->ポリスピナー (408.2)
- planner selected: attack:ピグミィ:attack->ポリスピナー (400.2)
- root gap to fallback: 330.1
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:attack->ポリスピナー | attackTarget:player-front-left:ポリスピナーLv1HP3(act1/2,focus) | 78.1 | 400.2 | 233 | 191 | 275 | white_planner | 1000000 | 0 |
| 2 |  |  |  | end_turn | - | 37.1 | 234.4 | 76.3 | 158 | 9 | white_planner | 1000000 | 0 |

### seed 994333 / challenger-as-cpu / step 193 / turn 15

- elapsed: 726.7ms / inspection 639.9ms
- state: turn 15 / current cpu / HP cpu/player 8/2 / stones cpu/player 6/6 / deck cpu/player 10/11 / hand cpu/player 6/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus,shield | player_front_right:PF:真勇者ダイン Lv1 HP5 act1/1 shield | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 focus | cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1
- rolloutTriggered: true, adopted: true
- decision: attack:ヤンバル:wild_claw->デスシープ
- fallback: attack:ヤンバル:wild_claw->デスシープ (226)
- planner selected: attack:ヤンバル:wild_claw->デスシープ (156.7)
- root gap to fallback: 136.6
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ヤンバル:wild_claw->デスシープ | attackTarget:player-front-left:デスシープLv1HP6(act1/1,focus,shield) | 89.3 | 156.7 | -13 | -10 | -16 | white_planner | 1000000 | 0 |
| 2 |  |  |  | end_turn | - | -75 | -55.1 | -30 | 36 | -92 | - | 224 | -999776 |

### seed 994323 / challenger-as-player / step 257 / turn 23

- elapsed: 101.6ms / inspection 91.8ms
- state: turn 23 / current player / HP player/cpu 5/2 / stones player/cpu 8/14 / deck player/cpu 3/3 / hand player/cpu 4/5
- board: player_front_left:PF:ポリスピナー Lv2 HP3 act2/2 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_right:CB:デスシープ Lv1 HP6 act0/1 focus
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->真勇者ダイン
- fallback: attack:ピグミィ:スパイクボール->真勇者ダイン (147.2)
- planner selected: attack:ピグミィ:スパイクボール->真勇者ダイン (363.4)
- root gap to fallback: 46.6
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:cpu-front-right:真勇者ダインLv1HP6(act0/1,focus) | 100.6 | 363.4 | 210 | 203 | 217 | - | 875 | 0 |
| 2 |  |  |  | end_turn | - | 99.1 | 234.6 | 107.8 | 185 | 42 | - | 700 | -175 |

### seed 994326 / challenger-as-player / step 129 / turn 13

- elapsed: 147.6ms / inspection 143.7ms
- state: turn 13 / current player / HP player/cpu 10/2 / stones player/cpu 5/10 / deck player/cpu 13/13 / hand player/cpu 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->ドノマンティス
- fallback: attack:ピグミィ:スパイクボール->ドノマンティス (100.6)
- planner selected: attack:ピグミィ:スパイクボール->ドノマンティス (200.2)
- root gap to fallback: 22.6
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:cpu-front-left:ドノマンティスLv1HP5(act0/1,focus) | 78 | 200.2 | 33 | 36 | 30 | white_planner | 1000000 | 0 |
| 2 |  |  |  | end_turn | - | -24 | 133.2 | -0.5 | 18 | -19 | white_planner | 1000000 | 0 |

### seed 994332 / challenger-as-player / step 161 / turn 14

- elapsed: 57.7ms / inspection 56.2ms
- state: turn 14 / current player / HP player/cpu 10/1 / stones player/cpu 8/17 / deck player/cpu 12/12 / hand player/cpu 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->真勇者ダイン
- fallback: attack:ピグミィ:スパイクボール->真勇者ダイン (144.8)
- planner selected: attack:ピグミィ:スパイクボール->真勇者ダイン (350.6)
- root gap to fallback: 64.8
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:cpu-front-left:真勇者ダインLv1HP6(act0/1,focus) | 80 | 350.6 | 183 | 176 | 190 | white_planner | 1000000 | 0 |
| 2 |  |  |  | end_turn | - | 15.4 | 301.9 | 148.5 | 158 | 139 | white_planner | 1000000 | 0 |


