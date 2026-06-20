# White AI Loss Audit

生成: 2026-06-20T01:07:38.420Z
候補: pressure_white_baseline
相手: black_pressure_strong, black_pressure_pressure
試行: 16 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Win Target Quality | Loss Target Quality | Loss LowS By Action | Loss Focus Reason | Loss Threat Before Setup | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pressure_white_baseline | 26-38-0 | 10.7 | 3.1 | 39101, 39102, 39104, 39105, 39106, 39107, 39109, 39110, 39112, 39114, 39120, 39122 | Ex 27.7%<br>Setup 49.9%<br>LowS 56%<br>ShieldConv 43.1% | Ex 24.3%<br>Setup 53.2%<br>LowS 52.2%<br>ShieldConv 36.4% | S 72 SAtk 65.3% SLv 7 SDead 23.6% S2Low 12/13 SHit 13 SMulti 0<br>W 78 WNow 30.8% WExec 20.5% WNext 32.1% WDead 10.3% WLowNo 29/40<br>F 182 FLow 154 FNext 57.7% FExec 37.4% FLv 15 FDead 8.2% FLowNo 67/154 | S 143 SAtk 57.3% SLv 12 SDead 16.8% S2Low 15/19 SHit 18 SMulti 0<br>W 112 WNow 32.1% WExec 22.3% WNext 31.3% WDead 17% WLowNo 37/48<br>F 246 FLow 207 FNext 54.5% FExec 40.2% FLv 12 FDead 7.7% FLowNo 99/207 | focus:207, summon:128, shield:68, attack:54, wake_up:48, move:26, other:11 | LowF 207<br>NoOther 50.2%<br>Other 49.8%<br>FrontReach 44.4%<br>Summon 2.9%<br>Wake 0%<br>MA 0%<br>BlkThreat 13.5% | LowSetup 542<br>ThreatB 67.2%<br>Reducible 40.4%<br>ThreatA 67.5%<br>BlkA 13.1%<br>ClearSetup 15.5%<br>Redirect 0<br>RedirectNo 0% | - |

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
