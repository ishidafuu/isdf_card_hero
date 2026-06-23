# Shield Usage Audit Loop 1

生成: 2026-06-23T03:13:43.523Z
候補: pressure_white_baseline, pressure_white_shield_quality_second_guard_v1, pressure_white_shield_breakthrough_guard_plus20_v1
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable
試行: 6 games/matchup/direction
総試合: 108

## Purpose

シールドAIを直接いじらず、まずシールドの使い方だけを再検証する。特に「守る価値があるから貼る」ではなく、「貼ることで相手に追加手数/追加コストを払わせたか」「次ターンの仕事へ変換されたか」を見る。

## Summary

- シールド使用: 501
- 予測上ノープレッシャー: 5 (1%)
- マスターアタック込み対象: 112 (22.4%)
- 1接触で除去: 109 (21.8%)
- 接触なし/成果化なし: 157 (31.3%)
- 次ターン成果化: 217 (43.3%)
- 前衛後衛ロールを盾して同ターン後退: 17 (3.4%)

## Variant Metrics

| Variant | W-L-D | Shield | Pred No Pressure | MA Available | MA Only | MA Changes Lethal | Avg Pred No/With | Preserved | Extra Action Proxy | 1 Contact Removed | No Contact No Conv | Converted | Retreat | Front Back Retreat | Low Stone | 2nd Shield Low | Lethal Reason Removed |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pressure_white_shield_quality_second_guard_v1 | 17-19-0 | 183 | 4<br>2.2% | 37<br>20.2% | 3<br>1.6% | 23<br>12.6% | 2.6/1.4 | 120<br>65.6% | 22<br>12% | 36<br>19.7% | 63<br>34.4% | 76<br>41.5% | 4<br>2.2% | 4<br>2.2% | 68<br>37.2% | 15/26 | 36<br>19.7% |
| pressure_white_baseline | 12-24-0 | 172 | 0<br>0% | 35<br>20.3% | 3<br>1.7% | 14<br>8.1% | 2.6/1.4 | 113<br>65.7% | 15<br>8.7% | 39<br>22.7% | 46<br>26.7% | 83<br>48.3% | 7<br>4.1% | 7<br>4.1% | 80<br>46.5% | 23/24 | 43<br>25% |
| pressure_white_shield_breakthrough_guard_plus20_v1 | 12-24-0 | 146 | 1<br>0.7% | 40<br>27.4% | 9<br>6.2% | 26<br>17.8% | 2.6/1.4 | 90<br>61.6% | 18<br>12.3% | 34<br>23.3% | 48<br>32.9% | 58<br>39.7% | 6<br>4.1% | 6<br>4.1% | 73<br>50% | 12/15 | 40<br>27.4% |

## Samples

### front_back_role_shield_then_retreat: ピグミィ seed 25000 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_front_left / score 120.1 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は22点差で見送り、召喚は84点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ピグミィ Lv2 HP3 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:フーヨウ Lv2 HP3 / CF:アンノウン Lv1 HP3 / CB:ホロウダイン Lv1 HP5 prep

### single_contact_removed: ピグミィ seed 25000 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_front_left / score 120.1 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は22点差で見送り、召喚は84点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ピグミィ Lv2 HP3 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:フーヨウ Lv2 HP3 / CF:アンノウン Lv1 HP3 / CB:ホロウダイン Lv1 HP5 prep

### lethal_reason_still_removed: ピグミィ seed 25000 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_front_left / score 120.1 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は22点差で見送り、召喚は84点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ピグミィ Lv2 HP3 / PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / CF:フーヨウ Lv2 HP3 / CF:アンノウン Lv1 HP3 / CB:ホロウダイン Lv1 HP5 prep

### single_contact_removed: マッド・ダミー seed 25000 turn 7

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_front_left / score 110.2 / 致死圏の味方を守れるためシールド / 見送り: 召喚は80点差で見送り、召喚は99点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:マッド・ダミー Lv1 HP3 / PF:デスシープ Lv2 HP6 / PB:ピグミィ Lv2 HP3 / CF:グングニエル Lv2 HP5

