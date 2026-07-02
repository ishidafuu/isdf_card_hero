# White Mirror Decision Alternative Audit Summary

- date: 2026-07-03
- matchup: white_current_mirror only
- deck: master-lab-white-1377-death-sheep3
- variant: current_white_baseline
- purpose: bad action が出た局面で、AIが見送った近い代替候補を確認する

## Runs

| report | games | W-L-D | flagged | close best alt | notes |
|---|---:|---:|---:|---:|---|
| `2026-07-03_white_mirror_decision_alternative_audit_gpm1` | 2 | 1-0-1 | 83/177 | 22 | reason trace only |
| `2026-07-03_white_mirror_decision_alternative_audit_gpm2_seed992100` | 4 | 0-1-3 | 151/373 | 39 | reason trace only |
| `2026-07-03_white_mirror_decision_alternative_audit_blocked_trace_gpm1` | 2 | 1-0-1 | 90/185 | 29 | blocked-backline summon only detailed trace |

`close best alt` は、最良代替が現選択から 24 点以内だった回数。

## Combined Reason-Trace Result

reason trace の 6 games 合算。

| kind | count | low stone | punished | close best alt | reading |
|---|---:|---:|---:|---:|---|
| `low_stone_summon` | 55 | 55 | 26 | 27 | 代替が近い。最初に詰める価値が高い。 |
| `blocked_backline_summon` | 13 | 10 | 10 | 9 | 件数は少なめだが close 率が高い。 |
| `last_back_slot_summon` | 29 | 20 | 20 | 10 | 後列枠管理の問題として残る。 |
| `summon_no_work_no_attack_punished` | 11 | 11 | 11 | 4 | 悪い局面はあるが、代替が常に近いわけではない。 |
| `low_stone_focus` | 65 | 65 | 35 | 10 | 頻度は高いが、現AIはかなり強く選んでいる。 |
| `low_stone_focus_no_work_punished` | 19 | 19 | 19 | 2 | broad penalty ではなく局面条件が必要。 |
| `non_kill_monster_attack` | 87 | 62 | 54 | 18 | 多いが、削り・撃破圏作りも含むため雑に悪手扱いしない。 |
| `non_lethal_face_attack` | 17 | 6 | 8 | 2 | 今回の優先度は低い。 |

代替候補側では、`summon_other` が 86 件中 close 25、`attack_first` が 105 件中 close 19、`focus_only` が 71 件中 close 15。
召喚系は候補差が近く、局面を少し補正するだけで行動が変わる可能性がある。

## Blocked-Backline Detailed Trace

`--trace-mode blocked-backline` では、後列詰まり召喚だけ詳細評価を取得した。

| item | value |
|---|---:|
| traced decision events | 12 |
| blocked_backline_summon | 5 |
| blocked_backline close best alt | 4 |
| blocked_backline >= selected | 1 |
| `summon_different_slot` available | 1 |
| `summon_skip` available | 8 |

重要サンプル:

- seed 992100 turn 4 step 27: デスシープを `player_back_left` に置いたが、同じデスシープを `player_back_right` に置く候補が同点だった。
- seed 992100 turn 5 step 38: ドノマンティス後列召喚に対し、既存デスシープの focus が -12.1 点差で近かった。
- seed 992100 turn 9 step 81: デスシープ後列召喚に対し、真勇者ダインで敵前衛を殴る候補が -3.8 点差だった。
- seed 992100 turn 15 step 164: ドノマンティス後列召喚に対し、ヤンバルで敵前衛を殴る候補が -4.1 点差だった。

これを見る限り、後列詰まり召喚は「一律禁止」ではなく、以下に絞るべき。

- 後列から攻撃できない前衛型を、味方前衛の後ろに置く。
- 低石、または最後の後列枠を埋める。
- 同ターン仕事がない。
- 既存アクティブ駒の敵前衛攻撃、または同カード別slotが僅差で存在する。

## Interpretation

### 1. 次に詰める本命は召喚系

`low_stone_summon` と `blocked_backline_summon` は close 率が高い。
前回の `whiteBlockedBacklineNoWorkSummonPenalty` 一律強化は副作用が大きかったが、今回の監査では「どの召喚を落とすべきか」が少し絞れた。

候補は、係数強化ではなく以下のような局面ルール。

- blocked backline no pattern
- low stone or fills last back slot
- no same-turn work
- same-card different slot または attack/focus alternative が僅差

### 2. focus はまだ直接触らない

`low_stone_focus_no_work_punished` は 19 件あるが、close は 2 件だけ。
現AIはそのfocusをかなり強く選んでおり、単純に focus を下げると盤面制圧まで壊す可能性が高い。

focus を触るなら、まず「敵前衛処理を放棄している focus」だけを再現局面で見る。

### 3. 倒しきれない攻撃は別監査に分ける

`non_kill_monster_attack` は 87 件と多いが、白ミラーでは削り・撃破圏作り・後衛小打点も多く含む。
ここを雑に抑えると、白の盤面制圧力を落とす。

次に見るなら、倒しきれない攻撃のうち以下だけに絞る。

- 攻撃後も相手前衛が主要打点源として残る。
- 次自ターンまでに撃破へ変換されない。
- focus_only / wake_first が close だった。
- 低石で、攻撃後に防御手段が消える。

## Next Loop Proposal

次は大きい勝率ループではなく、seed/step 再現型の局面比較に移る。

1. seed と step から同じ局面を再現できる helper を作る。
2. blocked_backline close samples だけを対象にする。
3. selected summon / same-card different slot / attack_first / focus_only / end_turn を同じ局面から1手適用する。
4. その後、相手ターン開始または次自ターン開始まで進めた評価を比較する。
5. 比較で明確に selected が負けているパターンだけ、AIルール候補にする。

現時点では AI 本体の挙動変更は見送る。
