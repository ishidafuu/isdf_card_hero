# White AI Terminal Plan Audit

生成: 2026-07-01T08:26:14.863Z
デッキ: `master-lab-white-1377-death-sheep3` vs `master-lab-white-1377-death-sheep3`
seedStart: 960000, maxSeeds: 6
search: depth 3, width 3, detailed 3
terminalPlan: depth 5, width 2, weight 1.5
opponentTerminalPlan: depth 2, width 2, weight 0.5
beamWidth: 2, maxActions: 6, responseRankLimit: 8

## Summary

- selected top1: 0/2
- selected average rank: 17
- average gap to best: 15.5
- max gap to best: 21
- selected response top1: 0/2
- selected average response rank: 7
- average response gap to best: 79.9
- max response gap to best: 122.8

## Method

- 実戦途中の白同士局面から、現行AI評価の上位候補を幅 `beamWidth` で拾い、各手順をエンドターンまで進めた。
- `terminal` は、相手ターン開始後の盤面を白AI重みの `evaluateState` で評価した値。`guide` は現行AIの局所評価合計で、terminalとは別物。
- `opponent response` は、渡した盤面から相手AIが同じ軽量設定でエンドターンまで進めた後の盤面評価。勝率ではなく「渡した盤面が相手にどう返されるか」を見るための補助線。
- `response rank` は、終端評価上位 `responseRankLimit` 本と実選択手順を対象に、相手応答後の盤面評価で並べた順位。
- この監査は勝率ではなく、現行AIの選択手順と「相手へ渡す最終盤面」「相手から返る最終盤面」のズレを見るためのもの。

## Conclusion

- 現行AIの選択手順が終端盤面1位だった局面は 0/2。
- 平均ギャップは 15.5 点。80点以上のズレは 0/2。
- 相手応答後1位だった局面は 0/2。応答後平均ギャップは 79.9 点。80点以上のズレは 1/2。
- 現行選択はシールド 1/2、フォーカス 2/2 を含む。終端1位はシールド 0/2、フォーカス 1/2。応答後1位はシールド 1/2、フォーカス 2/2。
- このサンプルでは現行AIの手順選択と終端盤面評価のズレは限定的。次はサンプル局面を増やすか、対黒局面でも同じ監査を行う。

## Scenarios

### 1. seed 960000 turn 5 player

- step: 47
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 5/1 / hand player/cpu 4/3
- initialScore: -88
- selectedTerminalRank: 19
- selectedResponseRank: 7
- terminalGapToBest: 10
- responseGapToBest: 122.8
- board: cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_right:PB:ドノマンティス Lv2 HP5 act0/1

#### Selected plan

1. terminal -39.6 (+48.4) / response -172.4 (-132.8) / guide 551.7
   - actions: focus ドノマンティス [298.3] -> move ドノマンティス player_back_right->player_front_left [239.4] -> summon ピグミィ -> player_back_left [169] -> master shield -> ドノマンティス@player_front_left [-47.5] -> end turn [-107.5]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 2/4 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 2/4, boardValue 550/510, ready 0/3, shield 1/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 prep
   - opponent response: terminal -172.4 (-132.8) / truncated
     - actions: ピグミィ スパイクボール -> ドノマンティス [632.8] -> ヤンバル wild_claw -> ドノマンティス [556.3] -> ドノマンティス attack -> ドノマンティス [642.6] -> summon ヤンバル -> cpu_back_left [80.5] -> focus ピグミィ [-119.5] -> master shield -> ピグミィ@cpu_front_left [-157.6] -> end turn [-316.4]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 6/0 / hand player/cpu 4/3
     - metrics: HP 10/10, stones 6/0, boardValue 380/760, ready 2/0, shield 0/1, Lv2+ 1/2
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act2/2 shield,focus | cpu_front_right:CF:ドノマンティス Lv2 HP5 act1/1 | player_front_left:PF:ドノマンティス Lv2 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2

#### Top terminal plans

