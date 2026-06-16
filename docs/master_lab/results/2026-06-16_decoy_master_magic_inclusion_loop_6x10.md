# Master Lab Improvement Loop: decoy

生成: 2026-06-16T07:18:28.550Z
ループ数: 6
試行: 10 games/matchup（5 matchups）

## Conclusion

判定: pivot_to_action_design

デッキ差し替えだけでは黒速攻への耐性が伸び切っていない。次はデコイ特技の評価式やコスト、発動タイミングを触る段階。

### Reasons

- best vs Black 40% が45%未満
- stable top count 1 件で、デッキ側に再現性のある改善が少ない
- baselineとの差分は black -5%, overall +5%

### Next Steps

- 挑発を「行動前の高打点」へ寄せる評価を追加し、バーサク突撃の受け先を早く作る。
- スケープゴートは連打率を抑え、守る価値の高い駒だけに寄せる。
- 次ループはデッキ固定で、特技評価パラメータだけを10-20候補比較する。

## Summary

- 6ループ / 300戦スクリーニング。failure は0、warning は0。
- ミラーを除くデコイ側の最高スコアは `magic_stable_control`（投入: 安定マジック）の score 48.4。overall 50%、vs Black 40%。
- 最上位の敵スケープゴート率は 35.6%（スケープゴート内比率）。味方保護だけで勝っているのか、敵対象で戦い方が変わったのかを次回判断材料にする。
- 基準にした `magic_baseline_black_pressure` は overall 45%、vs Black 45%。差分は black -5%、overall +5%。
- vs Black 50%以上かつ warning 1件以下の候補は 1 件。横展開より、上位候補の中母数再検証に進む段階。
- 中間検証でもスケープゴート率80%超かつ敵対象率5%未満が続くなら、単なる味方保護マスターに戻っているため、評価式より特技設計側の見直しを優先する。

## Next Loop Proposal

- 提案: デッキ差だけでは伸びが鈍い。次はデッキを固定し、挑発/スケープゴート評価補正だけを20候補ほど比較する。
- 次回候補: `magic_stable_control` (master-lab-decoy-magic-stable, score 48.4)
- 目安: スクリーニング継続なら20-24ループ、本採用前の再現性確認なら3-5候補に絞って各100-150戦。
- 分岐: 上位でも敵スケープゴート率が5%未満なら、敵対象バイアスをさらに強めるより、敵に付けた時だけ価値が出る新特技案へ切り替える。

## Loop Schedule

| Loop | Kind | Experiment | Deck | AI Eval | Hypothesis |
| ---: | --- | --- | --- | --- | --- |
| 1 | deck | magic_baseline_black_pressure<br>基準: black-pressure | black-pressure<br>ブラック検証 | margin +12<br>target enemy +16 | 前回基準。マジック差し替え前の勝率、警告、通常マジック使用回数を再確認する。 |
| 2 | deck | magic_stable_control<br>投入: 安定マジック | master-lab-decoy-magic-stable<br>デコイ実験: 安定マジック | margin +12<br>target enemy +16 | リ・シャッフルと盾を増やし、デコイの受けを継戦力へ変換できるか見る。 |
| 3 | deck | magic_removal<br>投入: 除去マジック | master-lab-decoy-magic-removal<br>デコイ実験: 除去マジック | margin +12<br>target enemy +16 | 仮想機会の多かった除去札で、敵盤面を直接減らして黒速攻を止められるか見る。 |
| 4 | deck | magic_burst<br>投入: バースト | master-lab-decoy-magic-burst<br>デコイ実験: バースト | margin +12<br>target enemy +16 | 受けた後の反撃速度を上げ、デコイが守るだけで終わらない形になるか見る。 |
| 5 | deck | magic_tech<br>投入: テック | master-lab-decoy-magic-tech<br>デコイ実験: テック | margin +12<br>target enemy +16 | 誘惑、ヒーリング、ロストーン、リターンで状況対応力が勝率に出るか見る。 |
| 6 | deck | magic_finisher_thunder<br>投入: サンダー1枚 | master-lab-decoy-magic-finisher<br>デコイ実験: サンダー1枚 | margin +12<br>target enemy +16 | サンダーを1枚だけ入れ、勝ち切り札としての伸びとピーキーな副作用を分けて見る。 |

