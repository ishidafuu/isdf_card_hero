# White AI Terminal Plan Audit

生成: 2026-06-26T13:49:00.374Z
デッキ: `submission-pro-with-rare8-white-1339` vs `submission-pro-no-rare8-white-1377`
seedStart: 72000, maxSeeds: 24
search: depth 4, width 4, detailed 4
terminalPlan: depth 6, width 2, weight 2
opponentTerminalPlan: depth 2, width 1, weight 0.35
beamWidth: 2, maxActions: 8, responseRankLimit: 8

## Summary

- selected top1: 0/6
- selected average rank: 16.5
- average gap to best: 34
- max gap to best: 88
- selected response top1: 0/6
- selected average response rank: 5.33
- average response gap to best: 54.6
- max response gap to best: 148.4

## Method

- 実戦途中の白同士局面から、現行AI評価の上位候補を幅 `beamWidth` で拾い、各手順をエンドターンまで進めた。
- `terminal` は、相手ターン開始後の盤面を白AI重みの `evaluateState` で評価した値。`guide` は現行AIの局所評価合計で、terminalとは別物。
- `opponent response` は、渡した盤面から相手AIが同じ軽量設定でエンドターンまで進めた後の盤面評価。勝率ではなく「渡した盤面が相手にどう返されるか」を見るための補助線。
- `response rank` は、終端評価上位 `responseRankLimit` 本と実選択手順を対象に、相手応答後の盤面評価で並べた順位。
- この監査は勝率ではなく、現行AIの選択手順と「相手へ渡す最終盤面」「相手から返る最終盤面」のズレを見るためのもの。

## Conclusion

- 現行AIの選択手順が終端盤面1位だった局面は 0/6。
- 平均ギャップは 34 点。80点以上のズレは 1/6。
- 相手応答後1位だった局面は 0/6。応答後平均ギャップは 54.6 点。80点以上のズレは 2/6。
- 現行選択はシールド 2/6、フォーカス 2/6 を含む。終端1位はシールド 0/6、フォーカス 0/6。応答後1位はシールド 2/6、フォーカス 1/6。
- 勝率ベンチを増やす前に、ズレが大きい局面の手順評価を読み、追加行動の局所加点より終端盤面の石・行動済み・レベルアップ成果を優先する候補を作る。

## Scenarios

### 1. seed 72000 turn 5 player

- step: 43
- state: turn 5 / current player / HP player/cpu 10/9 / stones player/cpu 4/0 / hand player/cpu 3/4
- initialScore: -87.2
- selectedTerminalRank: 8
- selectedResponseRank: 8
- terminalGapToBest: 24
- responseGapToBest: 47
- board: cpu_back_left:CB:ドノマンティス Lv1 HP5 prep | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act1/1 shield | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 | player_front_left:PF:モーガン Lv1 HP4 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP4 act0/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1

#### Selected plan

1. terminal -71.6 (+15.6) / response -189 (-117.4) / guide -204.1
   - actions: move モーガン player_front_left->player_back_right [247.4] -> summon ヤンバル -> player_back_left [151.4] -> 鉄拳シグマ attack -> 真勇者ダイン [-107.7] -> master shield -> 真勇者ダイン@player_front_left [-172.2] -> end turn [-322.9]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 1/3 / hand player/cpu 2/5
   - metrics: HP 10/9, stones 1/3, boardValue 590/790, ready 0/4, shield 1/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act0/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP5 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 shield | player_front_right:PF:鉄拳シグマ Lv1 HP4 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:モーガン Lv1 HP4 act1/1
   - opponent response: terminal -189 (-117.4)
     - actions: ヤンバル wild_claw -> 鉄拳シグマ [235.4] -> 真勇者ダイン ダイン斬り -> 鉄拳シグマ [761.6] -> end turn [-59.3]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 5/2 / hand player/cpu 3/5
     - metrics: HP 10/9, stones 5/2, boardValue 430/900, ready 3/2, shield 0/0, Lv2+ 0/2
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv3 HP6 act1/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:モーガン Lv1 HP4 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1

#### Top terminal plans

1. terminal -47.6 (+39.6) / response -177 (-129.4) / guide 138.2
   - actions: summon ヤンバル -> player_back_left [233.5] -> end turn [-95.3]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 3/3 / hand player/cpu 2/5
   - metrics: HP 10/9, stones 3/3, boardValue 570/800, ready 3/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act0/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act0/1 | player_front_left:PF:モーガン Lv1 HP4 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP4 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1 focus
   - opponent response: terminal -177 (-129.4)
     - actions: 真勇者ダイン ダイン斬り -> モーガン [220.1] -> ヤンバル wild_claw -> モーガン [696.8] -> end turn [44.9]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 7/2 / hand player/cpu 3/5
     - metrics: HP 10/9, stones 7/2, boardValue 430/900, ready 3/2, shield 0/0, Lv2+ 0/3
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act0/1 focus | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP4 act0/1 focus | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1 focus
2. terminal -49.6 (+37.6) / response -157 (-107.4) / guide 152.7
   - actions: move モーガン player_front_left->player_back_right [247.4] -> summon ヤンバル -> player_back_left [151.4] -> end turn [-246.1]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 3/3 / hand player/cpu 2/5
   - metrics: HP 10/9, stones 3/3, boardValue 570/800, ready 1/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act0/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP4 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:モーガン Lv1 HP4 act1/1
   - opponent response: terminal -157 (-107.4)
     - actions: 真勇者ダイン ダイン斬り -> 鉄拳シグマ [185.4] -> ヤンバル wild_claw -> 鉄拳シグマ [743.8] -> 真勇者ダイン ダイン斬り -> 真勇者ダイン [-61.1] -> focus ドノマンティス [-97.2] -> master shield -> 真勇者ダイン@cpu_front_left [-122] -> end turn [-264.2]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 7/0 / hand player/cpu 3/5
     - metrics: HP 10/9, stones 7/0, boardValue 400/920, ready 3/0, shield 0/1, Lv2+ 0/3
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act1/1 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act1/1 shield | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 | player_front_left:PF:真勇者ダイン Lv1 HP3 act0/1 | player_front_right:PF:モーガン Lv1 HP4 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1
3. terminal -59.6 (+27.6) / response -189 (-129.4) / guide -222.3
   - actions: move モーガン player_front_left->player_back_right [247.4] -> summon ヤンバル -> player_back_left [151.4] -> focus 鉄拳シグマ [-145.8] -> master shield -> 真勇者ダイン@player_front_left [-172.2] -> end turn [-303]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 1/3 / hand player/cpu 2/5
   - metrics: HP 10/9, stones 1/3, boardValue 590/800, ready 0/4, shield 1/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act0/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 shield | player_front_right:PF:鉄拳シグマ Lv1 HP4 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:モーガン Lv1 HP4 act1/1
   - opponent response: terminal -189 (-129.4)
     - actions: 真勇者ダイン ダイン斬り -> 鉄拳シグマ [175.3] -> ヤンバル wild_claw -> 鉄拳シグマ [700] -> end turn [-79.4]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 5/2 / hand player/cpu 3/5
     - metrics: HP 10/9, stones 5/2, boardValue 430/900, ready 3/2, shield 0/0, Lv2+ 0/3
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:モーガン Lv1 HP4 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1

