# White Planner Branch Timeline

生成: 2026-07-06T15:00:06.987Z
seed: 994327
direction: challenger-as-player
step: 133
deck: `master-lab-white-1377-death-sheep3`
search: `{}`
plannerSide: player

## Start

- state: turn 13 / current player / HP player/cpu 5/8 / stones player/cpu 6/6 / deck player/cpu 13/13 / hand player/cpu 5/5
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 shield | cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus | cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1
- selected: focus:ドノマンティス

## Conclusion

- 同一局面から候補を強制し、planner側の次手番ごとの状態差を追跡した。
- selected: focus:ドノマンティス -> white / score -1000000
- summon:デスシープ->cpu_back_left: - -> no winner / score -Infinity
- selected: focus:ドノマンティス -> white / score -1000000
- shield: - -> no winner / score -Infinity
- attack: attack:ドノマンティス:attack->ポリスピナー -> white / score -1000000
- summon: summon:ヤンバル->player_back_left -> white / score -1000000

## Timelines

### selected

- matched: focus:ドノマンティス
- rootScore: 285.8
- winner: white
- finalScore: -1000000
- replaySteps: 13
- finalState: turn 14 / current cpu / HP player/cpu 0/8 / stones player/cpu 9/12 / deck player/cpu 12/11 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | -631.8 | end_turn | turn 13 / current player / HP player/cpu 5/8 / stones player/cpu 6/6 / deck player/cpu 13/13 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus \| cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーはヤンバルを引いた / プレイヤーAI判断: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面-72点、次点と63点差 / ドノマンティス Lv1はためた |
| 1 | planner decision | -631.8 | end_turn | turn 13 / current player / HP player/cpu 5/8 / stones player/cpu 6/6 / deck player/cpu 13/13 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus \| cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーはヤンバルを引いた / プレイヤーAI判断: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面-72点、次点と63点差 / ドノマンティス Lv1はためた |
| 8 | planner decision | -1006 | attack:ドノマンティス:attack->ポリスピナー | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 13/7 / deck player/cpu 12/12 / hand player/cpu 6/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus \| cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはデスシープを引いた |
| 9 | planner decision | -1024 | master:master_attack->monster:cpu_front_left | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 13/7 / deck player/cpu 12/12 / hand player/cpu 6/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 \| cpu_front_left:CF:ポリスピナー Lv2 HP1 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーAI判断: ポリスピナーを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面-749173点、次点と39点差 / プレイヤーのドノマンティス Lv1: アタック 3P / アタックでポリスピナー Lv2に2ダメージ |
| 10 | planner decision | -903 | master:shield->monster:player_front_left | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 10/9 / deck player/cpu 12/12 / hand player/cpu 6/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーのマスターアタック / マスターアタックでポリスピナー Lv2に1ダメージ / ポリスピナー Lv2は倒れ、CPUにストーン2個が戻った |
| 11 | planner decision | -901 | end_turn | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 8/9 / deck player/cpu 12/12 / hand player/cpu 6/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | ポリスピナー Lv2は倒れ、CPUにストーン2個が戻った / プレイヤーAI判断: 致死圏の味方を守れるためシールド / プレイヤーはドノマンティス Lv1にシールドを張った |
| 13 | final | -1000000 | - | turn 14 / current cpu / HP player/cpu 0/8 / stones player/cpu 9/12 / deck player/cpu 12/11 / hand player/cpu 5/6 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 shield \| cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | CPUのヤンバル Lv2: ワイルドクロウ 3P / プレイヤーのマスターHPが1減った（ワイルドクロウ）。ストーン+1 / CPUの勝利 |

### summon:デスシープ->cpu_back_left

- matched: -
- rootScore: -Infinity
- winner: -
- finalScore: -Infinity
- replaySteps: 0
- finalState: turn 13 / current player / HP player/cpu 5/8 / stones player/cpu 6/6 / deck player/cpu 13/13 / hand player/cpu 5/5

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |

### selected

