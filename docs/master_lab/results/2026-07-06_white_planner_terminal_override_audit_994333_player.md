# White Rollout Trigger Audit

生成: 2026-07-06T13:10:34.319Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994333-994333
directions: challenger-as-player
baseline: `white`, challenger: `white_planner`
inspectThresholdMs: 999999
inspectTurnPlanDecisions: true

## Conclusion

- 1 games. challenger wins 0, inspected decisions 60, rollout-triggered decisions 0.
- max challenger decision 4960.9ms, avg challenger decision 761.9ms.
- No rollout-triggered decision was captured. Lower --inspect-threshold-ms or expand seeds before tuning.

## Games

| seed | direction | result | steps | turns | HP | decisions | avg ms | max ms | events | issue |
| ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 994333 | challenger-as-player | white | 206 | 17 | P0/C2 | 101 | 761.9 | 4960.9 | 60 | - |

## Events

### seed 994333 / challenger-as-player / step 0 / turn 1

- elapsed: 453.3ms / inspection 436.2ms
- state: turn 1 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 25/25 / hand player/cpu 5/5
- board: empty
- rolloutTriggered: false, adopted: true
- decision: summon:ピグミィ->player_back_left
- fallback: summon:ピグミィ->player_back_left (196.9)
- planner selected: summon:ピグミィ->player_back_left (263.4)
- root gap to fallback: 108.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ピグミィ->player_back_left | summon:ピグミィ->back-left; backlineReach; after:prepared | 88.2 | 263.4 | 244 | 188.8 | 299.2 | - | - | - |
| 2 |  |  |  | summon:ピグミィ->player_back_right | summon:ピグミィ->back-right; backlineReach; after:prepared | 88.2 | 263.4 | 244 | 188.8 | 299.2 | - | - | - |
| 3 |  |  |  | summon:ドノマンティス->player_back_left | summon:ドノマンティス->back-left; noBacklineReach; after:prepared | 85.2 | 256.7 | 238 | 176.8 | 299.2 | - | - | - |
| 4 |  |  |  | summon:ドノマンティス->player_back_right | summon:ドノマンティス->back-right; noBacklineReach; after:prepared | 85.2 | 256.7 | 238 | 176.8 | 299.2 | - | - | - |
| 5 |  |  |  | end_turn | - | -14 | -52.6 | -38.4 | -17 | -59.8 | - | - | - |

### seed 994333 / challenger-as-player / step 1 / turn 1

- elapsed: 187.2ms / inspection 192ms
- state: turn 1 / current player / HP player/cpu 10/10 / stones player/cpu 2/0 / deck player/cpu 25/25 / hand player/cpu 4/5
- board: player_back_left:PB:ピグミィ Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: summon:ドノマンティス->player_front_left
- fallback: summon:ドノマンティス->player_front_left (201.4)
- planner selected: summon:ドノマンティス->player_front_left (217.6)
- root gap to fallback: 66
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ドノマンティス->player_front_left | summon:ドノマンティス->front-left; noBacklineReach; after:prepared | 135.4 | 217.6 | 187.8 | 132.6 | 243 | - | - | - |
| 2 |  |  |  | summon:ドノマンティス->player_front_left | summon:ドノマンティス->front-left; noBacklineReach; after:prepared | 135.4 | 217.6 | 187.8 | 132.6 | 243 | - | - | - |
| 3 |  |  |  | summon:ドノマンティス->player_front_right | summon:ドノマンティス->front-right; noBacklineReach; after:prepared | 122.2 | 214.7 | 187.8 | 132.6 | 243 | - | - | - |
| 4 |  |  |  | summon:ドノマンティス->player_front_right | summon:ドノマンティス->front-right; noBacklineReach; after:prepared | 122.2 | 214.7 | 187.8 | 132.6 | 243 | - | - | - |
| 5 |  |  |  | end_turn | - | -14 | -62.8 | -25 | -17 | -33 | - | - | - |

### seed 994333 / challenger-as-player / step 2 / turn 1

- elapsed: 78.8ms / inspection 78.6ms
- state: turn 1 / current player / HP player/cpu 10/10 / stones player/cpu 1/0 / deck player/cpu 25/25 / hand player/cpu 3/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 prep | player_back_left:PB:ピグミィ Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: summon:ドノマンティス->player_front_right
- fallback: summon:ドノマンティス->player_front_right (122.2)
- planner selected: summon:ドノマンティス->player_front_right (133.3)
- root gap to fallback: 0
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ドノマンティス->player_front_right | summon:ドノマンティス->front-right; noBacklineReach; after:prepared | 122.2 | 133.3 | 106.4 | 51.2 | 161.6 | - | - | - |
| 2 |  |  |  | summon:ドノマンティス->player_back_right | summon:ドノマンティス->back-right; noBacklineReach; after:prepared | 80.2 | 118 | 100.4 | 39.2 | 161.6 | - | - | - |
| 3 |  |  |  | end_turn | - | -14 | -18.4 | 12.8 | -17 | 42.6 | - | - | - |

### seed 994333 / challenger-as-player / step 3 / turn 1

- elapsed: 27.3ms / inspection 27.1ms
- state: turn 1 / current player / HP player/cpu 10/10 / stones player/cpu 0/0 / deck player/cpu 25/25 / hand player/cpu 2/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 prep | player_front_right:PF:ドノマンティス Lv1 HP5 prep | player_back_left:PB:ピグミィ Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-14)
- planner selected: end_turn (35.1)
- root gap to fallback: 0
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -14 | 35.1 | 38.2 | -17 | 93.4 | - | - | - |

### seed 994333 / challenger-as-player / step 9 / turn 2

- elapsed: 426ms / inspection 424.2ms
- state: turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 24/24 / hand player/cpu 3/3
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP6 prep | cpu_back_left:CB:ピグミィ Lv1 HP3 prep | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep
- rolloutTriggered: false, adopted: true
- decision: summon:ピグミィ->player_back_right
- fallback: summon:ピグミィ->player_back_right (-36.6)
- planner selected: summon:ピグミィ->player_back_right (104.2)
- root gap to fallback: -173
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ピグミィ->player_back_right | summon:ピグミィ->back-right; backlineReach; behindOwnFront:ドノマンティスLv1HP5(act1/1,focus); after:prepared | 136.4 | 104.2 | 74.2 | 90.8 | 57.6 | - | - | - |
| 2 |  |  |  | focus:ピグミィ | - | 44 | 77.7 | 74.2 | 90.8 | 57.6 | - | - | - |
| 3 |  |  |  | focus:ドノマンティス | - | 44 | 71.7 | 68.2 | 78.8 | 57.6 | - | - | - |
| 4 |  |  |  | end_turn | - | -145.4 | -153.9 | -21 | 21.4 | -63.4 | - | - | - |

### seed 994333 / challenger-as-player / step 11 / turn 2

- elapsed: 191ms / inspection 191ms
- state: turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 2/0 / deck player/cpu 24/24 / hand player/cpu 2/3
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | player_back_right:PB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:デスシープ Lv1 HP6 prep | cpu_back_left:CB:ピグミィ Lv1 HP3 prep | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep
- rolloutTriggered: false, adopted: true
- decision: focus:ピグミィ
- fallback: focus:ピグミィ (-298.2)
- planner selected: focus:ピグミィ (2.5)
- root gap to fallback: -342.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ピグミィ | - | 44 | 2.5 | -7.2 | 3.4 | -17.8 | - | - | - |
| 2 |  |  |  | end_turn | - | -168.6 | -110.6 | -7.2 | 3.4 | -17.8 | - | - | - |

### seed 994333 / challenger-as-player / step 13 / turn 2

- elapsed: 55.8ms / inspection 55.2ms
- state: turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 0/0 / deck player/cpu 24/24 / hand player/cpu 2/3
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus,shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:デスシープ Lv1 HP6 prep | cpu_back_left:CB:ピグミィ Lv1 HP3 prep | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-599.5)
- planner selected: end_turn (-124.1)
- root gap to fallback: -412.9
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -186.6 | -124.1 | -31.2 | -14.6 | -47.8 | - | - | - |

### seed 994333 / challenger-as-player / step 21 / turn 3

- elapsed: 982.1ms / inspection 974.8ms
- state: turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 23/23 / hand player/cpu 3/3
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 focus,shield | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ボムゾウ Lv1 HP6 prep
- rolloutTriggered: false, adopted: true
- decision: focus:ドノマンティス
- fallback: focus:ドノマンティス (104.9)
- planner selected: focus:ドノマンティス (186.4)
- root gap to fallback: -78.9
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ドノマンティス | - | 183.8 | 186.4 | 146.8 | 175.8 | 117.8 | - | - | - |
| 2 |  |  |  | focus:ピグミィ | - | 44 | 132.6 | 152.8 | 187.8 | 117.8 | - | - | - |
| 3 |  |  |  | focus:ドノマンティス | - | 44 | 126.6 | 146.8 | 175.8 | 117.8 | - | - | - |
| 4 |  |  |  | attack:ドノマンティス:attack->ドノマンティス | attackTarget:cpu-front-right:ドノマンティスLv1HP5(act1/1,focus,shield); targetAfter:ドノマンティスLv1HP5(act1/1,shield); attackerAfter:ドノマンティスLv1HP5(act1/1) | 69.5 | 77.5 | 79.3 | 115.8 | 42.8 | - | - | - |
| 5 |  |  |  | end_turn | - | -43.4 | 69.7 | 152.8 | 187.8 | 117.8 | - | - | - |

