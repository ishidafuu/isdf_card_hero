# White Rollout Trigger Audit

生成: 2026-07-04T07:09:10.360Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994303-994306
directions: challenger-as-cpu, challenger-as-player
baseline: `white`, challenger: `white_rollout`
inspectThresholdMs: 3000

## Conclusion

- 8 games. challenger wins 7, inspected decisions 24, rollout-triggered decisions 1.
- max challenger decision 78688.4ms, avg challenger decision 704.6ms.
- rollout adopted 1/1; avg selected rollout gap 278.2.
- Only one rollout-triggered decision was captured. Treat it as a local clue until the same feature repeats across seeds.

## Games

| seed | direction | result | steps | turns | HP | decisions | avg ms | max ms | events | issue |
| ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 994303 | challenger-as-cpu | white_rollout | 222 | 19 | P0/C6 | 117 | 703.4 | 4968.3 | 4 | - |
| 994304 | challenger-as-cpu | white | 255 | 28 | P3/C0 | 108 | 612.9 | 4070.8 | 2 | - |
| 994305 | challenger-as-cpu | white_rollout | 312 | 32 | P0/C1 | 153 | 991 | 5362.4 | 11 | - |
| 994306 | challenger-as-cpu | white_rollout | 175 | 22 | P0/C6 | 84 | 583.4 | 4701.9 | 2 | - |
| 994303 | challenger-as-player | white_rollout | 242 | 23 | P7/C0 | 118 | 567.9 | 3293.2 | 1 | - |
| 994304 | challenger-as-player | white_rollout | 254 | 28 | P4/C0 | 142 | 428.6 | 2690.3 | 0 | - |
| 994305 | challenger-as-player | white_rollout | 310 | 27 | P4/C0 | 151 | 717.3 | 3419 | 3 | - |
| 994306 | challenger-as-player | white_rollout | 281 | 27 | P5/C0 | 137 | 1031.9 | 78688.4 | 1 | - |

## Events

### seed 994303 / challenger-as-cpu / step 65 / turn 6

- elapsed: 4596.1ms / inspection 4558.7ms
- state: turn 6 / current cpu / HP cpu/player 9/10 / stones cpu/player 5/0 / deck cpu/player 19/20 / hand cpu/player 5/4
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP1 act2/2 focus,shield | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1
- rolloutTriggered: false, adopted: false
- decision: attack:ヤンバル:wild_claw->真勇者ダイン
- fallback: attack:ヤンバル:wild_claw->真勇者ダイン (379.3)
- planner selected: focus:真勇者ダイン (246.8)
- root gap to fallback: 184.1
- planner margin to fallback: 67.4

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 |  | Y |  | focus:真勇者ダイン | - | 195.2 | 246.8 | 207.2 | 210.4 | 204 | - | - | - |
| 2 |  |  |  | summon:ヤンバル->cpu_back_right | summon:ヤンバル->back-right; backlineReach; behindOwnFront:真勇者ダインLv1HP6(act0/1); sameLaneEnemyFront:真勇者ダインLv2HP6(act1/1); after:prepared | 142.4 | 244.5 | 213.2 | 222.4 | 204 | - | - | - |
| 3 |  |  |  | move:cpu_front_left->cpu_back_right | move:cpu-front-left->cpu-back-right; mover:ヤンバルLv1HP3(act0/1) | 90 | 195.6 | 188.4 | 190.8 | 186 | - | - | - |
| 4 | Y |  | Y | attack:ヤンバル:wild_claw->真勇者ダイン | attackTarget:player-front-left:真勇者ダインLv1HP6(act1/1,focus) | 115 | 179.4 | 154.2 | 166.4 | 142 | - | - | - |

### seed 994303 / challenger-as-cpu / step 67 / turn 6

- elapsed: 3136.8ms / inspection 3107.8ms
- state: turn 6 / current cpu / HP cpu/player 9/10 / stones cpu/player 5/0 / deck cpu/player 19/20 / hand cpu/player 5/4
- board: player_front_left:PF:真勇者ダイン Lv1 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP1 act2/2 focus,shield | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1
- rolloutTriggered: false, adopted: false
- decision: move:cpu_front_left->cpu_back_right
- fallback: move:cpu_front_left->cpu_back_right (183.7)
- planner selected: summon:ヤンバル->cpu_back_right (161.5)
- root gap to fallback: 41.3
- planner margin to fallback: 34.2

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 |  | Y |  | summon:ヤンバル->cpu_back_right | summon:ヤンバル->back-right; backlineReach; behindOwnFront:真勇者ダインLv1HP6(act1/1,focus); sameLaneEnemyFront:真勇者ダインLv2HP6(act1/1); after:prepared; fallbackMove:cpu-front-left->cpu-back-right:blocksTo | 142.4 | 161.5 | 130.2 | 136.4 | 124 | - | - | - |
| 2 |  |  |  | summon:ボムゾウ->cpu_back_right | summon:ボムゾウ->back-right; backlineReach; behindOwnFront:真勇者ダインLv1HP6(act1/1,focus); sameLaneEnemyFront:真勇者ダインLv2HP6(act1/1); after:prepared; fallbackMove:cpu-front-left->cpu-back-right:blocksTo | 87.8 | 136.7 | 117.4 | 126.8 | 108 | - | - | - |
| 3 | Y |  | Y | move:cpu_front_left->cpu_back_right | move:cpu-front-left->cpu-back-right; mover:ヤンバルLv1HP3(act0/1); fallbackMove:cpu-front-left->cpu-back-right:keepsTo | 86 | 127.3 | 108.4 | 120.8 | 96 | - | - | - |
| 4 |  |  |  | summon:ポリスピナー->cpu_back_right | summon:ポリスピナー->back-right; noBacklineReach; behindOwnFront:真勇者ダインLv1HP6(act1/1,focus); sameLaneEnemyFront:真勇者ダインLv2HP6(act1/1); after:prepared; fallbackMove:cpu-front-left->cpu-back-right:blocksTo | 80 | 120.6 | 103 | 116 | 90 | - | - | - |

