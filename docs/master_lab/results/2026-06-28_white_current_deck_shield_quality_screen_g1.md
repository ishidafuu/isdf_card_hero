# Shield Usage Audit Loop 1

生成: 2026-06-28T01:00:38.811Z
候補: current_white_baseline, current_shield_no_pressure8, current_shield_breakthrough12
相手: black_1375_pressure, white_current_mirror
試行: 1 games/matchup/direction
総試合: 12

## Purpose

シールドAIを直接いじらず、まずシールドの使い方だけを再検証する。特に「守る価値があるから貼る」ではなく、「貼ることで相手に追加手数/追加コストを払わせたか」「次ターンの仕事へ変換されたか」を見る。

## Summary

- シールド使用: 87
- 予測上ノープレッシャー: 4 (4.6%)
- マスターアタック込み対象: 42 (48.3%)
- 1接触で除去: 13 (14.9%)
- 接触なし/成果化なし: 26 (29.9%)
- 次ターン成果化: 48 (55.2%)
- 前衛後衛ロールを盾して同ターン後退: 0 (0%)

## Variant Metrics

| Variant | W-L-D | Shield | Pred No Pressure | MA Available | MA Only | MA Changes Lethal | Avg Pred No/With | Preserved | Extra Action Proxy | 1 Contact Removed | No Contact No Conv | Converted | Retreat | Front Back Retreat | Low Stone | 2nd Shield Low | Lethal Reason Removed |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 3-1-0 | 35 | 2<br>5.7% | 19<br>54.3% | 4<br>11.4% | 8<br>22.9% | 2.9/1.5 | 24<br>68.6% | 3<br>8.6% | 6<br>17.1% | 13<br>37.1% | 16<br>45.7% | 0<br>0% | 0<br>0% | 19<br>54.3% | 0/2 | 3<br>8.6% |
| current_shield_breakthrough12 | 1-3-0 | 27 | 1<br>3.7% | 11<br>40.7% | 1<br>3.7% | 2<br>7.4% | 2.6/1.3 | 20<br>74.1% | 2<br>7.4% | 4<br>14.8% | 8<br>29.6% | 15<br>55.6% | 0<br>0% | 0<br>0% | 7<br>25.9% | 0/2 | 4<br>14.8% |
| current_shield_no_pressure8 | 3-1-0 | 25 | 1<br>4% | 12<br>48% | 0<br>0% | 6<br>24% | 3.1/1.7 | 18<br>72% | 3<br>12% | 3<br>12% | 5<br>20% | 17<br>68% | 0<br>0% | 0<br>0% | 13<br>52% | 0/1 | 1<br>4% |

## Samples

### no_contact_no_conversion: ボムゾウ seed 84100 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, win)
- decision: player_front_left / score 55 / 高価値の味方を守るためシールド / 見送り: マスター特技は23点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ボムゾウ Lv1 HP6 / PF:ポリスピナー Lv1 HP3 / PB:ピグミィ Lv1 HP3 / PB:真勇者ダイン Lv1 HP6 prep / CF:真勇者ダイン Lv1 HP6 prep / CF:ナッツロックル Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### single_contact_removed: ポリスピナー seed 84100 turn 14

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, win)
- decision: player_front_left / score 72.1 / 倒されそうな高価値味方を守るためシールド
- predicted damage: no shield 4, with shield 2
- actual: contacts 1, damage 1, removed true, converted false
- board: PF:ポリスピナー Lv2 HP1 / PF:デスシープ Lv2 HP5 / PB:ドノマンティス Lv1 HP5 / PB:デスシープ Lv1 HP5 / CF:ユニフォーン Lv1 HP4 / CF:ボムゾウ Lv1 HP3 / CB:ユニフォーン Lv1 HP5 prep / CB:ヤンバル Lv1 HP3

### lethal_reason_still_removed: ポリスピナー seed 84100 turn 14

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, win)
- decision: player_front_left / score 72.1 / 倒されそうな高価値味方を守るためシールド
- predicted damage: no shield 4, with shield 2
- actual: contacts 1, damage 1, removed true, converted false
- board: PF:ポリスピナー Lv2 HP1 / PF:デスシープ Lv2 HP5 / PB:ドノマンティス Lv1 HP5 / PB:デスシープ Lv1 HP5 / CF:ユニフォーン Lv1 HP4 / CF:ボムゾウ Lv1 HP3 / CB:ユニフォーン Lv1 HP5 prep / CB:ヤンバル Lv1 HP3

