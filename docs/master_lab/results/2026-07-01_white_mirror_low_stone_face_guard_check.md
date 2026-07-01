# White Current Deck Improvement Loop

生成: 2026-07-01T11:59:11.848Z
デッキ: `master-lab-white-1377-death-sheep3`

## Summary

判定: **保留** / `current_mirror_low_stone_face_guard` 候補: 白ミラー低石非リーサル顔抑制。baseline比 score -16, overall -50%, vsBlack +0%, vsWhite -50%, issues 1F/0W。

## Screen

試行: 1 games/matchup/direction / 総試合 4

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_mirror_low_stone_face_guard<br>候補: 白ミラー低石非リーサル顔抑制 | 6 | 1-0-1 | 75% | 0% | 0% | 75% | 16 | 1F/0W | failure 1 |
| 2 | current_white_baseline<br>現行: デスシープ3 / white | -26 | 0-0-2 | 50% | 0% | 0% | 50% | 15 | 2F/0W | failure 2 |

## Confirm

試行: 1 games/matchup/direction / 総試合 4

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_white_baseline<br>現行: デスシープ3 / white | 6 | 1-0-1 | 75% | 0% | 0% | 75% | 14.5 | 1F/0W | failure 1<br>シールド偏重 |
| 2 | current_mirror_low_stone_face_guard<br>候補: 白ミラー低石非リーサル顔抑制 | -10 | 0-1-1 | 25% | 0% | 0% | 25% | 15.5 | 1F/0W | failure 1<br>シールド偏重 |

## Next Steps

- 今回の確認では即採用せず、ベースラインを維持する。
- 次は `current_mirror_low_stone_face_guard` と `current_white_baseline` を games-per-matchup 3-4 で再確認し、seed差を潰す。
- 対黒がまだ不安定。負けseedから、デスシープが前に出た後の盾/ウェイク/攻撃順を重点監査する。
- デッキ側はデスシープ3を固定し、次ループはAIだけを触る。元1377は比較対象として残す。

