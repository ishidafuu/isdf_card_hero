# White AI Action Order Audit

生成: 2026-06-27T22:06:55.867Z
候補: `current_white_baseline`
相手: black_pressure_strong, black_1375_pressure, white_current_mirror
seed: 83100-83103 / 各seat
close margin: 20

## Conclusion

- current_white_baseline: シールド 174件中、同一対象の後退候補あり 0件、後退が上回ったもの 0件、同ターン shield->retreat 0件。
- current_white_baseline: turn order は shield含み 163/386ターン、shield先行後にattack/wake 0件、attack/wake後にshield 135件、wake後attack 59件。

## Summary

| Variant | W-L-D | Steps | Turns | Shield | Shield Turns | Shield First | Shield Then Work | Work Then Shield | Retreat Alt | Shield->Retreat | Shield Attack Higher/Close | Shield Wake Higher/Close | Wake | Wake Attack Higher/Close | Wake Then Attack |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 7-17-0 | 1964 | 386 | 174 (8.9%) | 163 (42.2%) | 9 (5.5%) | 0 (0%) | 135 (82.8%) | 0 (0%) | 0 (0%) | 0 (0%) / 0 (0%) | 0 (0%) / 0 (0%) | 62 (3.2%) | 0 (0%) / 0 (0%) | 59 (15.3%) |

## Samples

### current_white_baseline

サンプルなし。


## Reading

- `Retreat Alt` は、シールド選択前の同一局面に同じ対象を前列から後列へ下げる移動候補が存在した件数。
- `Retreat Higher` は、その後退候補の評価点が選択されたシールドを上回った件数。
- `Retreat Close` は、選択シールドとの差が close margin 以内の件数。
- `Shield->Retreat` は、シールドした対象を同ターン中に後列へ下げた件数。行動順としては雑になりやすい。
- `Attack/Wake Higher/Close` は、シールドを選ぶ前に攻撃またはウェイクアップがどれくらい競合していたかの探索値。
- `Wake Attack Higher/Close` は、ウェイクアップを選んだ局面で、攻撃候補がどれくらい競合していたかの探索値。
- `Turn Order` では、実際の同一ターン内で shield の後に attack/wake したか、attack/wake の後に shield したかを見る。