# White Rollout Trigger Audit

生成: 2026-07-06T09:09:09.439Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994318-994333
directions: challenger-as-cpu, challenger-as-player
baseline: `white`, challenger: `white_planner`
inspectThresholdMs: 8000

## Conclusion

- 32 games. challenger wins 22, inspected decisions 44, rollout-triggered decisions 44.
- max challenger decision 20862.2ms, avg challenger decision 692.2ms.
- rollout adopted 41/44; avg selected rollout gap 2.4.
- Next implementation target is the repeated rollout-trigger shape, not a broad coefficient change.

## Games

| seed | direction | result | steps | turns | HP | decisions | avg ms | max ms | events | issue |
| ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 994318 | challenger-as-cpu | white_planner | 181 | 17 | P0/C9 | 89 | 546.8 | 3496.5 | 0 | - |
| 994319 | challenger-as-cpu | white_planner | 291 | 29 | P0/C5 | 156 | 646 | 3968.9 | 2 | - |
| 994320 | challenger-as-cpu | white_planner | 195 | 27 | P0/C7 | 101 | 466.6 | 2756.6 | 5 | - |
| 994321 | challenger-as-cpu | white | 189 | 16 | P7/C0 | 83 | 543.9 | 2120.9 | 0 | - |
| 994322 | challenger-as-cpu | white_planner | 191 | 19 | P0/C6 | 93 | 639.5 | 4700.5 | 0 | - |
| 994323 | challenger-as-cpu | white | 262 | 24 | P5/C0 | 128 | 976.7 | 7041.2 | 1 | - |
| 994324 | challenger-as-cpu | white_planner | 249 | 23 | P0/C7 | 131 | 914.8 | 14325.4 | 3 | - |
| 994325 | challenger-as-cpu | white | 163 | 17 | P10/C0 | 69 | 1027.2 | 11229.4 | 3 | - |
| 994326 | challenger-as-cpu | white_planner | 149 | 15 | P0/C5 | 78 | 345 | 1543.2 | 0 | - |
| 994327 | challenger-as-cpu | white_planner | 143 | 14 | P0/C9 | 73 | 454 | 3151 | 0 | - |
| 994328 | challenger-as-cpu | white_planner | 265 | 24 | P0/C5 | 132 | 689.6 | 12150.7 | 2 | - |
| 994329 | challenger-as-cpu | white_planner | 228 | 19 | P0/C8 | 113 | 996.7 | 15004.6 | 2 | - |
| 994330 | challenger-as-cpu | white_planner | 271 | 26 | P0/C9 | 131 | 648.2 | 4197.5 | 0 | - |
| 994331 | challenger-as-cpu | white | 199 | 20 | P2/C0 | 92 | 888.8 | 4371.1 | 0 | - |
| 994332 | challenger-as-cpu | white | 198 | 27 | P8/C0 | 93 | 510.6 | 3128.4 | 0 | - |
| 994333 | challenger-as-cpu | white_planner | 199 | 16 | P0/C8 | 99 | 882.6 | 6151.3 | 1 | - |
| 994318 | challenger-as-player | white | 181 | 16 | P0/C4 | 96 | 429.4 | 2560.7 | 0 | - |
| 994319 | challenger-as-player | white_planner | 178 | 21 | P9/C0 | 93 | 285.9 | 1409.6 | 0 | - |
| 994320 | challenger-as-player | white_planner | 301 | 29 | P1/C0 | 129 | 818.5 | 15777.7 | 3 | - |
| 994321 | challenger-as-player | white_planner | 297 | 31 | P3/C0 | 157 | 948.2 | 13589.5 | 3 | - |
| 994322 | challenger-as-player | white_planner | 244 | 27 | P6/C0 | 124 | 573.9 | 4970 | 0 | - |
| 994323 | challenger-as-player | white_planner | 262 | 24 | P5/C0 | 125 | 724.1 | 9050.5 | 4 | - |
| 994324 | challenger-as-player | white | 184 | 21 | P0/C2 | 83 | 552.9 | 3293.2 | 0 | - |
| 994325 | challenger-as-player | white | 89 | 9 | P0/C3 | 48 | 497.1 | 2168.9 | 0 | - |
| 994326 | challenger-as-player | white_planner | 134 | 14 | P10/C0 | 63 | 357.8 | 1781.5 | 1 | - |
| 994327 | challenger-as-player | white | 146 | 14 | P0/C8 | 71 | 392.1 | 2623.5 | 0 | - |
| 994328 | challenger-as-player | white_planner | 292 | 25 | P5/C0 | 150 | 870.2 | 14867.8 | 3 | - |
| 994329 | challenger-as-player | white_planner | 307 | 28 | P7/C0 | 157 | 1051.1 | 14384.3 | 8 | - |
| 994330 | challenger-as-player | white_planner | 265 | 27 | P8/C0 | 143 | 959.9 | 20862.2 | 2 | - |
| 994331 | challenger-as-player | white_planner | 199 | 20 | P2/C0 | 103 | 592.8 | 2791.7 | 0 | - |
| 994332 | challenger-as-player | white_planner | 165 | 15 | P10/C0 | 81 | 1141.5 | 7483.8 | 1 | - |
| 994333 | challenger-as-player | white | 206 | 17 | P0/C2 | 101 | 777.5 | 5055.9 | 0 | - |

## Events

### seed 994319 / challenger-as-cpu / step 267 / turn 23

