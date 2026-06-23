# Shield Usage Audit Loop 1

生成: 2026-06-23T00:49:37.541Z
候補: pressure_white_baseline, white494_white_baseline, pressure_white_strict_shield_v1, pressure_white_low_stone_shield_wake_v1, pressure_white_shield_threat_conversion_v1, pressure_white_shield_quality_second_guard_v1
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable
試行: 4 games/matchup/direction
総試合: 144

## Purpose

シールドAIを直接いじらず、まずシールドの使い方だけを再検証する。特に「守る価値があるから貼る」ではなく、「貼ることで相手に追加手数/追加コストを払わせたか」「次ターンの仕事へ変換されたか」を見る。

## Summary

- シールド使用: 672
- 予測上ノープレッシャー: 12 (1.8%)
- マスターアタック込み対象: 78 (11.6%)
- 1接触で除去: 162 (24.1%)
- 接触なし/成果化なし: 182 (27.1%)
- 次ターン成果化: 315 (46.9%)
- 前衛後衛ロールを盾して同ターン後退: 20 (3%)

## Variant Metrics

| Variant | W-L-D | Shield | Pred No Pressure | MA Available | MA Only | MA Changes Lethal | Avg Pred No/With | Preserved | Extra Action Proxy | 1 Contact Removed | No Contact No Conv | Converted | Retreat | Front Back Retreat | Low Stone | 2nd Shield Low | Lethal Reason Removed |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| white494_white_baseline | 6-18-0 | 159 | 2<br>1.3% | 20<br>12.6% | 0<br>0% | 4<br>2.5% | 2.4/1.3 | 120<br>75.5% | 16<br>10.1% | 26<br>16.4% | 50<br>31.4% | 80<br>50.3% | 2<br>1.3% | 2<br>1.3% | 94<br>59.1% | 34/35 | 20<br>12.6% |
| pressure_white_shield_quality_second_guard_v1 | 9-15-0 | 115 | 1<br>0.9% | 9<br>7.8% | 0<br>0% | 0<br>0% | 2.4/1.3 | 69<br>60% | 13<br>11.3% | 31<br>27% | 37<br>32.2% | 44<br>38.3% | 3<br>2.6% | 3<br>2.6% | 64<br>55.7% | 15/15 | 28<br>24.3% |
| pressure_white_shield_threat_conversion_v1 | 11-13-0 | 108 | 1<br>0.9% | 16<br>14.8% | 0<br>0% | 4<br>3.7% | 2.5/1.4 | 64<br>59.3% | 10<br>9.3% | 36<br>33.3% | 21<br>19.4% | 52<br>48.1% | 6<br>5.6% | 6<br>5.6% | 55<br>50.9% | 12/15 | 32<br>29.6% |
| pressure_white_strict_shield_v1 | 10-14-0 | 106 | 1<br>0.9% | 11<br>10.4% | 0<br>0% | 1<br>0.9% | 2.4/1.3 | 67<br>63.2% | 12<br>11.3% | 28<br>26.4% | 28<br>26.4% | 47<br>44.3% | 3<br>2.8% | 3<br>2.8% | 57<br>53.8% | 11/13 | 28<br>26.4% |
| pressure_white_low_stone_shield_wake_v1 | 9-15-0 | 103 | 3<br>2.9% | 8<br>7.8% | 1<br>1% | 0<br>0% | 2.3/1.3 | 66<br>64.1% | 9<br>8.7% | 26<br>25.2% | 25<br>24.3% | 49<br>47.6% | 1<br>1% | 1<br>1% | 45<br>43.7% | 12/13 | 21<br>20.4% |
| pressure_white_baseline | 10-14-0 | 81 | 4<br>4.9% | 14<br>17.3% | 0<br>0% | 4<br>4.9% | 2.5/1.4 | 56<br>69.1% | 13<br>16% | 15<br>18.5% | 21<br>25.9% | 43<br>53.1% | 5<br>6.2% | 5<br>6.2% | 44<br>54.3% | 8/10 | 18<br>22.2% |

## Samples

### single_contact_removed: マッド・ダミー seed 23200 turn 3

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_left / score 118.1 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は6点差で見送り、召喚は69点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:アサシン Lv1 HP2 / PF:アーシュ＆ロロ Lv1 HP5 / PB:マッド・ダミー Lv1 HP2 / CF:真勇者ダイン Lv1 HP6 / CF:ナッツロックル Lv1 HP5 / CB:バルキャノン Lv1 HP3 / CB:アンノウン Lv1 HP5 prep

