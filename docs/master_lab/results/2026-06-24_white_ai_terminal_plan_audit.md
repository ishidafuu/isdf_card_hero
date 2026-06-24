# White AI Terminal Plan Audit

生成: 2026-06-24T08:54:13.047Z
デッキ: `submission-pro-with-rare8-white-1339` vs `submission-pro-no-rare8-white-1377`
seedStart: 56000, maxSeeds: 20
search: depth 4, width 4, detailed 4
terminalPlan: depth 6, width 2, weight 2
opponentTerminalPlan: depth 1, width 1, weight 0.35
beamWidth: 2, maxActions: 8

## Summary

- selected top1: 1/3
- selected average rank: 4.33
- average gap to best: 5.3
- max gap to best: 16

## Method

- 実戦途中の白同士局面から、現行AI評価の上位候補を幅 `beamWidth` で拾い、各手順をエンドターンまで進めた。
- `terminal` は、相手ターン開始後の盤面を白AI重みの `evaluateState` で評価した値。`guide` は現行AIの局所評価合計で、terminalとは別物。
- `opponent response` は、渡した盤面から相手AIが同じ軽量設定でエンドターンまで進めた後の盤面評価。勝率ではなく「渡した盤面が相手にどう返されるか」を見るための補助線。
- この監査は勝率ではなく、現行AIの選択手順と「相手へ渡す最終盤面」「相手から返る最終盤面」のズレを見るためのもの。

## Conclusion

- 現行AIの選択手順が終端盤面1位だった局面は 1/3。
- 平均ギャップは 5.3 点。80点以上のズレは 0/3。
- 現行選択はシールド 1/3、フォーカス 0/3 を含む。一方、終端1位はシールド 0/3、フォーカス 0/3。
- このサンプルでは現行AIの手順選択と終端盤面評価のズレは限定的。次はサンプル局面を増やすか、対黒局面でも同じ監査を行う。

## Scenarios

### 1. seed 56000 turn 5 player

- step: 36
- state: turn 5 / current player / HP player/cpu 7/7 / stones player/cpu 5/0 / hand player/cpu 5/5
- initialScore: -539
- selectedTerminalRank: 7
- terminalGapToBest: 16
- board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 shield | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act1/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1

#### Selected plan

1. terminal -469 (+70) / guide 144.1
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [110.3] -> ヤミー attack -> 真勇者ダイン [14.9] -> master shield -> ヤミー@player_front_left [-74.5] -> end turn [-181.8]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 0/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 0/3, boardValue 170/750, ready 0/4, shield 1/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP2 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 shield
   - opponent response: terminal -595 (-126)
     - actions: 真勇者ダイン ダイン斬り -> player master [266] -> ヤンバル wild_claw -> player master [183.5] -> focus ヤミー [109.9] -> master shield -> 真勇者ダイン@cpu_front_left [179.8] -> end turn [-136.2]
     - final: turn 6 / current player / HP player/cpu 5/7 / stones player/cpu 5/1 / hand player/cpu 5/5
     - metrics: HP 5/7, stones 5/1, boardValue 150/770, ready 1/1, shield 0/1, Lv2+ 0/2
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP2 act1/1 shield | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 focus | player_front_left:PF:ヤミー Lv1 HP5 act0/1

#### Top terminal plans

