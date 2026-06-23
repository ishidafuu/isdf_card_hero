# Shield Usage Audit Loop 1

生成: 2026-06-23T08:32:26.577Z
候補: pressure_white_baseline
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable
試行: 4 games/matchup/direction
総試合: 24

## Purpose

シールドAIを直接いじらず、まずシールドの使い方だけを再検証する。特に「守る価値があるから貼る」ではなく、「貼ることで相手に追加手数/追加コストを払わせたか」「次ターンの仕事へ変換されたか」を見る。

## Summary

- シールド使用: 101
- 予測上ノープレッシャー: 1 (1%)
- マスターアタック込み対象: 21 (20.8%)
- 1接触で除去: 22 (21.8%)
- 接触なし/成果化なし: 28 (27.7%)
- 次ターン成果化: 42 (41.6%)
- 前衛後衛ロールを盾して同ターン後退: 3 (3%)

## Variant Metrics

| Variant | W-L-D | Shield | Pred No Pressure | MA Available | MA Only | MA Changes Lethal | Avg Pred No/With | Preserved | Extra Action Proxy | 1 Contact Removed | No Contact No Conv | Converted | Retreat | Front Back Retreat | Low Stone | 2nd Shield Low | Lethal Reason Removed |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pressure_white_baseline | 10-14-0 | 101 | 1<br>1% | 21<br>20.8% | 1<br>1% | 11<br>10.9% | 2.8/1.6 | 62<br>61.4% | 15<br>14.9% | 22<br>21.8% | 28<br>27.7% | 42<br>41.6% | 3<br>3% | 3<br>3% | 37<br>36.6% | 3/6 | 26<br>25.7% |

## Samples

### single_contact_removed: ボムゾウ seed 28300 turn 3

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_right / score 57.2 / 高価値の味方を守るためシールド / 見送り: 攻撃は37点差で見送り、マスター特技は66点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:ホロウダイン Lv1 HP5 / PF:ボムゾウ Lv1 HP6 / PB:オヤコダケ Lv1 HP2 / PB:アサシン Lv1 HP4 / CF:真勇者ダイン Lv1 HP6 / CF:ナッツロックル Lv1 HP5 / CB:ヒートロン Lv1 HP5 / CB:アンノウン Lv1 HP5 prep

### no_contact_no_conversion: ラオン seed 28301 turn 3

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_back_left / score 52.5 / 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り、マスター特技は8点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:真勇者ダイン Lv1 HP6 / PF:ラオン Lv1 HP5 / PB:ラオン Lv1 HP5 / PB:ホロウダイン Lv1 HP5 / CF:神斬丸 Lv1 HP5 / CF:神斬丸 Lv1 HP5 prep / CB:ビヨンド Lv1 HP1

### lethal_reason_still_removed: ラオン seed 28301 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_right / score 116.7 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は13点差で見送り、攻撃は23点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 2, damage 3, removed true, converted true
- board: PF:真勇者ダイン Lv1 HP6 / PF:ラオン Lv1 HP3 / PB:ラオン Lv1 HP5 / PB:ホロウダイン Lv1 HP5 / CF:神斬丸 Lv1 HP4 / CF:神斬丸 Lv1 HP5 / CB:ビヨンド Lv1 HP1 / CB:ゼック Lv1 HP2 prep

### lethal_reason_still_removed: ラオン seed 28301 turn 5

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_right / score 114.5 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は71点差で見送り、マスター特技は79点差で見送り
- predicted damage: no shield 4, with shield 2
- actual: contacts 2, damage 3, removed true, converted false
- board: PF:真勇者ダイン Lv1 HP6 / PF:ラオン Lv1 HP3 / PB:ラオン Lv1 HP5 / PB:ホロウダイン Lv1 HP5 / CF:神斬丸 Lv1 HP5 shield / CB:ビヨンド Lv1 HP1 shield / CB:ゼック Lv1 HP2

### no_contact_no_conversion: ホロウダイン seed 28301 turn 6

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, loss)
- decision: player_front_right / score 116.7 / 致死圏の味方を守れるためシールド
- predicted damage: no shield 5, with shield 3
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:真勇者ダイン Lv1 HP6 / PF:ホロウダイン Lv1 HP5 / PB:ラオン Lv1 HP5 / CF:神斬丸 Lv2 HP5 / CB:ゼック Lv1 HP1

