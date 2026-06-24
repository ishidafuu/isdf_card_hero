# White AI Terminal Plan Audit

生成: 2026-06-24T07:35:12.915Z
デッキ: `submission-pro-with-rare8-white-1339` vs `submission-pro-no-rare8-white-1377`
seedStart: 56000, maxSeeds: 40
search: depth 4, width 4, detailed 4
terminalPlan: depth 6, width 2, weight 2
beamWidth: 3, maxActions: 8

## Summary

- selected top1: 0/6
- selected average rank: 58
- average gap to best: 21.3
- max gap to best: 40

## Method

- 実戦途中の白同士局面から、現行AI評価の上位候補を幅 `beamWidth` で拾い、各手順をエンドターンまで進めた。
- `terminal` は、相手ターン開始後の盤面を白AI重みの `evaluateState` で評価した値。`guide` は現行AIの局所評価合計で、terminalとは別物。
- この監査は勝率ではなく、現行AIの選択手順と「相手へ渡す最終盤面」のズレを見るためのもの。

## Conclusion

- 現行AIの選択手順が終端盤面1位だった局面は 0/6。
- 平均ギャップは 21.3 点。80点以上のズレは 0/6。
- 現行選択はシールド 5/6、フォーカス 3/6 を含む。一方、終端1位はシールド 0/6、フォーカス 0/6。
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

1. terminal -469 (+70) / guide 346.5
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [134.2] -> ヤミー attack -> 真勇者ダイン [74.4] -> master shield -> ヤミー@player_front_left [-15] -> end turn [-122.3]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 0/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 0/3, boardValue 170/750, ready 0/4, shield 1/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP2 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 shield

#### Top terminal plans

1. terminal -453 (+86) / guide 393.3
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [134.2] -> end turn [-16.1]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 2/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 2/3, boardValue 150/770, ready 1/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act0/1 focus
2. terminal -453 (+86) / guide 374.8
   - actions: summon ヤミー -> player_front_right [252.2] -> master wake_up -> ヤミー@player_front_right [138.8] -> end turn [-16.1]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 2/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 2/3, boardValue 150/770, ready 1/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_right:PF:ヤミー Lv1 HP5 act0/1 focus
3. terminal -463 (+76) / guide 335.5
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [134.2] -> focus ヤミー [63.4] -> master shield -> ヤミー@player_front_left [-17.6] -> end turn [-119.6]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 0/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 0/3, boardValue 170/770, ready 0/4, shield 1/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 shield,focus
4. terminal -463 (+76) / guide 317
   - actions: summon ヤミー -> player_front_right [252.2] -> master wake_up -> ヤミー@player_front_right [138.8] -> focus ヤミー [63.4] -> master shield -> ヤミー@player_front_right [-17.6] -> end turn [-119.6]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 0/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 0/3, boardValue 170/770, ready 0/4, shield 1/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_right:PF:ヤミー Lv1 HP5 act1/1 shield,focus
5. terminal -465 (+74) / guide 348.1
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [134.2] -> focus ヤミー [63.4] -> end turn [-124.7]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 2/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 2/3, boardValue 150/770, ready 0/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 focus

### 2. seed 56001 turn 5 player

- step: 52
- state: turn 5 / current player / HP player/cpu 9/10 / stones player/cpu 3/1 / hand player/cpu 3/3
- initialScore: 207
- selectedTerminalRank: 22
- terminalGapToBest: 22
- board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act1/1 shield,focus | player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2

#### Selected plan

1. terminal 279 (+72) / guide 375.9
   - actions: デスシープ attack -> cpu master [221.8] -> focus 真勇者ダイン [121.9] -> focus ピグミィ [85.7] -> focus デスシープ [35.2] -> master shield -> デスシープ@player_front_left [12] -> end turn [-100.7]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 1/5 / hand player/cpu 3/4
   - metrics: HP 9/9, stones 1/5, boardValue 720/280, ready 1/2, shield 1/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv2 HP6 act1/1 shield | player_front_right:PF:真勇者ダイン Lv1 HP5 act1/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus

#### Top terminal plans

1. terminal 301 (+94) / guide 286.2
   - actions: デスシープ attack -> cpu master [221.8] -> end turn [64.3]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 3/5 / hand player/cpu 3/4
   - metrics: HP 9/9, stones 3/5, boardValue 700/280, ready 3/2, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
