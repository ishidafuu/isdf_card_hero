# Master Lab Improvement Loop: decoy

生成: 2026-06-16T01:12:30.989Z
ループ数: 22
試行: 5 games/matchup（5 matchups）

## Conclusion

判定: needs_full_gate

`ai_black_strict_margin12`（AI評価: 特技採用margin+12 / black-pressure）が基準より伸びた。小母数の上振れを排除するため、まず上位候補を100戦マトリクスで再検証する。

### Reasons

- ai_black_strict_margin12: black-pressure / overall 55% / vs Black 60% / score 56.3
- baseline deck_pressure_baseline: pressure-normal / overall 35% / vs Black 20%
- black gain +40%, overall gain +20%

### Next Steps

- ai_black_strict_margin12 を games-per-matchup 100 で再実行する。
- 上位3件の負けログを見て、スケープゴート過多か挑発不足かを分類する。
- 100戦でも黒相手が50%を超えるなら、デッキ調整ループを継続する。

## Summary

- 22ループ / 550戦スクリーニング。failure は0、warning は5。
- 注記: 実行時点の作業ツリーには別スレッド由来と思われる `src/game/rules.ts` などの未コミット差分があり、この数値はその作業ツリー前提の暫定結果。
- ミラーを除くデコイ側の最高スコアは `ai_black_strict_margin12`（AI評価: 特技採用margin+12 / black-pressure）の score 56.3。overall 55%、vs Black 60%。
- 基準にした `deck_pressure_baseline` は overall 35%、vs Black 20%。差分は black +40%、overall +20%。
- vs Black 50%以上かつ warning 1件以下の候補は 3 件。横展開より、上位候補の中母数再検証に進む段階。
- `submission-pro-with-rare8-black-1354` は overall 60% だが warning 5 件。勝率だけなら目立つが、長期戦リスクを先に潰す必要がある。
- 中間検証でもスケープゴート率80%超が続くなら、デッキ探索を止めて挑発/スケープゴートの評価式・コスト調整へ移るべき。

## Next Loop Proposal

- 提案: 上位候補の再現性確認を優先する。次は候補数を減らし、games-per-matchup を 20-30 に上げる。
- 次回候補: `ai_black_strict_margin12` (black-pressure, score 56.3) / `deck_black_pressure` (black-pressure, score 54.5) / `deck_beatdown_lock` (submission-pro-no-rare8-black-1403, score 48.7)
- 目安: スクリーニング継続なら20-24ループ、本採用前の再現性確認なら3-5候補に絞って各100-150戦。
- 分岐: 上位でもスケープゴート率80%超が続くなら、次はスケープゴート抑制と挑発強化のAI評価ループへ寄せる。

## Loop Schedule

