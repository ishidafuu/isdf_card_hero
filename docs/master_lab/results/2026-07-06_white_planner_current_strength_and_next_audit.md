# White Planner Current Strength And Next Audit

生成: 2026-07-06

## Current Strength

- 現行採用状態の白白32戦は `white_planner` vs `white` で 22-10、勝率 68.75%。
- 速度調整後も同じ32戦勝率を維持しており、直近の改善は強化よりも「同等勝率のまま重いrolloutを削る」方向で効いている。
- 体感強度としては、標準白AIには明確に勝ち越す段階。実戦では8なしデッキ相手でも圧があり、負けseedも大崩れより僅差・終盤負けが中心。
- 一方で、人間に安定して勝つには、終盤前の攻撃順・target選択・rollout-confirmed override の精度がまだ詰めどころ。

## Rejected Probes

| probe | target | result | decision |
| --- | --- | --- | --- |
| 非リーサル顔打点を終盤holdへ寄せる | `994324 challenger-as-player` | 元の 0-2 負けから 0-4 負けへ悪化 | 不採用 |
| 白白2枚目盾を候補生成で強く制限 | `994331 challenger-as-cpu` | 元の 0-2 負けから 0-4 負けへ悪化 | 不採用 |
| 盾target tie の rollout margin を 4 -> 16 | `994324 challenger-as-player` | 0-6 負け、26ターンまで長期化 | 不採用 |
| 同一対象への弱い攻撃overrideを拒否 | `994324` step 98 | 問題局面に効かず、採用手は変わらず | 不採用 |

## Findings

- `994331 challenger-as-cpu` は `white` と `white_planner` の同局面decision diffが0だった。planner固有の悪手ではなく、席順・展開負けとして扱うべき。
- `994324 challenger-as-player` は decision diff 5件、planner側で実際に選ばれた差分3件。ここは改善対象になり得る。
- 怪しい差分は turn 10 step 98。標準白AIは `ボムゾウ storm_bomb -> デスシープ` を高評価し、plannerは terminal plan により `ポリスピナー attack -> デスシープ` を採用した。
- この採用は `isRolloutConfirmedTerminalPlanSelection` が root gap gate より先に通ることで起きている。盾よりも、rollout-confirmed override の監査が次の本命。

## Next Loop

1. forced branch probe が重すぎるため、候補数と再生深度を落とすだけでなく、同一局面の after-state 差分を軽量に出す監査を追加する。
2. `rolloutScoreGapToFallback` で root gap を飛ばした採用だけを抽出し、勝ちseedと負けseedで分類する。
3. その中で「fallback が強い盤面処理、planner が低即時値の攻撃/終端手」を選んだ局面を集める。
4. 実装候補は係数追加ではなく、rollout-confirmed override の採用条件を局面型で狭める。
5. 代表seedで改善した場合だけ32戦へ進める。今回のように代表seedで悪化した案は即時不採用にする。
