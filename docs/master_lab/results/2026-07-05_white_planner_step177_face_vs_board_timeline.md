# White Planner Branch Timeline

生成: 2026-07-05T00:06:06.301Z
seed: 994311
direction: challenger-as-player
step: 177
deck: `master-lab-white-1377-death-sheep3`
search: `{}`
plannerSide: player

## Start

- state: turn 16 / current player / HP player/cpu 4/8 / stones player/cpu 4/3 / deck player/cpu 10/10 / hand player/cpu 5/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 | cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_right:CB:ボムゾウ Lv1 HP6 prep
- selected: attack:真勇者ダイン:ダイン斬り->cpu master

## Conclusion

- 同一局面から候補を強制し、planner側の次手番ごとの状態差を追跡した。
- selected: attack:真勇者ダイン:ダイン斬り->cpu master -> white / score -1000000
- summon:デスシープ->cpu_back_left: - -> no winner / score -Infinity
- selected: attack:真勇者ダイン:ダイン斬り->cpu master -> white / score -1000000
- デスシープ: - -> no winner / score -Infinity
- ピグミィ: attack:真勇者ダイン:ダイン斬り->ピグミィ -> white / score -1000000

## Timelines

### selected

- matched: attack:真勇者ダイン:ダイン斬り->cpu master
- rootScore: 43.5
- winner: white
- finalScore: -1000000
- replaySteps: 16
- finalState: turn 18 / current cpu / HP player/cpu 0/6 / stones player/cpu 8/13 / deck player/cpu 8/7 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | -420.8 | end_turn | turn 16 / current player / HP player/cpu 4/6 / stones player/cpu 4/5 / deck player/cpu 10/10 / hand player/cpu 5/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 prep | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面125点、次点と24点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 1 | planner decision | -420.8 | end_turn | turn 16 / current player / HP player/cpu 4/6 / stones player/cpu 4/5 / deck player/cpu 10/10 / hand player/cpu 5/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 prep | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面125点、次点と24点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 5 | planner decision | -522 | attack:真勇者ダイン:ダイン斬り->ピグミィ | turn 17 / current player / HP player/cpu 3/6 / stones player/cpu 8/6 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはヤンバルを引いた |
| 6 | planner decision | -504 | master:master_attack->monster:cpu_front_right | turn 17 / current player / HP player/cpu 3/6 / stones player/cpu 8/6 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP1 act0/2 shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus | プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / ピグミィ Lv2は気合いで1ダメージ軽減した / ダイン斬りでピグミィ Lv2に2ダメージ |
| 7 | planner decision | -395 | end_turn | turn 17 / current player / HP player/cpu 3/6 / stones player/cpu 5/8 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus | プレイヤーのマスターアタック / マスターアタックでピグミィ Lv2に1ダメージ / ピグミィ Lv2は倒れ、CPUにストーン2個が戻った |
| 12 | planner decision | -525 | attack:真勇者ダイン:ダイン斬り->ボムゾウ | turn 18 / current player / HP player/cpu 1/6 / stones player/cpu 10/9 / deck player/cpu 8/8 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ボムゾウ Lv1 HP4 act1/1 shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーは真勇者ダインを引いた |
| 13 | planner decision | -519 | master:master_attack->monster:cpu_front_right | turn 18 / current player / HP player/cpu 1/6 / stones player/cpu 10/9 / deck player/cpu 8/8 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ボムゾウ Lv1 HP1 act1/1 shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | プレイヤーAI判断: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面-749519点、次点と31点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / ダイン斬りでボムゾウ Lv1に3ダメージ |
| 14 | planner decision | -436 | end_turn | turn 18 / current player / HP player/cpu 1/6 / stones player/cpu 7/10 / deck player/cpu 8/8 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | プレイヤーのマスターアタック / マスターアタックでボムゾウ Lv1に1ダメージ / ボムゾウ Lv1は倒れ、CPUにストーン1個が戻った |

### summon:デスシープ->cpu_back_left

- matched: -
- rootScore: -Infinity
- winner: -
- finalScore: -Infinity
- replaySteps: 0
- finalState: turn 16 / current player / HP player/cpu 4/8 / stones player/cpu 4/3 / deck player/cpu 10/10 / hand player/cpu 5/5

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |

### selected

