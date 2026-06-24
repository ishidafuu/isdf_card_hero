# White AI Terminal Plan Audit

生成: 2026-06-24T06:56:38.496Z
デッキ: `submission-pro-with-rare8-white-1339` vs `submission-pro-no-rare8-white-1377`
seedStart: 56000, maxSeeds: 40
search: depth 4, width 4, detailed 4
beamWidth: 3, maxActions: 8

## Summary

- selected top1: 0/6
- selected average rank: 64.5
- average gap to best: 61.8
- max gap to best: 139

## Method

- 実戦途中の白同士局面から、現行AI評価の上位候補を幅 `beamWidth` で拾い、各手順をエンドターンまで進めた。
- `terminal` は、相手ターン開始後の盤面を白AI重みの `evaluateState` で評価した値。`guide` は現行AIの局所評価合計で、terminalとは別物。
- この監査は勝率ではなく、現行AIの選択手順と「相手へ渡す最終盤面」のズレを見るためのもの。

## Conclusion

- 現行AIの選択手順が終端盤面1位だった局面は 0/6。
- 平均ギャップは 61.8 点。80点以上のズレは 2/6。
- 現行選択はシールド 5/6、フォーカス 4/6 を含む。一方、終端1位はシールド 0/6、フォーカス 0/6。
- 勝率ベンチを増やす前に、ズレが大きい局面の手順評価を読み、追加行動の局所加点より終端盤面の石・行動済み・レベルアップ成果を優先する候補を作る。

## Scenarios

### 1. seed 56000 turn 5 player

- step: 36
- state: turn 5 / current player / HP player/cpu 7/7 / stones player/cpu 5/0 / hand player/cpu 5/5
- initialScore: -539
- selectedTerminalRank: 7
- terminalGapToBest: 16
- board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 shield | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act1/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1

#### Selected plan

1. terminal -469 (+70) / guide 572.4
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [134.2] -> ヤミー attack -> 真勇者ダイン [152.4] -> master shield -> ヤミー@player_front_left [63] -> end turn [-52.4]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 0/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 0/3, boardValue 170/750, ready 0/4, shield 1/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP2 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 shield

#### Top terminal plans

1. terminal -453 (+86) / guide 378.2
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [134.2] -> end turn [-31.2]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 2/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 2/3, boardValue 150/770, ready 1/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act0/1 focus
2. terminal -453 (+86) / guide 359.7
   - actions: summon ヤミー -> player_front_right [252.2] -> master wake_up -> ヤミー@player_front_right [138.8] -> end turn [-31.2]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 2/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 2/3, boardValue 150/770, ready 1/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_right:PF:ヤミー Lv1 HP5 act0/1 focus
3. terminal -463 (+76) / guide 546.7
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [134.2] -> focus ヤミー [129.4] -> master shield -> ヤミー@player_front_left [60.4] -> end turn [-52.4]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 0/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 0/3, boardValue 170/770, ready 0/4, shield 1/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 shield,focus
4. terminal -463 (+76) / guide 528.3
   - actions: summon ヤミー -> player_front_right [252.2] -> master wake_up -> ヤミー@player_front_right [138.8] -> focus ヤミー [129.4] -> master shield -> ヤミー@player_front_right [60.4] -> end turn [-52.4]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 0/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 0/3, boardValue 170/770, ready 0/4, shield 1/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_right:PF:ヤミー Lv1 HP5 act1/1 shield,focus
5. terminal -465 (+74) / guide 486.3
   - actions: summon ヤミー -> player_front_left [275.2] -> master wake_up -> ヤミー@player_front_left [134.2] -> focus ヤミー [129.4] -> end turn [-52.4]
   - final: turn 5 / current cpu / HP player/cpu 7/7 / stones player/cpu 2/3 / hand player/cpu 4/6
   - metrics: HP 7/7, stones 2/3, boardValue 150/770, ready 0/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act0/1 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 focus

### 2. seed 56001 turn 5 player

