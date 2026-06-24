# White AI Opponent Terminal Response

生成: 2026-06-24

## 目的

白AIの終端盤面評価を一段進め、「自分が相手へ渡す最終盤面」だけでなく、「その盤面を相手がどう返すか」も軽量に見て候補比較へ混ぜる。

## 実装

- 白プロファイルに `sameTurnOpponentTerminalPlanDepth/Width/Weight` を追加した。
- 既定値は `depth 2 / width 1 / weight 0.35`。白以外は 0 で無効。
- 自分側の終端盤面探索は従来どおり `depth 6 / width 2 / weight 2`。
- 相手応答は全探索ノードではなく、自分側で選ばれた終端盤面ごとに1回だけ読む。初期案の全ノード応答は重すぎたため採用しない。
- 2026-06-24 追加改修で、1回の意思決定中だけ有効な終端盤面キャッシュを入れた。局面キーは log/eventLog を除外し、盤面・手札・山札・捨て札・石・HP・ターン内履歴を使う。
- 相手応答は、自分側の終端評価で上位に近い root 候補だけ読む。最低2候補は読むが、80点以上離れた低品質候補には相手応答を読ませない。
- 監査スクリプトは、各候補の終端盤面に加えて `opponent response` の手順、返却盤面、評価差分を出すようにした。
- 白同士ベンチの CLI は `id:d:w:dw:td:tw:twgt:od:ow:owgt` 形式で相手終端応答設定を比較できる。

## 監査結果

コマンド: `npm run audit:white-terminal-plans`

- 対象: `submission-pro-with-rare8-white-1339` vs `submission-pro-no-rare8-white-1377`
- 設定: `search 4/4/4`, `terminal 6/2/2`, `opponent 2/1/0.35`
- 監査条件: `maxSeeds 20`, `scenarios 3`, `beamWidth 2`, `maxActions 8`, `topLines 3`
- selected top1: 1/3
- selected average rank: 5
- average gap to best: 9.3
- max gap to best: 16
- 実行時間: 約41秒

詳細: `docs/master_lab/results/2026-06-24_white_ai_terminal_plan_audit.md`

## 白同士小規模ベンチ

コマンド:

```sh
npm run benchmark:white-search -- --games-per-direction 1 --seed-start 58000 --only-config terminal_only:4:4:4:6:2:2:0:0:0 --config opponent_lite:4:4:4:6:2:2:1:1:0.35
```

初期結果:

- `terminal_only`: 2戦、issues 0、1339 が 2-0、平均ゲーム 20103.3ms、平均ターン 642ms、最大ターン 4290.8ms
- `opponent_lite`: 2戦、issues 0、1339/1377 が 1-1、平均ゲーム 15731.1ms、平均ターン 599.9ms、最大ターン 2818.6ms

キャッシュ・候補絞り込み後の追加比較:

```sh
npm run benchmark:white-search -- --games-per-direction 1 --seed-start 58100 --only-config opponent_d1:4:4:4:6:2:2:1:1:0.35 --config opponent_d2:4:4:4:6:2:2:2:1:0.35 --config opponent_w2:4:4:4:6:2:2:1:2:0.35
```

- `opponent_d1`: 2戦、issues 0、平均ゲーム 7957.9ms、平均ターン 365.2ms、最大ターン 1505.5ms
- `opponent_d2`: 2戦、issues 0、平均ゲーム 9400.2ms、平均ターン 445.6ms、最大ターン 1583.5ms
- `opponent_w2`: 2戦、issues 0、平均ゲーム 8586.7ms、平均ターン 393.8ms、最大ターン 1571.9ms

小母数なので勝率判断はしない。少なくとも破綻はなく、`depth 2 / width 1` までなら通常の白AI既定に入れてよい重さ。

## 判断

この段階の相手応答は「実プレイレベルの長考AI」ではなく、その前段の安全な足場として妥当。相手ターンを読む構造は入り、既定は depth 2 / width 1 まで上げられた。

一方で、監査スクリプトの候補手順全列挙は重い。6局面・beam 3・top 5 では3分以上かかり停止したため、デフォルト監査は3局面・beam 2・top 3へ軽量化した。

## 次の改善案

- 長考用AIでは、時間予算つき iterative deepening にして、残り時間に応じて `opponent depth/width` を広げる。
- 監査レポートでは、`terminal` 順だけでなく `opponent response` 後の評価順も並べて比較できるようにする。
- 対白だけでなく、対黒・対デコイで `depth 2 / width 1` が守りすぎや石枯渇を誘発しないか確認する。
