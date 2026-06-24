# White AI Terminal Plan Audit

生成: 2026-06-24T11:21:26.832Z
デッキ: `submission-pro-with-rare8-white-1339` vs `submission-pro-no-rare8-white-1377`
seedStart: 56000, maxSeeds: 20
search: depth 4, width 4, detailed 4
terminalPlan: depth 6, width 2, weight 2
opponentTerminalPlan: depth 2, width 1, weight 0.35
beamWidth: 2, maxActions: 8, responseRankLimit: 12

## Summary

- selected top1: 0/3
- selected average rank: 13
- average gap to best: 21.3
- max gap to best: 36
- selected response top1: 1/3
- selected average response rank: 7.33
- average response gap to best: 3.3
- max response gap to best: 10

## Method

- 実戦途中の白同士局面から、現行AI評価の上位候補を幅 `beamWidth` で拾い、各手順をエンドターンまで進めた。
- `terminal` は、相手ターン開始後の盤面を白AI重みの `evaluateState` で評価した値。`guide` は現行AIの局所評価合計で、terminalとは別物。
- `opponent response` は、渡した盤面から相手AIが同じ軽量設定でエンドターンまで進めた後の盤面評価。勝率ではなく「渡した盤面が相手にどう返されるか」を見るための補助線。
- `response rank` は、終端評価上位 `responseRankLimit` 本と実選択手順を対象に、相手応答後の盤面評価で並べた順位。
- この監査は勝率ではなく、現行AIの選択手順と「相手へ渡す最終盤面」「相手から返る最終盤面」のズレを見るためのもの。

## Conclusion

- 現行AIの選択手順が終端盤面1位だった局面は 0/3。
- 平均ギャップは 21.3 点。80点以上のズレは 0/3。
- 相手応答後1位だった局面は 1/3。応答後平均ギャップは 3.3 点。80点以上のズレは 0/3。
- 現行選択はシールド 1/3、フォーカス 2/3 を含む。終端1位はシールド 0/3、フォーカス 0/3。応答後1位はシールド 0/3、フォーカス 2/3。
- このサンプルでは現行AIの手順選択と終端盤面評価のズレは限定的。次はサンプル局面を増やすか、対黒局面でも同じ監査を行う。

## Scenarios

### 1. seed 56000 turn 5 player

- step: 36
- state: turn 5 / current player / HP player/cpu 7/7 / stones player/cpu 5/0 / hand player/cpu 5/5
- initialScore: -539
- selectedTerminalRank: 7
- selectedResponseRank: 9
- terminalGapToBest: 16
- responseGapToBest: 10
- board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act1/1 | cpu_front_right:CF:ヤミー Lv2 HP5 act1/1 shield

#### Selected plan

1. terminal -469 (+70) / response -595 (-126) / guide -119.8
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [67.9] -> ヤミー attack -> 真勇者ダイン [-18.4] -> master shield -> ヤミー@player_front_left [-168.6] -> end turn [-275.9]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 0/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 0/3, boardValue 170/750, ready 0/4, shield 1/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP2 act0/1 | cpu_front_right:CF:ヤミー Lv2 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 shield
   - opponent response: terminal -595 (-126)
     - actions: 真勇者ダイン ダイン斬り -> player master [263] -> ヤミー attack -> player master [221.4] -> focus ヤンバル [-1] -> master shield -> 真勇者ダイン@cpu_front_left [125.1] -> end turn [-197.3]
     - final: turn 6 / current player / HP player/cpu 5/7 / stones player/cpu 5/1 / hand player/cpu 5/5
     - metrics: HP 5/7, stones 5/1, boardValue 150/770, ready 1/1, shield 0/1, Lv2+ 0/2
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 focus | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP2 act1/1 shield | cpu_front_right:CF:ヤミー Lv2 HP5 act1/1 | player_front_left:PF:ヤミー Lv1 HP5 act0/1

#### Top terminal plans

