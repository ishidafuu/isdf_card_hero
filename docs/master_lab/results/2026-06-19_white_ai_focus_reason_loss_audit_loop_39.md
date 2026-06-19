# White AI Loss Audit

生成: 2026-06-19T02:26:38.641Z
候補: pressure_white_baseline, pressure_white_low_stone_focus_missed_attack_v1
相手: black_pressure_strong, black_pressure_pressure
試行: 8 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Win Target Quality | Loss Target Quality | Loss LowS By Action | Loss Focus Reason | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| pressure_white_baseline | 12-20-0 | 10.3 | 3.2 | 29500, 29501, 29502, 29503, 29506, 29509, 29511, 29512, 29513, 29514, 29516, 29518 | Ex 27.5%<br>Setup 48.2%<br>LowS 54.1%<br>ShieldConv 30.8% | Ex 25.6%<br>Setup 50.3%<br>LowS 48.5%<br>ShieldConv 42.9% | S 26 SAtk 57.7% SLv 2 SDead 34.6% S2Low 0/1 SHit 6 SMulti 1<br>W 29 WNow 44.8% WExec 24.1% WNext 44.8% WDead 17.2% WLowNo 10/13<br>F 61 FLow 54 FNext 52.5% FExec 36.1% FLv 6 FDead 9.8% FLowNo 27/54 | S 63 SAtk 61.9% SLv 2 SDead 17.5% S2Low 5/6 SHit 6 SMulti 0<br>W 56 WNow 26.8% WExec 19.6% WNext 17.9% WDead 12.5% WLowNo 16/20<br>F 108 FLow 87 FNext 53.7% FExec 38% FLv 5 FDead 13% FLowNo 43/87 | focus:87, summon:60, shield:26, attack:20, wake_up:20, move:14, other:4 | LowF 87<br>NoOther 36.8%<br>Other 63.2%<br>FrontReach 39.1%<br>Summon 5.7%<br>Wake 0%<br>MA 0%<br>BlkThreat 11.5% | 負け側のウェイク即仕事が低い |
| pressure_white_low_stone_focus_missed_attack_v1 | 18-14-0 | 10.5 | 3.8 | 29532, 29533, 29535, 29536, 29537, 29538, 29540, 29544, 29549, 29555, 29558, 29559 | Ex 30.5%<br>Setup 46.6%<br>LowS 55.1%<br>ShieldConv 38.7% | Ex 21.8%<br>Setup 55.4%<br>LowS 51.7%<br>ShieldConv 33.3% | S 31 SAtk 48.4% SLv 2 SDead 19.4% S2Low 3/3 SHit 2 SMulti 0<br>W 46 WNow 23.9% WExec 19.6% WNext 37% WDead 4.3% WLowNo 13/17<br>F 94 FLow 80 FNext 47.9% FExec 38.3% FLv 7 FDead 8.5% FLowNo 42/80 | S 57 SAtk 57.9% SLv 4 SDead 21.1% S2Low 7/9 SHit 8 SMulti 0<br>W 58 WNow 31% WExec 13.8% WNext 25.9% WDead 17.2% WLowNo 18/26<br>F 98 FLow 83 FNext 60.2% FExec 37.8% FLv 2 FDead 7.1% FLowNo 29/83 | focus:83, summon:49, attack:26, wake_up:26, shield:23, move:11, other:4 | LowF 83<br>NoOther 33.7%<br>Other 66.3%<br>FrontReach 45.8%<br>Summon 6%<br>Wake 0%<br>MA 0%<br>BlkThreat 4.8% | - |

## Reading

- `Win Intent` / `Loss Intent` は候補白側CPU行動だけを集計している。
- `LowS` は布石後に残ストーンが1以下になった割合。
- `ShieldConv` はシールド対象が次の自ターンに攻撃または成果行動へつながった割合。
- `Target Quality` の `SAtk` は盾対象が次自ターンに攻撃した率、`S2Low` は同ターン2枚目以降のシールドで残石1以下になった回数。
- `Target Quality` の `SHit` は盾対象が次自ターンまでに受けた攻撃回数、`SMulti` は2回以上攻撃された盾対象数。
- `Target Quality` の `WNow` はウェイクアップ対象が同ターンに攻撃した率、`WDead` は次自ターン前に倒された率、`WLowNo` は低石で起こして同ターン仕事しなかった回数。
- `Target Quality` の `FNext` はfocus対象が次自ターンに攻撃した率、`FLowNo` は低石focus後に次自ターン仕事へ変換されなかった回数。
- `Loss LowS By Action` は負け試合で低石化した布石の行動種別。ここが偏るほど、次候補の狙いを絞りやすい。
- `Loss Focus Reason` は負け試合の低石focus直前に残っていた代替手の粗い監査。`NoOther` は他の行動可能味方なし、`Other` は他の行動可能味方あり、`FrontReach` は同列前衛へ触れる味方あり、`Summon` / `Wake` / `MA` は召喚・ウェイク・マスターアタック余地あり、`BlkThreat` は黒前衛打点源が残った回数。
