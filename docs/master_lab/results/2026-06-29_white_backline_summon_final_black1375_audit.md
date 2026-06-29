# White Backline Summon Audit Loop

生成: 2026-06-29T15:29:10.021Z
seedStart: 137100
候補: current_white_baseline
相手: black_1375_pressure
試行: 1 games/matchup/direction
総試合: 2

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 13
- 後列召喚: 7 (53.8%)
- 前列あり後列召喚: 5 (71.4%)
- うち前衛ロール: 3 (60%)
- デスシープ後列召喚: 0 (0%)
- デスシープ特技封じ損: 0 (0%) / W-L 0-0
- デスシープ特技封じ平均コマンド数: 0
- Backline patternあり: 3 (60%)
- Backline patternなし: 2 (40%)
- 次自ターン攻撃: 1 (20%)
- 次自ターン後列攻撃: 1 (20%)
- 次自ターン前進: 0 (0%)
- 次自ターン仕事なし: 4 (80%)
- Bad blocked summon: 2 (40%)
- Bad with evaluation trace: 0 (0%)
- Bad with non-summon alt: 0 (0%)
- Bad close non-summon alt: 0 (0%)
- Bad medium non-summon alt <=100: 0 (0%)
- Bad distant non-summon alt <=200: 0 (0%)
- Bad avg best non-summon gap: 0
- Bad top summon alt: 0 (0%)
- Bad top summon same card: 0 (0%)
- Bad top summon backline pattern: 0 (0%)
- Bad with other backline work in hand: 0 (0%)
- Bad consumes last back slot: 2 (100%)
- Bad leaves no empty back slot: 2 (100%)
- Avg no-reach front cards in back after bad: 1
- Bad with deck backline work: 2 (100%)
- Bad with deck top5 backline work: 1 (50%)
- Bad consumes last back slot with deck backline work: 2 (100%)
- Avg deck backline work cards after bad: 6.5
- Avg deck top5 backline work cards after bad: 0.5

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Death Sheep Lock | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_white_baseline | 0-2-0 | 13 | 7 (53.8%) | 5 (71.4%) | 3 (60%) | 0 (0%) | 3 (60%) | 2 (40%) | 1 (20%) | 1 (20%) | 0 (0%) | 4 (80%) | 2 (40%) | 0 (0%) | DeckReach2, DeckTop5Reach1, LastBack2, NoEmptyBack2 | 2 (40%) | 0/5 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Death Sheep Lock | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | black_1375_pressure | 0-2-0 | 5 | 0 (0%) | 3 (60%) | 2 (40%) | 4 (80%) | 2 (40%) | 0 (0%) |

## Samples

### blocked_no_pattern_no_work: ポリスピナー seed 137100 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ピグミィ,11:ピグミィ,12:ボムゾウ,13:ヤンバル,15:ボムゾウ,17:ヤンバル,23:ピグミィ / top5BackWork=2:ピグミィ / noReachFront=1:ドノマンティス,3:デスシープ,6:真勇者ダイン,7:真勇者ダイン,8:ドノマンティス,18:真勇者ダイン,19:デスシープ,21:ポリスピナー,...(+1)
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:wild_claw->monster:cpu_front_left / attack:player_front_right:storm_bomb->monster:cpu_front_left / focus:player_back_right / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: ためるは73点差で見送り、ためるは73点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ヤミー Lv1 HP5 prep / CB:ヤンバル Lv1 HP3 prep

### bad_blocked_no_eval_trace: ポリスピナー seed 137100 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ピグミィ,11:ピグミィ,12:ボムゾウ,13:ヤンバル,15:ボムゾウ,17:ヤンバル,23:ピグミィ / top5BackWork=2:ピグミィ / noReachFront=1:ドノマンティス,3:デスシープ,6:真勇者ダイン,7:真勇者ダイン,8:ドノマンティス,18:真勇者ダイン,19:デスシープ,21:ポリスピナー,...(+1)
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / attack:player_back_left:wild_claw->monster:cpu_front_left / attack:player_front_right:storm_bomb->monster:cpu_front_left / focus:player_back_right / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: ためるは73点差で見送り、ためるは73点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ボムゾウ Lv1 HP6 / PB:ヤンバル Lv1 HP3 / CF:真勇者ダイン Lv1 HP6 prep / CF:ヤミー Lv1 HP5 prep / CB:ヤンバル Lv1 HP3 prep

