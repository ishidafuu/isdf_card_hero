# White Planner Response Probe Summary

生成: 2026-07-04

## 目的

白ミラー `white_planner` の次フェーズとして、「係数追加」ではなく、ターンプラン探索と相手応答読みで改善できるかを確認した。

対象は `master-lab-white-1377-death-sheep3` の白ミラー。直近14戦では `white_planner` が `white` に 10-4 で勝ち越した一方、deckout race の負けが残ったため、終盤局面を重点監査した。

## 追加した監査

- `audit:white-planner-deckout`
  - 逐次保存したAIベンチartifactから、山札切れ付近の判断を抽出する。
- `audit:white-planner-response-probe`
  - 指定seed/stepまで再生し、探索候補ごとの選択手・次自ターンまでの分岐結果を比較する。
  - `--branch-top` で未選択上位候補も分岐再生できる。
- `lab:masters:white-planner-pdca`
  - `--stream-progress` を追加。
  - 相手応答深さ/幅を広げる候補を追加。

## 結果

### Deckout監査

`2026-07-04_white_planner_deckout_race_audit_14.md` より:

- games: 14
- `white_planner`: 10勝
- `white`: 4勝
- deckout finish: 7/14
- planner deckout loss: 2
- planner end_turn near deckout: 42
- planner face damage near deckout: 13

deckout race は実際に負け筋として出ている。

### 相手応答幅の比較

`response2_width2` は、以下6局面で現行 `current` と選択手が変わらなかった。

- `994304 / challenger-as-cpu`: step 240, 246, 252
- `994302 / challenger-as-player`: step 238, 244, 250

結果:

| probe | samples | changed | reading |
| --- | ---: | ---: | --- |
| `2026-07-04_white_planner_response_probe_994304_window.md` | 3 | 0 | step252 はすでに代替手でも山札切れ負け |
| `2026-07-04_white_planner_response_probe_994302_window.md` | 3 | 0 | step238/244/250 とも応答幅2では選択不変 |

相手応答の幅を1から2へ広げるだけでは、今回のdeckout負けは改善しない。

### 分岐再生で見えたズレ

`994302 / challenger-as-player / step238`:

- 現行選択: `end_turn`
- root評価: `end_turn 122.7`、顔攻撃 `-173.6`
- しかし次自ターンまで分岐すると:
  - `end_turn`: score `-481`
  - `デスシープ -> cpu master`: score `-418`

つまり、root評価では顔攻撃が大きく低評価だが、分岐後の局面評価では顔攻撃の方が少し良い。勝敗反転まではしないが、deckout race では「盤面を触れないならHP clockを進める」価値が足りていない可能性がある。

`994304 / challenger-as-cpu / step252`:

- 現行選択: `end_turn`
- 代替手:
  - `真勇者ダイン -> ドノマンティス`
  - `真勇者ダイン -> player master`
- どちらも次自ターンまでに `player` 勝ちで、すでに手遅れ。

## 判断

今回の次フェーズでは、`sameTurnOpponentTerminalPlanWidth` を広げるだけのデフォルト採用は見送る。

理由:

- 監査したdeckout負け6局面で選択手が変わらない。
- 思考時間は増えるが、改善局面がまだ確認できない。
- 負け筋は「相手応答候補の漏れ」より、「deckout clock を終端評価に入れられていない」問題に寄っている。

## Next Loop Proposal

次は探索幅ではなく、ターンプランの終端評価に deckout clock を入れる。

- deckout clock 指標を追加する。
  - 自分/相手の山札枚数。
  - 次に山札切れダメージを受ける順番。
  - 自分/相手HP差。
  - 現在ターンの顔打点が clock をどれだけ詰めるか。
- `terminalPlanStateDelta` または白ミラー closeout 評価へ限定して反映する。
  - 通常盤面では白の盤面制圧優先を崩さない。
  - 山札3枚以下、または片方deck0の局面だけに限定する。
- 採用前に `audit:white-planner-response-probe --branch-top` で局面単位確認する。
- 有望なら小母数の通しベンチへ戻す。

## 検証コマンド

```bash
npm run audit:white-planner-deckout -- \
  --artifact-dir artifacts/ai-benchmark/2026-07-04_white_planner_stream_994300_994301 \
  --artifact-dir artifacts/ai-benchmark/2026-07-04_white_planner_stream_994302_994303 \
  --artifact-dir artifacts/ai-benchmark/2026-07-04_white_planner_stream_994304 \
  --artifact-dir artifacts/ai-benchmark/2026-07-04_white_planner_stream_994305_994306 \
  --deck-threshold 2 \
  --max-samples 120 \
  --markdown docs/master_lab/results/2026-07-04_white_planner_deckout_race_audit_14.md \
  --json docs/master_lab/results/2026-07-04_white_planner_deckout_race_audit_14.json
```

```bash
npm run audit:white-planner-response-probe -- \
  --only-sample 994302:challenger-as-player:238 \
  --sample 994302:challenger-as-player:244 \
  --sample 994302:challenger-as-player:250 \
  --candidate current,response2_width2 \
  --max-replay-steps 30 \
  --stream-progress \
  --markdown docs/master_lab/results/2026-07-04_white_planner_response_probe_994302_window.md \
  --json docs/master_lab/results/2026-07-04_white_planner_response_probe_994302_window.json
```

```bash
npm run audit:white-planner-response-probe -- \
  --only-sample 994302:challenger-as-player:238 \
  --candidate current \
  --max-replay-steps 30 \
  --branch-top 3 \
  --stream-progress \
  --markdown docs/master_lab/results/2026-07-04_white_planner_branch_probe_994302_step238.md \
  --json docs/master_lab/results/2026-07-04_white_planner_branch_probe_994302_step238.json
```
