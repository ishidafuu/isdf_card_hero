# White AI Loss Audit

生成: 2026-06-19T02:17:02.064Z
候補: pressure_white_baseline
相手: black_pressure_strong, black_pressure_pressure
試行: 8 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Win Target Quality | Loss Target Quality | Loss LowS By Action | Loss Focus Reason | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| pressure_white_baseline | 11-21-0 | 10 | 3.7 | 29200, 29201, 29202, 29203, 29204, 29205, 29206, 29208, 29210, 29215, 29217, 29218 | Ex 27.4%<br>Setup 50.6%<br>LowS 57.5%<br>ShieldConv 42.9% | Ex 26.4%<br>Setup 50.6%<br>LowS 50.3%<br>ShieldConv 32.1% | S 28 SAtk 67.9% SLv 4 SDead 32.1% S2Low 3/3 SHit 3 SMulti 0<br>W 31 WNow 29% WExec 16.1% WNext 19.4% WDead 6.5% WLowNo 11/15<br>F 71 FLow 66 FNext 63.4% FExec 46.5% FLv 9 FDead 7% FLowNo 25/66 | S 53 SAtk 43.4% SLv 1 SDead 28.3% S2Low 4/5 SHit 11 SMulti 1<br>W 60 WNow 18.3% WExec 8.3% WNext 18.3% WDead 16.7% WLowNo 26/26<br>F 121 FLow 94 FNext 54.5% FExec 43% FLv 8 FDead 15.7% FLowNo 41/94 | focus:94, summon:59, wake_up:26, shield:25, attack:17, move:16, other:8 | LowF 94<br>NoOther 39.4%<br>Other 60.6%<br>FrontReach 42.6%<br>Summon 4.3%<br>Wake 0%<br>MA 0%<br>BlkThreat 13.8% | 負け側のウェイク即仕事が低い |

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