2. terminal 301 (+94) / guide 358.4
   - actions: デスシープ attack -> cpu master [221.8] -> focus ピグミィ [90.3] -> end turn [46.3]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 3/5 / hand player/cpu 3/4
   - metrics: HP 9/9, stones 3/5, boardValue 700/280, ready 3/2, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
3. terminal 301 (+94) / guide 224.9
   - actions: focus ピグミィ [-46] -> デスシープ attack -> cpu master [224.6] -> end turn [46.3]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 3/5 / hand player/cpu 3/4
   - metrics: HP 9/9, stones 3/5, boardValue 700/280, ready 3/2, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
4. terminal 289 (+82) / guide 334.4
   - actions: デスシープ attack -> cpu master [221.8] -> focus デスシープ [66.3] -> end turn [46.3]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 3/5 / hand player/cpu 3/4
   - metrics: HP 9/9, stones 3/5, boardValue 700/280, ready 2/2, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
5. terminal 289 (+82) / guide 380.1
   - actions: デスシープ attack -> cpu master [221.8] -> focus デスシープ [66.3] -> focus ピグミィ [85.7] -> end turn [6.3]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 3/5 / hand player/cpu 3/4
   - metrics: HP 9/9, stones 3/5, boardValue 700/280, ready 2/2, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus

### 3. seed 56002 turn 5 player

- step: 38
- state: turn 5 / current player / HP player/cpu 10/8 / stones player/cpu 5/1 / hand player/cpu 4/5
- initialScore: -116
- selectedTerminalRank: 265
- terminalGapToBest: 40
- board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ドノマンティス Lv1 HP4 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act1/1 focus | player_front_left:PF:モーガン Lv1 HP4 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1

#### Selected plan

1. terminal -32 (+84) / guide 723.2
   - actions: summon ヤンバル -> player_back_left [249.2] -> focus モーガン [204.9] -> 鉄拳シグマ attack -> ボムゾウ [199] -> master wake_up -> ヤンバル@player_back_left [145.7] -> ヤンバル wild_claw -> ボムゾウ [68.4] -> master shield -> モーガン@player_front_left [-17.1] -> end turn [-127]
   - final: turn 5 / current cpu / HP player/cpu 10/8 / stones player/cpu 0/4 / hand player/cpu 3/6
   - metrics: HP 10/8, stones 0/4, boardValue 450/670, ready 0/4, shield 1/0, Lv2+ 0/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ドノマンティス Lv1 HP4 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP3 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv1 HP4 act1/1 shield,focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1

#### Top terminal plans

1. terminal 8 (+124) / guide 507.2
   - actions: summon ヤンバル -> player_back_left [249.2] -> master wake_up -> ヤンバル@player_back_left [188.5] -> end turn [69.5]
   - final: turn 5 / current cpu / HP player/cpu 10/8 / stones player/cpu 2/4 / hand player/cpu 3/6
   - metrics: HP 10/8, stones 2/4, boardValue 430/690, ready 3/4, shield 0/0, Lv2+ 0/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ドノマンティス Lv1 HP4 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 focus | player_front_left:PF:モーガン Lv1 HP4 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus
2. terminal 8 (+124) / guide 489.3
   - actions: summon ヤンバル -> player_back_right [240.5] -> master wake_up -> ヤンバル@player_back_right [179.3] -> end turn [69.5]
   - final: turn 5 / current cpu / HP player/cpu 10/8 / stones player/cpu 2/4 / hand player/cpu 3/6
   - metrics: HP 10/8, stones 2/4, boardValue 430/690, ready 3/4, shield 0/0, Lv2+ 0/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ドノマンティス Lv1 HP4 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 focus | player_front_left:PF:モーガン Lv1 HP4 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus
3. terminal -4 (+112) / guide 681.1
   - actions: 鉄拳シグマ attack -> ボムゾウ [223.4] -> summon ヤンバル -> player_back_left [245.5] -> master wake_up -> ヤンバル@player_back_left [179.9] -> end turn [32.3]
   - final: turn 5 / current cpu / HP player/cpu 10/8 / stones player/cpu 2/4 / hand player/cpu 3/6
   - metrics: HP 10/8, stones 2/4, boardValue 430/690, ready 2/4, shield 0/0, Lv2+ 0/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ドノマンティス Lv1 HP4 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv1 HP4 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus
