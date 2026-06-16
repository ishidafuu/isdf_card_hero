# Master Lab Improvement Loop: timing

生成: 2026-06-16T22:46:44.597Z
ループ数: 5
試行: 30 games/matchup（5 matchups）

## Conclusion

判定: continue_deck_loop

明確な採用候補はまだ本検証待ちだが、候補間の差は出ている。候補を絞り、同系統の微調整を続ける価値がある。

### Reasons

- tempo_no_lostone_1403_quick_shift8: master-lab-tempo-1403-no-lostone / overall 68.3% / vs Black 53.3%
- baselineとの差分は black +3.3%, overall +7.5%
- vs Black 50%以上の安定候補が 3 件ある

### Next Steps

- 上位3候補だけ games-per-matchup 20-30 で中間検証する。
- 共通カードを抽出して、候補向けの小さな固定デッキ候補を作る。
- 伸びが鈍れば、特技評価パラメータ比較へ切り替える。

## Summary

- 5ループ / 750戦スクリーニング。failure は0、warning は0。
- ミラーを除く候補側の最高スコアは `tempo_no_lostone_1403_quick_shift8`（ロストーンなし: 1403派生 / クイック+8 / シフト+8）の score 64.3。overall 68.3%、vs Black 53.3%。
- 最上位のクイックコール率は 53.1%、シフト率は 14.3%。展開前倒しが主軸で、シフトは補助に収まっているかを見る。
- 基準にした `tempo_no_lostone_quick_call_plus16` は overall 60.8%、vs Black 50%。差分は black +3.3%、overall +7.5%。
- vs Black 50%以上かつ warning 1件以下の候補は 3 件。横展開より、上位候補の中母数再検証に進む段階。
- 中間検証でもシフト率が高く勝率が伸びないなら、位置調整ではなくクイックコール中心の設計へさらに寄せる。

## Next Loop Proposal

- 提案: 上位テンポ条件の再現性確認を優先する。次は候補数を絞り、games-per-matchup を 20-30 に上げる。
- 次回候補: `tempo_no_lostone_1403_quick_shift8` (master-lab-tempo-1403-no-lostone, score 64.3) / `tempo_no_lostone_eager_margin_minus4` (pressure-normal, score 59.3) / `tempo_no_lostone_black_margin12` (black-pressure, score 58.8) / `tempo_no_lostone_quick_call_plus16` (pressure-normal, score 58.4)
- 目安: スクリーニング継続なら20-24ループ、本採用前の再現性確認なら3-5候補に絞って各100-150戦。
- 分岐: 中母数でも vs Black 50%を維持し warning が少なければ、Final Gate とデッキ微調整へ進む。崩れるならクイックコール補正と採用marginの再探索へ戻る。

## Loop Schedule

| Loop | Kind | Experiment | Deck | AI Eval | Hypothesis |
| ---: | --- | --- | --- | --- | --- |
| 1 | ai_eval | tempo_no_lostone_1403_quick_shift8<br>ロストーンなし: 1403派生 / クイック+8 / シフト+8 | master-lab-tempo-1403-no-lostone<br>テンポ実験: 1403ロストーン抜き | margin +8<br>quick_call +8<br>shift +8 | 前回最上位からロストーンを抜き、白への勝ちすぎがカード依存だったか確認する。 |
| 2 | ai_eval | tempo_no_lostone_quick_call_plus16<br>ロストーンなし: pressure / クイック+16 | pressure-normal<br>通常プレッシャー | margin +8<br>quick_call +16 | ロストーンを使わない基準構成で、クイックコール主軸の再現性を見る。 |
| 3 | deck | tempo_no_lostone_margin12<br>ロストーンなし: pressure / margin+12 | pressure-normal<br>通常プレッシャー | margin +12 | 慎重採用でも白黒に対して過剰にならないか確認する。 |
| 4 | deck | tempo_no_lostone_eager_margin_minus4<br>ロストーンなし: pressure / margin-4 | pressure-normal<br>通常プレッシャー | margin -4 | 特技を早めに切るだけで成立するかを再確認する。 |
| 5 | deck | tempo_no_lostone_black_margin12<br>ロストーンなし: black-pressure / margin+12 | black-pressure<br>ブラック検証 | margin +12 | ロストーンを使わない黒寄り構成で、白に勝ちすぎない範囲を探る。 |

