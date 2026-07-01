# White AI Terminal Plan Audit

生成: 2026-07-01T08:21:44.463Z
デッキ: `master-lab-white-1377-death-sheep3` vs `master-lab-white-1377-death-sheep3`
seedStart: 960000, maxSeeds: 6
search: depth 3, width 3, detailed 3
terminalPlan: depth 5, width 2, weight 1.5
opponentTerminalPlan: depth 1, width 1, weight 0.35
beamWidth: 2, maxActions: 6, responseRankLimit: 8

## Summary

- selected top1: 1/2
- selected average rank: 12
- average gap to best: 5
- max gap to best: 10
- selected response top1: 1/2
- selected average response rank: 5
- average response gap to best: 111.8
- max response gap to best: 223.6

## Method

- 実戦途中の白同士局面から、現行AI評価の上位候補を幅 `beamWidth` で拾い、各手順をエンドターンまで進めた。
- `terminal` は、相手ターン開始後の盤面を白AI重みの `evaluateState` で評価した値。`guide` は現行AIの局所評価合計で、terminalとは別物。
- `opponent response` は、渡した盤面から相手AIが同じ軽量設定でエンドターンまで進めた後の盤面評価。勝率ではなく「渡した盤面が相手にどう返されるか」を見るための補助線。
- `response rank` は、終端評価上位 `responseRankLimit` 本と実選択手順を対象に、相手応答後の盤面評価で並べた順位。
- この監査は勝率ではなく、現行AIの選択手順と「相手へ渡す最終盤面」「相手から返る最終盤面」のズレを見るためのもの。

## Conclusion

- 現行AIの選択手順が終端盤面1位だった局面は 1/2。
- 平均ギャップは 5 点。80点以上のズレは 0/2。
- 相手応答後1位だった局面は 1/2。応答後平均ギャップは 111.8 点。80点以上のズレは 1/2。
- 現行選択はシールド 1/2、フォーカス 2/2 を含む。終端1位はシールド 0/2、フォーカス 1/2。応答後1位はシールド 0/2、フォーカス 1/2。
- このサンプルでは現行AIの手順選択と終端盤面評価のズレは限定的。次はサンプル局面を増やすか、対黒局面でも同じ監査を行う。

## Scenarios

### 1. seed 960000 turn 5 player

- step: 48
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 10/0 / hand player/cpu 4/4
- initialScore: -192
- selectedTerminalRank: 23
- selectedResponseRank: 9
- terminalGapToBest: 10
- responseGapToBest: 223.6
- board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1

#### Selected plan

1. terminal 74.4 (+266.4) / response -134 (-208.4) / guide 1878.4 / truncated
   - actions: magic ローテーション -> player master [402.4] -> focus ドノマンティス [476.2] -> ヤンバル wild_claw -> ピグミィ [431.4] -> ドノマンティス attack -> ピグミィ [425.1] -> summon ピグミィ -> player_back_left [169] -> master shield -> ドノマンティス@player_front_left [23.7] -> end turn [-49.4]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 3/4 / hand player/cpu 2/5
   - metrics: HP 10/10, stones 3/4, boardValue 680/540, ready 0/3, shield 1/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
   - opponent response: terminal -134 (-208.4) / truncated
     - actions: summon ヤンバル -> cpu_back_left [223.2] -> ピグミィ スパイクボール -> ドノマンティス [510.1] -> デスシープ attack -> ドノマンティス [444.9] -> master wake_up -> ヤンバル@cpu_back_left [643] -> ヤンバル wild_claw -> ドノマンティス [627.8] -> move ドノマンティス cpu_back_right->cpu_front_left [30.1] -> end turn [-188.4]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 7/0 / hand player/cpu 3/4
     - metrics: HP 10/10, stones 7/0, boardValue 510/770, ready 3/0, shield 0/0, Lv2+ 1/2
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 | player_front_left:PF:ドノマンティス Lv2 HP5 act0/1 | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2

#### Top terminal plans

