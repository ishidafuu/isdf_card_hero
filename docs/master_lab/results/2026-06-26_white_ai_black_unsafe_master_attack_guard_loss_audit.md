# White AI Loss Audit

注記: このレポートは未採用実験 `whiteBlackUnsafeMasterAttackPenalty: 150` を一時的に入れた検証結果。勝敗は 4-8-0 のままで、負け時の相手残HPが悪化したためデフォルト採用していない。

生成: 2026-06-26T04:35:35.740Z
候補: pressure_white_baseline
相手: black_pressure_strong, black_pressure_pressure
試行: 3 games/matchup/direction

## Summary

| Variant | W-L-D | Avg Turns | Loss Opp HP | Loss Seeds | Win Intent | Loss Intent | Win Target Quality | Loss Target Quality | Loss LowS By Action | Loss Focus Reason | Loss Threat Before Setup | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pressure_white_baseline | 4-8-0 | 11.9 | 3.8 | 69002, 69004, 69005, 69007, 69008, 69009, 69010, 69011 | Ex 29.8%<br>Setup 45.3%<br>LowS 37.8%<br>ShieldConv 72.7% | Ex 26.2%<br>Setup 50.1%<br>LowS 37.4%<br>ShieldConv 46.9% | S 11 SAtk 72.7% SLv 0 SDead 0% S2Low 0/1 SHit 1 SMulti 0<br>W 8 WNow 50% WExec 50% WNext 25% WDead 12.5% WLowNo 1/2<br>F 16 FLow 5 FNext 50% FExec 18.8% FLv 0 FDead 12.5% FLowNo 2/5 | S 32 SAtk 50% SLv 3 SDead 3.1% S2Low 1/2 SHit 1 SMulti 0<br>W 13 WNow 30.8% WExec 23.1% WNext 7.7% WDead 7.7% WLowNo 2/6<br>F 34 FLow 13 FNext 52.9% FExec 32.4% FLv 1 FDead 0% FLowNo 4/13 | summon:22, shield:20, focus:13, attack:12, wake_up:6, other:3 | LowF 13<br>NoOther 30.8%<br>Other 69.2%<br>FrontReach 30.8%<br>Summon 0%<br>Wake 0%<br>MA 0%<br>BlkThreat 0% | LowSetup 76<br>ThreatB 52.6%<br>Reducible 30.3%<br>ThreatA 53.9%<br>BlkA 13.2%<br>ClearSetup 25%<br>Redirect 0<br>RedirectNo 0% | - |

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
