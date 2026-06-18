# White AI Loss Audit

生成: 2026-06-18T23:00:09.394Z
候補: pressure_white_baseline, pressure_white_shield_threat_conversion_v1
相手: black_pressure_strong, black_pressure_pressure
試行: 8 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Win Target Quality | Loss Target Quality | Loss LowS By Action | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- |
| pressure_white_baseline | 9-23-0 | 10.5 | 3.1 | 26400, 26401, 26402, 26404, 26405, 26406, 26408, 26409, 26410, 26413, 26414, 26415 | Ex 30%<br>Setup 44.9%<br>LowS 61.4%<br>ShieldConv 42.9% | Ex 23.5%<br>Setup 52.5%<br>LowS 52.2%<br>ShieldConv 44.7% | S 21 SAtk 52.4% SLv 1 SDead 19% S2Low 1/1<br>W 17 WNow 41.2% WExec 17.6% WNext 23.5% WLowNo 4/10 | S 76 SAtk 61.8% SLv 5 SDead 17.1% S2Low 10/11<br>W 86 WNow 26.7% WExec 17.4% WNext 22.1% WLowNo 32/42 | focus:142, summon:58, wake_up:42, attack:41, shield:36, move:16, other:4 | 負け側のウェイク即仕事が低い |
| pressure_white_shield_threat_conversion_v1 | 11-21-0 | 10.1 | 3 | 26432, 26433, 26436, 26437, 26438, 26440, 26441, 26443, 26444, 26445, 26447, 26449 | Ex 28.4%<br>Setup 50.2%<br>LowS 51.9%<br>ShieldConv 54.5% | Ex 25.5%<br>Setup 51.2%<br>LowS 54%<br>ShieldConv 36.1% | S 22 SAtk 77.3% SLv 3 SDead 13.6% S2Low 0/0<br>W 27 WNow 25.9% WExec 14.8% WNext 44.4% WLowNo 9/10 | S 72 SAtk 55.6% SLv 5 SDead 26.4% S2Low 12/12<br>W 52 WNow 23.1% WExec 13.5% WNext 30.8% WLowNo 16/20 | focus:111, summon:60, shield:38, attack:26, wake_up:20, move:18, other:11 | 惜敗多め<br>負け側のウェイク即仕事が低い |

## Reading

- `Win Intent` / `Loss Intent` は候補白側CPU行動だけを集計している。
- `LowS` は布石後に残ストーンが1以下になった割合。
- `ShieldConv` はシールド対象が次の自ターンに攻撃または成果行動へつながった割合。
- `Target Quality` の `SAtk` は盾対象が次自ターンに攻撃した率、`S2Low` は同ターン2枚目以降のシールドで残石1以下になった回数。
- `Target Quality` の `WNow` はウェイクアップ対象が同ターンに攻撃した率、`WLowNo` は低石で起こして同ターン仕事しなかった回数。
- `Loss LowS By Action` は負け試合で低石化した布石の行動種別。ここが偏るほど、次候補の狙いを絞りやすい。
