# White AI Loss Audit

生成: 2026-06-19T01:29:36.607Z
候補: pressure_white_baseline
相手: black_pressure_strong, black_pressure_pressure
試行: 8 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Win Target Quality | Loss Target Quality | Loss LowS By Action | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- |
| pressure_white_baseline | 9-23-0 | 10.7 | 3.4 | 27701, 27703, 27704, 27705, 27707, 27708, 27711, 27712, 27713, 27714, 27715, 27716 | Ex 28.8%<br>Setup 49.5%<br>LowS 47.6%<br>ShieldConv 46.2% | Ex 24.8%<br>Setup 51.2%<br>LowS 50.9%<br>ShieldConv 37.3% | S 13 SAtk 61.5% SLv 0 SDead 15.4% S2Low 0/0 SHit 5 SMulti 1<br>W 36 WNow 36.1% WExec 25% WNext 36.1% WDead 11.1% WLowNo 12/16<br>F 48 FLow 33 FNext 60.4% FExec 54.2% FLv 3 FDead 10.4% FLowNo 17/33 | S 67 SAtk 58.2% SLv 0 SDead 19.4% S2Low 10/13 SHit 13 SMulti 0<br>W 73 WNow 32.9% WExec 12.3% WNext 26% WDead 16.4% WLowNo 19/29<br>F 138 FLow 107 FNext 59.4% FExec 41.3% FLv 7 FDead 6.5% FLowNo 47/107 | focus:107, summon:76, wake_up:29, shield:28, attack:27, move:22, other:9 | - |

## Reading

- `Win Intent` / `Loss Intent` は候補白側CPU行動だけを集計している。
- `LowS` は布石後に残ストーンが1以下になった割合。
- `ShieldConv` はシールド対象が次の自ターンに攻撃または成果行動へつながった割合。
- `Target Quality` の `SAtk` は盾対象が次自ターンに攻撃した率、`S2Low` は同ターン2枚目以降のシールドで残石1以下になった回数。
- `Target Quality` の `SHit` は盾対象が次自ターンまでに受けた攻撃回数、`SMulti` は2回以上攻撃された盾対象数。
- `Target Quality` の `WNow` はウェイクアップ対象が同ターンに攻撃した率、`WDead` は次自ターン前に倒された率、`WLowNo` は低石で起こして同ターン仕事しなかった回数。
- `Target Quality` の `FNext` はfocus対象が次自ターンに攻撃した率、`FLowNo` は低石focus後に次自ターン仕事へ変換されなかった回数。
- `Loss LowS By Action` は負け試合で低石化した布石の行動種別。ここが偏るほど、次候補の狙いを絞りやすい。
