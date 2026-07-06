# White Rollout Trigger Audit

生成: 2026-07-06T13:02:57.893Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994324-994324
directions: challenger-as-player
baseline: `white`, challenger: `white_planner`
inspectThresholdMs: 999999
inspectTurnPlanDecisions: true

## Conclusion

- 1 games. challenger wins 0, inspected decisions 56, rollout-triggered decisions 0.
- max challenger decision 3212ms, avg challenger decision 537.2ms.
- No rollout-triggered decision was captured. Lower --inspect-threshold-ms or expand seeds before tuning.

## Games

| seed | direction | result | steps | turns | HP | decisions | avg ms | max ms | events | issue |
| ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 994324 | challenger-as-player | white | 184 | 21 | P0/C2 | 83 | 537.2 | 3212 | 56 | - |

## Events

### seed 994324 / challenger-as-player / step 0 / turn 1

- elapsed: 458.7ms / inspection 424.6ms
- state: turn 1 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 25/25 / hand player/cpu 5/5
- board: empty
- rolloutTriggered: false, adopted: true
- decision: summon:ヤンバル->player_back_left
- fallback: summon:ヤンバル->player_back_left (199.4)
- planner selected: summon:ヤンバル->player_back_left (268.4)
- root gap to fallback: 110.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ヤンバル->player_back_left | summon:ヤンバル->back-left; backlineReach; after:prepared | 89.2 | 268.4 | 248.8 | 192.4 | 305.2 | - | - | - |
| 2 |  |  |  | summon:ヤンバル->player_back_right | summon:ヤンバル->back-right; backlineReach; after:prepared | 89.2 | 268.4 | 248.8 | 192.4 | 305.2 | - | - | - |
| 3 |  |  |  | summon:ボムゾウ->player_back_left | summon:ボムゾウ->back-left; backlineReach; after:prepared | 87.8 | 262.1 | 242.8 | 180.4 | 305.2 | - | - | - |
| 4 |  |  |  | summon:ボムゾウ->player_back_right | summon:ボムゾウ->back-right; backlineReach; after:prepared | 87.8 | 262.1 | 242.8 | 180.4 | 305.2 | - | - | - |
| 5 |  |  |  | end_turn | - | -14 | -53.1 | -38.4 | -17 | -59.8 | - | - | - |

### seed 994324 / challenger-as-player / step 1 / turn 1

- elapsed: 189.4ms / inspection 189.4ms
- state: turn 1 / current player / HP player/cpu 10/10 / stones player/cpu 2/0 / deck player/cpu 25/25 / hand player/cpu 4/5
- board: player_back_left:PB:ヤンバル Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: summon:ボムゾウ->player_front_left
- fallback: summon:ボムゾウ->player_front_left (204)
- planner selected: summon:ボムゾウ->player_front_left (223)
- root gap to fallback: 66
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ボムゾウ->player_front_left | summon:ボムゾウ->front-left; backlineReach; after:prepared | 138 | 223 | 192.6 | 136.2 | 249 | - | - | - |
| 2 |  |  |  | summon:ドノマンティス->player_front_left | summon:ドノマンティス->front-left; noBacklineReach; after:prepared | 135.4 | 222.4 | 192.6 | 136.2 | 249 | - | - | - |
| 3 |  |  |  | summon:ボムゾウ->player_front_right | summon:ボムゾウ->front-right; backlineReach; after:prepared | 124.8 | 220.1 | 192.6 | 136.2 | 249 | - | - | - |
| 4 |  |  |  | summon:ドノマンティス->player_front_right | summon:ドノマンティス->front-right; noBacklineReach; after:prepared | 122.2 | 219.5 | 192.6 | 136.2 | 249 | - | - | - |
| 5 |  |  |  | end_turn | - | -14 | -64.1 | -25 | -17 | -33 | - | - | - |

### seed 994324 / challenger-as-player / step 2 / turn 1

- elapsed: 79.5ms / inspection 77.9ms
- state: turn 1 / current player / HP player/cpu 10/10 / stones player/cpu 1/0 / deck player/cpu 25/25 / hand player/cpu 3/5
- board: player_front_left:PF:ボムゾウ Lv1 HP6 prep | player_back_left:PB:ヤンバル Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: summon:ドノマンティス->player_front_right
- fallback: summon:ドノマンティス->player_front_right (122.2)
- planner selected: summon:ドノマンティス->player_front_right (134.5)
- root gap to fallback: 0
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ドノマンティス->player_front_right | summon:ドノマンティス->front-right; noBacklineReach; after:prepared | 122.2 | 134.5 | 107.6 | 51.2 | 164 | - | - | - |
| 2 |  |  |  | summon:ドノマンティス->player_back_right | summon:ドノマンティス->back-right; noBacklineReach; after:prepared | 80.2 | 119.2 | 101.6 | 39.2 | 164 | - | - | - |
| 3 |  |  |  | end_turn | - | -14 | -17.2 | 14 | -17 | 45 | - | - | - |

### seed 994324 / challenger-as-player / step 3 / turn 1

- elapsed: 27.6ms / inspection 27.6ms
- state: turn 1 / current player / HP player/cpu 10/10 / stones player/cpu 0/0 / deck player/cpu 25/25 / hand player/cpu 2/5
- board: player_front_left:PF:ボムゾウ Lv1 HP6 prep | player_front_right:PF:ドノマンティス Lv1 HP5 prep | player_back_left:PB:ヤンバル Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-14)
- planner selected: end_turn (36.3)
- root gap to fallback: 0
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -14 | 36.3 | 39.4 | -17 | 95.8 | - | - | - |

### seed 994324 / challenger-as-player / step 8 / turn 2

- elapsed: 896ms / inspection 872.6ms
- state: turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 24/24 / hand player/cpu 3/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ボムゾウ Lv1 HP6 prep | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: focus:ボムゾウ
- fallback: focus:ボムゾウ (-260.8)
- planner selected: focus:ボムゾウ (-5.3)
- root gap to fallback: -304.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ボムゾウ | - | 44 | -5.3 | -15 | 32.2 | -62.2 | - | - | - |
| 2 |  |  |  | focus:ドノマンティス | - | 44 | -5.3 | -15 | 32.2 | -62.2 | - | - | - |
| 3 |  |  |  | focus:ヤンバル | - | 32 | -8 | -15 | 32.2 | -62.2 | - | - | - |
| 4 |  |  |  | end_turn | - | -79.9 | -48.5 | -9 | 44.2 | -62.2 | - | - | - |

### seed 994324 / challenger-as-player / step 9 / turn 2

- elapsed: 504ms / inspection 506.3ms
- state: turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 24/24 / hand player/cpu 3/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ボムゾウ Lv1 HP6 prep | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: focus:ドノマンティス
- fallback: focus:ドノマンティス (-287.2)
- planner selected: focus:ドノマンティス (-17.3)
- root gap to fallback: -331.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ドノマンティス | - | 44 | -17.3 | -27 | 14.2 | -68.2 | - | - | - |
| 2 |  |  |  | focus:ヤンバル | - | 32 | -20 | -27 | 14.2 | -68.2 | - | - | - |
| 3 |  |  |  | end_turn | - | -97.9 | -73.5 | -21 | 26.2 | -68.2 | - | - | - |