#### Top response-adjusted plans

1. terminal -71.6 (+15.6) / response -142 (-70.4) / guide -54
   - actions: move モーガン player_front_left->player_back_right [247.4] -> 鉄拳シグマ attack -> 真勇者ダイン [91.9] -> summon ヤンバル -> player_back_left [89.1] -> master shield -> 鉄拳シグマ@player_front_right [-174.4] -> end turn [-308]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 1/3 / hand player/cpu 2/5
   - metrics: HP 10/9, stones 1/3, boardValue 590/790, ready 0/4, shield 1/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act0/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP5 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP4 act1/1 shield | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:モーガン Lv1 HP4 act1/1
   - opponent response: terminal -142 (-70.4)
     - actions: 真勇者ダイン ダイン斬り -> 真勇者ダイン [126] -> ヤンバル wild_claw -> 真勇者ダイン [69.4] -> master master_attack -> 真勇者ダイン@player_front_left [386.7] -> end turn [-12.1]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 5/0 / hand player/cpu 3/5
     - metrics: HP 10/9, stones 5/0, boardValue 410/790, ready 3/2, shield 0/0, Lv2+ 0/2
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP5 act0/1 focus | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP4 act0/1 | player_back_right:PB:モーガン Lv1 HP4 act0/1
2. terminal -59.6 (+27.6) / response -149 (-89.4) / guide -221.2
   - actions: move モーガン player_front_left->player_back_right [247.4] -> summon ヤンバル -> player_back_left [151.4] -> focus 鉄拳シグマ [-145.8] -> master shield -> 鉄拳シグマ@player_front_right [-171.2] -> end turn [-303]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 1/3 / hand player/cpu 2/5
   - metrics: HP 10/9, stones 1/3, boardValue 590/800, ready 0/4, shield 1/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act0/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP4 act1/1 shield,focus | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:モーガン Lv1 HP4 act1/1
   - opponent response: terminal -149 (-89.4)
     - actions: magic ワープ -> 真勇者ダイン@player_front_left [302.4] -> 真勇者ダイン ダイン斬り -> モーガン [132.6] -> ヤンバル wild_claw -> モーガン [553.9] -> end turn [-34.6]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 5/0 / hand player/cpu 3/4
     - metrics: HP 10/9, stones 5/0, boardValue 430/800, ready 3/2, shield 0/0, Lv2+ 0/2
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act0/1 focus | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP4 act0/1 focus | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1
3. terminal -49.6 (+37.6) / response -157 (-107.4) / guide 152.7
   - actions: move モーガン player_front_left->player_back_right [247.4] -> summon ヤンバル -> player_back_left [151.4] -> end turn [-246.1]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 3/3 / hand player/cpu 2/5
   - metrics: HP 10/9, stones 3/3, boardValue 570/800, ready 1/4, shield 0/0, Lv2+ 0/2
   - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act0/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act0/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP4 act0/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:モーガン Lv1 HP4 act1/1
   - opponent response: terminal -157 (-107.4)
     - actions: 真勇者ダイン ダイン斬り -> 鉄拳シグマ [185.4] -> ヤンバル wild_claw -> 鉄拳シグマ [743.8] -> 真勇者ダイン ダイン斬り -> 真勇者ダイン [-61.1] -> focus ドノマンティス [-97.2] -> master shield -> 真勇者ダイン@cpu_front_left [-122] -> end turn [-264.2]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 7/0 / hand player/cpu 3/5
     - metrics: HP 10/9, stones 7/0, boardValue 400/920, ready 3/0, shield 0/1, Lv2+ 0/3
     - board: cpu_back_left:CB:ドノマンティス Lv1 HP5 act1/1 focus | cpu_back_right:CB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv2 HP6 act1/1 shield | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 | player_front_left:PF:真勇者ダイン Lv1 HP3 act0/1 | player_front_right:PF:モーガン Lv1 HP4 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1

### 2. seed 72001 turn 5 player

- step: 46
- state: turn 5 / current player / HP player/cpu 10/9 / stones player/cpu 4/0 / hand player/cpu 4/2
- initialScore: 164.8
- selectedTerminalRank: 2
- selectedResponseRank: 2
- terminalGapToBest: 0
- responseGapToBest: 0
- board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:ヤミー Lv2 HP5 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:真勇者ダイン Lv2 HP4 act0/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus

#### Selected plan

1. terminal 344 (+179.2) / response 217 (-127) / guide 1808.7
   - actions: デスシープ attack -> ヤミー [609.8] -> master master_attack -> ヤミー@cpu_front_left [855.6] -> 真勇者ダイン ダイン斬り -> ヤンバル [575.9] -> end turn [-232.5]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 0/6 / hand player/cpu 4/3
   - metrics: HP 10/9, stones 0/6, boardValue 780/280, ready 1/2, shield 0/0, Lv2+ 2/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal 217 (-127)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [329.5] -> ドノマンティス attack -> 真勇者ダイン [245.8] -> ピグミィ スパイクボール -> 真勇者ダイン [187.2] -> master master_attack -> 真勇者ダイン@player_front_right [342.6] -> master master_attack -> 真勇者ダイン@player_front_right [710.8] -> end turn [-260.3]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 6/0 / hand player/cpu 5/3
     - metrics: HP 10/9, stones 6/0, boardValue 420/280, ready 2/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 | player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus

#### Top terminal plans

1. terminal 344 (+179.2) / response 217 (-127) / guide 1179
   - actions: デスシープ attack -> ヤミー [609.8] -> 真勇者ダイン ダイン斬り -> ヤンバル [316.8] -> master master_attack -> ヤミー@cpu_front_left [484.9] -> end turn [-232.5]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 0/6 / hand player/cpu 4/3
   - metrics: HP 10/9, stones 0/6, boardValue 780/280, ready 1/2, shield 0/0, Lv2+ 2/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal 217 (-127)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [329.5] -> ドノマンティス attack -> 真勇者ダイン [245.8] -> ピグミィ スパイクボール -> 真勇者ダイン [187.2] -> master master_attack -> 真勇者ダイン@player_front_right [342.6] -> master master_attack -> 真勇者ダイン@player_front_right [710.8] -> end turn [-260.3]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 6/0 / hand player/cpu 5/3
     - metrics: HP 10/9, stones 6/0, boardValue 420/280, ready 2/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 | player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus
2. terminal 344 (+179.2) / response 217 (-127) / guide 1808.7
   - actions: デスシープ attack -> ヤミー [609.8] -> master master_attack -> ヤミー@cpu_front_left [855.6] -> 真勇者ダイン ダイン斬り -> ヤンバル [575.9] -> end turn [-232.5]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 0/6 / hand player/cpu 4/3
   - metrics: HP 10/9, stones 0/6, boardValue 780/280, ready 1/2, shield 0/0, Lv2+ 2/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal 217 (-127)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [329.5] -> ドノマンティス attack -> 真勇者ダイン [245.8] -> ピグミィ スパイクボール -> 真勇者ダイン [187.2] -> master master_attack -> 真勇者ダイン@player_front_right [342.6] -> master master_attack -> 真勇者ダイン@player_front_right [710.8] -> end turn [-260.3]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 6/0 / hand player/cpu 5/3
     - metrics: HP 10/9, stones 6/0, boardValue 420/280, ready 2/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 | player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus
3. terminal 344 (+179.2) / response 217 (-127) / guide 1901.2
   - actions: master master_attack -> ヤミー@cpu_front_left [541.1] -> デスシープ attack -> ヤミー [1016.8] -> 真勇者ダイン ダイン斬り -> ヤンバル [575.9] -> end turn [-232.5]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 0/6 / hand player/cpu 4/3
   - metrics: HP 10/9, stones 0/6, boardValue 780/280, ready 1/2, shield 0/0, Lv2+ 2/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal 217 (-127)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [329.5] -> ドノマンティス attack -> 真勇者ダイン [245.8] -> ピグミィ スパイクボール -> 真勇者ダイン [187.2] -> master master_attack -> 真勇者ダイン@player_front_right [342.6] -> master master_attack -> 真勇者ダイン@player_front_right [710.8] -> end turn [-260.3]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 6/0 / hand player/cpu 5/3
     - metrics: HP 10/9, stones 6/0, boardValue 420/280, ready 2/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 | player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus

#### Top response-adjusted plans

1. terminal 344 (+179.2) / response 217 (-127) / guide 1179
   - actions: デスシープ attack -> ヤミー [609.8] -> 真勇者ダイン ダイン斬り -> ヤンバル [316.8] -> master master_attack -> ヤミー@cpu_front_left [484.9] -> end turn [-232.5]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 0/6 / hand player/cpu 4/3
   - metrics: HP 10/9, stones 0/6, boardValue 780/280, ready 1/2, shield 0/0, Lv2+ 2/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal 217 (-127)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [329.5] -> ドノマンティス attack -> 真勇者ダイン [245.8] -> ピグミィ スパイクボール -> 真勇者ダイン [187.2] -> master master_attack -> 真勇者ダイン@player_front_right [342.6] -> master master_attack -> 真勇者ダイン@player_front_right [710.8] -> end turn [-260.3]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 6/0 / hand player/cpu 5/3
     - metrics: HP 10/9, stones 6/0, boardValue 420/280, ready 2/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 | player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus
2. terminal 344 (+179.2) / response 217 (-127) / guide 1808.7
   - actions: デスシープ attack -> ヤミー [609.8] -> master master_attack -> ヤミー@cpu_front_left [855.6] -> 真勇者ダイン ダイン斬り -> ヤンバル [575.9] -> end turn [-232.5]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 0/6 / hand player/cpu 4/3
   - metrics: HP 10/9, stones 0/6, boardValue 780/280, ready 1/2, shield 0/0, Lv2+ 2/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal 217 (-127)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [329.5] -> ドノマンティス attack -> 真勇者ダイン [245.8] -> ピグミィ スパイクボール -> 真勇者ダイン [187.2] -> master master_attack -> 真勇者ダイン@player_front_right [342.6] -> master master_attack -> 真勇者ダイン@player_front_right [710.8] -> end turn [-260.3]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 6/0 / hand player/cpu 5/3
     - metrics: HP 10/9, stones 6/0, boardValue 420/280, ready 2/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 | player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus
3. terminal 344 (+179.2) / response 217 (-127) / guide 1901.2
   - actions: master master_attack -> ヤミー@cpu_front_left [541.1] -> デスシープ attack -> ヤミー [1016.8] -> 真勇者ダイン ダイン斬り -> ヤンバル [575.9] -> end turn [-232.5]
   - final: turn 5 / current cpu / HP player/cpu 10/9 / stones player/cpu 0/6 / hand player/cpu 4/3
   - metrics: HP 10/9, stones 0/6, boardValue 780/280, ready 1/2, shield 0/0, Lv2+ 2/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_left:PF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_right:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal 217 (-127)
     - actions: move ピグミィ cpu_front_left->cpu_back_right [329.5] -> ドノマンティス attack -> 真勇者ダイン [245.8] -> ピグミィ スパイクボール -> 真勇者ダイン [187.2] -> master master_attack -> 真勇者ダイン@player_front_right [342.6] -> master master_attack -> 真勇者ダイン@player_front_right [710.8] -> end turn [-260.3]
     - final: turn 6 / current player / HP player/cpu 10/9 / stones player/cpu 6/0 / hand player/cpu 5/3
     - metrics: HP 10/9, stones 6/0, boardValue 420/280, ready 2/0, shield 0/0, Lv2+ 1/0
     - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 | player_front_left:PF:デスシープ Lv2 HP6 act0/1 | player_front_right:PF:デスシープ Lv1 HP6 act0/1 focus

### 3. seed 72002 turn 5 player

- step: 46
- state: turn 5 / current player / HP player/cpu 9/8 / stones player/cpu 7/0 / hand player/cpu 3/3
- initialScore: -190
- selectedTerminalRank: 52
- selectedResponseRank: 9
- terminalGapToBest: 45.8
- responseGapToBest: 87
- board: cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:ボムゾウ Lv1 HP4 act1/1 | cpu_front_right:CF:ヤミー Lv2 HP5 act1/1 | player_front_left:PF:ヤンバル Lv1 HP3 act0/1

#### Selected plan

1. terminal 83 (+273) / response -166.4 (-249.4) / guide 2063
   - actions: ヤンバル wild_claw -> ヤミー [290.6] -> summon ピグミィ -> player_back_left [366.8] -> master master_attack -> ヤミー@cpu_front_right [410.4] -> master wake_up -> ピグミィ@player_back_left [657.3] -> ピグミィ スパイクボール -> ヤミー [571.3] -> focus ピグミィ [-63.3] -> end turn [-170.1]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/5 / hand player/cpu 2/4
   - metrics: HP 9/8, stones 0/5, boardValue 360/270, ready 0/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ボムゾウ Lv1 HP4 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 focus
   - opponent response: terminal -166.4 (-249.4)
     - actions: ピグミィ スパイクボール -> ヤンバル [540.2] -> ボムゾウ self_bomb -> ヤンバル [841.5] -> move ピグミィ cpu_front_right->cpu_back_left [210.7] -> summon ヤミー -> cpu_front_right [185.1] -> summon ドノマンティス -> cpu_back_right [112.8] -> master shield -> ボムゾウ@cpu_front_left [60.4] -> end turn [-40.7]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 4/0 / hand player/cpu 3/2
     - metrics: HP 9/8, stones 4/0, boardValue 230/700, ready 1/0, shield 0/1, Lv2+ 1/1
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 shield | cpu_front_right:CF:ヤミー Lv1 HP5 prep | player_front_left:PF:ピグミィ Lv2 HP3 act0/2 focus

#### Top terminal plans

