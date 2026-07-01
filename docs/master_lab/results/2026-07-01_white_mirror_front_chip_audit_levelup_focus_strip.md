# White Mirror Front Chip Response Audit

生成: 2026-07-01T08:55:49.460Z
デッキ: `master-lab-white-1377-death-sheep3` vs `master-lab-white-1377-death-sheep3`
seed: 964000 から各方向最大 12
探索: depth 3 / width 4 / terminal 6x2 weight 2 / opponent 2x1 weight 0.35

## Summary

- games: 2 / completed: 2
- events: 40
- converted same turn: 33
- target acted on response: 7
- target acted after prior response action: 1
- harmful response: 2
- board harmful response: 0
- master-only response: 2
- damaged master: 2
- damaged own monster: 0
- killed own monster: 0
- target leveled up on response: 0
- focus alternative available: 30
- immediate finish alternative available: 2
- avg target HP after chip: 2.6
- selected minus best focus avg: 303
- selected minus immediate finish avg: 283.4

## Buckets

- by HP after: HP2:12, HP1:11, HP4:8, HP5:5, HP3:4
- by decision: attack:28, master_attack:12
- by target: 真勇者ダイン Lv1:10, デスシープ Lv1:9, ドノマンティス Lv1:5, デスシープ Lv2:4, ポリスピナー Lv2:3, 真勇者ダイン Lv3:3, ヤンバル Lv2:2, ピグミィ Lv2:1, ボムゾウ Lv1:1, ポリスピナー Lv1:1, ヤンバル Lv1:1
- first prior response action: focus:1
- harmful first prior response action: -

## Conclusion

- 非リーサル前衛削りは 40件。返しで対象が行動したのは 7件、従来の被害判定は 2件、同ターン中に処理へ変換できたのは 33件。
- 対象が動く前に返し側の別行動が入ったものは 1件。単純な「対象が即動けるか」だけでは拾えない返し手順が残っている。
- 盤面被害は 0件、マスターのみ被弾は 2件。白ミラーでは盤面被害を主指標にし、マスターのみ被弾は詰めろ圏かどうかを別途見る。
- 盤面被害の内訳は、残HP1が 0件、残HP2以上が 0件。
- 盤面被害イベントのうち、ためる代替が候補にあったものは 0件。即撃破代替が候補にあった削りは全体で 2件。
- 今回の母数では、非リーサル前衛削りが盤面被害へ直結する例は出なかった。マスターのみ被弾を避けるために盤面制圧を落とす調整は不要。

## Samples

### harmful_response / seed 964000 / A-as-player / turn 12

- selected: master master_attack -> 真勇者ダイン@player_front_right / score -238
- target: 真勇者ダイン Lv3 5->3 at player_front_right
- attacker: white master
- stones: acting 4->1, response 0->0
- alternatives: focus -, finish -, end end turn (-127.5)
- response action: 真勇者ダイン ダイン斬り -> cpu master
- flags: acted=true, masterDamage=2, monsterDamage=false, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 9/10 / stones P/C 0/4 / hand P/C 5/4
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 focus | cpu_front_right:CF:ボムゾウ Lv1 HP6 prep | player_front_left:PF:ボムゾウ Lv2 HP5 act0/1 | player_front_right:PF:真勇者ダイン Lv3 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 prep
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ピグミィ Lv1 HP3 act2/2 focus | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 focus | cpu_front_right:CF:ボムゾウ Lv1 HP6 prep | player_front_left:PF:ボムゾウ Lv2 HP5 act0/1 | player_front_right:PF:真勇者ダイン Lv3 HP3 act1/1 | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 prep
- final: cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ボムゾウ Lv1 HP6 act0/1 | player_front_left:PF:ボムゾウ Lv2 HP2 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP3 act1/1 | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1

### harmful_response / seed 964000 / A-as-player / turn 12

