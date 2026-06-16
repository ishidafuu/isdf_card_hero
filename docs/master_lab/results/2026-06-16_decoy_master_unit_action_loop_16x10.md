# Master Lab Improvement Loop: decoy

生成: 2026-06-16T13:43:37.392Z
ループ数: 16
試行: 10 games/matchup（5 matchups）

## Conclusion

判定: continue_deck_loop

全体勝率は伸びたが、黒相手の採用ラインはまだ未達。候補を上位条件に絞り、黒相手の再現性を確認する段階。

### Reasons

- unit_action_stable_provoke16_margin16: master-lab-decoy-unit-back-stable / overall 57.5% / vs Black 45%
- baselineとの差分は black +5%, overall +10%
- vs Black 50%以上の安定候補は 0 件

### Next Steps

- 上位3条件だけ games-per-matchup 30-50 で中間検証する。
- 黒相手の負けログを見て、挑発が遅いのか、守る対象が悪いのか、後衛打点が足りないのかを分類する。
- 中母数でも vs Black 50%未満なら、特技評価の微調整より新特技設計へ切り替える。

## Summary

- 16ループ / 800戦スクリーニング。failure は0、warning は0。
- ミラーを除くデコイ側の最高スコアは `unit_action_stable_provoke16_margin16`（混合: 後衛安定 / 挑発+16 / margin+16）の score 56.8。overall 57.5%、vs Black 45%。
- 最上位の敵スケープゴート率は 21.5%（スケープゴート内比率）。味方保護だけで勝っているのか、敵対象で戦い方が変わったのかを次回判断材料にする。
- 基準にした `unit_action_stable_baseline` は overall 47.5%、vs Black 40%。差分は black +5%、overall +10%。
- vs Black 50%以上かつ warning 1件以下の候補は 0 件。全体勝率は伸びても黒対策としては未達のため、次は上位条件を中母数で再確認しつつ黒相手の負け方を分類する段階。
- 中間検証でもスケープゴート率80%超かつ敵対象率5%未満が続くなら、単なる味方保護マスターに戻っているため、評価式より特技設計側の見直しを優先する。

## Next Loop Proposal

- 提案: 混合ループをもう一度回す。上位のデッキと評価補正を掛け合わせ、外れた軸は減らす。
- 次回候補: `unit_action_stable_provoke16_margin16` (master-lab-decoy-unit-back-stable, score 56.8) / `unit_action_stable_provoke16` (master-lab-decoy-unit-back-stable, score 53.9) / `unit_action_stable_scapegoat_minus16` (master-lab-decoy-unit-back-stable, score 53.1)
- 目安: スクリーニング継続なら20-24ループ、本採用前の再現性確認なら3-5候補に絞って各100-150戦。
- 分岐: 上位でも敵スケープゴート率が5%未満なら、敵対象バイアスをさらに強めるより、敵に付けた時だけ価値が出る新特技案へ切り替える。

## Loop Schedule

