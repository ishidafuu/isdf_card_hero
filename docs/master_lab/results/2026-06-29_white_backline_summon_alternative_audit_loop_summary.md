# White Backline Summon Alternative Audit Loop Summary

生成: 2026-06-29

## 目的

前回の後列召喚監査で、単純な `whiteBlockedBacklineNoWorkSummonPenalty` は同一seedで悪化した。今回は「悪い後列召喚が選ばれた局面で、何が代替手として近かったか」を構造化して確認した。

bad summon は次で定義した。

- 同レーン前列に自軍ユニットがいる後列召喚
- 召喚カードが後列から攻撃できるパターンを持たない
- 次自ターンにその召喚ユニットが攻撃も前進もしない

## 追加した監査

- `MasterLabDecisionEvent.cpuDecisionEvaluations`
  - `includeGameHistory` 時に、CPU評価上位候補を最大8件残す。
  - 選択手との差分、手種別、decision text、理由を記録する。
- 後列召喚監査レポート
  - `Bad`
  - `Close Non-Summon`
  - `Top Alt`
  - サンプルごとの `alternatives`

## 結果

同一seed `136400`、`black_1375_pressure` / `white_current_mirror`、各1 games/matchup/direction。

| 条件 | W-L-D | Blocked | No Pattern | No Work | Bad | Close Non-Summon | Top Alt |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| baseline | 2-2-0 | 14 | 3 | 7 | 3 | 0 | Atk1, End1, OtherSum1 |
| blocked_backline_no_work40 | 2-2-0 | 17 | 6 | 12 | 6 | 1 | Focus1, OtherSum5 |
| hard skip試案 | 3-1-0 | 23 | 11 | 15 | 10 | 1 | 不採用 |

## 判断

今回試した行動変更は採用しない。

- `whiteBlockedBacklineNoWorkSummonPenalty: 40` は bad が 3 -> 6 に増えた。
- hard skip 試案は勝敗だけ見ると 3-1 だが、bad が 3 -> 10 に増えた。
- どちらも「悪い召喚を消す」と、別の悪い召喚へ流れる傾向が強い。

重要なのは、bad summon の近い代替が `attack/focus/end_turn` ではなく、召喚同士に寄っていること。つまり現段階の問題は「召喚するかどうか」より、「召喚すると決めた後のカード選択・スロット選択」が粗い可能性が高い。

## 次ループ提案

次は `decision text` だけでなく、代替召喚のカード名・召喚先・同レーン前列の状態を構造化して残す。

その上で候補化する。

1. 同じカードを左右どちらに置いても bad になる場合は、召喚自体を保留できるかを見る。
2. 後列に置くなら、ボムゾウ/ピグミィ/ヤンバルのような後列仕事カードを優先する。
3. 前衛カードしかない場合は、前列が空く見込み、手札圧迫、石残量を条件にする。
4. 係数ではなく、召喚候補生成または召喚候補の並び替え品質として実装する。

今回の結論としては、デフォルトAIの行動変更は入れず、監査基盤だけ採用する。