### lethal_reason_still_removed: マッド・ダミー seed 25000 turn 7

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_front_left / score 110.2 / 致死圏の味方を守れるためシールド / 見送り: 召喚は80点差で見送り、召喚は99点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:マッド・ダミー Lv1 HP3 / PF:デスシープ Lv2 HP6 / PB:ピグミィ Lv2 HP3 / CF:グングニエル Lv2 HP5

### single_contact_removed: ボムゾウ seed 25000 turn 9

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_front_left / score 121.2 / 致死圏の味方を守れるためシールド
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:ボムゾウ Lv2 HP2 / PF:デスシープ Lv2 HP6 / PB:ボムゾウ Lv1 HP6 / PB:ピグミィ Lv2 HP3 / CF:ファントム Lv1 HP4 shield / CF:ガンプ Lv1 HP5 shield

### lethal_reason_still_removed: ボムゾウ seed 25000 turn 9

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_front_left / score 121.2 / 致死圏の味方を守れるためシールド
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:ボムゾウ Lv2 HP2 / PF:デスシープ Lv2 HP6 / PB:ボムゾウ Lv1 HP6 / PB:ピグミィ Lv2 HP3 / CF:ファントム Lv1 HP4 shield / CF:ガンプ Lv1 HP5 shield

### no_contact_no_conversion: ボムゾウ seed 25000 turn 10

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_front_left / score 114.5 / 致死圏の味方を守れるためシールド
- predicted damage: no shield 4, with shield 2
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ボムゾウ Lv1 HP3 / PF:デスシープ Lv2 HP6 / PB:ピグミィ Lv2 HP3 / CF:ファントム Lv2 HP5 / CF:ガンプ Lv1 HP5

### no_contact_no_conversion: ホロウダイン seed 25002 turn 5

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_right / score 157.3 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は123点差で見送り、マスター特技は133点差で見送り
- predicted damage: no shield 5, with shield 3
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ホロウダイン Lv1 HP5 / PF:ホロウダイン Lv1 HP5 / PB:キラービ Lv2 HP3 / PB:ボムゾウ Lv1 HP6 / CF:ナッツロックル Lv1 HP5 / CF:ヒートロン Lv2 HP3 / CB:グングニエル Lv1 HP3 / CB:ヒートロン Lv1 HP5 prep

### single_contact_removed: ボムゾウ seed 25003 turn 5

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_right / score 58.4 / 高価値の味方を守るためシールド
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted true
- board: PF:ラオン Lv1 HP5 / PF:ボムゾウ Lv2 HP5 / PB:ホロウダイン Lv1 HP5 / PB:ラッフィー Lv1 HP5 / CF:ヒートロン Lv1 HP5 / CB:ガンプ Lv1 HP5 prep

### single_contact_removed: ボムゾウ seed 25003 turn 6

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_right / score 121.2 / 致死圏の味方を守れるためシールド
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:ラオン Lv1 HP5 / PF:ボムゾウ Lv2 HP2 / PB:ホロウダイン Lv1 HP5 / PB:ラッフィー Lv1 HP5 / CF:ガンプ Lv1 HP5 / CF:ヒートロン Lv1 HP4 / CB:ゾンビ Lv1 HP4 prep

### lethal_reason_still_removed: ボムゾウ seed 25003 turn 6

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_right / score 121.2 / 致死圏の味方を守れるためシールド
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:ラオン Lv1 HP5 / PF:ボムゾウ Lv2 HP2 / PB:ホロウダイン Lv1 HP5 / PB:ラッフィー Lv1 HP5 / CF:ガンプ Lv1 HP5 / CF:ヒートロン Lv1 HP4 / CB:ゾンビ Lv1 HP4 prep

### no_contact_no_conversion: ラオン seed 25003 turn 8

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_left / score 118.9 / 致死圏の味方を守れるためシールド
- predicted damage: no shield 4, with shield 2
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ラオン Lv1 HP5 / PF:ラッフィー Lv1 HP5 / PB:ホロウダイン Lv1 HP5 / CF:ガンプ Lv1 HP5 / CB:ゾンビ Lv1 HP4 / CB:グングニエル Lv1 HP5

