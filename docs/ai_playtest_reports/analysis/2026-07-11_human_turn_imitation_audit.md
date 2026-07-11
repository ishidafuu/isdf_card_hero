# Human Turn Imitation Audit

- reports: 2
- audited turns: 16
- structured turns: 0
- legacy observation turns: 16

旧レポートは人間操作が文章ログだけのため、候補被覆と評価差の確定判定は行わない。新形式のレポートでは構造化操作を使って分類する。

## battle-2026-07-10T23-27-11-092Z-12628aa5

- generated: 2026-07-10T23:43:43.820Z
- turns: 8

### Turn 2 (legacy)

- classification: `legacy_observation_only`
- human: `ボムゾウ Lv1を移動した` -> `プレイヤーは真勇者ダインを準備中で召喚した` -> `プレイヤーはポリスピナーを準備中で召喚した` -> `ピグミィ Lv1は気合いだめした`
- White V2: `summon:player_polyspinner_1:player_back_left`
- reason: ポリスピナーを空き枠へ召喚 / V2ターンプラン選択: 1/3、自ターン後291点、相手応答後-232点、57案比較
- V2 line: `summon:player_polyspinner_1:player_back_left` -> `summon:player_card_047_3:player_front_left` -> `end_turn`
- opponent response: `focus:cpu_front_left` -> `attack:cpu_front_right:attack:monster:player_front_right::` -> `focus:cpu_front_right` -> `summon:cpu_card_051_1:cpu_back_right` -> `summon:cpu_yanbaru_1:cpu_back_left` -> `master:shield:monster:cpu_front_left` -> `end_turn`

### Turn 3 (legacy)

- classification: `legacy_observation_only`
- human: `プレイヤーのピグミィ Lv1: スパイクボール 1P` -> `ドノマンティス Lv1は気合いで1ダメージ軽減した` -> `スパイクボールでドノマンティス Lv1に0ダメージ` -> `プレイヤーのピグミィ Lv1: スパイクボール 1P` -> `スパイクボールでドノマンティス Lv1に1ダメージ` -> `プレイヤーの真勇者ダイン Lv1: ダイン斬り 2P` -> `ダイン斬りでポリスピナー Lv1に1ダメージ` -> `プレイヤーのポリスピナー Lv1: アタック 2P` -> `アタックでドノマンティス Lv1に2ダメージ` -> `プレイヤーのポリスピナー Lv1: アタック 2P` -> `アタックでドノマンティス Lv1に2ダメージ` -> `ドノマンティス Lv1は倒れ、CPUにストーン1個が戻った` -> `ポリスピナー Lv1は1レベルまで上げられる` -> `ポリスピナー Lv2はLv2になり、HPが全回復した` -> `プレイヤーはポリスピナー Lv2にシールドを張った` -> `プレイヤーは真勇者ダイン Lv1にシールドを張った` -> `ボムゾウ Lv1は気合いだめした`
- White V2: `attack:player_front_left:attack:monster:cpu_front_left`
- reason: ドノマンティスを削れるため攻撃 / V2ターンプラン選択: 1/5、自ターン後383点、相手応答後-215点、144案比較
- V2 line: `attack:player_front_left:attack:monster:cpu_front_left::` -> `master:master_attack:monster:cpu_front_left` -> `focus:player_front_right` -> `attack:player_back_right:スパイクボール:monster:cpu_front_left::` -> `end_turn`
- opponent response: `magic:cpu_card_031_1:monster:player_front_right:monster:player_back_right:::::` -> `attack:cpu_front_right:attack:monster:player_front_right::` -> `end_turn`

### Turn 4 (legacy)