- elapsed: 271.5ms / inspection 266.8ms
- state: turn 23 / current cpu / HP cpu/player 8/4 / stones cpu/player 9/7 / deck cpu/player 2/3 / hand cpu/player 6/5
- board: player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_front_left:CF:ドノマンティス Lv1 HP2 act1/1 | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->ドノマンティス
- fallback: attack:ピグミィ:スパイクボール->ドノマンティス (288.3)
- planner selected: attack:ピグミィ:スパイクボール->ドノマンティス (365.8)
- root gap to fallback: 203
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:player-front-right:ドノマンティスLv1HP5(act1/1,focus) | 85.3 | 365.8 | 197 | 188 | 206 | - | 1224 | 0 |
| 2 |  |  |  | end_turn | - | 4.3 | 225.9 | 86.5 | 138 | 35 | - | 926 | -298 |

### seed 994319 / challenger-as-cpu / step 272 / turn 24

- elapsed: 206.7ms / inspection 200.8ms
- state: turn 24 / current cpu / HP cpu/player 8/4 / stones cpu/player 8/10 / deck cpu/player 1/2 / hand cpu/player 6/5
- board: player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ドノマンティス Lv1 HP2 act0/1 | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->ドノマンティス
- fallback: attack:ピグミィ:スパイクボール->ドノマンティス (229.1)
- planner selected: attack:ピグミィ:スパイクボール->ドノマンティス (411.5)
- root gap to fallback: 145.1
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:player-front-right:ドノマンティスLv1HP5(act0/1,focus) | 84 | 411.5 | 243 | 214 | 272 | - | 1288 | 0 |
| 2 |  |  |  | end_turn | - | 26.2 | 283.5 | 127.8 | 196 | 65 | - | 1091 | -197 |

### seed 994320 / challenger-as-cpu / step 168 / turn 20

- elapsed: 85.1ms / inspection 69.3ms
- state: turn 20 / current cpu / HP cpu/player 9/2 / stones cpu/player 20/16 / deck cpu/player 5/6 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:attack->真勇者ダイン
- fallback: attack:ピグミィ:attack->真勇者ダイン (190.9)
- planner selected: attack:ピグミィ:attack->真勇者ダイン (572.2)
- root gap to fallback: 112.9
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:attack->真勇者ダイン | attackTarget:player-front-left:真勇者ダインLv1HP6(act0/1,focus) | 78 | 572.2 | 405 | 116 | 694 | - | 1342 | 0 |
| 2 |  |  |  | end_turn | - | -11.6 | 464.1 | 321.5 | 82 | 561 | - | 1275 | -67 |

### seed 994320 / challenger-as-cpu / step 172 / turn 21

- elapsed: 84.9ms / inspection 68.6ms
- state: turn 21 / current cpu / HP cpu/player 9/2 / stones cpu/player 21/19 / deck cpu/player 4/5 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:attack->真勇者ダイン
- fallback: attack:ピグミィ:attack->真勇者ダイン (190.9)
- planner selected: attack:ピグミィ:attack->真勇者ダイン (295.2)
- root gap to fallback: 112.9
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:attack->真勇者ダイン | attackTarget:player-front-left:真勇者ダインLv1HP6(act0/1,focus) | 78 | 295.2 | 128 | 116 | 140 | - | 1380 | 0 |
| 2 |  |  |  | end_turn | - | -11.6 | 207.1 | 64.5 | 82 | 47 | - | 1313 | -67 |

### seed 994320 / challenger-as-cpu / step 176 / turn 22

- elapsed: 87.9ms / inspection 69.3ms
- state: turn 22 / current cpu / HP cpu/player 9/2 / stones cpu/player 22/22 / deck cpu/player 3/4 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:attack->真勇者ダイン
- fallback: attack:ピグミィ:attack->真勇者ダイン (188.9)
- planner selected: attack:ピグミィ:attack->真勇者ダイン (271.2)
- root gap to fallback: 110.9
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:attack->真勇者ダイン | attackTarget:player-front-left:真勇者ダインLv1HP6(act0/1,focus) | 78 | 271.2 | 104 | 116 | 92 | - | 1370 | 0 |
| 2 |  |  |  | end_turn | - | -11.6 | 209.1 | 66.5 | 82 | 51 | - | 1303 | -67 |

### seed 994320 / challenger-as-cpu / step 180 / turn 23

- elapsed: 84.5ms / inspection 69.4ms
- state: turn 23 / current cpu / HP cpu/player 9/2 / stones cpu/player 23/25 / deck cpu/player 2/3 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:attack->真勇者ダイン
- fallback: attack:ピグミィ:attack->真勇者ダイン (188.9)
- planner selected: attack:ピグミィ:attack->真勇者ダイン (271.2)
- root gap to fallback: 110.9
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:attack->真勇者ダイン | attackTarget:player-front-left:真勇者ダインLv1HP6(act0/1,focus) | 78 | 271.2 | 104 | 116 | 92 | - | 1360 | 0 |
| 2 |  |  |  | end_turn | - | 1 | 216.7 | 66.5 | 82 | 51 | - | 1293 | -67 |

### seed 994320 / challenger-as-cpu / step 184 / turn 24

- elapsed: 78.3ms / inspection 64.9ms
- state: turn 24 / current cpu / HP cpu/player 9/2 / stones cpu/player 24/28 / deck cpu/player 1/2 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:attack->真勇者ダイン
- fallback: attack:ピグミィ:attack->真勇者ダイン (188.9)
- planner selected: attack:ピグミィ:attack->真勇者ダイン (271.2)
- root gap to fallback: 110.9
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:attack->真勇者ダイン | attackTarget:player-front-left:真勇者ダインLv1HP6(act0/1,focus) | 78 | 271.2 | 104 | 116 | 92 | - | 1350 | 0 |
| 2 |  |  |  | end_turn | - | 0 | 216.5 | 66.5 | 82 | 51 | - | 1283 | -67 |