### lethal_reason_still_removed: マッド・ダミー seed 23200 turn 3

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_left / score 118.1 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は6点差で見送り、召喚は69点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:アサシン Lv1 HP2 / PF:アーシュ＆ロロ Lv1 HP5 / PB:マッド・ダミー Lv1 HP2 / CF:真勇者ダイン Lv1 HP6 / CF:ナッツロックル Lv1 HP5 / CB:バルキャノン Lv1 HP3 / CB:アンノウン Lv1 HP5 prep

### no_contact_no_conversion: アサシン seed 23200 turn 3

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_left / score 115.6 / 致死圏の味方を守れるためシールド / 見送り: 召喚は111点差で見送り、攻撃は132点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:アサシン Lv1 HP2 / PF:アーシュ＆ロロ Lv1 HP5 / PB:マッド・ダミー Lv1 HP2 shield / CF:真勇者ダイン Lv1 HP6 / CF:ナッツロックル Lv1 HP5 / CB:バルキャノン Lv1 HP3 / CB:アンノウン Lv1 HP5 prep

### single_contact_removed: アサシン seed 23200 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_left / score 115.6 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は56点差で見送り、召喚は60点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted true
- board: PF:アサシン Lv1 HP2 / PF:アーシュ＆ロロ Lv1 HP5 / PB:マッド・ダミー Lv1 HP2 / CF:真勇者ダイン Lv1 HP6 shield / CF:ナッツロックル Lv1 HP5 / CB:バルキャノン Lv1 HP3 shield / CB:アンノウン Lv1 HP5

### lethal_reason_still_removed: アサシン seed 23200 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_left / score 115.6 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は56点差で見送り、召喚は60点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted true
- board: PF:アサシン Lv1 HP2 / PF:アーシュ＆ロロ Lv1 HP5 / PB:マッド・ダミー Lv1 HP2 / CF:真勇者ダイン Lv1 HP6 shield / CF:ナッツロックル Lv1 HP5 / CB:バルキャノン Lv1 HP3 shield / CB:アンノウン Lv1 HP5

### single_contact_removed: アサシン seed 23200 turn 5

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_left / score 118.9 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は84点差で見送り、召喚は158点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:アサシン Lv1 HP2 / PF:アーシュ＆ロロ Lv1 HP5 / PB:ホロウダイン Lv1 HP5 / CF:真勇者ダイン Lv1 HP6 / CF:ナッツロックル Lv1 HP5 / CB:バルキャノン Lv2 HP3 / CB:アンノウン Lv1 HP5

### lethal_reason_still_removed: アサシン seed 23200 turn 5

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_left / score 118.9 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は84点差で見送り、召喚は158点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:アサシン Lv1 HP2 / PF:アーシュ＆ロロ Lv1 HP5 / PB:ホロウダイン Lv1 HP5 / CF:真勇者ダイン Lv1 HP6 / CF:ナッツロックル Lv1 HP5 / CB:バルキャノン Lv2 HP3 / CB:アンノウン Lv1 HP5

### lethal_reason_still_removed: ホロウダイン seed 23200 turn 6

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / score 113.1 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は108点差で見送り、移動は149点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 2, damage 3, removed true, converted false
- board: PF:オーパス Lv1 HP4 / PF:アーシュ＆ロロ Lv1 HP5 / PB:ホロウダイン Lv1 HP3 / CF:真勇者ダイン Lv2 HP6 / CF:ナッツロックル Lv1 HP5 / CB:バルキャノン Lv2 HP3 / CB:アンノウン Lv1 HP5

### no_contact_no_conversion: ピグミィ seed 23200 turn 9

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_left / score 127 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は103点差で見送り、攻撃は122点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ラオン Lv1 HP5 / PF:アーシュ＆ロロ Lv1 HP5 / PB:ピグミィ Lv2 HP3 / PB:神斬丸 Lv1 HP5 / CF:アンノウン Lv1 HP5 / CF:ナッツロックル Lv1 HP4 / CB:ゼック Lv1 HP2 / CB:バルキャノン Lv2 HP3

### single_contact_removed: ラッフィー seed 23201 turn 8

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_front_right / score 124.4 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は74点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ピグミィ Lv1 HP3 / PF:ラッフィー Lv2 HP3 / PB:ボムゾウ Lv1 HP6 / CF:ゾンビ Lv2 HP4 / CF:ナッツロックル Lv1 HP6 prep / CB:フーヨウ Lv2 HP3 / CB:アンノウン Lv1 HP5 prep

