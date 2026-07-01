# White AI Terminal Plan Audit

生成: 2026-07-01T08:50:49.359Z
デッキ: `master-lab-white-1377-death-sheep3` vs `master-lab-white-1377-death-sheep3`
seedStart: 962000, maxSeeds: 4
search: depth 4, width 4, detailed 4
terminalPlan: depth 6, width 2, weight 2
opponentTerminalPlan: depth 2, width 2, weight 0.5
beamWidth: 2, maxActions: 6, responseRankLimit: 8

## Summary

- selected top1: 0/2
- selected average rank: 36.5
- average gap to best: 145.1
- max gap to best: 255
- selected response top1: 1/2
- selected average response rank: 5
- average response gap to best: 44.5
- max response gap to best: 89

## Method

- 実戦途中の白同士局面から、現行AI評価の上位候補を幅 `beamWidth` で拾い、各手順をエンドターンまで進めた。
- `terminal` は、相手ターン開始後の盤面を白AI重みの `evaluateState` で評価した値。`guide` は現行AIの局所評価合計で、terminalとは別物。
- `opponent response` は、渡した盤面から相手AIが同じ軽量設定でエンドターンまで進めた後の盤面評価。勝率ではなく「渡した盤面が相手にどう返されるか」を見るための補助線。
- `response rank` は、終端評価上位 `responseRankLimit` 本と実選択手順を対象に、相手応答後の盤面評価で並べた順位。
- この監査は勝率ではなく、現行AIの選択手順と「相手へ渡す最終盤面」「相手から返る最終盤面」のズレを見るためのもの。

## Conclusion

- 現行AIの選択手順が終端盤面1位だった局面は 0/2。
- 平均ギャップは 145.1 点。80点以上のズレは 1/2。
- 相手応答後1位だった局面は 1/2。応答後平均ギャップは 44.5 点。80点以上のズレは 1/2。
- 現行選択はシールド 1/2、フォーカス 2/2 を含む。終端1位はシールド 0/2、フォーカス 2/2。応答後1位はシールド 1/2、フォーカス 2/2。
- 勝率ベンチを増やす前に、ズレが大きい局面の手順評価を読み、追加行動の局所加点より終端盤面の石・行動済み・レベルアップ成果を優先する候補を作る。

## Scenarios

### 1. seed 962000 turn 5 player

- step: 37
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 3/4 / hand player/cpu 6/5
- initialScore: -193
- selectedTerminalRank: 12
- selectedResponseRank: 1
- terminalGapToBest: 35.2
- responseGapToBest: 0
- board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:デスシープ Lv1 HP1 act0/1 focus | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:ピグミィ Lv1 HP3 act0/2 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1

#### Selected plan

1. terminal 79.8 (+272.8) / response 162 (+82.2) / guide 1420
   - actions: ヤンバル wild_claw -> デスシープ [586.1] -> focus ドノマンティス [349.6] -> ピグミィ スパイクボール -> デスシープ [206.3] -> move ピグミィ player_front_right->player_back_right [172.7] -> summon 真勇者ダイン -> player_front_right [150.8] -> end turn [-45.5]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 1/8 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 1/8, boardValue 670/450, ready 0/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 prep | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2
   - opponent response: terminal 162 (+82.2) / truncated
     - actions: focus デスシープ [234.7] -> summon ポリスピナー -> cpu_back_right [80] -> ヤンバル wild_claw -> ピグミィ [44.4] -> ボムゾウ storm_bomb -> ドノマンティス [-180.1] -> master master_attack -> ドノマンティス@player_front_left [-299.4] -> master shield -> ヤンバル@cpu_front_right [-63.4] -> end turn [-393.4]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 4/2 / hand player/cpu 6/5
     - metrics: HP 10/10, stones 4/2, boardValue 630/600, ready 4/0, shield 0/1, Lv2+ 1/0
     - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 shield | player_front_left:PF:ドノマンティス Lv1 HP3 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ピグミィ Lv1 HP1 act0/2

#### Top terminal plans