- step: 51
- state: turn 5 / current player / HP player/cpu 9/10 / stones player/cpu 3/0 / hand player/cpu 3/3
- initialScore: 151
- selectedTerminalRank: 14
- terminalGapToBest: 22
- board: cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 focus | cpu_front_left:CF:ヤミー Lv1 HP5 act1/1 shield,focus | player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1 | player_back_left:PB:デスシープ Lv1 HP6 act0/1 | player_back_right:PB:ピグミィ Lv1 HP3 act0/2

#### Selected plan

1. terminal 223 (+72) / guide 575.5
   - actions: デスシープ attack -> cpu master [221.8] -> focus 真勇者ダイン [145.9] -> focus ピグミィ [97.2] -> focus デスシープ [88] -> master shield -> デスシープ@player_front_left [66] -> end turn [-43.4]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 1/4 / hand player/cpu 3/4
   - metrics: HP 9/9, stones 1/4, boardValue 720/380, ready 1/2, shield 1/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv2 HP6 act1/1 shield | player_front_right:PF:真勇者ダイン Lv1 HP5 act1/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus

#### Top terminal plans

1. terminal 245 (+94) / guide 239.6
   - actions: デスシープ attack -> cpu master [221.8] -> end turn [17.8]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 3/4 / hand player/cpu 3/4
   - metrics: HP 9/9, stones 3/4, boardValue 700/380, ready 3/2, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
2. terminal 245 (+94) / guide 323.5
   - actions: デスシープ attack -> cpu master [221.8] -> focus ピグミィ [101.8] -> end turn [-0.2]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 3/4 / hand player/cpu 3/4
   - metrics: HP 9/9, stones 3/4, boardValue 700/380, ready 3/2, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
3. terminal 233 (+82) / guide 322.7
   - actions: デスシープ attack -> cpu master [221.8] -> focus デスシープ [101] -> end turn [-0.2]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 3/4 / hand player/cpu 3/4
   - metrics: HP 9/9, stones 3/4, boardValue 700/380, ready 2/2, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act0/2 focus
4. terminal 233 (+82) / guide 401.9
   - actions: デスシープ attack -> cpu master [221.8] -> focus デスシープ [101] -> focus ピグミィ [97.2] -> end turn [-18.2]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 3/4 / hand player/cpu 3/4
   - metrics: HP 9/9, stones 3/4, boardValue 700/380, ready 2/2, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus
5. terminal 233 (+82) / guide 401.9
   - actions: デスシープ attack -> cpu master [221.8] -> focus ピグミィ [101.8] -> focus デスシープ [96.4] -> end turn [-18.2]
   - final: turn 5 / current cpu / HP player/cpu 9/9 / stones player/cpu 3/4 / hand player/cpu 3/4
   - metrics: HP 9/9, stones 3/4, boardValue 700/380, ready 2/2, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 act1/2 focus

### 3. seed 56002 turn 5 player

- step: 42
- state: turn 5 / current player / HP player/cpu 8/9 / stones player/cpu 5/0 / hand player/cpu 4/4
- initialScore: -101
- selectedTerminalRank: 229
- terminalGapToBest: 139
- board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 shield | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ドノマンティス Lv1 HP5 act1/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act1/1 | player_front_left:PF:真勇者ダイン Lv1 HP5 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP4 act0/1 focus | player_back_left:PB:モーガン Lv2 HP4 act0/1

#### Selected plan

1. terminal 28 (+129) / guide 1196.1
   - actions: モーガン arc_drive -> cpu master [300.7] -> summon ヤンバル -> player_back_right [239.5] -> focus 真勇者ダイン [195.5] -> 鉄拳シグマ attack -> ボムゾウ [153.9] -> master wake_up -> ヤンバル@player_back_right [165.2] -> ヤンバル wild_claw -> ドノマンティス [114.1] -> master shield -> 真勇者ダイン@player_front_left [73.1] -> end turn [-46]
   - final: turn 5 / current cpu / HP player/cpu 8/8 / stones player/cpu 0/4 / hand player/cpu 3/5
   - metrics: HP 8/8, stones 0/4, boardValue 680/540, ready 0/4, shield 1/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ドノマンティス Lv1 HP3 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP3 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP5 act1/1 shield,focus | player_front_right:PF:鉄拳シグマ Lv1 HP4 act1/1 | player_back_left:PB:モーガン Lv2 HP4 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1

