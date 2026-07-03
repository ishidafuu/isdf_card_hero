# White Planner Closeout Move Penalty

生成: 2026-07-04

## 目的

deckout clock 単独加点は `994305 / challenger-as-player` を落としたため不採用にした。次の候補として、白ミラー終盤で「後列の駒を前列に出す移動」が過大評価される局面を絞って補正した。

対象は以下のような手:

- 白ミラー closeout。
- 後列にいた味方が、移動または入れ替えで前列へ出る。
- 移動後すぐにその駒が攻撃できない。
- 直接マスター打点にもつながらない。

この場合、移動後の攻撃筋を作ったように見えても、移動した駒は行動済みで、返しに失われるリスクが高い。そのため `scoreMoveDecision` で終盤限定の減点を入れた。

## 結果

前回14戦と同じく、`white_planner` 10勝 / `white` 4勝。

| seed range | games | result | notes |
| --- | ---: | --- | --- |
| `994300-994301` | 4 | `white_planner` 3勝 / `white` 1勝 | 前回同等 |
| `994302-994304` | 6 | `white_planner` 4勝 / `white` 2勝 | 前回同等 |
| `994305-994306` | 4 | `white_planner` 3勝 / `white` 1勝 | 前回同等。deckout clockで落とした `994305 challenger-as-player` は勝ち維持 |

deckout監査:

- games: 14
- `white_planner`: 10勝
- `white`: 4勝
- deckout finish: 7
- planner deckout losses: 2

## 判断

この変更は勝率改善までは確認できていない。ただし、deckout clock実験と違い、確認範囲では悪化していない。

採用理由:

- ユーザー指摘の「後列/前列の置き方」「後から後衛を引いた時の置き場」「前列に出した駒が返しで失われる」問題に沿った局面補正。
- 白ミラー closeout に限定しており、序中盤の配置評価を崩しにくい。
- 14戦で前回水準を維持した。

未解決:

- deckout loss 2本は残っている。
- `994302 challenger-as-player` と `994304 challenger-as-cpu` は反転しない。
- 終盤の `shield` は局面により良し悪しが分かれ、一律抑制は危険。

## 次ループ

次は勝率を直接伸ばすため、以下の順で進める。

1. `994302 challenger-as-player` の敗着を、移動ではなく `shield/end_turn/face` の手順単位で再監査する。
2. `shield` は「守った駒が次自ターンに仕事したか」をbranch結果から分類する。
3. `end_turn` と `shield` のbranch score差が小さい局面では、石温存を優先する候補を作る。
4. 候補はデフォルト採用せず、まず `response-probe` と 6-14戦ベンチで確認する。

## 検証

```bash
npm run benchmark:ai -- \
  --seed-start 994300 \
  --count 2 \
  --deck-preset master-lab-white-1377-death-sheep3 \
  --player-master white \
  --cpu-master white \
  --baseline-ai white \
  --challenger-ai white_planner \
  --direction both \
  --max-steps 420 \
  --max-turns 100 \
  --long-game-steps 300 \
  --long-game-turns 80 \
  --stream-progress \
  --write-game-artifacts \
  --out-dir artifacts/ai-benchmark/2026-07-04_white_planner_closeout_move_penalty_994300_994301
```

同形式で `994302-994304`, `994305-994306` も実行した。