1. terminal -453 (+86) / response -585 (-132) / guide 223.8
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [67.9] -> end turn [-119.3]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 2/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 2/3, boardValue 150/770, ready 1/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv2 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act0/1 focus
   - opponent response: terminal -585 (-132)
     - actions: ヤミー attack -> player master [224.9] -> 真勇者ダイン ダイン斬り -> player master [180.4] -> ヤンバル wild_claw -> ヤミー [90.3] -> master shield -> 真勇者ダイン@cpu_front_left [27.1] -> end turn [-139.2]
     - final: turn 6 / current player / HP player/cpu 5/7 / stones player/cpu 7/1 / hand player/cpu 5/5
     - metrics: HP 5/7, stones 7/1, boardValue 140/790, ready 1/1, shield 0/1, Lv2+ 0/2
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act1/1 shield | cpu_front_right:CF:ヤミー Lv2 HP5 act1/1 | player_front_left:PF:ヤミー Lv1 HP4 act0/1
2. terminal -453 (+86) / response -585 (-132) / guide 186.4
   - actions: summon ヤミー -> player_front_right [239.3] -> master wake_up -> ヤミー@player_front_right [61.8] -> end turn [-114.6]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 2/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 2/3, boardValue 150/770, ready 1/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv2 HP5 act0/1 | player_front_right:PF:ヤミー Lv1 HP5 act0/1 focus
   - opponent response: terminal -585 (-132)
     - actions: 真勇者ダイン ダイン斬り -> player master [218.8] -> ヤミー attack -> player master [170.6] -> ヤンバル wild_claw -> ヤミー [84.4] -> master shield -> ヤミー@cpu_front_right [-65.8] -> end turn [-139.2]
     - final: turn 6 / current player / HP player/cpu 5/7 / stones player/cpu 7/1 / hand player/cpu 5/5
     - metrics: HP 5/7, stones 7/1, boardValue 140/790, ready 1/1, shield 0/1, Lv2+ 0/2
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act1/1 | cpu_front_right:CF:ヤミー Lv2 HP5 act1/1 shield | player_front_right:PF:ヤミー Lv1 HP4 act0/1
3. terminal -463 (+76) / response -589 (-126) / guide -130.7
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [67.9] -> focus ヤミー [-29.4] -> master shield -> ヤミー@player_front_left [-171.2] -> end turn [-273.2]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 0/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 0/3, boardValue 170/770, ready 0/4, shield 1/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv2 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 shield,focus
   - opponent response: terminal -589 (-126)
     - actions: 真勇者ダイン ダイン斬り -> player master [274.8] -> ヤミー attack -> player master [215.3] -> ヤンバル wild_claw -> ヤミー [67.9] -> master shield -> 真勇者ダイン@cpu_front_left [-58.5] -> end turn [-159.2]
     - final: turn 6 / current player / HP player/cpu 5/7 / stones player/cpu 5/1 / hand player/cpu 5/5
     - metrics: HP 5/7, stones 5/1, boardValue 150/790, ready 1/1, shield 0/1, Lv2+ 0/2
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act1/1 shield | cpu_front_right:CF:ヤミー Lv2 HP5 act1/1 | player_front_left:PF:ヤミー Lv1 HP5 act0/1

#### Top response-adjusted plans