### seed 994303 / challenger-as-cpu / step 145 / turn 12

- elapsed: 4968.3ms / inspection 4935.8ms
- state: turn 12 / current cpu / HP cpu/player 8/8 / stones cpu/player 6/3 / deck cpu/player 13/14 / hand cpu/player 4/4
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 prep | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2
- rolloutTriggered: false, adopted: true
- decision: focus:真勇者ダイン
- fallback: focus:真勇者ダイン (316.1)
- planner selected: focus:真勇者ダイン (203.9)
- root gap to fallback: 129.9
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:真勇者ダイン | - | 186.2 | 203.9 | 164.3 | 215.8 | 112.8 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:player-front-left:真勇者ダインLv1HP6(act0/1,focus) | 92.9 | 184.1 | 170.3 | 227.8 | 112.8 | - | - | - |
| 3 |  |  |  | focus:ピグミィ | - | 44 | 153.4 | 174.8 | 209.8 | 139.8 | - | - | - |
| 4 |  |  |  | attack:ヤンバル:wild_claw->真勇者ダイン | attackTarget:player-front-left:真勇者ダインLv1HP6(act0/1,focus) | 123.4 | 129.4 | 102.3 | 153.8 | 50.8 | - | - | - |

### seed 994303 / challenger-as-cpu / step 146 / turn 12

- elapsed: 3322.8ms / inspection 3325.4ms
- state: turn 12 / current cpu / HP cpu/player 8/8 / stones cpu/player 6/3 / deck cpu/player 13/14 / hand cpu/player 4/4
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 prep | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2
- rolloutTriggered: false, adopted: false
- decision: attack:ヤンバル:wild_claw->真勇者ダイン
- fallback: attack:ヤンバル:wild_claw->真勇者ダイン (189.5)
- planner selected: attack:ピグミィ:スパイクボール->真勇者ダイン (179.6)
- root gap to fallback: 92.6
- planner margin to fallback: 61.7

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 |  | Y |  | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:player-front-left:真勇者ダインLv1HP6(act0/1,focus) | 96.9 | 179.6 | 158.3 | 209.8 | 106.8 | - | - | - |
| 2 |  |  |  | focus:ピグミィ | - | 44 | 171.8 | 162.8 | 191.8 | 133.8 | - | - | - |
| 3 |  |  |  | focus:ボムゾウ | - | 44 | 161.3 | 152.3 | 197.8 | 106.8 | - | - | - |
| 4 |  |  |  | end_turn | - | -20 | 125.7 | 162.8 | 191.8 | 133.8 | - | - | - |

### seed 994304 / challenger-as-cpu / step 51 / turn 5

- elapsed: 4070.8ms / inspection 4091.8ms
- state: turn 5 / current cpu / HP cpu/player 10/10 / stones cpu/player 3/1 / deck cpu/player 20/21 / hand cpu/player 4/3
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act1/1 focus,shield | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_left:CB:ピグミィ Lv1 HP1 act0/2
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->ドノマンティス
- fallback: attack:ピグミィ:スパイクボール->ドノマンティス (348)
- planner selected: attack:ピグミィ:スパイクボール->ドノマンティス (206.4)
- root gap to fallback: 263.5
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:player-front-left:ドノマンティスLv1HP5(act1/1,focus) | 84.5 | 206.4 | 187.8 | 209.2 | 166.4 | - | - | - |
| 2 |  |  |  | summon:ボムゾウ->cpu_back_right | summon:ボムゾウ->back-right; backlineReach; behindOwnFront:デスシープLv1HP6(act0/1); sameLaneEnemyFront:デスシープLv1HP6(act1/1,focus,shield); after:prepared | 82.8 | 206 | 187.8 | 209.2 | 166.4 | - | - | - |
| 3 |  |  |  | summon:ドノマンティス->cpu_back_right | summon:ドノマンティス->back-right; noBacklineReach; behindOwnFront:デスシープLv1HP6(act0/1); sameLaneEnemyFront:デスシープLv1HP6(act1/1,focus,shield); after:prepared | 80.2 | 200.6 | 183 | 205.6 | 160.4 | - | - | - |
| 4 |  |  |  | summon:ポリスピナー->cpu_back_right | summon:ポリスピナー->back-right; noBacklineReach; behindOwnFront:デスシープLv1HP6(act0/1); sameLaneEnemyFront:デスシープLv1HP6(act1/1,focus,shield); after:prepared | 75 | 189.9 | 173.4 | 198.4 | 148.4 | - | - | - |