1. terminal 115 (+308) / response -117 (-232) / guide 3048.5
   - actions: focus ヤンバル [570.2] -> move ピグミィ player_front_right->player_back_right [482.1] -> summon 真勇者ダイン -> player_front_right [555.7] -> master wake_up -> 真勇者ダイン@player_front_right [670.7] -> 真勇者ダイン ダイン斬り -> デスシープ [709.8] -> end turn [59.9]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 0/8, boardValue 570/450, ready 2/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal -117 (-232) / truncated
     - actions: summon ピグミィ -> cpu_back_right [242.4] -> デスシープ attack -> ドノマンティス [313.5] -> ヤンバル wild_claw -> ドノマンティス [521.2] -> master wake_up -> ピグミィ@cpu_back_right [698.7] -> ピグミィ スパイクボール -> ドノマンティス [608.4] -> focus ピグミィ [-40.4] -> end turn [-132.5]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 4/4 / hand player/cpu 6/5
     - metrics: HP 10/10, stones 4/4, boardValue 420/680, ready 3/1, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
2. terminal 103 (+296) / response -114 (-217) / guide 3301.1 / truncated
   - actions: focus ヤンバル [570.2] -> focus ドノマンティス [581.4] -> move ピグミィ player_front_right->player_back_right [451.8] -> summon 真勇者ダイン -> player_front_right [514.6] -> master wake_up -> 真勇者ダイン@player_front_right [620.7] -> 真勇者ダイン ダイン斬り -> デスシープ [624.3] -> end turn [-61.9]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 0/8, boardValue 570/450, ready 1/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal -114 (-217) / truncated
     - actions: summon ピグミィ -> cpu_back_right [231.6] -> ボムゾウ storm_bomb -> ドノマンティス [383.6] -> ヤンバル wild_claw -> ドノマンティス [485.2] -> master master_attack -> ドノマンティス@player_front_left [411.8] -> master wake_up -> ピグミィ@cpu_back_right [709.1] -> ピグミィ スパイクボール -> ドノマンティス [659.2] -> end turn [-157]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 4/1 / hand player/cpu 6/5
     - metrics: HP 10/10, stones 4/1, boardValue 420/680, ready 3/2, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
3. terminal 103 (+296) / response -114 (-217) / guide 3291.2 / truncated
   - actions: focus ヤンバル [570.2] -> move ピグミィ player_front_right->player_back_right [482.1] -> focus ドノマンティス [541.2] -> summon 真勇者ダイン -> player_front_right [514.6] -> master wake_up -> 真勇者ダイン@player_front_right [620.7] -> 真勇者ダイン ダイン斬り -> デスシープ [624.3] -> end turn [-61.9]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 0/8, boardValue 570/450, ready 1/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal -114 (-217) / truncated
     - actions: summon ピグミィ -> cpu_back_right [231.6] -> ボムゾウ storm_bomb -> ドノマンティス [383.6] -> ヤンバル wild_claw -> ドノマンティス [485.2] -> master master_attack -> ドノマンティス@player_front_left [411.8] -> master wake_up -> ピグミィ@cpu_back_right [709.1] -> ピグミィ スパイクボール -> ドノマンティス [659.2] -> end turn [-157]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 4/1 / hand player/cpu 6/5
     - metrics: HP 10/10, stones 4/1, boardValue 420/680, ready 3/2, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus

#### Top response-adjusted plans

1. terminal 79.8 (+272.8) / response 162 (+82.2) / guide 1420
   - actions: ヤンバル wild_claw -> デスシープ [586.1] -> focus ドノマンティス [349.6] -> ピグミィ スパイクボール -> デスシープ [206.3] -> move ピグミィ player_front_right->player_back_right [172.7] -> summon 真勇者ダイン -> player_front_right [150.8] -> end turn [-45.5]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 1/8 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 1/8, boardValue 670/450, ready 0/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 prep | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2
   - opponent response: terminal 162 (+82.2) / truncated
     - actions: focus デスシープ [234.7] -> summon ポリスピナー -> cpu_back_right [80] -> ヤンバル wild_claw -> ピグミィ [44.4] -> ボムゾウ storm_bomb -> ドノマンティス [-180.1] -> master master_attack -> ドノマンティス@player_front_left [-299.4] -> master shield -> ヤンバル@cpu_front_right [-63.4] -> end turn [-393.4]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 4/2 / hand player/cpu 6/5
     - metrics: HP 10/10, stones 4/2, boardValue 630/600, ready 4/0, shield 0/1, Lv2+ 1/0
     - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 shield | player_front_left:PF:ドノマンティス Lv1 HP3 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ピグミィ Lv1 HP1 act0/2
