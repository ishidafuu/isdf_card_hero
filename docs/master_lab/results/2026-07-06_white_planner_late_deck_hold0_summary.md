# White Planner Late Deck Hold Rollout 0 Summary

生成: 2026-07-06

## 目的

front focus strip rollout を0にした後も、白ミラー終盤で13-15秒級の判断が残っていた。
内訳を見ると、多くは「攻撃するか、あえて `end_turn` で温存するか」を late deck hold rollout で確認している局面だった。

## 採用内容

- `white_planner` / `white_rollout` の `terminalPlanRolloutLateDeckHoldEndTurnSteps` を `48` から `0` に変更。
- late deck hold の候補追加自体は残しつつ、専用の長い確認rolloutは行わない。
- 実験用に `scripts/white-planner-decision-trace.ts` へ `--planner-rollout-late-deck-hold-steps` を追加。

## 指標

同じ `994318-994333` 両方向32戦で比較した。

| 条件 | 勝敗 | inspected events | 平均判断 | 最大判断 |
| --- | ---: | ---: | ---: | ---: |
| front focus 0 / late deck 48 | 22-10 | 35 | 667.3ms | 15760.0ms |
| front focus 0 / late deck 0 | 22-10 | 7 | 644.4ms | 11334.1ms |

勝率は維持したまま、8秒超監査イベントは 35 -> 7 に減った。

## 代表seed確認

| seed | direction | 変更前最大 | late deck 0最大 | 結果 |
| ---: | --- | ---: | ---: | --- |
| 994320 | challenger-as-player | 15760.0ms | 4571.6ms | 勝ち維持 |
| 994328 | challenger-as-player | 14686.0ms | 2680.5ms | 勝ち維持 |
| 994324 | challenger-as-cpu | 14245.4ms | 4291.7ms | 勝ち維持 |
| 994321 | challenger-as-player | 13677.2ms | 4971.0ms | 勝ち維持 |

## 残課題

残る最大は `994325 challenger-as-cpu step106 turn9` の盾target tie系。
実際の選択は `end_turn` のままだが、盾候補の比較rolloutで 11.3秒かかっている。

次は late deck ではなく、shield target tie rollout の軽量化を個別に見るのがよい。
ただし盾比較は以前から「雑な盾を減らす」ために効いていた系統なので、全消しではなく代表seedで短縮幅を試す。
