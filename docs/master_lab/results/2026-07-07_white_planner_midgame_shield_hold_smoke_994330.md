# White Planner PDCA Loop

生成: 2026-07-06T17:35:34.346Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994330-994332
directions: challenger-as-cpu, challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | current | 4-2-0 | 66.7% | 3.17 | 224.5 | 25.8 | 749.7 | 7553.7 | 0 | 現行 white_planner |

## Action Counts

- current: attack 212, end_turn 149, focus 80, magic 3, master:master_attack 41, master:shield 63, master:wake_up 17, move 18, summon 84

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| current | challenger-as-cpu | 994330 | white_planner | 271 | 26 | P0/C9 | - |
| current | challenger-as-cpu | 994331 | white_planner | 224 | 30 | P0/C1 | - |
| current | challenger-as-cpu | 994332 | white | 198 | 27 | P8/C0 | - |
| current | challenger-as-player | 994330 | white_planner | 265 | 27 | P8/C0 | - |
| current | challenger-as-player | 994331 | white | 224 | 30 | P0/C1 | - |
| current | challenger-as-player | 994332 | white_planner | 165 | 15 | P10/C0 | - |

## Conclusion

- best candidate: current (4-2-0, WPR 66.7%, avg HP margin 3.17)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.
