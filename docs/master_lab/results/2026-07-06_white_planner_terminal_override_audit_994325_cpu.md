# White Rollout Trigger Audit

生成: 2026-07-06T13:09:32.449Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994325-994325
directions: challenger-as-cpu
baseline: `white`, challenger: `white_planner`
inspectThresholdMs: 999999
inspectTurnPlanDecisions: true

## Conclusion

- 1 games. challenger wins 0, inspected decisions 44, rollout-triggered decisions 0.
- max challenger decision 10972.3ms, avg challenger decision 831.2ms.
- No rollout-triggered decision was captured. Lower --inspect-threshold-ms or expand seeds before tuning.

## Games

| seed | direction | result | steps | turns | HP | decisions | avg ms | max ms | events | issue |
| ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 994325 | challenger-as-cpu | white | 163 | 17 | P10/C0 | 69 | 831.2 | 10972.3 | 44 | - |

## Events

### seed 994325 / challenger-as-cpu / step 4 / turn 1

- elapsed: 562.8ms / inspection 526.5ms
- state: turn 1 / current cpu / HP cpu/player 10/10 / stones cpu/player 3/0 / deck cpu/player 24/25 / hand cpu/player 6/2
- board: player_front_left:PF:ボムゾウ Lv1 HP6 prep | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_left:PB:ヤンバル Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: summon:真勇者ダイン->cpu_back_left
- fallback: summon:真勇者ダイン->cpu_back_left (198.5)
- planner selected: summon:真勇者ダイン->cpu_back_left (73.8)
- root gap to fallback: 105.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:真勇者ダイン->cpu_back_left | summon:真勇者ダイン->back-left; noBacklineReach; sameLaneEnemyFront:ボムゾウLv1HP6(prep); after:prepared | 92.8 | 73.8 | 53.4 | 32 | 74.8 | - | - | - |
| 2 |  |  |  | summon:真勇者ダイン->cpu_back_right | summon:真勇者ダイン->back-right; noBacklineReach; sameLaneEnemyFront:ポリスピナーLv1HP3(prep); after:prepared | 92.8 | 73.8 | 53.4 | 32 | 74.8 | - | - | - |
| 3 |  |  |  | summon:ボムゾウ->cpu_back_left | summon:ボムゾウ->back-left; backlineReach; sameLaneEnemyFront:ボムゾウLv1HP6(prep); after:prepared | 87.8 | 72.7 | 53.4 | 32 | 74.8 | - | - | - |
| 4 |  |  |  | summon:ボムゾウ->cpu_back_right | summon:ボムゾウ->back-right; backlineReach; sameLaneEnemyFront:ポリスピナーLv1HP3(prep); after:prepared | 87.8 | 72.7 | 53.4 | 32 | 74.8 | - | - | - |
| 5 |  |  |  | end_turn | - | -165.8 | -349.8 | -224 | -170.8 | -277.2 | - | - | - |

### seed 994325 / challenger-as-cpu / step 5 / turn 1

- elapsed: 194.2ms / inspection 198.8ms
- state: turn 1 / current cpu / HP cpu/player 10/10 / stones cpu/player 2/0 / deck cpu/player 24/25 / hand cpu/player 5/2
- board: player_front_left:PF:ボムゾウ Lv1 HP6 prep | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_left:PB:ヤンバル Lv1 HP3 prep | cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep
- rolloutTriggered: false, adopted: true
- decision: summon:ボムゾウ->cpu_front_left
- fallback: summon:ボムゾウ->cpu_front_left (183)
- planner selected: summon:ボムゾウ->cpu_front_left (22.2)
- root gap to fallback: 53.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ボムゾウ->cpu_front_left | summon:ボムゾウ->front-left; backlineReach; sameLaneEnemyFront:ボムゾウLv1HP6(prep); after:prepared | 129.8 | 22.2 | -6.4 | -27.8 | 15 | - | - | - |
| 2 |  |  |  | summon:ボムゾウ->cpu_front_right | summon:ボムゾウ->front-right; backlineReach; sameLaneEnemyFront:ポリスピナーLv1HP3(prep); after:prepared | 129.8 | 22.2 | -6.4 | -27.8 | 15 | - | - | - |
| 3 |  |  |  | summon:ドノマンティス->cpu_front_left | summon:ドノマンティス->front-left; noBacklineReach; sameLaneEnemyFront:ボムゾウLv1HP6(prep); after:prepared | 127.2 | 21.6 | -6.4 | -27.8 | 15 | - | - | - |
| 4 |  |  |  | summon:ドノマンティス->cpu_front_right | summon:ドノマンティス->front-right; noBacklineReach; sameLaneEnemyFront:ポリスピナーLv1HP3(prep); after:prepared | 127.2 | 21.6 | -6.4 | -27.8 | 15 | - | - | - |
| 5 |  |  |  | end_turn | - | -167.8 | -334.1 | -188.4 | -167.8 | -209 | - | - | - |

### seed 994325 / challenger-as-cpu / step 6 / turn 1

- elapsed: 133.1ms / inspection 128ms
- state: turn 1 / current cpu / HP cpu/player 10/10 / stones cpu/player 1/0 / deck cpu/player 24/25 / hand cpu/player 4/2
- board: player_front_left:PF:ボムゾウ Lv1 HP6 prep | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_left:PB:ヤンバル Lv1 HP3 prep | cpu_front_left:CF:ボムゾウ Lv1 HP6 prep | cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep
- rolloutTriggered: false, adopted: true
- decision: summon:ドノマンティス->cpu_front_right
- fallback: summon:ドノマンティス->cpu_front_right (-34.2)
- planner selected: summon:ドノマンティス->cpu_front_right (-51.3)
- root gap to fallback: -156.4
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ドノマンティス->cpu_front_right | summon:ドノマンティス->front-right; noBacklineReach; sameLaneEnemyFront:ポリスピナーLv1HP3(prep); after:prepared | 122.2 | -51.3 | -78.2 | -99.6 | -56.8 | - | - | - |
| 2 |  |  |  | summon:ポリスピナー->cpu_front_right | summon:ポリスピナー->front-right; noBacklineReach; sameLaneEnemyFront:ポリスピナーLv1HP3(prep); after:prepared | 117 | -62.1 | -87.8 | -106.8 | -68.8 | - | - | - |
| 3 |  |  |  | summon:ドノマンティス->cpu_back_right | summon:ドノマンティス->back-right; noBacklineReach; sameLaneEnemyFront:ポリスピナーLv1HP3(prep); after:prepared | 80.2 | -66.6 | -84.2 | -111.6 | -56.8 | - | - | - |
| 4 |  |  |  | summon:ポリスピナー->cpu_back_right | summon:ポリスピナー->back-right; noBacklineReach; sameLaneEnemyFront:ポリスピナーLv1HP3(prep); after:prepared | 75 | -77.3 | -93.8 | -118.8 | -68.8 | - | - | - |
| 5 |  |  |  | end_turn | - | -167.8 | -313.7 | -171.8 | -167.8 | -175.8 | - | - | - |

