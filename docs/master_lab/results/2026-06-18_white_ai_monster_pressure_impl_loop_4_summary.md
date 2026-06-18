# White AI Monster Pressure Implementation Loop 4 Summary

生成: 2026-06-18 JST

## 実施内容

前回までのループで `attack_monster+4` が白AIの黒耐性改善候補として残ったため、実験用の行動種別補正をそのまま採用せず、白マスター限定の局面評価へ還元できるかを確認した。

- 対象: 3候補
- 相手: 黒2種、デコイ、白基準
- 母数: 15 games/matchup/direction
- 総試合: 360戦
- レポート: `docs/master_lab/results/2026-06-18_white_ai_monster_pressure_impl_loop_4.md`
- JSON: `docs/master_lab/results/2026-06-18_white_ai_monster_pressure_impl_loop_4.json`

## 結果

| Rank | Variant | Overall | vs Black | vs Decoy | vs White | 所感 |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | `pressure_attack_monster_plus4` | 46.7% | 50.0% | 46.7% | 40.0% | 依然として黒耐性が最も高い。白基準に勝ちすぎない。 |
| 2 | `pressure_white_baseline` | 41.7% | 35.0% | 40.0% | 56.7% | 現行基準。黒速攻への弱さが残る。 |
| 3 | `pressure_white_monster_pressure_v1` | 40.8% | 33.3% | 53.3% | 43.3% | 本実装候補としては失敗。黒耐性を再現できない。 |

## 読み

`pressure_white_monster_pressure_v1` は、白マスター限定で「敵モンスターへ実ダメージまたは撃破が入る攻撃」にだけ +4 を付けた候補だった。しかし vs Black は33.3%で、基準の35.0%よりもわずかに悪化した。つまり、`attack_monster+4` の強さは単純な「ダメージが入る敵モンスター攻撃の加点」だけでは説明できない。

今回の結果から見ると、`attack_monster+4` はもう少し広い意思決定を動かしている可能性が高い。たとえば、即時ダメージの大きさだけでなく、攻撃対象の選択、低打点でも相手前衛を削る選択、次ターン撃破圏の作成、マスター攻撃より盤面整理を優先する切り替えなどに効いていると考えられる。

一方で、`pressure_attack_monster_plus4` は今回も vs Black 50.0%で首位だった。前回の12戦母数でも vs Black 54.2%だったため、黒対策としての方向性自体はまだ有力。ただし、実験用の `actionBias` をそのまま白AI本体へ入れると意図が粗く、後から調整理由を追いにくい。

## 判断

今回の `whiteMonsterPressureBonus:4` は採用しない。理由は、黒耐性が基準以下で、`attack_monster+4` の改善要因を再現できていないため。

ただし、コード上は「白マスター限定の状況補正を追加できる」実装経路として有用だった。次は係数を上げるより先に、`pressure_attack_monster_plus4` と `pressure_white_monster_pressure_v1` の意思決定差分を見て、どの局面で勝敗に効く選択が変わっているかを特定する方がよい。

## 次ループ提案

次は追加母数を増やすより、代表seedの差分分析ループにする。

1. `pressure_attack_monster_plus4` が勝ち、`pressure_white_monster_pressure_v1` または基準が負ける黒相手のseedを抽出する。
2. そのseedで序盤4ターン程度の選択差分を出し、どの行動が変わっているかを分類する。
3. 分類軸は `敵前衛を削る`、`敵後衛を削る`、`マスター攻撃を控える`、`盾/ウェイクアップより攻撃を優先する`、`ピグミィの削り位置が変わる` を見る。
4. 差分が「敵モンスター攻撃全般」に寄るなら、次候補は実ダメージ限定ではなく、白限定の `enemyMonsterAttackPressureBonus` として広く試す。
5. 差分が「マスター攻撃を控える」に寄るなら、攻撃加点ではなく、非リーサル時のマスター攻撃抑制を別候補にする。

## 現時点の判断

白AIの第一改善軸は、引き続き `attack_monster+4` 相当の盤面処理寄せでよい。ただし、今回の還元案は狭すぎた。次は勝率比較ではなく意思決定差分を先に取り、改善要因を特定してから本体AI候補を作る。
