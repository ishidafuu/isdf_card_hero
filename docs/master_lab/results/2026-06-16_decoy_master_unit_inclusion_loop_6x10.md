# Master Lab Improvement Loop: decoy

生成: 2026-06-16T13:08:18.940Z
ループ数: 6
試行: 10 games/matchup（5 matchups）

## Conclusion

判定: pivot_to_action_design

デッキ差し替えだけでは黒速攻への耐性が伸び切っていない。次はデコイ特技の評価式やコスト、発動タイミングを触る段階。

### Reasons

- best vs Black 40% が45%未満
- stable top count 0 件で、デッキ側に再現性のある改善が少ない
- baselineとの差分は black +10%, overall +12.5%

### Next Steps

- 挑発を「行動前の高打点」へ寄せる評価を追加し、バーサク突撃の受け先を早く作る。
- スケープゴートは連打率を抑え、守る価値の高い駒だけに寄せる。
- 次ループはデッキ固定で、特技評価パラメータだけを10-20候補比較する。

## Summary

- 6ループ / 300戦スクリーニング。failure は0、warning は0。
- ミラーを除くデコイ側の最高スコアは `unit_back_stable`（投入: 後衛安定）の score 46.5。overall 47.5%、vs Black 40%。
- 最上位の敵スケープゴート率は 45.2%（スケープゴート内比率）。味方保護だけで勝っているのか、敵対象で戦い方が変わったのかを次回判断材料にする。
- 基準にした `unit_baseline_black_pressure` は overall 35%、vs Black 30%。差分は black +10%、overall +12.5%。
- vs Black 50%以上かつ warning 1件以下の候補は 0 件。ユニット差し替え単体では不足しているため、次は上位デッキを固定して特技評価補正を比較する段階。
- 中間検証でもスケープゴート率80%超かつ敵対象率5%未満が続くなら、単なる味方保護マスターに戻っているため、評価式より特技設計側の見直しを優先する。

## Next Loop Proposal

- 提案: デッキ差だけでは伸びが鈍い。次はデッキを固定し、挑発/スケープゴート評価補正だけを20候補ほど比較する。
- 次回候補: `unit_back_stable`
- 目安: スクリーニング継続なら20-24ループ、本採用前の再現性確認なら3-5候補に絞って各100-150戦。
- 分岐: 上位でも敵スケープゴート率が5%未満なら、敵対象バイアスをさらに強めるより、敵に付けた時だけ価値が出る新特技案へ切り替える。

## Loop Schedule

| Loop | Kind | Experiment | Deck | AI Eval | Hypothesis |
| ---: | --- | --- | --- | --- | --- |
| 1 | deck | unit_baseline_black_pressure<br>基準: black-pressure | black-pressure<br>ブラック検証 | margin +12<br>target enemy +16 | 前回基準。14前衛/8後衛/8マジックのまま、ユニット差し替え前の勝率と特技使用を再確認する。 |
| 2 | deck | unit_front_wall<br>投入: 前衛耐久 | master-lab-decoy-unit-front-wall<br>デコイ実験: 前衛耐久 | margin +12<br>target enemy +16 | ナッツロックル、デスシープ、ボムゾウを増やし、囮で守った前衛が黒速攻を受け止められるか見る。 |
| 3 | deck | unit_front_reach<br>投入: 前衛射程 | master-lab-decoy-unit-front-reach<br>デコイ実験: 前衛射程 | margin +12<br>target enemy +16 | アーシュ＆ロロ、ボムゾウ、神斬丸を増やし、盤面干渉を前衛側で補えるか見る。 |
| 4 | deck | unit_front_growth<br>投入: 前衛育成 | master-lab-decoy-unit-front-growth<br>デコイ実験: 前衛育成 | margin +12<br>target enemy +16 | ダイン、ホロウダイン、ナッツロックルを増やし、守った駒を制圧役に変えられるか見る。 |
| 5 | deck | unit_back_stable<br>投入: 後衛安定 | master-lab-decoy-unit-back-stable<br>デコイ実験: 後衛安定 | margin +12<br>target enemy +16 | フーヨウ、ラティーヌ、バルキャノンを増やし、守る価値の高い後衛が勝率へ出るか見る。 |
| 6 | deck | unit_back_pressure<br>投入: 後衛圧力 | master-lab-decoy-unit-back-pressure<br>デコイ実験: 後衛圧力 | margin +12<br>target enemy +16 | バルキャノン、ビヨンド、ゼックを増やし、敵主力を後衛から削るテンポが黒速攻へ間に合うか見る。 |

