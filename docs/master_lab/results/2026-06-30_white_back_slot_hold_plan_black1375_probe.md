# White Back Slot Hold Plan Audit

生成: 2026-06-30T00:59:01.356Z
seedStart: 137100
相手: black_1375_pressure
試行: 1 games/matchup/direction
総試合: 2

## Purpose

最後の後列空き枠を、後列から仕事できない召喚で潰した局面について、`summon now` と `hold slot` の評価差を確認する。

## Summary

- 対象召喚: 2
- 評価traceあり: 2 (100%)
- W-L-D: 0-2-0
- Hold close <=35: 0 (0%)
- Hold medium <=80: 2 (100%)
- Hold distant <=160: 2 (100%)
- Hold altなし: 0 (0%)
- Hold gap平均: 68.4
- 同カード前列代替: 0 (0%)
- 同カード前列 close <=120: 0 (0%)
- 手札に他の後列仕事カード: 0 (0%)
- 山札に後列仕事カード: 2 (100%)
- 山札上位5枚に後列仕事カード: 1 (50%)
- Best hold type: focus:2

## Opponent Metrics

| Opponent | W-L-D | Records | Trace | Close Hold | Medium Hold | Distant Hold | No Hold | Same Card Front | Hand Back | Deck Top5 | Best Hold Types |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| black_1375_pressure | 0-2-0 | 2 | 2 (100%) | 0 (0%) | 2 (100%) | 2 (100%) | 0 (0%) | 0 (0%) | 0 (0%) | 1 (50%) | focus:2 |

## Samples

### medium_hold_alt: ポリスピナー -> player_back_right seed 137100 turn 2

- opponent/outcome: `black_1375_pressure` / player loss
- selected: ポリスピナー -> player_back_right / score 19 / front ボムゾウ Lv1 HP6 / stones 2
- best hold: focus:player_front_left / gap 73 / total -54
- best non-summon: focus:player_front_left / gap 73 / total -54
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=7 / top5=2:ピグミィ
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:wild_claw->monster:cpu_front_left / attack:player_front_right:storm_bomb->monster:cpu_front_left / focus:player_back_right / master:shield->monster:player_front_right / end_turn
- reason: ポリスピナーを空き枠へ召喚 / 見送り: ためるは73点差で見送り、ためるは73点差で見送り
- board: player_front_left:デスシープ Lv1 HP6 / player_front_right:ボムゾウ Lv1 HP6 / player_back_left:ヤンバル Lv1 HP3 / player_back_right:ポリスピナー Lv1 HP3 prep / cpu_front_left:真勇者ダイン Lv1 HP6 prep / cpu_front_right:ヤミー Lv1 HP5 prep / cpu_back_left:ヤンバル Lv1 HP3 prep

### top5_backline_work_wait: ポリスピナー -> player_back_right seed 137100 turn 2

- opponent/outcome: `black_1375_pressure` / player loss
- selected: ポリスピナー -> player_back_right / score 19 / front ボムゾウ Lv1 HP6 / stones 2
- best hold: focus:player_front_left / gap 73 / total -54
- best non-summon: focus:player_front_left / gap 73 / total -54
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=7 / top5=2:ピグミィ
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:wild_claw->monster:cpu_front_left / attack:player_front_right:storm_bomb->monster:cpu_front_left / focus:player_back_right / master:shield->monster:player_front_right / end_turn
- reason: ポリスピナーを空き枠へ召喚 / 見送り: ためるは73点差で見送り、ためるは73点差で見送り
- board: player_front_left:デスシープ Lv1 HP6 / player_front_right:ボムゾウ Lv1 HP6 / player_back_left:ヤンバル Lv1 HP3 / player_back_right:ポリスピナー Lv1 HP3 prep / cpu_front_left:真勇者ダイン Lv1 HP6 prep / cpu_front_right:ヤミー Lv1 HP5 prep / cpu_back_left:ヤンバル Lv1 HP3 prep

### medium_hold_alt: ポリスピナー -> player_back_right seed 137100 turn 6

- opponent/outcome: `black_1375_pressure` / player loss
- selected: ポリスピナー -> player_back_right / score -83.3 / front ポリスピナー Lv1 HP3 / stones 6
- best hold: focus:player_back_left / gap 63.7 / total -147
- best non-summon: focus:player_back_left / gap 63.7 / total -147
- same card front: -
- best backline-work summon: -
- pressure: handBack=- / deckBack=6 / top5=-
- next turn: attack:player_front_left:attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / summon:player_card_037_3->player_front_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / master:wake_up->monster:player_front_right / attack:player_front_right:attack->monster:cpu_front_right
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は47点差で見送り、ためるは64点差で見送り
- board: player_front_left:デスシープ Lv2 HP6 / player_front_right:ポリスピナー Lv1 HP3 / player_back_left:ピグミィ Lv1 HP3 / player_back_right:ポリスピナー Lv1 HP3 prep / cpu_front_left:ヤミー Lv1 HP5 prep / cpu_front_right:ナッツロックル Lv1 HP6 prep / cpu_back_left:ポリスピナー Lv1 HP3 prep / cpu_back_right:ヤンバル Lv1 HP3


## Notes

- 中距離の hold slot 代替が多い。強い禁止ではなく、ターン計画比較の追加評価が向いている。
- 山札上位5枚に後列仕事カードが残る例が多い。近い将来の置き場価値を局面評価に入れる価値がある。

## Next Loop Proposal

- 次は勝率係数ではなく、最後の後列枠を潰す召喚に対して `bestHold.deltaFromSelected` を記録する回帰ケースを作る。
- `hold slot` 候補が80点以内にある局面だけ、後列仕事カードの近いドローと同カード前列代替を加点/減点候補にする。
- 山札上位5枚に後列仕事カードがある場合だけ、枠保持の局面評価を追加する。全体の後列枠保存にはしない。
- 採用候補は黒限定 no-history で小母数確認し、白ミラーは最後に副作用確認だけ行う。