1. terminal -453 (+86) / response -585 (-132) / guide 223.8
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [67.9] -> end turn [-119.3]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 2/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 2/3, boardValue 150/770, ready 1/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv2 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act0/1 focus
   - opponent response: terminal -585 (-132)
     - actions: ヤミー attack -> player master [224.9] -> 真勇者ダイン ダイン斬り -> player master [180.4] -> ヤンバル wild_claw -> ヤミー [90.3] -> master shield -> 真勇者ダイン@cpu_front_left [27.1] -> end turn [-139.2]
     - final: turn 6 / current player / HP player/cpu 5/7 / stones player/cpu 7/1 / hand player/cpu 5/5
     - metrics: HP 5/7, stones 7/1, boardValue 140/790, ready 1/1, shield 0/1, Lv2+ 0/2
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act1/1 shield | cpu_front_right:CF:ヤミー Lv2 HP5 act1/1 | player_front_left:PF:ヤミー Lv1 HP4 act0/1
2. terminal -453 (+86) / response -585 (-132) / guide 186.4
   - actions: summon ヤミー -> player_front_right [239.3] -> master wake_up -> ヤミー@player_front_right [61.8] -> end turn [-114.6]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 2/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 2/3, boardValue 150/770, ready 1/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv2 HP5 act0/1 | player_front_right:PF:ヤミー Lv1 HP5 act0/1 focus
   - opponent response: terminal -585 (-132)
     - actions: 真勇者ダイン ダイン斬り -> player master [218.8] -> ヤミー attack -> player master [170.6] -> ヤンバル wild_claw -> ヤミー [84.4] -> master shield -> ヤミー@cpu_front_right [-65.8] -> end turn [-139.2]
     - final: turn 6 / current player / HP player/cpu 5/7 / stones player/cpu 7/1 / hand player/cpu 5/5
     - metrics: HP 5/7, stones 7/1, boardValue 140/790, ready 1/1, shield 0/1, Lv2+ 0/2
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act1/1 | cpu_front_right:CF:ヤミー Lv2 HP5 act1/1 shield | player_front_right:PF:ヤミー Lv1 HP4 act0/1
3. terminal -465 (+74) / response -585 (-120) / guide 100.3
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [67.9] -> focus ヤミー [-29.4] -> end turn [-213.5]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 2/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 2/3, boardValue 150/770, ready 0/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv2 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 focus
   - opponent response: terminal -585 (-120)
     - actions: ヤミー attack -> player master [222.3] -> 真勇者ダイン ダイン斬り -> player master [173] -> ヤンバル wild_claw -> ヤミー [62.8] -> master shield -> 真勇者ダイン@cpu_front_left [4.5] -> end turn [-174.8]
     - final: turn 6 / current player / HP player/cpu 5/7 / stones player/cpu 7/1 / hand player/cpu 5/5
     - metrics: HP 5/7, stones 7/1, boardValue 140/790, ready 1/1, shield 0/1, Lv2+ 0/2
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act1/1 shield | cpu_front_right:CF:ヤミー Lv2 HP5 act1/1 | player_front_left:PF:ヤミー Lv1 HP4 act0/1

### 2. seed 56001 turn 5 player

- step: 51
- state: turn 5 / current player / HP player/cpu 9/10 / stones player/cpu 4/0 / hand player/cpu 3/3
- initialScore: 104
- selectedTerminalRank: 22
- selectedResponseRank: 12
- terminalGapToBest: 36
- responseGapToBest: 0
- board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 | player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv1 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1

#### Selected plan

1. terminal 319 (+215) / response 245 (-74) / guide 775.7
   - actions: デスシープ attack -> cpu master [288.2] -> move ピグミィ player_front_right->player_back_right [212.2] -> summon 鉄拳シグマ -> player_front_right [234.5] -> master wake_up -> 鉄拳シグマ@player_front_right [139] -> 鉄拳シグマ attack -> ヤミー [19] -> focus デスシープ [-36.2] -> end turn [-81]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 1/4 / hand player/cpu 2/4
   - metrics: HP 9/9, stones 1/4, boardValue 710/270, ready 1/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤミー Lv1 HP4 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal 245 (-74)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [320.7] -> focus ヤミー [183] -> summon ヤンバル -> cpu_back_left [175] -> master wake_up -> ヤンバル@cpu_back_left [128] -> ピグミィ スパイクボール -> デスシープ [19] -> ヤンバル wild_claw -> デスシープ [-91.4] -> end turn [-204.7]
     - final: turn 6 / current player / HP player/cpu 9/9 / stones player/cpu 4/1 / hand player/cpu 3/3
     - metrics: HP 9/9, stones 4/1, boardValue 680/400, ready 4/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ヤミー Lv1 HP4 act1/1 focus | player_front_left:PF:デスシープ Lv2 HP3 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus

#### Top terminal plans

1. terminal 355 (+251) / response 233 (-122) / guide 880.3
   - actions: デスシープ attack -> cpu master [288.2] -> move ピグミィ player_front_right->player_back_right [212.2] -> summon 鉄拳シグマ -> player_front_right [234.5] -> master wake_up -> 鉄拳シグマ@player_front_right [139] -> end turn [6.4]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 1/4 / hand player/cpu 2/4
   - metrics: HP 9/9, stones 1/4, boardValue 710/280, ready 3/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal 233 (-122)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [321] -> summon ヤンバル -> cpu_back_left [179.3] -> focus ヤミー [173.8] -> master wake_up -> ヤンバル@cpu_back_left [150.3] -> ヤンバル wild_claw -> 鉄拳シグマ [25.9] -> focus ピグミィ [-49] -> end turn [-133.4]
     - final: turn 6 / current player / HP player/cpu 9/9 / stones player/cpu 4/1 / hand player/cpu 3/3
     - metrics: HP 9/9, stones 4/1, boardValue 700/410, ready 4/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 focus | player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP5 act0/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
