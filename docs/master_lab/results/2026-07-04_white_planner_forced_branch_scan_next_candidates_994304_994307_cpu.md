# White Planner Forced Branch Scan

生成: 2026-07-04T15:06:49.576Z
deck: `master-lab-white-1377-death-sheep3`
turnRange: 7-12
branchTop: 3
maxReplaySteps: 120
improvementThreshold: 180

## Conclusion

- 8 states scanned. 勝敗反転または閾値以上の改善候補は見つからない。
- 次は turn 範囲か seed を広げる、または相手手番込みの二手番プラン探索へ移る。

## Promising

- なし

## Samples

### 994304 challenger-as-cpu

- plannerSide: cpu
- capturedStates: 2

#### step 79 / turn 7

- state: turn 7 / current cpu / HP cpu/player 10/8 / stones cpu/player 4/3 / deck cpu/player 18/19 / hand cpu/player 4/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 prep | player_front_right:PF:デスシープ Lv2 HP6 act1/1 shield | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv3 HP4 act1/1 | cpu_front_right:CF:ボムゾウ Lv1 HP6 act0/1 focus | cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1
- selected: magic:ローテーション->master:cpu
- best: magic:ローテーション->master:cpu
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | magic:ローテーション->master:cpu | 340.4 | - | 123.2 | 120 | turn 16 / current player / HP cpu/player 10/7 / stones cpu/player 5/0 / deck cpu/player 10/10 / hand cpu/player 4/4 |
| 2 |  | summon:ドノマンティス->cpu_back_right | 97.2 | - | -583 | 120 | turn 17 / current cpu / HP cpu/player 5/8 / stones cpu/player 2/5 / deck cpu/player 8/9 / hand cpu/player 5/5 |
| 3 |  | summon:ポリスピナー->cpu_back_right | 92 | - | -608 | 120 | turn 19 / current player / HP cpu/player 4/7 / stones cpu/player 3/20 / deck cpu/player 7/7 / hand cpu/player 5/6 |

#### step 81 / turn 7

- state: turn 7 / current cpu / HP cpu/player 10/8 / stones cpu/player 1/3 / deck cpu/player 18/19 / hand cpu/player 3/3
- board: player_front_left:PF:ヤンバル Lv1 HP2 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP6 prep | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:デスシープ Lv2 HP6 act1/1 shield | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_front_right:CF:真勇者ダイン Lv3 HP4 act1/1 | cpu_back_right:CB:ボムゾウ Lv1 HP6 act1/1
- selected: attack:ボムゾウ:self_bomb->ヤンバル
- best: attack:ボムゾウ:self_bomb->ヤンバル
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ボムゾウ:self_bomb->ヤンバル | 641.1 | - | 278 | 120 | turn 16 / current cpu / HP cpu/player 10/7 / stones cpu/player 5/2 / deck cpu/player 9/10 / hand cpu/player 5/4 |
| 2 |  | summon:ドノマンティス->cpu_back_left | 319.3 | - | -411 | 120 | turn 17 / current cpu / HP cpu/player 5/8 / stones cpu/player 1/6 / deck cpu/player 8/9 / hand cpu/player 5/5 |
| 3 |  | summon:ポリスピナー->cpu_back_left | 314.1 | - | -618 | 120 | turn 19 / current cpu / HP cpu/player 4/7 / stones cpu/player 6/20 / deck cpu/player 6/7 / hand cpu/player 6/5 |

### 994305 challenger-as-cpu

- plannerSide: cpu
- capturedStates: 2

#### step 71 / turn 7

- state: turn 7 / current cpu / HP cpu/player 9/10 / stones cpu/player 3/7 / deck cpu/player 18/19 / hand cpu/player 6/3
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:ボムゾウ Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP2 act0/2 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act0/1
- selected: focus:ヤンバル
- best: focus:ヤンバル
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | focus:ヤンバル | -88 | - | 354.4 | 120 | turn 16 / current cpu / HP cpu/player 8/8 / stones cpu/player 3/2 / deck cpu/player 9/10 / hand cpu/player 4/4 |
| 2 |  | attack:ヤンバル:wild_claw->デスシープ | 128.4 | - | 129.8 | 120 | turn 16 / current player / HP cpu/player 7/9 / stones cpu/player 2/3 / deck cpu/player 10/10 / hand cpu/player 4/4 |
| 3 |  | attack:ピグミィ:スパイクボール->デスシープ | 8.4 | - | 144.8 | 120 | turn 16 / current cpu / HP cpu/player 9/8 / stones cpu/player 2/1 / deck cpu/player 9/10 / hand cpu/player 4/5 |
| 4 |  | attack:ボムゾウ:self_bomb->デスシープ | -37.8 | - | -86 | 120 | turn 16 / current cpu / HP cpu/player 8/9 / stones cpu/player 7/1 / deck cpu/player 9/10 / hand cpu/player 5/5 |

#### step 73 / turn 7

- state: turn 7 / current cpu / HP cpu/player 9/10 / stones cpu/player 3/7 / deck cpu/player 18/19 / hand cpu/player 6/3
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ボムゾウ Lv1 HP6 prep | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_back_left:CB:ピグミィ Lv1 HP2 act1/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 focus
- selected: master:master_attack->monster:player_front_left
- best: master:master_attack->monster:player_front_left
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | master:master_attack->monster:player_front_left | 299.7 | - | 374.4 | 120 | turn 16 / current cpu / HP cpu/player 8/8 / stones cpu/player 1/2 / deck cpu/player 9/10 / hand cpu/player 4/4 |
| 2 |  | focus:ピグミィ | -88 | - | 374.4 | 120 | turn 16 / current cpu / HP cpu/player 8/8 / stones cpu/player 1/2 / deck cpu/player 9/10 / hand cpu/player 4/4 |
| 3 |  | attack:ボムゾウ:self_bomb->デスシープ | -109.4 | - | 374.4 | 120 | turn 16 / current cpu / HP cpu/player 8/8 / stones cpu/player 1/2 / deck cpu/player 9/10 / hand cpu/player 4/4 |

