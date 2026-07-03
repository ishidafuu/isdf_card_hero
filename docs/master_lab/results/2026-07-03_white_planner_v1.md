# White Planner AI v1

生成: 2026-07-03

## 目的

係数追加ではなく、白AIを「1手評価」から「ターン全体のプラン評価」へ移す。

v1 では既存 `white` を壊さず、別プロファイル `white_planner` として追加した。

## 実装

- `CPU_AI_PROFILES` に `white_planner` を追加。
- 評価重みと白用 situational tuning は現行 `white` を共有。
- 違いは `selectTerminalPlan`。
  - root 候補を軽量評価で絞る。
  - 各 root から自ターン終了盤面まで beam search する。
  - ターン終了盤面ごとに相手応答を 1 手読む。
  - 返し込みの最終盤面評価が最も高い root の最初の 1 手を選ぶ。
- UI の AI 選択ラベルに `White Planner` を追加。

## 初期設定

| item | value |
| --- | ---: |
| detailedWidth | 4 |
| sameTurnSearchDepth | 2 |
| sameTurnSearchWidth | 3 |
| terminalPlanDepth | 5 |
| terminalPlanWidth | 2 |
| opponentTerminalPlanDepth | 1 |
| opponentTerminalPlanWidth | 1 |
| opponentTerminalPlanWeight | 0.5 |

最初は depth 7 / opponent depth 3 を試したが、白ミラー 1 seed の確認だけで 3 分以上かかったため、v1 では実戦と検証が回る範囲に落とした。

## スモーク結果

### テスト

- `npm test -- tests/game/cpuAi.test.ts -- --testTimeout 60000`
  - 128 tests passed

### ビルド

- `npm run build`
  - pass
  - Vite chunk size warning のみ

### 白ミラー軽量ベンチ

実行:

```bash
npm run benchmark:ai -- \
  --baseline-ai white \
  --challenger-ai white_planner \
  --direction challenger-as-cpu \
  --player-master white \
  --cpu-master white \
  --deck-preset master-lab-white-1377-death-sheep3 \
  --seed-start 994010 \
  --count 1 \
  --max-steps 80 \
  --max-turns 40
```

結果:

- 80 steps / 7 turns で未決着。
- 実行時間は約 24 秒。
- まだ強さ判断ではなく、実行可能性と速度感の確認。

## 読み

- `white_planner` は現行 white より明確に重い。
- ただし v1 設定なら、実戦用の強AIとしては許容可能な範囲に入った。
- 勝率判断はまだ早い。まずは局面ごとの行動差分と実戦感触を見る段階。

## 次フェーズ

1. 白対白限定で `white` vs `white_planner` の小母数比較を回す。
   - まず 1-2 seed / 片方向。
   - 問題なければ 3-5 seed / 両方向。

2. `white_planner` の思考時間を測る。
   - 平均 step ms。
   - 最大 turn ms。
   - 1ターン 60 秒以内に収まる設定を上限にする。

3. 差分ログを見る。
   - 既存 `white` と違う最初の手だけを抽出する。
   - 良い差分: 攻撃順、ウェイク順、盾の最後化、倒し切り。
   - 悪い差分: 長考、無意味な end turn、過剰な盾、盤面放棄。

4. v2 で相手応答を強める。
   - v1 は opponent depth 1。
   - 速度に余裕があれば opponent depth 2 を候補化する。