### predicted_no_pressure: ヤンバル seed 84101 turn 5

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / score 28.8 / 高価値の味方を守るためシールド / 見送り: マスター特技は54点差で見送り
- predicted damage: no shield 0, with shield 0
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ユニフォーン Lv1 HP5 prep / PB:ピグミィ Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv2 HP4 / CB:ヤンバル Lv2 HP3 / CB:ピグミィ Lv1 HP3

### single_contact_removed: ヤンバル seed 84101 turn 5

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / score 28.8 / 高価値の味方を守るためシールド / 見送り: マスター特技は54点差で見送り
- predicted damage: no shield 0, with shield 0
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ユニフォーン Lv1 HP5 prep / PB:ピグミィ Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv2 HP4 / CB:ヤンバル Lv2 HP3 / CB:ピグミィ Lv1 HP3

### no_contact_no_conversion: ヤンバル seed 84101 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_front_left / score 52 / 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: CF:ヤンバル Lv2 HP3 / CF:ヤンバル Lv2 HP3

### master_attack_only_pressure: ヤンバル seed 84101 turn 7

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_front_left / score 52 / 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: CF:ヤンバル Lv2 HP3 / CF:ヤンバル Lv2 HP3

### single_contact_removed: ヤンバル seed 84101 turn 8

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / score 122.6 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は239点差で見送り
- predicted damage: no shield 1, with shield 0
- actual: contacts 1, damage 1, removed true, converted false
- board: PF:ボムゾウ Lv1 HP6 prep / PF:真勇者ダイン Lv1 HP6 prep / CF:デスシープ Lv1 HP6 prep / CB:ヤンバル Lv2 HP1 / CB:ヤンバル Lv2 HP3

### lethal_reason_still_removed: ヤンバル seed 84101 turn 8

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_back_left / score 122.6 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は239点差で見送り
- predicted damage: no shield 1, with shield 0
- actual: contacts 1, damage 1, removed true, converted false
- board: PF:ボムゾウ Lv1 HP6 prep / PF:真勇者ダイン Lv1 HP6 prep / CF:デスシープ Lv1 HP6 prep / CB:ヤンバル Lv2 HP1 / CB:ヤンバル Lv2 HP3

### single_contact_removed: 真勇者ダイン seed 84101 turn 12

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_front_left / score 80.9 / 倒されそうな高価値味方を守るためシールド
- predicted damage: no shield 4, with shield 2
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:ユニフォーン Lv1 HP5 prep / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv3 HP2 / CF:デスシープ Lv2 HP6 / CB:デスシープ Lv1 HP6 / CB:ポリスピナー Lv1 HP3

### lethal_reason_still_removed: 真勇者ダイン seed 84101 turn 12

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, win)
- decision: cpu_front_left / score 80.9 / 倒されそうな高価値味方を守るためシールド
- predicted damage: no shield 4, with shield 2
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:ユニフォーン Lv1 HP5 prep / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv3 HP2 / CF:デスシープ Lv2 HP6 / CB:デスシープ Lv1 HP6 / CB:ポリスピナー Lv1 HP3

### single_contact_removed: 真勇者ダイン seed 84102 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, loss)
- decision: player_front_left / score 55 / 高価値の味方を守るためシールド / 見送り: マスター特技は1点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 6, removed true, converted true
- board: PF:真勇者ダイン Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ヤンバル Lv1 HP3 prep / CF:真勇者ダイン Lv1 HP6 prep / CB:ヤンバル Lv1 HP3 prep / CB:ヤンバル Lv1 HP3 prep

### single_contact_removed: 真勇者ダイン seed 84102 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, loss)
- decision: player_front_left / score 59.5 / 高価値の味方を守るためシールド / 見送り: マスター特技は73点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 6, removed true, converted false
- board: PF:真勇者ダイン Lv2 HP6 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 / CB:ヤンバル Lv1 HP3

### no_contact_no_conversion: デスシープ seed 84102 turn 9

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, loss)
- decision: player_front_left / score 59.5 / 高価値の味方を守るためシールド
- predicted damage: no shield 5, with shield 3
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:デスシープ Lv2 HP6 / CB:ボムゾウ Lv1 HP6 prep / CB:ヤンバル Lv2 HP3

### no_contact_no_conversion: ボムゾウ seed 84102 turn 15

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, loss)
- decision: player_front_right / score 117.8 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は45点差で見送り
- predicted damage: no shield 6, with shield 4
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ポリスピナー Lv2 HP3 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:ドノマンティス Lv2 HP5 / CB:ボムゾウ Lv1 HP6

### second_shield_same_turn: ポリスピナー seed 84102 turn 15

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, loss)
- decision: player_front_left / score 122.3 / 致死圏の味方を守れるためシールド
- predicted damage: no shield 3, with shield 1
- actual: contacts 0, damage 0, removed false, converted true
- board: PF:ポリスピナー Lv2 HP3 / PF:ボムゾウ Lv1 HP6 shield / PB:ヤンバル Lv1 HP3 / CF:ドノマンティス Lv2 HP5 / CB:ボムゾウ Lv1 HP6