### seed 994325 / challenger-as-cpu / step 7 / turn 1

- elapsed: 28.9ms / inspection 29.2ms
- state: turn 1 / current cpu / HP cpu/player 10/10 / stones cpu/player 0/0 / deck cpu/player 24/25 / hand cpu/player 3/2
- board: player_front_left:PF:ボムゾウ Lv1 HP6 prep | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_left:PB:ヤンバル Lv1 HP3 prep | cpu_front_left:CF:ボムゾウ Lv1 HP6 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 prep | cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-429.8)
- planner selected: end_turn (-227.2)
- root gap to fallback: -262
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -167.8 | -227.2 | -146.4 | -167.8 | -125 | - | - | - |

### seed 994325 / challenger-as-cpu / step 16 / turn 2

- elapsed: 837.7ms / inspection 841.5ms
- state: turn 2 / current cpu / HP cpu/player 9/10 / stones cpu/player 4/0 / deck cpu/player 23/24 / hand cpu/player 4/2
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus,shield | player_front_right:PF:ポリスピナー Lv1 HP2 act2/2 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1
- rolloutTriggered: false, adopted: true
- decision: attack:ドノマンティス:attack->ポリスピナー
- fallback: attack:ドノマンティス:attack->ポリスピナー (694.5)
- planner selected: attack:ドノマンティス:attack->ポリスピナー (239.6)
- root gap to fallback: 131.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ドノマンティス:attack->ポリスピナー | attackTarget:player-front-right:ポリスピナーLv1HP2(act2/2); targetAfter:empty; attackerAfter:ドノマンティスLv2HP5(act1/1) | 563.3 | 239.6 | 200 | 206.4 | 193.6 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:player_front_right | - | 359.3 | 211.6 | 234 | 239.4 | 228.6 | - | - | - |
| 3 |  |  |  | summon:ポリスピナー->cpu_back_right | summon:ポリスピナー->back-right; noBacklineReach; behindOwnFront:ドノマンティスLv1HP5(act0/1); sameLaneEnemyFront:ポリスピナーLv1HP2(act2/2); after:prepared | 75 | 46.3 | 234 | 239.4 | 228.6 | - | - | - |
| 4 |  |  |  | focus:真勇者ダイン | - | 44 | 18 | 228 | 227.4 | 228.6 | - | - | - |
| 5 |  |  |  | focus:ドノマンティス | - | 12.2 | -4.9 | 228 | 227.4 | 228.6 | - | - | - |
| 6 |  |  |  | end_turn | - | -69.6 | -251.4 | 40.4 | 63.4 | 17.4 | - | - | - |

### seed 994325 / challenger-as-cpu / step 17 / turn 2

- elapsed: 469.3ms / inspection 468ms
- state: turn 2 / current cpu / HP cpu/player 9/10 / stones cpu/player 3/1 / deck cpu/player 23/24 / hand cpu/player 4/2
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus,shield | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 | cpu_front_right:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1
- rolloutTriggered: false, adopted: true
- decision: summon:ポリスピナー->cpu_back_right
- fallback: summon:ポリスピナー->cpu_back_right (101)
- planner selected: summon:ポリスピナー->cpu_back_right (88.3)
- root gap to fallback: 26
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ポリスピナー->cpu_back_right | summon:ポリスピナー->back-right; noBacklineReach; behindOwnFront:ドノマンティスLv2HP5(act1/1); after:prepared | 75 | 88.3 | 71.8 | 71.2 | 72.4 | - | - | - |
| 2 |  |  |  | focus:真勇者ダイン | - | 44 | 78.5 | 68.8 | 75.2 | 62.4 | - | - | - |
| 3 |  |  |  | end_turn | - | -52.2 | -31.3 | 3.8 | 22.2 | -14.6 | - | - | - |

### seed 994325 / challenger-as-cpu / step 18 / turn 2

- elapsed: 360.5ms / inspection 361.5ms
- state: turn 2 / current cpu / HP cpu/player 9/10 / stones cpu/player 2/1 / deck cpu/player 23/24 / hand cpu/player 3/2
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus,shield | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 | cpu_front_right:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: focus:真勇者ダイン
- fallback: focus:真勇者ダイン (-38)
- planner selected: focus:真勇者ダイン (29.5)
- root gap to fallback: -82
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:真勇者ダイン | - | 44 | 29.5 | 19.8 | 26.2 | 13.4 | - | - | - |
| 2 |  |  |  | end_turn | - | -52.2 | 3.2 | 22.8 | 22.2 | 23.4 | - | - | - |

### seed 994325 / challenger-as-cpu / step 28 / turn 3

- elapsed: 1044.7ms / inspection 1041ms
- state: turn 3 / current cpu / HP cpu/player 9/10 / stones cpu/player 7/0 / deck cpu/player 22/23 / hand cpu/player 4/2
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus
- rolloutTriggered: false, adopted: true
- decision: focus:ポリスピナー
- fallback: focus:ポリスピナー (269.8)
- planner selected: focus:ポリスピナー (158.6)
- root gap to fallback: 19.4
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ポリスピナー | - | 250.5 | 158.6 | 119 | 163 | 75 | - | - | - |
| 2 |  |  |  | focus:ボムゾウ | - | 234 | 152.6 | 113 | 151 | 75 | - | - | - |
| 3 |  |  |  | end_turn | - | -12.5 | 24.7 | 119 | 163 | 75 | - | - | - |
| 4 |  |  |  | attack:ボムゾウ:storm_bomb->ヤンバル | attackTarget:player-back-left:ヤンバルLv1HP3(act1/1); targetAfter:ヤンバルLv1HP2(act1/1); attackerAfter:ボムゾウLv1HP6(act1/1) | 19 | -30.6 | 41 | 79 | 3 | - | - | - |
| 5 |  |  |  | attack:ボムゾウ:storm_bomb->ピグミィ | attackTarget:player-back-right:ピグミィLv1HP3(act2/2); targetAfter:ピグミィLv1HP2(act2/2); attackerAfter:ボムゾウLv1HP6(act1/1) | 19 | -30.6 | 41 | 79 | 3 | - | - | - |
| 6 |  |  |  | attack:ボムゾウ:self_bomb->ボムゾウ | attackTarget:player-front-left:ボムゾウLv1HP6(act0/1,focus); targetAfter:ボムゾウLv1HP5(act0/1); attackerAfter:ボムゾウLv1HP4(act1/1) | -52.6 | -85.1 | 38 | 85 | -9 | - | - | - |