| Loop | Kind | Experiment | Deck | AI Eval | Hypothesis |
| ---: | --- | --- | --- | --- | --- |
| 1 | ai_eval | unit_action_stable_baseline<br>基準: 後衛安定 | master-lab-decoy-unit-back-stable<br>デコイ実験: 後衛安定 | margin +12<br>target enemy +16 | 前回最上位。後衛安定型を特技評価ループの基準として再確認する。 |
| 2 | ai_eval | unit_action_pressure_baseline<br>基準: 後衛圧力 | master-lab-decoy-unit-back-pressure<br>デコイ実験: 後衛圧力 | margin +12<br>target enemy +16 | 黒相手の惜敗寄り候補。後衛圧力型を黒対策の基準として再確認する。 |
| 3 | ai_eval | unit_action_stable_provoke8<br>挑発+8: 後衛安定 | master-lab-decoy-unit-back-stable<br>デコイ実験: 後衛安定 | margin +12<br>provoke +8<br>target enemy +16 | 挑発を軽く増やし、白相手の安定を壊さず黒の打点を曲げられるか見る。 |
| 4 | ai_eval | unit_action_stable_provoke16<br>挑発+16: 後衛安定 | master-lab-decoy-unit-back-stable<br>デコイ実験: 後衛安定 | margin +12<br>provoke +16<br>target enemy +16 | 後衛安定型で挑発を明確に増やし、スケープゴート偏重を緩める。 |
| 5 | ai_eval | unit_action_stable_provoke24<br>挑発+24: 後衛安定 | master-lab-decoy-unit-back-stable<br>デコイ実験: 後衛安定 | margin +12<br>provoke +24<br>target enemy +16 | 後衛安定型で挑発を強めすぎた場合の白相手崩れを確認する。 |
| 6 | ai_eval | unit_action_pressure_provoke8<br>挑発+8: 後衛圧力 | master-lab-decoy-unit-back-pressure<br>デコイ実験: 後衛圧力 | margin +12<br>provoke +8<br>target enemy +16 | 黒相手の惜敗を、軽い挑発補正だけで勝ちに変えられるか見る。 |
| 7 | ai_eval | unit_action_pressure_provoke16<br>挑発+16: 後衛圧力 | master-lab-decoy-unit-back-pressure<br>デコイ実験: 後衛圧力 | margin +12<br>provoke +16<br>target enemy +16 | 後衛圧力型で挑発を明確に増やし、バーサク突撃の当たり先を曲げる。 |
| 8 | ai_eval | unit_action_pressure_provoke24<br>挑発+24: 後衛圧力 | master-lab-decoy-unit-back-pressure<br>デコイ実験: 後衛圧力 | margin +12<br>provoke +24<br>target enemy +16 | 後衛圧力型で挑発を強め、黒相手の上限と副作用を測る。 |
| 9 | ai_eval | unit_action_stable_scapegoat_minus8<br>スケープゴート-8: 後衛安定 | master-lab-decoy-unit-back-stable<br>デコイ実験: 後衛安定 | margin +12<br>scapegoat -8<br>target enemy +16 | 後衛安定型のスケープゴート過多を少し抑え、挑発や通常手へ余地を作る。 |
| 10 | ai_eval | unit_action_stable_scapegoat_minus16<br>スケープゴート-16: 後衛安定 | master-lab-decoy-unit-back-stable<br>デコイ実験: 後衛安定 | margin +12<br>scapegoat -16<br>target enemy +16 | 後衛安定型で守りすぎを強く抑えた時の勝率低下を測る。 |
| 11 | ai_eval | unit_action_pressure_scapegoat_minus8<br>スケープゴート-8: 後衛圧力 | master-lab-decoy-unit-back-pressure<br>デコイ実験: 後衛圧力 | margin +12<br>scapegoat -8<br>target enemy +16 | 後衛圧力型でスケープゴート偏重を少し落とし、攻撃参加を増やす。 |
| 12 | ai_eval | unit_action_pressure_scapegoat_minus16<br>スケープゴート-16: 後衛圧力 | master-lab-decoy-unit-back-pressure<br>デコイ実験: 後衛圧力 | margin +12<br>scapegoat -16<br>target enemy +16 | 後衛圧力型で守りすぎを強く抑え、黒相手の速さへ寄せる。 |
| 13 | ai_eval | unit_action_stable_provoke16_scapegoat_minus8<br>混合: 後衛安定 / 挑発+16 / スケープゴート-8 | master-lab-decoy-unit-back-stable<br>デコイ実験: 後衛安定 | margin +12<br>provoke +16<br>scapegoat -8<br>target enemy +16 | 挑発を増やしつつスケープゴートを少し抑え、守るだけの挙動から外す。 |
| 14 | ai_eval | unit_action_pressure_provoke16_scapegoat_minus8<br>混合: 後衛圧力 / 挑発+16 / スケープゴート-8 | master-lab-decoy-unit-back-pressure<br>デコイ実験: 後衛圧力 | margin +12<br>provoke +16<br>scapegoat -8<br>target enemy +16 | 後衛圧力型で攻撃誘導と守り過多抑制を同時に試す。 |
| 15 | ai_eval | unit_action_stable_provoke16_margin16<br>混合: 後衛安定 / 挑発+16 / margin+16 | master-lab-decoy-unit-back-stable<br>デコイ実験: 後衛安定 | margin +16<br>provoke +16<br>target enemy +16 | 挑発を増やしながら特技採用をさらに慎重にし、無駄撃ちを減らす。 |
| 16 | ai_eval | unit_action_pressure_provoke16_margin16<br>混合: 後衛圧力 / 挑発+16 / margin+16 | master-lab-decoy-unit-back-pressure<br>デコイ実験: 後衛圧力 | margin +16<br>provoke +16<br>target enemy +16 | 後衛圧力型で挑発を増やしつつ、通常手を上回る時だけ特技を使わせる。 |

## Top Candidates