| Loop | Kind | Experiment | Deck | AI Eval | Hypothesis |
| ---: | --- | --- | --- | --- | --- |
| 1 | deck | deck_pressure_baseline<br>デッキ基準: 通常プレッシャー | pressure-normal<br>通常プレッシャー | baseline | 前回基準。白相手の安定と黒相手の最低ラインを再確認する。 |
| 2 | deck | deck_black_pressure<br>デッキ本命: ブラック検証 | black-pressure<br>ブラック検証 | baseline | 前回最上位。黒耐性60%が再現するか見る。 |
| 3 | deck | deck_balanced_control<br>デッキ比較: 通常バランス | balanced-normal<br>通常バランス | baseline | 攻撃寄りでない標準構成を比較し、守り過多の弱さを再確認する。 |
| 4 | deck | deck_beatdown_lock<br>デッキ控え: ビートダウン&ロック | submission-pro-no-rare8-black-1403<br>投稿Pro黒8なし #1403 ビートダウン&ロック | baseline | 前回hold。除去/妨害寄りで白相手に強い形が残るか見る。 |
| 5 | deck | deck_agito_growth<br>デッキ控え: アギト育成 | submission-pro-no-rare8-white-1340<br>投稿Pro白8なし #1340 アギト育成デッキ | baseline | 白系育成で黒相手50%が再現するか確認する。 |
| 6 | warning_probe | deck_1354_warning_probe<br>警告診断: 黒速攻&殲滅 | submission-pro-with-rare8-black-1354<br>投稿Pro黒8あり #1354 星８有状況下黒速攻＆殲滅デッキ | baseline | 勝率は高いがwarningが多かったため、長期戦リスクを再確認する。 |
| 7 | deck | deck_direct_damage_probe<br>デッキ診断: HP直撃 | submission-pro-with-rare8-black-1328<br>投稿Pro黒8あり #1328 HPだけ削ることを考えるデッキ | baseline | 直撃密度だけでは勝てない仮説を再確認する。 |
| 8 | deck | deck_defense_probe<br>デッキ診断: 極端なぼうえい | submission-pro-no-rare8-white-1347<br>投稿Pro白8なし #1347 極端なぼうえい | baseline | 防御密度を上げた場合にデコイがホワイト化しないか見る。 |
| 9 | ai_eval | ai_black_provoke_plus8<br>AI評価: 挑発+8 / black-pressure | black-pressure<br>ブラック検証 | provoke +8 | 黒相手に挑発を少し厚くし、バーサク打点の当たり先を曲げられるか見る。 |
| 10 | ai_eval | ai_black_provoke_plus16<br>AI評価: 挑発+16 / black-pressure | black-pressure<br>ブラック検証 | provoke +16 | 挑発評価を明確に上げ、スケープゴート偏重を緩められるか見る。 |
| 11 | ai_eval | ai_black_provoke_plus24<br>AI評価: 挑発+24 / black-pressure | black-pressure<br>ブラック検証 | provoke +24 | 挑発を強めすぎた時に白相手や長期戦が崩れないか見る。 |
| 12 | ai_eval | ai_black_scapegoat_minus8<br>AI評価: スケープゴート-8 / black-pressure | black-pressure<br>ブラック検証 | scapegoat -8 | スケープゴート連打を少し抑えても黒耐性が残るか見る。 |
| 13 | ai_eval | ai_black_scapegoat_minus16<br>AI評価: スケープゴート-16 / black-pressure | black-pressure<br>ブラック検証 | scapegoat -16 | スケープゴート依存を強く抑えた時の勝率低下を測る。 |
| 14 | ai_eval | ai_pressure_provoke_plus16<br>AI評価: 挑発+16 / pressure-normal | pressure-normal<br>通常プレッシャー | provoke +16 | 白安定寄りの基準デッキで挑発厚めが黒耐性を足せるか見る。 |
| 15 | ai_eval | ai_pressure_scapegoat_minus8<br>AI評価: スケープゴート-8 / pressure-normal | pressure-normal<br>通常プレッシャー | scapegoat -8 | 基準デッキでスケープゴート依存を抑えても勝率が残るか見る。 |
| 16 | ai_eval | ai_pressure_master_attack_minus8<br>AI評価: マスター攻撃-8 / pressure-normal | pressure-normal<br>通常プレッシャー | master_attack -8 | 通常攻撃へ逃げる場面を減らし、防御特技を選ばせる価値を見る。 |
| 17 | ai_eval | ai_black_strict_margin12<br>AI評価: 特技採用margin+12 / black-pressure | black-pressure<br>ブラック検証 | margin +12 | CPU通常手より明確に強い時だけ特技を使わせ、連打リスクを下げる。 |
| 18 | ai_eval | ai_pressure_eager_margin_minus8<br>AI評価: 特技採用margin-8 / pressure-normal | pressure-normal<br>通常プレッシャー | margin -8 | 特技を早めに切る挙動が黒速攻へ間に合うか見る。 |
| 19 | hybrid | hybrid_black_provoke16_scapegoat_minus8<br>混合: black-pressure / 挑発+16 / スケープゴート-8 | black-pressure<br>ブラック検証 | provoke +16<br>scapegoat -8 | 前回本命デッキに、挑発強化とスケープゴート抑制を同時に入れる。 |
| 20 | hybrid | hybrid_pressure_provoke16_scapegoat_minus8<br>混合: pressure-normal / 挑発+16 / スケープゴート-8 | pressure-normal<br>通常プレッシャー | provoke +16<br>scapegoat -8 | 白安定を維持しながら黒速攻への受けを厚くする。 |
| 21 | hybrid | hybrid_1403_provoke16_scapegoat_minus8<br>混合: 1403 / 挑発+16 / スケープゴート-8 | submission-pro-no-rare8-black-1403<br>投稿Pro黒8なし #1403 ビートダウン&ロック | provoke +16<br>scapegoat -8 | 妨害寄りデッキで挑発の攻撃順誘導が噛み合うか見る。 |
| 22 | hybrid | hybrid_1354_warning_trim<br>混合: 1354 / 挑発+16 / スケープゴート-16 | submission-pro-with-rare8-black-1354<br>投稿Pro黒8あり #1354 星８有状況下黒速攻＆殲滅デッキ | provoke +16<br>scapegoat -16 | warningの多い高勝率候補で、スケープゴート過多を落として安定化するか見る。 |