1. terminal -29.6 (+58.4) / response -157.6 (-128) / guide 522.1
   - actions: move ドノマンティス player_back_right->player_front_left [288.7] -> summon ピグミィ -> player_back_left [249.6] -> end turn [-16.1]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 4/4 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 4/4, boardValue 530/510, ready 1/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 prep
   - opponent response: terminal -157.6 (-128)
     - actions: ピグミィ スパイクボール -> ドノマンティス [515.7] -> ヤンバル wild_claw -> ドノマンティス [620.7] -> ドノマンティス attack -> ドノマンティス [718] -> move ピグミィ cpu_front_left->cpu_back_left [61.1] -> summon ヤンバル -> cpu_front_left [-43.5] -> end turn [-309.6]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 8/2 / hand player/cpu 4/3
     - metrics: HP 10/10, stones 8/2, boardValue 380/740, ready 2/0, shield 0/0, Lv2+ 1/2
     - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ヤンバル Lv1 HP3 prep | cpu_front_right:CF:ドノマンティス Lv2 HP5 act1/1 | player_front_left:PF:ドノマンティス Lv2 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2
2. terminal -31.6 (+56.4) / response -67.6 (-36) / guide -64.4
   - actions: move ドノマンティス player_back_right->player_front_left [288.7] -> summon ピグミィ -> player_back_left [249.6] -> ドノマンティス attack -> ドノマンティス [4] -> master shield -> ドノマンティス@player_front_left [-42.4] -> master shield -> ドノマンティス@player_front_right [-431.2] -> end turn [-133.1]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/4 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 0/4, boardValue 570/500, ready 0/3, shield 2/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP4 act0/1 | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 shield | player_back_left:PB:ピグミィ Lv1 HP3 prep
   - opponent response: terminal -67.6 (-36) / truncated
     - actions: focus ドノマンティス [257.9] -> move ピグミィ cpu_front_left->cpu_back_left [72] -> focus ヤンバル [30] -> summon ヤンバル -> cpu_front_left [-11.9] -> focus ピグミィ [-157.6] -> master shield -> ドノマンティス@cpu_front_right [-205.8] -> end turn [-430.2]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/1 / hand player/cpu 4/3
     - metrics: HP 10/10, stones 3/1, boardValue 530/650, ready 3/0, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 prep | cpu_front_right:CF:ドノマンティス Lv1 HP4 act1/1 shield,focus | player_front_left:PF:ドノマンティス Lv2 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2
3. terminal -31.6 (+56.4) / response -67.6 (-36) / guide 120.1
   - actions: move ドノマンティス player_back_right->player_front_left [288.7] -> summon ピグミィ -> player_back_left [249.6] -> ドノマンティス attack -> ドノマンティス [4] -> master shield -> ドノマンティス@player_front_right [-45.7] -> master shield -> ドノマンティス@player_front_left [-243.5] -> end turn [-133.1]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/4 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 0/4, boardValue 570/500, ready 0/3, shield 2/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP4 act0/1 | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 shield | player_back_left:PB:ピグミィ Lv1 HP3 prep
   - opponent response: terminal -67.6 (-36) / truncated
     - actions: focus ドノマンティス [257.9] -> move ピグミィ cpu_front_left->cpu_back_left [72] -> focus ヤンバル [30] -> summon ヤンバル -> cpu_front_left [-11.9] -> focus ピグミィ [-157.6] -> master shield -> ドノマンティス@cpu_front_right [-205.8] -> end turn [-430.2]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/1 / hand player/cpu 4/3
     - metrics: HP 10/10, stones 3/1, boardValue 530/650, ready 3/0, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 prep | cpu_front_right:CF:ドノマンティス Lv1 HP4 act1/1 shield,focus | player_front_left:PF:ドノマンティス Lv2 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2

#### Top response-adjusted plans

1. terminal -37.6 (+50.4) / response -49.6 (-12) / guide 42.3
   - actions: focus ドノマンティス [298.3] -> move ドノマンティス player_back_right->player_front_left [239.4] -> summon ピグミィ -> player_back_left [169] -> master shield -> ドノマンティス@player_front_left [-47.5] -> master shield -> ドノマンティス@player_front_right [-458.8] -> end turn [-158.1]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/4 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 0/4, boardValue 570/510, ready 0/3, shield 2/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 shield,focus | player_back_left:PB:ピグミィ Lv1 HP3 prep
   - opponent response: terminal -49.6 (-12) / truncated
     - actions: ヤンバル wild_claw -> ドノマンティス [106.4] -> move ピグミィ cpu_front_left->cpu_back_left [13.5] -> summon ヤンバル -> cpu_front_left [-58.7] -> focus ピグミィ [-290.7] -> ドノマンティス attack -> ドノマンティス [-322.1] -> master shield -> ドノマンティス@cpu_front_right [-215] -> end turn [-429.3]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/1 / hand player/cpu 4/3
     - metrics: HP 10/10, stones 3/1, boardValue 510/660, ready 3/0, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ヤンバル Lv1 HP3 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | player_front_left:PF:ドノマンティス Lv2 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP3 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2
