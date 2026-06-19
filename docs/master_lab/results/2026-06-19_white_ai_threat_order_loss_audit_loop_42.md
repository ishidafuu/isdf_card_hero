# White AI Loss Audit

生成: 2026-06-19T02:50:32.751Z
候補: pressure_white_baseline, pressure_white_threat_then_setup_v1
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable
試行: 6 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Win Target Quality | Loss Target Quality | Loss LowS By Action | Loss Focus Reason | Loss Threat Before Setup | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pressure_white_baseline | 16-20-0 | 12.8 | 3.3 | 29900, 29901, 29902, 29903, 29905, 29906, 29908, 29909, 29911, 29912, 29914, 29915 | Ex 25.4%<br>Setup 48%<br>LowS 54.5%<br>ShieldConv 38.1% | Ex 21.6%<br>Setup 54.5%<br>LowS 52.3%<br>ShieldConv 33.9% | S 42 SAtk 54.8% SLv 2 SDead 21.4% S2Low 2/2 SHit 15 SMulti 4<br>W 52 WNow 30.8% WExec 19.2% WNext 30.8% WDead 19.2% WLowNo 24/31<br>F 110 FLow 88 FNext 51.8% FExec 37.3% FLv 7 FDead 8.2% FLowNo 48/88 | S 118 SAtk 45.8% SLv 5 SDead 19.5% S2Low 23/30 SHit 32 SMulti 2<br>W 68 WNow 26.5% WExec 8.8% WNext 23.5% WDead 26.5% WLowNo 28/36<br>F 152 FLow 123 FNext 46.7% FExec 30.9% FLv 4 FDead 9.9% FLowNo 64/123 | focus:123, summon:67, shield:47, attack:37, wake_up:36, move:19, other:9 | LowF 123<br>NoOther 35%<br>Other 65%<br>FrontReach 48.8%<br>Summon 3.3%<br>Wake 0%<br>MA 0%<br>BlkThreat 4.9% | LowSetup 338<br>ThreatB 72.2%<br>Reducible 40.8%<br>ThreatA 72.8%<br>BlkA 7.1%<br>ClearSetup 13%<br>Redirect 10<br>RedirectNo 90% | 負け側のウェイク即仕事が低い |
| pressure_white_threat_then_setup_v1 | 15-21-0 | 13.1 | 3.2 | 29937, 29938, 29939, 29940, 29944, 29948, 29949, 29950, 29951, 29952, 29953, 29954 | Ex 21.4%<br>Setup 53%<br>LowS 53.6%<br>ShieldConv 41.7% | Ex 22.9%<br>Setup 54.5%<br>LowS 54.6%<br>ShieldConv 34.9% | S 84 SAtk 56% SLv 5 SDead 26.2% S2Low 14/14 SHit 21 SMulti 7<br>W 66 WNow 34.8% WExec 25.8% WNext 27.3% WDead 24.2% WLowNo 24/36<br>F 158 FLow 127 FNext 53.2% FExec 31.6% FLv 10 FDead 10.8% FLowNo 59/127 | S 86 SAtk 41.9% SLv 2 SDead 18.6% S2Low 14/17 SHit 30 SMulti 4<br>W 76 WNow 19.7% WExec 9.2% WNext 26.3% WDead 21.1% WLowNo 34/40<br>F 173 FLow 142 FNext 54.9% FExec 33.5% FLv 5 FDead 12.1% FLowNo 68/142 | focus:142, summon:70, shield:46, wake_up:40, attack:35, move:21, other:4 | LowF 142<br>NoOther 38.7%<br>Other 61.3%<br>FrontReach 47.9%<br>Summon 1.4%<br>Wake 0%<br>MA 0%<br>BlkThreat 9.2% | LowSetup 358<br>ThreatB 70.9%<br>Reducible 48%<br>ThreatA 71.2%<br>BlkA 6.7%<br>ClearSetup 13.7%<br>Redirect 14<br>RedirectNo 85.7% | 負け側のウェイク即仕事が低い |

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