## Top Candidates

| Rank | Loop | Deck | Score | Overall | vs Black | vs White | Loss Opp HP | Usage | Magic | Issues | Judgement |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | 2 | magic_stable_control<br>投入: 安定マジック<br>master-lab-decoy-magic-stable | 48.4 | 20-20<br>50% | 8-12<br>40% | 12-8<br>60% | 4.4 | S 96% (E 35.6%)<br>P 3.9%<br>A 0.1% | 二重の盾 112<br>リ・シャッフル 67<br>竜の盾 51<br>ウェイクアップ 29 | 0F/0W | advance |
| 2 | 3 | magic_removal<br>投入: 除去マジック<br>master-lab-decoy-magic-removal | 48.2 | 19-21<br>47.5% | 10-10<br>50% | 9-11<br>45% | 4.3 | S 97.7% (E 43.2%)<br>P 2.1%<br>A 0.2% | スパーク 66<br>マッドファイア 61<br>二重の盾 52<br>ウェイクアップ 36 | 0F/0W | hold |
| 3 | 1 | magic_baseline_black_pressure<br>基準: black-pressure<br>black-pressure | 45.2 | 18-22<br>45% | 9-11<br>45% | 9-11<br>45% | 5.1 | S 94.8% (E 39.7%)<br>P 5.1%<br>A 0.1% | 二重の盾 56<br>ローテーション 25<br>ウェイクアップ 24<br>再生 1 | 0F/0W | hold |
| 4 | 6 | magic_finisher_thunder<br>投入: サンダー1枚<br>master-lab-decoy-magic-finisher | 40.3 | 16-24<br>40% | 7-13<br>35% | 9-11<br>45% | 4.8 | S 95.5% (E 39.4%)<br>P 4.2%<br>A 0.3% | 二重の盾 54<br>サンダー 50<br>ウェイクアップ 27<br>ローテーション 24 | 0F/0W | reject |
| 5 | 5 | magic_tech<br>投入: テック<br>master-lab-decoy-magic-tech | 37 | 14-26<br>35% | 7-13<br>35% | 7-13<br>35% | 4.3 | S 96.3% (E 40.9%)<br>P 3.6%<br>A 0.1% | 誘惑 55<br>二重の盾 53<br>ヒーリング 45<br>リターン 39 | 0F/0W | reject |

## Loop Results