1. terminal 128.8 (+318.8) / response -79.4 (-208.2) / guide 2782.8
   - actions: ヤンバル wild_claw -> ヤミー [290.6] -> summon ピグミィ -> player_back_left [366.8] -> master master_attack -> ヤミー@cpu_front_right [410.4] -> master wake_up -> ピグミィ@player_back_left [657.3] -> summon 鉄拳シグマ -> player_front_right [447.6] -> ピグミィ スパイクボール -> ヤミー [677.4] -> end turn [-67.3]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/5 / hand player/cpu 1/4
   - metrics: HP 9/8, stones 0/5, boardValue 420/270, ready 1/2, shield 0/0, Lv2+ 0/0
   - board: cpu_front_left:CF:ボムゾウ Lv1 HP4 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 prep | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal -79.4 (-208.2)
     - actions: ピグミィ スパイクボール -> ヤンバル [540.2] -> ボムゾウ self_bomb -> ヤンバル [840.5] -> move ピグミィ cpu_front_right->cpu_back_left [222.2] -> summon ヤミー -> cpu_front_right [186.3] -> summon ドノマンティス -> cpu_back_right [115] -> master shield -> ボムゾウ@cpu_front_left [19.7] -> end turn [-131.8]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 4/0 / hand player/cpu 2/2
     - metrics: HP 9/8, stones 4/0, boardValue 290/700, ready 2/0, shield 0/1, Lv2+ 0/1
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 shield | cpu_front_right:CF:ヤミー Lv1 HP5 prep | player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1
2. terminal 128.8 (+318.8) / response -79.4 (-208.2) / guide 2876.2
   - actions: ヤンバル wild_claw -> ヤミー [290.6] -> summon ピグミィ -> player_back_left [366.8] -> master master_attack -> ヤミー@cpu_front_right [410.4] -> summon 鉄拳シグマ -> player_front_right [513.5] -> master wake_up -> ピグミィ@player_back_left [684.9] -> ピグミィ スパイクボール -> ヤミー [677.4] -> end turn [-67.3]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/5 / hand player/cpu 1/4
   - metrics: HP 9/8, stones 0/5, boardValue 420/270, ready 1/2, shield 0/0, Lv2+ 0/0
   - board: cpu_front_left:CF:ボムゾウ Lv1 HP4 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 prep | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal -79.4 (-208.2)
     - actions: ピグミィ スパイクボール -> ヤンバル [540.2] -> ボムゾウ self_bomb -> ヤンバル [840.5] -> move ピグミィ cpu_front_right->cpu_back_left [222.2] -> summon ヤミー -> cpu_front_right [186.3] -> summon ドノマンティス -> cpu_back_right [115] -> master shield -> ボムゾウ@cpu_front_left [19.7] -> end turn [-131.8]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 4/0 / hand player/cpu 2/2
     - metrics: HP 9/8, stones 4/0, boardValue 290/700, ready 2/0, shield 0/1, Lv2+ 0/1
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 shield | cpu_front_right:CF:ヤミー Lv1 HP5 prep | player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1
3. terminal 128.8 (+318.8) / response -79.4 (-208.2) / guide 2725.7
   - actions: ヤンバル wild_claw -> ヤミー [290.6] -> summon ピグミィ -> player_back_left [366.8] -> summon 鉄拳シグマ -> player_front_right [339.3] -> master master_attack -> ヤミー@cpu_front_right [434.1] -> master wake_up -> ピグミィ@player_back_left [684.9] -> ピグミィ スパイクボール -> ヤミー [677.4] -> end turn [-67.3]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/5 / hand player/cpu 1/4
   - metrics: HP 9/8, stones 0/5, boardValue 420/270, ready 1/2, shield 0/0, Lv2+ 0/0
   - board: cpu_front_left:CF:ボムゾウ Lv1 HP4 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 prep | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal -79.4 (-208.2)
     - actions: ピグミィ スパイクボール -> ヤンバル [540.2] -> ボムゾウ self_bomb -> ヤンバル [840.5] -> move ピグミィ cpu_front_right->cpu_back_left [222.2] -> summon ヤミー -> cpu_front_right [186.3] -> summon ドノマンティス -> cpu_back_right [115] -> master shield -> ボムゾウ@cpu_front_left [19.7] -> end turn [-131.8]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 4/0 / hand player/cpu 2/2
     - metrics: HP 9/8, stones 4/0, boardValue 290/700, ready 2/0, shield 0/1, Lv2+ 0/1
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 shield | cpu_front_right:CF:ヤミー Lv1 HP5 prep | player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1

#### Top response-adjusted plans

1. terminal 128.8 (+318.8) / response -79.4 (-208.2) / guide 2782.8
   - actions: ヤンバル wild_claw -> ヤミー [290.6] -> summon ピグミィ -> player_back_left [366.8] -> master master_attack -> ヤミー@cpu_front_right [410.4] -> master wake_up -> ピグミィ@player_back_left [657.3] -> summon 鉄拳シグマ -> player_front_right [447.6] -> ピグミィ スパイクボール -> ヤミー [677.4] -> end turn [-67.3]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/5 / hand player/cpu 1/4
   - metrics: HP 9/8, stones 0/5, boardValue 420/270, ready 1/2, shield 0/0, Lv2+ 0/0
   - board: cpu_front_left:CF:ボムゾウ Lv1 HP4 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 prep | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal -79.4 (-208.2)
     - actions: ピグミィ スパイクボール -> ヤンバル [540.2] -> ボムゾウ self_bomb -> ヤンバル [840.5] -> move ピグミィ cpu_front_right->cpu_back_left [222.2] -> summon ヤミー -> cpu_front_right [186.3] -> summon ドノマンティス -> cpu_back_right [115] -> master shield -> ボムゾウ@cpu_front_left [19.7] -> end turn [-131.8]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 4/0 / hand player/cpu 2/2
     - metrics: HP 9/8, stones 4/0, boardValue 290/700, ready 2/0, shield 0/1, Lv2+ 0/1
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 shield | cpu_front_right:CF:ヤミー Lv1 HP5 prep | player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1
2. terminal 128.8 (+318.8) / response -79.4 (-208.2) / guide 2876.2
   - actions: ヤンバル wild_claw -> ヤミー [290.6] -> summon ピグミィ -> player_back_left [366.8] -> master master_attack -> ヤミー@cpu_front_right [410.4] -> summon 鉄拳シグマ -> player_front_right [513.5] -> master wake_up -> ピグミィ@player_back_left [684.9] -> ピグミィ スパイクボール -> ヤミー [677.4] -> end turn [-67.3]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/5 / hand player/cpu 1/4
   - metrics: HP 9/8, stones 0/5, boardValue 420/270, ready 1/2, shield 0/0, Lv2+ 0/0
   - board: cpu_front_left:CF:ボムゾウ Lv1 HP4 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 prep | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal -79.4 (-208.2)
     - actions: ピグミィ スパイクボール -> ヤンバル [540.2] -> ボムゾウ self_bomb -> ヤンバル [840.5] -> move ピグミィ cpu_front_right->cpu_back_left [222.2] -> summon ヤミー -> cpu_front_right [186.3] -> summon ドノマンティス -> cpu_back_right [115] -> master shield -> ボムゾウ@cpu_front_left [19.7] -> end turn [-131.8]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 4/0 / hand player/cpu 2/2
     - metrics: HP 9/8, stones 4/0, boardValue 290/700, ready 2/0, shield 0/1, Lv2+ 0/1
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 shield | cpu_front_right:CF:ヤミー Lv1 HP5 prep | player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1
3. terminal 128.8 (+318.8) / response -79.4 (-208.2) / guide 2725.7
   - actions: ヤンバル wild_claw -> ヤミー [290.6] -> summon ピグミィ -> player_back_left [366.8] -> summon 鉄拳シグマ -> player_front_right [339.3] -> master master_attack -> ヤミー@cpu_front_right [434.1] -> master wake_up -> ピグミィ@player_back_left [684.9] -> ピグミィ スパイクボール -> ヤミー [677.4] -> end turn [-67.3]
   - final: turn 5 / current cpu / HP player/cpu 9/8 / stones player/cpu 0/5 / hand player/cpu 1/4
   - metrics: HP 9/8, stones 0/5, boardValue 420/270, ready 1/2, shield 0/0, Lv2+ 0/0
   - board: cpu_front_left:CF:ボムゾウ Lv1 HP4 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 prep | player_back_left:PB:ピグミィ Lv1 HP3 act1/2 focus
   - opponent response: terminal -79.4 (-208.2)
     - actions: ピグミィ スパイクボール -> ヤンバル [540.2] -> ボムゾウ self_bomb -> ヤンバル [840.5] -> move ピグミィ cpu_front_right->cpu_back_left [222.2] -> summon ヤミー -> cpu_front_right [186.3] -> summon ドノマンティス -> cpu_back_right [115] -> master shield -> ボムゾウ@cpu_front_left [19.7] -> end turn [-131.8]
     - final: turn 6 / current player / HP player/cpu 9/8 / stones player/cpu 4/0 / hand player/cpu 2/2
     - metrics: HP 9/8, stones 4/0, boardValue 290/700, ready 2/0, shield 0/1, Lv2+ 0/1
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ドノマンティス Lv1 HP5 prep | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 shield | cpu_front_right:CF:ヤミー Lv1 HP5 prep | player_front_left:PF:ピグミィ Lv1 HP3 act0/2 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1