1. terminal 84.4 (+276.4) / response -124 (-208.4) / guide 1659.8
   - actions: magic ローテーション -> player master [402.4] -> ヤンバル wild_claw -> ピグミィ [466.8] -> ドノマンティス attack -> ピグミィ [486.7] -> summon ピグミィ -> player_back_left [253.5] -> end turn [50.5]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/4 / hand player/cpu 2/5
   - metrics: HP 10/10, stones 5/4, boardValue 660/540, ready 1/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
   - opponent response: terminal -124 (-208.4) / truncated
     - actions: summon ヤンバル -> cpu_back_left [227.8] -> ピグミィ スパイクボール -> ドノマンティス [518.8] -> デスシープ attack -> ドノマンティス [459.9] -> master wake_up -> ヤンバル@cpu_back_left [664.1] -> ヤンバル wild_claw -> ドノマンティス [648.3] -> move ドノマンティス cpu_back_right->cpu_front_left [12.1] -> end turn [-221.1]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 9/0 / hand player/cpu 3/4
     - metrics: HP 10/10, stones 9/0, boardValue 510/770, ready 3/0, shield 0/0, Lv2+ 1/2
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 | player_front_left:PF:ドノマンティス Lv2 HP5 act0/1 | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2
2. terminal 78.4 (+270.4) / response 89.6 (+11.2) / guide 1525.8
   - actions: magic ローテーション -> player master [402.4] -> ヤンバル wild_claw -> ピグミィ [466.8] -> ドノマンティス attack -> ピグミィ [486.7] -> summon ピグミィ -> player_back_left [253.5] -> ドノマンティス attack -> デスシープ [-29.5] -> end turn [-54.1]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/4 / hand player/cpu 2/5
   - metrics: HP 10/10, stones 5/4, boardValue 660/530, ready 0/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
   - opponent response: terminal 89.6 (+11.2)
     - actions: focus デスシープ [269.4] -> move ドノマンティス cpu_back_right->cpu_front_left [192.5] -> summon ヤンバル -> cpu_back_left [104.1] -> master shield -> ドノマンティス@cpu_front_left [-102.5] -> end turn [-319.2]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 8/1 / hand player/cpu 3/4
     - metrics: HP 10/10, stones 8/1, boardValue 660/680, ready 4/0, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 focus | player_front_left:PF:ドノマンティス Lv2 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1
3. terminal 75.4 (+267.4) / response 86.6 (+11.2) / guide 1345.5 / truncated
   - actions: magic ローテーション -> player master [402.4] -> ヤンバル wild_claw -> ピグミィ [466.8] -> ドノマンティス attack -> ピグミィ [486.7] -> summon ピグミィ -> player_back_left [253.5] -> ドノマンティス attack -> デスシープ [-29.5] -> master master_attack -> デスシープ@cpu_front_right [-180.3] -> end turn [-54.1]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 2/4 / hand player/cpu 2/5
   - metrics: HP 10/10, stones 2/4, boardValue 660/510, ready 0/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv1 HP3 act0/1 | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
   - opponent response: terminal 86.6 (+11.2)
     - actions: focus デスシープ [264.4] -> move ドノマンティス cpu_back_right->cpu_front_left [194.6] -> summon ヤンバル -> cpu_back_left [69.1] -> master shield -> デスシープ@cpu_front_right [-176.7] -> end turn [-340.2]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 5/1 / hand player/cpu 3/4
     - metrics: HP 10/10, stones 5/1, boardValue 660/660, ready 4/0, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP3 act1/1 shield,focus | player_front_left:PF:ドノマンティス Lv2 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1

#### Top response-adjusted plans

1. terminal 78.4 (+270.4) / response 89.6 (+11.2) / guide 1525.8
   - actions: magic ローテーション -> player master [402.4] -> ヤンバル wild_claw -> ピグミィ [466.8] -> ドノマンティス attack -> ピグミィ [486.7] -> summon ピグミィ -> player_back_left [253.5] -> ドノマンティス attack -> デスシープ [-29.5] -> end turn [-54.1]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/4 / hand player/cpu 2/5
   - metrics: HP 10/10, stones 5/4, boardValue 660/530, ready 0/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
   - opponent response: terminal 89.6 (+11.2)
     - actions: focus デスシープ [269.4] -> move ドノマンティス cpu_back_right->cpu_front_left [192.5] -> summon ヤンバル -> cpu_back_left [104.1] -> master shield -> ドノマンティス@cpu_front_left [-102.5] -> end turn [-319.2]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 8/1 / hand player/cpu 3/4
     - metrics: HP 10/10, stones 8/1, boardValue 660/680, ready 4/0, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 shield | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 focus | player_front_left:PF:ドノマンティス Lv2 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1
