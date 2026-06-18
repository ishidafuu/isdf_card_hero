# White AI Loss Audit

生成: 2026-06-18T22:50:23.247Z
候補: pressure_white_baseline
相手: black_pressure_strong, black_pressure_pressure
試行: 8 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Win Target Quality | Loss Target Quality | Loss LowS By Action | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- |
| pressure_white_baseline | 9-23-0 | 10.3 | 3.7 | 26101, 26102, 26103, 26106, 26107, 26108, 26110, 26111, 26112, 26113, 26114, 26116 | Ex 29%<br>Setup 48.9%<br>LowS 53.9%<br>ShieldConv 32% | Ex 25.4%<br>Setup 51.7%<br>LowS 54.1%<br>ShieldConv 42.6% | S 25 SAtk 52% SLv 0 SDead 40% S2Low 5/5<br>W 27 WNow 22.2% WExec 11.1% WNext 40.7% WLowNo 7/9 | S 68 SAtk 60.3% SLv 5 SDead 20.6% S2Low 8/10<br>W 52 WNow 28.8% WExec 15.4% WNext 26.9% WLowNo 12/21 | focus:105, summon:68, shield:36, attack:24, wake_up:21, move:18, other:11 | 負け側のウェイク即仕事が低い |

## Reading

- `Win Intent` / `Loss Intent` は候補白側CPU行動だけを集計している。
- `LowS` は布石後に残ストーンが1以下になった割合。
- `ShieldConv` はシールド対象が次の自ターンに攻撃または成果行動へつながった割合。
- `Target Quality` の `SAtk` は盾対象が次自ターンに攻撃した率、`S2Low` は同ターン2枚目以降のシールドで残石1以下になった回数。
- `Target Quality` の `WNow` はウェイクアップ対象が同ターンに攻撃した率、`WLowNo` は低石で起こして同ターン仕事しなかった回数。
- `Loss LowS By Action` は負け試合で低石化した布石の行動種別。ここが偏るほど、次候補の狙いを絞りやすい。
