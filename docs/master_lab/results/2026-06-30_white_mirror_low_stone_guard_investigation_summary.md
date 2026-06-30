# White Mirror Low-Stone Guard Investigation

生成: 2026-06-30

## 結論

白ミラー限定で `whiteThreatLeftLowStoneSetupPenalty: 6` を本線へ入れる。ただし、これは強い採用ではなく弱採用とする。

理由は、白対白では「盤面脅威が残っているのに、盾/起動/召喚/集中で石1以下まで使い切る」動きが負け筋になりやすい一方、勝率結果はseed差でかなり揺れたため。

## 実装判断

- 採用範囲は `white vs white` のみ。
- 黒戦/デコイ戦へは広げない。
- 係数を増やさない。今回の `6` は、行動を禁止する値ではなく、低石で布石へ寄る候補を少しだけ下げる値として扱う。
- `current_white_mirror_low_stone_guard_off` を比較候補として残し、今後も baseline との差分を見られるようにする。

## 検証ブロック

### 候補確認

`2026-06-30_white_mirror_low_stone_guard_confirm_summary.md`

- guard: 8-4-0 / 66.7%
- off: 5-7-0 / 41.7%

この時点では明確に guard が良かった。

### 実装後確認 1

`2026-06-30_white_mirror_low_stone_guard_post_impl_summary.md`

- guard: 1-7-0 / 12.5%
- off: 5-3-0 / 62.5%

別seedでは逆転した。ここで強採用扱いは不可。

### 実装後確認 2

`2026-06-30_white_mirror_low_stone_guard_post_impl_recheck_summary.md`

- guard: 4-4-0 / 50.0%
- off: 2-6-0 / 25.0%

再確認では guard が戻した。

### 中母数ゲート

`2026-06-30_white_mirror_low_stone_guard_medium_gate_summary.md`

- guard: 7-9-0 / 43.8%
- off: 6-10-0 / 37.5%

32戦 confirm では guard が僅差で上。決定打ではないが、白ミラー限定の軽い局面評価としては維持できる。

## 合算

confirm 相当の4ブロック合算:

| Variant | W-L-D | Win point |
| --- | ---: | ---: |
| guard | 20-24-0 | 45.5% |
| off | 18-26-0 | 40.9% |

差は +4.6pt。小さいので、次に同系統を触るなら、係数を上げるより負けseedの局面分類を先にやる。

## 所感

今回の候補は「白ミラーでは盤面制圧優先、マスター被弾は一定許容」という方針とは合っている。石1以下まで使い切る布石は、次ターンの盾/ウェイク/処理余地を失いやすい。

一方で、白ミラーは同型の長期戦でseed差が大きい。低石布石抑制だけで大きく強くなるというより、過剰コミットの一部を減らす小さい補正として見るべき。

## 次ループ

- `シールド偏重` が全ブロックで残っているため、次は白ミラーの負けseedから shield -> front process / wake / master attack の接続を分ける。
- 低石布石抑制は値を上げず、`off` 比較を残して回帰確認に使う。
- 白ミラーのループは重いので、`white-current-deck-loop` に進捗ログを追加するか、候補数を絞ってから中母数へ移る。
