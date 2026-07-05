# White Planner Branch Timeline

生成: 2026-07-05T00:15:31.066Z
seed: 994311
direction: challenger-as-player
step: 10
deck: `master-lab-white-1377-death-sheep3`
search: `{}`
plannerSide: player

## Start

- state: turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 24/24 / hand player/cpu 3/3
- board: player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:デスシープ Lv1 HP6 prep | cpu_front_right:CF:ポリスピナー Lv1 HP3 prep | cpu_back_left:CB:ヤンバル Lv1 HP3 prep
- selected: master:shield->monster:player_front_right

## Conclusion

- 同一局面から候補を強制し、planner側の次手番ごとの状態差を追跡した。
- selected: master:shield->monster:player_front_right -> no winner / score -277
- summon:デスシープ->cpu_back_left: - -> no winner / score -Infinity
- selected: master:shield->monster:player_front_right -> no winner / score -277
- end_turn: end_turn -> no winner / score -354

## Timelines

### selected

- matched: master:shield->monster:player_front_right
- rootScore: 67.7
- winner: -
- finalScore: -277
- replaySteps: 40
- finalState: turn 5 / current player / HP player/cpu 9/10 / stones player/cpu 5/1 / deck player/cpu 21/21 / hand player/cpu 3/2

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | 113.8 | end_turn | turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 1/0 / deck player/cpu 24/24 / hand player/cpu 3/3 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus \| player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus,shield \| player_back_left:PB:ポリスピナー Lv1 HP3 prep \| cpu_front_left:CF:デスシープ Lv1 HP6 prep \| cpu_front_right:CF:ポリスピナー Lv1 HP3 prep \| cpu_back_left:CB:ヤンバル Lv1 HP3 prep | プレイヤーはポリスピナーを準備中で召喚した / プレイヤーAI判断: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面-55点、次点と7点差 / プレイヤーはドノマンティス Lv1にシールドを張った |
| 1 | planner decision | 113.8 | end_turn | turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 1/0 / deck player/cpu 24/24 / hand player/cpu 3/3 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus \| player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus,shield \| player_back_left:PB:ポリスピナー Lv1 HP3 prep \| cpu_front_left:CF:デスシープ Lv1 HP6 prep \| cpu_front_right:CF:ポリスピナー Lv1 HP3 prep \| cpu_back_left:CB:ヤンバル Lv1 HP3 prep | プレイヤーはポリスピナーを準備中で召喚した / プレイヤーAI判断: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面-55点、次点と7点差 / プレイヤーはドノマンティス Lv1にシールドを張った |
| 10 | planner decision | -206 | attack:ドノマンティス:attack->ポリスピナー | turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 5/0 / deck player/cpu 23/23 / hand player/cpu 4/3 | player_front_left:PF:ポリスピナー Lv1 HP3 act0/2 \| player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 \| cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus \| cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 \| cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | プレイヤーはストーンを3個得た / ドノマンティス Lv1の防御効果が切れた / プレイヤーはボムゾウを引いた |
| 11 | planner decision | -194 | focus:ポリスピナー | turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 5/0 / deck player/cpu 23/23 / hand player/cpu 4/3 | player_front_left:PF:ポリスピナー Lv1 HP3 act0/2 \| player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 \| cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP2 act2/2 \| cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 \| cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | プレイヤーのドノマンティス Lv1: アタック 2P / ポリスピナー Lv1は気合いで1ダメージ軽減した / アタックでポリスピナー Lv1に1ダメージ |
| 12 | planner decision | -176 | magic:ワープ->monster:cpu_back_right | turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 5/0 / deck player/cpu 23/23 / hand player/cpu 4/3 | player_front_left:PF:ポリスピナー Lv1 HP3 act1/2 focus \| player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 \| cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP2 act2/2 \| cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 \| cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | アタックでポリスピナー Lv1に1ダメージ / プレイヤーAI判断: 有効攻撃がないためためる / 見送り: マスター特技は147点差で見送り、召喚は165点差で見送り / ポリスピナー Lv1はためた |
| 13 | planner decision | -136 | summon:ボムゾウ->player_back_left | turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 2/0 / deck player/cpu 23/23 / hand player/cpu 3/3 | player_front_left:PF:ポリスピナー Lv1 HP3 act1/2 focus \| player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 \| cpu_front_left:CF:ヤンバル Lv1 HP3 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP2 act2/2 \| cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 \| cpu_back_right:CB:デスシープ Lv1 HP6 act1/1 | プレイヤーAI判断: ワープで追加対象も有効にできるため使用 / 見送り: マジックは59点差で見送り、マジックは59点差で見送り / プレイヤーはワープを使った / ヤンバル Lv1とデスシープ Lv1の位置を入れ替えた |

