# White Mirror Front Chip Response Audit

生成: 2026-06-26T15:48:47.801Z
デッキ: `submission-pro-no-rare8-white-1377` vs `submission-pro-with-rare8-white-1339`
seed: 76100 から各方向最大 40
探索: depth 3 / width 4 / terminal 6x2 weight 2 / opponent 2x1 weight 0.35

## Summary

- games: 9 / completed: 9
- events: 160
- converted same turn: 141
- target acted on response: 18
- harmful response: 8
- damaged master: 2
- damaged own monster: 2
- killed own monster: 4
- target leveled up on response: 1
- focus alternative available: 125
- immediate finish alternative available: 10
- avg target HP after chip: 2.54
- selected minus best focus avg: 34353.5
- selected minus immediate finish avg: 153.4

## Buckets

- by HP after: HP2:55, HP1:35, HP3:31, HP4:26, HP5:13
- by decision: attack:120, master_attack:40
- by target: 真勇者ダイン Lv1:27, 鉄拳シグマ Lv1:17, デスシープ Lv2:15, ヤミー Lv1:12, ドノマンティス Lv1:11, 真勇者ダイン Lv3:10, デスシープ Lv1:9, ボムゾウ Lv1:9, モーガン Lv1:8, ヤンバル Lv2:7, ヤンバル Lv1:6, ポリスピナー Lv1:5, ポリスピナー Lv2:4, ヤミー Lv2:4, ピグミィ Lv2:3, モーガン Lv2:3, 真勇者ダイン Lv2:3, ドノマンティス Lv2:2, ボムゾウ Lv2:2, エルスピナー Lv3:1, ピグミィ Lv1:1, 鉄拳シグマ Lv3:1

## Conclusion

- 非リーサル前衛削りは 160件。返しで対象が行動したのは 18件、明確な被害につながったのは 8件、同ターン中に処理へ変換できたのは 141件。
- 被害イベントの内訳は、残HP1が 1件、残HP2以上が 7件。
- 被害イベントのうち、ためる代替が候補にあったものは 6件。即撃破代替が候補にあった削りは全体で 10件。
- 次の候補は一律ペナルティではなく、残HP2以上で返しに攻撃可能な前衛を残す局面だけを監査対象にする。

## Samples

### harmful_response / seed 76104 / A-as-player / turn 5

- selected: master master_attack -> 真勇者ダイン@cpu_front_left / score -232.1
- target: 真勇者ダイン Lv1 5->3 at cpu_front_left
- attacker: white master
- stones: acting 5->2, response 0->0
- alternatives: focus -, finish -, end end turn (-8)
- response action: 真勇者ダイン ダイン斬り -> 真勇者ダイン@player_front_left
- flags: acted=true, masterDamage=0, monsterDamage=true, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 10/10 / stones P/C 5/0 / hand P/C 3/5
- before: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 shield | player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:ピグミィ Lv1 HP3 act2/2 | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- after chip: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP3 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 shield | player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:ピグミィ Lv1 HP3 act2/2 | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- final: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP3 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 shield | player_front_left:PF:真勇者ダイン Lv1 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 focus

### harmful_response / seed 76104 / A-as-player / turn 5

- selected: ピグミィ スパイクボール -> 真勇者ダイン@cpu_front_left / score -82.5
- target: 真勇者ダイン Lv1 6->5 at cpu_front_left
- attacker: ピグミィ
- stones: acting 5->5, response 0->0
- alternatives: focus focus ボムゾウ (-23.8), finish -, end end turn (-112.6)
- response action: 真勇者ダイン ダイン斬り -> 真勇者ダイン@player_front_left
- flags: acted=true, masterDamage=0, monsterDamage=true, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 10/10 / stones P/C 5/0 / hand P/C 3/5
- before: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 shield | player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:ピグミィ Lv1 HP3 act1/2 focus | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- after chip: cpu_back_left:CB:ヤンバル Lv1 HP3 act1/1 | cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 shield | player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:ピグミィ Lv1 HP3 act2/2 | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- final: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP3 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 shield | player_front_left:PF:真勇者ダイン Lv1 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 focus

### harmful_response / seed 76104 / A-as-player / turn 5

- selected: 真勇者ダイン ダイン斬り -> 真勇者ダイン@player_front_left / score 115.3
- target: 真勇者ダイン Lv1 6->5 at player_front_left
- attacker: 真勇者ダイン
- stones: acting 2->2, response 1->1
- alternatives: focus focus 真勇者ダイン (-96.6), finish -, end end turn (-207)
- response action: 真勇者ダイン ダイン斬り -> 真勇者ダイン@cpu_front_left
- flags: acted=true, masterDamage=0, monsterDamage=false, monsterKill=true, levelUp=true, converted=false
- state: HP P/C 10/10 / stones P/C 1/2 / hand P/C 3/6
- before: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP3 act0/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- after chip: cpu_back_left:CB:ヤンバル Lv2 HP3 act1/1 | cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP3 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- final: cpu_back_right:CB:モーガン Lv2 HP4 act0/1 | cpu_front_left:CF:ヤンバル Lv2 HP3 act0/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act0/1 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1