## Top Candidates

| Rank | Loop | Deck | Score | Overall | vs Black | vs White | Loss Opp HP | Usage | Magic | Issues | Judgement |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | 5 | unit_back_stable<br>投入: 後衛安定<br>master-lab-decoy-unit-back-stable | 46.5 | 19-21<br>47.5% | 8-12<br>40% | 11-9<br>55% | 4.3 | S 96.5% (E 45.2%)<br>P 3.5%<br>A 0.1% | 二重の盾 63<br>ウェイクアップ 40<br>ローテーション 27 | 0F/0W | reject |
| 2 | 6 | unit_back_pressure<br>投入: 後衛圧力<br>master-lab-decoy-unit-back-pressure | 42.4 | 16-24<br>40% | 9-11<br>45% | 7-13<br>35% | 3.5 | S 96.8% (E 41.5%)<br>P 3.1%<br>A 0.1% | 二重の盾 52<br>ウェイクアップ 29<br>ローテーション 18 | 0F/0W | hold |
| 3 | 1 | unit_baseline_black_pressure<br>基準: black-pressure<br>black-pressure | 35.3 | 14-26<br>35% | 6-14<br>30% | 8-12<br>40% | 4.8 | S 96.1% (E 42%)<br>P 3.8%<br>A 0.1% | 二重の盾 55<br>ウェイクアップ 25<br>ローテーション 21 | 0F/0W | reject |
| 4 | 2 | unit_front_wall<br>投入: 前衛耐久<br>master-lab-decoy-unit-front-wall | 34.6 | 14-26<br>35% | 6-14<br>30% | 8-12<br>40% | 5.6 | S 96.6% (E 38.7%)<br>P 3.3%<br>A 0.1% | 二重の盾 54<br>ウェイクアップ 33<br>ローテーション 27 | 0F/0W | reject |
| 5 | 4 | unit_front_growth<br>投入: 前衛育成<br>master-lab-decoy-unit-front-growth | 28.7 | 11-29<br>27.5% | 4-16<br>20% | 7-13<br>35% | 4.6 | S 96.9% (E 38.7%)<br>P 3%<br>A 0.1% | 二重の盾 50<br>ウェイクアップ 28<br>ローテーション 20 | 0F/0W | reject |

## Loop Results