### lethal_reason_still_removed: ラッフィー seed 23201 turn 8

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_front_right / score 124.4 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は74点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ピグミィ Lv1 HP3 / PF:ラッフィー Lv2 HP3 / PB:ボムゾウ Lv1 HP6 / CF:ゾンビ Lv2 HP4 / CF:ナッツロックル Lv1 HP6 prep / CB:フーヨウ Lv2 HP3 / CB:アンノウン Lv1 HP5 prep

### single_contact_removed: ボムゾウ seed 23201 turn 9

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_front_right / score 114.5 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は21点差で見送り、攻撃は200点差で見送り
- predicted damage: no shield 5, with shield 3
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ピグミィ Lv1 HP3 / PF:ボムゾウ Lv1 HP3 / CF:ゾンビ Lv2 HP4 / CF:ナッツロックル Lv1 HP6 / CB:フーヨウ Lv2 HP2 / CB:アンノウン Lv1 HP5

### lethal_reason_still_removed: ボムゾウ seed 23201 turn 9

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_front_right / score 114.5 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は21点差で見送り、攻撃は200点差で見送り
- predicted damage: no shield 5, with shield 3
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ピグミィ Lv1 HP3 / PF:ボムゾウ Lv1 HP3 / CF:ゾンビ Lv2 HP4 / CF:ナッツロックル Lv1 HP6 / CB:フーヨウ Lv2 HP2 / CB:アンノウン Lv1 HP5

### single_contact_removed: ピグミィ seed 23201 turn 9

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_front_left / score 118 / 致死圏の味方を守れるためシールド
- predicted damage: no shield 4, with shield 2
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ピグミィ Lv2 HP3 / PF:ボムゾウ Lv1 HP3 shield / CF:ゾンビ Lv2 HP4 / CF:ナッツロックル Lv1 HP6 / CB:アンノウン Lv1 HP5

### no_contact_no_conversion: ピグミィ seed 23203 turn 7

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_right / score 56.5 / 高価値の味方を守るためシールド / 見送り: マスター特技は5点差で見送り、マスター特技は6点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ドノマンティス Lv1 HP5 / PF:アーシュ＆ロロ Lv2 HP5 / PB:ホロウダイン Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:神斬丸 Lv1 HP4 / CB:ラティーヌ Lv1 HP4 / CB:ガンプ Lv1 HP5

### no_contact_no_conversion: ラオン seed 23204 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_right / score 52.9 / 高価値の味方を守るためシールド / 見送り: マスター特技は10点差で見送り、マスター特技は27点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:アンノウン Lv1 HP5 / PB:ガンプ Lv1 HP5 / CF:ドノマンティス Lv2 HP5 / CF:ラオン Lv1 HP4 / CB:オーパス Lv1 HP4 / CB:マッド・ダミー Lv1 HP3

### predicted_no_pressure: ドノマンティス seed 23204 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_left / score 28.4 / 高価値の味方を守るためシールド / 見送り: マスター特技は85点差で見送り
- predicted damage: no shield 0, with shield 0
- actual: contacts 0, damage 0, removed false, converted true
- board: PF:アンノウン Lv1 HP5 / PB:ガンプ Lv1 HP5 / CF:ドノマンティス Lv2 HP5 / CF:ラオン Lv1 HP4 shield / CB:オーパス Lv1 HP4 / CB:マッド・ダミー Lv1 HP3

### no_contact_no_conversion: マッド・ダミー seed 23204 turn 7

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_right / score 110.2 / 致死圏の味方を守れるためシールド
- predicted damage: no shield 4, with shield 2
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:アンノウン Lv1 HP4 / PF:ラティーヌ Lv1 HP4 / PB:フーヨウ Lv1 HP3 prep / CF:ドノマンティス Lv2 HP5 / CF:マッド・ダミー Lv1 HP3 / CB:オーパス Lv1 HP4

### no_contact_no_conversion: アーシュ＆ロロ seed 23206 turn 8

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_left / score 121.2 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は4点差で見送り
- predicted damage: no shield 4, with shield 2
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ファントム Lv1 HP3 / PB:ラティーヌ Lv1 HP2 / PB:ゾンビ Lv1 HP4 prep / CF:アーシュ＆ロロ Lv2 HP2 / CB:オヤコダケ Lv2 HP2