## Top Candidates

| Rank | Loop | Deck | Score | Overall | vs Black | vs White | Loss Opp HP | Usage | Issues | Judgement |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | 17 | ai_black_strict_margin12<br>AI評価: 特技採用margin+12 / black-pressure<br>black-pressure | 56.3 | 11-9<br>55% | 6-4<br>60% | 5-5<br>50% | 3.4 | S 85.2%<br>P 12.4%<br>A 2.4% | 0F/0W | advance |
| 2 | 2 | deck_black_pressure<br>デッキ本命: ブラック検証<br>black-pressure | 54.5 | 11-9<br>55% | 6-4<br>60% | 5-5<br>50% | 5.1 | S 84.7%<br>P 11.8%<br>A 3.5% | 0F/0W | advance |
| 3 | 4 | deck_beatdown_lock<br>デッキ控え: ビートダウン&ロック<br>submission-pro-no-rare8-black-1403 | 48.7 | 10-10<br>50% | 4-6<br>40% | 6-4<br>60% | 4.5 | S 81.2%<br>P 15.6%<br>A 3.2% | 0F/0W | hold |
| 4 | 5 | deck_agito_growth<br>デッキ控え: アギト育成<br>submission-pro-no-rare8-white-1340 | 46.5 | 9-11<br>45% | 5-5<br>50% | 4-6<br>40% | 4.2 | S 82.8%<br>P 13.1%<br>A 4% | 0F/0W | hold |
| 5 | 13 | ai_black_scapegoat_minus16<br>AI評価: スケープゴート-16 / black-pressure<br>black-pressure | 40.3 | 9-11<br>45% | 2-8<br>20% | 7-3<br>70% | 5.1 | S 57.7%<br>P 37.6%<br>A 4.7% | 0F/0W | reject |

## Loop Results