- selected: ピグミィ スパイクボール -> 真勇者ダイン@player_front_right / score -137
- target: 真勇者ダイン Lv3 6->5 at player_front_right
- attacker: ピグミィ
- stones: acting 4->4, response 0->0
- alternatives: focus focus ピグミィ (-38.6), finish -, end end turn (-141)
- response action: 真勇者ダイン ダイン斬り -> cpu master
- flags: acted=true, masterDamage=2, monsterDamage=false, monsterKill=false, levelUp=false, converted=false
- state: HP P/C 9/10 / stones P/C 0/4 / hand P/C 5/4
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 | cpu_back_right:CB:ピグミィ Lv1 HP3 act1/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 focus | cpu_front_right:CF:ボムゾウ Lv1 HP6 prep | player_front_left:PF:ボムゾウ Lv2 HP5 act0/1 | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 prep
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act2/2 | cpu_back_right:CB:ピグミィ Lv1 HP3 act1/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 focus | cpu_front_right:CF:ボムゾウ Lv1 HP6 prep | player_front_left:PF:ボムゾウ Lv2 HP5 act0/1 | player_front_right:PF:真勇者ダイン Lv3 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 prep
- final: cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2 focus | cpu_front_left:CF:ピグミィ Lv1 HP3 act0/2 | cpu_front_right:CF:ボムゾウ Lv1 HP6 act0/1 | player_front_left:PF:ボムゾウ Lv2 HP2 act1/1 | player_front_right:PF:真勇者ダイン Lv3 HP3 act1/1 | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:ヤンバル Lv1 HP3 act1/1

### converted / seed 964000 / A-as-player / turn 5

- selected: master master_attack -> デスシープ@player_front_right / score 396.8
- target: デスシープ Lv1 3->1 at player_front_right
- attacker: white master
- stones: acting 4->1, response 2->2
- alternatives: focus focus 真勇者ダイン (-352.8), finish -, end end turn (-361.3)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 10/10 / stones P/C 2/4 / hand P/C 4/5
- before: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | player_front_left:PF:デスシープ Lv1 HP2 act1/1 focus,shield | player_front_right:PF:デスシープ Lv1 HP3 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1 focus
- after chip: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | player_front_left:PF:デスシープ Lv1 HP2 act1/1 focus,shield | player_front_right:PF:デスシープ Lv1 HP1 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1 focus
- final: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:デスシープ Lv1 HP2 act1/1 focus,shield | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1 focus

### converted / seed 964000 / A-as-player / turn 5

- selected: ヤンバル wild_claw -> デスシープ@player_front_right / score 381.1
- target: デスシープ Lv1 4->3 at player_front_right
- attacker: ヤンバル
- stones: acting 4->4, response 2->2
- alternatives: focus focus デスシープ (-149.4), finish -, end end turn (-331.9)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 10/10 / stones P/C 2/4 / hand P/C 4/5
- before: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | player_front_left:PF:デスシープ Lv1 HP2 act1/1 focus,shield | player_front_right:PF:デスシープ Lv1 HP4 act1/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1 focus
- after chip: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | player_front_left:PF:デスシープ Lv1 HP2 act1/1 focus,shield | player_front_right:PF:デスシープ Lv1 HP3 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1 focus
- final: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:デスシープ Lv1 HP2 act1/1 focus,shield | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 focus | player_back_right:PB:ドノマンティス Lv1 HP5 act0/1 focus

### converted / seed 964000 / A-as-player / turn 6

- selected: ボムゾウ storm_bomb -> デスシープ@cpu_front_right / score 334.9
- target: デスシープ Lv2 3->2 at cpu_front_right
- attacker: ボムゾウ
- stones: acting 6->6, response 0->0
- alternatives: focus -, finish -, end end turn (-916.3)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 10/10 / stones P/C 6/0 / hand P/C 5/5
- before: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP3 act1/1 | player_front_left:PF:デスシープ Lv1 HP2 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 focus
- after chip: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP2 act1/1 | player_front_left:PF:デスシープ Lv1 HP2 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1
- final: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | player_front_left:PF:デスシープ Lv1 HP2 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1

### converted / seed 964000 / A-as-player / turn 6

- selected: ドノマンティス attack -> デスシープ@cpu_front_right / score 117
- target: デスシープ Lv2 6->3 at cpu_front_right
- attacker: ドノマンティス
- stones: acting 6->6, response 0->0
- alternatives: focus focus デスシープ (-173), finish -, end end turn (-522.4)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 10/10 / stones P/C 6/0 / hand P/C 5/5
- before: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:デスシープ Lv1 HP2 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 focus | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 focus
- after chip: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP3 act1/1 | player_front_left:PF:デスシープ Lv1 HP2 act0/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act0/1 focus
- final: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | player_front_left:PF:デスシープ Lv1 HP2 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1

### converted / seed 964000 / A-as-player / turn 6

- selected: 真勇者ダイン ダイン斬り -> デスシープ@player_front_left / score 286
- target: デスシープ Lv1 2->1 at player_front_left
- attacker: 真勇者ダイン
- stones: acting 4->4, response 0->0
- alternatives: focus focus 真勇者ダイン (-251.1), finish -, end end turn (-390.5)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 10/10 / stones P/C 0/4 / hand P/C 4/5
- before: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:デスシープ Lv1 HP2 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 prep
- after chip: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:デスシープ Lv1 HP1 act1/1 shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 prep
- final: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 prep

