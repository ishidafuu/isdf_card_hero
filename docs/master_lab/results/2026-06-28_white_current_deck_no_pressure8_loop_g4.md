# White Current Deck Improvement Loop

生成: 2026-06-28T04:47:13.273Z
デッキ: `master-lab-white-1377-death-sheep3`

## Summary

判定: **保留** / `current_shield_no_pressure8` 候補: ノープレッシャー盾抑制 8。baseline比 score +6.3, overall +0%, vsBlack +12.5%, vsWhite -12.5%, issues 0F/0W。

## Screen

試行: 4 games/matchup/direction / 総試合 32

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_white_baseline<br>現行: デスシープ3 / white | 48.8 | 10-6-0 | 62.5% | 62.5% | 0% | 62.5% | 14.6 | 0F/1W | warning 1<br>黒耐性あり<br>シールド偏重 |
| 2 | current_shield_no_pressure8<br>候補: ノープレッシャー盾抑制 8 | 21.3 | 5-11-0 | 31.3% | 25% | 0% | 37.5% | 17.8 | 0F/1W | warning 1<br>黒に弱い<br>シールド偏重 |

## Confirm

試行: 4 games/matchup/direction / 総試合 32

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_shield_no_pressure8<br>候補: ノープレッシャー盾抑制 8 | 35.3 | 6-10-0 | 37.5% | 37.5% | 0% | 37.5% | 16.9 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 2 | current_white_baseline<br>現行: デスシープ3 / white | 29 | 6-10-0 | 37.5% | 25% | 0% | 50% | 19.4 | 0F/0W | 黒に弱い<br>シールド偏重 |

## Next Steps

- 今回の確認では即採用せず、ベースラインを維持する。
- 次は `current_shield_no_pressure8` と `current_white_baseline` を games-per-matchup 3-4 で再確認し、seed差を潰す。
- 対黒がまだ不安定。負けseedから、デスシープが前に出た後の盾/ウェイク/攻撃順を重点監査する。
- デッキ側はデスシープ3を固定し、次ループはAIだけを触る。元1377は比較対象として残す。

