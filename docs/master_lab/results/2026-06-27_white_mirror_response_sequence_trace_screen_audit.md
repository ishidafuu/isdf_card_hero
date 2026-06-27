# White Mirror Front Chip Response Audit

生成: 2026-06-27T07:28:22.950Z
デッキ: `submission-pro-no-rare8-white-1377` vs `submission-pro-with-rare8-white-1339`
seed: 76100 から各方向最大 30
探索: depth 3 / width 4 / terminal 6x2 weight 2 / opponent 2x1 weight 0.35

## Summary

- games: 6 / completed: 6
- events: 80
- converted same turn: 72
- target acted on response: 6
- target acted after prior response action: 4
- harmful response: 3
- board harmful response: 1
- master-only response: 2
- damaged master: 2
- damaged own monster: 0
- killed own monster: 1
- target leveled up on response: 0
- focus alternative available: 69
- immediate finish alternative available: 2
- avg target HP after chip: 2.45
- selected minus best focus avg: 331.3
- selected minus immediate finish avg: 251.8

## Buckets

- by HP after: HP2:28, HP1:18, HP3:17, HP4:14, HP5:3
- by decision: attack:56, master_attack:24
- by target: 真勇者ダイン Lv1:16, デスシープ Lv1:7, デスシープ Lv2:6, ドノマンティス Lv1:6, モーガン Lv2:5, ヤミー Lv1:5, 鉄拳シグマ Lv1:5, ドノマンティス Lv2:4, ポリスピナー Lv1:4, モーガン Lv1:4, 真勇者ダイン Lv2:4, ボムゾウ Lv1:3, ヤンバル Lv1:3, ヤンバル Lv2:3, ヤミー Lv2:2, 真勇者ダイン Lv3:2, ボムゾウ Lv2:1
- first prior response action: attack:1, magic:1, master:1, summon:1
- harmful first prior response action: master:1, summon:1

## Conclusion

- 非リーサル前衛削りは 80件。返しで対象が行動したのは 6件、従来の被害判定は 3件、同ターン中に処理へ変換できたのは 72件。
- 対象が動く前に返し側の別行動が入ったものは 4件。単純な「対象が即動けるか」だけでは拾えない返し手順が残っている。
- 盤面被害は 1件、マスターのみ被弾は 2件。白ミラーでは盤面被害を主指標にし、マスターのみ被弾は詰めろ圏かどうかを別途見る。
- 盤面被害の内訳は、残HP1が 0件、残HP2以上が 1件。
- 盤面被害イベントのうち、ためる代替が候補にあったものは 1件。即撃破代替が候補にあった削りは全体で 2件。
- 次の候補は一律ペナルティではなく、残HP2以上で返しに攻撃可能な前衛を残す局面だけを監査対象にする。

## Samples

### harmful_response / seed 76102 / A-as-player / turn 8

- selected: ピグミィ スパイクボール -> デスシープ@cpu_front_right / score -212.1
- target: デスシープ Lv2 6->5 at cpu_front_right
- attacker: ピグミィ
- stones: acting 4->4, response 1->1
- alternatives: focus focus ピグミィ (-21.7), finish -, end end turn (-123.8)
- response action: デスシープ attack -> ピグミィ@player_front_right
- prior response actions: master wake_up -> ピグミィ@player_front_right
- flags: acted=true, masterDamage=0, monsterDamage=false, monsterKill=true, levelUp=false, converted=false
- state: HP P/C 8/10 / stones P/C 4/1 / hand P/C 3/2
- before: cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act1/2
- after chip: cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:デスシープ Lv2 HP5 act1/1 | player_front_left:PF:真勇者ダイン Lv2 HP6 act1/1 | player_back_left:PB:ピグミィ Lv2 HP3 act2/2
- final: cpu_back_left:CB:ポリスピナー Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 focus | cpu_front_right:CF:デスシープ Lv2 HP5 act1/1 | player_front_left:PF:真勇者ダイン Lv2 HP6 act0/1 | player_back_left:PB:ピグミィ Lv2 HP1 act0/2

### harmful_response / seed 76104 / A-as-player / turn 8

