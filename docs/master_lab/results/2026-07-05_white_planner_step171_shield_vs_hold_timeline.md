# White Planner Branch Timeline

生成: 2026-07-05T00:08:37.017Z
seed: 994311
direction: challenger-as-player
step: 171
deck: `master-lab-white-1377-death-sheep3`
search: `{}`
plannerSide: player

## Start

- state: turn 15 / current player / HP player/cpu 5/8 / stones player/cpu 2/3 / deck player/cpu 11/11 / hand player/cpu 4/5
- board: player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus
- selected: master:shield->monster:player_front_right

## Conclusion

- 同一局面から候補を強制し、planner側の次手番ごとの状態差を追跡した。
- selected: master:shield->monster:player_front_right -> white / score -1000000
- summon:デスシープ->cpu_back_left: - -> no winner / score -Infinity
- selected: master:shield->monster:player_front_right -> white / score -1000000
- end_turn: end_turn -> white / score -1000000

## Timelines

### selected

- matched: master:shield->monster:player_front_right
- rootScore: 198.7
- winner: white
- finalScore: -1000000
- replaySteps: 22
- finalState: turn 18 / current cpu / HP player/cpu 0/6 / stones player/cpu 8/13 / deck player/cpu 8/7 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | -456 | end_turn | turn 15 / current player / HP player/cpu 5/8 / stones player/cpu 0/3 / deck player/cpu 11/11 / hand player/cpu 4/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 shield \| player_back_right:PB:ピグミィ Lv1 HP3 act2/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 focus \| cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus | スパイクボールでデスシープ Lv2に1ダメージ / プレイヤーAI判断: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面17点、次点と63点差 / プレイヤーは真勇者ダイン Lv3にシールドを張った |
| 1 | planner decision | -456 | end_turn | turn 15 / current player / HP player/cpu 5/8 / stones player/cpu 0/3 / deck player/cpu 11/11 / hand player/cpu 4/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 shield \| player_back_right:PB:ピグミィ Lv1 HP3 act2/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 focus \| cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus | スパイクボールでデスシープ Lv2に1ダメージ / プレイヤーAI判断: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面17点、次点と63点差 / プレイヤーは真勇者ダイン Lv3にシールドを張った |
| 6 | planner decision | -570.8 | attack:真勇者ダイン:ダイン斬り->cpu master | turn 16 / current player / HP player/cpu 4/8 / stones player/cpu 4/3 / deck player/cpu 10/10 / hand player/cpu 5/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 prep | プレイヤーはストーンを3個得た / 真勇者ダイン Lv3の防御効果が切れた / プレイヤーはピグミィを引いた |
| 7 | planner decision | -420.8 | end_turn | turn 16 / current player / HP player/cpu 4/6 / stones player/cpu 4/5 / deck player/cpu 10/10 / hand player/cpu 5/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 prep | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面125点、次点と24点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 11 | planner decision | -522 | attack:真勇者ダイン:ダイン斬り->ピグミィ | turn 17 / current player / HP player/cpu 3/6 / stones player/cpu 8/6 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはヤンバルを引いた |
| 12 | planner decision | -504 | master:master_attack->monster:cpu_front_right | turn 17 / current player / HP player/cpu 3/6 / stones player/cpu 8/6 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP1 act0/2 shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus | プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / ピグミィ Lv2は気合いで1ダメージ軽減した / ダイン斬りでピグミィ Lv2に2ダメージ |
| 13 | planner decision | -395 | end_turn | turn 17 / current player / HP player/cpu 3/6 / stones player/cpu 5/8 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus | プレイヤーのマスターアタック / マスターアタックでピグミィ Lv2に1ダメージ / ピグミィ Lv2は倒れ、CPUにストーン2個が戻った |
| 18 | planner decision | -525 | attack:真勇者ダイン:ダイン斬り->ボムゾウ | turn 18 / current player / HP player/cpu 1/6 / stones player/cpu 10/9 / deck player/cpu 8/8 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ボムゾウ Lv1 HP4 act1/1 shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーは真勇者ダインを引いた |

### summon:デスシープ->cpu_back_left

- matched: -
- rootScore: -Infinity
- winner: -
- finalScore: -Infinity
- replaySteps: 0
- finalState: turn 15 / current player / HP player/cpu 5/8 / stones player/cpu 2/3 / deck player/cpu 11/11 / hand player/cpu 4/5

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |

### selected

