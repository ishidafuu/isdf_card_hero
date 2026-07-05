# White Planner Rollout Response Phase Summary

生成: 2026-07-05

## 目的

白ミラーの `white_planner` について、ターンプラン探索後の相手応答読みを本格化する前段として、既存の重い rollout がどの勝ち筋を拾っているか、またどこまで軽量化できるかを確認した。

## 追加した検証基盤

- `scripts/white-planner-decision-trace.ts` に rollout 系 search option を追加。
  - `--planner-rollout-steps`
  - `--planner-rollout-candidate-limit`
  - `--planner-rollout-weight`
  - `--planner-rollout-front-focus-steps`
  - `--planner-rollout-shield-target-tie-steps`
  - `--planner-rollout-use-handoff`
  - `--planner-rollout-use-lightweight-profile`
- `scripts/white-planner-pdca-loop.ts` に軽量化候補を追加。
  - `rollout2_60_w015_gap200`
  - `rollout3_50_w015_gap200`
  - `rollout3_40_w015_gap200`
  - `rollout2_40_w015_gap200`
  - `rollout3_40_front16_w015_gap200`
  - `rollout3_40_front12_w015_gap200`
  - `rollout3_40_front12_handoff_w015_gap200`
  - `rollout3_40_front12_handoff_light_w015_gap200`
- `cpuAi` の search option に実験用フラグを追加。
  - `terminalPlanRolloutUseHandoff`
  - `terminalPlanRolloutUseLightweightProfile`

## 主要結果

| 設定 | 対象 | 結果 | 最大判断時間 | 所感 |
| --- | --- | ---: | ---: | --- |
| 現行 after low-stone shield tie | 994306-994309 both | 6-2 / avg HP +2.5 | 78819.8ms | 強いが一部長考が大きい |
| rollout40 | 994307 cpu | 勝ち HP +2 | 5594.5ms | このseedの勝ち筋は維持 |
| rollout40 | 994306 player | 負け HP -6 | 63080.8ms | 現行の重要勝ちseedを落とす |
| rollout50 | 994306 player | 負け HP -6 | 72692.2ms | 50手では勝ち筋を拾えない |
| rollout2_60 | 994306 player | 勝ち HP +5 | 79930.4ms | 勝ち筋は維持するが速度改善なし |
| front12 | 994306-994309 both | 5-3 / avg HP +1.25 | 63118.4ms | 弱体化し、長考も残る |
| handoff_light | 994306-994309 both | 5-3 / avg HP +1.38 | 5720.1ms | 速度は大幅改善、ただし重要勝ちseedを落とす |

## 判断

今回の候補は、どれも現行より明確に強いとは言えないため、`white_planner` のデフォルト設定には採用しない。

特に `challenger-as-player seed 994306` は、現行の60手 full rollout では勝つが、40手/50手/handoff/lightweight では落とす。ここは単なる無駄な長考ではなく、白ミラーの遠い盤面制圧を拾っている可能性が高い。

一方で、`handoff_light` は最大判断時間を 5.7 秒まで落とせており、相手応答読みの軽量パスとしては有望。次は「全局面を軽量化する」のではなく、重い60手 full rollout を許す局面を限定し、それ以外は `handoff_light` に逃がす設計がよい。

## 次フェーズ提案

1. 重い full rollout を許す条件を局面品質で定義する。
   - 候補が召喚で、次ターン以降に後衛射程またはレベルアップ圏へ接続する。
   - root 評価では不利だが、60手 rollout で勝敗または大きなHP差を反転する。
   - 手札/石/盤面枠が揃っていて、単なる後列埋めではなく継続打点になる。
2. それ以外の rollout は `handoff_light` で次自ターンまでの応答確認に留める。
3. `994306 player` をガードseedとして、現行勝ちを失わないことを必須条件にする。
4. `994308 player` は負けseedだが、負け幅と最大判断時間の改善を見る補助seedにする。

結論として、今回はデフォルトAIの強さを落とさないため採用見送り。代わりに、次フェーズで選択的 heavy rollout を実装するための計測基盤と候補台帳を整備した。
