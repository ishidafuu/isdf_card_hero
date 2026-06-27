# White Current Deck Improvement Loop

生成: 2026-06-27T16:59:17.943Z
デッキ: `master-lab-white-1377-death-sheep3`

## Summary

判定: **保留** / `current_white_baseline` 現行: デスシープ3 / white。確認ループで現行baselineが首位または比較baselineがないため、AI本体への反映は保留。

## Screen

試行: 1 games/matchup/direction / 総試合 96

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_black_front_threat16<br>候補: 黒前衛脅威 16 | 71.5 | 6-2-0 | 75% | 75% | 50% | 100% | 17 | 0F/0W | 黒耐性あり<br>シールド偏重 |
| 2 | current_front_work_light<br>候補: 既存前衛仕事 48 | 60.5 | 5-3-0 | 62.5% | 50% | 100% | 50% | 13.5 | 0F/0W | 黒耐性あり |
| 3 | current_threat_left_low_stone_guard<br>候補: 脅威残り低石布石抑制 | 60.5 | 5-3-0 | 62.5% | 50% | 100% | 50% | 15.9 | 0F/0W | 黒耐性あり<br>シールド偏重 |
| 4 | current_wake_safe_work8<br>候補: 安全ウェイク仕事 8 | 60 | 6-2-0 | 75% | 50% | 100% | 100% | 17.6 | 0F/1W | warning 1<br>黒耐性あり<br>シールド偏重 |
| 5 | current_front_work_strong<br>候補: 既存前衛仕事 96 | 50 | 5-3-0 | 62.5% | 25% | 100% | 100% | 19 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 6 | current_strong_profile<br>比較: デスシープ3 / strong | 44.5 | 4-4-0 | 50% | 25% | 100% | 50% | 12.8 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 7 | current_threat_source_attack4<br>候補: 脅威源攻撃 4 | 44.5 | 4-4-0 | 50% | 25% | 100% | 50% | 20 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 8 | current_threat_source_attack8<br>候補: 脅威源攻撃 8 | 36 | 3-5-0 | 37.5% | 25% | 100% | 0% | 15 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 9 | current_white_baseline<br>現行: デスシープ3 / white | 28.5 | 2-6-0 | 25% | 25% | 50% | 0% | 18.8 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 10 | current_threat_then_setup<br>候補: 脅威処理後布石 | 28.5 | 3-5-0 | 37.5% | 0% | 100% | 50% | 13.5 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 11 | current_wake_safe_work4<br>候補: 安全ウェイク仕事 4 | 28.5 | 3-5-0 | 37.5% | 0% | 100% | 50% | 18.8 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 12 | current_shield_wake_quality<br>候補: 盾/起動品質 | 15.5 | 1-7-0 | 12.5% | 0% | 50% | 0% | 20.3 | 0F/0W | 黒に弱い<br>シールド偏重 |

## Confirm

試行: 1 games/matchup/direction / 総試合 16

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_white_baseline<br>現行: デスシープ3 / white | 62.7 | 5-3-0 | 62.5% | 50% | 100% | 50% | 17.4 | 0F/0W | 黒耐性あり<br>シールド偏重 |
| 2 | current_black_front_threat16<br>候補: 黒前衛脅威 16 | 38 | 3-5-0 | 37.5% | 25% | 100% | 0% | 21.1 | 0F/0W | 黒に弱い<br>シールド偏重<br>盾の成果化不足 |

## Next Steps

- 今回の確認では即採用せず、ベースラインを維持する。
- 対黒がまだ不安定。負けseedから、デスシープが前に出た後の盾/ウェイク/攻撃順を重点監査する。
- デッキ側はデスシープ3を固定し、次ループはAIだけを触る。元1377は比較対象として残す。

