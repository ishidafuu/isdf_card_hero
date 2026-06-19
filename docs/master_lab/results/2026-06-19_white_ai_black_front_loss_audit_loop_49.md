# White AI Loss Audit

生成: 2026-06-19T14:20:06.871Z
候補: pressure_white_baseline
相手: black_pressure_strong, black_pressure_pressure
試行: 6 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Win Target Quality | Loss Target Quality | Loss LowS By Action | Loss Focus Reason | Loss Threat Before Setup | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pressure_white_baseline | 9-15-0 | 9.8 | 3.4 | 37500, 37501, 37502, 37503, 37507, 37508, 37509, 37510, 37511, 37512, 37514, 37517 | Ex 30.3%<br>Setup 48.3%<br>LowS 57.6%<br>ShieldConv 35% | Ex 25.2%<br>Setup 52.1%<br>LowS 53.6%<br>ShieldConv 48.1% | S 20 SAtk 55% SLv 3 SDead 15% S2Low 2/2 SHit 2 SMulti 0<br>W 15 WNow 26.7% WExec 13.3% WNext 20% WDead 33.3% WLowNo 5/8<br>F 63 FLow 61 FNext 50.8% FExec 38.1% FLv 2 FDead 15.9% FLowNo 30/61 | S 54 SAtk 55.6% SLv 2 SDead 9.3% S2Low 8/8 SHit 2 SMulti 0<br>W 28 WNow 10.7% WExec 7.1% WNext 17.9% WDead 10.7% WLowNo 11/13<br>F 84 FLow 70 FNext 51.2% FExec 36.9% FLv 5 FDead 7.1% FLowNo 33/70 | focus:70, summon:40, attack:24, shield:24, wake_up:13, move:12, other:5 | LowF 70<br>NoOther 47.1%<br>Other 52.9%<br>FrontReach 40%<br>Summon 7.1%<br>Wake 0%<br>MA 0%<br>BlkThreat 15.7% | LowSetup 188<br>ThreatB 64.9%<br>Reducible 33.5%<br>ThreatA 64.9%<br>BlkA 16%<br>ClearSetup 16.5%<br>Redirect 0<br>RedirectNo 0% | 負け側のウェイク即仕事が低い |

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
- `Loss Threat Before Setup` は負け試合の低石布石前後の脅威監査。`ThreatB` は布石前に敵前衛脅威あり、`Reducible` は既存アクティブ駒で同列前衛へ触れた率、`ThreatA` は布石後も敵前衛脅威あり、`ClearSetup` は何か行動した後に脅威なしで布石した率、`RedirectNo` は挑発/スケープゴート印つき対象への攻撃が成果にならなかった率。