### seed 994304 / challenger-as-cpu / step 52 / turn 5

- elapsed: 3954.5ms / inspection 3973.6ms
- state: turn 5 / current cpu / HP cpu/player 10/10 / stones cpu/player 3/1 / deck cpu/player 20/21 / hand cpu/player 4/3
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 focus,shield | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_left:CB:ピグミィ Lv1 HP1 act1/2
- rolloutTriggered: false, adopted: true
- decision: attack:真勇者ダイン:ダイン斬り->ドノマンティス
- fallback: attack:真勇者ダイン:ダイン斬り->ドノマンティス (428)
- planner selected: attack:真勇者ダイン:ダイン斬り->ドノマンティス (187.5)
- root gap to fallback: 258.1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:真勇者ダイン:ダイン斬り->ドノマンティス | attackTarget:player-front-left:ドノマンティスLv1HP5(act1/1) | 169.9 | 187.5 | 150.1 | 204.4 | 109.4 | - | - | - |
| 2 |  |  |  | summon:ボムゾウ->cpu_back_right | summon:ボムゾウ->back-right; backlineReach; behindOwnFront:デスシープLv1HP6(act0/1); sameLaneEnemyFront:デスシープLv1HP6(act1/1,focus,shield); after:prepared | 82.8 | 184.5 | 169.8 | 191.2 | 148.4 | - | - | - |
| 3 |  |  |  | summon:ドノマンティス->cpu_back_right | summon:ドノマンティス->back-right; noBacklineReach; behindOwnFront:デスシープLv1HP6(act0/1); sameLaneEnemyFront:デスシープLv1HP6(act1/1,focus,shield); after:prepared | 80.2 | 177.8 | 165 | 187.6 | 142.4 | - | - | - |
| 4 |  |  |  | summon:ポリスピナー->cpu_back_right | summon:ポリスピナー->back-right; noBacklineReach; behindOwnFront:デスシープLv1HP6(act0/1); sameLaneEnemyFront:デスシープLv1HP6(act1/1,focus,shield); after:prepared | 75 | 164.5 | 155.4 | 180.4 | 130.4 | - | - | - |

### seed 994305 / challenger-as-cpu / step 49 / turn 5

- elapsed: 4714.7ms / inspection 4714.8ms
- state: turn 5 / current cpu / HP cpu/player 9/10 / stones cpu/player 5/1 / deck cpu/player 20/21 / hand cpu/player 5/3
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 focus,shield | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_left:CB:ピグミィ Lv1 HP2 act0/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act0/1
- rolloutTriggered: false, adopted: true
- decision: attack:ヤンバル:wild_claw->真勇者ダイン
- fallback: attack:ヤンバル:wild_claw->真勇者ダイン (12.4)
- planner selected: attack:ヤンバル:wild_claw->真勇者ダイン (251)
- root gap to fallback: -12.2
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ヤンバル:wild_claw->真勇者ダイン | attackTarget:player-front-left:真勇者ダインLv1HP6(act1/1) | 24.5 | 251 | 248.6 | 264 | 233.2 | - | - | - |
| 2 |  |  |  | end_turn | - | 16.6 | 221.7 | 225 | 251 | 199 | - | - | - |
| 3 |  |  |  | attack:真勇者ダイン:ダイン斬り->デスシープ | attackTarget:player-front-right:デスシープLv1HP6(act1/1,focus,shield) | 69.5 | 188.9 | 173.6 | 192 | 155.2 | - | - | - |
| 4 |  |  |  | attack:ヤンバル:wild_claw->デスシープ | attackTarget:player-front-right:デスシープLv1HP6(act1/1,focus,shield) | 110.5 | 188.8 | 164.5 | 195 | 134 | - | - | - |

### seed 994305 / challenger-as-cpu / step 50 / turn 5

- elapsed: 4425.3ms / inspection 4531.8ms
- state: turn 5 / current cpu / HP cpu/player 9/10 / stones cpu/player 5/1 / deck cpu/player 20/21 / hand cpu/player 5/3
- board: player_front_left:PF:真勇者ダイン Lv1 HP3 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 focus,shield | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_left:CB:ピグミィ Lv1 HP2 act0/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->真勇者ダイン
- fallback: attack:ピグミィ:スパイクボール->真勇者ダイン (555.7)
- planner selected: attack:ピグミィ:スパイクボール->真勇者ダイン (282.2)
- root gap to fallback: 322.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:player-front-left:真勇者ダインLv1HP3(act1/1) | 232.9 | 282.2 | 242.6 | 258 | 227.2 | - | - | - |
| 2 |  |  |  | attack:ボムゾウ:self_bomb->真勇者ダイン | attackTarget:player-front-left:真勇者ダインLv1HP3(act1/1) | 175 | 244.1 | 205.6 | 215 | 196.2 | - | - | - |
| 3 |  |  |  | focus:ボムゾウ | - | 58.3 | 202.2 | 236.6 | 246 | 227.2 | - | - | - |
| 4 |  |  |  | focus:ピグミィ | - | 44 | 155.9 | 200.6 | 198 | 203.2 | - | - | - |