### summon:デスシープ->cpu_back_left

- matched: -
- rootScore: -Infinity
- winner: -
- finalScore: -Infinity
- replaySteps: 0
- finalState: turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 24/24 / hand player/cpu 3/3

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |

### selected

- matched: master:shield->monster:player_front_right
- rootScore: 67.7
- winner: -
- finalScore: -277
- replaySteps: 40
- finalState: turn 5 / current player / HP player/cpu 9/10 / stones player/cpu 5/1 / deck player/cpu 21/21 / hand player/cpu 3/2

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | 113.8 | end_turn | turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 1/0 / deck player/cpu 24/24 / hand player/cpu 3/3 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus \| player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus,shield \| player_back_left:PB:ポリスピナー Lv1 HP3 prep \| cpu_front_left:CF:デスシープ Lv1 HP6 prep \| cpu_front_right:CF:ポリスピナー Lv1 HP3 prep \| cpu_back_left:CB:ヤンバル Lv1 HP3 prep | プレイヤーはポリスピナーを準備中で召喚した / プレイヤーAI判断: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面-55点、次点と7点差 / プレイヤーはドノマンティス Lv1にシールドを張った |
| 1 | planner decision | 113.8 | end_turn | turn 2 / current player / HP player/cpu 10/10 / stones player/cpu 1/0 / deck player/cpu 24/24 / hand player/cpu 3/3 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus \| player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus,shield \| player_back_left:PB:ポリスピナー Lv1 HP3 prep \| cpu_front_left:CF:デスシープ Lv1 HP6 prep \| cpu_front_right:CF:ポリスピナー Lv1 HP3 prep \| cpu_back_left:CB:ヤンバル Lv1 HP3 prep | プレイヤーはポリスピナーを準備中で召喚した / プレイヤーAI判断: 高価値の味方を守るためシールド / ターンプラン探索: 返し込み最終盤面-55点、次点と7点差 / プレイヤーはドノマンティス Lv1にシールドを張った |
| 10 | planner decision | -206 | attack:ドノマンティス:attack->ポリスピナー | turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 5/0 / deck player/cpu 23/23 / hand player/cpu 4/3 | player_front_left:PF:ポリスピナー Lv1 HP3 act0/2 \| player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 \| cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act2/2 focus \| cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 \| cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | プレイヤーはストーンを3個得た / ドノマンティス Lv1の防御効果が切れた / プレイヤーはボムゾウを引いた |
| 11 | planner decision | -194 | focus:ポリスピナー | turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 5/0 / deck player/cpu 23/23 / hand player/cpu 4/3 | player_front_left:PF:ポリスピナー Lv1 HP3 act0/2 \| player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 \| cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP2 act2/2 \| cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 \| cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | プレイヤーのドノマンティス Lv1: アタック 2P / ポリスピナー Lv1は気合いで1ダメージ軽減した / アタックでポリスピナー Lv1に1ダメージ |
| 12 | planner decision | -176 | magic:ワープ->monster:cpu_back_right | turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 5/0 / deck player/cpu 23/23 / hand player/cpu 4/3 | player_front_left:PF:ポリスピナー Lv1 HP3 act1/2 focus \| player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 \| cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP2 act2/2 \| cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 \| cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | アタックでポリスピナー Lv1に1ダメージ / プレイヤーAI判断: 有効攻撃がないためためる / 見送り: マスター特技は147点差で見送り、召喚は165点差で見送り / ポリスピナー Lv1はためた |
| 13 | planner decision | -136 | summon:ボムゾウ->player_back_left | turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 2/0 / deck player/cpu 23/23 / hand player/cpu 3/3 | player_front_left:PF:ポリスピナー Lv1 HP3 act1/2 focus \| player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 \| cpu_front_left:CF:ヤンバル Lv1 HP3 act1/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP2 act2/2 \| cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 \| cpu_back_right:CB:デスシープ Lv1 HP6 act1/1 | プレイヤーAI判断: ワープで追加対象も有効にできるため使用 / 見送り: マジックは59点差で見送り、マジックは59点差で見送り / プレイヤーはワープを使った / ヤンバル Lv1とデスシープ Lv1の位置を入れ替えた |

