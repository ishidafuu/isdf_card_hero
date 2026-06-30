# White Current Deck Improvement Loop

生成: 2026-06-30T11:15:51.317Z
デッキ: `master-lab-white-1377-death-sheep3`

## Summary

判定: **保留** / `current_threat_then_setup` 候補: 脅威処理後布石。baseline比 score +6, overall +18.8%, vsBlack +0%, vsWhite +18.8%, issues 0F/0W。

## Screen

試行: 1 games/matchup/direction / 総試合 4

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_threat_then_setup<br>候補: 脅威処理後布石 | 22 | 1-1-0 | 50% | 0% | 0% | 50% | 21 | 0F/0W | シールド偏重 |
| 2 | current_white_baseline<br>現行: デスシープ3 / white | 21.7 | 1-1-0 | 50% | 0% | 0% | 50% | 23 | 0F/0W | シールド偏重 |

## Confirm

試行: 8 games/matchup/direction / 総試合 32

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_threat_then_setup<br>候補: 脅威処理後布石 | 27.6 | 11-5-0 | 68.8% | 0% | 0% | 68.8% | 23.4 | 0F/0W | シールド偏重 |
| 2 | current_white_baseline<br>現行: デスシープ3 / white | 21.6 | 8-8-0 | 50% | 0% | 0% | 50% | 23.2 | 0F/0W | シールド偏重 |

## Next Steps

- 今回の確認では即採用せず、ベースラインを維持する。
- 次は `current_threat_then_setup` と `current_white_baseline` を games-per-matchup 3-4 で再確認し、seed差を潰す。
- 対黒がまだ不安定。負けseedから、デスシープが前に出た後の盾/ウェイク/攻撃順を重点監査する。
- デッキ側はデスシープ3を固定し、次ループはAIだけを触る。元1377は比較対象として残す。