- matched: attack:真勇者ダイン:ダイン斬り->cpu master
- rootScore: 43.5
- winner: white
- finalScore: -1000000
- replaySteps: 16
- finalState: turn 18 / current cpu / HP player/cpu 0/6 / stones player/cpu 8/13 / deck player/cpu 8/7 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | -420.8 | end_turn | turn 16 / current player / HP player/cpu 4/6 / stones player/cpu 4/5 / deck player/cpu 10/10 / hand player/cpu 5/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 prep | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面125点、次点と24点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 1 | planner decision | -420.8 | end_turn | turn 16 / current player / HP player/cpu 4/6 / stones player/cpu 4/5 / deck player/cpu 10/10 / hand player/cpu 5/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 prep | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面125点、次点と24点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 5 | planner decision | -522 | attack:真勇者ダイン:ダイン斬り->ピグミィ | turn 17 / current player / HP player/cpu 3/6 / stones player/cpu 8/6 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはヤンバルを引いた |
| 6 | planner decision | -504 | master:master_attack->monster:cpu_front_right | turn 17 / current player / HP player/cpu 3/6 / stones player/cpu 8/6 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP1 act0/2 shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus | プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / ピグミィ Lv2は気合いで1ダメージ軽減した / ダイン斬りでピグミィ Lv2に2ダメージ |
| 7 | planner decision | -395 | end_turn | turn 17 / current player / HP player/cpu 3/6 / stones player/cpu 5/8 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus | プレイヤーのマスターアタック / マスターアタックでピグミィ Lv2に1ダメージ / ピグミィ Lv2は倒れ、CPUにストーン2個が戻った |
| 12 | planner decision | -525 | attack:真勇者ダイン:ダイン斬り->ボムゾウ | turn 18 / current player / HP player/cpu 1/6 / stones player/cpu 10/9 / deck player/cpu 8/8 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ボムゾウ Lv1 HP4 act1/1 shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーは真勇者ダインを引いた |
| 13 | planner decision | -519 | master:master_attack->monster:cpu_front_right | turn 18 / current player / HP player/cpu 1/6 / stones player/cpu 10/9 / deck player/cpu 8/8 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ボムゾウ Lv1 HP1 act1/1 shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | プレイヤーAI判断: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面-749519点、次点と31点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / ダイン斬りでボムゾウ Lv1に3ダメージ |
| 14 | planner decision | -436 | end_turn | turn 18 / current player / HP player/cpu 1/6 / stones player/cpu 7/10 / deck player/cpu 8/8 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | プレイヤーのマスターアタック / マスターアタックでボムゾウ Lv1に1ダメージ / ボムゾウ Lv1は倒れ、CPUにストーン1個が戻った |

### デスシープ

- matched: -
- rootScore: -Infinity
- winner: -
- finalScore: -Infinity
- replaySteps: 0
- finalState: turn 16 / current player / HP player/cpu 4/8 / stones player/cpu 4/3 / deck player/cpu 10/10 / hand player/cpu 5/5

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |

### ピグミィ

- matched: attack:真勇者ダイン:ダイン斬り->ピグミィ
- rootScore: 70
- winner: white
- finalScore: -1000000
- replaySteps: 18
- finalState: turn 19 / current cpu / HP player/cpu 0/4 / stones player/cpu 11/22 / deck player/cpu 7/6 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | -552.8 | master:master_attack->monster:cpu_front_right | turn 16 / current player / HP player/cpu 4/8 / stones player/cpu 4/3 / deck player/cpu 10/10 / hand player/cpu 5/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP1 act0/2 shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 prep | プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / ピグミィ Lv2は気合いで1ダメージ軽減した / ダイン斬りでピグミィ Lv2に2ダメージ |
| 1 | planner decision | -552.8 | master:master_attack->monster:cpu_front_right | turn 16 / current player / HP player/cpu 4/8 / stones player/cpu 4/3 / deck player/cpu 10/10 / hand player/cpu 5/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP1 act0/2 shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 prep | プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / ピグミィ Lv2は気合いで1ダメージ軽減した / ダイン斬りでピグミィ Lv2に2ダメージ |
| 2 | planner decision | -443.8 | end_turn | turn 16 / current player / HP player/cpu 4/8 / stones player/cpu 1/5 / deck player/cpu 10/10 / hand player/cpu 5/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 prep | プレイヤーのマスターアタック / マスターアタックでピグミィ Lv2に1ダメージ / ピグミィ Lv2は倒れ、CPUにストーン2個が戻った |
| 5 | planner decision | -575 | attack:ピグミィ:スパイクボール->ボムゾウ | turn 17 / current player / HP player/cpu 3/8 / stones player/cpu 5/8 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ボムゾウ Lv1 HP6 act0/1 focus \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはヤンバルを引いた |
| 6 | planner decision | -575 | attack:真勇者ダイン:ダイン斬り->ボムゾウ | turn 17 / current player / HP player/cpu 3/8 / stones player/cpu 5/8 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act1/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ボムゾウ Lv1 HP6 act0/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | プレイヤーのピグミィ Lv1: スパイクボール 1P / ボムゾウ Lv1は気合いで1ダメージ軽減した / スパイクボールでボムゾウ Lv1に0ダメージ |
| 7 | planner decision | -563 | master:master_attack->monster:cpu_front_right | turn 17 / current player / HP player/cpu 3/8 / stones player/cpu 5/8 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act1/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ボムゾウ Lv1 HP2 act0/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | プレイヤーAI判断: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面155点、次点と109点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / ダイン斬りでボムゾウ Lv1に4ダメージ |
| 8 | planner decision | -474 | end_turn | turn 17 / current player / HP player/cpu 3/8 / stones player/cpu 2/9 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act1/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | プレイヤーのマスターアタック / マスターアタックでボムゾウ Lv1に2ダメージ / ボムゾウ Lv1は倒れ、CPUにストーン1個が戻った |
| 11 | planner decision | -525 | attack:真勇者ダイン:ダイン斬り->cpu master | turn 18 / current player / HP player/cpu 2/8 / stones player/cpu 6/12 / deck player/cpu 8/8 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーは真勇者ダインを引いた |