### seed 994305 / challenger-as-cpu / step 51 / turn 5

- elapsed: 3211ms / inspection 3162.6ms
- state: turn 5 / current cpu / HP cpu/player 9/10 / stones cpu/player 5/1 / deck cpu/player 20/21 / hand cpu/player 5/3
- board: player_front_left:PF:真勇者ダイン Lv1 HP2 act1/1 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 focus,shield | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_left:CB:ピグミィ Lv1 HP2 act1/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
- rolloutTriggered: false, adopted: true
- decision: attack:ボムゾウ:self_bomb->真勇者ダイン
- fallback: attack:ボムゾウ:self_bomb->真勇者ダイン (707.1)
- planner selected: attack:ボムゾウ:self_bomb->真勇者ダイン (239.2)
- root gap to fallback: 93
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ボムゾウ:self_bomb->真勇者ダイン | attackTarget:player-front-left:真勇者ダインLv1HP2(act1/1) | 614.1 | 239.2 | 199.6 | 209 | 190.2 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:player_front_left | - | 346.1 | 182.2 | 236.6 | 252 | 221.2 | - | - | - |
| 3 |  |  |  | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:player-front-left:真勇者ダインLv1HP2(act1/1) | 192.2 | 31.2 | 162.6 | 172 | 153.2 | - | - | - |
| 4 |  |  |  | focus:真勇者ダイン | - | 44 | -4.8 | 230.6 | 240 | 221.2 | - | - | - |

### seed 994305 / challenger-as-cpu / step 59 / turn 6

- elapsed: 3072.6ms / inspection 3046.7ms
- state: turn 6 / current cpu / HP cpu/player 9/10 / stones cpu/player 3/4 / deck cpu/player 19/20 / hand cpu/player 6/3
- board: player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_back_left:CB:ピグミィ Lv1 HP2 act0/2 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act0/1
- rolloutTriggered: false, adopted: true
- decision: attack:ヤンバル:wild_claw->デスシープ
- fallback: attack:ヤンバル:wild_claw->デスシープ (130.6)
- planner selected: attack:ヤンバル:wild_claw->デスシープ (230.5)
- root gap to fallback: -15.4
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ヤンバル:wild_claw->デスシープ | attackTarget:player-front-right:デスシープLv1HP6(act0/1,focus) | 146 | 230.5 | 198.4 | 225.8 | 171 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:player-front-left:デスシープLv1HP6(act0/1,focus) | 62 | 203.4 | 191.8 | 226.8 | 156.8 | - | - | - |
| 3 |  |  |  | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:player-front-right:デスシープLv1HP6(act0/1,focus) | 62 | 203.4 | 191.8 | 226.8 | 156.8 | - | - | - |
| 4 |  |  |  | end_turn | - | 2.3 | 151.4 | 182.8 | 208.8 | 156.8 | - | - | - |

### seed 994305 / challenger-as-cpu / step 96 / turn 9

- elapsed: 4718.8ms / inspection 4665.1ms
- state: turn 9 / current cpu / HP cpu/player 9/10 / stones cpu/player 6/0 / deck cpu/player 16/17 / hand cpu/player 6/3
- board: player_front_left:PF:ボムゾウ Lv1 HP3 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 prep | cpu_front_left:CF:ピグミィ Lv1 HP2 act0/2 focus | cpu_front_right:CF:ヤンバル Lv2 HP3 act0/1
- rolloutTriggered: false, adopted: false
- decision: attack:ヤンバル:wild_claw->ボムゾウ
- fallback: attack:ヤンバル:wild_claw->ボムゾウ (613)
- planner selected: summon:ヤンバル->cpu_back_left (352.3)
- root gap to fallback: 470.6
- planner margin to fallback: 75.5

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 |  | Y |  | summon:ヤンバル->cpu_back_left | summon:ヤンバル->back-left; backlineReach; behindOwnFront:ピグミィLv1HP2(act0/2,focus); sameLaneEnemyFront:ボムゾウLv1HP3(act1/1,focus); after:prepared | 142.4 | 352.3 | 321 | 332.2 | 309.8 | - | - | - |
| 2 |  |  |  | summon:ヤンバル->cpu_back_right | summon:ヤンバル->back-right; backlineReach; behindOwnFront:ヤンバルLv2HP3(act0/1); sameLaneEnemyFront:ドノマンティスLv1HP5(act1/1); after:prepared | 142.4 | 352.3 | 321 | 332.2 | 309.8 | - | - | - |
| 3 |  |  |  | summon:ピグミィ->cpu_back_left | summon:ピグミィ->back-left; backlineReach; behindOwnFront:ピグミィLv1HP2(act0/2,focus); sameLaneEnemyFront:ボムゾウLv1HP3(act1/1,focus); after:prepared | 141.4 | 352.1 | 321 | 332.2 | 309.8 | - | - | - |
| 4 | Y |  | Y | attack:ヤンバル:wild_claw->ボムゾウ | attackTarget:player-front-left:ボムゾウLv1HP3(act1/1,focus) | 187.2 | 276.8 | 237.2 | 222.6 | 251.8 | - | - | - |

