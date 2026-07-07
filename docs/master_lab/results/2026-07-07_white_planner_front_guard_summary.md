# White Planner Front Guard Summary

生成: 2026-07-07

## 目的

白対白の残り負け seed `994334 challenger-as-cpu` で、低変換の削りを優先した結果、相手の高レベル前衛と後衛脅威を止めきれず負ける分岐を修正する。

時間面の最適化は後続課題とし、今回は強さの再現性だけを確認対象にした。

## 実装

- `white_planner` に `selectWhiteMirrorFrontGuardBeforeLowChipDecision` を追加。
- 白ミラー中盤の以下の局面で、低変換の後衛/複数行動攻撃より前列召喚を優先する。
  - turn 10-12。
  - 自分の石が5以上、相手の石が1以下。
  - 自分がHPで同等以上。
  - 相手に次ターンの後衛脅威と高レベル前衛がいる。
  - fallback攻撃が撃破ではなく、相手をHP4以上で残す削り。
  - 前列に前衛または高HPのガードを置ける。
- 回帰テスト `summons a white mirror front guard before low-conversion ranged chip` を追加。

## 直接確認

### `994334 challenger-as-cpu`

- 修正前: `white_planner` 敗北。
- 修正後: `white_planner` 勝利。
- 該当 turn 11 step 136 は、`ピグミィ -> デスシープ` の低変換削りではなく `ドノマンティス -> cpu_front_right` を選択。

参照:

- `docs/master_lab/results/2026-07-07_white_planner_994334_cpu_turn11_12_branch_scan.md`
- `docs/master_lab/results/2026-07-07_white_planner_trace_994334_cpu_front_guard_after_fix.md`

## スモーク結果

### 新 seed 帯 `994334-994337`

- コマンド: `npm run lab:masters:white-planner-pdca -- --seed-start 994334 --games-per-direction 4 --candidate current`
- 結果: 8-0-0
- WPR: 100%
- 平均HP差: +5.38
- issues: 0
- 参照: `docs/master_lab/results/2026-07-07_white_planner_front_guard_new_smoke_994334_994337.md`

### 既存 seed 帯 `994330-994333`

- コマンド: `npm run lab:masters:white-planner-pdca -- --seed-start 994330 --games-per-direction 4 --candidate current`
- 結果: 8-0-0
- WPR: 100%
- 平均HP差: +6.63
- issues: 0
- 参照: `docs/master_lab/results/2026-07-07_white_planner_front_guard_known_smoke_994330_994333.md`

## 検証

- `npm test -- --run tests/game/cpuAi.test.ts`
  - 141 tests passed。
- `npm run build`
  - passed。

## 判定

強さ面では今回の白白調整は一旦完了扱いでよい。

`994334-994337` の残り負け帯を全勝に戻し、既存の `994330-994333` 全勝帯も維持した。時間面では `994334` 周辺に長考が残るが、今回は強さ優先のため後続課題とする。
