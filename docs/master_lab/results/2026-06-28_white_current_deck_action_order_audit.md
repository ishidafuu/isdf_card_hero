# White AI Action Order Audit

生成: 2026-06-27T21:48:27.494Z
候補: `current_white_baseline`, `current_wake_safe_work4`, `current_threat_left_low_stone_guard`
相手: black_pressure_strong, black_1375_pressure, white_current_mirror
seed: 83000-83003 / 各seat
close margin: 20

## Conclusion

- current_white_baseline: シールド 170件中、同一対象の後退候補あり 0件、後退が上回ったもの 0件、同ターン shield->retreat 0件。
- current_wake_safe_work4: シールド 170件中、同一対象の後退候補あり 0件、後退が上回ったもの 0件、同ターン shield->retreat 0件。
- current_threat_left_low_stone_guard: シールド 167件中、同一対象の後退候補あり 0件、後退が上回ったもの 0件、同ターン shield->retreat 0件。
- current_threat_left_low_stone_guard: 参照候補より shield->retreat を減らせず勝数も伸びていないため、このままの行動順補正は採用見送り。

## Summary

| Variant | W-L-D | Steps | Shield | Retreat Alt | Retreat Higher | Retreat Close | Shield->Retreat | BackRole S->R | Shield Attack Higher/Close | Shield Wake Higher/Close | Wake | Wake Attack Higher/Close |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 7-17-0 | 1900 | 170 (8.9%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) / 0 (0%) | 0 (0%) / 0 (0%) | 55 (2.9%) | 0 (0%) / 1 (1.8%) |
| current_wake_safe_work4 | 8-16-0 | 1896 | 170 (9%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) / 0 (0%) | 0 (0%) / 0 (0%) | 55 (2.9%) | 0 (0%) / 1 (1.8%) |
| current_threat_left_low_stone_guard | 7-17-0 | 1915 | 167 (8.7%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) / 0 (0%) | 0 (0%) / 0 (0%) | 56 (2.9%) | 0 (0%) / 1 (1.8%) |

## Samples

### current_white_baseline

サンプルなし。

### current_wake_safe_work4

サンプルなし。

### current_threat_left_low_stone_guard

サンプルなし。


## Reading

- `Retreat Alt` は、シールド選択前の同一局面に同じ対象を前列から後列へ下げる移動候補が存在した件数。
- `Retreat Higher` は、その後退候補の評価点が選択されたシールドを上回った件数。
- `Retreat Close` は、選択シールドとの差が close margin 以内の件数。
- `Shield->Retreat` は、シールドした対象を同ターン中に後列へ下げた件数。行動順としては雑になりやすい。
- `Attack/Wake Higher/Close` は、シールドを選ぶ前に攻撃またはウェイクアップがどれくらい競合していたかの探索値。
- `Wake Attack Higher/Close` は、ウェイクアップを選んだ局面で、攻撃候補がどれくらい競合していたかの探索値。