### seed 994305 / challenger-as-cpu / step 97 / turn 9

- elapsed: 3136.7ms / inspection 3113.2ms
- state: turn 9 / current cpu / HP cpu/player 9/10 / stones cpu/player 6/0 / deck cpu/player 16/17 / hand cpu/player 6/3
- board: player_front_left:PF:ボムゾウ Lv1 HP1 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 prep | cpu_front_left:CF:ピグミィ Lv1 HP2 act0/2 focus | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:attack->ボムゾウ
- fallback: attack:ピグミィ:attack->ボムゾウ (700.8)
- planner selected: attack:ピグミィ:attack->ボムゾウ (255.8)
- root gap to fallback: 27.9
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:attack->ボムゾウ | attackTarget:player-front-left:ボムゾウLv1HP1(act1/1) | 672.8 | 255.8 | 216.2 | 208.6 | 223.8 | - | - | - |
| 2 |  |  |  | master:master_attack->monster:player_front_left | - | 336.8 | 121 | 209.4 | 194 | 224.8 | - | - | - |
| 3 |  |  |  | summon:ヤンバル->cpu_back_left | summon:ヤンバル->back-left; backlineReach; behindOwnFront:ピグミィLv1HP2(act0/2,focus); sameLaneEnemyFront:ボムゾウLv1HP1(act1/1); after:prepared | 142.4 | 109.1 | 303 | 314.2 | 291.8 | - | - | - |
| 4 |  |  |  | move:cpu_front_left->cpu_back_right | move:cpu-front-left->cpu-back-right; mover:ピグミィLv1HP2(act0/2,focus) | 152 | 15.8 | 202.8 | 233.8 | 171.8 | - | - | - |

### seed 994305 / challenger-as-cpu / step 150 / turn 13

- elapsed: 4559.5ms / inspection 4502.8ms
- state: turn 13 / current cpu / HP cpu/player 8/10 / stones cpu/player 3/5 / deck cpu/player 12/13 / hand cpu/player 6/4
- board: player_front_left:PF:ポリスピナー Lv1 HP3 act2/2 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act0/1 focus | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- rolloutTriggered: false, adopted: false
- decision: attack:ヤンバル:wild_claw->ポリスピナー
- fallback: attack:ヤンバル:wild_claw->ポリスピナー (593.3)
- planner selected: attack:ピグミィ:スパイクボール->ポリスピナー (282)
- root gap to fallback: 362.3
- planner margin to fallback: 53

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 |  | Y |  | attack:ピグミィ:スパイクボール->ポリスピナー | attackTarget:player-front-left:ポリスピナーLv1HP3(act2/2) | 230.9 | 282 | 242.4 | 265 | 219.8 | - | - | - |
| 2 | Y |  | Y | attack:ヤンバル:wild_claw->ポリスピナー | attackTarget:player-front-left:ポリスピナーLv1HP3(act2/2) | 267 | 229 | 189.4 | 212 | 166.8 | - | - | - |
| 3 |  |  |  | attack:デスシープ:attack->ポリスピナー | attackTarget:player-front-left:ポリスピナーLv1HP3(act2/2) | 187 | 219 | 179.4 | 202 | 156.8 | - | - | - |
| 4 |  |  |  | focus:デスシープ | - | 60.3 | 192.3 | 242.4 | 265 | 219.8 | - | - | - |

### seed 994305 / challenger-as-cpu / step 213 / turn 18

- elapsed: 3713.7ms / inspection 3666.8ms
- state: turn 18 / current cpu / HP cpu/player 8/8 / stones cpu/player 5/1 / deck cpu/player 7/8 / hand cpu/player 5/5
- board: player_front_right:PF:ボムゾウ Lv1 HP6 prep | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 shield | cpu_front_left:CF:デスシープ Lv1 HP4 act0/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1
- rolloutTriggered: false, adopted: true
- decision: focus:ポリスピナー
- fallback: focus:ポリスピナー (246)
- planner selected: focus:ポリスピナー (208.7)
- root gap to fallback: 184.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ポリスピナー | - | 61.2 | 208.7 | 195.2 | 241.8 | 148.6 | - | - | - |
| 2 |  |  |  | end_turn | - | 50.3 | 200.3 | 189.2 | 235.8 | 142.6 | - | - | - |
| 3 |  |  |  | focus:ピグミィ | - | 44 | 198.9 | 189.2 | 235.8 | 142.6 | - | - | - |
| 4 |  |  |  | focus:真勇者ダイン | - | 44 | 198.9 | 189.2 | 229.8 | 148.6 | - | - | - |

### seed 994305 / challenger-as-cpu / step 214 / turn 18