### seed 994325 / challenger-as-cpu / step 32 / turn 3

- elapsed: 348.2ms / inspection 345.6ms
- state: turn 3 / current cpu / HP cpu/player 9/10 / stones cpu/player 1/0 / deck cpu/player 22/23 / hand cpu/player 4/2
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv2 HP2 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus
- rolloutTriggered: false, adopted: true
- decision: attack:ポリスピナー:attack->デスシープ
- fallback: attack:ポリスピナー:attack->デスシープ (607.2)
- planner selected: attack:ポリスピナー:attack->デスシープ (267.2)
- root gap to fallback: 13
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ポリスピナー:attack->デスシープ | attackTarget:player-front-right:デスシープLv2HP2(act1/1); targetAfter:empty; attackerAfter:ポリスピナーLv2HP3(act2/2) | 594.2 | 267.2 | 227.6 | 255 | 200.2 | - | - | - |
| 2 |  |  |  | end_turn | - | -51.6 | -205.2 | 89 | 127 | 51 | - | - | - |

### seed 994325 / challenger-as-cpu / step 33 / turn 3

- elapsed: 110.6ms / inspection 111.9ms
- state: turn 3 / current cpu / HP cpu/player 9/10 / stones cpu/player 0/2 / deck cpu/player 22/23 / hand cpu/player 4/2
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-180.9)
- planner selected: end_turn (62.1)
- root gap to fallback: -155.9
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -25 | 62.1 | 67.6 | 95 | 40.2 | - | - | - |

### seed 994325 / challenger-as-cpu / step 42 / turn 4

- elapsed: 2210.7ms / inspection 2207.1ms
- state: turn 4 / current cpu / HP cpu/player 9/10 / stones cpu/player 5/1 / deck cpu/player 21/22 / hand cpu/player 5/2
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 shield | player_front_right:PF:真勇者ダイン Lv1 HP6 prep | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus
- rolloutTriggered: false, adopted: true
- decision: focus:ボムゾウ
- fallback: focus:ボムゾウ (238.5)
- planner selected: focus:ボムゾウ (101.2)
- root gap to fallback: 45.3
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ボムゾウ | - | 193.2 | 101.2 | 61.6 | 94.4 | 28.8 | - | - | - |
| 2 |  |  |  | summon:ピグミィ->cpu_front_right | summon:ピグミィ->front-right; backlineReach; sameLaneEnemyFront:真勇者ダインLv1HP6(prep); after:prepared | 48.6 | 43 | 64.6 | 90.4 | 38.8 | - | - | - |
| 3 |  |  |  | move:cpu_back_left->cpu_front_right | move:cpu-back-left->cpu-front-right; mover:真勇者ダインLv1HP6(act0/1,focus) | 40 | 3.2 | 31 | 43.2 | 18.8 | - | - | - |
| 4 |  |  |  | attack:ボムゾウ:storm_bomb->ヤンバル | attackTarget:player-back-left:ヤンバルLv1HP3(act1/1); targetAfter:ヤンバルLv1HP2(act1/1); attackerAfter:ボムゾウLv1HP6(act1/1) | 17 | -54.8 | -10.4 | 22.4 | -43.2 | - | - | - |
| 5 |  |  |  | end_turn | - | -84.1 | -117.4 | -0.2 | 43.8 | -44.2 | - | - | - |

### seed 994325 / challenger-as-cpu / step 44 / turn 4

- elapsed: 796.5ms / inspection 794.1ms
- state: turn 4 / current cpu / HP cpu/player 9/10 / stones cpu/player 5/1 / deck cpu/player 21/22 / hand cpu/player 5/2
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 shield | player_front_right:PF:真勇者ダイン Lv1 HP6 prep | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1
- rolloutTriggered: false, adopted: true
- decision: summon:ピグミィ->cpu_back_left
- fallback: summon:ピグミィ->cpu_back_left (102.2)
- planner selected: summon:ピグミィ->cpu_back_left (63.1)
- root gap to fallback: -39.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ピグミィ->cpu_back_left | summon:ピグミィ->back-left; backlineReach; behindOwnFront:ボムゾウLv1HP6(act1/1,focus); sameLaneEnemyFront:ボムゾウLv2HP5(act1/1,shield); after:prepared | 141.4 | 63.1 | 32 | 51.2 | 12.8 | - | - | - |
| 2 |  |  |  | summon:ピグミィ->cpu_back_right | summon:ピグミィ->back-right; backlineReach; behindOwnFront:真勇者ダインLv1HP6(act1/1); sameLaneEnemyFront:真勇者ダインLv1HP6(prep); after:prepared | 141.4 | 63.1 | 32 | 51.2 | 12.8 | - | - | - |
| 3 |  |  |  | end_turn | - | -108.6 | -175.1 | -66.2 | -34.2 | -98.2 | - | - | - |

### seed 994325 / challenger-as-cpu / step 46 / turn 4

- elapsed: 162.2ms / inspection 162.8ms
- state: turn 4 / current cpu / HP cpu/player 9/10 / stones cpu/player 2/1 / deck cpu/player 21/22 / hand cpu/player 4/2
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 shield | player_front_right:PF:真勇者ダイン Lv1 HP6 prep | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 focus,shield | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-303.1)
- planner selected: end_turn (-77.6)
- root gap to fallback: -194.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -108.6 | -77.6 | -39.4 | -20.2 | -58.6 | - | - | - |

### seed 994325 / challenger-as-cpu / step 55 / turn 5

- elapsed: 955ms / inspection 939.6ms
- state: turn 5 / current cpu / HP cpu/player 9/10 / stones cpu/player 3/1 / deck cpu/player 20/21 / hand cpu/player 5/3
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 shield | player_front_right:PF:真勇者ダイン Lv2 HP4 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->真勇者ダイン
- fallback: attack:ピグミィ:スパイクボール->真勇者ダイン (334)
- planner selected: attack:ピグミィ:スパイクボール->真勇者ダイン (309.4)
- root gap to fallback: -13.3
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:player-front-right:真勇者ダインLv2HP4(act1/1); targetAfter:真勇者ダインLv2HP3(act1/1); attackerAfter:ピグミィLv1HP3(act1/2) | 347.3 | 309.4 | 269.8 | 302 | 237.6 | - | - | - |
| 2 |  |  |  | summon:デスシープ->cpu_front_right | summon:デスシープ->front-right; noBacklineReach; sameLaneEnemyFront:真勇者ダインLv2HP4(act1/1); after:prepared | 131.8 | 231 | 269.8 | 302 | 237.6 | - | - | - |
| 3 |  |  |  | attack:ボムゾウ:storm_bomb->真勇者ダイン | attackTarget:player-front-right:真勇者ダインLv2HP4(act1/1); targetAfter:真勇者ダインLv2HP3(act1/1); attackerAfter:ボムゾウLv1HP6(act1/1) | 68.5 | 175.5 | 259.8 | 292 | 227.6 | - | - | - |
| 4 |  |  |  | end_turn | - | -37.4 | -117.6 | 43 | 87 | -1 | - | - | - |