### seed 994324 / challenger-as-player / step 10 / turn 2

- elapsed: 325.6ms / inspection 327.8ms
- state: turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 24/24 / hand player/cpu 3/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ボムゾウ Lv1 HP6 prep | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: focus:ヤンバル
- fallback: focus:ヤンバル (-367.7)
- planner selected: focus:ヤンバル (-32)
- root gap to fallback: -399.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ヤンバル | - | 32 | -32 | -39 | -3.8 | -74.2 | - | - | - |
| 2 |  |  |  | end_turn | - | -145.1 | -113.4 | -33 | 8.2 | -74.2 | - | - | - |

### seed 994324 / challenger-as-player / step 12 / turn 2

- elapsed: 73.2ms / inspection 71.8ms
- state: turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 1/0 / deck player/cpu 24/24 / hand player/cpu 3/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus,shield | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 prep | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-563.5)
- planner selected: end_turn (-128.4)
- root gap to fallback: -396.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -167.1 | -128.4 | -48.1 | 4.2 | -92.2 | - | - | - |

### seed 994324 / challenger-as-player / step 21 / turn 3

- elapsed: 1402.3ms / inspection 1402.6ms
- state: turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 4/0 / deck player/cpu 23/23 / hand player/cpu 4/3
- board: player_front_left:PF:ボムゾウ Lv1 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 shield | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: focus:ボムゾウ
- fallback: focus:ボムゾウ (240.4)
- planner selected: focus:ボムゾウ (119.4)
- root gap to fallback: 54.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ボムゾウ | - | 186.2 | 119.4 | 79.8 | 83.2 | 76.4 | - | - | - |
| 2 |  |  |  | summon:ボムゾウ->player_back_right | summon:ボムゾウ->back-right; backlineReach; behindOwnFront:ドノマンティスLv1HP5(act1/1); sameLaneEnemyFront:ポリスピナーLv1HP3(act2/2,shield); after:prepared | 82.8 | 92.3 | 85.8 | 95.2 | 76.4 | - | - | - |
| 3 |  |  |  | attack:ヤンバル:wild_claw->ボムゾウ | attackTarget:cpu-front-left:ボムゾウLv1HP6(act1/1,focus); targetAfter:ボムゾウLv1HP5(act1/1); attackerAfter:ヤンバルLv1HP3(act1/1) | 99 | 25.5 | 7.3 | 39.2 | -24.6 | - | - | - |
| 4 |  |  |  | attack:ボムゾウ:storm_bomb->ヤンバル | attackTarget:cpu-back-left:ヤンバルLv1HP3(act1/1); targetAfter:ヤンバルLv1HP2(act1/1); attackerAfter:ボムゾウLv1HP5(act1/1) | 19 | -31.6 | 7.8 | 11.2 | 4.4 | - | - | - |
| 5 |  |  |  | attack:ボムゾウ:self_bomb->ボムゾウ | attackTarget:cpu-front-left:ボムゾウLv1HP6(act1/1,focus); targetAfter:ボムゾウLv1HP5(act1/1); attackerAfter:ボムゾウLv1HP3(act1/1) | -57 | -69.8 | 24.3 | 17.2 | 31.4 | - | - | - |
| 6 |  |  |  | end_turn | - | -83.8 | -110 | 3.4 | 35.4 | -28.6 | - | - | - |

### seed 994324 / challenger-as-player / step 23 / turn 3

- elapsed: 630.7ms / inspection 632.6ms
- state: turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 4/0 / deck player/cpu 23/23 / hand player/cpu 4/3
- board: player_front_left:PF:ボムゾウ Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ボムゾウ Lv1 HP5 act1/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 shield | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: summon:ボムゾウ->player_back_right
- fallback: summon:ボムゾウ->player_back_right (43.6)
- planner selected: summon:ボムゾウ->player_back_right (22.5)
- root gap to fallback: -39.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ボムゾウ->player_back_right | summon:ボムゾウ->back-right; backlineReach; behindOwnFront:ドノマンティスLv1HP5(act1/1); sameLaneEnemyFront:ポリスピナーLv1HP3(act2/2,shield); after:prepared | 82.8 | 22.5 | 4.3 | 43.2 | -34.6 | - | - | - |
| 2 |  |  |  | end_turn | - | -100.6 | -154.9 | -81.1 | -32.6 | -129.6 | - | - | - |

### seed 994324 / challenger-as-player / step 25 / turn 3

- elapsed: 125.2ms / inspection 126.1ms
- state: turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 1/0 / deck player/cpu 23/23 / hand player/cpu 3/3
- board: player_front_left:PF:ボムゾウ Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 shield | player_back_right:PB:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:ボムゾウ Lv1 HP5 act1/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 shield | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 prep
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-297.9)
- planner selected: end_turn (-96.9)
- root gap to fallback: -197.3
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -100.6 | -96.9 | -64.5 | -32.6 | -96.4 | - | - | - |

### seed 994324 / challenger-as-player / step 34 / turn 4

- elapsed: 1080ms / inspection 1069.6ms
- state: turn 4 / current player / HP player/cpu 10/10 / stones player/cpu 5/0 / deck player/cpu 22/22 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv1 HP5 act0/1 | player_front_right:PF:ボムゾウ Lv1 HP6 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ボムゾウ Lv1 HP5 act1/1 focus,shield | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
- rolloutTriggered: false, adopted: true
- decision: attack:ヤンバル:wild_claw->ポリスピナー
- fallback: attack:ヤンバル:wild_claw->ポリスピナー (926.3)
- planner selected: attack:ヤンバル:wild_claw->ポリスピナー (268.2)
- root gap to fallback: 315.3
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ヤンバル:wild_claw->ポリスピナー | attackTarget:cpu-front-right:ポリスピナーLv2HP3(act2/2); targetAfter:ポリスピナーLv2HP1(act2/2); attackerAfter:ヤンバルLv1HP3(act1/1) | 611 | 268.2 | 228.6 | 254 | 203.2 | - | - | - |
| 2 |  |  |  | attack:ボムゾウ:self_bomb->ポリスピナー | attackTarget:cpu-front-right:ポリスピナーLv2HP3(act2/2); targetAfter:ポリスピナーLv2HP1(act2/2); attackerAfter:ボムゾウLv1HP4(act1/1) | 199 | 80.2 | 206.6 | 232 | 181.2 | - | - | - |
| 3 |  |  |  | attack:ボムゾウ:storm_bomb->ポリスピナー | attackTarget:cpu-front-right:ポリスピナーLv2HP3(act2/2); targetAfter:ポリスピナーLv2HP2(act2/2); attackerAfter:ボムゾウLv1HP5(act1/1) | 163.5 | 70.8 | 218.6 | 244 | 193.2 | - | - | - |
| 4 |  |  |  | master:master_attack->monster:cpu_front_right | - | 82 | 56.5 | 263 | 263 | 263 | - | - | - |
| 5 |  |  |  | focus:ボムゾウ | - | 61.9 | 7.6 | 228.6 | 254 | 203.2 | - | - | - |
| 6 |  |  |  | end_turn | - | 40.5 | -115.3 | 121 | 171 | 71 | - | - | - |

