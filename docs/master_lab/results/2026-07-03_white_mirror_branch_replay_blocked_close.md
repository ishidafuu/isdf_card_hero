# White Mirror Branch Replay Audit

生成: 2026-07-03T08:06:52.024Z
input: docs/master_lab/results/2026-07-03_white_mirror_decision_alternative_audit_blocked_trace_gpm1.json
samples: 4/4

## Summary

- selected mismatch: 0
- samples with better alternative: 2
- samples with materially better alternative: 1

## Conclusion

- replayed samples: 4, selected best: 2, better alternative: 2, materially better: 1, selected mismatch: 0
- best branch kinds: selected:2, attack_first:1, focus_only:1
- blocked-backline summon has at least one replay-backed bad pattern. Candidate rule should target only those patterns.

## Next Loop Proposal

- Extract shared conditions from materially better alternatives, then implement a candidate variant rather than a broad penalty.
- Run a small white-mirror candidate loop with only that narrow blocked-backline rule.

## Samples

| seed | step | turn | match | source selected | replay selected | source best | best branch | rank | score delta | reading |
|---:|---:|---:|---|---|---|---|---|---:|---:|---|
| 992100 | 27 | 4 | yes | summon:player_card_133_1->player_back_left | summon:player_card_133_1->player_back_left | summon_different_slot:summon:player_card_133_1->player_back_right | selected | 1 | 0 | selected remains best after replay |
| 992100 | 38 | 5 | yes | summon:player_card_037_2->player_back_right | summon:player_card_037_2->player_back_right | focus_only:focus:player_back_left | selected | 1 | 0 | selected remains best after replay |
| 992100 | 81 | 9 | yes | summon:player_card_133_2->player_back_right | summon:player_card_133_2->player_back_right | attack_first:attack:player_front_left:ダイン斬り->monster:cpu_front_left | attack_first | 2 | 166 | attack_first is materially better after replay; blocked summon is a candidate for a narrow rule |
| 992100 | 164 | 15 | yes | summon:player_card_037_3->player_back_left | summon:player_card_037_3->player_back_left | attack_first:attack:player_back_right:wild_claw->monster:cpu_front_left | focus_only | 2 | 60 | focus_only is slightly better after replay; inspect before rule adoption |

## Branch Details

### seed 992100 step 27

pre: player HP10 S3 B376 H5 / cpu HP10 S1 B687 H4 / player_front_left:player:真勇者ダイン L1 HP6 active | player_front_right:player:デスシープ L1 HP6 active | cpu_front_left:cpu:ドノマンティス L1 HP5 active | cpu_front_right:cpu:デスシープ L1 HP6 active shield | cpu_back_left:cpu:ドノマンティス L1 HP5 active | cpu_back_right:cpu:ピグミィ L1 HP3 active

| branch | eval delta | applied | steps | winner | score | board | hp | stones | hand | monsters | decision | state |
|---|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---|---|
| selected | 0 | yes | 8 | - | -113 | -123 | 0 | 1 | 0 | 3-4 | summon:player_card_133_1->player_back_left | player HP10 S3 B564 H5 / cpu HP10 S2 B687 H5 / player_front_left:player:真勇者ダイン L1 HP6 active \| player_front_right:player:デスシープ L1 HP6 active \| player_back_left:player:デスシープ L1 HP6 active \| cpu_front_left:cpu:ドノマンティス L1 HP5 active \| cpu_front_right:cpu:デスシープ L1 HP6 active shield \| cpu_back_left:cpu:ドノマンティス L1 HP5 active \| cpu_back_right:cpu:ピグミィ L1 HP3 active |
| same_card_different_slot | 0 | yes | 8 | - | -113 | -123 | 0 | 1 | 0 | 3-4 | summon:player_card_133_1->player_back_right | player HP10 S3 B564 H5 / cpu HP10 S2 B687 H5 / player_front_left:player:真勇者ダイン L1 HP6 active \| player_front_right:player:デスシープ L1 HP6 active \| player_back_right:player:デスシープ L1 HP6 active \| cpu_front_left:cpu:ドノマンティス L1 HP5 active \| cpu_front_right:cpu:デスシープ L1 HP6 active shield \| cpu_back_left:cpu:ドノマンティス L1 HP5 active \| cpu_back_right:cpu:ピグミィ L1 HP3 active |
| end_turn | -318.7 | yes | 6 | - | -253 | -311 | 0 | 4 | 1 | 2-4 | end_turn | player HP10 S6 B376 H6 / cpu HP10 S2 B687 H5 / player_front_left:player:真勇者ダイン L1 HP6 active \| player_front_right:player:デスシープ L1 HP6 active \| cpu_front_left:cpu:ドノマンティス L1 HP5 active \| cpu_front_right:cpu:デスシープ L1 HP6 active shield \| cpu_back_left:cpu:ドノマンティス L1 HP5 active \| cpu_back_right:cpu:ピグミィ L1 HP3 active |

### seed 992100 step 38

pre: player HP10 S3 B564 H5 / cpu HP10 S2 B687 H5 / player_front_left:player:真勇者ダイン L1 HP6 active | player_front_right:player:デスシープ L1 HP6 active | player_back_left:player:デスシープ L1 HP6 active | cpu_front_left:cpu:ドノマンティス L1 HP5 active | cpu_front_right:cpu:デスシープ L1 HP6 active shield | cpu_back_left:cpu:ドノマンティス L1 HP5 active | cpu_back_right:cpu:ピグミィ L1 HP3 active

| branch | eval delta | applied | steps | winner | score | board | hp | stones | hand | monsters | decision | state |
|---|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---|---|
| selected | 0 | yes | 10 | - | 23 | -7 | 0 | 3 | 0 | 4-4 | summon:player_card_037_2->player_back_right | player HP10 S3 B680 H5 / cpu HP10 S0 B687 H5 / player_front_left:player:真勇者ダイン L1 HP6 active \| player_front_right:player:デスシープ L1 HP3 active \| player_back_left:player:デスシープ L1 HP6 active \| player_back_right:player:ドノマンティス L1 HP5 active \| cpu_front_left:cpu:ドノマンティス L1 HP5 active \| cpu_front_right:cpu:デスシープ L1 HP6 active shield \| cpu_back_left:cpu:ドノマンティス L1 HP5 active \| cpu_back_right:cpu:ピグミィ L1 HP3 active |
| focus_only | -12.1 | yes | 10 | - | 23 | -7 | 0 | 3 | 0 | 4-4 | focus:player_back_left | player HP10 S3 B680 H5 / cpu HP10 S0 B687 H5 / player_front_left:player:真勇者ダイン L1 HP6 active \| player_front_right:player:デスシープ L1 HP3 active \| player_back_left:player:デスシープ L1 HP6 active \| player_back_right:player:ドノマンティス L1 HP5 active \| cpu_front_left:cpu:ドノマンティス L1 HP5 active \| cpu_front_right:cpu:デスシープ L1 HP6 active shield \| cpu_back_left:cpu:ドノマンティス L1 HP5 active \| cpu_back_right:cpu:ピグミィ L1 HP3 active |
| end_turn | -289.2 | yes | 5 | - | -70 | -98 | 0 | 1 | 1 | 3-4 | end_turn | player HP10 S6 B564 H6 / cpu HP10 S5 B662 H5 / player_front_left:player:真勇者ダイン L1 HP6 active \| player_front_right:player:デスシープ L1 HP6 active \| player_back_left:player:デスシープ L1 HP6 active \| cpu_front_left:cpu:ドノマンティス L1 HP5 active \| cpu_front_right:cpu:デスシープ L1 HP6 active \| cpu_back_left:cpu:ドノマンティス L1 HP5 active \| cpu_back_right:cpu:ピグミィ L1 HP3 active |

### seed 992100 step 81

pre: player HP10 S5 B510 H6 / cpu HP10 S0 B760 H5 / player_front_left:player:真勇者ダイン L1 HP6 active | player_front_right:player:ポリスピナー L1 HP3 active | player_back_left:player:デスシープ L1 HP6 active | cpu_front_left:cpu:ドノマンティス L1 HP5 active | cpu_front_right:cpu:デスシープ L2 HP6 active | cpu_back_left:cpu:真勇者ダイン L1 HP6 prepared | cpu_back_right:cpu:ピグミィ L1 HP3 active