- matched: focus:ドノマンティス
- rootScore: 285.8
- winner: white
- finalScore: -1000000
- replaySteps: 13
- finalState: turn 14 / current cpu / HP player/cpu 0/8 / stones player/cpu 9/12 / deck player/cpu 12/11 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | -631.8 | end_turn | turn 13 / current player / HP player/cpu 5/8 / stones player/cpu 6/6 / deck player/cpu 13/13 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus \| cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーはヤンバルを引いた / プレイヤーAI判断: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面-72点、次点と63点差 / ドノマンティス Lv1はためた |
| 1 | planner decision | -631.8 | end_turn | turn 13 / current player / HP player/cpu 5/8 / stones player/cpu 6/6 / deck player/cpu 13/13 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus \| cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーはヤンバルを引いた / プレイヤーAI判断: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面-72点、次点と63点差 / ドノマンティス Lv1はためた |
| 8 | planner decision | -1006 | attack:ドノマンティス:attack->ポリスピナー | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 13/7 / deck player/cpu 12/12 / hand player/cpu 6/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus \| cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーのターン開始 / プレイヤーはストーンを3個得た / プレイヤーはデスシープを引いた |
| 9 | planner decision | -1024 | master:master_attack->monster:cpu_front_left | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 13/7 / deck player/cpu 12/12 / hand player/cpu 6/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 \| cpu_front_left:CF:ポリスピナー Lv2 HP1 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーAI判断: ポリスピナーを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面-749173点、次点と39点差 / プレイヤーのドノマンティス Lv1: アタック 3P / アタックでポリスピナー Lv2に2ダメージ |
| 10 | planner decision | -903 | master:shield->monster:player_front_left | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 10/9 / deck player/cpu 12/12 / hand player/cpu 6/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーのマスターアタック / マスターアタックでポリスピナー Lv2に1ダメージ / ポリスピナー Lv2は倒れ、CPUにストーン2個が戻った |
| 11 | planner decision | -901 | end_turn | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 8/9 / deck player/cpu 12/12 / hand player/cpu 6/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | ポリスピナー Lv2は倒れ、CPUにストーン2個が戻った / プレイヤーAI判断: 致死圏の味方を守れるためシールド / プレイヤーはドノマンティス Lv1にシールドを張った |
| 13 | final | -1000000 | - | turn 14 / current cpu / HP player/cpu 0/8 / stones player/cpu 9/12 / deck player/cpu 12/11 / hand player/cpu 5/6 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 shield \| cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | CPUのヤンバル Lv2: ワイルドクロウ 3P / プレイヤーのマスターHPが1減った（ワイルドクロウ）。ストーン+1 / CPUの勝利 |

### shield

- matched: -
- rootScore: -Infinity
- winner: -
- finalScore: -Infinity
- replaySteps: 0
- finalState: turn 13 / current player / HP player/cpu 5/8 / stones player/cpu 6/6 / deck player/cpu 13/13 / hand player/cpu 5/5

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |

### attack

