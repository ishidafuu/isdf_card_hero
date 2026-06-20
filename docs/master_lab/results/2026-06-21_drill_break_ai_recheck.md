# ドリルブレイクAI再確認

- 生成日時: 2026-06-20T15:18:13.276Z
- ドリル入りデッキ再確認: 3 games/direction、4デッキ x 3相手 x 2方向 = 72 games
- 白・黒・デコイ小規模マトリクス: 6 games/pairing、代表3 variants
- 上限: 700 steps / 160 turns

## 結論

- ドリルブレイク採用は 20 回。平均マスターHP差分は 2.8、HP差分分布は 3 10, 2 6, 4 3, 1 1。
- 0差分ドリルブレイク 0、相方未行動済み 0、同ターン二重ドリル 0。今回ログ上は、修正後仕様とAI評価の大きなズレは見えていない。
- ラオン/レオンが正位置で両方行動前の機会は 35 回。そのうちドリルブレイク採用 20、別行動 15。別行動には敵モンスター処理や通常攻撃が含まれ、常にドリルへ吸われる挙動ではなかった。
- ただし小母数なので、デッキ勝率は方向性確認に留める。追加確認するなら上位/違和感ありの2デッキだけ 20-30 games/direction に増やすのがよい。

## ドリル入りデッキ勝率

| rank | deck | games | W-L-D | win% | issues |
| ---: | --- | ---: | --- | ---: | --- |
| 1 | 黒 #973 Wドラゴン&ドリルブレイク<br>submission-pro-with-rare8-black-973 | 18 | 14-4-0 | 77.8% | 0F/0W |
| 2 | 黒 #44 ラオンレオンスーパー<br>submission-pro-with-rare8-black-44 | 18 | 12-6-0 | 66.7% | 0F/0W |
| 3 | 黒 #539 黒ラオレオ<br>submission-pro-no-rare8-black-539 | 18 | 8-10-0 | 44.4% | 0F/0W |
| 4 | 白 #78 レオラオ<br>submission-pro-no-rare8-white-78 | 18 | 4-14-0 | 22.2% | 0F/1W |

## 相手別

| drill deck | opponent | games | W-L-D | win% | issues |
| --- | --- | ---: | --- | ---: | --- |
| 黒 #973 Wドラゴン&ドリルブレイク<br>submission-pro-with-rare8-black-973 | 白基準 #1339<br>submission-pro-with-rare8-white-1339 | 6 | 3-3-0 | 50% | 0F/0W |
| 黒 #973 Wドラゴン&ドリルブレイク<br>submission-pro-with-rare8-black-973 | 黒基準 #493<br>submission-pro-no-rare8-black-493 | 6 | 5-1-0 | 83.3% | 0F/0W |
| 黒 #973 Wドラゴン&ドリルブレイク<br>submission-pro-with-rare8-black-973 | デコイ 後衛安定<br>master-lab-decoy-unit-back-stable | 6 | 6-0-0 | 100% | 0F/0W |
| 黒 #44 ラオンレオンスーパー<br>submission-pro-with-rare8-black-44 | 白基準 #1339<br>submission-pro-with-rare8-white-1339 | 6 | 2-4-0 | 33.3% | 0F/0W |
| 黒 #44 ラオンレオンスーパー<br>submission-pro-with-rare8-black-44 | 黒基準 #493<br>submission-pro-no-rare8-black-493 | 6 | 5-1-0 | 83.3% | 0F/0W |
| 黒 #44 ラオンレオンスーパー<br>submission-pro-with-rare8-black-44 | デコイ 後衛安定<br>master-lab-decoy-unit-back-stable | 6 | 5-1-0 | 83.3% | 0F/0W |
| 黒 #539 黒ラオレオ<br>submission-pro-no-rare8-black-539 | 白基準 #1339<br>submission-pro-with-rare8-white-1339 | 6 | 2-4-0 | 33.3% | 0F/0W |
| 黒 #539 黒ラオレオ<br>submission-pro-no-rare8-black-539 | 黒基準 #493<br>submission-pro-no-rare8-black-493 | 6 | 1-5-0 | 16.7% | 0F/0W |
| 黒 #539 黒ラオレオ<br>submission-pro-no-rare8-black-539 | デコイ 後衛安定<br>master-lab-decoy-unit-back-stable | 6 | 5-1-0 | 83.3% | 0F/0W |
| 白 #78 レオラオ<br>submission-pro-no-rare8-white-78 | 白基準 #1339<br>submission-pro-with-rare8-white-1339 | 6 | 1-5-0 | 16.7% | 0F/0W |
| 白 #78 レオラオ<br>submission-pro-no-rare8-white-78 | 黒基準 #493<br>submission-pro-no-rare8-black-493 | 6 | 0-6-0 | 0% | 0F/0W |
| 白 #78 レオラオ<br>submission-pro-no-rare8-white-78 | デコイ 後衛安定<br>master-lab-decoy-unit-back-stable | 6 | 3-3-0 | 50% | 0F/1W |