| branch | eval delta | applied | steps | winner | score | board | hp | stones | hand | monsters | decision | state |
|---|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---|---|
| selected | 0 | yes | 11 | - | -136 | -214 | 0 | 6 | 1 | 3-4 | summon:player_card_133_2->player_back_right | player HP10 S6 B492 H6 / cpu HP10 S0 B706 H5 / player_front_left:player:真勇者ダイン L1 HP2 active \| player_front_right:player:デスシープ L1 HP6 active \| player_back_left:player:デスシープ L1 HP6 active \| cpu_front_left:cpu:ドノマンティス L1 HP5 active \| cpu_front_right:cpu:デスシープ L2 HP3 active \| cpu_back_left:cpu:真勇者ダイン L1 HP6 active \| cpu_back_right:cpu:ピグミィ L1 HP3 active |
| attack_first | -3.8 | yes | 10 | - | 30 | -178 | 1 | 5 | 1 | 3-4 | attack:player_front_left:ダイン斬り->monster:cpu_front_left | player HP10 S6 B564 H6 / cpu HP9 S1 B742 H5 / player_front_left:player:真勇者ダイン L1 HP6 active \| player_front_right:player:デスシープ L1 HP6 active \| player_back_left:player:デスシープ L1 HP6 active \| cpu_front_left:cpu:ドノマンティス L1 HP4 active \| cpu_front_right:cpu:デスシープ L2 HP6 active \| cpu_back_left:cpu:真勇者ダイン L1 HP6 active \| cpu_back_right:cpu:ピグミィ L1 HP3 active |
| focus_only | -28.2 | yes | 9 | - | -239 | -337 | 0 | 8 | 1 | 3-4 | focus:player_front_left | player HP10 S8 B528 H6 / cpu HP10 S0 B865 H5 / player_front_left:player:真勇者ダイン L1 HP4 active \| player_front_right:player:デスシープ L1 HP6 active \| player_back_left:player:デスシープ L1 HP6 active \| cpu_front_left:cpu:ドノマンティス L1 HP5 active shield \| cpu_front_right:cpu:デスシープ L2 HP6 active \| cpu_back_left:cpu:真勇者ダイン L1 HP6 active \| cpu_back_right:cpu:ピグミィ L2 HP3 active |
| end_turn | -319.6 | yes | 4 | - | -376 | -464 | 0 | 7 | 1 | 2-4 | end_turn | player HP10 S9 B376 H6 / cpu HP10 S2 B840 H5 / player_front_left:player:真勇者ダイン L1 HP6 active \| player_back_left:player:デスシープ L1 HP6 active \| cpu_front_left:cpu:ドノマンティス L1 HP5 active \| cpu_front_right:cpu:デスシープ L2 HP6 active \| cpu_back_left:cpu:真勇者ダイン L1 HP6 active \| cpu_back_right:cpu:ピグミィ L2 HP3 active |

### seed 992100 step 164

pre: player HP10 S2 B696 H5 / cpu HP9 S3 B774 H5 / player_front_left:player:ピグミィ L2 HP3 active | player_front_right:player:デスシープ L2 HP6 active | player_back_right:player:ヤンバル L2 HP3 active | cpu_front_left:cpu:ピグミィ L1 HP3 active | cpu_front_right:cpu:真勇者ダイン L1 HP6 prepared | cpu_back_left:cpu:ヤンバル L2 HP3 active shield | cpu_back_right:cpu:真勇者ダイン L1 HP6 active shield

| branch | eval delta | applied | steps | winner | score | board | hp | stones | hand | monsters | decision | state |
|---|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---|---|
| selected | 0 | yes | 9 | - | 14 | -126 | 1 | 0 | 0 | 3-4 | summon:player_card_037_3->player_back_left | player HP10 S6 B652 H5 / cpu HP9 S6 B778 H5 / player_front_left:player:ピグミィ L2 HP3 active \| player_front_right:player:デスシープ L2 HP6 active \| player_back_left:player:ドノマンティス L1 HP5 active \| cpu_front_left:cpu:ヤンバル L2 HP3 active \| cpu_front_right:cpu:真勇者ダイン L1 HP6 active \| cpu_back_left:cpu:ボムゾウ L1 HP6 prepared \| cpu_back_right:cpu:真勇者ダイン L1 HP6 active |
| attack_first | -4 | yes | 9 | - | 14 | -126 | 1 | 0 | 0 | 3-4 | attack:player_back_right:wild_claw->monster:cpu_front_left | player HP10 S6 B652 H5 / cpu HP9 S6 B778 H5 / player_front_left:player:ピグミィ L2 HP3 active \| player_front_right:player:デスシープ L2 HP6 active \| player_back_left:player:ドノマンティス L1 HP5 active \| cpu_front_left:cpu:ヤンバル L2 HP3 active \| cpu_front_right:cpu:真勇者ダイン L1 HP6 active \| cpu_back_left:cpu:ボムゾウ L1 HP6 prepared \| cpu_back_right:cpu:真勇者ダイン L1 HP6 active |
| focus_only | -97 | yes | 10 | - | 74 | -126 | 1 | 6 | 0 | 3-4 | focus:player_back_right | player HP10 S6 B598 H5 / cpu HP9 S0 B724 H5 / player_front_left:player:ドノマンティス L1 HP5 active \| player_front_right:player:ヤンバル L2 HP3 active \| player_back_left:player:ピグミィ L2 HP3 active \| cpu_front_left:cpu:ピグミィ L1 HP3 active \| cpu_front_right:cpu:真勇者ダイン L1 HP6 active \| cpu_back_left:cpu:ヤンバル L2 HP3 active \| cpu_back_right:cpu:真勇者ダイン L1 HP6 active |
| end_turn | -196.8 | yes | 5 | - | -144 | -322 | 1 | 2 | 1 | 2-4 | end_turn | player HP10 S7 B482 H6 / cpu HP9 S5 B804 H5 / player_front_right:player:デスシープ L2 HP6 active \| player_back_right:player:ヤンバル L2 HP3 active \| cpu_front_left:cpu:真勇者ダイン L1 HP6 active \| cpu_front_right:cpu:真勇者ダイン L1 HP6 active \| cpu_back_left:cpu:ヤンバル L2 HP3 active \| cpu_back_right:cpu:ピグミィ L2 HP3 active |
