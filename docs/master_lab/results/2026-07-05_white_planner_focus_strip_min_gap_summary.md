# White Planner Focus Strip Min Gap Summary

生成: 2026-07-05

## 目的

前衛気合剥がしrolloutは `994311` の負けseedでHP差を改善したが、rolloutが不要な局面でも発火していた。
今回は強さを維持したまま、採用につながらない高コスト発火を削る。

## 変更

- front focus strip rollout に専用の root score gap 下限を追加。
- `terminalPlanRolloutFrontFocusStripAttackMinRootScoreGap: 180` を `white_planner` / `white_rollout` に設定。
- 低差分の気合剥がし候補はrolloutしない。`994311` の step92 は rollout gap が +78.8 しかなく採用閾値200に届かなかったため、発火対象外にした。
- 軽量トレース `audit:white-planner-decision-trace` を追加し、分岐再生なしで遅い判断と終盤行動を確認できるようにした。

## 結果

| check | before | after | note |
| --- | ---: | ---: | --- |
| `994311` slow decisions >=5000ms | 2 | 1 | step92 の無駄rolloutが消えた |
| `994311` max decision | 26052.1ms | 24814ms | 有効な step67 rollout だけ残る |
| `994311` smoke | 0-1, P0/C6, avg 1034.9ms | 0-1, P0/C6, avg 745.8ms | 強さは維持、平均思考時間が改善 |
| `994306-994307` guard | 2-0 | 2-0 | 勝ち維持 |
| `994309` guard | 1-0, max 48136.6ms | 1-0, max 38487ms | 勝ち維持、最大も改善 |

## 次

`994311` はまだ勝敗反転していない。トレース上は turn15 以降で既に劣勢が固定されており、終盤の顔打点/盾単体では反転しなかった。
次は「中盤までの石消費と盤面交換」を対象に、白ミラーで負けるseedを複数集め、過剰防御・マスターアタック連打・召喚/ウェイク順のどれが再現するかを見る。