- classification: `legacy_observation_only`
- human: `プレイヤーのピグミィ Lv1: スパイクボール 1P` -> `ポリスピナー Lv1は気合いで1ダメージ軽減した` -> `スパイクボールでポリスピナー Lv1に0ダメージ` -> `プレイヤーの真勇者ダイン Lv1: ダイン斬り 2P` -> `ダイン斬りでポリスピナー Lv1に2ダメージ` -> `ポリスピナー Lv1は倒れ、CPUにストーン1個が戻った` -> `真勇者ダイン Lv1は1レベルまで上げられる` -> `レベルアップしなかった` -> `プレイヤーのピグミィ Lv1: スパイクボール 1P` -> `ドノマンティス Lv1は気合いで1ダメージ軽減した` -> `スパイクボールでドノマンティス Lv1に0ダメージ` -> `プレイヤーのポリスピナー Lv2: アタック 3P` -> `アタックでドノマンティス Lv1に3ダメージ` -> `プレイヤーのポリスピナー Lv2: アタック 3P` -> `アタックでドノマンティス Lv1に3ダメージ` -> `ドノマンティス Lv1は倒れ、CPUにストーン1個が戻った` -> `プレイヤーはポリスピナー Lv2にシールドを張った`
- White V2: `attack:player_front_left:attack:monster:cpu_front_left`
- reason: ドノマンティスを削れるため攻撃 / V2ターンプラン選択: 1/5、自ターン後558点、相手応答後130点、129案比較
- V2 line: `attack:player_front_left:attack:monster:cpu_front_left::` -> `attack:player_front_left:attack:monster:cpu_front_left::` -> `attack:player_back_right:スパイクボール:monster:cpu_front_right::` -> `master:master_attack:monster:cpu_front_right` -> `end_turn`
- opponent response: `summon:cpu_bomuzo_2:cpu_back_left` -> `summon:cpu_card_133_3:cpu_front_right` -> `summon:cpu_card_133_2:cpu_front_left` -> `summon:cpu_card_037_3:cpu_back_right` -> `master:master_attack:monster:player_front_left` -> `master:wake_up:monster:cpu_back_left` -> `attack:cpu_back_left:storm_bomb:monster:player_front_right::` -> `end_turn`

### Turn 5 (legacy)

- classification: `legacy_observation_only`
- human: `ピグミィ Lv1を移動した` -> `プレイヤーはポリスピナーを準備中で召喚した` -> `プレイヤーのポリスピナー Lv2: アタック 3P` -> `CPUのマスターHPが1減った（アタック）。ストーン+1` -> `プレイヤーのポリスピナー Lv2: アタック 3P` -> `CPUのマスターHPが1減った（アタック）。ストーン+1` -> `プレイヤーはポリスピナー Lv2にシールドを張った` -> `ピグミィ Lv1は気合いだめした`
- White V2: `focus:player_front_right`
- reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / V2ターンプラン選択: 1/8、自ターン後631点、相手応答後213点、79案比較
- V2 line: `focus:player_front_right` -> `focus:player_front_left` -> `magic:player_card_031_1:monster:player_front_right:monster:player_back_left:::::` -> `summon:player_card_051_2:player_back_right` -> `attack:player_front_right:self_bomb:master:cpu::` -> `attack:player_front_left:attack:master:cpu::` -> `master:shield:monster:player_front_left` -> `end_turn`
- opponent response: `summon:cpu_card_133_1:cpu_back_left` -> `focus:cpu_front_left` -> `summon:cpu_bomuzo_3:cpu_front_right` -> `summon:cpu_yanbaru_3:cpu_back_right` -> `end_turn`

### Turn 6 (legacy)

- classification: `legacy_observation_only`
- human: `プレイヤーのボムゾウ Lv1: 自爆 3P` -> `自爆でポリスピナー Lv1に3ダメージ` -> `ポリスピナー Lv1は倒れ、CPUにストーン1個が戻った` -> `反動でボムゾウ Lv1に2ダメージ` -> `ボムゾウ Lv1は1レベルまで上げられる` -> `ボムゾウ Lv2はLv2になり、HPが全回復した` -> `プレイヤーはデスシープ Lv1をウェイクアップした` -> `プレイヤーのピグミィ Lv1: スパイクボール 1P` -> `スパイクボールでデスシープ Lv1に1ダメージ` -> `プレイヤーのピグミィ Lv1: スパイクボール 1P` -> `スパイクボールでデスシープ Lv1に1ダメージ` -> `プレイヤーのポリスピナー Lv1: アタック 2P` -> `アタックでデスシープ Lv1に2ダメージ` -> `プレイヤーのポリスピナー Lv1: アタック 2P` -> `アタックでデスシープ Lv1に2ダメージ` -> `デスシープ Lv1は倒れ、CPUにストーン1個が戻った` -> `ポリスピナー Lv1は1レベルまで上げられる` -> `レベルアップしなかった`
- White V2: `attack:player_front_left:self_bomb:master:cpu`
- reason: 相手マスターへ実ダメージを与えられるため攻撃 / V2ターンプラン選択: 1/8、自ターン後658点、相手応答後658点、260案比較
- V2 line: `attack:player_front_left:self_bomb:master:cpu::` -> `focus:player_front_right` -> `summon:player_card_051_2:player_back_left` -> `master:master_attack:monster:cpu_front_left` -> `master:wake_up:monster:player_back_left` -> `focus:player_back_left` -> `attack:player_front_right:attack:master:cpu::` -> `attack:player_back_right:スパイクボール:monster:cpu_front_left::`

