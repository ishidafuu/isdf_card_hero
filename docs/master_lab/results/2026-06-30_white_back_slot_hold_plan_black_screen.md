# White Back Slot Hold Plan Audit

生成: 2026-06-30T01:00:39.348Z
seedStart: 137200
相手: black_1375_pressure, black_pressure_strong
試行: 2 games/matchup/direction
総試合: 8

## Purpose

最後の後列空き枠を、後列から仕事できない召喚で潰した局面について、`summon now` と `hold slot` の評価差を確認する。

## Summary

- 対象召喚: 2
- 評価traceあり: 2 (100%)
- W-L-D: 0-2-0
- Hold close <=35: 0 (0%)
- Hold medium <=80: 1 (50%)
- Hold distant <=160: 1 (50%)
- Hold altなし: 0 (0%)
- Hold gap平均: 151
- 同カード前列代替: 0 (0%)
- 同カード前列 close <=120: 0 (0%)
- 手札に他の後列仕事カード: 0 (0%)
- 山札に後列仕事カード: 2 (100%)
- 山札上位5枚に後列仕事カード: 2 (100%)
- Best hold type: focus:1, end:1

## Opponent Metrics

| Opponent | W-L-D | Records | Trace | Close Hold | Medium Hold | Distant Hold | No Hold | Same Card Front | Hand Back | Deck Top5 | Best Hold Types |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| black_1375_pressure | 0-4-0 | 1 | 1 (100%) | 0 (0%) | 1 (100%) | 1 (100%) | 0 (0%) | 0 (0%) | 0 (0%) | 1 (100%) | focus:1 |
| black_pressure_strong | 2-2-0 | 1 | 1 (100%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 1 (100%) | end:1 |

## Samples

### medium_hold_alt: デスシープ -> player_back_left seed 137201 turn 2

- opponent/outcome: `black_1375_pressure` / player loss
- selected: デスシープ -> player_back_left / score 16.6 / front 真勇者ダイン Lv1 HP6 / stones 2
- best hold: focus:player_front_left / gap 53.7 / total -37.2
- best non-summon: focus:player_front_left / gap 53.7 / total -37.2
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=8 / top5=1:ピグミィ,4:ボムゾウ
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / focus:player_back_left / master:shield->monster:player_front_left / end_turn
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は10点差で見送り、ためるは54点差で見送り
- board: player_front_left:真勇者ダイン Lv1 HP6 / player_front_right:デスシープ Lv1 HP6 / player_back_left:デスシープ Lv1 HP6 prep / player_back_right:ヤンバル Lv1 HP3 / cpu_front_left:真勇者ダイン Lv1 HP6 prep / cpu_front_right:ボムゾウ Lv1 HP6 prep / cpu_back_left:ピグミィ Lv1 HP3 prep

### top5_backline_work_wait: デスシープ -> player_back_left seed 137201 turn 2

- opponent/outcome: `black_1375_pressure` / player loss
- selected: デスシープ -> player_back_left / score 16.6 / front 真勇者ダイン Lv1 HP6 / stones 2
- best hold: focus:player_front_left / gap 53.7 / total -37.2
- best non-summon: focus:player_front_left / gap 53.7 / total -37.2
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=8 / top5=1:ピグミィ,4:ボムゾウ
- next turn: attack:player_back_right:wild_claw->monster:cpu_front_left / attack:player_front_left:ダイン斬り->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / focus:player_back_left / master:shield->monster:player_front_left / end_turn
- reason: デスシープを空き枠へ召喚 / 見送り: 召喚は10点差で見送り、ためるは54点差で見送り
- board: player_front_left:真勇者ダイン Lv1 HP6 / player_front_right:デスシープ Lv1 HP6 / player_back_left:デスシープ Lv1 HP6 prep / player_back_right:ヤンバル Lv1 HP3 / cpu_front_left:真勇者ダイン Lv1 HP6 prep / cpu_front_right:ボムゾウ Lv1 HP6 prep / cpu_back_left:ピグミィ Lv1 HP3 prep

### top5_backline_work_wait: 真勇者ダイン -> player_back_left seed 137205 turn 13

- opponent/outcome: `black_pressure_strong` / player loss
- selected: 真勇者ダイン -> player_back_left / score 52 / front ボムゾウ Lv2 HP5 / stones 7
- best hold: end_turn / gap 248.3 / total -196.3
- best non-summon: end_turn / gap 248.3 / total -196.3
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=3 / top5=1:ヤンバル,2:ヤンバル
- next turn: attack:player_front_left:storm_bomb->monster:cpu_back_left / attack:player_front_right:attack->master:cpu / attack:player_back_right:storm_bomb->monster:cpu_front_left / focus:player_back_left / master:master_attack->monster:cpu_front_left / master:shield->monster:player_front_left / end_turn
- reason: 真勇者ダインを空き枠へ召喚 / 見送り: 召喚は16点差で見送り、召喚は16点差で見送り
- board: player_front_left:ボムゾウ Lv2 HP5 / player_front_right:デスシープ Lv1 HP6 / player_back_left:真勇者ダイン Lv1 HP6 prep / player_back_right:ボムゾウ Lv1 HP3 / cpu_front_left:ヒートロン Lv1 HP5 prep / cpu_back_right:ビヨンド Lv1 HP2


## Notes

- 中距離の hold slot 代替が多い。強い禁止ではなく、ターン計画比較の追加評価が向いている。
- 山札上位5枚に後列仕事カードが残る例が多い。近い将来の置き場価値を局面評価に入れる価値がある。

## Next Loop Proposal

- 次は勝率係数ではなく、最後の後列枠を潰す召喚に対して `bestHold.deltaFromSelected` を記録する回帰ケースを作る。
- `hold slot` 候補が80点以内にある局面だけ、後列仕事カードの近いドローと同カード前列代替を加点/減点候補にする。
- 山札上位5枚に後列仕事カードがある場合だけ、枠保持の局面評価を追加する。全体の後列枠保存にはしない。
- 採用候補は黒限定 no-history で小母数確認し、白ミラーは最後に副作用確認だけ行う。