4. terminal -4 (+112) / guide 665
   - actions: 鉄拳シグマ attack -> ボムゾウ [223.4] -> summon ヤンバル -> player_back_right [241.3] -> master wake_up -> ヤンバル@player_back_right [168] -> end turn [32.3]
   - final: turn 5 / current cpu / HP player/cpu 10/8 / stones player/cpu 2/4 / hand player/cpu 3/6
   - metrics: HP 10/8, stones 2/4, boardValue 430/690, ready 2/4, shield 0/0, Lv2+ 0/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ドノマンティス Lv1 HP4 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv1 HP4 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus
5. terminal -4 (+112) / guide 664.3
   - actions: summon ヤンバル -> player_back_left [249.2] -> 鉄拳シグマ attack -> ボムゾウ [202.8] -> master wake_up -> ヤンバル@player_back_left [179.9] -> end turn [32.3]
   - final: turn 5 / current cpu / HP player/cpu 10/8 / stones player/cpu 2/4 / hand player/cpu 3/6
   - metrics: HP 10/8, stones 2/4, boardValue 430/690, ready 2/4, shield 0/0, Lv2+ 0/1
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ドノマンティス Lv1 HP4 act0/1 focus | cpu_front_left:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv1 HP4 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus

### 4. seed 56003 turn 5 player

- step: 45
- state: turn 5 / current player / HP player/cpu 8/10 / stones player/cpu 4/1 / hand player/cpu 4/4
- initialScore: -150
- selectedTerminalRank: 20
- terminalGapToBest: 19
- board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ヤミー Lv1 HP3 act1/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 shield | player_front_left:PF:真勇者ダイン Lv1 HP5 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | player_back_right:PB:ポリスピナー Lv1 HP2 act0/2 focus

#### Selected plan

1. terminal 12 (+162) / guide 1072.9
   - actions: 真勇者ダイン ダイン斬り -> cpu master [301.5] -> 真勇者ダイン ダイン斬り -> ヤミー [328.1] -> ヤンバル wild_claw -> ヤミー [478.4] -> master shield -> 真勇者ダイン@player_front_left [95.1] -> end turn [-130.3]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 1/6 / hand player/cpu 4/5
   - metrics: HP 8/9, stones 1/6, boardValue 680/510, ready 1/3, shield 1/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ヤンバル Lv2 HP3 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP5 act1/1 shield | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ポリスピナー Lv1 HP2 act0/2 focus

#### Top terminal plans

1. terminal 31 (+181) / guide 588.4
   - actions: master master_attack -> ヤミー@cpu_front_left [165.7] -> 真勇者ダイン ダイン斬り -> ヤミー [329.3] -> 真勇者ダイン ダイン斬り -> cpu master [121] -> end turn [-27.7]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 0/6 / hand player/cpu 4/5
   - metrics: HP 8/9, stones 0/6, boardValue 670/510, ready 2/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ヤンバル Lv2 HP3 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP2 act0/2 focus
2. terminal 31 (+181) / guide 960.6
   - actions: master master_attack -> ヤミー@cpu_front_left [165.7] -> 真勇者ダイン ダイン斬り -> cpu master [352.5] -> 真勇者ダイン ダイン斬り -> ヤミー [470.1] -> end turn [-27.7]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 0/6 / hand player/cpu 4/5
   - metrics: HP 8/9, stones 0/6, boardValue 670/510, ready 2/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ヤンバル Lv2 HP3 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP2 act0/2 focus
3. terminal 25 (+175) / guide 603.7
   - actions: master master_attack -> ヤミー@cpu_front_left [165.7] -> ヤンバル wild_claw -> ヤミー [329.3] -> 真勇者ダイン ダイン斬り -> cpu master [113.4] -> end turn [-4.8]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 0/6 / hand player/cpu 4/5
   - metrics: HP 8/9, stones 0/6, boardValue 660/510, ready 2/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ヤンバル Lv2 HP3 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP5 act0/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ポリスピナー Lv1 HP2 act0/2 focus
