# White Current Deck Improvement Loop

生成: 2026-06-30T11:39:07.291Z
デッキ: `master-lab-white-1377-death-sheep3`

## Summary

判定: **保留** / `current_white_mirror_threat_then_setup_off` 比較: 白ミラー脅威処理後布石 off。baseline比 score -6.5, overall -25%, vsBlack +0%, vsWhite -25%, issues 0F/0W。

## Screen

試行: 1 games/matchup/direction / 総試合 4

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_white_mirror_threat_then_setup_off<br>比較: 白ミラー脅威処理後布石 off | 38 | 2-0-0 | 100% | 0% | 0% | 100% | 15.5 | 0F/0W | シールド偏重 |
| 2 | current_white_baseline<br>現行: デスシープ3 / white | 22 | 1-1-0 | 50% | 0% | 0% | 50% | 20 | 0F/0W | シールド偏重 |

## Confirm

試行: 4 games/matchup/direction / 総試合 16

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_white_baseline<br>現行: デスシープ3 / white | 24.4 | 5-3-0 | 62.5% | 0% | 0% | 62.5% | 27.5 | 0F/0W | シールド偏重 |
| 2 | current_white_mirror_threat_then_setup_off<br>比較: 白ミラー脅威処理後布石 off | 17.9 | 3-5-0 | 37.5% | 0% | 0% | 37.5% | 22.4 | 0F/0W | シールド偏重 |

## Next Steps

- 今回の確認では即採用せず、ベースラインを維持する。
- 次は `current_white_mirror_threat_then_setup_off` と `current_white_baseline` を games-per-matchup 3-4 で再確認し、seed差を潰す。
- 対黒がまだ不安定。負けseedから、デスシープが前に出た後の盾/ウェイク/攻撃順を重点監査する。
- デッキ側はデスシープ3を固定し、次ループはAIだけを触る。元1377は比較対象として残す。

