# Master Lab Improvement Loop: decoy

生成: 2026-06-16T03:03:15.887Z
ループ数: 24
試行: 5 games/matchup（5 matchups）

## Conclusion

判定: needs_full_gate

対象評価: enemy+16 / margin+12 が基準より伸びた。小母数の上振れを排除するため、まず上位候補を100戦マトリクスで再検証する。

### Reasons

- target_black_enemy16_margin12: black-pressure / overall 65% / vs Black 70% / score 63.8
- baseline deck_black_pressure: black-pressure / overall 35% / vs Black 40%
- black gain +30%, overall gain +30%

### Next Steps

- target_black_enemy16_margin12 を games-per-matchup 100 で再実行する。
- 上位3件の負けログを見て、スケープゴート過多か挑発不足かを分類する。
- 100戦でも黒相手が50%を超えるなら、デッキ調整ループを継続する。

## Summary

- 24ループ / 600戦スクリーニング。failure は0、warning は4。
- ミラーを除くデコイ側の最高スコアは `target_black_enemy16_margin12`（対象評価: enemy+16 / margin+12）の score 63.8。overall 65%、vs Black 70%。
- 最上位の敵スケープゴート率は 36.4%（スケープゴート内比率）。味方保護だけで勝っているのか、敵対象で戦い方が変わったのかを次回判断材料にする。
- 基準にした `deck_black_pressure` は overall 35%、vs Black 40%。差分は black +30%、overall +30%。
- vs Black 50%以上かつ warning 1件以下の候補は 7 件。横展開より、上位候補の中母数再検証に進む段階。
- 中間検証でもスケープゴート率80%超かつ敵対象率5%未満が続くなら、単なる味方保護マスターに戻っているため、評価式より特技設計側の見直しを優先する。

## Next Loop Proposal

- 提案: 上位候補の再現性確認を優先する。次は候補数を減らし、games-per-matchup を 20-30 に上げる。
- 次回候補: `target_black_enemy16_margin12` (black-pressure, score 63.8) / `ai_black_strict_margin12` (black-pressure, score 58.8) / `target_black_enemy24_margin12` (black-pressure, score 58.7) / `hybrid_black_provoke16_enemy16` (black-pressure, score 56)
- 目安: スクリーニング継続なら20-24ループ、本採用前の再現性確認なら3-5候補に絞って各100-150戦。
- 分岐: 上位でも敵スケープゴート率が5%未満なら、敵対象バイアスをさらに強めるより、敵に付けた時だけ価値が出る新特技案へ切り替える。

## Loop Schedule