## Top Candidates

| Rank | Loop | Deck | Score | Overall | vs Black | vs White | Loss Opp HP | Usage | Magic | Issues | Judgement |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | 1 | tempo_no_lostone_1403_quick_shift8<br>ロストーンなし: 1403派生 / クイック+8 / シフト+8<br>master-lab-tempo-1403-no-lostone | 64.3 | 82-38<br>68.3% | 32-28<br>53.3% | 50-10<br>83.3% | 3.7 | Q 53.1%<br>Shift 14.3%<br>S 0% (E 0%)<br>P 0%<br>A 32.5% | リ・シャッフル 192<br>黄昏の風 37<br>ローテーション 37 | 0F/0W | advance |
| 2 | 4 | tempo_no_lostone_eager_margin_minus4<br>ロストーンなし: pressure / margin-4<br>pressure-normal | 59.3 | 75-45<br>62.5% | 29-31<br>48.3% | 46-14<br>76.7% | 3.6 | Q 53.1%<br>Shift 15.5%<br>S 0% (E 0%)<br>P 0%<br>A 31.5% | ローテーション 41 | 0F/0W | advance |
| 3 | 5 | tempo_no_lostone_black_margin12<br>ロストーンなし: black-pressure / margin+12<br>black-pressure | 58.8 | 76-44<br>63.3% | 26-34<br>43.3% | 50-10<br>83.3% | 3.9 | Q 54.1%<br>Shift 22.7%<br>S 0% (E 0%)<br>P 0%<br>A 23.3% | 二重の盾 178<br>ローテーション 75<br>ウェイクアップ 60 | 0F/0W | hold |
| 4 | 2 | tempo_no_lostone_quick_call_plus16<br>ロストーンなし: pressure / クイック+16<br>pressure-normal | 58.4 | 73-47<br>60.8% | 30-30<br>50% | 43-17<br>71.7% | 3.8 | Q 58.2%<br>Shift 17%<br>S 0% (E 0%)<br>P 0%<br>A 24.7% | ローテーション 38 | 0F/0W | hold |
| 5 | 3 | tempo_no_lostone_margin12<br>ロストーンなし: pressure / margin+12<br>pressure-normal | 58.4 | 73-47<br>60.8% | 30-30<br>50% | 43-17<br>71.7% | 3.7 | Q 59.4%<br>Shift 18%<br>S 0% (E 0%)<br>P 0%<br>A 22.7% | ローテーション 44 | 0F/0W | hold |

## Loop Results

