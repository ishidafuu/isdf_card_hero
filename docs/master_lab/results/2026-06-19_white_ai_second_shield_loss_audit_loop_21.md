# White AI Loss Audit

生成: 2026-06-18T23:04:02.210Z
候補: pressure_white_baseline, pressure_white_second_shield_guard_v1
相手: black_pressure_strong, black_pressure_pressure
試行: 4 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Win Target Quality | Loss Target Quality | Loss LowS By Action | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- |
| pressure_white_baseline | 4-12-0 | 9.6 | 3.7 | 26600, 26601, 26602, 26604, 26605, 26606, 26607, 26608, 26610, 26611, 26612, 26613 | Ex 29.3%<br>Setup 48.7%<br>LowS 59.1%<br>ShieldConv 30% | Ex 26.9%<br>Setup 50.9%<br>LowS 56.1%<br>ShieldConv 16% | S 10 SAtk 40% SLv 0 SDead 30% S2Low 0/0<br>W 11 WNow 27.3% WExec 18.2% WNext 27.3% WLowNo 5/6 | S 25 SAtk 32% SLv 2 SDead 28% S2Low 3/3<br>W 30 WNow 20% WExec 10% WNext 30% WLowNo 14/16 | focus:59, summon:34, wake_up:16, shield:13, move:11, attack:10, other:8 | 負け側の盾成果化が低い<br>負け側のウェイク即仕事が低い |
| pressure_white_second_shield_guard_v1 | 6-10-0 | 10.1 | 3 | 26618, 26619, 26620, 26621, 26622, 26623, 26624, 26625, 26628, 26629 | Ex 28.8%<br>Setup 47.9%<br>LowS 56.4%<br>ShieldConv 53.3% | Ex 26.9%<br>Setup 51.1%<br>LowS 48.7%<br>ShieldConv 25% | S 15 SAtk 60% SLv 0 SDead 20% S2Low 1/1<br>W 16 WNow 25% WExec 18.8% WNext 31.3% WLowNo 7/7 | S 28 SAtk 57.1% SLv 3 SDead 25% S2Low 4/4<br>W 24 WNow 29.2% WExec 20.8% WNext 33.3% WLowNo 9/10 | focus:42, summon:29, shield:11, wake_up:10, move:9, attack:7, other:5 | 惜敗多め<br>負け側の盾成果化が低い<br>負け側のウェイク即仕事が低い |

## Reading

- `Win Intent` / `Loss Intent` は候補白側CPU行動だけを集計している。
- `LowS` は布石後に残ストーンが1以下になった割合。
- `ShieldConv` はシールド対象が次の自ターンに攻撃または成果行動へつながった割合。
- `Target Quality` の `SAtk` は盾対象が次自ターンに攻撃した率、`S2Low` は同ターン2枚目以降のシールドで残石1以下になった回数。
- `Target Quality` の `WNow` はウェイクアップ対象が同ターンに攻撃した率、`WLowNo` は低石で起こして同ターン仕事しなかった回数。
- `Loss LowS By Action` は負け試合で低石化した布石の行動種別。ここが偏るほど、次候補の狙いを絞りやすい。