### Turn 7 (legacy)

- classification: `legacy_observation_only`
- human: `プレイヤーのボムゾウ Lv2: ストームボム 2P` -> `ストームボムでヤンバル Lv1に2ダメージ` -> `プレイヤーのピグミィ Lv1: スパイクボール 1P` -> `スパイクボールでヤンバル Lv1に1ダメージ` -> `ヤンバル Lv1は倒れ、CPUにストーン1個が戻った` -> `ピグミィ Lv1は1レベルまで上げられる` -> `レベルアップしなかった` -> `ピグミィ Lv1を移動した` -> `プレイヤーはボムゾウを準備中で召喚した`
- White V2: `summon:player_card_051_2:player_back_right`
- reason: 後衛カードを後列右へ召喚 / V2ターンプラン選択: 1/10、自ターン後677点、相手応答後497点、124案比較
- V2 line: `summon:player_card_051_2:player_back_right` -> `move:player_front_right:player_back_left` -> `summon:player_bomuzo_1:player_front_right` -> `attack:player_front_left:storm_bomb:monster:cpu_back_left::` -> `master:wake_up:monster:player_front_right` -> `focus:player_front_right` -> `focus:player_back_left` -> `master:shield:monster:player_front_left` -> `master:shield:monster:player_front_right` -> `end_turn`
- opponent response: `summon:cpu_card_051_3:cpu_back_left` -> `summon:cpu_card_047_3:cpu_front_right` -> `summon:cpu_yanbaru_1:cpu_back_right` -> `end_turn`

### Turn 8 (legacy)

- classification: `legacy_observation_only`
- human: `ボムゾウ Lv1を移動した` -> `プレイヤーはドノマンティスを準備中で召喚した` -> `ボムゾウ Lv2は気合いだめした` -> `ピグミィ Lv1は気合いだめした`
- White V2: `summon:player_card_051_2:player_back_right`
- reason: 後衛カードを後列右へ召喚 / V2ターンプラン選択: 1/2、自ターン後741点、相手応答後437点、48案比較
- V2 line: `summon:player_card_051_2:player_back_right` -> `end_turn`
- opponent response: `move:cpu_front_left:cpu_back_left` -> `attack:cpu_back_left:スパイクボール:monster:player_front_left::` -> `summon:cpu_bomuzo_1:cpu_front_left` -> `summon:cpu_card_047_1:cpu_front_right` -> `summon:cpu_card_047_3:cpu_back_right` -> `end_turn`

### Turn 9 (legacy)

- classification: `legacy_observation_only`
- human: 記録なし
- White V2: `focus:player_back_right`
- reason: 上の技の打点を伸ばしてマスター攻撃につなげるためためる / V2ターンプラン選択: 1/8、自ターン後686点、相手応答後360点、122案比較
- V2 line: `focus:player_back_right` -> `focus:player_front_right` -> `magic:player_card_031_1:monster:player_front_left:monster:player_back_right:::::` -> `focus:player_back_left` -> `master:shield:monster:player_back_left` -> `master:shield:monster:player_front_right` -> `master:shield:monster:player_back_right` -> `end_turn`
- opponent response: `attack:cpu_front_left:wild_claw:monster:player_front_right::` -> `attack:cpu_back_left:スパイクボール:monster:player_front_left::` -> `summon:cpu_card_047_1:cpu_front_right` -> `summon:cpu_card_051_3:cpu_back_right` -> `attack:cpu_back_left:スパイクボール:monster:player_front_left::` -> `end_turn`