### seed 994323 / challenger-as-cpu / step 231 / turn 20

- elapsed: 7041.2ms / inspection 6227.7ms
- state: turn 20 / current cpu / HP cpu/player 6/6 / stones cpu/player 5/3 / deck cpu/player 5/6 / hand cpu/player 4/3
- board: player_front_left:PF:ポリスピナー Lv2 HP3 act2/2 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 | cpu_back_right:CB:ポリスピナー Lv2 HP3 act0/2
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->ポリスピナー
- fallback: attack:ピグミィ:スパイクボール->ポリスピナー (772)
- planner selected: attack:ピグミィ:スパイクボール->ポリスピナー (409.7)
- root gap to fallback: 357
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ポリスピナー | attackTarget:player-front-left:ポリスピナーLv2HP3(act2/2) | 415 | 409.7 | 371.3 | 430 | 325 | - | -8 | 0 |
| 2 |  |  |  | end_turn | - | 77.7 | -213.3 | -28.2 | 199 | -144 | - | -490 | -482 |

### seed 994324 / challenger-as-cpu / step 217 / turn 20

- elapsed: 14325.4ms / inspection 13930.7ms
- state: turn 20 / current cpu / HP cpu/player 7/5 / stones cpu/player 4/3 / deck cpu/player 5/6 / hand cpu/player 5/4
- board: player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->真勇者ダイン
- fallback: attack:ピグミィ:スパイクボール->真勇者ダイン (479.9)
- planner selected: attack:ピグミィ:スパイクボール->真勇者ダイン (377.1)
- root gap to fallback: 395.4
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:player-front-right:真勇者ダインLv1HP6(act1/1,focus) | 84.5 | 377.1 | 343.6 | 294 | 393.2 | - | 255 | 0 |
| 2 |  |  |  | end_turn | - | -25.5 | 31.8 | 107.3 | 237 | 24 | - | 57 | -198 |

### seed 994324 / challenger-as-cpu / step 235 / turn 21

- elapsed: 11563.4ms / inspection 10741ms
- state: turn 21 / current cpu / HP cpu/player 7/5 / stones cpu/player 4/4 / deck cpu/player 4/5 / hand cpu/player 5/4
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->真勇者ダイン
- fallback: attack:ピグミィ:スパイクボール->真勇者ダイン (-15.7)
- planner selected: attack:ピグミィ:スパイクボール->真勇者ダイン (332.3)
- root gap to fallback: -100.2
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:player-front-right:真勇者ダインLv1HP6(act1/1,focus) | 84.5 | 332.3 | 224.2 | 242.6 | 205.8 | - | 696 | 0 |
| 2 |  |  |  | end_turn | - | -63.2 | -35.5 | 62.7 | 123 | 2.6 | - | 30 | -666 |

### seed 994324 / challenger-as-cpu / step 243 / turn 22

- elapsed: 682.2ms / inspection 672.2ms
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

### seed 994325 / challenger-as-cpu / step 79 / turn 7

- elapsed: 6853.4ms / inspection 6837.8ms
- state: turn 7 / current cpu / HP cpu/player 9/10 / stones cpu/player 2/5 / deck cpu/player 18/19 / hand cpu/player 6/4
- board: player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: true, adopted: true
- decision: focus:デスシープ
- fallback: focus:デスシープ (180.3)
- planner selected: focus:デスシープ (25.4)
- root gap to fallback: -3.5
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:デスシープ | - | 183.8 | 25.4 | 29.8 | 66 | -6.4 | - | -293.4 | 0 |
| 2 |  |  |  | end_turn | - | 16.5 | -58.5 | 32.8 | 62 | 3.6 | - | -342 | -48.6 |
| 3 |  |  |  | attack:デスシープ:attack->ドノマンティス | attackTarget:player-front-right:ドノマンティスLv1HP5(act0/1,focus) | -41.6 | -165.5 | -36.2 | -4 | -68.4 | - | -316.4 | -23 |

### seed 994325 / challenger-as-cpu / step 85 / turn 8

- elapsed: 7426.1ms / inspection 7411.7ms
- state: turn 8 / current cpu / HP cpu/player 9/10 / stones cpu/player 3/7 / deck cpu/player 17/18 / hand cpu/player 6/4
- board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2
- rolloutTriggered: true, adopted: true
- decision: focus:デスシープ
- fallback: focus:デスシープ (393.8)
- planner selected: focus:デスシープ (276.2)
- root gap to fallback: 208.1
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:デスシープ | - | 185.8 | 276.2 | 251.2 | 274.4 | 228 | - | -97.2 | 0 |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->ヤンバル | attackTarget:player-front-left:ヤンバルLv1HP3(act1/1) | 109 | 275.2 | 251.2 | 274.4 | 228 | - | - | - |
| 3 |  |  |  | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:player-front-right:ドノマンティスLv1HP5(act0/1,focus) | 92.9 | 164.9 | 150.9 | 184.4 | 117.4 | - | - | - |
| 4 |  |  |  | summon:ドノマンティス->cpu_front_left | summon:ドノマンティス->front-left; noBacklineReach; sameLaneEnemyFront:ヤンバルLv1HP3(act1/1); after:prepared | 127.2 | 159.5 | 131.5 | 151.6 | 111.4 | - | - | - |

### seed 994325 / challenger-as-cpu / step 106 / turn 9

- elapsed: 11229.4ms / inspection 11254.4ms
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

### seed 994328 / challenger-as-cpu / step 234 / turn 21

