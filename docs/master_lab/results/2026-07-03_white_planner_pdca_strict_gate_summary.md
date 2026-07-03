# White Planner PDCA Strict Gate Summary

生成: 2026-07-03

## 目的

前フェーズの `white_planner` は探索基盤としては有用だったが、白ミラーでは既存 `white` に 1勝5敗で負け越していた。今回は「planner が白の強い局所判断を壊す」問題を潰し、既存 `white` より強い候補になるかを確認した。

## 問題の特定

負け seed `994300` の `challenger-as-player` を差分監査した。

初期状態:

- result: `white` 勝ち
- steps/turns: 144 / 15
- HP: P0/C9
- decision diffs: 26
- planner-selected diffs: 20

主な悪化要因:

- 白ミラー序中盤で、盤面制圧より非リーサル顔打点を優先した。
- `white` が攻撃/マスターアタックを選ぶ局面で、planner が召喚や `end_turn` に寄った。
- `white_planner` の通常フォールバックが既存 `white` と同一ではなく、planner を採用しない場合でも白の局所判断からズレていた。

## 実装した改善

- `white_planner` の局所探索深さ/幅を既存 `white` と同等へ戻した。
- `white_planner` のフォールバックを既存 `white` の評価にした。
- 白ミラー序中盤の非リーサル顔打点を planner 採用しないようにした。
- `white` が行動を選ぶ局面を planner の `end_turn` で潰さないようにした。
- `white` が攻撃/マスター行動を選ぶ局面を planner の召喚/focus/move で潰さないようにした。
- planner 採用を互換行動の差し替えに限定した。
  - 攻撃なら攻撃の対象差し替え。
  - 同種の非シールドマスター行動。
  - 同一判断はそのまま許可。

## 同一 seed 再監査

`seed 994300 / challenger-as-player`

| version | result | HP | steps | turns | diffs | planner selected diffs |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| before | white | P0/C9 | 144 | 15 | 26 | 20 |
| no-face guard | white | P0/C9 | 130 | 15 | 25 | 18 |
| white fallback | white | P0/C7 | 121 | 12 | 16 | 9 |
| strict compatible gate | white_planner | P2/C0 | 220 | 26 | 1 | 0 |

strict compatible gate では、この seed で planner が白の判断を壊さなくなり、結果も勝ちへ反転した。

## 勝率確認

`benchmark:ai`、白ミラー、1377 デスシープ3、baseline `white`、challenger `white_planner`。

### 前回

- seeds: `994300-994302`
- games: 6
- `white`: 5勝
- `white_planner`: 1勝
- warnings: 1

### 今回 小確認

- seeds: `994300-994302`
- games: 6
- `white`: 2勝
- `white_planner`: 4勝
- average: 240.2 steps / 24.5 turns
- max: 327 steps / 29 turns
- warnings: 2

### 今回 中確認

- seeds: `994300-994304`
- games: 10
- `white`: 3勝
- `white_planner`: 7勝
- average: 241.3 steps / 24.5 turns
- max: 327 steps / 29 turns
- failures: 0
- warnings: 3

方向別:

- challenger as cpu: `white_planner` 3勝 / `white` 2勝
- challenger as player: `white_planner` 4勝 / `white` 1勝

## 所感

今回の改善で、少なくともこの検証範囲では `white_planner` が既存 `white` を上回った。重要なのは、planner を強く信じる方向ではなく、既存 `white` を土台にして「壊さない上書き」だけを許可した点。

一方で、判断時間と試合時間は増えた。実プレイ用途では許容範囲に見えるが、今後の大量ベンチでは重い。次フェーズでは以下を優先する。

- 10戦より大きい母数で再現性を確認する。
- planner が実際に採用された差分が少ないため、勝ちに寄与した局面を抽出する。
- 互換行動のうち、攻撃対象差し替えが本当に有利かを loss/win で比較する。
- 長考コストを下げるため、planner 採用判定の前に軽い事前フィルタを入れる。
