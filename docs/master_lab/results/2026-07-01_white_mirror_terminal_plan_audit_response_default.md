# White AI Terminal Plan Audit

生成: 2026-07-01T08:30:45.411Z
デッキ: `master-lab-white-1377-death-sheep3` vs `master-lab-white-1377-death-sheep3`
seedStart: 962000, maxSeeds: 4
search: depth 4, width 4, detailed 4
terminalPlan: depth 6, width 2, weight 2
opponentTerminalPlan: depth 2, width 2, weight 0.5
beamWidth: 2, maxActions: 6, responseRankLimit: 8

## Summary

- selected top1: 0/2
- selected average rank: 18.5
- average gap to best: 42.5
- max gap to best: 73
- selected response top1: 0/2
- selected average response rank: 4.5
- average response gap to best: 148.3
- max response gap to best: 196.6

## Method

- 実戦途中の白同士局面から、現行AI評価の上位候補を幅 `beamWidth` で拾い、各手順をエンドターンまで進めた。
- `terminal` は、相手ターン開始後の盤面を白AI重みの `evaluateState` で評価した値。`guide` は現行AIの局所評価合計で、terminalとは別物。
- `opponent response` は、渡した盤面から相手AIが同じ軽量設定でエンドターンまで進めた後の盤面評価。勝率ではなく「渡した盤面が相手にどう返されるか」を見るための補助線。
- `response rank` は、終端評価上位 `responseRankLimit` 本と実選択手順を対象に、相手応答後の盤面評価で並べた順位。
- この監査は勝率ではなく、現行AIの選択手順と「相手へ渡す最終盤面」「相手から返る最終盤面」のズレを見るためのもの。

## Conclusion

- 現行AIの選択手順が終端盤面1位だった局面は 0/2。
- 平均ギャップは 42.5 点。80点以上のズレは 0/2。
- 相手応答後1位だった局面は 0/2。応答後平均ギャップは 148.3 点。80点以上のズレは 2/2。
- 現行選択はシールド 1/2、フォーカス 2/2 を含む。終端1位はシールド 0/2、フォーカス 0/2。応答後1位はシールド 0/2、フォーカス 0/2。
- このサンプルでは現行AIの手順選択と終端盤面評価のズレは限定的。次はサンプル局面を増やすか、対黒局面でも同じ監査を行う。

## Scenarios

### 1. seed 962000 turn 5 player

- step: 38
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 3/4 / hand player/cpu 6/5
- initialScore: -175
- selectedTerminalRank: 2
- selectedResponseRank: 3
- terminalGapToBest: 12
- responseGapToBest: 196.6
- board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:デスシープ Lv1 HP3 act0/1 focus | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:ピグミィ Lv1 HP3 act0/2 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1

#### Selected plan

1. terminal 103 (+278) / response -132 (-235) / guide 3045.9 / truncated
   - actions: ヤンバル wild_claw -> デスシープ [588.3] -> focus ドノマンティス [531.4] -> move ピグミィ player_front_right->player_back_right [400.8] -> summon 真勇者ダイン -> player_front_right [492.7] -> master wake_up -> 真勇者ダイン@player_front_right [600.1] -> 真勇者ダイン ダイン斬り -> デスシープ [555.1] -> end turn [-122.4]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 0/8, boardValue 570/450, ready 1/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal -132 (-235) / truncated
     - actions: summon ピグミィ -> cpu_back_right [293.7] -> ボムゾウ storm_bomb -> ドノマンティス [383.9] -> ヤンバル wild_claw -> ドノマンティス [497.3] -> master master_attack -> ドノマンティス@player_front_left [404.2] -> master wake_up -> ピグミィ@cpu_back_right [695.1] -> ピグミィ スパイクボール -> ドノマンティス [633.2] -> end turn [-86]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 4/1 / hand player/cpu 6/5
     - metrics: HP 10/10, stones 4/1, boardValue 420/680, ready 3/2, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus

#### Top terminal plans