| Loop | Kind | Experiment | Deck | AI Eval | Hypothesis |
| ---: | --- | --- | --- | --- | --- |
| 1 | deck | deck_black_pressure<br>基準: black-pressure | black-pressure<br>ブラック検証 | baseline | 前回上位。敵スケープゴート解禁後も黒耐性が残るか見る。 |
| 2 | ai_eval | ai_black_strict_margin12<br>再確認: 特技採用margin+12 | black-pressure<br>ブラック検証 | margin +12 | 前回最上位の慎重運用を、敵スケープゴート解禁後の基準にする。 |
| 3 | deck | deck_beatdown_lock<br>再確認: ビートダウン&ロック | submission-pro-no-rare8-black-1403<br>投稿Pro黒8なし #1403 ビートダウン&ロック | baseline | 妨害寄りデッキで、敵対象スケープゴートが攻撃順の誘導として働くか見る。 |
| 4 | deck | deck_agito_growth<br>再確認: アギト育成 | submission-pro-no-rare8-white-1340<br>投稿Pro白8なし #1340 アギト育成デッキ | baseline | 育成寄り構成で、敵の主力を囮化する価値が出るか見る。 |
| 5 | warning_probe | deck_1354_warning_probe<br>警告診断: 黒速攻&殲滅 | submission-pro-with-rare8-black-1354<br>投稿Pro黒8あり #1354 星８有状況下黒速攻＆殲滅デッキ | baseline | 高勝率だがwarningが出やすい候補で、敵スケープゴートが長期戦リスクを増やすか見る。 |
| 6 | ai_eval | target_black_enemy_plus8<br>対象評価: enemy+8 / black-pressure | black-pressure<br>ブラック検証 | target enemy +8 | 敵モンスターへのスケープゴートを軽く後押しし、実際に選ばれる入口を作る。 |
| 7 | ai_eval | target_black_enemy_plus16<br>対象評価: enemy+16 / black-pressure | black-pressure<br>ブラック検証 | target enemy +16 | 敵対象を明確に評価し、勝率と使用率の両方を見る。 |
| 8 | ai_eval | target_black_enemy_plus24<br>対象評価: enemy+24 / black-pressure | black-pressure<br>ブラック検証 | target enemy +24 | 敵対象を強く押した時に、リーサルを逃す副作用が出るか見る。 |
| 9 | ai_eval | target_black_ally_minus8<br>対象評価: ally-8 / black-pressure | black-pressure<br>ブラック検証 | target ally -8 | 味方保護の過多を少し抑え、敵対象へ自然に寄るか見る。 |
| 10 | ai_eval | target_black_ally_minus16<br>対象評価: ally-16 / black-pressure | black-pressure<br>ブラック検証 | target ally -16 | 味方保護を強めに抑えた場合、防御力が落ちすぎないか測る。 |
| 11 | ai_eval | target_black_enemy16_allyminus8<br>対象評価: enemy+16 / ally-8 | black-pressure<br>ブラック検証 | target ally -8<br>target enemy +16 | 敵対象を伸ばしつつ味方連打を抑え、行動の質を変えられるか見る。 |
| 12 | ai_eval | target_black_enemy24_allyminus16<br>対象評価: enemy+24 / ally-16 | black-pressure<br>ブラック検証 | target ally -16<br>target enemy +24 | 敵対象へ強く寄せた極端条件で、勝率低下の境界を探る。 |
| 13 | ai_eval | target_black_enemy16_margin12<br>対象評価: enemy+16 / margin+12 | black-pressure<br>ブラック検証 | margin +12<br>target enemy +16 | 慎重採用と敵対象評価を併用し、無駄撃ちを抑えながら質を変える。 |
| 14 | ai_eval | target_black_enemy24_margin12<br>対象評価: enemy+24 / margin+12 | black-pressure<br>ブラック検証 | margin +12<br>target enemy +24 | 敵対象を強く評価しても、CPU通常手を上回る時だけ採用すれば安定するか見る。 |
| 15 | ai_eval | target_pressure_enemy16<br>対象評価: enemy+16 / pressure-normal | pressure-normal<br>通常プレッシャー | target enemy +16 | 通常プレッシャー構成でも敵対象の価値が再現するか見る。 |
| 16 | ai_eval | target_pressure_enemy24<br>対象評価: enemy+24 / pressure-normal | pressure-normal<br>通常プレッシャー | target enemy +24 | 基準デッキで敵対象を強めた時、白相手の勝率を壊さないか見る。 |
| 17 | ai_eval | target_pressure_enemy16_allyminus8<br>対象評価: pressure / enemy+16 / ally-8 | pressure-normal<br>通常プレッシャー | target ally -8<br>target enemy +16 | 通常構成で味方保護を減らし、敵対象の実用域を探る。 |
| 18 | ai_eval | target_1403_enemy16<br>対象評価: 1403 / enemy+16 | submission-pro-no-rare8-black-1403<br>投稿Pro黒8なし #1403 ビートダウン&ロック | target enemy +16 | 妨害デッキで敵主力の囮化が除去テンポと噛み合うか見る。 |
| 19 | ai_eval | target_1403_enemy24_allyminus8<br>対象評価: 1403 / enemy+24 / ally-8 | submission-pro-no-rare8-black-1403<br>投稿Pro黒8なし #1403 ビートダウン&ロック | target ally -8<br>target enemy +24 | 妨害寄りで敵対象を強め、攻撃順誘導の上限を探る。 |
| 20 | ai_eval | target_1340_enemy16<br>対象評価: 1340 / enemy+16 | submission-pro-no-rare8-white-1340<br>投稿Pro白8なし #1340 アギト育成デッキ | target enemy +16 | 育成デッキで敵対象がレベル差のやり取りに関与できるか見る。 |
| 21 | ai_eval | target_1354_enemy16_allyminus16<br>対象評価: 1354 / enemy+16 / ally-16 | submission-pro-with-rare8-black-1354<br>投稿Pro黒8あり #1354 星８有状況下黒速攻＆殲滅デッキ | target ally -16<br>target enemy +16 | 高勝率候補の味方スケープゴート過多を強く落とし、warningが減るか見る。 |
| 22 | ai_eval | target_1354_enemy24_margin12<br>対象評価: 1354 / enemy+24 / margin+12 | submission-pro-with-rare8-black-1354<br>投稿Pro黒8あり #1354 星８有状況下黒速攻＆殲滅デッキ | margin +12<br>target enemy +24 | 長期戦候補で慎重採用を足し、敵対象の副作用を抑える。 |
| 23 | hybrid | hybrid_black_provoke16_enemy16<br>混合: 挑発+16 / enemy+16 | black-pressure<br>ブラック検証 | provoke +16<br>target enemy +16 | 挑発と敵スケープゴートを両方使い、回避型らしい攻撃誘導へ寄せる。 |
| 24 | hybrid | hybrid_black_provoke16_enemy24_allyminus8<br>混合: 挑発+16 / enemy+24 / ally-8 | black-pressure<br>ブラック検証 | provoke +16<br>target ally -8<br>target enemy +24 | 敵対象を強くしつつ挑発も増やし、味方保護一辺倒から脱却できるか見る。 |

## Top Candidates

