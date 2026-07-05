# White Planner Forced Branch Scan

生成: 2026-07-05T22:51:49.128Z
deck: `master-lab-white-1377-death-sheep3`
turnRange: 24-31
branchTop: 4
maxReplaySteps: 220
improvementThreshold: 120

## Conclusion

- 8 states scanned. 勝敗反転または閾値以上の改善候補は見つからない。
- 次は turn 範囲か seed を広げる、または相手手番込みの二手番プラン探索へ移る。

## Promising

- なし

## Samples

### 994315 challenger-as-cpu

- plannerSide: cpu
- capturedStates: 8

#### step 298 / turn 24

- state: turn 24 / current cpu / HP cpu/player 8/10 / stones cpu/player 10/10 / deck cpu/player 1/2 / hand cpu/player 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_right:CF:ボムゾウ Lv2 HP5 act0/1 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- selected: attack:ピグミィ:スパイクボール->ドノマンティス
- best: attack:ピグミィ:スパイクボール->ボムゾウ
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | attack:ピグミィ:スパイクボール->ボムゾウ | -9.4 | white | -1000000 | 29 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | attack:ピグミィ:スパイクボール->ボムゾウ | -9.4 | white | -1000000 | 29 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 | Y | attack:ピグミィ:スパイクボール->ドノマンティス | -30.4 | white | -1000000 | 29 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 4 |  | attack:ピグミィ:スパイクボール->ドノマンティス | -30.4 | white | -1000000 | 29 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |

#### step 299 / turn 24

- state: turn 24 / current cpu / HP cpu/player 8/10 / stones cpu/player 10/10 / deck cpu/player 1/2 / hand cpu/player 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_right:CF:ボムゾウ Lv2 HP5 act0/1 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- selected: attack:ピグミィ:スパイクボール->ボムゾウ
- best: attack:ピグミィ:スパイクボール->ボムゾウ
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | attack:ピグミィ:スパイクボール->ボムゾウ | 32.5 | white | -1000000 | 28 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 | Y | attack:ピグミィ:スパイクボール->ボムゾウ | 10.7 | white | -1000000 | 28 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | attack:ボムゾウ:self_bomb->player master | -185.7 | white | -1000000 | 28 | turn 30 / current cpu / HP cpu/player 0/4 / stones cpu/player 40/25 / deck cpu/player 0/0 / hand cpu/player 4/5 |
| 4 |  | attack:ボムゾウ:self_bomb->ボムゾウ | -368.4 | white | -1000000 | 28 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |

#### step 300 / turn 24

- state: turn 24 / current cpu / HP cpu/player 8/10 / stones cpu/player 10/10 / deck cpu/player 1/2 / hand cpu/player 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:ボムゾウ Lv1 HP6 act0/1 | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_right:CF:ボムゾウ Lv2 HP5 act0/1 focus | cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2
- selected: attack:ボムゾウ:self_bomb->ボムゾウ
- best: attack:ボムゾウ:self_bomb->ボムゾウ
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ボムゾウ:self_bomb->ボムゾウ | -50.3 | white | -1000000 | 27 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | attack:ボムゾウ:self_bomb->player master | -170 | white | -1000000 | 27 | turn 30 / current cpu / HP cpu/player 0/4 / stones cpu/player 40/25 / deck cpu/player 0/0 / hand cpu/player 4/5 |

#### step 301 / turn 24

- state: turn 24 / current cpu / HP cpu/player 8/10 / stones cpu/player 10/10 / deck cpu/player 1/2 / hand cpu/player 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:ボムゾウ Lv1 HP2 act0/1 | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_right:CF:ボムゾウ Lv2 HP2 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2
- selected: attack:ヤンバル:wild_claw->ボムゾウ
- best: attack:ヤンバル:wild_claw->ボムゾウ
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ヤンバル:wild_claw->ボムゾウ | 788 | white | -1000000 | 26 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | attack:ピグミィ:スパイクボール->ボムゾウ | 589.9 | white | -1000000 | 27 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | attack:ピグミィ:スパイクボール->ボムゾウ | 589.9 | white | -1000000 | 27 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 4 |  | master:master_attack->monster:player_front_right | 532.8 | white | -1000000 | 25 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 42/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |

#### step 302 / turn 24

- state: turn 24 / current cpu / HP cpu/player 8/10 / stones cpu/player 9/11 / deck cpu/player 1/2 / hand cpu/player 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_left:CF:ヤンバル Lv2 HP3 act1/1 | cpu_front_right:CF:ボムゾウ Lv2 HP2 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2
- selected: master:shield->monster:cpu_front_right
- best: master:shield->monster:cpu_front_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_front_right | 230.4 | white | -1000000 | 25 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | master:shield->monster:cpu_front_left | 222.3 | white | -1000000 | 25 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |

#### step 303 / turn 24

- state: turn 24 / current cpu / HP cpu/player 8/10 / stones cpu/player 7/11 / deck cpu/player 1/2 / hand cpu/player 6/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_left:CF:ヤンバル Lv2 HP3 act1/1 | cpu_front_right:CF:ボムゾウ Lv2 HP2 act1/1 shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2
- selected: master:shield->monster:cpu_front_left
- best: master:shield->monster:cpu_front_left
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:cpu_front_left | 155.8 | white | -1000000 | 24 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |

#### step 318 / turn 29

- state: turn 29 / current cpu / HP cpu/player 4/7 / stones cpu/player 28/23 / deck cpu/player 0/0 / hand cpu/player 5/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ボムゾウ Lv2 HP2 act0/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2 focus
- selected: attack:ボムゾウ:self_bomb->player master
- best: attack:ボムゾウ:self_bomb->player master
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ボムゾウ:self_bomb->player master | -398.6 | white | -1000000 | 9 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |

#### step 324 / turn 31

- state: turn 31 / current cpu / HP cpu/player 1/3 / stones cpu/player 39/33 / deck cpu/player 0/0 / hand cpu/player 5/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus
- selected: attack:ピグミィ:スパイクボール->ドノマンティス
- best: attack:ピグミィ:スパイクボール->ドノマンティス
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ピグミィ:スパイクボール->ドノマンティス | 1777.5 | white | -1000000 | 3 | turn 32 / current cpu / HP cpu/player 0/2 / stones cpu/player 43/37 / deck cpu/player 0/0 / hand cpu/player 5/5 |