### single_contact_removed: マッド・ダミー seed 28303 turn 3

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_back_left / score 56.5 / 高価値の味方を守るためシールド / 見送り: マスター特技は14点差で見送り、マスター特技は15点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:アサシン Lv1 HP4 / PF:アーシュ＆ロロ Lv1 HP5 / PB:マッド・ダミー Lv1 HP3 / PB:ホロウダイン Lv1 HP5 prep / CF:ゾンビ Lv1 HP4 / CB:ラティーヌ Lv1 HP4 / CB:フーヨウ Lv1 HP3 prep

### no_contact_no_conversion: ドノマンティス seed 28303 turn 6

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_front_left / score 79.6 / 次ターンのレベルアップ筋を残すためシールド / 見送り: 攻撃は23点差で見送り、マスター特技は84点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ドノマンティス Lv1 HP5 / PF:アーシュ＆ロロ Lv2 HP5 / PB:デスシープ Lv1 HP6 / PB:ホロウダイン Lv1 HP5 / CF:ゾンビ Lv2 HP2 / CF:ラティーヌ Lv1 HP4 / CB:バルキャノン Lv1 HP3 / CB:ヴァルテル Lv1 HP1 prep

### low_stone_second_shield: アーシュ＆ロロ seed 28303 turn 6

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (player, win)
- decision: player_front_right / score 58.4 / 高価値の味方を守るためシールド / 見送り: マスター特技は188点差で見送り、マスター特技は189点差で見送り
- predicted damage: no shield 4, with shield 2
- actual: contacts 1, damage 1, removed false, converted true
- board: PF:ドノマンティス Lv1 HP5 shield / PF:アーシュ＆ロロ Lv2 HP5 / PB:デスシープ Lv1 HP6 / PB:ホロウダイン Lv1 HP5 / CF:ゾンビ Lv2 HP2 / CF:ラティーヌ Lv1 HP4 / CB:バルキャノン Lv1 HP3 / CB:ヴァルテル Lv1 HP1 prep

### single_contact_removed: オヤコダケ seed 28304 turn 5

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, win)
- decision: cpu_front_right / score 116.9 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は86点差で見送り、マスター特技は146点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:ゾンビ Lv2 HP4 / PB:バルキャノン Lv1 HP3 / CF:ホロウダイン Lv3 HP5 / CF:オヤコダケ Lv2 HP2 / CB:ピグミィ Lv1 HP3 / CB:真勇者ダイン Lv1 HP6 prep

### lethal_reason_still_removed: オヤコダケ seed 28304 turn 5

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, win)
- decision: cpu_front_right / score 116.9 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は86点差で見送り、マスター特技は146点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:ゾンビ Lv2 HP4 / PB:バルキャノン Lv1 HP3 / CF:ホロウダイン Lv3 HP5 / CF:オヤコダケ Lv2 HP2 / CB:ピグミィ Lv1 HP3 / CB:真勇者ダイン Lv1 HP6 prep

### single_contact_removed: マッド・ダミー seed 28305 turn 5

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_right / score 110.2 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は56点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 1, removed true, converted false
- board: PF:ゾンビ Lv1 HP4 / CF:マッド・ダミー Lv1 HP1

### lethal_reason_still_removed: マッド・ダミー seed 28305 turn 5

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_right / score 110.2 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は56点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 1, removed true, converted false
- board: PF:ゾンビ Lv1 HP4 / CF:マッド・ダミー Lv1 HP1

### single_contact_removed: ホロウダイン seed 28305 turn 8

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_left / score 116.7 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は51点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:真勇者ダイン Lv1 HP5 shield / PF:神斬丸 Lv1 HP5 prep / PB:フーヨウ Lv1 HP3 shield / CF:ホロウダイン Lv1 HP3

### lethal_reason_still_removed: ホロウダイン seed 28305 turn 8

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_left / score 116.7 / 致死圏の味方を守れるためシールド / 見送り: 攻撃は51点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:真勇者ダイン Lv1 HP5 shield / PF:神斬丸 Lv1 HP5 prep / PB:フーヨウ Lv1 HP3 shield / CF:ホロウダイン Lv1 HP3

### no_contact_no_conversion: マッド・ダミー seed 28306 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, win)
- decision: cpu_front_left / score 110.2 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は33点差で見送り、マスター特技は66点差で見送り
- predicted damage: no shield 4, with shield 2
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ナッツロックル Lv1 HP5 / PB:ヴァルテル Lv1 HP1 prep / PB:フーヨウ Lv1 HP3 / CF:マッド・ダミー Lv1 HP3 / CF:アーシュ＆ロロ Lv2 HP5 / CB:ボムゾウ Lv1 HP6 prep / CB:マッド・ダミー Lv1 HP3

