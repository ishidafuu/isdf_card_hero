# White AI Loss Audit

生成: 2026-06-18T23:25:38.658Z
候補: pressure_white_baseline, pressure_white_second_shield_guard_light_v1, pressure_white_second_shield_guard_plus12_v1
相手: black_pressure_strong, black_pressure_pressure
試行: 8 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Win Target Quality | Loss Target Quality | Loss LowS By Action | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- |
| pressure_white_baseline | 9-23-0 | 9.9 | 3.2 | 27200, 27201, 27202, 27203, 27205, 27206, 27207, 27208, 27209, 27210, 27212, 27213 | Ex 26.9%<br>Setup 51.1%<br>LowS 57.7%<br>ShieldConv 25.9% | Ex 25.5%<br>Setup 51.5%<br>LowS 56.1%<br>ShieldConv 45.2% | S 27 SAtk 48.1% SLv 2 SDead 22.2% S2Low 3/3<br>W 27 WNow 25.9% WExec 18.5% WNext 29.6% WLowNo 12/15 | S 84 SAtk 57.1% SLv 3 SDead 16.7% S2Low 13/15<br>W 63 WNow 19% WExec 12.7% WNext 27% WLowNo 22/30 | focus:121, summon:73, shield:41, wake_up:30, attack:28, move:22, other:7 | 負け側のウェイク即仕事が低い |
| pressure_white_second_shield_guard_light_v1 | 16-16-0 | 10.1 | 3.7 | 27234, 27240, 27243, 27247, 27248, 27250, 27251, 27254, 27255, 27256, 27257, 27258 | Ex 27.9%<br>Setup 49.8%<br>LowS 58.4%<br>ShieldConv 47.5% | Ex 23%<br>Setup 53.2%<br>LowS 50.9%<br>ShieldConv 41.7% | S 40 SAtk 62.5% SLv 2 SDead 22.5% S2Low 8/10<br>W 42 WNow 33.3% WExec 31% WNext 26.2% WLowNo 15/19 | S 72 SAtk 55.6% SLv 4 SDead 13.9% S2Low 8/11<br>W 55 WNow 25.5% WExec 5.5% WNext 27.3% WLowNo 18/25 | focus:89, summon:46, shield:31, wake_up:25, attack:18, move:12, other:5 | 負け側のウェイク即仕事が低い |
| pressure_white_second_shield_guard_plus12_v1 | 9-23-0 | 9.8 | 4.2 | 27264, 27267, 27268, 27269, 27271, 27272, 27274, 27275, 27276, 27277, 27278, 27279 | Ex 28.2%<br>Setup 51%<br>LowS 51.8%<br>ShieldConv 40% | Ex 24.2%<br>Setup 53.9%<br>LowS 50.5%<br>ShieldConv 33.8% | S 25 SAtk 48% SLv 0 SDead 28% S2Low 1/1<br>W 27 WNow 29.6% WExec 25.9% WNext 22.2% WLowNo 9/12 | S 68 SAtk 52.9% SLv 11 SDead 8.8% S2Low 9/10<br>W 74 WNow 27% WExec 18.9% WNext 23% WLowNo 20/30 | focus:110, summon:68, shield:35, wake_up:30, attack:20, move:15, other:8 | 負け側のウェイク即仕事が低い |

## Reading

- `Win Intent` / `Loss Intent` は候補白側CPU行動だけを集計している。
- `LowS` は布石後に残ストーンが1以下になった割合。
- `ShieldConv` はシールド対象が次の自ターンに攻撃または成果行動へつながった割合。
- `Target Quality` の `SAtk` は盾対象が次自ターンに攻撃した率、`S2Low` は同ターン2枚目以降のシールドで残石1以下になった回数。
- `Target Quality` の `WNow` はウェイクアップ対象が同ターンに攻撃した率、`WLowNo` は低石で起こして同ターン仕事しなかった回数。
- `Loss LowS By Action` は負け試合で低石化した布石の行動種別。ここが偏るほど、次候補の狙いを絞りやすい。
