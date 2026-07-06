# White Planner Deckout Hold Min-Rollout Summary

生成: 2026-07-06

## 位置づけ

白対白の最終確認ループで残っていた `994315 challenger-as-cpu` の長期戦負けを対象にした改善。
前回の CPU 側前衛処理修正後、白プランナーは 994314-994317 の8戦で 7-1 まで改善していたが、994315 の CPU 席だけ終盤のデッキ切れレースで負けていた。

進行度としては、今回で白対白の終盤読みはかなり進み、全体ゴールに対して 75-80% 程度まで来た感触。
残りは、より広いseed帯と実プレイ感触で「強いが遅すぎない」範囲を確認する段階。

## 監査結果

修正前の 994315 は、turn20 / step259 が分岐点だった。

- 状態: HP cpu/player 8/10、stones 6/1、deck 5/4
- 選択手: `attack:ピグミィ:スパイクボール->真勇者ダイン`
- 強制分岐:
  - 選択手は最終的に `white` 勝ち、planner 負け
  - `end_turn` は `white_planner` 勝ち、turn28、HP cpu/player 2/0
  - `ボムゾウ self_bomb -> player master` も `white_planner` 勝ち、turn30、HP cpu/player 1/0

結論として、局面評価で前衛削りを過大に見て、終盤の「今は殴らず、相手のデッキ切れ/返しを待つ」勝ち筋を見落としていた。

## 実装内容

- 白ミラー終盤用のデッキ切れ死期モデルを `evaluateState` に追加。
  - 山札残りとマスターHPから、どちらが先にデッキ切れで落ちるかを半ターン単位で評価する。
- late deck hold の対象を拡張。
  - 既存は主に「マスターアタックで敵前衛を削る」局面だけだった。
  - 今回、通常攻撃で敵前衛を少し削るだけの手も、山札6枚以下の白ミラーでは `end_turn` とロールアウト比較するようにした。
- late deck hold のロールアウト候補を最小化。
  - 上位候補を全部見るのではなく、基本は `end_turn` と fallback の比較に絞る。
  - 994315 の最大判断時間は約60.7秒から約31.4秒へ改善。
- deckout監査スクリプトのartifact読み込みを修正。
  - `benchmark-summary.json` をゲーム履歴として誤集計しないようにした。

## 検証結果

### 994315 単体

- 修正後: `white_planner/cpu` 勝ち
- 305 steps / 28 turns
- warning 1件は長期戦扱いで、failureではない

修正後トレースの重要判断:

- step259: `end_turn`
- 理由: `ターンプラン探索: 返し込み最終盤面523点、次点と328点差、rollout 1000000点`
- 最大判断時間: 31,351.8ms

### 994314-994317 白対白 8戦

- `white_planner`: 8勝
- `white`: 0勝
- 平均: 224.6 steps / 23.0 turns
- 最大: 305 steps / 29 turns
- issues: 0 failures / 1 warning

前回 7-1 から、残っていた 994315 CPU 席負けが勝ちに反転した。

## 実行コマンド

```sh
npm run benchmark:ai -- --seed-start 994315 --seed-end 994315 --deck-preset master-lab-white-1377-death-sheep3 --player-master white --cpu-master white --baseline-ai white --challenger-ai white_planner --direction challenger-as-cpu --max-steps 360 --max-turns 90 --long-game-steps 300 --long-game-turns 80 --stagnation-limit 8 --stream-progress --out-dir docs/master_lab/results/2026-07-06_white_planner_deckout_hold_minrollout_994315_benchmark --write-artifacts
npm run benchmark:ai -- --seed-start 994314 --seed-end 994317 --deck-preset master-lab-white-1377-death-sheep3 --player-master white --cpu-master white --baseline-ai white --challenger-ai white_planner --direction both --max-steps 360 --max-turns 90 --long-game-steps 300 --long-game-turns 80 --stagnation-limit 8 --stream-progress --write-artifacts --out-dir docs/master_lab/results/2026-07-06_white_planner_deckout_hold_minrollout_994314_994317_benchmark
npm run audit:white-planner-decision-trace -- --seed 994315 --direction challenger-as-cpu --deck-preset master-lab-white-1377-death-sheep3 --max-steps 360 --max-turns 90 --markdown docs/master_lab/results/2026-07-06_white_planner_trace_994315_cpu_deckout_after_minrollout.md --json docs/master_lab/results/2026-07-06_white_planner_trace_994315_cpu_deckout_after_minrollout.json
npm test -- tests/game/cpuAi.test.ts
npm run build
```

## 成果物

- `docs/master_lab/results/2026-07-06_white_planner_deckout_clock_step259_branch_probe.md`
- `docs/master_lab/results/2026-07-06_white_planner_trace_994315_cpu_deckout_after_minrollout.md`
- `docs/master_lab/results/2026-07-06_white_planner_deckout_hold_minrollout_994314_994317_benchmark/benchmark-summary.json`

## 次の見方

このまま白対白だけをさらに細かく係数調整するより、次は広いseed帯で「今回の終盤holdが過剰に待ちすぎる局面を作っていないか」を見るのがよい。
小さく 16-32戦程度で十分で、負けや長考だけを追加監査する。
