# White Planner PDCA Loop

生成: 2026-07-04T11:14:55.144Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994300-994303
directions: challenger-as-cpu, challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | response_setup_over_focus_t9 | 7-1-0 | 87.5% | 3.38 | 241.9 | 23.9 | 506.1 | 5013.1 | 0 | turn9以降、fallbackがfocusの時だけsetup候補を応答評価で比較する |
| 2 | current | 7-1-0 | 87.5% | 3.25 | 239.1 | 23.6 | 505.9 | 5050.5 | 0 | 現行 white_planner |

## Action Counts

- response_setup_over_focus_t9: attack 297, end_turn 184, focus 129, magic 7, master:master_attack 74, master:shield 75, master:wake_up 16, move 49, summon 124
- current: attack 289, end_turn 182, focus 128, magic 7, master:master_attack 75, master:shield 73, master:wake_up 16, move 48, summon 123

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| current | challenger-as-cpu | 994300 | white | 234 | 21 | P6/C0 | - |
| current | challenger-as-cpu | 994301 | white_planner | 198 | 18 | P0/C6 | - |
| current | challenger-as-cpu | 994302 | white_planner | 327 | 28 | P0/C2 | - |
| current | challenger-as-cpu | 994303 | white_planner | 222 | 19 | P0/C6 | - |
| current | challenger-as-player | 994300 | white_planner | 220 | 26 | P2/C0 | - |
| current | challenger-as-player | 994301 | white_planner | 206 | 26 | P8/C0 | - |
| current | challenger-as-player | 994302 | white_planner | 264 | 28 | P1/C0 | - |
| current | challenger-as-player | 994303 | white_planner | 242 | 23 | P7/C0 | - |
| response_setup_over_focus_t9 | challenger-as-cpu | 994300 | white | 256 | 23 | P5/C0 | - |
| response_setup_over_focus_t9 | challenger-as-cpu | 994301 | white_planner | 198 | 18 | P0/C6 | - |
| response_setup_over_focus_t9 | challenger-as-cpu | 994302 | white_planner | 327 | 28 | P0/C2 | - |
| response_setup_over_focus_t9 | challenger-as-cpu | 994303 | white_planner | 222 | 19 | P0/C6 | - |
| response_setup_over_focus_t9 | challenger-as-player | 994300 | white_planner | 220 | 26 | P2/C0 | - |
| response_setup_over_focus_t9 | challenger-as-player | 994301 | white_planner | 206 | 26 | P8/C0 | - |
| response_setup_over_focus_t9 | challenger-as-player | 994302 | white_planner | 264 | 28 | P1/C0 | - |
| response_setup_over_focus_t9 | challenger-as-player | 994303 | white_planner | 242 | 23 | P7/C0 | - |

## Conclusion

- best candidate: response_setup_over_focus_t9 (7-1-0, WPR 87.5%, avg HP margin 3.38)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.
