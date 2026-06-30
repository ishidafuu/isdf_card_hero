# White Current Deck Improvement Loop

生成: 2026-06-30T04:19:32.649Z
デッキ: `master-lab-white-1377-death-sheep3`

## Summary

判定: **採用候補** / `current_threat_left_low_stone_guard` 候補: 脅威残り低石布石抑制。baseline比 score +8, overall +25%, vsBlack +0%, vsWhite +25%, issues 0F/0W。

## Screen

試行: 3 games/matchup/direction / 総試合 12

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_white_baseline<br>現行: デスシープ3 / white | 27 | 4-2-0 | 66.7% | 0% | 0% | 66.7% | 23.3 | 0F/0W | シールド偏重 |
| 2 | current_threat_left_low_stone_guard<br>候補: 脅威残り低石布石抑制 | 16.6 | 2-4-0 | 33.3% | 0% | 0% | 33.3% | 22.3 | 0F/0W | シールド偏重 |

## Confirm

試行: 6 games/matchup/direction / 総試合 24

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_threat_left_low_stone_guard<br>候補: 脅威残り低石布石抑制 | 27.3 | 8-4-0 | 66.7% | 0% | 0% | 66.7% | 20 | 0F/0W | シールド偏重 |
| 2 | current_white_baseline<br>現行: デスシープ3 / white | 19.3 | 5-7-0 | 41.7% | 0% | 0% | 41.7% | 22.1 | 0F/0W | シールド偏重 |

## Next Steps

- `current_threat_left_low_stone_guard` は採用候補。係数をそのままではなく、対応する局面評価として white profile に反映する。
- 次は `current_threat_left_low_stone_guard` と `current_white_baseline` を games-per-matchup 3-4 で再確認し、seed差を潰す。
- 対黒がまだ不安定。負けseedから、デスシープが前に出た後の盾/ウェイク/攻撃順を重点監査する。
- デッキ側はデスシープ3を固定し、次ループはAIだけを触る。元1377は比較対象として残す。