### seed 994325 / challenger-as-cpu / step 56 / turn 5

- elapsed: 699.3ms / inspection 700.5ms
- state: turn 5 / current cpu / HP cpu/player 9/10 / stones cpu/player 3/1 / deck cpu/player 20/21 / hand cpu/player 5/3
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 shield | player_front_right:PF:真勇者ダイン Lv2 HP3 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->真勇者ダイン
- fallback: attack:ピグミィ:スパイクボール->真勇者ダイン (358.8)
- planner selected: attack:ピグミィ:スパイクボール->真勇者ダイン (303.4)
- root gap to fallback: -58.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:player-front-right:真勇者ダインLv2HP3(act1/1); targetAfter:真勇者ダインLv2HP2(act1/1); attackerAfter:ピグミィLv1HP3(act2/2) | 417 | 303.4 | 263.8 | 296 | 231.6 | - | - | - |
| 2 |  |  |  | summon:デスシープ->cpu_front_right | summon:デスシープ->front-right; noBacklineReach; sameLaneEnemyFront:真勇者ダインLv2HP3(act1/1); after:prepared | 131.8 | 190.2 | 263.8 | 296 | 231.6 | - | - | - |
| 3 |  |  |  | attack:ボムゾウ:storm_bomb->真勇者ダイン | attackTarget:player-front-right:真勇者ダインLv2HP3(act1/1); targetAfter:真勇者ダインLv2HP2(act1/1); attackerAfter:ボムゾウLv1HP6(act1/1) | 68.5 | 128.6 | 247.8 | 274 | 221.6 | - | - | - |
| 4 |  |  |  | master:master_attack->monster:player_front_right | - | 25.2 | -10.5 | 139.8 | 178 | 101.6 | - | - | - |
| 5 |  |  |  | end_turn | - | -37.4 | -152.4 | 43 | 87 | -1 | - | - | - |

### seed 994325 / challenger-as-cpu / step 58 / turn 5

- elapsed: 672.3ms / inspection 674.4ms
- state: turn 5 / current cpu / HP cpu/player 9/10 / stones cpu/player 2/1 / deck cpu/player 20/21 / hand cpu/player 4/3
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 shield | player_front_right:PF:真勇者ダイン Lv2 HP2 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 prep | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: master:wake_up->monster:cpu_front_right
- fallback: master:wake_up->monster:cpu_front_right (677.7)
- planner selected: master:wake_up->monster:cpu_front_right (237.6)
- root gap to fallback: 293
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | master:wake_up->monster:cpu_front_right | - | 384.7 | 237.6 | 198 | 230.2 | 165.8 | - | - | - |
| 2 |  |  |  | attack:ボムゾウ:storm_bomb->真勇者ダイン | attackTarget:player-front-right:真勇者ダインLv2HP2(act1/1); targetAfter:真勇者ダインLv2HP1(act1/1); attackerAfter:ボムゾウLv1HP6(act1/1) | 101.4 | 34.6 | 114 | 140.2 | 87.8 | - | - | - |
| 3 |  |  |  | end_turn | - | -55.4 | -184.6 | 7.6 | 19 | -3.8 | - | - | - |

### seed 994325 / challenger-as-cpu / step 59 / turn 5

- elapsed: 510.4ms / inspection 513.7ms
- state: turn 5 / current cpu / HP cpu/player 9/10 / stones cpu/player 0/1 / deck cpu/player 20/21 / hand cpu/player 4/3
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 shield | player_front_right:PF:真勇者ダイン Lv2 HP2 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: attack:デスシープ:attack->真勇者ダイン
- fallback: attack:デスシープ:attack->真勇者ダイン (622.7)
- planner selected: attack:デスシープ:attack->真勇者ダイン (194.4)
- root gap to fallback: -3.6
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:デスシープ:attack->真勇者ダイン | attackTarget:player-front-right:真勇者ダインLv2HP2(act1/1); targetAfter:empty; attackerAfter:デスシープLv1HP6(act1/1) | 626.3 | 194.4 | 154.8 | 187 | 122.6 | - | - | - |
| 2 |  |  |  | attack:ボムゾウ:storm_bomb->真勇者ダイン | attackTarget:player-front-right:真勇者ダインLv2HP2(act1/1); targetAfter:真勇者ダインLv2HP1(act1/1); attackerAfter:ボムゾウLv1HP6(act1/1) | 72.5 | -150.1 | 70.8 | 97 | 44.6 | - | - | - |
| 3 |  |  |  | end_turn | - | -32.4 | -237.5 | 59 | 97 | 21 | - | - | - |

### seed 994325 / challenger-as-cpu / step 60 / turn 5

- elapsed: 224.6ms / inspection 224.7ms
- state: turn 5 / current cpu / HP cpu/player 9/10 / stones cpu/player 0/3 / deck cpu/player 20/21 / hand cpu/player 4/3
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 shield | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-142.2)
- planner selected: end_turn (9.7)
- root gap to fallback: -118.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -23.4 | 9.7 | 14.8 | 47 | -17.4 | - | - | - |

### seed 994325 / challenger-as-cpu / step 69 / turn 6

- elapsed: 1936.6ms / inspection 1920.8ms
- state: turn 6 / current cpu / HP cpu/player 9/10 / stones cpu/player 4/0 / deck cpu/player 19/20 / hand cpu/player 5/3
- board: player_front_left:PF:ボムゾウ Lv2 HP2 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 prep | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1
- rolloutTriggered: false, adopted: true
- decision: move:cpu_front_left->cpu_back_right
- fallback: move:cpu_front_left->cpu_back_right (106)
- planner selected: move:cpu_front_left->cpu_back_right (49.3)
- root gap to fallback: -16
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | move:cpu_front_left->cpu_back_right | move:cpu-front-left->cpu-back-right; mover:ピグミィLv1HP3(act0/2); fallbackMove:cpu-front-left->cpu-back-right:keepsTo | 122 | 49.3 | 22.4 | 92.2 | -40.8 | - | - | - |
| 2 |  |  |  | focus:デスシープ | fallbackMove:cpu-front-left->cpu-back-right:keepsTo | 44 | 29.1 | 19.4 | 80.2 | -40.8 | - | - | - |
| 3 |  |  |  | focus:ピグミィ | fallbackMove:cpu-front-left->cpu-back-right:keepsTo | 44 | -1.6 | -11.3 | 46.2 | -68.8 | - | - | - |
| 4 |  |  |  | move:cpu_front_left->cpu_back_left | move:cpu-front-left->cpu-back-left; mover:ピグミィLv1HP3(act0/2); fallbackMove:cpu-front-left->cpu-back-right:keepsTo | 56 | -5.2 | -17.6 | 70.2 | -86.8 | - | - | - |
| 5 |  |  |  | end_turn | fallbackMove:cpu-front-left->cpu-back-right:keepsTo | -63.7 | -78.2 | -11.3 | 46.2 | -68.8 | - | - | - |

