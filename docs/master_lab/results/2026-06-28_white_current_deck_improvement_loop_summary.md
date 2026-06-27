# White Current Deck Improvement Loop

生成: 2026-06-27T16:11:50.323Z
デッキ: `master-lab-white-1377-death-sheep3`

## Summary

判定: **採用候補** / `current_threat_source_attack8` 候補: 脅威源攻撃 8。baseline比 score +17.1, overall +18.7%, vsBlack +12.5%, vsWhite +50%, issues 0F/0W。

## Screen

試行: 1 games/matchup/direction / 総試合 96

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_threat_source_attack8<br>候補: 脅威源攻撃 8 | 53 | 4-4-0 | 50% | 50% | 50% | 50% | 17.1 | 0F/0W | 黒耐性あり<br>シールド偏重 |
| 2 | current_front_work_light<br>候補: 既存前衛仕事 48 | 50 | 5-3-0 | 62.5% | 25% | 100% | 100% | 13.9 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 3 | current_white_baseline<br>現行: デスシープ3 / white | 49 | 4-4-0 | 50% | 50% | 100% | 0% | 15 | 0F/0W | 黒耐性あり<br>シールド偏重 |
| 4 | current_strong_profile<br>比較: デスシープ3 / strong | 44.5 | 4-4-0 | 50% | 25% | 100% | 50% | 15.9 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 5 | current_shield_wake_quality<br>候補: 盾/起動品質 | 41.5 | 3-5-0 | 37.5% | 50% | 50% | 0% | 17.8 | 0F/0W | 黒耐性あり<br>シールド偏重 |
| 6 | current_threat_source_attack4<br>候補: 脅威源攻撃 4 | 37 | 3-5-0 | 37.5% | 25% | 50% | 50% | 15 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 7 | current_threat_then_setup<br>候補: 脅威処理後布石 | 37 | 3-5-0 | 37.5% | 25% | 50% | 50% | 17.4 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 8 | current_wake_safe_work8<br>候補: 安全ウェイク仕事 8 | 37 | 3-5-0 | 37.5% | 25% | 50% | 50% | 16.3 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 9 | current_front_work_strong<br>候補: 既存前衛仕事 96 | 34 | 4-4-0 | 50% | 0% | 100% | 100% | 16.4 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 10 | current_black_front_threat16<br>候補: 黒前衛脅威 16 | 30 | 3-5-0 | 37.5% | 25% | 100% | 0% | 17.3 | 0F/1W | warning 1<br>黒に弱い<br>シールド偏重 |
| 11 | current_wake_safe_work4<br>候補: 安全ウェイク仕事 4 | 28.5 | 2-6-0 | 25% | 25% | 50% | 0% | 17.5 | 0F/0W | 黒に弱い<br>シールド偏重 |
| 12 | current_threat_left_low_stone_guard<br>候補: 脅威残り低石布石抑制 | 21 | 2-6-0 | 25% | 0% | 50% | 50% | 16.9 | 0F/0W | 黒に弱い<br>シールド偏重 |

## Confirm

試行: 2 games/matchup/direction / 総試合 80

| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | current_threat_source_attack8<br>候補: 脅威源攻撃 8 | 73.4 | 12-4-0 | 75% | 62.5% | 100% | 75% | 15.4 | 0F/0W | 黒耐性あり<br>シールド偏重<br>盾の成果化不足 |
| 2 | current_white_baseline<br>現行: デスシープ3 / white | 56.3 | 9-7-0 | 56.3% | 50% | 100% | 25% | 17.6 | 0F/0W | 黒耐性あり<br>シールド偏重<br>盾の成果化不足 |
| 3 | current_strong_profile<br>比較: デスシープ3 / strong | 55 | 8-8-0 | 50% | 62.5% | 50% | 25% | 11.9 | 0F/0W | 黒耐性あり<br>シールド偏重<br>布石後の石枯渇 |
| 4 | current_front_work_light<br>候補: 既存前衛仕事 48 | 45.3 | 8-8-0 | 50% | 37.5% | 75% | 50% | 16.3 | 0F/1W | warning 1<br>黒に弱い<br>シールド偏重<br>盾の成果化不足 |
| 5 | current_shield_wake_quality<br>候補: 盾/起動品質 | 34.8 | 6-10-0 | 37.5% | 12.5% | 100% | 25% | 18.8 | 0F/0W | 黒に弱い<br>シールド偏重<br>盾の成果化不足 |

## Next Steps

- `current_threat_source_attack8` は採用候補。係数をそのままではなく、対応する局面評価として white profile に反映する。
- 次は `current_threat_source_attack8` と `current_white_baseline` を games-per-matchup 3-4 で再確認し、seed差を潰す。
- 対黒がまだ不安定。負けseedから、デスシープが前に出た後の盾/ウェイク/攻撃順を重点監査する。
- デッキ側はデスシープ3を固定し、次ループはAIだけを触る。元1377は比較対象として残す。

## Adoption Applied

`current_threat_source_attack8` は、既存の `whiteThreatSourceAttackBonus` を使った「敵の次ターン打点源を削る攻撃」の局面評価だった。

確認フェーズで baseline 比 score +17.1、overall +18.7pt、vsBlack +12.5pt、vsWhite +50.0pt、0F/0W だったため、`whiteThreatSourceAttackBonus: 8` を `WHITE_AI_BASE_TUNING` へ反映した。

ただし、シールド偏重と盾の成果化不足は残っている。次ループは係数をさらに盛るのではなく、デスシープが前に出た後の `attack first / wake first / shield last` の順序監査を優先する。
