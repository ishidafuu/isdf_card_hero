# White Planner Branch Timeline

生成: 2026-07-06T15:03:51.700Z
seed: 994333
direction: challenger-as-player
step: 203
deck: `master-lab-white-1377-death-sheep3`
search: `{}`
plannerSide: player

## Start

- state: turn 17 / current player / HP player/cpu 2/4 / stones player/cpu 14/6 / deck player/cpu 9/9 / hand player/cpu 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus,shield | cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1
- selected: attack:真勇者ダイン:ダイン斬り->cpu master

## Conclusion

- 同一局面から候補を強制し、planner側の次手番ごとの状態差を追跡した。
- selected: attack:真勇者ダイン:ダイン斬り->cpu master -> white / score -1000000
- attack:真勇者ダイン:ダイン斬り->真勇者ダイン: - -> no winner / score -Infinity
- attack:ピグミィ:スパイクボール->真勇者ダイン: - -> no winner / score -Infinity
- master:master_attack->monster:cpu_front_right: - -> no winner / score -Infinity
- master:shield: - -> no winner / score -Infinity
- end_turn: end_turn -> white / score -1000000

## Timelines

### selected

- matched: attack:真勇者ダイン:ダイン斬り->cpu master
- rootScore: 636.1
- winner: white
- finalScore: -1000000
- replaySteps: 3
- finalState: turn 17 / current cpu / HP player/cpu 0/2 / stones player/cpu 16/11 / deck player/cpu 9/8 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | 72 | end_turn | turn 17 / current player / HP player/cpu 2/2 / stones player/cpu 14/8 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus,shield \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 1 | planner decision | 72 | end_turn | turn 17 / current player / HP player/cpu 2/2 / stones player/cpu 14/8 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus,shield \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 3 | final | -1000000 | - | turn 17 / current cpu / HP player/cpu 0/2 / stones player/cpu 16/11 / deck player/cpu 9/8 / hand player/cpu 5/6 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | CPUの真勇者ダイン Lv3: ダイン斬り 4P / プレイヤーのマスターHPが2減った（ダイン斬り）。ストーン+2 / CPUの勝利 |

### attack:真勇者ダイン:ダイン斬り->真勇者ダイン

- matched: -
- rootScore: -Infinity
- winner: -
- finalScore: -Infinity
- replaySteps: 0
- finalState: turn 17 / current player / HP player/cpu 2/4 / stones player/cpu 14/6 / deck player/cpu 9/9 / hand player/cpu 6/5

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |

### attack:ピグミィ:スパイクボール->真勇者ダイン

- matched: -
- rootScore: -Infinity
- winner: -
- finalScore: -Infinity
- replaySteps: 0
- finalState: turn 17 / current player / HP player/cpu 2/4 / stones player/cpu 14/6 / deck player/cpu 9/9 / hand player/cpu 6/5

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |

### master:master_attack->monster:cpu_front_right

- matched: -
- rootScore: -Infinity
- winner: -
- finalScore: -Infinity
- replaySteps: 0
- finalState: turn 17 / current player / HP player/cpu 2/4 / stones player/cpu 14/6 / deck player/cpu 9/9 / hand player/cpu 6/5

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |

### master:shield

- matched: -
- rootScore: -Infinity
- winner: -
- finalScore: -Infinity
- replaySteps: 0
- finalState: turn 17 / current player / HP player/cpu 2/4 / stones player/cpu 14/6 / deck player/cpu 9/9 / hand player/cpu 6/5

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |

### end_turn

- matched: end_turn
- rootScore: -851657.3
- winner: white
- finalScore: -1000000
- replaySteps: 2
- finalState: turn 17 / current cpu / HP player/cpu 0/4 / stones player/cpu 16/9 / deck player/cpu 9/8 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | -80 | - | turn 17 / current cpu / HP player/cpu 2/4 / stones player/cpu 14/9 / deck player/cpu 9/8 / hand player/cpu 5/6 | player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 focus \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act0/1 | CPUはストーンを3個得た / ドノマンティス Lv1の防御効果が切れた / CPUはカードを引いた |
| 2 | final | -1000000 | - | turn 17 / current cpu / HP player/cpu 0/4 / stones player/cpu 16/9 / deck player/cpu 9/8 / hand player/cpu 5/6 | player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 focus \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | CPUの真勇者ダイン Lv3: ダイン斬り 4P / プレイヤーのマスターHPが2減った（ダイン斬り）。ストーン+2 / CPUの勝利 |