- elapsed: 12150.7ms / inspection 11954.7ms
- state: turn 21 / current cpu / HP cpu/player 6/6 / stones cpu/player 6/4 / deck cpu/player 4/5 / hand cpu/player 6/5
- board: player_front_left:PF:デスシープ Lv1 HP3 act1/1 shield | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_back_left:PB:ポリスピナー Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:ドノマンティス Lv1 HP4 act1/1 focus | cpu_front_right:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->真勇者ダイン
- fallback: attack:ピグミィ:スパイクボール->真勇者ダイン (38.6)
- planner selected: attack:ピグミィ:スパイクボール->真勇者ダイン (61.3)
- root gap to fallback: -25.4
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:player-front-right:真勇者ダインLv1HP6(act1/1,focus) | 64 | 61.3 | 62.4 | 112.4 | 12.4 | - | -101 | 0 |
| 2 |  |  |  | end_turn | - | -52.9 | -134.4 | -48.9 | 94.4 | -136.6 | - | -200 | -99 |

### seed 994328 / challenger-as-cpu / step 258 / turn 23

- elapsed: 1270.2ms / inspection 1206.1ms
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

### seed 994329 / challenger-as-cpu / step 64 / turn 6

- elapsed: 15004.6ms / inspection 15042.1ms
- state: turn 6 / current cpu / HP cpu/player 10/10 / stones cpu/player 8/5 / deck cpu/player 19/20 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 focus | player_back_right:PB:ドノマンティス Lv1 HP5 act1/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- rolloutTriggered: true, adopted: true
- decision: focus:ドノマンティス
- fallback: focus:ドノマンティス (340.8)
- planner selected: focus:ドノマンティス (231.5)
- root gap to fallback: 154.6
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ドノマンティス | - | 186.2 | 231.5 | 181.5 | 194 | 169 | - | 69 | 0 |
| 2 |  |  |  | focus:デスシープ | - | 186.2 | 216.6 | 177 | 200 | 154 | - | - | - |
| 3 |  |  |  | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:player-front-left:真勇者ダインLv1HP6(act1/1,focus) | 64 | 180.5 | 187.5 | 206 | 169 | - | - | - |
| 4 |  |  |  | attack:ピグミィ:スパイクボール->ボムゾウ | attackTarget:player-front-right:ボムゾウLv1HP6(act1/1,focus) | 64 | 174.5 | 181.5 | 206 | 157 | - | - | - |

### seed 994329 / challenger-as-cpu / step 112 / turn 9

- elapsed: 6688.6ms / inspection 6697.3ms
- state: turn 9 / current cpu / HP cpu/player 10/10 / stones cpu/player 2/3 / deck cpu/player 16/17 / hand cpu/player 6/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ボムゾウ Lv2 HP5 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2
- rolloutTriggered: true, adopted: true
- decision: focus:デスシープ
- fallback: focus:デスシープ (186.1)
- planner selected: focus:デスシープ (93.2)
- root gap to fallback: -4.8
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:デスシープ | - | 191 | 93.2 | 32.2 | 28 | 36.4 | - | 142.8 | 0 |
| 2 |  |  |  | summon:ドノマンティス->cpu_back_right | summon:ドノマンティス->back-right; noBacklineReach; behindOwnFront:ボムゾウLv2HP5(act1/1); after:prepared | 79.2 | 39.7 | 38.2 | 40 | 36.4 | - | - | - |
| 3 |  |  |  | attack:デスシープ:attack->デスシープ | attackTarget:player-front-left:デスシープLv1HP6(act1/1,focus) | -64 | -112.3 | -30.8 | -26 | -35.6 | - | 133.8 | -9 |
| 4 |  |  |  | end_turn | - | -80.4 | -166.3 | -42.4 | -19.2 | -65.6 | - | -70 | -212.8 |

### seed 994333 / challenger-as-cpu / step 193 / turn 15

- elapsed: 720ms / inspection 629.5ms
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

### seed 994320 / challenger-as-player / step 224 / turn 20

- elapsed: 5271.8ms / inspection 5268ms
- state: turn 20 / current player / HP player/cpu 7/9 / stones player/cpu 5/0 / deck player/cpu 6/6 / hand player/cpu 4/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act1/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 focus | cpu_back_left:CB:ポリスピナー Lv1 HP3 act1/2 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 shield
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->デスシープ
- fallback: attack:ピグミィ:スパイクボール->デスシープ (47.4)
- planner selected: attack:ピグミィ:スパイクボール->デスシープ (113.3)
- root gap to fallback: -22.1
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-right:デスシープLv1HP5(act1/1,focus) | 69.5 | 113.3 | 125.8 | 158 | 93.6 | - | -185.4 | 0 |
| 2 |  |  |  | end_turn | - | -16 | 61 | 131.5 | 165 | 98 | - | -428 | -242.6 |

### seed 994320 / challenger-as-player / step 236 / turn 21

- elapsed: 15777.7ms / inspection 15447.5ms
- state: turn 21 / current player / HP player/cpu 7/9 / stones player/cpu 4/1 / deck player/cpu 5/5 / hand player/cpu 5/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ポリスピナー Lv2 HP3 act0/2 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep
- rolloutTriggered: true, adopted: true
- decision: attack:ポリスピナー:attack->ポリスピナー
- fallback: attack:ポリスピナー:attack->ポリスピナー (122.9)
- planner selected: attack:ポリスピナー:attack->ポリスピナー (224.6)
- root gap to fallback: -39.6
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ポリスピナー:attack->ポリスピナー | attackTarget:cpu-front-right:ポリスピナーLv1HP3(act2/2,shield) | 162.5 | 224.6 | 223.6 | 248.2 | 199 | - | -231.4 | 0 |
| 2 |  |  |  | end_turn | - | -263.2 | -615.8 | -253.3 | -105.6 | -342.6 | - | -1121 | -889.6 |