- elapsed: 5362.4ms / inspection 5366.6ms
- state: turn 18 / current cpu / HP cpu/player 8/8 / stones cpu/player 5/1 / deck cpu/player 7/8 / hand cpu/player 5/5
- board: player_front_right:PF:ボムゾウ Lv1 HP6 prep | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 shield | cpu_front_left:CF:デスシープ Lv1 HP4 act0/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1
- rolloutTriggered: false, adopted: true
- decision: attack:ポリスピナー:attack->player master
- fallback: attack:ポリスピナー:attack->player master (58.9)
- planner selected: attack:ポリスピナー:attack->player master (199)
- root gap to fallback: -80.9
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ポリスピナー:attack->player master | - | 139.8 | 199 | 168.2 | 208.8 | 127.6 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->ピグミィ | attackTarget:player-back-left:ピグミィLv1HP3(act2/2) | 31 | 169.6 | 177.2 | 223.8 | 130.6 | - | - | - |
| 3 |  |  |  | end_turn | - | 27.1 | 160.8 | 171.2 | 217.8 | 124.6 | - | - | - |

### seed 994305 / challenger-as-cpu / step 255 / turn 21

- elapsed: 4178.9ms / inspection 4156.4ms
- state: turn 21 / current cpu / HP cpu/player 8/7 / stones cpu/player 4/4 / deck cpu/player 4/5 / hand cpu/player 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2
- rolloutTriggered: false, adopted: true
- decision: focus:真勇者ダイン
- fallback: focus:真勇者ダイン (187.7)
- planner selected: focus:真勇者ダイン (182.4)
- root gap to fallback: 8.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:真勇者ダイン | - | 179 | 182.4 | 143 | 196 | 90 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:player-front-left:ドノマンティスLv1HP5(act1/1,focus) | 86.5 | 161.8 | 149 | 208 | 90 | - | - | - |
| 3 |  |  |  | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:player-front-left:ドノマンティスLv1HP5(act1/1,focus) | 86.5 | 161.8 | 149 | 208 | 90 | - | - | - |
| 4 |  |  |  | focus:ピグミィ | - | 44 | 131.2 | 149 | 208 | 90 | - | - | - |

### seed 994305 / challenger-as-cpu / step 256 / turn 21

- elapsed: 3735.2ms / inspection 3710.4ms
- state: turn 21 / current cpu / HP cpu/player 8/7 / stones cpu/player 4/4 / deck cpu/player 4/5 / hand cpu/player 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2
- rolloutTriggered: false, adopted: true
- decision: attack:ピグミィ:スパイクボール->ドノマンティス
- fallback: attack:ピグミィ:スパイクボール->ドノマンティス (64.4)
- planner selected: attack:ピグミィ:スパイクボール->ドノマンティス (155.6)
- root gap to fallback: -20.1
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:player-front-left:ドノマンティスLv1HP5(act1/1,focus) | 84.5 | 155.6 | 137 | 190 | 84 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->ドノマンティス | attackTarget:player-front-left:ドノマンティスLv1HP5(act1/1,focus) | 84.5 | 155.6 | 137 | 190 | 84 | - | - | - |
| 3 |  |  |  | focus:ピグミィ | - | 44 | 146.7 | 137 | 190 | 84 | - | - | - |
| 4 |  |  |  | focus:ピグミィ | - | 44 | 146.7 | 137 | 190 | 84 | - | - | - |

### seed 994306 / challenger-as-cpu / step 76 / turn 7

- elapsed: 4701.9ms / inspection 4802.7ms
- state: turn 7 / current cpu / HP cpu/player 10/9 / stones cpu/player 7/1 / deck cpu/player 18/19 / hand cpu/player 6/4
- board: player_front_left:PF:ボムゾウ Lv2 HP2 act1/1 shield | player_front_right:PF:ピグミィ Lv1 HP3 prep | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1
- rolloutTriggered: false, adopted: false
- decision: attack:ヤンバル:wild_claw->ボムゾウ
- fallback: attack:ヤンバル:wild_claw->ボムゾウ (672.2)
- planner selected: master:wake_up->monster:player_front_right (363)
- root gap to fallback: 394.8
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 |  | Y |  | master:wake_up->monster:player_front_right | - | 277.4 | 363 | 323.4 | 325 | 321.8 | - | - | - |
| 2 | Y |  | Y | attack:ヤンバル:wild_claw->ボムゾウ | attackTarget:player-front-left:ボムゾウLv2HP2(act1/1,shield) | 241.2 | 363 | 323.4 | 325 | 321.8 | - | - | - |
| 3 |  |  |  | attack:ドノマンティス:attack->ボムゾウ | attackTarget:player-front-left:ボムゾウLv2HP2(act1/1,shield) | 161.2 | 330.8 | 313.4 | 315 | 311.8 | - | - | - |
| 4 |  |  |  | attack:デスシープ:attack->player master | - | 157.8 | 300.7 | 285.8 | 292 | 279.6 | - | - | - |

### seed 994306 / challenger-as-cpu / step 91 / turn 8

