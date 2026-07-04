# White Planner PDCA Loop

生成: 2026-07-04T09:40:48.882Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994304-994304
directions: challenger-as-cpu

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | response_root_neutral_margin0 | 1-0-0 | 100% | 1 | 304 | 30 | 730.6 | 3674.3 | 0 | root補正なし。応答評価が同点以上なら採用する対象局面追試候補 |

## Action Counts

- response_root_neutral_margin0: attack 31, end_turn 29, focus 28, magic 2, master:master_attack 15, master:shield 10, move 9, summon 19

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| response_root_neutral_margin0 | challenger-as-cpu | 994304 | white_planner | 304 | 30 | P0/C1 | - |

## Conclusion

- best candidate: response_root_neutral_margin0 (1-0-0, WPR 100%, avg HP margin 1)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.
