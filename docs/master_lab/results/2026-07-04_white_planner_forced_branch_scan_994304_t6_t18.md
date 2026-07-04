# White Planner Forced Branch Scan

生成: 2026-07-04T08:42:33.111Z
deck: `master-lab-white-1377-death-sheep3`
turnRange: 6-18
branchTop: 3
maxReplaySteps: 220
improvementThreshold: 180

## Conclusion

- 8 states scanned. promising 2件、winner flip 2件。
- winner flip または大きい score delta の局面だけを、評価概念へ還元して小規模実装候補にする。

## Promising

| seed | direction | step | turn | selected | best | delta | selected winner | best winner |
| ---: | --- | ---: | ---: | --- | --- | ---: | --- | --- |
| 994304 | challenger-as-cpu | 101 | 9 | attack:ポリスピナー:attack->ボムゾウ | summon:デスシープ->cpu_back_left | 2000000 | white | white_planner |
| 994304 | challenger-as-cpu | 103 | 9 | focus:ドノマンティス | summon:デスシープ->cpu_back_left | 2000000 | white | white_planner |

## Samples

### 994304 challenger-as-cpu

- plannerSide: cpu
- capturedStates: 8

#### step 67 / turn 6

- state: turn 6 / current cpu / HP cpu/player 10/10 / stones cpu/player 2/1 / deck cpu/player 19/20 / hand cpu/player 4/3
- board: player_front_left:PF:ポリスピナー Lv1 HP3 act0/2 | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP1 act0/1 | cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1
- selected: attack:真勇者ダイン:ダイン斬り->ポリスピナー
- best: attack:真勇者ダイン:ダイン斬り->ポリスピナー
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:真勇者ダイン:ダイン斬り->ポリスピナー | 757.1 | white | -1000000 | 188 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | attack:ボムゾウ:storm_bomb->ポリスピナー | 563.9 | white | -1000000 | 189 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | summon:ボムゾウ->cpu_back_left | 459.4 | white | -1000000 | 188 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |

#### step 78 / turn 7

- state: turn 7 / current cpu / HP cpu/player 10/10 / stones cpu/player 4/1 / deck cpu/player 18/19 / hand cpu/player 4/3
- board: player_front_left:PF:ボムゾウ Lv1 HP6 prep | player_front_right:PF:デスシープ Lv2 HP6 act1/1 shield | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv3 HP4 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP6 act0/1 focus | cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1
- selected: attack:真勇者ダイン:ダイン斬り->player master
- best: attack:真勇者ダイン:ダイン斬り->player master
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:真勇者ダイン:ダイン斬り->player master | 367.4 | white | -1000000 | 177 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | magic:ローテーション->master:cpu | 338.9 | white | -1000000 | 177 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | summon:ドノマンティス->cpu_back_right | 274.2 | white | -1000000 | 165 | turn 26 / current cpu / HP cpu/player 0/8 / stones cpu/player 19/22 / deck cpu/player 0/0 / hand cpu/player 5/5 |

#### step 80 / turn 7

- state: turn 7 / current cpu / HP cpu/player 10/8 / stones cpu/player 1/3 / deck cpu/player 18/19 / hand cpu/player 3/3
- board: player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP6 prep | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:デスシープ Lv2 HP6 act1/1 shield | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_front_right:CF:真勇者ダイン Lv3 HP4 act1/1 | cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus
- selected: attack:ボムゾウ:storm_bomb->ヤンバル
- best: attack:ボムゾウ:storm_bomb->ヤンバル
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ボムゾウ:storm_bomb->ヤンバル | 513.2 | white | -1000000 | 175 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | attack:ボムゾウ:self_bomb->ヤンバル | 464.4 | white | -1000000 | 108 | turn 19 / current player / HP cpu/player 0/5 / stones cpu/player 20/17 / deck cpu/player 7/7 / hand cpu/player 5/6 |
| 3 |  | summon:ドノマンティス->cpu_back_left | 282.8 | white | -1000000 | 163 | turn 26 / current cpu / HP cpu/player 0/8 / stones cpu/player 19/22 / deck cpu/player 0/0 / hand cpu/player 5/5 |