1. terminal -453 (+86) / guide 309.9
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [110.3] -> end turn [-75.6]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 2/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 2/3, boardValue 150/770, ready 1/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act0/1 focus
   - opponent response: terminal -579 (-126)
     - actions: 真勇者ダイン ダイン斬り -> player master [161.6] -> ヤンバル wild_claw -> player master [220.8] -> focus ヤミー [116.7] -> master shield -> 真勇者ダイン@cpu_front_left [98.8] -> end turn [-71.9]
     - final: turn 6 / current player / HP player/cpu 5/7 / stones player/cpu 7/1 / hand player/cpu 5/5
     - metrics: HP 5/7, stones 7/1, boardValue 150/790, ready 1/1, shield 0/1, Lv2+ 0/2
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act1/1 shield | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 focus | player_front_left:PF:ヤミー Lv1 HP5 act0/1 focus
2. terminal -453 (+86) / guide 291.4
   - actions: summon ヤミー -> player_front_right [252.2] -> master wake_up -> ヤミー@player_front_right [114.9] -> end turn [-75.6]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 2/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 2/3, boardValue 150/770, ready 1/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_right:PF:ヤミー Lv1 HP5 act0/1 focus
   - opponent response: terminal -585 (-132)
     - actions: 真勇者ダイン ダイン斬り -> player master [221.1] -> ヤンバル wild_claw -> player master [157.2] -> ヤミー attack -> ヤミー [113.7] -> master shield -> ヤミー@cpu_front_right [-18.8] -> end turn [-84.5]
     - final: turn 6 / current player / HP player/cpu 5/7 / stones player/cpu 7/1 / hand player/cpu 5/5
     - metrics: HP 5/7, stones 7/1, boardValue 140/790, ready 1/1, shield 0/1, Lv2+ 0/2
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act1/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 shield | player_front_right:PF:ヤミー Lv1 HP4 act0/1
3. terminal -463 (+76) / guide 133.1
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [110.3] -> focus ヤミー [3.9] -> master shield -> ヤミー@player_front_left [-77.1] -> end turn [-179.1]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 0/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 0/3, boardValue 170/770, ready 0/4, shield 1/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 shield,focus
   - opponent response: terminal -589 (-126)
     - actions: 真勇者ダイン ダイン斬り -> player master [267.4] -> ヤンバル wild_claw -> player master [201.5] -> focus ヤミー [76.4] -> master shield -> 真勇者ダイン@cpu_front_left [7.9] -> end turn [-85.6]
     - final: turn 6 / current player / HP player/cpu 5/7 / stones player/cpu 5/1 / hand player/cpu 5/5
     - metrics: HP 5/7, stones 5/1, boardValue 150/790, ready 1/1, shield 0/1, Lv2+ 0/2
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act1/1 shield | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 focus | player_front_left:PF:ヤミー Lv1 HP5 act0/1 focus

### 2. seed 56001 turn 5 player

- step: 51
- state: turn 5 / current player / HP player/cpu 9/10 / stones player/cpu 4/0 / hand player/cpu 3/3
- initialScore: 104
- selectedTerminalRank: 1
- terminalGapToBest: 0
- board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 | player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:ピグミィ Lv1 HP3 act0/2 | player_back_left:PB:デスシープ Lv1 HP6 act0/1

#### Selected plan

1. terminal 355 (+251) / guide 953.5
   - actions: デスシープ attack -> cpu master [288.2] -> move ピグミィ player_front_right->player_back_right [212.2] -> summon 鉄拳シグマ -> player_front_right [234.5] -> master wake_up -> 鉄拳シグマ@player_front_right [139] -> end turn [79.6]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 1/4 / hand player/cpu 2/4
   - metrics: HP 9/9, stones 1/4, boardValue 710/280, ready 3/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal 233 (-122)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [321] -> summon ヤンバル -> cpu_back_left [179.3] -> focus ヤミー [170.8] -> master wake_up -> ヤンバル@cpu_back_left [150.3] -> ヤンバル wild_claw -> 鉄拳シグマ [25.9] -> focus ピグミィ [-49] -> end turn [-133.4]
     - final: turn 6 / current player / HP player/cpu 9/9 / stones player/cpu 4/1 / hand player/cpu 3/3
     - metrics: HP 9/9, stones 4/1, boardValue 700/410, ready 4/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 focus | player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP5 act0/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus

#### Top terminal plans

1. terminal 355 (+251) / guide 953.5
   - actions: デスシープ attack -> cpu master [288.2] -> move ピグミィ player_front_right->player_back_right [212.2] -> summon 鉄拳シグマ -> player_front_right [234.5] -> master wake_up -> 鉄拳シグマ@player_front_right [139] -> end turn [79.6]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 1/4 / hand player/cpu 2/4
   - metrics: HP 9/9, stones 1/4, boardValue 710/280, ready 3/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal 233 (-122)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [321] -> summon ヤンバル -> cpu_back_left [179.3] -> focus ヤミー [170.8] -> master wake_up -> ヤンバル@cpu_back_left [150.3] -> ヤンバル wild_claw -> 鉄拳シグマ [25.9] -> focus ピグミィ [-49] -> end turn [-133.4]
     - final: turn 6 / current player / HP player/cpu 9/9 / stones player/cpu 4/1 / hand player/cpu 3/3
     - metrics: HP 9/9, stones 4/1, boardValue 700/410, ready 4/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 focus | player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP5 act0/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