### front_back_role_shield_then_retreat: ピグミィ seed 23207 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, win)
- decision: cpu_front_left / score 120.1 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は16点差で見送り、召喚は59点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:グングニエル Lv1 HP4 / PF:神斬丸 Lv1 HP4 / PB:フーヨウ Lv2 HP3 / CF:ピグミィ Lv2 HP3 / CF:ホロウダイン Lv1 HP3 / CB:ピグミィ Lv2 HP3

### front_back_role_shield_then_retreat: ピグミィ seed 23208 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_pressure` (player, loss)
- decision: player_front_left / score 112.4 / 致死圏の味方を守れるためシールド / 見送り: 召喚は70点差で見送り、召喚は70点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 1, damage 3, removed true, converted true
- board: PF:ピグミィ Lv1 HP3 / PF:ドノマンティス Lv2 HP5 / PB:ピグミィ Lv1 HP3 / CF:ナッツロックル Lv1 HP6 / CB:ヴァルテル Lv1 HP1 / CB:フーヨウ Lv2 HP3

### predicted_no_pressure: アーシュ＆ロロ seed 23208 turn 9

- variant/opponent: `pressure_white_baseline` vs `black_pressure_pressure` (player, loss)
- decision: player_front_left / score 28.4 / 高価値の味方を守るためシールド / 見送り: マスター特技は38点差で見送り
- predicted damage: no shield 0, with shield 0
- actual: contacts 0, damage 0, removed false, converted true
- board: PF:アーシュ＆ロロ Lv2 HP5 / PF:ボムゾウ Lv1 HP6 shield / PB:マッド・ダミー Lv1 HP3 / PB:マッド・ダミー Lv1 HP3 / CF:ゾンビ Lv1 HP3 / CB:神斬丸 Lv1 HP5

### front_back_role_shield_then_retreat: マッド・ダミー seed 23216 turn 12

- variant/opponent: `pressure_white_baseline` vs `decoy_back_stable` (player, loss)
- decision: player_front_right / score 111.3 / 致死圏の味方を守れるためシールド / 見送り: マジックは62点差で見送り、召喚は70点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 1, removed false, converted false
- board: PF:神斬丸 Lv1 HP5 / PF:マッド・ダミー Lv1 HP2 / PB:ホロウダイン Lv1 HP5 / CF:ゾンビ Lv2 HP1 / CF:ナッツロックル Lv1 HP6 / CB:ラティーヌ Lv1 HP3 / CB:バルキャノン Lv1 HP3

### predicted_no_pressure: キラービ seed 23216 turn 17

- variant/opponent: `pressure_white_baseline` vs `decoy_back_stable` (player, loss)
- decision: player_back_right / score 51.5 / 次ターンのレベルアップ筋を残すためシールド / 見送り: マスター特技は57点差で見送り、攻撃は91点差で見送り
- predicted damage: no shield 0, with shield 0
- actual: contacts 0, damage 0, removed false, converted true
- board: PF:神斬丸 Lv2 HP5 / PF:ラッフィー Lv1 HP5 shield / PB:マッド・ダミー Lv1 HP1 / PB:キラービ Lv2 HP3 / CF:ゾンビ Lv2 HP4 / CF:ナッツロックル Lv1 HP6 / CB:真勇者ダイン Lv1 HP6 prep / CB:ラティーヌ Lv1 HP2

### front_back_role_shield_then_retreat: ピグミィ seed 23217 turn 14

- variant/opponent: `pressure_white_baseline` vs `decoy_back_stable` (player, loss)
- decision: player_front_right / score 115.6 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は15点差で見送り、召喚は48点差で見送り
- predicted damage: no shield 4, with shield 3
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:アーシュ＆ロロ Lv1 HP5 / PF:ピグミィ Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:グングニエル Lv1 HP3 / CF:真勇者ダイン Lv3 HP6 / CB:ホロウダイン Lv1 HP5 / CB:ガンプ Lv1 HP5

### front_back_role_shield_then_retreat: オヤコダケ seed 23218 turn 9

