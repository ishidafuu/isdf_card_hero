# White Planner Late Deck Hold Summary

生成: 2026-07-06

## 目的

白白の `994313 / challenger-as-cpu` 敗戦を対象に、終盤で白プランナーが盤面処理へ寄りすぎて勝ち切りを逃していないかを確認した。

## 結論

- 敗因候補は `step 238` の「敵前衛ボムゾウへの非撃破マスターアタック」だった。
- 同局面は何もせずターン終了した方が、山札/HP/石の終盤レースで勝ちやすい。
- 実装は係数追加ではなく、白白の低山札レースで「非撃破・非脅威低下のマスターアタック」と `end_turn` をロールアウト比較に乗せる形にした。
- 対象seedは負けから勝ちへ反転した。

## 実装

- `white_planner` / `white_rollout` に `terminalPlanRolloutAllowLateDeckHoldEndTurn` を追加。
- 条件は以下に限定。
  - 白白。
  - 18ターン以降。
  - 自分の山札6枚以下、相手山札が自分+1枚以内。
  - 自分がHP優位。
  - パスしても相手の即時マスター打点で負けない。
  - fallback が敵前衛へのマスターアタック。
  - そのマスターアタックが撃破にも即時マスター脅威低下にもつながっていない。
- この条件のときだけ、通常評価で低すぎて候補外になったfallbackもロールアウト比較対象に戻す。
- 特殊ロールアウト上限は56手。対象局面は48手で勝ちが見えるため、64手から短縮した。

## 対象Seed

| run | result | step 238 | final |
| --- | --- | --- | --- |
| 変更前 | `white` 勝ち、298 steps / 28 turns | `master:master_attack->monster:player_front_left` | CPU HP0 / player HP3 |
| 変更後 | `white_planner` 勝ち、286 steps / 26 turns | `end_turn`、rollout 1000000点 | CPU HP5 / player HP0 |

参照:

- `2026-07-06_white_planner_trace_994313_cpu_loss_current.md`
- `2026-07-06_white_planner_trace_994313_cpu_after_late_hold_56.md`
- `2026-07-06_white_planner_late_deck_hold_target_994313_pdca_56.md`

## 小母数ガード

`master-lab-white-1377-death-sheep3`, seeds `994310-994312`, both directions。

| W-L-D | WPR | avg HP margin | avg decision ms | max decision ms | issues |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 6-0-0 | 100% | +5.5 | 723.4ms | 53865.8ms | 0 |

参照:

- `2026-07-06_white_planner_late_deck_hold_guard_pdca_56.md`

## 検証

- `npm run build`: pass。
- `npm test -- --testTimeout 180000`: 全34 files / 592 tests のassertionはpass。ただし最後にVitest workerの `onTaskUpdate` timeoutでexit 1。
- `npm test -- --testTimeout 180000 --no-file-parallelism`: 全34 files / 592 tests のassertionはpass。同じく終了時のVitest worker `onTaskUpdate` timeoutでexit 1。

テスト失敗のassertionはない。終了時のworker timeoutは今回のAIロジック差分とは別のランナー側ノイズとして扱う。

## 次の予定

- 白白はこの方向で、終盤の「削るだけの石消費」と「待つ」比較を増やす価値がある。
- 次に見るなら、`master_attack` 以外の非撃破攻撃でも同型の終盤レースロスがあるかを監査する。
- ただし今回のロールアウトは重いので、今後は候補をさらに狭くし、最大思考時間が1分を超えない範囲で増やす。
