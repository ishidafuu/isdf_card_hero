# White AI Loss Audit

生成: 2026-06-19T01:37:37.878Z
候補: pressure_white_baseline, pressure_white_low_stone_focus_light_v1, pressure_white_focus_wake_quality_v1
相手: black_pressure_strong, black_pressure_pressure
試行: 8 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Win Target Quality | Loss Target Quality | Loss LowS By Action | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- |
| pressure_white_baseline | 7-25-0 | 10.6 | 3.1 | 28001, 28002, 28004, 28005, 28008, 28009, 28010, 28012, 28013, 28014, 28015, 28016 | Ex 29.5%<br>Setup 50%<br>LowS 52.6%<br>ShieldConv 40% | Ex 24.9%<br>Setup 51.4%<br>LowS 51.4%<br>ShieldConv 39.8% | S 20 SAtk 70% SLv 0 SDead 20% S2Low 1/1 SHit 3 SMulti 0<br>W 20 WNow 30% WExec 25% WNext 35% WDead 20% WLowNo 6/10<br>F 48 FLow 36 FNext 60.4% FExec 52.1% FLv 2 FDead 14.6% FLowNo 16/36 | S 88 SAtk 50% SLv 6 SDead 22.7% S2Low 13/15 SHit 23 SMulti 3<br>W 75 WNow 33.3% WExec 18.7% WNext 34.7% WDead 22.7% WLowNo 21/31<br>F 165 FLow 136 FNext 53.3% FExec 35.2% FLv 12 FDead 6.7% FLowNo 69/136 | focus:136, summon:78, shield:36, wake_up:31, attack:25, move:23, other:10 | - |
| pressure_white_low_stone_focus_light_v1 | 13-19-0 | 10.2 | 3.3 | 28032, 28033, 28034, 28036, 28039, 28043, 28044, 28045, 28049, 28050, 28052, 28053 | Ex 32.5%<br>Setup 44.6%<br>LowS 60.5%<br>ShieldConv 64.3% | Ex 23.6%<br>Setup 53.5%<br>LowS 53.2%<br>ShieldConv 34.8% | S 14 SAtk 78.6% SLv 0 SDead 7.1% S2Low 1/1 SHit 0 SMulti 0<br>W 24 WNow 37.5% WExec 25% WNext 20.8% WDead 12.5% WLowNo 9/14<br>F 66 FLow 56 FNext 51.5% FExec 39.4% FLv 7 FDead 7.6% FLowNo 23/56 | S 66 SAtk 48.5% SLv 2 SDead 15.2% S2Low 7/7 SHit 12 SMulti 1<br>W 75 WNow 26.7% WExec 17.3% WNext 26.7% WDead 17.3% WLowNo 28/34<br>F 132 FLow 112 FNext 57.6% FExec 40.2% FLv 6 FDead 6.1% FLowNo 47/112 | focus:112, summon:59, wake_up:34, shield:32, attack:31, move:15, other:7 | 負け側のウェイク即仕事が低い |
| pressure_white_focus_wake_quality_v1 | 13-19-0 | 10.6 | 3.5 | 28064, 28065, 28066, 28067, 28068, 28069, 28070, 28071, 28072, 28073, 28076, 28077 | Ex 27.2%<br>Setup 50.1%<br>LowS 53.4%<br>ShieldConv 35% | Ex 23.8%<br>Setup 53.7%<br>LowS 52.1%<br>ShieldConv 36.2% | S 40 SAtk 55% SLv 5 SDead 17.5% S2Low 5/6 SHit 2 SMulti 0<br>W 32 WNow 37.5% WExec 25% WNext 15.6% WDead 12.5% WLowNo 10/14<br>F 90 FLow 69 FNext 47.8% FExec 36.7% FLv 12 FDead 3.3% FLowNo 35/69 | S 58 SAtk 43.1% SLv 2 SDead 15.5% S2Low 6/8 SHit 14 SMulti 0<br>W 50 WNow 26% WExec 16% WNext 22% WDead 18% WLowNo 22/27<br>F 153 FLow 124 FNext 47.1% FExec 37.3% FLv 10 FDead 8.5% FLowNo 68/124 | focus:124, summon:57, wake_up:27, shield:19, move:18, attack:8, other:6 | 負け側のウェイク即仕事が低い |

## Reading

- `Win Intent` / `Loss Intent` は候補白側CPU行動だけを集計している。
- `LowS` は布石後に残ストーンが1以下になった割合。
- `ShieldConv` はシールド対象が次の自ターンに攻撃または成果行動へつながった割合。
- `Target Quality` の `SAtk` は盾対象が次自ターンに攻撃した率、`S2Low` は同ターン2枚目以降のシールドで残石1以下になった回数。
- `Target Quality` の `SHit` は盾対象が次自ターンまでに受けた攻撃回数、`SMulti` は2回以上攻撃された盾対象数。
- `Target Quality` の `WNow` はウェイクアップ対象が同ターンに攻撃した率、`WDead` は次自ターン前に倒された率、`WLowNo` は低石で起こして同ターン仕事しなかった回数。
- `Target Quality` の `FNext` はfocus対象が次自ターンに攻撃した率、`FLowNo` は低石focus後に次自ターン仕事へ変換されなかった回数。
- `Loss LowS By Action` は負け試合で低石化した布石の行動種別。ここが偏るほど、次候補の狙いを絞りやすい。
