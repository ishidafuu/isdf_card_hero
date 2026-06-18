# White AI Loss Audit

生成: 2026-06-18T23:42:05.863Z
候補: pressure_white_baseline
相手: black_pressure_strong, black_pressure_pressure
試行: 8 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Win Target Quality | Loss Target Quality | Loss LowS By Action | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- |
| pressure_white_baseline | 12-20-0 | 10.4 | 2.7 | 27600, 27601, 27603, 27604, 27605, 27606, 27607, 27608, 27609, 27610, 27614, 27615 | Ex 27.6%<br>Setup 51.6%<br>LowS 53.6%<br>ShieldConv 31.8% | Ex 25.6%<br>Setup 49.2%<br>LowS 52.7%<br>ShieldConv 43.9% | S 22 SAtk 59.1% SLv 3 SDead 13.6% S2Low 3/3<br>W 45 WNow 24.4% WExec 17.8% WNext 28.9% WLowNo 20/26 | S 57 SAtk 61.4% SLv 3 SDead 21.1% S2Low 9/10<br>W 52 WNow 32.7% WExec 17.3% WNext 26.9% WLowNo 14/24 | focus:98, summon:55, shield:25, wake_up:24, attack:19, move:16, other:8 | 惜敗多め |

## Reading

- `Win Intent` / `Loss Intent` は候補白側CPU行動だけを集計している。
- `LowS` は布石後に残ストーンが1以下になった割合。
- `ShieldConv` はシールド対象が次の自ターンに攻撃または成果行動へつながった割合。
- `Target Quality` の `SAtk` は盾対象が次自ターンに攻撃した率、`S2Low` は同ターン2枚目以降のシールドで残石1以下になった回数。
- `Target Quality` の `WNow` はウェイクアップ対象が同ターンに攻撃した率、`WLowNo` は低石で起こして同ターン仕事しなかった回数。
- `Loss LowS By Action` は負け試合で低石化した布石の行動種別。ここが偏るほど、次候補の狙いを絞りやすい。