| Rank | Loop | Deck | Score | Overall | vs Black | vs White | Loss Opp HP | Usage | Magic | Issues | Judgement |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | 15 | unit_action_stable_provoke16_margin16<br>混合: 後衛安定 / 挑発+16 / margin+16<br>master-lab-decoy-unit-back-stable | 56.8 | 23-17<br>57.5% | 9-11<br>45% | 14-6<br>70% | 4.1 | S 65.4% (E 21.5%)<br>P 34.4%<br>A 0.2% | 二重の盾 63<br>ウェイクアップ 32<br>ローテーション 27 | 0F/0W | advance |
| 2 | 4 | unit_action_stable_provoke16<br>挑発+16: 後衛安定<br>master-lab-decoy-unit-back-stable | 53.9 | 21-19<br>52.5% | 9-11<br>45% | 12-8<br>60% | 3.6 | S 65.8% (E 22.6%)<br>P 34.2%<br>A 0% | 二重の盾 60<br>ウェイクアップ 28<br>ローテーション 23 | 0F/0W | advance |
| 3 | 10 | unit_action_stable_scapegoat_minus16<br>スケープゴート-16: 後衛安定<br>master-lab-decoy-unit-back-stable | 53.1 | 21-19<br>52.5% | 9-11<br>45% | 12-8<br>60% | 4.6 | S 65.9% (E 21.9%)<br>P 34%<br>A 0.1% | 二重の盾 63<br>ウェイクアップ 37<br>ローテーション 24 | 0F/0W | advance |
| 4 | 1 | unit_action_stable_baseline<br>基準: 後衛安定<br>master-lab-decoy-unit-back-stable | 46.5 | 19-21<br>47.5% | 8-12<br>40% | 11-9<br>55% | 4.3 | S 96.5% (E 45.2%)<br>P 3.5%<br>A 0.1% | 二重の盾 63<br>ウェイクアップ 40<br>ローテーション 27 | 0F/0W | reject |
| 5 | 3 | unit_action_stable_provoke8<br>挑発+8: 後衛安定<br>master-lab-decoy-unit-back-stable | 43.3 | 17-23<br>42.5% | 6-14<br>30% | 11-9<br>55% | 3.7 | S 86.1% (E 41.8%)<br>P 13.9%<br>A 0% | 二重の盾 63<br>ウェイクアップ 36<br>ローテーション 24 | 0F/0W | reject |

## Loop Results