| Loop | Deck | Hypothesis | Score | Overall | vs Black | vs White | Avg Turns | Loss Opp HP | Action Usage | Issues | Judgement |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure-normal<br>通常プレッシャー<br>master - / built-in / normal only | 前回基準。白相手の安定と黒相手の最低ラインを再確認する。 | 35.3 | 7-13<br>35% | 2-8<br>20% | 5-5<br>50% | 15.8 | 4.3 | S 73.1%<br>P 19.4%<br>A 7.6% | 0F/0W | reject |
| 2 | black-pressure<br>ブラック検証<br>master - / built-in / normal only | 前回最上位。黒耐性60%が再現するか見る。 | 54.5 | 11-9<br>55% | 6-4<br>60% | 5-5<br>50% | 19.4 | 5.1 | S 84.7%<br>P 11.8%<br>A 3.5% | 0F/0W | advance |
| 3 | balanced-normal<br>通常バランス<br>master - / built-in / normal only | 攻撃寄りでない標準構成を比較し、守り過多の弱さを再確認する。 | 36.1 | 7-13<br>35% | 3-7<br>30% | 4-6<br>40% | 21.6 | 4.2 | S 79.2%<br>P 16.7%<br>A 4.1% | 0F/0W | reject |
| 4 | submission-pro-no-rare8-black-1403<br>投稿Pro黒8なし #1403 ビートダウン&ロック<br>master black / Pro 8なし / normal only | 前回hold。除去/妨害寄りで白相手に強い形が残るか見る。 | 48.7 | 10-10<br>50% | 4-6<br>40% | 6-4<br>60% | 17.3 | 4.5 | S 81.2%<br>P 15.6%<br>A 3.2% | 0F/0W | hold |
| 5 | submission-pro-no-rare8-white-1340<br>投稿Pro白8なし #1340 アギト育成デッキ<br>master white / Pro 8なし / special allowed | 白系育成で黒相手50%が再現するか確認する。 | 46.5 | 9-11<br>45% | 5-5<br>50% | 4-6<br>40% | 21.8 | 4.2 | S 82.8%<br>P 13.1%<br>A 4% | 0F/0W | hold |
| 6 | submission-pro-with-rare8-black-1354<br>投稿Pro黒8あり #1354 星８有状況下黒速攻＆殲滅デッキ<br>master black / Pro 8あり / normal only | 勝率は高いがwarningが多かったため、長期戦リスクを再確認する。 | 24 | 12-8<br>60% | 6-4<br>60% | 6-4<br>60% | 22.1 | 3.0 | S 86.9%<br>P 11.4%<br>A 1.7% | 0F/5W | hold |
| 7 | submission-pro-with-rare8-black-1328<br>投稿Pro黒8あり #1328 HPだけ削ることを考えるデッキ<br>master black / Pro 8あり / special allowed | 直撃密度だけでは勝てない仮説を再確認する。 | 36.9 | 7-13<br>35% | 3-7<br>30% | 4-6<br>40% | 17.7 | 4.1 | S 79.2%<br>P 17.1%<br>A 3.7% | 0F/0W | reject |
| 8 | submission-pro-no-rare8-white-1347<br>投稿Pro白8なし #1347 極端なぼうえい<br>master white / Pro 8なし / special allowed | 防御密度を上げた場合にデコイがホワイト化しないか見る。 | 40.2 | 8-12<br>40% | 4-6<br>40% | 4-6<br>40% | 19.5 | 5.4 | S 83.5%<br>P 12.3%<br>A 4.2% | 0F/0W | reject |
| 9 | black-pressure<br>ブラック検証<br>master - / built-in / normal only | 黒相手に挑発を少し厚くし、バーサク打点の当たり先を曲げられるか見る。 | 29.7 | 5-15<br>25% | 3-7<br>30% | 2-8<br>20% | 17.8 | 4.1 | S 66.9%<br>P 28.7%<br>A 4.4% | 0F/0W | reject |
| 10 | black-pressure<br>ブラック検証<br>master - / built-in / normal only | 挑発評価を明確に上げ、スケープゴート偏重を緩められるか見る。 | 29.1 | 5-15<br>25% | 3-7<br>30% | 2-8<br>20% | 18.3 | 4.3 | S 66.4%<br>P 30.2%<br>A 3.4% | 0F/0W | reject |
| 11 | black-pressure<br>ブラック検証<br>master - / built-in / normal only | 挑発を強めすぎた時に白相手や長期戦が崩れないか見る。 | 17.9 | 3-17<br>15% | 1-9<br>10% | 2-8<br>20% | 16.8 | 5.0 | S 55.8%<br>P 41.1%<br>A 3.1% | 0F/0W | reject |
| 12 | black-pressure<br>ブラック検証<br>master - / built-in / normal only | スケープゴート連打を少し抑えても黒耐性が残るか見る。 | 26.8 | 5-15<br>25% | 2-8<br>20% | 3-7<br>30% | 17.8 | 4.5 | S 65.5%<br>P 28.8%<br>A 5.7% | 0F/0W | reject |
| 13 | black-pressure<br>ブラック検証<br>master - / built-in / normal only | スケープゴート依存を強く抑えた時の勝率低下を測る。 | 40.3 | 9-11<br>45% | 2-8<br>20% | 7-3<br>70% | 16.4 | 5.1 | S 57.7%<br>P 37.6%<br>A 4.7% | 0F/0W | reject |
| 14 | pressure-normal<br>通常プレッシャー<br>master - / built-in / normal only | 白安定寄りの基準デッキで挑発厚めが黒耐性を足せるか見る。 | 36.5 | 7-13<br>35% | 3-7<br>30% | 4-6<br>40% | 15.6 | 4.5 | S 57.7%<br>P 36.7%<br>A 5.6% | 0F/0W | reject |
| 15 | pressure-normal<br>通常プレッシャー<br>master - / built-in / normal only | 基準デッキでスケープゴート依存を抑えても勝率が残るか見る。 | 35.5 | 7-13<br>35% | 3-7<br>30% | 4-6<br>40% | 15.8 | 4.9 | S 63.1%<br>P 30.1%<br>A 6.7% | 0F/0W | reject |
| 16 | pressure-normal<br>通常プレッシャー<br>master - / built-in / normal only | 通常攻撃へ逃げる場面を減らし、防御特技を選ばせる価値を見る。 | 35.3 | 7-13<br>35% | 2-8<br>20% | 5-5<br>50% | 15.8 | 4.3 | S 73.1%<br>P 19.4%<br>A 7.6% | 0F/0W | reject |
| 17 | black-pressure<br>ブラック検証<br>master - / built-in / normal only | CPU通常手より明確に強い時だけ特技を使わせ、連打リスクを下げる。 | 56.3 | 11-9<br>55% | 6-4<br>60% | 5-5<br>50% | 19.8 | 3.4 | S 85.2%<br>P 12.4%<br>A 2.4% | 0F/0W | advance |
| 18 | pressure-normal<br>通常プレッシャー<br>master - / built-in / normal only | 特技を早めに切る挙動が黒速攻へ間に合うか見る。 | 28.5 | 5-15<br>25% | 2-8<br>20% | 3-7<br>30% | 17.1 | 4.0 | S 73.5%<br>P 19.7%<br>A 6.8% | 0F/0W | reject |
| 19 | black-pressure<br>ブラック検証<br>master - / built-in / normal only | 前回本命デッキに、挑発強化とスケープゴート抑制を同時に入れる。 | 17.5 | 3-17<br>15% | 1-9<br>10% | 2-8<br>20% | 17.2 | 4.8 | S 56.9%<br>P 38.7%<br>A 4.3% | 0F/0W | reject |
| 20 | pressure-normal<br>通常プレッシャー<br>master - / built-in / normal only | 白安定を維持しながら黒速攻への受けを厚くする。 | 24.1 | 4-16<br>20% | 2-8<br>20% | 2-8<br>20% | 14.1 | 4.1 | S 42.2%<br>P 51.8%<br>A 6% | 0F/0W | reject |
| 21 | submission-pro-no-rare8-black-1403<br>投稿Pro黒8なし #1403 ビートダウン&ロック<br>master black / Pro 8なし / normal only | 妨害寄りデッキで挑発の攻撃順誘導が噛み合うか見る。 | 39.3 | 8-12<br>40% | 3-7<br>30% | 5-5<br>50% | 15.2 | 4.8 | S 49.8%<br>P 46.4%<br>A 3.8% | 0F/0W | reject |
| 22 | submission-pro-with-rare8-black-1354<br>投稿Pro黒8あり #1354 星８有状況下黒速攻＆殲滅デッキ<br>master black / Pro 8あり / normal only | warningの多い高勝率候補で、スケープゴート過多を落として安定化するか見る。 | 23.9 | 4-16<br>20% | 2-8<br>20% | 2-8<br>20% | 19 | 3.6 | S 48.2%<br>P 48.1%<br>A 3.7% | 0F/0W | reject |

