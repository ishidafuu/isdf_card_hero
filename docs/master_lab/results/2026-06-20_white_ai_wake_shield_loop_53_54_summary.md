# White AI Wake/Shield Loop 53-54 Summary

## Goal

白AIを調整の基準にできる強さへ寄せる。

中期目標:

- vs Black を 45-55% 付近で安定させる。
- Decoy / White を大きく落とさない。
- 白の戦い方である、盾で守る、育てる、盤面を取る、という質を壊さない。
- 勝率だけでなく、`LowS`、`ShieldConv`、`wake_up` の即仕事率を見て、ボロ負けと惜敗を分ける。

今回の短期目標:

- 前回残課題だった `wake_up` と `shield` の既存候補を、採用済み `whiteBlackFrontThreatBonus: 8` の上で再評価する。

## Loop 53: Wake/Shield Black Screen

- Report: `2026-06-20_white_ai_wake_shield_black_screen_loop_53.md`
- 条件: baseline / wake系 / shield+wake品質系 / 低石shield+wake抑制、黒2相手、4 games/matchup/direction、no-history。

| Rank | Variant | vs Black |
| ---: | --- | ---: |
| 1 | `pressure_white_low_stone_shield_wake_v1` | 43.8% |
| 2 | `pressure_white_next_turn_plan_quality_v1` | 43.8% |
| 3 | `pressure_white_shield_wake_quality_v1` | 43.8% |
| 4 | `pressure_white_baseline` | 37.5% |
| 5 | `pressure_white_wake_safe_work_v1` | 37.5% |
| 6 | `pressure_white_wake_immediate_work_v1` | 31.3% |
| 7 | `pressure_white_focus_wake_quality_light_v1` | 18.8% |

読み取り:

- 黒限定の粗い確認では、低石shield/wake抑制とshield/wake品質系がbaselineを少し上回った。
- 単体のwake加点は伸びない。
- 上位3案をDecoy/White込みで確認する価値あり。

## Loop 54: Wake/Shield Confirm

- Report: `2026-06-20_white_ai_wake_shield_confirm_loop_54.md`
- 条件: baseline / 上位3案、黒2相手+Decoy+White、4 games/matchup/direction、historyあり。

| Rank | Variant | Overall | vs Black | vs Decoy | vs White | ShieldConv | LowS |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | `pressure_white_baseline` | 59.4% | 56.3% | 62.5% | 62.5% | 43.0% | 56.6% |
| 2 | `pressure_white_next_turn_plan_quality_v1` | 40.6% | 43.8% | 37.5% | 37.5% | 42.0% | 57.1% |
| 3 | `pressure_white_shield_wake_quality_v1` | 40.6% | 37.5% | 37.5% | 50.0% | 29.1% | 53.4% |
| 4 | `pressure_white_low_stone_shield_wake_v1` | 34.4% | 43.8% | 50.0% | 0.0% | 29.2% | 52.4% |

読み取り:

- baseline が明確に首位。
- 黒限定で少し良く見えた候補は、Decoy/White込みでは落ちた。
- `whiteLowStoneShieldPenalty` / `whiteLowStoneWakePenalty` のような低石抑制は、White相手を大きく壊す。
- `whiteShieldThreatConversionBonus` や `whiteWakeImmediateWorkBonus` を重ねても、`ShieldConv` や `LowS` は改善しない。

## Decision

今回の wake/shield 系候補は標準採用しない。

理由:

- baseline が vs Black 56.3%、overall 59.4% で最も安定した。
- 追加候補は黒限定の軽量screenでは上振れたが、confirmで全体を落とした。
- 低石抑制は「全力を出しすぎない」方向として自然に見えるが、白ミラーでは必要な育成防御まで削っている。

## Current Goal Status

白AIは、短期目標だった「黒に対して最低限戦える基準」には近づいている。

- 今回のbaseline: vs Black 56.3%、Decoy 62.5%、White 62.5%。
- ただしseed揺れは残るため、これを最終値としては扱わない。
- 現時点では、追加係数を急いで入れるより、baselineを大きめ母数で再確認する方がよい。

## Next Loop Proposal

次は大きめ確認か、評価方法改善へ移る。

1. Baseline final-ish check
   - `pressure_white_baseline` 単体を黒2相手+Decoy+Whiteで 8-12 games/matchup/direction。
   - ここで vs Black 45%以上、Decoy/White 45%以上、0F/0W なら、白AIは一旦「基準として使える」扱いにする。

2. Paired diff tooling improvement
   - `white-ai-decision-diff-loop` は `Ref win / compare not` のsampleだけが詳しい。
   - `Compare win / ref not` もsample化すると、候補が勝つ理由を読める。
   - 以後の採用判断がかなり楽になる。

3. Deck side
   - AI係数だけでは `LowS` と `ShieldConv` の根本改善が鈍い。
   - 白が基準として十分なら、次はデッキ側の黒耐性カードや前衛/後衛比率の調整へ移る方が収穫が大きい。