- selected: 真勇者ダイン ダイン斬り -> 真勇者ダイン@player_front_left / score -339.5
- target: 真勇者ダイン Lv3 6->4 at player_front_left
- attacker: 真勇者ダイン
- stones: acting 2->2, response 7->7
- alternatives: focus -, finish -, end end turn (-123.3)
- response action: 真勇者ダイン ダイン斬り -> cpu master
- prior response actions: summon ボムゾウ -> player_back_right
- flags: acted=true, masterDamage=2, monsterDamage=false, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 7/8 / stones P/C 7/2 / hand P/C 4/6
- before: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 focus | cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 focus | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 | player_front_left:PF:真勇者ダイン Lv3 HP6 act0/1 focus | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- after chip: cpu_back_left:CB:モーガン Lv2 HP4 act1/1 focus | cpu_back_right:CB:モーガン Lv2 HP4 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 | player_front_left:PF:真勇者ダイン Lv3 HP4 act0/1 | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- final: cpu_back_left:CB:モーガン Lv2 HP4 act0/1 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:モーガン Lv2 HP4 act0/1 | player_front_left:PF:真勇者ダイン Lv3 HP4 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ドノマンティス Lv1 HP5 act0/1 focus | player_back_right:PB:ボムゾウ Lv1 HP6 prep

### harmful_response / seed 76104 / A-as-player / turn 13

- selected: master master_attack -> デスシープ@cpu_front_left / score 235
- target: デスシープ Lv2 6->4 at cpu_front_left
- attacker: white master
- stones: acting 6->3, response 1->1
- alternatives: focus focus ボムゾウ (-314.8), finish -, end end turn (-594.6)
- response action: デスシープ attack -> player master
- flags: acted=true, masterDamage=1, monsterDamage=false, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 6/6 / stones P/C 6/1 / hand P/C 5/4
- before: cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:鉄拳シグマ Lv1 HP6 prep | cpu_front_left:CF:デスシープ Lv2 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 | player_front_right:PF:ボムゾウ Lv2 HP5 act0/1
- after chip: cpu_back_left:CB:デスシープ Lv1 HP6 prep | cpu_back_right:CB:鉄拳シグマ Lv1 HP6 prep | cpu_front_left:CF:デスシープ Lv2 HP4 act1/1 | cpu_front_right:CF:ヤンバル Lv2 HP3 act1/1 | player_front_right:PF:ボムゾウ Lv2 HP5 act0/1
- final: cpu_back_left:CB:デスシープ Lv1 HP6 act1/1 focus,shield | cpu_back_right:CB:ポリスピナー Lv1 HP3 prep | cpu_front_left:CF:デスシープ Lv2 HP4 act1/1 | cpu_front_right:CF:鉄拳シグマ Lv1 HP6 act1/1 focus | player_front_right:PF:ボムゾウ Lv2 HP2 act0/1

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

- selected: ヤンバル wild_claw -> デスシープ@cpu_front_left / score 202.6
- target: デスシープ Lv1 6->3 at cpu_front_left
- attacker: ヤンバル
- stones: acting 6->6, response 1->1
- alternatives: focus focus ドノマンティス (-118), finish -, end end turn (-529.7)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 7/10 / stones P/C 6/1 / hand P/C 5/3
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP6 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 prep | player_front_left:PF:ヤミー Lv1 HP5 act0/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:デスシープ Lv1 HP3 act1/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 prep | player_front_left:PF:ヤミー Lv1 HP5 act0/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1
- final: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_right:CF:真勇者ダイン Lv1 HP6 prep | player_front_left:PF:ヤミー Lv1 HP5 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act0/1

### converted / seed 76100 / A-as-player / turn 6

- selected: master master_attack -> ドノマンティス@player_front_right / score 430
- target: ドノマンティス Lv1 5->3 at player_front_right
- attacker: white master
- stones: acting 5->2, response 6->6
- alternatives: focus focus モーガン (-322.7), finish -, end end turn (-665.8)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 7/9 / stones P/C 6/5 / hand P/C 5/3
- before: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act1/2 | cpu_front_left:CF:モーガン Lv1 HP4 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus
- after chip: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act1/2 | cpu_front_left:CF:モーガン Lv1 HP4 act0/1 | cpu_front_right:CF:真勇者ダイン Lv1 HP6 act0/1 focus | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP3 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus
- final: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act1/2 | cpu_front_left:CF:モーガン Lv1 HP4 act0/1 | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus

### converted / seed 76100 / A-as-player / turn 7