| Loop | Deck | Hypothesis | Score | Overall | vs Black | vs White | Avg Turns | Loss Opp HP | Action Usage | Magic | Issues | Judgement |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | unit_action_stable_baseline<br>基準: 後衛安定<br>master-lab-decoy-unit-back-stable<br>master black / Master Lab / normal only | 前回最上位。後衛安定型を特技評価ループの基準として再確認する。 | 46.5 | 19-21<br>47.5% | 8-12<br>40% | 11-9<br>55% | 19.3 | 4.3 | S 96.5% (E 45.2%)<br>P 3.5%<br>A 0.1% | 二重の盾 63<br>ウェイクアップ 40<br>ローテーション 27 | 0F/0W | reject |
| 2 | unit_action_pressure_baseline<br>基準: 後衛圧力<br>master-lab-decoy-unit-back-pressure<br>master black / Master Lab / normal only | 黒相手の惜敗寄り候補。後衛圧力型を黒対策の基準として再確認する。 | 42.4 | 16-24<br>40% | 9-11<br>45% | 7-13<br>35% | 16.5 | 3.5 | S 96.8% (E 41.5%)<br>P 3.1%<br>A 0.1% | 二重の盾 52<br>ウェイクアップ 29<br>ローテーション 18 | 0F/0W | hold |
| 3 | unit_action_stable_provoke8<br>挑発+8: 後衛安定<br>master-lab-decoy-unit-back-stable<br>master black / Master Lab / normal only | 挑発を軽く増やし、白相手の安定を壊さず黒の打点を曲げられるか見る。 | 43.3 | 17-23<br>42.5% | 6-14<br>30% | 11-9<br>55% | 19.1 | 3.7 | S 86.1% (E 41.8%)<br>P 13.9%<br>A 0% | 二重の盾 63<br>ウェイクアップ 36<br>ローテーション 24 | 0F/0W | reject |
| 4 | unit_action_stable_provoke16<br>挑発+16: 後衛安定<br>master-lab-decoy-unit-back-stable<br>master black / Master Lab / normal only | 後衛安定型で挑発を明確に増やし、スケープゴート偏重を緩める。 | 53.9 | 21-19<br>52.5% | 9-11<br>45% | 12-8<br>60% | 17.8 | 3.6 | S 65.8% (E 22.6%)<br>P 34.2%<br>A 0% | 二重の盾 60<br>ウェイクアップ 28<br>ローテーション 23 | 0F/0W | advance |
| 5 | unit_action_stable_provoke24<br>挑発+24: 後衛安定<br>master-lab-decoy-unit-back-stable<br>master black / Master Lab / normal only | 後衛安定型で挑発を強めすぎた場合の白相手崩れを確認する。 | 36.7 | 14-26<br>35% | 4-16<br>20% | 10-10<br>50% | 18.4 | 4.1 | S 62.6% (E 20.1%)<br>P 37.3%<br>A 0.1% | 二重の盾 57<br>ローテーション 28<br>ウェイクアップ 26 | 0F/0W | reject |
| 6 | unit_action_pressure_provoke8<br>挑発+8: 後衛圧力<br>master-lab-decoy-unit-back-pressure<br>master black / Master Lab / normal only | 黒相手の惜敗を、軽い挑発補正だけで勝ちに変えられるか見る。 | 35 | 12-28<br>30% | 7-13<br>35% | 5-15<br>25% | 16.6 | 3.4 | S 89.1% (E 40.1%)<br>P 10.8%<br>A 0.1% | 二重の盾 53<br>ウェイクアップ 29<br>ローテーション 17 | 0F/0W | reject |
| 7 | unit_action_pressure_provoke16<br>挑発+16: 後衛圧力<br>master-lab-decoy-unit-back-pressure<br>master black / Master Lab / normal only | 後衛圧力型で挑発を明確に増やし、バーサク突撃の当たり先を曲げる。 | 31.6 | 10-30<br>25% | 7-13<br>35% | 3-17<br>15% | 16 | 4.3 | S 69.7% (E 23.4%)<br>P 30.2%<br>A 0.1% | 二重の盾 52<br>ウェイクアップ 27<br>ローテーション 18 | 0F/0W | reject |
| 8 | unit_action_pressure_provoke24<br>挑発+24: 後衛圧力<br>master-lab-decoy-unit-back-pressure<br>master black / Master Lab / normal only | 後衛圧力型で挑発を強め、黒相手の上限と副作用を測る。 | 28.6 | 9-31<br>22.5% | 5-15<br>25% | 4-16<br>20% | 14.3 | 4.0 | S 56.6% (E 33.3%)<br>P 43.3%<br>A 0.1% | 二重の盾 48<br>ウェイクアップ 22<br>ローテーション 16<br>再生 1 | 0F/0W | reject |
| 9 | unit_action_stable_scapegoat_minus8<br>スケープゴート-8: 後衛安定<br>master-lab-decoy-unit-back-stable<br>master black / Master Lab / normal only | 後衛安定型のスケープゴート過多を少し抑え、挑発や通常手へ余地を作る。 | 41.7 | 16-24<br>40% | 6-14<br>30% | 10-10<br>50% | 19.7 | 4.3 | S 83.4% (E 40.3%)<br>P 16.6%<br>A 0% | 二重の盾 65<br>ウェイクアップ 42<br>ローテーション 33 | 0F/0W | reject |
| 10 | unit_action_stable_scapegoat_minus16<br>スケープゴート-16: 後衛安定<br>master-lab-decoy-unit-back-stable<br>master black / Master Lab / normal only | 後衛安定型で守りすぎを強く抑えた時の勝率低下を測る。 | 53.1 | 21-19<br>52.5% | 9-11<br>45% | 12-8<br>60% | 18.2 | 4.6 | S 65.9% (E 21.9%)<br>P 34%<br>A 0.1% | 二重の盾 63<br>ウェイクアップ 37<br>ローテーション 24 | 0F/0W | advance |
| 11 | unit_action_pressure_scapegoat_minus8<br>スケープゴート-8: 後衛圧力<br>master-lab-decoy-unit-back-pressure<br>master black / Master Lab / normal only | 後衛圧力型でスケープゴート偏重を少し落とし、攻撃参加を増やす。 | 34.9 | 12-28<br>30% | 7-13<br>35% | 5-15<br>25% | 17 | 4.2 | S 88.2% (E 34.6%)<br>P 11.4%<br>A 0.4% | 二重の盾 53<br>ウェイクアップ 35<br>ローテーション 20 | 0F/0W | reject |
| 12 | unit_action_pressure_scapegoat_minus16<br>スケープゴート-16: 後衛圧力<br>master-lab-decoy-unit-back-pressure<br>master black / Master Lab / normal only | 後衛圧力型で守りすぎを強く抑え、黒相手の速さへ寄せる。 | 37.9 | 13-27<br>32.5% | 7-13<br>35% | 6-14<br>30% | 17.9 | 3.2 | S 69.9% (E 20.6%)<br>P 29.8%<br>A 0.3% | 二重の盾 58<br>ウェイクアップ 34<br>ローテーション 18 | 0F/0W | reject |
| 13 | unit_action_stable_provoke16_scapegoat_minus8<br>混合: 後衛安定 / 挑発+16 / スケープゴート-8<br>master-lab-decoy-unit-back-stable<br>master black / Master Lab / normal only | 挑発を増やしつつスケープゴートを少し抑え、守るだけの挙動から外す。 | 37.1 | 15-25<br>37.5% | 3-17<br>15% | 12-8<br>60% | 17.7 | 4.5 | S 55.3% (E 26.5%)<br>P 44.5%<br>A 0.2% | 二重の盾 61<br>ウェイクアップ 35<br>ローテーション 29 | 0F/0W | reject |
| 14 | unit_action_pressure_provoke16_scapegoat_minus8<br>混合: 後衛圧力 / 挑発+16 / スケープゴート-8<br>master-lab-decoy-unit-back-pressure<br>master black / Master Lab / normal only | 後衛圧力型で攻撃誘導と守り過多抑制を同時に試す。 | 21.2 | 6-34<br>15% | 2-18<br>10% | 4-16<br>20% | 15.5 | 3.6 | S 63.8% (E 25.6%)<br>P 36%<br>A 0.2% | 二重の盾 52<br>ウェイクアップ 26<br>ローテーション 24 | 0F/0W | reject |
| 15 | unit_action_stable_provoke16_margin16<br>混合: 後衛安定 / 挑発+16 / margin+16<br>master-lab-decoy-unit-back-stable<br>master black / Master Lab / normal only | 挑発を増やしながら特技採用をさらに慎重にし、無駄撃ちを減らす。 | 56.8 | 23-17<br>57.5% | 9-11<br>45% | 14-6<br>70% | 18 | 4.1 | S 65.4% (E 21.5%)<br>P 34.4%<br>A 0.2% | 二重の盾 63<br>ウェイクアップ 32<br>ローテーション 27 | 0F/0W | advance |
| 16 | unit_action_pressure_provoke16_margin16<br>混合: 後衛圧力 / 挑発+16 / margin+16<br>master-lab-decoy-unit-back-pressure<br>master black / Master Lab / normal only | 後衛圧力型で挑発を増やしつつ、通常手を上回る時だけ特技を使わせる。 | 31.3 | 10-30<br>25% | 6-14<br>30% | 4-16<br>20% | 14.9 | 3.8 | S 67.5% (E 25.5%)<br>P 32.2%<br>A 0.3% | 二重の盾 52<br>ウェイクアップ 26<br>ローテーション 19 | 0F/0W | reject |