### seed 994333 / challenger-as-player / step 23 / turn 3

- elapsed: 666.7ms / inspection 653.8ms
- state: turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 23/23 / hand player/cpu 3/3
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ボムゾウ Lv1 HP6 prep
- rolloutTriggered: false, adopted: true
- decision: focus:ピグミィ
- fallback: focus:ピグミィ (-145.4)
- planner selected: focus:ピグミィ (71)
- root gap to fallback: -189.4
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ピグミィ | - | 44 | 71 | 61.3 | 91.8 | 30.8 | - | - | - |
| 2 |  |  |  | end_turn | - | -76.2 | 24.4 | 61.3 | 91.8 | 30.8 | - | - | - |

### seed 994333 / challenger-as-player / step 25 / turn 3

- elapsed: 571.6ms / inspection 568.8ms
- state: turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 23/23 / hand player/cpu 3/3
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus | cpu_front_left:CF:デスシープ Lv1 HP5 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ボムゾウ Lv1 HP6 prep
- rolloutTriggered: false, adopted: true
- decision: focus:ピグミィ
- fallback: focus:ピグミィ (-169.4)
- planner selected: focus:ピグミィ (62.3)
- root gap to fallback: -201.4
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ピグミィ | - | 32 | 62.3 | 55.3 | 79.8 | 30.8 | - | - | - |
| 2 |  |  |  | end_turn | - | -76.2 | 30.4 | 61.3 | 91.8 | 30.8 | - | - | - |

### seed 994333 / challenger-as-player / step 28 / turn 3

- elapsed: 74.3ms / inspection 76.7ms
- state: turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 1/0 / deck player/cpu 23/23 / hand player/cpu 3/3
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus,shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP4 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ボムゾウ Lv1 HP6 prep
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-306.3)
- planner selected: end_turn (-28.5)
- root gap to fallback: -212.1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -94.2 | -28.5 | -0.7 | 23.8 | -25.2 | - | - | - |

### seed 994333 / challenger-as-player / step 38 / turn 4

- elapsed: 480.2ms / inspection 476.5ms
- state: turn 4 / current player / HP player/cpu 10/10 / stones player/cpu 5/0 / deck player/cpu 22/22 / hand player/cpu 4/3
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP4 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ボムゾウ Lv1 HP6 act1/1 focus
- rolloutTriggered: false, adopted: true
- decision: summon:ボムゾウ->player_back_left
- fallback: summon:ボムゾウ->player_back_left (113)
- planner selected: summon:ボムゾウ->player_back_left (90.6)
- root gap to fallback: 30.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ボムゾウ->player_back_left | summon:ボムゾウ->back-left; backlineReach; behindOwnFront:ドノマンティスLv1HP5(act1/1); sameLaneEnemyFront:デスシープLv1HP4(act1/1); after:prepared | 82.8 | 90.6 | 72.4 | 70.8 | 74 | - | - | - |
| 2 |  |  |  | summon:ボムゾウ->player_back_left | summon:ボムゾウ->back-left; backlineReach; behindOwnFront:ドノマンティスLv1HP5(act1/1); sameLaneEnemyFront:デスシープLv1HP4(act1/1); after:prepared | 82.8 | 90.6 | 72.4 | 70.8 | 74 | - | - | - |
| 3 |  |  |  | end_turn | - | -79.4 | -71.6 | -13 | -5 | -21 | - | - | - |

### seed 994333 / challenger-as-player / step 40 / turn 4

- elapsed: 75.2ms / inspection 75.9ms
- state: turn 4 / current player / HP player/cpu 10/10 / stones player/cpu 2/0 / deck player/cpu 22/22 / hand player/cpu 3/3
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus,shield | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP4 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ボムゾウ Lv1 HP6 act1/1 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-187.1)
- planner selected: end_turn (-6.9)
- root gap to fallback: -107.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -79.4 | -6.9 | 10.6 | 9 | 12.2 | - | - | - |

### seed 994333 / challenger-as-player / step 48 / turn 5

- elapsed: 1833.3ms / inspection 1818.7ms
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 6/0 / deck player/cpu 21/21 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP4 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ボムゾウ Lv1 HP6 act1/1
- rolloutTriggered: false, adopted: true
- decision: focus:ドノマンティス
- fallback: focus:ドノマンティス (420.5)
- planner selected: focus:ドノマンティス (329.8)
- root gap to fallback: 241.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ドノマンティス | - | 179 | 329.8 | 290.4 | 290.4 | 290.4 | - | - | - |
| 2 |  |  |  | summon:ピグミィ->player_back_left | summon:ピグミィ->back-left; backlineReach; behindOwnFront:ボムゾウLv1HP6(act0/1); sameLaneEnemyFront:デスシープLv1HP4(act1/1); after:prepared | 136.4 | 320.4 | 290.4 | 290.4 | 290.4 | - | - | - |
| 3 |  |  |  | summon:ボムゾウ->player_back_left | summon:ボムゾウ->back-left; backlineReach; behindOwnFront:ボムゾウLv1HP6(act0/1); sameLaneEnemyFront:デスシープLv1HP4(act1/1); after:prepared | 82.8 | 290.9 | 280.8 | 280.8 | 280.8 | - | - | - |
| 4 |  |  |  | attack:ボムゾウ:self_bomb->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP4(act1/1); targetAfter:デスシープLv1HP2(act1/1); attackerAfter:ボムゾウLv1HP4(act1/1) | 130.1 | 284.6 | 256 | 277.4 | 234.6 | - | - | - |
| 5 |  |  |  | focus:ピグミィ | - | 44 | 272.6 | 290.4 | 290.4 | 290.4 | - | - | - |
| 6 |  |  |  | end_turn | - | 3.2 | 54.1 | 101.3 | 171 | 38 | - | - | - |

### seed 994333 / challenger-as-player / step 49 / turn 5

- elapsed: 2147.4ms / inspection 2129.2ms
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 6/0 / deck player/cpu 21/21 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP4 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ボムゾウ Lv1 HP6 act1/1
- rolloutTriggered: false, adopted: true
- decision: summon:ピグミィ->player_back_left
- fallback: summon:ピグミィ->player_back_left (332.2)
- planner selected: summon:ピグミィ->player_back_left (314.4)
- root gap to fallback: 195.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ピグミィ->player_back_left | summon:ピグミィ->back-left; backlineReach; behindOwnFront:ボムゾウLv1HP6(act0/1); sameLaneEnemyFront:デスシープLv1HP4(act1/1); after:prepared | 136.4 | 314.4 | 284.4 | 284.4 | 284.4 | - | - | - |
| 2 |  |  |  | summon:ボムゾウ->player_back_left | summon:ボムゾウ->back-left; backlineReach; behindOwnFront:ボムゾウLv1HP6(act0/1); sameLaneEnemyFront:デスシープLv1HP4(act1/1); after:prepared | 82.8 | 293 | 274.8 | 274.8 | 274.8 | - | - | - |
| 3 |  |  |  | focus:ピグミィ | - | 44 | 287.9 | 284.4 | 284.4 | 284.4 | - | - | - |
| 4 |  |  |  | attack:ボムゾウ:self_bomb->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP4(act1/1); targetAfter:デスシープLv1HP2(act1/1); attackerAfter:ボムゾウLv1HP4(act1/1) | 130.1 | 275.6 | 247 | 275.4 | 218.6 | - | - | - |
| 5 |  |  |  | focus:ボムゾウ | - | 42 | 183.7 | 181.7 | 210.4 | 153 | - | - | - |
| 6 |  |  |  | end_turn | - | -14.8 | 53.4 | 92.3 | 153 | 32 | - | - | - |

### seed 994333 / challenger-as-player / step 52 / turn 5

- elapsed: 603ms / inspection 602.8ms
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 5/0 / deck player/cpu 21/21 / hand player/cpu 3/4
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 | cpu_front_left:CF:デスシープ Lv1 HP1 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ボムゾウ Lv1 HP6 act1/1
- rolloutTriggered: false, adopted: true
- decision: master:wake_up->monster:player_back_left
- fallback: master:wake_up->monster:player_back_left (631.3)
- planner selected: master:wake_up->monster:player_back_left (222.2)
- root gap to fallback: 285.9
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | master:wake_up->monster:player_back_left | - | 345.4 | 222.2 | 258.4 | 293.6 | 223.2 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP1(act1/1); targetAfter:empty; attackerAfter:ピグミィLv1HP3(act2/2) | 577 | 195.6 | 156 | 156 | 156 | - | - | - |
| 3 |  |  |  | master:master_attack->monster:cpu_front_left | - | 341 | 142.2 | 180.6 | 196 | 165.2 | - | - | - |
| 4 |  |  |  | focus:ピグミィ | - | 0.7 | 10.4 | 258.4 | 293.6 | 223.2 | - | - | - |
| 5 |  |  |  | end_turn | - | -38.2 | -229.7 | 46.3 | 75 | 17.6 | - | - | - |

### seed 994333 / challenger-as-player / step 53 / turn 5