- selected: master master_attack -> 真勇者ダイン@cpu_front_right / score 249
- target: 真勇者ダイン Lv2 4->2 at cpu_front_right
- attacker: white master
- stones: acting 7->4, response 1->1
- alternatives: focus focus ヤミー (-295), finish -, end end turn (-1128.2)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 7/9 / stones P/C 7/1 / hand P/C 6/3
- before: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:モーガン Lv1 HP4 act1/1 focus | cpu_front_right:CF:真勇者ダイン Lv2 HP4 act1/1 | player_front_left:PF:ヤミー Lv2 HP5 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- after chip: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:モーガン Lv1 HP4 act1/1 focus | cpu_front_right:CF:真勇者ダイン Lv2 HP2 act1/1 | player_front_left:PF:ヤミー Lv2 HP5 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- final: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:モーガン Lv1 HP4 act1/1 focus | player_front_left:PF:ヤミー Lv2 HP5 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1

### converted / seed 76100 / A-as-player / turn 7

- selected: master master_attack -> 真勇者ダイン@cpu_front_right / score 237.3
- target: 真勇者ダイン Lv2 6->4 at cpu_front_right
- attacker: white master
- stones: acting 10->7, response 1->1
- alternatives: focus focus ヤミー (-283.3), finish -, end end turn (-961.8)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 7/9 / stones P/C 10/1 / hand P/C 6/3
- before: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:モーガン Lv1 HP4 act1/1 focus | cpu_front_right:CF:真勇者ダイン Lv2 HP6 act1/1 | player_front_left:PF:ヤミー Lv2 HP5 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- after chip: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:モーガン Lv1 HP4 act1/1 focus | cpu_front_right:CF:真勇者ダイン Lv2 HP4 act1/1 | player_front_left:PF:ヤミー Lv2 HP5 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- final: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:モーガン Lv1 HP4 act1/1 focus | player_front_left:PF:ヤミー Lv2 HP5 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1

### converted / seed 76100 / A-as-player / turn 7

- selected: ヤミー attack -> モーガン@cpu_front_left / score 194.6
- target: モーガン Lv1 4->2 at cpu_front_left
- attacker: ヤミー
- stones: acting 4->4, response 3->3
- alternatives: focus focus ヤミー (-581.6), finish -, end end turn (-880.5)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 7/9 / stones P/C 4/3 / hand P/C 6/3
- before: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:モーガン Lv1 HP4 act1/1 focus | player_front_left:PF:ヤミー Lv2 HP5 act0/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- after chip: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:モーガン Lv1 HP2 act1/1 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1
- final: cpu_back_left:CB:ヤンバル Lv1 HP3 prep | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_back_left:PB:ヤンバル Lv2 HP3 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1

### converted / seed 76100 / A-as-player / turn 8

- selected: master master_attack -> 真勇者ダイン@player_front_right / score 388.6
- target: 真勇者ダイン Lv1 4->2 at player_front_right
- attacker: white master
- stones: acting 6->3, response 4->4
- alternatives: focus focus ポリスピナー (-148.2), finish -, end end turn (-707.9)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 7/9 / stones P/C 4/6 / hand P/C 5/4
- before: cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP4 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus
- after chip: cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP2 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus
- final: cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act1/2 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus

### converted / seed 76100 / A-as-player / turn 8

- selected: master master_attack -> 真勇者ダイン@player_front_right / score 118.3
- target: 真勇者ダイン Lv1 6->4 at player_front_right
- attacker: white master
- stones: acting 9->6, response 4->4
- alternatives: focus focus ポリスピナー (-106), finish -, end end turn (-355)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 7/9 / stones P/C 4/9 / hand P/C 5/4
- before: cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus
- after chip: cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:ポリスピナー Lv1 HP3 act0/2 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP4 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus
- final: cpu_back_right:CB:ピグミィ Lv2 HP3 act2/2 | cpu_front_right:CF:ポリスピナー Lv2 HP3 act1/2 | player_front_left:PF:ヤミー Lv2 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep | player_back_right:PB:ヤンバル Lv1 HP3 act0/1 focus


## Reading

- `converted same turn` は削った対象を相手ターン前に処理できたケース。
- `harmful response` は削った対象が返しにマスター/味方へ被害、撃破、またはレベルアップを発生させたケース。
- `board harmful response` は味方モンスター被害/撃破/相手レベルアップに絞ったケース。白ミラーの主指標。
- `master-only response` は盤面被害なしでマスターだけ被弾したケース。白ミラーでは詰めろ圏でなければ許容寄りに読む。
- `selected minus best focus avg` と `selected minus immediate finish avg` は、選択手が代替候補より何点上だったか。正なら現在AIは削りを上に見ている。