2. terminal 91.8 (+284.8) / response 141.6 (+49.8) / guide 1402.3
   - actions: ヤンバル wild_claw -> デスシープ [586.1] -> ピグミィ スパイクボール -> デスシープ [291.6] -> move ピグミィ player_front_right->player_back_right [231.5] -> summon 真勇者ダイン -> player_front_right [256] -> end turn [37.1]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 1/8 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 1/8, boardValue 670/450, ready 1/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 prep | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv1 HP3 act2/2
   - opponent response: terminal 141.6 (+49.8) / truncated
     - actions: focus デスシープ [258.7] -> summon ピグミィ -> cpu_back_right [90] -> ヤンバル wild_claw -> ピグミィ [44.4] -> ボムゾウ storm_bomb -> ドノマンティス [-184.2] -> master master_attack -> ドノマンティス@player_front_left [-272.6] -> master shield -> ヤンバル@cpu_front_right [-25.8] -> end turn [-346.8]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 4/2 / hand player/cpu 6/5
     - metrics: HP 10/10, stones 4/2, boardValue 630/600, ready 4/0, shield 0/1, Lv2+ 1/0
     - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 shield | player_front_left:PF:ドノマンティス Lv1 HP3 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ピグミィ Lv1 HP1 act0/2
3. terminal 103 (+296) / response 54 (-49) / guide 3248 / truncated
   - actions: focus ヤンバル [570.2] -> move ピグミィ player_front_right->player_back_right [482.1] -> summon 真勇者ダイン -> player_front_right [555.7] -> master wake_up -> 真勇者ダイン@player_front_right [670.7] -> 真勇者ダイン ダイン斬り -> デスシープ [709.8] -> ピグミィ スパイクボール -> デスシープ [232.3] -> end turn [27.2]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 0/8, boardValue 570/450, ready 1/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act0/1 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act2/2
   - opponent response: terminal 54 (-49) / truncated
     - actions: focus デスシープ [327.7] -> summon ピグミィ -> cpu_back_right [175.4] -> ボムゾウ storm_bomb -> ドノマンティス [37.6] -> ヤンバル wild_claw -> ドノマンティス [246.8] -> master master_attack -> ドノマンティス@player_front_left [422] -> master wake_up -> ピグミィ@cpu_back_right [690.3] -> end turn [-353.9]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/2 / hand player/cpu 6/5
     - metrics: HP 10/10, stones 3/2, boardValue 530/580, ready 4/1, shield 0/0, Lv2+ 0/0
     - board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ドノマンティス Lv1 HP1 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2

### 2. seed 962001 turn 5 player

- step: 44
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 5/0 / hand player/cpu 4/3
- initialScore: -82.8
- selectedTerminalRank: 61
- selectedResponseRank: 9
- terminalGapToBest: 255
- responseGapToBest: 89
- board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 prep | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:デスシープ Lv1 HP4 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus

#### Selected plan

1. terminal -153.6 (-70.8) / response -237 (-83.4) / guide -745.3
   - actions: focus ポリスピナー [333.8] -> focus デスシープ [-46] -> summon ピグミィ -> player_back_right [-80.3] -> move デスシープ player_back_left->player_front_right [-428.6] -> master shield -> デスシープ@player_front_left [-178.6] -> end turn [-345.5]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 2/3 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 2/3, boardValue 580/680, ready 0/4, shield 1/0, Lv2+ 0/1
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | player_front_left:PF:デスシープ Lv1 HP4 act1/1 shield,focus | player_front_right:PF:デスシープ Lv1 HP6 act1/1 | player_back_left:PB:ポリスピナー Lv1 HP3 act2/2 | player_back_right:PB:ピグミィ Lv1 HP3 prep
   - opponent response: terminal -237 (-83.4)
     - actions: デスシープ attack -> デスシープ [315.1] -> ヤンバル wild_claw -> デスシープ [514.3] -> ヤンバル wild_claw -> デスシープ [659.2] -> 真勇者ダイン ダイン斬り -> デスシープ [10.5] -> master shield -> デスシープ@cpu_front_right [-93.8] -> end turn [-172.4]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 6/0 / hand player/cpu 4/4
     - metrics: HP 10/10, stones 6/0, boardValue 400/800, ready 3/0, shield 0/1, Lv2+ 0/2
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 shield | player_front_left:PF:デスシープ Lv1 HP4 act0/1 | player_front_right:PF:ピグミィ Lv1 HP3 act0/2 | player_back_left:PB:ポリスピナー Lv1 HP3 act0/2