2. terminal -37.6 (+50.4) / response -49.6 (-12) / guide 222.3
   - actions: focus ドノマンティス [298.3] -> move ドノマンティス player_back_right->player_front_left [239.4] -> summon ピグミィ -> player_back_left [169] -> master shield -> ドノマンティス@player_front_right [-52] -> master shield -> ドノマンティス@player_front_left [-274.3] -> end turn [-158.1]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/4 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 0/4, boardValue 570/510, ready 0/3, shield 2/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 shield,focus | player_back_left:PB:ピグミィ Lv1 HP3 prep
   - opponent response: terminal -49.6 (-12) / truncated
     - actions: ヤンバル wild_claw -> ドノマンティス [106.4] -> move ピグミィ cpu_front_left->cpu_back_left [13.5] -> summon ヤンバル -> cpu_front_left [-58.7] -> focus ピグミィ [-290.7] -> ドノマンティス attack -> ドノマンティス [-322.1] -> master shield -> ドノマンティス@cpu_front_right [-215] -> end turn [-429.3]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/1 / hand player/cpu 4/3
     - metrics: HP 10/10, stones 3/1, boardValue 510/660, ready 3/0, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ヤンバル Lv1 HP3 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 shield | player_front_left:PF:ドノマンティス Lv2 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP3 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2
3. terminal -33.6 (+54.4) / response -57.6 (-24) / guide 407.6
   - actions: move ドノマンティス player_back_right->player_front_left [288.7] -> summon ピグミィ -> player_back_left [249.6] -> ドノマンティス attack -> ドノマンティス [4] -> master shield -> ドノマンティス@player_front_left [-42.4] -> end turn [-92.3]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 2/4 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 2/4, boardValue 550/500, ready 0/3, shield 1/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP4 act0/1 | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 prep
   - opponent response: terminal -57.6 (-24) / truncated
     - actions: focus ドノマンティス [240.4] -> move ピグミィ cpu_front_left->cpu_back_left [143] -> focus ヤンバル [30] -> summon ヤンバル -> cpu_front_left [-31] -> focus ピグミィ [-175.6] -> master shield -> ドノマンティス@cpu_front_right [-240.6] -> end turn [-358.1]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 5/1 / hand player/cpu 4/3
     - metrics: HP 10/10, stones 5/1, boardValue 530/650, ready 3/0, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 prep | cpu_front_right:CF:ドノマンティス Lv1 HP4 act1/1 shield,focus | player_front_left:PF:ドノマンティス Lv2 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2

### 2. seed 960001 turn 5 player

- step: 46
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 4/4 / hand player/cpu 4/4
- initialScore: 24
- selectedTerminalRank: 15
- selectedResponseRank: 7
- terminalGapToBest: 21
- responseGapToBest: 37
- board: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ボムゾウ Lv1 HP4 act1/1 focus | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus

#### Selected plan

1. terminal 133 (+109) / response 119.6 (-13.4) / guide 2034.5 / truncated
   - actions: focus デスシープ [360.9] -> ピグミィ スパイクボール -> ボムゾウ [322.1] -> ドノマンティス attack -> ボムゾウ [389.9] -> ピグミィ スパイクボール -> ボムゾウ [415.7] -> ピグミィ スパイクボール -> ボムゾウ [548.8] -> ピグミィ スパイクボール -> 真勇者ダイン [96.5] -> end turn [-99.4]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 3/8 / hand player/cpu 4/5
   - metrics: HP 10/10, stones 3/8, boardValue 670/420, ready 0/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2
   - opponent response: terminal 119.6 (-13.4) / truncated
     - actions: focus 真勇者ダイン [333.5] -> ヤンバル wild_claw -> ピグミィ [216.7] -> ピグミィ スパイクボール -> デスシープ [191.1] -> summon ヤンバル -> cpu_back_right [161.7] -> focus ピグミィ [-47.5] -> master master_attack -> ドノマンティス@player_front_right [-148] -> end turn [-156.5]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 6/4 / hand player/cpu 5/4
     - metrics: HP 10/10, stones 6/4, boardValue 630/550, ready 4/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP3 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | player_back_right:PB:ピグミィ Lv2 HP1 act0/2