## ラオン/レオン監査

| metric | value |
| --- | ---: |
| games | 72 |
| ラオン/レオン召喚 | 189 |
| ラオン/レオンためる | 120 |
| ラオン/レオン移動 | 33 |
| ドリルブレイク採用 | 20 |
| ドリルブレイク平均HP差分 | 2.8 |
| 0差分ドリルブレイク | 0 |
| 攻撃者未行動済み | 0 |
| 相方未行動済み | 0 |
| 同ターン二重ドリル | 0 |
| 正位置ペア行動前 | 35 |
| 正位置ペアからドリル | 20 |
| 正位置ペアから別行動 | 15 |
| 正位置ペアからターン終了 | 0 |
| 正位置ペアからためる | 0 |

- ラオン/レオン攻撃内訳: レオン:attack->master 86, ラオン:attack->master 77, ラオン:attack->monster 49, レオン:attack->monster 43, レオン:ドリルブレイク->master 20

### ドリルブレイク採用サンプル

- seed 9708 turn 6 step 53 submission-pro-with-rare8-black-973: attack:player_front_left:ドリルブレイク->master:cpu / HP 4->2 / actorSpent true / partnerSpent true
  - プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / 見送り: 攻撃は1点差で見送り、マスター特技は598点差で見送り / プレイヤーのレオン Lv1: ドリルブレイク 4P / CPUのマスターHPが2減った（ドリルブレイク）。ストーン+2
- seed 9714 turn 2 step 9 submission-pro-with-rare8-black-973: attack:player_front_left:ドリルブレイク->master:cpu / HP 10->7 / actorSpent true / partnerSpent true
  - プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / 見送り: 攻撃は113点差で見送り、攻撃は277点差で見送り / プレイヤーのレオン Lv1: ドリルブレイク 5P / CPUのマスターHPが3減った（ドリルブレイク）。ストーン+3 / 反動でレオン Lv1に1ダメージ
- seed 9717 turn 8 step 80 submission-pro-with-rare8-black-973: attack:cpu_front_left:ドリルブレイク->master:player / HP 4->0 / actorSpent true / partnerSpent true
  - CPU判断: 相手マスターを倒せるため攻撃 / 見送り: 攻撃は1998434点差で見送り、攻撃は1998698点差で見送り / CPUのレオン Lv1: ドリルブレイク 6P / プレイヤーのマスターHPが4減った（ドリルブレイク）。ストーン+4 / CPUの勝利 / 反動でレオン Lv1に1ダメージ
- seed 9720 turn 2 step 9 submission-pro-with-rare8-black-44: attack:player_front_left:ドリルブレイク->master:cpu / HP 10->7 / actorSpent true / partnerSpent true
  - プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / 見送り: 攻撃は115点差で見送り、攻撃は336点差で見送り / プレイヤーのレオン Lv1: ドリルブレイク 5P / CPUのマスターHPが3減った（ドリルブレイク）。ストーン+3 / 反動でレオン Lv1に1ダメージ
- seed 9724 turn 5 step 43 submission-pro-with-rare8-black-44: attack:player_front_left:ドリルブレイク->master:cpu / HP 6->3 / actorSpent true / partnerSpent true
  - プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / 見送り: 召喚は260点差で見送り、攻撃は284点差で見送り / プレイヤーのレオン Lv1: ドリルブレイク 5P / CPUのマスターHPが3減った（ドリルブレイク）。ストーン+3 / 反動でレオン Lv1に1ダメージ