- elapsed: 3780.8ms / inspection 3737ms
- state: turn 8 / current cpu / HP cpu/player 10/9 / stones cpu/player 6/0 / deck cpu/player 17/18 / hand cpu/player 6/4
- board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:ボムゾウ Lv2 HP5 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1
- rolloutTriggered: false, adopted: false
- decision: attack:ヤンバル:wild_claw->ヤンバル
- fallback: attack:ヤンバル:wild_claw->ヤンバル (577.8)
- planner selected: attack:ドノマンティス:呪いの刃->ヤンバル (270.6)
- root gap to fallback: 73.1
- planner margin to fallback: 37.9

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 |  | Y |  | attack:ドノマンティス:呪いの刃->ヤンバル | attackTarget:player-front-left:ヤンバルLv1HP3(act1/1) | 504.7 | 270.6 | 231 | 241.8 | 220.2 | - | - | - |
| 2 | Y |  | Y | attack:ヤンバル:wild_claw->ヤンバル | attackTarget:player-front-left:ヤンバルLv1HP3(act1/1) | 237.1 | 232.7 | 286.9 | 305.8 | 268 | - | - | - |
| 3 |  |  |  | attack:ヤンバル:wild_claw->ヤンバル | attackTarget:player-front-left:ヤンバルLv1HP3(act1/1) | 157.1 | 206.6 | 305.9 | 305.8 | 306 | - | - | - |
| 4 |  |  |  | attack:ドノマンティス:attack->ヤンバル | attackTarget:player-front-left:ヤンバルLv1HP3(act1/1) | 157.1 | 110.7 | 210 | 226.8 | 193.2 | - | - | - |

### seed 994303 / challenger-as-player / step 44 / turn 5

- elapsed: 3293.2ms / inspection 3310.7ms
- state: turn 5 / current player / HP player/cpu 10/9 / stones player/cpu 7/0 / deck player/cpu 21/21 / hand player/cpu 5/4
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- rolloutTriggered: false, adopted: true
- decision: focus:真勇者ダイン
- fallback: focus:真勇者ダイン (323.1)
- planner selected: focus:真勇者ダイン (311.5)
- root gap to fallback: 136.9
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:真勇者ダイン | - | 186.2 | 311.5 | 271.9 | 270.8 | 273 | - | - | - |
| 2 |  |  |  | attack:ピグミィ:スパイクボール->真勇者ダイン | attackTarget:cpu-front-left:真勇者ダインLv1HP6(act0/1,focus) | 95.5 | 287.5 | 271.9 | 270.8 | 273 | - | - | - |
| 3 |  |  |  | summon:真勇者ダイン->player_back_right | summon:真勇者ダイン->back-right; noBacklineReach; behindOwnFront:ヤンバルLv1HP3(act0/1); sameLaneEnemyFront:デスシープLv1HP6(act1/1,focus); after:prepared | 92.8 | 285.6 | 271.9 | 270.8 | 273 | - | - | - |
| 4 |  |  |  | summon:ドノマンティス->player_back_right | summon:ドノマンティス->back-right; noBacklineReach; behindOwnFront:ヤンバルLv1HP3(act0/1); sameLaneEnemyFront:デスシープLv1HP6(act1/1,focus); after:prepared | 85.2 | 275.3 | 267.1 | 267.2 | 267 | - | - | - |

### seed 994305 / challenger-as-player / step 77 / turn 8

- elapsed: 3353.3ms / inspection 3372.7ms
- state: turn 8 / current player / HP player/cpu 10/9 / stones player/cpu 11/0 / deck player/cpu 18/18 / hand player/cpu 4/5
- board: player_front_left:PF:ピグミィ Lv2 HP3 act0/2 | player_front_right:PF:ボムゾウ Lv1 HP6 act0/1 | player_back_right:PB:ボムゾウ Lv1 HP6 act0/1 | cpu_front_left:CF:ボムゾウ Lv2 HP2 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP2 act2/2 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 focus
- rolloutTriggered: false, adopted: true
- decision: master:master_attack->monster:cpu_front_left
- fallback: master:master_attack->monster:cpu_front_left (837.7)
- planner selected: master:master_attack->monster:cpu_front_left (410)
- root gap to fallback: 340.7
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | master:master_attack->monster:cpu_front_left | - | 497 | 410 | 370.4 | 378.2 | 362.6 | - | - | - |
| 2 |  |  |  | focus:ボムゾウ | - | 186.2 | 294.6 | 370.4 | 378.2 | 362.6 | - | - | - |
| 3 |  |  |  | attack:ボムゾウ:storm_bomb->ボムゾウ | attackTarget:cpu-front-left:ボムゾウLv2HP2(act1/1) | 244.6 | 292.8 | 339.4 | 328.2 | 350.6 | - | - | - |
| 4 |  |  |  | attack:ボムゾウ:storm_bomb->ボムゾウ | attackTarget:cpu-front-left:ボムゾウLv2HP2(act1/1) | 164.6 | 202.4 | 292.4 | 300.2 | 284.6 | - | - | - |

### seed 994305 / challenger-as-player / step 103 / turn 10