### seed 994325 / challenger-as-cpu / step 70 / turn 6

- elapsed: 479.1ms / inspection 480.6ms
- state: turn 6 / current cpu / HP cpu/player 9/10 / stones cpu/player 4/0 / deck cpu/player 19/20 / hand cpu/player 5/3
- board: player_front_left:PF:ボムゾウ Lv2 HP2 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 prep | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act1/2
- rolloutTriggered: false, adopted: true
- decision: focus:デスシープ
- fallback: focus:デスシープ (-61.5)
- planner selected: focus:デスシープ (-8.9)
- root gap to fallback: -105.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:デスシープ | - | 44 | -8.9 | -18.6 | 42.2 | -78.8 | - | - | - |
| 2 |  |  |  | focus:ピグミィ | - | 32 | -11.5 | -18.6 | 42.2 | -78.8 | - | - | - |
| 3 |  |  |  | end_turn | - | -61.7 | -42 | -15.6 | 54.2 | -78.8 | - | - | - |

### seed 994325 / challenger-as-cpu / step 71 / turn 6

- elapsed: 307.3ms / inspection 307ms
- state: turn 6 / current cpu / HP cpu/player 9/10 / stones cpu/player 4/0 / deck cpu/player 19/20 / hand cpu/player 5/3
- board: player_front_left:PF:ボムゾウ Lv2 HP2 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 prep | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act1/2
- rolloutTriggered: false, adopted: true
- decision: focus:ピグミィ
- fallback: focus:ピグミィ (-143.5)
- planner selected: focus:ピグミィ (11.7)
- root gap to fallback: -175.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ピグミィ | - | 32 | 11.7 | 4.7 | 26.2 | -16.8 | - | - | - |
| 2 |  |  |  | end_turn | - | -86.2 | -62.6 | -24.6 | 36.2 | -84.8 | - | - | - |

### seed 994325 / challenger-as-cpu / step 73 / turn 6

- elapsed: 96.9ms / inspection 97ms
- state: turn 6 / current cpu / HP cpu/player 9/10 / stones cpu/player 2/0 / deck cpu/player 19/20 / hand cpu/player 5/3
- board: player_front_left:PF:ボムゾウ Lv2 HP2 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 prep | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 focus,shield | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-297.6)
- planner selected: end_turn (-39.8)
- root gap to fallback: -191.4
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -106.2 | -39.8 | -3.3 | 18.2 | -24.8 | - | - | - |

### seed 994325 / challenger-as-cpu / step 78 / turn 7

- elapsed: 349.1ms / inspection 351.7ms
- state: turn 7 / current cpu / HP cpu/player 9/10 / stones cpu/player 5/3 / deck cpu/player 18/19 / hand cpu/player 6/4
- board: player_front_left:PF:ボムゾウ Lv2 HP1 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: master:master_attack->monster:player_front_left
- fallback: master:master_attack->monster:player_front_left (557.9)
- planner selected: master:master_attack->monster:player_front_left (215.4)
- root gap to fallback: 66.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | master:master_attack->monster:player_front_left | - | 491.1 | 215.4 | 175.8 | 205 | 146.6 | - | - | - |
| 2 |  |  |  | focus:デスシープ | - | 177 | 94.7 | 172.8 | 209 | 136.6 | - | - | - |
| 3 |  |  |  | attack:デスシープ:attack->ドノマンティス | attackTarget:player-front-right:ドノマンティスLv1HP5(act0/1,focus); targetAfter:ドノマンティスLv1HP4(act0/1); attackerAfter:デスシープLv1HP5(act1/1) | -33 | -122.5 | 106.8 | 139 | 74.6 | - | - | - |
| 4 |  |  |  | end_turn | - | 0.5 | -188.2 | 17 | 46 | -12 | - | - | - |

### seed 994325 / challenger-as-cpu / step 79 / turn 7

- elapsed: 263.8ms / inspection 264.1ms
- state: turn 7 / current cpu / HP cpu/player 9/10 / stones cpu/player 2/5 / deck cpu/player 18/19 / hand cpu/player 6/4
- board: player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: focus:デスシープ
- fallback: focus:デスシープ (180.3)
- planner selected: focus:デスシープ (69.4)
- root gap to fallback: -3.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:デスシープ | - | 183.8 | 69.4 | 29.8 | 66 | -6.4 | - | - | - |
| 2 |  |  |  | end_turn | - | 16.5 | -7.2 | 32.8 | 62 | 3.6 | - | - | - |
| 3 |  |  |  | attack:デスシープ:attack->ドノマンティス | attackTarget:player-front-right:ドノマンティスLv1HP5(act0/1,focus); targetAfter:ドノマンティスLv1HP4(act0/1); attackerAfter:デスシープLv1HP5(act1/1) | -41.6 | -118 | -36.2 | -4 | -68.4 | - | - | - |

### seed 994325 / challenger-as-cpu / step 81 / turn 7

- elapsed: 43.8ms / inspection 43.5ms
- state: turn 7 / current cpu / HP cpu/player 9/10 / stones cpu/player 0/5 / deck cpu/player 18/19 / hand cpu/player 6/4
- board: player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 focus,shield | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-186)
- planner selected: end_turn (20)
- root gap to fallback: -178
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -8 | 20 | 21.8 | 58 | -14.4 | - | - | - |

### seed 994325 / challenger-as-cpu / step 85 / turn 8