2. terminal 343 (+239) / guide 1044.9
   - actions: デスシープ attack -> cpu master [288.2] -> move ピグミィ player_front_right->player_back_right [212.2] -> focus デスシープ [150.4] -> summon 鉄拳シグマ -> player_front_right [229.5] -> master wake_up -> 鉄拳シグマ@player_front_right [126.2] -> end turn [38.5]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 1/4 / hand player/cpu 2/4
   - metrics: HP 9/9, stones 1/4, boardValue 710/280, ready 2/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal 245 (-98)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [321] -> summon ヤンバル -> cpu_back_left [179.3] -> focus ヤミー [170.8] -> master wake_up -> ヤンバル@cpu_back_left [150.3] -> ピグミィ スパイクボール -> デスシープ [19] -> ヤンバル wild_claw -> 鉄拳シグマ [-41.9] -> end turn [-169.4]
     - final: turn 6 / current player / HP player/cpu 9/9 / stones player/cpu 4/1 / hand player/cpu 3/3
     - metrics: HP 9/9, stones 4/1, boardValue 690/410, ready 4/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 focus | player_front_left:PF:デスシープ Lv2 HP5 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP5 act0/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
3. terminal 343 (+239) / guide 1010.6
   - actions: デスシープ attack -> cpu master [288.2] -> move ピグミィ player_front_right->player_back_right [212.2] -> summon 鉄拳シグマ -> player_front_right [234.5] -> focus デスシープ [111.1] -> master wake_up -> 鉄拳シグマ@player_front_right [126.2] -> end turn [38.5]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 1/4 / hand player/cpu 2/4
   - metrics: HP 9/9, stones 1/4, boardValue 710/280, ready 2/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal 245 (-98)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [321] -> summon ヤンバル -> cpu_back_left [179.3] -> focus ヤミー [170.8] -> master wake_up -> ヤンバル@cpu_back_left [150.3] -> ピグミィ スパイクボール -> デスシープ [19] -> ヤンバル wild_claw -> 鉄拳シグマ [-41.9] -> end turn [-169.4]
     - final: turn 6 / current player / HP player/cpu 9/9 / stones player/cpu 4/1 / hand player/cpu 3/3
     - metrics: HP 9/9, stones 4/1, boardValue 690/410, ready 4/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 focus | player_front_left:PF:デスシープ Lv2 HP5 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP5 act0/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus

### 3. seed 56002 turn 5 player

- step: 41
- state: turn 5 / current player / HP player/cpu 9/9 / stones player/cpu 5/1 / hand player/cpu 5/4
- initialScore: -219
- selectedTerminalRank: 5
- terminalGapToBest: 0
- board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 | player_front_left:PF:モーガン Lv1 HP4 act0/1 | player_front_right:PF:鉄拳シグマ Lv2 HP6 act0/1

#### Selected plan

1. terminal -1.6 (+217.4) / guide 1444.5
   - actions: magic パワーアップ -> モーガン@player_front_left [776.9] -> 鉄拳シグマ attack -> cpu master [401.8] -> モーガン arc_drive -> ピグミィ [247.3] -> summon ヤンバル -> player_back_left [137.4] -> end turn [-119]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/6 / hand player/cpu 3/5
   - metrics: HP 9/8, stones 0/6, boardValue 630/550, ready 0/3, shield 0/0, Lv2+ 2/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv2 HP4 act1/1 | player_front_right:PF:鉄拳シグマ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 prep
   - opponent response: terminal -96.2 (-94.6)
     - actions: master master_attack -> モーガン@player_front_left [312.4] -> ボムゾウ self_bomb -> モーガン [495.8] -> focus ドノマンティス [163.4] -> summon ヤミー -> cpu_back_right [147.6] -> master shield -> ボムゾウ@cpu_front_left [88.3] -> end turn [-159.1]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 5/0 / hand player/cpu 4/4
     - metrics: HP 9/8, stones 5/0, boardValue 390/690, ready 2/1, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤミー Lv1 HP5 prep | cpu_front_left:CF:ボムゾウ Lv2 HP2 act1/1 shield | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:鉄拳シグマ Lv2 HP6 act0/1