#### Top terminal plans

1. terminal 101.4 (+184.2) / response -153 (-254.4) / guide 849
   - actions: summon ピグミィ -> player_back_right [108.3] -> focus デスシープ [-76.8] -> ポリスピナー attack -> デスシープ [32.9] -> master master_attack -> デスシープ@cpu_front_right [362.7] -> ポリスピナー attack -> デスシープ [678.7] -> end turn [-256.6]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/5 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 0/5, boardValue 660/420, ready 1/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP4 act1/1 focus | player_front_right:PF:ポリスピナー Lv2 HP3 act2/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep
   - opponent response: terminal -153 (-254.4) / truncated
     - actions: ヤンバル wild_claw -> ポリスピナー [478.8] -> summon ピグミィ -> cpu_back_right [587.9] -> master wake_up -> ピグミィ@cpu_back_right [811.6] -> ピグミィ スパイクボール -> ポリスピナー [1192.1] -> ピグミィ スパイクボール -> デスシープ [401.8] -> 真勇者ダイン ダイン斬り -> デスシープ [532.6] -> end turn [-222.9]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 5/1 / hand player/cpu 4/3
     - metrics: HP 10/10, stones 5/1, boardValue 410/650, ready 3/1, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | player_front_left:PF:デスシープ Lv1 HP2 act0/1 | player_front_right:PF:ピグミィ Lv1 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus
2. terminal 101.4 (+184.2) / response -153 (-254.4) / guide 898.2
   - actions: summon ピグミィ -> player_back_right [108.3] -> focus デスシープ [-76.8] -> master master_attack -> デスシープ@cpu_front_right [-76.1] -> ポリスピナー attack -> デスシープ [520.8] -> ポリスピナー attack -> デスシープ [678.7] -> end turn [-256.6]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/5 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 0/5, boardValue 660/420, ready 1/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP4 act1/1 focus | player_front_right:PF:ポリスピナー Lv2 HP3 act2/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep
   - opponent response: terminal -153 (-254.4) / truncated
     - actions: ヤンバル wild_claw -> ポリスピナー [478.8] -> summon ピグミィ -> cpu_back_right [587.9] -> master wake_up -> ピグミィ@cpu_back_right [811.6] -> ピグミィ スパイクボール -> ポリスピナー [1192.1] -> ピグミィ スパイクボール -> デスシープ [401.8] -> 真勇者ダイン ダイン斬り -> デスシープ [532.6] -> end turn [-222.9]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 5/1 / hand player/cpu 4/3
     - metrics: HP 10/10, stones 5/1, boardValue 410/650, ready 3/1, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | player_front_left:PF:デスシープ Lv1 HP2 act0/1 | player_front_right:PF:ピグミィ Lv1 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus
3. terminal 63.4 (+146.2) / response -153 (-216.4) / guide 566.4
   - actions: summon ピグミィ -> player_back_right [108.3] -> focus デスシープ [-76.8] -> ポリスピナー attack -> デスシープ [32.9] -> ポリスピナー attack -> デスシープ [248.3] -> master master_attack -> デスシープ@cpu_front_right [542.6] -> end turn [-288.8]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 1/5 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 1/5, boardValue 560/420, ready 1/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP4 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act2/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep
   - opponent response: terminal -153 (-216.4) / truncated
     - actions: ヤンバル wild_claw -> ポリスピナー [434.1] -> summon ピグミィ -> cpu_back_right [549.1] -> master wake_up -> ピグミィ@cpu_back_right [743.2] -> ピグミィ スパイクボール -> ポリスピナー [789.1] -> ピグミィ スパイクボール -> デスシープ [401.8] -> 真勇者ダイン ダイン斬り -> デスシープ [532.6] -> end turn [-222.9]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 5/1 / hand player/cpu 4/3
     - metrics: HP 10/10, stones 5/1, boardValue 410/650, ready 3/1, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 focus | player_front_left:PF:デスシープ Lv1 HP2 act0/1 | player_front_right:PF:ピグミィ Lv1 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus

#### Top response-adjusted plans