2. terminal 343 (+239) / response 245 (-98) / guide 988.8
   - actions: デスシープ attack -> cpu master [288.2] -> move ピグミィ player_front_right->player_back_right [212.2] -> focus デスシープ [162.4] -> summon 鉄拳シグマ -> player_front_right [229.5] -> master wake_up -> 鉄拳シグマ@player_front_right [123.8] -> end turn [-27.2]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 1/4 / hand player/cpu 2/4
   - metrics: HP 9/9, stones 1/4, boardValue 710/280, ready 2/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal 245 (-98)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [321] -> summon ヤンバル -> cpu_back_left [179.3] -> focus ヤミー [173.8] -> master wake_up -> ヤンバル@cpu_back_left [150.3] -> ピグミィ スパイクボール -> デスシープ [19] -> ヤンバル wild_claw -> 鉄拳シグマ [-41.9] -> end turn [-169.4]
     - final: turn 6 / current player / HP player/cpu 9/9 / stones player/cpu 4/1 / hand player/cpu 3/3
     - metrics: HP 9/9, stones 4/1, boardValue 690/410, ready 4/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 focus | player_front_left:PF:デスシープ Lv2 HP5 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP5 act0/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
3. terminal 343 (+239) / response 245 (-98) / guide 954.5
   - actions: デスシープ attack -> cpu master [288.2] -> move ピグミィ player_front_right->player_back_right [212.2] -> summon 鉄拳シグマ -> player_front_right [234.5] -> focus デスシープ [123.1] -> master wake_up -> 鉄拳シグマ@player_front_right [123.8] -> end turn [-27.2]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 1/4 / hand player/cpu 2/4
   - metrics: HP 9/9, stones 1/4, boardValue 710/280, ready 2/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal 245 (-98)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [321] -> summon ヤンバル -> cpu_back_left [179.3] -> focus ヤミー [173.8] -> master wake_up -> ヤンバル@cpu_back_left [150.3] -> ピグミィ スパイクボール -> デスシープ [19] -> ヤンバル wild_claw -> 鉄拳シグマ [-41.9] -> end turn [-169.4]
     - final: turn 6 / current player / HP player/cpu 9/9 / stones player/cpu 4/1 / hand player/cpu 3/3
     - metrics: HP 9/9, stones 4/1, boardValue 690/410, ready 4/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 focus | player_front_left:PF:デスシープ Lv2 HP5 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP5 act0/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus

#### Top response-adjusted plans

1. terminal 343 (+239) / response 245 (-98) / guide 988.8
   - actions: デスシープ attack -> cpu master [288.2] -> move ピグミィ player_front_right->player_back_right [212.2] -> focus デスシープ [162.4] -> summon 鉄拳シグマ -> player_front_right [229.5] -> master wake_up -> 鉄拳シグマ@player_front_right [123.8] -> end turn [-27.2]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 1/4 / hand player/cpu 2/4
   - metrics: HP 9/9, stones 1/4, boardValue 710/280, ready 2/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal 245 (-98)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [321] -> summon ヤンバル -> cpu_back_left [179.3] -> focus ヤミー [173.8] -> master wake_up -> ヤンバル@cpu_back_left [150.3] -> ピグミィ スパイクボール -> デスシープ [19] -> ヤンバル wild_claw -> 鉄拳シグマ [-41.9] -> end turn [-169.4]
     - final: turn 6 / current player / HP player/cpu 9/9 / stones player/cpu 4/1 / hand player/cpu 3/3
     - metrics: HP 9/9, stones 4/1, boardValue 690/410, ready 4/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 focus | player_front_left:PF:デスシープ Lv2 HP5 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP5 act0/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