### 4. seed 72003 turn 5 player

- step: 48
- state: turn 5 / current player / HP player/cpu 8/8 / stones player/cpu 6/0 / hand player/cpu 3/3
- initialScore: -349
- selectedTerminalRank: 2
- selectedResponseRank: 5
- terminalGapToBest: 88
- responseGapToBest: 148.4
- board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:ボムゾウ Lv1 HP4 act1/1 | cpu_front_right:CF:ドノマンティス Lv2 HP3 act1/1 | player_front_left:PF:モーガン Lv2 HP4 act0/1

#### Selected plan

1. terminal -104 (+245) / response -334 (-230) / guide 1246.2
   - actions: モーガン arc_drive -> ドノマンティス [693.7] -> master master_attack -> ボムゾウ@cpu_front_left [221.9] -> master master_attack -> ボムゾウ@cpu_front_left [384.1] -> end turn [-53.5]
   - final: turn 5 / current cpu / HP player/cpu 8/8 / stones player/cpu 0/6 / hand player/cpu 3/4
   - metrics: HP 8/8, stones 0/6, boardValue 240/260, ready 0/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | player_front_left:PF:モーガン Lv2 HP4 act1/1
   - opponent response: terminal -334 (-230)
     - actions: summon ヤンバル -> cpu_back_left [311.8] -> ピグミィ スパイクボール -> モーガン [319.2] -> ピグミィ スパイクボール -> モーガン [532.1] -> master wake_up -> ヤンバル@cpu_back_left [674.4] -> ヤンバル wild_claw -> モーガン [942.7] -> move ピグミィ cpu_front_left->cpu_back_right [78.7] -> focus ピグミィ [-56.2] -> end turn [-131.3]
     - final: turn 6 / current player / HP player/cpu 8/8 / stones player/cpu 5/2 / hand player/cpu 4/3
     - metrics: HP 8/8, stones 5/2, boardValue 0/490, ready 0/0, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act2/2

#### Top terminal plans

1. terminal -16 (+333) / response -210 (-194) / guide 1897
   - actions: モーガン arc_drive -> ピグミィ [229.1] -> summon 真勇者ダイン -> player_front_right [71.2] -> master master_attack -> ドノマンティス@cpu_front_right [368.4] -> master wake_up -> 真勇者ダイン@player_front_right [655.5] -> 真勇者ダイン ダイン斬り -> ドノマンティス [644.5] -> end turn [-71.6]
   - final: turn 5 / current cpu / HP player/cpu 8/8 / stones player/cpu 0/6 / hand player/cpu 2/4
   - metrics: HP 8/8, stones 0/6, boardValue 400/270, ready 0/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ボムゾウ Lv1 HP4 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | player_front_left:PF:モーガン Lv2 HP4 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1
   - opponent response: terminal -210 (-194)
     - actions: summon ヤンバル -> cpu_back_left [417.6] -> ボムゾウ self_bomb -> モーガン [396.8] -> master wake_up -> ヤンバル@cpu_back_left [664.1] -> ヤンバル wild_claw -> モーガン [885.6] -> move ピグミィ cpu_front_right->cpu_back_right [-70.1] -> ピグミィ スパイクボール -> 真勇者ダイン [-118.3] -> end turn [-285.1]
     - final: turn 6 / current player / HP player/cpu 8/8 / stones player/cpu 5/2 / hand player/cpu 3/3
     - metrics: HP 8/8, stones 5/2, boardValue 150/480, ready 1/0, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ボムゾウ Lv1 HP2 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1
2. terminal -104 (+245) / response -334 (-230) / guide 1246.2
   - actions: モーガン arc_drive -> ドノマンティス [693.7] -> master master_attack -> ボムゾウ@cpu_front_left [221.9] -> master master_attack -> ボムゾウ@cpu_front_left [384.1] -> end turn [-53.5]
   - final: turn 5 / current cpu / HP player/cpu 8/8 / stones player/cpu 0/6 / hand player/cpu 3/4
   - metrics: HP 8/8, stones 0/6, boardValue 240/260, ready 0/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | player_front_left:PF:モーガン Lv2 HP4 act1/1
   - opponent response: terminal -334 (-230)
     - actions: summon ヤンバル -> cpu_back_left [311.8] -> ピグミィ スパイクボール -> モーガン [319.2] -> ピグミィ スパイクボール -> モーガン [532.1] -> master wake_up -> ヤンバル@cpu_back_left [674.4] -> ヤンバル wild_claw -> モーガン [942.7] -> move ピグミィ cpu_front_left->cpu_back_right [78.7] -> focus ピグミィ [-56.2] -> end turn [-131.3]
     - final: turn 6 / current player / HP player/cpu 8/8 / stones player/cpu 5/2 / hand player/cpu 4/3
     - metrics: HP 8/8, stones 5/2, boardValue 0/490, ready 0/0, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_right:CF:ピグミィ Lv1 HP3 act2/2
3. terminal -156.2 (+192.8) / response -301.4 (-145.2) / guide 661.3
   - actions: モーガン arc_drive -> ドノマンティス [693.7] -> summon 真勇者ダイン -> player_front_right [70.3] -> end turn [-102.6]
   - final: turn 5 / current cpu / HP player/cpu 8/8 / stones player/cpu 5/5 / hand player/cpu 2/4
   - metrics: HP 8/8, stones 5/5, boardValue 400/400, ready 0/3, shield 0/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ボムゾウ Lv1 HP4 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | player_front_left:PF:モーガン Lv2 HP4 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 prep
   - opponent response: terminal -301.4 (-145.2)
     - actions: ピグミィ スパイクボール -> モーガン [449.8] -> ピグミィ スパイクボール -> モーガン [673.4] -> ボムゾウ self_bomb -> モーガン [1031.5] -> summon ヤンバル -> cpu_back_right [173.5] -> focus ピグミィ [6.8] -> focus ピグミィ [-53.4] -> master shield -> ピグミィ@cpu_front_right [-66] -> end turn [-198.5]
     - final: turn 6 / current player / HP player/cpu 8/8 / stones player/cpu 10/1 / hand player/cpu 3/3
     - metrics: HP 8/8, stones 10/1, boardValue 160/660, ready 1/0, shield 0/1, Lv2+ 0/1
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 prep | cpu_front_left:CF:ボムゾウ Lv2 HP5 act1/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act2/2 shield,focus | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1