### blocked_no_pattern_no_work: ポリスピナー seed 137100 turn 6

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ポリスピナー Lv1 HP3 / stones after 6 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=7:ピグミィ,8:ボムゾウ,9:ヤンバル,11:ボムゾウ,13:ヤンバル,19:ピグミィ / top5BackWork=- / noReachFront=2:真勇者ダイン,3:真勇者ダイン,4:ドノマンティス,14:真勇者ダイン,15:デスシープ,17:ポリスピナー,20:ドノマンティス,21:デスシープ
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は47点差で見送り、ためるは64点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:ポリスピナー Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ヤミー Lv1 HP5 prep / CF:ナッツロックル Lv1 HP6 prep / CB:ポリスピナー Lv1 HP3 prep / CB:ヤンバル Lv1 HP3

### bad_blocked_no_eval_trace: ポリスピナー seed 137100 turn 6

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (player, loss)
- decision: player_back_right / role front / front ポリスピナー Lv1 HP3 / stones after 6 / score 26
- flags: no-backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=7:ピグミィ,8:ボムゾウ,9:ヤンバル,11:ボムゾウ,13:ヤンバル,19:ピグミィ / top5BackWork=- / noReachFront=2:真勇者ダイン,3:真勇者ダイン,4:ドノマンティス,14:真勇者ダイン,15:デスシープ,17:ポリスピナー,20:ドノマンティス,21:デスシープ
- special lock: -
- next turn: attack:player_front_left:attack->monster:cpu_front_left / master:master_attack->monster:cpu_front_left / attack:player_front_right:attack->monster:cpu_front_right / attack:player_front_right:attack->monster:cpu_front_right / ...
- reason: ポリスピナーを空き枠へ召喚 / 見送り: 召喚は47点差で見送り、ためるは64点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:ポリスピナー Lv1 HP3 / PB:ピグミィ Lv1 HP3 / CF:ヤミー Lv1 HP5 prep / CF:ナッツロックル Lv1 HP6 prep / CB:ポリスピナー Lv1 HP3 prep / CB:ヤンバル Lv1 HP3

### blocked_backline_pattern_worked: ヤンバル seed 137101 turn 1

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_right / role back / front デスシープ Lv1 HP6 prep / stones after 0 / score 68
- flags: backline-pattern, next-attack, next-backline-attack, very-low-stone, loss
- alternatives: no-trace
- hand pressure: backWork=ボムゾウ / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=4:ピグミィ,7:ボムゾウ,9:ピグミィ,10:ヤンバル,15:ボムゾウ,20:ヤンバル,24:ピグミィ / top5BackWork=4:ピグミィ / noReachFront=1:ポリスピナー,3:ポリスピナー,5:デスシープ,6:ドノマンティス,8:真勇者ダイン,11:真勇者ダイン,16:ドノマンティス,19:ポリスピナー,...(+2)
- special lock: -
- next turn: attack:cpu_front_right:attack->monster:player_front_right / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_back_right:wild_claw->monster:player_front_left / summon:cpu_bomuzo_3->cpu_back_left / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: 召喚は21点差で見送り、召喚は118点差で見送り
- board: PF:真勇者ダイン Lv1 HP6 prep / PF:ポリスピナー Lv1 HP3 prep / PB:ヤンバル Lv1 HP3 prep / CF:デスシープ Lv1 HP6 prep / CB:デスシープ Lv1 HP6 prep

### front_role_allowed_by_range: ボムゾウ seed 137101 turn 2