- elapsed: 1754.5ms / inspection 1773.6ms
- state: turn 8 / current cpu / HP cpu/player 9/10 / stones cpu/player 3/7 / deck cpu/player 17/18 / hand cpu/player 6/4
- board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2
- rolloutTriggered: false, adopted: true
- decision: focus:デスシープ
- fallback: focus:デスシープ (393.8)
- planner selected: focus:デスシープ (290.8)
- root gap to fallback: 208.1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:デスシープ | - | 185.8 | 290.8 | 251.2 | 274.4 | 228 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->ヤンバル | attackTarget:player-front-left:ヤンバルLv1HP3(act1/1); targetAfter:ヤンバルLv1HP2(act1/1); attackerAfter:ピグミィLv1HP3(act1/2) | 109 | 275.2 | 251.2 | 274.4 | 228 | - | - | - |
| 3 |  |  |  | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:player-front-right:ドノマンティスLv1HP5(act0/1,focus); targetAfter:ドノマンティスLv1HP5(act0/1); attackerAfter:ピグミィLv1HP3(act1/2) | 92.9 | 164.9 | 150.9 | 184.4 | 117.4 | - | - | - |
| 4 |  |  |  | summon:ドノマンティス->cpu_front_left | summon:ドノマンティス->front-left; noBacklineReach; sameLaneEnemyFront:ヤンバルLv1HP3(act1/1); after:prepared | 127.2 | 159.5 | 131.5 | 151.6 | 111.4 | - | - | - |
| 5 |  |  |  | focus:ピグミィ | - | 44 | 122.2 | 143.4 | 166.4 | 120.4 | - | - | - |
| 6 |  |  |  | attack:デスシープ:attack->ドノマンティス | attackTarget:player-front-right:ドノマンティスLv1HP5(act0/1,focus); targetAfter:ドノマンティスLv1HP4(act0/1); attackerAfter:デスシープLv1HP5(act1/1) | -39.6 | 106.8 | 188.2 | 220.4 | 156 | - | - | - |

### seed 994325 / challenger-as-cpu / step 87 / turn 8

- elapsed: 777.4ms / inspection 782.3ms
- state: turn 8 / current cpu / HP cpu/player 9/10 / stones cpu/player 3/7 / deck cpu/player 17/18 / hand cpu/player 6/4
- board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act1/2
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->ヤンバル
- fallback: attack:ピグミィ:スパイクボール->ヤンバル (290.7)
- planner selected: attack:ピグミィ:スパイクボール->ヤンバル (183.1)
- root gap to fallback: 195.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ヤンバル | attackTarget:player-front-left:ヤンバルLv1HP3(act1/1); targetAfter:ヤンバルLv1HP2(act1/1); attackerAfter:ピグミィLv1HP3(act2/2) | 95 | 183.1 | 162.2 | 188.4 | 136 | - | - | - |
| 2 |  |  |  | summon:ドノマンティス->cpu_front_left | summon:ドノマンティス->front-left; noBacklineReach; sameLaneEnemyFront:ヤンバルLv1HP3(act1/1); after:prepared | 127.2 | 129.5 | 101.5 | 115.6 | 87.4 | - | - | - |
| 3 |  |  |  | focus:ピグミィ | - | 30 | 93.5 | 95.5 | 103.6 | 87.4 | - | - | - |
| 4 |  |  |  | master:master_attack->monster:player_front_left | - | 26.4 | 36.6 | 41.2 | 73.4 | 9 | - | - | - |
| 5 |  |  |  | end_turn | - | -57.6 | -60.2 | 4.9 | 44.4 | -34.6 | - | - | - |

### seed 994325 / challenger-as-cpu / step 88 / turn 8

- elapsed: 531.3ms / inspection 535.8ms
- state: turn 8 / current cpu / HP cpu/player 9/10 / stones cpu/player 3/7 / deck cpu/player 17/18 / hand cpu/player 6/4
- board: player_front_left:PF:ヤンバル Lv1 HP2 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: summon:ドノマンティス->cpu_front_left
- fallback: summon:ドノマンティス->cpu_front_left (460.4)
- planner selected: summon:ドノマンティス->cpu_front_left (120.2)
- root gap to fallback: 333.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ドノマンティス->cpu_front_left | summon:ドノマンティス->front-left; noBacklineReach; sameLaneEnemyFront:ヤンバルLv1HP2(act1/1); after:prepared | 127.2 | 120.2 | 168.2 | 194.4 | 142 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:player_front_left | - | 359.2 | 86.8 | 47.2 | 79.4 | 15 | - | - | - |
| 3 |  |  |  | summon:ドノマンティス->cpu_back_left | summon:ドノマンティス->back-left; noBacklineReach; sameLaneEnemyFront:ヤンバルLv1HP2(act1/1); after:prepared | 85.2 | -41.8 | 36.5 | 51.6 | 21.4 | - | - | - |
| 4 |  |  |  | end_turn | - | -79.6 | -254 | -57.1 | -23.6 | -90.6 | - | - | - |

### seed 994325 / challenger-as-cpu / step 89 / turn 8

- elapsed: 305.4ms / inspection 312.5ms
- state: turn 8 / current cpu / HP cpu/player 9/10 / stones cpu/player 2/7 / deck cpu/player 17/18 / hand cpu/player 5/4
- board: player_front_left:PF:ヤンバル Lv1 HP2 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:ドノマンティス Lv1 HP5 prep | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: master:wake_up->monster:cpu_front_left
- fallback: master:wake_up->monster:cpu_front_left (552.8)
- planner selected: master:wake_up->monster:cpu_front_left (139.6)
- root gap to fallback: 205.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | master:wake_up->monster:cpu_front_left | - | 347.1 | 139.6 | 100 | 126.2 | 73.8 | - | - | - |
| 2 |  |  |  | master:shield->monster:cpu_front_right | - | 59.9 | -120.1 | -29.7 | -18.6 | -40.8 | - | - | - |
| 3 |  |  |  | master:shield->monster:cpu_back_right | - | 53.1 | -121.1 | -25.7 | -4.6 | -46.8 | - | - | - |
| 4 |  |  |  | end_turn | - | -81.6 | -221 | -28.7 | -20.6 | -36.8 | - | - | - |

### seed 994325 / challenger-as-cpu / step 90 / turn 8

- elapsed: 206.7ms / inspection 208.6ms
- state: turn 8 / current cpu / HP cpu/player 9/10 / stones cpu/player 0/7 / deck cpu/player 17/18 / hand cpu/player 5/4
- board: player_front_left:PF:ヤンバル Lv1 HP2 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: attack:ドノマンティス:attack->ヤンバル
- fallback: attack:ドノマンティス:attack->ヤンバル (486.4)
- planner selected: attack:ドノマンティス:attack->ヤンバル (98.8)
- root gap to fallback: 1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ドノマンティス:attack->ヤンバル | attackTarget:player-front-left:ヤンバルLv1HP2(act1/1); targetAfter:empty; attackerAfter:ドノマンティスLv1HP5(act1/1) | 485.4 | 98.8 | 59.2 | 85.4 | 33 | - | - | - |
| 2 |  |  |  | focus:ドノマンティス | - | 14.2 | -174.6 | 17.9 | 45.4 | -9.6 | - | - | - |
| 3 |  |  |  | end_turn | - | -62.6 | -223.9 | 23.9 | 57.4 | -9.6 | - | - | - |