- elapsed: 520.9ms / inspection 525ms
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 21/21 / hand player/cpu 3/4
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 | cpu_front_left:CF:デスシープ Lv1 HP1 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ボムゾウ Lv1 HP6 act1/1
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->デスシープ
- fallback: attack:ピグミィ:スパイクボール->デスシープ (536.9)
- planner selected: attack:ピグミィ:スパイクボール->デスシープ (207.6)
- root gap to fallback: -36.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP1(act1/1); targetAfter:empty; attackerAfter:ピグミィLv1HP3(act1/2) | 573.1 | 207.6 | 168 | 168 | 168 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP1(act1/1); targetAfter:empty; attackerAfter:ピグミィLv1HP3(act2/2) | 561.1 | 195.6 | 156 | 156 | 156 | - | - | - |
| 3 |  |  |  | master:master_attack->monster:cpu_front_left | - | 325.1 | 177.3 | 221.7 | 264 | 181.6 | - | - | - |
| 4 |  |  |  | focus:ピグミィ | - | 44 | 1.9 | 216.8 | 252 | 181.6 | - | - | - |
| 5 |  |  |  | focus:ピグミィ | - | 32 | -6.7 | 216.8 | 252 | 181.6 | - | - | - |
| 6 |  |  |  | end_turn | - | -19.7 | -172.3 | 88.5 | 143 | 34 | - | - | - |

### seed 994333 / challenger-as-player / step 56 / turn 5

- elapsed: 353ms / inspection 352.3ms
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 2/1 / deck player/cpu 21/21 / hand player/cpu 3/4
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 focus | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ボムゾウ Lv1 HP6 act1/1
- rolloutTriggered: false, adopted: true
- decision: focus:ピグミィ
- fallback: focus:ピグミィ (-23.2)
- planner selected: focus:ピグミィ (119.9)
- root gap to fallback: -55.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ピグミィ | - | 32 | 119.9 | 112.8 | 157 | 72.6 | - | - | - |
| 2 |  |  |  | end_turn | - | -6 | 116.5 | 117.8 | 153 | 82.6 | - | - | - |

### seed 994333 / challenger-as-player / step 58 / turn 5

- elapsed: 77ms / inspection 78.5ms
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 0/1 / deck player/cpu 21/21 / hand player/cpu 3/4
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 focus,shield | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ボムゾウ Lv1 HP6 act1/1
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-146.1)
- planner selected: end_turn (94.1)
- root gap to fallback: -120.1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -26 | 94.1 | 99.8 | 135 | 64.6 | - | - | - |

### seed 994333 / challenger-as-player / step 65 / turn 6

- elapsed: 3219.3ms / inspection 3235.9ms
- state: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/1 / deck player/cpu 20/20 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP3 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 shield
- rolloutTriggered: false, adopted: true
- decision: focus:ボムゾウ
- fallback: focus:ボムゾウ (463.6)
- planner selected: focus:ボムゾウ (203.7)
- root gap to fallback: 231.6
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ボムゾウ | - | 232 | 203.7 | 164.1 | 206.4 | 124 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:cpu-front-right:ドノマンティスLv1HP3(act1/1); targetAfter:ドノマンティスLv1HP2(act1/1); attackerAfter:ピグミィLv2HP3(act1/2) | 107.1 | 165.8 | 164.7 | 218.4 | 124 | - | - | - |
| 3 |  |  |  | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:cpu-front-right:ドノマンティスLv1HP3(act1/1); targetAfter:ドノマンティスLv1HP2(act1/1); attackerAfter:ピグミィLv1HP3(act1/2) | 107.1 | 165.8 | 164.7 | 218.4 | 124 | - | - | - |
| 4 |  |  |  | attack:ボムゾウ:storm_bomb->ドノマンティス | attackTarget:cpu-front-right:ドノマンティスLv1HP3(act1/1); targetAfter:ドノマンティスLv1HP2(act1/1); attackerAfter:ボムゾウLv1HP4(act1/1) | 111.1 | 132 | 128 | 128 | 128 | - | - | - |
| 5 |  |  |  | end_turn | - | -76.4 | -106.4 | 24.6 | 85.4 | -35.6 | - | - | - |

### seed 994333 / challenger-as-player / step 66 / turn 6

- elapsed: 2706.6ms / inspection 2730.4ms
- state: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/1 / deck player/cpu 20/20 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP3 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 shield
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->ドノマンティス
- fallback: attack:ピグミィ:スパイクボール->ドノマンティス (340.6)
- planner selected: attack:ピグミィ:スパイクボール->ドノマンティス (181.7)
- root gap to fallback: 233.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:cpu-front-right:ドノマンティスLv1HP3(act1/1); targetAfter:ドノマンティスLv1HP2(act1/1); attackerAfter:ピグミィLv2HP3(act1/2) | 107.1 | 181.7 | 158.1 | 200.4 | 118 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:cpu-front-right:ドノマンティスLv1HP3(act1/1); targetAfter:ドノマンティスLv1HP2(act1/1); attackerAfter:ピグミィLv1HP3(act1/2) | 107.1 | 181.7 | 158.1 | 200.4 | 118 | - | - | - |
| 3 |  |  |  | master:master_attack->monster:cpu_front_right | - | 28.3 | 164.3 | 158.1 | 200.4 | 118 | - | - | - |
| 4 |  |  |  | end_turn | - | -97.6 | -70.9 | 12.9 | 67.4 | -41.6 | - | - | - |

### seed 994333 / challenger-as-player / step 69 / turn 6

- elapsed: 805.4ms / inspection 816.2ms
- state: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/1 / deck player/cpu 20/20 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP1 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 shield
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->ドノマンティス
- fallback: attack:ピグミィ:スパイクボール->ドノマンティス (369.4)
- planner selected: attack:ピグミィ:スパイクボール->ドノマンティス (245.6)
- root gap to fallback: -41.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:cpu-front-right:ドノマンティスLv1HP1(act1/1); targetAfter:empty; attackerAfter:ピグミィLv1HP3(act2/2) | 411.1 | 245.6 | 206 | 206 | 206 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:cpu_front_right | - | 327.1 | 208.8 | 171.2 | 206.4 | 136 | - | - | - |
| 3 |  |  |  | focus:ピグミィ | - | 181.4 | 129.9 | 165.2 | 194.4 | 136 | - | - | - |
| 4 |  |  |  | end_turn | - | -77.3 | -184.3 | 36.9 | 85.4 | -11.6 | - | - | - |

### seed 994333 / challenger-as-player / step 72 / turn 6

- elapsed: 129.9ms / inspection 129.5ms
- state: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 0/2 / deck player/cpu 20/20 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 focus | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 shield | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 shield
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-304.2)
- planner selected: end_turn (-0.1)
- root gap to fallback: -234.6
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -69.6 | -0.1 | 15.2 | 59.4 | -25 | - | - | - |

### seed 994333 / challenger-as-player / step 82 / turn 7

- elapsed: 4960.9ms / inspection 4966.3ms
- state: turn 7 / current player / HP player/cpu 10/10 / stones player/cpu 4/1 / deck player/cpu 19/19 / hand player/cpu 5/4
- board: player_front_left:PF:ピグミィ Lv2 HP3 act0/2 focus | player_front_right:PF:ドノマンティス Lv1 HP4 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ピグミィ Lv2 HP3 act2/2 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 focus
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->ピグミィ
- fallback: attack:ピグミィ:スパイクボール->ピグミィ (681.1)
- planner selected: attack:ピグミィ:スパイクボール->ピグミィ (364.6)
- root gap to fallback: 126.1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ピグミィ | attackTarget:cpu-front-right:ピグミィLv2HP3(act2/2); targetAfter:ピグミィLv2HP2(act2/2); attackerAfter:ピグミィLv2HP3(act1/2) | 555.1 | 364.6 | 325 | 335.8 | 314.2 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->ピグミィ | attackTarget:cpu-front-right:ピグミィLv2HP3(act2/2); targetAfter:ピグミィLv2HP2(act2/2); attackerAfter:ピグミィLv2HP3(act1/2) | 115.8 | 161.8 | 316 | 317.8 | 314.2 | - | - | - |
| 3 |  |  |  | summon:ボムゾウ->player_back_left | summon:ボムゾウ->back-left; backlineReach; behindOwnFront:ピグミィLv2HP3(act0/2,focus); sameLaneEnemyFront:ボムゾウLv1HP6(act1/1,focus); after:prepared | 87.8 | 150.7 | 325 | 335.8 | 314.2 | - | - | - |
| 4 |  |  |  | attack:ドノマンティス:attack->ピグミィ | attackTarget:cpu-front-right:ピグミィLv2HP3(act2/2); targetAfter:ピグミィLv2HP1(act2/2); attackerAfter:ドノマンティスLv1HP4(act1/1) | 173.4 | 149.3 | 262 | 272.8 | 251.2 | - | - | - |
| 5 |  |  |  | focus:ドノマンティス | - | 59 | 129.9 | 325 | 335.8 | 314.2 | - | - | - |
| 6 |  |  |  | end_turn | - | 7.7 | -138 | 94 | 123 | 65 | - | - | - |

### seed 994333 / challenger-as-player / step 86 / turn 7