| Rank | Loop | Deck | Score | Overall | vs Black | vs White | Loss Opp HP | Usage | Issues | Judgement |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | 13 | target_black_enemy16_margin12<br>対象評価: enemy+16 / margin+12<br>black-pressure | 63.8 | 13-7<br>65% | 7-3<br>70% | 6-4<br>60% | 5.1 | S 94.8% (E 36.4%)<br>P 5%<br>A 0.2% | 0F/0W | advance |
| 2 | 2 | ai_black_strict_margin12<br>再確認: 特技採用margin+12<br>black-pressure | 58.8 | 12-8<br>60% | 6-4<br>60% | 6-4<br>60% | 5.1 | S 88.1% (E 8.9%)<br>P 11.7%<br>A 0.2% | 0F/0W | advance |
| 3 | 14 | target_black_enemy24_margin12<br>対象評価: enemy+24 / margin+12<br>black-pressure | 58.7 | 12-8<br>60% | 6-4<br>60% | 6-4<br>60% | 4.0 | S 96% (E 45%)<br>P 3.9%<br>A 0.2% | 0F/0W | hold |
| 4 | 23 | hybrid_black_provoke16_enemy16<br>混合: 挑発+16 / enemy+16<br>black-pressure | 56 | 11-9<br>55% | 5-5<br>50% | 6-4<br>60% | 3.8 | S 69% (E 21.7%)<br>P 30.6%<br>A 0.4% | 0F/0W | hold |
| 5 | 3 | deck_beatdown_lock<br>再確認: ビートダウン&ロック<br>submission-pro-no-rare8-black-1403 | 51.8 | 10-10<br>50% | 5-5<br>50% | 5-5<br>50% | 3.9 | S 85.1% (E 11.1%)<br>P 14.9%<br>A 0% | 0F/0W | hold |

## Loop Results