### second_shield_same_turn: アーシュ＆ロロ seed 28306 turn 4

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, win)
- decision: cpu_front_right / score 58.4 / 高価値の味方を守るためシールド / 見送り: マスター特技は21点差で見送り、マスター特技は183点差で見送り
- predicted damage: no shield 4, with shield 2
- actual: contacts 0, damage 0, removed false, converted true
- board: PF:ナッツロックル Lv1 HP5 / PB:ヴァルテル Lv1 HP1 prep / PB:フーヨウ Lv1 HP3 / CF:マッド・ダミー Lv1 HP3 shield / CF:アーシュ＆ロロ Lv2 HP5 / CB:ボムゾウ Lv1 HP6 prep / CB:マッド・ダミー Lv1 HP3

### lethal_reason_still_removed: マッド・ダミー seed 28306 turn 5

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, win)
- decision: cpu_front_left / score 112.4 / 致死圏の味方を守れるためシールド / 見送り: 移動は10点差で見送り、移動は28点差で見送り
- predicted damage: no shield 4, with shield 2
- actual: contacts 2, damage 3, removed true, converted false
- board: PF:ナッツロックル Lv1 HP4 / PF:フーヨウ Lv1 HP3 / PB:ヴァルテル Lv1 HP1 / PB:ゼック Lv1 HP2 prep / CF:マッド・ダミー Lv1 HP3 / CF:アーシュ＆ロロ Lv2 HP5 / CB:ボムゾウ Lv1 HP6 / CB:マッド・ダミー Lv1 HP3

### low_stone_second_shield: アーシュ＆ロロ seed 28306 turn 5

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, win)
- decision: cpu_front_right / score 58.4 / 高価値の味方を守るためシールド / 見送り: 攻撃は27点差で見送り
- predicted damage: no shield 4, with shield 2
- actual: contacts 0, damage 0, removed false, converted true
- board: PF:ナッツロックル Lv1 HP4 / PF:フーヨウ Lv1 HP3 / PB:ヴァルテル Lv1 HP1 / PB:ゼック Lv1 HP2 prep / CF:マッド・ダミー Lv1 HP3 shield / CF:アーシュ＆ロロ Lv2 HP5 / CB:ボムゾウ Lv1 HP6 / CB:マッド・ダミー Lv1 HP3

### single_contact_removed: オヤコダケ seed 28307 turn 2

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_right / score 109.1 / 致死圏の味方を守れるためシールド / 見送り: 召喚は109点差で見送り、ためるは113点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:ゾンビ Lv1 HP4 / PB:フーヨウ Lv1 HP3 / CF:アーシュ＆ロロ Lv2 HP5 / CF:オヤコダケ Lv1 HP2 / CB:マッド・ダミー Lv1 HP3

### no_contact_no_conversion: ボムゾウ seed 28307 turn 3

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_right / score 73.1 / 次ターンのレベルアップ筋を残すためシールド / 見送り: 召喚は1点差で見送り、マスター特技は15点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ゾンビ Lv2 HP2 / PB:フーヨウ Lv1 HP3 / CF:アーシュ＆ロロ Lv2 HP5 / CF:ボムゾウ Lv1 HP4 / CB:マッド・ダミー Lv1 HP3

### no_contact_no_conversion: ボムゾウ seed 28307 turn 5

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_right / score 75 / 次ターンのレベルアップ筋を残すためシールド / 見送り: マスター特技は21点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ホロウダイン Lv1 HP5 / PF:ゾンビ Lv2 HP1 / PB:フーヨウ Lv1 HP3 prep / PB:フーヨウ Lv1 HP3 / CF:アーシュ＆ロロ Lv2 HP3 / CF:ボムゾウ Lv1 HP3 / CB:マッド・ダミー Lv1 HP3 / CB:ホロウダイン Lv1 HP5

### low_stone_second_shield: アーシュ＆ロロ seed 28307 turn 5

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_left / score 56.3 / 高価値の味方を守るためシールド
- predicted damage: no shield 3, with shield 2
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ホロウダイン Lv1 HP5 / PF:ゾンビ Lv2 HP1 / PB:フーヨウ Lv1 HP3 prep / PB:フーヨウ Lv1 HP3 / CF:アーシュ＆ロロ Lv2 HP3 / CF:ボムゾウ Lv1 HP3 shield / CB:マッド・ダミー Lv1 HP3 / CB:ホロウダイン Lv1 HP5