## Loop Notes

### Loop 1: デッキ基準: 通常プレッシャー

- 対象: `pressure-normal`（master - / built-in / normal only）。前回基準。白相手の安定と黒相手の最低ラインを再確認する。
- AI評価: baseline
- 結果: score 35.3、overall 7-13 / 35%、vs Black 2-8 / 20%、vs White 5-5 / 50%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白相手には戦える一方、主目的の黒速攻対策としては弱い。 負け試合の相手残HP平均は 4.3 で、中程度の負け方。
- 特技傾向: スケープゴート率 73.1% は比較的抑えられている。 挑発率 19.4% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 2: デッキ本命: ブラック検証

- 対象: `black-pressure`（master - / built-in / normal only）。前回最上位。黒耐性60%が再現するか見る。
- AI評価: baseline
- 結果: score 54.5、overall 11-9 / 55%、vs Black 6-4 / 60%、vs White 5-5 / 50%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 黒速攻に押し負けず、白相手にも最低限の勝ち筋を残している。 負け試合の相手残HP平均は 5.1 で、中程度の負け方。
- 特技傾向: スケープゴート率 84.7% は高めで、受けの主軸になっている。 挑発率 11.8% は中程度。
- 次アクション: 100戦マトリクスへ進め、黒相手と白相手の再現性を確認する。

