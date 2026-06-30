# White Backline Hold Plan Implementation Summary

生成: 2026-06-30

## 結論

本線採用は `whiteLastBackSlotNoReachSummonGuardPenalty: 55` まで。`whiteLastBackSlotHoldPlanBonus` は実験フックとして残すが、default white profile / 対黒チューニングには入れない。

理由は、hold plan は「後列枠を空ける」挙動自体は作れるが、今回の黒seedでは勝率とbad summonの両立がまだ弱いから。

## 実装

- 対黒専用の `whiteLastBackSlotNoReachSummonGuardPenalty` を 35 -> 55 へ変更。
- `whiteLastBackSlotHoldPlanBonus` を追加。ただし default では未使用。
- `white-backline-summon-audit-loop` に hold plan off / 20 / 32 の比較候補を追加。
- CPU AI単体テストに、hold planが明示チューニング時だけ `focus` へ加点される回帰を追加。

## 検証

### hold plan 実装スクリーン

`2026-06-30_white_backline_hold_plan_impl_screen_black.md`

- hold off: 3-5-0 / bad 13 / last-back bad 10
- current baseline 実装スクリーン時点: 2-6-0 / bad 10 / last-back bad 9
- hold32: 5-3-0 / bad 13 / last-back bad 11
- guard55: 4-4-0 / bad 9 / last-back bad 5

hold32 は勝敗だけ見ると良いが、bad/last-backが戻るため不採用。guard55 は勝敗とlast-back badのバランスが一番良かった。

### guard55 最終確認

`2026-06-30_white_backline_guard55_final_black.md`

- guard35: 1-7-0 / bad 7 / last-back bad 6
- guard55 baseline: 2-6-0 / bad 13 / last-back bad 9
- hold20: 3-5-0 / bad 15 / last-back bad 10

このseed帯ではguard55が勝敗でguard35を上回ったが、badは悪化した。完全にきれいな改善ではないため、次回は勝率だけでなく「なぜ black_pressure_strong でbadが増えたか」を見る必要がある。

## 判断

- guard55: 採用。黒限定で、過去seedでは勝敗/last-back badの改善が複数回出ている。
- hold20/32: 不採用。実験候補として残す。
- 次に触るなら、hold planを常時加点ではなく、`bestHold` が近いseedをfixture化して、局面特徴をさらに絞る。

## 次ループ

- `black_pressure_strong` で guard55 baseline の bad が増えたseedを抽出する。
- hold planは `focus/end` 全般加点ではなく、既存アクティブ駒が次ターン成果に変換しやすい場合だけに限定する。
- 白ミラー/デコイは、今回の本線変更が黒限定なので大きな副作用は出ない前提。ただし最終マトリクスでは一度だけ確認する。
