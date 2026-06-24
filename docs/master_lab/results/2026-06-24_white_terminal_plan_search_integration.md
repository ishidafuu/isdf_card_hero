# White Terminal Plan Search Integration

生成: 2026-06-24T16:40:00+09:00

## 実装

- 白AIの同一ターン探索に、候補手順を相手ターン開始まで進めた終端盤面比較を追加した。
- 対象は白マスターのみ。`stable` / `strong` / `pressure` / `defensive` / `omniscient` の既定挙動は変更しない。
- 現行AIの即時評価で上位候補を選び、その候補ごとに「このまま続ける」「ここでターン終了」を含めて終端盤面を比較する。
- 終端盤面1位との差がある候補だけ減点する。既存の撃破、リーサル、レベルアップ、白固有の盾品質評価はそのまま残す。

## 設定

- `sameTurnTerminalPlanDepth: 6`
- `sameTurnTerminalPlanWidth: 2`
- `sameTurnTerminalPlanWeight: 2`
- 検証用に `CpuAiSearchOptions` から `sameTurnTerminalPlanDepth` / `sameTurnTerminalPlanWidth` / `sameTurnTerminalPlanWeight` を上書きできる。

## 監査結果

比較元: [2026-06-24_white_ai_terminal_plan_audit.md](./2026-06-24_white_ai_terminal_plan_audit.md)

変更前の同条件監査:

- selected top1: 0/6
- selected average rank: 64.5
- average gap to best: 61.8
- max gap to best: 139
- 現行選択のシールド: 5/6
- 現行選択のフォーカス: 4/6

変更後:

- selected top1: 0/6
- selected average rank: 58
- average gap to best: 21.3
- max gap to best: 40
- 現行選択のシールド: 5/6
- 現行選択のフォーカス: 3/6

所感:

- 終端盤面との大きなズレはかなり縮んだ。特に max gap 139 -> 40 が大きい。
- まだシールドが残る局面はあるが、終端盤面差は小さくなっており、明確な大事故は減った。
- 完全に終端1位を選ばせるにはさらに強くできるが、攻めやレベルアップ手順まで止めるリスクがあるため、今回は `weight 2` を採用する。

## 白同士小規模ベンチ

条件:

- `submission-pro-with-rare8-white-1339` vs `submission-pro-no-rare8-white-1377`
- `games-per-direction 2`
- `seed-start 57000`

旧方式 `off_d4:4:4:4:0:0:0`

- #1339: 3-1-0, WPR 75%, avgHPDiff +2.5
- avgGameMs 7343.9
- avgTurnMs 198.7
- maxTurnMs 1124.6

終端比較あり `terminal_d4:4:4:4:6:2:2`

- #1339: 3-1-0, WPR 75%, avgHPDiff +1.75
- avgGameMs 26967.2
- avgTurnMs 914.0
- maxTurnMs 6099.8

判断:

- 小母数では勝率は維持。
- 思考時間は増えるが、最大ターン約6.1秒で、実戦許容の1分/ターンには十分収まる。
- avgHPDiff は少し縮んだため、強化というより「雑な過剰行動を抑えて盤面の渡し方を整える」変更として扱う。

## 次の確認

- 対黒・対デコイでも小規模に回し、白基準の総合力が落ちていないか確認する。
- 残っているシールド込み手順は、終端差が小さいため即修正せず、対戦ログで実害があるものだけ別途見る。
- これ以上強める場合は、全行動への強い減点ではなく、シールド/フォーカスなど手番末の追加行動だけに絞る。