- variant/opponent: `pressure_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_front_right / score 119 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は188点差で見送り、召喚は234点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted true
- board: PF:ボムゾウ Lv1 HP6 / PF:オヤコダケ Lv2 HP2 / PB:マッド・ダミー Lv1 HP3 / CF:ナッツロックル Lv1 HP6 / CF:ゾンビ Lv1 HP2

### predicted_no_pressure: ピグミィ seed 23221 turn 7

- variant/opponent: `pressure_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_back_left / score 28.8 / 高価値の味方を守るためシールド
- predicted damage: no shield 0, with shield 0
- actual: contacts 0, damage 0, removed false, converted false
- board: CF:デスシープ Lv1 HP6 / CF:ラオン Lv1 HP5 / CB:ピグミィ Lv2 HP3 / CB:神斬丸 Lv2 HP5

### front_back_role_shield_then_retreat: ピグミィ seed 23230 turn 11

- variant/opponent: `white494_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_left / score 112.4 / 致死圏の味方を守れるためシールド / 見送り: 移動は33点差で見送り、移動は33点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ガンプ Lv2 HP5 / PF:神斬丸 Lv1 HP5 / PB:バルキャノン Lv1 HP3 / CF:ピグミィ Lv1 HP3

### predicted_no_pressure: ピグミィ seed 23232 turn 5

- variant/opponent: `white494_white_baseline` vs `black_pressure_pressure` (player, loss)
- decision: player_back_left / score 28.8 / 高価値の味方を守るためシールド
- predicted damage: no shield 0, with shield 0
- actual: contacts 1, damage 3, removed true, converted true
- board: PF:真勇者ダイン Lv1 HP4 / PF:ヤミー Lv1 HP5 / PB:ピグミィ Lv2 HP3 / PB:真勇者ダイン Lv1 HP6

### predicted_no_pressure: デスシープ seed 23243 turn 5

- variant/opponent: `white494_white_baseline` vs `decoy_back_stable` (player, loss)
- decision: player_front_right / score 29.5 / 高価値の味方を守るためシールド
- predicted damage: no shield 0, with shield 0
- actual: contacts 0, damage 0, removed false, converted true
- board: PF:真勇者ダイン Lv1 HP6 shield / PF:デスシープ Lv2 HP6 / PB:ヤミー Lv1 HP5 / PB:ポリスピナー Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CB:グングニエル Lv1 HP5 / CB:ナッツロックル Lv1 HP5

### master_attack_only_pressure: アーシュ＆ロロ seed 23283 turn 7

- variant/opponent: `pressure_white_low_stone_shield_wake_v1` vs `black_pressure_pressure` (player, win)
- decision: player_front_left / score 28.4 / 高価値の味方を守るためシールド
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 5, removed true, converted true
- board: PF:アーシュ＆ロロ Lv2 HP5 / PF:ラッフィー Lv1 HP5 shield / PB:オヤコダケ Lv2 HP2 / PB:マッド・ダミー Lv1 HP3 / CF:ヒートロン Lv1 HP3


## Notes

- この監査はAI挙動を変更しない。既存履歴からシールド判断だけを分類する。
- 予測ダメージは相手の次ターンにモンスターが起きて動ける前提の簡易上限。特殊状態、全マジック、石の完全な手順競合はまだ精密化していない。
- master_attack は前衛の登場済みモンスターへ2Pとして見積もり、シールド後は1Pとして扱う。
- forced extra action proxy は、実ログ上で2回以上触られた、または1回触られても次自ターンまで残ったシールドを数える。

## Reading

- `Pred No Pressure` は、簡易予測でモンスター打点もマスターアタック打点も入らないのにシールドした回数。
- `MA Available` は、相手が次ターンに対象へマスターアタックできる前衛シールド。
- `MA Changes Lethal` は、モンスター打点だけなら非致死だがマスターアタック込みで致死になる見込み。
- `Extra Action Proxy` は、実ログ上でシールド対象が2回以上触られた、または1回触られても次自ターンまで残ったケース。
- `Front Back Retreat` は、前衛の後衛ロールにシールドしてから同ターン後列へ下げたケース。フーヨウ系の雑シールド検出を狙う。

## Next Loop Proposal

- マスターアタック込みの突破見込みが多いので、`IncomingThreat` に monster-only / master-attack-included の二段値を持たせる設計を次候補にする。
- 1接触で除去されるシールドが多い場合、`致死圏だから守る` ではなく `シールド後に少なくとも追加1手を要求する` 条件へ寄せる。
- 前衛後衛ロールを盾して同ターン後退する例が出ているため、カード名固定ではなく `back-role front slot + safe retreat available` の監査を深掘りする。
- 次の比較軸は `pressure_white_baseline` を基準にし、ノープレッシャー率と1接触除去率を落とせるかを見る。
