# White Planner Branch Timeline

生成: 2026-07-06T15:06:58.474Z
seed: 994333
direction: challenger-as-player
step: 180
deck: `master-lab-white-1377-death-sheep3`
search: `{}`
plannerSide: player

## Start

- state: turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 6/3 / deck player/cpu 12/12 / hand player/cpu 6/5
- board: player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:デスシープ Lv2 HP1 act1/1 | cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus
- selected: summon:デスシープ->player_front_right

## Conclusion

- 同一局面から候補を強制し、planner側の次手番ごとの状態差を追跡した。
- selected: summon:デスシープ->player_front_right -> white / score -1000000
- summon: summon:デスシープ->player_front_right -> white / score -1000000
- master:wake_up: - -> no winner / score -Infinity
- attack:真勇者ダイン:ダイン斬り->cpu master: - -> no winner / score -Infinity
- end_turn: end_turn -> white_planner / score 1000000

## Timelines

### selected

- matched: summon:デスシープ->player_front_right
- rootScore: 542
- winner: white
- finalScore: -1000000
- replaySteps: 26
- finalState: turn 17 / current cpu / HP player/cpu 0/2 / stones player/cpu 16/11 / deck player/cpu 9/8 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | 47.8 | master:wake_up->monster:player_front_right | turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 5/3 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 \| player_front_right:PF:デスシープ Lv1 HP6 prep \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_right:CF:デスシープ Lv2 HP1 act1/1 \| cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus | マスターアタックでデスシープ Lv2に2ダメージ / プレイヤーAI判断: 前衛カードを前列右へ召喚 / 見送り: マスター特技は268点差で見送り、召喚は468点差で見送り / プレイヤーはデスシープを準備中で召喚した |
| 1 | planner decision | 47.8 | master:wake_up->monster:player_front_right | turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 5/3 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 \| player_front_right:PF:デスシープ Lv1 HP6 prep \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_right:CF:デスシープ Lv2 HP1 act1/1 \| cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus | マスターアタックでデスシープ Lv2に2ダメージ / プレイヤーAI判断: 前衛カードを前列右へ召喚 / 見送り: マスター特技は268点差で見送り、召喚は468点差で見送り / プレイヤーはデスシープを準備中で召喚した |
| 2 | planner decision | 91 | attack:デスシープ:attack->デスシープ | turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 3/3 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 \| player_front_right:PF:デスシープ Lv1 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_right:CF:デスシープ Lv2 HP1 act1/1 \| cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus | プレイヤーはデスシープを準備中で召喚した / プレイヤーAI判断: 準備中の味方を起こして敵を撃破できるためウェイクアップ / ターンプラン探索: 返し込み最終盤面182点、次点と92点差 / プレイヤーはデスシープ Lv1をウェイクアップした |
| 3 | planner decision | 203 | end_turn | turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 3/5 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 \| player_front_right:PF:デスシープ Lv1 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus | アタックでデスシープ Lv2に2ダメージ / デスシープ Lv2は倒れ、CPUにストーン2個が戻った / デスシープ Lv1は1レベルまで上げられる |
| 4 | planner decision | 241 | master:shield->monster:player_front_left | turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 2/5 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 \| player_front_right:PF:デスシープ Lv2 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus | デスシープ Lv2は倒れ、CPUにストーン2個が戻った / デスシープ Lv1は1レベルまで上げられる / デスシープ Lv2はLv2になり、HPが全回復した |
| 5 | planner decision | 243 | end_turn | turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 0/5 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 shield \| player_front_right:PF:デスシープ Lv2 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus | デスシープ Lv2はLv2になり、HPが全回復した / プレイヤーAI判断: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り / プレイヤーは真勇者ダイン Lv2にシールドを張った |
| 10 | planner decision | 36 | attack:ピグミィ:スパイクボール->真勇者ダイン | turn 15 / current player / HP player/cpu 6/6 / stones player/cpu 5/0 / deck player/cpu 11/11 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 \| cpu_front_left:CF:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_front_right:CF:真勇者ダイン Lv3 HP6 act1/1 | プレイヤーはストーンを3個得た / 真勇者ダイン Lv2の防御効果が切れた / プレイヤーは黄昏の風を引いた |
| 11 | planner decision | 42 | attack:ピグミィ:スパイクボール->ポリスピナー | turn 15 / current player / HP player/cpu 6/6 / stones player/cpu 5/0 / deck player/cpu 11/11 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act1/2 \| cpu_front_left:CF:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーAI判断: 真勇者ダインを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面124点、次点と54点差 / プレイヤーのピグミィ Lv2: スパイクボール 1P / スパイクボールで真勇者ダイン Lv3に1ダメージ |
| 12 | planner decision | 48 | attack:真勇者ダイン:ダイン斬り->ポリスピナー | turn 15 / current player / HP player/cpu 6/6 / stones player/cpu 5/0 / deck player/cpu 11/11 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_left:CF:ポリスピナー Lv1 HP3 act0/2 \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーのピグミィ Lv2: スパイクボール 1P / ポリスピナー Lv1は気合いで1ダメージ軽減した / スパイクボールでポリスピナー Lv1に0ダメージ |
| 13 | planner decision | 146 | end_turn | turn 15 / current player / HP player/cpu 6/6 / stones player/cpu 5/1 / deck player/cpu 11/11 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | ダイン斬りでポリスピナー Lv1に3ダメージ / ポリスピナー Lv1は倒れ、CPUにストーン1個が戻った / 真勇者ダイン Lv2は1レベルまで上げられる |
| 14 | planner decision | 184 | end_turn | turn 15 / current player / HP player/cpu 6/6 / stones player/cpu 4/1 / deck player/cpu 11/11 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | ポリスピナー Lv1は倒れ、CPUにストーン1個が戻った / 真勇者ダイン Lv2は1レベルまで上げられる / 真勇者ダイン Lv3はLv3になり、HPが全回復した |
| 18 | planner decision | -25.2 | attack:真勇者ダイン:ダイン斬り->cpu master | turn 16 / current player / HP player/cpu 4/6 / stones player/cpu 9/3 / deck player/cpu 10/10 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 \| cpu_front_left:CF:ドノマンティス Lv1 HP5 prep \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはデスシープを引いた |
| 19 | planner decision | 124.8 | end_turn | turn 16 / current player / HP player/cpu 4/4 / stones player/cpu 9/5 / deck player/cpu 10/10 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 \| cpu_front_left:CF:ドノマンティス Lv1 HP5 prep \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面103点、次点と313点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 23 | planner decision | -78 | attack:真勇者ダイン:ダイン斬り->cpu master | turn 17 / current player / HP player/cpu 2/4 / stones player/cpu 14/6 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus,shield \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはスケープゴートを引いた |
| 24 | planner decision | 72 | end_turn | turn 17 / current player / HP player/cpu 2/2 / stones player/cpu 14/8 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus,shield \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 26 | final | -1000000 | - | turn 17 / current cpu / HP player/cpu 0/2 / stones player/cpu 16/11 / deck player/cpu 9/8 / hand player/cpu 5/6 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | CPUの真勇者ダイン Lv3: ダイン斬り 4P / プレイヤーのマスターHPが2減った（ダイン斬り）。ストーン+2 / CPUの勝利 |