### Loop 3: デッキ比較: 通常バランス

- 対象: `balanced-normal`（master - / built-in / normal only）。攻撃寄りでない標準構成を比較し、守り過多の弱さを再確認する。
- AI評価: baseline
- 結果: score 36.1、overall 7-13 / 35%、vs Black 3-7 / 30%、vs White 4-6 / 40%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.2 で、中程度の負け方。
- 特技傾向: スケープゴート率 79.2% は比較的抑えられている。 挑発率 16.7% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 4: デッキ控え: ビートダウン&ロック

- 対象: `submission-pro-no-rare8-black-1403`（master black / Pro 8なし / normal only）。前回hold。除去/妨害寄りで白相手に強い形が残るか見る。
- AI評価: baseline
- 結果: score 48.7、overall 10-10 / 50%、vs Black 4-6 / 40%、vs White 6-4 / 60%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 全体では五分以上だが、黒相手の再現性はまだ足りない。 負け試合の相手残HP平均は 4.5 で、中程度の負け方。
- 特技傾向: スケープゴート率 81.2% は高めで、受けの主軸になっている。 挑発率 15.6% は中程度。
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

### Loop 5: デッキ控え: アギト育成

- 対象: `submission-pro-no-rare8-white-1340`（master white / Pro 8なし / special allowed）。白系育成で黒相手50%が再現するか確認する。
- AI評価: baseline
- 結果: score 46.5、overall 9-11 / 45%、vs Black 5-5 / 50%、vs White 4-6 / 40%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 黒相手の受けは見えるが、白相手の盤面制圧にはやや押されている。 負け試合の相手残HP平均は 4.2 で、中程度の負け方。
- 特技傾向: スケープゴート率 82.8% は高めで、受けの主軸になっている。 挑発率 13.1% は中程度。
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

### Loop 6: 警告診断: 黒速攻&殲滅

- 対象: `submission-pro-with-rare8-black-1354`（master black / Pro 8あり / normal only）。勝率は高いがwarningが多かったため、長期戦リスクを再確認する。
- AI評価: baseline
- 結果: score 24、overall 12-8 / 60%、vs Black 6-4 / 60%、vs White 6-4 / 60%、0F/5W。
- 読み解き: 勝ち星があっても warning が多く、長期戦または停滞のリスクが評価を下げている。 黒速攻に押し負けず、白相手にも最低限の勝ち筋を残している。 負け試合の相手残HP平均は 3.0 で、惜敗寄り。
- 特技傾向: スケープゴート率 86.9% はかなり高く、守り先の選別が甘い可能性がある。 挑発率 11.4% は中程度。 マスター攻撃率 1.7% は低く、防御特技にかなり寄っている。
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

### Loop 7: デッキ診断: HP直撃

- 対象: `submission-pro-with-rare8-black-1328`（master black / Pro 8あり / special allowed）。直撃密度だけでは勝てない仮説を再確認する。
- AI評価: baseline
- 結果: score 36.9、overall 7-13 / 35%、vs Black 3-7 / 30%、vs White 4-6 / 40%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.1 で、中程度の負け方。
- 特技傾向: スケープゴート率 79.2% は比較的抑えられている。 挑発率 17.1% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 8: デッキ診断: 極端なぼうえい

- 対象: `submission-pro-no-rare8-white-1347`（master white / Pro 8なし / special allowed）。防御密度を上げた場合にデコイがホワイト化しないか見る。
- AI評価: baseline
- 結果: score 40.2、overall 8-12 / 40%、vs Black 4-6 / 40%、vs White 4-6 / 40%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 5.4 で、中程度の負け方。
- 特技傾向: スケープゴート率 83.5% は高めで、受けの主軸になっている。 挑発率 12.3% は中程度。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 9: AI評価: 挑発+8 / black-pressure