- seed 9726 turn 6 step 54 submission-pro-with-rare8-black-44: attack:player_front_left:ドリルブレイク->master:cpu / HP 5->2 / actorSpent true / partnerSpent true
  - プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / 見送り: 攻撃は163点差で見送り、攻撃は1139点差で見送り / プレイヤーのレオン Lv1: ドリルブレイク 5P / CPUのマスターHPが3減った（ドリルブレイク）。ストーン+3 / 反動でレオン Lv1に1ダメージ
- seed 9726 turn 7 step 64 submission-pro-with-rare8-black-44: attack:player_front_left:ドリルブレイク->master:cpu / HP 2->0 / actorSpent true / partnerSpent true
  - プレイヤーAI判断: 相手マスターを倒せるため攻撃 / 見送り: 攻撃は1点差で見送り、マスター特技は1998418点差で見送り / プレイヤーのレオン Lv1: ドリルブレイク 4P / CPUのマスターHPが2減った（ドリルブレイク）。ストーン+2 / プレイヤーの勝利
- seed 9739 turn 11 step 134 submission-pro-no-rare8-black-539: attack:cpu_front_left:ドリルブレイク->master:player / HP 1->0 / actorSpent true / partnerSpent true
  - CPU判断: 相手マスターを倒せるため攻撃 / 見送り: 攻撃は1点差で見送り、マスター特技は1040068点差で見送り / CPUのレオン Lv1: ドリルブレイク 4P / プレイヤーのマスターHPが1減った（ドリルブレイク）。ストーン+1 / CPUの勝利
- seed 9741 turn 15 step 136 submission-pro-no-rare8-black-539: attack:cpu_front_left:ドリルブレイク->master:player / HP 5->1 / actorSpent true / partnerSpent true
  - CPU判断: 相手マスターへ実ダメージを与えられるため攻撃 / 見送り: 攻撃は209点差で見送り、攻撃は441点差で見送り / CPUのレオン Lv2: ドリルブレイク 6P / プレイヤーのマスターHPが4減った（ドリルブレイク）。ストーン+4 / 反動でレオン Lv2に1ダメージ
- seed 9749 turn 6 step 52 submission-pro-no-rare8-black-539: attack:player_front_left:ドリルブレイク->master:cpu / HP 8->4 / actorSpent true / partnerSpent true
  - プレイヤーAI判断: 相手マスターへ実ダメージを与えられるため攻撃 / 見送り: 攻撃は164点差で見送り、攻撃は1041点差で見送り / プレイヤーのレオン Lv2: ドリルブレイク 6P / CPUのマスターHPが4減った（ドリルブレイク）。ストーン+4 / 反動でレオン Lv2に1ダメージ

### 正位置ペアから別行動サンプル

- seed 9714 turn 2 step 8 submission-pro-with-rare8-black-973: master:berserk_power->monster:player_front_left / score 155.9
  - reason: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: マスター特技は1点差で見送り、攻撃は97点差で見送り
  - プレイヤーAI判断: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: マスター特技は1点差で見送り、攻撃は97点差で見送り / プレイヤーはレオン Lv1をバーサクパワー状態にした
- seed 9714 turn 5 step 43 submission-pro-with-rare8-black-973: attack:player_front_left:attack->monster:cpu_front_left / score 347
  - reason: 敵モンスターを撃破できるため攻撃 / 見送り: 攻撃は157点差で見送り、攻撃は157点差で見送り
  - プレイヤーAI判断: 敵モンスターを撃破できるため攻撃 / 見送り: 攻撃は157点差で見送り、攻撃は157点差で見送り / プレイヤーのレオン Lv1: アタック 2P / アタックでホロウダイン Lv1に2ダメージ / ホロウダイン Lv1は倒れ、CPUにストーン1個が戻った
- seed 9717 turn 7 step 70 submission-pro-with-rare8-black-973: master:berserk_power->monster:cpu_front_left / score 176.4
  - reason: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: マスター特技は1点差で見送り、攻撃は83点差で見送り
  - CPU判断: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: マスター特技は1点差で見送り、攻撃は83点差で見送り / CPUはレオン Lv1をバーサクパワー状態にした
- seed 9717 turn 7 step 71 submission-pro-with-rare8-black-973: attack:cpu_front_left:attack->master:player / score 42
  - reason: 相手マスターへ実ダメージを与えられるため攻撃 / 見送り: 攻撃は29点差で見送り、攻撃は82点差で見送り
  - CPUのレオン Lv1: アタック 3P / 真勇者ダイン Lv1がマスターの身代わりになった / 真勇者ダイン Lv1は気合いで1ダメージ軽減した / アタック（身代わり）で真勇者ダイン Lv1に2ダメージ / 反動でレオン Lv1に1ダメージ
