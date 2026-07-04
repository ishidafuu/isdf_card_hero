# White Planner PDCA Loop

生成: 2026-07-04T05:06:29.330Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994306-994306
directions: challenger-as-cpu

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | rollout3_60_w015_gap200 | 1-0-0 | 100% | 6 | 175 | 22 | 569.6 | 4713.7 | 0 | terminal上位3候補を60手rolloutし、80手版より判断時間を抑える |
| 2 | current | 1-0-0 | 100% | 6 | 175 | 22 | 574.8 | 4654.5 | 0 | 現行 white_planner |

## Action Counts

- rollout3_60_w015_gap200: attack 27, end_turn 21, focus 7, master:master_attack 4, master:shield 10, master:wake_up 2, move 1, summon 12
- current: attack 27, end_turn 21, focus 7, master:master_attack 4, master:shield 10, master:wake_up 2, move 1, summon 12

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| current | challenger-as-cpu | 994306 | white_planner | 175 | 22 | P0/C6 | - |
| rollout3_60_w015_gap200 | challenger-as-cpu | 994306 | white_planner | 175 | 22 | P0/C6 | - |

## Conclusion

- best candidate: rollout3_60_w015_gap200 (1-0-0, WPR 100%, avg HP margin 6)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.