#### Top terminal plans

1. terminal 167 (+268) / guide 855.3
   - actions: summon ヤンバル -> player_back_right [183.2] -> master wake_up -> ヤンバル@player_back_right [254.1] -> モーガン arc_drive -> ドノマンティス [9.3] -> 真勇者ダイン ダイン斬り -> ドノマンティス [388.7] -> end turn [19.9]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 1/4 / hand player/cpu 3/5
   - metrics: HP 8/9, stones 1/4, boardValue 770/430, ready 2/3, shield 0/0, Lv2+ 2/0
   - board: cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP4 act0/1 focus | player_back_left:PB:モーガン Lv2 HP4 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus
2. terminal 161 (+262) / guide 882.6
   - actions: summon ヤンバル -> player_back_right [183.2] -> master wake_up -> ヤンバル@player_back_right [254.1] -> モーガン arc_drive -> ドノマンティス [9.3] -> ヤンバル wild_claw -> ドノマンティス [388.7] -> end turn [47.2]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 1/4 / hand player/cpu 3/5
   - metrics: HP 8/9, stones 1/4, boardValue 760/430, ready 2/3, shield 0/0, Lv2+ 2/0
   - board: cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP5 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP4 act0/1 focus | player_back_left:PB:モーガン Lv2 HP4 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1
3. terminal 155 (+256) / guide 896
   - actions: summon ヤンバル -> player_back_right [183.2] -> master wake_up -> ヤンバル@player_back_right [254.1] -> モーガン arc_drive -> ドノマンティス [9.3] -> 真勇者ダイン ダイン斬り -> ドノマンティス [388.7] -> focus ヤンバル [58.7] -> end turn [1.9]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 1/4 / hand player/cpu 3/5
   - metrics: HP 8/9, stones 1/4, boardValue 770/430, ready 1/3, shield 0/0, Lv2+ 2/0
   - board: cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP4 act0/1 focus | player_back_left:PB:モーガン Lv2 HP4 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 focus
4. terminal 149 (+250) / guide 952
   - actions: summon ヤンバル -> player_back_right [183.2] -> master wake_up -> ヤンバル@player_back_right [254.1] -> モーガン arc_drive -> ドノマンティス [9.3] -> ヤンバル wild_claw -> ドノマンティス [388.7] -> focus 真勇者ダイン [114.7] -> end turn [1.9]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 1/4 / hand player/cpu 3/5
   - metrics: HP 8/9, stones 1/4, boardValue 760/430, ready 1/3, shield 0/0, Lv2+ 2/0
   - board: cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP5 act1/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP4 act0/1 focus | player_back_left:PB:モーガン Lv2 HP4 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1
5. terminal 149 (+250) / guide 958
   - actions: summon ヤンバル -> player_back_right [183.2] -> master wake_up -> ヤンバル@player_back_right [254.1] -> モーガン arc_drive -> ドノマンティス [9.3] -> 真勇者ダイン ダイン斬り -> ドノマンティス [388.7] -> ヤンバル wild_claw -> ボムゾウ [120.7] -> end turn [1.9]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 1/4 / hand player/cpu 3/5
   - metrics: HP 8/9, stones 1/4, boardValue 770/410, ready 1/3, shield 0/0, Lv2+ 2/0
   - board: cpu_back_right:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ボムゾウ Lv1 HP3 act0/1 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP4 act0/1 focus | player_back_left:PB:モーガン Lv2 HP4 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1

### 4. seed 56003 turn 5 player