1. terminal 115 (+290) / response -57.4 (-172.4) / guide 2800.8
   - actions: ヤンバル wild_claw -> デスシープ [588.3] -> move ピグミィ player_front_right->player_back_right [412.9] -> summon 真勇者ダイン -> player_front_right [541.8] -> master wake_up -> 真勇者ダイン@player_front_right [639.4] -> 真勇者ダイン ダイン斬り -> デスシープ [629.8] -> end turn [-11.3]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 0/8, boardValue 570/450, ready 2/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal -57.4 (-172.4)
     - actions: summon ピグミィ -> cpu_back_right [303.3] -> ボムゾウ storm_bomb -> ドノマンティス [392.6] -> ヤンバル wild_claw -> ドノマンティス [510.9] -> デスシープ attack -> ドノマンティス [404.8] -> end turn [-61.7]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 4/6 / hand player/cpu 6/5
     - metrics: HP 10/10, stones 4/6, boardValue 420/680, ready 3/0, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
2. terminal 103 (+278) / response -132 (-235) / guide 3045.9 / truncated
   - actions: ヤンバル wild_claw -> デスシープ [588.3] -> focus ドノマンティス [531.4] -> move ピグミィ player_front_right->player_back_right [400.8] -> summon 真勇者ダイン -> player_front_right [492.7] -> master wake_up -> 真勇者ダイン@player_front_right [600.1] -> 真勇者ダイン ダイン斬り -> デスシープ [555.1] -> end turn [-122.4]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 0/8, boardValue 570/450, ready 1/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal -132 (-235) / truncated
     - actions: summon ピグミィ -> cpu_back_right [293.7] -> ボムゾウ storm_bomb -> ドノマンティス [383.9] -> ヤンバル wild_claw -> ドノマンティス [497.3] -> master master_attack -> ドノマンティス@player_front_left [404.2] -> master wake_up -> ピグミィ@cpu_back_right [695.1] -> ピグミィ スパイクボール -> ドノマンティス [633.2] -> end turn [-86]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 4/1 / hand player/cpu 6/5
     - metrics: HP 10/10, stones 4/1, boardValue 420/680, ready 3/2, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
3. terminal 103 (+278) / response -132 (-235) / guide 3069.4 / truncated
   - actions: ヤンバル wild_claw -> デスシープ [588.3] -> move ピグミィ player_front_right->player_back_right [412.9] -> focus ドノマンティス [542.7] -> summon 真勇者ダイン -> player_front_right [492.7] -> master wake_up -> 真勇者ダイン@player_front_right [600.1] -> 真勇者ダイン ダイン斬り -> デスシープ [555.1] -> end turn [-122.4]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 0/8, boardValue 570/450, ready 1/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal -132 (-235) / truncated
     - actions: summon ピグミィ -> cpu_back_right [293.7] -> ボムゾウ storm_bomb -> ドノマンティス [383.9] -> ヤンバル wild_claw -> ドノマンティス [497.3] -> master master_attack -> ドノマンティス@player_front_left [404.2] -> master wake_up -> ピグミィ@cpu_back_right [695.1] -> ピグミィ スパイクボール -> ドノマンティス [633.2] -> end turn [-86]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 4/1 / hand player/cpu 6/5
     - metrics: HP 10/10, stones 4/1, boardValue 420/680, ready 3/2, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus

#### Top response-adjusted plans

1. terminal 103 (+278) / response 64.6 (-38.4) / guide 2974 / truncated
   - actions: ヤンバル wild_claw -> デスシープ [588.3] -> move ピグミィ player_front_right->player_back_right [412.9] -> summon 真勇者ダイン -> player_front_right [541.8] -> master wake_up -> 真勇者ダイン@player_front_right [639.4] -> 真勇者ダイン ダイン斬り -> デスシープ [629.8] -> ピグミィ スパイクボール -> デスシープ [190.3] -> end turn [-28.4]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 0/8, boardValue 570/450, ready 1/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2
   - opponent response: terminal 64.6 (-38.4)
     - actions: focus デスシープ [332.9] -> move ヤンバル cpu_front_right->cpu_back_left [193.8] -> summon ピグミィ -> cpu_back_right [141.4] -> end turn [-185.4]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/7 / hand player/cpu 6/5
     - metrics: HP 10/10, stones 3/7, boardValue 570/580, ready 4/0, shield 0/0, Lv2+ 0/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ボムゾウ Lv1 HP6 act1/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2