## Loop Notes

### Loop 1: 基準: 後衛安定

- 対象: `master-lab-decoy-unit-back-stable`（master black / Master Lab / normal only）。前回最上位。後衛安定型を特技評価ループの基準として再確認する。
- AI評価: margin +12<br>target enemy +16
- 結果: score 46.5、overall 19-21 / 47.5%、vs Black 8-12 / 40%、vs White 11-9 / 55%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.3 で、中程度の負け方。
- 特技傾向: スケープゴート率 96.5% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 45.2% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 3.5% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 63回 / ウェイクアップ 40回 / ローテーション 27回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 2: 基準: 後衛圧力

- 対象: `master-lab-decoy-unit-back-pressure`（master black / Master Lab / normal only）。黒相手の惜敗寄り候補。後衛圧力型を黒対策の基準として再確認する。
- AI評価: margin +12<br>target enemy +16
- 結果: score 42.4、overall 16-24 / 40%、vs Black 9-11 / 45%、vs White 7-13 / 35%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 3.5 で、惜敗寄り。
- 特技傾向: スケープゴート率 96.8% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 41.5% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 3.1% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 52回 / ウェイクアップ 29回 / ローテーション 18回
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

### Loop 3: 挑発+8: 後衛安定

- 対象: `master-lab-decoy-unit-back-stable`（master black / Master Lab / normal only）。挑発を軽く増やし、白相手の安定を壊さず黒の打点を曲げられるか見る。
- AI評価: margin +12<br>provoke +8<br>target enemy +16
- 結果: score 43.3、overall 17-23 / 42.5%、vs Black 6-14 / 30%、vs White 11-9 / 55%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白相手には戦える一方、主目的の黒速攻対策としては弱い。 負け試合の相手残HP平均は 3.7 で、惜敗寄り。
- 特技傾向: スケープゴート率 86.1% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 41.8% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 13.9% は中程度。 マスター攻撃率 0% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 63回 / ウェイクアップ 36回 / ローテーション 24回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 4: 挑発+16: 後衛安定