| Loop | Deck | Hypothesis | Score | Overall | vs Black | vs White | Avg Turns | Loss Opp HP | Action Usage | Magic | Issues | Judgement |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | magic_baseline_black_pressure<br>基準: black-pressure<br>black-pressure<br>master - / built-in / normal only | 前回基準。マジック差し替え前の勝率、警告、通常マジック使用回数を再確認する。 | 45.2 | 18-22<br>45% | 9-11<br>45% | 9-11<br>45% | 16.5 | 5.1 | S 94.8% (E 39.7%)<br>P 5.1%<br>A 0.1% | 二重の盾 56<br>ローテーション 25<br>ウェイクアップ 24<br>再生 1 | 0F/0W | hold |
| 2 | magic_stable_control<br>投入: 安定マジック<br>master-lab-decoy-magic-stable<br>master black / Master Lab / normal only | リ・シャッフルと盾を増やし、デコイの受けを継戦力へ変換できるか見る。 | 48.4 | 20-20<br>50% | 8-12<br>40% | 12-8<br>60% | 16.6 | 4.4 | S 96% (E 35.6%)<br>P 3.9%<br>A 0.1% | 二重の盾 112<br>リ・シャッフル 67<br>竜の盾 51<br>ウェイクアップ 29 | 0F/0W | advance |
| 3 | magic_removal<br>投入: 除去マジック<br>master-lab-decoy-magic-removal<br>master black / Master Lab / normal only | 仮想機会の多かった除去札で、敵盤面を直接減らして黒速攻を止められるか見る。 | 48.2 | 19-21<br>47.5% | 10-10<br>50% | 9-11<br>45% | 17 | 4.3 | S 97.7% (E 43.2%)<br>P 2.1%<br>A 0.2% | スパーク 66<br>マッドファイア 61<br>二重の盾 52<br>ウェイクアップ 36 | 0F/0W | hold |
| 4 | magic_burst<br>投入: バースト<br>master-lab-decoy-magic-burst<br>master black / Master Lab / normal only | 受けた後の反撃速度を上げ、デコイが守るだけで終わらない形になるか見る。 | 28.1 | 11-29<br>27.5% | 3-17<br>15% | 8-12<br>40% | 15.6 | 3.9 | S 97.4% (E 44.7%)<br>P 2.5%<br>A 0.1% | パワーアップ 130<br>バーサクパワー 117<br>二重の盾 44<br>ウェイクアップ 26 | 0F/0W | reject |
| 5 | magic_tech<br>投入: テック<br>master-lab-decoy-magic-tech<br>master black / Master Lab / normal only | 誘惑、ヒーリング、ロストーン、リターンで状況対応力が勝率に出るか見る。 | 37 | 14-26<br>35% | 7-13<br>35% | 7-13<br>35% | 16.9 | 4.3 | S 96.3% (E 40.9%)<br>P 3.6%<br>A 0.1% | 誘惑 55<br>二重の盾 53<br>ヒーリング 45<br>リターン 39 | 0F/0W | reject |
| 6 | magic_finisher_thunder<br>投入: サンダー1枚<br>master-lab-decoy-magic-finisher<br>master black / Master Lab / normal only | サンダーを1枚だけ入れ、勝ち切り札としての伸びとピーキーな副作用を分けて見る。 | 40.3 | 16-24<br>40% | 7-13<br>35% | 9-11<br>45% | 16.2 | 4.8 | S 95.5% (E 39.4%)<br>P 4.2%<br>A 0.3% | 二重の盾 54<br>サンダー 50<br>ウェイクアップ 27<br>ローテーション 24 | 0F/0W | reject |

## Loop Notes

### Loop 1: 基準: black-pressure

- 対象: `black-pressure`（master - / built-in / normal only）。前回基準。マジック差し替え前の勝率、警告、通常マジック使用回数を再確認する。
- AI評価: margin +12<br>target enemy +16
- 結果: score 45.2、overall 18-22 / 45%、vs Black 9-11 / 45%、vs White 9-11 / 45%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 5.1 で、中程度の負け方。
- 特技傾向: スケープゴート率 94.8% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 39.7% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 5.1% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 56回 / ローテーション 25回 / ウェイクアップ 24回 / 再生 1回
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

### Loop 2: 投入: 安定マジック

- 対象: `master-lab-decoy-magic-stable`（master black / Master Lab / normal only）。リ・シャッフルと盾を増やし、デコイの受けを継戦力へ変換できるか見る。
- AI評価: margin +12<br>target enemy +16
- 結果: score 48.4、overall 20-20 / 50%、vs Black 8-12 / 40%、vs White 12-8 / 60%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 全体では五分以上だが、黒相手の再現性はまだ足りない。 負け試合の相手残HP平均は 4.4 で、中程度の負け方。
- 特技傾向: スケープゴート率 96% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 35.6% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 3.9% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 112回 / リ・シャッフル 67回 / 竜の盾 51回 / ウェイクアップ 29回 / ローテーション 15回
- 次アクション: 100戦マトリクスへ進め、黒相手と白相手の再現性を確認する。

### Loop 3: 投入: 除去マジック

- 対象: `master-lab-decoy-magic-removal`（master black / Master Lab / normal only）。仮想機会の多かった除去札で、敵盤面を直接減らして黒速攻を止められるか見る。
- AI評価: margin +12<br>target enemy +16
- 結果: score 48.2、overall 19-21 / 47.5%、vs Black 10-10 / 50%、vs White 9-11 / 45%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 黒相手の受けは見えるが、白相手の盤面制圧にはやや押されている。 負け試合の相手残HP平均は 4.3 で、中程度の負け方。
- 特技傾向: スケープゴート率 97.7% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 43.2% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 2.1% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.2% は低く、防御特技にかなり寄っている。
- マジック使用: スパーク 66回 / マッドファイア 61回 / 二重の盾 52回 / ウェイクアップ 36回 / ブラックレイン 35回 / 大地の怒り 19回
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