- seed 9717 turn 8 step 79 submission-pro-with-rare8-black-973: master:berserk_power->monster:cpu_front_left / score 209.1
  - reason: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: マスター特技は1点差で見送り、攻撃は498779点差で見送り
  - CPU判断: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: マスター特技は1点差で見送り、攻撃は498779点差で見送り / CPUはレオン Lv1をバーサクパワー状態にした
- seed 9720 turn 2 step 8 submission-pro-with-rare8-black-44: master:berserk_power->monster:player_front_left / score 155.9
  - reason: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: マスター特技は1点差で見送り、攻撃は30点差で見送り
  - プレイヤーAI判断: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: マスター特技は1点差で見送り、攻撃は30点差で見送り / プレイヤーはレオン Lv1をバーサクパワー状態にした
- seed 9724 turn 5 step 42 submission-pro-with-rare8-black-44: master:berserk_power->monster:player_front_left / score 155.9
  - reason: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: 攻撃は4点差で見送り、召喚は278点差で見送り
  - プレイヤーAI判断: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: 攻撃は4点差で見送り、召喚は278点差で見送り / プレイヤーはレオン Lv1をバーサクパワー状態にした
- seed 9726 turn 6 step 53 submission-pro-with-rare8-black-44: master:berserk_power->monster:player_front_left / score 155.9
  - reason: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: マスター特技は3点差で見送り、攻撃は75点差で見送り
  - プレイヤーAI判断: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: マスター特技は3点差で見送り、攻撃は75点差で見送り / プレイヤーはレオン Lv1をバーサクパワー状態にした
- seed 9741 turn 15 step 135 submission-pro-no-rare8-black-539: master:berserk_power->monster:cpu_front_left / score 282.1
  - reason: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: マスター特技は1点差で見送り、攻撃は15点差で見送り
  - CPU判断: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: マスター特技は1点差で見送り、攻撃は15点差で見送り / CPUはレオン Lv2をバーサクパワー状態にした
- seed 9749 turn 6 step 51 submission-pro-no-rare8-black-539: master:berserk_power->monster:player_front_left / score 184.7
  - reason: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: マスター特技は1点差で見送り、攻撃は52点差で見送り
  - プレイヤーAI判断: バーサクパワーで次の攻撃価値を上げられるため使用 / 見送り: マスター特技は1点差で見送り、攻撃は52点差で見送り / プレイヤーはレオン Lv2をバーサクパワー状態にした

## 白・黒・デコイ小規模マトリクス

| master | best variant | games | win point | score |
| --- | --- | ---: | ---: | ---: |
| white | white_494_white | 24 | 20.8% | 16 |
| black | black_pressure_pressure | 24 | 75% | 56.7 |
| decoy | decoy_back_stable | 24 | 54.2% | 34.2 |

| rank | master | variant | games | W-L-D | win point | vs white | vs black | vs decoy | issues |
| ---: | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | white | 白: 投稿494 / white<br>submission-pro-no-rare8-white-494 | 24 | 5-19-0 | 20.8% | - | 16.7%<br>2-10-0 | 25%<br>3-9-0 | 0F/1W |
| 2 | black | 黒: ブラック検証 / pressure<br>black-pressure | 24 | 18-6-0 | 75% | 83.3%<br>10-2-0 | - | 66.7%<br>8-4-0 | 0F/0W |
| 3 | decoy | デコイ: 後衛安定 / enemy+16<br>master-lab-decoy-unit-back-stable | 24 | 13-11-0 | 54.2% | 75%<br>9-3-0 | 33.3%<br>4-8-0 | - | 0F/1W |

詳細マトリクス: docs/master_lab/results/2026-06-21_core_master_small_matrix_after_drillbreak.md

## 次の扱い

- 現時点ではドリルブレイク修正による過剰勝率化・不正連打・相方未消費は見えていない。
- 勝率確認の次段階は、#973 と #44 のような高勝率寄り候補だけを中母数へ増やすより、まず正位置ペア成立時の未選択候補スコアを直接保存する監査を追加した方が、AI過大評価の切り分けには効く。
