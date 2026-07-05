# White Planner PDCA Loop

生成: 2026-07-05T01:40:56.593Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994306-994309
directions: challenger-as-cpu, challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | current | 6-2-0 | 75% | 2.5 | 250.1 | 23.6 | 906.9 | 78819.8 | 0 | 現行 white_planner |

## Action Counts

- current: attack 287, end_turn 182, focus 153, magic 8, master:master_attack 81, master:shield 71, master:wake_up 22, move 38, summon 125

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| current | challenger-as-cpu | 994306 | white_planner | 175 | 22 | P0/C6 | - |
| current | challenger-as-cpu | 994307 | white_planner | 297 | 28 | P0/C2 | - |
| current | challenger-as-cpu | 994308 | white_planner | 253 | 22 | P0/C7 | - |
| current | challenger-as-cpu | 994309 | white | 281 | 26 | P7/C0 | - |
| current | challenger-as-player | 994306 | white_planner | 281 | 27 | P5/C0 | - |
| current | challenger-as-player | 994307 | white_planner | 292 | 27 | P7/C0 | - |
| current | challenger-as-player | 994308 | white | 217 | 19 | P0/C6 | - |
| current | challenger-as-player | 994309 | white_planner | 205 | 18 | P6/C0 | - |

## Conclusion

- best candidate: current (6-2-0, WPR 75%, avg HP margin 2.5)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.
