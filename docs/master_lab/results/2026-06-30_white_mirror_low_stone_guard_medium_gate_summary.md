# White Current Deck Improvement Loop

生成: 2026-06-30T05:43:00.716Z
デッキ: `master-lab-white-1377-death-sheep3`

## Summary

判定: **保留** / `current_white_mirror_low_stone_guard_off` 比較: 白ミラー低石布石抑制 off。baseline比 score -1.3, overall -6.3%, vsBlack +0%, vsWhite -6.3%, issues 0F/0W。

## Screen

試行: 1 games/matchup/direction / 総試合 4

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_white_mirror_low_stone_guard_off<br>比較: 白ミラー低石布石抑制 off | 6 | 0-2-0 | 0% | 0% | 0% | 0% | 17.5 | 0F/0W | シールド偏重 |
| 2 | current_white_baseline<br>現行: デスシープ3 / white | 5.3 | 0-2-0 | 0% | 0% | 0% | 0% | 24.5 | 0F/0W | シールド偏重 |

## Confirm

試行: 8 games/matchup/direction / 総試合 32

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_white_baseline<br>現行: デスシープ3 / white | 19.3 | 7-9-0 | 43.8% | 0% | 0% | 43.8% | 24.4 | 0F/0W | シールド偏重 |
| 2 | current_white_mirror_low_stone_guard_off<br>比較: 白ミラー低石布石抑制 off | 18 | 6-10-0 | 37.5% | 0% | 0% | 37.5% | 21.7 | 0F/0W | シールド偏重 |

## Next Steps

- 今回の確認では即採用せず、ベースラインを維持する。
- 次は `current_white_mirror_low_stone_guard_off` と `current_white_baseline` を games-per-matchup 3-4 で再確認し、seed差を潰す。
- 対黒がまだ不安定。負けseedから、デスシープが前に出た後の盾/ウェイク/攻撃順を重点監査する。
- デッキ側はデスシープ3を固定し、次ループはAIだけを触る。元1377は比較対象として残す。