- elapsed: 2702.3ms / inspection 2704.8ms
- state: turn 7 / current player / HP player/cpu 10/10 / stones player/cpu 3/3 / deck player/cpu 19/19 / hand player/cpu 5/4
- board: player_front_left:PF:ピグミィ Lv2 HP3 act1/2 | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 focus
- rolloutTriggered: false, adopted: true
- decision: summon:ボムゾウ->player_back_left
- fallback: summon:ボムゾウ->player_back_left (107.7)
- planner selected: summon:ボムゾウ->player_back_left (159.3)
- root gap to fallback: 19.9
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ボムゾウ->player_back_left | summon:ボムゾウ->back-left; backlineReach; behindOwnFront:ピグミィLv2HP3(act1/2); sameLaneEnemyFront:ボムゾウLv1HP6(act1/1); after:prepared | 87.8 | 159.3 | 140 | 150.8 | 129.2 | - | - | - |
| 2 |  |  |  | summon:ポリスピナー->player_back_left | summon:ポリスピナー->back-left; noBacklineReach; behindOwnFront:ピグミィLv2HP3(act1/2); sameLaneEnemyFront:ボムゾウLv1HP6(act1/1); after:prepared | 80 | 143.2 | 125.6 | 140 | 111.2 | - | - | - |
| 3 |  |  |  | focus:ピグミィ | - | 32 | 138 | 131 | 142.8 | 119.2 | - | - | - |
| 4 |  |  |  | focus:ピグミィ | - | 32 | 138 | 131 | 142.8 | 119.2 | - | - | - |
| 5 |  |  |  | move:player_front_left->player_back_left | move:player-front-left->player-back-left; mover:ピグミィLv2HP3(act1/2) | 46 | 135.1 | 125 | 132.8 | 117.2 | - | - | - |
| 6 |  |  |  | end_turn | - | -6 | 49.4 | 57.6 | 91 | 24.2 | - | - | - |

### seed 994333 / challenger-as-player / step 95 / turn 8

- elapsed: 2652.9ms / inspection 2629.6ms
- state: turn 8 / current player / HP player/cpu 10/10 / stones player/cpu 7/2 / deck player/cpu 18/18 / hand player/cpu 5/4
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv2 HP4 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 prep | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 shield
- rolloutTriggered: false, adopted: true
- decision: attack:ドノマンティス:呪いの刃->cpu master
- fallback: attack:ドノマンティス:呪いの刃->cpu master (449.4)
- planner selected: attack:ドノマンティス:呪いの刃->cpu master (331)
- root gap to fallback: 126.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ドノマンティス:呪いの刃->cpu master | masterHp:cpu:10->8 | 322.6 | 331 | 291.4 | 308.8 | 274 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->ボムゾウ | attackTarget:cpu-front-left:ボムゾウLv2HP5(act1/1); targetAfter:ボムゾウLv2HP4(act1/1); attackerAfter:ピグミィLv2HP3(act1/2) | 183.9 | 301.6 | 291.4 | 308.8 | 274 | - | - | - |
| 3 |  |  |  | summon:ポリスピナー->player_back_left | summon:ポリスピナー->back-left; noBacklineReach; behindOwnFront:ボムゾウLv1HP6(act0/1); sameLaneEnemyFront:ボムゾウLv2HP5(act1/1); after:prepared | 80 | 227.7 | 291.4 | 308.8 | 274 | - | - | - |
| 4 |  |  |  | attack:ボムゾウ:storm_bomb->ヤンバル | attackTarget:cpu-back-left:ヤンバルLv1HP3(act1/1); targetAfter:ヤンバルLv1HP2(act1/1); attackerAfter:ボムゾウLv1HP6(act1/1) | 19 | -75.2 | 32.4 | 181.8 | 159 | - | - | - |
| 5 |  |  |  | end_turn | - | -76.8 | -108.8 | 67.8 | 111.8 | 23.8 | - | - | - |

### seed 994333 / challenger-as-player / step 98 / turn 8

- elapsed: 1432.7ms / inspection 1438.1ms
- state: turn 8 / current player / HP player/cpu 10/8 / stones player/cpu 3/4 / deck player/cpu 18/18 / hand player/cpu 5/4
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv2 HP4 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act1/2 | cpu_front_left:CF:ボムゾウ Lv2 HP2 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 prep | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 shield
- rolloutTriggered: false, adopted: true
- decision: attack:ボムゾウ:self_bomb->ボムゾウ
- fallback: attack:ピグミィ:スパイクボール->ボムゾウ (728.7)
- planner selected: attack:ボムゾウ:self_bomb->ボムゾウ (167.6)
- root gap to fallback: 60.6
- planner margin to fallback: 211.5

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y |  | attack:ボムゾウ:self_bomb->ボムゾウ | attackTarget:cpu-front-left:ボムゾウLv2HP2(act1/1); targetAfter:empty; attackerAfter:ボムゾウLv1HP4(act1/1) | 668.2 | 167.6 | 128 | 128 | 128 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:cpu_front_left | - | 446.2 | 140.8 | 172.2 | 216.8 | 132 | - | - | - |
| 3 |  |  |  | summon:ポリスピナー->player_back_left | summon:ポリスピナー->back-left; noBacklineReach; behindOwnFront:ボムゾウLv1HP6(act0/1); sameLaneEnemyFront:ボムゾウLv2HP2(act1/1); after:prepared | 80 | -3.5 | 233 | 233 | 233 | - | - | - |
| 4 |  |  | Y | attack:ピグミィ:スパイクボール->ボムゾウ | attackTarget:cpu-front-left:ボムゾウLv2HP2(act1/1); targetAfter:ボムゾウLv2HP1(act1/1); attackerAfter:ピグミィLv2HP3(act2/2) | 496.3 | -43.9 | -37.6 | 136.8 | 64 | - | - | - |
| 5 |  |  |  | focus:ピグミィ | - | 32 | -102.6 | 168.4 | 204.8 | 132 | - | - | - |
| 6 |  |  |  | end_turn | - | -73.3 | -355.8 | -8.9 | 51.8 | -69.2 | - | - | - |

### seed 994333 / challenger-as-player / step 101 / turn 8

- elapsed: 555.9ms / inspection 564.3ms
- state: turn 8 / current player / HP player/cpu 10/8 / stones player/cpu 2/6 / deck player/cpu 18/18 / hand player/cpu 5/4
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 | player_front_right:PF:ドノマンティス Lv2 HP4 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 focus | cpu_front_right:CF:デスシープ Lv1 HP6 prep | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 shield
- rolloutTriggered: false, adopted: true
- decision: summon:ポリスピナー->player_back_left
- fallback: summon:ポリスピナー->player_back_left (10.8)
- planner selected: summon:ポリスピナー->player_back_left (37.7)
- root gap to fallback: -63.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ポリスピナー->player_back_left | summon:ポリスピナー->back-left; noBacklineReach; behindOwnFront:ボムゾウLv2HP5(act1/1); after:prepared | 74 | 37.7 | 21.4 | 32.8 | 10 | - | - | - |
| 2 |  |  |  | master:shield->monster:player_front_right | - | 125.4 | -19.1 | -46.7 | -0.2 | -87 | - | - | - |
| 3 |  |  |  | master:shield->monster:player_front_left | - | 60.4 | -33.4 | -46.7 | -0.2 | -87 | - | - | - |
| 4 |  |  |  | end_turn | - | -71.2 | -120.5 | -46.6 | -16.2 | -77 | - | - | - |

### seed 994333 / challenger-as-player / step 102 / turn 8

- elapsed: 148.4ms / inspection 151.5ms
- state: turn 8 / current player / HP player/cpu 10/8 / stones player/cpu 1/6 / deck player/cpu 18/18 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 | player_front_right:PF:ドノマンティス Lv2 HP4 act1/1 | player_back_left:PB:ポリスピナー Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 focus | cpu_front_right:CF:デスシープ Lv1 HP6 prep | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 shield
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-275.6)
- planner selected: end_turn (-43.3)
- root gap to fallback: -204.4
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -71.2 | -43.3 | -27.6 | -16.2 | -39 | - | - | - |

### seed 994333 / challenger-as-player / step 109 / turn 9

- elapsed: 2670.8ms / inspection 2682.4ms
- state: turn 9 / current player / HP player/cpu 10/8 / stones player/cpu 6/7 / deck player/cpu 17/17 / hand player/cpu 5/4
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus | player_back_left:PB:ポリスピナー Lv1 HP3 act0/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 prep | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: magic:ローテーション->master:player
- fallback: magic:ローテーション->master:player (470.7)
- planner selected: magic:ローテーション->master:player (316.7)
- root gap to fallback: 293.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | magic:ローテーション->master:player | - | 177 | 316.7 | 277.8 | 297.6 | 258 | - | - | - |
| 2 |  |  |  | summon:ボムゾウ->player_back_right | summon:ボムゾウ->back-right; backlineReach; behindOwnFront:ピグミィLv2HP3(act0/2,focus); sameLaneEnemyFront:デスシープLv2HP6(act1/1); after:prepared | 87.8 | 306.5 | 291.8 | 291.8 | 291.8 | - | - | - |
| 3 |  |  |  | move:player_front_right->player_back_right | move:player-front-right->player-back-right; mover:ピグミィLv2HP3(act0/2,focus) | 54.5 | 243.4 | 252.7 | 257.6 | 247.8 | - | - | - |
| 4 |  |  |  | focus:ポリスピナー | - | -16 | 231.8 | 291.8 | 291.8 | 291.8 | - | - | - |
| 5 |  |  |  | move:player_back_left->player_front_right | move:player-back-left->player-front-right; mover:ポリスピナーLv1HP3(act0/2) | 104 | 47.6 | 24.7 | 47.6 | 1.8 | - | - | - |
| 6 |  |  |  | end_turn | - | -79.5 | -67 | 38.8 | 91.8 | -14.2 | - | - | - |

### seed 994333 / challenger-as-player / step 111 / turn 9

