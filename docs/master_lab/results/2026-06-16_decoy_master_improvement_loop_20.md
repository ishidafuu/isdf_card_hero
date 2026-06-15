# Master Lab Improvement Loop: decoy

生成: 2026-06-15T17:12:21.871Z
ループ数: 20
試行: 5 games/matchup（5 matchups）

## Conclusion

判定: continue_deck_loop

明確な採用候補はまだ本検証待ちだが、デッキ側の差は出ている。候補を絞り、同系統の微調整を続ける価値がある。

### Reasons

- black-pressure: overall 55% / vs Black 60%
- baselineとの差分は black +10%, overall +0%
- vs Black 50%以上の安定候補が 3 件ある

### Next Steps

- 上位3候補だけ games-per-matchup 20-30 で中間検証する。
- 共通カードを抽出して、デコイ向けの小さな固定デッキ候補を作る。
- 伸びが鈍れば、特技評価パラメータ比較へ切り替える。

## Summary

- 20ループ / 500戦スクリーニング。failure は0、warning は11。
- ミラーを除くデコイ側の最高値は `black-pressure` の overall 55%、vs Black 60%。基準にした `pressure-normal` は overall 55%、vs Black 50%。
- `submission-pro-with-rare8-black-1354` は overall/vs Black/vs White すべて60%だったが、warning 5件で長期戦リスクが強く、現時点では本命ではなく要注意の控え。
- `black-pressure` は黒相手だけ10pt改善している一方、overall は基準と同値。したがって「20候補をさらに横に広げる」より、上位候補を中母数で再現性確認する段階。
- その中間検証でも `black-pressure` が伸びない、またはスケープゴート率80%超が続くなら、デッキ探索をいったん止めて挑発/スケープゴートの評価式・コスト調整へ移るべき。

## Top Candidates

| Rank | Loop | Deck | Score | Overall | vs Black | vs White | Loss Opp HP | Usage | Issues | Judgement |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | 3 | black-pressure<br>ブラック検証 | 54.5 | 11-9<br>55% | 6-4<br>60% | 5-5<br>50% | 5.1 | S 84.7%<br>P 11.8%<br>A 3.5% | 0F/0W | advance |
| 2 | 1 | pressure-normal<br>通常プレッシャー | 53.8 | 11-9<br>55% | 5-5<br>50% | 6-4<br>60% | 4.9 | S 78.5%<br>P 15.9%<br>A 5.6% | 0F/0W | advance |
| 3 | 5 | submission-pro-no-rare8-black-1403<br>投稿Pro黒8なし #1403 ビートダウン&ロック | 48.7 | 10-10<br>50% | 4-6<br>40% | 6-4<br>60% | 4.5 | S 81.2%<br>P 15.6%<br>A 3.2% | 0F/0W | hold |
| 4 | 18 | submission-pro-no-rare8-white-1340<br>投稿Pro白8なし #1340 アギト育成デッキ | 46.5 | 9-11<br>45% | 5-5<br>50% | 4-6<br>40% | 4.2 | S 82.8%<br>P 13.1%<br>A 4% | 0F/0W | hold |
| 5 | 20 | submission-pro-with-rare8-black-1328<br>投稿Pro黒8あり #1328 HPだけ削ることを考えるデッキ | 36.9 | 7-13<br>35% | 3-7<br>30% | 4-6<br>40% | 4.1 | S 79.2%<br>P 17.1%<br>A 3.7% | 0F/0W | reject |

## Loop Results