- matched: master:shield->monster:player_front_right
- rootScore: 198.7
- winner: white
- finalScore: -1000000
- replaySteps: 22
- finalState: turn 18 / current cpu / HP player/cpu 0/6 / stones player/cpu 8/13 / deck player/cpu 8/7 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | -456 | end_turn | turn 15 / current player / HP player/cpu 5/8 / stones player/cpu 0/3 / deck player/cpu 11/11 / hand player/cpu 4/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 shield \| player_back_right:PB:ピグミィ Lv1 HP3 act2/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 focus \| cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus | スパイクボールでデスシープ Lv2に1ダメージ / プレイヤーAI判断: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面17点、次点と63点差 / プレイヤーは真勇者ダイン Lv3にシールドを張った |
| 1 | planner decision | -456 | end_turn | turn 15 / current player / HP player/cpu 5/8 / stones player/cpu 0/3 / deck player/cpu 11/11 / hand player/cpu 4/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 shield \| player_back_right:PB:ピグミィ Lv1 HP3 act2/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act1/2 focus \| cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus | スパイクボールでデスシープ Lv2に1ダメージ / プレイヤーAI判断: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面17点、次点と63点差 / プレイヤーは真勇者ダイン Lv3にシールドを張った |
| 6 | planner decision | -570.8 | attack:真勇者ダイン:ダイン斬り->cpu master | turn 16 / current player / HP player/cpu 4/8 / stones player/cpu 4/3 / deck player/cpu 10/10 / hand player/cpu 5/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 prep | プレイヤーはストーンを3個得た / 真勇者ダイン Lv3の防御効果が切れた / プレイヤーはピグミィを引いた |
| 7 | planner decision | -420.8 | end_turn | turn 16 / current player / HP player/cpu 4/6 / stones player/cpu 4/5 / deck player/cpu 10/10 / hand player/cpu 5/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 prep | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面125点、次点と24点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 11 | planner decision | -522 | attack:真勇者ダイン:ダイン斬り->ピグミィ | turn 17 / current player / HP player/cpu 3/6 / stones player/cpu 8/6 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはヤンバルを引いた |
| 12 | planner decision | -504 | master:master_attack->monster:cpu_front_right | turn 17 / current player / HP player/cpu 3/6 / stones player/cpu 8/6 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP1 act0/2 shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus | プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / ピグミィ Lv2は気合いで1ダメージ軽減した / ダイン斬りでピグミィ Lv2に2ダメージ |
| 13 | planner decision | -395 | end_turn | turn 17 / current player / HP player/cpu 3/6 / stones player/cpu 5/8 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus | プレイヤーのマスターアタック / マスターアタックでピグミィ Lv2に1ダメージ / ピグミィ Lv2は倒れ、CPUにストーン2個が戻った |
| 18 | planner decision | -525 | attack:真勇者ダイン:ダイン斬り->ボムゾウ | turn 18 / current player / HP player/cpu 1/6 / stones player/cpu 10/9 / deck player/cpu 8/8 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ボムゾウ Lv1 HP4 act1/1 shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーは真勇者ダインを引いた |

### end_turn

- matched: end_turn
- rootScore: 38.7
- winner: white
- finalScore: -1000000
- replaySteps: 21
- finalState: turn 18 / current cpu / HP player/cpu 0/6 / stones player/cpu 10/13 / deck player/cpu 8/7 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | -471 | - | turn 15 / current cpu / HP player/cpu 5/8 / stones player/cpu 2/6 / deck player/cpu 11/10 / hand player/cpu 4/6 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act2/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act0/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | ピグミィ Lv2が前衛へ自動移動した / CPUはストーンを3個得た / CPUはカードを引いた |
| 5 | planner decision | -560.8 | attack:真勇者ダイン:ダイン斬り->cpu master | turn 16 / current player / HP player/cpu 4/8 / stones player/cpu 6/3 / deck player/cpu 10/10 / hand player/cpu 5/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 prep | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはピグミィを引いた |
| 6 | planner decision | -410.8 | end_turn | turn 16 / current player / HP player/cpu 4/6 / stones player/cpu 6/5 / deck player/cpu 10/10 / hand player/cpu 5/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 prep | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面125点、次点と24点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 10 | planner decision | -512 | attack:真勇者ダイン:ダイン斬り->ピグミィ | turn 17 / current player / HP player/cpu 3/6 / stones player/cpu 10/6 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP3 act0/2 focus,shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはヤンバルを引いた |
| 11 | planner decision | -494 | master:master_attack->monster:cpu_front_right | turn 17 / current player / HP player/cpu 3/6 / stones player/cpu 10/6 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ピグミィ Lv2 HP1 act0/2 shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus | プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / ピグミィ Lv2は気合いで1ダメージ軽減した / ダイン斬りでピグミィ Lv2に2ダメージ |
| 12 | planner decision | -385 | end_turn | turn 17 / current player / HP player/cpu 3/6 / stones player/cpu 7/8 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_back_right:CB:ボムゾウ Lv1 HP6 act0/1 focus | プレイヤーのマスターアタック / マスターアタックでピグミィ Lv2に1ダメージ / ピグミィ Lv2は倒れ、CPUにストーン2個が戻った |
| 17 | planner decision | -515 | attack:真勇者ダイン:ダイン斬り->ボムゾウ | turn 18 / current player / HP player/cpu 1/6 / stones player/cpu 12/9 / deck player/cpu 8/8 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ボムゾウ Lv1 HP4 act1/1 shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーは真勇者ダインを引いた |
| 18 | planner decision | -509 | master:master_attack->monster:cpu_front_right | turn 18 / current player / HP player/cpu 1/6 / stones player/cpu 12/9 / deck player/cpu 8/8 / hand player/cpu 6/5 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus \| cpu_front_left:CF:デスシープ Lv2 HP5 act1/1 \| cpu_front_right:CF:ボムゾウ Lv1 HP1 act1/1 shield \| cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | プレイヤーAI判断: ボムゾウを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面-749527点、次点と31点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / ダイン斬りでボムゾウ Lv1に3ダメージ |