2. terminal 75.4 (+267.4) / response 86.6 (+11.2) / guide 1345.5 / truncated
   - actions: magic ローテーション -> player master [402.4] -> ヤンバル wild_claw -> ピグミィ [466.8] -> ドノマンティス attack -> ピグミィ [486.7] -> summon ピグミィ -> player_back_left [253.5] -> ドノマンティス attack -> デスシープ [-29.5] -> master master_attack -> デスシープ@cpu_front_right [-180.3] -> end turn [-54.1]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 2/4 / hand player/cpu 2/5
   - metrics: HP 10/10, stones 2/4, boardValue 660/510, ready 0/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv1 HP3 act0/1 | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
   - opponent response: terminal 86.6 (+11.2)
     - actions: focus デスシープ [264.4] -> move ドノマンティス cpu_back_right->cpu_front_left [194.6] -> summon ヤンバル -> cpu_back_left [69.1] -> master shield -> デスシープ@cpu_front_right [-176.7] -> end turn [-340.2]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 5/1 / hand player/cpu 3/4
     - metrics: HP 10/10, stones 5/1, boardValue 660/660, ready 4/0, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP3 act1/1 shield,focus | player_front_left:PF:ドノマンティス Lv2 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1
3. terminal 84.4 (+276.4) / response -124 (-208.4) / guide 1659.8
   - actions: magic ローテーション -> player master [402.4] -> ヤンバル wild_claw -> ピグミィ [466.8] -> ドノマンティス attack -> ピグミィ [486.7] -> summon ピグミィ -> player_back_left [253.5] -> end turn [50.5]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/4 / hand player/cpu 2/5
   - metrics: HP 10/10, stones 5/4, boardValue 660/540, ready 1/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 focus | player_front_left:PF:ドノマンティス Lv2 HP5 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
   - opponent response: terminal -124 (-208.4) / truncated
     - actions: summon ヤンバル -> cpu_back_left [227.8] -> ピグミィ スパイクボール -> ドノマンティス [518.8] -> デスシープ attack -> ドノマンティス [459.9] -> master wake_up -> ヤンバル@cpu_back_left [664.1] -> ヤンバル wild_claw -> ドノマンティス [648.3] -> move ドノマンティス cpu_back_right->cpu_front_left [12.1] -> end turn [-221.1]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 9/0 / hand player/cpu 3/4
     - metrics: HP 10/10, stones 9/0, boardValue 510/770, ready 3/0, shield 0/0, Lv2+ 1/2
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 | player_front_left:PF:ドノマンティス Lv2 HP5 act0/1 | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2

### 2. seed 960001 turn 5 player

- step: 48
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 3/2 / hand player/cpu 4/3
- initialScore: 132.6
- selectedTerminalRank: 1
- selectedResponseRank: 1
- terminalGapToBest: 0
- responseGapToBest: 0
- board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 focus | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 shield | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 | player_back_right:PB:ピグミィ Lv2 HP1 act0/2

#### Selected plan

1. terminal 226 (+93.4) / response -127.8 (-353.8) / guide 1366.4 / truncated
   - actions: ピグミィ スパイクボール -> 真勇者ダイン [86.5] -> focus ドノマンティス [29.4] -> デスシープ attack -> 真勇者ダイン [178.8] -> ピグミィ スパイクボール -> 真勇者ダイン [392.8] -> ピグミィ スパイクボール -> 真勇者ダイン [426] -> ピグミィ スパイクボール -> 真勇者ダイン [642.7] -> end turn [-389.8]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 2/6 / hand player/cpu 4/4
   - metrics: HP 10/10, stones 2/6, boardValue 740/390, ready 0/3, shield 0/0, Lv2+ 2/0
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 focus | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ピグミィ Lv2 HP1 act2/2
   - opponent response: terminal -127.8 (-353.8) / truncated
     - actions: ヤンバル wild_claw -> ピグミィ [574.9] -> move ピグミィ cpu_front_left->cpu_back_left [212.4] -> summon 真勇者ダイン -> cpu_front_left [240.3] -> ピグミィ スパイクボール -> ドノマンティス [402.4] -> master master_attack -> ドノマンティス@player_front_right [328.1] -> ヤンバル wild_claw -> ドノマンティス [646.6] -> end turn [-89.1]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 8/0 / hand player/cpu 5/3
     - metrics: HP 10/10, stones 8/0, boardValue 390/750, ready 2/0, shield 0/0, Lv2+ 1/2
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 prep | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2

#### Top terminal plans

