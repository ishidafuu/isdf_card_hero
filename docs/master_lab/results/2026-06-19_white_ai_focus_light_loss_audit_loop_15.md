# White AI Loss Audit

生成: 2026-06-18T15:46:31.572Z
候補: pressure_white_baseline, pressure_white_low_stone_focus_light_v1
相手: black_pressure_strong, black_pressure_pressure
試行: 8 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Loss LowS By Action | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| pressure_white_baseline | 15-17-0 | 10.1 | 3.5 | 25500, 25501, 25504, 25505, 25508, 25509, 25510, 25511, 25512, 25514, 25515, 25518 | Ex 27.2%<br>Setup 49.6%<br>LowS 55.2%<br>ShieldConv 44.7% | Ex 26.1%<br>Setup 51.1%<br>LowS 54.1%<br>ShieldConv 36.4% | focus:80, summon:54, shield:28, wake_up:22, move:17, attack:15, other:2 | - |
| pressure_white_low_stone_focus_light_v1 | 10-22-0 | 10.9 | 3 | 25532, 25534, 25536, 25537, 25539, 25540, 25541, 25542, 25543, 25545, 25547, 25548 | Ex 28.2%<br>Setup 46.9%<br>LowS 62.2%<br>ShieldConv 42.9% | Ex 25.7%<br>Setup 50.7%<br>LowS 51%<br>ShieldConv 34.2% | focus:105, summon:71, shield:39, wake_up:24, move:23, attack:17, other:9 | 惜敗多め |

## Reading

- `Win Intent` / `Loss Intent` は候補白側CPU行動だけを集計している。
- `LowS` は布石後に残ストーンが1以下になった割合。
- `ShieldConv` はシールド対象が次の自ターンに攻撃または成果行動へつながった割合。
- `Loss LowS By Action` は負け試合で低石化した布石の行動種別。ここが偏るほど、次候補の狙いを絞りやすい。