### no_contact_no_conversion: ボムゾウ seed 84102 turn 16

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, loss)
- decision: player_front_right / score 119.9 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は51点差で見送り
- predicted damage: no shield 6, with shield 4
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ポリスピナー Lv2 HP3 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:ドノマンティス Lv2 HP5 / CB:ボムゾウ Lv1 HP6

### second_shield_same_turn: ポリスピナー seed 84102 turn 16

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, loss)
- decision: player_front_left / score 122.3 / 致死圏の味方を守れるためシールド
- predicted damage: no shield 3, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ポリスピナー Lv2 HP3 / PF:ボムゾウ Lv1 HP6 shield / PB:ヤンバル Lv1 HP3 / CF:ドノマンティス Lv2 HP5 / CB:ボムゾウ Lv1 HP6

### no_contact_no_conversion: ポリスピナー seed 84102 turn 16

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, loss)
- decision: player_front_left / score 122.3 / 致死圏の味方を守れるためシールド
- predicted damage: no shield 3, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ポリスピナー Lv2 HP3 / PF:ボムゾウ Lv1 HP6 shield / PB:ヤンバル Lv1 HP3 / CF:ドノマンティス Lv2 HP5 / CB:ボムゾウ Lv1 HP6

### master_attack_only_pressure: ヤンバル seed 84103 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, win)
- decision: cpu_front_left / score 44.2 / 高価値の味方を守るためシールド / 見送り: マスター特技は20点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: CF:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 prep / CB:ピグミィ Lv2 HP3 / CB:ボムゾウ Lv2 HP5

### master_attack_only_pressure: デスシープ seed 84103 turn 7

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, win)
- decision: cpu_front_right / score 55 / 高価値の味方を守るためシールド / 見送り: マスター特技は4点差で見送り、マスター特技は33点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted true
- board: PB:真勇者ダイン Lv1 HP6 prep / CF:ボムゾウ Lv2 HP5 / CF:デスシープ Lv1 HP6 / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3

### master_attack_only_pressure: ボムゾウ seed 84103 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, win)
- decision: cpu_front_left / score 121.2 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は253点差で見送り、マスター特技は289点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ドノマンティス Lv1 HP5 prep / CF:ボムゾウ Lv2 HP2 / CF:デスシープ Lv1 HP6 / CB:ピグミィ Lv2 HP3 / CB:ヤンバル Lv1 HP3

### predicted_no_pressure: ピグミィ seed 84103 turn 10

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, win)
- decision: cpu_back_right / score 32 / 高価値の味方を守るためシールド / 見送り: マスター特技は372点差で見送り
- predicted damage: no shield 0, with shield 0
- actual: contacts 0, damage 0, removed false, converted true
- board: PF:ドノマンティス Lv2 HP5 / PB:ポリスピナー Lv1 HP3 prep / CF:ポリスピナー Lv1 HP3 prep / CF:ポリスピナー Lv1 HP3 prep / CB:ピグミィ Lv1 HP3 / CB:ピグミィ Lv2 HP3

### predicted_no_pressure: ピグミィ seed 84104 turn 4

- variant/opponent: `current_shield_no_pressure8` vs `black_1375_pressure` (player, win)
- decision: player_back_left / score 28.8 / 高価値の味方を守るためシールド / 見送り: マスター特技は34点差で見送り、マスター特技は34点差で見送り
- predicted damage: no shield 0, with shield 0
- actual: contacts 1, damage 3, removed true, converted true
- board: PF:デスシープ Lv1 HP6 / PF:ヤンバル Lv2 HP3 / PB:ピグミィ Lv2 HP3 / PB:真勇者ダイン Lv1 HP6 prep / CF:ポリスピナー Lv1 HP3 prep / CB:ヤンバル Lv1 HP3 prep

### second_shield_same_turn: 真勇者ダイン seed 84105 turn 7

- variant/opponent: `current_shield_no_pressure8` vs `black_1375_pressure` (cpu, win)
- decision: cpu_front_right / score 67.3 / 高価値の味方を守るためシールド
- predicted damage: no shield 3, with shield 1
- actual: contacts 0, damage 0, removed false, converted true
- board: PF:ヤミー Lv1 HP5 prep / PB:ピグミィ Lv1 HP3 / CF:真勇者ダイン Lv1 HP4 shield / CF:真勇者ダイン Lv3 HP6 / CB:ボムゾウ Lv1 HP6 / CB:デスシープ Lv1 HP6