- 対象: `black-pressure`（master - / built-in / normal only）。黒相手に挑発を少し厚くし、バーサク打点の当たり先を曲げられるか見る。
- AI評価: provoke +8
- 結果: score 29.7、overall 5-15 / 25%、vs Black 3-7 / 30%、vs White 2-8 / 20%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 4.1 で、中程度の負け方。
- 特技傾向: スケープゴート率 66.9% は比較的抑えられている。 挑発率 28.7% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 10: AI評価: 挑発+16 / black-pressure

- 対象: `black-pressure`（master - / built-in / normal only）。挑発評価を明確に上げ、スケープゴート偏重を緩められるか見る。
- AI評価: provoke +16
- 結果: score 29.1、overall 5-15 / 25%、vs Black 3-7 / 30%、vs White 2-8 / 20%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 4.3 で、中程度の負け方。
- 特技傾向: スケープゴート率 66.4% は比較的抑えられている。 挑発率 30.2% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 11: AI評価: 挑発+24 / black-pressure

- 対象: `black-pressure`（master - / built-in / normal only）。挑発を強めすぎた時に白相手や長期戦が崩れないか見る。
- AI評価: provoke +24
- 結果: score 17.9、overall 3-17 / 15%、vs Black 1-9 / 10%、vs White 2-8 / 20%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 5.0 で、中程度の負け方。
- 特技傾向: スケープゴート率 55.8% は比較的抑えられている。 挑発率 41.1% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 12: AI評価: スケープゴート-8 / black-pressure

- 対象: `black-pressure`（master - / built-in / normal only）。スケープゴート連打を少し抑えても黒耐性が残るか見る。
- AI評価: scapegoat -8
- 結果: score 26.8、overall 5-15 / 25%、vs Black 2-8 / 20%、vs White 3-7 / 30%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 4.5 で、中程度の負け方。
- 特技傾向: スケープゴート率 65.5% は比較的抑えられている。 挑発率 28.8% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 13: AI評価: スケープゴート-16 / black-pressure

- 対象: `black-pressure`（master - / built-in / normal only）。スケープゴート依存を強く抑えた時の勝率低下を測る。
- AI評価: scapegoat -16
- 結果: score 40.3、overall 9-11 / 45%、vs Black 2-8 / 20%、vs White 7-3 / 70%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白相手には戦える一方、主目的の黒速攻対策としては弱い。 負け試合の相手残HP平均は 5.1 で、中程度の負け方。
- 特技傾向: スケープゴート率 57.7% は比較的抑えられている。 挑発率 37.6% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 14: AI評価: 挑発+16 / pressure-normal

- 対象: `pressure-normal`（master - / built-in / normal only）。白安定寄りの基準デッキで挑発厚めが黒耐性を足せるか見る。
- AI評価: provoke +16
- 結果: score 36.5、overall 7-13 / 35%、vs Black 3-7 / 30%、vs White 4-6 / 40%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.5 で、中程度の負け方。
- 特技傾向: スケープゴート率 57.7% は比較的抑えられている。 挑発率 36.7% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 15: AI評価: スケープゴート-8 / pressure-normal

- 対象: `pressure-normal`（master - / built-in / normal only）。基準デッキでスケープゴート依存を抑えても勝率が残るか見る。
- AI評価: scapegoat -8
- 結果: score 35.5、overall 7-13 / 35%、vs Black 3-7 / 30%、vs White 4-6 / 40%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.9 で、中程度の負け方。
- 特技傾向: スケープゴート率 63.1% は比較的抑えられている。 挑発率 30.1% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 16: AI評価: マスター攻撃-8 / pressure-normal

- 対象: `pressure-normal`（master - / built-in / normal only）。通常攻撃へ逃げる場面を減らし、防御特技を選ばせる価値を見る。
- AI評価: master_attack -8
- 結果: score 35.3、overall 7-13 / 35%、vs Black 2-8 / 20%、vs White 5-5 / 50%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白相手には戦える一方、主目的の黒速攻対策としては弱い。 負け試合の相手残HP平均は 4.3 で、中程度の負け方。
- 特技傾向: スケープゴート率 73.1% は比較的抑えられている。 挑発率 19.4% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 17: AI評価: 特技採用margin+12 / black-pressure

