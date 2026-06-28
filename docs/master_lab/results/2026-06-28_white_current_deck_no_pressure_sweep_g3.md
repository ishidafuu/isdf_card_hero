# White Current Deck Improvement Loop

生成: 2026-06-28T05:38:02.566Z
デッキ: `master-lab-white-1377-death-sheep3`

## Summary

判定: **保留** / `current_shield_no_pressure4_wake4` 候補: ノープレッシャー盾抑制 4 / 安全ウェイク 4。baseline比 score -2.6, overall -8.3%, vsBlack -16.7%, vsWhite +0%, issues 0F/0W。

## Screen

試行: 3 games/matchup/direction / 総試合 60

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_shield_no_pressure8_wake4<br>候補: ノープレッシャー盾抑制 8 / 安全ウェイク 4 | 45 | 6-6-0 | 50% | 50% | 0% | 50% | 17.3 | 0F/0W | 黒耐性あり<br>シールド偏重 |
| 2 | current_shield_no_pressure4_wake4<br>候補: ノープレッシャー盾抑制 4 / 安全ウェイク 4 | 43.3 | 6-6-0 | 50% | 66.7% | 0% | 33.3% | 18.1 | 0F/1W | warning 1<br>黒耐性あり<br>シールド偏重 |
| 3 | current_shield_no_pressure8<br>候補: ノープレッシャー盾抑制 8 | 32 | 3-9-0 | 25% | 50% | 0% | 0% | 19.6 | 0F/0W | 黒耐性あり<br>シールド偏重 |
| 4 | current_shield_no_pressure4<br>候補: ノープレッシャー盾抑制 4 | 27.7 | 3-9-0 | 25% | 33.3% | 0% | 16.7% | 18.2 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 5 | current_white_baseline<br>現行: デスシープ3 / white | 26 | 4-8-0 | 33.3% | 33.3% | 0% | 33.3% | 16.3 | 0F/1W | warning 1<br>黒に弱い<br>シールド偏重 |

## Confirm

試行: 3 games/matchup/direction / 総試合 36

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_white_baseline<br>現行: デスシープ3 / white | 43.3 | 6-6-0 | 50% | 66.7% | 0% | 33.3% | 15.7 | 0F/1W | warning 1<br>黒耐性あり<br>シールド偏重 |
| 2 | current_shield_no_pressure4_wake4<br>候補: ノープレッシャー盾抑制 4 / 安全ウェイク 4 | 40.7 | 5-7-0 | 41.7% | 50% | 0% | 33.3% | 15.9 | 0F/0W | 黒耐性あり<br>シールド偏重 |
| 3 | current_shield_no_pressure8_wake4<br>候補: ノープレッシャー盾抑制 8 / 安全ウェイク 4 | 34.3 | 5-7-0 | 41.7% | 33.3% | 0% | 50% | 17.1 | 0F/0W | 黒に弱い<br>シールド偏重 |

## Next Steps

- 今回の確認では即採用せず、ベースラインを維持する。
- 次は `current_shield_no_pressure4_wake4` と `current_white_baseline` を games-per-matchup 3-4 で再確認し、seed差を潰す。
- 対黒がまだ不安定。負けseedから、デスシープが前に出た後の盾/ウェイク/攻撃順を重点監査する。
- デッキ側はデスシープ3を固定し、次ループはAIだけを触る。元1377は比較対象として残す。