### single_contact_removed: ドノマンティス seed 25004 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_right / score 116.7 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は85点差で見送り、攻撃は117点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ホロウダイン Lv1 HP5 / PF:ドノマンティス Lv1 HP3 / PB:デスシープ Lv1 HP6 / PB:アーシュ＆ロロ Lv1 HP5 / CF:ホロウダイン Lv1 HP5 / CF:グングニエル Lv1 HP5 / CB:ゼック Lv1 HP1 / CB:フーヨウ Lv1 HP3

### lethal_reason_still_removed: ドノマンティス seed 25004 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_right / score 116.7 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は85点差で見送り、攻撃は117点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ホロウダイン Lv1 HP5 / PF:ドノマンティス Lv1 HP3 / PB:デスシープ Lv1 HP6 / PB:アーシュ＆ロロ Lv1 HP5 / CF:ホロウダイン Lv1 HP5 / CF:グングニエル Lv1 HP5 / CB:ゼック Lv1 HP1 / CB:フーヨウ Lv1 HP3

### lethal_reason_still_removed: ホロウダイン seed 25004 turn 9

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_right / score 156.2 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は39点差で見送り
- predicted damage: no shield 5, with shield 3
- actual: contacts 2, damage 5, removed true, converted true
- board: PF:デスシープ Lv1 HP5 / PF:ホロウダイン Lv1 HP5 / PB:オーパス Lv1 HP4 / PB:ラオン Lv1 HP5 prep / CF:神斬丸 Lv1 HP5 / CF:フーヨウ Lv2 HP3 / CB:ロブーン Lv1 HP1 / CB:真勇者ダイン Lv1 HP6 prep

### no_contact_no_conversion: アーシュ＆ロロ seed 25005 turn 12

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_left / score 115.6 / 致死圏の味方を守れるためシールド
- predicted damage: no shield 3, with shield 2
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:アーシュ＆ロロ Lv1 HP2 / CF:ホロウダイン Lv1 HP5 / CF:ヒートロン Lv2 HP3 / CB:グングニエル Lv1 HP5 / CB:フーヨウ Lv1 HP3

### no_contact_no_conversion: アーシュ＆ロロ seed 25005 turn 13

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_left / score 67.6 / 倒されそうな高価値味方を守るためシールド
- predicted damage: no shield 3, with shield 2
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:アーシュ＆ロロ Lv1 HP2 / CF:ホロウダイン Lv1 HP5 / CF:ヒートロン Lv2 HP3 / CB:グングニエル Lv1 HP5 / CB:フーヨウ Lv1 HP3

### no_contact_no_conversion: ドノマンティス seed 25006 turn 9

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_left / score 74.3 / 次ターンのレベルアップ筋を残すためシールド
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ゾンビ Lv1 HP2 / PF:ファントム Lv1 HP5 / PB:ホロウダイン Lv1 HP5 / PB:フーヨウ Lv1 HP3 / CF:ドノマンティス Lv1 HP5 / CF:ラオン Lv2 HP5 / CB:オーパス Lv1 HP4

### master_attack_only_pressure: ラオン seed 25009 turn 6

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, win)
- decision: cpu_front_right / score 56.3 / 高価値の味方を守るためシールド
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted true
- board: PF:ガンプ Lv1 HP5 prep / CF:ボムゾウ Lv2 HP2 shield / CF:ラオン Lv2 HP3 / CB:ボムゾウ Lv1 HP6 / CB:マッド・ダミー Lv1 HP3

### front_back_role_shield_then_retreat: ピグミィ seed 25018 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_pressure` (cpu, loss)
- decision: cpu_front_left / score 57.4 / 高価値の味方を守るためシールド / 見送り: マスター特技は3点差で見送り、ためるは4点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:グングニエル Lv1 HP5 prep / PF:ナッツロックル Lv1 HP5 / CF:ピグミィ Lv2 HP3 / CF:ラオン Lv1 HP5 / CB:ピグミィ Lv1 HP3 / CB:オヤコダケ Lv2 HP2

### front_back_role_shield_then_retreat: ピグミィ seed 25021 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_pressure` (cpu, loss)
- decision: cpu_front_left / score 114.5 / 致死圏の味方を守れるためシールド / 見送り: 召喚は59点差で見送り、移動は104点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 0, damage 0, removed false, converted true
- board: PF:真勇者ダイン Lv2 HP6 / PF:アンノウン Lv1 HP5 / PB:バルキャノン Lv1 HP3 / PB:ラティーヌ Lv1 HP4 prep / CF:ピグミィ Lv1 HP2 / CF:ラオン Lv1 HP5 / CB:ラオン Lv1 HP5