- matched: attack:ドノマンティス:attack->ポリスピナー
- rootScore: -27.2
- winner: white
- finalScore: -1000000
- replaySteps: 17
- finalState: turn 14 / current cpu / HP player/cpu 0/8 / stones player/cpu 8/10 / deck player/cpu 12/11 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | -643.8 | summon:ヤンバル->player_back_left | turn 13 / current player / HP player/cpu 5/8 / stones player/cpu 6/6 / deck player/cpu 13/13 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 \| cpu_front_left:CF:ポリスピナー Lv2 HP2 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーAI判断: ポリスピナーを削れるため攻撃 / プレイヤーのドノマンティス Lv1: アタック 2P / アタックでポリスピナー Lv2に1ダメージ |
| 1 | planner decision | -643.8 | summon:ヤンバル->player_back_left | turn 13 / current player / HP player/cpu 5/8 / stones player/cpu 6/6 / deck player/cpu 13/13 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 \| cpu_front_left:CF:ポリスピナー Lv2 HP2 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーAI判断: ポリスピナーを削れるため攻撃 / プレイヤーのドノマンティス Lv1: アタック 2P / アタックでポリスピナー Lv2に1ダメージ |
| 2 | planner decision | -574.4 | master:shield->monster:player_front_left | turn 13 / current player / HP player/cpu 5/8 / stones player/cpu 5/6 / deck player/cpu 13/13 / hand player/cpu 4/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 \| player_back_left:PB:ヤンバル Lv1 HP3 prep \| cpu_front_left:CF:ポリスピナー Lv2 HP2 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | アタックでポリスピナー Lv2に1ダメージ / プレイヤーAI判断: 後衛カードを後列左へ召喚 / 見送り: 召喚は108点差で見送り、召喚は144点差で見送り / プレイヤーはヤンバルを準備中で召喚した |
| 3 | planner decision | -572.4 | end_turn | turn 13 / current player / HP player/cpu 5/8 / stones player/cpu 3/6 / deck player/cpu 13/13 / hand player/cpu 4/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 shield \| player_back_left:PB:ヤンバル Lv1 HP3 prep \| cpu_front_left:CF:ポリスピナー Lv2 HP2 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーはヤンバルを準備中で召喚した / プレイヤーAI判断: 致死圏の味方を守れるためシールド / プレイヤーはドノマンティス Lv1にシールドを張った |
| 11 | planner decision | -909 | attack:ヤンバル:wild_claw->ポリスピナー | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 10/5 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 \| player_back_left:PB:ヤンバル Lv1 HP3 act0/1 \| cpu_front_left:CF:ポリスピナー Lv2 HP2 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus,shield \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーはストーンを3個得た / ドノマンティス Lv1の防御効果が切れた / プレイヤーはデスシープを引いた |
| 12 | planner decision | -915 | attack:ドノマンティス:attack->ポリスピナー | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 10/5 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 \| player_back_left:PB:ヤンバル Lv1 HP3 act1/1 \| cpu_front_left:CF:ポリスピナー Lv2 HP1 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus,shield \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーAI判断: ポリスピナーを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面-749206点、次点と169点差 / プレイヤーのヤンバル Lv1: ワイルドクロウ 2P / ワイルドクロウでポリスピナー Lv2に1ダメージ |
| 13 | planner decision | -791 | end_turn | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 10/7 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 \| player_back_left:PB:ヤンバル Lv1 HP3 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus,shield \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | アタックでポリスピナー Lv2に1ダメージ / ポリスピナー Lv2は倒れ、CPUにストーン2個が戻った / ドノマンティス Lv1は1レベルまで上げられる |
| 14 | planner decision | -753 | master:shield->monster:player_front_left | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 9/7 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 \| player_back_left:PB:ヤンバル Lv1 HP3 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus,shield \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | ポリスピナー Lv2は倒れ、CPUにストーン2個が戻った / ドノマンティス Lv1は1レベルまで上げられる / ドノマンティス Lv2はLv2になり、HPが全回復した |
| 15 | planner decision | -751 | end_turn | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 7/7 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 shield \| player_back_left:PB:ヤンバル Lv1 HP3 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus,shield \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | ドノマンティス Lv2はLv2になり、HPが全回復した / プレイヤーAI判断: 致死圏の味方を守れるためシールド / プレイヤーはドノマンティス Lv2にシールドを張った |
| 17 | final | -1000000 | - | turn 14 / current cpu / HP player/cpu 0/8 / stones player/cpu 8/10 / deck player/cpu 12/11 / hand player/cpu 5/6 | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 shield \| player_back_left:PB:ヤンバル Lv1 HP3 act1/1 \| cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | CPUのヤンバル Lv2: ワイルドクロウ 3P / プレイヤーのマスターHPが1減った（ワイルドクロウ）。ストーン+1 / CPUの勝利 |

### summon

