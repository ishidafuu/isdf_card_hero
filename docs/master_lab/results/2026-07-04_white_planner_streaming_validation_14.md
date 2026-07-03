# White Planner Streaming Validation 14

生成: 2026-07-04

## 目的

`benchmark:ai` の逐次出力・逐次artifact保存を使い、`white_planner` が既存 `white` より強い傾向を維持しているかを再確認した。

対象:

- master: `white` vs `white`
- deck: `master-lab-white-1377-death-sheep3`
- baseline AI: `white`
- challenger AI: `white_planner`
- seeds: `994300-994306`
- directions: `challenger-as-cpu`, `challenger-as-player`
- games: 14

## 実行コマンド

分割して以下の形式で実行した。

```bash
npm run benchmark:ai -- \
  --seed-start <seed> \
  --count <1-2> \
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
  --out-dir artifacts/ai-benchmark/<run-name>
```

## Summary

| item | value |
| --- | ---: |
| games | 14 |
| `white_planner` wins | 10 |
| `white` wins | 4 |
| `white_planner` win rate | 71.4% |
| avg steps | 241.8 |
| avg turns | 24.9 |
| max steps | 327 |
| max turns | 32 |
| failures | 0 |
| warnings | 5 |

前回の 10ゲーム確認は `white_planner` 7勝 / `white` 3勝だった。今回 14ゲームへ伸ばしても `white_planner` 10勝 / `white` 4勝で、ほぼ同じ勝率を維持した。

## Game Results

| seed | direction | winner | steps | turns | notes |
| ---: | --- | --- | ---: | ---: | --- |
| 994300 | challenger-as-cpu | `white` | 234 | 21 | suspicious_decision |
| 994301 | challenger-as-cpu | `white_planner` | 198 | 18 | - |
| 994300 | challenger-as-player | `white_planner` | 220 | 26 | - |
| 994301 | challenger-as-player | `white_planner` | 206 | 26 | - |
| 994302 | challenger-as-cpu | `white_planner` | 327 | 29 | long_game |
| 994303 | challenger-as-cpu | `white_planner` | 222 | 19 | - |
| 994302 | challenger-as-player | `white` | 256 | 27 | - |
| 994303 | challenger-as-player | `white_planner` | 242 | 23 | suspicious_decision |
| 994304 | challenger-as-cpu | `white` | 254 | 28 | - |
| 994304 | challenger-as-player | `white_planner` | 254 | 28 | - |
| 994305 | challenger-as-cpu | `white_planner` | 312 | 32 | long_game |
| 994306 | challenger-as-cpu | `white_planner` | 175 | 22 | - |
| 994305 | challenger-as-player | `white_planner` | 310 | 27 | long_game |
| 994306 | challenger-as-player | `white` | 175 | 22 | - |

## Loss Audit

`white_planner` の負けは4件。

### `994300 / challenger-as-cpu`

- `white_planner` はCPU側。
- 終盤、CPU HP2 / player HP6。
- CPUは `end_turn` を選び、次ターンに相手のドノマンティスLv2で敗北。
- warning: `ended turn despite strong candidate`
- ただし再生して評価を見ると、候補攻撃は大きく低評価で、単純に「攻撃すればよかった」とは言いにくい。相手のシールド付き高レベル前衛を止められていないことが本質に見える。

### `994302 / challenger-as-player`

- `white_planner` はplayer側。
- 終盤、player HP3 / cpu HP7で、アクティブ駒はあるが有効行動が少ない。
- step 238 の非リーサル顔打点を強制しても、最終結果はCPU勝ちのままだった。
- 山札切れと相手デスシープLv2の1点が重なって敗北。
- 1手の顔打点補正では反転しない。

### `994304 / challenger-as-cpu`

- `white_planner` はCPU側。
- 山札切れでCPUがHP0になって敗北。
- step 252 では `end_turn` 44点、敵前衛削り31点で差は小さいが、強制しても山札切れ敗北を止められるタイプではない。
- deckout race の評価が今後の監査対象。

### `994306 / challenger-as-player`

- `white_planner` はplayer側。
- 175 steps / 22 turns で比較的短い負け。
- 今回は詳細監査未実施。次ループの優先監査対象。

## Warning Audit

warningは5件。

- `994300 / challenger-as-cpu`: suspicious end_turn。負け試合。
- `994302 / challenger-as-cpu`: long_game。`white_planner` 勝ち。
- `994303 / challenger-as-player`: suspicious end_turn。`white_planner` 勝ち。
- `994305 / challenger-as-cpu`: long_game。`white_planner` 勝ち。
- `994305 / challenger-as-player`: long_game。`white_planner` 勝ち。

long_game は勝ち試合にも出ており、強さの問題というより探索・終盤収束の問題として扱う。

## 所感

現時点では、`white_planner` は既存 `white` より強い候補として十分に有望。14ゲームで 10-4 なので、前回の 7-3 が偶然だった可能性は下がった。

一方で、ここから係数を足すだけの改善は危険。負け4件は「この1手を直せば勝てる」という形ではなく、以下の複合問題に見える。

- deckout race の終盤評価。
- シールド付き高レベル前衛を放置した後の詰めろ管理。
- 有効行動が少ない終盤で、非リーサル顔打点を入れるべきかどうか。
- long_game を短く終わらせる closeout 評価。

## Next Loop Proposal

次はAI係数をいきなり採用せず、以下の順で進める。

1. `994306 / challenger-as-player` を詳細監査する。
2. deckout race 専用の監査を作る。
   - 自分と相手の山札枚数。
   - 次ドロー時HP。
   - 現在入れられる顔打点。
   - 盤面制圧より顔打点を優先すべき局面か。
3. long_game勝ちseed `994302`, `994305` を見て、勝っているが長い理由を確認する。
4. 改善候補はデフォルト採用せず、まず `CpuAiTuning` 実験項目として小母数で比較する。
