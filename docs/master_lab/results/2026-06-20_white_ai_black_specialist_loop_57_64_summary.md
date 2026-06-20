# White AI Black Specialist Loop 57-64 Summary

生成: 2026-06-20

## 結論

対黒専用の白調整として、`white` プロファイルが黒マスターを相手にしている時だけ `whiteMonsterPressureBonus: 4` を追加した。

これは「白が守りや集中に寄りすぎて、黒の前衛打点源を放置する」負け筋を抑えるための補正。敵モンスターへ実ダメージまたは撃破を入れる行動だけを薄く押すため、単純な `attack_monster+4` より白らしい守り/育成の判断を崩しにくい。

## 変更内容

- `src/game/cpuAi.ts`
  - `WHITE_VS_BLACK_MATCHUP_TUNING` を追加。
  - `profile === "white"`、現在手番のマスターが白、相手マスターが黒の時だけ `whiteMonsterPressureBonus: 4` をマージする。
  - 明示チューニングを最後にマージするため、検証時は `whiteMonsterPressureBonus: 0` で無効化できる。
- `tests/game/cpuAi.test.ts`
  - 黒相手の default white にだけ `whiteMonsterPressureBonus: 4` が入ることを追加テスト。
  - 白相手には入らないこと、明示0指定で無効化できることも確認。
- `src/game/whiteAiTuningLoop.ts`
  - 対黒専用の複合候補を台帳に追加。

## ループ結果

### Loop 57: 対黒一次スクリーニング

ファイル:

- `2026-06-20_white_ai_black_specialist_screen_loop_57.md`

結果:

- `pressure_attack_monster_plus4`: vs Black 56.3%
- `pressure_white_vs_black_attack4_front16_v1`: vs Black 50.0%
- `pressure_white_baseline`: vs Black 37.5%
- `whiteLowStoneFocusMissedAttackPenalty` 系は伸びなかった。

所感:

- 盤面処理を少し押す方向は有効。
- ただし黒前衛脅威処理を強めるだけ、または focus 抑制を混ぜるだけでは安定しない。

### Loop 58: 上位候補の中母数確認

ファイル:

- `2026-06-20_white_ai_black_specialist_confirm_loop_58.md`

結果:

- `pressure_attack_monster_plus4`: vs Black 43.8%
- `pressure_white_vs_black_attack4_front16_v1`: vs Black 34.4%
- `pressure_white_baseline`: vs Black 31.3%

所感:

- `attack_monster+4` は基準比 +12.5pt で残ったが、絶対値は 45% 未満。
- そのまま actionBias として採用するには粗い。

### Loop 59: `attack_monster+4` 差分診断

ファイル:

- `2026-06-20_white_ai_black_specialist_attack4_diff_loop_59.md`

結果:

- `attack_monster+4` だけが勝ったseed: 2/48
- baseline だけが勝ったseed: 1/48
- 最初の分岐は `attack:ラオン:enemy_front > focus` が2件。

所感:

- 改善要因は「黒戦で集中より敵前衛攻撃を選ぶ」方向。
- ここから、全攻撃加点ではなく、敵モンスターへ実際に圧をかける局面補正へ還元する方針にした。

### Loop 60: 局面補正スクリーニング

ファイル:

- `2026-06-20_white_ai_black_specialist_situational_screen_loop_60.md`

結果:

- `pressure_attack_monster_plus4`: vs Black 50.0%
- `pressure_white_monster_pressure_v1`: vs Black 43.8%
- `pressure_white_threat_source_attack_light_v1`: vs Black 43.8%
- `pressure_white_baseline`: vs Black 31.3%

所感:

- 狭い局面補正でも可能性あり。
- `whiteEnemyFrontAttackBonus` や `whiteActiveFrontWorkBonus` は伸びず、単に前衛を殴るだけでは足りない。

### Loop 61: 局面補正の中母数確認

ファイル:

- `2026-06-20_white_ai_black_specialist_situational_confirm_loop_61.md`

結果:

- `pressure_white_monster_pressure_v1`: vs Black 58.3%
- `pressure_white_threat_source_attack_light_v1`: vs Black 37.5%
- `pressure_attack_monster_plus4`: vs Black 33.3%
- `pressure_white_baseline`: vs Black 20.8%

所感:

- `whiteMonsterPressureBonus: 4` が明確に残った。
- 負け時の黒残HPは 3.0 で、負けても高HPで押し切られるより惜敗が多い。
- 同ループ集計上、`shield` 使用は baseline 76 に対して 45 で、守り過ぎを少し抑えられている。
- 同ループ集計上、`ShieldConv` は 39.5% に対して 48.9% で、盾が次ターン成果に変換されやすくなった。

### Loop 62-64: 実装後確認

ファイル:

- `2026-06-20_white_ai_black_specialist_post_impl_loop_62.md`
- `2026-06-20_white_ai_black_specialist_post_impl_matrix_loop_63.md`
- `2026-06-20_white_ai_black_specialist_post_impl_equivalence_loop_64.md`

結果:

- Loop 64 decision diff:
  - `pressure_white_baseline` vs `pressure_white_monster_pressure_v1`
  - ref-only win: 0
  - compare-only win: 0
  - first diff: なし

所感:

- 実装後の default white は、黒相手では明示 `whiteMonsterPressureBonus: 4` 候補と同じ判断になった。
- Loop 62/63 は候補数と順序で seed 割当が変わるため、採用判断は Loop 64 の同一seed decision diff を主根拠にする。

## 採用判断

採用。

理由:

- 黒相手だけに限定されるため、白ミラーやデコイ相手の汎用白バランスを直接は動かさない。
- `attack_monster+4` のような粗い行動種別加点ではなく、敵モンスターへ実ダメージ/撃破を入れる行動だけを押す。
- 差分診断で見えた `focus` より敵前衛攻撃を選ぶ改善筋と整合する。
- 実装後 decision diff で baseline と明示候補の同等性を確認できた。

## 次ループ提案

対黒専用の白調整をさらに進めるなら、次は勝率ループより loss audit を優先する。

1. 新 baseline で黒限定 12-16 games/matchup/direction を回す。
2. 負けを「黒HP1-3の惜敗」「黒HP4以上の押し切られ」に分ける。
3. 惜敗が多いなら終盤詰め、押し切られが多いならデッキ側の前衛/後衛構成を見る。
4. AI係数は次に触るとしても、`whiteMonsterPressureBonus` をさらに上げるより、残った負けseedで「盾対象」「ウェイクアップ対象」「ポリスピナー温存」を監査する。