#### Top terminal plans

1. terminal -1.6 (+217.4) / guide 1599.8
   - actions: 鉄拳シグマ attack -> cpu master [557.1] -> magic パワーアップ -> モーガン@player_front_left [776.9] -> モーガン arc_drive -> ピグミィ [247.3] -> summon ヤンバル -> player_back_left [137.4] -> end turn [-119]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/6 / hand player/cpu 3/5
   - metrics: HP 9/8, stones 0/6, boardValue 630/550, ready 0/3, shield 0/0, Lv2+ 2/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv2 HP4 act1/1 | player_front_right:PF:鉄拳シグマ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 prep
   - opponent response: terminal -96.2 (-94.6)
     - actions: master master_attack -> モーガン@player_front_left [312.4] -> ボムゾウ self_bomb -> モーガン [495.8] -> focus ドノマンティス [163.4] -> summon ヤミー -> cpu_back_right [147.6] -> master shield -> ボムゾウ@cpu_front_left [88.3] -> end turn [-159.1]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 5/0 / hand player/cpu 4/4
     - metrics: HP 9/8, stones 5/0, boardValue 390/690, ready 2/1, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤミー Lv1 HP5 prep | cpu_front_left:CF:ボムゾウ Lv2 HP2 act1/1 shield | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:鉄拳シグマ Lv2 HP6 act0/1
2. terminal -1.6 (+217.4) / guide 1599.8
   - actions: 鉄拳シグマ attack -> cpu master [557.1] -> magic パワーアップ -> モーガン@player_front_left [776.9] -> モーガン arc_drive -> ピグミィ [247.3] -> summon ヤンバル -> player_back_right [137.4] -> end turn [-119]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/6 / hand player/cpu 3/5
   - metrics: HP 9/8, stones 0/6, boardValue 630/550, ready 0/3, shield 0/0, Lv2+ 2/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv2 HP4 act1/1 | player_front_right:PF:鉄拳シグマ Lv2 HP6 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 prep
   - opponent response: terminal -58.2 (-56.6)
     - actions: master master_attack -> モーガン@player_front_left [305.3] -> ボムゾウ self_bomb -> モーガン [482.6] -> focus ドノマンティス [155] -> summon ヤミー -> cpu_back_right [117.8] -> master shield -> ボムゾウ@cpu_front_left [51.6] -> end turn [-290.1]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 5/0 / hand player/cpu 4/4
     - metrics: HP 9/8, stones 5/0, boardValue 390/690, ready 2/1, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤミー Lv1 HP5 prep | cpu_front_left:CF:ボムゾウ Lv2 HP2 act1/1 shield | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:鉄拳シグマ Lv2 HP6 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1
3. terminal -1.6 (+217.4) / guide 1798.8
   - actions: 鉄拳シグマ attack -> cpu master [557.1] -> magic パワーアップ -> モーガン@player_front_left [776.9] -> summon ヤンバル -> player_back_left [197.6] -> モーガン arc_drive -> ピグミィ [386.1] -> end turn [-119]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/6 / hand player/cpu 3/5
   - metrics: HP 9/8, stones 0/6, boardValue 630/550, ready 0/3, shield 0/0, Lv2+ 2/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv2 HP4 act1/1 | player_front_right:PF:鉄拳シグマ Lv2 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 prep
   - opponent response: terminal -96.2 (-94.6)
     - actions: master master_attack -> モーガン@player_front_left [312.4] -> ボムゾウ self_bomb -> モーガン [495.8] -> focus ドノマンティス [163.4] -> summon ヤミー -> cpu_back_right [147.6] -> master shield -> ボムゾウ@cpu_front_left [88.3] -> end turn [-159.1]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 5/0 / hand player/cpu 4/4
     - metrics: HP 9/8, stones 5/0, boardValue 390/690, ready 2/1, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤミー Lv1 HP5 prep | cpu_front_left:CF:ボムゾウ Lv2 HP2 act1/1 shield | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:鉄拳シグマ Lv2 HP6 act0/1

