# White Planner Setup Over Focus Phase Summary

生成: 2026-07-04

## 目的

白対白で、終盤に `focus` を選びすぎて盤面の布石を逃す局面を改善する。
ただし、以前の `root neutral` は序盤から召喚を過大評価して別 seed を悪化させたため、全体係数ではなく局面を限定して採用する。

## 実装方針

- `turn 9` 以降だけ対象にする。
- 白対白だけ対象にする。
- fallback が `focus` のときだけ、召喚による布石候補と応答評価を比較する。
- 自分の後列が空のときだけ対象にする。
  - 後列が既に埋まっている局面では、最後の後列枠を潰す副作用が大きいため除外する。
- 通常 root 評価との差が大きくても、上記条件を満たす場合だけ `terminal response` の比較を優先する。

## 追加した監査

- `npm run audit:white-planner-search-diff`
  - 同じ局面で current と compare search の選択が変わった箇所を抽出する。
  - 早い差分から見ることで、後続の分岐差分を原因と混同しにくくする。
- `audit:white-planner-branch-timeline` / `audit:white-planner-turn-plan-response`
  - 新しい setup-over-focus 系 search option を受け取れるようにした。

## 検証結果

### 局面監査

- `994304 / challenger-as-cpu / step 103`
  - fallback: `focus:ドノマンティス`
  - planner: `summon:デスシープ->cpu_back_left`
  - adopted: `true`
  - 根拠: `2026-07-04_white_planner_turn_plan_response_994304_step103_setup_over_focus_t9_empty_back.md`

### 副作用監査

- `994305 / challenger-as-player`
  - 空後列条件なしでは `step 90` で最後の後列枠を埋める召喚が発生し、敗北に寄った。
  - 空後列条件ありでは search diff が `0` 件、最終結果も planner 勝ちに戻った。
  - 根拠: `2026-07-04_white_planner_search_diff_setup_over_focus_t9_empty_back_994305_player.md`

### 小母数勝敗

- `response_setup_over_focus_t9 / seeds 994304-994305 / both directions`
  - 4-0-0
  - WPR 100%
  - avg HP margin 4.5
  - 根拠: `2026-07-04_white_planner_pdca_response_setup_over_focus_t9_empty_back_seeds994304_994305.md`

### current との比較

- `current` vs `response_setup_over_focus_t9 / seeds 994300-994303 / both directions`
  - current: 7-1-0 / WPR 87.5% / avg HP margin 3.25
  - response_setup_over_focus_t9: 7-1-0 / WPR 87.5% / avg HP margin 3.38
  - 平均思考時間はほぼ同等。
  - 根拠: `2026-07-04_white_planner_pdca_current_vs_setup_over_focus_t9_empty_back_seeds994300_994303.md`

### デフォルト反映後

- `current / seeds 994304-994305 / both directions`
  - 4-0-0
  - WPR 100%
  - avg HP margin 4.5
  - 根拠: `2026-07-04_white_planner_pdca_default_setup_over_focus_t9_seeds994304_994305.md`

## 判断

`white_planner` のデフォルトへ採用する。

理由:

- 既知の負け seed を救っている。
- 悪化していた `994305 / player` の副作用は、空後列条件で消えた。
- 周辺 seed では勝敗悪化がなく、HP margin が小幅改善した。
- 条件が白対白、turn 9 以降、fallback focus、自後列空きに限定されており、広範囲の係数変更ではない。

## 次フェーズ

次は同じ `turn plan + opponent response` の方向で、以下を優先する。

1. `focus` と `attack` の押し引き監査
   - 倒しきれない前衛攻撃を避けるだけでなく、倒しきれないなら focus で返しを狙う判断を、応答評価と結びつける。
2. `summon` の後列枠価値監査
   - 今回は空後列条件が効いたため、後列枠の将来価値を terminal plan により明示的に入れる余地がある。
3. 中母数確認
   - 今回の default を `994300-994309` 程度で current only 再実行し、思考時間と事故 seed を確認する。