- step: 47
- state: turn 5 / current player / HP player/cpu 10/9 / stones player/cpu 6/1 / hand player/cpu 4/4
- initialScore: -197
- selectedTerminalRank: 12
- terminalGapToBest: 135
- board: cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:ヤンバル Lv1 HP3 act1/1 | cpu_front_right:CF:ヤミー Lv2 HP5 act1/1 | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 focus

#### Selected plan

1. terminal 196 (+393) / guide 2098.4
   - actions: summon モーガン -> player_back_left [379.6] -> master wake_up -> モーガン@player_back_left [320.9] -> モーガン arc_drive -> ヤンバル [298.3] -> ヤンバル wild_claw -> ヤンバル [343.5] -> ポリスピナー attack -> ヤミー [193] -> ポリスピナー attack -> ヤミー [609.1] -> end turn [-46]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 0/7 / hand player/cpu 2/5
   - metrics: HP 10/9, stones 0/7, boardValue 700/360, ready 0/2, shield 0/0, Lv2+ 2/1
   - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:ヤンバル Lv2 HP3 act1/1 | player_front_right:PF:エルスピナー Lv3 HP3 act2/2 | player_back_left:PB:モーガン Lv1 HP4 act1/1

#### Top terminal plans

1. terminal 331 (+528) / guide 2833.6
   - actions: move ヤンバル player_front_left->player_back_right [298.8] -> summon モーガン -> player_back_left [325.9] -> master wake_up -> モーガン@player_back_left [308.6] -> モーガン arc_drive -> ヤミー [324] -> ポリスピナー attack -> ヤミー [467.5] -> エルスピナー ヒートブレード -> cpu master [1150.8] -> end turn [-42]
   - final: turn 5 / current cpu / HP player/cpu 10/6 / stones player/cpu 1/9 / hand player/cpu 2/5
   - metrics: HP 10/6, stones 1/9, boardValue 600/490, ready 0/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:エルスピナー Lv3 HP3 act2/2 | player_back_left:PB:モーガン Lv1 HP4 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
2. terminal 331 (+528) / guide 2886.5
   - actions: summon モーガン -> player_back_left [379.6] -> master wake_up -> モーガン@player_back_left [320.9] -> move ヤンバル player_front_left->player_back_right [285.7] -> モーガン arc_drive -> ヤミー [324] -> ポリスピナー attack -> ヤミー [467.5] -> エルスピナー ヒートブレード -> cpu master [1150.8] -> end turn [-42]
   - final: turn 5 / current cpu / HP player/cpu 10/6 / stones player/cpu 1/9 / hand player/cpu 2/5
   - metrics: HP 10/6, stones 1/9, boardValue 600/490, ready 0/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:エルスピナー Lv3 HP3 act2/2 | player_back_left:PB:モーガン Lv1 HP4 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
3. terminal 331 (+528) / guide 2900.8
   - actions: summon モーガン -> player_back_left [379.6] -> move ヤンバル player_front_left->player_back_right [312.4] -> master wake_up -> モーガン@player_back_left [308.6] -> モーガン arc_drive -> ヤミー [324] -> ポリスピナー attack -> ヤミー [467.5] -> エルスピナー ヒートブレード -> cpu master [1150.8] -> end turn [-42]
   - final: turn 5 / current cpu / HP player/cpu 10/6 / stones player/cpu 1/9 / hand player/cpu 2/5
   - metrics: HP 10/6, stones 1/9, boardValue 600/490, ready 0/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:エルスピナー Lv3 HP3 act2/2 | player_back_left:PB:モーガン Lv1 HP4 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
4. terminal 331 (+528) / guide 2865.3
   - actions: summon モーガン -> player_back_right [379.6] -> move ヤンバル player_front_left->player_back_left [264.6] -> master wake_up -> モーガン@player_back_right [320.9] -> モーガン arc_drive -> ヤミー [324] -> ポリスピナー attack -> ヤミー [467.5] -> エルスピナー ヒートブレード -> cpu master [1150.8] -> end turn [-42]
   - final: turn 5 / current cpu / HP player/cpu 10/6 / stones player/cpu 1/9 / hand player/cpu 2/5
   - metrics: HP 10/6, stones 1/9, boardValue 600/490, ready 0/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:エルスピナー Lv3 HP3 act2/2 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:モーガン Lv1 HP4 act1/1