4. terminal 25 (+175) / guide 983.5
   - actions: master master_attack -> ヤミー@cpu_front_left [165.7] -> 真勇者ダイン ダイン斬り -> cpu master [352.5] -> ヤンバル wild_claw -> ヤミー [470.1] -> end turn [-4.8]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 0/6 / hand player/cpu 4/5
   - metrics: HP 8/9, stones 0/6, boardValue 660/510, ready 2/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ヤンバル Lv2 HP3 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP5 act0/1 focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ポリスピナー Lv1 HP2 act0/2 focus
5. terminal 19 (+169) / guide 529
   - actions: master master_attack -> ヤミー@cpu_front_left [165.7] -> 真勇者ダイン ダイン斬り -> ヤミー [329.3] -> 真勇者ダイン ダイン斬り -> cpu master [121] -> focus ヤンバル [-6] -> end turn [-81.1]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 0/6 / hand player/cpu 4/5
   - metrics: HP 8/9, stones 0/6, boardValue 670/510, ready 1/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:ヤンバル Lv2 HP3 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ポリスピナー Lv1 HP2 act0/2 focus

### 5. seed 56004 turn 5 player

- step: 48
- state: turn 5 / current player / HP player/cpu 9/9 / stones player/cpu 4/1 / hand player/cpu 5/3
- initialScore: 29
- selectedTerminalRank: 16
- terminalGapToBest: 6
- board: cpu_back_left:CB:ポリスピナー Lv1 HP3 prep | cpu_back_right:CB:ボムゾウ Lv2 HP5 act1/1 | cpu_front_left:CF:ヤミー Lv1 HP5 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_left:PF:ヤンバル Lv2 HP3 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act0/1

#### Selected plan

1. terminal 272 (+243) / guide 2067
   - actions: ヤンバル wild_claw -> cpu master [463.3] -> summon モーガン -> player_back_left [432.8] -> ヤンバル wild_claw -> ボムゾウ [451.4] -> master wake_up -> モーガン@player_back_left [556.1] -> モーガン arc_drive -> ボムゾウ [454.9] -> 鉄拳シグマ attack -> 真勇者ダイン [-105.2] -> end turn [-186.2]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/7 / hand player/cpu 4/4
   - metrics: HP 9/8, stones 0/7, boardValue 860/430, ready 0/3, shield 0/0, Lv2+ 3/0
   - board: cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP5 act0/1 | player_front_left:PF:ヤンバル Lv2 HP3 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 | player_back_left:PB:モーガン Lv2 HP4 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1

#### Top terminal plans

1. terminal 278 (+249) / guide 2172.2
   - actions: ヤンバル wild_claw -> cpu master [463.3] -> summon モーガン -> player_back_left [432.8] -> ヤンバル wild_claw -> ボムゾウ [451.4] -> master wake_up -> モーガン@player_back_left [556.1] -> モーガン arc_drive -> ボムゾウ [454.9] -> end turn [-186.2]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/7 / hand player/cpu 4/4
   - metrics: HP 9/8, stones 0/7, boardValue 860/440, ready 1/3, shield 0/0, Lv2+ 3/0
   - board: cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_left:PF:ヤンバル Lv2 HP3 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:モーガン Lv2 HP4 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1
2. terminal 278 (+249) / guide 1880.8
   - actions: ヤンバル wild_claw -> cpu master [463.3] -> summon モーガン -> player_back_left [432.8] -> master wake_up -> モーガン@player_back_left [325.6] -> ヤンバル wild_claw -> ボムゾウ [390.5] -> モーガン arc_drive -> ボムゾウ [454.9] -> end turn [-186.2]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/7 / hand player/cpu 4/4
   - metrics: HP 9/8, stones 0/7, boardValue 860/440, ready 1/3, shield 0/0, Lv2+ 3/0
   - board: cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_left:PF:ヤンバル Lv2 HP3 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:モーガン Lv2 HP4 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1
3. terminal 278 (+249) / guide 2172.2
   - actions: ヤンバル wild_claw -> cpu master [463.3] -> summon モーガン -> player_back_left [432.8] -> ヤンバル wild_claw -> ボムゾウ [451.4] -> master wake_up -> モーガン@player_back_left [556.1] -> モーガン arc_drive -> ボムゾウ [454.9] -> end turn [-186.2]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/7 / hand player/cpu 4/4
   - metrics: HP 9/8, stones 0/7, boardValue 860/440, ready 1/3, shield 0/0, Lv2+ 3/0
   - board: cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_left:PF:ヤンバル Lv2 HP3 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:モーガン Lv2 HP4 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1