| Loop | Deck | Hypothesis | Score | Overall | vs Black | vs White | Avg Turns | Loss Opp HP | Action Usage | Issues | Judgement |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | deck_black_pressure<br>基準: black-pressure<br>black-pressure<br>master - / built-in / normal only | 前回上位。敵スケープゴート解禁後も黒耐性が残るか見る。 | 38.4 | 7-13<br>35% | 4-6<br>40% | 3-7<br>30% | 17.1 | 4.8 | S 88.1% (E 13.5%)<br>P 11.9%<br>A 0% | 0F/0W | reject |
| 2 | ai_black_strict_margin12<br>再確認: 特技採用margin+12<br>black-pressure<br>master - / built-in / normal only | 前回最上位の慎重運用を、敵スケープゴート解禁後の基準にする。 | 58.8 | 12-8<br>60% | 6-4<br>60% | 6-4<br>60% | 18.9 | 5.1 | S 88.1% (E 8.9%)<br>P 11.7%<br>A 0.2% | 0F/0W | advance |
| 3 | deck_beatdown_lock<br>再確認: ビートダウン&ロック<br>submission-pro-no-rare8-black-1403<br>master black / Pro 8なし / normal only | 妨害寄りデッキで、敵対象スケープゴートが攻撃順の誘導として働くか見る。 | 51.8 | 10-10<br>50% | 5-5<br>50% | 5-5<br>50% | 17.7 | 3.9 | S 85.1% (E 11.1%)<br>P 14.9%<br>A 0% | 0F/0W | hold |
| 4 | deck_agito_growth<br>再確認: アギト育成<br>submission-pro-no-rare8-white-1340<br>master white / Pro 8なし / special allowed | 育成寄り構成で、敵の主力を囮化する価値が出るか見る。 | 37.8 | 7-13<br>35% | 4-6<br>40% | 3-7<br>30% | 21.4 | 4.5 | S 88.7% (E 9.7%)<br>P 11.3%<br>A 0% | 0F/0W | reject |
| 5 | deck_1354_warning_probe<br>警告診断: 黒速攻&殲滅<br>submission-pro-with-rare8-black-1354<br>master black / Pro 8あり / normal only | 高勝率だがwarningが出やすい候補で、敵スケープゴートが長期戦リスクを増やすか見る。 | 28 | 11-9<br>55% | 6-4<br>60% | 5-5<br>50% | 22.2 | 2.9 | S 88.7% (E 6.3%)<br>P 11.1%<br>A 0.2% | 0F/4W | hold |
| 6 | target_black_enemy_plus8<br>対象評価: enemy+8 / black-pressure<br>black-pressure<br>master - / built-in / normal only | 敵モンスターへのスケープゴートを軽く後押しし、実際に選ばれる入口を作る。 | 40.5 | 8-12<br>40% | 4-6<br>40% | 4-6<br>40% | 17.1 | 5.5 | S 96.3% (E 26.3%)<br>P 3.6%<br>A 0.2% | 0F/0W | reject |
| 7 | target_black_enemy_plus16<br>対象評価: enemy+16 / black-pressure<br>black-pressure<br>master - / built-in / normal only | 敵対象を明確に評価し、勝率と使用率の両方を見る。 | 44.8 | 9-11<br>45% | 4-6<br>40% | 5-5<br>50% | 15.9 | 4.3 | S 96.9% (E 41.9%)<br>P 2.8%<br>A 0.4% | 0F/0W | reject |
| 8 | target_black_enemy_plus24<br>対象評価: enemy+24 / black-pressure<br>black-pressure<br>master - / built-in / normal only | 敵対象を強く押した時に、リーサルを逃す副作用が出るか見る。 | 49.1 | 10-10<br>50% | 5-5<br>50% | 5-5<br>50% | 18 | 4.5 | S 98.1% (E 46.8%)<br>P 1.8%<br>A 0.1% | 0F/0W | hold |
| 9 | target_black_ally_minus8<br>対象評価: ally-8 / black-pressure<br>black-pressure<br>master - / built-in / normal only | 味方保護の過多を少し抑え、敵対象へ自然に寄るか見る。 | 28.8 | 5-15<br>25% | 2-8<br>20% | 3-7<br>30% | 16.2 | 4.9 | S 72.5% (E 18.3%)<br>P 27.1%<br>A 0.4% | 0F/0W | reject |
| 10 | target_black_ally_minus16<br>対象評価: ally-16 / black-pressure<br>black-pressure<br>master - / built-in / normal only | 味方保護を強めに抑えた場合、防御力が落ちすぎないか測る。 | 37.7 | 7-13<br>35% | 3-7<br>30% | 4-6<br>40% | 15.2 | 5.0 | S 64% (E 25%)<br>P 35.3%<br>A 0.7% | 0F/0W | reject |
| 11 | target_black_enemy16_allyminus8<br>対象評価: enemy+16 / ally-8<br>black-pressure<br>master - / built-in / normal only | 敵対象を伸ばしつつ味方連打を抑え、行動の質を変えられるか見る。 | 43.4 | 8-12<br>40% | 5-5<br>50% | 3-7<br>30% | 17.2 | 3.4 | S 96.5% (E 43.4%)<br>P 3.1%<br>A 0.3% | 0F/0W | hold |
| 12 | target_black_enemy24_allyminus16<br>対象評価: enemy+24 / ally-16<br>black-pressure<br>master - / built-in / normal only | 敵対象へ強く寄せた極端条件で、勝率低下の境界を探る。 | 24.2 | 4-16<br>20% | 2-8<br>20% | 2-8<br>20% | 14.2 | 3.7 | S 93.5% (E 69.7%)<br>P 6.3%<br>A 0.2% | 0F/0W | reject |
| 13 | target_black_enemy16_margin12<br>対象評価: enemy+16 / margin+12<br>black-pressure<br>master - / built-in / normal only | 慎重採用と敵対象評価を併用し、無駄撃ちを抑えながら質を変える。 | 63.8 | 13-7<br>65% | 7-3<br>70% | 6-4<br>60% | 16.5 | 5.1 | S 94.8% (E 36.4%)<br>P 5%<br>A 0.2% | 0F/0W | advance |
| 14 | target_black_enemy24_margin12<br>対象評価: enemy+24 / margin+12<br>black-pressure<br>master - / built-in / normal only | 敵対象を強く評価しても、CPU通常手を上回る時だけ採用すれば安定するか見る。 | 58.7 | 12-8<br>60% | 6-4<br>60% | 6-4<br>60% | 15.9 | 4.0 | S 96% (E 45%)<br>P 3.9%<br>A 0.2% | 0F/0W | hold |
| 15 | target_pressure_enemy16<br>対象評価: enemy+16 / pressure-normal<br>pressure-normal<br>master - / built-in / normal only | 通常プレッシャー構成でも敵対象の価値が再現するか見る。 | 34.2 | 6-14<br>30% | 4-6<br>40% | 2-8<br>20% | 15.6 | 4.3 | S 98% (E 45.7%)<br>P 2%<br>A 0% | 0F/0W | reject |
| 16 | target_pressure_enemy24<br>対象評価: enemy+24 / pressure-normal<br>pressure-normal<br>master - / built-in / normal only | 基準デッキで敵対象を強めた時、白相手の勝率を壊さないか見る。 | 33.2 | 6-14<br>30% | 3-7<br>30% | 3-7<br>30% | 16.1 | 3.8 | S 96% (E 49.3%)<br>P 4%<br>A 0% | 0F/0W | reject |
| 17 | target_pressure_enemy16_allyminus8<br>対象評価: pressure / enemy+16 / ally-8<br>pressure-normal<br>master - / built-in / normal only | 通常構成で味方保護を減らし、敵対象の実用域を探る。 | 37.7 | 7-13<br>35% | 4-6<br>40% | 3-7<br>30% | 15.6 | 4.3 | S 95.3% (E 53%)<br>P 4.7%<br>A 0% | 0F/0W | reject |
| 18 | target_1403_enemy16<br>対象評価: 1403 / enemy+16<br>submission-pro-no-rare8-black-1403<br>master black / Pro 8なし / normal only | 妨害デッキで敵主力の囮化が除去テンポと噛み合うか見る。 | 33.7 | 6-14<br>30% | 4-6<br>40% | 2-8<br>20% | 15.6 | 4.6 | S 98.1% (E 43.3%)<br>P 1.9%<br>A 0% | 0F/0W | reject |
| 19 | target_1403_enemy24_allyminus8<br>対象評価: 1403 / enemy+24 / ally-8<br>submission-pro-no-rare8-black-1403<br>master black / Pro 8なし / normal only | 妨害寄りで敵対象を強め、攻撃順誘導の上限を探る。 | 33.9 | 7-13<br>35% | 2-8<br>20% | 5-5<br>50% | 15.6 | 3.9 | S 96.6% (E 57.8%)<br>P 3.4%<br>A 0% | 0F/0W | reject |
| 20 | target_1340_enemy16<br>対象評価: 1340 / enemy+16<br>submission-pro-no-rare8-white-1340<br>master white / Pro 8なし / special allowed | 育成デッキで敵対象がレベル差のやり取りに関与できるか見る。 | 21.7 | 4-16<br>20% | 1-9<br>10% | 3-7<br>30% | 20.1 | 3.7 | S 97.5% (E 39.5%)<br>P 2.5%<br>A 0% | 0F/0W | reject |
| 21 | target_1354_enemy16_allyminus16<br>対象評価: 1354 / enemy+16 / ally-16<br>submission-pro-with-rare8-black-1354<br>master black / Pro 8あり / normal only | 高勝率候補の味方スケープゴート過多を強く落とし、warningが減るか見る。 | 28.8 | 6-14<br>30% | 1-9<br>10% | 5-5<br>50% | 16 | 4.1 | S 94.8% (E 58.5%)<br>P 5.2%<br>A 0% | 0F/0W | reject |
| 22 | target_1354_enemy24_margin12<br>対象評価: 1354 / enemy+24 / margin+12<br>submission-pro-with-rare8-black-1354<br>master black / Pro 8あり / normal only | 長期戦候補で慎重採用を足し、敵対象の副作用を抑える。 | 39.2 | 9-11<br>45% | 1-9<br>10% | 8-2<br>80% | 18.4 | 3.6 | S 98.5% (E 40.9%)<br>P 1.5%<br>A 0% | 0F/0W | reject |
| 23 | hybrid_black_provoke16_enemy16<br>混合: 挑発+16 / enemy+16<br>black-pressure<br>master - / built-in / normal only | 挑発と敵スケープゴートを両方使い、回避型らしい攻撃誘導へ寄せる。 | 56 | 11-9<br>55% | 5-5<br>50% | 6-4<br>60% | 16 | 3.8 | S 69% (E 21.7%)<br>P 30.6%<br>A 0.4% | 0F/0W | hold |
| 24 | hybrid_black_provoke16_enemy24_allyminus8<br>混合: 挑発+16 / enemy+24 / ally-8<br>black-pressure<br>master - / built-in / normal only | 敵対象を強くしつつ挑発も増やし、味方保護一辺倒から脱却できるか見る。 | 20.2 | 3-17<br>15% | 1-9<br>10% | 2-8<br>20% | 14.7 | 3.6 | S 89.1% (E 61.1%)<br>P 10.5%<br>A 0.4% | 0F/0W | reject |