5. terminal 327 (+524) / guide 2804.9
   - actions: summon モーガン -> player_back_right [379.6] -> master wake_up -> モーガン@player_back_right [320.9] -> モーガン arc_drive -> ヤンバル [298.3] -> ヤンバル wild_claw -> ヤミー [281.1] -> ポリスピナー attack -> ヤミー [416.5] -> エルスピナー ヒートブレード -> cpu master [1150.8] -> end turn [-42.3]
   - final: turn 5 / current cpu / HP player/cpu 10/6 / stones player/cpu 1/9 / hand player/cpu 2/5
   - metrics: HP 10/6, stones 1/9, boardValue 600/470, ready 0/3, shield 0/0, Lv2+ 1/1
   - board: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP1 act0/1 | player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:エルスピナー Lv3 HP3 act2/2 | player_back_right:PB:モーガン Lv1 HP4 act1/1

### 5. seed 56004 turn 5 player

- step: 46
- state: turn 5 / current player / HP player/cpu 8/10 / stones player/cpu 5/2 / hand player/cpu 5/3
- initialScore: 3
- selectedTerminalRank: 107
- terminalGapToBest: 34
- board: cpu_back_left:CB:ボムゾウ Lv1 HP6 act1/1 | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:ボムゾウ Lv1 HP3 act1/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act1/1 shield | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1

#### Selected plan

1. terminal 12 (+9) / guide 730.9
   - actions: デスシープ attack -> ボムゾウ [329.6] -> ヤンバル wild_claw -> ボムゾウ [382.9] -> focus ヤンバル [32] -> 鉄拳シグマ attack -> ヤミー [17.3] -> master shield -> 鉄拳シグマ@player_front_right [64.2] -> end turn [-95]
   - final: turn 5 / current cpu / HP player/cpu 8/10 / stones player/cpu 2/6 / hand player/cpu 5/4
   - metrics: HP 8/10, stones 2/6, boardValue 700/430, ready 0/3, shield 1/0, Lv2+ 1/0
   - board: cpu_back_right:CB:ポリスピナー Lv1 HP3 act0/2 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP4 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 shield | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 focus

#### Top terminal plans

1. terminal 46 (+43) / guide 647.2
   - actions: ヤンバル wild_claw -> ボムゾウ [329] -> ヤンバル wild_claw -> ボムゾウ [383.5] -> end turn [-65.2]
   - final: turn 5 / current cpu / HP player/cpu 8/10 / stones player/cpu 4/6 / hand player/cpu 5/4
   - metrics: HP 8/10, stones 4/6, boardValue 680/440, ready 2/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_right:CB:ポリスピナー Lv1 HP3 act0/2 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1
2. terminal 46 (+43) / guide 637.4
   - actions: ヤンバル wild_claw -> ボムゾウ [329] -> デスシープ attack -> ボムゾウ [383.5] -> end turn [-75]
   - final: turn 5 / current cpu / HP player/cpu 8/10 / stones player/cpu 4/6 / hand player/cpu 5/4
   - metrics: HP 8/10, stones 4/6, boardValue 680/440, ready 2/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_right:CB:ポリスピナー Lv1 HP3 act0/2 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus
3. terminal 46 (+43) / guide 647.2
   - actions: ヤンバル wild_claw -> ボムゾウ [329] -> ヤンバル wild_claw -> ボムゾウ [383.5] -> end turn [-65.2]
   - final: turn 5 / current cpu / HP player/cpu 8/10 / stones player/cpu 4/6 / hand player/cpu 5/4
   - metrics: HP 8/10, stones 4/6, boardValue 680/440, ready 2/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_right:CB:ポリスピナー Lv1 HP3 act0/2 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