### summon

- matched: summon:デスシープ->player_front_right
- rootScore: 542
- winner: white
- finalScore: -1000000
- replaySteps: 26
- finalState: turn 17 / current cpu / HP player/cpu 0/2 / stones player/cpu 16/11 / deck player/cpu 9/8 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | 47.8 | master:wake_up->monster:player_front_right | turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 5/3 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 \| player_front_right:PF:デスシープ Lv1 HP6 prep \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_right:CF:デスシープ Lv2 HP1 act1/1 \| cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus | マスターアタックでデスシープ Lv2に2ダメージ / プレイヤーAI判断: 前衛カードを前列右へ召喚 / プレイヤーはデスシープを準備中で召喚した |
| 1 | planner decision | 47.8 | master:wake_up->monster:player_front_right | turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 5/3 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 \| player_front_right:PF:デスシープ Lv1 HP6 prep \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_right:CF:デスシープ Lv2 HP1 act1/1 \| cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus | マスターアタックでデスシープ Lv2に2ダメージ / プレイヤーAI判断: 前衛カードを前列右へ召喚 / プレイヤーはデスシープを準備中で召喚した |
| 2 | planner decision | 91 | attack:デスシープ:attack->デスシープ | turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 3/3 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 \| player_front_right:PF:デスシープ Lv1 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_right:CF:デスシープ Lv2 HP1 act1/1 \| cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus | プレイヤーはデスシープを準備中で召喚した / プレイヤーAI判断: 準備中の味方を起こして敵を撃破できるためウェイクアップ / ターンプラン探索: 返し込み最終盤面182点、次点と92点差 / プレイヤーはデスシープ Lv1をウェイクアップした |
| 3 | planner decision | 203 | end_turn | turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 3/5 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 \| player_front_right:PF:デスシープ Lv1 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus | アタックでデスシープ Lv2に2ダメージ / デスシープ Lv2は倒れ、CPUにストーン2個が戻った / デスシープ Lv1は1レベルまで上げられる |
| 4 | planner decision | 241 | master:shield->monster:player_front_left | turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 2/5 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 \| player_front_right:PF:デスシープ Lv2 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus | デスシープ Lv2は倒れ、CPUにストーン2個が戻った / デスシープ Lv1は1レベルまで上げられる / デスシープ Lv2はLv2になり、HPが全回復した |
| 5 | planner decision | 243 | end_turn | turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 0/5 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 shield \| player_front_right:PF:デスシープ Lv2 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act1/1 focus | デスシープ Lv2はLv2になり、HPが全回復した / プレイヤーAI判断: 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り / プレイヤーは真勇者ダイン Lv2にシールドを張った |
| 10 | planner decision | 36 | attack:ピグミィ:スパイクボール->真勇者ダイン | turn 15 / current player / HP player/cpu 6/6 / stones player/cpu 5/0 / deck player/cpu 11/11 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 \| cpu_front_left:CF:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_front_right:CF:真勇者ダイン Lv3 HP6 act1/1 | プレイヤーはストーンを3個得た / 真勇者ダイン Lv2の防御効果が切れた / プレイヤーは黄昏の風を引いた |
| 11 | planner decision | 42 | attack:ピグミィ:スパイクボール->ポリスピナー | turn 15 / current player / HP player/cpu 6/6 / stones player/cpu 5/0 / deck player/cpu 11/11 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act1/2 \| cpu_front_left:CF:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーAI判断: 真勇者ダインを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面124点、次点と54点差 / プレイヤーのピグミィ Lv2: スパイクボール 1P / スパイクボールで真勇者ダイン Lv3に1ダメージ |
| 12 | planner decision | 48 | attack:真勇者ダイン:ダイン斬り->ポリスピナー | turn 15 / current player / HP player/cpu 6/6 / stones player/cpu 5/0 / deck player/cpu 11/11 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_left:CF:ポリスピナー Lv1 HP3 act0/2 \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーのピグミィ Lv2: スパイクボール 1P / ポリスピナー Lv1は気合いで1ダメージ軽減した / スパイクボールでポリスピナー Lv1に0ダメージ |
| 13 | planner decision | 146 | end_turn | turn 15 / current player / HP player/cpu 6/6 / stones player/cpu 5/1 / deck player/cpu 11/11 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | ダイン斬りでポリスピナー Lv1に3ダメージ / ポリスピナー Lv1は倒れ、CPUにストーン1個が戻った / 真勇者ダイン Lv2は1レベルまで上げられる |
| 14 | planner decision | 184 | end_turn | turn 15 / current player / HP player/cpu 6/6 / stones player/cpu 4/1 / deck player/cpu 11/11 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | ポリスピナー Lv1は倒れ、CPUにストーン1個が戻った / 真勇者ダイン Lv2は1レベルまで上げられる / 真勇者ダイン Lv3はLv3になり、HPが全回復した |
| 18 | planner decision | -25.2 | attack:真勇者ダイン:ダイン斬り->cpu master | turn 16 / current player / HP player/cpu 4/6 / stones player/cpu 9/3 / deck player/cpu 10/10 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 \| cpu_front_left:CF:ドノマンティス Lv1 HP5 prep \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはデスシープを引いた |
| 19 | planner decision | 124.8 | end_turn | turn 16 / current player / HP player/cpu 4/4 / stones player/cpu 9/5 / deck player/cpu 10/10 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 \| cpu_front_left:CF:ドノマンティス Lv1 HP5 prep \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面103点、次点と313点差 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 23 | planner decision | -78 | attack:真勇者ダイン:ダイン斬り->cpu master | turn 17 / current player / HP player/cpu 2/4 / stones player/cpu 14/6 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus,shield \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはスケープゴートを引いた |
| 24 | planner decision | 72 | end_turn | turn 17 / current player / HP player/cpu 2/2 / stones player/cpu 14/8 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus,shield \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / プレイヤーの真勇者ダイン Lv3: ダイン斬り 4P / CPUのマスターHPが2減った（ダイン斬り）。ストーン+2 |
| 26 | final | -1000000 | - | turn 17 / current cpu / HP player/cpu 0/2 / stones player/cpu 16/11 / deck player/cpu 9/8 / hand player/cpu 5/6 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus \| cpu_front_right:CF:真勇者ダイン Lv3 HP5 act1/1 | CPUの真勇者ダイン Lv3: ダイン斬り 4P / プレイヤーのマスターHPが2減った（ダイン斬り）。ストーン+2 / CPUの勝利 |

