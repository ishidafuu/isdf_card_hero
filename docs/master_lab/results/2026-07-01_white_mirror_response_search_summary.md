# White Mirror Response Search Summary

生成: 2026-07-01

## 目的

白対白の詰め。対黒専用調整ではなく、白ミラーで「このターンの仕事」と「次ターンへ渡す盤面」の質を上げる。

## 採用した変更

- 白AIの相手応答読みを `opponentTerminalPlan width 1 / weight 0.35` から `width 2 / weight 0.5` へ強化した。
- 白ミラーで、後衛が相手前衛の気合いを剥がす安全な削りは、非リーサル前衛チップ罰則から外した。
- 満HPの白モンスターが撃破でレベルアップする場合、満HPという理由だけでは減点しないようにした。

## 採用しなかった変更

- `sameTurnTerminalPlanWidth 3` は採用しない。2シナリオ監査でも数分で終わらず、実戦既定値としては重すぎる。
- 盾係数の追加調整は行わない。盾監査では顔面悪化 0% を維持しており、主問題は盾係数ではなく、相手応答込みの盤面渡しだった。

## 監査結果

### 相手応答読み

比較対象:

- `2026-07-01_white_mirror_terminal_plan_audit_response_default`
- `2026-07-01_white_mirror_terminal_plan_audit_levelup_focus_strip`

結果:

- 応答後 top1 選択: `0/2` -> `1/2`
- 応答後平均ギャップ: `148.3` -> `44.5`
- 応答後最大ギャップ: `196.6` -> `89`

大きく改善した局面では、HP1の敵をヤンバルで倒してレベルアップし、ピグミィで気合いを剥がしてから盤面を渡す手順を選べるようになった。以前のように、気合いからウェイクアップ・ダイン召喚へ進み、石0で返す重いラインを避けられている。

### 盾応答

比較対象:

- `2026-07-01_white_mirror_shield_response_matrix_response_default`
- `2026-07-01_white_mirror_shield_response_matrix_levelup_focus_strip`

結果:

- shield events: `8` -> `6`
- ignored_both: `12.5%` -> `16.7%`
- deterrent: `50%` -> `66.7%`
- absorbed: `37.5%` -> `16.7%`
- shield saved target: `50%` -> `66.7%`
- with-shield face damage worse: `0%` -> `0%`

ignored_both は1件残ったが、相手HP2の終盤でLv3ダインを守るケースだった。ここだけを理由に盾をさらに削るより、実戦で見てからでよい。

### 前衛チップ

対象:

- `2026-07-01_white_mirror_front_chip_audit_levelup_focus_strip`

結果:

- events: `40`
- converted same turn: `33`
- target acted on response: `7`
- harmful response: `2`
- board harmful response: `0`
- master-only response: `2`

白ミラーでは盤面被害が主指標。今回の母数では、非リーサル前衛削りが盤面被害へ直結した例は出なかった。マスターのみ被弾は2件あるが、詰めろ圏でなければ盤面制圧優先として許容寄り。

## 残課題

- 2件目の終端監査では、まだ selected response rank `9` / response gap `89` が残る。
- ただし応答後トップ候補は二重盾を含んでおり、そのまま寄せると石枯渇リスクがある。
- 次に詰めるなら、探索幅を増やすより「低石で返す重いライン」「二重盾を含む見かけ上の応答最良」を別監査し、候補選択の信頼度を上げる。

## 判断

今回の3点は採用でよい。白ミラーの相手応答ギャップが大きく下がり、盾・前衛チップ監査でも盤面崩壊は増えていない。ここから先は勝率を大きく回すより、実戦で気になる局面を拾って、低石・二重盾・重いウェイクアップの順に再監査するのがよい。
