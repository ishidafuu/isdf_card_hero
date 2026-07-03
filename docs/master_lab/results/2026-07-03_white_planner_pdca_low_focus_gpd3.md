# White Planner PDCA Loop

生成: 2026-07-03T14:43:40.864Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994300-994302
directions: challenger-as-cpu, challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | low_focus_conservative | 1-5-0 | 16.7% | -4.33 | 190.7 | 20.2 | 165.2 | 1506.7 | 0 | focus 終端価値を抑え、削り放棄を減らす |
| 2 | current | 1-5-0 | 16.7% | -5 | 187.3 | 19.2 | 164.6 | 1431.8 | 0 | 現行 white_planner |

## Action Counts

- low_focus_conservative: attack 154, end_turn 118, focus 73, magic 6, master:master_attack 46, master:shield 54, master:wake_up 7, move 28, summon 71
- current: attack 145, end_turn 112, focus 66, magic 7, master:master_attack 47, master:shield 56, master:wake_up 6, move 31, summon 66

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| current | challenger-as-cpu | 994300 | white_planner | 232 | 27 | P0/C1 | - |
| current | challenger-as-cpu | 994301 | white | 173 | 18 | P8/C0 | - |
| current | challenger-as-cpu | 994302 | white | 176 | 17 | P2/C0 | - |
| current | challenger-as-player | 994300 | white | 144 | 15 | P0/C9 | - |
| current | challenger-as-player | 994301 | white | 145 | 14 | P0/C2 | - |
| current | challenger-as-player | 994302 | white | 254 | 24 | P0/C10 | - |
| low_focus_conservative | challenger-as-cpu | 994300 | white_planner | 233 | 26 | P0/C2 | - |
| low_focus_conservative | challenger-as-cpu | 994301 | white | 153 | 17 | P10/C0 | - |
| low_focus_conservative | challenger-as-cpu | 994302 | white | 176 | 17 | P2/C0 | - |
| low_focus_conservative | challenger-as-player | 994300 | white | 144 | 15 | P0/C9 | - |
| low_focus_conservative | challenger-as-player | 994301 | white | 174 | 17 | P0/C6 | - |
| low_focus_conservative | challenger-as-player | 994302 | white | 264 | 29 | P0/C1 | - |

## Conclusion

- best candidate: low_focus_conservative (1-5-0, WPR 16.7%, avg HP margin -4.33)
- No candidate beat the current white baseline in this sample. Keep white_planner experimental and tighten adoption around clearly winning planner differences.
