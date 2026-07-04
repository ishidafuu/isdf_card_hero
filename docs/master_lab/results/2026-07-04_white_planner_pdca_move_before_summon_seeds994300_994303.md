# White Planner PDCA Loop

生成: 2026-07-04T13:35:21.729Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994300-994303
directions: challenger-as-cpu, challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | current | 7-1-0 | 87.5% | 4 | 225.5 | 23.3 | 491.6 | 5049 | 0 | 現行 white_planner |

## Action Counts

- current: attack 283, end_turn 179, focus 112, magic 8, master:master_attack 69, master:shield 83, master:wake_up 9, move 49, summon 116

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| current | challenger-as-cpu | 994300 | white_planner | 284 | 28 | P0/C3 | - |
| current | challenger-as-cpu | 994301 | white_planner | 229 | 27 | P0/C5 | - |
| current | challenger-as-cpu | 994302 | white_planner | 223 | 27 | P0/C7 | - |
| current | challenger-as-cpu | 994303 | white_planner | 222 | 19 | P0/C6 | - |
| current | challenger-as-player | 994300 | white | 227 | 22 | P0/C6 | - |
| current | challenger-as-player | 994301 | white_planner | 113 | 12 | P9/C0 | - |
| current | challenger-as-player | 994302 | white_planner | 264 | 28 | P1/C0 | - |
| current | challenger-as-player | 994303 | white_planner | 242 | 23 | P7/C0 | - |

## Conclusion

- best candidate: current (7-1-0, WPR 87.5%, avg HP margin 4)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.