## Loop Notes

### Loop 1: 基準: black-pressure

- 対象: `black-pressure`（master - / built-in / normal only）。前回上位。敵スケープゴート解禁後も黒耐性が残るか見る。
- AI評価: baseline
- 結果: score 38.4、overall 7-13 / 35%、vs Black 4-6 / 40%、vs White 3-7 / 30%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.8 で、中程度の負け方。
- 特技傾向: スケープゴート率 88.1% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 13.5% は少量だが観測できる。 挑発率 11.9% は中程度。 マスター攻撃率 0% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 2: 再確認: 特技採用margin+12

- 対象: `black-pressure`（master - / built-in / normal only）。前回最上位の慎重運用を、敵スケープゴート解禁後の基準にする。
- AI評価: margin +12
- 結果: score 58.8、overall 12-8 / 60%、vs Black 6-4 / 60%、vs White 6-4 / 60%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 黒速攻に押し負けず、白相手にも最低限の勝ち筋を残している。 負け試合の相手残HP平均は 5.1 で、中程度の負け方。
- 特技傾向: スケープゴート率 88.1% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 8.9% は少量だが観測できる。 挑発率 11.7% は中程度。 マスター攻撃率 0.2% は低く、防御特技にかなり寄っている。
- 次アクション: 100戦マトリクスへ進め、黒相手と白相手の再現性を確認する。

### Loop 3: 再確認: ビートダウン&ロック