- 対象: `black-pressure`（master - / built-in / normal only）。CPU通常手より明確に強い時だけ特技を使わせ、連打リスクを下げる。
- AI評価: margin +12
- 結果: score 56.3、overall 11-9 / 55%、vs Black 6-4 / 60%、vs White 5-5 / 50%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 黒速攻に押し負けず、白相手にも最低限の勝ち筋を残している。 負け試合の相手残HP平均は 3.4 で、惜敗寄り。
- 特技傾向: スケープゴート率 85.2% はかなり高く、守り先の選別が甘い可能性がある。 挑発率 12.4% は中程度。 マスター攻撃率 2.4% は低く、防御特技にかなり寄っている。
- 次アクション: 100戦マトリクスへ進め、黒相手と白相手の再現性を確認する。

### Loop 18: AI評価: 特技採用margin-8 / pressure-normal

- 対象: `pressure-normal`（master - / built-in / normal only）。特技を早めに切る挙動が黒速攻へ間に合うか見る。
- AI評価: margin -8
- 結果: score 28.5、overall 5-15 / 25%、vs Black 2-8 / 20%、vs White 3-7 / 30%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 4.0 で、惜敗寄り。
- 特技傾向: スケープゴート率 73.5% は比較的抑えられている。 挑発率 19.7% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 19: 混合: black-pressure / 挑発+16 / スケープゴート-8

- 対象: `black-pressure`（master - / built-in / normal only）。前回本命デッキに、挑発強化とスケープゴート抑制を同時に入れる。
- AI評価: provoke +16<br>scapegoat -8
- 結果: score 17.5、overall 3-17 / 15%、vs Black 1-9 / 10%、vs White 2-8 / 20%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 4.8 で、中程度の負け方。
- 特技傾向: スケープゴート率 56.9% は比較的抑えられている。 挑発率 38.7% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 20: 混合: pressure-normal / 挑発+16 / スケープゴート-8

- 対象: `pressure-normal`（master - / built-in / normal only）。白安定を維持しながら黒速攻への受けを厚くする。
- AI評価: provoke +16<br>scapegoat -8
- 結果: score 24.1、overall 4-16 / 20%、vs Black 2-8 / 20%、vs White 2-8 / 20%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 4.1 で、中程度の負け方。
- 特技傾向: スケープゴート率 42.2% は比較的抑えられている。 挑発率 51.8% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 21: 混合: 1403 / 挑発+16 / スケープゴート-8

- 対象: `submission-pro-no-rare8-black-1403`（master black / Pro 8なし / normal only）。妨害寄りデッキで挑発の攻撃順誘導が噛み合うか見る。
- AI評価: provoke +16<br>scapegoat -8
- 結果: score 39.3、overall 8-12 / 40%、vs Black 3-7 / 30%、vs White 5-5 / 50%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白相手には戦える一方、主目的の黒速攻対策としては弱い。 負け試合の相手残HP平均は 4.8 で、中程度の負け方。
- 特技傾向: スケープゴート率 49.8% は比較的抑えられている。 挑発率 46.4% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 22: 混合: 1354 / 挑発+16 / スケープゴート-16

- 対象: `submission-pro-with-rare8-black-1354`（master black / Pro 8あり / normal only）。warningの多い高勝率候補で、スケープゴート過多を落として安定化するか見る。
- AI評価: provoke +16<br>scapegoat -16
- 結果: score 23.9、overall 4-16 / 20%、vs Black 2-8 / 20%、vs White 2-8 / 20%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 3.6 で、惜敗寄り。
- 特技傾向: スケープゴート率 48.2% は比較的抑えられている。 挑発率 48.1% は高めで、攻撃順の誘導も使えている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

## Reading

- `Overall` はミラーを除いたデコイ側の勝率。白/黒それぞれを相手にした両座席の合算を見る。
- `Loss Opp HP` はデコイ敗北時の相手マスター残HP平均。低いほど惜敗、高いほど押し切られている。
- このループはスクリーニングであり、上位候補は中母数または100戦マトリクスで再確認する。
