# White AI Turn Intent Loop Summary

生成: 2026-06-18 JST

## 実施内容

前回の「このターンの仕事 / 次ターンへの布石」設計を受け、白AI調整ループに `Intent` 診断を追加した。

- 対象: 8候補
- 相手: 黒2種、デコイ、白基準
- 母数: 12 games/matchup/direction
- 総試合: 768戦
- レポート: `docs/master_lab/results/2026-06-18_white_ai_turn_intent_loop_1.md`
- JSON: `docs/master_lab/results/2026-06-18_white_ai_turn_intent_loop_1.json`

## 結果

| Rank | Variant | Overall | vs Black | vs Decoy | vs White | Intent所感 |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | `pressure_attack_monster_plus4` | 50.0% | 45.8% | 58.3% | 50.0% | 薄い盤面処理補正が一番安定。Poly目的化も76.0%で高い。 |
| 2 | `pressure_attack_monster8_shield4` | 49.0% | 43.8% | 66.7% | 41.7% | 黒耐性は次点だが、盾使用が多くLowS 55.4%。 |
| 3 | `stone_guard_no_proactive_shield` | 49.0% | 41.7% | 75.0% | 37.5% | 石温存方向でもLowSは51.0%までしか下がらず、白基準にも弱い。 |
| 4 | `weights_deny_attack_monster8` | 51.0% | 37.5% | 66.7% | 62.5% | 全体勝率は高いが黒に弱く、白に勝ちすぎる。 |
| 7 | `pressure_white_baseline` | 41.7% | 39.6% | 41.7% | 45.8% | 現行基準。黒耐性は中位だが全体的に押され気味。 |

## 読み

強い `attack_monster+8` や拒否重みは、全体勝率や白基準への勝率を上げる局面はあるが、黒速攻への安定解にはならなかった。今回もっとも良かったのは `attack_monster+4` で、黒耐性45.8%、白基準50.0%、デコイ58.3%に収まっている。白が基準という前提から見ると、これは強すぎず弱すぎず、恒久化候補として一番扱いやすい。

ただし、上位候補でも `LowS` が50%超で、布石行動の後に石が1以下になりすぎている。`ShieldConv` もおおむね50%前後で、守った駒が次ターン成果へ変換される率はまだ十分ではない。単純に盾を増やす、攻撃を増やすというより、石を残せる時だけ布石を置く条件付けが必要。

ポリスピナーは `pressure_attack_monster_plus4` と `pressure_attack_monster8_shield4` で目的化率が高い。一方、ピグミィの小打点は回数こそ多いが、撃破圏作りとしての寄与率はまだ低い。次はピグミィを直接強化するより、敵HPを削った後に次の撃破/レベルアップが見えているかを局面評価へ入れる方がよい。

## 次ループ提案

次は候補数を減らし、`pressure_attack_monster_plus4` を中心に状況限定評価を試す。

1. `pressure_white_baseline`
2. `pressure_attack_monster_plus4`
3. `attack_monster+4 + stone conservation`: 布石後に石が1以下になる手を少し下げる。
4. `attack_monster+4 + shield conversion`: シールド対象が次ターン攻撃/撃破/レベルアップできる時だけ加点する。
5. `attack_monster+4 + anti-berserk front`: 黒相手、または相手がバーサク可能な時だけ敵前衛処理を加点する。

母数は `games-per-matchup 10-12` でよい。今回の768戦は有効だったが、履歴診断付きでは重い。次は5候補 x 4相手 x 両席 x 10-12、つまり400-480戦程度に抑え、必要なら上位2候補だけ追加で20-30に増やす。

## 現時点の判断

白AIの次の本命は、全局面の `attack_monster+4` 固定ではなく、「盤面処理を少し優先するが、石を枯らす布石と成果化しない盾を避ける」方向。今回の結果だけで恒久プロファイルへ反映するなら `attack_monster+4` 相当を薄く入れるのが最も無難だが、より白らしくするには次ループで条件付き評価へ落とすべき。