### Loop 4: 投入: バースト

- 対象: `master-lab-decoy-magic-burst`（master black / Master Lab / normal only）。受けた後の反撃速度を上げ、デコイが守るだけで終わらない形になるか見る。
- AI評価: margin +12<br>target enemy +16
- 結果: score 28.1、overall 11-29 / 27.5%、vs Black 3-17 / 15%、vs White 8-12 / 40%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 3.9 で、惜敗寄り。
- 特技傾向: スケープゴート率 97.4% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 44.7% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 2.5% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: パワーアップ 130回 / バーサクパワー 117回 / 二重の盾 44回 / ウェイクアップ 26回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 5: 投入: テック

- 対象: `master-lab-decoy-magic-tech`（master black / Master Lab / normal only）。誘惑、ヒーリング、ロストーン、リターンで状況対応力が勝率に出るか見る。
- AI評価: margin +12<br>target enemy +16
- 結果: score 37、overall 14-26 / 35%、vs Black 7-13 / 35%、vs White 7-13 / 35%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.3 で、中程度の負け方。
- 特技傾向: スケープゴート率 96.3% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 40.9% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 3.6% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: 誘惑 55回 / 二重の盾 53回 / ヒーリング 45回 / リターン 39回 / ウェイクアップ 33回 / ロストーン 7回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 6: 投入: サンダー1枚

- 対象: `master-lab-decoy-magic-finisher`（master black / Master Lab / normal only）。サンダーを1枚だけ入れ、勝ち切り札としての伸びとピーキーな副作用を分けて見る。
- AI評価: margin +12<br>target enemy +16
- 結果: score 40.3、overall 16-24 / 40%、vs Black 7-13 / 35%、vs White 9-11 / 45%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.8 で、中程度の負け方。
- 特技傾向: スケープゴート率 95.5% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 39.4% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 4.2% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.3% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 54回 / サンダー 50回 / ウェイクアップ 27回 / ローテーション 24回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

## Reading

- `Overall` はミラーを除いたデコイ側の勝率。白/黒それぞれを相手にした両座席の合算を見る。
- `Loss Opp HP` はデコイ敗北時の相手マスター残HP平均。低いほど惜敗、高いほど押し切られている。
- `Usage` の `S ... (E ...)` は、S がMaster Lab特技内のスケープゴート率、E がスケープゴート内の敵対象率。
- `Magic` は通常マジックカードとして実際に使われた上位カード。Master Lab特技は含めない。
- このループはスクリーニングであり、上位候補は中母数または100戦マトリクスで再確認する。

## Operator Notes

- 今回は「明確に良い型が見えたら上位2-3案を30-50 games/matchupへ増やす」予定だったが、上位の `stable` と `removal` が僅差で、どちらも総合採用と言えるほどは伸びていない。追加中母数へ進むより、次のPDCAへ回す。
- `stable` は overall 50% / vs White 60% で最も安定したが、vs Black は40%。白相手の受けは良くなる一方、黒速攻を止める目的には足りない。
- `removal` は overall 47.5%ながら vs Black 50%。`スパーク` 66回、`マッドファイア` 61回と実際に使われており、黒対策の方向性としては一番収穫がある。
- `burst` は `パワーアップ` 130回、`バーサクパワー` 117回と大量に使われたが、overall 27.5% / vs Black 15%。仮想 opportunity の高評価は実戦投入では過大評価だった可能性が高い。
- `thunder` は1枚でも50回使われたが、overall 40% / vs Black 35%。サンダーは勝ち切り機会だけを見ると強く見えるが、デコイの安定改善にはつながっていない。
- 次はデッキ横展開ではなく、`removal` または `stable` をベースに、挑発率を上げる/スケープゴート過多を抑える評価パラメータループへ進めるのがよい。
