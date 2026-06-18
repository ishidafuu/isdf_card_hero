# White AI Loss Audit

生成: 2026-06-18T15:28:41.673Z
候補: pressure_white_baseline
相手: black_pressure_strong, black_pressure_pressure
試行: 8 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Loss LowS By Action | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| pressure_white_baseline | 14-18-0 | 10.6 | 2.8 | 25000, 25001, 25002, 25003, 25006, 25007, 25010, 25012, 25013, 25014, 25019, 25020 | Ex 29.1%<br>Setup 49.8%<br>LowS 53.3%<br>ShieldConv 55.6% | Ex 24.6%<br>Setup 53.1%<br>LowS 52.1%<br>ShieldConv 36.2% | focus:96, summon:58, shield:24, wake_up:23, move:21, attack:19, other:11 | 惜敗多め |

## Reading

- `Win Intent` / `Loss Intent` は候補白側CPU行動だけを集計している。
- `LowS` は布石後に残ストーンが1以下になった割合。
- `ShieldConv` はシールド対象が次の自ターンに攻撃または成果行動へつながった割合。
- `Loss LowS By Action` は負け試合で低石化した布石の行動種別。ここが偏るほど、次候補の狙いを絞りやすい。