#### Top response-adjusted plans

1. terminal -157.2 (+191.8) / response -185.6 (-28.4) / guide 903.9
   - actions: モーガン arc_drive -> ドノマンティス [693.7] -> master master_attack -> ボムゾウ@cpu_front_left [221.9] -> summon 真勇者ダイン -> player_front_right [96.2] -> master shield -> モーガン@player_front_left [-7.2] -> end turn [-100.7]
   - final: turn 5 / current cpu / HP player/cpu 8/8 / stones player/cpu 0/5 / hand player/cpu 2/4
   - metrics: HP 8/8, stones 0/5, boardValue 420/380, ready 0/3, shield 1/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ボムゾウ Lv1 HP2 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | player_front_left:PF:モーガン Lv2 HP4 act1/1 shield | player_front_right:PF:真勇者ダイン Lv1 HP6 prep
   - opponent response: terminal -185.6 (-28.4)
     - actions: focus ボムゾウ [171.9] -> focus ピグミィ [141.1] -> move ピグミィ cpu_front_right->cpu_back_right [26.3] -> focus ピグミィ [87.7] -> summon ヤンバル -> cpu_front_right [73.4] -> master shield -> ボムゾウ@cpu_front_left [9.8] -> end turn [-257.4]
     - final: turn 6 / current player / HP player/cpu 8/8 / stones player/cpu 3/2 / hand player/cpu 3/3
     - metrics: HP 8/8, stones 3/2, boardValue 400/530, ready 2/1, shield 0/1, Lv2+ 1/0
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:ボムゾウ Lv1 HP2 act1/1 shield,focus | cpu_front_right:CF:ヤンバル Lv1 HP3 prep | player_front_left:PF:モーガン Lv2 HP4 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1
2. terminal -157.2 (+191.8) / response -185.6 (-28.4) / guide 613
   - actions: モーガン arc_drive -> ドノマンティス [693.7] -> summon 真勇者ダイン -> player_front_right [70.3] -> master master_attack -> ボムゾウ@cpu_front_left [-43.1] -> master shield -> モーガン@player_front_left [-7.2] -> end turn [-100.7]
   - final: turn 5 / current cpu / HP player/cpu 8/8 / stones player/cpu 0/5 / hand player/cpu 2/4
   - metrics: HP 8/8, stones 0/5, boardValue 420/380, ready 0/3, shield 1/0, Lv2+ 1/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ボムゾウ Lv1 HP2 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | player_front_left:PF:モーガン Lv2 HP4 act1/1 shield | player_front_right:PF:真勇者ダイン Lv1 HP6 prep
   - opponent response: terminal -185.6 (-28.4)
     - actions: focus ボムゾウ [171.9] -> focus ピグミィ [141.1] -> move ピグミィ cpu_front_right->cpu_back_right [26.3] -> focus ピグミィ [87.7] -> summon ヤンバル -> cpu_front_right [73.4] -> master shield -> ボムゾウ@cpu_front_left [9.8] -> end turn [-257.4]
     - final: turn 6 / current player / HP player/cpu 8/8 / stones player/cpu 3/2 / hand player/cpu 3/3
     - metrics: HP 8/8, stones 3/2, boardValue 400/530, ready 2/1, shield 0/1, Lv2+ 1/0
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:ボムゾウ Lv1 HP2 act1/1 shield,focus | cpu_front_right:CF:ヤンバル Lv1 HP3 prep | player_front_left:PF:モーガン Lv2 HP4 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1
3. terminal -16 (+333) / response -210 (-194) / guide 1897
   - actions: モーガン arc_drive -> ピグミィ [229.1] -> summon 真勇者ダイン -> player_front_right [71.2] -> master master_attack -> ドノマンティス@cpu_front_right [368.4] -> master wake_up -> 真勇者ダイン@player_front_right [655.5] -> 真勇者ダイン ダイン斬り -> ドノマンティス [644.5] -> end turn [-71.6]
   - final: turn 5 / current cpu / HP player/cpu 8/8 / stones player/cpu 0/6 / hand player/cpu 2/4
   - metrics: HP 8/8, stones 0/6, boardValue 400/270, ready 0/2, shield 0/0, Lv2+ 1/0
   - board: cpu_front_left:CF:ボムゾウ Lv1 HP4 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | player_front_left:PF:モーガン Lv2 HP4 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1
   - opponent response: terminal -210 (-194)
     - actions: summon ヤンバル -> cpu_back_left [417.6] -> ボムゾウ self_bomb -> モーガン [396.8] -> master wake_up -> ヤンバル@cpu_back_left [664.1] -> ヤンバル wild_claw -> モーガン [885.6] -> move ピグミィ cpu_front_right->cpu_back_right [-70.1] -> ピグミィ スパイクボール -> 真勇者ダイン [-118.3] -> end turn [-285.1]
     - final: turn 6 / current player / HP player/cpu 8/8 / stones player/cpu 5/2 / hand player/cpu 3/3
     - metrics: HP 8/8, stones 5/2, boardValue 150/480, ready 1/0, shield 0/0, Lv2+ 0/1
     - board: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ボムゾウ Lv1 HP2 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1

### 5. seed 72004 turn 5 player

- step: 45
- state: turn 5 / current player / HP player/cpu 8/9 / stones player/cpu 5/0 / hand player/cpu 3/3
- initialScore: -308.2
- selectedTerminalRank: 2
- selectedResponseRank: 2
- terminalGapToBest: 3
- responseGapToBest: 3
- board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 shield,focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 prep | player_front_left:PF:モーガン Lv1 HP4 act0/1

#### Selected plan

1. terminal -304 (+4.2) / response -265 (+39) / guide -90.8
   - actions: summon ポリスピナー -> player_front_right [194.5] -> move モーガン player_front_left->player_back_right [54.7] -> master master_attack -> 真勇者ダイン@cpu_front_left [-145.8] -> end turn [-194.2]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 1/3 / hand player/cpu 2/4
   - metrics: HP 8/9, stones 1/3, boardValue 270/420, ready 0/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP4 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_right:PB:モーガン Lv1 HP4 act1/1
   - opponent response: terminal -265 (+39)
     - actions: end turn [-17.4]
     - final: turn 6 / current player / HP player/cpu 8/9 / stones player/cpu 4/3 / hand player/cpu 3/4
     - metrics: HP 8/9, stones 4/3, boardValue 270/420, ready 2/3, shield 0/0, Lv2+ 0/0
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP4 act0/1 focus | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_right:PB:モーガン Lv1 HP4 act0/1

#### Top terminal plans