| Loop | Deck | Hypothesis | Score | Overall | vs Black | vs White | Avg Turns | Loss Opp HP | Action Usage | Magic | Issues | Judgement |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | tempo_no_lostone_1403_quick_shift8<br>ロストーンなし: 1403派生 / クイック+8 / シフト+8<br>master-lab-tempo-1403-no-lostone<br>master black / Master Lab / normal only | 前回最上位からロストーンを抜き、白への勝ちすぎがカード依存だったか確認する。 | 64.3 | 82-38<br>68.3% | 32-28<br>53.3% | 50-10<br>83.3% | 15 | 3.7 | Q 53.1%<br>Shift 14.3%<br>S 0% (E 0%)<br>P 0%<br>A 32.5% | リ・シャッフル 192<br>黄昏の風 37<br>ローテーション 37 | 0F/0W | advance |
| 2 | tempo_no_lostone_quick_call_plus16<br>ロストーンなし: pressure / クイック+16<br>pressure-normal<br>master - / built-in / normal only | ロストーンを使わない基準構成で、クイックコール主軸の再現性を見る。 | 58.4 | 73-47<br>60.8% | 30-30<br>50% | 43-17<br>71.7% | 13.2 | 3.8 | Q 58.2%<br>Shift 17%<br>S 0% (E 0%)<br>P 0%<br>A 24.7% | ローテーション 38 | 0F/0W | hold |
| 3 | tempo_no_lostone_margin12<br>ロストーンなし: pressure / margin+12<br>pressure-normal<br>master - / built-in / normal only | 慎重採用でも白黒に対して過剰にならないか確認する。 | 58.4 | 73-47<br>60.8% | 30-30<br>50% | 43-17<br>71.7% | 12.9 | 3.7 | Q 59.4%<br>Shift 18%<br>S 0% (E 0%)<br>P 0%<br>A 22.7% | ローテーション 44 | 0F/0W | hold |
| 4 | tempo_no_lostone_eager_margin_minus4<br>ロストーンなし: pressure / margin-4<br>pressure-normal<br>master - / built-in / normal only | 特技を早めに切るだけで成立するかを再確認する。 | 59.3 | 75-45<br>62.5% | 29-31<br>48.3% | 46-14<br>76.7% | 13.1 | 3.6 | Q 53.1%<br>Shift 15.5%<br>S 0% (E 0%)<br>P 0%<br>A 31.5% | ローテーション 41 | 0F/0W | advance |
| 5 | tempo_no_lostone_black_margin12<br>ロストーンなし: black-pressure / margin+12<br>black-pressure<br>master - / built-in / normal only | ロストーンを使わない黒寄り構成で、白に勝ちすぎない範囲を探る。 | 58.8 | 76-44<br>63.3% | 26-34<br>43.3% | 50-10<br>83.3% | 16.1 | 3.9 | Q 54.1%<br>Shift 22.7%<br>S 0% (E 0%)<br>P 0%<br>A 23.3% | 二重の盾 178<br>ローテーション 75<br>ウェイクアップ 60 | 0F/0W | hold |

## Loop Notes

### Loop 1: ロストーンなし: 1403派生 / クイック+8 / シフト+8

- 対象: `master-lab-tempo-1403-no-lostone`（master black / Master Lab / normal only）。前回最上位からロストーンを抜き、白への勝ちすぎがカード依存だったか確認する。
- AI評価: margin +8<br>quick_call +8<br>shift +8
- 結果: score 64.3、overall 82-38 / 68.3%、vs Black 32-28 / 53.3%、vs White 50-10 / 83.3%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 全体では五分以上だが、黒相手の再現性はまだ足りない。 負け試合の相手残HP平均は 3.7 で、惜敗寄り。
- 特技傾向: クイックコール率 53.1% は高めで、展開前倒しを主軸にしている。 シフト率 14.3% は控えめで、補助的な陣形手直しに留まっている。 スケープゴート率 0% は比較的抑えられている。 敵スケープゴート率 0% はほぼ出ておらず、実質は味方保護に寄っている。 挑発率 0% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 32.5% が高く、特技より通常攻撃へ逃げる場面が多い。
- マジック使用: リ・シャッフル 192回 / 黄昏の風 37回 / ローテーション 37回
- 次アクション: 100戦マトリクスへ進め、黒相手と白相手の再現性を確認する。

### Loop 2: ロストーンなし: pressure / クイック+16

- 対象: `pressure-normal`（master - / built-in / normal only）。ロストーンを使わない基準構成で、クイックコール主軸の再現性を見る。
- AI評価: margin +8<br>quick_call +16
- 結果: score 58.4、overall 73-47 / 60.8%、vs Black 30-30 / 50%、vs White 43-17 / 71.7%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 全体では五分以上だが、黒相手の再現性はまだ足りない。 負け試合の相手残HP平均は 3.8 で、惜敗寄り。
- 特技傾向: クイックコール率 58.2% は高めで、展開前倒しを主軸にしている。 シフト率 17% は控えめで、補助的な陣形手直しに留まっている。 スケープゴート率 0% は比較的抑えられている。 敵スケープゴート率 0% はほぼ出ておらず、実質は味方保護に寄っている。 挑発率 0% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 24.7% が高く、特技より通常攻撃へ逃げる場面が多い。
- マジック使用: ローテーション 38回
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