2. terminal 343 (+239) / response 245 (-98) / guide 954.5
   - actions: デスシープ attack -> cpu master [288.2] -> move ピグミィ player_front_right->player_back_right [212.2] -> summon 鉄拳シグマ -> player_front_right [234.5] -> focus デスシープ [123.1] -> master wake_up -> 鉄拳シグマ@player_front_right [123.8] -> end turn [-27.2]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 1/4 / hand player/cpu 2/4
   - metrics: HP 9/9, stones 1/4, boardValue 710/280, ready 2/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal 245 (-98)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [321] -> summon ヤンバル -> cpu_back_left [179.3] -> focus ヤミー [173.8] -> master wake_up -> ヤンバル@cpu_back_left [150.3] -> ピグミィ スパイクボール -> デスシープ [19] -> ヤンバル wild_claw -> 鉄拳シグマ [-41.9] -> end turn [-169.4]
     - final: turn 6 / current player / HP player/cpu 9/9 / stones player/cpu 4/1 / hand player/cpu 3/3
     - metrics: HP 9/9, stones 4/1, boardValue 690/410, ready 4/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 focus | player_front_left:PF:デスシープ Lv2 HP5 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP5 act0/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
3. terminal 343 (+239) / response 245 (-98) / guide 827
   - actions: デスシープ attack -> cpu master [288.2] -> move ピグミィ player_front_right->player_back_right [212.2] -> summon 鉄拳シグマ -> player_front_right [234.5] -> master wake_up -> 鉄拳シグマ@player_front_right [139] -> focus 鉄拳シグマ [-8.5] -> end turn [-38.4]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 1/4 / hand player/cpu 2/4
   - metrics: HP 9/9, stones 1/4, boardValue 710/280, ready 2/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal 245 (-98)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [321] -> summon ヤンバル -> cpu_back_left [179.3] -> focus ヤミー [173.8] -> master wake_up -> ヤンバル@cpu_back_left [150.3] -> ピグミィ スパイクボール -> デスシープ [19] -> ヤンバル wild_claw -> 鉄拳シグマ [-41.9] -> end turn [-169]
     - final: turn 6 / current player / HP player/cpu 9/9 / stones player/cpu 4/1 / hand player/cpu 3/3
     - metrics: HP 9/9, stones 4/1, boardValue 690/410, ready 4/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 focus | player_front_left:PF:デスシープ Lv2 HP5 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP5 act0/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus

### 3. seed 56002 turn 5 player

- step: 38
- state: turn 5 / current player / HP player/cpu 10/8 / stones player/cpu 5/1 / hand player/cpu 4/5
- initialScore: -68
- selectedTerminalRank: 10
- selectedResponseRank: 1
- terminalGapToBest: 12
- responseGapToBest: 0
- board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ボムゾウ Lv1 HP5 act1/1 | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP4 act1/1 | player_front_left:PF:モーガン Lv1 HP4 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1

#### Selected plan

1. terminal 106 (+174) / response -11 (-117) / guide 1269.4
   - actions: summon ヤンバル -> player_back_left [399.3] -> master wake_up -> ヤンバル@player_back_left [444.2] -> ヤンバル wild_claw -> ドノマンティス [406.7] -> モーガン arc_drive -> ドノマンティス [437.6] -> focus 鉄拳シグマ [-143.7] -> end turn [-274.7]
   - final: turn 5 / current cpu / HP player/cpu 10/8 / stones player/cpu 1/5 / hand player/cpu 3/6
   - metrics: HP 10/8, stones 1/5, boardValue 530/550, ready 0/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv2 HP4 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1
   - opponent response: terminal -11 (-117)
     - actions: summon ピグミィ -> cpu_back_right [188.3] -> master wake_up -> ピグミィ@cpu_back_right [199.7] -> ボムゾウ self_bomb -> player master [5] -> ボムゾウ storm_bomb -> モーガン [19] -> ピグミィ スパイクボール -> モーガン [-52.4] -> focus ピグミィ [-58.9] -> master shield -> ピグミィ@cpu_back_right [-158.1] -> end turn [-298.4]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 5/0 / hand player/cpu 4/5
     - metrics: HP 9/8, stones 5/0, boardValue 510/670, ready 3/1, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 shield,focus | cpu_front_left:CF:ボムゾウ Lv2 HP2 act1/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act1/1 | player_front_left:PF:モーガン Lv2 HP2 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1

#### Top terminal plans