| Loop | Deck | Hypothesis | Score | Overall | vs Black | vs White | Avg Turns | Loss Opp HP | Action Usage | Magic | Issues | Judgement |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | unit_baseline_black_pressure<br>基準: black-pressure<br>black-pressure<br>master - / built-in / normal only | 前回基準。14前衛/8後衛/8マジックのまま、ユニット差し替え前の勝率と特技使用を再確認する。 | 35.3 | 14-26<br>35% | 6-14<br>30% | 8-12<br>40% | 16.8 | 4.8 | S 96.1% (E 42%)<br>P 3.8%<br>A 0.1% | 二重の盾 55<br>ウェイクアップ 25<br>ローテーション 21 | 0F/0W | reject |
| 2 | unit_front_wall<br>投入: 前衛耐久<br>master-lab-decoy-unit-front-wall<br>master black / Master Lab / normal only | ナッツロックル、デスシープ、ボムゾウを増やし、囮で守った前衛が黒速攻を受け止められるか見る。 | 34.6 | 14-26<br>35% | 6-14<br>30% | 8-12<br>40% | 17.1 | 5.6 | S 96.6% (E 38.7%)<br>P 3.3%<br>A 0.1% | 二重の盾 54<br>ウェイクアップ 33<br>ローテーション 27 | 0F/0W | reject |
| 3 | unit_front_reach<br>投入: 前衛射程<br>master-lab-decoy-unit-front-reach<br>master black / Master Lab / normal only | アーシュ＆ロロ、ボムゾウ、神斬丸を増やし、盤面干渉を前衛側で補えるか見る。 | 24.1 | 9-31<br>22.5% | 3-17<br>15% | 6-14<br>30% | 15.4 | 5.0 | S 96.1% (E 41.4%)<br>P 3.7%<br>A 0.2% | 二重の盾 55<br>ウェイクアップ 32<br>ローテーション 21 | 0F/0W | reject |
| 4 | unit_front_growth<br>投入: 前衛育成<br>master-lab-decoy-unit-front-growth<br>master black / Master Lab / normal only | ダイン、ホロウダイン、ナッツロックルを増やし、守った駒を制圧役に変えられるか見る。 | 28.7 | 11-29<br>27.5% | 4-16<br>20% | 7-13<br>35% | 15.4 | 4.6 | S 96.9% (E 38.7%)<br>P 3%<br>A 0.1% | 二重の盾 50<br>ウェイクアップ 28<br>ローテーション 20 | 0F/0W | reject |
| 5 | unit_back_stable<br>投入: 後衛安定<br>master-lab-decoy-unit-back-stable<br>master black / Master Lab / normal only | フーヨウ、ラティーヌ、バルキャノンを増やし、守る価値の高い後衛が勝率へ出るか見る。 | 46.5 | 19-21<br>47.5% | 8-12<br>40% | 11-9<br>55% | 19.3 | 4.3 | S 96.5% (E 45.2%)<br>P 3.5%<br>A 0.1% | 二重の盾 63<br>ウェイクアップ 40<br>ローテーション 27 | 0F/0W | reject |
| 6 | unit_back_pressure<br>投入: 後衛圧力<br>master-lab-decoy-unit-back-pressure<br>master black / Master Lab / normal only | バルキャノン、ビヨンド、ゼックを増やし、敵主力を後衛から削るテンポが黒速攻へ間に合うか見る。 | 42.4 | 16-24<br>40% | 9-11<br>45% | 7-13<br>35% | 16.5 | 3.5 | S 96.8% (E 41.5%)<br>P 3.1%<br>A 0.1% | 二重の盾 52<br>ウェイクアップ 29<br>ローテーション 18 | 0F/0W | hold |

## Loop Notes

### Loop 1: 基準: black-pressure

- 対象: `black-pressure`（master - / built-in / normal only）。前回基準。14前衛/8後衛/8マジックのまま、ユニット差し替え前の勝率と特技使用を再確認する。
- AI評価: margin +12<br>target enemy +16
- 結果: score 35.3、overall 14-26 / 35%、vs Black 6-14 / 30%、vs White 8-12 / 40%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.8 で、中程度の負け方。
- 特技傾向: スケープゴート率 96.1% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 42% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 3.8% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 55回 / ウェイクアップ 25回 / ローテーション 21回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 2: 投入: 前衛耐久

- 対象: `master-lab-decoy-unit-front-wall`（master black / Master Lab / normal only）。ナッツロックル、デスシープ、ボムゾウを増やし、囮で守った前衛が黒速攻を受け止められるか見る。
- AI評価: margin +12<br>target enemy +16
- 結果: score 34.6、overall 14-26 / 35%、vs Black 6-14 / 30%、vs White 8-12 / 40%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 5.6 で、中程度の負け方。
- 特技傾向: スケープゴート率 96.6% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 38.7% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 3.3% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 54回 / ウェイクアップ 33回 / ローテーション 27回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 3: 投入: 前衛射程

- 対象: `master-lab-decoy-unit-front-reach`（master black / Master Lab / normal only）。アーシュ＆ロロ、ボムゾウ、神斬丸を増やし、盤面干渉を前衛側で補えるか見る。
- AI評価: margin +12<br>target enemy +16
- 結果: score 24.1、overall 9-31 / 22.5%、vs Black 3-17 / 15%、vs White 6-14 / 30%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 5.0 で、中程度の負け方。
- 特技傾向: スケープゴート率 96.1% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 41.4% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 3.7% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.2% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 55回 / ウェイクアップ 32回 / ローテーション 21回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 4: 投入: 前衛育成

