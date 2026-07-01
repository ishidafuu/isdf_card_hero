# White Current Deck Improvement Loop

生成: 2026-07-01T11:20:20.065Z
デッキ: `master-lab-white-1377-death-sheep3`

## Summary

判定: **保留** / `current_mirror_handoff_quality_strict` 候補: 白ミラー低石ハンドオフ品質 強。baseline比 score +32, overall +25%, vsBlack +0%, vsWhite +25%, issues 1F/0W。

## Screen

試行: 1 games/matchup/direction / 総試合 8

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_mirror_handoff_quality_light<br>候補: 白ミラー低石ハンドオフ品質 軽量 | -26 | 0-0-2 | 50% | 0% | 0% | 50% | 10 | 2F/0W | failure 2<br>シールド偏重 |
| 2 | current_mirror_handoff_quality_mid<br>候補: 白ミラー低石ハンドオフ品質 中 | -26 | 0-0-2 | 50% | 0% | 0% | 50% | 10.5 | 2F/0W | failure 2<br>シールド偏重 |
| 3 | current_mirror_handoff_quality_strict<br>候補: 白ミラー低石ハンドオフ品質 強 | -26 | 0-0-2 | 50% | 0% | 0% | 50% | 10.5 | 2F/0W | failure 2<br>シールド偏重 |
| 4 | current_white_baseline<br>現行: デスシープ3 / white | -26 | 0-0-2 | 50% | 0% | 0% | 50% | 10 | 2F/0W | failure 2 |

## Confirm

試行: 1 games/matchup/direction / 総試合 8

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_mirror_handoff_quality_strict<br>候補: 白ミラー低石ハンドオフ品質 強 | 6 | 1-0-1 | 75% | 0% | 0% | 75% | 11 | 1F/0W | failure 1<br>シールド偏重 |
| 2 | current_mirror_handoff_quality_light<br>候補: 白ミラー低石ハンドオフ品質 軽量 | -26 | 0-0-2 | 50% | 0% | 0% | 50% | 10.5 | 2F/0W | failure 2 |
| 3 | current_mirror_handoff_quality_mid<br>候補: 白ミラー低石ハンドオフ品質 中 | -26 | 0-0-2 | 50% | 0% | 0% | 50% | 11.5 | 2F/0W | failure 2<br>シールド偏重 |
| 4 | current_white_baseline<br>現行: デスシープ3 / white | -26 | 0-0-2 | 50% | 0% | 0% | 50% | 11 | 2F/0W | failure 2<br>シールド偏重 |

## Next Steps

- 今回の確認では即採用せず、ベースラインを維持する。
- 次は `current_mirror_handoff_quality_strict` と `current_white_baseline` を games-per-matchup 3-4 で再確認し、seed差を潰す。
- 対黒がまだ不安定。負けseedから、デスシープが前に出た後の盾/ウェイク/攻撃順を重点監査する。
- デッキ側はデスシープ3を固定し、次ループはAIだけを触る。元1377は比較対象として残す。