1. terminal -40.6 (+42.2) / response -148 (-107.4) / guide -1163.6 / truncated
   - actions: focus ポリスピナー [333.8] -> summon ピグミィ -> player_back_right [-62.3] -> ポリスピナー attack -> cpu master [-336.7] -> focus デスシープ [-79.8] -> master shield -> デスシープ@player_front_left [-257.6] -> master shield -> ポリスピナー@player_front_right [-370.5] -> end turn [-390.5]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 0/4 / hand player/cpu 3/4
   - metrics: HP 10/9, stones 0/4, boardValue 600/680, ready 1/4, shield 2/0, Lv2+ 0/1
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | player_front_left:PF:デスシープ Lv1 HP4 act1/1 shield,focus | player_front_right:PF:ポリスピナー Lv1 HP3 act2/2 shield | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep
   - opponent response: terminal -148 (-107.4)
     - actions: デスシープ attack -> ポリスピナー [126.2] -> ヤンバル wild_claw -> ポリスピナー [745.4] -> ヤンバル wild_claw -> デスシープ [159] -> focus 真勇者ダイン [161.9] -> master shield -> デスシープ@cpu_front_right [-51] -> end turn [-138.6]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 4/1 / hand player/cpu 4/4
     - metrics: HP 10/9, stones 4/1, boardValue 430/800, ready 3/0, shield 0/1, Lv2+ 0/2
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 shield | player_front_left:PF:デスシープ Lv1 HP4 act0/1 | player_front_right:PF:ピグミィ Lv1 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus
2. terminal -40.6 (+42.2) / response -148 (-107.4) / guide -1096.6 / truncated
   - actions: focus ポリスピナー [333.8] -> summon ピグミィ -> player_back_right [-62.3] -> ポリスピナー attack -> cpu master [-336.7] -> focus デスシープ [-79.8] -> master shield -> ポリスピナー@player_front_right [-64.6] -> master shield -> デスシープ@player_front_left [-496.5] -> end turn [-390.5]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 0/4 / hand player/cpu 3/4
   - metrics: HP 10/9, stones 0/4, boardValue 600/680, ready 1/4, shield 2/0, Lv2+ 0/1
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | player_front_left:PF:デスシープ Lv1 HP4 act1/1 shield,focus | player_front_right:PF:ポリスピナー Lv1 HP3 act2/2 shield | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep
   - opponent response: terminal -148 (-107.4)
     - actions: デスシープ attack -> ポリスピナー [126.2] -> ヤンバル wild_claw -> ポリスピナー [745.4] -> ヤンバル wild_claw -> デスシープ [159] -> focus 真勇者ダイン [161.9] -> master shield -> デスシープ@cpu_front_right [-51] -> end turn [-138.6]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 4/1 / hand player/cpu 4/4
     - metrics: HP 10/9, stones 4/1, boardValue 430/800, ready 3/0, shield 0/1, Lv2+ 0/2
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 shield | player_front_left:PF:デスシープ Lv1 HP4 act0/1 | player_front_right:PF:ピグミィ Lv1 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus
3. terminal -40.6 (+42.2) / response -148 (-107.4) / guide -1205.5 / truncated
   - actions: summon ピグミィ -> player_back_right [108.3] -> focus ポリスピナー [121.3] -> ポリスピナー attack -> cpu master [-336.7] -> focus デスシープ [-79.8] -> master shield -> デスシープ@player_front_left [-257.6] -> master shield -> ポリスピナー@player_front_right [-370.5] -> end turn [-390.5]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 0/4 / hand player/cpu 3/4
   - metrics: HP 10/9, stones 0/4, boardValue 600/680, ready 1/4, shield 2/0, Lv2+ 0/1
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act0/1 | player_front_left:PF:デスシープ Lv1 HP4 act1/1 shield,focus | player_front_right:PF:ポリスピナー Lv1 HP3 act2/2 shield | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep
   - opponent response: terminal -148 (-107.4)
     - actions: デスシープ attack -> ポリスピナー [126.2] -> ヤンバル wild_claw -> ポリスピナー [745.4] -> ヤンバル wild_claw -> デスシープ [159] -> focus 真勇者ダイン [161.9] -> master shield -> デスシープ@cpu_front_right [-51] -> end turn [-138.6]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 4/1 / hand player/cpu 4/4
     - metrics: HP 10/9, stones 4/1, boardValue 430/800, ready 3/0, shield 0/1, Lv2+ 0/2
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 shield | player_front_left:PF:デスシープ Lv1 HP4 act0/1 | player_front_right:PF:ピグミィ Lv1 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus

