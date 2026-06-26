# White Mirror Front Chip Response Audit

生成: 2026-06-26T15:31:15.680Z
デッキ: `submission-pro-no-rare8-white-1377` vs `submission-pro-with-rare8-white-1339`
seed: 76100 から各方向最大 40
探索: depth 3 / width 4 / terminal 6x2 weight 2 / opponent 2x1 weight 0.35

## Summary

- games: 6 / completed: 6
- events: 160
- converted same turn: 106
- target acted on response: 51
- harmful response: 41
- damaged master: 5
- damaged own monster: 18
- killed own monster: 18
- target leveled up on response: 5
- focus alternative available: 131
- immediate finish alternative available: 5
- avg target HP after chip: 2.62
- selected minus best focus avg: 13285.1
- selected minus immediate finish avg: 240143

## Buckets

- by HP after: HP2:47, HP4:36, HP1:35, HP3:32, HP5:10
- by decision: attack:133, master_attack:27
- by target: 真勇者ダイン Lv1:31, デスシープ Lv1:21, ヤミー Lv1:12, 鉄拳シグマ Lv1:12, 真勇者ダイン Lv2:10, ドノマンティス Lv2:9, 真勇者ダイン Lv3:9, モーガン Lv2:8, ドノマンティス Lv1:7, ボムゾウ Lv1:6, モーガン Lv1:6, ヤンバル Lv1:6, ポリスピナー Lv1:5, ヤンバル Lv2:5, ヤミー Lv2:4, デスシープ Lv2:3, ボムゾウ Lv2:3, ポリスピナー Lv2:3

## Conclusion

- 非リーサル前衛削りは 160件。返しで対象が行動したのは 51件、明確な被害につながったのは 41件、同ターン中に処理へ変換できたのは 106件。
- 被害イベントの内訳は、残HP1が 4件、残HP2以上が 37件。
- 被害イベントのうち、ためる代替が候補にあったものは 29件。即撃破代替が候補にあった削りは全体で 5件。
- 次の候補は一律ペナルティではなく、残HP2以上で返しに攻撃可能な前衛を残す局面だけを監査対象にする。

## Samples

### harmful_response / seed 76100 / A-as-player / turn 2

- selected: デスシープ attack -> ヤミー@player_front_left / score 100.3
- target: ヤミー Lv1 5->4 at player_front_left
- attacker: デスシープ
- stones: acting 0->0, response 1->1
- alternatives: focus focus デスシープ (-197.9), finish -, end end turn (-256.3)
- response action: ヤミー attack -> デスシープ@cpu_front_left
- flags: acted=true, masterDamage=0, monsterDamage=true, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 10/10 / stones P/C 1/0 / hand P/C 3/3
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 power | cpu_front_right:CF:鉄拳シグマ Lv1 HP6 act0/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 focus,shield | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 prep
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 power | cpu_front_right:CF:鉄拳シグマ Lv1 HP6 act0/1 | player_front_left:PF:ヤミー Lv1 HP4 act1/1 shield | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 prep
- final: cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_right:CF:鉄拳シグマ Lv1 HP6 act0/1 focus | player_front_left:PF:ヤミー Lv1 HP4 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 prep | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1

### harmful_response / seed 76100 / A-as-player / turn 5

- selected: ヤンバル wild_claw -> 真勇者ダイン@cpu_front_left / score 72
- target: 真勇者ダイン Lv2 6->4 at cpu_front_left
- attacker: ヤンバル
- stones: acting 3->3, response 2->2
- alternatives: focus focus ヤンバル (-94.6), finish -, end end turn (-156.1)
- response action: 真勇者ダイン ダイン斬り -> player master
- flags: acted=true, masterDamage=1, monsterDamage=false, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 9/10 / stones P/C 3/2 / hand P/C 4/3
- before: cpu_front_left:CF:真勇者ダイン Lv2 HP6 act1/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 prep | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1
- after chip: cpu_front_left:CF:真勇者ダイン Lv2 HP4 act1/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 prep | player_front_right:PF:ドノマンティス Lv2 HP5 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- final: cpu_back_left:CB:モーガン Lv1 HP4 prep | cpu_front_left:CF:真勇者ダイン Lv2 HP4 act1/1 shield | player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:ドノマンティス Lv2 HP5 act0/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1