### master_attack_only_pressure: デスシープ seed 25023 turn 6

- variant/opponent: `pressure_white_baseline` vs `black_pressure_pressure` (cpu, loss)
- decision: cpu_front_right / score 113.5 / 致死圏の味方を守れるためシールド
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted false
- board: PB:ホロウダイン Lv1 HP5 prep / CF:アーシュ＆ロロ Lv2 HP3 / CF:デスシープ Lv1 HP2 / CB:神斬丸 Lv2 HP5 / CB:オヤコダケ Lv2 HP2

### front_back_role_shield_then_retreat: ピグミィ seed 25025 turn 5

- variant/opponent: `pressure_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_front_left / score 119 / 致死圏の味方を守れるためシールド / 見送り: 移動は62点差で見送り、移動は80点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:ピグミィ Lv2 HP2 / PF:ホロウダイン Lv1 HP5 / PB:オーパス Lv1 HP4 / PB:ラオン Lv1 HP5 / CF:神斬丸 Lv1 HP5 / CF:グングニエル Lv1 HP5 / CB:真勇者ダイン Lv1 HP6 prep / CB:ガンプ Lv1 HP5

### front_back_role_shield_then_retreat: ピグミィ seed 25029 turn 7

- variant/opponent: `pressure_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_front_right / score 120.1 / 致死圏の味方を守れるためシールド / 見送り: 移動は39点差で見送り、攻撃は101点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:オーパス Lv1 HP4 / PF:ピグミィ Lv2 HP3 / CF:バルキャノン Lv1 HP3 / CF:ヒートロン Lv2 HP5 / CB:フーヨウ Lv1 HP1 / CB:バルキャノン Lv1 HP3 prep

### front_back_role_shield_then_retreat: ピグミィ seed 25029 turn 8