1. terminal 226 (+93.4) / response -127.8 (-353.8) / guide 1366.4 / truncated
   - actions: ピグミィ スパイクボール -> 真勇者ダイン [86.5] -> focus ドノマンティス [29.4] -> デスシープ attack -> 真勇者ダイン [178.8] -> ピグミィ スパイクボール -> 真勇者ダイン [392.8] -> ピグミィ スパイクボール -> 真勇者ダイン [426] -> ピグミィ スパイクボール -> 真勇者ダイン [642.7] -> end turn [-389.8]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 2/6 / hand player/cpu 4/4
   - metrics: HP 10/10, stones 2/6, boardValue 740/390, ready 0/3, shield 0/0, Lv2+ 2/0
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 focus | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ピグミィ Lv2 HP1 act2/2
   - opponent response: terminal -127.8 (-353.8) / truncated
     - actions: ヤンバル wild_claw -> ピグミィ [574.9] -> move ピグミィ cpu_front_left->cpu_back_left [212.4] -> summon 真勇者ダイン -> cpu_front_left [240.3] -> ピグミィ スパイクボール -> ドノマンティス [402.4] -> master master_attack -> ドノマンティス@player_front_right [328.1] -> ヤンバル wild_claw -> ドノマンティス [646.6] -> end turn [-89.1]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 8/0 / hand player/cpu 5/3
     - metrics: HP 10/10, stones 8/0, boardValue 390/750, ready 2/0, shield 0/0, Lv2+ 1/2
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 prep | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2
2. terminal 226 (+93.4) / response -127.8 (-353.8) / guide 1372.6 / truncated
   - actions: ピグミィ スパイクボール -> 真勇者ダイン [86.5] -> focus ドノマンティス [29.4] -> デスシープ attack -> 真勇者ダイン [178.8] -> ピグミィ スパイクボール -> 真勇者ダイン [392.3] -> ピグミィ スパイクボール -> 真勇者ダイン [432.7] -> ピグミィ スパイクボール -> 真勇者ダイン [642.7] -> end turn [-389.8]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 2/6 / hand player/cpu 4/4
   - metrics: HP 10/10, stones 2/6, boardValue 740/390, ready 0/3, shield 0/0, Lv2+ 2/0
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 focus | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ピグミィ Lv2 HP1 act2/2
   - opponent response: terminal -127.8 (-353.8) / truncated
     - actions: ヤンバル wild_claw -> ピグミィ [574.9] -> move ピグミィ cpu_front_left->cpu_back_left [212.4] -> summon 真勇者ダイン -> cpu_front_left [240.3] -> ピグミィ スパイクボール -> ドノマンティス [402.4] -> master master_attack -> ドノマンティス@player_front_right [328.1] -> ヤンバル wild_claw -> ドノマンティス [646.6] -> end turn [-89.1]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 8/0 / hand player/cpu 5/3
     - metrics: HP 10/10, stones 8/0, boardValue 390/750, ready 2/0, shield 0/0, Lv2+ 1/2
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 prep | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2
3. terminal 221 (+88.4) / response -162.8 (-383.8) / guide 321.7 / truncated
   - actions: ピグミィ スパイクボール -> 真勇者ダイン [86.5] -> focus ドノマンティス [29.4] -> デスシープ attack -> 真勇者ダイン [178.8] -> ピグミィ スパイクボール -> 真勇者ダイン [392.8] -> focus ピグミィ [32] -> master master_attack -> 真勇者ダイン@cpu_front_left [36.3] -> end turn [-434.1]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/6 / hand player/cpu 4/4
   - metrics: HP 10/10, stones 0/6, boardValue 640/390, ready 1/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 focus | player_back_right:PB:ピグミィ Lv2 HP1 act1/2 focus
   - opponent response: terminal -162.8 (-383.8) / truncated
     - actions: ヤンバル wild_claw -> ピグミィ [594.1] -> move ピグミィ cpu_front_left->cpu_back_left [196.2] -> summon 真勇者ダイン -> cpu_front_left [241.4] -> ピグミィ スパイクボール -> ドノマンティス [434.2] -> master master_attack -> ドノマンティス@player_front_right [353.8] -> ヤンバル wild_claw -> ドノマンティス [591.2] -> end turn [-82]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 6/0 / hand player/cpu 5/3
     - metrics: HP 10/10, stones 6/0, boardValue 290/750, ready 2/0, shield 0/0, Lv2+ 0/2
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 prep | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus

#### Top response-adjusted plans