## battle-2026-07-11T00-47-47-547Z-9db92a8f

- generated: 2026-07-11T01:18:52.315Z
- turns: 8

### Turn 2 (legacy)

- classification: `legacy_observation_only`
- human: `ピグミィ Lv1は気合いだめした` -> `真勇者ダイン Lv1は気合いだめした` -> `ヤンバル Lv1は気合いだめした`
- White V2: `focus:player_back_right`
- reason: 有効攻撃がないためためる / V2ターンプラン選択: 1/4、自ターン後276点、相手応答後-39点、69案比較
- V2 line: `focus:player_back_right` -> `move:player_front_left:player_back_left` -> `summon:player_polyspinner_2:player_front_left` -> `end_turn`
- opponent response: `summon:cpu_yanbaru_2:cpu_back_right` -> `attack:cpu_back_left:スパイクボール:monster:player_front_right::` -> `summon:cpu_card_133_1:cpu_front_right` -> `attack:cpu_back_left:スパイクボール:monster:player_front_right::` -> `end_turn`

### Turn 3 (legacy)

- classification: `legacy_observation_only`
- human: `プレイヤーはボムゾウを準備中で召喚した` -> `プレイヤーはピグミィを準備中で召喚した` -> `プレイヤーのヤンバル Lv1: ワイルドクロウ 2P` -> `ワイルドクロウでデスシープ Lv1に2ダメージ` -> `真勇者ダイン Lv1は気合いだめした`
- White V2: `summon:player_card_051_2:player_back_left`
- reason: 後衛カードを後列左へ召喚 / V2ターンプラン選択: 1/3、自ターン後179点、相手応答後-132点、102案比較
- V2 line: `summon:player_card_051_2:player_back_left` -> `summon:player_bomuzo_2:player_front_left` -> `end_turn`
- opponent response: `attack:cpu_front_right:wild_claw:monster:player_back_right::` -> `attack:cpu_back_left:スパイクボール:monster:player_front_right::` -> `summon:cpu_card_047_1:cpu_back_right` -> `focus:cpu_front_left` -> `attack:cpu_back_left:スパイクボール:monster:player_front_right::` -> `master:shield:monster:cpu_front_right` -> `end_turn`

### Turn 4 (legacy)

- classification: `legacy_observation_only`
- human: `プレイヤーのヤンバル Lv1: ワイルドクロウ 2P` -> `ワイルドクロウでヤンバル Lv2に2ダメージ` -> `プレイヤーの真勇者ダイン Lv1: ダイン斬り 2P` -> `ダイン斬りでヤンバル Lv2に2ダメージ` -> `ヤンバル Lv2は倒れ、CPUにストーン2個が戻った` -> `真勇者ダイン Lv1は2レベルまで上げられる` -> `真勇者ダイン Lv2はLv2になり、HPが全回復した` -> `レベルアップしなかった` -> `プレイヤーは真勇者ダイン Lv2にシールドを張った` -> `ボムゾウ Lv1を移動した`
- White V2: `attack:player_back_right:wild_claw:monster:cpu_front_left`
- reason: デスシープを削れるため攻撃 / V2ターンプラン選択: 1/6、自ターン後208点、相手応答後208点、123案比較
- V2 line: `attack:player_back_right:wild_claw:monster:cpu_front_left::` -> `attack:player_front_right:ダイン斬り:monster:cpu_front_right::` -> `master:master_attack:monster:cpu_front_right` -> `master:master_attack:monster:cpu_front_left` -> `summon:player_polyspinner_2:player_back_left` -> `attack:player_front_left:self_bomb:monster:cpu_front_left::`

### Turn 5 (legacy)