### harmful_response / seed 76101 / A-as-player / turn 2

- selected: 真勇者ダイン ダイン斬り -> ヤミー@player_front_left / score 273.3
- target: ヤミー Lv1 5->4 at player_front_left
- attacker: 真勇者ダイン
- stones: acting 3->3, response 1->1
- alternatives: focus focus 真勇者ダイン (-231.3), finish -, end end turn (-417.7)
- response action: ヤミー attack -> 真勇者ダイン@cpu_front_left
- flags: acted=true, masterDamage=0, monsterDamage=true, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 10/9 / stones P/C 1/3 / hand P/C 2/4
- before: cpu_back_left:CB:モーガン Lv1 HP4 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 | player_front_left:PF:ヤミー Lv1 HP5 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus,shield | player_back_right:PB:ピグミィ Lv1 HP3 prep
- after chip: cpu_back_left:CB:モーガン Lv1 HP4 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 | player_front_left:PF:ヤミー Lv1 HP4 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus,shield | player_back_right:PB:ピグミィ Lv1 HP3 prep
- final: cpu_back_left:CB:モーガン Lv1 HP4 act0/1 | cpu_front_left:CF:モーガン Lv1 HP4 act0/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act0/1 | player_front_left:PF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:ヤミー Lv1 HP4 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2

### harmful_response / seed 76101 / A-as-player / turn 5

- selected: master master_attack -> モーガン@cpu_front_left / score -289.4
- target: モーガン Lv2 4->2 at cpu_front_left
- attacker: white master
- stones: acting 3->0, response 1->1
- alternatives: focus -, finish -, end end turn (-50.9)
- response action: モーガン attack -> player master
- flags: acted=true, masterDamage=1, monsterDamage=false, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 10/9 / stones P/C 3/1 / hand P/C 2/3
- before: cpu_back_left:CB:モーガン Lv1 HP4 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep | cpu_front_left:CF:モーガン Lv2 HP4 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 shield | player_back_left:PB:ドノマンティス Lv1 HP5 prep
- after chip: cpu_back_left:CB:モーガン Lv1 HP4 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep | cpu_front_left:CF:モーガン Lv2 HP2 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 shield | player_back_left:PB:ドノマンティス Lv1 HP5 prep
- final: cpu_back_left:CB:モーガン Lv1 HP4 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 focus | cpu_front_left:CF:モーガン Lv2 HP2 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 | player_front_left:PF:ドノマンティス Lv1 HP5 act0/1

### harmful_response / seed 76102 / A-as-player / turn 2

- selected: 鉄拳シグマ attack -> ドノマンティス@player_front_right / score -41.3
- target: ドノマンティス Lv1 4->3 at player_front_right
- attacker: 鉄拳シグマ
- stones: acting 2->2, response 0->0
- alternatives: focus focus 鉄拳シグマ (-41.3), finish -, end end turn (-165.2)
- response action: ドノマンティス attack -> 鉄拳シグマ@cpu_front_right
- flags: acted=true, masterDamage=0, monsterDamage=true, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 10/10 / stones P/C 0/2 / hand P/C 2/3
- before: cpu_back_left:CB:モーガン Lv1 HP4 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:鉄拳シグマ Lv1 HP6 act0/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep
- after chip: cpu_back_left:CB:モーガン Lv1 HP4 act1/1 | cpu_back_right:CB:ヤンバル Lv1 HP3 prep | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:鉄拳シグマ Lv1 HP6 act1/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP3 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep
- final: cpu_back_left:CB:モーガン Lv1 HP4 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP3 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 shield

### harmful_response / seed 76102 / A-as-player / turn 2