### harmful_response / seed 76104 / A-as-player / turn 8

- selected: ドノマンティス attack -> 真勇者ダイン@cpu_front_right / score -100
- target: 真勇者ダイン Lv3 6->4 at cpu_front_right
- attacker: ドノマンティス
- stones: acting 5->5, response 2->2
- alternatives: focus focus ドノマンティス (-43.1), finish -, end end turn (-81)
- response action: 真勇者ダイン ダイン斬り -> player master
- flags: acted=true, masterDamage=3, monsterDamage=false, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 5/10 / stones P/C 5/2 / hand P/C 4/4
- before: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_right:CF:真勇者ダイン Lv3 HP6 act1/1 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1
- after chip: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_right:CF:真勇者ダイン Lv3 HP4 act1/1 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1
- final: cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:ヤンバル Lv1 HP3 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv3 HP4 act1/1 shield | player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1 focus

### harmful_response / seed 76105 / A-as-player / turn 4

- selected: master master_attack -> モーガン@cpu_front_right / score -101.3
- target: モーガン Lv1 3->1 at cpu_front_right
- attacker: white master
- stones: acting 4->1, response 0->0
- alternatives: focus -, finish -, end end turn (-122.4)
- response action: モーガン attack -> ドノマンティス@player_front_right
- flags: acted=true, masterDamage=0, monsterDamage=false, monsterKill=true, levelUp=false, converted=false
- state: HP P/C 10/10 / stones P/C 4/0 / hand P/C 2/3
- before: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:モーガン Lv1 HP3 act1/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ドノマンティス Lv1 HP5 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 focus
- after chip: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:モーガン Lv1 HP1 act1/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ドノマンティス Lv1 HP5 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 focus
- final: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:モーガン Lv2 HP4 act1/1 | player_front_left:PF:ドノマンティス Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1

### harmful_response / seed 76105 / A-as-player / turn 4

- selected: ドノマンティス attack -> モーガン@cpu_front_right / score 260.2
- target: モーガン Lv1 4->3 at cpu_front_right
- attacker: ドノマンティス
- stones: acting 5->5, response 0->0
- alternatives: focus focus ドノマンティス (-120.1), finish -, end end turn (-395.5)
- response action: モーガン attack -> ドノマンティス@player_front_right
- flags: acted=true, masterDamage=0, monsterDamage=false, monsterKill=true, levelUp=false, converted=false
- state: HP P/C 10/10 / stones P/C 5/0 / hand P/C 3/3
- before: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:モーガン Lv1 HP4 act1/1 focus | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 focus
- after chip: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:モーガン Lv1 HP3 act1/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 focus
- final: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:モーガン Lv2 HP4 act1/1 | player_front_left:PF:ドノマンティス Lv1 HP3 act0/1 | player_front_right:PF:ヤンバル Lv1 HP3 act0/1 focus | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1

### harmful_response / seed 76106 / A-as-player / turn 12

- selected: ヤミー attack -> 鉄拳シグマ@cpu_front_left / score -507.2
- target: 鉄拳シグマ Lv3 6->5 at cpu_front_left
- attacker: ヤミー
- stones: acting 6->6, response 2->2
- alternatives: focus focus ヤミー (-850712.3), finish -, end end turn (-850727.6)
- response action: 鉄拳シグマ tiger_fist -> player master
- flags: acted=true, masterDamage=4, monsterDamage=false, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 5/9 / stones P/C 6/2 / hand P/C 5/3
- before: cpu_back_left:CB:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP1 act2/2 | cpu_front_left:CF:鉄拳シグマ Lv3 HP6 act1/1 shield | cpu_front_right:CF:ポリスピナー Lv1 HP3 prep | player_front_left:PF:ヤミー Lv1 HP5 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2
- after chip: cpu_back_left:CB:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP1 act2/2 | cpu_front_left:CF:鉄拳シグマ Lv3 HP5 act1/1 shield | cpu_front_right:CF:ポリスピナー Lv1 HP3 prep | player_front_left:PF:ヤミー Lv1 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP5 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2
- final: cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP1 act0/2 | cpu_front_left:CF:鉄拳シグマ Lv3 HP5 act1/1 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act1/2 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 shield | player_front_right:PF:真勇者ダイン Lv1 HP5 act1/1 focus,shield | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2