1. terminal -301 (+7.2) / response -262 (+39) / guide 61.1
   - actions: summon ポリスピナー -> player_front_right [194.5] -> move モーガン player_front_left->player_back_right [54.7] -> end turn [-188]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 4/3 / hand player/cpu 2/4
   - metrics: HP 8/9, stones 4/3, boardValue 270/440, ready 0/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_right:PB:モーガン Lv1 HP4 act1/1
   - opponent response: terminal -262 (+39)
     - actions: end turn [2.7]
     - final: turn 6 / current player / HP player/cpu 8/9 / stones player/cpu 7/3 / hand player/cpu 3/4
     - metrics: HP 8/9, stones 7/3, boardValue 270/440, ready 2/3, shield 0/0, Lv2+ 0/0
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_right:PB:モーガン Lv1 HP4 act0/1
2. terminal -304 (+4.2) / response -265 (+39) / guide -90.8
   - actions: summon ポリスピナー -> player_front_right [194.5] -> move モーガン player_front_left->player_back_right [54.7] -> master master_attack -> 真勇者ダイン@cpu_front_left [-145.8] -> end turn [-194.2]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 1/3 / hand player/cpu 2/4
   - metrics: HP 8/9, stones 1/3, boardValue 270/420, ready 0/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP4 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_right:PB:モーガン Lv1 HP4 act1/1
   - opponent response: terminal -265 (+39)
     - actions: end turn [-17.4]
     - final: turn 6 / current player / HP player/cpu 8/9 / stones player/cpu 4/3 / hand player/cpu 3/4
     - metrics: HP 8/9, stones 4/3, boardValue 270/420, ready 2/3, shield 0/0, Lv2+ 0/0
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP4 act0/1 focus | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_right:PB:モーガン Lv1 HP4 act0/1
3. terminal -309 (-0.8) / response -323 (-14) / guide 106.9
   - actions: summon ポリスピナー -> player_front_right [194.5] -> end turn [-87.6]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 4/3 / hand player/cpu 2/4
   - metrics: HP 8/9, stones 4/3, boardValue 270/440, ready 1/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv1 HP4 act0/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 prep
   - opponent response: terminal -323 (-14)
     - actions: 真勇者ダイン ダイン斬り -> モーガン [345.4] -> ピグミィ スパイクボール -> モーガン [327.1] -> master master_attack -> モーガン@player_front_left [359.1] -> focus ドノマンティス [-0.8] -> focus ピグミィ [-122.9] -> end turn [-175.4]
     - final: turn 6 / current player / HP player/cpu 8/9 / stones player/cpu 8/0 / hand player/cpu 3/4
     - metrics: HP 8/9, stones 8/0, boardValue 130/440, ready 1/0, shield 0/0, Lv2+ 0/0
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2

#### Top response-adjusted plans

1. terminal -301 (+7.2) / response -262 (+39) / guide 61.1
   - actions: summon ポリスピナー -> player_front_right [194.5] -> move モーガン player_front_left->player_back_right [54.7] -> end turn [-188]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 4/3 / hand player/cpu 2/4
   - metrics: HP 8/9, stones 4/3, boardValue 270/440, ready 0/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_right:PB:モーガン Lv1 HP4 act1/1
   - opponent response: terminal -262 (+39)
     - actions: end turn [2.7]
     - final: turn 6 / current player / HP player/cpu 8/9 / stones player/cpu 7/3 / hand player/cpu 3/4
     - metrics: HP 8/9, stones 7/3, boardValue 270/440, ready 2/3, shield 0/0, Lv2+ 0/0
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_right:PB:モーガン Lv1 HP4 act0/1
2. terminal -304 (+4.2) / response -265 (+39) / guide -90.8
   - actions: summon ポリスピナー -> player_front_right [194.5] -> move モーガン player_front_left->player_back_right [54.7] -> master master_attack -> 真勇者ダイン@cpu_front_left [-145.8] -> end turn [-194.2]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 1/3 / hand player/cpu 2/4
   - metrics: HP 8/9, stones 1/3, boardValue 270/420, ready 0/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP4 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_right:PB:モーガン Lv1 HP4 act1/1
   - opponent response: terminal -265 (+39)
     - actions: end turn [-17.4]
     - final: turn 6 / current player / HP player/cpu 8/9 / stones player/cpu 4/3 / hand player/cpu 3/4
     - metrics: HP 8/9, stones 4/3, boardValue 270/420, ready 2/3, shield 0/0, Lv2+ 0/0
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP4 act0/1 focus | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2 | player_back_right:PB:モーガン Lv1 HP4 act0/1
3. terminal -325 (-16.8) / response -298 (+27) / guide 9.2
   - actions: モーガン arc_drive -> 真勇者ダイン [183.7] -> summon ポリスピナー -> player_front_right [132.2] -> master shield -> モーガン@player_front_left [-99.2] -> end turn [-207.6]
   - final: turn 5 / current cpu / HP player/cpu 8/9 / stones player/cpu 2/3 / hand player/cpu 2/4
   - metrics: HP 8/9, stones 2/3, boardValue 290/420, ready 0/3, shield 1/0, Lv2+ 0/0
   - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP4 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv1 HP4 act1/1 shield | player_front_right:PF:ポリスピナー Lv1 HP3 prep
   - opponent response: terminal -298 (+27)
     - actions: end turn [24.2]
     - final: turn 6 / current player / HP player/cpu 8/9 / stones player/cpu 5/3 / hand player/cpu 3/4
     - metrics: HP 8/9, stones 5/3, boardValue 270/420, ready 2/3, shield 0/0, Lv2+ 0/0
     - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP4 act0/1 focus | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 focus | player_front_left:PF:モーガン Lv1 HP4 act0/1 | player_front_right:PF:ポリスピナー Lv1 HP3 act0/2

### 6. seed 72005 turn 5 player

- step: 42
- state: turn 5 / current player / HP player/cpu 10/10 / stones player/cpu 5/0 / hand player/cpu 3/3
- initialScore: 117.4
- selectedTerminalRank: 33
- selectedResponseRank: 6
- terminalGapToBest: 43
- responseGapToBest: 42.2
- board: cpu_back_right:CB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:ヤミー Lv1 HP5 prep | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 | player_front_left:PF:モーガン Lv1 HP4 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1

#### Selected plan

1. terminal -21 (-138.4) / response -43 (-22) / guide -1295.9
   - actions: focus モーガン [52] -> 鉄拳シグマ attack -> ドノマンティス [-181.5] -> master master_attack -> ドノマンティス@cpu_front_right [-218.2] -> focus デスシープ [-221.9] -> master shield -> 鉄拳シグマ@player_front_right [-264.6] -> end turn [-461.8]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 0/3 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 0/3, boardValue 480/390, ready 0/3, shield 1/0, Lv2+ 0/0
   - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP1 act0/1 | player_front_left:PF:モーガン Lv1 HP4 act1/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act1/1 shield | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus
   - opponent response: terminal -43 (-22)
     - actions: ヤミー attack -> モーガン [298.2] -> ドノマンティス attack -> 鉄拳シグマ [215.6] -> ピグミィ スパイクボール -> モーガン [287.6] -> master master_attack -> モーガン@player_front_left [247.2] -> focus ピグミィ [-135.6] -> end turn [-300.8]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 4/0 / hand player/cpu 4/4
     - metrics: HP 10/10, stones 4/0, boardValue 310/390, ready 2/0, shield 0/0, Lv2+ 0/0
     - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:ヤミー Lv1 HP5 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP1 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP5 act0/1