### seed 994324 / challenger-as-player / step 37 / turn 4

- elapsed: 549.7ms / inspection 536.4ms
- state: turn 4 / current player / HP player/cpu 10/10 / stones player/cpu 4/2 / deck player/cpu 22/22 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP6 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ボムゾウ Lv1 HP5 act1/1 focus,shield | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
- rolloutTriggered: false, adopted: true
- decision: focus:ボムゾウ
- fallback: focus:ボムゾウ (23.8)
- planner selected: focus:ボムゾウ (40.8)
- root gap to fallback: -18.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ボムゾウ | - | 42 | 40.8 | 31.6 | 57 | 6.2 | - | - | - |
| 2 |  |  |  | end_turn | - | -13.2 | 31.7 | 34.6 | 53 | 16.2 | - | - | - |
| 3 |  |  |  | attack:ボムゾウ:storm_bomb->ヤンバル | attackTarget:cpu-back-left:ヤンバルLv1HP3(act1/1); targetAfter:ヤンバルLv1HP2(act1/1); attackerAfter:ボムゾウLv1HP6(act1/1) | 17 | -36.7 | -40.4 | -15 | -65.8 | - | - | - |

### seed 994324 / challenger-as-player / step 39 / turn 4

- elapsed: 124.2ms / inspection 124.2ms
- state: turn 4 / current player / HP player/cpu 10/10 / stones player/cpu 2/2 / deck player/cpu 22/22 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv2 HP5 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP6 act1/1 focus,shield | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ボムゾウ Lv1 HP5 act1/1 focus,shield | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-175.6)
- planner selected: end_turn (8.6)
- root gap to fallback: -139.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -36.4 | 8.6 | 16.6 | 35 | -1.8 | - | - | - |

### seed 994324 / challenger-as-player / step 50 / turn 5

- elapsed: 81.2ms / inspection 81.1ms
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 1/1 / deck player/cpu 21/21 / hand player/cpu 4/4
- board: player_front_right:PF:ボムゾウ Lv1 HP6 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ヤンバル Lv1 HP1 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 prep | cpu_back_left:CB:ボムゾウ Lv2 HP5 act1/1 shield | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
- rolloutTriggered: false, adopted: true
- decision: attack:ボムゾウ:storm_bomb->ヤンバル
- fallback: attack:ボムゾウ:storm_bomb->ヤンバル (375.5)
- planner selected: attack:ボムゾウ:storm_bomb->ヤンバル (71.6)
- root gap to fallback: -29.1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ボムゾウ:storm_bomb->ヤンバル | attackTarget:cpu-front-left:ヤンバルLv1HP1(act1/1); targetAfter:empty; attackerAfter:ボムゾウLv1HP6(act1/1) | 404.6 | 71.6 | 32 | 32 | 32 | - | - | - |
| 2 |  |  |  | end_turn | - | -97.4 | -279.1 | -46.7 | -34.2 | -59.2 | - | - | - |

### seed 994324 / challenger-as-player / step 52 / turn 5

- elapsed: 48.4ms / inspection 48.6ms
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 0/2 / deck player/cpu 21/21 / hand player/cpu 4/4
- board: player_front_right:PF:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 prep | cpu_back_left:CB:ボムゾウ Lv2 HP5 act1/1 shield | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-469.8)
- planner selected: end_turn (-176.2)
- root gap to fallback: -356.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -113.6 | -176.2 | -134.4 | -102.2 | -166.6 | - | - | - |

### seed 994324 / challenger-as-player / step 63 / turn 6

- elapsed: 35.7ms / inspection 37.2ms
- state: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 0/0 / deck player/cpu 20/20 / hand player/cpu 5/4
- board: player_front_right:PF:ヤンバル Lv1 HP3 act1/1 shield | cpu_front_left:CF:ボムゾウ Lv2 HP1 act1/1 | cpu_front_right:CF:真勇者ダイン Lv3 HP6 act1/1 shield | cpu_back_left:CB:ピグミィ Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-535.3)
- planner selected: end_turn (-303.8)
- root gap to fallback: -383.1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -152.2 | -303.8 | -234.2 | -68.6 | -261.6 | - | - | - |

### seed 994324 / challenger-as-player / step 69 / turn 7

- elapsed: 123.7ms / inspection 123.5ms
- state: turn 7 / current player / HP player/cpu 9/10 / stones player/cpu 5/4 / deck player/cpu 19/19 / hand player/cpu 6/4
- board: cpu_front_left:CF:デスシープ Lv1 HP6 prep | cpu_front_right:CF:真勇者ダイン Lv3 HP6 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: summon:デスシープ->player_back_left
- fallback: summon:デスシープ->player_back_left (-40.8)
- planner selected: summon:デスシープ->player_back_left (-45.5)
- root gap to fallback: -130.6
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:デスシープ->player_back_left | summon:デスシープ->back-left; noBacklineReach; sameLaneEnemyFront:デスシープLv1HP6(prep); after:prepared | 89.8 | -45.5 | -65.3 | -22.4 | -108.2 | - | - | - |
| 2 |  |  |  | summon:デスシープ->player_back_right | summon:デスシープ->back-right; noBacklineReach; sameLaneEnemyFront:真勇者ダインLv3HP6(act1/1); after:prepared | 89.8 | -45.5 | -65.3 | -22.4 | -108.2 | - | - | - |
| 3 |  |  |  | end_turn | - | -106 | -249.7 | -168.5 | -85.2 | -236.2 | - | - | - |

### seed 994324 / challenger-as-player / step 71 / turn 7

- elapsed: 17.6ms / inspection 17.3ms
- state: turn 7 / current player / HP player/cpu 9/10 / stones player/cpu 1/4 / deck player/cpu 19/19 / hand player/cpu 5/4
- board: player_back_left:PB:デスシープ Lv1 HP6 prep | cpu_front_left:CF:デスシープ Lv1 HP6 prep | cpu_front_right:CF:真勇者ダイン Lv3 HP4 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-332.3)
- planner selected: end_turn (-164.3)
- root gap to fallback: -224.3
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -108 | -164.3 | -126.5 | -82.2 | -168 | - | - | - |

### seed 994324 / challenger-as-player / step 76 / turn 8

- elapsed: 309.2ms / inspection 308.6ms
- state: turn 8 / current player / HP player/cpu 7/10 / stones player/cpu 6/5 / deck player/cpu 18/18 / hand player/cpu 6/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:真勇者ダイン Lv3 HP4 act1/1 shield | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: focus:デスシープ
- fallback: focus:デスシープ (6.8)
- planner selected: focus:デスシープ (14.6)
- root gap to fallback: -181.4
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:デスシープ | - | 188.2 | 14.6 | -25 | 34 | -84 | - | - | - |
| 2 |  |  |  | end_turn | - | -21.8 | -91.3 | -21.5 | 46 | -84 | - | - | - |
| 3 |  |  |  | attack:デスシープ:attack->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP6(act1/1,focus); targetAfter:デスシープLv1HP5(act1/1); attackerAfter:デスシープLv1HP6(act1/1) | -49 | -181.4 | -92 | -20 | -156 | - | - | - |

### seed 994324 / challenger-as-player / step 79 / turn 8