### end_turn

- matched: end_turn
- rootScore: -87.3
- winner: -
- finalScore: -354
- replaySteps: 40
- finalState: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/3 / deck player/cpu 20/20 / hand player/cpu 4/3

| replay | label | score | next decision | state | board | recent log |
| ---: | --- | ---: | --- | --- | --- | --- |
| 1 | after forced decision | -56 | - | turn 2 / current cpu / HP player/cpu 10/10 / stones player/cpu 3/3 / deck player/cpu 24/23 / hand player/cpu 3/4 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus \| player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus \| player_back_left:PB:ポリスピナー Lv1 HP3 prep \| cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 \| cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 \| cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | ヤンバル Lv1が登場した / CPUはストーンを3個得た / CPUはカードを引いた |
| 7 | planner decision | -206.4 | magic:ワープ->monster:cpu_back_left | turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 7/1 / deck player/cpu 23/23 / hand player/cpu 4/3 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus \| player_back_left:PB:ポリスピナー Lv1 HP3 act0/2 \| cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus \| cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 \| cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 \| cpu_back_right:CB:ヤンバル Lv1 HP3 prep | ポリスピナー Lv1が登場した / プレイヤーはストーンを3個得た / プレイヤーはボムゾウを引いた |
| 8 | planner decision | -166.4 | move:player_back_left->player_front_right | turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 4/1 / deck player/cpu 23/23 / hand player/cpu 3/3 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus \| player_back_left:PB:ポリスピナー Lv1 HP3 act0/2 \| cpu_front_left:CF:ヤンバル Lv1 HP3 act1/1 \| cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 \| cpu_back_left:CB:デスシープ Lv1 HP6 act1/1 focus \| cpu_back_right:CB:ヤンバル Lv1 HP3 prep | プレイヤーAI判断: ワープで追加対象も有効にできるため使用 / 見送り: マジックは1点差で見送り、移動は251点差で見送り / プレイヤーはワープを使った / ヤンバル Lv1とデスシープ Lv1の位置を入れ替えた |
| 9 | planner decision | -146.4 | attack:ドノマンティス:attack->ヤンバル | turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 4/1 / deck player/cpu 23/23 / hand player/cpu 3/3 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus \| player_front_right:PF:ポリスピナー Lv1 HP3 act1/2 \| cpu_front_left:CF:ヤンバル Lv1 HP3 act1/1 \| cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 \| cpu_back_left:CB:デスシープ Lv1 HP6 act1/1 focus \| cpu_back_right:CB:ヤンバル Lv1 HP3 prep | ヤンバル Lv1とデスシープ Lv1の位置を入れ替えた / プレイヤーAI判断: 移動後に強い攻撃筋を作れるため移動 / 見送り: 召喚は4点差で見送り、攻撃は29点差で見送り / ポリスピナー Lv1を移動した |
| 10 | planner decision | -102.4 | end_turn | turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 4/2 / deck player/cpu 23/23 / hand player/cpu 3/3 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 \| player_front_right:PF:ポリスピナー Lv1 HP3 act1/2 \| cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 \| cpu_back_left:CB:デスシープ Lv1 HP6 act1/1 focus \| cpu_back_right:CB:ヤンバル Lv1 HP3 prep | アタックでヤンバル Lv1に3ダメージ / ヤンバル Lv1は倒れ、CPUにストーン1個が戻った / ドノマンティス Lv1は1レベルまで上げられる |
| 11 | planner decision | -64.4 | attack:ポリスピナー:attack->ポリスピナー | turn 3 / current player / HP player/cpu 10/10 / stones player/cpu 3/2 / deck player/cpu 23/23 / hand player/cpu 3/3 | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 \| player_front_right:PF:ポリスピナー Lv1 HP3 act1/2 \| cpu_front_right:CF:ポリスピナー Lv2 HP3 act2/2 \| cpu_back_left:CB:デスシープ Lv1 HP6 act1/1 focus \| cpu_back_right:CB:ヤンバル Lv1 HP3 prep | ヤンバル Lv1は倒れ、CPUにストーン1個が戻った / ドノマンティス Lv1は1レベルまで上げられる / ドノマンティス Lv2はLv2になり、HPが全回復した |
