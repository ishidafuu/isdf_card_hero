# White AI Loss Audit

生成: 2026-06-20T00:19:34.803Z
候補: pressure_white_baseline
相手: black_pressure_strong, black_pressure_pressure
試行: 10 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Win Target Quality | Loss Target Quality | Loss LowS By Action | Loss Focus Reason | Loss Threat Before Setup | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pressure_white_baseline | 11-29-0 | 10.4 | 3.2 | 38200, 38201, 38202, 38205, 38206, 38208, 38209, 38212, 38213, 38214, 38216, 38218 | Ex 28.1%<br>Setup 49.7%<br>LowS 57.1%<br>ShieldConv 46.4% | Ex 25.9%<br>Setup 50%<br>LowS 52.3%<br>ShieldConv 37.1% | S 28 SAtk 67.9% SLv 4 SDead 25% S2Low 2/2 SHit 7 SMulti 1<br>W 32 WNow 37.5% WExec 25% WNext 34.4% WDead 15.6% WLowNo 9/16<br>F 77 FLow 65 FNext 61% FExec 37.7% FLv 3 FDead 13% FLowNo 28/65 | S 89 SAtk 47.2% SLv 4 SDead 23.6% S2Low 9/12 SHit 16 SMulti 0<br>W 63 WNow 25.4% WExec 14.3% WNext 28.6% WDead 9.5% WLowNo 25/29<br>F 164 FLow 136 FNext 49.4% FExec 37.8% FLv 8 FDead 11.6% FLowNo 71/136 | focus:136, summon:94, shield:32, attack:30, wake_up:29, move:17, other:9 | LowF 136<br>NoOther 44.9%<br>Other 55.1%<br>FrontReach 43.4%<br>Summon 5.1%<br>Wake 0%<br>MA 0%<br>BlkThreat 15.4% | LowSetup 347<br>ThreatB 63.1%<br>Reducible 36.9%<br>ThreatA 63.4%<br>BlkA 13.3%<br>ClearSetup 16.7%<br>Redirect 0<br>RedirectNo 0% | 負け側のウェイク即仕事が低い |

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