### seed 994320 / challenger-as-player / step 251 / turn 22

- elapsed: 7679.7ms / inspection 7672.3ms
- state: turn 22 / current player / HP player/cpu 7/8 / stones player/cpu 5/2 / deck player/cpu 4/4 / hand player/cpu 5/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ピグミィ Lv1 HP3 prep
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->真勇者ダイン
- fallback: attack:ピグミィ:スパイクボール->真勇者ダイン (64)
- planner selected: attack:ピグミィ:スパイクボール->真勇者ダイン (44.2)
- root gap to fallback: 0
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:cpu-front-left:真勇者ダインLv1HP6(act1/1,focus) | 64 | 44.2 | 105.4 | 136.4 | 74.4 | - | -361 | 0 |
| 2 |  |  |  | end_turn | - | -85.2 | -237.2 | -70.9 | 81.4 | -161.6 | - | -346 | 15 |

### seed 994321 / challenger-as-player / step 237 / turn 20

- elapsed: 7898.8ms / inspection 7183.8ms
- state: turn 20 / current player / HP player/cpu 8/6 / stones player/cpu 14/1 / deck player/cpu 6/6 / hand player/cpu 6/4
- board: player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_left:PB:ピグミィ Lv2 HP3 act1/2 | player_back_right:PB:ボムゾウ Lv1 HP4 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_back_right:CB:ボムゾウ Lv2 HP5 act1/1
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->真勇者ダイン
- fallback: attack:ピグミィ:スパイクボール->真勇者ダイン (232.8)
- planner selected: attack:ピグミィ:スパイクボール->真勇者ダイン (237.1)
- root gap to fallback: -154.5
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:cpu-front-left:真勇者ダインLv3HP6(act1/1) | 387.2 | 237.1 | 131.1 | 169.2 | 93 | - | 442.6 | 0 |
| 2 |  |  |  | end_turn | - | -37.2 | -159.6 | 42.8 | 144 | -31 | - | -146.4 | -589 |

### seed 994321 / challenger-as-player / step 249 / turn 21

- elapsed: 13589.5ms / inspection 13176.3ms
- state: turn 21 / current player / HP player/cpu 8/6 / stones player/cpu 4/7 / deck player/cpu 5/5 / hand player/cpu 6/4
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | player_back_right:PB:ボムゾウ Lv1 HP4 act0/1 | cpu_front_right:CF:ボムゾウ Lv2 HP5 act1/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 prep
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->ボムゾウ
- fallback: attack:ピグミィ:スパイクボール->ボムゾウ (341.3)
- planner selected: attack:ピグミィ:スパイクボール->ボムゾウ (536.5)
- root gap to fallback: 254.8
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ボムゾウ | attackTarget:cpu-front-right:ボムゾウLv2HP5(act1/1,focus) | 86.5 | 536.5 | 452.2 | 475.4 | 429 | - | 524 | 0 |
| 2 |  |  |  | end_turn | - | 188.9 | 303.1 | 250.2 | 444.4 | 145.4 | - | 89 | -435 |

### seed 994321 / challenger-as-player / step 264 / turn 22

- elapsed: 7778.6ms / inspection 7538ms
- state: turn 22 / current player / HP player/cpu 8/6 / stones player/cpu 5/2 / deck player/cpu 4/4 / hand player/cpu 6/4
- board: player_front_left:PF:ピグミィ Lv2 HP3 act0/2 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1 | player_back_right:PB:ボムゾウ Lv1 HP4 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2
- rolloutTriggered: true, adopted: true
- decision: attack:真勇者ダイン:ダイン斬り->ピグミィ
- fallback: attack:真勇者ダイン:ダイン斬り->ピグミィ (385.8)
- planner selected: attack:真勇者ダイン:ダイン斬り->ピグミィ (494.3)
- root gap to fallback: 255.6
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:真勇者ダイン:ダイン斬り->ピグミィ | attackTarget:cpu-front-right:ピグミィLv1HP3(act2/2,focus) | 130.2 | 494.3 | 352.7 | 321.4 | 384 | - | 753 | 0 |
| 2 |  |  |  | end_turn | - | 63.6 | 278 | 172.5 | 212 | 133 | - | 610 | -143 |

### seed 994323 / challenger-as-player / step 225 / turn 20

- elapsed: 9050.5ms / inspection 7839.7ms
- state: turn 20 / current player / HP player/cpu 6/6 / stones player/cpu 4/1 / deck player/cpu 6/6 / hand player/cpu 3/3
- board: player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 | cpu_front_left:CF:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 prep | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ポリスピナー Lv2 HP3 act2/2 shield
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->ピグミィ
- fallback: attack:ピグミィ:スパイクボール->ピグミィ (374.2)
- planner selected: attack:ピグミィ:スパイクボール->ピグミィ (11.5)
- root gap to fallback: 279.2
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ピグミィ | attackTarget:cpu-front-left:ピグミィLv1HP3(act2/2) | 95 | 11.5 | 47.4 | 80.8 | 14 | - | -378.8 | 0 |
| 2 |  |  |  | end_turn | - | -56.6 | -73 | 33.3 | 51.8 | 14.8 | - | -387 | -8.2 |

### seed 994323 / challenger-as-player / step 239 / turn 21

