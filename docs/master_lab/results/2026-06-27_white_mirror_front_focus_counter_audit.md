# White Mirror Front Chip Response Audit

生成: 2026-06-27T01:30:47.225Z
デッキ: `submission-pro-no-rare8-white-1377` vs `submission-pro-with-rare8-white-1339`
seed: 76100 から各方向最大 40
探索: depth 3 / width 4 / terminal 6x2 weight 2 / opponent 2x1 weight 0.35

## Summary

- games: 8 / completed: 8
- events: 160
- converted same turn: 147
- target acted on response: 12
- harmful response: 6
- damaged master: 6
- damaged own monster: 0
- killed own monster: 0
- target leveled up on response: 0
- focus alternative available: 126
- immediate finish alternative available: 7
- avg target HP after chip: 2.49
- selected minus best focus avg: 27360
- selected minus immediate finish avg: 168.2

## Buckets

- by HP after: HP2:58, HP1:33, HP4:33, HP3:31, HP5:5
- by decision: attack:109, master_attack:51
- by target: 真勇者ダイン Lv1:28, デスシープ Lv1:18, 鉄拳シグマ Lv1:14, ドノマンティス Lv1:13, ヤミー Lv1:13, ボムゾウ Lv1:10, デスシープ Lv2:8, モーガン Lv2:8, 真勇者ダイン Lv3:8, 真勇者ダイン Lv2:5, ポリスピナー Lv1:4, モーガン Lv1:4, ヤミー Lv2:4, ヤンバル Lv1:4, ヤンバル Lv2:4, ドノマンティス Lv2:3, ピグミィ Lv2:3, ボムゾウ Lv2:3, 鉄拳シグマ Lv3:3, エルスピナー Lv3:2, ポリスピナー Lv2:1

## Conclusion

- 非リーサル前衛削りは 160件。返しで対象が行動したのは 12件、明確な被害につながったのは 6件、同ターン中に処理へ変換できたのは 147件。
- 被害イベントの内訳は、残HP1が 1件、残HP2以上が 5件。
- 被害イベントのうち、ためる代替が候補にあったものは 4件。即撃破代替が候補にあった削りは全体で 7件。
- 次の候補は一律ペナルティではなく、残HP2以上で返しに攻撃可能な前衛を残す局面だけを監査対象にする。

## Samples

### harmful_response / seed 76102 / A-as-player / turn 12

- selected: ピグミィ スパイクボール -> デスシープ@cpu_front_right / score -108.8
- target: デスシープ Lv2 6->5 at cpu_front_right
- attacker: ピグミィ
- stones: acting 8->8, response 4->4
- alternatives: focus focus ピグミィ (-22.3), finish -, end end turn (-75.5)
- response action: デスシープ attack -> player master
- flags: acted=true, masterDamage=1, monsterDamage=false, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 6/8 / stones P/C 8/4 / hand P/C 4/3
- before: cpu_back_left:CB:鉄拳シグマ Lv1 HP6 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 shield | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act1/2 | player_back_right:PB:ピグミィ Lv2 HP3 act1/2
- after chip: cpu_back_left:CB:鉄拳シグマ Lv1 HP6 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 shield | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP5 act1/1 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ピグミィ Lv2 HP3 act1/2
- final: cpu_back_left:CB:鉄拳シグマ Lv1 HP6 act1/1 focus | cpu_back_right:CB:ピグミィ Lv2 HP3 act1/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 focus | cpu_front_right:CF:デスシープ Lv2 HP5 act1/1 | player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 | player_front_right:PF:ボムゾウ Lv1 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus

### harmful_response / seed 76104 / A-as-player / turn 8

- selected: 真勇者ダイン ダイン斬り -> 真勇者ダイン@player_front_left / score -326.5
- target: 真勇者ダイン Lv3 6->4 at player_front_left
- attacker: 真勇者ダイン
- stones: acting 2->2, response 7->7
- alternatives: focus -, finish -, end end turn (-136.3)
- response action: 真勇者ダイン ダイン斬り -> cpu master
- flags: acted=true, masterDamage=2, monsterDamage=false, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 7/8 / stones P/C 7/2 / hand P/C 4/6
- before: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 focus | cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 | player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 focus | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- after chip: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 focus | cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 | player_front_left:PF:真勇者ダイン Lv3 HP4 act0/1 | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- final: cpu_back_left:CB:モーガン Lv2 HP4 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:モーガン Lv2 HP4 act0/1 | player_front_left:PF:真勇者ダイン Lv3 HP4 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 focus | player_back_right:PB:ボムゾウ Lv1 HP6 prep

### harmful_response / seed 76104 / A-as-player / turn 13

- selected: master master_attack -> デスシープ@cpu_front_left / score -530.4
- target: デスシープ Lv2 6->4 at cpu_front_left
- attacker: white master
- stones: acting 6->3, response 3->3
- alternatives: focus -, finish -, end end turn (-39.1)
- response action: デスシープ attack -> player master
- flags: acted=true, masterDamage=1, monsterDamage=false, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 6/6 / stones P/C 6/3 / hand P/C 5/4
- before: cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:鉄拳シグマ Lv1 HP6 prep | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | player_front_right:PF:ボムゾウ Lv2 HP2 act1/1
- after chip: cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:鉄拳シグマ Lv1 HP6 prep | cpu_front_left:CF:デスシープ Lv2 HP4 act1/1 | player_front_right:PF:ボムゾウ Lv2 HP2 act1/1
- final: cpu_back_left:CB:デスシープ Lv1 HP6 act1/1 focus,shield | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:デスシープ Lv2 HP4 act1/1 | cpu_front_right:CF:鉄拳シグマ Lv1 HP6 act1/1 focus | player_front_right:PF:ボムゾウ Lv2 HP2 act0/1

### harmful_response / seed 76105 / A-as-player / turn 7

- selected: ピグミィ スパイクボール -> デスシープ@cpu_front_left / score 78.7
- target: デスシープ Lv1 6->5 at cpu_front_left
- attacker: ピグミィ
- stones: acting 4->4, response 1->1
- alternatives: focus focus ピグミィ (-34.8), finish -, end end turn (-112.9)
- response action: デスシープ attack -> player master
- flags: acted=true, masterDamage=1, monsterDamage=false, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 10/10 / stones P/C 4/1 / hand P/C 4/3
- before: cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 | player_front_left:PF:ドノマンティス Lv1 HP5 prep | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act1/2
- after chip: cpu_front_left:CF:デスシープ Lv1 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 | player_front_left:PF:ドノマンティス Lv1 HP5 prep | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2
- final: cpu_front_left:CF:デスシープ Lv1 HP5 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1 | player_front_right:PF:ドノマンティス Lv2 HP5 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2

### harmful_response / seed 76105 / A-as-player / turn 15

- selected: ヤンバル wild_claw -> エルスピナー@cpu_front_left / score -2099728.2
- target: エルスピナー Lv3 3->1 at cpu_front_left
- attacker: ヤンバル
- stones: acting 0->0, response 3->3
- alternatives: focus focus ヤンバル (-851597.7), finish -, end end turn (-851492.8)
- response action: エルスピナー ヒートブレード -> player master
- flags: acted=true, masterDamage=5, monsterDamage=false, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 5/9 / stones P/C 0/3 / hand P/C 6/2
- before: cpu_front_left:CF:エルスピナー Lv3 HP3 act2/2 shield | player_front_left:PF:ヤンバル Lv2 HP3 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act0/1
- after chip: cpu_front_left:CF:エルスピナー Lv3 HP1 act2/2 shield | player_front_left:PF:ヤンバル Lv2 HP3 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1
- final: cpu_front_left:CF:エルスピナー Lv3 HP1 act2/2 | player_front_left:PF:ヤンバル Lv2 HP3 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_right:PB:ヤンバル Lv2 HP3 act1/1

### harmful_response / seed 76106 / A-as-player / turn 13

- selected: master master_attack -> 鉄拳シグマ@cpu_front_left / score -221
- target: 鉄拳シグマ Lv3 6->4 at cpu_front_left
- attacker: white master
- stones: acting 4->1, response 6->6
- alternatives: focus focus ピグミィ (-28.4), finish -, end end turn (-142.4)
- response action: 鉄拳シグマ tiger_fist -> player master
- flags: acted=true, masterDamage=3, monsterDamage=false, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 8/8 / stones P/C 4/6 / hand P/C 4/4
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:鉄拳シグマ Lv1 HP6 prep | cpu_front_left:CF:鉄拳シグマ Lv3 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 | player_front_left:PF:ポリスピナー Lv1 HP3 prep | player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act1/2
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_right:CB:鉄拳シグマ Lv1 HP6 prep | cpu_front_left:CF:鉄拳シグマ Lv3 HP4 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 | player_front_left:PF:ポリスピナー Lv1 HP3 prep | player_front_right:PF:真勇者ダイン Lv2 HP6 act1/1 focus | player_back_right:PB:ピグミィ Lv2 HP3 act1/2
- final: cpu_back_left:CB:ピグミィ Lv2 HP3 act2/2 | cpu_back_right:CB:鉄拳シグマ Lv1 HP6 act1/1 focus | cpu_front_left:CF:鉄拳シグマ Lv3 HP4 act1/1 shield | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:真勇者ダイン Lv2 HP6 act0/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus

### converted / seed 76100 / A-as-player / turn 4

- selected: master master_attack -> 鉄拳シグマ@cpu_front_right / score 338.8
- target: 鉄拳シグマ Lv1 4->2 at cpu_front_right
- attacker: white master
- stones: acting 7->4, response 1->1
- alternatives: focus -, finish -, end end turn (-680.5)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 9/10 / stones P/C 7/1 / hand P/C 4/4
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:鉄拳シグマ Lv1 HP4 act1/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:鉄拳シグマ Lv1 HP2 act1/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- final: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | player_front_left:PF:ヤミー Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1

### converted / seed 76100 / A-as-player / turn 4

- selected: ヤンバル wild_claw -> 鉄拳シグマ@cpu_front_right / score 317
- target: 鉄拳シグマ Lv1 6->4 at cpu_front_right
- attacker: ヤンバル
- stones: acting 7->7, response 1->1
- alternatives: focus focus ヤンバル (-333.6), finish -, end end turn (-614.5)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 9/10 / stones P/C 7/1 / hand P/C 4/4
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:鉄拳シグマ Lv1 HP6 act1/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act0/1
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:鉄拳シグマ Lv1 HP4 act1/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- final: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | player_front_left:PF:ヤミー Lv1 HP5 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1

### converted / seed 76100 / A-as-player / turn 5

- selected: ヤンバル wild_claw -> デスシープ@cpu_front_left / score 172.7
- target: デスシープ Lv1 6->3 at cpu_front_left
- attacker: ヤンバル
- stones: acting 6->6, response 1->1
- alternatives: focus focus ドノマンティス (-88), finish -, end end turn (-528.9)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 7/10 / stones P/C 6/1 / hand P/C 5/3
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 prep | player_front_left:PF:ヤミー Lv1 HP5 act0/1 focus | player_front_right:PF:ドノマンティス Lv1 HP4 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP3 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 prep | player_front_left:PF:ヤミー Lv1 HP5 act0/1 focus | player_front_right:PF:ドノマンティス Lv1 HP4 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1
- final: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 prep | player_front_left:PF:ヤミー Lv1 HP5 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP4 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1

### converted / seed 76100 / A-as-player / turn 5

- selected: 真勇者ダイン ダイン斬り -> ドノマンティス@player_front_right / score 407.7
- target: ドノマンティス Lv1 4->2 at player_front_right
- attacker: 真勇者ダイン
- stones: acting 5->5, response 3->3
- alternatives: focus focus 真勇者ダイン (-367.7), finish -, end end turn (-787.7)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 7/10 / stones P/C 3/5 / hand P/C 5/4
- before: cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 focus
- after chip: cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP2 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 focus
- final: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 shield | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1 focus

### converted / seed 76100 / A-as-player / turn 6

- selected: ヤンバル wild_claw -> 真勇者ダイン@cpu_front_right / score 120
- target: 真勇者ダイン Lv1 4->1 at cpu_front_right
- attacker: ヤンバル
- stones: acting 4->4, response 2->2
- alternatives: focus focus ヤンバル (-668.1), finish -, end end turn (-731.3)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 7/9 / stones P/C 4/2 / hand P/C 6/3
- before: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP4 act1/1 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- after chip: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP1 act1/1 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- final: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1

### converted / seed 76100 / A-as-player / turn 6

- selected: master master_attack -> 真勇者ダイン@cpu_front_right / score 206.7
- target: 真勇者ダイン Lv1 6->4 at cpu_front_right
- attacker: white master
- stones: acting 7->4, response 2->2
- alternatives: focus focus ヤンバル (-750.9), finish -, end end turn (-813.5)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 7/9 / stones P/C 7/2 / hand P/C 6/3
- before: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act1/1 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- after chip: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | cpu_front_right:CF:真勇者ダイン Lv1 HP4 act1/1 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- final: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1


## Reading

- `converted same turn` は削った対象を相手ターン前に処理できたケース。
- `harmful response` は削った対象が返しにマスター/味方へ被害、撃破、またはレベルアップを発生させたケース。
- `selected minus best focus avg` と `selected minus immediate finish avg` は、選択手が代替候補より何点上だったか。正なら現在AIは削りを上に見ている。