- elapsed: 1838.9ms / inspection 1827.2ms
- state: turn 9 / current player / HP player/cpu 10/8 / stones player/cpu 2/7 / deck player/cpu 17/17 / hand player/cpu 3/4
- board: player_front_left:PF:ポリスピナー Lv1 HP3 act0/2 | player_front_right:PF:ボムゾウ Lv2 HP5 act0/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 prep | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:デスシープ Lv2 HP6 act1/1
- rolloutTriggered: false, adopted: true
- decision: attack:ボムゾウ:storm_bomb->ピグミィ
- fallback: attack:ボムゾウ:storm_bomb->ピグミィ (64.1)
- planner selected: attack:ボムゾウ:storm_bomb->ピグミィ (240.8)
- root gap to fallback: -14.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ボムゾウ:storm_bomb->ピグミィ | attackTarget:cpu-back-left:ピグミィLv2HP3(act2/2); targetAfter:ピグミィLv2HP1(act2/2); attackerAfter:ボムゾウLv2HP5(act1/1) | 78.6 | 240.8 | 248.6 | 285 | 212.2 | - | - | - |
| 2 |  |  |  | attack:ボムゾウ:storm_bomb->ヤンバル | attackTarget:cpu-front-left:ヤンバルLv1HP3(act1/1); targetAfter:ヤンバルLv1HP1(act1/1); attackerAfter:ボムゾウLv2HP5(act1/1) | 165.2 | 170.3 | 134 | 134 | 134 | - | - | - |
| 3 |  |  |  | attack:ポリスピナー:attack->ヤンバル | attackTarget:cpu-front-left:ヤンバルLv1HP3(act1/1); targetAfter:ヤンバルLv1HP1(act1/1); attackerAfter:ポリスピナーLv1HP3(act1/2) | 177.2 | 159 | 120 | 139.8 | 100.2 | - | - | - |
| 4 |  |  |  | attack:ピグミィ:スパイクボール->ヤンバル | attackTarget:cpu-front-left:ヤンバルLv1HP3(act1/1); targetAfter:ヤンバルLv1HP2(act1/1); attackerAfter:ピグミィLv2HP3(act1/2) | 208.9 | 153.6 | 114 | 133.8 | 94.2 | - | - | - |
| 5 |  |  |  | focus:ポリスピナー | - | 22.6 | 85.8 | 134 | 134 | 134 | - | - | - |
| 6 |  |  |  | end_turn | - | -31.2 | 8 | 94.9 | 99.8 | 90 | - | - | - |

### seed 994333 / challenger-as-player / step 112 / turn 9

- elapsed: 651.2ms / inspection 650.4ms
- state: turn 9 / current player / HP player/cpu 10/8 / stones player/cpu 2/7 / deck player/cpu 17/17 / hand player/cpu 3/4
- board: player_front_left:PF:ポリスピナー Lv1 HP3 act0/2 | player_front_right:PF:ボムゾウ Lv2 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 prep | cpu_back_left:CB:ピグミィ Lv2 HP1 act2/2 | cpu_back_right:CB:デスシープ Lv2 HP6 act1/1
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->ピグミィ
- fallback: attack:ピグミィ:スパイクボール->ピグミィ (805.9)
- planner selected: attack:ピグミィ:スパイクボール->ピグミィ (288.2)
- root gap to fallback: 274.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ピグミィ | attackTarget:cpu-back-left:ピグミィLv2HP1(act2/2); targetAfter:empty; attackerAfter:ピグミィLv2HP3(act1/2) | 531.2 | 288.2 | 248.6 | 285 | 212.2 | - | - | - |
| 2 |  |  |  | attack:ポリスピナー:attack->ヤンバル | attackTarget:cpu-front-left:ヤンバルLv1HP3(act1/1); targetAfter:ヤンバルLv1HP1(act1/1); attackerAfter:ポリスピナーLv1HP3(act1/2) | 155 | 134.6 | 248.6 | 285 | 212.2 | - | - | - |
| 3 |  |  |  | attack:ピグミィ:スパイクボール->ヤンバル | attackTarget:cpu-front-left:ヤンバルLv1HP3(act1/1); targetAfter:ヤンバルLv1HP2(act1/1); attackerAfter:ピグミィLv2HP3(act1/2) | 186.2 | 89.1 | 182 | 182 | 182 | - | - | - |
| 4 |  |  |  | focus:ポリスピナー | - | 71.4 | 7.9 | 182 | 182 | 182 | - | - | - |
| 5 |  |  |  | end_turn | - | -76.4 | -257.7 | 22.9 | 21.8 | 24 | - | - | - |

### seed 994333 / challenger-as-player / step 114 / turn 9

- elapsed: 86ms / inspection 85.5ms
- state: turn 9 / current player / HP player/cpu 10/8 / stones player/cpu 2/9 / deck player/cpu 17/17 / hand player/cpu 3/4
- board: player_front_left:PF:ポリスピナー Lv1 HP3 act0/2 | player_front_right:PF:ボムゾウ Lv2 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ヤンバル Lv1 HP2 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 prep | cpu_back_right:CB:デスシープ Lv2 HP6 act1/1
- rolloutTriggered: false, adopted: true
- decision: attack:ポリスピナー:attack->ヤンバル
- fallback: attack:ポリスピナー:attack->ヤンバル (541.9)
- planner selected: attack:ポリスピナー:attack->ヤンバル (107.6)
- root gap to fallback: -7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ポリスピナー:attack->ヤンバル | attackTarget:cpu-front-left:ヤンバルLv1HP2(act1/1); targetAfter:empty; attackerAfter:ポリスピナーLv1HP3(act1/2) | 548.9 | 107.6 | 68 | 68 | 68 | - | - | - |
| 2 |  |  |  | focus:ポリスピナー | - | 56 | -138.1 | 56 | 56 | 56 | - | - | - |
| 3 |  |  |  | end_turn | - | -79.8 | -321.9 | -30 | -16.2 | -43.8 | - | - | - |

### seed 994333 / challenger-as-player / step 116 / turn 9

- elapsed: 124.9ms / inspection 124.8ms
- state: turn 9 / current player / HP player/cpu 10/8 / stones player/cpu 1/10 / deck player/cpu 17/17 / hand player/cpu 3/4
- board: player_front_left:PF:ポリスピナー Lv2 HP3 act1/2 | player_front_right:PF:ボムゾウ Lv2 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 prep | cpu_back_right:CB:デスシープ Lv2 HP6 act1/1
- rolloutTriggered: false, adopted: true
- decision: attack:ポリスピナー:attack->cpu master
- fallback: attack:ポリスピナー:attack->cpu master (78.6)
- planner selected: attack:ポリスピナー:attack->cpu master (16.3)
- root gap to fallback: -77.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ポリスピナー:attack->cpu master | masterHp:cpu:8->7 | 155.8 | 16.3 | -18 | -13.2 | -22.8 | - | - | - |
| 2 |  |  |  | end_turn | - | -62 | -97.5 | -15 | -4.2 | -25.8 | - | - | - |

### seed 994333 / challenger-as-player / step 117 / turn 9

- elapsed: 45.8ms / inspection 44.7ms
- state: turn 9 / current player / HP player/cpu 10/7 / stones player/cpu 1/11 / deck player/cpu 17/17 / hand player/cpu 3/4
- board: player_front_left:PF:ポリスピナー Lv2 HP3 act2/2 | player_front_right:PF:ボムゾウ Lv2 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 prep | cpu_back_right:CB:デスシープ Lv2 HP6 act1/1
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-288.6)
- planner selected: end_turn (-109.8)
- root gap to fallback: -201.4
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -87.2 | -109.8 | -87 | -82.2 | -91.8 | - | - | - |

### seed 994333 / challenger-as-player / step 129 / turn 10

- elapsed: 1003.7ms / inspection 1009.5ms
- state: turn 10 / current player / HP player/cpu 9/7 / stones player/cpu 9/0 / deck player/cpu 16/16 / hand player/cpu 4/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:デスシープ Lv2 HP6 act1/1 focus
- rolloutTriggered: false, adopted: true
- decision: move:player_front_right->player_back_left
- fallback: move:player_front_right->player_back_left (638.5)
- planner selected: move:player_front_right->player_back_left (152.8)
- root gap to fallback: 500
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | move:player_front_right->player_back_left | move:player-front-right->player-back-left; mover:ピグミィLv2HP3(act0/2); fallbackMove:player-front-right->player-back-left:keepsTo | 138.5 | 152.8 | 138 | 138 | 138 | - | - | - |
| 2 |  |  |  | focus:ボムゾウ | fallbackMove:player-front-right->player-back-left:keepsTo | 249.9 | 152.4 | 112.8 | 140.8 | 84.8 | - | - | - |
| 3 |  |  |  | attack:ピグミィ:スパイクボール->ポリスピナー | attackTarget:cpu-front-left:ポリスピナーLv2HP3(act2/2); targetAfter:ポリスピナーLv2HP2(act2/2); attackerAfter:ピグミィLv2HP3(act1/2); fallbackMove:player-front-right->player-back-left:keepsTo | 157.8 | 147.5 | 118.8 | 152.8 | 84.8 | - | - | - |
| 4 |  |  |  | attack:ボムゾウ:self_bomb->ポリスピナー | attackTarget:cpu-front-left:ポリスピナーLv2HP3(act2/2); targetAfter:ポリスピナーLv2HP1(act2/2); attackerAfter:ボムゾウLv1HP4(act1/1); fallbackMove:player-front-right->player-back-left:keepsTo | 164.1 | 102.1 | 68.8 | 96.8 | 40.8 | - | - | - |
| 5 |  |  |  | focus:ピグミィ | fallbackMove:player-front-right->player-back-left:keepsTo | 44 | -6.4 | 46.8 | 68.8 | 24.8 | - | - | - |
| 6 |  |  |  | end_turn | fallbackMove:player-front-right->player-back-left:keepsTo | -30.8 | -126.3 | -19.2 | 39.8 | -78.2 | - | - | - |

