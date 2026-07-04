# White Planner PDCA Loop

生成: 2026-07-04T09:43:02.047Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994305-994305
directions: challenger-as-cpu

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | response_root_neutral_margin0 | 1-0-0 | 100% | 8 | 242 | 21 | 711.3 | 5603 | 0 | root補正なし。応答評価が同点以上なら採用する対象局面追試候補 |

## Action Counts

- response_root_neutral_margin0: attack 43, end_turn 20, focus 14, magic 1, master:master_attack 6, master:shield 13, master:wake_up 1, move 3, summon 16

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| response_root_neutral_margin0 | challenger-as-cpu | 994305 | white_planner | 242 | 21 | P0/C8 | - |

## Conclusion

- best candidate: response_root_neutral_margin0 (1-0-0, WPR 100%, avg HP margin 8)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.