| Loop | Deck | Hypothesis | Score | Overall | vs Black | vs White | Avg Turns | Loss Opp HP | Action Usage | Issues | Judgement |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure-normal<br>通常プレッシャー<br>master - / built-in / normal only | 攻撃寄り標準構成で、デコイの受け特技がテンポ損を返せるか見る。 | 53.8 | 11-9<br>55% | 5-5<br>50% | 6-4<br>60% | 16.8 | 4.9 | S 78.5%<br>P 15.9%<br>A 5.6% | 0F/0W | advance |
| 2 | balanced-normal<br>通常バランス<br>master - / built-in / normal only | 基準構成として、白/黒どちらにも極端に寄らない平均値を見る。 | 36.1 | 7-13<br>35% | 3-7<br>30% | 4-6<br>40% | 21.6 | 4.2 | S 79.2%<br>P 16.7%<br>A 4.1% | 0F/0W | reject |
| 3 | black-pressure<br>ブラック検証<br>master - / built-in / normal only | 黒検証寄り構成で、バーサク速度に近い盤面をデコイ側も作れるか見る。 | 54.5 | 11-9<br>55% | 6-4<br>60% | 5-5<br>50% | 19.4 | 5.1 | S 84.7%<br>P 11.8%<br>A 3.5% | 0F/0W | advance |
| 4 | submission-pro-no-rare8-black-1408<br>投稿Pro黒8なし #1408 Proブラックガチ構想<br>master black / Pro 8なし / special allowed | 投稿デッキをデコイ側に当て、既存構築の相性差を探索する。 | 28.8 | 5-15<br>25% | 4-6<br>40% | 1-9<br>10% | 18.5 | 6.2 | S 86.1%<br>P 9.8%<br>A 4.1% | 0F/0W | reject |
| 5 | submission-pro-no-rare8-black-1403<br>投稿Pro黒8なし #1403 ビートダウン&ロック<br>master black / Pro 8なし / normal only | 除去/妨害寄りの構成で、挑発と囮が相手の攻撃順をずらせるか見る。 | 48.7 | 10-10<br>50% | 4-6<br>40% | 6-4<br>60% | 17.3 | 4.5 | S 81.2%<br>P 15.6%<br>A 3.2% | 0F/0W | hold |
| 6 | submission-pro-with-rare8-black-1390<br>投稿Pro黒8あり #1390 結局速攻が一番強い<br>master black / Pro 8あり / normal only | 速攻/直撃寄りのカード密度で、守りながら殴り返すデコイの成立を見る。 | 32 | 6-14<br>30% | 3-7<br>30% | 3-7<br>30% | 12.2 | 6.1 | S 79.4%<br>P 13.8%<br>A 6.9% | 0F/0W | reject |
| 7 | submission-pro-no-rare8-black-1388<br>投稿Pro黒8なし #1388 黒殲滅<br>master black / Pro 8なし / normal only | 除去/妨害寄りの構成で、挑発と囮が相手の攻撃順をずらせるか見る。 | 31.1 | 7-13<br>35% | 4-6<br>40% | 3-7<br>30% | 19.5 | 3.9 | S 82%<br>P 14.1%<br>A 3.8% | 0F/1W | reject |
| 8 | submission-pro-with-rare8-black-1387<br>投稿Pro黒8あり #1387 速攻エルスピナー<br>master black / Pro 8あり / special allowed | 速攻/直撃寄りのカード密度で、守りながら殴り返すデコイの成立を見る。 | 35.6 | 7-13<br>35% | 3-7<br>30% | 4-6<br>40% | 14.8 | 4.8 | S 84.1%<br>P 10.8%<br>A 5.2% | 0F/0W | reject |
| 9 | submission-pro-with-rare8-white-1384<br>投稿Pro白8あり #1384 覚醒と下克上〜Wake Up soul〜<br>master white / Pro 8あり / normal only | 白系の防御/育成構成で、ホワイトとの差別化を保ちながら長期戦を作れるか見る。 | 31.1 | 6-14<br>30% | 3-7<br>30% | 3-7<br>30% | 12.8 | 6.1 | S 73.6%<br>P 8.6%<br>A 17.8% | 0F/0W | reject |
| 10 | submission-pro-with-rare8-black-1382<br>投稿Pro黒8あり #1382 見よ！この速攻を！<br>master black / Pro 8あり / special allowed | 速攻/直撃寄りのカード密度で、守りながら殴り返すデコイの成立を見る。 | 28.7 | 6-14<br>30% | 1-9<br>10% | 5-5<br>50% | 23.5 | 5.0 | S 80.4%<br>P 17%<br>A 2.6% | 0F/0W | reject |
| 11 | submission-pro-no-rare8-white-1377<br>投稿Pro白8なし #1377 結論？<br>master white / Pro 8なし / normal only | 白系の防御/育成構成で、ホワイトとの差別化を保ちながら長期戦を作れるか見る。 | 2.2 | 1-19<br>5% | 0-10<br>0% | 1-9<br>10% | 16.9 | 6.8 | S 77.3%<br>P 16.1%<br>A 6.6% | 0F/1W | reject |
| 12 | submission-pro-no-rare8-black-1375<br>投稿Pro黒8なし #1375 手札切れ狙いの黒殲滅デッキ (8なし)<br>master black / Pro 8なし / normal only | 除去/妨害寄りの構成で、挑発と囮が相手の攻撃順をずらせるか見る。 | 19.5 | 5-15<br>25% | 2-8<br>20% | 3-7<br>30% | 22.8 | 6.5 | S 85.7%<br>P 8.6%<br>A 5.7% | 0F/1W | reject |
| 13 | submission-pro-with-rare8-black-1374<br>投稿Pro黒8あり #1374 手札切れ狙いの黒殲滅デッキ<br>master black / Pro 8あり / normal only | 除去/妨害寄りの構成で、挑発と囮が相手の攻撃順をずらせるか見る。 | 2.9 | 4-16<br>20% | 2-8<br>20% | 2-8<br>20% | 19.7 | 6.4 | S 82.8%<br>P 12.8%<br>A 4.4% | 0F/3W | reject |
| 14 | submission-pro-with-rare8-black-1354<br>投稿Pro黒8あり #1354 星８有状況下黒速攻＆殲滅デッキ<br>master black / Pro 8あり / normal only | 速攻/直撃寄りのカード密度で、守りながら殴り返すデコイの成立を見る。 | 24 | 12-8<br>60% | 6-4<br>60% | 6-4<br>60% | 22.1 | 3.0 | S 86.9%<br>P 11.4%<br>A 1.7% | 0F/5W | hold |
| 15 | submission-pro-no-rare8-black-1353<br>投稿Pro黒8なし #1353 ポリスピナーとアサシン<br>master black / Pro 8なし / normal only | 投稿デッキをデコイ側に当て、既存構築の相性差を探索する。 | 26.7 | 5-15<br>25% | 2-8<br>20% | 3-7<br>30% | 25.7 | 4.1 | S 81.8%<br>P 0%<br>A 18.2% | 0F/0W | reject |
| 16 | submission-pro-no-rare8-white-1347<br>投稿Pro白8なし #1347 極端なぼうえい<br>master white / Pro 8なし / special allowed | 白系の防御/育成構成で、ホワイトとの差別化を保ちながら長期戦を作れるか見る。 | 35.1 | 7-13<br>35% | 3-7<br>30% | 4-6<br>40% | 19.9 | 5.2 | S 83.3%<br>P 12.2%<br>A 4.5% | 0F/0W | reject |
| 17 | submission-pro-with-rare8-white-1346<br>投稿Pro白8あり #1346 よく使ってるデッキ<br>master white / Pro 8あり / special allowed | 白系の防御/育成構成で、ホワイトとの差別化を保ちながら長期戦を作れるか見る。 | 20.7 | 3-17<br>15% | 2-8<br>20% | 1-9<br>10% | 13.5 | 4.6 | S 76.7%<br>P 19.2%<br>A 4% | 0F/0W | reject |
| 18 | submission-pro-no-rare8-white-1340<br>投稿Pro白8なし #1340 アギト育成デッキ<br>master white / Pro 8なし / special allowed | 白系の防御/育成構成で、ホワイトとの差別化を保ちながら長期戦を作れるか見る。 | 46.5 | 9-11<br>45% | 5-5<br>50% | 4-6<br>40% | 21.8 | 4.2 | S 82.8%<br>P 13.1%<br>A 4% | 0F/0W | hold |
| 19 | submission-pro-with-rare8-white-1339<br>投稿Pro白8あり #1339 お気に入り<br>master white / Pro 8あり / special allowed | 白系の防御/育成構成で、ホワイトとの差別化を保ちながら長期戦を作れるか見る。 | 20.9 | 4-16<br>20% | 1-9<br>10% | 3-7<br>30% | 12.6 | 6.3 | S 73.8%<br>P 18.7%<br>A 7.5% | 0F/0W | reject |
| 20 | submission-pro-with-rare8-black-1328<br>投稿Pro黒8あり #1328 HPだけ削ることを考えるデッキ<br>master black / Pro 8あり / special allowed | 速攻/直撃寄りのカード密度で、守りながら殴り返すデコイの成立を見る。 | 36.9 | 7-13<br>35% | 3-7<br>30% | 4-6<br>40% | 17.7 | 4.1 | S 79.2%<br>P 17.1%<br>A 3.7% | 0F/0W | reject |

## Reading

- `Overall` はミラーを除いたデコイ側の勝率。白/黒それぞれを相手にした両座席の合算を見る。
- `Loss Opp HP` はデコイ敗北時の相手マスター残HP平均。低いほど惜敗、高いほど押し切られている。
- この20ループはスクリーニングであり、上位候補は100戦マトリクスで再確認する。