- elapsed: 37.1ms / inspection 36.5ms
- state: turn 8 / current player / HP player/cpu 7/10 / stones player/cpu 3/5 / deck player/cpu 18/18 / hand player/cpu 5/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus,shield | player_front_right:PF:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:真勇者ダイン Lv3 HP4 act1/1 shield | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-186)
- planner selected: end_turn (-12.5)
- root gap to fallback: -131.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -54.8 | -12.5 | -0.4 | 45 | -45.8 | - | - | - |

### seed 994324 / challenger-as-player / step 83 / turn 9

- elapsed: 558.6ms / inspection 558.4ms
- state: turn 9 / current player / HP player/cpu 5/10 / stones player/cpu 5/8 / deck player/cpu 17/17 / hand player/cpu 6/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:ボムゾウ Lv1 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv3 HP2 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: attack:ボムゾウ:self_bomb->真勇者ダイン
- fallback: attack:ボムゾウ:self_bomb->真勇者ダイン (937)
- planner selected: attack:ボムゾウ:self_bomb->真勇者ダイン (265.6)
- root gap to fallback: 178.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ボムゾウ:self_bomb->真勇者ダイン | attackTarget:cpu-front-right:真勇者ダインLv3HP2(act1/1); targetAfter:empty; attackerAfter:ボムゾウLv1HP4(act1/1) | 758.6 | 265.6 | 226 | 226 | 226 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:cpu_front_right | - | 532.2 | 249.2 | 282.8 | 309 | 256.6 | - | - | - |
| 3 |  |  |  | attack:ボムゾウ:storm_bomb->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP6(act0/1,focus); targetAfter:デスシープLv1HP6(act0/1); attackerAfter:ボムゾウLv1HP6(act1/1) | 53.3 | -22.1 | 278.8 | 289 | 268.6 | - | - | - |
| 4 |  |  |  | attack:デスシープ:attack->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP6(act0/1,focus); targetAfter:デスシープLv1HP4(act0/1); attackerAfter:デスシープLv1HP6(act1/1) | -11.6 | -56.8 | 290.8 | 301 | 280.6 | - | - | - |
| 5 |  |  |  | end_turn | - | -19 | -314.5 | 38.5 | 106 | -24 | - | - | - |

### seed 994324 / challenger-as-player / step 85 / turn 9

- elapsed: 811.7ms / inspection 802.6ms
- state: turn 9 / current player / HP player/cpu 5/10 / stones player/cpu 4/11 / deck player/cpu 17/17 / hand player/cpu 6/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:ボムゾウ Lv2 HP5 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: attack:デスシープ:attack->デスシープ
- fallback: attack:デスシープ:attack->デスシープ (-115.5)
- planner selected: attack:デスシープ:attack->デスシープ (41.6)
- root gap to fallback: -91.9
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:デスシープ:attack->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP6(act0/1,focus); targetAfter:デスシープLv1HP4(act0/1); attackerAfter:デスシープLv1HP6(act1/1) | -23.6 | 41.6 | 46.8 | 64 | 29.6 | - | - | - |
| 2 |  |  |  | end_turn | - | 4 | 36.7 | 35.8 | 56 | 15.6 | - | - | - |

### seed 994324 / challenger-as-player / step 86 / turn 9

- elapsed: 824.6ms / inspection 824.4ms
- state: turn 9 / current player / HP player/cpu 5/10 / stones player/cpu 4/11 / deck player/cpu 17/17 / hand player/cpu 6/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ボムゾウ Lv2 HP5 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP4 act0/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: summon:ポリスピナー->player_back_left
- fallback: summon:ポリスピナー->player_back_left (112.6)
- planner selected: summon:ポリスピナー->player_back_left (64.4)
- root gap to fallback: 32.6
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ポリスピナー->player_back_left | summon:ポリスピナー->back-left; noBacklineReach; behindOwnFront:デスシープLv1HP6(act1/1); sameLaneEnemyFront:デスシープLv1HP4(act0/1); after:prepared | 80 | 64.4 | 46.8 | 64 | 29.6 | - | - | - |
| 2 |  |  |  | summon:ポリスピナー->player_back_right | summon:ポリスピナー->back-right; noBacklineReach; behindOwnFront:ボムゾウLv2HP5(act1/1); after:prepared | 80 | 64.4 | 46.8 | 64 | 29.6 | - | - | - |
| 3 |  |  |  | end_turn | - | 4 | -26.3 | -27.2 | -4 | -50.4 | - | - | - |

### seed 994324 / challenger-as-player / step 88 / turn 9

- elapsed: 69.8ms / inspection 68.6ms
- state: turn 9 / current player / HP player/cpu 5/10 / stones player/cpu 1/11 / deck player/cpu 17/17 / hand player/cpu 5/5
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ボムゾウ Lv2 HP5 act1/1 shield | player_back_left:PB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:デスシープ Lv1 HP4 act0/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-17.8)
- planner selected: end_turn (-3.8)
- root gap to fallback: -19.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | 2 | -3.8 | -4.2 | 13 | -21.4 | - | - | - |

### seed 994324 / challenger-as-player / step 98 / turn 10

- elapsed: 1837.1ms / inspection 1811.1ms
- state: turn 10 / current player / HP player/cpu 5/10 / stones player/cpu 5/2 / deck player/cpu 16/16 / hand player/cpu 6/5
- board: player_front_left:PF:ポリスピナー Lv1 HP3 act0/2 | player_front_right:PF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP4 act1/1 focus,shield | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 shield | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep
- rolloutTriggered: false, adopted: true
- decision: attack:ポリスピナー:attack->デスシープ
- fallback: attack:ボムゾウ:storm_bomb->デスシープ (123.8)
- planner selected: attack:ポリスピナー:attack->デスシープ (163.7)
- root gap to fallback: 18.8
- planner margin to fallback: 89.5

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y |  | attack:ポリスピナー:attack->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP4(act1/1,focus,shield); targetAfter:デスシープLv1HP4(act1/1,shield); attackerAfter:ポリスピナーLv1HP3(act1/2) | 105 | 163.7 | 140.6 | 174 | 107.2 | - | - | - |
| 2 |  |  |  | attack:ボムゾウ:self_bomb->ピグミィ | attackTarget:cpu-front-right:ピグミィLv1HP3(act0/2,focus); targetAfter:ピグミィLv1HP1(act0/2); attackerAfter:ボムゾウLv2HP2(act1/1) | 116 | 83.7 | 58.2 | 135 | 8.2 | - | - | - |
| 3 |  |  | Y | attack:ボムゾウ:storm_bomb->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP4(act1/1,focus,shield); targetAfter:デスシープLv1HP4(act1/1,shield); attackerAfter:ボムゾウLv2HP5(act1/1) | 80 | 74.2 | 56.6 | 84 | 29.2 | - | - | - |
| 4 |  |  |  | end_turn | - | 12 | 50.3 | 59.7 | 93.2 | 26.2 | - | - | - |

### seed 994324 / challenger-as-player / step 109 / turn 11