- elapsed: 1618.6ms / inspection 1567.8ms
- state: turn 21 / current player / HP player/cpu 5/6 / stones player/cpu 9/1 / deck player/cpu 5/5 / hand player/cpu 4/3
- board: player_back_left:PB:ピグミィ Lv2 HP3 act1/2 | cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:デスシープ Lv1 HP6 prep
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->ポリスピナー
- fallback: attack:ピグミィ:スパイクボール->ポリスピナー (684.5)
- planner selected: attack:ピグミィ:スパイクボール->ポリスピナー (301)
- root gap to fallback: 269.5
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ポリスピナー | attackTarget:cpu-front-left:ポリスピナーLv2HP3(act2/2) | 415 | 301 | 265 | 265 | 265 | - | -24 | 0 |
| 2 |  |  |  | end_turn | - | -179.3 | -752.3 | -305.7 | -115.2 | -409.2 | - | -1222 | -1198 |

### seed 994323 / challenger-as-player / step 248 / turn 22

- elapsed: 2125.5ms / inspection 1892.9ms
- state: turn 22 / current player / HP player/cpu 5/5 / stones player/cpu 6/7 / deck player/cpu 4/4 / hand player/cpu 4/4
- board: player_front_left:PF:ポリスピナー Lv2 HP3 act0/2 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_right:CB:デスシープ Lv1 HP6 act0/1 focus
- rolloutTriggered: true, adopted: true
- decision: attack:ポリスピナー:attack->ピグミィ
- fallback: attack:ポリスピナー:attack->ピグミィ (116.7)
- planner selected: attack:ポリスピナー:attack->ピグミィ (487.8)
- root gap to fallback: -64.4
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ポリスピナー:attack->ピグミィ | attackTarget:cpu-front-left:ピグミィLv1HP3(act0/2,focus) | 181.1 | 487.8 | 387.9 | 349.8 | 426 | - | 402 | 0 |
| 2 |  |  |  | end_turn | - | 55.9 | -43.9 | 31.3 | 137 | -44 | - | -431.8 | -833.8 |

### seed 994323 / challenger-as-player / step 257 / turn 23

- elapsed: 101.6ms / inspection 90.9ms
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

- elapsed: 166.3ms / inspection 140.9ms
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

### seed 994328 / challenger-as-player / step 236 / turn 20

- elapsed: 14867.8ms / inspection 14298.2ms
- state: turn 20 / current player / HP player/cpu 5/7 / stones player/cpu 9/0 / deck player/cpu 6/6 / hand player/cpu 5/5
- board: player_front_left:PF:ポリスピナー Lv2 HP1 act0/2 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv2 HP2 act2/2
- rolloutTriggered: true, adopted: true
- decision: attack:ポリスピナー:attack->ドノマンティス
- fallback: attack:ポリスピナー:attack->ドノマンティス (146.2)
- planner selected: attack:ポリスピナー:attack->ドノマンティス (267.8)
- root gap to fallback: -46.8
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ポリスピナー:attack->ドノマンティス | attackTarget:cpu-front-left:ドノマンティスLv1HP5(act1/1) | 193 | 267.8 | 247.4 | 322.4 | 182.4 | - | -128.2 | 0 |
| 2 |  |  |  | end_turn | - | -193 | -481.6 | -163.6 | 1.4 | -258.6 | - | -836 | -707.8 |

### seed 994328 / challenger-as-player / step 254 / turn 21

- elapsed: 8999.9ms / inspection 8161.8ms
- state: turn 21 / current player / HP player/cpu 5/5 / stones player/cpu 8/3 / deck player/cpu 5/5 / hand player/cpu 4/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_left:CF:ヤンバル Lv2 HP3 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP2 act2/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep
- rolloutTriggered: true, adopted: true
- decision: attack:真勇者ダイン:ダイン斬り->ヤンバル
- fallback: attack:真勇者ダイン:ダイン斬り->ヤンバル (434.4)
- planner selected: attack:真勇者ダイン:ダイン斬り->ヤンバル (296)
- root gap to fallback: 281.3
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:真勇者ダイン:ダイン斬り->ヤンバル | attackTarget:cpu-front-left:ヤンバルLv2HP3(act1/1) | 153.2 | 296 | 260.8 | 288.2 | 233.4 | - | 10 | 0 |
| 2 |  |  |  | end_turn | - | 44.3 | -43.5 | 9.8 | 52.2 | -32.6 | - | -324 | -334 |

### seed 994328 / challenger-as-player / step 270 / turn 22

- elapsed: 2395.9ms / inspection 2188.9ms
- state: turn 22 / current player / HP player/cpu 5/5 / stones player/cpu 8/3 / deck player/cpu 4/4 / hand player/cpu 4/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1
- rolloutTriggered: true, adopted: true
- decision: master:master_attack->monster:cpu_front_right
- fallback: master:master_attack->monster:cpu_front_right (335.3)
- planner selected: master:master_attack->monster:cpu_front_right (273.9)
- root gap to fallback: 0
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | master:master_attack->monster:cpu_front_right | - | 335.3 | 273.9 | 171.6 | 145.2 | 198 | - | 418 | 0 |
| 2 |  |  |  | end_turn | - | -28 | -255.7 | -88.5 | 33 | -169 | - | -19 | -437 |

### seed 994329 / challenger-as-player / step 58 / turn 6