#### Top terminal plans

1. terminal 154 (+130) / response 156.6 (+2.6) / guide 1676.5 / truncated
   - actions: focus デスシープ [360.9] -> ピグミィ スパイクボール -> ボムゾウ [322.1] -> ピグミィ スパイクボール -> 真勇者ダイン [318.5] -> master master_attack -> ボムゾウ@cpu_front_right [346.2] -> ドノマンティス attack -> ボムゾウ [557.8] -> ピグミィ スパイクボール -> 真勇者ダイン [-161] -> end turn [-67.9]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 4/5
   - metrics: HP 10/10, stones 0/8, boardValue 670/410, ready 1/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal 156.6 (+2.6) / truncated
     - actions: focus 真勇者ダイン [335.8] -> summon ヤンバル -> cpu_back_right [188.1] -> ピグミィ スパイクボール -> デスシープ [46.2] -> move ヤンバル cpu_front_right->cpu_back_left [20] -> master master_attack -> デスシープ@player_front_left [-253.9] -> master shield -> 真勇者ダイン@cpu_front_left [-100.9] -> end turn [-352.2]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/2 / hand player/cpu 5/4
     - metrics: HP 10/10, stones 3/2, boardValue 650/560, ready 4/0, shield 0/1, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 shield,focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act2/2 | player_front_left:PF:デスシープ Lv1 HP4 act0/1 | player_front_right:PF:ドノマンティス Lv2 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
2. terminal 154 (+130) / response 156.6 (+2.6) / guide 1676.5 / truncated
   - actions: focus デスシープ [360.9] -> ピグミィ スパイクボール -> ボムゾウ [322.1] -> ピグミィ スパイクボール -> 真勇者ダイン [318.5] -> master master_attack -> ボムゾウ@cpu_front_right [346.2] -> ドノマンティス attack -> ボムゾウ [557.8] -> ピグミィ スパイクボール -> 真勇者ダイン [-161] -> end turn [-67.9]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 4/5
   - metrics: HP 10/10, stones 0/8, boardValue 670/410, ready 1/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 act2/2
   - opponent response: terminal 156.6 (+2.6) / truncated
     - actions: focus 真勇者ダイン [335.8] -> summon ヤンバル -> cpu_back_right [188.1] -> ピグミィ スパイクボール -> デスシープ [46.2] -> move ヤンバル cpu_front_right->cpu_back_left [20] -> master master_attack -> デスシープ@player_front_left [-253.9] -> master shield -> 真勇者ダイン@cpu_front_left [-100.9] -> end turn [-352.2]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/2 / hand player/cpu 5/4
     - metrics: HP 10/10, stones 3/2, boardValue 650/560, ready 4/0, shield 0/1, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 shield,focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act2/2 | player_front_left:PF:デスシープ Lv1 HP4 act0/1 | player_front_right:PF:ドノマンティス Lv2 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2
3. terminal 148 (+124) / response 119.6 (-28.4) / guide 2327.5 / truncated
   - actions: focus デスシープ [360.9] -> ピグミィ スパイクボール -> ボムゾウ [322.1] -> ピグミィ スパイクボール -> 真勇者ダイン [318.5] -> master master_attack -> ボムゾウ@cpu_front_right [346.2] -> ピグミィ スパイクボール -> ボムゾウ [447.8] -> ピグミィ スパイクボール -> ボムゾウ [518.1] -> end turn [14]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 4/5
   - metrics: HP 10/10, stones 0/8, boardValue 670/420, ready 1/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2
   - opponent response: terminal 119.6 (-28.4)
     - actions: focus 真勇者ダイン [343.3] -> ピグミィ スパイクボール -> ドノマンティス [265.9] -> ピグミィ スパイクボール -> デスシープ [220.7] -> ヤンバル wild_claw -> ピグミィ [187.3] -> summon ヤンバル -> cpu_back_right [145.5] -> end turn [-148.6]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/7 / hand player/cpu 5/4
     - metrics: HP 10/10, stones 3/7, boardValue 650/550, ready 4/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | player_back_right:PB:ピグミィ Lv2 HP1 act0/2

