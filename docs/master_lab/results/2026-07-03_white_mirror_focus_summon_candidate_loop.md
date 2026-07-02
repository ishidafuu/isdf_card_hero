# White Current Deck Improvement Loop

生成: 2026-07-02T15:44:03.387Z
デッキ: `master-lab-white-1377-death-sheep3`

## Summary

判定: **保留** / `current_mirror_blocked_backline_no_work120` 候補: 白ミラー詰まり後列仕事なし 120。baseline比 score +16, overall -25%, vsBlack +0%, vsWhite -25%, issues 0F/0W。

## Screen

試行: 1 games/matchup/direction / 総試合 10

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_mirror_blocked_backline_no_work120<br>候補: 白ミラー詰まり後列仕事なし 120 | 22 | 1-1-0 | 50% | 0% | 0% | 50% | 20.5 | 0F/0W | シールド偏重 |
| 2 | current_white_baseline<br>現行: デスシープ3 / white | 6 | 1-0-1 | 75% | 0% | 0% | 75% | 16.5 | 1F/0W | failure 1<br>シールド偏重 |
| 3 | current_mirror_blocked_backline_no_work80<br>候補: 白ミラー詰まり後列仕事なし 80 | -10 | 0-1-1 | 25% | 0% | 0% | 25% | 15.5 | 1F/0W | failure 1<br>シールド偏重 |
| 4 | current_mirror_focus_backline_quality<br>候補: 白ミラーfocus+後列品質 | -10 | 0-1-1 | 25% | 0% | 0% | 25% | 18 | 1F/0W | failure 1<br>シールド偏重 |
| 5 | current_mirror_focus_quality_mid<br>候補: 白ミラーfocus品質 中 | -10 | 0-1-1 | 25% | 0% | 0% | 25% | 17 | 1F/0W | failure 1<br>シールド偏重 |

## Confirm

試行: 1 games/matchup/direction / 総試合 4

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_mirror_blocked_backline_no_work120<br>候補: 白ミラー詰まり後列仕事なし 120 | 22 | 1-1-0 | 50% | 0% | 0% | 50% | 16 | 0F/0W | シールド偏重 |
| 2 | current_white_baseline<br>現行: デスシープ3 / white | 6 | 1-0-1 | 75% | 0% | 0% | 75% | 17.5 | 1F/0W | failure 1<br>シールド偏重 |

## Next Steps

- 今回の確認では即採用せず、ベースラインを維持する。
- 次は `current_mirror_blocked_backline_no_work120` と `current_white_baseline` を games-per-matchup 3-4 で再確認し、seed差を潰す。
- 対黒がまだ不安定。負けseedから、デスシープが前に出た後の盾/ウェイク/攻撃順を重点監査する。
- デッキ側はデスシープ3を固定し、次ループはAIだけを触る。元1377は比較対象として残す。