- 対象: `submission-pro-no-rare8-black-1403`（master black / Pro 8なし / normal only）。妨害寄りデッキで、敵対象スケープゴートが攻撃順の誘導として働くか見る。
- AI評価: baseline
- 結果: score 51.8、overall 10-10 / 50%、vs Black 5-5 / 50%、vs White 5-5 / 50%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 全体では五分以上だが、黒相手の再現性はまだ足りない。 負け試合の相手残HP平均は 3.9 で、惜敗寄り。
- 特技傾向: スケープゴート率 85.1% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 11.1% は少量だが観測できる。 挑発率 14.9% は中程度。 マスター攻撃率 0% は低く、防御特技にかなり寄っている。
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

### Loop 4: 再確認: アギト育成

- 対象: `submission-pro-no-rare8-white-1340`（master white / Pro 8なし / special allowed）。育成寄り構成で、敵の主力を囮化する価値が出るか見る。
- AI評価: baseline
- 結果: score 37.8、overall 7-13 / 35%、vs Black 4-6 / 40%、vs White 3-7 / 30%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.5 で、中程度の負け方。
- 特技傾向: スケープゴート率 88.7% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 9.7% は少量だが観測できる。 挑発率 11.3% は中程度。 マスター攻撃率 0% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 5: 警告診断: 黒速攻&殲滅

- 対象: `submission-pro-with-rare8-black-1354`（master black / Pro 8あり / normal only）。高勝率だがwarningが出やすい候補で、敵スケープゴートが長期戦リスクを増やすか見る。
- AI評価: baseline
- 結果: score 28、overall 11-9 / 55%、vs Black 6-4 / 60%、vs White 5-5 / 50%、0F/4W。
- 読み解き: 勝ち星があっても warning が多く、長期戦または停滞のリスクが評価を下げている。 黒速攻に押し負けず、白相手にも最低限の勝ち筋を残している。 負け試合の相手残HP平均は 2.9 で、惜敗寄り。
- 特技傾向: スケープゴート率 88.7% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 6.3% は少量だが観測できる。 挑発率 11.1% は中程度。 マスター攻撃率 0.2% は低く、防御特技にかなり寄っている。
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

### Loop 6: 対象評価: enemy+8 / black-pressure

- 対象: `black-pressure`（master - / built-in / normal only）。敵モンスターへのスケープゴートを軽く後押しし、実際に選ばれる入口を作る。
- AI評価: target enemy +8
- 結果: score 40.5、overall 8-12 / 40%、vs Black 4-6 / 40%、vs White 4-6 / 40%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 5.5 で、中程度の負け方。
- 特技傾向: スケープゴート率 96.3% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 26.3% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 3.6% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.2% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 7: 対象評価: enemy+16 / black-pressure

- 対象: `black-pressure`（master - / built-in / normal only）。敵対象を明確に評価し、勝率と使用率の両方を見る。
- AI評価: target enemy +16
- 結果: score 44.8、overall 9-11 / 45%、vs Black 4-6 / 40%、vs White 5-5 / 50%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.3 で、中程度の負け方。
- 特技傾向: スケープゴート率 96.9% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 41.9% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 2.8% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.4% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 8: 対象評価: enemy+24 / black-pressure

- 対象: `black-pressure`（master - / built-in / normal only）。敵対象を強く押した時に、リーサルを逃す副作用が出るか見る。
- AI評価: target enemy +24
- 結果: score 49.1、overall 10-10 / 50%、vs Black 5-5 / 50%、vs White 5-5 / 50%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 全体では五分以上だが、黒相手の再現性はまだ足りない。 負け試合の相手残HP平均は 4.5 で、中程度の負け方。
- 特技傾向: スケープゴート率 98.1% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 46.8% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 1.8% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.1% は低く、防御特技にかなり寄っている。
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

### Loop 9: 対象評価: ally-8 / black-pressure

- 対象: `black-pressure`（master - / built-in / normal only）。味方保護の過多を少し抑え、敵対象へ自然に寄るか見る。
- AI評価: target ally -8
- 結果: score 28.8、overall 5-15 / 25%、vs Black 2-8 / 20%、vs White 3-7 / 30%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 4.9 で、中程度の負け方。
- 特技傾向: スケープゴート率 72.5% は比較的抑えられている。 敵スケープゴート率 18.3% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 27.1% は高めで、攻撃順の誘導も使えている。 マスター攻撃率 0.4% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 10: 対象評価: ally-16 / black-pressure

- 対象: `black-pressure`（master - / built-in / normal only）。味方保護を強めに抑えた場合、防御力が落ちすぎないか測る。
- AI評価: target ally -16
- 結果: score 37.7、overall 7-13 / 35%、vs Black 3-7 / 30%、vs White 4-6 / 40%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 5.0 で、中程度の負け方。
- 特技傾向: スケープゴート率 64% は比較的抑えられている。 敵スケープゴート率 25% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 35.3% は高めで、攻撃順の誘導も使えている。 マスター攻撃率 0.7% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 11: 対象評価: enemy+16 / ally-8

- 対象: `black-pressure`（master - / built-in / normal only）。敵対象を伸ばしつつ味方連打を抑え、行動の質を変えられるか見る。
- AI評価: target ally -8<br>target enemy +16
- 結果: score 43.4、overall 8-12 / 40%、vs Black 5-5 / 50%、vs White 3-7 / 30%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 黒相手の受けは見えるが、白相手の盤面制圧にはやや押されている。 負け試合の相手残HP平均は 3.4 で、惜敗寄り。
- 特技傾向: スケープゴート率 96.5% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 43.4% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 3.1% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.3% は低く、防御特技にかなり寄っている。
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

### Loop 12: 対象評価: enemy+24 / ally-16

- 対象: `black-pressure`（master - / built-in / normal only）。敵対象へ強く寄せた極端条件で、勝率低下の境界を探る。
- AI評価: target ally -16<br>target enemy +24
- 結果: score 24.2、overall 4-16 / 20%、vs Black 2-8 / 20%、vs White 2-8 / 20%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 3.7 で、惜敗寄り。
- 特技傾向: スケープゴート率 93.5% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 69.7% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 6.3% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.2% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 13: 対象評価: enemy+16 / margin+12

- 対象: `black-pressure`（master - / built-in / normal only）。慎重採用と敵対象評価を併用し、無駄撃ちを抑えながら質を変える。
- AI評価: margin +12<br>target enemy +16
- 結果: score 63.8、overall 13-7 / 65%、vs Black 7-3 / 70%、vs White 6-4 / 60%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 黒速攻に押し負けず、白相手にも最低限の勝ち筋を残している。 負け試合の相手残HP平均は 5.1 で、中程度の負け方。
- 特技傾向: スケープゴート率 94.8% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 36.4% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 5% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.2% は低く、防御特技にかなり寄っている。
- 次アクション: 100戦マトリクスへ進め、黒相手と白相手の再現性を確認する。

### Loop 14: 対象評価: enemy+24 / margin+12

- 対象: `black-pressure`（master - / built-in / normal only）。敵対象を強く評価しても、CPU通常手を上回る時だけ採用すれば安定するか見る。
- AI評価: margin +12<br>target enemy +24
- 結果: score 58.7、overall 12-8 / 60%、vs Black 6-4 / 60%、vs White 6-4 / 60%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 黒速攻に押し負けず、白相手にも最低限の勝ち筋を残している。 負け試合の相手残HP平均は 4.0 で、惜敗寄り。
- 特技傾向: スケープゴート率 96% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 45% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 3.9% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0.2% は低く、防御特技にかなり寄っている。
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

### Loop 15: 対象評価: enemy+16 / pressure-normal

- 対象: `pressure-normal`（master - / built-in / normal only）。通常プレッシャー構成でも敵対象の価値が再現するか見る。
- AI評価: target enemy +16
- 結果: score 34.2、overall 6-14 / 30%、vs Black 4-6 / 40%、vs White 2-8 / 20%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.3 で、中程度の負け方。
- 特技傾向: スケープゴート率 98% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 45.7% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 2% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 16: 対象評価: enemy+24 / pressure-normal

- 対象: `pressure-normal`（master - / built-in / normal only）。基準デッキで敵対象を強めた時、白相手の勝率を壊さないか見る。
- AI評価: target enemy +24
- 結果: score 33.2、overall 6-14 / 30%、vs Black 3-7 / 30%、vs White 3-7 / 30%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 3.8 で、惜敗寄り。
- 特技傾向: スケープゴート率 96% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 49.3% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 4% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 17: 対象評価: pressure / enemy+16 / ally-8

- 対象: `pressure-normal`（master - / built-in / normal only）。通常構成で味方保護を減らし、敵対象の実用域を探る。
- AI評価: target ally -8<br>target enemy +16
- 結果: score 37.7、overall 7-13 / 35%、vs Black 4-6 / 40%、vs White 3-7 / 30%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.3 で、中程度の負け方。
- 特技傾向: スケープゴート率 95.3% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 53% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 4.7% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 18: 対象評価: 1403 / enemy+16

- 対象: `submission-pro-no-rare8-black-1403`（master black / Pro 8なし / normal only）。妨害デッキで敵主力の囮化が除去テンポと噛み合うか見る。
- AI評価: target enemy +16
- 結果: score 33.7、overall 6-14 / 30%、vs Black 4-6 / 40%、vs White 2-8 / 20%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 勝率面では採用圏に届かず、同系カード差し替えの優先度も低い。 負け試合の相手残HP平均は 4.6 で、中程度の負け方。
- 特技傾向: スケープゴート率 98.1% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 43.3% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 1.9% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 19: 対象評価: 1403 / enemy+24 / ally-8

