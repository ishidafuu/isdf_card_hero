# White Planner PDCA Loop

生成: 2026-07-04T17:38:26.620Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994300-994305
directions: challenger-as-cpu, challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | rollout3_60_w015_gap200 | 11-1-0 | 91.7% | 4.67 | 238.2 | 23.7 | 561.3 | 5127.9 | 0 | terminal上位3候補を60手rolloutし、80手版より判断時間を抑える |
| 2 | current | 11-1-0 | 91.7% | 4.67 | 238.2 | 23.7 | 561.5 | 5032 | 0 | 現行 white_planner |

## Action Counts

- rollout3_60_w015_gap200: attack 454, end_turn 275, focus 187, magic 14, master:master_attack 102, master:shield 118, master:wake_up 25, move 86, summon 183
- current: attack 454, end_turn 275, focus 187, magic 14, master:master_attack 102, master:shield 118, master:wake_up 25, move 86, summon 183

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| current | challenger-as-cpu | 994300 | white_planner | 284 | 28 | P0/C3 | - |
| current | challenger-as-cpu | 994301 | white_planner | 229 | 27 | P0/C5 | - |
| current | challenger-as-cpu | 994302 | white_planner | 223 | 27 | P0/C7 | - |
| current | challenger-as-cpu | 994303 | white_planner | 222 | 19 | P0/C6 | - |
| current | challenger-as-cpu | 994304 | white_planner | 266 | 23 | P0/C9 | - |
| current | challenger-as-cpu | 994305 | white_planner | 224 | 20 | P0/C7 | - |
| current | challenger-as-player | 994300 | white | 227 | 22 | P0/C6 | - |
| current | challenger-as-player | 994301 | white_planner | 113 | 12 | P9/C0 | - |
| current | challenger-as-player | 994302 | white_planner | 264 | 28 | P1/C0 | - |
| current | challenger-as-player | 994303 | white_planner | 242 | 23 | P7/C0 | - |
| current | challenger-as-player | 994304 | white_planner | 254 | 28 | P4/C0 | - |
| current | challenger-as-player | 994305 | white_planner | 310 | 27 | P4/C0 | - |
| rollout3_60_w015_gap200 | challenger-as-cpu | 994300 | white_planner | 284 | 28 | P0/C3 | - |
| rollout3_60_w015_gap200 | challenger-as-cpu | 994301 | white_planner | 229 | 27 | P0/C5 | - |
| rollout3_60_w015_gap200 | challenger-as-cpu | 994302 | white_planner | 223 | 27 | P0/C7 | - |
| rollout3_60_w015_gap200 | challenger-as-cpu | 994303 | white_planner | 222 | 19 | P0/C6 | - |
| rollout3_60_w015_gap200 | challenger-as-cpu | 994304 | white_planner | 266 | 23 | P0/C9 | - |
| rollout3_60_w015_gap200 | challenger-as-cpu | 994305 | white_planner | 224 | 20 | P0/C7 | - |
| rollout3_60_w015_gap200 | challenger-as-player | 994300 | white | 227 | 22 | P0/C6 | - |
| rollout3_60_w015_gap200 | challenger-as-player | 994301 | white_planner | 113 | 12 | P9/C0 | - |
| rollout3_60_w015_gap200 | challenger-as-player | 994302 | white_planner | 264 | 28 | P1/C0 | - |
| rollout3_60_w015_gap200 | challenger-as-player | 994303 | white_planner | 242 | 23 | P7/C0 | - |
| rollout3_60_w015_gap200 | challenger-as-player | 994304 | white_planner | 254 | 28 | P4/C0 | - |
| rollout3_60_w015_gap200 | challenger-as-player | 994305 | white_planner | 310 | 27 | P4/C0 | - |

## Conclusion

- best candidate: rollout3_60_w015_gap200 (11-1-0, WPR 91.7%, avg HP margin 4.67)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.