- 対象: `master-lab-decoy-unit-back-stable`（master black / Master Lab / normal only）。後衛安定型で挑発を明確に増やし、スケープゴート偏重を緩める。
- AI評価: margin +12<br>provoke +16<br>target enemy +16
- 結果: score 53.9、overall 21-19 / 52.5%、vs Black 9-11 / 45%、vs White 12-8 / 60%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 全体では五分以上だが、黒相手の再現性はまだ足りない。 負け試合の相手残HP平均は 3.6 で、惜敗寄り。
- 特技傾向: スケープゴート率 65.8% は比較的抑えられている。 敵スケープゴート率 22.6% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 34.2% は高めで、攻撃順の誘導も使えている。 マスター攻撃率 0% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 60回 / ウェイクアップ 28回 / ローテーション 23回
- 次アクション: 100戦マトリクスへ進め、黒相手と白相手の再現性を確認する。

### Loop 5: 挑発+24: 後衛安定

- 対象: `master-lab-decoy-unit-back-stable`（master black / Master Lab / normal only）。後衛安定型で挑発を強めすぎた場合の白相手崩れを確認する。
- AI評価: margin +12<br>provoke +24<br>target enemy +16
- 結果: score 36.7、overall 14-26 / 35%、vs Black 4-16 / 20%、vs White 10-10 / 50%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白相手には戦える一方、主目的の黒速攻対策としては弱い。 負け試合の相手残HP平均は 4.1 で、中程度の負け方。
- 特技傾向: スケープゴート率 62.6% は比較的抑えられている。 敵スケープゴート率 20.1% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 37.3% は高めで、攻撃順の誘導も使えている。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 57回 / ローテーション 28回 / ウェイクアップ 26回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 6: 挑発+8: 後衛圧力

- 対象: `master-lab-decoy-unit-back-pressure`（master black / Master Lab / normal only）。黒相手の惜敗を、軽い挑発補正だけで勝ちに変えられるか見る。
- AI評価: margin +12<br>provoke +8<br>target enemy +16
- 結果: score 35、overall 12-28 / 30%、vs Black 7-13 / 35%、vs White 5-15 / 25%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 3.4 で、惜敗寄り。
- 特技傾向: スケープゴート率 89.1% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 40.1% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 10.8% は中程度。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 53回 / ウェイクアップ 29回 / ローテーション 17回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 7: 挑発+16: 後衛圧力

- 対象: `master-lab-decoy-unit-back-pressure`（master black / Master Lab / normal only）。後衛圧力型で挑発を明確に増やし、バーサク突撃の当たり先を曲げる。
- AI評価: margin +12<br>provoke +16<br>target enemy +16
- 結果: score 31.6、overall 10-30 / 25%、vs Black 7-13 / 35%、vs White 3-17 / 15%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.3 で、中程度の負け方。
- 特技傾向: スケープゴート率 69.7% は比較的抑えられている。 敵スケープゴート率 23.4% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 30.2% は高めで、攻撃順の誘導も使えている。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 52回 / ウェイクアップ 27回 / ローテーション 18回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 8: 挑発+24: 後衛圧力

- 対象: `master-lab-decoy-unit-back-pressure`（master black / Master Lab / normal only）。後衛圧力型で挑発を強め、黒相手の上限と副作用を測る。
- AI評価: margin +12<br>provoke +24<br>target enemy +16
- 結果: score 28.6、overall 9-31 / 22.5%、vs Black 5-15 / 25%、vs White 4-16 / 20%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 4.0 で、惜敗寄り。
- 特技傾向: スケープゴート率 56.6% は比較的抑えられている。 敵スケープゴート率 33.3% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 43.3% は高めで、攻撃順の誘導も使えている。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 48回 / ウェイクアップ 22回 / ローテーション 16回 / 再生 1回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 9: スケープゴート-8: 後衛安定

- 対象: `master-lab-decoy-unit-back-stable`（master black / Master Lab / normal only）。後衛安定型のスケープゴート過多を少し抑え、挑発や通常手へ余地を作る。
- AI評価: margin +12<br>scapegoat -8<br>target enemy +16
- 結果: score 41.7、overall 16-24 / 40%、vs Black 6-14 / 30%、vs White 10-10 / 50%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白相手には戦える一方、主目的の黒速攻対策としては弱い。 負け試合の相手残HP平均は 4.3 で、中程度の負け方。
- 特技傾向: スケープゴート率 83.4% は高めで、受けの主軸になっている。 敵スケープゴート率 40.3% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 16.6% は高めで、攻撃順の誘導も使えている。 マスター攻撃率 0% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 65回 / ウェイクアップ 42回 / ローテーション 33回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 10: スケープゴート-16: 後衛安定

- 対象: `master-lab-decoy-unit-back-stable`（master black / Master Lab / normal only）。後衛安定型で守りすぎを強く抑えた時の勝率低下を測る。
- AI評価: margin +12<br>scapegoat -16<br>target enemy +16
- 結果: score 53.1、overall 21-19 / 52.5%、vs Black 9-11 / 45%、vs White 12-8 / 60%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 全体では五分以上だが、黒相手の再現性はまだ足りない。 負け試合の相手残HP平均は 4.6 で、中程度の負け方。
- 特技傾向: スケープゴート率 65.9% は比較的抑えられている。 敵スケープゴート率 21.9% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 34% は高めで、攻撃順の誘導も使えている。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 63回 / ウェイクアップ 37回 / ローテーション 24回
- 次アクション: 100戦マトリクスへ進め、黒相手と白相手の再現性を確認する。

### Loop 11: スケープゴート-8: 後衛圧力

- 対象: `master-lab-decoy-unit-back-pressure`（master black / Master Lab / normal only）。後衛圧力型でスケープゴート偏重を少し落とし、攻撃参加を増やす。
- AI評価: margin +12<br>scapegoat -8<br>target enemy +16
- 結果: score 34.9、overall 12-28 / 30%、vs Black 7-13 / 35%、vs White 5-15 / 25%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.2 で、中程度の負け方。
- 特技傾向: スケープゴート率 88.2% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 34.6% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 11.4% は中程度。 マスター攻撃率 0.4% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 53回 / ウェイクアップ 35回 / ローテーション 20回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 12: スケープゴート-16: 後衛圧力

- 対象: `master-lab-decoy-unit-back-pressure`（master black / Master Lab / normal only）。後衛圧力型で守りすぎを強く抑え、黒相手の速さへ寄せる。
- AI評価: margin +12<br>scapegoat -16<br>target enemy +16
- 結果: score 37.9、overall 13-27 / 32.5%、vs Black 7-13 / 35%、vs White 6-14 / 30%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 3.2 で、惜敗寄り。
- 特技傾向: スケープゴート率 69.9% は比較的抑えられている。 敵スケープゴート率 20.6% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 29.8% は高めで、攻撃順の誘導も使えている。 マスター攻撃率 0.3% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 58回 / ウェイクアップ 34回 / ローテーション 18回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 13: 混合: 後衛安定 / 挑発+16 / スケープゴート-8

- 対象: `master-lab-decoy-unit-back-stable`（master black / Master Lab / normal only）。挑発を増やしつつスケープゴートを少し抑え、守るだけの挙動から外す。
- AI評価: margin +12<br>provoke +16<br>scapegoat -8<br>target enemy +16
- 結果: score 37.1、overall 15-25 / 37.5%、vs Black 3-17 / 15%、vs White 12-8 / 60%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白相手には戦える一方、主目的の黒速攻対策としては弱い。 負け試合の相手残HP平均は 4.5 で、中程度の負け方。
- 特技傾向: スケープゴート率 55.3% は比較的抑えられている。 敵スケープゴート率 26.5% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 44.5% は高めで、攻撃順の誘導も使えている。 マスター攻撃率 0.2% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 61回 / ウェイクアップ 35回 / ローテーション 29回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 14: 混合: 後衛圧力 / 挑発+16 / スケープゴート-8