1. terminal 226 (+93.4) / response -127.8 (-353.8) / guide 1366.4 / truncated
   - actions: ピグミィ スパイクボール -> 真勇者ダイン [86.5] -> focus ドノマンティス [29.4] -> デスシープ attack -> 真勇者ダイン [178.8] -> ピグミィ スパイクボール -> 真勇者ダイン [392.8] -> ピグミィ スパイクボール -> 真勇者ダイン [426] -> ピグミィ スパイクボール -> 真勇者ダイン [642.7] -> end turn [-389.8]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 2/6 / hand player/cpu 4/4
   - metrics: HP 10/10, stones 2/6, boardValue 740/390, ready 0/3, shield 0/0, Lv2+ 2/0
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 focus | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ピグミィ Lv2 HP1 act2/2
   - opponent response: terminal -127.8 (-353.8) / truncated
     - actions: ヤンバル wild_claw -> ピグミィ [574.9] -> move ピグミィ cpu_front_left->cpu_back_left [212.4] -> summon 真勇者ダイン -> cpu_front_left [240.3] -> ピグミィ スパイクボール -> ドノマンティス [402.4] -> master master_attack -> ドノマンティス@player_front_right [328.1] -> ヤンバル wild_claw -> ドノマンティス [646.6] -> end turn [-89.1]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 8/0 / hand player/cpu 5/3
     - metrics: HP 10/10, stones 8/0, boardValue 390/750, ready 2/0, shield 0/0, Lv2+ 1/2
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 prep | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2
2. terminal 226 (+93.4) / response -127.8 (-353.8) / guide 1372.6 / truncated
   - actions: ピグミィ スパイクボール -> 真勇者ダイン [86.5] -> focus ドノマンティス [29.4] -> デスシープ attack -> 真勇者ダイン [178.8] -> ピグミィ スパイクボール -> 真勇者ダイン [392.3] -> ピグミィ スパイクボール -> 真勇者ダイン [432.7] -> ピグミィ スパイクボール -> 真勇者ダイン [642.7] -> end turn [-389.8]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 2/6 / hand player/cpu 4/4
   - metrics: HP 10/10, stones 2/6, boardValue 740/390, ready 0/3, shield 0/0, Lv2+ 2/0
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 focus | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ピグミィ Lv2 HP1 act2/2
   - opponent response: terminal -127.8 (-353.8) / truncated
     - actions: ヤンバル wild_claw -> ピグミィ [574.9] -> move ピグミィ cpu_front_left->cpu_back_left [212.4] -> summon 真勇者ダイン -> cpu_front_left [240.3] -> ピグミィ スパイクボール -> ドノマンティス [402.4] -> master master_attack -> ドノマンティス@player_front_right [328.1] -> ヤンバル wild_claw -> ドノマンティス [646.6] -> end turn [-89.1]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 8/0 / hand player/cpu 5/3
     - metrics: HP 10/10, stones 8/0, boardValue 390/750, ready 2/0, shield 0/0, Lv2+ 1/2
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 prep | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2
3. terminal 221 (+88.4) / response -162.8 (-383.8) / guide 321.7 / truncated
   - actions: ピグミィ スパイクボール -> 真勇者ダイン [86.5] -> focus ドノマンティス [29.4] -> デスシープ attack -> 真勇者ダイン [178.8] -> ピグミィ スパイクボール -> 真勇者ダイン [392.8] -> focus ピグミィ [32] -> master master_attack -> 真勇者ダイン@cpu_front_left [36.3] -> end turn [-434.1]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/6 / hand player/cpu 4/4
   - metrics: HP 10/10, stones 0/6, boardValue 640/390, ready 1/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 focus | player_back_left:PB:ピグミィ Lv1 HP3 act2/2 focus | player_back_right:PB:ピグミィ Lv2 HP1 act1/2 focus
   - opponent response: terminal -162.8 (-383.8) / truncated
     - actions: ヤンバル wild_claw -> ピグミィ [594.1] -> move ピグミィ cpu_front_left->cpu_back_left [196.2] -> summon 真勇者ダイン -> cpu_front_left [241.4] -> ピグミィ スパイクボール -> ドノマンティス [434.2] -> master master_attack -> ドノマンティス@player_front_right [353.8] -> ヤンバル wild_claw -> ドノマンティス [591.2] -> end turn [-82]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 6/0 / hand player/cpu 5/3
     - metrics: HP 10/10, stones 6/0, boardValue 290/750, ready 2/0, shield 0/0, Lv2+ 0/2
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 prep | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv1 HP3 act0/2 focus