- elapsed: 1453.8ms / inspection 1448ms
- state: turn 11 / current player / HP player/cpu 5/10 / stones player/cpu 3/2 / deck player/cpu 15/15 / hand player/cpu 6/5
- board: player_front_right:PF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_left:CF:デスシープ Lv2 HP2 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: attack:ボムゾウ:storm_bomb->デスシープ
- fallback: attack:ボムゾウ:storm_bomb->デスシープ (745.8)
- planner selected: attack:ボムゾウ:storm_bomb->デスシープ (301)
- root gap to fallback: 128
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ボムゾウ:storm_bomb->デスシープ | attackTarget:cpu-front-left:デスシープLv2HP2(act1/1); targetAfter:empty; attackerAfter:ボムゾウLv2HP5(act1/1) | 617.8 | 301 | 261.4 | 256.2 | 266.6 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:cpu_front_left | - | 473.8 | 129.5 | 121.9 | 187 | 80.6 | - | - | - |
| 3 |  |  |  | summon:真勇者ダイン->player_front_left | summon:真勇者ダイン->front-left; noBacklineReach; sameLaneEnemyFront:デスシープLv2HP2(act1/1); after:prepared | 134.8 | 82.5 | 254.3 | 308 | 213.6 | - | - | - |
| 4 |  |  |  | attack:ボムゾウ:storm_bomb->ピグミィ | attackTarget:cpu-back-left:ピグミィLv2HP3(act2/2); targetAfter:ピグミィLv2HP1(act2/2); attackerAfter:ボムゾウLv2HP5(act1/1) | 14.8 | -70.5 | 187.7 | 230 | 147.6 | - | - | - |
| 5 |  |  |  | end_turn | - | -43.4 | -329.7 | -29.5 | 22 | -81 | - | - | - |

### seed 994324 / challenger-as-player / step 110 / turn 11

- elapsed: 737ms / inspection 734.9ms
- state: turn 11 / current player / HP player/cpu 5/10 / stones player/cpu 3/4 / deck player/cpu 15/15 / hand player/cpu 6/5
- board: player_front_right:PF:ボムゾウ Lv2 HP5 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: summon:ピグミィ->player_back_right
- fallback: summon:ピグミィ->player_back_right (207.9)
- planner selected: summon:ピグミィ->player_back_right (152.5)
- root gap to fallback: 66.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:ピグミィ->player_back_right | summon:ピグミィ->back-right; backlineReach; behindOwnFront:ボムゾウLv2HP5(act1/1); sameLaneEnemyFront:ドノマンティスLv1HP5(act1/1,shield); after:prepared | 141.4 | 152.5 | 121.4 | 116.2 | 126.6 | - | - | - |
| 2 |  |  |  | summon:真勇者ダイン->player_front_left | summon:真勇者ダイン->front-left; noBacklineReach; after:prepared | 134.8 | 151.1 | 121.4 | 116.2 | 126.6 | - | - | - |
| 3 |  |  |  | summon:真勇者ダイン->player_back_left | summon:真勇者ダイン->back-left; noBacklineReach; after:prepared | 92.8 | 135.8 | 115.4 | 104.2 | 126.6 | - | - | - |
| 4 |  |  |  | summon:真勇者ダイン->player_back_right | summon:真勇者ダイン->back-right; noBacklineReach; behindOwnFront:ボムゾウLv2HP5(act1/1); sameLaneEnemyFront:ドノマンティスLv1HP5(act1/1,shield); after:prepared | 92.8 | 100.2 | 79.8 | 91 | 68.6 | - | - | - |
| 5 |  |  |  | end_turn | - | -28 | -126.1 | -75.2 | -28 | -122.4 | - | - | - |

### seed 994324 / challenger-as-player / step 111 / turn 11

- elapsed: 384.4ms / inspection 382.3ms
- state: turn 11 / current player / HP player/cpu 5/10 / stones player/cpu 2/4 / deck player/cpu 15/15 / hand player/cpu 5/5
- board: player_front_right:PF:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: summon:真勇者ダイン->player_front_left
- fallback: summon:真勇者ダイン->player_front_left (128.8)
- planner selected: summon:真勇者ダイン->player_front_left (80.3)
- root gap to fallback: 0
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:真勇者ダイン->player_front_left | summon:真勇者ダイン->front-left; noBacklineReach; after:prepared | 128.8 | 80.3 | 52 | 46.8 | 57.2 | - | - | - |
| 2 |  |  |  | summon:真勇者ダイン->player_back_left | summon:真勇者ダイン->back-left; noBacklineReach; after:prepared | 86.8 | 65.1 | 46 | 34.8 | 57.2 | - | - | - |
| 3 |  |  |  | master:shield->monster:player_front_right | - | 60.4 | -30.1 | -43.4 | -9 | -77.8 | - | - | - |
| 4 |  |  |  | end_turn | - | -30 | -92.4 | -46.4 | -25 | -67.8 | - | - | - |

### seed 994324 / challenger-as-player / step 112 / turn 11

- elapsed: 105.2ms / inspection 105.3ms
- state: turn 11 / current player / HP player/cpu 5/10 / stones player/cpu 1/4 / deck player/cpu 15/15 / hand player/cpu 4/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 prep | player_front_right:PF:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-58.3)
- planner selected: end_turn (-26.4)
- root gap to fallback: -28.3
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -30 | -26.4 | -19.8 | -25 | -14.6 | - | - | - |

### seed 994324 / challenger-as-player / step 122 / turn 12

- elapsed: 945.7ms / inspection 944.6ms
- state: turn 12 / current player / HP player/cpu 5/10 / stones player/cpu 6/4 / deck player/cpu 14/14 / hand player/cpu 5/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 | cpu_front_left:CF:デスシープ Lv1 HP6 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: focus:真勇者ダイン
- fallback: focus:真勇者ダイン (156.8)
- planner selected: focus:真勇者ダイン (103.5)
- root gap to fallback: 112.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:真勇者ダイン | - | 44 | 103.5 | 93.8 | 90.8 | 96.8 | - | - | - |
| 2 |  |  |  | summon:ポリスピナー->player_front_right | summon:ポリスピナー->front-right; noBacklineReach; sameLaneEnemyFront:ドノマンティスLv1HP5(act1/1,shield); after:prepared | 122 | 97.6 | 70.8 | 112.8 | 28.8 | - | - | - |
| 3 |  |  |  | focus:ピグミィ | - | 32 | 95.8 | 93.8 | 90.8 | 96.8 | - | - | - |
| 4 |  |  |  | end_turn | - | -47.2 | -70.7 | -15.7 | 51.8 | -78.2 | - | - | - |

### seed 994324 / challenger-as-player / step 124 / turn 12

- elapsed: 243.3ms / inspection 242.7ms
- state: turn 12 / current player / HP player/cpu 5/10 / stones player/cpu 5/4 / deck player/cpu 14/14 / hand player/cpu 4/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 | cpu_front_left:CF:デスシープ Lv1 HP6 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: focus:ピグミィ
- fallback: focus:ピグミィ (-92.1)
- planner selected: focus:ピグミィ (33.8)
- root gap to fallback: -124.1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ピグミィ | - | 32 | 33.8 | 26.8 | 23.8 | 29.8 | - | - | - |
| 2 |  |  |  | end_turn | - | -75.2 | -32.3 | -2.2 | 33.8 | -38.2 | - | - | - |

### seed 994324 / challenger-as-player / step 126 / turn 12

- elapsed: 64.1ms / inspection 63.3ms
- state: turn 12 / current player / HP player/cpu 5/10 / stones player/cpu 3/4 / deck player/cpu 14/14 / hand player/cpu 4/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus,shield | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-248.1)
- planner selected: end_turn (-6.9)
- root gap to fallback: -156.9
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -91.2 | -6.9 | 18.8 | 15.8 | 21.8 | - | - | - |

### seed 994324 / challenger-as-player / step 128 / turn 13

- elapsed: 2008.8ms / inspection 1942.8ms
- state: turn 13 / current player / HP player/cpu 5/10 / stones player/cpu 6/7 / deck player/cpu 13/13 / hand player/cpu 5/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->デスシープ
- fallback: attack:ポリスピナー:attack->ドノマンティス (35.7)
- planner selected: attack:ピグミィ:スパイクボール->デスシープ (315.4)
- root gap to fallback: -26.3
- planner margin to fallback: 2.4

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y |  | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP6(act0/1,focus); targetAfter:デスシープLv1HP6(act0/1); attackerAfter:ピグミィLv1HP3(act1/2) | 62 | 315.4 | 301.8 | 337 | 266.6 | - | - | - |
| 2 |  |  | Y | attack:ポリスピナー:attack->ドノマンティス | attackTarget:cpu-front-right:ドノマンティスLv1HP5(act0/1,focus); targetAfter:ドノマンティスLv1HP4(act0/1); attackerAfter:ポリスピナーLv1HP3(act1/2) | 53.5 | 313.1 | 301.8 | 337 | 266.6 | - | - | - |
| 3 |  |  |  | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:cpu-front-right:ドノマンティスLv1HP5(act0/1,focus); targetAfter:ドノマンティスLv1HP5(act0/1); attackerAfter:ピグミィLv1HP3(act1/2) | 134.5 | 263.4 | 233.8 | 254 | 213.6 | - | - | - |
| 4 |  |  |  | attack:真勇者ダイン:ダイン斬り->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP6(act0/1,focus); targetAfter:デスシープLv1HP4(act0/1); attackerAfter:真勇者ダインLv1HP6(act1/1) | -28 | 182.4 | 229.8 | 259 | 200.6 | - | - | - |
| 5 |  |  |  | end_turn | - | 76.5 | 172.3 | 155.5 | 171 | 140 | - | - | - |

### seed 994324 / challenger-as-player / step 130 / turn 13

- elapsed: 1004ms / inspection 996.2ms
- state: turn 13 / current player / HP player/cpu 5/10 / stones player/cpu 6/7 / deck player/cpu 13/13 / hand player/cpu 5/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: attack:ポリスピナー:attack->ドノマンティス
- fallback: attack:ポリスピナー:attack->ドノマンティス (42.4)
- planner selected: attack:ポリスピナー:attack->ドノマンティス (303)
- root gap to fallback: -17.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ポリスピナー:attack->ドノマンティス | attackTarget:cpu-front-right:ドノマンティスLv1HP5(act0/1,focus); targetAfter:ドノマンティスLv1HP4(act0/1); attackerAfter:ポリスピナーLv1HP3(act1/2) | 59.9 | 303 | 289.8 | 319 | 260.6 | - | - | - |
| 2 |  |  |  | end_turn | - | 76.5 | 169.3 | 152.5 | 171 | 134 | - | - | - |

### seed 994324 / challenger-as-player / step 131 / turn 13

- elapsed: 791.8ms / inspection 782.4ms
- state: turn 13 / current player / HP player/cpu 5/10 / stones player/cpu 6/7 / deck player/cpu 13/13 / hand player/cpu 5/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act1/2 | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP4 act0/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: master:master_attack->monster:cpu_front_right
- fallback: master:master_attack->monster:cpu_front_right (329.8)
- planner selected: master:master_attack->monster:cpu_front_right (259.6)
- root gap to fallback: 293.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | master:master_attack->monster:cpu_front_right | - | 36.2 | 259.6 | 265.8 | 295 | 236.6 | - | - | - |
| 2 |  |  |  | attack:ポリスピナー:attack->ドノマンティス | attackTarget:cpu-front-right:ドノマンティスLv1HP4(act0/1); targetAfter:ドノマンティスLv1HP2(act0/1); attackerAfter:ポリスピナーLv1HP3(act2/2) | 144.5 | 228.6 | 196.8 | 220 | 173.6 | - | - | - |
| 3 |  |  |  | end_turn | - | 8 | 115.5 | 142 | 171 | 113 | - | - | - |

### seed 994324 / challenger-as-player / step 134 / turn 13

- elapsed: 448.4ms / inspection 449.4ms
- state: turn 13 / current player / HP player/cpu 5/10 / stones player/cpu 2/8 / deck player/cpu 13/13 / hand player/cpu 5/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:ポリスピナー Lv2 HP3 act2/2 | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-102.5)
- planner selected: end_turn (86.2)
- root gap to fallback: -104.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | 2 | 86.2 | 85.8 | 109 | 62.6 | - | - | - |

### seed 994324 / challenger-as-player / step 146 / turn 14

- elapsed: 1030.8ms / inspection 919.1ms
- state: turn 14 / current player / HP player/cpu 5/10 / stones player/cpu 8/0 / deck player/cpu 12/12 / hand player/cpu 6/5
- board: player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ピグミィ Lv2 HP3 act2/2 | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
- rolloutTriggered: false, adopted: true
- decision: move:player_front_left->player_back_right
- fallback: move:player_front_left->player_back_right (447.6)
- planner selected: move:player_front_left->player_back_right (248.9)
- root gap to fallback: 379.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | move:player_front_left->player_back_right | move:player-front-left->player-back-right; mover:ピグミィLv1HP3(act0/2,focus); fallbackMove:player-front-left->player-back-right:keepsTo | 67.8 | 248.9 | 234 | 283 | 185 | - | - | - |
| 2 |  |  |  | move:player_front_left->player_back_left | move:player-front-left->player-back-left; mover:ピグミィLv1HP3(act0/2,focus); fallbackMove:player-front-left->player-back-right:keepsTo | 67.8 | 237.9 | 223 | 261 | 185 | - | - | - |
| 3 |  |  |  | attack:ピグミィ:attack->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP6(act1/1,focus); targetAfter:デスシープLv1HP6(act1/1); attackerAfter:ピグミィLv1HP3(act1/2); fallbackMove:player-front-left->player-back-right:keepsTo | 62 | 147 | 133.4 | 164.8 | 102 | - | - | - |
| 4 |  |  |  | move:player_front_left->player_front_right | move:player-front-left->player-front-right; mover:ピグミィLv1HP3(act0/2,focus); fallbackMove:player-front-left->player-back-right:keepsTo | 19.8 | 64.9 | 60.6 | 94 | 27.2 | - | - | - |
| 5 |  |  |  | end_turn | fallbackMove:player-front-left->player-back-right:keepsTo | -74 | -115.7 | -68.5 | -26 | -111 | - | - | - |

### seed 994324 / challenger-as-player / step 147 / turn 14