### seed 994325 / challenger-as-cpu / step 91 / turn 8

- elapsed: 65.2ms / inspection 68ms
- state: turn 8 / current cpu / HP cpu/player 9/10 / stones cpu/player 0/8 / deck cpu/player 17/18 / hand cpu/player 5/4
- board: player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-182.8)
- planner selected: end_turn (-19.9)
- root gap to fallback: -138
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -44.8 | -19.9 | -10 | 16.2 | -36.2 | - | - | - |

### seed 994325 / challenger-as-cpu / step 103 / turn 9

- elapsed: 3508.4ms / inspection 3530.6ms
- state: turn 9 / current cpu / HP cpu/player 9/10 / stones cpu/player 4/4 / deck cpu/player 16/17 / hand cpu/player 6/4
- board: player_front_left:PF:ヤンバル Lv1 HP2 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act1/2
- rolloutTriggered: false, adopted: true
- decision: attack:ドノマンティス:attack->ヤンバル
- fallback: attack:ドノマンティス:attack->ヤンバル (739.2)
- planner selected: attack:ドノマンティス:attack->ヤンバル (261.4)
- root gap to fallback: 140.3
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ドノマンティス:attack->ヤンバル | attackTarget:player-front-left:ヤンバルLv1HP2(act1/1); targetAfter:empty; attackerAfter:ドノマンティスLv2HP5(act1/1) | 598.9 | 261.4 | 221.8 | 220.4 | 223.2 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:player_front_left | - | 324.9 | 195.4 | 252.8 | 257.4 | 248.2 | - | - | - |
| 3 |  |  |  | summon:ヤンバル->cpu_back_left | summon:ヤンバル->back-left; backlineReach; behindOwnFront:ドノマンティスLv1HP5(act0/1); sameLaneEnemyFront:ヤンバルLv1HP2(act1/1); after:prepared | 142.4 | 148.7 | 305.6 | 330 | 281.2 | - | - | - |
| 4 |  |  |  | summon:ヤンバル->cpu_back_right | summon:ヤンバル->back-right; backlineReach; behindOwnFront:ピグミィLv1HP3(act1/2); sameLaneEnemyFront:ドノマンティスLv1HP5(act1/1,focus); after:prepared | 142.4 | 148.7 | 305.6 | 330 | 281.2 | - | - | - |
| 5 |  |  |  | focus:ドノマンティス | - | 16.2 | -76.2 | 171.6 | 328 | 291.2 | - | - | - |
| 6 |  |  |  | end_turn | - | -1.6 | -213.6 | 47 | 82 | 12 | - | - | - |

### seed 994325 / challenger-as-cpu / step 105 / turn 9

- elapsed: 478.1ms / inspection 480.3ms
- state: turn 9 / current cpu / HP cpu/player 9/10 / stones cpu/player 3/5 / deck cpu/player 16/17 / hand cpu/player 6/4
- board: player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: summon:ヤンバル->cpu_back_right
- fallback: summon:ヤンバル->cpu_back_right (124)
- planner selected: summon:ヤンバル->cpu_back_right (48.8)
- root gap to fallback: 34.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ヤンバル->cpu_back_right | summon:ヤンバル->back-right; backlineReach; sameLaneEnemyFront:ドノマンティスLv1HP5(act1/1,focus); after:prepared | 89.2 | 48.8 | 29.2 | 47.2 | 11.2 | - | - | - |
| 2 |  |  |  | summon:ヤンバル->cpu_front_right | summon:ヤンバル->front-right; backlineReach; sameLaneEnemyFront:ドノマンティスLv1HP5(act1/1,focus); after:prepared | 49.6 | 35.3 | 24.4 | 37.6 | 11.2 | - | - | - |
| 3 |  |  |  | end_turn | - | -30.4 | -72.9 | -46.4 | -28 | -64.8 | - | - | - |

### seed 994325 / challenger-as-cpu / step 119 / turn 10

- elapsed: 953.1ms / inspection 936.5ms
- state: turn 10 / current cpu / HP cpu/player 8/10 / stones cpu/player 8/0 / deck cpu/player 15/16 / hand cpu/player 5/4
- board: player_front_left:PF:ピグミィ Lv2 HP1 act2/2 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: master:wake_up->monster:cpu_back_right
- fallback: master:wake_up->monster:cpu_back_right (463.2)
- planner selected: master:wake_up->monster:cpu_back_right (87.4)
- root gap to fallback: 72.6
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | master:wake_up->monster:cpu_back_right | - | 390.6 | 87.4 | 47.8 | 88.4 | 7.2 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:player_front_left | - | 398.4 | 3.6 | -36 | -21.2 | -50.8 | - | - | - |
| 3 |  |  |  | end_turn | - | -102.8 | -327.1 | -93.9 | -98.2 | -89.6 | - | - | - |

### seed 994325 / challenger-as-cpu / step 123 / turn 10

- elapsed: 67.1ms / inspection 67.5ms
- state: turn 10 / current cpu / HP cpu/player 8/10 / stones cpu/player 0/2 / deck cpu/player 15/16 / hand cpu/player 5/4
- board: player_front_right:PF:ドノマンティス Lv1 HP3 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 shield
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-417.3)
- planner selected: end_turn (-186.7)
- root gap to fallback: -306.1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -111.2 | -186.7 | -146.6 | -92.2 | -187.4 | - | - | - |

### seed 994325 / challenger-as-cpu / step 130 / turn 11

- elapsed: 511.2ms / inspection 508.9ms
- state: turn 11 / current cpu / HP cpu/player 8/10 / stones cpu/player 4/3 / deck cpu/player 14/15 / hand cpu/player 6/4
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 | player_back_left:PB:ドノマンティス Lv1 HP5 prep | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_right:CF:ヤンバル Lv2 HP3 act0/1
- rolloutTriggered: false, adopted: true
- decision: magic:ワープ->monster:player_front_right
- fallback: magic:ワープ->monster:player_front_right (274.3)
- planner selected: magic:ワープ->monster:player_front_right (1.1)
- root gap to fallback: 211.3
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | magic:ワープ->monster:player_front_right | - | 63 | 1.1 | -12.8 | 16.2 | -41.8 | - | - | - |
| 2 |  |  |  | magic:ワープ->monster:player_back_right | - | 63 | 1.1 | -12.8 | 16.2 | -41.8 | - | - | - |
| 3 |  |  |  | attack:ヤンバル:wild_claw->ピグミィ | attackTarget:player-back-right:ピグミィLv2HP3(act1/2,focus); targetAfter:ピグミィLv2HP1(act1/2); attackerAfter:ヤンバルLv2HP3(act1/1) | 64 | -43.7 | -57.8 | -25.8 | -89.8 | - | - | - |
| 4 |  |  |  | magic:ワープ->monster:player_front_left | - | 61 | -66.4 | -79.8 | 16.2 | -129.8 | - | - | - |
| 5 |  |  |  | focus:ヤンバル | - | 32 | -72.8 | -79.8 | 4.2 | -129.8 | - | - | - |
| 6 |  |  |  | attack:ヤンバル:wild_claw->ボムゾウ | attackTarget:player-front-left:ボムゾウLv1HP6(act1/1,focus); targetAfter:ボムゾウLv1HP4(act1/1); attackerAfter:ヤンバルLv2HP3(act1/1) | 2 | -127.4 | -127.8 | -25.8 | -177.8 | - | - | - |