- matched: summon:ヤンバル->player_back_left
- rootScore: -181.7
- winner: white
- finalScore: -1000000
- replaySteps: 17
- finalState: turn 14 / current cpu / HP player/cpu 0/8 / stones player/cpu 8/10 / deck player/cpu 12/11 / hand player/cpu 5/6

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | -568.4 | focus:ドノマンティス | turn 13 / current player / HP player/cpu 5/8 / stones player/cpu 5/6 / deck player/cpu 13/13 / hand player/cpu 4/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 \| player_back_left:PB:ヤンバル Lv1 HP3 prep \| cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーはヤンバルを引いた / プレイヤーAI判断: 後衛カードを後列左へ召喚 / プレイヤーはヤンバルを準備中で召喚した |
| 1 | planner decision | -568.4 | focus:ドノマンティス | turn 13 / current player / HP player/cpu 5/8 / stones player/cpu 5/6 / deck player/cpu 13/13 / hand player/cpu 4/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 \| player_back_left:PB:ヤンバル Lv1 HP3 prep \| cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーはヤンバルを引いた / プレイヤーAI判断: 後衛カードを後列左へ召喚 / プレイヤーはヤンバルを準備中で召喚した |
| 2 | planner decision | -562.4 | master:shield->monster:player_front_left | turn 13 / current player / HP player/cpu 5/8 / stones player/cpu 5/6 / deck player/cpu 13/13 / hand player/cpu 4/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus \| player_back_left:PB:ヤンバル Lv1 HP3 prep \| cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーはヤンバルを準備中で召喚した / プレイヤーAI判断: 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面-4点、次点と105点差 / ドノマンティス Lv1はためた |
| 3 | planner decision | -560.4 | end_turn | turn 13 / current player / HP player/cpu 5/8 / stones player/cpu 3/6 / deck player/cpu 13/13 / hand player/cpu 4/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus,shield \| player_back_left:PB:ヤンバル Lv1 HP3 prep \| cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | ドノマンティス Lv1はためた / プレイヤーAI判断: 高価値の味方を守るためシールド / プレイヤーはドノマンティス Lv1にシールドを張った |
| 11 | planner decision | -897 | attack:ドノマンティス:attack->ポリスピナー | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 10/5 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus \| player_back_left:PB:ヤンバル Lv1 HP3 act0/1 \| cpu_front_left:CF:ポリスピナー Lv2 HP3 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus,shield \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーはストーンを3個得た / ドノマンティス Lv1の防御効果が切れた / プレイヤーはデスシープを引いた |
| 12 | planner decision | -915 | attack:ヤンバル:wild_claw->ポリスピナー | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 10/5 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 \| player_back_left:PB:ヤンバル Lv1 HP3 act0/1 \| cpu_front_left:CF:ポリスピナー Lv2 HP1 act2/2 shield \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus,shield \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | プレイヤーAI判断: ポリスピナーを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面-749226点、次点と29点差 / プレイヤーのドノマンティス Lv1: アタック 3P / アタックでポリスピナー Lv2に2ダメージ |
| 13 | planner decision | -791 | end_turn | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 10/7 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 \| player_back_left:PB:ヤンバル Lv1 HP3 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus,shield \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | ワイルドクロウでポリスピナー Lv2に1ダメージ / ポリスピナー Lv2は倒れ、CPUにストーン2個が戻った / ヤンバル Lv1は1レベルまで上げられる |
| 14 | planner decision | -753 | master:shield->monster:player_front_left | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 9/7 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 \| player_back_left:PB:ヤンバル Lv2 HP3 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus,shield \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | ポリスピナー Lv2は倒れ、CPUにストーン2個が戻った / ヤンバル Lv1は1レベルまで上げられる / ヤンバル Lv2はLv2になり、HPが全回復した |
| 15 | planner decision | -751 | end_turn | turn 14 / current player / HP player/cpu 1/8 / stones player/cpu 7/7 / deck player/cpu 12/12 / hand player/cpu 5/5 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 shield \| player_back_left:PB:ヤンバル Lv2 HP3 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 focus,shield \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | ヤンバル Lv2はLv2になり、HPが全回復した / プレイヤーAI判断: 致死圏の味方を守れるためシールド / プレイヤーはドノマンティス Lv1にシールドを張った |
| 17 | final | -1000000 | - | turn 14 / current cpu / HP player/cpu 0/8 / stones player/cpu 8/10 / deck player/cpu 12/11 / hand player/cpu 5/6 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 shield \| player_back_left:PB:ヤンバル Lv2 HP3 act1/1 \| cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 focus \| cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | CPUのヤンバル Lv2: ワイルドクロウ 3P / プレイヤーのマスターHPが1減った（ワイルドクロウ）。ストーン+1 / CPUの勝利 |


