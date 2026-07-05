# White Planner Shield Tie Rollout Lightening Summary

生成: 2026-07-06
deck: `master-lab-white-1377-death-sheep3`
対象: 白対白、盾対象tie評価による長考

## 結論

- `994315 / challenger-as-player` の長考は、盾対象が僅差の局面で `white_planner` をロールアウト内でも再帰的に使い、盾A/B比較だけに重い探索を走らせていたことが主因だった。
- 採用修正は、盾対象tieロールアウト内だけ `strong` profile に落とすこと。汎用の白planner本体は維持し、盾対象の相対比較だけ軽量化した。
- 併せて、白白でroot候補が自軍盾だけの局面は、汎用ターンプランroot探索を省略し、盾対象専用評価へ寄せた。

## Before

`2026-07-06_white_planner_trace_994315_player_first_slow.md`

- `994315 / challenger-as-player`
- step 26 / turn 3: `master:shield->monster:player_front_right`
- decision time: `7767.1ms`
- 5秒超え: `1`
- traceは最初の長考で停止。

`2026-07-06_white_planner_rollout_trigger_audit_994315_player_step26.md`

- rolloutTriggered: `false`
- terminal root候補は実質 `shield front_left` / `shield front_right` / `end_turn`
- 汎用rolloutではなく、盾対象tie側の比較が重いと判断。

## After

`2026-07-06_white_planner_trace_994315_player_shield_tie_strong_only.md`

- winner: `white_planner`
- final: `202 steps / 17 turns`
- max decision: `2073.8ms`
- 5秒超え: `0`
- step 26: `538.3ms`

## Fixed Benchmark

`2026-07-06_white_planner_shield_tie_strong_only_benchmark/benchmark-summary.json`

| scope | result |
| --- | ---: |
| games | 8 |
| white_planner wins | 6 |
| white wins | 2 |
| failures | 0 |
| warnings | 1 |
| max steps | 327 |
| max turns | 32 |
| average steps | 225.9 |
| average turns | 22.4 |

Direction breakdown:

| direction | white_planner | white | note |
| --- | ---: | ---: | --- |
| challenger-as-cpu | 2 | 2 | `994314`, `994315` を落とす |
| challenger-as-player | 4 | 0 | 問題seed `994315` は 202 stepsで勝ち |

## 実装メモ

- `selectShieldTargetTieRootDecision` のハンドオフロールアウトを `withoutTerminalPlanRolloutOptions(options, "strong", true)` に変更。
- `applyTerminalPlanRolloutScores` の盾対象tie triggerでも同じく `strong` profile override を使う。
- 盾対象tieは強い候補差の確認用なので、ロールアウト内まで `white_planner` を使う必要は薄い。
- `scripts/white-planner-decision-trace.ts` に、長考監査用の `--stream-decisions`、`--stop-after-slow-ms`、`--profile-step` などを追加。

## 残課題

- `challenger-as-cpu` は固定4seedで 2-2。これは今回の長考修正後も残る白白の手番/座席差として、次フェーズで別途見る。
- ただし今回の主目的だった `994315 / challenger-as-player` の長考は、5秒超えなしで勝ち切るところまで改善済み。

## 検証

- `npm test -- tests/game/cpuAi.test.ts`
- `npm run build`
- `npm run benchmark:ai -- --seed-start 994314 --seed-end 994317 --deck-preset master-lab-white-1377-death-sheep3 --player-master white --cpu-master white --baseline-ai white --challenger-ai white_planner --direction both --max-steps 360 --max-turns 90 --long-game-steps 300 --long-game-turns 80 --stagnation-limit 8 --stream-progress --write-artifacts --out-dir docs/master_lab/results/2026-07-06_white_planner_shield_tie_strong_only_benchmark`