4. terminal 278 (+249) / guide 1880.8
   - actions: ヤンバル wild_claw -> cpu master [463.3] -> summon モーガン -> player_back_left [432.8] -> master wake_up -> モーガン@player_back_left [325.6] -> ヤンバル wild_claw -> ボムゾウ [390.5] -> モーガン arc_drive -> ボムゾウ [454.9] -> end turn [-186.2]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/7 / hand player/cpu 4/4
   - metrics: HP 9/8, stones 0/7, boardValue 860/440, ready 1/3, shield 0/0, Lv2+ 3/0
   - board: cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_left:PF:ヤンバル Lv2 HP3 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:モーガン Lv2 HP4 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1
5. terminal 278 (+249) / guide 2174.2
   - actions: summon モーガン -> player_back_left [455.8] -> ヤンバル wild_claw -> cpu master [442.2] -> ヤンバル wild_claw -> ボムゾウ [451.4] -> master wake_up -> モーガン@player_back_left [556.1] -> モーガン arc_drive -> ボムゾウ [454.9] -> end turn [-186.2]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/7 / hand player/cpu 4/4
   - metrics: HP 9/8, stones 0/7, boardValue 860/440, ready 1/3, shield 0/0, Lv2+ 3/0
   - board: cpu_back_left:CB:ポリスピナー Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_left:PF:ヤンバル Lv2 HP3 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:モーガン Lv2 HP4 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1

### 6. seed 56005 turn 5 player

- step: 38
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 5/2 / hand player/cpu 5/5
- initialScore: -3
- selectedTerminalRank: 18
- terminalGapToBest: 25
- board: cpu_back_left:CB:ヤミー Lv1 HP5 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 shield | cpu_front_right:CF:ボムゾウ Lv1 HP5 act1/1 focus | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 | player_back_left:PB:ヤミー Lv1 HP5 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus

#### Selected plan

1. terminal -21 (-18) / guide 63.6
   - actions: 鉄拳シグマ attack -> ボムゾウ [123.8] -> focus デスシープ [55.2] -> master master_attack -> ボムゾウ@cpu_front_right [-39.8] -> master shield -> デスシープ@player_front_left [15.1] -> end turn [-90.7]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/5 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 0/5, boardValue 620/600, ready 2/4, shield 1/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ヤミー Lv1 HP5 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 shield,focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 | player_back_left:PB:ヤミー Lv1 HP5 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus

#### Top terminal plans

1. terminal 4 (+7) / guide 70.2
   - actions: end turn [70.2]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/5 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 5/5, boardValue 600/620, ready 4/4, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ヤミー Lv1 HP5 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤミー Lv1 HP5 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus
2. terminal -8 (-5) / guide 141.7
   - actions: 鉄拳シグマ attack -> ボムゾウ [123.8] -> end turn [17.9]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/5 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 5/5, boardValue 600/620, ready 3/4, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ヤミー Lv1 HP5 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 | player_back_left:PB:ヤミー Lv1 HP5 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus
3. terminal -8 (-5) / guide 88.3
   - actions: focus デスシープ [114.7] -> end turn [-26.4]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/5 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 5/5, boardValue 600/620, ready 3/4, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ヤミー Lv1 HP5 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤミー Lv1 HP5 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus
4. terminal -8 (-5) / guide 70.1
   - actions: focus 鉄拳シグマ [47.1] -> end turn [23]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/5 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 5/5, boardValue 600/620, ready 3/4, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ヤミー Lv1 HP5 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 focus | player_back_left:PB:ヤミー Lv1 HP5 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus
5. terminal -11 (-8) / guide 139.4
   - actions: 鉄拳シグマ attack -> ボムゾウ [123.8] -> master master_attack -> ボムゾウ@cpu_front_right [0.8] -> end turn [14.9]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 2/5 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 2/5, boardValue 600/600, ready 3/4, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ヤミー Lv1 HP5 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 | player_back_left:PB:ヤミー Lv1 HP5 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus

