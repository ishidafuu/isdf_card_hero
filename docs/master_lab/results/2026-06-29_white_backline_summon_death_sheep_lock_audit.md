# White Backline Summon Audit Loop

生成: 2026-06-29T09:38:40.503Z
seedStart: 136400
候補: current_white_baseline
相手: white_current_mirror
試行: 1 games/matchup/direction
総試合: 2

## Purpose

前衛/後衛ラベルだけでなく、後列から実際に仕事できるかを見て、前列が詰まった同レーン後列召喚を監査する。ボムゾウのような射程持ちは許容側として扱う。

## Summary

- 召喚: 18
- 後列召喚: 11 (61.1%)
- 前列あり後列召喚: 9 (81.8%)
- うち前衛ロール: 5 (55.6%)
- デスシープ後列召喚: 0 (0%)
- デスシープ特技封じ損: 0 (0%) / W-L 0-0
- デスシープ特技封じ平均コマンド数: 0
- Backline patternあり: 6 (66.7%)
- Backline patternなし: 3 (33.3%)
- 次自ターン攻撃: 2 (22.2%)
- 次自ターン後列攻撃: 2 (22.2%)
- 次自ターン前進: 0 (0%)
- 次自ターン仕事なし: 7 (77.8%)
- Bad blocked summon: 3 (33.3%)
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
- Bad consumes last back slot: 2 (66.7%)
- Bad leaves no empty back slot: 2 (66.7%)
- Avg no-reach front cards in back after bad: 1.33
- Bad with deck backline work: 3 (100%)
- Bad with deck top5 backline work: 3 (100%)
- Bad consumes last back slot with deck backline work: 2 (66.7%)
- Avg deck backline work cards after bad: 4.67
- Avg deck top5 backline work cards after bad: 1

## Variant Metrics

| Variant | W-L-D | Summon | Backline | Blocked | Front Role Blocked | Death Sheep Lock | Backline Pattern | No Pattern | Next Attack | Backline Attack | Move Front | No Work | Bad | Close Non-Summon | Top Alt | Low Stone | Blocked W/L |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| current_white_baseline | 0-0-2 | 18 | 11 (61.1%) | 9 (81.8%) | 5 (55.6%) | 0 (0%) | 6 (66.7%) | 3 (33.3%) | 2 (22.2%) | 2 (22.2%) | 0 (0%) | 7 (77.8%) | 3 (33.3%) | 0 (0%) | DeckReach3, DeckTop5Reach3, LastBack2, NoEmptyBack2 | 4 (44.4%) | 0/0 |

## Opponent Breakdown

| Variant | Opponent | W-L-D | Blocked | Death Sheep Lock | Backline Pattern | No Pattern | No Work | Bad | Close Non-Summon |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | white_current_mirror | 0-0-2 | 9 | 0 (0%) | 6 (66.7%) | 3 (33.3%) | 7 (77.8%) | 3 (33.3%) | 0 (0%) |

## Samples

### blocked_backline_pattern_worked: ピグミィ seed 136400 turn 2

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role back / front ドノマンティス Lv1 HP5 / stones after 2 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=24 / backWork=2:ヤンバル,6:ボムゾウ,21:ヤンバル,22:ボムゾウ,23:ピグミィ,24:ヤンバル / top5BackWork=2:ヤンバル / noReachFront=4:デスシープ,5:真勇者ダイン,9:ポリスピナー,10:デスシープ,11:ドノマンティス,13:真勇者ダイン,14:真勇者ダイン,15:ポリスピナー,...(+3)
- special lock: -
- next turn: focus:player_front_right / attack:player_front_left:self_bomb->monster:cpu_front_left / focus:player_back_right / attack:player_back_left:スパイクボール->monster:cpu_front_right / ...
- reason: 後衛カードを後列右へ召喚 / 見送り: ためるは5点差で見送り、ためるは43点差で見送り
- board: PF:ボムゾウ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv1 HP3 / CF:デスシープ Lv1 HP6 prep / CB:デスシープ Lv1 HP6 prep / CB:ピグミィ Lv1 HP3 prep