### 994306 challenger-as-cpu

- plannerSide: cpu
- capturedStates: 2

#### step 77 / turn 7

- state: turn 7 / current cpu / HP cpu/player 10/9 / stones cpu/player 7/1 / deck cpu/player 18/19 / hand cpu/player 6/4
- board: player_front_left:PF:ボムゾウ Lv2 HP1 act1/1 shield | player_front_right:PF:ピグミィ Lv1 HP3 prep | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- selected: attack:ドノマンティス:attack->ボムゾウ
- best: attack:ドノマンティス:attack->ボムゾウ
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ドノマンティス:attack->ボムゾウ | 1021.8 | white_planner | 1000000 | 98 | turn 22 / current cpu / HP cpu/player 6/0 / stones cpu/player 31/33 / deck cpu/player 3/4 / hand cpu/player 6/5 |
| 2 |  | master:wake_up->monster:player_front_right | 794.1 | white_planner | 1000000 | 98 | turn 22 / current cpu / HP cpu/player 6/0 / stones cpu/player 31/33 / deck cpu/player 3/4 / hand cpu/player 6/5 |
| 3 |  | master:master_attack->monster:player_front_left | 729.6 | white_planner | 1000000 | 112 | turn 18 / current cpu / HP cpu/player 8/0 / stones cpu/player 13/13 / deck cpu/player 7/8 / hand cpu/player 6/5 |

#### step 79 / turn 7

- state: turn 7 / current cpu / HP cpu/player 10/9 / stones cpu/player 4/3 / deck cpu/player 18/19 / hand cpu/player 6/4
- board: player_front_right:PF:ピグミィ Lv1 HP3 act0/2 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:ドノマンティス Lv2 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1
- selected: attack:デスシープ:attack->ピグミィ
- best: attack:デスシープ:attack->ピグミィ
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:デスシープ:attack->ピグミィ | 628.2 | white_planner | 1000000 | 96 | turn 22 / current cpu / HP cpu/player 6/0 / stones cpu/player 31/33 / deck cpu/player 3/4 / hand cpu/player 6/5 |
| 2 |  | summon:ヤンバル->cpu_back_left | 463.3 | white_planner | 1000000 | 96 | turn 22 / current cpu / HP cpu/player 6/0 / stones cpu/player 31/33 / deck cpu/player 3/4 / hand cpu/player 6/5 |
| 3 |  | summon:ポリスピナー->cpu_back_left | 400.9 | - | -73.4 | 120 | turn 18 / current player / HP cpu/player 5/7 / stones cpu/player 3/4 / deck cpu/player 8/8 / hand cpu/player 4/5 |

### 994307 challenger-as-cpu

- plannerSide: cpu
- capturedStates: 2

#### step 76 / turn 7

- state: turn 7 / current cpu / HP cpu/player 10/10 / stones cpu/player 3/0 / deck cpu/player 18/19 / hand cpu/player 5/5
- board: player_front_left:PF:ヤンバル Lv1 HP1 act1/1 | player_front_right:PF:真勇者ダイン Lv2 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:デスシープ Lv2 HP6 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act0/2
- selected: attack:デスシープ:attack->ヤンバル
- best: attack:デスシープ:attack->ヤンバル
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:デスシープ:attack->ヤンバル | 661.6 | - | 17.4 | 120 | turn 17 / current cpu / HP cpu/player 7/8 / stones cpu/player 4/0 / deck cpu/player 8/9 / hand cpu/player 5/5 |
| 2 |  | attack:ピグミィ:スパイクボール->ヤンバル | 509.1 | - | -511 | 120 | turn 16 / current cpu / HP cpu/player 6/10 / stones cpu/player 8/0 / deck cpu/player 9/10 / hand cpu/player 6/5 |
| 3 |  | attack:ピグミィ:スパイクボール->真勇者ダイン | 476.4 | - | 17.4 | 120 | turn 17 / current cpu / HP cpu/player 7/8 / stones cpu/player 4/0 / deck cpu/player 8/9 / hand cpu/player 5/5 |

#### step 78 / turn 7

- state: turn 7 / current cpu / HP cpu/player 10/10 / stones cpu/player 2/1 / deck cpu/player 18/19 / hand cpu/player 5/5
- board: player_front_right:PF:真勇者ダイン Lv2 HP6 act0/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:デスシープ Lv2 HP6 act1/1 | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2
- selected: summon:ボムゾウ->cpu_back_left
- best: summon:ボムゾウ->cpu_back_left
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ボムゾウ->cpu_back_left | 81.8 | - | 24.2 | 120 | turn 17 / current cpu / HP cpu/player 7/8 / stones cpu/player 4/0 / deck cpu/player 8/9 / hand cpu/player 5/5 |
| 2 |  | summon:ボムゾウ->cpu_back_left | 81.8 | - | 24.2 | 120 | turn 17 / current cpu / HP cpu/player 7/8 / stones cpu/player 4/0 / deck cpu/player 8/9 / hand cpu/player 5/5 |
| 3 |  | focus:ピグミィ | -13.8 | - | 24.2 | 120 | turn 17 / current cpu / HP cpu/player 7/8 / stones cpu/player 4/0 / deck cpu/player 8/9 / hand cpu/player 5/5 |
