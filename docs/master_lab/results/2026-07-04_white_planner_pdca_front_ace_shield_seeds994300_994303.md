# White Planner PDCA Loop

生成: 2026-07-04T12:43:55.139Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994300-994303
directions: challenger-as-cpu, challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | current | 7-1-0 | 87.5% | 4.38 | 203 | 20.4 | 465.1 | 5046.7 | 0 | 現行 white_planner |

## Action Counts

- current: attack 260, end_turn 155, focus 99, magic 8, master:master_attack 61, master:shield 68, master:wake_up 12, move 44, summon 107

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| current | challenger-as-cpu | 994300 | white | 182 | 18 | P2/C0 | - |
| current | challenger-as-cpu | 994301 | white_planner | 198 | 18 | P0/C6 | - |
| current | challenger-as-cpu | 994302 | white_planner | 223 | 27 | P0/C7 | - |
| current | challenger-as-cpu | 994303 | white_planner | 222 | 19 | P0/C6 | - |
| current | challenger-as-player | 994300 | white_planner | 180 | 18 | P1/C0 | - |
| current | challenger-as-player | 994301 | white_planner | 113 | 12 | P9/C0 | - |
| current | challenger-as-player | 994302 | white_planner | 264 | 28 | P1/C0 | - |
| current | challenger-as-player | 994303 | white_planner | 242 | 23 | P7/C0 | - |

## Conclusion

- best candidate: current (7-1-0, WPR 87.5%, avg HP margin 4.38)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.