### lethal_reason_still_removed: ヤンバル seed 84106 turn 16

- variant/opponent: `current_shield_no_pressure8` vs `white_current_mirror` (player, win)
- decision: player_front_left / score 62.2 / 倒されそうな高価値味方を守るためシールド / 見送り: マスター特技は90点差で見送り
- predicted damage: no shield 4, with shield 2
- actual: contacts 2, damage 3, removed true, converted false
- board: PF:ヤンバル Lv1 HP3 / PF:デスシープ Lv2 HP6 / PB:ピグミィ Lv1 HP3 / CF:ボムゾウ Lv1 HP6 shield / CB:ピグミィ Lv2 HP3 / CB:ピグミィ Lv2 HP3

### lethal_reason_still_removed: ボムゾウ seed 84108 turn 4

- variant/opponent: `current_shield_breakthrough12` vs `black_1375_pressure` (player, loss)
- decision: player_front_left / score 121.2 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は237点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted true
- board: PF:ボムゾウ Lv2 HP2 / PF:ボムゾウ Lv2 HP5 / PB:ヤンバル Lv1 HP3 / PB:真勇者ダイン Lv1 HP6 / CB:ヤンバル Lv1 HP3 prep / CB:ピグミィ Lv1 HP3

### lethal_reason_still_removed: ボムゾウ seed 84108 turn 5

- variant/opponent: `current_shield_breakthrough12` vs `black_1375_pressure` (player, loss)
- decision: player_front_left / score 121.2 / 致死圏の味方を守れるためシールド / 見送り: マスター特技は166点差で見送り、マスター特技は194点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 1, damage 2, removed true, converted false
- board: PF:ボムゾウ Lv2 HP2 / PF:真勇者ダイン Lv1 HP6 / PB:ヤンバル Lv2 HP3 / CF:ヤミー Lv1 HP5 prep / CB:ヤンバル Lv1 HP3 prep / CB:ヤンバル Lv1 HP3

### second_shield_same_turn: ピグミィ seed 84109 turn 11

- variant/opponent: `current_shield_breakthrough12` vs `black_1375_pressure` (cpu, win)
- decision: cpu_front_left / score 120.1 / 致死圏の味方を守れるためシールド
- predicted damage: no shield 3, with shield 1
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:ユニフォーン Lv1 HP5 / PB:ピグミィ Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ピグミィ Lv2 HP3 / CF:デスシープ Lv2 HP3 shield

### master_attack_only_pressure: デスシープ seed 84110 turn 9

- variant/opponent: `current_shield_breakthrough12` vs `white_current_mirror` (player, loss)
- decision: player_front_right / score 59.5 / 高価値の味方を守るためシールド / 見送り: マスター特技は32点差で見送り
- predicted damage: no shield 2, with shield 1
- actual: contacts 0, damage 0, removed false, converted true
- board: PF:ボムゾウ Lv1 HP6 prep / PF:デスシープ Lv2 HP6 / PB:ピグミィ Lv2 HP3 / PB:ヤンバル Lv1 HP3 / CF:ピグミィ Lv1 HP3 / CB:デスシープ Lv1 HP6 / CB:ドノマンティス Lv1 HP5

### second_shield_same_turn: ピグミィ seed 84111 turn 6

- variant/opponent: `current_shield_breakthrough12` vs `white_current_mirror` (cpu, loss)
- decision: cpu_back_left / score 58.8 / 高価値の味方を守るためシールド
- predicted damage: no shield 1, with shield 0
- actual: contacts 1, damage 3, removed true, converted false
- board: PF:ボムゾウ Lv1 HP6 / PF:ボムゾウ Lv1 HP4 shield / PB:ピグミィ Lv1 HP3 / CF:ヤンバル Lv2 HP3 shield / CB:ピグミィ Lv2 HP3

### predicted_no_pressure: ピグミィ seed 84111 turn 15

- variant/opponent: `current_shield_breakthrough12` vs `white_current_mirror` (cpu, loss)
- decision: cpu_back_right / score 32 / 高価値の味方を守るためシールド / 見送り: マスター特技は218点差で見送り
- predicted damage: no shield 0, with shield 0
- actual: contacts 0, damage 0, removed false, converted false
- board: PF:デスシープ Lv1 HP6 / PB:ピグミィ Lv1 HP3 / PB:真勇者ダイン Lv1 HP6 / CF:ポリスピナー Lv1 HP3 prep / CB:ピグミィ Lv2 HP3


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
- 次の比較軸は `current_shield_no_pressure8` を基準にし、ノープレッシャー率と1接触除去率を落とせるかを見る。