- selected: モーガン arc_drive -> ドノマンティス@player_front_right / score 271.6
- target: ドノマンティス Lv1 5->4 at player_front_right
- attacker: モーガン
- stones: acting 3->3, response 0->0
- alternatives: focus focus モーガン (-221.6), finish -, end end turn (-419.9)
- response action: ドノマンティス attack -> 鉄拳シグマ@cpu_front_right
- flags: acted=true, masterDamage=0, monsterDamage=true, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 10/10 / stones P/C 0/3 / hand P/C 2/4
- before: cpu_back_left:CB:モーガン Lv1 HP4 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:鉄拳シグマ Lv1 HP6 act0/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus,shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep
- after chip: cpu_back_left:CB:モーガン Lv1 HP4 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:鉄拳シグマ Lv1 HP6 act0/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus,shield | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep
- final: cpu_back_left:CB:モーガン Lv1 HP4 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP3 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 shield

### harmful_response / seed 76102 / A-as-player / turn 3

- selected: ヤンバル wild_claw -> ボムゾウ@player_front_left / score 2.3
- target: ボムゾウ Lv1 5->3 at player_front_left
- attacker: ヤンバル
- stones: acting 0->0, response 1->1
- alternatives: focus focus ヤンバル (-84.9), finish -, end end turn (-190.1)
- response action: ボムゾウ self_bomb -> デスシープ@cpu_front_left
- flags: acted=true, masterDamage=0, monsterDamage=true, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 10/10 / stones P/C 1/0 / hand P/C 3/3
- before: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 power | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:ボムゾウ Lv1 HP5 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 shield
- after chip: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 power | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ボムゾウ Lv1 HP3 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 shield
- final: cpu_front_left:CF:モーガン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:ボムゾウ Lv1 HP1 act1/1 | player_front_right:PF:ピグミィ Lv2 HP3 act2/2 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 focus

### harmful_response / seed 76102 / A-as-player / turn 3

- selected: デスシープ attack -> ボムゾウ@player_front_left / score 143.3
- target: ボムゾウ Lv1 6->5 at player_front_left
- attacker: デスシープ
- stones: acting 0->0, response 1->1
- alternatives: focus focus ヤンバル (-113.3), finish -, end end turn (-276.4)
- response action: ボムゾウ self_bomb -> デスシープ@cpu_front_left
- flags: acted=true, masterDamage=0, monsterDamage=true, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 10/10 / stones P/C 1/0 / hand P/C 3/3
- before: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 power | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 shield
- after chip: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 power | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:ボムゾウ Lv1 HP5 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 shield
- final: cpu_front_left:CF:モーガン Lv2 HP4 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act0/1 | player_front_left:PF:ボムゾウ Lv1 HP1 act1/1 | player_front_right:PF:ピグミィ Lv2 HP3 act2/2 focus | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 focus

### harmful_response / seed 76102 / A-as-player / turn 5

- selected: ピグミィ スパイクボール -> モーガン@cpu_front_left / score -594.4
- target: モーガン Lv2 3->2 at cpu_front_left
- attacker: ピグミィ
- stones: acting 0->0, response 3->3
- alternatives: focus -, finish -, end end turn (-223.8)
- response action: モーガン arc_drive -> ヤンバル@player_back_left
- flags: acted=true, masterDamage=0, monsterDamage=false, monsterKill=true, levelUp=false, converted=false
- state: HP P/C 10/10 / stones P/C 0/3 / hand P/C 2/2
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 prep | cpu_back_right:CB:デスシープ Lv1 HP6 prep | cpu_front_left:CF:モーガン Lv2 HP3 act1/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 prep | player_front_right:PF:ピグミィ Lv2 HP3 act2/2 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 prep | cpu_back_right:CB:デスシープ Lv1 HP6 prep | cpu_front_left:CF:モーガン Lv2 HP2 act1/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 prep | player_front_right:PF:ピグミィ Lv2 HP3 act2/2 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act1/2
- final: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:モーガン Lv2 HP2 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus

### harmful_response / seed 76102 / A-as-player / turn 5