- elapsed: 3419ms / inspection 3417.9ms
- state: turn 10 / current player / HP player/cpu 10/9 / stones player/cpu 4/1 / deck player/cpu 16/16 / hand player/cpu 4/4
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 prep | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 shield | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2
- rolloutTriggered: false, adopted: true
- decision: focus:ドノマンティス
- fallback: focus:ドノマンティス (200.7)
- planner selected: focus:ドノマンティス (135.3)
- root gap to fallback: 19.9
- planner margin to fallback: 0

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y | Y | focus:ドノマンティス | - | 180.8 | 135.3 | 95.7 | 137.2 | 54.2 | - | - | - |
| 2 |  |  |  | summon:ポリスピナー->player_back_left | summon:ポリスピナー->back-left; noBacklineReach; behindOwnFront:ボムゾウLv1HP6(act0/1); sameLaneEnemyFront:デスシープLv1HP6(prep); after:prepared | 75 | 105.3 | 101.7 | 149.2 | 54.2 | - | - | - |
| 3 |  |  |  | summon:ポリスピナー->player_back_left | summon:ポリスピナー->back-left; noBacklineReach; behindOwnFront:ボムゾウLv1HP6(act0/1); sameLaneEnemyFront:デスシープLv1HP6(prep); after:prepared | 75 | 105.3 | 101.7 | 149.2 | 54.2 | - | - | - |
| 4 |  |  |  | focus:デスシープ | - | 44 | 77 | 95.7 | 137.2 | 54.2 | - | - | - |

### seed 994305 / challenger-as-player / step 266 / turn 22

- elapsed: 3160.3ms / inspection 2918.1ms
- state: turn 22 / current player / HP player/cpu 5/8 / stones player/cpu 5/4 / deck player/cpu 4/4 / hand player/cpu 6/5
- board: player_front_left:PF:ドノマンティス Lv2 HP5 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 | player_back_left:PB:ピグミィ Lv2 HP1 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP5 act1/1 focus | cpu_front_right:CF:デスシープ Lv2 HP3 act1/1 | cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2
- rolloutTriggered: false, adopted: false
- decision: focus:ドノマンティス
- fallback: focus:ドノマンティス (347.9)
- planner selected: move:player_front_right->player_back_right (428.6)
- root gap to fallback: 275.4
- planner margin to fallback: 16.8

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 |  | Y |  | move:player_front_right->player_back_right | move:player-front-right->player-back-right; mover:ピグミィLv2HP3(act0/2) | 72.5 | 428.6 | 425.9 | 417.8 | 434 | - | - | - |
| 2 | Y |  | Y | focus:ドノマンティス | - | 179 | 411.8 | 372.4 | 377.8 | 367 | - | - | - |
| 3 |  |  |  | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-right:デスシープLv2HP3(act1/1) | 109 | 402.4 | 378.4 | 389.8 | 367 | - | - | - |
| 4 |  |  |  | attack:ピグミィ:スパイクボール->デスシープ | attackTarget:cpu-front-left:デスシープLv1HP5(act1/1,focus) | 86.5 | 123 | 110.2 | 309.8 | 201 | - | - | - |

### seed 994306 / challenger-as-player / step 83 / turn 8

- elapsed: 78688.4ms / inspection 77595ms
- state: turn 8 / current player / HP player/cpu 9/10 / stones player/cpu 7/1 / deck player/cpu 18/18 / hand player/cpu 5/5
- board: player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv2 HP3 act0/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- rolloutTriggered: true, adopted: true
- decision: summon:ボムゾウ->player_back_right
- fallback: move:player_front_right->player_back_left (333.6)
- planner selected: summon:ボムゾウ->player_back_right (115.6)
- root gap to fallback: 245.8
- planner margin to fallback: 43.6
- selected rollout gap to fallback: 278.2

| rank | cpu | planner | fallback | decision | features | root | planner score | response | own | opp | rollout | score | gap |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 1 | Y | Y |  | summon:ボムゾウ->player_back_right | summon:ボムゾウ->back-right; backlineReach; behindOwnFront:ヤンバルLv2HP3(act0/1); sameLaneEnemyFront:デスシープLv2HP6(act1/1); after:prepared; fallbackMove:player-front-right->player-back-left:keepsTo | 87.8 | 115.6 | 97.9 | 143.4 | 52.4 | - | -10.8 | 278.2 |
| 2 |  |  |  | summon:ボムゾウ->player_back_left | summon:ボムゾウ->back-left; backlineReach; behindOwnFront:ヤンバルLv1HP3(act0/1); sameLaneEnemyFront:ドノマンティスLv2HP5(act1/1,shield); after:prepared; fallbackMove:player-front-right->player-back-left:blocksTo | 87.8 | 78.8 | 97.9 | 143.4 | 52.4 | - | -255.8 | 33.2 |
| 3 |  |  | Y | move:player_front_right->player_back_left | move:player-front-right->player-back-left; mover:ヤンバルLv2HP3(act0/1); fallbackMove:player-front-right->player-back-left:keepsTo | 112 | 72 | 90.7 | 125 | 56.4 | - | -289 | 0 |

