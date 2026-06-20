# White AI Black Specialist Convergence Loop 65-70 Summary

生成: 2026-06-20

## 結論

前回採用した対黒専用 `whiteMonsterPressureBonus: 4` 以降、追加AI係数と既存デッキ候補を回したが、安定して baseline を上回る候補は出なかった。

今回の収束判断:

- 追加採用なし。
- 現行の対黒白AIは `whiteMonsterPressureBonus: 4` までで一旦止める。
- 次に進めるなら、係数ループではなく、負けseedの局面テスト化または黒対策カードを含む新規白デッキ設計へ移る。

## Loop 65: 新baseline loss audit

ファイル:

- `2026-06-20_white_ai_black_specialist_loss_audit_loop_65.md`

結果:

- `pressure_white_baseline`: 26-38-0
- Loss Opp HP: 3.1
- Loss LowS: 52.2%
- 負け側の低石化行動:
  - `focus`: 207
  - `summon`: 128
  - `shield`: 68
  - `attack`: 54
  - `wake_up`: 48
- 負け側の低石布石前:
  - 敵前衛脅威あり: 67.2%
  - 既存アクティブ駒で前衛へ触れる: 40.4%
  - 布石後も敵前衛脅威あり: 67.5%

読み:

- 黒に高HPで押し切られるだけではなく、相手HP3前後の惜敗も多い。
- ただし終盤詰めだけではなく、低石focusや布石の前に黒前衛圧を残す局面がまだ多い。
- 次候補は「攻撃可能なのに低石focusへ寄る局面」と「脅威を残した低石布石」を中心にした。

## Loop 66: AI候補の軽量スクリーニング

ファイル:

- `2026-06-20_white_ai_black_specialist_candidate_screen_loop_66.md`

結果:

- `pressure_white_threat_left_focus_missed_attack_v1`: 62.5%
- `pressure_white_low_stone_focus_missed_attack_light_v1`: 56.3%
- `pressure_white_shield_quality_second_guard_v1`: 56.3%
- `pressure_white_low_stone_focus_conversion_v1`: 50.0%
- `pressure_white_baseline`: 25.0%

読み:

- 一次では focus 攻撃見送り抑制系が強く見えた。
- ただし `whiteThreatLeftLowStoneSetupPenalty` 単体は伸びず、低石布石を一律に抑える方向は怪しい。
- 上位候補だけ中母数へ進めた。

## Loop 67: AI候補の中母数確認

ファイル:

- `2026-06-20_white_ai_black_specialist_candidate_confirm_loop_67.md`

結果:

- `pressure_white_low_stone_focus_missed_attack_light_v1`: 40.6%
- `pressure_white_baseline`: 40.6%
- `pressure_white_low_stone_focus_conversion_v1`: 34.4%
- `pressure_white_threat_left_focus_missed_attack_v1`: 34.4%
- `pressure_white_shield_quality_second_guard_v1`: 34.4%

読み:

- 一次上振れは消えた。
- `focus見送り軽量` は baseline と同率まで残ったが、採用差は出なかった。
- 複合候補や盾品質候補は中母数で落ちた。

## Loop 68: focus見送り軽量の同一seed差分

ファイル:

- `2026-06-20_white_ai_black_specialist_focus_light_diff_loop_68.md`

結果:

- `pressure_white_low_stone_focus_missed_attack_light_v1` だけが勝ったseed: 0/64
- `pressure_white_baseline` だけが勝ったseed: 2/64
- first diff: なし

読み:

- `focus見送り軽量` は baseline を安定して上回らない。
- 同一seed比較ではむしろ baseline 側だけが勝つseedが出たため、追加採用しない。

## Loop 69: 既存白デッキ候補スクリーニング

ファイル:

- `2026-06-20_white_ai_black_specialist_deck_screen_loop_69.md`

結果:

- `pressure_white_baseline`: 43.8%
- `white494_wake8`: 43.8%
- `balanced_attack_monster8`: 37.5%
- `white1347_defensive_baseline`: 31.3%
- `balanced_wake8_shield8`: 25.0%
- `white494_white_baseline`: 18.8%
- `white1340_white_baseline`: 6.3%

読み:

- 既存白投稿デッキや balanced 系は、現行 `pressure-normal` を明確には超えない。
- 防御寄りや育成寄りは黒速攻に間に合わず落ちやすい。
- `white494_wake8` は一次では同率だが、デッキ変更の根拠としては弱い。

## Loop 70: 収束確認

ファイル:

- `2026-06-20_white_ai_black_specialist_convergence_loop_70.md`

結果:

- `balanced_attack_monster8`: 40.0%
- `pressure_white_low_stone_focus_missed_attack_light_v1`: 37.5%
- `pressure_white_baseline`: 37.5%
- `white494_wake8`: 22.5%

読み:

- `focus見送り軽量` は baseline と同率。
- `white494_wake8` は中母数で落ちた。
- `balanced_attack_monster8` はわずかに上だが、デッキと行動方針を変える割に差が小さい。白の基準デッキとして採用する根拠はない。

## 採用判断

今回の Loop 65-70 では、追加採用なし。

採用しない理由:

- `focus見送り軽量` は中母数同率、同一seed差分で baseline-only が出た。
- `脅威残り低石布石` 系は一次以降で安定せず、低石抑制が育成や反撃を止める副作用を持つ。
- 盾品質/2枚目抑制は、既に default white に `whiteSecondShieldLowStonePenalty: 12` が入っており、追加しても伸びなかった。
- 既存デッキ候補は `pressure-normal` を安定して超えなかった。

## 次にやるべきこと

同じ係数ループを続ける収穫は小さい。

次に進めるなら以下のどちらか。

1. 負けseedの局面テスト化
   - Loop 65 の loss seeds から、黒HP1-3の惜敗seedと黒HP4以上の押し切られseedを分ける。
   - その中で「黒前衛脅威が残った低石focus」「盾後に反撃できない」「ポリスピナーを使うべき/温存すべき」を個別シナリオテストにする。
   - 係数ではなく、明確な局面判断をテストとして固定する。

2. 対黒用の新規白デッキ設計
   - 既存投稿デッキの流用ではなく、黒速攻に対して前衛処理とレベルアップ回復を両立する白デッキを作る。
   - 見るべき軸は「序盤から前衛へ触れるカード」「盾を張る価値がある中HP前衛」「ピグミィ/ポリスピナーの撃破圏作り」「守りすぎないマジック枚数」。
   - ロストーンは禁止方針のまま使わない。

現時点の推奨:

- AI係数追加は止める。
- 現行 `whiteMonsterPressureBonus: 4` 採用状態を対黒白AIの暫定収束点とする。
- 次サイクルは loss seed のシナリオテスト化から始める。