1. terminal 118 (+186) / response -140 (-258) / guide 1395.5
   - actions: summon ヤンバル -> player_back_left [399.3] -> モーガン arc_drive -> ドノマンティス [411.2] -> master wake_up -> ヤンバル@player_back_left [537.2] -> ヤンバル wild_claw -> ドノマンティス [507.6] -> end turn [-459.8]
   - final: turn 5 / current cpu / HP player/cpu 10/8 / stones player/cpu 1/5 / hand player/cpu 3/6
   - metrics: HP 10/8, stones 1/5, boardValue 530/550, ready 1/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv1 HP4 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1
   - opponent response: terminal -140 (-258)
     - actions: summon ピグミィ -> cpu_back_right [199.6] -> master wake_up -> ピグミィ@cpu_back_right [314.8] -> ボムゾウ storm_bomb -> ヤンバル [14.9] -> ボムゾウ storm_bomb -> ヤンバル [773.2] -> ピグミィ スパイクボール -> モーガン [-17.9] -> focus ピグミィ [-82.1] -> end turn [-157.1]
     - final: turn 6 / current player / HP player/cpu 10/8 / stones player/cpu 6/1 / hand player/cpu 4/5
     - metrics: HP 10/8, stones 6/1, boardValue 290/780, ready 2/1, shield 0/0, Lv2+ 0/2
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 | cpu_front_right:CF:ボムゾウ Lv2 HP5 act1/1 | player_front_left:PF:モーガン Lv1 HP3 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus
2. terminal 118 (+186) / response -23 (-141) / guide 1456.9
   - actions: summon ヤンバル -> player_back_left [399.3] -> master wake_up -> ヤンバル@player_back_left [444.2] -> ヤンバル wild_claw -> ドノマンティス [406.7] -> モーガン arc_drive -> ドノマンティス [437.6] -> end turn [-230.9]
   - final: turn 5 / current cpu / HP player/cpu 10/8 / stones player/cpu 1/5 / hand player/cpu 3/6
   - metrics: HP 10/8, stones 1/5, boardValue 530/550, ready 1/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv2 HP4 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1
   - opponent response: terminal -23 (-141)
     - actions: summon ピグミィ -> cpu_back_right [188.3] -> master wake_up -> ピグミィ@cpu_back_right [199.7] -> ボムゾウ self_bomb -> player master [7.1] -> ピグミィ スパイクボール -> モーガン [42] -> focus ボムゾウ [23.8] -> focus ピグミィ [-34.9] -> master shield -> ピグミィ@cpu_back_right [-134.1] -> end turn [-241.8]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 5/0 / hand player/cpu 4/5
     - metrics: HP 9/8, stones 5/0, boardValue 520/670, ready 3/1, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 shield,focus | cpu_front_left:CF:ボムゾウ Lv2 HP2 act1/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act1/1 focus | player_front_left:PF:モーガン Lv2 HP3 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1
3. terminal 118 (+186) / response -140 (-258) / guide 1267.8
   - actions: summon ヤンバル -> player_back_left [399.3] -> master wake_up -> ヤンバル@player_back_left [444.2] -> モーガン arc_drive -> ドノマンティス [376.5] -> ヤンバル wild_claw -> ドノマンティス [507.6] -> end turn [-459.8]
   - final: turn 5 / current cpu / HP player/cpu 10/8 / stones player/cpu 1/5 / hand player/cpu 3/6
   - metrics: HP 10/8, stones 1/5, boardValue 530/550, ready 1/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv1 HP4 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1
   - opponent response: terminal -140 (-258)
     - actions: summon ピグミィ -> cpu_back_right [199.6] -> master wake_up -> ピグミィ@cpu_back_right [314.8] -> ボムゾウ storm_bomb -> ヤンバル [14.9] -> ボムゾウ storm_bomb -> ヤンバル [773.2] -> ピグミィ スパイクボール -> モーガン [-17.9] -> focus ピグミィ [-82.1] -> end turn [-157.1]
     - final: turn 6 / current player / HP player/cpu 10/8 / stones player/cpu 6/1 / hand player/cpu 4/5
     - metrics: HP 10/8, stones 6/1, boardValue 290/780, ready 2/1, shield 0/0, Lv2+ 0/2
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 | cpu_front_right:CF:ボムゾウ Lv2 HP5 act1/1 | player_front_left:PF:モーガン Lv1 HP3 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus

#### Top response-adjusted plans