- elapsed: 678.2ms / inspection 675.3ms
- state: turn 14 / current player / HP player/cpu 5/10 / stones player/cpu 8/0 / deck player/cpu 12/12 / hand player/cpu 6/5
- board: player_back_right:PB:ピグミィ Lv1 HP3 act1/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ピグミィ Lv2 HP3 act2/2 | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->ピグミィ
- fallback: attack:ピグミィ:スパイクボール->ピグミィ (653.2)
- planner selected: attack:ピグミィ:スパイクボール->ピグミィ (275.6)
- root gap to fallback: 238.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ピグミィ | attackTarget:cpu-front-right:ピグミィLv2HP3(act2/2); targetAfter:ピグミィLv2HP2(act2/2); attackerAfter:ピグミィLv1HP3(act2/2) | 415 | 275.6 | 236 | 285 | 187 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:cpu_front_right | - | 46.4 | 165.9 | 300 | 300 | 300 | - | - | - |
| 3 |  |  |  | focus:ピグミィ | - | 30 | 154.1 | 300 | 300 | 300 | - | - | - |
| 4 |  |  |  | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP6(act1/1,focus); targetAfter:デスシープLv1HP6(act1/1); attackerAfter:ピグミィLv1HP3(act2/2) | 67.5 | 131.1 | 250 | 250 | 250 | - | - | - |
| 5 |  |  |  | end_turn | - | -56 | -262.4 | -54.5 | 0 | -109 | - | - | - |

### seed 994324 / challenger-as-player / step 148 / turn 14

- elapsed: 340.5ms / inspection 353.3ms
- state: turn 14 / current player / HP player/cpu 5/10 / stones player/cpu 8/0 / deck player/cpu 12/12 / hand player/cpu 6/5
- board: player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ピグミィ Lv2 HP2 act2/2 | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
- rolloutTriggered: false, adopted: true
- decision: summon:真勇者ダイン->player_front_right
- fallback: summon:真勇者ダイン->player_front_right (613)
- planner selected: summon:真勇者ダイン->player_front_right (182.6)
- root gap to fallback: 456.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | summon:真勇者ダイン->player_front_right | summon:真勇者ダイン->front-right; noBacklineReach; sameLaneEnemyFront:ピグミィLv2HP2(act2/2); after:prepared | 156.8 | 182.6 | 254.2 | 295 | 214.2 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:cpu_front_right | - | 449 | 74.6 | 35 | 73 | -3 | - | - | - |
| 3 |  |  |  | end_turn | - | -74 | -350.3 | -112.5 | -68 | -157 | - | - | - |

### seed 994324 / challenger-as-player / step 149 / turn 14

- elapsed: 242.5ms / inspection 240.5ms
- state: turn 14 / current player / HP player/cpu 5/10 / stones player/cpu 7/0 / deck player/cpu 12/12 / hand player/cpu 5/5
- board: player_front_right:PF:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ピグミィ Lv2 HP2 act2/2 | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
- rolloutTriggered: false, adopted: true
- decision: master:wake_up->monster:player_front_right
- fallback: master:wake_up->monster:player_front_right (733.9)
- planner selected: master:wake_up->monster:player_front_right (200)
- root gap to fallback: 324.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | master:wake_up->monster:player_front_right | - | 409.7 | 200 | 160.4 | 201.2 | 120.4 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:cpu_front_right | - | 449 | 111.8 | 72.2 | 92 | 52.4 | - | - | - |
| 3 |  |  |  | end_turn | - | -76 | -314.2 | -74.9 | -65 | -84.8 | - | - | - |

### seed 994324 / challenger-as-player / step 150 / turn 14

- elapsed: 193.8ms / inspection 194ms
- state: turn 14 / current player / HP player/cpu 5/10 / stones player/cpu 5/0 / deck player/cpu 12/12 / hand player/cpu 5/5
- board: player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ピグミィ Lv2 HP2 act2/2 | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
- rolloutTriggered: false, adopted: true
- decision: attack:真勇者ダイン:ダイン斬り->ピグミィ
- fallback: attack:真勇者ダイン:ダイン斬り->ピグミィ (789.5)
- planner selected: attack:真勇者ダイン:ダイン斬り->ピグミィ (155.6)
- root gap to fallback: 87.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:真勇者ダイン:ダイン斬り->ピグミィ | attackTarget:cpu-front-right:ピグミィLv2HP2(act2/2); targetAfter:empty; attackerAfter:真勇者ダインLv1HP6(act1/1) | 702.3 | 155.6 | 116 | 116 | 116 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:cpu_front_right | - | 386.3 | 38.8 | 117.2 | 158 | 77.2 | - | - | - |
| 3 |  |  |  | focus:真勇者ダイン | - | 10.7 | -186.2 | 117.2 | 158 | 77.2 | - | - | - |
| 4 |  |  |  | end_turn | - | -56.7 | -375.5 | -23.5 | 13 | -60 | - | - | - |

### seed 994324 / challenger-as-player / step 153 / turn 14

- elapsed: 28.1ms / inspection 27.9ms
- state: turn 14 / current player / HP player/cpu 5/10 / stones player/cpu 1/2 / deck player/cpu 12/12 / hand player/cpu 5/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 shield | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-333.1)
- planner selected: end_turn (-119.3)
- root gap to fallback: -232.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -100.4 | -119.3 | -87 | -23 | -135 | - | - | - |

### seed 994324 / challenger-as-player / step 159 / turn 15

- elapsed: 43.7ms / inspection 44.3ms
- state: turn 15 / current player / HP player/cpu 4/10 / stones player/cpu 6/2 / deck player/cpu 11/11 / hand player/cpu 6/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep
- rolloutTriggered: false, adopted: true
- decision: attack:真勇者ダイン:ダイン斬り->ヤンバル
- fallback: attack:真勇者ダイン:ダイン斬り->ヤンバル (463.5)
- planner selected: attack:真勇者ダイン:ダイン斬り->ヤンバル (51.4)
- root gap to fallback: -114.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:真勇者ダイン:ダイン斬り->ヤンバル | attackTarget:cpu-front-right:ヤンバルLv2HP3(act1/1,shield); targetAfter:empty; attackerAfter:真勇者ダインLv3HP6(act1/1) | 578.3 | 51.4 | 11.8 | 14.8 | 8.8 | - | - | - |
| 2 |  |  |  | end_turn | - | -45.6 | -337.2 | -55.2 | 0.8 | -111.2 | - | - | - |

### seed 994324 / challenger-as-player / step 160 / turn 15

- elapsed: 12ms / inspection 11.7ms
- state: turn 15 / current player / HP player/cpu 4/10 / stones player/cpu 6/4 / deck player/cpu 11/11 / hand player/cpu 6/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-266.8)
- planner selected: end_turn (-127.1)
- root gap to fallback: -174
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -92.9 | -127.1 | -100.2 | -97.2 | -103.2 | - | - | - |

### seed 994324 / challenger-as-player / step 163 / turn 16

- elapsed: 20.5ms / inspection 17.7ms
- state: turn 16 / current player / HP player/cpu 4/8 / stones player/cpu 9/9 / deck player/cpu 10/10 / hand player/cpu 6/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-121.6)
- planner selected: end_turn (-32.1)
- root gap to fallback: -110
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -11.6 | -32.1 | -29.5 | -20 | -39 | - | - | - |