### seed 994333 / challenger-as-player / step 130 / turn 10

- elapsed: 492ms / inspection 496.4ms
- state: turn 10 / current player / HP player/cpu 9/7 / stones player/cpu 9/0 / deck player/cpu 16/16 / hand player/cpu 4/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act1/2 | cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:デスシープ Lv2 HP6 act1/1 focus
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->ポリスピナー
- fallback: attack:ピグミィ:スパイクボール->ポリスピナー (893.9)
- planner selected: attack:ピグミィ:スパイクボール->ポリスピナー (139.6)
- root gap to fallback: 348.1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ポリスピナー | attackTarget:cpu-front-left:ポリスピナーLv2HP3(act2/2); targetAfter:ポリスピナーLv2HP2(act2/2); attackerAfter:ピグミィLv2HP3(act2/2) | 545.8 | 139.6 | 100 | 100 | 100 | - | - | - |
| 2 |  |  |  | attack:ボムゾウ:self_bomb->ポリスピナー | attackTarget:cpu-front-left:ポリスピナーLv2HP3(act2/2); targetAfter:ポリスピナーLv2HP1(act2/2); attackerAfter:ボムゾウLv1HP4(act1/1) | 164.1 | -83.9 | 30.8 | 58.8 | 2.8 | - | - | - |
| 3 |  |  |  | attack:ボムゾウ:storm_bomb->真勇者ダイン | attackTarget:cpu-front-right:真勇者ダインLv1HP6(act1/1); targetAfter:真勇者ダインLv1HP5(act1/1); attackerAfter:ボムゾウLv1HP6(act1/1) | 89 | -141 | 27.8 | 49.8 | 5.8 | - | - | - |
| 4 |  |  |  | focus:ボムゾウ | - | 59.9 | -143 | 46.8 | 68.8 | 24.8 | - | - | - |
| 5 |  |  |  | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:cpu-front-right:真勇者ダインLv1HP6(act1/1); targetAfter:真勇者ダインLv1HP5(act1/1); attackerAfter:ピグミィLv2HP3(act2/2) | 91 | -201.6 | -34.2 | -12.2 | -56.2 | - | - | - |
| 6 |  |  |  | end_turn | - | -30.8 | -266.3 | -11.2 | 47.8 | -70.2 | - | - | - |

### seed 994333 / challenger-as-player / step 131 / turn 10

- elapsed: 158ms / inspection 160.9ms
- state: turn 10 / current player / HP player/cpu 9/7 / stones player/cpu 9/0 / deck player/cpu 16/16 / hand player/cpu 4/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ポリスピナー Lv2 HP2 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:デスシープ Lv2 HP6 act1/1 focus
- rolloutTriggered: false, adopted: true
- decision: attack:ボムゾウ:self_bomb->ポリスピナー
- fallback: attack:ボムゾウ:self_bomb->ポリスピナー (718.5)
- planner selected: attack:ボムゾウ:self_bomb->ポリスピナー (145.6)
- root gap to fallback: 72.3
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ボムゾウ:self_bomb->ポリスピナー | attackTarget:cpu-front-left:ポリスピナーLv2HP2(act2/2); targetAfter:empty; attackerAfter:ボムゾウLv1HP4(act1/1) | 646.2 | 145.6 | 106 | 106 | 106 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:cpu_front_left | - | 424.2 | 27.4 | 58.8 | 86.8 | 30.8 | - | - | - |
| 3 |  |  |  | focus:ボムゾウ | - | 8.8 | -223.9 | 52.8 | 74.8 | 30.8 | - | - | - |
| 4 |  |  |  | attack:ボムゾウ:storm_bomb->真勇者ダイン | attackTarget:cpu-front-right:真勇者ダインLv1HP6(act1/1); targetAfter:真勇者ダインLv1HP5(act1/1); attackerAfter:ボムゾウLv1HP6(act1/1) | 55.8 | -262.1 | -19.2 | 2.8 | -41.2 | - | - | - |
| 5 |  |  |  | end_turn | - | -98.3 | -427.1 | -73.2 | -20.2 | -126.2 | - | - | - |

### seed 994333 / challenger-as-player / step 135 / turn 10

- elapsed: 32.9ms / inspection 34.2ms
- state: turn 10 / current player / HP player/cpu 9/7 / stones player/cpu 2/2 / deck player/cpu 16/16 / hand player/cpu 4/3
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP2 act1/1 | cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:デスシープ Lv2 HP6 act1/1 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-437.6)
- planner selected: end_turn (-170.4)
- root gap to fallback: -323.4
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -114.2 | -170.4 | -128.2 | -106.2 | -150.2 | - | - | - |

### seed 994333 / challenger-as-player / step 139 / turn 11

- elapsed: 485.1ms / inspection 482.7ms
- state: turn 11 / current player / HP player/cpu 9/7 / stones player/cpu 5/5 / deck player/cpu 15/15 / hand player/cpu 5/4
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP2 act1/1 focus | cpu_back_right:CB:デスシープ Lv2 HP6 act0/1 focus
- rolloutTriggered: false, adopted: true
- decision: summon:ポリスピナー->player_front_right
- fallback: summon:ポリスピナー->player_front_right (184.1)
- planner selected: summon:ポリスピナー->player_front_right (298.8)
- root gap to fallback: 62.1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ポリスピナー->player_front_right | summon:ポリスピナー->front-right; noBacklineReach; sameLaneEnemyFront:真勇者ダインLv1HP2(act1/1,focus); after:prepared | 122 | 298.8 | 272 | 298 | 246 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:cpu-front-right:真勇者ダインLv1HP2(act1/1,focus); targetAfter:真勇者ダインLv1HP2(act1/1); attackerAfter:ピグミィLv2HP3(act1/2) | 84.5 | 290.6 | 272 | 298 | 246 | - | - | - |
| 3 |  |  |  | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP6(act1/1,focus); targetAfter:デスシープLv1HP6(act1/1); attackerAfter:ピグミィLv2HP3(act1/2) | 84.5 | 226.6 | 208 | 236 | 180 | - | - | - |
| 4 |  |  |  | end_turn | - | -14.3 | 56.7 | 88 | 105 | 71 | - | - | - |

### seed 994333 / challenger-as-player / step 141 / turn 11

- elapsed: 415.2ms / inspection 426.8ms
- state: turn 11 / current player / HP player/cpu 9/7 / stones player/cpu 4/5 / deck player/cpu 15/15 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP2 act1/1 focus | cpu_back_right:CB:デスシープ Lv2 HP6 act0/1 focus
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->真勇者ダイン
- fallback: attack:ピグミィ:スパイクボール->真勇者ダイン (499.3)
- planner selected: attack:ピグミィ:スパイクボール->真勇者ダイン (281)
- root gap to fallback: 412.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:cpu-front-right:真勇者ダインLv1HP2(act1/1,focus); targetAfter:真勇者ダインLv1HP2(act1/1); attackerAfter:ピグミィLv2HP3(act1/2) | 86.5 | 281 | 262 | 262 | 262 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP6(act1/1,focus); targetAfter:デスシープLv1HP6(act1/1); attackerAfter:ピグミィLv2HP3(act1/2) | 86.5 | 231 | 212 | 212 | 212 | - | - | - |
| 3 |  |  |  | focus:ピグミィ | - | 44 | 203.7 | 194 | 194 | 194 | - | - | - |
| 4 |  |  |  | end_turn | - | -39.5 | 67.3 | 99 | 87 | 111 | - | - | - |

### seed 994333 / challenger-as-player / step 142 / turn 11

- elapsed: 249ms / inspection 238.1ms
- state: turn 11 / current player / HP player/cpu 9/7 / stones player/cpu 4/5 / deck player/cpu 15/15 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_left:PB:ピグミィ Lv2 HP3 act1/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP2 act1/1 | cpu_back_right:CB:デスシープ Lv2 HP6 act0/1 focus
- rolloutTriggered: false, adopted: true
- decision: master:wake_up->monster:player_front_right
- fallback: master:wake_up->monster:player_front_right (600.8)
- planner selected: master:wake_up->monster:player_front_right (220.6)
- root gap to fallback: 229
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | master:wake_up->monster:player_front_right | - | 371.8 | 220.6 | 181 | 201 | 161 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:cpu_front_right | - | 392 | 167.1 | 127.5 | 156 | 99 | - | - | - |
| 3 |  |  |  | focus:ピグミィ | - | 30 | 109.6 | 244 | 244 | 244 | - | - | - |
| 4 |  |  |  | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP6(act1/1,focus); targetAfter:デスシープLv1HP6(act1/1); attackerAfter:ピグミィLv2HP3(act2/2) | 67.5 | 86.6 | 194 | 194 | 194 | - | - | - |
| 5 |  |  |  | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:cpu-front-right:真勇者ダインLv1HP2(act1/1); targetAfter:真勇者ダインLv1HP1(act1/1); attackerAfter:ピグミィLv2HP3(act2/2) | 89 | 84.1 | 176 | 176 | 176 | - | - | - |
| 6 |  |  |  | end_turn | - | -39.5 | -94.5 | 90 | 87 | 93 | - | - | - |

### seed 994333 / challenger-as-player / step 143 / turn 11