- 対象: `submission-pro-no-rare8-black-1403`（master black / Pro 8なし / normal only）。妨害寄りで敵対象を強め、攻撃順誘導の上限を探る。
- AI評価: target ally -8<br>target enemy +24
- 結果: score 33.9、overall 7-13 / 35%、vs Black 2-8 / 20%、vs White 5-5 / 50%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白相手には戦える一方、主目的の黒速攻対策としては弱い。 負け試合の相手残HP平均は 3.9 で、惜敗寄り。
- 特技傾向: スケープゴート率 96.6% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 57.8% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 3.4% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 20: 対象評価: 1340 / enemy+16

- 対象: `submission-pro-no-rare8-white-1340`（master white / Pro 8なし / special allowed）。育成デッキで敵対象がレベル差のやり取りに関与できるか見る。
- AI評価: target enemy +16
- 結果: score 21.7、overall 4-16 / 20%、vs Black 1-9 / 10%、vs White 3-7 / 30%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 3.7 で、惜敗寄り。
- 特技傾向: スケープゴート率 97.5% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 39.5% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 2.5% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 21: 対象評価: 1354 / enemy+16 / ally-16

- 対象: `submission-pro-with-rare8-black-1354`（master black / Pro 8あり / normal only）。高勝率候補の味方スケープゴート過多を強く落とし、warningが減るか見る。
- AI評価: target ally -16<br>target enemy +16
- 結果: score 28.8、overall 6-14 / 30%、vs Black 1-9 / 10%、vs White 5-5 / 50%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白相手には戦える一方、主目的の黒速攻対策としては弱い。 負け試合の相手残HP平均は 4.1 で、中程度の負け方。
- 特技傾向: スケープゴート率 94.8% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 58.5% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 5.2% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 22: 対象評価: 1354 / enemy+24 / margin+12

- 対象: `submission-pro-with-rare8-black-1354`（master black / Pro 8あり / normal only）。長期戦候補で慎重採用を足し、敵対象の副作用を抑える。
- AI評価: margin +12<br>target enemy +24
- 結果: score 39.2、overall 9-11 / 45%、vs Black 1-9 / 10%、vs White 8-2 / 80%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白相手には戦える一方、主目的の黒速攻対策としては弱い。 負け試合の相手残HP平均は 3.6 で、惜敗寄り。
- 特技傾向: スケープゴート率 98.5% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 40.9% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 1.5% は低く、黒の高打点を曲げる役割が薄い。 マスター攻撃率 0% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

### Loop 23: 混合: 挑発+16 / enemy+16

- 対象: `black-pressure`（master - / built-in / normal only）。挑発と敵スケープゴートを両方使い、回避型らしい攻撃誘導へ寄せる。
- AI評価: provoke +16<br>target enemy +16
- 結果: score 56、overall 11-9 / 55%、vs Black 5-5 / 50%、vs White 6-4 / 60%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 全体では五分以上だが、黒相手の再現性はまだ足りない。 負け試合の相手残HP平均は 3.8 で、惜敗寄り。
- 特技傾向: スケープゴート率 69% は比較的抑えられている。 敵スケープゴート率 21.7% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 30.6% は高めで、攻撃順の誘導も使えている。 マスター攻撃率 0.4% は低く、防御特技にかなり寄っている。
- 次アクション: 上位候補が崩れた場合の控えとして、同系カード差し替えを検討する。

### Loop 24: 混合: 挑発+16 / enemy+24 / ally-8

- 対象: `black-pressure`（master - / built-in / normal only）。敵対象を強くしつつ挑発も増やし、味方保護一辺倒から脱却できるか見る。
- AI評価: provoke +16<br>target ally -8<br>target enemy +24
- 結果: score 20.2、overall 3-17 / 15%、vs Black 1-9 / 10%、vs White 2-8 / 20%、0F/0W。
- 読み解き: 自動対戦上の安全性はこの小母数では問題なし。 白黒どちらにも通りにくく、デコイの受け特技を活かす前に押し切られている。 負け試合の相手残HP平均は 3.6 で、惜敗寄り。
- 特技傾向: スケープゴート率 89.1% はかなり高く、守り先の選別が甘い可能性がある。 敵スケープゴート率 61.1% は十分に出ており、味方保護とは違う攻撃誘導が発生している。 挑発率 10.5% は中程度。 マスター攻撃率 0.4% は低く、防御特技にかなり寄っている。
- 次アクション: デッキ軸だけでは黒速攻対策として弱いため、優先度を下げる。

## Reading

- `Overall` はミラーを除いたデコイ側の勝率。白/黒それぞれを相手にした両座席の合算を見る。
- `Loss Opp HP` はデコイ敗北時の相手マスター残HP平均。低いほど惜敗、高いほど押し切られている。
- `Usage` の `S ... (E ...)` は、S がMaster Lab特技内のスケープゴート率、E がスケープゴート内の敵対象率。
- このループはスクリーニングであり、上位候補は中母数または100戦マトリクスで再確認する。