- classification: `legacy_observation_only`
- human: `プレイヤーは真勇者ダイン Lv2にシールドを張った` -> `プレイヤーの真勇者ダイン Lv2: ダイン斬り 3P` -> `ダイン斬りで真勇者ダイン Lv2に3ダメージ` -> `ボムゾウ Lv1を移動した` -> `プレイヤーはポリスピナーを準備中で召喚した`
- White V2: `master:master_attack:monster:cpu_front_left`
- reason: ストーンに余裕があり敵を削れるためマスターアタック / V2ターンプラン選択: 1/8、自ターン後78点、相手応答後-159点、119案比較
- V2 line: `master:master_attack:monster:cpu_front_left` -> `master:master_attack:monster:cpu_front_left` -> `focus:player_front_right` -> `focus:player_front_left` -> `summon:player_polyspinner_1:player_back_right` -> `master:master_attack:monster:cpu_front_right` -> `summon:player_polyspinner_2:player_back_left` -> `end_turn`
- opponent response: `focus:cpu_front_right` -> `attack:cpu_front_left:attack:monster:player_front_left::` -> `attack:cpu_front_left:スパイクボール:monster:player_front_right::` -> `summon:cpu_card_037_3:cpu_back_left` -> `master:master_attack:monster:player_front_right` -> `end_turn`

### Turn 6 (legacy)

- classification: `legacy_observation_only`
- human: `プレイヤーの真勇者ダイン Lv2: ダイン斬り 3P` -> `真勇者ダイン Lv2は気合いで1ダメージ軽減した` -> `ダイン斬りで真勇者ダイン Lv2に2ダメージ` -> `プレイヤーのボムゾウ Lv1: ストームボム 1P` -> `ストームボムで真勇者ダイン Lv2に1ダメージ` -> `真勇者ダイン Lv2は倒れ、CPUにストーン2個が戻った` -> `ボムゾウ Lv1は1レベルまで上げられる` -> `ボムゾウ Lv2はLv2になり、HPが全回復した` -> `プレイヤーは真勇者ダイン Lv2にシールドを張った` -> `プレイヤーのポリスピナー Lv1: アタック 2P` -> `デスシープ Lv1は気合いで1ダメージ軽減した` -> `アタックでデスシープ Lv1に1ダメージ` -> `ポリスピナー Lv1を移動した`
- White V2: `summon:player_card_133_1:player_back_left`
- reason: デスシープを空き枠へ召喚 / V2ターンプラン選択: 1/10、自ターン後167点、相手応答後29点、166案比較
- V2 line: `summon:player_card_133_1:player_back_left` -> `attack:player_front_left:attack:monster:cpu_front_left::` -> `focus:player_front_left` -> `attack:player_front_right:ダイン斬り:monster:cpu_front_right::` -> `master:master_attack:monster:cpu_front_right` -> `attack:player_back_right:storm_bomb:monster:cpu_front_left::` -> `master:master_attack:monster:cpu_front_left` -> `master:shield:monster:player_front_left` -> `master:shield:monster:player_front_right` -> `end_turn`
- opponent response: `summon:cpu_bomuzo_3:cpu_back_left` -> `move:cpu_front_left:cpu_back_right` -> `summon:cpu_bomuzo_2:cpu_front_left` -> `end_turn`

### Turn 7 (legacy)

- classification: `legacy_observation_only`
- human: `プレイヤーのポリスピナー Lv1: アタック 2P` -> `デスシープ Lv1は気合いで1ダメージ軽減した` -> `アタックでデスシープ Lv1に1ダメージ` -> `プレイヤーのボムゾウ Lv2: ストームボム 2P` -> `ストームボムでデスシープ Lv1に2ダメージ` -> `デスシープ Lv1は倒れ、CPUにストーン1個が戻った` -> `ポリスピナー Lv1を移動した` -> `プレイヤーの真勇者ダイン Lv2: ダイン斬り 3P` -> `ドノマンティス Lv1は気合いで1ダメージ軽減した` -> `ダイン斬りでドノマンティス Lv1に2ダメージ` -> `プレイヤーは真勇者ダイン Lv2にシールドを張った`
- White V2: `attack:player_front_right:ダイン斬り:master:cpu`
- reason: 相手マスターへ実ダメージを与えられるため攻撃 / V2ターンプラン選択: 1/8、自ターン後197点、相手応答後93点、159案比較
- V2 line: `attack:player_front_right:ダイン斬り:master:cpu::` -> `attack:player_front_left:attack:monster:cpu_front_left::` -> `focus:player_front_left` -> `attack:player_back_right:storm_bomb:monster:cpu_front_left::` -> `summon:player_card_133_1:player_back_left` -> `master:shield:monster:player_front_left` -> `master:shield:monster:player_front_right` -> `end_turn`
- opponent response: `move:cpu_front_left:cpu_back_left` -> `summon:cpu_card_047_3:cpu_front_left` -> `end_turn`