- 対象: `master-lab-decoy-unit-front-growth`（master black / Master Lab / normal only）。ダイン、ホロウダイン、ナッツロックルを増やし、守った駒を制圧役に変えられるか見る。
- AI評価: margin +12<br>target enemy +16
- 結果: score 28.7、overall 11-29 / 27.5%、vs Black 4-16 / 20%、vs White 7-13 / 35%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.6 で、中程度の負け方。
- 特技傾向: スケープゴート率 96.9% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 38.7% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 3% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 50回 / ウェイクアップ 28回 / ローテーション 20回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 5: 投入: 後衛安定

- 対象: `master-lab-decoy-unit-back-stable`（master black / Master Lab / normal only）。フーヨウ、ラティーヌ、バルキャノンを増やし、守る価値の高い後衛が勝率へ出るか見る。
- AI評価: margin +12<br>target enemy +16
- 結果: score 46.5、overall 19-21 / 47.5%、vs Black 8-12 / 40%、vs White 11-9 / 55%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.3 で、中程度の負け方。
- 特技傾向: スケープゴート率 96.5% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 45.2% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 3.5% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 63回 / ウェイクアップ 40回 / ローテーション 27回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 6: 投入: 後衛圧力

- 対象: `master-lab-decoy-unit-back-pressure`（master black / Master Lab / normal only）。バルキャノン、ビヨンド、ゼックを増やし、敵主力を後衛から削るテンポが黒速攻へ間に合うか見る。
- AI評価: margin +12<br>target enemy +16
- 結果: score 42.4、overall 16-24 / 40%、vs Black 9-11 / 45%、vs White 7-13 / 35%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 3.5 で、惜敗寄り。
- 特技傾向: スケープゴート率 96.8% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 41.5% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 3.1% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 52回 / ウェイクアップ 29回 / ローテーション 18回
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

## Reading

- `Overall` はミラーを除いたデコイ側の勝率。白/黒それぞれを相手にした両座席の合算を見る。
- `Loss Opp HP` はデコイ敗北時の相手マスター残HP平均。低いほど惜敗、高いほど押し切られている。
- `Usage` の `S ... (E ...)` は、S がMaster Lab特技内のスケープゴート率、E がスケープゴート内の敵対象率。
- `Magic` は通常マジックカードとして実際に使われた上位カード。Master Lab特技は含めない。
- このループはスクリーニングであり、上位候補は中母数または100戦マトリクスで再確認する。

## Operator Notes

- 採用判断: 今回のユニット差し替え案は、単独採用ラインには届いていない。最上位の `unit_back_stable` でも overall 47.5%、vs Black 40% で、100戦確認へ直行するより次ループの素材扱いが妥当。
- 前衛傾向: 前衛耐久は基準と同等止まり、前衛射程と前衛育成は明確に悪化した。デコイは「守った前衛で制圧する」より、「守る価値の高い後衛を残して盤面干渉を続ける」方が現状のAI評価と噛み合っている。
- 後衛傾向: `unit_back_stable` は vs White 55% まで伸び、後衛を守る構造自体は有望。`unit_back_pressure` は overall 40% だが vs Black 45%、Loss Opp HP 3.5 で惜敗寄りなので、黒対策の素材として残す価値がある。
- 特技傾向: スケープゴート率は全候補で96%前後と高すぎる一方、敵対象率は38-45%まで出ている。敵対象の方向性は機能しているが、挑発率3%台ではバーサク突撃を曲げる役割が足りない。
- 次ループ案: `master-lab-decoy-unit-back-stable` と `master-lab-decoy-unit-back-pressure` を中心に、挑発+8/+16/+24、スケープゴート-8/-16、margin+16/+20、enemy target+24 を組み合わせた10-20候補を games-per-matchup 10 で回す。overall 50%以上かつ vs Black 50%以上が出たら、上位2-3件だけ games-per-matchup 30-50 に上げる。