- selected: ピグミィ スパイクボール -> モーガン@cpu_front_left / score -486.6
- target: モーガン Lv2 4->3 at cpu_front_left
- attacker: ピグミィ
- stones: acting 0->0, response 3->3
- alternatives: focus focus ピグミィ (-82.3), finish -, end end turn (-309.4)
- response action: モーガン arc_drive -> ヤンバル@player_back_left
- flags: acted=true, masterDamage=0, monsterDamage=false, monsterKill=true, levelUp=false, converted=false
- state: HP P/C 10/10 / stones P/C 0/3 / hand P/C 2/2
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 prep | cpu_back_right:CB:デスシープ Lv1 HP6 prep | cpu_front_left:CF:モーガン Lv2 HP4 act1/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 prep | player_front_right:PF:ピグミィ Lv2 HP3 act1/2 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 prep | cpu_back_right:CB:デスシープ Lv1 HP6 prep | cpu_front_left:CF:モーガン Lv2 HP3 act1/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 prep | player_front_right:PF:ピグミィ Lv2 HP3 act2/2 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ピグミィ Lv2 HP3 act0/2 focus
- final: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:モーガン Lv2 HP2 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:真勇者ダイン Lv1 HP6 act0/1 | player_front_right:PF:ピグミィ Lv2 HP3 act0/2 focus

### harmful_response / seed 76102 / A-as-player / turn 6

- selected: ピグミィ スパイクボール -> デスシープ@cpu_front_right / score 15.4
- target: デスシープ Lv2 6->5 at cpu_front_right
- attacker: ピグミィ
- stones: acting 3->3, response 3->3
- alternatives: focus focus ピグミィ (-34.8), finish -, end end turn (-71.5)
- response action: デスシープ attack -> player master
- flags: acted=true, masterDamage=1, monsterDamage=false, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 10/10 / stones P/C 3/3 / hand P/C 1/1
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_front_right:PF:ヤミー Lv1 HP5 prep | player_back_left:PB:ピグミィ Lv2 HP3 act1/2 | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep | cpu_front_right:CF:デスシープ Lv2 HP5 act1/1 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 | player_front_right:PF:ヤミー Lv1 HP5 prep | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- final: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_back_right:CB:ポリスピナー Lv1 HP3 act1/2 focus | cpu_front_left:CF:ポリスピナー Lv1 HP3 prep | cpu_front_right:CF:デスシープ Lv2 HP5 act1/1 shield | player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 | player_front_right:PF:ヤミー Lv1 HP5 act0/1 | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1

### harmful_response / seed 76102 / A-as-player / turn 8

- selected: デスシープ attack -> 真勇者ダイン@player_front_left / score -0.1
- target: 真勇者ダイン Lv3 6->5 at player_front_left
- attacker: デスシープ
- stones: acting 2->2, response 5->5
- alternatives: focus focus デスシープ (-10.4), finish -, end end turn (-74.8)
- response action: 真勇者ダイン ダイン斬り -> デスシープ@cpu_front_left
- flags: acted=true, masterDamage=0, monsterDamage=true, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 6/8 / stones P/C 5/2 / hand P/C 1/1
- before: cpu_back_left:CB:デスシープ Lv2 HP5 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:エルスピナー Lv3 HP3 act2/2 | player_front_left:PF:真勇者ダイン Lv3 HP6 act1/1 shield | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep
- after chip: cpu_back_left:CB:デスシープ Lv2 HP5 act0/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:エルスピナー Lv3 HP3 act2/2 | player_front_left:PF:真勇者ダイン Lv3 HP5 act1/1 shield | player_back_left:PB:ピグミィ Lv2 HP3 act0/2 focus | player_back_right:PB:ピグミィ Lv1 HP3 prep
- final: cpu_front_left:CF:デスシープ Lv2 HP5 act0/1 focus | cpu_front_right:CF:エルスピナー Lv3 HP3 act0/2 | player_front_left:PF:真勇者ダイン Lv3 HP5 act1/1 shield | player_back_left:PB:ピグミィ Lv2 HP3 act2/2 focus,shield | player_back_right:PB:ピグミィ Lv2 HP3 act2/2


## Reading

- `converted same turn` は削った対象を相手ターン前に処理できたケース。
- `harmful response` は削った対象が返しにマスター/味方へ被害、撃破、またはレベルアップを発生させたケース。
- `selected minus best focus avg` と `selected minus immediate finish avg` は、選択手が代替候補より何点上だったか。正なら現在AIは削りを上に見ている。