- 対象: `master-lab-decoy-unit-back-pressure`（master black / Master Lab / normal only）。後衛圧力型で攻撃誘導と守り過多抑制を同時に試す。
- AI評価: margin +12<br>provoke +16<br>scapegoat -8<br>target enemy +16
- 結果: score 21.2、overall 6-34 / 15%、vs Black 2-18 / 10%、vs White 4-16 / 20%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 3.6 で、惜敗寄り。
- 特技傾向: スケープゴート率 63.8% は比較的抑えられている。 敵スケープゴート率 25.6% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 36% は高めで、攻撃順の誘導も使えている。 マスター攻撃率 0.2% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 52回 / ウェイクアップ 26回 / ローテーション 24回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 15: 混合: 後衛安定 / 挑発+16 / margin+16

- 対象: `master-lab-decoy-unit-back-stable`（master black / Master Lab / normal only）。挑発を増やしながら特技採用をさらに慎重にし、無駄撃ちを減らす。
- AI評価: margin +16<br>provoke +16<br>target enemy +16
- 結果: score 56.8、overall 23-17 / 57.5%、vs Black 9-11 / 45%、vs White 14-6 / 70%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 全体では五分以上だが、黒相手の再現性はまだ足りない。 負け試合の相手残HP平均は 4.1 で、中程度の負け方。
- 特技傾向: スケープゴート率 65.4% は比較的抑えられている。 敵スケープゴート率 21.5% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 34.4% は高めで、攻撃順の誘導も使えている。 マスター攻撃率 0.2% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 63回 / ウェイクアップ 32回 / ローテーション 27回
- 次アクション: 100戦マトリクスへ進め、黒相手と白相手の再現性を確認する。

### Loop 16: 混合: 後衛圧力 / 挑発+16 / margin+16

- 対象: `master-lab-decoy-unit-back-pressure`（master black / Master Lab / normal only）。後衛圧力型で挑発を増やしつつ、通常手を上回る時だけ特技を使わせる。
- AI評価: margin +16<br>provoke +16<br>target enemy +16
- 結果: score 31.3、overall 10-30 / 25%、vs Black 6-14 / 30%、vs White 4-16 / 20%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 3.8 で、惜敗寄り。
- 特技傾向: スケープゴート率 67.5% は比較的抑えられている。 敵スケープゴート率 25.5% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 32.2% は高めで、攻撃順の誘導も使えている。 マスター攻撃率 0.3% は低く、防御特技にかなり寄っている。
- マジック使用: 二重の盾 52回 / ウェイクアップ 26回 / ローテーション 19回
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

## Reading

- `Overall` はミラーを除いたデコイ側の勝率。白/黒それぞれを相手にした両座席の合算を見る。
- `Loss Opp HP` はデコイ敗北時の相手マスター残HP平均。低いほど惜敗、高いほど押し切られている。
- `Usage` の `S ... (E ...)` は、S がMaster Lab特技内のスケープゴート率、E がスケープゴート内の敵対象率。
- `Magic` は通常マジックカードとして実際に使われた上位カード。Master Lab特技は含めない。
- このループはスクリーニングであり、上位候補は中母数または100戦マトリクスで再確認する。

## Operator Notes

- 最大の収穫は、`unit_back_stable` に挑発+16を入れるとスケープゴート率が約96%から約65%まで落ち、挑発率が約34%まで上がること。デコイの行動質は明確に変わった。
- 上位は `unit_action_stable_provoke16_margin16`、`unit_action_stable_provoke16`、`unit_action_stable_scapegoat_minus16` の3件。いずれも overall 52.5-57.5%、vs Black 45%、vs White 60-70% で、黒相手はあと一歩足りない。
- `unit_back_pressure` は前回の惜敗感に反して、挑発やスケープゴート抑制を入れると大きく崩れた。現状は黒対策の本命から外し、後衛安定型へ集中する方がよい。
- 挑発+24は強すぎる。後衛安定でも vs Black 20%、後衛圧力でも25%まで落ちたため、挑発は+16付近が上限候補。
- 挑発+16とスケープゴート-8の同時指定は悪化した。スケープゴートを減らす場合は単独で-16、挑発を増やす場合はmargin+16との組み合わせがよい。
- 次ループは上位3件だけ games-per-matchup 30-50 で確認する。そこで vs Black 50%へ届かなければ、既存評価補正の調整ではなく「行動前の高打点だけ挑発を厚く評価する」など、条件付き評価または新特技設計へ進む。
