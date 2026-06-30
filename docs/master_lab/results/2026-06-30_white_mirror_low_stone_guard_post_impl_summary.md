# White Current Deck Improvement Loop

生成: 2026-06-30T04:44:50.465Z
デッキ: `master-lab-white-1377-death-sheep3`

## Summary

判定: **採用候補** / `current_white_mirror_low_stone_guard_off` 比較: 白ミラー低石布石抑制 off。baseline比 score +28.2, overall +50%, vsBlack +0%, vsWhite +50%, issues 0F/0W。

## Screen

試行: 2 games/matchup/direction / 総試合 8

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_white_baseline<br>現行: デスシープ3 / white | 30 | 3-1-0 | 75% | 0% | 0% | 75% | 18.8 | 0F/0W | シールド偏重 |
| 2 | current_white_mirror_low_stone_guard_off<br>比較: 白ミラー低石布石抑制 off | 21 | 2-2-0 | 50% | 0% | 0% | 50% | 25.3 | 0F/0W | シールド偏重 |

## Confirm

試行: 4 games/matchup/direction / 総試合 16

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_white_mirror_low_stone_guard_off<br>比較: 白ミラー低石布石抑制 off | 26 | 5-3-0 | 62.5% | 0% | 0% | 62.5% | 21.5 | 0F/0W | シールド偏重 |
| 2 | current_white_baseline<br>現行: デスシープ3 / white | -2.2 | 1-7-0 | 12.5% | 0% | 0% | 12.5% | 22.6 | 0F/2W | warning 2<br>シールド偏重 |

## Next Steps

- `current_white_mirror_low_stone_guard_off` は採用候補。係数をそのままではなく、対応する局面評価として white profile に反映する。
- 次は `current_white_mirror_low_stone_guard_off` と `current_white_baseline` を games-per-matchup 3-4 で再確認し、seed差を潰す。
- 対黒がまだ不安定。負けseedから、デスシープが前に出た後の盾/ウェイク/攻撃順を重点監査する。
- デッキ側はデスシープ3を固定し、次ループはAIだけを触る。元1377は比較対象として残す。

