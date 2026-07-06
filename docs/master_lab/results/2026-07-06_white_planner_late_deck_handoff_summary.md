# White Planner Late Deck Handoff Rollout Summary

生成: 2026-07-06

## 目的

前回の front focus strip rollout 短縮後も、白ミラー終盤の `994324 challenger-as-cpu` で50秒級の判断が残っていた。
今回は勝ちseedを崩さず、終盤デッキ切れ付近の rollout を短縮できるか確認した。

## 対象局面

問題局面は `994324 challenger-as-cpu` の turn 20-21。

- step 217: `attack:ピグミィ:スパイクボール->真勇者ダイン`
- step 235: `attack:ピグミィ:スパイクボール->真勇者ダイン`
- どちらも相手前衛の気合を剥がす非撃破攻撃。
- 従来は late deck hold 系 rollout が勝ち確定まで走り、`rollout 1000000点` になっていた。

この判断自体は勝ち筋に寄与しているため、rolloutを消すのではなく、次自ターン到達までで止める handoff rollout に切り替えた。

## 採用内容

- `applyTerminalPlanRolloutScores` で `isLateDeckHoldEndTurnRolloutTrigger` が成立した場合、通常rolloutではなく `evaluateTerminalPlanHandoffRollout` を使う。
- 既存の shield target tie と同じく、相手応答後の次自ターン盤面で比較する扱いにした。
- globalな `terminalPlanRolloutUseHandoff` は使わず、late deck hold 系にだけ限定した。

## 検証結果

| seed | direction | 結果 | steps / turns | max decision | 備考 |
| ---: | --- | --- | ---: | ---: | --- |
| 994324 | challenger-as-cpu | 勝ち維持 | 249 / 23 | 14105.6ms | 変更前front6確認では53889.7ms |
| 994325 | challenger-as-cpu | 従来通り敗戦 | 163 / 17 | 11175.4ms | 勝敗・手数は維持 |

`994324` の重い2手は、変更前は `rollout 1000000点` まで勝ち切りを読んでいた。
変更後は次自ターン評価に留めるため、同じ攻撃を選びつつ最大判断時間を大きく下げられた。

## 判断

採用。

- 強さを落としやすい lightweight profile 化とは違い、AI profileは維持している。
- late deck hold の目的は「この行動をした後、相手の返しを受けても次自ターンで崩れていないか」を見ることなので、handoff評価と相性がよい。
- ただし14秒級はまだ重い。次は同一ターン内キャッシュ、または終盤勝ち筋候補の候補数削減を検討する。

## 次のループ候補

- `994324` step 217/235 のような類似局面で、同一ターン/近接状態の rollout 結果を再利用できるかを見る。
- 勝ち確定まで読む必要がある局面と、次自ターン盤面で十分な局面を分類する。
- 速度だけでなく、残り負けseedの局面品質改善へ戻る。現状は白ミラー2帯合算22-10で改善しているが、負けseedの大敗はまだ残っている。
