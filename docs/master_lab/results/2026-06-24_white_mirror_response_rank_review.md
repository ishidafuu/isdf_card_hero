# White Mirror Response Rank Review

生成: 2026-06-24

## 目的

白対白に限定して、相手終端応答を読んだ結果が実際の手順選択改善につながっているかを見る。

## 追加した監査

- `white-ai-terminal-plan-audit` に `response rank` を追加した。
- `response rank` は、終端評価上位 `responseRankLimit` 本と実選択手順を対象に、相手応答後の評価で並べ直す。
- 既定は `responseRankLimit 12`。全候補に相手応答を付けると重すぎるため、まずは終端上位候補の範囲で比較する。

## 監査結果

コマンド: `npm run audit:white-terminal-plans`

- selected terminal top1: 1/3
- selected average terminal rank: 5
- average terminal gap: 9.3
- selected response top1: 0/3
- selected average response rank: 9.33
- average response gap: 54
- max response gap: 134

終端盤面だけ見ると大きなズレは少ないが、相手応答後に見るとズレが大きくなる局面がある。特に seed 56002 は、終端評価では差が12点でも、相手応答後は134点差まで広がった。

## 読み筋

- seed 56000 は、盾を張って石0で渡す選択が相手応答後も下位。石2を残してヤミーを起こすだけの手順が上位に残る。
- seed 56001 は、実選択が終端1位だが、相手応答後は12位。即時の盤面価値は高いが、返しで似た盤面に収束しやすく、細かい行動順差が応答後評価では逆転している。
- seed 56002 は、レベルアップや撃破成果が見えている手順でも、相手のボムゾウ/ピグミィ応答後に盤面を大きく返される。ここは「終端盤面評価」だけでは危険を見落とす典型。

## 設定比較

コマンド:

```sh
npm run benchmark:white-search -- --games-per-direction 1 --seed-start 58200 --only-config opponent_d1:4:4:4:6:2:2:1:1:0.35 --config opponent_d2:4:4:4:6:2:2:2:1:0.35 --config opponent_w2:4:4:4:6:2:2:1:2:0.35 --config opponent_w025:4:4:4:6:2:2:2:1:0.25 --config opponent_w050:4:4:4:6:2:2:2:1:0.5 --markdown docs/master_lab/results/2026-06-24_white_mirror_opponent_response_comparison.md
```

- 全設定 issues 0。
- `opponent_d2` は 2戦で 1-1、avgHPDiff 0、平均ターン 437.8ms、最大ターン 1820.2ms。
- `opponent_d1` は同じく 1-1 だが、平均ターン 737.5ms、最大ターン 2662.1ms。
- `opponent_w2` と `opponent_w025` は平均ターンが約790msで、今回の小母数では d2 より重い。
- `opponent_w050` は平均ターン 377.7msだが最大ターン 3158.8ms、平均ターン数 19.5。重みを上げると試合が長くなる可能性がある。

詳細: `docs/master_lab/results/2026-06-24_white_mirror_opponent_response_comparison.md`

## 判断

現状の既定 `opponent depth 2 / width 1 / weight 0.35` は維持でよい。幅2や weight 0.5 は、まだ採用する根拠が弱い。

次は探索を深くするより、相手応答後に大きく負ける局面の選択を直接改善する。候補は以下。

- 終端盤面が高くても、相手応答後に大きく下がる手順をより強く減点する。
- 石0で渡す手順は、相手応答後順位が低い場合に追加で落とす。
- 起こした味方・レベルアップした味方が、相手応答で即処理されるケースを別指標として監査する。
- seed 56002 型の「レベルアップ成果を作ったが、返しで盤面を取り返される」局面を差分シードとして増やす。