### harmful_response / seed 76108 / A-as-player / turn 7

- selected: ピグミィ スパイクボール -> デスシープ@cpu_front_right / score 34
- target: デスシープ Lv1 6->5 at cpu_front_right
- attacker: ピグミィ
- stones: acting 4->4, response 0->0
- alternatives: focus focus ドノマンティス (-11.2), finish -, end end turn (-134.5)
- response action: デスシープ attack -> ポリスピナー@player_front_right
- flags: acted=true, masterDamage=0, monsterDamage=false, monsterKill=true, levelUp=false, converted=false
- state: HP P/C 10/10 / stones P/C 4/0 / hand P/C 4/5
- before: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 focus | cpu_front_left:CF:鉄拳シグマ Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 | player_back_right:PB:ピグミィ Lv1 HP2 act1/2
- after chip: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 focus | cpu_front_left:CF:鉄拳シグマ Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv1 HP5 act1/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 focus | player_front_right:PF:ポリスピナー Lv1 HP3 prep | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 | player_back_right:PB:ピグミィ Lv1 HP2 act2/2
- final: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:鉄拳シグマ Lv1 HP6 act0/1 focus | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:ヤミー Lv1 HP5 act0/1 | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 focus

### converted / seed 76100 / A-as-player / turn 4

- selected: ヤンバル wild_claw -> 鉄拳シグマ@cpu_front_right / score 508
- target: 鉄拳シグマ Lv1 4->2 at cpu_front_right
- attacker: ヤンバル
- stones: acting 7->7, response 1->1
- alternatives: focus focus ヤミー (-134.1), finish -, end end turn (-683.7)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 9/10 / stones P/C 7/1 / hand P/C 4/4
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:鉄拳シグマ Lv1 HP4 act1/1 | player_front_left:PF:ヤミー Lv1 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:鉄拳シグマ Lv1 HP2 act1/1 | player_front_left:PF:ヤミー Lv1 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- final: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | player_front_left:PF:ヤミー Lv1 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1

### converted / seed 76100 / A-as-player / turn 4

- selected: ヤンバル wild_claw -> 鉄拳シグマ@cpu_front_right / score 267.7
- target: 鉄拳シグマ Lv1 6->4 at cpu_front_right
- attacker: ヤンバル
- stones: acting 7->7, response 1->1
- alternatives: focus focus ドノマンティス (-62.8), finish -, end end turn (-384)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 9/10 / stones P/C 7/1 / hand P/C 4/4
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:鉄拳シグマ Lv1 HP6 act1/1 | player_front_left:PF:ヤミー Lv1 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act0/1
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:鉄拳シグマ Lv1 HP4 act1/1 | player_front_left:PF:ヤミー Lv1 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- final: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | player_front_left:PF:ヤミー Lv1 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1

### converted / seed 76100 / A-as-player / turn 5

- selected: デスシープ attack -> ヤミー@player_front_left / score 602.8
- target: ヤミー Lv1 4->2 at player_front_left
- attacker: デスシープ
- stones: acting 7->7, response 2->2
- alternatives: focus focus 真勇者ダイン (-558.8), finish -, end end turn (-778)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 9/8 / stones P/C 2/7 / hand P/C 5/5
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 | player_front_left:PF:ヤミー Lv1 HP4 act1/1 | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 shield | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 focus
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 | player_front_left:PF:ヤミー Lv1 HP2 act1/1 | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 shield | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 focus
- final: cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 power | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 shield | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 focus

### converted / seed 76100 / A-as-player / turn 6

- selected: デスシープ attack -> ヤンバル@player_front_left / score 437.5
- target: ヤンバル Lv1 3->2 at player_front_left
- attacker: デスシープ
- stones: acting 3->3, response 5->5
- alternatives: focus focus モーガン (-387.5), finish -, end end turn (-520.6)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 9/8 / stones P/C 5/3 / hand P/C 5/4
- before: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 | cpu_back_right:CB:モーガン Lv1 HP4 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 | player_front_left:PF:ヤンバル Lv1 HP3 act0/1 focus | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- after chip: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 | cpu_back_right:CB:モーガン Lv1 HP4 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 | player_front_left:PF:ヤンバル Lv1 HP2 act0/1 | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- final: cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 | cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 focus | player_back_left:PB:真勇者ダイン Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv1 HP3 act1/1


## Reading

- `converted same turn` は削った対象を相手ターン前に処理できたケース。
- `harmful response` は削った対象が返しにマスター/味方へ被害、撃破、またはレベルアップを発生させたケース。
- `selected minus best focus avg` と `selected minus immediate finish avg` は、選択手が代替候補より何点上だったか。正なら現在AIは削りを上に見ている。