- elapsed: 122.4ms / inspection 124.8ms
- state: turn 11 / current player / HP player/cpu 9/7 / stones player/cpu 2/5 / deck player/cpu 15/15 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_left:PB:ピグミィ Lv2 HP3 act1/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP2 act1/1 | cpu_back_right:CB:デスシープ Lv2 HP6 act0/1 focus
- rolloutTriggered: false, adopted: true
- decision: attack:ポリスピナー:attack->真勇者ダイン
- fallback: attack:ポリスピナー:attack->真勇者ダイン (582.9)
- planner selected: attack:ポリスピナー:attack->真勇者ダイン (191.6)
- root gap to fallback: -11.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ポリスピナー:attack->真勇者ダイン | attackTarget:cpu-front-right:真勇者ダインLv1HP2(act1/1); targetAfter:empty; attackerAfter:ポリスピナーLv1HP3(act1/2) | 594.1 | 191.6 | 152 | 152 | 152 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:cpu-front-right:真勇者ダインLv1HP2(act1/1); targetAfter:真勇者ダインLv1HP1(act1/1); attackerAfter:ピグミィLv2HP3(act2/2) | 176.3 | 9.9 | 140 | 140 | 140 | - | - | - |
| 3 |  |  |  | focus:ピグミィ | - | 32 | -26 | 208 | 208 | 208 | - | - | - |
| 4 |  |  |  | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP6(act1/1,focus); targetAfter:デスシープLv1HP6(act1/1); attackerAfter:ピグミィLv2HP3(act2/2) | 69.5 | -49 | 158 | 158 | 158 | - | - | - |
| 5 |  |  |  | focus:ポリスピナー | - | 56 | -71.8 | 145 | 165 | 125 | - | - | - |
| 6 |  |  |  | end_turn | - | -20.1 | -126.6 | 145 | 165 | 125 | - | - | - |

### seed 994333 / challenger-as-player / step 145 / turn 11

- elapsed: 245.9ms / inspection 214.2ms
- state: turn 11 / current player / HP player/cpu 9/7 / stones player/cpu 1/6 / deck player/cpu 15/15 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 focus | player_front_right:PF:ポリスピナー Lv2 HP3 act1/2 | player_back_left:PB:ピグミィ Lv2 HP3 act1/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_back_right:CB:デスシープ Lv2 HP6 act0/1 focus
- rolloutTriggered: false, adopted: true
- decision: attack:ポリスピナー:attack->cpu master
- fallback: attack:ポリスピナー:attack->cpu master (90.6)
- planner selected: attack:ポリスピナー:attack->cpu master (134)
- root gap to fallback: -65.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ポリスピナー:attack->cpu master | masterHp:cpu:7->6 | 155.8 | 134 | 99.8 | 148 | 57 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP6(act1/1,focus); targetAfter:デスシープLv1HP6(act1/1); attackerAfter:ピグミィLv2HP3(act2/2) | 69.5 | -15.9 | -28 | 95 | -78 | - | - | - |
| 3 |  |  |  | end_turn | - | -79 | -54.8 | 40 | 157 | -10 | - | - | - |

### seed 994333 / challenger-as-player / step 147 / turn 11

- elapsed: 41.6ms / inspection 42.1ms
- state: turn 11 / current player / HP player/cpu 9/6 / stones player/cpu 1/7 / deck player/cpu 15/15 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 focus | player_front_right:PF:ポリスピナー Lv2 HP3 act2/2 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_back_right:CB:デスシープ Lv2 HP6 act0/1 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-503.8)
- planner selected: end_turn (-86.2)
- root gap to fallback: -386.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -117.4 | -86.2 | -41.7 | 11 | -86 | - | - | - |

### seed 994333 / challenger-as-player / step 155 / turn 12

- elapsed: 707.6ms / inspection 618.3ms
- state: turn 12 / current player / HP player/cpu 9/6 / stones player/cpu 8/1 / deck player/cpu 14/14 / hand player/cpu 5/4
- board: player_front_left:PF:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 shield | cpu_back_left:CB:ポリスピナー Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: move:player_front_left->player_back_left
- fallback: move:player_front_left->player_back_left (-98)
- planner selected: move:player_front_left->player_back_left (-20.1)
- root gap to fallback: -183.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | move:player_front_left->player_back_left | move:player-front-left->player-back-left; mover:ピグミィLv2HP3(act0/2); fallbackMove:player-front-left->player-back-left:keepsTo | 85.8 | -20.1 | -39 | 17 | -95 | - | - | - |
| 2 |  |  |  | move:player_front_left->player_back_right | move:player-front-left->player-back-right; mover:ピグミィLv2HP3(act0/2); fallbackMove:player-front-left->player-back-left:keepsTo | 85.8 | -20.1 | -39 | 17 | -95 | - | - | - |
| 3 |  |  |  | focus:ピグミィ | fallbackMove:player-front-left->player-back-left:keepsTo | 46 | -40.9 | -51 | -7 | -95 | - | - | - |
| 4 |  |  |  | end_turn | fallbackMove:player-front-left->player-back-left:keepsTo | -66.1 | -101.5 | -51 | -7 | -95 | - | - | - |

### seed 994333 / challenger-as-player / step 159 / turn 12

- elapsed: 37.3ms / inspection 38.2ms
- state: turn 12 / current player / HP player/cpu 9/6 / stones player/cpu 2/1 / deck player/cpu 14/14 / hand player/cpu 5/4
- board: player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP1 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 shield | cpu_back_left:CB:ポリスピナー Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-348.6)
- planner selected: end_turn (-135)
- root gap to fallback: -262.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -86.1 | -135 | -113 | -67 | -159 | - | - | - |

### seed 994333 / challenger-as-player / step 167 / turn 13

- elapsed: 340.3ms / inspection 339.9ms
- state: turn 13 / current player / HP player/cpu 8/6 / stones player/cpu 6/1 / deck player/cpu 13/13 / hand player/cpu 6/4
- board: player_back_left:PB:ピグミィ Lv2 HP3 act1/2 | cpu_front_left:CF:デスシープ Lv1 HP1 act1/1 focus,shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act1/2 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->デスシープ
- fallback: attack:ピグミィ:スパイクボール->デスシープ (422.8)
- planner selected: attack:ピグミィ:スパイクボール->デスシープ (50.8)
- root gap to fallback: 50.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-right:デスシープLv2HP6(act1/1); targetAfter:デスシープLv2HP5(act1/1); attackerAfter:ピグミィLv2HP3(act2/2) | 372.3 | 50.8 | 11.2 | 13.6 | 8.8 | - | - | - |
| 2 |  |  |  | summon:真勇者ダイン->player_front_left | summon:真勇者ダイン->front-left; noBacklineReach; sameLaneEnemyFront:デスシープLv1HP1(act1/1,focus,shield); after:prepared | 156.8 | 45.9 | 79.2 | 87.6 | 70.8 | - | - | - |
| 3 |  |  |  | summon:真勇者ダイン->player_front_right | summon:真勇者ダイン->front-right; noBacklineReach; sameLaneEnemyFront:デスシープLv2HP6(act1/1); after:prepared | 134.8 | -3.9 | 45.2 | 65.6 | 24.8 | - | - | - |
| 4 |  |  |  | focus:ピグミィ | - | 30 | -51.4 | 73.2 | 75.6 | 70.8 | - | - | - |
| 5 |  |  |  | end_turn | - | -70.7 | -253.3 | -56.2 | -9.2 | -103.2 | - | - | - |

### seed 994333 / challenger-as-player / step 168 / turn 13

- elapsed: 270.9ms / inspection 239.2ms
- state: turn 13 / current player / HP player/cpu 8/6 / stones player/cpu 6/1 / deck player/cpu 13/13 / hand player/cpu 6/4
- board: player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP1 act1/1 focus,shield | cpu_front_right:CF:デスシープ Lv2 HP5 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act1/2 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep
- rolloutTriggered: false, adopted: true
- decision: summon:真勇者ダイン->player_front_left
- fallback: summon:真勇者ダイン->player_front_left (140.2)
- planner selected: summon:真勇者ダイン->player_front_left (51.7)
- root gap to fallback: -16.6
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:真勇者ダイン->player_front_left | summon:真勇者ダイン->front-left; noBacklineReach; sameLaneEnemyFront:デスシープLv1HP1(act1/1,focus,shield); after:prepared | 156.8 | 51.7 | 17.2 | 19.6 | 14.8 | - | - | - |
| 2 |  |  |  | summon:真勇者ダイン->player_front_right | summon:真勇者ダイン->front-right; noBacklineReach; sameLaneEnemyFront:デスシープLv2HP5(act1/1); after:prepared | 134.8 | 16.9 | -12.8 | -2.4 | -23.2 | - | - | - |
| 3 |  |  |  | summon:真勇者ダイン->player_back_right | summon:真勇者ダイン->back-right; noBacklineReach; sameLaneEnemyFront:デスシープLv2HP5(act1/1); after:prepared | 92.8 | 1.6 | -18.8 | -14.4 | -23.2 | - | - | - |
| 4 |  |  |  | end_turn | - | -88.7 | -216.5 | -114.2 | -77.2 | -151.2 | - | - | - |

### seed 994333 / challenger-as-player / step 169 / turn 13

- elapsed: 75.2ms / inspection 74ms
- state: turn 13 / current player / HP player/cpu 8/6 / stones player/cpu 5/1 / deck player/cpu 13/13 / hand player/cpu 5/4
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 prep | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP1 act1/1 focus,shield | cpu_front_right:CF:デスシープ Lv2 HP5 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act1/2 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-207.5)
- planner selected: end_turn (-101.9)
- root gap to fallback: -116.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -90.7 | -101.9 | -76.6 | -74.2 | -79 | - | - | - |