#### Top response-adjusted plans

1. terminal 154 (+130) / response 156.6 (+2.6) / guide 1676.5 / truncated
   - actions: focus デスシープ [360.9] -> ピグミィ スパイクボール -> ボムゾウ [322.1] -> ピグミィ スパイクボール -> 真勇者ダイン [318.5] -> master master_attack -> ボムゾウ@cpu_front_right [346.2] -> ドノマンティス attack -> ボムゾウ [557.8] -> ピグミィ スパイクボール -> 真勇者ダイン [-161] -> end turn [-67.9]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 4/5
   - metrics: HP 10/10, stones 0/8, boardValue 670/410, ready 1/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal 156.6 (+2.6) / truncated
     - actions: focus 真勇者ダイン [335.8] -> summon ヤンバル -> cpu_back_right [188.1] -> ピグミィ スパイクボール -> デスシープ [46.2] -> move ヤンバル cpu_front_right->cpu_back_left [20] -> master master_attack -> デスシープ@player_front_left [-253.9] -> master shield -> 真勇者ダイン@cpu_front_left [-100.9] -> end turn [-352.2]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/2 / hand player/cpu 5/4
     - metrics: HP 10/10, stones 3/2, boardValue 650/560, ready 4/0, shield 0/1, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 shield,focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act2/2 | player_front_left:PF:デスシープ Lv1 HP4 act0/1 | player_front_right:PF:ドノマンティス Lv2 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
2. terminal 154 (+130) / response 156.6 (+2.6) / guide 1676.5 / truncated
   - actions: focus デスシープ [360.9] -> ピグミィ スパイクボール -> ボムゾウ [322.1] -> ピグミィ スパイクボール -> 真勇者ダイン [318.5] -> master master_attack -> ボムゾウ@cpu_front_right [346.2] -> ドノマンティス attack -> ボムゾウ [557.8] -> ピグミィ スパイクボール -> 真勇者ダイン [-161] -> end turn [-67.9]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 4/5
   - metrics: HP 10/10, stones 0/8, boardValue 670/410, ready 1/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 act2/2
   - opponent response: terminal 156.6 (+2.6) / truncated
     - actions: focus 真勇者ダイン [335.8] -> summon ヤンバル -> cpu_back_right [188.1] -> ピグミィ スパイクボール -> デスシープ [46.2] -> move ヤンバル cpu_front_right->cpu_back_left [20] -> master master_attack -> デスシープ@player_front_left [-253.9] -> master shield -> 真勇者ダイン@cpu_front_left [-100.9] -> end turn [-352.2]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/2 / hand player/cpu 5/4
     - metrics: HP 10/10, stones 3/2, boardValue 650/560, ready 4/0, shield 0/1, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 shield,focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act2/2 | player_front_left:PF:デスシープ Lv1 HP4 act0/1 | player_front_right:PF:ドノマンティス Lv2 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2
3. terminal 148 (+124) / response 150.6 (+2.6) / guide 1792.5
   - actions: focus デスシープ [360.9] -> ピグミィ スパイクボール -> ボムゾウ [322.1] -> ピグミィ スパイクボール -> 真勇者ダイン [318.5] -> master master_attack -> ボムゾウ@cpu_front_right [346.2] -> ドノマンティス attack -> ボムゾウ [557.8] -> end turn [-112.9]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/8 / hand player/cpu 4/5
   - metrics: HP 10/10, stones 0/8, boardValue 670/420, ready 1/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
   - opponent response: terminal 150.6 (+2.6) / truncated
     - actions: focus 真勇者ダイン [335.8] -> summon ヤンバル -> cpu_back_right [188.1] -> ピグミィ スパイクボール -> デスシープ [46.2] -> move ヤンバル cpu_front_right->cpu_back_left [20] -> master master_attack -> デスシープ@player_front_left [-253.4] -> master shield -> 真勇者ダイン@cpu_front_left [-99.5] -> end turn [-352.2]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 3/2 / hand player/cpu 5/4
     - metrics: HP 10/10, stones 3/2, boardValue 650/570, ready 4/0, shield 0/1, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 shield,focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act2/2 | player_front_left:PF:デスシープ Lv1 HP4 act0/1 | player_front_right:PF:ドノマンティス Lv2 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus

