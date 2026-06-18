# White AI Situational Loop 2 Summary

生成: 2026-06-18 JST

## 実施内容

前回提案の「状況限定評価」を実験用 `situationalBias` として追加し、`attack_monster+4` 単独と比較した。

- 対象: 5候補
- 相手: 黒2種、デコイ、白基準
- 母数: 10 games/matchup/direction
- 総試合: 400戦
- レポート: `docs/master_lab/results/2026-06-18_white_ai_situational_loop_2.md`
- JSON: `docs/master_lab/results/2026-06-18_white_ai_situational_loop_2.json`

## 結果

| Rank | Variant | Overall | vs Black | vs Decoy | vs White | 所感 |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | `pressure_attack_monster_plus4` | 48.8% | 52.5% | 45.0% | 45.0% | 黒耐性が最も高く、白基準にも勝ちすぎない。 |
| 2 | `pressure_attack_monster4_anti_berserk_front` | 50.0% | 37.5% | 65.0% | 60.0% | 黒に効かず、白/デコイへ寄りすぎ。 |
| 3 | `pressure_white_baseline` | 48.8% | 32.5% | 65.0% | 65.0% | seed帯では黒に明確に弱い。 |
| 4 | `pressure_attack_monster4_stone_conserve` | 40.0% | 37.5% | 45.0% | 40.0% | LowSは48.6%まで下がったが勝率も落ちた。 |
| 5 | `pressure_attack_monster4_shield_convert` | 35.0% | 27.5% | 45.0% | 40.0% | 盾使用が増え、成果化率は改善せず。 |

## 読み

今回の収穫は、状況限定案が `attack_monster+4` 単独を超えなかったこと。特に `shieldConversionBonus` は、期待した「成果化する盾だけ増える」挙動にならず、シールド使用数を増やして勝率を落とした。今の近似条件では、次ターンの攻撃可能性を広く取りすぎている可能性が高い。

`setupLowStonePenalty` は `LowS` を54.0%から48.6%へ下げたが、勝率も落ちた。石を残すこと自体は必要だが、単純に低石布石を罰すると、必要な展開や守りまで削ってしまう。

`antiBerserkFrontBonus` はデコイ/白には強く見えたが、肝心の黒耐性は37.5%まで落ちた。敵前衛処理の加点対象が広く、黒のバーサク打点源を潰すというより、前衛への寄り道を増やした可能性がある。

一方、`attack_monster+4` は前回768戦に続いて上位に残り、今回は vs Black 52.5%まで伸びた。白基準への勝率45.0%なので、白が基準という方針にも反しにくい。

## 次ループ提案

次は状況限定案の深掘りを一旦止め、`attack_monster` 補正の強度確認に寄せる。

1. `pressure_white_baseline`
2. `pressure_attack_monster_plus2`
3. `pressure_attack_monster_plus4`
4. `pressure_attack_monster_plus6`
5. `pressure_attack_monster_plus4_shield_minus2`

母数は `games-per-matchup 10-12`。`+4` が再度上位なら、実験用 `actionBias` ではなく白AIの局面評価へ「敵モンスターへの有効打/撃破を薄く上げる」形で還元する。`shield_minus2` は、成果化しない盾が多い問題への軽い対照実験として見る。

## 現時点の判断

白AI改善の本命は `attack_monster+4` 相当。状況限定評価は方向性としては悪くないが、今回の近似では荒すぎる。実装へ進めるなら、まず薄い盤面処理補正を本体AIに還元し、その後に「盾対象が次ターン成果化するか」をより厳密な局面読みとして別途設計するのがよい。