2. terminal 115 (+290) / response -57.4 (-172.4) / guide 2800.8
   - actions: ヤンバル wild_claw -> デスシープ [588.3] -> move ピグミィ player_front_right->player_back_right [412.9] -> summon 真勇者ダイン -> player_front_right [541.8] -> master wake_up -> 真勇者ダイン@player_front_right [639.4] -> 真勇者ダイン ダイン斬り -> デスシープ [629.8] -> end turn [-11.3]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 0/8, boardValue 570/450, ready 2/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal -57.4 (-172.4)
     - actions: summon ピグミィ -> cpu_back_right [303.3] -> ボムゾウ storm_bomb -> ドノマンティス [392.6] -> ヤンバル wild_claw -> ドノマンティス [510.9] -> デスシープ attack -> ドノマンティス [404.8] -> end turn [-61.7]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 4/6 / hand player/cpu 6/5
     - metrics: HP 10/10, stones 4/6, boardValue 420/680, ready 3/0, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
3. terminal 103 (+278) / response -132 (-235) / guide 3045.9 / truncated
   - actions: ヤンバル wild_claw -> デスシープ [588.3] -> focus ドノマンティス [531.4] -> move ピグミィ player_front_right->player_back_right [400.8] -> summon 真勇者ダイン -> player_front_right [492.7] -> master wake_up -> 真勇者ダイン@player_front_right [600.1] -> 真勇者ダイン ダイン斬り -> デスシープ [555.1] -> end turn [-122.4]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 0/8, boardValue 570/450, ready 1/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal -132 (-235) / truncated
     - actions: summon ピグミィ -> cpu_back_right [293.7] -> ボムゾウ storm_bomb -> ドノマンティス [383.9] -> ヤンバル wild_claw -> ドノマンティス [497.3] -> master master_attack -> ドノマンティス@player_front_left [404.2] -> master wake_up -> ピグミィ@cpu_back_right [695.1] -> ピグミィ スパイクボール -> ドノマンティス [633.2] -> end turn [-86]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 4/1 / hand player/cpu 6/5
     - metrics: HP 10/10, stones 4/1, boardValue 420/680, ready 3/2, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus

### 2. seed 962001 turn 5 player

- step: 40
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 4/3 / hand player/cpu 4/3
- initialScore: 52
- selectedTerminalRank: 35
- selectedResponseRank: 6
- terminalGapToBest: 73
- responseGapToBest: 100
- board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act2/2 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus

#### Selected plan

1. terminal 163 (+111) / response 14.2 (-148.8) / guide 1313.5
   - actions: focus デスシープ [487.7] -> ポリスピナー attack -> ピグミィ [471.8] -> ヤンバル wild_claw -> ピグミィ [548.1] -> focus ポリスピナー [62.1] -> master shield -> ポリスピナー@player_front_right [-97.8] -> end turn [-158.5]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 1/7 / hand player/cpu 4/4
   - metrics: HP 10/10, stones 1/7, boardValue 700/420, ready 1/3, shield 1/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act2/2 shield,focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal 14.2 (-148.8) / truncated
     - actions: ヤンバル wild_claw -> ポリスピナー [423.8] -> ヤンバル wild_claw -> ヤンバル [147] -> 真勇者ダイン ダイン斬り -> デスシープ [125.2] -> master master_attack -> デスシープ@player_front_left [255.1] -> master master_attack -> デスシープ@player_front_left [384] -> summon 真勇者ダイン -> cpu_back_right [38] -> end turn [-164.6]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 5/0 / hand player/cpu 5/3
     - metrics: HP 10/10, stones 5/0, boardValue 500/580, ready 3/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ヤンバル Lv2 HP1 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus

#### Top terminal plans

1. terminal 236 (+184) / response -48.8 (-284.8) / guide 1272.1
   - actions: ヤンバル wild_claw -> ピグミィ [477.9] -> ポリスピナー attack -> ピグミィ [540.5] -> ポリスピナー attack -> cpu master [302.6] -> end turn [-48.9]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 3/8 / hand player/cpu 4/4
   - metrics: HP 10/9, stones 3/8, boardValue 680/420, ready 2/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:ポリスピナー Lv2 HP3 act2/2 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal -48.8 (-284.8) / truncated
     - actions: summon 真勇者ダイン -> cpu_back_right [144.8] -> master master_attack -> ポリスピナー@player_front_right [183.8] -> ヤンバル wild_claw -> ポリスピナー [787.5] -> ヤンバル wild_claw -> デスシープ [-60.2] -> master master_attack -> デスシープ@player_front_left [324.8] -> 真勇者ダイン ダイン斬り -> デスシープ [483.3] -> end turn [-216.5]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 9/0 / hand player/cpu 5/3
     - metrics: HP 10/9, stones 9/0, boardValue 290/680, ready 2/0, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus
2. terminal 232 (+180) / response 104.2 (-127.8) / guide 1109.4
   - actions: ヤンバル wild_claw -> ピグミィ [477.9] -> ポリスピナー attack -> ピグミィ [540.5] -> ポリスピナー attack -> cpu master [302.6] -> デスシープ attack -> 真勇者ダイン [-23.7] -> master shield -> デスシープ@player_front_left [-61.7] -> end turn [-126.3]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 1/8 / hand player/cpu 4/4
   - metrics: HP 10/9, stones 1/8, boardValue 700/410, ready 1/3, shield 1/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 shield | player_front_right:PF:ポリスピナー Lv2 HP3 act2/2 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal 104.2 (-127.8) / truncated
     - actions: focus 真勇者ダイン [464.9] -> ヤンバル wild_claw -> ポリスピナー [402] -> master master_attack -> ポリスピナー@player_front_right [600.3] -> ヤンバル wild_claw -> ヤンバル [152.4] -> summon 真勇者ダイン -> cpu_back_right [115.6] -> master shield -> ヤンバル@cpu_front_right [-5.5] -> end turn [-352.9]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 6/2 / hand player/cpu 5/3
     - metrics: HP 10/9, stones 6/2, boardValue 430/590, ready 3/0, shield 0/1, Lv2+ 0/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 shield | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP1 act0/1
3. terminal 232 (+180) / response 45.2 (-186.8) / guide 1206.7
   - actions: ヤンバル wild_claw -> ピグミィ [477.9] -> ポリスピナー attack -> ピグミィ [540.5] -> ポリスピナー attack -> cpu master [302.6] -> デスシープ attack -> 真勇者ダイン [-23.7] -> master shield -> ポリスピナー@player_front_right [35.7] -> end turn [-126.3]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 1/8 / hand player/cpu 4/4
   - metrics: HP 10/9, stones 1/8, boardValue 700/410, ready 1/3, shield 1/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ポリスピナー Lv2 HP3 act2/2 shield | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal 45.2 (-186.8) / truncated
     - actions: focus 真勇者ダイン [296.5] -> ヤンバル wild_claw -> ヤンバル [141.8] -> summon 真勇者ダイン -> cpu_back_right [76.7] -> master master_attack -> デスシープ@player_front_left [69.7] -> master master_attack -> デスシープ@player_front_left [341.6] -> ヤンバル wild_claw -> デスシープ [631.8] -> end turn [-120.5]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 5/0 / hand player/cpu 5/3
     - metrics: HP 10/9, stones 5/0, boardValue 500/670, ready 3/0, shield 0/0, Lv2+ 1/1
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ヤンバル Lv1 HP1 act0/1 | player_front_right:PF:ポリスピナー Lv2 HP3 act0/2 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus

#### Top response-adjusted plans

1. terminal 230 (+178) / response 114.2 (-115.8) / guide 1183
   - actions: ヤンバル wild_claw -> ピグミィ [477.9] -> ポリスピナー attack -> ピグミィ [540.5] -> ポリスピナー attack -> cpu master [302.6] -> デスシープ attack -> 真勇者ダイン [-23.7] -> end turn [-114.3]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 3/8 / hand player/cpu 4/4
   - metrics: HP 10/9, stones 3/8, boardValue 680/410, ready 1/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ポリスピナー Lv2 HP3 act2/2 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal 114.2 (-115.8) / truncated
     - actions: focus 真勇者ダイン [462.8] -> ヤンバル wild_claw -> ポリスピナー [402] -> master master_attack -> ポリスピナー@player_front_right [605.3] -> ヤンバル wild_claw -> ヤンバル [128.4] -> summon 真勇者ダイン -> cpu_back_right [91.6] -> master shield -> ヤンバル@cpu_front_right [-32.5] -> end turn [-391.6]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 8/2 / hand player/cpu 5/3
     - metrics: HP 10/9, stones 8/2, boardValue 430/590, ready 3/0, shield 0/1, Lv2+ 0/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 shield | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP1 act0/1
2. terminal 232 (+180) / response 104.2 (-127.8) / guide 1109.4
   - actions: ヤンバル wild_claw -> ピグミィ [477.9] -> ポリスピナー attack -> ピグミィ [540.5] -> ポリスピナー attack -> cpu master [302.6] -> デスシープ attack -> 真勇者ダイン [-23.7] -> master shield -> デスシープ@player_front_left [-61.7] -> end turn [-126.3]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 1/8 / hand player/cpu 4/4
   - metrics: HP 10/9, stones 1/8, boardValue 700/410, ready 1/3, shield 1/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 shield | player_front_right:PF:ポリスピナー Lv2 HP3 act2/2 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal 104.2 (-127.8) / truncated
     - actions: focus 真勇者ダイン [464.9] -> ヤンバル wild_claw -> ポリスピナー [402] -> master master_attack -> ポリスピナー@player_front_right [600.3] -> ヤンバル wild_claw -> ヤンバル [152.4] -> summon 真勇者ダイン -> cpu_back_right [115.6] -> master shield -> ヤンバル@cpu_front_right [-5.5] -> end turn [-352.9]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 6/2 / hand player/cpu 5/3
     - metrics: HP 10/9, stones 6/2, boardValue 430/590, ready 3/0, shield 0/1, Lv2+ 0/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 shield | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP1 act0/1
3. terminal 232 (+180) / response 45.2 (-186.8) / guide 1206.7
   - actions: ヤンバル wild_claw -> ピグミィ [477.9] -> ポリスピナー attack -> ピグミィ [540.5] -> ポリスピナー attack -> cpu master [302.6] -> デスシープ attack -> 真勇者ダイン [-23.7] -> master shield -> ポリスピナー@player_front_right [35.7] -> end turn [-126.3]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 1/8 / hand player/cpu 4/4
   - metrics: HP 10/9, stones 1/8, boardValue 700/410, ready 1/3, shield 1/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ポリスピナー Lv2 HP3 act2/2 shield | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal 45.2 (-186.8) / truncated
     - actions: focus 真勇者ダイン [296.5] -> ヤンバル wild_claw -> ヤンバル [141.8] -> summon 真勇者ダイン -> cpu_back_right [76.7] -> master master_attack -> デスシープ@player_front_left [69.7] -> master master_attack -> デスシープ@player_front_left [341.6] -> ヤンバル wild_claw -> デスシープ [631.8] -> end turn [-120.5]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 5/0 / hand player/cpu 5/3
     - metrics: HP 10/9, stones 5/0, boardValue 500/670, ready 3/0, shield 0/0, Lv2+ 1/1
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ヤンバル Lv1 HP1 act0/1 | player_front_right:PF:ポリスピナー Lv2 HP3 act0/2 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus

