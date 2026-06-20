# White AI Final Check Loop 55-56 Summary

## Goal

ホワイトAI調整を切り上げてよいかを確認する。

判定目安:

- vs Black / Decoy / White がそれぞれ45%以上。
- 0F/0W。
- 白の基本方針である、盾で守る、育てる、盤面を取る、を壊していない。
- 追加係数を入れるほど改善する余地が残っているか、デッキ側や評価方法へ移るべきかを判断する。

## Loop 55: Final Baseline Check

- Report: `2026-06-20_white_ai_final_baseline_check_loop_55.md`
- 条件: `pressure_white_baseline` 単体、黒2相手+Decoy+White、10 games/matchup/direction、historyあり。

| Variant | Overall | vs Black | vs Decoy | vs White | W-L-D | Issues |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `pressure_white_baseline` | 48.8% | 27.5% | 70.0% | 70.0% | 39-41-0 | 0F/0W |

読み取り:

- Decoy / White には十分勝てている。
- 黒相手は 11-29-0 で、最終合格ラインの45%を大きく下回った。
- `ShieldConv 35.8%`、`LowS 53.6%` で、前回から残っていた「守った後に勝ち切れない」「低石布石が多い」はまだ残る。

## Loop 56: Final Black Loss Audit

- Report: `2026-06-20_white_ai_final_black_loss_audit_loop_56.md`
- 条件: `pressure_white_baseline` 単体、黒2相手、10 games/matchup/direction、historyあり。

| Variant | W-L-D | Loss LowS | Loss ShieldConv | Loss Wake Now | Loss Wake Exec | Loss Focus No Work | ThreatA |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `pressure_white_baseline` | 11-29-0 | 52.3% | 37.1% | 25.4% | 14.3% | 71/136 | 63.4% |

読み取り:

- 負け試合では、低石focusが多く、その半分近くが次ターン仕事へ変換できていない。
- `WLowNo 25/29` で、低石ウェイク後に同ターン仕事しないケースがかなり多い。
- `ThreatA 63.4%` で、低石布石後も敵前衛脅威が残りやすい。
- ただし、過去ループで低石布石抑制やwake/shield品質加点を入れるとDecoy/Whiteや白ミラーが悪化したため、ここを単純な係数で押すのは危険。

## Final Decision

ホワイトAIの「係数追加ループ」はここで切り上げる。

ただし、ホワイトが完全に基準として安定した、という合格ではない。

現在の状態:

- Decoy / White への基準性能は十分。
- 黒相手の安定性は未達。
- 既存のAI係数候補は、黒を少し助けてもDecoy/Whiteや白ミラーを落としやすい。
- `whiteBlackFrontThreatBonus: 8` は採用済みで、現時点のAI側の安全な収穫として残す。
- `whiteLowStoneFocusMissedAttackPenalty` は黒向け手がかりとして保持するが、汎用採用しない。

## What This Means

このままAI係数だけを回し続けても、収穫は小さくなっている。

次にやるべきことは、以下のどちらか。

1. デッキ側へ移る。
   - 黒に押し込まれるseedで、白が必要としている前衛/後衛/マジックを調べる。
   - `ShieldConv` が低いのは、AIだけでなく守る価値のある駒や反撃札が足りない可能性がある。

2. 評価方法を改善する。
   - `white-ai-decision-diff-loop` で `Compare win / ref not` 側のsampleも出せるようにする。
   - 候補が勝つ理由と負ける理由を同じ粒度で読めるようにしてから、次のAI候補を作る。

## Recommended Next Phase

ホワイトAI調整は一旦終了。

次フェーズは「白デッキの黒耐性調整」に移すのがよい。

候補:

- 黒に押されるseedで、白が欲しかったカード種別を記録する。
- 低石focusが多いseedで、攻撃可能な前衛が足りないのか、後衛が仕事できないのか、マジックが足りないのかを分ける。
- pressure-normal の白デッキを、黒耐性寄りに少しだけ調整してから、同じ final check を再実行する。