### Turn 8 (legacy)

- classification: `legacy_observation_only`
- human: `プレイヤーはスケープゴートを使った` -> `ドノマンティス Lv1をスケープゴートにした` -> `プレイヤーのボムゾウ Lv2: ストームボム 2P` -> `ドノマンティス Lv1は気合いで1ダメージ軽減した` -> `ストームボムでドノマンティス Lv1に0ダメージ` -> `プレイヤーの真勇者ダイン Lv2: ダイン斬り 3P` -> `ダイン斬りでドノマンティス Lv1に2ダメージ` -> `プレイヤーのポリスピナー Lv1: アタック 2P` -> `ドノマンティス Lv1がマスターの身代わりになった` -> `アタック（身代わり）でドノマンティス Lv1に1ダメージ` -> `ドノマンティス Lv1は倒れ、CPUにストーン1個が戻った` -> `ポリスピナー Lv1は1レベルまで上げられる` -> `ポリスピナー Lv2はLv2になり、HPが全回復した` -> `ポリスピナー Lv2を移動した` -> `プレイヤーは真勇者ダイン Lv2にシールドを張った`
- White V2: `attack:player_front_right:ダイン斬り:monster:cpu_front_right`
- reason: ドノマンティスを削れるため攻撃 / V2ターンプラン選択: 1/3、自ターン後135点、相手応答後-195点、133案比較
- V2 line: `attack:player_front_right:ダイン斬り:monster:cpu_front_right::` -> `summon:player_card_133_1:player_back_left` -> `end_turn`
- opponent response: `attack:cpu_back_left:スパイクボール:monster:player_front_left::` -> `focus:cpu_front_right` -> `attack:cpu_back_left:スパイクボール:monster:player_front_right::` -> `attack:cpu_back_right:スパイクボール:monster:player_front_left::` -> `attack:cpu_front_left:スパイクボール:monster:player_back_right::` -> `attack:cpu_back_right:スパイクボール:monster:player_front_right::` -> `master:master_attack:monster:player_front_right` -> `end_turn`

### Turn 9 (legacy)

- classification: `legacy_observation_only`
- human: `プレイヤーはデスシープ Lv1をウェイクアップした` -> `プレイヤーのポリスピナー Lv2: アタック 3P` -> `アタックでデスシープ Lv1に3ダメージ` -> `プレイヤーのポリスピナー Lv2: アタック 3P` -> `アタックでデスシープ Lv1に3ダメージ` -> `デスシープ Lv1は倒れ、CPUにストーン1個が戻った` -> `プレイヤーのボムゾウ Lv2: ストームボム 2P` -> `ストームボムでピグミィ Lv1に1ダメージ` -> `プレイヤーはデスシープを準備中で召喚した` -> `プレイヤーの真勇者ダイン Lv2: ダイン斬り 3P` -> `ダイン斬りでピグミィ Lv1に2ダメージ` -> `ピグミィ Lv1は倒れ、CPUにストーン1個が戻った` -> `真勇者ダイン Lv2は1レベルまで上げられる` -> `レベルアップしなかった` -> `プレイヤーは真勇者ダイン Lv2にシールドを張った`
- White V2: `attack:player_front_left:attack:master:cpu`
- reason: 相手マスターへ実ダメージを与えられるため攻撃 / V2ターンプラン選択: 1/8、自ターン後418点、相手応答後22点、130案比較
- V2 line: `attack:player_front_left:attack:master:cpu::` -> `focus:player_front_left` -> `summon:player_card_051_3:player_back_left` -> `attack:player_front_right:ダイン斬り:master:cpu::` -> `focus:player_back_right` -> `master:shield:monster:player_front_left` -> `master:shield:monster:player_front_right` -> `end_turn`
- opponent response: `attack:cpu_front_left:attack:monster:player_front_left::` -> `master:master_attack:monster:player_front_left` -> `end_turn`