- variant/opponent: `current_white_baseline` vs `black_1375_pressure` (cpu, loss)
- decision: cpu_back_left / role front / front デスシープ Lv1 HP6 / stones after 3 / score 23
- flags: backline-pattern, next-no-work, loss
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=23 / backWork=3:ピグミィ,6:ボムゾウ,8:ピグミィ,9:ヤンバル,14:ボムゾウ,19:ヤンバル,23:ピグミィ / top5BackWork=3:ピグミィ / noReachFront=2:ポリスピナー,4:デスシープ,5:ドノマンティス,7:真勇者ダイン,10:真勇者ダイン,15:ドノマンティス,18:ポリスピナー,21:真勇者ダイン,...(+1)
- special lock: -
- next turn: attack:cpu_front_right:attack->master:player / attack:cpu_front_left:attack->monster:player_front_left / attack:cpu_back_right:wild_claw->monster:player_front_left / focus:cpu_back_left / ...
- reason: カードを後列左へ召喚 / 見送り: マスター特技は40点差で見送り、召喚は108点差で見送り
- board: PF:真勇者ダイン Lv1 HP3 / PB:ヤンバル Lv1 HP3 / CF:デスシープ Lv1 HP6 / CF:デスシープ Lv2 HP6 / CB:ヤンバル Lv1 HP3


## Notes

- この監査は前衛/後衛ラベルだけではなく、後列から攻撃できるパターンを別扱いにする。
- ボムゾウのような射程持ちは `Backline Pattern` 側に入り、今回の抑制候補からは外す。
- 前が詰まった後列に、後列攻撃パターンを持たないカードを置く例が一定数ある。ここだけを抑える候補は検証価値がある。
- 詰まり後列召喚が次自ターンの攻撃/前進に変換されない例が多い。召喚の盤面評価だけでなく次ターン仕事予定が必要。
- 詰まり後列召喚の多くは射程持ちカードでもあるため、一律ペナルティは避けるべき。
- 一部の bad summon には候補評価traceがない。古い結果ファイルではなく、このスクリプトで再生成した履歴を使う必要がある。
- bad summon の多くで非召喚代替が候補上位に残っていない。召喚候補だけでなく、end_turn/focus/attack の候補品質も確認する必要がある。
- bad summon が最後の後列空き枠を消費している。後から後衛カードを引いた時の置き場を潰す問題として扱うべき。
- bad summon が最後の後列空き枠を潰し、かつ残り山札に後列仕事カードがある。手札だけでなく次以降のドロー枠を守る評価が必要。
- bad summon 時点で山札上位5枚に後列仕事カードが残る例がある。近い将来の配置詰まりとして優先度を上げて見るべき。

## Next Loop Proposal

- 次候補は、最後の後列空き枠を潰す召喚で、残り山札に後列仕事カードがある場合を `summon now` と `hold slot` のターン計画比較に回す。
- 候補 `whiteBlockedBacklineNoWorkSummonPenalty` は一括スクリーニングだけで判断せず、同一seed比較で勝率と `blocked_no_pattern_no_work` 減少が両立する値だけ中母数確認する。
- ボムゾウ等の射程持ちを許容できているか、サンプルで `front_role_allowed_by_range` を確認する。

## Reading

- `Blocked`: 同レーン前列に自軍ユニットがいる後列召喚。
- `Backline Pattern`: 後列から攻撃しうる射程/攻撃パターンをカードが持つ。ボムゾウ系はここに入る。
- `No Pattern`: 後列から攻撃しにくいカード。ここが多い場合だけ抑制候補にする。
- `Death Sheep Lock`: デスシープを後列に置いたことで、同レーン味方前列の下段特技を封じたケース。
- `No Work`: 次自ターンにその召喚ユニットが攻撃も前進もしなかったケース。
- `Bad`: Blocked + No Pattern + No Work を満たす、今回もっとも疑う後列召喚。
- `Close Non-Summon`: Bad の局面で、選択召喚から35点以内に攻撃/ためる/移動/終了などの非召喚代替があったケース。
- `Medium Non-Summon`: Bad の局面で、選択召喚から100点以内に非召喚代替があったケース。
- `DeckReach`: Bad の局面で、残り山札に後列から仕事できるカードが残っていたケース。
- `DeckTop5Reach`: Bad の局面で、山札上位5枚に後列から仕事できるカードが残っていたケース。