### second_shield_same_turn: ピグミィ seed 28307 turn 7

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_left / score 135.6 / 致死圏の味方を守れるためシールド / 見送り: 移動は75点差で見送り
- predicted damage: no shield 5, with shield 4
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ホロウダイン Lv3 HP4 / PF:ゾンビ Lv2 HP1 / PB:フーヨウ Lv1 HP3 / PB:フーヨウ Lv2 HP3 / CF:ピグミィ Lv1 HP3 / CF:ボムゾウ Lv1 HP3 shield / CB:ホロウダイン Lv1 HP5

### front_back_role_shield_then_retreat: ピグミィ seed 28307 turn 7

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_left / score 135.6 / 致死圏の味方を守れるためシールド / 見送り: 移動は75点差で見送り
- predicted damage: no shield 5, with shield 4
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ホロウダイン Lv3 HP4 / PF:ゾンビ Lv2 HP1 / PB:フーヨウ Lv1 HP3 / PB:フーヨウ Lv2 HP3 / CF:ピグミィ Lv1 HP3 / CF:ボムゾウ Lv1 HP3 shield / CB:ホロウダイン Lv1 HP5

### predicted_no_pressure: ピグミィ seed 28307 turn 8

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_back_left / score 42.5 / 次ターンのレベルアップ筋を残すためシールド / 見送り: マスター特技は4点差で見送り
- predicted damage: no shield 0, with shield 0
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ホロウダイン Lv3 HP4 / PF:ゾンビ Lv2 HP1 / PB:フーヨウ Lv1 HP3 / PB:フーヨウ Lv2 HP3 / CF:ボムゾウ Lv1 HP1 / CB:ピグミィ Lv1 HP3 / CB:ホロウダイン Lv1 HP5

### second_shield_same_turn: ボムゾウ seed 28307 turn 8

- variant/opponent: `pressure_white_baseline` vs `black_pressure_strong` (cpu, loss)
- decision: cpu_front_right / score 89.8 / 倒されそうな高価値味方を守るためシールド
- predicted damage: no shield 3, with shield 2
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ホロウダイン Lv3 HP4 / PF:ゾンビ Lv2 HP1 / PB:フーヨウ Lv1 HP3 / PB:フーヨウ Lv2 HP3 / CF:ボムゾウ Lv1 HP1 / CB:ピグミィ Lv1 HP3 shield / CB:ホロウダイン Lv1 HP5

### master_attack_only_pressure: 真勇者ダイン seed 28315 turn 5

- variant/opponent: `pressure_white_baseline` vs `black_pressure_pressure` (cpu, loss)
- decision: cpu_front_right / score 59.5 / 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り、マスター特技は7点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted true
- board: PB:バルキャノン Lv2 HP3 / CF:ボムゾウ Lv2 HP5 / CF:真勇者ダイン Lv2 HP6 / CB:ホロウダイン Lv1 HP5 prep / CB:ラオン Lv1 HP5 prep

### front_back_role_shield_then_retreat: ピグミィ seed 28318 turn 5

- variant/opponent: `pressure_white_baseline` vs `decoy_back_stable` (player, loss)
- decision: player_front_right / score 112.4 / 致死圏の味方を守れるためシールド / 見送り: 移動は33点差で見送り、攻撃は52点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ホロウダイン Lv1 HP5 / PF:ピグミィ Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ホロウダイン Lv1 HP4 / CF:真勇者ダイン Lv2 HP6 / CB:グングニエル Lv1 HP5 / CB:フーヨウ Lv1 HP3

### front_back_role_shield_then_retreat: キラービ seed 28322 turn 13

- variant/opponent: `pressure_white_baseline` vs `decoy_back_stable` (cpu, win)
- decision: cpu_front_right / score 111.3 / 致死圏の味方を守れるためシールド / 見送り: 移動は18点差で見送り、移動は36点差で見送り
- predicted damage: no shield 3, with shield 2
- actual: contacts 1, damage 1, removed false, converted true
- board: PF:ラティーヌ Lv1 HP4 / PF:ホロウダイン Lv1 HP5 prep / PB:バルキャノン Lv1 HP3 / PB:ヒートロン Lv1 HP5 prep / CF:アーシュ＆ロロ Lv2 HP5 / CF:キラービ Lv1 HP2 / CB:アーシュ＆ロロ Lv1 HP5


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
