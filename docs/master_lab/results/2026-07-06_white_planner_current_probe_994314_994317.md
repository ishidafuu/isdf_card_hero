# White Planner PDCA Loop

生成: 2026-07-05T18:19:20.153Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994314-994317
directions: challenger-as-cpu, challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | current | 6-2-0 | 75% | 3.38 | 253 | 25.3 | 1061.8 | 87133.9 | 0 | 現行 white_planner |

## Action Counts

- current: attack 293, end_turn 195, focus 162, magic 14, master:master_attack 62, master:shield 72, master:wake_up 22, move 22, summon 123

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| current | challenger-as-cpu | 994314 | white_planner | 194 | 21 | P0/C2 | - |
| current | challenger-as-cpu | 994315 | white_planner | 318 | 29 | P0/C2 | - |
| current | challenger-as-cpu | 994316 | white_planner | 218 | 20 | P0/C4 | - |
| current | challenger-as-cpu | 994317 | white | 220 | 24 | P2/C0 | - |
| current | challenger-as-player | 994314 | white_planner | 222 | 29 | P7/C0 | - |
| current | challenger-as-player | 994315 | white_planner | 311 | 26 | P9/C0 | - |
| current | challenger-as-player | 994316 | white | 309 | 30 | P0/C1 | - |
| current | challenger-as-player | 994317 | white_planner | 232 | 23 | P6/C0 | - |

## Conclusion

- best candidate: current (6-2-0, WPR 75%, avg HP margin 3.38)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.