### front_role_allowed_by_range: ボムゾウ seed 136400 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (player, draw)
- decision: player_back_right / role front / front 真勇者ダイン Lv1 HP6 prep / stones after 2 / score 23
- flags: backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=18 / backWork=15:ヤンバル,16:ボムゾウ,17:ピグミィ,18:ヤンバル / top5BackWork=- / noReachFront=3:ポリスピナー,4:デスシープ,5:ドノマンティス,7:真勇者ダイン,8:真勇者ダイン,9:ポリスピナー,10:ポリスピナー,12:ドノマンティス,...(+1)
- special lock: -
- next turn: attack:player_front_left:wild_claw->monster:cpu_back_left / focus:player_front_right / focus:player_back_right / master:shield->monster:player_front_right / ...
- reason: ボムゾウを空き枠へ召喚
- board: PF:デスシープ Lv1 HP6 / PF:真勇者ダイン Lv1 HP6 prep / PB:ヤンバル Lv2 HP3 / CF:ドノマンティス Lv1 HP5 / CB:ピグミィ Lv2 HP3

### front_role_allowed_by_range: ボムゾウ seed 136401 turn 3

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_right / role front / front ピグミィ Lv1 HP3 / stones after 3 / score 23
- flags: backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 1->0 / noReachBackAfter=0 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=22 / backWork=2:ピグミィ,7:ボムゾウ,12:ヤンバル,17:ボムゾウ,20:ピグミィ / top5BackWork=2:ピグミィ / noReachFront=1:真勇者ダイン,6:デスシープ,8:真勇者ダイン,9:デスシープ,10:ポリスピナー,13:ドノマンティス,15:デスシープ,16:ドノマンティス,...(+1)
- special lock: -
- next turn: focus:cpu_front_right / focus:cpu_front_left / summon:cpu_card_047_1->cpu_back_left / summon:cpu_card_037_3->cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は11点差で見送り、攻撃は13点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv2 HP3 / PB:デスシープ Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CF:ピグミィ Lv1 HP3 / CB:ヤンバル Lv1 HP3

### blocked_no_pattern_no_work: 真勇者ダイン seed 136401 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 4 / score 28
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=21 / backWork=1:ピグミィ,6:ボムゾウ,11:ヤンバル,16:ボムゾウ,19:ピグミィ / top5BackWork=1:ピグミィ / noReachFront=5:デスシープ,7:真勇者ダイン,8:デスシープ,9:ポリスピナー,12:ドノマンティス,14:デスシープ,15:ドノマンティス,17:ポリスピナー
- special lock: -
- next turn: focus:cpu_front_right / focus:cpu_front_left / focus:cpu_back_left / focus:cpu_back_right / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は3点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv2 HP3 / PB:デスシープ Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv1 HP6

### bad_blocked_no_eval_trace: 真勇者ダイン seed 136401 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_left / role front / front 真勇者ダイン Lv1 HP6 / stones after 4 / score 28
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ドノマンティス,ポリスピナー / emptyBack 2->1 / noReachBackAfter=1
- deck pressure: deck=21 / backWork=1:ピグミィ,6:ボムゾウ,11:ヤンバル,16:ボムゾウ,19:ピグミィ / top5BackWork=1:ピグミィ / noReachFront=5:デスシープ,7:真勇者ダイン,8:デスシープ,9:ポリスピナー,12:ドノマンティス,14:デスシープ,15:ドノマンティス,17:ポリスピナー
- special lock: -
- next turn: focus:cpu_front_right / focus:cpu_front_left / focus:cpu_back_left / focus:cpu_back_right / ...
- reason: カードを後列左へ召喚 / 見送り: 召喚は1点差で見送り、召喚は3点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv2 HP3 / PB:デスシープ Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv1 HP6

### blocked_no_pattern_no_work: ドノマンティス seed 136401 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 3 / score 24
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ピグミィ,6:ボムゾウ,11:ヤンバル,16:ボムゾウ,19:ピグミィ / top5BackWork=1:ピグミィ / noReachFront=5:デスシープ,7:真勇者ダイン,8:デスシープ,9:ポリスピナー,12:ドノマンティス,14:デスシープ,15:ドノマンティス,17:ポリスピナー
- special lock: -
- next turn: focus:cpu_front_right / focus:cpu_front_left / focus:cpu_back_left / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は23点差で見送り、マスター特技は209点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv2 HP3 / PB:デスシープ Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv1 HP6 / CB:真勇者ダイン Lv1 HP6 prep

### bad_blocked_no_eval_trace: ドノマンティス seed 136401 turn 4

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_right / role front / front ボムゾウ Lv1 HP6 / stones after 3 / score 24
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=2 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=21 / backWork=1:ピグミィ,6:ボムゾウ,11:ヤンバル,16:ボムゾウ,19:ピグミィ / top5BackWork=1:ピグミィ / noReachFront=5:デスシープ,7:真勇者ダイン,8:デスシープ,9:ポリスピナー,12:ドノマンティス,14:デスシープ,15:ドノマンティス,17:ポリスピナー
- special lock: -
- next turn: focus:cpu_front_right / focus:cpu_front_left / focus:cpu_back_left / focus:cpu_back_right / ...
- reason: カードを後列右へ召喚 / 見送り: 召喚は23点差で見送り、マスター特技は209点差で見送り
- board: PF:デスシープ Lv2 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv2 HP3 / PB:デスシープ Lv1 HP6 / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv1 HP6 / CB:真勇者ダイン Lv1 HP6 prep