4. terminal 46 (+43) / guide 637.4
   - actions: ヤンバル wild_claw -> ボムゾウ [329] -> デスシープ attack -> ボムゾウ [383.5] -> end turn [-75]
   - final: turn 5 / current cpu / HP player/cpu 8/10 / stones player/cpu 4/6 / hand player/cpu 5/4
   - metrics: HP 8/10, stones 4/6, boardValue 680/440, ready 2/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_right:CB:ポリスピナー Lv1 HP3 act0/2 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
5. terminal 46 (+43) / guide 637.4
   - actions: デスシープ attack -> ボムゾウ [329.6] -> ヤンバル wild_claw -> ボムゾウ [382.9] -> end turn [-75]
   - final: turn 5 / current cpu / HP player/cpu 8/10 / stones player/cpu 4/6 / hand player/cpu 5/4
   - metrics: HP 8/10, stones 4/6, boardValue 680/440, ready 2/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_right:CB:ポリスピナー Lv1 HP3 act0/2 | cpu_front_left:CF:ボムゾウ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤミー Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus

### 6. seed 56005 turn 5 player

- step: 38
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 5/2 / hand player/cpu 5/5
- initialScore: -3
- selectedTerminalRank: 18
- terminalGapToBest: 25
- board: cpu_back_left:CB:ヤミー Lv1 HP5 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 shield | cpu_front_right:CF:ボムゾウ Lv1 HP5 act1/1 focus | player_front_left:PF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 | player_back_left:PB:ヤミー Lv1 HP5 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus

#### Selected plan

1. terminal -21 (-18) / guide 304.3
   - actions: 鉄拳シグマ attack -> ボムゾウ [147.8] -> focus デスシープ [101.2] -> master master_attack -> ボムゾウ@cpu_front_right [20.2] -> master shield -> デスシープ@player_front_left [69.1] -> end turn [-34]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/5 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 0/5, boardValue 620/600, ready 2/4, shield 1/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ヤミー Lv1 HP5 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 shield,focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 | player_back_left:PB:ヤミー Lv1 HP5 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus

#### Top terminal plans

1. terminal 4 (+7) / guide 0.8
   - actions: end turn [0.8]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/5 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 5/5, boardValue 600/620, ready 4/4, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ヤミー Lv1 HP5 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤミー Lv1 HP5 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus
2. terminal -8 (-5) / guide 137
   - actions: 鉄拳シグマ attack -> ボムゾウ [147.8] -> end turn [-10.8]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/5 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 5/5, boardValue 600/620, ready 3/4, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ヤミー Lv1 HP5 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 | player_back_left:PB:ヤミー Lv1 HP5 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus
3. terminal -8 (-5) / guide 118.3
   - actions: focus デスシープ [138.7] -> end turn [-20.4]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/5 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 5/5, boardValue 600/620, ready 3/4, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ヤミー Lv1 HP5 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:ヤミー Lv1 HP5 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus
4. terminal -8 (-5) / guide 53.9
   - actions: focus 鉄拳シグマ [71.1] -> end turn [-17.2]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/5 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 5/5, boardValue 600/620, ready 3/4, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ヤミー Lv1 HP5 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP5 act0/1 focus | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 focus | player_back_left:PB:ヤミー Lv1 HP5 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus
5. terminal -11 (-8) / guide 165.8
   - actions: 鉄拳シグマ attack -> ボムゾウ [147.8] -> master master_attack -> ボムゾウ@cpu_front_right [28.8] -> end turn [-10.8]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 2/5 / hand player/cpu 5/6
   - metrics: HP 10/10, stones 2/5, boardValue 600/600, ready 3/4, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ヤミー Lv1 HP5 act0/1 focus | cpu_back_right:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ボムゾウ Lv1 HP3 act0/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 | player_back_left:PB:ヤミー Lv1 HP5 act0/1 focus | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 focus