### Loop 3: ロストーンなし: pressure / margin+12

- 対象: `pressure-normal`（master - / built-in / normal only）。慎重採用でも白黒に対して過剰にならないか確認する。
- AI評価: margin +12
- 結果: score 58.4、overall 73-47 / 60.8%、vs Black 30-30 / 50%、vs White 43-17 / 71.7%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 全体では五分以上だが、黒相手の再現性はまだ足りない。 負け試合の相手残HP平均は 3.7 で、惜敗寄り。
- 特技傾向: クイックコール率 59.4% は高めで、展開前倒しを主軸にしている。 シフト率 18% は控えめで、補助的な陣形手直しに留まっている。 スケープゴート率 0% は比較的抑えられている。 敵スケープゴート率 0% はほぼ出ておらず、実質は味方保護に寄っている。 挑発率 0% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 22.7% が高く、特技より通常攻撃へ逃げる場面が多い。
- マジック使用: ローテーション 44回
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

### Loop 4: ロストーンなし: pressure / margin-4

- 対象: `pressure-normal`（master - / built-in / normal only）。特技を早めに切るだけで成立するかを再確認する。
- AI評価: margin -4
- 結果: score 59.3、overall 75-45 / 62.5%、vs Black 29-31 / 48.3%、vs White 46-14 / 76.7%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 全体では五分以上だが、黒相手の再現性はまだ足りない。 負け試合の相手残HP平均は 3.6 で、惜敗寄り。
- 特技傾向: クイックコール率 53.1% は高めで、展開前倒しを主軸にしている。 シフト率 15.5% は控えめで、補助的な陣形手直しに留まっている。 スケープゴート率 0% は比較的抑えられている。 敵スケープゴート率 0% はほぼ出ておらず、実質は味方保護に寄っている。 挑発率 0% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 31.5% が高く、特技より通常攻撃へ逃げる場面が多い。
- マジック使用: ローテーション 41回
- 次アクション: 100戦マトリクスへ進め、黒相手と白相手の再現性を確認する。

### Loop 5: ロストーンなし: black-pressure / margin+12

- 対象: `black-pressure`（master - / built-in / normal only）。ロストーンを使わない黒寄り構成で、白に勝ちすぎない範囲を探る。
- AI評価: margin +12
- 結果: score 58.8、overall 76-44 / 63.3%、vs Black 26-34 / 43.3%、vs White 50-10 / 83.3%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 全体では五分以上だが、黒相手の再現性はまだ足りない。 負け試合の相手残HP平均は 3.9 で、惜敗寄り。
- 特技傾向: クイックコール率 54.1% は高めで、展開前倒しを主軸にしている。 シフト率 22.7% は控えめで、補助的な陣形手直しに留まっている。 スケープゴート率 0% は比較的抑えられている。 敵スケープゴート率 0% はほぼ出ておらず、実質は味方保護に寄っている。 挑発率 0% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 23.3% が高く、特技より通常攻撃へ逃げる場面が多い。
- マジック使用: 二重の盾 178回 / ローテーション 75回 / ウェイクアップ 60回
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

## Reading

- `Overall` はミラーを除いた候補側の勝率。白/黒それぞれを相手にした両座席の合算を見る。
- `Loss Opp HP` は候補側敗北時の相手マスター残HP平均。低いほど惜敗、高いほど押し切られている。
- `Usage` の `Q` はクイックコール率、`Shift` はシフト率。どちらもMaster Lab特技選択内の比率。
- `Magic` は通常マジックカードとして実際に使われた上位カード。Master Lab特技は含めない。
- このループはスクリーニングであり、上位候補は中母数または100戦マトリクスで再確認する。
