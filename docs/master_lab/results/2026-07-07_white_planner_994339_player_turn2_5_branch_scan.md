# White Planner Forced Branch Scan

生成: 2026-07-07T02:13:19.745Z
deck: `master-lab-white-1377-death-sheep3`
turnRange: 2-5
branchTop: 3
maxReplaySteps: 180
improvementThreshold: 200

## Conclusion

- 10 states scanned. promising 1件、winner flip 1件。
- winner flip または大きい score delta の局面だけを、評価概念へ還元して小規模実装候補にする。

## Promising

| seed | direction | step | turn | selected | best | delta | selected winner | best winner |
| ---: | --- | ---: | ---: | --- | --- | ---: | --- | --- |
| 994339 | challenger-as-player | 13 | 2 | master:shield->monster:player_front_left | master:shield->monster:player_front_right | 2000000 | white | white_planner |

## Samples

### 994339 challenger-as-player

- plannerSide: player
- capturedStates: 10

#### step 8 / turn 2

- state: turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 24/24 / hand player/cpu 3/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ボムゾウ Lv1 HP6 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 prep | cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep
- selected: focus:ポリスピナー
- best: focus:ポリスピナー
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | focus:ポリスピナー | 252 | white | -1000000 | 178 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |
| 2 |  | focus:ボムゾウ | 174.4 | white | -1000000 | 178 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |
| 3 |  | summon:ポリスピナー->player_back_right | 149.3 | white | -1000000 | 178 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |

#### step 9 / turn 2

- state: turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 24/24 / hand player/cpu 3/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act1/2 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ボムゾウ Lv1 HP6 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 prep | cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep
- selected: summon:ポリスピナー->player_back_right
- best: summon:ポリスピナー->player_back_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ポリスピナー->player_back_right | 162.2 | white | -1000000 | 177 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |
| 2 |  | focus:ボムゾウ | 103.2 | white | -1000000 | 177 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |
| 3 |  | attack:ポリスピナー:attack->cpu master | 99.2 | white | -1000000 | 177 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |

#### step 10 / turn 2

- state: turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 2/0 / deck player/cpu 24/24 / hand player/cpu 2/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act1/2 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | player_back_right:PB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:ボムゾウ Lv1 HP6 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 prep | cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep
- selected: attack:ポリスピナー:attack->cpu master
- best: focus:ボムゾウ
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | focus:ボムゾウ | 90.7 | white | -1000000 | 176 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |
| 2 | Y | attack:ポリスピナー:attack->cpu master | 79 | white | -1000000 | 176 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |
| 3 |  | focus:ヤンバル | 40.8 | white | -1000000 | 176 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |

#### step 11 / turn 2

- state: turn 2 / current player / HP player/cpu 10/9 / stones player/cpu 2/1 / deck player/cpu 24/24 / hand player/cpu 2/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act2/2 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | player_back_right:PB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:ボムゾウ Lv1 HP6 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 prep | cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep
- selected: focus:ボムゾウ
- best: focus:ボムゾウ
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | focus:ボムゾウ | 134 | white | -1000000 | 175 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |
| 2 |  | focus:ヤンバル | 83.9 | white | -1000000 | 175 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |

#### step 12 / turn 2

- state: turn 2 / current player / HP player/cpu 10/9 / stones player/cpu 2/1 / deck player/cpu 24/24 / hand player/cpu 2/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act2/2 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | player_back_right:PB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:ボムゾウ Lv1 HP6 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 prep | cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep
- selected: focus:ヤンバル
- best: focus:ヤンバル
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | focus:ヤンバル | 74.3 | white | -1000000 | 174 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |

#### step 13 / turn 2

- state: turn 2 / current player / HP player/cpu 10/9 / stones player/cpu 2/1 / deck player/cpu 24/24 / hand player/cpu 2/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act2/2 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:ボムゾウ Lv1 HP6 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 prep | cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep
- selected: master:shield->monster:player_front_left
- best: master:shield->monster:player_front_right
- scoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:shield->monster:player_front_left | 69.1 | white | -1000000 | 173 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |
| 2 |  | master:shield->monster:player_front_right | 59 | white_planner | 1000000 | 136 | turn 15 / current player / HP player/cpu 7/0 / stones player/cpu 9/14 / deck player/cpu 11/11 / hand player/cpu 6/5 |

#### step 21 / turn 3

- state: turn 3 / current player / HP player/cpu 10/9 / stones player/cpu 4/0 / deck player/cpu 23/23 / hand player/cpu 3/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv1 HP6 act1/1 | cpu_front_right:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 prep
- selected: attack:ボムゾウ:self_bomb->ボムゾウ
- best: attack:ヤンバル:wild_claw->ボムゾウ
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | attack:ヤンバル:wild_claw->ボムゾウ | 154.1 | white | -1000000 | 48 | turn 7 / current cpu / HP player/cpu 0/8 / stones player/cpu 10/3 / deck player/cpu 19/18 / hand player/cpu 4/4 |
| 2 | Y | attack:ボムゾウ:self_bomb->ボムゾウ | 144.4 | white | -1000000 | 165 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |
| 3 |  | focus:ポリスピナー | 99.3 | white | -1000000 | 48 | turn 7 / current cpu / HP player/cpu 0/8 / stones player/cpu 10/3 / deck player/cpu 19/18 / hand player/cpu 4/4 |

#### step 22 / turn 3

- state: turn 3 / current player / HP player/cpu 10/9 / stones player/cpu 4/0 / deck player/cpu 23/23 / hand player/cpu 3/3
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act1/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv1 HP3 act1/1 | cpu_front_right:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 prep
- selected: focus:ポリスピナー
- best: focus:ポリスピナー
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | focus:ポリスピナー | 530.9 | white | -1000000 | 164 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |
| 2 |  | attack:ヤンバル:wild_claw->ボムゾウ | 394.1 | white | -1000000 | 155 | turn 16 / current cpu / HP player/cpu 0/7 / stones player/cpu 12/7 / deck player/cpu 10/9 / hand player/cpu 5/6 |
| 3 |  | master:master_attack->monster:cpu_front_left | 343.2 | white | -1000000 | 164 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |

#### step 23 / turn 3

- state: turn 3 / current player / HP player/cpu 10/9 / stones player/cpu 4/0 / deck player/cpu 23/23 / hand player/cpu 3/3
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act1/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act1/2 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv1 HP3 act1/1 | cpu_front_right:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 prep
- selected: master:master_attack->monster:cpu_front_left
- best: attack:ヤンバル:wild_claw->ボムゾウ
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 |  | attack:ヤンバル:wild_claw->ボムゾウ | 342.3 | white | -1000000 | 154 | turn 16 / current cpu / HP player/cpu 0/7 / stones player/cpu 12/7 / deck player/cpu 10/9 / hand player/cpu 5/6 |
| 2 | Y | master:master_attack->monster:cpu_front_left | 340 | white | -1000000 | 163 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |
| 3 |  | attack:ヤンバル:wild_claw->ドノマンティス | 34.7 | white | -1000000 | 119 | turn 13 / current cpu / HP player/cpu 0/9 / stones player/cpu 11/3 / deck player/cpu 13/12 / hand player/cpu 5/5 |

#### step 24 / turn 3

- state: turn 3 / current player / HP player/cpu 10/9 / stones player/cpu 1/0 / deck player/cpu 23/23 / hand player/cpu 3/3
- board: player_front_left:PF:ボムゾウ Lv1 HP4 act1/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act1/2 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv1 HP1 act1/1 | cpu_front_right:CF:ドノマンティス Lv2 HP5 act1/1 shield | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 prep
- selected: attack:ヤンバル:wild_claw->ボムゾウ
- best: attack:ヤンバル:wild_claw->ボムゾウ
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ヤンバル:wild_claw->ボムゾウ | 447.6 | white | -1000000 | 162 | turn 18 / current cpu / HP player/cpu 0/8 / stones player/cpu 12/7 / deck player/cpu 8/7 / hand player/cpu 5/6 |
| 2 |  | attack:ヤンバル:wild_claw->ドノマンティス | 12.1 | white | -1000000 | 118 | turn 13 / current cpu / HP player/cpu 0/9 / stones player/cpu 11/3 / deck player/cpu 13/12 / hand player/cpu 5/5 |
| 3 |  | attack:ポリスピナー:attack->ドノマンティス | -41.4 | white | -1000000 | 65 | turn 9 / current cpu / HP player/cpu 0/6 / stones player/cpu 9/15 / deck player/cpu 17/16 / hand player/cpu 5/6 |