- elapsed: 12100.9ms / inspection 12153.3ms
- state: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 5/5 / deck player/cpu 20/20 / hand player/cpu 5/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:ボムゾウ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 focus
- rolloutTriggered: true, adopted: false
- decision: focus:ボムゾウ
- fallback: focus:ボムゾウ (346.1)
- planner selected: focus:真勇者ダイン (234.9)
- root gap to fallback: 169.1
- planner margin to fallback: 6.1

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 |  | Y |  | focus:真勇者ダイン | - | 177 | 234.9 | 196 | 225 | 167 | - | - | - |
| 2 | Y |  | Y | focus:ボムゾウ | - | 186.2 | 228.9 | 196 | 225 | 167 | - | -45 | 0 |
| 3 |  |  |  | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:cpu-front-right:ドノマンティスLv1HP5(act1/1,focus) | 62 | 193.5 | 202 | 237 | 167 | - | - | - |
| 4 |  |  |  | focus:ドノマンティス | - | 44 | 168.6 | 190 | 213 | 167 | - | - | - |

### seed 994329 / challenger-as-player / step 71 / turn 7

- elapsed: 12012ms / inspection 12031.2ms
- state: turn 7 / current player / HP player/cpu 10/10 / stones player/cpu 8/8 / deck player/cpu 19/19 / hand player/cpu 6/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:ボムゾウ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 focus
- rolloutTriggered: true, adopted: true
- decision: focus:真勇者ダイン
- fallback: focus:真勇者ダイン (288.7)
- planner selected: focus:真勇者ダイン (281.6)
- root gap to fallback: 102.5
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:真勇者ダイン | - | 186.2 | 281.6 | 226.8 | 250 | 203.6 | - | 101 | 0 |
| 2 |  |  |  | focus:ボムゾウ | - | 179 | 224.9 | 185.5 | 204 | 167 | - | - | - |
| 3 |  |  |  | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP6(act1/1,focus) | 64 | 219.8 | 226.8 | 250 | 203.6 | - | - | - |
| 4 |  |  |  | attack:ボムゾウ:self_bomb->ドノマンティス | attackTarget:cpu-front-right:ドノマンティスLv1HP5(act1/1,focus) | -43 | 158.8 | 226.8 | 250 | 203.6 | - | 107 | 6 |

### seed 994329 / challenger-as-player / step 85 / turn 8

- elapsed: 10902.4ms / inspection 10882.9ms
- state: turn 8 / current player / HP player/cpu 10/10 / stones player/cpu 12/2 / deck player/cpu 18/18 / hand player/cpu 6/5
- board: player_front_left:PF:ピグミィ Lv2 HP3 act0/2 | player_front_right:PF:ボムゾウ Lv1 HP6 act0/1 | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 focus
- rolloutTriggered: true, adopted: true
- decision: focus:ボムゾウ
- fallback: focus:ボムゾウ (330)
- planner selected: focus:ボムゾウ (291.4)
- root gap to fallback: 153
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ボムゾウ | - | 177 | 291.4 | 264.9 | 254.8 | 275 | - | -83.2 | 0 |
| 2 |  |  |  | summon:ポリスピナー->player_back_left | summon:ポリスピナー->back-left; noBacklineReach; behindOwnFront:ピグミィLv2HP3(act0/2); sameLaneEnemyFront:デスシープLv1HP6(act1/1,focus); after:prepared | 80 | 247.9 | 238.8 | 240 | 237.6 | - | - | - |
| 3 |  |  |  | move:player_back_right->player_front_left | move:player-back-right->player-front-left; mover:ドノマンティスLv1HP5(act0/1,focus) | 125.3 | 188.8 | 161.2 | 146.8 | 175.6 | - | - | - |
| 4 |  |  |  | attack:ボムゾウ:self_bomb->ドノマンティス | attackTarget:cpu-front-right:ドノマンティスLv1HP5(act1/1,focus) | -45 | 121 | 192.9 | 184.8 | 201 | - | 59.8 | 143 |

### seed 994329 / challenger-as-player / step 97 / turn 9

- elapsed: 14384.3ms / inspection 14368.7ms
- state: turn 9 / current player / HP player/cpu 9/10 / stones player/cpu 15/5 / deck player/cpu 17/17 / hand player/cpu 6/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ボムゾウ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP2 act0/2 | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 focus
- rolloutTriggered: true, adopted: false
- decision: focus:ボムゾウ
- fallback: focus:ボムゾウ (347.9)
- planner selected: focus:デスシープ (265.7)
- root gap to fallback: 170.9
- planner margin to fallback: 21.1

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 |  | Y |  | focus:デスシープ | - | 177 | 265.7 | 226.8 | 250 | 203.6 | - | - | - |
| 2 | Y |  | Y | focus:ボムゾウ | - | 186.2 | 244.6 | 193 | 222 | 164 | - | 80 | 0 |
| 3 |  |  |  | focus:ピグミィ | - | 44 | 211.4 | 232.8 | 262 | 203.6 | - | - | - |
| 4 |  |  |  | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:cpu-front-right:ドノマンティスLv1HP5(act1/1,focus) | 84.5 | 206.7 | 199 | 234 | 164 | - | - | - |

### seed 994329 / challenger-as-player / step 250 / turn 20

- elapsed: 1669.9ms / inspection 1671ms
- state: turn 20 / current player / HP player/cpu 9/9 / stones player/cpu 9/0 / deck player/cpu 6/6 / hand player/cpu 4/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:ボムゾウ Lv2 HP2 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1
- rolloutTriggered: true, adopted: true
- decision: attack:ピグミィ:スパイクボール->ヤンバル
- fallback: attack:ピグミィ:スパイクボール->ヤンバル (750.6)
- planner selected: attack:ピグミィ:スパイクボール->ヤンバル (480.4)
- root gap to fallback: 322.1
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ヤンバル | attackTarget:cpu-front-right:ヤンバルLv2HP3(act1/1) | 428.5 | 480.4 | 363.8 | 359.4 | 368.2 | - | 513.2 | 0 |
| 2 |  |  |  | end_turn | - | 21.3 | 27.7 | 144.6 | 181 | 108.2 | - | 280.2 | -233 |

