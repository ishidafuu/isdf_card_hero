# White Rollout Nonrecursive Follow-up

生成: 2026-07-04

## 目的

前フェーズで追加した `white_rollout` は既知負け局面を拾える一方、実プロファイル単発が重すぎた。原因を切り分け、強さを落とさずに次の改善へ進める状態へ整理した。

## 採用

`white_rollout` の rollout 内で、profile 既定値の `terminalPlanRolloutSteps` が残る経路を塞いだ。

以前の `withoutTerminalPlanRolloutOptions` は、`options.search` が存在する場合だけ rollout を 0 にしていた。そのため `profile: white_rollout` のように profile config 側で rollout が有効な場合、rollout 中に再度 rollout が発火しうる。

今回、rollout 中の options には常に次を注入するようにした。

- `terminalPlanRolloutSteps: 0`
- `terminalPlanRolloutWeight: 0`
- player/cpu 両方の `searches` に同じ無効化設定

これで、PDCA の search override 経由だけでなく、実プロファイル `white_rollout` 経由でも rollout がネストしない。

## 不採用

### rollout 内を `strong` で試走

- 速度は改善した。
- ただし `994306 / challenger-as-player` を落とした。
- 結果: 不採用。

### terminal plan なしの軽量白評価で試走

- 最大 decision time は約5.5秒まで下がった。
- ただし同じく `994306 / challenger-as-player` を落とした。
- 結果: 不採用。

### 後列レーン圧力加点

ボムゾウを右後列に置くと、1つ飛びで相手右前のデスシープへ触れる。この差分を評価へ還元する案を試した。

- `994306 / challenger-as-player` は勝てるようになった。
- しかし `994306 / challenger-as-cpu` を落とした。
- 近傍4件では、既存の 3-1 から勝敗の場所が入れ替わるだけで純増にならなかった。
- 結果: 不採用。

## 判断

軽量 rollout を雑に近似すると、フル rollout が拾っていた左右差を再現できない。次に進めるなら、rollout を薄くするより先に「フル rollout が勝ちと判断した候補の理由」を局面特徴へ分解する必要がある。

次候補は次のどちらか。

- `white_rollout` は高思考プロファイルとして残し、発火局面をさらに狭くして実戦時間を抑える。
- 994306 の左右差を、後列レーン圧力ではなく「相手デスシープの封印レーンをどの控えで受けるか」という、より限定的な評価へ落とす。