### blocked_backline_pattern_worked: ピグミィ seed 136401 turn 6

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_left / role back / front 真勇者ダイン Lv1 HP6 / stones after 5 / score 67
- flags: backline-pattern, next-attack, next-backline-attack, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=ポリスピナー / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=19 / backWork=4:ボムゾウ,9:ヤンバル,14:ボムゾウ,17:ピグミィ / top5BackWork=4:ボムゾウ / noReachFront=3:デスシープ,5:真勇者ダイン,6:デスシープ,7:ポリスピナー,10:ドノマンティス,12:デスシープ,13:ドノマンティス,15:ポリスピナー
- special lock: -
- next turn: attack:cpu_back_left:スパイクボール->monster:player_front_right / attack:cpu_front_right:self_bomb->monster:player_front_right / focus:cpu_front_left / master:master_attack->monster:player_front_right / ...
- reason: 後衛カードを後列左へ召喚 / 見送り: 攻撃は22点差で見送り、召喚は190点差で見送り
- board: PF:デスシープ Lv1 HP6 / PF:ドノマンティス Lv1 HP5 / PB:ピグミィ Lv2 HP3 / PB:デスシープ Lv2 HP6 / CF:真勇者ダイン Lv1 HP6 / CF:ボムゾウ Lv1 HP6 / CB:ドノマンティス Lv1 HP5

### blocked_no_pattern_no_work: ポリスピナー seed 136401 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_right / role front / front ドノマンティス Lv2 HP5 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=2:ボムゾウ,7:ヤンバル,12:ボムゾウ,15:ピグミィ / top5BackWork=2:ボムゾウ / noReachFront=1:デスシープ,3:真勇者ダイン,4:デスシープ,5:ポリスピナー,8:ドノマンティス,10:デスシープ,11:ドノマンティス,13:ポリスピナー
- special lock: -
- next turn: attack:cpu_front_right:attack->monster:player_front_right / move:cpu_front_left->cpu_back_left / attack:cpu_back_left:スパイクボール->monster:player_front_right / summon:cpu_card_133_2->cpu_front_left / ...
- reason: カードを後列右へ召喚 / 見送り: マスター特技は567点差で見送り
- board: PF:デスシープ Lv2 HP6 / PB:ヤンバル Lv2 HP3 / PB:ピグミィ Lv1 HP3 prep / CF:真勇者ダイン Lv1 HP6 / CF:ドノマンティス Lv2 HP5 / CB:ピグミィ Lv1 HP3

### bad_blocked_no_eval_trace: ポリスピナー seed 136401 turn 8

- variant/opponent: `current_white_baseline` vs `white_current_mirror` (cpu, draw)
- decision: cpu_back_right / role front / front ドノマンティス Lv2 HP5 / stones after 2 / score 26
- flags: no-backline-pattern, next-no-work, draw
- alternatives: no-trace
- hand pressure: backWork=- / noReachFront=- / emptyBack 1->0 / noReachBackAfter=1 / consumes-last-back-slot / no-empty-back-slot
- deck pressure: deck=17 / backWork=2:ボムゾウ,7:ヤンバル,12:ボムゾウ,15:ピグミィ / top5BackWork=2:ボムゾウ / noReachFront=1:デスシープ,3:真勇者ダイン,4:デスシープ,5:ポリスピナー,8:ドノマンティス,10:デスシープ,11:ドノマンティス,13:ポリスピナー
- special lock: -
- next turn: attack:cpu_front_right:attack->monster:player_front_right / move:cpu_front_left->cpu_back_left / attack:cpu_back_left:スパイクボール->monster:player_front_right / summon:cpu_card_133_2->cpu_front_left / ...
- reason: カードを後列右へ召喚 / 見送り: マスター特技は567点差で見送り
- board: PF:デスシープ Lv2 HP6 / PB:ヤンバル Lv2 HP3 / PB:ピグミィ Lv1 HP3 prep / CF:真勇者ダイン Lv1 HP6 / CF:ドノマンティス Lv2 HP5 / CB:ピグミィ Lv1 HP3


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
