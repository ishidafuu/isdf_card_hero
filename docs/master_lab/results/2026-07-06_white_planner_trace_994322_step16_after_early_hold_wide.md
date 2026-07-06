# White Planner Decision Trace

生成: 2026-07-06T06:48:20.868Z
deck: `master-lab-white-1377-death-sheep3`
seed: 994322
direction: challenger-as-cpu
search: `{}`

## Conclusion

- winner: none, final score -114.
- planner decisions 7, attacks 1, focus 1, max decision 987.5ms.
- slow decisions >=5000ms: 0.
- Use this trace to pick exact turn/step targets before running expensive branch replay.

## Final

- state: turn 3 / current player / HP cpu/player 10/10 / stones cpu/player 3/3 / deck cpu/player 23/23 / hand cpu/player 4/3
- board: player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus | player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act1/1 | player_back_right:PB:ポリスピナー Lv1 HP3 act0/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP2 act1/1 | cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 focus

## Decisions

| step | turn | ms | decision | score | state | board | after | reason |
| ---: | ---: | ---: | --- | ---: | --- | --- | --- | --- |
| 4 | 1 | 428.1 | summon:真勇者ダイン->cpu_back_left | 28 | turn 1 / current cpu / HP cpu/player 10/10 / stones cpu/player 3/0 / deck cpu/player 24/25 / hand cpu/player 6/2 | player_front_left:PF:デスシープ Lv1 HP6 prep \| player_front_right:PF:ドノマンティス Lv1 HP5 prep \| player_back_left:PB:ヤンバル Lv1 HP3 prep | turn 1 / current cpu / HP cpu/player 10/10 / stones cpu/player 2/0 / deck cpu/player 24/25 / hand cpu/player 5/2 | カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面84点、次点と0点差 |
| 5 | 1 | 141.9 | summon:真勇者ダイン->cpu_front_left | 58 | turn 1 / current cpu / HP cpu/player 10/10 / stones cpu/player 2/0 / deck cpu/player 24/25 / hand cpu/player 5/2 | player_front_left:PF:デスシープ Lv1 HP6 prep \| player_front_right:PF:ドノマンティス Lv1 HP5 prep \| player_back_left:PB:ヤンバル Lv1 HP3 prep \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep | turn 1 / current cpu / HP cpu/player 10/10 / stones cpu/player 1/0 / deck cpu/player 24/25 / hand cpu/player 4/2 | 前衛カードを前列左へ召喚 / ターンプラン探索: 返し込み最終盤面33点、次点と0点差 |
| 6 | 1 | 65.9 | summon:デスシープ->cpu_front_right | 55 | turn 1 / current cpu / HP cpu/player 10/10 / stones cpu/player 1/0 / deck cpu/player 24/25 / hand cpu/player 4/2 | player_front_left:PF:デスシープ Lv1 HP6 prep \| player_front_right:PF:ドノマンティス Lv1 HP5 prep \| player_back_left:PB:ヤンバル Lv1 HP3 prep \| cpu_front_left:CF:真勇者ダイン Lv1 HP6 prep \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep | turn 1 / current cpu / HP cpu/player 10/10 / stones cpu/player 0/0 / deck cpu/player 24/25 / hand cpu/player 3/2 | 前衛カードを前列右へ召喚 / ターンプラン探索: 返し込み最終盤面-40点、次点と15点差 |
| 7 | 1 | 24 | end_turn | 0 | turn 1 / current cpu / HP cpu/player 10/10 / stones cpu/player 0/0 / deck cpu/player 24/25 / hand cpu/player 3/2 | player_front_left:PF:デスシープ Lv1 HP6 prep \| player_front_right:PF:ドノマンティス Lv1 HP5 prep \| player_back_left:PB:ヤンバル Lv1 HP3 prep \| cpu_front_left:CF:真勇者ダイン Lv1 HP6 prep \| cpu_front_right:CF:デスシープ Lv1 HP6 prep \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 prep | turn 2 / current player / HP cpu/player 10/10 / stones cpu/player 0/3 / deck cpu/player 24/24 / hand cpu/player 3/3 | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-224点 |
| 14 | 2 | 987.5 | focus:デスシープ | 38 | turn 2 / current cpu / HP cpu/player 10/10 / stones cpu/player 3/0 / deck cpu/player 23/24 / hand cpu/player 4/2 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus,shield \| player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus \| player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus \| player_back_right:PB:ポリスピナー Lv1 HP3 prep \| cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 \| cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 | turn 2 / current cpu / HP cpu/player 10/10 / stones cpu/player 3/0 / deck cpu/player 23/24 / hand cpu/player 4/2 | 有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面203点、次点と45点差 |
| 15 | 2 | 551.7 | attack:真勇者ダイン:ダイン斬り->デスシープ | 63.5 | turn 2 / current cpu / HP cpu/player 10/10 / stones cpu/player 3/0 / deck cpu/player 23/24 / hand cpu/player 4/2 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 focus,shield \| player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus \| player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus \| player_back_right:PB:ポリスピナー Lv1 HP3 prep \| cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 \| cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 | turn 2 / current cpu / HP cpu/player 10/10 / stones cpu/player 3/0 / deck cpu/player 23/24 / hand cpu/player 4/2 | デスシープを削れるため攻撃 / 見送り: ためるは57点差で見送り、マジックは79点差で見送り |
| 16 | 2 | 139.5 | end_turn | 0 | turn 2 / current cpu / HP cpu/player 10/10 / stones cpu/player 3/0 / deck cpu/player 23/24 / hand cpu/player 4/2 | player_front_left:PF:デスシープ Lv1 HP6 act1/1 shield \| player_front_right:PF:ドノマンティス Lv1 HP5 act1/1 focus \| player_back_left:PB:ヤンバル Lv1 HP3 act1/1 focus \| player_back_right:PB:ポリスピナー Lv1 HP3 prep \| cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 \| cpu_front_right:CF:デスシープ Lv1 HP6 act1/1 focus \| cpu_back_left:CB:真勇者ダイン Lv1 HP6 act0/1 | turn 3 / current player / HP cpu/player 10/10 / stones cpu/player 3/3 / deck cpu/player 23/23 / hand cpu/player 4/3 | 有効な行動がないためターン終了 / 白ミラー序盤: 前衛の仕事後に残りが低変換セットアップのみで、相手石が少ないため石と陣形を温存 |