### converted / seed 964000 / A-as-player / turn 7

- selected: ドノマンティス attack -> ヤンバル@cpu_front_right / score 374.2
- target: ヤンバル Lv1 3->1 at cpu_front_right
- attacker: ドノマンティス
- stones: acting 4->4, response 1->1
- alternatives: focus focus 真勇者ダイン (-330.2), finish -, end end turn (-762)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 10/10 / stones P/C 4/1 / hand P/C 5/5
- before: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP3 act1/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act0/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1
- after chip: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:ヤンバル Lv1 HP1 act1/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1
- final: cpu_back_left:CB:デスシープ Lv1 HP5 act0/1 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 prep | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ボムゾウ Lv1 HP6 act1/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1

### converted / seed 964000 / A-as-player / turn 8

- selected: master master_attack -> ドノマンティス@player_front_right / score 440.4
- target: ドノマンティス Lv1 4->2 at player_front_right
- attacker: white master
- stones: acting 5->2, response 1->1
- alternatives: focus focus ピグミィ (-188.2), finish -, end end turn (-464.6)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 10/10 / stones P/C 1/5 / hand P/C 5/6
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus,shield | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1 focus
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus,shield | player_front_right:PF:ドノマンティス Lv1 HP2 act1/1 | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1 focus
- final: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus,shield | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1 focus

### converted / seed 964000 / A-as-player / turn 8

- selected: ヤンバル wild_claw -> ドノマンティス@player_front_right / score 405.9
- target: ドノマンティス Lv1 5->4 at player_front_right
- attacker: ヤンバル
- stones: acting 5->5, response 1->1
- alternatives: focus focus デスシープ (-182.3), finish -, end end turn (-385.2)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 10/10 / stones P/C 1/5 / hand P/C 5/6
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus,shield | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1 focus
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP5 act0/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus,shield | player_front_right:PF:ドノマンティス Lv1 HP4 act1/1 | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1 focus
- final: cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 focus,shield | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:真勇者ダイン Lv1 HP6 act0/1 focus

### converted / seed 964000 / A-as-player / turn 9

- selected: master master_attack -> 真勇者ダイン@cpu_front_left / score 339.7
- target: 真勇者ダイン Lv1 4->2 at cpu_front_left
- attacker: white master
- stones: acting 4->1, response 1->1
- alternatives: focus focus ボムゾウ (-381.7), finish -, end end turn (-610.2)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 10/10 / stones P/C 4/1 / hand P/C 5/5
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP4 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP2 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- final: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:ボムゾウ Lv1 HP4 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:ドノマンティス Lv1 HP5 prep

### converted / seed 964000 / A-as-player / turn 9

- selected: ボムゾウ storm_bomb -> 真勇者ダイン@cpu_front_left / score 189
- target: 真勇者ダイン Lv1 6->4 at cpu_front_left
- attacker: ボムゾウ
- stones: acting 4->4, response 1->1
- alternatives: focus focus ボムゾウ (-231), finish -, end end turn (-398.1)
- flags: acted=false, masterDamage=0, monsterDamage=false, monsterKill=false, levelUp=false, converted=true
- state: HP P/C 10/10 / stones P/C 4/1 / hand P/C 5/5
- before: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_left:PB:ボムゾウ Lv2 HP5 act0/1 | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- after chip: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP4 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:ボムゾウ Lv1 HP6 act0/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:ドノマンティス Lv1 HP5 prep
- final: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 focus | cpu_back_right:CB:ヤンバル Lv1 HP3 act1/1 | cpu_front_right:CF:デスシープ Lv2 HP6 act1/1 | player_front_left:PF:ボムゾウ Lv1 HP4 act1/1 | player_front_right:PF:真勇者ダイン Lv1 HP6 act0/1 focus | player_back_left:PB:ボムゾウ Lv2 HP5 act1/1 | player_back_right:PB:ドノマンティス Lv1 HP5 prep


## Reading

- `converted same turn` は削った対象を相手ターン前に処理できたケース。
- `harmful response` は削った対象が返しにマスター/味方へ被害、撃破、またはレベルアップを発生させたケース。
- `board harmful response` は味方モンスター被害/撃破/相手レベルアップに絞ったケース。白ミラーの主指標。
- `master-only response` は盤面被害なしでマスターだけ被弾したケース。白ミラーでは詰めろ圏でなければ許容寄りに読む。
- `selected minus best focus avg` と `selected minus immediate finish avg` は、選択手が代替候補より何点上だったか。正なら現在AIは削りを上に見ている。