### seed 994325 / challenger-as-cpu / step 132 / turn 11

- elapsed: 35.6ms / inspection 35.6ms
- state: turn 11 / current cpu / HP cpu/player 8/10 / stones cpu/player 1/3 / deck cpu/player 14/15 / hand cpu/player 5/4
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act1/2 focus | player_back_left:PB:ドノマンティス Lv1 HP5 prep | player_back_right:PB:ドノマンティス Lv2 HP2 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-278.9)
- planner selected: end_turn (-132.5)
- root gap to fallback: -187.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -91.2 | -132.5 | -106.8 | -83.8 | -129.8 | - | - | - |

### seed 994325 / challenger-as-cpu / step 142 / turn 12

- elapsed: 16.3ms / inspection 16ms
- state: turn 12 / current cpu / HP cpu/player 8/10 / stones cpu/player 0/0 / deck cpu/player 13/14 / hand cpu/player 6/5
- board: player_front_left:PF:ボムゾウ Lv2 HP1 act1/1 | player_front_right:PF:ドノマンティス Lv2 HP2 act1/1 shield | player_back_left:PB:ドノマンティス Lv1 HP5 act1/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-688.8)
- planner selected: end_turn (-200.1)
- root gap to fallback: -612
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -76.8 | -200.1 | -183.2 | -56 | -217 | - | - | - |

### seed 994325 / challenger-as-cpu / step 149 / turn 13

- elapsed: 63.8ms / inspection 63.3ms
- state: turn 13 / current cpu / HP cpu/player 5/10 / stones cpu/player 6/1 / deck cpu/player 12/13 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 prep | player_front_right:PF:ドノマンティス Lv2 HP2 act1/1 shield | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-332.8)
- planner selected: end_turn (-178.1)
- root gap to fallback: -238.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -94 | -178.1 | -150.5 | -73.2 | -216.2 | - | - | - |

### seed 994325 / challenger-as-cpu / step 152 / turn 14

- elapsed: 80.1ms / inspection 81ms
- state: turn 14 / current cpu / HP cpu/player 3/10 / stones cpu/player 11/3 / deck cpu/player 11/12 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:ドノマンティス Lv2 HP2 act1/1 | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: master:master_attack->monster:player_front_right
- fallback: master:master_attack->monster:player_front_right (1801.1)
- planner selected: master:master_attack->monster:player_front_right (157.1)
- root gap to fallback: 644.1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | master:master_attack->monster:player_front_right | - | 1157 | 157.1 | 117.5 | 133 | 102 | - | - | - |
| 2 |  |  |  | end_turn | - | -41.9 | -664.4 | -95.7 | -32 | -157 | - | - | - |

### seed 994325 / challenger-as-cpu / step 153 / turn 14

- elapsed: 35.3ms / inspection 35.1ms
- state: turn 14 / current cpu / HP cpu/player 3/10 / stones cpu/player 8/5 / deck cpu/player 11/12 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-178.7)
- planner selected: end_turn (-18.5)
- root gap to fallback: -183.1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | 4.3 | -18.5 | -19.5 | -4 | -35 | - | - | - |

### seed 994325 / challenger-as-cpu / step 156 / turn 15

- elapsed: 64.3ms / inspection 64ms
- state: turn 15 / current cpu / HP cpu/player 2/10 / stones cpu/player 12/8 / deck cpu/player 10/11 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 focus
- rolloutTriggered: false, adopted: true
- decision: summon:真勇者ダイン->cpu_back_left
- fallback: summon:真勇者ダイン->cpu_back_left (92.8)
- planner selected: summon:真勇者ダイン->cpu_back_left (84.8)
- root gap to fallback: 0
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:真勇者ダイン->cpu_back_left | summon:真勇者ダイン->back-left; noBacklineReach; sameLaneEnemyFront:真勇者ダインLv1HP6(act1/1); after:prepared | 92.8 | 84.8 | 64.4 | 30.8 | 98 | - | - | - |
| 2 |  |  |  | summon:真勇者ダイン->cpu_back_right | summon:真勇者ダイン->back-right; noBacklineReach; sameLaneEnemyFront:ピグミィLv2HP3(act0/2,focus); after:prepared | 92.8 | 63.3 | 42.9 | 30.8 | 55 | - | - | - |
| 3 |  |  |  | summon:ヤンバル->cpu_back_left | summon:ヤンバル->back-left; backlineReach; sameLaneEnemyFront:真勇者ダインLv1HP6(act1/1); after:prepared | 89.2 | 39.7 | 20.1 | 27.2 | 13 | - | - | - |
| 4 |  |  |  | summon:ヤンバル->cpu_back_right | summon:ヤンバル->back-right; backlineReach; sameLaneEnemyFront:ピグミィLv2HP3(act0/2,focus); after:prepared | 89.2 | 39.7 | 20.1 | 27.2 | 13 | - | - | - |
| 5 |  |  |  | end_turn | - | -23.6 | -75.9 | -52.5 | -32 | -73 | - | - | - |

### seed 994325 / challenger-as-cpu / step 157 / turn 15

- elapsed: 5.9ms / inspection 5ms
- state: turn 15 / current cpu / HP cpu/player 2/10 / stones cpu/player 11/8 / deck cpu/player 10/11 / hand cpu/player 5/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-25.3)
- planner selected: end_turn (-1)
- root gap to fallback: 0.4
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -25.6 | -1 | 4.6 | -29 | 38.2 | - | - | - |

### seed 994325 / challenger-as-cpu / step 159 / turn 16

- elapsed: 21ms / inspection 20.2ms
- state: turn 16 / current cpu / HP cpu/player 2/10 / stones cpu/player 14/11 / deck cpu/player 9/10 / hand cpu/player 6/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-265.2)
- planner selected: end_turn (46.1)
- root gap to fallback: -281.6
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | 16.4 | 46.1 | 42.5 | 58 | 27 | - | - | - |


