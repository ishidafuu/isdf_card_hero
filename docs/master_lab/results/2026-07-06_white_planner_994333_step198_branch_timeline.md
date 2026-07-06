# White Planner Branch Timeline

生成: 2026-07-06T15:03:51.302Z
seed: 994333
direction: challenger-as-player
step: 198
deck: `master-lab-white-1377-death-sheep3`
search: `{}`
plannerSide: player

## Start

- state: turn 16 / current player / HP player/cpu 4/6 / stones player/cpu 9/3 / deck player/cpu 10/10 / hand player/cpu 6/5
- board: player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 prep | cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1
- selected: attack:真勇者ダイン:ダイン斬り->cpu master

## Conclusion

- 同一局面から候補を強制し、planner側の次手番ごとの状態差を追跡した。
- selected: attack:真勇者ダイン:ダイン斬り->cpu master -> white / score -1000000
- attack:真勇者ダイン:ダイン斬り->真勇者ダイン: - -> no winner / score -Infinity
- attack:ピグミィ:スパイクボール->真勇者ダイン: - -> no winner / score -Infinity
- master:shield: - -> no winner / score -Infinity
- end_turn: end_turn -> white / score -1000000

## Timelines

### selected

- matched: attack:真勇者ダイン:ダイン斬り->cpu master
- rootScore: 399.4
- winner: white
- finalScore: -1000000
- replaySteps: 8
- finalState: turn 17 / current cpu / HP player/cpu 0/2 / stones player/cpu 16/11 / deck player/cpu 9/8 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | 124.8 | end_turn | turn 16 / current player / HP player/cpu 4/4 / stones player/cpu 9/5 / deck player/cpu 10/10 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 \| cpu_front_left:CF:ドノマンティス Lv1 HP5 prep \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面103点、次点と313点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 1 | planner decision | 124.8 | end_turn | turn 16 / current player / HP player/cpu 4/4 / stones player/cpu 9/5 / deck player/cpu 10/10 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 \| cpu_front_left:CF:ドノマンティス Lv1 HP5 prep \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面103点、次点と313点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 5 | planner decision | -78 | attack:真勇者ダイン:ダイン斬り->cpu master | turn 17 / current player / HP player/cpu 2/4 / stones player/cpu 14/6 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus,shield \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはスケープゴートを引いた |
| 6 | planner decision | 72 | end_turn | turn 17 / current player / HP player/cpu 2/2 / stones player/cpu 14/8 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus,shield \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 8 | final | -1000000 | - | turn 17 / current cpu / HP player/cpu 0/2 / stones player/cpu 16/11 / deck player/cpu 9/8 / hand player/cpu 5/6 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | CPUの真勇者ダイン Lv3: ダイン斬り 4P / プレイヤーのマスターHPが2減った（ダイン斬り）。ストーン+2 / CPUの勝利 |

### attack:真勇者ダイン:ダイン斬り->真勇者ダイン

- matched: -
- rootScore: -Infinity
- winner: -
- finalScore: -Infinity
- replaySteps: 0
- finalState: turn 16 / current player / HP player/cpu 4/6 / stones player/cpu 9/3 / deck player/cpu 10/10 / hand player/cpu 6/5

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |

### attack:ピグミィ:スパイクボール->真勇者ダイン

- matched: -
- rootScore: -Infinity
- winner: -
- finalScore: -Infinity
- replaySteps: 0
- finalState: turn 16 / current player / HP player/cpu 4/6 / stones player/cpu 9/3 / deck player/cpu 10/10 / hand player/cpu 6/5

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |

### master:shield

- matched: -
- rootScore: -Infinity
- winner: -
- finalScore: -Infinity
- replaySteps: 0
- finalState: turn 16 / current player / HP player/cpu 4/6 / stones player/cpu 9/3 / deck player/cpu 10/10 / hand player/cpu 6/5

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |

### end_turn

- matched: end_turn
- rootScore: 60.2
- winner: white
- finalScore: -1000000
- replaySteps: 7
- finalState: turn 17 / current cpu / HP player/cpu 0/3 / stones player/cpu 16/10 / deck player/cpu 9/8 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | -72 | - | turn 16 / current cpu / HP player/cpu 4/6 / stones player/cpu 9/6 / deck player/cpu 10/9 / hand player/cpu 5/6 | player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 focus \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act0/1 | ドノマンティス Lv1が登場した / CPUはストーンを3個得た / CPUはカードを引いた |
| 4 | planner decision | -222 | attack:真勇者ダイン:ダイン斬り->cpu master | turn 17 / current player / HP player/cpu 2/6 / stones player/cpu 14/4 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 focus \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus,shield \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはスケープゴートを引いた |
| 5 | planner decision | -9 | end_turn | turn 17 / current player / HP player/cpu 2/3 / stones player/cpu 14/7 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus,shield \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面-749706点、次点と116点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 5P / CPUのマスターHPが3減った（ダイン斬り）。ストーン+3 |
| 7 | final | -1000000 | - | turn 17 / current cpu / HP player/cpu 0/3 / stones player/cpu 16/10 / deck player/cpu 9/8 / hand player/cpu 5/6 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | CPUの真勇者ダイン Lv3: ダイン斬り 4P / プレイヤーのマスターHPが2減った（ダイン斬り）。ストーン+2 / CPUの勝利 |