#### step 91 / turn 8

- state: turn 8 / current cpu / HP cpu/player 10/8 / stones cpu/player 6/0 / deck cpu/player 17/18 / hand cpu/player 4/3
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP6 act0/1
- selected: summon:ドノマンティス->cpu_back_left
- best: summon:ドノマンティス->cpu_back_left
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ドノマンティス->cpu_back_left | 91.7 | white | -1000000 | 164 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | summon:ドノマンティス->cpu_back_right | 91.7 | white | -1000000 | 198 | turn 26 / current cpu / HP cpu/player 0/8 / stones cpu/player 22/15 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | summon:ポリスピナー->cpu_back_left | 87.2 | white | -1000000 | 198 | turn 26 / current cpu / HP cpu/player 0/8 / stones cpu/player 22/15 / deck cpu/player 0/0 / hand cpu/player 5/5 |

#### step 101 / turn 9

- state: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 10/0 / deck cpu/player 16/17 / hand cpu/player 3/4
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:ボムゾウ Lv1 HP4 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2
- selected: attack:ポリスピナー:attack->ボムゾウ
- best: summon:デスシープ->cpu_back_left
- scoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ポリスピナー:attack->ボムゾウ | 529.6 | white | -1000000 | 154 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | focus:ドノマンティス | 506 | white | -1000000 | 154 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | summon:デスシープ->cpu_back_left | 341.6 | white_planner | 1000000 | 176 | turn 25 / current cpu / HP cpu/player 6/0 / stones cpu/player 8/12 / deck cpu/player 0/1 / hand cpu/player 6/5 |

#### step 103 / turn 9

- state: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 9/1 / deck cpu/player 16/17 / hand cpu/player 3/4
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2
- selected: focus:ドノマンティス
- best: summon:デスシープ->cpu_back_left
- scoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | focus:ドノマンティス | 314.8 | white | -1000000 | 152 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | summon:デスシープ->cpu_back_left | 209.9 | white_planner | 1000000 | 163 | turn 23 / current cpu / HP cpu/player 9/0 / stones cpu/player 9/9 / deck cpu/player 2/3 / hand cpu/player 6/5 |
| 3 |  | summon:デスシープ->cpu_back_right | 209.9 | white | -1000000 | 199 | turn 26 / current player / HP cpu/player 0/5 / stones cpu/player 29/9 / deck cpu/player 0/0 / hand cpu/player 5/6 |

#### step 105 / turn 9

- state: turn 9 / current cpu / HP cpu/player 10/8 / stones cpu/player 8/1 / deck cpu/player 16/17 / hand cpu/player 2/4
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 focus | cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 | cpu_back_left:CB:デスシープ Lv1 HP6 prep
- selected: summon:ポリスピナー->cpu_back_right
- best: summon:ポリスピナー->cpu_back_right
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ポリスピナー->cpu_back_right | 75 | white | -1000000 | 150 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | master:master_attack->monster:player_front_left | -86.7 | white | -1000000 | 161 | turn 27 / current player / HP cpu/player 0/4 / stones cpu/player 18/19 / deck cpu/player 0/0 / hand cpu/player 5/5 |

#### step 115 / turn 10

- state: turn 10 / current cpu / HP cpu/player 10/8 / stones cpu/player 13/0 / deck cpu/player 15/16 / hand cpu/player 2/4
- board: player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 prep | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus
- selected: summon:ピグミィ->cpu_back_left
- best: summon:ピグミィ->cpu_back_left
- scoreDelta: 0

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | summon:ピグミィ->cpu_back_left | 169.5 | white | -1000000 | 140 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | summon:ピグミィ->cpu_back_right | 169.5 | white | -1000000 | 141 | turn 28 / current cpu / HP cpu/player 0/3 / stones cpu/player 26/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | attack:ポリスピナー:attack->player master | 124.2 | white | -1000000 | 169 | turn 27 / current player / HP cpu/player 0/5 / stones cpu/player 20/12 / deck cpu/player 0/0 / hand cpu/player 5/5 |