### seed 994329 / challenger-as-player / step 271 / turn 22

- elapsed: 2930.2ms / inspection 2937.1ms
- state: turn 22 / current player / HP player/cpu 9/8 / stones player/cpu 10/1 / deck player/cpu 4/4 / hand player/cpu 4/4
- board: player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 prep
- rolloutTriggered: true, adopted: true
- decision: attack:ヤンバル:wild_claw->真勇者ダイン
- fallback: attack:ヤンバル:wild_claw->真勇者ダイン (-16.4)
- planner selected: attack:ヤンバル:wild_claw->真勇者ダイン (330.4)
- root gap to fallback: -46.2
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ヤンバル:wild_claw->真勇者ダイン | attackTarget:cpu-front-left:真勇者ダインLv1HP6(act1/1) | 29.8 | 330.4 | 231.2 | 254.4 | 208 | - | 617.6 | 0 |
| 2 |  |  |  | end_turn | - | -40.9 | 166.7 | 99.4 | 111.8 | 87 | - | 508.6 | -109 |

### seed 994329 / challenger-as-player / step 283 / turn 23

- elapsed: 639.9ms / inspection 637.9ms
- state: turn 23 / current player / HP player/cpu 9/8 / stones player/cpu 8/4 / deck player/cpu 3/3 / hand player/cpu 5/4
- board: player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 prep
- rolloutTriggered: true, adopted: true
- decision: attack:ヤンバル:wild_claw->デスシープ
- fallback: attack:ヤンバル:wild_claw->デスシープ (104.3)
- planner selected: attack:ヤンバル:wild_claw->デスシープ (347.6)
- root gap to fallback: 0
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ヤンバル:wild_claw->デスシープ | attackTarget:cpu-front-right:デスシープLv1HP6(act1/1) | 104.3 | 347.6 | 217.9 | 201.4 | 234.4 | - | 712 | 0 |
| 2 |  |  |  | end_turn | - | -44.6 | 132.3 | 108.9 | 145.4 | 72.4 | - | 451 | -261 |

### seed 994329 / challenger-as-player / step 297 / turn 26

- elapsed: 340.3ms / inspection 325.3ms
- state: turn 26 / current player / HP player/cpu 9/5 / stones player/cpu 11/13 / deck player/cpu 0/0 / hand player/cpu 6/5
- board: player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:ドノマンティス Lv1 HP4 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus
- rolloutTriggered: true, adopted: true
- decision: attack:ヤンバル:wild_claw->ピグミィ
- fallback: attack:ヤンバル:wild_claw->ピグミィ (112.5)
- planner selected: attack:ヤンバル:wild_claw->ピグミィ (424.7)
- root gap to fallback: -183
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ヤンバル:wild_claw->ピグミィ | attackTarget:cpu-front-right:ピグミィLv1HP3(act0/2,focus) | 295.5 | 424.7 | 235.1 | 292 | 178.2 | - | 1594 | 0 |
| 2 |  |  |  | end_turn | - | 91 | 357.8 | 250 | 283 | 217 | - | 1460 | -134 |

### seed 994330 / challenger-as-player / step 78 / turn 8

- elapsed: 20862.2ms / inspection 20802.7ms
- state: turn 8 / current player / HP player/cpu 10/10 / stones player/cpu 6/4 / deck player/cpu 18/18 / hand player/cpu 6/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv2 HP5 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | player_back_right:PB:ボムゾウ Lv1 HP1 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 prep | cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus
- rolloutTriggered: true, adopted: true
- decision: focus:ドノマンティス
- fallback: focus:ドノマンティス (339.2)
- planner selected: focus:ドノマンティス (253.2)
- root gap to fallback: 153
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ドノマンティス | - | 186.2 | 253.2 | 208.9 | 236.4 | 181.4 | - | 31 | 0 |
| 2 |  |  |  | focus:デスシープ | - | 186.2 | 248.5 | 208.9 | 236.4 | 181.4 | - | - | - |
| 3 |  |  |  | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:cpu-front-left:真勇者ダインLv1HP6(act0/1,focus) | 86.5 | 224.1 | 214.9 | 248.4 | 181.4 | - | - | - |
| 4 |  |  |  | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-right:デスシープLv1HP6(act0/1,focus) | 86.5 | 224.1 | 214.9 | 248.4 | 181.4 | - | - | - |

### seed 994330 / challenger-as-player / step 242 / turn 21

- elapsed: 1085.2ms / inspection 1055.8ms
- state: turn 21 / current player / HP player/cpu 9/5 / stones player/cpu 6/1 / deck player/cpu 5/5 / hand player/cpu 4/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:ボムゾウ Lv1 HP4 act1/1 | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 focus
- rolloutTriggered: true, adopted: true
- decision: attack:ヤンバル:wild_claw->ヤンバル
- fallback: attack:ヤンバル:wild_claw->ヤンバル (112)
- planner selected: attack:ヤンバル:wild_claw->ヤンバル (805.6)
- root gap to fallback: -119.9
- planner margin to fallback: 0
- selected rollout gap to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ヤンバル:wild_claw->ヤンバル | attackTarget:cpu-front-left:ヤンバルLv1HP3(act0/1,focus) | 231.9 | 805.6 | 616 | 595 | 637 | - | 1270 | 0 |
| 2 |  |  |  | end_turn | - | 396.4 | 695 | 505.4 | 503 | 507.8 | - | 1133.6 | -136.4 |

### seed 994332 / challenger-as-player / step 161 / turn 14

- elapsed: 59.5ms / inspection 54.9ms
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