#### Top terminal plans

1. terminal 22 (-95.4) / response -30 (-52) / guide -290.5
   - actions: end turn [-290.5]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/3 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 5/3, boardValue 460/430, ready 3/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv1 HP4 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal -30 (-52)
     - actions: ピグミィ スパイクボール -> モーガン [336.6] -> ヤミー attack -> モーガン [318.2] -> master master_attack -> モーガン@player_front_left [316.6] -> ドノマンティス attack -> 鉄拳シグマ [137.4] -> ピグミィ スパイクボール -> 鉄拳シグマ [-6.4] -> end turn [-194]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 9/0 / hand player/cpu 4/4
     - metrics: HP 10/10, stones 9/0, boardValue 300/430, ready 2/0, shield 0/0, Lv2+ 0/0
     - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP4 act0/1
2. terminal 18 (-99.4) / response -0.8 (-18.8) / guide -437.9
   - actions: focus デスシープ [44] -> move モーガン player_front_left->player_back_right [-59.6] -> end turn [-422.2]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/3 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 5/3, boardValue 460/430, ready 1/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:モーガン Lv1 HP4 act1/1
   - opponent response: terminal -0.8 (-18.8)
     - actions: summon 真勇者ダイン -> cpu_back_left [189.8] -> ドノマンティス attack -> 鉄拳シグマ [174.8] -> focus ヤミー [129.1] -> ピグミィ スパイクボール -> 鉄拳シグマ [92.9] -> ピグミィ スパイクボール -> 鉄拳シグマ [-4.1] -> master shield -> ヤミー@cpu_front_left [-45.8] -> end turn [-229.6]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 8/0 / hand player/cpu 4/3
     - metrics: HP 10/10, stones 8/0, boardValue 430/610, ready 3/0, shield 0/1, Lv2+ 0/0
     - board: cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act1/1 shield,focus | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP3 act0/1 | player_back_right:PB:モーガン Lv1 HP4 act0/1
3. terminal 15 (-102.4) / response -3.8 (-18.8) / guide -686.1
   - actions: focus デスシープ [44] -> move モーガン player_front_left->player_back_right [-59.6] -> master master_attack -> ドノマンティス@cpu_front_right [-242.1] -> end turn [-428.4]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 2/3 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 2/3, boardValue 460/410, ready 1/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP3 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:モーガン Lv1 HP4 act1/1
   - opponent response: terminal -3.8 (-18.8)
     - actions: summon 真勇者ダイン -> cpu_back_left [189.8] -> ドノマンティス attack -> 鉄拳シグマ [174.8] -> ピグミィ スパイクボール -> 鉄拳シグマ [125.6] -> focus ヤミー [85.9] -> ピグミィ スパイクボール -> 鉄拳シグマ [-4.5] -> master shield -> ヤミー@cpu_front_left [-50.9] -> end turn [-258.4]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 5/0 / hand player/cpu 4/3
     - metrics: HP 10/10, stones 5/0, boardValue 430/590, ready 3/0, shield 0/1, Lv2+ 0/0
     - board: cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act1/1 shield,focus | cpu_front_right:CF:ドノマンティス Lv1 HP3 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP3 act0/1 | player_back_right:PB:モーガン Lv1 HP4 act0/1

#### Top response-adjusted plans

1. terminal 18 (-99.4) / response -0.8 (-18.8) / guide -437.9
   - actions: focus デスシープ [44] -> move モーガン player_front_left->player_back_right [-59.6] -> end turn [-422.2]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/3 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 5/3, boardValue 460/430, ready 1/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:モーガン Lv1 HP4 act1/1
   - opponent response: terminal -0.8 (-18.8)
     - actions: summon 真勇者ダイン -> cpu_back_left [189.8] -> ドノマンティス attack -> 鉄拳シグマ [174.8] -> focus ヤミー [129.1] -> ピグミィ スパイクボール -> 鉄拳シグマ [92.9] -> ピグミィ スパイクボール -> 鉄拳シグマ [-4.1] -> master shield -> ヤミー@cpu_front_left [-45.8] -> end turn [-229.6]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 8/0 / hand player/cpu 4/3
     - metrics: HP 10/10, stones 8/0, boardValue 430/610, ready 3/0, shield 0/1, Lv2+ 0/0
     - board: cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act1/1 shield,focus | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP3 act0/1 | player_back_right:PB:モーガン Lv1 HP4 act0/1
2. terminal 15 (-102.4) / response -3.8 (-18.8) / guide -686.1
   - actions: focus デスシープ [44] -> move モーガン player_front_left->player_back_right [-59.6] -> master master_attack -> ドノマンティス@cpu_front_right [-242.1] -> end turn [-428.4]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 2/3 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 2/3, boardValue 460/410, ready 1/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP3 act0/1 | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act1/1 focus | player_back_right:PB:モーガン Lv1 HP4 act1/1
   - opponent response: terminal -3.8 (-18.8)
     - actions: summon 真勇者ダイン -> cpu_back_left [189.8] -> ドノマンティス attack -> 鉄拳シグマ [174.8] -> ピグミィ スパイクボール -> 鉄拳シグマ [125.6] -> focus ヤミー [85.9] -> ピグミィ スパイクボール -> 鉄拳シグマ [-4.5] -> master shield -> ヤミー@cpu_front_left [-50.9] -> end turn [-258.4]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 5/0 / hand player/cpu 4/3
     - metrics: HP 10/10, stones 5/0, boardValue 430/590, ready 3/0, shield 0/1, Lv2+ 0/0
     - board: cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act1/1 shield,focus | cpu_front_right:CF:ドノマンティス Lv1 HP3 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP3 act0/1 | player_back_right:PB:モーガン Lv1 HP4 act0/1
3. terminal 22 (-95.4) / response -30 (-52) / guide -290.5
   - actions: end turn [-290.5]
   - final: turn 5 / current cpu / HP player/cpu 10/10 / stones player/cpu 5/3 / hand player/cpu 3/4
   - metrics: HP 10/10, stones 5/3, boardValue 460/430, ready 3/3, shield 0/0, Lv2+ 0/0
   - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act0/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act0/1 | player_front_left:PF:モーガン Lv1 HP4 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_back_left:PB:デスシープ Lv1 HP6 act0/1 focus
   - opponent response: terminal -30 (-52)
     - actions: ピグミィ スパイクボール -> モーガン [336.6] -> ヤミー attack -> モーガン [318.2] -> master master_attack -> モーガン@player_front_left [316.6] -> ドノマンティス attack -> 鉄拳シグマ [137.4] -> ピグミィ スパイクボール -> 鉄拳シグマ [-6.4] -> end turn [-194]
     - final: turn 6 / current player / HP player/cpu 10/10 / stones player/cpu 9/0 / hand player/cpu 4/4
     - metrics: HP 10/10, stones 9/0, boardValue 300/430, ready 2/0, shield 0/0, Lv2+ 0/0
     - board: cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:ヤミー Lv1 HP5 act1/1 | cpu_front_right:CF:ドノマンティス Lv1 HP5 act1/1 | player_front_left:PF:デスシープ Lv1 HP6 act0/1 focus | player_front_right:PF:鉄拳シグマ Lv1 HP4 act0/1