### seed 994324 / challenger-as-player / step 168 / turn 17

- elapsed: 43.8ms / inspection 41.6ms
- state: turn 17 / current player / HP player/cpu 2/8 / stones player/cpu 14/10 / deck player/cpu 9/9 / hand player/cpu 6/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: attack:真勇者ダイン:ダイン斬り->cpu master
- fallback: attack:真勇者ダイン:ダイン斬り->cpu master (38.5)
- planner selected: attack:真勇者ダイン:ダイン斬り->cpu master (118)
- root gap to fallback: 24.6
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:真勇者ダイン:ダイン斬り->cpu master | masterHp:cpu:8->6 | 13.9 | 118 | 115 | 118 | 112 | - | - | - |
| 2 |  |  |  | end_turn | - | 6.4 | 0.4 | -1 | 46 | -48 | - | - | - |

### seed 994324 / challenger-as-player / step 169 / turn 17

- elapsed: 14.1ms / inspection 12.6ms
- state: turn 17 / current player / HP player/cpu 2/6 / stones player/cpu 14/12 / deck player/cpu 9/9 / hand player/cpu 6/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-78.5)
- planner selected: end_turn (-41.1)
- root gap to fallback: -50.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -27.6 | -41.1 | -35 | -32 | -38 | - | - | - |

### seed 994324 / challenger-as-player / step 171 / turn 18

- elapsed: 83.2ms / inspection 54.2ms
- state: turn 18 / current player / HP player/cpu 2/6 / stones player/cpu 17/15 / deck player/cpu 8/8 / hand player/cpu 6/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: attack:真勇者ダイン:ダイン斬り->真勇者ダイン
- fallback: attack:真勇者ダイン:ダイン斬り->真勇者ダイン (1524.5)
- planner selected: attack:真勇者ダイン:ダイン斬り->真勇者ダイン (25.1)
- root gap to fallback: 911.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:真勇者ダイン:ダイン斬り->真勇者ダイン | attackTarget:cpu-front-right:真勇者ダインLv1HP6(act0/1,focus); targetAfter:真勇者ダインLv1HP3(act0/1); attackerAfter:真勇者ダインLv3HP6(act1/1) | 613 | 25.1 | -14.5 | 4 | -33 | - | - | - |
| 2 |  |  |  | end_turn | - | 18.4 | -210.8 | 42.5 | 58 | 27 | - | - | - |

### seed 994324 / challenger-as-player / step 172 / turn 18

- elapsed: 18.5ms / inspection 16.6ms
- state: turn 18 / current player / HP player/cpu 2/6 / stones player/cpu 17/15 / deck player/cpu 8/8 / hand player/cpu 6/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP3 act0/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-350.6)
- planner selected: end_turn (-41.1)
- root gap to fallback: -339
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -11.6 | -41.1 | -38.5 | -20 | -57 | - | - | - |

### seed 994324 / challenger-as-player / step 174 / turn 19

- elapsed: 80.5ms / inspection 53.7ms
- state: turn 19 / current player / HP player/cpu 2/6 / stones player/cpu 20/18 / deck player/cpu 7/7 / hand player/cpu 6/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP3 act0/1 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: attack:真勇者ダイン:ダイン斬り->真勇者ダイン
- fallback: attack:真勇者ダイン:ダイン斬り->真勇者ダイン (2242.9)
- planner selected: attack:真勇者ダイン:ダイン斬り->真勇者ダイン (126.1)
- root gap to fallback: 1065.6
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:真勇者ダイン:ダイン斬り->真勇者ダイン | attackTarget:cpu-front-right:真勇者ダインLv1HP3(act0/1,focus); targetAfter:empty; attackerAfter:真勇者ダインLv3HP6(act1/1) | 1177.4 | 126.1 | 86.5 | 96 | 77 | - | - | - |
| 2 |  |  |  | end_turn | - | 7.7 | -500.6 | 42.5 | 58 | 27 | - | - | - |

### seed 994324 / challenger-as-player / step 175 / turn 19

- elapsed: 9.7ms / inspection 7.6ms
- state: turn 19 / current player / HP player/cpu 2/6 / stones player/cpu 20/19 / deck player/cpu 7/7 / hand player/cpu 6/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-330.6)
- planner selected: end_turn (-32.1)
- root gap to fallback: -319
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -11.6 | -32.1 | -29.5 | -20 | -39 | - | - | - |

### seed 994324 / challenger-as-player / step 178 / turn 20

- elapsed: 21.3ms / inspection 15.1ms
- state: turn 20 / current player / HP player/cpu 1/6 / stones player/cpu 24/22 / deck player/cpu 6/6 / hand player/cpu 6/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: attack:真勇者ダイン:ダイン斬り->cpu master
- fallback: attack:真勇者ダイン:ダイン斬り->cpu master (458.6)
- planner selected: attack:真勇者ダイン:ダイン斬り->cpu master (164.6)
- root gap to fallback: 24.6
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:真勇者ダイン:ダイン斬り->cpu master | masterHp:cpu:6->4 | 434 | 164.6 | 125 | 118 | 132 | - | - | - |
| 2 |  |  |  | end_turn | - | 10.4 | -161.5 | 8 | 46 | -30 | - | - | - |

### seed 994324 / challenger-as-player / step 179 / turn 20

- elapsed: 6.2ms / inspection 4.9ms
- state: turn 20 / current player / HP player/cpu 1/4 / stones player/cpu 24/24 / deck player/cpu 6/6 / hand player/cpu 6/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-73.3)
- planner selected: end_turn (-30.2)
- root gap to fallback: -49.6
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -23.6 | -30.2 | -25 | -32 | -18 | - | - | - |

### seed 994324 / challenger-as-player / step 181 / turn 21

- elapsed: 24.1ms / inspection 15ms
- state: turn 21 / current player / HP player/cpu 1/4 / stones player/cpu 27/27 / deck player/cpu 5/5 / hand player/cpu 6/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: attack:真勇者ダイン:ダイン斬り->cpu master
- fallback: attack:真勇者ダイン:ダイン斬り->cpu master (-1498083)
- planner selected: attack:真勇者ダイン:ダイン斬り->cpu master (-749636.4)
- root gap to fallback: -1498517
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:真勇者ダイン:ダイン斬り->cpu master | masterHp:cpu:4->2 | 434 | -749636.4 | -749676 | 45 | -999623 | - | - | - |
| 2 |  |  |  | end_turn | - | -370.7 | -750171.9 | -749770 | -331 | -999623 | - | - | - |

### seed 994324 / challenger-as-player / step 182 / turn 21

- elapsed: 6.7ms / inspection 5.9ms
- state: turn 21 / current player / HP player/cpu 1/2 / stones player/cpu 27/29 / deck player/cpu 5/5 / hand player/cpu 6/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus
- rolloutTriggered: false, adopted: true
- decision: end_turn
- fallback: end_turn (-2351498.6)
- planner selected: end_turn (-749855.6)
- root gap to fallback: -2351402
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | end_turn | - | -96.6 | -749855.6 | -749826 | -105 | -999773 | - | - | - |


