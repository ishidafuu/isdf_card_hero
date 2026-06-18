# White AI Attack Monster Strength Loop 3 Summary

生成: 2026-06-18 JST

## 実施内容

`attack_monster+4` が複数ループで上位に残ったため、補正強度を `+2 / +4 / +6` と `+4 + shield-2` で比較した。

- 対象: 5候補
- 相手: 黒2種、デコイ、白基準
- 母数: 12 games/matchup/direction
- 総試合: 480戦
- レポート: `docs/master_lab/results/2026-06-18_white_ai_attack_monster_strength_loop_3.md`
- JSON: `docs/master_lab/results/2026-06-18_white_ai_attack_monster_strength_loop_3.json`

## 結果

| Rank | Variant | Overall | vs Black | vs Decoy | vs White | 所感 |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | `pressure_attack_monster_plus4` | 50.0% | 54.2% | 54.2% | 37.5% | 黒耐性が最も高く、白基準に勝ちすぎない。 |
| 2 | `pressure_attack_monster_plus6` | 51.0% | 43.8% | 66.7% | 50.0% | 全体は高いが、黒耐性では+4に劣る。 |
| 3 | `pressure_attack_monster_plus2` | 44.8% | 33.3% | 66.7% | 45.8% | 補正不足。黒速攻に間に合わない。 |
| 4 | `pressure_white_baseline` | 52.1% | 39.6% | 70.8% | 58.3% | 全体は高いが、黒に弱く白/デコイへ寄る。 |
| 5 | `pressure_attack_monster_plus4_shield_minus2` | 33.3% | 20.8% | 54.2% | 37.5% | 盾抑制は大きく悪化。 |

## 読み

`attack_monster+4` は三回連続で本命になった。今回も vs Black 54.2% で最も高く、デコイにも54.2%、白基準には37.5%。白基準へ勝ちすぎる問題はなく、むしろ黒速攻への耐性だけを上げる方向に見える。

`+6` は overall 51.0% で高いが、vs Black は43.8%まで落ちた。盤面処理を強くしすぎると、黒相手に必要なタイミング以外でも寄り道が増え、黒速攻への実効耐性は落ちる可能性がある。

`+2` は黒耐性33.3%で不足。`+4 + shield-2` はシールド使用回数こそ大きく減っておらず、勝率だけ悪化した。成果化しない盾が問題でも、単純にシールド行動を下げるのは危険。

Intent 指標では、全候補で `LowS` と `盾の成果化不足` は残っている。ここは `attack_monster` 補正では解決しない別課題。ただし、白AIの第一改善としては、石管理より先に「黒に押し切られないための薄い盤面処理補正」を入れる方が収穫が大きい。

## 次ループ提案

次はこれ以上の係数探索ではなく、`attack_monster+4` 相当を白AI本体へどう還元するかを見る。

1. 実験用 `actionBias` ではなく、白AI限定で敵モンスターへの有効打/撃破評価を薄く上げる候補を作る。
2. 比較候補は `pressure_white_baseline`、実験用 `pressure_attack_monster_plus4`、本実装候補の3つに絞る。
3. `games-per-matchup 12-15` で確認し、vs Black が45%以上、vs White が60%未満、0F/1W以下なら採用候補にする。
4. 採用後も `LowS` と `ShieldConv` は別課題として残し、次の改善軸にする。

## 現時点の判断

白AI改善の第一候補は `attack_monster+4` 相当でほぼ固まった。`+2` は弱く、`+6` は黒耐性が落ち、`shield-2` は悪化。次は探索ループより、本体AIへ還元する小さな実装ループへ進むのがよい。