### master:wake_up

- matched: -
- rootScore: -Infinity
- winner: -
- finalScore: -Infinity
- replaySteps: 0
- finalState: turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 6/3 / deck player/cpu 12/12 / hand player/cpu 6/5

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |

### attack:真勇者ダイン:ダイン斬り->cpu master

- matched: -
- rootScore: -Infinity
- winner: -
- finalScore: -Infinity
- replaySteps: 0
- finalState: turn 14 / current player / HP player/cpu 6/6 / stones player/cpu 6/3 / deck player/cpu 12/12 / hand player/cpu 6/5

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |

### end_turn

- matched: end_turn
- rootScore: -297
- winner: white_planner
- finalScore: 1000000
- replaySteps: 54
- finalState: turn 24 / current player / HP player/cpu 4/0 / stones player/cpu 25/37 / deck player/cpu 2/2 / hand player/cpu 6/5

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | -88 | - | turn 14 / current cpu / HP player/cpu 6/6 / stones player/cpu 6/6 / deck player/cpu 12/11 / hand player/cpu 5/6 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_left:CF:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_front_right:CF:デスシープ Lv2 HP1 act0/1 \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | ポリスピナー Lv1が前衛へ自動移動した / CPUはストーンを3個得た / CPUはカードを引いた |
| 7 | planner decision | -369.2 | master:master_attack->monster:cpu_front_right | turn 15 / current player / HP player/cpu 5/6 / stones player/cpu 12/1 / deck player/cpu 11/11 / hand player/cpu 6/5 | player_front_left:PF:ピグミィ Lv2 HP3 act0/2 \| cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 \| cpu_front_right:CF:デスシープ Lv2 HP1 act1/1 \| cpu_back_left:CB:ドノマンティス Lv1 HP5 prep \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | ピグミィ Lv2が前衛へ自動移動した / プレイヤーはストーンを3個得た / プレイヤーは黄昏の風を引いた |
| 8 | planner decision | -260.2 | move:player_front_left->player_back_left | turn 15 / current player / HP player/cpu 5/6 / stones player/cpu 9/3 / deck player/cpu 11/11 / hand player/cpu 6/5 | player_front_left:PF:ピグミィ Lv2 HP3 act0/2 \| cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 \| cpu_back_left:CB:ドノマンティス Lv1 HP5 prep \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | プレイヤーのマスターアタック / マスターアタックでデスシープ Lv2に2ダメージ / デスシープ Lv2は倒れ、CPUにストーン2個が戻った |
| 9 | planner decision | -244.2 | attack:ピグミィ:スパイクボール->ポリスピナー | turn 15 / current player / HP player/cpu 5/6 / stones player/cpu 9/3 / deck player/cpu 11/11 / hand player/cpu 6/5 | player_back_left:PB:ピグミィ Lv2 HP3 act1/2 \| cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 \| cpu_back_left:CB:ドノマンティス Lv1 HP5 prep \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | デスシープ Lv2は倒れ、CPUにストーン2個が戻った / プレイヤーAI判断: 移動後に強い攻撃筋を作れるため移動 / ターンプラン探索: 返し込み最終盤面284点、次点と22点差 / ピグミィ Lv2を移動した |
| 10 | planner decision | -250.2 | summon:デスシープ->player_front_left | turn 15 / current player / HP player/cpu 5/6 / stones player/cpu 9/3 / deck player/cpu 11/11 / hand player/cpu 6/5 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_left:CF:ポリスピナー Lv2 HP2 act2/2 \| cpu_back_left:CB:ドノマンティス Lv1 HP5 prep \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | プレイヤーAI判断: ポリスピナーを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面289点、次点と131点差 / プレイヤーのピグミィ Lv2: スパイクボール 1P / スパイクボールでポリスピナー Lv2に1ダメージ |
| 11 | planner decision | -156.4 | master:wake_up->monster:player_front_left | turn 15 / current player / HP player/cpu 5/6 / stones player/cpu 8/3 / deck player/cpu 11/11 / hand player/cpu 5/5 | player_front_left:PF:デスシープ Lv1 HP6 prep \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_left:CF:ポリスピナー Lv2 HP2 act2/2 \| cpu_back_left:CB:ドノマンティス Lv1 HP5 prep \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | スパイクボールでポリスピナー Lv2に1ダメージ / プレイヤーAI判断: 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面168点、次点と16点差 / プレイヤーはデスシープを準備中で召喚した |
| 12 | planner decision | -113.2 | attack:デスシープ:attack->ポリスピナー | turn 15 / current player / HP player/cpu 5/6 / stones player/cpu 6/3 / deck player/cpu 11/11 / hand player/cpu 5/5 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_front_left:CF:ポリスピナー Lv2 HP2 act2/2 \| cpu_back_left:CB:ドノマンティス Lv1 HP5 prep \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | プレイヤーはデスシープを準備中で召喚した / プレイヤーAI判断: 準備中の味方を起こして敵を撃破できるためウェイクアップ / ターンプラン探索: 返し込み最終盤面201点、次点と142点差 / プレイヤーはデスシープ Lv1をウェイクアップした |
| 13 | planner decision | 4.8 | end_turn | turn 15 / current player / HP player/cpu 5/6 / stones player/cpu 6/5 / deck player/cpu 11/11 / hand player/cpu 5/5 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_back_left:CB:ドノマンティス Lv1 HP5 prep \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | アタックでポリスピナー Lv2に2ダメージ / ポリスピナー Lv2は倒れ、CPUにストーン2個が戻った / デスシープ Lv1は1レベルまで上げられる |
| 14 | planner decision | 42.8 | master:shield->monster:player_front_left | turn 15 / current player / HP player/cpu 5/6 / stones player/cpu 5/5 / deck player/cpu 11/11 / hand player/cpu 5/5 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_back_left:CB:ドノマンティス Lv1 HP5 prep \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | ポリスピナー Lv2は倒れ、CPUにストーン2個が戻った / デスシープ Lv1は1レベルまで上げられる / デスシープ Lv2はLv2になり、HPが全回復した |
| 15 | planner decision | 44.8 | end_turn | turn 15 / current player / HP player/cpu 5/6 / stones player/cpu 3/5 / deck player/cpu 11/11 / hand player/cpu 5/5 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 shield \| player_back_left:PB:ピグミィ Lv2 HP3 act2/2 \| cpu_back_left:CB:ドノマンティス Lv1 HP5 prep \| cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | デスシープ Lv2はLv2になり、HPが全回復した / プレイヤーAI判断: 高価値の味方を守るためシールド / プレイヤーはデスシープ Lv2にシールドを張った |
| 20 | planner decision | -153.2 | end_turn | turn 16 / current player / HP player/cpu 4/6 / stones player/cpu 7/5 / deck player/cpu 10/10 / hand player/cpu 6/5 | player_front_left:PF:デスシープ Lv2 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus,shield \| cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 \| cpu_back_left:CB:ドノマンティス Lv1 HP5 prep | プレイヤーはストーンを3個得た / デスシープ Lv2の防御効果が切れた / プレイヤーはデスシープを引いた |
| 22 | planner decision | -196 | attack:デスシープ:attack->ドノマンティス | turn 17 / current player / HP player/cpu 4/6 / stones player/cpu 10/8 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_left:PF:デスシープ Lv2 HP6 act0/1 focus \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus \| cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはスケープゴートを引いた |
| 23 | planner decision | -190 | master:master_attack->monster:cpu_front_left | turn 17 / current player / HP player/cpu 4/6 / stones player/cpu 10/8 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP2 act0/1 \| cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | プレイヤーのデスシープ Lv2: アタック 4P / ドノマンティス Lv1は気合いで1ダメージ軽減した / アタックでドノマンティス Lv1に3ダメージ |
| 24 | planner decision | -101 | attack:ピグミィ:スパイクボール->真勇者ダイン | turn 17 / current player / HP player/cpu 4/6 / stones player/cpu 7/9 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | プレイヤーのマスターアタック / マスターアタックでドノマンティス Lv1に2ダメージ / ドノマンティス Lv1は倒れ、CPUにストーン1個が戻った |
| 25 | planner decision | -101 | end_turn | turn 17 / current player / HP player/cpu 4/6 / stones player/cpu 7/9 / deck player/cpu 9/9 / hand player/cpu 6/5 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act1/2 \| cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 \| cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | プレイヤーのピグミィ Lv2: スパイクボール 1P / 真勇者ダイン Lv1は気合いで1ダメージ軽減した / スパイクボールで真勇者ダイン Lv1に0ダメージ |
| 27 | planner decision | -109 | attack:ピグミィ:スパイクボール->ドノマンティス | turn 18 / current player / HP player/cpu 4/6 / stones player/cpu 10/12 / deck player/cpu 8/8 / hand player/cpu 6/5 | player_front_left:PF:デスシープ Lv2 HP6 act0/1 \| player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus \| cpu_front_left:CF:ドノマンティス Lv1 HP5 act0/1 focus \| cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはヤンバルを引いた |