- variant/opponent: `pressure_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_front_left / score 120.1 / 致死圏の味方を守れるためシールド / 見送り: 移動は9点差で見送り、マスター特技は20点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 1, removed false, converted true
- board: PF:ピグミィ Lv2 HP3 / PF:アーシュ＆ロロ Lv1 HP5 / PB:ラオン Lv1 HP5 / CF:バルキャノン Lv1 HP3 / CF:ヒートロン Lv2 HP5 / CB:バルキャノン Lv1 HP3

### master_attack_only_pressure: ピグミィ seed 25029 turn 8

- variant/opponent: `pressure_white_baseline` vs `decoy_back_stable` (player, win)
- decision: player_front_left / score 120.1 / 致死圏の味方を守れるためシールド / 見送り: 移動は9点差で見送り、マスター特技は20点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 1, removed false, converted true
- board: PF:ピグミィ Lv2 HP3 / PF:アーシュ＆ロロ Lv1 HP5 / PB:ラオン Lv1 HP5 / CF:バルキャノン Lv1 HP3 / CF:ヒートロン Lv2 HP5 / CB:バルキャノン Lv1 HP3

### predicted_no_pressure: オヤコダケ seed 25043 turn 2

- variant/opponent: `pressure_white_shield_quality_second_guard_v1` vs `black_pressure_strong` (cpu, win)
- decision: cpu_back_left / score 42.1 / 次ターンのレベルアップ筋を残すためシールド / 見送り: 召喚は10点差で見送り、召喚は14点差で見送り
- predicted damage: no shield 0, with shield 0
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:グングニエル Lv1 HP3 / PF:ヒートロン Lv1 HP3 / PB:フーヨウ Lv1 HP2 / CF:ホロウダイン Lv1 HP5 / CF:ドノマンティス Lv1 HP5 / CB:オヤコダケ Lv1 HP2

### predicted_no_pressure: ピグミィ seed 25049 turn 9

- variant/opponent: `pressure_white_shield_quality_second_guard_v1` vs `black_pressure_pressure` (player, loss)
- decision: player_back_left / score 44.4 / 次ターンのレベルアップ筋を残すためシールド
- predicted damage: no shield 0, with shield 0
- actual: contacts 0, damage 0, removed false, converted true
- board: PF:デスシープ Lv1 HP6 shield / PF:ラオン Lv2 HP5 / PB:ピグミィ Lv1 HP3 / PB:ピグミィ Lv2 HP3 / CF:ゾンビ Lv1 HP1 / CF:ヒートロン Lv1 HP4 / CB:ビヨンド Lv1 HP2 prep / CB:ヒートロン Lv1 HP5

### predicted_no_pressure: ピグミィ seed 25049 turn 10

- variant/opponent: `pressure_white_shield_quality_second_guard_v1` vs `black_pressure_pressure` (player, loss)
- decision: player_back_left / score 44.4 / 次ターンのレベルアップ筋を残すためシールド
- predicted damage: no shield 0, with shield 0
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:デスシープ Lv1 HP6 shield / PF:ピグミィ Lv2 HP3 shield / PB:ピグミィ Lv1 HP3 / CF:ゾンビ Lv1 HP1 / CF:ヒートロン Lv2 HP5 / CB:ヒートロン Lv1 HP5

### master_attack_only_pressure: マッド・ダミー seed 25051 turn 11

- variant/opponent: `pressure_white_shield_quality_second_guard_v1` vs `black_pressure_pressure` (player, loss)
- decision: player_front_left / score 62.2 / 倒されそうな高価値味方を守るためシールド
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:マッド・ダミー Lv1 HP3 / PF:ラッフィー Lv1 HP5 / PB:ピグミィ Lv2 HP3 / CF:グングニエル Lv1 HP5 prep

### master_attack_only_pressure: 真勇者ダイン seed 25054 turn 4

- variant/opponent: `pressure_white_shield_quality_second_guard_v1` vs `black_pressure_pressure` (cpu, win)
- decision: cpu_front_left / score 59.5 / 高価値の味方を守るためシールド / 見送り: マスター特技は3点差で見送り、マスター特技は5点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted true
- board: PB:ヒートロン Lv1 HP5 prep / CF:真勇者ダイン Lv2 HP6 / CF:アーシュ＆ロロ Lv2 HP3 / CB:マッド・ダミー Lv1 HP3 / CB:アーシュ＆ロロ Lv1 HP5 prep

### master_attack_only_pressure: マッド・ダミー seed 25058 turn 5

- variant/opponent: `pressure_white_shield_quality_second_guard_v1` vs `black_pressure_pressure` (cpu, loss)
- decision: cpu_front_right / score 62.2 / 倒されそうな高価値味方を守るためシールド
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:グングニエル Lv1 HP5 / PB:ヒートロン Lv1 HP5 / PB:ファントム Lv1 HP5 prep / CF:ホロウダイン Lv2 HP5 / CF:マッド・ダミー Lv1 HP3 / CB:ドノマンティス Lv1 HP5

### predicted_no_pressure: ホロウダイン seed 25061 turn 15

- variant/opponent: `pressure_white_shield_quality_second_guard_v1` vs `decoy_back_stable` (player, win)
- decision: player_front_left / score 72.2 / 次ターンのレベルアップ筋を残すためシールド / 見送り: マスター特技は31点差で見送り、攻撃は123点差で見送り
- predicted damage: no shield 0, with shield 0
- actual: contacts 0, damage 0, removed false, converted true
- board: PF:ホロウダイン Lv1 HP3 / PF:ラオン Lv1 HP5 / PB:マッド・ダミー Lv1 HP3 / PB:オーパス Lv1 HP4 / CF:バルキャノン Lv1 HP1 / CF:ナッツロックル Lv1 HP5 / CB:ラティーヌ Lv1 HP4

### predicted_no_pressure: ピグミィ seed 25086 turn 7

- variant/opponent: `pressure_white_shield_breakthrough_guard_plus20_v1` vs `black_pressure_pressure` (player, loss)
- decision: player_back_left / score 34.2 / 高価値の味方を守るためシールド
- predicted damage: no shield 0, with shield 0
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:デスシープ Lv1 HP6 / PF:オヤコダケ Lv2 HP2 shield / PB:ピグミィ Lv2 HP3 / PB:オーパス Lv1 HP4 / CF:ガンプ Lv1 HP5 prep


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