### seed 994333 / challenger-as-player / step 175 / turn 14

- elapsed: 1149.9ms / inspection 1064.4ms
- state: turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 10/2 / deck player/cpu 12/12 / hand player/cpu 6/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP1 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP5 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->デスシープ
- fallback: attack:ピグミィ:スパイクボール->デスシープ (610.6)
- planner selected: attack:ピグミィ:スパイクボール->デスシープ (216.7)
- root gap to fallback: 226.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-right:デスシープLv2HP5(act1/1); targetAfter:デスシープLv2HP4(act1/1); attackerAfter:ピグミィLv2HP3(act1/2) | 383.9 | 216.7 | 241.9 | 233.8 | 250 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:cpu_front_left | - | 359.5 | 210.5 | 247.9 | 245.8 | 250 | - | - | - |
| 3 |  |  |  | attack:真勇者ダイン:ダイン斬り->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP1(act1/1,shield); targetAfter:empty; attackerAfter:真勇者ダインLv1HP6(act1/1) | 593.5 | 125.6 | 86 | 86 | 86 | - | - | - |
| 4 |  |  |  | summon:デスシープ->player_front_right | summon:デスシープ->front-right; noBacklineReach; sameLaneEnemyFront:デスシープLv2HP5(act1/1); after:prepared | 131.8 | 86.1 | 247.9 | 245.8 | 250 | - | - | - |
| 5 |  |  |  | focus:ピグミィ | - | 44 | 16.9 | 241.9 | 239.8 | 244 | - | - | - |
| 6 |  |  |  | end_turn | - | -14 | -198.3 | 68.5 | 102 | 35 | - | - | - |

### seed 994333 / challenger-as-player / step 181 / turn 14

- elapsed: 267.7ms / inspection 260.4ms
- state: turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 5/3 / deck player/cpu 12/12 / hand player/cpu 5/5
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 prep | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:デスシープ Lv2 HP1 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus
- rolloutTriggered: false, adopted: true
- decision: master:wake_up->monster:player_front_right
- fallback: master:wake_up->monster:player_front_right (693.1)
- planner selected: master:wake_up->monster:player_front_right (182.3)
- root gap to fallback: 282.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | master:wake_up->monster:player_front_right | - | 410.4 | 182.3 | 142.7 | 161.2 | 124.2 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:cpu_front_right | - | 463 | 90.7 | 51.1 | 56 | 46.2 | - | - | - |
| 3 |  |  |  | end_turn | - | -72 | -290.3 | -46.9 | -61 | -32.8 | - | - | - |

### seed 994333 / challenger-as-player / step 182 / turn 14

- elapsed: 250.2ms / inspection 225.3ms
- state: turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 3/3 / deck player/cpu 12/12 / hand player/cpu 5/5
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:デスシープ Lv2 HP1 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus
- rolloutTriggered: false, adopted: true
- decision: attack:デスシープ:attack->デスシープ
- fallback: attack:デスシープ:attack->デスシープ (674.1)
- planner selected: attack:デスシープ:attack->デスシープ (151.6)
- root gap to fallback: 27.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:デスシープ:attack->デスシープ | attackTarget:cpu-front-right:デスシープLv2HP1(act1/1); targetAfter:empty; attackerAfter:デスシープLv1HP6(act1/1) | 646.9 | 151.6 | 112 | 112 | 112 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:cpu_front_right | - | 410.9 | 61.1 | 99.5 | 118 | 81 | - | - | - |
| 3 |  |  |  | focus:デスシープ | - | 9.3 | -183.2 | 93.5 | 106 | 81 | - | - | - |
| 4 |  |  |  | end_turn | - | -52.7 | -316.8 | 4.5 | 17 | -8 | - | - | - |

### seed 994333 / challenger-as-player / step 185 / turn 14

- elapsed: 40.9ms / inspection 40.4ms
- state: turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 0/5 / deck player/cpu 12/12 / hand player/cpu 5/5
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 shield | player_front_right:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-631.1)
- planner selected: end_turn (-98.1)
- root gap to fallback: -551
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -80 | -98.1 | -80.5 | -55 | -106 | - | - | - |

### seed 994333 / challenger-as-player / step 190 / turn 15

- elapsed: 633.8ms / inspection 472.9ms
- state: turn 15 / current player / HP player/cpu 6/6 / stones player/cpu 5/0 / deck player/cpu 11/11 / hand player/cpu 6/5
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:ポリスピナー Lv1 HP3 act0/2 focus | cpu_front_right:CF:真勇者ダイン Lv3 HP6 act1/1
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->真勇者ダイン
- fallback: attack:ピグミィ:スパイクボール->ポリスピナー (360.5)
- planner selected: attack:ピグミィ:スパイクボール->真勇者ダイン (123.6)
- root gap to fallback: -38.8
- planner margin to fallback: 136

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y |  | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:cpu-front-right:真勇者ダインLv3HP6(act1/1); targetAfter:真勇者ダインLv3HP5(act1/1); attackerAfter:ピグミィLv2HP3(act1/2) | 399.2 | 123.6 | 84 | 143 | 25 | - | - | - |
| 2 |  |  |  | attack:真勇者ダイン:ダイン斬り->ポリスピナー | attackTarget:cpu-front-left:ポリスピナーLv1HP3(act0/2,focus); targetAfter:ポリスピナーLv1HP1(act0/2); attackerAfter:真勇者ダインLv2HP6(act1/1) | 193.7 | 69.9 | 93 | 152 | 34 | - | - | - |
| 3 |  |  | Y | attack:ピグミィ:スパイクボール->ポリスピナー | attackTarget:cpu-front-left:ポリスピナーLv1HP3(act0/2,focus); targetAfter:ポリスピナーLv1HP3(act0/2); attackerAfter:ピグミィLv2HP3(act1/2) | 133.6 | -12.4 | 51 | 132 | -16 | - | - | - |
| 4 |  |  |  | end_turn | - | 42.8 | -82.3 | 46.5 | 114 | -16 | - | - | - |

### seed 994333 / challenger-as-player / step 192 / turn 15

- elapsed: 85.4ms / inspection 73.7ms
- state: turn 15 / current player / HP player/cpu 6/6 / stones player/cpu 5/0 / deck player/cpu 11/11 / hand player/cpu 6/5
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ポリスピナー Lv1 HP3 act0/2 | cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1
- rolloutTriggered: false, adopted: true
- decision: attack:真勇者ダイン:ダイン斬り->ポリスピナー
- fallback: attack:真勇者ダイン:ダイン斬り->ポリスピナー (651.8)
- planner selected: attack:真勇者ダイン:ダイン斬り->ポリスピナー (137.6)
- root gap to fallback: 27.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:真勇者ダイン:ダイン斬り->ポリスピナー | attackTarget:cpu-front-left:ポリスピナーLv1HP3(act0/2); targetAfter:empty; attackerAfter:真勇者ダインLv2HP6(act1/1) | 624.1 | 137.6 | 98 | 98 | 98 | - | - | - |
| 2 |  |  |  | end_turn | - | -26.4 | -317.1 | -26 | 46 | -90 | - | - | - |

### seed 994333 / challenger-as-player / step 194 / turn 15

- elapsed: 55.8ms / inspection 36ms
- state: turn 15 / current player / HP player/cpu 6/6 / stones player/cpu 4/1 / deck player/cpu 11/11 / hand player/cpu 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-313.6)
- planner selected: end_turn (-96.5)
- root gap to fallback: -261.1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -52.4 | -96.5 | -85 | -32 | -138 | - | - | - |

### seed 994333 / challenger-as-player / step 198 / turn 16

- elapsed: 34.7ms / inspection 31.7ms
- state: turn 16 / current player / HP player/cpu 4/6 / stones player/cpu 9/3 / deck player/cpu 10/10 / hand player/cpu 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 prep | cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1
- rolloutTriggered: false, adopted: true
- decision: attack:真勇者ダイン:ダイン斬り->cpu master
- fallback: attack:真勇者ダイン:ダイン斬り->cpu master (399.4)
- planner selected: attack:真勇者ダイン:ダイン斬り->cpu master (102.8)
- root gap to fallback: 14.9
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:真勇者ダイン:ダイン斬り->cpu master | masterHp:cpu:6->4 | 384.5 | 102.8 | 63.2 | 135.2 | -0.8 | - | - | - |
| 2 |  |  |  | end_turn | - | -56.4 | -210.7 | -17.8 | 63.2 | -84.8 | - | - | - |

### seed 994333 / challenger-as-player / step 199 / turn 16

- elapsed: 15.6ms / inspection 14ms
- state: turn 16 / current player / HP player/cpu 4/4 / stones player/cpu 9/5 / deck player/cpu 10/10 / hand player/cpu 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 prep | cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-302.4)
- planner selected: end_turn (-110.9)
- root gap to fallback: -213.3
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -89.1 | -110.9 | -86.8 | -14.8 | -150.8 | - | - | - |

### seed 994333 / challenger-as-player / step 204 / turn 17

- elapsed: 11.1ms / inspection 10.7ms
- state: turn 17 / current player / HP player/cpu 2/2 / stones player/cpu 14/8 / deck player/cpu 9/9 / hand player/cpu 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus,shield | cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-2351813.5)
- planner selected: end_turn (-750023.5)
- root gap to fallback: -2351781.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -31.8 | -750023.5 | -750016.5 | 30 | -1000072 | - | - | - |