1. terminal 106 (+174) / response -11 (-117) / guide 1269.4
   - actions: summon ヤンバル -> player_back_left [399.3] -> master wake_up -> ヤンバル@player_back_left [444.2] -> ヤンバル wild_claw -> ドノマンティス [406.7] -> モーガン arc_drive -> ドノマンティス [437.6] -> focus 鉄拳シグマ [-143.7] -> end turn [-274.7]
   - final: turn 5 / current cpu / HP player/cpu 10/8 / stones player/cpu 1/5 / hand player/cpu 3/6
   - metrics: HP 10/8, stones 1/5, boardValue 530/550, ready 0/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv2 HP4 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1
   - opponent response: terminal -11 (-117)
     - actions: summon ピグミィ -> cpu_back_right [188.3] -> master wake_up -> ピグミィ@cpu_back_right [199.7] -> ボムゾウ self_bomb -> player master [5] -> ボムゾウ storm_bomb -> モーガン [19] -> ピグミィ スパイクボール -> モーガン [-52.4] -> focus ピグミィ [-58.9] -> master shield -> ピグミィ@cpu_back_right [-158.1] -> end turn [-298.4]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 5/0 / hand player/cpu 4/5
     - metrics: HP 9/8, stones 5/0, boardValue 510/670, ready 3/1, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 shield,focus | cpu_front_left:CF:ボムゾウ Lv2 HP2 act1/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act1/1 | player_front_left:PF:モーガン Lv2 HP2 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1
2. terminal 106 (+174) / response -11 (-117) / guide 1652.2
   - actions: summon ヤンバル -> player_back_left [399.3] -> master wake_up -> ヤンバル@player_back_left [444.2] -> ヤンバル wild_claw -> ドノマンティス [406.7] -> focus 鉄拳シグマ [247.9] -> モーガン arc_drive -> ドノマンティス [428.7] -> end turn [-274.7]
   - final: turn 5 / current cpu / HP player/cpu 10/8 / stones player/cpu 1/5 / hand player/cpu 3/6
   - metrics: HP 10/8, stones 1/5, boardValue 530/550, ready 0/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv2 HP4 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1
   - opponent response: terminal -11 (-117)
     - actions: summon ピグミィ -> cpu_back_right [188.3] -> master wake_up -> ピグミィ@cpu_back_right [199.7] -> ボムゾウ self_bomb -> player master [5] -> ボムゾウ storm_bomb -> モーガン [19] -> ピグミィ スパイクボール -> モーガン [-52.4] -> focus ピグミィ [-58.9] -> master shield -> ピグミィ@cpu_back_right [-158.1] -> end turn [-298.4]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 5/0 / hand player/cpu 4/5
     - metrics: HP 9/8, stones 5/0, boardValue 510/670, ready 3/1, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 shield,focus | cpu_front_left:CF:ボムゾウ Lv2 HP2 act1/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act1/1 | player_front_left:PF:モーガン Lv2 HP2 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1
3. terminal 118 (+186) / response -23 (-141) / guide 1456.9
   - actions: summon ヤンバル -> player_back_left [399.3] -> master wake_up -> ヤンバル@player_back_left [444.2] -> ヤンバル wild_claw -> ドノマンティス [406.7] -> モーガン arc_drive -> ドノマンティス [437.6] -> end turn [-230.9]
   - final: turn 5 / current cpu / HP player/cpu 10/8 / stones player/cpu 1/5 / hand player/cpu 3/6
   - metrics: HP 10/8, stones 1/5, boardValue 530/550, ready 1/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv2 HP4 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1
   - opponent response: terminal -23 (-141)
     - actions: summon ピグミィ -> cpu_back_right [188.3] -> master wake_up -> ピグミィ@cpu_back_right [199.7] -> ボムゾウ self_bomb -> player master [7.1] -> ピグミィ スパイクボール -> モーガン [42] -> focus ボムゾウ [23.8] -> focus ピグミィ [-34.9] -> master shield -> ピグミィ@cpu_back_right [-134.1] -> end turn [-241.8]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 5/0 / hand player/cpu 4/5
     - metrics: HP 9/8, stones 5/0, boardValue 520/670, ready 3/1, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 shield,focus | cpu_front_left:CF:ボムゾウ Lv2 HP2 act1/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act1/1 focus | player_front_left:PF:モーガン Lv2 HP3 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1

